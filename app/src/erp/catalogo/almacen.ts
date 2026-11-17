/* Datos de las pantallas genéricas: filas de ejemplo de la base TUTORIAL + lo que graba el alumno (localStorage). */
import { useSyncExternalStore } from 'react';
import type { CatCol, CatObjeto, CatValor } from './tipos';

export type Fila = { _k: string; _autor?: string } & Record<string, CatValor | undefined>;
interface Cambios {
  nuevos: Fila[];
  mod: Record<string, Record<string, CatValor>>;
  borr: string[];
}
export interface EventoGen {
  t: string;
  que: string;
  code: string;
  k: string;
  autor: string;
  /** botón pulsado (para la corrección) */
  boton?: string;
}
interface Gen {
  version: 1;
  obj: Record<string, Cambios>;
  seq: number;
  log: EventoGen[];
}
const CLAVE = 'oys-erp-gen-v1';
const vacio = (): Gen => ({ version: 1, obj: {}, seq: 0, log: [] });
function leer(): Gen {
  try {
    const d = JSON.parse(localStorage.getItem(CLAVE) || 'null') as Gen | null;
    return d?.version === 1 ? d : vacio();
  } catch {
    return vacio();
  }
}
let gen: Gen = leer();
const oyentes = new Set<() => void>();
function guardar(g: Gen) {
  gen = g;
  try {
    localStorage.setItem(CLAVE, JSON.stringify(g));
  } catch {
    /* sin almacenamiento */
  }
  oyentes.forEach((f) => f());
}
export function useGen() {
  return useSyncExternalStore(
    (f) => {
      oyentes.add(f);
      return () => oyentes.delete(f);
    },
    () => gen,
  );
}
export const getGen = () => gen;

export const hoyIso = () => new Date().toISOString().slice(0, 10);
/** Valor inicial de una columna al dar de alta (las fechas por defecto de Axional son «hoy») */
export function valorDefecto(c: CatCol): CatValor {
  if (c.def === undefined) return c.chk ? (c.o?.find((o) => /^(N|0)$/.test(o.k))?.k ?? null) : null;
  if (c.t === 'd' || c.t === 'dt') return /^\d{4}-\d{2}-\d{2}/.test(c.def) ? hoyIso() : c.def;
  if (c.t === 'i' || c.t === 'n') return Number.isFinite(Number(c.def)) ? Number(c.def) : null;
  return c.def;
}
export function filaNueva(o: CatObjeto): Fila {
  const f: Fila = { _k: '' };
  for (const c of o.cols ?? []) f[c.n] = valorDefecto(c);
  return f;
}

const cache = new WeakMap<CatObjeto, { g: Gen; filas: Fila[] }>();
/** Filas visibles de un objeto: ejemplo de la TUTORIAL con los cambios del alumno */
export function filasDe(o: CatObjeto, g: Gen = gen): Fila[] {
  const c = cache.get(o);
  if (c && c.g === g) return c.filas;
  const ch = g.obj[o.c];
  const cols = o.cols ?? [];
  const base: Fila[] = (o.filas ?? []).map((r, i) => {
    const f: Fila = { _k: `s${i}`, _autor: 'TUTORIAL' };
    cols.forEach((col, j) => (f[col.n] = r[j] ?? null));
    return f;
  });
  let filas = [...base, ...(ch?.nuevos ?? [])];
  if (ch) filas = filas.filter((f) => !ch.borr.includes(f._k)).map((f) => (ch.mod[f._k] ? { ...f, ...ch.mod[f._k] } : f));
  cache.set(o, { g, filas });
  return filas;
}

const cambiosDe = (code: string): Cambios => gen.obj[code] ?? { nuevos: [], mod: {}, borr: [] };
const conLog = (g: Gen, e: Omit<EventoGen, 't'>): Gen => ({ ...g, log: [...g.log, { ...e, t: new Date().toISOString() }].slice(-600) });

export const almacen = {
  insertar(code: string, fila: Fila, autor: string): string {
    const seq = gen.seq + 1;
    const k = `u${seq}`;
    const ch = cambiosDe(code);
    const nueva: Fila = { ...fila, _k: k, _autor: autor };
    guardar(conLog({ ...gen, seq, obj: { ...gen.obj, [code]: { ...ch, nuevos: [...ch.nuevos, nueva] } } }, { que: 'crear', code, k, autor }));
    return k;
  },
  actualizar(code: string, k: string, cambios: Record<string, CatValor | undefined>, autor: string, que = 'editar', boton?: string) {
    const ch = cambiosDe(code);
    const limpio: Record<string, CatValor> = {};
    for (const [n, v] of Object.entries(cambios)) if (!n.startsWith('_') && v !== undefined) limpio[n] = v;
    const esNuevo = ch.nuevos.some((f) => f._k === k);
    const sig: Cambios = esNuevo
      ? { ...ch, nuevos: ch.nuevos.map((f) => (f._k === k ? { ...f, ...limpio } : f)) }
      : { ...ch, mod: { ...ch.mod, [k]: { ...(ch.mod[k] ?? {}), ...limpio } } };
    guardar(conLog({ ...gen, obj: { ...gen.obj, [code]: sig } }, { que, code, k, autor, boton }));
  },
  borrar(code: string, k: string, autor: string) {
    const ch = cambiosDe(code);
    const sig: Cambios = k.startsWith('u') ? { ...ch, nuevos: ch.nuevos.filter((f) => f._k !== k) } : { ...ch, borr: [...ch.borr, k] };
    guardar(conLog({ ...gen, obj: { ...gen.obj, [code]: sig } }, { que: 'borrar', code, k, autor }));
  },
  /** Deja constancia de un botón pulsado aunque no cambie datos (corrección de prácticas) */
  registrar(code: string, k: string, autor: string, boton: string) {
    guardar(conLog(gen, { que: 'boton', code, k, autor, boton }));
  },
  reiniciar() {
    guardar(vacio());
  },
};

/** Texto que identifica una fila (columnas de la clave visibles en la lista) */
export function claveTexto(o: CatObjeto, f: Fila) {
  const l = o.lista ?? [];
  const v = l.slice(0, 2).map((n) => f[n]).filter((x) => x !== null && x !== undefined && x !== '');
  return v.length ? v.join(' · ') : f._k;
}
