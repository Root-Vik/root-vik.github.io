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
  const words = ['Angular SPAs', '.NET Core APIs', 'Cross-platform Apps', 'SaaS Platforms', 'Enterprise Software', 'React Dashboards'];
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

// ---- Hero 3D tilt on mouse (smooth, CSS-driven) ----
function initHeroTilt() {
  const hero = document.querySelector('.hero');
  const brand = document.querySelector('.hero-3d');
  if (!hero || !brand || !matchMedia('(pointer:fine)').matches) return;

  let tx = 0, ty = 0, cx = 0, cy = 0;

  hero.addEventListener('mousemove', e => {
    const r = brand.getBoundingClientRect();
    const nx = (e.clientX - r.left) / r.width - 0.5;
    const ny = (e.clientY - r.top) / r.height - 0.5;
    tx = ny * -12;
    ty = nx * 14;
  });

  hero.addEventListener('mouseleave', () => { tx = 0; ty = 0; });

  (function tick() {
    cx += (tx - cx) * 0.07;
    cy += (ty - cy) * 0.07;
    brand.style.transform = `perspective(1200px) rotateX(${cx.toFixed(2)}deg) rotateY(${cy.toFixed(2)}deg)`;
    requestAnimationFrame(tick);
  })();
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
    if (e.target.closest('a,button,[onclick],.btn,.service-row,.team-card,.hire-card,.d-cell'))
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

// ---- Scroll fx lines ----
function initScrollFx() {
  let lastY = 0, cooldown = false;
  window.addEventListener('scroll', () => {
    if (cooldown) return;
    const delta = Math.abs(scrollY - lastY);
    if (delta < 40) return;
    lastY = scrollY;
    cooldown = true;
    setTimeout(() => cooldown = false, 120);

    const count = Math.random() > 0.4 ? 2 : 1;
    for (let i = 0; i < count; i++) {
      setTimeout(() => {
        const line = document.createElement('div');
        line.className = 'scroll-fx-line';
        line.style.top = (Math.random() * innerHeight * 0.8 + innerHeight * 0.1) + 'px';
        document.body.appendChild(line);
        setTimeout(() => line.remove(), 550);
      }, i * 60);
    }
  }, { passive: true });
}

// ---- Init ----
document.addEventListener('DOMContentLoaded', () => {
  initScroll();
  initTypewriter();
  initHeroTilt();
  setActiveNav();
  initCustomCursor();
  initClickRipple();
  initScrollFx();
});
