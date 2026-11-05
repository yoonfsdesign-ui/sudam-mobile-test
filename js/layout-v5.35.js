/* SUDAM v5.35 — layout concept refinements + top button */
(function(){
  'use strict';
  var topBtn=document.querySelector('[data-scroll-top]');
  if(topBtn){
    topBtn.addEventListener('click',function(){
      try{window.scrollTo({top:0,behavior:'smooth'})}catch(e){window.scrollTo(0,0)}
    });
  }

  /* Keep slider measurements and maps healthy after visual layout changes. */
  var layoutButtons=Array.prototype.slice.call(document.querySelectorAll('[data-layout-choice]'));
  layoutButtons.forEach(function(btn){
    btn.addEventListener('click',function(){
      requestAnimationFrame(function(){
        window.dispatchEvent(new Event('resize'));
      });
      setTimeout(function(){window.dispatchEvent(new Event('resize'))},180);
    });
  });
})();
