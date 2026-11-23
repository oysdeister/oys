/**
 * Vídeo «Introducción a Axional y su navegación»: qué es un ERP, la barra superior, el buscador,
 * el menú lateral y qué es un maestro. Es genérico para todos los módulos (no es parte del vídeo de compras).
 * Un solo clip (intro.mp4) en la Release «video-v2» de GitHub (junto con los cap. 1 y 2 de compras recortados); VITE_VIDEO_INTRO_URL cambia la base.
 */
import type { CapituloVideo, MomentoVideo } from './videoMapa';

export interface SerieIntro {
  id: 'intro';
  titulo: string;
  corto: string;
  intro: string;
  /** Módulos de la plataforma en cuya página se muestra */
  modulos: string[];
  capitulos: CapituloVideo[];
}

const RELEASE = 'https://github.com/oysdeister/oys/releases/download/video-v2';
const BASE = ((import.meta.env.VITE_VIDEO_INTRO_URL as string | undefined) || RELEASE).replace(/\/$/, '');
const url = /^https?:/.test(BASE) ? `${BASE}/intro.mp4` : `${import.meta.env.BASE_URL}${BASE}/intro.mp4`;

/** [segundo, título, fin] de cada escena del vídeo (medido sobre el montaje, ±0,5 s) */
const ESCENAS: [number, string, number][] = [
  [0, 'Bienvenida', 10],
  [10, 'Qué es un ERP', 29],
  [29, 'La barra superior', 62],
  [62, 'El buscador', 92],
  [92, 'El menú lateral', 105],
  [105, 'Qué es un maestro', 123],
  [123, 'Un consejo antes de empezar', 136],
  [136, 'Qué has aprendido', 148],
];

export const SERIES_INTRO: SerieIntro[] = [
  {
    id: 'intro',
    titulo: 'Introducción a Axional y su navegación',
    corto: 'Introducción a Axional',
    intro: 'Qué es un ERP, cómo moverte por Axional con la barra superior, el buscador y el menú lateral, y qué es un maestro. Sirve para todos los módulos.',
    modulos: ['maestros'],
    capitulos: [
      {
        n: 1,
        titulo: 'Introducción a Axional y su navegación',
        inicio: 0,
        duracion: 148,
        url,
        poster: 'video/intro.jpg',
        escenas: ESCENAS.map(([t, titulo]) => ({ t, titulo })),
      },
    ],
  },
];

const mom = (titulo: string): MomentoVideo => {
  const [t, , fin] = ESCENAS.find((e) => e[1] === titulo)!;
  return { serie: 'intro', capitulo: 1, t, tCap: t, titulo, fin };
};

/** Parte «Moverte por Axional» del bloque 1 de Maestros: el vídeo entero, por escenas */
export const MOMENTOS_SECCION_INTRO: Record<string, MomentoVideo[]> = {
  'maestros-moverte-axional': ['Qué es un ERP', 'La barra superior', 'El buscador', 'El menú lateral', 'Qué es un maestro'].map(mom),
};

/** Vídeo de presentación del módulo de Maestros (primer módulo del curso) */
export const MOMENTOS_MODULO_INTRO: Record<string, MomentoVideo[]> = {
  maestros: [{ serie: 'intro', capitulo: 1, t: 0, tCap: 0, titulo: 'Introducción a Axional y su navegación' }],
};
