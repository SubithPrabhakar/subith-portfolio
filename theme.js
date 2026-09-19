/**
 * Theme Manager for Subith M Portfolio
 * Supports light/dark mode with localStorage persistence and system color scheme detection.
 */
(function() {
  function initTheme() {
    const savedTheme = localStorage.getItem('theme');
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    if (savedTheme === 'dark' || (!savedTheme && prefersDark)) {
      document.documentElement.setAttribute('data-theme', 'dark');
    } else {
      document.documentElement.removeAttribute('data-theme');
    }
  }

  // Run immediately to avoid FOUC
  initTheme();

  document.addEventListener('DOMContentLoaded', () => {
    const themeToggleBtn = document.getElementById('theme-toggle');
    if (themeToggleBtn) {
      themeToggleBtn.addEventListener('click', () => {
        const isDark = document.documentElement.getAttribute('data-theme') === 'dark';
        if (isDark) {
          document.documentElement.removeAttribute('data-theme');
          localStorage.setItem('theme', 'light');
        } else {
          document.documentElement.setAttribute('data-theme', 'dark');
          localStorage.setItem('theme', 'dark');
        }
      });
    }

    // Mobile Navigation Menu Toggle with full overlay & scroll lock
    const menuBtn = document.getElementById('mobile-menu-btn');
    const navLinks = document.getElementById('nav-links');
    const workAccordion = document.querySelector('.nav-accordion');
    const accordionToggleBtn = document.querySelector('.accordion-toggle-btn');

    function closeMenu() {
      if (navLinks && menuBtn) {
        navLinks.classList.remove('is-open');
        menuBtn.classList.remove('is-active');
        menuBtn.setAttribute('aria-expanded', 'false');
        document.body.style.overflow = '';
        document.body.classList.remove('menu-open');
      }
    }

    if (menuBtn && navLinks) {
      menuBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        const isOpen = navLinks.classList.toggle('is-open');
        menuBtn.classList.toggle('is-active', isOpen);
        menuBtn.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
        document.body.style.overflow = isOpen ? 'hidden' : '';
        document.body.classList.toggle('menu-open', isOpen);
      });

      // Accordion toggle for Work on mobile
      if (accordionToggleBtn && workAccordion) {
        accordionToggleBtn.addEventListener('click', (e) => {
          e.preventDefault();
          e.stopPropagation();
          const isExpanded = workAccordion.classList.toggle('is-expanded');
          accordionToggleBtn.setAttribute('aria-expanded', isExpanded ? 'true' : 'false');
        });
      }

      // Close menu when clicking any nav link or case study item
      navLinks.querySelectorAll('a').forEach(link => {
        link.addEventListener('click', () => {
          closeMenu();
        });
      });

      // Close menu on click outside
      document.addEventListener('click', (e) => {
        if (navLinks.classList.contains('is-open') && !navLinks.contains(e.target) && !menuBtn.contains(e.target)) {
          closeMenu();
        }
      });

      // Close menu on Escape key
      document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && navLinks.classList.contains('is-open')) {
          closeMenu();
        }
      });

      // Reset scroll lock on resize to desktop
      window.addEventListener('resize', () => {
        if (window.innerWidth > 768 && navLinks.classList.contains('is-open')) {
          closeMenu();
        }
      });
    }
  });

  // Listen for system theme changes if no manual preference is saved
  try {
    window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
      if (!localStorage.getItem('theme')) {
        if (e.matches) {
          document.documentElement.setAttribute('data-theme', 'dark');
        } else {
          document.documentElement.removeAttribute('data-theme');
        }
      }
    });
  } catch (err) {}
})();
