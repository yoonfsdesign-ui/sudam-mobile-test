/* About & Menu pages: progressive enhancement on top of the v4.3 shared UI. */
(function(){
 'use strict';
 const $=(s,c=document)=>c.querySelector(s);
 const $$=(s,c=document)=>Array.from(c.querySelectorAll(s));
 const toast=$('.sd-toast'); let timer;
 const notify=msg=>{if(!toast)return;toast.textContent=msg;toast.classList.add('is-show');clearTimeout(timer);timer=setTimeout(()=>toast.classList.remove('is-show'),3200)};

 // Section navigation: scroll positions account for the sticky main header + tab bar.
 const anchors=$$('.sd-subanchors a');
 if(anchors.length && 'IntersectionObserver' in window){
   const targets=anchors.map(a=>document.querySelector(a.getAttribute('href'))).filter(Boolean);
   const observer=new IntersectionObserver(entries=>{
     const visibles=entries.filter(e=>e.isIntersecting).sort((a,b)=>a.boundingClientRect.top-b.boundingClientRect.top);
     if(visibles[0]) anchors.forEach(a=>a.classList.toggle('is-active',a.hash==='#'+visibles[0].target.id));
   },{rootMargin:'-162px 0px -56% 0px',threshold:0});
   targets.forEach(s=>observer.observe(s));
 }

 // Accessible modal used by provisional news and space-image zoom.
 const overlay=$('[data-sub-overlay]');
 const modalTitle=$('[data-sub-modal-title]');
 const modalBody=$('[data-sub-modal-body]');
 let previousFocus=null;
 function openModal(title,html,photo=false){
   if(!overlay)return;
   previousFocus=document.activeElement;
   if(modalTitle)modalTitle.textContent=title;
   if(modalBody)modalBody.innerHTML=html;
   overlay.classList.toggle('sd-sub-overlay--photo',photo);
   overlay.classList.add('is-open');overlay.setAttribute('aria-hidden','false');
   document.body.classList.add('sd-lock');
   $('[data-sub-modal-close]',overlay)?.focus();
 }
 function closeModal(){
   if(!overlay)return;
   overlay.classList.remove('is-open');overlay.classList.remove('sd-sub-overlay--photo');
   overlay.setAttribute('aria-hidden','true');document.body.classList.remove('sd-lock');
   if(modalBody)modalBody.textContent='';previousFocus?.focus?.();
 }
 $('[data-sub-modal-close]')?.addEventListener('click',closeModal);
 overlay?.addEventListener('click',e=>{if(e.target===overlay)closeModal()});
 document.addEventListener('keydown',e=>{
   if(!overlay?.classList.contains('is-open'))return;
   if(e.key==='Escape')closeModal();
   if(e.key==='Tab'){
     const focusable=$$('button:not([disabled]),a[href],input,select',overlay).filter(x=>x.offsetParent!==null);
     if(!focusable.length)return;
     const first=focusable[0],last=focusable[focusable.length-1];
     if(e.shiftKey&&document.activeElement===first){e.preventDefault();last.focus()}
     else if(!e.shiftKey&&document.activeElement===last){e.preventDefault();first.focus()}
   }
 });

 const news=[
   {type:'NOTICE',title:'수담한정식 소식 안내',body:'실제 공지와 행사 내용이 등록되면 이 위치에 제목, 기간, 상세 내용과 관련 이미지를 표시합니다.'},
   {type:'NEWS',title:'새로운 이야기 등록 준비 중',body:'게시 확정된 소식 자료를 전달받으면 콘텐츠를 업데이트합니다.'},
   {type:'EVENT',title:'행사 정보 등록 준비 중',body:'진행 중인 이벤트가 확인되면 행사 기간과 혜택을 안내합니다.'}
 ];
 $$('[data-news-index]').forEach(b=>b.addEventListener('click',()=>{
   const item=news[Number(b.dataset.newsIndex)]||news[0];
   openModal(item.title,`<span class="sd-sub-small-label">${item.type}</span><p>${item.body}</p><p class="sd-sub-muted">※ 현재 테스트용 안내 문구입니다. 실제 이벤트로 게시되지 않았습니다.</p>`);
 }));
 const moreNews=$('[data-news-expand]');
 moreNews?.addEventListener('click',()=>{
   const hidden=$('[data-news-extra]');if(!hidden)return;
   const expand=hidden.hidden;hidden.hidden=!expand;moreNews.setAttribute('aria-expanded',String(expand));
   moreNews.innerHTML=expand?'소식 접기 <span aria-hidden="true">↑</span>':'소식 전체보기 <span aria-hidden="true">↗</span>';
 });

 // Gallery: filter categories, left/right navigation, swipe, full-image dialog.
 const gallery=$('[data-gallery]');
 if(gallery){
   const assetsPrefix=gallery.dataset.assetPrefix||'../images/';
   const rooms=[
     {category:'외관',title:'수담한정식 외관',desc:'매장 방문 전 위치와 외관을 확인할 수 있는 영역입니다.',file:'valet-building.jpg'},
     {category:'로비',title:'로비 및 입구',desc:'방문 고객을 맞이하는 매장 공간을 살펴보세요.',file:'space-temp.jpg'},
     {category:'프라이빗룸',title:'프라이빗룸',desc:'소중한 모임을 위한 독립된 공간입니다.',file:'strength-temp.jpg'},
     {category:'행사 공간',title:'행사 공간',desc:'기업 및 단체 모임에 활용되는 공간입니다.',file:'meeting-temp.jpg'},
     {category:'프라이빗룸',title:'다양한 공간 구성',desc:'실제 공간 사진과 수용 인원 정보는 확인 후 추가됩니다.',file:'space-temp.jpg'}
   ];
   const filters=$$('[data-gallery-filter]');
   let category='전체',position=0;
   const visible=()=>rooms.filter(s=>category==='전체'||s.category===category);
   function render(){
     const list=visible(); if(!list.length)return;
     position=(position+list.length)%list.length;
     const item=list[position];
     const photo=$('[data-gallery-photo]',gallery);
     photo.src=assetsPrefix+item.file;photo.alt=item.title+' (임시 테스트 이미지)';
     $('[data-gallery-title]',gallery).textContent=item.title;
     $('[data-gallery-desc]',gallery).textContent=item.desc;
     $('[data-gallery-count]',gallery).textContent=`${String(position+1).padStart(2,'0')} / ${String(list.length).padStart(2,'0')}`;
     $('[data-gallery-dots]',gallery).innerHTML=list.map((s,i)=>`<span class="${i===position?'on':''}"></span>`).join('');
     filters.forEach(f=>{const active=f.dataset.galleryFilter===category;f.classList.toggle('is-active',active);f.setAttribute('aria-pressed',String(active))});
   }
   filters.forEach(f=>f.addEventListener('click',()=>{category=f.dataset.galleryFilter;position=0;render()}));
   $('[data-gallery-prev]',gallery)?.addEventListener('click',()=>{position--;render()});
   $('[data-gallery-next]',gallery)?.addEventListener('click',()=>{position++;render()});
   $('[data-gallery-zoom]',gallery)?.addEventListener('click',()=>{
     const item=visible()[position];
     openModal(item.title,`<img src="${assetsPrefix+item.file}" alt="${item.title}" /><p>${item.title} · 테스트 이미지</p>`,true);
   });
   let x=null;
   $('[data-gallery-zoom]',gallery)?.addEventListener('touchstart',e=>{x=e.touches[0]?.clientX},{passive:true});
   $('[data-gallery-zoom]',gallery)?.addEventListener('touchend',e=>{
     if(x==null)return; const dx=(e.changedTouches[0]?.clientX||x)-x;x=null;
     if(Math.abs(dx)>45){position+=dx<0?1:-1;render();e.preventDefault()}
   },{passive:false});
   render();
 }

 // Real course comparisons use one data source; no unverified prices or dishes.
 const left=$('[data-compare-left]'),right=$('[data-compare-right]');
 if(left&&right){
   const courses={
     daegam:{name:'대감상',price:'가격 확인 중',feature:'정갈한 한정식 코스',occasion:'가족모임 · 일반 모임',dish:'상세 메뉴 확정 후 반영'},
     jinyeon:{name:'진연상',price:'62,000원 / 1인',feature:'수담 대표 시그니처 코스',occasion:'생신 · 상견례',dish:'상세 메뉴 확정 후 반영'},
     sura:{name:'수라상',price:'82,000원 / 1인',feature:'격식을 갖춘 프리미엄 코스',occasion:'VIP · 비즈니스 모임',dish:'상세 메뉴 확정 후 반영'}
   };
   const fields=[['코스','name'],['가격','price'],['특징','feature'],['추천 모임','occasion'],['요리 구성','dish']];
   function draw(){
     const a=courses[left.value],b=courses[right.value],grid=$('[data-compare-grid]');if(!grid)return;
     grid.replaceChildren();
     fields.forEach(([label,key])=>{
       [label,a[key],b[key]].forEach((t,i)=>{
         const cell=document.createElement('div');cell.textContent=t;
         if(key==='name'&&i>0)cell.className='sd-sub-cellname';
         grid.appendChild(cell);
       });
     });
     $('[data-compare-alert]').hidden=left.value!==right.value;
   }
   [left,right].forEach(el=>el.addEventListener('change',draw));draw();
 }
})();
