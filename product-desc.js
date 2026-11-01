/* 상품 상세 본문 꾸미기 도우미 — 시안 (2026-11-01). product-desc.css 와 짝.
   ① 「디지털 파일 · PDF/HWP · 구매내역」 안내 목록 → 회색 상자(.sl-notice, 맨 끝 것은 .end)
   ② ■ 로 시작하는 줄 → 소제목(.sl-h, ■ 는 분홍 네모로)
   ③ 「1. …」 줄 → 번호 동그라미 + 박다현체(.sl-num) */
(function () {
  function run() {
    // 게시판 글 본문도(2026-11-01 사장님 「전 영역」) — 칼럼 글(.dcs-col)은 자기 디자인이 있어 뺀다
    document.querySelectorAll('.board_view .board_txt_area').forEach(function (b) { if (!b.querySelector('.dcs-col')) b.setAttribute('data-sl-desc', ''); });
    var body = document.querySelectorAll('[id=prod_detail_body],[data-sl-desc]');
    body.forEach(function (b) {
      var uls = b.querySelectorAll('ul');
      uls.forEach(function (u, k) {
        if (/디지털 파일|구매내역|HWP버전/.test(u.textContent)) { u.classList.add('sl-notice'); if (k > 0 && k === uls.length - 1) u.classList.add('end'); }
      });
      b.querySelectorAll('p').forEach(function (p) {
        if (p.classList.contains('sl-h')) return;
        var t = p.textContent.trim();
        // 「1. …」 「2. …」 줄(목록처럼 쓴 문단) → 분홍 번호 동그라미 + 박다현체
        var mm = t.match(/^(\d{1,2})[.)]\s+/);
        if (mm && t.length < 90 && !p.classList.contains('sl-num')) {
          p.classList.add('sl-num'); p.setAttribute('data-n', mm[1]);
          var w0 = document.createTreeWalker(p, NodeFilter.SHOW_TEXT), n0;
          while ((n0 = w0.nextNode())) { if (/^\s*\d{1,2}[.)]\s+/.test(n0.nodeValue)) { n0.nodeValue = n0.nodeValue.replace(/^\s*\d{1,2}[.)]\s+/, ''); break; } }
          return;
        }
        if (/^■\s*/.test(t) && t.length < 40) {
          p.classList.add('sl-h');
          var w = document.createTreeWalker(p, NodeFilter.SHOW_TEXT), n;
          while ((n = w.nextNode())) { if (/■/.test(n.nodeValue)) { n.nodeValue = n.nodeValue.replace(/■\s*/, ''); var s = document.createElement('span'); s.className = 'sl-sq'; n.parentNode.insertBefore(s, n); break; } }
        }
      });
    });
  }
  run(); var n = 0, t = setInterval(function () { run(); if (++n > 15) clearInterval(t); }, 800);
})();
