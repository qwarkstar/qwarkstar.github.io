// ──────────────────────────────────────────
// Julian Rzezak portfolio interactions
// Shares behavior with R·iving site
// ──────────────────────────────────────────

(function () {
  'use strict';

  // ── Nav: glass effect on scroll ──────────
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

  // ── Scroll progress bar ──────────────────
  const progressBar = document.getElementById('scrollProgress');
  if (progressBar) {
    const updateProgress = () => {
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      const pct = docHeight > 0 ? (window.scrollY / docHeight) * 100 : 0;
      progressBar.style.width = `${Math.min(100, Math.max(0, pct))}%`;
    };
    window.addEventListener('scroll', updateProgress, { passive: true });
    window.addEventListener('resize', updateProgress, { passive: true });
    updateProgress();
  }

  // ── Console branding ─────────────────────
  if (console && console.log) {
    console.log(
      '%cJulian Rzezak',
      'color: #4f93ff; font-size: 28px; font-weight: 800; letter-spacing: -0.03em;'
    );
    console.log(
      '%cCS/CE @ Northeastern %c→ julian.rzezak@gmail.com',
      'color: #94a3b8; font-size: 13px;',
      'color: #64748b; font-size: 13px;'
    );
    console.log(
      '%chttps://github.com/qwarkstar',
      'color: #7eb1ff; font-size: 12px;'
    );
  }

  // ── GSAP animations ──────────────────────
  const gsapReady = typeof window.gsap !== 'undefined';
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  if (gsapReady && !reducedMotion) {
    // Add gsap-init only when we'll actually run reveal tweens — otherwise the
    // CSS rule would leave the hero permanently hidden.
    document.documentElement.classList.add('gsap-init');
    gsap.registerPlugin(ScrollTrigger);

    // Hero entrance choreography
    const heroEls = ['.hero-title', '.badge', '.hero-sub', '.hero-cta', '.social-row', '.hero-stats', '.phone-wrap', '.hero-diagram'];
    const present = heroEls.filter(sel => document.querySelector(sel));
    if (present.length) {
      gsap.set(present, { autoAlpha: 0, y: 30 });
      const tl = gsap.timeline({ delay: 0.15, defaults: { ease: 'power3.out', duration: 0.9 } });
      const seq = [
        { sel: '.badge',        dur: 0.6, off: 0       },
        { sel: '.hero-title',   dur: 0.9, off: '-=0.3' },
        { sel: '.hero-sub',     dur: 0.9, off: '-=0.6' },
        { sel: '.hero-cta',     dur: 0.9, off: '-=0.6' },
        { sel: '.social-row',   dur: 0.9, off: '-=0.7' },
        { sel: '.hero-stats',   dur: 0.9, off: '-=0.7' },
        { sel: '.phone-wrap',   dur: 1.0, off: '-=0.8' },
        { sel: '.hero-diagram', dur: 1.0, off: '-=0.7' }
      ];
      seq.forEach(s => {
        if (document.querySelector(s.sel)) {
          tl.to(s.sel, { autoAlpha: 1, y: 0, duration: s.dur }, s.off);
        }
      });
    }

    // Section + card reveal on scroll
    const revealSelectors = [
      '.section-head', '.featured-card', '.project-card', '.step', '.feature',
      '.audience', '.edu-card', '.cert-card', '.pipe-step', '.overview-block',
      '.tech', '.challenge', '.member', '.role-list li', '.firmware-code',
      '.diagram-card', '.contact-card', '.cta', '.report-cta', '.outcome',
      '.subhead', '.trust-text', '.trust-check'
    ].join(', ');
    const revealEls = document.querySelectorAll(revealSelectors);
    if (revealEls.length) {
      gsap.set(revealEls, { autoAlpha: 0, y: 40 });
      ScrollTrigger.batch(revealEls, {
        start: 'top 88%',
        onEnter: (els) => gsap.to(els, {
          autoAlpha: 1,
          y: 0,
          stagger: 0.08,
          duration: 0.7,
          ease: 'power3.out',
          overwrite: true
        })
      });
    }

    // Magnetic primary button (desktop only, fine pointer)
    const mm = gsap.matchMedia();
    mm.add('(hover: hover) and (pointer: fine)', () => {
      document.querySelectorAll('.btn-primary, .btn-large').forEach(btn => {
        btn.addEventListener('mousemove', (e) => {
          const rect = btn.getBoundingClientRect();
          const x = e.clientX - rect.left - rect.width / 2;
          const y = e.clientY - rect.top - rect.height / 2;
          gsap.to(btn, { x: x * 0.3, y: y * 0.3, duration: 0.4, ease: 'power2.out' });
        });
        btn.addEventListener('mouseleave', () => {
          gsap.to(btn, { x: 0, y: 0, duration: 0.5, ease: 'elastic.out(1, 0.4)' });
        });
      });
    });

    // Stat counter on hero stats (numeric values only)
    document.querySelectorAll('.hero-stats .stat strong').forEach(el => {
      const text = el.textContent.trim();
      const match = text.match(/^([\d.]+)(.*)$/);
      if (!match) return;
      const target = parseFloat(match[1]);
      const suffix = match[2];
      const isFloat = match[1].includes('.');
      const obj = { val: 0 };
      const setText = (v) => { el.textContent = (isFloat ? v.toFixed(1) : Math.round(v)) + suffix; };
      setText(0);
      ScrollTrigger.create({
        trigger: el,
        start: 'top 90%',
        once: true,
        onEnter: () => gsap.to(obj, {
          val: target,
          duration: 1.4,
          ease: 'power2.out',
          onUpdate: () => setText(obj.val)
        })
      });
    });

    // Gradient glint loop — periodic shine sweep across .gradient text
    document.querySelectorAll('.gradient').forEach(el => {
      gsap.fromTo(el,
        { '--shine': '-120%' },
        {
          '--shine': '220%',
          duration: 1.4,
          ease: 'power2.inOut',
          repeat: -1,
          repeatDelay: 4
        }
      );
    });

    // Background glow parallax — fixed glows drift as you scroll for depth
    const bgGlow = document.querySelector('.bg-glow');
    if (bgGlow) {
      gsap.set('.bg-glow', { xPercent: -50 }); // preserve CSS centering
      gsap.to('.bg-glow', {
        y: -240,
        ease: 'none',
        scrollTrigger: { trigger: 'body', start: 'top top', end: 'bottom top', scrub: true }
      });
    }
    if (document.querySelector('.bg-glow-2')) {
      gsap.to('.bg-glow-2', {
        y: 180,
        ease: 'none',
        scrollTrigger: { trigger: 'body', start: 'top top', end: 'bottom top', scrub: true }
      });
    }

    // Marquee speed reactive to scroll velocity
    const marqueeTracks = document.querySelectorAll('.marquee-track');
    if (marqueeTracks.length) {
      marqueeTracks.forEach(track => {
        track.style.animation = 'none'; // disable CSS keyframe so GSAP owns it
        track._marqueeTween = gsap.to(track, {
          xPercent: -50,
          duration: 50,
          ease: 'none',
          repeat: -1
        });
      });
      let scrollEndTimer;
      ScrollTrigger.create({
        trigger: document.body,
        start: 0,
        end: 'max',
        onUpdate: (self) => {
          const v = gsap.utils.clamp(1, 8, 1 + Math.abs(self.getVelocity()) / 2000);
          marqueeTracks.forEach(track => {
            if (track._marqueeTween) {
              gsap.to(track._marqueeTween, { timeScale: v, duration: 0.2, overwrite: 'auto' });
            }
          });
          clearTimeout(scrollEndTimer);
          scrollEndTimer = setTimeout(() => {
            marqueeTracks.forEach(track => {
              if (track._marqueeTween) {
                gsap.to(track._marqueeTween, { timeScale: 1, duration: 1.2, ease: 'power2.out' });
              }
            });
          }, 150);
        }
      });
    }
  }
})();
