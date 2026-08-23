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
  var CATS = ['주문/결제', '제작 일정', '자료 문의', '오류 관련', '다운로드 관련', '할인/쿠폰/적립금', '기타'];
  var CAT_RULES = [
    ['할인/쿠폰/적립금', /할인|쿠폰|적립|포인트|이벤트/],
    ['주문/결제',        /결제|주문|구매|환불|취소|영수증|계산서/],
    ['오류 관련',        /오류|깨져|깨짐|잘못|안 ?보여|보이지 않|열리지|수정 요청/],
    ['다운로드 관련',    /다운|받나요|받아|저장|파일/],
    ['제작 일정',        /일정|언제|업로드|제작|출시|올라오|업데이트/],
    ['자료 문의',        /자료|샘플|구성|유형|교재|학년|PDF|HWP|한글/]
  ];
  function catOf(title) {
    var m = /\[([^\]]{2,14})\]/.exec(title);
    if (m) { for (var i = 0; i < CATS.length; i++) if (CATS[i] === m[1].trim()) return CATS[i]; }
    for (var j = 0; j < CAT_RULES.length; j++) if (CAT_RULES[j][1].test(title)) return CAT_RULES[j][0];
    return '기타';
  }
  function cleanQ(t) {
    return t.replace(/^[\s💌📌📣✨🩷❤️💗]+/, '').replace(/^Q\.\s*/i, '')
            .replace(/^\[([^\]]{2,14})\]\s*/, function (all, c) { return CATS.indexOf(c.trim()) >= 0 ? '' : all; });
  }

  function foldHTML(rows) {
    var counts = {};
    rows.forEach(function (r) { r.cat = catOf(r.t); counts[r.cat] = (counts[r.cat] || 0) + 1; });
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

    /* 원래 목록은 감추고, 쪽 넘김만 남깁니다 */
    var hide = board.querySelectorAll('.li_board, .list, table, .li_header');
    for (var i = 0; i < hide.length; i++) hide[i].style.display = 'none';

    if (cfg.how === 'fold') {
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
