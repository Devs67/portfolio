// ============================================================
// DEVENDHAR BACHHU — main.js  (Project Catalyst v2)
// ============================================================

// ── Mobile nav ──────────────────────────────────────────────
const navToggle = document.getElementById('navToggle');
const mainNav   = document.getElementById('mainNav');
if (navToggle && mainNav) {
  navToggle.addEventListener('click', () => {
    const open = mainNav.classList.toggle('is-open');
    navToggle.setAttribute('aria-expanded', String(open));
  });
  mainNav.querySelectorAll('a').forEach(l =>
    l.addEventListener('click', () => {
      mainNav.classList.remove('is-open');
      navToggle.setAttribute('aria-expanded', 'false');
    })
  );
}

// ── Scroll reveal ────────────────────────────────────────────
const revealEls = document.querySelectorAll('.reveal');
if ('IntersectionObserver' in window) {
  const obs = new IntersectionObserver(
    entries => entries.forEach(e => {
      if (e.isIntersecting) { e.target.classList.add('is-visible'); obs.unobserve(e.target); }
    }),
    { threshold: 0.1, rootMargin: '0px 0px -40px 0px' }
  );
  revealEls.forEach(el => obs.observe(el));
} else {
  revealEls.forEach(el => el.classList.add('is-visible'));
}

// ── Hero rotating words ──────────────────────────────────────
const WORDS = ['Observe', 'Design', 'Prototype', 'Iterate', 'Impact'];
const wordEl = document.getElementById('rotatorWord');
if (wordEl && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
  let idx = 0;
  function nextWord() {
    wordEl.classList.add('is-out');
    setTimeout(() => {
      idx = (idx + 1) % WORDS.length;
      wordEl.textContent = WORDS[idx];
      wordEl.classList.remove('is-out');
      wordEl.classList.add('is-in');
      // force reflow then remove is-in to trigger transition
      void wordEl.offsetWidth;
      wordEl.classList.remove('is-in');
    }, 360);
  }
  setInterval(nextWord, 2400);
}

// ── Flow-line layout engine ──────────────────────────────────
function layoutFlowLine(tabsEl) {
  if (!tabsEl) return;
  const lineEl  = tabsEl.querySelector('.dc-line');
  const fillEl  = tabsEl.querySelector('.dc-line-fill');
  const arrowEl = tabsEl.querySelector('.dc-arrow');
  const tabs    = Array.from(tabsEl.querySelectorAll('.dc-tab'));
  if (!lineEl || !fillEl || !arrowEl || !tabs.length) return;

  const cr = tabsEl.getBoundingClientRect();
  const centers = tabs.map(tab => {
    const badge = tab.querySelector('.dc-tab-badge');
    const r = badge.getBoundingClientRect();
    return { x: r.left + r.width / 2 - cr.left, y: r.top + r.height / 2 - cr.top };
  });

  const x    = centers[0].x;
  const top  = centers[0].y;
  const bot  = centers[centers.length - 1].y;
  const ai   = Math.max(0, tabs.findIndex(t => t.classList.contains('is-active')));

  lineEl.style.cssText  = `left:${x}px;top:${top}px;height:${Math.max(0,bot-top)}px;`;
  fillEl.style.cssText  = `left:${x}px;top:${top}px;height:${Math.max(0,centers[ai].y-top)}px;`;
  arrowEl.style.cssText = `left:${x}px;top:${centers[ai].y}px;`;
}

function wireFlowTabs(tabsEl, onSelect) {
  if (!tabsEl) return;
  tabsEl.querySelectorAll('.dc-tab').forEach(tab => {
    tab.addEventListener('click', () => {
      tabsEl.querySelectorAll('.dc-tab').forEach(t => {
        t.classList.remove('is-active');
        t.setAttribute('aria-selected', 'false');
      });
      tab.classList.add('is-active');
      tab.setAttribute('aria-selected', 'true');
      onSelect(tab);
      layoutFlowLine(tabsEl);
    });
  });
  layoutFlowLine(tabsEl);
}

window.addEventListener('resize', () =>
  document.querySelectorAll('.dc-tabs').forEach(layoutFlowLine)
);

// ── IB MYP Design Cycle ─────────────────────────────────────
const DC_DATA = {
  A: {
    title: 'Criterion A: Formulating the Blueprint',
    badge: 'Criterion A',
    desc: 'Students research a real-world client need. They identify existing designs, synthesise primary user reviews, and establish precise design specifications.',
    items: ['Primary research & interviews','Existing solutions analysis','Design specification','Target user profile'],
  },
  B: {
    title: 'Criterion B: Generating & Selecting',
    badge: 'Criterion B',
    desc: 'Students brainstorm multiple feasible designs, test each against the specification, then select and justify one final design with annotated planning drawings.',
    items: ['Multiple design ideas','Specification testing','Justified final design','Annotated drawings'],
  },
  C: {
    title: 'Criterion C: Building the Prototype',
    badge: 'Criterion C',
    desc: 'Students plan the making process in detail, then follow that plan to construct a functioning prototype safely using makerspace tools.',
    items: ['Detailed planning chart','Tools & materials list','Functioning prototype','Process photo log'],
  },
  D: {
    title: 'Criterion D: Testing & Reflection',
    badge: 'Criterion D',
    desc: 'Students test the finished solution against the original specification, gather user feedback, evaluate impact, and explain concrete improvements.',
    items: ['Testing against specification','User feedback summary','Impact statement','Improvement recommendations'],
  },
};

function renderPanel(panelEl, d, extraHtml = '') {
  panelEl.style.animation = 'none';
  void panelEl.offsetWidth;
  panelEl.style.animation = '';
  panelEl.innerHTML = `
    <div class="dc-panel-top">
      <h3 class="dc-panel-title">${d.title}</h3>
      <span class="dc-panel-badge ${d.badgeHighlight || ''}">${d.badge}</span>
    </div>
    <p class="dc-panel-desc">${d.desc}</p>
    <p class="dc-panel-label">Assessment deliverables &amp; milestones</p>
    <ul class="dc-checklist">
      ${d.items.map(i => `<li><span class="dc-check-icon">&#10003;</span>${i}</li>`).join('')}
    </ul>
    ${extraHtml}
  `;
}

function initDesignCycle() {
  const tabsEl  = document.getElementById('dcTabs');
  const panelEl = document.getElementById('dcPanel');
  if (!tabsEl || !panelEl) return;
  wireFlowTabs(tabsEl, tab => renderPanel(panelEl, DC_DATA[tab.dataset.criterion]));
  renderPanel(panelEl, DC_DATA.A);
  layoutFlowLine(tabsEl);
}
initDesignCycle();

// ── My Journey ───────────────────────────────────────────────
const JOURNEY_DATA = {
  shriram: {
    title: 'Makerspace & Design Facilitator — IB MYP Design',
    badge: 'Cat 1 · The Shriram Academy · Jul 2025 — Present',
    badgeHighlight: 'dc-panel-badge--highlight',
    desc: 'Run the IB MYP Digital & Product Design programme end to end — from curriculum mapping through daily facilitation to assessment.',
    items: [
      'Plan & deliver MYP Design units through the IB Design Cycle',
      'Independently led 3 units, co-facilitated 2, ran 1 solo',
      'Design formative & summative assessment to MYP criteria',
      'Give criterion-referenced feedback to support growth',
      'Lead curriculum review & programme mapping across MY grades',
      'Embed ATL Skills, Learner Profile & Global Contexts daily',
      'Run makerspace sessions: Robotics, 3D Design, Coding, Prototyping',
      'Guide learners through reflective design-process journals',
    ],
    link: 'https://drive.google.com/file/d/1lKdmCfK3jOxRQvyKl7qOg6lLk5WhMMPE/view?usp=sharing',
    linkLabel: 'View Cat 1 Certificate ↗',
  },
  creya: {
    title: 'Education Program Manager',
    badge: 'Creya Learning and Research · Aug 2023 — Jul 2025',
    desc: 'Took STEM program delivery from pilot to a 10+ school network across two states.',
    items: [
      'Led STEM rollout across 10+ schools in Telangana & AP',
      'Trained & mentored educators in Robotics, IoT, Coding',
      'Built and ran the Design Thinking teacher curriculum',
      'Managed stakeholder relationships with school leadership',
      'Mentored students for the i3R2 Make-a-thon, IIT Chennai',
      'Mentored teams for the Junior Make-a-thon',
      'Designed & delivered hands-on STEM camps, ages 6–15',
      'Tracked program quality with data-driven evaluation',
    ],
  },
  simpliforge: {
    title: 'Design Engineer',
    badge: 'Simpliforge Creations · Mar — Jul 2023',
    desc: 'Hands-on mechanical and structural design for concrete 3D printing.',
    items: [
      'Designed architectural structures for concrete 3D printing',
      'Modelled components in SolidWorks and Fusion 360',
      'Produced 2D manufacturing drawings in AutoCAD',
      'Validated designs against print-process constraints',
      'Iterated geometry based on print trial feedback',
    ],
  },
  evobi: {
    title: 'Robotics Mentor Intern',
    badge: 'Evobi Automations / Atal Tinkering Lab · Dec 2022 — Mar 2023',
    desc: 'The starting point — first time teaching, and the moment I realised I loved it as much as building.',
    items: [
      'Delivered Robotics & IoT sessions across partner schools',
      'Built hands-on learning experiences for new students',
      'Co-planned lessons with classroom teachers',
      'Mentored students through their first working prototypes',
    ],
  },
};

function initJourney() {
  const tabsEl  = document.getElementById('journeyTabs');
  const panelEl = document.getElementById('journeyPanel');
  if (!tabsEl || !panelEl) return;

  const showRole = (tab) => {
    const d = JOURNEY_DATA[tab.dataset.role];
    const linkHtml = d.link
      ? `<a href="${d.link}" class="dc-panel-link" target="_blank" rel="noopener">${d.linkLabel}</a>`
      : '';
    renderPanel(panelEl, d, linkHtml);
  };

  wireFlowTabs(tabsEl, showRole);
  showRole(tabsEl.querySelector('.dc-tab.is-active'));
  layoutFlowLine(tabsEl);
}
initJourney();

// ── Sync panel heights with tabs list ────────────────────────
function syncPanelHeights() {
  document.querySelectorAll('.dc-grid').forEach(grid => {
    const tabs  = grid.querySelector('.dc-tabs');
    const panel = grid.querySelector('.dc-panel');
    if (!tabs || !panel) return;
    panel.style.maxHeight = tabs.offsetHeight + 'px';
  });
}
function relayout() {
  document.querySelectorAll('.dc-tabs').forEach(layoutFlowLine);
  syncPanelHeights();
}
window.addEventListener('resize', relayout);
window.addEventListener('load', relayout);
if (document.fonts?.ready) document.fonts.ready.then(relayout);
setTimeout(relayout, 600);
setTimeout(relayout, 1400);

// ── LinkedIn carousel ────────────────────────────────────────
function initCarousel() {
  const track    = document.getElementById('liTrack');
  const viewport = document.getElementById('liViewport');
  const prev     = document.getElementById('liPrev');
  const next     = document.getElementById('liNext');
  const dots     = Array.from(document.querySelectorAll('.li-dot'));
  if (!track || !viewport || !prev || !next) return;

  const slides = Array.from(track.querySelectorAll('.li-slide'));
  const total  = slides.length;
  let current  = 0;
  let autoTimer = null;

  function goTo(n, userInitiated = false) {
    current = ((n % total) + total) % total;
    track.style.transform = `translateX(-${current * 100}%)`;
    dots.forEach((d, i) => d.classList.toggle('is-active', i === current));
    if (userInitiated) resetAuto();
  }

  prev.addEventListener('click', () => goTo(current - 1, true));
  next.addEventListener('click', () => goTo(current + 1, true));
  dots.forEach((dot, i) => dot.addEventListener('click', () => goTo(i, true)));

  // Keyboard navigation
  viewport.addEventListener('keydown', e => {
    if (e.key === 'ArrowLeft')  goTo(current - 1, true);
    if (e.key === 'ArrowRight') goTo(current + 1, true);
  });

  // Touch/swipe
  let touchStartX = 0;
  viewport.addEventListener('touchstart', e => { touchStartX = e.touches[0].clientX; }, { passive: true });
  viewport.addEventListener('touchend', e => {
    const dx = e.changedTouches[0].clientX - touchStartX;
    if (Math.abs(dx) > 40) goTo(current + (dx < 0 ? 1 : -1), true);
  });

  // Auto-advance every 5s
  function startAuto() {
    autoTimer = setInterval(() => goTo(current + 1), 5000);
  }
  function resetAuto() {
    clearInterval(autoTimer);
    startAuto();
  }

  // Pause on hover/focus
  const wrap = document.querySelector('.li-carousel-wrap');
  if (wrap) {
    wrap.addEventListener('mouseenter', () => clearInterval(autoTimer));
    wrap.addEventListener('mouseleave', startAuto);
    wrap.addEventListener('focusin',    () => clearInterval(autoTimer));
    wrap.addEventListener('focusout',   startAuto);
  }

  goTo(0);
  startAuto();
}
initCarousel();

// ── Nav scrollspy ─────────────────────────────────────────────
const navLinks   = Array.from(document.querySelectorAll('.main-nav a[href^="#"]'));
const navSections = navLinks.map(l => document.querySelector(l.getAttribute('href'))).filter(Boolean);
if ('IntersectionObserver' in window && navSections.length) {
  const spyObs = new IntersectionObserver(
    entries => entries.forEach(e => {
      if (e.isIntersecting)
        navLinks.forEach(l => l.classList.toggle('is-active', l.getAttribute('href') === '#' + e.target.id));
    }),
    { rootMargin: '-45% 0px -50% 0px', threshold: 0 }
  );
  navSections.forEach(s => spyObs.observe(s));
}

// ── Scroll progress ring ──────────────────────────────────────
const spFill      = document.getElementById('spFill');
const spIcon      = document.getElementById('spIcon');
const spEl        = document.getElementById('scrollProgress');
const SP_CIRC     = 150.8;
function updateProgress() {
  if (!spFill) return;
  const doc = document.documentElement;
  const pct = Math.min(1, Math.max(0, window.scrollY / Math.max(1, doc.scrollHeight - doc.clientHeight)));
  spFill.style.strokeDashoffset = String(SP_CIRC * (1 - pct));
  const done = pct > 0.985;
  spEl.classList.toggle('is-complete', done);
  if (spIcon) spIcon.innerHTML = done ? '&#10003;' : '&#8595;';
}
window.addEventListener('scroll', updateProgress, { passive: true });
window.addEventListener('resize', updateProgress);
updateProgress();

// ── Footer year ───────────────────────────────────────────────
const yearEl = document.getElementById('year');
if (yearEl) yearEl.textContent = new Date().getFullYear();
