/*
  Examen final del Taller Axional.

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
import { MODULOS } from '../content';
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
  campos: CampoExamen[];
}

export interface PreguntaExamen extends Pregunta {
  origen: string; // id del módulo o «criterio»
}

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
export const MIN_TEORIA = 30;
export const NUM_TEORIA = 24;
const N_VIDEO = 7;
const N_CRITERIO = 5;
/** Tamaño del banco teórico (para la portada) */
export const bancoTeoria = () => ({ tests: MODULOS.reduce((s, m) => s + m.ejercicios.reduce((t, e) => t + e.test.length, 0), 0), video: VIDEO.length, criterio: CRITERIO.length });

const p2 = (n: number) => num2.format(n);

/* Rutas de menú para las preguntas «de pantalla»: salen de los manuales */
function rutasDeMenu() {
  const out: { titulo: string; ruta: string[] }[] = [];
  const vistos = new Set<string>();
  for (const m of MODULOS) {
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
      titulo: 'Pago de la factura de compra',
      lineas: [
        { cuenta: '40000', nombre: 'Proveedores', debe: compra.total, haber: 0 },
        { cuenta: '57200', nombre: 'Bancos', debe: 0, haber: compra.total },
      ],
    },
    {
      titulo: 'Factura de venta',
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

  const ESTADOS_DOC = ['Pendiente', 'Servido', 'Facturado', 'Anulado'];
  const ESTADOS_EF = ['PE Pendiente', 'PR Propuesto', 'CO Cobrado', 'PA Pagado', 'DV Devuelto'];
  const ESTADOS_AS = ['Provisional', 'Contabilizado', 'Anulado'];

  const tareas: TareaExamen[] = [
    {
      id: 't1',
      modulo: 'maestros',
      titulo: 'Alta del proveedor',
      encargo: `Empezamos a comprar rodamientos a un proveedor nuevo. Dalo de alta como tercero y como proveedor con el código ${proveedor}. Que compre en euros, con el grupo de precio 00001 y sin ningún descuento ni pronto pago. Valida el tercero.`,
      datos: [
        { k: 'Código', v: proveedor },
        { k: 'Nombre', v: `Proveedor examen ${codigo}` },
        { k: 'NIF', v: 'el que te indique el examinador o uno de prueba' },
        { k: 'Divisa', v: 'EUR' },
        { k: 'Grupo de precio', v: '00001' },
      ],
      campos: [
        { id: 't1.codigo', etiqueta: 'Código de proveedor que has creado', tipo: 'texto', esperado: proveedor, puntos: 2, placeholder: 'T…EX' },
        { id: 't1.grupo', etiqueta: 'Grupo de precio del proveedor', tipo: 'texto', esperado: '00001', puntos: 2, placeholder: '00000' },
        { id: 't1.dtos', etiqueta: 'Qué has puesto en descuentos 1, 2, 3 y pronto pago', tipo: 'opcion', opciones: ['Los he dejado vacíos', '0 en los cuatro', '100 en los cuatro', 'Solo el pronto pago a 0'], esperado: '0 en los cuatro', puntos: 3 },
      ],
    },
    {
      id: 't2',
      modulo: 'compras',
      titulo: 'Pedido al proveedor',
      encargo: `Pídele a ${proveedor} ${qc} unidades del rodamiento ${ARTICULO.codigo} (${ARTICULO.nombre}) a ${p2(compra.precio)} € la unidad. Empresa 0, delegación CENTRAL, almacén 0, tipo de pedido PC. En «Su referencia» pon el código de examen.`,
      datos: [
        { k: 'Artículo', v: `${ARTICULO.codigo} ${ARTICULO.nombre}` },
        { k: 'Cantidad', v: `${qc} UNI` },
        { k: 'Precio', v: `${p2(compra.precio)} €` },
        { k: 'Su referencia', v: codigo },
      ],
      campos: [
        { id: 't2.num', etiqueta: 'Número del pedido', tipo: 'doc', patron: '^0PC\\d{6}$', placeholder: '0PC000000', puntos: 2 },
        { id: 't2.ref', etiqueta: 'Qué has escrito en «Su referencia»', tipo: 'texto', esperado: codigo, puntos: 1, placeholder: 'EX-…' },
        { id: 't2.neto', etiqueta: 'Importe neto del pedido (sin IVA)', tipo: 'importe', esperado: bc, puntos: 3, placeholder: '0,00' },
      ],
    },
    {
      id: 't3',
      modulo: 'compras',
      titulo: 'Recepción de la mercancía',
      encargo: 'Ha llegado todo lo pedido. Genera el albarán de compra desde el pedido (tipo ACPC), valídalo y contabilízalo.',
      datos: [{ k: 'Origen', v: 'el pedido de la tarea anterior' }],
      campos: [
        { id: 't3.num', etiqueta: 'Número del albarán', tipo: 'doc', patron: '^0AC\\d{6}$', placeholder: '0AC000000', puntos: 2 },
        { id: 't3.neto', etiqueta: 'Importe neto del albarán', tipo: 'importe', esperado: bc, puntos: 2, placeholder: '0,00' },
        { id: 't3.asiento', etiqueta: 'Número del asiento del albarán', tipo: 'entero', patron: '^\\d{1,7}$', placeholder: '0', puntos: 1 },
        { id: 't3.debe', etiqueta: 'Cuenta al Debe del asiento', tipo: 'cuenta', esperado: '60000', puntos: 2, placeholder: '00000' },
        { id: 't3.haber', etiqueta: 'Cuenta al Haber del asiento', tipo: 'cuenta', esperado: '40090', puntos: 2, placeholder: '00000' },
        { id: 't3.pedido', etiqueta: 'Estado del pedido en el Docflow tras generar el albarán', tipo: 'opcion', opciones: ESTADOS_DOC, esperado: 'Servido', puntos: 2 },
      ],
    },
    {
      id: 't4',
      modulo: 'compras',
      titulo: 'Factura del proveedor',
      encargo: `Ha llegado la factura del proveedor con el número ${codigo}. Genérala desde el albarán (tipo FCOA), comprueba que cuadra y contabilízala.`,
      datos: [
        { k: 'Factura proveedor', v: codigo },
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
        { id: 't4.alb', etiqueta: 'Estado del albarán en el Docflow', tipo: 'opcion', opciones: ESTADOS_DOC, esperado: 'Facturado', puntos: 2 },
      ],
    },
    {
      id: 't5',
      modulo: 'carteras',
      titulo: 'Pago al proveedor',
      encargo: 'Pagamos hoy la factura por banco. Liquida su efecto en la cartera de pagos.',
      datos: [{ k: 'Cuenta financiera', v: 'el banco que uses en la empresa 0' }],
      campos: [
        { id: 't5.importe', etiqueta: 'Importe pagado', tipo: 'importe', esperado: compra.total, puntos: 2, placeholder: '0,00' },
        { id: 't5.estado', etiqueta: 'Estado final del efecto', tipo: 'opcion', opciones: ESTADOS_EF, esperado: 'PA Pagado', puntos: 2 },
        { id: 't5.asiento', etiqueta: 'Número del asiento del pago', tipo: 'entero', patron: '^\\d{1,7}$', placeholder: '0', puntos: 1 },
        { id: 't5.debe', etiqueta: 'Cuenta al Debe', tipo: 'cuenta', esperado: '40000', puntos: 2, placeholder: '00000' },
        { id: 't5.haber', etiqueta: 'Cuenta al Haber', tipo: 'cuenta', esperado: '57200', puntos: 2, placeholder: '00000' },
      ],
    },
    {
      id: 't6',
      modulo: 'ventas',
      titulo: 'Venta completa',
      encargo: `Un cliente nuevo, ${cliente}, nos pide oferta de ${qv} unidades del ${ARTICULO.codigo} a ${p2(venta.precio)} €. Dalo de alta como tercero y cliente. Hazle la oferta; la acepta: pásala a pedido, sirve el pedido con un albarán y factúralo. Contabiliza solo la factura. En «Su referencia» pon el código de examen.`,
      datos: [
        { k: 'Cliente', v: cliente },
        { k: 'Cantidad', v: `${qv} UNIDAD` },
        { k: 'Precio', v: `${p2(venta.precio)} €` },
        { k: 'Cobro', v: 'EF / 30D' },
        { k: 'Su referencia', v: codigo },
      ],
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
        { id: 't6.cuentaiva', etiqueta: 'Cuenta del IVA repercutido', tipo: 'cuenta', esperado: '47000', puntos: 2, placeholder: '00000' },
        { id: 't6.ventas', etiqueta: 'Cuenta de ventas', tipo: 'cuenta', esperado: '70000', puntos: 2, placeholder: '00000' },
      ],
    },
    {
      id: 't7',
      modulo: 'carteras',
      titulo: 'Cobro del cliente',
      encargo: 'El cliente nos ha pagado hoy por transferencia. Cobra su vencimiento de forma individual, sin remesa.',
      datos: [{ k: 'Cuenta financiera', v: 'el banco que uses en la empresa 0' }],
      campos: [
        { id: 't7.accion', etiqueta: 'Acción que has usado', tipo: 'opcion', opciones: ['COBD Cobro directo', 'CSCTS Remesa', 'AV Albarán de venta', 'PE Pendiente'], esperado: 'COBD Cobro directo', puntos: 2 },
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
      encargo: `Hemos pagado por banco ${p2(gasto.importe)} € de ${gasto.concepto}. Regístralo a mano en el diario EA de la empresa 0, con la cuenta ${gasto.cuenta}.00000 (${gasto.nombre}) contra el banco, y en Documento pon el código de examen. Deja el asiento contabilizado.`,
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
  { pregunta: 'Contabilizas una factura de venta con forma de pago 30D. ¿En qué estado nace su efecto?', opciones: ['CO Cobrado', 'PE Pendiente', 'PR Propuesto', 'OC Ordenado'], correcta: 1, explicacion: 'Los efectos nacen en PE y pasan a CO al cobrarlos.' },
  { pregunta: 'Agregas un efecto a una remesa de cobro. ¿Qué estado toma?', opciones: ['CO Cobrado', 'PR Propuesto', 'DV Devuelto', 'Se queda en PE'], correcta: 1, explicacion: 'En la remesa recorre PE › PR › OC › CO.' },
  { pregunta: 'Una factura de 121,00 tiene un plazo de pago 40-80-120 días con 40 % / 20 % / 40 %. ¿Qué efectos genera?', opciones: ['Uno de 121,00', '48,40 / 24,20 / 48,40', '40,33 / 40,33 / 40,34', '40,00 / 20,00 / 40,00'], correcta: 1, explicacion: 'Cada vencimiento lleva su porcentaje del total: 40 % de 121 = 48,40 y 20 % = 24,20.' },
  { pregunta: 'Base 40,00 con IVA 21 %. ¿Qué va al Haber de la 40000?', opciones: ['40,00', '48,40', '8,40', '32,60'], correcta: 1, explicacion: 'Al proveedor se le debe el total: 40,00 + 8,40 = 48,40.' },
  { pregunta: 'Con la máscara #e#s#6n, empresa 0 y serie PC, ¿cómo sale el primer número?', opciones: ['PC0000001', '0PC000001', '0-PC-1', '2026PC000001'], correcta: 1, explicacion: '#e es la empresa, #s la serie y #6n un contador de seis cifras: 0PC000001.' },
  { pregunta: 'Junto a «Validar» en un albarán con líneas aparece «Anular». ¿Qué haces si lo pulsas sin querer?', opciones: ['Nada, es lo mismo que validar', 'Cancelar en la confirmación: anula el albarán y pide motivo', 'Recargar la página', 'Contabilizar enseguida'], correcta: 1, explicacion: '«Anular» pide un motivo y anula el documento. Si fue sin querer, cancela la confirmación.' },
  { pregunta: 'En la línea del albarán de compra no se rellena el precio de la tarifa. ¿Qué haces?', opciones: ['Cambias el grupo de precio del proveedor', 'Tecleas Precio, Precio con IVA e Importe dto.', 'Guardas a 0 y lo corriges en la factura', 'Borras el albarán'], correcta: 1, explicacion: 'En la demo el diálogo de línea no aplica la tarifa: esos tres campos se teclean. El neto lo calcula el servidor.' },
  { pregunta: 'En la pestaña Tarifas del proveedor, ¿a qué apuntas?', opciones: ['A una tarifa concreta', 'A un grupo de precios, que decide qué lista aplica', 'A un artículo', 'A una cuenta contable'], correcta: 1, explicacion: 'El proveedor apunta a un grupo de precios (por ejemplo 00001, que lleva a la lista COM).' },
];


/* Preguntas sacadas del vídeo tutorial de compras (guiones v2, capítulos 1 a 10) */
const VIDEO: (Pregunta & { cap: number })[] = [
  { cap: 1, pregunta: 'En Gestión › Compras › Maestros, ¿qué encuentras?', opciones: ['Proveedores y artículos', 'Tarifas, Documentos y Rápeles de compras', 'Asientos y diarios', 'Bancos propios'], correcta: 1, explicacion: 'Proveedores y artículos están en Gestión › Maestros; en Compras › Maestros están Tarifas, Documentos y Rápeles.' },
  { cap: 1, pregunta: 'No recuerdas dónde está una pantalla. ¿Qué es lo más rápido?', opciones: ['Recorrer todo el menú', 'El buscador «Buscar ⌘K» de la barra superior', 'Preguntar a soporte', 'Abrir el Docflow'], correcta: 1, explicacion: 'Al escribir, por ejemplo, «Proveedores», el buscador lista las pantallas que coinciden.' },
  { cap: 2, pregunta: 'Acabas de dar de alta un tercero. ¿En qué estado nace?', opciones: ['Validado', 'Provisional', 'Activo', 'Bloqueado'], correcta: 1, explicacion: 'Nace Provisional; con el botón verde «Validar» pasa a Validado.' },
  { cap: 2, pregunta: 'Quieres crear el proveedor y su tercero no aparece en el desplegable. ¿Qué pasa?', opciones: ['Falta la divisa', 'El tercero no está validado', 'Falta el grupo de precio', 'El artículo no existe'], correcta: 1, explicacion: 'Solo se puede elegir un tercero validado: valídalo antes de crear el proveedor.' },
  { cap: 2, pregunta: '¿Dónde se pone la forma de pago del proveedor?', opciones: ['En la ficha del proveedor, pestaña Tarifas', 'En el tercero, pestaña Condiciones de pago', 'En el pedido', 'En la lista de precios'], correcta: 1, explicacion: 'Tipo de efecto y plazo de pago van en las Condiciones de pago del tercero, no en el proveedor.' },
  { cap: 2, pregunta: 'Guardas un proveedor nuevo. ¿Qué estado tiene?', opciones: ['Provisional, hay que validarlo', 'Activo, sin validación aparte', 'Pendiente de autorizar', 'Validado por el tercero'], correcta: 1, explicacion: 'Al guardarlo queda Activo; no hay un paso de validación propio.' },
  { cap: 2, pregunta: 'Al dar de alta el tercero, el Tipo ID fiscal…', opciones: ['Se rellena solo con el país', 'Hay que elegirlo, por ejemplo «NIF-Empresa»', 'No hace falta', 'Lo pone el proveedor'], correcta: 1, explicacion: 'Es obligatorio y no se rellena solo: se elige en el desplegable.' },
  { cap: 2, pregunta: '¿Por qué el artículo 13500620 sí contabiliza en la demo?', opciones: ['Porque es de la familia 01', 'Porque su tipo contable es PRODUCTO (PROD), que tiene cuentas', 'Porque tiene stock', 'Porque su precio es 4,00'], correcta: 1, explicacion: 'El tipo contable decide las cuentas; PROD las tiene definidas.' },
  { cap: 3, pregunta: 'Una línea de lista de precios tiene precio 4,00 y descuento 1 del 10 %. ¿Qué precio neto sale?', opciones: ['4,40', '3,60', '3,96', '0,40'], correcta: 1, explicacion: '4,00 menos el 10 % = 3,60.' },
  { cap: 3, pregunta: 'El proveedor tiene el grupo de precio 00001. ¿De dónde saca el precio?', opciones: ['Del último pedido', 'De la lista que indica el grupo (por ejemplo COM)', 'Del artículo directamente', 'De la factura anterior'], correcta: 1, explicacion: 'El grupo ordena qué listas aplican (Orden, Condición, Divisa, Lista precio); el 00001 apunta a COM.' },
  { cap: 3, pregunta: 'Una línea de la lista tiene Fecha fin de ayer. ¿Qué pasa con ese precio?', opciones: ['Sigue valiendo', 'Ya no está vigente', 'Se aplica a la mitad', 'Pasa a la lista siguiente'], correcta: 1, explicacion: 'Cada línea vale entre su Fecha inicio y su Fecha fin.' },
  { cap: 4, pregunta: 'El numerador tiene rotura #e#s. ¿Qué significa?', opciones: ['Un contador por año', 'Un contador por empresa y serie, sin año', 'Un único contador para todo', 'Un contador por proveedor'], correcta: 1, explicacion: 'La rotura decide cuándo se reinicia la cuenta: #e#s separa por empresa y serie.' },
  { cap: 4, pregunta: '¿Dónde dices que un pedido PC genera albaranes del tipo ACPC?', opciones: ['En el numerador', 'En el tipo de pedido, caja Logística, campo «Tipo de albarán»', 'En la ficha del proveedor', 'En el albarán'], correcta: 1, explicacion: 'El tipo de documento es la plantilla: PC trae ACPC y ACPC trae FCOA.' },
  { cap: 4, pregunta: 'Una factura de compra muestra 0FC000009 y FC026-000001. ¿Por qué dos números?', opciones: ['Es un error', 'Uno es el del documento y el otro el de la serie fiscal', 'Uno es el del proveedor y otro el nuestro', 'Uno es el del asiento'], correcta: 1, explicacion: 'El numerador de gestión da el número del documento; la serie fiscal da el número para Hacienda.' },
  { cap: 4, pregunta: '¿Para qué sirve el control cronológico de una serie?', opciones: ['Para ordenar alfabéticamente', 'Para que un número no lleve fecha anterior al último', 'Para bloquear el proveedor', 'Para calcular el IVA'], correcta: 1, explicacion: 'Asegura que números y fechas van en orden, algo que Hacienda exige en las facturas emitidas.' },
  { cap: 5, pregunta: 'Validas un pedido. ¿Qué Situación muestra?', opciones: ['Servido', 'Sigue Pendiente hasta que llega la mercancía', 'Facturado', 'Contabilizado'], correcta: 1, explicacion: 'Validar no lo sirve: queda Pendiente hasta generar sus albaranes.' },
  { cap: 6, pregunta: 'En «Generación de albaranes con origen pedidos» marcas el pedido y pulsas «Generar albaranes». Sale «No se ha seleccionado ninguna línea de pedido». ¿Qué falta?', opciones: ['Validar el proveedor', 'Marcar también la línea del pedido', 'Contabilizar el pedido', 'Cambiar de almacén'], correcta: 1, explicacion: 'Hay que marcar la casilla del pedido y la de su línea.' },
  { cap: 6, pregunta: 'Recibes solo parte de lo pedido. ¿Cómo queda el pedido?', opciones: ['Servido', 'Parcial', 'Anulado', 'Pendiente de factura'], correcta: 1, explicacion: 'Pasa a Parcial si quedan líneas por servir y a Servido cuando llega todo.' },
  { cap: 6, pregunta: 'Al contabilizar marcas «Prevista de Asiento Contable». ¿Qué ocurre?', opciones: ['Contabiliza dos veces', 'Te enseña el esquema del asiento sin contabilizar', 'Contabiliza en provisional', 'Envía el asiento al banco'], correcta: 1, explicacion: 'Es una vista previa: muestra cuentas, Debe y Haber sin grabar nada.' },
  { cap: 7, pregunta: 'En el albarán, Acciones › «Generar factura». ¿Qué te pide?', opciones: ['Proveedor y almacén', 'Fecha factura, Factura proveedor e Importe factura', 'Cuenta contable', 'Nada, la crea sola'], correcta: 1, explicacion: 'Pide la fecha, el número que da el proveedor y el importe de su factura.' },
  { cap: 7, pregunta: 'El Importe factura que tecleas no coincide con el total calculado. ¿Qué hace el programa?', opciones: ['Bloquea la factura', 'No bloquea: tienes que revisarlo tú (informe de diferencias con albarán)', 'Corrige el albarán', 'Cambia el IVA'], correcta: 1, explicacion: 'Sin tolerancias en el tipo FCOA no bloquea; la comprobación es tuya y la ayuda el informe gcomfach_dif_albaran.' },
  { cap: 8, pregunta: 'Contabilizas la factura y la ventana muestra un asiento de dos líneas 60000 / 40090. ¿Qué pasa?', opciones: ['La factura está mal', 'La ventana enseña el asiento del albarán: abre el de la factura desde ⌄ › Asientos contables', 'Falta el IVA en el tipo', 'Hay que descontabilizar'], correcta: 1, explicacion: 'Es una trampa de la pantalla: el asiento bueno de la factura tiene cinco líneas.' },
  { cap: 8, pregunta: 'Base 40,00 e IVA 21 %, con el albarán ya contabilizado. ¿Cuánto suma el Debe del asiento de la factura?', opciones: ['48,40', '88,40', '40,00', '8,40'], correcta: 1, explicacion: '47200 8,40 + 60000 40,00 + 40090 40,00 = 88,40, igual que el Haber (40000 48,40 + 60000 40,00).' },
  { cap: 9, pregunta: 'En el Docflow, ¿qué indica la caja con el borde naranja?', opciones: ['Un documento con error', 'El documento desde el que lo has abierto', 'El documento más antiguo', 'Un documento anulado'], correcta: 1, explicacion: 'El borde naranja marca dónde estás; el resto de cajas son los documentos enlazados.' },
  { cap: 9, pregunta: 'En el Docflow de compras, ¿qué son los «Suministros»?', opciones: ['Los pedidos', 'Los albaranes', 'Las facturas', 'Los pagos'], correcta: 1, explicacion: 'Suministros es la tabla de albaranes: Pedidos compras · Suministros · Facturas compras.' },
];

export function generarTeoria(codigo: string): PreguntaExamen[] {
  const ini = iniDeCodigo(codigo);
  const r = rng(hash32(`${codigo}|teoria`));
  const porModulo = MODULOS.map((m) => ({
    id: m.id,
    preguntas: r.shuffle(m.ejercicios.flatMap((e) => e.test)),
  }));
  const elegidas: PreguntaExamen[] = [];
  // 2 por módulo de los tests (12), 7 del vídeo de compras y 5 de criterio: 24
  for (const m of porModulo) for (const q of m.preguntas.slice(0, 2)) elegidas.push({ ...q, origen: m.id });
  const resto = r.shuffle(porModulo.flatMap((m) => m.preguntas.slice(2).map((q) => ({ ...q, origen: m.id }))));
  while (elegidas.length < NUM_TEORIA - N_VIDEO - N_CRITERIO && resto.length) elegidas.push(resto.shift()!);
  for (const { cap, ...q } of r.shuffle(VIDEO).slice(0, N_VIDEO)) elegidas.push({ ...q, origen: `vídeo cap. ${cap}` });
  for (const q of r.shuffle(CRITERIO).slice(0, NUM_TEORIA - elegidas.length)) elegidas.push({ ...q, origen: 'criterio' });

  return r.shuffle(elegidas).map((q) => {
    const orden = r.shuffle(q.opciones.map((_, i) => i));
    return {
      ...q,
      pregunta: conIni(q.pregunta, ini),
      opciones: orden.map((i) => conIni(q.opciones[i], ini)),
      correcta: orden.indexOf(q.correcta),
      explicacion: conIni(q.explicacion, ini),
    };
  });
}

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
  const asientos = ['t3.asiento', 't4.asiento', 't5.asiento', 't6.asiento', 't7.asiento', 't8.asiento'].map(n);
  const sinRepetir = asientos.filter((x): x is number => x !== null);
  const a3 = n('t3.asiento');
  const a4 = n('t4.asiento');
  const a5 = n('t5.asiento');
  const a6 = n('t6.asiento');
  const a7 = n('t7.asiento');
  return [
    { id: 'cadena', texto: 'Has declarado la cadena completa de compras y de ventas, con el formato correcto', ok: docs.every((d, i) => d && new RegExp(['^0PC', '^0AC', '^0FC', '^0OV', '^0PV', '^0AV', '^0FV'][i] + '\\d{6}$').test(d)), puntos: 2 },
    { id: 'ref', texto: '«Su referencia» y «Factura proveedor» llevan el código de examen', ok: normTexto(resp['t2.ref'] ?? '') === caso.codigo && normTexto(resp['t4.ref'] ?? '') === caso.codigo, puntos: 2 },
    { id: 'orden-compra', texto: 'El asiento de la factura de compra es posterior al del albarán, y el del pago posterior al de la factura', ok: a3 !== null && a4 !== null && a5 !== null && a4 > a3 && a5 > a4, puntos: 2 },
    { id: 'orden-venta', texto: 'El asiento del cobro es posterior al de la factura de venta', ok: a6 !== null && a7 !== null && a7 > a6, puntos: 2 },
    { id: 'unicos', texto: 'Cada documento contable tiene su propio asiento (no repites números)', ok: sinRepetir.length === 6 && new Set(sinRepetir).size === 6, puntos: 2 },
    { id: 'cuadre', texto: 'Los importes de compra cuadran entre sí: albarán = base de la factura y pago = total', ok: [resp['t3.neto'], resp['t4.base']].every((x) => igual(x, caso.compra.base)) && igual(resp['t5.importe'], caso.compra.total), puntos: 2 },
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
}

export function corregir(ex: EstadoExamen): Resultado {
  const caso = generarCaso(ex.codigo);
  const aciertos = ex.teoria.reduce((s, q, i) => s + (ex.respTeoria[i] === q.correcta ? 1 : 0), 0);
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
  };
}

/* ---------------------------------------------------------------- estado persistente */

export interface EstadoExamen {
  version: 1;
  codigo: string;
  alumno: { id: string; nombre: string; ini: string };
  inicio: string;
  sinRequisito: boolean;
  fase: 'teoria' | 'practica' | 'resultado';
  teoria: PreguntaExamen[];
  respTeoria: (number | null)[];
  finTeoria?: string;
  resp: Record<string, string>;
  fin?: string;
  resultado?: Resultado;
  validacion?: { codigo: string; fecha: string };
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
  empezar(alumno: { id: string; nombre: string; ini: string }, sinRequisito: boolean) {
    const inicio = new Date().toISOString();
    const codigo = crearCodigo(alumno.id, alumno.ini, inicio);
    const teoria = generarTeoria(codigo);
    guardar({
      ...almacen,
      actual: { version: 1, codigo, alumno, inicio, sinRequisito, fase: 'teoria', teoria, respTeoria: teoria.map(() => null), resp: {} },
    });
  },
  responderTeoria(i: number, op: number) {
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
  descartar() {
    guardar({ ...almacen, actual: null });
  },
};

/* ---------------------------------------------------------------- acta */

export interface Acta {
  tipo: 'oys-acta-examen';
  v: 1;
  codigo: string;
  alumno: { id: string; nombre: string; ini: string };
  inicio: string;
  fin: string;
  sinRequisito: boolean;
  nota: { teoria: number; practica: number; global: number };
  aprobado: boolean;
  declarado: Record<string, string>;
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
    `ACTA DE EXAMEN · Taller Axional · O&S Consultores`,
    `Alumno: ${acta.alumno.nombre} (${acta.alumno.ini})`,
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
  return `-- BORRADOR ORIENTATIVO para DBStudio (base TUTORIAL).
-- Las columnas NO están verificadas: revísalas con el diccionario antes de lanzarla.
-- Solo SELECT.

-- Compras: pedido, albarán y factura del proveedor ${p}
SELECT 'PEDIDO' AS doc, h.docser, h.fecped AS fecha, h.tercer, h.refter, h.imptot, h.estado
  FROM gcompedh h WHERE h.tercer = '${p}' OR h.refter = '${c}';
SELECT 'ALBARAN' AS doc, h.docser, h.fecmov AS fecha, h.tercer, h.refter, h.imptot, h.estado
  FROM gcomalbh h WHERE h.tercer = '${p}' OR h.refter = '${c}';
SELECT 'FACTURA' AS doc, h.docser, h.fecha, h.tercer, h.refter, h.imptot, h.estado
  FROM gcomfach h WHERE h.tercer = '${p}' OR h.refter = '${c}';

-- Ventas del cliente ${cl}
SELECT 'FACTURA VENTA' AS doc, h.docser, h.fecha, h.tercer, h.imptot, h.estado
  FROM gvenfach h WHERE h.tercer = '${cl}';

-- Asientos con el código de examen o de los documentos anteriores
SELECT a.empcode, a.asient, a.fecha, a.diario, a.docume, a.estado,
       p.cuenta, p.debe, p.haber, p.concep
  FROM casientos a, capuntes p
 WHERE p.loteid = a.loteid
   AND (a.docume LIKE '%${c}%' OR p.concep LIKE '%${c}%' OR p.docume LIKE '%${c}%')
 ORDER BY a.asient, p.orden;

-- Efectos de cartera de los dos terceros
SELECT e.clase, e.tercer, e.tipefe, e.numero, e.fecven, e.import, e.estado
  FROM cefectos e WHERE e.tercer IN ('${p}', '${cl}');`;
}

export function checklistExaminador(caso: Caso): string[] {
  return [
    `Busca el tercero ${caso.proveedor}: existe, está validado y como proveedor tiene grupo de precio 00001 y descuentos 1, 2, 3 y pronto pago a 0.`,
    `En pedidos de compra, filtra por «Su referencia» = ${caso.codigo}: un pedido PC de ${caso.compra.cantidad} × ${ARTICULO.codigo} a ${p2(caso.compra.precio)} €.`,
    'Abre el Docflow del pedido: pedido Servido → albarán ACPC Facturado → factura FCOA.',
    `En facturas de compra, «Factura proveedor» = ${caso.codigo}: base ${p2(caso.compra.base)}, IVA ${p2(caso.compra.iva)}, total ${p2(caso.compra.total)}.`,
    'Revisa el asiento del albarán (60000 / 40090) y el de la factura (40000, 47200, 60000, 40090) con los números que declara.',
    `En cartera de pagos, el efecto de ${caso.proveedor} por ${p2(caso.compra.total)} está pagado, con su asiento 40000 / 57200.`,
    `Busca el cliente ${caso.cliente} y su cadena oferta → pedido → albarán → factura con «Su referencia» = ${caso.codigo}; solo la factura contabilizada (43000 / 47000 / 70000).`,
    `En cartera de cobros, el efecto de ${caso.cliente} por ${p2(caso.venta.total)} está en CO, cobrado con COBD.`,
    `En asientos, diario EA con Documento = ${caso.codigo}: ${caso.gasto.cuenta}.00000 Debe ${p2(caso.gasto.importe)} / 57200.00000 Haber, contabilizado.`,
    'Las fechas de los documentos caen dentro del día del examen y los números de asiento coinciden con lo declarado.',
  ];
}
