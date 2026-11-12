(function () {
var LIST_SEL = '.shop-item._shop_item';
var MANY = 9;            /* 알약이 이보다 많으면 접어 둡니다 */
var KIND_ORDER = ['패키지', '교사용 한글파일 (편집가능)', '변형문제 (유형편)', '변형문제 (심화편)',
'지문분석', '직전보강', '핵심요약', '워크북', '특강자료'];
var ADVANCED_KINDS = ['핵심요약', '변형문제 (유형편)', '변형문제 (심화편)',
'지문분석', '워크북', '직전보강', '교사용 한글파일 (편집가능)', '패키지'];
function advancedPage() {
return location.pathname.replace(/\/$/, '') === '/492' && !/[?&]idx=/.test(location.search);
}
var FMT_PAGES = ['/special-lecture'];
var FMT_ORDER = ['PDF', 'HWP (편집가능)'];
var HWP_RE = /교사용\s*HWP|HWP\s*파일|한글\s*파일|HWP/i;
function fmtPage() {
return FMT_PAGES.indexOf(location.pathname.replace(/\/$/, '')) >= 0;
}
var MID_PAGES = { '/538': 1, '/539': 2, '/540': 3 };
function midPage() { return MID_PAGES[location.pathname.replace(/\/$/, '')] || 0; }
var MID_ORDER = ['PDF 강별', 'PDF 패키지', '한글(HWP) 강별', '한글(HWP) 패키지'];
var MID_PUBS = [['YK', 'YBM (김은형)'], ['YP', 'YBM (박준언)'], ['NK', '능률 (김기택)'], ['DY', '동아 (윤정미)'], ['DL', '동아 (이병민)'],
['MM', '미래엔 (문영인)'], ['VH', '비상 (황종배)'], ['JS', '지학사 (송미정)'], ['CS', '천재 (소영순)'], ['CL', '천재 (이상기)']];
var MID_RE = /\[\s*중학교\s*[1-3]\s*학년\s*교과서\s*속\s*문법\s+([A-Z]{2})\s*\]/;
function midKind(t) {
var h = HWP_RE.test(t), pk = /패키지/.test(t);
return h ? (pk ? '한글(HWP) 패키지' : '한글(HWP) 강별') : (pk ? 'PDF 패키지' : 'PDF 강별');
}
function midBook(t) { var m = MID_RE.exec(t); return m ? m[1] : ''; }
var KIND_RULES = [
['교사용 한글파일 (편집가능)', /교사용\s*HWP|HWP\s*파일|한글\s*파일|HWP/i],
['변형문제 (심화편)', /심화|고난도/],
['변형문제 (유형편)', /변형문제|유형편/],
['지문분석',        /지문\s*분석/],
['직전보강',        /직전\s*보강/],
['핵심요약',        /핵심\s*요약/],
['워크북',         /워크북/],
['특강자료',        /어휘|어법|방학\s*특강|특강/],
['패키지',         /패키지/]        /* 맨 뒤 — 다른 것이 안 걸릴 때만 */
];
var BOOK_GROUPS = [
{ g: 'EBS 수능특강', list: [
['[2027학년도] 수능특강 영어',                    '수능특강 영어',        '2027'],
['[2027학년도] 수능특강 영어독해연습',              '수능특강 영어독해연습',  '2027'],
['[2026] 수능특강 라이트 (Light) 영어',           '라이트 영어',          '2026'],
['[2026] 수능특강 라이트 (Light) 영어독해연습',     '라이트 영어독해연습',    '2026']
]},
{ g: '올림포스', list: [
['[2026] 올림포스 영어독해의 기본 1',   '영어독해의 기본 1',   '2026'],
['[2026] 올림포스 영어독해의 기본 2',   '영어독해의 기본 2',   '2026'],
['[2026] 올림포스 전국연합 기출 고1',   '전국연합 기출 고1',   '2026'],
['[2026] 올림포스 전국연합 기출 고2',   '전국연합 기출 고2',   '2026'],
['올림포스 고급영어독해 · 영미 비문학 읽기', '고급영어독해 · 영미 비문학', '']
]},
{ g: '교과서', list: [
['[1학년 교과서] 공통영어 1',      '공통영어 1',      '1학년'],
['[1학년 교과서] 공통영어 2',      '공통영어 2',      '1학년'],
['[2학년 교과서] 고등영어 1',      '고등영어 1',      '2학년'],
['[2학년 교과서] 고등영어 2',      '고등영어 2',      '2학년'],
['[2학년 교과서] 영어독해와작문',   '영어독해와작문',   '2학년']
]},
{ g: '모의고사', list: [
['[2026년 시행] 고1 모의고사', '고1 모의고사', '2026'],
['[2026년 시행] 고2 모의고사', '고2 모의고사', '2026'],
['[2026년 시행] 고3 모의고사', '고3 모의고사', '2026'],
['[2025년 시행] 고1 모의고사', '고1 모의고사', '2025'],
['[2025년 시행] 고2 모의고사', '고2 모의고사', '2025'],
['[2025년 시행] 고3 모의고사', '고3 모의고사', '2025']
]},
{ g: '특강', list: [
['특강 자료', '특강 자료', '']
]}
];
var BOOK_RULES = [
[/(?:수능특강|수특)\s*라이트|라이트\s*\(?Light\)?|수능특강\s*light/i, function (t) {
return /독해\s*연습|독해연습/.test(t)
? '[2026] 수능특강 라이트 (Light) 영어독해연습'
: '[2026] 수능특강 라이트 (Light) 영어'; }],
[/올림포스\s*전국\s*연합|전국연합\s*기출/, function (t) {
return /고\s*2|2학년/.test(t) ? '[2026] 올림포스 전국연합 기출 고2' : '[2026] 올림포스 전국연합 기출 고1'; }],
[/올림포스\s*고급|영미\s*비문학/, function () {
return '올림포스 고급영어독해 · 영미 비문학 읽기'; }],
[/올림포스/, function (t) {
return /기본\s*2|기본2/.test(t) ? '[2026] 올림포스 영어독해의 기본 2' : '[2026] 올림포스 영어독해의 기본 1'; }],
[/(?:수능특강|수특)/, function (t) {
return /독해\s*연습|독해연습/.test(t)
? '[2027학년도] 수능특강 영어독해연습' : '[2027학년도] 수능특강 영어'; }],
[/공통\s*영어\s*1/, function () { return '[1학년 교과서] 공통영어 1'; }],
[/공통\s*영어\s*2/, function () { return '[1학년 교과서] 공통영어 2'; }],
[/고등\s*영어\s*1/, function () { return '[2학년 교과서] 고등영어 1'; }],
[/고등\s*영어\s*2/, function () { return '[2학년 교과서] 고등영어 2'; }],
[/영어\s*독해\s*와\s*작문|영어독해와작문/, function () { return '[2학년 교과서] 영어독해와작문'; }],
[/모의고사/, function (t) {
var y = /(\d{4})\s*년/.exec(t);
var year = y ? y[1] : '2026';
if (year !== '2025' && year !== '2026') year = (+year >= 2026) ? '2026' : '2025';
var g = /\[\s*([1-3])\s*학년\s*\]|([1-3])\s*학년|고\s*([1-3])/.exec(t);
var grade = g ? (g[1] || g[2] || g[3]) : '3';
return '[' + year + '년 시행] 고' + grade + ' 모의고사'; }],
[/어휘|어법|방학\s*특강|특강/, function () { return '특강 자료'; }]
];
function tidy(s) {
return String(s || '')
.replace(/[\u{1F300}-\u{1FAFF}☀-➿️]/gu, ' ')   /* 하트 같은 그림글자 */
.replace(/\s+/g, ' ').trim();
}
function kindOf(t) {
if (midPage()) return midKind(t);
if (fmtPage()) return HWP_RE.test(t) ? 'HWP (편집가능)' : 'PDF';
for (var i = 0; i < KIND_RULES.length; i++) if (KIND_RULES[i][1].test(t)) return KIND_RULES[i][0];
return '';
}
function bookOf(t) {
if (midPage()) return midBook(t);
for (var i = 0; i < BOOK_RULES.length; i++) if (BOOK_RULES[i][0].test(t)) return BOOK_RULES[i][1](t);
return '';
}
function sortBy(order) {
return function (a, b) {
var i = order.indexOf(a), j = order.indexOf(b);
if (i < 0) i = 999; if (j < 0) j = 999;
return i - j || a.localeCompare(b, 'ko');
};
}
function idxOf(el) {
var a = el.querySelector('a[href*="idx="]');
var m = a ? /[?&]idx=(\d+)/.exec(a.getAttribute('href') || '') : null;
return m ? m[1] : '';
}
function urlOf(el) {
var a = el.querySelector('a[href*="idx="]');
return a ? a.getAttribute('href') : '';
}
function titleOf(el) {
var h2 = el.querySelector('.shop-title');
return tidy(h2 ? h2.textContent : '');
}
var NOPRICE_RE = /가격\s*문의|가격없음|쏠북/;
function isNoPrice(el) {
if (!el) return false;
if (el.classList.contains('sl-noprice')) return true;
try {
var d = JSON.parse(el.getAttribute('data-product-properties') || 'null');
if (d && ('price' in d) && !Number(d.price) && !Number(d.original_price)) return true;
} catch (e) {}
var pay = el.querySelector('.item-pay-detail .pay, .item-pay .pay, .pay');
return !!(pay && NOPRICE_RE.test(pay.textContent || ''));
}
function markNoPrice() {
var all = document.querySelectorAll('.shop-item._shop_item');
for (var i = 0; i < all.length; i++) {
var el = all[i];
if (el.classList.contains('sl-noprice') || el.classList.contains('sl-priced')) continue;
el.classList.add(isNoPrice(el) ? 'sl-noprice' : 'sl-priced');
}
}
document.addEventListener('click', function (e) {
var ic = e.target.closest('[data-shopping-widget-card-action="cart"], .im-ico-cart');
if (!ic) return;
var card = ic.closest('.shop-item._shop_item');
if (card && isNoPrice(card)) { e.preventDefault(); e.stopPropagation(); e.stopImmediatePropagation(); }
}, true);
function addGo(el) {
if (el.querySelector('.sl-go')) return;
var href = urlOf(el);
if (!href) return;
var pay = el.querySelector('.item-pay-detail') || el.querySelector('.item-pay');
if (!pay) return;
var a = document.createElement('a');
a.className = 'sl-go';
a.href = href;
a.textContent = '상품 페이지 ↗';
pay.appendChild(a);
}
function addActs(el) {
if (el.querySelector('.sl-acts')) return;
var idx = idxOf(el);
if (!idx) return;
var box = document.createElement('div');
box.className = 'sl-acts';
var mid = isNoPrice(el)
? '<a class="sl-act solv" href="' + urlOf(el) + '">쏠북에서 구매 ↗</a>'
: '<button type="button" class="sl-act cart" data-sl-act="cart">장바구니</button>';
box.innerHTML =
'<button type="button" class="sl-act samp" data-sl-act="sample">샘플 보기</button>' +
mid +
'<button type="button" class="sl-act wish" data-sl-act="wish">♡ 찜하기</button>';
el.appendChild(box);
}
var SAMPLE_CACHE = {}, SEEN_SETS = [], COMMON = ['c84e2dd02eacb.png', 'c989392159b0e.png', '89d88f2a714a7.png'];
function fileOf(u) { return String(u).split('?')[0].split('/').pop(); }
function noteSet(files) {
for (var i = 0; i < SEEN_SETS.length; i++)
for (var j = 0; j < files.length; j++)
if (SEEN_SETS[i].indexOf(files[j]) >= 0 && COMMON.indexOf(files[j]) < 0) COMMON.push(files[j]);
SEEN_SETS.push(files);
if (SEEN_SETS.length > 4) SEEN_SETS.shift();
}
function loadSample(page, done) {
if (SAMPLE_CACHE[page]) return done(SAMPLE_CACHE[page]);
if (!window.fetch) return done([]);
fetch(page, { credentials: 'same-origin' })
.then(function (r) { return r.ok ? r.text() : Promise.reject(r.status); })
.then(function (html) {
var re = /https:\/\/cdn\.imweb\.me\/upload\/[A-Za-z0-9]+\/[A-Za-z0-9._-]+\.(?:png|jpe?g|gif|webp)/gi;
var seen = {}, out = [], m;
while ((m = re.exec(html))) { if (!seen[m[0]]) { seen[m[0]] = 1; out.push(m[0]); if (out.length >= 30) break; } }
noteSet(out.map(fileOf));
SAMPLE_CACHE[page] = out;
done(out);
})
.catch(function () { SAMPLE_CACHE[page] = []; done([]); });
}
function openSample(el) {
var page = urlOf(el), title = titleOf(el);
var m = document.createElement('div');
m.className = 'sl-modal';
m.innerHTML = '<div class="sl-modin">' +
'<div class="sl-modhead"><b>' + title.replace(/</g, '&lt;') + '</b>' +
'<button type="button" class="sl-modx" data-sl-act="close">✕</button></div>' +
'<div class="sl-modbody"><div class="sl-modwait">샘플을 불러오는 중입니다…</div></div>' +
'<div class="sl-modfoot">' +
(isNoPrice(el)
? '<span class="sl-modnote">교과서 자료는 쏠북에서 구매 가능합니다 (본문 참고)</span>'
: '<button type="button" class="sl-act cart" data-sl-act="cart-modal">장바구니에 담기</button>') +
'<a class="sl-act" href="' + page + '" target="_blank" rel="noopener">상품 페이지에서 보기 ↗</a>' +
'</div></div>';
document.body.appendChild(m);
document.body.style.overflow = 'hidden';
function close() { m.remove(); document.body.style.overflow = ''; }
m.addEventListener('click', function (e) {
if (e.target === m || e.target.closest('[data-sl-act="close"]')) return close();
if (e.target.closest('[data-sl-act="cart-modal"]')) addCart(idxOf(el), e.target, el);
});
loadSample(page, function (raw) {
var body = m.querySelector('.sl-modbody');
if (!body) return;
var pages = raw.filter(function (u) { return COMMON.indexOf(fileOf(u)) < 0; }).slice(0, 20);
body.innerHTML = pages.length
? pages.map(function (u, i) { return '<img src="' + u + '" alt="샘플 ' + (i + 1) + '쪽" loading="lazy">'; }).join('')
: '<div class="sl-modwait">이 상품은 아직 샘플 사진이 없습니다.<br>상품 페이지에서 확인해 주십시오.</div>';
});
}
function addCart(idx, btn, card) {
if (card && isNoPrice(card)) {
if (btn) { var t0 = btn.textContent; btn.textContent = '쏠북에서 구매하는 자료입니다'; setTimeout(function () { btn.textContent = t0; }, 1800); }
return;
}
var api = window.SITE_SHOP_CART;
if (api && typeof api.addCartAnywhere === 'function') api.addCartAnywhere(idx);
else window.open('/?idx=' + idx, '_blank', 'noopener');
if (btn) { var t = btn.textContent; btn.textContent = '담았습니다'; setTimeout(function () { btn.textContent = t; }, 1400); }
}
function addWish(idx, btn) {
var api = window.SITE_SHOP_CART;
if (api && typeof api.addProdWish === 'function') api.addProdWish(idx);
if (btn) { btn.classList.add('on'); btn.textContent = '♥ 찜했습니다'; }
}
document.addEventListener('click', function (e) {
var b = e.target.closest('[data-sl-act]');
if (!b) return;
var act = b.dataset.slAct;
if (act === 'close' || act === 'cart-modal') return;
var card = b.closest('.shop-item._shop_item');
if (!card) return;
e.preventDefault(); e.stopPropagation();
if (act === 'sample') openSample(card);
else if (act === 'cart') addCart(idxOf(card), b, card);
else if (act === 'wish') addWish(idxOf(card), b);
}, true);
var SLIDER = '.swiper-container, .swiper-wrapper, .swiper, [class*="carousel"],' +
'.type-slide, .owl-stage, .owl-stage-outer, ._item_container.type-slide';
var SKIP = ['/', '/shop_mypage', '/login', '/search',
'/shop_cart', '/shop_payment', '/shop_order', '/shop_wish', '/shop_mypage/order', '/site_join'];
function pickHost() {
if (SKIP.indexOf(location.pathname.replace(/\/$/, '')) >= 0) return null;
var all = document.querySelectorAll(LIST_SEL);
var parents = [], groups = [];
for (var i = 0; i < all.length; i++) {
var el = all[i];
if (el.closest && el.closest(SLIDER)) continue;
var p = el.parentNode;
if (!p) continue;
var at = parents.indexOf(p);
if (at < 0) { parents.push(p); groups.push([el]); } else { groups[at].push(el); }
}
var best = -1;
for (var j = 0; j < groups.length; j++) {
if (groups[j].length >= 4 && (best < 0 || groups[j].length > groups[best].length)) best = j;
}
return best < 0 ? null : { host: parents[best], items: groups[best] };
}
function topBox(bar, host) {
var tools = document.querySelector('.shop-tools');
if (!tools || tools.dataset.slTop === '1') {
host.parentNode.insertBefore(bar, host);
return;
}
tools.dataset.slTop = '1';
var titleEl = tools.querySelector(':scope > .shop-title');
var raw = titleEl ? (titleEl.textContent || '').trim() : '';
var m = /^(.*?)[\s]*(\d+)$/.exec(raw);
var name = (m ? m[1] : raw).trim();
var cnt = m ? m[2] : '';
name = name.replace(/^\s*[\[(]?\s*PDF\s*[\])]?\s*/i, '').trim();
var box = document.createElement('div');
box.className = 'sl-top';
var head = document.createElement('div');
head.className = 'sl-tophead';
head.innerHTML = '<div class="sl-tt"><h2>' + name.replace(/</g, '&lt;') + '</h2>' +
(cnt ? '<span class="sl-cnt">' + cnt + '개</span>' : '') + '</div>';
var sort = tools.querySelector(':scope > .down-btn');
if (sort) {
var wrap = document.createElement('div');
wrap.className = 'sl-sort';
wrap.innerHTML = '<b>정렬</b>';
wrap.appendChild(sort);                 /* 아임웹 것을 그대로 옮겨 담습니다 */
head.appendChild(wrap);
}
box.appendChild(head);
var body = document.createElement('div');
body.className = 'sl-topbody';
body.appendChild(bar);
box.appendChild(body);
tools.parentNode.insertBefore(box, tools);
tools.style.display = 'none';
}
function advancedIntro(host, items, kindCount) {
if (!advancedPage() || document.getElementById('sl-advanced-intro')) return;
var intro = document.createElement('section');
intro.id = 'sl-advanced-intro';
intro.className = 'sl-book-intro';
intro.setAttribute('aria-labelledby', 'sl-advanced-title');
var fields = items.map(function (el) {
var m = /Field\s*(\d+)/i.exec(titleOf(el));
return m && el.dataset.slkind === '핵심요약' ? { n: Number(m[1]), url: urlOf(el) } : null;
}).filter(Boolean).sort(function (a, b) { return a.n - b.n; });
var available = ADVANCED_KINDS.filter(function (k) { return kindCount[k]; });
intro.innerHTML =
'<div class="sl-book-intro-head"><div><h1 id="sl-advanced-title">올림포스 고급영어독해 · 영미 비문학 읽기</h1>' +
'<p>교재에 맞는 핵심요약·변형문제·지문분석·워크북 자료를 종류별로 찾아보세요.</p>' +
'<p class="sl-book-status">현재 등록: ' + available.map(function (k) { return k + ' ' + kindCount[k] + '개'; }).join(' · ') + '</p></div>' +
'<nav aria-label="다른 올림포스 교재"><a href="/olympos-basic1">영어독해의 기본 1 →</a><a href="/olympos-basic2">영어독해의 기본 2 →</a></nav></div>' +
'<div class="sl-book-intro-row"><strong>자료 종류</strong><dl>' +
'<div><dt>핵심요약</dt><dd>Field별 핵심 내용 정리</dd></div>' +
'<div><dt>변형문제</dt><dd>유형편 · 심화편으로 구분</dd></div>' +
'<div><dt>지문분석</dt><dd>지문을 자세히 살펴보는 자료</dd></div>' +
'<div><dt>워크북</dt><dd>학습 내용을 연습하는 자료</dd></div>' +
'<div><dt>직전보강</dt><dd>시험 전 복습을 위한 자료</dd></div>' +
'<div><dt>교사용 한글파일</dt><dd>편집 가능한 자료 별도 분류</dd></div></dl></div>' +
'<div class="sl-book-intro-row"><strong>Field별<br>핵심요약</strong><div class="sl-book-fields"></div></div>' +
'<p class="sl-book-intro-note">아래에서 자료 종류를 선택하세요. 아직 등록되지 않은 종류는 미등록으로 표시됩니다.</p>';
var links = intro.querySelector('.sl-book-fields');
fields.forEach(function (field) {
var a = document.createElement('a');
a.href = field.url;
a.textContent = 'Field ' + field.n;
a.setAttribute('aria-label', 'Field ' + field.n + ' 핵심요약 상품 보기');
links.appendChild(a);
});
var anchor = document.querySelector('.shop-tools') || host;
anchor.parentNode.insertBefore(intro, anchor);
}
function pageNoOf(href) {
var m = /[?&]page=(\d+)/.exec(href || '');
return m ? +m[1] : 0;
}
function loadAllPages(host, items, done) {
var links = document.querySelectorAll('.pagination a[href*="page="]');
var max = 1;
for (var i = 0; i < links.length; i++) max = Math.max(max, pageNoOf(links[i].getAttribute('href')));
if (max <= 1 || !window.fetch || !window.DOMParser) return done(items);
var cur = pageNoOf(location.search) || 1;
var seen = {};
items.forEach(function (el) { seen[idxOf(el)] = 1; });
var base = location.pathname, sort = (/[?&]sort=([^&]+)/.exec(location.search) || [])[1] || 'recent';
var jobs = [];
for (var p = 1; p <= max; p++) {
if (p === cur) { jobs.push(Promise.resolve(null)); continue; }
jobs.push(fetch(base + '?page=' + p + '&sort=' + sort, { credentials: 'same-origin' })
.then(function (r) { return r.ok ? r.text() : ''; })
.catch(function () { return ''; }));
}
Promise.all(jobs).then(function (pages) {
var before = [], after = [];
pages.forEach(function (html, i) {
if (!html) return;
var doc = new DOMParser().parseFromString(html, 'text/html');
var scope = (host.id && doc.getElementById(host.id)) || doc;
[].forEach.call(scope.querySelectorAll(LIST_SEL), function (el) {
if (el.closest && el.closest(SLIDER)) return;
var id = idxOf(el);
if (!id || seen[id]) return;
seen[id] = 1;
var node = document.importNode(el, true);
(i + 1 < cur ? before : after).push(node);
});
});
function grab(html) {
var got = [];
var doc = new DOMParser().parseFromString(html || '', 'text/html');
var scope = (host.id && doc.getElementById(host.id)) || doc;
[].forEach.call(scope.querySelectorAll(LIST_SEL), function (el) {
if (el.closest && el.closest(SLIDER)) return;
var id = idxOf(el);
if (!id || seen[id]) return;
seen[id] = 1;
got.push(document.importNode(el, true));
});
return got;
}
function more(p) {
if (p > 60) return finish();
fetch(base + '?page=' + p + '&sort=' + sort, { credentials: 'same-origin' })
.then(function (r) { return r.ok ? r.text() : ''; })
.catch(function () { return ''; })
.then(function (html) {
var got = grab(html);
if (!got.length) return finish();
after.push.apply(after, got);
more(p + 1);
});
}
function finish() {
var first = items[0];
before.forEach(function (n) { host.insertBefore(n, first); });
after.forEach(function (n) { host.appendChild(n); });
[].forEach.call(document.querySelectorAll('.pagination'), function (pg) {
(pg.closest('nav') || pg).style.display = 'none';
});
done(before.concat(items, after));
}
if (max >= 10) more(max + 1); else finish();
});
}
function lessonOf(t) {
if (/전범위|패키지|\d\s*강?\s*[~\-]\s*(?:\d|TEST)/i.test(t)) return '';
var m = /TEST\s*(\d*)/i.exec(t);
if (m) return 'TEST' + (m[1] || '');
m = /(?:^|[^\d])(\d{1,2})\s*강/.exec(t);
return m ? String(+m[1]) : '';   /* 「04강」 = 「4강」 */
}
function lessonKey(s) {
return String(s || '').replace(/\s|강/g, '').toUpperCase();
}
function build() {
var got = pickHost();
if (!got) return;
var host = got.host;
if (host.dataset.slPills === '1') return;
host.dataset.slPills = '1';
host.classList.add('sl-grid', 'sl-lay-c');   /* 사장님이 고르신 목록형 */
loadAllPages(host, got.items, function (all) { if (!lessonTable(host, all)) build2(host, all); });
}
var PUB_NAME = {};
MID_PUBS.forEach(function (x) { PUB_NAME[x[0]] = x[1]; });
function propsOf(el) {
try { return JSON.parse(el.getAttribute('data-product-properties') || 'null') || {}; } catch (e) { return {}; }
}
function won(n) { return Number(n || 0).toLocaleString('ko-KR') + '원'; }
function genKind(t) {
for (var i = 1; i < KIND_RULES.length; i++) if (KIND_RULES[i][1].test(t)) return KIND_RULES[i][0];
return '내신대비 자료';
}
function lessonTable(host, items) {
if (midPage() || advancedPage() || fmtPage()) return false;
var codes = {}, g = 0, gram = [], other = [];
items.forEach(function (el) {
var t = titleOf(el), m = MID_RE.exec(t);
if (m) { codes[m[1]] = 1; g = +(/중학교\s*([1-3])\s*학년/.exec(t) || [0, 0])[1]; gram.push([el, t]); } else other.push([el, t]);
});
var cs = Object.keys(codes);
if (cs.length !== 1 || gram.length < 8) return false;
var code = cs[0], pub = PUB_NAME[code] || code;
var rows = {}, pk = {}, extra = [];
function row(n) { return rows[n] || (rows[n] = { n: n, gram: '', pdf: null, hwp: null, nsd: [] }); }
gram.forEach(function (x) {
var el = x[0], t = x[1], p = propsOf(el), hwp = HWP_RE.test(t);
var it = { idx: idxOf(el), u: urlOf(el), price: p.price, list: p.original_price, el: el };
if (/패키지/.test(t)) { pk[hwp ? 'hwp' : 'pdf'] = it; return; }
var m = /\]\s*(\d{1,2})\s*강\s*([^🩷]*)/.exec(t);
if (!m) return;
var r = row(+m[1]);
r.gram = r.gram || tidy(m[2]);
r[hwp ? 'hwp' : 'pdf'] = it;
});
other.forEach(function (x) {
var m = /(?:^|[^\d])(\d{1,2})\s*과/.exec(x[1]) || /Lesson\s*(\d{1,2})/i.exec(x[1]);
var it = { u: urlOf(x[0]), t: x[1], k: genKind(x[1]) };
if (m) row(+m[1]).nsd.push(it); else extra.push(it);
});
var keys = Object.keys(rows).map(Number).sort(function (a, b) { return a - b; });
var anyNsd = other.length > 0;
if (!document.getElementById('sl-lt-css')) {
var st = document.createElement('style');
st.id = 'sl-lt-css';
st.textContent =
'.sl-lt{max-width:1080px;margin:0 auto 40px;padding:0 16px;color:#1d3a5e;font-family:inherit}' +
'.sl-lt-hd{display:flex;flex-wrap:wrap;align-items:flex-end;gap:10px 18px;border-bottom:2px solid #1d3a5e;padding:6px 0 12px;margin-bottom:4px}' +
'.sl-lt-hd h2{font-size:24px;font-weight:800;margin:0}' +
'.sl-lt-hd .gr{font-size:13px;font-weight:700;color:#6b58a8;background:#efeafc;padding:3px 10px;border-radius:999px}' +
'.sl-lt-hd p{flex-basis:100%;margin:0;font-size:13px;color:#6b7686}' +
'.sl-lt-tb{width:100%;border-collapse:collapse;font-size:14px}' +
'.sl-lt-tb th{font-size:12px;color:#6b7686;font-weight:700;text-align:left;padding:10px 12px;border-bottom:1px solid #d9dee6;background:#f7f8fb}' +
'.sl-lt-tb td{padding:14px 12px;border-bottom:1px solid #e6e9ef;vertical-align:middle}' +
'.sl-lt-tb td.no{width:64px;font-size:18px;font-weight:800;white-space:nowrap}' +
'.sl-lt-tb td.ns{width:34%}' +
'.sl-lt-tb .nm{font-weight:800;font-size:15px}' +
'.sl-lt-tb .sub{font-size:12px;color:#6b7686;margin-top:2px}' +
'.sl-lt-tb .gp{font-weight:700;color:#6b58a8;margin-top:3px}' +
'.sl-lt-tb .soon{font-size:13px;color:#9aa3b0}' +
'.sl-lt-tb .nsl a{display:inline-block;margin:2px 6px 2px 0;font-size:13px;font-weight:700;color:#9a6a00;background:#fff7e6;border:1px solid #f3d28a;padding:5px 10px;border-radius:999px;text-decoration:none}' +
'.sl-lt-f{display:flex;gap:6px;flex-wrap:wrap}' +
'.sl-lt-f .fm{display:inline-flex;align-items:center;border:1px solid #d9dee6;border-radius:999px;overflow:hidden;background:#fff}' +
'.sl-lt-f .fm a{padding:6px 10px;font-size:13px;font-weight:800;color:#1d3a5e;text-decoration:none;white-space:nowrap}' +
'.sl-lt-f .fm a s{color:#9aa3b0;font-weight:500;margin-left:4px;font-size:11px}' +
'.sl-lt-f .fm a i{font-style:normal;font-weight:600;color:#6b7686;margin-left:4px}' +
'.sl-lt-f .fm.h a:first-child{color:#2c6a3f}' +
'.sl-lt-f .fm button{border:0;border-left:1px solid #d9dee6;background:#e85a8a;color:#fff;font:inherit;font-size:12px;font-weight:800;padding:6px 10px;cursor:pointer}' +
'.sl-lt-f .fm button:hover{background:#c33e6d}' +
'.sl-lt-tb tr.pk td{background:#faf8ff}' +
'.sl-lt-sw{display:block;margin:14px 0 0 auto;border:0;background:none;color:#6b7686;font:inherit;font-size:12px;text-decoration:underline;cursor:pointer}' +
'@media (max-width:760px){.sl-lt-tb thead{display:none}.sl-lt-tb,.sl-lt-tb tbody,.sl-lt-tb tr,.sl-lt-tb td{display:block;width:auto}' +
'.sl-lt-tb tr{border-bottom:1px solid #d9dee6;padding:10px 0}.sl-lt-tb td{border:0;padding:4px 0}.sl-lt-tb td.no{width:auto;font-size:16px}.sl-lt-tb td.ns{width:auto}.sl-lt-tb td.ns .soon:before{content:"내신대비 자료 · "}.sl-lt-f .fm a{padding:6px 8px}}';
document.head.appendChild(st);
}
function fm(it, label, cls) {
if (!it) return '';
return '<span class="fm' + (cls ? ' ' + cls : '') + '"><a href="' + it.u + '">' + label + '<i>' + won(it.price) + '</i>' +
(it.list && it.list > it.price ? '<s>' + won(it.list) + '</s>' : '') + '</a>' +
'<button type="button" data-lt-cart="' + it.idx + '">담기</button></span>';
}
function nsdCell(list) {
if (list.length) return '<div class="nsl">' + list.map(function (x) { return '<a href="' + x.u + '" title="' + x.t.replace(/"/g, '&quot;') + '">' + x.k + ' ↗</a>'; }).join('') + '</div>';
return '<div class="soon">곧 올라와요</div>';
}
var html = '<div class="sl-lt-hd"><h2>' + pub + '</h2>' + (g ? '<span class="gr">중학교 ' + g + '학년</span>' : '') +
'<p>과마다 왼쪽은 이 교과서 내신대비 자료, 오른쪽은 같은 과 문법만 따로 모은 「교과서 속 문법 ' + code + '」예요. PDF · 한글(HWP) 가운데 고르세요.</p></div>' +
'<table class="sl-lt-tb"><thead><tr><th>과</th><th>' + pub + ' 내신대비 자료</th><th>교과서 속 문법 ' + code + '</th><th>파일 고르기</th></tr></thead><tbody>' +
keys.map(function (n) {
var r = rows[n];
return '<tr><td class="no">' + n + '과</td>' +
'<td class="ns">' + (anyNsd || r.nsd.length ? nsdCell(r.nsd) : '<div class="soon">곧 올라와요</div>') + '</td>' +
'<td><div class="nm">교과서 속 문법 ' + code + ' ' + (n < 10 ? '0' : '') + n + '강</div>' + (r.gram ? '<div class="gp">' + r.gram + '</div>' : '') + '</td>' +
'<td><div class="sl-lt-f">' + fm(r.pdf, 'PDF') + fm(r.hwp, '한글(HWP)', 'h') + '</div></td></tr>';
}).join('') +
(pk.pdf || pk.hwp ? '<tr class="pk"><td class="no">전체</td><td class="ns">' + (extra.length ? nsdCell(extra) : '') + '</td>' +
'<td><div class="nm">교과서 속 문법 ' + code + ' 전범위 패키지</div><div class="sub">' + keys.length + '강 한 번에 · 30% 할인</div></td>' +
'<td><div class="sl-lt-f">' + fm(pk.pdf, 'PDF') + fm(pk.hwp, '한글(HWP)', 'h') + '</div></td></tr>' : '') +
'</tbody></table><button type="button" class="sl-lt-sw">상품 사진으로 보기</button>';
var box = document.createElement('div');
box.className = 'sl-lt';
box.innerHTML = html;
host.parentNode.insertBefore(box, host);
if (!host.id) host.id = 'sl-lt-host';
var hideCss = document.createElement('style');
hideCss.textContent = '#' + host.id + '{display:none!important}';
document.head.appendChild(hideCss);
var cards = {};
items.forEach(function (el) { cards[idxOf(el)] = el; });
box.addEventListener('click', function (e) {
var b = e.target.closest('[data-lt-cart]');
if (b) { addCart(b.getAttribute('data-lt-cart'), b, cards[b.getAttribute('data-lt-cart')]); return; }
if (e.target.closest('.sl-lt-sw')) {
var hid = !hideCss.disabled;
hideCss.disabled = hid;
e.target.textContent = hid ? '과별 표로 보기' : '상품 사진으로 보기';
if (hid) { items.forEach(function (el) { addGo(el); addActs(el); }); }
}
});
return true;
}
function build2(host, items) {
var kindCount = {}, bookCount = {}, kinds = [];
items.forEach(function (el) {
var h2 = el.querySelector('.shop-title');
var title = tidy(h2 ? h2.textContent : '');
var k = kindOf(title), b = bookOf(title);
el.dataset.slkind = k;
el.dataset.slbook = b;
el.dataset.sllesson = lessonKey(lessonOf(title));
if (k) { if (!kindCount[k]) { kindCount[k] = 0; kinds.push(k); } kindCount[k]++; }
if (b) bookCount[b] = (bookCount[b] || 0) + 1;
if (k && !el.querySelector('.sl-kindtag')) {
var h = el.querySelector('.shop-title');
if (h && h.parentNode) {
var tag = document.createElement('span');
tag.className = 'sl-kindtag k' + KIND_ORDER.indexOf(k);
tag.textContent = k;
h.parentNode.insertBefore(tag, h);
}
}
addGo(el);
addActs(el);
});
kinds.sort(sortBy(midPage() ? MID_ORDER : fmtPage() ? FMT_ORDER : KIND_ORDER));
if (advancedPage()) {
kinds = ADVANCED_KINDS.concat(kinds.filter(function (k) { return ADVANCED_KINDS.indexOf(k) < 0; }));
advancedIntro(host, items, kindCount);
}
var bar = document.createElement('div');
bar.className = 'sl-pills';
var any = false;
if (kinds.length > 1) {
any = true;
var line = document.createElement('div');
line.className = 'sl-pillrow';
line.innerHTML = '<span class="sl-plab">자료 종류</span>' +
'<div class="sl-pset">' +
'<button type="button" class="sl-pill on" aria-pressed="true" data-k="kind" data-v="">전체</button>' +
kinds.map(function (v) {
var count = kindCount[v] || 0;
return '<button type="button" class="sl-pill' + (count ? '' : ' sl-unlisted') + '" aria-pressed="false" data-k="kind" data-v="' +
v.replace(/"/g, '&quot;') + '">' + v + '<em>' + (count || '미등록') + '</em></button>';
}).join('') +
'</div>';
bar.appendChild(line);
}
var lessonSet = {};
items.forEach(function (el) { if (el.dataset.sllesson) lessonSet[el.dataset.sllesson] = 1; });
var lessons = Object.keys(lessonSet).sort(function (a, b) {
var ta = a.indexOf('TEST') === 0, tb = b.indexOf('TEST') === 0;
if (ta !== tb) return ta ? 1 : -1;
return (+a.replace('TEST', '') || 0) - (+b.replace('TEST', '') || 0);
});
function lessonLabel(k) {
if (k.indexOf('TEST') === 0) return k === 'TEST' ? 'TEST' : 'TEST ' + k.slice(4) + '강';
return k + '강';
}
if (lessons.length > 1) {
any = true;
var lline = document.createElement('div');
lline.className = 'sl-pillrow sl-lessonrow';
lline.innerHTML = '<span class="sl-plab">강</span>' +
'<div class="sl-pset">' +
'<button type="button" class="sl-pill on" aria-pressed="true" data-k="lesson" data-v="">전체</button>' +
lessons.map(function (v) {
return '<button type="button" class="sl-pill" aria-pressed="false" data-k="lesson" data-v="' + v + '">' +
lessonLabel(v) + '<em></em></button>';
}).join('') +
'</div>';
bar.appendChild(lline);
[].forEach.call(document.querySelectorAll('.sla2-chips'), function (set) {
var row = set.closest('.sla2-row');
(row || set).style.display = 'none';
});
}
var distinctBooks = Object.keys(bookCount).length;
if (distinctBooks > 1) {
any = true;
var box = document.createElement('div');
box.className = 'sl-books';
box.innerHTML =
'<div class="sl-bhead"><span class="sl-plab">교재</span>' +
'<button type="button" class="sl-pill on sl-ball" data-k="book" data-v="">전체 보기</button></div>' +
'<div class="sl-bgrid">' +
(midPage() ? [{ g: '중학교 ' + midPage() + '학년 교과서', list: MID_PUBS.filter(function (x) { return bookCount[x[0]]; }).map(function (x) { return [x[0], x[1], x[0]]; }) }] : BOOK_GROUPS).map(function (grp) {
return '<div class="sl-bcol"><div class="sl-bgt">' + grp.g + '</div>' +
grp.list.map(function (b) {
var n = bookCount[b[0]] || 0;
return '<button type="button" class="sl-bitem' + (n ? '' : ' off') + '"' +
(n ? '' : ' disabled') +
' data-k="book" data-v="' + b[0].replace(/"/g, '&quot;') + '">' +
'<span class="nm">' + b[1] + '</span>' +
(b[2] ? '<span class="yr">' + b[2] + '</span>' : '') +
'<span class="cn">' + (n || '·') + '</span></button>';
}).join('') +
'</div>';
}).join('') +
'</div>';
bar.appendChild(box);
}
if (!any) return;
var out = document.createElement('div');
out.className = 'sl-pillcount';
bar.appendChild(out);
topBox(bar, host);
var cntEl = document.querySelector('.sl-top .sl-cnt');
if (cntEl) cntEl.textContent = items.length + '개';
var pick = { kind: '', book: '', lesson: '' };
var empty;
if (advancedPage()) {
empty = document.createElement('p');
empty.className = 'sl-filter-empty';
empty.setAttribute('role', 'status');
empty.hidden = true;
host.parentNode.insertBefore(empty, host.nextSibling);
}
function apply() {
var n = 0;
items.forEach(function (el) {
var ok = true;
for (var k in pick) if (pick[k] && el.dataset['sl' + k] !== pick[k]) ok = false;
el.classList.toggle('sl-off', !ok);
if (ok) n++;
});
[].forEach.call(bar.querySelectorAll('.sl-pill[data-k="kind"], .sl-pill[data-k="lesson"]'), function (btn) {
var key = btn.dataset.k, val = btn.dataset.v;
var c = 0;
items.forEach(function (el) {
for (var k in pick) {
var want = k === key ? val : pick[k];
if (want && el.dataset['sl' + k] !== want) return;
}
c++;
});
var em = btn.querySelector('em');
if (val && em && !(c === 0 && btn.classList.contains('sl-unlisted'))) em.textContent = c;
var dead = !!val && !c && pick[key] !== val;
btn.disabled = dead;
btn.classList.toggle('sl-dead', dead);
});
out.textContent = n === items.length
? '모두 ' + items.length + '개'
: items.length + '개 가운데 ' + n + '개';
if (empty) {
empty.hidden = n > 0;
empty.textContent = n ? '' : '아직 등록된 ' + (pick.kind || '해당 종류의') + ' 자료가 없습니다. 전체 또는 핵심요약을 선택해 주세요.';
}
}
apply();
bar.addEventListener('click', function (e) {
var more = e.target.closest('.sl-more');
if (more) {                                   /* 접어 둔 알약 펴기 */
var row = more.closest('.sl-pillrow');
row.classList.toggle('sl-open');
more.innerHTML = row.classList.contains('sl-open')
? '접기 ▴' : '더보기 ▾<b>' + row.querySelectorAll('.sl-extra').length + '</b>';
return;
}
var b = e.target.closest('.sl-pill, .sl-bitem');
if (!b || b.disabled) return;
var k = b.dataset.k;
pick[k] = (pick[k] === b.dataset.v) ? '' : b.dataset.v;
[].forEach.call(bar.querySelectorAll('[data-k="' + k + '"]'), function (x) {
x.classList.toggle('on', x.dataset.v === pick[k]);
x.setAttribute('aria-pressed', String(x.dataset.v === pick[k]));
});
apply();
if (advancedPage()) {
history.replaceState(null, '', location.pathname + location.search + (pick.kind ? '#sl=' + encodeURIComponent(pick.kind) : ''));
}
});
var want = decodeURIComponent((location.hash || '').replace(/^#sl=/, ''));
if (want && location.hash.indexOf('#sl=') === 0) {
var hit = bar.querySelector('[data-k="kind"][data-v="' + want.replace(/"/g, '') + '"]');
if (hit && !hit.disabled) hit.click();
}
}
function fixAsk() {
var els = document.querySelectorAll('.pay, .sale_pay, ._prod_price, .prod_price');
for (var i = 0; i < els.length; i++) {
var e = els[i];
if (e.children.length) continue;
var t = (e.textContent || '').trim();
if (t === '가격문의') {
e.textContent = '교과서 자료는 쏠북에서 구매 가능합니다 (본문 참고)';
e.classList.add('sl-ask');
}
}
markNoPrice();
}
function fixScore() {
var boxes = document.querySelectorAll('.interlock_star_point, .star_point');
for (var i = 0; i < boxes.length; i++) {
var b = boxes[i];
if (b.querySelector('.sl-score')) continue;
var on = b.querySelectorAll('.bt-star.active').length;
if (!b.querySelectorAll('.bt-star').length) continue;
var s = document.createElement('span');
s.className = 'sl-score';
s.textContent = on.toFixed(1);
b.appendChild(s);
}
}
fixAsk(); fixScore();
window.addEventListener('load', function () { fixAsk(); fixScore(); });
setTimeout(function(){ fixAsk(); fixScore(); }, 500);
setTimeout(function(){ fixAsk(); fixScore(); }, 1600);
setTimeout(function(){ fixAsk(); fixScore(); }, 3200);
build();
window.addEventListener('load', build);
setTimeout(build, 400);
setTimeout(build, 1500);
setTimeout(build, 3000);
})();
