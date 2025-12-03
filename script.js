(function(){
  const themeBtn = document.getElementById('themeToggle');
  const mobileBtn = document.getElementById('mobileMenuBtn');
  const nav = document.querySelector('.nav');
  const navLinks = document.querySelectorAll('.nav-link');
  const form = document.getElementById('contactForm');

  const setTheme = (mode) => {
    if(mode === 'dark') document.documentElement.setAttribute('data-theme','dark');
    else document.documentElement.removeAttribute('data-theme');
    try { localStorage.setItem('site-theme', mode === 'dark' ? 'dark' : 'light'); } catch(e){}
    if(themeBtn) themeBtn.textContent = mode === 'dark' ? 'Light' : 'Dark';
    if(themeBtn) themeBtn.setAttribute('aria-pressed', String(mode === 'dark'));
  };

  const saved = (function(){
    try { return localStorage.getItem('site-theme'); } catch(e){ return null; }
  })();
  if(saved === 'dark') setTheme('dark');
  else setTheme('light');

  if(themeBtn){
    themeBtn.addEventListener('click', () => {
      const isDark = document.documentElement.getAttribute('data-theme') === 'dark';
      setTheme(isDark ? 'light' : 'dark');
    });
  }

  if(mobileBtn && nav){
    mobileBtn.addEventListener('click', ()=>{
      const expanded = mobileBtn.getAttribute('aria-expanded') === 'true';
      mobileBtn.setAttribute('aria-expanded', String(!expanded));
      nav.style.display = expanded ? '' : 'flex';
      if(!expanded){
        nav.style.flexDirection = 'column';
        nav.style.position = 'absolute';
        nav.style.right = '16px';
        nav.style.top = '72px';
        nav.style.background = 'white';
        nav.style.padding = '12px';
        nav.style.borderRadius = '10px';
        nav.style.boxShadow = '0 10px 30px rgba(10,20,40,0.08)';
      } else {
        nav.style.position = '';
        nav.style.right = '';
        nav.style.top = '';
        nav.style.background = '';
        nav.style.padding = '';
        nav.style.borderRadius = '';
        nav.style.boxShadow = '';
      }
    });
  }

  navLinks.forEach(a=>{
    a.addEventListener('click', ()=> {
      if(window.innerWidth <= 960 && nav && mobileBtn){
        nav.style.display = 'none';
        mobileBtn.setAttribute('aria-expanded','false');
      }
    });
  });

  document.querySelectorAll('a[href^="#"]').forEach(a=>{
    a.addEventListener('click', function(e){
      const href = this.getAttribute('href');
      if(href === '#' || href === '') return;
      const el = document.querySelector(href);
      if(el){
        e.preventDefault();
        el.scrollIntoView({behavior:'smooth', block:'start'});
        history.replaceState(null,'', href);
      }
    });
  });

  const sections = Array.from(navLinks).map(n => {
    const id = n.getAttribute('href');
    return id && id.startsWith('#') ? document.querySelector(id) : null;
  }).filter(Boolean);

  if('IntersectionObserver' in window && sections.length){
    const obs = new IntersectionObserver(entries=>{
      entries.forEach(en=>{
        if(en.isIntersecting){
          navLinks.forEach(n => n.classList.toggle('active', n.getAttribute('href') === `#${en.target.id}`));
        }
      });
    }, {threshold: 0.45});
    sections.forEach(s => obs.observe(s));
  }

  if(form){
    form.addEventListener('submit', function(e){
      const name = (form.querySelector('[name="name"]')?.value || '').trim();
      const email = (form.querySelector('[name="email"]')?.value || '').trim();
      const message = (form.querySelector('[name="message"]')?.value || '').trim();
      if(!name || !email || !message){
        const status = document.getElementById('formStatus');
        if(status) status.textContent = 'Please fill all fields.';
        e.preventDefault();
        return;
      }
      const overlay = document.createElement('div');
      overlay.style.position = 'fixed';
      overlay.style.left = 0; overlay.style.top = 0; overlay.style.right = 0; overlay.style.bottom = 0;
      overlay.style.display = 'flex'; overlay.style.alignItems = 'center'; overlay.style.justifyContent = 'center';
      overlay.style.background = 'rgba(0,0,0,0.35)'; overlay.style.zIndex = 99999;
      overlay.innerHTML = '<div style="background:#fff;padding:18px 22px;border-radius:12px;box-shadow:0 8px 24px rgba(0,0,0,0.16);font-weight:700">Sending... please wait</div>';
      document.body.appendChild(overlay);
      setTimeout(()=>{ if(overlay.parentNode) overlay.parentNode.removeChild(overlay); },5000);
    });
  }
})();
```0
