#!/usr/bin/env node
import { createHash } from 'node:crypto';
import { spawn } from 'node:child_process';
import { constants, realpathSync } from 'node:fs';
import { lstat, mkdtemp, open, rm } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { isAbsolute, join, resolve } from 'node:path';
import { createInterface } from 'node:readline';
import { fileURLToPath } from 'node:url';
import { prepareLocalPhoto, sourceLimit, PhotoError } from './prepare-local-photo.mjs';

const server = 'fidelity-studio-content-assistant';
const url = 'https://mcp.fidelitystudio.ch/mcp';
const tool = 'upload_local_project_photo';
class HelperError extends Error {}

function receipt(result) {
  if (result?.isError || result?.content?.[0]?.type !== 'text') throw new HelperError('The assistant could not complete this operation. Check website access in Work.');
  try { return JSON.parse(result.content[0].text); }
  catch { throw new HelperError('The assistant returned an unreadable response.'); }
}

/** A short-lived Codex process owns the normal MCP OAuth connection. No model turn is created. */
export async function withCodexRpc(visit, launch = spawn) {
  const scratch = await mkdtemp(join(tmpdir(), 'fs-photo-rpc-'));
  let child;
  let closed;
  const pending = new Map();
  let id = 0;
  try {
    const config = ['history.persistence="none"', 'analytics.enabled=false', 'feedback.enabled=false',
      'otel.exporter="none"', 'otel.trace_exporter="none"', 'otel.metrics_exporter="none"',
      `log_dir=${JSON.stringify(scratch)}`, `sqlite_home=${JSON.stringify(scratch)}`,
      `mcp_servers={${server}={url=${JSON.stringify(url)}}}`];
    child = launch('codex', ['app-server', '--listen', 'stdio://', ...config.flatMap(value => ['-c', value])], {
      cwd: scratch, env: { ...process.env, RUST_LOG: 'off', OTEL_SDK_DISABLED: 'true' }, stdio: ['pipe', 'pipe', 'ignore'], windowsHide: true,
    });
    closed = new Promise(done => child.once('close', done));
    const fail = () => { for (const finish of pending.values()) finish(null); pending.clear(); };
    child.on('error', fail); child.on('close', fail); child.stdin.on('error', fail);
    const lines = createInterface({ input: child.stdout });
    lines.on('line', line => {
      let message;
      try { message = JSON.parse(line); } catch { return; }
      pending.get(message.id)?.(message);
    });
    const rpc = (method, params) => new Promise((done, reject) => {
      const requestId = ++id;
      const finish = response => {
        clearTimeout(timer); pending.delete(requestId);
        if (!response || response.error) reject(new HelperError('Codex could not complete the direct MCP request. Check the installed CLI and existing website sign-in.'));
        else done(response.result);
      };
      const timer = setTimeout(() => finish(null), 45000);
      pending.set(requestId, finish);
      child.stdin.write(JSON.stringify({ id: requestId, method, params }) + '\n', error => { if (error) finish(null); });
    });
    await rpc('initialize', { clientInfo: { name: 'fidelity-studio-photo-helper', version: '1' } });
    child.stdin.write('{"method":"initialized"}\n');
    const { thread } = await rpc('thread/start', { cwd: scratch, ephemeral: true, approvalPolicy: 'never', sandbox: 'read-only' });
    return await visit((name, args, meta) => rpc('mcpServer/tool/call', { server, threadId: thread.id, tool: name, arguments: args, ...(meta ? { _meta: meta } : {}) }));
  } finally {
    if (child) { child.stdin.end(); child.kill(); await closed; }
    await rm(scratch, { recursive: true, force: true, maxRetries: 2 });
  }
}

async function readPhoto(path) {
  if (!isAbsolute(path)) throw new HelperError('Use the absolute path of the explicitly selected photo.');
  const before = await lstat(path);
  if (!before.isFile() || before.isSymbolicLink()) throw new HelperError('Select a regular photo file.');
  const handle = await open(path, constants.O_RDONLY | (constants.O_NOFOLLOW ?? 0) | (constants.O_NONBLOCK ?? 0));
  try {
    const info = await handle.stat();
    if (!info.isFile() || info.size < 12 || info.size > sourceLimit) throw new HelperError('Select a supported still photo up to 50 MiB.');
    const bytes = Buffer.alloc(info.size + 1);
    let total = 0;
    while (total < bytes.length) {
      const { bytesRead } = await handle.read(bytes, total, bytes.length - total, total);
      if (!bytesRead) break;
      total += bytesRead;
    }
    if (total !== info.size || (await handle.stat()).mtimeMs !== info.mtimeMs) throw new HelperError('The selected photo changed during reading. Select it again.');
    const original = bytes.subarray(0, total);
    let prepared;
    try { prepared = await prepareLocalPhoto(original); return prepared; }
    finally { if (prepared !== original) bytes.fill(0); }
  } finally { await handle.close(); }
}

export async function uploadLocalPhoto({ project, file, alt, destination = 'projects' }, connect = withCodexRpc) {
  if (typeof project !== 'string' || !project || project.length > 128 || typeof alt !== 'string' || !alt.trim() || alt.length > 1000 || !['projects','pages'].includes(destination)) throw new HelperError('Provide the authenticated project ID, photo description and a valid destination.');
  alt = alt.trim(); // Match the server's input normalization before comparing the stored receipt.
  return connect(async call => {
    const context = receipt(await call('get_project_context', {}));
    if (context?.project?.id !== project) throw new HelperError('The signed-in website does not match this project. No photo was read.');
    if (!Array.isArray(context?.tools) || !context.tools.includes(tool)) throw new HelperError('The current website access does not offer local photo uploads.');
    const bytes = await readPhoto(file);
    const sourceSha256 = createHash('sha256').update(bytes).digest('hex');
    let result;
    try {
      result = receipt(await call(tool, { expectedProjectId: project, sourceSha256, destination, alt }, { 'ch.fidelitystudio/photo-base64': bytes.toString('base64') }));
    } finally { bytes.fill(0); }
    const root = destination === 'pages' ? 'static' : 'cms';
    const canonical = new RegExp(`^src/assets/${root}/photo-[a-f0-9]{64}\\.webp$`);
    if (typeof result?.path !== 'string' || !canonical.test(result.path) || result?.image?.src !== result.path || result?.image?.alt !== alt || !/^[a-f0-9]{40}$/.test(result?.sha)) throw new HelperError('The assistant returned an unexpected upload receipt. Check the website media before retrying.');
    // Only return reconstructed fields the editor needs. Never echo raw tool errors, metadata or input bytes.
    const image = { src: result.path, alt };
    if (root === 'cms') {
      if (![result.image.width, result.image.height].every(n => Number.isInteger(n) && n > 0 && n <= 2560)) throw new HelperError('Unexpected photo dimensions in the receipt.');
      Object.assign(image, { width: result.image.width, height: result.image.height, format: 'webp' });
    }
    return { image, sha: result.sha, reused: result.reused === true };
  });
}

function invokedAsMain() {
  try { return Boolean(process.argv[1]) && realpathSync(resolve(process.argv[1])) === fileURLToPath(import.meta.url); }
  catch { return false; } // Importing from stdin has no filesystem entry point.
}

if (invokedAsMain()) {
  try {
    const options = {}; const args = process.argv.slice(2);
    for (let i = 0; i < args.length; i += 2) {
      const key = args[i];
      if (!['--project', '--file', '--alt', '--destination'].includes(key) || !args[i + 1] || Object.hasOwn(options, key.slice(2))) throw new HelperError('Expected --project ID --file PATH --alt DESCRIPTION [--destination projects|pages].');
      options[key.slice(2)] = args[i + 1];
    }
    if (!options.file) throw new HelperError('Provide the selected photo with --file.');
    console.log(JSON.stringify(await uploadLocalPhoto(options)));
  } catch (error) {
    console.error((error instanceof HelperError || error instanceof PhotoError) ? error.message : 'Local photo transfer failed. Use the Pages CMS media library, then ask the assistant to attach the saved reference.');
    process.exitCode = 1;
  }
}
