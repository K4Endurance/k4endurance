# K4ENDURANCE – Design Guide
*Stand: Homepage-Redesign (fixed version), Juli 2026*

---

## 1. Komplexitäts-Bewertung der `style.css`

**Kurz gesagt: Die Datei ist nicht komplex, aber sie hat einen blinden Fleck.**

**Zahlen:**
- 1042 Zeilen, aber sehr großzügig formatiert (eine Property pro Absatz) – der tatsächliche Informationsgehalt entspricht eher ~350–400 kompakten Zeilen.
- 96 Regelblöcke, 42 Top-Level-Klassen, nur 4 `@media`-Queries.
- Keine tief verschachtelten Selektoren, kein `!important`, durchgehend Klassen mit Specificity 0-1-0. Das ist strukturell sauber und einfach zu erweitern.

**Architektur-Muster:** Die Datei folgt (vermutlich unbewusst) einem anerkannten Ansatz, der als **CUBE CSS** bekannt ist – **C**omposition (`.stack`, `.cluster`, `.grid`), **U**tility (`.container`, `.surface`), **B**lock (`.button`, `.card`, `.stats`, `.steps`), **E**xception (`-primary`, `-muted`, `-lg`, `-center`). Das ist ein guter, gut dokumentierter Ansatz – kein Homebrew-Chaos.

**Der eine echte Schwachpunkt – totes Token-System:**

Von 37 definierten Custom Properties werden nur 22 tatsächlich per `var()` verwendet. **15 sind komplett tot:**

| Kategorie | Definiert, aber ungenutzt |
|---|---|
| Font-Size-Skala | `--fs-xs`, `--fs-sm`, `--fs-md`, `--fs-lg` |
| Font-Weight-Skala | `--fw-normal`, `--fw-medium`, `--fw-semibold`, `--fw-bold`, `--fw-black` |
| Spacing-Skala | `--gap-xs`, `--gap-sm`, `--gap-lg`, `--gap-xl`, `--gap-2xl` |
| Sonstige | `--radius-sm`, `--shadow-lg` |

Stattdessen stehen im Code Hardcoded-Werte wie `font-size:.85rem`, `font-weight:700`, `padding:2rem`. Das ist aktuell kein Bug – die Seite funktioniert –, aber es ist die Stelle, an der Inkonsistenz entsteht, sobald mehr Seiten dazukommen: Die nächste Person (oder du in drei Monaten) tippt einfach `font-size:.9rem` statt `var(--fs-sm)`, weil nichts erzwingt, die Skala zu benutzen.

**Zweiter kleiner Punkt:** Namenskonvention ist gemischt. Fast alles ist "flaches" Utility-Naming (`.card-muted`, `.button-lg`), aber `.section--alt` / `.section--dark` nutzen BEM-Doppelstrich. Nicht falsch, aber zwei Konventionen in einer Datei.

**Fazit:** Kein Rewrite nötig. Aber: **Bevor du Seite 2 baust, entscheide dich bewusst, ob du die Typo-/Spacing-Skala nutzt oder sie streichst.** Dieser Guide geht davon aus, dass du sie ab jetzt nutzt (siehe Abschnitt 2) – das ist der einzige Change, der die Konsistenz über mehrere Seiten hinweg absichert.

---

## 2. Design Tokens (`:root`)

### Farben
| Token | Wert | Verwendung |
|---|---|---|
| `--color-bg` | `#FAF8F4` | Seitenhintergrund (body) |
| `--color-surface` | `#FFFFFF` | Weiße Section, Cards |
| `--color-surface-alt` | `#F4F3EF` | `.section--alt` Hintergrund |
| `--color-text` | `#1C1B19` | Fließtext-Farbe, dunkle Section-BG, Footer-BG |
| `--color-text-light` | `#666` | Absätze, sekundärer Text |
| `--color-primary` | `#E8380D` | Burnt Orange – Haupt-CTA (Button primary) |
| `--color-secondary` | `#0077B6` | Blau – Akzent für Icons, Links, Bullet-Points, Stat-Border |
| `--color-border` | `#E5E5E5` | Card-Rand, Header-Rand |

⚠️ Zwei Akzentfarben: Orange (`--color-primary`) und Blau (`--color-secondary`) werden hier bewusst parallel genutzt – Orange für Haupt-CTAs, Blau für Icons/Links/Bullet-Points. Das ist kein Bug, aber eine bewusste Markenentscheidung: Die Seite hat jetzt zwei Akzentfarben statt einer. Halte dich an dieses Muster (nicht z. B. Blau auch für CTAs verwenden), sonst verwässert die Hierarchie zwischen "Haupt-Aktion" und "Sekundär-Akzent".

### Typografie
| Token | Wert | Genutzt für |
|---|---|---|
| `--font-heading` | `"Barlow Condensed"` | h1–h4, Buttons, Eyebrow, Step-Nummern |
| `--font-body` | `"Barlow"` | Fließtext (body) |
| `--fs-h1` | `clamp(3.5rem, 8vw, 6rem)` | h1 |
| `--fs-h2` | `clamp(2.5rem, 5vw, 4rem)` | h2 |
| `--fs-h3` | `clamp(1.5rem, 3vw, 2rem)` | h3 |
| `--fs-lg` / `--fs-md` / `--fs-sm` / `--fs-xs` | `1.35 / 1.125 / 1 / .875rem` | **Aktuell ungenutzt** – für Body-Text-Varianten (Lead-Paragraph, Caption etc.) einsetzen statt neue Werte zu erfinden |
| `--fw-normal…--fw-black` | `400–800` | **Aktuell ungenutzt** – überall `font-weight:700` hardcoded; künftig `var(--fw-bold)` nutzen |

### Layout & Spacing
| Token | Wert | Verwendung |
|---|---|---|
| `--container` | `1280px` | max. Inhaltsbreite |
| `--section-padding` | `clamp(5rem, 10vw, 8rem)` | vertikaler Section-Abstand |
| `--gap-md` | `1.5rem` | einzig genutzter Spacing-Token (Mobile-Nav-Padding) |
| `--gap-xs/sm/lg/xl/2xl` | `.75 / 1 / 2 / 3 / 4rem` | **Aktuell ungenutzt** – für `.stack`, `.grid`, `.cluster` gap-Varianten statt hardcoded `1rem`/`2rem`/`1.5rem` |

### Radius, Schatten, Transition
| Token | Wert |
|---|---|
| `--radius-sm` | `.5rem` *(ungenutzt)* |
| `--radius-md` | `1rem` – Buttons |
| `--radius-lg` | `1.5rem` – Cards, Media |
| `--shadow-sm` | `0 8px 24px rgba(0,0,0,.05)` – Card default |
| `--shadow-md` | `0 16px 40px rgba(0,0,0,.08)` – Hover-States, Media |
| `--shadow-lg` | *(ungenutzt)* – reserviert für z.B. Modals/Popovers |
| `--transition` | `250ms ease` – Standard für alle Hover/Toggle-Effekte |

---

## 3. Breakpoints

Es gibt genau drei Breakpoints im ganzen System – merk dir diese drei Zahlen, mehr brauchst du nicht:

| Breakpoint | Wert | Wirkung |
|---|---|---|
| `bp-sm` | `min-width: 700px` | `.grid-2` wird zweispaltig; generischer Bruchpunkt für `.bp-sm` (siehe unten) |
| `bp-md` | `min-width: 860px` | `.grid-3` wird dreispaltig; generischer Bruchpunkt für `.bp-md` |
| `bp-lg` | `min-width: 900px` | Hauptnavigation sichtbar, Hamburger verschwindet; generischer Bruchpunkt für `.bp-lg` |

Faustregel: **Mobile-first schreiben, dann bei Bedarf `min-width`-Query ergänzen** – niemals `max-width` als Standardansatz (Ausnahme: die Mobile-Nav-Dropdown-Styles nutzen `max-width:899px`, weil sie *nur* unterhalb des Desktop-Breakpoints gelten sollen).

---

## 4. Layout-Bausteine (Composition Layer)

Diese Klassen bestimmen **Anordnung**, nie Aussehen. Fast jede Section im Homepage-Aufbau ist eine Kombination aus diesen drei:

### `.container`
Begrenzt Inhalt auf `--container` (1280px), zentriert, mit 2rem Rand. Immer direkt in `<section>`.

### `.stack`
Vertikaler Rhythmus: jedes Kind bekommt `margin-top: 1.5rem` außer dem ersten.
```html
<div class="stack">
  <h2>Titel</h2>
  <p>Text</p>
  <a class="button button-primary">CTA</a>
</div>
```

### `.cluster`
Horizontale Gruppe mit Zeilenumbruch, `gap:1rem`, vertikal zentriert. Für Button-Gruppen oder Icon+Titel-Zeilen.
```html
<div class="cluster">
  <a class="button button-primary">Primär</a>
  <a class="button button-secondary">Sekundär</a>
</div>
```

### `.grid` + `.grid-2` / `.grid-3`
Feste, benannte Varianten für die zwei häufigsten Fälle:
```html
<div class="grid grid-2">...</div>  <!-- 1 Spalte mobil → 2 Spalten ab 700px -->
<div class="grid grid-3">...</div>  <!-- 1 Spalte mobil → 3 Spalten ab 860px -->
```

### Flexibles Spalten-System: `.bp-sm` / `.bp-md` / `.bp-lg` + `--cols-sm` / `--cols-md` / `--cols-lg`

Für alles, was nicht in `.grid-2`/`.grid-3` passt (z. B. `.steps`, oder Layouts mit mehr als zwei Stufen): zwei getrennte Entscheidungen, zwei getrennte Mechanismen.

1. **Wie viele Spalten pro Stufe?** → eigene Custom Property je Bruchpunkt: `--cols-sm`, `--cols-md`, `--cols-lg`. Frei wählbar (2, 3, 4, ...), keine neue CSS-Klasse nötig.
2. **Ab wann umbrechen?** → die passende(n) Breakpoint-Klasse(n): `.bp-sm` (700px) / `.bp-md` (860px) / `.bp-lg` (900px) – bewusst auf die drei bestehenden Breakpoints begrenzt.

Eine Stufe:
```html
<!-- 2 Spalten ab 700px, sonst mobil einspaltig -->
<div class="steps bp-sm" style="--cols-sm:2">...</div>
```

Mehrere Stufen kombiniert – progressive Layouts (z. B. mobil 1 Spalte → ab 700px 2×2 → ab 900px alle 4 nebeneinander):
```html
<div class="steps bp-sm bp-lg" style="--cols-sm:2; --cols-lg:4">...</div>
```
Beide Klassen gleichzeitig auf demselben Element, jede mit eigener Variable – ab 900px gewinnt `.bp-lg`, weil die Regel im CSS später steht (Cascade-Reihenfolge bei gleicher Specificity).

`.grid-2`/`.grid-3` bleiben als bequeme Abkürzung für die zwei häufigsten Standardfälle bestehen.

### Section-Hintergründe (Exceptions)
| Klasse | Wirkung |
|---|---|
| *(keine Klasse)* | `--color-bg` (Standard, cremeweiß) |
| `.surface` | Weiß |
| `.section-alt` | Hellgrau (`--color-surface-alt`) |
| `.section-dark` | Dunkel, Text automatisch weiß/hellgrau |

Immer auf `<section class="section [variante]">` setzen, nie auf `.container`.

---


## 5. Typografie-Regeln

- `h1`–`h4` nutzen automatisch `--font-heading` (Barlow Condensed), fett, `line-height:1.1`. Du musst nie manuell Font oder Weight setzen – nur `<h2>` schreiben reicht.
- `p` ist automatisch `--color-text-light` (gedimmtes Grau) – für Fließtext/Beschreibungen, nicht für UI-Labels.
- `.eyebrow` = kleines Pill-Label über Überschriften (siehe Hero-Sektion). Immer uppercase, blau, in eigenem `<span>` vor dem `<h1>`/`<h2>`.

```html
<span class="eyebrow">Evidence-Based Performance</span>
<h1>Titel</h1>
```

---

## 6. Komponenten-Katalog

### Buttons
```html
<a class="button button-primary" href="#">
  Text
  <span class="material-symbols-outlined">arrow_forward</span>
</a>
<a class="button button-secondary" href="#">Text</a>
<a class="button button-primary button-lg" href="#">Größerer CTA</a>
```
- `button-primary`: Orange, für Haupt-CTA (max. 1 pro Section empfehlenswert)
- `button-secondary`: Outline Blau, für Sekundär-Aktion
- `button-lg`: nur Padding-Modifier, kombinierbar mit primary/secondary

### Cards
```html
<article class="card">
  <span class="icon"><span class="material-symbols-outlined icon-lg">monitoring</span></span>
  <h3>Titel</h3>
  <p>Beschreibung</p>
</article>
```
- `.card-muted`: 72% Opacity – für "passt nicht zu dir"-Varianten
- `.card-center`: zentrierter Inhalt – für CTA-Banner-Karten

### Icons
```html
<span class="icon">
  <span class="material-symbols-outlined icon-lg">psychology</span>
</span>
```
- `.icon` = runder blauer Kreis-Container (3.5rem)
- `.icon-lg` = größere Symbolgröße (2.25rem), meist innerhalb `.icon`
- `.icon-positive` / `.icon-negative`: für inline Check/Cancel-Icons ohne Kreis (Vergleichs-Cards)

Icon-Fundus: [Material Symbols Outlined](https://fonts.google.com/icons) – bereits per Google Fonts eingebunden, jeder Name aus der Bibliothek funktioniert direkt als Text-Inhalt des Spans.

### Media / Bilder
```html
<figure class="media"><img src="..." alt="..."></figure>
<!-- mit "gerahmtem" Versatz-Element dahinter (siehe Coach-Portrait-Sektion): -->
<figure class="media media-frame"><img src="..." alt="..."></figure>
```

### Listen
```html
<ul class="list list-check">
  <li>Punkt eins</li>
  <li>Punkt zwei</li>
</ul>
<!-- ohne Bullet-Punkte, nur Abstand: -->
<ul class="list"><li>...</li></ul>
```

### Stats
```html
<div class="stats">
  <div class="stat"><strong>15+</strong><span>Jahre Erfahrung</span></div>
  <div class="stat"><strong>50+</strong><span>Ultra Finishes</span></div>
</div>
```
Immer paarweise (2-Spalten-Grid fest, kein Breakpoint nötig).

### Steps / Timeline
```html
<div class="steps">
  <article class="step">
    <span class="step-number">01</span>
    <div class="stack">
      <h3>Titel</h3>
      <p>Beschreibung</p>
    </div>
  </article>
</div>
```
Funktioniert sowohl mit zweistelligen Nummern (`01`–`04`, dunkle Section) als auch einstelligen (`1`–`4`, helle Section) – Nummerierungsstil ist frei wählbar.

### Navigation (Header)
```html
<header class="site-header">
  <div class="container">
    <nav class="navbar">
      <a class="logo" href="/"><img src="..." alt="K4ENDURANCE"></a>
      <ul class="nav" id="primary-nav">
        <li><a class="active" href="#">Home</a></li>
        <li><a href="#">Coaching</a></li>
      </ul>
      <a class="button button-primary" href="#">Kontakt</a>
      <button class="nav-toggle" type="button" aria-expanded="false"
        aria-controls="primary-nav" aria-label="Navigation öffnen">
        <span></span><span></span><span></span>
      </button>
    </nav>
  </div>
</header>
```
Der Toggle-Button braucht zwingend die JS-Logik aus `main.js` (`nav-toggle` Click-Handler) – ohne die ist er dekorativ. Bei einer neuen Seite: dieses Header-Markup 1:1 kopieren, `main.js` unverändert einbinden.

### Footer
```html
<footer class="site-footer">
  <div class="container section">
    <div class="footer">
      <div class="grid grid-2">
        <div class="stack">...</div>
        <div class="footer-links">
          <div><h4>Navigation</h4><a href="#">...</a></div>
        </div>
      </div>
      <div class="footer-bottom"><span>© ...</span><span>...</span></div>
    </div>
  </div>
</footer>
```

### Scroll-Reveal
Jede `.reveal`-Klasse auf einem Section-Kind wird per `IntersectionObserver` (in `main.js`) beim Einscrollen sichtbar (Fade+Slide-Up). Einfach `class="stack reveal"` statt nur `class="stack"` schreiben – kein zusätzliches JS nötig, der Observer läuft global.

---

## 7. Rezepte – ganze Abschnitte zusammensetzen

So sind die bestehenden Sections aufgebaut. Für eine neue Seite kannst du diese Muster 1:1 wiederverwenden:

**Hero:**
`.section` → `.container` → `.stack.reveal` → `.eyebrow` + `h1` + `p` + `.cluster` (2 Buttons)

**Text + Bild, zweispaltig:**
`.section.surface` → `.container` → `.grid.grid-2` → (`.stack.reveal` mit h2/p/list-check) + (`figure.media.reveal`)

**Drei-Karten-Feature-Grid:**
`.section` → `.container` → `.stack.reveal` → h2 + `.grid.grid-3` → 3× `article.card` (Icon+h3+p)

**Dunkler Prozess-Block:**
`.section.section-dark` → `.container` → `.stack.reveal` → header(`.stack` mit h2+p) + `.steps.bp-sm[style="--cols-sm:2"]` (4× `.step` mit 2-stelliger Nummer, 2×2-Grid ab 700px, mobil einspaltig)

**Onboarding-Prozess (progressiv):**
`.section.surface` → `.container` → `.stack.reveal` → h2 + `.steps.bp-sm.bp-lg[style="--cols-sm:2; --cols-lg:4"]` (4× `.step` mit 1-stelliger Nummer im Kreis-Badge; mobil einspaltig, ab 700px 2×2, ab 900px alle 4 nebeneinander)

**Vergleichs-Cards (Ja/Nein-Passung):**
`.section.section-alt` → `.container` → `.stack.reveal` → `.cluster`(h2+eyebrow) + `.grid.grid-2` → `article.card` (icon-positive + Liste) + `article.card.card-muted` (icon-negative + Liste)

**Vertrauens-/Trust-Sektion:**
`.section.section-alt` → `.container` → `.grid.grid-2` → `figure.media.media-frame.reveal` + `.stack.reveal`(h2+p+`.stats`)

**CTA-Banner am Seitenende:**
`.section` → `.container` → `.card.card-center.reveal` → `.stack`(h2+p) + Button (lg)

---

## 8. Checkliste: Neue Seite bauen

1. `<head>` unverändert kopieren (Google Fonts Link, `style.css`-Link).
2. Header + Footer 1:1 aus `index.html` übernehmen (nur `nav .active` auf die neue aktuelle Seite verschieben).
3. Jede Section = `<section class="section [surface|section--alt|section--dark]">` → `.container` → Composition-Klasse (`.stack`/`.grid`) → Komponenten.
4. Kein neues CSS schreiben, bevor du geprüft hast, ob eine bestehende Klasse + Token das Problem schon löst.
5. Brauchst du wirklich einen neuen Wert (z. B. eine neue Schriftgröße)? Erst prüfen, ob einer der ungenutzten Tokens (`--fs-lg/md/sm/xs`, `--gap-xs/sm/lg/xl/2xl`) passt, **bevor** du eine neue Zahl hardcodest.
6. `.reveal` auf jedes erste Section-Kind setzen für den Scroll-Effekt.
7. `main.js` unverändert einbinden – Mobile-Nav und Scroll-Reveal hängen daran.
8. Am Ende: einmal bei 375px, 700px, 900px und 1280px Breite testen (das sind exakt die Punkte, an denen sich etwas verändert).

---

## 9. Jetzt, wo es kein Bulma mehr gibt: Einbettung ins Jekyll-System

Das ändert nichts an der CSS-Datei selbst – aber zwei Dinge werden jetzt wichtiger, weil dieses vanilla System die **einzige** und **dauerhafte** Styling-Quelle ist, nicht mehr nur ein Prototyp neben Bulma:

**9.1 Component-Layer als Liquid-Includes, nicht als copy-paste HTML**

Der Rezept-Katalog in Abschnitt 7 zeigt rohes HTML. In Jekyll willst du das nicht auf jeder Seite neu tippen – sonst driften Markup und Klassen über die Zeit auseinander (genau das Risiko, das ein Design-System eigentlich verhindern soll). Stattdessen: jede Komponente als `_includes/`-Datei mit Liquid-Parametern.

```
_includes/
  card.html
  button.html
  stat.html
  step.html
```

```liquid
<!-- _includes/card.html -->
<article class="card{% if include.muted %} card-muted{% endif %}{% if include.center %} card-center{% endif %}">
  {% if include.icon %}
    <span class="icon"><span class="material-symbols-outlined icon-lg{% if include.icon_variant %} icon-{{ include.icon_variant }}{% endif %}">{{ include.icon }}</span></span>
  {% endif %}
  <h3>{{ include.title }}</h3>
  <p>{{ include.text }}</p>
</article>
```

```liquid
<!-- Verwendung in einer Page/Section -->
<div class="grid grid-3">
  {% for card in page.features %}
    {% include card.html icon=card.icon title=card.title text=card.text %}
  {% endfor %}
</div>
```

**9.2 Datengetrieben statt hartcodiert – passt zu deinem bestehenden PagesCMS-Muster**

Die Card-/Step-/Stat-Inhalte gehören in `_data/*.yml` (oder Page-Front-Matter), nicht direkt ins Template – exakt das Muster, das du für PagesCMS schon etabliert hast (`type: object` mit `list: collapsible`). So bearbeitest du künftig Karten/Steps über PagesCMS, ohne Klassennamen oder Struktur anzufassen; das Include kümmert sich um die richtigen CSS-Klassen.

**9.3 Mehrsprachigkeit "for free"**

Weil Struktur (Include) und Inhalt (Data/Front-Matter) getrennt sind, sehen `/de/` und `/en/` automatisch identisch aus – es gibt keine zwei Kopien der Karten-Markup, die auseinanderlaufen können. Nur die Textwerte unterscheiden sich pro `lang`.

**9.4 Token-Disziplin ist jetzt Pflicht, nicht "nice to have"**

Solange Bulma im Hintergrund lief, hätte eine Inkonsistenz in diesem Prototyp wenig Schaden angerichtet – es war ein Vorschlag neben einem Fallback-System. Jetzt ist diese `style.css` die **einzige** Quelle für jede visuelle Entscheidung auf der ganzen Seite. Das heißt konkret:
- Die 15 toten Tokens aus Abschnitt 1 jetzt entweder **aktiv einsetzen** (empfohlen, siehe Rezepte) oder aus `:root` **entfernen**, damit niemand später denkt, `--fs-lg` sei irgendwo in Benutzung.
- Bevor du eine neue Seite baust: kurz durch Abschnitt 2 gehen und prüfen, ob wirklich jeder neue Wert (Randabstand, Schriftgröße) schon einen Token hat.
- Sass ist an dieser Stelle **nicht nötig** – Custom Properties lösen das Problem bereits vollständig, und Jekyll baut ohnehin ohne zusätzlichen Build-Step. Ein Wechsel zu Sass würde hier nur Komplexität ohne echten Zusatznutzen bringen.

---

## 10. Wenn du wirklich etwas Neues brauchst

- **Neue Farbe?** → Nicht hardcoden. Erst fragen: "Ist das wirklich eine dritte Akzentfarbe, oder reicht Primär/Sekundär/Text-Light?"
- **Neue Komponente (z. B. Testimonial-Slider, Preistabelle)?** → Als neuer Block im Component-Layer anlegen, mit flachem Naming (`.testimonial`, `.testimonial-quote`), nicht mit BEM-Doppelstrich (Konsistenz mit den anderen 40 Klassen).
- **Neuer Breakpoint nötig?** → Erst schauen, ob 700 / 860 / 900px nicht reichen. Drei Breakpoints für eine Seite dieser Größe sind bewusst minimal gehalten.

