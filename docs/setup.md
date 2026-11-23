# Fidelity Studio Content Assistant: setup steps

Fidelity Studio publishes these steps for its clients. A client who wants to
change their website and newsletter content in chat asks ChatGPT, in a Work
task of the ChatGPT desktop app, to carry them out on their own computer:
they paste one sentence that names this page. The steps install the Fidelity
Studio plugin and sign the client in to Fidelity Studio once. They ask for no
password, code or key, and they change nothing on the website.

The client does not want to open a terminal and does not need GitHub, so
ChatGPT runs the commands below for them in that task.

If this task cannot run commands on the client's own computer (a task in the
cloud, ChatGPT in the browser), the setup cannot work here: send the client
only the stop message under «First», in their language, and end the task.

## Ground rules

- Talk to the person in the language they wrote to you in, in short, friendly
  sentences. In German, use Swiss spelling (ss, never the sharp s).
- This is a setup task only. Do not edit any project files.
- Never ask for passwords, codes, access keys or tokens in the chat, and never
  show any.
- When an approval prompt or a browser sign-in appears, pause, say in one
  sentence what it allows, and tell them exactly what to click.
- Start each sign-in at most once. Do not open a second browser window.
- ChatGPT's web tool cannot open `mcp.fidelitystudio.ch`. Every later step runs
  in the shell; if you need this guide again, open it at
  https://github.com/fsmventures/fidelity-studio-content-assistant/blob/main/docs/setup.md.
- Everything you tell the person names the ChatGPT desktop app, **Work** and
  **On your computer**. Never mention «Codex», «local folder» or «lokaler
  Ordner» to them: clients do not use Codex and never choose a folder. Your own
  technical steps (config paths, commands) may name Codex, but nothing you tell
  the person may. If you run in ChatGPT in the browser and cannot run commands,
  send the stop message below; do not suggest Codex or another app.

## First: check that this task runs on the person's computer

The setup writes the plugin into the Codex settings on the computer it runs on:
`config.toml` and the plugin cache in the Codex home folder (`$CODEX_HOME`,
otherwise `~/.codex`). That only lasts when this task runs on the person's own
computer: a local Work task in the ChatGPT desktop app, where the person chose
**On your computer** as the place to run. A task in the cloud or in a browser
cannot install anything their app will see. Check this before you install,
download or test anything:

1. If your environment says you run in the cloud, in a browser, on a remote
   computer or in a container, stop now and send the stop message below. A
   Work chat that runs in the cloud runs its commands on a cloud computer, not
   on theirs, even when its browser can open this page.
2. If your shell reports Linux and the person has not said they use Linux,
   stop as well. The ChatGPT desktop app runs on Mac and Windows; cloud tasks
   run on Linux.
3. Otherwise run this write test. It creates one empty file in the Codex home
   folder and removes it again; nothing else changes.

   macOS:

   ```bash
   codex_home="${CODEX_HOME:-$HOME/.codex}"
   mkdir -p "$codex_home" && : > "$codex_home/.fidelity-studio-write-test" && rm "$codex_home/.fidelity-studio-write-test" && echo "write test ok"
   ```

   Windows PowerShell:

   ```powershell
   $codexHome = if ($env:CODEX_HOME) { $env:CODEX_HOME } else { Join-Path $HOME ".codex" }
   $probe = Join-Path $codexHome ".fidelity-studio-write-test"
   New-Item -ItemType Directory -Force -Path $codexHome | Out-Null
   New-Item -ItemType File -Force -Path $probe | Out-Null
   Remove-Item -LiteralPath $probe
   "write test ok"
   ```

4. In a local task the sandbox normally blocks this first write ("Operation not
   permitted", "access denied"). The install needs the same permission, so
   ask for approval to run it outside the sandbox, once. When it prints
   `write test ok`, continue with step 1.
5. Stop when the write still fails after approval ("Permission denied",
   "Read-only file system", "access denied"), or when you cannot ask for
   approval.

Never work around a failed check. Do not point `CODEX_HOME` at another folder,
do not install into a temporary folder as a test, and do not go on with the
next steps: such an install disappears and the person's app never sees it.

When you stop, send only this message, in the person's language, and end the
task. In German:

> Hier kann ich den Fidelity Studio Content Assistant leider nicht einrichten:
> Diese Aufgabe läuft nicht auf deinem Computer. So klappt es:
>
> 1. Öffne die ChatGPT-Desktop-App auf deinem Computer, nicht ChatGPT im Browser.
>    Windows: Startmenü, «ChatGPT». Mac: Ordner «Programme», «ChatGPT». Fehlt
>    die App, lade sie unter https://chatgpt.com/download/ herunter.
> 2. Wechsle in der App zu **Work** und starte eine neue Aufgabe.
> 3. Wähle beim Eingabefeld, wo die Aufgabe läuft: **On your computer** (auf
>    Deutsch «Auf deinem Computer»), nicht **In the cloud**.
> 4. Füge denselben Satz nochmals ein und sende ihn ab: Richte den Fidelity
>    Studio Content Assistant auf meinem Computer ein und folge dazu der
>    Anleitung https://github.com/fsmventures/fidelity-studio-content-assistant/blob/main/docs/setup.md

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
2. Start a new Work task in the ChatGPT desktop app, again **On your
   computer**, type `@`, choose
   **Fidelity Studio Content Assistant** and ask it to check the connection
   without changing anything.
3. If the Fidelity Studio tools are still missing in that new task, quit the
   app completely, reopen it and start one new Work task. Mac: ⌘Q. Windows:
   close the ChatGPT window; if a ChatGPT icon shows at the bottom right of the
   taskbar, right-click it and choose «Beenden» (Quit).

In German, for example: «Starte jetzt in der ChatGPT-Desktop-App eine neue
Work-Aufgabe, wieder auf deinem Computer (On your computer). Fehlen die
Fidelity-Studio-Tools dort noch, beende die App ganz: Mac: ⌘Q. Windows:
Schliesse das ChatGPT-Fenster; siehst du unten rechts in der Taskleiste ein
ChatGPT-Symbol, klicke es mit der rechten Maustaste an und wähle «Beenden».
Öffne die App dann wieder und starte nochmals eine neue Work-Aufgabe.»
