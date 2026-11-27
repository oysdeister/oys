# Registro fiscal, declaración y controles

Índice: 1 Impuestos por documento · 2 Registro fiscal · 3 Importes deducibles y prorrata · 4 ISP · 5 Modelos 303/390/349 · 6 Procesos, SII, VERIFACTU, TicketBAI · 7 Controles de integridad.
Fuente: `icon-impuestos.json` bloques `icon-impuestos-v-2`, `-v-3`, `-2`, `-3`, `-4`; `hechos-impuestos.md` §5.

## 1. «Impuestos por documento» (pestaña de la factura de compra)
Ruta: «Gestión › Compras › Facturas › Facturas». Pestañas: Facturas compras, Líneas, **Impuestos por documento**, Vencimientos, Expedientes, Documentos, Notas. Una fila por cada combinación operación + impuesto, con porcentaje, % deducible, cuota deducible, base no imponible, **regla** (enlace a la regla), grupo fiscal y total. Las líneas con la misma combinación se suman en una fila; dos filas no son un duplicado. Cada línea guarda su cálculo en «Datos contables › Impuestos». Si está vacía, la factura no está validada. Casilla «Modificado manualmente» marca que alguien alteró el cálculo (examen). «Validar» calcula impuestos y **no genera asiento**; el asiento lo genera «Contabilizar».
Factura 0FC000012: ESG, CLBC, base 10.000,00, 21,00 %, deducible 100,00 %, cuota 2.100,00, base no imponible 0,00, regla 73, total 12.100,00.
Factura del vídeo (ALA): 1.200 al 21 % (regla 1477) = 252 + 800 al 10 % (regla 1479) = 80 → total 1.452 + 880 = **2.332**. En la captura la clave de la línea sale SOE pero la regla pide SOR: error de la captura; la regla solo aplica si coincide.

## 2. Registro fiscal («Finanzas › Impuestos › Registros fiscales»)
Cabecera (`ctax_move_head`): empresa, fechas (contable, documento, operación), ejercicio y periodo fiscal, tercero y NIF, zonas, naturaleza (Compras/Ventas), libro registro, tipo de documento (Factura completa), clave e-Reporting (SII-Fact). Líneas (`ctax_move_line`): operación, tipo, base imponible, base no imponible/exenta, cuota deducible, cuota no deducible; **importe fiscal = suma de las cuatro**. Pestaña **Rectifica**: enlaza la rectificativa con la original, por diferencias o por sustitución. Parte inferior: «Listado SII Facturas» y botón «Traspasar a SII-Facturas». Restricción documentada: la fecha del registro no puede ser anterior a la del documento (`taxh_fecha >= taxh_fecdoc`). No se toca a mano: se corrige factura o maestro y se regenera. «Comprobación del registro»: lista una fila por línea fiscal con totales por empresa (filtra por ejercicio 2026 y por tercero).
Cifras del caso: compra T{INI} base 125,00 cuota 26,25; venta base 200,00 cuota 42,00; 0FC000012 base 10.000,00 cuota 2.100,00.

## 3. Deducible, no deducible y prorrata
Compra base 1.000 al 21 % = cuota 210. Con deducción del 80 %: **168 deducible + 42 no deducible** (la no deducible acaba como gasto); total 1.210. En una compra normal 100 % deducible y no deducible 0,00. La **prorrata** (porcentaje de IVA soportado que puede restar una empresa con operaciones exentas): no cambia el 21 % de la factura, cambia qué parte se deduce y solo afecta a tipos con «Aplicar prorrata» (ESG). General = ventas con derecho a deducción / ventas totales, redondeado al entero superior (800.000 / 1.000.000 = 80 %). Se aplica el provisional (el definitivo del año anterior) y en la última declaración se regulariza: FPE (demo de los vídeos) 5 % provisional, 6 % definitivo, 10.000 de IVA soportado → dedujo 500, le tocan 600, **+100**. Con 80 %: 26,25 × 80 % = 21,00. La empresa 0 no aplica prorrata. Maestro: «Prorrata por empresa y actividad».

## 4. Inversión del sujeto pasivo (ISP)
Declara el IVA el comprador (servicios de otro país, algunas obras, chatarra, oro, móviles). El proveedor factura sin IVA; el comprador se hace una **autofactura**: IVA repercutido y soportado por el mismo importe. 2.000 sin IVA → 420 repercutido + 420 soportado → neto 0. Se genera con el proceso «Autofacturas e ISP» (Finanzas › Impuestos › Procesos); si la operación tiene ISP pero no tiene recibida/emitida, no se generan. En el registro hay línea original y líneas derivadas enlazadas (`taxl_linori`).

## 5. Modelos
**303** autoliquidación IVA, mensual o trimestral (ante AEAT; País Vasco y Navarra ante hacienda foral). **390** resumen anual (0A). **349** informativa de operaciones con la UE, mensual/trimestral. Pantallas: «Finanzas › Impuestos › IVA › Borrador autoliquidación IVA (Modelo 303)» y «Detalle borrador…»; «Declaraciones fiscales»: «Modelos de declaración», «Declaraciones realizadas», «Libros de impuestos». El ERP suma las líneas de los registros del periodo por operación y tipo: si la regla eligió mal la operación, el importe cae en la casilla equivocada. Liquidación del caso: ver SKILL.md.

## 6. Procesos y envíos
«Finanzas › Impuestos › Procesos»: «Autofacturas e ISP», «Retroceder autofacturas e ISP», «Validación de impuestos», «Retroceder validación de impuestos», «Carga de impuestos desde plantilla Excel» (estados de carga 0 Pendiente, 1 Cargado; ver «Mensaje de error»). El envío al SII **no** está aquí: se prepara desde cada registro fiscal con «Traspasar a SII-Facturas». **SII**: facturas a la AEAT en 4 días hábiles (grandes empresas, devolución mensual, grupos de IVA). **VERIFACTU**: programa de facturación con registros encadenados inalterables (las empresas en SII quedan fuera; fechas de obligatoriedad aplazadas, consulta la AEAT). **TicketBAI**: equivalente vasco. Si falla un envío: leer «Error SII» / «Mensaje error SII», corregir el dato de origen (NIF, fecha, clave) y reenviar; comprobar que los registros tienen E-Reporting SII-Fact y están en el rango de fechas.

## 7. Controles («Finanzas › Impuestos › Integridad»: siete)
No corrigen: **señalan**; lista vacía = buena señal. Filtros y «Ejecutar consulta».
| Control | Qué compara | Literal de salida |
|---|---|---|
| Justificación impuestos vía enlaces | cada registro con el apunte enlazado (base, tipo, prorrata) | diferencias |
| Justificación vía asientos (ventana «Justificación de la naturaleza contable de impuestos via asientos») | asientos agrupados por cuenta; cuota = debe − haber vs fiscal. Cuenta por defecto `47*` (todas las que empiezan por 47), fechas del 1-enero a hoy | columnas imppor, Cuenta, basimp, totimp; ventas salen en negativo |
| Incidencias en CIF'S («Incidencias en códigos de identificación fiscal») | NIF de terceros | «CIF INCONSISTENTE», «NOMBRES DISTINTOS CON EL MISMO CIF/NIF» |
| Incidencias en importes cabecera y líneas | total cabecera vs suma de líneas | «ERROR EN MONEDA LOCAL», «ERROR EN DIVISA» |
| Descuadres en impuestos («Comprobación de impuestos, cabecera y detalle») | cabecera vs detalle | |
| Inconsistencias de impuestos («Totales de inconsistencias de impuestos») | contador por comprobación 06 a 17 (rectificado, libro/tipo de documento, tickets, DUA, clave y zonas, tipo de cambio, NIF) | contador ≠ 0 = registros que fallan |
| Documentos duplicados | empresa, año fiscal, naturaleza, nº de documento, NIF | «posible documento duplicado» (excluye autofacturas); «Fecha contable» obligatoria: `>01-01-2000` para todas |
Ejemplo: cabecera 1.210 y línea 1.000 + 200 = 1.200 → «ERROR EN MONEDA LOCAL» (10 de diferencia). En la demo las listas de CIF, importes y duplicados salen vacías; «Inconsistencias» puede salir ≠ 0 por pruebas de otros alumnos (demo compartida). Corrección de un CIF: arreglar el NIF en el maestro y relanzar «Validación de impuestos» para esas fechas.
