/* SUDAM v5.27 — stable alternate-theme motion lifecycle */
(function(){
  'use strict';

  var root=document.documentElement;
  var io=null;
  var failTimer=0;
  var marked=false;

  function currentTheme(){
    return root.getAttribute('data-sudam-theme')||'default';
  }
  function isAlt(theme){
    return theme && theme!=='default';
  }
  function reduceMotion(){
    return window.matchMedia &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  }

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
    ].forEach(function(sel){
      document.querySelectorAll(sel).forEach(function(el){
        el.setAttribute('data-sd-motion','heading');
      });
    });

    var trust=document.querySelectorAll('.sd-trust-item');
    if(trust[0]) trust[0].setAttribute('data-sd-motion','left');
    if(trust[1]) trust[1].setAttribute('data-sd-motion','right');

    document.querySelectorAll('#strength .sd-slider,#space .sd-slider,.sd-review-grid')
      .forEach(function(el){el.setAttribute('data-sd-motion','media')});

    document.querySelectorAll('.sd-meeting-card,.sd-menu-card')
      .forEach(function(el,i){
        el.setAttribute('data-sd-motion',i%2?'card-right':'card-left');
        el.style.setProperty('--sd-motion-delay',Math.min(i*50,150)+'ms');
      });

    document.querySelectorAll('.sd-menu-cta')
      .forEach(function(el){el.setAttribute('data-sd-motion','cta')});

    document.querySelectorAll('.sd-location-row,.sd-location-valet')
      .forEach(function(el,i){
        el.setAttribute('data-sd-motion',i%2?'card-right':'card-left');
        el.style.setProperty('--sd-motion-delay',Math.min(i*45,135)+'ms');
      });
  }

  function allTargets(){
    return Array.prototype.slice.call(document.querySelectorAll('[data-sd-motion]'));
  }

  function revealAll(){
    allTargets().forEach(function(el){
      el.classList.add('is-inview');
    });
  }

  function stopObserver(){
    if(io){io.disconnect();io=null}
    if(failTimer){clearTimeout(failTimer);failTimer=0}
  }

  function startObserver(){
    stopObserver();
    var targets=allTargets();
    if(!targets.length) return;

    if(reduceMotion() || !('IntersectionObserver' in window)){
      revealAll();
      return;
    }

    io=new IntersectionObserver(function(entries){
      entries.forEach(function(entry){
        if(!entry.isIntersecting) return;
        var el=entry.target;
        var delay=getComputedStyle(el).getPropertyValue('--sd-motion-delay').trim();
        if(delay) el.style.animationDelay=delay;
        el.classList.add('is-inview');
        io.unobserve(el);
      });
    },{
      threshold:0.06,
      rootMargin:'0px 0px -3% 0px'
    });

    targets.forEach(function(el){
      el.classList.remove('is-inview');
      io.observe(el);
    });

    /* Safety only: never let content remain hidden if browser observer stalls. */
    failTimer=window.setTimeout(function(){
      revealAll();
      stopObserver();
    },1800);
  }

  function activate(){
    markTargets();

    /* Remove classes from the old/default reveal system if the user
       changed from default to an alternative theme after page load. */
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

  function sync(theme){
    if(isAlt(theme)){
      activate();
    }else{
      deactivate();
    }
  }

  window.addEventListener('sudam:themechange',function(e){
    sync((e.detail&&e.detail.theme)||currentTheme());
  });

  function init(){
    sync(currentTheme());
  }

  if(document.readyState==='loading'){
    document.addEventListener('DOMContentLoaded',init,{once:true});
  }else{
    init();
  }
})();