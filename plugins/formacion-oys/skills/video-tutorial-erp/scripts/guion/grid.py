import json,subprocess,os,sys
os.chdir(os.path.join(os.environ.get("PROYECTO", os.getcwd()), "kb/verif/clips"))
sc=json.load(open(os.path.join(os.path.dirname(os.path.abspath(__file__)),'scenes_built.json')))['scenes']
skip=set(sys.argv[1].split(',')) if len(sys.argv)>1 else set()
only=set(sys.argv[2].split(',')) if len(sys.argv)>2 else None
ids=[s['id'] for s in sc if s['tipo']=='pantalla' and s['id'] not in skip and (only is None or s['id'] in only)]
for f in os.listdir('.'):
    if f.startswith('G') or f.startswith('row_'): os.remove(f)
for i in range(0,len(ids),3):
    grp=ids[i:i+3]; rows=[]
    for g in grp:
        out=f'row_{g}.jpg'
        subprocess.run(['ffmpeg','-v','error','-y','-i',f'{g}_a.jpg','-i',f'{g}_b.jpg','-i',f'{g}_c.jpg','-filter_complex','[0]scale=620:-2,pad=620:400:0:0[a];[1]scale=620:-2,pad=620:400:0:0[b];[2]scale=620:-2,pad=620:400:0:0[c];[a][b][c]hstack=3',out],check=True)
        rows.append(out)
    args=['ffmpeg','-v','error','-y']
    for r in rows: args+=['-i',r]
    args+=['-filter_complex',f'vstack=inputs={len(rows)}' if len(rows)>1 else 'null', f'G{i//3:02d}.jpg']
    subprocess.run(args,check=True)
    print(f'G{i//3:02d}', grp)
