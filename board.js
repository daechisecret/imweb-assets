/* ═══════════════════════════════════════════════════════════════
   대치동시크릿 게시판 공통 꾸미기 — 짝꿍 스크립트

   아임웹이 그려 놓은 게시판을 **다시 쓰지 않고 옮겨 담습니다.**
   글쓰기·검색·쪽넘김·글보기는 아임웹 것을 그대로 두어야 하므로,
   목록 줄만 우리 모양으로 새로 만들고 원래 것은 감춥니다.

   어느 게시판을 어떤 모양으로 보일지
     /notice   공지사항  → 줄 목록
     /contact  문의하기  → 줄 목록 (답변완료/대기 딱지)
     /faq      자주 묻는 질문 → 펼침 (누르면 그 자리에서 답이 열립니다)
   나머지 게시판은 건드리지 않습니다 (/reviews 는 따로 만든 페이지가 있습니다).

   글 보기(bmode=view)·글쓰기 화면에서는 아무것도 하지 않습니다.
   ═══════════════════════════════════════════════════════════════ */
(function () {
  var HOW = {
    '/notice':  { how: 'line', name: '공지사항' },
    '/contact': { how: 'line', name: '문의하기' },
    '/faq':     { how: 'fold', name: '자주 묻는 질문' }
  };

  var path = location.pathname.replace(/\/$/, '');
  var cfg = HOW[path];
  if (!cfg) return;
  /* 글 보기 화면은 목록을 새로 그리지 않고 **모양만** 다듬습니다 (body 에 표시만 붙입니다).
     글쓰기·댓글·좋아요는 아임웹 기능이라 건드리면 안 됩니다. */
  if (/[?&]bmode=(view|write|edit|reply)/.test(location.search)) {
    if (/[?&]bmode=view/.test(location.search)) {
      var mark = function () {
        if (document.querySelector('.board_view')) document.body.classList.add('sl-bv');
      };
      mark();
      window.addEventListener('load', mark);
      setTimeout(mark, 400); setTimeout(mark, 1500);
    }
    return;
  }

  function esc(s) {
    return String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;')
      .replace(/>/g, '&gt;').replace(/"/g, '&quot;');
  }
  function txt(el, sel) {
    var e = el.querySelector(sel);
    return e ? (e.textContent || '').replace(/\s+/g, ' ').trim() : '';
  }

  /* ── 목록 줄을 읽어 냅니다 ──
     아임웹 게시판은 두 모양으로 나옵니다.
       .post_link_wrap  공지사항처럼 그림이 붙는 목록
       .li_board > ul   FAQ·문의처럼 표 모양 목록 */
  /* 원본 글줄의 링크를 기억해 둡니다.
     문의 게시판은 비밀글이 많아 링크에 blocked 딱지가 붙습니다.
     그 링크는 **아임웹이 눌린 것을 가로채** 비밀번호를 묻고 나서야 열어 줍니다.
     우리가 주소만 보고 그냥 옮겨 가면 확인 절차가 빠져 되돌려 보내집니다
     (「글이 잠깐 보였다 사라진다」가 이것입니다).
     그래서 손님이 우리 줄을 누르시면 **원본 링크를 대신 눌러 드립니다.** */
  var ORIG = [];

  /* ── 비밀글인가 ──
     ⚠ 예전에는 줄 안에 자물쇠 요소(.bt-lock)나 blocked 링크가 **있기만 하면** 비밀글로 봤습니다.
        그런데 아임웹은 **모든 줄에** 자물쇠 요소를 넣어 두고 비밀글이 아니면 숨겨(display:none) 둡니다.
        휴대폰용 blocked 링크도 모든 줄에 있습니다. 그래서 문의 게시판 글이 죄다 자물쇠였습니다.
        이제는 자물쇠가 **보이는지**, 제목 링크에 lock_on 이 붙었는지를 봅니다. */
  function isLocked(row, a) {
    var ic = row.querySelector('i.bt-lock, i[class*="lock"]');
    if (ic) {
      var st = (ic.getAttribute('style') || '').replace(/\s/g, '');
      if (!/display:none/.test(st)) return true;
    }
    if (a && /lock_on/.test(a.className || '')) return true;
    return !!row.querySelector('.list_text_title.lock_on');
  }

  function readRows(root) {
    var out = [];
    ORIG = [];

    var wraps = root.querySelectorAll('.post_link_wrap');
    for (var i = 0; i < wraps.length; i++) {
      var w = wraps[i];
      var a = w.querySelector('a.title_link');
      if (!a) continue;
      /* 제목 안에 '공지' 딱지 글자가 섞여 있어 떼어 냅니다 */
      var c = a.cloneNode(true), st = c.querySelectorAll('.sticker');
      for (var j = 0; j < st.length; j++) st[j].parentNode.removeChild(st[j]);
      var t = (c.textContent || '').replace(/\s+/g, ' ').trim();
      if (!t) continue;
      ORIG.push(a);
      out.push({
        i: ORIG.length - 1,
        lock: isLocked(w, a),
        t: t,
        u: a.getAttribute('href') || '',
        w: txt(w, '.author'),
        d: txt(w, '.time'),
        v: (txt(w, '.views') || '').replace(/[^0-9]/g, ''),
        c: (txt(w, '.txt') || '').replace(/[^0-9]/g, ''),
        pin: !!w.querySelector('.sticker.notice')
      });
    }
    if (out.length) return out;

    var uls = root.querySelectorAll('.li_board > ul');
    for (var k = 0; k < uls.length; k++) {
      var u = uls[k];
      if (/li_header/.test(u.className)) continue;
      var tit = u.querySelector('.tit');
      if (!tit) continue;
      var t2 = (tit.textContent || '').replace(/\s+/g, ' ').trim();
      if (!t2 || t2 === '제목') continue;
      /* 제목 칸에는 링크가 둘 있습니다 — 글로 가는 것은 bmode=view 가 붙은 쪽입니다 */
      /* 제목 링크를 먼저 씁니다 — 비밀글은 이 링크에 아임웹의 확인이 걸려 있습니다 */
      var a2 = u.querySelector('a.list_text_title') ||
               u.querySelector('a[href*="bmode=view"]') ||
               u.querySelector('a[href*="idx="]');
      ORIG.push(a2 || null);
      /* 비밀글은 아임웹이 링크에 blocked 딱지를 붙이고,
         줄 어딘가에 자물쇠 아이콘(bt-lock 따위)을 넣어 둡니다. */
      var lock = isLocked(u, a2);
      out.push({
        i: ORIG.length - 1,
        lock: lock,
        t: t2,
        u: a2 ? a2.getAttribute('href') : '',
        w: txt(u, '.name'),
        d: txt(u, '.time') || txt(u, '.date'),
        v: (txt(u, '.read') || '').replace(/[^0-9]/g, ''),
        c: (txt(u, '.comment-count') || '').replace(/[^0-9]/g, ''),
        pin: !!u.querySelector('.icon-flag, .sticker.notice')
      });
    }
    return out;
  }

  /* 글이 죄다 「공지」로 올라와 있으면 딱지가 아무것도 안 알려 줍니다.
     (공지사항 게시판은 32개가 전부 공지였습니다 — 줄마다 분홍이면 강조가 아니라 배경입니다.)
     그래서 공지가 절반을 넘으면 딱지도 분홍 바탕도 쓰지 않습니다. */
  var pinUseful = true;

  /* 문의 게시판은 댓글이 달렸으면 답변이 된 것으로 봅니다 */
  function tagOf(r) {
    if (r.pin && pinUseful) return '<span class="sl-tag pin">공지</span>';
    if (path === '/contact') {
      return Number(r.c) > 0
        ? '<span class="sl-tag done">답변완료</span>'
        : '<span class="sl-tag wait">답변대기</span>';
    }
    return '';
  }

  /* 번호 칸은 뺐습니다 — 쪽을 넘기면 어차피 안 맞고, 그 자리를 제목에 주는 편이 낫습니다. */
  function lineHTML(rows) {
    return '<div class="sl-head"><b>제목</b><b>글쓴이</b><b>작성일</b><b>조회</b></div>' +
      rows.map(function (r) {
        var pin = r.pin && pinUseful;
        return '<a class="sl-row' + (pin ? ' pin' : '') + '" data-i="' + r.i + '" href="' + esc(r.u) + '">' +
          '<span class="sl-tt">' + tagOf(r) +
          (r.lock ? '<span class="sl-lock" title="비밀글입니다">🔒</span><span class="sl-tag secret">비밀글</span>' : '') +
          '<span class="t' + (r.lock ? ' secret' : '') + '">' + (r.lock ? '비밀글입니다🩷' : esc(r.t)) + '</span>' +
          (Number(r.c) ? '<span class="sl-cm">💬 ' + r.c + '</span>' : '') + '</span>' +
          '<span class="sl-w">' + esc(r.w) + '</span>' +
          '<span class="sl-d">' + esc((r.d || '').replace(/^\d{4}-/, '')) + '</span>' +
          '<span class="sl-v">' + esc(r.v) + '</span></a>';
      }).join('');
  }

  /* ── 자주 묻는 질문 갈래 ──
     제목에 [주문/결제] 처럼 갈래를 적어 두시면 그것을 그대로 씁니다 (화면에서는 떼고 보여 줍니다).
     안 적혀 있으면 제목의 낱말로 짐작합니다 — 위에서부터 먼저 맞는 것이 이깁니다. */
  /* 2026-08-26 FAQ 정비 — 갈래 8개. 글 제목은 모두 「[갈래] 질문」 으로 적습니다. */
  var CATS = ['회원/로그인', '자료 찾기', '자료 소개', '패키지/할인', '주문/결제', '다운로드/파일', '환불/저작권', '문의/오류'];
  var CAT_RULES = [
    ['회원/로그인',   /회원|가입|로그인|비밀번호|아이디/],
    ['패키지/할인',   /패키지|할인|쿠폰|적립|포인트|이벤트/],
    ['다운로드/파일', /다운|받나요|받아|저장|압축|PDF|HWP|한글|인쇄|편집|글꼴|폰트|열리/],
    ['환불/저작권',   /환불|교환|저작권|복사|배포|공유/],
    ['주문/결제',     /결제|주문|구매|취소|영수증|계산서|쏠북/],
    ['문의/오류',     /오류|오타|수정|문의|상담|공지|후기/],
    ['자료 찾기',     /찾|검색|샘플|미리보기|예정|전범위|SL|TEST/],
    ['자료 소개',     /자료|구성|유형|교재|정답|난이도|업로드|올라오/]
  ];
  function catOf(title) {
    var m = /\[([^\]]{2,14})\]/.exec(title);
    if (m) { for (var i = 0; i < CATS.length; i++) if (CATS[i] === m[1].trim()) return CATS[i]; }
    for (var j = 0; j < CAT_RULES.length; j++) if (CAT_RULES[j][1].test(title)) return CAT_RULES[j][0];
    return '문의/오류';
  }
  function cleanQ(t) {
    return t.replace(/^[\s💌📌📣✨🩷❤️💗]+/, '').replace(/^Q\.\s*/i, '')
            .replace(/^\[([^\]]{2,14})\]\s*/, function (all, c) { return CATS.indexOf(c.trim()) >= 0 ? '' : all; });
  }

  function foldHTML(rows) {
    var counts = {};
    rows.forEach(function (r) { r.cat = catOf(r.t); counts[r.cat] = (counts[r.cat] || 0) + 1; });
    /* 갈래 차례로 묶어 보입니다 (회원/로그인 → 자료 찾기 → … ).
       같은 갈래 안에서는 게시판과 **거꾸로**(오래된 글부터) — 글을 올린 차례가 곧 읽는 차례이기 때문입니다
       (「어떤 곳인가요」가 맨 위, 「샘플을 볼 수 있나요」가 자료 찾기 맨 위). */
    rows = rows.map(function (r, i) { return { r: r, i: i }; }).sort(function (a, b) {
      var ca = CATS.indexOf(a.r.cat), cb = CATS.indexOf(b.r.cat);
      return ca !== cb ? ca - cb : b.i - a.i;
    }).map(function (x) { return x.r; });
    var chips = '<div class="sl-cats"><button type="button" class="on" data-cat="">전체 <em>' + rows.length + '</em></button>' +
      CATS.filter(function (c) { return counts[c]; }).map(function (c) {
        return '<button type="button" data-cat="' + esc(c) + '">' + esc(c) + ' <em>' + counts[c] + '</em></button>';
      }).join('') + '</div>';
    return chips + rows.map(function (r) {
      return '<div class="sl-fq" data-u="' + esc(r.u) + '" data-cat="' + esc(r.cat) + '">' +
        '<div class="q"><span class="mk">Q</span>' + tagOf(r) +
        '<span class="t">' + esc(cleanQ(r.t)) + '</span>' +
        '<span class="sl-cat">' + esc(r.cat) + '</span>' +
        '<span class="arw">▾</span></div>' +
        '<div class="a"><span class="wait">답변을 불러오는 중입니다…</span></div></div>';
    }).join('') + '<div class="sl-fq-none">이 갈래에는 아직 질문이 없습니다.</div>';
  }

  /* @@answer-start — 여기부터 @@answer-end 까지는 build_faq.py 의 미리보기도 그대로 씁니다 */
  /* ── 답 본문 서식 (2026-08-26 FAQ 정비) ──
     글은 아임웹 편집기(Froala)로 올라가 있어 class 가 지워질 수 있습니다.
     그래서 **글자와 alt** 로 상자를 알아봅니다 —
       blockquote 가 「주의」로 시작 → 노란 주의 상자 / 그 밖의 blockquote → 파란 알아두기 상자
       문단이 「카카오톡 채널」로 시작 → 카카오 마무리 줄
       문단이 「관련 질문」으로 시작 → 관련 질문 알약 줄 (#fq=열쇠 → 그 글 펼치기)
       문단이 「순서 :」로 시작 → 알약 타임라인 (A(가장 먼저) → B → C(마지막))
       img alt="샘플 …" 여러 장 → 작은 액자 한 줄 + 누르면 크게 넘겨 보기
       img alt="휴대폰"        → 휴대폰 화면 세 장 나란히
       첫 문단(굵은 한 줄 답) → 큰 글씨 */
  function dressAnswer(box) {
    var first = box.querySelector('p, div');
    if (first && !first.querySelector('img') && first.textContent.trim()) first.classList.add('sl-lead');
    var bqs = box.querySelectorAll('blockquote');
    for (var i = 0; i < bqs.length; i++) {
      bqs[i].classList.add(/^\s*주의/.test(bqs[i].textContent) ? 'sl-warn' : 'sl-tip');
    }
    var ps = box.querySelectorAll('p');
    for (var j = 0; j < ps.length; j++) {
      var t = ps[j].textContent.trim();
      if (/^카카오톡 채널/.test(t)) ps[j].classList.add('sl-kakao');
      else if (/^관련 질문/.test(t)) ps[j].classList.add('sl-rel');
      else if (/^순서\s*[:：]/.test(t)) timelineOf(ps[j], t);
      else if (ps[j].querySelector('img[alt="휴대폰"]')) ps[j].classList.add('sl-phones');
      else if (ps[j].querySelectorAll('img[alt^="샘플"]').length > 1) galleryOf(ps[j]);
      else if (ps[j].children.length === 1 && ps[j].firstElementChild.tagName === 'A' && /샘플 자세히/.test(t)) ps[j].classList.add('sl-more');
    }
    var as = box.querySelectorAll('.sl-rel a[href^="#fq="]');
    for (var q = 0; q < as.length; q++) {
      as[q].addEventListener('click', function (e) {
        e.preventDefault();
        openByKey(decodeURIComponent(this.getAttribute('href').slice(4)));
      });
    }
  }

  /* 「순서 : A(가장 먼저) → B(그다음) → C → D(마지막)」 → 알약 줄. 괄호 안은 아래 작은 글씨 */
  function timelineOf(pEl, text) {
    var items = text.replace(/^순서\s*[:：]\s*/, '').split(/\s*(?:→|->)\s*/).filter(Boolean);
    if (items.length < 2) return;
    var h = '';
    items.forEach(function (it, i) {
      var m = /^(.*?)\s*\(([^)]*)\)\s*$/.exec(it);
      var name = m ? m[1] : it, sub = m ? m[2] : '';
      var on = /가장 먼저/.test(sub) || (!m && i === 0);
      h += '<span class="sl-tl-it' + (on ? ' on' : '') + '"><b>' + esc(name) + '</b>' + (sub ? '<i>' + esc(sub) + '</i>' : '<i>&nbsp;</i>') + '</span>';
    });
    pEl.className += ' sl-tl';
    pEl.innerHTML = h;
  }

  /* 샘플 액자 — 작은 그림을 한 줄로, 누르면 크게 보고 ‹ › 로 넘깁니다 */
  function galleryOf(pEl) {
    var imgs = [].slice.call(pEl.querySelectorAll('img'));
    var srcs = imgs.map(function (im) { return im.getAttribute('src'); });
    pEl.classList.add('sl-gal');
    imgs.forEach(function (im, i) {
      im.setAttribute('loading', 'lazy');
      im.addEventListener('click', function () { openLb(srcs, i); });
    });
  }

  var lb = null, lbList = [], lbAt = 0;
  function openLb(list, i) {
    lbList = list; lbAt = i;
    if (!lb) {
      lb = document.createElement('div');
      lb.className = 'sl-lb';
      lb.innerHTML = '<button type="button" class="x" aria-label="닫기">✕</button>' +
        '<button type="button" class="nav prev" aria-label="이전">‹</button><img alt="">' +
        '<button type="button" class="nav next" aria-label="다음">›</button><span class="no"></span>';
      document.body.appendChild(lb);
      lb.addEventListener('click', function (e) {
        if (e.target.closest('.prev')) { stepLb(-1); return; }
        if (e.target.closest('.next')) { stepLb(1); return; }
        if (e.target.closest('img')) { stepLb(1); return; }
        lb.classList.remove('on'); document.body.style.overflow = '';
      });
      document.addEventListener('keydown', function (e) {
        if (!lb.classList.contains('on')) return;
        if (e.key === 'Escape') { lb.classList.remove('on'); document.body.style.overflow = ''; }
        if (e.key === 'ArrowLeft') stepLb(-1);
        if (e.key === 'ArrowRight') stepLb(1);
      });
      /* 손가락으로 옆으로 밀어 넘기기 */
      var x0 = 0, moved = false;
      lb.addEventListener('touchstart', function (e) { if (e.touches.length === 1) { x0 = e.touches[0].clientX; moved = false; } }, { passive: true });
      lb.addEventListener('touchmove', function (e) {
        if (e.touches.length !== 1 || moved) return;
        var dx = e.touches[0].clientX - x0;
        if (Math.abs(dx) > 45) { moved = true; stepLb(dx < 0 ? 1 : -1); }
      }, { passive: true });
    }
    showLb();
    lb.classList.add('on'); document.body.style.overflow = 'hidden';
  }
  function stepLb(d) { lbAt = (lbAt + d + lbList.length) % lbList.length; showLb(); }
  function showLb() {
    lb.querySelector('img').src = lbList[lbAt];
    lb.querySelector('.no').textContent = (lbAt + 1) + ' / ' + lbList.length;
  }

  /* 열쇠(짧은 영문 이름) → 글 제목 조각. parts/faq/posts.py 의 TITLES 와 같은 제목을 씁니다 */
  var KEYS = {
    'about': '어떤 곳인가요', 'join': '회원가입은 어떻게', 'must-join': '꼭 해야 구매', 'find-id': '잊어버렸어요',
    'login-fail': '로그인이 안 돼요', 'student': '학생도 구매', 'mobile': '휴대폰에서도', 'hours': '답변 시간',
    'find-book': '어디서 찾나요', 'search': '검색은 어떻게', 'sample': '샘플을 볼 수', 'sample-same': '샘플과 실제',
    'name': '상품 이름 읽는 법', 'soon': '예정', 'range': '전범위 패키지와 강별', 'sl-test': 'SL강',
    'lineup': '어떤 유형으로 구성', 'basic': '유형편에는 어떤', 'advanced': '심화편은 유형편과', 'summary': '핵심요약노트는',
    'boost': '직전보강은', 'analysis': '지문분석은', 'workbook': '워크북은', 'books': '어떤 교재의',
    'mock-when': '언제 올라오나요', 'missing': '빠진 강', 'answers': '정답·해설', 'level': '난이도',
    'pkg-in': '무엇이 들어', 'pkg-why': '왜 패키지에 없나요', 'pkg-off': '얼마나 할인', 'coupon-dup': '중복 적용',
    'pkg-before': '개별로 다 샀다면', 'coupon': '쿠폰은 어디서', 'points': '적립금은',
    'buy': '구매는 어떻게', 'cart': '한 번에 결제', 'pay-method': '결제 수단', 'pay-fail': '결제가 안 돼요',
    'orders': '주문·결제 내역', 'receipt': '세금계산서', 'double': '두 번 결제', 'solvook': '쏠북으로 가나요', 'solvook-dl': '쏠북에서 산',
    'download': '어디서 다운로드', 'zip': '압축 풀기', 'dl-fail': '다운로드 버튼이', 'dl-limit': '횟수 제한',
    'redl': '다시 받을 수', 'phone-file': '받은 파일은 어디', 'pdf-open': 'PDF가 안 열려요', 'password': '비밀번호가 걸려',
    'hwp-font': '글자가 깨져요', 'hwp-open': 'HWP 파일이 안 열려요', 'pdf-vs-hwp': '무엇을 사야', 'pdf-to-hwp': 'HWP로 바꾸고',
    'print': '인쇄는 어떻게', 'devices': '여러 기기', 'online-only': '온라인 전용',
    'refund': '환불·교환', 'wrong-buy': '잘못 구매', 'copy': '복사·배포', 'rebrand': '학원 이름을', 'copyright': '저작권 안내', 'share-class': '나눠 주거나',
    'error': '오타·오류', 'fixed': '수정되면', 'contact': '기타 문의', 'notice': '공지·업데이트', 'review': '구매 후기'
  };
  /* 열쇠로 그 글을 찾아 펼치고 거기로 내려갑니다 (관련 질문 링크 · 주소의 #fq=) */
  function openByKey(key) {
    var frag = KEYS[key] || key;
    var items = document.querySelectorAll('.sl-fq');
    for (var i = 0; i < items.length; i++) {
      var t = items[i].querySelector('.t');
      if (t && t.textContent.indexOf(frag) >= 0) {
        var all = document.querySelector('.sl-cats button[data-cat=""]');
        if (all && !all.classList.contains('on')) all.click();
        if (!items[i].classList.contains('open')) { items[i].classList.add('open'); if (typeof loadAnswer === 'function') loadAnswer(items[i]); }
        var y = items[i].getBoundingClientRect().top + window.scrollY - 300;
        window.scrollTo({ top: y, behavior: 'smooth' });
        return true;
      }
    }
    return false;
  }
  /* @@answer-end */

  /* 펼칠 때 그 글을 받아 답만 꺼내 옵니다 (누를 때 한 번만) */
  function loadAnswer(item) {
    var box = item.querySelector('.a');
    var u = item.getAttribute('data-u');
    if (!u || item.dataset.got === '1') return;
    item.dataset.got = '1';
    fetch(u, { credentials: 'same-origin' })
      .then(function (r) { return r.text(); })
      .then(function (h) {
        var doc = new DOMParser().parseFromString(h, 'text/html');
        /* 글 보기 화면에는 제목·글쓴이·조회수가 함께 들어 있습니다.
           펼침에서는 **답 본문만** 보여야 하므로 본문 칸을 좁혀 찾고,
           못 찾으면 글머리(제목·글쓴이 줄)를 떼어 냅니다. */
        var body = doc.querySelector('.board_text, .view_text, .fr-view, ._article_body');
        if (!body) {
          body = doc.querySelector('.board_view, .view_wrap, .post_view');
          if (body) {
            body = body.cloneNode(true);
            var junk = body.querySelectorAll(
              '.view_header, .board_header, .post_header, .tit_wrap, .info, .author, .time, ' +
              '.views, .sticker, .btn_wrap, .comment, ._comment_wrap, .board_btn, h1, h2, h3');
            for (var z = 0; z < junk.length; z++) junk[z].parentNode.removeChild(junk[z]);
          }
        }
        var html = body ? body.innerHTML.trim() : '';
        box.innerHTML = html || '<span class="wait">글을 열어 확인해 주세요.</span>';
        dressAnswer(box);
      })
      .catch(function () {
        box.innerHTML = '<span class="wait">답변을 불러오지 못했습니다.</span>';
      });
  }

  var built = 0;
  function build() {
    var board = document.querySelector('.widget.board');
    if (!board) return;
    /* 이미 세워 둔 우리 목록이 화면에 붙어 있으면 아무것도 하지 않습니다 */
    var mine = document.querySelector('.sl-bd');
    if (mine && mine.isConnected) return;
    if (board.dataset.slBd === '1' && mine) return;
    if (++built > 5) return;          /* 어떤 일이 있어도 다섯 번을 넘기지 않습니다 */
    var rows = readRows(board);
    if (!rows.length) return;

    /* ── 자주 묻는 질문은 쪽을 다 합칩니다 (2026-08-26) ──
       아임웹 게시판은 한 쪽에 10개만 보여 줍니다. 70편이 일곱 쪽에 흩어지면 갈래 단추가 소용없으므로
       2쪽부터 마지막 쪽까지 차례로 읽어 한 목록으로 만듭니다 (쪽마다 한 번, 순서대로). */
    /* 쪽을 합치는 중이면(아임웹이 목록을 다시 그려 build 가 또 불려도) 기다립니다 — 두 번 그리지 않게 */
    if (cfg.how === 'fold' && board.dataset.slMerged === 'pending') return;
    if (cfg.how === 'fold' && !board.dataset.slMerged) {
      var pageLinks = board.querySelectorAll('a[href*="page="]');
      var last = 1, tmpl = '';
      for (var pl = 0; pl < pageLinks.length; pl++) {
        var pm = /[?&]page=(\d+)/.exec(pageLinks[pl].getAttribute('href') || '');
        if (pm) { last = Math.max(last, +pm[1]); tmpl = tmpl || pageLinks[pl].getAttribute('href'); }
      }
      if (last > 1 && last <= 15 && tmpl) {
        board.dataset.slMerged = 'pending';
        var urls = [];
        for (var pg = 2; pg <= last; pg++) urls.push(tmpl.replace(/([?&]page=)\d+/, '$1' + pg));
        var extra = [];
        (function next(i) {
          if (i >= urls.length) { board.dataset.slMerged = 'done'; render(board, rows.concat(extra)); return; }
          fetch(urls[i], { credentials: 'same-origin' })
            .then(function (r) { return r.text(); })
            .then(function (h) {
              var doc = new DOMParser().parseFromString(h, 'text/html');
              var b2 = doc.querySelector('.widget.board');
              if (b2) extra = extra.concat(readRows(b2));
            })
            .catch(function () {})
            .then(function () { next(i + 1); });
        })(0);
        return;
      }
    }
    render(board, rows);
  }

  function render(board, rows) {
    var pins = 0;
    for (var p = 0; p < rows.length; p++) if (rows[p].pin) pins++;
    pinUseful = pins <= rows.length / 2;
    board.dataset.slBd = '1';

    /* 글 개수 — 아임웹이 게시판 위에 「자주하는 질문 (FAQ) 20」 처럼 적어 둡니다.
       게시판 안쪽 글에서 숫자를 주우면 날짜(2026)를 개수로 잘못 읽으므로
       **게시판 바깥의 제목 줄**에서만 찾습니다. 못 찾으면 개수를 안 보여 줍니다. */
    var total = 0;
    var tt = document.querySelector('.shop-title, .board_title, ._board_title');
    if (tt) {
      var mm = /(\d{1,5})\s*$/.exec((tt.textContent || '').trim());
      if (mm) total = parseInt(mm[1], 10);
    }

    var box = document.createElement('div');
    box.className = 'sl-bd ' + (cfg.how === 'fold' ? 'sl-bd-fold' : 'sl-bd-line');
    box.innerHTML =
      '<div class="sl-bdtop"><div class="sl-bdtt"><h2>' + esc(cfg.name) + '</h2>' +
      (total ? '<span class="sl-bdcnt">' + total + '개</span>' : '') + '</div></div>' +
      (cfg.how === 'fold' ? foldHTML(rows) : lineHTML(rows));

    /* 아임웹 검색칸이 있으면 우리 머리줄로 옮겨 담습니다 (기능은 그대로) */
    var search = board.querySelector('.board_search, ._search_wrap, .search_wrap');
    if (search) box.querySelector('.sl-bdtop').appendChild(search);

    board.parentNode.insertBefore(box, board);
    board.classList.add('sl-bd-wrap');

    /* 원래 목록은 감추고, 쪽 넘김만 남깁니다 (쪽을 다 합친 자주 묻는 질문은 쪽 넘김도 감춥니다) */
    var hide = board.querySelectorAll('.li_board, .list, table, .li_header' +
      (board.dataset.slMerged ? ', .pagination, .paging, ._paging, .board_paging, .page_navi' : ''));
    for (var i = 0; i < hide.length; i++) hide[i].style.display = 'none';

    if (cfg.how === 'fold') {
      /* 주소에 #fq=열쇠 가 붙어 있으면 그 글을 바로 펼칩니다 (관련 질문 링크 · 다른 페이지에서 오는 링크) */
      if (/^#fq=/.test(location.hash)) {
        setTimeout(function () { openByKey(decodeURIComponent(location.hash.slice(4))); }, 300);
      }
      box.addEventListener('click', function (e) {
        var b = e.target.closest('.sl-cats button');
        if (!b) return;
        var cat = b.getAttribute('data-cat') || '';
        box.querySelectorAll('.sl-cats button').forEach(function (x) { x.classList.toggle('on', x === b); });
        var shown = 0;
        box.querySelectorAll('.sl-fq').forEach(function (q) {
          var ok = !cat || q.getAttribute('data-cat') === cat;
          q.style.display = ok ? '' : 'none';
          if (ok) shown++;
        });
        var none = box.querySelector('.sl-fq-none');
        if (none) none.style.display = shown ? 'none' : 'block';
      });
      box.addEventListener('click', function (e) {
        var q = e.target.closest('.q');
        if (!q) return;
        var item = q.parentElement;
        item.classList.toggle('open');
        if (item.classList.contains('open')) loadAnswer(item);
      });
    }
  }

  /* ── 글을 누르면 확실히 열리도록 ──
     아임웹 게시판 위젯은 목록을 **나중에 다시 그립니다.** 그때 우리 목록도 새로 만들어지는데,
     손님이 마침 그 순간에 누르시면 누른 글줄이 사라져 **클릭이 그냥 없던 일이 됩니다.**
     («여러 번 눌러야 들어가진다», «글이 잠깐 보였다 사라진다» 가 이것입니다.)
     그래서 글줄 하나하나가 아니라 **문서 전체**에 한 번만 귀를 달아 두고,
     눌린 자리가 우리 글줄이면 그 주소로 옮겨 갑니다.
     요소가 새로 그려져도 이 귀는 그대로라 언제 누르셔도 열립니다. */
  document.addEventListener('click', function (e) {
    var row = e.target.closest && e.target.closest('.sl-bd .sl-row');
    if (!row) return;
    /* 새 창으로 열도록 누르신 경우(Ctrl·⌘·가운데 단추)는 브라우저에 맡깁니다 */
    var href = row.getAttribute('href');
    if ((e.metaKey || e.ctrlKey || e.button === 1) && href && href !== '#') {
      e.preventDefault(); window.open(href, '_blank'); return;
    }
    var idx = parseInt(row.getAttribute('data-i'), 10);
    var orig = (idx >= 0 && ORIG[idx]) ? ORIG[idx] : null;
    if (orig && orig.isConnected) {
      /* 원본을 대신 누릅니다 — 비밀글이면 아임웹이 비밀번호를 묻습니다 */
      e.preventDefault();
      orig.click();
      return;
    }
    if (!href || href === '#') return;
    e.preventDefault();
    location.href = href;
  }, true);

  build();
  window.addEventListener('load', build);
  setTimeout(build, 400);
  setTimeout(build, 1500);
  setTimeout(build, 3000);
  /* ⚠ 예전에 여기서 MutationObserver 로 「아임웹이 목록을 다시 그리면 우리도 다시 세우기」를
     했는데, **우리가 넣은 것을 스스로 다시 감지해** 끝없이 다시 세우는 고리가 되었습니다.
     화면이 멈추고, 목록이 생겼다 사라지기를 되풀이해 눌러도 안 열렸습니다.
     감시는 걷어내고, 아래 몇 번의 시도만 남깁니다. */
})();
