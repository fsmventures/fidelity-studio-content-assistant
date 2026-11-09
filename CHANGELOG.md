# Changelog

## 0.5.2 - 2026-11-09

- German texts say «Tools» instead of «Werkzeuge»: the German guide, the setup
  prompts and the assistant's own replies. The skill names the rule and the
  validator rejects «Werkzeug» in the guides.

## 0.5.1 - 2026-11-09

- Fix a loop after setup. When the tools are missing in a task that is already
  the new one, the assistant no longer asks for another new task. It asks the
  user to quit the app completely and reopen it, then start one new Work task.
  It asks for a new task at most once.
- After setup, an update or a new sign-in, start a new Work task first. If the
  Fidelity Studio tools are still missing there, quit the app completely (Mac:
  ⌘Q; Windows: also in the system tray), reopen it and start one new Work task.
  Remove the claim that a new task always loads newly installed or signed-in
  tools.
- Check the saved sign-in with `codex mcp list --json` first, so a missing
  sign-in is fixed before any restart. Hand over to Fidelity Studio if the
  tools are still missing after a full restart.
- Validate this order in the setup guide, the German guide and the skill.

## 0.5.0 - 2026-11-06

- Work the same way on every website that uses Fidelity Studio's shared Pages
  backend: the skill follows the project's own collections and fields with
  `list_entries`, `get_entry`, `create_entry`, `update_entry` and
  `upload_image`, saves to the preview, and publishes live only when asked.
- The local photo helper uploads to any website offering `upload_image`. Pass
  `--collection` and `--field` so the photo is saved in a format that field
  accepts. The image bytes still travel only in MCP `_meta`, never in logged
  tool arguments. Websites with their own photo tool keep `--destination`.

## 0.4.3 - 2026-11-05

- Publish website changes live from the chat. When the user asks to publish,
  the assistant summarizes what goes live, calls `deploy_project_to_production`
  with the exact reviewed preview commit, polls `get_project_deployment_status`
  until the site is ready and then shares the verified live links.
- Remove the separate Fidelity Studio approval page from the skill, the guides
  and the release checks. Publishing never needs a page, link or click outside
  the chat. Requires the Fidelity Studio CMS version that starts the live
  publish directly.
- Validate that the skill publishes from the chat and that no instruction or
  guide points to an approval page or link.

## 0.4.2 - 2026-11-05

- Transfer selected local photos through the signed-in desktop MCP connection. Optimize larger camera originals in memory and support HEIC stills on macOS.
- Verify website access using the authenticated editor’s available collection, blog or team tools.
- Follow the project’s publishing policy for portfolio drafts, photographs and static pages.

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
