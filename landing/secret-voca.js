(function(){
const DATA={"books": {"": {"예비고1": {"grade": "예비고1", "book": "시크릿보카 예비고1", "lessons": ["심리·감정", "인간관계·소통", "교육·학습", "사회·제도", "경제·소비", "경영·조직", "생명과학·진화", "물리·지구·우주", "기술·AI·미디어", "환경·건강", "예술·문학·언어", "철학·윤리·역사"], "cover": "https://daechisecret.github.io/imweb-assets/landing/land/voca_%EC%8B%9C%ED%81%AC%EB%A6%BF%EB%B3%B4%EC%B9%B4%20%EC%98%88%EB%B9%84%EA%B3%A01.jpg"}, "고1": {"grade": "고1", "book": "시크릿보카 고1", "lessons": ["심리·감정", "인간관계·소통", "교육·학습", "사회·제도", "경제·소비", "경영·조직", "생명과학·진화", "물리·지구·우주", "기술·AI·미디어", "환경·건강", "예술·문학·언어", "철학·윤리·역사"], "cover": "https://daechisecret.github.io/imweb-assets/landing/land/voca_%EC%8B%9C%ED%81%AC%EB%A6%BF%EB%B3%B4%EC%B9%B4%20%EA%B3%A01.jpg"}, "고2": {"grade": "고2", "book": "시크릿보카 고2", "lessons": ["심리·감정", "인간관계·소통", "교육·학습", "사회·제도", "경제·소비", "경영·조직", "생명과학·진화", "물리·지구·우주", "기술·AI·미디어", "환경·건강", "예술·문학·언어", "철학·윤리·역사"], "cover": "https://daechisecret.github.io/imweb-assets/landing/land/voca_%EC%8B%9C%ED%81%AC%EB%A6%BF%EB%B3%B4%EC%B9%B4%20%EA%B3%A02.jpg"}, "고3": {"grade": "고3", "book": "시크릿보카 고3", "lessons": ["심리·감정", "인간관계·소통", "교육·학습", "사회·제도", "경제·소비", "경영·조직", "생명과학·진화", "물리·지구·우주", "기술·AI·미디어", "환경·건강", "예술·문학·언어", "철학·윤리·역사"], "cover": "https://daechisecret.github.io/imweb-assets/landing/land/voca_%EC%8B%9C%ED%81%AC%EB%A6%BF%EB%B3%B4%EC%B9%B4%20%EA%B3%A03.jpg"}, "중1": {"grade": "중1", "book": "시크릿보카 중1 테마", "lessons": ["나와 마음", "가족과 친구", "학교와 배움", "취미와 여가", "음식과 건강", "동물과 자연", "환경과 지구", "과학과 기술", "여행과 문화", "직업과 꿈", "사회와 나눔", "예술과 스포츠"], "cover": "https://daechisecret.github.io/imweb-assets/landing/land/voca_%EC%8B%9C%ED%81%AC%EB%A6%BF%EB%B3%B4%EC%B9%B4%20%EC%A4%911%20%ED%85%8C%EB%A7%88.jpg"}, "중2": {"grade": "중2", "book": "시크릿보카 중2 테마", "lessons": ["나와 마음", "가족과 친구", "학교와 배움", "취미와 여가", "음식과 건강", "동물과 자연", "환경과 지구", "과학과 기술", "여행과 문화", "직업과 꿈", "사회와 나눔", "예술과 스포츠"], "cover": "https://daechisecret.github.io/imweb-assets/landing/land/voca_%EC%8B%9C%ED%81%AC%EB%A6%BF%EB%B3%B4%EC%B9%B4%20%EC%A4%912%20%ED%85%8C%EB%A7%88.jpg"}, "중3": {"grade": "중3", "book": "시크릿보카 중3 테마", "lessons": ["나와 마음", "가족과 친구", "학교와 배움", "취미와 여가", "음식과 건강", "동물과 자연", "환경과 지구", "과학과 기술", "여행과 문화", "직업과 꿈", "사회와 나눔", "예술과 스포츠"], "cover": "https://daechisecret.github.io/imweb-assets/landing/land/voca_%EC%8B%9C%ED%81%AC%EB%A6%BF%EB%B3%B4%EC%B9%B4%20%EC%A4%913%20%ED%85%8C%EB%A7%88.jpg"}}}, "groups": {"": [["고등", ["예비고1", "고1", "고2", "고3"]], ["중등", ["중1", "중2", "중3"]]]}, "all": {"예비고1": "https://daechisecret.github.io/imweb-assets/landing/land/all_%EC%98%88%EB%B9%84%EA%B3%A01.jpg", "고1": "https://daechisecret.github.io/imweb-assets/landing/land/all_%EA%B3%A01.jpg", "고2": "https://daechisecret.github.io/imweb-assets/landing/land/all_%EA%B3%A02.jpg", "고3": "https://daechisecret.github.io/imweb-assets/landing/land/all_%EA%B3%A03.jpg", "중1": "https://daechisecret.github.io/imweb-assets/landing/land/all_%EC%A4%911.jpg", "중2": "https://daechisecret.github.io/imweb-assets/landing/land/all_%EC%A4%912.jpg", "중3": "https://daechisecret.github.io/imweb-assets/landing/land/all_%EC%A4%913.jpg"}, "tb": null, "name": "시크릿보카", "hwp": "https://daechisecret.github.io/imweb-assets/landing/land/hwp_voca.jpg", "edv": {}};
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
