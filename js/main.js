(function(){
  'use strict';
  const $ = (s,ctx=document)=>ctx.querySelector(s);
  const $$ = (s,ctx=document)=>Array.from(ctx.querySelectorAll(s));
  const body=document.body;

  // Prototype URL mapping. Empty URLs stay testable without jumping to page top.
  const config=window.SUDAM_CONFIG||{urls:{}};
  $$('[data-url-key]').forEach(el=>{
    const key=el.dataset.urlKey;
    const url=config.urls?.[key];
    if(url){
      el.setAttribute('href',url);
      if(/^https?:\/\//i.test(url)){
        el.setAttribute('target','_blank');
        el.setAttribute('rel','noopener');
      }
    }else{
      el.setAttribute('href','#!');
      el.dataset.placeholderLink='true';
    }
  });

  // Drawer
  const menuBtn=$('[data-sd-menu-open]');
  const closeBtn=$('[data-sd-menu-close]');
  const drawer=$('.sd-drawer');
  const dim=$('.sd-dim');
  let lastFocus=null;
  function setDrawer(open){
    if(!drawer||!dim) return;
    if(open){lastFocus=document.activeElement;drawer.classList.add('is-open');dim.classList.add('is-open');body.classList.add('sd-lock');menuBtn?.setAttribute('aria-expanded','true');setTimeout(()=>closeBtn?.focus(),30)}
    else{drawer.classList.remove('is-open');dim.classList.remove('is-open');body.classList.remove('sd-lock');menuBtn?.setAttribute('aria-expanded','false');lastFocus?.focus?.()}
  }
  menuBtn?.addEventListener('click',()=>setDrawer(true));
  closeBtn?.addEventListener('click',()=>setDrawer(false));
  dim?.addEventListener('click',()=>setDrawer(false));
  document.addEventListener('keydown',e=>{if(e.key==='Escape') setDrawer(false)});
  $$('.sd-drawer a').forEach(a=>a.addEventListener('click',()=>setDrawer(false)));

  // Header 전체(브랜드바 + 수담/메뉴/모임/후기/예약)를 상단에 고정.
  // 실제 고정은 CSS position:sticky로 처리하고, 스크롤 시 그림자만 추가한다.
  const headerWrap=$('.sd-header-wrap');
  function updateSticky(){
    if(!headerWrap) return;
    headerWrap.classList.toggle('is-sticky', window.scrollY > 0);
  }
  window.addEventListener('scroll',updateSticky,{passive:true});
  updateSticky();

  // Vanilla sliders
  class SudamSlider{
    constructor(root){
      this.root=root;this.track=$('.sd-slider-track',root);this.slides=$$('.sd-slide',root);
      this.prev=$('.sd-slider-prev',root);this.next=$('.sd-slider-next',root);this.dots=$$('.sd-dot',root);
      this.i=0;this.loop=root.dataset.loop!=='false';this.auto=Number(root.dataset.autoplay||0);
      this.timer=null;this.pauseTimer=null;this.startX=null;this.bind();this.render();this.startAuto();
    }
    bind(){
      this.prev?.addEventListener('click',()=>this.go(this.i-1,true));
      this.next?.addEventListener('click',()=>this.go(this.i+1,true));
      this.dots.forEach((d,n)=>d.addEventListener('click',()=>this.go(n,true)));
      this.track?.addEventListener('pointerdown',e=>{this.startX=e.clientX;this.track.setPointerCapture?.(e.pointerId)});
      this.track?.addEventListener('pointerup',e=>{if(this.startX==null)return;const dx=e.clientX-this.startX;this.startX=null;if(Math.abs(dx)>40)this.go(this.i+(dx<0?1:-1),true)});
      document.addEventListener('visibilitychange',()=>document.hidden?this.stopAuto():this.startAuto());
    }
    norm(n){return this.loop?(n+this.slides.length)%this.slides.length:Math.max(0,Math.min(this.slides.length-1,n))}
    go(n,user){this.i=this.norm(n);this.render();if(user)this.userPause()}
    render(){if(!this.track)return;this.track.style.transform=`translateX(${-this.i*100}%)`;this.slides.forEach((s,n)=>s.classList.toggle('is-active',n===this.i));this.dots.forEach((d,n)=>{d.classList.toggle('is-active',n===this.i);d.setAttribute('aria-current',n===this.i?'true':'false')})}
    startAuto(){if(!this.auto||window.matchMedia('(prefers-reduced-motion: reduce)').matches)return;this.stopAuto();this.timer=setInterval(()=>this.go(this.i+1,false),this.auto)}
    stopAuto(){if(this.timer){clearInterval(this.timer);this.timer=null}}
    userPause(){this.stopAuto();clearTimeout(this.pauseTimer);this.pauseTimer=setTimeout(()=>this.startAuto(),8000)}
  }
  $$('.sd-slider').forEach(el=>new SudamSlider(el));

  // Toast
  const toast=$('.sd-toast');
  let toastTimer;
  function showToast(msg){if(!toast)return;toast.textContent=msg;toast.classList.add('is-show');clearTimeout(toastTimer);toastTimer=setTimeout(()=>toast.classList.remove('is-show'),2000)}

  // Placeholder links
  document.addEventListener('click',e=>{
    const el=e.target.closest('[data-placeholder-link="true"]');
    if(!el)return;
    e.preventDefault();
    showToast('연결 URL 준비 중입니다.');
  });

  // Address copy
  $$('[data-copy-address]').forEach(btn=>btn.addEventListener('click',async()=>{
    const text=btn.dataset.copyAddress;
    try{await navigator.clipboard.writeText(text);showToast('주소가 복사되었습니다.');}
    catch(e){const ta=document.createElement('textarea');ta.value=text;document.body.appendChild(ta);ta.select();document.execCommand('copy');ta.remove();showToast('주소가 복사되었습니다.');}
    window.dataLayer?.push({event:'address_copy',page_name:'main',section_name:'location',item_name:'address',cta_position:'main_location'});
  }));

  // Language dropdowns (header + footer)
  $$('[data-language-toggle]').forEach(btn=>{
    const wrap=btn.closest('.sd-language');
    const menu=wrap?.querySelector('.sd-language-menu');
    if(!menu) return;
    btn.addEventListener('click',e=>{
      e.stopPropagation();
      $$('.sd-language-menu.is-open').forEach(other=>{if(other!==menu){other.classList.remove('is-open');other.closest('.sd-language')?.querySelector('[data-language-toggle]')?.setAttribute('aria-expanded','false')}});
      document.querySelector('.sd-family-menu.is-open')?.classList.remove('is-open');
      document.querySelector('[data-family-toggle]')?.setAttribute('aria-expanded','false');
      const open=menu.classList.toggle('is-open');
      btn.setAttribute('aria-expanded',String(open));
      if(open)setTimeout(()=>menu.querySelector('a')?.focus(),30);
    });
    menu.addEventListener('keydown',e=>{if(e.key==='Escape'){menu.classList.remove('is-open');btn.setAttribute('aria-expanded','false');btn.focus()}});
  });
  document.addEventListener('click',e=>{
    if(!e.target.closest('.sd-language')){
      $$('.sd-language-menu.is-open').forEach(menu=>{menu.classList.remove('is-open');menu.closest('.sd-language')?.querySelector('[data-language-toggle]')?.setAttribute('aria-expanded','false')});
    }
  });

  // Review galleries: partial-next preview + swipe/scroll + automatic rotation + synced counter. No arrow buttons.
  $$('[data-review-gallery]').forEach(gallery=>{
    const scroller=$('.sd-review-photos',gallery);
    const count=$('.sd-photo-count',gallery);
    if(!scroller||!count) return;
    const imgs=$$('img',scroller);
    if(!imgs.length) return;

    let current=0;
    let timer=null;
    let resumeTimer=null;
    const delay=Number(gallery.dataset.reviewAutoplay||5200);
    const reduceMotion=window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    const nearestIndex=()=>{
      const center=scroller.scrollLeft+scroller.clientWidth/2;
      let best=0,dist=Infinity;
      imgs.forEach((img,i)=>{
        const c=img.offsetLeft+img.offsetWidth/2;
        const d=Math.abs(c-center);
        if(d<dist){dist=d;best=i;}
      });
      return best;
    };
    const update=()=>{
      current=nearestIndex();
      count.textContent=`${current+1} / ${imgs.length}`;
    };
    const go=(n,behavior='smooth')=>{
      current=(n+imgs.length)%imgs.length;
      const left=Math.max(0,imgs[current].offsetLeft-parseFloat(getComputedStyle(scroller).paddingLeft||0));
      scroller.scrollTo({left,behavior});
      count.textContent=`${current+1} / ${imgs.length}`;
    };
    const stop=()=>{if(timer){clearInterval(timer);timer=null;}};
    const start=()=>{
      if(reduceMotion||!delay||imgs.length<2) return;
      stop();
      timer=setInterval(()=>go(current+1),delay);
    };
    const pauseForUser=()=>{
      stop();
      clearTimeout(resumeTimer);
      resumeTimer=setTimeout(start,8000);
    };

    scroller.addEventListener('scroll',()=>requestAnimationFrame(update),{passive:true});
    scroller.addEventListener('pointerdown',pauseForUser,{passive:true});
    scroller.addEventListener('touchstart',pauseForUser,{passive:true});
    gallery.addEventListener('mouseenter',stop);
    gallery.addEventListener('mouseleave',start);
    window.addEventListener('resize',()=>go(current,'auto'));
    document.addEventListener('visibilitychange',()=>document.hidden?stop():start());
    update();
    start();
  });

  // Family site dropdown: opens downward and stays above footer/other layers.
  const familyBtn=$('[data-family-toggle]');
  const familyMenu=$('.sd-family-menu');
  const closeFamily=()=>{familyMenu?.classList.remove('is-open');familyBtn?.setAttribute('aria-expanded','false')};
  familyBtn?.addEventListener('click',e=>{
    e.stopPropagation();
    const willOpen=!familyMenu?.classList.contains('is-open');
    $$('.sd-language-menu.is-open').forEach(menu=>{menu.classList.remove('is-open');menu.closest('.sd-language')?.querySelector('[data-language-toggle]')?.setAttribute('aria-expanded','false')});
    familyMenu?.classList.toggle('is-open',willOpen);
    familyBtn.setAttribute('aria-expanded',String(willOpen));
    if(willOpen)setTimeout(()=>familyMenu?.querySelector('a')?.focus(),30);
  });
  document.addEventListener('click',e=>{if(familyMenu&&familyBtn&&!e.target.closest('.sd-family')) closeFamily()});
  familyMenu?.addEventListener('keydown',e=>{if(e.key==='Escape'){closeFamily();familyBtn?.focus()}});


  // Subtle motion system: reveal content as it enters the viewport.
  // Keeps the site lively without changing layout or creating distracting motion.
  const reduceMotionQuery=window.matchMedia('(prefers-reduced-motion: reduce)');
  if(!reduceMotionQuery.matches){
    body.classList.add('sd-motion-ready');
    const revealGroups=[
      '.sd-trust-caption','.sd-trust-item',
      '.sd-section > .sd-kicker','.sd-section > .sd-title','.sd-section > .sd-desc',
      '.sd-meeting-card','.sd-menu-card','.sd-menu-cta','.sd-review-subhead','.sd-review-card',
      '.sd-map','.sd-location-row','.sd-location-valet',
      '.sd-footer-links--top','.sd-footer-tools--main','.sd-footer-language-row','.sd-footer-logo','.sd-footer-intro','.sd-footer-info'
    ];
    const revealEls=$$(revealGroups.join(','));
    revealEls.forEach((el,i)=>{
      el.classList.add('sd-reveal');
      el.style.setProperty('--sd-reveal-delay',`${Math.min((i%4)*55,165)}ms`);
    });
    if('IntersectionObserver' in window){
      const io=new IntersectionObserver(entries=>{
        entries.forEach(entry=>{
          if(entry.isIntersecting){entry.target.classList.add('is-visible');io.unobserve(entry.target)}
        });
      },{threshold:.12,rootMargin:'0px 0px -5% 0px'});
      revealEls.forEach(el=>io.observe(el));
    }else revealEls.forEach(el=>el.classList.add('is-visible'));
  }

  // Bottom reservation CTA: hidden at the very top, shown after a short scroll,
  // and kept visible all the way through the footer.
  const bottom=$('.sd-bottom-cta');
  const CTA_REVEAL_Y=140;
  function updateBottomCta(){
    if(!bottom) return;
    bottom.classList.toggle('is-hidden', window.scrollY < CTA_REVEAL_Y);
  }
  window.addEventListener('scroll', updateBottomCta, {passive:true});
  window.addEventListener('pageshow', updateBottomCta);
  updateBottomCta();



  // Design tone comparison: 기존 / 1안 / 2안 / 3안 / 4안
  const themeButtons=$$('[data-theme-choice]');
  const themeMeta=$('meta[name="theme-color"]');
  const THEME_STORAGE_KEY='sudam-tone-theme';
  const themeColors={
    default:'#2E1F12',
    classic:'#3B281F',
    minimal:'#111111',
    heritage:'#34352C',
    editorial:'#494040'
  };
  const validThemes=new Set(Object.keys(themeColors));

  function applyToneTheme(theme,save=true){
    const selected=validThemes.has(theme)?theme:'default';
    document.documentElement.setAttribute('data-sudam-theme',selected);
    themeButtons.forEach(btn=>{
      const active=btn.dataset.themeChoice===selected;
      btn.setAttribute('aria-pressed',String(active));
    });
    themeMeta?.setAttribute('content',themeColors[selected]);
    if(save){
      try{localStorage.setItem(THEME_STORAGE_KEY,selected)}catch(e){}
    }
    window.dispatchEvent(new Event('resize'));
  }

  let initialTheme='default';
  try{initialTheme=localStorage.getItem(THEME_STORAGE_KEY)||document.documentElement.getAttribute('data-sudam-theme')||'default'}catch(e){}
  applyToneTheme(initialTheme,false);
  themeButtons.forEach(btn=>btn.addEventListener('click',()=>applyToneTheme(btn.dataset.themeChoice,true)));


  // Lightweight GTM helper: works even before GTM is installed.
  document.addEventListener('click',e=>{
    const el=e.target.closest('[data-event]');if(!el)return;
    window.dataLayer=window.dataLayer||[];
    window.dataLayer.push({event:el.dataset.event,page_name:'main',section_name:el.dataset.section||'',item_name:el.dataset.item||el.textContent.trim().slice(0,40),cta_position:el.dataset.position||''});
  });
})();
