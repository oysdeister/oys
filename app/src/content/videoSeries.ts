/**
 * Registro de todos los vídeos troceados en capítulos («series»).
 * Compras vive en videoMapa.ts; cada serie nueva, en su propio fichero video-<serie>.ts,
 * y se registra aquí con una línea.
 */
import {
  CAPITULOS,
  MOMENTOS_EJERCICIO as MOM_EJ_COMPRAS,
  MOMENTOS_SECCION as MOM_SEC_COMPRAS,
  type CapituloVideo,
  type MomentoVideo,
} from './videoMapa';
import { SERIES_TESORERIA, MOMENTOS_SECCION_TESORERIA, MOMENTOS_EJERCICIO_TESORERIA } from './video-tesoreria';

export interface SerieVideo {
  id: string;
  /** «Vídeo de compras», «Sesión ICON 1»… */
  titulo: string;
  /** Texto corto para el botón «Míralo en el vídeo» */
  corto: string;
  /** Página propia del vídeo (solo compras la tiene) */
  pagina?: string;
  /** Una frase de qué enseña */
  intro?: string;
  /** Trozo de una grabación: el botón enseña el minuto de la sesión original para buscarlo a mano */
  original?: boolean;
  capitulos: CapituloVideo[];
}

export const SERIES: Record<string, SerieVideo> = {
  compras: { id: 'compras', titulo: 'Vídeo de compras', corto: 'Compras', pagina: '/video', capitulos: CAPITULOS },
  ...Object.fromEntries(SERIES_TESORERIA.map((s) => [s.id, s])),
};

export function serieDe(id?: string): SerieVideo {
  return SERIES[id ?? 'compras'] ?? SERIES.compras;
}

function juntar(...mapas: Record<string, MomentoVideo[]>[]) {
  const r: Record<string, MomentoVideo[]> = {};
  for (const m of mapas) for (const [k, v] of Object.entries(m)) r[k] = [...(r[k] ?? []), ...v];
  return r;
}

const SECCION = juntar(MOM_SEC_COMPRAS, MOMENTOS_SECCION_TESORERIA);
const EJERCICIO = juntar(MOM_EJ_COMPRAS, MOMENTOS_EJERCICIO_TESORERIA);

export function momentosDeSeccion(id: string): MomentoVideo[] {
  return SECCION[id] ?? [];
}

export function momentosDeEjercicio(id: string): MomentoVideo[] {
  return EJERCICIO[id] ?? [];
}

/** Series que pertenecen a un módulo (para mostrar sus capítulos en la página del módulo) */
export function seriesDeModulo(modulo: string): SerieVideo[] {
  if (modulo === 'compras') return [SERIES.compras];
  return SERIES_TESORERIA.filter((s) => s.modulos.includes(modulo));
}
