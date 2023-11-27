document.addEventListener("DOMContentLoaded", function () {

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

  //nav
  const navbar = document.querySelector(".navbar");
  const navbarMenu = document.querySelector(".navbar-menu");
  const hamburger = document.querySelector(".hamburger");
  const closeMenuBtn = document.querySelector(".close-menu-btn");
  const menuItems = document.querySelectorAll(".navbar-menu a");

  function handleHamburgerClick() {
    navbarMenu.classList.toggle("active");
    hamburger.style.display = "none";
  }
  
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

//hamburger
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

window.addEventListener("scroll", handleScroll);
window.addEventListener("resize", handleScroll);

handleScroll();

menuItems.forEach((menuItem) => {
  menuItem.addEventListener("click", collapsePanel);
});

closeMenuBtn.addEventListener("click", collapsePanel);

hamburger.addEventListener("click", handleHamburgerClick);
});

//slide in effect
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

document.addEventListener('DOMContentLoaded', function () {
  const hamburger = document.querySelector('.hamburger');
  const navbarMenu = document.querySelector('.navbar-menu');
  const closeMenuBtn = document.querySelector('.close-menu-btn');

  hamburger.addEventListener('click', function () {
    navbarMenu.classList.add('open');
  });

  closeMenuBtn.addEventListener('click', function () {
    navbarMenu.classList.remove('open');
  });
});