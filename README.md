# Tauschplatz

Eine oeffentliche Tauschboerse, auf der Besucher Angebote und Gesuche posten koennen.

## Lokal testen

Oeffne `index.html` im Browser. Ohne Firebase speichert die Seite Beitraege nur in deinem Browser per `localStorage`.

## Oeffentlich machen

1. Erstelle kostenlos ein Firebase-Projekt.
2. Aktiviere Firestore Database.
3. Ersetze in `script.js` die leeren Werte in `firebaseConfig`.
4. Kopiere die Regeln aus `firestore.rules` in die Firestore Rules.
5. Veröffentliche die Dateien kostenlos, zum Beispiel mit GitHub Pages, Netlify oder Cloudflare Pages.

## Firestore Collection

Die Seite nutzt die Collection `posts` mit diesen Feldern:

- `type`: `offer` oder `request`
- `title`
- `description`
- `location`
- `contact`
- `createdAt`

## Wichtig

Damit wirklich alle Besucher dieselben Beitraege sehen, brauchst du ein Backend wie Firebase.
Eine reine HTML-Datei kann keine oeffentlichen Beitraege fuer alle Nutzer speichern.
Bei einer echten oeffentlichen Seite brauchst du ausserdem Moderation gegen Spam und unerlaubte Inhalte.
