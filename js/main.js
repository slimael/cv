const announce = (message) => {
  const region = document.createElement("div");
  region.setAttribute("role", "status");
  region.setAttribute("aria-live", "polite");
  region.className = "sr-only";
  region.textContent = message;
  document.body.appendChild(region);
  setTimeout(() => region.remove(), 1000);
};

// ===== ANIMACIONES AL SCROLL =====
document.addEventListener("DOMContentLoaded", () => {
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("visible");
          observer.unobserve(entry.target); // Optimización: solo animar una vez
        }
      });
    },
    { threshold: 0.1, rootMargin: "0px 0px -50px 0px" },
  );

  document.querySelectorAll("section").forEach((section) => {
    observer.observe(section);
  });

  // ===== TEMA OSCURO PERSISTENTE =====
  const themeToggle = document.querySelector(".theme-toggle");
  const themeIcon = themeToggle.querySelector("span");

  const initTheme = () => {
    const saved = localStorage.getItem("cv-theme");
    const prefersDark = window.matchMedia(
      "(prefers-color-scheme: dark)",
    ).matches;

    if (saved === "dark" || (!saved && prefersDark)) {
      document.body.classList.add("dark");
      themeToggle.setAttribute("aria-pressed", "true");
      themeIcon.textContent = "☀️";
    }
  };

  window.toggleTheme = () => {
    const body = document.body;
    const isDark = body.classList.toggle("dark");

    localStorage.setItem("cv-theme", isDark ? "dark" : "light");
    themeToggle.setAttribute("aria-pressed", isDark);
    themeIcon.textContent = isDark ? "☀️" : "🌙";

    announce(`Modo ${isDark ? "oscuro" : "claro"} activado`);
  };

  initTheme();

  // ===== ACTUALIZAR NAVEGACIÓN ACTIVA =====
  const navLinks = document.querySelectorAll(".nav-link");
  const sections = document.querySelectorAll("section");

  const updateActiveLink = () => {
    let current = "inicio";
    sections.forEach((section) => {
      const rect = section.getBoundingClientRect();
      if (rect.top <= 120 && rect.bottom >= 120) {
        current = section.id;
      }
    });

    navLinks.forEach((link) => {
      link.removeAttribute("aria-current");
      if (link.getAttribute("href") === `#${current}`) {
        link.setAttribute("aria-current", "page");
      }
    });
  };

  window.addEventListener("scroll", updateActiveLink, { passive: true });
  updateActiveLink(); // Inicializar

  // ===== BOTÓN VOLVER ARRIBA =====
  const topBtn = document.querySelector(".top-btn");

  const toggleTopBtn = () => {
    topBtn.style.display = window.scrollY > 400 ? "block" : "none";
  };

  window.addEventListener("scroll", toggleTopBtn, { passive: true });
  toggleTopBtn();

  window.scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
    // Restaurar foco para accesibilidad
    setTimeout(() => {
      document.querySelector(".skip-link")?.focus();
    }, 600);
  };

  // ===== MANEJO DE TECLADO PARA NAVEGACIÓN =====
  document.addEventListener("keydown", (e) => {
    // Permitir saltar con tecla "S" (accesibilidad avanzada)
    if (e.key === "s" && e.ctrlKey) {
      e.preventDefault();
      document.querySelector("#main-content")?.focus();
    }
  });

  // ===== PRECARGAR ANIMACIONES PARA IMPRESIÓN =====
  if (window.matchMedia("print").matches) {
    document
      .querySelectorAll("section")
      .forEach((s) => s.classList.add("visible"));
  }
});

// ===== MANEJO DE ENLACES EXTERNOS (seguridad y UX) =====
document.addEventListener("click", (e) => {
  const link = e.target.closest('a[target="_blank"]');
  if (link && !link.rel.includes("noopener")) {
    link.rel = `${link.rel || ""} noopener noreferrer`.trim();
  }
});
