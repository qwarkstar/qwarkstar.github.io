// ──────────────────────────────────────────
// TrashScan subsite interactions
// ──────────────────────────────────────────

(function () {
  'use strict';

  // ── Hero particle network (canvas 2D, ambient) ──
  function initParticleNetwork(container, opts) {
    if (!container) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const cfg = Object.assign({
      color: '110, 231, 183', density: 35, maxDist: 130, speed: 0.25
    }, opts || {});
    const canvas = document.createElement('canvas');
    canvas.style.cssText = 'position:absolute;inset:0;width:100%;height:100%;pointer-events:none;z-index:0;';
    container.style.position = container.style.position || 'relative';
    container.prepend(canvas);
    const ctx = canvas.getContext('2d');
    let w = 0, h = 0, dpr = 1, particles = [], mouseX = -9999, mouseY = -9999;
    function resize() {
      dpr = Math.min(2, window.devicePixelRatio || 1);
      const rect = container.getBoundingClientRect();
      w = rect.width; h = rect.height;
      canvas.width = w * dpr; canvas.height = h * dpr;
      ctx.setTransform(1, 0, 0, 1, 0, 0); ctx.scale(dpr, dpr);
      const N = Math.max(20, Math.min(80, Math.floor((w * cfg.density) / 1000)));
      particles = [];
      for (let i = 0; i < N; i++) particles.push({
        x: Math.random() * w, y: Math.random() * h,
        vx: (Math.random() - 0.5) * cfg.speed, vy: (Math.random() - 0.5) * cfg.speed,
        r: Math.random() * 1.4 + 0.4
      });
    }
    resize(); window.addEventListener('resize', resize);
    container.addEventListener('mousemove', (e) => {
      const r = container.getBoundingClientRect();
      mouseX = e.clientX - r.left; mouseY = e.clientY - r.top;
    });
    container.addEventListener('mouseleave', () => { mouseX = -9999; mouseY = -9999; });
    function draw() {
      ctx.clearRect(0, 0, w, h);
      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];
        const mdx = p.x - mouseX, mdy = p.y - mouseY;
        const md = Math.sqrt(mdx * mdx + mdy * mdy);
        if (md < 90 && md > 0) { p.vx += (mdx / md) * 0.04; p.vy += (mdy / md) * 0.04; }
        p.vx *= 0.985; p.vy *= 0.985;
        if (Math.abs(p.vx) < 0.05) p.vx += (Math.random() - 0.5) * 0.02;
        if (Math.abs(p.vy) < 0.05) p.vy += (Math.random() - 0.5) * 0.02;
        p.x += p.vx; p.y += p.vy;
        if (p.x < 0) { p.x = 0; p.vx *= -1; } if (p.x > w) { p.x = w; p.vx *= -1; }
        if (p.y < 0) { p.y = 0; p.vy *= -1; } if (p.y > h) { p.y = h; p.vy *= -1; }
        ctx.fillStyle = `rgba(${cfg.color}, 0.55)`;
        ctx.beginPath(); ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2); ctx.fill();
      }
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const a = particles[i], b = particles[j];
          const dx = a.x - b.x, dy = a.y - b.y, d = Math.sqrt(dx * dx + dy * dy);
          if (d < cfg.maxDist) {
            ctx.strokeStyle = `rgba(${cfg.color}, ${0.18 * (1 - d / cfg.maxDist)})`;
            ctx.lineWidth = 0.6;
            ctx.beginPath(); ctx.moveTo(a.x, a.y); ctx.lineTo(b.x, b.y); ctx.stroke();
          }
        }
      }
      requestAnimationFrame(draw);
    }
    draw();
  }
  initParticleNetwork(document.querySelector('.hero'), { color: '110, 231, 183' });

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
      gsap.set(present.filter(s => s !== '.hero-title' && s !== '.hero-diagram'), { y: 30 });

      const tl = gsap.timeline({ delay: 0.15, defaults: { ease: 'power3.out', duration: 0.9 } });
      tl.to('.badge', { autoAlpha: 1, y: 0, duration: 0.6 });

      const heroTitle = document.querySelector('.hero-title');
      if (heroTitle && typeof SplitText !== 'undefined') {
        heroTitle.style.perspective = '800px';
        const split = new SplitText(heroTitle, { type: 'words', mask: 'words', wordsClass: 'hero-word' });
        gsap.set(heroTitle, { autoAlpha: 1 });
        gsap.set(split.words, { yPercent: 110, rotateX: -80, transformOrigin: '50% 100% -20px' });
        tl.to(split.words, {
          yPercent: 0,
          rotateX: 0,
          duration: 1.1,
          ease: 'power3.out',
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

      // Diagram card flips into view from -45° rotateY with elastic
      const heroDiagram = document.querySelector('.hero-diagram');
      if (heroDiagram) {
        heroDiagram.style.perspective = '1200px';
        gsap.set(heroDiagram, { autoAlpha: 0, rotateY: -55, scale: 0.85, transformOrigin: '50% 50%' });
        tl.to(heroDiagram, {
          autoAlpha: 1,
          rotateY: 0,
          scale: 1,
          duration: 1.4,
          ease: 'elastic.out(1, 0.6)'
        }, '-=0.8');
      }
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

    // Bolder 3D card tilt + Z-pop on hover
    mm.add('(hover: hover) and (pointer: fine)', () => {
      const tiltCards = document.querySelectorAll('.overview-block, .pipe-step, .tech, .challenge, .member, .firmware-code, .report-cta');
      tiltCards.forEach(card => {
        const setRX = gsap.quickTo(card, 'rotateX', { duration: 0.4, ease: 'power2.out' });
        const setRY = gsap.quickTo(card, 'rotateY', { duration: 0.4, ease: 'power2.out' });
        card.style.transformPerspective = '900px';
        card.style.transformStyle = 'preserve-3d';
        card.addEventListener('mouseenter', () => {
          gsap.to(card, { z: 30, duration: 0.4, ease: 'power2.out' });
        });
        card.addEventListener('mousemove', (e) => {
          const rect = card.getBoundingClientRect();
          const x = (e.clientX - rect.left) / rect.width - 0.5;
          const y = (e.clientY - rect.top) / rect.height - 0.5;
          setRY(x * 8);
          setRX(-y * 8);
        });
        card.addEventListener('mouseleave', () => {
          gsap.to(card, { rotateX: 0, rotateY: 0, z: 0, duration: 0.7, ease: 'power3.out' });
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
