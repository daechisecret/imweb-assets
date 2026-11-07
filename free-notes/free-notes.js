/* 대치동시크릿 「SECRET NOTE 무료 정리표」 위젯
 * - 아임웹 코드 위젯은 달러+중괄호 문법을 위젯 변수로 바꿔 버리므로 템플릿 문자열을 쓰지 않는다(문자열 + 로만 잇기).
 * - 공개 여부는 날짜가 아니라 아래 배열에서 수동으로 정한다: open: true 이거나 shop(상품 주소)이 들어 있으면 공개.
 * - 공개된 카드가 앞에, 잠금 카드(「곧 공개」)가 뒤에 온다. 같은 무리 안에서는 배열 순서를 따른다.
 * - 2026-11-07: 「시크릿 자료실」 — 고등/중등 토글 · 영역 칩 · 검색 · 칼럼 목록 통합(lv 없으면 고등, 중등은 보라).
 */
(function () {
  'use strict';

  /* ── 정리표 목록(여기만 고치면 된다) ──────────────────────────
   * open  : 공개하면 true
   * area  : 영역 태그(어법·어휘·구문·독해)
   * title : 카드 제목
   * thumb : thumbs/ 안 파일 이름(확장자 뺌). 잠금 카드는 thumb + '_lock' 을 쓴다.
   * shop  : 0원 상품 주소(아직 없으면 '')
   * col   : 칼럼 글 주소(아직 없으면 '')
   */
  /* 폴더 번호 순서(2026-11-02 사장님). 공개하는 날: 그 편 open:true · shop(0원 상품) · col(칼럼) */
  var NOTES = [
    { open: true, area: '어법', title: '관계대명사 · 관계부사 한 장 정리', sub: 'that과 which 차이부터 생략까지', thumb: 'n01', shop: 'https://www.daechisecret.com/shop_view/?idx=2218', col: 'https://www.daechisecret.com/secret-library/?bmode=view&idx=175348213' },
    { open: true, area: '어법', title: '전치사 vs 접속사 구별표', sub: 'because와 because of 차이부터 시간 전치사까지', thumb: 'n02', shop: 'https://www.daechisecret.com/shop_view/?idx=2267', col: 'https://www.daechisecret.com/secret-library/?bmode=view&idx=175381579' },
    { open: true, area: '어법', title: 'to부정사 · 동명사 한 장 정리', sub: '목적어로 to-v만 · -ing만 쓰는 동사부터 remember to까지', thumb: 'n03', shop: 'https://www.daechisecret.com/shop_view/?idx=2316', col: 'https://www.daechisecret.com/secret-library/?bmode=view&idx=175387029' },
    { open: true, area: '어법', title: '분사구문 한 장 정리', sub: '만드는 법부터 해석, -ing와 p.p. 고르기까지', thumb: 'n04', shop: 'https://www.daechisecret.com/shop_view/?idx=2317', col: 'https://www.daechisecret.com/secret-library/?bmode=view&idx=175393598' },
    { open: true, area: '어법', title: '조동사 · 가정법 한 장 정리', sub: 'must have p.p.부터 가정법 과거완료까지', thumb: 'n05', shop: 'https://www.daechisecret.com/shop_view/?idx=2321', col: 'https://www.daechisecret.com/secret-library/?bmode=view&idx=175406146' },
    { open: true, area: '어법', title: '수동태 한 장 정리', sub: 'be + p.p.부터 수동태로 못 쓰는 동사까지', thumb: 'n06', shop: 'https://www.daechisecret.com/shop_view/?idx=2325', col: 'https://www.daechisecret.com/secret-library/?bmode=view&idx=175424995' },
    { open: false, area: '어법', title: '도치 · 강조 · 부분부정 한 장 정리', thumb: 'n07', shop: '', col: '' },
    { open: false, area: '어법', title: '영어 문장의 5형식 한 장 정리', thumb: 'n08', shop: '', col: '' },
    { open: false, area: '어법', title: '영어 불규칙 동사표', thumb: 'n09', shop: '', col: '' },
    { open: false, area: '어법', title: '현재완료 한 장 정리', thumb: 'n10', shop: '', col: '' },
    { open: true, area: '어휘', title: '기출 숙어 50 총정리', sub: '모의고사 기출 숙어 50 총정리', thumb: 'n11', shop: 'https://www.daechisecret.com/shop_view/?idx=2319', col: 'https://www.daechisecret.com/secret-library/?bmode=view&idx=175396075' },
    { open: true, area: '어휘', title: '짝 표현(콜로케이션) 40', sub: '기출 동사 + 전치사 40', thumb: 'n12', shop: 'https://www.daechisecret.com/shop_view/?idx=2323', col: 'https://www.daechisecret.com/secret-library/?bmode=view&idx=175424990' },
    { open: false, area: '어휘', title: '기출 다의어 20', thumb: 'n13', shop: '', col: '' },
    { open: true, area: '구문', title: '구문 해석 연습 — 끊어 읽기', sub: '기출 문장 10개 끊어 읽기', thumb: 'n14', shop: 'https://www.daechisecret.com/shop_view/?idx=2318', col: 'https://www.daechisecret.com/secret-library/?bmode=view&idx=175396053' },
    { open: true, area: '독해', title: '영어 연결어 · 독해 신호 표현', sub: '역접 · 예시 · 결과 독해 신호 표현', thumb: 'n15', shop: 'https://www.daechisecret.com/shop_view/?idx=2320', col: 'https://www.daechisecret.com/secret-library/?bmode=view&idx=175406145' },
    { open: true, area: '구문', title: '사역동사 · 지각동사 한 장 정리', sub: '목적격보어 동사원형 · -ing · p.p. 구별', thumb: 'n16', shop: 'https://www.daechisecret.com/shop_view/?idx=2322', col: 'https://www.daechisecret.com/secret-library/?bmode=view&idx=175406148' },
    { open: false, area: '구문', title: '비교 구문 한 장 정리', thumb: 'n17', shop: '', col: '' },
    { open: false, area: '구문', title: '명사절 · 복합관계사 한 장 정리', thumb: 'n18', shop: '', col: '' },
    { open: false, area: '구문', title: '가주어 · 진주어 한 장 정리', thumb: 'n19', shop: '', col: '' },
    { open: false, area: '어휘', title: '수능 영단어 주제별 정리 ① 경제·소비', thumb: 'n20', shop: '', col: '' },
    { open: false, area: '어휘', title: '감정 · 심경 영어 단어 모음', thumb: 'n21', shop: '', col: '' },
    { open: true, area: '독해', title: '주제 선지 표현 모음', sub: 'importance of · difficulties in · ways to 모의고사 주제 찾기', thumb: 'n22', shop: 'https://www.daechisecret.com/shop_view/?idx=2324', col: 'https://www.daechisecret.com/secret-library/?bmode=view&idx=175424993' },
    { open: false, area: '독해', title: '제목 선지 표현 모음', thumb: 'n23', shop: '', col: '' },
    { open: false, area: '독해', title: '주장 신호어 모음', thumb: 'n24', shop: '', col: '' },
    { open: false, area: '독해', title: '순서 · 삽입 단서 모음', thumb: 'n25', shop: '', col: '' },
    { open: false, area: '독해', title: '오답이 정답을 이긴 문항 (고1)', thumb: 'n26', shop: '', col: '' },
    { open: false, area: '독해', title: '모의고사 오답률 TOP 20 (고1)', thumb: 'n27', shop: '', col: '' },
    { open: false, area: '독해', title: '회차별 오답률 1위 문항 (고1)', thumb: 'n28', shop: '', col: '' },
    { open: false, area: '독해', title: '오답이 정답을 이긴 문항 (고2)', thumb: 'n30', shop: '', col: '' },
    { open: false, area: '독해', title: '모의고사 오답률 TOP 20 (고2)', thumb: 'n31', shop: '', col: '' },
    { open: false, area: '독해', title: '오답이 정답을 이긴 문항 (고3)', thumb: 'n32', shop: '', col: '' },
    { open: false, area: '독해', title: '모의고사 오답률 TOP 20 (고3)', thumb: 'n33', shop: '', col: '' },
    /* 칼럼만 있던 자료(11-07 자료실 통합) */
    { open: true, area: '어법', title: '고1 어법 10개년 기출 분석', sub: '학력평가 39회분 정답이 나온 자리', img: 'https://daechisecret.github.io/imweb-assets/column/grammar69_g1/grammar69_g1_pdf1.jpg', shop: 'https://www.daechisecret.com/shop_view/?idx=2822', col: 'https://www.daechisecret.com/secret-library/?bmode=view&idx=175462521' },
    { open: true, area: '어법', title: '고2 어법 10개년 기출 분석', sub: '학력평가 39회분 정답이 나온 자리', img: 'https://daechisecret.github.io/imweb-assets/column/grammar69_g2/grammar69_g2_pdf1.jpg', shop: 'https://www.daechisecret.com/shop_view/?idx=2821', col: 'https://www.daechisecret.com/secret-library/?bmode=view&idx=175462488' },
    { open: true, area: '어법', title: '수능 어법 10개년 기출 분석', sub: '29회분 정답이 나온 자리', img: 'https://daechisecret.github.io/imweb-assets/column/grammar69_g3/grammar69_g3_pdf1.jpg', shop: 'https://www.daechisecret.com/shop_view/?idx=2819', col: 'https://www.daechisecret.com/secret-library/?bmode=view&idx=175450365' },
    { open: true, area: '어휘', title: '고1 모의고사 빈출 어휘 500', sub: '10개년 39회 기출 단어 총정리', img: 'https://daechisecret.github.io/imweb-assets/column/voca500_g1/voca500_g1_pdf1.jpg', shop: 'https://www.daechisecret.com/shop_view/?idx=2823', col: 'https://www.daechisecret.com/secret-library/?bmode=view&idx=175472054' },
    { open: true, area: '어휘', title: '고2 모의고사 빈출 어휘 500', sub: '10개년 39회 기출 단어 총정리', img: 'https://daechisecret.github.io/imweb-assets/column/voca500_g2/voca500_g2_pdf1.jpg', shop: 'https://www.daechisecret.com/shop_view/?idx=2824', col: 'https://www.daechisecret.com/secret-library/?bmode=view&idx=175472070' },
    { open: true, area: '어휘', title: '고3 수능 빈출 어휘 500', sub: '수능 · 모평 · 학평 10개년 68회 기출 단어 총정리', img: 'https://daechisecret.github.io/imweb-assets/column/voca500_g3/voca500_g3_pdf1.jpg', shop: 'https://www.daechisecret.com/shop_view/?idx=2825', col: 'https://www.daechisecret.com/secret-library/?bmode=view&idx=175472081' },
    /* 중등(보라) */
    { open: false, lv: '중등', area: '어법', title: '헷갈리는 전치사 짝', sub: 'in vs into · above vs over 그림으로', thumb: 'm01', shop: '', col: '' },
    { open: false, lv: '중등', area: '어법', title: '헷갈리는 감정 형용사 짝', sub: 'bored vs boring, -ed와 -ing 차이', thumb: 'm02', shop: '', col: '' },
    { open: false, lv: '중등', area: '어휘', title: '헷갈리는 동사 짝', sub: 'borrow vs lend · look vs see', thumb: 'm03', shop: '', col: '' }
  ];

  /* 썸네일 폴더 = 이 스크립트가 있는 폴더 + thumbs/ */
  var BASE = (function () {
    var s = document.currentScript;
    if (!s) { var all = document.getElementsByTagName('script'); s = all[all.length - 1]; }
    var src = (s && s.src) ? s.src.split('?')[0] : '';
    /* 아임웹이 스크립트를 동적으로 넣으면 currentScript 가 비어 엉뚱한 스크립트를 집을 수 있다 → 게시 주소로 고정 */
    if (src.indexOf('free-notes') < 0) return 'https://daechisecret.github.io/imweb-assets/free-notes/thumbs/';
    return src.slice(0, src.lastIndexOf('/') + 1) + 'thumbs/';
  })();

  function esc(t) { return String(t).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;'); }
  function isOpen(it) { return it.open === true || !!it.shop; }

  var LOCK_SVG = '<svg viewBox="0 0 24 24" aria-hidden="true"><rect x="5" y="10.5" width="14" height="10" rx="2.4"/><path d="M8.2 10.5V8a3.8 3.8 0 0 1 7.6 0v2.5"/></svg>';

  /* ── 시크릿 자료실(2026-11-07 사장님 승인 시안): 무료 정리표 카드 + 칼럼 목록을 한 목록으로, 고등/중등 토글 + 영역 칩 + 검색 ──
   * - lv 가 없으면 고등. sub 는 카드 한 줄 설명. img 가 있으면 thumbs 대신 그 주소(칼럼 그림).
   * - 목록 화면(?bmode=view 아님)에서는 아래 「회원가입하고 받기」 띠 · 「헷갈리는 영어」 머리 · 게시판 목록을 숨긴다(글 주소는 그대로 → 검색 수집·기존 링크 유지).
   */
  var AREAS = ['어법', '어휘', '구문', '독해', '공부·정보'];
  var JOIN = '/site_join_pattern_choice?back_url=L3NlY3JldC1saWJyYXJ5';
  var FONTS = BASE.replace(/thumbs\/$/, 'fonts/');
  var CSS = [
    '@font-face{font-family:"DCS Playball";src:url(' + FONTS + 'playball.woff2) format("woff2")}',
    '#dcs-notes{max-width:1160px;margin:0 auto 70px!important;padding:0 20px}',
    '#dcs-notes>*:not(.lb){display:none!important}',
    '#dcs-notes .lb{--hi:#E4587E;--mid:#8B6FD6;--ink:#2E2433;--sub:#7A6C78;--line:#F1E4EA;--ac:#2E2433;color:var(--ink);font-family:"DCS Noto","Noto Sans KR",sans-serif}',
    '#dcs-notes .lb *{box-sizing:border-box;margin:0;padding:0}',
    '#dcs-notes .lb-top{display:flex;align-items:flex-end;justify-content:space-between;gap:20px;flex-wrap:wrap;padding-top:34px}',
    '#dcs-notes .lb-eng{font:400 32px/1 "DCS Playball",cursive;color:var(--hi)}',
    '#dcs-notes .lb-h{font-family:"DCS Paperlogy","Paperlogy",sans-serif!important;font-weight:800;font-size:40px;line-height:1.15;letter-spacing:-1px;margin-top:6px!important}',
    '#dcs-notes .lb-desc{font-size:15.5px;color:var(--sub);margin-top:8px!important}',
    '#dcs-notes .lb-tools{display:flex;gap:10px;align-items:center}',
    '#dcs-notes .lb-q{width:260px;border:1.5px solid #E6DCE2;border-radius:999px;padding:10px 18px;font-size:15px;outline:none;background:#fff;color:var(--ink)}',
    '#dcs-notes .lb-q:focus{border-color:var(--ac)}',
    '#dcs-notes .lb-join{display:inline-block;white-space:nowrap;background:var(--hi);color:#fff!important;font-family:"DCS Paperlogy",sans-serif!important;font-weight:800;font-size:15px;padding:11px 22px;border-radius:999px;text-decoration:none!important}',
    '#dcs-notes .lb-lv{display:inline-flex;margin-top:28px!important;background:#F6F1F4;border-radius:999px;padding:5px!important}',
    '#dcs-notes .lb-lv button,#dcs-notes .lb-chips button,#dcs-notes .lb-more{font-family:"DCS Paperlogy",sans-serif!important;cursor:pointer}',
    '#dcs-notes .lb-lv button{border:0;background:none;font-weight:800;font-size:17px;color:#8A7C88;padding:10px 28px!important;border-radius:999px}',
    '#dcs-notes .lb-lv button i,#dcs-notes .lb-chips button i{font-style:normal;font-weight:700;font-size:13px;margin-left:6px;opacity:.7}',
    '#dcs-notes .lb-lv button.on{color:#fff;background:var(--ink)}#dcs-notes .lb-lv button.on.hi{background:var(--hi)}#dcs-notes .lb-lv button.on.mid{background:var(--mid)}',
    '#dcs-notes .lb-chips{display:flex;gap:8px;margin-top:16px!important;flex-wrap:wrap}',
    '#dcs-notes .lb-chips button{border:1.5px solid #E6DCE2;background:#fff;font-weight:700;font-size:15px;color:#6B5E69;padding:7px 17px!important;border-radius:999px}',
    '#dcs-notes .lb-chips button.on{border-color:var(--ac);background:var(--ac);color:#fff}#dcs-notes .lb-chips button.off{opacity:.45}',
    '#dcs-notes .lb-bar{display:flex;justify-content:space-between;align-items:center;margin-top:24px!important;padding-bottom:11px!important;border-bottom:2px solid var(--ink);font-weight:700;font-size:15px}',
    '#dcs-notes .lb-bar b{color:var(--ac)}#dcs-notes .lb-bar span{color:var(--sub);font-weight:500;font-size:14px}',
    '#dcs-notes .lb-grid{display:grid;grid-template-columns:repeat(4,minmax(0,1fr));gap:28px 22px;margin-top:24px!important}',
    '#dcs-notes .lb-card{position:relative;display:flex;flex-direction:column;border:1px solid var(--line);background:#fff;color:inherit!important;text-decoration:none!important}',
    '#dcs-notes a.lb-card:hover .lb-tt{color:var(--hi)}',
    '#dcs-notes .lb-th{position:relative;aspect-ratio:4/3;overflow:hidden;background:#FBF6F8;border-bottom:1px solid var(--line)}',
    '#dcs-notes .lb-th img{width:100%;height:100%;object-fit:cover;object-position:top;display:block}',
    '#dcs-notes .lb-badge{position:absolute;left:10px;top:10px;font-family:"DCS Paperlogy",sans-serif!important;font-weight:800;font-size:12px;color:#fff;padding:3px 10px!important;border-radius:999px;background:var(--hi)}#dcs-notes .lb-badge.mid{background:var(--mid)}',
    '#dcs-notes .lb-lock{position:absolute;inset:0;background:rgba(255,255,255,.55);display:flex;align-items:center;justify-content:center}',
    '#dcs-notes .lb-lock span{font-family:"DCS Paperlogy",sans-serif!important;font-weight:800;font-size:14px;color:#fff;background:rgba(46,36,51,.78);padding:6px 15px!important;border-radius:999px}',
    '#dcs-notes .lb-bd{display:flex;flex-direction:column;flex:1;padding:13px 14px 15px!important}',
    '#dcs-notes .lb-area{font-family:"DCS Paperlogy",sans-serif!important;font-weight:800;font-size:13px;color:var(--c2)}',
    '#dcs-notes .lb-tt{font-family:"DCS Paperlogy",sans-serif!important;font-weight:800;font-size:17.5px;line-height:1.38;letter-spacing:-.3px;margin-top:4px!important;min-height:48px}',
    '#dcs-notes .lb-sb{font-size:13.5px;line-height:1.45;color:var(--sub);margin-top:6px!important;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}',
    '#dcs-notes .lb-ft{display:flex;align-items:center;justify-content:space-between;margin-top:auto!important;padding-top:12px!important;font-size:13px;font-weight:600;color:#A698A3}',
    '#dcs-notes .lb-pdf{font-family:"DCS Paperlogy",sans-serif!important;font-weight:800;font-size:12px;color:var(--c2);border:1.5px solid currentColor;padding:1px 9px!important;border-radius:999px}',
    '#dcs-notes .lb-locked .lb-tt{color:#8a8590}#dcs-notes .lb-locked .lb-pdf{opacity:.5}',
    '#dcs-notes .lb-empty{grid-column:1/-1;text-align:center;padding:56px 0!important;color:var(--sub);font-size:15px;border:1.5px dashed #E6DCE2}',
    '#dcs-notes .lb-more{display:block;margin:32px auto 0!important;background:#fff;border:1.5px solid var(--ink);border-radius:4px;padding:11px 26px!important;font-size:14px;font-weight:700;color:var(--ink)}',
    '.lb-hide{display:none!important}',
    '@media (max-width:760px){#dcs-notes{padding:0 16px}#dcs-notes .lb-top{padding-top:22px}#dcs-notes .lb-h{font-size:29px}#dcs-notes .lb-eng{font-size:25px}',
    '#dcs-notes .lb-tools{width:100%;flex-direction:column;align-items:stretch}#dcs-notes .lb-q{width:100%}#dcs-notes .lb-join{text-align:center}',
    '#dcs-notes .lb-lv{display:flex}#dcs-notes .lb-lv button{flex:1;padding:10px 0!important;font-size:15.5px}',
    '#dcs-notes .lb-chips{flex-wrap:nowrap;overflow-x:auto;margin-right:-16px!important;padding-right:16px!important;-webkit-overflow-scrolling:touch}#dcs-notes .lb-chips button{flex:none}',
    '#dcs-notes .lb-grid{grid-template-columns:repeat(2,minmax(0,1fr));gap:18px 12px}#dcs-notes .lb-tt{font-size:14.5px;min-height:40px}#dcs-notes .lb-sb{display:none}',
    '#dcs-notes .lb-bd{padding:10px 10px 12px!important}#dcs-notes .lb-ft{font-size:11px}#dcs-notes .lb-more{width:100%}}'
  ].join('\n');

  function img(it) { return it.img ? it.img : BASE + it.thumb + (isOpen(it) ? '.jpg' : '_lock.jpg'); }
  function lvOf(it) { return it.lv || '고등'; }

  function card(it) {
    var mid = lvOf(it) === '중등', open = isOpen(it), go = it.col || it.shop, c2 = mid ? '#8B6FD6' : '#E4587E';
    var th = '<div class="lb-th"><img src="' + esc(img(it)) + '" alt="' + esc(it.title) + (open ? ' 정리표 첫 쪽' : '') + '" loading="lazy">' +
      '<span class="lb-badge' + (mid ? ' mid' : '') + '">' + lvOf(it) + '</span>' + (open ? '' : '<div class="lb-lock"><span>곧 공개</span></div>') + '</div>';
    var bd = '<div class="lb-bd" style="--c2:' + c2 + '"><div class="lb-area">' + esc(it.area) + '</div><h3 class="lb-tt">' + esc(it.title) + '</h3>' +
      '<p class="lb-sb">' + (it.sub ? esc(it.sub) : '&nbsp;') + '</p>' +
      '<div class="lb-ft"><span class="lb-pdf">무료 PDF</span><span>' + (open ? (go ? '칼럼 읽기 →' : '준비 중') : '공개 예정') + '</span></div></div>';
    if (open && go) return '<a class="lb-card" href="' + esc(go) + '">' + th + bd + '</a>';
    return '<div class="lb-card' + (open ? '' : ' lb-locked') + '">' + th + bd + '</div>';
  }

  function render(root) {
    if (!document.getElementById('lb-css')) { var st = document.createElement('style'); st.id = 'lb-css'; st.textContent = CSS; document.head.appendChild(st); }
    var S = { lv: '전체', ar: '전체', q: '', all: false };
    var box = document.createElement('div'); box.className = 'lb'; root.appendChild(box);
    box.innerHTML = '<div class="lb-top"><div><div class="lb-eng">Secret Library</div><h2 class="lb-h">시크릿 자료실</h2>' +
      '<p class="lb-desc">대치동 영어쌤이 직접 만든 정리표 · 칼럼을 모았어요. 회원은 PDF를 무료로 받아요.</p></div>' +
      '<div class="lb-tools"><input class="lb-q" type="search" placeholder="자료 · 칼럼 검색" aria-label="자료 검색"><a class="lb-join" href="' + JOIN + '">회원가입하고 무료로 받기</a></div></div>' +
      '<div class="lb-lv" role="tablist"></div><div class="lb-chips"></div><div class="lb-bar"><div class="lb-cnt"></div><span>공개된 자료 먼저</span></div>' +
      '<div class="lb-grid"></div><button type="button" class="lb-more"></button>';
    var $ = function (s) { return box.querySelector(s); };
    var all = [], i, j;
    for (i = 0; i < NOTES.length; i++) if (isOpen(NOTES[i])) all.push(NOTES[i]);
    for (i = 0; i < NOTES.length; i++) if (!isOpen(NOTES[i])) all.push(NOTES[i]);
    function draw() {
      var mid = S.lv === '중등';
      box.style.setProperty('--ac', mid ? '#8B6FD6' : S.lv === '고등' ? '#E4587E' : '#2E2433');
      var inLv = all.filter(function (x) { return S.lv === '전체' || lvOf(x) === S.lv; });
      var lvs = ['전체', '고등', '중등'], h = '';
      for (i = 0; i < lvs.length; i++) {
        var n = all.filter(function (x) { return lvs[i] === '전체' || lvOf(x) === lvs[i]; }).length;
        h += '<button type="button" data-lv="' + lvs[i] + '" class="' + (lvs[i] === S.lv ? 'on ' : '') + (lvs[i] === '고등' ? 'hi' : lvs[i] === '중등' ? 'mid' : '') + '">' + lvs[i] + '<i>' + n + '</i></button>';
      }
      $('.lb-lv').innerHTML = h; h = '';
      var ars = ['전체'].concat(AREAS);
      for (i = 0; i < ars.length; i++) {
        var m = inLv.filter(function (x) { return ars[i] === '전체' || x.area === ars[i]; }).length;
        h += '<button type="button" data-ar="' + ars[i] + '" class="' + (ars[i] === S.ar ? 'on' : '') + (m ? '' : ' off') + '">' + ars[i] + '<i>' + m + '</i></button>';
      }
      $('.lb-chips').innerHTML = h;
      var q = S.q.replace(/\s+/g, '').toLowerCase();
      var L = inLv.filter(function (x) { return (S.ar === '전체' || x.area === S.ar) && (!q || (x.title + (x.sub || '') + x.area).replace(/\s+/g, '').toLowerCase().indexOf(q) >= 0); });
      var openN = L.filter(isOpen).length;
      $('.lb-cnt').innerHTML = (S.lv === '전체' ? '' : S.lv + ' · ') + (S.ar === '전체' ? '전체' : S.ar) + ' <b>' + L.length + '</b>개 · 공개 ' + openN;
      var cap = window.matchMedia && window.matchMedia('(max-width:760px)').matches ? 8 : 12, show = S.all ? L : L.slice(0, cap);
      h = ''; for (j = 0; j < show.length; j++) h += card(show[j]);
      $('.lb-grid').innerHTML = L.length ? h : '<div class="lb-empty">' + (q ? '찾는 자료가 없어요. 다른 낱말로 찾아보세요.' : S.ar === '공부·정보' ? '공부법 · 시험 정보 칼럼이 곧 올라와요' : '곧 새 자료가 올라와요') + '</div>';
      var more = $('.lb-more');
      if (L.length > show.length) { more.style.display = ''; more.textContent = '자료 ' + (L.length - show.length) + '개 더 보기'; } else more.style.display = 'none';
    }
    box.addEventListener('click', function (e) {
      var b = e.target.closest ? e.target.closest('button') : null; if (!b) return;
      if (b.getAttribute('data-lv')) { S.lv = b.getAttribute('data-lv'); S.ar = '전체'; S.all = false; draw(); }
      else if (b.getAttribute('data-ar')) { S.ar = b.getAttribute('data-ar'); S.all = false; draw(); }
      else if (b.className === 'lb-more') { S.all = true; draw(); }
    });
    $('.lb-q').addEventListener('input', function () { S.q = this.value; S.all = false; draw(); });
    draw();
  }

  /* 목록 화면: 아래 띠 · 머리 · 게시판 목록 숨기기(위젯 하나로 통합). 글 보기에서는 그대로 두고 위젯만 글 아래로. */
  function hideOldList(root) {
    if (/[?&]bmode=view(&|$)/.test(location.search)) return;
    var mine = root.closest ? root.closest('.section_wrap') : null, secs = document.querySelectorAll('.section_wrap');
    for (var i = 0; i < secs.length; i++) {
      var s = secs[i]; if (s === mine) continue;
      if (s.querySelector('#slc-free, ._board_wrap, .board_wrap, [class*="board"]')) s.classList.add('lb-hide');
    }
    function band() { var b = document.querySelectorAll('.slc-joinwrap'); for (var k = 0; k < b.length; k++) b[k].classList.add('lb-hide'); }
    band(); setTimeout(band, 600); setTimeout(band, 2000);
  }

  /* 글 보기 화면(?bmode=view)에서는 칼럼 글이 바로 보이게, 위젯 섹션을 게시글 섹션 뒤로 옮긴다(사장님 2026-11-01). */
  function moveBelowPost(root) {
    if (!/[?&]bmode=view(&|$)/.test(location.search)) return;
    var sec = root.closest ? root.closest('.section_wrap') : null;
    if (!sec || sec.getAttribute('data-nt-moved')) return;
    var post = sec.nextElementSibling;
    while (post && !(post.classList && post.classList.contains('section_wrap'))) post = post.nextElementSibling;
    if (!post) return;
    post.parentNode.insertBefore(sec, post.nextSibling);
    sec.setAttribute('data-nt-moved', '1');
    sec.classList.add('nt-after-post');
  }

  function init() {
    var roots = document.querySelectorAll('.dcs-notes');
    for (var i = 0; i < roots.length; i++) { if (roots[i].getAttribute('data-lb')) continue; roots[i].setAttribute('data-lb', '1'); render(roots[i]); hideOldList(roots[i]); moveBelowPost(roots[i]); }
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
  else init();
})();
