# Fidelity Studio Content Assistant

Public Codex plugin marketplace for the Fidelity Studio Content Assistant.

This repository intentionally contains only generic installer metadata. It does
not contain client-specific instructions, style guides, repository details,
tokens, secrets, or content. After authentication, the MCP server returns the
authorized client's project context and assistant guidance from Fidelity
Studio's Supabase-backed CMS configuration.

## What It Installs

- Codex plugin: `fidelity-studio-content-assistant`
- MCP endpoint: `https://mcp.fidelitystudio.ch/mcp`
- Auth model: OAuth through `https://cms.fidelitystudio.ch`
- Generic skill: auth-first guardrails only; no client-specific content

## Install In Codex

Add this repository as a plugin marketplace:

```text
fsmventures/fidelity-studio-content-assistant
```

Use Git ref:

```text
main
```

Sparse paths are optional for this small repository. If Codex asks for sparse
paths, use:

```text
.agents/plugins
plugins/fidelity-studio-content-assistant
```

CLI equivalent:

```bash
codex plugin marketplace add fsmventures/fidelity-studio-content-assistant --ref main
codex plugin add fidelity-studio-content-assistant@fidelity-studio-content-assistant
```

## Authentication

When Codex asks to authenticate, sign in with the email address Fidelity Studio
invited to the CMS. Clients do not need GitHub access; repository access is
handled by Fidelity Studio's Pages CMS GitHub App installation.

Open a fresh Codex thread after installing or updating the plugin. Then start with:

```text
Authenticate with Fidelity Studio Content Assistant and show me my project context.
```

The plugin skill tells Codex to authenticate and load MCP context first. The MCP server will return the authorized project, available tools, workflow
rules, content paths, preview/live URLs, and client-specific guidance.

If Codex starts searching Craft, GitHub, local files, or the current workspace instead, the plugin tools were not loaded in that thread. Open a new Codex thread and select the installed `Fidelity Studio Content Assistant` plugin from the composer/plugin picker.

## Architecture Boundary

The MCP server and CMS app live in the private Fidelity Studio Pages CMS repo.
This public repo is only the Codex plugin marketplace package.
