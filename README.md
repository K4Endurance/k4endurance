# K4 Endurance – Vollständiges Datei-Paket

Diese Struktur spiegelt dein GitHub-Pages-Repo. Alles hier kann 1:1 an der
gleichen Stelle im Repo abgelegt werden (ersetzen bzw. neu anlegen).

## Geändert – diese 6 Dateien wurden in diesem Chat angepasst

| Datei hier | Ziel im Repo | Was geändert wurde |
|---|---|---|
| `index.html` | `/index.html` | Komplett neue Startseite (ersetzt die alte Bulma-Version) |
| `assets/css/style.css` | `/assets/css/` | Neu |
| `assets/js/main.js` | `/assets/js/` | Neu |
| `_layouts/home.html` | `/_layouts/` | Neu – eigenes Layout nur für die Startseite, ohne Bulma/head.html/navbar.html/footer.html |
| `_layouts/post.html` | `/_layouts/` | Footer-Bug behoben (`site.data.home` → `site.data.home_de`) |
| `blog/index.html` | `/blog/` | Gleicher Footer-Bug behoben |

## Unverändert – 1:1 deine Originale, nur zur Vollständigkeit mit dabei

| Datei hier | Ziel im Repo |
|---|---|
| `_config.yml` | `/_config.yml` |
| `.pages.yml` | `/.pages.yml` |
| `_layouts/default.html` | `/_layouts/default.html` |
| `_includes/head.html` | `/_includes/head.html` |
| `_includes/navbar.html` | `/_includes/navbar.html` |
| `_includes/footer.html` | `/_includes/footer.html` |
| `_data/home_de.yml` | `/_data/home_de.yml` |
| `_data/home_en.yml` | `/_data/home_en.yml` |
| `_data/navbar_de.yml` | `/_data/navbar_de.yml` |
| `_data/navbar_en.yml` | `/_data/navbar_en.yml` |
| `_posts/2026-06-21-plyorechner.md` | `/_posts/2026-06-21-plyorechner.md` |
| `plyorechner-widget.html` | ⚠️ Speicherort unklar – siehe Hinweis unten |

**Zu `plyorechner-widget.html`:** Das ist dein Plyometrics-Rechner-Snippet. Wir haben nie gesehen, auf welcher Seite/in welchem Include er aktuell tatsächlich eingebunden ist (vermutlich `/tools/` oder ähnlich) – der Dateiname/Pfad hier ist daher nur ein Platzhalter. Bitte an der richtigen Stelle in deinem Repo einsetzen, nicht blind überschreiben.

`k4endurance-design-guide.md` liegt nur zu deiner Referenz bei – kein Repo-Pfad, nicht hochladen.

## Offene Punkte (unverändert aus dem Chatverlauf)

- Nav-Links auf der neuen Startseite (`Coaching`, `Trainingspläne`, `Über mich`) zeigen noch auf `#`.
- Kein Kontaktweg mehr auf der neuen Startseite (alte Seite hatte `#contact`-Formular).
- Keine englische Version der neuen Startseite.
- „Navigation (DE/EN)" in PagesCMS wirkt sich aktuell auf keine Seite mehr aus – neue Startseite, Blog-Übersicht und Posts haben alle drei eigene, hardcodierte Navigation statt `_includes/navbar.html` zu nutzen.
