/* =============================================
   ASTU AMIN PORTFOLIO — main.js
   ============================================= */

document.addEventListener('DOMContentLoaded', () => {

  // ---- SCROLL REVEAL ----
  const reveals = document.querySelectorAll('.reveal');
  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        revealObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12 });
  reveals.forEach(el => revealObserver.observe(el));

  // ---- STAGGER GRID CHILDREN ----
  const staggerTargets = document.querySelectorAll(
    '.skills-grid, .projects-grid, .soft-grid, .edu-grid'
  );
  staggerTargets.forEach(grid => {
    [...grid.children].forEach((child, i) => {
      child.style.transitionDelay = `${i * 0.08}s`;
    });
  });

  // ---- MOBILE HAMBURGER MENU ----
  const hamburger = document.querySelector('.hamburger');
  const mobileMenu = document.querySelector('.mobile-menu');

  if (hamburger && mobileMenu) {
    hamburger.addEventListener('click', () => {
      mobileMenu.classList.toggle('open');
      const spans = hamburger.querySelectorAll('span');
      const isOpen = mobileMenu.classList.contains('open');
      spans[0].style.transform = isOpen ? 'rotate(45deg) translate(5px, 5px)' : '';
      spans[1].style.opacity = isOpen ? '0' : '1';
      spans[2].style.transform = isOpen ? 'rotate(-45deg) translate(5px, -5px)' : '';
    });

    // Close menu when a link is clicked
    mobileMenu.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        mobileMenu.classList.remove('open');
        const spans = hamburger.querySelectorAll('span');
        spans.forEach(s => { s.style.transform = ''; s.style.opacity = '1'; });
      });
    });
  }

  // ---- ACTIVE NAV LINK ON SCROLL ----
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav-links a, .mobile-menu a');

  const activeObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        navLinks.forEach(link => {
          link.classList.remove('active');
          if (link.getAttribute('href') === `#${entry.target.id}`) {
            link.classList.add('active');
          }
        });
      }
    });
  }, { threshold: 0.4 });

  sections.forEach(s => activeObserver.observe(s));

  // ---- SMOOTH SCROLL WITH OFFSET (for fixed nav) ----
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', (e) => {
      const target = document.querySelector(anchor.getAttribute('href'));
      if (target) {
        e.preventDefault();
        const offset = 80;
        const top = target.getBoundingClientRect().top + window.scrollY - offset;
        window.scrollTo({ top, behavior: 'smooth' });
      }
    });
  });

  // ---- TYPING EFFECT ON HERO SUBTITLE ----
  const typeTarget = document.querySelector('.hero-sub');
  if (typeTarget) {
    const text = typeTarget.textContent;
    typeTarget.textContent = '';
    typeTarget.style.opacity = '1';
    let i = 0;
    const typeSpeed = 18;
    const startDelay = 800;

    setTimeout(() => {
      const interval = setInterval(() => {
        typeTarget.textContent += text[i];
        i++;
        if (i >= text.length) clearInterval(interval);
      }, typeSpeed);
    }, startDelay);
  }

  // ---- STAT COUNTER ANIMATION ----
  const statNums = document.querySelectorAll('.stat-num');
  const counterObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const el = entry.target;
        const raw = el.textContent.trim();
        const match = raw.match(/^(\d+\.?\d*)(.*)/);
        if (match) {
          const target = parseFloat(match[1]);
          const suffix = match[2];
          let current = 0;
          const step = target / 40;
          const interval = setInterval(() => {
            current = Math.min(current + step, target);
            el.textContent = Number.isInteger(target)
              ? Math.round(current) + suffix
              : current.toFixed(1) + suffix;
            if (current >= target) clearInterval(interval);
          }, 30);
        }
        counterObserver.unobserve(el);
      }
    });
  }, { threshold: 0.5 });

  statNums.forEach(el => counterObserver.observe(el));

  // ---- NAV SCROLL SHADOW ----
  const navEl = document.querySelector('nav');
  window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
      navEl.style.boxShadow = '0 8px 40px rgba(0,0,0,0.4)';
    } else {
      navEl.style.boxShadow = 'none';
    }
  });

});
