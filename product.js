/* ═══════════════════════════════════════════════════════════════
   대치동시크릿 상품 상세 페이지 — 짝꿍 : themes/product.css

   ① 표지 아래끝을 「장바구니·바로 구매」 단추 아래선에 맞춥니다.
   ② 상세정보 사진을 세 칸 격자로 다시 세우고, 누르면 크게 봅니다.
   ③ 패키지 상품이면 그 안에 든 자료(변형문제·지문분석 …)를 단추로 세우고,
      누르시면 **그 자료의 진짜 샘플**을 불러옵니다.
      (패키지 상품 페이지에는 홍보 배너만 있어 보여 드릴 것이 없습니다.)
      어떤 자료가 든 패키지인지는 build-pkg.py 가 pkg-samples.json 에 적어 둡니다 —
      모의고사 올인원은 네 갈래, 부교재의 갈래별 패키지(핵심요약노트 패키지 …)는 그 갈래 하나만.

   아임웹 것은 지우지 않습니다 — 그림만 감추고 그 자리에 우리 것을 놓습니다.
   ═══════════════════════════════════════════════════════════════ */
(function () {
  var BASE = 'https://daechisecret.github.io/imweb-assets/';
  var PKG = null;                 /* 패키지 → 안에 든 자료 대응표 */
  var PACK = null;                /* 지금 보는 상품이 패키지면 그 항목 */
  var mount = null, lb = null;
  var shots = [], at = 0;

  function root() { return document.getElementById('prod_detail'); }

  /* 상세정보 상자는 **두 개**입니다 — 넓은 화면용과 좁은 화면용.
     (아임웹이 id 를 똑같이 prod_detail_body 로 붙여 두었습니다.)
     getElementById 는 먼저 나오는 **숨어 있는 쪽**을 집어 옵니다.
     거기에 미리보기를 넣으면 상자가 display:none 이라 사진이 통째로 안 보입니다.
     그래서 **지금 화면에 보이는 쪽**을 고릅니다. */
  function body() {
    var all = document.querySelectorAll('[id="prod_detail_body"]');
    for (var i = 0; i < all.length; i++) {
      var e = all[i];
      if (e.getBoundingClientRect().width > 0 && e.offsetParent !== null) return e;
    }
    return all[0] || null;
  }

  function esc(s) {
    return String(s == null ? '' : s).replace(/[&<>"]/g, function (c) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c];
    });
  }

  /* 지금 보고 있는 상품 번호 — 주소가 두 가지입니다 */
  function idxNow() {
    var m = /[?&]idx=(\d+)/.exec(location.search) ||
            /\/shop_view\/(\d+)/.exec(location.pathname);
    return m ? m[1] : '';
  }

  /* 상품 주소를 지금 도메인으로 맞춥니다 (daechisecret.com ↔ www.daechisecret.com) */
  function sameHost(u) {
    try {
      var a = document.createElement('a');
      a.href = u;
      if (a.hostname.replace(/^www\./, '') === location.hostname.replace(/^www\./, '')) {
        return location.origin + a.pathname + a.search;
      }
    } catch (e) { /* 주소가 이상하면 원래 것을 씁니다 */ }
    return u;
  }

  /* ── ① 표지 높이 맞추기 ──
     왼쪽 표지가 오른쪽 구매 단추보다 아래로 내려가면 균형이 깨집니다.
     표지 위끝에서 단추 아래끝까지를 재어 표지의 최대 높이로 삼습니다.
     (단추가 표지보다 아래에 있으면 아무것도 하지 않습니다 — 늘리지는 않습니다.) */
  function fitCover() {
    if (window.innerWidth <= 860) {
      document.documentElement.style.removeProperty('--sl-cover');
      return;
    }
    var cover = document.querySelector('.prod-owl-list');
    /* 구매 단추 줄은 **두 벌**입니다 — 넓은 화면용(.pc)과 좁은 화면용.
       지금 안 보이는 쪽은 높이가 0 이라 그것을 잡으면 셈이 어그러집니다. */
    var btns = null;
    document.querySelectorAll('#prod_goods_form .buy_btns').forEach(function (x) {
      if (!btns && x.getBoundingClientRect().height > 10) btns = x;
    });
    if (!cover || !btns) return;
    var c = cover.getBoundingClientRect(), b = btns.getBoundingClientRect();
    var want = Math.round(b.bottom - c.top);
    if (want < 260) return;                       /* 아직 다 그려지지 않았습니다 */
    if (want >= Math.round(c.height)) {
      document.documentElement.style.removeProperty('--sl-cover');
      return;                                     /* 표지가 이미 더 작습니다 */
    }
    document.documentElement.style.setProperty('--sl-cover', want + 'px');
  }

  /* ── 상세 페이지에서 자료 사진만 골라 옵니다 ──
     페이지에는 손님이 후기에 올려 주신 사진과 로고·안내 그림도 섞여 있습니다.
     아임웹 편집기(Froala)가 넣은 그림에만 class 에 fr- 로 시작하는 이름이 붙습니다. */
  var TAG = /<img\s[^>]*>/gi;
  var SRC = /src="(https:\/\/cdn\.imweb\.me\/upload\/[A-Za-z0-9]+\/[A-Za-z0-9._-]+\.(?:png|jpe?g|gif|webp))"/i;
  var FR = /class="(?:[^"]*\s)?fr-[a-z]/i;

  function pick(html) {
    var seen = {}, out = [], m;
    TAG.lastIndex = 0;
    while ((m = TAG.exec(html))) {
      if (!FR.test(m[0])) continue;
      var g = SRC.exec(m[0]);
      if (!g || seen[g[1]]) continue;
      seen[g[1]] = 1;
      out.push(g[1]);
    }
    return out;
  }

  var CACHE = {};
  function load(idx, done) {
    if (CACHE[idx]) return done(CACHE[idx]);
    /* 상품 주소는 진열 칸마다 달라(/mockexam1-2026-pdf/?idx=1057 …) 알 수 없습니다.
       다행히 아임웹은 /shop_view/번호 로도 같은 상품을 열어 줍니다. */
    fetch(sameHost(location.origin + '/shop_view/' + idx), { credentials: 'same-origin' })
      .then(function (r) { return r.ok ? r.text() : Promise.reject(r.status); })
      .then(function (h) { CACHE[idx] = pick(h); done(CACHE[idx]); })
      .catch(function () { CACHE[idx] = []; done([]); });
  }

  /* ── ② 미리보기 격자 ── */
  function grid(list) {
    if (!list.length) {
      return '<div class="sp-wait">미리보기 사진을 준비 중입니다.</div>';
    }
    return '<div class="sp-grid">' + list.map(function (u, i) {
      return '<img src="' + esc(u) + '" alt="미리보기 ' + (i + 1) + '" loading="lazy" data-i="' + i + '">';
    }).join('') + '</div>';
  }

  /* 패키지 안내 한 줄 — 지금 고른 갈래만 짧게 적습니다.
       「아래는 핵심요약노트 자료의 미리보기 이미지입니다.」
     (사장님 지시 2026-08-26 : "…만 보여 드립니다, 다른 자료는 없습니다" 식으로 길게 쓰지 말 것.)
     어떤 갈래 단추가 서는지는 pkg-samples.json 이 정합니다 —
     모의고사 올인원은 네 갈래, 부교재의 갈래별 패키지는 그 갈래 하나. */
  function fromLine(kinds, cur) {
    if (!kinds || !kinds.length) return '';
    var k = null;
    kinds.forEach(function (x) { if (x.id === cur) k = x; });
    if (!k) return '';
    /* 모의고사 올인원은 구성 안내(pkg-samples.json 의 note)를 먼저 한 줄 —
       「… "변형문제 유형편 · 핵심요약 · 지문분석 · 워크북"으로 구성되어 있습니다.
          직전보강 · 변형문제 심화편은 패키지에 포함되지 않으며 따로 구매 가능합니다.」 */
    var note = PACK && PACK.note ? '<div class="sp-note">' + esc(PACK.note) + '</div>' : '';
    return note + '<div class="sp-from">아래는 <b>' + esc(k.long || k.name) +
           '</b> 자료의 미리보기 이미지입니다.</div>';
  }

  function paint(list, kinds, cur) {
    shots = list;
    var pk = kinds && kinds.length;
    /* 단추가 하나뿐이면 고를 것이 없으니 단추 줄은 안 그립니다 */
    var pills = pk && kinds.length > 1;
    mount.innerHTML =
      '<div class="sp-head"><h3>자료 미리보기</h3>' +
      (list.length ? '<span class="sp-cnt">' + list.length + '장</span>' : '') +
      '<span class="sp-tip">눌러서 크게 보세요!</span></div>' +
      (pills ? '<div class="sp-kinds">' + kinds.map(function (k) {
        return '<button type="button" class="sp-kind' + (k.id === cur ? ' on' : '') +
               '" data-kind="' + esc(k.id) + '">' + esc(k.name) + '</button>';
      }).join('') + '</div>' : '') +
      (pk ? fromLine(kinds, cur) : '') +
      grid(list);
    showOnly();
  }

  /* 아임웹이 그려 둔 사진을 감추는 것은 **우리 사진이 실제로 자리를 차지할 때만** 합니다.
     한 장도 못 보여 주면서 원본까지 감추면 상세 페이지가 텅 비어 버립니다. */
  function showOnly() {
    var ok = false;
    if (mount) {
      var im = mount.querySelectorAll('.sp-grid img');
      ok = im.length > 0 && mount.getBoundingClientRect().width > 40;
    }
    document.body.classList.toggle('sl-pd-on', ok);
  }

  function show(kinds, cur) {
    var k = null;
    kinds.forEach(function (x) { if (x.id === cur) k = x; });
    if (!k) return;
    mount.innerHTML = '<div class="sp-head"><h3>자료 미리보기</h3></div>' +
      '<div class="sp-wait">미리보기를 불러오는 중입니다…</div>';
    load(k.idx, function (list) { paint(list, kinds, cur); });
  }

  /* ── ③ 크게 보기 ── */
  function openLb(i) {
    at = i;
    lb.querySelector('img').src = shots[at];
    lb.querySelector('.no').textContent = (at + 1) + ' / ' + shots.length;
    lb.classList.add('on');
  }
  function step(d) {
    if (!shots.length) return;
    at = (at + d + shots.length) % shots.length;
    lb.querySelector('img').src = shots[at];
    lb.querySelector('.no').textContent = (at + 1) + ' / ' + shots.length;
  }

  /* 손가락으로 옆으로 밀어 넘기기 —
     휴대폰에서는 창을 닫고 다시 여는 것이 번거로워, 민 방향으로 다음 장을 보여 줍니다. */
  function swipe(el) {
    var x0 = 0, y0 = 0, moved = false;
    el.addEventListener('touchstart', function (e) {
      if (e.touches.length !== 1) return;
      x0 = e.touches[0].clientX; y0 = e.touches[0].clientY; moved = false;
    }, { passive: true });
    el.addEventListener('touchmove', function (e) {
      if (e.touches.length !== 1) return;
      var dx = e.touches[0].clientX - x0, dy = e.touches[0].clientY - y0;
      /* 세로로 미는 것은 스크롤이므로 가로가 확실할 때만 넘깁니다 */
      if (!moved && Math.abs(dx) > 45 && Math.abs(dx) > Math.abs(dy) * 1.4) {
        moved = true;
        step(dx < 0 ? 1 : -1);
      }
    }, { passive: true });
  }

  function build() {
    var R = root(), B = body();
    if (!R || !B || document.getElementById('sl-pd-mount')) return;
    document.body.classList.add('sl-pd');

    mount = document.createElement('div');
    mount.className = 'sp-box';
    mount.id = 'sl-pd-mount';
    B.parentNode.insertBefore(mount, B);

    lb = document.createElement('div');
    lb.className = 'sp-lb';
    lb.innerHTML = '<button type="button" class="x" aria-label="닫기">✕</button>' +
      '<button type="button" class="nav prev" aria-label="이전">‹</button>' +
      '<img alt=""><button type="button" class="nav next" aria-label="다음">›</button>' +
      '<span class="no"></span>';
    document.body.appendChild(lb);
    swipe(lb);

    var me = idxNow();
    var pack = PKG && me && PKG[me];
    PACK = pack || null;
    if (pack && pack.kinds.length) {
      /* 패키지 — 안에 든 자료를 단추로 세웁니다 */
      show(pack.kinds, pack.kinds[0].id);
      mount.addEventListener('click', function (e) {
        var b = e.target.closest('.sp-kind');
        if (!b) return;
        show(pack.kinds, b.dataset.kind);
      });
    } else {
      /* 보통 상품 — 이 페이지의 글자에서 바로 뽑습니다.
         상세정보 사진은 **스크롤할 때 늦게 불러오도록** 되어 있어서,
         지금 화면에 그려진 <img> 를 세면 아직 한 장도 없습니다.
         받아 온 글자에는 처음부터 다 들어 있으므로 거기서 찾습니다. */
      var here = pick(document.documentElement.innerHTML);
      if (!here.length) { mount.remove(); mount = null; return; }
      paint(here, null, null);
      showOnly();
    }

    mount.addEventListener('click', function (e) {
      var im = e.target.closest('.sp-grid img');
      if (im) openLb(+im.dataset.i);
    });
    lb.addEventListener('click', function (e) {
      if (e.target.closest('.prev')) { step(-1); return; }
      if (e.target.closest('.next')) { step(1); return; }
      lb.classList.remove('on');
    });
    document.addEventListener('keydown', function (e) {
      if (!lb.classList.contains('on')) return;
      if (e.key === 'Escape') lb.classList.remove('on');
      if (e.key === 'ArrowLeft') step(-1);
      if (e.key === 'ArrowRight') step(1);
    });
  }

  /* 표지 슬라이더(Owl)는 처음 열릴 때 잰 폭(593px)을 칸마다 **직접 박아** 둡니다.
     우리가 상자를 400px 로 줄여도 그 숫자가 그대로 남아 그림이 안 줄어듭니다.
     창 크기가 바뀐 척 알려 주면 슬라이더가 스스로 다시 잽니다. */
  var told = false;
  function retellOwl() {
    if (told || !document.querySelector('.prod-owl-list .owl-item')) return;
    told = true;
    window.dispatchEvent(new Event('resize'));
  }

  /* ── ④ 연관상품 ──
     아임웹 관리자의 연관상품은 이 테마가 화면에 그리지 않습니다. build-related.py 가
     상품마다 「같은 시험(교재·강)의 다른 자료 / 패키지 / 다른 형식 / 다른 학년·교재·출판사」를
     적어 둔 표(related/번호÷100.json)를 받아, 「상세정보·구매평·Q&A」 탭 **바로 위**에 세웁니다.

     규칙 (2026-09-06 사장님)
       · 패키지가 있는 상품만 오른쪽에 「따로 담으면 ○원 → 패키지 ○원」 상자. 없으면 상자 없음.
       · 패키지 구성을 꼭 적습니다 — 모의고사 「변형문제 + 지문분석 + 워크북 + 핵심요약노트」,
         부교재 「워크북 패키지 : 1강~18강 (6강 제외)」.
       · 탭 이름은 모의고사 「다른 학년」 · 부교재 「다른 교재」 · 교과서 「다른 출판사」.
       · 교과서(쏠북 판매)는 패키지 이야기를 안 하고, 담기 단추 대신 「쏠북에서 구매」로 보냅니다.
         여기서 결제되면 안 되므로 장바구니에 절대 넣지 않습니다. */
  var IMG_PRE = 'https://cdn.imweb.me/thumbnail/';
  function won(n) { return String(n || 0).replace(/\B(?=(\d{3})+(?!\d))/g, ',') + '원'; }
  function thumb(s) { return /^https?:/.test(s) ? s : IMG_PRE + s; }
  function prodUrl(no) { return sameHost(location.origin + '/shop_view/' + no); }

  /* 카드 한 장 — P[no] = [이름, 판매가, 정가, 표지, 갈래, 쏠북 주소] */
  function relCard(no, P, now) {
    var p = P[no];
    if (!p) return '';
    var price = p[1], org = p[2], sv = p[5];
    var pr = sv || !price
      ? '<div class="sr-pr sr-pr-sv">쏠북에서 판매</div>'
      : '<div class="sr-pr">' + (org > price ? '<b>' + Math.round((1 - price / org) * 100) + '%</b>' : '') +
        won(price) + (org > price ? '<s>' + won(org) + '</s>' : '') + '</div>';
    var act = now ? ''
      : sv ? '<a class="sr-add sr-go" href="' + esc(sv) + '" target="_blank" rel="noopener">쏠북에서 구매</a>'
      : !price ? '<a class="sr-add sr-go" href="' + esc(prodUrl(no)) + '">자료 보기</a>'
      : '<button type="button" class="sr-add" data-add="' + no + '">+ 담기</button>';
    return '<div class="sr-card' + (now ? ' now' : '') + '">' +
      '<a class="sr-th" href="' + esc(now ? '#' : prodUrl(no)) + '">' +
      (p[4] ? '<span class="sr-kind">' + esc(p[4]) + '</span>' : '') +
      (p[3] ? '<img src="' + esc(thumb(p[3])) + '" alt="" loading="lazy">' : '') + '</a>' +
      '<a class="sr-nm" href="' + esc(now ? '#' : prodUrl(no)) + '">' + esc(p[0]) + '</a>' +
      pr + act + '</div>';
  }

  /* 「준비 중」 자리표 — 아직 안 올라온 갈래의 자리를 같은 크기로 비워 둡니다 (자료가 올라오면 build-related.py 가 채웁니다) */
  function relSlot(kind) {
    return '<div class="sr-card sr-todo"><div class="sr-th"><span class="sr-kind">' + esc(kind) + '</span>' +
      '<div class="sr-todo-in"><b>준비 중</b><span>올라오면 이 자리에<br>담깁니다</span></div></div>' +
      '<div class="sr-nm">' + esc(kind) + '</div><div class="sr-pr sr-pr-sv">곧 올라와요</div>' +
      '<span class="sr-add sr-wait">준비 중</span></div>';
  }

  /* 카드 줄 — r.slot 이 있으면 핵심 여섯 갈래 자리 그대로(지금 상품 포함 · 없는 자리는 「준비 중」),
     없으면(옛 표) 지금 상품 + 같은 세트 */
  function relStrip(r, P, me) {
    if (r.slot && r.slot.length) {
      return r.slot.map(function (x) {
        return P[x] ? relCard(x, P, String(x) === String(me)) : relSlot(x);
      }).join('');
    }
    return (r.isPkg ? '' : relCard(me, P, true)) + r.same.map(function (no) { return relCard(no, P, false); }).join('');
  }

  function relHead(r, n) {
    var what = r.top === '모의고사' ? '이 시험' : '이 교재';
    if (r.isPkg) {
      return '<h3 class="sr-t">이 패키지에 든 자료 <em>' + n + '종</em></h3>' +
        (r.note ? '<p class="sr-s">' + esc(r.note) + '</p>' : '');
    }
    var todo = (r.slot || []).filter(function (x) { return !/^\d+$/.test(String(x)); }).length;
    var sub = r.sv ? '교과서 자료는 쏠북에서 구매하실 수 있어요' :
              todo ? '아직 없는 자료는 준비 중이에요. 올라오는 대로 이 자리에 채워집니다' :
                     '함께 담아 두시면 한 번에 결제하실 수 있어요';
    return '<h3 class="sr-t">' + what + '의 <em>다른 자료들</em>도 확인해보세요!</h3>' +
      '<p class="sr-s">' + sub + '</p>';
  }

  function relSum(r, P) {
    var pk = r.pkg && P[r.pkg];
    if (!pk || r.sv || r.isPkg) return '';
    var price = pk[1], sum = r.sum;
    var off = sum > price ? Math.round((1 - price / sum) * 100) : 0;
    return '<div class="sr-sum">' +
      '<div class="sr-sum-t">' + (off ? '패키지가 더 쌉니다' : '패키지로 한 번에') + '</div>' +
      (r.note ? '<div class="sr-note">' + esc(r.note).replace(/^([^:]+:)/, '<b>$1</b>') + '</div>' : '') +
      '<div class="sr-tot">' + (sum > price ? '<s>따로 ' + won(sum) + '</s>' : '') +
      '<b>' + won(price) + (off ? '<small>' + off + '% 할인</small>' : '') + '</b></div>' +
      '<button type="button" class="sr-btn" data-add="' + r.pkg + '">' + esc(pk[4] && /패키지/.test(pk[4]) ? pk[4] : (pk[4] || '') + ' 패키지') + ' 담기</button>' +
      '<a class="sr-more" href="' + esc(prodUrl(r.pkg)) + '">패키지 상품 보기 →</a>' +
      '</div>';
  }

  function relTabs(r, P) {
    var tabs = [];
    if (r.alt.length) tabs.push({ id: 'alt', label: r.altL, list: r.alt });
    if (r.oth.length) tabs.push({ id: 'oth', label: r.othL, list: r.oth });
    if (!tabs.length) return '';
    var h = '<div class="sr-tabs">';
    tabs.forEach(function (t) {
      h += '<button type="button" class="sr-tab" data-pane="' + t.id + '">' + esc(t.label) +
        '<small>' + t.list.length + '</small></button>';
    });
    h += '</div>';
    tabs.forEach(function (t) {
      h += '<div class="sr-pane" data-pane="' + t.id + '" hidden><div class="sr-cards">' +
        t.list.map(function (no) { return relCard(no, P, false); }).join('') + '</div></div>';
    });
    return h;
  }

  /* 담기 — 상품 페이지의 「장바구니」 단추가 부르는 것과 같은 주소(/shop/add_cart.cm)로 보냅니다.
     옵션 없는 디지털 자료라 상품 번호와 수량이면 됩니다. 못 담으면 그 상품 페이지로 보냅니다. */
  function relAdd(no, btn) {
    if (btn.disabled) return;
    btn.disabled = true;
    var was = btn.textContent;
    btn.textContent = '담는 중…';
    var body = 'prodIdx=' + encodeURIComponent(no) + '&orderCount=1&cart_type=&deliv_type=&deliv_pay_type=&deliv_country=&shipping_template_code=';
    fetch('/shop/add_cart.cm', {
      method: 'POST', credentials: 'same-origin',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8', 'X-Requested-With': 'XMLHttpRequest' },
      body: body
    }).then(function (r) { return r.json(); }).then(function (res) {
      if (!res || res.msg !== 'SUCCESS') throw res;
      /* 담기는 됐습니다 — 이 아래에서 무엇이 어긋나도 상품 페이지로 보내면 안 됩니다 */
      try {
        btn.textContent = '담았어요 ✓';
        btn.classList.add('done');
        /* 머리말 장바구니 숫자 — 아임웹 셸이 이 신호를 받아 올립니다 (같은 상품 재담기는 안 올립니다) */
        window.dispatchEvent(new CustomEvent('imweb:addToCart:added', { detail: { prodFound: !!res.prod_found } }));
      } catch (e) { /* 뱃지는 못 올려도 담기는 됐습니다 */ }
      try {
        relToast('장바구니에 담았습니다');
        var go = document.createElement('a');
        go.className = 'sr-cart-go'; go.href = sameHost(location.origin + '/shop_cart'); go.textContent = '장바구니 보기 →';
        var box = btn.closest('.sr-card, .sr-sum');
        if (box && !box.querySelector('.sr-cart-go')) box.appendChild(go);
      } catch (e) { /* 안내만 못 한 것입니다 */ }
    }).catch(function () {
      btn.textContent = was; btn.disabled = false;
      location.href = prodUrl(no);
    });
  }

  /* 아래 toast() 는 공유 창(cocoaModal) 안에 띄우는 것이라 창이 안 열려 있으면 못 씁니다 — 여기서는 화면 아래에 띄웁니다 */
  function relToast(msg) {
    var box = document.getElementById('sl-rel-toast');
    if (!box) {
      box = document.createElement('div');
      box.id = 'sl-rel-toast';
      document.body.appendChild(box);
    }
    box.textContent = msg;
    box.classList.add('on');
    clearTimeout(box._t);
    box._t = setTimeout(function () { box.classList.remove('on'); }, 2600);
  }

  /* 「상세정보·구매평·Q&A」 탭 상자는 **두 벌**입니다 —
     좁은 화면용 #fixed_tab_mobile 과 넓은 화면용 #fixed_tab.
     한 쪽은 늘 display:none 이라, PC 것 앞에만 넣으면 휴대폰에서 통째로 안 보입니다.
     그래서 **지금 화면에 보이는 쪽**을 찾아 그 앞에 놓고, 창 크기가 바뀌면 옮깁니다. */
  function relAnchor() {
    var ids = ['fixed_tab_mobile', 'fixed_tab'], i, e;
    for (i = 0; i < ids.length; i++) {
      e = document.getElementById(ids[i]);
      if (e && e.offsetParent !== null && e.getBoundingClientRect().width > 0) return e;
    }
    /* 아직 아무것도 안 그려졌으면(늦게 그리는 중) 있는 것을 씁니다 */
    return document.getElementById('fixed_tab') || document.getElementById('fixed_tab_mobile');
  }

  function placeRel() {
    var box = document.getElementById('sl-rel');
    var a = relAnchor();
    if (!box || !a || box.nextElementSibling === a) return;
    a.parentNode.insertBefore(box, a);
  }

  /* 꺾쇠 그림 — 글자(›)는 글꼴마다 아래로 처져 원 한가운데에 안 놓입니다 */
  var ARROW = '<svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true"><path d="D" fill="none" stroke="currentColor" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round"/></svg>';

  /* 카드 줄을 부드럽게 옮깁니다 — scrollBy({behavior:'smooth'}) 는 브라우저마다 속도·지원이 달라
     직접 240ms 동안 움직입니다 (숨은 탭에서는 브라우저가 애니메이션을 멈추므로 보이는 화면에서만 움직입니다) */
  function relSlide(sc, delta) {
    var from = sc.scrollLeft, to = Math.max(0, Math.min(sc.scrollWidth - sc.clientWidth, from + delta));
    var t0 = null, dur = 240, done = false;
    function step(t) {
      if (done) return;
      if (t0 === null) t0 = t;
      var k = Math.min(1, (t - t0) / dur);
      k = 1 - (1 - k) * (1 - k);
      sc.scrollLeft = from + (to - from) * k;
      if (k < 1) requestAnimationFrame(step); else finish();
    }
    function finish() {
      done = true;
      sc.scrollLeft = to;
      /* 화살표 켜고 끄기(scroll 듣는 tell)는 그리기가 멈춘 탭에서 안 불리기도 해 직접 알립니다 */
      try { sc.dispatchEvent(new Event('scroll')); } catch (e) { /* 옛 브라우저 */ }
    }
    requestAnimationFrame(step);
    /* 애니메이션이 못 돌면(숨은 탭·절전) 그냥 끝자리로 */
    setTimeout(function () { if (!done) finish(); }, 320);
  }

  /* 카드 줄 옆 화살표 — 옆에 더 있을 때만 보이고, 끝에 닿은 쪽은 흐려집니다 */
  function relArrows(box) {
    var strip = box.querySelector('.sr-strip');
    if (!strip) return;
    var sc = strip.querySelector('.sr-cards');
    function tell() {
      var more = sc.scrollWidth - sc.clientWidth > 4;
      strip.classList.toggle('can-scroll', more);
      strip.classList.toggle('at-start', sc.scrollLeft <= 2);
      strip.classList.toggle('at-end', sc.scrollLeft + sc.clientWidth >= sc.scrollWidth - 2);
    }
    sc.addEventListener('scroll', tell, { passive: true });
    window.addEventListener('resize', tell);
    tell();
    setTimeout(tell, 300);
    setTimeout(tell, 1200);
  }

  var REL_DONE = false;
  function related() {
    if (REL_DONE) return;
    var me = idxNow();
    var tab = relAnchor();
    if (!me || !tab || document.getElementById('sl-rel')) return;
    REL_DONE = true;
    fetch(BASE + 'related/' + Math.floor(me / 100) + '.json')
      .then(function (r) { return r.ok ? r.json() : Promise.reject(r.status); })
      .then(function (d) {
        var r = d.r[me], P = d.p;
        if (!r) return;
        var strip = relStrip(r, P, me);
        var n = r.same.length + (r.isPkg ? 0 : 1);
        var box = document.createElement('div');
        box.id = 'sl-rel';
        box.className = 'sr-box';
        var h = '<div class="sr-h"><div class="sr-eyebrow">' + esc(r.set) + '</div>' + relHead(r, n) + '</div>';
        if (strip || r.pkg) {
          h += '<div class="sr-set' + (relSum(r, P) ? ' has-sum' : '') + '"><div class="sr-strip">' +
            '<button type="button" class="sr-arr prev" data-arr="-1" aria-label="이전 자료">' + ARROW.replace('D', 'M15 6l-6 6 6 6') + '</button>' +
            '<div class="sr-cards">' + strip + '</div>' +
            '<button type="button" class="sr-arr next" data-arr="1" aria-label="다음 자료">' + ARROW.replace('D', 'M9 6l6 6-6 6') + '</button>' +
            '</div>' + relSum(r, P) + '</div>';
        }
        h += relTabs(r, P);
        box.innerHTML = h;
        var a = relAnchor() || tab;
        a.parentNode.insertBefore(box, a);

        relArrows(box);

        box.addEventListener('click', function (e) {
          var ar = e.target.closest('[data-arr]');
          if (ar) {
            var sc = ar.parentNode.querySelector('.sr-cards');
            var card = sc.querySelector('.sr-card');
            var step = (card ? card.getBoundingClientRect().width + 12 : 162) * 2;
            relSlide(sc, step * Number(ar.dataset.arr));
            return;
          }
          var t = e.target.closest('.sr-tab');
          if (t) {
            var on = t.classList.contains('on');
            box.querySelectorAll('.sr-tab').forEach(function (x) { x.classList.remove('on'); });
            box.querySelectorAll('.sr-pane').forEach(function (p) { p.hidden = true; });
            if (!on) {
              t.classList.add('on');
              var pane = box.querySelector('.sr-pane[data-pane="' + t.dataset.pane + '"]');
              if (pane) pane.hidden = false;
            }
            return;
          }
          var a = e.target.closest('[data-add]');
          if (a) { e.preventDefault(); relAdd(a.dataset.add, a); return; }
          var self = e.target.closest('.sr-card.now a');
          if (self) e.preventDefault();
        });
      })
      .catch(function () { /* 표가 없으면 아무것도 안 그립니다 */ });
  }

  function run() {
    if (!root()) return;
    build();
    related();
    placeRel();
    retellOwl();
    fitCover();
  }

  fetch(BASE + 'pkg-samples.json')
    .then(function (r) { return r.json(); })
    .then(function (d) { PKG = d; run(); })
    .catch(function () { PKG = {}; run(); });

  /* ── 휴대폰 위쪽 단추 줄에 「장바구니」 되살리기 ──
     넓은 화면에서는 [장바구니][구매하기][♡] 셋이 나란한데, 휴대폰에서는 아임웹이
     장바구니를 감춰 둡니다. 담아 두고 더 고르시려는 손님이 갈 곳이 없어 되살립니다.

     ⚠ 꾸미기(CSS)로 한꺼번에 켜면 안 됩니다 —
       아임웹은 **옵션 없는 상품용과 옵션 상품용 단추를 둘 다** 넣어 두고 한 쪽만 보여 줍니다.
       통째로 켜면 「장바구니 장바구니 구매하기 구매하기」 처럼 넷이 됩니다.
       그래서 **보이는 장바구니가 하나도 없을 때만** 첫 번째를 켭니다. */
  function cartOnPhone() {
    if (window.innerWidth > 860) return;
    var row = null;
    document.querySelectorAll('#prod_goods_form .buy_btns.pc').forEach(function (x) {
      if (!row && x.getBoundingClientRect().height > 10) row = x;
    });
    if (!row) return;
    var carts = [].slice.call(row.querySelectorAll('a.btn.cart'));
    if (!carts.length) return;
    var shown = carts.filter(function (a) { return a.getBoundingClientRect().width > 1; });
    if (shown.length) return;                     /* 이미 보입니다 — 손대지 않습니다 */
    carts[0].style.setProperty('display', 'flex', 'important');
  }

  /* ── 휴대폰 : 사는 단추 줄을 값 바로 아래로 올립니다 ──
     넓은 화면에서는 값 옆에 [장바구니][구매하기][♡] 가 붙어 있는데,
     휴대폰에서는 아임웹이 이 줄을 **상세 설명을 다 지난 5,000px 쯤 아래**로 내려 둡니다.
     값을 보시고 바로 담으실 수 있게 값 아래로 데려옵니다.
     (화면 아래 떠 있는 막대는 그대로 둡니다 — 둘 다 있는 것이 편합니다.) */
  function liftBuyRow() {
    var row = document.querySelector('#prod_goods_form .buy_btns.pc');
    if (!row) return;
    /* 값이 적힌 자리 바로 아래에 둡니다.
       ※ `.opt_block.total`(총 상품금액) 은 화면 밖 결제판 안에 있어 안 됩니다 —
          눈에 보이는 값은 `.pay_detail` 쪽입니다.
       넓은 화면에서도 같습니다 — 값 아래가 원래 이 줄의 자리인데(themes/theme-d.css ③),
       아임웹이 상세 설명 아래로 내려 두어 **값 아래가 빈 칸으로 남아 있었습니다.** */
    var price = document.querySelector('#prod_goods_form .pay_detail');
    if (!price || row.previousElementSibling === price) return;
    price.parentNode.insertBefore(row, price.nextSibling);
    /* ── 눈금도 같이 데려옵니다 ──
       상세 페이지 꾸미기(themes/theme-d.js)는 단추 줄 **바로 앞에 눈금(.sl-buy-mark)** 을
       하나 세워 두고, 그 눈금이 화면 위로 지나가면 아래 막대를 띄웁니다.
       줄만 옮기고 눈금을 두고 오면 눈금이 저 아래(5,000px)에 남아,
       **페이지 끝까지 내려가야** 막대가 나옵니다. 눈금을 줄 앞에 다시 세웁니다. */
    var mark = document.querySelector('.sl-buy-mark');
    if (mark && mark.nextElementSibling !== row) row.parentNode.insertBefore(mark, row);
  }

  /* ── 상품명 크기 ──
     아임웹 디자인 설정이 상품명에 **글 안(inline) `font-size:32px !important`** 을 직접 박습니다.
     이건 꾸미기 파일로는 못 이깁니다(같은 !important 라도 글 안에 박힌 쪽이 셉니다).
     그래서 여기서 값만 바꿔 씁니다 — 넓은 화면 23px, 휴대폰 18.5px.
     ※ 아임웹 디자인 설정에서 글자 크기를 바꾸시면 그 값이 다시 박히므로,
        원하시는 크기가 있으면 그쪽에서 정하시고 이 줄을 지우셔도 됩니다. */
  function fitTitle() {
    var t = document.querySelector('.view_tit');
    if (!t) return;
    var want = window.innerWidth <= 860 ? '18.5px' : '23px';
    if (t.style.getPropertyValue('font-size') !== want) {
      t.style.setProperty('font-size', want, 'important');
      t.style.setProperty('line-height', '1.38', 'important');
    }
  }

  /* ═══════════════ 공유하기 창 ═══════════════
     아임웹이 내놓는 공유 창(#cocoaModal)에는 라인·밴드·네이버·페이스북·X 다섯이 있습니다.
     선생님들이 실제로 쓰시는 것은 **카카오톡·인스타그램·스레드** 라, 그 셋을 맨 앞에 세우고
     밴드·X 는 접어 둡니다. 아래에는 어떤 자료를 공유하는지 이름을 알약으로 보여 드립니다.

     ── 셋을 어떻게 보내는가 ──
       카카오톡  : 이 사이트에 이미 카카오 SDK 가 올라와 있어(채널 상담 단추) 그대로 씁니다.
                   창이 안 뜨면(설정이 막혀 있으면) 링크 복사로 넘어갑니다.
       인스타그램: 웹에서 바로 보내는 길이 **없습니다**(인스타가 안 열어 줍니다).
                   휴대폰이면 기기의 공유판을 띄우고, 아니면 링크를 복사해 드리고 인스타를 엽니다.
       스레드    : 글쓰기 창을 여는 주소가 있어 그대로 씁니다.
     ═══════════════════════════════════════════ */
  /* 공유·복사되는 주소는 **한 가지 모양**으로 통일합니다 — https://www.daechisecret.com/shop_view/번호
     아임웹이 내놓는 주소(daechisecret.com/mockexam1-2026-pdf/?idx=1057)는
       · www 가 없어 한 번 튕기고(301),
       · 진열 칸 이름이 들어 있어 그 칸을 없애시면 죽습니다.
     /shop_view/번호 는 진열 칸과 무관하게 늘 열립니다 (자료실 링크와 같은 규칙). */
  function shareLink() {
    var i = document.querySelector('#cocoaModal ._sns_copy_url');
    var raw = (i && i.value) || location.href;
    var m = /[?&]idx=(\d+)/.exec(raw) || /\/shop_view\/(\d+)/.exec(raw);
    if (m) return 'https://www.daechisecret.com/shop_view/' + m[1];
    return raw.split('#')[0];
  }
  /* 아임웹 복사 칸에도 같은 주소를 채워 둡니다 (아래 「복사」 단추도 이 값을 복사합니다) */
  function unifyCopyBox() {
    var i = document.querySelector('#cocoaModal ._sns_copy_url');
    if (i && i.value !== shareLink()) i.value = shareLink();
  }
  function shareName() {
    var t = document.querySelector('.view_tit');
    if (!t) return document.title;
    /* 상품명 안에 SALE·BEST 같은 딱지(.ns-icon)가 같이 들어 있어 떼고 씁니다 */
    var c = t.cloneNode(true);
    c.querySelectorAll('.ns-icon, .sticker, .icon').forEach(function (x) { x.remove(); });
    return (c.textContent || '').replace(/\s+/g, ' ').trim();
  }
  function shareThumb() {
    var i = document.querySelector('.goods_thumbs img, .prod-owl-list img, .goods_wrap img');
    return i && i.src ? i.src : '';
  }
  function toast(msg) {
    var m = document.getElementById('cocoaModal');
    var box = m && m.querySelector('.sl-share-toast');
    if (!box) {
      box = document.createElement('div');
      box.className = 'sl-share-toast';
      (m ? m.querySelector('.modal-body') : document.body).appendChild(box);
    }
    box.textContent = msg;
    box.classList.add('on');
    setTimeout(function () { box.classList.remove('on'); }, 2600);
  }
  function copyLink() {
    var url = shareLink();
    try {
      if (navigator.clipboard) return navigator.clipboard.writeText(url);
    } catch (e) {}
    var i = document.querySelector('#cocoaModal ._sns_copy_url');
    if (i) { i.select(); try { document.execCommand('copy'); } catch (e) {} }
  }

  var SNS = [
    {
      key: 'kakao', label: '카카오톡',
      svg: '<svg viewBox="0 0 24 24"><ellipse cx="12" cy="11" rx="9.5" ry="8" fill="#3C1E1E"/>' +
           '<path d="M7 17.5l-1 4 4.5-2.6z" fill="#3C1E1E"/></svg>',
      go: function () {
        try {
          if (window.Kakao && Kakao.isInitialized() && Kakao.Share) {
            Kakao.Share.sendDefault({
              objectType: 'feed',
              content: {
                title: shareName(),
                description: '대치동시크릿 영어자료',
                imageUrl: shareThumb(),
                link: { mobileWebUrl: shareLink(), webUrl: shareLink() }
              },
              buttons: [{ title: '자료 보러 가기', link: { mobileWebUrl: shareLink(), webUrl: shareLink() } }]
            });
            return;
          }
        } catch (e) {}
        copyLink(); toast('카카오톡 공유가 막혀 있어 링크를 복사했습니다. 붙여넣어 보내 주세요.');
      }
    },
    {
      key: 'threads', label: '스레드',
      svg: '<svg viewBox="0 0 24 24"><text x="12" y="17.5" text-anchor="middle" font-size="16" font-weight="700" fill="#fff" font-family="Helvetica, Arial, sans-serif">@</text></svg>',
      go: function () {
        var t = encodeURIComponent(shareName() + ' ' + shareLink());
        window.open('https://www.threads.net/intent/post?text=' + t, '_blank', 'noopener');
      }
    }
  ];

  function dressShare() {
    var m = document.getElementById('cocoaModal');
    if (!m) return;
    var ul = m.querySelector('.social-btn ul');
    if (!ul) return;
    /* ⚠ 「이미 꾸몄다」 표시로 건너뛰면 안 됩니다 —
       아임웹은 창을 **두 번째 열 때 안쪽을 통째로 다시 그립니다** (같은 상자, 새 내용).
       그래서 표시가 아니라 **지금 안에 우리 단추가 있는지**를 봅니다. */
    if (ul.querySelector('.sl-sns-kakao')) { m.classList.add('sl-share'); unifyCopyBox(); return; }
    m.classList.add('sl-share');
    unifyCopyBox();

    /* 차례를 세웁니다 — 카카오톡 · 스레드 · 네이버 · 라인 · 페이스북 · 링크 복사
       (인스타그램은 웹에서 보낼 길이 없어 뺐습니다) */
    var ORDER = ['sl-sns-kakao', 'sl-sns-threads', 'naver', 'line', 'face', 'sl-sns-copy'];

    /* 밴드·X 는 접습니다 (사장님이 안 쓰시는 곳입니다) */
    ['band', 'twitter'].forEach(function (k) {
      var li = ul.querySelector('li.' + k);
      if (li) li.style.display = 'none';
    });

    /* 카카오톡·인스타그램·스레드를 **맨 앞에** — 뒤에서부터 끼워 넣습니다 */
    SNS.slice().reverse().forEach(function (s) {
      var li = document.createElement('li');
      li.className = 'sl-sns sl-sns-' + s.key;
      li.innerHTML = '<a href="#" role="button"><span class="ic">' + s.svg + '</span>' +
                     '<span class="tx">' + s.label + '</span></a>';
      li.querySelector('a').addEventListener('click', function (e) {
        e.preventDefault();
        s.go();
      });
      ul.insertBefore(li, ul.firstChild);
    });

    /* 마지막 칸 — 링크 복사 (브라우저 모양). 아래 복사 단추와 같은 일을 합니다만
       한 칸이 비면 격자가 어색해 여기도 둡니다. */
    if (!ul.querySelector('.sl-sns-copy')) {
      var cp = document.createElement('li');
      cp.className = 'sl-sns sl-sns-copy';
      cp.innerHTML = '<a href="#" role="button"><span class="ic">' +
        '<svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="8.5" fill="none" stroke="#fff" stroke-width="1.8"/>' +
        '<path d="M3.5 12h17M12 3.5c3 3 3 14 0 17M12 3.5c-3 3-3 14 0 17" fill="none" stroke="#fff" stroke-width="1.6"/></svg>' +
        '</span><span class="tx">링크 복사</span></a>';
      cp.querySelector('a').addEventListener('click', function (e) {
        e.preventDefault();
        copyLink();
        toast('링크를 복사했습니다. 원하시는 곳에 붙여넣어 주세요.');
      });
      ul.appendChild(cp);
    }

    /* 라인·네이버·페이스북 — 아임웹 아이콘은 한 장짜리 그림(스프라이트)이라 크기를 바꾸면
       줄무늬가 됩니다. 우리 것과 결이 맞게 **같은 모양의 동그라미 아이콘**으로 갈아 끼웁니다.
       (누르면 하는 일(onclick)은 아임웹 것 그대로입니다) */
    var OLD = {
      line: { label: '라인', bg: '#06C755',
        svg: '<svg viewBox="0 0 24 24"><path d="M12 4C7.3 4 3.5 7.1 3.5 10.9c0 3.4 3 6.2 7 6.8.3.1.6.2.7.5.1.2 0 .6 0 .9l-.1.7c0 .2-.2.9.8.5s5.1-3 7-5.2c1.3-1.4 1.6-2.8 1.6-4.2C20.5 7.1 16.7 4 12 4z" fill="#fff"/></svg>' },
      naver: { label: '네이버', bg: '#03C75A',
        svg: '<svg viewBox="0 0 24 24"><path d="M6 5h4.2l3.6 5.6V5H18v14h-4.2l-3.6-5.6V19H6z" fill="#fff"/></svg>' },
      face: { label: '페이스북', bg: '#1877F2',
        svg: '<svg viewBox="0 0 24 24"><path d="M13.5 20v-6.5h2.2l.4-2.7h-2.6V9.2c0-.8.3-1.3 1.4-1.3h1.3V5.5c-.3 0-1.1-.1-2-.1-2 0-3.4 1.2-3.4 3.5v2H8.5v2.7h2.3V20z" fill="#fff"/></svg>' }
    };
    Object.keys(OLD).forEach(function (k) {
      var li = ul.querySelector('li.' + k), a = li && li.querySelector('a');
      if (!a || a.querySelector('.ic')) return;
      li.classList.add('sl-sns', 'sl-sns-' + k);
      a.innerHTML = '<span class="ic" style="background:' + OLD[k].bg + '">' + OLD[k].svg + '</span>' +
                    '<span class="tx">' + OLD[k].label + '</span>';
    });

    /* 정한 차례대로 다시 세웁니다 */
    ORDER.forEach(function (k) {
      var li = ul.querySelector('li.' + k);
      if (li) ul.appendChild(li);
    });

    /* 링크 칸 위에 「무엇을 공유하는지」 알약 */
    var copy = m.querySelector('.url-copy');
    if (copy && !m.querySelector('.sl-share-name')) {
      var pill = document.createElement('div');
      pill.className = 'sl-share-name';
      pill.textContent = shareName();
      copy.parentNode.insertBefore(pill, copy);
    }
  }
  /* 공유 창은 누르셔야 만들어집니다 — 누른 뒤에 꾸밉니다 */
  document.addEventListener('click', function (e) {
    if (e.target.closest && e.target.closest('.bt-share, .comment_num_warp .btn')) {
      [60, 300, 800].forEach(function (ms) { setTimeout(function () { dressShare(); unifyCopyBox(); }, ms); });
    }
  }, true);

  /* ── 휴대폰 공유 단추 자리 ──
     좌표로 못 박으면 후기 알약이 있는 상품과 없는 상품에서 자리가 달라집니다
     (알약이 없으면 제목 위로 올라가 글자를 덮었습니다).
     그래서 배지(SALE·BEST) 줄 **바로 아래 한 줄**로 옮겨, 어떤 상품이든 같은 자리입니다. */
  var shareHome = null;
  function placeShare() {
    var w = document.querySelector('#prod_goods_form .comment_num_warp');
    if (!w) return;
    if (window.innerWidth <= 860) {
      var tit = document.querySelector('#prod_goods_form .view_tit');
      if (!tit || w.previousElementSibling === tit) return;
      if (!shareHome) shareHome = { p: w.parentNode, n: w.nextSibling };
      tit.parentNode.insertBefore(w, tit.nextSibling);
      w.classList.add('sl-share-row');
    } else if (shareHome) {
      shareHome.p.insertBefore(w, shareHome.n);
      w.classList.remove('sl-share-row');
      shareHome = null;
    }
  }

  window.addEventListener('load', run);
  window.addEventListener('resize', fitTitle);
  window.addEventListener('resize', placeShare);
  window.addEventListener('resize', fitCover);
  window.addEventListener('resize', placeRel);   /* 넓은 화면 ↔ 좁은 화면으로 바뀌면 보이는 탭 앞으로 옮깁니다 */
  window.addEventListener('resize', cartOnPhone);
  window.addEventListener('resize', liftBuyRow);
  setTimeout(run, 600);
  setTimeout(run, 1800);
  setTimeout(run, 3500);
  setTimeout(fitCover, 5000);
  cartOnPhone(); liftBuyRow(); fitTitle(); placeShare(); placeRel();
  [700, 2000, 4000].forEach(function (ms) {
    setTimeout(function () { cartOnPhone(); liftBuyRow(); fitTitle(); placeShare(); placeRel(); }, ms);
  });
})();
