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
- Resend's hosted MCP for newsletter templates, broadcasts, audiences, and test
  sends
- Auth-first workflow guidance with draft, review, and explicit publishing
  safeguards

## Install

Clients should follow the
[German client quick start](docs/client-guide-de.md): open ChatGPT Work in the
desktop app after using Codex once for setup, paste the provided prompts,
approve the clearly described installation actions, and let Codex complete the
technical setup. Clients do not need to open Terminal, have a GitHub account,
or understand the repository commands.

For maintainers and manual fallback, the equivalent commands are:

```bash
codex plugin marketplace add fsmventures/fidelity-studio-content-assistant --ref main
codex plugin add fidelity-studio-content-assistant@fidelity-studio-content-assistant
```

Restart ChatGPT desktop, choose Work or Codex, open Plugins, and select Fidelity
Studio Content Assistant. Plugins are not available in ordinary Chat mode,
mobile, or the IDE extension. Start a new task after installation.

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

## Connect Accounts

Sign in to both services when prompted:

```bash
codex mcp login fidelity-studio-content-assistant
codex mcp login resend
```

For Fidelity Studio, use the email address invited to the CMS. Clients do not
need GitHub access.

For Resend, choose the client team or account that owns the newsletters. Resend
access is account-level, so only connect an account the user is authorized to
manage. The assistant uses Resend for inspection, drafts, edits, and explicitly
named test recipients. Complete production sends and schedules manually in the
Resend dashboard.

After both logins succeed, start a fresh task and write:

```text
Show me my Fidelity Studio project context and the newsletter, blog, and team-member workflows available to me.
```

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
- Blog posts: load the authorized blog context, draft both required languages,
  preview, then publish only after explicit approval
- Team members: list the current team first, draft the requested change, then
  publish or archive only after explicit approval

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

If the listed version remains stale, refresh the installed copy explicitly:

```bash
codex plugin remove fidelity-studio-content-assistant@fidelity-studio-content-assistant
codex plugin add fidelity-studio-content-assistant@fidelity-studio-content-assistant
```

See [maintenance and releases](docs/maintenance.md) for the release model.

## Troubleshooting

- Plugin source missing: rerun the marketplace command and check that GitHub is
  reachable.
- Plugin blocked: ask the ChatGPT workspace administrator to allow the plugin.
- OAuth browser does not open: run the matching `codex mcp login` command again.
- Fidelity access denied: use the exact email address invited by Fidelity
  Studio.
- Resend data missing: reconnect and select the intended client team.
- Tools missing or version stale: start a new task; if needed, run the update
  commands above.

## Architecture Boundary

The private Fidelity Studio CMS/MCP owns authorization, client rules, and
website operations. Resend owns newsletter data and sending. This public
repository is the versioned plugin marketplace package that connects them.
