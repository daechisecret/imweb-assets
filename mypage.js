/* ═══════════════════════════════════════════════════════════════
   대치동시크릿 마이페이지 — 짝꿍 : themes/mypage.css

   ⚠ 이 스크립트는 **아무 기능도 건드리지 않습니다.**
      하는 일은 셋뿐입니다.
        ① body 에 sl-my 를 붙여 꾸미기가 걸리게 합니다
        ② 왼쪽 메뉴 글자 **앞에** 아이콘을, 뒤에 개수를 덧붙입니다
           (링크 자체와 주소는 손대지 않습니다)
        ③ 「재입고 알림」 메뉴 한 줄만 감춥니다
      단추를 옮기거나 다시 만들지 않고, 입력칸 이름도 바꾸지 않습니다.
      그래서 다운로드·구매확정·구매평·위시 빼기·정보 저장은
      예전과 똑같이 아임웹이 처리합니다.
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
    var p = document.querySelector('.head .point-view .text-32');
    var c = document.querySelector('.head .coupon-view .text-32');
    if (p) out['시크릿적립금'] = (p.textContent || '').trim();
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

  function run() {
    if (!document.querySelector('.shop-content.mypage')) return;
    document.body.classList.add('sl-my');
    dress();
  }

  run();
  window.addEventListener('load', run);
  setTimeout(run, 400);
  setTimeout(run, 1400);
  setTimeout(run, 3000);
  /* 정보 수정 창은 나중에 열립니다 — 그때도 꾸미기가 걸려 있으면 됩니다 */
  document.addEventListener('click', function () { setTimeout(run, 500); });
})();
