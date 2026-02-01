document.addEventListener("DOMContentLoaded", function () {
  // -------------------------------------------------------------------
  // Mark JS-enabled pages (pairs with your CSS: html.js .fade-in-slide ...)
  // -------------------------------------------------------------------
  document.documentElement.classList.add("js");

  // -------------------------------------------------------------------
  // Smooth scrolling (same-page anchors only)
  // - Only intercepts href="#something" on the CURRENT page
  // - Does NOT interfere with "index.html#about" etc.
  // -------------------------------------------------------------------
  $(document).on("click", 'a[href^="#"]:not([href="#"])', function (e) {
    const targetId = this.getAttribute("href");
    const target = document.querySelector(targetId);
    if (!target) return;

    e.preventDefault();

    // If you want to account for sticky nav height, subtract it here:
    // const navH = document.querySelector(".navbar")?.offsetHeight ?? 0;
    // const top = $(target).offset().top - navH;

    $("html, body").animate(
      { scrollTop: $(target).offset().top },
      1000
    );
  });

  // -------------------------------------------------------------------
  // Contact form submission (safe)
  // -------------------------------------------------------------------
  const $contactForm = $("#contact-form");
  if ($contactForm.length) {
    $contactForm.on("submit", function (e) {
      e.preventDefault();
      alert("Form submitted!");
    });
  }

  // -------------------------------------------------------------------
  // Navbar active "flash" effect
  // NOTE: Your CSS uses .active for persistent current page too.
  // If you want the flash ONLY, remove this entirely.
  // -------------------------------------------------------------------
  $(document).on("click", ".navbar-links a, .navbar-menu a", function () {
    // only flash for in-page anchors; don't kill the persistent page active state
    const href = this.getAttribute("href") || "";
    const isHashOnly = href.startsWith("#");

    if (!isHashOnly) return;

    $(".navbar-links a").removeClass("active");
    $(this).addClass("active");

    setTimeout(() => {
      $(this).removeClass("active");
      setActiveNavbarItem(); // restore correct active state
    }, 500);
  });

  // -------------------------------------------------------------------
  // Mobile nav (index-compatible)
  // -------------------------------------------------------------------
  const navbar = document.querySelector(".navbar");
  const navbarMenu =
    document.querySelector("#navbar-menu") ||
    document.querySelector(".navbar-menu");
  const hamburger = document.querySelector(".hamburger");
  const closeMenuBtn = document.querySelector(".close-menu-btn");
  const menuItems = navbarMenu ? navbarMenu.querySelectorAll("a") : [];

  const setMenuOpen = (open) => {
    if (!navbarMenu || !hamburger) return;

    navbarMenu.classList.toggle("active", open);
    navbarMenu.setAttribute("aria-hidden", String(!open));
    hamburger.setAttribute("aria-expanded", String(open));

    // Your existing behaviour: hide hamburger when menu opens
    hamburger.style.display = open ? "none" : "flex";
  };

  if (hamburger) hamburger.addEventListener("click", () => setMenuOpen(true));
  if (closeMenuBtn) closeMenuBtn.addEventListener("click", () => setMenuOpen(false));
  menuItems.forEach((item) => item.addEventListener("click", () => setMenuOpen(false)));

  // Optional: hide hamburger at very top of page
  const handleScroll = () => {
    if (!navbar || !hamburger || !navbarMenu) return;

    const currentScrollPosition = window.pageYOffset;
    const navbarHeight = navbar.offsetHeight;

    if (currentScrollPosition < navbarHeight) {
      hamburger.style.opacity = "0";
      setTimeout(() => {
        hamburger.style.display = "none";
      }, 10);
    } else {
      if (!navbarMenu.classList.contains("active")) {
        hamburger.style.display = "flex";
        setTimeout(() => {
          hamburger.style.opacity = "1";
        }, 10);
      }
    }
  };

  window.addEventListener("scroll", handleScroll, { passive: true });
  window.addEventListener("resize", handleScroll);
  handleScroll();

  // -------------------------------------------------------------------
  // Reveal system (fade-in-slide + data-sr) – safe + consistent
  // -------------------------------------------------------------------
  const revealTargets = Array.from(
    document.querySelectorAll(".fade-in-slide, [data-sr]")
  );

  if (revealTargets.length) {
    const reveal = (el) => el.classList.add("is-visible");

    const isInViewport = (el) => {
      const rect = el.getBoundingClientRect();
      const vh = window.innerHeight || document.documentElement.clientHeight;
      return rect.top < vh && rect.bottom > 0;
    };

    // Reveal anything already visible immediately
    revealTargets.forEach((el) => {
      if (isInViewport(el)) reveal(el);
    });

    // Reveal remaining as they enter viewport
    const observer = new IntersectionObserver(
      (entries, obs) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            reveal(entry.target);
            obs.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12 }
    );

    revealTargets.forEach((el) => {
      if (!el.classList.contains("is-visible")) observer.observe(el);
    });
  }

  // -------------------------------------------------------------------
  // Active nav item (better: exact match per page)
  // - Sets .active on .navbar-links anchors only (desktop nav)
  // -------------------------------------------------------------------
  function setActiveNavbarItem() {
    const path = window.location.pathname.split("/").pop() || "index.html";
    const navbarLinks = document.querySelectorAll(".navbar-links a");

    navbarLinks.forEach((link) => {
      const href = link.getAttribute("href") || "";
      const hrefPage = href.split("#")[0]; // "blog.html" from "blog.html#x"
      if (!hrefPage) return;

      // Treat index.html and "" as home
      const normalizedHrefPage = hrefPage === "" ? "index.html" : hrefPage;

      link.classList.toggle("active", normalizedHrefPage === path);
    });
  }

  setActiveNavbarItem();
});
