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
    return '<div class="sp-from">아래는 <b>' + esc(k.long || k.name) +
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
  window.addEventListener('resize', cartOnPhone);
  window.addEventListener('resize', liftBuyRow);
  setTimeout(run, 600);
  setTimeout(run, 1800);
  setTimeout(run, 3500);
  setTimeout(fitCover, 5000);
  cartOnPhone(); liftBuyRow(); fitTitle(); placeShare();
  [700, 2000, 4000].forEach(function (ms) {
    setTimeout(function () { cartOnPhone(); liftBuyRow(); fitTitle(); placeShare(); }, ms);
  });
})();
