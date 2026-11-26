# Modelo técnico de Tesorería (resumen propio)

Fuente: skill `erp-nuevo-icon-documentacion/references/hechos-tesoreria.md` y `hechos-tesoreria-b.md` (resumen de la documentación de referencia de Deister; aquí solo se resume con palabras propias) y los bloques de `tesoreria.json`. Lo no visto en la demo, «(sin verificar)».

## Índice
1. Tablas · 2. Maestros y su orden · 3. Conciliación · 4. Comisiones · 5. Traspasos · 6. Cajas · 7. Domiciliaciones

## 1. Tablas
`cbancpro` banco propio (empresa, entidad, IBAN/BBAN, cuenta contable, tipo de cuenta, saldo y fecha de extracto) · `tipocuenta` · `toperfin` operación (cobro o pago, flujo, acción de cartera, fecha de operación y valoración, Referencia, Conciliar autorizar/auditar) · `tctaopec` operaciones por cuenta y días de valor (prevalece sobre `toperfin`) · `tflujfin` flujo (inversión, ingreso o gasto; Debe/Haber/Ambos; cuenta 0000 para efectos de cartera con posición Ambos) · `tflujcar` relación flujo-cartera · `tagrupac` agrupaciones estadísticas · `titescfg` parámetros (un solo registro) · `calendario`, `tcalsaba` (si la fecha valor cae en festivo pasa al siguiente día hábil) · `tconcomu`, `tconprop` conceptos · `taptcuen`, `taptfluj` movimiento y flujos · `textract_file`, `textract` almacén y apuntes de extracto · `tconcili` conciliados · `ttarcomi`, `topecomi` comisiones · `tcondomi` domiciliaciones · `ttramovh/ttramovd/ttraempr` traspasos.

## 2. Orden de carga de maestros (documentación)
Monedas, empresas, terceros y direcciones → tipos de cuenta y bancos propios → operaciones, flujos y relación flujo-cartera → operaciones por cuenta y días de valor, calendarios → conceptos comunes y propios → parámetros y agrupaciones → comisiones, intereses de referencia → traspasos. En el caso del curso todo esto se reduce a BBVA_{INI}, {INI}COM y los conceptos del banco ES0182.

## 3. Conciliación
Flujo: extracto → concepto bancario → operación financiera → movimiento. Conciliación manual: marcar uno o varios del extracto contra uno o varios de tesorería. **Pseudo-conciliación**: la hace el propio movimiento de tesorería antes de recibir el extracto. Global: todos los pendientes del extracto contra los pendientes de tesorería; selectiva: con «generar» e indicando la operación, crea el movimiento que falta. Acciones sobre el extracto: **Conciliar** (misma regla que la automática, sobre un apunte), **Generar** (inserta el movimiento y pide operación; integración manual autorizada por el tesorero), **Vincular** (agrupa varios apuntes de extracto con el principal), **Selección**, **Cancelar extractos** (extorno). Los movimientos que nacen de la integración llevan la marca X y se eliminan al desconciliar si no están contabilizados. Si «Conciliar» no puede, no hace nada: concilia o integra a mano. La carga del N43 solo carga; no concilia. Un mismo fichero puede traer varias cuentas de la misma entidad; la cuenta financiera se deduce del código de cuenta del banco.

## 4. Comisiones
Por cuenta financiera y operación: fija (importe) o variable (porcentaje; el importe mínimo, el exento y el máximo solo valen con porcentaje); por beneficiario o por efecto; se calculan solos al insertar el movimiento. Si el flujo tiene tipología de factura, se registra una factura de compra o venta enlazada al movimiento (con impuestos para el SII). Flujos típicos: FIJ comisiones fijas, VAR variables, cuenta 626 Servicios bancarios, movimiento de Debe.

## 5. Traspasos entre cuentas (sin verificar en la demo)
Tesorería › Traspasos bancarios. Intraempresa: Préstamo o Depósito, descripción, tipo de documento que no permita traspaso entre empresas, empresa origen, cuentas, importe, «insertar» y «Confirmar»: dos movimientos (pago y cobro). Interempresa: tipo de documento que lo permita y empresa destino distinta: cuatro movimientos; exige antes la parametrización en «Cuentas intermedias de traspaso». En el tipo de traspaso se fijan las operaciones y flujos de salida y de entrada. Con monedas distintas se informa el importe en divisa. «Anular» solo mientras no estén conciliados.

## 6. Cajas
Tablas `ccajadef` (definición, estado A/C), `ccajaope` (operaciones; `tippag` E efectivo, I saldo inicial, T/D tarjeta; `numsec` nulo o ≥ 20), `ccajamon` (billetes y monedas), `ccajamov` (diario; A abierto, L liquidado, C cerrado), `ccajalin` (líneas), vales, `ccajaliq`, `ccajarem` (remesas A/C) y `ccajache` (cheques R registrado, P propuesto, C contabilizado, G gestionado, I impagado). Liquidar actualiza las líneas, controla el descuadre por moneda (solo si `indliq` = S) y pasa el diario a L; contabilizar es un proceso posterior e independiente (agrupa por cuenta, proyecto, sección, sistema y fecha). El paso a G ocurre al cerrar la remesa, no al cerrar la caja. Depurar: solo movimientos ya contabilizados; deja un movimiento resumen.

## 7. Domiciliaciones
Alta en Terceros › Domiciliaciones y registro en la pantalla de domiciliaciones (`tcondomi`); informes de control; se contabilizan al conciliar los extractos.
