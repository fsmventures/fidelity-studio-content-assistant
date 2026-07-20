# Fidelity Studio Content Assistant

Public Git-backed Codex plugin marketplace for managing newsletters and website
content with Fidelity Studio. It is not yet listed in OpenAI's public Plugins
Directory.

The plugin is generic. It contains no client content, private repository
details, style guides, tokens, or secrets. After sign-in, Fidelity Studio's MCP
server returns the authorized project and its current guidance.

## What It Installs

- Fidelity Studio MCP for scoped blog posts, team members, media, previews, and
  publishing
- Resend's hosted MCP registration for projects whose authenticated Fidelity
  context declares newsletter provider Resend
- Auth-first workflow guidance with draft, review, and explicit publishing
  safeguards

## Install

Clients should follow the
[German client quick start](docs/client-guide-de.md): open ChatGPT Work in the
desktop app, paste the provided setup prompt, approve the clearly described
installation actions, and let Work run and verify the technical setup. Clients
do not need to open Terminal, have a GitHub account, or understand the
repository commands.

On Windows, the setup first runs the reusable
[`scripts/setup-windows.ps1`](scripts/setup-windows.ps1) bootstrap. It rejects
the protected `WindowsApps` Codex executable, installs the official standalone
Codex CLI when required, verifies Git for the repository-backed marketplace,
and idempotently refreshes the marketplace and plugin. It does not install
Node/npm for Codex, change PowerShell execution policy, or use approval/sandbox
settings as a substitute for fixing an executable access-control failure.

For maintainers and manual fallback, the equivalent commands are:

```bash
codex plugin marketplace add fsmventures/fidelity-studio-content-assistant --ref main
codex plugin add fidelity-studio-content-assistant@fidelity-studio-content-assistant
```

Choose Work, start a new task, open Plugins, and select Fidelity Studio Content
Assistant. Plugins are not available in ordinary Chat mode, mobile, or the IDE
extension. A full app restart is only a fallback if the tools are still absent
in the new task.

If Codex asks for marketplace details instead, use:

```text
Repository: fsmventures/fidelity-studio-content-assistant
Git ref: main
```

Sparse paths are optional. If requested, use:

```text
.agents/plugins
plugins/fidelity-studio-content-assistant
```

## Connect Accounts In Context

Sign in to Fidelity Studio first:

```bash
codex mcp login fidelity-studio-content-assistant
```

For Fidelity Studio, use the email address invited to the CMS. Clients do not
need GitHub access.

After that login finishes, start a fresh Work task, load
`get_project_context`, and verify the website tools operationally. Only if the
authenticated project context explicitly declares newsletters with provider
Resend should the assistant start this second login:

```bash
codex mcp login resend
```

For Resend, choose the client team or account that owns the newsletters. Resend
access is account-level, so only connect an account the user is authorized to
manage. Resend's hosted OAuth may request broad provider-selected account
permissions; do not force custom scopes or describe the connection as
technically least-privileged. If the user declines, website workflows remain
available but newsletter workflows do not. Plugin guidance instructs the
assistant to use direct Resend access for inspection, drafts, edits, and
explicitly named test recipients. Complete production sends and schedules
manually in the Resend dashboard.

Run each login once and let Codex open its authorization page automatically. Do
not launch a second browser window or start the next login while the first
callback listener is active. Offer the printed URL manually only if Codex
reports that automatic browser opening failed. A project without an explicit
Resend newsletter declaration is ready for website work after Fidelity Studio
verification; do not request Resend access for it.

After Fidelity succeeds, start a fresh task and write:

```text
Load my Fidelity Studio project context and list all blog posts and team members. Check whether the authenticated context explicitly enables newsletters with provider Resend. Only then, use harmless Resend reads to verify the connected team, templates, broadcasts, and audiences; if Resend is not yet authenticated, start exactly one login and tell me to repeat this verification in a fresh Work task. If the context does not require Resend, report website-only readiness without starting its login. Change nothing and report each required service separately.
```

Do not trust an `auth_status` value or successful login command as operational
proof. Verify `get_project_context`, blog and team inventory calls, and – when
the project requires Resend – harmless provider reads in the fresh task.

If the assistant starts searching local files, GitHub, Craft, or the web for
client content, stop the task and reconnect the Fidelity Studio MCP. Authenticated
project context is the source of truth.

Check the installed version with:

```bash
codex plugin list --marketplace fidelity-studio-content-assistant
```

## Core Workflows

- Newsletters: use pasted or attached source material, create a Resend draft,
  review the exact audience, and send labelled tests only to explicitly named
  reviewers; complete live sends and schedules manually in Resend
- Blog posts: list or load the authorized content, draft both required
  languages, verify the generated preview links, then deploy the reviewed commit
  to production only after explicit approval on the server-owned Fidelity Studio
  CMS page
- Team members: list the current team first, draft the requested change, then
  verify it on preview and deploy the reviewed commit to production only after
  explicit approval on the server-owned Fidelity Studio CMS page

See the [German client quick start](docs/client-guide-de.md) for copy-ready
prompts.

## Updates

Fidelity Studio publishes plugin updates through this Git marketplace:

```bash
codex plugin marketplace upgrade fidelity-studio-content-assistant
codex plugin list --marketplace fidelity-studio-content-assistant
```

Start a new task after updating. Client-specific workflow and writing guidance
is loaded live from Fidelity Studio, so those rules can change without a plugin
reinstall.

When upgrading from a version before `0.4.0`, run the Fidelity login once again
to grant the new production-approval-request capability, then start another new
Work task:

```bash
codex mcp login fidelity-studio-content-assistant
```

The authenticated project context shows whether production deployment is
available. A cached plugin version or previous access token is not enough.

If the listed version remains stale, refresh the installed copy explicitly:

```bash
codex plugin remove fidelity-studio-content-assistant@fidelity-studio-content-assistant
codex plugin add fidelity-studio-content-assistant@fidelity-studio-content-assistant
```

See [maintenance and releases](docs/maintenance.md) for the release model.

## Troubleshooting

- Plugin source missing: rerun the marketplace command and check that GitHub is
  reachable. On Windows, verify `git.exe` before retrying because the current
  owner/repository marketplace requires Git.
- Windows `codex.exe` access denied: do not change approval mode, sandbox mode,
  or PowerShell execution policy. Run the Windows bootstrap so it installs and
  verifies the official standalone Codex CLI outside `WindowsApps`.
- Plugin blocked: ask the ChatGPT workspace administrator to allow the plugin.
- OAuth browser does not open: use the printed authorization URL only when Codex
  explicitly reports that automatic browser launch failed.
- Fidelity access denied: use the exact email address invited by Fidelity
  Studio.
- Resend data missing: reconnect and select the intended client team.
- Tools missing or version stale: start a new task first; if needed, run the
  update commands above. Restart the app only if a new task still lacks the
  tools.

## Architecture Boundary

The private Fidelity Studio CMS/MCP owns authorization, client rules, and
website operations. Resend owns newsletter data and sending. This public
repository is the versioned plugin marketplace package that connects them.
