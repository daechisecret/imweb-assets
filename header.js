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
  var logo = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTI1NCIgaGVpZ2h0PSIxMjg3IiB2aWV3Qm94PSIwIDAgMTI1NCAxMjg3IiBmaWxsPSJub25lIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPg0KPHJlY3Qgd2lkdGg9IjEyNTQiIGhlaWdodD0iMTI4NyIgZmlsbD0id2hpdGUiLz4NCjxwYXRoIGZpbGwtcnVsZT0iZXZlbm9kZCIgY2xpcC1ydWxlPSJldmVub2RkIiBkPSJNMTMxLjE3NiA2MjcuNDI4QzEwNC4xOCA2MjQuODE5IDg3LjU2MTIgNjExLjA3MiA4My45OTcyIDU4OC40MDJDODIuNzUzMiA1ODAuNDkyIDgyLjYzMzIgMzU3LjA3OSA4My44NjMyIDMzOS40NjJDODQuNzk1MiAzMjYuMTA3IDg2LjYyNjIgMzIwLjk3NSA5Mi44ODMyIDMxNC4xODhDOTUuMTQ0MiAzMTEuNzM0IDk5LjM0NzIgMzA4LjY2MyAxMDIuMjIyIDMwNy4zNjNMMTA3LjQ0OSAzMDVMMTc1LjQ0OSAzMDQuNzVDMjI4LjI5OSAzMDQuNTU2IDI0My45ODUgMzA0Ljc3OSAyNDUuODUzIDMwNS43NUMyNDcuMTc1IDMwNi40MzggMjQ5LjIgMzA4LjI2OSAyNTAuMzUzIDMwOS44MjFDMjUyLjMzIDMxMi40ODEgMjUyLjQ2NiAzMTQuMDczIDI1Mi43NDkgMzM3Ljc5NUMyNTMuMDAyIDM1OC45NjQgMjUyLjc5NiAzNjMuNjEzIDI1MS40NDggMzY3LjE0M0MyNDguNTI3IDM3NC43OTEgMjQ3Ljk1NCAzNzQuOTM0IDIxNy45NDkgMzc1LjVDMTkyLjE1NiAzNzUuOTg3IDE5MS4zMzYgMzc2LjA2NSAxODcuMTk5IDM3OC40MzRDMTg0LjI3OSAzODAuMTA3IDE4Mi4yNDUgMzgyLjI5NyAxODAuNjk5IDM4NS40MzRMMTc4LjQ0OSAzOTBWNDYzLjUyN1Y1MzcuMDU0TDE4MC45NzYgNTQyLjAyN0MxODQuNDg0IDU0OC45MyAxODkuNjM5IDU1MS41MDUgMTk5LjkxMSA1NTEuNDg1QzIxNC44NTIgNTUxLjQ1NiAyMjkuNzczIDU0Ni4yODkgMjQ1LjE0IDUzNS44MjNDMjQ3LjE3IDUzNC40NDEgMjQ5LjMwOCA1MzMuNjA0IDI0OS44OSA1MzMuOTY0QzI1MC42MDMgNTM0LjQwNCAyNTAuOTQ5IDU0Ni4yMjkgMjUwLjk0OSA1NzAuMTU4QzI1MC45NDkgNjA5LjMxNiAyNTAuNzExIDYxMS4wMjEgMjQ0LjgwNyA2MTQuMDczQzIzOS45MDIgNjE2LjYxIDIxNy45NDcgNjIyLjIwNCAyMDQuMzg4IDYyNC4zNzJDMTgxLjEyMSA2MjguMDkyIDE1MS4wMzkgNjI5LjM0OCAxMzEuMTc2IDYyNy40MjhaTTI2OS4yNTMgNjI1LjU0NEMyNjcuNDk2IDYyNC40NzIgMjY1LjI0NiA2MjIuMzU2IDI2NC4yNTMgNjIwLjg0MkMyNjIuNTMzIDYxOC4yMTYgMjYyLjQ0OSA2MTAuNTgzIDI2Mi40NDkgNDU3LjA0NEMyNjIuNDQ5IDI4MC45MTggMjYyLjA3NiAyOTEuNjg2IDI2OC4zMzEgMjg3LjIyNEMyNzEuMzc5IDI4NS4wNSAyNzIuMDkzIDI4NSAyOTkuOTQ5IDI4NUMzMjQuOTI3IDI4NSAzMjguODM0IDI4NS4yMTEgMzMxLjU2NCAyODYuNzA2QzMzNy43MTggMjkwLjA3NiAzMzcuOTQ5IDI5MS42MTYgMzM3Ljk0OSAzMjkuMjk1QzMzNy45NDkgMzYzLjUxNSAzMzcuMTg2IDM3Ni45NTkgMzM0LjM2OSAzOTIuMzc0QzMzMy4xMDkgMzk5LjI2NyAzMjkuNTM5IDQxMi4xOTQgMzI3LjI0MiA0MTguMTc5QzMyNi44MzggNDE5LjIzIDMyOS4yOTEgNDE5LjUgMzM5LjI2NCA0MTkuNUgzNTEuNzk0TDM1MS4yMzMgMzYyLjY4NEMzNTAuOTI1IDMzMS40MzQgMzUwLjk4OSAzMDMuMzMyIDM1MS4zNzYgMzAwLjIzNEMzNTEuNzY5IDI5Ny4wOTMgMzUzLjA2MyAyOTMuMTQxIDM1NC4zMDIgMjkxLjNDMzU4LjM5MiAyODUuMjI0IDM1OS42MjQgMjg1IDM4OC45NDkgMjg1QzQxOC45NDIgMjg1IDQyMi4xOTkgMjg1LjYwMyA0MjguMDI3IDI5Mi4yNDJDNDM0LjM2MiAyOTkuNDU2IDQzMy45NDkgMjg3Ljc4OCA0MzMuOTQ1IDQ1OS43MThDNDMzLjk0MiA2MTQuODk3IDQzMy45MTUgNjE3LjA0NCA0MzEuOTU0IDYyMC4yNTlDNDMwLjg2MSA2MjIuMDUyIDQyOC41MDEgNjI0LjQxMiA0MjYuNzA4IDYyNS41MDVDNDIzLjY0NCA2MjcuMzczIDQyMS42MjEgNjI3LjQ5MyAzOTIuOTQ5IDYyNy40OTVDMzU4Ljc3IDYyNy40OTcgMzU3LjQwOSA2MjcuMjU2IDM1My40ODMgNjIwLjVDMzUxLjUxNCA2MTcuMTEzIDM1MS40NDEgNjE1LjI0NiAzNTEuMTk0IDU2Mi41QzM1MS4wNTMgNTMyLjUyNSAzNTAuOTQxIDUwNi4wNjYgMzUwLjk0NCA1MDMuNzAyTDM1MC45NDkgNDk5LjQwNUwzNDQuNjk5IDQ5OS43MDJMMzM4LjQ0OSA1MDBMMzM3Ljk0OSA1NjAuMTQ2QzMzNy40NjQgNjE4LjQ5NyAzMzcuMzg5IDYyMC4zNTcgMzM1LjQ1MSA2MjIuNDk4QzMzMS4wOSA2MjcuMzE2IDMyOS43OSA2MjcuNSAzMDAuMjQ5IDYyNy40OTZDMjc0LjQ1OCA2MjcuNDkzIDI3Mi4yMTggNjI3LjM1MiAyNjkuMjUzIDYyNS41NDRaIiBmaWxsPSIjRTQ1ODdFIi8+DQo8cGF0aCBmaWxsLXJ1bGU9ImV2ZW5vZGQiIGNsaXAtcnVsZT0iZXZlbm9kZCIgZD0iTTcwNC4wMiA2MzAuMjY5QzcwMi4xMDYgNjI5LjI5NiA2OTkuNTE0IDYyNi45NjUgNjk4LjI2MSA2MjUuMDg4TDY5NS45ODEgNjIxLjY3N0w2OTYuMjQxIDQ2Ni45MTJDNjk2LjUgMzEyLjM2IDY5Ni41MDMgMzEyLjE0MyA2OTguNTYyIDMwOS4zODVDNjk5LjY5NiAzMDcuODY2IDcwMS44NjYgMzA1LjY5NiA3MDMuMzg1IDMwNC41NjJDNzA2LjAzOSAzMDIuNTgxIDcwNy4zODkgMzAyLjUgNzM3LjkwMiAzMDIuNUg3NjkuNjU3TDc3NC41MjQgMzA1LjUwOUM3NzcuOTgxIDMwNy42NDYgNzgwLjEzMSAzMDkuOTU2IDc4MS45NDUgMzEzLjQ4Mkw3ODQuNSAzMTguNDQ3VjQ2OS40NzNDNzg0LjUgNjE4LjcwMiA3ODQuNDc2IDYyMC41NCA3ODIuNSA2MjMuODk1Qzc4MS40IDYyNS43NjMgNzc5LjIzIDYyOC4yMzggNzc3LjY3OCA2MjkuMzk1Qzc3NC45NTkgNjMxLjQyNCA3NzMuNjM1IDYzMS41MSA3NDEuMTc4IDYzMS43NjlDNzEwLjYxOCA2MzIuMDEzIDcwNy4xNzggNjMxLjg3NCA3MDQuMDIgNjMwLjI2OVpNNDUwLjkyMyA2MjUuMDc3TDQ0OCA2MjIuMTU0VjU4MC4yMTJDNDQ4IDUzOS4xNTMgNDQ4LjA0NCA1MzguMjE0IDQ1MC4wOTUgNTM1LjYwN0M0NTEuMjQ3IDUzNC4xNDIgNDU0LjA1OSA1MzEuOTkxIDQ1Ni4zNDUgNTMwLjgyN0M0NjUuMTYzIDUyNi4zMzMgNDc4LjgyMyA1MTYuMzQ0IDQ4Ni4wNzYgNTA5LjA4M0M0OTguNDkzIDQ5Ni42NTQgNTA2LjM2OCA0ODMuMzQzIDUxMS44ODEgNDY1LjQ2NkM1MTcuMjA3IDQ0OC4xOTMgNTE4LjIyOSA0MzkuNDQzIDUxOC43MzYgNDA2Ljc1TDUxOS4xOTggMzc3SDQ5MS4wNDlDNDU5LjM1NSAzNzcgNDU4LjQ4NSAzNzYuODMxIDQ1NS4wMSAzNzAuMDE5QzQ1My4xNjcgMzY2LjQwNyA0NTMgMzY0LjE0NiA0NTMuMDAyIDM0Mi43OUM0NTMuMDAzIDMxNy4xNzEgNDUzLjQ1NCAzMTQuODc1IDQ1OS4zMjYgMzEwLjU3MUM0NjIuMDM0IDMwOC41ODYgNDYzLjQwNCAzMDguNDk5IDQ5Mi4zMjYgMzA4LjQ3NEw1MjIuNSAzMDguNDQ4TDUyMyAyOTUuNDc0QzUyMy4zMDEgMjg3LjY2OSA1MjQuMDEgMjgxLjYwOCA1MjQuNzggMjgwLjI2QzUyNy43MSAyNzUuMTMyIDUyOC44OCAyNzUgNTcxLjUgMjc1QzYxNS4zNiAyNzUgNjE1LjM0OCAyNzQuOTk4IDYxOC4zNjUgMjgxLjM1N0M2MTkuNTg1IDI4My45MjcgNjIwIDI4Ny43MzMgNjIwIDI5Ni4zNDNWMzA3Ljg4NEw2NDcuOTI5IDMwOC4xOTJDNjc0LjM0MSAzMDguNDgzIDY3Ni4wMTEgMzA4LjYxMiA2NzguNjc5IDMxMC41NzFDNjg0LjU0MSAzMTQuODc0IDY4NC45OTkgMzE3LjE5OCA2ODQuOTc2IDM0Mi41QzY4NC45NTggMzYyLjkzMiA2ODQuNzQ0IDM2NS45NjcgNjgzLjA1NyAzNjkuNjg0QzY3OS43OTMgMzc2Ljg3MiA2NzkuMTM1IDM3NyA2NDUuNTUgMzc3SDYxNkw2MTYuMDAzIDM4OC4yNUM2MTYuMDE0IDQyMS44OTEgNjIyLjI4OSA0NDkuMzY2IDYzNC4xNTMgNDY3LjcwOUM2NDMuNTQ5IDQ4Mi4yMzcgNjUyLjg4NyA0OTAuMjk0IDY3MC40MTkgNDk5QzY3OC4wMDQgNTAyLjc2NiA2ODEuODg1IDUwNS4yODggNjgyLjczMyA1MDdDNjgzLjY2NiA1MDguODg0IDY4My45NzQgNTIxLjc2MSA2ODMuOTg1IDU1OS4zQzY4NC4wMDIgNjE0LjYxNCA2ODQuMDkzIDYxMy44MSA2NzcuNDY2IDYxNi41NzlDNjczLjA4MyA2MTguNDEgNjY4LjIxMSA2MTguMzczIDY1Ny44NiA2MTYuNDMyQzYzNi41OTkgNjEyLjQ0NCA2MDEuNTg2IDYwMC4zODIgNTk2Ljk1MiA1OTUuNDQ5QzU5NC43NDMgNTkzLjA5OCA1OTQuNTM0IDU5MS44NDggNTkzLjgxOCA1NzYuNzE1QzU5Mi44NjUgNTU2LjU4NSA1OTAuODU0IDU0My45NjYgNTg2LjQwMyA1MzAuMTg3QzU4Mi45ODQgNTE5LjYwMSA1NzguMTUxIDUwOS4xMDkgNTc4LjAyNSA1MTJDNTc3Ljc5NyA1MTcuMjcxIDU3NS41NzYgNTI4Ljc0NCA1NzMuMzc5IDUzNkM1NjcuODgzIDU1NC4xNTEgNTU5LjU2MiA1NjguMjU0IDU0Ni4wMTUgNTgyLjM3OEM1MjcuODI1IDYwMS4zNDQgNTA3LjE3MyA2MTQuMzgyIDQ4Mi40ODIgNjIyLjQ5QzQ3MS40MDMgNjI2LjEyNyA0NjMuMjYyIDYyNy45NjggNDU4LjE3MyA2MjcuOTg1QzQ1NC43MTMgNjI3Ljk5NyA0NTMuMjYxIDYyNy40MTUgNDUwLjkyMyA2MjUuMDc3WiIgZmlsbD0iI0U0NTg3RSIvPg0KPHBhdGggZmlsbC1ydWxlPSJldmVub2RkIiBjbGlwLXJ1bGU9ImV2ZW5vZGQiIGQ9Ik04NzMuNDM4IDYzMC40NThDODI4LjQ2MyA2MjYuMzI2IDc5OS41IDYwMS4xNTkgNzk5LjUgNTY2LjIwN0M3OTkuNSA1NDkuMDgxIDgwNC4yNjkgNTM3LjY4OCA4MTYuNTg3IDUyNS4zODZDODIyLjU1OCA1MTkuNDIyIDgyNi4xNDUgNTE2LjgxIDgzMi43NTggNTEzLjYwOUM4NDIuNjQyIDUwOC44MjUgODU1Ljg0OCA1MDUuMjUxIDg3MC41NzIgNTAzLjM3N0M4ODUuNjI4IDUwMS40NiAxMDc0LjE0IDUwMS40NTEgMTA4Ni41IDUwMy4zNjZDMTEwMC45NiA1MDUuNjA4IDExMTAuNTkgNTA4LjQ1MiAxMTIxLjMzIDUxMy42NTVDMTEyOS43MSA1MTcuNzE5IDExMzMuMDEgNTIwLjAwOCAxMTM4Ljg5IDUyNS44NTRDMTE0Ny40MSA1MzQuMzI2IDExNTEuOTEgNTQxLjkxOSAxMTU0LjU3IDU1Mi4zMTRDMTE1OS41NSA1NzEuODAyIDExNTMuOTYgNTkwLjMzNyAxMTM4LjUgNjA1LjU0OUMxMTI2LjI3IDYxNy41ODQgMTEwOS41NCA2MjUuMTgyIDEwODYuNDUgNjI5LjE4NkMxMDc4LjIxIDYzMC42MTYgMTA2NC42IDYzMC44NTkgOTgwIDYzMS4wODFDOTI2LjY1IDYzMS4yMjEgODc4LjY5NyA2MzAuOTQxIDg3My40MzggNjMwLjQ1OFpNMTA0Mi45NSA1NzcuNDRDMTA0OC40NyA1NzUuOTA4IDEwNTMuMDggNTcxLjAyIDEwNTMuOTcgNTY1Ljc0N0MxMDU0Ljk4IDU1OS43NDUgMTA1MS41MSA1NTIuOTI4IDEwNDYgNTUwLjEwMUMxMDQyLjEyIDU0OC4xMDggMTA0MC4yNiA1NDguMDQxIDk4MS4wODcgNTQ3Ljc2MkM5MzcuOTQ4IDU0Ny41NTkgOTE4LjU1MyA1NDcuODExIDkxNC42MjEgNTQ4LjYyOEM5MDUuMjE5IDU1MC41OCA5MDAuMTk2IDU1Ny43ODQgOTAxLjkwMSA1NjYuODcxQzkwMi42NjQgNTcwLjk0MSA5MDcuNjUyIDU3Ni4yMzggOTExLjg3MSA1NzcuNDYyQzkxNi41NSA1NzguODE4IDEwMzguMDYgNTc4Ljc5OCAxMDQyLjk1IDU3Ny40NFpNODExLjE1MyA0OTAuNDkxQzgwNC4yMDcgNDg5LjMzOSA3OTkuMDU4IDQ4NS4zODUgNzk1Ljc2MSA0NzguNjdDNzkzLjI3OSA0NzMuNjE2IDc5MyA0NzEuOTg5IDc5MyA0NjIuNTQ5Qzc5MyA0NTMuNTQ1IDc5My4zMzUgNDUxLjM2OCA3OTUuMzUyIDQ0Ny4yNzJDNzk2LjY0NiA0NDQuNjQ0IDc5OS4yMzMgNDQxLjMyOSA4MDEuMSA0MzkuOTA1QzgwNy45ODcgNDM0LjY1MiA4MDguMTI3IDQzNC42NCA4NjMuNzUgNDM0LjU5M0w5MTUuNSA0MzQuNTQ5VjQyOC4wNDlWNDIxLjU0OUw4ODMuNzUgNDIxLjU0MUM4NDUuMTU1IDQyMS41MzIgODM3LjY5NiA0MjAuODE0IDgyNy45IDQxNi4xNjJDODE5LjQ5MSA0MTIuMTY4IDgxMy45NjMgNDA2Ljg5NSA4MTAuMzI0IDM5OS4zOTNDODA1Ljk4NiAzOTAuNDUxIDgwNS41IDM4NS41OSA4MDUuNSAzNTEuMTc4QzgwNS41IDMxNS43NTMgODA1LjgzNyAzMTMuMjM2IDgxMS40OTMgMzA2LjM3M0M4MTUuMTg3IDMwMS44OTIgODE5Ljk2NyAyOTkuNjAzIDgyNy44MzYgMjk4LjU0NkM4MzYuODggMjk3LjMzMSAxMDIzLjE5IDI5Ni40OCAxMDg2IDI5Ny4zNjdDMTE0NS4xMiAyOTguMjAxIDExNDQuMjcgMjk4LjEwOSAxMTUwLjg0IDMwNC4zNTJDMTE1Ni4zNyAzMDkuNjEgMTE1NyAzMTEuODYgMTE1NyAzMjYuNTQ5QzExNTcgMzM1LjM2IDExNTYuNTMgMzQxLjM4MSAxMTU1LjY0IDM0My44ODVDMTE1My43NyAzNDkuMTg5IDExNDguODUgMzU0LjQ5IDExNDMuNSAzNTYuOTY2QzExMzkuMDQgMzU5LjAzMiAxMTM4LjEgMzU5LjA1MSAxMDI4IDM1OS4zMDZMOTE3IDM1OS41NjNMOTE1LjI1IDM2MS42NjdDOTEyLjgzOSAzNjQuNTY2IDkxMy4wNTkgMzY3LjE5OSA5MTUuOTU1IDM3MC4wOTRMOTE4LjQwOSAzNzIuNTQ5SDEwMjguMjdDMTE0OS41OCAzNzIuNTQ5IDExNDQuOTkgMzcyLjMxNyAxMTUxLjIyIDM3OC43NzJDMTE1Mi45NiAzODAuNTc0IDExNTQuODUgMzgzLjMxNiAxMTU1LjQ0IDM4NC44NjRDMTE1Ni44NSAzODguNjA2IDExNTYuNzkgNDAwLjg0NSAxMTU1LjM0IDQwNS42OTFDMTE1My43NiA0MTAuOTcxIDExNDguNDMgNDE2LjkyNyAxMTQzLjI3IDQxOS4xODFDMTEzOS4yOSA0MjAuOTIxIDExMzUuMDkgNDIxLjA2OSAxMDgyIDQyMS4zNDRMMTAyNSA0MjEuNjM4TDEwMjUuMTQgNDI3Ljg0NEwxMDI1LjI5IDQzNC4wNDlMMTA4NS4wOCA0MzQuMjQ0QzExMjYuOTggNDM0LjM4IDExNDYuMzUgNDM0Ljc5MiAxMTQ5LjggNDM1LjYyQzExNTUuNTYgNDM3LjAwMiAxMTYwLjcyIDQ0MS4xNzUgMTE2My44MSA0NDYuOTU0QzExNjUuNyA0NTAuNDk0IDExNjYgNDUyLjYwNyAxMTY1Ljk4IDQ2Mi41NDlDMTE2NS45NyA0NzIuMzU1IDExNjUuNjUgNDc0LjYzOCAxMTYzLjgzIDQ3OC4wNDlDMTE2MS4wNCA0ODMuMjY5IDExNTguMDkgNDg1LjkzNyAxMTUxLjk5IDQ4OC43NUwxMTQ3IDQ5MS4wNDlMOTgxLjUgNDkxLjE3MkM4OTAuNDc1IDQ5MS4yMzkgODEzLjgxOSA0OTAuOTMzIDgxMS4xNTMgNDkwLjQ5MVoiIGZpbGw9IiNFNDU4N0UiLz4NCjxwYXRoIGZpbGwtcnVsZT0iZXZlbm9kZCIgY2xpcC1ydWxlPSJldmVub2RkIiBkPSJNMzY4Ljk2NCA5OTEuNDQ3QzMzOC4wNzYgOTg4LjYyMiAzMzMuNjkgOTg3LjY0OSAzMjguODg2IDk4Mi41NTVDMzI3LjE3NiA5ODAuNzQyIDMyNS4yNDEgOTc3LjMwMyAzMjQuNTg2IDk3NC45MTRDMzIzLjY4NSA5NzEuNjI2IDMyMy40NjUgOTM2LjU4MyAzMjMuNjggODMwLjg5MkwzMjMuOTY0IDY5MS4yMTVMMzI2LjA1NiA2ODguMzkyQzMyNy4yMDcgNjg2LjgzOSAzMjkuNjU5IDY4NC41NDEgMzMxLjUwNSA2ODMuMjg0TDMzNC44NjIgNjgxTDM3MS40OTIgNjgxLjI4NEw0MDguMTIzIDY4MS41NjlMNDExLjcwNCA2ODQuMzAyQzQxOSA2ODkuODY5IDQxOC41NDggNjc5LjI2MiA0MTguMjQgODM3LjU2OUM0MTcuOTggOTcxLjQ2OCA0MTcuODYzIDk3OS43NTUgNDE2LjE4NiA5ODIuODIzQzQxNS4yMDggOTg0LjYxMyA0MTIuNTQzIDk4Ny4zMTMgNDEwLjI2MyA5ODguODIzQzQwNi4xODMgOTkxLjUyNSA0MDUuODUgOTkxLjU3MSAzODkuNTQgOTkxLjY5MUMzODAuNDIzIDk5MS43NTggMzcxLjE2NCA5OTEuNjQ5IDM2OC45NjQgOTkxLjQ0N1pNNzguNTM0OCA5ODQuMzQ3Qzc2LjY0ODggOTgzLjM2OSA3NC4xNzM4IDk4MS4yOTUgNzMuMDM0OCA5NzkuNzM4QzcxLjAzMTggOTc3LjAwMSA3MC45NjQ4IDk3NS43NjMgNzEuMDA3OCA5NDIuMjM4QzcxLjA2MTggODk5LjMyIDcwLjM4OTggOTAxLjY1MSA4NC40NjM4IDg5NS41NDNDMTI2LjU5IDg3Ny4yNjIgMTU0LjI5NCA4NDQuNzYgMTYzLjMwMyA4MDMuMDQ4QzE2Ni41NDkgNzg4LjAyMSAxNjcuNDQzIDc3Mi4zNDcgMTY3LjQ1NCA3MzAuMjY5QzE2Ny40NjUgNjg3LjYyMSAxNjcuNDcxIDY4Ny41NjggMTczLjA3OSA2ODMuMTU3QzE3NS42NzYgNjgxLjExNCAxNzYuNjUgNjgxLjA2OSAyMTguMTM0IDY4MS4wNjlDMjU2LjM5OSA2ODEuMDY5IDI2MC43ODggNjgxLjIzNSAyNjMuMTM2IDY4Mi43NzNDMjY4LjMwOCA2ODYuMTYzIDI2OC40NjQgNjg3LjYyNCAyNjguNDY0IDczMi43OTNDMjY4LjQ2NCA3NzguODkgMjY5LjQ5MyA3OTMuMDQzIDI3My45NjYgODA4LjQ3OEMyODAuMDk1IDgyOS42MjggMjkwLjIwMiA4NDUuMTU2IDMwNS4xOTYgODU2LjQ1OEMzMDkuMTM5IDg1OS40MyAzMTIuMjI3IDg2Mi42NTEgMzEzLjA3MyA4NjQuNjc1QzMxNS4wOTYgODY5LjUxOCAzMTUuMTIzIDk2NC41NzcgMzEzLjEwMiA5NjkuMzUxQzMwOS44OCA5NzYuOTYzIDMwNS45NzQgOTc3Ljg0OCAyOTAuMDY5IDk3NC41NzFDMjY4LjQwNiA5NzAuMTA4IDIzOC42NTUgOTU5LjM0NCAyMzIuOTggOTUzLjkxN0wyMjkuOTk2IDk1MS4wNjJMMjI5LjMxNSA5MzIuNzUxQzIyOC41MzUgOTExLjc1NiAyMjYuNzEzIDg5OS42OSAyMjIuMzIzIDg4Ni40NTNDMjE3LjY4NSA4NzIuNDY2IDIxNi44OTkgODcxLjk4MiAyMTYuMTg1IDg4Mi42NzRDMjE0Ljc3OCA5MDMuNzU0IDIwMy45MjMgOTI0LjYxMSAxODQuNjUyIDk0My4yNjVDMTYzLjk5NyA5NjMuMjU3IDEzOC40NDEgOTc2LjEwNiAxMDYuNDY0IDk4Mi41NzZDODkuMTM4OCA5ODYuMDgyIDgyLjY3MjggOTg2LjQ5MiA3OC41MzQ4IDk4NC4zNDdaIiBmaWxsPSIjRTQ1ODdFIi8+DQo8cGF0aCBmaWxsLXJ1bGU9ImV2ZW5vZGQiIGNsaXAtcnVsZT0iZXZlbm9kZCIgZD0iTTQ0Mi45MSA5ODkuMDA2QzQzOC4yMDEgOTg3LjQyOSA0MzUuMTE5IDk4NC43NjUgNDMzLjA0NSA5ODAuNDhDNDMxLjEyMiA5NzYuNTA3IDQzMC45OTYgOTc0LjQ0MyA0MzEgOTQ2LjgxM0M0MzEuMDAzIDkxOS40MDIgNDMxLjEzNyA5MTcuMTU5IDQzMi45NTIgOTE0LjE4M0M0MzQuMDI0IDkxMi40MjYgNDM2LjA3MSA5MTAuMjIxIDQzNy41MDIgOTA5LjI4M0M0NDAuNDAyIDkwNy4zODMgNDQ0LjM0MyA5MDcuNDcyIDQ4Mi40OTYgOTEwLjMwM0M1MjguNzY1IDkxMy43MzYgNTUwLjI3MSA5MTQuMzc3IDYxNy45OTYgOTE0LjM0QzY2NC44NjQgOTE0LjMxNSA3MDAuMzU1IDkxMy43NTUgNzMwLjM4MiA5MTIuNTY4Qzc3NC4xNjggOTEwLjgzNyA3NzQuMjc5IDkxMC44MzcgNzc4LjQ0OCA5MTIuODU2Qzc4MS4xMjkgOTE0LjE1MyA3ODMuNDExIDkxNi4yNzMgNzg0LjgxMiA5MTguNzY1Qzc4Ni44OTggOTIyLjQ3OCA3ODYuOTk2IDkyMy43ODkgNzg2Ljk5NiA5NDguMTA4Qzc4Ni45OTYgOTcyLjY4MiA3ODYuOTE3IDk3My43MTcgNzg0LjcwOCA5NzcuOTcyQzc4My4wMTMgOTgxLjIzNiA3ODEuMTgxIDk4Mi45OTggNzc3LjY0MiA5ODQuNzY3TDc3Mi44NjQgOTg3LjE1NUw3MjEuNjggOTg3Ljk1MkM2NDAuMDUyIDk4OS4yMjQgNDQ1Ljc1MyA5ODkuOTU4IDQ0Mi45MSA5ODkuMDA2Wk02NzYuNzA2IDkwMi4wMTFDNjY1LjA4NSA5MDEuMzMgNjYzLjU3NyA5MDAuNTgyIDY2NC4zNDkgODk1Ljg3OUM2NjQuNTc1IDg5NC41MDQgNjY1LjcxOCA4ODkuNzk2IDY2Ni44OTEgODg1LjQxN0M2NjkuMjg3IDg3Ni40NjcgNjcxLjk5NiA4NTYuNDIyIDY3MS45OTYgODQ3LjY0MVY4NDEuODQ0TDU2MS4xNjIgODQxLjk4N0M0NTcuMTEgODQyLjEyMiA0NTAuMTAxIDg0Mi4wMjIgNDQ2LjYwNiA4NDAuMzY0QzQzNy45MjUgODM2LjI0NSA0MzUuNSA4MjguMjkyIDQzNi4yNDUgODA2LjM3OUM0MzYuODc4IDc4Ny43NjQgNDM4Ljk0NyA3ODIuNjg1IDQ0Ny40OTYgNzc4Ljc2QzQ1MS4yOTUgNzc3LjAxNSA0NTYuNzIyIDc3Ni45MjIgNTU1LjUzNCA3NzYuOTAxTDY1OS41NzIgNzc2Ljg3OUw2NjQuMDM0IDc3NC42MjlDNjc0Ljc5OSA3NjkuMjAxIDY3NC43NjQgNzUzLjA1MSA2NjMuOTc2IDc0Ny42MzFDNjYwLjczIDc0NiA2NTMuNDYzIDc0NS44ODEgNTU1Ljk5NiA3NDUuODU5QzQ1Ni40MzQgNzQ1LjgzNiA0NTEuMzAzIDc0NS43NDggNDQ3LjQxNyA3NDMuOTgzQzQ0Mi42NjcgNzQxLjgyNSA0MzkuNDM5IDczOC4wODggNDM3LjkwNiA3MzIuOTcyQzQzNy4yNDMgNzMwLjc1OSA0MzYuOTQ5IDcyMi44ODQgNDM3LjE1NiA3MTIuODU3QzQzNy40OCA2OTcuMTM0IDQzNy42MTggNjk2LjE3MiA0NDAuMTQ4IDY5MS44NjhDNDQxLjc4MiA2ODkuMDkgNDQ0LjQ2OSA2ODYuNDAyIDQ0Ny4xNDggNjg0Ljg2OEw0NTEuNDk2IDY4Mi4zNzlMNTkzLjI4MiA2ODIuMTE2Qzc0Ny45NzQgNjgxLjgyOCA3NDEuNTU1IDY4MS42MTMgNzUzLjI1NSA2ODcuNDg1Qzc2NC40NSA2OTMuMTAzIDc3MS4yOTMgNzAxLjA3NyA3NzUuMjY2IDcxMy4xMzFDNzc3LjEyOCA3MTguNzggNzc3LjM2OCA3MjIuNDY5IDc3Ny43NjMgNzUxLjYyMUM3NzguMjE0IDc4NC44NiA3NzYuNzQ3IDgzNS4xMjQgNzc0LjkzIDg0OC42ODJDNzcwLjk3MiA4NzguMjA4IDc1OS4zMzEgODk0LjQ0MiA3MzcuNzQgOTAwLjU0NUM3MzEuODIxIDkwMi4yMTkgNjk1LjIzOSA5MDMuMDk3IDY3Ni43MDYgOTAyLjAxMVoiIGZpbGw9IiNFNDU4N0UiLz4NCjxwYXRoIGZpbGwtcnVsZT0iZXZlbm9kZCIgY2xpcC1ydWxlPSJldmVub2RkIiBkPSJNMTA4NC41IDk5Ni4xOTZDMTA2My45OCA5OTQuNjQ1IDEwNDEuNjcgOTkwLjU3OSAxMDI3IDk4NS43MTNDMTAwNS4wMiA5NzguNDIzIDk4NC45NTkgOTY2LjYyNyA5NzAuNjA3IDk1Mi41NUw5NjIuNzE1IDk0NC44MDlMOTU1LjU5MSA5NTEuNTVDOTUxLjY3NCA5NTUuMjU4IDk0NC42NSA5NjAuODE5IDkzOS45ODQgOTYzLjkwOEM5MDkuMjQyIDk4NC4yNTkgODcwLjQzMSA5OTQuOTIgODI2Ljk1NiA5OTQuOTU0QzgwOC4wOTMgOTk0Ljk2OSA4MDQuMzQ4IDk5NC4wNTIgODAxLjAyNiA5ODguNjAyQzc5OS4xMjEgOTg1LjQ3OCA3OTkuMDA3IDk4My42MTggNzk5LjAwNCA5NTUuNDkyQzc5OSA5MjIuODk4IDc5OS4yODYgOTIxLjA2NiA4MDQuNzAzIDkxOS4wMTRDODA2LjI0MSA5MTguNDMxIDgxNC4yNzIgOTE3LjcxNCA4MjIuNTQ4IDkxNy40MjFDODU2LjAyNSA5MTYuMjM1IDg4My40NjYgOTA5LjQ2NSA5MDQuMzA5IDg5Ny4yNUM5MTIuNTkyIDg5Mi4zOTcgOTI1LjU5MiA4ODAuODA3IDkyOS4wNzQgODc1LjE3Mkw5MzEuMTYzIDg3MS43OTJIOTczQzk5Ni4wMSA4NzEuNzkyIDEwMTUuNTMgODcyLjA1NiAxMDE2LjM3IDg3Mi4zNzlDMTAxNy4yMSA4NzIuNzAyIDEwMTguNjMgODc1LjE3MyAxMDE5LjUyIDg3Ny44NjlDMTAyMC40MiA4ODAuNTY1IDEwMjMuMyA4ODYuMDM4IDEwMjUuOTMgODkwLjAzMUMxMDM5LjE1IDkxMC4xMzggMTA2Mi4xNSA5MjMuOTEzIDEwOTQuOTMgOTMxLjM1NUMxMTAwLjY3IDkzMi42NTcgMTEwNS45NiA5MzQuMzI1IDExMDYuNyA5MzUuMDYxQzExMDcuNDMgOTM1Ljc5NiAxMTA5LjQxIDk0MS41NDkgMTExMS4wOSA5NDcuODQ1QzExMTIuNzcgOTU0LjE0MSAxMTE2LjY0IDk2NS45MzcgMTExOS42OCA5NzQuMDU5QzExMjMuMjUgOTgzLjU5MSAxMTI1IDk4OS42NDYgMTEyNC42MyA5OTEuMTM4QzExMjQuMzEgOTkyLjQwOSAxMTIyLjgxIDk5NC4wMTQgMTEyMS4yOSA5OTQuNzA1QzExMTguNTEgOTk1Ljk3MSAxMDk0LjQzIDk5Ni45NDYgMTA4NC41IDk5Ni4xOTZaTTEwMzguNSA4NzkuNTIxQzEwMzUuODYgODc4LjA0NyAxMDMzLjczIDg3NS43NjMgMTAzMi4yNSA4NzIuODI2TDEwMzAgODY4LjM2OEwxMDMwLjAyIDc4MC4zM0MxMDMwLjA0IDY5Ni42MzYgMTAzMC4xNCA2OTIuMDkgMTAzMS45IDY4OC4xOTNDMTAzMi45MyA2ODUuOTM5IDEwMzUuMjggNjgzLjAxNCAxMDM3LjEzIDY4MS42OTNMMTA0MC41IDY3OS4yOTJMMTA3OSA2NzkuMDE1QzExMTcuMzYgNjc4Ljc0IDExMTcuNTIgNjc4Ljc0NyAxMTIxLjk0IDY4MS4wMTVDMTEyNy4xNyA2ODMuNjk0IDExMjkuNzkgNjg2Ljk2NSAxMTMxLjA0IDY5Mi4zNjlDMTEzMi4yNCA2OTcuNTE0IDExMzIuMjQgODYzLjA3IDExMzEuMDQgODY4LjIxNUMxMTI5Ljc5IDg3My42MTEgMTEyNy4xNyA4NzYuODkyIDExMjEuOTggODc5LjU0MkMxMTE3LjY0IDg4MS43NTggMTExNy4wMSA4ODEuNzkyIDEwODAuMDQgODgxLjc3NkMxMDQzLjA0IDg4MS43NTkgMTA0Mi40NCA4ODEuNzI3IDEwMzguNSA4NzkuNTIxWk04MDcuNSA4NjAuODU3Qzc5OS45ODEgODU5LjAyNiA3OTQuMjk3IDg1NC4wMjMgNzkxLjgzNiA4NDcuMDY3Qzc5MC44MDEgODQ0LjE0MiA3OTAuNSA4MzMuNjE3IDc5MC41IDgwMC4yOTJDNzkwLjUgNzYyLjE1NSA3OTAuNjg3IDc1Ni45NTMgNzkyLjE1NSA3NTQuMjkyQzc5NC41ODggNzQ5Ljg4MiA3OTcuOTg1IDc0Ny4xMjQgODAyLjUgNzQ1Ljg5M0M4MDUuMTQyIDc0NS4xNzMgODIzLjg0MSA3NDQuODAxIDg1Ny41OTUgNzQ0Ljc5OEM5MDUuODIxIDc0NC43OTIgOTA4Ljc4MyA3NDQuNjg5IDkxMC4zNDUgNzQyLjk2M0M5MTIuMzQ1IDc0MC43NTQgOTEyLjU5MyA3MzIuNTI5IDkxMC43MDcgNzMwLjk2NEM5MDkuODMyIDczMC4yMzggODkyLjEzMSA3MjkuNzk0IDg1NS45NTcgNzI5LjU5MUM4MDQuODI1IDcyOS4zMDUgODAyLjMyNiA3MjkuMjA1IDc5OC41IDcyNy4yOTJDNzk1LjcwNiA3MjUuODk1IDc5My44MjEgNzIzLjk0NiA3OTIuMjUgNzIwLjgzQzc5MC4zMTggNzE3IDc5MCA3MTQuNzkyIDc5MCA3MDUuMjI5Qzc5MCA2OTIuOTE4IDc5MC45OSA2ODguNzAxIDc5NC44ODYgNjg0LjQxOUM4MDAuMTU3IDY3OC42MjYgNzk5LjE1NCA2NzguNzIzIDg2NS40MDggNjc3LjU2NUM5MDcuNTQ2IDY3Ni44MjggOTM3LjgyNCA2NzYuODEyIDk2MyA2NzcuNTE0QzEwMDIuNDIgNjc4LjYxMiAxMDA0LjIyIDY3OC44NzYgMTAwOS4yNyA2ODQuMzI0QzEwMTMuODcgNjg5LjI4OCAxMDE0LjE1IDY5Mi40MjMgMTAxMy44MSA3MzUuMzA0QzEwMTMuNTEgNzczLjk2MiAxMDEzLjQzIDc3NS40MjUgMTAxMS4zNiA3NzkuMjkyQzEwMDguNzMgNzg0LjIwMiAxMDA2LjUyIDc4Ni4yNiAxMDAxLjc1IDc4OC4yNTRDOTk4LjU3NCA3ODkuNTc5IDk4OS44OTMgNzg5Ljc5MiA5MzkuMDMyIDc4OS43OTJDODgxLjMzMyA3ODkuNzkyIDg3OS45NTUgNzg5LjgzNyA4NzggNzkxLjc5MkM4NzUuNjE4IDc5NC4xNzQgODc1LjMwMiA4MDAuNDU1IDg3Ny40MTkgODAzLjM1MUM4NzguNzkyIDgwNS4yMjkgODgwLjk1NiA4MDUuMzA4IDk0NC4wMDIgODA1Ljc5MkwxMDA5LjE2IDgwNi4yOTJMMTAxMi4wOCA4MDkuNTU4TDEwMTUgODEyLjgyNEwxMDE1IDgzMi41NThDMTAxNC45OSA4NTAuNTg3IDEwMTQuODIgODUyLjU3OCAxMDEyLjk3IDg1NS42MDJDMTAwOS4wMiA4NjIuMDgzIDEwMTMuOSA4NjEuODAyIDkwNy4yODIgODYxLjY5Qzg1NC4wNTIgODYxLjYzMyA4MDkuMTUgODYxLjI1OSA4MDcuNSA4NjAuODU3WiIgZmlsbD0iI0U0NTg3RSIvPg0KPHBhdGggZmlsbC1ydWxlPSJldmVub2RkIiBjbGlwLXJ1bGU9ImV2ZW5vZGQiIGQ9Ik0xMTQ0LjUyIDk4NS4zMTdDMTE0Mi4xMiA5ODMuNTA4IDExMzEuMjUgOTU5Ljk0NiAxMTI3LjQyIDk0OC4yNTdDMTEyMi45NSA5MzQuNTk4IDExMjEuNTcgOTI2LjI5MiAxMTIyLjExIDkxNi4yOTZDMTEyMi42MiA5MDYuOSAxMTI0Ljk1IDkwMC43NTcgMTEyOS44NiA4OTUuODQ2QzExNDUuMDIgODgwLjY5MiAxMTY5LjQ0IDg4OC42MTkgMTE3My4zMyA5MDkuOTUxTDExNzQuMDIgOTEzLjc1NkwxMTc3LjM4IDkxMC44MDdDMTE4MS43NSA5MDYuOTY3IDExODYuOTkgOTA1LjI0MSAxMTk0LjQxIDkwNS4xOTJDMTE5OS4xOSA5MDUuMTYxIDEyMDEuMzYgOTA1LjcwOSAxMjA1LjA1IDkwNy44OEMxMjEwLjI4IDkxMC45NTEgMTIxNC41NiA5MTUuNTkgMTIxNi41NiA5MjAuMzY0QzEyMTcuMyA5MjIuMTM0IDEyMTcuOTEgOTI2LjQ0OSAxMjE3LjkxIDkyOS45NTRDMTIxNy45MSA5MzUuMDY0IDEyMTcuMyA5MzcuNTQyIDEyMTQuODQgOTQyLjQ2MkMxMjA4LjkgOTU0LjM2MiAxMTg5LjQ2IDk2OC44NDQgMTE2NC45NSA5NzkuNjI3QzExNTIuNDkgOTg1LjExMSAxMTQ2LjQ3IDk4Ni43ODcgMTE0NC41MiA5ODUuMzE3WiIgZmlsbD0iI0U0NTg3RSIvPg0KPC9zdmc+DQo=';
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

(function () {
  'use strict';
  var path = location.pathname.replace(/\/$/, '');
  var COMPLETE = path === '/shop_payment_complete';
  var MYPAGE = path === '/shop_mypage';
  if (!COMPLETE && !MYPAGE) return;
  var DETAIL = false;
  function isDetail() {
    return MYPAGE && /[?&]m2=order(&|$)/.test(location.search) && /[?&]idx=/.test(location.search);
  }

  var FAQ = '/faq/?bmode=view&idx=';
  var ITEMS = [
    { idx: '167269006', t: '구매한 파일 다운로드 방법', d: '마이페이지 → 주문 조회에서 언제든 다시 받을 수 있어요' },
    { idx: '168670957', t: '한글(HWP) 파일 글꼴 설치 안내', d: '한글 파일 글자가 깨져 보이면 글꼴을 먼저 설치해 주세요' },
    { idx: '173457255', t: '구매평 쓰고 적립금 받기', d: '구매평 500원 + 장문 1,000원, <mark>최대 1,500원</mark> 적립' }
  ];

  var CSS =
    '.sl-og{margin:24px 0 0;padding:18px 16px 8px;background:#f5f8fc;border:1px solid #e1e8f2;border-radius:14px;' +
      'font-family:"Noto Sans KR",sans-serif;text-align:left;box-sizing:border-box}' +
    '.sl-og *{box-sizing:border-box}' +
    '.sl-og h3{margin:0 0 4px;font-size:15px;font-weight:800;letter-spacing:-.03em;color:#1d3a5e}' +
    '.sl-og p.s{margin:0 0 12px;font-size:12px;color:#5b7189}' +
    '.sl-og a{display:flex;align-items:center;gap:11px;margin:0 0 8px;padding:12px 12px;background:#fff;' +
      'border:1px solid #e1e8f2;border-radius:10px;text-decoration:none!important;transition:border-color .12s}' +
    '.sl-og a:hover{border-color:#2f6fd6}' +
    '.sl-og .n{flex:0 0 24px;height:24px;border-radius:50%;background:#1d3a5e;color:#fff;font-size:12px;font-weight:800;' +
      'display:flex;align-items:center;justify-content:center}' +
    '.sl-og .b{flex:1;min-width:0}' +
    '.sl-og .t{display:block;font-size:14px;font-weight:700;letter-spacing:-.02em;color:#1d3a5e;line-height:1.4}' +
    '.sl-og .d{display:block;margin-top:2px;font-size:12px;color:#5b7189;line-height:1.45;word-break:keep-all}' +
    '.sl-og mark{background:linear-gradient(transparent 55%,#ffe766 55%);color:inherit;font-weight:700;padding:0 1px}' +
    '.sl-og .a{flex:0 0 auto;font-size:16px;color:#2f6fd6}' +
    '.sl-og.det{margin:16px 0}';

  function html() {
    return '<h3>구매해 주셔서 감사합니다</h3>' +
      '<p class="s">자주 묻는 질문 3가지를 먼저 확인해 주세요</p>' +
      ITEMS.map(function (it, i) {
        return '<a href="' + FAQ + it.idx + '" target="_blank" rel="noopener">' +
          '<span class="n">' + (i + 1) + '</span>' +
          '<span class="b"><span class="t">' + it.t + '</span><span class="d">' + it.d + '</span></span>' +
          '<span class="a">›</span></a>';
      }).join('');
  }

  function anchor() {
    if (COMPLETE) {
      var hs = document.querySelectorAll('h6, h5, h4');
      for (var i = 0; i < hs.length; i++) {
        if (!/완료/.test(hs[i].textContent || '')) continue;
        var wrap = hs[i].parentElement && hs[i].parentElement.parentElement;
        var ul = wrap && wrap.querySelector('ul');
        if (ul) return ul;
      }
      return null;
    }
    var col = document.querySelector('.shop-content.mypage .col-md-10');
    if (!col) return null;
    var root = null;
    for (var c = 0; c < col.children.length; c++) {
      if (/주문 상세 내역/.test(col.children[c].textContent || '')) { root = col.children[c]; break; }
    }
    if (!root) return null;
    for (var k = 0; k < root.children.length; k++) {
      if (/^\s*주문번호/.test(root.children[k].textContent || '')) return root.children[k];
    }
    return null;
  }

  function place() {
    DETAIL = isDetail();
    if (!COMPLETE && !DETAIL) return false;
    if (!document.getElementById('sl-og-css')) {
      var st = document.createElement('style');
      st.id = 'sl-og-css'; st.textContent = CSS;
      document.head.appendChild(st);
    }
    var mine = document.querySelector('.sl-og');
    if (mine && mine.isConnected) return true;
    var at = anchor();
    if (!at) return false;
    var box = document.createElement('div');
    box.className = 'sl-og' + (DETAIL ? ' det' : '');
    box.innerHTML = html();
    at.parentNode.insertBefore(box, at.nextSibling);
    return true;
  }

  var n = 0;
  var timer = setInterval(function () {
    place();
    if (COMPLETE && ++n >= 20) clearInterval(timer);
  }, COMPLETE ? 500 : 1000);
  place();
})();