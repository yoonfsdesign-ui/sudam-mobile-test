/* SUDAM v5.25-safe motion system — alternate themes only */
(function(){
  'use strict';

  var root = document.documentElement;

  function isAltTheme(){
    var theme = root.getAttribute('data-sudam-theme') || 'default';
    return theme !== 'default';
  }

  function markTargets(){
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
      el.style.setProperty('--sd-motion-delay',(i*45)+'ms');
    });

    document.querySelectorAll('.sd-menu-card').forEach(function(el,i){
      el.setAttribute('data-sd-motion', i % 2 ? 'card-right' : 'card-left');
      el.style.setProperty('--sd-motion-delay',(i*55)+'ms');
    });

    /* CTA can animate, but the map itself must never be hidden. */
    document.querySelectorAll('.sd-menu-cta').forEach(function(el){
      el.setAttribute('data-sd-motion','cta');
    });

    document.querySelectorAll('.sd-location-row, .sd-location-valet').forEach(function(el,i){
      el.setAttribute('data-sd-motion', i % 2 ? 'card-right' : 'card-left');
      el.style.setProperty('--sd-motion-delay',(i*45)+'ms');
    });
  }

  function revealAll(){
    document.querySelectorAll('[data-sd-motion]').forEach(function(el){
      el.classList.add('is-inview');
      el.style.animationDelay = '0ms';
    });
  }

  function observe(){
    var els = Array.prototype.slice.call(document.querySelectorAll('[data-sd-motion]'));
    if(!els.length) return;

    if(!('IntersectionObserver' in window)){
      revealAll();
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
      threshold:0.08,
      rootMargin:'0px 0px -4% 0px'
    });

    els.forEach(function(el){ io.observe(el); });

    /* Hard fail-safe: never leave content hidden. */
    setTimeout(function(){
      root.classList.add('sd-motion-failsafe');
      revealAll();
      io.disconnect();
    }, 2600);
  }

  function bootChrome(){
    var hero = document.querySelector('.sd-hero');
    if(hero) hero.classList.add('sd-motion-hero');

    var bottom = document.querySelector('.sd-bottom-cta');
    if(bottom){
      var play = function(){
        if(!bottom.classList.contains('is-hidden')){
          bottom.classList.add('sd-motion-bottom-enter');
        }
      };
      play();
      if('MutationObserver' in window){
        var mo = new MutationObserver(play);
        mo.observe(bottom,{attributes:true,attributeFilter:['class']});
        setTimeout(function(){ play(); mo.disconnect(); },1800);
      }
    }
  }

  function init(){
    if(!isAltTheme()) return;

    markTargets();

    /* Only now do CSS hidden states become eligible. */
    root.classList.add('sd-motion-ready');

    bootChrome();
    observe();
  }

  if(document.readyState === 'loading'){
    document.addEventListener('DOMContentLoaded',init,{once:true});
  }else{
    init();
  }
})();
