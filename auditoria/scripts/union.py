"""Comprueba que ningún término ni alias se pierde: unión de nombres y de formas subrayables antes/después.
Uso: python3 -I union.py <dir_antes> <dir_despues>"""
import sys, json, glob
sys.path.insert(0, __file__.rsplit('/', 1)[0])
from gl_formas import formas, clave
def carga(d):
    nombres, fs, dup = set(), {}, []
    vistos = {}
    for f in sorted(glob.glob(d + '/*.json')):
        for e in json.load(open(f)):
            for n in [e['termino']] + e.get('alias', []):
                nombres.add(n)
                for x in formas(n): fs.setdefault(clave(x), x)
            k = clave(e['termino'])
            if k in vistos: dup.append((e['termino'], vistos[k], f))
            vistos[k] = f
    return nombres, fs, dup
n0, f0, _ = carga(sys.argv[1]); n1, f1, dup = carga(sys.argv[2])
print('Nombres (término o alias) que ya no existen tal cual:')
for n in sorted(n0 - n1):
    print('  ', n, '| sus formas siguen subrayándose' if all(clave(x) in f1 for x in formas(n)) else '| FORMA PERDIDA: ' + ', '.join(x for x in formas(n) if clave(x) not in f1))
print('Formas subrayables perdidas:', sorted(f0[k] for k in set(f0) - set(f1)) or 'ninguna')
print('Formas nuevas:', sorted(f1[k] for k in set(f1) - set(f0)))
print('Claves de término duplicadas después:', dup or 'ninguna')
