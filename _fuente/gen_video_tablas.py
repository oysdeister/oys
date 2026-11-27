"""Genera app/src/content/video-tablas-fin.ts y los pósters a partir de _fuente/video_tablas.json.

Cada entrada: {modulo, archivo (nombre en la release, sin .mp4), mp4 (ruta local del render), titulo,
tipo: nuevo|mejorado, secciones: [ids], escenas: [[t, título]], poster_t?}.
Duración = ffprobe del mp4 local; póster = fotograma en poster_t (por defecto 6 s) → app/public/video/tablas/<archivo>.jpg.
Uso: python3 _fuente/gen_video_tablas.py [--sin-poster]
"""
import json, subprocess, sys
from pathlib import Path

RAIZ = Path(__file__).resolve().parent.parent
SPEC = json.loads((RAIZ / '_fuente/video_tablas.json').read_text())
POST = RAIZ / 'app/public/video/tablas'
POST.mkdir(parents=True, exist_ok=True)
RELEASE = 'https://github.com/oysdeister/oys/releases/download/video-tablas-fin-v1'

SERIES = {
    'icon-contabilidad': ('tab-contabilidad', 'Vídeos por tabla: Contabilidad general', 'Tablas de contabilidad'),
    'carteras': ('tab-cartera', 'Vídeos por tabla: Cartera, cobros y pagos', 'Tablas de cartera'),
    'tesoreria': ('tab-tesoreria', 'Vídeos por tabla: Tesorería', 'Tablas de tesorería'),
    'icon-impuestos': ('tab-impuestos', 'Vídeos por tabla: Impuestos', 'Tablas de impuestos'),
    'icon-activos': ('tab-activos', 'Vídeos por tabla: Activos fijos', 'Tablas de activos'),
}


def dur(p):
    return float(subprocess.check_output(['ffprobe', '-v', 'error', '-show_entries', 'format=duration', '-of', 'csv=p=0', p]))


series, momentos = {}, {}
for e in SPEC:
    sid, tit, corto = SERIES[e['modulo']]
    s = series.setdefault(sid, {'id': sid, 'titulo': tit, 'corto': corto, 'porTabla': True, 'modulos': [e['modulo']],
                                'intro': 'Un vídeo corto por tabla: para qué sirve y cómo se parametriza, con pantallas reales.',
                                'capitulos': []})
    n = len(s['capitulos']) + 1
    d = round(dur(e['mp4']))
    if '--sin-poster' not in sys.argv:
        subprocess.run(['ffmpeg', '-v', 'error', '-y', '-ss', str(e.get('poster_t', 6)), '-i', e['mp4'], '-frames:v', '1',
                        '-vf', 'scale=640:-2', '-q:v', '4', str(POST / f"{e['archivo']}.jpg")], check=True)
    s['capitulos'].append({'n': n, 'titulo': e['titulo'], 'inicio': 0, 'duracion': d, 'url': f"{RELEASE}/{e['archivo']}.mp4",
                           'poster': f"video/tablas/{e['archivo']}.jpg",
                           'escenas': [{'t': t, 'titulo': x} for t, x in e.get('escenas', [[0, e['titulo']]])]})
    titulo_m = f"Vídeo: {e['titulo']}" if e['tipo'] == 'nuevo' else f"Vídeo de los ponentes, mejorado: {e['titulo']}"
    for sec in e['secciones']:
        momentos.setdefault(sec, []).append({'serie': sid, 'capitulo': n, 't': 0, 'tCap': 0, 'titulo': titulo_m})
    print(f"{e['modulo']:18} {e['tipo']:9} {d:4d}s  {e['titulo']}")

ts = f'''/**
 * Un vídeo corto por tabla de finanzas (para qué sirve y cómo se parametriza), Release «video-tablas-fin-v1».
 * Cada capítulo es un vídeo suelto: «nuevo» (Remotion, pantallas reales de la demo, voz y callouts) o
 * «mejorado» (trozo de una sesión de los ponentes de Deister, recortado al ERP, nítido y con subtítulos).
 * Su momento va el primero en la sección que explica la tabla (tarjeta «Mira primero el vídeo»).
 * Generado por _fuente/gen_video_tablas.py desde _fuente/video_tablas.json: no editar a mano.
 */
import type {{ CapituloVideo, MomentoVideo }} from './videoMapa';

export interface SerieTablasFin {{
  id: string;
  titulo: string;
  corto: string;
  intro?: string;
  porTabla: true;
  /** Módulos de la plataforma en cuya página se muestra */
  modulos: string[];
  capitulos: CapituloVideo[];
}}

export const SERIES_TABLAS_FIN: SerieTablasFin[] = {json.dumps(list(series.values()), ensure_ascii=False, indent=2)};

export const MOMENTOS_SECCION_TABLAS_FIN: Record<string, MomentoVideo[]> = {json.dumps(momentos, ensure_ascii=False, indent=2)};
'''
(RAIZ / 'app/src/content/video-tablas-fin.ts').write_text(ts.replace('"porTabla": true', '"porTabla": true as const'))
print(len(SPEC), 'vídeos,', len(momentos), 'secciones')
