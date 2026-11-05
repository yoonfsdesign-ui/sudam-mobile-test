/* SUDAM v5.36 — quality rework utilities */
(function(){
  'use strict';
  var root=document.documentElement;
  var hero=document.querySelector('.sd-hero');

  function refreshLayout(){
    requestAnimationFrame(function(){
      window.dispatchEvent(new Event('resize'));
    });
  }

  window.addEventListener('sudam:layoutchange',refreshLayout);
  window.addEventListener('sudam:themechange',refreshLayout);

  /* Keep TOP outside content controls. Hide it at the very top so it does not
     compete with the header, then reveal after the first viewport. */
  var topBtn=document.querySelector('[data-scroll-top]');
  if(topBtn){
    function syncTop(){
      topBtn.classList.toggle('is-visible',window.scrollY>240);
    }
    window.addEventListener('scroll',syncTop,{passive:true});
    syncTop();
  }
})();
