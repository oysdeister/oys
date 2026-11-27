---
name: erp-antiguo-compras
description: Conocimiento funcional del circuito de compras de la versión antigua del ERP Deister (2015, entorno O&S Learning) - tarifas de compra y descuento, prioridad proveedor/delegación, series de justificantes y máscaras, tipología de pedido PC, workflow con aprobaciones, albarán RC, contabilización 4009/6000, valoración, factura FCA, conformar albaranes, error 3000 y asiento. Úsala al explicar, documentar o grabar compras en el ERP antiguo, o para comparar con la versión nueva.
---

# Compras en el ERP antiguo (Deister 2015)

Fuente: dos Loom de formación (diciembre de 2015) analizados y verificados fotograma a fotograma. Lo genérico sirve para otros módulos del ERP antiguo (mismo patrón de maestros › tipologías › series › documento › workflow › contabilización).

## Circuito
Tarifa → proveedor con tarifa → tipo de documento con serie → **pedido PC** (workflow) → **albarán RC** desde pedido → contabilizar albarán → **factura FCA** → conformar albaranes → validar (control de importe) → contabilizar factura.

## Puntos clave
- **Rutas**: Compras › Maestros › Tarifas › Precios › Registro; Compras › Maestros › Documentos (Pedidos, Albaranes, Facturas…); Compras › Pedidos/Albaranes/Facturas › Registro.
- **Tarifa**: cabecera (código, divisa, fechas, prioridad, días) + líneas (artículo, unidad, vigencia, precio, descuentos generales en cascada; botón Escalado de precios). Se cambian precios con nuevas vigencias.
- **Dónde se aplica**: en compras, en el proveedor (Terceros › Proveedores › Datos económicos › Tarifa precios). La delegación solo lleva tarifas de **venta** (v1 decía lo contrario; v2 lo corrige).
- **Series de justificantes**: numerador, justificación (cifras), excluir separador, control cronológico, renovación, máscara (`[yymm#e]` → 151201PC-; con excluir separador el número es 151201PC000003).
- **Tipo PC**: serie, documento origen (Tabla origen, 11 valores), valoración (fecha inicio/fin/documento/no valorar), clase (Normal, Reposición, Programación, Muestras), validar catálogo, impresión, tipo workflow (PCW01) y campos a ocultar.
- **Workflow del pedido**: nace «Bloqueado 26000» al guardar; >3000€ Autorizar (motivo) → Aprobar Jefe de Central → Aprobar Director General → envío → Validado.
- **Albarán RC**: origen obligatorio (pedidos `estcab in ('V','P')`), hereda proveedor, divisa, efecto y forma de pago; «Agregar líneas pedido» con cantidad recibida (lo no recibido queda pendiente: pedido Parcial). Valorar: Tarifa / Última compra / Coste medio / No.
- **Contabilizar albarán**: 6000 debe / 4009 haber (facturas pendientes de recibir).
- **Factura FCA**: número de factura del proveedor obligatorio; importe tecleado del papel; Conformar albaranes copia líneas e impuestos; si sale CRC, «Forzar actualización» (Alt+R); si el importe no cuadra, **Bloqueada 3000 · IMPORTE PROVEEDOR != IMPORTE FACTURA**; se corrige y se valida; contabilizar con fecha: 4000 proveedor haber / 4720 IVA debe / 4009 debe.

## Ejemplo verificado
COCHE A6 a 2.000 (tarifa G00003 del proveedor P00001) y COCHE A4 sin tarifa a 1.000 → pedido 151201PC000003, 10.000 → albarán 201501RC-000002 (3 + 3, 9.000; asiento 63) → factura FACT-1: tecleada 8.750 → error 3000 → 10.890 (base 9.000 + IVA 1.890; asiento 64).

## References
- `references/verificacion.md`: datos comprobados con su segundo, correcciones, exclusiones de privacidad, dudas.
- `references/guion_fusionado.md`: procedimientos paso a paso y guion completo (9 capítulos).
- `references/v1_analisis.md`, `references/v2_tramo1..5.md`: análisis por tramos de los Loom.
