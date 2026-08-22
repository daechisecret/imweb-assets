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
  function readRows(root) {
    var out = [];

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
      out.push({
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
      var a2 = u.querySelector('a[href*="bmode=view"]') || u.querySelector('a[href*="idx="]');
      out.push({
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
        return '<a class="sl-row' + (pin ? ' pin' : '') + '" href="' + esc(r.u) + '">' +
          '<span class="sl-tt">' + tagOf(r) + '<span class="t">' + esc(r.t) + '</span>' +
          (Number(r.c) ? '<span class="sl-cm">💬 ' + r.c + '</span>' : '') + '</span>' +
          '<span class="sl-w">' + esc(r.w) + '</span>' +
          '<span class="sl-d">' + esc((r.d || '').replace(/^\d{4}-/, '')) + '</span>' +
          '<span class="sl-v">' + esc(r.v) + '</span></a>';
      }).join('');
  }

  function foldHTML(rows) {
    return rows.map(function (r) {
      return '<div class="sl-fq" data-u="' + esc(r.u) + '">' +
        '<div class="q"><span class="mk">Q</span>' + tagOf(r) +
        '<span class="t">' + esc(r.t.replace(/^Q\.\s*/, '')) + '</span>' +
        '<span class="arw">▾</span></div>' +
        '<div class="a"><span class="wait">답변을 불러오는 중입니다…</span></div></div>';
    }).join('');
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
    var href = row.getAttribute('href');
    if (!href || href === '#') return;
    e.preventDefault();
    /* 새 창으로 열도록 누르신 경우(Ctrl·⌘·가운데 단추)는 브라우저에 맡깁니다 */
    if (e.metaKey || e.ctrlKey || e.button === 1) { window.open(href, '_blank'); return; }
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
