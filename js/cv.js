// Mark that JS is active ASAP (before DOMContentLoaded)
document.documentElement.classList.add("js");

document.addEventListener("DOMContentLoaded", () => {
  setupSmoothScroll();
  setupContactForm();
  setupMobileNav();
  setupFadeInOnView();
  setActiveNavbarItem();
});

/* ─────────────────────────────────────────────────────────────
   Smooth scrolling (native, navbar offset)
───────────────────────────────────────────────────────────── */
function setupSmoothScroll() {
  document.addEventListener("click", (e) => {
    const link = e.target.closest('a[href*="#"]:not([href="#"])');
    if (!link) return;

    const url = new URL(link.href, window.location.href);
    const isSamePage = url.pathname === window.location.pathname && url.origin === window.location.origin;
    if (!isSamePage || !url.hash) return;

    const target = document.querySelector(url.hash);
    if (!target) return;

    e.preventDefault();

    const nav = document.querySelector(".navbar");
    const navH = nav ? nav.offsetHeight : 0;
    const targetTop = window.pageYOffset + target.getBoundingClientRect().top - navH;

    window.scrollTo({ top: Math.max(0, targetTop), behavior: "smooth" });
  });
}

/* ─────────────────────────────────────────────────────────────
   Contact form (only if present)
───────────────────────────────────────────────────────────── */
function setupContactForm() {
  const form = document.querySelector("#contact-form");
  if (!form) return;

  form.addEventListener("submit", (e) => {
    e.preventDefault();
    alert("Form submitted!");
  });
}

/* ─────────────────────────────────────────────────────────────
   Mobile nav (single state: .active)
───────────────────────────────────────────────────────────── */
function setupMobileNav() {
  const navbarMenu = document.querySelector(".navbar-menu");
  const hamburger = document.querySelector(".hamburger");
  const closeMenuBtn = document.querySelector(".close-menu-btn");
  const menuItems = document.querySelectorAll(".navbar-menu a");

  if (!navbarMenu || !hamburger) return;

  function openMenu() {
    navbarMenu.classList.add("active");
    hamburger.setAttribute("aria-expanded", "true");
    navbarMenu.setAttribute("aria-hidden", "false");
  }

  function closeMenu() {
    navbarMenu.classList.remove("active");
    hamburger.setAttribute("aria-expanded", "false");
    navbarMenu.setAttribute("aria-hidden", "true");
  }

  hamburger.addEventListener("click", () => {
    navbarMenu.classList.contains("active") ? closeMenu() : openMenu();
  });

  if (closeMenuBtn) closeMenuBtn.addEventListener("click", closeMenu);
  menuItems.forEach((item) => item.addEventListener("click", closeMenu));

  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") closeMenu();
  });
}

/* ─────────────────────────────────────────────────────────────
   Fade-in-slide:
   - If visible on load -> reveal immediately
   - If not visible -> reveal when scrolled into view
───────────────────────────────────────────────────────────── */
function setupFadeInOnView() {
  const elements = Array.from(document.querySelectorAll(".fade-in-slide"));
  if (elements.length === 0) return;

  const reveal = (el) => el.classList.add("is-visible");

  const isInViewport = (el, threshold = 0.15) => {
    const rect = el.getBoundingClientRect();
    const vh = window.innerHeight || document.documentElement.clientHeight;
    const visiblePx = Math.min(rect.bottom, vh) - Math.max(rect.top, 0);
    const minVisible = rect.height * threshold;
    return visiblePx >= minVisible;
  };

  // Reveal visible elements immediately (so page loads nicely)
  requestAnimationFrame(() => {
    elements.forEach((el) => {
      if (isInViewport(el)) reveal(el);
    });
  });

  // Reveal remaining elements on scroll into view
  if ("IntersectionObserver" in window) {
    const observer = new IntersectionObserver(
      (entries, obs) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          reveal(entry.target);
          obs.unobserve(entry.target);
        });
      },
      { threshold: 0.15 }
    );

    elements.forEach((el) => {
      if (!el.classList.contains("is-visible")) observer.observe(el);
    });
  } else {
    const onScroll = () => {
      elements.forEach((el) => {
        if (el.classList.contains("is-visible")) return;
        if (isInViewport(el)) reveal(el);
      });
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    onScroll();
  }
}

/* ─────────────────────────────────────────────────────────────
   Active nav highlighting
───────────────────────────────────────────────────────────── */
function setActiveNavbarItem() {
  const currentPath = window.location.pathname.split("/").pop() || "index.html";

  const allLinks = [
    ...document.querySelectorAll(".navbar-links a"),
    ...document.querySelectorAll(".navbar-menu a"),
  ];

  allLinks.forEach((link) => {
    const href = link.getAttribute("href");
    if (!href) return;

    const url = new URL(href, window.location.href);
    const linkPath = url.pathname.split("/").pop() || "index.html";

    // Mark active if same page (ignoring hash differences for non-index pages)
    const isActive = linkPath === currentPath && (currentPath !== "index.html" || !url.hash || url.hash === window.location.hash);
    link.classList.toggle("active", isActive);
  });
}
