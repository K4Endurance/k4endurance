/*
|--------------------------------------------------------------------------
| K4ENDURANCE
|--------------------------------------------------------------------------
*/

document.addEventListener("DOMContentLoaded", () => {

    /*
    |--------------------------------------------------------------------------
    | Mobile Navigation
    |--------------------------------------------------------------------------
    */

    const navToggle = document.querySelector(".nav-toggle");
    const nav = document.getElementById("primary-nav");

    if (navToggle && nav) {

        const closeNav = () => {
            navToggle.setAttribute("aria-expanded", "false");
            nav.classList.remove("is-open");
        };

        navToggle.addEventListener("click", () => {
            const isOpen = navToggle.getAttribute("aria-expanded") === "true";
            navToggle.setAttribute("aria-expanded", String(!isOpen));
            nav.classList.toggle("is-open", !isOpen);
        });

        // Close menu after choosing a link
        nav.querySelectorAll("a").forEach(link => {
            link.addEventListener("click", closeNav);
        });

        // Close menu on outside click
        document.addEventListener("click", event => {
            if (!nav.classList.contains("is-open")) return;
            if (nav.contains(event.target) || navToggle.contains(event.target)) return;
            closeNav();
        });

        // Close menu on Escape
        document.addEventListener("keydown", event => {
            if (event.key === "Escape") closeNav();
        });

        // Reset state if viewport is resized past the desktop breakpoint
        window.addEventListener("resize", () => {
            if (window.innerWidth >= 900) closeNav();
        });

    }

    /*
    |--------------------------------------------------------------------------
    | Header-Schatten beim Scrollen
    |--------------------------------------------------------------------------
    */

    const header = document.querySelector(".site-header");

    if (header) {
        const updateHeader = () => header.classList.toggle("is-scrolled", window.scrollY > 8);
        updateHeader();
        window.addEventListener("scroll", updateHeader, { passive: true });
    }

    /*
    |--------------------------------------------------------------------------
    | Scroll Reveal
    |--------------------------------------------------------------------------
    */

    const revealElements = document.querySelectorAll(".reveal");
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const WORD_STEP = 70;

    // Hero-Headline in Wörter zerlegen (nur erste Section, nicht bei reduzierter Bewegung)
    const heroTitle = document.querySelector("main > .section:first-child .stack.reveal > h1");

    if (heroTitle && !reduceMotion) {
        const words = heroTitle.textContent.trim().split(/\s+/);
        heroTitle.setAttribute("aria-label", heroTitle.textContent.trim());
        heroTitle.textContent = "";
        words.forEach((word, i) => {
            const outer = document.createElement("span");
            outer.className = "word";
            outer.setAttribute("aria-hidden", "true");
            const inner = document.createElement("span");
            inner.textContent = word;
            inner.style.transitionDelay = `${150 + i * WORD_STEP}ms`;
            outer.appendChild(inner);
            heroTitle.appendChild(outer);
            if (i < words.length - 1) heroTitle.appendChild(document.createTextNode(" "));
        });
        heroTitle.classList.add("split-words");
        heroTitle.dataset.words = String(words.length);
    }

    if ("IntersectionObserver" in window) {

        const observer = new IntersectionObserver((entries, observer) => {

            entries.forEach(entry => {

                if (!entry.isIntersecting) return;

                const el = entry.target;

                // Gestaffelt: Kinder (und Karten in Grids) nacheinander
                if (el.classList.contains("stack")) {
                    const items = el.querySelectorAll(":scope > :not(.grid), :scope .grid > *");
                    let offset = 0;
                    let step = 0;
                    items.forEach(item => {
                        // Nach der Hero-Headline warten, bis die Wörter fast da sind
                        if (item.classList.contains("split-words")) {
                            offset = 150 + Number(item.dataset.words) * WORD_STEP + 150;
                            step = 0;
                            return;
                        }
                        const delay = offset + Math.min(step, 6) * 110;
                        step++;
                        item.style.transitionDelay = `${delay}ms`;
                        // Verzögerung danach entfernen, damit Hover sofort reagiert
                        setTimeout(() => { item.style.transitionDelay = ""; }, delay + 1050);
                    });
                }

                el.classList.add("is-visible");

                observer.unobserve(entry.target);

            });

        }, {
            // Erst starten, wenn das Element wirklich im Blickfeld ist
            threshold: 0,
            rootMargin: "0px 0px -18% 0px"
        });

        revealElements.forEach(element => observer.observe(element));

    } else {

        revealElements.forEach(element =>
            element.classList.add("is-visible")
        );

    }

});