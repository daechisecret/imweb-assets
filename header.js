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

  function run() { unlock(); fix(); }

  run();
  window.addEventListener('load', run);
  window.addEventListener('resize', run);
  if (window.ResizeObserver) {
    var ro = new ResizeObserver(function () { fix(); });
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
  var css = document.createElement('link');
  css.rel = 'stylesheet'; css.href = BASE + 'search.css';
  document.head.appendChild(css);
  var js = document.createElement('script');
  js.src = BASE + 'search.js'; js.defer = true;
  document.head.appendChild(js);
})();