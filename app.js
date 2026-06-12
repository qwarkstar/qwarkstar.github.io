// ════════════════════════════════════════════════════════════
// Julian Rzezak portfolio · v6 "engineering dossier at night"
// ════════════════════════════════════════════════════════════

(function () {
  'use strict';

  // ── Nav: solid surface on scroll ─────────────────────────
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

  // ── Local clock (Boston / Miami share Eastern time) ──────
  const clockEl = document.getElementById('navClock');
  if (clockEl) {
    try {
      const fmt = new Intl.DateTimeFormat('en-US', {
        hour: '2-digit', minute: '2-digit', hour12: false,
        timeZone: 'America/New_York'
      });
      const tick = () => {
        clockEl.innerHTML = 'BOS / MIA <b>' + fmt.format(new Date()) + ' ET</b>';
      };
      tick();
      setInterval(tick, 30000);
    } catch (e) { /* Intl unavailable: leave placeholder */ }
  }

  // ── Mobile menu ──────────────────────────────────────────
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

  // ── Smooth same-page anchors (ScrollSmoother-aware) ──────
  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener('click', (e) => {
      const href = anchor.getAttribute('href');
      if (!href || href === '#') return;
      const target = document.querySelector(href);
      if (!target) return;
      e.preventDefault();
      const navHeight = nav ? nav.offsetHeight : 0;
      const offset = target.getBoundingClientRect().top + window.scrollY - navHeight - 8;
      // With ScrollSmoother active, jump the real scroll position and let the
      // smoother glide the content; double-smoothing feels like syrup.
      window.scrollTo({ top: offset, behavior: window._jrSmoother ? 'auto' : 'smooth' });
    });
  });

  const toTop = document.getElementById('toTop');
  if (toTop) {
    toTop.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: window._jrSmoother ? 'auto' : 'smooth' });
    });
  }

  // ── Active nav link ──────────────────────────────────────
  const sections = document.querySelectorAll('section[id], header.hero');
  const navAnchors = document.querySelectorAll('.nav-links a[href^="#"]');

  if (sections.length && navAnchors.length && 'IntersectionObserver' in window) {
    const sectionObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const id = entry.target.getAttribute('id');
            navAnchors.forEach((a) => {
              a.classList.toggle('active', a.getAttribute('href') === '#' + id);
            });
          }
        });
      },
      { rootMargin: '-40% 0px -55% 0px' }
    );
    sections.forEach((section) => sectionObserver.observe(section));
  }

  // ── Scroll progress bar ──────────────────────────────────
  const progressBar = document.getElementById('scrollProgress');
  if (progressBar) {
    const updateProgress = () => {
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      const pct = docHeight > 0 ? (window.scrollY / docHeight) * 100 : 0;
      progressBar.style.width = Math.min(100, Math.max(0, pct)) + '%';
    };
    window.addEventListener('scroll', updateProgress, { passive: true });
    window.addEventListener('resize', updateProgress, { passive: true });
    updateProgress();
  }

  // ── Console branding ─────────────────────────────────────
  if (console && console.log) {
    console.log(
      '%cJulian Rzezak',
      'color: #4f93ff; font-size: 28px; font-weight: 800; letter-spacing: -0.03em;'
    );
    console.log(
      '%cCS/CE @ Northeastern %c-> julian.rzezak@gmail.com',
      'color: #9aa3c0; font-size: 13px;',
      'color: #5d6580; font-size: 13px;'
    );
  }

  // ── GSAP choreography ────────────────────────────────────
  const gsapReady = typeof window.gsap !== 'undefined' && typeof window.ScrollTrigger !== 'undefined';
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  if (gsapReady && !reducedMotion) {
    document.documentElement.classList.add('gsap-init');
    gsap.registerPlugin(ScrollTrigger);
    if (typeof SplitText !== 'undefined') gsap.registerPlugin(SplitText);
    if (typeof ScrambleTextPlugin !== 'undefined') gsap.registerPlugin(ScrambleTextPlugin);

    // Buttery smooth scrolling (desktop; touch stays native)
    let smoother = null;
    if (typeof ScrollSmoother !== 'undefined' &&
        document.querySelector('#smooth-wrapper') &&
        document.querySelector('#smooth-content')) {
      gsap.registerPlugin(ScrollSmoother);
      document.documentElement.style.scrollBehavior = 'auto';
      smoother = ScrollSmoother.create({
        wrapper: '#smooth-wrapper',
        content: '#smooth-content',
        smooth: 1.1,
        effects: false,
        smoothTouch: false
      });
      window._jrSmoother = smoother;
    }

    // Intro preloader: once per session, lifts into the hero entrance
    const runIntro = () => {
      let seen = false;
      try { seen = !!sessionStorage.getItem('jr-intro-seen'); } catch (e) {}
      if (seen) return Promise.resolve();
      try { sessionStorage.setItem('jr-intro-seen', '1'); } catch (e) {}

      const loader = document.createElement('div');
      loader.className = 'loader';
      loader.setAttribute('aria-hidden', 'true');
      loader.innerHTML =
        '<div class="loader-name">' +
          '<span class="loader-outline">Julian<br>Rzezak</span>' +
          '<span class="loader-fill" aria-hidden="true">Julian<br>Rzezak</span>' +
        '</div>' +
        '<div class="loader-meta"><span>Portfolio &middot; 2026</span><span class="loader-count">00</span></div>' +
        '<span class="loader-line"></span>';
      document.body.appendChild(loader);
      if (smoother) smoother.paused(true);

      return new Promise((resolve) => {
        const count = loader.querySelector('.loader-count');
        const fill = loader.querySelector('.loader-fill');
        const line = loader.querySelector('.loader-line');
        const state = { v: 0 };
        gsap.timeline({
          onComplete: () => {
            loader.remove();
            if (smoother) smoother.paused(false);
          }
        })
        .to(state, {
          v: 100,
          duration: 1.4,
          ease: 'power2.inOut',
          onUpdate: () => {
            const n = Math.round(state.v);
            count.textContent = (n < 10 ? '0' : '') + n;
            line.style.transform = 'scaleX(' + state.v / 100 + ')';
            fill.style.clipPath = 'inset(' + (100 - state.v) + '% 0 0 0)';
          }
        })
        .add(() => resolve(), '+=0.15')
        .to(loader, { yPercent: -100, duration: 0.7, ease: 'power4.inOut' }, '+=0.05');
      });
    };

    // Motion setup runs once webfonts are in (SplitText measures real glyphs)
    const initMotion = () => {
      const mm = gsap.matchMedia();

      // ── Hero entrance ──────────────────────────────────
      const heroName = document.querySelector('.hero-name');
      const heroLines = gsap.utils.toArray('.hero-name .line');
      const heroLede = document.querySelector('.hero-lede');
      const heroSide = document.querySelector('.hero-side');
      const heroAnno = document.querySelector('.hero-anno-row');

      const tl = gsap.timeline({ delay: 0.1, defaults: { ease: 'power4.out' } });

      if (heroAnno) {
        gsap.set(heroAnno, { autoAlpha: 1 });
        gsap.set(heroAnno.children, { autoAlpha: 0, y: -14 });
        tl.to(heroAnno.children, { autoAlpha: 1, y: 0, duration: 0.7, stagger: 0.1 }, 0);
      }

      if (heroName && heroLines.length && typeof SplitText !== 'undefined') {
        heroName.style.perspective = '900px';
        heroLines.forEach((line, i) => {
          const split = new SplitText(line, { type: 'chars', mask: 'chars' });
          gsap.set(line, { autoAlpha: 1 });
          gsap.set(split.chars, { yPercent: 112, rotationX: -55, transformOrigin: '50% 100% -30px' });
          tl.to(split.chars, {
            yPercent: 0,
            rotationX: 0,
            duration: 1.2,
            ease: 'power4.out',
            stagger: 0.035
          }, 0.15 + i * 0.14);
        });
      } else if (heroLines.length) {
        gsap.set(heroLines, { autoAlpha: 0, y: 60 });
        tl.to(heroLines, { autoAlpha: 1, y: 0, duration: 1, stagger: 0.12 }, 0.15);
      }

      if (heroLede && typeof SplitText !== 'undefined') {
        const ledeSplit = new SplitText(heroLede, { type: 'lines', mask: 'lines' });
        gsap.set(heroLede, { autoAlpha: 1 });
        gsap.set(ledeSplit.lines, { yPercent: 120 });
        tl.to(ledeSplit.lines, { yPercent: 0, duration: 0.9, stagger: 0.08 }, 0.85);
      } else if (heroLede) {
        gsap.set(heroLede, { autoAlpha: 0, y: 30 });
        tl.to(heroLede, { autoAlpha: 1, y: 0, duration: 0.8 }, 0.85);
      }

      if (heroSide) {
        gsap.set(heroSide, { autoAlpha: 0, y: 24 });
        tl.to(heroSide, { autoAlpha: 1, y: 0, duration: 0.8 }, 1);
      }

      // Scramble the coordinate annotations
      if (typeof ScrambleTextPlugin !== 'undefined') {
        document.querySelectorAll('.hero-meta-line').forEach((line, i) => {
          gsap.to(line, {
            scrambleText: { text: line.textContent, chars: '01<>/·+', speed: 0.5 },
            duration: 1.1,
            delay: 0.4 + i * 0.16,
            ease: 'none'
          });
        });
      }

      // ── Hero exit: the composition drifts apart ────────
      gsap.to('.hero-name', {
        yPercent: -22,
        autoAlpha: 0,
        ease: 'none',
        scrollTrigger: { trigger: '.hero', start: 'top top', end: '85% top', scrub: true }
      });
      gsap.to('.hero-base', {
        y: 90,
        autoAlpha: 0,
        ease: 'none',
        scrollTrigger: { trigger: '.hero', start: 'top top', end: '70% top', scrub: true }
      });
      gsap.to('.hero-anno-row', {
        y: -70,
        autoAlpha: 0,
        ease: 'none',
        scrollTrigger: { trigger: '.hero', start: 'top top', end: '60% top', scrub: true }
      });
      gsap.to('.hero-glow', {
        yPercent: 30,
        ease: 'none',
        scrollTrigger: { trigger: '.hero', start: 'top top', end: 'bottom top', scrub: true }
      });

      // ── Spec strip: velocity-reactive marquee ──────────
      const stripTracks = document.querySelectorAll('.specstrip-track');
      if (stripTracks.length) {
        stripTracks.forEach((track) => {
          track._marqueeTween = gsap.to(track, {
            xPercent: -50,
            duration: 46,
            ease: 'none',
            repeat: -1
          });
        });
        let scrollEndTimer;
        ScrollTrigger.create({
          start: 0,
          end: 'max',
          onUpdate: (self) => {
            const v = gsap.utils.clamp(1, 7, 1 + Math.abs(self.getVelocity()) / 2200);
            stripTracks.forEach((track) => {
              gsap.to(track._marqueeTween, { timeScale: v, duration: 0.2, overwrite: 'auto' });
            });
            clearTimeout(scrollEndTimer);
            scrollEndTimer = setTimeout(() => {
              stripTracks.forEach((track) => {
                gsap.to(track._marqueeTween, { timeScale: 1, duration: 1.2, ease: 'power2.out' });
              });
            }, 160);
          }
        });
      }

      // ── Sheet scaffolding: rules draw, ghosts drift ────
      gsap.utils.toArray('.sheet-rule, .contact-head .rule').forEach((rule) => {
        gsap.from(rule, {
          scaleX: 0,
          duration: 1.2,
          ease: 'power4.out',
          scrollTrigger: { trigger: rule, start: 'top 90%', once: true }
        });
      });

      gsap.utils.toArray('.ghost-no').forEach((ghost) => {
        gsap.fromTo(ghost,
          { y: 90 },
          {
            y: -90,
            ease: 'none',
            scrollTrigger: {
              trigger: ghost.parentElement,
              start: 'top bottom',
              end: 'bottom top',
              scrub: true
            }
          }
        );
      });

      // ── 01 Profile: copy unmasks line by line ──────────
      if (typeof SplitText !== 'undefined') {
        document.querySelectorAll('.profile-copy p').forEach((p) => {
          SplitText.create(p, {
            type: 'lines',
            mask: 'lines',
            autoSplit: true,
            onSplit(self) {
              return gsap.from(self.lines, {
                yPercent: 120,
                duration: 0.9,
                ease: 'power4.out',
                stagger: 0.08,
                scrollTrigger: { trigger: p, start: 'top 86%', once: true }
              });
            }
          });
        });
      }

      const railAnnos = document.querySelectorAll('.profile-rail .anno, .profile-now .anno');
      if (railAnnos.length) {
        gsap.set(railAnnos, { autoAlpha: 0, x: -16 });
        ScrollTrigger.batch(railAnnos, {
          start: 'top 90%',
          onEnter: (els) => gsap.to(els, {
            autoAlpha: 1, x: 0, duration: 0.7, stagger: 0.08, ease: 'power4.out', overwrite: true
          })
        });
      }

      // ── 02 Work panels ─────────────────────────────────
      const panels = gsap.utils.toArray('.work-panel');

      panels.forEach((panel) => {
        const title = panel.querySelector('.panel-title');
        const items = panel.querySelectorAll('.panel-meta, .panel-tagline, .panel-desc, .panel-stack, .panel-text .rbtn');
        const visual = panel.querySelector('.panel-visual');

        gsap.set(items, { autoAlpha: 0, y: 44 });
        if (visual) gsap.set(visual, { autoAlpha: 0, scale: 0.85 });

        let titleChars = null;
        if (title && typeof SplitText !== 'undefined') {
          const split = new SplitText(title, { type: 'chars', mask: 'chars' });
          titleChars = split.chars;
          gsap.set(titleChars, { yPercent: 115 });
        } else if (title) {
          gsap.set(title, { autoAlpha: 0, y: 50 });
        }

        ScrollTrigger.create({
          trigger: panel,
          start: 'top 62%',
          once: true,
          onEnter: () => {
            const ptl = gsap.timeline({ defaults: { ease: 'power4.out' } });
            if (titleChars) {
              ptl.to(titleChars, { yPercent: 0, duration: 1, stagger: 0.04 }, 0);
            } else if (title) {
              ptl.to(title, { autoAlpha: 1, y: 0, duration: 0.9 }, 0);
            }
            ptl.to(items, { autoAlpha: 1, y: 0, duration: 0.85, stagger: 0.08 }, 0.15);
            if (visual) ptl.to(visual, { autoAlpha: 1, scale: 1, duration: 1.1 }, 0.2);
          }
        });
      });

      // Stacked sheets: the covered panel recedes as the next slides over
      mm.add('(min-width: 721px)', () => {
        panels.forEach((panel, i) => {
          const next = panels[i + 1];
          if (!next) return;
          gsap.to(panel.querySelector('.panel-inner'), {
            scale: 0.92,
            autoAlpha: 0.3,
            ease: 'none',
            scrollTrigger: {
              trigger: next,
              start: 'top bottom',
              end: 'top top',
              scrub: true
            }
          });
        });
      });

      // ── 03 + 04 Ledger rows ────────────────────────────
      const rows = gsap.utils.toArray('.ledger-row, .record-row');
      if (rows.length) {
        gsap.set(rows, { autoAlpha: 0, y: 44 });
        ScrollTrigger.batch(rows, {
          start: 'top 90%',
          onEnter: (els) => gsap.to(els, {
            autoAlpha: 1, y: 0, duration: 0.85, stagger: 0.07, ease: 'power4.out', overwrite: true
          })
        });
      }

      // ── Signature band scrub ───────────────────────────
      const nameTrack = document.querySelector('.name-track');
      if (nameTrack) {
        gsap.fromTo(nameTrack, { xPercent: 0 }, {
          xPercent: -14,
          ease: 'none',
          scrollTrigger: {
            trigger: '.name-marquee',
            start: 'top bottom',
            end: 'bottom top',
            scrub: 1
          }
        });
      }

      // ── 05 Contact ─────────────────────────────────────
      const contactTitle = document.querySelector('.contact-title');
      if (contactTitle && typeof SplitText !== 'undefined') {
        const split = new SplitText(contactTitle, { type: 'lines', mask: 'lines' });
        gsap.set(split.lines, { yPercent: 115 });
        ScrollTrigger.create({
          trigger: contactTitle,
          start: 'top 85%',
          once: true,
          onEnter: () => gsap.to(split.lines, {
            yPercent: 0, duration: 1.1, stagger: 0.12, ease: 'power4.out'
          })
        });
      }

      const contactBits = document.querySelectorAll('.contact-mail, .contact-socials, .site-foot');
      if (contactBits.length) {
        gsap.set(contactBits, { autoAlpha: 0, y: 30 });
        ScrollTrigger.batch(contactBits, {
          start: 'top 92%',
          onEnter: (els) => gsap.to(els, {
            autoAlpha: 1, y: 0, duration: 0.8, stagger: 0.1, ease: 'power4.out', overwrite: true
          })
        });
      }

      // ── Magnetic pull on key targets (fine pointers) ───
      mm.add('(hover: hover) and (pointer: fine)', () => {
        document.querySelectorAll('.rbtn, .contact-mail, .brand-monogram').forEach((el) => {
          const setX = gsap.quickTo(el, 'x', { duration: 0.4, ease: 'power3.out' });
          const setY = gsap.quickTo(el, 'y', { duration: 0.4, ease: 'power3.out' });
          el.addEventListener('mousemove', (e) => {
            const r = el.getBoundingClientRect();
            setX((e.clientX - r.left - r.width / 2) * 0.25);
            setY((e.clientY - r.top - r.height / 2) * 0.25);
          });
          el.addEventListener('mouseleave', () => {
            gsap.to(el, { x: 0, y: 0, duration: 0.6, ease: 'power4.out' });
          });
        });
      });

      // ── Scroll-velocity lean on ledger rows ────────────
      const skewTargets = gsap.utils.toArray('.ledger-row, .record-row');
      if (skewTargets.length) {
        const proxy = { skew: 0 };
        const skewSetter = gsap.quickSetter(skewTargets, 'skewY', 'deg');
        const clampSkew = gsap.utils.clamp(-1.1, 1.1);
        ScrollTrigger.create({
          onUpdate: (self) => {
            const skew = clampSkew(self.getVelocity() / -600);
            if (Math.abs(skew) > Math.abs(proxy.skew)) {
              proxy.skew = skew;
              gsap.to(proxy, {
                skew: 0,
                duration: 0.9,
                ease: 'power3',
                overwrite: true,
                onUpdate: () => skewSetter(proxy.skew)
              });
            }
          }
        });
      }

      // Normalize refresh order across everything created above
      ScrollTrigger.sort();
      ScrollTrigger.refresh();
    };

    const fontsReady = (document.fonts && document.fonts.ready)
      ? document.fonts.ready
      : Promise.resolve();
    Promise.all([fontsReady, runIntro()]).then(initMotion);
  }
})();
