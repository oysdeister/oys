/* Pantallas del menú de Axional que en la práctica tienen lógica propia (circuitos de los ejercicios). */
import type { Pantalla, PantallaFija } from '../modelo';

export const PROPIA: Record<string, PantallaFija> = {
  ctercero: 'terceros',
  gproveed: 'proveedores',
  garticul: 'articulos',
  gcompedh: 'pedidos',
  gcomalbh: 'albaranes',
  gcomfach: 'facturas',
  galmstkc: 'stock',
  casientos: 'asientos',
  cefectos: 'efectos',
  cremesas: 'remesas',
  textract: 'extractos',
  textract_concil_taptcuen_vtab: 'conciliacion',
};
/** Código de Axional de cada pantalla propia */
export const CODIGO: Partial<Record<PantallaFija, string>> = Object.fromEntries(Object.entries(PROPIA).map(([c, p]) => [p, c]));
/** Pantalla que abre un código del menú */
export const destino = (code: string): Pantalla => PROPIA[code] ?? `obj:${code}`;
/** Código de catálogo de la pantalla actual */
export const codigoDe = (p: Pantalla) => (p.startsWith('obj:') ? p.slice(4) : CODIGO[p as PantallaFija]);
