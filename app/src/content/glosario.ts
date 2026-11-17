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
}

export interface Termino {
  /** clave estable (sin tildes ni mayúsculas), sirve de ancla: /glosario#<clave> */
  clave: string;
  termino: string;
  definicion: string;
  ejemplo?: string;
  /** módulos donde aparece (el primero manda) */
  modulos: string[];
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
      const previo = porClave.get(clave);
      if (previo) {
        if (!previo.modulos.includes(id)) previo.modulos.push(id);
        if (!previo.ejemplo && e.ejemplo) previo.ejemplo = e.ejemplo.trim();
        continue;
      }
      porClave.set(clave, { clave, termino, definicion, ejemplo: e.ejemplo?.trim() || undefined, modulos: [id] });
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
 * Patrón único para todos los términos: el más largo primero, sin distinguir mayúsculas, con
 * plural simple (s / es) y sin cortar palabras (límites Unicode).
 * Los términos de 1–2 letras no se resaltan: darían falsos positivos.
 */
const PATRON: RegExp | null = (() => {
  const formas = GLOSARIO.filter((t) => t.termino.length >= 3)
    .map((t) => t.termino)
    .sort((a, b) => b.length - a.length)
    .map((t) => `${escapa(t)}(?:es|s)?`);
  if (!formas.length) return null;
  // Sin lookbehind (Safari < 16.4): el carácter previo va en el grupo 1 y el término en el 2
  return new RegExp(`(^|[^\\p{L}\\p{N}])(${formas.join('|')})(?![\\p{L}\\p{N}])`, 'giu');
})();

/** Busca el término al que corresponde un trozo de texto encontrado por el patrón */
function resolver(trozo: string): Termino | undefined {
  const c = claveDe(trozo);
  return PORCLAVE.get(c) ?? PORCLAVE.get(c.replace(/-?es$/, '')) ?? PORCLAVE.get(c.replace(/-?s$/, ''));
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
