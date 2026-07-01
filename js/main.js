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

// ── Pull-cord dark mode — drag to trigger ───────────────────
function initPullCord() {
  const cord   = document.getElementById('pullCord');
  const rope   = cord?.querySelector('.cord-rope');
  const handle = cord?.querySelector('.cord-handle');
  const hint   = document.getElementById('cordHint');
  if (!cord || !rope || !handle) return;

  const STORE     = 'db-dark-mode';
  const THRESHOLD = 55;   // px — must drag this far to trigger
  const MAX_DRAG  = 95;   // px — visual stretch cap
  let isDark   = localStorage.getItem(STORE) === '1';
  let dragging = false;
  let startY   = 0;

  // Touch-action none so drag doesn't scroll the page
  cord.style.touchAction = 'none';

  function startDrag(y) {
    if (dragging) return;
    dragging = true;
    startY   = y;
    cord.classList.add('is-dragging');
    rope.style.transition   = 'none';
    handle.style.transition = 'none';
  }

  function moveDrag(y) {
    if (!dragging) return;
    const dy      = Math.max(0, y - startY);
    const clamped = Math.min(dy, MAX_DRAG);
    // Ease off at max stretch
    const eased   = clamped * (1 - clamped / (MAX_DRAG * 2.2));
    rope.style.transform         = `scaleY(${1 + eased / 70})`;
    rope.style.transformOrigin   = 'top center';
    handle.style.transform       = `translateY(${eased * 0.72}px)`;
    const glow = Math.min(clamped / MAX_DRAG, 1);
    handle.style.boxShadow       = `0 4px ${10 + glow * 22}px rgba(166,90,56,${glow * 0.5})`;
    // Hint turns clay when close to threshold
    if (hint) hint.style.color = clamped >= THRESHOLD * 0.7
      ? 'var(--clay)' : '';
  }

  function endDrag(y) {
    if (!dragging) return;
    dragging = false;
    cord.classList.remove('is-dragging');
    const dy = Math.max(0, y - startY);
    // Spring back
    rope.style.transition        = '';
    handle.style.transition      = '';
    rope.style.transform         = '';
    handle.style.transform       = '';
    handle.style.boxShadow       = '';
    if (hint) hint.style.color   = '';
    cord.classList.add('is-snapping');
    setTimeout(() => cord.classList.remove('is-snapping'), 500);
    if (dy >= THRESHOLD) applyDark(!isDark, true);
  }

  // Pointer Events — unified mouse + touch, no accidental click
  cord.addEventListener('pointerdown', e => {
    e.preventDefault();
    cord.setPointerCapture(e.pointerId);
    startDrag(e.clientY);
  });
  cord.addEventListener('pointermove', e => moveDrag(e.clientY));
  cord.addEventListener('pointerup',   e => endDrag(e.clientY));
  cord.addEventListener('pointercancel', () => {
    dragging = false;
    cord.classList.remove('is-dragging');
    rope.style.transition = handle.style.transition = '';
    rope.style.transform  = handle.style.transform  = '';
    handle.style.boxShadow = '';
  });

  function applyDark(dark, flicker = false) {
    isDark = dark;
    localStorage.setItem(STORE, dark ? '1' : '0');
    cord.setAttribute('aria-pressed', String(dark));
    cord.classList.toggle('has-pulled', dark);
    if (hint && window.innerWidth > 720) hint.textContent = dark ? '' : 'pull';
    if (flicker && !window.matchMedia('(prefers-reduced-motion:reduce)').matches) {
      document.body.classList.add('is-flickering');
      setTimeout(() => document.body.classList.remove('is-flickering'), 420);
    }
    setTimeout(() => document.documentElement.classList.toggle('dark-mode', dark),
      flicker ? 140 : 0);
  }

  function adaptToViewport() {
    const isMobile = window.innerWidth <= 720;
    if (hint) hint.textContent = isMobile ? 'theme' : (isDark ? '' : 'pull');
    if (isMobile) {
      const header = document.querySelector('.site-header');
      if (header) cord.style.top = header.offsetHeight + 'px';
    } else {
      cord.style.top = '';
    }
  }
  window.addEventListener('resize', adaptToViewport);
  adaptToViewport();

  if (isDark) applyDark(true, false);
  if (localStorage.getItem(STORE) === null
      && window.matchMedia('(prefers-color-scheme:dark)').matches)
    applyDark(true, false);
}
initPullCord();

// ============================================================
// PHOTO GALLERY CAROUSEL
// How to add a photo:
//   1. Upload compressed photo to images/gallery/
//      Name it next in sequence: 6.jpg, 7.jpg …
//   2. Add one entry to GALLERY_DATA below matching the number
//   3. Commit & push — done.
// ============================================================

const GALLERY_DATA = [
  { n:1, title:'Makerspace Robotics Session',   tag:'Robotics',  desc:'Students building and programming their first Arduino-controlled robots — update this description once you know what each photo shows.' },
  { n:2, title:'3D Printing Workshop',          tag:'3D Design', desc:'Designing and printing custom prototypes in Tinkercad — update this description once you know what each photo shows.' },
  { n:3, title:'IB Design Cycle in Action',     tag:'IB MYP',    desc:'Grade 7 learners documenting their design process through structured reflective journals — update this description.' },
  { n:4, title:'Student Project Showcase',      tag:'Projects',  desc:'End-of-unit showcase where students presented finished designs to peers and parents — update this description.' },
  { n:5, title:'STEM Camp Session',             tag:'STEM',      desc:'Hands-on STEM camp for ages 6–15 across schools in Telangana and Andhra Pradesh — update this description.' },
  // { n:6, title:'Your title', tag:'Tag', desc:'One sentence description.' },
];

function initPhotoCarousel() {
  const mount = document.getElementById('galleryMount');
  if (!mount) return;

  if (!GALLERY_DATA.length) {
    mount.innerHTML = `<div class="gallery-empty"><p>Upload photos to <code>images/gallery/</code> and fill <code>GALLERY_DATA</code> in <code>js/main.js</code>.</p></div>`;
    return;
  }

  const total = GALLERY_DATA.length;
  let current   = 0;
  let autoTimer = null;

  // Build slides
  mount.innerHTML = `
    <div class="photo-carousel-wrap">
      <button class="pc-arrow pc-arrow--prev" id="pcPrev" aria-label="Previous photo">&#8592;</button>
      <div class="photo-viewport" id="photoViewport">
        <div class="photo-track" id="photoTrack">
          ${GALLERY_DATA.map((item, i) => `
            <div class="photo-slide">
              <figure class="photo-card">
                <div class="photo-card-frame">
                  <img class="photo-card-img"
                       src="images/gallery/${item.n}.jpg"
                       alt="${item.title}"
                       loading="${i === 0 ? 'eager' : 'lazy'}">
                </div>
                <figcaption class="photo-card-caption">
                  <div class="photo-card-top">
                    <h4 class="photo-card-title">${item.title}</h4>
                    <span class="photo-card-tag">${item.tag}</span>
                  </div>
                  <p class="photo-card-desc">${item.desc}</p>
                  <span class="photo-card-num">${String(item.n).padStart(2,'0')} / ${String(total).padStart(2,'0')}</span>
                </figcaption>
              </figure>
            </div>
          `).join('')}
        </div>
      </div>
      <button class="pc-arrow pc-arrow--next" id="pcNext" aria-label="Next photo">&#8594;</button>
    </div>
    <div class="photo-dots" id="photoDots">
      ${GALLERY_DATA.map((_,i) =>
        `<button class="photo-dot${i===0?' is-active':''}" data-dot="${i}" aria-label="Photo ${i+1}"></button>`
      ).join('')}
    </div>
  `;

  const track  = document.getElementById('photoTrack');
  const dots   = Array.from(document.querySelectorAll('.photo-dot'));

  function goTo(n, user = false) {
    current = ((n % total) + total) % total;
    track.style.transform = `translateX(-${current * 100}%)`;
    dots.forEach((d,i) => d.classList.toggle('is-active', i === current));
    if (user) resetAuto();
  }

  function resetAuto() {
    clearInterval(autoTimer);
    autoTimer = setInterval(() => goTo(current + 1), 5500);
  }

  document.getElementById('pcPrev').addEventListener('click', () => goTo(current - 1, true));
  document.getElementById('pcNext').addEventListener('click', () => goTo(current + 1, true));
  dots.forEach((btn, i) => btn.addEventListener('click', () => goTo(i, true)));

  // Touch swipe
  const vp = document.getElementById('photoViewport');
  let tx = 0;
  vp.addEventListener('touchstart', e => { tx = e.touches[0].clientX; }, { passive:true });
  vp.addEventListener('touchend',   e => {
    const dx = e.changedTouches[0].clientX - tx;
    if (Math.abs(dx) > 40) goTo(current + (dx < 0 ? 1 : -1), true);
  });

  // Pause on hover
  const wrap = mount.querySelector('.photo-carousel-wrap');
  wrap.addEventListener('mouseenter', () => clearInterval(autoTimer));
  wrap.addEventListener('mouseleave', resetAuto);

  goTo(0);
  autoTimer = setInterval(() => goTo(current + 1), 5500);
}
initPhotoCarousel();

// ── Audience segmentation ─────────────────────────────────────
(function initAudience() {
  const VALID    = ['student', 'educator', 'recruiter', 'all'];
  const STORE    = 'db-audience';
  const picker   = document.getElementById('audience-picker');
  const pill     = document.getElementById('audiencePill');
  const apLabel  = document.getElementById('apLabel');
  const apDot    = document.querySelector('.ap-dot');
  const skipBtn  = document.getElementById('apSkip');
  if (!picker) return;

  const LABELS = {
    student:  'Student & Parent',
    educator: 'Co-Teacher',
    recruiter:'Recruiter',
    all:      'All sections',
  };
  const DOT_CLASS = {
    student:  '',
    educator: 'ap-dot--educator',
    recruiter:'ap-dot--recruiter',
    all:      '',
  };

  // Show/hide sections based on choice
  function applySections(choice) {
    document.querySelectorAll('[data-audience]').forEach(sec => {
      const audiences = sec.dataset.audience.split(' ');
      const visible   = audiences.includes(choice);
      sec.classList.toggle('aud-visible', visible);
      // Re-trigger reveals inside newly shown sections
      if (visible) {
        sec.querySelectorAll('.reveal:not(.is-visible)').forEach(el => {
          // small stagger so they don't all fire at once
          setTimeout(() => el.classList.add('is-visible'), 80);
        });
      }
    });
  }

  // Update nav: hide links whose section is not visible
  function updateNav(choice) {
    document.querySelectorAll('.main-nav a[href^="#"]').forEach(link => {
      const id  = link.getAttribute('href').slice(1);
      const sec = document.getElementById(id);
      if (!sec || !sec.dataset.audience) { link.style.display = ''; return; }
      const audiences = sec.dataset.audience.split(' ');
      link.style.display = audiences.includes(choice) ? '' : 'none';
    });
  }

  // Show audience pill in nav
  function showPill(choice) {
    if (!pill || !apLabel) return;
    apLabel.textContent = 'Viewing as: ' + LABELS[choice];
    if (apDot) {
      apDot.className = 'ap-dot ' + (DOT_CLASS[choice] || '');
    }
    pill.style.display = 'flex';
  }

  // Commit a choice
  function setAudience(choice, save = true) {
    if (!VALID.includes(choice)) choice = 'all';
    if (save) localStorage.setItem(STORE, choice);

    // Update URL param silently
    try {
      const url = new URL(window.location.href);
      if (choice === 'all') url.searchParams.delete('for');
      else url.searchParams.set('for', choice);
      history.replaceState({}, '', url.toString());
    } catch(_) {}

    // Dismiss picker with a brief fade
    picker.style.transition = 'opacity 0.4s ease';
    picker.style.opacity    = '0';
    setTimeout(() => picker.classList.add('is-dismissed'), 420);

    applySections(choice);
    updateNav(choice);
    showPill(choice);

    // Re-run flow line layout since sections may have just appeared
    setTimeout(() => {
      document.querySelectorAll('.dc-tabs').forEach(layoutFlowLine);
      syncPanelHeights();
    }, 500);
  }

  // Reset: show picker again, show all sections, clear storage
  function resetAudience() {
    localStorage.removeItem(STORE);
    try {
      const url = new URL(window.location.href);
      url.searchParams.delete('for');
      history.replaceState({}, '', url.toString());
    } catch(_) {}

    // Re-show all sections
    document.querySelectorAll('[data-audience]').forEach(sec => {
      sec.classList.add('aud-visible');
    });
    document.querySelectorAll('.main-nav a[href^="#"]').forEach(l => l.style.display = '');

    // Re-show picker
    picker.style.opacity    = '0';
    picker.classList.remove('is-dismissed');
    picker.style.transition = 'opacity 0.5s ease';
    void picker.offsetWidth; // reflow
    picker.style.opacity    = '1';

    if (pill) pill.style.display = 'none';

    // Scroll to picker smoothly
    picker.scrollIntoView({ behavior: 'smooth', block: 'center' });
  }

  // Wire card buttons
  picker.querySelectorAll('.ap-card[data-choice]').forEach(card => {
    card.addEventListener('click', () => setAudience(card.dataset.choice));
  });

  // Skip button → show everything
  if (skipBtn) skipBtn.addEventListener('click', () => setAudience('all'));

  // Pill reset button
  if (pill) pill.addEventListener('click', resetAudience);

  // ── On page load: check URL param → localStorage → nothing ──
  const params   = new URLSearchParams(window.location.search);
  const urlFor   = params.get('for');
  const saved    = localStorage.getItem(STORE);

  if (VALID.includes(urlFor)) {
    setAudience(urlFor, true);       // honour shared link, also save it
  } else if (VALID.includes(saved)) {
    setAudience(saved, false);       // restore saved preference silently
  } else {
    // No choice yet — show picker, show ALL sections in background
    // so the page isn't blank if someone scrolls past it
    document.querySelectorAll('[data-audience]').forEach(sec => {
      sec.classList.add('aud-visible');
      sec.style.opacity = '0.35';    // dimmed until a choice is made
    });
  }
})();

// ============================================================
// Wire lightbox controls
document.getElementById('lbClose')?.addEventListener('click', closeLightbox);
document.getElementById('lbPrev') ?.addEventListener('click', lbPrev);
document.getElementById('lbNext') ?.addEventListener('click', lbNext);

// Click outside image to close
document.getElementById('lightbox')?.addEventListener('click', e => {
  if (e.target === document.getElementById('lightbox')) closeLightbox();
});

// Keyboard navigation
document.addEventListener('keydown', e => {
  const lb = document.getElementById('lightbox');
  if (!lb || lb.style.display === 'none') return;
  if (e.key === 'Escape')     closeLightbox();
  if (e.key === 'ArrowLeft')  lbPrev();
  if (e.key === 'ArrowRight') lbNext();
});

// Touch swipe in lightbox
let lbTouchX = 0;
document.getElementById('lightbox')?.addEventListener('touchstart', e => {
  lbTouchX = e.touches[0].clientX;
}, { passive: true });
document.getElementById('lightbox')?.addEventListener('touchend', e => {
  const dx = e.changedTouches[0].clientX - lbTouchX;
  if (Math.abs(dx) > 40) dx < 0 ? lbNext() : lbPrev();
});
