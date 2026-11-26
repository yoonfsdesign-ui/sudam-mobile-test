/* SUDAM v5.42 — non-destructive design refinements for layout1/2/3.
   CSS is loaded explicitly from index.html. This script does NOT add stylesheets,
   replace any user images, overwrite links, or register a second slide engine. */
(function(){
  'use strict';
  var q=function(s,c){return (c||document).querySelector(s)};
  var qa=function(s,c){return Array.prototype.slice.call((c||document).querySelectorAll(s))};

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
})();
