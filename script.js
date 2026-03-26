/* ══════════════════════════════════════
   CÓDIGO DAS FREQUÊNCIAS — Script
   Canvas cosmos + partículas CTA + interações
   ══════════════════════════════════════ */

/* ── Cosmos Canvas (fundo estrelado) ── */
(function () {
  const canvas = document.getElementById('cosmos-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');

  let stars = [];
  const STAR_COUNT = 200;

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
        r: Math.random() * 1.4 + 0.2,
        alpha: Math.random() * 0.7 + 0.1,
        speed: Math.random() * 0.4 + 0.05,
        phase: Math.random() * Math.PI * 2,
        gold: Math.random() < 0.15,       // 15% são estrelas douradas
        purple: Math.random() < 0.1,      // 10% são violeta
      });
    }
  }

  function drawStars(t) {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    stars.forEach(s => {
      const pulse = Math.sin(t * s.speed + s.phase) * 0.35;
      const alpha = Math.max(0.05, s.alpha + pulse);
      ctx.beginPath();
      ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
      if (s.gold)        ctx.fillStyle = `rgba(201,168,76,${alpha})`;
      else if (s.purple) ctx.fillStyle = `rgba(123,94,167,${alpha})`;
      else               ctx.fillStyle = `rgba(240,237,232,${alpha})`;
      ctx.fill();
    });
  }

  // Linhas de conexão sutis entre estrelas próximas (efeito constelação)
  function drawConstellations() {
    const DIST = 80;
    ctx.lineWidth = 0.3;
    for (let i = 0; i < stars.length; i++) {
      for (let j = i + 1; j < stars.length; j++) {
        const dx = stars[i].x - stars[j].x;
        const dy = stars[i].y - stars[j].y;
        const d = Math.sqrt(dx * dx + dy * dy);
        if (d < DIST) {
          const alpha = (1 - d / DIST) * 0.08;
          ctx.strokeStyle = `rgba(201,168,76,${alpha})`;
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
  window.addEventListener('resize', resize);
  raf = requestAnimationFrame(loop);
})();


/* ── CTA Particles Canvas ── */
(function () {
  const canvas = document.getElementById('cta-particles');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  let particles = [];
  const N = 60;

  function resize() {
    canvas.width = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;
    buildParticles();
  }

  function buildParticles() {
    particles = [];
    for (let i = 0; i < N; i++) {
      particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        r: Math.random() * 2 + 0.5,
        vx: (Math.random() - 0.5) * 0.4,
        vy: (Math.random() - 0.5) * 0.4,
        alpha: Math.random() * 0.6 + 0.1,
        gold: Math.random() < 0.6,
      });
    }
  }

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
      ctx.fillStyle = p.gold
        ? `rgba(201,168,76,${p.alpha})`
        : `rgba(123,94,167,${p.alpha})`;
      ctx.fill();
    });
    requestAnimationFrame(loop);
  }

  // Observar quando a secão entra na viewport
  const section = document.getElementById('inscricao');
  const ro = new ResizeObserver(resize);
  ro.observe(section);
  requestAnimationFrame(loop);
})();


/* ── Navbar scroll effect ── */
(function () {
  const nav = document.getElementById('navbar');
  window.addEventListener('scroll', () => {
    nav.classList.toggle('scrolled', window.scrollY > 60);
  }, { passive: true });
})();


/* ── Reveal on scroll (Intersection Observer) ── */
(function () {
  const els = document.querySelectorAll('.reveal');
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry, index) => {
      if (entry.isIntersecting) {
        // Stagger pequeno para cards em grid
        setTimeout(() => {
          entry.target.classList.add('visible');
        }, (entry.target.dataset.delay || 0));
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -50px 0px' });

  // Adiciona delays escalonados para cards
  document.querySelectorAll('.bonus-card, .transform-card').forEach((el, i) => {
    el.dataset.delay = (i % 3) * 100;
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
      background:rgba(255,255,255,0.25);
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
