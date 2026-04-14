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

});
