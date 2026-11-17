/* Prácticas transaccionales: enunciado + comprobaciones automáticas sobre los datos del ERP de práctica. */
import { useSyncExternalStore } from 'react';
import { avisarCambio } from '../lib/sync';
import { type Db, type Pantalla, cuadra, importeBanco, baseDe, facturaDeAlbaran, lineasFactura, situacionPedido, stock, totales } from './modelo';

export interface Comprobacion {
  texto: string;
  puntos: number;
  ok: (d: Db, ini: string) => boolean;
  pista: string;
}
export interface Practica {
  id: string;
  titulo: string;
  resumen: string;
  minutos: number;
  pantalla: Pantalla;
  enunciado: string[];
  datos: { campo: string; valor: string }[];
  checks: Comprobacion[];
}

const T = (ini: string) => `T${ini}`;
const ART = (ini: string) => `${ini}001`;
const ter = (d: Db, ini: string) => d.terceros.find((t) => t.codigo === T(ini));
const prov = (d: Db, ini: string) => d.proveedores.find((p) => p.tercero === T(ini));
const art = (d: Db, ini: string) => d.articulos.find((a) => a.codigo === ART(ini));
const pedidosDe = (d: Db, ini: string) => d.pedidos.filter((p) => p.proveedor === T(ini) && p.autor === ini);
const conArt = (d: Db, ini: string, cant: number, precio: number) =>
  pedidosDe(d, ini).filter((p) => p.lineas.some((l) => l.articulo === ART(ini) && l.cantidad === cant && Math.abs(l.precio - precio) < 0.005));
const albDe = (d: Db, pedido: string) => d.albaranes.filter((a) => a.origen === pedido);
const casi = (a: number, b: number) => Math.abs(a - b) < 0.005;

/** Pedido de la práctica 3: 10 × 12,50 del artículo propio */
const pedido3 = (d: Db, ini: string) => conArt(d, ini, 10, 12.5)[0];
/** Pedido de la práctica 4: 20 unidades a 9,80 */
const pedido4 = (d: Db, ini: string) => conArt(d, ini, 20, 9.8)[0];

export const PRACTICAS: Practica[] = [
  {
    id: 'erp-proveedor',
    titulo: 'Da de alta tu proveedor',
    resumen: 'Tercero con sus iniciales, dirección, relaciones contables y ficha de proveedor.',
    minutos: 10,
    pantalla: 'terceros',
    enunciado: [
      'En Maestros › Terceros pulsa «Nuevo» y crea el tercero {T}: proveedor que solo existe en tus pruebas, sin NIF real.',
      'Pestaña Direcciones: dirección tipo 0 en Barcelona (CP 08001, provincia 08), zona impositiva ESCO.',
      'Pestaña Relaciones: añade Proveedor · ACR (41000.00000) y también Proveedor · PRO (40000.00000), que es la que usa la factura para contabilizar.',
      'Guarda y pulsa «Validar».',
      'En Maestros › Proveedores crea el proveedor {T}: tipo GENERAL, efecto TF, plazo 30 días, fecha de baja 31-12-2099 y centrales de compras y pagos {T}.',
    ],
    datos: [
      { campo: 'Código', valor: '{T}' },
      { campo: 'Nombre', valor: 'PROVEEDOR PRUEBAS {INI}' },
      { campo: 'Tipo Id. fiscal', valor: 'No censado · Id. fiscal 0' },
      { campo: 'Categoría', valor: '002 Proveedores' },
    ],
    checks: [
      { texto: 'El tercero {T} existe y lo has creado tú', puntos: 10, ok: (d, i) => !!ter(d, i) && ter(d, i)!.autor === i, pista: 'Maestros › Terceros › Nuevo, código {T} (T + tus iniciales).' },
      { texto: 'Categoría 002 Proveedores, Tipo Id. «No censado» e Id. fiscal 0', puntos: 10, ok: (d, i) => { const t = ter(d, i); return !!t && t.categoria === '002 Proveedores' && t.tipoId === 'No censado' && t.nif === '0'; }, pista: 'Sin NIF real se usa «No censado» y el Id. fiscal 0.' },
      { texto: 'Dirección tipo 0 con CP 08001 y zona ESCO', puntos: 15, ok: (d, i) => !!ter(d, i)?.direcciones.some((x) => x.tipo === 0 && x.cp === '08001' && x.zonaImp === 'ESCO'), pista: 'Pestaña Direcciones del tercero.' },
      { texto: 'Relaciones Proveedor ACR y PRO', puntos: 15, ok: (d, i) => { const r = ter(d, i)?.relaciones ?? []; return r.some((x) => x.codigo === 'ACR') && r.some((x) => x.codigo === 'PRO'); }, pista: 'Sin la PRO, la factura no encontrará la cuenta 40000 al contabilizar.' },
      { texto: 'Tercero {T} validado', puntos: 15, ok: (d, i) => ter(d, i)?.estado === 'Validado', pista: 'Botón «Validar» en la ficha del tercero.' },
      { texto: 'Proveedor {T} de tipo GENERAL con efecto TF y plazo 30 días', puntos: 20, ok: (d, i) => { const p = prov(d, i); return !!p && p.tipo === 'GENERAL' && p.tipoEfecto === 'TF' && p.plazoPago === '30D'; }, pista: 'Maestros › Proveedores › Nuevo.' },
      { texto: 'Fecha de baja 31-12-2099 y centrales {T} / {T}', puntos: 15, ok: (d, i) => { const p = prov(d, i); return !!p && p.fechaBaja === '2099-12-31' && p.centralCompras === T(i) && p.centralPagos === T(i); }, pista: 'Las centrales de compras y pagos son el propio proveedor.' },
    ],
  },
  {
    id: 'erp-articulo',
    titulo: 'Crea y activa tu artículo',
    resumen: 'Artículo de compra con familia, tipo contable PRODUCTO y precio, listo para pedir.',
    minutos: 6,
    pantalla: 'articulos',
    enunciado: [
      'En Maestros › Artículos pulsa «Nuevo» y crea el artículo {ART}.',
      'Elige la familia 01.01.001352: fíjate en que propone la clave fiscal BOG (bien).',
      'Tipo contable PRODUCTO (PROD). Con VEN no se puede comprar: el ERP te avisará de que falta la cuenta de compras.',
      'Precio de compra 12,50 € por UNIDAD. Guarda y pulsa «Validar» hasta que quede Activo.',
    ],
    datos: [
      { campo: 'Código', valor: '{ART}' },
      { campo: 'Descripción', valor: 'RODAMIENTO PRUEBAS {INI}' },
      { campo: 'Familia', valor: '01.01.001352' },
      { campo: 'Precio compra', valor: '12,50' },
    ],
    checks: [
      { texto: 'El artículo {ART} existe y lo has creado tú', puntos: 15, ok: (d, i) => art(d, i)?.autor === i, pista: 'Maestros › Artículos › Nuevo.' },
      { texto: 'Unidad UNIDAD y familia 01.01.001352', puntos: 15, ok: (d, i) => art(d, i)?.unidad === 'UNIDAD' && art(d, i)?.familia === '01.01.001352', pista: 'La familia arrastra clave fiscal y naturaleza.' },
      { texto: 'Clave fiscal BOG y tipo contable PROD', puntos: 25, ok: (d, i) => art(d, i)?.claveFiscal === 'BOG' && art(d, i)?.tipoContable === 'PROD', pista: 'PRODUCTO (PROD) es el tipo que lleva cuenta de compras.' },
      { texto: 'Precio de compra 12,50', puntos: 15, ok: (d, i) => casi(art(d, i)?.precioCompra ?? -1, 12.5), pista: 'Campo «Precio compra» de la ficha.' },
      { texto: 'Artículo en estado Activo', puntos: 30, ok: (d, i) => art(d, i)?.estado === 'Activo', pista: 'Botón «Validar». Si da error, revisa el tipo contable.' },
    ],
  },
  {
    id: 'erp-circuito',
    titulo: 'Pedido › albarán › factura',
    resumen: 'El circuito completo: pide 10 unidades, recíbelas, factura y contabiliza.',
    minutos: 15,
    pantalla: 'pedidos',
    enunciado: [
      'Necesitas tu proveedor {T} y tu artículo {ART} (prácticas 1 y 2).',
      'Compras › Pedidos › Nuevo: tipo PC, proveedor {T}. Añade una línea de {ART}: 10 unidades a 12,50. Guarda y valida.',
      'Con el pedido validado pulsa «Generar albaranes»: se crea un albarán ACPC con el pedido como origen. Ábrelo y valídalo (entra el stock).',
      'En el albarán, pulsa «Generar factura» con Factura proveedor PROV-{INI}-001. Se crea una FCOA.',
      'Revisa la prevista del asiento (base 125,00, IVA 26,25, total 151,25), valida la factura y contabilízala.',
    ],
    datos: [
      { campo: 'Pedido', valor: '{ART} · 10 × 12,50' },
      { campo: 'Factura proveedor', valor: 'PROV-{INI}-001' },
      { campo: 'Total esperado', valor: '151,25 €' },
    ],
    checks: [
      { texto: 'Pedido PC de {T} con 10 × 12,50 de {ART}', puntos: 15, ok: (d, i) => !!pedido3(d, i), pista: 'Compras › Pedidos › Nuevo.' },
      { texto: 'Pedido validado', puntos: 10, ok: (d, i) => pedido3(d, i)?.estado === 'Validado', pista: 'Botón «Validar» del pedido.' },
      { texto: 'Albarán ACPC generado desde el pedido (origen informado)', puntos: 15, ok: (d, i) => { const p = pedido3(d, i); return !!p && albDe(d, p.numero).length > 0; }, pista: '«Generar albaranes» desde el pedido validado, no un albarán a mano.' },
      { texto: 'Albarán validado: 10 unidades de {ART} en stock', puntos: 15, ok: (d, i) => { const p = pedido3(d, i); return !!p && albDe(d, p.numero).some((a) => a.estado === 'Validado') && (stock(d).find((s) => s.articulo === ART(i))?.cantidad ?? 0) >= 10; }, pista: 'Al validar el albarán entra el stock (NSAL › DISP).' },
      { texto: 'Pedido en situación «Servido o Facturado»', puntos: 5, ok: (d, i) => { const p = pedido3(d, i); return !!p && situacionPedido(d, p) === 'Servido o Facturado'; }, pista: 'Se recibieron todas las unidades.' },
      { texto: 'Factura FCOA con Factura proveedor PROV-{INI}-001 que conforma el albarán', puntos: 15, ok: (d, i) => { const p = pedido3(d, i); return !!p && albDe(d, p.numero).some((a) => facturaDeAlbaran(d, a.numero)?.facturaProveedor.toUpperCase() === `PROV-${i}-001`); }, pista: '«Generar factura» desde el albarán validado.' },
      { texto: 'Factura de 151,25 € validada', puntos: 10, ok: (d, i) => d.facturas.some((f) => f.facturaProveedor.toUpperCase() === `PROV-${i}-001` && f.estado === 'Validado' && casi(totales(lineasFactura(d, f)).total, 151.25)), pista: '125,00 + 21 % = 151,25.' },
      { texto: 'Factura contabilizada (asiento cuadrado)', puntos: 15, ok: (d, i) => d.facturas.some((f) => f.facturaProveedor.toUpperCase() === `PROV-${i}-001` && f.contabilizada && casi(f.asiento.reduce((s, l) => s + l.debe - l.haber, 0), 0)), pista: 'Botón «Contabilizar». Si falla, revisa la relación PRO del tercero.' },
    ],
  },
  {
    id: 'erp-parcial',
    titulo: 'Entregas parciales',
    resumen: 'Un pedido de 20 que llega en dos camiones (12 + 8) y una sola factura para los dos.',
    minutos: 15,
    pantalla: 'pedidos',
    enunciado: [
      'Crea otro pedido PC a {T} con 20 unidades de {ART} a 9,80. Valídalo.',
      'Llega el primer camión con 12 unidades: «Generar albaranes» y, en el albarán, cambia la cantidad a 12 antes de validarlo.',
      'Comprueba que el pedido queda «Parcialmente servido» con 8 pendientes.',
      'Llega el resto: vuelve a «Generar albaranes» (propone las 8 pendientes) y valida el segundo albarán.',
      'Genera una sola factura que agrupe los dos albaranes, con Factura proveedor PROV-{INI}-002 (base 196,00, total 237,16). Valida y contabiliza.',
    ],
    datos: [
      { campo: 'Pedido', valor: '{ART} · 20 × 9,80' },
      { campo: 'Albaranes', valor: '12 + 8 unidades' },
      { campo: 'Factura proveedor', valor: 'PROV-{INI}-002' },
    ],
    checks: [
      { texto: 'Pedido validado de 20 × 9,80 de {ART}', puntos: 10, ok: (d, i) => pedido4(d, i)?.estado === 'Validado', pista: 'Nuevo pedido con una sola línea.' },
      { texto: 'Primer albarán validado de 12 unidades', puntos: 20, ok: (d, i) => { const p = pedido4(d, i); return !!p && albDe(d, p.numero).some((a) => a.estado === 'Validado' && a.lineas.some((l) => l.cantidad === 12)); }, pista: 'Edita la cantidad de la línea del albarán generado antes de validarlo.' },
      { texto: 'Segundo albarán validado de 8 unidades', puntos: 20, ok: (d, i) => { const p = pedido4(d, i); return !!p && albDe(d, p.numero).some((a) => a.estado === 'Validado' && a.lineas.some((l) => l.cantidad === 8)); }, pista: '«Generar albaranes» propone solo lo pendiente.' },
      { texto: 'Pedido «Servido o Facturado» (20 de 20)', puntos: 10, ok: (d, i) => { const p = pedido4(d, i); return !!p && situacionPedido(d, p) === 'Servido o Facturado'; }, pista: 'Entre los dos albaranes deben sumar 20.' },
      { texto: 'Una sola factura PROV-{INI}-002 con los dos albaranes', puntos: 20, ok: (d, i) => { const p = pedido4(d, i); const f = d.facturas.find((x) => x.facturaProveedor.toUpperCase() === `PROV-${i}-002`); return !!p && !!f && f.albaranes.length >= 2 && albDe(d, p.numero).every((a) => f.albaranes.includes(a.numero)); }, pista: 'En «Generar factura» marca los dos albaranes.' },
      { texto: 'Base 196,00 y factura contabilizada', puntos: 20, ok: (d, i) => d.facturas.some((f) => f.facturaProveedor.toUpperCase() === `PROV-${i}-002` && casi(baseDe(lineasFactura(d, f)), 196) && f.contabilizada), pista: '20 × 9,80 = 196,00; con IVA 237,16.' },
    ],
  },
];

/* ---------- finanzas */
const asientoAlquiler = (d: Db, ini: string) =>
  d.asientos.find((a) => a.autor === ini && a.origen === 'MAN' && a.apuntes.some((p) => p.cuenta === '62100.00000' && casi(p.debe, 500)) && a.apuntes.some((p) => p.cuenta === '57200.00000' && casi(p.haber, 500)));
const efectosProv = (d: Db, ini: string) => d.efectos.filter((e) => e.tercero === T(ini) && e.clase === 'P');
const remesaPago = (d: Db, ini: string) => d.remesas.find((r) => r.autor === ini && r.clase === 'P' && r.efectos.some((n) => efectosProv(d, ini).some((e) => e.numero === n)));
const movPago = (d: Db, ini: string) => {
  const r = remesaPago(d, ini);
  const total = r ? r.efectos.reduce((s, n) => s + (d.efectos.find((e) => e.numero === n)?.importe ?? 0), 0) : 0;
  return d.extractos.find((m) => m.autor === ini && m.ctafin === r?.ctafin && casi(m.importe, -total) && total > 0);
};

export const PRACTICAS_FINANZAS: Practica[] = [
  {
    id: 'erp-asiento',
    titulo: 'Asiento manual del alquiler',
    resumen: 'Asiento de dos líneas en el diario general, cuadrado y finalizado.',
    minutos: 8,
    pantalla: 'asientos',
    enunciado: [
      'Abre Finanzas › Contabilidad General › Diario contable › Asientos › Asientos y pulsa «Nuevo».',
      'Diario GEN y documento ALQ-{INI}. Añade el apunte 62100.00000 al debe por 500,00 con el concepto «Alquiler {INI}».',
      'Añade el apunte 57200.00000 al haber por 500,00 con el mismo concepto y guarda.',
      'Mira la sección Cuadre: la diferencia debe ser 0. Pulsa «Finalizar».',
      'Prueba a pulsar «Abrir a provisional» y vuelve a «Finalizar»: así se corrige un asiento manual.',
    ],
    datos: [
      { campo: 'Debe', valor: '62100.00000 · 500,00' },
      { campo: 'Haber', valor: '57200.00000 · 500,00' },
      { campo: 'Documento', valor: 'ALQ-{INI}' },
    ],
    checks: [
      { texto: 'Hay un asiento manual tuyo con 62100 al debe por 500', puntos: 30, ok: (d, i) => d.asientos.some((a) => a.autor === i && a.origen === 'MAN' && a.apuntes.some((p) => p.cuenta === '62100.00000' && casi(p.debe, 500))), pista: 'Nuevo asiento y apunte con la cuenta 62100.00000 al debe.' },
      { texto: 'La contrapartida es el banco 57200.00000 al haber', puntos: 25, ok: (d, i) => !!asientoAlquiler(d, i), pista: 'La segunda línea va al haber de 57200.00000 por el mismo importe.' },
      { texto: 'El asiento cuadra', puntos: 20, ok: (d, i) => { const a = asientoAlquiler(d, i); return !!a && cuadra(a); }, pista: 'La suma del debe tiene que ser igual a la del haber.' },
      { texto: 'El asiento está finalizado (Contabilizado)', puntos: 25, ok: (d, i) => asientoAlquiler(d, i)?.estado === 'C', pista: 'Pulsa «Finalizar» en la ficha del asiento.' },
    ],
  },
  {
    id: 'erp-pago',
    titulo: 'Paga al proveedor con una remesa',
    resumen: 'De la factura contabilizada al efecto pagado mediante una remesa de transferencias.',
    minutos: 12,
    pantalla: 'remesas',
    enunciado: [
      'Necesitas la factura de la práctica «Pedido › albarán › factura» contabilizada: al contabilizar, Axional crea el efecto a pagar al proveedor {T}.',
      'Abre Finanzas › Cobros y Pagos › Cobros y Pagos y localiza el efecto de {T} en estado Pendiente.',
      'En Remesas › Registro de remesas pulsa «Nuevo»: clase Pagar, tipo PSCTT (pago transferencias con Tesorería) y cuenta financiera BBVA_CA.',
      'Pestaña Gestión remesas › Selección de efectos: marca el efecto de {T} y pulsa «Añadir seleccionados».',
      'Pulsa «Evolucionar estado»: la remesa se cierra, el efecto pasa a Pagado y se genera el asiento contra el banco.',
    ],
    datos: [
      { campo: 'Tipo remesa', valor: 'PSCTT' },
      { campo: 'Cuenta financiera', valor: 'BBVA_CA' },
      { campo: 'Proveedor', valor: '{T}' },
    ],
    checks: [
      { texto: 'Existe el efecto a pagar de {T} (factura contabilizada)', puntos: 20, ok: (d, i) => efectosProv(d, i).length > 0, pista: 'Contabiliza la factura de compra de {T}: el efecto se crea solo.' },
      { texto: 'Has creado una remesa de pagos con ese efecto', puntos: 25, ok: (d, i) => !!remesaPago(d, i), pista: 'Remesas › Nuevo (clase Pagar) y añade el efecto en Selección de efectos.' },
      { texto: 'La remesa es de transferencias PSCTT contra BBVA_CA', puntos: 15, ok: (d, i) => { const r = remesaPago(d, i); return !!r && r.tipdoc === 'PSCTT' && r.ctafin === 'BBVA_CA'; }, pista: 'Tipo remesa PSCTT y cuenta financiera BBVA_CA.' },
      { texto: 'La remesa está cerrada y su asiento generado', puntos: 20, ok: (d, i) => { const r = remesaPago(d, i); return !!r && r.estrem === 'C' && d.asientos.some((a) => a.numero === r.asiento); }, pista: 'Pulsa «Evolucionar estado» en la remesa.' },
      { texto: 'El efecto de {T} está Pagado', puntos: 20, ok: (d, i) => efectosProv(d, i).some((e) => e.estado === 'PA'), pista: 'Al cerrar la remesa el efecto pasa a Pagado (PA).' },
    ],
  },
  {
    id: 'erp-conciliacion',
    titulo: 'Concilia el pago con el banco',
    resumen: 'Registra el cargo del extracto bancario y concílialo con el apunte de la remesa.',
    minutos: 8,
    pantalla: 'conciliacion',
    enunciado: [
      'Primero haz la práctica «Paga al proveedor con una remesa».',
      'En Finanzas › Tesorería › Extractos bancarios › Movimientos pulsa «Nuevo»: cuenta BBVA_CA, concepto común 04 (transferencias), descripción «TRANSFERENCIA {T}» e importe en negativo (es un cargo) por el total de la remesa.',
      'Abre Finanzas › Tesorería › Conciliación bancaria con la cuenta BBVA_CA.',
      'Marca tu movimiento en «Extracto bancario» y el apunte de la remesa en «Apuntes contables»: la diferencia debe ser 0. Pulsa «Conciliar».',
    ],
    datos: [
      { campo: 'Cuenta financiera', valor: 'BBVA_CA' },
      { campo: 'Importe', valor: '− total de la remesa' },
    ],
    checks: [
      { texto: 'Hay un movimiento tuyo en BBVA_CA por el importe de la remesa (en negativo)', puntos: 40, ok: (d, i) => !!movPago(d, i), pista: 'Extractos bancarios › Nuevo, importe negativo igual al total de la remesa.' },
      { texto: 'El movimiento está conciliado con el apunte de banco de la remesa', puntos: 60, ok: (d, i) => { const m = movPago(d, i); const r = remesaPago(d, i); if (!m?.conciliado || !r) return false; const a = d.asientos.find((x) => x.numero === m.conciliado!.asiento); const p = a?.apuntes.find((x) => x.orden === m.conciliado!.orden); return a?.numero === r.asiento && !!p && casi(importeBanco(p), m.importe); }, pista: 'Conciliación bancaria: marca un elemento de cada lado y pulsa «Conciliar».' },
    ],
  },
];
PRACTICAS.push(...PRACTICAS_FINANZAS);

export const getPractica = (id: string) => PRACTICAS.find((p) => p.id === id);
export const txtIni = (s: string, ini: string) => s.replaceAll('{T}', T(ini)).replaceAll('{ART}', ART(ini)).replaceAll('{INI}', ini);

export function puntuar(p: Practica, d: Db, ini: string) {
  const res = p.checks.map((c) => {
    let ok = false;
    try {
      ok = !!ini && c.ok(d, ini);
    } catch {
      ok = false;
    }
    return { ...c, hecho: ok };
  });
  const total = p.checks.reduce((s, c) => s + c.puntos, 0);
  const logrado = res.filter((c) => c.hecho).reduce((s, c) => s + c.puntos, 0);
  return { res, total, logrado, nota: total ? logrado / total : 0 };
}

/** Prácticas que se ofrecen dentro de cada ejercicio de la plataforma */
export const PRACTICAS_POR_EJERCICIO: Record<string, string[]> = {
  'maestros-2': ['erp-articulo'],
  'compras-1': ['erp-proveedor', 'erp-articulo'],
  'compras-2': ['erp-circuito'],
  'compras-3': ['erp-circuito', 'erp-parcial'],
  'asientos-2': ['erp-asiento'],
  'asientos-6': ['erp-asiento'],
  'carteras-5': ['erp-pago'],
  'carteras-7': ['erp-pago'],
  'tesoreria-4': ['erp-conciliacion'],
  'tesoreria-5': ['erp-conciliacion'],
};

/* ------------------------------------------------------------------ mejores notas (localStorage) */
const CLAVE_NOTAS = 'oys-erp-notas-v1';
type Notas = Record<string, { nota: number; fecha: string }>;
function leerNotas(): Notas {
  try {
    return JSON.parse(localStorage.getItem(CLAVE_NOTAS) || '{}') as Notas;
  } catch {
    return {};
  }
}
let notas: Notas = leerNotas();
const oy = new Set<() => void>();
export function useNotas() {
  return useSyncExternalStore(
    (f) => {
      oy.add(f);
      return () => oy.delete(f);
    },
    () => notas,
  );
}
export function registrarNota(id: string, nota: number) {
  if ((notas[id]?.nota ?? -1) >= nota) return;
  notas = { ...notas, [id]: { nota, fecha: new Date().toISOString() } };
  try {
    localStorage.setItem(CLAVE_NOTAS, JSON.stringify(notas));
  } catch {
    /* sin almacenamiento */
  }
  oy.forEach((f) => f());
  avisarCambio();
}

/** Vuelve a leer localStorage (tras fusionar con el progreso de la cuenta) y repinta. */
export function recargarNotas() {
  notas = leerNotas();
  oy.forEach((f) => f());
}

export { CLAVE_NOTAS };
