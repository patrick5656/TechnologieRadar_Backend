# Anleitung

## App starten
Die Applikation benötigt NodeJs sowie den npm package manager.

Um zu prüfen ob NodeJS installiert ist:
* `node -v`

Um zu prüfen ob npm installiert ist:
* `npm -v`

Es müssen zunächst alle Dependencies installiert werden.
* `npm install`


Die Applikation benötigt eine MySQL Datenbank. Die Tabellen müssen mit dem "my_sql_init.sql" erstellt werden.
Mit docker-compose kann das stack.local.yml verwendet werden, um eine MySQL Datenbank über Docker zu verwenden.

Die Datei ".env.dist" muss kopiert werden und zu ".env" umbenannt werden und die Zugangsdaten müssen korrekt gesetzt werden

Anschliessend kann die Applikation gestartet werden.
* `nodemon index.js`

## Tests ausführen

Unittests ausführen:
* `npm test`

