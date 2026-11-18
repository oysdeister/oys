import type { Ejercicio, Modulo } from '../types';

// Cada manual convertido vive en src/content/<slug>.json (mismo esquema, ver types.ts)
const ficheros = import.meta.glob<{ default: Modulo }>('./*.json', { eager: true });

/**
 * Orden pedagógico para un junior: primero los datos maestros y la parametrización; luego el circuito
 * comercial (compras → ventas); después la contabilidad (asientos → contabilidad general); la cartera y
 * el banco (cartera, cobros y pagos → tesorería) y, al final, impuestos y activos fijos.
 * Los ids icon-* son internos (vienen de la documentación oficial de Finanzas): el alumno nunca los ve.
 */
export const ORDEN = ['maestros', 'parametrizacion', 'compras', 'ventas', 'asientos', 'icon-contabilidad', 'carteras', 'tesoreria', 'icon-impuestos', 'icon-activos'] as const;

/** Módulos de finanzas (documentación oficial de Finanzas) */
export const esFinanzas = (id: string) => id.startsWith('icon-');

export const MODULOS: Modulo[] = ORDEN.map((id) => ficheros[`./${id}.json`]?.default).filter(Boolean) as Modulo[];

/**
 * Módulos antiguos que se fusionaron en otro: los enlaces #/modulo/<viejo> redirigen al nuevo.
 * «Cobros y pagos» (icon-cartera) se unió a «Cartera de efectos» (carteras) en «Cartera, cobros y pagos»;
 * los ids de ejercicio no cambian, así que el progreso guardado y los momentos de vídeo siguen enlazados.
 */
export const ALIAS_MODULO: Record<string, string> = { 'icon-cartera': 'carteras' };

/** Id vigente de un módulo (resuelve los alias de módulos fusionados) */
export const idModulo = (id: string) => ALIAS_MODULO[id] ?? id;

export function getModulo(id: string) {
  const real = idModulo(id);
  return MODULOS.find((m) => m.id === real);
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

/** Metadatos visuales por módulo; «corto» es el nombre que ve el alumno en menú, ruta y planetas */
export const META: Record<string, { color: string; icono: string; corto: string }> = {
  maestros: { color: '#4fbfa5', icono: 'maestros', corto: 'Datos maestros' },
  parametrizacion: { color: '#6c8fd6', icono: 'engranaje', corto: 'Parametrización' },
  compras: { color: '#f2a93b', icono: 'compras', corto: 'Compras' },
  ventas: { color: '#e0708a', icono: 'ventas', corto: 'Ventas' },
  asientos: { color: '#8a7be0', icono: 'asiento', corto: 'Asientos manuales' },
  carteras: { color: '#3fa7c9', icono: 'cartera', corto: 'Cartera, cobros y pagos' },
  tesoreria: { color: '#8bc34a', icono: 'banco', corto: 'Tesorería y bancos' },
  'icon-contabilidad': { color: '#5b6fd8', icono: 'libro', corto: 'Contabilidad general' },
  'icon-impuestos': { color: '#d9824b', icono: 'impuestos', corto: 'Impuestos' },
  'icon-activos': { color: '#b06fc4', icono: 'activos', corto: 'Activos fijos' },
};
