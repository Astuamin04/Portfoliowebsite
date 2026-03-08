/* =============================================
   ASTU AMIN PORTFOLIO — main.js v3
   ============================================= */

document.addEventListener('DOMContentLoaded', () => {

  /* ================================================
     1. DARK / LIGHT MODE TOGGLE
  ================================================ */
  const html        = document.documentElement;
  const themeToggle = document.getElementById('themeToggle');
  const saved       = localStorage.getItem('theme') || 'dark';
  html.setAttribute('data-theme', saved);

  themeToggle.addEventListener('click', () => {
    const next = html.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
    html.setAttribute('data-theme', next);
    localStorage.setItem('theme', next);
  });

  /* ================================================
     2. CUSTOM CURSOR
  ================================================ */
  const cursor    = document.createElement('div');
  const cursorDot = document.createElement('div');
  cursor.className    = 'cursor-ring';
  cursorDot.className = 'cursor-dot';
  document.body.appendChild(cursor);
  document.body.appendChild(cursorDot);

  let mouseX = 0, mouseY = 0, ringX = 0, ringY = 0;
  document.addEventListener('mousemove', e => {
    mouseX = e.clientX; mouseY = e.clientY;
    cursorDot.style.transform = `translate(${mouseX}px,${mouseY}px)`;
  });
  (function loop() {
    ringX += (mouseX - ringX) * 0.12;
    ringY += (mouseY - ringY) * 0.12;
    cursor.style.transform = `translate(${ringX}px,${ringY}px)`;
    requestAnimationFrame(loop);
  })();
  document.querySelectorAll('a,button,.skill-card,.project-card,.value-item,.soft-item,.edu-card,.cert-card,.tag').forEach(el => {
    el.addEventListener('mouseenter', () => cursor.classList.add('expanded'));
    el.addEventListener('mouseleave', () => cursor.classList.remove('expanded'));
  });

  /* ================================================
     3. PARTICLE CANVAS
  ================================================ */
  const canvas = document.createElement('canvas');
  canvas.id = 'particle-canvas';
  const hero = document.getElementById('hero');
  hero.insertBefore(canvas, hero.firstChild);
  const ctx = canvas.getContext('2d');
  let W, H, particles = [], pmx = -999, pmy = -999;

  const resize = () => { W = canvas.width = hero.offsetWidth; H = canvas.height = hero.offsetHeight; };
  resize();
  window.addEventListener('resize', () => { resize(); particles = makeParticles(); });

  class P {
    constructor() { this.reset(); }
    reset() {
      this.x = Math.random()*W; this.y = Math.random()*H;
      this.vx = (Math.random()-0.5)*0.4; this.vy = (Math.random()-0.5)*0.4;
      this.r = Math.random()*1.5+0.5; this.a = Math.random()*0.5+0.1;
    }
    update() {
      const dx=this.x-pmx, dy=this.y-pmy, d=Math.sqrt(dx*dx+dy*dy);
      if(d<120){this.vx+=(dx/d)*0.3;this.vy+=(dy/d)*0.3;}
      this.vx*=0.97; this.vy*=0.97;
      this.x+=this.vx; this.y+=this.vy;
      if(this.x<0||this.x>W||this.y<0||this.y>H) this.reset();
    }
    draw() {
      ctx.beginPath(); ctx.arc(this.x,this.y,this.r,0,Math.PI*2);
      ctx.fillStyle=`rgba(0,229,160,${this.a})`; ctx.fill();
    }
  }
  const makeParticles = () => Array.from({length:130}, ()=>new P());
  particles = makeParticles();

  canvas.addEventListener('mousemove', e => { const r=canvas.getBoundingClientRect(); pmx=e.clientX-r.left; pmy=e.clientY-r.top; });
  canvas.addEventListener('mouseleave', ()=>{ pmx=-999; pmy=-999; });

  (function drawP() {
    ctx.clearRect(0,0,W,H);
    for(let i=0;i<particles.length;i++){
      for(let j=i+1;j<particles.length;j++){
        const dx=particles[i].x-particles[j].x, dy=particles[i].y-particles[j].y;
        const d=Math.sqrt(dx*dx+dy*dy);
        if(d<110){ ctx.beginPath(); ctx.strokeStyle=`rgba(0,229,160,${0.07*(1-d/110)})`; ctx.lineWidth=0.5; ctx.moveTo(particles[i].x,particles[i].y); ctx.lineTo(particles[j].x,particles[j].y); ctx.stroke(); }
      }
      particles[i].update(); particles[i].draw();
    }
    requestAnimationFrame(drawP);
  })();

  /* ================================================
     4. TEXT SCRAMBLE
  ================================================ */
  class Scramble {
    constructor(el){ this.el=el; this.chars='!<>-_\\/[]{}=+*?#ABCDEFGHabcdefgh0123456789'; }
    set(text){
      const p=new Promise(r=>this.res=r);
      this.q=Array.from(text,c=>({to:c,start:Math.floor(Math.random()*18),end:Math.floor(Math.random()*18)+18}));
      cancelAnimationFrame(this.raf); this.f=0; this._run(); return p;
    }
    _run(){
      let out='',done=0;
      this.q.forEach(q=>{
        if(this.f>=q.end){done++;out+=q.to;}
        else if(this.f>=q.start){if(!q.c||Math.random()<0.3)q.c=this.chars[Math.floor(Math.random()*this.chars.length)];out+=`<span class="scramble-char">${q.c}</span>`;}
        else out+=q.to;
      });
      this.el.innerHTML=out;
      if(done===this.q.length)this.res();
      else{this.raf=requestAnimationFrame(()=>{this.f++;this._run();});}
    }
  }
  const h1=document.querySelector('h1');
  if(h1){ const txt=h1.innerText; new Scramble(h1).set(txt).then(()=>{ h1.innerHTML=txt.replace('IT Specialist','<span>IT Specialist</span>'); }); }

  /* ================================================
     5. TYPING EFFECT
  ================================================ */
  const sub=document.querySelector('.hero-sub');
  if(sub){
    const txt=sub.getAttribute('data-text')||sub.textContent;
    sub.setAttribute('data-text',txt); sub.textContent=''; sub.style.opacity='1';
    let i=0;
    setTimeout(()=>{ const iv=setInterval(()=>{ sub.textContent+=txt[i++]; if(i>=txt.length)clearInterval(iv); },16); },1200);
  }

  /* ================================================
     6. SCROLL REVEAL
  ================================================ */
  const ro=new IntersectionObserver(entries=>{
    entries.forEach(e=>{ if(e.isIntersecting){e.target.classList.add('visible');ro.unobserve(e.target);} });
  },{threshold:0.08});
  document.querySelectorAll('.reveal').forEach(el=>ro.observe(el));
  document.querySelectorAll('.skills-grid,.projects-grid,.soft-grid,.edu-grid,.cert-grid').forEach(g=>{
    [...g.children].forEach((c,i)=>c.style.transitionDelay=`${i*0.1}s`);
  });
  document.querySelectorAll('.timeline-item').forEach((el,i)=>{el.style.transitionDelay=`${i*0.15}s`;ro.observe(el);});

  /* ================================================
     7. 3D TILT
  ================================================ */
  document.querySelectorAll('.project-card,.skill-card,.hero-card,.edu-card,.cert-card').forEach(card=>{
    const shine=document.createElement('div'); shine.className='card-shine'; card.appendChild(shine);
    card.addEventListener('mousemove',e=>{
      const r=card.getBoundingClientRect();
      const dx=(e.clientX-r.left-r.width/2)/(r.width/2), dy=(e.clientY-r.top-r.height/2)/(r.height/2);
      card.style.transform=`perspective(900px) rotateX(${dy*-7}deg) rotateY(${dx*7}deg) translateY(-5px) scale(1.02)`;
      card.style.transition='transform 0.05s';
      shine.style.background=`radial-gradient(circle at ${((e.clientX-r.left)/r.width)*100}% ${((e.clientY-r.top)/r.height)*100}%,rgba(255,255,255,0.08) 0%,transparent 65%)`;
    });
    card.addEventListener('mouseleave',()=>{ card.style.transform=''; card.style.transition='transform 0.5s ease'; shine.style.background=''; });
  });

  /* ================================================
     8. COUNTERS
  ================================================ */
  const co=new IntersectionObserver(entries=>{
    entries.forEach(e=>{
      if(!e.isIntersecting)return;
      const el=e.target, raw=el.getAttribute('data-val')||el.textContent.trim();
      el.setAttribute('data-val',raw);
      const m=raw.match(/^(\d+\.?\d*)(.*)/);
      if(m){ const t=parseFloat(m[1]),s=m[2]; let c=0; const iv=setInterval(()=>{ c=Math.min(c+t/50,t); el.textContent=Math.round(c)+s; if(c>=t)clearInterval(iv); },25); }
      co.unobserve(el);
    });
  },{threshold:0.5});
  document.querySelectorAll('.stat-num').forEach(el=>co.observe(el));

  /* ================================================
     9. SCROLL PROGRESS BAR
  ================================================ */
  const bar=document.createElement('div'); bar.id='scroll-progress'; document.body.appendChild(bar);
  window.addEventListener('scroll',()=>{ bar.style.width=(window.scrollY/(document.body.scrollHeight-window.innerHeight)*100)+'%'; });

  /* ================================================
     10. PARALLAX BLOBS
  ================================================ */
  const b1=document.querySelector('.ambient-1'), b2=document.querySelector('.ambient-2'), b3=document.querySelector('.ambient-3');
  window.addEventListener('scroll',()=>{
    const y=window.scrollY;
    if(b1)b1.style.transform=`translate(0,${y*0.12}px)`;
    if(b2)b2.style.transform=`translate(0,${y*-0.08}px)`;
    if(b3)b3.style.transform=`translate(-50%,calc(-50% + ${y*0.05}px))`;
  });

  /* ================================================
     11. MAGNETIC BUTTONS
  ================================================ */
  document.querySelectorAll('.btn-primary,.btn-secondary,.nav-cta,.social-btn').forEach(btn=>{
    btn.addEventListener('mousemove',e=>{
      const r=btn.getBoundingClientRect();
      btn.style.transform=`translate(${(e.clientX-(r.left+r.width/2))*0.22}px,${(e.clientY-(r.top+r.height/2))*0.22}px)`;
    });
    btn.addEventListener('mouseleave',()=>btn.style.transform='');
  });

  /* ================================================
     12. GLITCH on section labels
  ================================================ */
  document.querySelectorAll('.section-label').forEach(el=>{
    el.setAttribute('data-text',el.textContent);
    el.addEventListener('mouseenter',()=>el.classList.add('glitch'));
    el.addEventListener('mouseleave',()=>el.classList.remove('glitch'));
  });

  /* ================================================
     13. PILL GLOW
  ================================================ */
  document.querySelectorAll('.pill').forEach(p=>{
    p.addEventListener('mouseenter',()=>{ p.style.cssText+='box-shadow:0 0 14px rgba(0,229,160,0.35);border-color:rgba(0,229,160,0.6);color:#00e5a0;transform:translateY(-2px);'; });
    p.addEventListener('mouseleave',()=>{ p.style.boxShadow=p.style.borderColor=p.style.color=p.style.transform=''; });
  });

  /* ================================================
     14. FLOATING HERO CARD
  ================================================ */
  const hc=document.querySelector('.hero-card');
  if(hc){ let a=0; (function f(){a+=0.015;hc.style.marginTop=`${Math.sin(a)*8}px`;requestAnimationFrame(f);})(); }

  /* ================================================
     15. CONTACT FORM (mailto fallback)
  ================================================ */
  const form=document.getElementById('contactForm');
  if(form){
    form.addEventListener('submit',e=>{
      e.preventDefault();
      const name=document.getElementById('name').value;
      const email=document.getElementById('email').value;
      const subject=document.getElementById('subject').value||'Portfolio Inquiry';
      const message=document.getElementById('message').value;
      const mailto=`mailto:astuamin04@gmail.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(`From: ${name} (${email})\n\n${message}`)}`;
      window.location.href=mailto;
      const success=document.getElementById('formSuccess');
      success.classList.add('show');
      form.reset();
      setTimeout(()=>success.classList.remove('show'),5000);
    });
    // Input focus animations
    document.querySelectorAll('.form-group input,.form-group textarea').forEach(inp=>{
      inp.addEventListener('focus',()=>inp.parentElement.querySelector('label').style.color='var(--accent)');
      inp.addEventListener('blur',()=>inp.parentElement.querySelector('label').style.color='');
    });
  }

  /* ================================================
     16. MOBILE MENU
  ================================================ */
  const hbg=document.querySelector('.hamburger'), mm=document.querySelector('.mobile-menu');
  if(hbg&&mm){
    hbg.addEventListener('click',()=>{
      const open=mm.classList.toggle('open');
      const sp=hbg.querySelectorAll('span');
      sp[0].style.transform=open?'rotate(45deg) translate(5px,5px)':'';
      sp[1].style.opacity=open?'0':'1';
      sp[2].style.transform=open?'rotate(-45deg) translate(5px,-5px)':'';
    });
    mm.querySelectorAll('a').forEach(a=>a.addEventListener('click',()=>{
      mm.classList.remove('open');
      hbg.querySelectorAll('span').forEach(s=>{s.style.transform='';s.style.opacity='1';});
    }));
  }

  /* ================================================
     17. ACTIVE NAV + SMOOTH SCROLL
  ================================================ */
  const nl=document.querySelectorAll('.nav-links a,.mobile-menu a');
  document.querySelectorAll('section[id]').forEach(s=>{
    new IntersectionObserver(entries=>{
      entries.forEach(e=>{ if(e.isIntersecting)nl.forEach(l=>l.classList.toggle('active',l.getAttribute('href')===`#${e.target.id}`)); });
    },{threshold:0.4}).observe(s);
  });
  document.querySelectorAll('a[href^="#"]').forEach(a=>{
    a.addEventListener('click',e=>{
      const t=document.querySelector(a.getAttribute('href'));
      if(t){e.preventDefault();window.scrollTo({top:t.getBoundingClientRect().top+window.scrollY-80,behavior:'smooth'});}
    });
  });

  /* ================================================
     18. NAV SHADOW
  ================================================ */
  const nav=document.querySelector('nav');
  window.addEventListener('scroll',()=>{ nav.style.boxShadow=window.scrollY>50?'0 8px 40px rgba(0,0,0,0.4)':'none'; });

  /* ================================================
     19. PAGE LOAD RIPPLE EFFECT
  ================================================ */
  const ripple=document.createElement('div');
  ripple.style.cssText='position:fixed;top:50%;left:50%;width:0;height:0;background:rgba(0,229,160,0.06);border-radius:50%;transform:translate(-50%,-50%);pointer-events:none;z-index:9996;transition:width 1.2s ease,height 1.2s ease,opacity 1.2s ease;';
  document.body.appendChild(ripple);
  setTimeout(()=>{ ripple.style.width='300vw'; ripple.style.height='300vw'; ripple.style.opacity='0'; },100);
  setTimeout(()=>ripple.remove(),1400);

  /* ================================================
     20. STAGGER TAG ANIMATION
  ================================================ */
  document.querySelectorAll('.hero-tags .tag').forEach((tag,i)=>{
    tag.style.opacity='0'; tag.style.transform='translateY(12px)';
    setTimeout(()=>{ tag.style.transition='opacity 0.4s ease,transform 0.4s ease'; tag.style.opacity='1'; tag.style.transform='none'; },800+i*80);
  });

});