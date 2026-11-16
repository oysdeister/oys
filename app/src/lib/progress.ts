import { useSyncExternalStore } from 'react';
import { sync } from './sync';

export interface EstadoEjercicio {
  /** Pasos guiados completados (índice global del paso dentro del ejercicio) */
  pasos: number[];
  guiado: boolean;
  /** Mejor nota del test, 0-1 */
  test: number | null;
  /** Índices marcados de la checklist de la demo real */
  demo: number[];
}

export interface Progreso {
  version: 1;
  alumno: { id: string; nombre: string; ini: string };
  ejercicios: Record<string, EstadoEjercicio>;
  sims: Record<string, boolean>;
  creado: string;
  actualizado: string;
}

const CLAVE = 'oys-taller-progreso';
export const APROBADO = 0.8;

function vacio(): Progreso {
  const ahora = new Date().toISOString();
  return { version: 1, alumno: { id: '', nombre: '', ini: '' }, ejercicios: {}, sims: {}, creado: ahora, actualizado: ahora };
}

function leer(): Progreso {
  try {
    const raw = localStorage.getItem(CLAVE);
    if (!raw) return vacio();
    const p = JSON.parse(raw) as Progreso;
    return { ...vacio(), ...p, alumno: { ...vacio().alumno, ...p.alumno } };
  } catch {
    return vacio();
  }
}

let estado: Progreso = leer();
const oyentes = new Set<() => void>();

function guardar(p: Progreso) {
  estado = { ...p, actualizado: new Date().toISOString() };
  try {
    localStorage.setItem(CLAVE, JSON.stringify(estado));
  } catch {
    /* almacenamiento bloqueado: el progreso dura lo que dure la pestaña */
  }
  oyentes.forEach((f) => f());
  if (estado.alumno.id) void sync.subir(estado);
}

export function useProgreso(): Progreso {
  return useSyncExternalStore(
    (f) => {
      oyentes.add(f);
      return () => oyentes.delete(f);
    },
    () => estado,
  );
}

export function getProgreso() {
  return estado;
}

export function ejercicioVacio(): EstadoEjercicio {
  return { pasos: [], guiado: false, test: null, demo: [] };
}

function conEjercicio(id: string, cambio: (e: EstadoEjercicio) => EstadoEjercicio) {
  const actual = estado.ejercicios[id] ?? ejercicioVacio();
  guardar({ ...estado, ejercicios: { ...estado.ejercicios, [id]: cambio(actual) } });
}

export const acciones = {
  setAlumno(nombre: string, ini: string) {
    const limpio = ini.trim().toUpperCase().replace(/[^A-ZÑ0-9]/g, '').slice(0, 4);
    const id = `${limpio}-${nombre.trim().toLowerCase().replace(/\s+/g, '-')}`;
    guardar({ ...estado, alumno: { id, nombre: nombre.trim(), ini: limpio } });
  },
  marcarPaso(ej: string, idx: number) {
    conEjercicio(ej, (e) => (e.pasos.includes(idx) ? e : { ...e, pasos: [...e.pasos, idx] }));
  },
  terminarGuiado(ej: string) {
    conEjercicio(ej, (e) => ({ ...e, guiado: true }));
  },
  notaTest(ej: string, nota: number) {
    conEjercicio(ej, (e) => ({ ...e, test: Math.max(e.test ?? 0, nota) }));
  },
  toggleDemo(ej: string, idx: number) {
    conEjercicio(ej, (e) => ({ ...e, demo: e.demo.includes(idx) ? e.demo.filter((i) => i !== idx) : [...e.demo, idx] }));
  },
  simSuperado(id: string) {
    if (estado.sims[id]) return;
    guardar({ ...estado, sims: { ...estado.sims, [id]: true } });
  },
  reiniciar() {
    const alumno = estado.alumno;
    guardar({ ...vacio(), alumno });
  },
  exportar(): string {
    return JSON.stringify(estado, null, 2);
  },
  importar(texto: string): boolean {
    try {
      const p = JSON.parse(texto) as Progreso;
      if (p.version !== 1 || typeof p.ejercicios !== 'object') return false;
      guardar(p);
      return true;
    } catch {
      return false;
    }
  },
};

export function ejercicioCompletado(e?: EstadoEjercicio) {
  return !!e && e.guiado && (e.test ?? 0) >= APROBADO;
}

/** Fracción 0-1 de avance de un ejercicio: guiado 40 %, test 40 %, demo real 20 % */
export function avanceEjercicio(e: EstadoEjercicio | undefined, nChecklist: number) {
  if (!e) return 0;
  const g = e.guiado ? 0.4 : 0;
  const t = (e.test ?? 0) >= APROBADO ? 0.4 : 0;
  const d = nChecklist ? 0.2 * Math.min(1, e.demo.length / nChecklist) : 0.2;
  return g + t + d;
}
