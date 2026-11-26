/**
 * Vídeo tutorial de la aprobación de pedidos de compra con workflow (Deister Axional VNext):
 * qué es, cómo se configura y cómo se prueba, en tres capítulos (Release «video-workflow-v1»).
 * Se registra en videoSeries.ts. Los tiempos de «escenas» y de los momentos son segundos dentro del clip.
 */
import type { MomentoVideo } from './videoMapa';
import type { SerieTutorialFin } from './video-tutoriales-fin';

const RELEASE = 'https://github.com/oysdeister/oys/releases/download/video-workflow-v1';
const clip = (f: string) => `${RELEASE}/${f}.mp4`;

export const SERIES_WORKFLOW: SerieTutorialFin[] = [
  {
    id: 'tut-workflow',
    titulo: 'Aprobación de pedidos con workflow',
    corto: 'Vídeo del workflow',
    intro: 'Qué es un workflow de aprobación, cómo se configura (rol, circuito, grupo de validaciones y tipología) y cómo se prueba con un pedido de compra.',
    modulos: ['compras'],
    capitulos: [
      {
        n: 1,
        titulo: 'Qué es un workflow de aprobación',
        inicio: 0,
        duracion: 169,
        url: clip('cap01'),
        poster: 'img/workflow-video/cap01.jpg',
        escenas: [
          { t: 24, titulo: 'Un jefe que firma las compras' },
          { t: 52, titulo: 'Cinco piezas' },
          { t: 91, titulo: 'Dónde se configura: Finanzas' },
          { t: 118, titulo: 'Dónde se prueba: Compras' },
          { t: 142, titulo: 'Qué has aprendido' },
        ],
      },
      {
        n: 2,
        titulo: 'Configurar la aprobación',
        inicio: 169,
        duracion: 374,
        url: clip('cap02'),
        poster: 'img/workflow-video/cap02.jpg',
        escenas: [
          { t: 9, titulo: 'El rol: quién aprueba' },
          { t: 35, titulo: 'Asigna un usuario al rol' },
          { t: 57, titulo: 'El circuito' },
          { t: 80, titulo: 'Las etapas del circuito' },
          { t: 129, titulo: 'Los conectores' },
          { t: 183, titulo: 'Diseño de workflow: el circuito dibujado' },
          { t: 215, titulo: 'El grupo de validaciones' },
          { t: 247, titulo: 'La validación del grupo' },
          { t: 290, titulo: 'La tipología del pedido' },
          { t: 348, titulo: 'Qué has hecho' },
        ],
      },
      {
        n: 3,
        titulo: 'Probar el workflow',
        inicio: 543,
        duracion: 352,
        url: clip('cap03'),
        poster: 'img/workflow-video/cap03.jpg',
        escenas: [
          { t: 7, titulo: 'Cuatro pasos' },
          { t: 26, titulo: 'Crea el pedido sin referencia' },
          { t: 70, titulo: 'Campos obligatorios y guardar' },
          { t: 99, titulo: 'Importa la línea del pedido' },
          { t: 133, titulo: 'Revalida el pedido' },
          { t: 162, titulo: 'El pedido bloqueado' },
          { t: 184, titulo: 'La tarea pendiente del aprobador' },
          { t: 214, titulo: 'Autoriza el pedido' },
          { t: 258, titulo: 'Pedido validado y traza Autorizado' },
          { t: 280, titulo: 'Retroceder: solo lista' },
          { t: 305, titulo: 'Qué has hecho' },
          { t: 321, titulo: 'Hazlo tú' },
        ],
      },
    ],
  },
];

/** Momento dentro de un capítulo (t = segundo en el vídeo completo, tCap = en el clip); fin = segundo del clip en que acaba */
function m(capitulo: number, tCap: number, fin: number, titulo: string): MomentoVideo {
  const c = SERIES_WORKFLOW[0].capitulos.find((x) => x.n === capitulo)!;
  return { serie: 'tut-workflow', capitulo, t: c.inicio + tCap, tCap, fin, titulo };
}

export const MOMENTOS_EJERCICIO_WORKFLOW: Record<string, MomentoVideo[]> = {};

/**
 * Cada tramo en una sola sección. Van por id de sección: caps. 1 y 2 en el bloque «compras-workflow-config»
 * (menu, rol, circuito, validacion, grupo, tipologia) y cap. 3 en «compras-workflow» (prueba, autorizar, consulta).
 */
export const MOMENTOS_SECCION_WORKFLOW: Record<string, MomentoVideo[]> = {
  'compras-workflow-menu': [m(1, 24, 169, 'Vídeo: qué es un workflow y dónde están las piezas')],
  'compras-workflow-validacion': [m(2, 247, 290, 'Vídeo: la validación del grupo')],
  'compras-workflow-grupo': [m(2, 215, 247, 'Vídeo: el grupo de validaciones')],
  'compras-workflow-rol': [m(2, 9, 57, 'Vídeo: el rol y su usuario')],
  'compras-workflow-circuito': [m(2, 57, 215, 'Vídeo: el circuito, sus etapas y conectores')],
  'compras-workflow-tipologia': [m(2, 290, 348, 'Vídeo: enlazar el grupo a la tipología')],
  'compras-workflow-prueba': [m(3, 7, 184, 'Vídeo: probar, el pedido se bloquea')],
  'compras-workflow-autorizar': [m(3, 184, 280, 'Vídeo: autorizar desde Gestionar')],
  'compras-workflow-consulta': [m(3, 280, 305, 'Vídeo: Autorizar y Retroceder solo listan')],
};
