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
  if (location.pathname.replace(/\/$/, '') !== '/search') return;
  var BASE = 'https://daechisecret.github.io/imweb-assets/';
  var V = '3334aa51';
  var css = document.createElement('link');
  css.rel = 'stylesheet'; css.href = BASE + 'search.css?v=' + V;
  document.head.appendChild(css);
  var js = document.createElement('script');
  js.src = BASE + 'search.js?v=' + V; js.defer = true;
  document.head.appendChild(js);
})();

(function () {
  var BASE = 'https://daechisecret.github.io/imweb-assets/';
  var V = '06d5492d';
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
  var V = 'b9e86a13';
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