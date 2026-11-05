/* SUDAM v5.37 — external TOP visibility + layout refresh */
(function(){
  'use strict';
  var topBtn=document.querySelector('[data-scroll-top]');
  if(topBtn){
    function syncTop(){ topBtn.classList.toggle('is-visible',window.scrollY>220); }
    window.addEventListener('scroll',syncTop,{passive:true});
    syncTop();
  }
  function refresh(){ requestAnimationFrame(function(){ window.dispatchEvent(new Event('resize')); }); }
  window.addEventListener('sudam:layoutchange',refresh);
})();
