/* ERP de práctica: réplica simplificada de Axional VNext (base TUTORIAL) que vive en localStorage.
   Circuito de compras: tercero → proveedor → artículo → pedido (PC) → albarán (ACPC) → factura (FCOA). */
import { useSyncExternalStore } from 'react';

export type EstadoDoc = 'Provisional' | 'Validado';
export type PantallaFija = 'inicio' | 'terceros' | 'proveedores' | 'articulos' | 'pedidos' | 'albaranes' | 'facturas' | 'stock' | 'docflow' | 'asientos' | 'efectos' | 'remesas' | 'extractos' | 'conciliacion';
/** Pantallas propias del circuito o `obj:<código>` para cualquier otra pantalla del catálogo de Axional */
export type Pantalla = PantallaFija | `obj:${string}`;

export interface Direccion {
  tipo: number;
  direccion: string;
  cp: string;
  poblacion: string;
  provincia: string;
  zonaImp: string;
}
export interface Relacion {
  tipo: 'Proveedor' | 'Cliente';
  codigo: 'ACR' | 'PRO' | 'CLI';
  plan: string;
  cuenta: string;
}
export interface Tercero {
  codigo: string;
  nombre: string;
  tipoId: 'NIF-Empresa' | 'No censado';
  nif: string;
  categoria: '001 Clientes' | '002 Proveedores';
  pais: string;
  direcciones: Direccion[];
  relaciones: Relacion[];
  estado: EstadoDoc;
  autor: string;
  /** lo creó la plataforma (práctica del bloque 3) porque el alumno aún no lo tenía: no puntúa en la práctica del bloque 1 */
  sembrado?: boolean;
}
export interface Proveedor {
  tercero: string;
  tipo: 'GENERAL' | 'ACREEDOR';
  tipoEfecto: string;
  plazoPago: string;
  fechaBaja: string;
  centralCompras: string;
  centralPagos: string;
  autor: string;
  sembrado?: boolean;
}
export interface Articulo {
  codigo: string;
  nombre: string;
  unidad: string;
  familia: string;
  tipoContable: 'PROD' | 'VEN' | 'SERV';
  claveFiscal: 'BOG' | 'SOG';
  iva: number;
  precioCompra: number;
  estado: 'Provisional' | 'Activo';
  autor: string;
}
export interface Linea {
  n: number;
  articulo: string;
  descripcion: string;
  cantidad: number;
  precio: number;
  dto: number;
  /** pedidos: cantidad ya servida en albaranes validados (se calcula); albaranes: nº de línea del pedido origen */
  origenLinea?: number;
}
export interface Pedido {
  numero: string;
  tipo: 'PC';
  proveedor: string;
  fecha: string;
  almacen: string;
  delegacion: string;
  referencia: string;
  lineas: Linea[];
  estado: EstadoDoc;
  autor: string;
}
export interface Albaran {
  numero: string;
  tipo: 'ACPC';
  proveedor: string;
  fecha: string;
  almacen: string;
  origen: string; // número de pedido o ''
  lineas: Linea[];
  estado: EstadoDoc;
  autor: string;
}
export interface LineaAsiento {
  cuenta: string;
  concepto: string;
  debe: number;
  haber: number;
}
export interface Factura {
  numero: string;
  tipo: 'FCOA';
  proveedor: string;
  facturaProveedor: string;
  fecha: string;
  albaranes: string[];
  estado: EstadoDoc;
  contabilizada: boolean;
  asiento: LineaAsiento[];
  autor: string;
}
export interface Evento {
  t: string;
  que: string; // 'crear' | 'validar' | 'provisional' | 'editar' | 'generar' | 'contabilizar' | 'borrar'
  doc: string;
  autor: string;
}
export interface Db {
  version: 1;
  terceros: Tercero[];
  proveedores: Proveedor[];
  articulos: Articulo[];
  pedidos: Pedido[];
  albaranes: Albaran[];
  facturas: Factura[];
  contadores: Record<string, number>;
  log: Evento[];
  asientos: Asiento[];
  efectos: Efecto[];
  remesas: Remesa[];
  extractos: MovBanco[];
}

/* ------------------------------------------------------------------ finanzas: asientos, cartera, remesas, bancos */
export interface Apunte {
  orden: number;
  cuenta: string;
  concepto: string;
  debe: number;
  haber: number;
  /** extracto bancario con el que se ha conciliado (solo cuentas 572) */
  conciliado?: number;
}
export interface Asiento {
  numero: number;
  fecha: string;
  diario: string;
  jusser: string;
  docser: string;
  /** MAN manual · FCOA factura de compra · REM remesa */
  origen: 'MAN' | 'FCOA' | 'REM';
  /** P Provisional · C Contabilizado (Finalizar) */
  estado: 'P' | 'C';
  apuntes: Apunte[];
  autor: string;
}
/** Estados reales de cefecest: PE Pendiente · OP Ordenado (en remesa) · PA Pagado · CO Cobrado */
export type EstadoEfecto = 'PE' | 'OP' | 'PA' | 'CO';
export interface Efecto {
  numero: number;
  clase: 'P' | 'C';
  tercero: string;
  cuenta: string;
  docser: string;
  numefe: number;
  fecha: string;
  fecven: string;
  importe: number;
  tipefe: string;
  estado: EstadoEfecto;
  remesa: number | null;
  autor: string;
}
export interface Remesa {
  numrem: number;
  clase: 'P' | 'C';
  /** tipo de remesa (cremesad), p. ej. PSCTT Pago transferencias (con Tesorería) */
  tipdoc: string;
  fecrem: string;
  fecval: string;
  ctafin: string;
  /** A Abierto · C Cerrado */
  estrem: 'A' | 'C';
  efectos: number[];
  asiento: number | null;
  autor: string;
}
export interface MovBanco {
  orden: number;
  ctafin: string;
  fecope: string;
  fecval: string;
  concom: string;
  concep: string;
  docume: string;
  /** negativo = cargo (pago), positivo = abono (cobro) */
  importe: number;
  /** asiento y orden del apunte conciliado */
  conciliado: { asiento: number; orden: number } | null;
  autor: string;
}

const CLAVE = 'oys-erp-sim-v1';
const IVA = 0.21;
const eurTxt = (n: number) => n.toLocaleString('es-ES', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
export const r2 = (n: number) => Math.round((n + Number.EPSILON) * 100) / 100;
export const hoy = () => new Date().toISOString().slice(0, 10);
export const sumaDias = (iso: string, n: number) => {
  const d = new Date(`${iso}T12:00:00Z`);
  d.setUTCDate(d.getUTCDate() + n);
  return d.toISOString().slice(0, 10);
};

/* ------------------------------------------------------------------ datos de partida (base TUTORIAL) */
function semilla(): Db {
  const sis = 'TUTORIAL';
  return {
    version: 1,
    terceros: [
      {
        codigo: '00001',
        nombre: 'RODAMIENTOS DEL VALLÈS, S.A.',
        tipoId: 'NIF-Empresa',
        nif: 'A08123456',
        categoria: '002 Proveedores',
        pais: 'ES',
        direcciones: [{ tipo: 0, direccion: 'C/ Industria 14', cp: '08201', poblacion: 'Sabadell', provincia: '08', zonaImp: 'ESCO' }],
        relaciones: [{ tipo: 'Proveedor', codigo: 'ACR', plan: 'PGE 2008', cuenta: '41000.00000' }, { tipo: 'Proveedor', codigo: 'PRO', plan: 'PGE 2008', cuenta: '40000.00000' }],
        estado: 'Validado',
        autor: sis,
      },
      {
        codigo: '00002',
        nombre: 'SUMINISTROS TÉCNICOS GEASA, S.L.',
        tipoId: 'NIF-Empresa',
        nif: 'B17654321',
        categoria: '002 Proveedores',
        pais: 'ES',
        direcciones: [{ tipo: 0, direccion: 'Av. Diagonal 300', cp: '08013', poblacion: 'Barcelona', provincia: '08', zonaImp: 'ESCO' }],
        relaciones: [{ tipo: 'Proveedor', codigo: 'PRO', plan: 'PGE 2008', cuenta: '40000.00000' }],
        estado: 'Validado',
        autor: sis,
      },
    ],
    proveedores: [
      { tercero: '00001', tipo: 'GENERAL', tipoEfecto: 'TF', plazoPago: '30D', fechaBaja: '2099-12-31', centralCompras: '00001', centralPagos: '00001', autor: sis },
      { tercero: '00002', tipo: 'GENERAL', tipoEfecto: 'TF', plazoPago: '60D', fechaBaja: '2099-12-31', centralCompras: '00002', centralPagos: '00002', autor: sis },
    ],
    articulos: [
      { codigo: '13500620', nombre: '6000-2RS', unidad: 'UNIDAD', familia: '01.01.001352', tipoContable: 'PROD', claveFiscal: 'BOG', iva: 21, precioCompra: 12.5, estado: 'Activo', autor: sis },
      { codigo: '13500640', nombre: '6201-ZZ', unidad: 'UNIDAD', familia: '01.01.001352', tipoContable: 'PROD', claveFiscal: 'BOG', iva: 21, precioCompra: 9.8, estado: 'Activo', autor: sis },
    ],
    pedidos: [],
    albaranes: [],
    facturas: [],
    contadores: { PC: 0, AC: 1, FC: 0, ASI: 100, EFE: 40, REM: 10, EXT: 3 }, // la TUTORIAL ya tiene numeración usada
    log: [],
    asientos: [],
    efectos: [],
    remesas: [],
    extractos: [
      { orden: 1, ctafin: 'BBVA_CA', fecope: '2026-11-02', fecval: '2026-11-02', concom: '02', concep: 'TRANSFERENCIA RECIBIDA CLIENTE 00002', docume: '', importe: 1210, conciliado: null, autor: sis },
      { orden: 2, ctafin: 'BBVA_CA', fecope: '2026-11-05', fecval: '2026-11-05', concom: '03', concep: 'RECIBO SUMINISTRO ELECTRICO', docume: '', importe: -96.8, conciliado: null, autor: sis },
      { orden: 3, ctafin: 'BBVA_CA', fecope: '2026-11-10', fecval: '2026-11-10', concom: '12', concep: 'COMISION MANTENIMIENTO CUENTA', docume: '', importe: -6, conciliado: null, autor: sis },
    ],
  };
}

function leer(): Db {
  try {
    const raw = localStorage.getItem(CLAVE);
    if (!raw) return semilla();
    const d = JSON.parse(raw) as Db;
    const s = semilla();
    return d.version === 1 ? { ...s, ...d, contadores: { ...s.contadores, ...d.contadores } } : s;
  } catch {
    return semilla();
  }
}

let db: Db = leer();
const oyentes = new Set<() => void>();
function guardar(nuevo: Db) {
  db = nuevo;
  try {
    localStorage.setItem(CLAVE, JSON.stringify(db));
  } catch {
    /* sin almacenamiento: dura lo que la pestaña */
  }
  oyentes.forEach((f) => f());
}
export function useDb(): Db {
  return useSyncExternalStore(
    (f) => {
      oyentes.add(f);
      return () => oyentes.delete(f);
    },
    () => db,
  );
}
export const getDb = () => db;

/* ------------------------------------------------------------------ cálculos */
export const importeLinea = (l: Linea) => r2(l.cantidad * l.precio * (1 - (l.dto || 0) / 100));
export const baseDe = (ls: Linea[]) => r2(ls.reduce((s, l) => s + importeLinea(l), 0));
export function totales(ls: Linea[]) {
  const base = baseDe(ls);
  const iva = r2(base * IVA);
  return { base, iva, total: r2(base + iva) };
}
export const numero = (serie: string, n: number) => `0${serie}${String(n).padStart(6, '0')}`;

/** Unidades servidas de una línea de pedido por albaranes validados */
export function servida(d: Db, pedido: string, nLinea: number) {
  return d.albaranes
    .filter((a) => a.origen === pedido && a.estado === 'Validado')
    .flatMap((a) => a.lineas)
    .filter((l) => l.origenLinea === nLinea)
    .reduce((s, l) => s + l.cantidad, 0);
}
export type SituacionPedido = 'Pendiente' | 'Parcialmente servido' | 'Servido o Facturado';
export function situacionPedido(d: Db, p: Pedido): SituacionPedido {
  const pend = p.lineas.map((l) => l.cantidad - servida(d, p.numero, l.n));
  if (p.lineas.length && pend.every((x) => x <= 0)) return 'Servido o Facturado';
  if (p.lineas.some((l) => servida(d, p.numero, l.n) > 0)) return 'Parcialmente servido';
  return 'Pendiente';
}
export const facturaDeAlbaran = (d: Db, alb: string) => d.facturas.find((f) => f.albaranes.includes(alb));
export function lineasFactura(d: Db, f: Factura): Linea[] {
  return f.albaranes.flatMap((n) => d.albaranes.find((a) => a.numero === n)?.lineas ?? []);
}
export function asientoPrevisto(d: Db, f: Factura): LineaAsiento[] {
  const { base, iva, total } = totales(lineasFactura(d, f));
  const t = d.terceros.find((x) => x.codigo === f.proveedor);
  const cta = t?.relaciones.find((r) => r.codigo === 'PRO')?.cuenta ?? '40000.00000';
  return [
    { cuenta: '60000.00000', concepto: 'Compras de mercaderías', debe: base, haber: 0 },
    { cuenta: '47200.00021', concepto: 'H.P. IVA soportado 21 %', debe: iva, haber: 0 },
    { cuenta: cta, concepto: `Proveedor ${t?.nombre ?? f.proveedor}`, debe: 0, haber: total },
  ];
}
/** Stock por artículo y almacén: entradas de albaranes validados (cuenta NSAL › DISP) */
export function stock(d: Db) {
  const m = new Map<string, { articulo: string; almacen: string; cantidad: number; movimientos: { doc: string; fecha: string; cantidad: number }[] }>();
  for (const a of d.albaranes.filter((x) => x.estado === 'Validado')) {
    for (const l of a.lineas) {
      const k = `${l.articulo}|${a.almacen}`;
      const e = m.get(k) ?? { articulo: l.articulo, almacen: a.almacen, cantidad: 0, movimientos: [] };
      e.cantidad += l.cantidad;
      e.movimientos.push({ doc: a.numero, fecha: a.fecha, cantidad: l.cantidad });
      m.set(k, e);
    }
  }
  return [...m.values()];
}

/* ------------------------------------------------------------------ acciones (devuelven error en texto o null) */
type Res = { ok: true; doc: string } | { ok: false; error: string };
const err = (error: string): Res => ({ ok: false, error });
const bien = (doc: string): Res => ({ ok: true, doc });

function conLog(d: Db, que: string, doc: string, autor: string): Db {
  return { ...d, log: [...d.log, { t: new Date().toISOString(), que, doc, autor }].slice(-400) };
}
const up = (s: string) => s.trim().toUpperCase();

export const erp = {
  reiniciar() {
    guardar(semilla());
  },

  /** Prácticas de compras y finanzas: si el alumno aún no tiene su proveedor T{INI} (bloque 1), se lo trae creado.
      Queda marcado como `sembrado` para no dar puntos en la práctica del bloque 1. No toca nada que el alumno ya tenga. */
  asegurarProveedorAlumno(ini: string, nombre: string): boolean {
    if (!ini) return false;
    const codigo = `T${ini}`;
    let d = db;
    let cambia = false;
    if (!d.terceros.some((x) => x.codigo === codigo)) {
      const t: Tercero = {
        codigo,
        nombre: nombre.trim() || `PROVEEDOR ${ini}`,
        tipoId: 'No censado',
        nif: '0',
        categoria: '002 Proveedores',
        pais: 'ES',
        direcciones: [{ tipo: 0, direccion: '', cp: '08001', poblacion: 'Barcelona', provincia: '08', zonaImp: 'ESCO' }],
        relaciones: [
          { tipo: 'Proveedor', codigo: 'ACR', plan: 'PGE 2008', cuenta: '41000.00000' },
          { tipo: 'Proveedor', codigo: 'PRO', plan: 'PGE 2008', cuenta: '40000.00000' },
        ],
        estado: 'Validado',
        autor: ini,
        sembrado: true,
      };
      d = conLog({ ...d, terceros: [...d.terceros, t] }, 'crear', `tercero:${codigo}`, ini);
      cambia = true;
    }
    const t = d.terceros.find((x) => x.codigo === codigo)!;
    const sePuede = t.estado === 'Validado' && t.relaciones.some((r) => r.tipo === 'Proveedor');
    if (sePuede && !d.proveedores.some((p) => p.tercero === codigo)) {
      const p: Proveedor = { tercero: codigo, tipo: 'GENERAL', tipoEfecto: 'TF', plazoPago: '30D', fechaBaja: '2099-12-31', centralCompras: codigo, centralPagos: codigo, autor: ini, sembrado: true };
      d = conLog({ ...d, proveedores: [...d.proveedores, p] }, 'crear', `proveedor:${codigo}`, ini);
      cambia = true;
    }
    if (cambia) guardar(d);
    return cambia;
  },
  /** Práctica del bloque 1: si el proveedor T{INI} lo creó la plataforma y aún no tiene documentos, se quita para que el alumno lo cree. */
  quitarProveedorSembrado(ini: string): boolean {
    if (!ini) return false;
    const codigo = `T${ini}`;
    const t = db.terceros.find((x) => x.codigo === codigo);
    const p = db.proveedores.find((x) => x.tercero === codigo);
    if (!t?.sembrado && !p?.sembrado) return false;
    const usado = db.pedidos.some((x) => x.proveedor === codigo) || db.albaranes.some((x) => x.proveedor === codigo) || db.facturas.some((x) => x.proveedor === codigo) || db.efectos.some((x) => x.tercero === codigo);
    if (usado) return false;
    guardar({
      ...db,
      terceros: t?.sembrado ? db.terceros.filter((x) => x.codigo !== codigo) : db.terceros,
      proveedores: db.proveedores.filter((x) => !(x.tercero === codigo && (x.sembrado || t?.sembrado))),
    });
    return true;
  },

  /* ---------- terceros */
  guardarTercero(t: Tercero, autor: string): Res {
    const codigo = up(t.codigo);
    if (!codigo) return err('El campo «Código» es obligatorio.');
    if (!t.nombre.trim()) return err('El campo «Nombre» es obligatorio.');
    if (t.tipoId === 'NIF-Empresa' && !/^[A-Z]\d{7}[A-Z0-9]$/i.test(t.nif.trim())) return err('El campo «Id. fiscal» no es válido para NIF-Empresa (formato B12345674). Si no tienes NIF, elige «No censado» en «Tipo Id. fiscal» y pon Id. fiscal 0.');
    if (t.tipoId === 'No censado' && !t.nif.trim()) return err('El campo «Id. fiscal» es obligatorio: con «No censado» pon 0.');
    const existe = db.terceros.find((x) => x.codigo === codigo);
    if (existe && existe.autor === 'TUTORIAL') return err(`El tercero ${codigo} pertenece a la base TUTORIAL y no se puede modificar.`);
    const { sembrado: _s, ...resto } = t;
    void _s;
    const nuevo: Tercero = { ...resto, codigo, nif: t.nif.trim().toUpperCase(), autor };
    const lista = existe ? db.terceros.map((x) => (x.codigo === codigo ? nuevo : x)) : [...db.terceros, nuevo];
    guardar(conLog({ ...db, terceros: lista }, existe ? 'editar' : 'crear', `tercero:${codigo}`, autor));
    return bien(codigo);
  },
  validarTercero(codigo: string, autor: string): Res {
    const t = db.terceros.find((x) => x.codigo === codigo);
    if (!t) return err('No existe el tercero.');
    if (!t.direcciones.length) return err('Falta la dirección: añade al menos la dirección tipo 0 en la pestaña Direcciones.');
    if (!t.relaciones.length) return err('Falta una relación (Proveedor o Cliente) en la pestaña Relaciones.');
    guardar(conLog({ ...db, terceros: db.terceros.map((x) => (x.codigo === codigo ? { ...x, estado: 'Validado' } : x)) }, 'validar', `tercero:${codigo}`, autor));
    return bien(codigo);
  },
  provisionalTercero(codigo: string, autor: string): Res {
    if (db.proveedores.some((p) => p.tercero === codigo) && db.pedidos.some((p) => p.proveedor === codigo)) return err('El tercero tiene documentos: no se puede pasar a provisional.');
    guardar(conLog({ ...db, terceros: db.terceros.map((x) => (x.codigo === codigo ? { ...x, estado: 'Provisional' } : x)) }, 'provisional', `tercero:${codigo}`, autor));
    return bien(codigo);
  },

  /* ---------- proveedores */
  guardarProveedor(p: Proveedor, autor: string): Res {
    if (!p.tercero.trim()) return err('El campo «Tercero» es obligatorio: elige el tercero que das de alta como proveedor.');
    const t = db.terceros.find((x) => x.codigo === up(p.tercero));
    if (!t) return err(`El «Tercero» ${p.tercero} no existe. Créalo primero en Terceros.`);
    if (!t.relaciones.some((r) => r.tipo === 'Proveedor')) return err(`El tercero ${t.codigo} no tiene relación de tipo Proveedor (ACR o PRO).`);
    if (t.estado !== 'Validado') return err(`El tercero ${t.codigo} está en Provisional. Valídalo antes de darlo de alta como proveedor.`);
    if (!p.plazoPago) return err('El campo «Plazo pago» es obligatorio.');
    const existe = db.proveedores.find((x) => x.tercero === t.codigo);
    if (existe?.autor === 'TUTORIAL') return err('Este proveedor es de la base TUTORIAL y no se puede modificar.');
    const { sembrado: _s, ...resto } = p;
    void _s;
    const nuevo = { ...resto, tercero: t.codigo, autor };
    const lista = existe ? db.proveedores.map((x) => (x.tercero === t.codigo ? nuevo : x)) : [...db.proveedores, nuevo];
    guardar(conLog({ ...db, proveedores: lista }, existe ? 'editar' : 'crear', `proveedor:${t.codigo}`, autor));
    return bien(t.codigo);
  },

  /* ---------- artículos */
  guardarArticulo(a: Articulo, autor: string): Res {
    const codigo = up(a.codigo);
    if (!codigo) return err('El campo «Código» es obligatorio.');
    if (!a.nombre.trim()) return err('El campo «Descripción» es obligatorio.');
    if (!a.familia) return err('El campo «Familia» es obligatorio: propone la clave fiscal y la naturaleza.');
    const existe = db.articulos.find((x) => x.codigo === codigo);
    if (existe?.autor === 'TUTORIAL') return err(`El artículo ${codigo} pertenece a la base TUTORIAL y no se puede modificar.`);
    if (existe?.estado === 'Activo') return err('El artículo está Activo. Pásalo a provisional para modificarlo.');
    const nuevo: Articulo = { ...a, codigo, autor, estado: 'Provisional' };
    const lista = existe ? db.articulos.map((x) => (x.codigo === codigo ? nuevo : x)) : [...db.articulos, nuevo];
    guardar(conLog({ ...db, articulos: lista }, existe ? 'editar' : 'crear', `articulo:${codigo}`, autor));
    return bien(codigo);
  },
  estadoArticulo(codigo: string, estado: Articulo['estado'], autor: string): Res {
    const a = db.articulos.find((x) => x.codigo === codigo);
    if (!a) return err('No existe el artículo.');
    if (a.autor === 'TUTORIAL') return err('Artículo de la base TUTORIAL: no se puede cambiar.');
    if (estado === 'Activo' && a.tipoContable !== 'PROD') return err(`Cuenta contable de compras no definida para el tipo contable ${a.tipoContable}. Para comprarlo usa el tipo PRODUCTO (PROD).`);
    guardar(conLog({ ...db, articulos: db.articulos.map((x) => (x.codigo === codigo ? { ...x, estado } : x)) }, estado === 'Activo' ? 'validar' : 'provisional', `articulo:${codigo}`, autor));
    return bien(codigo);
  },

  /* ---------- pedidos */
  nuevoPedido(proveedor: string, autor: string): Res {
    const p = db.proveedores.find((x) => x.tercero === up(proveedor));
    if (!p) return err(`El proveedor ${proveedor} no existe en el Maestro de proveedores.`);
    const n = (db.contadores.PC ?? 0) + 1;
    const doc: Pedido = { numero: numero('PC', n), tipo: 'PC', proveedor: p.tercero, fecha: hoy(), almacen: '0', delegacion: 'CENTRAL', referencia: '', lineas: [], estado: 'Provisional', autor };
    guardar(conLog({ ...db, pedidos: [...db.pedidos, doc], contadores: { ...db.contadores, PC: n } }, 'crear', `pedido:${doc.numero}`, autor));
    return bien(doc.numero);
  },
  guardarPedido(p: Pedido, autor: string): Res {
    const prev = db.pedidos.find((x) => x.numero === p.numero);
    if (!prev) return err('No existe el pedido.');
    if (prev.estado === 'Validado') return err('El pedido está validado. Pulsa «Pasar a provisional» para modificarlo.');
    for (const l of p.lineas) {
      if (!l.articulo.trim()) return err(`Línea ${l.n}: el campo «Artículo» es obligatorio. Elige el artículo en la lista de la línea.`);
      const a = db.articulos.find((x) => x.codigo === up(l.articulo));
      if (!a) return err(`Línea ${l.n}: el «Artículo» ${l.articulo} no existe.`);
      if (a.estado !== 'Activo') return err(`Línea ${l.n}: el «Artículo» ${a.codigo} no está Activo. Valídalo en el Maestro de artículos.`);
      if (!(l.cantidad > 0)) return err(`Línea ${l.n}: el campo «Cantidad» debe ser mayor que 0.`);
      if (!(l.precio >= 0)) return err(`Línea ${l.n}: el campo «Precio» no es válido.`);
    }
    const lineas = p.lineas.map((l) => ({ ...l, articulo: up(l.articulo), descripcion: db.articulos.find((a) => a.codigo === up(l.articulo))?.nombre ?? l.descripcion }));
    guardar(conLog({ ...db, pedidos: db.pedidos.map((x) => (x.numero === p.numero ? { ...p, lineas } : x)) }, 'editar', `pedido:${p.numero}`, autor));
    return bien(p.numero);
  },
  estadoPedido(numeroDoc: string, estado: EstadoDoc, autor: string): Res {
    const p = db.pedidos.find((x) => x.numero === numeroDoc);
    if (!p) return err('No existe el pedido.');
    if (estado === 'Validado' && !p.lineas.length) return err('El pedido no tiene líneas.');
    if (estado === 'Provisional' && db.albaranes.some((a) => a.origen === numeroDoc)) return err('El pedido ya tiene albaranes generados: no se puede pasar a provisional.');
    guardar(conLog({ ...db, pedidos: db.pedidos.map((x) => (x.numero === numeroDoc ? { ...x, estado } : x)) }, estado === 'Validado' ? 'validar' : 'provisional', `pedido:${numeroDoc}`, autor));
    return bien(numeroDoc);
  },
  borrarPedido(numeroDoc: string, autor: string): Res {
    const p = db.pedidos.find((x) => x.numero === numeroDoc);
    if (!p) return err('No existe el pedido.');
    if (p.estado === 'Validado') return err('No se puede borrar un pedido validado.');
    guardar(conLog({ ...db, pedidos: db.pedidos.filter((x) => x.numero !== numeroDoc) }, 'borrar', `pedido:${numeroDoc}`, autor));
    return bien(numeroDoc);
  },
  /** «Generar albaranes»: copia las cantidades pendientes (o las indicadas por línea) del pedido validado */
  generarAlbaran(numeroPedido: string, cantidades: Record<number, number> | null, autor: string): Res {
    const p = db.pedidos.find((x) => x.numero === numeroPedido);
    if (!p) return err('No existe el pedido.');
    if (p.estado !== 'Validado') return err('Solo se generan albaranes de pedidos validados.');
    if (db.albaranes.some((a) => a.origen === numeroPedido && a.estado === 'Provisional')) return err('Hay un albarán provisional de este pedido. Valídalo o bórralo antes de generar otro.');
    const lineas: Linea[] = [];
    let n = 0;
    for (const l of p.lineas) {
      const pend = l.cantidad - servida(db, p.numero, l.n);
      const q = cantidades ? (cantidades[l.n] ?? 0) : pend;
      if (q > pend) return err(`Línea ${l.n}: no puedes recibir ${q}; quedan ${pend} pendientes.`);
      if (q > 0) lineas.push({ n: ++n, articulo: l.articulo, descripcion: l.descripcion, cantidad: q, precio: l.precio, dto: l.dto, origenLinea: l.n });
    }
    if (!lineas.length) return err('No queda nada pendiente de servir en este pedido.');
    const c = (db.contadores.AC ?? 0) + 1;
    const doc: Albaran = { numero: numero('AC', c), tipo: 'ACPC', proveedor: p.proveedor, fecha: hoy(), almacen: p.almacen, origen: p.numero, lineas, estado: 'Provisional', autor };
    guardar(conLog({ ...db, albaranes: [...db.albaranes, doc], contadores: { ...db.contadores, AC: c } }, 'generar', `albaran:${doc.numero}<pedido:${p.numero}`, autor));
    return bien(doc.numero);
  },
  guardarAlbaran(a: Albaran, autor: string): Res {
    const prev = db.albaranes.find((x) => x.numero === a.numero);
    if (!prev) return err('No existe el albarán.');
    if (prev.estado === 'Validado') return err('El albarán está validado. Pulsa «Pasar a provisional» para modificarlo.');
    for (const l of a.lineas) {
      if (!(l.cantidad > 0)) return err(`Línea ${l.n}: el campo «Cantidad» debe ser mayor que 0.`);
      if (l.origenLinea) {
        const pl = db.pedidos.find((p) => p.numero === a.origen)?.lineas.find((x) => x.n === l.origenLinea);
        const pend = (pl?.cantidad ?? 0) - servida(db, a.origen, l.origenLinea);
        if (l.cantidad > pend) return err(`Línea ${l.n}: en «Cantidad» recibes ${l.cantidad} pero en el pedido quedan ${pend} pendientes.`);
      }
    }
    guardar(conLog({ ...db, albaranes: db.albaranes.map((x) => (x.numero === a.numero ? a : x)) }, 'editar', `albaran:${a.numero}`, autor));
    return bien(a.numero);
  },
  estadoAlbaran(numeroDoc: string, estado: EstadoDoc, autor: string): Res {
    const a = db.albaranes.find((x) => x.numero === numeroDoc);
    if (!a) return err('No existe el albarán.');
    if (estado === 'Provisional' && facturaDeAlbaran(db, numeroDoc)) return err(`El albarán está conformado en la factura ${facturaDeAlbaran(db, numeroDoc)!.numero}. Desconfórmalo primero.`);
    guardar(conLog({ ...db, albaranes: db.albaranes.map((x) => (x.numero === numeroDoc ? { ...x, estado } : x)) }, estado === 'Validado' ? 'validar' : 'provisional', `albaran:${numeroDoc}`, autor));
    return bien(numeroDoc);
  },
  borrarAlbaran(numeroDoc: string, autor: string): Res {
    const a = db.albaranes.find((x) => x.numero === numeroDoc);
    if (!a) return err('No existe el albarán.');
    if (a.estado === 'Validado') return err('No se puede borrar un albarán validado.');
    guardar(conLog({ ...db, albaranes: db.albaranes.filter((x) => x.numero !== numeroDoc) }, 'borrar', `albaran:${numeroDoc}`, autor));
    return bien(numeroDoc);
  },
  /** «Generar factura»: agrupa albaranes validados y sin facturar del mismo proveedor */
  generarFactura(albaranes: string[], facturaProveedor: string, autor: string): Res {
    if (!albaranes.length) return err('Marca al menos un albarán.');
    const docs = albaranes.map((n) => db.albaranes.find((a) => a.numero === n));
    if (docs.some((a) => !a)) return err('Algún albarán no existe.');
    const prov = docs[0]!.proveedor;
    if (docs.some((a) => a!.proveedor !== prov)) return err('Todos los albaranes deben ser del mismo proveedor.');
    if (docs.some((a) => a!.estado !== 'Validado')) return err('Solo se facturan albaranes validados.');
    const ya = docs.find((a) => facturaDeAlbaran(db, a!.numero));
    if (ya) return err(`El albarán ${ya.numero} ya está facturado.`);
    if (!facturaProveedor.trim()) return err('Indica el número de «Factura proveedor» (el de su papel).');
    if (db.facturas.some((f) => f.proveedor === prov && up(f.facturaProveedor) === up(facturaProveedor))) return err(`Ya hay una factura de ${prov} con el número de proveedor ${facturaProveedor}. Factura duplicada.`);
    const c = (db.contadores.FC ?? 0) + 1;
    const doc: Factura = { numero: numero('FC', c), tipo: 'FCOA', proveedor: prov, facturaProveedor: facturaProveedor.trim(), fecha: hoy(), albaranes: [...albaranes], estado: 'Provisional', contabilizada: false, asiento: [], autor };
    guardar(conLog({ ...db, facturas: [...db.facturas, doc], contadores: { ...db.contadores, FC: c } }, 'generar', `factura:${doc.numero}<${albaranes.map((a) => `albaran:${a}`).join(',')}`, autor));
    return bien(doc.numero);
  },
  estadoFactura(numeroDoc: string, estado: EstadoDoc, autor: string): Res {
    const f = db.facturas.find((x) => x.numero === numeroDoc);
    if (!f) return err('No existe la factura.');
    if (estado === 'Provisional' && f.contabilizada) return err('La factura está contabilizada. Descontabilízala primero.');
    guardar(conLog({ ...db, facturas: db.facturas.map((x) => (x.numero === numeroDoc ? { ...x, estado } : x)) }, estado === 'Validado' ? 'validar' : 'provisional', `factura:${numeroDoc}`, autor));
    return bien(numeroDoc);
  },
  contabilizar(numeroDoc: string, si: boolean, autor: string): Res {
    const f = db.facturas.find((x) => x.numero === numeroDoc);
    if (!f) return err('No existe la factura.');
    if (si && f.estado !== 'Validado') return err('Valida la factura antes de contabilizarla.');
    const t = db.terceros.find((x) => x.codigo === f.proveedor);
    if (si && !t?.relaciones.some((r) => r.codigo === 'PRO')) return err(`No se encuentra la cuenta contable del proveedor: el tercero ${f.proveedor} no tiene la relación PRO (40000.00000). Añádela en Terceros › Relaciones.`);
    const asiento = si ? asientoPrevisto(db, f) : [];
    const efs = db.efectos.filter((e) => e.docser === f.numero);
    if (!si && efs.some((e) => e.estado !== 'PE')) return err(`El efecto ${efs.find((e) => e.estado !== 'PE')!.numero} ya está en una remesa o pagado. Retrocédelo antes de descontabilizar la factura.`);
    let d: Db = { ...db, facturas: db.facturas.map((x) => (x.numero === numeroDoc ? { ...x, contabilizada: si, asiento } : x)) };
    if (si) {
      const nAsi = (d.contadores.ASI ?? 100) + 1;
      const asi: Asiento = { numero: nAsi, fecha: f.fecha, diario: 'COM', jusser: 'FC', docser: f.numero, origen: 'FCOA', estado: 'C', apuntes: asiento.map((l, i) => ({ orden: i + 1, ...l })), autor };
      const prov = d.proveedores.find((p) => p.tercero === f.proveedor);
      const total = asiento.reduce((x, l) => x + l.haber, 0);
      const dias = prov?.plazoPago === 'CON' ? [0] : prov?.plazoPago === '60D' ? [60] : prov?.plazoPago === '3060' ? [30, 60] : [30];
      let nEfe = d.contadores.EFE ?? 40;
      const cta = asiento.find((l) => l.haber > 0)?.cuenta ?? '40000.00000';
      const nuevos: Efecto[] = dias.map((dd, i) => ({
        numero: ++nEfe,
        clase: 'P',
        tercero: f.proveedor,
        cuenta: cta,
        docser: f.numero,
        numefe: i + 1,
        fecha: f.fecha,
        fecven: sumaDias(f.fecha, dd),
        importe: i === dias.length - 1 ? r2(total - r2(total / dias.length) * (dias.length - 1)) : r2(total / dias.length),
        tipefe: prov?.tipoEfecto ?? 'TF',
        estado: 'PE',
        remesa: null,
        autor,
      }));
      d = { ...d, asientos: [...d.asientos, asi], efectos: [...d.efectos, ...nuevos], contadores: { ...d.contadores, ASI: nAsi, EFE: nEfe } };
    } else {
      d = { ...d, asientos: d.asientos.filter((a) => !(a.origen === 'FCOA' && a.docser === f.numero)), efectos: d.efectos.filter((e) => e.docser !== f.numero) };
    }
    guardar(conLog(d, si ? 'contabilizar' : 'descontabilizar', `factura:${numeroDoc}`, autor));
    return bien(numeroDoc);
  },
  quitarAlbaranDeFactura(numeroDoc: string, alb: string, autor: string): Res {
    const f = db.facturas.find((x) => x.numero === numeroDoc);
    if (!f) return err('No existe la factura.');
    if (f.estado !== 'Provisional') return err('Pasa la factura a provisional para desconformar albaranes.');
    if (f.albaranes.length === 1) return err('La factura se quedaría sin albaranes. Bórrala en su lugar.');
    guardar(conLog({ ...db, facturas: db.facturas.map((x) => (x.numero === numeroDoc ? { ...x, albaranes: x.albaranes.filter((a) => a !== alb) } : x)) }, 'desconformar', `factura:${numeroDoc}>albaran:${alb}`, autor));
    return bien(numeroDoc);
  },
  borrarFactura(numeroDoc: string, autor: string): Res {
    const f = db.facturas.find((x) => x.numero === numeroDoc);
    if (!f) return err('No existe la factura.');
    if (f.estado !== 'Provisional') return err('Solo se borran facturas en provisional.');
    guardar(conLog({ ...db, facturas: db.facturas.filter((x) => x.numero !== numeroDoc) }, 'borrar', `factura:${numeroDoc}`, autor));
    return bien(numeroDoc);
  },
  guardarFactura(f: Factura, autor: string): Res {
    const prev = db.facturas.find((x) => x.numero === f.numero);
    if (!prev) return err('No existe la factura.');
    if (prev.estado !== 'Provisional') return err('La factura está validada. Pásala a provisional para modificarla.');
    if (!f.facturaProveedor.trim()) return err('El campo «Factura proveedor» es obligatorio: es el número de la factura en papel del proveedor.');
    if (!f.fecha) return err('El campo «Fecha» es obligatorio.');
    guardar(conLog({ ...db, facturas: db.facturas.map((x) => (x.numero === f.numero ? { ...prev, facturaProveedor: f.facturaProveedor, fecha: f.fecha } : x)) }, 'editar', `factura:${f.numero}`, autor));
    return bien(f.numero);
  },
};

/* ------------------------------------------------------------------ catálogos para desplegables */
export const CAT = {
  familias: [
    { v: '01.01.001352', t: 'RODAMIENTOS RÍGIDOS DE BOLAS' },
    { v: '01.01.001400', t: 'RETENES Y JUNTAS' },
    { v: '02.03.000100', t: 'SERVICIOS DE MANTENIMIENTO' },
  ],
  unidades: ['UNIDAD', 'CAJA', 'KG', 'METRO'],
  tiposContables: [
    { v: 'PROD', t: 'PRODUCTO (PROD)' },
    { v: 'VEN', t: 'VENTA (VEN)' },
    { v: 'SERV', t: 'SERVICIO (SERV)' },
  ],
  plazos: [
    { v: 'CON', t: 'Contado' },
    { v: '30D', t: '30 días' },
    { v: '60D', t: '60 días' },
    { v: '3060', t: '2 Vtos. 30 y 60 días' },
  ],
  efectos: [
    { v: 'TF', t: 'TF · Transferencia' },
    { v: 'EF', t: 'EF · Efectivo' },
    { v: 'RD', t: 'RD · Recibo domiciliado' },
  ],
  zonas: [
    { v: 'ESCO', t: 'ESCO · España común' },
    { v: 'ESCA', t: 'ESCA · Canarias' },
    { v: 'CEE', t: 'CEE · Intracomunitario' },
  ],
  relaciones: [
    { tipo: 'Proveedor', codigo: 'ACR', cuenta: '41000.00000', t: 'Proveedor · ACR · Acreedores (41000.00000)' },
    { tipo: 'Proveedor', codigo: 'PRO', cuenta: '40000.00000', t: 'Proveedor · PRO · Proveedores (40000.00000)' },
    { tipo: 'Cliente', codigo: 'CLI', cuenta: '43000.00000', t: 'Cliente · CLI · Clientes (43000.00000)' },
  ] as const,
};

/* ------------------------------------------------------------------ finanzas: cálculos */
export const sumaDebe = (a: Asiento) => r2(a.apuntes.reduce((s, x) => s + (x.debe || 0), 0));
export const sumaHaber = (a: Asiento) => r2(a.apuntes.reduce((s, x) => s + (x.haber || 0), 0));
export const cuadra = (a: Asiento) => sumaDebe(a) > 0 && Math.abs(sumaDebe(a) - sumaHaber(a)) < 0.005;
export const importeRemesa = (d: Db, r: Remesa) => r2(r.efectos.reduce((s, n) => s + (d.efectos.find((e) => e.numero === n)?.importe ?? 0), 0));
/** Cuenta contable de una cuenta financiera (Bancos propios) */
export const cuentaBanco = (ctafin: string) => CUENTAS_FIN.find((c) => c.ctafin === ctafin)?.cuenta ?? '57200.00000';
/** Apuntes de bancos (57x) de asientos contabilizados, con su asiento */
export function apuntesBanco(d: Db, ctafin?: string) {
  const cta = ctafin ? cuentaBanco(ctafin) : null;
  return d.asientos
    .filter((a) => a.estado === 'C')
    .flatMap((a) => a.apuntes.map((p) => ({ asiento: a, apunte: p })))
    .filter(({ apunte }) => (cta ? apunte.cuenta === cta : /^57/.test(apunte.cuenta)));
}
/** Importe del apunte visto desde el banco: debe = entra dinero (+), haber = sale (−) */
export const importeBanco = (p: Apunte) => r2((p.debe || 0) - (p.haber || 0));
export const CUENTAS_FIN = [
  { ctafin: 'BBVA_CA', nombre: 'BBVA cuenta corriente CA', cuenta: '57200.00000' },
  { ctafin: 'CAPT_BCO', nombre: 'CAP Tesoreria banco captura', cuenta: '57200.00000' },
  { ctafin: 'CAJA_CA', nombre: 'Caja efectivo CA', cuenta: '57000.00000' },
];
/** Plan contable reducido de la base TUTORIAL (PGE 2008) para validar cuentas */
export const PLAN: { cuenta: string; nombre: string }[] = [
  { cuenta: '40000.00000', nombre: 'Proveedores' },
  { cuenta: '41000.00000', nombre: 'Acreedores por prestaciones de servicios' },
  { cuenta: '43000.00000', nombre: 'Clientes' },
  { cuenta: '47200.00021', nombre: 'H.P. IVA soportado 21 %' },
  { cuenta: '47700.00021', nombre: 'H.P. IVA repercutido 21 %' },
  { cuenta: '57000.00000', nombre: 'Caja, euros' },
  { cuenta: '57200.00000', nombre: 'Bancos e instituciones de crédito c/c vista, euros' },
  { cuenta: '60000.00000', nombre: 'Compras de mercaderías' },
  { cuenta: '62100.00000', nombre: 'Arrendamientos y cánones' },
  { cuenta: '62600.00000', nombre: 'Servicios bancarios y similares' },
  { cuenta: '62800.00000', nombre: 'Suministros' },
  { cuenta: '64000.00000', nombre: 'Sueldos y salarios' },
  { cuenta: '70000.00000', nombre: 'Ventas de mercaderías' },
];
const cuentaValida = (c: string) => PLAN.some((p) => p.cuenta === c) || /^4[03]000\.\w{5}$/.test(c);

/* ------------------------------------------------------------------ finanzas: acciones */
export const fin = {
  /* ---------- asientos (casientos / capuntes) */
  nuevoAsiento(autor: string): Res {
    const n = (db.contadores.ASI ?? 100) + 1;
    const a: Asiento = { numero: n, fecha: hoy(), diario: 'GEN', jusser: 'AS', docser: '', origen: 'MAN', estado: 'P', apuntes: [], autor };
    guardar(conLog({ ...db, asientos: [...db.asientos, a], contadores: { ...db.contadores, ASI: n } }, 'crear', `asiento:${n}`, autor));
    return bien(String(n));
  },
  guardarAsiento(a: Asiento, autor: string): Res {
    const prev = db.asientos.find((x) => x.numero === a.numero);
    if (!prev) return err('No existe el asiento.');
    if (prev.estado === 'C') return err('El asiento está contabilizado. Pulsa «Abrir a provisional» para modificarlo.');
    if (prev.origen !== 'MAN') return err(`El asiento procede de ${prev.origen === 'FCOA' ? 'una factura de compra' : 'una remesa'}: se modifica desde el documento de origen.`);
    for (const p of a.apuntes) {
      const cta = up(p.cuenta);
      if (!cuentaValida(cta)) return err(`Línea ${p.orden}: la cuenta ${p.cuenta} no existe en el plan contable PGE 2008.`);
      if ((p.debe || 0) < 0 || (p.haber || 0) < 0) return err(`Línea ${p.orden}: los importes no pueden ser negativos.`);
      if ((p.debe || 0) > 0 && (p.haber || 0) > 0) return err(`Línea ${p.orden}: un apunte va al debe o al haber, no a los dos.`);
      if (!(p.debe || 0) && !(p.haber || 0)) return err(`Línea ${p.orden}: indica el importe al debe o al haber.`);
    }
    const apuntes = a.apuntes.map((p, i) => ({ ...p, orden: i + 1, cuenta: up(p.cuenta), debe: r2(p.debe || 0), haber: r2(p.haber || 0) }));
    guardar(conLog({ ...db, asientos: db.asientos.map((x) => (x.numero === a.numero ? { ...a, apuntes } : x)) }, 'editar', `asiento:${a.numero}`, autor));
    return bien(String(a.numero));
  },
  /** «Finalizar»: comprueba el cuadre y lo deja contabilizado */
  finalizarAsiento(n: number, autor: string): Res {
    const a = db.asientos.find((x) => x.numero === n);
    if (!a) return err('No existe el asiento.');
    if (a.estado === 'C') return err('El asiento ya está finalizado.');
    if (a.apuntes.length < 2) return err('Un asiento necesita al menos dos apuntes.');
    if (!cuadra(a)) return err(`Asiento descuadrado: Debe ${eurTxt(sumaDebe(a))} · Haber ${eurTxt(sumaHaber(a))} · diferencia ${eurTxt(r2(sumaDebe(a) - sumaHaber(a)))}.`);
    guardar(conLog({ ...db, asientos: db.asientos.map((x) => (x.numero === n ? { ...x, estado: 'C' } : x)) }, 'finalizar', `asiento:${n}`, autor));
    return bien(String(n));
  },
  abrirAsiento(n: number, autor: string): Res {
    const a = db.asientos.find((x) => x.numero === n);
    if (!a) return err('No existe el asiento.');
    if (a.estado === 'P') return err('El asiento ya está en provisional.');
    if (a.origen !== 'MAN') return err('Los asientos generados por documentos se abren descontabilizando el documento de origen.');
    if (a.apuntes.some((p) => p.conciliado)) return err('El asiento tiene apuntes conciliados con el extracto bancario. Desconcílialos primero.');
    guardar(conLog({ ...db, asientos: db.asientos.map((x) => (x.numero === n ? { ...x, estado: 'P' } : x)) }, 'provisional', `asiento:${n}`, autor));
    return bien(String(n));
  },
  copiarAsiento(n: number, autor: string): Res {
    const a = db.asientos.find((x) => x.numero === n);
    if (!a) return err('No existe el asiento.');
    const m = (db.contadores.ASI ?? 100) + 1;
    const c: Asiento = { ...a, numero: m, fecha: hoy(), origen: 'MAN', estado: 'P', apuntes: a.apuntes.map((p) => ({ ...p, conciliado: undefined })), autor };
    guardar(conLog({ ...db, asientos: [...db.asientos, c], contadores: { ...db.contadores, ASI: m } }, 'copiar', `asiento:${m}<asiento:${n}`, autor));
    return bien(String(m));
  },
  borrarAsiento(n: number, autor: string): Res {
    const a = db.asientos.find((x) => x.numero === n);
    if (!a) return err('No existe el asiento.');
    if (a.estado === 'C') return err('No se puede borrar un asiento contabilizado.');
    if (a.origen !== 'MAN') return err('El asiento procede de un documento: no se borra desde aquí.');
    guardar(conLog({ ...db, asientos: db.asientos.filter((x) => x.numero !== n) }, 'borrar', `asiento:${n}`, autor));
    return bien(String(n));
  },

  /* ---------- cartera de efectos (cefectos) */
  /** «Evolucionar estado» / «Retroceder» manual de un efecto suelto */
  estadoEfecto(n: number, estado: EstadoEfecto, autor: string): Res {
    const e = db.efectos.find((x) => x.numero === n);
    if (!e) return err('No existe el efecto.');
    if (e.remesa !== null) return err(`El efecto está en la remesa ${e.remesa}. Gestiónalo desde la remesa.`);
    if (estado === e.estado) return err('El efecto ya está en ese estado.');
    if (estado === 'OP') return err('El estado «Ordenado» lo pone la remesa al incluir el efecto.');
    guardar(conLog({ ...db, efectos: db.efectos.map((x) => (x.numero === n ? { ...x, estado } : x)) }, 'evolucionar', `efecto:${n}`, autor));
    return bien(String(n));
  },

  /* ---------- remesas (cremesas) */
  nuevaRemesa(clase: 'P' | 'C', tipdoc: string, ctafin: string, autor: string): Res {
    if (!ctafin) return err('El campo «Cuenta financiera» es obligatorio.');
    if (!tipdoc) return err('El campo «Tipo remesa» es obligatorio.');
    const n = (db.contadores.REM ?? 10) + 1;
    const r: Remesa = { numrem: n, clase, tipdoc, fecrem: hoy(), fecval: hoy(), ctafin, estrem: 'A', efectos: [], asiento: null, autor };
    guardar(conLog({ ...db, remesas: [...db.remesas, r], contadores: { ...db.contadores, REM: n } }, 'crear', `remesa:${n}`, autor));
    return bien(String(n));
  },
  guardarRemesa(r: Remesa, autor: string): Res {
    const prev = db.remesas.find((x) => x.numrem === r.numrem);
    if (!prev) return err('No existe la remesa.');
    if (prev.estrem === 'C') return err('La remesa está cerrada. Pulsa «Retroceder» para modificarla.');
    guardar(conLog({ ...db, remesas: db.remesas.map((x) => (x.numrem === r.numrem ? { ...prev, fecrem: r.fecrem, fecval: r.fecval, ctafin: r.ctafin, tipdoc: r.tipdoc } : x)) }, 'editar', `remesa:${r.numrem}`, autor));
    return bien(String(r.numrem));
  },
  /** Selección de efectos: los incluye en la remesa y pasan a «Ordenado» */
  incluirEfectos(numrem: number, efectos: number[], autor: string): Res {
    const r = db.remesas.find((x) => x.numrem === numrem);
    if (!r) return err('No existe la remesa.');
    if (r.estrem === 'C') return err('La remesa está cerrada.');
    if (!efectos.length) return err('Marca al menos un efecto.');
    for (const n of efectos) {
      const e = db.efectos.find((x) => x.numero === n);
      if (!e) return err(`El efecto ${n} no existe.`);
      if (e.clase !== r.clase) return err(`El efecto ${n} es de ${e.clase === 'P' ? 'pago' : 'cobro'} y la remesa de ${r.clase === 'P' ? 'pagos' : 'cobros'}.`);
      if (e.estado !== 'PE') return err(`El efecto ${n} no está pendiente.`);
      if (e.remesa !== null) return err(`El efecto ${n} ya está en la remesa ${e.remesa}.`);
    }
    guardar(
      conLog(
        { ...db, remesas: db.remesas.map((x) => (x.numrem === numrem ? { ...x, efectos: [...x.efectos, ...efectos] } : x)), efectos: db.efectos.map((e) => (efectos.includes(e.numero) ? { ...e, estado: 'OP', remesa: numrem } : e)) },
        'incluir',
        `remesa:${numrem}>${efectos.map((n) => `efecto:${n}`).join(',')}`,
        autor,
      ),
    );
    return bien(String(numrem));
  },
  quitarEfecto(numrem: number, n: number, autor: string): Res {
    const r = db.remesas.find((x) => x.numrem === numrem);
    if (!r) return err('No existe la remesa.');
    if (r.estrem === 'C') return err('La remesa está cerrada. Retrocédela antes de quitar efectos.');
    guardar(conLog({ ...db, remesas: db.remesas.map((x) => (x.numrem === numrem ? { ...x, efectos: x.efectos.filter((e) => e !== n) } : x)), efectos: db.efectos.map((e) => (e.numero === n ? { ...e, estado: 'PE', remesa: null } : e)) }, 'quitar', `remesa:${numrem}>efecto:${n}`, autor));
    return bien(String(numrem));
  },
  /** «Evolucionar estado» de la remesa: la cierra, paga (o cobra) sus efectos y genera el asiento contra el banco */
  cerrarRemesa(numrem: number, autor: string): Res {
    const r = db.remesas.find((x) => x.numrem === numrem);
    if (!r) return err('No existe la remesa.');
    if (r.estrem === 'C') return err('La remesa ya está cerrada.');
    if (!r.efectos.length) return err('La remesa no tiene efectos. Añádelos en «Selección de efectos».');
    const efs = r.efectos.map((n) => db.efectos.find((e) => e.numero === n)!).filter(Boolean);
    const total = importeRemesa(db, r);
    const banco = cuentaBanco(r.ctafin);
    const nAsi = (db.contadores.ASI ?? 100) + 1;
    const apuntes: Apunte[] =
      r.clase === 'P'
        ? [...efs.map((e, i) => ({ orden: i + 1, cuenta: e.cuenta, concepto: `Pago efecto ${e.numero} ${e.docser}`, debe: e.importe, haber: 0 })), { orden: efs.length + 1, cuenta: banco, concepto: `Remesa de pagos ${numrem}`, debe: 0, haber: total }]
        : [{ orden: 1, cuenta: banco, concepto: `Remesa de cobros ${numrem}`, debe: total, haber: 0 }, ...efs.map((e, i) => ({ orden: i + 2, cuenta: e.cuenta, concepto: `Cobro efecto ${e.numero} ${e.docser}`, debe: 0, haber: e.importe }))];
    const asi: Asiento = { numero: nAsi, fecha: r.fecval, diario: 'TES', jusser: 'RM', docser: `REM ${numrem}`, origen: 'REM', estado: 'C', apuntes, autor };
    const fin_: EstadoEfecto = r.clase === 'P' ? 'PA' : 'CO';
    guardar(
      conLog(
        {
          ...db,
          remesas: db.remesas.map((x) => (x.numrem === numrem ? { ...x, estrem: 'C', asiento: nAsi } : x)),
          efectos: db.efectos.map((e) => (r.efectos.includes(e.numero) ? { ...e, estado: fin_ } : e)),
          asientos: [...db.asientos, asi],
          contadores: { ...db.contadores, ASI: nAsi },
        },
        'cerrar',
        `remesa:${numrem}>asiento:${nAsi}`,
        autor,
      ),
    );
    return bien(String(nAsi));
  },
  /** «Retroceder»: reabre la remesa, borra su asiento y deja los efectos en Ordenado */
  retrocederRemesa(numrem: number, autor: string): Res {
    const r = db.remesas.find((x) => x.numrem === numrem);
    if (!r) return err('No existe la remesa.');
    if (r.estrem === 'A') return err('La remesa ya está abierta.');
    const a = db.asientos.find((x) => x.numero === r.asiento);
    if (a?.apuntes.some((p) => p.conciliado)) return err('El asiento de la remesa está conciliado con el extracto bancario. Desconcilia antes de retroceder.');
    guardar(
      conLog(
        { ...db, remesas: db.remesas.map((x) => (x.numrem === numrem ? { ...x, estrem: 'A', asiento: null } : x)), efectos: db.efectos.map((e) => (r.efectos.includes(e.numero) ? { ...e, estado: 'OP' } : e)), asientos: db.asientos.filter((x) => x.numero !== r.asiento) },
        'retroceder',
        `remesa:${numrem}`,
        autor,
      ),
    );
    return bien(String(numrem));
  },
  borrarRemesa(numrem: number, autor: string): Res {
    const r = db.remesas.find((x) => x.numrem === numrem);
    if (!r) return err('No existe la remesa.');
    if (r.estrem === 'C') return err('No se puede borrar una remesa cerrada.');
    guardar(conLog({ ...db, remesas: db.remesas.filter((x) => x.numrem !== numrem), efectos: db.efectos.map((e) => (e.remesa === numrem ? { ...e, estado: 'PE', remesa: null } : e)) }, 'borrar', `remesa:${numrem}`, autor));
    return bien(String(numrem));
  },

  /* ---------- extractos bancarios (textract) y conciliación */
  nuevoMovimiento(m: Omit<MovBanco, 'orden' | 'conciliado' | 'autor'>, autor: string): Res {
    if (!m.ctafin) return err('El campo «Cuenta financiera» es obligatorio.');
    if (!m.fecope) return err('El campo «Fecha operación» es obligatorio.');
    if (!m.importe) return err('El campo «Importe extracto» es obligatorio (negativo si es un cargo).');
    const n = (db.contadores.EXT ?? 3) + 1;
    guardar(conLog({ ...db, extractos: [...db.extractos, { ...m, importe: r2(m.importe), orden: n, conciliado: null, autor }], contadores: { ...db.contadores, EXT: n } }, 'crear', `extracto:${n}`, autor));
    return bien(String(n));
  },
  guardarMovimiento(m: MovBanco, autor: string): Res {
    const prev = db.extractos.find((x) => x.orden === m.orden);
    if (!prev) return err('No existe el movimiento.');
    if (prev.conciliado) return err('El movimiento está conciliado. Desconcílialo para modificarlo.');
    if (prev.autor === 'TUTORIAL') return err('Movimiento importado del fichero del banco (Norma 43): no se modifica.');
    guardar(conLog({ ...db, extractos: db.extractos.map((x) => (x.orden === m.orden ? { ...m, importe: r2(m.importe) } : x)) }, 'editar', `extracto:${m.orden}`, autor));
    return bien(String(m.orden));
  },
  borrarMovimiento(orden: number, autor: string): Res {
    const m = db.extractos.find((x) => x.orden === orden);
    if (!m) return err('No existe el movimiento.');
    if (m.conciliado) return err('No se puede borrar un movimiento conciliado.');
    if (m.autor === 'TUTORIAL') return err('Movimiento importado del fichero del banco (Norma 43): no se borra.');
    guardar(conLog({ ...db, extractos: db.extractos.filter((x) => x.orden !== orden) }, 'borrar', `extracto:${orden}`, autor));
    return bien(String(orden));
  },
  /** Concilia un movimiento del extracto con un apunte de banco del mismo importe */
  conciliar(orden: number, asiento: number, ordenApunte: number, autor: string): Res {
    const m = db.extractos.find((x) => x.orden === orden);
    const a = db.asientos.find((x) => x.numero === asiento);
    const p = a?.apuntes.find((x) => x.orden === ordenApunte);
    if (!m) return err('No existe el movimiento del extracto.');
    if (!a || !p) return err('No existe el apunte contable.');
    if (m.conciliado) return err(`El movimiento ${orden} ya está conciliado.`);
    if (p.conciliado) return err(`El apunte ${asiento}/${ordenApunte} ya está conciliado.`);
    if (a.estado !== 'C') return err('Solo se concilian apuntes de asientos contabilizados.');
    if (p.cuenta !== cuentaBanco(m.ctafin)) return err(`El apunte es de la cuenta ${p.cuenta} y el extracto de ${m.ctafin} (${cuentaBanco(m.ctafin)}).`);
    if (Math.abs(importeBanco(p) - m.importe) > 0.005) return err(`Los importes no coinciden: extracto ${eurTxt(m.importe)} · contabilidad ${eurTxt(importeBanco(p))}.`);
    guardar(
      conLog(
        { ...db, extractos: db.extractos.map((x) => (x.orden === orden ? { ...x, conciliado: { asiento, orden: ordenApunte } } : x)), asientos: db.asientos.map((x) => (x.numero === asiento ? { ...x, apuntes: x.apuntes.map((q) => (q.orden === ordenApunte ? { ...q, conciliado: orden } : q)) } : x)) },
        'conciliar',
        `extracto:${orden}>asiento:${asiento}`,
        autor,
      ),
    );
    return bien(String(orden));
  },
  desconciliar(orden: number, autor: string): Res {
    const m = db.extractos.find((x) => x.orden === orden);
    if (!m) return err('No existe el movimiento.');
    if (!m.conciliado) return err('El movimiento no está conciliado.');
    const { asiento, orden: oa } = m.conciliado;
    guardar(
      conLog(
        { ...db, extractos: db.extractos.map((x) => (x.orden === orden ? { ...x, conciliado: null } : x)), asientos: db.asientos.map((x) => (x.numero === asiento ? { ...x, apuntes: x.apuntes.map((q) => (q.orden === oa ? { ...q, conciliado: undefined } : q)) } : x)) },
        'desconciliar',
        `extracto:${orden}`,
        autor,
      ),
    );
    return bien(String(orden));
  },
  /** «Conciliar automático»: empareja por cuenta e importe exacto (el primero libre) */
  conciliarAutomatico(ctafin: string, autor: string): Res {
    let d = db;
    let n = 0;
    for (const m of d.extractos.filter((x) => x.ctafin === ctafin && !x.conciliado)) {
      const cand = apuntesBanco(d, ctafin).find(({ apunte }) => !apunte.conciliado && Math.abs(importeBanco(apunte) - m.importe) < 0.005);
      if (!cand) continue;
      const { asiento: a, apunte: p } = cand;
      d = { ...d, extractos: d.extractos.map((x) => (x.orden === m.orden ? { ...x, conciliado: { asiento: a.numero, orden: p.orden } } : x)), asientos: d.asientos.map((x) => (x.numero === a.numero ? { ...x, apuntes: x.apuntes.map((q) => (q.orden === p.orden ? { ...q, conciliado: m.orden } : q)) } : x)) };
      n++;
    }
    if (!n) return err('No se ha encontrado ninguna pareja extracto-contabilidad con el mismo importe.');
    guardar(conLog(d, 'conciliar', `automatico:${ctafin}:${n}`, autor));
    return bien(String(n));
  },
};
