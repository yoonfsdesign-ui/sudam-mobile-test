/* SUDAM v5.40 — custom menu swipe progress (original logic retained) */
(function(){
  'use strict';
  var grid=document.querySelector('#menu .sd-menu-grid');
  var thumb=document.querySelector('#menu .sd-menu-progress-thumb');
  if(!grid||!thumb)return;
  function sync(){
    var max=Math.max(0,grid.scrollWidth-grid.clientWidth);
    var ratio=max?Math.max(0,Math.min(1,grid.scrollLeft/max)):0;
    thumb.style.left=(ratio*66)+'%';
  }
  grid.addEventListener('scroll',sync,{passive:true});
  window.addEventListener('resize',sync,{passive:true});
  window.addEventListener('sudam:layoutchange',function(){requestAnimationFrame(sync)});
  sync();
})();

/* SUDAM v5.41 — isolated visual/UX feedback additions.
   Existing image links, menu sliders, theme and layout handlers are NOT replaced. */
(function(){
  'use strict';
  var $=function(s,c){return (c||document).querySelector(s)};
  var $$=function(s,c){return Array.from((c||document).querySelectorAll(s))};
  var root=document.documentElement;
  var link=document.createElement('link');
  link.rel='stylesheet';
  link.href=new URL('./css/polish-v5.41.css?v=20261126-541',document.baseURI).href;
  link.dataset.sudamV541='true';
  document.head.appendChild(link);

  // Trust copy: applies in existing + all 3 layouts; never changes actual icon images.
  var trust=$('.sd-trust-grid');
  if(trust){
    var item=trust.querySelector('.sd-trust-item');
    var main=item&&item.querySelector('.sd-trust-main');
    var note=item&&item.querySelector('.sd-trust-note');
    if(main)main.textContent='블루리본 5회 선정';
    if(note)note.textContent='2025–2027 3년 연속 선정';
  }

  // Avoid extra author-inserted line breaks in 2/3 while restoring originals in 0/1.
  var textNodes=$$('#strength .sd-slide-copy h3, #strength .sd-slide-copy p, #space .sd-slide-copy h3, #space .sd-slide-copy p');
  textNodes.forEach(function(node){node.dataset.sdV541Original=node.innerHTML});
  function alt(){return ['layout2','layout3'].includes(root.getAttribute('data-sudam-layout'))}
  var fitQueued=false;
  function fitLines(){
    fitQueued=false;
    var active=alt();
    textNodes.forEach(function(node){
      var raw=node.dataset.sdV541Original;
      var expected=active?raw.replace(/<br\s*\/?\s*>/gi,' ').replace(/\s{2,}/g,' '):raw;
      if(node.innerHTML!==expected) node.innerHTML=expected;
      node.style.removeProperty('font-size');
      node.style.removeProperty('letter-spacing');
    });
    if(!active)return;
    // Fit each complete sentence on one line, including small phones/long titles.
    textNodes.forEach(function(node){
      if(!node.clientWidth||!node.offsetParent)return;
      var base=parseFloat(getComputedStyle(node).fontSize)||18;
      var minimum=node.tagName==='H3'?11.5:10;
      var current=base;
      while(node.scrollWidth>node.clientWidth+1 && current>minimum){
        current=Math.max(minimum,current-.5);
        node.style.setProperty('font-size',current+'px','important');
      }
      if(node.scrollWidth>node.clientWidth+1){
        node.style.setProperty('letter-spacing','-.07em','important');
      }
    });
  }
  function queueFit(){if(fitQueued)return;fitQueued=true;requestAnimationFrame(fitLines)}
  link.addEventListener('load',queueFit);
  window.addEventListener('resize',queueFit,{passive:true});
  window.addEventListener('sudam:layoutchange',queueFit);
  $$('#strength .sd-slide, #space .sd-slide').forEach(function(slide){
    var observer=new MutationObserver(queueFit);
    observer.observe(slide,{attributes:true,attributeFilter:['class']});
  });

  // Real gallery images already exist and have shared swiping/autoplay in main.js.
  // Add visible prior/next controls and dots without replacing that behavior.
  $$('#reviews [data-review-gallery]').forEach(function(gallery){
    var scroller=$('.sd-review-photos',gallery);
    var images=scroller?$$('img',scroller):[];
    if(!scroller||images.length<2||$('.sd-v541-gallery-nav',gallery))return;
    var nav=document.createElement('div');
    nav.className='sd-v541-gallery-nav';
    nav.setAttribute('role','group');
    nav.setAttribute('aria-label','후기 사진 이동');
    var prev=document.createElement('button');
    var next=document.createElement('button');
    prev.type=next.type='button';
    prev.textContent='‹';next.textContent='›';
    prev.setAttribute('aria-label','이전 후기 사진');
    next.setAttribute('aria-label','다음 후기 사진');
    var dots=document.createElement('span');
    dots.className='sd-v541-gallery-dots';
    dots.setAttribute('aria-hidden','true');
    for(var i=0;i<images.length;i++)dots.appendChild(document.createElement('i'));
    nav.append(prev,dots,next);
    gallery.appendChild(nav);
    var index=0;
    function refresh(){
      if(!scroller.clientWidth)return;
      var center=scroller.scrollLeft+scroller.clientWidth/2;
      var nearest=0, best=Infinity;
      images.forEach(function(img,i){
        var d=Math.abs(img.offsetLeft+img.offsetWidth/2-center);
        if(d<best){best=d;nearest=i}
      });
      index=nearest;
      $$('.sd-v541-gallery-dots i',nav).forEach(function(el,i){el.classList.toggle('is-active',i===index)});
    }
    function move(step){
      refresh();
      var n=(index+step+images.length)%images.length;
      var pad=parseFloat(getComputedStyle(scroller).paddingLeft)||0;
      var left=Math.max(0,images[n].offsetLeft-pad);
      scroller.scrollTo({left:left,behavior:window.matchMedia('(prefers-reduced-motion: reduce)').matches?'auto':'smooth'});
      index=n;
      $$('.sd-v541-gallery-dots i',nav).forEach(function(el,i){el.classList.toggle('is-active',i===index)});
    }
    prev.addEventListener('click',function(e){e.preventDefault();move(-1)});
    next.addEventListener('click',function(e){e.preventDefault();move(1)});
    var ticking=false;
    scroller.addEventListener('scroll',function(){
      if(ticking)return;
      ticking=true;
      requestAnimationFrame(function(){ticking=false;refresh()});
    },{passive:true});
    requestAnimationFrame(refresh);
  });

  // Position TOP directly under the Layout 3 control; move away only on clipping.
  var topBtn=$('[data-scroll-top]');
  var layout3=$('[data-layout-choice="layout3"]');
  var placeQueued=false;
  function placeTop(){
    placeQueued=false;
    if(!topBtn||!layout3)return;
    var rect=layout3.getBoundingClientRect(), w=window.innerWidth, h=window.innerHeight;
    var width=40, gap=7;
    var fits=rect.width>0&&rect.height>0&&rect.left>=0&&rect.right<=w&&rect.top>=0&&rect.bottom+width+gap<=h-8;
    var x,y;
    if(fits){
      x=rect.left+(rect.width-width)/2;
      y=rect.bottom+gap;
      topBtn.dataset.v541Placed='under-layout3';
    }else{
      // On a clipped control strip, keep TOP reachable above the bottom CTA.
      x=Math.max(5,w-width-50);
      y=Math.max(74,Math.min(h-width-82,Math.round(h*.18)));
      topBtn.dataset.v541Placed='fallback';
    }
    topBtn.style.setProperty('--sd-v541-top-x',Math.max(4,Math.min(w-width-4,x))+'px');
    topBtn.style.setProperty('--sd-v541-top-y',Math.max(4,Math.min(h-width-4,y))+'px');
  }
  function queuePlace(){if(placeQueued)return;placeQueued=true;requestAnimationFrame(placeTop)}
  window.addEventListener('resize',function(){queueFit();queuePlace()},{passive:true});
  window.addEventListener('scroll',queuePlace,{passive:true});
  window.addEventListener('sudam:layoutchange',function(){queueFit();queuePlace()});
  link.addEventListener('load',queuePlace);
  queuePlace();queueFit();
})();
