'use strict';
// Replace temporary content below with approved copy and real image assets.
const NEWS = [
  {type:'NEWS',title:'수담한정식의 새로운 소식을 전해드립니다',date:'자료 확인 후 등록',body:'이 영역에는 실제 매장 소식 또는 진행 중인 이벤트의 상세 내용을 등록합니다. 이벤트 기간, 혜택, 이용 조건은 운영 자료 확인 후 게시해 주세요.'},
  {type:'NOTICE',title:'매장 이용 및 예약 안내',date:'자료 확인 후 등록',body:'매장 이용과 예약에 관한 공지사항을 등록하는 영역입니다. 확정된 예약 정책과 이용 안내를 반영해 주세요.'},
  {type:'NEWS',title:'수담한정식의 특별한 모임 이야기',date:'자료 확인 후 등록',body:'가족모임과 기업행사 등 실제 운영 사례를 확인한 후 소식 콘텐츠로 등록할 수 있습니다.'},
  {type:'EVENT',title:'이벤트 안내 콘텐츠 등록 예정',date:'자료 확인 후 등록',body:'행사 내용이 확정되면 기간, 참여 방법, 유의사항과 이미지를 등록해 주세요.'}
];
const SPACES = [
  {category:'외관',title:'매장 외관',desc:'수담한정식의 첫인상을 만나는 공간',image:'./assets/space-exterior.jpg'},
  {category:'로비',title:'로비',desc:'방문객을 맞이하는 수담의 공간',image:'./assets/space-lobby.jpg'},
  {category:'프라이빗룸',title:'프라이빗룸',desc:'독립된 공간에서 편안하게 이어가는 소중한 모임',image:'./assets/space-private.jpg'},
  {category:'행사 공간',title:'행사 공간',desc:'모임의 목적과 인원에 맞춰 활용하는 공간',image:'./assets/space-event.jpg'},
  {category:'프라이빗룸',title:'프라이빗룸 상세',desc:'실제 룸 사진과 수용 인원은 추후 확인 후 등록',image:'./assets/space-private-2.jpg'}
];
const $ = (q) => document.querySelector(q);
const $$ = (q) => [...document.querySelectorAll(q)];
let toastTimer;
function toast(message){const el=$('#toast');el.textContent=message;el.classList.add('show');clearTimeout(toastTimer);toastTimer=setTimeout(()=>el.classList.remove('show'),3200)}
function setDrawer(open){const drawer=$('#drawer');drawer.classList.toggle('open',open);drawer.setAttribute('aria-hidden',String(!open));$('#drawer-backdrop').hidden=!open;$('#menu-toggle').setAttribute('aria-expanded',String(open));document.body.style.overflow=open?'hidden':'';if(open)$('#drawer-close').focus()}
$('#menu-toggle').addEventListener('click',()=>setDrawer(!$('#drawer').classList.contains('open')));
$('#drawer-close').addEventListener('click',()=>setDrawer(false));$('#drawer-backdrop').addEventListener('click',()=>setDrawer(false));$$('#drawer a').forEach(a=>a.addEventListener('click',()=>setDrawer(false)));
$('#language').addEventListener('change',e=>{if(e.target.value!=='ko'){toast('다국어 페이지는 추후 연결 예정입니다.');e.target.value='ko'}});
$$('[data-coming]').forEach(btn=>btn.addEventListener('click',()=>{setDrawer(false);toast(`${btn.dataset.coming}는 추후 연결 예정입니다.`)}));
function openModal(label,title,body){$('#modal-label').textContent=label;$('#modal-title').textContent=title;$('#modal-body').replaceChildren();if(typeof body==='string'){const p=document.createElement('p');p.textContent=body;$('#modal-body').appendChild(p)}else{$('#modal-body').appendChild(body)}$('#modal-backdrop').hidden=false;document.body.style.overflow='hidden';$('#modal-close').focus()}
function closeModal(){$('#modal-backdrop').hidden=true;document.body.style.overflow=''}
$('#modal-close').addEventListener('click',closeModal);$('#modal-backdrop').addEventListener('click',e=>{if(e.target===e.currentTarget)closeModal()});document.addEventListener('keydown',e=>{if(e.key==='Escape'){if(!$('#modal-backdrop').hidden)closeModal();else setDrawer(false)}});
function newsOpen(i){const item=NEWS[i];openModal(item.type,item.title,item.body)}
function renderNews(){const root=$('#news-list');root.innerHTML='';NEWS.slice(1,3).forEach((n,i)=>{const b=document.createElement('button');b.className='news-item';b.innerHTML=`<div><small>${n.type}</small><strong>${n.title}</strong><time>${n.date}</time></div><span>↗</span>`;b.addEventListener('click',()=>newsOpen(i+1));root.appendChild(b)})}
renderNews();$$('[data-news]').forEach(b=>b.addEventListener('click',()=>newsOpen(Number(b.dataset.news))));
$('#show-all-news').addEventListener('click',()=>{const box=document.createElement('div');NEWS.forEach((n,i)=>{const b=document.createElement('button');b.className='news-item';b.innerHTML=`<div><small>${n.type}</small><strong>${n.title}</strong></div><span>↗</span>`;b.addEventListener('click',()=>newsOpen(i));box.appendChild(b)});openModal('NEWS & EVENTS','수담의 전체 소식',box)});
$('[data-modal="chef"]').addEventListener('click',()=>openModal('MASTER CHEF','한식 명인의 정성과 철학','명인의 실제 이력, 직함, 주요 경력 및 인터뷰 원고를 확인한 후 이 영역에 반영합니다. 현재 문구는 기획용 임시 내용입니다.'));
let filter='전체',current=0;
function visibleSpaces(){return SPACES.map((s,i)=>({...s,index:i})).filter(s=>filter==='전체'||s.category===filter)}
function renderFilters(){const root=$('#space-filters');root.innerHTML='';['전체','외관','로비','프라이빗룸','행사 공간'].forEach(name=>{const b=document.createElement('button');b.textContent=name;b.classList.toggle('active',name===filter);b.setAttribute('aria-pressed',String(name===filter));b.addEventListener('click',()=>{filter=name;current=0;renderFilters();renderGallery()});root.appendChild(b)})}
function renderGallery(){const items=visibleSpaces(),item=items[current];$('#gallery-title').textContent=item.title;$('#gallery-description').textContent=item.desc;$('#gallery-image-label').textContent=item.title;$('#gallery-counter').textContent=`${String(current+1).padStart(2,'0')} / ${String(items.length).padStart(2,'0')}`;const gallery=$('#gallery-image');gallery.style.backgroundImage='';const img=new Image();img.onload=()=>{if(visibleSpaces()[current]?.image===item.image){gallery.style.backgroundImage=`linear-gradient(#0003,#0003),url("${item.image}")`;gallery.style.backgroundSize='cover';gallery.style.backgroundPosition='center'}};img.src=item.image}
function stepGallery(d){const n=visibleSpaces().length;current=(current+d+n)%n;renderGallery()}
$('#gallery-prev').addEventListener('click',()=>stepGallery(-1));$('#gallery-next').addEventListener('click',()=>stepGallery(1));
let touchX=0;$('#gallery-image').addEventListener('touchstart',e=>touchX=e.touches[0].clientX,{passive:true});$('#gallery-image').addEventListener('touchend',e=>{const dx=e.changedTouches[0].clientX-touchX;if(Math.abs(dx)>45)stepGallery(dx<0?1:-1)},{passive:true});
$('#gallery-image').addEventListener('click',()=>{const item=visibleSpaces()[current];const box=document.createElement('div');box.className='modal-image';box.textContent=item.title;const img=new Image();img.onload=()=>{box.style.background=`center / cover url("${item.image}")`;box.textContent=''};img.src=item.image;openModal('OUR SPACE',item.title,box)});renderFilters();renderGallery();
$('#proposal-download').addEventListener('click',async()=>{const path='./downloads/sudam-proposal.pdf';try{const response=await fetch(path,{method:'HEAD'});if(!response.ok)throw Error('missing');const a=document.createElement('a');a.href=path;a.download='수담한정식_제안서.pdf';document.body.appendChild(a);a.click();a.remove()}catch{toast('제안서 PDF는 아직 등록되지 않았습니다.')}});
function onScroll(){const y=window.scrollY;$('#fixed-booking').classList.toggle('visible',y>140);const sections=$$('main section[id]');let active='news';sections.forEach(s=>{if(s.getBoundingClientRect().top<=180)active=s.id});$$('.section-nav a').forEach(a=>a.classList.toggle('active',a.hash==='#'+active))}window.addEventListener('scroll',onScroll,{passive:true});onScroll();
