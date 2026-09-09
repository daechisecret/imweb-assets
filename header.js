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
  var V = '762b5da9';
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
    document.documentElement.style.removeProperty('overflow');
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
    document.documentElement.style.setProperty('overflow', 'hidden');
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