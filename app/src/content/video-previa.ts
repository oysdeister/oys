/**
 * Formación previa: un vídeo y un podcast por guía (contabilidad y ERP), hechos con NotebookLM.
 * Release «video-previa-v1». Los podcasts son solo audio (audio: true). Se muestran en la página de Vídeos, módulo 0.
 */
import type { CapituloVideo } from './videoMapa';
import type { SerieTutorialFin } from './video-tutoriales-fin';

const RELEASE = 'https://github.com/oysdeister/oys/releases/download/video-previa-v1';

export const SERIES_PREVIA: SerieTutorialFin[] = [
  {
    id: 'previa',
    titulo: 'Formación previa: vídeos y podcasts',
    corto: 'Formación previa',
    intro: 'Vídeos y un podcast por guía de «Antes de empezar con Axional»: la contabilidad desde cero y qué es un ERP. También están en el apartado 0 de cada guía.',
    modulos: ['fundamentos'],
    capitulos: [
      { n: 1, titulo: 'Vídeo: los conceptos básicos de la contabilidad', inicio: 0, duracion: 423, url: `${RELEASE}/contabilidad-conceptos.mp4`, poster: 'img/previa/video/contabilidad-conceptos.jpg', escenas: [] },
      { n: 2, titulo: 'Vídeo: la contabilidad desde cero', inicio: 0, duracion: 454, url: `${RELEASE}/contabilidad-video.mp4`, poster: 'img/previa/video/contabilidad-video.jpg', escenas: [] },
      { n: 3, titulo: 'Podcast: por qué quiebra una empresa rentable', inicio: 0, duracion: 1978, url: `${RELEASE}/contabilidad-podcast.m4a`, audio: true, escenas: [] },
      { n: 4, titulo: 'Vídeo: cómo funciona un ERP', inicio: 0, duracion: 482, url: `${RELEASE}/erp-video.mp4`, poster: 'img/previa/video/erp-video.jpg', escenas: [] },
      { n: 5, titulo: 'Podcast: del caos de datos al ERP', inicio: 0, duracion: 962, url: `${RELEASE}/erp-podcast.m4a`, audio: true, escenas: [] },
    ] satisfies CapituloVideo[],
  },
];
