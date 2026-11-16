[IMG:asientos-001.png]
DEISTER MANAGER  ·  MANUAL DE FORMACIÓN
CONTABILIDAD · TEMA 2
Entrada de asientos
[TABLA]
|  |
[/TABLA]
Ejercicios documentados en la versión nueva del ERP
CONTENIDO
—	Antes de empezar
—	2.1. Acceder a los asientos
—	2.2. Introducir un asiento de dos líneas
—	2.3. Verificar el cuadre
—	2.4. Añadir dos líneas más
—	2.5. Crear un asiento nuevo
—	2.6. Contabilizar el asiento
—	2.7. Comprobar el resultado
—	2.8. Listar el asiento
—	2.9. Extracto de las cuentas del asiento
—	2.10. Sumas y saldos de las cuentas
—	2.11. Duplicar el asiento
—	2.12. Tres copias en meses consecutivos
—	2.13. Cambiar importes de las dos primeras líneas
—	Resumen de datos creados
# Índice
Cómo usar este manual	5
Antes de empezar	7
Qué es un asiento y qué recorrido tiene	7
Equivalencias con la versión antigua	7
Cómo moverse por la versión nueva	7
2.1. Acceder a los asientos	9
1. Crear el diario EA	9
2. Abrir la pantalla de asientos	10
2.2. Introducir un asiento de dos líneas	11
1. Cabecera del asiento	11
2. Numerador de justificantes EA	13
3. Líneas de apuntes	15
2.3. Verificar el cuadre	19
2.4. Añadir dos líneas más	21
2.5. Crear un asiento nuevo	22
2.6. Contabilizar el asiento	23
1. Asiento a asiento: botón Finalizar	23
2. Varios asientos: proceso Contabilización	24
3. Nota: vigencia de empresa, ejercicio y periodos	26
2.7. Comprobar el resultado	29
2.8. Listar el asiento	31
2.9. Extracto de las cuentas del asiento	32
2.10. Sumas y saldos de las cuentas	34
2.11. Duplicar el asiento	36
2.12. Tres copias en meses consecutivos	39
2.13. Cambiar importes de las dos primeras líneas	42
Resumen de datos creados	45
# Cómo usar este manual
Este documento repite los ejercicios 2 a 2.13 de «Entrada de asientos» sobre la versión nueva del ERP (Deister Manager, base BBDD TUTORIAL en nextdemo.geasa.eu). Para cada pantalla se explica para qué sirve, dónde está en el menú, qué significa cada campo y qué pasos seguir. Los recuadros CAMBIO señalan lo que funciona distinto que en la versión antigua; los recuadros PROBLEMA y SOLUCIÓN, los errores reales que salieron y cómo se resolvieron.
En los ejemplos se usa el prefijo EA (diario EA, numerador de justificantes EA, documentos EA-DOC-001…). Sustitúyelo por el tuyo. Se trabaja en la empresa 0 «Deister Software», con las cuentas del plan PGE 2008 que ya existen en TUTORIAL (62900, 62902, 62903 y 57200). En las tablas de campos, la columna «Oblig.» indica si la pantalla marca el campo con asterisco rojo.
## Recuadros que verás
[TABLA]
| ? | ¿PARA QUÉ SIRVE? | Abre cada apartado: explica qué se consigue y por qué se hace. |
| Δ | CAMBIO | Qué se hace distinto en la versión nueva del ERP. |
| ! | PROBLEMA | Un error que puede salir al hacer el ejercicio y su causa. |
| ✓ | SOLUCIÓN | Cómo resolver el problema anterior. |
| i | A TENER EN CUENTA | Avisos y detalles útiles sobre la base de pruebas. |
[/TABLA]
## Otros elementos
Ruta de menú. Dónde está la pantalla. Cada pieza es un nivel del menú lateral; también puedes abrirla con el buscador superior (Cmd/Ctrl + K).
MENÚ    Gestión   ›   Compras   ›   Albaranes
Tabla de campos. Qué se rellena, qué significa y un valor de ejemplo. Sustituye las iniciales del ejemplo por las tuyas.
[TABLA]
| CAMPO | QUÉ SIGNIFICA | VALOR DE EJEMPLO |
| Tercero * | Código del tercero que creas. | TCL |
| Nombre comercial | Nombre que verás en listas y documentos. | Tercero Carlos López |
[/TABLA]
*  Campo obligatorio: sin él no deja guardar.
Pasos numerados. Hazlos en orden. El texto entre comillas («Guardar») es un botón, una pestaña o un campo tal como aparece en pantalla.
1 	Pulsa «Añadir» arriba a la derecha.
2 	Rellena los campos y pulsa «Guardar».
Resumen. Cierra cada ejercicio con lo que has conseguido y cómo comprobar que ha ido bien.
# Antes de empezar
## Qué es un asiento y qué recorrido tiene
[TABLA]
| ? | ¿PARA QUÉ SIRVE? / El asiento es la unidad del libro diario: un conjunto de apuntes (líneas) en el que la suma del Debe es igual a la suma del Haber. Casi todos los asientos los genera el ERP solo al contabilizar facturas, cobros o pagos; los asientos manuales se usan para lo que no viene de ningún documento: ajustes, regularizaciones, periodificaciones, asientos de apertura o correcciones. Un asiento nace «Provisional» (lo que antes era el borrador), se puede modificar mientras está así y, al finalizarlo, pasa a «Contabilizado»: sus importes entran en el mayor y en los saldos de cada cuenta. |
[/TABLA]
## Equivalencias con la versión antigua
•	Borradores (Diario contable › Borradores › Movimientos) › ya no existen como pantalla aparte: el asiento se crea directamente en «Asientos» y queda en estado Provisional hasta que se finaliza.
•	Contabilización de borradores › botón «Finalizar» en la ficha del asiento, o el proceso «Contabilización» para muchos asientos a la vez.
•	/capuntes (listado de apuntes) › «Líneas de asiento» (objeto capuntes), que se abre desde el buscador.
•	Extractos › Cuentas › «Extractos › Mayor de cuentas». Sumas y saldos › «Saldos › Saldos cuentas».
•	Duplicar y copiar asientos › botón «Copiar asiento» de la ficha, que hace una copia o varias con cadencia mensual.
## Cómo moverse por la versión nueva
•	Ya no se escribe la ruta (/capuntes, /cempresa…) en la barra de direcciones. Se usa el menú (Finanzas › Contabilidad General › …) o el buscador superior «Buscar» (Cmd/Ctrl + K), escribiendo el nombre o el código del objeto.
•	En las listas, el botón rojo «Nuevo» abre el formulario en una ventana que se guarda con «Guardar» abajo a la derecha. Las listas pequeñas (diarios, ejercicios…) tienen además una fila en blanco al final para dar de alta en línea con el icono ⊕.
•	Los campos con lista (empresa, diario, cuenta…) son de autocompletar: se escribe el código y se elige la fila. El «+» que aparece al pie de la lista permite crear el registro sin salir de la pantalla.
•	Los botones de acción (Finalizar, Copiar asiento, Recalcular cuadre…) están en la barra superior de la ficha, y las pestañas del registro (Asiento, Líneas de apuntes, Impuestos…) arriba, en horizontal.
[TABLA]
| [IMG:asientos-002.jpg] |
| Figura 1   Menú Finanzas › Contabilidad General › Diario contable › Asientos: el objeto «Asientos» y, debajo, los procesos Contabilización, Descontabilización y Copia masiva. Ya no hay entrada de borradores. |
[/TABLA]
# 2.1. Acceder a los asientos
[TABLA]
| ? | ¿PARA QUÉ SIRVE? / Antes de escribir un asiento hay que saber dónde se registra y en qué diario. El diario agrupa los asientos por su origen (compras, ventas, tesorería, general…) y sirve para listar o numerar por separado. Para los ejercicios se crea un diario propio, EA, y así los asientos de práctica no se mezclan con los de otros usuarios de la base. |
[/TABLA]
## 1. Crear el diario EA
MENÚ    Finanzas   ›   Contabilidad General   ›   Diario contable   ›   Diarios (objeto cdiarios)
[TABLA]
| CAMPO | QUÉ SIGNIFICA | VALOR DE EJEMPLO |
| Diario * | Código del libro diario. Es lo que se elige en la cabecera de cada asiento. | EA |
| Descripción diario * | Nombre que aparece debajo del código en los formularios. | Entrada de asientos EA |
[/TABLA]
*  Campo obligatorio: sin él no deja guardar.
1 	Abre la ruta: se ve la lista de diarios existentes (DA cierre, DC compras, DG general, DV ventas…).
2 	En la fila en blanco del final escribe EA y la descripción.
3 	Pulsa el icono ⊕ de la fila: sale el aviso verde «Éxito».
[TABLA]
| [IMG:asientos-003.jpg] |
| Figura 2   Diario EA guardado en la lista de diarios contables. |
[/TABLA]
[TABLA]
| Δ | CAMBIO / En la versión antigua había que tener el diario creado antes de entrar en borradores. En la nueva también se puede crear desde el propio campo Diario del asiento, con el «+» del pie de la lista. |
[/TABLA]
## 2. Abrir la pantalla de asientos
MENÚ    Finanzas   ›   Contabilidad General   ›   Diario contable   ›   Asientos   ›   Asientos (objeto casientos)
1 	Abre la ruta. Se muestra la lista de asientos de todas las empresas, con su fecha, número, justificante, diario, ejercicio, periodo y totales.
2 	Pulsa «Nuevo» para empezar un asiento (apartado 2.2).
[TABLA]
| ✓   QUÉ HAS CONSEGUIDO |
| ✓	Diario EA «Entrada de asientos EA» creado en cdiarios. / CÓMO COMPROBARLO / →	Comprueba que EA aparece en la lista de diarios y en el desplegable Diario del asiento. |
[/TABLA]
# 2.2. Introducir un asiento de dos líneas
[TABLA]
| ? | ¿PARA QUÉ SIRVE? / El asiento tiene dos partes: la cabecera (empresa, fecha, diario, justificante) y las líneas de apuntes (cuenta, Debe o Haber). En la versión antigua cada línea repetía los datos de cabecera; en la nueva se guarda primero la cabecera y después se añaden las líneas desde la pestaña «Líneas de apuntes». Ejemplo: un gasto diverso de 1.000 € pagado por banco (62902 al Debe, 57200 al Haber). |
[/TABLA]
## 1. Cabecera del asiento
MENÚ    Finanzas   ›   Contabilidad General   ›   Diario contable   ›   Asientos   ›   Asientos (objeto casientos)
[TABLA]
| CAMPO | QUÉ SIGNIFICA | VALOR DE EJEMPLO |
| Empresa * | Sociedad en la que se registra el asiento. Decide el plan contable y los ejercicios disponibles. | 0 (Deister Software) |
| Asiento | Número del asiento dentro del ejercicio. Lo pone el ERP al guardar. | 6 (automático) |
| Diario | Libro diario del asiento. Por defecto propone DG General. | EA |
| Sistema | Sistema contable. En TUTORIAL solo existe A General. | A |
| Fecha * | Fecha contable. De ella salen el ejercicio y el periodo. | 12-11-2026 |
| Ejercicio / Período | Se calculan solos a partir de la fecha. | 2026 / 11 |
| Justificante | Numerador de justificantes: al guardar genera el número correlativo del asiento (lo que antes era «letra con guion»). | EA (Asientos manuales EA) |
| Documento | Referencia libre del documento que justifica el asiento. Se copia a todas las líneas. | EA-DOC-001 |
| Notas | Texto libre del asiento. Se propone como descripción de las líneas. | EA Ejercicio 2 entrada de asientos |
| Moneda / Cambio / Cálculo * | Divisa del asiento y tipo de cambio. En euros, cambio 1. | EUR / 1,000000 / Dividir |
| Estado * | Provisional al crearlo; Contabilizado al finalizarlo. | Provisional |
[/TABLA]
*  Campo obligatorio: sin él no deja guardar.
1 	En la lista de asientos pulsa «Nuevo».
2 	Elige la Empresa 0 y cambia el Diario a EA. Deja la fecha de hoy.
3 	En Justificante elige el numerador EA (si no existe, créalo con el «+» de la lista; ver apartado 2).
4 	Escribe el Documento EA-DOC-001 y unas Notas.
5 	Pulsa «Guardar». El asiento aparece en la lista con su número (6) y estado Provisional.
[TABLA]
| [IMG:asientos-004.jpg] |
| Figura 3   Alta de la cabecera: empresa 0, diario EA, sistema A, fecha 12-11-2026, justificante EA y documento EA-DOC-001. El estado inicial es Provisional. |
[/TABLA]
[TABLA]
| [IMG:asientos-005.jpg] |
| Figura 4   Ficha del asiento guardado: banda naranja PROVISIONAL, botones Recalcular cuadre, Reordenar líneas, Finalizar y Copiar asiento, y la pestaña «Líneas de apuntes» donde se añaden las líneas. |
[/TABLA]
## 2. Numerador de justificantes EA
[TABLA]
| ? | ¿PARA QUÉ SIRVE? / El numerador fabrica el código del justificante (por ejemplo EA26-000001) cada vez que se guarda un asiento que lo usa. Así cada asiento manual tiene un número correlativo propio, que es el que se cita en auditorías y en el extracto. |
[/TABLA]
MENÚ    Campo Justificante del asiento   ›   «+   ›   (o buscador   ›   «Numeradores de justificantes contables   ›   , objeto cjusnumh)
[TABLA]
| CAMPO | QUÉ SIGNIFICA | VALOR DE EJEMPLO |
| Tabla origen * | Documentos que numera. | Asientos contables |
| Código de numerador * | Código que se elige en el campo Justificante. | EA |
| Descripción | Nombre visible. | Asientos manuales EA |
| Rotura * | MÁSCARA que decide cuándo vuelve a empezar el contador: #e empresa, #yy año, #d diario. | #e#yy (un contador por empresa y año) |
| Numerador * | MÁSCARA del justificante. #n es el contador; el resto se copia tal cual. | EA#yy-#n (EA26-000001) |
| Justificación | Número de dígitos del contador (rellena con ceros). | 6 |
[/TABLA]
*  Campo obligatorio: sin él no deja guardar.
[TABLA]
| [IMG:asientos-006.jpg] |
| Figura 5   Alta del numerador desde el propio campo Justificante. OJO: en esta primera alta se escribieron valores literales (26 y 0), que es el error que se explica abajo. |
[/TABLA]
[TABLA]
| ! | PROBLEMA / Con Rotura «26» y Numerador «0» el asiento se guarda sin error, pero su justificante sale «0» en todos los asientos. La causa es que Rotura y Numerador no son valores, sino máscaras de formato: un texto sin #n nunca muestra el contador (el contador sí avanza: se ve en «Detalle serializador», último número 2). |
[/TABLA]
[TABLA]
| [IMG:asientos-007.jpg] |
| Figura 6   Lista de numeradores: los existentes usan máscaras como #e#yy#d y #d#e#s#yy-#n con justificación 6; el EA tiene los literales 26 y 0. |
[/TABLA]
[TABLA]
| ✓ | SOLUCIÓN / Abre el numerador EA en cjusnumh y pon Rotura #e#yy, Numerador EA#yy-#n y Justificación 6; guarda con el disquete. Los asientos nuevos reciben justificantes EA26-000001, EA26-000002… (los ya guardados conservan el «0»). |
[/TABLA]
[TABLA]
| [IMG:asientos-008.jpg] |
| Figura 7   Numerador EA corregido con máscaras. El detalle serializador guarda el último número de cada rotura. |
[/TABLA]
[TABLA]
| [IMG:asientos-009.jpg] |
| Figura 8   Prueba con el asiento 11 (EA-DOC-005): al guardar recibe el justificante EA26-000001. |
[/TABLA]
## 3. Líneas de apuntes
[TABLA]
| ? | ¿PARA QUÉ SIRVE? / Cada línea es un apunte a una cuenta: importe al Debe o al Haber, con proyecto, sección y dimensiones para el análisis de costes. Las líneas heredan de la cabecera el documento y la descripción, de modo que solo hay que poner la cuenta y el importe. |
[/TABLA]
[TABLA]
| CAMPO | QUÉ SIGNIFICA | VALOR DE EJEMPLO |
| Orden * | Número de línea dentro del asiento. Lo propone el ERP. | 1 |
| Proyecto * | Unidad de negocio de la línea (antes, en «Unidad de negocio»). En TUTORIAL solo existe el 0 GENERAL. | 0 |
| Sección * | Sección o centro de la línea. Se rellena sola al elegir el proyecto. | 0 General |
| Documento | Heredado de la cabecera. | EA-DOC-001 |
| Auditado * | Marca de revisión del apunte. | No |
| Plan contable * | Plan de cuentas de la empresa. | PGE 2008 (ES) |
| Cuenta * | Cuenta contable del apunte. Debajo se ve su descripción. | 62902.00000 Gastos diversos |
| Debe divisa / Haber divisa * | Importe del apunte. Al escribir uno, el otro queda bloqueado a 0. | 1.000,00 / 0,00 |
| Descripción | Concepto del apunte. Se propone el texto de Notas. | EA Ejercicio 2 entrada de asientos |
| Dimensión 1 / Dimensión 2 * | Dimensiones analíticas (lo que antes era «Información auxiliar 0»). | 0 / 0 |
| Cantidad 1 / Cantidad 2 * | Cantidades estadísticas opcionales. | 0,00 |
[/TABLA]
*  Campo obligatorio: sin él no deja guardar.
1 	En la ficha del asiento abre la pestaña «Líneas de apuntes» y pulsa «Nuevo».
2 	Escribe el Proyecto 0 y elige la fila; la Sección pasa a 0.
3 	Escribe la cuenta 62902, elige 62902.00000 y pon 1000 en Debe divisa. Pulsa «Guardar».
4 	Pulsa otra vez «Nuevo»: la línea 2 ya trae Haber 1.000,00 (el importe que falta para cuadrar).
5 	Pon Proyecto 0 y la cuenta 57200.00000 Bancos y pulsa «Guardar».
[TABLA]
| [IMG:asientos-010.jpg] |
| Figura 9   Línea 1: proyecto 0, sección 0, cuenta 62902.00000 Gastos diversos y Debe 1.000,00. |
[/TABLA]
[TABLA]
| [IMG:asientos-011.jpg] |
| Figura 10   Parte inferior de la línea: Dimensión 1 y 2 a 0 (obligatorias) y datos de control. |
[/TABLA]
[TABLA]
| [IMG:asientos-012.jpg] |
| Figura 11   Línea 2: al pulsar «Nuevo» el ERP propone Haber 1.000,00; solo falta la cuenta 57200.00000. |
[/TABLA]
[TABLA]
| Δ | CAMBIO / En la versión antigua había que repetir en cada línea empresa, proyecto, sección, diario, justificante y documento. En la nueva se escriben una vez en la cabecera y la línea nueva propone además el importe que descuadra. |
[/TABLA]
[TABLA]
| ✓   QUÉ HAS CONSEGUIDO |
| ✓	Asiento 6 de la empresa 0, diario EA, documento EA-DOC-001, en estado Provisional. / ✓	Líneas: 62902.00000 Debe 1.000,00 y 57200.00000 Haber 1.000,00. / ✓	Numerador de justificantes EA con máscaras #e#yy / EA#yy-#n. / CÓMO COMPROBARLO / →	Comprueba en la lista de asientos que el 6 sale con diario EA y Debe = Haber = 1.000,00. |
[/TABLA]
# 2.3. Verificar el cuadre
[TABLA]
| ? | ¿PARA QUÉ SIRVE? / Un asiento solo puede contabilizarse si cuadra: la suma del Debe debe ser igual a la del Haber. El bloque «Totales» de la pestaña Líneas de apuntes va sumando a medida que se graban líneas y muestra la diferencia en «Cuadre». |
[/TABLA]
1 	Tras guardar la línea 1, mira el bloque Totales: Debe 1.000,00, Haber 0,00 y Cuadre 1.000,00 en rojo.
2 	Tras guardar la línea 2: Debe 1.000,00 = Haber 1.000,00 y Cuadre 0,00.
3 	Si el cuadre no se actualiza, pulsa «Recalcular cuadre» en la barra superior.
[TABLA]
| [IMG:asientos-013.jpg] |
| Figura 12   Con una sola línea el Cuadre sale en rojo (1.000,00) y el botón Finalizar no aparece. |
[/TABLA]
[TABLA]
| [IMG:asientos-014.jpg] |
| Figura 13   Con las dos líneas Debe = Haber = 1.000,00, Cuadre 0,00 y vuelve a aparecer «Finalizar». |
[/TABLA]
[TABLA]
| Δ | CAMBIO / La versión nueva no deja contabilizar un asiento descuadrado: mientras el Cuadre no es 0 el botón «Finalizar» desaparece de la barra. En la antigua había que comprobarlo a ojo en la cuadrícula de abajo. |
[/TABLA]
[TABLA]
| ✓   QUÉ HAS CONSEGUIDO |
| ✓	El asiento 6 cuadra: Debe 1.000,00 = Haber 1.000,00. / CÓMO COMPROBARLO / →	Comprueba que el Cuadre es 0,00 y que se ve el botón Finalizar. |
[/TABLA]
# 2.4. Añadir dos líneas más
[TABLA]
| ? | ¿PARA QUÉ SIRVE? / Un asiento puede tener tantas líneas como haga falta; lo único que se exige es que el total cuadre. Aquí se añade un segundo gasto, de correos y mensajería, pagado también por banco. |
[/TABLA]
1 	En «Líneas de apuntes» pulsa «Nuevo»: Proyecto 0, cuenta 62903.00000 Correos y mensajería, Debe 250. Guarda.
2 	Pulsa «Nuevo»: el ERP propone Haber 250,00. Proyecto 0, cuenta 57200.00000. Guarda.
[TABLA]
| [IMG:asientos-015.jpg] |
| Figura 14   Asiento 6 con cuatro líneas: Debe 1.250,00 = Haber 1.250,00 y Cuadre 0,00. |
[/TABLA]
[TABLA]
| ✓   QUÉ HAS CONSEGUIDO |
| ✓	Asiento 6 con 4 líneas: 62902 D 1.000 / 57200 H 1.000 / 62903 D 250 / 57200 H 250. / CÓMO COMPROBARLO / →	Comprueba que Totales indica 4 líneas y Cuadre 0,00. |
[/TABLA]
# 2.5. Crear un asiento nuevo
[TABLA]
| ? | ¿PARA QUÉ SIRVE? / Cada operación independiente va en su propio asiento, con su número y su justificante. Se crea otro asiento en la misma empresa, diario y cuentas: un pago de otros servicios de 300 € por banco. |
[/TABLA]
MENÚ    Finanzas   ›   Contabilidad General   ›   Diario contable   ›   Asientos   ›   Asientos (objeto casientos)
1 	Vuelve a la lista de asientos y pulsa «Nuevo» (el «Nuevo» de la ficha queda inactivo mientras estás en las líneas de otro asiento).
2 	Cabecera: Empresa 0, Diario EA, Justificante EA, Documento EA-DOC-002, Notas «EA Ejercicio 2.5 segundo asiento». Guarda.
3 	Abre el asiento 7 › «Líneas de apuntes»: línea 1 cuenta 62900.00000 Otros servicios Debe 300; línea 2 cuenta 57200.00000 Haber 300.
[TABLA]
| [IMG:asientos-016.jpg] |
| Figura 15   Asiento 7: 62900 Debe 300,00 y 57200 Haber 300,00, cuadrado. |
[/TABLA]
[TABLA]
| ✓   QUÉ HAS CONSEGUIDO |
| ✓	Asiento 7 (EA-DOC-002) con 2 líneas por 300,00, en estado Provisional. / CÓMO COMPROBARLO / →	Comprueba en la lista de asientos que hay dos asientos del diario EA: el 6 por 1.250,00 y el 7 por 300,00. |
[/TABLA]
# 2.6. Contabilizar el asiento
[TABLA]
| ? | ¿PARA QUÉ SIRVE? / Contabilizar (finalizar) un asiento lo da por bueno: sus importes pasan al libro mayor y a los saldos de las cuentas, y ya no se puede modificar salvo que se vuelva a abrir. Hay dos maneras: asiento a asiento con el botón «Finalizar», o muchos a la vez con el proceso «Contabilización» (equivale a la contabilización de borradores de la versión antigua). |
[/TABLA]
## 1. Asiento a asiento: botón Finalizar
1 	Abre el asiento 7 cuadrado y pulsa «Finalizar» en la barra superior.
2 	Sale «Éxito»: la banda pasa a FINALIZADO, el Estado a Contabilizado y aparece la pestaña «Saldos».
3 	El botón cambia a «Abrir a provisional», que deshace la contabilización si hay que corregir algo.
[TABLA]
| [IMG:asientos-017.jpg] |
| Figura 16   Ayuda del botón «Abrir a provisional»: vuelve a dejar el asiento modificable y quita sus importes del mayor. Si el periodo está cerrado no se puede. |
[/TABLA]
[TABLA]
| [IMG:asientos-018.jpg] |
| Figura 17   Asiento 7 finalizado: banda FINALIZADO y estado Contabilizado. |
[/TABLA]
## 2. Varios asientos: proceso Contabilización
MENÚ    Finanzas   ›   Contabilidad General   ›   Diario contable   ›   Asientos   ›   Procesos   ›   Contabilización (casientos_contab)
[TABLA]
| CAMPO | QUÉ SIGNIFICA | VALOR DE EJEMPLO |
| Fecha inicio / Fecha fin * | Rango de fechas de los asientos provisionales que se contabilizan. | 01-11-2026 / 12-11-2026 |
| Empresa * | Empresa de los asientos. Por defecto «*» (todas). | 0 |
| Diario (columnas de consulta) | Filtro opcional. Limítalo a tu diario para no contabilizar asientos de otros. | EA |
[/TABLA]
*  Campo obligatorio: sin él no deja guardar.
1 	Abre la ruta. Pon las fechas, la Empresa 0 y, en Columnas de consulta, el Diario EA.
2 	Pulsa «Ejecutar consulta» y confirma «¿Está seguro de ejecutar el proceso?» con «Aceptar».
3 	El resultado lista cada asiento tratado con el mensaje «Proceso completado correctamente».
[TABLA]
| [IMG:asientos-019.jpg] |
| Figura 18   Filtros del proceso: fechas, empresa 0 y diario EA. |
[/TABLA]
[TABLA]
| [IMG:asientos-020.jpg] |
| Figura 19   Resultado: el asiento con ID 40 (el número 6) queda contabilizado. |
[/TABLA]
[TABLA]
| [IMG:asientos-021.jpg] |
| Figura 20   Asiento 6 tras el proceso: FINALIZADO, 4 líneas, 1.250,00 cuadrado. |
[/TABLA]
[TABLA]
| ! | PROBLEMA / Si se deja la Empresa en «*» y no se filtra el diario, el proceso contabiliza todos los asientos provisionales del rango, también los de otras personas que trabajan en la misma base. SOLUCIÓN: filtra siempre por empresa y por tu diario. |
[/TABLA]
## 3. Nota: vigencia de empresa, ejercicio y periodos
[TABLA]
| ? | ¿PARA QUÉ SIRVE? / En la versión antigua contabilizar daba el error «cperiodo_ins: Fechas del periodo fuera de rango de vigencia en empresa» cuando la fecha del asiento no tenía ejercicio. La regla sigue siendo la misma: la empresa tiene una vigencia (cempresa), cada año tiene su ejercicio contable (cejercic) dentro de esa vigencia, y cada ejercicio sus periodos mensuales (cperiodo). Los asientos del día a día deben caer dentro de un periodo abierto. |
[/TABLA]
MENÚ    Maestro de empresas (cempresa) · Ejercicios contables (cejercic) · Períodos contables (cperiodo), desde el buscador
[TABLA]
| [IMG:asientos-022.jpg] |
| Figura 21   Empresa 0: Fecha inicio 01-01-2000 y Fecha fin vacía, es decir, vigencia abierta. |
[/TABLA]
[TABLA]
| [IMG:asientos-023.jpg] |
| Figura 22   Ejercicios de la empresa 0: 2019 a 2026, todos abiertos. No existe 2027. |
[/TABLA]
[TABLA]
| [IMG:asientos-024.jpg] |
| Figura 23   Periodos de la empresa 0: uno por mes con su fecha inicial y final y su estado contable. |
[/TABLA]
[TABLA]
| i | A TENER EN CUENTA / En TUTORIAL no salió el error de vigencia. La empresa 0 está vigente desde 2000 sin fecha fin y los ejercicios hasta 2026 existen. Incluso las copias del apartado 2.12 con fecha de 2027 se contabilizaron sin que existiera el ejercicio 2027 en cejercic. |
[/TABLA]
[TABLA]
| ✓ | SOLUCIÓN / Si en tu entorno sale el error de vigencia, abre cempresa y revisa que la Fecha inicio de tu empresa sea anterior al ejercicio (y la Fecha fin vacía o posterior); después da de alta el ejercicio en cejercic («Añadir ejercicio») y sus periodos en cperiodo («Añadir periodo»). No cambies la vigencia de empresas que no sean tuyas. |
[/TABLA]
[TABLA]
| ✓   QUÉ HAS CONSEGUIDO |
| ✓	Asiento 7 contabilizado con «Finalizar»; asiento 6 contabilizado con el proceso Contabilización filtrado por diario EA. / CÓMO COMPROBARLO / →	Comprueba que los dos salen en estado Contabilizado con la banda FINALIZADO. |
[/TABLA]
# 2.7. Comprobar el resultado
[TABLA]
| ? | ¿PARA QUÉ SIRVE? / Tras contabilizar conviene revisar que no han quedado incoherencias: asientos descuadrados, diferencias entre los apuntes de IVA/IRPF y el registro de impuestos, o efectos de cartera que no casan con la contabilidad. La versión nueva agrupa estos controles en el menú Integridad. |
[/TABLA]
MENÚ    Finanzas   ›   Contabilidad General   ›   Diario contable   ›   Integridad
1 	Abre «Descuadres General e impuestos». Pon Empresa 0 y el rango de fechas y pulsa «Ejecutar consulta».
2 	Si la lista sale vacía, no hay asientos con diferencias entre contabilidad e impuestos.
3 	Para los efectos, usa «Descuadres General -> Cartera por cuentas» o «por terceros»; para asientos que no cuadran, «Descuadres asientos».
[TABLA]
| [IMG:asientos-025.jpg] |
| Figura 24   Menú Integridad: descuadres de asientos, de impuestos, de cartera, de costes y de divisas. |
[/TABLA]
[TABLA]
| [IMG:asientos-026.jpg] |
| Figura 25   Descuadres contabilidad general-impuestos de la empresa 0: sin filas, no hay errores de IVA/IRPF. |
[/TABLA]
[TABLA]
| i | A TENER EN CUENTA / Los asientos de este ejercicio no llevan IVA ni efectos, así que estos informes salen vacíos. Si un asiento manual usa cuentas 472/477 sin rellenar la pestaña «Impuestos», aparecería aquí como descuadre. |
[/TABLA]
[TABLA]
| ✓   QUÉ HAS CONSEGUIDO |
| ✓	Informe de descuadres de impuestos de la empresa 0 sin errores. / CÓMO COMPROBARLO / →	Comprueba también «Descuadres asientos» si has modificado líneas después de cuadrar. |
[/TABLA]
# 2.8. Listar el asiento
[TABLA]
| ? | ¿PARA QUÉ SIRVE? / El listado de apuntes muestra línea a línea lo que se ha contabilizado: cuenta, documento, descripción, Debe y Haber. Es la consulta rápida para revisar un asiento o buscar todos los apuntes de un documento. |
[/TABLA]
MENÚ    Buscador   ›   «Líneas de asiento   ›   (objeto capuntes). También: lista de asientos   ›   abrir el asiento   ›   Líneas de apuntes
1 	Abre capuntes y pulsa la lupa de la barra superior para abrir el formulario de búsqueda.
2 	En Documento escribe EA-DOC* (el asterisco busca todo lo que empieza así) y pulsa «Ejecutar consulta».
[TABLA]
| [IMG:asientos-027.jpg] |
| Figura 26   Líneas de asiento con documento EA-DOC*: todos los apuntes de los ejercicios, con cuenta, descripción, Debe y Haber. |
[/TABLA]
[TABLA]
| ✓   QUÉ HAS CONSEGUIDO |
| ✓	Lista de todos los apuntes del prefijo EA. / CÓMO COMPROBARLO / →	Comprueba que los cuatro apuntes del EA-DOC-001 suman 1.250,00 al Debe y 1.250,00 al Haber. |
[/TABLA]
# 2.9. Extracto de las cuentas del asiento
[TABLA]
| ? | ¿PARA QUÉ SIRVE? / El extracto (mayor) de una cuenta enseña todos sus movimientos en un periodo con el saldo acumulado línea a línea. Es lo que se mira para justificar el saldo de una cuenta o localizar un apunte. |
[/TABLA]
MENÚ    Finanzas   ›   Contabilidad General   ›   Extractos   ›   Mayor de cuentas (capuntes_ext_cuenta_rep)
[TABLA]
| CAMPO | QUÉ SIGNIFICA | VALOR DE EJEMPLO |
| Empresa * | Empresa del extracto. | 0 |
| Fecha inicial / Fecha fin * | Periodo del extracto; para todo el año, del 1 de enero al 31 de diciembre. | 01-01-2026 / 31-12-2026 |
| Cuenta * | Cuenta o cuentas a extractar. | 62902.00000 |
| Proyecto / Sección * | Filtros de unidad de negocio; «*» para todos. | * |
[/TABLA]
*  Campo obligatorio: sin él no deja guardar.
1 	Abre la ruta, pon Empresa 0, todo el año y la cuenta 62902.00000.
2 	Pulsa «Ejecutar consulta». Desplaza la tabla a la derecha para ver Debe, Haber y Saldo.
3 	Repite con 62903.00000 y 57200.00000 si quieres ver las demás cuentas del asiento.
[TABLA]
| [IMG:asientos-028.jpg] |
| Figura 27   Filtros del mayor dinámico: empresa 0, año 2026 y cuenta 62902.00000. |
[/TABLA]
[TABLA]
| [IMG:asientos-029.jpg] |
| Figura 28   Extracto de la 62902: asientos 6 (1.000), 8 (1.000) y 9 (1.500) con saldo acumulado 1.000 › 2.000 › 3.500. |
[/TABLA]
[TABLA]
| ✓   QUÉ HAS CONSEGUIDO |
| ✓	Extracto de la 62902.00000 de 2026 con saldo final 3.500,00. / CÓMO COMPROBARLO / →	Comprueba que el primer movimiento es el asiento 6, documento EA-DOC-001. |
[/TABLA]
# 2.10. Sumas y saldos de las cuentas
[TABLA]
| ? | ¿PARA QUÉ SIRVE? / Los saldos de cuentas guardan, por cuenta y periodo, la suma del Debe y del Haber de los asientos contabilizados. Es la base del balance de sumas y saldos y solo recoge asientos finalizados (los provisionales no tienen impacto). |
[/TABLA]
MENÚ    Finanzas   ›   Contabilidad General   ›   Saldos   ›   Saldos cuentas (objeto csaldos)
1 	Abre la ruta y pulsa la lupa.
2 	Marca Empresa 0 y Ejercicio 2026 y pulsa «Ejecutar consulta».
3 	Localiza las cuentas 57200, 62900, 62902 y 62903 en los periodos 11 y 12.
[TABLA]
| [IMG:asientos-030.jpg] |
| Figura 29   Saldos de la empresa 0 en 2026: periodo 11 con 57200 Haber 2.800, 62900 Debe 300, 62902 Debe 2.000 y 62903 Debe 500; periodo 12 con la copia de diciembre. |
[/TABLA]
[TABLA]
| Δ | CAMBIO / La versión antigua sacaba las sumas y saldos desde «Extractos › Cuentas en divisas». En la nueva están en el menú Saldos (Saldos cuentas, mensualizados, agrupados) y en Balances. |
[/TABLA]
[TABLA]
| ✓   QUÉ HAS CONSEGUIDO |
| ✓	Sumas y saldos por periodo de las cuentas usadas. / CÓMO COMPROBARLO / →	Comprueba que la 57200 del periodo 11 suma al Haber lo mismo que las cuentas de gasto al Debe. |
[/TABLA]
# 2.11. Duplicar el asiento
[TABLA]
| ? | ¿PARA QUÉ SIRVE? / Duplicar sirve para asientos que se repiten igual (una cuota, un alquiler, un ajuste mensual): se copia uno ya hecho en lugar de teclearlo de nuevo. La copia nace Provisional para poder revisarla antes de contabilizarla. |
[/TABLA]
MENÚ    Finanzas   ›   Contabilidad General   ›   Diario contable   ›   Asientos   ›   Asientos (objeto casientos)   ›   ficha del asiento 6   ›   Copiar asiento
[TABLA]
| CAMPO | QUÉ SIGNIFICA | VALOR DE EJEMPLO |
| Empresa * | Empresa en la que se crea la copia. | 0 |
| Fecha * | Fecha de la (primera) copia. | 12-11-2026 |
| Documento | Si se rellena, sustituye el documento de la cabecera y de las líneas. | EA-DOC-003 |
| Descripción | Si se rellena, sustituye la descripción de los apuntes y las notas. | EA 2.11 duplicado del asiento 6 |
| Número a generar * | Cuántas copias se crean. | 1 |
| Cadencia mensual * | Meses entre una copia y la siguiente. | 1 |
| Invertir asiento * | Sí: crea el contraasiento (Debe y Haber cambiados), útil para anular. | No |
| Copiar todo * | Sí: copia también los datos de cartera e impuestos del original, si los tiene. | Sí |
[/TABLA]
*  Campo obligatorio: sin él no deja guardar.
1 	Abre el asiento 6 y pulsa «Copiar asiento».
2 	Pon Documento EA-DOC-003 y la Descripción, deja Número a generar 1 y pulsa «Aceptar».
3 	Vuelve a la lista de asientos: aparece el asiento 8 por 1.250,00, Provisional y con clasificación Manual.
[TABLA]
| [IMG:asientos-031.jpg] |
| Figura 30   Diálogo «Copiar asiento» con una sola copia a la misma fecha. |
[/TABLA]
[TABLA]
| [IMG:asientos-032.jpg] |
| Figura 31   Lista de asientos: el 8 (copia) está Provisional; el 6 y el 7, Contabilizados. |
[/TABLA]
[TABLA]
| i | A TENER EN CUENTA / Al aceptar, la página intenta abrir el asiento nuevo en otra pestaña del navegador. Si el navegador lo bloquea no pasa nada: la copia está creada y se ve en la lista. |
[/TABLA]
[TABLA]
| i | A TENER EN CUENTA / La copia lleva el justificante AC en lugar del numerador EA del original. Si lo necesitas, cámbialo en la cabecera antes de finalizar. |
[/TABLA]
[TABLA]
| ✓   QUÉ HAS CONSEGUIDO |
| ✓	Asiento 8 (EA-DOC-003), copia exacta del 6 por 1.250,00. / CÓMO COMPROBARLO / →	Comprueba que el asiento 8 tiene las mismas 4 líneas que el 6. |
[/TABLA]
# 2.12. Tres copias en meses consecutivos
[TABLA]
| ? | ¿PARA QUÉ SIRVE? / Con Número a generar y Cadencia mensual se programan de una vez los asientos recurrentes de los próximos meses: cada copia se fecha un mes después de la anterior. El manual antiguo pedía copias desde el 01-09-06; aquí se hace desde el 01-12-2026. |
[/TABLA]
1 	Abre el asiento 8 y pulsa «Copiar asiento».
2 	Fecha 01-12-2026, Documento EA-DOC-004, Descripción «EA 2.12 copia mensual», Número a generar 3, Cadencia mensual 1. Acepta.
3 	En la lista salen tres asientos: 01-12-2026 (asiento 9 de 2026), 01-01-2027 y 01-02-2027 (asientos 1 y 2 de 2027).
4 	Contabilízalos con el proceso Contabilización (apartado 2.6) poniendo Fecha fin 28-02-2027, Empresa 0 y Diario EA.
[TABLA]
| [IMG:asientos-033.jpg] |
| Figura 32   Última copia: 01-02-2027, ejercicio 2027, periodo 2. La numeración de asientos empieza de nuevo cada año. |
[/TABLA]
[TABLA]
| [IMG:asientos-034.jpg] |
| Figura 33   Las tres copias en la lista: una en diciembre de 2026 y dos en 2027. |
[/TABLA]
[TABLA]
| [IMG:asientos-035.jpg] |
| Figura 34   Proceso Contabilización hasta 28-02-2027: los cuatro asientos provisionales del diario EA, contabilizados. |
[/TABLA]
[TABLA]
| i | A TENER EN CUENTA / Como se ve en el apartado 2.6, en TUTORIAL las copias de 2027 se contabilizaron aunque no existe el ejercicio 2027 en cejercic. |
[/TABLA]
[TABLA]
| ✓   QUÉ HAS CONSEGUIDO |
| ✓	Asientos 9 (01-12-2026), 1 (01-01-2027) y 2 (01-02-2027), con documento EA-DOC-004, contabilizados. / CÓMO COMPROBARLO / →	Comprueba en la lista que cada uno tiene su ejercicio y periodo (2026/12, 2027/1 y 2027/2). |
[/TABLA]
# 2.13. Cambiar importes de las dos primeras líneas
[TABLA]
| ? | ¿PARA QUÉ SIRVE? / Mientras el asiento está Provisional se puede corregir cualquier línea. Si se cambia el importe de una sola, el asiento se descuadra; hay que cambiar también su contrapartida. Un asiento ya contabilizado primero se pasa a provisional con «Abrir a provisional». |
[/TABLA]
1 	Abre el asiento 9 (copia de diciembre) antes de contabilizarlo › «Líneas de apuntes».
2 	Pulsa el número de la línea 1: se abre un panel lateral. Cambia Debe divisa de 1.000 a 1.500 y guarda con el disquete del panel.
3 	Cierra el panel y pulsa «Recargar» en la lista de líneas: Cuadre 500,00 en rojo y sin botón Finalizar.
4 	Abre la línea 2 y cambia Haber divisa de 1.000 a 1.500. Guarda: el asiento vuelve a cuadrar (1.750,00).
[TABLA]
| [IMG:asientos-036.jpg] |
| Figura 35   Panel lateral de la línea 1: el campo modificado se marca con una barra roja hasta que se guarda. |
[/TABLA]
[TABLA]
| [IMG:asientos-037.jpg] |
| Figura 36   Con solo la línea 1 cambiada: Debe 1.750,00, Haber 1.250,00 y Cuadre 500,00 en rojo. |
[/TABLA]
[TABLA]
| [IMG:asientos-038.jpg] |
| Figura 37   Con las dos líneas cambiadas: Debe = Haber = 1.750,00 y Cuadre 0,00. |
[/TABLA]
[TABLA]
| Δ | CAMBIO / Las líneas no se editan en la cuadrícula, sino en un panel lateral que se abre al pulsar el número de la fila. Hay que guardar con el disquete del panel y recargar la lista para ver los totales nuevos. |
[/TABLA]
[TABLA]
| ✓   QUÉ HAS CONSEGUIDO |
| ✓	Asiento 9 con las líneas 1 y 2 a 1.500,00 y total 1.750,00 cuadrado. / CÓMO COMPROBARLO / →	Comprueba en el extracto de la 62902 (apartado 2.9) que el movimiento del 01-12-2026 es de 1.500,00. |
[/TABLA]
# Resumen de datos creados
•	Diario EA «Entrada de asientos EA» (cdiarios).
•	Numerador de justificantes EA «Asientos manuales EA» (cjusnumh), con máscaras #e#yy / EA#yy-#n.
•	Empresa 0, ejercicio 2026: asientos 6 (EA-DOC-001, 1.250,00), 7 (EA-DOC-002, 300,00), 8 (EA-DOC-003, copia), 9 (EA-DOC-004, 01-12-2026, 1.750,00) y 11 (EA-DOC-005, EA26-000001, 50,00), todos contabilizados.
•	Empresa 0, ejercicio 2027: asientos 1 y 2 (EA-DOC-004, copias de enero y febrero), contabilizados.
[TABLA]
| [IMG:asientos-039.jpg] |
| Figura 38   Asiento 11 con el justificante EA26-000001 generado por el numerador corregido, finalizado. |
[/TABLA]