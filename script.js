/**
 * SITHARTN VN — PREMIUM CINEMATIC PORTFOLIO
 * script.js — Animations, interactions, particles
 */

'use strict';

/* ============================================================
   1. CURSOR EFFECT
   ============================================================ */
(function initCursor() {
  const cursor = document.getElementById('cursor');
  const trail  = document.getElementById('cursorTrail');
  if (!cursor || !trail) return;

  let mx = -100, my = -100;
  let tx = -100, ty = -100;
  let raf;

  // Main cursor follows mouse instantly
  document.addEventListener('mousemove', (e) => {
    mx = e.clientX;
    my = e.clientY;
    cursor.style.left = mx + 'px';
    cursor.style.top  = my + 'px';
  });

  // Trail lags behind with lerp
  function lerp(a, b, n) { return a + (b - a) * n; }

  function animateTrail() {
    tx = lerp(tx, mx, 0.14);
    ty = lerp(ty, my, 0.14);
    trail.style.left = tx + 'px';
    trail.style.top  = ty + 'px';
    raf = requestAnimationFrame(animateTrail);
  }
  animateTrail();

  // Hover effect on interactive elements
  const interactiveSelector = 'a, button, [tabindex], .work-card, .about-card, .filter-btn, .contact-item';
  document.querySelectorAll(interactiveSelector).forEach(el => {
    el.addEventListener('mouseenter', () => document.body.classList.add('cursor-hover'));
    el.addEventListener('mouseleave', () => document.body.classList.remove('cursor-hover'));
  });

  // Hide cursor when leaving window
  document.addEventListener('mouseleave', () => {
    cursor.style.opacity = '0';
    trail.style.opacity  = '0';
  });
  document.addEventListener('mouseenter', () => {
    cursor.style.opacity = '1';
    trail.style.opacity  = '1';
  });
})();


/* ============================================================
   2. PARTICLE CANVAS
   ============================================================ */
(function initParticles() {
  const canvas  = document.getElementById('particleCanvas');
  if (!canvas) return;
  const ctx     = canvas.getContext('2d');
  let w, h, particles;
  const PARTICLE_COUNT = 60;

  function resize() {
    w = canvas.width  = canvas.offsetWidth;
    h = canvas.height = canvas.offsetHeight;
  }

  class Particle {
    constructor() { this.reset(true); }

    reset(initial) {
      this.x    = Math.random() * w;
      this.y    = initial ? Math.random() * h : h + 10;
      this.size = Math.random() * 1.5 + 0.3;
      this.speedY = -(Math.random() * 0.4 + 0.1);
      this.speedX = (Math.random() - 0.5) * 0.2;
      this.opacity = 0;
      this.maxOpacity = Math.random() * 0.5 + 0.1;
      this.fadeSpeed  = Math.random() * 0.003 + 0.001;
      this.fading = false;
    }

    update() {
      this.y += this.speedY;
      this.x += this.speedX;

      if (!this.fading && this.opacity < this.maxOpacity) {
        this.opacity += this.fadeSpeed;
      } else if (!this.fading && this.y < h * 0.3) {
        this.fading = true;
      }

      if (this.fading) {
        this.opacity -= this.fadeSpeed * 1.5;
      }

      if (this.opacity <= 0 && this.fading) {
        this.reset(false);
      }
    }

    draw() {
      ctx.save();
      ctx.globalAlpha = Math.max(0, this.opacity);
      ctx.fillStyle = `rgba(139, 92, 246, 1)`;
      ctx.shadowBlur = 6;
      ctx.shadowColor = 'rgba(139, 92, 246, 0.8)';
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    }
  }

  function init() {
    resize();
    particles = Array.from({ length: PARTICLE_COUNT }, () => new Particle());
    loop();
  }

  function loop() {
    ctx.clearRect(0, 0, w, h);
    particles.forEach(p => { p.update(); p.draw(); });
    requestAnimationFrame(loop);
  }

  window.addEventListener('resize', () => {
    resize();
    particles.forEach(p => p.reset(true));
  });

  init();
})();


/* ============================================================
   3. NAVBAR — scroll & mobile toggle
   ============================================================ */
(function initNavbar() {
  const navbar    = document.getElementById('navbar');
  const hamburger = document.getElementById('hamburger');
  const navLinks  = document.getElementById('navLinks');

  // Scroll → add .scrolled
  const onScroll = () => {
    if (window.scrollY > 40) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
  };
  window.addEventListener('scroll', onScroll, { passive: true });

  // Hamburger toggle
  hamburger.addEventListener('click', () => {
    const isOpen = hamburger.classList.toggle('open');
    hamburger.setAttribute('aria-expanded', isOpen);
    navLinks.classList.toggle('open', isOpen);

    // Prevent body scroll when menu open
    document.body.style.overflow = isOpen ? 'hidden' : '';
  });

  // Close on nav link click
  navLinks.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', () => {
      hamburger.classList.remove('open');
      hamburger.setAttribute('aria-expanded', 'false');
      navLinks.classList.remove('open');
      document.body.style.overflow = '';
    });
  });

  // Close on overlay click (outside menu)
  document.addEventListener('click', (e) => {
    if (navLinks.classList.contains('open') &&
        !navLinks.contains(e.target) &&
        !hamburger.contains(e.target)) {
      hamburger.classList.remove('open');
      hamburger.setAttribute('aria-expanded', 'false');
      navLinks.classList.remove('open');
      document.body.style.overflow = '';
    }
  });
})();


/* ============================================================
   4. HERO PARALLAX
   ============================================================ */
(function initParallax() {
  const heroVisual = document.getElementById('heroVisual');
  if (!heroVisual) return;

  let lastX = 0, lastY = 0;

  document.addEventListener('mousemove', (e) => {
    const cx = window.innerWidth  / 2;
    const cy = window.innerHeight / 2;
    const dx = (e.clientX - cx) / cx;  // -1 to 1
    const dy = (e.clientY - cy) / cy;

    // Target values
    lastX = dx * 12;
    lastY = dy * 8;
  });

  // Smooth parallax with rAF
  let currentX = 0, currentY = 0;
  function animateParallax() {
    currentX += (lastX - currentX) * 0.05;
    currentY += (lastY - currentY) * 0.05;
    heroVisual.style.transform = `translate(${currentX}px, ${currentY}px)`;
    requestAnimationFrame(animateParallax);
  }
  animateParallax();
})();


/* ============================================================
   5. COUNTER ANIMATION
   ============================================================ */
(function initCounters() {
  const counters = document.querySelectorAll('[data-count]');
  let counted = false;

  function animateCounter(el) {
    const target = parseInt(el.getAttribute('data-count'), 10);
    const duration = 1800;
    const start = performance.now();

    function step(now) {
      const elapsed = now - start;
      const progress = Math.min(elapsed / duration, 1);
      // Ease out cubic
      const eased = 1 - Math.pow(1 - progress, 3);
      el.textContent = Math.floor(eased * target);
      if (progress < 1) requestAnimationFrame(step);
      else el.textContent = target;
    }
    requestAnimationFrame(step);
  }

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting && !counted) {
        counted = true;
        counters.forEach(c => animateCounter(c));
      }
    });
  }, { threshold: 0.5 });

  if (counters.length) {
    observer.observe(counters[0].closest('.hero-stats') || counters[0]);
  }
})();


/* ============================================================
   6. SCROLL REVEAL
   ============================================================ */
(function initScrollReveal() {
  const revealEls = document.querySelectorAll(
    '.reveal-up, .reveal-left, .reveal-right'
  );
  const sectionHeaders = document.querySelectorAll('.section-header');

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry, i) => {
      if (entry.isIntersecting) {
        // Slight delay per element if siblings
        const delay = entry.target.dataset.delay || 0;
        setTimeout(() => {
          entry.target.classList.add('visible');
        }, delay);
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -60px 0px' });

  revealEls.forEach(el => observer.observe(el));
  sectionHeaders.forEach(el => {
    el.classList.add('reveal-up');
    observer.observe(el);
  });
})();


/* ============================================================
   7. WORKS GRID — stagger reveal + filter
   ============================================================ */
(function initWorks() {
  const cards = document.querySelectorAll('.work-card');
  const filterBtns = document.querySelectorAll('.filter-btn');

  // Stagger reveal on scroll
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        const cards = entry.target.querySelectorAll
          ? [entry.target]
          : [];
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.08, rootMargin: '0px 0px -40px 0px' });

  cards.forEach((card, i) => {
    card.style.transitionDelay = `${i * 80}ms`;
    observer.observe(card);
  });

  // Filter functionality
  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const filter = btn.getAttribute('data-filter');

      // Update active button
      filterBtns.forEach(b => {
        b.classList.remove('active');
        b.setAttribute('aria-selected', 'false');
      });
      btn.classList.add('active');
      btn.setAttribute('aria-selected', 'true');

      // Filter cards
      cards.forEach((card, i) => {
        const cat = card.getAttribute('data-cat');
        const show = filter === 'all' || cat === filter;

        if (show) {
          card.classList.remove('filtered-out');
          card.style.transitionDelay = `${i * 60}ms`;
        } else {
          card.classList.add('filtered-out');
          card.style.transitionDelay = '0ms';
        }
      });
    });
  });
})();


/* ============================================================
   8. CONTACT FORM — validation + WhatsApp redirect
   ============================================================ */
(function initForm() {
  const form    = document.getElementById('contactForm');
  if (!form) return;

  const success = document.getElementById('formSuccess');

  const fields = {
    name:    { el: document.getElementById('name'),    err: document.getElementById('nameError') },
    email:   { el: document.getElementById('email'),   err: document.getElementById('emailError') },
    project: { el: document.getElementById('project'), err: document.getElementById('projectError') },
    message: { el: document.getElementById('message'), err: document.getElementById('messageError') },
  };

  function showError(field, msg) {
    field.el.classList.add('error');
    field.err.textContent = msg;
  }
  function clearError(field) {
    field.el.classList.remove('error');
    field.err.textContent = '';
  }

  // Live validation on blur
  Object.values(fields).forEach(f => {
    f.el.addEventListener('input', () => clearError(f));
    f.el.addEventListener('blur',  () => validateField(f));
  });

  function validateField(field) {
    const val = field.el.value.trim();
    if (!val) {
      showError(field, 'This field is required.');
      return false;
    }
    if (field.el.type === 'email') {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(val)) {
        showError(field, 'Please enter a valid email address.');
        return false;
      }
    }
    clearError(field);
    return true;
  }

  form.addEventListener('submit', (e) => {
    e.preventDefault();

    // Validate all fields
    let valid = true;
    Object.values(fields).forEach(f => {
      if (!validateField(f)) valid = false;
    });

    if (!valid) return;

    const name    = fields.name.el.value.trim();
    const email   = fields.email.el.value.trim();
    const project = fields.project.el.value;
    const message = fields.message.el.value.trim();

    // Show success state
    success.classList.add('show');

    // Disable form
    form.querySelectorAll('input, select, textarea, button').forEach(el => {
      el.disabled = true;
    });

    // Craft WhatsApp message
    const wa = encodeURIComponent(
      `Hi Sithartn VN, I saw your portfolio and I'd like to discuss a project.\n\nName: ${name}\nEmail: ${email}\nProject Type: ${project}\nMessage: ${message}`
    );

    // Redirect to WhatsApp after short delay
    setTimeout(() => {
      window.open(`https://wa.me/918300183837?text=${wa}`, '_blank', 'noopener,noreferrer');

      // Reset form after sending
      setTimeout(() => {
        form.reset();
        success.classList.remove('show');
        form.querySelectorAll('input, select, textarea, button').forEach(el => {
          el.disabled = false;
        });
      }, 3000);
    }, 1200);
  });
})();


/* ============================================================
   9. SMOOTH SCROLL — polyfill for older browsers
   ============================================================ */
(function initSmoothScroll() {
  document.querySelectorAll('a[href^="#"]').forEach(link => {
    link.addEventListener('click', (e) => {
      const target = document.querySelector(link.getAttribute('href'));
      if (!target) return;
      e.preventDefault();
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
  });
})();


/* ============================================================
   10. WORK CARD TILT on hover
   ============================================================ */
(function initCardTilt() {
  const cards = document.querySelectorAll('.work-card');

  cards.forEach(card => {
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const cx = rect.left + rect.width / 2;
      const cy = rect.top  + rect.height / 2;
      const dx = (e.clientX - cx) / (rect.width / 2);
      const dy = (e.clientY - cy) / (rect.height / 2);
      card.style.transform = `translateY(-6px) rotateX(${-dy * 4}deg) rotateY(${dx * 4}deg)`;
    });
    card.addEventListener('mouseleave', () => {
      card.style.transform = '';
    });
  });
})();


/* ============================================================
   11. ABOUT CARD TILT
   ============================================================ */
(function initAboutCardTilt() {
  document.querySelectorAll('.about-card').forEach(card => {
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const dx = (e.clientX - rect.left - rect.width / 2) / (rect.width / 2);
      const dy = (e.clientY - rect.top - rect.height / 2) / (rect.height / 2);
      card.style.transform = `translateY(-4px) rotateX(${-dy * 6}deg) rotateY(${dx * 6}deg)`;
    });
    card.addEventListener('mouseleave', () => {
      card.style.transform = '';
      card.style.transition = 'transform 0.5s ease';
    });
  });
})();


/* ============================================================
   12. ACTIVE NAV LINK on scroll (section spy)
   ============================================================ */
(function initSectionSpy() {
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav-link');

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const id = entry.target.id;
        navLinks.forEach(link => {
          const href = link.getAttribute('href');
          if (href === `#${id}`) {
            link.style.color = 'var(--white)';
          } else {
            link.style.color = '';
          }
        });
      }
    });
  }, { threshold: 0.4 });

  sections.forEach(s => observer.observe(s));
})();


/* ============================================================
   13. PAGE LOAD — reveal body
   ============================================================ */
window.addEventListener('load', () => {
  document.body.style.visibility = 'visible';
});
