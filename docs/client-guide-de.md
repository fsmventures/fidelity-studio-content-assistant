# Fidelity Studio Content Assistant

Eine einfache Anleitung für Newsletter und Website-Inhalte. Du musst weder
Terminal noch GitHub öffnen.

## Was du brauchst

- die [ChatGPT Desktop-App](https://chatgpt.com/download/) auf deinem Mac oder
  Windows-Computer
- die E-Mail-Adresse, die Fidelity Studio für dich freigeschaltet hat
- Zugang zum richtigen Resend-Team für Newsletter

## 1. Den Assistenten einrichten

1. Öffne die ChatGPT Desktop-App.
2. Wähle **ChatGPT** und wechsle zu **Work**.
3. Starte eine neue Aufgabe.
4. Füge den folgenden Text ein und sende ihn ab:

```text
Bitte richte den Fidelity Studio Content Assistant für mich ein.

Dies ist nur eine Einrichtungsaufgabe. Bearbeite keine Projektdateien und installiere keine andere Software.

Führe die folgenden Terminalbefehle selbst im gemeinsamen Arbeitsbereich aus. Ich möchte kein Terminal öffnen.

codex plugin marketplace add fsmventures/fidelity-studio-content-assistant --ref main
codex plugin add fidelity-studio-content-assistant@fidelity-studio-content-assistant
codex plugin list --marketplace fidelity-studio-content-assistant

Starte danach nacheinander die Anmeldungen bei Fidelity Studio und Resend:

codex mcp login fidelity-studio-content-assistant
codex mcp login resend

Ich möchte keine Passwörter, Codes oder Zugangsschlüssel in den Chat kopieren.

Falls eine Genehmigung oder Browser-Anmeldung erscheint, pausiere, erkläre mir kurz, was erlaubt wird, und sage mir genau, was ich anklicken soll. Bitte verlange keinen Vollzugriff, sondern nur die nötigen einzelnen Genehmigungen.

Falls ein Befehl nicht verfügbar ist oder die Installation nicht dauerhaft gespeichert werden kann, stoppe und erkläre mir genau, was nicht funktioniert. Bitte fordere mich nicht auf, selbst ein Terminal zu öffnen.

Prüfe am Ende, ob das Plugin unter Plugins sichtbar und beide Verbindungen bereit sind. Sage mir danach, dass ich ChatGPT vollständig beenden, erneut öffnen und eine neue Work-Aufgabe starten soll.
```

ChatGPT erledigt die technische Einrichtung. Bestätige nur die beschriebenen
Einrichtungsbefehle und führe die Browser-Anmeldungen durch. Bei Fidelity Studio
verwendest du genau die E-Mail-Adresse, die für dich freigeschaltet wurde. Bei
Resend wählst du das Pilates-Zürich-Team.

Beende ChatGPT danach vollständig, nicht nur das Fenster: auf dem Mac mit
**ChatGPT → Beenden** oder `⌘Q`, unter Windows über **Beenden**. Öffne die App
anschliessend erneut.

## 2. Erster Start

1. Öffne wieder **ChatGPT → Work** und starte eine neue Aufgabe.
2. Tippe `@` und wähle **Fidelity Studio Content Assistant**.
3. Füge diesen Text ein:

```text
Zeige mir meinen Fidelity-Studio-Projektkontext und welche Newsletter-, Blog- und Team-Funktionen ich verwenden kann.
```

## Newsletter erstellen

Du kannst eine E-Mail, einen Text und Bilder direkt in die Aufgabe einfügen oder
anhängen:

```text
Erstelle daraus einen Newsletter-Entwurf in Resend. Versende noch nichts. Zeige mir zuerst Betreff, Absender, Sprache, Zielgruppe und eine Vorschau.
```

Für ein grosses Bild über die ganze Breite eignet sich Querformat am besten.
Hochformatbilder sind ebenfalls möglich, zum Beispiel nebeneinander in einem
zweispaltigen Abschnitt. Der Assistent soll das passende Layout vorschlagen und
keine Bilder ohne Rückfrage stark beschneiden.

Für einen Test:

```text
Sende diesen Entwurf als klar gekennzeichneten Test nur an [E-Mail-Adresse].
```

Der Assistent versendet nur klar gekennzeichnete Tests an ausdrücklich genannte
Adressen. Den endgültigen Versand oder die Terminierung bestätigst du selbst im
Resend-Dashboard.

## Blogbeitrag erstellen

```text
Erstelle aus diesem Text einen deutschen und englischen Blogbeitrag als Entwurf. Verwende die vorhandenen Autorinnen und Kategorien und veröffentliche noch nichts.
```

Nach der Vorschau kannst du die Veröffentlichung ausdrücklich bestätigen.

## Teammitglied bearbeiten

```text
Liste zuerst die aktuellen Teammitglieder auf. Bereite danach diese Änderung für [Name] als Entwurf vor und veröffentliche noch nichts: [Änderung].
```

## Plugin aktualisieren

Öffne in der ChatGPT Desktop-App eine neue **Work**-Aufgabe und füge diesen Text
ein:

```text
Bitte aktualisiere den Fidelity Studio Content Assistant auf die neueste Version. Führe die Aktualisierung selbst aus, prüfe danach die installierte Version und sage mir, wann ich ChatGPT neu starten soll.
```

Projektregeln und Schreibvorgaben werden automatisch live geladen. Dafür ist
normalerweise keine Plugin-Aktualisierung nötig.

## Wenn etwas nicht funktioniert

Öffne in der ChatGPT Desktop-App eine neue **Work**-Aufgabe und füge diesen Text
ein:

```text
Bitte prüfe meine Installation des Fidelity Studio Content Assistant und die Verbindungen zu Fidelity Studio und Resend. Behebe alles, was du selbst beheben kannst, und führe mich bei Anmeldungen oder Genehmigungen Schritt für Schritt durch den Vorgang.
```

Falls der Zugriff verweigert wird, prüfe zuerst, ob du bei Fidelity Studio die
freigeschaltete E-Mail-Adresse und bei Resend das richtige Team verwendest.

Falls **Codex**, **Work** oder **Plugins** in der App nicht angezeigt wird,
aktualisiere zuerst die ChatGPT Desktop-App. In einer verwalteten
ChatGPT-Umgebung muss die zuständige Person das Plugin möglicherweise
freigeben.
