import { useEffect, useState } from 'react';
import type { Ejercicio, Paso, Seccion } from '../../types';
import { avanceEjercicio, ejercicioCompletado, type EstadoEjercicio } from '../../lib/progress';

/** Colores de marca para el confeti */
export const COLORES_MARCA = ['#4fbfa5', '#2a9c83', '#1f2738', '#f2a93b', '#dff3ee'];

/** Baraja una copia (Fisher-Yates) */
export function barajar<T>(arr: readonly T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

/** Baraja garantizando que el orden cambia (si hay más de un elemento) */
export function barajarDistinto<T>(arr: readonly T[]): T[] {
  if (arr.length < 2) return [...arr];
  for (let n = 0; n < 12; n++) {
    const b = barajar(arr);
    if (b.some((x, i) => x !== arr[i])) return b;
  }
  return [...arr].reverse();
}

export interface PasoPlano {
  paso: Paso;
  seccion: Seccion;
  secIdx: number;
  /** Índice global del paso dentro del ejercicio (el que guarda el progreso) */
  idx: number;
  /** Posición dentro de su sección */
  local: number;
}

export function pasosPlanos(ej: Ejercicio): PasoPlano[] {
  const out: PasoPlano[] = [];
  ej.secciones.forEach((seccion, secIdx) => {
    seccion.pasos.forEach((paso, local) => out.push({ paso, seccion, secIdx, idx: out.length, local }));
  });
  return out;
}

/** ¿Cae el punto (en %) dentro del hotspot? Con un pequeño margen para el dedo. */
export function dentro(h: { x: number; y: number; w: number; h: number }, px: number, py: number, margen = 1.5) {
  return px >= h.x - margen && px <= h.x + h.w + margen && py >= h.y - margen && py <= h.y + h.h + margen;
}

export function useMedia(query: string) {
  const [ok, setOk] = useState(() => (typeof window !== 'undefined' && window.matchMedia ? window.matchMedia(query).matches : false));
  useEffect(() => {
    if (!window.matchMedia) return;
    const mq = window.matchMedia(query);
    const f = () => setOk(mq.matches);
    f();
    mq.addEventListener('change', f);
    return () => mq.removeEventListener('change', f);
  }, [query]);
  return ok;
}

export type EstadoChip = { clase: string; texto: string };

export function estadoDe(e: EstadoEjercicio | undefined, nChecklist: number): EstadoChip {
  if (ejercicioCompletado(e)) return { clase: 'chip ok', texto: 'Completado' };
  if (avanceEjercicio(e, nChecklist) > 0 || (e?.pasos.length ?? 0) > 0) return { clase: 'chip warn', texto: 'En curso' };
  return { clase: 'chip', texto: 'Sin empezar' };
}

export const pct = (f: number) => `${Math.round(f * 100)} %`;

/** Párrafos de un texto con saltos de línea dobles */
export function parrafos(t: string) {
  return t.split(/\n{2,}|\n/).map((s) => s.trim()).filter(Boolean);
}
