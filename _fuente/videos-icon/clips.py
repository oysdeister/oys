"""Corta los clips de UN vídeo: python3 -I clips.py <id>  (recorte + tapado + difuminado de analisis/<id>.crop.json)."""
import json, os, subprocess, sys
S = os.path.dirname(os.path.abspath(__file__))
W = '/Users/sergi.baulies/Downloads/practica-axional-oys/.claude/worktrees/videos-icon-748154/app'
D = '/Users/sergi.baulies/Downloads/VNEXT Doumentacion/Icon'
FICH = {'icon1': 'ICON/FORMACIÓN ICON 1 .mkv', 'icon11': 'ICON/FORMACIÓN ICON 1.1 .mkv', 'icon2': 'ICON/FORMACIÓN ICON 2 .mkv',
        'maestros': '1. Capacitación maestros contables.mkv', 'tax-intro': '2. Introducción a TAX.mkv',
        'tax-tablas': '3. TAX - Tablas maestras.mkv', 'cobros': '4. Modulo de Cobros y Pagos.mkv',
        'asientos': '5. Asiento contables en tipologías de documentos de gestión.mkv'}
v = sys.argv[1]
force = '--force' in sys.argv
only = [int(x) for x in sys.argv[2:] if x.isdigit()]
A = os.path.join(S, 'analisis')
caps = json.load(open(f'{A}/{v}.capitulos.json')); cr = json.load(open(f'{A}/{v}.crop.json'))
src = os.path.join(D, FICH[v])
for c in caps:
    if only and c['n'] not in only: continue
    nn = f"{v}-cap{c['n']:02d}"; ini = int(round(c['inicio'])); dur = int(round(c['duracion']))
    vf = f"crop={cr['w']}:{cr['h']}:{cr['x']}:{cr['y']}"
    for tp in cr.get('tapar', []) + cr.get('auto', []):
        d0, d1 = tp['desde'] - ini, tp['hasta'] - ini
        if d1 > 0 and d0 < dur:
            vf += f",drawbox=x={tp['x']}:y={tp['y']}:w={tp['w']}:h={tp['h']}:color=0x30343a:t=fill:enable='between(t,{max(0,d0)},{d1})'"
    k = 0
    for df in cr.get('difuminar', []):
        d0, d1 = df['desde'] - ini, df['hasta'] - ini
        if d1 > 0 and d0 < dur:
            k += 1
            vf += (f",split[b{k}][l{k}];[l{k}]crop={df['w']}:{df['h']}:{df['x']}:{df['y']},boxblur=12:2[r{k}];"
                   f"[b{k}][r{k}]overlay={df['x']}:{df['y']}:enable='between(t,{max(0,d0)},{d1})'")
    vf += ",scale=-2:'2*trunc(min(720\\,ih)/2)'"
    out = os.path.join(S, 'clips', nn + '.mp4'); os.makedirs(os.path.dirname(out), exist_ok=True)
    if force or not os.path.exists(out):
        subprocess.run(['ffmpeg', '-nostdin', '-v', 'error', '-y', '-ss', str(ini), '-i', src, '-t', str(dur), '-vf', vf, '-c:v', 'libx264',
                        '-preset', 'veryfast', '-crf', '27', '-c:a', 'aac', '-b:a', '96k', '-ac', '1', '-movflags', '+faststart', out], check=True)
    pst = os.path.join(W, 'public/video/finanzas', nn + '.jpg'); os.makedirs(os.path.dirname(pst), exist_ok=True)
    subprocess.run(['ffmpeg', '-nostdin', '-v', 'error', '-y', '-ss', str(min(20, dur // 3)), '-i', out, '-frames:v', '1', '-vf', 'scale=640:-2', '-q:v', '5', pst], check=True)
    print('ok', nn, flush=True)
