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

    // Mobile Navigation Menu Toggle
    const menuBtn = document.getElementById('mobile-menu-btn');
    const navLinks = document.getElementById('nav-links');

    if (menuBtn && navLinks) {
      menuBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        const isOpen = navLinks.classList.toggle('is-open');
        menuBtn.classList.toggle('is-active', isOpen);
        menuBtn.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
      });

      // Close menu when clicking any nav link
      navLinks.querySelectorAll('a').forEach(link => {
        link.addEventListener('click', () => {
          navLinks.classList.remove('is-open');
          menuBtn.classList.remove('is-active');
          menuBtn.setAttribute('aria-expanded', 'false');
        });
      });

      // Close menu on click outside
      document.addEventListener('click', (e) => {
        if (!navLinks.contains(e.target) && !menuBtn.contains(e.target)) {
          navLinks.classList.remove('is-open');
          menuBtn.classList.remove('is-active');
          menuBtn.setAttribute('aria-expanded', 'false');
        }
      });

      // Close menu on Escape key
      document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && navLinks.classList.contains('is-open')) {
          navLinks.classList.remove('is-open');
          menuBtn.classList.remove('is-active');
          menuBtn.setAttribute('aria-expanded', 'false');
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
