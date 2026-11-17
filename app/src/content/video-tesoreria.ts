/**
 * Las dos sesiones de formación de Tesorería (Deister), reducidas a los tramos en que se ve la pantalla de Axional Next.
 * Cada clip es UN tramo continuo de la grabación, recortado a la pantalla compartida (sin barra de Meet, sin participantes,
 * sin caras ni nombres, y con tapados los datos del cliente real). Quedan fuera las diapositivas, la versión antigua y las cuadrículas de Meet.
 * Sesión I: operaciones financieras, flujos financieros y el movimiento de tesorería.
 * Sesión II: del efecto y la remesa a la tesorería, el extracto N43, los conceptos propios y comunes y la conciliación.
 *
 * Los clips (cap01…cap11.mp4) están en la Release «video-tesoreria-v1» de GitHub; VITE_VIDEO_TESORERIA_URL
 * cambia la base (con «video-tesoreria» sirve la copia local de public/video-tesoreria/, fuera de git).
 * Todos los tiempos de este fichero se escriben en segundos DENTRO DE LA SESIÓN; los relativos al clip se calculan.
 */
import type { CapituloVideo, MomentoVideo } from './videoMapa';

export interface SerieTesoreria {
  id: 'tesoreria-1' | 'tesoreria-2';
  titulo: string;
  corto: string;
  intro: string;
  /** Módulos de la plataforma en cuya página se muestra */
  modulos: string[];
  /** El clip es un trozo de una grabación: el botón enseña el minuto de la sesión para buscarlo a mano */
  original: true;
  capitulos: CapituloTesoreria[];
}

export interface CapituloTesoreria extends CapituloVideo {
  /** Fichero del clip (cap01…cap11) */
  fichero: string;
}

/** Release «video-tesoreria-v1» de sergibauli/oys; VITE_VIDEO_TESORERIA_URL la sustituye (p. ej. «video-tesoreria» en local). */
const RELEASE = 'https://github.com/sergibauli/oys/releases/download/video-tesoreria-v1';
const BASE = ((import.meta.env.VITE_VIDEO_TESORERIA_URL as string | undefined) || RELEASE).replace(/\/$/, '');
const urlClip = (f: string) => (/^https?:/.test(BASE) ? `${BASE}/${f}.mp4` : `${import.meta.env.BASE_URL}${BASE}/${f}.mp4`);

interface Def {
  n: number;
  global: number;
  titulo: string;
  inicio: number;
  fin: number;
  /** [segundo de la sesión, título]; las que caen fuera del tramo se descartan */
  escenas: [number, string][];
}

function capitulo(d: Def): CapituloTesoreria {
  const fichero = `cap${String(d.global).padStart(2, '0')}`;
  const dentro = d.escenas.filter(([t]) => t >= d.inicio && t < d.fin);
  // El clip empieza a mitad de un tema: la primera escena toma el título del tema en curso
  const previa = d.escenas.filter(([t]) => t < d.inicio).pop();
  if (previa && (dentro.length === 0 || dentro[0][0] > d.inicio + 4)) dentro.unshift([d.inicio, previa[1]]);
  else if (dentro.length > 0 && dentro[0][0] > d.inicio) dentro[0] = [d.inicio, dentro[0][1]];
  return {
    n: d.n,
    titulo: d.titulo,
    inicio: d.inicio,
    duracion: d.fin - d.inicio,
    url: urlClip(fichero),
    poster: `img/tesoreria-video/${fichero}.jpg`,
    escenas: dentro.map(([t, titulo]) => ({ t: t - d.inicio, titulo })),
    fichero,
  };
}

// Escenas de la sesión I que caen en tramos de Next (segundo de la sesión)
const ESCENAS_I: [number, string][] = [
  [1103, 'En Next: operaciones financieras, con estado abierto o cerrado'],
  [1127, 'Posición, interface y parámetros de conciliación en Next'],
  [1218, 'En Next: los flujos financieros'],
  [1237, 'Banco + operación + flujo con cuenta contable'],
  [1474, 'En Next: el movimiento de tesorería'],
  [1491, 'Fechas, posición, operación e importe en Next'],
];

// Escenas de la sesión II (segundo de la sesión); en cada clip solo cuentan las que caen dentro del tramo
const ESCENAS_II: [number, string][] = [
  [204, 'El ejemplo: empresa Triathlon'],
  [269, 'La factura de compras y su contabilización'],
  [326, 'El efecto en cartera: transferencia, pendiente'],
  [376, 'Evolucionar estado con la acción «Pago a tesorería»'],
  [469, 'El efecto pasa a Ordenado'],
  [494, 'El movimiento de tesorería generado'],
  [544, 'De dónde sale: enlace contable de cartera'],
  [594, 'Clase pago + tipo transferencia → operación'],
  [645, 'Pagar en remesa, no uno a uno'],
  [673, 'Registro de remesas: nueva remesa'],
  [763, 'Cabecera: empresa, fecha, cuenta, clase y tipo'],
  [815, 'Selección de efectos'],
  [1022, 'Agregar el efecto'],
  [1053, 'Evolucionar el estado de la remesa'],
  [1078, 'Cartera ordenada y vínculo a la tesorería'],
  [1107, 'Dos formas de generar tesorería'],
  [1161, 'Contrastar la tesorería con el extracto'],
  [1188, 'El fichero norma 43'],
  [1243, 'Cuenta, movimientos y saldos'],
  [1272, 'Continuidad de saldos entre extractos'],
  [1302, 'Nueva carga en Extractos bancarios'],
  [1353, 'Crear el registro y procesar el fichero'],
  [1379, 'El resultado: las líneas del extracto'],
  [1479, 'El caso sencillo'],
  [1507, 'Rango de fechas, empresa y cuenta'],
  [1532, 'Pantalla partida: extracto y tesorería'],
  [1587, 'Conciliar: pasan a las pestañas de conciliado'],
  [1618, 'Las marcas en tesorería y en el extracto'],
  [1699, 'Duda: movimientos que no están en tesorería'],
  [1815, 'La parametrización del extracto'],
  [1842, 'El banco propio y su formato de extracto'],
  [1867, 'Ruta: Tesorería › Maestros › Conceptos propios'],
  [1892, 'Los conceptos propios del BBVA'],
  [1946, 'Si falta un concepto, la carga falla'],
  [1999, 'Dominio, código, descripción y tipo de conciliación'],
  [2025, 'Conciliación individual o por día'],
  [2052, 'Integración: debe y haber'],
  [2102, 'Salidas: comisiones e impuestos'],
  [2158, 'Operaciones a conciliar'],
  [2183, 'Orden y operación financiera'],
  [2233, 'La base de la conciliación masiva'],
  [2264, 'Parámetros: primer registro'],
  [2289, 'Documento, referencia o no considerar'],
  [2317, 'Float de fechas: ±días'],
  [2369, 'Conceptos comunes'],
  [2421, 'Conceptos propios: lista y formulario'],
  [2450, 'Conciliar uno a uno'],
  [2479, 'Cancelar extractos: los extornos'],
  [2505, 'Generar: integrar una comisión'],
  [2558, 'Conciliar efectos: el selector de efectos'],
  [2587, 'Vuelta a Next: los botones de la conciliación'],
  [2643, 'Acción, fecha y nota'],
  [2696, 'Conciliar'],
  [2722, 'Duda: comisiones de TPV por descripción'],
  [2797, 'Primera y segunda referencia'],
  [2849, 'Criterio de filtro en la integración'],
  [2978, 'Requisito: conceptos propios bien parametrizados'],
  [3041, 'Concepto 313: intereses, comisiones y custodia'],
  [3079, 'Sin pareja en tesorería: operación de salida'],
  [3137, 'Desconciliar para probar'],
  [3168, 'Rango, cuenta, empresa y concepto'],
  [3223, 'Lanzar el proceso'],
  [3257, 'Resultado: conciliado y movimiento creado'],
  [3313, 'Importes que no coinciden: margen de tolerancia'],
  [3403, 'Debe y haber o cobro y pago'],
];

const SESION_I: Def[] = [
  { n: 1, global: 1, titulo: 'Operaciones financieras en Next', inicio: 1103, fin: 1141, escenas: ESCENAS_I },
  { n: 2, global: 2, titulo: 'Flujos financieros en Next', inicio: 1218, fin: 1272, escenas: ESCENAS_I },
  { n: 3, global: 3, titulo: 'El movimiento de tesorería en Next', inicio: 1474, fin: 1508, escenas: ESCENAS_I },
];

const SESION_II: Def[] = [
  { n: 1, global: 4, titulo: 'Del efecto al movimiento de tesorería', inicio: 200, fin: 645, escenas: ESCENAS_II },
  { n: 2, global: 5, titulo: 'De la remesa a la tesorería', inicio: 645, fin: 1161, escenas: ESCENAS_II },
  { n: 3, global: 6, titulo: 'El extracto bancario N43 y su carga', inicio: 1161, fin: 1479, escenas: ESCENAS_II },
  { n: 4, global: 7, titulo: 'Conciliación individual: el primer emparejamiento', inicio: 1479, fin: 1662, escenas: ESCENAS_II },
  { n: 5, global: 8, titulo: 'Conceptos propios del banco', inicio: 1868, fin: 2158, escenas: ESCENAS_II },
  { n: 6, global: 9, titulo: 'Operaciones a conciliar y conceptos comunes', inicio: 2158, fin: 2380, escenas: ESCENAS_II },
  { n: 7, global: 10, titulo: 'Los botones de la conciliación individual', inicio: 2587, fin: 2966, escenas: ESCENAS_II },
  { n: 8, global: 11, titulo: 'Conciliación automática', inicio: 3000, fin: 3332, escenas: ESCENAS_II },
];

export const SERIES_TESORERIA: SerieTesoreria[] = [
  {
    id: 'tesoreria-1',
    titulo: 'Tesorería · sesión I',
    corto: 'Sesión I',
    intro: 'Las operaciones financieras, los flujos financieros y el movimiento de tesorería, tal como se ven en Axional Next. Solo están los tramos de la sesión en que se ve la pantalla de Next.',
    modulos: ['tesoreria'],
    original: true,
    capitulos: SESION_I.map(capitulo),
  },
  {
    id: 'tesoreria-2',
    titulo: 'Tesorería · sesión II',
    corto: 'Sesión II',
    intro: 'Del efecto y la remesa a la tesorería, el extracto N43, los conceptos propios y comunes y la conciliación individual y automática, todo en Next. Solo están los tramos de la sesión en que se ve la pantalla de Next.',
    modulos: ['tesoreria'],
    original: true,
    capitulos: SESION_II.map(capitulo),
  },
];

/* ---------- Momentos ---------- */

const SERIE_DE_SESION = { 1: 'tesoreria-1', 2: 'tesoreria-2' } as const;

/** Margen (s) con el que un momento se acerca al clip más próximo: la grabación tiene huecos (diapositivas, versión antigua) */
const MARGEN = 10;

/**
 * Momento a partir del segundo de la sesión: busca el clip que lo contiene o el más cercano (a menos de MARGEN s).
 * Si cae en un hueco de la grabación que no está en ningún clip, devuelve undefined y el momento se descarta.
 */
function m(sesion: 1 | 2, t: number, titulo: string): MomentoVideo | undefined {
  const serie = SERIES_TESORERIA[sesion - 1];
  let mejor: CapituloTesoreria | undefined;
  let dist = Infinity;
  for (const c of serie.capitulos) {
    const fin = c.inicio + c.duracion;
    const d = t < c.inicio ? c.inicio - t : t >= fin ? t - fin + 1 : 0;
    if (d < dist) {
      dist = d;
      mejor = c;
    }
  }
  if (!mejor || dist > MARGEN) return undefined;
  const tCap = Math.min(Math.max(t - mejor.inicio, 0), mejor.duracion - 1);
  return { serie: SERIE_DE_SESION[sesion], capitulo: mejor.n, t: mejor.inicio + tCap, tCap, titulo };
}

const ms = (...x: (MomentoVideo | undefined)[]) => x.filter((v): v is MomentoVideo => !!v);

/** Quita las entradas que se quedan sin ningún momento */
const registro = (r: Record<string, (MomentoVideo | undefined)[]>): Record<string, MomentoVideo[]> =>
  Object.fromEntries(Object.entries(r).map(([k, v]) => [k, ms(...v)]).filter(([, v]) => (v as MomentoVideo[]).length > 0));

const M = {
  // Sesión I: solo quedan los tramos en Next (operaciones, flujos y movimiento); lo demás cae en diapositivas o en la versión antigua
  rutaBanco: m(1, 142, 'La ruta y la cabecera de la cuenta'),
  datosBanco: m(1, 221, 'Entidad, número de cuenta y tipo de cuenta'),
  bancoNext: m(1, 484, 'La cuenta financiera en Next'),
  extractoBanco: m(1, 400, 'Control del extracto en la cuenta'),
  // En el minuto 21 se habla de las comisiones, pero la pantalla sigue en los flujos: no hay clip que las enseñe
  comisiones: undefined as MomentoVideo | undefined,
  posicion: m(1, 638, 'Posición: entrada o salida'),
  interface: m(1, 663, 'Interface: el asiento al contabilizar'),
  operaciones: m(1, 1130, 'Operaciones financieras en Next: estado abierto o cerrado'),
  paramConc: m(1, 853, 'Parámetros de conciliación de la operación'),
  float: m(1, 910, 'Float de fecha de operación y fecha valor'),
  primerRegistro: m(1, 979, 'Primer registro con importes repetidos'),
  flujos: m(1, 1212, 'Los flujos financieros en Next'),
  tipoFlujo: m(1, 1152, 'Comisión, interés o no gasto'),
  parametros: m(1, 1316, 'Parámetros de tesorería'),
  movimiento: m(1, 1491, 'El movimiento de tesorería en Next'),
  asiento: m(1, 1709, 'El asiento: banco contra flujos y comisión'),
  // Sesión II
  efecto: m(2, 376, 'Evolucionar el efecto a «Pago a tesorería»'),
  remesa: m(2, 673, 'De la remesa a la tesorería'),
  n43: m(2, 1188, 'El fichero norma 43'),
  carga: m(2, 1302, 'Nueva carga del extracto'),
  propios: m(2, 1867, 'Los conceptos propios del banco'),
  integracion: m(2, 2052, 'Integración: debe y haber'),
  opConciliar: m(2, 2158, 'Operaciones a conciliar'),
  comunes: m(2, 2369, 'Conceptos comunes'),
  individual: m(2, 1532, 'La pantalla de conciliación individual'),
  marcas: m(2, 1618, 'Las marcas de conciliado'),
  cancelar: m(2, 2479, 'Cancelar extractos: los extornos'),
  generar: m(2, 2505, 'Generar: integrar una comisión'),
  concEfectos: m(2, 2660, 'Conciliar efectos'),
  automatica: m(2, 3000, 'La conciliación automática'),
  concepto313: m(2, 3041, 'Concepto 313 sin pareja en tesorería'),
};

/** Momentos por ejercicio del módulo de tesorería (ids tesoreria-1…5) */
export const MOMENTOS_EJERCICIO_TESORERIA: Record<string, MomentoVideo[]> = registro({
  'tesoreria-1': [M.rutaBanco, M.bancoNext, M.comisiones],
  'tesoreria-2': [M.posicion, M.paramConc, M.operaciones, M.flujos, M.parametros],
  'tesoreria-3': [M.movimiento, M.asiento],
  'tesoreria-4': [M.n43, M.carga, M.propios, M.comunes],
  'tesoreria-5': [M.individual, M.cancelar, M.concEfectos, M.automatica],
});

/** Momentos por id de sección (tesoreria.json y las secciones de tesorería de carteras y asientos) */
export const MOMENTOS_SECCION_TESORERIA: Record<string, MomentoVideo[]> = registro({
  'tesoreria-nav-vision': [m(2, 103, 'El esquema: cartera, banco y conciliación')],
  'tesoreria-nav-moverse': [M.rutaBanco, m(2, 1867, 'Ruta: Tesorería › Maestros › Conceptos propios')],
  'tesoreria-1-banco': [M.rutaBanco, M.datosBanco, M.bancoNext],
  'tesoreria-1-extracto': [M.extractoBanco, m(1, 552, 'Las vistas inferiores de la cuenta en Next')],
  'tesoreria-1-comisiones': [M.comisiones, m(1, 1288, 'Por beneficiario, por efecto o comisión separada')],
  'tesoreria-2-flujo': [M.flujos, M.tipoFlujo],
  'tesoreria-2-operacion': [M.posicion, M.interface, M.operaciones],
  'tesoreria-2-conciliacion': [M.paramConc, M.float, M.primerRegistro],
  'tesoreria-2-parametros': [M.parametros],
  'tesoreria-3-manual': [M.movimiento, m(1, 1546, 'Orígenes: real, cartera, asiento, préstamos')],
  'tesoreria-4-n43': [M.n43, m(2, 1272, 'Continuidad de saldos entre extractos')],
  'tesoreria-4-carga': [M.carga, m(2, 1353, 'Crear el registro y procesar el fichero')],
  'tesoreria-4-extractos': [m(2, 1379, 'El resultado: las líneas del extracto')],
  'tesoreria-4-comunes': [M.comunes],
  'tesoreria-4-propios': [M.propios, m(2, 1999, 'Tipo de conciliación: individual o por día'), M.integracion, M.opConciliar],
  'tesoreria-5-pantalla': [m(2, 1507, 'Rango de fechas, empresa y cuenta'), M.individual],
  'tesoreria-5-conciliar': [m(2, 1587, 'Conciliar: pasan a las pestañas de conciliado'), M.marcas],
  'tesoreria-5-botones': [M.cancelar, M.generar, M.concEfectos],
  'tesoreria-5-automatica': [M.automatica, M.concepto313, m(2, 3257, 'Resultado: conciliado y movimiento creado')],
  'carteras-7-efecto': [m(2, 326, 'El efecto en cartera: transferencia, pendiente'), M.efecto, m(2, 494, 'El movimiento de tesorería generado'), m(2, 544, 'Enlace contable de cartera')],
  'carteras-7-remesa': [M.remesa, m(2, 815, 'Selección de efectos'), m(2, 1078, 'Cartera ordenada y vínculo a la tesorería')],
  'asientos-14-movimiento': [M.asiento, m(1, 1447, 'El apunte contable del movimiento')],
  'asientos-14-comision': [M.comisiones],
});
