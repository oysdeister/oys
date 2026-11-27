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
    frase: 'Los datos maestros son las fichas básicas que usan todos los documentos: la empresa, los terceros, los artículos, los bancos… Si una está mal, el error se arrastra a cada pedido, factura y asiento. Este módulo empieza por la primera de todas, la empresa: lees la ficha de una y creas la tuya.',
    recorrido: 'De la ficha de empresa a tu empresa',
    aprendes: [
      'Leer la ficha de una empresa: su tercero, su plan contable y su moneda.',
      'Crear una empresa nueva con su ejercicio contable y su banco.',
      'Saber qué empresa de práctica usarás en el resto del curso.',
    ],
    circuito: [
      { t: 'Empresa', d: 'Quién factura. Lleva su plan contable, su moneda y su ejercicio.', ej: 'Empresa S{INI} · ejercicio 2026' },
      { t: 'Ejercicio y periodos', d: 'El año contable de la empresa, partido en doce periodos.', ej: 'Ejercicio 2026' },
      { t: 'Banco', d: 'La cuenta bancaria propia, con su cuenta contable 57200.', ej: 'CAIXA{INI}' },
    ],
  },
  compras: {
    frase: 'Compras es la parte del ERP donde registras lo que pides a tus proveedores, lo que recibes y lo que te facturan. Das de alta un proveedor con su tarifa, preparas los tipos de documento y llevas una compra desde la oferta hasta el asiento.',
    recorrido: 'De la oferta al asiento',
    aprendes: [
      'Dar de alta los datos básicos de gestión (artículo, almacén) y un proveedor completo: tercero, relación contable, condiciones y tarifa.',
      'Preparar la numeración y las tipologías y recorrer oferta, pedido, albarán y factura.',
      'Conformar la factura con el albarán, contabilizarla y resolver los errores típicos.',
    ],
    circuito: [
      { t: 'Oferta', d: 'Lo que te ofrece el proveedor, con cantidades y precios.', ej: '0OC000001 · 10 × 12,50 = 125,00' },
      { t: 'Pedido', d: 'Lo que le compras. Nace de la oferta.', ej: '0PC{INI}01' },
      { t: 'Albarán', d: 'Entra la mercancía en el almacén: el stock sube.', ej: '0AC000002 · entran 10 unidades' },
      { t: 'Factura', d: 'Lo que te cobra el proveedor, con su número de factura.', ej: '0FC000001 · PROV-{INI}-001' },
      { t: 'Conformar', d: 'Cruzas la factura con el albarán: el albarán queda facturado y la factura, validada.', ej: 'Desplegable del título › «Conformar»' },
      { t: 'Contabilizar', d: 'Asiento: gasto (600) e IVA (472) al Debe, proveedor (400) al Haber. Y nacen los vencimientos de pago.', ej: 'Diario DC · 151,25 = 125,00 + 21 % IVA' },
    ],
  },
  ventas: {
    frase: 'Ventas es la parte del ERP donde registras lo que vendes a tus clientes. Preparas el cliente, los precios y los documentos, y llevas una venta del pedido a la factura, con su asiento y su cobro pendiente.',
    recorrido: 'Del pedido a la factura y su cobro pendiente',
    aprendes: [
      'Crear las tipologías que deciden cómo se comporta cada documento.',
      'Completar tu cliente y sus precios, y recorrer oferta, pedido, albarán y factura.',
      'Contabilizar la factura y ver su asiento y el vencimiento en la cartera de cobros.',
    ],
    circuito: [
      { t: 'Cliente y precios', d: 'Tu cliente ya sabe cómo te paga y a qué precio le vendes: el pedido lo propone solo.', ej: 'C{INI} · R{INI} + P{INI} · lista LV{INI}: 20,00' },
      { t: 'Pedido', d: 'Lo que el cliente te encarga.', ej: 'PD{INI} · 10 × 20,00 = 200,00' },
      { t: 'Albarán', d: 'La mercancía sale del almacén. Copia las líneas del pedido y no genera asiento.', ej: 'AP{INI} · 200,00' },
      { t: 'Factura', d: 'Lo que le cobras. Se conforma con el albarán y suma el IVA.', ej: 'FP{INI} · 200,00 + IVA 42,00 = 242,00' },
      { t: 'Asiento', d: 'Al contabilizar la factura: cliente (430) al Debe; IVA y ventas (700) al Haber.', ej: 'Diario DV · 242,00' },
      { t: 'Vencimientos', d: 'Lo que te debe el cliente entra en la cartera de cobros: un efecto por vencimiento.', ej: '2 × 121,00 a 30 y 60 días' },
    ],
  },
  carteras: {
    frase: 'La cartera es la lista de lo que la empresa tiene pendiente de cobrar y de pagar: un efecto por cada vencimiento de una factura. Aquí sigues cada efecto hasta que se cobra o se paga, suelto, con una gestión o en una remesa al banco.',
    recorrido: 'Del plazo de pago a la remesa',
    aprendes: [
      'Preparar plazos de pago, tipos de efecto y bancos propios.',
      'Leer un efecto en cartera y saber qué estados puede tener.',
      'Cobrar y pagar efectos sueltos, con una gestión o en una remesa, llevarlos a tesorería y registrar un recibo devuelto.',
    ],
    circuito: [
      { t: 'Plazo de pago, tipo de efecto y condiciones del tercero', d: 'El plazo dice cuándo se paga y el tipo de efecto, con qué medio. El tercero los guarda en sus condiciones de pago y de cobro, y sus facturas los copian.', ej: 'Plazo V{INI}: 40, 80 y 120 días (40/20/40 %) · tercero CAR{INI} · pago: efecto E{INI} + plazo V{INI}' },
      { t: 'Factura y efectos en cartera', d: 'Al contabilizar la factura nacen sus efectos, uno por vencimiento, en estado PE (pendiente). Su estado y su tipo deciden qué acciones admiten.', ej: '121,00 → 48,40 + 24,20 + 48,40' },
      { t: 'Banco propio y tipos de remesa', d: 'Es la cuenta por la que se cobra o se paga. Solo admite los tipos de remesa que le añades.', ej: 'BBVA_{INI} (57200) · CAJA_{INI} (57000) · CSCTS' },
      { t: 'Cobro o pago: suelto, con gestión o en remesa', d: 'Cobras o pagas un efecto suelto, varios con una gestión o un lote en una remesa al banco.', ej: 'Cobro en remesa: PE › PR › OC › CO (en un pago, OP y PA) · pago directo · gestión masiva' },
      { t: 'Asiento contable y movimiento de tesorería', d: 'Cada cambio de estado deja su asiento; si la acción mueve dinero, el pago o la remesa crean su movimiento en tesorería.', ej: 'Efecto en CO = cobrado · PTES · remesa PSCTT' },
    ],
  },
  tesoreria: {
    frase: 'Tesorería controla el dinero real que entra y sale de tus bancos: registras cada movimiento y lo casas con el extracto que manda el banco.',
    recorrido: 'Del banco propio a la conciliación',
    aprendes: [
      'Preparar el banco propio, una operación financiera y su flujo con cuenta contable.',
      'Crear un movimiento de tesorería a mano, revisar sus flujos, contabilizarlo y leer su asiento.',
      'Cargar un extracto N43, dar de alta sus conceptos y conciliarlo a mano o de forma automática, también con tus remesas de pago y de cobro.',
      'Si quieres ampliar: cajas de efectivo, financiación, valores y avales.',
    ],
    circuito: [
      { t: 'Banco propio', d: 'La cuenta del banco, con su cuenta contable, formato de extracto y comisiones.', ej: 'BBVA_{INI} · 57200 · AEB43' },
      { t: 'Operación y flujo', d: 'Qué tipo de movimiento es (entrada o salida) y a qué cuenta va.', ej: 'Operación {INI}COM + flujo {INI}COM' },
      { t: 'Movimiento', d: 'Cada entrada o salida real de dinero: manual, desde un efecto o desde una remesa.', ej: 'PTES · remesa PSCTT' },
      { t: 'Extracto N43', d: 'El fichero del banco se carga en el almacén y se convierte en movimientos de extracto.', ej: 'Almacén ficheros › Cargar extracto bancario' },
      { t: 'Conceptos', d: 'Los códigos de cada línea del extracto: comunes a toda la banca española (AEB) y propios de cada banco.', ej: 'Concepto común 02 · concepto propio 002' },
      { t: 'Conciliación', d: 'Casas extracto y tesorería, uno a uno o de forma automática.', ej: '«Conciliar banco» · «Generar tesorería» · «Conciliar cartera»' },
    ],
  },
  'icon-contabilidad': {
    frase: 'La contabilidad básica es anotar cada operación de la empresa en sus cuentas con asientos. En este módulo preparas lo imprescindible (tu cuenta, tus datos básicos y tu diario) y escribes, contabilizas y consultas tus propios asientos manuales.',
    recorrido: 'De la cuenta y el diario al asiento',
    aprendes: [
      'Configurar lo imprescindible: dar de alta y retocar una cuenta, crear tu cliente con su plazo y su tipo de efecto, y crear tu diario.',
      'Escribir un asiento manual, comprobar que cuadra, contabilizarlo y consultarlo en el extracto y en los saldos.',
      'Duplicar y corregir asientos. Como ampliación: auxiliares, analítica y la parametrización completa.',
    ],
    circuito: [
      { t: 'Plan de cuentas', d: 'Consulta del plan y alta de una cuenta de gastos del grupo 6.', ej: '62999.00000 «Gastos varios {INI}»' },
      { t: 'Datos básicos', d: 'Tu cliente, con su plazo de pago y su tipo de efecto: los usarán Ventas y Cartera.', ej: 'C{INI} · P{INI} · R{INI}' },
      { t: 'Diario y periodos', d: 'Dónde y en qué mes cae cada asiento. El año se parte en doce periodos.', ej: 'Ejercicio 2026 · periodos 1 a 12' },
      { t: 'Asiento manual', d: 'Cabecera y líneas; Debe = Haber y «Finalizar» lo contabiliza.', ej: 'Cuadre 0,00 · Contabilizado' },
      { t: 'Consultas', d: 'Lo compruebas en el extracto de cada cuenta y en los saldos.', ej: '«Mayor de cuentas» y «Saldos cuentas»' },
      { t: 'Auxiliares y analítica (ampliación)', d: 'Más detalle dentro de la cuenta (por empleado) y a qué parte del negocio va cada gasto.', ej: '{INI}EMP · proyecto DIV{INI}' },
    ],
  },
  'contabilidad-avanzada': {
    frase: 'Este módulo cierra el curso: aprendes a cerrar el año contable, abrir el siguiente y consultar los balances. Terminas con el caso final, que repasa tu empresa de principio a fin.',
    recorrido: 'Del cierre del año a las cuentas anuales',
    aprendes: [
      'Saber qué procesos cierran y abren el ejercicio, y en qué orden van.',
      'Ver la contabilidad a una fecha pasada.',
      'Localizar los balances, las cuentas anuales, las consultas Excel y la consolidación.',
    ],
    circuito: [
      { t: 'Cierre', d: 'Se cierran las cuentas del ejercicio.', ej: 'Cierre del ejercicio' },
      { t: 'Apertura', d: 'Se abren las cuentas en el ejercicio siguiente.', ej: 'Apertura' },
      { t: 'Balances', d: 'Sumas y saldos, balance de situación y cuenta de resultados.', ej: 'Balance · cuentas anuales' },
      { t: 'Consolidación', d: 'Se juntan las cuentas de varias empresas del grupo.', ej: 'Consolidación' },
    ],
  },
  fundamentos: {
    frase: 'Fundamentos es el punto de partida del curso: aprendes a moverte por el ERP y repasas, con las cifras de tu caso, lo que viste en la formación previa.',
    recorrido: 'De qué es un ERP a contabilizar',
    aprendes: [
      'Moverte por el ERP y saber cómo está organizado este curso.',
      'Repasar debe y haber, asiento y apunte con las cifras de tu caso.',
      'Repasar qué son el IVA, un efecto y contabilizar.',
    ],
    circuito: [
      { t: 'ERP', d: 'El programa donde se guardan los datos de la empresa y se trabaja con ellos.', ej: 'Axional Deister VNext' },
      { t: 'Debe y haber', d: 'Cada importe se anota en dos cuentas a la vez.', ej: '100 al Debe · 100 al Haber' },
      { t: 'Asiento y apunte', d: 'El asiento es la operación completa; cada línea es un apunte.', ej: '1 asiento · 2 apuntes' },
      { t: 'IVA', d: 'El impuesto que se suma a cada compra y venta.', ej: '21 %' },
      { t: 'Efecto', d: 'Un cobro o un pago pendiente con su fecha.', ej: 'Vence a 30 días' },
      { t: 'Contabilizar', d: 'Pasar un documento a asientos definitivos.', ej: 'Provisional → Contabilizado' },
    ],
  },
  'icon-impuestos': {
    frase: 'Este módulo explica cómo calcula el ERP el IVA de cada factura y cómo se declara a Hacienda. Empiezas por el IVA desde cero y terminas en la liquidación del trimestre.',
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
    frase: 'Este módulo explica cómo controla el ERP lo que la empresa compra para usar varios años, como un ordenador o una máquina. Aprendes a amortizarlo, lo ordenas en bienes, elementos y componentes y ves cómo nace desde una factura de compra.',
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
