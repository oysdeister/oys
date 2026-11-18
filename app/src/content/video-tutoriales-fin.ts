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

const RELEASE = 'https://github.com/oysdeister/oys/releases/download/video-tutoriales-fin-v1';
const clip = (f: string) => `${RELEASE}/${f}.mp4`;

export const SERIES_TUT_FIN: SerieTutorialFin[] = [
  {
    id: 'tut-contabilidad',
    titulo: 'Tutorial: Contabilidad general',
    corto: 'Tutorial de contabilidad',
    intro: 'Contabilizar una factura, el asiento, la cartera y el IVA, el diario y los periodos, facturas directas y rectificativas, y el cierre del año, con pantallas reales.',
    modulos: ['icon-contabilidad'],
    capitulos: [
      {
        n: 1,
        titulo: 'Contabilizar una factura de compra',
        inicio: 0,
        duracion: 162,
        url: clip('con-cap01'),
        poster: 'video/tutoriales/con-cap01.jpg',
        escenas: [
          { t: 0, titulo: 'Presentación' },
          { t: 22, titulo: 'Qué es contabilizar: asiento, debe y haber' },
          { t: 58, titulo: 'Una factura de compra contabilizada' },
          { t: 87, titulo: 'El asiento línea a línea y su cuadre' },
          { t: 139, titulo: 'Resumen' },
        ],
      },
      {
        n: 2,
        titulo: 'Qué genera una factura contabilizada',
        inicio: 162,
        duracion: 88,
        url: clip('con-cap02'),
        poster: 'video/tutoriales/con-cap02.jpg',
        escenas: [
          { t: 4, titulo: 'Qué nace al contabilizar' },
          { t: 20, titulo: 'El efecto en la cartera' },
          { t: 46, titulo: 'El IVA en Impuestos por documento' },
          { t: 70, titulo: 'Resumen' },
        ],
      },
      {
        n: 3,
        titulo: 'El diario y los periodos',
        inicio: 250,
        duracion: 96,
        url: clip('con-cap03'),
        poster: 'video/tutoriales/con-cap03.jpg',
        escenas: [
          { t: 4, titulo: 'Diario, ejercicio y periodos' },
          { t: 26, titulo: 'La lista de diarios' },
          { t: 46, titulo: 'Los 12 periodos y su estado' },
          { t: 76, titulo: 'Resumen' },
        ],
      },
      {
        n: 4,
        titulo: 'Facturas directas y rectificativas',
        inicio: 346,
        duracion: 114,
        url: clip('con-cap04'),
        poster: 'video/tutoriales/con-cap04.jpg',
        escenas: [
          { t: 4, titulo: 'Directa, rectificativa y sustitutiva' },
          { t: 31, titulo: 'Facturas de compras de Finanzas' },
          { t: 54, titulo: 'La pestaña Rectifica' },
          { t: 74, titulo: 'Tres motivos por los que no contabiliza' },
          { t: 97, titulo: 'Resumen' },
        ],
      },
      {
        n: 5,
        titulo: 'Cierre del ejercicio y balances',
        inicio: 460,
        duracion: 132,
        url: clip('con-cap05'),
        poster: 'video/tutoriales/con-cap05.jpg',
        escenas: [
          { t: 4, titulo: 'Cerrar el año: regularizar, cerrar, abrir' },
          { t: 30, titulo: 'Regularización y cierre temporal' },
          { t: 52, titulo: 'Cierre definitivo y reapertura' },
          { t: 78, titulo: 'Estado de situación financiera' },
          { t: 100, titulo: 'Resumen' },
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
  'icon-contabilidad-1': [
    m('tut-contabilidad', 3, 4, 'Tutorial: Diario, ejercicio y periodos'),
    m('tut-contabilidad', 3, 26, 'Tutorial: La lista de diarios'),
    m('tut-contabilidad', 3, 46, 'Tutorial: Los 12 periodos y su estado'),
  ],
  'icon-contabilidad-2': [
    m('tut-contabilidad', 5, 30, 'Tutorial: Regularización y cierre temporal'),
    m('tut-contabilidad', 5, 52, 'Tutorial: Cierre definitivo y reapertura'),
  ],
  'icon-contabilidad-3': [
    m('tut-contabilidad', 5, 78, 'Tutorial: Estado de situación financiera'),
  ],
  'icon-contabilidad-v-1': [
    m('tut-contabilidad', 1, 58, 'Tutorial: La factura contabilizada'),
    m('tut-contabilidad', 1, 87, 'Tutorial: El asiento y su cuadre'),
    m('tut-contabilidad', 2, 20, 'Tutorial: El efecto en la cartera'),
    m('tut-contabilidad', 2, 46, 'Tutorial: El IVA de la factura'),
  ],
  'icon-contabilidad-v-2': [
    m('tut-contabilidad', 4, 4, 'Tutorial: Factura directa, rectificativa y sustitutiva'),
    m('tut-contabilidad', 4, 31, 'Tutorial: Nuevo documento en Finanzas'),
  ],
  'icon-contabilidad-v-3': [
    m('tut-contabilidad', 4, 4, 'Tutorial: Cuándo rectificar o sustituir'),
    m('tut-contabilidad', 4, 54, 'Tutorial: La pestaña Rectifica'),
  ],
  'icon-contabilidad-v-4': [
    m('tut-contabilidad', 4, 74, 'Tutorial: Tres motivos por los que no contabiliza'),
    m('tut-contabilidad', 3, 46, 'Tutorial: Periodos abiertos y cerrados'),
  ],
};

export const MOMENTOS_SECCION_TUT_FIN: Record<string, MomentoVideo[]> = {};
