/* Formato del catálogo de pantallas copiado de Axional VNext (nextdemo, base TUTORIAL).
   Lo genera app/scripts/erp-catalogo/condensar.py en app/public/erp-cat/ y se carga bajo demanda. */

/** Nodo del menú: carpeta (h) u hoja con código de objeto (c) y tipo (k: t tabla, q consulta o informe, x otro) */
export interface CatMenuNodo {
  n: string;
  c?: string;
  k?: 't' | 'q' | 'x';
  h?: CatMenuNodo[];
}
/** Entrada del buscador ⌘K: [nombre, código, ruta del menú] */
export type CatBuscar = [string, string, string];

export interface CatOpcion {
  k: string;
  v: string;
  /** color del puntito (estado) */
  c?: string;
}
/** Columna de una tabla o campo de una consulta */
export interface CatCol {
  n: string;
  l: string;
  /** s texto · x texto largo · i entero · n decimal · d fecha · dt fecha y hora · b booleano */
  t: 's' | 'x' | 'i' | 'n' | 'd' | 'dt' | 'b';
  sz?: number;
  sc?: number;
  req?: 1;
  /** 1 = solo lectura siempre; texto = expresión de solo lectura de Axional */
  ro?: 1 | string;
  def?: string;
  up?: 1;
  o?: CatOpcion[];
  /** casilla S/N */
  chk?: 1;
  /** ayuda (tooltip) */
  h?: string;
  hid?: 1;
  /** tabla referenciada (clave foránea) */
  fk?: string;
}
/** Pestaña dentro de una caja: F campos, O subobjeto (rejilla), S script/HTML */
export interface CatTab {
  t: string;
  k: 'F' | 'O' | 'S';
  /** campos: [columna, colspan?] */
  f?: [string, number?][];
  /** columnas de la rejilla de campos */
  g?: number;
  /** código del subobjeto */
  o?: string;
  ht?: 1;
}
export interface CatCaja {
  /** ancho en la rejilla de 12 */
  s: number;
  tabs: CatTab[];
}
/** Pestaña superior de la ficha (la primera es la cabecera; las demás, detalles) */
export interface CatLayout {
  l: string;
  cajas: CatCaja[];
}
export interface CatBoton {
  c: string;
  l: string;
  /** grupo: «Acciones» va en el menú Acciones ⋮ */
  g?: string;
  /** color de fondo real */
  bg?: string;
  /** expresión de habilitación de Axional (JS sobre las columnas) */
  en?: string;
  /** se oculta si no está habilitado */
  hid?: 1;
  conf?: 1;
  /** abre un diálogo con campos */
  campos?: 1;
  sel?: 'M';
}
/** Entrada del menú ⌄ del título */
export interface CatEnlace {
  l: string;
  m?: number;
}
export type CatValor = string | number | boolean | null;
export interface CatObjeto {
  c: string;
  tit: string;
  k: 'table' | 'qbe' | string;
  cols?: CatCol[];
  /** columnas visibles en la lista, en orden */
  lista?: string[];
  lay?: CatLayout[];
  bot?: CatBoton[];
  enl?: CatEnlace[];
  filtros?: string[];
  /** grupos del panel lateral de la lista */
  lat?: { l: string; c: string[] }[];
  perm?: { i?: 1; u?: 1; d?: 1 };
  /** filas de ejemplo de la base TUTORIAL, alineadas con cols */
  filas?: CatValor[][];
  total?: number;
  qbe?: { tipo: string; nota?: string | null; campos: CatCol[]; vars: CatCol[] };
}
