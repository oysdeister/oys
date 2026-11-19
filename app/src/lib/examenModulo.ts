/**
 * Examen de test al final de cada módulo.
 *
 * - Banco de preguntas por módulo en `src/content/examenes/<clave>.json` (mismo formato que `Pregunta`).
 *   Está en una subcarpeta para que `content/index.ts` no lo tome por un módulo.
 * - Las preguntas no se repiten entre módulos ni con los tests de los ejercicios.
 * - La mejor nota se guarda en el progreso (`progress.ts`, campo `examenes`) y viaja a la cuenta
 *   compactada (`auth/compacto.ts`, campo `xm`).
 * - Un id de módulo fusionado (ALIAS_MODULO) lleva al examen del módulo vigente.
 */
import type { Pregunta } from '../types';
import { MODULOS, idModulo } from '../content';
import { APROBADO, type Progreso } from './progress';

const ficheros = import.meta.glob<{ default: Pregunta[] }>('../content/examenes/*.json', { eager: true });

export const BANCOS: Record<string, Pregunta[]> = Object.fromEntries(
  Object.entries(ficheros).map(([ruta, m]) => [ruta.replace(/^.*\/([^/]+)\.json$/, '$1'), m.default]),
);

/** Clave del banco de examen de un módulo, o null si no tiene */
export function claveExamen(moduloId: string): string | null {
  // Los ids de módulos fusionados (ALIAS_MODULO) llevan al examen del módulo vigente
  const id = idModulo(moduloId);
  return BANCOS[id] ? id : null;
}

/** Preguntas por intento como máximo (los bancos de módulos fusionados son más grandes) */
export const MAX_PREG = 20;

export function preguntasDe(moduloId: string): Pregunta[] {
  const c = claveExamen(moduloId);
  return c ? BANCOS[c] : [];
}

/** Claves de examen de los módulos que hay ahora en la web (sin repetir) */
export function clavesActivas(): { clave: string; moduloId: string }[] {
  const vistas = new Set<string>();
  const out: { clave: string; moduloId: string }[] = [];
  for (const m of MODULOS) {
    const c = claveExamen(m.id);
    if (c && !vistas.has(c)) {
      vistas.add(c);
      out.push({ clave: c, moduloId: m.id });
    }
  }
  return out;
}

export function notaExamen(p: Progreso, moduloId: string): number | null {
  const c = claveExamen(moduloId);
  return c ? (p.examenes?.[c] ?? null) : null;
}

export function examenAprobado(p: Progreso, moduloId: string) {
  return (notaExamen(p, moduloId) ?? 0) >= APROBADO;
}
