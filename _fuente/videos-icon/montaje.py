"""Montaje final de los vídeos de finanzas -> módulos de la plataforma.
Uso: python3 -I montaje.py [--clips]
Lee S/analisis/<id>.{ejercicios,capitulos,momentos,crop}.json y S/fus/*_ok.json (fusiones DeepSeek).
Escribe content/{facturacion,cobros-pagos,impuestos,activos-fijos}.json, amplía maestros.json (solo
la primera vez: usa maestros.base.json guardado en S), content/video-finanzas.ts y mueve capturas.
"""
import json, os, re, shutil, subprocess, sys, copy

S = os.path.dirname(os.path.abspath(__file__))
W = '/Users/sergi.baulies/Downloads/practica-axional-oys/.claude/worktrees/videos-icon-748154/app'
D = '/Users/sergi.baulies/Downloads/VNEXT Doumentacion/Icon'
A = os.path.join(S, 'analisis')
IMG = os.path.join(W, 'public/img')
OLD = os.path.join(S, 'img_orig')  # copia de las capturas originales (ya tapadas)
FICH = {
    'icon1': 'ICON/FORMACIÓN ICON 1 .mkv', 'icon11': 'ICON/FORMACIÓN ICON 1.1 .mkv', 'icon2': 'ICON/FORMACIÓN ICON 2 .mkv',
    'maestros': '1. Capacitación maestros contables.mkv', 'tax-intro': '2. Introducción a TAX.mkv',
    'tax-tablas': '3. TAX - Tablas maestras.mkv', 'cobros': '4. Modulo de Cobros y Pagos.mkv',
    'asientos': '5. Asiento contables en tipologías de documentos de gestión.mkv',
}
DIRVID = {'icon1': 'finanzas-icon', 'icon11': 'finanzas-icon', 'icon2': 'finanzas-icon', 'maestros': 'maestros-contables',
          'asientos': 'asientos-gestion', 'cobros': 'cobros-pagos', 'tax-tablas': 'impuestos', 'tax-intro': 'impuestos'}
REL = 'https://github.com/sergibauli/oys/releases/download/video-finanzas-v1/'
PUBLICADOS = set(open(os.path.join(S, 'publicados.txt')).read().split()) if os.path.exists(os.path.join(S, 'publicados.txt')) else set()
clips = '--clips' in sys.argv

SERIES = {
    'icon1': ('Sesión de finanzas 1: de la factura a la remesa', 'Sesión 1', 'Contabilizas una factura, creas facturas directas y preparas la primera remesa.', ['icon-contabilidad', 'icon-cartera', 'maestros']),
    'icon11': ('Sesión de finanzas 2: remesas paso a paso', 'Sesión 2', 'Recorres una remesa completa y aprendes por qué una factura no contabiliza o no remesa.', ['icon-cartera', 'icon-contabilidad']),
    'icon2': ('Sesión de finanzas 3: extracto y conciliación', 'Sesión 3', 'Del extracto bancario a la conciliación y la contabilización del cobro o el pago.', ['icon-cartera']),
    'maestros': ('Maestros contables', 'Maestros', 'Planes y cuentas, mnemotécnicos, empresas y la ficha del tercero.', ['maestros']),
    'tax-intro': ('Impuestos: conceptos básicos', 'Conceptos', 'Qué es un impuesto, cómo se clasifica y cómo se liquida el IVA.', ['icon-impuestos']),
    'tax-tablas': ('Impuestos: tablas maestras', 'Tablas', 'Las tablas que deciden qué impuesto lleva cada línea de una factura.', ['icon-impuestos']),
    'cobros': ('Cartera de cobros y pagos', 'Cartera', 'Tipos de efecto, estados y cómo se paga o se gestiona un efecto.', ['icon-cartera']),
    'asientos': ('Contabilización y activos fijos', 'Activos', 'Qué asientos genera cada documento y cómo nace un activo fijo.', ['icon-activos']),
}

load = lambda v, k: json.load(open(os.path.join(A, f'{v}.{k}.json')))
EJ = {}
for v in ['icon1', 'icon11', 'icon2', 'maestros', 'cobros', 'asientos', 'tax-tablas']:
    for e in load(v, 'ejercicios'):
        EJ[(v, e['id'].split('-')[-1])] = e
FUS = {n: json.load(open(os.path.join(S, 'fus', n + '_ok.json'))) for n in ['F1', 'F4', 'R1', 'R5']}

# (módulo destino) -> lista de ejercicios fuente (se añaden al final del módulo existente)
PLAN = {
    'icon-contabilidad': [FUS['F1'], EJ[('icon1', '3')], EJ[('icon1', '4')], FUS['F4']],
    'icon-cartera': [EJ[('cobros', '2')], EJ[('cobros', '3')], EJ[('cobros', '5')], EJ[('icon11', '2')], FUS['R1'], EJ[('icon11', '4')], FUS['R5']] +
                    [EJ[('icon2', str(i))] for i in range(1, 5)],
    'icon-impuestos': [EJ[('tax-tablas', str(i))] for i in (3, 4, 5)],
    'icon-activos': [EJ[('asientos', str(i))] for i in (1, 2, 3, 4)],
    'maestros': [EJ[('maestros', '1')], EJ[('maestros', '2')], EJ[('maestros', '3')], EJ[('icon1', '2')]],
}
# secciones renombradas por DeepSeek -> sección original para buscar sus momentos
ALIAS = {'cobros-pagos-v-5-domiciliacion': 'finanzas-icon-icon11-5-domiciliacion-tipos',
         'cobros-pagos-v-5-tipos-efecto': 'finanzas-icon-icon11-5-domiciliacion-tipos'}
# Ejercicios fuente descartados por repetir lo que ya cubre un ejercicio existente:
# sección fuente -> (sección existente, ejercicio existente). Sus momentos de vídeo y sus problemas enriquecen lo existente.
REMAP = {
    'cobros-pagos-cobros-1-tipos': ('icon-cartera-1-vision', 'icon-cartera-1'),
    'cobros-pagos-cobros-1-estados': ('icon-cartera-1-estados', 'icon-cartera-1'),
    'cobros-pagos-cobros-1-iniciales': ('icon-cartera-1-estados', 'icon-cartera-1'),
    'cobros-pagos-cobros-4-accion': ('icon-cartera-1-acciones', 'icon-cartera-1'),
    'cobros-pagos-cobros-4-origen': ('icon-cartera-1-acciones', 'icon-cartera-1'),
    'impuestos-tax-tablas-1-registro-fiscal': ('icon-impuestos-2-registro', 'icon-impuestos-2'),
    'impuestos-tax-tablas-1-periodos-agencias': ('icon-impuestos-1-reglas-agencia', 'icon-impuestos-1'),
    'impuestos-tax-tablas-1-origenes-maestros': ('icon-impuestos-2-registro', 'icon-impuestos-2'),
    'impuestos-tax-tablas-2-consulta-reglas': ('icon-impuestos-1-reglas-agencia', 'icon-impuestos-1'),
    'impuestos-tax-tablas-2-anatomia-regla': ('icon-impuestos-1-reglas-agencia', 'icon-impuestos-1'),
    'asientos-gestion-asientos-5-abrir-bien': ('icon-activos-1-bien', 'icon-activos-1'),
    'asientos-gestion-asientos-5-grupo-contable': ('icon-activos-1-bien', 'icon-activos-1'),
    'asientos-gestion-asientos-5-grupo-fiscal': ('icon-activos-1-bien', 'icon-activos-1'),
    'asientos-gestion-asientos-5-jerarquia': ('icon-activos-1-elemento', 'icon-activos-1'),
    'asientos-gestion-asientos-6-datos-adquisicion': ('icon-activos-1-componente', 'icon-activos-1'),
    'asientos-gestion-asientos-6-inicio-depreciacion': ('icon-activos-1-componente', 'icon-activos-1'),
    'asientos-gestion-asientos-6-totales-trazabilidad': ('icon-activos-1-elemento', 'icon-activos-1'),
    'asientos-gestion-asientos-6-duda-instalacion': ('icon-activos-1-componente', 'icon-activos-1'),
    'maestros-contables-maestros-4-fiscales-tipo': ('maestros-1-terceros', 'maestros-1'),
    'maestros-contables-maestros-4-direcciones-banca': ('maestros-1-terceros', 'maestros-1'),
    'maestros-contables-maestros-4-condiciones-interfaz': ('maestros-1-plazos', 'maestros-1'),
    'maestros-contables-maestros-5-alta-error': ('maestros-1-cuentas-perfil', 'maestros-1'),
    'maestros-contables-maestros-5-relacion-feda': ('maestros-1-cuentas-perfil', 'maestros-1'),
}
DROPPED = [EJ[('cobros', '1')], EJ[('cobros', '4')], EJ[('tax-tablas', '1')], EJ[('tax-tablas', '2')],
           EJ[('asientos', '5')], EJ[('asientos', '6')], EJ[('maestros', '4')], EJ[('maestros', '5')]]
PREF = re.compile(r'^(?:finanzas-icon-icon\d+-\d+|maestros-contables-maestros-\d+|cobros-pagos-cobros-\d+|asientos-gestion-asientos-\d+|impuestos-tax-[a-z]+-\d+|cobros-pagos-v-\d+)-(.*)$')

# momentos originales: clave sección -> [(vídeo, [items])]
MOM = {}
for v in FICH:
    p = os.path.join(A, f'{v}.momentos.json')
    if os.path.exists(p):
        for k, lst in json.load(open(p)).items():
            MOM.setdefault(k, []).append((v, lst))

def clean(o):
    if isinstance(o, str):
        o = re.sub(r'(\d{5})\s+CASANOVA', r'\1', o)
        o = re.sub(r'CASANOVA\s+(\d{5})', r'\1', o)
        o = re.sub(r'(?i)telef[oó]nica(?: de espa[ñn]a)?(?: s\.a\.)?(?: espa[ñn]a)?', 'Proveedor Demo', o)
        return re.sub(r'\b(?:ICON|Icon)\b', 'Finanzas', o)
    if isinstance(o, list):
        return [clean(x) for x in o]
    if isinstance(o, dict):
        return {k: clean(v) for k, v in o.items()}
    return o

def vid_of_img(name):  # 'icon11-003.jpg' -> 'icon11'
    return name.rsplit('-', 1)[0]

def dest_name(mod, name):
    v = vid_of_img(name)
    return 'v-' + name

imgs_used = {}  # (dir destino) -> set(nombres destino); y copias pendientes
copias = []     # (origen abs, destino abs)

def tratar(mod, ex, nuevo_id, numero):
    e = copy.deepcopy(ex)
    e['id'] = nuevo_id
    e['numero'] = numero
    for s in e['secciones']:
        viejo = s['id']
        m = PREF.match(viejo)
        slug = m.group(1) if m else viejo
        s['id'] = f'{nuevo_id}-{slug}'
        s['_viejo'] = viejo
        for p in s['pasos']:
            if p.get('imagen'):
                orig = p['imagen']
                v = vid_of_img(orig)
                dn = dest_name(mod, orig)
                p['imagen'] = dn
                src = os.path.join(OLD, DIRVID[v], orig)
                copias.append((src, os.path.join(IMG, mod, dn)))
    return e

series_mom_sec, series_mom_ej = {}, {}
modulos_out = {}
for mod, lista in PLAN.items():
    base = json.load(open(os.path.join(S, 'base', mod + '.json')))
    n0 = len(base['ejercicios'])
    out = []
    for i, ex in enumerate(lista, 1):
        out.append(tratar(mod, ex, f'{mod}-v-{i}', n0 + i))
    modulos_out[mod] = (base, out)
    for e in out:
        lst = []
        for s in e['secciones']:
            viejo = s.pop('_viejo')
            claves = [viejo] + ([ALIAS[viejo]] if viejo in ALIAS else [])
            ms = []
            for c in claves:
                for v, items in MOM.get(c, []):
                    ms += [dict(x, serie='fin-' + v) for x in items]
            if ms:
                series_mom_sec.setdefault(s['id'], []).extend(ms)
                lst += ms
        if lst:
            series_mom_ej[e['id']] = lst[:3]

# ejercicios descartados: sus momentos de vídeo y sus problemas enriquecen los existentes
extra_prob = {}   # ejercicio existente -> problemas
for ex in DROPPED:
    destino = None
    for s in ex['secciones']:
        if s['id'] in REMAP:
            nuevo, ej = REMAP[s['id']]
            destino = ej
            for v, items in MOM.get(s['id'], []):
                series_mom_sec.setdefault(nuevo, []).extend(dict(x, serie='fin-' + v) for x in items)
                series_mom_ej.setdefault(ej, [])
                series_mom_ej[ej] = (series_mom_ej[ej] + [dict(x, serie='fin-' + v) for x in items])[:3]
        else:
            print('SIN REMAP', s['id'])
    extra_prob.setdefault(destino, []).extend(ex['problemas'])

for mod, (base, out) in modulos_out.items():
    for e in base['ejercicios']:
        if e['id'] in extra_prob:
            have = {p['problema'] for p in e['problemas']}
            e['problemas'] = e['problemas'] + [p for p in extra_prob[e['id']] if p['problema'] not in have]
    base['ejercicios'] = base['ejercicios'] + out
    json.dump(clean(base), open(os.path.join(W, 'src/content', base['id'] + '.json'), 'w'), ensure_ascii=False, indent=2 if base['id'] == 'maestros' else 1)
    print(mod, '+', len(out), '->', len(base['ejercicios']))

# ---- capturas
for src, dst in copias:
    os.makedirs(os.path.dirname(dst), exist_ok=True)
    if not os.path.exists(src):
        print('FALTA captura', src); continue
    shutil.copyfile(src, dst)

# ---- series y clips
series = []
for v, (titulo, corto, intro, mods) in SERIES.items():
    caps = load(v, 'capitulos')
    for c in caps:
        nn = f"{v}-cap{c['n']:02d}"
        c['url'] = REL + nn + '.mp4' if nn in PUBLICADOS else ''
        c['poster'] = f'video/finanzas/{nn}.jpg'
        c['inicio'] = int(round(c['inicio'])); c['duracion'] = int(round(c['duracion']))
        if clips:
            src = os.path.join(D, FICH[v])
            cr = load(v, 'crop')
            vf = f"crop={cr['w']}:{cr['h']}:{cr['x']}:{cr['y']}"
            for tp in cr.get('tapar', []):
                d0, d1 = tp['desde'] - c['inicio'], tp['hasta'] - c['inicio']
                if d1 > 0 and d0 < c['duracion']:
                    vf += f",drawbox=x={tp['x']}:y={tp['y']}:w={tp['w']}:h={tp['h']}:color=0x30343a:t=fill:enable='between(t,{max(0,d0)},{d1})'"
            n_bl = 0
            for df in cr.get('difuminar', []):
                d0, d1 = df['desde'] - c['inicio'], df['hasta'] - c['inicio']
                if d1 > 0 and d0 < c['duracion']:
                    n_bl += 1
                    vf += (f",split[b{n_bl}][l{n_bl}];[l{n_bl}]crop={df['w']}:{df['h']}:{df['x']}:{df['y']},boxblur=12:2[r{n_bl}];"
                           f"[b{n_bl}][r{n_bl}]overlay={df['x']}:{df['y']}:enable='between(t,{max(0,d0)},{d1})'")
            vfp = f"crop={cr['w']}:{cr['h']}:{cr['x']}:{cr['y']},scale=640:-2"
            vf += ",scale=-2:'2*trunc(min(720\\,ih)/2)'"
            out = os.path.join(S, 'clips', nn + '.mp4')
            os.makedirs(os.path.dirname(out), exist_ok=True)
            if not os.path.exists(out):
                subprocess.run(['ffmpeg', '-nostdin', '-v', 'error', '-y', '-ss', str(c['inicio']), '-i', src, '-t', str(c['duracion']),
                                '-vf', vf, '-c:v', 'libx264', '-preset', 'veryfast', '-crf', '27', '-c:a', 'aac', '-b:a', '96k',
                                '-ac', '1', '-movflags', '+faststart', out], check=True)
            pst = os.path.join(W, 'public', c['poster'])
            os.makedirs(os.path.dirname(pst), exist_ok=True)
            # póster tomado del clip ya tapado
            subprocess.run(['ffmpeg', '-nostdin', '-v', 'error', '-y', '-ss', str(min(20, c['duracion'] // 3)), '-i', out,
                            '-frames:v', '1', '-vf', 'scale=640:-2', '-q:v', '5', pst], check=True)
    series.append({'id': 'fin-' + v, 'titulo': titulo, 'corto': corto, 'intro': intro, 'modulos': mods, 'capitulos': caps})

ts = '''/** Vídeos de las sesiones de formación de finanzas, troceados en capítulos (Release «video-finanzas-v1»).
 * Generado por montaje.py a partir del análisis de cada vídeo (transcripción + fotogramas). */
import type { CapituloVideo, MomentoVideo } from './videoMapa';

export interface SerieFin {
  id: string;
  titulo: string;
  corto: string;
  intro?: string;
  /** Módulos de la plataforma en cuya página se muestra */
  modulos: string[];
  capitulos: CapituloVideo[];
}

'''
ts += 'export const SERIES_FIN: SerieFin[] = ' + json.dumps(clean(series), ensure_ascii=False, indent=2) + ';\n\n'
ts += 'export const MOMENTOS_SECCION_FIN: Record<string, MomentoVideo[]> = ' + json.dumps(clean(series_mom_sec), ensure_ascii=False, indent=2) + ';\n\n'
ts += 'export const MOMENTOS_EJERCICIO_FIN: Record<string, MomentoVideo[]> = ' + json.dumps(clean(series_mom_ej), ensure_ascii=False, indent=2) + ';\n'
open(os.path.join(W, 'src/content/video-finanzas.ts'), 'w').write(ts)
for m, (b, l) in modulos_out.items():
    print(m, [(e['id'], e['titulo']) for e in l])
print('series', len(series), 'capitulos', sum(len(s['capitulos']) for s in series), 'copias', len(copias))
