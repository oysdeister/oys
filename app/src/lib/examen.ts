/*
  Examen final del Practicando Axional Deister VNext.

  - Todo se genera de forma determinista a partir del código de examen (EX-<INI>-XXXX).
    El código sale de hash(alumno.id + fecha de inicio); el resto (preguntas, cantidades,
    precios, rutas de menú) sale de hash(código). Así el examinador puede regenerar lo
    esperado pegando solo el código.
  - El estado vive en localStorage `oys-examen` (no toca progress.ts).
  - Validación: código = primeros 8 caracteres de SHA-256(clave examinador + código de examen).
    La clave viaja en el bundle (VITE_CLAVE_EXAMINADOR al compilar). Se acepta: es una
    herramienta interna y la comprobación real la hace el examinador en Axional.
*/
import { useSyncExternalStore } from 'react';
import { META, MODULOS, ORDEN, esFinanzas } from '../content';
import type { Pregunta } from '../types';
import { conIni, num2, redondea } from './texto';

/* ---------------------------------------------------------------- azar determinista */

export function hash32(s: string): number {
  // FNV-1a 32 bits con mezcla final (murmur fmix)
  let h = 0x811c9dc5;
  for (let i = 0; i < s.length; i++) {
    h ^= s.charCodeAt(i);
    h = Math.imul(h, 0x01000193);
  }
  h ^= h >>> 16;
  h = Math.imul(h, 0x85ebca6b);
  h ^= h >>> 13;
  h = Math.imul(h, 0xc2b2ae35);
  h ^= h >>> 16;
  return h >>> 0;
}

export function rng(semilla: number) {
  let a = semilla >>> 0;
  const next = () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
  return {
    next,
    int: (min: number, max: number) => min + Math.floor(next() * (max - min + 1)),
    pick: <T,>(arr: readonly T[]) => arr[Math.floor(next() * arr.length)],
    shuffle: <T,>(arr: readonly T[]) => {
      const c = [...arr];
      for (let i = c.length - 1; i > 0; i--) {
        const j = Math.floor(next() * (i + 1));
        [c[i], c[j]] = [c[j], c[i]];
      }
      return c;
    },
  };
}

const ALFABETO = '23456789ABCDEFGHJKLMNPQRSTUVWXYZ'; // sin 0/O ni 1/I

export function crearCodigo(alumnoId: string, ini: string, inicio: string) {
  let h = hash32(`${alumnoId}|${inicio}`);
  let suf = '';
  for (let i = 0; i < 4; i++) {
    suf += ALFABETO[h & 31];
    h >>>= 5;
  }
  return `EX-${ini || 'CL'}-${suf}`;
}

export const RE_CODIGO = /EX-([A-ZÑ0-9]{1,4})-([2-9A-HJ-NP-Z]{4})/;

export function iniDeCodigo(codigo: string) {
  return RE_CODIGO.exec(codigo)?.[1] ?? 'CL';
}

/* ---------------------------------------------------------------- modelo del examen */

export type TipoCampo = 'doc' | 'importe' | 'cuenta' | 'texto' | 'opcion' | 'entero' | 'ruta';

export interface CampoExamen {
  id: string;
  etiqueta: string;
  tipo: TipoCampo;
  puntos: number;
  /** Valor esperado; si falta, solo se comprueba el formato y lo verifica el examinador */
  esperado?: string | number;
  /** Para tipo doc/entero: expresión regular del formato */
  patron?: string;
  placeholder?: string;
  opciones?: string[];
  /** Para tipo ruta: fichas desordenadas entre las que elegir */
  fichas?: string[];
}

export interface TareaExamen {
  id: string;
  modulo: string;
  titulo: string;
  encargo: string;
  /** Datos del encargo que el alumno necesita (sin pasos) */
  datos: { k: string; v: string }[];
  /** Lo que la demo no hace sola: avisos que no son pasos (ver skill erp-nuevo-compras) */
  notas?: string[];
  campos: CampoExamen[];
}

/* Teoría: cinco tipos de pregunta. Las preguntas antiguas (guardadas sin «tipo») son de test. */
export type TipoPregunta = 'test' | 'clic' | 'orden' | 'relacion' | 'dato';

interface BasePregunta {
  /** id del módulo, «vídeo cap. N» o «criterio» */
  origen: string;
  pregunta: string;
  explicacion: string;
}

export interface PreguntaTest extends Pregunta, BasePregunta {
  tipo?: 'test';
  /** Preguntas del vídeo: capítulo y segundo dentro del capítulo */
  video?: { cap: number; t: number };
}

export interface PreguntaClic extends BasePregunta {
  tipo: 'clic';
  /** Pantalla (título de la sección del manual) */
  pantalla: string;
  modulo: string;
  imagen: string;
  zona: { x: number; y: number; w: number; h: number };
  etiqueta: string;
  /** Paso del manual en el que se hace el clic */
  paso?: string;
}

export interface PreguntaOrden extends BasePregunta {
  tipo: 'orden';
  /** Elementos en el orden en que se muestran (desordenados) */
  items: string[];
  /** Índices de items en el orden correcto */
  solucion: number[];
}

export interface PreguntaRelacion extends BasePregunta {
  tipo: 'relacion';
  titulos: [string, string];
  izquierda: string[];
  derecha: string[];
  /** Para cada elemento de la izquierda, el índice de su pareja en la derecha */
  solucion: number[];
}

export interface PreguntaDato extends BasePregunta {
  tipo: 'dato';
  formato: 'importe' | 'cuenta';
  esperado: number | string;
  placeholder: string;
  /** Datos del enunciado (base, IVA…) */
  datos?: { k: string; v: string }[];
}

export type PreguntaExamen = PreguntaTest | PreguntaClic | PreguntaOrden | PreguntaRelacion | PreguntaDato;
/** Respuesta: índice (test), punto en % (clic), orden o parejas (orden, relación), texto (dato) */
export type RespuestaTeoria = number | string | number[] | { x: number; y: number } | null;

export const esTest = (q: PreguntaExamen): q is PreguntaTest => !q.tipo || q.tipo === 'test';
export const tipoDe = (q: PreguntaExamen): TipoPregunta => q.tipo ?? 'test';

export interface Caso {
  codigo: string;
  ini: string;
  proveedor: string;
  cliente: string;
  compra: { cantidad: number; precio: number; base: number; iva: number; total: number };
  venta: { cantidad: number; precio: number; base: number; iva: number; total: number };
  gasto: { cuenta: string; nombre: string; concepto: string; importe: number };
  /** Líneas del asiento esperado de cada documento */
  asientos: { titulo: string; lineas: { cuenta: string; nombre: string; debe: number; haber: number }[] }[];
  tareas: TareaExamen[];
}

export const ARTICULO = { codigo: '13500620', nombre: '6000-2RS' };
export const IVA = 0.21;
export const PESO_TEORIA = 0.3;
export const PESO_PRACTICA = 0.7;
export const APROBADO_EXAMEN = 0.8;
export const MIN_TEORIA = 45;
/** Encargos de la práctica (8 en Axional + 1 de rutas de menú) */
export const NUM_TAREAS = 9;
/**
 * Reparto de la teoría: un test por módulo (6 de los manuales + 4 de finanzas), un clic por módulo
 * de los manuales (los de finanzas no tienen zonas marcadas), un vídeo por capítulo, dos de tesorería
 * en su propio cupo y el resto.
 */
export const REPARTO = { test: 10, clic: 6, video: 8, orden: 2, relacion: 2, dato: 2, criterio: 2, tesoreria: 2 } as const;
export const NUM_TEORIA = Object.values(REPARTO).reduce((s, n) => s + n, 0);
/** Margen (en % de la captura) alrededor de la zona correcta en las preguntas de clic */
export const MARGEN_CLIC = 2.5;
/** Tamaño del banco teórico (para la portada) */
export const bancoTeoria = () => ({
  tests: MODULOS.reduce((s, m) => s + m.ejercicios.reduce((t, e) => t + e.test.filter((q) => apta(q)).length, 0), 0),
  clic: MODULOS.reduce((s, m) => s + pasosClic(m.id).length, 0),
  video: VIDEO.length,
  criterio: CRITERIO.length + TESORERIA.length,
  otras: CIRCUITOS_VIDEO.length + MODULOS.length + RELACIONES.length + 6,
});

const p2 = (n: number) => num2.format(n);

/* Rutas de menú para las preguntas «de pantalla»: salen de los manuales */
function rutasDeMenu() {
  const out: { titulo: string; ruta: string[] }[] = [];
  const vistos = new Set<string>();
  for (const m of MODULOS) {
    // Las rutas de finanzas salen del árbol de la documentación, no de un menú comprobado en la demo
    if (esFinanzas(m.id)) continue;
    for (const e of m.ejercicios) {
      for (const s of e.secciones) {
        const r = s.ruta;
        if (!r || r.length < 4 || r.length > 6) continue;
        if (r[0] !== 'Gestión' && r[0] !== 'Finanzas') continue;
        const limpia = r.map((x) => x.replace(/\s*\(.*?\)\s*/g, '').replace(/[«»]/g, '').trim()).filter(Boolean);
        if (limpia.some((x) => x.includes('{INI}') || x.length > 34)) continue;
        if (new Set(limpia).size !== limpia.length) continue; // fichas repetidas no se pueden elegir dos veces
        const clave = limpia.join('>');
        if (vistos.has(clave)) continue;
        vistos.add(clave);
        out.push({ titulo: limpia[limpia.length - 1], ruta: limpia });
      }
    }
  }
  return out;
}

export function generarCaso(codigo: string): Caso {
  const ini = iniDeCodigo(codigo);
  const r = rng(hash32(`${codigo}|caso`));
  const proveedor = `T${ini}EX`;
  const cliente = `C${ini}EX`;

  const qc = r.int(6, 24);
  const pc = r.int(70, 198) * 0.05; // 3,50 a 9,90
  const bc = redondea(qc * pc);
  const ic = redondea(bc * IVA);
  const compra = { cantidad: qc, precio: redondea(pc), base: bc, iva: ic, total: redondea(bc + ic) };

  const qv = r.int(3, 16);
  const pv = r.int(36, 64) * 0.5; // 18,00 a 32,00
  const bv = redondea(qv * pv);
  const iv = redondea(bv * IVA);
  const venta = { cantidad: qv, precio: redondea(pv), base: bv, iva: iv, total: redondea(bv + iv) };

  const gastos = [
    { cuenta: '62900', nombre: 'Otros servicios', concepto: 'limpieza de la oficina' },
    { cuenta: '62902', nombre: 'Gastos diversos', concepto: 'material de oficina' },
    { cuenta: '62903', nombre: 'Correos y mensajería', concepto: 'mensajería urgente' },
  ];
  const g = r.pick(gastos);
  const gasto = { ...g, importe: redondea(r.int(120, 960) + r.pick([0, 0.5, 0.25, 0.75])) };

  const asientos: Caso['asientos'] = [
    {
      titulo: 'Albarán de compra (ACPC)',
      lineas: [
        { cuenta: '60000', nombre: 'Compras', debe: bc, haber: 0 },
        { cuenta: '40090', nombre: 'Compras pendiente de factura', debe: 0, haber: bc },
      ],
    },
    {
      titulo: 'Factura de compra (FCOA)',
      lineas: [
        { cuenta: '40000', nombre: 'Proveedores', debe: 0, haber: compra.total },
        { cuenta: '47200', nombre: 'IVA soportado 21 %', debe: ic, haber: 0 },
        { cuenta: '60000', nombre: 'Compras', debe: bc, haber: 0 },
        { cuenta: '40090', nombre: 'Compras pendiente de factura (salda el albarán)', debe: bc, haber: 0 },
        { cuenta: '60000', nombre: 'Compras (retroceso del albarán)', debe: 0, haber: bc },
      ],
    },
    {
      titulo: 'Factura de venta (F' + ini + ', plantilla FV)',
      lineas: [
        { cuenta: '43000', nombre: 'Clientes', debe: venta.total, haber: 0 },
        { cuenta: '47000', nombre: 'IVA repercutido 21 %', debe: 0, haber: iv },
        { cuenta: '70000', nombre: 'Ventas', debe: 0, haber: bv },
      ],
    },
    {
      titulo: 'Cobro del efecto (COBD)',
      lineas: [
        { cuenta: '57200', nombre: 'Bancos', debe: venta.total, haber: 0 },
        { cuenta: '43000', nombre: 'Clientes', debe: 0, haber: venta.total },
      ],
    },
    {
      titulo: 'Asiento manual (diario EA)',
      lineas: [
        { cuenta: gasto.cuenta, nombre: gasto.nombre, debe: gasto.importe, haber: 0 },
        { cuenta: '57200', nombre: 'Bancos', debe: 0, haber: gasto.importe },
      ],
    },
  ];

  const ESTADOS_DOC = ['Pendiente', 'Parcial', 'Servido', 'Facturado'];
  const ESTADOS_EF = ['PE Pendiente', 'PR Propuesto', 'CO Cobrado', 'PA Pagado', 'DV Devuelto'];
  const ESTADOS_AS = ['Provisional', 'Contabilizado', 'Anulado'];

  const tareas: TareaExamen[] = [
    {
      id: 't1',
      modulo: 'maestros',
      titulo: 'Alta del proveedor',
      encargo: `Empezamos a comprar rodamientos a un proveedor nuevo. Dalo de alta como tercero y como proveedor con el código ${proveedor}, listo para que sus facturas contabilicen y generen su vencimiento en la cartera de pagos. Compra en euros, con el grupo de precio 00001 y sin ningún descuento ni pronto pago.`,
      datos: [
        { k: 'Código', v: proveedor },
        { k: 'Nombre', v: `Proveedor examen ${codigo}` },
        { k: 'NIF', v: 'uno de prueba (o el que te dé el examinador)' },
        { k: 'Dirección', v: 'tipo 0, domicilio fiscal' },
        { k: 'Condición de pago', v: 'tipo de efecto EF, plazo 30D' },
        { k: 'Relación contable', v: 'Proveedor · PRO · 40000.00000' },
        { k: 'Tipo proveedor y divisa', v: 'GENERAL · EUR' },
        { k: 'Grupo de precio', v: '00001' },
      ],
      campos: [
        { id: 't1.codigo', etiqueta: 'Código de proveedor que has creado', tipo: 'texto', esperado: proveedor, puntos: 2, placeholder: 'T…EX' },
        { id: 't1.grupo', etiqueta: 'Grupo de precio del proveedor', tipo: 'texto', esperado: '00001', puntos: 2, placeholder: '00000' },
        { id: 't1.dtos', etiqueta: 'Qué has puesto en descuentos 1, 2, 3 y pronto pago', tipo: 'opcion', opciones: ['Los he dejado vacíos', '0 en los cuatro', '100 en los cuatro', 'Solo el pronto pago a 0'], esperado: '0 en los cuatro', puntos: 3 },
        { id: 't1.estado', etiqueta: 'Estado del tercero antes de crear el proveedor', tipo: 'opcion', opciones: ['Provisional', 'Validado', 'Activo', 'Bloqueado'], esperado: 'Validado', puntos: 2 },
        { id: 't1.cat', etiqueta: 'Categoría que has elegido para el tercero', tipo: 'opcion', opciones: ['001 Clientes', '002 Proveedores', '003 Acreedores', '008 Entidades Financieras'], esperado: '002 Proveedores', puntos: 1 },
      ],
    },
    {
      id: 't2',
      modulo: 'compras',
      titulo: 'Pedido al proveedor',
      encargo: `Pídele a ${proveedor} ${qc} unidades del rodamiento ${ARTICULO.codigo} (${ARTICULO.nombre}) a ${p2(compra.precio)} € la unidad. Empresa 0, delegación CENTRAL, departamento COMPRAS, almacén 0, tipo de pedido PC. En «Referencia» pon el código de examen. Déjalo validado.`,
      datos: [
        { k: 'Artículo', v: `${ARTICULO.codigo} ${ARTICULO.nombre}` },
        { k: 'Cantidad', v: `${qc} UNI` },
        { k: 'Precio', v: `${p2(compra.precio)} €` },
        { k: 'Referencia', v: codigo },
      ],
      notas: [
        'La ficha de pedido de la demo no aplica el numerador: el número 0PC lo tecleas tú (el siguiente libre de la lista).',
        'Importe bruto y neto de la cabecera también se teclean.',
        'Las líneas se cargan con ⋮ › Importar en «Líneas de pedidos» (CSV con «;», cabecera cabid;linrel;orden;codart;varlog;numlot;canped;udmcom;canpre;udmpre;precio;impnet;canser;dtoimp, cabid = Identificador del pedido, dtoimp 0).',
      ],
      campos: [
        { id: 't2.num', etiqueta: 'Número del pedido', tipo: 'doc', patron: '^0PC\\d{6}$', placeholder: '0PC000000', puntos: 2 },
        { id: 't2.ref', etiqueta: 'Qué has escrito en «Referencia»', tipo: 'texto', esperado: codigo, puntos: 1, placeholder: 'EX-…' },
        { id: 't2.neto', etiqueta: 'Importe neto del pedido (sin IVA)', tipo: 'importe', esperado: bc, puntos: 3, placeholder: '0,00' },
        { id: 't2.situ', etiqueta: 'Situación del pedido recién validado', tipo: 'opcion', opciones: ESTADOS_DOC, esperado: 'Pendiente', puntos: 2 },
      ],
    },
    {
      id: 't3',
      modulo: 'compras',
      titulo: 'Recepción de la mercancía',
      encargo: 'Ha llegado todo lo pedido. Genera el albarán de compra (tipo ACPC) a partir del pedido con el proceso de generación de albaranes, comprueba que queda validado y contabilízalo.',
      datos: [
        { k: 'Origen', v: 'tu pedido del encargo 2' },
        { k: 'Tipo de albarán', v: 'ACPC' },
      ],
      campos: [
        { id: 't3.num', etiqueta: 'Número del albarán', tipo: 'doc', patron: '^0AC\\d{6}$', placeholder: '0AC000000', puntos: 2 },
        { id: 't3.neto', etiqueta: 'Importe neto del albarán', tipo: 'importe', esperado: bc, puntos: 2, placeholder: '0,00' },
        { id: 't3.asiento', etiqueta: 'Número del asiento del albarán', tipo: 'entero', patron: '^\\d{1,7}$', placeholder: '0', puntos: 1 },
        { id: 't3.debe', etiqueta: 'Cuenta al Debe del asiento', tipo: 'cuenta', esperado: '60000', puntos: 2, placeholder: '00000' },
        { id: 't3.haber', etiqueta: 'Cuenta al Haber del asiento', tipo: 'cuenta', esperado: '40090', puntos: 2, placeholder: '00000' },
        { id: 't3.pedido', etiqueta: 'Situación del pedido tras generar el albarán', tipo: 'opcion', opciones: ESTADOS_DOC, esperado: 'Servido', puntos: 2 },
      ],
    },
    {
      id: 't4',
      modulo: 'compras',
      titulo: 'Factura del proveedor',
      encargo: `Ha llegado la factura del proveedor con el número ${codigo} por el total de la compra. Genérala desde el albarán (tipo FCOA), comprueba que el importe que te declara cuadra con el calculado y contabilízala. Busca después su asiento: no te fíes de la ventana que se abre al contabilizar.`,
      datos: [
        { k: 'Factura proveedor', v: codigo },
        { k: 'Importe factura', v: `${p2(compra.total)} €` },
        { k: 'IVA', v: '21 %' },
      ],
      campos: [
        { id: 't4.num', etiqueta: 'Número de la factura', tipo: 'doc', patron: '^0FC\\d{6}$', placeholder: '0FC000000', puntos: 2 },
        { id: 't4.ref', etiqueta: 'Qué has escrito en «Factura proveedor»', tipo: 'texto', esperado: codigo, puntos: 1, placeholder: 'EX-…' },
        { id: 't4.base', etiqueta: 'Base imponible', tipo: 'importe', esperado: bc, puntos: 2, placeholder: '0,00' },
        { id: 't4.iva', etiqueta: 'Cuota de IVA', tipo: 'importe', esperado: ic, puntos: 2, placeholder: '0,00' },
        { id: 't4.total', etiqueta: 'Total factura', tipo: 'importe', esperado: compra.total, puntos: 2, placeholder: '0,00' },
        { id: 't4.asiento', etiqueta: 'Número del asiento de la factura', tipo: 'entero', patron: '^\\d{1,7}$', placeholder: '0', puntos: 1 },
        { id: 't4.prov', etiqueta: 'Cuenta del proveedor (al Haber por el total)', tipo: 'cuenta', esperado: '40000', puntos: 2, placeholder: '00000' },
        { id: 't4.cuentaiva', etiqueta: 'Cuenta del IVA soportado', tipo: 'cuenta', esperado: '47200', puntos: 2, placeholder: '00000' },
        { id: 't4.salda', etiqueta: 'Cuenta que salda el albarán al Debe', tipo: 'cuenta', esperado: '40090', puntos: 2, placeholder: '00000' },
        { id: 't4.lineas', etiqueta: 'Cuántas líneas tiene el asiento de la factura', tipo: 'opcion', opciones: ['2', '3', '5', '6'], esperado: '5', puntos: 2 },
        { id: 't4.alb', etiqueta: 'Estado del albarán en el Docflow', tipo: 'opcion', opciones: ESTADOS_DOC, esperado: 'Facturado', puntos: 2 },
      ],
    },
    {
      id: 't5',
      modulo: 'carteras',
      titulo: 'Efectos de la compra',
      encargo: 'Tesorería quiere saber qué le debemos al proveedor. Busca en la cartera de pagos los efectos que ha generado tu factura de compra y anota lo que ves. No lo pagues.',
      datos: [{ k: 'Dónde', v: 'cartera de efectos, clase Pagar' }],
      campos: [
        { id: 't5.num', etiqueta: 'Cuántos efectos ha generado la factura', tipo: 'opcion', opciones: ['Ninguno', '1', '2', '3'], esperado: '1', puntos: 2 },
        { id: 't5.importe', etiqueta: 'Importe del efecto', tipo: 'importe', esperado: compra.total, puntos: 3, placeholder: '0,00' },
        { id: 't5.tipo', etiqueta: 'Tipo de efecto', tipo: 'texto', esperado: 'EF', puntos: 1, placeholder: 'EF' },
        { id: 't5.dias', etiqueta: 'A cuántos días de la fecha de factura vence', tipo: 'opcion', opciones: ['0', '30', '60', '90'], esperado: '30', puntos: 2 },
        { id: 't5.estado', etiqueta: 'Estado del efecto', tipo: 'opcion', opciones: ESTADOS_EF, esperado: 'PE Pendiente', puntos: 2 },
      ],
    },
    {
      id: 't6',
      modulo: 'ventas',
      titulo: 'Venta completa',
      encargo: `Un cliente nuevo, ${cliente}, nos pide oferta de ${qv} unidades del ${ARTICULO.codigo} a ${p2(venta.precio)} €. Dalo de alta como tercero y cliente. Hazle la oferta; la acepta: pásala a pedido, sirve el pedido con un albarán y factúralo. Usa tus tipologías del circuito oferta-pedido-albarán-factura. Contabiliza solo la factura.`,
      datos: [
        { k: 'Cliente', v: `${cliente} · categoría Clientes · dirección 0` },
        { k: 'Relación contable', v: 'Cliente · CLI · 43000.00000' },
        { k: 'Condición de cobro', v: 'EF · estado PE · plazo 30D' },
        { k: 'Tipologías', v: `O${ini} › P${ini} › A${ini}2 › F${ini}` },
        { k: 'Cantidad', v: `${qv} unidades` },
        { k: 'Precio', v: `${p2(venta.precio)} €` },
      ],
      notas: ['Al elegir el Origen en el pedido se vacía el Cliente: vuelve a ponerlo.', 'Revisa el importe neto de la línea del albarán: si no cuadra, reescribe Precio e Importe dto. 0 y guarda.'],
      campos: [
        { id: 't6.cliente', etiqueta: 'Código de cliente', tipo: 'texto', esperado: cliente, puntos: 1, placeholder: 'C…EX' },
        { id: 't6.oferta', etiqueta: 'Número de la oferta', tipo: 'doc', patron: '^0OV\\d{6}$', placeholder: '0OV000000', puntos: 1 },
        { id: 't6.pedido', etiqueta: 'Número del pedido', tipo: 'doc', patron: '^0PV\\d{6}$', placeholder: '0PV000000', puntos: 1 },
        { id: 't6.albaran', etiqueta: 'Número del albarán', tipo: 'doc', patron: '^0AV\\d{6}$', placeholder: '0AV000000', puntos: 1 },
        { id: 't6.factura', etiqueta: 'Número de la factura', tipo: 'doc', patron: '^0FV\\d{6}$', placeholder: '0FV000000', puntos: 2 },
        { id: 't6.base', etiqueta: 'Base imponible', tipo: 'importe', esperado: bv, puntos: 2, placeholder: '0,00' },
        { id: 't6.iva', etiqueta: 'Cuota de IVA', tipo: 'importe', esperado: iv, puntos: 2, placeholder: '0,00' },
        { id: 't6.total', etiqueta: 'Total factura', tipo: 'importe', esperado: venta.total, puntos: 2, placeholder: '0,00' },
        { id: 't6.asiento', etiqueta: 'Número del asiento de la factura', tipo: 'entero', patron: '^\\d{1,7}$', placeholder: '0', puntos: 1 },
        { id: 't6.cli', etiqueta: 'Cuenta del cliente (al Debe)', tipo: 'cuenta', esperado: '43000', puntos: 2, placeholder: '00000' },
        { id: 't6.cuentaiva', etiqueta: 'Cuenta del IVA repercutido (al Haber)', tipo: 'cuenta', esperado: '47000', puntos: 2, placeholder: '00000' },
        { id: 't6.ventas', etiqueta: 'Cuenta de ventas (al Haber)', tipo: 'cuenta', esperado: '70000', puntos: 2, placeholder: '00000' },
      ],
    },
    {
      id: 't7',
      modulo: 'carteras',
      titulo: 'Cobro del cliente',
      encargo: 'El cliente nos ha pagado hoy por transferencia. Cobra su vencimiento de forma individual, sin remesa, con una gestión de cobro.',
      datos: [
        { k: 'Cuenta financiera', v: `tu banco BBVA_${ini} (57200)` },
        { k: 'Perceptor', v: cliente },
      ],
      campos: [
        { id: 't7.accion', etiqueta: 'Acción que has usado', tipo: 'opcion', opciones: ['COBD Cobro directo', 'Una remesa CSCTS', '«Evolucionar estado» desde la ficha del efecto', 'Volver a contabilizar la factura'], esperado: 'COBD Cobro directo', puntos: 2 },
        { id: 't7.importe', etiqueta: 'Importe cobrado', tipo: 'importe', esperado: venta.total, puntos: 2, placeholder: '0,00' },
        { id: 't7.estado', etiqueta: 'Estado final del efecto', tipo: 'opcion', opciones: ESTADOS_EF, esperado: 'CO Cobrado', puntos: 2 },
        { id: 't7.asiento', etiqueta: 'Número del asiento del cobro', tipo: 'entero', patron: '^\\d{1,7}$', placeholder: '0', puntos: 1 },
        { id: 't7.debe', etiqueta: 'Cuenta al Debe', tipo: 'cuenta', esperado: '57200', puntos: 2, placeholder: '00000' },
        { id: 't7.haber', etiqueta: 'Cuenta al Haber', tipo: 'cuenta', esperado: '43000', puntos: 2, placeholder: '00000' },
      ],
    },
    {
      id: 't8',
      modulo: 'asientos',
      titulo: 'Asiento manual',
      encargo: `Hemos pagado por banco ${p2(gasto.importe)} € de ${gasto.concepto}. Regístralo a mano en el diario EA de la empresa 0, con la cuenta ${gasto.cuenta}.00000 (${gasto.nombre}) contra el banco 57200.00000, y en Documento pon el código de examen. Deja el asiento contabilizado.`,
      datos: [
        { k: 'Diario', v: 'EA' },
        { k: 'Documento', v: codigo },
        { k: 'Importe', v: `${p2(gasto.importe)} €` },
      ],
      campos: [
        { id: 't8.asiento', etiqueta: 'Número del asiento', tipo: 'entero', patron: '^\\d{1,7}$', placeholder: '0', puntos: 1 },
        { id: 't8.debe', etiqueta: 'Cuenta al Debe', tipo: 'cuenta', esperado: gasto.cuenta, puntos: 2, placeholder: '00000' },
        { id: 't8.haber', etiqueta: 'Cuenta al Haber', tipo: 'cuenta', esperado: '57200', puntos: 2, placeholder: '00000' },
        { id: 't8.total', etiqueta: 'Total Debe que ves en Totales', tipo: 'importe', esperado: gasto.importe, puntos: 2, placeholder: '0,00' },
        { id: 't8.cuadre', etiqueta: 'Cuadre que ves en Totales', tipo: 'importe', esperado: 0, puntos: 1, placeholder: '0,00' },
        { id: 't8.estado', etiqueta: 'Estado final del asiento', tipo: 'opcion', opciones: ESTADOS_AS, esperado: 'Contabilizado', puntos: 2 },
      ],
    },
  ];

  // Preguntas «de pantalla»: rutas de menú de los manuales, sin ayuda
  const rutas = rutasDeMenu();
  if (rutas.length >= 2) {
    const elegidas = r.shuffle(rutas).slice(0, 2);
    const todas = Array.from(new Set(rutas.flatMap((x) => x.ruta)));
    tareas.push({
      id: 't9',
      modulo: 'pantalla',
      titulo: 'Sin mirar la pantalla',
      encargo: 'Un compañero te pregunta dónde están estas opciones. Construye la ruta del menú tocando las fichas en orden.',
      datos: [],
      campos: elegidas.map((x, i) => {
        const distractores = r.shuffle(todas.filter((t) => !x.ruta.includes(t))).slice(0, 4);
        return {
          id: `t9.ruta${i + 1}`,
          etiqueta: `¿En qué menú está «${x.titulo}»?`,
          tipo: 'ruta' as const,
          esperado: x.ruta.join(' › '),
          fichas: r.shuffle([...x.ruta, ...distractores]),
          puntos: 3,
        };
      }),
    });
  }

  return { codigo, ini, proveedor, cliente, compra, venta, gasto, asientos, tareas };
}

/* ---------------------------------------------------------------- teoría */

const CRITERIO: Pregunta[] = [
  { pregunta: 'Das de alta un proveedor y dejas vacíos los descuentos 1, 2, 3 y el pronto pago. ¿Qué pasa después?', opciones: ['Nada: vacío equivale a 0', 'La factura de compra no contabiliza y da un error del servidor', 'El pedido no se puede validar', 'El IVA sale a 0'], correcta: 1, explicacion: 'Con esos campos vacíos la factura no contabiliza («Cannot invoke … because n is null») y no se arregla desde la propia factura. Ponlos a 0 al crear el proveedor.' },
  { pregunta: 'Contabilizas un albarán con un artículo cuyo tipo contable no tiene cuenta. ¿Qué ves?', opciones: ['Se contabiliza contra la 00000', 'El error «cuenta no definida» (24709)', 'Se contabiliza en provisional', 'Se anula el albarán'], correcta: 1, explicacion: 'Sin cuenta para el tipo contable sale «tipast … cuenta no definida» (24709). Por eso en la demo se usa el 13500620, de tipo PROD.' },
  { pregunta: '¿Qué cuenta va al Haber cuando contabilizas un albarán de compra?', opciones: ['40000 Proveedores', '40090 Compras pendiente de factura', '47200 IVA soportado', '57200 Bancos'], correcta: 1, explicacion: 'El albarán reconoce la compra (60000 al Debe) contra la 40090, a la espera de la factura.' },
  { pregunta: 'La factura de compra viene de un albarán ya contabilizado. ¿Qué le pasa a la 40090?', opciones: ['Se queda con saldo', 'Va al Debe y queda saldada', 'Pasa a la 43090', 'Se borra el asiento del albarán'], correcta: 1, explicacion: 'La factura lleva la 40090 al Debe por el importe del albarán y la deja a cero.' },
  { pregunta: 'El tipo de albarán tiene «Actualizar origen» = «Sumando». Generas el albarán desde el pedido completo. ¿Cómo queda el pedido?', opciones: ['Pendiente', 'Servido', 'Anulado', 'Facturado'], correcta: 1, explicacion: 'Al sumar lo servido en el origen, el pedido completo pasa a Servido.' },
  { pregunta: '«Generar albaranes desde pedidos» no te devuelve ningún pedido. ¿Qué revisas primero?', opciones: ['Que el proveedor tenga NIF', 'Que el tipo de pedido tenga informado el tipo de albarán a generar', 'Que el almacén tenga stock', 'Que el pedido esté contabilizado'], correcta: 1, explicacion: 'La consulta solo trae pedidos cuyo tipo tiene el tipo de albarán destino (por ejemplo PC → ACPC).' },
  { pregunta: '¿Dónde ves de un vistazo la cadena pedido, albarán, factura y sus estados?', opciones: ['En Sumas y saldos', 'En el Docflow del documento', 'En el numerador', 'En el Mayor de cuentas'], correcta: 1, explicacion: 'El Docflow (menú ⌄ junto a la estrella) dibuja la cadena con el estado de cada documento.' },
  { pregunta: 'En un asiento manual el bloque Totales marca Cuadre 25,00 en rojo. ¿Qué pasa?', opciones: ['Puedes finalizar igualmente', 'No aparece «Finalizar» hasta que cuadre', 'Se cuadra solo al guardar', 'Se contabiliza en provisional'], correcta: 1, explicacion: 'Mientras Debe y Haber no coinciden no ves el botón «Finalizar».' },
  { pregunta: 'Copias un asiento con «Número a generar» 3 y «Cadencia mensual» 1. ¿Qué obtienes?', opciones: ['Un asiento con el triple de importe', 'Tres copias en meses consecutivos', 'Tres líneas nuevas en el mismo asiento', 'Tres asientos el mismo día'], correcta: 1, explicacion: 'Genera tres asientos, uno por mes, a partir de la fecha indicada.' },
  { pregunta: 'Contabilizas el albarán de venta con la plantilla AV y la factura con FV, sin más. ¿Qué pasa?', opciones: ['Nada, es lo normal', 'La venta queda registrada dos veces', 'La factura no deja contabilizar', 'El IVA se duplica pero las ventas no'], correcta: 1, explicacion: 'El albarán ya llevó la venta contra la 43090 y la factura vuelve a llevarla contra la 430: queda dos veces.' },
  { pregunta: 'El cliente tiene la condición de cobro RC Recibo a 30D con estado de efecto PE. Contabilizas su factura. ¿Cómo está el efecto en la cartera?', opciones: ['CO Cobrado', 'PE Pendiente', 'PR Propuesto', 'OC Ordenado'], correcta: 1, explicacion: 'Nace en el estado de la condición de cobro, PE, y pasa a CO cuando lo cobras (COBD o remesa).' },
  { pregunta: 'Agregas un efecto pendiente a una remesa de cobro. ¿Qué estado toma?', opciones: ['CO Cobrado', 'PR Propuesto', 'DV Devuelto', 'Se queda en PE'], correcta: 1, explicacion: 'En la remesa recorre PE › PR › OC › CO.' },
  { pregunta: 'Una factura de 121,00 tiene un plazo de pago 40-80-120 días con 40 % / 20 % / 40 %. ¿Qué efectos genera?', opciones: ['Uno de 121,00', '48,40 / 24,20 / 48,40', '40,33 / 40,33 / 40,34', '40,00 / 20,00 / 40,00'], correcta: 1, explicacion: 'Cada vencimiento lleva su porcentaje del total: 40 % de 121 = 48,40 y 20 % = 24,20.' },
  { pregunta: 'Base 40,00 con IVA 21 %. ¿Qué va al Haber de la 40000?', opciones: ['40,00', '48,40', '8,40', '32,60'], correcta: 1, explicacion: 'Al proveedor se le debe el total: 40,00 + 8,40 = 48,40.' },
  { pregunta: 'Con la máscara #e#s#6n, empresa 0 y serie PC, ¿cómo sale el primer número?', opciones: ['PC0000001', '0PC000001', '0-PC-1', '2026PC000001'], correcta: 1, explicacion: '#e es la empresa, #s la serie y #6n un contador de seis cifras: 0PC000001.' },
  { pregunta: 'Junto a «Validar» en un albarán con líneas aparece «Anular». ¿Qué haces si lo pulsas sin querer?', opciones: ['Nada, es lo mismo que validar', 'Cancelas la confirmación: «Anular» pide un motivo y anularía el albarán', 'Recargas la página', 'Contabilizas enseguida'], correcta: 1, explicacion: '«Anular» pide un motivo y anula el documento. Si fue sin querer, cancela la confirmación.' },
  { pregunta: 'En la línea del albarán de compra no se rellena el precio de la tarifa. ¿Qué haces?', opciones: ['Cambias el grupo de precio del proveedor', 'Tecleas Precio, Precio con IVA e Importe dto.', 'Guardas a 0 y lo corriges en la factura', 'Borras el albarán'], correcta: 1, explicacion: 'En la demo el diálogo de línea no aplica la tarifa: esos tres campos se teclean. El neto lo calcula el servidor.' },
  { pregunta: 'En la pestaña Tarifas del proveedor, ¿a qué apuntas?', opciones: ['A una tarifa concreta', 'A un grupo de precios, que decide qué lista aplica', 'A un artículo', 'A una cuenta contable'], correcta: 1, explicacion: 'El proveedor apunta a un grupo de precios (por ejemplo 00001, que lleva a la lista COM).' },
];

/* Tesorería: bancos propios, operaciones, flujos, extracto N43 y conciliación (sesiones I y II de formación) */
const TESORERIA: Pregunta[] = [
  { pregunta: '¿Qué tres cosas necesita como mínimo un movimiento de tesorería?', opciones: ['Banco propio, operación financiera y flujo con cuenta contable', 'Factura, albarán y pedido', 'Cliente, artículo y tarifa', 'Diario, periodo y asiento'], correcta: 0, explicacion: 'El movimiento va siempre contra una cuenta financiera (banco propio), con una operación financiera y al menos un flujo que lleva la cuenta contable.' },
  { pregunta: 'En los parámetros de conciliación de una operación, la referencia está en «No considerar». ¿Cómo busca la pareja?', opciones: ['Por el número de documento', 'Solo por el importe', 'Por la descripción del extracto', 'No concilia nunca'], correcta: 1, explicacion: '«No considerar» quiere decir que no mira la referencia: busca por importe (y posición, dentro del float de fechas).' },
  { pregunta: 'La operación tiene la referencia en «Documento». ¿Qué tiene que coincidir?', opciones: ['La fecha valor', 'El número de operación del extracto con el documento del movimiento', 'El concepto común', 'La cuenta contable del flujo'], correcta: 1, explicacion: 'Con «Documento» concilia por el número de operación: la referencia que trae el banco tiene que estar en el movimiento de tesorería.' },
  { pregunta: 'Pagas el miércoles y el banco lo carga el jueves. ¿Qué parámetro hace que concilien?', opciones: ['Primer registro', 'El float de fecha de operación de 1 día', 'Operación comisión', 'El tipo de conciliación «por día»'], correcta: 1, explicacion: 'El float da un margen de días, adelante y atrás, alrededor de la fecha: con 1 día casa el jueves con el miércoles.' },
  { pregunta: 'Tienes un pago de 100,00 en tesorería y tres cargos de 100,00 iguales en el extracto. La operación tiene «Primer registro». ¿Qué pasa?', opciones: ['No concilia ninguno', 'Concilia el movimiento con el primer cargo que encuentra', 'Concilia los tres', 'Suma los tres cargos'], correcta: 1, explicacion: 'Con «Primer registro», si hay varias líneas iguales se queda con la primera; las otras siguen pendientes.' },
  { pregunta: 'En la comisión por transferencia del banco propio está informada la «Operación comisión». ¿Qué genera cada pago?', opciones: ['Un movimiento con dos flujos', 'Dos movimientos de tesorería: el importe y la comisión', 'Un asiento sin tesorería', 'Nada: la comisión la pone el extracto'], correcta: 1, explicacion: 'Con «Operación comisión» informada, la comisión va aparte: dos movimientos de tesorería: uno por el importe y otro solo por la comisión.' },
  { pregunta: 'Al cargar un extracto N43 da error porque un concepto no está en la tabla. ¿Qué falta?', opciones: ['El concepto propio del banco en Conceptos propios', 'Un flujo financiero', 'El numerador de cheques', 'La fecha de vencimiento de la cuenta'], correcta: 0, explicacion: 'Cada banco trae sus conceptos propios en el fichero: tienen que estar dados de alta en Conceptos propios para que la carga no falle.' },
  { pregunta: 'En el extracto hay un cargo de 42,35 y su extorno de +42,35. ¿Qué haces?', opciones: ['Generar un movimiento por cada uno', 'Seleccionar los dos y «Cancelar extractos»', 'Conciliarlos con un cobro', 'Borrar el extracto'], correcta: 1, explicacion: 'Un cargo y su extorno del mismo importe se anulan: se cancelan entre ellos desde el extracto, sin pasar por tesorería.' },
  { pregunta: 'El banco cobra una comisión que no está en tesorería. ¿Qué botón de la conciliación individual la crea y la deja conciliada?', opciones: ['Conciliar', 'Generar', 'Cancelar extractos', 'Desconciliar'], correcta: 1, explicacion: '«Generar» crea el movimiento de tesorería con la operación y el flujo de comisión que elijas, ya conciliado con la línea.' },
  { pregunta: 'Una factura está en cartera y no se mandó a tesorería, pero el pago ya sale en el extracto. ¿Qué usas?', opciones: ['Conciliar efectos', 'Cancelar extractos', 'Nueva carga', 'Parámetros de tesorería'], correcta: 0, explicacion: 'Con «Conciliar efectos» eliges el efecto y la línea del extracto: genera la gestión y el movimiento de tesorería ya conciliado.' },
  { pregunta: 'Quieres que la conciliación automática integre el concepto propio 313 «Intereses, comisiones y custodia». ¿Qué necesita?', opciones: ['Nada, lo hace siempre', 'Que el concepto propio tenga una operación financiera (de salida) configurada', 'Que la cuenta sea de ahorro', 'Un asiento manual previo'], correcta: 1, explicacion: 'Sin operación enlazada al concepto propio, la línea no tiene pareja; con una operación de salida configurada, el proceso crea el movimiento y concilia.' },
  { pregunta: 'En Conceptos propios, ¿qué hace el tipo de conciliación «por día»?', opciones: ['Concilia cada línea por separado', 'Suma las líneas del mismo concepto del día y genera un solo movimiento', 'Solo concilia los lunes', 'Cambia la fecha valor'], correcta: 1, explicacion: '«Individual» va línea a línea; «por día» junta, por ejemplo, cinco salidas de 100 con el mismo concepto en un solo movimiento de 500.' },
  { pregunta: '¿Qué estructura tiene un fichero de extracto norma 43?', opciones: ['Cabecera con la cuenta, los movimientos en medio y al final los saldos', 'Solo los asientos contables del mes', 'Solo las remesas de cobro y pago', 'El balance de la empresa'], correcta: 0, explicacion: 'El encabezado da la cuenta, las transacciones van en medio y al final están los saldos; al cargarlo se validan las fechas y que el saldo inicial siga al final del extracto anterior.' },
  { pregunta: '¿Para qué sirven los conceptos comunes?', opciones: ['Son códigos estándar de operaciones bancarias que ayudan a identificar un movimiento del extracto como entrada o salida', 'Son los códigos que trae cada banco en su fichero', 'Son los flujos financieros', 'Son las comisiones de la cuenta'], correcta: 0, explicacion: 'Los conceptos comunes son la codificación estándar de la banca española; los propios son los de cada banco.' },
  { pregunta: 'Quieres mandar a tesorería un solo efecto pendiente, sin remesa. ¿Qué haces?', opciones: ['Evolucionar el estado del efecto con la acción «Pago a tesorería» (PTES)', 'Cargar el extracto y cancelarlo', 'Contabilizar otra vez la factura', 'Darlo de alta en Conceptos propios'], correcta: 0, explicacion: 'Desde el efecto, «Evolucionar estado» con una acción que genera tesorería: el efecto pasa a Ordenado y nace el movimiento, según el enlace contable de cartera.' },
  { pregunta: 'Contabilizas un pago por tesorería a un proveedor con su comisión. ¿Qué cuenta va al Haber?', opciones: ['40000 Proveedores', '62600 Servicios bancarios', '57200 Bancos', '43000 Clientes'], correcta: 2, explicacion: 'El banco (la cuenta contable de la cuenta financiera) baja por el Haber; el proveedor y la comisión van al Debe.' },
];

/* Preguntas sacadas del vídeo tutorial de compras (guiones v2, capítulos 1 a 10) */
const VIDEO: (Pregunta & { cap: number; t: number })[] = [
  { cap: 1, t: 293, pregunta: 'En Gestión › Compras › Maestros, ¿qué encuentras?', opciones: ['Proveedores y artículos', 'Tarifas, Documentos y Rápeles de compras', 'Asientos y diarios', 'Bancos propios'], correcta: 1, explicacion: 'Proveedores y artículos están en Gestión › Maestros; en Compras › Maestros están Tarifas, Documentos y Rápeles.' },
  { cap: 1, t: 201, pregunta: 'No recuerdas dónde está una pantalla. ¿Qué es lo más rápido?', opciones: ['Recorrer todo el menú', 'El buscador «Buscar ⌘K» de la barra superior', 'Preguntar a soporte', 'Abrir el Docflow'], correcta: 1, explicacion: 'Al escribir, por ejemplo, «Proveedores», el buscador lista las pantallas que coinciden.' },
  { cap: 2, t: 284, pregunta: 'Acabas de dar de alta un tercero. ¿En qué estado nace?', opciones: ['Validado', 'Provisional', 'Activo', 'Bloqueado'], correcta: 1, explicacion: 'Nace Provisional; con el botón verde «Validar» pasa a Validado.' },
  { cap: 2, t: 342, pregunta: 'Quieres crear el proveedor y su tercero no aparece en el desplegable. ¿Qué pasa?', opciones: ['Falta la divisa', 'El tercero no está validado', 'Falta el grupo de precio', 'El artículo no existe'], correcta: 1, explicacion: 'Solo se puede elegir un tercero validado: valídalo antes de crear el proveedor.' },
  { cap: 2, t: 284, pregunta: '¿Dónde se pone la forma de pago del proveedor?', opciones: ['En la ficha del proveedor, pestaña Tarifas', 'En el tercero, pestaña Condiciones de pago', 'En el pedido', 'En la lista de precios'], correcta: 1, explicacion: 'Tipo de efecto y plazo de pago van en las Condiciones de pago del tercero, no en el proveedor.' },
  { cap: 2, t: 342, pregunta: 'Guardas un proveedor nuevo. ¿Qué estado tiene?', opciones: ['Provisional, hay que validarlo', 'Activo, sin validación aparte', 'Pendiente de autorizar', 'Validado por el tercero'], correcta: 1, explicacion: 'Al guardarlo queda Activo; no hay un paso de validación propio.' },
  { cap: 2, t: 143, pregunta: 'Al dar de alta el tercero, el Tipo ID fiscal…', opciones: ['Se rellena solo con el país', 'Hay que elegirlo, por ejemplo «NIF-Empresa»', 'No hace falta', 'Lo pone el proveedor'], correcta: 1, explicacion: 'Es obligatorio y no se rellena solo: se elige en el desplegable.' },
  { cap: 2, t: 440, pregunta: '¿Por qué el artículo 13500620 sí contabiliza en la demo?', opciones: ['Porque es de la familia 01', 'Porque su tipo contable es PRODUCTO (PROD), que tiene cuentas', 'Porque tiene stock', 'Porque su precio es 4,00'], correcta: 1, explicacion: 'El tipo contable decide las cuentas; PROD las tiene definidas.' },
  { cap: 3, t: 57, pregunta: 'Una línea de lista de precios tiene precio 4,00 y descuento 1 del 10 %. ¿Qué precio neto sale?', opciones: ['4,40', '3,60', '3,96', '0,40'], correcta: 1, explicacion: '4,00 menos el 10 % = 3,60.' },
  { cap: 3, t: 221, pregunta: 'El proveedor tiene el grupo de precio 00001. ¿De dónde saca el precio?', opciones: ['Del último pedido', 'De la lista que indica el grupo (por ejemplo COM)', 'Del artículo directamente', 'De la factura anterior'], correcta: 1, explicacion: 'El grupo ordena qué listas aplican (Orden, Condición, Divisa, Lista precio); el 00001 apunta a COM.' },
  { cap: 3, t: 167, pregunta: 'Una línea de la lista tiene Fecha fin de ayer. ¿Qué pasa con ese precio?', opciones: ['Sigue valiendo', 'Ya no está vigente', 'Se aplica a la mitad', 'Pasa a la lista siguiente'], correcta: 1, explicacion: 'Cada línea vale entre su Fecha inicio y su Fecha fin.' },
  { cap: 4, t: 157, pregunta: 'El numerador tiene rotura #e#s. ¿Qué significa?', opciones: ['Un contador por año', 'Un contador por empresa y serie, sin año', 'Un único contador para todo', 'Un contador por proveedor'], correcta: 1, explicacion: 'La rotura decide cuándo se reinicia la cuenta: #e#s separa por empresa y serie.' },
  { cap: 4, t: 606, pregunta: '¿Dónde dices que un pedido PC genera albaranes del tipo ACPC?', opciones: ['En el numerador', 'En el tipo de pedido, caja Logística, campo «Tipo de albarán»', 'En la ficha del proveedor', 'En el albarán'], correcta: 1, explicacion: 'El tipo de documento es la plantilla: PC trae ACPC y ACPC trae FCOA.' },
  { cap: 4, t: 384, pregunta: 'Una factura de compra muestra 0FC000009 y FC026-000001. ¿Por qué dos números?', opciones: ['Es un error', 'Uno es el del documento y el otro el de la serie fiscal', 'Uno es el del proveedor y otro el nuestro', 'Uno es el del asiento'], correcta: 1, explicacion: 'El numerador de gestión da el número del documento; la serie fiscal da el número para Hacienda.' },
  { cap: 4, t: 202, pregunta: '¿Para qué sirve el control cronológico de una serie?', opciones: ['Para ordenar alfabéticamente', 'Para que un número no lleve fecha anterior al último', 'Para bloquear el proveedor', 'Para calcular el IVA'], correcta: 1, explicacion: 'Asegura que números y fechas van en orden, algo que Hacienda exige en las facturas emitidas.' },
  { cap: 5, t: 631, pregunta: 'Validas un pedido. ¿Qué Situación muestra?', opciones: ['Servido', 'Sigue Pendiente hasta que llega la mercancía', 'Facturado', 'Contabilizado'], correcta: 1, explicacion: 'Validar no lo sirve: queda Pendiente hasta generar sus albaranes.' },
  { cap: 6, t: 133, pregunta: 'En «Generación de albaranes con origen pedidos» marcas el pedido y pulsas «Generar albaranes». Sale «No se ha seleccionado ninguna línea de pedido». ¿Qué falta?', opciones: ['Validar el proveedor', 'Marcar también la línea del pedido', 'Contabilizar el pedido', 'Cambiar de almacén'], correcta: 1, explicacion: 'Hay que marcar la casilla del pedido y la de su línea.' },
  { cap: 6, t: 285, pregunta: 'Recibes solo parte de lo pedido. ¿Cómo queda el pedido?', opciones: ['Servido', 'Parcial', 'Anulado', 'Pendiente de factura'], correcta: 1, explicacion: 'Pasa a Parcial si quedan líneas por servir y a Servido cuando llega todo.' },
  { cap: 6, t: 403, pregunta: 'Al contabilizar marcas «Prevista de Asiento Contable». ¿Qué ocurre?', opciones: ['Contabiliza dos veces', 'Te enseña el esquema del asiento sin contabilizar', 'Contabiliza en provisional', 'Envía el asiento al banco'], correcta: 1, explicacion: 'Es una vista previa: muestra cuentas, Debe y Haber sin grabar nada.' },
  { cap: 7, t: 103, pregunta: 'En el albarán, Acciones › «Generar factura». ¿Qué te pide?', opciones: ['Proveedor y almacén', 'Fecha factura, Factura proveedor e Importe factura', 'Cuenta contable', 'Nada, la crea sola'], correcta: 1, explicacion: 'Pide la fecha, el número que da el proveedor y el importe de su factura.' },
  { cap: 7, t: 256, pregunta: 'El Importe factura que tecleas no coincide con el total calculado. ¿Qué hace el programa?', opciones: ['Bloquea la factura', 'No bloquea: tienes que revisarlo tú (informe de diferencias con albarán)', 'Corrige el albarán', 'Cambia el IVA'], correcta: 1, explicacion: 'Sin tolerancias en el tipo FCOA no bloquea; la comprobación es tuya y la ayuda el informe gcomfach_dif_albaran.' },
  { cap: 8, t: 275, pregunta: 'Contabilizas la factura y la ventana muestra un asiento de dos líneas 60000 / 40090. ¿Qué pasa?', opciones: ['La factura está mal', 'La ventana enseña el asiento del albarán: abre el de la factura desde ⌄ › Asientos contables', 'Falta el IVA en el tipo', 'Hay que descontabilizar'], correcta: 1, explicacion: 'Es una trampa de la pantalla: el asiento bueno de la factura tiene cinco líneas.' },
  { cap: 8, t: 327, pregunta: 'Base 40,00 e IVA 21 %, con el albarán ya contabilizado. ¿Cuánto suma el Debe del asiento de la factura?', opciones: ['48,40', '88,40', '40,00', '8,40'], correcta: 1, explicacion: '47200 8,40 + 60000 40,00 + 40090 40,00 = 88,40, igual que el Haber (40000 48,40 + 60000 40,00).' },
  { cap: 9, t: 235, pregunta: 'En el Docflow, ¿qué indica la caja con el borde naranja?', opciones: ['Un documento con error', 'El documento desde el que lo has abierto', 'El documento más antiguo', 'Un documento anulado'], correcta: 1, explicacion: 'El borde naranja marca dónde estás; el resto de cajas son los documentos enlazados.' },
  { cap: 9, t: 189, pregunta: 'En el Docflow de compras, ¿qué son los «Suministros»?', opciones: ['Los pedidos', 'Los albaranes', 'Las facturas', 'Los pagos'], correcta: 1, explicacion: 'Suministros es la tabla de albaranes: Pedidos compras · Suministros · Facturas compras.' },
  { cap: 10, t: 127, pregunta: 'Antes de contabilizar una factura de compra, ¿qué buena práctica repasa el vídeo?', opciones: ['Contabilizar primero y revisar después', 'Comprobar que el albarán coincide con lo recibido y la factura con el albarán: base, IVA y total', 'Pedir la factura de nuevo al proveedor', 'Borrar el albarán para que no se duplique'], correcta: 1, explicacion: 'Un error detectado antes de contabilizar es mucho más fácil de corregir.' },
  { cap: 10, t: 100, pregunta: 'Según las ideas clave del vídeo, ¿qué confirma el albarán?', opciones: ['Lo que hay que pagar', 'Lo que ha llegado', 'El precio de la tarifa', 'El asiento de la factura'], correcta: 1, explicacion: 'El albarán confirma lo que llega; la factura, lo que se debe pagar.' },
  { cap: 10, t: 84, pregunta: 'Te pierdes y no sabes en qué punto está una compra. ¿Qué ayuda te dibuja el camino pedido, albarán y factura?', opciones: ['Sumas y saldos', 'El Docflow', 'El numerador', 'La lista de precios'], correcta: 1, explicacion: 'Docflow enseña el camino; el buscador te lleva a cualquier pantalla y el menú lateral te dice dónde está cada cosa.' },
];

/* Preguntas de los tests que solo tienen sentido dentro de su ejercicio (números de asiento,
   documentos o importes concretos de la práctica): fuera del examen final */
const DE_CONTEXTO = /\basientos? \d|\b0[A-Z]{2}0000\d{2}\b|FVN0|apuntes del EA-DOC|periodo 11|copia de diciembre|llevan las copias|tres copias|62902(\.00000)? en 2026|extracto de la 62902|este ejercicio|del ejercicio\?|del ejemplo|lista del campo|Justificación 6|plazo de pago \{INI\}1|importe neto de 2,50/i;
const apta = (q: Pregunta) => !DE_CONTEXTO.test(q.pregunta);

/* Circuitos del vídeo para ordenar (salen de las escenas de cada capítulo) */
const CIRCUITOS_VIDEO: { cap: number; pregunta: string; pasos: string[]; explicacion: string }[] = [
  {
    cap: 10,
    pregunta: 'Ordena el circuito de compra que repasa el vídeo, de los datos de base al asiento.',
    pasos: ['Alta del tercero y validarlo', 'Alta del proveedor', 'Pedido de compra', 'Albarán de compra', 'Factura del proveedor', 'Asiento contable'],
    explicacion: 'Primero los datos de base; después cada documento nace del anterior y, al final, contabilizar deja la compra anotada.',
  },
  {
    cap: 6,
    pregunta: 'Ha llegado la mercancía. Ordena los pasos para recibirla como en el vídeo.',
    pasos: ['Abre «Generación de albaranes con origen pedidos»', 'Filtra por tipo de pedido y proveedor', 'Marca el pedido y su línea', 'Pulsa «Generar albaranes»', 'Valida el albarán', 'Contabiliza el albarán'],
    explicacion: 'El albarán nace del pedido: filtras, marcas pedido y línea, generas, validas y contabilizas.',
  },
  {
    cap: 7,
    pregunta: 'Llega la factura del proveedor. Ordena los pasos como en el vídeo.',
    pasos: ['En el albarán, Acciones › «Generar factura»', 'Escribe fecha, factura proveedor e importe', 'Abre la factura creada', 'Compara el importe declarado con el calculado', 'Valida la factura', 'Contabilízala y busca su asiento'],
    explicacion: 'La factura nace del albarán; antes de validarla compruebas que el importe declarado cuadra.',
  },
];

/* Circuito de tesorería para ordenar (no sale del vídeo de compras: lleva su propio origen) */
const CIRCUITO_TESORERIA = {
  origen: 'tesoreria',
  pregunta: 'Ordena el circuito de tesorería, de la cartera a la conciliación.',
  pasos: ['Contabilizar la factura: nace el efecto en cartera', 'Remesar el efecto y evolucionar el estado', 'Se genera el movimiento de tesorería', 'Cargar el extracto N43 del banco', 'Conciliar el extracto con la tesorería'],
  explicacion: 'Del mundo de cobros y pagos (efecto, remesa, tesorería) al del banco (extracto) y, en medio, la conciliación.',
};

/* Parejas para relacionar */
const RELACIONES: { origen: string; pregunta: string; titulos: [string, string]; pares: [string, string][]; explicacion: string }[] = [
  {
    origen: 'asientos',
    pregunta: 'Une cada cuenta con lo que recoge.',
    titulos: ['Cuenta', 'Qué recoge'],
    pares: [
      ['40000', 'Proveedores'],
      ['40090', 'Compras pendiente de factura'],
      ['47200', 'IVA soportado'],
      ['47000', 'IVA repercutido'],
      ['43000', 'Clientes'],
      ['57200', 'Bancos'],
      ['70000', 'Ventas'],
      ['60000', 'Compras'],
    ],
    explicacion: 'Son las cuentas del circuito: compras (60000, 40090, 47200, 40000), ventas (43000, 47000, 70000) y tesorería (57200).',
  },
  {
    origen: 'compras',
    pregunta: 'Une cada tipo de documento con lo que es.',
    titulos: ['Tipo', 'Documento'],
    pares: [
      ['PC', 'Pedido de compra'],
      ['ACPC', 'Albarán de compra'],
      ['FCOA', 'Factura de compra'],
      ['COBD', 'Cobro directo de un efecto'],
      ['EA', 'Diario de asientos manuales'],
    ],
    explicacion: 'El tipo PC trae albaranes ACPC y estos facturas FCOA; COBD cobra un efecto suelto y EA es el diario del asiento manual.',
  },
  {
    origen: 'carteras',
    pregunta: 'Une cada estado del efecto con su momento.',
    titulos: ['Estado', 'Cuándo'],
    pares: [
      ['PE Pendiente', 'Nace al contabilizar la factura'],
      ['PR Propuesto', 'Lo agregas a una remesa'],
      ['CO Cobrado', 'Lo cobras con COBD o con la remesa'],
      ['DV Devuelto', 'El banco lo devuelve impagado'],
    ],
    explicacion: 'El efecto nace en el estado de la condición de cobro (PE) y en la remesa recorre PE › PR › OC › CO.',
  },
  {
    origen: 'compras',
    pregunta: 'Une cada situación del pedido con lo que ha pasado.',
    titulos: ['Situación', 'Qué ha pasado'],
    pares: [
      ['Pendiente', 'Validado, sin mercancía recibida'],
      ['Parcial', 'Han llegado algunas líneas'],
      ['Servido', 'Ha llegado todo lo pedido'],
    ],
    explicacion: 'Validar no sirve el pedido: pasa a Parcial o a Servido al generar sus albaranes.',
  },
  {
    origen: 'tesoreria',
    pregunta: 'Une cada concepto de tesorería con la pantalla donde se configura o se trabaja.',
    titulos: ['Concepto', 'Pantalla'],
    pares: [
      ['Cuenta financiera, IBAN y formato de extracto', 'Bancos propios'],
      ['Posición, interface y parámetros de conciliación', 'Operaciones financieras'],
      ['Tipo de flujo y cuenta contable', 'Flujos financieros'],
      ['Códigos del banco en el fichero N43', 'Conceptos propios'],
      ['Emparejar extracto y movimientos', 'Conciliación individual'],
    ],
    explicacion: 'Bancos propios, operaciones y flujos montan el movimiento; los conceptos propios traducen el extracto, y la conciliación los une.',
  },
];

/* Pasos de los manuales con captura y zona marcada que sirven para «¿dónde harías clic?» */
function pasosClic(moduloId: string) {
  const m = MODULOS.find((x) => x.id === moduloId);
  if (!m) return [];
  const out: { pantalla: string; texto: string; imagen: string; zona: { x: number; y: number; w: number; h: number }; etiqueta: string; detalle?: string }[] = [];
  for (const e of m.ejercicios)
    for (const s of e.secciones)
      for (const p of s.pasos) {
        const h = p.hotspot;
        if (!p.imagen || !h || !Number.isFinite(h.x + h.y + h.w + h.h)) continue;
        const area = h.w * h.h;
        if (area < 8 || area > 320 || h.w < 2 || h.h < 2) continue;
        if (p.texto.length > 160 || /^Abre la ruta\.?$/.test(p.texto.trim())) continue;
        const et = h.etiqueta.trim();
        if (et.length < 3 || /^[\d\s.,:/-]+$/.test(et) || /\d{2}-\d{2}-\d{4}/.test(et)) continue;
        // Chips de filtro de una lista («Diario Está en la lista EA»): no son un sitio donde se hace clic
        if (/\b(est[áa] en la lista|es igual a|contiene|mayor que|menor que|entre)\b/i.test(et)) continue;
        out.push({ pantalla: s.titulo, texto: p.texto, imagen: p.imagen, zona: { x: h.x, y: h.y, w: h.w, h: h.h }, etiqueta: h.etiqueta, detalle: p.detalle });
      }
  return out;
}

/** Preguntas de completar un dato: los números salen de la semilla */
function generarDatos(r: ReturnType<typeof rng>): { importe: PreguntaDato[]; cuenta: PreguntaDato[] } {
  const cent = () => r.pick([0, 0.25, 0.5, 0.75, 0.2, 0.4]);
  const b1 = redondea(r.int(24, 640) + cent());
  const iva1 = redondea(b1 * IVA);
  const b2 = redondea(r.int(30, 900) + cent());
  const iva2 = redondea(b2 * IVA);
  const t3 = redondea(r.int(100, 1500) + cent());
  const ef = redondea(t3 * 0.4);
  const q = r.int(3, 20);
  const pr = redondea(r.int(8, 60) * 0.25 + 2);
  const neto = redondea(q * pr * 0.9);
  const importe: PreguntaDato[] = [
    { tipo: 'dato', formato: 'importe', origen: 'compras', pregunta: 'La factura del proveedor tiene esta base. ¿Cuál es el total de la factura?', datos: [{ k: 'Base imponible', v: `${p2(b1)} €` }, { k: 'IVA', v: '21 %' }], esperado: redondea(b1 + iva1), placeholder: '0,00', explicacion: `IVA: ${p2(b1)} × 21 % = ${p2(iva1)}. Total: ${p2(b1)} + ${p2(iva1)} = ${p2(redondea(b1 + iva1))}.` },
    { tipo: 'dato', formato: 'importe', origen: 'ventas', pregunta: 'Facturas a un cliente esta base. ¿Qué cuota de IVA va al Haber de la 47000?', datos: [{ k: 'Base imponible', v: `${p2(b2)} €` }, { k: 'IVA', v: '21 %' }], esperado: iva2, placeholder: '0,00', explicacion: `${p2(b2)} × 21 % = ${p2(iva2)}, redondeado a dos decimales.` },
    { tipo: 'dato', formato: 'importe', origen: 'carteras', pregunta: 'La factura vence en tres plazos, a 40, 80 y 120 días, con el 40 %, el 20 % y el 40 %. ¿De cuánto es el primer efecto?', datos: [{ k: 'Total factura', v: `${p2(t3)} €` }], esperado: ef, placeholder: '0,00', explicacion: `Cada efecto lleva su porcentaje del total: 40 % de ${p2(t3)} = ${p2(ef)}.` },
    { tipo: 'dato', formato: 'importe', origen: 'maestros', pregunta: 'La lista de precios da este precio con un descuento 1 del 10 %. ¿Cuál es el importe neto de la línea?', datos: [{ k: 'Cantidad', v: `${q} UNI` }, { k: 'Precio', v: `${p2(pr)} €` }, { k: 'Descuento 1', v: '10 %' }], esperado: neto, placeholder: '0,00', explicacion: `${q} × ${p2(pr)} = ${p2(redondea(q * pr))}; menos el 10 %: ${p2(neto)}.` },
  ];
  const pago = redondea(r.int(300, 2400) + cent());
  const comi = r.pick([2.5, 3.5, 4.75, 6]);
  importe.push({
    tipo: 'dato',
    formato: 'importe',
    origen: 'tesoreria',
    pregunta: 'Pagas por transferencia con la comisión en su propio flujo. ¿Qué importe sale del banco (Haber de la 57200)?',
    datos: [{ k: 'Pago al proveedor', v: `${p2(pago)} €` }, { k: 'Comisión', v: `${p2(comi)} €` }],
    esperado: redondea(pago + comi),
    placeholder: '0,00',
    explicacion: `Del banco sale el pago más la comisión: ${p2(pago)} + ${p2(comi)} = ${p2(redondea(pago + comi))}.`,
  });
  const cuenta: PreguntaDato[] = [
    { tipo: 'dato', formato: 'cuenta', origen: 'compras', pregunta: 'Contabilizas el albarán de compra. ¿Qué cuenta va al Haber?', esperado: '40090', placeholder: '00000', explicacion: 'El albarán lleva la 60000 al Debe contra la 40090 Compras pendiente de factura.' },
    { tipo: 'dato', formato: 'cuenta', origen: 'ventas', pregunta: 'Contabilizas una factura de venta. ¿En qué cuenta va el IVA repercutido?', esperado: '47000', placeholder: '00000', explicacion: 'La factura de venta lleva 43000 al Debe y 47000 y 70000 al Haber.' },
    { tipo: 'dato', formato: 'cuenta', origen: 'carteras', pregunta: 'Cobras un efecto por banco con COBD. ¿Qué cuenta va al Debe?', esperado: '57200', placeholder: '00000', explicacion: 'El cobro lleva Bancos 57200 al Debe y Clientes 43000 al Haber.' },
    { tipo: 'dato', formato: 'cuenta', origen: 'parametrizacion', pregunta: 'Registras una factura de compra con IVA. ¿En qué cuenta va el IVA soportado?', esperado: '47200', placeholder: '00000', explicacion: 'El IVA de las compras va al Debe de la 47200.' },
  ];
  cuenta.push({ tipo: 'dato', formato: 'cuenta', origen: 'tesoreria', pregunta: 'El flujo de comisión de un movimiento de tesorería lleva la cuenta de servicios bancarios. ¿Cuál es?', esperado: '62600', placeholder: '00000', explicacion: 'Las comisiones bancarias van a la 62600 Servicios bancarios y similares, al Debe, contra el banco 57200.' });
  return { importe, cuenta };
}

const desordena = (r: ReturnType<typeof rng>, n: number) => {
  // nunca deja la solución tal cual
  for (let k = 0; k < 8; k++) {
    const o = r.shuffle([...Array(n).keys()]);
    if (o.some((x, i) => x !== i)) return o;
  }
  return [...Array(n).keys()].reverse();
};

export function generarTeoria(codigo: string): PreguntaExamen[] {
  const ini = iniDeCodigo(codigo);
  const r = rng(hash32(`${codigo}|teoria`));
  const elegidas: PreguntaExamen[] = [];

  // 1 test y 1 clic por módulo (tesorería va aparte, en su propio cupo)
  for (const m of MODULOS.filter((x) => x.id !== 'tesoreria')) {
    const tests = r.shuffle(m.ejercicios.flatMap((e) => e.test).filter(apta));
    if (tests[0]) elegidas.push({ ...tests[0], origen: m.id });
    const pasos = pasosClic(m.id);
    if (pasos.length) {
      const p = r.pick(pasos);
      elegidas.push({
        tipo: 'clic',
        origen: m.id,
        modulo: m.id,
        pantalla: p.pantalla,
        pregunta: `¿Dónde tocas «${p.etiqueta.replace(/\s*\(.*?\)\s*/g, ' ').replace(/\s+Es igual a.*$/i, '').trim()}»?`,
        paso: p.texto,
        imagen: p.imagen,
        zona: p.zona,
        etiqueta: p.etiqueta,
        explicacion: `Es «${p.etiqueta}».${p.detalle ? ` ${p.detalle}` : ''}`,
      });
    }
  }

  // 1 pregunta por capítulo del vídeo (si hay más capítulos que cupo, se sortean)
  const todosCaps = Array.from(new Set(VIDEO.map((v) => v.cap)));
  const caps = r.shuffle(todosCaps).slice(0, REPARTO.video).sort((a, b) => a - b);
  for (const c of caps) {
    const { cap, t, ...q } = r.pick(VIDEO.filter((v) => v.cap === c));
    elegidas.push({ ...q, origen: `vídeo cap. ${cap}`, video: { cap, t } });
  }

  // Ordenar: un circuito del vídeo y otro de un manual
  const cvs = [...CIRCUITOS_VIDEO.map((c) => ({ origen: `vídeo cap. ${c.cap}`, pregunta: c.pregunta, pasos: c.pasos, explicacion: c.explicacion })), CIRCUITO_TESORERIA];
  const cv = r.pick(cvs);
  const mods = MODULOS.filter((m) => !esFinanzas(m.id) && m.circuito.length >= 4 && m.circuito.length <= 7);
  const cm = r.pick(mods);
  // En la versión nueva del ERP no hay paso «Conformar»: no se pide ordenarlo.
  const pasosCm = cm.circuito.filter((x) => !/conformar/i.test(x));
  for (const c of [
    cv,
    { origen: cm.id, pregunta: `Ordena el circuito de ${(META_CORTO[cm.id] ?? cm.titulo).toLowerCase()} que has practicado en el manual.`, pasos: pasosCm, explicacion: `El orden del manual: ${pasosCm.join(' › ')}.` },
  ].slice(0, REPARTO.orden)) {
    const orden = desordena(r, c.pasos.length);
    elegidas.push({ tipo: 'orden', origen: c.origen, pregunta: c.pregunta, explicacion: c.explicacion, items: orden.map((k) => c.pasos[k]), solucion: c.pasos.map((_, k) => orden.indexOf(k)) });
  }

  // Relacionar: dos juegos distintos de cuatro parejas (o menos si el juego es corto)
  const rels: typeof RELACIONES = [];
  for (const rel of r.shuffle(RELACIONES)) if (rels.length < REPARTO.relacion && !rels.some((x) => x.origen === rel.origen)) rels.push(rel);
  for (const rel of rels) {
    const pares = r.shuffle(rel.pares).slice(0, 4);
    const orden = desordena(r, pares.length);
    elegidas.push({
      tipo: 'relacion',
      origen: rel.origen,
      pregunta: rel.pregunta,
      titulos: rel.titulos,
      explicacion: rel.explicacion,
      izquierda: pares.map((p) => p[0]),
      derecha: orden.map((k) => pares[k][1]),
      solucion: pares.map((_, k) => orden.indexOf(k)),
    });
  }

  // Completar un dato: un importe y una cuenta
  const datos = generarDatos(r);
  elegidas.push(r.pick(datos.importe));
  if (REPARTO.dato > 1) elegidas.push(r.pick(datos.cuenta));

  // Criterio y, si algún banco se queda corto, más tests
  for (const q of r.shuffle(CRITERIO).slice(0, REPARTO.criterio)) elegidas.push({ ...q, origen: 'criterio' });

  // Tesorería: un «¿dónde harías clic?» de su manual (si tiene capturas marcadas) y el resto, test de su banco y de sus ejercicios
  const modTes = MODULOS.find((m) => m.id === 'tesoreria');
  const pasosTes = pasosClic('tesoreria');
  let cupoTes = REPARTO.tesoreria;
  if (pasosTes.length && cupoTes > 1) {
    const p = r.pick(pasosTes);
    elegidas.push({
      tipo: 'clic',
      origen: 'tesoreria',
      modulo: 'tesoreria',
      pantalla: p.pantalla,
      pregunta: `¿Dónde tocas «${p.etiqueta.replace(/\s*\(.*?\)\s*/g, ' ').replace(/\s+Es igual a.*$/i, '').trim()}»?`,
      paso: p.texto,
      imagen: p.imagen,
      zona: p.zona,
      etiqueta: p.etiqueta,
      explicacion: `Es «${p.etiqueta}».${p.detalle ? ` ${p.detalle}` : ''}`,
    });
    cupoTes--;
  }
  const bancoTes = r.shuffle([...TESORERIA, ...(modTes?.ejercicios.flatMap((e) => e.test).filter(apta) ?? [])]);
  for (const q of bancoTes) {
    if (cupoTes <= 0) break;
    if (elegidas.some((e) => e.pregunta === q.pregunta)) continue;
    elegidas.push({ ...q, origen: 'tesoreria' });
    cupoTes--;
  }
  const resto = r.shuffle(MODULOS.flatMap((m) => m.ejercicios.flatMap((e) => e.test).filter(apta).map((q) => ({ ...q, origen: m.id }))));
  while (elegidas.length < NUM_TEORIA && resto.length) {
    const q = resto.shift()!;
    if (!elegidas.some((e) => e.pregunta === q.pregunta)) elegidas.push(q);
  }

  // Reparte cada tipo a lo largo del examen (que no se amontonen los clics o los ordenar)
  const porTipo = new Map<string, number>();
  const clave = (q: PreguntaExamen) => (esTest(q) ? (q.video ? 'video' : 'test') : q.tipo);
  for (const q of elegidas) porTipo.set(clave(q), (porTipo.get(clave(q)) ?? 0) + 1);
  const visto = new Map<string, number>();
  const repartidas = r
    .shuffle(elegidas)
    .map((q) => {
      const c = clave(q);
      const k = visto.get(c) ?? 0;
      visto.set(c, k + 1);
      return { q, pos: (k + 0.15 + r.next() * 0.7) / porTipo.get(c)! };
    })
    .sort((a, b) => a.pos - b.pos)
    .map((x) => x.q);

  return repartidas.map((q): PreguntaExamen => {
    const base = { pregunta: conIni(q.pregunta, ini), explicacion: conIni(q.explicacion, ini) };
    if (!esTest(q)) {
      if (q.tipo === 'orden') return { ...q, ...base, items: q.items.map((x) => conIni(x, ini)) };
      if (q.tipo === 'relacion') return { ...q, ...base, izquierda: q.izquierda.map((x) => conIni(x, ini)), derecha: q.derecha.map((x) => conIni(x, ini)) };
      if (q.tipo === 'clic') return { ...q, ...base, pantalla: conIni(q.pantalla, ini), etiqueta: conIni(q.etiqueta, ini), paso: q.paso ? conIni(q.paso, ini) : undefined };
      return { ...q, ...base };
    }
    const orden = r.shuffle(q.opciones.map((_, i) => i));
    return {
      ...q,
      ...base,
      opciones: orden.map((i) => conIni(q.opciones[i], ini)),
      correcta: orden.indexOf(q.correcta),
    };
  });
}

const META_CORTO: Record<string, string> = Object.fromEntries(Object.entries(META).map(([k, v]) => [k, v.corto]));

/** ¿Ha contestado del todo? (las de ordenar y relacionar pueden quedarse a medias) */
export function respondida(q: PreguntaExamen, r: RespuestaTeoria | undefined): boolean {
  if (r === null || r === undefined) return false;
  switch (tipoDe(q)) {
    case 'test':
      return typeof r === 'number';
    case 'clic':
      return typeof r === 'object' && !Array.isArray(r);
    case 'orden':
      return Array.isArray(r) && r.length === (q as PreguntaOrden).items.length;
    case 'relacion':
      return Array.isArray(r) && r.length === (q as PreguntaRelacion).izquierda.length && r.every((x) => x >= 0);
    case 'dato':
      return typeof r === 'string' && r.trim() !== '';
  }
}

export function dentroDeZona(z: { x: number; y: number; w: number; h: number }, p: { x: number; y: number }, margen = MARGEN_CLIC) {
  return p.x >= z.x - margen && p.x <= z.x + z.w + margen && p.y >= z.y - margen && p.y <= z.y + z.h + margen;
}

/** Corrección de una pregunta de teoría (determinista, todo o nada) */
export function aciertaTeoria(q: PreguntaExamen, r: RespuestaTeoria | undefined): boolean {
  if (!respondida(q, r)) return false;
  if (esTest(q)) return r === q.correcta;
  switch (q.tipo) {
    case 'clic':
      return dentroDeZona(q.zona, r as { x: number; y: number });
    case 'orden':
    case 'relacion':
      return (r as number[]).every((x, i) => x === q.solucion[i]);
    case 'dato': {
      if (q.formato === 'importe') {
        const n = parseImporte(r as string);
        return n !== null && Math.abs(n - Number(q.esperado)) <= 0.011;
      }
      return normCuenta(r as string) === String(q.esperado);
    }
  }
}

/** Texto corto de la respuesta del alumno (revisión y acta) */
export function textoRespuesta(q: PreguntaExamen, r: RespuestaTeoria | undefined): string {
  if (r === null || r === undefined || (Array.isArray(r) && !r.length) || r === '') return 'sin responder';
  if (esTest(q)) return typeof r === 'number' ? q.opciones[r] ?? '—' : '—';
  switch (q.tipo) {
    case 'clic': {
      const p = r as { x: number; y: number };
      return `clic en ${Math.round(p.x)} %, ${Math.round(p.y)} %`;
    }
    case 'orden':
      return (r as number[]).map((k) => q.items[k]).join(' › ');
    case 'relacion':
      return (r as number[]).map((k, i) => `${q.izquierda[i]} = ${k >= 0 ? q.derecha[k] : '—'}`).join(' · ');
    case 'dato':
      return String(r);
  }
}

/** Texto de la respuesta correcta */
export function textoCorrecta(q: PreguntaExamen): string {
  if (esTest(q)) return q.opciones[q.correcta];
  switch (q.tipo) {
    case 'clic':
      return `«${q.etiqueta}»`;
    case 'orden':
      return q.solucion.map((k) => q.items[k]).join(' › ');
    case 'relacion':
      return q.solucion.map((k, i) => `${q.izquierda[i]} = ${q.derecha[k]}`).join(' · ');
    case 'dato':
      return typeof q.esperado === 'number' ? p2(q.esperado) : q.esperado;
  }
}

export const NOMBRE_TIPO: Record<TipoPregunta, string> = { test: 'Test', clic: '¿Dónde harías clic?', orden: 'Ordenar', relacion: 'Relacionar', dato: 'Completar el dato' };

export interface BloqueTeoria {
  clave: string;
  nombre: string;
  clase: 'modulo' | 'video' | 'criterio';
  aciertos: number;
  total: number;
}

/** Desglose de la teoría por módulo, capítulo del vídeo y criterio */
export function desgloseTeoria(teoria: PreguntaExamen[], resp: RespuestaTeoria[]): BloqueTeoria[] {
  const mapa = new Map<string, BloqueTeoria>();
  teoria.forEach((q, i) => {
    const vid = /^vídeo cap\. (\d+)/.exec(q.origen);
    const clave = vid ? `cap${vid[1].padStart(2, '0')}` : q.origen;
    const b = mapa.get(clave) ?? {
      clave,
      nombre: vid ? `Vídeo · cap. ${vid[1]}` : q.origen === 'criterio' ? 'Criterio' : META_CORTO[q.origen] ?? q.origen,
      clase: vid ? 'video' : q.origen === 'criterio' ? 'criterio' : 'modulo',
      aciertos: 0,
      total: 0,
    };
    b.total++;
    if (aciertaTeoria(q, resp[i])) b.aciertos++;
    mapa.set(clave, b);
  });
  const orden = (b: BloqueTeoria) => (b.clase === 'modulo' ? ORDEN_MOD.indexOf(b.clave) : b.clase === 'video' ? 100 + Number(b.clave.slice(3)) : 200);
  return [...mapa.values()].sort((a, b) => orden(a) - orden(b));
}
const ORDEN_MOD: string[] = [...ORDEN];

/* ---------------------------------------------------------------- corrección */

export function parseImporte(s: string): number | null {
  let t = (s ?? '').replace(/[\s€]/g, '');
  if (!t) return null;
  if (t.includes(',')) t = t.replace(/\./g, '').replace(',', '.');
  const n = Number(t);
  return Number.isFinite(n) ? n : null;
}

export function normCuenta(s: string) {
  return (s ?? '').replace(/[^0-9]/g, '').slice(0, 5);
}

const normTexto = (s: string) => (s ?? '').trim().toUpperCase().replace(/\s+/g, ' ');

export type Veredicto = 'ok' | 'mal' | 'formato' | 'vacio';

export function corregirCampo(c: CampoExamen, valor: string | undefined): Veredicto {
  const v = (valor ?? '').trim();
  if (!v) return 'vacio';
  switch (c.tipo) {
    case 'doc':
    case 'entero':
      return new RegExp(c.patron ?? '.+').test(v.toUpperCase()) ? 'ok' : 'formato';
    case 'importe': {
      const n = parseImporte(v);
      if (n === null) return 'formato';
      return Math.abs(n - Number(c.esperado)) <= 0.011 ? 'ok' : 'mal';
    }
    case 'cuenta':
      return normCuenta(v) === String(c.esperado) ? 'ok' : 'mal';
    default:
      return normTexto(v) === normTexto(String(c.esperado)) ? 'ok' : 'mal';
  }
}

/** Formato válido para un campo (sin mirar si es correcto) */
export function formatoValido(c: CampoExamen, valor: string) {
  const v = valor.trim();
  if (!v) return true;
  if (c.tipo === 'doc' || c.tipo === 'entero') return new RegExp(c.patron ?? '.+').test(v.toUpperCase());
  if (c.tipo === 'importe') return parseImporte(v) !== null;
  if (c.tipo === 'cuenta') return /^\d{5}(\.?\d{0,5})?$/.test(v.replace(/\s/g, ''));
  return true;
}

export interface Coherencia {
  id: string;
  texto: string;
  ok: boolean;
  puntos: number;
}

const igual = (s: string | undefined, n: number) => {
  const v = parseImporte(s ?? '');
  return v !== null && Math.abs(v - n) <= 0.011;
};

export function coherencia(caso: Caso, resp: Record<string, string>): Coherencia[] {
  const n = (k: string) => {
    const v = parseInt((resp[k] ?? '').trim(), 10);
    return Number.isFinite(v) ? v : null;
  };
  const docs = ['t2.num', 't3.num', 't4.num', 't6.oferta', 't6.pedido', 't6.albaran', 't6.factura'].map((k) => (resp[k] ?? '').trim().toUpperCase());
  const asientos = ['t3.asiento', 't4.asiento', 't6.asiento', 't7.asiento', 't8.asiento'].map(n);
  const sinRepetir = asientos.filter((x): x is number => x !== null);
  const a3 = n('t3.asiento');
  const a4 = n('t4.asiento');
  const a6 = n('t6.asiento');
  const a7 = n('t7.asiento');
  return [
    { id: 'cadena', texto: 'Has declarado la cadena completa de compras y de ventas, con el formato correcto', ok: docs.every((d, i) => d && new RegExp(['^0PC', '^0AC', '^0FC', '^0OV', '^0PV', '^0AV', '^0FV'][i] + '\\d{6}$').test(d)), puntos: 2 },
    { id: 'ref', texto: '«Referencia» del pedido y «Factura proveedor» llevan el código de examen', ok: normTexto(resp['t2.ref'] ?? '') === caso.codigo && normTexto(resp['t4.ref'] ?? '') === caso.codigo, puntos: 2 },
    { id: 'orden-compra', texto: 'El asiento de la factura de compra es posterior al del albarán', ok: a3 !== null && a4 !== null && a4 > a3, puntos: 2 },
    { id: 'orden-venta', texto: 'El asiento del cobro es posterior al de la factura de venta', ok: a6 !== null && a7 !== null && a7 > a6, puntos: 2 },
    { id: 'unicos', texto: 'Cada documento contable tiene su propio asiento (no repites números)', ok: sinRepetir.length === 5 && new Set(sinRepetir).size === 5, puntos: 2 },
    { id: 'cuadre', texto: 'Los importes de compra cuadran entre sí: pedido = albarán = base de la factura y efecto = total', ok: [resp['t2.neto'], resp['t3.neto'], resp['t4.base']].every((x) => igual(x, caso.compra.base)) && igual(resp['t5.importe'], caso.compra.total), puntos: 2 },
    { id: 'cuadre-venta', texto: 'Lo cobrado coincide con el total de la factura de venta', ok: igual(resp['t6.total'], caso.venta.total) && igual(resp['t7.importe'], caso.venta.total), puntos: 2 },
  ];
}

export interface DetalleTarea {
  id: string;
  titulo: string;
  puntos: number;
  max: number;
}

export interface Resultado {
  teoria: number;
  aciertos: number;
  totalTeoria: number;
  practica: number;
  puntos: number;
  maxPuntos: number;
  global: number;
  aprobado: boolean;
  tareas: DetalleTarea[];
  coherencia: Coherencia[];
  /** Teoría por módulo y capítulo del vídeo (los exámenes antiguos no lo traen) */
  desglose?: BloqueTeoria[];
}

export function corregir(ex: EstadoExamen): Resultado {
  const caso = generarCaso(ex.codigo);
  const aciertos = ex.teoria.reduce((s, q, i) => s + (aciertaTeoria(q, ex.respTeoria[i]) ? 1 : 0), 0);
  const teoria = ex.teoria.length ? aciertos / ex.teoria.length : 0;
  const tareas = caso.tareas.map((t) => ({
    id: t.id,
    titulo: t.titulo,
    max: t.campos.reduce((s, c) => s + c.puntos, 0),
    puntos: t.campos.reduce((s, c) => s + (corregirCampo(c, ex.resp[c.id]) === 'ok' ? c.puntos : 0), 0),
  }));
  const coh = coherencia(caso, ex.resp);
  const puntos = tareas.reduce((s, t) => s + t.puntos, 0) + coh.reduce((s, c) => s + (c.ok ? c.puntos : 0), 0);
  const maxPuntos = tareas.reduce((s, t) => s + t.max, 0) + coh.reduce((s, c) => s + c.puntos, 0);
  const practica = maxPuntos ? puntos / maxPuntos : 0;
  const global = PESO_TEORIA * teoria + PESO_PRACTICA * practica;
  return {
    teoria,
    aciertos,
    totalTeoria: ex.teoria.length,
    practica,
    puntos,
    maxPuntos,
    global,
    aprobado: teoria >= APROBADO_EXAMEN && practica >= APROBADO_EXAMEN,
    tareas,
    coherencia: coh,
    desglose: desgloseTeoria(ex.teoria, ex.respTeoria),
  };
}

/* ---------------------------------------------------------------- estado persistente */

export interface EstadoExamen {
  version: 1;
  codigo: string;
  alumno: { id: string; nombre: string; ini: string; usuario?: string };
  inicio: string;
  sinRequisito: boolean;
  fase: 'teoria' | 'practica' | 'resultado';
  teoria: PreguntaExamen[];
  respTeoria: RespuestaTeoria[];
  finTeoria?: string;
  resp: Record<string, string>;
  fin?: string;
  resultado?: Resultado;
  validacion?: { codigo: string; fecha: string };
  /** Envío del acta por correo al formador */
  envio?: { ok: boolean; fecha: string };
}

interface Almacen {
  actual: EstadoExamen | null;
  /** Último examen aprobado (para el certificado), aunque se empiece otro */
  aprobado: EstadoExamen | null;
}

const CLAVE = 'oys-examen';

function leer(): Almacen {
  try {
    const raw = localStorage.getItem(CLAVE);
    if (!raw) return { actual: null, aprobado: null };
    const a = JSON.parse(raw) as Partial<Almacen>;
    const ok = (e: unknown): e is EstadoExamen => !!e && typeof e === 'object' && (e as EstadoExamen).version === 1 && typeof (e as EstadoExamen).codigo === 'string';
    return { actual: ok(a.actual) ? a.actual : null, aprobado: ok(a.aprobado) ? a.aprobado : null };
  } catch {
    return { actual: null, aprobado: null };
  }
}

let almacen: Almacen = leer();
const oyentes = new Set<() => void>();

function guardar(a: Almacen) {
  almacen = a;
  try {
    localStorage.setItem(CLAVE, JSON.stringify(a));
  } catch {
    /* sin almacenamiento: dura lo que la pestaña */
  }
  oyentes.forEach((f) => f());
}

export function useExamen(): Almacen {
  return useSyncExternalStore(
    (f) => {
      oyentes.add(f);
      return () => oyentes.delete(f);
    },
    () => almacen,
  );
}

function conActual(f: (e: EstadoExamen) => EstadoExamen) {
  if (!almacen.actual) return;
  const actual = f(almacen.actual);
  guardar({ ...almacen, actual, aprobado: actual.resultado?.aprobado ? actual : almacen.aprobado });
}

export const examen = {
  empezar(alumno: { id: string; nombre: string; ini: string; usuario?: string }, sinRequisito: boolean) {
    const inicio = new Date().toISOString();
    const codigo = crearCodigo(alumno.id, alumno.ini, inicio);
    const teoria = generarTeoria(codigo);
    guardar({
      ...almacen,
      actual: { version: 1, codigo, alumno, inicio, sinRequisito, fase: 'teoria', teoria, respTeoria: teoria.map(() => null), resp: {} },
    });
  },
  responderTeoria(i: number, op: RespuestaTeoria) {
    conActual((e) => {
      const r = [...e.respTeoria];
      r[i] = op;
      return { ...e, respTeoria: r };
    });
  },
  cerrarTeoria() {
    conActual((e) => ({ ...e, fase: 'practica', finTeoria: new Date().toISOString() }));
  },
  responder(id: string, valor: string) {
    conActual((e) => ({ ...e, resp: { ...e.resp, [id]: valor } }));
  },
  entregar() {
    conActual((e) => {
      const fin = new Date().toISOString();
      const resultado = corregir({ ...e, fin });
      return { ...e, fin, fase: 'resultado', resultado };
    });
  },
  validar(codigoValidacion: string) {
    if (!almacen.aprobado) return;
    const v = { codigo: codigoValidacion, fecha: new Date().toISOString() };
    const aprobado = { ...almacen.aprobado, validacion: v };
    const actual = almacen.actual?.codigo === aprobado.codigo ? { ...almacen.actual, validacion: v } : almacen.actual;
    guardar({ actual, aprobado });
  },
  marcarEnvio(codigo: string, ok: boolean) {
    const v = { ok, fecha: new Date().toISOString() };
    const act = almacen.actual?.codigo === codigo ? { ...almacen.actual, envio: v } : almacen.actual;
    const apr = almacen.aprobado?.codigo === codigo ? { ...almacen.aprobado, envio: v } : almacen.aprobado;
    guardar({ actual: act, aprobado: apr });
  },
  descartar() {
    guardar({ ...almacen, actual: null });
  },
};

/* ---------------------------------------------------------------- acta */

export interface Acta {
  tipo: 'oys-acta-examen';
  v: 1;
  codigo: string;
  alumno: { id: string; nombre: string; ini: string; usuario?: string };
  inicio: string;
  fin: string;
  sinRequisito: boolean;
  nota: { teoria: number; practica: number; global: number };
  aprobado: boolean;
  declarado: Record<string, string>;
  /** Teoría: aciertos por bloque y, pregunta a pregunta, tipo, origen y si acierta */
  teoria?: { bloques: { nombre: string; aciertos: number; total: number }[]; preguntas: { tipo: TipoPregunta; origen: string; ok: boolean; respuesta: string }[] };
}

export function crearActa(ex: EstadoExamen): Acta {
  const r = ex.resultado ?? corregir(ex);
  return {
    tipo: 'oys-acta-examen',
    v: 1,
    codigo: ex.codigo,
    alumno: ex.alumno,
    inicio: ex.inicio,
    fin: ex.fin ?? new Date().toISOString(),
    sinRequisito: ex.sinRequisito,
    nota: { teoria: redondea(r.teoria * 100), practica: redondea(r.practica * 100), global: redondea(r.global * 100) },
    aprobado: r.aprobado,
    declarado: ex.resp,
    teoria: {
      bloques: desgloseTeoria(ex.teoria, ex.respTeoria).map((b) => ({ nombre: b.nombre, aciertos: b.aciertos, total: b.total })),
      preguntas: ex.teoria.map((q, i) => ({ tipo: tipoDe(q), origen: q.origen, ok: aciertaTeoria(q, ex.respTeoria[i]), respuesta: textoRespuesta(q, ex.respTeoria[i]).slice(0, 120) })),
    },
  };
}

function aBase64(s: string) {
  const bytes = new TextEncoder().encode(s);
  let bin = '';
  bytes.forEach((b) => (bin += String.fromCharCode(b)));
  return btoa(bin);
}

function deBase64(s: string) {
  const bin = atob(s);
  const bytes = Uint8Array.from(bin, (c) => c.charCodeAt(0));
  return new TextDecoder().decode(bytes);
}

const fecha = (iso: string) => new Date(iso).toLocaleString('es-ES', { dateStyle: 'medium', timeStyle: 'short' });

export function actaTexto(acta: Acta): string {
  const caso = generarCaso(acta.codigo);
  const lineas: string[] = [
    `ACTA DE EXAMEN · Practicando Axional Deister VNext · O&S Consultores`,
    `Alumno: ${acta.alumno.nombre} (${acta.alumno.ini})${acta.alumno.usuario ? ` · usuario ${acta.alumno.usuario}` : ''}`,
    `Código de examen: ${acta.codigo}`,
    `Proveedor: ${caso.proveedor} · Cliente: ${caso.cliente}`,
    `Inicio: ${fecha(acta.inicio)} · Entrega: ${fecha(acta.fin)}`,
    `Nota: teoría ${num2.format(acta.nota.teoria)} % · práctica ${num2.format(acta.nota.practica)} % · global ${num2.format(acta.nota.global)} % · ${acta.aprobado ? 'APROBADO' : 'NO APROBADO'}`,
    acta.sinRequisito ? 'Empezó sin tener completados todos los módulos.' : 'Tenía completados todos los módulos.',
    '',
    'Lo que declara haber registrado en Axional:',
  ];
  for (const t of caso.tareas) {
    lineas.push(`· ${t.titulo}`);
    for (const c of t.campos) lineas.push(`   ${c.etiqueta}: ${acta.declarado[c.id] || '—'}`);
  }
  if (acta.teoria) {
    lineas.push('', 'Teoría por bloques (módulos, capítulos del vídeo y criterio):');
    for (const b of acta.teoria.bloques) lineas.push(`   ${b.nombre}: ${b.aciertos}/${b.total}`);
    lineas.push('', 'Teoría pregunta a pregunta:');
    acta.teoria.preguntas.forEach((q, i) => {
      const o = q.origen.startsWith('vídeo') ? q.origen.replace('vídeo', 'Vídeo') : q.origen === 'criterio' ? 'Criterio' : META_CORTO[q.origen] ?? q.origen;
      lineas.push(`   P${String(i + 1).padStart(2, '0')} · ${NOMBRE_TIPO[q.tipo]} · ${o} · ${q.ok ? 'bien' : 'mal'} · ${q.respuesta}`);
    });
  }
  lineas.push('', 'Pega este texto entero en /examinador:', `ACTA:${aBase64(JSON.stringify(acta))}`);
  return lineas.join('\n');
}

export function leerActa(texto: string): { acta: Acta | null; codigo: string | null } {
  const t = texto.trim();
  const intento = (raw: string): Acta | null => {
    try {
      const a = JSON.parse(raw) as Acta;
      return a && a.tipo === 'oys-acta-examen' && typeof a.codigo === 'string' ? a : null;
    } catch {
      return null;
    }
  };
  let acta = t.startsWith('{') ? intento(t) : null;
  if (!acta) {
    const m = /ACTA:([A-Za-z0-9+/=]+)/.exec(t);
    if (m) {
      try {
        acta = intento(deBase64(m[1]));
      } catch {
        acta = null;
      }
    }
  }
  const codigo = acta?.codigo ?? RE_CODIGO.exec(t.toUpperCase())?.[0] ?? null;
  return { acta, codigo };
}

/* ---------------------------------------------------------------- código de validación */

// La clave viaja en el bundle: es una herramienta interna y se acepta ese riesgo.
// Defínela al compilar con VITE_CLAVE_EXAMINADOR=… npx vite build
const CLAVE_ENV = (import.meta.env.VITE_CLAVE_EXAMINADOR as string | undefined)?.trim();
export const CLAVE_POR_DEFECTO = !CLAVE_ENV;
export const CLAVE_EXAMINADOR = CLAVE_ENV || 'oys-axional-2026';

/** SHA-256 en JS puro, por si crypto.subtle no está (página abierta sin HTTPS) */
function sha256Js(msg: string): string {
  const K = [
    0x428a2f98, 0x71374491, 0xb5c0fbcf, 0xe9b5dba5, 0x3956c25b, 0x59f111f1, 0x923f82a4, 0xab1c5ed5, 0xd807aa98, 0x12835b01, 0x243185be, 0x550c7dc3, 0x72be5d74, 0x80deb1fe, 0x9bdc06a7, 0xc19bf174,
    0xe49b69c1, 0xefbe4786, 0x0fc19dc6, 0x240ca1cc, 0x2de92c6f, 0x4a7484aa, 0x5cb0a9dc, 0x76f988da, 0x983e5152, 0xa831c66d, 0xb00327c8, 0xbf597fc7, 0xc6e00bf3, 0xd5a79147, 0x06ca6351, 0x14292967,
    0x27b70a85, 0x2e1b2138, 0x4d2c6dfc, 0x53380d13, 0x650a7354, 0x766a0abb, 0x81c2c92e, 0x92722c85, 0xa2bfe8a1, 0xa81a664b, 0xc24b8b70, 0xc76c51a3, 0xd192e819, 0xd6990624, 0xf40e3585, 0x106aa070,
    0x19a4c116, 0x1e376c08, 0x2748774c, 0x34b0bcb5, 0x391c0cb3, 0x4ed8aa4a, 0x5b9cca4f, 0x682e6ff3, 0x748f82ee, 0x78a5636f, 0x84c87814, 0x8cc70208, 0x90befffa, 0xa4506ceb, 0xbef9a3f7, 0xc67178f2,
  ];
  const H = [0x6a09e667, 0xbb67ae85, 0x3c6ef372, 0xa54ff53a, 0x510e527f, 0x9b05688c, 0x1f83d9ab, 0x5be0cd19];
  const bytes = Array.from(new TextEncoder().encode(msg));
  const bitLen = bytes.length * 8;
  bytes.push(0x80);
  while (bytes.length % 64 !== 56) bytes.push(0);
  for (let i = 7; i >= 0; i--) bytes.push(i >= 4 ? 0 : (bitLen >>> (i * 8)) & 0xff);
  const rotr = (x: number, n: number) => (x >>> n) | (x << (32 - n));
  const w = new Array<number>(64);
  for (let off = 0; off < bytes.length; off += 64) {
    for (let i = 0; i < 16; i++) w[i] = (bytes[off + i * 4] << 24) | (bytes[off + i * 4 + 1] << 16) | (bytes[off + i * 4 + 2] << 8) | bytes[off + i * 4 + 3];
    for (let i = 16; i < 64; i++) {
      const s0 = rotr(w[i - 15], 7) ^ rotr(w[i - 15], 18) ^ (w[i - 15] >>> 3);
      const s1 = rotr(w[i - 2], 17) ^ rotr(w[i - 2], 19) ^ (w[i - 2] >>> 10);
      w[i] = (w[i - 16] + s0 + w[i - 7] + s1) | 0;
    }
    let [a, b, c, d, e, f, g, h] = H;
    for (let i = 0; i < 64; i++) {
      const S1 = rotr(e, 6) ^ rotr(e, 11) ^ rotr(e, 25);
      const ch = (e & f) ^ (~e & g);
      const t1 = (h + S1 + ch + K[i] + w[i]) | 0;
      const S0 = rotr(a, 2) ^ rotr(a, 13) ^ rotr(a, 22);
      const maj = (a & b) ^ (a & c) ^ (b & c);
      const t2 = (S0 + maj) | 0;
      h = g;
      g = f;
      f = e;
      e = (d + t1) | 0;
      d = c;
      c = b;
      b = a;
      a = (t1 + t2) | 0;
    }
    H[0] = (H[0] + a) | 0;
    H[1] = (H[1] + b) | 0;
    H[2] = (H[2] + c) | 0;
    H[3] = (H[3] + d) | 0;
    H[4] = (H[4] + e) | 0;
    H[5] = (H[5] + f) | 0;
    H[6] = (H[6] + g) | 0;
    H[7] = (H[7] + h) | 0;
  }
  return H.map((x) => (x >>> 0).toString(16).padStart(8, '0')).join('');
}

export async function sha256Hex(msg: string): Promise<string> {
  try {
    if (globalThis.crypto?.subtle) {
      const buf = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(msg));
      return Array.from(new Uint8Array(buf), (b) => b.toString(16).padStart(2, '0')).join('');
    }
  } catch {
    /* sin contexto seguro: cae al cálculo en JS */
  }
  return sha256Js(msg);
}

export async function codigoValidacion(codigoExamen: string, clave = CLAVE_EXAMINADOR) {
  return (await sha256Hex(clave + codigoExamen)).slice(0, 8).toUpperCase();
}

export async function compruebaValidacion(codigoExamen: string, introducido: string) {
  const limpio = introducido.trim().toUpperCase().replace(/[^0-9A-F]/g, '');
  return limpio.length === 8 && limpio === (await codigoValidacion(codigoExamen));
}

/* ---------------------------------------------------------------- examinador */

export function consultaSql(caso: Caso) {
  const c = caso.codigo;
  const p = caso.proveedor;
  const cl = caso.cliente;
  return `-- BORRADOR ORIENTATIVO para DBStudio (base TUTORIAL). Solo SELECT.
-- Tablas confirmadas por los manuales y el vídeo; los nombres de COLUMNA no están
-- verificados: compruébalos en el diccionario (o usa las pantallas) antes de lanzarla.

-- Terceros y su papel
SELECT * FROM ctercero WHERE codigo IN ('${p}', '${cl}');
SELECT * FROM gproveed WHERE codigo = '${p}';
SELECT * FROM gcliente WHERE codigo = '${cl}';

-- Compras: pedido (PC), albarán (ACPC) y factura (FCOA) del proveedor ${p}
SELECT * FROM gcompedh WHERE tercer = '${p}';
SELECT * FROM gcomalbh WHERE tercer = '${p}';
SELECT * FROM gcomfach WHERE tercer = '${p}';

-- Ventas del cliente ${cl}: oferta, pedido, albarán y factura
SELECT * FROM gvenofeh WHERE tercer = '${cl}';
SELECT * FROM gvenpedh WHERE tercer = '${cl}';
SELECT * FROM gvenalbh WHERE tercer = '${cl}';
SELECT * FROM gvenfach WHERE tercer = '${cl}';

-- Efectos de cartera de los dos terceros
SELECT * FROM cefectos WHERE tercer IN ('${p}', '${cl}');

-- Asiento manual (diario EA, Documento = ${c}) y apuntes
SELECT * FROM casientos WHERE docume = '${c}';
SELECT * FROM capuntes WHERE docume = '${c}';`;
}

export function checklistExaminador(caso: Caso): string[] {
  const ini = caso.ini;
  return [
    `Registro de terceros › ${caso.proveedor}: Validado, categoría 002, dirección 0, condición de pago EF / 30D y relación PRO 40000.00000.`,
    `Maestro de proveedores › ${caso.proveedor}: GENERAL, EUR, grupo de precio 00001 y descuentos 1, 2, 3 y pronto pago a 0 (no vacíos).`,
    `Pedidos de compras: pedido PC del ${caso.proveedor} con «Referencia» ${caso.codigo}, una línea de ${caso.compra.cantidad} × ${ARTICULO.codigo} a ${p2(caso.compra.precio)} € (neto ${p2(caso.compra.base)}), Validado y Situación Servido.`,
    'Docflow del albarán: pedido Servido → albarán ACPC Facturado → factura FCOA. Los números coinciden con lo declarado.',
    `Albarán: asiento 60000 Debe / 40090 Haber por ${p2(caso.compra.base)}, con el número declarado.`,
    `Factura de compra con «Factura proveedor» ${caso.codigo}: base ${p2(caso.compra.base)}, IVA ${p2(caso.compra.iva)}, total ${p2(caso.compra.total)}, Contabilizada; asiento de 5 líneas (40000 H, 47200 D, 60000 D, 40090 D, 60000 H).`,
    `Cartera de pagos: un efecto EF de ${caso.proveedor} por ${p2(caso.compra.total)}, en PE, a 30 días de la fecha de factura (sin pagar).`,
    `Cliente ${caso.cliente}: relación CLI 43000.00000 y condición de cobro EF / PE / 30D; cadena O${ini} › P${ini} › A${ini}2 › F${ini} con los números declarados y el albarán SIN contabilizar.`,
    `Factura de venta: base ${p2(caso.venta.base)}, IVA ${p2(caso.venta.iva)}, total ${p2(caso.venta.total)}, Contabilizada con 43000 D / 47000 H / 70000 H.`,
    `Gestión de cobro COBD con BBVA_${ini}: el efecto de ${caso.cliente} está en CO y su asiento es 57200 D / 43000 H por ${p2(caso.venta.total)}.`,
    `Asientos, diario EA, Documento ${caso.codigo}: ${caso.gasto.cuenta}.00000 Debe ${p2(caso.gasto.importe)} / 57200.00000 Haber, Contabilizado.`,
    'Todas las fechas caen en el día del examen y nada se ha creado con otro código de alumno.',
  ];
}
