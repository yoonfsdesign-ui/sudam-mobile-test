/* SUDAM v5.28 — stable alternative-theme motion lifecycle */
(function(){
  'use strict';

  var root=document.documentElement;
  var io=null;
  var fallbackTimer=0;
  var marked=false;

  function currentTheme(){return root.getAttribute('data-sudam-theme')||'default'}
  function isAlt(theme){return !!theme && theme!=='default'}
  function reduceMotion(){return !!(window.matchMedia&&window.matchMedia('(prefers-reduced-motion: reduce)').matches)}

  function markTargets(){
    if(marked) return;
    marked=true;
    [
      '.sd-trust-caption',
      '#strength > .sd-kicker','#strength > .sd-title',
      '#meeting > .sd-kicker','#meeting > .sd-title',
      '#menu > .sd-kicker','#menu > .sd-title',
      '#space > .sd-kicker','#space > .sd-title',
      '#reviews > .sd-kicker','#reviews > .sd-title','#reviews > .sd-desc',
      '#location > .sd-kicker','#location > .sd-title','#location > .sd-desc'
    ].forEach(function(sel){document.querySelectorAll(sel).forEach(function(el){el.setAttribute('data-sd-motion','heading')})});

    var trust=document.querySelectorAll('.sd-trust-item');
    if(trust[0]) trust[0].setAttribute('data-sd-motion','left');
    if(trust[1]) trust[1].setAttribute('data-sd-motion','right');

    document.querySelectorAll('#strength .sd-slider,#space .sd-slider,.sd-review-grid')
      .forEach(function(el){el.setAttribute('data-sd-motion','media')});

    document.querySelectorAll('.sd-meeting-card,.sd-menu-card').forEach(function(el,i){
      el.setAttribute('data-sd-motion',i%2?'card-right':'card-left');
      el.style.setProperty('--sd-motion-delay',Math.min(i*50,150)+'ms');
    });

    document.querySelectorAll('.sd-menu-cta').forEach(function(el){el.setAttribute('data-sd-motion','cta')});

    document.querySelectorAll('.sd-location-row,.sd-location-valet').forEach(function(el,i){
      el.setAttribute('data-sd-motion',i%2?'card-right':'card-left');
      el.style.setProperty('--sd-motion-delay',Math.min(i*45,135)+'ms');
    });
  }

  function allTargets(){return Array.prototype.slice.call(document.querySelectorAll('[data-sd-motion]'))}

  function reveal(el){
    if(!el||el.classList.contains('is-inview')) return;
    var delay=getComputedStyle(el).getPropertyValue('--sd-motion-delay').trim();
    if(delay) el.style.animationDelay=delay;
    el.classList.add('is-inview');
  }
  function revealAll(){allTargets().forEach(reveal)}
  function revealVisible(){
    var vh=window.innerHeight||document.documentElement.clientHeight||0;
    var vw=window.innerWidth||document.documentElement.clientWidth||0;
    allTargets().forEach(function(el){
      if(el.classList.contains('is-inview')) return;
      var r=el.getBoundingClientRect();
      if(r.width<=0||r.height<=0) return;
      if(r.bottom>=-16&&r.top<=vh+16&&r.right>=0&&r.left<=vw) reveal(el);
    });
  }

  function stopObserver(){
    if(io){io.disconnect();io=null}
    if(fallbackTimer){clearTimeout(fallbackTimer);fallbackTimer=0}
  }

  function startObserver(){
    stopObserver();
    var targets=allTargets();
    if(!targets.length) return;
    if(reduceMotion()||!('IntersectionObserver' in window)){revealAll();return}

    io=new IntersectionObserver(function(entries){
      entries.forEach(function(entry){
        if(!entry.isIntersecting) return;
        reveal(entry.target);
        io.unobserve(entry.target);
      });
    },{threshold:.06,rootMargin:'0px 0px -3% 0px'});

    targets.forEach(function(el){
      el.classList.remove('is-inview');
      el.style.removeProperty('animation-delay');
      io.observe(el);
    });

    /* 안전장치는 현재 viewport 안의 요소만 보인다.
       화면 아래 요소는 미리 소진시키지 않고 observer에 남긴다. */
    fallbackTimer=window.setTimeout(function(){revealVisible();fallbackTimer=0},650);
  }

  function activate(){
    markTargets();
    document.querySelectorAll('.sd-reveal').forEach(function(el){
      el.classList.remove('sd-reveal','is-visible');
      el.style.removeProperty('--sd-reveal-delay');
    });
    root.classList.remove('sd-motion-ready','sd-motion-failsafe');
    root.classList.add('sd-motion-v527');
    var hero=document.querySelector('.sd-hero');
    if(hero) hero.classList.add('sd-motion-hero');
    startObserver();
  }

  function deactivate(){
    stopObserver();
    revealAll();
    root.classList.remove('sd-motion-v527','sd-motion-ready','sd-motion-failsafe');
  }

  function sync(theme){if(isAlt(theme)) activate(); else deactivate()}
  window.addEventListener('sudam:themechange',function(e){sync((e.detail&&e.detail.theme)||currentTheme())});

  function init(){
    sync(currentTheme());
    window.addEventListener('pageshow',revealVisible,{passive:true});
    window.addEventListener('resize',revealVisible,{passive:true});
  }

  if(document.readyState==='loading') document.addEventListener('DOMContentLoaded',init,{once:true});
  else init();
})();
