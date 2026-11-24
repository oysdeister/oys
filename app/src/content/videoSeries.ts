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

// El vídeo de la tabla va primero: es la tarjeta «Mira primero el vídeo» de la sección que explica esa tabla
const SECCION_BRUTA = juntar(MOMENTOS_SECCION_TABLAS_FIN, MOM_SEC_COMPRAS, MOMENTOS_SECCION_TUT_FIN, MOMENTOS_SECCION_TESORERIA, MOMENTOS_SECCION_FIN);

/**
 * Tramos que no se enseñan en una sección porque ya los enseña la del módulo «dueño» del concepto
 * (auditoría H30). Formato: «serie|capítulo|t» (serie vacía = compras). El tramo sigue en los ficheros de origen.
 * Si quitarlo dejaba la sección sin vídeo, se mantiene (parametrizacion-icon-1-orden-carga, carteras-1-tercero, tesoreria-1-banco, maestros-1-tipos-efecto, asientos-14-comision).
 */
const QUITAR_POR_DUPLICADO: Record<string, string[]> = {
  'asientos-6-vigencia': ['fin-maestros|4|790', 'fin-icon1|2|367'],
  'parametrizacion-1-cuenta': ['fin-maestros|2|368'],
  'compras-1-tercero': ['compras|2|452'],
  'compras-1-condiciones': ['compras|2|593'],
  'asientos-2-lineas': ['compras|8|4128'],
  'maestros-1-plazos': ['compras|2|623'],
  'maestros-1-cuentas-perfil': ['compras|8|4007'],
};

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
const EJERCICIO = juntar(MOM_EJ_COMPRAS, MOMENTOS_EJERCICIO_TUT_FIN, MOMENTOS_EJERCICIO_TESORERIA, MOMENTOS_EJERCICIO_FIN);

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
  return [...SERIES_TABLAS_FIN, ...SERIES_TUT_FIN, ...SERIES_TESORERIA, ...SERIES_FIN].filter((s) => s.modulos.includes(modulo));
}
