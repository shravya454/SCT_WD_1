(function () {
  "use strict";

  const navbar      = document.getElementById("navbar");
  const hamburger   = document.getElementById("hamburger");
  const mobileMenu  = document.getElementById("mobileMenu");
  const navLinks    = document.querySelectorAll(".nav-link");
  const mobLinks    = document.querySelectorAll(".mob-link");
  const sections    = document.querySelectorAll(".section");

  /* ── 1. Inject scroll-progress bar ─────────── */
  const progressBar = document.createElement("div");
  progressBar.id = "progress-bar";
  document.body.prepend(progressBar);

  /* ── 2. Scroll handler ──────────────────────── */
  const SCROLL_THRESHOLD = 60; // px before nav "solidifies"

  function onScroll() {
    const scrollY = window.scrollY;

    /* Navbar solid / transparent */
    if (scrollY > SCROLL_THRESHOLD) {
      navbar.classList.add("scrolled");
    } else {
      navbar.classList.remove("scrolled");
    }

    /* Scroll progress bar */
    const docHeight   = document.documentElement.scrollHeight - window.innerHeight;
    const progress    = docHeight > 0 ? (scrollY / docHeight) * 100 : 0;
    progressBar.style.width = progress + "%";
  }

  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll(); // run once on load

  /* ── 3. Active link via IntersectionObserver ── */
  const observerOptions = {
    root:       null,
    rootMargin: "-40% 0px -55% 0px", // fire when section is near centre-screen
    threshold:  0,
  };

  const sectionObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        const id = entry.target.id;

        /* Highlight matching desktop link */
        navLinks.forEach((link) => {
          const href = link.getAttribute("href");
          if (href === "#" + id) {
            link.classList.add("active");
          } else {
            link.classList.remove("active");
          }
        });
      }
    });
  }, observerOptions);

  sections.forEach((section) => sectionObserver.observe(section));

  /* ── 4. Mobile hamburger toggle ─────────────── */
  function openMenu() {
    hamburger.classList.add("open");
    hamburger.setAttribute("aria-expanded", "true");
    mobileMenu.classList.add("open");
    // Expand navbar height to reveal drawer
    navbar.style.height = "auto";
  }

  function closeMenu() {
    hamburger.classList.remove("open");
    hamburger.setAttribute("aria-expanded", "false");
    mobileMenu.classList.remove("open");
    navbar.style.height = "";
  }

  hamburger.addEventListener("click", () => {
    const isOpen = hamburger.classList.contains("open");
    isOpen ? closeMenu() : openMenu();
  });

  /* ── 5. Close menu on mobile link click ─────── */
  mobLinks.forEach((link) => {
    link.addEventListener("click", closeMenu);
  });

  /* Close menu on resize back to desktop */
  window.addEventListener("resize", () => {
    if (window.innerWidth > 768) closeMenu();
  });

  /* ── 6. Subtle link cursor-tracking highlight ─ */
  navLinks.forEach((link) => {
    link.addEventListener("mousemove", (e) => {
      const rect   = link.getBoundingClientRect();
      const x      = ((e.clientX - rect.left) / rect.width)  * 100;
      const y      = ((e.clientY - rect.top)  / rect.height) * 100;
      link.style.setProperty("--mx", x + "%");
      link.style.setProperty("--my", y + "%");
    });
  });

  /* ── 7. Smooth section entrance animation ───── */
  const fadeObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("visible");
          fadeObserver.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.1 }
  );

  /* Add fade-in class to section content blocks */
  document.querySelectorAll(".section-content").forEach((el) => {
    el.classList.add("fade-in");
    fadeObserver.observe(el);
  });

  /* Inject fade-in styles dynamically (keeps CSS clean) */
  const fadeStyle = document.createElement("style");
  fadeStyle.textContent = `
    .fade-in {
      opacity: 0;
      transform: translateY(28px);
      transition: opacity 0.85s cubic-bezier(0.16,1,0.3,1),
                  transform 0.85s cubic-bezier(0.16,1,0.3,1);
    }
    .fade-in.visible {
      opacity: 1;
      transform: translateY(0);
    }
  `;
  document.head.appendChild(fadeStyle);

})();
