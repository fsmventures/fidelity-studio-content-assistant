import assert from 'node:assert/strict';
import { spawn } from 'node:child_process';
import { createHash } from 'node:crypto';
import { createServer } from 'node:http';
import { readFile, readdir } from 'node:fs/promises';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';
import test from 'node:test';
import { uploadLocalPhoto, withCodexRpc } from '../plugins/fidelity-studio-content-assistant/scripts/upload-local-photo.mjs';

const file = fileURLToPath(new URL('../plugins/fidelity-studio-content-assistant/assets/fidelity-studio-icon.png', import.meta.url));
const options = { project: 'test-website', file, alt: 'Testbild' };
const text = value => ({ content: [{ type: 'text', text: JSON.stringify(value) }] });

test('a mismatched project or lacking media access fails before opening the file', async () => {
  for (const context of [{ project: { id: 'different' }, tools: ['upload_local_project_photo'] }, { project: { id: options.project }, tools: ['get_entry'] }]) {
    const calls = [];
    const connect = run => run(async name => { calls.push(name); return text(context); });
    await assert.rejects(uploadLocalPhoto({ ...options, file: '/nonexistent/proof-of-order.png' }, connect), /does not match|does not offer/);
    assert.deepEqual(calls, ['get_project_context']);
  }
});

test('installed Codex transports a real local PNG through direct MCP without a model turn', { timeout: 65000 }, async () => {
  const expected = await readFile(file);
  const hash = createHash('sha256').update(expected).digest('hex');
  const calls = []; const diagnostics = [];
  let diagnosticsCheck;
  const fixture = createServer(async (request, response) => {
    if (request.method !== 'POST') return response.writeHead(405).end();
    const chunks = []; for await (const chunk of request) chunks.push(chunk);
    const message = JSON.parse(Buffer.concat(chunks));
    if (message.id === undefined) return response.writeHead(202).end();
    let result;
    if (message.method === 'initialize') result = { protocolVersion: message.params.protocolVersion, capabilities: { tools: {} }, serverInfo: { name: 'local-fixture', version: '1' } };
    else if (message.method === 'tools/list') result = { tools: ['get_project_context','upload_local_project_photo'].map(name => ({ name, inputSchema: { type: 'object' } })) };
    else if (message.method === 'tools/call') {
      const { name, arguments: args, _meta } = message.params; calls.push(name);
      if (name === 'get_project_context') result = text({ project: { id: options.project }, tools: ['upload_local_project_photo'] });
      else {
        assert.equal(name, 'upload_local_project_photo');assert.equal(args.expectedProjectId, options.project);assert.equal(args.sourceSha256, hash);
        assert.deepEqual(Object.keys(args).sort(), ['alt','destination','expectedProjectId','sourceSha256']);
        assert.ok(Buffer.from(_meta['ch.fidelitystudio/photo-base64'], 'base64').equals(expected));
        const path = `src/assets/cms/photo-${hash}.webp`;
        result = text({ path, image: { src: path, alt: options.alt, width: 64, height: 64 }, sha: 'a'.repeat(40), extra: 'private-test-response-field' });
      }
    } else result = {};
    response.writeHead(200, { 'content-type': 'application/json' }).end(JSON.stringify({ id: message.id, jsonrpc: '2.0', result }));
  });
  await new Promise(resolve => fixture.listen(0, '127.0.0.1', resolve));
  try {
    const port = fixture.address().port;
    const launchFixture = (command, args, spawnOptions) => {
      const pinned = 'https://mcp.fidelitystudio.ch/mcp';
      assert.equal(args.filter(arg => arg.includes(pinned)).length, 1);
      assert.equal(spawnOptions.stdio[2], 'ignore');
      const child = spawn(command, args.map(arg => arg.replace(pinned, `http://127.0.0.1:${port}/mcp`)), spawnOptions);
      // Inspect the ephemeral diagnostics before the normal helper cleanup removes them.
      diagnosticsCheck = async () => {
        async function scan(directory) {
          for (const item of await readdir(directory, { withFileTypes: true })) {
            const path = join(directory, item.name);
            if (item.isDirectory()) await scan(path);
            else if (item.isFile()) { const content = await readFile(path); diagnostics.push(item.name); assert.equal(content.includes(expected.subarray(96,224)),false); assert.equal(content.includes(expected.toString('base64').slice(128,320)),false); }
          }
        }
        await scan(spawnOptions.cwd);
      };
      return child;
    };
    const result = await uploadLocalPhoto(options, visit => withCodexRpc(async call => { const result = await visit(call); await diagnosticsCheck(); return result; }, launchFixture));
    assert.deepEqual(calls, ['get_project_context','upload_local_project_photo']);assert.ok(diagnostics.length > 0);
    assert.equal(Object.hasOwn(result,'extra'), false);assert.equal(JSON.stringify(result).includes(expected.toString('base64').slice(128,320)), false);
  } finally { fixture.closeAllConnections(); await new Promise(resolve => fixture.close(resolve)); }
});
