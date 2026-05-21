/* ══════════════════════════════════════════
   MÉTODO SAD — Script Cósmico Neon
   Canvas cosmos + partículas + interações
   ══════════════════════════════════════════ */

/* ── Cosmos Canvas (fundo estrelado com neons) ── */
(function () {
  const canvas = document.getElementById('cosmos-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  if (!ctx) return;

  let stars = [];
  const STAR_COUNT = 250;

  function resize() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    buildStars();
  }

  function buildStars() {
    stars = [];
    for (let i = 0; i < STAR_COUNT; i++) {
      stars.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        r: Math.random() * 2.5 + 0.5,
        alpha: Math.random() * 0.6 + 0.4,
        speed: Math.random() * 0.5 + 0.08,
        phase: Math.random() * Math.PI * 2,
        cyan: Math.random() < 0.35,
        lilac: Math.random() < 0.25,
        pink: Math.random() < 0.15,
        white: Math.random() < 0.25,
      });
    }
  }

  function drawStars(t) {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    stars.forEach(s => {
      const pulse = Math.sin(t * s.speed + s.phase) * 0.3;
      const alpha = Math.max(0.4, s.alpha + pulse);
      ctx.beginPath();
      ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
      
      if (s.cyan) {
        ctx.fillStyle = `rgba(0, 255, 255, ${alpha})`;
        ctx.shadowColor = 'rgba(0, 255, 255, 0.8)';
        ctx.shadowBlur = s.r * 3;
      } else if (s.lilac) {
        ctx.fillStyle = `rgba(179, 136, 255, ${alpha})`;
        ctx.shadowColor = 'rgba(179, 136, 255, 0.8)';
        ctx.shadowBlur = s.r * 3;
      } else if (s.pink) {
        ctx.fillStyle = `rgba(224, 64, 251, ${alpha})`;
        ctx.shadowColor = 'rgba(224, 64, 251, 0.8)';
        ctx.shadowBlur = s.r * 3;
      } else if (s.white) {
        ctx.fillStyle = `rgba(255, 255, 255, ${alpha})`;
        ctx.shadowColor = 'rgba(255, 255, 255, 0.6)';
        ctx.shadowBlur = s.r * 2;
      }
      ctx.fill();
      ctx.shadowBlur = 0;
    });
  }

  function drawConstellations() {
    const DIST = 100;
    ctx.lineWidth = 0.3;
    for (let i = 0; i < stars.length; i++) {
      for (let j = i + 1; j < stars.length; j++) {
        const dx = stars[i].x - stars[j].x;
        const dy = stars[i].y - stars[j].y;
        const d = Math.sqrt(dx * dx + dy * dy);
        if (d < DIST) {
          const alpha = (1 - d / DIST) * 0.08;
          ctx.strokeStyle = `rgba(0, 255, 255, ${alpha})`;
          ctx.beginPath();
          ctx.moveTo(stars[i].x, stars[i].y);
          ctx.lineTo(stars[j].x, stars[j].y);
          ctx.stroke();
        }
      }
    }
  }

  let raf;
  function loop(t) {
    const sec = t / 1000;
    drawStars(sec);
    drawConstellations();
    raf = requestAnimationFrame(loop);
  }

  resize();
  window.addEventListener('resize', resize, { passive: true });
  raf = requestAnimationFrame(loop);
})();


/* ── CTA Particles Canvas ── */
(function () {
  const canvas = document.getElementById('cta-particles');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  if (!ctx) return;
  let particles = [];
  const N = 80;

  function resize() {
    const rect = canvas.getBoundingClientRect();
    if (rect.width === 0 || rect.height === 0) return;
    canvas.width = rect.width;
    canvas.height = rect.height;
    buildParticles();
  }

  function buildParticles() {
    particles = [];
    for (let i = 0; i < N; i++) {
      particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        r: Math.random() * 2.5 + 0.5,
        vx: (Math.random() - 0.5) * 0.5,
        vy: (Math.random() - 0.5) * 0.5,
        alpha: Math.random() * 0.5 + 0.2,
        cyan: Math.random() < 0.4,
        lilac: Math.random() < 0.3,
        pink: Math.random() < 0.2,
        white: Math.random() < 0.1,
      });
    }
  }

  let rafId;
  function loop() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    particles.forEach(p => {
      p.x += p.vx;
      p.y += p.vy;
      if (p.x < 0) p.x = canvas.width;
      if (p.x > canvas.width) p.x = 0;
      if (p.y < 0) p.y = canvas.height;
      if (p.y > canvas.height) p.y = 0;
      
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      
      if (p.cyan) {
        ctx.fillStyle = `rgba(0, 255, 255, ${p.alpha})`;
        ctx.shadowColor = 'rgba(0, 255, 255, 0.8)';
      } else if (p.lilac) {
        ctx.fillStyle = `rgba(179, 136, 255, ${p.alpha})`;
        ctx.shadowColor = 'rgba(179, 136, 255, 0.8)';
      } else if (p.pink) {
        ctx.fillStyle = `rgba(224, 64, 251, ${p.alpha})`;
        ctx.shadowColor = 'rgba(224, 64, 251, 0.8)';
      } else if (p.white) {
        ctx.fillStyle = `rgba(255, 255, 255, ${p.alpha})`;
        ctx.shadowColor = 'rgba(255, 255, 255, 0.6)';
      }
      ctx.shadowBlur = p.r * 4;
      ctx.fill();
      ctx.shadowBlur = 0;
    });
    rafId = requestAnimationFrame(loop);
  }

  const section = document.getElementById('inscricao');
  if (section) {
    const ro = new ResizeObserver(resize);
    ro.observe(section);
  }
  
  setTimeout(() => {
    resize();
    if (particles.length > 0) {
      loop();
    }
  }, 100);
})();


/* ── Navbar scroll effect ── */
(function () {
  const nav = document.getElementById('navbar');
  window.addEventListener('scroll', () => {
    nav.classList.toggle('scrolled', window.scrollY > 50);
  }, { passive: true });
})();


/* ── Reveal on scroll (Intersection Observer) ── */
(function () {
  const els = document.querySelectorAll('.reveal');
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        setTimeout(() => {
          entry.target.classList.add('visible');
        }, (entry.target.dataset.delay || 0));
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1, rootMargin: '0px 0px -30px 0px' });

  document.querySelectorAll('.bonus-card, .transform-card').forEach((el, i) => {
    el.dataset.delay = (i % 3) * 120;
  });

  els.forEach(el => observer.observe(el));
})();


/* ── Smooth scroll ── */
document.querySelectorAll('a[href^="#"]').forEach(a => {
  a.addEventListener('click', e => {
    const target = document.querySelector(a.getAttribute('href'));
    if (!target) return;
    e.preventDefault();
    target.scrollIntoView({ behavior: 'smooth' });
  });
});


/* ── Frequency Meter hover tooltip ── */
(function () {
  const bars = document.querySelectorAll('.bar');
  bars.forEach(bar => {
    bar.title = `${bar.dataset.level} — ${bar.dataset.hz}`;
  });
})();


/* ── Year ── */
const yearEl = document.getElementById('year');
if (yearEl) yearEl.textContent = new Date().getFullYear();


/* ── CTA button ripple effect ── */
(function () {
  const btn = document.getElementById('main-cta');
  if (!btn) return;
  btn.addEventListener('click', function (e) {
    const circle = document.createElement('span');
    const diameter = Math.max(btn.offsetWidth, btn.offsetHeight);
    const radius = diameter / 2;
    circle.style.cssText = `
      position:absolute;
      width:${diameter}px;height:${diameter}px;
      left:${e.clientX - btn.getBoundingClientRect().left - radius}px;
      top:${e.clientY - btn.getBoundingClientRect().top - radius}px;
      background:rgba(0,255,255,0.4);
      border-radius:50%;
      transform:scale(0);
      animation:ripple 0.6s linear;
      pointer-events:none;
    `;
    btn.style.position = 'relative';
    btn.style.overflow = 'hidden';
    btn.appendChild(circle);

    const style = document.createElement('style');
    style.textContent = '@keyframes ripple{to{transform:scale(4);opacity:0}}';
    document.head.appendChild(style);

    circle.addEventListener('animationend', () => circle.remove());
  });
})();


/* ── FAQ Accordion ── */
(function () {
  const faqItems = document.querySelectorAll('.faq-item');
  faqItems.forEach(item => {
    const question = item.querySelector('.faq-question');
    question.addEventListener('click', () => {
      const isActive = item.classList.contains('active');
      faqItems.forEach(i => i.classList.remove('active'));
      if (!isActive) {
        item.classList.add('active');
      }
    });
  });
})();