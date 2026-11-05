/* SUDAM v5.40 — custom menu swipe progress */
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
