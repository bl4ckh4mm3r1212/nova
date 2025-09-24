    // -------------- Theme (dark / light) --------------
    (function themeInit(){
      const root = document.documentElement;
      const saved = localStorage.getItem('theme');
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      if(saved){ root.classList.toggle('dark', saved === 'dark'); }
      else{ root.classList.toggle('dark', prefersDark); }
      const btn = document.getElementById('theme-toggle');
      const set = (toDark) => {
        root.classList.toggle('dark', toDark);
        localStorage.setItem('theme', toDark ? 'dark' : 'light');
        btn.setAttribute('aria-pressed', String(toDark));
        btn.textContent = toDark ? '☀️' : '🌙';
        document.querySelector('meta[name="theme-color"][media*="dark"]')?.setAttribute('content', toDark ? '#0b1220' : '#111827');
      };
      set(root.classList.contains('dark'));
      btn.addEventListener('click', () => set(!root.classList.contains('dark')));
      window.addEventListener('keydown', (e)=>{ if(e.key.toLowerCase()==='t') set(!root.classList.contains('dark')); });
    })();

    // -------------- Mobile Menu --------------
    (function mobileMenu(){
      const toggle = document.querySelector('.menu-toggle');
      const menu = document.querySelector('.primary');
      toggle.addEventListener('click', ()=>{
        const open = menu.classList.toggle('open');
        toggle.setAttribute('aria-expanded', String(open));
      });
      // Close on link click (mobile)
      menu.querySelectorAll('a').forEach(a => a.addEventListener('click', ()=> menu.classList.remove('open')));
    })();

    // -------------- Scroll-Spy & Progress --------------
    (function scrollSpy(){
      const sections = [...document.querySelectorAll('main section[id]')];
      const links = [...document.querySelectorAll('header .primary a.link')];
      const linkFor = id => links.find(a => a.getAttribute('href') === '#' + id);

      const obs = new IntersectionObserver((entries)=>{
        entries.forEach(entry=>{
          const a = linkFor(entry.target.id);
          if(!a) return;
          if(entry.isIntersecting) { links.forEach(x => x.classList.remove('active')); a.classList.add('active'); }
        });
      }, { rootMargin: '-40% 0px -55% 0px', threshold: 0.01 });
      sections.forEach(s => obs.observe(s));

      // Progress bar
      const bar = document.querySelector('.progress');
      const onScroll = () => {
        const h = document.documentElement;
        const scrolled = h.scrollTop;
        const total = h.scrollHeight - h.clientHeight;
        const ratio = total ? (scrolled / total) : 0;
        bar.style.transform = `scaleX(${ratio})`;
      };
      onScroll();
      document.addEventListener('scroll', onScroll, { passive:true });
    })();

    // -------------- Reveal on View --------------
    (function reveals(){
      const els = document.querySelectorAll('.fade-up');
      const obs = new IntersectionObserver((entries,observer)=>{
        for(const e of entries){
          if(e.isIntersecting){
            e.target.classList.add('in-view');
            observer.unobserve(e.target);
          }
        }
      }, { threshold: 0.08, rootMargin: '0px 0px -40px 0px' });
      els.forEach(el => obs.observe(el));
    })();

    // -------------- Forms (Contact + Newsletter) --------------
    (function forms(){
      const year = document.getElementById('year');
      year.textContent = new Date().getFullYear();

      // Contact
      const form = document.getElementById('contact-form');
      const notice = document.getElementById('notice');
      const emailRx = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/i;

      form.addEventListener('submit', (e)=>{
        e.preventDefault();
        const fd = new FormData(form);
        const name = fd.get('name')?.toString().trim();
        const email = fd.get('email')?.toString().trim();
        const message = fd.get('message')?.toString().trim();
        const agree = document.getElementById('agree').checked;

        // Validation
        let error = '';
        if(!name || name.length < 2) error = 'Please enter your name (2+ chars).';
        else if(!email || !emailRx.test(email)) error = 'Please enter a valid email.';
        else if(!message || message.length < 10) error = 'Please write a longer message (10+ chars).';
        else if(!agree) error = 'You must agree to the terms.';

        if(error){
          show(error, true);
          return;
        }

        // Simulate sending
        show('Sending…', false);
        setTimeout(()=>{
          show('Thanks! Your message has been sent. We’ll be in touch shortly.', false);
          form.reset();
        }, 600);
      });

      function show(msg, isError){
        notice.style.display = 'block';
        notice.textContent = msg;
        notice.classList.toggle('error', !!isError);
      }

      // Newsletter
      const nl = document.getElementById('newsletter');
      const nlemail = document.getElementById('nl-email');
      const nlnote = document.getElementById('nl-note');
      nl.addEventListener('submit', (e)=>{
        e.preventDefault();
        const val = nlemail.value.trim();
        if(!emailRx.test(val)){
          nlnote.textContent = 'Please enter a valid email to subscribe.';
          nlnote.style.color = 'var(--danger)';
          return;
        }
        nlnote.textContent = 'Welcome aboard! Check your inbox for a confirmation.';
        nlnote.style.color = 'var(--muted)';
        nl.reset();
      });
    })();

    // -------------- Respect Reduced Motion --------------
    (function reducedMotion(){
      const media = window.matchMedia('(prefers-reduced-motion: reduce)');
      function update(){
        document.documentElement.style.setProperty('scroll-behavior', media.matches ? 'auto' : 'smooth');
      }
      media.addEventListener?.('change', update);
      update();
    })();