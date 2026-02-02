// Mark JS as enabled so CSS can safely run the reveal animations (html.js ...)
document.documentElement.classList.add("js");

document.addEventListener("DOMContentLoaded", function () {
  /* ======================================================================
     Utilities
  ====================================================================== */
  const $ = window.jQuery;

  const getNavbarOffset = () => {
    const navbar = document.querySelector(".navbar");
    return navbar ? navbar.offsetHeight : 0;
  };

  // Smooth scroll helper (uses jQuery animate if available; falls back to native)
  const smoothScrollToY = (targetY, duration = 1000) => {
    const y = Math.max(0, Math.round(targetY));

    if ($) {
      $("html, body").stop(true).animate({ scrollTop: y }, duration);
      return;
    }

    // Native smooth scroll (no duration control, but clean + reliable)
    window.scrollTo({ top: y, behavior: "smooth" });
  };

  const closeMobileMenuIfOpen = () => {
    const navbarMenu = document.querySelector("#navbar-menu") || document.querySelector(".navbar-menu");
    const hamburger = document.querySelector(".hamburger");
    if (!navbarMenu || !hamburger) return;

    const isOpen = navbarMenu.classList.contains("active");
    if (!isOpen) return;

    navbarMenu.classList.remove("active");
    navbarMenu.setAttribute("aria-hidden", "true");
    hamburger.setAttribute("aria-expanded", "false");
    hamburger.style.display = "flex";
  };

  /* ======================================================================
     1) Smooth scrolling (same-page anchors only) + navbar offset
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

    smoothScrollToY(targetTop, 1000);
    closeMobileMenuIfOpen();
  });

  /* ======================================================================
     2) Contact form submission (safe)
  ====================================================================== */
  const contactForm = document.querySelector("#contact-form");
  if (contactForm) {
    contactForm.addEventListener("submit", function (e) {
      e.preventDefault();
      alert("Form submitted!");
    });
  }

  /* ======================================================================
     3) Navbar "active flash" effect (desktop + mobile)
        - doesn’t permanently break active page highlighting
  ====================================================================== */
  document.addEventListener("click", function (e) {
    const navLink = e.target.closest(".navbar-links a, .navbar-menu a");
    if (!navLink) return;

    navLink.classList.add("active");
    setTimeout(() => navLink.classList.remove("active"), 500);
  });

  /* ======================================================================
     4) Mobile nav (ARIA-safe)
  ====================================================================== */
  const navbar = document.querySelector(".navbar");
  const navbarMenu = document.querySelector("#navbar-menu") || document.querySelector(".navbar-menu");
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

  // Optional: hide hamburger when at very top of page (only if elements exist)
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

  /* ======================================================================
     5) Reveal system (IntersectionObserver; matches your CSS html.js rules)
  ====================================================================== */
  const revealTargets = Array.from(document.querySelectorAll(".fade-in-slide, [data-sr]"));

  if (revealTargets.length && "IntersectionObserver" in window) {
    const reveal = (el) => el.classList.add("is-visible");

    // reveal anything already in view (still transitions because CSS is applied)
    revealTargets.forEach((el) => {
      const r = el.getBoundingClientRect();
      const vh = window.innerHeight || document.documentElement.clientHeight;
      if (r.top < vh && r.bottom > 0) reveal(el);
    });

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
  } else {
    // fallback: show everything if observer not supported
    revealTargets.forEach((el) => el.classList.add("is-visible"));
  }

  /* ======================================================================
     6) Lightbox (your custom lightbox; safe-scoped)
  ====================================================================== */
  const lightbox = document.getElementById("lightbox");
  const lightboxImage = document.querySelector("#lightbox img");
  const lightboxHeader = document.querySelector(".lightbox-header");
  const lightboxCaption = document.querySelector(".lightbox-caption");
  const closeBtn = document.querySelector(".close");
  const lightboxContent = document.querySelector(".lightbox-content");

  if (lightbox && lightboxImage && lightboxHeader && lightboxCaption) {
    lightbox.setAttribute("aria-hidden", "true");

    const openLightbox = (e) => {
      e.preventDefault();

      const container = e.target.closest(".img-container");
      if (!container) return;

      const img = container.querySelector("img");
      const anchor = container.closest("a");
      if (!img || !anchor) return;

      const imageSource = img.getAttribute("src") || "";
      const titleAttr = anchor.getAttribute("data-title") || "";
      const imageData = titleAttr.split("|");

      lightboxImage.src = imageSource;
      lightboxHeader.textContent = (imageData[0] || "").trim();
      lightboxCaption.textContent = (imageData[1] || "").trim();

      lightbox.style.display = "block";
      lightbox.setAttribute("aria-hidden", "false");
      document.documentElement.style.overflow = "hidden";
    };

    document.addEventListener("click", function (e) {
      if (e.target.closest(".custom-lightbox")) openLightbox(e);
    });

    const closeLightboxFn = () => {
      lightbox.style.display = "none";
      lightbox.setAttribute("aria-hidden", "true");
      document.documentElement.style.overflow = "auto";
    };

    lightbox.addEventListener("click", function (e) {
      e.preventDefault();
      if (!closeBtn || !lightboxContent) return;

      // Close when clicking backdrop, close button, or content wrapper background
      if ([lightbox, closeBtn, lightboxContent].includes(e.target)) {
        closeLightboxFn();
      }
    });

    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape") closeLightboxFn();
    });

    lightboxImage.addEventListener("click", (e) => e.stopPropagation());
    lightboxCaption.addEventListener("click", (e) => e.stopPropagation());
  }

  /* ======================================================================
     7) Swiper carousel (scoped to #gallery)
  ====================================================================== */
  const gallerySwiperEl = document.querySelector("#gallery .swiper-container");
  if (gallerySwiperEl && typeof window.Swiper !== "undefined") {
    const swiperInstance = new Swiper(gallerySwiperEl, {
      centeredSlides: false,
      spaceBetween: 10,
      navigation: {
        nextEl: "#gallery .swiper-button-next",
        prevEl: "#gallery .swiper-button-prev",
      },
      loop: true,
      initialSlide: 1,
      autoplay: { delay: 3000, disableOnInteraction: false },
      breakpoints: {
        480: { slidesPerView: 1 },
        768: { slidesPerView: 2 },
        1024: { slidesPerView: 3 },
        1025: { slidesPerView: 4 },
      },
    });

    gallerySwiperEl.addEventListener("mouseenter", () => swiperInstance.autoplay.stop());
    gallerySwiperEl.addEventListener("mouseleave", () => swiperInstance.autoplay.start());
  }

  /* ======================================================================
     8) Homepage slider (scoped to #home)
  ====================================================================== */
  const homeSection = document.getElementById("home");
  const homeSlider = homeSection ? homeSection.querySelector(".slider") : null;

  if (homeSlider) {
    const slideDuration = 8000;

    const slides = homeSlider.querySelectorAll(".slide");
    const prevBtn = homeSlider.querySelector(".prev-btn");
    const nextBtn = homeSlider.querySelector(".next-btn");
    const dots = homeSlider.querySelectorAll(".dot");

    let currentIndex = 0;
    let slideInterval = null;
    let currentSlideTyped = null;

    const setActiveDot = (i) => {
      dots.forEach((dot, idx) => dot.classList.toggle("active", idx === i));
    };

    const typeSlideTextFor = (index) => {
      if (typeof window.Typed === "undefined") return;

      if (currentSlideTyped) currentSlideTyped.destroy();

      const descP = slides[index].querySelector(".slide-content p");
      if (!descP) return;

      const text = descP.getAttribute("data-text") || "";
      descP.textContent = "";

      currentSlideTyped = new Typed(descP, {
        strings: [text],
        typeSpeed: 40,
        startDelay: 500,
        showCursor: false,
      });
    };

    const changeSlide = (index) => {
      if (!slides.length) return;

      const nextIndex = (index + slides.length) % slides.length;

      slides[currentIndex].classList.remove("active");
      currentIndex = nextIndex;
      slides[currentIndex].classList.add("active");

      setActiveDot(currentIndex);
      typeSlideTextFor(currentIndex);
    };

    const startSlideInterval = () => {
      slideInterval = setInterval(() => changeSlide(currentIndex + 1), slideDuration);
    };

    const resetSlideInterval = () => {
      clearInterval(slideInterval);
      startSlideInterval();
    };

    if (prevBtn) {
      prevBtn.addEventListener("click", () => {
        changeSlide(currentIndex - 1);
        resetSlideInterval();
      });
    }

    if (nextBtn) {
      nextBtn.addEventListener("click", () => {
        changeSlide(currentIndex + 1);
        resetSlideInterval();
      });
    }

    dots.forEach((dot, idx) => {
      dot.addEventListener("click", () => {
        changeSlide(idx);
        resetSlideInterval();
      });
    });

    // kick off
    changeSlide(0);
    startSlideInterval();
  }

  /* ======================================================================
     9) Typed.js site title & subtitle
  ====================================================================== */
  if (typeof window.Typed !== "undefined") {
    const typedNameEl = document.querySelector("#typed-name");
    const typedRoleEl = document.querySelector("#typed-role");

    if (typedNameEl) {
      new Typed("#typed-name", {
        strings: ["9TH BEDROOM"],
        typeSpeed: 50,
        startDelay: 500,
        showCursor: false,
        loop: false,
        onComplete(self) {
          if (self.cursor) self.cursor.remove();
        },
      });
    }

    if (typedRoleEl) {
      new Typed("#typed-role", {
        strings: ["An Indie Game Studio"],
        typeSpeed: 50,
        startDelay: 1500,
        showCursor: false,
        loop: false,
        onComplete(self) {
          if (self.cursor) self.cursor.remove();
        },
      });
    }
  }

  /* ======================================================================
     10) About section animation (kept, but safe + lightweight)
  ====================================================================== */
  const aboutTargets = document.querySelectorAll(".about-text, .about-image");
  if (aboutTargets.length) {
    const isElementVisible = (el) => {
      const r = el.getBoundingClientRect();
      return r.top <= window.innerHeight && r.bottom >= 0;
    };

    const animateAboutSection = () => {
      aboutTargets.forEach((el) => {
        if (isElementVisible(el) && !el.classList.contains("animated")) {
          el.classList.add("animated");
        }
      });
    };

    window.addEventListener("scroll", animateAboutSection, { passive: true });
    animateAboutSection();
  }

  /* ======================================================================
     11) Active navbar item on load (safer rules)
        - page links: match by pathname
        - in-page anchors: match by hash
  ====================================================================== */
  const setActiveNavbarItem = () => {
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

      // in-page anchors
      if (href.startsWith("#")) {
        // If no hash, keep Home highlighted (only on index-style pages)
        if (!currentHash && href === "#home") {
          link.classList.add("active");
        } else {
          link.classList.toggle("active", href === currentHash);
        }
      }
    });
  };

  setActiveNavbarItem();
});
