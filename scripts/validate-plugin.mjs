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
  "On your computer",
  "In the cloud",
  "nicht ChatGPT im Browser",
  "https://mcp.fidelitystudio.ch/setup.md",
]) {
  if (!localCheck.includes(phrase)) {
    fail(`docs/setup.md must check where the task runs before step 1 and include "${phrase}".`);
  }
}
if (!/\*\*On your computer\*\*/.test(guide) || !guide.includes("nicht ChatGPT im Browser")) {
  fail("The German guide must tell clients to start the setup task On your computer in the desktop app.");
}
// 23 Nov 2026: ChatGPT in the browser read "ChatGPT Work (or Codex)" and told
// a client to open Codex with a local folder. Clients only use the ChatGPT
// desktop app, Work and On your computer; nothing shown to them names Codex or
// a local folder. The agent's own commands may still name Codex.
if (!/Never mention «Codex», «local folder» or «lokaler\s+Ordner» to them/.test(setup)) {
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
const newTaskAt = finish.indexOf("new Work task");
const fallbackAt = finish.search(/still missing in that new task, quit the\s+app completely/i);
if (newTaskAt < 0 || fallbackAt < 0 || newTaskAt > fallbackAt) {
  fail("docs/setup.md step 4 must start a new Work task first and quit and reopen the app only if the tools are still missing there.");
}
const guideNewTaskAt = guide.indexOf("Starte nach der Einrichtung eine **neue Work-Aufgabe**.");
const guideFallbackAt = guide.search(
  /Fehlen die Fidelity-Studio-Tools dort noch, beende die App ganz,\s+öffne sie wieder und starte nochmals eine neue Work-Aufgabe\./,
);
if (guideNewTaskAt < 0 || guideFallbackAt < 0 || guideNewTaskAt > guideFallbackAt) {
  fail("The guide must start a new Work task first and restart the app only if the tools are still missing there.");
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

// Directory package 1.0 (ChatGPT plugin directory). It lives next to the
// 0.5.x Codex package until every client has moved: ChatGPT only, our MCP
// server only, OAuth on install, no terminal steps and no local helper.
const directoryRoot = "directory/fidelity-studio-content-assistant";
const directoryVersion = "1.0.0";
const dirPlugin = json(`${directoryRoot}/plugin.json`);
const dirMcp = json(`${directoryRoot}/mcp.json`);
const dirSkillPath = `${directoryRoot}/skills/fidelity-studio-content-assistant/SKILL.md`;
const dirSkill = read(dirSkillPath);
const openai = dirPlugin.extensions?.["com.openai"] ?? {};
const ui = openai.interface ?? {};
const review = openai.review ?? {};
const publication = openai.publication ?? {};

if (dirPlugin.$schema !== "https://agent-plugins.org/schemas/1.0.0/plugin.schema.json") {
  fail("The directory plugin.json must use the agent-plugins 1.0.0 schema.");
}
if (dirPlugin.name !== "fidelity-studio-content-assistant") fail("The directory plugin keeps the name fidelity-studio-content-assistant.");
if (dirPlugin.version !== directoryVersion) fail(`Expected directory plugin version ${directoryVersion}, received ${dirPlugin.version}.`);
if (!read("CHANGELOG.md").includes(`## ${directoryVersion} - `)) fail(`CHANGELOG.md must have an entry for ${directoryVersion}.`);

const servers = Object.entries(dirMcp.mcpServers ?? {});
if (servers.length !== 1) fail("The directory package must declare exactly one MCP server.");
const [serverName, server] = servers[0];
if (serverName !== "fidelity-studio-content-assistant") fail("The directory MCP server must be fidelity-studio-content-assistant.");
if (server.type !== "streamable-http" || server.url !== "https://mcp.fidelitystudio.ch/mcp") {
  fail("The directory MCP server must be streamable-http at https://mcp.fidelitystudio.ch/mcp.");
}
const auth = server.extensions?.["com.openai"]?.auth;
if (auth?.type !== "oauth" || auth?.client?.mode !== "dcr") fail("The directory MCP server must declare OAuth with dynamic client registration.");
if (/resend/i.test(read(`${directoryRoot}/mcp.json`))) fail("The directory package must not bundle Resend; clients add Resend's own plugin.");

const limits = { displayName: 30, shortDescription: 30, longDescription: 4000 };
for (const [key, max] of Object.entries(limits)) {
  if (typeof ui[key] !== "string" || !ui[key].trim()) fail(`interface.${key} is required.`);
  if (ui[key].length > max) fail(`interface.${key} is ${ui[key].length} characters; the limit is ${max}.`);
}
for (const key of ["websiteURL", "supportURL", "privacyPolicyURL", "termsOfServiceURL"]) {
  if (typeof ui[key] !== "string" || !ui[key].startsWith("https://")) fail(`interface.${key} must be an https URL.`);
}
if (!Array.isArray(ui.defaultPrompt) || ui.defaultPrompt.length < 1 || ui.defaultPrompt.length > 3
  || ui.defaultPrompt.some((prompt) => typeof prompt !== "string" || prompt.length > 128)) {
  fail("interface.defaultPrompt needs one to three prompts of at most 128 characters.");
}
for (const key of ["composerIcon", "logo"]) {
  if (typeof ui[key] !== "string" || !existsSync(resolve(root, directoryRoot, ui[key]))) {
    fail(`interface.${key} must point to an existing file in the directory package.`);
  }
}
if (!existsSync(resolve(root, directoryRoot, openai.onboardingSkill ?? ""))) fail("onboardingSkill must point to the bundled skill.");

const positive = review.test_cases?.positive ?? [];
const negative = review.test_cases?.negative ?? [];
if (positive.length !== 5) fail(`The review needs exactly 5 positive test cases, found ${positive.length}.`);
if (negative.length !== 3) fail(`The review needs exactly 3 negative test cases, found ${negative.length}.`);
for (const testCase of positive) {
  for (const key of ["description", "prompt", "tools_triggered", "expected_behavior"]) {
    if (typeof testCase[key] !== "string" || !testCase[key].trim()) fail(`A positive test case is missing ${key}.`);
  }
  if (!testCase.tools_triggered.includes("get_project_context")) fail(`Positive test case «${testCase.description}» must load the project context first.`);
}
for (const testCase of negative) {
  for (const key of ["description", "prompt"]) {
    if (typeof testCase[key] !== "string" || !testCase[key].trim()) fail(`A negative test case is missing ${key}.`);
  }
}
if (review.commerce !== false) fail("review.commerce must be false.");
for (const key of ["test_credentials", "reviewer_instructions"]) {
  if (key in review) fail(`review.${key} is not accepted in an uploaded package; enter it in the submission form.`);
}
if (!Array.isArray(publication.countries) || publication.countries.some((code) => !/^[A-Z]{2}$/.test(code))) {
  fail("publication.countries must list uppercase two-letter country codes.");
}
for (const [locale, translation] of Object.entries(publication.translations ?? {})) {
  if ((translation.subtitle ?? "").length > 30) fail(`publication.translations.${locale}.subtitle is longer than 30 characters.`);
  if ((translation.description ?? "").includes("ß")) fail(`publication.translations.${locale}.description must not contain ß.`);
}

for (const forbidden of [".app.json", "hooks", "hooks.json", ".mcp.json", ".codex-plugin", "scripts"]) {
  if (existsSync(resolve(root, directoryRoot, forbidden))) fail(`The directory package must not contain ${forbidden}.`);
}
const directoryTexts = [
  ["directory skill", dirSkill],
  ["directory plugin.json", read(`${directoryRoot}/plugin.json`)],
  ["directory mcp.json", read(`${directoryRoot}/mcp.json`)],
];
const terminalSteps = [
  /codex/i,
  /terminal/i,
  /\bshell\b/i,
  /work[\s-]task/i,
  /work-aufgabe/i,
  /mcp login/i,
  /upload-local-photo/i,
  /local (photo|file|path)/i,
  /load_workspace_dependencies/i,
  /cms\.fidelitystudio\.ch/i,
  /approval[\s-]+(url|page|link|request)/i,
  /\bfreigabe/i,
];
for (const [name, text] of directoryTexts) {
  const match = terminalSteps.find((pattern) => pattern.test(text));
  if (match) fail(`${name} must work in ChatGPT without a terminal or Codex step (matched ${match}).`);
}
// The skill itself names «Werkzeuge» once, in the rule that forbids it.
if (/werkzeug/i.test(read(`${directoryRoot}/plugin.json`))) fail("The directory listing must say «Tools» in German, never «Werkzeuge».");
for (const phrase of [
  "get_project_context",
  "deploy_project_to_production",
  "REQUEST_PRODUCTION_APPROVAL",
  "idempotency key",
  "ready=true",
  "Publishing happens entirely in this chat.",
  "Never write «Werkzeuge»",
  "Resend's own",
  "`file` parameter",
]) {
  if (!dirSkill.includes(phrase)) fail(`The directory skill is missing "${phrase}".`);
}

console.log("Plugin validation passed.");
