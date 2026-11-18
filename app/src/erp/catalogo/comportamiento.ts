/* Comportamiento de cada pantalla copiado de Axional VNext (base TUTORIAL de nextdemo.geasa.eu).
   Un fichero por objeto en app/public/erp-cat/comp/<código>.json, escrito por los agentes de área
   a partir de la demo real (metadatos REST, pruebas con datos CAP y mensajes literales).
   El motor genérico (Generica.tsx) y las pantallas propias lo leen para validar, rellenar y ejecutar botones.

   EXPRESIONES (campos `si`, `expr`, `calc`, valores de `set`): JavaScript sobre la fila, con las columnas como
   variables (cabid, estcab, fecha…) y estas ayudas:
     __ins                       true si se está insertando
     hoy()                       fecha de hoy 'AAAA-MM-DD'
     vacio(x)                    null, undefined o ''
     existe(obj, col, valor)     hay una fila de <obj> con col == valor
     busca(obj, col, valor, ret) valor de la columna ret de esa fila (o null)
     cuenta(obj, col, valor)     nº de filas de <obj> con col == valor
     suma(obj, col, valor, campo)suma de <campo> en esas filas
     padre.<col>                 columna del registro padre (subrejillas)
     ent.<campo>                 valor escrito en el diálogo del botón
     siguiente(obj, col)         máximo + 1 de esa columna (numeradores)
   Los mensajes (`msg`, `ok`, `confirm`) son el TEXTO LITERAL de la demo; ${col} se sustituye por el valor. */

import type { CatCol } from './tipos';

export type CompTipoMsg = 'error' | 'aviso' | 'info' | 'ok';

/** Regla: si `si` es verdadera, se muestra `msg` (y si es error, se para la operación) */
export interface CompRegla {
  si: string;
  msg: string;
  tipo?: CompTipoMsg;
  /** campo al que apunta el mensaje (se enfoca) */
  campo?: string;
  /** de dónde sale: 'demo' (provocado con datos CAP), 'meta' (metadatos REST), 'deducido' */
  fuente?: 'demo' | 'meta' | 'deducido';
}

/** Lista de valores (lupa) de un campo */
export interface CompLov {
  /** objeto/tabla de donde salen los valores */
  obj: string;
  /** columna que se guarda */
  clave: string;
  /** columnas que muestra la lupa, en orden */
  cols?: string[];
  /** columna descriptiva que se muestra al lado del código */
  desc?: string;
  /** filtro: expresión sobre la fila candidata `l` y la fila actual (p. ej. "l.estado == 'A'") */
  filtro?: string;
  /** mensaje literal si el valor escrito no existe */
  noExiste?: string;
}

export interface CompCampo {
  req?: 1;
  /** expresión: obligatorio solo si… */
  reqSi?: string;
  lov?: CompLov;
  /** valor por defecto fijo o expresión con defExpr */
  def?: string | number | boolean | null;
  defExpr?: string;
  /** expresión de solo lectura */
  ro?: string;
  /** expresión de oculto */
  oculto?: string;
  mayus?: 1;
  /** valor calculado (no editable) */
  calc?: string;
  /** al cambiar este campo, asigna otros: { col: expr } */
  alCambiar?: Record<string, string>;
  reglas?: CompRegla[];
}

/** Paso que ejecuta un botón sobre el modelo local, en orden */
export interface CompPaso {
  /** asigna columnas de la fila actual: { col: expr } */
  set?: Record<string, string>;
  /** crea una fila en otro objeto: valores { col: expr } (puede usar las columnas de la fila actual) */
  crea?: { obj: string; valores: Record<string, string>; /** 'objHijo:colDelHijo:colDeEstaFila' → crea una fila por cada hija (sus columnas como l.<col>) */ porCada?: string };
  /** actualiza filas de otro objeto donde col == expr */
  actualiza?: { obj: string; donde: [string, string]; set: Record<string, string> };
  /** borra filas de otro objeto donde col == expr */
  borra?: { obj: string; donde: [string, string] };
  /** navega al objeto (y clave = expr) */
  ir?: { obj: string; clave?: string };
  /** muestra un mensaje intermedio */
  msg?: { tipo: CompTipoMsg; texto: string };
}

export interface CompBoton {
  /** etiqueta tal como sale en la demo */
  l: string;
  /** campos del diálogo que abre (con sus tipos, obligatorios, defectos y opciones reales) */
  dialogo?: CatCol[];
  /** título del diálogo */
  dialogoTit?: string;
  /** texto literal de confirmación (Sí/No) */
  confirm?: string;
  /** precondiciones con su mensaje literal */
  pre?: CompRegla[];
  pasos?: CompPaso[];
  /** mensaje literal de éxito */
  ok?: string;
  /** qué hace en la demo, en una frase (documentación) */
  nota?: string;
}

export interface CompObjeto {
  c: string;
  /** fecha de captura y quién (agente de área) */
  fecha: string;
  area: 'compras' | 'ventas' | 'almacen' | 'maestros' | 'contabilidad' | 'activos' | 'tesoreria' | 'transversal';
  campos?: Record<string, CompCampo>;
  alGuardar?: CompRegla[];
  alBorrar?: CompRegla[];
  /** botones por código (CatBoton.c) */
  botones?: Record<string, CompBoton>;
  /** máquina de estados de la columna de estado */
  estados?: { col: string; trans: { de: string[]; a: string; por: string }[] };
  /** diferencias conocidas o cosas que la réplica no puede hacer */
  notas?: string[];
}
