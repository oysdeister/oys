[IMG:parametrizacion-001.png]
DEISTER MANAGER  ·  MANUAL DE FORMACIÓN
CONTABILIDAD · TEMA 1
Estructuras contables
[TABLA]
|  |
[/TABLA]
Ejercicios documentados en la versión nueva del ERP
CONTENIDO
—	Antes de empezar
01	Dar de alta una cuenta del grupo 6 «Gastos varios»
02	Cambiar la descripción de la cuenta
03	Crear un grupo auxiliar «Empleados» con José Gómez
04	Asignar el grupo auxiliar a la cuenta
05	Crear un proyecto «División 1»
06	Crear una sección «Administración»
# Índice
Cómo usar este manual	3
Antes de empezar	5
Qué es la estructura contable	5
Cómo moverse por la versión nueva	5
Ejercicio 1.1. Dar de alta una cuenta del grupo 6 «Gastos varios»	6
Ejercicio 1.2. Cambiar la descripción de la cuenta	11
Ejercicio 1.3. Crear un grupo auxiliar «Empleados» con José Gómez	13
Crear el grupo	13
Añadir el código auxiliar José Gómez	14
Ejercicio 1.4. Asignar el grupo auxiliar a la cuenta	17
Ejercicio 1.5. Crear un proyecto «División 1»	20
Ejercicio 1.6. Crear una sección «Administración»	23
# Cómo usar este manual
Este documento repite los ejercicios 1.1 a 1.6 de Estructuras contables sobre la versión nueva del ERP (Deister Manager, base BBDD TUTORIAL en nextdemo.geasa.eu). Para cada pantalla se explica para qué sirve en la empresa, dónde está en el menú, qué significa cada campo y qué pasos seguir. Los recuadros CAMBIO señalan lo que funciona distinto que en la versión antigua; los recuadros PROBLEMA y SOLUCIÓN, los errores que salen por el camino y cómo se resuelven.
En los ejemplos se usan códigos con el prefijo EC (cuenta «Gastos varios EC», grupo auxiliar ECEMP, proyecto EC1, sección ECADM). Sustitúyelo por tus iniciales. En las tablas de campos, la columna «Oblig.» indica si la pantalla marca el campo con asterisco rojo.
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
## Qué es la estructura contable
[TABLA]
| ? | ¿PARA QUÉ SIRVE? / Antes de contabilizar nada, la empresa define su estructura contable: el plan de cuentas (en qué cuentas se registra cada hecho), los auxiliares (un segundo nivel de detalle dentro de una cuenta, por ejemplo por empleado) y la analítica (proyectos y secciones, para saber a qué parte del negocio pertenece cada gasto o ingreso). Todo lo que se crea aquí se usa después en los asientos, las facturas y los informes: una cuenta mal definida obliga a corregir asientos más tarde, así que vale la pena entender cada campo. |
[/TABLA]
•	Ejercicios 1.1 y 1.2: dar de alta una cuenta de gastos del grupo 6 y cambiarle la descripción.
•	Ejercicios 1.3 y 1.4: crear un grupo auxiliar «Empleados» con José Gómez y asignarlo a la cuenta.
•	Ejercicios 1.5 y 1.6: crear un proyecto «División 1» y una sección «Administración», y enlazarlos.
## Cómo moverse por la versión nueva
•	Ya no se entra desde «O&S Learning › finanzas › maestros…». Se usa el menú lateral (icono ☰ arriba a la izquierda): Finanzas › Maestros › … o el buscador superior «Buscar» (Cmd/Ctrl + K), escribiendo el nombre de la pantalla.
•	Unas pantallas se abren en modo lista (cuentas contables) y otras en modo ficha con el primer registro (grupos auxiliares, proyectos, secciones). Para crear un registro: botón rojo «Añadir …» arriba a la derecha › «Nuevo» (formulario en blanco) o «Nuevo como» (copia del registro que se está viendo).
•	El alta se rellena en una ventana y se guarda con «Guardar» abajo a la derecha. Los cambios en una ficha ya existente se guardan con el icono del disquete de la barra superior. En los dos casos sale el aviso verde «Éxito».
•	Los campos con lista (plan contable, grupo auxiliar, sección…) son de autocompletar: se escribe el código y se elige la fila. Debajo del campo aparece la descripción del valor elegido.
[TABLA]
| Δ | CAMBIO / Los campos obligatorios llevan un asterisco rojo en la etiqueta. Si se guarda sin ellos sale «Hay errores en los datos del formulario» y el campo que falta se marca en rojo. |
[/TABLA]
[TABLA]
| ! | PROBLEMA / Las listas de la versión nueva son editables en la propia rejilla. Un clic sobre una celda (por ejemplo la descripción de otra cuenta) abre su edición en línea. SOLUCIÓN: para consultar, abre el registro con el enlace del código; si has abierto una celda por error, pulsa Esc sin escribir nada y no se guarda ningún cambio. |
[/TABLA]
# EJERCICIO 1.1
Dar de alta una cuenta del grupo 6 «Gastos varios»
[TABLA]
| ? | ¿PARA QUÉ SIRVE? / Las cuentas del grupo 6 recogen los gastos de la empresa. Se crea una cuenta propia cuando se quiere ver por separado un tipo de gasto en el balance de sumas y saldos y en la cuenta de resultados. A partir de ese momento se puede usar en asientos, facturas de compra y plantillas contables. |
[/TABLA]
MENÚ    Finanzas   ›   Maestros   ›   Cuentas contables   ›   Cuentas contables (objeto ccuentas)
Primero conviene mirar cómo están definidas las cuentas parecidas. Al abrir la pantalla se muestra un filtro: escribe 629* en «Cuenta» y pulsa «Ejecutar consulta». En la base TUTORIAL hay dos planes contables: «PG Andorra 2012» y el español «PGE 2008» (código ES), con cuentas de 5 + 5 dígitos (62900.00000).
[TABLA]
| [IMG:parametrizacion-002.jpg] |
| Figura 1   Cuentas 629 del plan PGE 2008: todas son de tipo Costes, Activar Ambos, Activa C, grupo Standard, 999 días y posición Debe. La nueva cuenta seguirá el mismo modelo. |
[/TABLA]
[TABLA]
| CAMPO | QUÉ SIGNIFICA | VALOR DE EJEMPLO |
| Plan contable * | Plan de cuentas al que pertenece la cuenta. Se escribe el código del plan (ES), no su descripción. | ES (PGE 2008) |
| Posición * | Saldo habitual de la cuenta. Un gasto se carga en el Debe. | Debe |
| Estado * | Solo las cuentas abiertas admiten apuntes. Una cuenta cerrada no se puede usar en asientos nuevos. | Abierto |
| Cuenta * | Código de la cuenta, con el formato del plan (5 dígitos, punto, 5 dígitos). | 62999.00000 |
| Descripción cuenta * | Nombre que sale en los listados, el mayor y el balance. | Gastos varios EC |
| Grupo * | Si es una cuenta de parte relacionada o vinculada (para la memoria). Lo normal es Standard. | Standard |
| Grupo auxiliar | Grupo de códigos auxiliares que pedirá la cuenta al contabilizar. Se rellena en el ejercicio 1.4. | (vacío por ahora) |
| Tipo * | Comportamiento de la cuenta: Normal, Terceros (clientes y proveedores), Entidades financieras (bancos), Costes (cuentas de gestión de los grupos 6 y 7) o Analítica (grupo 9). Una cuenta de gastos es de Costes. | Costes |
| Activa | Qué auxiliares activa la cuenta al contabilizar: la ayuda del campo indica impuestos, cartera y costes; C = costes, como el resto de la 629. | C |
| Activar | En qué lado del asiento se activan esos auxiliares: Debe, Haber o Ambos. | Ambos |
| Días máximos * | Días sin movimiento a partir de los cuales la cuenta se considera inactiva. 999 = sin límite práctico. | 999 |
| Periodificable * | Si los importes de la cuenta se pueden repartir entre varios periodos. Para gastos varios, No. | No |
[/TABLA]
*  Campo obligatorio: sin él no deja guardar.
1 	Abre la ruta, filtra por 629* y pulsa «Ejecutar consulta» para ver las cuentas parecidas.
2 	Pulsa el botón rojo «Añadir cuenta». Se abre la ventana «CUENTAS CONTABLES».
3 	En Plan contable escribe ES y elige la fila «ES · PGE 2008» de la lista.
4 	Escribe la Cuenta 62999.00000 y la Descripción «Gastos varios EC». Deja Debe, Abierto y Standard.
5 	En Información general elige Tipo «Costes», escribe C en Activa y elige «Ambos» en Activar. Deja 999 días.
6 	Pulsa «Guardar»: sale «Éxito» y la cuenta aparece en la lista.
[TABLA]
| [IMG:parametrizacion-003.jpg] |
| Figura 2   Desplegable Tipo: cada tipo explica su uso. «Costes» es el de las cuentas de gestión de los grupos 6 y 7. |
[/TABLA]
[TABLA]
| [IMG:parametrizacion-004.jpg] |
| Figura 3   Alta rellena: plan PGE 2008 (código ES debajo), cuenta 62999.00000, Costes, Activa C y Activar Ambos. |
[/TABLA]
[TABLA]
| [IMG:parametrizacion-005.jpg] |
| Figura 4   Resultado: aviso «Éxito» y la cuenta 62999.00000 «Gastos varios EC» en la última fila de la lista. |
[/TABLA]
[TABLA]
| Δ | CAMBIO / En la versión antigua el plan era «ES» con cuentas de 4 + 6 dígitos (7799.000000) y el tipo era «Normal». En la base TUTORIAL el plan español es «PGE 2008» con cuentas de 5 + 5 dígitos, y las cuentas de gastos son de tipo «Costes» para que pidan la analítica (proyecto y sección) al contabilizar. |
[/TABLA]
[TABLA]
| ! | PROBLEMA / Si en Plan contable se escribe la descripción (PGE) en lugar del código, la lista no encuentra nada, el campo queda en rojo con «Error en la validación» y al escribir después la cuenta puede salir la ventana «Se ha producido un error · TypeError: Cannot read property 'split' of null», porque la pantalla no sabe qué formato de cuenta aplicar. |
[/TABLA]
[TABLA]
| [IMG:parametrizacion-006.jpg] |
| Figura 5   Error: con «PGE» escrito a mano el plan no es válido y el campo se marca «Error en la validación». |
[/TABLA]
[TABLA]
| ✓ | SOLUCIÓN / Cierra el aviso, borra el texto del plan, escribe ES y sal del campo (Tab) o elige la fila de la lista. Debajo del campo debe aparecer «ES» y el plan «PGE 2008»; entonces la cuenta se acepta. |
[/TABLA]
[TABLA]
| ✓   QUÉ HAS CONSEGUIDO |
| ✓	Cuenta ES 62999.00000 «Gastos varios EC» creada: Debe, Abierto, Standard, Costes, Activa C, Activar Ambos, 999 días. / ✓	Comprobación: filtra la lista por 629* y la cuenta aparece al final con los mismos valores que el resto de la 629. |
[/TABLA]
# EJERCICIO 1.2
Cambiar la descripción de la cuenta
[TABLA]
| ? | ¿PARA QUÉ SIRVE? / La descripción de una cuenta se puede cambiar en cualquier momento, incluso si ya tiene apuntes: es solo el texto que sale en los listados. Lo que no se cambia así es el código: para renumerar una cuenta con movimientos hay una pantalla específica: Finanzas › Maestros › Cuentas contables › Cambio código de cuenta. |
[/TABLA]
MENÚ    Finanzas   ›   Maestros   ›   Cuentas contables   ›   Cuentas contables (objeto ccuentas)
1 	Filtra la lista por la cuenta 62999.00000 y ábrela pulsando su código. Si se abre en una ventana flotante, la ficha también se puede ver en página completa (aparece el menú lateral con la ruta).
2 	Cambia la Descripción cuenta a «Gastos varios EC Administración».
3 	Pulsa el icono del disquete de la barra superior: sale «Éxito».
[TABLA]
| [IMG:parametrizacion-007.jpg] |
| Figura 6   Ficha de la cuenta: la marca roja a la izquierda de la descripción indica un cambio pendiente de guardar. |
[/TABLA]
[TABLA]
| [IMG:parametrizacion-008.jpg] |
| Figura 7   Cambio guardado con el disquete: aviso «Éxito» y la nueva descripción. |
[/TABLA]
[TABLA]
| Δ | CAMBIO / En la versión antigua se modificaba sobre la misma pantalla de alta y se confirmaba con el botón ✓. En la nueva se abre la ficha y se guarda con el disquete de la barra superior. |
[/TABLA]
[TABLA]
| ✓   QUÉ HAS CONSEGUIDO |
| ✓	La cuenta 62999.00000 se llama ahora «Gastos varios EC Administración». / ✓	Comprobación: en la lista de cuentas (filtro 629*) sale la nueva descripción. |
[/TABLA]
# EJERCICIO 1.3
Crear un grupo auxiliar «Empleados» con José Gómez
[TABLA]
| ? | ¿PARA QUÉ SIRVE? / Un grupo auxiliar es una lista de códigos que permite desglosar el saldo de una cuenta sin crear una subcuenta por cada caso. Por ejemplo, con el grupo «Empleados» la misma cuenta de gastos puede llevar cada apunte asignado a un empleado concreto, y después sacar el saldo por empleado. Primero se crea el grupo y sus códigos; después se asigna a las cuentas. |
[/TABLA]
MENÚ    Finanzas   ›   Maestros   ›   Cuentas contables   ›   Grupos auxiliares (objeto cctaauxh)
## Crear el grupo
[TABLA]
| CAMPO | QUÉ SIGNIFICA | VALOR DE EJEMPLO |
| Grupo auxiliar * | Código del grupo. Es lo que se elige después en la ficha de la cuenta. Máximo 6 caracteres. | ECEMP |
| Descripción auxiliar * | Nombre del grupo (se guarda en mayúsculas). | EMPLEADOS EC |
[/TABLA]
*  Campo obligatorio: sin él no deja guardar.
1 	Abre la ruta: se muestra la ficha del grupo existente TERCER «Terceros».
2 	Pulsa «Añadir grupos › Nuevo».
3 	Escribe ECEMP y «Empleados EC» y pulsa «Guardar».
[TABLA]
| [IMG:parametrizacion-009.jpg] |
| Figura 8   Alta del grupo: código ECEMP y descripción, que la pantalla convierte a mayúsculas. |
[/TABLA]
## Añadir el código auxiliar José Gómez
[TABLA]
| CAMPO | QUÉ SIGNIFICA | VALOR DE EJEMPLO |
| Auxiliar * | Código del elemento dentro del grupo (aquí, el empleado). Máximo 14 caracteres. | EC0001 |
| Descripción auxiliar * | Nombre del elemento. | José Gómez |
| Estado * | Solo los códigos abiertos se pueden usar en los apuntes. | Abierto |
[/TABLA]
*  Campo obligatorio: sin él no deja guardar.
1 	Abre la ficha del grupo ECEMP (en la lista de grupos, o con las flechas ‹ › de la barra superior).
2 	En el bloque «Códigos auxiliares» pulsa «Añadir codigos». La ventana debe mostrar «EMPLEADOS EC» bajo el título.
3 	Escribe EC0001 y «José Gómez», deja Abierto y pulsa «Guardar».
[TABLA]
| [IMG:parametrizacion-010.jpg] |
| Figura 9   Ficha del grupo ECEMP: abajo, los bloques «Códigos auxiliares» y «Listado de cuentas contables», todavía vacíos. |
[/TABLA]
[TABLA]
| [IMG:parametrizacion-011.jpg] |
| Figura 10   Alta del código: debajo del título se ve el grupo al que se añade (EMPLEADOS EC). |
[/TABLA]
[TABLA]
| [IMG:parametrizacion-012.jpg] |
| Figura 11   Resultado: el grupo ECEMP tiene el código EC0001 «José Gómez» abierto. |
[/TABLA]
[TABLA]
| Δ | CAMBIO / En la versión antigua grupo y códigos estaban en dos pestañas («Grupos auxiliares» y «Códigos auxiliares»). En la nueva están en la misma ficha: arriba el grupo y debajo sus códigos y las cuentas que lo usan. |
[/TABLA]
[TABLA]
| ! | PROBLEMA / Justo después de guardar el grupo nuevo, la cabecera de la pantalla seguía mostrando «Terceros» y la ventana de «Añadir codigos» salía con «Terceros» bajo el título: el código se habría añadido al grupo TERCER, que no es nuestro. |
[/TABLA]
[TABLA]
| ✓ | SOLUCIÓN / Cancela esa ventana y vuelve a abrir la ficha del grupo ECEMP desde la lista. Antes de guardar un código, comprueba siempre que debajo del título de la ventana aparece el nombre de tu grupo. |
[/TABLA]
[TABLA]
| ✓   QUÉ HAS CONSEGUIDO |
| ✓	Grupo auxiliar ECEMP «EMPLEADOS EC» creado, con el código EC0001 «José Gómez» abierto. / ✓	Comprobación: la lista de grupos auxiliares muestra ECEMP y TERCER; la ficha de ECEMP muestra el código EC0001. |
[/TABLA]
# EJERCICIO 1.4
Asignar el grupo auxiliar a la cuenta
[TABLA]
| ? | ¿PARA QUÉ SIRVE? / Al asignar el grupo auxiliar a la cuenta, cada apunte que se haga en ella podrá llevar uno de los códigos del grupo (EC0001 José Gómez…). Así el mayor de la cuenta se puede consultar por empleado sin abrir una subcuenta para cada uno. |
[/TABLA]
MENÚ    Finanzas   ›   Maestros   ›   Cuentas contables   ›   Cuentas contables (objeto ccuentas)
[TABLA]
| CAMPO | QUÉ SIGNIFICA | VALOR DE EJEMPLO |
| Grupo auxiliar | Grupo de códigos que usará la cuenta. La lista muestra los grupos creados en Grupos auxiliares. | ECEMP EMPLEADOS EC |
[/TABLA]
1 	Abre la ficha de la cuenta 62999.00000.
2 	En «Grupo auxiliar» abre la lista y elige ECEMP.
3 	Pulsa el disquete: sale «Éxito».
4 	Para comprobarlo, abre el grupo ECEMP y pulsa «Recargar» (↻) en el bloque «Listado de cuentas contables».
[TABLA]
| [IMG:parametrizacion-013.jpg] |
| Figura 12   Lista del campo Grupo auxiliar: ECEMP «EMPLEADOS EC» y el grupo existente TERCER. |
[/TABLA]
[TABLA]
| [IMG:parametrizacion-014.jpg] |
| Figura 13   Cuenta guardada con el Grupo auxiliar ECEMP. |
[/TABLA]
[TABLA]
| [IMG:parametrizacion-015.jpg] |
| Figura 14   Comprobación desde el grupo: tras Recargar, «Listado de cuentas contables» muestra la cuenta 62999.00000. |
[/TABLA]
[TABLA]
| i | A TENER EN CUENTA / El bloque «Listado de cuentas contables» de la ficha del grupo no se actualiza solo; si acabas de asignar el grupo y sale «Sin datos», pulsa «Recargar». |
[/TABLA]
[TABLA]
| ✓   QUÉ HAS CONSEGUIDO |
| ✓	La cuenta 62999.00000 «Gastos varios EC Administración» tiene asignado el grupo auxiliar ECEMP. / ✓	Comprobación: en la ficha de ECEMP, «Listado de cuentas contables» muestra ES · PGE 2008 · 62999.00000. |
[/TABLA]
# EJERCICIO 1.5
Crear un proyecto «División 1»
[TABLA]
| ? | ¿PARA QUÉ SIRVE? / Proyectos y secciones son la analítica de la contabilidad: cada apunte de una cuenta de costes se asigna a un proyecto (por ejemplo una división o una obra) y a una sección (un departamento), y así se obtiene la cuenta de resultados por división o por departamento. El proyecto puede llevar una sección por defecto, que se propone al contabilizar. |
[/TABLA]
MENÚ    Finanzas   ›   Maestros   ›   Auxiliares   ›   Proyectos   ›   Proyectos (objeto cproyect)
[TABLA]
| CAMPO | QUÉ SIGNIFICA | VALOR DE EJEMPLO |
| Proyecto * | Código del proyecto. Máximo 12 caracteres. | EC1 |
| Descripción proyecto * | Nombre del proyecto. | División 1 EC |
| Estado * | Solo los proyectos abiertos se pueden usar en los apuntes. | Abierto |
| Sección | Sección por defecto del proyecto. No es obligatoria; con «Nuevo como» se copia la del proyecto de origen. | 0 General (después ECADM) |
| Empresa / Tercero / Dirección | Permiten limitar el proyecto a una empresa o vincularlo a un cliente. No hacen falta aquí. | (vacío) |
[/TABLA]
*  Campo obligatorio: sin él no deja guardar.
1 	Abre la ruta: se muestra la ficha del proyecto 0 «GENERAL».
2 	Pulsa «Añadir proyecto › Nuevo como» para partir del proyecto existente, como en el manual antiguo.
3 	Escribe EC1 y «División 1 EC». Se mantiene Abierto y la sección 0 «General» copiada.
4 	Pulsa «Guardar»: sale «Éxito».
[TABLA]
| [IMG:parametrizacion-016.jpg] |
| Figura 15   Ruta en el menú lateral y ficha del proyecto 0 GENERAL, que sirve de modelo. |
[/TABLA]
[TABLA]
| [IMG:parametrizacion-017.jpg] |
| Figura 16   «Nuevo como»: código y descripción en blanco; estado y sección copiados del proyecto GENERAL. |
[/TABLA]
[TABLA]
| [IMG:parametrizacion-018.jpg] |
| Figura 17   Lista de proyectos: 0 GENERAL y el nuevo EC1 «División 1 EC», los dos con la sección 0. |
[/TABLA]
[TABLA]
| Δ | CAMBIO / «Nuevo como» es lo que el manual antiguo describía como «seleccionar un proyecto existente y generar uno nuevo a partir de este». No modifica el proyecto de origen: crea uno nuevo con sus valores. |
[/TABLA]
[TABLA]
| ✓   QUÉ HAS CONSEGUIDO |
| ✓	Proyecto EC1 «División 1 EC» creado, abierto, con la sección 0 de momento. / ✓	Comprobación: la lista de proyectos muestra EC1. |
[/TABLA]
# EJERCICIO 1.6
Crear una sección «Administración»
[TABLA]
| ? | ¿PARA QUÉ SIRVE? / La sección representa un departamento o centro de coste (Administración, Comercial, Taller…). Junto con el proyecto permite ver los gastos por departamento. Se crea una vez y se puede usar en cualquier proyecto; aquí además se asigna como sección por defecto del proyecto EC1. |
[/TABLA]
MENÚ    Finanzas   ›   Maestros   ›   Auxiliares   ›   Secciones   ›   Secciones (objeto cseccion)
[TABLA]
| CAMPO | QUÉ SIGNIFICA | VALOR DE EJEMPLO |
| Sección * | Código de la sección. Máximo 12 caracteres. | ECADM |
| Descripción sección * | Nombre de la sección. | Administración EC |
| Estado * | Solo las secciones abiertas se pueden usar. | Abierto |
| Referencia sección / Tercero / Dirección | Datos opcionales para enlazar la sección con un código externo o un tercero. | (vacío) |
[/TABLA]
*  Campo obligatorio: sin él no deja guardar.
1 	Abre la ruta: se muestra la ficha de la sección 0 «General».
2 	Pulsa «Añadir sección › Nuevo», escribe ECADM y «Administración EC» y pulsa «Guardar».
3 	Abre el proyecto EC1 (Proyectos › Proyectos, segundo registro).
4 	En «Sección» borra el 0, escribe EC y elige ECADM. Debajo aparece «Administración EC».
5 	Pulsa el disquete: sale «Éxito».
[TABLA]
| [IMG:parametrizacion-019.jpg] |
| Figura 18   Alta de la sección ECADM «Administración EC» con estado Abierto. |
[/TABLA]
[TABLA]
| [IMG:parametrizacion-020.jpg] |
| Figura 19   En el proyecto EC1, el campo Sección ya encuentra ECADM. El botón «+» de esa lista permite crear una sección sin salir del proyecto. |
[/TABLA]
[TABLA]
| [IMG:parametrizacion-021.jpg] |
| Figura 20   Resultado: proyecto EC1 «División 1 EC» con la sección ECADM «Administración EC». |
[/TABLA]
[TABLA]
| Δ | CAMBIO / Igual que en la versión antigua, la sección se puede crear desde su pantalla (Auxiliares › Secciones) o desde el propio proyecto, con el «+» de la lista del campo Sección. |
[/TABLA]
[TABLA]
| i | A TENER EN CUENTA / El bloque «Secciones autorizadas» del proyecto sirve para limitar qué secciones se pueden combinar con él al contabilizar. Si se deja vacío, el proyecto admite cualquier sección. |
[/TABLA]
[TABLA]
| ✓   QUÉ HAS CONSEGUIDO |
| ✓	Sección ECADM «Administración EC» creada y abierta. / ✓	Proyecto EC1 «División 1 EC» con la sección por defecto ECADM. / ✓	Datos creados en TUTORIAL en todo el tema: cuenta ES 62999.00000, grupo auxiliar ECEMP con EC0001, proyecto EC1 y sección ECADM. No se ha modificado ningún registro existente. |
[/TABLA]