/* SUDAM v5.34 — visual layout comparison, content/order unchanged */
(function(){
  'use strict';
  var STORAGE_KEY='sudam-layout-variant';
  var root=document.documentElement;
  var allowed=['default','layout1','layout2','layout3'];
  var buttons=Array.prototype.slice.call(document.querySelectorAll('[data-layout-choice]'));

  function valid(v){return allowed.indexOf(v)!==-1}
  function setButtons(v){
    buttons.forEach(function(btn){
      var on=btn.getAttribute('data-layout-choice')===v;
      btn.classList.toggle('is-active',on);
      btn.setAttribute('aria-pressed',String(on));
    });
  }
  function apply(v,save){
    v=valid(v)?v:'default';
    root.setAttribute('data-sudam-layout',v);
    setButtons(v);
    if(save){try{localStorage.setItem(STORAGE_KEY,v)}catch(e){}}
    window.dispatchEvent(new CustomEvent('sudam:layoutchange',{detail:{layout:v}}));
  }

  buttons.forEach(function(btn){
    btn.addEventListener('click',function(){apply(btn.getAttribute('data-layout-choice'),true)});
  });

  // Small current/total indicator used by layout2 and layout3 only.
  ['#strength .sd-slider','#space .sd-slider'].forEach(function(sel){
    var slider=document.querySelector(sel);
    if(!slider)return;
    var slides=Array.prototype.slice.call(slider.querySelectorAll('.sd-slide'));
    if(!slides.length)return;
    var meta=document.createElement('div');
    meta.className='sd-layout-slider-meta';
    meta.setAttribute('aria-hidden','true');
    meta.innerHTML='<span class="current">01</span><span class="sep">/</span><span class="total">'+String(slides.length).padStart(2,'0')+'</span>';
    slider.appendChild(meta);
    function update(){
      var idx=slides.findIndex(function(s){return s.classList.contains('is-active')});
      if(idx<0)idx=0;
      meta.querySelector('.current').textContent=String(idx+1).padStart(2,'0');
    }
    var obs=new MutationObserver(update);
    slides.forEach(function(s){obs.observe(s,{attributes:true,attributeFilter:['class']})});
    update();
  });

  var requested=null;
  try{requested=new URLSearchParams(location.search).get('layout')}catch(e){}
  var saved=root.getAttribute('data-sudam-layout')||'default';
  if(requested&&valid(requested)) saved=requested;
  apply(saved,false);
})();
