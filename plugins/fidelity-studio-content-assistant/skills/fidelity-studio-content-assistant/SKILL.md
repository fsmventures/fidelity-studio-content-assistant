---
name: fidelity-studio-content-assistant
description: Use the Fidelity Studio Content Assistant MCP server for authenticated client website content workflows. Always authenticate and load authorized MCP project context before client-specific work.
---

# Fidelity Studio Content Assistant

Use this skill whenever the user mentions the Fidelity Studio Content Assistant plugin, asks for client website content help through Fidelity Studio, or asks to draft, translate, preview, publish, upload media, or inspect content through the Content Assistant.

## First Action: Authenticate And Load Context

Before answering client-specific content questions or using any other source, call the Fidelity Studio Content Assistant MCP server and load the user's authorized project context.

Start with the MCP tool that returns project/context information, such as `get_project_context`, `show_project_context`, or the closest available context/list-projects tool exposed by the MCP server.

## If MCP Tools Are Missing In Codex

If the Fidelity Studio Content Assistant MCP tools are not exposed in the current Codex thread, do not search Craft, the web, GitHub, local files, or the current workspace.

Instead, run this exact command from the shell to start Codex's MCP OAuth login:

```bash
codex mcp login fidelity-studio-content-assistant
```

If the command prints an authorization URL, ask the user to open it and complete the Fidelity Studio CMS sign-in. If the command reports success, tell the user to start a fresh Codex thread and invoke the plugin again so the newly authenticated MCP tools are loaded into the thread.

Do not claim the client content is unavailable until this login step has been tried or the user declines it.

## Source Of Truth

Treat successful MCP context loading as the source of truth for:

- which client/project the user is allowed to access
- client-specific writing guidance and style notes
- available content tools and workflow rules
- content paths, preview URLs, live URLs, and publishing behavior
- allowed authors, categories, languages, collections, and media rules

## Do Not Substitute Other Data Sources

Do not use Craft, local files, GitHub, generic web search, project workspaces, cached memories, or previous chat history as a substitute for the authenticated MCP project context.

If authentication fails or the user is not authorized, explain that Fidelity Studio needs to invite or authorize that email address in the CMS/MCP access layer.

## After Context Is Loaded

Once the MCP context is available, follow the authenticated guidance returned by the server. Prefer MCP tools over local editing for client website content operations.

For destructive or publishing actions, summarize the intended change and ask for explicit confirmation unless the MCP tool itself provides a stricter confirmation workflow.

Keep plugin-level guidance generic. Client-specific knowledge belongs behind MCP authentication and should come from the server, not from this public plugin package.
