# -*- coding: utf-8 -*-
"""
전체 사이트맵(sitemap-all.xml)을 새로 만듭니다 — 2026-11-07

    python tools/build_sitemap.py               만들기만
    python tools/build_sitemap.py --push        만들고 바뀌었으면 커밋 · 푸시(sitemap-all.xml 만)
    python tools/build_sitemap.py --post 175462488 --push
                                                칼럼 목록(index.json)에 아직 번호가 없는 새 글을 바로 넣기

왜 있나
  아임웹 사이트맵(https://www.daechisecret.com/sitemap.xml)은 상품을 1,000개까지만 담고
  게시판 글(시크릿 자료실 칼럼)은 담지 않습니다. 그래서 robots.txt 에
  https://daechisecret.github.io/imweb-assets/sitemap-all.xml 을 따로 적어 두었습니다.

무엇을 담나 (지난번 sitemap-all.xml 을 바탕으로 더하기만 합니다 — 한 번 넣은 주소는 남깁니다)
  ① 시크릿 자료실 칼럼 전부   column/index.json · imwebcss/parts/column/index.json · --post 번호
  ② 판매 중 상품 전부         지난번 목록 + 아임웹 sitemap.xml(새 상품) + imwebcss/parts/catalog.json
  ③ 주요 페이지               지난번 목록 + 아임웹 sitemap.xml 의 페이지
  상품 주소는 상품 화면의 정식 주소(canonical)와 같은 /shop_view/?idx=번호 로 씁니다.

아임웹은 짧은 시간에 요청이 많으면 「요청 과다」 화면을 주므로 sitemap.xml 한 번만 받습니다.
칼럼을 올리는 흐름(make_post.py --post · pubcol.mjs --go)이 끝에 이 파일을 --push 로 부릅니다.
"""
import io, json, os, re, subprocess, sys, time, urllib.request
from datetime import date
from xml.sax.saxutils import escape

for _s in (sys.stdout, sys.stderr):
    try: _s.reconfigure(encoding='utf-8', errors='replace')
    except Exception: pass

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
OUT = os.path.join(ROOT, 'sitemap-all.xml')
SITE = 'https://www.daechisecret.com'
IMWEBCSS = os.path.join(os.path.expanduser('~'), 'imwebcss')
INDEXES = [os.path.join(ROOT, 'column', 'index.json'),
           os.path.join(IMWEBCSS, 'parts', 'column', 'index.json')]
CATALOG = os.path.join(IMWEBCSS, 'parts', 'catalog.json')
UA = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/130.0 Safari/537.36'
TODAY = date.today().isoformat()

args = sys.argv[1:]
PUSH = '--push' in args
extra_posts = [int(args[i + 1]) for i, a in enumerate(args) if a == '--post' and i + 1 < len(args) and args[i + 1].isdigit()]


def col_url(n):
    return '%s/secret-library/?bmode=view&idx=%d' % (SITE, int(n))


def prod_url(n):
    return '%s/shop_view/?idx=%d' % (SITE, int(n))


def kdate(s):
    """「2026년 11월 7일」 → 2026-11-07"""
    m = re.search(r'(\d{4})\D+(\d{1,2})\D+(\d{1,2})', s or '')
    return '%s-%02d-%02d' % (m.group(1), int(m.group(2)), int(m.group(3))) if m else None


# ── 지난번 사이트맵 (주소 → lastmod, priority) ──
prev = {}
if os.path.exists(OUT):
    for blk in re.findall(r'<url>(.*?)</url>', io.open(OUT, encoding='utf-8').read(), re.S):
        loc = re.search(r'<loc>(.*?)</loc>', blk)
        if not loc: continue
        u = loc.group(1).replace('&amp;', '&')
        lm = re.search(r'<lastmod>(.*?)</lastmod>', blk)
        pr = re.search(r'<priority>(.*?)</priority>', blk)
        prev[u] = (lm.group(1) if lm else None, pr.group(1) if pr else None)

cols, prods, pages = {}, {}, {}
def board_post(u):
    """게시판 글 주소면 글 번호(순서가 다른 ?idx=…&bmode=view 도 같은 글)"""
    m = re.search(r'/secret-library/\?.*idx=(\d+)', u)
    return int(m.group(1)) if m and 'bmode=view' in u else None


for u, (lm, pr) in prev.items():
    if board_post(u): cols[col_url(board_post(u))] = lm
    elif '/shop_view/' in u: prods[u] = lm
    else: pages[u] = (lm, pr)

# ── ① 칼럼 ──
seen_post = set()
for p in INDEXES:
    if not os.path.exists(p): continue
    for c in json.load(io.open(p, encoding='utf-8')).get('posts', []):
        n = c.get('post')
        if not n or n in seen_post: continue
        seen_post.add(n)
        u = col_url(n)
        cols[u] = kdate(c.get('updated')) or cols.get(u) or TODAY
for n in extra_posts:
    cols.setdefault(col_url(n), TODAY)

# ── ② ③ 아임웹 sitemap.xml (한 번만) ──
imweb_n = 0
try:
    req = urllib.request.Request(SITE + '/sitemap.xml', headers={'User-Agent': UA})
    xml = urllib.request.urlopen(req, timeout=60).read().decode('utf-8', 'replace')
    if '<urlset' not in xml:
        raise ValueError('사이트맵이 아닌 화면을 받았습니다(요청 과다일 수 있음)')
    for blk in re.findall(r'<url>(.*?)</url>', xml, re.S):
        loc = re.search(r'<loc>\s*(.*?)\s*</loc>', blk)
        if not loc: continue
        u = loc.group(1).replace('&amp;', '&').replace('://daechisecret.com', '://www.daechisecret.com')
        lm = re.search(r'<lastmod>\s*(.*?)\s*</lastmod>', blk)
        lm = lm.group(1)[:10] if lm else None
        m = re.search(r'/shop_view/(?:\?idx=)?(\d+)', u)
        imweb_n += 1
        if board_post(u):
            cols.setdefault(col_url(board_post(u)), lm or TODAY)
        elif m:
            pu = prod_url(m.group(1))
            prods[pu] = lm or prods.get(pu)
        elif u not in pages:
            pages[u] = (lm, None)
except Exception as e:
    print('⚠ 아임웹 sitemap.xml 을 못 받았습니다 — 지난번 목록으로만 만듭니다:', e)

# 상품 목록표(imwebcss) — 진열 중인 것만
if os.path.exists(CATALOG):
    try:
        cat = json.load(io.open(CATALOG, encoding='utf-8'))
        cols_ = cat.get('columns') or []
        for r in cat.get('rows') or []:
            if isinstance(r, list): r = dict(zip(cols_, r))
            if not isinstance(r, dict): continue
            st = str(r.get('진열상태', 'Y'))
            n = r.get('상품번호')
            if not n: continue
            if st == 'Y':
                prods.setdefault(prod_url(n), None)
            elif st == 'N':          # 진열 안 함 → 빼기
                prods.pop(prod_url(n), None)
    except Exception as e:
        print('⚠ catalog.json 읽기 실패:', e)

# ── 칼럼 처음 올린 날(구조화 데이터 datePublished) → column/published.json ──
#   board.js 가 글 보기 화면에서 이 표를 읽어 BlogPosting 에 넣습니다.
#   아임웹 RSS(최근 50개, 정확한 시각) > 이미 적어 둔 값 > git 에서 그 글 번호가 처음 들어간 시각
PUB = os.path.join(ROOT, 'column', 'published.json')
pub = json.load(io.open(PUB, encoding='utf-8')) if os.path.exists(PUB) else {}
pub_old = dict(pub)
try:
    time.sleep(2)
    req = urllib.request.Request(SITE + '/rss', headers={'User-Agent': UA})
    rss = urllib.request.urlopen(req, timeout=60).read().decode('utf-8', 'replace')
    from email.utils import parsedate_to_datetime
    for it in re.findall(r'<item>(.*?)</item>', rss, re.S):
        lk = re.search(r'<link>(.*?)</link>', it); pd = re.search(r'<pubDate>(.*?)</pubDate>', it)
        if lk and pd and '/secret-library/' in lk.group(1):
            n = re.search(r'idx=(\d+)', lk.group(1))
            if n and n.group(1) not in pub:
                pub[n.group(1)] = parsedate_to_datetime(pd.group(1)).isoformat()
except Exception as e:
    print('⚠ RSS 를 못 받았습니다:', e)
for u in cols:
    n = str(board_post(u))
    if n in pub: continue
    r = subprocess.run(['git', 'log', '-S' + n, '--reverse', '--format=%cI', '--', 'column/index.json', 'sitemap-all.xml'],
                       cwd=ROOT, capture_output=True, text=True, encoding='utf-8')
    first = (r.stdout.strip().splitlines() or [None])[0]
    pub[n] = first or (TODAY + 'T09:00:00+09:00')
if pub != pub_old:
    io.open(PUB, 'w', encoding='utf-8', newline='\n').write(json.dumps(dict(sorted(pub.items())), ensure_ascii=False, indent=1) + '\n')

# 지운 페이지 — 지난 목록·아임웹 sitemap 에 남아 있어도 넣지 않음
#   2026-11-07 사장님 승인으로 지운 숨김 광고 랜딩 9개(캡처: 바탕화면 [찌꺼기지우세요]\삭제한_랜딩페이지_20261107)
REMOVED = {'step1landing', 'step2landing', 'step3landing', 'step4landing', 'step5landing',
           '98step3landing', '103landing', '104', '105'}
for u in list(pages):
    if u.split('daechisecret.com/', 1)[-1].split('?')[0].strip('/') in REMOVED:
        del pages[u]

# ── 쓰기 ──
def row(u, lm, pr):
    s = '<url><loc>%s</loc>' % escape(u)
    if lm: s += '<lastmod>%s</lastmod>' % lm
    if pr: s += '<priority>%s</priority>' % pr
    return s + '</url>'

key = lambda u: int(re.search(r'idx=(\d+)', u).group(1))
lines = ['<?xml version="1.0" encoding="UTF-8"?>',
         '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">']
lines += [row(u, cols[u], '0.9') for u in sorted(cols, key=key)]
lines += [row(u, lm, pr or '0.7') for u, (lm, pr) in pages.items()]
lines += [row(u, prods[u], '0.6') for u in sorted(prods, key=key, reverse=True)]
lines.append('</urlset>')
text = '\n'.join(lines) + '\n'
old = io.open(OUT, encoding='utf-8').read() if os.path.exists(OUT) else ''
io.open(OUT, 'w', encoding='utf-8', newline='\n').write(text)
print('sitemap-all.xml — 칼럼 %d · 페이지 %d · 상품 %d (모두 %d, 아임웹 sitemap %d줄 반영)' % (
    len(cols), len(pages), len(prods), len(cols) + len(pages) + len(prods), imweb_n))

if not PUSH:
    raise SystemExit
if text == old and pub == pub_old:
    print('바뀐 것이 없어 올리지 않았습니다.')
    raise SystemExit


def git(*a):
    return subprocess.run(('git',) + a, cwd=ROOT, capture_output=True, text=True, encoding='utf-8')


git('add', 'sitemap-all.xml', 'column/published.json')
msg = '사이트맵 자동 갱신: 칼럼 %d · 상품 %d · 페이지 %d\n\nCo-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>' % (len(cols), len(prods), len(pages))
r = git('commit', '-m', msg, '--', 'sitemap-all.xml', 'column/published.json')
if r.returncode:
    print('커밋 못 함:', r.stdout + r.stderr); raise SystemExit(1)
for i in range(3):
    r = git('push')
    if r.returncode == 0:
        print('올렸습니다 — 10분 안에 https://daechisecret.github.io/imweb-assets/sitemap-all.xml 에 반영'); break
    git('pull', '--rebase', '--autostash')
    time.sleep(2)
else:
    print('푸시 못 함:', r.stderr); raise SystemExit(1)
