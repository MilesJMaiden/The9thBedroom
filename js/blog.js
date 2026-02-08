document.addEventListener("DOMContentLoaded", function () {
  // -------------------------------------------------------------------
  // Mark JS-enabled pages
  // -------------------------------------------------------------------
  document.documentElement.classList.add("js");

  // -------------------------------------------------------------------
  // Smooth scrolling (same-page anchors only)
  // -------------------------------------------------------------------
  $(document).on("click", 'a[href^="#"]:not([href="#"])', function (e) {
    const targetId = this.getAttribute("href");
    const target = document.querySelector(targetId);
    if (!target) return;

    e.preventDefault();
    $("html, body").animate({ scrollTop: $(target).offset().top }, 1000);
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
  // Navbar active "flash" effect (hash-only)
  // -------------------------------------------------------------------
  $(document).on("click", ".navbar-links a, .navbar-menu a", function () {
    const href = this.getAttribute("href") || "";
    const isHashOnly = href.startsWith("#");
    if (!isHashOnly) return;

    $(".navbar-links a").removeClass("active");
    $(this).addClass("active");

    setTimeout(() => {
      $(this).removeClass("active");
      setActiveNavbarItem();
    }, 500);
  });

  // -------------------------------------------------------------------
  // Mobile nav
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
    hamburger.style.display = open ? "none" : "flex";
  };

  if (hamburger) hamburger.addEventListener("click", () => setMenuOpen(true));
  if (closeMenuBtn) closeMenuBtn.addEventListener("click", () => setMenuOpen(false));
  menuItems.forEach((item) => item.addEventListener("click", () => setMenuOpen(false)));

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
  // Reveal system
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

    revealTargets.forEach((el) => {
      if (isInViewport(el)) reveal(el);
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
  }

  // -------------------------------------------------------------------
  // Active nav item (exact match)
  // -------------------------------------------------------------------
  function setActiveNavbarItem() {
    const path = window.location.pathname.split("/").pop() || "index.html";
    const navbarLinks = document.querySelectorAll(".navbar-links a");

    navbarLinks.forEach((link) => {
      const href = link.getAttribute("href") || "";
      const hrefPage = href.split("#")[0];
      if (!hrefPage) return;

      const normalizedHrefPage = hrefPage === "" ? "index.html" : hrefPage;
      link.classList.toggle("active", normalizedHrefPage === path);
    });
  }

  setActiveNavbarItem();

  // ===================================================================
  // BLOG LIST SYSTEM (data-driven)
  // ===================================================================

  const BLOG_FOLDER = "blogPost";
  const PAGE_SIZE = 3;

  /**
   * IMPORTANT:
   * Browsers cannot list a folder on static hosting.
   * Maintain the post list here (single source of truth).
   *
   * Filenames are WITHOUT ".html" here; we append it.
   */
  const BLOG_POST_FILES = [
    "1_ACADEMIC_lSystemRenderer",
    "2_ACADEMIC_snakeBTAI",
    "3_ACADEMIC_aetherTag",
    "4_ACADEMIC_tetroidTetrisAI",
    "5_ACADEMIC_gameOfLifeUE5",
    "6_ACADEMIC_beatboxVR",
    "7_ACADEMIC_terrainEcosystemGenerator",
    "8_ACADEMIC_influx",
    "9_PROFESSIONAL_MIMAssetLoadingSystem",
    "10_PROFESSIONAL_saimeWarehouseSimulation",
  ];

  const bandsMount = document.getElementById("blogBands");
  const sortSelect = document.getElementById("blogSort");
  const categorySelect = document.getElementById("blogCategory");
  const loadMoreBtn = document.getElementById("blogLoadMore");
  const loadMoreHint = document.getElementById("blogLoadMoreHint");

  if (!bandsMount || !sortSelect || !categorySelect || !loadMoreBtn) return;

  function parseFile(fileBase) {
    const parts = String(fileBase).split("_");
    const number = Number(parts[0]);
    const tagRaw = (parts[1] || "").trim();
    const nameRaw = parts.slice(2).join("_").trim();

    const tag = tagRaw.toUpperCase();
    const safeNumber = Number.isFinite(number) ? number : 0;

    const derivedTitle = nameRaw
      .replace(/([a-z])([A-Z])/g, "$1 $2")
      .replace(/_/g, " ")
      .replace(/\s+/g, " ")
      .trim();

    return {
      id: fileBase,
      number: safeNumber,
      tag,
      nameRaw,
      title: derivedTitle.length ? derivedTitle : fileBase,
      href: `${BLOG_FOLDER}/${fileBase}.html`,
    };
  }

  /**
   * Optional: richer card content without changing filenames.
   * If missing, falls back to generic content.
   */
  const BLOG_META = {
    "10_PROFESSIONAL_saimeWarehouseSimulation": {
      title: "SAIME: AI-Driven Warehouse Simulation",
      image: "UMLCodebaseArchitecture.png",
      alt: "SAIME warehouse simulation cover",
      snippet:
        "A modern Unity simulation architecture using ECS, object pooling, JSON-driven initialization, event-driven synchronization, and ML-Agents for RL/MARL—plus XR support.",
    },
    "9_PROFESSIONAL_MIMAssetLoadingSystem": {
      title: "MIM Asset Loading System",
      image: "images/placeholder-blog-3.jpg",
      alt: "MIM Asset Loading System cover",
      snippet:
        "A production-focused asset loading pipeline engineered for modularity, performance, reliability, and scalable content delivery.",
    },
    "8_ACADEMIC_influx": {
      title: "Games Programming 2: Influx",
      image: "SQBanner.png",
      alt: "Influx blog post cover",
      snippet:
        "A procedural, dungeon-style maintenance-vs-sabotage simulation in Unity (URP), with frontier-based room placement, NavMesh linking, and prioritized FSM agents.",
    },
    "7_ACADEMIC_terrainEcosystemGenerator": {
      title: "Procedural Terrain and Ecosystem Simulator",
      image: "MountainTopGeneratedTerrain.png",
      alt: "Terrain ecosystem generator cover",
      snippet:
        "A hybrid Unity terrain pipeline combining Perlin, fBm, Voronoi biomes, cellular automata placement, and NavMesh + FSM-driven agents with real-time UI controls.",
    },
    "6_ACADEMIC_beatboxVR": {
      title: "Beatbox VR",
      image: "images/placeholder-blog-3.jpg",
      alt: "Beatbox VR cover",
      snippet:
        "A VR interaction-driven experience with rhythm/gameplay systems, audio timing considerations, and iterative UX tuning for presence and flow.",
    },
    "5_ACADEMIC_gameOfLifeUE5": {
      title: "Game of Life in Unreal Engine 5",
      image: "images/placeholder-blog-3.jpg",
      alt: "Game of Life UE5 cover",
      snippet:
        "A cellular automata simulation in UE5 exploring emergent behaviour, performance trade-offs, and extensible rule systems for experimentation.",
    },
    "4_ACADEMIC_tetroidTetrisAI": {
      title: "Tetroid: A Heuristic Tetris AI using Beam Search",
      image: "HistogramResults30.png",
      alt: "Tetroid results histogram cover",
      snippet:
        "A heuristic Tetris AI using weighted evaluation features and a discounted recursive beam search to plan placements with lookahead.",
    },
    "3_ACADEMIC_aetherTag": {
      title: "AetherTag",
      image: "images/placeholder-blog-3.jpg",
      alt: "AetherTag cover",
      snippet:
        "An academic prototype exploring interaction, tagging systems, and architecture patterns designed for rapid iteration and demonstrable behaviours.",
    },
    "2_ACADEMIC_snakeBTAI": {
      title: "SnakeAI: Behavior Tree Agent with Risk Flood-Fill",
      image: "SnakeScatter2.png",
      alt: "Snake AI performance scattergraph cover",
      snippet:
        "A behavior tree Snake agent combining BFS with A* fallback, risk-adjusted flood-fill safety estimation, and utility arbitration for survival.",
    },
    "1_ACADEMIC_lSystemRenderer": {
      title: "L-System Renderer",
      image: "images/placeholder-blog-3.jpg",
      alt: "L-System renderer cover",
      snippet:
        "A procedural L-System renderer focusing on modularity, iterative generation, and extensible rule sets for plant-like structures and runtime control.",
    },
  };

  const allPosts = BLOG_POST_FILES.map(parseFile).map((p) => {
    const meta = BLOG_META[p.id];
    return {
      ...p,
      title: meta?.title || p.title,
      image: meta?.image || "images/placeholder-blog-3.jpg",
      alt: meta?.alt || `${p.title} cover`,
      snippet:
        meta?.snippet ||
        "A detailed write-up covering goals, implementation, architecture, and results.",
    };
  });

  // State
  let visibleCount = PAGE_SIZE;
  let currentSort = "newest";
  let currentCategory = "all";

  function getAvailableTags(posts) {
    const tags = new Set(posts.map((p) => p.tag).filter(Boolean));
    return Array.from(tags).sort((a, b) => a.localeCompare(b));
  }

  function applyCategory(posts) {
    const cat = String(currentCategory || "all").toLowerCase();
    if (cat === "all") return posts;
    return posts.filter((p) => p.tag.toLowerCase() === cat);
  }

  function applySort(posts) {
    const mode = String(currentSort || "newest").toLowerCase();
    const copy = posts.slice();

    if (mode === "alpha") {
      copy.sort((a, b) => a.title.localeCompare(b.title));
      return copy;
    }

    if (mode === "oldest") {
      copy.sort((a, b) => a.number - b.number);
      return copy;
    }

    // newest default
    copy.sort((a, b) => b.number - a.number);
    return copy;
  }

  function escapeHtml(s) {
    return String(s ?? "")
      .replaceAll("&", "&amp;")
      .replaceAll("<", "&lt;")
      .replaceAll(">", "&gt;")
      .replaceAll('"', "&quot;")
      .replaceAll("'", "&#039;");
  }

  function buildCardBand(post, indexInRender) {
    const sideClass = indexInRender % 2 === 0 ? "left" : "right";

    const band = document.createElement("div");
    band.className = "blog-band";

    band.innerHTML = `
      <div class="container">
        <div class="project-card ${sideClass}">
          <div class="project-image">
            <img src="${post.image}" alt="${escapeHtml(post.alt)}" loading="lazy" />
            <span class="blog-tag" aria-label="Category ${escapeHtml(post.tag)}">${escapeHtml(post.tag)}</span>
          </div>
          <div class="project-info">
            <h3>${escapeHtml(post.title)}</h3>
            <p>${escapeHtml(post.snippet)}</p>
            <a href="${post.href}" class="btn">Read More</a>
          </div>
        </div>
      </div>
    `;

    return band;
  }

  function render() {
    const filtered = applyCategory(allPosts);
    const sorted = applySort(filtered);

    const total = sorted.length;
    const showing = Math.min(visibleCount, total);

    bandsMount.innerHTML = "";
    for (let i = 0; i < showing; i++) {
      bandsMount.appendChild(buildCardBand(sorted[i], i));
    }

    const remaining = Math.max(0, total - showing);

    // Load More button always present; disable when nothing remains
    if (remaining === 0) {
      loadMoreBtn.disabled = true;
      loadMoreBtn.setAttribute("aria-disabled", "true");
      loadMoreHint.textContent = total === 0 ? "No posts match this filter." : "All posts loaded.";
    } else {
      loadMoreBtn.disabled = false;
      loadMoreBtn.removeAttribute("aria-disabled");
      loadMoreHint.textContent = `${remaining} more post${remaining === 1 ? "" : "s"} available.`;
    }

    const firstBand = bandsMount.querySelector(".blog-band:first-child");
    if (firstBand) firstBand.style.borderTop = "0";
  }

  function resetAndRender() {
    visibleCount = PAGE_SIZE;
    render();
  }

  // Populate category dropdown from tags (and force desired categories)
  (function initCategoryOptions() {
    const tags = getAvailableTags(allPosts);
    const desired = ["ACADEMIC", "PROFESSIONAL", "PROJECT"];
    const merged = Array.from(new Set([...tags, ...desired]))
      .filter(Boolean)
      .sort((a, b) => a.localeCompare(b));

    categorySelect.innerHTML = `<option value="all" selected>All</option>`;

    merged.forEach((tag) => {
      const opt = document.createElement("option");
      opt.value = tag.toLowerCase();
      opt.textContent = tag;
      categorySelect.appendChild(opt);
    });
  })();

  sortSelect.addEventListener("change", (e) => {
    currentSort = String(e.target.value || "newest");
    resetAndRender();
  });

  categorySelect.addEventListener("change", (e) => {
    currentCategory = String(e.target.value || "all");
    resetAndRender();
  });

  loadMoreBtn.addEventListener("click", () => {
    visibleCount += PAGE_SIZE;
    render();
  });

  // Initial render: top 3 newest
  currentSort = "newest";
  currentCategory = "all";
  visibleCount = PAGE_SIZE;
  render();
});
