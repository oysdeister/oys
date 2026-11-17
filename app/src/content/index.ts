import type { Ejercicio, Modulo } from '../types';

// Cada manual convertido vive en src/content/<slug>.json (mismo esquema, ver types.ts)
const ficheros = import.meta.glob<{ default: Modulo }>('./*.json', { eager: true });

/**
 * Orden pedagógico: maestros → parametrización → compras → ventas → asientos → carteras,
 * y después los módulos de finanzas sacados de la documentación oficial (ids icon-*).
 * icon-tesoreria.json existe pero va FUERA de ORDEN: sus ejercicios se fusionarán en tesoreria.json.
 */
export const ORDEN = ['maestros', 'parametrizacion', 'compras', 'ventas', 'asientos', 'carteras', 'icon-contabilidad', 'icon-cartera', 'icon-impuestos', 'icon-activos'] as const;

/** Módulos de finanzas (documentación oficial de Finanzas) */
export const esFinanzas = (id: string) => id.startsWith('icon-');

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
  'icon-contabilidad': { color: '#5b6fd8', icono: 'libro', corto: 'Contabilidad' },
  'icon-cartera': { color: '#2fae8f', icono: 'cobros', corto: 'Cobros y pagos' },
  'icon-impuestos': { color: '#d9824b', icono: 'impuestos', corto: 'Impuestos' },
  'icon-activos': { color: '#b06fc4', icono: 'activos', corto: 'Activos fijos' },
};
