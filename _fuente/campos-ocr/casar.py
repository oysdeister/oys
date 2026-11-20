"""Sitúa cada campo de las tablas de campos en las capturas de su sección a partir del OCR (ocr.jsonl).
Escribe app/src/content/campos-pos.json: {seccion: {indice_campo: {imagen, x, y, w, h}}} en % de la imagen.
Solo para los campos que no casan ya con el hotspot de un paso. Uso: python3 _fuente/campos-ocr/casar.py"""
import json, re, unicodedata, sys, os
from difflib import SequenceMatcher
RAIZ = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
# Correcciones a mano, para los casos que el OCR no resuelve bien. Claves: (id de sección, índice del campo en «campos»).
# EXCLUIR: no se sitúa nunca (ni por OCR ni por hotspot). FIJAR: posición dada en % de la imagen; gana a todo.
EXCLUIR = set()
FIJAR = {
    # Ventana emergente pegada al borde: con la caja en x≈22 el punto (va a su izquierda) caía sobre la lista de fondo.
    ('carteras-1-plazo', 0): {'imagen': 'carteras-d-230.webp', 'x': 25.6, 'y': 31.0, 'w': 5.8, 'h': 2.0},   # Plazo pago, bajo su casilla
    ('carteras-1-plazo', 3): {'imagen': 'carteras-d-230.webp', 'x': 41.0, 'y': 35.6, 'w': 18.0, 'h': 4.6},  # Tipo cálculo, en «Variable»
    ('carteras-1-plazo', 4): {'imagen': 'carteras-d-230.webp', 'x': 26.0, 'y': 51.6, 'w': 23.5, 'h': 2.4},  # Primer plazo, en su casilla
    # El OCR parte la cabecera de lista «Tipo contable» en dos líneas y «Tipo» casaba ahí; va al «Tipo*» de la ficha.
    ('compras-1-articulo', 4): {'imagen': 'compras-v-11.webp', 'x': 16.11, 'y': 64.09, 'w': 2.82, 'h': 2.66},
}
MODS = ['maestros', 'compras', 'ventas', 'icon-contabilidad', 'carteras', 'tesoreria', 'icon-impuestos', 'icon-activos']

def norm(s):
    s = unicodedata.normalize('NFD', s.lower())
    s = ''.join(c for c in s if unicodedata.category(c) != 'Mn')
    s = re.sub(r'\(.*?\)', '', s)
    s = re.sub(r'[*«»"\'.:]', '', s)
    return re.sub(r'\s+', ' ', s).strip()

def casa_hs(campo, et):  # misma regla que CapturaCampos.tsx
    b = norm(et)
    if not b: return False
    return any(a == b or (len(a) >= 4 and b.startswith(a)) or (len(b) >= 4 and a.startswith(b)) for a in map(norm, campo.split('/')) if a)

ENLACES = {'y', 'e', 'o', 'u', 'de', 'del', 'en', 'con', 'por', 'a', 'al', 'la', 'el'}
def compuesto(campo, et):
    """El hotspot nombra OTRO campo que empieza igual: «Grupo» frente a «Grupo precio», «Tipo» frente a «Tipo contable».
    Se nota en que tras el nombre viene una palabra en minúscula que no es un enlace («y», «e», «en»…) ni un valor
    («Estado Validado», «Artículo {INI}», «Tipo, Activar y Activa» siguen casando). Solo para campos de un único
    nombre y hotspots sin cifras («Importe extracto 1.524,60» sí es el importe)."""
    a, pal = norm(campo), et.split()
    if '/' in campo or '·' in campo or re.search(r'\d', et): return False
    n = len(a.split())
    if not a or len(pal) <= n or norm(' '.join(pal[:n])) != a: return False
    sig = pal[n]
    return bool(re.fullmatch(r'[a-záéíóúüñ]+', sig)) and sig not in ENLACES

ocr = {}
for l in open(os.path.join(RAIZ, '_fuente/campos-ocr/ocr.jsonl')):
    d = json.loads(l); ocr[d['f'].replace('app/public/img/', '')] = d

def otro_campo(o, nombre):  # la vía difusa no debe casar plurales (menús, pestañas) ni cambiar una palabra corta (neto/dto, CP/LP)
    po, pn = re.findall(r'\w+', o), re.findall(r'\w+', nombre)
    if any(w in (v + 's', v + 'es') for w in po for v in pn): return True
    corta = lambda w: w.isalpha() and len(w) <= 4 and w not in ('de', 'del', 'la', 'el', 'y', 'o', 'a', 'en', 'con', 'por')
    falta, sobra = [v for v in pn if corta(v) and v not in po], [w for w in po if corta(w) and w not in pn]
    return any(w not in v and v not in w for v in falta for w in sobra)

def menu(d):  # borde derecho del menú lateral si la captura lo muestra (raíz «Finanzas»)
    r = [t for t in d['t'] if t['x'] < 10 and norm(t['s']) == 'finanzas']
    if not r: return 0
    x0 = r[0]['x']
    return min(30, max((t['x'] + t['w'] for t in d['t'] if x0 - 1 <= t['x'] < x0 + 8 and t['y'] > 9), default=0))

def candidatos(nombre, d, difuso=False):
    res = []
    for t in d['t']:
        raw = t['s'].strip()
        trunc = raw.endswith('...') or raw.endswith('…')
        o = norm(re.sub(r'(\.\.\.|…|\*|:)+\s*$', '', raw))
        if not o: continue
        ok = o == nombre or (trunc and len(o) >= 6 and nombre.startswith(o))
        if not ok and difuso and len(nombre) >= 6 and abs(len(o) - len(nombre)) <= 4 and not raw.isupper():
            ok = SequenceMatcher(None, o, nombre).ratio() >= 0.86 and not otro_campo(o, nombre)
        if ok: res.append(t)
    return res

salida, tot, nuevos, sin = {}, 0, 0, []
for m in MODS:
    data = json.load(open(os.path.join(RAIZ, f'app/src/content/{m}.json')))
    for e in data['ejercicios']:
        for s in e['secciones']:
            imgs = []
            for p in s['pasos']:
                if p.get('imagen') and p['imagen'] not in imgs: imgs.append(p['imagen'])
            hs = [p['hotspot']['etiqueta'] for p in s['pasos'] if p.get('imagen') and p.get('hotspot')]
            halls = {}
            for i, c in enumerate(s['campos']):
                tot += 1
                if (s['id'], i) in EXCLUIR or (s['id'], i) in FIJAR: continue
                if any(casa_hs(c['campo'], h) and not compuesto(c['campo'], h) for h in hs): continue
                nombres = [n for n in map(norm, re.split(r'[/·]', c['campo'])) if n]
                hallado = None
                for difuso, img in [(False, x) for x in imgs] + [(True, x) for x in imgs]:
                    d = ocr.get(f'{m}/{img}')
                    if not d: continue
                    for n in nombres:
                        borde = menu(d)
                        cs = [t for t in candidatos(n, d, difuso) if t['x'] >= borde or t['y'] <= 9]
                        fuera = [t for t in cs if t['x'] > 14 and t['y'] > 9]  # fuera del menú lateral y la barra superior
                        cs = fuera or cs
                        if cs:
                            hallado = {'imagen': img, 'cs': sorted(cs, key=lambda t: (t['y'], t['x']))}
                            break
                    if hallado: break
                if hallado:
                    halls[i] = hallado; nuevos += 1
                    if len(sys.argv) > 1: print('  ', s['id'], '|', c['campo'], '->', hallado['imagen'])
                else:
                    sin.append(f"{s['id']}\t{c['campo']}")
            # Si un nombre sale varias veces (p. ej. formulario sobre una lista), la más cercana a los demás campos de la sección
            for i, h in sorted(halls.items()):
                anclas = [o['cs'][0] for j, o in halls.items() if j != i and o['imagen'] == h['imagen'] and len(o['cs']) == 1]
                cerca = lambda t: min((abs(t['x'] - a['x']) + abs(t['y'] - a['y']) for a in anclas), default=0)
                t = min(h['cs'], key=cerca) if anclas else h['cs'][0]
                salida.setdefault(s['id'], {})[str(i)] = {'imagen': h['imagen'], 'x': round(t['x'] - 0.4, 2), 'y': round(t['y'] - 0.4, 2), 'w': round(t['w'] + 0.8, 2), 'h': round(t['h'] + 0.8, 2)}
for (sec, i), p in FIJAR.items():
    salida.setdefault(sec, {})[str(i)] = dict(p); nuevos += 1
salida = {k: dict(sorted(v.items(), key=lambda kv: int(kv[0]))) for k, v in salida.items()}
json.dump(salida, open(os.path.join(RAIZ, 'app/src/content/campos-pos.json'), 'w'), ensure_ascii=False, indent=1)
open(os.path.join(RAIZ, '_fuente/campos-ocr/sin-situar.tsv'), 'w').write('\n'.join(sin) + '\n')
print(f'campos {tot} · nuevos situados {nuevos} · sin situar {len(sin)}')
