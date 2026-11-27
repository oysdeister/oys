"""Compara el contenido actual con un commit (por defecto HEAD) y avisa si se perdió estructura.
Uso: python3 -I auditoria/scripts/comprobar_estructura.py [commit]
Comprueba: ids, número y orden de partes/pasos/campos/test/checklist/problemas/aprendido, respuestas correctas,
número de opciones, imágenes, puntos clicables (coordenadas y etiqueta), campos.campo, numero, duracionMin, ruta;
y avisa de textos de bloque que pierden más del 35 % de longitud."""
import json, subprocess, sys, glob, os
ref = sys.argv[1] if len(sys.argv) > 1 else 'HEAD'
os.chdir(subprocess.check_output(['git', 'rev-parse', '--show-toplevel'], text=True).strip())
errores, avisos = [], []
def viejo(p):
    try: return json.loads(subprocess.check_output(['git', 'show', f'{ref}:{p}'], stderr=subprocess.DEVNULL))
    except subprocess.CalledProcessError: return None
def esq(x):
    """Esqueleto estructural: todo lo que no es texto libre."""
    if isinstance(x, dict):
        r = {}
        for k, v in x.items():
            if k in ('id', 'numero', 'duracionMin', 'correcta', 'imagen', 'hotspot', 'campo', 'ruta', 'tipo', 'videoIndice', 'termino'):
                r[k] = v if k != 'hotspot' else {kk: vv for kk, vv in v.items()}
            elif isinstance(v, (list, dict)):
                r[k] = esq(v)
            elif k == 'opciones': r[k] = len(v)
        return r
    if isinstance(x, list): return [esq(i) for i in x]
    return None
def textos(x):
    if isinstance(x, str): return len(x)
    if isinstance(x, dict): return sum(textos(v) for v in x.values())
    if isinstance(x, list): return sum(textos(v) for v in x)
    return 0
def diff(a, b, ruta):
    if type(a) != type(b): errores.append(f'{ruta}: tipo distinto'); return
    if isinstance(a, dict):
        for k in set(a) | set(b):
            if k not in a or k not in b: errores.append(f'{ruta}.{k}: clave {"añadida" if k not in a else "quitada"}'); continue
            diff(a[k], b[k], f'{ruta}.{k}')
    elif isinstance(a, list):
        if len(a) != len(b): errores.append(f'{ruta}: {len(a)} → {len(b)} elementos'); return
        for i, (x, y) in enumerate(zip(a, b)): diff(x, y, f'{ruta}[{i}]')
    elif a != b: errores.append(f'{ruta}: {a!r} → {b!r}')
ficheros = sorted(glob.glob('app/src/content/*.json') + glob.glob('app/src/content/examenes/*.json') + glob.glob('app/src/content/glosario/*.json'))
for p in ficheros:
    nuevo = json.load(open(p)); ant = viejo(p)
    if ant is None: continue
    if isinstance(ant, dict) and 'opciones' not in str(type(ant)):
        pass
    if p.endswith('campos-pos.json'):
        if ant != nuevo: errores.append(f'{p}: cambió (no debe tocarse)'); continue
    diff(esq(ant), esq(nuevo), p)
    for e0, e1 in zip(ant.get('ejercicios', []) if isinstance(ant, dict) else [], nuevo.get('ejercicios', []) if isinstance(nuevo, dict) else []):
        t0, t1 = textos(e0), textos(e1)
        if t0 and t1 < t0 * 0.65: avisos.append(f'{p} {e0["id"]}: el texto pasa de {t0} a {t1} caracteres')
        if json.dumps(e0.get('test'), ensure_ascii=False).count('{INI}') != json.dumps(e1.get('test'), ensure_ascii=False).count('{INI}'):
            avisos.append(f'{p} {e0["id"]}: cambia el número de {{INI}} en el test')
print(f'Ficheros comparados con {ref}: {len(ficheros)}')
print(f'Errores estructurales: {len(errores)}'); [print('  ✗', e) for e in errores[:200]]
print(f'Avisos: {len(avisos)}'); [print('  !', a) for a in avisos]
sys.exit(1 if errores else 0)
