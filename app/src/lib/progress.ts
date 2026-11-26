import { useSyncExternalStore } from 'react';
import { avisarCambio } from './sync';

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
  alumno: { id: string; nombre: string; ini: string; usuario: string };
  ejercicios: Record<string, EstadoEjercicio>;
  sims: Record<string, boolean>;
  /** Mejor nota (0-1) del examen de cada módulo, por clave de examen (lib/examenModulo.ts) */
  examenes?: Record<string, number>;
  creado: string;
  actualizado: string;
}

const CLAVE = 'oys-taller-progreso';
export const APROBADO = 0.8;

function vacio(): Progreso {
  const ahora = new Date().toISOString();
  return { version: 1, alumno: { id: '', nombre: '', ini: '', usuario: '' }, ejercicios: {}, sims: {}, creado: ahora, actualizado: ahora };
}

/*
 * Migración (11-2026): «compras-workflow» se partió en dos bloques sin cambiar ids de sección.
 * Sus 6 primeras partes (22 pasos) pasaron a «compras-workflow-config» y cambiaron de orden
 * (menu, rol, circuito, validacion, grupo, tipologia; el último paso de «circuito» pasó a «grupo»).
 * Las 3 últimas (23 pasos) se quedan en «compras-workflow», desde el índice 0.
 * Idempotente: solo actúa si existe el bloque viejo y aún no existe el nuevo (que se crea siempre, aunque quede vacío).
 */
const WF = 'compras-workflow';
const WF_CONFIG = 'compras-workflow-config';
/** Paso viejo (índice global en compras-workflow) → [bloque, paso nuevo] */
const PASOS_WF: [string, number][] = [
  ...[0, 1, 2, 11, 12, 13, 14, 15, 16, 17, 3, 4, 5, 6, 7, 8, 9, 10, 18, 19, 20, 21].map((n): [string, number] => [WF_CONFIG, n]),
  ...Array.from({ length: 23 }, (_, i): [string, number] => [WF, i]),
];
/** Punto viejo de la checklist → [bloque, punto nuevo] */
const DEMO_WF: [string, number][] = [[WF_CONFIG, 2], [WF_CONFIG, 3], [WF_CONFIG, 0], [WF_CONFIG, 1], [WF_CONFIG, 4], [WF_CONFIG, 5], [WF, 0], [WF, 3], [WF, 5]];

/** Reparte el progreso viejo de un bloque partido. Devuelve el mismo objeto si no hay nada que migrar. */
export function migrarEjercicios(ej: Record<string, EstadoEjercicio>): Record<string, EstadoEjercicio> {
  const viejo = ej[WF];
  if (!viejo || ej[WF_CONFIG]) return ej;
  // El test viejo cubría sobre todo la configuración: la nota vale para los dos bloques
  const nuevo: Record<string, EstadoEjercicio> = {
    [WF_CONFIG]: { pasos: [], guiado: viejo.guiado, test: viejo.test, demo: [] },
    [WF]: { pasos: [], guiado: viejo.guiado, test: viejo.test, demo: [] },
  };
  for (const i of viejo.pasos ?? []) {
    const d = PASOS_WF[i];
    if (d && !nuevo[d[0]].pasos.includes(d[1])) nuevo[d[0]].pasos.push(d[1]);
  }
  for (const i of viejo.demo ?? []) {
    const d = DEMO_WF[i];
    if (d && !nuevo[d[0]].demo.includes(d[1])) nuevo[d[0]].demo.push(d[1]);
  }
  return { ...ej, ...nuevo };
}

function leer(): Progreso {
  try {
    const raw = localStorage.getItem(CLAVE);
    if (!raw) return vacio();
    const p = JSON.parse(raw) as Progreso;
    const ejercicios = migrarEjercicios(p.ejercicios ?? {});
    const leido = { ...vacio(), ...p, ejercicios, alumno: { ...vacio().alumno, ...p.alumno } };
    if (ejercicios !== p.ejercicios) {
      // Se deja ya migrado en el navegador, para que la sincronización con la cuenta no suba el reparto viejo
      try {
        localStorage.setItem(CLAVE, JSON.stringify(leido));
      } catch {
        /* almacenamiento bloqueado */
      }
    }
    return leido;
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
  avisarCambio();
}

/** Vuelve a leer localStorage (tras fusionar con el progreso de la cuenta) y repinta. */
export function recargarProgreso() {
  estado = leer();
  oyentes.forEach((f) => f());
}

export const CLAVE_PROGRESO = CLAVE;

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
  // Si alguien empieza «compras-workflow» (formato nuevo) sin tener aún «compras-workflow-config»,
  // se crea este vacío: si no, la próxima lectura tomaría su progreso por el formato viejo y lo migraría mal.
  const marca: Record<string, EstadoEjercicio> = id === WF && !estado.ejercicios[WF_CONFIG] ? { [WF_CONFIG]: ejercicioVacio() } : {};
  guardar({ ...estado, ejercicios: { ...estado.ejercicios, ...marca, [id]: cambio(actual) } });
}

/** Nombre de usuario: minúsculas sin acentos, letras, cifras, punto y guion. */
export function limpiaUsuario(s: string) {
  return s
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/\s+/g, '.')
    .replace(/[^a-z0-9.-]/g, '')
    .slice(0, 30);
}

export const acciones = {
  setAlumno(nombre: string, ini: string, usuario: string) {
    const limpio = ini.trim().toUpperCase().replace(/[^A-ZÑ0-9]/g, '').slice(0, 4);
    const id = `${limpio}-${nombre.trim().toLowerCase().replace(/\s+/g, '-')}`;
    guardar({ ...estado, alumno: { id, nombre: nombre.trim(), ini: limpio, usuario: limpiaUsuario(usuario) } });
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
  notaExamenModulo(clave: string, nota: number) {
    const previa = estado.examenes?.[clave] ?? 0;
    if (nota <= previa && estado.examenes?.[clave] !== undefined) return;
    guardar({ ...estado, examenes: { ...estado.examenes, [clave]: Math.max(previa, nota) } });
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
      guardar({ ...p, ejercicios: migrarEjercicios(p.ejercicios) });
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
