"""Hojas de contacto de los clips: 1 fotograma cada 15 s, 8 columnas, 64 por hoja. Uso: sheets.py <id> -> S/hs2/<id>_NN.png + índice"""
import json,os,subprocess,sys,glob
S=os.path.dirname(os.path.abspath(__file__)); v=sys.argv[1]; step=15
out=os.path.join(S,'hs2'); fr=os.path.join(S,'fr2',v); os.makedirs(out,exist_ok=True); os.makedirs(fr,exist_ok=True)
for f in glob.glob(fr+'/*'): os.remove(f)
caps=json.load(open(f'{S}/analisis/{v}.capitulos.json'))
idx=[]; k=0
for c in caps:
    clip=f"{S}/clips/{v}-cap{c['n']:02d}.mp4"
    d=int(round(c['duracion']))
    for t in range(0,d,step):
        k+=1; subprocess.run(['ffmpeg','-nostdin','-v','error','-y','-ss',str(t),'-i',clip,'-frames:v','1','-vf','scale=240:135:force_original_aspect_ratio=decrease,pad=240:135:(ow-iw)/2:(oh-ih)/2',f'{fr}/f_{k:04d}.png'])
        idx.append((k,c['n'],t))
n=k; sh=0
for a in range(1,n+1,64):
    sh+=1; b=min(a+63,n)
    subprocess.run(['ffmpeg','-nostdin','-v','error','-y','-framerate','1','-start_number',str(a),'-i',f'{fr}/f_%04d.png','-frames:v',str(b-a+1),'-vf','tile=8x8','-frames:v','1',f'{out}/{v}_{sh:02d}.png'])
json.dump(idx,open(f'{out}/{v}_idx.json','w'))
print(v,n,'fotogramas',sh,'hojas')
