import { ORDEN } from './index';

/**
 * Glosario: cada módulo puede traer src/content/glosario/<idModulo>.json con
 * [{ "termino": "...", "definicion": "...", "ejemplo": "..." }].
 * Funciona sin ningún fichero (glosario vacío) y con los que vayan llegando.
 */
interface EntradaJson {
  termino?: string;
  definicion?: string;
  ejemplo?: string;
  /** otras formas en que sale en el texto («Prorrata provisional y definitiva» → «Prorrata») */
  alias?: string[];
}

export interface Termino {
  /** clave estable (sin tildes ni mayúsculas), sirve de ancla: /glosario#<clave> */
  clave: string;
  termino: string;
  definicion: string;
  ejemplo?: string;
  /** módulos donde aparece (el primero manda) */
  modulos: string[];
  /** otras formas que también se resaltan */
  alias: string[];
}

const ficheros = import.meta.glob<{ default: unknown }>('./glosario/*.json', { eager: true });

export const normaliza = (s: string) =>
  s
    .toLowerCase()
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .trim();

export const claveDe = (s: string) =>
  normaliza(s)
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');

function cargar(): Termino[] {
  const porClave = new Map<string, Termino>();
  const rank = (id: string) => {
    const i = (ORDEN as readonly string[]).indexOf(id);
    return i < 0 ? 999 : i;
  };
  const entradas = Object.entries(ficheros)
    .map(([ruta, mod]) => ({ id: ruta.replace(/^.*\/([^/]+)\.json$/, '$1'), datos: mod.default }))
    .sort((a, b) => rank(a.id) - rank(b.id));
  for (const { id, datos } of entradas) {
    if (!Array.isArray(datos)) continue;
    for (const e of datos as EntradaJson[]) {
      const termino = typeof e?.termino === 'string' ? e.termino.trim() : '';
      const definicion = typeof e?.definicion === 'string' ? e.definicion.trim() : '';
      if (!termino || !definicion) continue;
      const clave = claveDe(termino);
      if (!clave) continue;
      const alias = Array.isArray(e.alias) ? e.alias.filter((a): a is string => typeof a === 'string' && !!a.trim()) : [];
      const previo = porClave.get(clave);
      if (previo) {
        for (const a of alias) if (!previo.alias.includes(a)) previo.alias.push(a);
        if (!previo.modulos.includes(id)) previo.modulos.push(id);
        if (!previo.ejemplo && e.ejemplo) previo.ejemplo = e.ejemplo.trim();
        continue;
      }
      porClave.set(clave, { clave, termino, definicion, ejemplo: e.ejemplo?.trim() || undefined, modulos: [id], alias });
    }
  }
  return [...porClave.values()].sort((a, b) => a.termino.localeCompare(b.termino, 'es', { sensitivity: 'base' }));
}

export const GLOSARIO: Termino[] = cargar();
const PORCLAVE = new Map(GLOSARIO.map((t) => [t.clave, t]));
export const terminoPorClave = (clave: string) => PORCLAVE.get(clave);

/** Módulos que tienen glosario, en el orden del curso */
export const MODULOS_GLOSARIO: string[] = (ORDEN as readonly string[]).filter((id) => GLOSARIO.some((t) => t.modulos.includes(id)));

const escapa = (s: string) => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

/**
 * Formas con las que un término puede salir en el texto: el término entero, el término sin el
 * paréntesis aclaratorio («Empresa (sociedad)» → «Empresa») y cada alternativa separada por « / »
 * («NIF / Id. fiscal» → «NIF», «Id. fiscal»). Las piezas que empiezan por «de» no van solas.
 */
function formasDe(termino: string): string[] {
  const out = new Set<string>([termino.trim()]);
  const sinParen = termino.replace(/\s*\([^)]*\)\s*/g, ' ').replace(/\s+/g, ' ').trim();
  if (sinParen) out.add(sinParen);
  for (const pieza of sinParen.split(/\s+\/\s+/)) {
    const p = pieza.trim();
    if (p && !/^de\s/i.test(p)) out.add(p);
  }
  return [...out].filter((f) => f.length >= 3);
}

/** Forma (por su clave) → término. Primero los nombres de los términos y después los alias, para que un alias no tape a otro término */
const ALIAS = new Map<string, Termino>();
const registra = (t: Termino, formas: string[]) => {
  for (const f of formas) {
    const c = claveDe(f);
    if (c && !ALIAS.has(c)) ALIAS.set(c, t);
  }
};
for (const t of GLOSARIO) registra(t, formasDe(t.termino));
for (const t of GLOSARIO) registra(t, t.alias.flatMap(formasDe));

/** Una forma con plural opcional en la primera y en la última palabra («pedido(s) de venta(s)») */
function patronDe(forma: string): string {
  const palabras = forma.split(' ');
  if (palabras.length === 1) return `${escapa(forma)}(?:es|s)?`;
  const [primera, ...resto] = palabras;
  return `${escapa(primera)}(?:es|s)? ${escapa(resto.join(' '))}(?:es|s)?`;
}

/**
 * Patrón único para todas las formas: la más larga primero, sin distinguir mayúsculas, con
 * plural simple (s / es) y sin cortar palabras (límites Unicode).
 * Las formas de 1–2 letras no se resaltan: darían falsos positivos.
 */
const PATRON: RegExp | null = (() => {
  const formas = [...new Set(GLOSARIO.flatMap((t) => [t.termino, ...t.alias].flatMap(formasDe)))]
    .sort((a, b) => b.length - a.length)
    .map(patronDe);
  if (!formas.length) return null;
  // Sin lookbehind (Safari < 16.4): el carácter previo va en el grupo 1 y el término en el 2
  return new RegExp(`(^|[^\\p{L}\\p{N}])(${formas.join('|')})(?![\\p{L}\\p{N}])`, 'giu');
})();

/** Busca el término al que corresponde un trozo de texto encontrado por el patrón (quita plurales) */
function resolver(trozo: string): Termino | undefined {
  const partes = claveDe(trozo).split('-');
  const sing = (w: string) => [w, w.replace(/es$/, ''), w.replace(/s$/, '')];
  const primeras = sing(partes[0]);
  const ultimas = partes.length > 1 ? sing(partes[partes.length - 1]) : [''];
  for (const a of primeras)
    for (const z of ultimas) {
      const c = partes.length > 1 ? [a, ...partes.slice(1, -1), z].join('-') : a;
      const t = ALIAS.get(c);
      if (t) return t;
    }
  return undefined;
}

export type Trozo = string | { texto: string; t: Termino };

/**
 * Parte un texto en trozos normales y trozos de glosario. Solo marca la primera aparición de cada
 * término en el texto (y omite las claves de `vistos`, que se rellenan) para no llenarlo de subrayados.
 */
export function trocear(texto: string, vistos?: Set<string>): Trozo[] {
  if (!PATRON || !texto) return [texto];
  const out: Trozo[] = [];
  const usados = vistos ?? new Set<string>();
  let ult = 0;
  PATRON.lastIndex = 0;
  for (let m = PATRON.exec(texto); m; m = PATRON.exec(texto)) {
    const ini = m.index + m[1].length;
    const t = resolver(m[2]);
    if (!t || usados.has(t.clave)) continue;
    usados.add(t.clave);
    if (ini > ult) out.push(texto.slice(ult, ini));
    out.push({ texto: m[2], t });
    ult = ini + m[2].length;
  }
  if (ult < texto.length) out.push(texto.slice(ult));
  return out;
}
