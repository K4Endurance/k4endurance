---
title: Plyometrics Session Rechner
slug: plyometrics-rechner
page_id: plyometrics-rechner
description: Berechne die gewichtete Gesamtbelastung deiner Sprungkrafteinheit – Übung wählen, Anzahl Sprünge eintragen, fertig.
icon: bolt
status: live
order: 1
code: |
  <div class="tool-widget" id="plyo-calculator">
  <style>
    /* Rahmen, Inputs & Button-Stil kommen aus assets/css/style.css (.tool-widget, .button) */
    #plyo-calculator .plyo-head,
    #plyo-calculator .plyo-row { display:grid; grid-template-columns:minmax(0,1fr) 5.5rem 5rem 2rem; gap:.75rem; align-items:center; }
    #plyo-calculator .plyo-head { margin-bottom:.4rem; color:var(--color-text-light,#666); font-size:.875rem; font-weight:700; letter-spacing:.04em; text-transform:uppercase; }
    #plyo-calculator .plyo-row + .plyo-row { margin-top:.75rem; }
    #plyo-calculator .plyo-exercise { width:100%; min-width:0; }
    #plyo-calculator .plyo-count { width:100%; text-align:center; }
    #plyo-calculator .plyo-row-value { color:var(--color-text-light,#666); font-size:.875rem; text-align:right; white-space:nowrap; }
    #plyo-calculator .plyo-remove { width:2rem; height:2rem; border-radius:50%; color:var(--color-text-light,#666); font-size:1.4rem; line-height:1; }
    #plyo-calculator .plyo-remove:hover { color:var(--color-primary,#E8380D); background:rgba(232,56,13,.08); }
    #plyo-calculator .plyo-add-btn { margin-top:1.5rem; padding:.6rem 1.2rem; font-size:.875rem; }
    #plyo-calculator .plyo-summary { display:flex; flex-wrap:wrap; justify-content:space-between; align-items:baseline; gap:.75rem; margin-top:2rem; padding-top:1.5rem; border-top:2px solid var(--color-primary,#E8380D); }
    #plyo-calculator .plyo-summary-label { font-family:var(--font-heading,sans-serif); font-weight:700; font-size:1.125rem; text-transform:uppercase; letter-spacing:.02em; }
    #plyo-calculator .plyo-summary-value { font-family:var(--font-heading,sans-serif); font-size:clamp(2rem,5vw,2.75rem); font-weight:800; color:var(--color-primary,#E8380D); }
    #plyo-calculator .plyo-summary-unit { margin-left:.4rem; color:var(--color-text-light,#666); font-size:.875rem; }
    #plyo-calculator .plyo-hint { margin-top:.75rem; color:var(--color-text-light,#666); font-size:.875rem; }
    @media (max-width:560px) {
      #plyo-calculator .plyo-head { display:none; }
      #plyo-calculator .plyo-row { grid-template-columns:5.5rem 1fr 2rem; padding-bottom:.75rem; border-bottom:1px solid var(--color-border,#E5E5E5); }
      #plyo-calculator .plyo-exercise { grid-column:1 / -1; }
      #plyo-calculator .plyo-row-value { text-align:left; }
    }
  </style>

  <h2 class="tool-widget-title">Plyometrics Session Rechner</h2>
  <div class="plyo-head" aria-hidden="true"><span>Übung</span><span>Sprünge</span><span></span><span></span></div>
  <div id="plyo-rows"></div>
  <button type="button" class="button button-secondary plyo-add-btn" id="plyo-add-btn">+ Übung hinzufügen</button>
  <div class="plyo-summary">
    <span class="plyo-summary-label">Gesamtbelastung der Session</span>
    <span><output class="plyo-summary-value" id="plyo-total" aria-live="polite">0</output><span class="plyo-summary-unit">gewichtete Einheiten</span></span>
  </div>
  <p class="plyo-hint">Berechnung: Σ (Anzahl Sprünge × Gewichtungsfaktor) je Übung</p>

  <script>
  (function () {
    // ===== LOGIK: Übungen und Gewichtungsfaktoren (Depth Jump 15 = 1) =====
    var EXERCISES = [
        { name: "Depth Jump 15", factor: 1 },
        { name: "Drop Jump 15", factor: 1.12 },
        { name: "Depth Jump 30", factor: 1.19 },
        { name: "Pogo Backwards", factor: 1.28 },
        { name: "Drop Jump 30", factor: 1.31 },
        { name: "Depth Jump 45", factor: 1.41 },
        { name: "Drop Jump 45", factor: 1.54 },
        { name: "Slalom Hops", factor: 1.58 },
        { name: "Tuck Jumps", factor: 1.66 },
        { name: "Depth Jump 60", factor: 1.67 },
        { name: "6\"-12\" Hurdle Rebound Jumps", factor: 1.69 },
        { name: "Pogo Forwards", factor: 1.75 },
        { name: "Drop Jump 60", factor: 1.8 },
        { name: "Lateral Hops", factor: 1.88 },
        { name: "Hurdle Rebound Jumps - medium hurdles", factor: 1.9 },
        { name: "Depth Jump 75", factor: 1.99 },
        { name: "Hurdle Rebound Jumps - High Hurdles", factor: 2.02 },
        { name: "Medial Hops", factor: 2.03 },
        { name: "Zig-Zag Hops", factor: 2.07 },
        { name: "Drop Jump 75", factor: 2.11 },
        { name: "Ankling", factor: 2.25 },
        { name: "Depth Jump 90", factor: 2.37 },
        { name: "Drop Jump 90", factor: 2.48 },
        { name: "Hops R,R,L,L", factor: 2.63 },
        { name: "Bounding", factor: 2.67 },
        { name: "Depth Jump 105", factor: 2.81 },
        { name: "Drop Jump 105", factor: 2.9 },
        { name: "Hops R,R,R...; L,L,L", factor: 3.09 },
        { name: "Depth Jump 120", factor: 3.34 },
        { name: "Drop Jump 120", factor: 3.41 }
    ];
    var DEFAULT_REPS = 10;        // voreingestellte Anzahl Sprünge pro neuer Zeile
    var LOCALE = "de-DE";      // Zahlenformat
    var T = { exercise: "Übung", reps: "Sprünge", remove: "Übung entfernen" };
    // ======================================================================

    var rows = document.getElementById("plyo-rows");
    var totalEl = document.getElementById("plyo-total");

    function fmt(n, d) { return Number(n).toLocaleString(LOCALE, { minimumFractionDigits: d, maximumFractionDigits: d }); }

    function addRow() {
      var row = document.createElement("div");
      row.className = "plyo-row";

      var select = document.createElement("select");
      select.className = "plyo-exercise";
      select.setAttribute("aria-label", T.exercise);
      EXERCISES.forEach(function (ex, i) {
        var opt = document.createElement("option");
        opt.value = i;
        opt.textContent = ex.name + " (×" + fmt(ex.factor, 2) + ")";
        select.appendChild(opt);
      });
      select.addEventListener("change", recalc);

      var count = document.createElement("input");
      count.type = "number"; count.min = "0"; count.inputMode = "numeric";
      count.className = "plyo-count"; count.value = DEFAULT_REPS;
      count.setAttribute("aria-label", T.reps);
      count.addEventListener("input", recalc);

      var value = document.createElement("span");
      value.className = "plyo-row-value";

      var remove = document.createElement("button");
      remove.type = "button"; remove.className = "plyo-remove";
      remove.innerHTML = "&times;"; remove.title = T.remove;
      remove.setAttribute("aria-label", T.remove);
      remove.addEventListener("click", function () { row.remove(); recalc(); });

      row.append(select, count, value, remove);
      rows.appendChild(row);
      recalc();
    }

    function recalc() {
      var total = 0;
      rows.querySelectorAll(".plyo-row").forEach(function (row) {
        var ex = EXERCISES[parseInt(row.querySelector(".plyo-exercise").value, 10)];
        var n = parseFloat(row.querySelector(".plyo-count").value) || 0;
        var v = n * ex.factor;
        row.querySelector(".plyo-row-value").textContent = "= " + fmt(v, 1);
        total += v;
      });
      totalEl.textContent = fmt(total, 1);
    }

    document.getElementById("plyo-add-btn").addEventListener("click", addRow);
    addRow();
  })();
  </script>
  </div>
---
## So funktioniert der Rechner

Jede Übung hat einen Gewichtungsfaktor, der ihre Belastung im Verhältnis zu einem Depth Jump aus 15 cm (Faktor 1,0) beschreibt. Der Rechner multipliziert die Anzahl der Sprünge je Übung mit diesem Faktor und summiert alles zur Gesamtbelastung der Session.

Quelle der Gewichtungsfaktoren: Bearsley (2017).
