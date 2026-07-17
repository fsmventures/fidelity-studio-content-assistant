# AGENTS.md

Canonical agent guide for the public Fidelity Studio Content Assistant plugin
repository.

## Role

This repository is the public Codex plugin marketplace package for the Fidelity
Studio Content Assistant.

It is not the CMS/MCP backend and it is not a client website repository.

## What Belongs Here

- Generic Codex plugin metadata.
- Generic MCP connection metadata for `https://mcp.fidelitystudio.ch/mcp` and
  Resend's hosted MCP.
- Generic auth-first skill instructions.
- Public install documentation.

## What Must Not Go Here

- Client-specific style guides or writing rules.
- Client repository details beyond generic examples.
- Tokens, secrets, OAuth client secrets, or bearer tokens.
- Private CMS/MCP implementation details.
- Private client content.

Client-specific knowledge belongs behind MCP authentication in Fidelity Studio's
Supabase-backed CMS configuration. The assistant should get that knowledge by
calling `get_project_context` after login.

## Related Systems

- The private Fidelity Studio CMS/MCP backend owns OAuth, access checks,
  project guidance, and website content operations.
- Client website repositories own their content and media.
- Authorized client Resend teams own newsletter data and delivery.

## Agent Workflow

When changing this repo:

1. Keep the package client-agnostic.
2. Keep the plugin endpoint pointed at `https://mcp.fidelitystudio.ch/mcp`.
3. Keep Resend pointed at the official hosted OAuth MCP endpoint.
4. Keep the skill's first action as authentication plus MCP project context
   loading.
5. If MCP tools are missing in a Codex thread, instruct Codex to run
   `codex mcp login fidelity-studio-content-assistant`.
6. Require explicit confirmation before website publishing or newsletter
   sending and scheduling.
7. Do not add fallbacks that search Craft, GitHub, web pages, or local files for
   client-specific content.

The CMS/MCP backend is responsible for OAuth, access checks, tool behavior, and
project-specific assistant guidance.
