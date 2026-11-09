#!/usr/bin/env node

import { existsSync, readFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const read = (path) => readFileSync(resolve(root, path), "utf8");
const json = (path) => JSON.parse(read(path));
const fail = (message) => {
  throw new Error(message);
};

const pluginPath =
  "plugins/fidelity-studio-content-assistant/.codex-plugin/plugin.json";
const mcpPath = "plugins/fidelity-studio-content-assistant/.mcp.json";
const marketplacePath = ".agents/plugins/marketplace.json";
const guidePath = "docs/client-guide-de.md";
const windowsSetupPath = "scripts/setup-windows.ps1";
const skillPath =
  "plugins/fidelity-studio-content-assistant/skills/fidelity-studio-content-assistant/SKILL.md";

const plugin = json(pluginPath);
const mcp = json(mcpPath);
const marketplace = json(marketplacePath);
const guide = read(guidePath);
const windowsSetup = read(windowsSetupPath);
const skill = read(skillPath);
const expectedVersion = "0.5.1";

if (plugin.version !== expectedVersion) {
  fail(`Expected plugin version ${expectedVersion}, received ${plugin.version}.`);
}
if (!read("CHANGELOG.md").includes(`## ${expectedVersion} - `)) {
  fail(`CHANGELOG.md must have an entry for ${expectedVersion}.`);
}
if (
  mcp.mcpServers?.["fidelity-studio-content-assistant"]?.oauth_resource
  != null
) {
  fail("Do not set oauth_resource explicitly; Codex discovers it from the MCP server.");
}
if (marketplace.plugins?.[0]?.source?.path !== "./plugins/fidelity-studio-content-assistant") {
  fail("Marketplace source does not point to the bundled plugin.");
}

for (const key of ["composerIcon", "logo", "logoDark"]) {
  const relativePath = plugin.interface?.[key];
  if (typeof relativePath !== "string") fail(`Missing ${key} in plugin manifest.`);
  const absolutePath = resolve(root, "plugins/fidelity-studio-content-assistant", relativePath);
  if (!existsSync(absolutePath)) fail(`${key} does not resolve to an existing file.`);
}

const setupPath = "docs/setup.md";
const setup = read(setupPath);
const setupUrl = "https://mcp.fidelitystudio.ch/setup.md";
if (!guide.includes(setupUrl) || !read("README.md").includes(setupUrl)) {
  fail(`The guide and README must give clients the short setup sentence with ${setupUrl}.`);
}
if (setup.includes("ß")) fail("docs/setup.md must not contain ß.");
for (const phrase of [
  "scripts/setup-windows.ps1",
  "codex plugin marketplace add fsmventures/fidelity-studio-content-assistant --ref main --json",
  "codex plugin marketplace upgrade fidelity-studio-content-assistant --json",
  "codex plugin add fidelity-studio-content-assistant@fidelity-studio-content-assistant --json",
  "codex mcp list --json",
  "codex mcp login fidelity-studio-content-assistant",
  "get_project_context",
  "new Work task",
]) {
  if (!setup.includes(phrase)) fail(`docs/setup.md is missing "${phrase}".`);
}
if (guide.includes("ß")) fail("The Swiss German guide must not contain ß.");
if (/\b(fuer|ueber|oeffnen|pruefen|zurueck|vollstaendig)\b/i.test(guide)) {
  fail("The German guide contains an avoidable umlaut transliteration.");
}
if (/\bmarkus[^\s@]*@[^\s]+/i.test(guide)) {
  fail("The public guide must not contain a maintainer email address.");
}
// A new Work task alone does not load an install or sign-in made from the
// shell (Mac mini test, 9 Nov 2026). Setup ends with a full app restart, and
// the assistant never asks for a second new task.
const finishAt = setup.indexOf("## 4. Finish");
const finish = finishAt < 0 ? "" : setup.slice(finishAt);
const quitAt = finish.search(/quit the app completely and reopen it/i);
const newTaskAt = finish.indexOf("new Work task");
if (quitAt < 0 || newTaskAt < 0 || quitAt > newTaskAt) {
  fail("docs/setup.md step 4 must tell the client to quit the app completely and reopen it before the new Work task.");
}
if (!guide.includes("Beende die App ganz (⌘Q) und öffne sie wieder.") || !guide.includes("neue Work-Aufgabe")) {
  fail("The guide must restart the app completely before the new Work task.");
}
if (!/Never ask for a\s+new task twice\./.test(skill) || !skill.includes("quit the app completely")) {
  fail("The skill must ask for a full app restart instead of a second new task.");
}
const disprovedRestartRule = [
  /mounted when a\s+(new\s+)?task\s+is\s+(created|started)/i,
  /restart[^.]*only (needed|a fallback)/i,
  /only a fallback/i,
  /normalerweise nicht beenden/i,
  /Neustart der App ist nur nötig/i,
  /reicht nach einer\s+Installation oder Anmeldung normalerweise/i,
];
for (const [name, text] of [
  ["skill", skill],
  ["README.md", read("README.md")],
  ["AGENTS.md", read("AGENTS.md")],
  ["German guide", guide],
  ["docs/setup.md", setup],
  ["docs/maintenance.md", read("docs/maintenance.md")],
  ["Windows bootstrap", windowsSetup],
]) {
  const match = disprovedRestartRule.find((pattern) => pattern.test(text));
  if (match) {
    fail(`${name} must not say a new task alone loads new tools or that a restart is only a fallback (matched ${match}).`);
  }
}
if (
  !guide.includes("get_project_context")
  || !guide.includes("Anbieter ausdrücklich Resend")
) {
  fail("The guide must load authenticated project context before requiring Resend.");
}
if (
  !windowsSetup.includes("https://chatgpt.com/codex/install.ps1")
  || !windowsSetup.includes("\\WindowsApps\\")
  || !windowsSetup.includes("Git.Git")
  || !windowsSetup.includes("plugin marketplace upgrade")
  || !windowsSetup.includes("mcp list --json")
  || !windowsSetup.includes(`$ExpectedPluginVersion = "${expectedVersion}"`)
) {
  fail("The Windows bootstrap is missing a required Codex, Git, upgrade, or verification guard.");
}
if (/Set-ExecutionPolicy|npm\s+install|npm\.cmd|winget[^\n]+Node/i.test(windowsSetup)) {
  fail("The Windows bootstrap must not change execution policy or install Node/npm for Codex.");
}
if (!windowsSetup.includes("Approval mode or sandbox elevation does not repair this file ACL")) {
  fail("The Windows bootstrap must not present approval or sandbox mode as an ACL repair.");
}
for (const [name, instructions] of [["skill", skill], ["English quick start", read("README.md")], ["German quick start", guide]]) {
  for (const tool of ["get_project_context", "list_entries", "list_blog_posts", "list_team_members"]) {
    if (!instructions.includes(tool)) fail(`${name} must cover project-specific verification with ${tool}.`);
  }
}
if (skill.includes("anything else → follow the Blog And Team Workflow")) fail("Unknown website workflows must follow authenticated tools.");
if (!skill.includes("list_blog_posts")) {
  fail("The skill must cover blog inventory reads.");
}
if (
  !skill.includes("Only require Resend")
  || !skill.includes("get_project_context` first")
) {
  fail("The skill must make Resend conditional on authenticated project context.");
}
if (!skill.includes("idempotency key")) {
  fail("The skill must preserve production deployment idempotency.");
}
// Fidelity Studio decision, 5 Nov 2026: clients publish live by asking in the
// chat. No approval page, link or click outside the chat, for any client.
for (const phrase of [
  "deploy_project_to_production",
  "REQUEST_PRODUCTION_APPROVAL",
  "get_project_deployment_status",
  "deployment ID",
  "ready=true",
  "current conversation",
  "Publishing happens entirely in this chat.",
]) {
  if (!skill.includes(phrase)) {
    fail(`The skill must publish via deploy_project_to_production after an explicit request in the chat and poll until ready (missing "${phrase}").`);
  }
}
const approvalStep = [
  /approval[\s-]+(url|page|link|request)/i,
  /server-owned/i,
  /cms\.fidelitystudio\.ch/i,
  /jetzt live veröffentlichen/i,
  /\bfreigabe/i,
];
for (const [name, text] of [
  ["skill", skill],
  ["README.md", read("README.md")],
  ["German guide", guide],
  ["docs/setup.md", setup],
  ["docs/maintenance.md", read("docs/maintenance.md")],
  ["plugin manifest", read(pluginPath)],
  [".mcp.json", read(mcpPath)],
]) {
  const match = approvalStep.find((pattern) => pattern.test(text));
  if (match) {
    fail(`${name} must not describe an approval page, link or step outside the chat (matched ${match}).`);
  }
}
if (skill.includes("deploy:production")) {
  fail("The skill must not name a deploy:production scope; the Fidelity Studio server defines the publishing capability.");
}

console.log("Plugin validation passed.");
