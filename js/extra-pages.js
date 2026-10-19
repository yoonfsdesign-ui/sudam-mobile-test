/* v4.3 additional subpage prototypes. No backend or customer data collection. */
(function(){
 'use strict';
 const $=(s,root=document)=>root.querySelector(s);
 const $$=(s,root=document)=>Array.from(root.querySelectorAll(s));
 const cfg=window.SUDAM_CONFIG?.urls||{};
 const urlRoot=cfg.nav_reviews||'../reviews/';
 const msgEl=$('.sd-toast');let msgTimer;
 const msg=(s)=>{if(msgEl){msgEl.textContent=s;msgEl.classList.add('is-show');clearTimeout(msgTimer);msgTimer=setTimeout(()=>msgEl.classList.remove('is-show'),3400)}};
 const esc=s=>String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
 const num=v=>new Intl.NumberFormat('ko-KR').format(v);
 const eventTypes={family:'생신 · 가족모임',formal:'상견례',baby:'돌잔치 · 백일',vip:'비즈니스 · VIP',corporate:'학회 · 협회 · 기업',group:'단체행사',wedding:'하우스웨딩'};
 const copy=async value=>{
   try{if(navigator.clipboard&&window.isSecureContext){await navigator.clipboard.writeText(value);return true}}
   catch(_e){}
   const input=document.createElement('textarea');input.value=value;input.style.cssText='position:fixed;left:-9999px;top:0;';document.body.appendChild(input);input.select();
   let done=false;try{done=document.execCommand('copy')}catch(_e){}input.remove();return done;
 };
 // Budget estimation based on visible, provisional course price in prototype.
 $$('[data-budget]').forEach(box=>{
   const input=$('[data-budget-people]',box),out=$('[data-budget-result]',box),unit=Number(box.dataset.unit);
   if(!input||!out)return;
   const update=()=>{const n=Math.floor(Number(input.value));out.textContent=unit&&n>=1&&n<=999?'약 '+num(unit*n)+'원':unit?'1~999명 범위로 입력해 주세요':'코스 가격 확인 후 계산 가능'};
   input.addEventListener('input',update);update();
 });

 // Review catalogue is demonstrative only: do NOT relabel as real testimonials.
 const REVIEWS=[
 {id:'r01',occasion:'family',size:8,course:'진연상',tags:['가족모임','생신','프라이빗룸'],image:'meeting-temp.jpg',title:'부모님 생신에 어울리는 식사 분위기',excerpt:'조용한 독립 공간과 한정식 상차림을 중심으로 가족모임 후기를 구성하는 예시입니다.',body:'부모님 생신을 위한 모임이 어떤 분위기인지 미리 살펴볼 수 있도록 만든 샘플 콘텐츠입니다. 실제 후기가 연결되면 고객이 방문한 인원, 선택한 메뉴, 사용한 공간과 방문 경험을 이곳에 표시합니다.'},
 {id:'r02',occasion:'formal',size:6,course:'진연상',tags:['상견례','프라이빗룸','분위기'],image:'space-temp.jpg',title:'차분한 상견례 공간을 살펴보는 후기',excerpt:'양가가 함께하는 자리에서 공간과 좌석 구성을 확인하는 후기 화면 예시입니다.',body:'상견례처럼 중요한 만남에서는 식사 경험뿐 아니라 프라이빗룸의 분위기가 중요한 정보입니다. 실제 이용 후기가 확보되면 이 부분을 고객의 원문으로 교체합니다.'},
 {id:'r03',occasion:'vip',size:4,course:'수라상',tags:['비즈니스','음식','프라이빗룸'],image:'hero-temp.jpg',title:'비즈니스 자리와 프리미엄 코스',excerpt:'조용한 비즈니스 만남에서 메뉴 선택을 고려하는 고객을 위한 샘플입니다.',body:'비즈니스 모임에 관한 후기 상세화면의 문단, 사진, 관련 코스 및 예약 이동을 보여주는 테스트용 문구입니다.'},
 {id:'r04',occasion:'group',size:24,course:'대감상',tags:['단체','분위기','음식'],image:'meeting-temp.jpg',title:'여러 명이 함께하는 단체모임',excerpt:'인원이 많을 때 공간의 구성과 행사 동선을 확인하는 후기 화면 예시입니다.',body:'단체 고객이 필요로 하는 룸 수용 인원과 행사 진행 경험을 한눈에 살펴보는 용도로 구성한 더미 콘텐츠입니다.'},
 {id:'r05',occasion:'baby',size:12,course:'진연상',tags:['가족모임','분위기','프라이빗룸'],image:'strength-temp.jpg',title:'온 가족이 함께하는 백일 기념 식사',excerpt:'어른과 아이가 함께하는 특별한 기념일에 필요한 정보를 보여주는 샘플입니다.',body:'백일 및 돌잔치 관련 후기 구성 예시입니다. 촬영, 소품, 공간 관련 정보는 실제 제공 여부 확인 후 업데이트해야 합니다.'},
 {id:'r06',occasion:'corporate',size:36,course:'수라상',tags:['단체','비즈니스','분위기'],image:'meeting-temp.jpg',title:'공식 교류 행사를 위한 공간 이야기',excerpt:'학회·협회·기업 모임을 준비하는 담당자가 참고할 수 있는 후기 유형 예시입니다.',body:'기업행사와 공식 단체모임 후기가 게시될 경우 예시로 보여주는 텍스트입니다. 실제 기업명 또는 고객 발언을 꾸며 작성한 자료가 아닙니다.'},
 {id:'r07',occasion:'family',size:3,course:'대감상',tags:['가족모임','음식','분위기'],image:'menu-temp.jpg',title:'세 명이 함께하는 작은 가족 식사',excerpt:'소규모 식사 예약 고객을 위한 메뉴·공간 정보 노출 예시입니다.',body:'모임 인원 필터가 2~4명인 경우 검색되도록 구성한 테스트용 후기 상세입니다.'},
 {id:'r08',occasion:'wedding',size:58,course:'수라상',tags:['단체','분위기','프라이빗룸'],image:'space-temp.jpg',title:'소규모 웨딩의 분위기를 상상하는 공간',excerpt:'웨딩 유형 필터와 행사 안내 연결을 검토하기 위한 더미 사례입니다.',body:'웨딩 서비스 제공 여부나 실제 진행 사례를 의미하지 않습니다. 해당 모임 유형의 후기가 확보된 이후 실제 운영 사례로만 교체해야 합니다.'},
 {id:'r09',occasion:'formal',size:5,course:'수라상',tags:['상견례','음식','분위기'],image:'hero-temp.jpg',title:'격식 있는 한 상과 조용한 자리',excerpt:'상견례에 적합한 코스를 비교해 보는 고객 관점의 샘플입니다.',body:'이용 코스와 모임 유형을 함께 검색할 수 있는 인터페이스를 시험하기 위한 문구입니다.'},
 {id:'r10',occasion:'group',size:17,course:'진연상',tags:['단체','프라이빗룸','음식'],image:'reviews-temp.jpg',title:'친목 모임을 위한 단체 좌석 확인',excerpt:'11~20명 조건에서 검색되는 모임 후기 유형 예시입니다.',body:'모임 유형과 인원 조건의 복합 검색을 확인하는 화면입니다. 실제 고객의 작성 내용은 포함되어 있지 않습니다.'}
 ];
 const reviewUrl=id=>urlRoot+'detail/?id='+encodeURIComponent(id);
 const imgPath=()=>{
   // site-config already provides a repository-root URL, so assets work at all depths.
   const p=cfg.nav_sudam||'../about/';return p.replace(/about\/?$/,'images/');
 };
 const makeReviewCard=(r,featured=false)=>`<article class="sd-extra-review-card"><a class="sd-extra-review-card-photo" href="${esc(reviewUrl(r.id))}"><img loading="lazy" alt="샘플 후기 이미지 - 실제 고객 사진 아님" src="${esc(imgPath()+r.image)}"/><span>시연용 샘플</span></a><div class="sd-extra-review-card-content"><div class="sd-extra-review-card-top"><span>${esc(eventTypes[r.occasion])}</span><small>${r.size}명 · ${esc(r.course)}</small></div><h3><a href="${esc(reviewUrl(r.id))}">${esc(r.title)}</a></h3><p>${esc(r.excerpt)}</p><div class="sd-sub-pills">${r.tags.map(t=>`<span class="sd-sub-chip">#${esc(t)}</span>`).join('')}</div><a class="sd-sub-arrow-link" href="${esc(reviewUrl(r.id))}">샘플 상세 보기 <span aria-hidden="true">↗</span></a></div></article>`;
 const recent=$('#sdLatestReviews');if(recent)recent.innerHTML=REVIEWS.slice(0,3).map(x=>makeReviewCard(x,true)).join('');
 const results=$('#sdAllReviews');
 if(results){
   const filters=$$('[data-review-filter]');const tags=$$('[data-review-tag]');const initial=new URLSearchParams(location.search).get('type');
   const type=$('[data-review-filter="occasion"]');if(type&&eventTypes[initial])type.value=initial;
   let limit=6;
   const inSize=(n,v)=>v==='all'||(v==='2-4'&&n>=2&&n<=4)||(v==='5-10'&&n>=5&&n<=10)||(v==='11-20'&&n>=11&&n<=20)||(v==='21-50'&&n>=21&&n<=50)||(v==='51+'&&n>=51);
   const show=()=>{
     const val=name=>$(`[data-review-filter="${name}"]`)?.value||'all';
     const selected=tags.filter(x=>x.checked).map(x=>x.value);
     const list=REVIEWS.filter(r=>inSize(r.size,val('size'))&&(val('course')==='all'||r.course===val('course'))&&(val('occasion')==='all'||r.occasion===val('occasion'))&&selected.every(t=>r.tags.includes(t)));
     if(val('sort')==='size')list.sort((a,b)=>b.size-a.size);
     $('[data-review-count]').textContent='검색 결과 '+list.length+'건';
     results.innerHTML=list.slice(0,limit).map(x=>makeReviewCard(x)).join('');
     $('[data-review-more]').hidden=list.length<=limit;
     $('[data-review-empty]').hidden=list.length!==0;
   };
   filters.forEach(x=>x.addEventListener('change',()=>{limit=6;show()}));
   tags.forEach(x=>x.addEventListener('change',()=>{limit=6;show()}));
   $$('[data-review-reset]').forEach(x=>x.addEventListener('click',()=>{filters.forEach(f=>f.value=f.dataset.reviewFilter==='sort'?'recent':'all');tags.forEach(t=>t.checked=false);limit=6;history.replaceState(null,'',location.pathname+location.hash);show()}));
   $('[data-review-more]')?.addEventListener('click',()=>{limit+=6;show()});show();
 }
 const detail=$('[data-review-detail]');
 if(detail){
   const id=new URLSearchParams(location.search).get('id');const r=REVIEWS.find(x=>x.id===id);
   if(!r){detail.innerHTML='<h1>후기를 찾을 수 없습니다.</h1><p class="sd-sub-copy">전체 후기에서 다른 콘텐츠를 선택해 주세요.</p><a class="sd-sub-button" href="'+esc(urlRoot)+'">전체 후기 보기 ↗</a>'}
   else{
     detail.innerHTML=`<div class="sd-extra-demo-note">이 후기는 화면·기능 점검을 위해 작성한 가상 예시입니다. 실제 고객 후기나 평점을 나타내지 않습니다.</div><span class="sd-sub-eyebrow sd-extra-detail-kicker">${esc(eventTypes[r.occasion])} · SAMPLE REVIEW</span><h1>${esc(r.title)}</h1><div class="sd-sub-pills sd-extra-detail-tags">${r.tags.map(t=>`<span class="sd-sub-chip">#${esc(t)}</span>`).join('')}</div><div class="sd-extra-detail-photo"><img src="${esc(imgPath()+r.image)}" alt="후기 상세 테스트 이미지"/></div><div class="sd-extra-detail-meta"><div><span>모임 유형</span><strong>${esc(eventTypes[r.occasion])}</strong></div><div><span>방문 인원 (샘플)</span><strong>${r.size}명</strong></div><div><span>코스 메뉴</span><strong>${esc(r.course)}</strong></div><div><span>게시 유형</span><strong>시연용 샘플</strong></div></div><span class="sd-sub-eyebrow">REVIEW STORY</span><p class="sd-sub-copy">${esc(r.body)}</p><div class="sd-extra-related"><a href="${esc(cfg.nav_meeting+r.occasion+'/')}" class="sd-sub-button sd-sub-button--line">${esc(eventTypes[r.occasion])} 안내 보기 ↗</a><a href="${esc(cfg.nav_menu)}" class="sd-sub-button sd-sub-button--line">코스 메뉴 살펴보기 ↗</a><a href="${esc(cfg.nav_reservation)}" class="sd-sub-button">예약 상담 안내 ↗</a><a href="${esc(urlRoot)}" class="sd-sub-arrow-link">← 전체 후기로 돌아가기</a></div>`;
   }
 }

 // Consultation: static hosting does not receive/store enquiries. Opens user's email program only.
 const consult=$('#sdConsultForm');
 if(consult){
   const fields=new URLSearchParams(location.search);const given=fields.get('type');
   const type=$('#sdConsultType');if(type&&eventTypes[given])type.value=given;
   const date=$('#sdConsultDate');if(date){const now=new Date();const local=new Date(now.getTime()-now.getTimezoneOffset()*60000);date.min=local.toISOString().slice(0,10)}
   const status=$('#sdConsultStatus');
   const createDraft=()=>{
     if(!consult.reportValidity())return null;
     const data=new FormData(consult);const typeName=eventTypes[data.get('type')]||({'general':'일반 식사 / 기타','partner':'기업 제휴 문의'}[data.get('type')]||data.get('type'));
     const title=`[수담한정식 상담 문의] ${data.get('name')} · ${typeName}`;
     const body=`안녕하세요. 수담한정식 예약 및 모임 상담을 요청합니다.\n\n성함: ${data.get('name')}\n연락처: ${data.get('phone')}\n모임 유형: ${typeName}\n희망 날짜: ${data.get('date')}\n희망 시간: ${data.get('time')}\n예상 인원: ${data.get('people')}명\n관심 코스: ${data.get('course')}\n문의 내용: ${data.get('message')||'별도 요청 없음'}\n\n※ 상담 요청 메일이며, 예약 확정이 아닙니다.`;
     return {title,body};
   };
   consult.addEventListener('submit',e=>{
     e.preventDefault();const d=createDraft();if(!d)return;
     status.textContent='이메일 프로그램에서 보내기를 눌러야 실제 문의가 전달됩니다. 예약은 확정되지 않았습니다.';
     location.href='mailto:koreasudam@naver.com?subject='+encodeURIComponent(d.title)+'&body='+encodeURIComponent(d.body);
   });
   $('[data-consult-copy]')?.addEventListener('click',async()=>{
     const d=createDraft();if(!d)return;
     if(await copy(d.title+'\n\n'+d.body)){msg('문의 내용을 복사했습니다. 직접 이메일 또는 상담 채널로 전달해 주세요.');status.textContent='복사 완료. 아직 문의가 전송되지 않았습니다.'}
     else{status.textContent='자동 복사를 지원하지 않는 브라우저입니다. 작성 내용을 직접 복사해 주세요.'}
   });
 }
 // Invitation editor: high-res PNG export and shareable query-string link. No storage.
 const invite=$('#sdInvitationForm');
 if(invite){
   const preview=$('[data-invite-preview]');const status=$('#sdInviteStatus');
   const fields=name=>invite.elements.namedItem(name);
   const presets={family:'소중한 날, 함께해 주세요',formal:'뜻깊은 만남에 초대합니다',baby:'아이의 특별한 날에 초대합니다',vip:'귀한 자리에 정중히 초대합니다',corporate:'함께하는 만남에 초대합니다',group:'즐거운 모임에 초대합니다',wedding:'저희의 특별한 날에 초대합니다',custom:'소중한 날, 함께해 주세요'};
   const params=new URLSearchParams(location.search);let isShared=false;
   for(const key of ['template','kind','title','message','date','time','host']){
     const v=params.get(key);const f=fields(key);if(!v||!f)continue;
     if(f instanceof RadioNodeList){if(Array.from(f).some(x=>x.value===v))f.value=v}
     else if(f.tagName==='SELECT'){if(Array.from(f.options).some(x=>x.value===v))f.value=v}
     else f.value=v;
     isShared=true;
   }
   const current=()=>({template:fields('template').value,kind:fields('kind').value,title:fields('title').value.trim()||'소중한 날, 함께해 주세요',message:fields('message').value.trim()||'함께하는 자리에서 따뜻한 시간을 나누고 싶습니다.',date:fields('date').value,time:fields('time').value,host:fields('host').value.trim()});
   const prettyDate=txt=>{
     if(!txt)return '모임 날짜';
     const [y,m,d]=txt.split('-');return `${y}년 ${Number(m)}월 ${Number(d)}일`;
   };
   const prettifyTime=txt=>txt?txt+' 시작':'모임 시간';
   const render=()=>{
     const d=current();preview.dataset.template=d.template;
     $('[data-invite-preview-title]').textContent=d.title;
     $('[data-invite-preview-desc]').textContent=d.message;
     $('[data-invite-preview-date]').textContent=prettyDate(d.date);
     $('[data-invite-preview-time]').textContent=prettifyTime(d.time);
     $('[data-invite-preview-location]')?.removeAttribute('hidden');
     const host=$('[data-invite-preview-host]');if(host)host.textContent=d.host?'초대: '+d.host:'';
   };
   fields('kind').addEventListener('change',()=>{fields('title').value=presets[fields('kind').value]||presets.custom;render()});
   invite.addEventListener('input',render);invite.addEventListener('change',render);
   invite.addEventListener('reset',()=>{setTimeout(()=>{render();status.textContent='초대장 내용을 초기화했습니다.'},0)});
   // Draw the entire invite as pixels: no third-party screenshot library, 1080 x 1440 PNG.
   const palettes={warm:{bg:'#e9ddd0',ink:'#473625',accent:'#9c805b',border:'#b7a083'},dark:{bg:'#35291f',ink:'#f3e3ce',accent:'#c3a47c',border:'#a58b68'},sage:{bg:'#e4e7dc',ink:'#3e4b3f',accent:'#84927c',border:'#a6b19f'}};
   const canvas=document.createElement('canvas');canvas.width=1080;canvas.height=1440;
   const fontSerif='"Noto Serif KR", Georgia, serif',fontSans='"Pretendard Variable", Arial, sans-serif';
   function breakText(ctx,text,maxWidth,maxLines){
     const result=[];for(const paragraph of String(text).split('\n')){
       let line='';for(const c of paragraph){if(ctx.measureText(line+c).width>maxWidth&&line){result.push(line);line=c}else line+=c}
       result.push(line);
     }return result.slice(0,maxLines);
   }
   function textBlock(ctx,lines,y,lineHeight){lines.forEach((line,i)=>ctx.fillText(line,540,y+i*lineHeight));return y+(Math.max(0,lines.length-1))*lineHeight}
   function savePng(){
     const d=current();const pal=palettes[d.template]||palettes.warm;const ctx=canvas.getContext('2d');
     ctx.fillStyle=pal.bg;ctx.fillRect(0,0,1080,1440);ctx.strokeStyle=pal.border;ctx.lineWidth=2;ctx.strokeRect(42,42,996,1356);ctx.strokeRect(57,57,966,1326);
     ctx.textAlign='center';ctx.textBaseline='middle';ctx.fillStyle=pal.accent;ctx.font='44px '+fontSerif;ctx.fillText('✦',540,180);
     ctx.font='23px '+fontSans;ctx.fillText('YOU ARE INVITED',540,272);
     ctx.fillStyle=pal.ink;ctx.font='62px '+fontSerif;
     const titleLines=breakText(ctx,d.title,810,4);textBlock(ctx,titleLines,407,91);
     ctx.strokeStyle=pal.accent;ctx.beginPath();ctx.moveTo(478,720);ctx.lineTo(602,720);ctx.stroke();
     ctx.fillStyle=pal.ink;ctx.font='31px '+fontSans;const descLines=breakText(ctx,d.message,800,4);textBlock(ctx,descLines,798,48);
     ctx.font='bold 35px '+fontSans;ctx.fillText(prettyDate(d.date),540,1060);
     ctx.font='31px '+fontSans;ctx.fillText(prettifyTime(d.time),540,1110);
     ctx.fillStyle=pal.accent;ctx.font='34px '+fontSerif;ctx.fillText('수담한정식',540,1222);
     ctx.font='23px '+fontSans;ctx.fillText('서울 강남구 봉은사로 418 조양빌딩 B1',540,1280);
     if(d.host){ctx.font='24px '+fontSans;ctx.fillText('초대: '+d.host.slice(0,30),540,1342)}
     const a=document.createElement('a');a.href=canvas.toDataURL('image/png');a.download='수담한정식_모바일초대장.png';document.body.appendChild(a);a.click();a.remove();
     status.textContent='1080 × 1440 PNG 이미지 저장을 요청했습니다.';
   }
   $('#sdInviteSave')?.addEventListener('click',()=>{document.fonts?.ready.then(savePng).catch(savePng)||savePng()});
   $('#sdInviteShare')?.addEventListener('click',async()=>{
     const d=current();const shared=new URL(location.href);shared.search='';for(const [k,v] of Object.entries(d)){if(v)shared.searchParams.set(k,v)}
     if(await copy(shared.href)){msg('초대장 링크가 복사되었습니다.');status.textContent='링크 복사 완료. 공유한 사람은 입력한 제목·문구·일시를 볼 수 있습니다.'}
     else{status.textContent='자동 복사에 실패했습니다. 주소창의 URL을 복사해 주세요.';history.replaceState(null,'',shared.href)}
   });
   if(isShared)status.textContent='공유받은 초대장을 불러왔습니다. 내용을 수정하거나 이미지로 저장할 수 있습니다.';
   render();
 }
})();
