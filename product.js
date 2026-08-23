/* ═══════════════════════════════════════════════════════════════
   대치동시크릿 상품 상세 페이지 — 짝꿍 : themes/product.css

   ① 표지 아래끝을 「장바구니·바로 구매」 단추 아래선에 맞춥니다.
   ② 상세정보 사진을 세 칸 격자로 다시 세우고, 누르면 크게 봅니다.
   ③ 패키지 상품이면 그 안에 든 자료(변형문제·지문분석 …)를 단추로 세우고,
      누르시면 **그 자료의 진짜 샘플**을 불러옵니다.
      (패키지 상품 페이지에는 홍보 배너만 있어 보여 드릴 것이 없습니다.)

   아임웹 것은 지우지 않습니다 — 그림만 감추고 그 자리에 우리 것을 놓습니다.
   ═══════════════════════════════════════════════════════════════ */
(function () {
  var BASE = 'https://daechisecret.github.io/imweb-assets/';
  var PKG = null;                 /* 패키지 → 안에 든 자료 대응표 */
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
      if (out.length >= 24) break;
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

  function paint(list, kinds, cur) {
    shots = list;
    var pk = kinds && kinds.length;
    mount.innerHTML =
      '<div class="sp-head"><h3>자료 미리보기</h3>' +
      (list.length ? '<span class="sp-cnt">' + list.length + '장</span>' : '') +
      '<span class="sp-tip">눌러서 크게 보세요!</span></div>' +
      (pk ? '<div class="sp-kinds">' + kinds.map(function (k) {
        return '<button type="button" class="sp-kind' + (k.id === cur ? ' on' : '') +
               '" data-kind="' + esc(k.id) + '">' + esc(k.name) + '</button>';
      }).join('') + '</div>' : '') +
      (pk ? '<div class="sp-from">패키지 상품이라 <b>안에 든 자료</b>의 미리보기를 보여 드립니다.</div>' : '') +
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

  function run() {
    if (!root()) return;
    build();
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

  window.addEventListener('load', run);
  window.addEventListener('resize', fitCover);
  window.addEventListener('resize', cartOnPhone);
  window.addEventListener('resize', liftBuyRow);
  setTimeout(run, 600);
  setTimeout(run, 1800);
  setTimeout(run, 3500);
  setTimeout(fitCover, 5000);
  cartOnPhone(); liftBuyRow();
  [700, 2000, 4000].forEach(function (ms) {
    setTimeout(function () { cartOnPhone(); liftBuyRow(); }, ms);
  });
})();
