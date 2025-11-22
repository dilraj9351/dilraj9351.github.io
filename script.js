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
