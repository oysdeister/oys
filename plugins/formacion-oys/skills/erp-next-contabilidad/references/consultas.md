# Consultas contables: apuntes, mayor, sumas y saldos, Integridad, diario

Fuente: `icon-contabilidad.json` › `asientos-7` a `asientos-10`, `icon-contabilidad-1`.

## Apuntes («Líneas de asiento», `capuntes`)
Buscador: capuntes (o desde el asiento › Líneas de apuntes). Lupa de la barra superior abre el formulario de filtros; **Documento `{INI}-DOC*`** (el `*` = «empieza por») › «Ejecutar consulta». Ves cuenta, descripción, Debe y Haber. Sin filas: revisa el filtro y que estás en la empresa 0. Ejemplo: `{INI}-DOC-001` tiene 4 apuntes (62902 D 1.000 / 57200 H 1.000 / 62903 D 250 / 57200 H 250 = 1.250,00 a cada lado). En la compra del caso verás 47200 IVA soportado, Debe 26,25.

## Mayor / extracto de una cuenta (`capuntes_ext_cuenta_rep`)
Finanzas › Contabilidad General › Extractos › Mayor de cuentas. Empresa 0, Fecha inicial 01-01-2026, fecha fin 31-12-2026, Cuenta 62902 (elige la fila 62902.00000; el campo muestra «ES», el plan: normal). Desplaza la tabla a la derecha para ver Debe, Haber y **Saldo acumulado** (1.000 › 2.000 › 3.500 con los tres apuntes del bloque). Sirve para justificar el saldo y localizar apuntes. En una base compartida salen los apuntes de otros alumnos: reconoce los tuyos por el documento. Sin cuenta o con otra empresa sale vacío. Caso final: el mayor de 57200 mostrará 6 movimientos hasta 3.077,25 (filtra por tu diario/documentos).

## Sumas y saldos (`csaldos`, «Saldos cuentas»)
Finanzas › Contabilidad General › Saldos › Saldos cuentas: Empresa 0 + Ejercicio 2026 → una fila por cuenta y periodo con las sumas de Debe y Haber. **Solo recoge asientos contabilizados.** Ejemplo del periodo 11 con los asientos de práctica: 57200 Haber 2.800 (1.250 + 300 + 1.250); 62900 Debe 300; 62902 Debe 2.000; 62903 Debe 500 (Debe = Haber = 2.800); periodo 12: la copia de diciembre (1.750). El menú Saldos incluye también mensualizados y agrupados; Balances, por nivel. Sumas y saldos suma los asientos de todos los alumnos de la empresa 0: calcula los tuyos. Caso final antes de liquidar IVA: Debe 3.242,00 = Haber 3.242,00. `csaldos` no es modificable desde pantalla.

## Integridad (Finanzas › Contabilidad General › Diario contable › Integridad)
Informes que listan **solo lo que no encaja** (vacío = todo bien): descuadres de asientos, de impuestos, de cartera, de costes y de divisas. «Descuadres General e impuestos» (Empresa 0, fechas 01-11-2026 a 28-02-2027); «Descuadres General → Cartera» por cuentas o por terceros; «Descuadres asientos» si modificaste líneas tras cuadrar. Un asiento manual con IVA (47200 soportado; 47000 repercutido en la demo, 477 en el PGC) necesita rellenar la pestaña **Impuestos**, si no aparece como descuadre.

## Libro diario (Finanzas › Contabilidad General › Diario contable › Diarios)
Orientado al apunte; tres consultas: Diario anual, Diario resumen (oficial resumido por periodos; «Nivel contable 3» agrupa 62900/62902/62903 en 629) y Diario por asiento (no calcula saldos anteriores). Cada apunte lleva proyecto y sección. El diario es la información por fecha; el mayor, la misma ordenada por cuenta.

## Contabilidad a una fecha pasada
No hay un informe específico: usa saldos por periodo (columna Total = apertura + 12 periodos), histórico de saldos (ejercicios cerrados) o el Mayor filtrando hasta esa fecha. El cierre temporal no sirve para consultar.
