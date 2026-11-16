import type { Ejercicio, Modulo } from '../types';

// Cada manual convertido vive en src/content/<slug>.json (mismo esquema, ver types.ts)
const ficheros = import.meta.glob<{ default: Modulo }>('./*.json', { eager: true });

/** Orden pedagógico: maestros → parametrización → compras → ventas → asientos → carteras */
export const ORDEN = ['maestros', 'parametrizacion', 'compras', 'ventas', 'asientos', 'carteras'] as const;

export const MODULOS: Modulo[] = ORDEN.map((id) => ficheros[`./${id}.json`]?.default).filter(Boolean) as Modulo[];

export function getModulo(id: string) {
  return MODULOS.find((m) => m.id === id);
}

export function getEjercicio(id: string): { modulo: Modulo; ejercicio: Ejercicio } | undefined {
  for (const modulo of MODULOS) {
    const ejercicio = modulo.ejercicios.find((e) => e.id === id);
    if (ejercicio) return { modulo, ejercicio };
  }
  return undefined;
}

export function todosEjercicios() {
  return MODULOS.flatMap((m) => m.ejercicios.map((e) => ({ modulo: m, ejercicio: e })));
}

/** Ruta pública de una captura: public/img/<slug>/<fichero> */
export function imgSrc(modulo: string, fichero: string) {
  return `${import.meta.env.BASE_URL}img/${modulo}/${fichero}`;
}

/** Metadatos visuales por módulo */
export const META: Record<string, { color: string; icono: string; corto: string }> = {
  maestros: { color: '#4fbfa5', icono: 'maestros', corto: 'Maestros' },
  parametrizacion: { color: '#6c8fd6', icono: 'engranaje', corto: 'Parametrización' },
  compras: { color: '#f2a93b', icono: 'compras', corto: 'Compras' },
  ventas: { color: '#e0708a', icono: 'ventas', corto: 'Ventas' },
  asientos: { color: '#8a7be0', icono: 'asiento', corto: 'Asientos' },
  carteras: { color: '#3fa7c9', icono: 'cartera', corto: 'Carteras' },
};
