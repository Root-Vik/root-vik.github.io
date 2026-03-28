/* ============================================
   DIGITAL GABBAR - Main JavaScript
   ============================================ */

// ---- Scroll: progress bar, nav, reveal, counters ----
function initScroll() {
  window.addEventListener('scroll', () => {
    const h = document.body.scrollHeight - innerHeight;
    const bar = document.getElementById('bar');
    if (bar) bar.style.width = (scrollY / h * 100) + '%';

    const nav = document.getElementById('nav');
    if (nav) nav.classList.toggle('scrolled', scrollY > 40);

    const btt = document.getElementById('btt');
    if (btt) btt.classList.toggle('show', scrollY > 500);

    document.querySelectorAll('.reveal').forEach(el => {
      if (el.getBoundingClientRect().top < innerHeight - 60) el.classList.add('in');
    });

    document.querySelectorAll('[data-c]').forEach(el => {
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
  });
  window.dispatchEvent(new Event('scroll'));
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

// ---- Contact form submission ----
// Email API base URL — points to WanderNest Holidays .NET app
// Local dev: https://localhost:7223 | Production: https://wandernestholidays.in (or your deployed URL)
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

  const nameEl = form ? form.querySelector('[name="name"]') : document.querySelector('#contact input[type="text"]');
  const emailEl = form ? form.querySelector('[name="email"]') : document.querySelector('#contact input[type="email"]');
  const messageEl = form ? form.querySelector('[name="message"]') : document.querySelector('#contact textarea');
  const serviceEl = form ? form.querySelector('[name="service"]') : document.querySelector('#contact select');
  const phoneEl = form ? form.querySelector('[name="phone"]') : null;
  const companyEl = form ? form.querySelector('[name="company"]') : null;
  const budgetEl = form ? form.querySelector('[name="budget"]') : null;

  const data = {
    name: nameEl?.value || '',
    email: emailEl?.value || '',
    message: messageEl?.value || '',
    service: serviceEl?.value || '',
    phone: phoneEl?.value || '',
    company: companyEl?.value || '',
    budget: budgetEl?.value || ''
  };

  const btn = form ? form.querySelector('.form-btn') : document.querySelector('.form-btn');
  if (btn) { btn.disabled = true; btn.textContent = 'Sending...'; }

  fetch(EMAIL_API + '/api/digi-gabbar/contact', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  })
  .then(res => {
    if (!res.ok) throw new Error('Server error');
    return res.json();
  })
  .then(() => {
    toast("Message sent — we'll be in touch within 24 hours.", 'success');
    inputs.forEach(i => i.value = '');
    if (form) form.querySelectorAll('select').forEach(s => s.selectedIndex = 0);
  })
  .catch(() => {
    // Fallback: open mailto if API is unreachable
    const subject = encodeURIComponent('New Inquiry from ' + data.name);
    const body = encodeURIComponent(
      'Name: ' + data.name + '\nEmail: ' + data.email +
      (data.phone ? '\nPhone: ' + data.phone : '') +
      (data.company ? '\nCompany: ' + data.company : '') +
      (data.service ? '\nService: ' + data.service : '') +
      (data.budget ? '\nBudget: ' + data.budget : '') +
      '\n\nMessage:\n' + data.message
    );
    window.open('mailto:rootvik23@gmail.com?subject=' + subject + '&body=' + body, '_self');
    toast('Opening your email client as fallback...', 'error');
  })
  .finally(() => {
    if (btn) { btn.disabled = false; btn.textContent = 'Send message \u2192'; }
  });
}

// ---- Active nav link ----
function setActiveNav() {
  const path = window.location.pathname;
  document.querySelectorAll('.nav-links a:not(.cta)').forEach(a => {
    const href = a.getAttribute('href');
    if (href && !href.startsWith('#')) {
      a.classList.toggle('active', path.endsWith(href) || (href === '/' && (path === '/' || path.endsWith('index.html'))));
    }
  });
}

// ---- Init ----
document.addEventListener('DOMContentLoaded', () => {
  initScroll();
  initTypewriter();
  setActiveNav();
});
