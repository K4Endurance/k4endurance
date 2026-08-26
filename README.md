# K4 Endurance – Vollständiges Datei-Paket

Diese Struktur spiegelt dein GitHub-Pages-Repo. Alles hier kann 1:1 an der
gleichen Stelle im Repo abgelegt werden (ersetzen bzw. neu anlegen).

## Geändert – diese Dateien wurden in diesem Chat angepasst

| Datei hier | Ziel im Repo | Was geändert wurde |
|---|---|---|
| `index.html` | `/index.html` | Neue Startseite; Footer jetzt statisch; DE\|EN-Umschalter in der Nav |
| `assets/css/style.css` | `/assets/css/` | + Styling für den Sprachumschalter |
| `assets/js/main.js` | `/assets/js/` | Neu |
| `_layouts/home.html` | `/_layouts/` | Neu – eigenes Layout nur für die Startseite, ohne Bulma/head.html/navbar.html/footer.html |
| `_layouts/post.html` | `/_layouts/` | Footer jetzt statisch (vorher kaputter `site.data.home`-Verweis) |
| `_includes/footer.html` | `/_includes/` | Footer jetzt statisch (Copyright/Datenschutz-Link hardcodiert); Sprachumschaltung der Labels bleibt |
| `blog/index.html` | `/blog/` | Footer jetzt statisch (vorher kaputter `site.data.home`-Verweis) |
| `.pages.yml` | `/.pages.yml` | `Navigation (DE/EN)`, `Rechner (DE/EN)`, `Startseite (DE/EN)` entfernt – hatten keine Funktion mehr |

## Gelöscht – hatten keinen Verwendungszweck mehr

`_data/home_de.yml`, `_data/home_en.yml` – nichts im Code liest diese Dateien mehr, seit der Footer überall statisch ist.

## Unverändert – 1:1 deine Originale, nur zur Vollständigkeit mit dabei

| Datei hier | Ziel im Repo |
|---|---|
| `_config.yml` | `/_config.yml` |
| `_layouts/default.html` | `/_layouts/default.html` |
| `_includes/head.html` | `/_includes/head.html` |
| `_includes/navbar.html` | `/_includes/navbar.html` |
| `_data/navbar_de.yml` | `/_data/navbar_de.yml` |
| `_data/navbar_en.yml` | `/_data/navbar_en.yml` |
| `_posts/2026-06-21-plyorechner.md` | `/_posts/2026-06-21-plyorechner.md` |
| `plyorechner-widget.html` | ⚠️ Speicherort unklar – siehe Hinweis unten |

**Zu `navbar.html`/`navbar_de.yml`/`navbar_en.yml`:** Diese sind seit dem Startseiten-Relaunch technisch verwaist (keine aktuelle Seite bindet `navbar.html` mehr ein) – bewusst unangetastet gelassen, das war nicht Teil dieser Anfrage. Falls du sie irgendwann auch aufräumen willst, sag Bescheid.

**Zu `plyorechner-widget.html`:** Das ist dein Plyometrics-Rechner-Snippet. Wir haben nie gesehen, auf welcher Seite/in welchem Include er aktuell tatsächlich eingebunden ist (vermutlich `/tools/` oder ähnlich) – der Dateiname/Pfad hier ist daher nur ein Platzhalter. Bitte an der richtigen Stelle in deinem Repo einsetzen, nicht blind überschreiben.

`k4endurance-design-guide.md` liegt nur zu deiner Referenz bei – kein Repo-Pfad, nicht hochladen.

## Offene Punkte (unverändert aus dem Chatverlauf)

- Nav-Links auf der neuen Startseite (`Coaching`, `Trainingspläne`, `Über mich`) zeigen noch auf `#`.
- Kein Kontaktweg mehr auf der neuen Startseite (alte Seite hatte `#contact`-Formular).
- `EN`-Link im neuen Sprachumschalter zeigt auf `/en/` – diese Seite existiert noch nicht (404 bis sie gebaut ist).

