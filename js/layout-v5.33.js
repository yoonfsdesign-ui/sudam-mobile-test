/* SUDAM v5.33 — independent layout comparison */
(function(){
  'use strict';

  var STORAGE_KEY='sudam-layout-choice';
  var root=document.documentElement;
  var main=document.querySelector('#sdMain');
  var buttons=Array.prototype.slice.call(document.querySelectorAll('[data-layout-choice]'));
  if(!main||!buttons.length) return;

  var valid={default:1,layout1:1,layout2:1,layout3:1};
  var hero=main.querySelector('.sd-hero');
  var trust=main.querySelector('.sd-trust');
  var strength=main.querySelector('#strength');
  var meeting=main.querySelector('#meeting');
  var menu=main.querySelector('#menu');
  var space=main.querySelector('#space');
  var reviews=main.querySelector('#reviews');
  var location=main.querySelector('#location');

  var sequences={
    default:[hero,trust,strength,meeting,menu,space,reviews,location],
    layout1:[hero,trust,strength,meeting,menu,space,reviews,location],
    layout2:[hero,trust,meeting,strength,menu,space,reviews,location],
    layout3:[hero,strength,trust,space,menu,meeting,reviews,location]
  };

  function setButtons(key){
    buttons.forEach(function(btn){
      var active=btn.getAttribute('data-layout-choice')===key;
      btn.setAttribute('aria-pressed',String(active));
      btn.classList.toggle('is-active',active);
    });
  }

  function reorder(key){
    (sequences[key]||sequences.default).forEach(function(node){
      if(node) main.appendChild(node);
    });
  }

  function syncSliders(){
    window.requestAnimationFrame(function(){
      window.dispatchEvent(new Event('resize'));
    });
  }

  function apply(key,save){
    if(!valid[key]) key='default';
    root.setAttribute('data-sudam-layout',key);
    reorder(key);
    setButtons(key);
    if(save){
      try{localStorage.setItem(STORAGE_KEY,key)}catch(e){}
    }
    try{
      window.dispatchEvent(new CustomEvent('sudam:layoutchange',{detail:{layout:key}}));
    }catch(e){}
    syncSliders();
  }

  buttons.forEach(function(btn){
    btn.addEventListener('click',function(){
      apply(btn.getAttribute('data-layout-choice'),true);
    });
  });

  var saved=root.getAttribute('data-sudam-initial-layout')||'default';
  if(!valid[saved]){
    try{saved=localStorage.getItem(STORAGE_KEY)||'default'}catch(e){saved='default'}
  }
  apply(valid[saved]?saved:'default',false);
})();
