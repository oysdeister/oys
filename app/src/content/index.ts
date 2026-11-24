import type { Ejercicio, Modulo, Seccion } from '../types';

// Cada manual convertido vive en src/content/<slug>.json (mismo esquema, ver types.ts)
const ficheros = import.meta.glob<{ default: Modulo }>('./*.json', { eager: true });

/**
 * Orden pedagógico para un junior (cada módulo con dos fases, «Configurar» y «Operar», ver etapas.ts):
 * 0 Fundamentos; 1 Datos maestros (la empresa); 2 Contabilidad básica; 3 Compras; 4 Ventas; 5 Cartera;
 * 6 Tesorería; 7 Impuestos; 8 Activos fijos y 9 Contabilidad avanzada y cierre.
 * Los ids icon-* son internos (vienen de la documentación oficial de Finanzas): el alumno nunca los ve.
 */
export const ORDEN = ['fundamentos', 'maestros', 'icon-contabilidad', 'compras', 'ventas', 'carteras', 'tesoreria', 'icon-impuestos', 'icon-activos', 'contabilidad-avanzada'] as const;

/** Módulos de finanzas (documentación oficial de Finanzas) */
export const esFinanzas = (id: string) => id.startsWith('icon-') || id === 'contabilidad-avanzada';

export const MODULOS: Modulo[] = ORDEN.map((id) => ficheros[`./${id}.json`]?.default).filter(Boolean) as Modulo[];

/**
 * Bloques que se muestran en otro módulo que el de su JSON (mismos ids; el orden lo fija etapas.ts):
 * las facturas que generan asientos van a Compras y el asiento de un movimiento de banco, a Tesorería.
 */
const MOVIDOS: Record<string, string> = {
  'icon-contabilidad-v-1': 'compras', 'icon-contabilidad-v-2': 'compras', 'icon-contabilidad-v-3': 'compras', 'icon-contabilidad-v-4': 'compras',
  'asientos-14': 'tesoreria',
};
{
  const movidos: Ejercicio[] = [];
  for (const m of MODULOS) {
    m.ejercicios = m.ejercicios.filter((e) => {
      if (!MOVIDOS[e.id]) return true;
      movidos.push(e);
      return false;
    });
  }
  for (const e of movidos) MODULOS.find((m) => m.id === MOVIDOS[e.id])?.ejercicios.push(e);
}

/**
 * Módulos antiguos que se fusionaron en otro: los enlaces #/modulo/<viejo> redirigen al nuevo.
 * «Cobros y pagos» (icon-cartera) se unió a «Cartera de efectos» (carteras) en «Cartera, cobros y pagos»;
 * los ids de ejercicio no cambian, así que el progreso guardado y los momentos de vídeo siguen enlazados.
 */
export const ALIAS_MODULO: Record<string, string> = {
  'icon-cartera': 'carteras',
  // «Parametrización» y «Asientos manuales» son ahora bloques de «Contabilidad general» (mismos ids de ejercicio)
  parametrizacion: 'icon-contabilidad',
  asientos: 'icon-contabilidad',
};

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

/**
 * Bloques que se movieron de módulo: sus capturas siguen en public/img/<módulo de origen>/.
 * (Los ids de bloque no cambian; solo cambia en qué módulo se muestran.)
 */
const CARPETA_ORIGEN: Record<string, string> = {
  'maestros-v-1': 'maestros', 'maestros-v-2': 'maestros', 'maestros-1': 'maestros', 'maestros-2': 'maestros', 'maestros-3': 'maestros',
  'icon-contabilidad-2': 'icon-contabilidad', 'icon-contabilidad-3': 'icon-contabilidad', 'contab-cierre-practica': 'icon-contabilidad',
  'icon-contabilidad-v-1': 'icon-contabilidad', 'icon-contabilidad-v-2': 'icon-contabilidad', 'icon-contabilidad-v-3': 'icon-contabilidad', 'icon-contabilidad-v-4': 'icon-contabilidad', 'asientos-14': 'icon-contabilidad',
};
let carpetaPorFichero: Map<string, string[]> | null = null;
function carpetas() {
  if (carpetaPorFichero) return carpetaPorFichero;
  const mapa = new Map<string, string[]>();
  const anota = (fichero: unknown, dir: string) => {
    if (typeof fichero !== 'string') return;
    const l = mapa.get(fichero) ?? [];
    if (!l.includes(dir)) l.push(dir);
    mapa.set(fichero, l);
  };
  const secciones = (ss: Seccion[], dir: string) => {
    for (const s of ss) for (const p of s.pasos) anota(p.imagen, dir);
  };
  for (const m of MODULOS) {
    secciones(m.navegacion ?? [], m.id);
    for (const e of m.ejercicios) secciones(e.secciones, CARPETA_ORIGEN[e.id] ?? m.id);
  }
  carpetaPorFichero = mapa;
  return mapa;
}

/** Ruta pública de una captura: public/img/<slug>/<fichero> (para un bloque movido, la carpeta de su módulo de origen) */
export function imgSrc(modulo: string, fichero: string) {
  const real = idModulo(modulo);
  const dirs = carpetas().get(fichero);
  const dir = dirs && !dirs.includes(real) ? dirs[0] : real;
  return `${import.meta.env.BASE_URL}img/${dir}/${fichero}`;
}

/** Metadatos visuales por módulo; «corto» es el nombre que ve el alumno en menú, ruta y planetas */
export const META: Record<string, { color: string; icono: string; corto: string }> = {
  fundamentos: { color: '#6c8fd6', icono: 'cerebro', corto: 'Fundamentos' },
  maestros: { color: '#4fbfa5', icono: 'maestros', corto: 'Datos maestros' },
  compras: { color: '#f2a93b', icono: 'compras', corto: 'Compras' },
  ventas: { color: '#e0708a', icono: 'ventas', corto: 'Ventas' },
  carteras: { color: '#3fa7c9', icono: 'cartera', corto: 'Cartera, cobros y pagos' },
  tesoreria: { color: '#8bc34a', icono: 'banco', corto: 'Tesorería y bancos' },
  'icon-contabilidad': { color: '#5b6fd8', icono: 'libro', corto: 'Contabilidad básica' },
  'icon-impuestos': { color: '#d9824b', icono: 'impuestos', corto: 'Impuestos' },
  'icon-activos': { color: '#b06fc4', icono: 'activos', corto: 'Activos fijos' },
  'contabilidad-avanzada': { color: '#7a5bd8', icono: 'balanza', corto: 'Contabilidad avanzada y cierre' },
};
