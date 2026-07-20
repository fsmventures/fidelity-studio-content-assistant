# Fidelity Studio Content Assistant

Eine einfache Anleitung für Newsletter und Website-Inhalte. Du musst weder
Terminal noch GitHub öffnen.

## Was du brauchst

- die [ChatGPT Desktop-App](https://chatgpt.com/download/) auf deinem Mac oder
  Windows-Computer
- die E-Mail-Adresse, die Fidelity Studio für dich freigeschaltet hat
- nur falls dein Projekt Newsletter über Resend verwendet: Zugang zum richtigen
  Resend-Team

## 1. Den Assistenten einrichten

1. Öffne die ChatGPT Desktop-App.
2. Wähle **ChatGPT** und wechsle zu **Work**.
3. Starte eine neue Aufgabe.
4. Füge den folgenden Text ein und sende ihn ab:

```text
Bitte richte den Fidelity Studio Content Assistant für mich ein.

Dies ist nur eine Einrichtungsaufgabe. Bearbeite keine Projektdateien. Führe die nötigen Befehle selbst im gemeinsamen Arbeitsbereich aus; ich möchte kein Terminal öffnen.

1. Prüfe zuerst das Betriebssystem. Unter Windows führe das wiederholbar nutzbare Fidelity-Setup direkt in 64-Bit-Windows-PowerShell aus:

irm https://raw.githubusercontent.com/fsmventures/fidelity-studio-content-assistant/main/scripts/setup-windows.ps1 | iex

Das Skript darf bei Bedarf nur die offizielle eigenständige Codex CLI und Git for Windows über winget installieren. Installiere Node.js oder npm nicht nur für Codex und ändere die PowerShell-Ausführungsrichtlinie nicht. Eine WindowsApps-Zugriffssperre wird nicht durch «Für mich genehmigen», Vollzugriff oder einen anderen Sandbox-Modus behoben.

Unter macOS oder Linux prüfe zuerst, ob codex und Git ausführbar sind. Füge den Marketplace nur hinzu, wenn er fehlt; andernfalls aktualisiere ihn. Installiere oder aktualisiere danach den Assistenten und prüfe Version sowie MCP-Registrierungen mit JSON-Ausgaben. Verwende diese Codex-Befehle als Grundlage:

codex plugin marketplace add fsmventures/fidelity-studio-content-assistant --ref main --json
codex plugin marketplace upgrade fidelity-studio-content-assistant --json
codex plugin add fidelity-studio-content-assistant@fidelity-studio-content-assistant --json
codex plugin list --marketplace fidelity-studio-content-assistant --json
codex mcp list --json

Falls ein vorhandener Plugin-Cache trotz Marketplace-Aktualisierung veraltet bleibt, entferne nur dieses Plugin und installiere es erneut. Prüfe danach erneut die tatsächlich installierte Version.

2. Starte danach genau einmal die Fidelity-Studio-Anmeldung und warte, bis sie vollständig abgeschlossen ist:

codex mcp login fidelity-studio-content-assistant

Codex öffnet die Anmeldeseite normalerweise selbst. Verwende keinen zusätzlichen open-Befehl, öffne kein zweites Browserfenster und wiederhole den Login nicht, solange der erste Vorgang läuft. Falls Codex ausdrücklich meldet, dass der Browser nicht geöffnet werden konnte, zeige mir den Link zum manuellen Öffnen.

3. Starte Resend jetzt noch nicht. Der nächste Schritt muss zuerst in einer neuen Work-Aufgabe den authentifizierten Fidelity-Studio-Projektkontext laden. Nur wenn dieser Projektkontext ausdrücklich Newsletter mit Anbieter Resend deklariert, darf dort genau eine Resend-Anmeldung gestartet werden.

Ich kopiere keine Passwörter, Codes, Zugangsschlüssel oder Tokens in den Chat. Falls eine Genehmigung oder Browser-Anmeldung erscheint, pausiere, erkläre mir kurz, was erlaubt wird, und sage mir genau, was ich anklicken soll.

Falls unter Windows codex.exe aus WindowsApps mit «Zugriff verweigert» fehlschlägt, verwende das offizielle eigenständige Codex-Installationsskript aus Schritt 1 und prüfe den exakt aufgelösten Pfad ausserhalb von WindowsApps. Falls Git fehlt, installiere Git for Windows über winget, aktualisiere den PATH des laufenden Prozesses und prüfe git --version, bevor du den Marketplace erneut versuchst. Falls dies nicht funktioniert, stoppe mit dem genauen Pfad und Fehler. Bitte fordere mich nicht auf, selbst ein Terminal zu öffnen.

Prüfe am Ende die installierte Plugin-Version. Sage mir danach, dass ich eine neue Work-Aufgabe starten soll. Ein vollständiger Neustart der App ist nur nötig, wenn die Werkzeuge auch in der neuen Aufgabe fehlen.
```

ChatGPT erledigt die technische Einrichtung. Bestätige nur die beschriebenen
Installationsschritte und führe die Fidelity-Studio-Anmeldung durch. Verwende
dabei genau die E-Mail-Adresse, die für dich freigeschaltet wurde. Ob Resend für
dieses Projekt benötigt wird, entscheidet erst der authentifizierte
Projektkontext im nächsten Schritt.

Die Fidelity-Anmeldung zeigt dir verständlich alle angeforderten Rechte für
Lesen, Entwürfe, Bilder und Änderungen. Eine Live-Veröffentlichung kann damit
nur vorbereitet werden; die endgültige Freigabe erfolgt später für jeden
einzelnen Vorgang auf einer separaten Fidelity-Studio-Seite.

Klicke auf **Zugriff erlauben** nur einmal. Danach kehrt der Browser normalerweise
automatisch zu ChatGPT/Codex zurück. Falls das nicht passiert, klicke auf der
Bestätigungsseite einmal auf **Zurück zu ChatGPT/Codex**. Starte den Login nicht
erneut.

## 2. Verbindung prüfen

1. Starte nach der Einrichtung eine **neue Work-Aufgabe**. Du musst ChatGPT
   normalerweise nicht beenden.
2. Tippe `@` und wähle **Fidelity Studio Content Assistant**.
3. Füge diesen Text ein:

```text
Bitte prüfe meine Verbindungen, ohne etwas zu verändern:

1. Lade meinen Fidelity-Studio-Projektkontext.
2. Liste alle vorhandenen Blogbeiträge und Teammitglieder auf.
3. Prüfe im geladenen Projektkontext, ob Newsletter aktiviert sind und als Anbieter ausdrücklich Resend genannt wird.
4. Nur falls beides zutrifft: Prüfe mit reinen Resend-Leseabfragen das verbundene Team sowie vorhandene Templates, Broadcasts und Zielgruppen. Falls die Resend-Werkzeuge fehlen oder noch nicht authentifiziert sind, starte genau einmal codex mcp login resend, warte auf den automatisch geöffneten Browser und sage mir danach, dass ich eine neue Work-Aufgabe starten und diese Prüfung wiederholen soll. Öffne kein zweites Browserfenster und starte keinen zweiten Login.
5. Falls der Projektkontext Resend nicht ausdrücklich verlangt, starte keine Resend-Anmeldung und melde «Website-Funktionen einsatzbereit; Resend für dieses Projekt nicht erforderlich».
6. Berichte Fidelity Studio und – nur falls erforderlich – Resend getrennt. Verlasse dich nicht allein auf auth_status, sondern auf die echten Leseabfragen.

Zeige keine Tokens oder Zugangsdaten an.
```

Damit wird nicht nur geprüft, ob eine Anmeldung gespeichert ist, sondern ob die
Funktionen wirklich erreichbar sind. Falls Resend benötigt und neu verbunden
wurde, starte danach eine weitere neue Work-Aufgabe und führe denselben
Prüftext nochmals aus. Bei Resend wählst du das Kunden-Team, das dir Fidelity
Studio genannt hat. Resend kann dabei die vom Anbieter festgelegten, breiten
Kontorechte verlangen; verwende keine eigenen Scopes. Wenn du die Anmeldung
ablehnst, bleiben die Website-Funktionen verfügbar.

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

Der Assistent ist angewiesen, direkte Resend-Nutzung auf Entwürfe und klar
gekennzeichnete Tests an ausdrücklich genannte Adressen zu beschränken. Den
endgültigen Versand oder die Terminierung bestätigst du selbst im
Resend-Dashboard.

## Blogbeiträge

Vorhandene Beiträge anzeigen:

```text
Liste alle vorhandenen Blogbeiträge mit Titel, Sprache und Status auf. Verändere nichts.
```

Einen Beitrag vorbereiten:

```text
Erstelle aus diesem Text einen deutschen und englischen Blogbeitrag als Entwurf. Verwende die vorhandenen Autorinnen und Kategorien und veröffentliche noch nichts.
```

Wenn der Text bereit ist:

```text
Stelle diesen Beitrag zuerst auf der Vorschau-Website bereit und gib mir die geprüften Vorschau-Links. Veröffentliche ihn noch nicht auf der Live-Website. Frage mich nach meiner Freigabe, nachdem ich die Vorschau geprüft habe.
```

Der Assistent wartet, bis die Vorschau technisch bereit ist. Du kannst danach
Änderungen verlangen, die Veröffentlichung zurückstellen oder die genaue
Vorschau für die Live-Website freigeben. Erst nach deiner ausdrücklichen
Bestätigung gibt dir ChatGPT einen Link zu `cms.fidelitystudio.ch`. Dort meldest
du dich an und siehst Projekt, Änderung und den genauen geprüften Stand. Erst
wenn du auf dieser Fidelity-Studio-Seite **Jetzt live veröffentlichen**
bestätigst, startet die Produktion. Der Assistent prüft sie danach und gibt dir
die echten Live-Links.

## Teammitglieder

```text
Liste zuerst die aktuellen Teammitglieder auf. Bereite danach diese Änderung für [Name] als Entwurf vor und veröffentliche noch nichts: [Änderung].
```

Auch Teamänderungen werden zuerst auf der Vorschau-Website geprüft. Der
Assistent fragt separat, bevor er genau diese Version auf der Live-Website
veröffentlicht. Die Live-Veröffentlichung startet erst nach deiner Bestätigung
auf der separaten Fidelity-Studio-Seite.

## Plugin aktualisieren

Öffne eine neue **Work-Aufgabe** und füge diesen Text ein:

```text
Bitte aktualisiere den Fidelity Studio Content Assistant auf die neueste Version. Führe die Aktualisierung selbst aus, bearbeite keine Projektdateien und prüfe danach die installierte Version.

Wenn ich von einer Version vor 0.4.0 aktualisiere, starte danach genau einmal:

codex mcp login fidelity-studio-content-assistant

Warte auf das automatisch geöffnete Browserfenster und öffne kein zweites. Diese einmalige neue Anmeldung wird benötigt, damit der Assistent eine Live-Veröffentlichung zur separaten Freigabe auf der Fidelity-Studio-Seite vorbereiten kann.

Sage mir anschliessend, dass ich eine neue Work-Aufgabe mit dem Plugin starten und den Verbindungstest ausführen soll. Ein vollständiger Neustart der App ist nur nötig, wenn die Werkzeuge dort weiterhin fehlen.
```

Projektregeln und Schreibvorgaben werden nach der Anmeldung live von Fidelity
Studio geladen. Änderungen an Farben, Sprachen, Website-Adressen oder Abläufen
benötigen deshalb normalerweise keine Plugin-Aktualisierung.

Starte nach dem Update eine neue Work-Aufgabe und verwende nochmals den
Prüftext aus **Verbindung prüfen**. Prüfe im Projektkontext zusätzlich, ob die
Produktionsveröffentlichung verfügbar ist. Die Versionsnummer allein beweist
noch nicht, dass beide Verbindungen und die neue Berechtigung funktionieren.

## Wenn etwas nicht funktioniert

Fehlen die Werkzeuge in einer bereits geöffneten Aufgabe, starte zuerst einfach
eine **neue Work-Aufgabe** und wähle das Plugin erneut. Das reicht nach einer
Installation oder Anmeldung normalerweise aus.

Falls die Werkzeuge auch dort fehlen, füge in einer neuen Work-Aufgabe diesen
Text ein:

```text
Bitte prüfe meine Installation des Fidelity Studio Content Assistant und zuerst die Verbindung zu Fidelity Studio. Behebe alles, was du selbst beheben kannst. Unter Windows verwende das offizielle eigenständige Codex-Installationsskript, falls WindowsApps codex.exe blockiert, und prüfe Git vor dem repository-basierten Marketplace. Installiere Node.js oder npm nicht nur für Codex und ändere weder PowerShell-Ausführungsrichtlinie noch Sandbox-Modus als vermeintliche Reparatur für «Zugriff verweigert». Starte jeden Login höchstens einmal und führe mich bei Anmeldungen oder Genehmigungen Schritt für Schritt durch den Vorgang. Öffne keine doppelten Browserfenster. Prüfe Fidelity danach in einer neuen Work-Aufgabe mit echten, ungefährlichen Leseabfragen. Lade zuerst get_project_context und verbinde Resend nur dann, wenn der Projektkontext Newsletter mit Anbieter Resend ausdrücklich verlangt.
```

Erst wenn die Werkzeuge auch in dieser neuen Aufgabe fehlen, beende ChatGPT
vollständig und öffne die App erneut.

Falls der Zugriff verweigert wird, prüfe, ob du bei Fidelity Studio die
freigeschaltete E-Mail-Adresse und bei Resend das von Fidelity Studio genannte
Kunden-Team verwendest.

Falls **Work** oder **Plugins** in der App nicht angezeigt wird, aktualisiere
zuerst die ChatGPT Desktop-App. In einer verwalteten ChatGPT-Umgebung muss die
zuständige Person das Plugin möglicherweise freigeben.
