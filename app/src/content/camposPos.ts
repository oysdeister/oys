import POS from './campos-pos.json';

/** Dónde se ve un campo de la tabla de campos en una captura (porcentajes sobre la imagen). */
export interface PosCampo {
  imagen: string;
  x: number;
  y: number;
  w: number;
  h: number;
}

const MAPA = POS as Record<string, Record<string, PosCampo>>;

/**
 * Posición localizada (por OCR de las capturas) del campo i de una sección, si se encontró su etiqueta
 * en alguna de las capturas de esa sección. Generado por _fuente/campos-ocr/.
 */
export function posCampo(seccion: string, i: number): PosCampo | undefined {
  return MAPA[seccion]?.[String(i)];
}
