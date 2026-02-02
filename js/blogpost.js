/* ======================================================================
   blogpost.js
   Purpose:
   - Blog post pages only (no Swiper, no homepage slider, no lightbox)
   - Consistent mobile nav (hamburger) + ARIA
   - Smooth scrolling for same-page anchors with navbar offset
   - Optional reveal system (matches your CSS html.js rules)
   - Safe active-link highlighting (page + hash)
   ====================================================================== */

// Mark JS as enabled so CSS can safely run reveal animations (html.js ...)
document.documentElement.classList.add("js");

document.addEventListener("DOMContentLoaded", function () {
  /* ======================================================================
     Utilities
  ====================================================================== */
  const $ = window.jQuery || null;

  const getNavbarOffset = () => {
    const navbar = document.querySelector(".navbar");
    return navbar ? navbar.offsetHeight : 0;
  };

  // Smooth scroll helper (uses jQuery animate if available; falls back to native)
  const smoothScrollToY = (targetY, duration = 650) => {
    const y = Math.max(0, Math.round(targetY));

    if ($) {
      $("html, body").stop(true).animate({ scrollTop: y }, duration);
      return;
    }

    window.scrollTo({ top: y, behavior: "smooth" });
  };

  const getMenuEls = () => {
    const navbarMenu =
      document.querySelector("#navbar-menu") || document.querySelector(".navbar-menu");
    const hamburger = document.querySelector(".hamburger");
    const closeMenuBtn = document.querySelector(".close-menu-btn");
    const menuItems = navbarMenu ? Array.from(navbarMenu.querySelectorAll("a")) : [];
    return { navbarMenu, hamburger, closeMenuBtn, menuItems };
  };

  const setMenuOpen = (open) => {
    const { navbarMenu, hamburger } = getMenuEls();
    if (!navbarMenu || !hamburger) return;

    navbarMenu.classList.toggle("active", open);
    navbarMenu.setAttribute("aria-hidden", String(!open));
    hamburger.setAttribute("aria-expanded", String(open));

    // Match your existing behavior: hide hamburger when menu opens
    hamburger.style.display = open ? "none" : "flex";

    // Prevent background scroll when menu is open
    document.body.style.overflow = open ? "hidden" : "";
  };

  const closeMobileMenuIfOpen = () => {
    const { navbarMenu } = getMenuEls();
    if (!navbarMenu) return;
    if (navbarMenu.classList.contains("active")) setMenuOpen(false);
  };

  /* ======================================================================
     1) Mobile nav (ARIA-safe)
  ====================================================================== */
  {
    const { navbarMenu, hamburger, closeMenuBtn, menuItems } = getMenuEls();

    if (hamburger) hamburger.addEventListener("click", () => setMenuOpen(true));
    if (closeMenuBtn) closeMenuBtn.addEventListener("click", () => setMenuOpen(false));

    // Close after selecting a menu link
    menuItems.forEach((item) => item.addEventListener("click", () => setMenuOpen(false)));

    // Close on ESC
    document.addEventListener("keydown", function (e) {
      if (e.key !== "Escape") return;
      if (navbarMenu && navbarMenu.classList.contains("active")) setMenuOpen(false);
    });

    // Close when clicking outside menu (but not on hamburger)
    document.addEventListener("click", function (e) {
      if (!navbarMenu || !hamburger) return;
      if (!navbarMenu.classList.contains("active")) return;

      const clickedInsideMenu = navbarMenu.contains(e.target);
      const clickedHamburger = hamburger.contains(e.target);
      if (!clickedInsideMenu && !clickedHamburger) setMenuOpen(false);
    });

    // Optional: hide hamburger near top of page (kept from your reference, but safe)
    const navbar = document.querySelector(".navbar");

    const handleScroll = () => {
      if (!navbar || !hamburger || !navbarMenu) return;

      const currentScroll = window.pageYOffset;
      const navbarHeight = navbar.offsetHeight;

      if (currentScroll < navbarHeight) {
        hamburger.style.opacity = "0";
        setTimeout(() => {
          if (!navbarMenu.classList.contains("active")) hamburger.style.display = "none";
        }, 10);
      } else {
        if (!navbarMenu.classList.contains("active")) {
          hamburger.style.display = "flex";
          setTimeout(() => (hamburger.style.opacity = "1"), 10);
        }
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    window.addEventListener("resize", handleScroll);
    handleScroll();
  }

  /* ======================================================================
     2) Smooth scrolling (same-page anchors only) + navbar offset
        - Works for blog TOC links like #section-name
  ====================================================================== */
  document.addEventListener("click", function (e) {
    const link = e.target.closest('a[href^="#"]:not([href="#"])');
    if (!link) return;

    const targetId = link.getAttribute("href");
    const target = document.querySelector(targetId);
    if (!target) return;

    e.preventDefault();

    const navOffset = getNavbarOffset();
    const targetTop = target.getBoundingClientRect().top + window.pageYOffset - navOffset;

    smoothScrollToY(targetTop, 650);
    closeMobileMenuIfOpen();

    // Update URL hash without jumping
    if (history && history.pushState) history.pushState(null, "", targetId);
    else window.location.hash = targetId;
  });

  /* ======================================================================
     3) Navbar "active flash" effect (desktop + mobile)
        - quick feedback; does not permanently override active state
  ====================================================================== */
  document.addEventListener("click", function (e) {
    const navLink = e.target.closest(".navbar-links a, .navbar-menu a");
    if (!navLink) return;

    navLink.classList.add("active");
    setTimeout(() => navLink.classList.remove("active"), 350);
  });

  /* ======================================================================
     4) Reveal system (IntersectionObserver; matches your CSS html.js rules)
        - Works for: .fade-in-slide, [data-sr]
  ====================================================================== */
  {
    const revealTargets = Array.from(document.querySelectorAll(".fade-in-slide, [data-sr]"));
    if (!revealTargets.length) return;

    const reveal = (el) => el.classList.add("is-visible");

    if (!("IntersectionObserver" in window)) {
      revealTargets.forEach(reveal);
      return;
    }

    // Reveal anything already in view
    revealTargets.forEach((el) => {
      const r = el.getBoundingClientRect();
      const vh = window.innerHeight || document.documentElement.clientHeight;
      if (r.top < vh && r.bottom > 0) reveal(el);
    });

    const observer = new IntersectionObserver(
      (entries, obs) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          reveal(entry.target);
          obs.unobserve(entry.target);
        });
      },
      { threshold: 0.12 }
    );

    revealTargets.forEach((el) => {
      if (!el.classList.contains("is-visible")) observer.observe(el);
    });
  }

  /* ======================================================================
     5) Active navbar item on load (safer rules)
        - page links: match by pathname
        - in-page anchors: match by hash
  ====================================================================== */
  {
    const links = document.querySelectorAll(".navbar-links a");
    if (!links.length) return;

    const currentPath = window.location.pathname.split("/").pop() || "index.html";
    const currentHash = window.location.hash;

    links.forEach((link) => {
      const href = link.getAttribute("href") || "";

      // page links
      if (href.endsWith(".html")) {
        link.classList.toggle("active", href === currentPath);
        return;
      }

      // in-page anchors (blog TOC pages, etc.)
      if (href.startsWith("#")) {
        link.classList.toggle("active", href === currentHash);
      }
    });
  }
});
