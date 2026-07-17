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
3. Validate the JSON files and review the public diff for client-specific data
   or secrets.
4. Commit and push `main`.
5. On a client machine, run:

```bash
codex plugin marketplace upgrade fidelity-studio-content-assistant
codex plugin remove fidelity-studio-content-assistant@fidelity-studio-content-assistant
codex plugin add fidelity-studio-content-assistant@fidelity-studio-content-assistant
```

6. Start a new ChatGPT desktop task and verify both MCP connections.

The Git marketplace makes Fidelity Studio the update publisher. Clients do not
install from a copied folder, and Fidelity Studio does not need to send a new
package for every release. Git pushes do not silently replace every installed
cache; the client still needs the refresh/reinstall commands above and a new
task.

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
permissions of the connected Resend account, so connect only the intended
client team.

## Release Verification

For every release:

- validate `plugin.json`, `.mcp.json`, and `marketplace.json`
- confirm the marketplace snapshot resolves the new version
- install the version on a clean or test profile
- authenticate both MCP servers
- verify project context
- verify blog and team reads through Fidelity Studio
- verify newsletter reads and draft-only behavior through Resend
- do not use a production publish or newsletter send as a smoke test

## Optional OpenAI Marketplace Submission

The public Git marketplace is the direct distribution and update channel. An
official OpenAI marketplace submission can be pursued separately for broader
discovery, but it is not required for Fidelity Studio to onboard and update
clients.
