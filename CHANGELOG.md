# Changelog

## 0.4.1 - 2026-07-20

- Authenticate Fidelity Studio first and load the authorized project context
  before deciding whether a client project needs Resend.
- Request Resend authentication only when the loaded context explicitly enables
  newsletters with provider Resend; keep website-only clients ready without it.
- Add an idempotent Windows bootstrap that avoids the protected `WindowsApps`
  Codex executable, uses the official standalone Codex installer, and verifies
  the exact executable path.
- Detect or install Git for Windows before using the repository-backed plugin
  marketplace and refresh the current process path after installation.
- Refresh existing marketplaces and plugin caches safely, verify the installed
  version and MCP registrations, and preserve one-login-at-a-time OAuth steps.
- Document that approval mode, sandbox elevation, Node/npm, and PowerShell
  execution-policy changes are not fixes for an executable access-control
  failure.

## 0.4.0 - 2026-07-17

- Remove the explicit OAuth resource override so Codex sends the Fidelity MCP
  resource parameter only once.
- Treat a new Work task as the normal way to mount newly installed or
  authenticated tools; reserve a full app restart as a fallback.
- Add operational connection checks for project context, blog and team
  inventories, and harmless Resend reads.
- Document Resend's provider-selected account permissions honestly instead of
  asking Codex to force unsupported reduced scopes.
- Guide website changes through verified preview URLs, explicit production
  approval, deployment polling, and verified live URLs.
- Require a separate, server-owned Fidelity Studio CMS approval page for every
  production website deployment; the MCP client cannot approve its own request.
- Require a one-time Fidelity reauthentication for upgrades so the separate
  production-approval-request capability is actually granted.
- Add support for listing blog posts without requiring a known slug.

## 0.3.5 - 2026-07-17

- Declare the generic Fidelity Studio MCP endpoint explicitly as the OAuth
  resource for consistent authorization discovery in ChatGPT and Codex.

## 0.3.4 - 2026-07-17

- Use ChatGPT Work's terminal capability for the paste-ready, no-Terminal
  client installation flow.
- Make the setup prompt verify that the plugin persisted and report a precise
  blocker instead of handing terminal work back to the client.

## 0.3.3 - 2026-07-17

- Replace the client-facing Terminal setup with a paste-ready Codex setup
  inside the ChatGPT desktop app, followed by normal use in ChatGPT Work.
- Restore proper German umlauts throughout the German client guide.
- Clarify that portrait newsletter images are suitable in layouts such as
  two-column sections, while landscape remains preferable for full-width media.

## 0.3.2 - 2026-07-17

- Add the Fidelity Studio brand icon to the plugin composer and marketplace
  presentation.

## 0.3.1 - 2026-07-17

- Limit direct Resend use to inspection, drafts, updates, and explicitly named
  test sends.
- Require production newsletter sends and schedules to be completed manually
  in the Resend dashboard until Fidelity Studio provides a server-enforced
  newsletter gateway.

## 0.3.0 - 2026-07-17

- Add Resend's hosted OAuth MCP for newsletter templates, audiences,
  broadcasts, tests, and delivery workflows.
- Expand the skill to cover newsletters, blog posts, and team members.
- Add explicit audience review and send, schedule, publish, and archive
  confirmation safeguards.
- Add a German client quick-start guide and a Git-based maintenance guide.

## 0.2.2

- Start the Fidelity Studio MCP OAuth login when tools are missing.
- Keep authenticated project context as the source of truth for website content.
