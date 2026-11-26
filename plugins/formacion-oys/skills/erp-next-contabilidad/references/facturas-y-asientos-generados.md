# Facturas que contabilizan y asientos que generan

Fuente: `icon-contabilidad.json` › `icon-contabilidad-v-1` a `-v-4`, `asientos-14`; grabaciones «Icon» (Finanzas 1); `erp-nuevo-icon-documentacion` (PAGE 885-888).

## Índice
1. Contabilizar una factura de compra con origen albarán
2. Cartera y registros fiscales generados
3. Facturas directas FC/FB en Finanzas
4. Rectificativa y sustitutiva
5. Factura que no contabiliza (tres causas)
6. Asiento de un movimiento de banco

Cifras: en las capturas y el vídeo la factura es ML0260020 del proveedor 00027 (875,00 + 183,75 = 1.058,75, efecto TF pendiente); en el caso del alumno es PROV-{INI}-001 de T{INI}: 125,00 + 26,25 = 151,25. El mecanismo es el mismo.

## 1. Contabilizar una factura de compra (Gestión › Compras › Facturas)
Concepto: contabilizar genera **asiento + efectos de cartera + registros fiscales**. Sin ello la deuda con el proveedor no sale en saldos y el IVA no llega a Hacienda. Estado «Entrada/Validado» → «Contabilizada» y aparece **«Descontabilizar»** (si ves «Descontabilizar» y no «Contabilizar», otra persona ya la contabilizó). El menú desplegable de la cabecera salta a Docflow, Acuerdos, Albaranes, Suministros, **Asientos contables, Cartera de efectos, Registros fiscales**; esos documentos no existen mientras la factura siga en Entrada/Validado.
Asiento: **Debe** la compra (cuenta del grupo 60: 60000 en el caso) y el IVA soportado (47200); **Haber** el proveedor (grupo 40: 40000.T{INI}). 875,00 + 183,75 = 1.058,75. Si el albarán se hubiera contabilizado antes, el Debe iría a la 40090 «Compras pendientes de factura» (cuenta puente; la deuda firme es la 400 con la factura); con la tipología AO{INI} el albarán no genera asiento.

## 2. Cartera y registros fiscales
Efecto de clase **Pagar** (viene de una compra), tipo TF (transferencia), estado Pendiente (PE). Para repasarlo se usa la FC-012345 del proveedor 00087 (efecto TF, 1.815,00, vence 23-07-2026), en Finanzas › Cobros y Pagos › Cobros y Pagos («CARTERA DE EFECTOS › FC-012345»). Registros fiscales: IVA 21 %, base y total. La cartera (deuda) no es el asiento ni el registro fiscal. Fallo conocido del entorno: al abrir «Registros fiscales» puede salir una franja roja «Table … does not exists in database»; el detalle fiscal se ve igual; sigue.

## 3. Facturas directas FC/FB (Finanzas › Facturación › Compras › Fact. de compra)
Sin pedido, albarán ni solicitud de origen. **FC** compras, **FB** ventas. «Nuevo documento» › tipo FC. Pide empresa, proveedor y datos financieros; la **cuenta financiera es obligatoria**. Vídeo: empresa LIZ, proveedor 00003, línea 5.000,00 + 21 % (1.050,00) = 6.050,00; nº FCLIZ26-000001; factura proveedor F001-0000012.
Orden: guardar → **validar** (el importe factura y el importe total calculado deben coincidir) → **contabilizar**. Si no coinciden, no se activa Contabilizar: revisa líneas e impuestos. El detalle de impuestos muestra base, cuota deducible e impuesto.
Venta FB (cliente 00003, líneas a 70000.00000): al validar sale «An error occurred … ha sido consolidado». Es un fallo del entorno de formación, no tuyo (sin verificar si sigue ocurriendo). En el menú «Fact. de compra» sale recortado («Fact. de com…»): búscalo con Cmd/Ctrl+K.

## 4. Rectificativa y sustitutiva
Una factura emitida **no se borra** (el IVA ya declarado no coincidiría con las facturas). Se emite otra:
- **Rectificativa**: corrige descuentos, importes mal puestos u otros ajustes; no anula la original, queda vinculada y entra en su **Docflow**. Ejemplo: 1.000,00 sin el descuento del 10 % → rectificativa de −100,00 + IVA (suman 900,00 + IVA). En el caso, devolver 1 ud de T{INI}: −12,50 − 2,63 = −15,13. Se elige en «Nuevo documento» un tipo de factura rectificativa, p. ej. **R4** (Rectif. Otros). En otros países se llama nota de crédito.
- **Sustitutiva** (tipo **FU**): anula definitivamente la inicial y la reemplaza, cuando el error no se arregla ajustando importes (p. ej. proveedor equivocado). En la grabación no se enseña la pantalla; solo el concepto (pantalla de la sustitutiva: sin verificar).
Regla: ¿se arregla ajustando importes? rectificativa; si no, sustitutiva.

## 5. Factura que no contabiliza
| Causa | Síntoma | Solución |
|---|---|---|
| **Importe total 0** (p. ej. +100 y −100) | contabiliza, genera asiento y registro fiscal pero **no cartera**: no se puede remesar ni conciliar | Descontabilizar, corregir líneas para que el total ≠ 0, volver a contabilizar (genera efecto) |
| **Periodo cerrado** | no se contabiliza con fecha de un periodo cerrado (en el vídeo, enero a junio cerrados y julio abierto; en TUTORIAL los 12 de 2026 abiertos) | cambia la fecha a un periodo Abierto (columna «Estado contable» del ejercicio); abrir periodos lo hace quien administra la contabilidad, en la demo no lo toques |
| **Tipo de asiento** (facturas de origen pedido) | error de tipo de asiento al contabilizar | «Pasar a provisional» antes de cambiar el tipo de efecto; revisar tipo de documento y tipo de asiento (compra EPC, venta FB) |
Orden de revisión: total ≠ 0 → fecha en periodo abierto → pestaña Contabilización de la tipología con «Tipo asiento» → cuentas de sus líneas existen. La compra del caso (09-10-2026) cae en el periodo 10, abierto.
Otros síntomas ya vistos: «Domiciliación bancaria no informada» (domiciliaciones del tercero sin parametrizar: usa transferencia/cheque), «falta una cuenta» al contabilizar (falta en un maestro: proveedor, artículo o plantilla).

## 6. Asiento de un movimiento de banco (Buscador › Movimientos de tesorería, `taptcuen`)
Cada movimiento tiene botón «Contabilizar» y pestaña **Flujos** (Flujo, Cuenta contable, Descripción cuenta, Importe flujo, Efecto). Al contabilizar, la cuenta del **banco propio** (la de su ficha en Bancos propios) se enfrenta a las cuentas de los flujos: **en una salida, flujo al Debe y banco al Haber; en una entrada, al revés**. Debe = Haber. Cada flujo necesita cuenta contable (mnemotécnica); sin ella no se contabiliza y no sale un error claro.
Comisión: si el banco propio tiene informada «Operación comisión», la comisión crea **otro movimiento y otro asiento**; vacía, es un flujo más del mismo asiento (Debe: flujo del pago + flujo de comisión; Haber: banco por la suma).
Caso: comisión del 12-11-2026: 62600.00000 Debe 10,00 / 57200.00000 Haber 10,00; pago a T{INI}: 40000.T{INI} Debe 151,25 / 57200 Haber 151,25 y su comisión 62600 Debe 3,50 / 57200 Haber 3,50. Demo de práctica: pago de una remesa de 8.080,15 (Debe 40100.00003 proveedor / Haber banco). Detalle de tesorería: `erp-next-tesoreria`.
