/**
 * Textos de la portada y de las páginas de módulo pensados para un junior:
 * una frase de resumen, lo que te llevas y el circuito paso a paso.
 * Sacados de los manuales (_fuente/manuales/<slug>/manual.md). Las iniciales
 * del manual (CL, MB, EC, CA) se escriben como {INI} y se sustituyen con conIni.
 */

export interface PiezaCircuito {
  /** Rótulo corto de la pieza */
  t: string;
  /** Qué pasa en esta pieza, en una frase */
  d: string;
  /** Ejemplo del manual (código, importe…) */
  ej?: string;
}

export interface FichaModulo {
  /** Una frase: para qué sirve el módulo */
  frase: string;
  /** Lo que sabrás hacer al terminar */
  aprendes: string[];
  /** De dónde a dónde va el circuito (para la tarjeta de la portada) */
  recorrido: string;
  circuito: PiezaCircuito[];
}

export const FICHAS: Record<string, FichaModulo> = {
  maestros: {
    frase: 'Las fichas que usan todos los documentos: empresa, cuentas, terceros y artículos. Si un maestro está mal, el error se arrastra a cada pedido, factura y asiento.',
    recorrido: 'De la empresa al stock',
    aprendes: [
      'Leer y crear una empresa, y entender su plan contable y sus cuentas.',
      'Dar de alta un tercero con su cuenta contable y su forma de cobro.',
      'Preparar un artículo y un almacén, y comprobar una entrada de stock.',
    ],
    circuito: [
      { t: 'Empresa', d: 'Quién factura. Lleva su plan contable, su moneda y su ejercicio.', ej: 'Empresa S{INI} · ejercicio 2026' },
      { t: 'Plan y cuentas', d: 'Las cuentas donde el ERP apunta cada importe. El mnemotécnico es un alias que el ERP convierte en la cuenta real.', ej: '43000 Clientes · 57200 Bancos' },
      { t: 'Tercero', d: 'Una sola ficha para clientes y proveedores. Su relación contable dice a qué cuenta va.', ej: 'Tercero {INI}1 · relación CLI' },
      { t: 'Forma de cobro', d: 'Tipo de efecto y plazo de pago, asignados al tercero.', ej: 'Efecto {INI} + plazo {INI}1 (30/60 días)' },
      { t: 'Artículo y almacén', d: 'Qué compras o vendes, quién te lo suministra y dónde se guarda.', ej: '{INI}0001 · almacén {INI}1' },
      { t: 'Stock', d: 'Una entrada de mercancía y su comprobación en el stock y el kardex.', ej: '10 unidades en {INI}1' },
    ],
  },
  compras: {
    frase: 'Das de alta un proveedor con su tarifa y llevas una compra desde la oferta hasta el asiento.',
    recorrido: 'De la oferta al asiento',
    aprendes: [
      'Dar de alta un proveedor completo: tercero, relación contable, condiciones y tarifa.',
      'Crear las tipologías y recorrer oferta, pedido, albarán y factura.',
      'Conformar la factura con el albarán, contabilizarla y resolver los errores típicos.',
    ],
    circuito: [
      { t: 'Oferta', d: 'Lo que te ofrece el proveedor, con cantidades y precios.', ej: '0OC000001 · 5 × 12,00 = 60,00' },
      { t: 'Pedido', d: 'Lo que le compras. Nace de la oferta.', ej: '0PC000001' },
      { t: 'Albarán', d: 'Entra la mercancía en el almacén: el stock sube.', ej: '0AC000003' },
      { t: 'Factura', d: 'Lo que te cobra el proveedor, con su número de factura.', ej: '0FC000002 · PROV-{INI}-002' },
      { t: 'Conformar', d: 'Cruzas la factura con el albarán: el albarán queda facturado y la factura, validada.', ej: 'Desplegable del título › «Conformar»' },
      { t: 'Contabilizar', d: 'Asiento: gasto (600) e IVA (472) al Debe, proveedor (400) al Haber. Y nacen los vencimientos de pago.', ej: 'Diario DC · 72,60 = 60,00 + 21 % IVA' },
    ],
  },
  ventas: {
    frase: 'Montas los documentos de venta y llevas una venta de la oferta al cobro pendiente en cartera.',
    recorrido: 'De la oferta al vencimiento',
    aprendes: [
      'Crear las tipologías que deciden cómo se comporta cada documento.',
      'Dar de alta un cliente y recorrer oferta, pedido, albarán y factura.',
      'Contabilizar la factura y ver su asiento y el vencimiento en la cartera de cobros.',
    ],
    circuito: [
      { t: 'Oferta', d: 'Lo que propones al cliente.', ej: '0OV000001 · 5 × 22,00 = 110,00' },
      { t: 'Pedido', d: 'Lo que el cliente te compra. Copia las líneas de la oferta.', ej: '0PV000002' },
      { t: 'Albarán', d: 'La mercancía sale del almacén.', ej: '0AV000002' },
      { t: 'Factura', d: 'Lo que le cobras. Se conforma con el albarán.', ej: '0FV000002 · 110,00 + IVA 23,10' },
      { t: 'Asiento', d: 'Al contabilizar la factura: cliente (430) al Debe; IVA y ventas (700) al Haber.', ej: 'Diario DV · 133,10' },
      { t: 'Vencimiento', d: 'El importe a cobrar entra en la cartera de cobros.', ej: '133,10 pendiente de cobro' },
    ],
  },
  carteras: {
    frase: 'Cada factura deja vencimientos (efectos). Aquí los sigues hasta que se cobran o se pagan: sueltos, en una gestión o en una remesa.',
    recorrido: 'Del plazo de pago a la remesa',
    aprendes: [
      'Preparar plazos de pago, tipos de efecto y bancos propios.',
      'Leer un efecto en cartera y saber qué estados puede tener.',
      'Cobrar y pagar efectos sueltos, con una gestión o en una remesa, y llevarlos a tesorería.',
    ],
    circuito: [
      { t: 'Plazo de pago, tipo de efecto y condiciones del tercero', d: 'Cuándo se paga, con qué tipo de efecto, y la forma de pago y de cobro que recibe el tercero.', ej: 'Plazo {INI}1: 40, 80 y 120 días (40/20/40 %) · pago: efecto T{INI} + plazo {INI}1' },
      { t: 'Factura y efectos en cartera', d: 'Al contabilizar la factura nacen sus efectos, uno por vencimiento, en estado PE (pendiente). Su estado y su tipo deciden qué acciones admiten.', ej: '121,00 → 48,40 + 24,20 + 48,40' },
      { t: 'Banco propio y tipos de remesa', d: 'La cuenta por la que se cobra o se paga, con los tipos de remesa que admite.', ej: 'BBVA_{INI} (57200) · CAJA_{INI} (57000) · CSCTS' },
      { t: 'Cobro o pago: suelto, con gestión o en remesa', d: 'Un efecto suelto, varios con una gestión o un lote en una remesa.', ej: 'PE › PR › OC › CO · pago directo · gestión masiva' },
      { t: 'Asiento contable y movimiento de tesorería', d: 'Cada cambio de estado deja su asiento; si la acción mueve dinero, el pago o la remesa crean su movimiento en tesorería.', ej: 'Efecto en CO = cobrado · PTES · remesa PSCTT' },
    ],
  },
  tesoreria: {
    frase: 'El dinero que entra y sale del banco: lo registras en tesorería y lo casas con el extracto que manda el banco.',
    recorrido: 'Del banco propio a la conciliación',
    aprendes: [
      'Preparar el banco propio, una operación financiera y su flujo con cuenta contable.',
      'Crear un movimiento de tesorería a mano, revisar sus flujos y contabilizarlo.',
      'Cargar un extracto N43, dar de alta sus conceptos y conciliarlo a mano o de forma automática.',
      'Si quieres ampliar: cajas de efectivo, financiación, valores y avales.',
    ],
    circuito: [
      { t: 'Banco propio', d: 'La cuenta del banco, con su cuenta contable, formato de extracto y comisiones.', ej: 'BBVA_{INI} · 57200 · AEB43' },
      { t: 'Operación y flujo', d: 'Qué tipo de movimiento es (entrada o salida) y a qué cuenta va.', ej: 'Operación {INI}COM + flujo {INI}COM' },
      { t: 'Movimiento', d: 'Cada entrada o salida real de dinero: manual, desde un efecto o desde una remesa.', ej: 'PTES · remesa PSCTT' },
      { t: 'Extracto N43', d: 'El fichero del banco se carga en el almacén y se convierte en movimientos de extracto.', ej: 'Almacén ficheros › Cargar extracto bancario' },
      { t: 'Conceptos', d: 'Los códigos del banco: comunes de la AEB y propios de cada banco.', ej: 'Concepto común 02 · concepto propio 002' },
      { t: 'Conciliación', d: 'Casas extracto y tesorería, uno a uno o de forma automática.', ej: 'Conciliar · Generar · Conciliar Efectos' },
    ],
  },
  'icon-contabilidad': {
    frase: 'Montas la contabilidad de la empresa y la usas: plan de cuentas y analítica, asientos manuales, los asientos de las facturas y el cierre del año.',
    recorrido: 'Del plan de cuentas al cierre del año',
    aprendes: [
      'Dar de alta una cuenta, un grupo auxiliar y la analítica (proyecto y sección).',
      'Escribir un asiento manual, comprobar que cuadra, contabilizarlo y consultarlo en el mayor y los saldos.',
      'Contabilizar y corregir facturas, y localizar el cierre, la apertura y los balances.',
    ],
    circuito: [
      { t: 'Diario y periodos', d: 'Dónde y en qué mes cae cada asiento. El año se parte en doce periodos.', ej: 'Ejercicio 2026 · periodos 1 a 12' },
      { t: 'Plan de cuentas', d: 'Alta de una cuenta de gastos del grupo 6.', ej: '62999.00000 «Gastos varios {INI}»' },
      { t: 'Auxiliares y analítica', d: 'Más detalle dentro de la cuenta (por empleado) y a qué parte del negocio va cada gasto.', ej: '{INI}EMP · proyecto {INI}1' },
      { t: 'Asiento manual', d: 'Cabecera y líneas; Debe = Haber y «Finalizar» lo contabiliza.', ej: 'Cuadre 0,00 · Contabilizado' },
      { t: 'Consultas', d: 'Lo compruebas en el mayor de cuentas y en los saldos.', ej: '«Mayor de cuentas» y «Saldos cuentas»' },
      { t: 'Facturas', d: 'Al contabilizar una factura nacen su asiento, sus vencimientos y su registro fiscal.', ej: 'Asiento + efectos + IVA' },
      { t: 'Cierre y balances', d: 'Al acabar el año se cierran las cuentas, se abren en el siguiente y salen los balances.', ej: 'Cierre · apertura · balance' },
    ],
  },
  'icon-impuestos': {
    frase: 'Entiendes el IVA desde cero y sigues cómo el ERP decide el impuesto de cada línea, desde la zona fiscal hasta la declaración.',
    recorrido: 'Del IVA en llano a la declaración',
    aprendes: [
      'Calcular IVA repercutido, soportado y la liquidación con ejemplos.',
      'Leer y probar las reglas que deciden el impuesto de una línea.',
      'Consultar el registro fiscal, la prorrata y los envíos SII y VERIFACTU.',
    ],
    circuito: [
      { t: 'Conceptos de IVA', d: 'Base, tipo y cuota; el IVA que cobras y el que pagas se compensan en la liquidación.', ej: '800 € × 21 % = 168 €' },
      { t: 'Maestros fiscales', d: 'Zonas, clases y tipos de impuesto, operaciones y claves fiscales.', ej: 'ESCO · ESAR España Araba' },
      { t: 'Empresa, tercero y artículo', d: 'Cada uno aporta su zona o su clave fiscal a la línea del documento.', ej: 'BOG artículo · RGEN tercero' },
      { t: 'Regla de asignación', d: 'El ERP combina zonas y claves y elige la operación y el tipo de impuesto.', ej: 'ESAR + ESAR + BOG → CLBC + ESG' },
      { t: 'Registro fiscal', d: 'Cada factura deja su registro, con cabecera y líneas, y la inversión del sujeto pasivo.', ej: 'Cabecera + líneas · ISP' },
      { t: 'Liquidación y envíos', d: 'Liquidas el IVA del periodo, aplicas la prorrata y envías a Hacienda.', ej: '303 · 390 · 349 · SII' },
    ],
  },
  'icon-activos': {
    frase: 'Entiendes la amortización desde cero, organizas el inmovilizado en bienes, elementos y componentes y lo das de alta desde una factura de compra.',
    recorrido: 'De la amortización en llano a la baja o venta',
    aprendes: [
      'Calcular amortización, valor neto contable y resultado de una venta.',
      'Configurar maestros y crear activos desde la factura de compra.',
      'Amortizar, traspasar, dar de baja, vender y consultar informes.',
    ],
    circuito: [
      { t: 'Conceptos', d: 'El activo se reparte como gasto durante su vida útil.', ej: '1.200 € / 4 años = 300 €/año' },
      { t: 'Maestros y estructura', d: 'Grupos contables y la jerarquía bien, elemento y componente.', ej: 'Grupo contable ES200 · ES2130 Maquinaria' },
      { t: 'Tipología y familia', d: 'La tipología de la factura y la familia del artículo, con su bien y su serie, preparan el alta.', ej: 'FACT + familia con bien y serie' },
      { t: 'Factura contabilizada', d: 'Al contabilizar la factura de compra el ERP crea el componente del activo.', ej: 'FACT0000044 → componente' },
      { t: 'Amortización', d: 'Calculas y contabilizas la amortización del periodo.', ej: 'L lineal · D decreciente' },
      { t: 'Baja o venta', d: 'Sacas el activo y contabilizas el resultado.', ej: 'Precio − VNC = resultado' },
    ],
  },
};
