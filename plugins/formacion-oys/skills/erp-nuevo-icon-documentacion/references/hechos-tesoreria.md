# Tesorería y caja en ICON — resumen de referencia (funcional y técnico)

## 1) Conceptos clave

- Movimiento de tesorería: qué movimiento se ha producido; ejemplo, entrada de 1.000 € (PAGE 815).
- Flujo financiero: para qué se produce el movimiento; ejemplo, pago de nóminas (PAGE 815).
- Operación financiera: cómo se realiza; ejemplo, transferencia bancaria (PAGE 815).
- Circuito general de tesorería: origen de la operación → movimiento de tesorería → conciliación bancaria → contabilización (PAGE 815).
- Orígenes de movimientos: Cartera (remesas de cobros/pagos), Contabilidad (nóminas, ventas), Extracto bancario (comisiones, impagados), Manual (traspasos) y Otros (avales, presupuestos) (PAGE 815).
- Traspaso bancario: emisión de traspasos de fondos intraempresa o interempresa; la emisión entre entidades jurídicas exige reconocer la deuda financiera (PAGE 817).
- Conciliación: marcar uno o varios movimientos de la tabla de extractos contra uno o varios movimientos de cuentas corrientes-tesorería (PAGE 829).
- Pseudo-conciliación automática: conciliación ejecutada desde el registro de un movimiento de tesorería, antes de recibir el extracto (PAGE 829).
- Extracto bancario: movimientos reales de las entidades financieras, soporte de la conciliación con `taptcuen`; carga automática según norma bancaria 43 (PAGE 839).
- Domiciliación bancaria: operación por la que el banco carga o adeuda un recibo en la cuenta de un cliente sin intervención de este (PAGE 841).
- Caja: registrar, controlar y cerrar los movimientos de una caja, ligados a operaciones financieras, contabilidad, remesas y liquidación (PAGE 764).
- Vale de caja: préstamo de dinero con fondos de la caja; al cancelarse, el importe vuelve al saldo disponible (PAGE 769).
- Liquidación de caja: comprobar que la suma de monedas y billetes coincide con el saldo efectivo de líneas y vales; si no coincide, se impide y se muestra el descuadre (PAGE 769).

## 2) Rutas de menú exactas

- Finanzas/Finanzas/Tesorería — Visión general (PAGE 815).
- Finanzas/Finanzas/Tesorería | Traspasos Bancarios (PAGE 817).
- Finanzas/Finanzas/Tesorería/Maestros | Configuración (PAGE 829).
- Finanzas/Finanzas/Tesorería/Maestros/Comisiones | Tarifas de comisiones (PAGE 820).
- Finanzas/Finanzas/Tesorería/Extractos bancarios | Extractos bancarios (PAGE 839).
- Finanzas/Finanzas/Tesorería/Extractos bancarios/Domiciliaciones | Domiciliaciones (PAGE 841).
- Finanzas/Finanzas/Tesorería/Procesos | Conciliación (PAGE 824).
- Finanzas/Finanzas/Caja | Vision General (PAGE 764).
- Finanzas/Finanzas/Caja | Dashboard y KPI (PAGE 766).
- Finanzas/Finanzas/Caja | Informes y seguimiento (PAGE 767).
- Finanzas/Finanzas/Caja | Configuración (PAGE 768).
- Finanzas/Finanzas/Caja | Registro y operativa (PAGE 769).
- Finanzas/Finanzas/Caja | Cheques y Remesas (PAGE 913).
- Finanzas/Finanzas/Tesorería/Informes de Posición | Posición de flujos financieros por tramo de días (PAGE 1070); | Posición de fondos para grupos de cuentas y entidades (PAGE 1072); | Posición de agrupaciones de cuentas y entidades financieras (PAGE 1077).
- Finanzas/Finanzas/Tesorería/Informes de Posición/Cashflow | Flujos financieros por mes (PAGE 1017); | Saldos cuentas financieras (PAGE 1074); /Situación financiera global | Situación global por entidad y cuentas (PAGE 1079).
- Subrutas de maestros de caja: `Finanzas > Caja > Maestros > Definición de cajas`, `... > Tipos de operaciones de caja`, `... > Tipos de moneda de caja` (PAGE 768).
- Otras rutas de caja: `Finanzas > Caja > Movimientos` (PAGE 769); `Finanzas > Caja > Remesas > Registro` (PAGE 913); `Terceros > Domiciliaciones` (PAGE 841).

## 3) Tablas y campos

**Tesorería**

- `ttramovh` — traspasos entre cuentas (PAGE 817).
- `ttramovd` — tipos de traspaso o cesión: «Entre empresas», «Operación de salida*», «Operación de entrada*», «Flujo de salida», «Flujo de entrada» (PAGE 817).
- `ttraempr` — cuentas intermedias; solo necesarias si el traspaso es entre empresas distintas del grupo (PAGE 817).
- `toperfin` — operaciones financieras: cobro o pago, flujo financiero, acción de cartera, fecha de la operación, valoración, referencia (Documento, 1ª referencia, 2ª referencia) y conciliar (`autorizar` o auditoría del tesorero) (PAGE 829).
- `tctaopec` — operaciones por cuenta financiera y tabla secundaria «Días de valor por operación y cuenta financiera»; prevalece sobre `toperfin` (PAGE 829).
- `tagrupac` — agrupaciones de cuentas financieras, flujos u operaciones para agrupación lógica con fines estadísticos (PAGE 829).
- `cbancpro` — cuentas de bancos propios; campos `ctafin`, `nomcta`, `empcode`, `entfin`, `agrcta`, `cuenta`, `moneda`, `tipcta`, `estado`, `iban`/`bban`, `ctaref`, `salext`/`fecext` (PAGE 829, PAGE 1077).
- `tipocuenta` — tipos de cuenta financiera: corrientes, pólizas de crédito, cuentas a plazo, etc. (PAGE 829).
- `titescfg` — configuración general; solo puede contener un único registro; define prioridad de criterios de determinación de códigos de flujo financiero (PAGE 829).
- `tflujfin` — flujos financieros: inversión, ingreso o gasto financiero; movimiento de Debe, Haber o Ambos; cuenta indefinida (0000) en efectos de cartera de cobros/pagos (PAGE 829).
- `tflujcar` — relaciones flujos financieros-cartera; asocia por Tipo de tercero, Tercero, Estado y Efecto (PAGE 829).
- `calendario` y `tcalsaba` — calendarios jerarquizados de festivos y sábados festivos por período de fechas y tipo de operación (PAGE 829).
- `tconcomu` — conceptos comunes (Asociación española de banca); `tconprop` — conceptos propios del banco, con operación deudora o acreedora para conciliación automática (PAGE 829).
- `taptcuen` — movimientos de tesorería; ejemplo literal: Cuenta financiera Banco B, Importe 5.000,00, Debe/Haber Haber, Tipo operación financiera CH (Cheques, talones), Fecha operación 20-04-2002, Fecha valor 22-04-2002 (PAGE 829).
- `taptfluj` — flujos financieros asociados; ejemplo código `PRN`, «Proveedores nacionales», clase `Pagar`, acción `PAG (Pago de efectos remesados)` (PAGE 829).
- `textract_file` — almacén de ficheros de extractos; `textract` — apuntes de extracto; `tconcili` — movimientos conciliados (PAGE 829, PAGE 839).
- `ttarcomi` — tarifas de comisiones; `topecomi` — relaciones operaciones y comisiones (PAGE 820).
- `tcondomi` — domiciliaciones bancarias (PAGE 841).
- Comisiones/facturas: `taptcuen`, `toperfin`, `taptfluj`, `ccomfach`, `cvenfach`, `capuntes`, `ctax_move_head`, `essii_facturas_sii` (PAGE 829).

**Caja**

- `ccajadef` — definición de caja: `codcaj`, `nomcaj`, `empcode`, `ctafin`, `moneda`, `cuenta`, `proyec`, `seccio`, `jusser`, `codper`, `opecob`, `opepag`, `indliq`, `estado` (`Abierta`/`Cerrada`) (PAGE 768).
- `ccajaope` — operaciones de caja: `codigo`, `nomope`, `cuenta`, `numsec`, `tippag`, `invers`, `indliq`, `debhab`, `opefin`; `tippag` = `E`/`I`/`T`/`D` (Efectivo, saldo inicial, tarjeta de crédito, tarjeta de débito); `numsec` nulo o ≥ 20 (PAGE 768).
- `ccajamon` — tipos de moneda: `tipmon`, `nommon`, `moneda`, `impmon` (PAGE 768).
- `ccajamov` — diario de caja: `cajaid`, `codcaj`, `turno`, `empcode`, `proyec`, `seccio`, `fecmov`, `jusser`, `estado` (PAGE 769).
- `ccajalin` — líneas (contrapartidas): tipo de operación, documento, descripción, fecha, importe en divisa y moneda, estado de línea `Inicial`/`Definitivo`, cuenta contable, concepto contable, sistema contable, proyecto, sección, cantidad 1 y cantidad 2 (PAGE 769).
- `ccajaval` y `ccajaliq` — tablas citadas en el circuito de caja junto a `ccajarem` y `ccajache`; la liquidación agrupa por moneda los importes de `ccajalin`, `ccajaval` y `ccajaliq` (PAGE 913).
- Vales de caja: documento (serie de documentos), importe, solicitante, fecha prevista cancelación, fecha cancelación (PAGE 769).
- `ccajarem` — remesas: `remesa`, `remfec`, `empcode`, `codcaj`, `ctafin`, `jusser`, `remtot`, `moneda`, `estado` (`A`/`C`) (PAGE 913).
- `ccajache` — cheques: estados `R`, `P`, `C`, `G`, `I`; vínculo con remesa mediante `ccajache.numrem` (PAGE 913).

## 4) Circuitos y orden de carga

- Traspaso intraempresa: `Préstamo`/`Depósito` → `descripción` → `Tipo de documento` que NO permita traspaso entre empresas → `Empresa origen` (destino se autocompleta) → cuenta origen → cuenta destino → `Importe` → `insertar` → `Confirmar` (PAGE 817).
- Traspaso interempresa: mismo flujo con un `Tipo de documento` que sí permita traspaso entre empresas y seleccionando `Empresa destino` distinta (PAGE 817).
- Divisas: seleccionar cuentas con monedas diferentes en `cbancpro`, asignar `Importe divisa`; el sistema calcula el cambio y el importe (PAGE 817).
- Movimientos generados: intraempresa, dos movimientos (uno de pago y uno de cobro) del mismo valor y signo contrario; interempresa, cuatro (dos de pago y dos de cobro) (PAGE 817).
- Carga de extracto: `Limpiar datos` → `Examinar` + datos faltantes + `guardar` → `Carga extracto bancario` (PAGE 839).
- Conciliación: flujo EXTRACTO → CONCEPTO BANCARIO → OPERACIÓN FINANCIERA → MOVIMIENTO; pasos EXTRACTO → SELECCIONAR MOVIMIENTO → CONCILIAR (PAGE 824).
- Caja: jornada registrada en `ccajamov` en estado `A` (`Abierto`) → liquidación → `L` (`Liquidado`) → contabilización como proceso posterior e independiente (PAGE 764, PAGE 769).
- Cheques: `R · Registrado` → `P · Propuesto` (incorporación a remesa) → `C · Contabilizado` (contabilización del diario) → `G · Gestionado` (cierre de la remesa) → `I · Impagado` (PAGE 913).
- Reversión del impagado: de `I · Impagado` a `G · Gestionado` con la acción `Gestionar` (PAGE 913).
- Contabilizar caja sin cerrarla: `opecob` no informada, `opepag` no informada e `indliq` desactivada (PAGE 913).
- Comisiones: definir flujo financiero (`FIJ` COMISIONES FIJAS, `VAR` COMISIONES VARIABLES; cuenta 626 Servicios bancarios; movimiento de Debe) → Maestro de Comisiones → relaciones Operaciones y Comisiones → tarifas (PAGE 829).
- Domiciliaciones: alta en `Terceros > Domiciliaciones` → registro en pantalla de domiciliaciones → informes de control → conciliar extractos para contabilizar (PAGE 841).

## 5) Procesos, botones y acciones

- `insertar` y `Confirmar` (traspasos): crean el traspaso y generan los dos movimientos, uno de pago y uno de cobro (PAGE 817).
- `Anular`: anula el registro de traspaso solo mientras los movimientos de tesorería no estén conciliados (PAGE 817).
- `Conciliar` (extractos): conciliación automática del movimiento bancario seleccionado con las mismas reglas que la conciliación automática masiva (PAGE 839).
- `Selección`: confecciona una selección de movimientos de tesorería que pueden conciliarse con el movimiento bancario seleccionado (PAGE 839).
- `Generar`: inserta un movimiento de tesorería para conciliar y solicita un código de operación financiera; integración manual autorizada por el tesorero (PAGE 839).
- `Vincular`: asocia varios apuntes de extracto indicando el número de orden del apunte principal y luego se ejecuta `Conciliar` sobre cualquiera de los implicados (PAGE 839).
- `cancelar extractos`: concilia los importes positivo y negativo de un extorno (PAGE 824).
- Integración: marcando líneas de extracto se crea la partida de tesorería; puede requerir selección de deuda pendiente de cartera o de cartera impagada como contrapartida (PAGE 824).
- Movimientos integrados automáticamente: figuran como originados desde el extracto bancario, identificados con la letra `X` (PAGE 824).
- Contabilización de caja: procesos `ccajamov_descon` (descontabilización) y `ccajamov_wb_account` (contabilización); asiento a partir de movimientos `definitivo`; agrupa por cuenta contable, proyecto, sección, sistema y fecha de contabilización (PAGE 913).
- Liquidación de caja: actualiza `ccajalin` a estado `D` excluyendo operaciones de tipo `SINI`; controla descuadre por moneda y pasa `ccajamov` a `L` (PAGE 913).
- Depuración de caja: borrado masivo por código de `Caja` y generación de un movimiento resumen que mantiene el saldo anterior (PAGE 913).
- Remesas: `Incluir en remesa` solicita el número de remesa y actualiza el total; la selección incorpora cheques pendientes de remesar por empresa, caja, moneda y situación (PAGE 913).
- `Impagado` lleva el cheque de `G` a `I`; `Gestionar` lo devuelve a `G` (PAGE 913).
- Comisiones: al insertar un movimiento en cuentas corrientes-tesorería se calculan automáticamente según cuenta y operación y se incluyen en los movimientos de flujos financieros (PAGE 820).
- Factura de comisiones: si el flujo tiene tipología de factura asociada en `tflujfin`, se registra factura de compras/ventas enlazada al movimiento y genera impuestos para el SII (PAGE 829).
- Desconciliación: si el movimiento de tesorería generado automáticamente no está contabilizado, se elimina (PAGE 824).

## 6) Advertencias y errores típicos

- Interempresa: «es obligatorio que se haya definido previamente en el maestro de Cuentas intermedias de traspaso la parametrización entre las empresas seleccionadas» (PAGE 817).
- `ccajadef`: `opecob` y `opepag` deben informarse conjuntamente o permanecer ambos vacíos; no se admite solo uno (PAGE 768).
- Comisiones: si el importe es fijo, `Tipo` debe ser `Fijo`; si es porcentaje, `Tipo` debe ser `Variable` (PAGE 820).
- Comisiones: importe mínimo, importe exento e importe máximo solo aplican cuando la comisión se obtiene a partir de un porcentaje (PAGE 820).
- Carga de extracto: se verifica la fecha y el importe del saldo final de la última carga, registrados en la tabla de cuentas financieras; en la primera carga los datos de control pueden estar nulos (PAGE 839).
- Un mismo fichero puede contener movimientos de una o más cuentas financieras de la misma entidad financiera (PAGE 839).
- «Este proceso no realiza la conciliación de movimientos con el sistema de tesorería, existe un proceso específico para ello» (PAGE 839).
- Si `Conciliar` no puede conciliar, el proceso no hace nada y el operador debe conciliar o integrar manualmente (PAGE 839).
- Desconciliación: si el movimiento ya está contabilizado, no se elimina y se muestra un aviso de que no puede desconciliarse (PAGE 824).
- Liquidación bloqueada si existen movimientos anteriores de la misma caja y empresa con fecha anterior y estado distinto de `Cerrado`: error `Caja [${data.cajaid}] con registros anteriores no liquidados.` (PAGE 913).
- Descuadre de liquidación: se genera una excepción con el importe y la liquidación queda bloqueada hasta corregir la diferencia (PAGE 913).
- Restricciones de estado: `ccajamov` solo `A`, `L` o `C`; `ccajadef` solo `A` o `C`; `ccajarem` solo `A` o `C`; `ccajache` usa `R`, `P`, `C`, `G` e `I` (PAGE 913).
- `ccajaope.numsec`: nulo o ≥ 20 para ser válido en el proceso de contabilización (PAGE 768).
- `toperfin` es genérica para todas las cuentas financieras, salvo que esté informada `tctaopec`, que prevalece (PAGE 829).
- Contabilización de caja: devuelve un identificador; el valor `-2` está reservado para el registro de pruebas y produce un mensaje informativo (PAGE 913).
- La depuración solo puede realizarse sobre movimientos previamente contabilizados; si hay movimientos sin contabilizar, no se ejecuta (PAGE 913).
- PAGE 1113 (Tesorería) contiene solo texto de relleno («Lorem ipsum»), sin contenido operativo aprovechable (PAGE 1113).