---
name: fidelity-studio-content-assistant
description: Use the Fidelity Studio Content Assistant MCP server for authenticated client website content workflows. Always start by authenticating and loading the authorized project context from the MCP server.
---

# Fidelity Studio Content Assistant

Use this skill whenever the user mentions the Fidelity Studio Content Assistant plugin, asks for client website content help through Fidelity Studio, or asks to draft, translate, preview, publish, upload media, or inspect content through the Content Assistant.

## First Action: Authenticate And Load Context

Before answering client-specific content questions or using any other source, call the Fidelity Studio Content Assistant MCP server and load the user's authorized project context.

Start with the MCP tool that returns project/context information, such as `get_project_context`, `show_project_context`, or the closest available context/list-projects tool exposed by the MCP server. If the MCP client requires sign-in, trigger the OAuth flow and wait for the user to complete authentication.

Treat successful MCP context loading as the source of truth for:

- which client/project the user is allowed to access
- client-specific writing guidance and style notes
- available content tools and workflow rules
- content paths, preview URLs, live URLs, and publishing behavior
- allowed authors, categories, languages, collections, and media rules

## Do Not Substitute Other Data Sources

Do not use Craft, local files, GitHub, generic web search, project workspaces, cached memories, or previous chat history as a substitute for the authenticated MCP project context.

If the Fidelity Studio Content Assistant MCP tools are unavailable, say that the plugin is not loaded in this thread and ask the user to open a fresh Codex thread after installing/enabling the plugin. Do not fall back to unrelated connectors.

If authentication fails or the user is not authorized, explain that Fidelity Studio needs to invite or authorize that email address in the CMS/MCP access layer.

## After Context Is Loaded

Once the MCP context is available, follow the authenticated guidance returned by the server. Prefer MCP tools over local editing for client website content operations.

For destructive or publishing actions, summarize the intended change and ask for explicit confirmation unless the MCP tool itself provides a stricter confirmation workflow.

Keep plugin-level guidance generic. Client-specific knowledge belongs behind MCP authentication and should come from the server, not from this public plugin package.
