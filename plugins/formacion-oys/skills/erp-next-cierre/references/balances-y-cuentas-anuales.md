# Balances, estados financieros, cuentas anuales y consolidación

Fuente: `contabilidad-avanzada.json` › `icon-contabilidad-3`; documentación oficial (`cctasal_agrs_genera`, `cxlstemplate`, PAGE 993, 869).

## Índice
1. Qué son los estados financieros
2. Balances y estados por agrupación
3. Cuentas anuales en Excel
4. Motor de consultas Excel
5. Consolidación
6. Problemas

## 1. Qué son
Los estados financieros son el resumen de la contabilidad que leen la dirección, los bancos y Hacienda (el boletín de notas de la empresa). Si no se revisan antes de cerrar, no sabes si la contabilidad cuadra ni cuánto se ha ganado.
- **Estado de Situación Financiera (balance)**: foto a una fecha de lo que la empresa tiene (bancos, clientes) y debe (proveedores, préstamos). Caso al 31-12: banco 3.077,25 = patrimonio neto 3.061,50 (capital 3.000,00 + beneficio 61,50) + pasivo 15,75 (Hacienda).
- **Estado de Resultados (pérdidas y ganancias)**: gastos restados de ingresos de un periodo: 200,00 − 125,00 − 13,50 = 61,50.
- En las tablas de la demo aparecen importes de práctica (10.000,00, 5.000,00…) que no son las cifras del caso.

## 2. Balances y estados por agrupación (Finanzas › Contabilidad General › Balances)
- Carpetas: Agregados, Por agrupación, Por empresa, Divisas, Planes auxiliares, Cuentas anuales (Excel) y Motor de consultas excel (los nombres largos salen recortados con «…»).
- «Balances» genera y consulta balances de saldos: Saldo anterior, Importe deudor, Importe acreedor, Saldo del período y Saldo acumulado; por fechas o periodos, niveles Cuentas, Niveles o Jerarquías.
- **Por agrupación**: «Situación financiera» y «Resultados integrales» (pide Empresa, Ejercicio, Periodo inicial y final). Usan clasificadores distintos (BALANCE08 para el balance, CTEPIG08 para pérdidas y ganancias: configuración interna que no sale en pantalla). Salen de los saldos por agrupación (`cctasal_agrs`), que el ERP **calcula antes de abrir el informe** (proceso `cctasal_agrs_genera`).
- Una cuenta que no esté en ningún grupo de la agrupación **no sale** en los estados financieros aunque tenga saldo.

## 3. Cuentas anuales en Excel (Balances › Cuentas anuales (Excel))
Plantilla de Excel de 3 hojas: estructura del balance o informe, hoja **Input** (parámetros) y hoja **Datos** (datos filtrados; se pueden ocultar con clic derecho en la pestaña). Montaje: definir la plantilla, darla de alta en «Cuentas Anuales e Informes» (`cxlstemplate`), configurar la SQL de agrupación, la SQL de datos y los parámetros. «Ejecutar XLS» pide Empresa, Ejercicio, Periodo, Proyecto, Sección y Sistema y genera el fichero, que queda en el «Histórico de ejecuciones» (el disquete de «Fichero salida» lo descarga).

## 4. Motor de consultas Excel (Balances › Motor de consultas excel › Consultas excel)
Pantalla «MOTOR DE CONSULTAS EXCEL»: lista de ficheros de consulta (Código, Nombre, Tipo, Información, Estado, Tipo fichero, Fichero; «Añadir consulta»); en la demo está vacía. Las funciones VBA se usan **dentro de Excel**: `GetDecimalSeparator` (separador decimal) y `AX_Saldo` (construye una cadena `@AX_Saldo…` o devuelve el valor numérico; recibe tipo, ejercicio, periodo, empresa y cuenta, y opcionalmente proyecto, sección, sistema, dimensiones y tercero). Ejemplo: `@AX_SaldoBALANCE|2026|12|0|57200.00000|…`.

## 5. Consolidación (Finanzas › Contabilidad General › Consolidación)
Junta los estados financieros de varias empresas de un grupo como uno solo (si la matriz vende 1.000 € a su filial, en el consolidado esa venta y esa compra se eliminan). Menú: Grupos consolidación, Integración datos, Auditoría interempresa, Ajustes de consolidación, Balances consolidados. Siete etapas: preparación (periodo y entidades), recopilación, eliminación de operaciones intragrupo (inversiones en filiales y saldos recíprocos), ajustes de consolidación, elaboración de estados consolidados (balance, PyG y flujos), revisión y validación, presentación y aprobación. En la demo no hay datos de consolidación: basta localizar las opciones.

## 6. Problemas
| Síntoma | Solución |
|---|---|
| La Situación financiera no muestra datos | Calcula antes los saldos por agrupación del periodo; comprueba que las cuentas están en algún grupo |
| La cuenta anual XLS no genera fichero | Revisa SQL de agrupación, SQL de datos y parámetros; que la plantilla esté dada de alta |
| No hay pantalla para ejecutar las funciones del motor Excel | Se usan dentro de las hojas de cálculo; la pantalla solo guarda ficheros |
Notas: no lances procesos en la demo; las hojas Input y Datos no son plantillas de contabilización.
