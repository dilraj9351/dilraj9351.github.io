// script.js

document.addEventListener('DOMContentLoaded', () => {
  /* ---------- Reveal on scroll ---------- */
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('in-view');
      }
    });
  }, { threshold: 0.12 });

  document.querySelectorAll('.reveal').forEach(el => observer.observe(el));

  /* ---------- Dark mode toggle ---------- */
  const themeToggle = document.getElementById('themeToggle');
  const root = document.documentElement;
  const saved = localStorage.getItem('site-theme');

  function applyTheme(t){
    if (t === 'dark'){
      root.setAttribute('data-theme', 'dark');
      themeToggle.textContent = '☀️';
      themeToggle.setAttribute('aria-pressed','true');
    } else {
      root.removeAttribute('data-theme');
      themeToggle.textContent = '🌙';
      themeToggle.setAttribute('aria-pressed','false');
    }
  }

  // initial
  if (saved) applyTheme(saved);
  else {
    // respect prefers-color-scheme if no saved
    const prefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
    applyTheme(prefersDark ? 'dark' : 'light');
  }

  themeToggle.addEventListener('click', () => {
    const isDark = root.getAttribute('data-theme') === 'dark';
    const next = isDark ? 'light' : 'dark';
    applyTheme(next);
    localStorage.setItem('site-theme', next);
  });

  /* ---------- Contact Form (Formspree) ---------- */
  const form = document.getElementById('contactForm');
  const status = document.getElementById('formStatus');

  function showToast(msg, ok = true){
    status.textContent = msg;
    status.style.background = ok ? '#16a34a' : '#c53030';
    status.hidden = false;
    setTimeout(()=> status.hidden = true, 3500);
  }

  if (form){
    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      const data = new FormData(form);

      try {
        const res = await fetch(form.action, {
          method: 'POST',
          body: data,
          headers: { 'Accept': 'application/json' }
        });

        if (res.ok){
          showToast('Message sent successfully ✅');
          form.reset();
        } else {
          showToast('Could not send. Try again later.', false);
        }
      } catch (err){
        console.error(err);
        showToast('Network error. Try again.', false);
      }
    });
  }

  /* ---------- Small: ensure whatsapp visible on load ---------- */
  const whatsapp = document.getElementById('whatsappBtn');
  if (whatsapp) whatsapp.style.display = 'flex';
});
// NAVBAR: toggle mobile menu
const navToggle = document.getElementById('navToggle');
const navLinks = document.getElementById('navLinks');
navToggle?.addEventListener('click', () => {
  navLinks.classList.toggle('show');
});

// add scrolled class when user scrolls
const siteNav = document.querySelector('.site-nav');
window.addEventListener('scroll', () => {
  if(window.scrollY > 30) siteNav?.classList.add('scrolled');
  else siteNav?.classList.remove('scrolled');
});

// highlight active nav link while scrolling to sections
const navAnchors = document.querySelectorAll('.nav-link');
const sections = Array.from(navAnchors).map(a => document.querySelector(a.getAttribute('href')));
function onScrollActive(){
  const y = window.scrollY + 120; // offset to detect section
  sections.forEach((sec, i) => {
    if(!sec) return;
    const top = sec.offsetTop;
    const bottom = top + sec.offsetHeight;
    if(y >= top && y < bottom){
      navAnchors.forEach(a => a.classList.remove('active'));
      navAnchors[i].classList.add('active');
    }
  });
}
window.addEventListener('scroll', onScrollActive);
document.addEventListener('DOMContentLoaded', onScrollActive);
// STEP 4.1 — Close mobile menu on link click
document.querySelectorAll('.nav-link').forEach(link => {
  link.addEventListener('click', () => {
    const nav = document.getElementById('navLinks');
    if (nav && nav.classList.contains('show')) {
      nav.classList.remove('show');
    }
  });
});
// STEP 4.2 — Close mobile menu when clicking outside
document.addEventListener('click', (e) => {
  const nav = document.getElementById('navLinks');
  const toggle = document.getElementById('navToggle');
  if (!nav || !toggle) return;

  // if menu is open and click target is outside both nav panel and toggle button -> close
  if (nav.classList.contains('show') && !nav.contains(e.target) && !toggle.contains(e.target)) {
    nav.classList.remove('show');
  }
});
// reveal on scroll
(function(){
  const obs = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if(entry.isIntersecting){
        entry.target.classList.add('revealed');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.15 });

  document.querySelectorAll('.reveal').forEach(el => obs.observe(el));
})();
/* ===== Contact: success modal + toast handling ===== */
(function(){
  const form = document.getElementById('contactForm');
  const toast = document.getElementById('successToast');
  const modal = document.getElementById('successModal');
  const closeBtn = document.getElementById('closeSuccess');
  const okBtn = document.getElementById('successOk');

  function showToast(msg) {
    if(!toast) return;
    toast.textContent = msg || 'Message sent — thanks!';
    toast.classList.add('show');
    setTimeout(()=> toast.classList.remove('show'), 3500);
  }

  function showModal() {
    if(!modal) return;
    modal.setAttribute('aria-hidden', 'false');
  }
  function hideModal() {
    if(!modal) return;
    modal.setAttribute('aria-hidden', 'true');
  }

  // attach close buttons
  closeBtn?.addEventListener('click', hideModal);
  okBtn?.addEventListener('click', hideModal);
  modal?.addEventListener('click', (e) => {
    if(e.target === modal) hideModal(); // click backdrop to close
  });

  // If you already have a custom form handler: we still intercept to show UX
  if(form){
    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      // show temporary sending state (if you have #formStatus)
      const statusEl = document.getElementById('formStatus') || document.getElementById('status') || null;
      if(statusEl){ statusEl.textContent = 'Sending...'; statusEl.hidden = false; }

      const data = new FormData(form);
      try {
        const res = await fetch(form.action, {
          method: form.method || 'POST',
          body: data,
          headers: { 'Accept': 'application/json' }
        });

        if(res.ok){
          // show modal (preferred) then auto-hide after a bit
          showModal();
          showToast('Message sent — I will contact you soon!');
          form.reset();
          if(statusEl) { statusEl.textContent = ''; statusEl.hidden = true; }
        } else {
          // fallback message
          showToast('Unable to send. Try again later.');
          if(statusEl) statusEl.textContent = 'Submission failed.';
        }
      } catch(err){
        console.error('Contact submit error', err);
        showToast('Network error. Try again later.');
        if(statusEl) statusEl.textContent = 'Network error.';
      }
    });
  }
})();
