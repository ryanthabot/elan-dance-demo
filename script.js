/* ============================================================
   Élan Dance Co. — interactions
   - Mobile nav toggle
   - Auto-close mobile nav after clicking a link
   - Active nav-link highlighting on scroll (scrollspy)
   - Booking form: validate + build a mailto: link
   ============================================================ */

(function () {
  "use strict";

  /* ---------- Mobile nav ---------- */
  const toggle = document.getElementById("nav-toggle");
  const links = document.getElementById("nav-links");

  if (toggle && links) {
    toggle.addEventListener("click", () => {
      const open = links.classList.toggle("open");
      toggle.setAttribute("aria-expanded", String(open));
      toggle.setAttribute("aria-label", open ? "Close menu" : "Open menu");
    });

    // Close after navigating from the mobile menu
    links.querySelectorAll("a").forEach((a) => {
      a.addEventListener("click", () => {
        if (links.classList.contains("open")) {
          links.classList.remove("open");
          toggle.setAttribute("aria-expanded", "false");
          toggle.setAttribute("aria-label", "Open menu");
        }
      });
    });

    // Close on Escape
    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape" && links.classList.contains("open")) {
        links.classList.remove("open");
        toggle.setAttribute("aria-expanded", "false");
        toggle.setAttribute("aria-label", "Open menu");
      }
    });
  }

  /* ---------- Scrollspy: highlight active nav link ---------- */
  const navItems = Array.from(document.querySelectorAll(".nav-links a"));
  const sections = navItems
    .map((a) => {
      const id = a.getAttribute("href");
      return id && id.startsWith("#") ? document.querySelector(id) : null;
    })
    .filter(Boolean);

  if ("IntersectionObserver" in window && sections.length) {
    const setActive = (id) => {
      navItems.forEach((a) => {
        const match = a.getAttribute("href") === "#" + id;
        a.style.color = match ? "var(--amber)" : "";
      });
    };

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) setActive(entry.target.id);
        });
      },
      { rootMargin: "-45% 0px -50% 0px", threshold: 0 }
    );

    sections.forEach((s) => observer.observe(s));
  }

  /* ---------- Booking form: build mailto ---------- */
  const form = document.getElementById("booking-form");
  if (form) {
    form.addEventListener("submit", (e) => {
      e.preventDefault();

      // Validate required fields
      if (!form.checkValidity()) {
        form.reportValidity();
        return;
      }

      const get = (name) => {
        const el = form.elements[name];
        return el ? el.value.trim() : "";
      };

      const name = get("name");
      const email = get("email");
      const phone = get("phone");
      const audience = get("audience");
      const format = get("format");
      const style = get("style");
      const when = get("when");
      const message = get("message");

      const subject = `Dance lesson inquiry — ${name || "new student"}`;

      const body = [
        `Name: ${name}`,
        `Email: ${email}`,
        phone ? `Phone: ${phone}` : null,
        audience ? `Who it's for: ${audience}` : null,
        format ? `Preferred format: ${format}` : null,
        style ? `Style interest: ${style}` : null,
        when ? `Preferred times: ${when}` : null,
        message ? `\nMessage:\n${message}` : null,
        "",
        "— Sent from elandance.co",
      ]
        .filter(Boolean)
        .join("\n");

      // Open the visitor's email client with a prefilled message.
      // Replace hello@elandance.co with your real inbox address.
      const mailto = `mailto:hello@elandance.co?subject=${encodeURIComponent(
        subject
      )}&body=${encodeURIComponent(body)}`;

      window.location.href = mailto;
    });
  }
})();
