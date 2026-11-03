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

    if ("IntersectionObserver" in window) {

        const observer = new IntersectionObserver((entries, observer) => {

            entries.forEach(entry => {

                if (!entry.isIntersecting) return;

                const el = entry.target;

                // Gestaffelt: Kinder (und Karten in Grids) nacheinander
                if (el.classList.contains("stack")) {
                    const items = el.querySelectorAll(":scope > :not(.grid), :scope .grid > *");
                    items.forEach((item, i) => {
                        const delay = Math.min(i, 6) * 70;
                        item.style.transitionDelay = `${delay}ms`;
                        // Verzögerung danach entfernen, damit Hover sofort reagiert
                        setTimeout(() => { item.style.transitionDelay = ""; }, delay + 650);
                    });
                }

                el.classList.add("is-visible");

                observer.unobserve(entry.target);

            });

        }, {
            threshold: 0.15
        });

        revealElements.forEach(element => observer.observe(element));

    } else {

        revealElements.forEach(element =>
            element.classList.add("is-visible")
        );

    }

});