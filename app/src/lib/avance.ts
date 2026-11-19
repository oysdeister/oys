import { MODULOS } from '../content';
import { avanceEjercicio, type Progreso } from './progress';
import { bloquesObligatorios } from './ruta';

/** Avance de un módulo: media de sus bloques obligatorios (la ampliación no cuenta) */
export function avanceModulo(p: Progreso, id: string) {
  const m = MODULOS.find((x) => x.id === id);
  if (!m) return 0;
  const bloques = bloquesObligatorios(m);
  if (!bloques.length) return 0;
  return bloques.reduce((s, e) => s + avanceEjercicio(p.ejercicios[e.id], e.checklist.length), 0) / bloques.length;
}

export function avanceGlobal(p: Progreso) {
  if (!MODULOS.length) return 0;
  return MODULOS.reduce((s, m) => s + avanceModulo(p, m.id), 0) / MODULOS.length;
}
