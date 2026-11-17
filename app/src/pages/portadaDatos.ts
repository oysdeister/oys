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
    ],
    circuito: [
      { t: 'Plazo y efecto', d: 'Cuándo se paga y con qué tipo de efecto.', ej: 'Plazo {INI}1: 40, 80 y 120 días (40/20/40 %)' },
      { t: 'Condiciones', d: 'El tercero recibe su forma de pago y de cobro.', ej: 'Pago: efecto T{INI} + plazo {INI}1' },
      { t: 'Factura y efectos', d: 'Al contabilizar la factura nacen los efectos, en estado PE (pendiente).', ej: '121,00 → 48,40 + 24,20 + 48,40' },
      { t: 'Banco propio', d: 'La cuenta por la que se cobra o se paga.', ej: 'BBVA_{INI} (57200) · CAJA_{INI} (57000)' },
      { t: 'Cobro o remesa', d: 'Uno a uno con una gestión, o varios juntos en una remesa.', ej: 'PE › PR › OC › CO' },
      { t: 'Asiento', d: 'Cada cambio de estado deja su asiento contable.', ej: 'Efecto en CO = cobrado' },
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
    frase: 'Gestionas los efectos a cobrar y a pagar desde la factura hasta el asiento y el histórico.',
    recorrido: 'De la factura al histórico',
    aprendes: [
      'Configurar estados, acciones y enlaces contables de la cartera.',
      'Cerrar gestiones y entender qué actualiza en efectos, histórico y tesorería.',
      'Usar anticipos, reclasificaciones y remesas, y reconstruir la cartera a una fecha pasada.',
    ],
    circuito: [
      { t: 'Factura', d: 'Al contabilizar la factura nacen efectos en cartera.' },
      { t: 'Efecto pendiente', d: 'El estado del efecto decide si se puede modificar o gestionar.', ej: 'cefectos · estado' },
      { t: 'Gestión o remesa', d: 'Agrupas efectos para aplicar una acción; en remesas puedes evolucionar o retroceder.', ej: 'cefecges_pcs · cefecges_det' },
      { t: 'Cierre', d: 'Ejecuta el cambio de estado y genera asiento si la acción tiene plantilla contable.', ej: 'cefeacti.codast · cefeplah.codpla' },
      { t: 'Asiento', d: 'Actualiza cefectos, escribe histórico y crea movimientos de tesorería si corresponde.', ej: 'capuntes40 · actlog 0, 1, 2' },
      { t: 'Histórico', d: 'Cada cambio queda en cefechis; sirve para reaperturas y consulta a fecha pasada.', ej: 'cefechis · cefecges_det' },
    ],
  },
  'icon-impuestos': {
    frase: 'Identificas los maestros fiscales y sigues el IVA de una línea desde la zona fiscal hasta la declaración.',
    recorrido: 'De la zona fiscal a la declaración',
    aprendes: [
      'Entender los maestros que intervienen en el cálculo del impuesto de una línea.',
      'Generar y consultar el registro fiscal con IVA, prorrata e inversión del sujeto pasivo.',
      'Preparar la liquidación del IVA y ejecutar los procesos de impuestos y E-Reporting/SII.',
    ],
    circuito: [
      { t: 'Zona fiscal', d: 'Sitúa territorialmente a la empresa y al tercero y aporta contexto de país e INTRASTAT.', ej: 'ESCO · zone_intrast 0 o 1 · zone_taiter 1' },
      { t: 'Clave fiscal', d: 'Clasifica el artículo, el tercero o el documento y alimenta el motor fiscal.', ej: 'BOR · RECC · RREQ · REBU · REAGYP' },
      { t: 'Tipo de impuesto', d: 'Define porcentaje, base de cálculo, deducibilidad, prorrata y cuentas contables.', ej: 'ESG · type_porcen 21 · type_bascal 0' },
      { t: 'Línea del documento', d: 'El motor combina zonas y claves y devuelve operación y tipo de impuesto.', ej: 'CLBC · ESG' },
      { t: 'Registro fiscal', d: 'Centraliza cabecera y líneas por documento; guarda naturaleza, libro y rectificaciones.', ej: 'taxh_natfac C/V · taxh_tipdoc F1' },
      { t: 'Declaración', d: 'Liquidas el IVA con los modelos y ejecutas los procesos de impuestos.', ej: 'Modelo 303 · Modelo 390 · Modelo 349' },
    ],
  },
  'icon-activos': {
    frase: 'Organizas el inmovilizado en bienes, elementos y componentes y registras amortizaciones, traspasos, bajas y ventas.',
    recorrido: 'De los grupos y cuentas a la baja o venta',
    aprendes: [
      'Configurar grupos, cuentas y tablas fiscales del inmovilizado.',
      'Dar de alta bienes, elementos y componentes con su información contable y de costes.',
      'Registrar amortizaciones, traspasos, bajas y ventas, y consultar informes.',
    ],
    circuito: [
      { t: 'Grupos y cuentas', d: 'Maestros previos de grupos de inmovilizado, cuentas contables y tablas fiscales.', ej: 'cinmgrps · cinmctas · cinmftab' },
      { t: 'Bien', d: 'Unidad genérica que agrupa elementos y define clasificaciones comunes.', ej: 'cinmhead' },
      { t: 'Elemento', d: 'Nivel con la información contable y de costes: proyecto, sección, centro y localización.', ej: 'cinmelem · Presupuesto · Proyecto' },
      { t: 'Componente', d: 'Unidad mínima de control económico; soporta adquisiciones factura a factura.', ej: 'cinmcomp' },
      { t: 'Amortización', d: 'Calculas, contabilizas o descontabilizas la amortización del período.', ej: 'Sistema L Lineal · D Decreciente' },
      { t: 'Baja o venta', d: 'Das de baja total o parcial, vendes o desactivas temporalmente el activo.', ej: 'Baja total · Venta · Fuera de servicio' },
    ],
  },
};
