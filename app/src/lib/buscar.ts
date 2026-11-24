import { META, MODULOS } from '../content';
import { GLOSARIO } from '../content/glosario';

/** Tipo de resultado de la búsqueda global (⌘K) */
export type TipoBusqueda = 'bloque' | 'seccion' | 'problema' | 'glosario';

export interface Resultado {
  tipo: TipoBusqueda;
  /** ruta a la que lleva (con su query o ancla) */
  to: string;
  titulo: string;
  /** dónde está: «Compras · Pedir y recibir» (módulo y título del bloque) o «Glosario» */
  donde: string;
  /** módulo (para el color) */
  modulo: string;
  /** trozo de texto con la coincidencia */
  fragmento: string;
  puntos: number;
}

interface Entrada {
  tipo: TipoBusqueda;
  to: string;
  titulo: string;
  texto: string;
  donde: string;
  modulo: string;
  nTitulo: string;
  nTexto: string;
  /** definición (solo glosario): el fragmento arranca por su principio */
  def?: string;
}

export const TIPOS: Record<TipoBusqueda, string> = {
  bloque: 'Bloque',
  seccion: 'Sección',
  problema: 'Error',
  glosario: 'Glosario',
};

const BASE: Record<TipoBusqueda, number> = { bloque: 6, glosario: 4, seccion: 3, problema: 0 };

/** Sin tildes ni mayúsculas, carácter a carácter (así los índices coinciden con el texto original) */
export const sinTildes = (s: string) =>
  [...s].map((c) => c.toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '').charAt(0) || c).join('');

let INDICE: Entrada[] | null = null;

/** El índice se construye una sola vez, la primera vez que se busca */
function indice(): Entrada[] {
  if (INDICE) return INDICE;
  const out: Entrada[] = [];
  const add = (e: Omit<Entrada, 'nTitulo' | 'nTexto'>) => out.push({ ...e, nTitulo: sinTildes(e.titulo), nTexto: sinTildes(e.texto) });
  MODULOS.forEach((m) => {
    const nombre = META[m.id]?.corto ?? m.titulo;
    m.ejercicios.forEach((ej) => {
      const base = { modulo: m.id, donde: `${nombre} · ${ej.titulo}` };
      add({ modulo: m.id, donde: nombre, tipo: 'bloque', to: `/ejercicio/${ej.id}`, titulo: ej.titulo, texto: ej.objetivo ?? '' });
      for (const s of ej.secciones ?? []) {
        add({ ...base, tipo: 'seccion', to: `/ejercicio/${ej.id}?sec=${encodeURIComponent(s.id)}`, titulo: s.titulo, texto: [s.paraQueSirve, ...(s.explicacion ?? [])].filter(Boolean).join(' ') });
      }
      for (const p of ej.problemas ?? []) {
        add({ ...base, tipo: 'problema', to: `/ejercicio/${ej.id}?tab=problemas`, titulo: p.problema, texto: p.solucion });
      }
    });
  });
  for (const g of GLOSARIO) {
    add({
      tipo: 'glosario',
      to: `/glosario#${encodeURIComponent(g.clave)}`,
      titulo: g.termino,
      texto: [g.alias.join(' '), g.definicion].filter(Boolean).join(' '),
      donde: 'Glosario',
      modulo: g.modulos[0] ?? '',
      def: g.definicion,
    });
  }
  INDICE = out;
  return out;
}

/** Recorta «texto» entre ini y fin sin partir palabras, con «…» donde falte texto */
function recorte(texto: string, ini: number, fin: number): string {
  const t = texto.replace(/\s+/g, ' ');
  const n = t.length;
  let a = Math.max(0, ini);
  let b = Math.min(n, fin);
  // empieza en límite de palabra: si cae a media palabra, avanza hasta el siguiente espacio
  if (a > 0 && t[a - 1] !== ' ' && t[a] !== ' ') {
    const k = t.indexOf(' ', a);
    a = k < 0 ? n : k + 1;
  }
  // acaba en límite de palabra: si corta a media palabra, retrocede hasta el último espacio
  if (b < n && t[b] !== ' ' && t[b - 1] !== ' ') {
    const k = t.lastIndexOf(' ', b);
    b = k > a ? k : b;
  }
  let out = t.slice(a, b).trim();
  if (a > 0) out = `…${out}`;
  if (b < n) out = `${out}…`;
  return out;
}

/** Trozo de «texto» alrededor de la primera coincidencia de alguna palabra */
function fragmento(texto: string, nTexto: string, palabras: string[], largo = 110): string {
  if (nTexto.length !== texto.length) return recorte(texto, 0, largo);
  let pos = -1;
  for (const p of palabras) {
    const i = nTexto.indexOf(p);
    if (i >= 0 && (pos < 0 || i < pos)) pos = i;
  }
  if (pos < 0) return recorte(texto, 0, largo);
  // los espacios repetidos se juntan antes de contar: se calcula la posición sobre el texto ya limpio
  const antes = texto.slice(0, pos).replace(/\s+/g, ' ').length;
  const ini = Math.max(0, antes - 30);
  return recorte(texto, ini, ini + largo);
}

/**
 * Busca en bloques, secciones, errores y glosario. Todas las palabras tienen que salir
 * (en el título o en el texto); puntúa más el título, y más aún si la palabra lo empieza.
 */
export function buscar(consulta: string, max = 30): Resultado[] {
  const palabras = sinTildes(consulta).split(/[^a-z0-9ñ]+/).filter(Boolean);
  if (!palabras.length) return [];
  const res: Resultado[] = [];
  for (const e of indice()) {
    let puntos = BASE[e.tipo];
    let ok = true;
    for (const p of palabras) {
      const it = e.nTitulo.indexOf(p);
      if (it >= 0) {
        puntos += 10 + (it === 0 || e.nTitulo[it - 1] === ' ' ? 4 : 0);
      } else if (e.nTexto.includes(p)) {
        puntos += 2;
      } else {
        ok = false;
        break;
      }
    }
    if (!ok) continue;
    // el título entero igual a lo buscado va primero
    const lo = palabras.join(' ');
    if (e.nTitulo === lo) puntos += 40;
    else if (e.nTitulo.startsWith(lo)) puntos += 10; // «IVA repercutido» antes que «Cuentas de IVA»
    res.push({ tipo: e.tipo, to: e.to, titulo: e.titulo, donde: e.donde, modulo: e.modulo, fragmento: '', puntos });
  }
  // a igualdad de puntos, el título más corto (el concepto básico) va primero
  res.sort((a, b) => b.puntos - a.puntos || a.titulo.length - b.titulo.length);
  const top = res.slice(0, max);
  // el fragmento solo se calcula para los que se enseñan
  const porClave = new Map(indice().map((e) => [e.to + e.titulo, e]));
  for (const r of top) {
    const e = porClave.get(r.to + r.titulo);
    if (!e) continue;
    r.fragmento = e.def ? recorte(e.def, 0, 120) : fragmento(e.texto, e.nTexto, palabras);
  }
  return top;
}
