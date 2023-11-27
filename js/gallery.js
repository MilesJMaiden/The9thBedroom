document.addEventListener("DOMContentLoaded", function () {
  var lightbox = document.getElementById("lightbox");
  var lightboxContent = document.querySelector(".lightbox-content img");
  var lightboxCaption = document.querySelector(".lightbox-caption h3");
  var lightboxDescription = document.querySelector(".lightbox-caption p");
  var lightboxClose = document.querySelector(".close");

  function openLightbox(imageSrc, title, description) {
    lightboxContent.src = imageSrc;
    lightboxCaption.textContent = title;
    lightboxDescription.textContent = description;
    lightbox.style.display = "block";
    disableScroll(); // Disable scrolling
  }

  // Updated closeLightbox function
  function closeLightbox() {
    lightboxContent.src = "";
    lightbox.style.display = "none";
    enableScroll(); // Enable scrolling
  }

  function updateGalleryItemsClick() {
    var galleryItems = document.querySelectorAll(".gallery-item");
    galleryItems.forEach(function (item) {
      item.addEventListener("click", function () {
        var imageSrc = item.querySelector("img").src;
        var title = item.getAttribute("data-title");
        var description = item.getAttribute("data-description");
        openLightbox(imageSrc, title, description);
      });
    });
  }

  lightboxClose.addEventListener("click", closeLightbox);

  lightbox.addEventListener("click", function (event) {
    if (event.target === lightbox) {
      closeLightbox();
    }
  });
  
    // Close lightbox when clicking elsewhere in the lightbox (around the image and text)
  lightbox.addEventListener("click", function (event) {
    if (event.target !== lightboxContent && event.target !== lightboxCaption && event.target !== lightboxDescription) {
      closeLightbox();
    }
  });
  
  // Disable scrolling when the lightbox is open
  function disableScroll() {
    document.body.style.overflow = 'hidden';
    document.documentElement.style.overflow = 'hidden';
  }

  // Enable scrolling when the lightbox is closed
  function enableScroll() {
    document.body.style.overflow = 'auto';
    document.documentElement.style.overflow = 'auto';
  }
  
  // Close lightbox when pressing the escape key
  document.addEventListener("keydown", function (event) {
    if (event.key === "Escape") {
      closeLightbox();
    }
	  });

  var filterButtons = document.querySelectorAll(".filter-btn");

  function filterGalleryItems(category) {
    const columns = document.querySelectorAll(".gallery-column");

    columns.forEach(column => {
      column.querySelector(".swiper-wrapper").innerHTML = '';
    });

    const galleryItemsData = [
      { src: "images/3dplatformer1.png", category: "Personal", title: "VR platformer", description: "-" },
      { src: "images/3dplatformer2.png", category: "Personal", title: "VR platformer", description: "-" },
      { src: "images/3dplatformer3.png", category: "Personal", title: "VR platformer", description: "-" },
      { src: "images/3dplatformer4.png", category: "Personal", title: "VR platformer", description: "-" },
	  { src: "images/3dplatformer5.png", category: "Personal", title: "VR platformer", description: "-" },
      { src: "images/3rdPersonRpg1.png", category: "Personal", title: "3rd Person RPG - Combat", description: "-" },
      { src: "images/3rdPersonRpg2.png", category: "Personal", title: "3rd Person RPG - Combat", description: "-" },
      { src: "images/3rdPersonRpg3.png", category: "Personal", title: "3rd Person RPG - Combat", description: "-" },
	  { src: "images/3rdPersonRpg4.png", category: "Personal", title: "3rd Person RPG - Combat", description: "-" },
      { src: "images/3rdPersonRpg5.png", category: "Personal", title: "3rd Person RPG - Combat", description: "-" },
      { src: "images/3rdPersonRpg6.png", category: "Personal", title: "3rd Person RPG - Combat", description: "-" },
      { src: "images/3rdPersonRpg7.png", category: "Personal", title: "3rd Person RPG - Combat", description: "-" },
	  { src: "images/3rdPersonRpg8.png", category: "Personal", title: "3rd Person RPG - Combat", description: "-" },
      { src: "images/ThePit1.png", category: "Personal", title: "Level Design", description: "-" },
      { src: "images/ThePit2.png", category: "Personal", title: "Level Design", description: "-" },
      { src: "images/ThePit3.png", category: "Personal", title: "Level Design", description: "-" },
	  { src: "images/ThePit4.png", category: "Personal", title: "Level Design", description: "-" },
      { src: "images/VRShooter1.jpg", category: "Academic", title: "VRShooter", description: "-" },
      { src: "images/VRShooter2.jpg", category: "Academic", title: "VRShooter", description: "-" },
      { src: "images/VRShooter3.jpg", category: "Academic", title: "VRShooter", description: "-" },
	  { src: "images/VRShooter4.png", category: "Academic", title: "VRShooter", description: "-" },
	  { src: "images/VRShooter5.jpg", category: "Academic", title: "VRShooter", description: "-" },
      { src: "images/VRShooter6.jpg", category: "Academic", title: "VRShooter", description: "-" },
      { src: "images/VRShooter7.jpg", category: "Academic", title: "VRShooter", description: "-" },
	  { src: "images/VRShooter8.png", category: "Academic", title: "VRShooter", description: "-" },
	  { src: "images/VRShooter9.png", category: "Academic", title: "VRShooter", description: "-" },
      { src: "images/Eyeora1.jpg", category: "Professional", title: "Project 2", description: "-" },
      { src: "images/Eyeora2.jpg", category: "Professional", title: "Project 3", description: "-" },
      { src: "images/Eyeora3.png", category: "Professional", title: "Project 4", description: "-" },
	  { src: "images/Eyeora4.png", category: "Professional", title: "Project 1", description: "-" },
      { src: "images/Eyeora5.jpg", category: "Professional", title: "Project 2", description: "-" },
      { src: "images/Eyeora6.png", category: "Professional", title: "Project 3", description: "-" },
      { src: "images/Eyeora7.png", category: "Professional", title: "Project 4", description: "-" },
	  { src: "images/Eyeora8.png", category: "Professional", title: "Project 1", description: "-" },
      { src: "images/spacerail1.jpg", category: "Personal", title: "Project 2", description: "-" },
      { src: "images/RTSGame1.png", category: "Personal", title: "RTS Game - Combat", description: "-" },
      { src: "images/RTSGame2.png", category: "Personal", title: "RTS Game - Combat", description: "-" },
      { src: "images/RTSGame3.png", category: "Personal", title: "RTS Game - Combat", description: "-" },
	  { src: "images/RTSGame4.png", category: "Personal", title: "RTS Game - Combat", description: "-" },
      { src: "images/RTSGame5.png", category: "Personal", title: "RTS Game - Combat", description: "-" },
      { src: "images/RTSGame6.png", category: "Personal", title: "RTS Game - Combat", description: "-" },
	  { src: "images/ARCYOA1.jpg", category: "Academic", title: "AR Choose Your Adventure Book", description: "-" },
      { src: "images/ARCYOA2.png", category: "Academic", title: "AR Choose Your Adventure Book", description: "-" },
      { src: "images/ARCYOA3.png", category: "Academic", title: "AR Choose Your Adventure Book", description: "-" },
	  { src: "images/ARCYOA4.png", category: "Academic", title: "AR Choose Your Adventure Book", description: "-" },
	  { src: "images/ARCYOA5.png", category: "Academic", title: "AR Choose Your Adventure Book", description: "-" },
      { src: "images/ARCYOA6.png", category: "Academic", title: "AR Choose Your Adventure Book", description: "-" },
      { src: "images/ARCYOA7.png", category: "Academic", title: "AR Choose Your Adventure Book", description: "-" },
	  { src: "images/ARCYOA8.jpg", category: "Academic", title: "AR Choose Your Adventure Book", description: "-" },
	  { src: "images/blend1.png", category: "Personal", title: "Blending", description: "-" },
      { src: "images/blend2.png", category: "Personal", title: "Blending", description: "-" },
      { src: "images/blend3.png", category: "Personal", title: "Blending", description: "-" },
	  { src: "images/blend4.png", category: "Personal", title: "Blending", description: "-" },
      { src: "images/blend5.png", category: "Personal", title: "Blending", description: "-" },
	  { src: "images/blend6.png", category: "Personal", title: "Blending", description: "-" },
	  { src: "images/Eyeora9.png", category: "Professional", title: "Project 2", description: "-" },
      { src: "images/Eyeora10.png", category: "Professional", title: "Project 3", description: "-" },
      { src: "images/Eyeora11.png", category: "Professional", title: "Project 4", description: "-" },
	  { src: "images/Eyeora12.jpg", category: "Professional", title: "Project 1", description: "-" },
      { src: "images/Eyeora13.png", category: "Professional", title: "Project 2", description: "-" },
	  { src: "images/Eyeora14.png", category: "Professional", title: "Project 2", description: "-" },
      { src: "images/Eyeora15.png", category: "Professional", title: "Project 3", description: "-" },
      { src: "images/Eyeora16.png", category: "Professional", title: "Project 4", description: "-" },
	  { src: "images/Eyeora17.png", category: "Professional", title: "Project 1", description: "-" },
      { src: "images/Eyeora18.png", category: "Professional", title: "Project 2", description: "-" },
	  { src: "images/Eyeora19.png", category: "Professional", title: "Project 2", description: "-" },
      { src: "images/Eyeora20.png", category: "Professional", title: "Project 3", description: "-" },
      { src: "images/Eyeora21.png", category: "Professional", title: "Project 4", description: "-" },
	  { src: "images/Eyeora22.png", category: "Professional", title: "Project 1", description: "-" },
	  { src: "images/drawing1.jpg", category: "Academic", title: "GCSE - A-Level Art", description: "-" },
	  { src: "images/drawing2.jpg", category: "Academic", title: "GCSE - A-Level Art", description: "-" },
	  { src: "images/drawing3.jpg", category: "Academic", title: "GCSE - A-Level Art", description: "-" },
	  { src: "images/drawing4.jpg", category: "Academic", title: "GCSE - A-Level Art", description: "-" },
	  { src: "images/drawing5.jpg", category: "Academic", title: "GCSE - A-Level Art", description: "-" },
	  { src: "images/drawing6.jpg", category: "Academic", title: "GCSE - A-Level Art", description: "-" },
	  { src: "images/drawing7.jpg", category: "Academic", title: "GCSE - A-Level Art", description: "-" },
	  { src: "images/drawing8.jpg", category: "Academic", title: "GCSE - A-Level Art", description: "-" },
	  { src: "images/drawing9.jpg", category: "Academic", title: "GCSE - A-Level Art", description: "-" },
	  { src: "images/drawing10.jpg", category: "Academic", title: "GCSE - A-Level Art", description: "-" },
	  { src: "images/drawing11.jpg", category: "Academic", title: "GCSE - A-Level Art", description: "-" },
	  { src: "images/drawing12.jpg", category: "Academic", title: "GCSE - A-Level Art", description: "-" },
	  { src: "images/drawing13.jpg", category: "Academic", title: "GCSE - A-Level Art", description: "-" },
	  { src: "images/drawing14.jpg", category: "Academic", title: "GCSE - A-Level Art", description: "-" },
	  { src: "images/drawing15.jpg", category: "Academic", title: "GCSE - A-Level Art", description: "-" },
	  { src: "images/drawing16.jpg", category: "Academic", title: "GCSE - A-Level Art", description: "-" },
	  { src: "images/drawing17.jpg", category: "Academic", title: "GCSE - A-Level Art", description: "-" },
	  { src: "images/drawing18.jpg", category: "Academic", title: "GCSE - A-Level Art", description: "-" },
	  { src: "images/drawing19.jpg", category: "Academic", title: "GCSE - A-Level Art", description: "-" },
	  { src: "images/drawing20.jpg", category: "Academic", title: "GCSE - A-Level Art", description: "-" },
	  { src: "images/drawing21.jpg", category: "Academic", title: "GCSE - A-Level Art", description: "-" },
	  { src: "images/drawing22.jpg", category: "Academic", title: "GCSE - A-Level Art", description: "-" },
	  { src: "images/drawing23.jpg", category: "Academic", title: "GCSE - A-Level Art", description: "-" },
	  { src: "images/drawing24.jpg", category: "Academic", title: "GCSE - A-Level Art", description: "-" },
	  { src: "images/drawing25.jpg", category: "Academic", title: "GCSE - A-Level Art", description: "-" },
	  { src: "images/drawing26.jpg", category: "Academic", title: "GCSE - A-Level Art", description: "-" },
	  { src: "images/drawing27.jpg", category: "Academic", title: "GCSE - A-Level Art", description: "-" },
	  { src: "images/drawing28.jpg", category: "Academic", title: "GCSE - A-Level Art", description: "-" },
	  { src: "images/drawing29.png", category: "Academic", title: "GCSE - A-Level Art", description: "-" },
	  { src: "images/RPG1.png", category: "Personal", title: "My First RPG", description: "RPG Level Design" },
	  { src: "images/RPG2.png", category: "Personal", title: "My First RPG", description: "RPG Level Design" },
	  { src: "images/RPG3.png", category: "Personal", title: "My First RPG", description: "RPG Level Design" },
	  { src: "images/RPG4.png", category: "Personal", title: "My First RPG", description: "RPG Level Design" },
	  { src: "images/RPG5.png", category: "Personal", title: "My First RPG", description: "RPG Level Design" },
	  { src: "images/RPG6.png", category: "Personal", title: "My First RPG", description: "RPG Level Design" },
	  { src: "images/VRBlaster1.png", category: "Personal", title: "Pistol Whip clone", description: "Learning the mechanics of a popular VR Game. " },
	  { src: "images/VRBlaster2.png", category: "Personal", title: "Pistol Whip clone", description: "Learning the mechanics of a popular VR Game." },
	  { src: "images/SuperChill1.png", category: "Personal", title: "Super'hot' clone", description: "Learning the mechanics of a popular VR Game." },
	  { src: "images/spacerail1.jpg", category: "Personal", title: "Star Fox clone", description: "Star-Fox inspired rail shooter" },
	  
    ];

    const filteredItems = category === "all"
      ? galleryItemsData
      : galleryItemsData.filter(item => item.category === category);

    filteredItems.forEach((item, index) => {
      const columnIndex = index % columns.length;
      const galleryItem = createGalleryItem(item);
      columns[columnIndex].querySelector(".swiper-wrapper").appendChild(galleryItem);
    });

    updateGalleryItemsClick();

    const swiperContainers = document.querySelectorAll(".swiper-container");

    swiperContainers.forEach((container) => {
      const nextButton = container.querySelector('.swiper-button-next');
      const prevButton = container.querySelector('.swiper-button-prev');

      new Swiper(container, {
        direction: 'vertical',
        loop: true,
        autoplay: {
          delay: 2000,
          disableOnInteraction: false,
        },
        speed: 500,
        navigation: {
          nextEl: nextButton,
          prevEl: prevButton,
        },
        slidesPerView: 4,
        spaceBetween: 10,
      });
    });
	
	window.scrollTo({ top: 0, behavior: 'smooth' });
  }

filterButtons.forEach(function (button) {
  button.addEventListener("click", function () {
    // Remove active class from all buttons
    filterButtons.forEach((btn) => btn.classList.remove("filter-btn-active"));
    // Add active class to the clicked button
    button.classList.add("filter-btn-active");

    var category = button.dataset.filter;
    filterGalleryItems(category);
  });
});

function createGalleryItem(item) {
  var galleryItem = document.createElement("div");
  galleryItem.classList.add("gallery-item");
  galleryItem.setAttribute("data-title", item.title);
  galleryItem.setAttribute("data-description", item.description);

  var img = document.createElement("img");
  img.src = item.src;
  img.alt = item.title;

  var overlay = document.createElement("div");
  overlay.classList.add("overlay");
  var overlayText = document.createElement("p");
  overlayText.textContent = item.title;
  overlay.appendChild(overlayText);

  galleryItem.appendChild(img);
  galleryItem.appendChild(overlay);

  return galleryItem;
}

  // Initialize gallery with all items
  filterGalleryItems("all");
});

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

  window.addEventListener("scroll", function () {
    var navbar = document.querySelector(".navbar");
    var navbarHeight = navbar.offsetHeight;
    var filterContainer = document.querySelector(".filter-container");

    if (window.pageYOffset > navbarHeight) {
      filterContainer.classList.add("sticky-filter-container");
    } else {
      filterContainer.classList.remove("sticky-filter-container");
    }
  });
  
  $(document).ready(function () {
  // Cache the filter bar and navbar elements
  var $filterBar = $("#filter-bar");
  var $navbar = $("nav");

  // Get the position of the filter bar and navbar
  var filterBarOffsetTop = $filterBar.offset().top;
  var navbarHeight = $navbar.outerHeight();

  // Check if the filter bar should be sticky on page load
  updateFilterBarPosition();

  // Listen for the scroll event
  $(window).on("scroll", function () {
    updateFilterBarPosition();
  });

  function updateFilterBarPosition() {
    // Check if the navbar is no longer visible
    if ($(window).scrollTop() > filterBarOffsetTop - navbarHeight) {
      // Make the filter bar sticky
      $filterBar.addClass("sticky");
    } else {
      // Remove the sticky class
      $filterBar.removeClass("sticky");
    }
  }
});


$(document).ready(function () {
  // Your existing code for handling filter bar position

  // Add event listeners for filter buttons
  $(".filter-btn").on("click", function () {
    $(".filter-btn").removeClass("filter-btn-active"); // Remove the active class from all filter buttons
    $(this).addClass("filter-btn-active"); // Add the active class to the clicked button
  });

  // Set the initial active filter button to 'All'
  $(".filter-btn[data-filter='all']").addClass("filter-btn-active");
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

$(document).ready(function() {
  const navbar = $('.navbar');
  const filterBar = $('.filter-container');

  function updateFilterBarPosition() {
    const navbarHeight = navbar.outerHeight();
    const scrollTop = $(window).scrollTop();
    const windowWidth = $(window).width();

    if (windowWidth <= 767) {
      filterBar.css('top', 0);
      return;
    }

    if (scrollTop > navbarHeight) {
      filterBar.addClass('fixed-filter');
      filterBar.css('top', 0);
    } else {
      filterBar.removeClass('fixed-filter');
      filterBar.css('top', navbarHeight - scrollTop);
    }
  }

  $(window).on('scroll', updateFilterBarPosition);
  $(window).on('resize', updateFilterBarPosition);
  updateFilterBarPosition();
  
});
  
  