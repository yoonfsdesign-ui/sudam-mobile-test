/* SUDAM v5.42 — non-destructive design refinements for layout1/2/3.
   CSS is loaded explicitly from index.html. This script does NOT add stylesheets,
   replace any user images, overwrite links, or register a second slide engine. */
(function(){
  'use strict';
  var root=document.documentElement;
  var q=function(s,c){return (c||document).querySelector(s)};
  var qa=function(s,c){return Array.prototype.slice.call((c||document).querySelectorAll(s))};
  var rafPending=false;
  var savedCopy=[];

  /* Source data is updated both in index.html (by installer) and here as a safeguard. */
  var blue=q('.sd-trust-item:first-child');
  if(blue){
    var main=q('.sd-trust-main',blue),note=q('.sd-trust-note',blue);
    if(main)main.textContent='블루리본 5회 선정';
    if(note)note.textContent='2025·2026·2027 연속 선정';
  }

  /* Phrases, not automatic no-wrap on entire sentences. Original text is retained
     verbatim for the default/first layout. The chosen breaks are content-aware. */
  var rules={
    strength:[
      {h3:['27개의 프라이빗룸'],p:['작은 모임부터 격식 있는 행사까지','소중한 순간을 위한 독립된 공간']},
      {h3:['국가공인 조리명인의','제철한정식'],p:['이성자 명장의 정성과','15가지 이상의 코스요리']},
      {h3:['모임을 완성하는','전문성과 노하우'],p:['기업행사부터 글로벌 모임까지','격식 있는 진행 경험']}
    ],
    space:[
      {h3:['대규모 행사까지','단독룸 구성'],p:['프라이빗한 모임을 위한','다양한 규모의 공간']},
      {h3:['대규모 행사까지','단독룸 구성'],p:['프라이빗한 모임을 위한','다양한 규모의 공간']},
      {h3:['대규모 행사까지','단독룸 구성'],p:['프라이빗한 모임을 위한','다양한 규모의 공간']}
    ]
  };
  ['strength','space'].forEach(function(name){
    qa('#'+name+' .sd-slide').forEach(function(slide,i){
      ['h3','p'].forEach(function(tag){
        var node=q('.sd-slide-copy '+tag,slide);
        if(!node)return;
        savedCopy.push({node:node,original:node.innerHTML,phrases:(rules[name][i]||{})[tag]||null});
      });
    });
  });
  function normalized(html){
    var temp=document.createElement('div');
    temp.innerHTML=html.replace(/<br\s*\/?\s*>/gi,' ');
    return (temp.textContent||'').replace(/\s+/g,' ').trim();
  }
  function renderPhrases(entry){
    var node=entry.node;
    var phrases=entry.phrases;
    if(!phrases||normalized(entry.original)!==phrases.join(' ')){
      // Unknown edited text: preserve it rather than apply another version's copy.
      return;
    }
    node.textContent='';
    phrases.forEach(function(t){
      var span=document.createElement('span');span.className='sd-v542-copy-line';span.textContent=t;node.appendChild(span);
    });
  }
  function fitPhrases(){
    var layout=root.getAttribute('data-sudam-layout');
    var alt=layout==='layout2'||layout==='layout3';
    savedCopy.forEach(function(e){
      if(!alt || !e.phrases){
        if(e.node.innerHTML!==e.original)e.node.innerHTML=e.original;
        return;
      }
      if(!q('.sd-v542-copy-line',e.node))renderPhrases(e);
    });
    if(!alt)return;
    savedCopy.forEach(function(e){
      qa('.sd-v542-copy-line',e.node).forEach(function(span){
        span.style.removeProperty('font-size');span.classList.remove('sd-v542-allow-wrap');
        if(!span.clientWidth)return;
        var baseline=parseFloat(getComputedStyle(span).fontSize)||18;
        var min=e.node.tagName==='H3'?18:11;
        var next=baseline;
        // Only a restrained two-pixel adjustment; never shrink into illegibility.
        while(span.scrollWidth>span.clientWidth+1 && next>Math.max(min,baseline-2)){
          next=Math.max(min,baseline-2,next-.5);
          span.style.setProperty('font-size',next+'px','important');
        }
        if(span.scrollWidth>span.clientWidth+1)span.classList.add('sd-v542-allow-wrap');
      });
    });
  }
  function queueFit(){
    if(rafPending)return;
    rafPending=true;
    requestAnimationFrame(function(){rafPending=false;fitPhrases()});
  }
  window.addEventListener('sudam:layoutchange',queueFit);
  window.addEventListener('resize',queueFit,{passive:true});
  if(document.fonts&&document.fonts.ready)document.fonts.ready.then(queueFit);
  qa('#strength .sd-slide, #space .sd-slide').forEach(function(slide){
    var observer=new MutationObserver(queueFit);
    observer.observe(slide,{attributes:true,attributeFilter:['class']});
  });

  /* Review galleries retain their existing shared autoplay and swipe handlers.
     These controls merely scroll the original scroll container. */
  qa('#reviews [data-review-gallery]').forEach(function(gallery){
    var scroller=q('.sd-review-photos',gallery),images=scroller?qa('img',scroller):[];
    if(images.length<2||q('.sd-v542-gallery-nav',gallery))return;
    // Clean up a previous failed incremental patch if it somehow persisted in markup.
    var old=q('.sd-v541-gallery-nav',gallery);if(old)old.remove();
    var nav=document.createElement('div');nav.className='sd-v542-gallery-nav';
    nav.setAttribute('role','group');nav.setAttribute('aria-label','후기 사진 이동');
    var prev=document.createElement('button'),next=document.createElement('button');
    prev.type=next.type='button';prev.textContent='‹';next.textContent='›';
    prev.setAttribute('aria-label','이전 사진');next.setAttribute('aria-label','다음 사진');
    var dots=document.createElement('span');dots.className='sd-v542-gallery-dots';dots.setAttribute('aria-hidden','true');
    images.forEach(function(){dots.appendChild(document.createElement('i'))});
    nav.appendChild(prev);nav.appendChild(dots);nav.appendChild(next);gallery.appendChild(nav);
    var queued=false;
    function nearest(){
      var center=scroller.scrollLeft+scroller.clientWidth/2,idx=0,distance=Infinity;
      images.forEach(function(img,i){
        var d=Math.abs(img.offsetLeft+img.offsetWidth/2-center);
        if(d<distance){idx=i;distance=d;}
      });
      return idx;
    }
    function sync(){
      queued=false;if(!scroller.clientWidth)return;
      var current=nearest();
      qa('i',dots).forEach(function(dot,i){dot.classList.toggle('is-active',i===current)});
    }
    function move(direction){
      gallery.dispatchEvent(new CustomEvent('sudam:reviewstep',{detail:direction}));
    }
    prev.addEventListener('click',function(e){e.preventDefault();move(-1)});
    next.addEventListener('click',function(e){e.preventDefault();move(1)});
    scroller.addEventListener('scroll',function(){if(queued)return;queued=true;requestAnimationFrame(sync)},{passive:true});
    requestAnimationFrame(sync);
  });

  var dock=q('.sd-compare-dock'),compare=dock && q('details',dock);
  if(compare){
    document.addEventListener('click',function(e){
      if(!dock.contains(e.target)||e.target.closest('[data-scroll-top]'))compare.open=false;
    });
    document.addEventListener('keydown',function(e){
      if(e.key==='Escape'&&compare.open){
        compare.open=false;
        q('summary',compare).focus();
      }
    });
  }
  queueFit();
})();
