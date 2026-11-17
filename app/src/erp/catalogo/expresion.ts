/* Evalúa las expresiones de cliente de Axional (habilitar botones, solo lectura) sobre una fila local.
   Lo que no conocemos (columnas de tablas unidas, variables de contexto) se trata como «cumple»,
   para que el botón se comporte como en un registro normal de la demo. */
import type { CatValor } from './tipos';

const RESERVADAS = new Set(
  'true false null undefined NaN Infinity typeof instanceof new in of if else return var let const function this void delete Math Number String Date parseInt parseFloat isNaN Boolean Array Object JSON __ins __f'.split(' '),
);
const compiladas = new Map<string, ((f: Record<string, unknown>, ins: boolean) => unknown) | null>();

function prepara(expr: string, cols: Set<string>): string {
  let e = expr.replace(/\/\/[^\n]*/g, ' ');
  e = e.replace(/context\.isOnInsert\(\)/g, '__ins').replace(/context\.isOnUpdate\(\)/g, '(!__ins)').replace(/context\.\w+(\([^)]*\))?/g, '__U');
  // a.b donde a no es columna (tabla unida o variable) → desconocido
  e = e.replace(/\b([A-Za-z_]\w*)\.([A-Za-z_]\w*)\b(?!\s*\()/g, (m, a: string) => (cols.has(a) || RESERVADAS.has(a) ? m : '__U'));
  // identificadores sueltos que no son columnas → desconocido
  e = e.replace(/(["'])(?:\\.|(?!\1).)*\1|\b[A-Za-z_]\w*\b(?!\s*[(:])/g, (m) => {
    if (m[0] === '"' || m[0] === "'") return m;
    return cols.has(m) || RESERVADAS.has(m) || m === '__U' ? m : '__U';
  });
  // comparaciones con algo desconocido → true
  const lit = `(?:'[^']*'|"[^"]*"|[\\w.]+)`;
  e = e.replace(new RegExp(`__U\\s*(?:===|!==|==|!=|>=|<=|>|<)\\s*${lit}`, 'g'), 'true');
  e = e.replace(new RegExp(`${lit}\\s*(?:===|!==|==|!=|>=|<=|>|<)\\s*__U`, 'g'), 'true');
  e = e.replace(/__U/g, 'true');
  return e;
}

/** Devuelve true/false; si la expresión no se entiende, true */
export function evalua(expr: string | undefined, fila: Record<string, CatValor | undefined>, insertando = false): boolean {
  if (!expr) return true;
  const cols = new Set(Object.keys(fila).filter((k) => !k.startsWith('_')));
  const clave = `${[...cols].length}|${expr}`;
  let fn = compiladas.get(clave);
  if (fn === undefined) {
    try {
      const cuerpo = prepara(expr, cols);
      fn = new Function('__f', '__ins', `with(__f){ return (${cuerpo}); }`) as (f: Record<string, unknown>, ins: boolean) => unknown;
    } catch {
      fn = null;
    }
    compiladas.set(clave, fn);
  }
  if (!fn) return true;
  try {
    const datos: Record<string, unknown> = {};
    for (const c of cols) datos[c] = fila[c] === undefined || fila[c] === '' ? null : fila[c];
    return !!fn(datos, insertando);
  } catch {
    return true;
  }
}
