/* Scroll controls and progress for the representative course rail. */
(function(){
  'use strict';
  const rail=document.querySelector('#sdCourseRail');
  const navigation=document.querySelector('.sd-menu-navigation');
  if(!rail||!navigation)return;

  const previous=navigation.querySelector('[data-course-step="-1"]');
  const next=navigation.querySelector('[data-course-step="1"]');
  const thumb=navigation.querySelector('.sd-menu-progress-thumb');
  const count=navigation.querySelector('[data-course-count]');
  const cards=Array.from(rail.querySelectorAll('.sd-menu-card'));
  if(cards.length<2)return;
  const motion=window.matchMedia('(prefers-reduced-motion: reduce)');
  const maxScroll=()=>Math.max(0,rail.scrollWidth-rail.clientWidth);

  function sync(){
    const max=maxScroll();
    const left=Math.max(0,Math.min(rail.scrollLeft,max));
    const fraction=max ? left/max : 0;
    thumb.style.left=fraction*66+'%';
    if(count)count.textContent=`${1+Math.round(fraction*(cards.length-1))} / ${cards.length}`;
    previous.disabled=left<=1;
    next.disabled=max-left<=1;
  }

  function step(direction){
    const max=maxScroll();
    const first=cards[0].getBoundingClientRect().left;
    const positions=cards.map(card=>Math.min(max,card.getBoundingClientRect().left-first));
    const left=rail.scrollLeft;
    const destination=direction>0
      ? positions.find(position=>position>left+1)
      : positions.reverse().find(position=>position<left-1);
    if(destination!==undefined){
      rail.scrollTo({left:destination,behavior:motion.matches?'instant':'smooth'});
    }
  }
  previous.addEventListener('click',()=>step(-1));
  next.addEventListener('click',()=>step(1));
  rail.addEventListener('scroll',sync,{passive:true});
  window.addEventListener('resize',sync,{passive:true});
  window.addEventListener('sudam:layoutchange',()=>requestAnimationFrame(sync));
  sync();
})();
