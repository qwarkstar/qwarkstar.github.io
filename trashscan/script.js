// ──────────────────────────────────────────
// TrashScan subsite interactions
// Engineering dossier at night · signal green
// ──────────────────────────────────────────

(function () {
  'use strict';

  // ── Nav: hairline fill on scroll ─────────
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
    navToggle.setAttribute('aria-expanded', 'false');

    navToggle.addEventListener('click', () => {
      const open = navToggle.classList.toggle('open');
      navLinks.classList.toggle('open', open);
      navToggle.setAttribute('aria-expanded', open ? 'true' : 'false');
    });

    navLinks.querySelectorAll('a').forEach((link) => {
      link.addEventListener('click', () => {
        navToggle.classList.remove('open');
        navLinks.classList.remove('open');
        navToggle.setAttribute('aria-expanded', 'false');
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
      window.scrollTo({ top: offset, behavior: window._jrSmoother ? 'auto' : 'smooth' });
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
      'color: #9aa3c0; font-size: 13px;',
      'color: #5d6580; font-size: 13px;'
    );
  }

  // ── GSAP animations ──────────────────────
  const gsapReady = typeof window.gsap !== 'undefined' && typeof window.ScrollTrigger !== 'undefined';
  const reduceMo = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  if (gsapReady && !reduceMo) {
    document.documentElement.classList.add('gsap-init');
    gsap.registerPlugin(ScrollTrigger);
    if (typeof SplitText !== 'undefined') gsap.registerPlugin(SplitText);
    if (typeof ScrambleTextPlugin !== 'undefined') gsap.registerPlugin(ScrambleTextPlugin);

    // Buttery smooth scrolling (desktop; touch stays native)
    if (typeof ScrollSmoother !== 'undefined' &&
        document.querySelector('#smooth-wrapper') &&
        document.querySelector('#smooth-content')) {
      gsap.registerPlugin(ScrollSmoother);
      document.documentElement.style.scrollBehavior = 'auto';
      window._jrSmoother = ScrollSmoother.create({
        wrapper: '#smooth-wrapper',
        content: '#smooth-content',
        smooth: 1.1,
        effects: false,
        smoothTouch: false
      });
    }

    // Run motion setup once webfonts are in, so SplitText measures real glyphs
    const initMotion = () => {

    const mm = gsap.matchMedia();

    // Hero entrance: dossier sheet assembles top to bottom
    const heroEls = ['.hero-meta', '.hero-title', '.hero-tagline', '.hero-sub', '.hero-cta', '.hero-stats', '.hero-diagram'];
    const present = heroEls.filter(sel => document.querySelector(sel));
    if (present.length) {
      gsap.set(present, { autoAlpha: 0 });
      gsap.set(present.filter(s => s !== '.hero-title'), { y: 24 });

      const tl = gsap.timeline({ delay: 0.15, defaults: { ease: 'power4.out', duration: 0.9 } });
      if (document.querySelector('.hero-meta')) {
        tl.to('.hero-meta', { autoAlpha: 1, y: 0, duration: 0.6 });
      }

      const heroTitle = document.querySelector('.hero-title');
      if (heroTitle && typeof SplitText !== 'undefined') {
        // Single display word: masked per-character rise
        const split = new SplitText(heroTitle, { type: 'chars', mask: 'chars', charsClass: 'hero-char' });
        gsap.set(heroTitle, { autoAlpha: 1 });
        gsap.set(split.chars, { yPercent: 110 });
        tl.to(split.chars, {
          yPercent: 0,
          duration: 1.1,
          ease: 'power4.out',
          stagger: 0.045
        }, '-=0.25');
      } else if (heroTitle) {
        tl.to('.hero-title', { autoAlpha: 1, duration: 0.9 }, '-=0.25');
      }

      const restSeq = [
        { sel: '.hero-tagline', off: '-=0.7' },
        { sel: '.hero-sub',     off: '-=0.7' },
        { sel: '.hero-cta',     off: '-=0.7' },
        { sel: '.hero-stats',   off: '-=0.65' },
        { sel: '.hero-diagram', off: '-=0.75' }
      ];
      restSeq.forEach(s => {
        if (document.querySelector(s.sel)) {
          tl.to(s.sel, { autoAlpha: 1, y: 0, duration: 0.9 }, s.off);
        }
      });
    }

    // Section h2 masked word-reveal on scroll
    if (typeof SplitText !== 'undefined') {
      document.querySelectorAll('.section-head h2, .cta h2').forEach(h2 => {
        const split = new SplitText(h2, { type: 'words', mask: 'words', wordsClass: 'section-word' });
        gsap.set(split.words, { yPercent: 110 });
        ScrollTrigger.create({
          trigger: h2,
          start: 'top 85%',
          once: true,
          onEnter: () => gsap.to(split.words, {
            yPercent: 0,
            duration: 0.9,
            ease: 'power4.out',
            stagger: 0.05
          })
        });
      });
    }

    // Diagram spec rows stagger inside the hero figure
    const diagramNodes = document.querySelectorAll('.diagram-node, .diagram-arrow');
    if (diagramNodes.length) {
      gsap.from(diagramNodes, {
        autoAlpha: 0,
        x: -16,
        stagger: 0.08,
        duration: 0.6,
        ease: 'power2.out',
        delay: 1.0
      });
    }

    // Reveal on scroll: ledger rows, spec blocks, panels
    const revealSelectors = [
      '.section-head', '.overview-prose p', '.pipe-step', '.tech-row',
      '.firmware-text', '.firmware-code', '.report-cta', '.challenge',
      '.role-list li', '.outcome', '.team-credit', '.cta'
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

    // Firmware code frame: brief signal glow when it scrolls into view
    const codeBlock = document.querySelector('.firmware-code pre code');
    if (codeBlock) {
      ScrollTrigger.create({
        trigger: '.firmware-code',
        start: 'top 75%',
        once: true,
        onEnter: () => {
          gsap.fromTo('.firmware-code',
            { boxShadow: '0 0 0 rgba(52, 211, 153, 0)' },
            {
              boxShadow: '0 0 60px rgba(52, 211, 153, 0.22)',
              duration: 1.2,
              ease: 'power2.out',
              yoyo: true,
              repeat: 1
            }
          );
        }
      });
    }

    // Pipeline scanner: a detection dot rides the track while steps light up.
    // Desktop pins the section so the sweep plays out in place.
    const pipeTrack = document.querySelector('.pipeline-line-track');
    const pipeSteps = gsap.utils.toArray('.pipeline-line .pipe-step');
    if (pipeTrack && pipeSteps.length) {
      const scanDot = document.createElement('span');
      scanDot.className = 'pipe-scan-dot';
      pipeTrack.appendChild(scanDot);
      const glows = pipeSteps.map((step) => {
        const glow = document.createElement('span');
        glow.className = 'pipe-step-glow';
        step.appendChild(glow);
        return glow;
      });
      const buildScan = (stConfig) => {
        const tl = gsap.timeline({ scrollTrigger: stConfig });
        tl.fromTo(scanDot,
          { left: '0%' },
          { left: '100%', ease: 'none', duration: pipeSteps.length },
          0
        );
        glows.forEach((glow, i) => {
          tl.to(glow, { opacity: 1, duration: 0.3, ease: 'none' }, i + 0.25)
            .to(glow, { opacity: 0, duration: 0.35, ease: 'none' }, i + 0.78);
        });
        return tl;
      };
      mm.add('(min-width: 1024px)', () => {
        buildScan({
          trigger: '.pipeline',
          start: 'center center',
          end: '+=130%',
          pin: true,
          scrub: 1,
          anticipatePin: 1
        });
      });
      mm.add('(max-width: 1023px)', () => {
        buildScan({
          trigger: '.pipeline',
          start: 'top 78%',
          end: 'bottom 40%',
          scrub: 1
        });
      });
    }

    // Code filename scrambles in like a terminal prompt
    if (typeof ScrambleTextPlugin !== 'undefined') {
      const codeTitle = document.querySelector('.code-title');
      if (codeTitle) {
        const fileName = codeTitle.textContent;
        ScrollTrigger.create({
          trigger: '.firmware-code',
          start: 'top 80%',
          once: true,
          onEnter: () => gsap.to(codeTitle, {
            scrambleText: { text: fileName, chars: '01{}<>/;', speed: 0.4 },
            duration: 1.2,
            ease: 'none'
          })
        });
      }
    }

    // Detection pulse flows through the hero spec list, node by node
    const diagNodes = gsap.utils.toArray('.hero-diagram .diagram-node');
    const diagArrows = gsap.utils.toArray('.hero-diagram .diagram-arrow');
    if (diagNodes.length) {
      const flowTl = gsap.timeline({ repeat: -1, repeatDelay: 1.6, paused: true, delay: 2.8 });
      diagNodes.forEach((node, i) => {
        const icon = node.querySelector('.diagram-icon');
        if (!icon) return;
        flowTl
          .to(icon, { scale: 1.16, duration: 0.22, ease: 'power2.out' }, i * 0.55)
          .to(icon, { scale: 1, duration: 0.4, ease: 'power2.inOut' }, i * 0.55 + 0.22);
        if (diagArrows[i]) {
          flowTl
            .fromTo(diagArrows[i],
              { y: -3, opacity: 0.45 },
              { y: 3, opacity: 1, duration: 0.28, ease: 'power1.in', immediateRender: false },
              i * 0.55 + 0.26)
            .to(diagArrows[i], { y: 0, opacity: 0.8, duration: 0.22 }, i * 0.55 + 0.54);
        }
      });
      ScrollTrigger.create({
        trigger: '.hero-diagram',
        start: 'top bottom',
        end: 'bottom top',
        onToggle: (self) => (self.isActive ? flowTl.play() : flowTl.pause())
      });
    }

    // Normalize refresh order across all the triggers created above
    ScrollTrigger.sort();
    ScrollTrigger.refresh();
    };
    if (document.fonts && document.fonts.ready) {
      document.fonts.ready.then(initMotion);
    } else {
      initMotion();
    }
  }
})();
