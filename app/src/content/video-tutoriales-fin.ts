/**
 * Vídeos tutoriales propios de finanzas (O&S): uno por módulo, con pantallas reales de la demo,
 * callouts y voz, troceados en un clip por capítulo (Release «video-tutoriales-fin-v1»).
 * Se registran en videoSeries.ts. Los tiempos de «escenas» y de los momentos son segundos dentro del clip.
 */
import type { CapituloVideo, MomentoVideo } from './videoMapa';

export interface SerieTutorialFin {
  id: string;
  titulo: string;
  corto: string;
  intro?: string;
  /** Módulos de la plataforma en cuya página se muestra */
  modulos: string[];
  capitulos: CapituloVideo[];
}

const RELEASE = 'https://github.com/sergibauli/oys/releases/download/video-tutoriales-fin-v1';
const clip = (f: string) => `${RELEASE}/${f}.mp4`;

export const SERIES_TUT_FIN: SerieTutorialFin[] = [
  {
    id: 'tut-contabilidad',
    titulo: 'Tutorial: Contabilidad general',
    corto: 'Tutorial de contabilidad',
    intro: 'Qué genera contabilizar una factura, el asiento y su cuadre, paso a paso con pantallas reales.',
    modulos: ['icon-contabilidad'],
    capitulos: [
      {
        n: 1,
        titulo: 'Contabilizar una factura de compra',
        inicio: 0,
        duracion: 158,
        url: clip('con-cap01'),
        poster: 'video/tutoriales/con-cap01.jpg',
        escenas: [
          { t: 0, titulo: 'Presentación' },
          { t: 22, titulo: 'Qué es contabilizar: asiento, debe y haber' },
          { t: 54, titulo: 'Una factura de compra contabilizada' },
          { t: 83, titulo: 'El asiento de la factura y su cuadre' },
          { t: 136, titulo: 'Resumen' },
        ],
      },
    ],
  },
];

/** Momento dentro de un capítulo de una serie (t = segundo en el vídeo completo, tCap = en el clip) */
function m(serie: string, capitulo: number, tCap: number, titulo: string): MomentoVideo {
  const s = SERIES_TUT_FIN.find((x) => x.id === serie)!;
  const c = s.capitulos.find((x) => x.n === capitulo)!;
  return { serie, capitulo, t: c.inicio + tCap, tCap, titulo };
}

export const MOMENTOS_EJERCICIO_TUT_FIN: Record<string, MomentoVideo[]> = {
  'icon-contabilidad-v-1': [
    m('tut-contabilidad', 1, 54, 'Tutorial: la factura contabilizada'),
    m('tut-contabilidad', 1, 83, 'Tutorial: el asiento y su cuadre'),
  ],
};

export const MOMENTOS_SECCION_TUT_FIN: Record<string, MomentoVideo[]> = {};
