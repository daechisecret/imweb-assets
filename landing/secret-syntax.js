(function(){
const DATA={"books": {"": {"예비고1": {"grade": "예비고1", "book": "시크릿구문 예비고1", "lessons": ["문장의 뼈대와 끊어 읽기", "긴 주어 묶기", "목적어 덩어리", "주격보어와 목적격보어", "동사 덩어리 읽기", "명사 뒤 수식 ① 구", "명사 뒤 수식 ② 절", "부사 역할의 to-v와 부사절", "분사구문", "병렬과 짝 접속사", "비교와 가정법", "특수구문과 종합"], "cover": "https://daechisecret.github.io/imweb-assets/landing/land/syntax_%EC%8B%9C%ED%81%AC%EB%A6%BF%EA%B5%AC%EB%AC%B8%20%EC%98%88%EB%B9%84%EA%B3%A01.jpg"}, "고1": {"grade": "고1", "book": "시크릿구문 고1", "lessons": ["주어 찾기", "동사가 뒤 구조를 정한다", "목적어 덩어리와 가목적어 it", "주격보어·목적격보어를 판별해요", "수식어는 괄호로", "관계사절의 범위를 [ ]로", "관계대명사 what · 복합관계사 · 명사절 구별", "분사구문과 with 구문", "절이 여럿이면 주절부터", "가정법 읽기", "비교 구문의 형태", "특수구문의 질서"], "cover": "https://daechisecret.github.io/imweb-assets/landing/land/syntax_%EC%8B%9C%ED%81%AC%EB%A6%BF%EA%B5%AC%EB%AC%B8%20%EA%B3%A01.jpg"}, "고2": {"grade": "고2", "book": "시크릿구문 고2", "lessons": ["첫머리 덩어리, 주어인가 수식어인가", "진짜 동사 찾기", "동사 뒤 덩어리의 정체", "명사 뒤 준동사, 꾸밈인가 목적격보어인가", "that, 뒤를 보고 정체를 가려요", "it · as가 맡은 역할", "관계사절, 범위를 넓혀 읽기", "부사 덩어리, 뜻을 가려요", "분사구문, 뜻과 주어 찾기", "if 없는 가정 읽기", "비교, 빠진 말 채우고 부정과 묶기", "짝 맞추기와 대명사 추적"], "cover": "https://daechisecret.github.io/imweb-assets/landing/land/syntax_%EC%8B%9C%ED%81%AC%EB%A6%BF%EA%B5%AC%EB%AC%B8%20%EA%B3%A02.jpg"}, "고3": {"grade": "고3", "book": "시크릿구문 고3", "lessons": ["뼈대만 남기기", "긴 주어 뒤의 진짜 동사", "명사 뒤 수식어의 범위", "관계사절이 여럿, 삽입절이 낀 문장", "어순이 바뀐 문장", "생략과 대신 쓰는 말", "병렬 무엇과 무엇이 이어지는가", "비교 대상과 생략", "부정 표현 바로 읽기", "짝으로 읽는 구문", "글의 논리를 알려 주는 구문", "40단어가 넘는 기출 문장 종합"], "cover": "https://daechisecret.github.io/imweb-assets/landing/land/syntax_%EC%8B%9C%ED%81%AC%EB%A6%BF%EA%B5%AC%EB%AC%B8%20%EA%B3%A03.jpg"}, "중1": {"grade": "중1", "book": "시크릿구문 중1", "lessons": ["주어와 동사 찾기", "be동사 문장과 주격보어", "목적어 찾기", "동사의 때 읽기", "조동사가 더하는 뜻", "감각동사 + 형용사", "두 개의 목적어", "꾸밈말은 괄호로", "묻는 문장·시키는 문장 읽기", "to부정사 덩어리 읽기", "동명사 덩어리 읽기", "접속사로 이어진 문장"], "cover": "https://daechisecret.github.io/imweb-assets/landing/land/syntax_%EC%8B%9C%ED%81%AC%EB%A6%BF%EA%B5%AC%EB%AC%B8%20%EC%A4%911.jpg"}, "중2": {"grade": "중2", "book": "시크릿구문 중2", "lessons": ["긴 주어와 가주어 it", "목적격보어 ① 명사·형용사", "목적격보어 ② to-v", "명사 뒤 to-v '~할'로 꾸미기", "to-v의 부사 역할", "be p.p. 수동태 읽기", "현재완료 have p.p. 읽기", "명사절 that·if·whether", "관계대명사절 [ ]로 묶기 ① 주격", "관계대명사절 [ ]로 묶기 ② 목적격·whose", "부사절 접속사로 문장 나누기", "비교 구문 읽기"], "cover": "https://daechisecret.github.io/imweb-assets/landing/land/syntax_%EC%8B%9C%ED%81%AC%EB%A6%BF%EA%B5%AC%EB%AC%B8%20%EC%A4%912.jpg"}, "중3": {"grade": "중3", "book": "시크릿구문 중3", "lessons": ["명사 뒤 분사 덩어리", "사역·지각동사 + 목적격보어", "관계대명사 what 덩어리", "관계부사 where·when·why·how", "콤마 뒤 관계사 계속적 용법", "간접의문문 문장 속의 질문", "가주어 it과 의문사 + to-v", "정도와 결과 too·enough·so ~ that", "완료 시제로 시간 순서 읽기", "분사구문 읽기", "가정법 과거 사실과 반대로", "강조·상관접속사 + 긴 문장 종합"], "cover": "https://daechisecret.github.io/imweb-assets/landing/land/syntax_%EC%8B%9C%ED%81%AC%EB%A6%BF%EA%B5%AC%EB%AC%B8%20%EC%A4%913.jpg"}}}, "groups": {"": [["고등", ["예비고1", "고1", "고2", "고3"]], ["중등", ["중1", "중2", "중3"]]]}, "all": {"예비고1": "https://daechisecret.github.io/imweb-assets/landing/land/all_%EC%98%88%EB%B9%84%EA%B3%A01.jpg", "고1": "https://daechisecret.github.io/imweb-assets/landing/land/all_%EA%B3%A01.jpg", "고2": "https://daechisecret.github.io/imweb-assets/landing/land/all_%EA%B3%A02.jpg", "고3": "https://daechisecret.github.io/imweb-assets/landing/land/all_%EA%B3%A03.jpg", "중1": "https://daechisecret.github.io/imweb-assets/landing/land/all_%EC%A4%911.jpg", "중2": "https://daechisecret.github.io/imweb-assets/landing/land/all_%EC%A4%912.jpg", "중3": "https://daechisecret.github.io/imweb-assets/landing/land/all_%EC%A4%913.jpg"}, "tb": null, "name": "시크릿구문", "hwp": "https://daechisecret.github.io/imweb-assets/landing/land/hwp_syntax.jpg", "edv": {}};
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
  if(DATA.tb) h+=`<div class="row"><span class="lb">중등 교과서별 어법</span>${Object.keys(DATA.tb).map(g=>`<button class="gr" data-tb="${g}">${g}</button>`).join('')}</div>`;
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
  $('lessons').innerHTML=b.lessons.map((t,i)=>`<div class="ls"><span class="no">${String(i+1).padStart(2,'0')}</span><span class="nm">${t}</span><span class="bt"><a href="#">PDF</a><a class="h" href="#">교사용 HWP</a></span></div>`).join('');
  document.querySelectorAll('[data-ed]').forEach(x=>x.classList.toggle('on',x.dataset.ed===ED));
}
function showTb(g){
  mark({tb:g}); $('tbBlk').style.display=''; $('lsBlk').style.display='none';
  $('tbEye').textContent=g+' · 출판사를 골라 주세요';
  $('pubs').innerHTML=DATA.tb[g].map(p=>`<div class="pub"><img src="${p.cover}" alt="${p.book} 표지"><b>${p.pub}</b><span>${p.lessons}강 · ${g}</span><a href="#">자료 보기 →</a></div>`).join('');
  $('tbBlk').scrollIntoView({behavior:'smooth',block:'start'});
}
document.querySelectorAll('[data-ed]').forEach(x=>x.onclick=()=>{ED=x.dataset.ed;if(DATA.edv[ED]){tr.innerHTML=DATA.edv[ED].car;tr.scrollLeft=0;bindZoom();upd();$('parts').innerHTML=DATA.edv[ED].parts;if(x.classList.contains('ed-card'))$('carSec').scrollIntoView({behavior:'smooth',block:'start'})}rows();show(G)});
rows(); show('고1');
if(location.hash.startsWith('#ed-')){const b=document.querySelector('button.ed[data-ed="'+decodeURIComponent(location.hash.slice(4))+'"]');if(b)b.click()}
if(location.hash.startsWith('#tb-')&&DATA.tb) showTb(decodeURIComponent(location.hash.slice(4)));

// 사이트 고정 헤더 높이만큼 학년 탭을 내려 붙인다
(function(){var t=document.querySelector("#dcs-land .tabs");if(!t)return;var fx=[];function scan(){fx=[].filter.call(document.querySelectorAll("body *"),function(e){if(e.closest("#dcs-land"))return false;var p=getComputedStyle(e).position;return(p==="fixed"||p==="sticky")&&e.offsetWidth>innerWidth*0.6})}function f(){var b=0;fx.forEach(function(e){var r=e.getBoundingClientRect();if(r.top<=1&&r.bottom>b&&r.bottom<320)b=r.bottom});t.style.top=b+"px"}scan();f();addEventListener("scroll",function(){requestAnimationFrame(f)},{passive:true});addEventListener("resize",function(){scan();f()})})();
})();
