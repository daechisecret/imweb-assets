/* 대치동시크릿 「SECRET NOTE 무료 정리표」 위젯
 * - 아임웹 코드 위젯은 달러+중괄호 문법을 위젯 변수로 바꿔 버리므로 템플릿 문자열을 쓰지 않는다(문자열 + 로만 잇기).
 * - 공개 여부는 날짜가 아니라 아래 배열에서 수동으로 정한다: open: true 이거나 shop(상품 주소)이 들어 있으면 공개.
 * - 공개된 카드가 앞에, 잠금 카드(「곧 공개돼요!」)가 뒤에 온다. 같은 무리 안에서는 배열 순서를 따른다.
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
  var NOTES = [
    { open: true, area: '어법', title: '관계대명사 · 관계부사 한 장 정리', thumb: 'n01',
      shop: 'https://www.daechisecret.com/shop_view/?idx=2218',
      col: 'https://www.daechisecret.com/secret-library/?bmode=view&idx=175348213' },
    { open: false, area: '어법', title: '분사구문 한 장 정리', thumb: 'n04', shop: '', col: '' },
    { open: false, area: '어법', title: 'to부정사 · 동명사 한 장 정리', thumb: 'n03', shop: '', col: '' },
    { open: false, area: '어법', title: '수동태 한 장 정리', thumb: 'n06', shop: '', col: '' },
    { open: false, area: '어법', title: '조동사 · 가정법 한 장 정리', thumb: 'n05', shop: '', col: '' },
    { open: false, area: '어휘', title: '기출 숙어 50 총정리', thumb: 'n11', shop: '', col: '' },
    { open: false, area: '어휘', title: '기출 다의어 20', thumb: 'n13', shop: '', col: '' },
    { open: false, area: '어휘', title: '감정 · 심경 영어 단어 모음', thumb: 'n21', shop: '', col: '' },
    { open: false, area: '구문', title: '구문 해석 연습 — 끊어 읽기', thumb: 'n14', shop: '', col: '' },
    { open: false, area: '구문', title: '명사절 · 복합관계사 한 장 정리', thumb: 'n18', shop: '', col: '' },
    { open: false, area: '독해', title: '주제 선지 표현 모음', thumb: 'n22', shop: '', col: '' },
    { open: false, area: '독해', title: '제목 선지 표현 모음', thumb: 'n23', shop: '', col: '' },
    { open: false, area: '독해', title: '순서 · 삽입 단서 모음', thumb: 'n25', shop: '', col: '' },
    { open: false, area: '독해', title: '모의고사 오답률 TOP 20 (고1)', thumb: 'n27', shop: '', col: '' },
    { open: false, area: '독해', title: '모의고사 오답률 TOP 20 (고2)', thumb: 'n31', shop: '', col: '' },
    { open: false, area: '독해', title: '모의고사 오답률 TOP 20 (고3)', thumb: 'n33', shop: '', col: '' }
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

  function card(it) {
    var cat = '<span class="nt-cat">' + esc(it.area) + '</span>';
    if (isOpen(it)) {
      var img = '<img src="' + BASE + it.thumb + '.jpg" alt="' + esc(it.title) + ' 무료 정리표 첫 쪽" loading="lazy">';
      var thumb = it.shop ? '<a class="nt-thumb" href="' + esc(it.shop) + '">' + img + '</a>' : '<div class="nt-thumb">' + img + '</div>';
      var get = it.shop
        ? '<a class="nt-get" href="' + esc(it.shop) + '">무료로 받기</a>'
        : '<span class="nt-get nt-wait">준비 중이에요</span>';
      var col = it.col ? '<a class="nt-col" href="' + esc(it.col) + '">칼럼 읽기 &rarr;</a>' : '';
      return '<article class="nt-card nt-open">' + thumb +
        '<div class="nt-meta">' + cat + '<span class="nt-free">PDF 무료</span></div>' +
        '<h3 class="nt-ttl">' + esc(it.title) + '</h3>' +
        '<div class="nt-act">' + get + col + '</div></article>';
    }
    return '<article class="nt-card nt-locked" aria-label="' + esc(it.title) + ', 곧 공개 예정">' +
      '<div class="nt-thumb"><img src="' + BASE + it.thumb + '_lock.jpg" alt="" loading="lazy">' +
      '<span class="nt-lock">' + LOCK_SVG + '</span></div>' +
      '<div class="nt-meta">' + cat + '</div>' +
      '<h3 class="nt-ttl">' + esc(it.title) + '</h3>' +
      '<p class="nt-soon">곧 공개돼요!</p></article>';
  }

  function render(root) {
    var opened = [], locked = [], i;
    for (i = 0; i < NOTES.length; i++) (isOpen(NOTES[i]) ? opened : locked).push(NOTES[i]);
    var list = opened.concat(locked), html = '';
    for (i = 0; i < list.length; i++) {
      /* 접힌 상태: PC 는 8장, 모바일은 6장까지 보이고 나머지는 「모두 보기」 */
      var c = card(list[i]);
      if (i >= 8) c = c.replace('class="nt-card', 'class="nt-card nt-o8 nt-o6');
      else if (i >= 6) c = c.replace('class="nt-card', 'class="nt-card nt-o6');
      html += c;
    }
    var grid = root.querySelector('[data-nt="cards"]');
    if (grid) grid.innerHTML = html;

    var more = root.querySelector('[data-nt="more"]');
    if (more) {
      if (list.length <= 6) more.style.display = 'none';
      else {
        if (list.length <= 8) more.className += ' nt-m-only';
        more.addEventListener('click', function () { root.classList.remove('nt-fold'); });
      }
    }
  }

  function init() {
    var roots = document.querySelectorAll('.dcs-notes');
    for (var i = 0; i < roots.length; i++) render(roots[i]);
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
  else init();
})();
