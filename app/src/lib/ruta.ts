/**
 * El recorrido del curso (UX v5): módulo → etapas → bloques → 6 pasos.
 * Todo lo que decide «qué toca ahora» vive aquí, para que portada, barra lateral,
 * página de módulo y bloque digan siempre lo mismo.
 */
import type { Ejercicio, Modulo } from '../types';
import { MODULOS } from '../content';
import { ETAPAS } from '../content/etapas';
import { APROBADO, ejercicioCompletado, type EstadoEjercicio, type Progreso } from './progress';
import { PRACTICAS_POR_EJERCICIO } from '../erp/practicas';

/** Los pasos de un bloque, siempre en este orden */
export const PASOS = [
  { id: 'concepto', label: 'Concepto', que: 'Lees la idea y ves las pantallas.' },
  { id: 'guiado', label: 'Guiado', que: 'Haces clic donde toca, paso a paso.' },
  { id: 'memoria', label: 'De memoria', que: 'Repites sin ayuda.' },
  { id: 'test', label: 'Test', que: 'Compruebas que lo has entendido.' },
  { id: 'erp', label: 'Práctica', que: 'Lo haces en el ERP de práctica de esta web.' },
  { id: 'demo', label: 'Demo real', que: 'Lo haces en el ERP de verdad.' },
] as const;
export type PasoId = (typeof PASOS)[number]['id'];

/** Pasos que tiene un bloque (la práctica solo si hay una preparada) */
export function pasosDe(ej: Ejercicio) {
  const conErp = (PRACTICAS_POR_EJERCICIO[ej.id] ?? []).length > 0;
  const pasos = ej.secciones.flatMap((s) => s.pasos);
  // «De memoria» necesita pantallas con clic marcado o alguna parte con 4 pasos o más para ordenar
  const conMemoria = pasos.some((p) => p.hotspot && p.imagen) || ej.secciones.some((s) => s.pasos.length >= 4);
  const conDemo = ej.checklist.length > 0;
  return PASOS.filter((p) => (p.id !== 'erp' || conErp) && (p.id !== 'memoria' || conMemoria) && (p.id !== 'demo' || conDemo));
}

export interface Etapa {
  titulo: string;
  que: string;
  bloques: Ejercicio[];
  opcional?: boolean;
}

/** Etapas del módulo con sus bloques en orden. Sin definición: una sola etapa con todos. */
export function etapasDe(m: Modulo): Etapa[] {
  const def = ETAPAS[m.id];
  const porId = new Map(m.ejercicios.map((e) => [e.id, e]));
  if (!def) return [{ titulo: '', que: '', bloques: m.ejercicios }];
  const usados = new Set<string>();
  const etapas: Etapa[] = def.map((d) => ({
    titulo: d.titulo,
    que: d.que,
    opcional: d.opcional,
    bloques: d.bloques.map((id) => porId.get(id)).filter((e): e is Ejercicio => {
      if (!e) return false;
      usados.add(e.id);
      return true;
    }),
  }));
  // Lo que no esté en ninguna etapa no se pierde: va al final
  const resto = m.ejercicios.filter((e) => !usados.has(e.id));
  if (resto.length) etapas.push({ titulo: 'Más bloques', que: '', bloques: resto });
  return etapas.filter((e) => e.bloques.length);
}

/** Bloques del módulo en el orden del recorrido */
export function bloquesDe(m: Modulo) {
  return etapasDe(m).flatMap((e) => e.bloques);
}

/** Bloques obligatorios del módulo (sin las etapas de ampliación), en orden */
export function bloquesObligatorios(m: Modulo) {
  return etapasDe(m).filter((e) => !e.opcional).flatMap((e) => e.bloques);
}

/** ¿Es un bloque de ampliación? */
export function esOpcional(m: Modulo, id: string) {
  return etapasDe(m).some((e) => e.opcional && e.bloques.some((b) => b.id === id));
}

/** Número del bloque dentro de su módulo (1…n), según el recorrido */
export function numeroBloque(m: Modulo, id: string) {
  return bloquesDe(m).findIndex((e) => e.id === id) + 1;
}

/** Todos los bloques del curso en orden */
export function todosBloques() {
  return MODULOS.flatMap((m) => bloquesDe(m).map((ejercicio) => ({ modulo: m, ejercicio })));
}

/* ---------- Todo abierto por defecto (decisión de Sergi). ?libre=0 activa el modo guiado con cierres; ?libre=1 lo quita ---------- */
const CLAVE_LIBRE = 'oys-libre';
export function modoLibre() {
  try {
    return localStorage.getItem(CLAVE_LIBRE) !== '0';
  } catch {
    return true;
  }
}
export function fijarModoLibre(si: boolean) {
  try {
    if (si) localStorage.removeItem(CLAVE_LIBRE);
    else localStorage.setItem(CLAVE_LIBRE, '0');
  } catch {
    /* sin almacenamiento */
  }
}

function empezado(e?: EstadoEjercicio) {
  return !!e && (e.pasos.length > 0 || e.guiado || e.test !== null || e.demo.length > 0);
}

/**
 * Un bloque se abre cuando el anterior del mismo módulo está hecho (guiado + test aprobado).
 * El primero siempre está abierto, y uno ya empezado no se vuelve a cerrar.
 */
export function bloqueAbierto(p: Progreso, m: Modulo, id: string) {
  if (modoLibre()) return true;
  if (empezado(p.ejercicios[id])) return true;
  const lista = bloquesObligatorios(m);
  // La ampliación se abre al terminar los obligatorios
  if (esOpcional(m, id)) return lista.every((e) => ejercicioCompletado(p.ejercicios[e.id]));
  const k = lista.findIndex((e) => e.id === id);
  if (k <= 0) return true;
  return ejercicioCompletado(p.ejercicios[lista[k - 1].id]);
}

/** Bloque que toca ahora en el módulo (el primero sin terminar), o undefined si está todo hecho */
export function bloqueQueToca(p: Progreso, m: Modulo) {
  return bloquesObligatorios(m).find((e) => !ejercicioCompletado(p.ejercicios[e.id]));
}

/** Qué pasos están hechos en un bloque */
export function pasosHechos(p: Progreso, ej: Ejercicio, notasErp: Record<string, { nota: number } | undefined>): Record<PasoId, boolean> {
  const e = p.ejercicios[ej.id];
  const practicas = PRACTICAS_POR_EJERCICIO[ej.id] ?? [];
  return {
    concepto: empezado(e),
    guiado: !!e?.guiado,
    memoria: !!e?.guiado && (e?.test ?? null) !== null,
    test: (e?.test ?? 0) >= APROBADO,
    erp: practicas.length > 0 && practicas.every((x) => (notasErp[x]?.nota ?? 0) >= 1),
    demo: ej.checklist.length > 0 && (e?.demo.length ?? 0) >= ej.checklist.length,
  };
}

/** Paso por el que seguir un bloque */
export function pasoQueToca(p: Progreso, ej: Ejercicio, notasErp: Record<string, { nota: number } | undefined>): PasoId {
  const h = pasosHechos(p, ej, notasErp);
  const lista = pasosDe(ej);
  if (!h.concepto) return 'concepto';
  return (lista.find((x) => x.id !== 'concepto' && !h[x.id])?.id ?? lista[lista.length - 1].id) as PasoId;
}
