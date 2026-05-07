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

  if (gsapReady && !reduceMo) {
    document.documentElement.classList.add('gsap-init');
    gsap.registerPlugin(ScrollTrigger);
    if (typeof SplitText !== 'undefined') gsap.registerPlugin(SplitText);

    // Hero entrance
    const heroEls = ['.hero-title', '.badge', '.hero-sub', '.hero-cta', '.hero-stats', '.hero-diagram'];
    const present = heroEls.filter(sel => document.querySelector(sel));
    if (present.length) {
      gsap.set(present, { autoAlpha: 0 });
      gsap.set(present.filter(s => s !== '.hero-title'), { y: 30 });

      const tl = gsap.timeline({ delay: 0.15, defaults: { ease: 'power3.out', duration: 0.9 } });
      tl.to('.badge', { autoAlpha: 1, y: 0, duration: 0.6 });

      const heroTitle = document.querySelector('.hero-title');
      if (heroTitle && typeof SplitText !== 'undefined') {
        const split = new SplitText(heroTitle, { type: 'words', mask: 'words', wordsClass: 'hero-word' });
        gsap.set(heroTitle, { autoAlpha: 1 });
        gsap.set(split.words, { yPercent: 110 });
        tl.to(split.words, {
          yPercent: 0,
          duration: 1.0,
          ease: 'power3.out',
          stagger: 0.06
        }, '-=0.35');
      } else if (heroTitle) {
        tl.to('.hero-title', { autoAlpha: 1, y: 0, duration: 0.9 }, '-=0.35');
      }

      const restSeq = [
        { sel: '.hero-sub',     off: '-=0.6' },
        { sel: '.hero-cta',     off: '-=0.6' },
        { sel: '.hero-stats',   off: '-=0.7' },
        { sel: '.hero-diagram', off: '-=0.8' }
      ];
      restSeq.forEach(s => {
        if (document.querySelector(s.sel)) {
          tl.to(s.sel, { autoAlpha: 1, y: 0, duration: 0.9 }, s.off);
        }
      });
    }

    // Section h2 word-reveal on scroll
    if (typeof SplitText !== 'undefined') {
      document.querySelectorAll('.section-head h2, .firmware-text h2, .cta h2').forEach(h2 => {
        const split = new SplitText(h2, { type: 'words', mask: 'words', wordsClass: 'section-word' });
        gsap.set(split.words, { yPercent: 110 });
        ScrollTrigger.create({
          trigger: h2,
          start: 'top 85%',
          once: true,
          onEnter: () => gsap.to(split.words, {
            yPercent: 0,
            duration: 0.8,
            ease: 'power3.out',
            stagger: 0.05
          })
        });
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

    // Subtle 2D card tilt on hover (desktop, fine pointer only)
    mm.add('(hover: hover) and (pointer: fine)', () => {
      const tiltCards = document.querySelectorAll('.overview-block, .pipe-step, .tech, .challenge, .member, .firmware-code, .diagram-card, .report-cta');
      tiltCards.forEach(card => {
        const setRX = gsap.quickTo(card, 'rotateX', { duration: 0.5, ease: 'power2.out' });
        const setRY = gsap.quickTo(card, 'rotateY', { duration: 0.5, ease: 'power2.out' });
        card.style.transformPerspective = '1000px';
        card.style.transformStyle = 'preserve-3d';
        card.addEventListener('mousemove', (e) => {
          const rect = card.getBoundingClientRect();
          const x = (e.clientX - rect.left) / rect.width - 0.5;
          const y = (e.clientY - rect.top) / rect.height - 0.5;
          setRY(x * 4);
          setRX(-y * 4);
        });
        card.addEventListener('mouseleave', () => {
          gsap.to(card, { rotateX: 0, rotateY: 0, duration: 0.6, ease: 'power3.out' });
        });
      });
    });

    // Background glow parallax
    if (document.querySelector('.bg-glow')) {
      gsap.set('.bg-glow', { xPercent: -50 });
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
