/**
 * Vídeo tutorial «Ventas en Axional Deister VNext» (6 capítulos). Release «video-ventas-v1».
 * Se registra en videoSeries.ts. Los tiempos de «escenas» y de los momentos son segundos dentro del clip.
 */
import type { MomentoVideo } from './videoMapa';
import type { SerieTutorialFin } from './video-tutoriales-fin';

const RELEASE = 'https://github.com/oysdeister/oys/releases/download/video-ventas-v1';
const clip = (f: string) => `${RELEASE}/${f}.mp4`;

export const SERIES_VENTAS: SerieTutorialFin[] = [
  {
    id: 'tut-ventas',
    titulo: 'Ventas en Axional Deister VNext',
    corto: 'Vídeo de ventas',
    intro: 'Qué es el módulo de ventas, cómo se da de alta un cliente y cómo se numeran y se crean los tipos de los documentos de venta, y el circuito completo: pedido, albarán, factura, contabilización y vencimiento.',
    modulos: ['ventas'],
    capitulos: [
      {
        n: 1,
        titulo: 'Bienvenida: el módulo de ventas',
        inicio: 0,
        duracion: 292,
        url: clip('cap01'),
        poster: 'img/ventas-video/cap01.jpg',
        escenas: [
          { t: 18, titulo: 'Bienvenida: el módulo de ventas' },
          { t: 28, titulo: 'Para qué sirve el módulo de ventas' },
          { t: 59, titulo: 'El circuito de ventas' },
          { t: 116, titulo: 'Nuestro punto de partida' },
          { t: 136, titulo: 'El menú lateral' },
          { t: 164, titulo: 'Recorrido por Ventas: el ciclo' },
          { t: 202, titulo: 'Recorrido por Ventas: el resto' },
          { t: 237, titulo: 'Qué vamos a ver' },
          { t: 265, titulo: 'Qué has aprendido' },
        ],
      },
      {
        n: 2,
        titulo: 'El cliente',
        inicio: 292,
        duracion: 378,
        url: clip('cap02'),
        poster: 'img/ventas-video/cap02.jpg',
        escenas: [
          { t: 9, titulo: 'Tercero y cliente' },
          { t: 49, titulo: 'Alta del tercero' },
          { t: 120, titulo: 'Relación contable del cliente' },
          { t: 166, titulo: 'Dirección del tercero' },
          { t: 204, titulo: 'Condición de cobro del tercero' },
          { t: 240, titulo: 'Validar el tercero' },
          { t: 273, titulo: 'Alta del cliente' },
          { t: 344, titulo: 'Qué has hecho' },
        ],
      },
      {
        n: 3,
        titulo: 'La numeración y los tipos de documento',
        inicio: 670,
        duracion: 406,
        url: clip('cap03'),
        poster: 'img/ventas-video/cap03.jpg',
        escenas: [
          { t: 10, titulo: 'Cada documento tiene su tipo' },
          { t: 44, titulo: 'El numerador y la máscara de serie' },
          { t: 88, titulo: 'Los numeradores de documentos' },
          { t: 131, titulo: 'El numerador del pedido de venta' },
          { t: 165, titulo: 'Nuevo como: copiar en vez de empezar de cero' },
          { t: 185, titulo: 'Tipo de factura FPVD' },
          { t: 259, titulo: 'Tipo de albarán APVD' },
          { t: 323, titulo: 'Tipo de pedido PDVD' },
          { t: 372, titulo: 'Qué has hecho' },
        ],
      },
      {
        n: 4,
        titulo: 'El pedido de venta',
        inicio: 1076,
        duracion: 437,
        url: clip('cap04'),
        poster: 'img/ventas-video/cap04.jpg',
        escenas: [
          { t: 6, titulo: 'Qué es un pedido de venta' },
          { t: 40, titulo: 'Qué datos lleva un pedido' },
          { t: 76, titulo: 'La lista de pedidos de venta' },
          { t: 114, titulo: 'Crea el pedido: tipo y almacén' },
          { t: 152, titulo: 'El cliente y sus condiciones' },
          { t: 185, titulo: 'El agente comercial' },
          { t: 212, titulo: 'Guarda el pedido' },
          { t: 225, titulo: 'Abre el pedido' },
          { t: 255, titulo: 'Añade la línea del pedido' },
          { t: 295, titulo: 'Guarda la línea y comprueba el importe' },
          { t: 325, titulo: 'Las cifras del pedido' },
          { t: 361, titulo: 'Valida el pedido' },
          { t: 388, titulo: 'El importe del pedido' },
          { t: 401, titulo: 'Qué has hecho' },
        ],
      },
      {
        n: 5,
        titulo: 'Del albarán a la factura',
        inicio: 1513,
        duracion: 678,
        url: clip('cap05'),
        poster: 'img/ventas-video/cap05.jpg',
        escenas: [
          { t: 6, titulo: 'Qué es un albarán' },
          { t: 34, titulo: 'Crea el albarán' },
          { t: 65, titulo: 'Origen: el pedido de partida' },
          { t: 103, titulo: 'Guarda el albarán' },
          { t: 127, titulo: 'Abre el albarán' },
          { t: 145, titulo: 'Revisa la línea del albarán' },
          { t: 172, titulo: 'Corrige el importe de la línea' },
          { t: 221, titulo: 'Valida el albarán' },
          { t: 239, titulo: 'El albarán validado' },
          { t: 259, titulo: 'Crea la factura' },
          { t: 306, titulo: 'Guarda la factura vacía' },
          { t: 326, titulo: 'Abre la factura' },
          { t: 337, titulo: 'Abre la ventana de conformar' },
          { t: 368, titulo: 'Conforma el albarán' },
          { t: 397, titulo: 'Base, IVA y total' },
          { t: 413, titulo: 'El asiento de esta factura' },
          { t: 474, titulo: 'Contabiliza la factura' },
          { t: 506, titulo: 'Lee el asiento' },
          { t: 553, titulo: 'El vencimiento' },
          { t: 594, titulo: 'Docflow: el rastro completo' },
          { t: 641, titulo: 'Qué has hecho' },
        ],
      },
      {
        n: 6,
        titulo: 'Resumen y ejercicios',
        inicio: 2191,
        duracion: 167,
        url: clip('cap06'),
        poster: 'img/ventas-video/cap06.jpg',
        escenas: [
          { t: 7, titulo: 'El circuito completo de ventas' },
          { t: 45, titulo: 'Qué has aprendido' },
          { t: 73, titulo: 'Tres ejercicios para practicar' },
          { t: 127, titulo: 'Si te atascas' },
        ],
      },
    ],
  },
];

/** Momento dentro de un capítulo (t = segundo en el vídeo completo, tCap = en el clip); fin = segundo del clip en que acaba */
function m(capitulo: number, tCap: number, fin: number, titulo: string): MomentoVideo {
  const c = SERIES_VENTAS[0].capitulos.find((x) => x.n === capitulo)!;
  return { serie: 'tut-ventas', capitulo, t: c.inicio + tCap, tCap, fin, titulo };
}

export const MOMENTOS_EJERCICIO_VENTAS: Record<string, MomentoVideo[]> = {};

/** Cada tramo en una sola sección (el capítulo 1 se reparte entre las dos entradas de navegación) */
export const MOMENTOS_SECCION_VENTAS: Record<string, MomentoVideo[]> = {
  'ventas-nav-circuito': [m(1, 28, 136, 'Vídeo: bienvenida y el circuito de ventas'), m(6, 7, 167, 'Vídeo: resumen del circuito y ejercicios para practicar')],
  'ventas-nav-moverse': [m(1, 136, 265, 'Vídeo: el menú lateral y el recorrido por Ventas')],
  'ventas-cliente-tercero': [m(2, 9, 204, 'Vídeo: el tercero y su relación contable')],
  'ventas-cliente-cobro': [m(2, 204, 273, 'Vídeo: condición de cobro y validar el tercero')],
  'ventas-cliente-maestro': [m(2, 273, 344, 'Vídeo: alta del cliente')],
  'ventas-documentos-numerador': [m(3, 10, 165, 'Vídeo: la numeración de los documentos')],
  'ventas-documentos-factura': [m(3, 165, 259, 'Vídeo: el tipo de factura FPVD')],
  'ventas-documentos-albaran': [m(3, 259, 323, 'Vídeo: el tipo de albarán APVD')],
  'ventas-documentos-pedido': [m(3, 323, 372, 'Vídeo: el tipo de pedido PDVD')],
  'ventas-pedido-pedido': [m(4, 6, 401, 'Vídeo: crear y validar el pedido de venta')],
  'ventas-pedido-albaran': [m(5, 6, 259, 'Vídeo: crear y validar el albarán')],
  'ventas-pedido-factura': [m(5, 259, 413, 'Vídeo: crear la factura conformando el albarán')],
  'ventas-pedido-contabilizar': [m(5, 413, 553, 'Vídeo: el asiento y contabilizar la factura')],
  'ventas-pedido-cobro': [m(5, 553, 641, 'Vídeo: el vencimiento y el Docflow')],
};
