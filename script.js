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
// Portfolio lightbox
document.addEventListener('DOMContentLoaded', function () {
  const links = document.querySelectorAll('.portfolio-link');
  const lb = document.getElementById('lightbox');
  const lbImg = document.getElementById('lbImg');
  const lbCaption = document.getElementById('lbCaption');
  const lbClose = document.getElementById('lbClose');

  links.forEach(link => {
    link.addEventListener('click', function (e) {
      e.preventDefault();
      const img = link.querySelector('img');
      const src = img.getAttribute('src');
      const alt = img.getAttribute('alt') || '';
      lbImg.src = src;
      lbImg.alt = alt;
      lbCaption.textContent = alt;
      lb.setAttribute('aria-hidden', 'false');
      document.body.style.overflow = 'hidden';
    });
  });

  function closeLB() {
    lb.setAttribute('aria-hidden', 'true');
    lbImg.src = '';
    document.body.style.overflow = '';
  }

  lbClose.addEventListener('click', closeLB);
  lb.addEventListener('click', function (e) {
    if (e.target === lb) closeLB();
  });
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') closeLB();
  });
});
// Lightbox with prev/next
document.addEventListener('DOMContentLoaded', function () {
  const links = Array.from(document.querySelectorAll('.portfolio-link'));
  if (!links.length) return;

  const lb = document.getElementById('lightbox');
  const lbImg = document.getElementById('lbImg');
  const lbCaption = document.getElementById('lbCaption');
  const lbClose = document.getElementById('lbClose');
  const lbPrev = document.getElementById('lbPrev');
  const lbNext = document.getElementById('lbNext');

  // Build gallery array of {src, alt}
  const gallery = links.map(link => {
    const img = link.querySelector('img');
    return {
      src: img ? img.getAttribute('src') : '',
      alt: img ? img.getAttribute('alt') || '' : ''
    };
  });

  let currentIndex = 0;

  function openAt(index) {
    const item = gallery[index];
    if (!item) return;
    lbImg.src = item.src;
    lbImg.alt = item.alt;
    lbCaption.textContent = item.alt;
    lb.setAttribute('aria-hidden', 'false');
    document.body.classList.add('lb-open');
    currentIndex = index;
  }

  function closeLB() {
    lb.setAttribute('aria-hidden', 'true');
    lbImg.src = '';
    lbCaption.textContent = '';
    document.body.classList.remove('lb-open');
  }

  function showNext() {
    const next = (currentIndex + 1) % gallery.length;
    openAt(next);
  }
  function showPrev() {
    const prev = (currentIndex - 1 + gallery.length) % gallery.length;
    openAt(prev);
  }

  // Attach click to each portfolio link
  links.forEach((link, i) => {
    link.addEventListener('click', function (e) {
      e.preventDefault();
      openAt(i);
    });
  });

  // Controls
  lbClose.addEventListener('click', closeLB);
  lbNext.addEventListener('click', function (e) { e.stopPropagation(); showNext(); });
  lbPrev.addEventListener('click', function (e) { e.stopPropagation(); showPrev(); });

  // Click backdrop to close (only when clicking the overlay, not inner)
  lb.addEventListener('click', function (e) {
    if (e.target === lb) closeLB();
  });

  // Keyboard navigation: Esc close, Left previous, Right next
  document.addEventListener('keydown', function (e) {
    if (lb.getAttribute('aria-hidden') === 'false') {
      if (e.key === 'Escape') closeLB();
      if (e.key === 'ArrowRight') showNext();
      if (e.key === 'ArrowLeft') showPrev();
    }
  });

  // Optional: swipe support (small, mobile)
  let startX = null;
  lb.addEventListener('touchstart', (e) => { startX = e.touches[0].clientX; }, {passive:true});
  lb.addEventListener('touchend', (e) => {
    if (!startX) return;
    const dx = e.changedTouches[0].clientX - startX;
    if (dx > 40) showPrev();
    else if (dx < -40) showNext();
    startX = null;
  }, {passive:true});
});
// HIRE modal logic (add to your script.js)
document.addEventListener('DOMContentLoaded', function(){
  const hireBtns = document.querySelectorAll('.hire-btn');
  const modal = document.getElementById('hireModal');
  const selectedPlan = document.getElementById('selectedPlan');
  const selectedPlanText = document.getElementById('selectedPlanText');
  const formPlan = document.getElementById('formPlan');
  const closeBtn = document.getElementById('closeHire');
  const cancelBtn = document.getElementById('cancelHire');

  function openModal(plan) {
    selectedPlan.textContent = plan;
    formPlan.value = plan;
    modal.setAttribute('aria-hidden','false');
    document.body.style.overflow = 'hidden';
  }
  function closeModal(){
    modal.setAttribute('aria-hidden','true');
    document.body.style.overflow = '';
  }

  hireBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
      const plan = e.currentTarget.dataset.plan || 'Starter';
      openModal(plan);
    });
  });
  closeBtn && closeBtn.addEventListener('click', closeModal);
  cancelBtn && cancelBtn.addEventListener('click', closeModal);

  // close modal on outside click
  modal && modal.addEventListener('click', (e) => {
    if (e.target === modal) closeModal();
  });

  // Optional: show a tiny toast after successful submit (Formspree will redirect unless using AJAX)
  const hireForm = document.getElementById('hireForm');
  if (hireForm) {
    hireForm.addEventListener('submit', (e) => {
      // if you want to use AJAX instead of Formspree redirect, uncomment below and replace action with JSON endpoint:
      // e.preventDefault();
      // fetch(hireForm.action, { method: 'POST', body: new FormData(hireForm) })
      //  .then(()=> { closeModal(); alert('Request sent! I will contact you soon.'); })
      //  .catch(()=> alert('There was an error. Try again.'));
    });
  }
});
// Hire Modal logic + WhatsApp
const hireButtons = document.querySelectorAll(".hire-btn");
const hireModal = document.getElementById("hireModal");
const selectedPlan = document.getElementById("selectedPlan");
const closeHire = document.getElementById("closeHire");
const whatsappBtn = document.getElementById("whatsappBtn");

const phone = "919351996276"; // your number

hireButtons.forEach(btn => {
  btn.addEventListener("click", () => {
    const plan = btn.getAttribute("data-plan");
    selectedPlan.textContent = plan;

    whatsappBtn.href =
      `https://wa.me/${phone}?text=Hi,+I+want+to+hire+your+${plan}+website+plan`;

    hireModal.setAttribute("aria-hidden", "false");
  });
});

closeHire.addEventListener("click", () => {
  hireModal.setAttribute("aria-hidden", "true");
});
// Hire CTA + Modal behavior
document.addEventListener('DOMContentLoaded', () => {
  // Find all hire buttons
  const hireButtons = document.querySelectorAll('.hire-btn');
  const hireModal = document.getElementById('hireModal') || document.querySelector('.modal#hireModal');
  const closeHire = document.getElementById('closeHire') || hireModal && hireModal.querySelector('.modal-close');
  const selectedPlanEl = document.getElementById('selectedPlan') || null;
  const selectedPlanText = document.getElementById('selectedPlanText');
  const whatsappBtn = document.getElementById('whatsappBtn');
  const formPlanInput = document.querySelector('#hireForm input[name="plan"]');

  // phone number to use for WhatsApp (replace with your number if different)
  const whatsappNumber = '919351996276'; // keep as plain digits, country code +91

  function openModalWithPlan(planName) {
    if (!hireModal) return;
    hireModal.classList.add('is-open');
    hireModal.setAttribute('aria-hidden', 'false');
    // show selected plan name
    if (selectedPlanEl) selectedPlanEl.textContent = planName;
    if (selectedPlanText) selectedPlanText.textContent = 'Selected plan: ' + planName;
    // set hidden input in form (if present)
    if (formPlanInput) formPlanInput.value = planName;
    // set WhatsApp button link with prefilled message
    if (whatsappBtn) {
      const message = encodeURIComponent(`Hi! I'm interested in the ${planName} plan. Please help me get started. - (from portfolio site)`);
      whatsappBtn.setAttribute('href', `https://wa.me/${whatsappNumber}?text=${message}`);
    }
    // focus the first input if you want:
    const firstInput = hireModal.querySelector('input, textarea, button');
    if (firstInput) firstInput.focus();
  }

  function closeHireModal() {
    if (!hireModal) return;
    hireModal.classList.remove('is-open');
    hireModal.setAttribute('aria-hidden', 'true');
  }

  hireButtons.forEach(btn => {
    // Make sure the button spans full width by applying class (defensive)
    btn.classList.add('hire-btn');

    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const plan = btn.dataset.plan || btn.getAttribute('data-plan') || btn.textContent.trim();
      openModalWithPlan(plan);
    });
  });

  // close handlers
  if (closeHire) closeHire.addEventListener('click', closeHireModal);
  // close when clicking outside modal-panel
  if (hireModal) hireModal.addEventListener('click', (ev) => {
    if (ev.target === hireModal) closeHireModal();
  });

  // optional: Escape key to close
  document.addEventListener('keyup', (e) => {
    if (e.key === 'Escape') closeHireModal();
  });
});
// Show UPI button based on plan
document.querySelectorAll(".hire-btn").forEach(button => {
    button.addEventListener("click", () => {
        const plan = button.dataset.plan;

        document.getElementById("upiStarter").style.display = "none";
        document.getElementById("upiBusiness").style.display = "none";
        document.getElementById("upiPremium").style.display = "none";

        if (plan === "Starter") {
            document.getElementById("upiStarter").style.display = "block";
        } 
        else if (plan === "Business") {
            document.getElementById("upiBusiness").style.display = "block";
        } 
        else if (plan === "Premium") {
            document.getElementById("upiPremium").style.display = "block";
        }
    });
});
