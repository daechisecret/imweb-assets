/* ═══════════════════════════════════════════════════════════════
   대치동시크릿 로그인·회원가입 화면 — 짝꿍 : themes/login.css

   하는 일은 두 가지뿐입니다.
     ① body 에 sl-lg 를 붙여 꾸미기가 걸리게 합니다
     ② 카드 위에 인사말(제목·안내)을 얹습니다

   아이디·비밀번호 칸과 단추는 **손대지 않습니다.**
   이름(uid·passwd)이나 눌렀을 때 하는 일을 바꾸면 로그인이 깨집니다.
   ═══════════════════════════════════════════════════════════════ */
(function () {
  /* 어느 화면에 무슨 인사말을 얹을지 — 주소로 가릅니다 */
  var SAY = [
    { re: /^\/login/,                   t: '로그인',       s: '내신 대비를 위한 프리미엄 자료를 만나보세요!' },
    { re: /^\/site_join_pattern_choice/, t: '회원가입',     s: '가입하시면 구매하신 자료를 보관함에서 언제든 다시 받으실 수 있습니다.' },
    { re: /^\/site_join/,               t: '회원가입',     s: '가입하시면 구매하신 자료를 보관함에서 언제든 다시 받으실 수 있습니다.' },
    { re: /^\/find/,                    t: '아이디·비밀번호 찾기', s: '가입하실 때 적어 두신 정보로 찾아 드립니다.' }
  ];

  function saying() {
    var p = location.pathname;
    for (var i = 0; i < SAY.length; i++) if (SAY[i].re.test(p)) return SAY[i];
    return null;
  }

  function box() {
    return document.querySelector('.widget.login, .widget.join, .widget.find_account');
  }

  function run() {
    var w = box();
    if (!w) return;
    document.body.classList.add('sl-lg');
    if (document.getElementById('sl-lghead')) return;

    var say = saying();
    if (!say) return;

    var head = document.createElement('div');
    head.className = 'sl-lghead';
    head.id = 'sl-lghead';
    head.innerHTML = '<div class="eb">대치동시크릿</div><h1>' + say.t + '</h1><p>' + say.s + '</p>';
    w.parentNode.insertBefore(head, w);

    var foot = document.createElement('div');
    foot.className = 'sl-lgfoot';
    foot.textContent = '문의는 카카오톡 채널 「대치동시크릿」으로 주시면 가장 빠릅니다.';
    if (w.nextSibling) w.parentNode.insertBefore(foot, w.nextSibling);
    else w.parentNode.appendChild(foot);
  }

  run();
  window.addEventListener('load', run);
  setTimeout(run, 400);
  setTimeout(run, 1400);
  setTimeout(run, 3000);
})();
