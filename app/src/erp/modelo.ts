/* ERP de práctica: réplica simplificada de Axional VNext (base TUTORIAL) que vive en localStorage.
   Circuito de compras: tercero → proveedor → artículo → pedido (PC) → albarán (ACPC) → factura (FCOA). */
import { useSyncExternalStore } from 'react';

export type EstadoDoc = 'Provisional' | 'Validado';
export type Pantalla = 'inicio' | 'terceros' | 'proveedores' | 'articulos' | 'pedidos' | 'albaranes' | 'facturas' | 'stock' | 'docflow';

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
}

const CLAVE = 'oys-erp-sim-v1';
const IVA = 0.21;
export const r2 = (n: number) => Math.round((n + Number.EPSILON) * 100) / 100;
export const hoy = () => new Date().toISOString().slice(0, 10);

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
    contadores: { PC: 0, AC: 1, FC: 0 }, // el albarán 0AC000001 «ya existe» en la TUTORIAL
    log: [],
  };
}

function leer(): Db {
  try {
    const raw = localStorage.getItem(CLAVE);
    if (!raw) return semilla();
    const d = JSON.parse(raw) as Db;
    return d.version === 1 ? { ...semilla(), ...d } : semilla();
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

  /* ---------- terceros */
  guardarTercero(t: Tercero, autor: string): Res {
    const codigo = up(t.codigo);
    if (!codigo) return err('El campo «Código» es obligatorio.');
    if (!t.nombre.trim()) return err('El campo «Nombre» es obligatorio.');
    if (t.tipoId === 'NIF-Empresa' && !/^[A-Z]\d{7}[A-Z0-9]$/i.test(t.nif.trim())) return err('Id. fiscal no válido para NIF-Empresa (formato B12345674). Si no lo tienes, usa «No censado» con Id. fiscal 0.');
    const existe = db.terceros.find((x) => x.codigo === codigo);
    if (existe && existe.autor === 'TUTORIAL') return err(`El tercero ${codigo} pertenece a la base TUTORIAL y no se puede modificar.`);
    const nuevo: Tercero = { ...t, codigo, nif: t.nif.trim().toUpperCase(), autor };
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
    const t = db.terceros.find((x) => x.codigo === up(p.tercero));
    if (!t) return err(`El tercero ${p.tercero} no existe. Créalo primero en Terceros.`);
    if (!t.relaciones.some((r) => r.tipo === 'Proveedor')) return err(`El tercero ${t.codigo} no tiene relación de tipo Proveedor (ACR o PRO).`);
    if (t.estado !== 'Validado') return err(`El tercero ${t.codigo} está en Provisional. Valídalo antes de darlo de alta como proveedor.`);
    if (!p.plazoPago) return err('Indica el plazo de pago.');
    const existe = db.proveedores.find((x) => x.tercero === t.codigo);
    if (existe?.autor === 'TUTORIAL') return err('Este proveedor es de la base TUTORIAL y no se puede modificar.');
    const nuevo = { ...p, tercero: t.codigo, autor };
    const lista = existe ? db.proveedores.map((x) => (x.tercero === t.codigo ? nuevo : x)) : [...db.proveedores, nuevo];
    guardar(conLog({ ...db, proveedores: lista }, existe ? 'editar' : 'crear', `proveedor:${t.codigo}`, autor));
    return bien(t.codigo);
  },

  /* ---------- artículos */
  guardarArticulo(a: Articulo, autor: string): Res {
    const codigo = up(a.codigo);
    if (!codigo) return err('El campo «Código» es obligatorio.');
    if (!a.nombre.trim()) return err('El campo «Descripción» es obligatorio.');
    if (!a.familia) return err('Elige la familia: propone la clave fiscal y la naturaleza.');
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
      const a = db.articulos.find((x) => x.codigo === up(l.articulo));
      if (!a) return err(`Línea ${l.n}: el artículo ${l.articulo} no existe.`);
      if (a.estado !== 'Activo') return err(`Línea ${l.n}: el artículo ${a.codigo} no está Activo. Valídalo en el Maestro de artículos.`);
      if (!(l.cantidad > 0)) return err(`Línea ${l.n}: la cantidad debe ser mayor que 0.`);
      if (!(l.precio >= 0)) return err(`Línea ${l.n}: precio no válido.`);
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
      if (!(l.cantidad > 0)) return err(`Línea ${l.n}: la cantidad debe ser mayor que 0.`);
      if (l.origenLinea) {
        const pl = db.pedidos.find((p) => p.numero === a.origen)?.lineas.find((x) => x.n === l.origenLinea);
        const pend = (pl?.cantidad ?? 0) - servida(db, a.origen, l.origenLinea);
        if (l.cantidad > pend) return err(`Línea ${l.n}: recibes ${l.cantidad} pero en el pedido quedan ${pend} pendientes.`);
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
    guardar(conLog({ ...db, facturas: db.facturas.map((x) => (x.numero === numeroDoc ? { ...x, contabilizada: si, asiento } : x)) }, si ? 'contabilizar' : 'descontabilizar', `factura:${numeroDoc}`, autor));
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
