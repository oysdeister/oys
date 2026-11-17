"""apply_auto.py <video>: convierte auto/<video>.json en cajas 'auto' de analisis/<video>.crop.json y lista los clips afectados."""
import json,os,sys
S=os.path.dirname(os.path.abspath(__file__)); v=sys.argv[1]; step=10
import glob
hits=[]
for f in sorted(glob.glob(f'{S}/auto/{v}.json')+glob.glob(f'{S}/auto/{v}_s5*.json')+glob.glob(f'{S}/auto_val/{v}_v.json')): hits+=json.load(open(f))
hits.sort(key=lambda h:(h['t']))
groups=[]
for h in hits:
    for g in groups:
        if abs(g['x']-h['x'])<40 and abs(g['y']-h['y'])<14 and h['t']-g['hasta']<=4*step:
            g['x0']=min(g['x0'],h['x']); g['y0']=min(g['y0'],h['y']); g['x1']=max(g['x1'],h['x']+h['w']); g['y1']=max(g['y1'],h['y']+h['h']); g['hasta']=h['t']+step; g['tx'].add(h['tx']); break
    else:
        groups.append({'x':h['x'],'y':h['y'],'x0':h['x'],'y0':h['y'],'x1':h['x']+h['w'],'y1':h['y']+h['h'],'desde':h['t']-step,'hasta':h['t']+step,'tx':{h['tx']}})
for g in groups:
    if g['tx'] & {'IBAN','iban'}:
        g['x1']=max(g['x1'],g['x0']+230); g['y1']+=26
auto=[{'desde':max(0,g['desde']),'hasta':g['hasta'],'x':max(0,g['x0']),'y':max(0,g['y0']),'w':g['x1']-g['x0'],'h':g['y1']-g['y0'],'motivo':'auto: '+', '.join(sorted(g['tx']))[:60]} for g in groups]
cp=f'{S}/analisis/{v}.crop.json'; c=json.load(open(cp)); c['auto']=auto; json.dump(c,open(cp,'w'),ensure_ascii=False,indent=1)
caps=json.load(open(f'{S}/analisis/{v}.capitulos.json')); afect=set()
for a in auto:
    for cap in caps:
        ini=cap['inicio']; fin=ini+cap['duracion']
        if a['hasta']>ini and a['desde']<fin: afect.add(cap['n'])
print(v,len(hits),'hits',len(auto),'cajas; recortar caps',sorted(afect))
