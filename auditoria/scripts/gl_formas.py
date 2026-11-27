import json,glob,re,unicodedata,sys
def clave(s):
    s=unicodedata.normalize('NFD',s.lower()); s=''.join(c for c in s if unicodedata.category(c)!='Mn')
    return re.sub(r'^-|-$','',re.sub(r'[^a-z0-9]+','-',s.strip()))
def formas(t):
    out={t.strip()}
    sp=re.sub(r'\s+',' ',re.sub(r'\s*\([^)]*\)\s*',' ',t)).strip()
    if sp: out.add(sp)
    for p in re.split(r'\s+/\s+',sp):
        p=p.strip()
        if p and not re.match(r'^de\s',p,re.I): out.add(p)
    return [f for f in out if len(f)>=3]
def sing(c):
    return re.sub(r'(es|s)$','',c)
def cargar(d='.'):
    E=[]
    for f in sorted(glob.glob(d+'/*.json')):
        for e in json.load(open(f)):
            E.append((f.split('/')[-1][:-5],e))
    return E
if __name__=='__main__':
    E=cargar()
    m={}
    for i,(f,e) in enumerate(E):
        fs=formas(e['termino'])+[x for a in e.get('alias',[]) for x in formas(a)]
        for x in set(clave(y) for y in fs):
            m.setdefault(x,set()).add(i)
    grupos=[]
    for k,v in m.items():
        if len({E[i][1]['termino'] for i in v})>1 or len(v)>1:
            grupos.append((k,sorted(v)))
    vis=set()
    for k,v in sorted(grupos):
        t=tuple(v)
        if t in vis: continue
        vis.add(t)
        print(f'[{k}]', ' || '.join(f'{E[i][0]}:{E[i][1]["termino"]}' for i in v))
