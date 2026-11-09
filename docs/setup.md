# Set up the Fidelity Studio Content Assistant

You are an agent in ChatGPT Work (or Codex). The person who sent you here is a
Fidelity Studio client. They want the Fidelity Studio Content Assistant
installed so they can change their website and newsletter content in chat.

Do the setup for them. Run every command yourself in the shared workspace.
They do not want to open a terminal and do not need GitHub.

## Ground rules

- Talk to the person in the language they wrote to you in, in short, friendly
  sentences. In German, use Swiss spelling (ss, never the sharp s).
- This is a setup task only. Do not edit any project files.
- Never ask for passwords, codes, access keys or tokens in the chat, and never
  show any.
- When an approval prompt or a browser sign-in appears, pause, say in one
  sentence what it allows, and tell them exactly what to click.
- Start each sign-in at most once. Do not open a second browser window.

## 1. Install or update the plugin

Check the operating system first.

### Windows

Run the repeatable Fidelity Studio setup in 64-bit Windows PowerShell:

```powershell
irm https://raw.githubusercontent.com/fsmventures/fidelity-studio-content-assistant/main/scripts/setup-windows.ps1 | iex
```

The script may install only the official standalone Codex CLI and Git for
Windows through winget. Do not install Node.js or npm for Codex, and do not
change the PowerShell execution policy.

If `codex.exe` from `WindowsApps` fails with "access denied", approval mode,
full access or another sandbox mode will not fix it. Use the official
standalone Codex install script from the setup above and check that the
resolved path is outside `WindowsApps`. If Git is missing, install Git for
Windows through winget, refresh the PATH of the running process and check
`git --version` before you retry the marketplace. If it still fails, stop and
report the exact path and error.

### macOS or Linux

Check that `codex` and `git` run. Add the marketplace only when it is missing;
otherwise upgrade it. Then install or update the plugin and check the version
and MCP registrations:

```bash
codex plugin marketplace add fsmventures/fidelity-studio-content-assistant --ref main --json
codex plugin marketplace upgrade fidelity-studio-content-assistant --json
codex plugin add fidelity-studio-content-assistant@fidelity-studio-content-assistant --json
codex plugin list --marketplace fidelity-studio-content-assistant --json
codex mcp list --json
```

If an existing plugin cache stays outdated after the marketplace upgrade,
remove only this plugin, install it again and check the installed version
again.

## 2. Sign in to Fidelity Studio once

Start the sign-in exactly once and wait until it has finished:

```bash
codex mcp login fidelity-studio-content-assistant
```

Codex normally opens the sign-in page itself. Do not run an extra `open`
command and do not repeat the login while the first one runs. Only if Codex
says it could not open the browser, show the person the link to open.

Tell the person to sign in with the email address Fidelity Studio activated
for them, to click **Allow access** once, and to return to ChatGPT if the
browser does not switch back by itself. The sign-in page lists what the
assistant may do, such as reading, drafts, images and changes. It still
publishes live only when they ask for it in the chat.

## 3. Leave Resend for later

Do not start a Resend sign-in now. The next Work task first loads the
authenticated project context with `get_project_context`. Only if that context
declares newsletters with the provider Resend does the assistant connect Resend
there, once.

## 4. Finish

Check the installed plugin version. Then tell the person, in their language:

1. Setup is done.
2. Start a new Work task, type `@`, choose **Fidelity Studio Content
   Assistant** and ask it to check the connection without changing anything.
3. If the Fidelity Studio tools are still missing in that new task, quit the
   app completely (Mac: ⌘Q; Windows: also quit it in the system tray), reopen
   it and start one new Work task.

In German, for example: «Starte jetzt eine neue Work-Aufgabe. Fehlen die
Fidelity-Studio-Tools dort noch, beende die App ganz (⌘Q), öffne sie wieder
und starte nochmals eine neue Work-Aufgabe.»
