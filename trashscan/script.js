// ──────────────────────────────────────────
// TrashScan subsite interactions
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

  // ── Mobile menu toggle ──────────────────
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

  // ── Active section highlight in nav ──────
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
      '%cTrashScan',
      'color: #34d399; font-size: 28px; font-weight: 800; letter-spacing: -0.03em;'
    );
    console.log(
      '%cSmart metal detection for restaurant waste %c→ julian.rzezak@gmail.com',
      'color: #94a3b8; font-size: 13px;',
      'color: #64748b; font-size: 13px;'
    );
  }

  // ── GSAP animations ──────────────────────
  const gsapReady = typeof window.gsap !== 'undefined';
  const reduceMo = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  if (gsapReady) {
    document.documentElement.classList.add('gsap-init');
  }

  if (gsapReady && !reduceMo) {
    gsap.registerPlugin(ScrollTrigger);

    // Hero entrance
    const heroEls = ['.hero-title', '.badge', '.hero-sub', '.hero-cta', '.hero-stats', '.hero-diagram'];
    const present = heroEls.filter(sel => document.querySelector(sel));
    if (present.length) {
      gsap.set(present, { autoAlpha: 0, y: 30 });
      const tl = gsap.timeline({ delay: 0.15, defaults: { ease: 'power3.out', duration: 0.9 } });
      const seq = [
        { sel: '.badge',        dur: 0.6, off: 0       },
        { sel: '.hero-title',   dur: 0.9, off: '-=0.3' },
        { sel: '.hero-sub',     dur: 0.9, off: '-=0.6' },
        { sel: '.hero-cta',     dur: 0.9, off: '-=0.6' },
        { sel: '.hero-stats',   dur: 0.9, off: '-=0.7' },
        { sel: '.hero-diagram', dur: 1.0, off: '-=0.8' }
      ];
      seq.forEach(s => {
        if (document.querySelector(s.sel)) {
          tl.to(s.sel, { autoAlpha: 1, y: 0, duration: s.dur }, s.off);
        }
      });
    }

    // Diagram nodes stagger inside the hero diagram card
    const diagramNodes = document.querySelectorAll('.diagram-node, .diagram-arrow');
    if (diagramNodes.length) {
      gsap.from(diagramNodes, {
        autoAlpha: 0,
        x: -20,
        stagger: 0.1,
        duration: 0.6,
        ease: 'power2.out',
        delay: 0.9
      });
    }

    // Reveal on scroll
    const revealSelectors = [
      '.section-head', '.overview-block', '.pipe-step', '.tech', '.firmware-text',
      '.firmware-code', '.report-cta', '.challenge', '.role-list li', '.outcome',
      '.member', '.cta'
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

    // Magnetic CTA buttons
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

    // Hero stat counters
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

    // Gradient glint
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

    // Firmware code block: subtle line-by-line highlight pulse on scroll into view
    const codeBlock = document.querySelector('.firmware-code pre code');
    if (codeBlock) {
      ScrollTrigger.create({
        trigger: '.firmware-code',
        start: 'top 75%',
        once: true,
        onEnter: () => {
          gsap.fromTo('.firmware-code',
            { boxShadow: '0 1px 0 rgba(255, 255, 255, 0.05) inset, 0 24px 60px -20px rgba(0, 0, 0, 0.5)' },
            {
              boxShadow: '0 1px 0 rgba(255, 255, 255, 0.05) inset, 0 24px 60px -20px rgba(0, 0, 0, 0.5), 0 0 60px rgba(52, 211, 153, 0.25)',
              duration: 1.2,
              ease: 'power2.out',
              yoyo: true,
              repeat: 1
            }
          );
        }
      });
    }
  }
})();
