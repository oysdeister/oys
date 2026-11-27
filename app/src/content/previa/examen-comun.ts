/*
  Piezas comunes de los dos exámenes de la formación previa (contabilidad y ERP).
  Misma lógica que los exámenes HTML originales: utilidades, tipos y sorteo de preguntas.
*/

export interface PreguntaPrevia {
  b: string; // bloque
  q: string; // enunciado
  o: string[]; // 4 opciones
  a: number; // índice de la correcta en o
  e: string; // explicación
}

export interface CampoEjercicio {
  l: string; // etiqueta
  v: number | string; // valor correcto (número, o clave en los de elegir)
  tol?: number; // tolerancia
  d?: number; // decimales al mostrar
}

export interface EjercicioPrevio {
  b: string;
  t: string;
  txt: string;
  datos?: string[];
  f: CampoEjercicio[];
  kind?: 'sel';
  exp: string | null;
}

export interface DefExamenPrevio {
  slug: 'contabilidad' | 'erp';
  h1: string;
  lead: string;
  bloques: Record<string, string>;
  bank: PreguntaPrevia[];
  clasifOpt: [string, string][];
  clasifExp: Record<string, string>;
  /** texto de la revisión del ejercicio de clasificar */
  ayudaClasif: string;
  genExercises: () => EjercicioPrevio[];
  prefijoCodigo: string;
  cert: { curso: string; contenidos: [string, string]; fichero: string };
}

/* ---------- utilidades (idénticas al original) ---------- */
export const rnd = (a: number, b: number) => a + Math.floor(Math.random() * (b - a + 1));
export const pick = <T,>(arr: T[]): T => arr[Math.floor(Math.random() * arr.length)];
export function shuffle<T>(a: T[]): T[] {
  a = a.slice();
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    const t = a[i];
    a[i] = a[j];
    a[j] = t;
  }
  return a;
}
export function fmt(n: number, d?: number) {
  d = d || 0;
  return n.toLocaleString('es-ES', { minimumFractionDigits: d, maximumFractionDigits: d, useGrouping: 'always' });
}
export function eur(n: number, d?: number) {
  return fmt(n, d) + ' €';
}
export function parseNum(s: string | null | undefined): number {
  if (s == null) return NaN;
  s = String(s).trim().replace(/\s|€/g, '');
  if (!s) return NaN;
  if (s.indexOf(',') >= 0) {
    s = s.replace(/\./g, '').replace(',', '.');
  } else if (/^-?\d{1,3}(\.\d{3})+$/.test(s)) {
    s = s.replace(/\./g, '');
  }
  return Number(s);
}

/* ---------- sorteo: 3 por bloque y el resto al azar hasta 25; opciones barajadas ---------- */
export interface PreguntaSorteada {
  i: number; // índice en el banco
  ord: number[]; // orden de las opciones
  ans: number | null;
}
export const N_PREGUNTAS = 25;

export function drawQuestions(bank: PreguntaPrevia[]): PreguntaSorteada[] {
  const byB: Record<string, number[]> = {};
  bank.forEach((q, i) => {
    (byB[q.b] = byB[q.b] || []).push(i);
  });
  let chosen: number[] = [];
  Object.keys(byB).forEach((k) => {
    chosen = chosen.concat(shuffle(byB[k]).slice(0, 3));
  });
  const rest = shuffle(bank.map((_, i) => i).filter((i) => chosen.indexOf(i) < 0));
  chosen = chosen.concat(rest.slice(0, N_PREGUNTAS - chosen.length));
  return shuffle(chosen).map((i) => ({ i, ord: shuffle([0, 1, 2, 3]), ans: null }));
}

/** Código del certificado: PREFIJO-XXXXXXX (hash de nombre, apellidos y hora) */
export function codigoCert(prefijo: string, nom: string, ape: string) {
  const s = (nom + ape + Date.now()).toUpperCase();
  let h = 0;
  for (let i = 0; i < s.length; i++) h = (h * 31 + s.charCodeAt(i)) >>> 0;
  return prefijo + '-' + h.toString(36).toUpperCase().padStart(7, '0').slice(-7);
}
