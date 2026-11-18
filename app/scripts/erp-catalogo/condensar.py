#!/usr/bin/env python3
"""Condensa los metadatos descargados de Axional VNext (nextdemo, base tutorial) en el catálogo del ERP de práctica.

Uso: python3 condensar.py <carpeta cap> <salida app/public/erp-cat>

La carpeta cap la llena ~/.cache/oys-demo-cap/transversal/harvest.mjs (recaptura 18-11-2026):
  raw/<code>.list.json.gz   GET table/<code>/list/<B64>/1
  raw/<code>.row.json.gz    GET table/<code>/form/1/<B64>/row          (ficha: layouts, botones, enlaces ⌄)
  raw/<code>.reset.json.gz  GET table/<code>/list/<B64>/dml/insert/reset/form (diálogo Nuevo: layouts y defectos)
  btn/<code>.<BOTON>.json.gz POST table/<code>/form/1/<B64>/action/<BOTON>/fields/1 (campos del diálogo)
  sub/<sub>.json.gz         GET table/<code>/form/1/<B64>/cursor/<tab>/1/list (subrejillas sin objeto propio)
  menutree.json             GET menu/tree?empty_folders=false
  index_prev.json           tipo y total de cada objeto del catálogo anterior
Los objetos sin captura nueva (consultas e informes) se conservan tal cual desde la salida anterior.

Genera:
  menu.json            árbol del menú: {n, c?, k?, h?}
  obj/<code>.json      una pantalla: columnas, lista, layouts, botones, enlaces, filtros y filas de ejemplo
  buscar.json          índice plano para el buscador ⌘K: [nombre, código, ruta]
  val.json             funciones JS de validación de campos (input_functionBody), por id (col.vf)
El formato está descrito en app/src/erp/catalogo/tipos.ts.
"""
import base64, gzip, hashlib, json, os, re, sys, urllib.parse

CAP, OUT = sys.argv[1], sys.argv[2]
RAW = os.path.join(CAP, 'raw')
MAX_FILAS = 12
os.makedirs(os.path.join(OUT, 'obj'), exist_ok=True)
index = json.load(open(os.path.join(CAP, 'index_prev.json')))
VAL = {}


def load(name, carpeta=RAW):
    p = os.path.join(carpeta, name + '.json.gz')
    if not os.path.exists(p):
        return None
    try:
        return json.loads(gzip.open(p).read())
    except Exception:
        return None


def html_a_texto(h):
    return limpia(re.sub(r'<[^>]+>', ' ', (h or '').replace('&nbsp;', ' ')))


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
            lov = {'t': pk['pkTableName'], 'c': pk.get('pkColumns') or []}
            if pk.get('pkMethod'):
                lov['m'] = pk['pkMethod']
            fo = fks[0].get('fkOptions') or {}
            if (fo.get('fkColumns') or [m['columnName']]) != [m['columnName']]:
                lov['fc'] = fo['fkColumns']
            if fks[0].get('filterColumns'):
                lov['flt'] = fks[0]['filterColumns']
            tipo = (fo.get('fkType') or {}).get('info')
            if tipo and tipo != 'HARD_BASE':
                lov['k'] = tipo
            if fo.get('fkApplyExpression'):
                lov['x'] = fo['fkApplyExpression'][:300]
            if len(fks) > 1:
                lov['alt'] = [(f.get('pkOptions') or {}).get('pkTableName') for f in fks[1:]]
            c['lov'] = lov
    # expresiones y defectos de servidor (recaptura 18-11-2026)
    nx = inp.get('nullable_expr')
    if nx:
        c['nx'] = nx[:400]
    hx = inp.get('hidden_expr')
    if hx:
        c['hx'] = hx[:400]
    cx = inp.get('computed_expr')
    if cx:
        c['cx'] = cx[:400]
    ds = inp.get('input_default_server_value')
    if ds not in (None, '') and str(ds) != c.get('def'):
        c['defs'] = str(ds)[:200]
    if inp.get('input_default_mode') and inp.get('input_default_mode') != 'IFNULL':
        c['defm'] = inp['input_default_mode']
    if inp.get('input_hint'):
        c['hint'] = limpia(str(inp['input_hint']))[:200]
    if inp.get('input_mask'):
        c['mask'] = str(inp['input_mask'])[:60]
    fb = inp.get('input_functionBody')
    if fb:
        k = hashlib.sha1(fb.encode()).hexdigest()[:10]
        VAL[k] = fb
        c['vf'] = k
    return c


def botones(cur, code=None):
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
        tip = html_a_texto(lab.get('tooltip'))
        if tip:
            x['tip'] = tip[:300]
        if code and x.get('campos'):
            campos = load(code + '.' + (b.get('code') or ''), os.path.join(CAP, 'btn'))
            if isinstance(campos, list) and campos:
                x['dlg'] = [col(m) for m in campos][:30]
                ncol = (b.get('form') or {}).get('columns')
                if ncol and ncol > 1:
                    x['dcol'] = ncol
        if b.get('requiresUpdate'):
            x['rq'] = 'u'
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


def enlaces(rs, fila):
    lk = (rs.get('row') or {}).get('links') or {}
    urls = (lk.get('rows') or {}).get('0') or []
    res = []
    for i, x in enumerate(lk.get('links') or []):
        if not x.get('label'):
            continue
        e = {'l': limpia(x['label']), 'm': x.get('mode')}
        if x.get('hide_if_disabled'):
            e['hid'] = 1
        u = urls[i] if i < len(urls) else None
        if isinstance(u, str):
            mm = re.search(r'/view/app/tutorial/(table|vtable|qbe)/([^/?]+)', u)
            if mm:
                e['o'] = mm.group(2)
                if mm.group(1) != 'table':
                    e['ok'] = mm.group(1)
            q = urllib.parse.parse_qs(urllib.parse.urlparse(u).query).get('q')
            if q:
                try:
                    ui = json.loads(base64.b64decode(q[0] + '==').decode('utf8'))
                    f = {}
                    for col_, v in (ui.get('cols') or {}).items():
                        val = v.get('v') if isinstance(v, dict) else v
                        src = next((k for k, vv in (fila or {}).items() if vv is not None and str(vv).strip() == str(val).strip() and str(val) != ''), None)
                        f[col_] = src if src else '=' + str(val)
                    if f:
                        e['f'] = f
                except Exception:
                    pass
        res.append(e)
    return res


def condensa(code, info):
    obj = {'c': code, 'k': info.get('k') or 'x'}
    row = load(code + '.row')
    lista = load(code + '.list')
    reset = load(code + '.reset')
    rw = (reset or {}).get('wrapper') or {}
    form = row if (row and (row.get('form') or {}).get('layouts')) else (rw if (rw.get('form') or {}).get('layouts') else row)
    qbe = None
    cur = (row or {}).get('cursor') or lista or rw.get('cursor') or {}
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
        obj['bot'] = botones(cur, code) or botones(lista or {}, code)
        fila1 = None
        if rs.get('rowset'):
            fila1 = dict(zip([m['columnName'] for m in meta], rs['rowset'][0]))
        enl = enlaces(rs, fila1)
        if enl:
            obj['enl'] = enl
        nl = cur.get('newLabel') or (lista or {}).get('newLabel') or (rw.get('cursor') or {}).get('newLabel')
        if nl and nl != 'Nuevo':
            obj['nuevo'] = limpia(nl)
        ev = list(((cur.get('columns') or {}).get('events') or {}).keys())
        if ev:
            obj['ev'] = ev
        dd = (reset or {}).get('data') or {}
        porcol = {c['n']: c for c in cc}
        nd = {}
        for k, v in dd.items():
            if k in ('user_created', 'date_created', 'user_updated', 'date_updated') or v is None or isinstance(v, (dict, list)):
                continue
            if k in porcol and porcol[k].get('def') == str(v):
                continue
            nd[k] = json_val(v)
        if nd:
            obj['ndef'] = nd
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
        if not obj['lay']:
            del obj['lay']
        for L in obj.get('lay') or []:
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


def previo(code):
    p = os.path.join(OUT, 'obj', code + '.json')
    if os.path.exists(p):
        return json.load(open(p))
    return None


def subrejilla(code):
    d = load(code, os.path.join(CAP, 'sub'))
    if not d:
        return None
    rs = d.get('resultSet') or {}
    meta = rs.get('metadata') or []
    if not meta:
        return None
    src = d.get('source') or {}
    obj = {'c': code, 'k': 'vtable', 'tit': limpia(src.get('title') or rs.get('title') or code), 'sub': 1}
    vistos, cc = set(), []
    for m in meta:
        if m['columnName'] in vistos:
            continue
        vistos.add(m['columnName'])
        cc.append(col(m))
    obj['cols'] = cc
    obj['lista'] = [c['n'] for c in cc if not c.get('hid')][:60]
    obj['bot'] = botones(d)
    names = [m['columnName'] for m in meta]
    filas = [[json_val(dict(zip(names, r)).get(c['n'])) for c in cc] for r in (rs.get('rowset') or [])[:MAX_FILAS]]
    if filas:
        obj['filas'] = filas
    obj['total'] = ((rs.get('pagination') or {}).get('totalTableRows')) or len(filas)
    perm = d.get('permissions') or {}
    obj['perm'] = {k[0]: 1 for k in ('insert', 'update', 'delete') if perm.get(k)}
    return obj


nuevos = 0
for code, info in index.items():
    if os.path.exists(os.path.join(RAW, code + '.list.json.gz')) or os.path.exists(os.path.join(RAW, code + '.row.json.gz')):
        o = condensa(code, info)
        pv = previo(code)
        if not o.get('cols'):
            o = pv or o
        else:
            nuevos += 1
            # si la captura nueva no trae layouts o enlaces (tabla vacía) se conservan los anteriores
            for k in ('lay', 'enl'):
                if pv and pv.get(k) and not o.get(k):
                    o[k] = pv[k]
        escribe(code, o)
    else:
        o = previo(code)
        if o:
            escribe(code, o)
for f in sorted(os.listdir(os.path.join(CAP, 'sub'))) if os.path.isdir(os.path.join(CAP, 'sub')) else []:
    code = f[:-len('.json.gz')]
    if code in escritos:
        continue
    o = subrejilla(code)
    if o:
        escribe(code, o)
json.dump(VAL, open(os.path.join(OUT, 'val.json'), 'w'), ensure_ascii=False, separators=(',', ':'))
print('recapturados', nuevos)

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
