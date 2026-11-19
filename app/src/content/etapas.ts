/**
 * Etapas de cada módulo (UX v5): los bloques agrupados en apartados, en el orden en que se aprenden.
 * - El número de cada bloque sale de este orden, no del JSON.
 * - Una etapa «opcional» es ampliación: no cierra el paso a nada y no cuenta para abrir el bloque siguiente.
 * - Un bloque que no aparezca aquí se muestra al final, en «Más bloques», para que nunca se pierda.
 */
export interface DefEtapa {
  titulo: string;
  /** Una frase: qué consigues en esta etapa */
  que: string;
  bloques: string[];
  opcional?: boolean;
}

export const ETAPAS: Record<string, DefEtapa[]> = {
  maestros: [
    { titulo: 'La empresa y su plan contable', que: 'Ves qué es una empresa en el ERP y cómo se organizan sus cuentas.', bloques: ['maestros-v-3', 'maestros-v-1', 'maestros-v-2'] },
    { titulo: 'Terceros, empresa, artículos y almacén', que: 'Das de alta los datos que usarán las compras y las ventas, y creas tu propia empresa.', bloques: ['maestros-1', 'maestros-v-4', 'maestros-2'] },
    { titulo: 'El stock', que: 'Registras una entrada de mercancía y la compruebas.', bloques: ['maestros-3'] },
  ],
  compras: [
    { titulo: 'Preparar la compra', que: 'Proveedor, artículo y tarifa: lo que necesita cualquier compra.', bloques: ['compras-1'] },
    { titulo: 'Comprar', que: 'Llevas una compra hasta el asiento, primero corta y luego completa.', bloques: ['compras-2', 'compras-3'] },
  ],
  ventas: [
    { titulo: 'Vender', que: 'Llevas una venta hasta el asiento y el cobro pendiente. Funciona como en Compras, pero con clientes.', bloques: ['ventas-1', 'ventas-2'] },
  ],
  'icon-contabilidad': [
    { titulo: 'Cómo se organiza la contabilidad', que: 'En qué orden se cargan las tablas de Finanzas, y qué son el diario, los periodos y las plantillas.', bloques: ['parametrizacion-icon-1', 'icon-contabilidad-1'] },
    { titulo: 'El plan de cuentas', que: 'Creas una cuenta de gasto y la retocas.', bloques: ['parametrizacion-1', 'parametrizacion-2'] },
    { titulo: 'Auxiliares y analítica', que: 'Creas un grupo auxiliar y lo asignas a la cuenta; después un proyecto y una sección para repartir gastos.', bloques: ['parametrizacion-3', 'parametrizacion-4', 'parametrizacion-5', 'parametrizacion-6'] },
    { titulo: 'Escribir un asiento manual', que: 'Abres los asientos, escribes uno y compruebas que cuadra.', bloques: ['asientos-1', 'asientos-2', 'asientos-3', 'asientos-4', 'asientos-5'] },
    { titulo: 'Contabilizar y copiar', que: 'Lo pasas a definitivo, lo duplicas y corriges importes.', bloques: ['asientos-6', 'asientos-11', 'asientos-12', 'asientos-13'] },
    { titulo: 'Consultar', que: 'Ves el asiento en los listados, el extracto y las sumas y saldos.', bloques: ['asientos-7', 'asientos-8', 'asientos-9', 'asientos-10'] },
    { titulo: 'Facturas que generan asientos', que: 'Contabilizas facturas, haces facturas directas y corriges errores.', bloques: ['icon-contabilidad-v-1', 'icon-contabilidad-v-2', 'icon-contabilidad-v-3', 'icon-contabilidad-v-4'] },
    { titulo: 'Cerrar el año', que: 'Cierre, apertura, balances y consolidación.', bloques: ['icon-contabilidad-2', 'icon-contabilidad-3'] },
    { titulo: 'Para saber más', que: 'Finanzas sola o junto a compras y ventas, y el asiento que genera un movimiento de banco (se trabaja a fondo en Tesorería).', bloques: ['parametrizacion-icon-2', 'asientos-14'], opcional: true },
  ],
  carteras: [
    { titulo: 'Preparar', que: 'Plazos, tipos de efecto y bancos propios.', bloques: ['carteras-1', 'carteras-3'] },
    { titulo: 'Ver la cartera', que: 'De la factura al efecto, y qué estados puede tener.', bloques: ['icon-cartera-v-1', 'icon-cartera-1'] },
    { titulo: 'Cobrar y pagar efectos', que: 'Cobras, pagas en efectivo y pagas con una gestión.', bloques: ['carteras-5', 'icon-cartera-v-2', 'icon-cartera-v-3', 'icon-cartera-2'] },
    { titulo: 'Remesas', que: 'Agrupas efectos en una remesa y la llevas al banco.', bloques: ['icon-cartera-v-4', 'icon-cartera-v-5', 'icon-cartera-v-7', 'icon-cartera-v-6', 'carteras-7'] },
    { titulo: 'Para saber más', que: 'Anticipos, reclasificaciones y cuadre a una fecha pasada.', bloques: ['icon-cartera-3'], opcional: true },
  ],
  tesoreria: [
    { titulo: 'Preparar el banco', que: 'El banco propio listo para tesorería, con su flujo y parámetros.', bloques: ['tesoreria-1', 'tesoreria-2'] },
    { titulo: 'Movimientos, extracto y conciliación', que: 'Registras un movimiento, lees el extracto del banco y los cruzas.', bloques: ['tesoreria-3', 'tesoreria-4', 'tesoreria-5'] },
    { titulo: 'Remesas en el banco', que: 'El extracto de una remesa de pago y de un cobro, y su conciliación.', bloques: ['icon-cartera-v-8', 'icon-cartera-v-9', 'icon-cartera-v-10', 'icon-cartera-v-11'] },
    { titulo: 'Para saber más', que: 'Cajas, financiación, valores y avales.', bloques: ['tesoreria-6', 'tesoreria-7', 'tesoreria-8'], opcional: true },
  ],
  'icon-impuestos': [
    { titulo: 'Entender el IVA', que: 'Qué calcula el ERP y por qué, sin códigos.', bloques: ['icon-impuestos-conceptos'] },
    { titulo: 'Cómo decide el ERP el impuesto', que: 'Maestros fiscales, datos de empresa, tercero y artículo, y la regla que los junta.', bloques: ['icon-impuestos-1', 'icon-impuestos-v-1', 'icon-impuestos-v-2', 'icon-impuestos-v-3'] },
    { titulo: 'Declarar', que: 'Registro fiscal, liquidación y control antes de presentar.', bloques: ['icon-impuestos-2', 'icon-impuestos-3', 'icon-impuestos-4'] },
  ],
  'icon-activos': [
    { titulo: 'Entender el activo fijo', que: 'Qué es y cómo se amortiza, sin abrir el ERP.', bloques: ['icon-activos-conceptos'] },
    { titulo: 'Del bien al componente', que: 'Cómo guarda el ERP un activo.', bloques: ['icon-activos-1'] },
    { titulo: 'Cómo nace un activo desde una factura', que: 'Lo que hay que preparar para que la factura cree el activo.', bloques: ['icon-activos-v-4', 'icon-activos-v-2', 'icon-activos-v-1', 'icon-activos-v-3'] },
    { titulo: 'Amortizar y dar de baja', que: 'La vida del activo hasta que sale de la empresa.', bloques: ['icon-activos-2', 'icon-activos-3'] },
  ],
};
