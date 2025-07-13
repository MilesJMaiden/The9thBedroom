document.addEventListener("DOMContentLoaded", function () {
  //
  // ── LIGHTBOX RELATED CODE ────────────────────────────────────────────────
  //
  var lightbox        = document.getElementById("lightbox");
  var lightboxImage   = document.querySelector("#lightbox img");
  var lightboxHeader  = document.querySelector(".lightbox-header");
  var lightboxCaption = document.querySelector(".lightbox-caption");
  var closeBtn        = document.querySelector(".close");
  var lightboxContent = document.querySelector(".lightbox-content");
  lightbox.setAttribute("aria-hidden", "true");
  function openLightbox(e) {
    e.preventDefault();
    var container = e.target.closest(".img-container");
    if (!container) return;
    var imageSource = container.querySelector("img").getAttribute("src");
    var imageData   = container.closest("a").getAttribute("data-title").split("|");
    lightboxImage.src           = imageSource;
    lightboxHeader.textContent  = imageData[0];
    lightboxCaption.textContent = imageData[1];
    lightbox.style.display      = "block";
    lightbox.setAttribute("aria-hidden", "false");
    document.documentElement.style.overflow = "hidden";
  }
  document.addEventListener("click", function (e) {
    if (e.target.closest(".custom-lightbox")) openLightbox(e);
  });
  function closeLightbox() {
    lightbox.style.display = "none";
    lightbox.setAttribute("aria-hidden", "true");
    document.documentElement.style.overflow = "auto";
  }
  lightbox.addEventListener("click", function (e) {
    e.preventDefault();
    if ([ lightbox, closeBtn, lightboxContent ].includes(e.target)) {
      closeLightbox();
    }
  });
  document.addEventListener("keydown", function (e) {
    if (e.key === "Escape") closeLightbox();
  });
  lightboxImage.addEventListener("click", e => e.stopPropagation());
  lightboxCaption.addEventListener("click", e => e.stopPropagation());

  //
  // ── SWIPER CAROUSEL ───────────────────────────────────────────────────────
  //
  let swiperInstance = new Swiper(".swiper-container", {
    centeredSlides: false,
    spaceBetween: 10,
    navigation: {
      nextEl: ".swiper-button-next",
      prevEl: ".swiper-button-prev",
    },
    loop: true,
    initialSlide: 1,
    autoplay: { delay: 3000 },
    breakpoints: {
      480:  { slidesPerView: 1 },
      768:  { slidesPerView: 2 },
      1024: { slidesPerView: 3 },
      1025: { slidesPerView: 4 },
    },
  });
  const swiperContainer = document.querySelector(".swiper-container");
  swiperContainer.addEventListener("mouseenter", () => swiperInstance.autoplay.stop());
  swiperContainer.addEventListener("mouseleave", () => swiperInstance.autoplay.start());

  //
  // ── HOMEPAGE SLIDER ──────────────────────────────────────────────────────
  //
  const slideDuration = 8000; // ms
  let slider           = document.querySelector(".slider");
  let slides           = slider.querySelectorAll(".slide");
  let prevBtn          = slider.querySelector(".prev-btn");
  let nextBtn          = slider.querySelector(".next-btn");
  let currentIndex     = 0;
  let slideInterval;
  let currentSlideTyped = null;

  function setActiveDot(i) {
    document.querySelectorAll(".dot").forEach((dot, idx) => {
      dot.classList.toggle("active", idx === i);
    });
  }

  function changeSlide(index) {
    index = (index + slides.length) % slides.length;
    slides[currentIndex].classList.remove("active");
    currentIndex = index;
    slides[currentIndex].classList.add("active");
    setActiveDot(currentIndex);

    if (currentSlideTyped) currentSlideTyped.destroy();
    const descP = slides[currentIndex].querySelector(".slide-content p");
    const text  = descP.getAttribute("data-text") || "";
    descP.textContent = "";
    currentSlideTyped = new Typed(descP, {
      strings: [ text ],
      typeSpeed: 40,
      startDelay: 500,
      showCursor: false
    });
  }

  function startSlideInterval() {
    slideInterval = setInterval(() => changeSlide(currentIndex + 1), slideDuration);
  }
  function resetSlideInterval() {
    clearInterval(slideInterval);
    startSlideInterval();
  }

  prevBtn.addEventListener("click", () => {
    changeSlide(currentIndex - 1);
    resetSlideInterval();
  });
  nextBtn.addEventListener("click", () => {
    changeSlide(currentIndex + 1);
    resetSlideInterval();
  });
  document.querySelectorAll(".dot").forEach((dot, idx) => {
    dot.addEventListener("click", () => {
      changeSlide(idx);
      resetSlideInterval();
    });
  });

  // kick off
  changeSlide(0);
  startSlideInterval();

  //
  // ── TYPED.JS SITE TITLE & SUBTITLE ──────────────────────────────────────
  //
  new Typed("#typed-name", {
    strings: ["9TH BEDROOM"],
    typeSpeed: 50,
    startDelay: 500,
    showCursor: false,
    loop: false,
    onComplete(self) { self.cursor.remove(); }
  });
  new Typed("#typed-role", {
    strings: ["An Indie Game Studio"],
    typeSpeed: 50,
    startDelay: 1500,
    showCursor: false,
    loop: false,
    onComplete(self) { self.cursor.remove(); }
  });

  //
  // ── ABOUT SECTION ANIMATION ───────────────────────────────────────────────
  //
  function isElementVisible(el) {
    const r = el.getBoundingClientRect();
    return r.top <= window.innerHeight && r.bottom >= 0;
  }
  function animateAboutSection() {
    document.querySelectorAll('.about-text, .about-image').forEach(el => {
      if (isElementVisible(el) && !el.classList.contains('animated')) {
        el.classList.add('animated');
      }
    });
  }
  window.addEventListener('scroll', animateAboutSection);
  animateAboutSection();

  //
  // ── SMOOTH SCROLL (jQuery) ───────────────────────────────────────────────
  //
  $(function () {
    $('a[href*="#"]:not([href="#"])').click(function () {
      if (
        location.pathname.replace(/^\//,'') == this.pathname.replace(/^\//,'') &&
        location.hostname == this.hostname
      ) {
        let target = $(this.hash);
        target = target.length ? target : $('[name=' + this.hash.slice(1) + ']');
        if (target.length) {
          $('html, body').animate({ scrollTop: target.offset().top }, 1000);
          return false;
        }
      }
    });
  });

  //
  // ── CONTACT FORM SUBMISSION ───────────────────────────────────────────────
  //
  $("#contact-form").on("submit", function (e) {
    e.preventDefault();
    alert("Form submitted!");
  });

  //
  // ── NAVBAR LINK CLICK EFFECT ─────────────────────────────────────────────
  //
  $(".navbar-links a").on("click", function () {
    $(".navbar-links a").removeClass("active");
    $(this).addClass("active");
    setTimeout(() => $(this).removeClass("active"), 500);
  });

  //
  // ── HAMBURGER MENU WITH ARIA ─────────────────────────────────────────────
  //
  const navbar       = document.querySelector(".navbar");
  const navbarMenu   = document.querySelector("#navbar-menu");
  const hamburgerBtn = document.querySelector(".hamburger");
  const closeMenuBtn = document.querySelector(".close-menu-btn");
  const menuItems    = navbarMenu.querySelectorAll("a");

  hamburgerBtn.setAttribute("aria-expanded","false");
  navbarMenu.setAttribute("aria-hidden","true");

  function handleHamburgerClick() {
    const expanded = hamburgerBtn.getAttribute("aria-expanded")==="true";
    hamburgerBtn.setAttribute("aria-expanded", String(!expanded));
    navbarMenu.setAttribute("aria-hidden", String(expanded));
    navbarMenu.classList.toggle("active");
    hamburgerBtn.style.display = "none";
  }
  function collapsePanel() {
    navbarMenu.classList.remove("active");
    hamburgerBtn.setAttribute("aria-expanded","false");
    navbarMenu.setAttribute("aria-hidden","true");
    setTimeout(() => {
      handleScroll();
      if (!navbarMenu.classList.contains("active")) {
        hamburgerBtn.style.opacity = "0";
        hamburgerBtn.style.display = "flex";
        setTimeout(() => (hamburgerBtn.style.opacity="1"), 10);
      }
    }, 200);
  }
  hamburgerBtn.addEventListener("click", handleHamburgerClick);
  closeMenuBtn.addEventListener("click", collapsePanel);
  menuItems.forEach(item => item.addEventListener("click", collapsePanel));

  //
  // ── SHOW/HIDE HAMBURGER ON SCROLL ────────────────────────────────────────
  //
  function handleScroll() {
    const scrollPos = window.pageYOffset;
    const navbarH   = navbar.offsetHeight;
    if (scrollPos < navbarH) {
      hamburgerBtn.style.opacity = "0";
      setTimeout(() => (hamburgerBtn.style.display="none"), 10);
    } else if (!navbarMenu.classList.contains("active")) {
      hamburgerBtn.style.display = "flex";
      setTimeout(() => (hamburgerBtn.style.opacity="1"), 10);
    }
  }
  window.addEventListener("scroll", handleScroll);
  window.addEventListener("resize", handleScroll);
  handleScroll();

  //
  // ── SLIDE-IN ON SCROLL (jQuery) ─────────────────────────────────────────
  //
  $(window).on("scroll", function () {
    $(".fade-in-slide").each(function () {
      const offset  = $(this).offset().top;
      const winH    = $(window).height();
      const scrollP = $(window).scrollTop();
      if (scrollP + winH > offset + winH/4) {
        $(this).css({ opacity: 1, transform: "translateY(0)" });
      }
    });
  });

  //
  // ── ACTIVATE NAVBAR LINK ON LOAD ─────────────────────────────────────────
  //
  function setActiveNavbarItem() {
    const url = window.location.href;
    document.querySelectorAll(".navbar-links a")
      .forEach(link => link.classList.toggle("active", url.includes(link.getAttribute("href"))));
  }
  setActiveNavbarItem();
});
