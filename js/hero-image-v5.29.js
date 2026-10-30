/* SUDAM v5.29 — independent Hero image comparison */
(function(){
  'use strict';

  var STORAGE_KEY='sudam-hero-image';
  var root=document.documentElement;
  var hero=document.querySelector('.sd-hero');
  var img=hero&&hero.querySelector('.sd-hero-media img');
  var buttons=Array.prototype.slice.call(document.querySelectorAll('[data-hero-image-choice]'));

  if(!hero||!img||!buttons.length) return;

  var choices={
    default:{src:'./images/hero-main.jpg',alt:'수담한정식 메인 이미지'},
    image1:{src:'./images/hero-compare-01.jpg',alt:'수담한정식 외관'},
    image2:{src:'./images/hero-compare-02.jpg',alt:'수담한정식 입구 전통 장식장'},
    image3:{src:'./images/hero-compare-03.jpg',alt:'수담한정식 한정식 상차림'},
    image4:{src:'./images/hero-compare-04.jpg',alt:'수담한정식 프라이빗룸'},
    image5:{src:'./images/hero-compare-05.jpg',alt:'수담한정식 단체 프라이빗룸'},
    image6:{src:'./images/hero-compare-06.jpg',alt:'수담한정식 자연송이 궁중 신선로'}
  };

  function valid(key){return Object.prototype.hasOwnProperty.call(choices,key)}

  function setButtons(key){
    buttons.forEach(function(btn){
      var active=btn.getAttribute('data-hero-image-choice')===key;
      btn.setAttribute('aria-pressed',String(active));
      btn.classList.toggle('is-active',active);
    });
  }

  function commit(key){
    var choice=choices[key];
    root.setAttribute('data-sudam-hero-image',key);
    img.src=choice.src;
    img.alt=choice.alt;
    setButtons(key);
    hero.classList.remove('is-image-swapping');
  }

  function apply(key,save){
    key=valid(key)?key:'default';
    var choice=choices[key];

    if(img.getAttribute('src')===choice.src){
      root.setAttribute('data-sudam-hero-image',key);
      setButtons(key);
      if(save){try{localStorage.setItem(STORAGE_KEY,key)}catch(e){}}
      return;
    }

    hero.classList.add('is-image-swapping');
    var pre=new Image();
    pre.onload=function(){
      commit(key);
      if(save){try{localStorage.setItem(STORAGE_KEY,key)}catch(e){}}
    };
    pre.onerror=function(){
      hero.classList.remove('is-image-swapping');
      setButtons(root.getAttribute('data-sudam-hero-image')||'default');
    };
    pre.src=choice.src;
  }

  buttons.forEach(function(btn){
    btn.addEventListener('click',function(){
      apply(btn.getAttribute('data-hero-image-choice'),true);
    });
  });

  var saved='default';
  try{saved=localStorage.getItem(STORAGE_KEY)||'default'}catch(e){}
  apply(valid(saved)?saved:'default',false);
})();
