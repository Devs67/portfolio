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
  const obs = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (e.isIntersecting) { e.target.classList.add('is-visible'); obs.unobserve(e.target); }
    });
  }, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });
  revealEls.forEach(el => obs.observe(el));
} else {
  revealEls.forEach(el => el.classList.add('is-visible'));
}

// ── Hero rotating words ──────────────────────────────────────
const WORDS  = ['Observe', 'Design', 'Prototype', 'Iterate', 'Impact'];
const wordEl = document.getElementById('rotatorWord');
if (wordEl && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
  let idx = 0;
  setInterval(() => {
    wordEl.style.transition = 'opacity .3s ease, transform .3s ease';
    wordEl.style.opacity    = '0';
    wordEl.style.transform  = 'translateY(-10px)';
    setTimeout(() => {
      idx = (idx + 1) % WORDS.length;
      wordEl.textContent  = WORDS[idx];
      wordEl.style.opacity   = '0';
      wordEl.style.transform = 'translateY(12px)';
      void wordEl.offsetWidth;
      wordEl.style.opacity   = '1';
      wordEl.style.transform = 'translateY(0)';
    }, 320);
  }, 2400);
}

// ── Flow-line layout ─────────────────────────────────────────
function layoutFlowLine(tabsEl) {
  if (!tabsEl) return;
  const lineEl  = tabsEl.querySelector('.dc-line');
  const fillEl  = tabsEl.querySelector('.dc-line-fill');
  const arrowEl = tabsEl.querySelector('.dc-arrow');
  const tabs    = Array.from(tabsEl.querySelectorAll('.dc-tab'));
  if (!lineEl || !fillEl || !arrowEl || !tabs.length) return;
  const cr = tabsEl.getBoundingClientRect();
  const cx = tabs.map(t => {
    const b = t.querySelector('.dc-tab-badge').getBoundingClientRect();
    return { x: b.left + b.width/2 - cr.left, y: b.top + b.height/2 - cr.top };
  });
  const x   = cx[0].x;
  const top = cx[0].y;
  const bot = cx[cx.length-1].y;
  const ai  = Math.max(0, tabs.findIndex(t => t.classList.contains('is-active')));
  lineEl.style.cssText  = `left:${x}px;top:${top}px;height:${Math.max(0,bot-top)}px;`;
  fillEl.style.cssText  = `left:${x}px;top:${top}px;height:${Math.max(0,cx[ai].y-top)}px;`;
  arrowEl.style.cssText = `left:${x}px;top:${cx[ai].y}px;`;
}
function wireFlowTabs(tabsEl, onSelect) {
  if (!tabsEl) return;
  tabsEl.querySelectorAll('.dc-tab').forEach(tab => {
    tab.addEventListener('click', () => {
      tabsEl.querySelectorAll('.dc-tab').forEach(t => {
        t.classList.remove('is-active'); t.setAttribute('aria-selected','false');
      });
      tab.classList.add('is-active'); tab.setAttribute('aria-selected','true');
      onSelect(tab); layoutFlowLine(tabsEl);
    });
  });
  layoutFlowLine(tabsEl);
}
window.addEventListener('resize', () => document.querySelectorAll('.dc-tabs').forEach(layoutFlowLine));

// ── IB MYP Design Cycle ──────────────────────────────────────
const DC_DATA = {
  A:{ title:'Criterion A: Formulating the Blueprint', badge:'Criterion A', desc:'Students research a real-world client need. They identify existing designs, synthesise primary user reviews, and establish precise design specifications.', items:['Primary research & interviews','Existing solutions analysis','Design specification','Target user profile'] },
  B:{ title:'Criterion B: Generating & Selecting',   badge:'Criterion B', desc:'Students brainstorm multiple feasible designs, test each against the specification, then select and justify one final design with annotated planning drawings.', items:['Multiple design ideas','Specification testing','Justified final design','Annotated drawings'] },
  C:{ title:'Criterion C: Building the Prototype',   badge:'Criterion C', desc:'Students plan the making process in detail, then follow that plan to construct a functioning prototype safely using makerspace tools.', items:['Detailed planning chart','Tools & materials list','Functioning prototype','Process photo log'] },
  D:{ title:'Criterion D: Testing & Reflection',     badge:'Criterion D', desc:'Students test the finished solution against the original specification, gather user feedback, evaluate impact, and explain concrete improvements.', items:['Testing against specification','User feedback summary','Impact statement','Improvement recommendations'] },
};
function renderPanel(panelEl, d, extra='') {
  panelEl.style.animation='none'; void panelEl.offsetWidth; panelEl.style.animation='';
  panelEl.innerHTML=`
    <div class="dc-panel-top">
      <h3 class="dc-panel-title">${d.title}</h3>
      <span class="dc-panel-badge ${d.badgeHighlight||''}">${d.badge}</span>
    </div>
    <p class="dc-panel-desc">${d.desc}</p>
    <p class="dc-panel-label">Assessment deliverables &amp; milestones</p>
    <ul class="dc-checklist">${d.items.map(i=>`<li><span class="dc-check-icon">&#10003;</span>${i}</li>`).join('')}</ul>
    ${extra}`;
}
function initDesignCycle() {
  const tabsEl=document.getElementById('dcTabs'), panelEl=document.getElementById('dcPanel');
  if (!tabsEl||!panelEl) return;
  wireFlowTabs(tabsEl, tab => renderPanel(panelEl, DC_DATA[tab.dataset.criterion]));
  renderPanel(panelEl, DC_DATA.A); layoutFlowLine(tabsEl);
}
initDesignCycle();

// ── Journey ──────────────────────────────────────────────────
const JOURNEY = {
  shriram:{ title:'Makerspace & Design Facilitator — IB MYP Design', badge:'Cat 1 · The Shriram Academy · Jul 2025 — Present', badgeHighlight:'dc-panel-badge--highlight', desc:'Run the IB MYP Digital & Product Design programme end to end — from curriculum mapping through daily facilitation to assessment.', items:['Plan & deliver MYP Design units through the IB Design Cycle','Independently led 3 units, co-facilitated 2, ran 1 solo','Design formative & summative assessment to MYP criteria','Give criterion-referenced feedback to support growth','Lead curriculum review & programme mapping across MY grades','Embed ATL Skills, Learner Profile & Global Contexts daily','Run makerspace sessions: Robotics, 3D Design, Coding, Prototyping','Guide learners through reflective design-process journals'], link:'https://drive.google.com/file/d/1lKdmCfK3jOxRQvyKl7qOg6lLk5WhMMPE/view?usp=sharing', linkLabel:'View Cat 1 Certificate ↗' },
  creya:{ title:'Education Program Manager', badge:'Creya Learning and Research · Aug 2023 — Jul 2025', desc:'Took STEM program delivery from pilot to a 10+ school network across two states.', items:['Led STEM rollout across 10+ schools in Telangana & AP','Trained & mentored educators in Robotics, IoT, Coding','Built and ran the Design Thinking teacher curriculum','Managed stakeholder relationships with school leadership','Mentored students for the i3R2 Make-a-thon, IIT Chennai','Mentored teams for the Junior Make-a-thon','Designed & delivered hands-on STEM camps, ages 6–15','Tracked program quality with data-driven evaluation'] },
  simpliforge:{ title:'Design Engineer', badge:'Simpliforge Creations · Mar — Jul 2023', desc:'Hands-on mechanical and structural design for concrete 3D printing.', items:['Designed architectural structures for concrete 3D printing','Modelled components in SolidWorks and Fusion 360','Produced 2D manufacturing drawings in AutoCAD','Validated designs against print-process constraints','Iterated geometry based on print trial feedback'] },
  evobi:{ title:'Robotics Mentor Intern', badge:'Evobi Automations / Atal Tinkering Lab · Dec 2022 — Mar 2023', desc:'The starting point — first time teaching, and the moment I realised I loved it as much as building.', items:['Delivered Robotics & IoT sessions across partner schools','Built hands-on learning experiences for new students','Co-planned lessons with classroom teachers','Mentored students through their first working prototypes'] },
};
function initJourney() {
  const tabsEl=document.getElementById('journeyTabs'), panelEl=document.getElementById('journeyPanel');
  if (!tabsEl||!panelEl) return;
  wireFlowTabs(tabsEl, tab => {
    const d=JOURNEY[tab.dataset.role];
    const link=d.link?`<a href="${d.link}" class="dc-panel-link" target="_blank" rel="noopener">${d.linkLabel}</a>`:'';
    renderPanel(panelEl, d, link);
  });
  const first=tabsEl.querySelector('.dc-tab.is-active');
  const d=JOURNEY[first.dataset.role];
  const link=d.link?`<a href="${d.link}" class="dc-panel-link" target="_blank" rel="noopener">${d.linkLabel}</a>`:'';
  renderPanel(panelEl, d, link);
  layoutFlowLine(tabsEl);
}
initJourney();

function syncPanelHeights() {
  document.querySelectorAll('.dc-grid').forEach(grid => {
    const tabs=grid.querySelector('.dc-tabs'), panel=grid.querySelector('.dc-panel');
    if (tabs&&panel) panel.style.maxHeight=tabs.offsetHeight+'px';
  });
}
function relayout() { document.querySelectorAll('.dc-tabs').forEach(layoutFlowLine); syncPanelHeights(); }
window.addEventListener('resize', relayout);
window.addEventListener('load', relayout);
if (document.fonts?.ready) document.fonts.ready.then(relayout);
setTimeout(relayout, 600); setTimeout(relayout, 1400);

// ── Pull cord — drag to trigger, entrance animation on load ──
function initPullCord() {
  const cord   = document.getElementById('pullCord');
  const rope   = cord?.querySelector('.cord-rope');
  const handle = cord?.querySelector('.cord-handle');
  const hint   = document.getElementById('cordHint');
  if (!cord||!rope||!handle) return;

  const STORE     = 'db-dark-mode';
  const THRESHOLD = 52;
  const MAX_DRAG  = 88;
  let isDark   = localStorage.getItem(STORE) === '1';
  let dragging = false;
  let startY   = 0;

  cord.style.touchAction = 'none'; // no scroll-hijack during drag

  cord.addEventListener('pointerdown', e => {
    e.preventDefault();
    cord.setPointerCapture(e.pointerId);
    dragging = true;
    startY   = e.clientY;
    // Pause entrance animations so drag feel is instant
    rope.style.animation   = 'none';
    handle.style.animation = 'none';
    rope.style.transition   = 'none';
    handle.style.transition = 'none';
  });

  cord.addEventListener('pointermove', e => {
    if (!dragging) return;
    const dy      = Math.max(0, e.clientY - startY);
    const clamped = Math.min(dy, MAX_DRAG);
    rope.style.transformOrigin = 'top center';
    rope.style.transform   = `scaleY(${1 + clamped/90})`;
    handle.style.transform = `translateY(${clamped * 0.72}px)`;
    // Handle glows clay when past threshold
    handle.style.borderColor  = dy >= THRESHOLD ? 'var(--clay)' : '';
    handle.style.background   = dy >= THRESHOLD ? 'var(--clay)' : '';
  });

  cord.addEventListener('pointerup', e => {
    if (!dragging) return;
    dragging = false;
    const dy = Math.max(0, e.clientY - startY);
    // Spring back
    rope.style.transition   = 'transform 0.4s cubic-bezier(0.16,1,0.3,1)';
    handle.style.transition = 'transform 0.4s cubic-bezier(0.16,1,0.3,1), border-color 0.2s ease, background 0.2s ease';
    rope.style.transform    = '';
    handle.style.transform  = '';
    handle.style.borderColor = '';
    handle.style.background  = '';
    if (dy >= THRESHOLD) applyDark(!isDark, true);
  });

  cord.addEventListener('pointercancel', () => {
    dragging = false;
    rope.style.transition = handle.style.transition = '';
    rope.style.transform  = handle.style.transform  = '';
    handle.style.borderColor = handle.style.background = '';
  });

  function applyDark(dark, flicker=false) {
    isDark = dark;
    localStorage.setItem(STORE, dark ? '1' : '0');
    cord.setAttribute('aria-pressed', String(dark));
    cord.classList.toggle('has-pulled', dark);
    if (hint) hint.textContent = dark ? '' : (window.innerWidth <= 720 ? 'theme' : 'pull');
    if (flicker && !window.matchMedia('(prefers-reduced-motion:reduce)').matches) {
      document.body.classList.add('is-flickering');
      setTimeout(() => document.body.classList.remove('is-flickering'), 420);
    }
    setTimeout(() => document.documentElement.classList.toggle('dark-mode', dark), flicker ? 140 : 0);
  }

  // Mobile: dock cord just below sticky header
  function adaptViewport() {
    const isMobile = window.innerWidth <= 720;
    if (hint) hint.textContent = isMobile ? 'theme' : (isDark ? '' : 'pull');
    if (isMobile) {
      const hdr = document.querySelector('.site-header');
      if (hdr) cord.style.top = hdr.offsetHeight + 'px';
    } else {
      cord.style.top = '';
    }
  }
  window.addEventListener('resize', adaptViewport);
  adaptViewport();

  if (isDark) applyDark(true, false);
  if (localStorage.getItem(STORE)===null && window.matchMedia('(prefers-color-scheme:dark)').matches) applyDark(true, false);
}
initPullCord();

// ── LinkedIn carousel ────────────────────────────────────────
function initCarousel() {
  const track=document.getElementById('liTrack'), prev=document.getElementById('liPrev'), next=document.getElementById('liNext');
  const dots=Array.from(document.querySelectorAll('.li-dot'));
  if (!track||!prev||!next) return;
  const slides=track.querySelectorAll('.li-slide'), total=slides.length;
  let cur=0, timer=null;
  function goTo(n, user=false) {
    cur=((n%total)+total)%total;
    track.style.transform=`translateX(-${cur*100}%)`;
    dots.forEach((d,i)=>d.classList.toggle('is-active',i===cur));
    if (user) { clearInterval(timer); timer=setInterval(()=>goTo(cur+1),5000); }
  }
  prev.addEventListener('click',()=>goTo(cur-1,true));
  next.addEventListener('click',()=>goTo(cur+1,true));
  dots.forEach((d,i)=>d.addEventListener('click',()=>goTo(i,true)));
  let tx=0;
  const vp=document.getElementById('liViewport');
  if (vp) {
    vp.addEventListener('touchstart',e=>{tx=e.touches[0].clientX;},{passive:true});
    vp.addEventListener('touchend',e=>{const dx=e.changedTouches[0].clientX-tx;if(Math.abs(dx)>40)goTo(cur+(dx<0?1:-1),true);});
    const w=document.querySelector('.li-carousel-wrap');
    if (w) { w.addEventListener('mouseenter',()=>clearInterval(timer)); w.addEventListener('mouseleave',()=>{timer=setInterval(()=>goTo(cur+1),5000);}); }
  }
  goTo(0); timer=setInterval(()=>goTo(cur+1),5000);
}
initCarousel();

// ── Photo gallery carousel ───────────────────────────────────
// ── HOW TO ADD A PHOTO ──────────────────────────────────────
//  1. Upload compressed image to images/gallery/  (name it 6.jpg, 7.jpg …)
//  2. Add one line to GALLERY_DATA below
//  3. Commit & push — done.
const GALLERY_DATA = [
  { n:1, title:'MYP Design in Action',                  tag:'IB MYP Design',  desc:'Learners working through the IB Design Cycle — inquiry, ideation and iteration happening in a real classroom session.' },
  { n:2, title:'Design Thinking at the Shriram Academy', tag:'IB MYP Design',  desc:'Students documenting and reflecting on their design process through structured journals — a core part of MYP criterion work.' },
  { n:3, title:'Autonomous Obstacle-Avoiding Car',       tag:'Robotics',        desc:'An ultrasonic-sensor car that scans 180° for obstacles and reroutes its own path — designed, built and programmed by students.' },
  { n:4, title:'Summer STEM Camp',                       tag:'Summer Camp',     desc:'A hands-on summer camp for younger learners — first encounters with circuits, coding and basic robotics through play-based making.' },
  { n:5, title:'WRO 2025 — Aerocity, Hyderabad',        tag:'Competition',     desc:'The rover our team built for the World Robot Olympiad 2025, held at Aerocity Hyderabad — guided from concept to competition floor.' },
  // { n:6, title:'...', tag:'...', desc:'...' },
];

function initPhotoCarousel() {
  const mount = document.getElementById('galleryMount');
  if (!mount) return;
  if (!GALLERY_DATA.length) {
    mount.innerHTML='<div class="gallery-empty"><p>Upload photos to <code>images/gallery/</code> and fill in <code>GALLERY_DATA</code> in <code>js/main.js</code>.</p></div>';
    return;
  }
  const total=GALLERY_DATA.length;
  let cur=0, timer=null;
  mount.innerHTML=`
    <div class="photo-carousel-wrap">
      <button class="pc-arrow pc-arrow--prev" id="pcPrev" aria-label="Previous photo">&#8592;</button>
      <div class="photo-viewport" id="photoViewport">
        <div class="photo-track" id="photoTrack">
          ${GALLERY_DATA.map((item,i)=>`
            <div class="photo-slide">
              <figure class="photo-card">
                <div class="photo-card-frame">
                  <img class="photo-card-img" src="images/gallery/${item.n}.jpg" alt="${item.title}" loading="${i===0?'eager':'lazy'}">
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
            </div>`).join('')}
        </div>
      </div>
      <button class="pc-arrow pc-arrow--next" id="pcNext" aria-label="Next photo">&#8594;</button>
    </div>
    <div class="photo-dots">${GALLERY_DATA.map((_,i)=>`<button class="photo-dot${i===0?' is-active':''}" aria-label="Photo ${i+1}"></button>`).join('')}</div>`;
  const track=document.getElementById('photoTrack');
  const dotBtns=Array.from(mount.querySelectorAll('.photo-dot'));
  function goTo(n,user=false) {
    cur=((n%total)+total)%total;
    track.style.transform=`translateX(-${cur*100}%)`;
    dotBtns.forEach((d,i)=>d.classList.toggle('is-active',i===cur));
    if (user) { clearInterval(timer); timer=setInterval(()=>goTo(cur+1),5500); }
  }
  document.getElementById('pcPrev').addEventListener('click',()=>goTo(cur-1,true));
  document.getElementById('pcNext').addEventListener('click',()=>goTo(cur+1,true));
  dotBtns.forEach((btn,i)=>btn.addEventListener('click',()=>goTo(i,true)));
  const vp=document.getElementById('photoViewport');
  let tx=0;
  vp.addEventListener('touchstart',e=>{tx=e.touches[0].clientX;},{passive:true});
  vp.addEventListener('touchend',e=>{const dx=e.changedTouches[0].clientX-tx;if(Math.abs(dx)>40)goTo(cur+(dx<0?1:-1),true);});
  const wrap=mount.querySelector('.photo-carousel-wrap');
  wrap.addEventListener('mouseenter',()=>clearInterval(timer));
  wrap.addEventListener('mouseleave',()=>{timer=setInterval(()=>goTo(cur+1),5500);});
  goTo(0); timer=setInterval(()=>goTo(cur+1),5500);
}
initPhotoCarousel();

// ── Nav scrollspy ─────────────────────────────────────────────
const navLinks   = Array.from(document.querySelectorAll('.main-nav a[href^="#"]'));
const navSections = navLinks.map(l=>document.querySelector(l.getAttribute('href'))).filter(Boolean);
if ('IntersectionObserver' in window && navSections.length) {
  const spy = new IntersectionObserver(
    entries => entries.forEach(e => {
      if (e.isIntersecting) navLinks.forEach(l=>l.classList.toggle('is-active', l.getAttribute('href')==='#'+e.target.id));
    }),
    { rootMargin:'-45% 0px -50% 0px', threshold:0 }
  );
  navSections.forEach(s=>spy.observe(s));
}

// ── Scroll progress ring ──────────────────────────────────────
const spFill = document.getElementById('spFill');
const spIcon = document.getElementById('spIcon');
const spEl   = document.getElementById('scrollProgress');
function updateProgress() {
  if (!spFill) return;
  const doc = document.documentElement;
  const pct = Math.min(1, Math.max(0, window.scrollY / Math.max(1, doc.scrollHeight-doc.clientHeight)));
  spFill.style.strokeDashoffset = String(150.8*(1-pct));
  const done=pct>0.985;
  spEl?.classList.toggle('is-complete', done);
  if (spIcon) spIcon.innerHTML=done?'&#10003;':'&#8595;';
}
window.addEventListener('scroll', updateProgress, {passive:true});
window.addEventListener('resize', updateProgress);
updateProgress();

// ── Footer year ───────────────────────────────────────────────
const yearEl = document.getElementById('year');
if (yearEl) yearEl.textContent = new Date().getFullYear();

// ── Certificate modal ─────────────────────────────────────────
(function initCertModal() {
  const modal    = document.getElementById('certModal');
  const backdrop = document.getElementById('certModalBackdrop');
  const closeBtn = document.getElementById('certModalClose');
  const body     = document.getElementById('certModalBody');
  const link     = document.getElementById('certModalLink');
  if (!modal) return;

  function open(contentHtml, href) {
    body.innerHTML = contentHtml;
    link.href      = href;
    modal.style.display = 'flex';
    document.body.style.overflow = 'hidden';
    closeBtn.focus();
  }
  function close() {
    modal.style.display = 'none';
    document.body.style.overflow = '';
    body.innerHTML = '';
    if (link) link.style.display = '';
  }

  // Google Certified Educator — show badge image large
  document.getElementById('openGoogleCert')?.addEventListener('click', () => {
    open(
      `<img src="https://api.accredible.com/v1/frontend/credential_website_embed_image/certificate/186986143"
            alt="Google Certified Educator certificate" style="max-width:90%;max-height:70vh;object-fit:contain;display:block;margin:auto;padding:24px;">`,
      'https://edu.google.accredible.com/3bdd7f44-293e-4185-a8ec-5363ed500b86#acc.gDWCEK32'
    );
  });

  // CIPET Mechanical CAD — placeholder until image/link is added
  document.getElementById('openCipetCert')?.addEventListener('click', () => {
    open(
      `<div style="display:flex;flex-direction:column;align-items:center;justify-content:center;gap:16px;padding:48px 32px;min-height:300px;">
        <div style="font-family:var(--font-mono);font-size:40px;color:#2C3E50;font-weight:500;letter-spacing:.06em;">CAD</div>
        <p style="font-family:var(--font-mono);font-size:13px;color:var(--steel);text-align:center;line-height:1.6;max-width:320px;">
          Mechanical CAD Course certificate from CIPET.<br>Certificate image will be uploaded here soon.
        </p>
      </div>`,
      '#'
    );
    // hide the "open original" link since there's no link yet
    document.getElementById('certModalLink').style.display = 'none';
  });

  // Cat 1 — show Drive PDF preview in iframe
  document.getElementById('openCat1Cert')?.addEventListener('click', () => {
    open(
      `<iframe src="https://drive.google.com/file/d/1lKdmCfK3jOxRQvyKl7qOg6lLk5WhMMPE/preview"
               title="IB CAT 1 Certificate" allow="autoplay" loading="lazy"></iframe>`,
      'https://drive.google.com/file/d/1lKdmCfK3jOxRQvyKl7qOg6lLk5WhMMPE/view?usp=sharing'
    );
  });

  closeBtn?.addEventListener('click', close);
  backdrop?.addEventListener('click', close);
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape' && modal.style.display !== 'none') close();
  });
})();
