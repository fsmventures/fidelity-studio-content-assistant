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
const expectedVersion = "0.5.2";

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
// 23 Nov 2026: ChatGPT's web tool answers «not accessible via this tool» for
// every mcp.fidelitystudio.ch URL. The sentence still names our own address
// (Markus: «we can use the nice setup URL»); the local chat loads it with curl,
// and the guide tells it to read itself in the shell.
const setupUrl = "https://mcp.fidelitystudio.ch/setup.md";
const setupSentence = `Richte den Fidelity Studio Content Assistant auf meinem Computer ein und folge dazu der Anleitung ${setupUrl}`;
if (!guide.includes(setupSentence) || !read("README.md").includes(setupSentence)) {
  fail(`The guide and README must give clients the setup sentence «${setupSentence}».`);
}
if (!setup.includes("curl -fsSL https://mcp.fidelitystudio.ch/setup.md") || !setup.includes("irm https://mcp.fidelitystudio.ch/setup.md")
  || !/not with a web or browser tool/.test(setup)) {
  fail("docs/setup.md must tell the chat to read the guide in the shell (curl / irm), not with the web tool.");
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
  "https://mcp.fidelitystudio.ch/start",
  "https://mcp.fidelitystudio.ch/chat",
]) {
  if (!setup.includes(phrase)) fail(`docs/setup.md is missing "${phrase}".`);
}
// 23 Nov 2026: a setup started in a cloud or browser task ran for a while,
// found the Codex settings read-only and then tried a throwaway install. The
// guide must check where it runs and write the Codex home folder before any
// install, stop with plain client steps otherwise, and never work around it.
const localCheckAt = setup.indexOf("## First: check that this task runs on the person's computer");
const installAt = setup.indexOf("## 1. Install or update the plugin");
const localCheck = localCheckAt < 0 || installAt < localCheckAt ? "" : setup.slice(localCheckAt, installAt);
for (const phrase of [
  ".fidelity-studio-write-test",
  "CODEX_HOME",
  "approval to run it outside the sandbox",
  "Do not point `CODEX_HOME` at another folder",
  "do not install into a temporary folder",
  "https://mcp.fidelitystudio.ch/start",
  "In ChatGPT öffnen",
  "chatgpt.com/download",
  "ChatGPT im Browser genügt nicht",
]) {
  if (!localCheck.includes(phrase)) {
    fail(`docs/setup.md must check where the task runs before step 1 and include "${phrase}".`);
  }
}
// 23 Nov 2026: since the 21 Nov desktop app, a Work chat under the «ChatGPT»
// menu runs in the cloud; local chats sit under the second menu entry. The
// start link opens one with the sentence in the input; the fallback shows that
// menu as a picture so client text never names it.
if (!guide.includes("https://mcp.fidelitystudio.ch/start") || !guide.includes("https://mcp.fidelitystudio.ch/chat")
  || !guide.includes("](images/chatgpt-menu.png)") || !guide.includes("nicht\nChatGPT im Browser")) {
  fail("The German guide must start the setup with the start link, show the menu fallback picture and name the chat link.");
}
if (!existsSync(new URL("../docs/images/chatgpt-menu.png", import.meta.url))) fail("docs/images/chatgpt-menu.png is missing.");
if (/On your computer|In the cloud|Work-Aufgabe/.test(guide) || /On your computer\*\*|new Work task/.test(setup)) {
  fail("Client steps must use the start and chat links, not «On your computer» or Work tasks (gone since the 21 Nov 2026 app).");
}
// 23 Nov 2026: ChatGPT in the browser read "ChatGPT Work (or Codex)" and told
// a client to open Codex with a local folder. Clients only use the ChatGPT
// desktop app, Work and On your computer; nothing shown to them names Codex or
// a local folder. The agent's own commands may still name Codex.
if (!/Never mention «Codex», «On\s+your computer», «local folder» or «lokaler\s+Ordner» to them/.test(setup)) {
  fail("docs/setup.md must have the ground rule that client messages never mention Codex or a local folder.");
}
if (/\(or Codex\)/i.test(setup)) fail("docs/setup.md must not offer Codex as the place to run the setup.");
// 23 Nov 2026: a cloud Work task's browser loaded setup.md three times (200,
// 200, 304), yet the agent said it could not fetch the guide and asked for the
// text in the chat. The page opened with «You are an agent …», which reads like
// a prompt injection. The opening describes the steps instead of ordering an agent.
if (/you are an? (ai )?(agent|assistant)/i.test(setup.split("\n## ")[0])) {
  fail("docs/setup.md must open by describing the setup, not with «You are an agent …».");
}
const setupClientGerman = [
  setup.split("\n").filter((line) => line.startsWith(">")).join("\n"),
  ...(setup.match(/In German, for example:[\s\S]*?(?=\n\n|$)/g) ?? []),
];
if (!setupClientGerman[0].includes("ChatGPT-Desktop-App") || setupClientGerman.length < 2) {
  fail("docs/setup.md must keep the German stop message and the German finish example.");
}
for (const text of setupClientGerman) {
  const match = text.match(/codex|lokale[nr]\s+ordner/i);
  if (match) fail(`A client-facing German text in docs/setup.md must not say "${match[0]}".`);
}
// Markus, 23 Nov 2026: quitting the app completely must work on Windows too.
if (!/Unter Windows schliesst du das ChatGPT-Fenster[\s\S]{0,160}rechten Maustaste/.test(guide)
  || /\(⌘Q\)/.test(guide) || /\(⌘Q\)|system tray/.test(setup)) {
  fail("The guide and setup must say how to quit the app on Windows wherever they say ⌘Q.");
}
if (guide.includes("ß")) fail("The Swiss German guide must not contain ß.");
if (/\b(fuer|ueber|oeffnen|pruefen|zurueck|vollstaendig)\b/i.test(guide)) {
  fail("The German guide contains an avoidable umlaut transliteration.");
}
if (/\bmarkus[^\s@]*@[^\s]+/i.test(guide)) {
  fail("The public guide must not contain a maintainer email address.");
}
// Markus, 9 Nov 2026: after setup, an update or a new login, start a new Work
// task first. Only if the tools are still missing there, quit the app
// completely, reopen it and start one new Work task. The assistant asks for a
// new task at most once (the old skill looped in a Mac mini test).
const finishAt = setup.indexOf("## 4. Finish");
const finish = finishAt < 0 ? "" : setup.slice(finishAt);
const newTaskAt = finish.indexOf("https://mcp.fidelitystudio.ch/chat");
const fallbackAt = finish.search(/still missing in that new chat, quit the\s+app completely/i);
if (newTaskAt < 0 || fallbackAt < 0 || newTaskAt > fallbackAt) {
  fail("docs/setup.md step 4 must start a new chat with the chat link first and quit and reopen the app only if the tools are still missing there.");
}
const guideNewTaskAt = guide.indexOf("Starte nach der Einrichtung einen **neuen Chat** über diesen Link.");
const guideFallbackAt = guide.search(
  /Fehlen die Fidelity-Studio-Tools dort noch, beende die App ganz,\s+öffne sie wieder und starte nochmals einen neuen Chat\./,
);
if (guideNewTaskAt < 0 || guideFallbackAt < 0 || guideNewTaskAt > guideFallbackAt) {
  fail("The guide must start a new chat first and restart the app only if the tools are still missing there.");
}
if (
  !/Never ask for a\s+new task twice\./.test(skill)
  || !/already the new task[\s\S]{0,200}do not ask for\s+another new task/.test(skill)
  || !skill.includes("quit the app completely")
) {
  fail("The skill must ask for a new task at most once and ask for a full app restart when the current task is already the new one.");
}
const wrongRestartRule = [
  /mounted when a\s+(new\s+)?task\s+is\s+(created|started)/i,
  /normalerweise nicht beenden/i,
  /reicht nach einer\s+Installation oder Anmeldung normalerweise/i,
  /Erst wenn die Werkzeuge auch in dieser neuen Aufgabe fehlen/i,
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
  const match = wrongRestartRule.find((pattern) => pattern.test(text));
  if (match) {
    fail(`${name} must not say a new task always loads new tools, that a restart is never needed, or ask for a second new task before the restart (matched ${match}).`);
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

for (const [name, text] of [
  ["docs/client-guide-de.md", guide],
  ["docs/setup.md", setup],
  ["docs/maintenance.md", read("docs/maintenance.md")],
  ["README.md", read("README.md")],
]) {
  if (/werkzeug/i.test(text)) {
    fail(`${name} must say «Tools» in German, never «Werkzeuge».`);
  }
}
// Clients know ChatGPT and its Work mode, never Codex (Markus, 23 Nov 2026).
// The commands stay in docs/setup.md and README.md for the agent.
const guideCodex = guide.match(/.{0,40}codex.{0,40}/i);
if (guideCodex) {
  fail(`docs/client-guide-de.md must not mention Codex to clients: «${guideCodex[0].trim()}».`);
}
if (!skill.includes("Never write «Werkzeuge»")) {
  fail("The skill must tell the assistant to say «Tools» in German, never «Werkzeuge».");
}

console.log("Plugin validation passed.");
