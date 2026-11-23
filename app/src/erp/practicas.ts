/* Prácticas transaccionales: enunciado + comprobaciones automáticas sobre los datos del ERP de práctica. */
import { useSyncExternalStore } from 'react';
import { avisarCambio } from '../lib/sync';
import { type Db, type Pantalla, cuadra, importeBanco, baseDe, facturaDeAlbaran, lineasFactura, servida, situacionPedido, totales } from './modelo';

export interface Comprobacion {
  texto: string;
  puntos: number;
  ok: (d: Db, ini: string) => boolean;
  pista: string;
  /** Por qué no se cumple, con el dato real (p. ej. «Cantidad 1; se piden 8»). null si no hay nada concreto que decir. */
  porque?: (d: Db, ini: string) => string | null;
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
  /** Necesita el proveedor T{INI} del bloque 1: si el alumno no lo tiene, se le trae creado al abrir la práctica */
  usaProveedor?: boolean;
}

const T = (ini: string) => `T${ini}`;
/** Artículo propio (Maestros): para aprender la ficha. No se compra. */
const ART = (ini: string) => `ROD${ini}`;
/** Artículo que se compra en todas las prácticas de compras (como en la demo real). */
const ART_COMPRA = '13500620';
const ter = (d: Db, ini: string) => d.terceros.find((t) => t.codigo === T(ini));
const prov = (d: Db, ini: string) => d.proveedores.find((p) => p.tercero === T(ini));
/** Tercero y proveedor que ha grabado el alumno (no los que trajo creados la plataforma): solo estos puntúan en el bloque 1 */
const terPropio = (d: Db, ini: string) => {
  const t = ter(d, ini);
  return t && !t.sembrado ? t : undefined;
};
const provPropio = (d: Db, ini: string) => {
  const p = prov(d, ini);
  return p && !p.sembrado && !ter(d, ini)?.sembrado ? p : undefined;
};
const art = (d: Db, ini: string) => d.articulos.find((a) => a.codigo === ART(ini));
const pedidosDe = (d: Db, ini: string) => d.pedidos.filter((p) => p.proveedor === T(ini) && p.autor === ini);
const conArt = (d: Db, ini: string, cant: number, precio: number) =>
  pedidosDe(d, ini).filter((p) => p.lineas.some((l) => l.articulo === ART_COMPRA && l.cantidad === cant && Math.abs(l.precio - precio) < 0.005));
const albDe = (d: Db, pedido: string) => d.albaranes.filter((a) => a.origen === pedido);
const casi = (a: number, b: number) => Math.abs(a - b) < 0.005;
/** Números como en pantalla: 12,5 → «12,50» con `dec`; cantidades sin decimales sobrantes */
const n2 = (n: number) => n.toLocaleString('es-ES', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
const nq = (n: number) => n.toLocaleString('es-ES', { maximumFractionDigits: 3 });
const fecha = (iso: string) => (iso ? iso.split('-').reverse().join('-') : 'vacía');
const ESTADO_EFE: Record<string, string> = { PE: 'Pendiente (PE)', OP: 'Ordenado (OP)', PA: 'Pagado (PA)', CO: 'Cobrado (CO)' };
const unir = (xs: (string | false | null | undefined)[]) => {
  const r = xs.filter(Boolean) as string[];
  return r.length ? r.join('. ') : null;
};

/** Pedido de la práctica 3: 8 × 12,50 del artículo 13500620 */
const CIRC = { cant: 8, precio: 12.5, base: 100, total: 121 };
/** Pedido de la práctica 4: 20 unidades a 9,80 */
const PARC = { cant: 20, precio: 9.8 };
const pedido3 = (d: Db, ini: string) => conArt(d, ini, CIRC.cant, CIRC.precio)[0];
const pedido4 = (d: Db, ini: string) => conArt(d, ini, PARC.cant, PARC.precio)[0];

/** Por qué no hay pedido válido: mira el pedido del alumno que más se parece y dice qué dato no cuadra. */
function explicaPedido(d: Db, ini: string, cant: number, precio: number, otro: { cant: number; precio: number }): string {
  const esOtro = (p: (typeof d.pedidos)[number]) => p.proveedor === T(ini) && p.lineas.some((l) => l.articulo === ART_COMPRA && l.cantidad === otro.cant && casi(l.precio, otro.precio));
  const mios = d.pedidos.filter((p) => p.autor === ini && !esOtro(p)).sort((a, b) => b.numero.localeCompare(a.numero));
  if (!mios.length) return 'Aún no has creado ningún pedido para esta práctica.';
  const p = mios.find((x) => x.proveedor === T(ini) && x.lineas.some((l) => l.articulo === ART_COMPRA)) ?? mios.find((x) => x.proveedor === T(ini)) ?? mios[0];
  if (p.proveedor !== T(ini)) return `Pedido ${p.numero}: «Proveedor» ${p.proveedor}; se pide ${T(ini)}.`;
  if (!p.lineas.length) return `Pedido ${p.numero} sin líneas (o sin guardar): añade la línea en la pestaña «Líneas» y guarda.`;
  const l = p.lineas.find((x) => x.articulo === ART_COMPRA);
  if (!l) return `Pedido ${p.numero}: «Artículo» ${p.lineas[0].articulo || 'vacío'}; se pide ${ART_COMPRA}.`;
  const mal = unir([l.cantidad !== cant && `«Cantidad» ${nq(l.cantidad)}; se piden ${nq(cant)}`, !casi(l.precio, precio) && `«Precio» ${n2(l.precio)}; se pide ${n2(precio)}`]);
  if (!mal) return `Pedido ${p.numero}: revisa la línea del ${ART_COMPRA}.`;
  if (p.estado === 'Validado')
    return `Tu pedido ${p.numero} está validado con ${mal.replace(/«(Cantidad|Precio)» /g, (_, c: string) => (c === 'Cantidad' ? 'cantidad ' : 'precio '))}. Pulsa «Pasar a provisional», corrige la línea en «Líneas», guarda con el disquete y vuelve a pulsar «Validar».`;
  return `Pedido ${p.numero}: ${mal}. Corrígelo en «Líneas» y guarda con el disquete.`;
}
const faltaTercero = (d: Db, ini: string) => {
  const t = ter(d, ini);
  if (!t) return `Aún no has creado el tercero ${T(ini)}: créalo en Gestión › Maestros › Terceros › Datos › Registro.`;
  if (t.sembrado) return `El tercero ${T(ini)} lo trajo creado la práctica de la factura: ábrelo en Terceros, revisa cada campo y guarda con el disquete.`;
  return null;
};
const faltaProveedor = (d: Db, ini: string) => {
  const p = prov(d, ini);
  if (!p) return ter(d, ini) ? `Aún no has creado el proveedor ${T(ini)}: créalo en Gestión › Maestros › Terceros › Proveedores › Registro.` : `Antes necesitas el tercero ${T(ini)} validado; después crea el proveedor en Gestión › Maestros › Terceros › Proveedores › Registro.`;
  if (p.sembrado || ter(d, ini)?.sembrado) return `El proveedor ${T(ini)} lo trajo creado la práctica de la factura: ábrelo en Proveedores, revísalo y guarda con el disquete.`;
  return null;
};
/** Punto que depende del pedido: si hay un pedido parecido, dice qué corregir; si no, qué falta antes. */
const sinPedido3 = (ini: string, d?: Db) => {
  const p = d && d.pedidos.some((x) => x.autor === ini && x.proveedor === T(ini)) ? explicaPedido(d, ini, CIRC.cant, CIRC.precio, PARC) : '';
  return p.startsWith('Tu pedido') ? p : `Antes necesitas el pedido validado de ${T(ini)} con ${CIRC.cant} × ${n2(CIRC.precio)} del ${ART_COMPRA}.`;
};
const sinPedido4 = (ini: string, d?: Db) => {
  const p = d && d.pedidos.some((x) => x.autor === ini && x.proveedor === T(ini)) ? explicaPedido(d, ini, PARC.cant, PARC.precio, CIRC) : '';
  return p.startsWith('Tu pedido') ? p : `Antes necesitas el pedido validado de ${T(ini)} con ${PARC.cant} × ${n2(PARC.precio)} del ${ART_COMPRA}.`;
};
const facturaProv = (d: Db, ini: string, n: string) => d.facturas.find((f) => f.facturaProveedor.toUpperCase() === `PROV-${ini}-${n}`);

export const PRACTICAS: Practica[] = [
  {
    id: 'erp-proveedor',
    titulo: 'Da de alta tu proveedor',
    resumen: 'Tercero con tus iniciales y tu nombre, dirección, relaciones contables y ficha de proveedor.',
    minutos: 10,
    pantalla: 'terceros',
    enunciado: [
      'Abre Gestión › Maestros › Terceros › Datos › Registro (el tercero) y pulsa «Nuevo». «Código»: {T}, es decir, T + tus iniciales (para José Antúnez, TJA). «Nombre»: tu nombre y apellidos (p. ej. José Antúnez), para reconocer tu proveedor en un listado. «Tipo Id. fiscal»: «No censado» e «Id. fiscal»: 0, porque es un proveedor de pruebas sin NIF real. «Categoría»: «002 Proveedores».',
      'Pestaña «Direcciones»: dirección tipo 0 en Barcelona (CP 08001, provincia 08), zona impositiva ESCO.',
      'Pestaña «Relaciones»: añade Proveedor · ACR (41000.00000) y también Proveedor · PRO (40000.00000), que es la que usa la factura para contabilizar.',
      'Guarda con el disquete («Guardar»; no con «Añadir tercero», que abre otro tercero nuevo) y pulsa «Validar».',
      'Abre Gestión › Maestros › Terceros › Proveedores › Registro, pulsa «Nuevo» y crea el proveedor {T}: tipo GENERAL, efecto TF, plazo 30 días, fecha de baja 31-12-2099 y centrales de compras y pagos {T}.',
    ],
    datos: [
      { campo: 'Código', valor: '{T}' },
      { campo: 'Nombre', valor: 'Tu nombre' },
      { campo: 'Tipo Id. fiscal', valor: 'No censado' },
      { campo: 'Id. fiscal', valor: '0' },
      { campo: 'Categoría', valor: '002 Proveedores' },
    ],
    checks: [
      {
        texto: 'El tercero {T} existe y lo has creado tú',
        puntos: 10,
        ok: (d, i) => terPropio(d, i)?.autor === i,
        pista: 'Maestros › Terceros › Nuevo, «Código» {T} (T + tus iniciales).',
        porque: (d, i) => faltaTercero(d, i) ?? (ter(d, i)!.autor !== i ? `El tercero ${T(i)} lo grabó otra persona (${ter(d, i)!.autor}).` : null),
      },
      {
        texto: 'Categoría 002 Proveedores, Tipo Id. «No censado» e Id. fiscal 0',
        puntos: 10,
        ok: (d, i) => { const t = terPropio(d, i); return !!t && t.categoria === '002 Proveedores' && t.tipoId === 'No censado' && t.nif === '0'; },
        pista: 'Sin NIF real se usa «No censado» y el Id. fiscal 0.',
        porque: (d, i) => {
          const f = faltaTercero(d, i);
          if (f) return f;
          const t = ter(d, i)!;
          return unir([t.categoria !== '002 Proveedores' && `«Categoría» ${t.categoria}; se pide 002 Proveedores`, t.tipoId !== 'No censado' && `«Tipo Id. fiscal» ${t.tipoId}; se pide No censado`, t.nif !== '0' && `«Id. fiscal» ${t.nif || 'vacío'}; se pide 0`]);
        },
      },
      {
        texto: 'Dirección tipo 0 con CP 08001 y zona ESCO',
        puntos: 15,
        ok: (d, i) => !!terPropio(d, i)?.direcciones.some((x) => x.tipo === 0 && x.cp === '08001' && x.zonaImp === 'ESCO'),
        pista: 'Pestaña Direcciones del tercero.',
        porque: (d, i) => {
          const f = faltaTercero(d, i);
          if (f) return f;
          const x = ter(d, i)!.direcciones[0];
          if (!x) return 'El tercero no tiene direcciones guardadas.';
          return `Dirección tipo ${x.tipo}, CP ${x.cp || 'vacío'}, zona ${x.zonaImp}; se pide tipo 0, CP 08001 y zona ESCO.`;
        },
      },
      {
        texto: 'Relaciones Proveedor ACR y PRO',
        puntos: 15,
        ok: (d, i) => { const r = terPropio(d, i)?.relaciones ?? []; return r.some((x) => x.codigo === 'ACR') && r.some((x) => x.codigo === 'PRO'); },
        pista: 'Sin la PRO, la factura no encontrará la cuenta 40000 al contabilizar.',
        porque: (d, i) => {
          const f = faltaTercero(d, i);
          if (f) return f;
          const r = ter(d, i)!.relaciones;
          const faltan = ['ACR', 'PRO'].filter((c) => !r.some((x) => x.codigo === c));
          return faltan.length === 2 ? 'Faltan las relaciones ACR y PRO.' : faltan.length ? `Falta la relación ${faltan[0]}.` : null;
        },
      },
      {
        texto: 'Tercero {T} validado',
        puntos: 15,
        ok: (d, i) => terPropio(d, i)?.estado === 'Validado',
        pista: 'Botón «Validar» en la ficha del tercero.',
        porque: (d, i) => faltaTercero(d, i) ?? (ter(d, i)!.estado !== 'Validado' ? `Tercero ${T(i)} sin validar (en ${ter(d, i)!.estado}).` : null),
      },
      {
        texto: 'Proveedor {T} de tipo GENERAL con efecto TF y plazo 30 días',
        puntos: 20,
        ok: (d, i) => { const p = provPropio(d, i); return !!p && p.tipo === 'GENERAL' && p.tipoEfecto === 'TF' && p.plazoPago === '30D'; },
        pista: 'Maestros › Proveedores › Nuevo.',
        porque: (d, i) => {
          const f = faltaProveedor(d, i);
          if (f) return f;
          const p = prov(d, i)!;
          return unir([p.tipo !== 'GENERAL' && `«Tipo proveedor» ${p.tipo}; se pide GENERAL`, p.tipoEfecto !== 'TF' && `«Tipo efecto» ${p.tipoEfecto}; se pide TF`, p.plazoPago !== '30D' && `«Plazo pago» ${p.plazoPago || 'vacío'}; se pide 30D`]);
        },
      },
      {
        texto: 'Fecha de baja 31-12-2099 y centrales {T} / {T}',
        puntos: 15,
        ok: (d, i) => { const p = provPropio(d, i); return !!p && p.fechaBaja === '2099-12-31' && p.centralCompras === T(i) && p.centralPagos === T(i); },
        pista: 'Las centrales de compras y pagos son el propio proveedor.',
        porque: (d, i) => {
          const f = faltaProveedor(d, i);
          if (f) return f;
          const p = prov(d, i)!;
          return unir([p.fechaBaja !== '2099-12-31' && `«Fecha baja» ${fecha(p.fechaBaja)}; se pide 31-12-2099`, p.centralCompras !== T(i) && `«Central compras» ${p.centralCompras || 'vacía'}; se pide ${T(i)}`, p.centralPagos !== T(i) && `«Central pagos» ${p.centralPagos || 'vacía'}; se pide ${T(i)}`]);
        },
      },
    ],
  },
  {
    id: 'erp-articulo',
    titulo: 'Crea y activa tu artículo',
    resumen: 'Tu artículo ROD con familia, tipo contable y precio: practicas la ficha que das de alta en Maestros.',
    minutos: 6,
    pantalla: 'articulos',
    enunciado: [
      'Abre Gestión › Maestros › Artículos › Registro y pulsa «Nuevo» y crea el artículo {ART} (ROD de rodamiento + tus iniciales). Es para aprender la ficha: en las prácticas de compras usas el 13500620 de la demo.',
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
      { texto: 'El artículo {ART} existe y lo has creado tú', puntos: 15, ok: (d, i) => art(d, i)?.autor === i, pista: 'Maestros › Artículos › Nuevo.', porque: (d, i) => (!art(d, i) ? `Aún no has creado el artículo ${ART(i)}.` : `El artículo ${ART(i)} lo grabó otra persona (${art(d, i)!.autor}).`) },
      {
        texto: 'Unidad UNIDAD y familia 01.01.001352',
        puntos: 15,
        ok: (d, i) => art(d, i)?.unidad === 'UNIDAD' && art(d, i)?.familia === '01.01.001352',
        pista: 'La familia arrastra clave fiscal y naturaleza.',
        porque: (d, i) => { const a = art(d, i); return !a ? `Aún no has creado el artículo ${ART(i)}.` : unir([a.unidad !== 'UNIDAD' && `«Unidad» ${a.unidad}; se pide UNIDAD`, a.familia !== '01.01.001352' && `«Familia» ${a.familia || 'vacía'}; se pide 01.01.001352`]); },
      },
      {
        texto: 'Clave fiscal BOG y tipo contable PROD',
        puntos: 25,
        ok: (d, i) => art(d, i)?.claveFiscal === 'BOG' && art(d, i)?.tipoContable === 'PROD',
        pista: 'PRODUCTO (PROD) es el tipo que lleva cuenta de compras.',
        porque: (d, i) => { const a = art(d, i); return !a ? `Aún no has creado el artículo ${ART(i)}.` : unir([a.claveFiscal !== 'BOG' && `Clave fiscal ${a.claveFiscal}; se pide BOG`, a.tipoContable !== 'PROD' && `Tipo contable ${a.tipoContable}; se pide PROD`]); },
      },
      { texto: 'Precio de compra 12,50', puntos: 15, ok: (d, i) => casi(art(d, i)?.precioCompra ?? -1, 12.5), pista: 'Campo «Precio compra» de la ficha.', porque: (d, i) => { const a = art(d, i); return !a ? `Aún no has creado el artículo ${ART(i)}.` : `«Precio compra» ${n2(a.precioCompra)}; se pide 12,50.`; } },
      { texto: 'Artículo en estado Activo', puntos: 30, ok: (d, i) => art(d, i)?.estado === 'Activo', pista: 'Botón «Validar». Si da error, revisa el tipo contable.', porque: (d, i) => { const a = art(d, i); return !a ? `Aún no has creado el artículo ${ART(i)}.` : `Artículo ${a.codigo} en ${a.estado}: pulsa «Validar».`; } },
    ],
  },
  {
    id: 'erp-circuito',
    titulo: 'Pedido › albarán › factura',
    resumen: 'El circuito completo: pide 8 unidades, recíbelas, factura y contabiliza.',
    minutos: 15,
    pantalla: 'pedidos',
    usaProveedor: true,
    enunciado: [
      'Aquí el ERP de práctica usa las tipologías estándar (pedido PC, albarán ACPC, factura FCOA) y el pedido sí genera el albarán: no necesitas las tuyas. Usas el proveedor {T} que creaste en el bloque 1 («Dar de alta el proveedor y el artículo»). Si no lo creaste, no pasa nada: {T} ya está en el desplegable «Proveedor». El artículo es el 13500620 de la demo: ya tiene tipo contable PRODUCTO y precio de compra 12,50.',
      'Abre Gestión › Compras › Pedidos › Pedidos y pulsa «Nuevo». Elige el «Proveedor» {T} y pulsa «Crear pedido». En la pestaña «Líneas» pulsa «Añadir línea», elige el artículo 13500620 y pon 8 unidades a 12,50. Guarda con el disquete («Guardar») y pulsa «Validar».',
      'Con el pedido validado, en «Acciones», elige «Generar albaranes»: se crea un albarán ACPC con el pedido como origen. Ábrelo y pulsa «Validar» (entra el stock).',
      'En el albarán, en «Acciones», elige «Generar factura» y pon Factura proveedor PROV-{INI}-001. Se crea una FCOA (Gestión › Compras › Facturas › Facturas).',
      'Revisa la prevista del asiento (base 100,00, IVA 21,00, total 121,00), valida la factura y contabilízala.',
    ],
    datos: [
      { campo: 'Proveedor', valor: '{T}' },
      { campo: 'Pedido', valor: '13500620 · 8 × 12,50' },
      { campo: 'Factura proveedor', valor: 'PROV-{INI}-001' },
      { campo: 'Total esperado', valor: '121,00 €' },
    ],
    checks: [
      { texto: 'Pedido PC de {T} con 8 × 12,50 del artículo 13500620', puntos: 15, ok: (d, i) => !!pedido3(d, i), pista: 'Compras › Pedidos › Nuevo.', porque: (d, i) => (!prov(d, i) ? `Aún no tienes el proveedor ${T(i)}: termina la práctica del bloque 1.` : explicaPedido(d, i, CIRC.cant, CIRC.precio, PARC)) },
      { texto: 'Pedido validado', puntos: 10, ok: (d, i) => pedido3(d, i)?.estado === 'Validado', pista: 'Botón «Validar» del pedido.', porque: (d, i) => { const p = pedido3(d, i); return !p ? explicaPedido(d, i, CIRC.cant, CIRC.precio, PARC) : `Pedido ${p.numero} sin validar: guarda con el disquete y pulsa «Validar».`; } },
      {
        texto: 'Albarán ACPC generado desde el pedido (origen informado)',
        puntos: 15,
        ok: (d, i) => { const p = pedido3(d, i); return !!p && albDe(d, p.numero).length > 0; },
        pista: '«Generar albaranes» desde el pedido validado, no un albarán a mano.',
        porque: (d, i) => { const p = pedido3(d, i); return !p ? sinPedido3(i, d) : p.estado !== 'Validado' ? `Pedido ${p.numero} sin validar: valídalo y pulsa «Generar albaranes».` : `El pedido ${p.numero} aún no tiene albaranes.`; },
      },
      {
        texto: 'Albarán validado: entran 8 unidades de 13500620 en stock',
        puntos: 15,
        ok: (d, i) => { const p = pedido3(d, i); return !!p && albDe(d, p.numero).some((a) => a.estado === 'Validado' && a.lineas.some((l) => l.articulo === ART_COMPRA && l.cantidad >= CIRC.cant)); },
        pista: 'Al validar el albarán entra el stock (NSAL › DISP).',
        porque: (d, i) => {
          const p = pedido3(d, i);
          if (!p) return sinPedido3(i, d);
          const als = albDe(d, p.numero);
          if (!als.length) return `El pedido ${p.numero} aún no tiene albaranes.`;
          const v = als.find((a) => a.estado === 'Validado');
          if (!v) return `Albarán ${als[0].numero} sin validar.`;
          return `Albarán ${v.numero} con ${nq(v.lineas.reduce((s, l) => s + l.cantidad, 0))} unidades; se piden ${CIRC.cant}.`;
        },
      },
      {
        texto: 'Pedido en situación «Servido o Facturado»',
        puntos: 5,
        ok: (d, i) => { const p = pedido3(d, i); return !!p && situacionPedido(d, p) === 'Servido o Facturado'; },
        pista: 'Se recibieron todas las unidades.',
        porque: (d, i) => { const p = pedido3(d, i); return !p ? sinPedido3(i, d) : `Situación «${situacionPedido(d, p)}»: quedan ${nq(p.lineas.reduce((s, l) => s + l.cantidad - servida(d, p.numero, l.n), 0))} unidades por recibir.`; },
      },
      {
        texto: 'Factura FCOA con Factura proveedor PROV-{INI}-001 que conforma el albarán',
        puntos: 15,
        ok: (d, i) => { const p = pedido3(d, i); return !!p && albDe(d, p.numero).some((a) => facturaDeAlbaran(d, a.numero)?.facturaProveedor.toUpperCase() === `PROV-${i}-001`); },
        pista: '«Generar factura» desde el albarán validado.',
        porque: (d, i) => {
          const p = pedido3(d, i);
          if (!p) return sinPedido3(i, d);
          const als = albDe(d, p.numero);
          if (!als.length) return `El pedido ${p.numero} aún no tiene albaranes.`;
          const f = als.map((a) => facturaDeAlbaran(d, a.numero)).find(Boolean);
          return f ? `Factura ${f.numero}: «Factura proveedor» ${f.facturaProveedor}; se pide PROV-${i}-001.` : `Albarán ${als[0].numero} sin facturar.`;
        },
      },
      {
        texto: 'Factura de 121,00 € validada',
        puntos: 10,
        ok: (d, i) => d.facturas.some((f) => f.facturaProveedor.toUpperCase() === `PROV-${i}-001` && f.estado === 'Validado' && casi(totales(lineasFactura(d, f)).total, CIRC.total)),
        pista: '100,00 + 21 % = 121,00.',
        porque: (d, i) => {
          const f = facturaProv(d, i, '001');
          if (!f) return `Aún no hay factura con «Factura proveedor» PROV-${i}-001.`;
          const tot = totales(lineasFactura(d, f)).total;
          return unir([!casi(tot, CIRC.total) && `Total ${n2(tot)}; se piden 121,00`, f.estado !== 'Validado' && `Factura ${f.numero} sin validar`]);
        },
      },
      {
        texto: 'Factura contabilizada (asiento cuadrado)',
        puntos: 15,
        ok: (d, i) => d.facturas.some((f) => f.facturaProveedor.toUpperCase() === `PROV-${i}-001` && f.contabilizada && casi(f.asiento.reduce((s, l) => s + l.debe - l.haber, 0), 0)),
        pista: 'Botón «Contabilizar». Si falla, revisa la relación PRO del tercero.',
        porque: (d, i) => { const f = facturaProv(d, i, '001'); return !f ? `Aún no hay factura con «Factura proveedor» PROV-${i}-001.` : !f.contabilizada ? `Factura ${f.numero} sin contabilizar.` : 'El asiento de la factura no cuadra.'; },
      },
    ],
  },
  {
    id: 'erp-parcial',
    titulo: 'Entregas parciales',
    resumen: 'Un pedido de 20 que llega en dos camiones (12 + 8) y una sola factura para los dos.',
    minutos: 15,
    pantalla: 'pedidos',
    usaProveedor: true,
    enunciado: [
      'En Gestión › Compras › Pedidos › Pedidos crea otro pedido PC a {T} («Nuevo», «Proveedor» {T}, «Crear pedido») con 20 unidades del artículo 13500620 a 9,80. Guarda con el disquete y pulsa «Validar».',
      'Llega el primer camión con 12 unidades: en «Acciones», elige «Generar albaranes» y, en el albarán, cambia la cantidad a 12 antes de validarlo.',
      'Comprueba que el pedido queda «Parcialmente servido» con 8 pendientes.',
      'Llega el resto: en el pedido, en «Acciones», vuelve a elegir «Generar albaranes» (propone las 8 pendientes) y valida el segundo albarán.',
      'Desde uno de los albaranes, en «Acciones», elige «Generar factura» y marca los dos: una sola factura que agrupe los dos albaranes, con Factura proveedor PROV-{INI}-002 (base 196,00, total 237,16). Valida y contabiliza.',
    ],
    datos: [
      { campo: 'Pedido', valor: '13500620 · 20 × 9,80' },
      { campo: 'Albaranes', valor: '12 + 8 unidades' },
      { campo: 'Factura proveedor', valor: 'PROV-{INI}-002' },
    ],
    checks: [
      { texto: 'Pedido validado de 20 × 9,80 del artículo 13500620', puntos: 10, ok: (d, i) => pedido4(d, i)?.estado === 'Validado', pista: 'Nuevo pedido con una sola línea.', porque: (d, i) => { const p = pedido4(d, i); return p ? `Pedido ${p.numero} sin validar.` : explicaPedido(d, i, PARC.cant, PARC.precio, CIRC); } },
      {
        texto: 'Primer albarán validado de 12 unidades',
        puntos: 20,
        ok: (d, i) => { const p = pedido4(d, i); return !!p && albDe(d, p.numero).some((a) => a.estado === 'Validado' && a.lineas.some((l) => l.cantidad === 12)); },
        pista: 'Edita la cantidad de la línea del albarán generado antes de validarlo.',
        porque: (d, i) => {
          const p = pedido4(d, i);
          if (!p) return sinPedido4(i, d);
          const als = albDe(d, p.numero);
          if (!als.length) return `El pedido ${p.numero} aún no tiene albaranes.`;
          const v = als.filter((a) => a.estado === 'Validado');
          if (!v.length) return `Albarán ${als[0].numero} sin validar.`;
          return `Albaranes validados de ${v.map((a) => nq(a.lineas.reduce((s, l) => s + l.cantidad, 0))).join(' y ')} unidades; el primero debe ser de 12.`;
        },
      },
      {
        texto: 'Segundo albarán validado de 8 unidades',
        puntos: 20,
        ok: (d, i) => { const p = pedido4(d, i); return !!p && albDe(d, p.numero).some((a) => a.estado === 'Validado' && a.lineas.some((l) => l.cantidad === 8)); },
        pista: '«Generar albaranes» propone solo lo pendiente.',
        porque: (d, i) => {
          const p = pedido4(d, i);
          if (!p) return sinPedido4(i, d);
          const als = albDe(d, p.numero);
          if (als.length < 2) return `El pedido ${p.numero} tiene ${als.length} albarán${als.length === 1 ? '' : 'es'}; faltan los dos camiones.`;
          const sinV = als.find((a) => a.estado !== 'Validado');
          return sinV ? `Albarán ${sinV.numero} sin validar.` : 'Ningún albarán validado es de 8 unidades.';
        },
      },
      {
        texto: 'Pedido «Servido o Facturado» (20 de 20)',
        puntos: 10,
        ok: (d, i) => { const p = pedido4(d, i); return !!p && situacionPedido(d, p) === 'Servido o Facturado'; },
        pista: 'Entre los dos albaranes deben sumar 20.',
        porque: (d, i) => { const p = pedido4(d, i); return !p ? sinPedido4(i, d) : `Recibidas ${nq(p.lineas.reduce((s, l) => s + servida(d, p.numero, l.n), 0))} de 20 (situación «${situacionPedido(d, p)}»).`; },
      },
      {
        texto: 'Una sola factura PROV-{INI}-002 con los dos albaranes',
        puntos: 20,
        ok: (d, i) => { const p = pedido4(d, i); const f = d.facturas.find((x) => x.facturaProveedor.toUpperCase() === `PROV-${i}-002`); return !!p && !!f && f.albaranes.length >= 2 && albDe(d, p.numero).every((a) => f.albaranes.includes(a.numero)); },
        pista: 'En «Generar factura» marca los dos albaranes.',
        porque: (d, i) => {
          const f = facturaProv(d, i, '002');
          if (!f) return `Aún no hay factura con «Factura proveedor» PROV-${i}-002.`;
          const p = pedido4(d, i);
          const faltan = p ? albDe(d, p.numero).filter((a) => !f.albaranes.includes(a.numero)) : [];
          return faltan.length ? `La factura ${f.numero} no incluye el albarán ${faltan.map((a) => a.numero).join(' ni el ')}.` : `La factura ${f.numero} tiene ${f.albaranes.length} albarán; se piden los dos.`;
        },
      },
      {
        texto: 'Base 196,00 y factura contabilizada',
        puntos: 20,
        ok: (d, i) => d.facturas.some((f) => f.facturaProveedor.toUpperCase() === `PROV-${i}-002` && casi(baseDe(lineasFactura(d, f)), 196) && f.contabilizada),
        pista: '20 × 9,80 = 196,00; con IVA 237,16.',
        porque: (d, i) => {
          const f = facturaProv(d, i, '002');
          if (!f) return `Aún no hay factura con «Factura proveedor» PROV-${i}-002.`;
          const b = baseDe(lineasFactura(d, f));
          return unir([!casi(b, 196) && `Base ${n2(b)}; se piden 196,00`, !f.contabilizada && `Factura ${f.numero} sin contabilizar`]);
        },
      },
    ],
  },
];

/* ---------- finanzas */
const asientoAlquiler = (d: Db, ini: string) =>
  d.asientos.find((a) => a.autor === ini && a.origen === 'MAN' && a.apuntes.some((p) => p.cuenta === '62100.00000' && casi(p.debe, 500)) && a.apuntes.some((p) => p.cuenta === '57200.00000' && casi(p.haber, 500)));
const asientosMan = (d: Db, ini: string) => d.asientos.filter((a) => a.autor === ini && a.origen === 'MAN').sort((a, b) => b.numero - a.numero);
const efectosProv = (d: Db, ini: string) => d.efectos.filter((e) => e.tercero === T(ini) && e.clase === 'P');
const remesaPago = (d: Db, ini: string) => d.remesas.find((r) => r.autor === ini && r.clase === 'P' && r.efectos.some((n) => efectosProv(d, ini).some((e) => e.numero === n)));
const totalRemesa = (d: Db, ini: string) => {
  const r = remesaPago(d, ini);
  return r ? r.efectos.reduce((s, n) => s + (d.efectos.find((e) => e.numero === n)?.importe ?? 0), 0) : 0;
};
const movPago = (d: Db, ini: string) => {
  const r = remesaPago(d, ini);
  const total = totalRemesa(d, ini);
  return d.extractos.find((m) => m.autor === ini && m.ctafin === r?.ctafin && casi(m.importe, -total) && total > 0);
};
const sinEfecto = (d: Db, ini: string) => {
  const fs = d.facturas.filter((f) => f.proveedor === T(ini));
  if (!fs.length) return `Aún no hay ninguna factura de ${T(ini)}: haz antes la práctica «Pedido › albarán › factura».`;
  return `La factura ${fs[0].numero} de ${T(ini)} está sin contabilizar: al contabilizarla se crea el efecto.`;
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
      {
        texto: 'Hay un asiento manual tuyo con 62100 al debe por 500',
        puntos: 30,
        ok: (d, i) => d.asientos.some((a) => a.autor === i && a.origen === 'MAN' && a.apuntes.some((p) => p.cuenta === '62100.00000' && casi(p.debe, 500))),
        pista: 'Nuevo asiento y apunte con la cuenta 62100.00000 al debe.',
        porque: (d, i) => {
          const a = asientosMan(d, i)[0];
          if (!a) return 'Aún no has creado ningún asiento manual.';
          const p = a.apuntes.find((x) => x.cuenta === '62100.00000');
          if (!p) return `El asiento ${a.numero} no tiene ningún apunte a la cuenta 62100.00000${a.apuntes.length ? '' : ' (o está sin guardar)'}.`;
          return `Apunte 62100.00000 con debe ${n2(p.debe)} y haber ${n2(p.haber)}; se pide debe 500,00.`;
        },
      },
      {
        texto: 'La contrapartida es el banco 57200.00000 al haber',
        puntos: 25,
        ok: (d, i) => !!asientoAlquiler(d, i),
        pista: 'La segunda línea va al haber de 57200.00000 por el mismo importe.',
        porque: (d, i) => {
          const a = asientosMan(d, i)[0];
          if (!a) return 'Aún no has creado ningún asiento manual.';
          const p = a.apuntes.find((x) => x.cuenta === '57200.00000');
          return !p ? `El asiento ${a.numero} no tiene el apunte 57200.00000.` : `Apunte 57200.00000 con haber ${n2(p.haber)} y debe ${n2(p.debe)}; se pide haber 500,00.`;
        },
      },
      {
        texto: 'El asiento cuadra',
        puntos: 20,
        ok: (d, i) => { const a = asientoAlquiler(d, i); return !!a && cuadra(a); },
        pista: 'La suma del debe tiene que ser igual a la del haber.',
        porque: (d, i) => {
          const a = asientoAlquiler(d, i);
          if (!a) return 'Primero completa las dos líneas: 62100.00000 al debe y 57200.00000 al haber por 500,00.';
          const de = a.apuntes.reduce((s, p) => s + p.debe, 0);
          const ha = a.apuntes.reduce((s, p) => s + p.haber, 0);
          return `Debe ${n2(de)} y haber ${n2(ha)}: diferencia ${n2(de - ha)}.`;
        },
      },
      { texto: 'El asiento está finalizado (Contabilizado)', puntos: 25, ok: (d, i) => asientoAlquiler(d, i)?.estado === 'C', pista: 'Pulsa «Finalizar» en la ficha del asiento.', porque: (d, i) => { const a = asientoAlquiler(d, i); return !a ? 'Primero completa las dos líneas del asiento.' : `Asiento ${a.numero} en provisional: pulsa «Finalizar».`; } },
    ],
  },
  {
    id: 'erp-pago',
    titulo: 'Paga al proveedor con una remesa',
    resumen: 'De la factura contabilizada al efecto pagado mediante una remesa de transferencias.',
    minutos: 12,
    pantalla: 'remesas',
    usaProveedor: true,
    enunciado: [
      'Necesitas la factura de la práctica «Pedido › albarán › factura» contabilizada: al contabilizar, Axional crea el efecto a pagar al proveedor {T}.',
      'Abre Finanzas › Cobros y Pagos › Cobros y Pagos y localiza el efecto de {T} en estado Pendiente.',
      'En Finanzas › Cobros y Pagos › Remesas › Registro de remesas pulsa «Nuevo»: clase Pagar, tipo PSCTT (pago transferencias con Tesorería) y cuenta financiera BBVA_CA.',
      'Pestaña Gestión remesas › Selección de efectos: marca el efecto de {T} y pulsa «Añadir seleccionados».',
      'Pulsa «Evolucionar estado»: la remesa se cierra, el efecto pasa a Pagado y se genera el asiento contra el banco.',
    ],
    datos: [
      { campo: 'Tipo remesa', valor: 'PSCTT' },
      { campo: 'Cuenta financiera', valor: 'BBVA_CA' },
      { campo: 'Proveedor', valor: '{T}' },
    ],
    checks: [
      { texto: 'Existe el efecto a pagar de {T} (factura contabilizada)', puntos: 20, ok: (d, i) => efectosProv(d, i).length > 0, pista: 'Contabiliza la factura de compra de {T}: el efecto se crea solo.', porque: (d, i) => sinEfecto(d, i) },
      {
        texto: 'Has creado una remesa de pagos con ese efecto',
        puntos: 25,
        ok: (d, i) => !!remesaPago(d, i),
        pista: 'Remesas › Nuevo (clase Pagar) y añade el efecto en Selección de efectos.',
        porque: (d, i) => {
          if (!efectosProv(d, i).length) return sinEfecto(d, i);
          const r = d.remesas.filter((x) => x.autor === i).sort((a, b) => b.numrem - a.numrem)[0];
          if (!r) return 'Aún no has creado ninguna remesa.';
          if (r.clase !== 'P') return `Remesa ${r.numrem} de clase Cobrar; se pide Pagar.`;
          return `La remesa ${r.numrem} no incluye el efecto ${efectosProv(d, i)[0].numero} de ${T(i)}.`;
        },
      },
      {
        texto: 'La remesa es de transferencias PSCTT contra BBVA_CA',
        puntos: 15,
        ok: (d, i) => { const r = remesaPago(d, i); return !!r && r.tipdoc === 'PSCTT' && r.ctafin === 'BBVA_CA'; },
        pista: 'Tipo remesa PSCTT y cuenta financiera BBVA_CA.',
        porque: (d, i) => { const r = remesaPago(d, i); return !r ? 'Primero crea la remesa de pagos con el efecto.' : unir([r.tipdoc !== 'PSCTT' && `Tipo remesa ${r.tipdoc || 'vacío'}; se pide PSCTT`, r.ctafin !== 'BBVA_CA' && `Cuenta financiera ${r.ctafin || 'vacía'}; se pide BBVA_CA`]); },
      },
      {
        texto: 'La remesa está cerrada y su asiento generado',
        puntos: 20,
        ok: (d, i) => { const r = remesaPago(d, i); return !!r && r.estrem === 'C' && d.asientos.some((a) => a.numero === r.asiento); },
        pista: 'Pulsa «Evolucionar estado» en la remesa.',
        porque: (d, i) => { const r = remesaPago(d, i); return !r ? 'Primero crea la remesa de pagos con el efecto.' : r.estrem !== 'C' ? `Remesa ${r.numrem} abierta: pulsa «Evolucionar estado».` : `La remesa ${r.numrem} no tiene asiento.`; },
      },
      {
        texto: 'El efecto de {T} está Pagado',
        puntos: 20,
        ok: (d, i) => efectosProv(d, i).some((e) => e.estado === 'PA'),
        pista: 'Al cerrar la remesa el efecto pasa a Pagado (PA).',
        porque: (d, i) => { const e = efectosProv(d, i)[0]; return !e ? sinEfecto(d, i) : `Efecto ${e.numero} en ${ESTADO_EFE[e.estado] ?? e.estado}; se pide Pagado (PA).`; },
      },
    ],
  },
  {
    id: 'erp-conciliacion',
    titulo: 'Concilia el pago con el banco',
    resumen: 'Registra el cargo del extracto bancario y concílialo con el apunte de la remesa.',
    minutos: 8,
    pantalla: 'conciliacion',
    usaProveedor: true,
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
      {
        texto: 'Hay un movimiento tuyo en BBVA_CA por el importe de la remesa (en negativo)',
        puntos: 40,
        ok: (d, i) => !!movPago(d, i),
        pista: 'Extractos bancarios › Nuevo, importe negativo igual al total de la remesa.',
        porque: (d, i) => {
          const r = remesaPago(d, i);
          if (!r) return 'Aún no tienes la remesa de pago de la práctica anterior.';
          const m = d.extractos.filter((x) => x.autor === i).sort((a, b) => b.orden - a.orden)[0];
          if (!m) return 'Aún no has registrado ningún movimiento bancario.';
          const tot = totalRemesa(d, i);
          return unir([m.ctafin !== r.ctafin && `Movimiento ${m.orden}: cuenta ${m.ctafin}; se pide ${r.ctafin}`, !casi(m.importe, -tot) && `Movimiento ${m.orden}: importe ${n2(m.importe)}; se pide ${n2(-tot)}`]);
        },
      },
      {
        texto: 'El movimiento está conciliado con el apunte de banco de la remesa',
        puntos: 60,
        ok: (d, i) => { const m = movPago(d, i); const r = remesaPago(d, i); if (!m?.conciliado || !r) return false; const a = d.asientos.find((x) => x.numero === m.conciliado!.asiento); const p = a?.apuntes.find((x) => x.orden === m.conciliado!.orden); return a?.numero === r.asiento && !!p && casi(importeBanco(p), m.importe); },
        pista: 'Conciliación bancaria: marca un elemento de cada lado y pulsa «Conciliar».',
        porque: (d, i) => {
          const m = movPago(d, i);
          const r = remesaPago(d, i);
          if (!m || !r) return 'Primero registra el movimiento por el total de la remesa.';
          if (!m.conciliado) return `Movimiento ${m.orden} sin conciliar.`;
          return m.conciliado.asiento !== r.asiento ? `Conciliado con el asiento ${m.conciliado.asiento}; se pide el ${r.asiento} de la remesa.` : 'El importe del apunte conciliado no coincide con el del movimiento.';
        },
      },
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
    let motivo: string | null = null;
    if (!ok && ini) {
      try {
        motivo = c.porque?.(d, ini) ?? null;
      } catch {
        motivo = null;
      }
      // Siempre hay un porqué: si no hay dato concreto, la pista. Frase completa con punto final.
      motivo = (motivo || c.pista).trim();
      if (!/[.!?»)]$/.test(motivo)) motivo += '.';
    }
    return { ...c, hecho: ok, motivo };
  });
  const total = p.checks.reduce((s, c) => s + c.puntos, 0);
  const logrado = res.filter((c) => c.hecho).reduce((s, c) => s + c.puntos, 0);
  return { res, total, logrado, nota: total ? logrado / total : 0 };
}

/** Prácticas que se ofrecen dentro de cada ejercicio de la plataforma */
/** Cada práctica vive en un solo bloque: el que enseña justo eso */
export const PRACTICAS_POR_EJERCICIO: Record<string, string[]> = {
  'maestros-2': ['erp-articulo'],
  'compras-1': ['erp-proveedor'],
  'compras-factura': ['erp-circuito', 'erp-parcial'],
  'asientos-6': ['erp-asiento'],
  'icon-cartera-v-5': ['erp-pago'],
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
