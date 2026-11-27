"""Lista citas «…» que parecen títulos de bloque/parte/etapa y no casan con ningún título vigente.
Uso: python3 -I citas.py <raiz_repo> [--todas]"""
import json, glob, re, sys, os, subprocess, difflib
raiz = sys.argv[1]; os.chdir(raiz)
todas = '--todas' in sys.argv
titulos = {}  # titulo -> lista de (tipo, modulo, id)
def add(t, tipo, mod, i):
    titulos.setdefault(t.strip(), []).append((tipo, mod, i))
modtit = {}
for f in sorted(glob.glob('app/src/content/*.json')):
    if 'campos-pos' in f: continue
    d = json.load(open(f))
    add(d['titulo'], 'modulo', d['id'], d['id']); modtit[d['id']] = d['titulo']
    for n in d.get('navegacion', []): add(n['titulo'], 'nav', d['id'], n['id'])
    for e in d['ejercicios']:
        add(e['titulo'], 'bloque', d['id'], e['id'])
        for s in e.get('secciones', []):
            if s.get('titulo'): add(s['titulo'], 'parte', d['id'], e['id'])
for m in re.finditer(r"titulo: '([^']+)'", open('app/src/content/etapas.ts').read()):
    add(m.group(1), 'etapa', '', '')
# títulos antiguos (HEAD y commits recientes) para detectar citas rancias
viejos = {}
for ref in ['HEAD', 'HEAD~1', 'HEAD~2', 'HEAD~3', 'HEAD~4']:
    for f in glob.glob('app/src/content/*.json'):
        if 'campos-pos' in f: continue
        try: d = json.loads(subprocess.check_output(['git', 'show', f'{ref}:{f}'], stderr=subprocess.DEVNULL))
        except Exception: continue
        cur = {e['id']: e['titulo'] for e in json.load(open(f))['ejercicios']}
        for e in d.get('ejercicios', []):
            if e['titulo'] not in titulos and e['id'] in cur: viejos.setdefault(e['titulo'], cur[e['id']])
            for s in e.get('secciones', []):
                t = s.get('titulo')
                if t and t not in titulos: viejos.setdefault(t, '(parte) ?')
inf = re.compile(r'^(?:[A-ZÁÉÍÓÚ][a-záéíóúñ]+(?:ar|er|ir)(?:se|lo|la|los|las|le)?)\b')
fuentes = glob.glob('app/src/**/*.json', recursive=True) + glob.glob('app/src/**/*.ts', recursive=True) + glob.glob('app/src/**/*.tsx', recursive=True) + glob.glob('plugins/formacion-oys/skills/**/*.md', recursive=True)
exactos = set(titulos)
cuenta = 0
for f in sorted(fuentes):
    for ln, linea in enumerate(open(f, encoding='utf-8'), 1):
        for m in re.finditer(r'«([^«»]{6,120})»', linea):
            c = m.group(1).strip().rstrip('.')
            if c in exactos: continue
            if c in viejos:
                print(f'VIEJO {f}:{ln}: «{c}» → «{viejos[c]}»'); cuenta += 1; continue
            if not inf.match(c) and not todas: continue
            if len(c.split()) < 3: continue
            parecido = difflib.get_close_matches(c, exactos, n=1, cutoff=0.6)
            print(f'NOCASA {f}:{ln}: «{c}»' + (f'  ~ «{parecido[0]}»' if parecido else '')); cuenta += 1
print('total', cuenta, file=sys.stderr)
