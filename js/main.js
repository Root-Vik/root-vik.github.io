/* ============================================
   DIGI GABBAR — Main JS
   Pure vanilla. No libraries. Buttery smooth.
   ============================================ */

// ---- Scroll: progress bar, nav, reveal, counters ----
function initScroll() {
  const bar = document.getElementById('bar');
  const nav = document.getElementById('nav');
  const btt = document.getElementById('btt');
  const reveals = document.querySelectorAll('.reveal');
  const counters = document.querySelectorAll('[data-c]');

  const onScroll = () => {
    const h = document.body.scrollHeight - innerHeight;
    if (bar) bar.style.width = (scrollY / h * 100) + '%';
    if (nav) nav.classList.toggle('scrolled', scrollY > 40);
    if (btt) btt.classList.toggle('show', scrollY > 500);

    reveals.forEach(el => {
      if (el.getBoundingClientRect().top < innerHeight - 60) el.classList.add('in');
    });

    counters.forEach(el => {
      if (el.dataset.done) return;
      if (el.getBoundingClientRect().top < innerHeight - 40) {
        el.dataset.done = 1;
        const t = +el.dataset.c;
        const sfx = el.dataset.sfx || '+';
        let v = 0;
        const step = () => {
          v = Math.min(v + Math.ceil(t / 40), t);
          el.textContent = v + sfx;
          if (v < t) requestAnimationFrame(step);
        };
        step();
      }
    });
  };

  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();
}

// ---- Typewriter ----
function initTypewriter() {
  const el = document.getElementById('tw');
  if (!el) return;
  const words = ['Premium Product Systems', '3D Interface Experiences', 'Social Schedulr Launch', 'Automation Workflows', 'High-Performance Web Apps', 'More tools coming soon'];
  let wi = 0, ci = 0, del = false;
  function tw() {
    const w = words[wi];
    if (!del) {
      el.textContent = w.slice(0, ++ci);
      if (ci === w.length) { del = true; setTimeout(tw, 1600); return; }
    } else {
      el.textContent = w.slice(0, --ci);
      if (ci === 0) { del = false; wi = (wi + 1) % words.length; }
    }
    setTimeout(tw, del ? 45 : 85);
  }
  tw();
}

// ---- Hero 3D orb pointer movement ----
function initHeroOrb() {
  const wrap = document.getElementById('orbWrap');
  if (!wrap || !matchMedia('(pointer:fine)').matches) return;

  let tx = 0;
  let ty = 0;
  let cx = 0;
  let cy = 0;

  document.addEventListener('mousemove', e => {
    const x = (e.clientX / innerWidth - 0.5) * 2;
    const y = (e.clientY / innerHeight - 0.5) * 2;
    tx = x * 14;
    ty = y * -12;
  });

  (function tick() {
    cx += (tx - cx) * 0.08;
    cy += (ty - cy) * 0.08;
    wrap.style.transform = `rotateY(${cx.toFixed(2)}deg) rotateX(${cy.toFixed(2)}deg)`;
    requestAnimationFrame(tick);
  })();
}

// ---- Projects 3D horizontal drag + depth ----
function initProjects3D() {
  const track = document.getElementById('projTrack');
  if (!track) return;

  let isDown = false;
  let startX = 0;
  let startLeft = 0;

  const pointerDown = e => {
    isDown = true;
    track.classList.add('grabbing');
    startX = (e.touches ? e.touches[0].pageX : e.pageX);
    startLeft = track.scrollLeft;
  };

  const pointerMove = e => {
    if (!isDown) return;
    const x = (e.touches ? e.touches[0].pageX : e.pageX);
    const walk = (x - startX) * 1.35;
    track.scrollLeft = startLeft - walk;
  };

  const pointerUp = () => {
    isDown = false;
    track.classList.remove('grabbing');
  };

  track.addEventListener('mousedown', pointerDown);
  track.addEventListener('touchstart', pointerDown, { passive: true });
  window.addEventListener('mousemove', pointerMove, { passive: true });
  window.addEventListener('touchmove', pointerMove, { passive: true });
  window.addEventListener('mouseup', pointerUp);
  window.addEventListener('touchend', pointerUp);

  const cards = Array.from(track.querySelectorAll('.proj-card'));
  const updateDepth = () => {
    const center = track.scrollLeft + track.clientWidth / 2;
    cards.forEach(card => {
      const cardCenter = card.offsetLeft + card.clientWidth / 2;
      const diff = (cardCenter - center) / track.clientWidth;
      const depth = Number(card.dataset.depth || 1);
      const rotY = diff * -18;
      const rotX = Math.abs(diff) * 7;
      const z = Math.max(0, 60 - Math.abs(diff) * 130) * depth * 0.28;
      card.style.transform = `translateZ(${z.toFixed(1)}px) rotateY(${rotY.toFixed(2)}deg) rotateX(${rotX.toFixed(2)}deg)`;
    });
  };

  track.addEventListener('scroll', updateDepth, { passive: true });
  window.addEventListener('resize', updateDepth);
  updateDepth();
}

// ---- Profile 3D card reacts to scroll and mouse ----
function initProfile3D() {
  const card = document.getElementById('profile3dCard');
  if (!card) return;

  let mx = 0;
  let my = 0;

  const updateScroll = () => {
    const rect = card.getBoundingClientRect();
    const progress = (innerHeight - rect.top) / (innerHeight + rect.height);
    const baseY = -20 + progress * 220;
    const clampedY = Math.max(0, Math.min(180, baseY));
    card.style.setProperty('--profile-y', clampedY.toFixed(2));
  };

  if (matchMedia('(pointer:fine)').matches) {
    card.addEventListener('mousemove', e => {
      const r = card.getBoundingClientRect();
      const x = (e.clientX - r.left) / r.width - 0.5;
      const y = (e.clientY - r.top) / r.height - 0.5;
      mx = x * 16;
      my = y * -16;
      card.style.setProperty('--profile-x', my.toFixed(2));
      card.style.setProperty('--profile-z', mx.toFixed(2));
    });
    card.addEventListener('mouseleave', () => {
      mx = 0;
      my = 0;
      card.style.setProperty('--profile-x', '0');
      card.style.setProperty('--profile-z', '0');
    });
  }

  window.addEventListener('scroll', updateScroll, { passive: true });
  updateScroll();
}


// ---- Mobile drawer ----
function openDrawer() {
  document.getElementById('drawer').classList.add('open');
  document.body.style.overflow = 'hidden';
}
function closeDrawer() {
  document.getElementById('drawer').classList.remove('open');
  document.body.style.overflow = '';
}

// ---- Toast ----
let tt;
function toast(msg, type = '') {
  const el = document.getElementById('toast');
  if (!el) return;
  el.textContent = msg;
  el.className = 'show';
  if (type) el.classList.add('toast-' + type);
  clearTimeout(tt);
  tt = setTimeout(() => el.className = '', 2800);
}

// ---- Smooth scroll ----
function goto(sel) {
  document.querySelector(sel)?.scrollIntoView({ behavior: 'smooth' });
}

// ---- Contact form ----
const EMAIL_API = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1'
  ? 'https://localhost:7223'
  : 'https://wandernestholidays.in';

function submitForm() {
  const form = document.getElementById('contactForm');
  const inputs = form ? form.querySelectorAll('input,textarea') : document.querySelectorAll('#contact input,#contact textarea');
  if ([...inputs].some(i => i.hasAttribute('required') && !i.value.trim())) {
    toast('Please fill all required fields.', 'error');
    return;
  }

  const get = n => (form ? form.querySelector(`[name="${n}"]`) : null)?.value || '';
  const data = { name: get('name'), email: get('email'), message: get('message'), service: get('service'), phone: get('phone'), company: get('company'), budget: get('budget') };

  const btn = form ? form.querySelector('.form-btn') : document.querySelector('.form-btn');
  if (btn) { btn.disabled = true; btn.textContent = 'Sending...'; }

  fetch(EMAIL_API + '/api/digi-gabbar/contact', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  })
  .then(res => { if (!res.ok) throw new Error(); return res.json(); })
  .then(() => {
    toast("Message sent — we'll be in touch within 24 hours.", 'success');
    inputs.forEach(i => i.value = '');
    if (form) form.querySelectorAll('select').forEach(s => s.selectedIndex = 0);
  })
  .catch(() => {
    const subject = encodeURIComponent('New Inquiry from ' + data.name);
    const body = encodeURIComponent(`Name: ${data.name}\nEmail: ${data.email}\nService: ${data.service}\n\nMessage:\n${data.message}`);
    window.open('mailto:rootvik23@gmail.com?subject=' + subject + '&body=' + body, '_self');
    toast('Opening your email client as fallback...', 'error');
  })
  .finally(() => { if (btn) { btn.disabled = false; btn.textContent = 'Send message \u2192'; } });
}

// ---- Active nav ----
function setActiveNav() {
  const path = window.location.pathname;
  document.querySelectorAll('.nav-links a:not(.cta)').forEach(a => {
    const href = a.getAttribute('href');
    if (href && !href.startsWith('#')) {
      a.classList.toggle('active', path.endsWith(href) || (href === '/' && (path === '/' || path.endsWith('index.html'))));
    }
  });
}

// ---- Custom HUD Cursor ----
function initCustomCursor() {
  if (!matchMedia('(pointer:fine)').matches) return;

  const dot = document.createElement('div');
  dot.id = 'cursor-dot';
  const ring = document.createElement('div');
  ring.id = 'cursor-ring';
  document.body.appendChild(dot);
  document.body.appendChild(ring);

  let mx = -200, my = -200, rx = -200, ry = -200;

  document.addEventListener('mousemove', e => {
    mx = e.clientX; my = e.clientY;
    dot.style.left = mx + 'px';
    dot.style.top = my + 'px';
  });

  (function tick() {
    rx += (mx - rx) * 0.10;
    ry += (my - ry) * 0.10;
    ring.style.left = rx.toFixed(1) + 'px';
    ring.style.top = ry.toFixed(1) + 'px';
    requestAnimationFrame(tick);
  })();

  document.addEventListener('mouseover', e => {
    if (e.target.closest('a,button,[onclick],.btn,.bc,.proj-card,.team-card,.tool-card,.profile-3d-card'))
      document.body.classList.add('cursor-over');
    else
      document.body.classList.remove('cursor-over');
  });

  document.addEventListener('mousedown', () => {
    document.body.classList.add('cursor-click');
    setTimeout(() => document.body.classList.remove('cursor-click'), 280);
  });
}

// ---- Click ripple ----
function initClickRipple() {
  document.addEventListener('click', e => {
    const r = document.createElement('div');
    r.className = 'click-ripple';
    r.style.left = e.clientX + 'px';
    r.style.top = e.clientY + 'px';
    document.body.appendChild(r);
    setTimeout(() => r.remove(), 750);
  });
}


// ---- Init ----
document.addEventListener('DOMContentLoaded', () => {
  initScroll();
  initTypewriter();
  initHeroOrb();
  initProjects3D();
  initProfile3D();
  setActiveNav();
  initCustomCursor();
  initClickRipple();
});
