// ──────────────────────────────────────────
// Julian Rzezak — portfolio interactions
// Shares behavior with JustAhead site
// ──────────────────────────────────────────

(function () {
  'use strict';

  // ── Nav — glass effect on scroll ─────────
  const nav = document.getElementById('nav');
  const SCROLL_THRESHOLD = 24;

  function handleNavScroll() {
    if (!nav) return;
    if (window.scrollY > SCROLL_THRESHOLD) {
      nav.classList.add('scrolled');
    } else {
      nav.classList.remove('scrolled');
    }
  }

  window.addEventListener('scroll', handleNavScroll, { passive: true });
  handleNavScroll();

  // ── Mobile menu toggle ───────────────────
  const navToggle = document.getElementById('navToggle');
  const navLinks = document.getElementById('navLinks');

  if (navToggle && navLinks) {
    navToggle.addEventListener('click', () => {
      navToggle.classList.toggle('open');
      navLinks.classList.toggle('open');
    });

    navLinks.querySelectorAll('a').forEach((link) => {
      link.addEventListener('click', () => {
        navToggle.classList.remove('open');
        navLinks.classList.remove('open');
      });
    });
  }

  // ── Intersection Observer for reveal animations ──
  const revealElements = document.querySelectorAll('.reveal');

  if ('IntersectionObserver' in window && revealElements.length) {
    const revealObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const siblings = Array.from(
              entry.target.parentElement?.querySelectorAll('.reveal') || []
            );
            const indexInParent = siblings.indexOf(entry.target);
            const delay = Math.min(indexInParent * 80, 400);

            setTimeout(() => {
              entry.target.classList.add('visible');
            }, delay);

            revealObserver.unobserve(entry.target);
          }
        });
      },
      {
        threshold: 0.12,
        rootMargin: '0px 0px -60px 0px',
      }
    );

    revealElements.forEach((el) => revealObserver.observe(el));
  } else {
    revealElements.forEach((el) => el.classList.add('visible'));
  }

  // ── Smooth scroll for same-page anchors ──
  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener('click', (e) => {
      const href = anchor.getAttribute('href');
      if (!href || href === '#') return;

      const target = document.querySelector(href);
      if (!target) return;

      e.preventDefault();
      const navHeight = nav ? nav.offsetHeight : 0;
      const offset = target.getBoundingClientRect().top + window.scrollY - navHeight - 12;
      window.scrollTo({ top: offset, behavior: 'smooth' });
    });
  });

  // ── Active nav link highlight ────────────
  const sections = document.querySelectorAll('section[id]');
  const navAnchors = document.querySelectorAll('.nav-links a[href^="#"]');

  if (sections.length && navAnchors.length && 'IntersectionObserver' in window) {
    const sectionObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const id = entry.target.getAttribute('id');
            navAnchors.forEach((a) => {
              if (a.getAttribute('href') === `#${id}`) {
                a.classList.add('active');
              } else {
                a.classList.remove('active');
              }
            });
          }
        });
      },
      { rootMargin: '-40% 0px -55% 0px' }
    );

    sections.forEach((section) => sectionObserver.observe(section));
  }

  // ── Console branding ─────────────────────
  if (console && console.log) {
    console.log(
      '%cJulian Rzezak',
      'color: #0A84FF; font-size: 28px; font-weight: 800; letter-spacing: -0.03em;'
    );
    console.log(
      '%cCS/CE @ Northeastern %c→ julian.rzezak@gmail.com',
      'color: #a1a1aa; font-size: 13px;',
      'color: #6b6b76; font-size: 13px;'
    );
    console.log(
      '%chttps://github.com/qwarkstar',
      'color: #F5C87A; font-size: 12px;'
    );
  }
})();
