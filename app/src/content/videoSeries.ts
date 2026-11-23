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
const SECCION = juntar(MOMENTOS_SECCION_TABLAS_FIN, MOM_SEC_COMPRAS, MOMENTOS_SECCION_TUT_FIN, MOMENTOS_SECCION_TESORERIA, MOMENTOS_SECCION_FIN);
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
