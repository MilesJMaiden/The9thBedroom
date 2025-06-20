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

  // Ensure aria-hidden initially
  lightbox.setAttribute("aria-hidden", "true");

  function openLightbox(e) {
    e.preventDefault();
    var container = e.target.closest(".img-container");
    if (!container) return;
    var imageSource = container.querySelector("img").getAttribute("src");
    var imageData   = container.closest("a").getAttribute("data-title").split("|");
    var imageCaptionText    = imageData[0];
    var imageDescriptionText = imageData[1];

    lightboxImage.src           = imageSource;
    lightboxHeader.textContent  = imageCaptionText;
    lightboxCaption.textContent = imageDescriptionText;
    lightbox.style.display      = "block";
    lightbox.setAttribute("aria-hidden", "false");
    document.documentElement.style.overflow = "hidden";
  }

  document.addEventListener("click", function (e) {
    if (e.target.closest(".custom-lightbox")) {
      openLightbox(e);
    }
  });

  function closeLightbox() {
    lightbox.style.display = "none";
    lightbox.setAttribute("aria-hidden", "true");
    document.body.style.overflow       = "auto";
    document.documentElement.style.overflow = "auto";
  }

  lightbox.addEventListener("click", function (event) {
    event.preventDefault();
    if (
      event.target === lightbox ||
      event.target === closeBtn ||
      event.target === lightboxContent
    ) {
      closeLightbox();
    }
  });

  lightboxImage.addEventListener("click", function (event) {
    event.stopPropagation();
  });
  lightboxCaption.addEventListener("click", function (event) {
    event.stopPropagation();
  });

  document.addEventListener("keydown", function (event) {
    if (event.key === "Escape" || event.keyCode === 27) {
      closeLightbox();
    }
  });


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
  let slider       = document.querySelector(".slider");
  let slides       = slider.querySelectorAll(".slide");
  let prevBtn      = slider.querySelector(".prev-btn");
  let nextBtn      = slider.querySelector(".next-btn");
  let currentIndex = 0;
  let slideInterval = setInterval(
    () => changeSlide((currentIndex + 1) % slides.length),
    5000
  );

  function setActiveDot(index) {
    const dots = document.querySelectorAll(".dot");
    dots.forEach((dot, i) => {
      dot.classList.toggle("active", i === index);
    });
  }

function changeSlide(index) {
  // hide old
  slides[currentIndex].classList.remove("active");

  // switch index
  currentIndex = index;

  // show new
  slides[currentIndex].classList.add("active");

  // update dots
  setActiveDot(currentIndex);
}

  prevBtn.addEventListener("click", () =>
    changeSlide((currentIndex - 1 + slides.length) % slides.length)
  );
  nextBtn.addEventListener("click", () =>
    changeSlide((currentIndex + 1) % slides.length)
  );

  document.querySelectorAll(".dot").forEach((dot, idx) => {
    dot.addEventListener("click", () => changeSlide(idx));
  });
  setActiveDot(0);


//
// ── TYPED.JS ─────────────────────────────────────────────────────────────
//

// Main title
new Typed("#typed-name", {
  strings: ["9TH BEDROOM"],
  typeSpeed: 50,
  startDelay: 500,
  showCursor: false,
  loop: false,
  onComplete(self) {
    // remove the cursor once done
    self.cursor.remove();
  }
});

// Sub-title (appears after the main title finishes)
new Typed("#typed-role", {
  strings: ["An Indie Game Studio"],
  typeSpeed: 50,
  startDelay: 1500,   // tweak this if you want more or less gap
  showCursor: false,
  loop: false,
  onComplete(self) {
    self.cursor.remove();
  }
});




  //
  // ── ABOUT SECTION ANIMATION ───────────────────────────────────────────────
  //
  function animateAboutSection() {
    const aboutTexts  = document.querySelectorAll('.about-text');
    const aboutImages = document.querySelectorAll('.about-image');

    aboutTexts.forEach(text => {
      if (isElementVisible(text) && !text.classList.contains('animated')) {
        text.classList.add('animated');
      }
    });
    aboutImages.forEach(img => {
      if (isElementVisible(img) && !img.classList.contains('animated')) {
        img.classList.add('animated');
      }
    });
  }

  function isElementVisible(el) {
    const rect         = el.getBoundingClientRect();
    const windowHeight = window.innerHeight || document.documentElement.clientHeight;
    return rect.top <= windowHeight && rect.bottom >= 0;
  }

  window.addEventListener('scroll', animateAboutSection);
  animateAboutSection();


  //
  // ── SMOOTH SCROLL (jQuery) ───────────────────────────────────────────────
  //
  $(function () {
    $('a[href*="#"]:not([href="#"])').click(function () {
      if (
        location.pathname.replace(/^\//, '') == this.pathname.replace(/^\//, '') &&
        location.hostname == this.hostname
      ) {
        var target = $(this.hash);
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
  // ── NAVIGATION BUTTON CLICK EFFECT (jQuery) ─────────────────────────────
  //
  $(".navbar-links a").on("click", function () {
    $(".navbar-links a").removeClass("active");
    $(this).addClass("active");
    setTimeout(() => $(this).removeClass("active"), 500);
  });


  //
  // ── HAMBURGER MENU TOGGLE WITH ARIA ─────────────────────────────────────
  //
  const navbar       = document.querySelector(".navbar");
  const navbarMenu   = document.querySelector(".navbar-menu");
  const hamburgerBtn = document.querySelector(".hamburger");
  const closeMenuBtn = document.querySelector(".close-menu-btn");
  const menuItems    = document.querySelectorAll(".navbar-menu a");

  // initialize ARIA
  hamburgerBtn.setAttribute("aria-expanded", "false");
  navbarMenu.setAttribute("aria-hidden",  "true");

  function handleHamburgerClick() {
    const expanded = hamburgerBtn.getAttribute("aria-expanded") === "true";
    hamburgerBtn.setAttribute("aria-expanded", String(!expanded));
    navbarMenu.setAttribute("aria-hidden",  String(expanded));
    navbarMenu.classList.toggle("active");
    hamburgerBtn.style.display = "none";
  }

  function collapsePanel() {
    navbarMenu.classList.remove("active");
    hamburgerBtn.setAttribute("aria-expanded", "false");
    navbarMenu.setAttribute("aria-hidden",  "true");
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
  menuItems.forEach(item => item.addEventListener("click", collapsePanel));


  //
  // ── SHOW/HIDE HAMBURGER ON SCROLL ────────────────────────────────────────
  //
  function handleScroll() {
    var currentScrollPosition = window.pageYOffset;
    var navbarHeight          = navbar.offsetHeight;
    if (window.innerWidth <= 768) {
      if (currentScrollPosition < navbarHeight) {
        hamburgerBtn.style.opacity = "0";
        setTimeout(() => (hamburgerBtn.style.display = "none"), 10);
      } else if (!navbarMenu.classList.contains("active")) {
        hamburgerBtn.style.display = "flex";
        setTimeout(() => (hamburgerBtn.style.opacity = "1"), 10);
      }
    } else {
      if (currentScrollPosition < navbarHeight) {
        hamburgerBtn.style.opacity = "0";
        setTimeout(() => (hamburgerBtn.style.display = "none"), 10);
      } else if (!navbarMenu.classList.contains("active")) {
        hamburgerBtn.style.display = "flex";
        setTimeout(() => (hamburgerBtn.style.opacity = "1"), 10);
      }
    }
  }

  window.addEventListener("scroll", handleScroll);
  window.addEventListener("resize", handleScroll);
  handleScroll(); // initial setup


  //
  // ── SLIDE-IN EFFECT ON SCROLL (jQuery) ─────────────────────────────────
  //
  $(window).on("scroll", function () {
    $(".fade-in-slide").each(function () {
      var sectionOffset  = $(this).offset().top;
      var windowHeight   = $(window).height();
      var scrollPosition = $(window).scrollTop();
      if (scrollPosition + windowHeight > sectionOffset + windowHeight / 4) {
        $(this).css({
          opacity: 1,
          transform: "translateY(0)"
        });
      }
    });
  });


  //
  // ── SET ACTIVE NAVBAR LINK ON LOAD ──────────────────────────────────────
  //
  function setActiveNavbarItem() {
    var currentURL  = window.location.href;
    var navbarLinks = document.querySelectorAll(".navbar-links a");
    navbarLinks.forEach(link => {
      link.classList.toggle("active", currentURL.includes(link.getAttribute("href")));
    });
  }

  setActiveNavbarItem();
});
