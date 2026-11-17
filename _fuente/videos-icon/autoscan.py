"""autoscan.py <video> [step]: OCR de los clips ya cortados cada <step> s; datos sensibles -> S/auto/<video>.json
(cajas en coordenadas del recorte, tiempo absoluto del vídeo). No modifica nada más."""
import subprocess,sys,os,re,csv,json
S=os.path.dirname(os.path.abspath(__file__)); v=sys.argv[1]; step=int(sys.argv[2]) if len(sys.argv)>2 else 10
PAT=re.compile(os.environ.get('PATX') or r'^ES\d{2}[\dA-Z]{10,}$|^ES\d{2}$|^[A-HJNPQRSUVW]\d{7}[\dA-J]$|^\d{8}[A-Z]$|^\d{11}$|RICARDO|PALMA|CL[IÍ]NICA|QUIR[OÓ]N|TELEF[OÓ]NICA|^ICON$|@[\w-]+\.\w+|^\+34|^IBAN$',re.I)
caps=json.load(open(f'{S}/analisis/{v}.capitulos.json')); cr=json.load(open(f'{S}/analisis/{v}.crop.json'))
tmp=f'{S}/cl/_s_{v}'+os.environ.get('SUF',''); os.makedirs(tmp,exist_ok=True)
hits=[]
CAPS=[int(x) for x in os.environ.get('CAPS','').split(',') if x]
for c in caps:
    if CAPS and c['n'] not in CAPS: continue
    clip=f"{S}/clips/{v}-cap{c['n']:02d}.mp4"; d=int(round(c['duracion'])); ini=int(round(c['inicio']))
    for t in range(1+int(os.environ.get('OFF','0')),d,step):
        png=f'{tmp}/f.png'; png3=f'{tmp}/f3.png'
        if subprocess.run(['ffmpeg','-nostdin','-v','error','-y','-ss',str(t),'-i',clip,'-frames:v','1',png]).returncode: continue
        W=int(subprocess.run(['ffprobe','-v','error','-show_entries','stream=width,height','-of','csv=p=0',clip],capture_output=True,text=True).stdout.split(',')[0])
        k=cr['w']/W
        subprocess.run(['ffmpeg','-nostdin','-v','error','-y','-i',png,'-vf','scale=iw*3:-1:flags=lanczos',png3],check=True)
        o=subprocess.run(['tesseract',png3,'stdout','-l','spa+eng','--psm','11','tsv'],capture_output=True).stdout.decode('utf-8','replace')
        rows=[r for r in csv.DictReader(o.splitlines(),delimiter='\t',quoting=csv.QUOTE_NONE) if (r.get('text') or '').strip() and r.get('level')=='5']
        for i,r in enumerate(rows):
            tx=r['text'].strip()
            if not PAT.search(tx): continue
            x,y,w,h=[int(r[q])/3 for q in('left','top','width','height')]
            if tx.upper()=='ICON' and i and rows[i-1]['text'].lower().startswith('desarrollo'):
                x=int(rows[i-1]['left'])/3; w=(int(r['left'])+int(r['width']))/3-x+90
            elif re.match(r'^(RICARDO|PALMA|CL[IÍ]NICA|QUIR)',tx,re.I) or tx.upper()=='IBAN':
                # extender a la línea completa para nombres
                same=[q for q in rows if q['block_num']==r['block_num'] and q['par_num']==r['par_num'] and q['line_num']==r['line_num']]
                x=min(int(q['left']) for q in same)/3; w=(max(int(q['left'])+int(q['width']) for q in same))/3-x
            hits.append({'t':ini+t,'tx':tx,'x':int(x*k)-6,'y':int(y*k)-4,'w':int(w*k)+12,'h':int(h*k)+8,'clip':os.path.basename(clip)})
        print(v,c['n'],t,len(hits),flush=True)
os.makedirs(f'{S}/'+os.environ.get('OUTD','auto'),exist_ok=True)
json.dump(hits,open(f'{S}/'+os.environ.get('OUTD','auto')+f'/{v}{os.environ.get("SUF","")}.json','w'),ensure_ascii=False,indent=1)
