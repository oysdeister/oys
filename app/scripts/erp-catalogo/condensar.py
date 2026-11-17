#!/usr/bin/env python3
"""Condensa los metadatos descargados de Axional VNext (nextdemo, base tutorial) en el catálogo del ERP de práctica.

Uso: python3 condensar.py <carpeta cap con raw/, index.json y menutree.json> <salida app/public/erp-cat>

Genera:
  menu.json            árbol del menú: {n, c?, k?, h?}
  obj/<code>.json      una pantalla: columnas, lista, layouts, botones, enlaces, filtros y filas de ejemplo
  buscar.json          índice plano para el buscador ⌘K: [nombre, código, ruta]
El formato está descrito en app/src/erp/catalogo/tipos.ts.
"""
import gzip, json, os, re, sys

CAP, OUT = sys.argv[1], sys.argv[2]
RAW = os.path.join(CAP, 'raw')
MAX_FILAS = 12
os.makedirs(os.path.join(OUT, 'obj'), exist_ok=True)
index = json.load(open(os.path.join(CAP, 'index.json')))


def load(name):
    p = os.path.join(RAW, name + '.json.gz')
    if not os.path.exists(p):
        return None
    try:
        return json.loads(gzip.open(p).read())
    except Exception:
        return None


def limpia(s):
    return re.sub(r'\s+', ' ', s or '').strip()


TIPOS = {
    'char': 's', 'varchar': 's', 'nchar': 's', 'nvarchar': 's', 'lvarchar': 's', 'text': 'x', 'clob': 'x',
    'integer': 'i', 'smallint': 'i', 'serial': 'i', 'int8': 'i', 'bigint': 'i', 'serial8': 'i', 'bigserial': 'i',
    'decimal': 'n', 'money': 'n', 'float': 'n', 'smallfloat': 'n', 'numeric': 'n',
    'date': 'd', 'datetime': 'dt', 'boolean': 'b', 'blob': 'x', 'byte': 'x',
}


def col(m):
    o = m.get('options') or {}
    inp = o.get('input') or {}
    out = o.get('output') or {}
    c = {'n': m['columnName'], 'l': limpia(m.get('columnLabel')) or m['columnName'], 't': TIPOS.get((m.get('columnTypeName') or '').lower(), 's')}
    if c['t'] == 's' and m.get('columnDisplaySize'):
        c['sz'] = m['columnDisplaySize']
    if c['t'] == 'n' and m.get('scale'):
        c['sc'] = m['scale']
    if m.get('isNullable') == 0 and not inp.get('nullable_expr'):
        c['req'] = 1
    ro = inp.get('readonly_expr')
    if ro in ('1==1', 'true'):
        c['ro'] = 1
    elif ro:
        c['ro'] = ro
    if not m.get('isEditable', True) and 'ro' not in c:
        c['ro'] = 1
    d = inp.get('input_default_value')
    if d not in (None, ''):
        c['def'] = str(d)
    if inp.get('input_case') == 2:
        c['up'] = 1
    rt = out.get('renderType') or {}
    data = rt.get('data') if isinstance(rt, dict) else None
    if data:
        ops = []
        for x in data[:80]:
            op = {'k': '' if x.get('key') is None else str(x['key']), 'v': limpia(str(x.get('value') if x.get('value') is not None else x.get('key')))}
            col_ = (x.get('icon') or {}).get('color') or x.get('color')
            if col_:
                op['c'] = col_
            ops.append(op)
        c['o'] = ops
        if rt.get('widget') == 'CHECKBOX' or (len(ops) == 2 and {o_['k'] for o_ in ops} in ({'S', 'N'}, {'1', '0'}, {'Y', 'N'})):
            c['chk'] = 1
    tip = out.get('tooltip')
    if tip:
        c['h'] = limpia(tip)[:160]
    if m.get('isHidden'):
        c['hid'] = 1
    fks = o.get('foreignKeys') or []
    if fks:
        pk = (fks[0].get('pkOptions') or {})
        if pk.get('pkTableName'):
            c['fk'] = pk['pkTableName']
    return c


def botones(cur):
    res = []
    for b in ((cur.get('actions') or {}).get('button') or {}).get('rows') or []:
        lab = b.get('label') or {}
        if lab.get('hidden'):
            continue
        x = {'c': lab.get('code') or str(b.get('code')), 'l': limpia(lab.get('text')) or lab.get('code')}
        if lab.get('group'):
            x['g'] = lab['group']
        bg = (b.get('colors') or {}).get('background')
        if bg:
            x['bg'] = bg
        en = b.get('enable') or {}
        if en.get('clientExpression'):
            x['en'] = en['clientExpression'][:600]
        if en.get('hideIfDisabled'):
            x['hid'] = 1
        if b.get('confirm'):
            x['conf'] = 1
        if (b.get('form') or {}).get('hasFields'):
            x['campos'] = 1
        if b.get('selectionType') == 'MULTIPLE':
            x['sel'] = 'M'
        if any(y['l'] == x['l'] and y.get('g') == x.get('g') for y in res):
            continue
        res.append(x)
    return res


def layouts(form):
    res = []
    for L in (form or {}).get('layouts') or []:
        cajas = []
        for b in L.get('boxes') or []:
            tabs = []
            for t in b.get('tabs') or []:
                comp = t.get('component') or {}
                k = {'FIELDS': 'F', 'OBJECT': 'O', 'SCRIPT': 'S'}.get(t.get('type'), 'S')
                tab = {'t': limpia(t.get('title')), 'k': k}
                if k == 'F':
                    tab['f'] = [[f['columnName'], f.get('cspan') or 1] if (f.get('cspan') or 1) > 1 else [f['columnName']] for f in comp.get('fields') or [] if f.get('columnName')]
                    if comp.get('gridColumns'):
                        tab['g'] = comp['gridColumns']
                elif k == 'O' and comp.get('code'):
                    tab['o'] = comp['code']
                if t.get('hideTitle'):
                    tab['ht'] = 1
                tabs.append(tab)
            if tabs:
                cajas.append({'s': b.get('cspan') or 12, 'tabs': tabs})
        if cajas:
            res.append({'l': limpia(L.get('label')), 'cajas': cajas})
    return res


def json_val(v):
    if isinstance(v, float) and v.is_integer() and abs(v) < 1e15:
        return v
    if isinstance(v, str) and len(v) > 120:
        return v[:120]
    if isinstance(v, (dict, list)):
        return None
    return v


subobjetos = set()
escritos = {}


def condensa(code, info):
    obj = {'c': code, 'k': info.get('kind') or 'x'}
    form = load(code + '.form')
    lista = load(code + '.list')
    qbe = load(code + '.qbe')
    cur = (form or {}).get('cursor') or lista or {}
    src = cur.get('source') or {}
    rs = cur.get('resultSet') or {}
    meta = rs.get('metadata') or []
    obj['tit'] = limpia(src.get('title') or rs.get('title') or (qbe or {}).get('qbe', {}).get('title') or code)
    if meta:
        cols = [col(m) for m in meta]
        # columnas repetidas (joins): se conserva la primera
        vistos, cc = set(), []
        for c in cols:
            if c['n'] in vistos:
                continue
            vistos.add(c['n'])
            cc.append(c)
        obj['cols'] = cc
        lmeta = ((lista or {}).get('resultSet') or {}).get('metadata') or meta
        obj['lista'] = list(dict.fromkeys(m['columnName'] for m in lmeta if not m.get('isHidden')))[:60]
        pk = (cur.get('row') or {}).get('pk_desc') or {}
        side = (cur.get('columns') or {}).get('sidebar') or []
        if side:
            obj['lat'] = [{'l': limpia(s['label']), 'c': s['columns']} for s in side]
        fr = ((lista or cur).get('filters') or {}).get('app') or []
        if fr:
            obj['filtros'] = [limpia(f['label']) for f in fr]
        perm = cur.get('permissions') or {}
        obj['perm'] = {k[0]: 1 for k in ('insert', 'update', 'delete') if perm.get(k)}
        obj['bot'] = botones(cur)
        links = ((rs.get('row') or {}).get('links') or {}).get('links') or []
        enl = [{'l': limpia(x['label']), 'm': x.get('mode')} for x in links if x.get('label')]
        if enl:
            obj['enl'] = enl
        # filas de ejemplo: de la lista (varias) o de la ficha (una)
        lrs = ((lista or {}).get('resultSet') or {})
        filas = []
        if lrs.get('rowset'):
            names = [m['columnName'] for m in lrs['metadata']]
            for r in lrs['rowset'][:MAX_FILAS]:
                d = dict(zip(names, r))
                filas.append([json_val(d.get(c['n'])) for c in cc])
        elif rs.get('rowset'):
            names = [m['columnName'] for m in meta]
            for r in rs['rowset'][:MAX_FILAS]:
                d = dict(zip(names, r))
                filas.append([json_val(d.get(c['n'])) for c in cc])
        if filas:
            obj['filas'] = filas
        obj['total'] = ((lrs.get('pagination') or {}).get('totalTableRows')) or len(filas)
    if form and form.get('form'):
        obj['lay'] = layouts(form['form'])
        for L in obj['lay']:
            for cj in L['cajas']:
                for t in cj['tabs']:
                    if t.get('o'):
                        subobjetos.add(t['o'])
    if qbe and qbe.get('qbe'):
        q = qbe['qbe']
        mdl = q.get('model') or {}
        obj['qbe'] = {
            'tipo': mdl.get('type'),
            'nota': limpia(q.get('note'))[:400] or None,
            'campos': [col(m) for m in (mdl.get('colqry') or [])][:40],
            'vars': [col(m) for m in (mdl.get('colvar') or [])][:40],
        }
        if not obj.get('cols'):
            obj['k'] = 'qbe'
    return obj


def escribe(code, obj):
    with open(os.path.join(OUT, 'obj', code + '.json'), 'w') as f:
        json.dump(obj, f, ensure_ascii=False, separators=(',', ':'))
    escritos[code] = obj


for code, info in index.items():
    if info.get('ok'):
        escribe(code, condensa(code, info))

# menú
t = json.load(open(os.path.join(CAP, 'menutree.json')))
plano = []


def nodo(n, ruta):
    nd = n['node']
    x = {'n': limpia(nd['name'])}
    if nd.get('code') and not n['items']:
        x['c'] = nd['code']
        o = escritos.get(nd['code'])
        x['k'] = (o or {}).get('k', 'x')[0] if o else 'x'
        plano.append([x['n'], nd['code'], ' › '.join(ruta)])
    if n['items']:
        x['h'] = [nodo(i, ruta + [x['n']]) for i in n['items']]
        x['h'] = [h for h in x['h'] if h.get('c') or h.get('h')]
    return x


menu = nodo(t, [])
menu['h'] = [h for h in menu['h'] if h.get('h') or h.get('c')]
json.dump(menu['h'], open(os.path.join(OUT, 'menu.json'), 'w'), ensure_ascii=False, separators=(',', ':'))
json.dump(plano, open(os.path.join(OUT, 'buscar.json'), 'w'), ensure_ascii=False, separators=(',', ':'))
faltan = sorted(s for s in subobjetos if s not in escritos)
open(os.path.join(CAP, 'subobjetos.txt'), 'w').write('\n'.join(faltan))
print('objetos', len(escritos), 'hojas menú', len(plano), 'subobjetos sin descargar', len(faltan))
