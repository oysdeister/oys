/**
 * Ideas clave de cada capítulo del vídeo de compras, resumidas de los guiones
 * (nueva/v2/capNN.json, escenas de resumen y consejo). Se muestran en la pestaña Concepto
 * de los ejercicios enlazados en VIDEO_POR_EJERCICIO (lib/config.ts).
 */
export const IDEAS_VIDEO: Record<number, string[]> = {
  2: [
    'Un maestro son datos que se escriben una vez y se reutilizan en todos los documentos.',
    'Primero el tercero (NIF, dirección y forma de pago, y validado); después el proveedor, con su tipo, divisa y facturación.',
    'Comprueba que el proveedor está Activo y que en su pestaña Tarifas tiene un grupo de precios: sin él, el programa no sabe qué precios aplicarle.',
    'El artículo es lo que compras: su ficha dice la unidad, la familia, el tipo contable (PRODUCTO, PROD) y la clave fiscal (BOG, bienes a tipo general).',
  ],
  3: [
    'Una lista de precios es un catálogo con fechas de vigencia; cada línea puede tener cantidad mínima (escalado) y hasta tres descuentos.',
    'Un grupo de precios es una caja ordenada de listas, y el proveedor apunta a un grupo.',
    'Si un precio no aparece, revisa tres cosas: que el proveedor tenga grupo, que el grupo contenga la lista y que la línea esté vigente en la fecha del pedido.',
  ],
  4: [
    'El tipo de documento es la plantilla que dice cómo se comporta un pedido, un albarán o una factura: número, precios, origen y asiento.',
    'El numerador es el contador y la máscara de serie es el molde del número: empresa, serie y seis cifras.',
    'El tipo de pedido PC tiene que traer el tipo de albarán ACPC; si está vacío, no se pueden generar albaranes desde los pedidos.',
  ],
  5: [
    'Un pedido es el encargo por escrito al proveedor: todavía no ha llegado nada ni hay que pagar.',
    'Cabecera (tipo, empresa, delegación, fecha, número y proveedor) y líneas (artículo, cantidad y precio; el importe es cantidad por precio).',
    'Al validarlo pasa de Provisional a Validado y queda en situación Pendiente, esperando la mercancía.',
  ],
  6: [
    'El albarán acompaña a la mercancía y la hace entrar en el almacén.',
    'Se genera desde el pedido, sin teclear nada dos veces, y el pedido pasa de Pendiente a Servido.',
    'Validar es darlo por bueno: ya no se modifica. Al contabilizarlo se apunta la mercancía pendiente de facturar.',
  ],
  7: [
    'La factura se genera desde el albarán con «Acciones» › «Generar factura».',
    'Escribe el número de factura del proveedor tal como viene en su papel y el importe que declara.',
    'Comprueba que el importe declarado y el importe total calculado (base + IVA del 21 %) coinciden antes de validar.',
  ],
  8: [
    'Un asiento anota la operación en cuentas contables: el debe y el haber siempre suman lo mismo (cuadre 0,00).',
    'El asiento de la factura anota el IVA soportado y la deuda con el proveedor, y deshace el apunte provisional del albarán.',
    'Si la cuenta del IVA sale como 00000 (sin definir), falta configurarla en el tipo de impuesto. La casilla «Prevista de Asiento Contable» te enseña el asiento sin guardarlo.',
  ],
  9: [
    'Docflow es el árbol genealógico de una compra: de qué pedido sale un albarán y de qué albarán sale una factura.',
    'Se abre con la flecha junto a la estrella del albarán o de la factura; el borde naranja marca dónde estás.',
    'Al terminar una compra, comprueba que están las tres cajas unidas: si falta una o sigue pendiente, queda algo por hacer.',
  ],
};
