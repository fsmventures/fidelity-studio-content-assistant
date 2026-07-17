# Maintenance And Releases

This repository is the permanent public distribution point for the Fidelity
Studio Content Assistant.

## Two Update Channels

### Plugin Releases

Use a plugin release when generic capabilities, MCP connections, skills, or
public documentation change.

1. Update the package under
   `plugins/fidelity-studio-content-assistant`.
2. Bump the semantic version in `.codex-plugin/plugin.json`.
3. Run the release validator and review the public diff for client-specific
   data or secrets:

```bash
node scripts/validate-plugin.mjs
```

4. Commit and push `main`.
5. On a client machine, run:

```bash
codex plugin marketplace upgrade fidelity-studio-content-assistant
codex plugin list --marketplace fidelity-studio-content-assistant
```

6. Start a new ChatGPT desktop task and verify both MCP connections.

The Git marketplace makes Fidelity Studio the update publisher. Clients do not
install from a copied folder, and Fidelity Studio does not need to send a new
package for every release. Git pushes do not silently replace every installed
cache; the client still needs to refresh the marketplace and start a new task.

If the installed version remains stale after the marketplace refresh, reinstall
the cached copy:

```bash
codex plugin remove fidelity-studio-content-assistant@fidelity-studio-content-assistant
codex plugin add fidelity-studio-content-assistant@fidelity-studio-content-assistant
```

### Live Client Guidance

Use the private CMS/Supabase project configuration when a client's languages,
writing guidance, content rules, workflows, or safety rules change.

The plugin calls `get_project_context` at the start of client work, so these
changes become available immediately without a plugin release or reinstall.

Keep client names, repository details, campaign notes, and style rules out of
this public repository.

## Client Onboarding

Each client needs three independent pieces:

1. ChatGPT desktop with this plugin installed.
2. A Fidelity Studio CMS invitation for the email used during MCP OAuth.
3. Membership in the correct Resend team or account for newsletter work.

Fidelity Studio access is project-scoped. Resend's hosted MCP uses the
provider-selected permissions of the connected account and may request broad
access. Do not add a custom scope override to `.mcp.json` or the login command.
Connect only the intended client team, or decline and keep newsletter workflows
unavailable. Plugin guidance instructs direct Resend work to remain
draft-and-test-only. Production sends and schedules remain manual
Resend-dashboard actions until Fidelity Studio provides a server-enforced
newsletter gateway.

## Release Verification

For every release:

- validate `plugin.json`, `.mcp.json`, and `marketplace.json`
- confirm the marketplace snapshot resolves the new version
- install the version on a clean or test profile
- verify the Fidelity Studio icon in the Plugins directory, Installed row, and
  `@` composer menu in light and dark appearance
- authenticate both MCP servers
- verify project context
- verify `list_blog_posts` and `list_team_members` through Fidelity Studio
- verify newsletter reads and draft-only behavior through Resend
- verify preview status against a known commit and harmless page paths
- verify that a production request opens the server-owned Fidelity Studio CMS
  approval page, then decline it and confirm that no workflow was dispatched
- do not use a production publish or newsletter send as a smoke test

## Optional OpenAI Marketplace Submission

The public Git marketplace is the direct distribution and update channel. An
official OpenAI marketplace submission can be pursued separately for broader
discovery, but it is not required for Fidelity Studio to onboard and update
clients.
