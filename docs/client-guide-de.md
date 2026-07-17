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

Dies ist nur eine Einrichtungsaufgabe. Bearbeite keine Projektdateien und installiere keine andere Software. Führe die nötigen Terminalbefehle selbst im gemeinsamen Arbeitsbereich aus. Ich möchte kein Terminal öffnen.

1. Installiere den Assistenten dauerhaft:

codex plugin marketplace add fsmventures/fidelity-studio-content-assistant --ref main
codex plugin add fidelity-studio-content-assistant@fidelity-studio-content-assistant
codex plugin list --marketplace fidelity-studio-content-assistant

2. Starte zuerst genau einmal diese Anmeldung und warte, bis sie vollständig abgeschlossen ist:

codex mcp login fidelity-studio-content-assistant

Codex öffnet die Anmeldeseite normalerweise selbst. Verwende keinen zusätzlichen open-Befehl, öffne kein zweites Browserfenster und wiederhole den Login nicht, solange der erste Vorgang läuft. Falls Codex ausdrücklich meldet, dass der Browser nicht geöffnet werden konnte, zeige mir den Link zum manuellen Öffnen.

3. Starte erst danach genau einmal:

codex mcp login resend

Versuche nicht, die von Resend vorgegebenen Berechtigungen mit eigenen Scopes zu verändern. Erkläre mir verständlich, dass Resend möglicherweise breiten Zugriff auf das ausgewählte Konto verlangt. Ich entscheide dann, ob ich das richtige Kunden-Team verbinde oder die Anmeldung abbreche. Wenn ich abbreche, sollen die Website-Funktionen trotzdem verfügbar bleiben.

Ich kopiere keine Passwörter, Codes, Zugangsschlüssel oder Tokens in den Chat. Falls eine Genehmigung oder Browser-Anmeldung erscheint, pausiere, erkläre mir kurz, was erlaubt wird, und sage mir genau, was ich anklicken soll.

Falls ein Befehl nicht verfügbar ist oder die Installation nicht dauerhaft gespeichert werden kann, stoppe und erkläre mir genau, was nicht funktioniert. Bitte fordere mich nicht auf, selbst ein Terminal zu öffnen.

Prüfe am Ende die installierte Plugin-Version. Sage mir danach, dass ich eine neue Work-Aufgabe starten soll. Ein vollständiger Neustart der App ist nur nötig, wenn die Werkzeuge auch in der neuen Aufgabe fehlen.
```

ChatGPT erledigt die technische Einrichtung. Bestätige nur die beschriebenen
Installationsschritte und führe die Browser-Anmeldungen durch. Bei Fidelity
Studio verwendest du genau die E-Mail-Adresse, die für dich freigeschaltet
wurde. Bei Resend wählst du das Kunden-Team, das dir Fidelity Studio genannt
hat.

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
3. Prüfe bei Resend mit reinen Leseabfragen das verbundene Team sowie vorhandene Templates, Broadcasts und Zielgruppen.
4. Berichte getrennt, ob Fidelity Studio und Resend einsatzbereit sind.

Zeige keine Tokens oder Zugangsdaten an.
```

Damit wird nicht nur geprüft, ob eine Anmeldung gespeichert ist, sondern ob die
Funktionen wirklich erreichbar sind.

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
Bitte prüfe meine Installation des Fidelity Studio Content Assistant und die Verbindungen zu Fidelity Studio und Resend. Behebe alles, was du selbst beheben kannst. Starte jeden Login höchstens einmal und führe mich bei Anmeldungen oder Genehmigungen Schritt für Schritt durch den Vorgang. Öffne keine doppelten Browserfenster. Prüfe die Verbindungen danach mit echten, ungefährlichen Leseabfragen in einer neuen Work-Aufgabe.
```

Erst wenn die Werkzeuge auch in dieser neuen Aufgabe fehlen, beende ChatGPT
vollständig und öffne die App erneut.

Falls der Zugriff verweigert wird, prüfe, ob du bei Fidelity Studio die
freigeschaltete E-Mail-Adresse und bei Resend das von Fidelity Studio genannte
Kunden-Team verwendest.

Falls **Work** oder **Plugins** in der App nicht angezeigt wird, aktualisiere
zuerst die ChatGPT Desktop-App. In einer verwalteten ChatGPT-Umgebung muss die
zuständige Person das Plugin möglicherweise freigeben.
