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
    frase: 'Las fichas que usan todos los documentos. Si un maestro está mal, el error se arrastra a cada pedido, factura y asiento.',
    recorrido: 'Del tercero al stock',
    aprendes: [
      'Dar de alta un tercero con su cuenta contable y su forma de cobro.',
      'Crear un artículo, asignarlo a un proveedor y preparar un almacén con su cuenta logística.',
      'Registrar una entrada de stock y comprobarla en el Stock global y en el kardex.',
    ],
    circuito: [
      { t: 'Tercero', d: 'Una sola ficha para clientes y proveedores. Su perfil contable dice a qué cuenta va.', ej: 'Tercero {INI}1 · relación CLI' },
      { t: 'Forma de cobro', d: 'Tipo de efecto + plazo de pago, asignados al tercero.', ej: 'Efecto {INI} + plazo {INI}1 (30/60 días)' },
      { t: 'Artículo y proveedor', d: 'El artículo logístico y quién te lo suministra.', ej: '{INI}0001 · proveedor 00001' },
      { t: 'Almacén', d: 'Dónde se guarda el stock, con su cuenta logística.', ej: 'Almacén {INI}1 (FIFO)' },
      { t: 'Movimiento', d: 'Una entrada de mercancía al almacén: el stock pasa a disponible.', ej: '{INI}000001 · 10 × {INI}0001' },
      { t: 'Stock y kardex', d: 'Compruebas el saldo y la traza del movimiento. Deben coincidir.', ej: '10 unidades en {INI}1' },
    ],
  },
  parametrizacion: {
    frase: 'Antes de contabilizar nada, la empresa decide dónde se apunta cada cosa: cuentas, auxiliares y analítica.',
    recorrido: 'De la cuenta a la sección',
    aprendes: [
      'Dar de alta una cuenta de gastos del grupo 6 y cambiarle la descripción.',
      'Crear un grupo auxiliar con un código y asignarlo a la cuenta.',
      'Montar la analítica: un proyecto con su sección por defecto.',
    ],
    circuito: [
      { t: 'Cuenta', d: 'Alta de una cuenta de gastos del grupo 6 en el plan contable.', ej: '62999.00000 «Gastos varios {INI}»' },
      { t: 'Grupo auxiliar', d: 'Un segundo nivel de detalle dentro de una cuenta, por ejemplo por empleado.', ej: '{INI}EMP «Empleados {INI}»' },
      { t: 'Código auxiliar', d: 'Cada elemento del grupo: aquí, un empleado.', ej: '{INI}0001 «José Gómez»' },
      { t: 'Asignar', d: 'La cuenta queda enlazada al grupo auxiliar.', ej: '62999.00000 ← {INI}EMP' },
      { t: 'Proyecto', d: 'Analítica: a qué parte del negocio va cada gasto o ingreso.', ej: '{INI}1 «División 1 {INI}»' },
      { t: 'Sección', d: 'Se crea y queda como sección por defecto del proyecto.', ej: '{INI}ADM «Administración {INI}»' },
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
  asientos: {
    frase: 'Escribes a mano los asientos que no vienen de ningún documento: ajustes, regularizaciones o correcciones.',
    recorrido: 'Del diario a los saldos',
    aprendes: [
      'Crear el diario y el numerador de justificantes.',
      'Escribir un asiento, comprobar que cuadra y contabilizarlo con «Finalizar».',
      'Consultarlo en el mayor y en los saldos, duplicarlo y corregir importes.',
    ],
    circuito: [
      { t: 'Diario', d: 'El libro donde se guardan tus asientos de práctica, con su numerador de justificantes.', ej: 'Diario EA' },
      { t: 'Cabecera', d: 'Empresa, fecha, diario y concepto del asiento.', ej: 'Estado Provisional' },
      { t: 'Líneas', d: 'Cada apunte: cuenta, Debe o Haber e importe.', ej: '1.000,00 al Debe / 1.000,00 al Haber' },
      { t: 'Cuadre', d: 'Debe = Haber. Mientras no cuadra, el botón «Finalizar» no aparece.', ej: 'Cuadre 0,00' },
      { t: 'Finalizar', d: 'El asiento pasa de Provisional a Contabilizado y entra en los saldos.', ej: 'Estado Contabilizado' },
      { t: 'Consultas', d: 'Lo compruebas en el mayor de cuentas y en los saldos.', ej: '«Mayor de cuentas» y «Saldos cuentas»' },
    ],
  },
  carteras: {
    frase: 'Cada factura deja vencimientos: aquí los sigues hasta que se cobran o se pagan, uno a uno o en remesa.',
    recorrido: 'Del plazo de pago al cobro',
    aprendes: [
      'Definir un plazo de pago, un tipo de efecto y las condiciones de un tercero.',
      'Dar de alta un banco propio y una caja de efectivo.',
      'Cobrar efectos uno a uno y con una remesa, viendo cada cambio de estado y su asiento.',
      'Ver cómo un pago o una remesa con tesorería crean su movimiento.',
    ],
    circuito: [
      { t: 'Plazo de pago y tipo de efecto', d: 'Cuándo se paga y con qué tipo de efecto.', ej: 'Plazo {INI}1: 40, 80 y 120 días (40/20/40 %)' },
      { t: 'Condiciones del tercero', d: 'El tercero recibe su forma de pago y de cobro.', ej: 'Pago: efecto T{INI} + plazo {INI}1' },
      { t: 'Factura y efectos en cartera', d: 'Al contabilizar la factura nacen los efectos, en estado PE (pendiente).', ej: '121,00 → 48,40 + 24,20 + 48,40' },
      { t: 'Banco propio', d: 'La cuenta por la que se cobra o se paga.', ej: 'BBVA_{INI} (57200) · CAJA_{INI} (57000)' },
      { t: 'Cobro individual o remesa', d: 'Uno a uno con una gestión, o varios juntos en una remesa.', ej: 'PE › PR › OC › CO' },
      { t: 'Asiento contable', d: 'Cada cambio de estado deja su asiento contable.', ej: 'Efecto en CO = cobrado' },
      { t: 'Movimiento de tesorería', d: 'Si la acción mueve dinero, el pago o la remesa crean su movimiento en tesorería.', ej: 'PTES · remesa PSCTT' },
    ],
  },
  tesoreria: {
    frase: 'El dinero que entra y sale del banco: lo registras en tesorería y lo casas con el extracto que manda el banco.',
    recorrido: 'Del banco propio a la conciliación',
    aprendes: [
      'Preparar el banco propio, una operación financiera y su flujo con cuenta contable.',
      'Crear un movimiento de tesorería a mano, revisar sus flujos y contabilizarlo.',
      'Cargar un extracto N43, dar de alta sus conceptos y conciliarlo a mano o de forma automática.',
      'Llevar las cajas de efectivo, la financiación y las líneas financieras, la cartera de valores, los avales y los informes de posición.',
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
    frase: 'Entiendes el diario, los periodos y las plantillas, y localizas los procesos de cierre, balances y consolidación.',
    recorrido: 'Del diario a la consolidación',
    aprendes: [
      'Navegar por el diario, los periodos contables y las plantillas de contabilización.',
      'Ejecutar procesos periódicos de cierre y apertura y consultar la contabilidad a una fecha pasada.',
      'Generar balances y trabajar con cuentas anuales XLS, el motor de consultas Excel y la consolidación.',
    ],
    circuito: [
      { t: 'Diario y periodos', d: 'El diario orientado al apunte y la configuración del ejercicio con doce periodos contables y de impuestos.', ej: 'Diario anual, Diario resumen, Diario por asiento' },
      { t: 'Plantillas de contabilización', d: 'Libros maestros XLS que generan apuntes, impuestos, cartera y costes.', ej: 'capuntes, cimpcont, cefectos' },
      { t: 'Procesos periódicos', d: 'Regularización, cierre temporal, cierre definitivo y otros procesos sobre el ejercicio.', ej: 'asiento 99999998' },
      { t: 'Cierre y apertura', d: 'El cierre definitivo genera asiento de cierre y apertura; la reapertura los elimina.', ej: 'asientos 99999999 y 0' },
      { t: 'Balances', d: 'Balances de saldos y estados financieros por agrupación con cuentas anuales XLS.', ej: 'BALANCE08 · CTEPIG08' },
      { t: 'Consolidación', d: 'Siete etapas para combinar estados financieros de varias empresas del grupo.', ej: 'eliminación de operaciones intra-grupo' },
    ],
  },
  'icon-cartera': {
    frase: 'Sigues un efecto de la factura al banco: lo pagas suelto, en gestión o en remesa, creas su extracto y lo concilias.',
    recorrido: 'De la factura a la conciliación',
    aprendes: [
      'Leer un efecto en cartera y los estados, tipos y acciones que lo mueven.',
      'Pagar efectos sueltos, con una gestión y con una remesa, y ver su asiento y su tesorería.',
      'Crear el extracto, conciliarlo y contabilizarlo, y conocer anticipos, reclasificaciones y recobros.',
    ],
    circuito: [
      { t: 'Factura contabilizada', d: 'Al contabilizar la factura nacen sus efectos en cartera, uno por vencimiento.', ej: 'Tercero 00087 · empresa 0' },
      { t: 'Efecto pendiente', d: 'Su estado y su tipo deciden qué acciones admite.', ej: 'Estado PE · pendiente' },
      { t: 'Pago, gestión o remesa', d: 'Pagas el efecto suelto, varios con una gestión o un lote en una remesa.', ej: 'Pago directo · gestión masiva · remesa' },
      { t: 'Asiento y tesorería', d: 'La acción genera su asiento y, si mueve dinero, su movimiento de tesorería.', ej: 'Banco PRVCC0 · cuenta 572' },
      { t: 'Extracto bancario', d: 'El banco devuelve el movimiento con su criterio: el cargo en positivo y el abono en negativo.', ej: 'Extracto 1.524,60 · tesorería −1.524,60' },
      { t: 'Conciliación', d: 'Casas tesorería con el extracto y contabilizas la conciliación.', ej: 'Conciliar · Contabilizar' },
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
