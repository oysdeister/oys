import type { Progreso } from './progress';

/**
 * Punto de conexión con un backend para que O&S pueda seguir el avance de cada persona.
 *
 * En esta versión no hay servidor: el progreso vive en el navegador (localStorage).
 * Para conectarlo, define VITE_SYNC_URL al compilar y sustituye `crearSync` por la
 * implementación que toque. Ejemplo con Supabase (tabla `progreso` con columnas
 * `alumno text primary key`, `datos jsonb`, `actualizado timestamptz`):
 *
 *   import { createClient } from '@supabase/supabase-js';
 *   const sb = createClient(import.meta.env.VITE_SUPABASE_URL, import.meta.env.VITE_SUPABASE_ANON_KEY);
 *   export const sync: ProgresoSync = {
 *     activo: true,
 *     async subir(p) {
 *       await sb.from('progreso').upsert({ alumno: p.alumno.id, datos: p, actualizado: new Date().toISOString() });
 *     },
 *     async bajar(id) {
 *       const { data } = await sb.from('progreso').select('datos').eq('alumno', id).maybeSingle();
 *       return (data?.datos as Progreso) ?? null;
 *     },
 *   };
 */
export interface ProgresoSync {
  activo: boolean;
  subir(p: Progreso): Promise<void>;
  bajar(alumnoId: string): Promise<Progreso | null>;
}

const URL_SYNC = import.meta.env.VITE_SYNC_URL as string | undefined;

/** Implementación genérica: POST/GET JSON a VITE_SYNC_URL/<alumno>. Sin URL, no hace nada. */
export const sync: ProgresoSync = URL_SYNC
  ? {
      activo: true,
      async subir(p) {
        try {
          await fetch(`${URL_SYNC}/${encodeURIComponent(p.alumno.id)}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(p),
          });
        } catch {
          /* sin conexión: se reintenta en el siguiente guardado */
        }
      },
      async bajar(id) {
        try {
          const r = await fetch(`${URL_SYNC}/${encodeURIComponent(id)}`);
          return r.ok ? ((await r.json()) as Progreso) : null;
        } catch {
          return null;
        }
      },
    }
  : {
      activo: false,
      async subir() {},
      async bajar() {
        return null;
      },
    };
