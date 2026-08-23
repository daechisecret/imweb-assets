/* ── 검색엔진에게 ──
   검색 결과 화면은 검색어마다 주소가 달라 **같은 내용의 페이지가 수천 개**로 보입니다.
   색인하지 말라고 알리고(noindex), 비어 있던 제목도 채웁니다. */
(function () {
  if (location.pathname.replace(/\/$/, '') !== '/search') return;
  if (!document.querySelector('meta[name="robots"]')) {
    var m = document.createElement('meta');
    m.name = 'robots'; m.content = 'noindex, follow';
    document.head.appendChild(m);
  }
  var q = new URLSearchParams(location.search).get('keyword') || new URLSearchParams(location.search).get('q') || '';
  document.title = (q ? '「' + q + '」 검색 결과 | ' : '자료 검색 | ') + '대치동시크릿';
})();

/* ═══════════════════════════════════════════════════════════════
   대치동시크릿 검색 결과 화면  (/search)  — 짝꿍 : themes/search.css

   왜 새로 그리는가
     아임웹 검색은 495개를 25쪽에 20개씩 나눠 보여 줍니다.
     그래서 교재·유형으로 좁히는 단추를 붙여도 **눈앞의 20개**만 걸러집니다.
     여기서는 상품 전체 색인(search-data.json, 압축 31KB)을 한 번 받아
     찾기·좁히기·줄세우기를 브라우저에서 합니다. 쪽 넘김이 사라집니다.

   아임웹 것을 얼마나 건드리나
     위쪽 검색칸과 「쇼핑·게시판·지도·갤러리」 탭은 **그대로 둡니다** (아임웹 기능).
     아래 결과 목록과 「495개 · 정확도순」 줄만 감추고 그 자리에 우리 것을 놓습니다.
     쇼핑 말고 다른 탭을 보고 있을 때는 아무것도 하지 않습니다.
   ═══════════════════════════════════════════════════════════════ */
(function () {
  if (location.pathname.replace(/\/$/, '') !== '/search') return;

  var DATA_URL = 'https://daechisecret.github.io/imweb-assets/search-data.json';
  var DATA = null;
  var STEP = 24;                       /* 한 번에 보여 줄 개수 */
  var show = STEP;
  var sort = 'new';                    /* 처음에는 최신순 */
  var picked = { b: [], k: [] };       /* 골라 놓은 교재·유형 (여러 개 됩니다) */
  var openSide = false;                /* 좁은 화면에서 서랍을 폈는지 */
  var mount = null;

  /* ── 검색어 ──
     주소의 keyword 를 씁니다. 아임웹이 검색칸에 넣어 둔 값도 함께 봅니다. */
  function keyword() {
    var m = /[?&]keyword=([^&]*)/.exec(location.search);
    var k = m ? decodeURIComponent(m[1].replace(/\+/g, ' ')) : '';
    if (!k) {
      var box = document.querySelector('.search_widget .control_box input[type="text"], ' +
                                       '.search_widget .control_box input[name="keyword"]');
      if (box) k = box.value || '';
    }
    return k.trim();
  }

  /* ── 지금 어느 탭인가 ──
     아임웹은 탭을 누르면 숨은 칸(input._type)에 값을 넣고 페이지를 다시 엽니다.
       (없음)·shopping = 쇼핑,  post = 게시판,  map = 지도,  gallery = 갤러리
     주소에도 type= 로 남으니 둘 다 봅니다. */
  function tabNow() {
    var m = /[?&]type=(\w+)/.exec(location.search);
    var v = m ? m[1] : '';
    if (!v) {
      var box = document.querySelector('.search_widget input._type');
      v = box ? (box.value || '') : '';
    }
    return v || 'shopping';
  }

  /* 「지도」와 「갤러리」는 쓰지 않는 탭입니다.
     눌러 봐야 꾸미지 않은 화면이 나오고 자료도 없어서 감춥니다.
     (아임웹 관리자에서 끄는 설정이 없어 여기서 가립니다.) */
  function trimTabs() {
    var lis = document.querySelectorAll('.search_widget .site_nav li');
    for (var i = 0; i < lis.length; i++) {
      var t = (lis[i].textContent || '').replace(/\s+/g, '');
      if (t === '지도' || t === '갤러리') lis[i].classList.add('sl-hide');
    }
  }

  function esc(s) {
    return String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;')
      .replace(/>/g, '&gt;').replace(/"/g, '&quot;');
  }
  function won(n) { return (n || 0).toLocaleString('ko-KR') + '원'; }
  function flat(s) { return String(s).replace(/\s+/g, ''); }

  /* ── 검색어에 걸리는 상품 ──
     띄어쓰기로 나눈 낱말이 **모두** 들어 있어야 합니다.
       「수능특강 워크북」 → 수능특강 도 워크북 도 있는 것
     상품 이름뿐 아니라 교재·유형 이름으로도 걸립니다 (「지문분석」 만 쳐도 나옵니다). */
  function matched() {
    var words = keyword().split(/\s+/).filter(Boolean).map(flat);
    if (!words.length) return DATA.items.slice();
    return DATA.items.filter(function (it) {
      var hay = flat(it.n + it.b + it.k);
      for (var i = 0; i < words.length; i++) if (hay.indexOf(words[i]) < 0) return false;
      return true;
    });
  }

  function narrowed() {
    return matched().filter(function (it) {
      if (picked.b.length && picked.b.indexOf(it.b) < 0) return false;
      if (picked.k.length && picked.k.indexOf(it.k) < 0) return false;
      return true;
    });
  }

  /* 색인은 이미 최신순(연도 → 상품번호)으로 줄 세워져 있습니다.
     가격순일 때만 다시 세웁니다. */
  function ordered(list) {
    if (sort === 'low') return list.slice().sort(function (a, b) { return a.p - b.p; });
    if (sort === 'high') return list.slice().sort(function (a, b) { return b.p - a.p; });
    return list;
  }

  function counts(list, key) {
    var c = {};
    list.forEach(function (it) { if (it[key]) c[it[key]] = (c[it[key]] || 0) + 1; });
    return c;
  }

  /* ── 왼쪽 서랍 ──
     개수는 **다른 칸을 고른 상태**를 반영해 셉니다.
     (유형에서 「워크북」을 골라 두면 교재 옆 숫자도 워크북 기준으로 바뀝니다.
      그래야 눌렀는데 0개가 나오는 일이 없습니다.) */
  function side() {
    var m = matched();
    var forB = m.filter(function (it) { return !picked.k.length || picked.k.indexOf(it.k) >= 0; });
    var forK = m.filter(function (it) { return !picked.b.length || picked.b.indexOf(it.b) >= 0; });
    var cb = counts(forB, 'b'), ck = counts(forK, 'k');

    var h = '<div class="sq-side' + (openSide ? ' open' : '') + '">';

    h += '<div class="sq-grp"><b>교재' +
         (picked.b.length ? '<button class="sq-clr" data-clr="b">모두 해제</button>' : '') + '</b>';
    var anyBook = false;
    DATA.groups.forEach(function (g) {
      var have = g.books.filter(function (bk) { return cb[bk] || picked.b.indexOf(bk) >= 0; });
      if (!have.length) return;
      anyBook = true;
      h += '<div class="sq-sub">' + esc(g.g) + '</div>';
      have.forEach(function (bk) {
        h += '<div class="sq-chk' + (picked.b.indexOf(bk) >= 0 ? ' on' : '') +
             '" data-t="b" data-v="' + esc(bk) + '"><i class="bx"></i><span>' + esc(bk) +
             '</span><i class="sq-num">' + (cb[bk] || 0) + '</i></div>';
      });
    });
    if (!anyBook) h += '<div class="sq-sub">해당 없음</div>';
    h += '</div>';

    h += '<div class="sq-grp"><b>자료 유형' +
         (picked.k.length ? '<button class="sq-clr" data-clr="k">모두 해제</button>' : '') + '</b>';
    var anyKind = false;
    DATA.kinds.forEach(function (k) {
      if (!ck[k] && picked.k.indexOf(k) < 0) return;
      anyKind = true;
      h += '<div class="sq-chk' + (picked.k.indexOf(k) >= 0 ? ' on' : '') +
           '" data-t="k" data-v="' + esc(k) + '"><i class="bx"></i><span>' + esc(k) +
           '</span><i class="sq-num">' + (ck[k] || 0) + '</i></div>';
    });
    if (!anyKind) h += '<div class="sq-sub">해당 없음</div>';
    h += '</div></div>';
    return h;
  }

  function card(it) {
    return '<a class="sq-card" href="' + esc(it.u) + '">' +
      '<img src="' + esc(DATA.imgpre + it.i) + '" loading="lazy" alt="">' +
      '<div class="sq-body"><div class="sq-tags">' +
      (it.b ? '<span class="sq-tag b">' + esc(it.b) + '</span>' : '') +
      (it.k ? '<span class="sq-tag k">' + esc(it.k) + '</span>' : '') + '</div>' +
      '<div class="sq-tit">' + esc(it.n) + '</div>' +
      '<div class="sq-pr">' + won(it.p) + '</div></div></a>';
  }

  function draw() {
    var list = ordered(narrowed());
    var q = keyword();
    var chosen = picked.b.length + picked.k.length;

    var h = '<div class="sq-head"><div class="sq-h1">' +
      (q ? '<em>' + esc(q) + '</em> 검색 결과' : '전체 자료') +
      '<span>' + list.length + '개</span></div><div class="sq-sort">' +
      '<button class="' + (sort === 'new' ? 'on' : '') + '" data-s="new">최신순</button>' +
      '<button class="' + (sort === 'low' ? 'on' : '') + '" data-s="low">낮은 가격순</button>' +
      '<button class="' + (sort === 'high' ? 'on' : '') + '" data-s="high">높은 가격순</button>' +
      '</div></div>';

    h += '<button class="sq-open' + (openSide ? ' on' : '') + '" data-open="1">좁혀 보기' +
         (chosen ? '<u>' + chosen + '</u>' : '') + '</button>';

    h += '<div class="sq-two">' + side() + '<div>';
    if (list.length) {
      h += '<div class="sq-grid">' + list.slice(0, show).map(card).join('') + '</div>';
      if (list.length > show) {
        h += '<button class="sq-more" data-more="1">' +
             Math.min(STEP, list.length - show) + '개 더 보기 (남은 ' + (list.length - show) + '개)</button>';
      }
    } else {
      h += '<div class="sq-empty"><b>찾으시는 자료가 없습니다</b>' +
           (chosen ? '골라 두신 조건을 풀어 보세요.' : '다른 낱말로 찾아 보세요.') + '</div>';
    }
    h += '</div></div>';
    mount.innerHTML = h;
  }

  /* ── 누를 때 ── */
  function wire() {
    mount.addEventListener('click', function (e) {
      var c = e.target.closest('[data-t]');
      if (c) {
        var t = c.dataset.t, v = c.dataset.v, at = picked[t].indexOf(v);
        if (at >= 0) picked[t].splice(at, 1); else picked[t].push(v);
        show = STEP; draw(); return;
      }
      var clr = e.target.closest('[data-clr]');
      if (clr) { picked[clr.dataset.clr] = []; show = STEP; draw(); return; }
      var s = e.target.closest('[data-s]');
      if (s) { sort = s.dataset.s; show = STEP; draw(); return; }
      var m = e.target.closest('[data-more]');
      if (m) { show += STEP; draw(); return; }
      var o = e.target.closest('[data-open]');
      if (o) { openSide = !openSide; draw(); return; }
    });
  }

  function place() {
    if (mount && document.body.contains(mount)) return true;
    var w = document.querySelector('.search_widget');
    if (!w) return false;
    var after = w.querySelector('.categorize') || w.querySelector('.view_box');
    if (!after) return false;
    mount = document.createElement('div');
    mount.className = 'sq';
    after.parentNode.insertBefore(mount, after.nextSibling);
    document.body.classList.add('sl-sc');
    wire();
    return true;
  }

  function run() {
    if (!document.querySelector('.search_widget')) return;
    /* 겉옷(검색칸·탭·쪽넘김) 꾸미기는 어느 탭에서나 켭니다 */
    document.body.classList.add('sl-sc');
    trimTabs();

    var tab = tabNow();
    if (tab === 'post') {
      /* 게시판 탭은 아임웹 검색 결과를 그대로 두고 모양만 바꿉니다.
         (글 내용까지 담은 색인은 만들지 않았습니다 — 비밀글도 있어서요.) */
      document.body.classList.add('sl-sc-post');
      document.body.classList.remove('sl-sc-shop');
      if (mount) mount.innerHTML = '';
      return;
    }
    document.body.classList.remove('sl-sc-post');
    /* 지도·갤러리는 감춰 둔 탭입니다 — 혹시 들어오더라도 손대지 않습니다.
       나머지(shopping, 값 없음)는 모두 쇼핑으로 봅니다. */
    if (tab === 'map' || tab === 'gallery') return;

    if (!place()) return;
    document.body.classList.add('sl-sc-shop');
    if (!DATA) return;
    draw();
  }

  fetch(DATA_URL)
    .then(function (r) { if (!r.ok) throw new Error(r.status); return r.json(); })
    .then(function (d) { DATA = d; run(); })
    .catch(function () {
      /* 색인을 못 받아 오면 아임웹 본래 결과를 그대로 보여 줍니다.
         겉옷(검색칸·탭)은 그대로 두고, 결과를 가리는 것만 풉니다. */
      document.body.classList.remove('sl-sc-shop');
      if (mount && mount.parentNode) mount.parentNode.removeChild(mount);
    });

  run();
  window.addEventListener('load', run);
  setTimeout(run, 500);
  setTimeout(run, 1600);
  setTimeout(run, 3200);
})();
