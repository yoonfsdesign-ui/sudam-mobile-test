/* Dismiss the homepage design comparison controls. */
(function(){
  'use strict';
  var q=function(s,c){return (c||document).querySelector(s)};
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
