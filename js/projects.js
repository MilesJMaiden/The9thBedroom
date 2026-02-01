document.addEventListener("DOMContentLoaded", function () {
  // ─────────────────────────────────────────────
  // Smooth scrolling (ONLY for same-page "#..." links)
  // ─────────────────────────────────────────────
  $(document).on('click', 'a[href^="#"]:not([href="#"])', function (e) {
    const target = $(this.getAttribute("href"));
    if (!target.length) return;

    e.preventDefault();
    $("html, body").animate({ scrollTop: target.offset().top }, 1000);
  });

  // ─────────────────────────────────────────────
  // Contact form submission (only if form exists)
  // ─────────────────────────────────────────────
  const $contactForm = $("#contact-form");
  if ($contactForm.length) {
    $contactForm.on("submit", function (e) {
      e.preventDefault();
      alert("Form submitted!");
    });
  }

  // ─────────────────────────────────────────────
  // Active nav link highlight (matches current page)
  // ─────────────────────────────────────────────
  function setActiveNavbarItem() {
    const currentPath = window.location.pathname.split("/").pop() || "index.html";
    const navbarLinks = document.querySelectorAll(".navbar-links a");

    navbarLinks.forEach((link) => {
      const href = (link.getAttribute("href") || "").trim();

      // Only mark "active" for actual page links (not hash)
      if (!href.includes("#") && href.length > 0) {
        const linkPath = href.split("/").pop();
        link.classList.toggle("active", linkPath === currentPath);
      } else {
        link.classList.remove("active");
      }
    });
  }
  setActiveNavbarItem();

  // ─────────────────────────────────────────────
  // Hamburger menu logic (de-duped)
  // ─────────────────────────────────────────────
  const navbar = document.querySelector(".navbar");
  const navbarMenu = document.querySelector("#navbar-menu") || document.querySelector(".navbar-menu");
  const hamburger = document.querySelector(".hamburger");
  const closeMenuBtn = document.querySelector(".close-menu-btn");
  const menuItems = navbarMenu ? navbarMenu.querySelectorAll("a") : [];

  function handleScrollHamburgerVisibility() {
    if (!navbar || !hamburger || !navbarMenu) return;

    const scrollY = window.pageYOffset;
    const navbarHeight = navbar.offsetHeight;

    if (scrollY < navbarHeight) {
      hamburger.style.opacity = "0";
      setTimeout(() => (hamburger.style.display = "none"), 10);
    } else {
      if (!navbarMenu.classList.contains("active")) {
        hamburger.style.display = "flex";
        setTimeout(() => (hamburger.style.opacity = "1"), 10);
      }
    }
  }

  function setMenuState(isOpen) {
    if (!navbarMenu || !hamburger) return;

    navbarMenu.classList.toggle("active", isOpen);
    hamburger.setAttribute("aria-expanded", String(isOpen));
    navbarMenu.setAttribute("aria-hidden", String(!isOpen));

    if (isOpen) {
      hamburger.style.display = "none";
    } else {
      handleScrollHamburgerVisibility();
    }
  }

  if (hamburger && navbarMenu) {
    hamburger.addEventListener("click", () => setMenuState(true));
    if (closeMenuBtn) closeMenuBtn.addEventListener("click", () => setMenuState(false));
    menuItems.forEach((item) => item.addEventListener("click", () => setMenuState(false)));

    window.addEventListener("scroll", handleScrollHamburgerVisibility, { passive: true });
    window.addEventListener("resize", handleScrollHamburgerVisibility);
    handleScrollHamburgerVisibility();
  }

  // ─────────────────────────────────────────────
  // Fade-in-slide:
  // REQUIREMENT:
  // - Only elements ACTUALLY in viewport on refresh/navigation animate immediately
  // - Others animate when scrolling into view
  //
  // CRITICAL FIX:
  // - Do NOT run initial reveal on DOMContentLoaded (CSS may not be applied yet)
  // - Run initial reveal on window.load + pageshow (bfcache navigation)
  // ─────────────────────────────────────────────
  const FADE_SELECTOR = ".fade-in-slide";

  function markRevealed(el) {
    el.style.opacity = "1";
    el.style.transform = "translateY(0)";
    el.setAttribute("data-revealed", "true");
  }

  // More strict visibility test: must have >= 25% of its height visible (clamped)
  function isElementVisibleEnough(el, minVisibleRatio = 0.25) {
    const rect = el.getBoundingClientRect();
    const viewportH = window.innerHeight || document.documentElement.clientHeight;

    // completely offscreen
    if (rect.bottom <= 0 || rect.top >= viewportH) return false;

    const visibleTop = Math.max(rect.top, 0);
    const visibleBottom = Math.min(rect.bottom, viewportH);
    const visibleHeight = Math.max(0, visibleBottom - visibleTop);

    const elementHeight = Math.max(1, rect.height);
    const ratio = visibleHeight / elementHeight;

    return ratio >= minVisibleRatio;
  }

  // INITIAL: reveal ONLY what is visible right now
  function revealVisibleNow() {
    document.querySelectorAll(FADE_SELECTOR).forEach((el) => {
      if (el.getAttribute("data-revealed") === "true") return;
      if (isElementVisibleEnough(el, 0.25)) markRevealed(el);
    });
  }

  // SCROLL: reveal when element approaches viewport (top within 75% of viewport)
  function revealOnScroll() {
    const viewportH = window.innerHeight || document.documentElement.clientHeight;
    const triggerLine = viewportH * 0.75;

    document.querySelectorAll(FADE_SELECTOR).forEach((el) => {
      if (el.getAttribute("data-revealed") === "true") return;

      const rect = el.getBoundingClientRect();
      if (rect.top < triggerLine) markRevealed(el);
    });
  }

  // Run initial reveal ONLY after full load (CSS/images settled)
  function runInitialRevealAfterLayoutSettles() {
    // rAF twice helps ensure final layout after CSS + fonts
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        revealVisibleNow();
        revealOnScroll(); // reveals anything already near the fold after layout settles
      });
    });
  }

  window.addEventListener("load", runInitialRevealAfterLayoutSettles);

  // Handles back/forward navigation where page is restored from bfcache
  window.addEventListener("pageshow", function () {
    runInitialRevealAfterLayoutSettles();
  });

  window.addEventListener("scroll", revealOnScroll, { passive: true });
  window.addEventListener("resize", function () {
    revealVisibleNow();
    revealOnScroll();
  });

  // ─────────────────────────────────────────────
  // ScrollReveal (optional; guarded)
  // Note: reset=false so it doesn't re-run endlessly
  // ─────────────────────────────────────────────
  if (typeof ScrollReveal !== "undefined") {
    const sr = ScrollReveal({
      distance: "50px",
      duration: 500,
      easing: "ease-in-out",
      reset: false,
    });

    sr.reveal("[data-sr]", { origin: "bottom", interval: 200 });
    sr.reveal('[data-sr="enter left move 50px"]', { origin: "left" });
    sr.reveal('[data-sr="enter right move 50px"]', { origin: "right" });
  }
});
