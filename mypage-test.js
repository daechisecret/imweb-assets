/* ═══════════════════════════════════════════════════════════════
   대치동시크릿 마이페이지 — 짝꿍 : themes/mypage.css

   하는 일
     ① body 에 sl-my 를 붙여 꾸미기가 걸리게 합니다
     ② 왼쪽 메뉴 글자 **앞에** 아이콘을, 뒤에 개수를 덧붙입니다 (링크 자체와 주소는 손대지 않습니다)
     ③ 「재입고 알림」 메뉴 한 줄만 감춥니다
     ④ 주문 조회 — 다운로드 단추를 누르면 **먼저 확인 창**을 띄웁니다 (2026-09-09 사장님)
        「상품명을 잘 확인하셨나요? 디지털 상품이라 다운로드 받으시면 환불이 어려워요!」
        + 고른 자료 이름 → [자료명 다시 확인하기] / [이해했어요, 다운로드]
        이해했어요를 누르면 아임웹이 하던 그대로(같은 주소로) 다운로드가 시작됩니다.
     ⑤ 주문 조회 — 「여러 자료 한번에 받기」: 자료마다 체크칸 · 모두 선택/해제 · 고른 것을 차례로 받습니다
        (같은 확인 창에 고른 자료 이름이 목록으로 뜹니다. 브라우저가 「여러 파일 다운로드 허용」을 한 번 물을 수 있습니다)
     ⑥ 「구매평 작성」 단추 위에 말풍선 — 「구매평을 작성해주시면 적립금 최대 1,500원!」

   ④⑤는 아임웹 단추의 동작을 **가로채 잠깐 미루는 것**뿐입니다. 아임웹 단추는 onclick 에
   다운로드 주소를 들고 있고(handleOmsDigitalDownload → location.href), 우리는 그 주소를 그대로 씁니다.
   우리 코드가 어떤 이유로든 죽으면 확인 창 없이 예전처럼 바로 다운로드됩니다.
   구매확정·구매평·위시 빼기·정보 저장은 손대지 않습니다.
   ═══════════════════════════════════════════════════════════════ */
(function () {
  /* 메뉴 글자 → 앞에 붙일 그림 */
  var ICON = {
    '주문 조회': '📦',
    '최근 본 상품': '🕘',
    '위시 리스트': '🩷',
    '쿠폰': '🎟',
    '시크릿적립금': '💰',
    '1:1 문의': '💬',
    '정보 수정': '⚙️',
    '회원탈퇴': '🚪'
  };
  /* 쓰지 않는 메뉴 */
  var HIDE = ['재입고 알림'];

  function plain(s) {
    /* 「🩷시크릿적립금🩷」 처럼 하트가 붙어 있어 떼고 견줍니다 */
    return String(s || '').replace(/[^0-9A-Za-z가-힣:. ]/g, '').replace(/\s+/g, ' ').trim();
  }

  /* 인사 칸에 적힌 적립금·쿠폰 수를 메뉴 옆에 옮겨 적습니다 (읽기만 합니다) */
  function counts() {
    var out = {};
    /* 적립금은 「16,900」처럼 자릿수가 길어 메뉴 글자를 두 줄로 밀어냅니다.
       금액은 바로 위 인사 칸에 크게 적혀 있으니 메뉴에는 붙이지 않습니다. */
    var c = document.querySelector('.head .coupon-view .text-32');
    if (c) out['쿠폰'] = (c.textContent || '').trim();
    var w = document.querySelector('#titleWishlist, #wish_cnt em');
    if (w) out['위시 리스트'] = (w.textContent || '').trim();
    return out;
  }

  function dress() {
    var lis = document.querySelectorAll('.shop-content.mypage .col-md-2 ul li');
    if (!lis.length) return false;
    var n = counts();

    for (var i = 0; i < lis.length; i++) {
      var li = lis[i];
      var a = li.querySelector('a');
      if (!a) continue;
      var name = plain(li.textContent);

      if (HIDE.indexOf(name) >= 0) { li.classList.add('sl-hide'); continue; }
      if (a.dataset.slDone === '1') continue;
      a.dataset.slDone = '1';

      /* 그림은 링크 **안 맨 앞**에 넣습니다 — 링크를 새로 만들지 않습니다 */
      if (ICON[name]) {
        var ic = document.createElement('i');
        ic.className = 'sl-ic';
        ic.textContent = ICON[name];
        a.insertBefore(ic, a.firstChild);
      }
      if (n[name] && n[name] !== '0') {
        var b = document.createElement('span');
        b.className = 'sl-n';
        b.textContent = n[name];
        a.appendChild(b);
      }
    }
    return true;
  }

  /* ═══════════════ 주문 조회 — 다운로드 확인 창 · 여러 개 받기 · 구매평 말풍선 ═══════════════ */
  var REVIEW_TIP = '구매평을 작성해주시면 적립금 최대 1,500원!';

  function esc(v) {
    return String(v == null ? '' : v).replace(/[&<>"]/g, function (c) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c];
    });
  }
  /* 상품 이름 앞뒤의 하트 같은 그림 글자를 뗍니다 (🩷 ❤️) */
  function cleanName(t) {
    return String(t || '').replace(/[\uD83C-\uDBFF][\uDC00-\uDFFF]|[\u2600-\u27BF]|\uFE0F/g, '').replace(/\s+/g, ' ').trim();
  }
  /* 아임웹 단추가 onclick 에 들고 있는 다운로드 주소 */
  function hrefOf(btn) {
    var m = /handleOmsDigitalDownload\([^,]*,\s*'([^']+)'/.exec(btn.getAttribute('onclick') || '');
    return m ? m[1].replace(/&amp;/g, '&') : '';
  }
  function rowOf(btn) { return btn.closest('tr.content') || btn.closest('tr') || btn.closest('li'); }
  function nameOf(row) {
    var el = row && (row.querySelector('.text-bold') || row.querySelector('a[href*="shop_view"]'));
    return cleanName(el ? el.textContent : '') || '주문하신 자료';
  }
  function allDlButtons() {
    return [].slice.call(document.querySelectorAll('#shop_mypage_orderlist .btn-digital-download, .shop-content.mypage .btn-digital-download'));
  }

  /* ── 확인 창 ── */
  function closeConfirm() {
    var m = document.getElementById('sl-dl');
    if (m) m.parentNode.removeChild(m);
    document.body.classList.remove('sl-dl-open');
  }
  function openConfirm(items, onOk) {
    closeConfirm();
    var many = items.length > 1;
    var m = document.createElement('div');
    m.id = 'sl-dl';
    m.innerHTML =
      '<div class="sl-dl-back" data-act="cancel"></div>' +
      '<div class="sl-dl-box" role="dialog" aria-modal="true" aria-labelledby="sl-dl-t">' +
        '<div class="sl-dl-ic">📄</div>' +
        '<h3 class="sl-dl-t" id="sl-dl-t">' + (many ? '자료 ' + items.length + '개, 잘 확인하셨나요?' : '상품명을 잘 확인하셨나요?') + '</h3>' +
        '<p class="sl-dl-s">디지털 상품이라 상품을 다운로드 받으시면 <b>환불이 어려워요!</b></p>' +
        '<div class="sl-dl-list-t">' + (many ? '지금 받을 자료' : '지금 받을 자료') + '</div>' +
        '<ul class="sl-dl-list">' + items.map(function (it) { return '<li>' + esc(it.name) + '</li>'; }).join('') + '</ul>' +
        '<div class="sl-dl-btns">' +
          '<button type="button" class="sl-dl-no" data-act="cancel">자료명 다시 확인하기</button>' +
          '<button type="button" class="sl-dl-ok" data-act="ok">이해했어요, 다운로드</button>' +
        '</div>' +
      '</div>';
    document.body.appendChild(m);
    document.body.classList.add('sl-dl-open');
    m.addEventListener('click', function (e) {
      var a = e.target.closest('[data-act]');
      if (!a) return;
      if (a.dataset.act === 'ok') { closeConfirm(); onOk(); }
      else closeConfirm();
    });
    var onKey = function (e) { if (e.key === 'Escape') { closeConfirm(); document.removeEventListener('keydown', onKey); } };
    document.addEventListener('keydown', onKey);
    var ok = m.querySelector('.sl-dl-ok');
    if (ok) ok.focus();
  }

  /* ── 실제 받기 ──
     하나: 아임웹 함수 그대로 (같은 주소로 location.href — 예전과 똑같습니다)
     여럿: 숨은 iframe 으로 차례로 (한 페이지에서 location.href 를 잇달아 바꾸면 앞 것이 취소됩니다) */
  function downloadOne(href) {
    try {
      if (window.SITE_SHOP_DETAIL && typeof SITE_SHOP_DETAIL.handleOmsDigitalDownload === 'function') {
        SITE_SHOP_DETAIL.handleOmsDigitalDownload(null, href);
        return;
      }
    } catch (e) { /* 아래로 */ }
    location.href = href;
  }
  function downloadMany(items) {
    items.forEach(function (it, i) {
      setTimeout(function () {
        var f = document.createElement('iframe');
        f.style.cssText = 'position:absolute;width:0;height:0;border:0;visibility:hidden';
        f.src = it.href;
        document.body.appendChild(f);
        setTimeout(function () { if (f.parentNode) f.parentNode.removeChild(f); }, 90000);
      }, i * 900);
    });
    toast(items.length + '개 자료를 차례로 받는 중입니다');
  }

  function toast(msg) {
    var t = document.getElementById('sl-my-toast');
    if (!t) { t = document.createElement('div'); t.id = 'sl-my-toast'; document.body.appendChild(t); }
    t.textContent = msg; t.classList.add('on');
    clearTimeout(t._t); t._t = setTimeout(function () { t.classList.remove('on'); }, 3200);
  }

  /* ── 다운로드 단추 가로채기 (한 번만 답니다) ──
     문서 맨 바깥에서 capture 로 먼저 받아, 아임웹 onclick 이 돌기 전에 멈추고 창을 띄웁니다.
     이해했어요 → 아임웹 함수에 같은 주소를 넘깁니다. */
  var HOOKED = false;
  function hookDownload() {
    if (HOOKED) return;
    HOOKED = true;
    document.addEventListener('click', function (e) {
      var btn = e.target.closest('.btn-digital-download');
      if (!btn) return;
      var href = hrefOf(btn);
      if (!href) return;                        /* 주소를 못 읽으면 아임웹 것에 맡깁니다 */
      e.preventDefault();
      e.stopImmediatePropagation();
      openConfirm([{ name: nameOf(rowOf(btn)), href: href }], function () { downloadOne(href); });
    }, true);
  }

  /* ── 여러 자료 한번에 받기 ── */
  function pickedItems() {
    var out = [];
    allDlButtons().forEach(function (btn) {
      var row = rowOf(btn);
      var cb = row && row.querySelector('.sl-pick input');
      if (cb && cb.checked) out.push({ name: nameOf(row), href: hrefOf(btn) });
    });
    return out.filter(function (it) { return it.href; });
  }
  function setAll(on) {
    document.querySelectorAll('.sl-pick input').forEach(function (cb) { cb.checked = on; });
    refreshBar();
  }
  function refreshBar() {
    var bar = document.getElementById('sl-multi');
    if (!bar) return;
    var n = pickedItems().length;
    var b = bar.querySelector('[data-act="go"]');
    b.textContent = n ? '선택한 ' + n + '개 다운로드' : '받을 자료를 골라 주세요';
    b.disabled = !n;
  }
  function multiOn() { return document.body.classList.contains('sl-multi'); }
  function toggleMulti(on) {
    document.body.classList.toggle('sl-multi', on);
    var bar = document.getElementById('sl-multi');
    if (bar) bar.classList.toggle('on', on);
    if (!on) setAll(false);
    refreshBar();
  }
  function dressOrders() {
    var list = document.getElementById('shop_mypage_orderlist');
    var btns = allDlButtons();
    if (!list || !btns.length) return;

    /* 위쪽 막대 */
    if (!document.getElementById('sl-multi')) {
      var bar = document.createElement('div');
      bar.id = 'sl-multi';
      bar.innerHTML =
        '<button type="button" class="sl-mb sl-mb-open" data-act="open">📥 여러 자료 한번에 받기</button>' +
        '<div class="sl-mb-tools">' +
          '<span class="sl-mb-hint">받을 자료에 체크하세요</span>' +
          '<button type="button" class="sl-mb" data-act="all">모두 선택</button>' +
          '<button type="button" class="sl-mb" data-act="none">모두 해제</button>' +
          '<button type="button" class="sl-mb sl-mb-go" data-act="go" disabled>받을 자료를 골라 주세요</button>' +
          '<button type="button" class="sl-mb sl-mb-x" data-act="close" aria-label="닫기">✕</button>' +
        '</div>';
      list.parentNode.insertBefore(bar, list);
      bar.addEventListener('click', function (e) {
        var a = e.target.closest('[data-act]');
        if (!a) return;
        var act = a.dataset.act;
        if (act === 'open') toggleMulti(true);
        else if (act === 'close') toggleMulti(false);
        else if (act === 'all') setAll(true);
        else if (act === 'none') setAll(false);
        else if (act === 'go') {
          var items = pickedItems();
          if (!items.length) return;
          openConfirm(items, function () { downloadMany(items); toggleMulti(false); });
        }
      });
    }

    btns.forEach(function (btn) {
      var row = rowOf(btn);
      if (!row || row.querySelector('.sl-pick')) return;
      /* 체크칸 — 이름 바로 앞에. 라벨을 누르면 체크됩니다 */
      var nameEl = row.querySelector('.text-bold');
      var lab = document.createElement('label');
      lab.className = 'sl-pick';
      lab.innerHTML = '<input type="checkbox"><span>받기</span>';
      lab.addEventListener('click', function (e) { e.stopPropagation(); });
      lab.querySelector('input').addEventListener('change', refreshBar);
      var cell = row.querySelector('td') || row;
      if (nameEl && nameEl.parentNode) nameEl.parentNode.insertBefore(lab, nameEl);
      else cell.insertBefore(lab, cell.firstChild);
    });

    /* 구매평 말풍선 */
    document.querySelectorAll('#shop_mypage_orderlist .btn-write-review').forEach(function (b) {
      var wrap = b.parentNode;
      if (!wrap || wrap.querySelector('.sl-rv-tip')) return;
      var tip = document.createElement('div');
      tip.className = 'sl-rv-tip';
      tip.textContent = REVIEW_TIP;
      wrap.parentNode.insertBefore(tip, wrap);
    });
  }

  function run() {
    if (!document.querySelector('.shop-content.mypage')) return;
    document.body.classList.add('sl-my');
    dress();
    try { hookDownload(); dressOrders(); } catch (e) { /* 꾸미기가 실패해도 아임웹 단추는 그대로 동작합니다 */ }
  }

  run();
  window.addEventListener('load', run);
  setTimeout(run, 400);
  setTimeout(run, 1400);
  setTimeout(run, 3000);
  /* 정보 수정 창은 나중에 열립니다 — 그때도 꾸미기가 걸려 있으면 됩니다 */
  document.addEventListener('click', function () { setTimeout(run, 500); });
})();
