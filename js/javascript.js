document.addEventListener("DOMContentLoaded", function () {
  //
  // ── LIGHTBOX RELATED CODE ────────────────────────────────────────────────
  //
  const lightbox        = document.getElementById("lightbox");
  const lightboxImage   = document.querySelector("#lightbox img");
  const lightboxHeader  = document.querySelector(".lightbox-header");
  const lightboxCaption = document.querySelector(".lightbox-caption");
  const closeBtn        = document.querySelector(".close");
  const lightboxContent = document.querySelector(".lightbox-content");

  if (lightbox && lightboxImage && lightboxHeader && lightboxCaption) {
    lightbox.setAttribute("aria-hidden", "true");

    function openLightbox(e) {
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
    }

    document.addEventListener("click", function (e) {
      if (e.target.closest(".custom-lightbox")) openLightbox(e);
    });

    function closeLightboxFn() {
      lightbox.style.display = "none";
      lightbox.setAttribute("aria-hidden", "true");
      document.documentElement.style.overflow = "auto";
    }

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

  //
  // ── SWIPER CAROUSEL (SCOPED TO #gallery) ─────────────────────────────────
  //
  const gallerySwiperEl = document.querySelector("#gallery .swiper-container");

  if (gallerySwiperEl && typeof Swiper !== "undefined") {
    const swiperInstance = new Swiper(gallerySwiperEl, {
      centeredSlides: false,
      spaceBetween: 10,
      navigation: {
        // Scoped selectors ensure no collisions with homepage slider buttons
        nextEl: "#gallery .swiper-button-next",
        prevEl: "#gallery .swiper-button-prev",
      },
      loop: true,
      initialSlide: 1,
      autoplay: { delay: 3000, disableOnInteraction: false },
      breakpoints: {
        480:  { slidesPerView: 1 },
        768:  { slidesPerView: 2 },
        1024: { slidesPerView: 3 },
        1025: { slidesPerView: 4 },
      },
    });

    gallerySwiperEl.addEventListener("mouseenter", () => swiperInstance.autoplay.stop());
    gallerySwiperEl.addEventListener("mouseleave", () => swiperInstance.autoplay.start());
  }

  //
  // ── HOMEPAGE SLIDER (SCOPED TO #home) ────────────────────────────────────
  //
  const homeSection = document.getElementById("home");
  const homeSlider  = homeSection ? homeSection.querySelector(".slider") : null;

  if (homeSlider) {
    const slideDuration = 8000; // ms

    const slides = homeSlider.querySelectorAll(".slide");
    const prevBtn = homeSlider.querySelector(".prev-btn");
    const nextBtn = homeSlider.querySelector(".next-btn");
    const dots = homeSlider.querySelectorAll(".dot");

    let currentIndex = 0;
    let slideInterval = null;
    let currentSlideTyped = null;

    function setActiveDot(i) {
      dots.forEach((dot, idx) => {
        dot.classList.toggle("active", idx === i);
      });
    }

    function typeSlideTextFor(index) {
      if (typeof Typed === "undefined") return;

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
    }

    function changeSlide(index) {
      if (!slides.length) return;

      const nextIndex = (index + slides.length) % slides.length;

      slides[currentIndex].classList.remove("active");
      currentIndex = nextIndex;
      slides[currentIndex].classList.add("active");

      setActiveDot(currentIndex);
      typeSlideTextFor(currentIndex);
    }

    function startSlideInterval() {
      slideInterval = setInterval(() => changeSlide(currentIndex + 1), slideDuration);
    }

    function resetSlideInterval() {
      clearInterval(slideInterval);
      startSlideInterval();
    }

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

  //
  // ── TYPED.JS SITE TITLE & SUBTITLE ──────────────────────────────────────
  //
  if (typeof Typed !== "undefined") {
    const typedNameEl = document.querySelector("#typed-name");
    const typedRoleEl = document.querySelector("#typed-role");

    if (typedNameEl) {
      new Typed("#typed-name", {
        strings: ["9TH BEDROOM"],
        typeSpeed: 50,
        startDelay: 500,
        showCursor: false,
        loop: false,
        onComplete(self) { if (self.cursor) self.cursor.remove(); }
      });
    }

    if (typedRoleEl) {
      new Typed("#typed-role", {
        strings: ["An Indie Game Studio"],
        typeSpeed: 50,
        startDelay: 1500,
        showCursor: false,
        loop: false,
        onComplete(self) { if (self.cursor) self.cursor.remove(); }
      });
    }
  }

  //
  // ── ABOUT SECTION ANIMATION ───────────────────────────────────────────────
  //
  function isElementVisible(el) {
    const r = el.getBoundingClientRect();
    return r.top <= window.innerHeight && r.bottom >= 0;
  }

  function animateAboutSection() {
    document.querySelectorAll(".about-text, .about-image").forEach((el) => {
      if (isElementVisible(el) && !el.classList.contains("animated")) {
        el.classList.add("animated");
      }
    });
  }

  window.addEventListener("scroll", animateAboutSection);
  animateAboutSection();

  //
  // ── SMOOTH SCROLL (jQuery) ───────────────────────────────────────────────
  //
  if (typeof $ !== "undefined") {
    $(function () {
      $('a[href*="#"]:not([href="#"])').click(function () {
        if (
          location.pathname.replace(/^\//, "") === this.pathname.replace(/^\//, "") &&
          location.hostname === this.hostname
        ) {
          let target = $(this.hash);
          target = target.length ? target : $("[name=" + this.hash.slice(1) + "]");
          if (target.length) {
            $("html, body").animate({ scrollTop: target.offset().top }, 1000);
            return false;
          }
        }
      });
    });

    //
    // ── CONTACT FORM SUBMISSION ─────────────────────────────────────────────
    //
    $("#contact-form").on("submit", function (e) {
      e.preventDefault();
      alert("Form submitted!");
    });

    //
    // ── NAVBAR LINK CLICK EFFECT ───────────────────────────────────────────
    //
    $(".navbar-links a").on("click", function () {
      $(".navbar-links a").removeClass("active");
      $(this).addClass("active");
      setTimeout(() => $(this).removeClass("active"), 500);
    });

    //
    // ── SLIDE-IN ON SCROLL (jQuery) ─────────────────────────────────────────
    //
    $(window).on("scroll", function () {
      $(".fade-in-slide").each(function () {
        const offset = $(this).offset().top;
        const winH = $(window).height();
        const scrollP = $(window).scrollTop();
        if (scrollP + winH > offset + winH / 4) {
          $(this).css({ opacity: 1, transform: "translateY(0)" });
        }
      });
    });
  }

  //
  // ── HAMBURGER MENU WITH ARIA ─────────────────────────────────────────────
  //
  const navbar = document.querySelector(".navbar");
  const navbarMenu = document.querySelector("#navbar-menu");
  const hamburgerBtn = document.querySelector(".hamburger");
  const closeMenuBtn = document.querySelector(".close-menu-btn");

  if (navbar && navbarMenu && hamburgerBtn && closeMenuBtn) {
    const menuItems = navbarMenu.querySelectorAll("a");

    hamburgerBtn.setAttribute("aria-expanded", "false");
    navbarMenu.setAttribute("aria-hidden", "true");

    function handleHamburgerClick() {
      const expanded = hamburgerBtn.getAttribute("aria-expanded") === "true";
      hamburgerBtn.setAttribute("aria-expanded", String(!expanded));
      navbarMenu.setAttribute("aria-hidden", String(expanded));
      navbarMenu.classList.toggle("active");
      hamburgerBtn.style.display = "none";
    }

    function handleScroll() {
      const scrollPos = window.pageYOffset;
      const navbarH = navbar.offsetHeight;

      if (scrollPos < navbarH) {
        hamburgerBtn.style.opacity = "0";
        setTimeout(() => (hamburgerBtn.style.display = "none"), 10);
      } else if (!navbarMenu.classList.contains("active")) {
        hamburgerBtn.style.display = "flex";
        setTimeout(() => (hamburgerBtn.style.opacity = "1"), 10);
      }
    }

    function collapsePanel() {
      navbarMenu.classList.remove("active");
      hamburgerBtn.setAttribute("aria-expanded", "false");
      navbarMenu.setAttribute("aria-hidden", "true");

      setTimeout(() => {
        handleScroll();
        if (!navbarMenu.classList.contains("active")) {
          hamburgerBtn.style.opacity = "0";
          hamburgerBtn.style.display = "flex";
          setTimeout(() => (hamburgerBtn.style.opacity = "1"), 10);
        }
      }, 200);
    }

    hamburgerBtn.addEventListener("click", handleHamburgerClick);
    closeMenuBtn.addEventListener("click", collapsePanel);
    menuItems.forEach((item) => item.addEventListener("click", collapsePanel));

    window.addEventListener("scroll", handleScroll);
    window.addEventListener("resize", handleScroll);
    handleScroll();
  }

  //
  // ── ACTIVATE NAVBAR LINK ON LOAD ─────────────────────────────────────────
  //
  function setActiveNavbarItem() {
    const url = window.location.href;
    document.querySelectorAll(".navbar-links a").forEach((link) => {
      const href = link.getAttribute("href") || "";
      link.classList.toggle("active", href && url.includes(href));
    });
  }
  setActiveNavbarItem();
});
