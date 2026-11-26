/**
 * Etapas de cada módulo (UX v5): los bloques agrupados en apartados, en el orden en que se aprenden.
 * - El número de cada bloque sale de este orden, no del JSON.
 * - Una etapa «opcional» es ampliación: no cierra el paso a nada y no cuenta para abrir el bloque siguiente.
 * - Un bloque que no aparezca aquí se muestra al final, en «Más bloques», para que nunca se pierda.
 */
export type Fase = 'configurar' | 'operar';

/** Qué se hace en cada fase (se pinta como encabezado en la página del módulo) */
export const FASES: Record<Fase, { titulo: string; que: string }> = {
  configurar: { titulo: 'Configurar', que: 'Dejas preparado lo que el ERP necesita antes de trabajar: maestros, códigos, tipologías y parámetros.' },
  operar: { titulo: 'Operar', que: 'Trabajas el día a día con lo que ya has preparado: documentos, asientos, cobros, pagos y procesos.' },
};

export interface DefEtapa {
  titulo: string;
  /** Una frase: qué consigues en esta etapa */
  que: string;
  bloques: string[];
  opcional?: boolean;
  /** Fase del módulo: «Configurar» primero y «Operar» después. Sin fase (p. ej. Fundamentos): sin encabezado de fase */
  fase?: Fase;
  /** Etapa sin bloques propios: dice qué reutilizas ya configurado (y, si hay `enlace`, en qué módulo) */
  nota?: string;
  enlace?: string;
}

export const ETAPAS: Record<string, DefEtapa[]> = {
  fundamentos: [
    { titulo: 'Moverse por el ERP', que: 'Entras, abres pantallas, buscas, lees una rejilla y una ficha y guardas: los gestos que usarás en todo el curso.', bloques: ['fundamentos-navegar'] },
    { titulo: 'Antes de abrir el ERP', que: 'Los conceptos que usarás en todo el curso: contabilidad, debe y haber, asiento y apunte, IVA, efecto, contabilizar y cierre.', bloques: ['fundamentos-1', 'fundamentos-2'] },
  ],
  maestros: [
    {
      fase: 'configurar',
      titulo: 'La empresa',
      que: 'Lees la ficha de una empresa y creas la tuya, con su ejercicio y su banco: lo mínimo para facturar, cobrar y pagar.',
      bloques: ['maestros-v-3', 'maestros-v-4'],
    },
  ],
  'icon-contabilidad': [
    { fase: 'configurar', titulo: 'El plan de cuentas', que: 'Consultas el plan contable y los mnemotécnicos, y das de alta y retocas tu cuenta de gasto.', bloques: ['maestros-v-1', 'maestros-v-2', 'parametrizacion-1', 'parametrizacion-2'] },
    { fase: 'configurar', titulo: 'Datos básicos que usarás después', que: 'Creas tu cliente, tu plazo de pago y tu tipo de efecto: los usarán Ventas y Cartera.', bloques: ['maestros-1'] },
    { fase: 'configurar', titulo: 'Diario, periodos y plantillas', que: 'Creas tu diario y conoces cómo se organizan el diario, los periodos y las plantillas de contabilización.', bloques: ['asientos-1', 'icon-contabilidad-1'] },
    { fase: 'operar', titulo: 'Escribir un asiento', que: 'Abres los asientos, escribes uno y compruebas que cuadra.', bloques: ['asientos-2', 'asientos-3', 'asientos-4', 'asientos-5'] },
    { fase: 'operar', titulo: 'Contabilizar, copiar y corregir', que: 'Lo pasas a definitivo, lo duplicas, programas copias y corriges importes.', bloques: ['asientos-6', 'asientos-11', 'asientos-12', 'asientos-13'] },
    { fase: 'operar', titulo: 'Consultar', que: 'Revisas los descuadres y ves tus asientos y sus copias en los listados, el extracto y las sumas y saldos.', bloques: ['asientos-7', 'asientos-8', 'asientos-9', 'asientos-10'] },
    { titulo: 'Para saber más: parametrización completa', que: 'El orden de carga de Finanzas, los auxiliares y la analítica, Finanzas sola o integrada, los saldos iniciales, los mnemotécnicos y las plantillas de contabilización.', bloques: ['parametrizacion-icon-1', 'parametrizacion-3', 'parametrizacion-4', 'parametrizacion-5', 'parametrizacion-6', 'parametrizacion-icon-2', 'contab-saldos-iniciales', 'contab-mnemotecnicos-alta', 'contab-plantilla-alta'], opcional: true },
  ],
  compras: [
    { fase: 'configurar', titulo: 'Maestros de compra', que: 'Gestión: cliente, artículo, proveedor y almacén; después tu proveedor y su precio de compra.', bloques: ['maestros-2', 'compras-1', 'compras-precios'] },
    { fase: 'configurar', titulo: 'Documentos', que: 'Cómo se numera y cómo se comporta cada documento del ciclo.', bloques: ['compras-tipos'] },
    { fase: 'configurar', titulo: 'Aprobación de pedidos', que: 'Montas la aprobación de pedidos de compra: rol, circuito, validación, grupo de validaciones y tipología. La pruebas al final de Operar.', bloques: ['compras-workflow-config'] },
    { fase: 'operar', titulo: 'Comprar', que: 'Llevas una compra de principio a fin: pides, recibes la mercancía, contabilizas el albarán y registras o generas la factura.', bloques: ['compras-3', 'compras-2', 'compras-albaran-contabilizar', 'compras-factura', 'compras-generar-factura'] },
    { fase: 'operar', titulo: 'Facturas que generan asientos', que: 'Contabilizas facturas, haces facturas directas y corriges errores.', bloques: ['icon-contabilidad-v-1', 'icon-contabilidad-v-2', 'icon-contabilidad-v-3', 'icon-contabilidad-v-4'] },
    { fase: 'operar', titulo: 'Devolver y controlar el stock', que: 'Corriges una compra ya facturada con un abono y registras y consultas el stock: cuánto hay y de dónde viene.', bloques: ['compras-abono-devolucion', 'maestros-3'] },
    { fase: 'operar', titulo: 'Aprobar pedidos: workflow', que: 'Con la aprobación ya montada, pruebas que un pedido sin referencia se bloquea y lo autorizas.', bloques: ['compras-workflow'] },
  ],
  ventas: [
    { fase: 'configurar', titulo: 'El cliente', que: 'Compruebas tu cliente y lo completas con lo que le falte para venderle: datos comerciales, impuestos, banco, condición de cobro y cuenta contable.', bloques: ['ventas-cliente'] },
    { fase: 'configurar', titulo: 'Los precios de venta', que: 'Creas tu lista y tu grupo de precios y se los asignas al cliente, para que el pedido proponga el precio.', bloques: ['ventas-precios'] },
    { fase: 'configurar', titulo: 'Los documentos de venta', que: 'Ves el mapa de tipologías y creas tu juego único de seis tipologías, enlazadas de la oferta a la factura.', bloques: ['ventas-tipologias-mapa', 'ventas-documentos'] },
    { fase: 'operar', titulo: 'Vender', que: 'Llevas una venta hasta el asiento y el cobro pendiente: pedido, albarán, factura, contabilizar, vencimiento y Docflow.', bloques: ['ventas-pedido'] },
    { fase: 'operar', titulo: 'Practicar otros circuitos', que: 'Con las tipologías que ya creaste: del albarán a la factura y de la oferta a la factura.', bloques: ['ventas-1', 'ventas-2'] },
  ],
  carteras: [
    { fase: 'configurar', titulo: 'Preparar', que: 'Plazos, tipos de efecto y bancos propios.', bloques: ['carteras-1', 'carteras-3'] },
    { fase: 'operar', titulo: 'Ver la cartera', que: 'De la factura al efecto, y qué estados puede tener.', bloques: ['icon-cartera-v-1', 'icon-cartera-1'] },
    { fase: 'operar', titulo: 'Cobrar y pagar efectos', que: 'Cobras (también una parte de un efecto), pagas en efectivo y pagas con una gestión.', bloques: ['carteras-5', 'icon-cartera-v-2', 'icon-cartera-v-3', 'icon-cartera-2', 'cartera-cobro-parcial'] },
    { fase: 'operar', titulo: 'Remesas', que: 'Agrupas efectos en una remesa y la llevas al banco.', bloques: ['icon-cartera-v-4', 'icon-cartera-v-5', 'icon-cartera-v-6', 'icon-cartera-v-7', 'carteras-7', 'cartera-mandato-sepa'] },
    { fase: 'operar', titulo: 'Impagados', que: 'Registras un recibo que el banco devuelve y conoces el descuento de efectos.', bloques: ['cartera-impagado-devolucion', 'cartera-descuento'] },
    { fase: 'operar', titulo: 'Para saber más', que: 'Anticipos, reclasificaciones y cuadre a una fecha pasada.', bloques: ['icon-cartera-3'], opcional: true },
  ],
  tesoreria: [
    { fase: 'configurar', titulo: 'Preparar el banco', que: 'El banco propio listo para tesorería, con su flujo y parámetros.', bloques: ['tesoreria-1', 'tesoreria-2'] },
    { fase: 'operar', titulo: 'Movimientos, extracto y conciliación', que: 'Registras un movimiento, ves el asiento que genera, lees el extracto del banco y los cruzas.', bloques: ['tesoreria-3', 'asientos-14', 'tesoreria-4', 'tesoreria-5'] },
    { fase: 'operar', titulo: 'Remesas en el banco', que: 'El extracto de una remesa de pago y de un cobro, y su conciliación.', bloques: ['icon-cartera-v-8', 'icon-cartera-v-9', 'icon-cartera-v-10', 'icon-cartera-v-11'] },
    { fase: 'operar', titulo: 'Para saber más', que: 'Cajas, financiación, valores y avales.', bloques: ['tesoreria-6', 'tesoreria-7', 'tesoreria-8'], opcional: true },
  ],
  'icon-impuestos': [
    { fase: 'configurar', titulo: 'Cómo decide el ERP el impuesto', que: 'Qué calcula el ERP y por qué, los maestros fiscales, los datos de empresa, tercero y artículo, y la regla que los junta.', bloques: ['icon-impuestos-conceptos', 'icon-impuestos-1', 'icon-impuestos-v-1', 'icon-impuestos-v-2', 'icon-impuestos-v-3'] },
    { fase: 'operar', titulo: 'Declarar', que: 'Registro fiscal, control antes de presentar y liquidación.', bloques: ['icon-impuestos-2', 'icon-impuestos-4', 'icon-impuestos-3'] },
  ],
  'icon-activos': [
    { fase: 'configurar', titulo: 'El activo y sus maestros', que: 'Qué es un activo fijo y cómo se amortiza, cómo lo guarda el ERP y qué familia de artículo necesita.', bloques: ['icon-activos-conceptos', 'icon-activos-1', 'icon-activos-v-4'] },
    { fase: 'operar', titulo: 'Del albarán al activo', que: 'Revisas el albarán y la factura que crean el activo y contabilizas una factura de activos.', bloques: ['icon-activos-v-1', 'icon-activos-v-2', 'icon-activos-v-3'] },
    { fase: 'operar', titulo: 'Amortizar y dar de baja', que: 'La vida del activo hasta que sale de la empresa.', bloques: ['icon-activos-2', 'icon-activos-3'] },
  ],
  'contabilidad-avanzada': [
    { fase: 'operar', titulo: 'Cerrar el año', que: 'Cierre, apertura, balances y consolidación.', bloques: ['icon-contabilidad-2', 'contab-cierre-practica', 'icon-contabilidad-3'] },
    { fase: 'operar', titulo: 'Caso final', que: 'Repasas tu empresa de principio a fin: configurar, comprar, vender, cobrar y pagar, declarar el IVA y cerrar.', bloques: ['caso-final'] },
  ],
};
