/**
 * Progreso compactado para guardarlo en `user.unsafeMetadata.oys` de Clerk (límite de 8 KB por usuario).
 *
 * Medido con el contenido actual (80 ejercicios): el progreso completo en JSON ocupa ~8,9 KB y
 * no cabe; compactado (pasos y checklist como máscaras de bits en hexadecimal, sin textos) ~3 KB.
 * El examen solo se guarda si está aprobado, sin las preguntas (se regeneran desde el código).
 *
 * Fusión: siempre gana el mayor avance (unión de pasos y checklist, mejor nota, OR de superados).
 */
import { CLAVE_PROGRESO, type Progreso, type EstadoEjercicio } from '../lib/progress';
import { CLAVE_EXAMEN, corregir, generarTeoria, type EstadoExamen } from '../lib/examen';

type EstadoExamenLike = EstadoExamen;
import { CLAVE_NOTAS } from '../erp/practicas';
import { CLAVE_AVANCE } from '../sims/kit';

export const CLAVE_VISTAS = 'oys-insignias-vistas';
/** Claves de localStorage que forman el progreso del alumno (se borran al cambiar de usuario). */
export const CLAVES_PROGRESO = [CLAVE_PROGRESO, CLAVE_EXAMEN, CLAVE_NOTAS, CLAVE_AVANCE, CLAVE_VISTAS];
/** Límite que nos imponemos (Clerk admite 8 KB en total de metadata). */
export const LIMITE_BYTES = 7000;

type EjC = [pasos: string, guiado: 0 | 1, test: number, demo: string];
interface ExamenC {
  c: string;
  al: EstadoExamen['alumno'];
  i: string;
  f?: string;
  ft?: string;
  sr: 0 | 1;
  rt: EstadoExamen['respTeoria'];
  r: Record<string, string>;
  /** teoría, práctica y global, 0-1 con 3 decimales */
  g: [number, number, number];
  val?: EstadoExamen['validacion'];
  env?: EstadoExamen['envio'];
}
export interface ProgresoC {
  v: 1;
  /** nombre, iniciales, usuario, id */
  a: [string, string, string, string];
  e: Record<string, EjC>;
  s: string[];
  t: Record<string, number>;
  n: Record<string, [number, string]>;
  x: ExamenC | null;
  iv: string[];
  c: string;
  u: string;
}

/* ------------------------------------------------------------ máscaras de bits */
function aMascara(ids: number[]): string {
  let v = 0n;
  for (const i of ids) if (Number.isInteger(i) && i >= 0 && i < 512) v |= 1n << BigInt(i);
  return v.toString(16);
}
function deMascara(h: string | undefined): number[] {
  if (!h || !/^[0-9a-f]+$/.test(h)) return [];
  let v = BigInt('0x' + h);
  const r: number[] = [];
  for (let i = 0; v > 0n; i++, v >>= 1n) if (v & 1n) r.push(i);
  return r;
}
const union = (a: number[], b: number[]) => [...new Set([...a, ...b])].sort((x, y) => x - y);
const r3 = (n: number) => Math.round(n * 1000) / 1000;

/* ------------------------------------------------------------ lectura de localStorage */
function leerJson<T>(clave: string, defecto: T): T {
  try {
    const raw = localStorage.getItem(clave);
    return raw ? (JSON.parse(raw) as T) : defecto;
  } catch {
    return defecto;
  }
}
function escribirJson(clave: string, v: unknown) {
  try {
    localStorage.setItem(clave, JSON.stringify(v));
  } catch {
    /* almacenamiento bloqueado */
  }
}

function examenAC(e: EstadoExamenLike | null): ExamenC | null {
  if (!e || !e.resultado?.aprobado) return null;
  const { teoria, practica, global } = e.resultado;
  return {
    c: e.codigo,
    al: e.alumno,
    i: e.inicio,
    f: e.fin,
    ft: e.finTeoria,
    sr: e.sinRequisito ? 1 : 0,
    rt: e.respTeoria,
    r: e.resp,
    g: [r3(teoria), r3(practica), r3(global)],
    val: e.validacion,
    env: e.envio,
  };
}

/** Reconstruye un examen aprobado. Las notas guardadas mandan aunque el contenido haya cambiado. */
function examenDeC(x: ExamenC): EstadoExamen {
  const base: EstadoExamen = {
    version: 1,
    codigo: x.c,
    alumno: x.al,
    inicio: x.i,
    sinRequisito: !!x.sr,
    fase: 'resultado',
    teoria: [],
    respTeoria: x.rt ?? [],
    resp: x.r ?? {},
    finTeoria: x.ft,
    fin: x.f,
    validacion: x.val,
    envio: x.env,
  };
  try {
    base.teoria = generarTeoria(x.c);
    if (base.respTeoria.length !== base.teoria.length) base.respTeoria = base.teoria.map((_, i) => x.rt?.[i] ?? null);
    const calc = corregir(base);
    base.resultado = { ...calc, teoria: x.g[0], practica: x.g[1], global: x.g[2], aprobado: true };
  } catch {
    /* si el examen ya no se puede regenerar, se conserva la nota */
  }
  return base;
}

/** Lee el progreso de este navegador y lo compacta. */
export function leerLocal(): ProgresoC {
  const p = leerJson<Partial<Progreso>>(CLAVE_PROGRESO, {});
  const al = p.alumno ?? { id: '', nombre: '', ini: '', usuario: '' };
  const e: Record<string, EjC> = {};
  for (const [id, ej] of Object.entries(p.ejercicios ?? {})) {
    if (!ej) continue;
    e[id] = [aMascara(ej.pasos ?? []), ej.guiado ? 1 : 0, ej.test == null ? -1 : Math.round(ej.test * 100), aMascara(ej.demo ?? [])];
  }
  const ex = leerJson<{ aprobado?: EstadoExamenLike | null }>(CLAVE_EXAMEN, {});
  const notas = leerJson<Record<string, { nota: number; fecha: string }>>(CLAVE_NOTAS, {});
  const n: ProgresoC['n'] = {};
  for (const [id, v] of Object.entries(notas)) if (v && typeof v.nota === 'number') n[id] = [r3(v.nota), (v.fecha ?? '').slice(0, 10)];
  const ahora = new Date().toISOString();
  return {
    v: 1,
    a: [al.nombre ?? '', al.ini ?? '', al.usuario ?? '', al.id ?? ''],
    e,
    s: Object.entries(p.sims ?? {})
      .filter(([, ok]) => ok)
      .map(([k]) => k),
    t: leerJson<Record<string, number>>(CLAVE_AVANCE, {}),
    n,
    x: examenAC(ex.aprobado ?? null),
    iv: leerJson<string[]>(CLAVE_VISTAS, []),
    c: p.creado ?? ahora,
    u: p.actualizado ?? ahora,
  };
}

/** Escribe un progreso compactado en localStorage (los almacenes se recargan después). */
export function escribirLocal(pc: ProgresoC) {
  const previo = leerJson<Partial<Progreso>>(CLAVE_PROGRESO, {});
  const ejercicios: Record<string, EstadoEjercicio> = {};
  for (const [id, [pa, g, t, d]] of Object.entries(pc.e)) ejercicios[id] = { pasos: deMascara(pa), guiado: !!g, test: t < 0 ? null : t / 100, demo: deMascara(d) };
  const [nombre, ini, usuario, id] = pc.a;
  const progreso: Progreso = {
    version: 1,
    alumno: { id, nombre, ini, usuario },
    ejercicios,
    sims: Object.fromEntries(pc.s.map((k) => [k, true])),
    creado: pc.c,
    actualizado: pc.u > (previo.actualizado ?? '') ? pc.u : (previo.actualizado ?? pc.u),
  };
  escribirJson(CLAVE_PROGRESO, progreso);
  escribirJson(CLAVE_AVANCE, pc.t);
  escribirJson(CLAVE_NOTAS, Object.fromEntries(Object.entries(pc.n).map(([k, [nota, fecha]]) => [k, { nota, fecha }])));
  escribirJson(CLAVE_VISTAS, pc.iv);
  const ex = leerJson<{ actual?: unknown; aprobado?: EstadoExamenLike | null }>(CLAVE_EXAMEN, {});
  const local = examenAC(ex.aprobado ?? null);
  if (pc.x && JSON.stringify(local) !== JSON.stringify(pc.x)) {
    escribirJson(CLAVE_EXAMEN, { actual: ex.actual ?? null, aprobado: examenDeC(pc.x) });
  }
}

function mejorExamen(a: ExamenC | null, b: ExamenC | null): ExamenC | null {
  if (!a || !b) return a ?? b;
  if (a.c === b.c) return { ...a, val: a.val ?? b.val, env: a.env?.ok ? a.env : (b.env ?? a.env) };
  if (!!a.val !== !!b.val) return a.val ? a : b;
  if (a.g[2] !== b.g[2]) return a.g[2] > b.g[2] ? a : b;
  return (a.f ?? '') >= (b.f ?? '') ? a : b;
}

/** Fusiona dos progresos quedándose siempre con el mayor avance. */
export function fusionar(a: ProgresoC, b: ProgresoC | null): ProgresoC {
  if (!b) return a;
  const e: Record<string, EjC> = { ...b.e };
  for (const [id, ea] of Object.entries(a.e)) {
    const eb = e[id];
    e[id] = eb
      ? [aMascara(union(deMascara(ea[0]), deMascara(eb[0]))), ea[1] || eb[1] ? 1 : 0, Math.max(ea[2], eb[2]), aMascara(union(deMascara(ea[3]), deMascara(eb[3])))]
      : ea;
  }
  const t = { ...b.t };
  for (const [k, v] of Object.entries(a.t)) t[k] = Math.max(v, t[k] ?? 0);
  const n = { ...b.n };
  for (const [k, v] of Object.entries(a.n)) if (!n[k] || v[0] > n[k][0]) n[k] = v;
  const alumnoA = a.a[1] && a.a[2];
  return {
    v: 1,
    a: alumnoA ? a.a : b.a[1] ? b.a : a.a,
    e,
    s: [...new Set([...a.s, ...b.s])],
    t,
    n,
    x: mejorExamen(a.x, b.x),
    iv: [...new Set([...a.iv, ...b.iv])],
    c: a.c < b.c ? a.c : b.c,
    u: a.u > b.u ? a.u : b.u,
  };
}

/** Comparación sin fechas de actualización: ¿hay algo nuevo que subir? */
export function igualSinFecha(a: ProgresoC, b: ProgresoC | null) {
  if (!b) return false;
  return JSON.stringify({ ...a, u: '' }) === JSON.stringify({ ...b, u: '' });
}

/** Valida lo que llega de la cuenta (unsafeMetadata lo puede editar el propio usuario). */
export function esProgresoC(v: unknown): v is ProgresoC {
  if (!v || typeof v !== 'object') return false;
  const p = v as ProgresoC;
  return p.v === 1 && Array.isArray(p.a) && typeof p.e === 'object' && Array.isArray(p.s) && typeof p.t === 'object' && typeof p.n === 'object' && Array.isArray(p.iv);
}

/** Recorta lo prescindible si no cabe en el límite. */
export function ajustar(pc: ProgresoC): ProgresoC {
  const tam = (x: ProgresoC) => new TextEncoder().encode(JSON.stringify(x)).length;
  let r = pc;
  if (tam(r) > LIMITE_BYTES) r = { ...r, iv: [] };
  if (tam(r) > LIMITE_BYTES && r.x) r = { ...r, x: { ...r.x, rt: [] } };
  if (tam(r) > LIMITE_BYTES) console.warn(`[oys] El progreso compactado ocupa ${tam(r)} bytes: supera el límite de ${LIMITE_BYTES}.`);
  return r;
}

export function bytes(pc: ProgresoC) {
  return new TextEncoder().encode(JSON.stringify(pc)).length;
}
