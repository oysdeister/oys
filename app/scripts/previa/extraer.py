import re, base64, json, subprocess, os, sys, html as H
# Uso: PREVIA_TRABAJO=<carpeta con fuentes/guia-*.html> python3 app/scripts/previa/extraer.py
S=os.environ.get('PREVIA_TRABAJO', os.path.abspath('previa-trabajo'))
APP=os.path.abspath(os.path.join(os.path.dirname(__file__), '..', '..'))
TMP=S+'/previa/tmpimg'; os.makedirs(TMP,exist_ok=True)

def strip_tags(s): return H.unescape(re.sub(r'<[^>]+>','',s)).strip()

for g in ['contabilidad','erp']:
    src=open(f'{S}/fuentes/guia-{g}.html',encoding='utf-8').read()
    outdir=f'{APP}/public/img/previa/{g}'; os.makedirs(outdir,exist_ok=True)
    nav=re.search(r'<nav>(.*?)</nav>',src,re.S).group(1)
    navTitulo=strip_tags(re.search(r'<h2>(.*?)</h2>',nav,re.S).group(1))
    navItems={m.group(1):(strip_tags(m.group(2)),strip_tags(m.group(3))) for m in re.finditer(r'<a href="#([^"]+)"><span>(.*?)</span>(.*?)</a>',nav,re.S)}
    hero=re.search(r'<header class="hero">(.*?)</header>',src,re.S).group(1)
    kicker=strip_tags(re.search(r'<div class="kicker">(.*?)</div>',hero,re.S).group(1))
    titulo=strip_tags(re.search(r'<h1>(.*?)</h1>',hero,re.S).group(1))
    heroPs=[p.strip() for p in re.findall(r'<p>(.*?)</p>',hero,re.S)]
    caps=[]; nimg=0; svgn=0
    for m in re.finditer(r'<section class="ch" id="([^"]+)">(.*?)</section>',src,re.S):
        cid, body = m.group(1), m.group(2)
        num=strip_tags(re.search(r'<div class="num">(.*?)</div>',body,re.S).group(1))
        body=re.sub(r'\s*<div class="num">.*?</div>','',body,count=1,flags=re.S)
        h2=re.search(r'<h2>(.*?)</h2>',body,re.S).group(1).strip()
        body=re.sub(r'\s*<h2>.*?</h2>','',body,count=1,flags=re.S)
        lead=''
        lm=re.match(r'\s*<p class="lead">(.*?)</p>',body,re.S)
        if lm: lead=lm.group(1).strip(); body=body[lm.end():]
        body=re.sub(r'\s*<footer>.*?</footer>','',body,flags=re.S)
        # imágenes
        k=[0]
        def img(mm):
            k[0]+=1
            b64=mm.group(1); name=f'{cid}-{k[0]}'
            jp=f'{TMP}/{g}-{name}.jpg'; open(jp,'wb').write(base64.b64decode(b64))
            w=int(re.search(r'pixelWidth: (\d+)',subprocess.run(['sips','-g','pixelWidth',jp],capture_output=True,text=True).stdout).group(1))
            args=['/opt/homebrew/bin/cwebp','-quiet','-q','80']
            if w>1600: args+=['-resize','1600','0']
            subprocess.run(args+[jp,'-o',f'{outdir}/{name}.webp'],check=True)
            info=subprocess.run(['/opt/homebrew/bin/webpinfo',f'{outdir}/{name}.webp'],capture_output=True,text=True).stdout
            W=int(re.search(r'Width: (\d+)',info).group(1)); Hh=int(re.search(r'Height: (\d+)',info).group(1))
            return f'src="{{{{IMG}}}}/{g}/{name}.webp" width="{W}" height="{Hh}" loading="lazy" decoding="async"'
        body,n=re.subn(r'src="data:image/jpeg;base64,([^"]+)"',img,body)
        nimg+=n
        # svg con <style> propio: prefijar clases
        def fixsvg(sm):
            svg=sm.group(0)
            st=re.search(r'<style>(.*?)</style>',svg,re.S)
            if not st: return svg
            classes=set(re.findall(r'\.([a-zA-Z][\w-]*)\s*\{',st.group(1)))
            css=st.group(1)
            for c in classes: css=re.sub(r'\.'+c+r'(?=\s*\{)', '.pvs-'+c, css)
            svg=svg.replace(st.group(1),css)
            def cls(cm):
                return 'class="'+' '.join(('pvs-'+x if x in classes else x) for x in cm.group(1).split())+'"'
            svg=re.sub(r'class="([^"]*)"',cls,svg)
            return svg
        body=re.sub(r'<svg.*?</svg>',fixsvg,body,flags=re.S)
        # enlace al examen
        body=body.replace('<a href="examen.html"><b>examen.html</b></a>, en esta misma carpeta',f'<a href="#/formacion/{g}/examen"><b>el examen de esta guía</b></a>')
        body=body.replace('<a href="examen.html"><b>examen.html</b></a>',f'<a href="#/formacion/{g}/examen"><b>Examen de la guía</b></a>')
        assert 'examen.html' not in body, (cid, body[body.find('examen.html')-200:body.find('examen.html')+50])
        # enlaces externos: target _blank rel noopener
        def ext(am):
            a=am.group(0)
            if 'target=' not in a: a=a[:-1]+' target="_blank" rel="noopener">'
            elif 'rel=' not in a: a=a[:-1]+' rel="noopener">'
            return a
        body=re.sub(r'<a [^>]*href="https?://[^"]*"[^>]*>',ext,body)
        # prefijo pv- a todas las clases del contenido (evita choques con la app)
        body=re.sub(r'class="([^"]*)"',lambda cm:'class="'+' '.join(x if x.startswith('pvs-') else 'pv-'+x for x in cm.group(1).split())+'"',body)
        ns,nt=navItems.get(cid,('',''))
        body=re.sub(r'\n\s*\n','\n',body.strip())
        pre=lambda t: re.sub(r'class="([^"]*)"',lambda cm:'class="'+' '.join('pv-'+x for x in cm.group(1).split())+'"',t)
        caps.append(dict(id=cid,num=num,nav=ns,navTitulo=nt,titulo=pre(h2),lead=pre(lead),html=body))
    print(g,'capítulos',len(caps),'imágenes',nimg)
    data=dict(slug=g,titulo=titulo,navTitulo=navTitulo,kicker=kicker,heroHtml=heroPs,capitulos=caps)
    ts=("/* Generado desde guia-%s.html (formación previa). Contenido propio y estático: el HTML de cada capítulo se pinta tal cual.\n"
        "   {{IMG}} se sustituye al pintar por la carpeta de imágenes (BASE_URL + img/previa). */\n"
        "import type { GuiaPreviaDatos } from '../../lib/previa';\n\n"
        "const guia: GuiaPreviaDatos = %s;\n\nexport default guia;\n") % (g, json.dumps(data,ensure_ascii=False,indent=1))
    open(f'{APP}/src/content/previa/{g}.ts','w',encoding='utf-8').write(ts)
