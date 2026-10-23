/* SUDAM v5.23 motion system — alternate themes only */
(function(){
  'use strict';

  var root = document.documentElement;

  function isAltTheme(){
    var theme = root.getAttribute('data-sudam-theme') || 'default';
    return theme !== 'default';
  }

  function bootChrome(){
    root.classList.add('sd-motion-init');
    requestAnimationFrame(function(){
      requestAnimationFrame(function(){
        root.classList.add('sd-motion-mounted');
      });
    });

    var hero = document.querySelector('.sd-hero');
    if(hero) hero.classList.add('sd-motion-hero');

    var bottom = document.querySelector('.sd-bottom-cta');
    if(!bottom) return;

    var played = false;
    function playBottom(){
      if(played || !isAltTheme() || bottom.classList.contains('is-hidden')) return;
      played = true;
      bottom.classList.add('sd-motion-bottom-enter');
    }

    playBottom();

    if('MutationObserver' in window){
      var mo = new MutationObserver(playBottom);
      mo.observe(bottom,{attributes:true,attributeFilter:['class']});
      setTimeout(function(){
        playBottom();
        if(played) mo.disconnect();
      },1600);
    }else{
      setTimeout(playBottom,700);
    }
  }

  function markMotionTargets(){
    var headingSelectors = [
      '.sd-trust-caption',
      '#strength > .sd-kicker','#strength > .sd-title',
      '#meeting > .sd-kicker','#meeting > .sd-title',
      '#menu > .sd-kicker','#menu > .sd-title',
      '#space > .sd-kicker','#space > .sd-title',
      '#reviews > .sd-kicker','#reviews > .sd-title','#reviews > .sd-desc',
      '#location > .sd-kicker','#location > .sd-title','#location > .sd-desc'
    ];

    headingSelectors.forEach(function(sel){
      document.querySelectorAll(sel).forEach(function(el){
        el.setAttribute('data-sd-motion','heading');
      });
    });

    var trustItems = document.querySelectorAll('.sd-trust-item');
    if(trustItems[0]) trustItems[0].setAttribute('data-sd-motion','left');
    if(trustItems[1]) trustItems[1].setAttribute('data-sd-motion','right');

    document.querySelectorAll('#strength .sd-slider, #space .sd-slider, .sd-review-grid').forEach(function(el){
      el.setAttribute('data-sd-motion','media');
    });

    document.querySelectorAll('.sd-meeting-card').forEach(function(el,i){
      el.setAttribute('data-sd-motion', i % 2 ? 'card-right' : 'card-left');
      el.style.setProperty('--sd-motion-delay', (i * 55) + 'ms');
    });

    document.querySelectorAll('.sd-menu-card').forEach(function(el,i){
      el.setAttribute('data-sd-motion', i % 2 ? 'card-right' : 'card-left');
      el.style.setProperty('--sd-motion-delay', (i * 70) + 'ms');
    });

    document.querySelectorAll('.sd-menu-cta, .sd-map').forEach(function(el){
      el.setAttribute('data-sd-motion','open');
    });

    document.querySelectorAll('.sd-location-row, .sd-location-valet').forEach(function(el,i){
      el.setAttribute('data-sd-motion', i % 2 ? 'card-right' : 'card-left');
      el.style.setProperty('--sd-motion-delay', (i * 60) + 'ms');
    });
  }

  function observeMotion(){
    var els = Array.prototype.slice.call(document.querySelectorAll('[data-sd-motion]'));
    if(!els.length) return;

    if(!('IntersectionObserver' in window)){
      els.forEach(function(el){ el.classList.add('is-inview'); });
      return;
    }

    var io = new IntersectionObserver(function(entries){
      entries.forEach(function(entry){
        if(!entry.isIntersecting) return;
        var el = entry.target;
        var delay = getComputedStyle(el).getPropertyValue('--sd-motion-delay').trim();
        if(delay) el.style.animationDelay = delay;
        el.classList.add('is-inview');
        io.unobserve(el);
      });
    },{
      root:null,
      threshold:0.12,
      rootMargin:'0px 0px -7% 0px'
    });

    els.forEach(function(el){ io.observe(el); });
  }

  function init(){
    /* Marking is safe even when default is active;
       CSS motion is scoped to alternate themes only. */
    bootChrome();
    markMotionTargets();
    observeMotion();
  }

  if(document.readyState === 'loading'){
    document.addEventListener('DOMContentLoaded',init,{once:true});
  }else{
    init();
  }
})();
