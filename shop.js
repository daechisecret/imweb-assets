(function () {
var LIST_SEL = '.shop-item._shop_item';
var MANY = 9;            /* 알약이 이보다 많으면 접어 둡니다 */
var KIND_ORDER = ['패키지', '교사용 한글파일 (편집가능)', '변형문제 (유형편)', '변형문제 (심화편)',
'지문분석', '직전보강', '핵심요약', '워크북', '특강자료'];
var KIND_RULES = [
['교사용 한글파일 (편집가능)', /교사용\s*HWP|HWP\s*파일|한글\s*파일|HWP/i],
['변형문제 (심화편)', /심화편|심화\s*변형|고난도|서술형/],
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
['[2026] 올림포스 전국연합 기출 고2',   '전국연합 기출 고2',   '2026']
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
for (var i = 0; i < KIND_RULES.length; i++) if (KIND_RULES[i][1].test(t)) return KIND_RULES[i][0];
return '';
}
function bookOf(t) {
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
box.innerHTML =
'<button type="button" class="sl-act samp" data-sl-act="sample">샘플 보기</button>' +
'<button type="button" class="sl-act cart" data-sl-act="cart">장바구니</button>' +
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
'<button type="button" class="sl-act cart" data-sl-act="cart-modal">장바구니에 담기</button>' +
'<a class="sl-act" href="' + page + '" target="_blank" rel="noopener">상품 페이지에서 보기 ↗</a>' +
'</div></div>';
document.body.appendChild(m);
document.body.style.overflow = 'hidden';
function close() { m.remove(); document.body.style.overflow = ''; }
m.addEventListener('click', function (e) {
if (e.target === m || e.target.closest('[data-sl-act="close"]')) return close();
if (e.target.closest('[data-sl-act="cart-modal"]')) addCart(idxOf(el), e.target);
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
function addCart(idx, btn) {
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
else if (act === 'cart') addCart(idxOf(card), b);
else if (act === 'wish') addWish(idxOf(card), b);
}, true);
var SLIDER = '.swiper-container, .swiper-wrapper, .swiper, [class*="carousel"]';
function pickHost() {
if (location.pathname === '/') return null;
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
function build() {
var got = pickHost();
if (!got) return;
var host = got.host, items = got.items;
if (host.dataset.slPills === '1') return;
host.dataset.slPills = '1';
host.classList.add('sl-grid', 'sl-lay-c');   /* 사장님이 고르신 목록형 */
var kindCount = {}, bookCount = {}, kinds = [];
items.forEach(function (el) {
var h2 = el.querySelector('.shop-title');
var title = tidy(h2 ? h2.textContent : '');
var k = kindOf(title), b = bookOf(title);
el.dataset.slkind = k;
el.dataset.slbook = b;
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
kinds.sort(sortBy(KIND_ORDER));
var bar = document.createElement('div');
bar.className = 'sl-pills';
var any = false;
if (kinds.length > 1) {
any = true;
var line = document.createElement('div');
line.className = 'sl-pillrow';
line.innerHTML = '<span class="sl-plab">자료 종류</span>' +
'<div class="sl-pset">' +
'<button type="button" class="sl-pill on" data-k="kind" data-v="">전체</button>' +
kinds.map(function (v) {
return '<button type="button" class="sl-pill" data-k="kind" data-v="' +
v.replace(/"/g, '&quot;') + '">' + v + '<em>' + kindCount[v] + '</em></button>';
}).join('') +
'</div>';
bar.appendChild(line);
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
BOOK_GROUPS.map(function (grp) {
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
host.parentNode.insertBefore(bar, host);
var pick = { kind: '', book: '' };
function apply() {
var n = 0;
items.forEach(function (el) {
var ok = true;
for (var k in pick) if (pick[k] && el.dataset['sl' + k] !== pick[k]) ok = false;
el.classList.toggle('sl-off', !ok);
if (ok) n++;
});
out.textContent = n === items.length
? '모두 ' + items.length + '개'
: items.length + '개 가운데 ' + n + '개';
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
});
apply();
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
e.textContent = '본문 내 쏠북 링크 참고';
e.classList.add('sl-ask');
}
}
}
fixAsk();
window.addEventListener('load', fixAsk);
setTimeout(fixAsk, 500);
setTimeout(fixAsk, 1600);
setTimeout(fixAsk, 3200);
build();
window.addEventListener('load', build);
setTimeout(build, 400);
setTimeout(build, 1500);
setTimeout(build, 3000);
})();