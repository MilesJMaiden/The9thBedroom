document.addEventListener("DOMContentLoaded", function () {
  // Lightbox related code
  var lightbox = document.getElementById("lightbox");
  var lightboxImage = document.querySelector("#lightbox img");
  var lightboxHeader = document.querySelector(".lightbox-header");
  var lightboxCaption = document.querySelector(".lightbox-caption");
  var closeBtn = document.querySelector(".close");
  var lightboxContent = document.querySelector(".lightbox-content");

  function openLightbox(e) {
    e.preventDefault();
    const target = e.target.closest(".img-container");
    const imageSource = target.querySelector("img").getAttribute("src");
    const imageData = target.parentNode.getAttribute("data-title").split("|");
    const imageCaptionText = imageData[0];
    const imageDescriptionText = imageData[1];

    lightboxImage.src = imageSource;
    lightboxHeader.textContent = imageCaptionText;
    lightboxCaption.textContent = imageDescriptionText;
    lightbox.style.display = "block";
    document.documentElement.style.overflow = "hidden";

    // swiper.autoplay.stop();
    // clearInterval(slideInterval);
  }

  document.addEventListener("click", (e) => {
    if (e.target.closest(".custom-lightbox")) {
      openLightbox(e);
    }
  });

  function closeLightbox() {
    lightbox.style.display = "none";
    document.body.style.overflow = "auto";
    document.documentElement.style.overflow = "auto";
    
    // swiper.autoplay.start();
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

  // Close lightbox when Escape key is pressed
  document.addEventListener("keydown", function (event) {
    if (event.key === "Escape" || event.keyCode === 27) {
      closeLightbox();
    }
  });

  


  // Swiper carousel
  let swiperInstance = new Swiper(".swiper-container", {
    centeredSlides: false,
    spaceBetween: 10,
    navigation: {
      nextEl: ".swiper-button-next",
      prevEl: ".swiper-button-prev",
    },
    loop: true,
    initialSlide: 1,
    autoplay: {
      delay: 3000,
    },
    breakpoints: {
      480: { slidesPerView: 1 },
      768: { slidesPerView: 2 },
      1024: { slidesPerView: 3 },
      1025: { slidesPerView: 4 },
    },
  });

  // Pause autoplay when the mouse is over the carousel
  const swiperContainer = document.querySelector(".swiper-container");
  swiperContainer.addEventListener("mouseenter", () => {
    swiperInstance.autoplay.stop();
  });
  swiperContainer.addEventListener("mouseleave", () => {
      swiperInstance.autoplay.start();
    });

  // Slider related variables
  let slider = document.querySelector(".slider");
  let slides = slider.querySelectorAll(".slide");
  let prevBtn = slider.querySelector(".prev-btn");
  let nextBtn = slider.querySelector(".next-btn");
  let currentIndex = 0;
  let slideInterval = setInterval(() => changeSlide((currentIndex + 1) % slides.length), 5000);

  // Slider navigation event listeners
  prevBtn.addEventListener("click", () => changeSlide((currentIndex - 1 + slides.length) % slides.length));
  nextBtn.addEventListener("click", () => changeSlide((currentIndex + 1) % slides.length));

  // Set active dot based on the slide index
  const dots = document.querySelectorAll(".dot");

  function setActiveDot(index) {
    dots.forEach((dot, i) => {
      if (i === index) {
        dot.classList.add("active");
      } else {
        dot.classList.remove("active");
      }
    });
  }

  // Change slide based on the index
  function changeSlide(index) {
    slides[currentIndex].classList.remove("active");
    currentIndex = index;
    slides[currentIndex].classList.add("active");
    setActiveDot(currentIndex);
  }

  setActiveDot(0);

  // Add click event listeners for dots
  dots.forEach((dot, index) => {
    dot.addEventListener("click", () => changeSlide(index));
  });

  // Initialize Typed.js for name
  new Typed("#typed-name", {
    strings: ["MILES J. MAIDEN"],
    typeSpeed: 50,
    startDelay: 500,
    showCursor: false,
  });

  // Initialize Typed.js for role
  new Typed("#typed-role", {
    strings: ["GAME DESIGNER, DEVELOPER, ENTHUSIAST"],
    typeSpeed: 50,
    startDelay: 1500,
    showCursor: false,
  });

  // Animate About section on scroll
  function animateAboutSection() {
    const aboutTexts = document.querySelectorAll('.about-text');
    const aboutImages = document.querySelectorAll('.about-image');

    aboutTexts.forEach((text) => {
      if (isElementVisible(text) && !text.classList.contains('animated')) {
        text.classList.add('animated');
      }
    });

    aboutImages.forEach((image) => {
      if (isElementVisible(image) && !image.classList.contains('animated')) {
        image.classList.add('animated');
      }
    });
  }

  // Check if an element is visible
  function isElementVisible(el) {
    const rect = el.getBoundingClientRect();
    const windowHeight = window.innerHeight || document.documentElement.clientHeight;

    return rect.top <= windowHeight && rect.bottom >= 0;
  }

  // Event listener for scrolling animation
  window.addEventListener('scroll', animateAboutSection);
  animateAboutSection();

  // Smooth scrolling
  $(function() {
    $('a[href*="#"]:not([href="#"])').click(function() {
      if (location.pathname.replace(/^\//,'') == this.pathname.replace(/^\//,'') && location.hostname == this.hostname) {
        var target = $(this.hash);
        target = target.length ? target : $('[name=' + this.hash.slice(1) +']');
        if (target.length) {
          $('html, body').animate({
            scrollTop: target.offset().top
          }, 1000);
          return false;
        }
      }
    });
  });

  // Contact form submission
  $("#contact-form").on("submit", function(e) {
    e.preventDefault();

    // Add your custom form handling logic here
    alert("Form submitted!");
  });
  // Navigation button click effect
  $("nav ul li a").on("click", function() {
    $("nav ul li a").removeClass("active");
    $(this).addClass("active");

    setTimeout(() => {
      $(this).removeClass("active");
    }, 500); // Change this value to control the duration of the flash effect (in milliseconds)
  });

  // Navigation related variables
  const navbar = document.querySelector(".navbar");
  const navbarMenu = document.querySelector(".navbar-menu");
  const hamburger = document.querySelector(".hamburger");
  const closeMenuBtn = document.querySelector(".close-menu-btn");
  const menuItems = document.querySelectorAll(".navbar-menu a");

  // Toggle the navbar menu
  function handleHamburgerClick() {
    navbarMenu.classList.toggle("active");
    hamburger.style.display = "none";
  }

  // Collapse the navbar menu
  function collapsePanel() {
    navbarMenu.classList.remove("active");
    setTimeout(() => {
      handleScroll();
      if (!navbarMenu.classList.contains("active")) {
        hamburger.style.opacity = "0";
        hamburger.style.display = "flex";
        setTimeout(() => {
          hamburger.style.opacity = "1";
        }, 10);
      }
    }, 200);
  }

  // Handle the scroll to show or hide the hamburger menu
  function handleScroll() {
    let currentScrollPosition = window.pageYOffset;
    let navbarHeight = navbar.offsetHeight;

    if (window.innerWidth <= 768) {
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
    } else {
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
    }
  }

  // Event listeners for scroll and resize
  window.addEventListener("scroll", handleScroll);
  window.addEventListener("resize", handleScroll);

  // Initial hamburger menu setup
  handleScroll();

  // Add click event listeners for menu items and close button
  menuItems.forEach((menuItem) => {
    menuItem.addEventListener("click", collapsePanel);
  });

  closeMenuBtn.addEventListener("click", collapsePanel);

  // Add click event listener for hamburger menu
  hamburger.addEventListener("click", handleHamburgerClick);

  // Slide-in effect on scroll
  $(window).on("scroll", function () {

    $(".fade-in-slide").each(function () {
      var sectionOffset = $(this).offset().top;
      var windowHeight = $(window).height();
      var scrollPosition = $(window).scrollTop();
      
      if (scrollPosition + windowHeight > sectionOffset + windowHeight / 4) {
        $(this).css({
          "opacity": 1,
          "transform": "translateY(0)"
        });
      }
    });
  });
  
  function setActiveNavbarItem() {
  const currentURL = window.location.href;
  const navbarLinks = document.querySelectorAll(".navbar-links a");

  navbarLinks.forEach(link => {
    if (currentURL.includes(link.getAttribute("href"))) {
      link.classList.add("active");
    } else {
      link.classList.remove("active");
    }
  });
}

document.addEventListener("DOMContentLoaded", setActiveNavbarItem);
  
});