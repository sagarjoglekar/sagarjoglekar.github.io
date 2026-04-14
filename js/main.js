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
  const pubToggles = document.querySelectorAll('.pub-toggle');
  const pubItems = document.querySelectorAll('.pub-item');
  const pubYearGroups = document.querySelectorAll('.pub-year-group');

  pubToggles.forEach(btn => {
    btn.addEventListener('click', () => {
      pubToggles.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      const filter = btn.dataset.filter;

      pubItems.forEach(item => {
        if (filter === 'all') {
          item.classList.remove('hidden');
        } else if (filter === 'selected') {
          item.classList.toggle('hidden', !item.dataset.selected);
        } else {
          item.classList.toggle('hidden', item.dataset.type !== filter);
        }
      });

      // Hide year groups that have no visible items
      pubYearGroups.forEach(group => {
        const visible = group.querySelectorAll('.pub-item:not(.hidden)');
        group.style.display = visible.length === 0 ? 'none' : '';
      });
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
