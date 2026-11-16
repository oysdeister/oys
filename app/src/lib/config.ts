import { CAPITULOS, MOMENTOS_EJERCICIO } from '../content/videoMapa';

/** Enlace al vídeo tutorial de compras (87 min). Defínelo al compilar con VITE_VIDEO_URL. */
export const VIDEO_URL = (import.meta.env.VITE_VIDEO_URL as string | undefined) ?? '';

/** Capítulos del vídeo (inicio en segundos dentro del vídeo completo). Salen del mapa de content/videoMapa.ts. */
export const CAPITULOS_VIDEO = CAPITULOS.map((c) => ({ n: c.n, t: c.inicio, titulo: c.titulo }));

/** Capítulos del vídeo que refuerzan cada ejercicio, según MOMENTOS_EJERCICIO */
export const VIDEO_POR_EJERCICIO: Record<string, number[]> = Object.fromEntries(
  Object.entries(MOMENTOS_EJERCICIO).map(([id, ms]) => [id, [...new Set(ms.map((m) => m.capitulo))].sort((x, y) => x - y)]),
);

export function urlCapitulo(t: number) {
  return VIDEO_URL ? `${VIDEO_URL}#t=${t}` : '';
}

export function mmss(t: number) {
  const h = Math.floor(t / 3600), m = Math.floor((t % 3600) / 60), s = t % 60;
  return h ? `${h}:${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}` : `${m}:${String(s).padStart(2, '0')}`;
}
