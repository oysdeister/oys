/** Enlace al vídeo tutorial de compras (87 min). Defínelo al compilar con VITE_VIDEO_URL. */
export const VIDEO_URL = (import.meta.env.VITE_VIDEO_URL as string | undefined) ?? '';

export const CAPITULOS_VIDEO = [
  { n: 1, t: 0, titulo: 'Bienvenida: el módulo de compras' },
  { n: 2, t: 461, titulo: 'Los maestros: el proveedor y el artículo' },
  { n: 3, t: 1062, titulo: 'Los precios: listas y grupos de precios' },
  { n: 4, t: 1367, titulo: 'Cómo se numeran y clasifican los documentos' },
  { n: 5, t: 2270, titulo: 'El pedido de compra' },
  { n: 6, t: 3011, titulo: 'El albarán: recibir la mercancía' },
  { n: 7, t: 3565, titulo: 'La factura del proveedor' },
  { n: 8, t: 3952, titulo: 'Contabilizar: qué es un asiento' },
  { n: 9, t: 4447, titulo: 'Docflow: seguir el rastro de una compra' },
  { n: 10, t: 5085, titulo: 'Resumen y cierre' },
];

/** Capítulos del vídeo que refuerzan cada ejercicio */
export const VIDEO_POR_EJERCICIO: Record<string, number[]> = {
  'compras-1': [2, 3],
  'compras-2': [4, 6, 7, 8],
  'compras-3': [5, 6, 7, 9],
  'maestros-1': [2],
  'asientos-1': [8],
};

export function urlCapitulo(t: number) {
  return VIDEO_URL ? `${VIDEO_URL}#t=${t}` : '';
}

export function mmss(t: number) {
  const h = Math.floor(t / 3600), m = Math.floor((t % 3600) / 60), s = t % 60;
  return h ? `${h}:${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}` : `${m}:${String(s).padStart(2, '0')}`;
}
