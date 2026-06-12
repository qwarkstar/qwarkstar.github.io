// ──────────────────────────────────────────
// R·iving site interactions
// ──────────────────────────────────────────

(function () {
  'use strict';

  // ── Nav: glass effect on scroll ──────────
  const nav = document.getElementById('nav');
  const SCROLL_THRESHOLD = 24;

  function handleNavScroll() {
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

    // Close mobile menu when a link is clicked
    navLinks.querySelectorAll('a').forEach((link) => {
      link.addEventListener('click', () => {
        navToggle.classList.remove('open');
        navLinks.classList.remove('open');
      });
    });
  }

  // ── Smooth scroll for same-page anchor links ──
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

  // ── Subtle parallax on phone mockup ──────
  const phone = document.querySelector('.phone');

  if (phone && window.matchMedia('(min-width: 980px)').matches) {
    let rafId = null;
    let currentX = 0;
    let currentY = 0;
    let targetX = 0;
    let targetY = 0;

    function updateParallax() {
      currentX += (targetX - currentX) * 0.08;
      currentY += (targetY - currentY) * 0.08;
      phone.style.setProperty('--tilt-x', `${currentY}deg`);
      phone.style.setProperty('--tilt-y', `${currentX}deg`);
      phone.style.transform = `rotate(-2deg) rotateX(${currentY}deg) rotateY(${currentX}deg)`;

      if (Math.abs(currentX - targetX) > 0.05 || Math.abs(currentY - targetY) > 0.05) {
        rafId = requestAnimationFrame(updateParallax);
      } else {
        rafId = null;
      }
    }

    const phoneWrap = document.querySelector('.phone-wrap');
    if (phoneWrap) {
      phoneWrap.addEventListener('mousemove', (e) => {
        const rect = phoneWrap.getBoundingClientRect();
        const x = (e.clientX - rect.left) / rect.width - 0.5;
        const y = (e.clientY - rect.top) / rect.height - 0.5;
        targetX = x * 8;
        targetY = -y * 8;
        if (!rafId) rafId = requestAnimationFrame(updateParallax);
      });

      phoneWrap.addEventListener('mouseleave', () => {
        targetX = 0;
        targetY = 0;
        if (!rafId) rafId = requestAnimationFrame(updateParallax);
      });
    }
  }

  // ── Close FAQ items when another is opened ──
  const faqItems = document.querySelectorAll('.faq-item, .faq-doc details');

  faqItems.forEach((item) => {
    item.addEventListener('toggle', () => {
      if (item.open) {
        faqItems.forEach((other) => {
          if (other !== item && other.open) {
            other.open = false;
          }
        });
      }
    });
  });

  // ── Active nav link highlight based on scroll ──
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

  // ── Log a friendly hello ─────────────────
  if (console && console.log) {
    console.log(
      '%cR·iving',
      'color: #4f93ff; font-size: 28px; font-weight: 800; letter-spacing: -0.03em;'
    );
    console.log(
      '%cNever miss your stop again. %c→ julian.rzezak@gmail.com',
      'color: #94a3b8; font-size: 13px;',
      'color: #64748b; font-size: 13px;'
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

    // Run motion setup once webfonts are in, so SplitText measures real glyphs
    const initMotion = () => {

    // Hero entrance
    const heroEls = ['.hero-title', '.badge', '.hero-sub', '.hero-cta', '.hero-stats', '.phone-wrap'];
    const present = heroEls.filter(sel => document.querySelector(sel));
    if (present.length) {
      gsap.set(present, { autoAlpha: 0 });
      gsap.set(present.filter(s => s !== '.hero-title' && s !== '.phone-wrap'), { y: 30 });

      const tl = gsap.timeline({ delay: 0.15, defaults: { ease: 'power3.out', duration: 0.9 } });
      tl.to('.badge', { autoAlpha: 1, y: 0, duration: 0.6 });

      const heroTitle = document.querySelector('.hero-title');
      if (heroTitle && typeof SplitText !== 'undefined') {
        heroTitle.style.perspective = '800px';
        const split = new SplitText(heroTitle, { type: 'words', mask: 'words', wordsClass: 'hero-word' });
        gsap.set(heroTitle, { autoAlpha: 1 });
        gsap.set(split.words, { yPercent: 110, rotationX: -80, transformOrigin: '50% 100% -20px' });
        tl.to(split.words, {
          yPercent: 0,
          rotationX: 0,
          duration: 1.1,
          ease: 'power4.out',
          stagger: 0.07
        }, '-=0.35');
      } else if (heroTitle) {
        tl.to('.hero-title', { autoAlpha: 1, y: 0, duration: 0.9 }, '-=0.35');
      }

      const restSeq = [
        { sel: '.hero-sub',   off: '-=0.6' },
        { sel: '.hero-cta',   off: '-=0.6' },
        { sel: '.hero-stats', off: '-=0.7' }
      ];
      restSeq.forEach(s => {
        if (document.querySelector(s.sel)) {
          tl.to(s.sel, { autoAlpha: 1, y: 0, duration: 0.9 }, s.off);
        }
      });

      // Phone mockup spins into view: rotationY -120 → 0 with scale + elastic ease
      const phoneWrap = document.querySelector('.phone-wrap');
      if (phoneWrap) {
        phoneWrap.style.perspective = '1200px';
        gsap.set(phoneWrap, { autoAlpha: 0, rotationY: -120, scale: 0.7, transformOrigin: '50% 50%' });
        tl.to(phoneWrap, {
          autoAlpha: 1,
          rotationY: 0,
          scale: 1,
          duration: 1.6,
          ease: 'elastic.out(1, 0.55)'
        }, '-=0.9');
      }
    }

    // Section h2 word-reveal on scroll
    if (typeof SplitText !== 'undefined') {
      document.querySelectorAll('.section-head h2, .trust-text h2, .cta h2').forEach(h2 => {
        const split = new SplitText(h2, { type: 'words', mask: 'words', wordsClass: 'section-word' });
        gsap.set(split.words, { yPercent: 110 });
        ScrollTrigger.create({
          trigger: h2,
          start: 'top 85%',
          once: true,
          onEnter: () => gsap.to(split.words, {
            yPercent: 0,
            duration: 0.8,
            ease: 'power4.out',
            stagger: 0.05
          })
        });
      });
    }

    // Reveal on scroll (cards, sections, articles)
    // .step is intentionally excluded — handled by the pinned #how timeline
    const revealSelectors = [
      '.section-head', '.feature', '.audience', '.faq-item',
      '.trust-text', '.trust-check', '.cta', '.article > h2',
      '.article > h3', '.article > p', '.article > ul',
      '.faq-doc details', '.contact-card'
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

    // Hero stat counters (numeric only — skips "Zero", "Unlimited", "100%" stays as percent)
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

    // Phone mockup parallax — drifts up and leans back as you scroll past the hero.
    // fromTo with immediateRender:false so the scrub never caches the entrance's
    // mid-flight scale as its starting point.
    const phoneWrap = document.querySelector('.phone-wrap');
    if (phoneWrap) {
      gsap.fromTo(phoneWrap,
        { y: 0, rotation: 0, scale: 1 },
        {
          y: -120,
          rotation: 4,
          scale: 0.96,
          ease: 'none',
          immediateRender: false,
          scrollTrigger: {
            trigger: '.hero',
            start: 'top top',
            end: 'bottom top',
            scrub: 1.2
          }
        }
      );
    }

    // Pinned "How it works" — steps activate one-by-one on scroll (desktop only;
    // the single-column mobile stack is taller than the viewport, so pinning it
    // would hide steps below the fold)
    const howSection = document.querySelector('#how');
    const howSteps = howSection ? gsap.utils.toArray(howSection.querySelectorAll('.step')) : [];
    if (howSteps.length) {
      const stepsTrack = howSection.querySelector('.steps-line-track');
      mm.add('(min-width: 769px)', () => {
        gsap.set(howSteps, { autoAlpha: 0.4, scale: 0.94, y: 0 });
        const stepsTl = gsap.timeline({
          scrollTrigger: {
            trigger: howSection,
            start: 'top top',
            end: '+=' + (howSteps.length * 140),
            pin: true,
            pinSpacing: true,
            scrub: 0.5
          }
        });
        howSteps.forEach((step, i) => {
          stepsTl.to(step, { autoAlpha: 1, scale: 1, duration: 1, ease: 'power2.out' }, i);
        });
        // The track between the stations draws itself as the steps activate
        if (stepsTrack) {
          gsap.set(stepsTrack, { scaleX: 0, transformOrigin: '0% 50%' });
          stepsTl.to(stepsTrack, { scaleX: 1, duration: howSteps.length, ease: 'none' }, 0);
        }
      });
      mm.add('(max-width: 768px)', () => {
        gsap.set(howSteps, { autoAlpha: 0, y: 36 });
        ScrollTrigger.batch(howSteps, {
          start: 'top 88%',
          onEnter: (els) => gsap.to(els, {
            autoAlpha: 1, y: 0, duration: 0.7, stagger: 0.1, ease: 'power4.out', overwrite: true
          })
        });
      });
    }

    // Route-marquee speed reactive to scroll velocity
    const marqueeTracks = document.querySelectorAll('.route-marquee-track');
    if (marqueeTracks.length) {
      marqueeTracks.forEach(track => {
        track.style.animation = 'none';
        track._marqueeTween = gsap.to(track, {
          xPercent: -50,
          duration: 60,
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

    // Live demo — the mock phone counts down, then the alarm fires on screen
    const mockDist = document.querySelector('.mock-card-active .mock-dist');
    const mockAlarm = document.querySelector('.mock-alarm');
    if (mockDist && mockAlarm) {
      const distState = { km: 1.4 };
      const renderDist = () => {
        mockDist.textContent = distState.km <= 0.15
          ? 'Arriving now'
          : distState.km.toFixed(1) + ' km away';
      };
      gsap.set(mockAlarm, { y: 36 });
      const demoTl = gsap.timeline({ repeat: -1, repeatDelay: 2.4, paused: true });
      demoTl
        .to(distState, { km: 0.1, duration: 3.4, ease: 'power1.in', onUpdate: renderDist })
        .to(mockAlarm, { autoAlpha: 1, y: 0, duration: 0.55, ease: 'back.out(1.7)' })
        .to('.radar-pin', {
          scale: 1.7,
          duration: 0.16,
          repeat: 7,
          yoyo: true,
          ease: 'power1.inOut'
        }, '<')
        .fromTo('.mock-alarm-bell', { rotation: -12 }, {
          rotation: 12,
          duration: 0.11,
          repeat: 11,
          yoyo: true,
          ease: 'power1.inOut',
          immediateRender: false
        }, '<')
        .to('.mock-alarm-bell', { rotation: 0, duration: 0.2 })
        .to(mockAlarm, { autoAlpha: 0, y: 30, duration: 0.4, ease: 'power2.in' }, '+=1.5');
      ScrollTrigger.create({
        trigger: '.phone-wrap',
        start: 'top bottom',
        end: 'bottom top',
        onToggle: (self) => (self.isActive ? demoTl.play() : demoTl.pause())
      });
    }

    // Re-order triggers by document position and recalc after setup
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
