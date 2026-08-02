/* ============================================
   Sagar Joglekar - Site Interactivity
   ============================================ */

document.addEventListener('DOMContentLoaded', () => {

  // --- Sticky Nav Active Section Highlighting ---
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav-links a');

  const observerOpts = {
    rootMargin: '-20% 0px -60% 0px',
    threshold: 0
  };

  const sectionObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const id = entry.target.id;
        navLinks.forEach(link => {
          link.classList.toggle('active', link.getAttribute('href') === '#' + id);
        });
      }
    });
  }, observerOpts);

  sections.forEach(section => sectionObserver.observe(section));

  // --- Publication Filter Toggle ---
  const RECENT_COUNT = 5;
  const pubToggles = document.querySelectorAll('.pub-toggle');
  const pubItems = document.querySelectorAll('.pub-item');

  function applyFilter(filter) {
    pubItems.forEach(item => {
      const idx = parseInt(item.dataset.idx);
      if (filter === 'recent') {
        item.classList.toggle('hidden', idx > RECENT_COUNT);
      } else if (filter === 'all') {
        item.classList.remove('hidden');
      } else if (filter === 'selected') {
        item.classList.toggle('hidden', !item.dataset.selected);
      } else {
        item.classList.toggle('hidden', item.dataset.type !== filter);
      }
    });
  }

  // Apply "recent" filter on load
  applyFilter('recent');

  pubToggles.forEach(btn => {
    btn.addEventListener('click', () => {
      pubToggles.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      applyFilter(btn.dataset.filter);
    });
  });

  // --- Hamburger Menu Toggle ---
  const nav = document.querySelector('.nav');
  const hamburger = document.querySelector('.nav-hamburger');

  if (hamburger) {
    hamburger.addEventListener('click', () => {
      nav.classList.toggle('nav-open');
    });

    // Close menu when a nav link is clicked
    navLinks.forEach(link => {
      link.addEventListener('click', () => {
        nav.classList.remove('nav-open');
      });
    });

    // Close menu when clicking outside
    document.addEventListener('click', (e) => {
      if (!nav.contains(e.target)) {
        nav.classList.remove('nav-open');
      }
    });
  }

  // --- Smooth scroll for nav links (fallback for browsers without CSS scroll-behavior) ---
  navLinks.forEach(link => {
    link.addEventListener('click', (e) => {
      const href = link.getAttribute('href');
      if (href.startsWith('#')) {
        e.preventDefault();
        const target = document.querySelector(href);
        if (target) {
          target.scrollIntoView({ behavior: 'smooth' });
          history.pushState(null, null, href);
        }
      }
    });
  });

  // --- Hero node-graph: individuals clustering into a crowd ---
  // Visual echo of the thesis ("From Communities to Crowds") — subjective
  // signal (amber nodes) aggregating through a shared network (teal edges).
  const canvas = document.getElementById('hero-graph');
  if (canvas) {
    const ctx = canvas.getContext('2d');
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    let w, h, nodes = [];
    const N = 36;

    function seedRand(seed) {
      return function () {
        seed = (seed * 9301 + 49297) % 233280;
        return seed / 233280;
      };
    }

    function resize() {
      const rect = canvas.parentElement.getBoundingClientRect();
      w = canvas.width = rect.width;
      h = canvas.height = rect.height;
    }

    function initNodes() {
      resize();
      const rnd = seedRand(42);
      nodes = [];
      for (let i = 0; i < N; i++) {
        const clusterX = i % 3 === 0 ? w * 0.15 : (i % 3 === 1 ? w * 0.55 : w * 0.9);
        const clusterY = h * 0.4 + (rnd() - 0.5) * h * 0.5;
        nodes.push({
          x: clusterX + (rnd() - 0.5) * w * 0.2,
          y: clusterY + (rnd() - 0.5) * h * 0.6,
          vx: (rnd() - 0.5) * 0.12,
          vy: (rnd() - 0.5) * 0.12,
          r: 1 + rnd() * 1.4
        });
      }
    }

    function draw() {
      ctx.clearRect(0, 0, w, h);
      for (let i = 0; i < nodes.length; i++) {
        for (let j = i + 1; j < nodes.length; j++) {
          const a = nodes[i], b = nodes[j];
          const dx = a.x - b.x, dy = a.y - b.y;
          const d = Math.sqrt(dx * dx + dy * dy);
          if (d < w * 0.16) {
            ctx.strokeStyle = 'rgba(63,169,164,' + (0.3 * (1 - d / (w * 0.16))) + ')';
            ctx.lineWidth = 1;
            ctx.beginPath();
            ctx.moveTo(a.x, a.y);
            ctx.lineTo(b.x, b.y);
            ctx.stroke();
          }
        }
      }
      for (let k = 0; k < nodes.length; k++) {
        const n = nodes[k];
        ctx.beginPath();
        ctx.arc(n.x, n.y, n.r, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(224,164,88,0.55)';
        ctx.fill();
        if (!reduceMotion) {
          n.x += n.vx;
          n.y += n.vy;
          if (n.x < 0 || n.x > w) n.vx *= -1;
          if (n.y < 0 || n.y > h) n.vy *= -1;
        }
      }
    }

    initNodes();
    draw();
    if (!reduceMotion) {
      (function loop() { draw(); requestAnimationFrame(loop); })();
    }
    window.addEventListener('resize', () => { initNodes(); draw(); });
  }

});
