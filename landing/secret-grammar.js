(function(){
const DATA={"books": {"": {"예비고1": {"grade": "예비고1", "book": "시크릿어법 예비고1", "lessons": ["정동사 vs 준동사", "긴 주어의 수일치", "보어 자리의 형용사 vs 부사", "목적어 자리의 to부정사 vs 동명사", "현재분사 vs 과거분사", "분사구문과 with 부대상황", "능동태 vs 수동태", "관계대명사", "관계부사 vs 관계대명사", "that vs what · 접속사 vs 전치사", "병렬구조 · 대명사 · 대동사", "실전 어법 모의고사"], "cover": "https://daechisecret.github.io/imweb-assets/landing/land/grammar_%EC%8B%9C%ED%81%AC%EB%A6%BF%EC%96%B4%EB%B2%95%20%EC%98%88%EB%B9%84%EA%B3%A01.jpg"}, "고1": {"grade": "고1", "book": "시크릿어법 고1", "lessons": ["문장의 형식", "to부정사·동명사", "분사구", "분사구문", "명사절 접속사", "관계사", "수동태", "수일치", "형용사·부사·대명사", "전치사·접속사", "조동사·가정법", "특수구문"], "cover": "https://daechisecret.github.io/imweb-assets/landing/land/grammar_%EC%8B%9C%ED%81%AC%EB%A6%BF%EC%96%B4%EB%B2%95%20%EA%B3%A01.jpg"}, "고2": {"grade": "고2", "book": "시크릿어법 고2", "lessons": ["문장의 형식", "to부정사·동명사", "분사구", "분사구문", "명사절 접속사", "관계사", "수동태", "수일치", "형용사·부사·대명사", "전치사·접속사", "조동사·가정법", "특수구문"], "cover": "https://daechisecret.github.io/imweb-assets/landing/land/grammar_%EC%8B%9C%ED%81%AC%EB%A6%BF%EC%96%B4%EB%B2%95%20%EA%B3%A02.jpg"}, "고3": {"grade": "고3", "book": "시크릿어법 고3", "lessons": ["문장의 형식", "to부정사·동명사", "분사구", "분사구문", "명사절 접속사", "관계사", "수동태", "수일치", "형용사·부사·대명사", "전치사·접속사", "조동사·가정법", "특수구문"], "cover": "https://daechisecret.github.io/imweb-assets/landing/land/grammar_%EC%8B%9C%ED%81%AC%EB%A6%BF%EC%96%B4%EB%B2%95%20%EA%B3%A03.jpg"}, "중1": {"grade": "중1", "book": "어법 총정리 중1", "lessons": ["be동사와 일반동사", "현재진행과 There is·are", "과거시제", "조동사", "명령문·감탄문·의문사 의문문", "동명사", "to부정사 ① 명사적 용법", "to부정사 ② 부사적 용법", "문장의 형식 감각동사와 수여동사", "비교급과 최상급", "접속사 when · because · that", "대명사와 형용사 자리"], "cover": "https://daechisecret.github.io/imweb-assets/landing/land/grammar_%EC%96%B4%EB%B2%95%20%EC%B4%9D%EC%A0%95%EB%A6%AC%20%EC%A4%911.jpg"}, "중2": {"grade": "중2", "book": "어법 총정리 중2", "lessons": ["현재완료", "수동태", "명사를 꾸미는 말", "가주어 it 과 의문사 + to부정사", "5형식 ① 목적격 보어 형용사·to부정사", "5형식 ② 사역동사와 지각동사", "관계대명사 ① 주격", "관계대명사 ② 목적격", "부사절 접속사", "간접의문문", "so ~ that 과 짝을 이루는 접속사", "비교 표현"], "cover": "https://daechisecret.github.io/imweb-assets/landing/land/grammar_%EC%96%B4%EB%B2%95%20%EC%B4%9D%EC%A0%95%EB%A6%AC%20%EC%A4%912.jpg"}, "중3": {"grade": "중3", "book": "어법 총정리 중3", "lessons": ["완료 시제 넓히기", "조동사와 수동태 심화", "관계대명사 what", "관계대명사 계속적 용법과 whose", "관계부사", "분사 심화", "분사구문", "to부정사 심화", "명사절 접속사 if · whether", "부사절 접속사 심화", "가정법 과거", "강조 구문과 비교 심화"], "cover": "https://daechisecret.github.io/imweb-assets/landing/land/grammar_%EC%96%B4%EB%B2%95%20%EC%B4%9D%EC%A0%95%EB%A6%AC%20%EC%A4%913.jpg"}}}, "groups": {"": [["고등", ["예비고1", "고1", "고2", "고3"]], ["중등", ["중1", "중2", "중3"]]]}, "all": {"예비고1": "https://daechisecret.github.io/imweb-assets/landing/land/all_%EC%98%88%EB%B9%84%EA%B3%A01.jpg", "고1": "https://daechisecret.github.io/imweb-assets/landing/land/all_%EA%B3%A01.jpg", "고2": "https://daechisecret.github.io/imweb-assets/landing/land/all_%EA%B3%A02.jpg", "고3": "https://daechisecret.github.io/imweb-assets/landing/land/all_%EA%B3%A03.jpg", "중1": "https://daechisecret.github.io/imweb-assets/landing/land/all_%EC%A4%911.jpg", "중2": "https://daechisecret.github.io/imweb-assets/landing/land/all_%EC%A4%912.jpg", "중3": "https://daechisecret.github.io/imweb-assets/landing/land/all_%EC%A4%913.jpg"}, "tb": null, "name": "시크릿어법", "hwp": "https://daechisecret.github.io/imweb-assets/landing/land/hwp_grammar.jpg", "edv": {}};
const tr=document.getElementById('track'),cnt=document.getElementById('cnt');
function upd(){const n=tr.children.length,w=tr.children[0].offsetWidth+18;cnt.textContent=(Math.round(tr.scrollLeft/w)+1)+' / '+n}
function bindZoom(){tr.querySelectorAll('.slide').forEach(s=>s.onclick=()=>{document.getElementById('zoomImg').src=s.querySelector('img').src;document.getElementById('zoom').classList.add('on')})}
document.getElementById('prev').onclick=()=>{tr.scrollBy({left:-(tr.children[0].offsetWidth+18)*2})};
document.getElementById('next').onclick=()=>{tr.scrollBy({left:(tr.children[0].offsetWidth+18)*2})};
tr.addEventListener('scroll',()=>requestAnimationFrame(upd));upd();
bindZoom();

let ED=Object.keys(DATA.books)[0], G='고1';
function $(i){return document.getElementById(i)}
function rows(){
  const gs=DATA.groups[ED]; let h=gs.map(([lb,gr])=>`<div class="row"><span class="lb">${lb}</span>${gr.map(g=>`<button class="gr" data-g="${g}">${g}</button>`).join('')}</div>`).join('');
  $('gradeRows').innerHTML=h;
  document.querySelectorAll('button.gr').forEach(b=>b.onclick=()=>b.dataset.tb?showTb(b.dataset.tb):show(b.dataset.g));
}
function mark(sel){document.querySelectorAll('button.gr').forEach(b=>b.classList.toggle('on',(b.dataset.g||'')===sel.g&&!sel.tb||(b.dataset.tb||'')===sel.tb))}
function show(g){
  const B=DATA.books[ED]; if(!B[g]) g=Object.keys(B)[Object.keys(B).length>1?1:0]; G=g; const b=B[g];
  mark({g}); $('tbBlk').style.display='none'; $('lsBlk').style.display=''; $('pkBlk').style.display='';
  if($('cvPkg')){$('cvPkg').src=b.cover;$('cvAll').src=DATA.all[g]||DATA.all['고1']} $('pkImg').src=b.cover; $('allImg').src=DATA.all[g]||DATA.all['고1'];
  $('cvMemo').textContent=b.book+' · '+b.lessons.length+(ED==='실전 모의고사'?'회':'강'); $('pkName').textContent=b.book+' 전범위 패키지'; $('allName').textContent=g+' 학년 올인원';
  $('lsEye').textContent=b.book;
  $('lessons').innerHTML=b.lessons.map((t,i)=>`<div class="ls"><span class="no">${String(i+1).padStart(2,'0')}</span><span class="nm">${t}</span><span class="bt"><a href="/special-lecture">PDF</a><a class="h" href="/special-lecture">교사용 HWP</a></span></div>`).join('');
  document.querySelectorAll('[data-ed]').forEach(x=>x.classList.toggle('on',x.dataset.ed===ED));
}
function showTb(g){
  mark({tb:g}); $('tbBlk').style.display=''; $('lsBlk').style.display='none';
  $('tbEye').textContent=g+' · 출판사를 골라 주세요';
  $('pubs').innerHTML=DATA.tb[g].map(p=>`<div class="pub"><img src="${p.cover}" alt="${p.book} 표지"><b>${p.pub}</b><span>${p.lessons}강 · ${g}</span><a href="/special-lecture">자료 보기 →</a></div>`).join('');
  $('tbBlk').scrollIntoView({behavior:'smooth',block:'start'});
}
document.querySelectorAll('[data-ed]').forEach(x=>x.onclick=()=>{ED=x.dataset.ed;if(DATA.edv[ED]){tr.innerHTML=DATA.edv[ED].car;tr.scrollLeft=0;bindZoom();upd();$('parts').innerHTML=DATA.edv[ED].parts;if(x.classList.contains('ed-card'))$('carSec').scrollIntoView({behavior:'smooth',block:'start'})}rows();show(G)});
rows(); show('고1');
if(location.hash.startsWith('#ed-')){const b=document.querySelector('button.ed[data-ed="'+decodeURIComponent(location.hash.slice(4))+'"]');if(b)b.click()}
if(location.hash.startsWith('#tb-')&&DATA.tb) showTb(decodeURIComponent(location.hash.slice(4)));

// 사이트 고정 헤더 높이만큼 학년 탭을 내려 붙인다
(function(){var t=document.querySelector("#dcs-land .tabs");if(!t)return;var fx=[];function scan(){fx=[].filter.call(document.querySelectorAll("body *"),function(e){if(e.closest("#dcs-land"))return false;var p=getComputedStyle(e).position;return(p==="fixed"||p==="sticky")&&e.offsetWidth>innerWidth*0.6})}function f(){var b=0;fx.forEach(function(e){var r=e.getBoundingClientRect();if(r.top<=1&&r.bottom>b&&r.bottom<320)b=r.bottom});t.style.top=b+"px"}scan();f();addEventListener("scroll",function(){requestAnimationFrame(f)},{passive:true});addEventListener("resize",function(){scan();f()})})();
})();

/* 2026-11-01 사장님: 「패키지 보기」「올인원 보기」「한글 파일 보기」와 예전 /secret-special 링크는 모두 방학특강 자료 페이지로.
   위젯 HTML 은 아임웹 안에 붙어 있어 여기서 주소만 바꿔 줍니다(강 목록처럼 나중에 그려지는 링크도). */
(function(){var GO='/special-lecture';
function fix(){document.querySelectorAll('a.buy,a[href="/secret-special"],#lessons a[href="#"],#pubs a[href="#"],.al a[href="#"]').forEach(function(a){if(a.getAttribute('href')!==GO)a.setAttribute('href',GO)})}
fix();new MutationObserver(fix).observe(document.body,{childList:true,subtree:true});})();
