(function () {
  if (location.hostname !== 'daechisecret.imweb.me') return;
  try { if (window.top !== window.self) return; } catch (e) { return; }  /* 틀 안 = 편집 미리보기 */
  location.replace('https://www.daechisecret.com' + location.pathname + location.search + location.hash);
})();

(function () {
  var W = document.getElementById('inline_header_normal');
  if (!W) return;

  function pass() {
    var y = 0;
    var secs = W.querySelectorAll('._fixed_header_section');
    for (var i = 0; i < secs.length; i++) {
      var s = secs[i];
      var r = s.getBoundingClientRect();
      if (!r.height) continue;                      // 안 보이는 구역은 건너뜁니다
      var cs = getComputedStyle(s);
      if (cs.position === 'fixed') {
        s.style.setProperty('top', (y + (parseFloat(cs.top) || 0) - r.top) + 'px', 'important');
      }
      y += r.height;
    }
    return y;
  }

  function fix() {
    pass();
    var y = pass();
    var secs = W.querySelectorAll('._fixed_header_section');
    if (y && getComputedStyle(secs[0]).position === 'fixed') {
      W.style.setProperty('height', y + 'px', 'important');
    }
  }

  function unlock() {
    var bs = W.querySelectorAll('.login_btn .btn');
    for (var i = 0; i < bs.length; i++) {
      bs[i].style.removeProperty('padding');
      bs[i].style.removeProperty('font-size');
      bs[i].style.removeProperty('border-radius');
    }
  }

  var composing = false;
  document.addEventListener('compositionstart', function () { composing = true; }, true);
  document.addEventListener('compositionend', function () { composing = false; }, true);

  function typing() {
    if (composing) return true;
    var a = document.activeElement;
    return !!(a && (a.tagName === 'INPUT' || a.tagName === 'TEXTAREA'));
  }

  function run() { if (typing()) return; unlock(); fix(); }

  run();
  window.addEventListener('load', run);
  window.addEventListener('resize', run);
  if (window.ResizeObserver) {
    var roT = null;
    var ro = new ResizeObserver(function () {
      if (roT) clearTimeout(roT);
      roT = setTimeout(function () { if (!typing()) fix(); }, 150);
    });
    var secs = W.querySelectorAll('._fixed_header_section');
    for (var i = 0; i < secs.length; i++) ro.observe(secs[i]);
  }
  setTimeout(run, 300);
  setTimeout(run, 1200);
  setTimeout(run, 3000);
})();

(function () {
  var FIXED = ['모의고사', '수능특강', '수능특강 영어독해연습', '수능특강 라이트', '올림포스', '심화변형', '지문분석'];
  var HOT = ['공통영어 2', '고등영어 2', '공통영어 1', '고등영어 1', '영어독해와 작문'];
  function esc(t) { return String(t).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;'); }
  function wire(form) {
    var inp = form.querySelector('input[name="keyword"]');
    if (!inp || form.querySelector('.sl-hot')) return;
    var box = document.createElement('div');
    box.className = 'sl-hot';
    box.innerHTML = '<h6>인기 검색어</h6><div class="chips">' +
      FIXED.concat(HOT).map(function (w) {
        return '<a href="/search?keyword=' + encodeURIComponent(w) + '"><b>#</b>' + esc(w) + '</a>';
      }).join('') + '</div>';
    form.appendChild(box);
    var sec = form.closest ? form.closest('._fixed_header_section') : null;
    function lift(on) { if (sec) { if (on) sec.style.setProperty('z-index', '1001', 'important'); else sec.style.removeProperty('z-index'); } }
    function open() { if (!inp.value) { box.classList.add('on'); lift(true); } }
    function close() { box.classList.remove('on'); lift(false); }
    inp.addEventListener('focus', open);
    inp.addEventListener('click', open);
    inp.addEventListener('input', function () { if (inp.value) close(); else open(); });
    inp.addEventListener('keydown', function (e) { if (e.key === 'Escape') close(); });
    document.addEventListener('click', function (e) { if (!form.contains(e.target)) close(); });
  }
  function go() {
    var forms = document.querySelectorAll('#inline_header_normal form[action="/search"], #inline_header_normal form[action$="/search"]');
    for (var i = 0; i < forms.length; i++) wire(forms[i]);
  }
  go();
  window.addEventListener('load', go);
  setTimeout(go, 800);
})();

(function () {
  if (location.pathname.replace(/\/$/, '') !== '/search') return;
  var BASE = 'https://daechisecret.github.io/imweb-assets/';
  var V = '2c62c113';
  var css = document.createElement('link');
  css.rel = 'stylesheet'; css.href = BASE + 'search.css?v=' + V;
  document.head.appendChild(css);
  var js = document.createElement('script');
  js.src = BASE + 'search.js?v=' + V; js.defer = true;
  document.head.appendChild(js);
})();

(function () {
  var BASE = 'https://daechisecret.github.io/imweb-assets/';
  var V = '35fc2618';
  var done = false;
  function go() {
    if (done || !document.getElementById('prod_detail')) return;
    done = true;
    var css = document.createElement('link');
    css.rel = 'stylesheet'; css.href = BASE + 'product.css?v=' + V;
    document.head.appendChild(css);
    var js = document.createElement('script');
    js.src = BASE + 'product.js?v=' + V; js.defer = true;
    document.head.appendChild(js);
  }
  go();
  window.addEventListener('load', go);
  setTimeout(go, 500);
  setTimeout(go, 1600);
})();

(function () {
  var BASE = 'https://daechisecret.github.io/imweb-assets/';
  var V = '34f4dce8';
  var done = false;
  function go() {
    if (done) return;
    if (!document.querySelector('.widget.login, .widget.join, .widget.find_account')) return;
    done = true;
    var css = document.createElement('link');
    css.rel = 'stylesheet'; css.href = BASE + 'login.css?v=' + V;
    document.head.appendChild(css);
    var js = document.createElement('script');
    js.src = BASE + 'login.js?v=' + V; js.defer = true;
    document.head.appendChild(js);
  }
  go();
  window.addEventListener('load', go);
  setTimeout(go, 400);
  setTimeout(go, 1500);
})();

(function () {
  var BASE = 'https://daechisecret.github.io/imweb-assets/';
  var V = 'f76419b0';
  var done = false;
  function go() {
    if (done || !document.querySelector('.shop-content.mypage')) return;
    done = true;
    var css = document.createElement('link');
    css.rel = 'stylesheet'; css.href = BASE + 'mypage.css?v=' + V;
    document.head.appendChild(css);
    var js = document.createElement('script');
    js.src = BASE + 'mypage.js?v=' + V; js.defer = true;
    document.head.appendChild(js);
  }
  go();
  window.addEventListener('load', go);
  setTimeout(go, 400);
  setTimeout(go, 1500);
})();

(function () {
  function real(w) {
    var im = w.querySelector('img.normal_logo') || w.querySelector('img');
    return !!im && im.complete && im.naturalWidth >= 20;
  }
  function one() {
    var head = document.getElementById('inline_header_mobile');
    if (!head) return;
    var logos = [].slice.call(head.querySelectorAll('.widget.logo'));
    if (!logos.length) return;
    var pick = -1;
    for (var i = 0; i < logos.length; i++) { if (real(logos[i])) { pick = i; break; } }
    if (pick < 0) return;
    logos.forEach(function (w, i) {
      w.style.setProperty('display', i === pick ? 'block' : 'none', 'important');
    });
  }
  one();
  window.addEventListener('load', one);
  setTimeout(one, 500);
  setTimeout(one, 1800);
  setTimeout(one, 3500);
  document.addEventListener('load', function (e) {
    var t = e.target;
    if (t && t.tagName === 'IMG' && t.closest && t.closest('#inline_header_mobile .widget.logo')) one();
  }, true);
})();

(function () {
  function put() {
    var foot = document.querySelector('.footer-section, #doz_footer, footer');
    if (!foot || foot.querySelector('.sl-legal')) return;
    var box = document.createElement('div');
    box.className = 'sl-legal';
    box.innerHTML =
      '<a href="/?mode=policy" target="_blank" rel="noopener">이용약관</a>' +
      '<span class="sep">|</span>' +
      '<a href="/?mode=privacy" target="_blank" rel="noopener"><b>개인정보처리방침</b></a>' +
      '<span class="sep">|</span>' +
      '<a href="/faq">자주 묻는 질문</a>' +
      '<span class="sep">|</span>' +
      '<a href="/contact">문의하기</a>';
    var copy = null;
    foot.querySelectorAll('p, div, span, li').forEach(function (el) {
      var t = (el.textContent || '').trim();
      if (t.length < 140 && /copyright|all rights reserved/i.test(t)) copy = el;   /* 문서 차례상 마지막 = 가장 안쪽 */
    });
    if (copy) {
      var blk = copy;
      while (blk.parentElement && blk.parentElement !== foot && getComputedStyle(blk).display === 'inline') blk = blk.parentElement;
      blk.parentNode.insertBefore(box, blk.nextSibling);
    } else {
      (foot.querySelector('.footer-section') || foot).appendChild(box);
    }
  }
  put();
  window.addEventListener('load', put);
  setTimeout(put, 1500);
  setTimeout(put, 4000);
})();

(function () {
  var wrap = null, back = null, stage = null, count = null, list = [], at = -1, done = false;

  function no(el) {
    var m = /_(\d+)$/.exec(el.getAttribute('data-pop') || el.id || '');
    return m ? parseInt(m[1], 10) : 0;
  }

  function unpin(el) {
    var flat = { position: 'static', left: 'auto', right: 'auto', top: 'auto', bottom: 'auto',
                 margin: '0', 'margin-left': '0', width: '100%', transform: 'none', 'z-index': 'auto' };
    for (var k in flat) el.style.setProperty(k, flat[k], 'important');
  }

  function show(i) {
    for (var k = 0; k < list.length; k++) list[k].classList.toggle('sl-on', k === i);
    at = i;
    if (count) {
      count.textContent = list.length > 1 ? (i + 1) + ' / ' + list.length : '';
      count.style.display = list.length > 1 ? '' : 'none';
    }
  }

  function teardown() {
    if (back && back.parentNode) back.parentNode.removeChild(back);
    back = null; list = [];
  }

  function next() {
    list = list.filter(function (el) { return el.parentNode === stage; });
    if (!list.length) { teardown(); return; }
    show(at >= list.length ? list.length - 1 : Math.max(0, at));
  }

  function build() {
    if (done) return;
    wrap = document.querySelector('.popup-banner-wrap');
    if (!wrap) return;
    var pops = [].slice.call(wrap.querySelectorAll('.pop-container')).filter(function (el) {
      return el.offsetParent !== null || getComputedStyle(el).display !== 'none';
    });
    if (!pops.length) return;
    done = true;

    pops.sort(function (a, b) { return no(b) - no(a); });   /* 새로 등록하신 것이 먼저 */

    back = document.createElement('div');
    back.className = 'sl-pop';
    stage = document.createElement('div');
    stage.className = 'sl-pop-stage';
    back.appendChild(stage);
    count = document.createElement('div');
    count.className = 'sl-pop-count';
    stage.appendChild(count);

    pops.forEach(function (el) { unpin(el); stage.insertBefore(el, count); });
    list = pops;
    document.body.appendChild(back);
    show(0);

    if (window.MutationObserver) {
      new MutationObserver(function (ms) {
        for (var i = 0; i < ms.length; i++) if (ms[i].removedNodes.length) { next(); return; }
      }).observe(stage, { childList: true });
    }

    back.addEventListener('click', function (e) {
      if (e.target !== back) return;
      var cur = list[at];
      var btn = cur && (cur.querySelector('.btn-group .btn.right') || cur.querySelector('.pop-img a.del'));
      if (btn) btn.click(); else teardown();
    });
    document.addEventListener('keydown', function (e) {
      if (e.key !== 'Escape' || !back) return;
      var cur = list[at];
      var btn = cur && (cur.querySelector('.btn-group .btn.right') || cur.querySelector('.pop-img a.del'));
      if (btn) btn.click(); else teardown();
    });
  }

  function go() { try { build(); } catch (e) { fail(); } }
  function fail() {
    var w = document.querySelector('.popup-banner-wrap');
    if (w && !done) w.classList.add('sl-pop-off');
  }

  go();
  window.addEventListener('load', go);
  setTimeout(go, 300);
  setTimeout(go, 1200);
  setTimeout(fail, 3000);
})();

(function () {
  'use strict';
  if (window.__slHeartLogoB) return;
  window.__slHeartLogoB = true;
  var logo = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTI1NCIgaGVpZ2h0PSIxMjg3IiB2aWV3Qm94PSIwIDAgMTI1NCAxMjg3IiBmaWxsPSJub25lIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPgo8cmVjdCB3aWR0aD0iMTI1NCIgaGVpZ2h0PSIxMjg3IiBmaWxsPSJ3aGl0ZSIvPgo8cGF0aCBmaWxsLXJ1bGU9ImV2ZW5vZGQiIGNsaXAtcnVsZT0iZXZlbm9kZCIgZD0iTTEzMS4xNzYgNjI3LjQyOEMxMDQuMTggNjI0LjgxOSA4Ny41NjEyIDYxMS4wNzIgODMuOTk3MiA1ODguNDAyQzgyLjc1MzIgNTgwLjQ5MiA4Mi42MzMyIDM1Ny4wNzkgODMuODYzMiAzMzkuNDYyQzg0Ljc5NTIgMzI2LjEwNyA4Ni42MjYyIDMyMC45NzUgOTIuODgzMiAzMTQuMTg4Qzk1LjE0NDIgMzExLjczNCA5OS4zNDcyIDMwOC42NjMgMTAyLjIyMiAzMDcuMzYzTDEwNy40NDkgMzA1TDE3NS40NDkgMzA0Ljc1QzIyOC4yOTkgMzA0LjU1NiAyNDMuOTg1IDMwNC43NzkgMjQ1Ljg1MyAzMDUuNzVDMjQ3LjE3NSAzMDYuNDM4IDI0OS4yIDMwOC4yNjkgMjUwLjM1MyAzMDkuODIxQzI1Mi4zMyAzMTIuNDgxIDI1Mi40NjYgMzE0LjA3MyAyNTIuNzQ5IDMzNy43OTVDMjUzLjAwMiAzNTguOTY0IDI1Mi43OTYgMzYzLjYxMyAyNTEuNDQ4IDM2Ny4xNDNDMjQ4LjUyNyAzNzQuNzkxIDI0Ny45NTQgMzc0LjkzNCAyMTcuOTQ5IDM3NS41QzE5Mi4xNTYgMzc1Ljk4NyAxOTEuMzM2IDM3Ni4wNjUgMTg3LjE5OSAzNzguNDM0QzE4NC4yNzkgMzgwLjEwNyAxODIuMjQ1IDM4Mi4yOTcgMTgwLjY5OSAzODUuNDM0TDE3OC40NDkgMzkwVjQ2My41MjdWNTM3LjA1NEwxODAuOTc2IDU0Mi4wMjdDMTg0LjQ4NCA1NDguOTMgMTg5LjYzOSA1NTEuNTA1IDE5OS45MTEgNTUxLjQ4NUMyMTQuODUyIDU1MS40NTYgMjI5Ljc3MyA1NDYuMjg5IDI0NS4xNCA1MzUuODIzQzI0Ny4xNyA1MzQuNDQxIDI0OS4zMDggNTMzLjYwNCAyNDkuODkgNTMzLjk2NEMyNTAuNjAzIDUzNC40MDQgMjUwLjk0OSA1NDYuMjI5IDI1MC45NDkgNTcwLjE1OEMyNTAuOTQ5IDYwOS4zMTYgMjUwLjcxMSA2MTEuMDIxIDI0NC44MDcgNjE0LjA3M0MyMzkuOTAyIDYxNi42MSAyMTcuOTQ3IDYyMi4yMDQgMjA0LjM4OCA2MjQuMzcyQzE4MS4xMjEgNjI4LjA5MiAxNTEuMDM5IDYyOS4zNDggMTMxLjE3NiA2MjcuNDI4Wk0yNjkuMjUzIDYyNS41NDRDMjY3LjQ5NiA2MjQuNDcyIDI2NS4yNDYgNjIyLjM1NiAyNjQuMjUzIDYyMC44NDJDMjYyLjUzMyA2MTguMjE2IDI2Mi40NDkgNjEwLjU4MyAyNjIuNDQ5IDQ1Ny4wNDRDMjYyLjQ0OSAyODAuOTE4IDI2Mi4wNzYgMjkxLjY4NiAyNjguMzMxIDI4Ny4yMjRDMjcxLjM3OSAyODUuMDUgMjcyLjA5MyAyODUgMjk5Ljk0OSAyODVDMzI0LjkyNyAyODUgMzI4LjgzNCAyODUuMjExIDMzMS41NjQgMjg2LjcwNkMzMzcuNzE4IDI5MC4wNzYgMzM3Ljk0OSAyOTEuNjE2IDMzNy45NDkgMzI5LjI5NUMzMzcuOTQ5IDM2My41MTUgMzM3LjE4NiAzNzYuOTU5IDMzNC4zNjkgMzkyLjM3NEMzMzMuMTA5IDM5OS4yNjcgMzI5LjUzOSA0MTIuMTk0IDMyNy4yNDIgNDE4LjE3OUMzMjYuODM4IDQxOS4yMyAzMjkuMjkxIDQxOS41IDMzOS4yNjQgNDE5LjVIMzUxLjc5NEwzNTEuMjMzIDM2Mi42ODRDMzUwLjkyNSAzMzEuNDM0IDM1MC45ODkgMzAzLjMzMiAzNTEuMzc2IDMwMC4yMzRDMzUxLjc2OSAyOTcuMDkzIDM1My4wNjMgMjkzLjE0MSAzNTQuMzAyIDI5MS4zQzM1OC4zOTIgMjg1LjIyNCAzNTkuNjI0IDI4NSAzODguOTQ5IDI4NUM0MTguOTQyIDI4NSA0MjIuMTk5IDI4NS42MDMgNDI4LjAyNyAyOTIuMjQyQzQzNC4zNjIgMjk5LjQ1NiA0MzMuOTQ5IDI4Ny43ODggNDMzLjk0NSA0NTkuNzE4QzQzMy45NDIgNjE0Ljg5NyA0MzMuOTE1IDYxNy4wNDQgNDMxLjk1NCA2MjAuMjU5QzQzMC44NjEgNjIyLjA1MiA0MjguNTAxIDYyNC40MTIgNDI2LjcwOCA2MjUuNTA1QzQyMy42NDQgNjI3LjM3MyA0MjEuNjIxIDYyNy40OTMgMzkyLjk0OSA2MjcuNDk1QzM1OC43NyA2MjcuNDk3IDM1Ny40MDkgNjI3LjI1NiAzNTMuNDgzIDYyMC41QzM1MS41MTQgNjE3LjExMyAzNTEuNDQxIDYxNS4yNDYgMzUxLjE5NCA1NjIuNUMzNTEuMDUzIDUzMi41MjUgMzUwLjk0MSA1MDYuMDY2IDM1MC45NDQgNTAzLjcwMkwzNTAuOTQ5IDQ5OS40MDVMMzQ0LjY5OSA0OTkuNzAyTDMzOC40NDkgNTAwTDMzNy45NDkgNTYwLjE0NkMzMzcuNDY0IDYxOC40OTcgMzM3LjM4OSA2MjAuMzU3IDMzNS40NTEgNjIyLjQ5OEMzMzEuMDkgNjI3LjMxNiAzMjkuNzkgNjI3LjUgMzAwLjI0OSA2MjcuNDk2QzI3NC40NTggNjI3LjQ5MyAyNzIuMjE4IDYyNy4zNTIgMjY5LjI1MyA2MjUuNTQ0WiIgZmlsbD0iI0U0NTg3RSIvPgo8cGF0aCBmaWxsLXJ1bGU9ImV2ZW5vZGQiIGNsaXAtcnVsZT0iZXZlbm9kZCIgZD0iTTcwNC4wMiA2MzAuMjY5QzcwMi4xMDYgNjI5LjI5NiA2OTkuNTE0IDYyNi45NjUgNjk4LjI2MSA2MjUuMDg4TDY5NS45ODEgNjIxLjY3N0w2OTYuMjQxIDQ2Ni45MTJDNjk2LjUgMzEyLjM2IDY5Ni41MDMgMzEyLjE0MyA2OTguNTYyIDMwOS4zODVDNjk5LjY5NiAzMDcuODY2IDcwMS44NjYgMzA1LjY5NiA3MDMuMzg1IDMwNC41NjJDNzA2LjAzOSAzMDIuNTgxIDcwNy4zODkgMzAyLjUgNzM3LjkwMiAzMDIuNUg3NjkuNjU3TDc3NC41MjQgMzA1LjUwOUM3NzcuOTgxIDMwNy42NDYgNzgwLjEzMSAzMDkuOTU2IDc4MS45NDUgMzEzLjQ4Mkw3ODQuNSAzMTguNDQ3VjQ2OS40NzNDNzg0LjUgNjE4LjcwMiA3ODQuNDc2IDYyMC41NCA3ODIuNSA2MjMuODk1Qzc4MS40IDYyNS43NjMgNzc5LjIzIDYyOC4yMzggNzc3LjY3OCA2MjkuMzk1Qzc3NC45NTkgNjMxLjQyNCA3NzMuNjM1IDYzMS41MSA3NDEuMTc4IDYzMS43NjlDNzEwLjYxOCA2MzIuMDEzIDcwNy4xNzggNjMxLjg3NCA3MDQuMDIgNjMwLjI2OVpNNDUwLjkyMyA2MjUuMDc3TDQ0OCA2MjIuMTU0VjU4MC4yMTJDNDQ4IDUzOS4xNTMgNDQ4LjA0NCA1MzguMjE0IDQ1MC4wOTUgNTM1LjYwN0M0NTEuMjQ3IDUzNC4xNDIgNDU0LjA1OSA1MzEuOTkxIDQ1Ni4zNDUgNTMwLjgyN0M0NjUuMTYzIDUyNi4zMzMgNDc4LjgyMyA1MTYuMzQ0IDQ4Ni4wNzYgNTA5LjA4M0M0OTguNDkzIDQ5Ni42NTQgNTA2LjM2OCA0ODMuMzQzIDUxMS44ODEgNDY1LjQ2NkM1MTcuMjA3IDQ0OC4xOTMgNTE4LjIyOSA0MzkuNDQzIDUxOC43MzYgNDA2Ljc1TDUxOS4xOTggMzc3SDQ5MS4wNDlDNDU5LjM1NSAzNzcgNDU4LjQ4NSAzNzYuODMxIDQ1NS4wMSAzNzAuMDE5QzQ1My4xNjcgMzY2LjQwNyA0NTMgMzY0LjE0NiA0NTMuMDAyIDM0Mi43OUM0NTMuMDAzIDMxNy4xNzEgNDUzLjQ1NCAzMTQuODc1IDQ1OS4zMjYgMzEwLjU3MUM0NjIuMDM0IDMwOC41ODYgNDYzLjQwNCAzMDguNDk5IDQ5Mi4zMjYgMzA4LjQ3NEw1MjIuNSAzMDguNDQ4TDUyMyAyOTUuNDc0QzUyMy4zMDEgMjg3LjY2OSA1MjQuMDEgMjgxLjYwOCA1MjQuNzggMjgwLjI2QzUyNy43MSAyNzUuMTMyIDUyOC44OCAyNzUgNTcxLjUgMjc1QzYxNS4zNiAyNzUgNjE1LjM0OCAyNzQuOTk4IDYxOC4zNjUgMjgxLjM1N0M2MTkuNTg1IDI4My45MjcgNjIwIDI4Ny43MzMgNjIwIDI5Ni4zNDNWMzA3Ljg4NEw2NDcuOTI5IDMwOC4xOTJDNjc0LjM0MSAzMDguNDgzIDY3Ni4wMTEgMzA4LjYxMiA2NzguNjc5IDMxMC41NzFDNjg0LjU0MSAzMTQuODc0IDY4NC45OTkgMzE3LjE5OCA2ODQuOTc2IDM0Mi41QzY4NC45NTggMzYyLjkzMiA2ODQuNzQ0IDM2NS45NjcgNjgzLjA1NyAzNjkuNjg0QzY3OS43OTMgMzc2Ljg3MiA2NzkuMTM1IDM3NyA2NDUuNTUgMzc3SDYxNkw2MTYuMDAzIDM4OC4yNUM2MTYuMDE0IDQyMS44OTEgNjIyLjI4OSA0NDkuMzY2IDYzNC4xNTMgNDY3LjcwOUM2NDMuNTQ5IDQ4Mi4yMzcgNjUyLjg4NyA0OTAuMjk0IDY3MC40MTkgNDk5QzY3OC4wMDQgNTAyLjc2NiA2ODEuODg1IDUwNS4yODggNjgyLjczMyA1MDdDNjgzLjY2NiA1MDguODg0IDY4My45NzQgNTIxLjc2MSA2ODMuOTg1IDU1OS4zQzY4NC4wMDIgNjE0LjYxNCA2ODQuMDkzIDYxMy44MSA2NzcuNDY2IDYxNi41NzlDNjczLjA4MyA2MTguNDEgNjY4LjIxMSA2MTguMzczIDY1Ny44NiA2MTYuNDMyQzYzNi41OTkgNjEyLjQ0NCA2MDEuNTg2IDYwMC4zODIgNTk2Ljk1MiA1OTUuNDQ5QzU5NC43NDMgNTkzLjA5OCA1OTQuNTM0IDU5MS44NDggNTkzLjgxOCA1NzYuNzE1QzU5Mi44NjUgNTU2LjU4NSA1OTAuODU0IDU0My45NjYgNTg2LjQwMyA1MzAuMTg3QzU4Mi45ODQgNTE5LjYwMSA1NzguMTUxIDUwOS4xMDkgNTc4LjAyNSA1MTJDNTc3Ljc5NyA1MTcuMjcxIDU3NS41NzYgNTI4Ljc0NCA1NzMuMzc5IDUzNkM1NjcuODgzIDU1NC4xNTEgNTU5LjU2MiA1NjguMjU0IDU0Ni4wMTUgNTgyLjM3OEM1MjcuODI1IDYwMS4zNDQgNTA3LjE3MyA2MTQuMzgyIDQ4Mi40ODIgNjIyLjQ5QzQ3MS40MDMgNjI2LjEyNyA0NjMuMjYyIDYyNy45NjggNDU4LjE3MyA2MjcuOTg1QzQ1NC43MTMgNjI3Ljk5NyA0NTMuMjYxIDYyNy40MTUgNDUwLjkyMyA2MjUuMDc3WiIgZmlsbD0iI0U0NTg3RSIvPgo8cGF0aCBmaWxsLXJ1bGU9ImV2ZW5vZGQiIGNsaXAtcnVsZT0iZXZlbm9kZCIgZD0iTTg3My40MzggNjMwLjQ1OEM4MjguNDYzIDYyNi4zMjYgNzk5LjUgNjAxLjE1OSA3OTkuNSA1NjYuMjA3Qzc5OS41IDU0OS4wODEgODA0LjI2OSA1MzcuNjg4IDgxNi41ODcgNTI1LjM4NkM4MjIuNTU4IDUxOS40MjIgODI2LjE0NSA1MTYuODEgODMyLjc1OCA1MTMuNjA5Qzg0Mi42NDIgNTA4LjgyNSA4NTUuODQ4IDUwNS4yNTEgODcwLjU3MiA1MDMuMzc3Qzg4NS42MjggNTAxLjQ2IDEwNzQuMTQgNTAxLjQ1MSAxMDg2LjUgNTAzLjM2NkMxMTAwLjk2IDUwNS42MDggMTExMC41OSA1MDguNDUyIDExMjEuMzMgNTEzLjY1NUMxMTI5LjcxIDUxNy43MTkgMTEzMy4wMSA1MjAuMDA4IDExMzguODkgNTI1Ljg1NEMxMTQ3LjQxIDUzNC4zMjYgMTE1MS45MSA1NDEuOTE5IDExNTQuNTcgNTUyLjMxNEMxMTU5LjU1IDU3MS44MDIgMTE1My45NiA1OTAuMzM3IDExMzguNSA2MDUuNTQ5QzExMjYuMjcgNjE3LjU4NCAxMTA5LjU0IDYyNS4xODIgMTA4Ni40NSA2MjkuMTg2QzEwNzguMjEgNjMwLjYxNiAxMDY0LjYgNjMwLjg1OSA5ODAgNjMxLjA4MUM5MjYuNjUgNjMxLjIyMSA4NzguNjk3IDYzMC45NDEgODczLjQzOCA2MzAuNDU4Wk0xMDQyLjk1IDU3Ny40NEMxMDQ4LjQ3IDU3NS45MDggMTA1My4wOCA1NzEuMDIgMTA1My45NyA1NjUuNzQ3QzEwNTQuOTggNTU5Ljc0NSAxMDUxLjUxIDU1Mi45MjggMTA0NiA1NTAuMTAxQzEwNDIuMTIgNTQ4LjEwOCAxMDQwLjI2IDU0OC4wNDEgOTgxLjA4NyA1NDcuNzYyQzkzNy45NDggNTQ3LjU1OSA5MTguNTUzIDU0Ny44MTEgOTE0LjYyMSA1NDguNjI4QzkwNS4yMTkgNTUwLjU4IDkwMC4xOTYgNTU3Ljc4NCA5MDEuOTAxIDU2Ni44NzFDOTAyLjY2NCA1NzAuOTQxIDkwNy42NTIgNTc2LjIzOCA5MTEuODcxIDU3Ny40NjJDOTE2LjU1IDU3OC44MTggMTAzOC4wNiA1NzguNzk4IDEwNDIuOTUgNTc3LjQ0Wk04MTEuMTUzIDQ5MC40OTFDODA0LjIwNyA0ODkuMzM5IDc5OS4wNTggNDg1LjM4NSA3OTUuNzYxIDQ3OC42N0M3OTMuMjc5IDQ3My42MTYgNzkzIDQ3MS45ODkgNzkzIDQ2Mi41NDlDNzkzIDQ1My41NDUgNzkzLjMzNSA0NTEuMzY4IDc5NS4zNTIgNDQ3LjI3MkM3OTYuNjQ2IDQ0NC42NDQgNzk5LjIzMyA0NDEuMzI5IDgwMS4xIDQzOS45MDVDODA3Ljk4NyA0MzQuNjUyIDgwOC4xMjcgNDM0LjY0IDg2My43NSA0MzQuNTkzTDkxNS41IDQzNC41NDlWNDI4LjA0OVY0MjEuNTQ5TDg4My43NSA0MjEuNTQxQzg0NS4xNTUgNDIxLjUzMiA4MzcuNjk2IDQyMC44MTQgODI3LjkgNDE2LjE2MkM4MTkuNDkxIDQxMi4xNjggODEzLjk2MyA0MDYuODk1IDgxMC4zMjQgMzk5LjM5M0M4MDUuOTg2IDM5MC40NTEgODA1LjUgMzg1LjU5IDgwNS41IDM1MS4xNzhDODA1LjUgMzE1Ljc1MyA4MDUuODM3IDMxMy4yMzYgODExLjQ5MyAzMDYuMzczQzgxNS4xODcgMzAxLjg5MiA4MTkuOTY3IDI5OS42MDMgODI3LjgzNiAyOTguNTQ2QzgzNi44OCAyOTcuMzMxIDEwMjMuMTkgMjk2LjQ4IDEwODYgMjk3LjM2N0MxMTQ1LjEyIDI5OC4yMDEgMTE0NC4yNyAyOTguMTA5IDExNTAuODQgMzA0LjM1MkMxMTU2LjM3IDMwOS42MSAxMTU3IDMxMS44NiAxMTU3IDMyNi41NDlDMTE1NyAzMzUuMzYgMTE1Ni41MyAzNDEuMzgxIDExNTUuNjQgMzQzLjg4NUMxMTUzLjc3IDM0OS4xODkgMTE0OC44NSAzNTQuNDkgMTE0My41IDM1Ni45NjZDMTEzOS4wNCAzNTkuMDMyIDExMzguMSAzNTkuMDUxIDEwMjggMzU5LjMwNkw5MTcgMzU5LjU2M0w5MTUuMjUgMzYxLjY2N0M5MTIuODM5IDM2NC41NjYgOTEzLjA1OSAzNjcuMTk5IDkxNS45NTUgMzcwLjA5NEw5MTguNDA5IDM3Mi41NDlIMTAyOC4yN0MxMTQ5LjU4IDM3Mi41NDkgMTE0NC45OSAzNzIuMzE3IDExNTEuMjIgMzc4Ljc3MkMxMTUyLjk2IDM4MC41NzQgMTE1NC44NSAzODMuMzE2IDExNTUuNDQgMzg0Ljg2NEMxMTU2Ljg1IDM4OC42MDYgMTE1Ni43OSA0MDAuODQ1IDExNTUuMzQgNDA1LjY5MUMxMTUzLjc2IDQxMC45NzEgMTE0OC40MyA0MTYuOTI3IDExNDMuMjcgNDE5LjE4MUMxMTM5LjI5IDQyMC45MjEgMTEzNS4wOSA0MjEuMDY5IDEwODIgNDIxLjM0NEwxMDI1IDQyMS42MzhMMTAyNS4xNCA0MjcuODQ0TDEwMjUuMjkgNDM0LjA0OUwxMDg1LjA4IDQzNC4yNDRDMTEyNi45OCA0MzQuMzggMTE0Ni4zNSA0MzQuNzkyIDExNDkuOCA0MzUuNjJDMTE1NS41NiA0MzcuMDAyIDExNjAuNzIgNDQxLjE3NSAxMTYzLjgxIDQ0Ni45NTRDMTE2NS43IDQ1MC40OTQgMTE2NiA0NTIuNjA3IDExNjUuOTggNDYyLjU0OUMxMTY1Ljk3IDQ3Mi4zNTUgMTE2NS42NSA0NzQuNjM4IDExNjMuODMgNDc4LjA0OUMxMTYxLjA0IDQ4My4yNjkgMTE1OC4wOSA0ODUuOTM3IDExNTEuOTkgNDg4Ljc1TDExNDcgNDkxLjA0OUw5ODEuNSA0OTEuMTcyQzg5MC40NzUgNDkxLjIzOSA4MTMuODE5IDQ5MC45MzMgODExLjE1MyA0OTAuNDkxWiIgZmlsbD0iI0U0NTg3RSIvPgo8cGF0aCBmaWxsLXJ1bGU9ImV2ZW5vZGQiIGNsaXAtcnVsZT0iZXZlbm9kZCIgZD0iTTM2OC45NjQgOTkxLjQ0N0MzMzguMDc2IDk4OC42MjIgMzMzLjY5IDk4Ny42NDkgMzI4Ljg4NiA5ODIuNTU1QzMyNy4xNzYgOTgwLjc0MiAzMjUuMjQxIDk3Ny4zMDMgMzI0LjU4NiA5NzQuOTE0QzMyMy42ODUgOTcxLjYyNiAzMjMuNDY1IDkzNi41ODMgMzIzLjY4IDgzMC44OTJMMzIzLjk2NCA2OTEuMjE1TDMyNi4wNTYgNjg4LjM5MkMzMjcuMjA3IDY4Ni44MzkgMzI5LjY1OSA2ODQuNTQxIDMzMS41MDUgNjgzLjI4NEwzMzQuODYyIDY4MUwzNzEuNDkyIDY4MS4yODRMNDA4LjEyMyA2ODEuNTY5TDQxMS43MDQgNjg0LjMwMkM0MTkgNjg5Ljg2OSA0MTguNTQ4IDY3OS4yNjIgNDE4LjI0IDgzNy41NjlDNDE3Ljk4IDk3MS40NjggNDE3Ljg2MyA5NzkuNzU1IDQxNi4xODYgOTgyLjgyM0M0MTUuMjA4IDk4NC42MTMgNDEyLjU0MyA5ODcuMzEzIDQxMC4yNjMgOTg4LjgyM0M0MDYuMTgzIDk5MS41MjUgNDA1Ljg1IDk5MS41NzEgMzg5LjU0IDk5MS42OTFDMzgwLjQyMyA5OTEuNzU4IDM3MS4xNjQgOTkxLjY0OSAzNjguOTY0IDk5MS40NDdaTTc4LjUzNDggOTg0LjM0N0M3Ni42NDg4IDk4My4zNjkgNzQuMTczOCA5ODEuMjk1IDczLjAzNDggOTc5LjczOEM3MS4wMzE4IDk3Ny4wMDEgNzAuOTY0OCA5NzUuNzYzIDcxLjAwNzggOTQyLjIzOEM3MS4wNjE4IDg5OS4zMiA3MC4zODk4IDkwMS42NTEgODQuNDYzOCA4OTUuNTQzQzEyNi41OSA4NzcuMjYyIDE1NC4yOTQgODQ0Ljc2IDE2My4zMDMgODAzLjA0OEMxNjYuNTQ5IDc4OC4wMjEgMTY3LjQ0MyA3NzIuMzQ3IDE2Ny40NTQgNzMwLjI2OUMxNjcuNDY1IDY4Ny42MjEgMTY3LjQ3MSA2ODcuNTY4IDE3My4wNzkgNjgzLjE1N0MxNzUuNjc2IDY4MS4xMTQgMTc2LjY1IDY4MS4wNjkgMjE4LjEzNCA2ODEuMDY5QzI1Ni4zOTkgNjgxLjA2OSAyNjAuNzg4IDY4MS4yMzUgMjYzLjEzNiA2ODIuNzczQzI2OC4zMDggNjg2LjE2MyAyNjguNDY0IDY4Ny42MjQgMjY4LjQ2NCA3MzIuNzkzQzI2OC40NjQgNzc4Ljg5IDI2OS40OTMgNzkzLjA0MyAyNzMuOTY2IDgwOC40NzhDMjgwLjA5NSA4MjkuNjI4IDI5MC4yMDIgODQ1LjE1NiAzMDUuMTk2IDg1Ni40NThDMzA5LjEzOSA4NTkuNDMgMzEyLjIyNyA4NjIuNjUxIDMxMy4wNzMgODY0LjY3NUMzMTUuMDk2IDg2OS41MTggMzE1LjEyMyA5NjQuNTc3IDMxMy4xMDIgOTY5LjM1MUMzMDkuODggOTc2Ljk2MyAzMDUuOTc0IDk3Ny44NDggMjkwLjA2OSA5NzQuNTcxQzI2OC40MDYgOTcwLjEwOCAyMzguNjU1IDk1OS4zNDQgMjMyLjk4IDk1My45MTdMMjI5Ljk5NiA5NTEuMDYyTDIyOS4zMTUgOTMyLjc1MUMyMjguNTM1IDkxMS43NTYgMjI2LjcxMyA4OTkuNjkgMjIyLjMyMyA4ODYuNDUzQzIxNy42ODUgODcyLjQ2NiAyMTYuODk5IDg3MS45ODIgMjE2LjE4NSA4ODIuNjc0QzIxNC43NzggOTAzLjc1NCAyMDMuOTIzIDkyNC42MTEgMTg0LjY1MiA5NDMuMjY1QzE2My45OTcgOTYzLjI1NyAxMzguNDQxIDk3Ni4xMDYgMTA2LjQ2NCA5ODIuNTc2Qzg5LjEzODggOTg2LjA4MiA4Mi42NzI4IDk4Ni40OTIgNzguNTM0OCA5ODQuMzQ3WiIgZmlsbD0iI0U0NTg3RSIvPgo8cGF0aCBmaWxsLXJ1bGU9ImV2ZW5vZGQiIGNsaXAtcnVsZT0iZXZlbm9kZCIgZD0iTTQ0Mi45MSA5ODkuMDA2QzQzOC4yMDEgOTg3LjQyOSA0MzUuMTE5IDk4NC43NjUgNDMzLjA0NSA5ODAuNDhDNDMxLjEyMiA5NzYuNTA3IDQzMC45OTYgOTc0LjQ0MyA0MzEgOTQ2LjgxM0M0MzEuMDAzIDkxOS40MDIgNDMxLjEzNyA5MTcuMTU5IDQzMi45NTIgOTE0LjE4M0M0MzQuMDI0IDkxMi40MjYgNDM2LjA3MSA5MTAuMjIxIDQzNy41MDIgOTA5LjI4M0M0NDAuNDAyIDkwNy4zODMgNDQ0LjM0MyA5MDcuNDcyIDQ4Mi40OTYgOTEwLjMwM0M1MjguNzY1IDkxMy43MzYgNTUwLjI3MSA5MTQuMzc3IDYxNy45OTYgOTE0LjM0QzY2NC44NjQgOTE0LjMxNSA3MDAuMzU1IDkxMy43NTUgNzMwLjM4MiA5MTIuNTY4Qzc3NC4xNjggOTEwLjgzNyA3NzQuMjc5IDkxMC44MzcgNzc4LjQ0OCA5MTIuODU2Qzc4MS4xMjkgOTE0LjE1MyA3ODMuNDExIDkxNi4yNzMgNzg0LjgxMiA5MTguNzY1Qzc4Ni44OTggOTIyLjQ3OCA3ODYuOTk2IDkyMy43ODkgNzg2Ljk5NiA5NDguMTA4Qzc4Ni45OTYgOTcyLjY4MiA3ODYuOTE3IDk3My43MTcgNzg0LjcwOCA5NzcuOTcyQzc4My4wMTMgOTgxLjIzNiA3ODEuMTgxIDk4Mi45OTggNzc3LjY0MiA5ODQuNzY3TDc3Mi44NjQgOTg3LjE1NUw3MjEuNjggOTg3Ljk1MkM2NDAuMDUyIDk4OS4yMjQgNDQ1Ljc1MyA5ODkuOTU4IDQ0Mi45MSA5ODkuMDA2Wk02NzYuNzA2IDkwMi4wMTFDNjY1LjA4NSA5MDEuMzMgNjYzLjU3NyA5MDAuNTgyIDY2NC4zNDkgODk1Ljg3OUM2NjQuNTc1IDg5NC41MDQgNjY1LjcxOCA4ODkuNzk2IDY2Ni44OTEgODg1LjQxN0M2NjkuMjg3IDg3Ni40NjcgNjcxLjk5NiA4NTYuNDIyIDY3MS45OTYgODQ3LjY0MVY4NDEuODQ0TDU2MS4xNjIgODQxLjk4N0M0NTcuMTEgODQyLjEyMiA0NTAuMTAxIDg0Mi4wMjIgNDQ2LjYwNiA4NDAuMzY0QzQzNy45MjUgODM2LjI0NSA0MzUuNSA4MjguMjkyIDQzNi4yNDUgODA2LjM3OUM0MzYuODc4IDc4Ny43NjQgNDM4Ljk0NyA3ODIuNjg1IDQ0Ny40OTYgNzc4Ljc2QzQ1MS4yOTUgNzc3LjAxNSA0NTYuNzIyIDc3Ni45MjIgNTU1LjUzNCA3NzYuOTAxTDY1OS41NzIgNzc2Ljg3OUw2NjQuMDM0IDc3NC42MjlDNjc0Ljc5OSA3NjkuMjAxIDY3NC43NjQgNzUzLjA1MSA2NjMuOTc2IDc0Ny42MzFDNjYwLjczIDc0NiA2NTMuNDYzIDc0NS44ODEgNTU1Ljk5NiA3NDUuODU5QzQ1Ni40MzQgNzQ1LjgzNiA0NTEuMzAzIDc0NS43NDggNDQ3LjQxNyA3NDMuOTgzQzQ0Mi42NjcgNzQxLjgyNSA0MzkuNDM5IDczOC4wODggNDM3LjkwNiA3MzIuOTcyQzQzNy4yNDMgNzMwLjc1OSA0MzYuOTQ5IDcyMi44ODQgNDM3LjE1NiA3MTIuODU3QzQzNy40OCA2OTcuMTM0IDQzNy42MTggNjk2LjE3MiA0NDAuMTQ4IDY5MS44NjhDNDQxLjc4MiA2ODkuMDkgNDQ0LjQ2OSA2ODYuNDAyIDQ0Ny4xNDggNjg0Ljg2OEw0NTEuNDk2IDY4Mi4zNzlMNTkzLjI4MiA2ODIuMTE2Qzc0Ny45NzQgNjgxLjgyOCA3NDEuNTU1IDY4MS42MTMgNzUzLjI1NSA2ODcuNDg1Qzc2NC40NSA2OTMuMTAzIDc3MS4yOTMgNzAxLjA3NyA3NzUuMjY2IDcxMy4xMzFDNzc3LjEyOCA3MTguNzggNzc3LjM2OCA3MjIuNDY5IDc3Ny43NjMgNzUxLjYyMUM3NzguMjE0IDc4NC44NiA3NzYuNzQ3IDgzNS4xMjQgNzc0LjkzIDg0OC42ODJDNzcwLjk3MiA4NzguMjA4IDc1OS4zMzEgODk0LjQ0MiA3MzcuNzQgOTAwLjU0NUM3MzEuODIxIDkwMi4yMTkgNjk1LjIzOSA5MDMuMDk3IDY3Ni43MDYgOTAyLjAxMVoiIGZpbGw9IiNFNDU4N0UiLz4KPHBhdGggZmlsbC1ydWxlPSJldmVub2RkIiBjbGlwLXJ1bGU9ImV2ZW5vZGQiIGQ9Ik0xMDg0LjUgOTk2LjE5NkMxMDYzLjk4IDk5NC42NDUgMTA0MS42NyA5OTAuNTc5IDEwMjcgOTg1LjcxM0MxMDA1LjAyIDk3OC40MjMgOTg0Ljk1OSA5NjYuNjI3IDk3MC42MDcgOTUyLjU1TDk2Mi43MTUgOTQ0LjgwOUw5NTUuNTkxIDk1MS41NUM5NTEuNjc0IDk1NS4yNTggOTQ0LjY1IDk2MC44MTkgOTM5Ljk4NCA5NjMuOTA4QzkwOS4yNDIgOTg0LjI1OSA4NzAuNDMxIDk5NC45MiA4MjYuOTU2IDk5NC45NTRDODA4LjA5MyA5OTQuOTY5IDgwNC4zNDggOTk0LjA1MiA4MDEuMDI2IDk4OC42MDJDNzk5LjEyMSA5ODUuNDc4IDc5OS4wMDcgOTgzLjYxOCA3OTkuMDA0IDk1NS40OTJDNzk5IDkyMi44OTggNzk5LjI4NiA5MjEuMDY2IDgwNC43MDMgOTE5LjAxNEM4MDYuMjQxIDkxOC40MzEgODE0LjI3MiA5MTcuNzE0IDgyMi41NDggOTE3LjQyMUM4NTYuMDI1IDkxNi4yMzUgODgzLjQ2NiA5MDkuNDY1IDkwNC4zMDkgODk3LjI1QzkxMi41OTIgODkyLjM5NyA5MjUuNTkyIDg4MC44MDcgOTI5LjA3NCA4NzUuMTcyTDkzMS4xNjMgODcxLjc5Mkg5NzNDOTk2LjAxIDg3MS43OTIgMTAxNS41MyA4NzIuMDU2IDEwMTYuMzcgODcyLjM3OUMxMDE3LjIxIDg3Mi43MDIgMTAxOC42MyA4NzUuMTczIDEwMTkuNTIgODc3Ljg2OUMxMDIwLjQyIDg4MC41NjUgMTAyMy4zIDg4Ni4wMzggMTAyNS45MyA4OTAuMDMxQzEwMzkuMTUgOTEwLjEzOCAxMDYyLjE1IDkyMy45MTMgMTA5NC45MyA5MzEuMzU1QzExMDAuNjcgOTMyLjY1NyAxMTA1Ljk2IDkzNC4zMjUgMTEwNi43IDkzNS4wNjFDMTEwNy40MyA5MzUuNzk2IDExMDkuNDEgOTQxLjU0OSAxMTExLjA5IDk0Ny44NDVDMTExMi43NyA5NTQuMTQxIDExMTYuNjQgOTY1LjkzNyAxMTE5LjY4IDk3NC4wNTlDMTEyMy4yNSA5ODMuNTkxIDExMjUgOTg5LjY0NiAxMTI0LjYzIDk5MS4xMzhDMTEyNC4zMSA5OTIuNDA5IDExMjIuODEgOTk0LjAxNCAxMTIxLjI5IDk5NC43MDVDMTExOC41MSA5OTUuOTcxIDEwOTQuNDMgOTk2Ljk0NiAxMDg0LjUgOTk2LjE5NlpNMTAzOC41IDg3OS41MjFDMTAzNS44NiA4NzguMDQ3IDEwMzMuNzMgODc1Ljc2MyAxMDMyLjI1IDg3Mi44MjZMMTAzMCA4NjguMzY4TDEwMzAuMDIgNzgwLjMzQzEwMzAuMDQgNjk2LjYzNiAxMDMwLjE0IDY5Mi4wOSAxMDMxLjkgNjg4LjE5M0MxMDMyLjkzIDY4NS45MzkgMTAzNS4yOCA2ODMuMDE0IDEwMzcuMTMgNjgxLjY5M0wxMDQwLjUgNjc5LjI5MkwxMDc5IDY3OS4wMTVDMTExNy4zNiA2NzguNzQgMTExNy41MiA2NzguNzQ3IDExMjEuOTQgNjgxLjAxNUMxMTI3LjE3IDY4My42OTQgMTEyOS43OSA2ODYuOTY1IDExMzEuMDQgNjkyLjM2OUMxMTMyLjI0IDY5Ny41MTQgMTEzMi4yNCA4NjMuMDcgMTEzMS4wNCA4NjguMjE1QzExMjkuNzkgODczLjYxMSAxMTI3LjE3IDg3Ni44OTIgMTEyMS45OCA4NzkuNTQyQzExMTcuNjQgODgxLjc1OCAxMTE3LjAxIDg4MS43OTIgMTA4MC4wNCA4ODEuNzc2QzEwNDMuMDQgODgxLjc1OSAxMDQyLjQ0IDg4MS43MjcgMTAzOC41IDg3OS41MjFaTTgwNy41IDg2MC44NTdDNzk5Ljk4MSA4NTkuMDI2IDc5NC4yOTcgODU0LjAyMyA3OTEuODM2IDg0Ny4wNjdDNzkwLjgwMSA4NDQuMTQyIDc5MC41IDgzMy42MTcgNzkwLjUgODAwLjI5MkM3OTAuNSA3NjIuMTU1IDc5MC42ODcgNzU2Ljk1MyA3OTIuMTU1IDc1NC4yOTJDNzk0LjU4OCA3NDkuODgyIDc5Ny45ODUgNzQ3LjEyNCA4MDIuNSA3NDUuODkzQzgwNS4xNDIgNzQ1LjE3MyA4MjMuODQxIDc0NC44MDEgODU3LjU5NSA3NDQuNzk4QzkwNS44MjEgNzQ0Ljc5MiA5MDguNzgzIDc0NC42ODkgOTEwLjM0NSA3NDIuOTYzQzkxMi4zNDUgNzQwLjc1NCA5MTIuNTkzIDczMi41MjkgOTEwLjcwNyA3MzAuOTY0QzkwOS44MzIgNzMwLjIzOCA4OTIuMTMxIDcyOS43OTQgODU1Ljk1NyA3MjkuNTkxQzgwNC44MjUgNzI5LjMwNSA4MDIuMzI2IDcyOS4yMDUgNzk4LjUgNzI3LjI5MkM3OTUuNzA2IDcyNS44OTUgNzkzLjgyMSA3MjMuOTQ2IDc5Mi4yNSA3MjAuODNDNzkwLjMxOCA3MTcgNzkwIDcxNC43OTIgNzkwIDcwNS4yMjlDNzkwIDY5Mi45MTggNzkwLjk5IDY4OC43MDEgNzk0Ljg4NiA2ODQuNDE5QzgwMC4xNTcgNjc4LjYyNiA3OTkuMTU0IDY3OC43MjMgODY1LjQwOCA2NzcuNTY1QzkwNy41NDYgNjc2LjgyOCA5MzcuODI0IDY3Ni44MTIgOTYzIDY3Ny41MTRDMTAwMi40MiA2NzguNjEyIDEwMDQuMjIgNjc4Ljg3NiAxMDA5LjI3IDY4NC4zMjRDMTAxMy44NyA2ODkuMjg4IDEwMTQuMTUgNjkyLjQyMyAxMDEzLjgxIDczNS4zMDRDMTAxMy41MSA3NzMuOTYyIDEwMTMuNDMgNzc1LjQyNSAxMDExLjM2IDc3OS4yOTJDMTAwOC43MyA3ODQuMjAyIDEwMDYuNTIgNzg2LjI2IDEwMDEuNzUgNzg4LjI1NEM5OTguNTc0IDc4OS41NzkgOTg5Ljg5MyA3ODkuNzkyIDkzOS4wMzIgNzg5Ljc5MkM4ODEuMzMzIDc4OS43OTIgODc5Ljk1NSA3ODkuODM3IDg3OCA3OTEuNzkyQzg3NS42MTggNzk0LjE3NCA4NzUuMzAyIDgwMC40NTUgODc3LjQxOSA4MDMuMzUxQzg3OC43OTIgODA1LjIyOSA4ODAuOTU2IDgwNS4zMDggOTQ0LjAwMiA4MDUuNzkyTDEwMDkuMTYgODA2LjI5MkwxMDEyLjA4IDgwOS41NThMMTAxNSA4MTIuODI0TDEwMTUgODMyLjU1OEMxMDE0Ljk5IDg1MC41ODcgMTAxNC44MiA4NTIuNTc4IDEwMTIuOTcgODU1LjYwMkMxMDA5LjAyIDg2Mi4wODMgMTAxMy45IDg2MS44MDIgOTA3LjI4MiA4NjEuNjlDODU0LjA1MiA4NjEuNjMzIDgwOS4xNSA4NjEuMjU5IDgwNy41IDg2MC44NTdaIiBmaWxsPSIjRTQ1ODdFIi8+CjxwYXRoIGZpbGwtcnVsZT0iZXZlbm9kZCIgY2xpcC1ydWxlPSJldmVub2RkIiBkPSJNMTE0NC41MiA5ODUuMzE3QzExNDIuMTIgOTgzLjUwOCAxMTMxLjI1IDk1OS45NDYgMTEyNy40MiA5NDguMjU3QzExMjIuOTUgOTM0LjU5OCAxMTIxLjU3IDkyNi4yOTIgMTEyMi4xMSA5MTYuMjk2QzExMjIuNjIgOTA2LjkgMTEyNC45NSA5MDAuNzU3IDExMjkuODYgODk1Ljg0NkMxMTQ1LjAyIDg4MC42OTIgMTE2OS40NCA4ODguNjE5IDExNzMuMzMgOTA5Ljk1MUwxMTc0LjAyIDkxMy43NTZMMTE3Ny4zOCA5MTAuODA3QzExODEuNzUgOTA2Ljk2NyAxMTg2Ljk5IDkwNS4yNDEgMTE5NC40MSA5MDUuMTkyQzExOTkuMTkgOTA1LjE2MSAxMjAxLjM2IDkwNS43MDkgMTIwNS4wNSA5MDcuODhDMTIxMC4yOCA5MTAuOTUxIDEyMTQuNTYgOTE1LjU5IDEyMTYuNTYgOTIwLjM2NEMxMjE3LjMgOTIyLjEzNCAxMjE3LjkxIDkyNi40NDkgMTIxNy45MSA5MjkuOTU0QzEyMTcuOTEgOTM1LjA2NCAxMjE3LjMgOTM3LjU0MiAxMjE0Ljg0IDk0Mi40NjJDMTIwOC45IDk1NC4zNjIgMTE4OS40NiA5NjguODQ0IDExNjQuOTUgOTc5LjYyN0MxMTUyLjQ5IDk4NS4xMTEgMTE0Ni40NyA5ODYuNzg3IDExNDQuNTIgOTg1LjMxN1oiIGZpbGw9IiNFNDU4N0UiLz4KPC9zdmc+Cg==';
  var roots = '#inline_header_normal .widget.logo img, #inline_header_mobile .widget.logo img';
  var originals = /\/20260822\/(?:15f571ed8ba89|bd1ed1c38763f)\.png(?:[?#]|$)/;
  var css = document.createElement('style');
  css.id = 'sl-heart-logo-b';
  css.textContent = `
    html #inline_header_normal .widget.logo img.normal_logo[data-sl-heart-logo],
    html #inline_header_normal .widget.logo img.scroll_logo[data-sl-heart-logo],
    html #inline_header_mobile .widget.logo a img.normal_logo[data-sl-heart-logo],
    html #inline_header_mobile .widget.logo a img.scroll_logo[data-sl-heart-logo] {
      width: calc(var(--sl-heart-logo-height) * 1254 / 815) !important;
      height: var(--sl-heart-logo-height) !important;
      max-width: none !important;
      max-height: none !important;
      object-fit: cover !important;
      object-position: 50% 49% !important;
      image-rendering: auto !important;
    }
    #inline_header_normal .widget.logo img[data-sl-heart-logo] { --sl-heart-logo-height: 92px; }
    #inline_header_mobile .widget.logo img[data-sl-heart-logo] { --sl-heart-logo-height: 44px; }
    @media (max-width: 1360px) {
      #inline_header_normal .widget.logo img[data-sl-heart-logo] { --sl-heart-logo-height: 72px; }
    }
    @media (max-width: 860px) {
      #inline_header_normal .widget.logo img[data-sl-heart-logo] { --sl-heart-logo-height: 52px; }
    }
  `;
  function replace() {
    if (!css.isConnected) document.head.appendChild(css);
    document.querySelectorAll(roots).forEach(function (img) {
      if (!originals.test(img.getAttribute('src') || '')) return;
      img.removeAttribute('srcset');
      img.setAttribute('data-sl-heart-logo', 'b');
      img.alt = '대치동시크릿';
      img.src = logo;
    });
  }
  var preload = new Image();
  preload.onload = function () {
    replace();
    document.addEventListener('DOMContentLoaded', replace, { once: true });
    window.addEventListener('pageshow', replace);
    document.addEventListener('load', function (event) {
      if (event.target.matches && event.target.matches(roots) &&
          originals.test(event.target.getAttribute('src') || '')) replace();
    }, true);
  };
  preload.src = logo;
})();