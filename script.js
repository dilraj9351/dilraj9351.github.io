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
