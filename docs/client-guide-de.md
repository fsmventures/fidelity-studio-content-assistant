# Fidelity Studio Content Assistant

Kurzanleitung fuer Newsletter und Website-Inhalte.

## Vorbereitung

Du brauchst:

- die ChatGPT Desktop-App auf deinem Mac
- eine Einladung von Fidelity Studio fuer den Website-Zugang
- Zugang zum richtigen Resend-Team fuer Newsletter

Ein GitHub-Konto oder Zugriff auf den Website-Code ist nicht erforderlich. Der
Mac muss fuer Installation und Updates lediglich die oeffentliche
GitHub-Repository erreichen koennen.

## Installation

Oeffne die App `Terminal` und fuehre diese beiden Befehle aus:

```bash
codex plugin marketplace add fsmventures/fidelity-studio-content-assistant --ref main
codex plugin add fidelity-studio-content-assistant@fidelity-studio-content-assistant
```

Pruefe danach die Installation:

```bash
codex plugin list --marketplace fidelity-studio-content-assistant
```

Verbinde danach beide Konten:

```bash
codex mcp login fidelity-studio-content-assistant
codex mcp login resend
```

Bei Fidelity Studio meldest du dich mit der eingeladenen E-Mail-Adresse an. Bei
Resend waehlst du das Team, das die Newsletter verwaltet.

Schliesse ChatGPT nach der Anmeldung vollstaendig und oeffne die App erneut.
Waehle Work oder Codex, oeffne Plugins und aktiviere Fidelity Studio Content
Assistant. Starte danach eine neue Aufgabe. Im normalen Chat-Modus und in der
Mobil-App stehen Plugins nicht zur Verfuegung.

## Erster Test

```text
Zeige mir meinen Fidelity-Studio-Projektkontext und welche Newsletter-, Blog- und Team-Funktionen ich verwenden kann.
```

Der Assistent sollte das richtige Projekt nennen und die verfuegbaren
Arbeitsablaeufe zeigen.

## Newsletter

Du kannst eine E-Mail, einen Text oder Bilder direkt als Ausgangsmaterial
einfuegen oder anhaengen:

```text
Erstelle daraus einen Newsletter-Entwurf in Resend. Verwende noch keine Live-Empfaenger und versende nichts. Zeige mir zuerst Betreff, Absender, Sprache, Zielgruppe und Entwurf.
```

Fuer einen Test:

```text
Sende diesen Entwurf als klar gekennzeichneten Test nur an [E-Mail-Adresse].
```

Ein echter Versand oder eine Terminierung erfolgt erst, nachdem du den finalen
Entwurf und die genaue Zielgruppe bestaetigt hast.

## Blogbeitrag

```text
Erstelle aus diesem Text einen deutschen und englischen Blogbeitrag als Entwurf. Verwende die vorhandenen Autorinnen und Kategorien und veroeffentliche noch nichts.
```

Nach der Vorschau kannst du die Veroeffentlichung ausdruecklich bestaetigen.

## Teammitglied

```text
Liste zuerst die aktuellen Teammitglieder auf. Bereite danach diese Aenderung fuer [Name] als Entwurf vor und veroeffentliche noch nichts: [Aenderung].
```

## Aktualisieren

Fidelity Studio kann neue Plugin-Versionen ueber Git bereitstellen. Fuer ein
Update:

```bash
codex plugin marketplace upgrade fidelity-studio-content-assistant
codex plugin remove fidelity-studio-content-assistant@fidelity-studio-content-assistant
codex plugin add fidelity-studio-content-assistant@fidelity-studio-content-assistant
```

Starte danach eine neue Aufgabe. Projektregeln und Schreibvorgaben werden
automatisch live geladen und benoetigen normalerweise kein Plugin-Update.

## Wenn etwas nicht funktioniert

Wenn keine Fidelity-Studio- oder Resend-Funktionen erscheinen, fuehre die beiden
Login-Befehle erneut aus und starte danach eine neue Aufgabe.

Wenn das Plugin in der App nicht angezeigt wird, wiederhole die
Installationsbefehle und pruefe, ob GitHub erreichbar ist. In einer verwalteten
ChatGPT-Umgebung muss das Plugin eventuell zuerst freigegeben werden.

Wenn der Zugriff verweigert wird, muss Fidelity Studio die verwendete
E-Mail-Adresse fuer das Projekt freischalten. Fuer Resend muss die
E-Mail-Adresse Mitglied des richtigen Teams sein.
