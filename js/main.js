// ============ Mobile nav toggle ============
const navToggle = document.getElementById('navToggle');
const mainNav = document.getElementById('mainNav');

if (navToggle && mainNav) {
  navToggle.addEventListener('click', () => {
    const isOpen = mainNav.classList.toggle('is-open');
    navToggle.setAttribute('aria-expanded', String(isOpen));
  });

  mainNav.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      mainNav.classList.remove('is-open');
      navToggle.setAttribute('aria-expanded', 'false');
    });
  });
}

// ============ Scroll reveal ============
const revealEls = document.querySelectorAll('.reveal');

if ('IntersectionObserver' in window && revealEls.length) {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

  revealEls.forEach(el => observer.observe(el));
} else {
  revealEls.forEach(el => el.classList.add('is-visible'));
}

// ============ Hero rotating words ============
const ROTATING_WORDS = ['Observe', 'Design', 'Prototype', 'Iterate', 'Impact'];
const rotatorEl = document.getElementById('rotatorWord');

if (rotatorEl) {
  let i = 0;
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  if (!reduceMotion) {
    setInterval(() => {
      rotatorEl.classList.add('is-fading');
      setTimeout(() => {
        i = (i + 1) % ROTATING_WORDS.length;
        rotatorEl.textContent = ROTATING_WORDS[i];
        rotatorEl.classList.remove('is-fading');
      }, 300);
    }, 2200);
  }
}

// ============ Footer year ============
const yearEl = document.getElementById('year');
if (yearEl) yearEl.textContent = new Date().getFullYear();
