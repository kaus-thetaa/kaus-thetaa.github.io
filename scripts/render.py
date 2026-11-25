from pathlib import Path
from string import Template
import json, html, re

ROOT = Path(__file__).resolve().parent.parent
ESC = html.escape
profile = json.loads((ROOT / 'data/profile.json').read_text())
projects = json.loads((ROOT / 'data/projects.json').read_text())['projects']
timeline = json.loads((ROOT / 'data/timeline.json').read_text())
if any(not p.get('confirmed') or '[verify]' in json.dumps(p) for p in projects):
    raise SystemExit('Confirm or remove unverified projects before rendering.')

def write(path, text):
    dest = ROOT / path
    dest.parent.mkdir(parents=True, exist_ok=True)
    dest.write_text(text)

ARROW = '<svg class="arrow" viewBox="0 0 24 24" aria-hidden="true"><path d="M5 19 19 5M5 5h14v14"/></svg>'
def link(url, label, cls=''):
    return f'<a class="{cls}" href="{ESC(url)}" rel="noopener">{ESC(label)}{ARROW}</a>'

def head(title, description, path='/', image='og.jpg'):
    return f'''<!doctype html>
<html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><meta name="theme-color" content="#101110"><title>{ESC(title)}</title><meta name="description" content="{ESC(description)}"><link rel="canonical" href="https://kaus-thetaa.github.io{path}"><meta property="og:title" content="{ESC(title)}"><meta property="og:description" content="{ESC(description)}"><meta property="og:type" content="website"><meta property="og:url" content="https://kaus-thetaa.github.io{path}"><meta property="og:image" content="https://kaus-thetaa.github.io/assets/{image}"><meta name="twitter:card" content="summary_large_image"><link rel="icon" href="/assets/favicon.svg" type="image/svg+xml"><link rel="preload" href="/assets/fonts/body.woff2" as="font" type="font/woff2" crossorigin><link rel="stylesheet" href="/css/tokens.css"><link rel="stylesheet" href="/css/style.css?v=20261125-5"></head><body><a class="skip-link" href="#main">Skip to content</a>'''

def nav():
    return f'''<header class="site-header shell"><a class="brand" href="/" aria-label="KC — Kaustubh Chaturvedi home">K<span>C</span><span class="brand-dot">.</span></a><span class="header-location">Independent mind.<br>Manipal, India <span id="local-time"></span></span><nav aria-label="Main navigation"><a href="/#work">Work</a><a href="/#journey">Journey</a><a href="/#about">About</a><a href="/#contact">Let’s talk {ARROW}</a></nav></header>'''

def footer():
    return f'''<footer class="site-footer shell"><div><span>Kaustubh Chaturvedi</span><span>Made with curiosity & code.</span></div><div>{link(profile['zanskar'],'Zanskar')}{link(profile['github'],'GitHub')}<a href="#main">Back to top {ARROW}</a></div></footer><script type="module" src="/js/app.js?v=20261125"></script></body></html>'''

def artwork(p):
    slug=p['slug']
    labels=''.join(f'<span>{ESC(s)}</span>' for s in p['diagram'])
    if slug=='ai-os':
        art='''<div class="ai-files" aria-hidden="true"><div class="document doc-back"><span>Index</span><i></i><i></i><i></i><b>01—</b></div><div class="document doc-front"><span>Local intelligence</span><strong>Aa</strong><i></i><i></i><small>Your files, understood.</small></div><div class="query-chip">Find it by meaning.<span>Local / private</span></div></div>'''
    elif slug=='orbit-gesture-studio':
        art='''<svg class="orbit-hand" viewBox="0 0 700 500" fill="none" aria-hidden="true"><g stroke="currentColor" stroke-width="1"><ellipse cx="350" cy="255" rx="205" ry="163" transform="rotate(-24 350 255)" opacity=".2"/><ellipse cx="350" cy="255" rx="205" ry="163" transform="rotate(35 350 255)" opacity=".2"/><circle cx="350" cy="255" r="206" opacity=".16"/><path d="M275 418 225 303 172 247 151 211 167 192 195 205 257 259 240 151 232 94 245 78 262 85 278 145 302 228 301 99 301 54 319 42 335 56 339 220 355 110 369 70 387 72 399 90 380 240 410 162 425 141 442 146 447 167 417 299 404 373 368 419Z" stroke-width="2"/><path d="m275 418 27-190 37-8 41 20 37 59-142 119m27-190-45 31-32 44 114-83 29 199 12-179-78-12m-45 31 111 160M302 228l115 71" opacity=".45"/></g><g fill="currentColor"><circle cx="275" cy="418" r="5"/><circle cx="302" cy="228" r="5"/><circle cx="339" cy="220" r="5"/><circle cx="380" cy="240" r="5"/><circle cx="257" cy="259" r="5"/><circle cx="417" cy="299" r="5"/><circle cx="368" cy="419" r="5"/></g></svg><span class="art-word orbit-word" aria-hidden="true">ORBIT</span>'''
    elif slug=='raceline-ai':
        art='''<svg class="race-track" viewBox="0 0 900 530" fill="none" aria-hidden="true"><path d="M200 170C115 60 620 20 690 139S534 255 585 347 280 495 222 384 308 280 200 170Z" stroke="#41443d" stroke-width="68"/><path d="M200 170C115 60 620 20 690 139S534 255 585 347 280 495 222 384 308 280 200 170Z" stroke="#a9b39d" stroke-width="1.5" stroke-dasharray="6 12"/><path d="M200 170C115 60 620 20 690 139S534 255 585 347 280 495 222 384 308 280 200 170Z" stroke="#d8e1cc" stroke-width="1" transform="translate(6 -8)"/><rect x="210" y="175" width="12" height="28" fill="#e2e5dc" transform="rotate(-25 216 189)"/></svg><span class="art-word race-word" aria-hidden="true">Learn.<br>Lap. Repeat.</span>'''
    elif slug=='veilrelay':
        art='''<div class="veil-type" aria-hidden="true"><span>Some things</span><span>stay <i>private.</i></span><div class="redaction"><span>Detected value</span><b>[REDACTED]</b></div></div>'''
    else:
        art='''<div class="ground-art" aria-hidden="true"><div class="ground-label"><span>Acquire.</span><span>Understand.</span><span>Act.</span></div><svg viewBox="0 0 900 300" fill="none"><path d="M0 150h900M0 75h900M0 225h900M150 0v300M300 0v300M450 0v300M600 0v300M750 0v300" stroke="currentColor" opacity=".12"/><path d="M0 235h90l18-15 18 20 22-55 22 48 23-130 24 112 22-48 22 24 20-75 25 65 20-132 20 90 25-72 25 80 26-43 25 75 30-30 25 39 30-19 25 48 32-20 30 43 25-15 25 25h130" stroke="currentColor" stroke-width="2"/></svg><strong>Signal to system.</strong></div>'''
    return f'<div class="project-art art-{slug}">{art}<div class="art-caption"><span>Concept study</span><span>{ESC(p["title"])}</span></div></div>'

def project_markup():
    output=[]
    for i,p in enumerate(projects):
        output.append(f'''<article class="work-item work-item-{i+1}" data-categories="{' '.join(p['category'])}"><a class="work-media" href="/projects/{p['slug']}/" aria-label="Explore {ESC(p['title'])}">{artwork(p)}<span class="media-open" aria-hidden="true">Explore project {ARROW}</span></a><div class="work-meta"><div><span class="work-category">{' / '.join(p['category'])}</span><h3><a href="/projects/{p['slug']}/">{ESC(p['title'])}</a></h3></div><p>{ESC(p['subtitle'])}</p></div></article>''')
    return ''.join(output)

def timeline_markup():
    groups=[]
    for group in timeline['groups']:
        entries=[]
        for entry in group['entries']:
            if not entry.get('confirmed') or '[verify]' in json.dumps(entry): continue
            e={k:ESC(str(v)) for k,v in entry.items()}
            ongoing=entry['end'] is None
            photo=''
            if entry.get('gallery'):
                slides=[]
                for index,item in enumerate(entry['gallery']):
                    slides.append(f'''<figure class="journey-slide{' is-active' if index == 0 else ''}" data-slide="{index}" aria-hidden="{'false' if index == 0 else 'true'}"><div class="journey-slide-frame"><img src="/assets/photos/{ESC(item['photo'])}.webp" alt="{ESC(item['alt'])}" width="{int(item['width'])}" height="{int(item['height'])}" loading="lazy" decoding="async"></div><figcaption>{ESC(item['caption'])}</figcaption></figure>''')
                photo=f'''<div class="journey-gallery" data-gallery aria-label="thrustMIT engineering photographs"><div class="journey-slides">{''.join(slides)}</div><div class="gallery-controls"><span class="gallery-count" aria-live="polite">01 / {len(slides):02d}</span><div><button type="button" data-gallery-prev aria-label="Previous photograph">←</button><button type="button" data-gallery-next aria-label="Next photograph">→</button></div></div></div>'''
            elif entry.get('photo'):
                photo=f'<figure class="journey-photo"><img src="/assets/photos/{e["photo"]}.webp" alt="{e["photoAlt"]}" width="1600" height="{1200 if entry["photo"]=="thrustmit-rocket" else 900}" loading="lazy" decoding="async"><figcaption>{e["photoCaption"]}</figcaption></figure>'
            org=link(entry['url'],entry['organization']) if entry.get('url') else e['organization']
            entries.append(f'''<li class="journey-entry {e.get('emphasis','')}"><div class="journey-date"><time datetime="{e['start']}">{e['dateLabel']}</time>{'<span class="ongoing">Current role</span>' if ongoing else ''}</div><p class="journey-org">{org}</p><h4>{e['role']}</h4><p class="journey-description">{e['description']}</p><span class="journey-category">{e['type']}</span>{photo}</li>''')
        year=ESC(group['year'])
        groups.append(f'<section class="journey-year-group" id="year-{year}" data-year="{year}" aria-labelledby="label-{year}"><h3 id="label-{year}">{year}</h3><ol>{"".join(entries)}</ol></section>')
    return ''.join(groups)

def syntax_field():
    source=(ROOT/'js/sculpture.js').read_text()
    lines=source.splitlines()[7:39]
    def highlight(line):
        tokens=re.split(r"(//.*|\"[^\"]*\"|'[^']*'|\b(?:const|let|function|return|if|for|of|true|false)\b|\b\d+(?:\.\d+)?\b)",line)
        result=[]
        for token in tokens:
            cls='comment' if token.startswith('//') else 'string' if token.startswith(("'",'"')) else 'keyword' if token in ['const','let','function','return','if','for','of','true','false'] else 'number' if re.fullmatch(r'\d+(?:\.\d+)?',token) else 'plain'
            result.append(f'<span class="syntax-{cls}">{ESC(token)}</span>')
        return ''.join(result)
    return ''.join('<div class="syntax-column">'+''.join(f'<div class="syntax-line" style="--line:{index}">'+highlight(line)+'</div>' for index,line in enumerate(lines[offset:]+lines[:offset]))+'</div>' for offset in [0,8,16,24])

context={
 'syntax_field':syntax_field(),
 'nav':nav(),'footer':footer(),'arrow':ARROW,'project_items':project_markup(),'timeline_groups':timeline_markup(),
 'github':link(profile['github'],'GitHub'),'zanskar':link(profile['zanskar'],'Zanskar'),
 'linkedin':link(profile['linkedin'],'LinkedIn'),'instagram':link(profile['instagram'],'Instagram'),
 'email':ESC(profile['publicEmail']),
 'year_links':''.join(f'<a href="#year-{g["year"]}" class="year-link">{g["year"]}</a>' for g in timeline['groups']),
}
body=Template((ROOT/'templates/home.html').read_text()).substitute(context)
schema={'@context':'https://schema.org','@type':'Person','name':profile['displayName'],'url':'https://kaus-thetaa.github.io/','email':profile['publicEmail'],'sameAs':[profile['github'],profile['linkedin'],profile['instagram']],'affiliation':{'@type':'CollegeOrUniversity','name':'MIT Manipal'},'description':'Computer Science and Engineering student building AI and software systems.'}
write('index.html',head('Kaustubh Chaturvedi — ML, software & a curious mind','ML engineer and CSE student at MIT Manipal. Explore the systems I build, my engineering and leadership journey, and what comes next.').replace('</head>','<script type="application/ld+json">'+json.dumps(schema)+'</script></head>')+body)
for p in projects:
    write('projects/'+p['slug']+'/index.html',head(p['title']+' — Kaustubh Chaturvedi',p['problem'],'/projects/'+p['slug']+'/',p['slug']+'-og.jpg')+nav()+f'''<main id="main" class="case-page shell"><a class="back-link" href="/#work">Back to the work</a><header class="case-heading"><span>{' / '.join(p['category'])}</span><h1>{ESC(p['title'])}</h1><p>{ESC(p['subtitle'])}</p></header>{artwork(p)}<div class="case-layout"><article><h2>The problem.</h2><p>{ESC(p['problem'])}</p><h2>What I built.</h2><p>{ESC(p['built'])}</p><p>{ESC(p['detail'])}</p><h2>What it does.</h2><p>{ESC(p['result'])}</p><h2>The constraints.</h2><p>{ESC(p['limit'])}</p><p class="source-note">{link(p['sourceUrl'],'Read the project documentation')}</p></article><aside><h2>Inside the system</h2><ol class="architecture">{''.join('<li>'+ESC(s)+'</li>' for s in p['diagram'])}</ol><p class="small">Conceptual architecture</p><ul class="stack-tags">{''.join('<li>'+ESC(s)+'</li>' for s in p['stack'])}</ul>{link(p['repoUrl'],'View source','action-link')}{link(p['demo'],'Open simulation','action-link') if p.get('demo') else ''}</aside></div><div class="case-next"><h2>Something on your mind?</h2>{link('mailto:'+profile['publicEmail'],'Let’s talk','action-link')}</div></main>'''+footer())
write('404.html',head('Page not found — Kaustubh Chaturvedi','This page could not be found.')+nav()+'<main id="main" class="not-found shell"><span>404</span><h1>A small<br>wrong turn.</h1><a class="action-link" href="/">Back to the portfolio '+ARROW+'</a></main>'+footer())
write('robots.txt','User-agent: *\nAllow: /\nSitemap: https://kaus-thetaa.github.io/sitemap.xml\n')
write('sitemap.xml','<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">'+''.join('<url><loc>https://kaus-thetaa.github.io'+p+'</loc></url>' for p in ['/']+['/projects/'+p['slug']+'/' for p in projects])+'</urlset>')
