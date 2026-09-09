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
  function flat(s) { return String(s).replace(/\s+/g, '').toLowerCase(); }

  /* ── 같은 뜻인 말 ──
     손님은 교재 정식 이름을 모릅니다. 줄여 쓰거나(수특), 브랜드로 부르거나(EBS),
     예전 이름으로 부릅니다(단기특강). 오타도 냅니다.
     왼쪽을 치면 오른쪽 말들 중 **아무거나 하나라도** 걸리면 나오게 합니다.

     ※ 여기를 고치면 imweb-store.html 의 같은 표도 함께 고쳐야 합니다. */
  var ALIAS = [
    /* EBS 부교재 8종 — 상품 이름에 「EBS」 라는 글자가 아예 없어서 0건이 나왔다 */
    { in: ['ebs', 'ens', '이비에스', 'ebs부교재', '부교재'],
      out: ['수능특강', '올림포스'] },
    /* 특강 — 상품에는 「어법어휘 특강」(교재)·「특강자료」(유형) 로 들어 있다.
       ※ 「특강」 만으로 바꾸면 「수능특강」 625개가 딸려 오므로 반드시 긴 말로 짚는다 */
    { in: ['단기특강', '딘기특강', '방학특강', '수능대비', '특강자료'],
      out: ['특강자료', '어법어휘특강'] },
    /* 줄여 부르는 말 */
    { in: ['수특'], out: ['수능특강'] },
    { in: ['수특라이트', '수능특강라이트', '라이트'], out: ['수능특강라이트'] },
    { in: ['영독', '독해연습', '영어독해연습'], out: ['영어독해연습'] },
    { in: ['올포', '올림포스'], out: ['올림포스'] },
    { in: ['모평', '모의', '모의고사'], out: ['모의고사'] },
    /* 자료 유형을 다르게 부르는 말 */
    { in: ['분석노트', '지문분석노트', '시크릿분석노트', '해석'], out: ['지문분석'] },
    { in: ['요약노트', '핵심요약노트', '요약'], out: ['핵심요약'] },
    { in: ['보강', '직전', '파이널', '실전'], out: ['직전보강'] },
    { in: ['변형', '변형문제'], out: ['변형문제'] },
    { in: ['심화', '심화변형'], out: ['심화'] },
    { in: ['유형', '유형편'], out: ['유형편'] },
    { in: ['한글', '한글파일', 'hwp', '한컴'], out: ['한글파일'] },
    { in: ['전범위', '올인원', '통합'], out: ['패키지'] }
  ];

  /* 낱말 하나 → 그 낱말로 인정할 후보들 (자기 자신 포함) */
  function synonyms(w) {
    var outs = [w];
    for (var i = 0; i < ALIAS.length; i++) {
      for (var j = 0; j < ALIAS[i].in.length; j++) {
        if (flat(ALIAS[i].in[j]) === w) {
          for (var k = 0; k < ALIAS[i].out.length; k++) {
            var o = flat(ALIAS[i].out[k]);
            if (outs.indexOf(o) < 0) outs.push(o);
          }
        }
      }
    }
    return outs;
  }

  /* 한 낱말이 걸리는가 — 같은 뜻인 말 중 하나라도 들어 있으면 걸린 것 */
  function hasWord(hay, w) {
    var cands = synonyms(w);
    for (var i = 0; i < cands.length; i++) if (hay.indexOf(cands[i]) >= 0) return true;
    return false;
  }

  /* ── 검색어에 걸리는 상품 ──
     띄어쓰기로 나눈 낱말이 **모두** 들어 있어야 합니다.
       「수능특강 워크북」 → 수능특강 도 워크북 도 있는 것
     상품 이름뿐 아니라 교재·유형 이름으로도 걸립니다 (「지문분석」 만 쳐도 나옵니다).

     세 가지를 거칩니다.
       1) 붙여 쓴 낱말 쪼개기 — 「시크릿분석노트」 처럼 붙여 친 말을
          자료에 실제로 있는 조각으로 다시 나눕니다.
          (예전에는 붙여 쓰면 0건: 「시크릿 분석노트」 21개 / 「시크릿분석노트」 0개)
       2) **아예 없는 낱말은 버립니다** — 우리가 안 파는 말이 섞여도 나머지로 찾아 줍니다.
          「고등1 국어 지학사」 → 「국어」 는 우리에게 없으니 버리고
          「고등」·「1」·「지학사」 로 찾아 지학사 자료를 보여 줍니다.
       3) 남은 낱말은 **모두** 들어 있어야 합니다. 하나라도 걸리면 되는 식으로 하면
          엉뚱한 자료가 딸려 옵니다.
     버릴 낱말밖에 없으면 정말 없는 것이므로 빈손으로 돌려줍니다. */
  function matched() {
    var words = keyword().split(/\s+/).filter(Boolean).map(flat).filter(Boolean);
    if (!words.length) return DATA.items.slice();

    var items = DATA.items;
    var hays = [];
    for (var i = 0; i < items.length; i++) hays.push(flat(items[i].n + items[i].b + items[i].k));
    var all = hays.join('|');

    /* 그 낱말이 자료 어딘가에 있기는 한가 (같은 뜻인 말까지 쳐서) */
    function alive(w) {
      var c = synonyms(w);
      for (var j = 0; j < c.length; j++) if (all.indexOf(c[j]) >= 0) return true;
      return false;
    }

    /* 1) 붙여 쓴 낱말 쪼개기 — 자료에 실제로 있는 조각으로만 나눕니다 */
    var parts = [];
    for (var w = 0; w < words.length; w++) {
      var word = words[w];
      if (word.length <= 3 || alive(word)) { parts.push(word); continue; }
      var got = [], rest = word, guard = 0;
      while (rest && guard++ < 12) {
        var took = 0;
        for (var len = rest.length; len >= 2; len--) {
          if (all.indexOf(rest.slice(0, len)) >= 0) { got.push(rest.slice(0, len)); took = len; break; }
        }
        if (!took) { got = []; break; }
        rest = rest.slice(took);
      }
      if (got.length) { for (var g = 0; g < got.length; g++) parts.push(got[g]); }
      else parts.push(word);
    }

    /* 2) 아예 없는 낱말은 버립니다 */
    var live = [];
    for (i = 0; i < parts.length; i++) if (alive(parts[i])) live.push(parts[i]);
    if (!live.length) return [];

    /* 3) 남은 낱말이 모두 들어 있는 것 */
    var out = [];
    for (i = 0; i < items.length; i++) {
      var ok = true;
      for (w = 0; w < live.length; w++) if (!hasWord(hays[i], live[w])) { ok = false; break; }
      if (ok) out.push(items[i]);
    }
    return out;
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
    /* 값이 없는 교과서(p=0)는 가격순에서 **맨 뒤**로 보냅니다 — 0원이 아니라 쏠북 판매이기 때문입니다 */
    function pv(x, big) { return x.p ? x.p : (big ? -1 : Infinity); }
    if (sort === 'low') return list.slice().sort(function (a, b) { return pv(a) - pv(b); });
    if (sort === 'high') return list.slice().sort(function (a, b) { return pv(b, 1) - pv(a, 1); });
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
      /* 값이 없는 자료 = 교과서. 우리 사이트에서는 팔지 않고 쏠북에서 사는 자료입니다.
         「가격없음원」 처럼 찍히지 않게 안내문으로 바꿉니다. */
      (it.p ? '<div class="sq-pr">' + won(it.p) + '</div>'
            : '<div class="sq-pr sq-solv">교과서 자료는 쏠북에서 구매 가능합니다 (본문 참고)</div>') +
      '</div></a>';
  }

  /* ── 검색어 기록 ──
     어떤 교재를 찾는지 알려고, 검색어와 걸린 개수를 시크릿루체 관리자(secretluce.com)로 한 번 보냅니다.
     개인 정보는 없습니다 — 검색어·걸린 개수·화면 너비뿐이고, 같은 검색어는 한 세션에 한 번만 보냅니다.
     보내기가 실패해도 검색 화면은 아무 영향이 없습니다. 관리자 → 검색어 화면에서 봅니다. */
  var LOG_URL = 'https://secretluce.com/api/track/search';
  var logged = false;
  function logSearch(hits) {
    if (logged) return;
    logged = true;
    var q = keyword();
    if (!q || q.length > 80) return;
    try {
      var key = 'sl-sq:' + q;
      if (sessionStorage.getItem(key)) return;
      sessionStorage.setItem(key, '1');
    } catch (e) { /* 저장소가 막혀 있어도 보냅니다 */ }
    var body = JSON.stringify({ keyword: q, hits: hits, w: window.innerWidth, ref: document.referrer || '', src: 'search' });
    try {
      fetch(LOG_URL, { method: 'POST', mode: 'cors', keepalive: true, credentials: 'omit',
        headers: { 'Content-Type': 'text/plain' }, body: body }).catch(function () {});
    } catch (e) { /* 못 보내도 그만입니다 */ }
  }

  function draw() {
    var list = ordered(narrowed());
    var q = keyword();
    logSearch(matched().length);
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
