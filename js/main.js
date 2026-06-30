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

// ============ Scroll reveal (with stagger) ============
const revealEls = document.querySelectorAll('.reveal');

// Stagger elements that share a parent, so groups (cards, timeline items,
// philosophy steps) animate in sequence rather than all at once.
const staggerGroups = new Map();
revealEls.forEach((el) => {
  const parent = el.parentElement;
  if (!staggerGroups.has(parent)) staggerGroups.set(parent, []);
  staggerGroups.get(parent).push(el);
});
staggerGroups.forEach((group) => {
  if (group.length < 2) return;
  group.forEach((el, i) => {
    el.style.transitionDelay = `${Math.min(i, 5) * 90}ms`;
  });
});

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

// ============ Shared flow-line layout (used by Design Cycle + Journey) ============
function layoutFlowLine(tabsEl) {
  if (!tabsEl) return;
  const lineEl = tabsEl.querySelector('.dc-line');
  const fillEl = tabsEl.querySelector('.dc-line-fill');
  const arrowEl = tabsEl.querySelector('.dc-arrow');
  const tabs = Array.from(tabsEl.querySelectorAll('.dc-tab'));
  if (!lineEl || !fillEl || !arrowEl || !tabs.length) return;

  const containerRect = tabsEl.getBoundingClientRect();
  const centers = tabs.map((tab) => {
    const badge = tab.querySelector('.dc-tab-badge');
    const r = badge.getBoundingClientRect();
    return {
      x: r.left + r.width / 2 - containerRect.left,
      y: r.top + r.height / 2 - containerRect.top,
    };
  });

  const x = centers[0].x;
  const top = centers[0].y;
  const bottom = centers[centers.length - 1].y;
  const activeIdx = Math.max(0, tabs.findIndex((t) => t.classList.contains('is-active')));

  lineEl.style.left = x + 'px';
  lineEl.style.top = top + 'px';
  lineEl.style.height = Math.max(0, bottom - top) + 'px';

  fillEl.style.left = x + 'px';
  fillEl.style.top = top + 'px';
  fillEl.style.height = Math.max(0, centers[activeIdx].y - top) + 'px';

  arrowEl.style.left = x + 'px';
  arrowEl.style.top = centers[activeIdx].y + 'px';
}

function wireFlowTabs(tabsEl, onSelect) {
  if (!tabsEl) return;
  tabsEl.querySelectorAll('.dc-tab').forEach((tab) => {
    tab.addEventListener('click', () => {
      tabsEl.querySelectorAll('.dc-tab').forEach((t) => {
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

window.addEventListener('resize', () => {
  document.querySelectorAll('.dc-tabs').forEach(layoutFlowLine);
});

// ============ Interactive IB MYP Design Cycle ============
const DESIGN_CYCLE_DATA = {
  A: {
    title: 'Criterion A: Formulating the Blueprint',
    badge: 'Criterion A Grading',
    desc: 'Students research a real-world need inside the makerspace context. They study existing solutions, gather primary user research, and establish a precise design specification before sketching a single idea.',
    items: ['Primary research & interviews', 'Existing solutions analysis', 'Design specification', 'Target user profile'],
  },
  B: {
    title: 'Criterion B: Generating & Selecting',
    badge: 'Criterion B Grading',
    desc: 'Students brainstorm multiple feasible design ideas, test each against the specification from Criterion A, then select and justify one final design with annotated planning drawings.',
    items: ['Multiple design ideas', 'Specification testing', 'Justified final design', 'Annotated drawings'],
  },
  C: {
    title: 'Criterion C: Building the Prototype',
    badge: 'Criterion C Grading',
    desc: 'Students plan the making process in detail, then follow that plan to construct a functioning prototype safely — using the makerspace tools for fabrication, 3D printing, electronics or code as the project demands.',
    items: ['Detailed planning chart', 'Tools & materials list', 'Functioning prototype', 'Process photo log'],
  },
  D: {
    title: 'Criterion D: Testing & Reflection',
    badge: 'Criterion D Grading',
    desc: 'Students test the finished solution against the original specification, gather structured feedback from real users, evaluate the impact of their design, and explain concrete improvements for future iterations.',
    items: ['Testing against specification', 'User feedback summary', 'Impact statement', 'Improvement recommendations'],
  },
};

function renderDcPanel(panelEl, d) {
  panelEl.style.animation = 'none';
  void panelEl.offsetWidth;
  panelEl.style.animation = '';
  panelEl.innerHTML = `
    <div class="dc-panel-top">
      <h3 class="dc-panel-title">${d.title}</h3>
      <span class="dc-panel-badge">${d.badge}</span>
    </div>
    <p class="dc-panel-desc">${d.desc}</p>
    <p class="dc-panel-label">Assessment deliverables &amp; milestones</p>
    <ul class="dc-checklist">
      ${d.items.map((item) => `<li><span class="dc-check-icon">&#10003;</span>${item}</li>`).join('')}
    </ul>
  `;
}

function initDesignCycle() {
  const tabsEl = document.getElementById('dcTabs');
  const panelEl = document.getElementById('dcPanel');
  if (!tabsEl || !panelEl) return;

  wireFlowTabs(tabsEl, (tab) => renderDcPanel(panelEl, DESIGN_CYCLE_DATA[tab.dataset.criterion]));
  renderDcPanel(panelEl, DESIGN_CYCLE_DATA.A);
  layoutFlowLine(tabsEl);
}
initDesignCycle();

// ============ My Journey (reuses the flow-line system) ============
const JOURNEY_DATA = {
  shriram: {
    title: 'Makerspace & Design Facilitator — IB MYP Design',
    badge: 'The Shriram Academy · Cat 1 · Jul 2025 — Present',
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
    desc: 'Moved from classroom-facing design thinking into hands-on mechanical and structural design for concrete 3D printing.',
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
      'Built first hands-on learning experiences for new students',
      'Co-planned lessons with classroom teachers',
      'Mentored students through their first working prototypes',
    ],
  },
};

function renderJourneyPanel(panelEl, d) {
  panelEl.style.animation = 'none';
  void panelEl.offsetWidth;
  panelEl.style.animation = '';
  panelEl.innerHTML = `
    <div class="dc-panel-top">
      <h3 class="dc-panel-title">${d.title}</h3>
      <span class="dc-panel-badge">${d.badge}</span>
    </div>
    <p class="dc-panel-desc">${d.desc}</p>
    <p class="dc-panel-label">What I actually did</p>
    <ul class="dc-checklist">
      ${d.items.map((item) => `<li><span class="dc-check-icon">&#10003;</span>${item}</li>`).join('')}
    </ul>
  `;
}

function initJourney() {
  const tabsEl = document.getElementById('journeyTabs');
  const panelEl = document.getElementById('journeyPanel');
  if (!tabsEl || !panelEl) return;

  wireFlowTabs(tabsEl, (tab) => renderJourneyPanel(panelEl, JOURNEY_DATA[tab.dataset.role]));
  renderJourneyPanel(panelEl, JOURNEY_DATA.shriram);
  layoutFlowLine(tabsEl);
}
initJourney();

// ============ Nav scrollspy (active link + underline) ============
const navLinks = Array.from(document.querySelectorAll('.main-nav a[href^="#"]'));
const navSections = navLinks
  .map((link) => document.querySelector(link.getAttribute('href')))
  .filter(Boolean);

if ('IntersectionObserver' in window && navSections.length) {
  const setActive = (id) => {
    navLinks.forEach((link) => {
      link.classList.toggle('is-active', link.getAttribute('href') === '#' + id);
    });
  };

  const spyObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) setActive(entry.target.id);
      });
    },
    { rootMargin: '-45% 0px -50% 0px', threshold: 0 }
  );

  navSections.forEach((sec) => spyObserver.observe(sec));
}

// ============ Scroll progress indicator (bottom-left) ============
const spFill = document.getElementById('spFill');
const spIcon = document.getElementById('spIcon');
const scrollProgressEl = document.getElementById('scrollProgress');
const SP_CIRC = 150.8;

function updateScrollProgress() {
  if (!spFill) return;
  const doc = document.documentElement;
  const scrollTop = window.scrollY || doc.scrollTop;
  const max = doc.scrollHeight - doc.clientHeight;
  const pct = max > 0 ? Math.min(1, Math.max(0, scrollTop / max)) : 0;
  spFill.style.strokeDashoffset = String(SP_CIRC * (1 - pct));

  const complete = pct > 0.985;
  scrollProgressEl.classList.toggle('is-complete', complete);
  if (spIcon) spIcon.innerHTML = complete ? '&#10003;' : '&#8595;';
}

window.addEventListener('scroll', updateScrollProgress, { passive: true });
window.addEventListener('resize', updateScrollProgress);
updateScrollProgress();

// Re-measure flow lines once fonts/layout settle (web fonts + reveal transform can shift positions)
function relayoutAllFlowTabs() {
  document.querySelectorAll('.dc-tabs').forEach(layoutFlowLine);
}
if (document.fonts && document.fonts.ready) {
  document.fonts.ready.then(relayoutAllFlowTabs);
}
window.addEventListener('load', relayoutAllFlowTabs);
setTimeout(relayoutAllFlowTabs, 900);



// ============ Footer year ============
const yearEl = document.getElementById('year');
if (yearEl) yearEl.textContent = new Date().getFullYear();
