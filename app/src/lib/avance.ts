import { MODULOS } from '../content';
import { avanceEjercicio, type Progreso } from './progress';

export function avanceModulo(p: Progreso, id: string) {
  const m = MODULOS.find((x) => x.id === id);
  if (!m || !m.ejercicios.length) return 0;
  return m.ejercicios.reduce((s, e) => s + avanceEjercicio(p.ejercicios[e.id], e.checklist.length), 0) / m.ejercicios.length;
}

export function avanceGlobal(p: Progreso) {
  if (!MODULOS.length) return 0;
  return MODULOS.reduce((s, m) => s + avanceModulo(p, m.id), 0) / MODULOS.length;
}
