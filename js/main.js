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
      this.count=$('[data-slider-count]',root);
      this.i=0;this.loop=root.dataset.loop!=='false';this.auto=Number(root.dataset.autoplay||0);
      this.timer=null;this.pauseTimer=null;this.startX=null;this.bind();this.render();this.startAuto();
    }
    bind(){
      this.prev?.addEventListener('click',()=>this.go(this.i-1,true));
      this.next?.addEventListener('click',()=>this.go(this.i+1,true));
      this.dots.forEach((d,n)=>d.addEventListener('click',()=>this.go(n,true)));
      this.track?.addEventListener('pointerdown',e=>{
        if(e.target.closest('a, button')) return;
        this.startX=e.clientX;
        this.track.setPointerCapture?.(e.pointerId);
      });
      this.track?.addEventListener('pointerup',e=>{if(this.startX==null)return;const dx=e.clientX-this.startX;this.startX=null;if(Math.abs(dx)>40)this.go(this.i+(dx<0?1:-1),true)});
      this.track?.addEventListener('pointercancel',()=>{this.startX=null});
      document.addEventListener('visibilitychange',()=>document.hidden?this.stopAuto():this.startAuto());
    }
    norm(n){return this.loop?(n+this.slides.length)%this.slides.length:Math.max(0,Math.min(this.slides.length-1,n))}
    go(n,user){this.i=this.norm(n);this.render();if(user)this.userPause()}
    render(){
      if(!this.track)return;
      this.track.style.transform=`translateX(${-this.i*100}%)`;
      this.slides.forEach((slide,index)=>slide.classList.toggle('is-active',index===this.i));
      this.dots.forEach((dot,index)=>{
        dot.classList.toggle('is-active',index===this.i);
        dot.setAttribute('aria-current',String(index===this.i));
      });
      if(this.count)this.count.textContent=`${this.i+1} / ${this.slides.length}`;
    }
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

  // Each review uses its own native scroll position and frame count.
  $$('[data-review-gallery]').forEach(gallery=>{
    const scroller=$('.sd-review-photos',gallery);
    const count=$('.sd-photo-count',gallery);
    const controls=count?.closest('.sd-gallery-controls');
    const frames=scroller ? Array.from(scroller.children) : [];
    if(!scroller||!controls||!frames.length)return;

    const total=frames.length;
    controls.hidden=total===1;
    gallery.style.setProperty('--review-count',total);
    if(total===1){
      scroller.removeAttribute('tabindex');
      return;
    }

    const motion=window.matchMedia('(prefers-reduced-motion: reduce)');
    const labelPart=value=>String(value).padStart(2,'0');
    let current=0;
    let target=null;
    let settleTimer;
    let drag=null;

    function sync(){
      const center=scroller.scrollLeft+scroller.clientWidth/2;
      let distance=Infinity;
      frames.forEach((frame,index)=>{
        const delta=Math.abs(frame.offsetLeft+frame.offsetWidth/2-center);
        if(delta<distance){
          distance=delta;
          current=index;
        }
      });
      target=null;
      const label=`${labelPart(current+1)} / ${labelPart(total)}`;
      if(count.textContent!==label)count.textContent=label;
      gallery.style.setProperty('--review-index',current);
    }

    function move(index,behavior){
      target=(index+total)%total;
      const padding=parseFloat(getComputedStyle(scroller).scrollPaddingLeft)||0;
      scroller.scrollTo({left:frames[target].offsetLeft-padding,behavior});
      queueSync();
    }

    function queueSync(){
      clearTimeout(settleTimer);
      settleTimer=setTimeout(sync,100);
    }

    const step=direction=>move((target??current)+direction,motion.matches?'instant':'smooth');
    scroller.addEventListener('scroll',queueSync,{passive:true});
    scroller.addEventListener('scrollend',sync);
    $$('[data-review-step]',gallery).forEach(button=>{
      button.addEventListener('click',()=>step(Number(button.dataset.reviewStep)));
    });

    scroller.addEventListener('keydown',event=>{
      if(event.key!=='ArrowRight'&&event.key!=='ArrowLeft')return;
      event.preventDefault();
      step(event.key==='ArrowRight'?1:-1);
    });

    scroller.addEventListener('pointerdown',event=>{
      if(event.pointerType!=='mouse'||event.button!==0)return;
      drag={id:event.pointerId,x:event.clientX,left:scroller.scrollLeft};
      scroller.classList.add('is-dragging');
      scroller.setPointerCapture(event.pointerId);
    });
    scroller.addEventListener('pointermove',event=>{
      if(drag?.id===event.pointerId)scroller.scrollLeft=drag.left+drag.x-event.clientX;
    });
    function endDrag(event){
      if(drag?.id!==event.pointerId)return;
      drag=null;
      scroller.classList.remove('is-dragging');
      sync();
      move(current,'instant');
    }
    scroller.addEventListener('pointerup',endDrag);
    scroller.addEventListener('pointercancel',endDrag);
    scroller.addEventListener('wheel',event=>{
      if(Math.abs(event.deltaY)<=Math.abs(event.deltaX))return;
      event.preventDefault();
      scroller.scrollLeft+=event.deltaY;
    },{passive:false});

    const align=()=>move(target??current,'instant');
    window.addEventListener('resize',align);
    window.addEventListener('sudam:layoutchange',()=>requestAnimationFrame(align));
    sync();
  });

  // Kakao Map Web(JavaScript) SDK-ready map.
  // Requires SUDAM_CONFIG.kakaoMapJavaScriptKey.
  // Without a key, the replaceable static map image remains visible and links to Kakao Map.
  const kakaoMapShells=$$('[data-kakao-map]');
  if(kakaoMapShells.length){
    const key=String(config.kakaoMapJavaScriptKey||'').trim();

    const renderKakaoMaps=()=>{
      if(!window.kakao?.maps)return;
      kakaoMapShells.forEach((shell)=>{
        const canvas=$('.sd-kakao-map-canvas',shell);
        if(!canvas || shell.classList.contains('is-live'))return;

        const lat=Number(shell.dataset.lat||37.5106603);
        const lng=Number(shell.dataset.lng||127.0459178);
        const level=Number(shell.dataset.level||3);
        const center=new kakao.maps.LatLng(lat,lng);
        const map=new kakao.maps.Map(canvas,{center,level});

        new kakao.maps.Marker({
          position:center,
          map,
          title:'수담한정식'
        });

        const zoomControl=new kakao.maps.ZoomControl();
        map.addControl(zoomControl,kakao.maps.ControlPosition.RIGHT);

        requestAnimationFrame(()=>{
          try{
            map.relayout();
            map.setCenter(center);
          }catch(_){}
        });

        shell.classList.add('is-live');
      });
    };

    const bootKakaoMap=()=>{
      if(!key)return;

      if(window.kakao?.maps?.Map){
        renderKakaoMaps();
        return;
      }

      if(window.kakao?.maps?.load){
        window.kakao.maps.load(renderKakaoMaps);
        return;
      }

      let script=document.querySelector('script[data-sudam-kakao-map-sdk]');
      if(script){
        script.addEventListener('load',()=>{
          if(window.kakao?.maps?.load)window.kakao.maps.load(renderKakaoMaps);
        },{once:true});
        return;
      }

      script=document.createElement('script');
      script.dataset.sudamKakaoMapSdk='true';
      script.src=`https://dapi.kakao.com/v2/maps/sdk.js?appkey=${encodeURIComponent(key)}&autoload=false`;
      script.async=true;
      script.onload=()=>{
        if(window.kakao?.maps?.load){
          window.kakao.maps.load(renderKakaoMaps);
        }
      };
      script.onerror=()=>{
        kakaoMapShells.forEach(shell=>shell.classList.remove('is-live'));
      };
      document.head.appendChild(script);
    };

    bootKakaoMap();
  }

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


  // Original/default reveal only.
  // Alternative themes use motion-v5.23.js so hard refresh never runs two
  // independent viewport animation observers at the same time.
  const reduceMotionQuery=window.matchMedia('(prefers-reduced-motion: reduce)');
  let bootTheme='default';
  try{
    bootTheme=document.documentElement.getAttribute('data-sudam-initial-theme')
      ||localStorage.getItem('sudam-tone-theme')
      ||'default';
  }catch(e){}
  if(!reduceMotionQuery.matches && bootTheme==='default'){
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
    const previous=document.documentElement.getAttribute('data-sudam-theme')||'default';
    document.documentElement.setAttribute('data-sudam-theme',selected);
    document.documentElement.removeAttribute('data-sudam-initial-theme');
    themeButtons.forEach(btn=>{
      const active=btn.dataset.themeChoice===selected;
      btn.setAttribute('aria-pressed',String(active));
    });
    themeMeta?.setAttribute('content',themeColors[selected]);
    if(save){
      try{localStorage.setItem(THEME_STORAGE_KEY,selected)}catch(e){}
    }
    window.dispatchEvent(new CustomEvent('sudam:themechange',{
      detail:{theme:selected,previous}
    }));
    window.dispatchEvent(new Event('resize'));
  }

  let initialTheme=document.documentElement.getAttribute('data-sudam-initial-theme')||'default';
  if(initialTheme==='default'){
    try{initialTheme=localStorage.getItem(THEME_STORAGE_KEY)||document.documentElement.getAttribute('data-sudam-theme')||'default'}catch(e){}
  }
  applyToneTheme(initialTheme,false);
  themeButtons.forEach(btn=>btn.addEventListener('click',()=>applyToneTheme(btn.dataset.themeChoice,true)));


  // Lightweight GTM helper: works even before GTM is installed.
  document.addEventListener('click',e=>{
    const el=e.target.closest('[data-event]');if(!el)return;
    window.dataLayer=window.dataLayer||[];
    window.dataLayer.push({event:el.dataset.event,page_name:'main',section_name:el.dataset.section||'',item_name:el.dataset.item||el.textContent.trim().slice(0,40),cta_position:el.dataset.position||''});
  });
})();
