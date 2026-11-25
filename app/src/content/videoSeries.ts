/**
 * Registro de todos los vídeos troceados en capítulos («series»).
 * Compras vive en videoMapa.ts; cada serie nueva, en su propio fichero video-<serie>.ts,
 * y se registra aquí con una línea.
 */
import {
  CAPITULOS,
  MOMENTOS_EJERCICIO as MOM_EJ_COMPRAS,
  MOMENTOS_SECCION as MOM_SEC_COMPRAS,
  MOMENTOS_MODULO,
  type CapituloVideo,
  type MomentoVideo,
} from './videoMapa';
import { SERIES_FIN, MOMENTOS_SECCION_FIN, MOMENTOS_EJERCICIO_FIN } from './video-finanzas';
import { SERIES_TUT_FIN, MOMENTOS_SECCION_TUT_FIN, MOMENTOS_EJERCICIO_TUT_FIN } from './video-tutoriales-fin';
import { SERIES_WORKFLOW, MOMENTOS_SECCION_WORKFLOW, MOMENTOS_EJERCICIO_WORKFLOW } from './video-workflow';
import { SERIES_TABLAS_FIN, MOMENTOS_SECCION_TABLAS_FIN } from './video-tablas-fin';
import { SERIES_TESORERIA, MOMENTOS_SECCION_TESORERIA, MOMENTOS_EJERCICIO_TESORERIA } from './video-tesoreria';

export interface SerieVideo {
  id: string;
  /** «Vídeo de compras», «Sesión de finanzas 1»… */
  titulo: string;
  /** Texto corto para el botón «Míralo en el vídeo» */
  corto: string;
  /** Página propia del vídeo (solo compras la tiene) */
  pagina?: string;
  /** Una frase de qué enseña */
  intro?: string;
  /** Trozo de una grabación: el botón enseña el minuto de la sesión original para buscarlo a mano */
  original?: boolean;
  /** Un vídeo corto por tabla (cada capítulo es un vídeo suelto): el botón enseña su duración */
  porTabla?: boolean;
  capitulos: CapituloVideo[];
}

export const SERIES: Record<string, SerieVideo> = {
  compras: { id: 'compras', titulo: 'Vídeo de compras', corto: 'Compras', pagina: '/video', capitulos: CAPITULOS },
  ...Object.fromEntries(SERIES_TABLAS_FIN.map((s) => [s.id, s])),
  ...Object.fromEntries(SERIES_TUT_FIN.map((s) => [s.id, s])),
  ...Object.fromEntries(SERIES_WORKFLOW.map((s) => [s.id, s])),
  ...Object.fromEntries(SERIES_TESORERIA.map((s) => [s.id, s])),
  ...Object.fromEntries(SERIES_FIN.map((s) => [s.id, s])),
};

export function serieDe(id?: string): SerieVideo {
  return SERIES[id ?? 'compras'] ?? SERIES.compras;
}

function juntar(...mapas: Record<string, MomentoVideo[]>[]) {
  const r: Record<string, MomentoVideo[]> = {};
  for (const m of mapas) for (const [k, v] of Object.entries(m)) r[k] = [...(r[k] ?? []), ...v];
  return r;
}

/**
 * Tramos que no se enseñan en una sección porque ya los enseña la del módulo «dueño» del concepto
 * (auditoría H30). Formato: «serie|capítulo|t» (serie vacía = compras). El tramo sigue en los ficheros de origen.
 * Si quitarlo dejaba la sección sin vídeo, se mantiene (parametrizacion-icon-1-orden-carga, carteras-1-tercero, tesoreria-1-banco, maestros-1-tipos-efecto, asientos-14-comision).
 */
const QUITAR_POR_DUPLICADO: Record<string, string[]> = {
  'asientos-6-vigencia': ['fin-maestros|4|790', 'fin-icon1|2|367', 'tut-contabilidad|3|296'],
  'parametrizacion-1-cuenta': ['fin-maestros|2|368'],
  'compras-1-tercero': ['compras|2|452'],
  'compras-1-condiciones': ['compras|2|593'],
  'asientos-2-lineas': ['compras|8|4128'],
  'maestros-1-plazos': ['compras|2|623'],
  'maestros-1-cuentas-perfil': ['compras|8|4007'],
  // Auditoría H32: «Contabilizar la factura» se grabó en otra base (fin-icon1, factura ML0260020); el capítulo 8 de Compras lo enseña en TUTORIAL
  'icon-contabilidad-v-1-contabilizar': ['fin-icon1|1|44'],
  // Cada vídeo o tramo en un solo punto del menú (petición de Sergi, 25-11-2026): se queda donde se enseña el concepto por primera vez
  'parametrizacion-icon-1-orden-carga': ['fin-maestros|4|876', 'fin-maestros|1|92'], // en maestros-v-3 y maestros-v-1
  'carteras-1-tipo-efecto': ['compras|2|615'], // en maestros-1 (Tipos de efectos)
  'carteras-1-tercero': ['compras|2|609'], // en compras-1 (Condiciones)
  'icon-contabilidad-v-1-factura-origen': ['fin-icon1|1|17'], // en parametrizacion-icon-2
  'parametrizacion-icon-2-plantillas-permiso': ['tab-contabilidad|6|0'], // en icon-contabilidad-1 (plantillas)
  'icon-contabilidad-1-diario': ['tut-contabilidad|3|276'], // en asientos-1 (crear el diario)
  'icon-contabilidad-v-4-periodos': ['tut-contabilidad|3|296', 'fin-icon11|6|885'], // en icon-contabilidad-1 (ejercicio y periodos)
  'compras-2-conformar': ['compras|7|3517'], // en compras-2-factura
  'carteras-3-caja': ['tab-cartera|2|0'], // en carteras-3-banco
  'tesoreria-1-banco': ['tab-cartera|2|0'],
  'carteras-5-estados': ['tab-cartera|5|0'], // en icon-cartera-1
  'carteras-5-remesa-banco': ['tab-cartera|3|0'], // en icon-cartera-v-4 (tipos de remesa)
  'icon-cartera-v-5-remesas-por-cuenta': ['tab-cartera|3|0'],
  'icon-cartera-v-7-domiciliacion': ['fin-icon11|8|1340'], // «Mezclar cheque y TF» va en tipos de efecto
  'icon-cartera-v-7-tipos-efecto': ['fin-icon11|8|1267'], // «Domiciliación no informada» va en su sección
  'asientos-14-comision': ['tab-tesoreria|1|0'], // en tesoreria-1 (comisiones)
  'tesoreria-2-conciliacion': ['tab-tesoreria|3|0'], // en tesoreria-2-operacion
  'tesoreria-nav-moverse': ['tesoreria-2|5|1868'], // en tesoreria-4 (conceptos propios)
  'icon-impuestos-v-2-tipo-impuesto': ['tab-impuestos|3|0'], // en icon-impuestos-1
  'icon-impuestos-v-2-regla-2586': ['tab-impuestos|4|0'],
};

/** Tramos de Compras que sustituyen a uno grabado en otra base (H32): se añaden a la sección y al bloque */
const CONTABILIZAR_COMPRAS: MomentoVideo = { capitulo: 8, t: 4076, tCap: 275, fin: 327, titulo: 'Contabilizar la factura (con los datos de la demo)' };
// Ya no se añade a icon-contabilidad-v-1-contabilizar: el mismo tramo está en compras-factura (un tramo, un sitio)
const ANADIR_SECCION: Record<string, MomentoVideo[]> = {};

// El vídeo de la tabla va primero: es la tarjeta «Mira primero el vídeo» de la sección que explica esa tabla
const SECCION_BRUTA = juntar(MOMENTOS_SECCION_TABLAS_FIN, MOM_SEC_COMPRAS, ANADIR_SECCION, MOMENTOS_SECCION_TUT_FIN, MOMENTOS_SECCION_WORKFLOW, MOMENTOS_SECCION_TESORERIA, MOMENTOS_SECCION_FIN);

const claveTramo = (m: MomentoVideo) => `${m.serie ?? 'compras'}|${m.capitulo}|${m.t}`;

/** Sin tramos repetidos dentro de la sección, sin los de QUITAR_POR_DUPLICADO y, dentro de cada vídeo, por orden de tiempo (H31) */
function ordenar(id: string, lista: MomentoVideo[]): MomentoVideo[] {
  const quitar = new Set(QUITAR_POR_DUPLICADO[id] ?? []);
  const vistos = new Set<string>();
  const util = lista.filter((m) => {
    const k = `${claveTramo(m)}|${m.fin ?? ''}`;
    if (quitar.has(claveTramo(m)) || vistos.has(k)) return false;
    vistos.add(k);
    return true;
  });
  // Los vídeos mantienen el orden en que aparecen (el de la tabla va primero); dentro de cada uno, de menor a mayor tiempo
  const orden = new Map<string, number>();
  util.forEach((m) => { if (!orden.has(m.serie ?? 'compras')) orden.set(m.serie ?? 'compras', orden.size); });
  return util
    .map((m, i) => ({ m, i }))
    .sort((a, b) => (orden.get(a.m.serie ?? 'compras')! - orden.get(b.m.serie ?? 'compras')!) || a.m.capitulo - b.m.capitulo || a.m.t - b.m.t || a.i - b.i)
    .map((x) => x.m);
}

const SECCION: Record<string, MomentoVideo[]> = Object.fromEntries(Object.entries(SECCION_BRUTA).map(([id, l]) => [id, ordenar(id, l)]));
const EJERCICIO = juntar(MOM_EJ_COMPRAS, MOMENTOS_EJERCICIO_TUT_FIN, MOMENTOS_EJERCICIO_WORKFLOW, MOMENTOS_EJERCICIO_TESORERIA, MOMENTOS_EJERCICIO_FIN);
// H32: en el bloque, el tramo de «Contabilizar la factura» de otra base pasa a ser el del capítulo 8 de Compras
EJERCICIO['icon-contabilidad-v-1'] = [
  ...(EJERCICIO['icon-contabilidad-v-1'] ?? []).filter((m) => claveTramo(m) !== 'fin-icon1|1|44'),
  CONTABILIZAR_COMPRAS,
];

export function momentosDeSeccion(id: string): MomentoVideo[] {
  return SECCION[id] ?? [];
}

export function momentosDeEjercicio(id: string): MomentoVideo[] {
  return EJERCICIO[id] ?? [];
}

/** Vídeo de presentación del módulo (tarjeta «Mira primero el vídeo» de su página) */
export function momentosDeModulo(id: string): MomentoVideo[] {
  return MOMENTOS_MODULO[id] ?? [];
}

/** Series que pertenecen a un módulo (para mostrar sus capítulos en la página del módulo) */
export function seriesDeModulo(modulo: string): SerieVideo[] {
  if (modulo === 'compras') return [SERIES.compras];
  return [...SERIES_TABLAS_FIN, ...SERIES_TUT_FIN, ...SERIES_WORKFLOW, ...SERIES_TESORERIA, ...SERIES_FIN].filter((s) => s.modulos.includes(modulo));
}
