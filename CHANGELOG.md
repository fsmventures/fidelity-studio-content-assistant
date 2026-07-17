# Changelog

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
