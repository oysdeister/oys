# Lectura en contexto y en orden: Datos maestros y Contabilidad básica

Sección «maestros-contabilidad». Zona: volcados `01-maestros.md` y `02-icon-contabilidad.md`, `examenes/maestros.json`, `examenes/icon-contabilidad.json`, `glosario/maestros.json`, `glosario/icon-contabilidad.json` y las entradas `maestros` e `icon-contabilidad` de `portadaDatos.ts` y `etapas.ts`.

Ficheros tocados: `app/src/pages/portadaDatos.ts`, `app/src/content/maestros.json`, `app/src/content/icon-contabilidad.json` (solo bloques de los volcados 01 y 02) y `app/src/content/examenes/maestros.json`. `etapas.ts` y los glosarios no necesitaron cambios. Todo con Edit, cadena a cadena.

Comprobación: los tres JSON son válidos y `comprobar_estructura.py` da 0 errores estructurales y 0 avisos. El volcado regenerado está en `scratchpad/volcado-mc/`.

## La primera frase de Maestros (antes y después literal)

- **Antes** (`portadaDatos.ts`, `maestros.frase`): «La empresa: la ficha que usan todos los documentos. Si está mal, el error se arrastra a cada pedido, factura y asiento. Lees una y creas la tuya.»
- **Después**: «Los datos maestros son las fichas básicas que usan todos los documentos: la empresa, los terceros, los artículos, los bancos… Si una está mal, el error se arrastra a cada pedido, factura y asiento. Este módulo empieza por la primera de todas, la empresa: lees la ficha de una y creas la tuya.»

## Módulo 1 Datos maestros

### Página del módulo

| Dónde | Qué falla | Por qué | Antes → después (resumido) | Estado |
|---|---|---|---|---|
| Frase de la portada (`portadaDatos`) | Sin verbo y no dice qué es «Datos maestros» | Criterio 1: la primera frase dice qué es y para qué sirve | «La empresa: la ficha…» → «Los datos maestros son las fichas básicas… Este módulo empieza por la empresa…» | corregido |
| Lo básico › «Qué son los datos básicos» · paraQueSirve | Enumera maestros que este módulo no trata y no enlaza con la empresa | Criterio 2: falta una frase puente | Se añade: «Este módulo empieza por la empresa; cada uno de los demás maestros se da de alta en el módulo que lo usa.» | corregido |
| Ídem · explicacion 1 | «En esta sesión… del ERP Deister Manager» | Resto de otro contexto y nombre de producto distinto | → «En todo el curso trabajas en la base de pruebas TUTORIAL de Axional. En cada bloque das de alta registros propios…» | corregido |
| Ídem · explicacion 19 | «Si nunca has trabajado con contabilidad…» salía entre el rótulo «Tabla de referencia» y la tabla | Rompe el rótulo y la tabla que anuncia | Se sube a explicacion 2, justo después de la presentación; el rótulo queda pegado a su tabla | corregido |
| Ídem · tabla de códigos (explicacion 3-15) | Remitía a bloques de Contabilidad, Compras, Ventas y Cartera como si fueran inmediatos. S{INI}, lo único de este módulo, salía el último | Criterio 3: nada antes de tiempo; orden lógico | Ahora va en orden de creación (S/TS primero). El rótulo dice «En este módulo solo creas los dos primeros; el resto llega en los módulos siguientes» y cada fila dice «Lo crearás en…» | corregido |
| Ídem · rótulo «Tabla de referencia» | No decía que la tabla es de consulta ni que casi todo es de módulos posteriores | Criterio 3 | → «Debajo tienes la tabla de referencia… Casi todos los usarás en módulos posteriores; tenla como consulta, no hace falta abrirlos ahora.» | corregido |
| Lo básico › «Cómo moverte por el ERP» | La misma lista salía en explicacion y en los pasos (modo lista/QBE, campos con lista, pestañas y botones) y repetía Fundamentos › «Moverse por el ERP» | Criterio 5: listas duplicadas y repetición | paraQueSirve: «lo que este módulo añade a lo que ya viste en Fundamentos». explicacion 1 remite a Fundamentos; 2 explica por qué hay campos con lista; 3 presenta «Validar»; 4 aviso de obligatorio. Los pasos quedan como acciones, sin repetir la explicación | corregido |
| Ídem · aviso | Ejemplo «Descripción = RODAMIENTO*»: artículo que se crea en Compras | Criterio 3 | → «por ejemplo por su código con tus iniciales» | corregido |
| Título del módulo (`maestros.json`) | El título es «Mantenimiento de tablas maestras», el nombre corto es «Datos maestros» y el módulo solo trata la empresa | Criterio 4 | No tocado: cambiar el título del módulo es decisión de alcance | duda |
| `resumen`/`circuito` del JSON | El tercer paso del circuito JSON dice «Empresa lista para facturar», pero el resumen dice que para facturar faltan tipologías | Criterio 4 | No tocado: no sale en el volcado de la página y no sé dónde se pinta | duda |

### Bloque 1 «Consultar la ficha de la empresa»

| Dónde | Qué falla | Por qué | Antes → después | Estado |
|---|---|---|---|---|
| Parte «Moverte por Axional» · paraQueSirve | Vuelve a definir ERP y repite Fundamentos y la página del módulo | Criterio 5 | → «Es un repaso rápido de cómo llegar a la ficha de la empresa con las tres herramientas que viste en Fundamentos…» | corregido |
| Partes 2 y 4 · pasos | «Mira el primer bloque, «Datos»», «Baja al bloque «Datos fiscales»»… | «Bloque» es la unidad del curso; aquí es un grupo de campos | → «sección «Datos»», «sección «Datos fiscales»», «sección «Datos auxiliares / Datos contables»» | corregido |
| Parte «Leer los datos contables» · explicacion 5 | «El plan contable es lo primero que se define…» quedaba suelta al final, después de las divisas | Criterio 2 | Se sube a explicacion 2, detrás de la definición del plan: «…sin él no se puede contabilizar» | corregido |

### Bloque 2 «Crear una empresa»

| Dónde | Qué falla | Por qué | Antes → después | Estado |
|---|---|---|---|---|
| Parte «Crear el tercero» · aviso | «No uses tu cliente C{INI} ni tu proveedor T{INI}»: aún no existen | Criterio 3 | → «No uses como tercero de la empresa un cliente ni un proveedor, tampoco los C{INI} y T{INI} que crearás más adelante…» | corregido |
| Parte «Dar de alta la empresa» · explicacion 3 | «no uses tu cliente ni tu proveedor» | Criterio 3 | → «no uses un cliente ni un proveedor» | corregido |
| Partes 2 y 4 · paso y campos | «En el bloque Datos», «Va en el bloque «Datos cuenta bancaria»», «(bloque «Información complementaria»)»… (7 sitios) | «Bloque» por grupo de campos | → «sección …» | corregido |
| Examen de Maestros | «Si usaras tu cliente o tu proveedor» | Criterio 3 | → «un cliente o un proveedor» | corregido |
| `glosario/maestros.json` | Muchos términos y ejemplos de Compras y Contabilidad (stock, almacén, ROD{INI}, C{INI}) | El glosario es de consulta, no de lectura en orden | No tocado | duda (alcance) |

## Módulo 2 Contabilidad básica

### Página del módulo

| Dónde | Qué falla | Por qué | Antes → después | Estado |
|---|---|---|---|---|
| Frase de la portada | No decía qué es la contabilidad básica. Prometía «los asientos de las facturas», que ahora están en Compras | Criterios 1 y 4 | → «La contabilidad básica es anotar cada operación de la empresa en sus cuentas con asientos. En este módulo preparas… y escribes, contabilizas y consultas tus propios asientos manuales.» | corregido |
| `aprendes` y recorrido (`portadaDatos`) | «Contabilizar y corregir facturas» y la pieza «Facturas» no están en el módulo. Faltaban los datos básicos (C/P/R) | Criterio 4 | El tercer «aprendes» pasa a «Duplicar y corregir asientos…». La pieza «Facturas» pasa a ser «Datos básicos» (C{INI} · P{INI} · R{INI}), colocada después del plan de cuentas. «mayor» pasa a «extracto» | corregido |
| `resumen` JSON | «ves los asientos de las facturas y su corrección» | Criterio 4 | → «…corriges y consultas asientos manuales. Los asientos de las facturas los verás en Compras.» | corregido |
| Lo básico › «Cómo moverte por el ERP» | El título promete navegación, pero empezaba con teoría contable. Repetía Fundamentos y Maestros. Crear y guardar salían dos veces (explicacion y pasos). Los códigos de ejemplo eran solo de la ampliación | Criterios 4 y 5 | paraQueSirve nuevo. Primero lo propio de las pantallas (remisión, lista y filtro, dos caminos para crear y para guardar, campos con lista, obligatorios, códigos C/P/diario, base compartida). Después qué se monta. El repaso contable va al final, marcado «Repaso de una línea». Paso 2 sin repetir | corregido |
| Ídem · color del botón | Aquí el botón es «azul oscuro «Añadir …»» y en Maestros es «rojo» | Contradicción entre módulos | No tocado | duda |

### Etapa «El plan de cuentas»

| Dónde | Qué falla | Por qué | Antes → después | Estado |
|---|---|---|---|---|
| B1 «Consultar el plan contable» · concepto | «España usa el plan PGE 2008…» suelta al final del párrafo del debe y el haber | Criterio 2 | Se lleva a la definición del plan: «…de un país; España usa el PGE 2008, con el código ES.» | corregido |
| B1 · parte «Cuentas contables» · paso 2 | Repite «La pantalla se abre en modo consulta», que ya dice el paso 1 | Criterio 5 | → «En el campo Cuenta escribe 10200*…» | corregido |
| B1 · paso 3 | «En el bloque «Información general»» | Grupo de campos | → «sección» | corregido |
| B2 «Entender los mnemotécnicos» · concepto | La frase de cierre («Con plan contable… ya se puede parametrizar») iba entre los dos ejemplos. Además usaba C{INI}, que se crea después | Criterios 2 y 3 | La frase de cierre va al final, antes de «Dónde:». «…tu cliente C{INI}, que crearás más adelante en este módulo, es la 43000.00901» | corregido |
| B3 «Dar de alta una cuenta contable» · concepto | Volvía a definir el plan contable y sus cuatro planes, como en B1 | Criterio 5 | → «La crearás en el plan español «PGE 2008» (código ES), que viste en «Consultar el plan contable y sus cuentas»…» | corregido |
| B3 · concepto | «Después, en «Dar de alta un mnemotécnico propio», enlazas…», pero es un bloque opcional del final | Criterio 3 | → «Si haces la ampliación «Dar de alta un mnemotécnico propio», enlazarás…» | corregido |
| B3 · explicacion 1-2 | Mismas instrucciones que los pasos 1-2 (629*, «Ejecutar consulta», el asterisco) | Criterio 5 | → «…las 629 del mismo grupo.» / «Así no tienes que decidir cada indicador: tu cuenta copiará el modelo de sus vecinas.» | corregido |

### Etapa «Datos básicos que usarás después» (B5)

| Dónde | Qué falla | Por qué | Antes → después | Estado |
|---|---|---|---|---|
| Parte «Terceros» · explicacion 4 | «después, en Gestión, darás de alta este mismo tercero» no dice ni módulo ni bloque | Criterio 3 | → «más adelante, en Compras (bloque «Dar de alta los datos básicos de gestión»), … como cliente de gestión» | corregido |
| Parte «Crear el plazo de pago» · explicacion 4 | Remite a un bloque de otro módulo sin nombrar el módulo | Criterio 3 | → «Lo harás más adelante, en Compras, bloque…» | corregido |
| Partes 1, 4, 5 y 7 · pasos | «bloque «Más datos»», «Distribución de plazos», «Información general», «Domiciliaciones», «Riesgo», «Tesorería», «Clasificación», «Información auxiliar» (10 sitios) | Grupo de campos | → «sección …» | corregido |

### Etapa «Diario, periodos y plantillas»

| Dónde | Qué falla | Por qué | Antes → después | Estado |
|---|---|---|---|---|
| B6 «Crear un diario» · concepto | «El diario DA Cierre y apertura…» huérfano dentro del ejemplo del caso | Criterio 2 | DA pasa al primer ejemplo, con los demás diarios de la demo | corregido |
| B6 · parte 1 · explicacion 5 | Repetía el aviso (crear desde el «+» del asiento) | Criterio 5 | → «En este bloque usas la fila en blanco… El otro camino lo tienes en el aviso.» | corregido |
| B6 · parte 2 | «se explican en la línea siguiente»; «Debajo del objeto «Asientos»» | Referencia de maquetación y jerga | → «justificante, ejercicio y periodo se explican a continuación»; «En el menú, junto a la pantalla «Asientos»…» | corregido |
| B6 · parte 2 · paso 2 | «Lo harás en el bloque siguiente», pero el siguiente es «Conocer el diario…» | Criterio 3: remite a otro bloque | → «Lo harás en el bloque «Crear un asiento manual», al empezar la fase Operar.» | corregido |
| B7 «Conocer el diario…» · concepto | Última frase huérfana («Además hay procesos masivos…») | Criterio 2 | → «Por último, verás dónde están los procesos masivos, que cambian de una vez muchos apuntes ya hechos.» | corregido |
| B7 · parte «plantillas» · explicacion 5-6 | «Como viste en Parametrización», que es un bloque opcional posterior. «la documentación pone» es voz de manual y repite los destinos | Criterios 3 y 5 | → «Las hojas destino, las pestañas de abajo del Excel, son…» / «Por dentro, la plantilla de factura de compra lee la cabecera, los vencimientos y las líneas…» | corregido |
| B7 · parte «procesos masivos» · explicacion 3 | Lo de la IA (punteo P y permiso) salía en la explicacion y otra vez en el aviso | Criterio 5 | → «También tiene una variante con IA, que explica el aviso de esta parte.» | corregido |
| B7 · paso | «el bloque «Periodos contables (12)»» | Grupo de campos | → «sección» | corregido |

### Etapa «Escribir un asiento»

| Dónde | Qué falla | Por qué | Antes → después | Estado |
|---|---|---|---|---|
| B8 «Crear un asiento manual» · parte 1 · explicacion 1-2 | Mismo contenido que los pasos 1 y 5 («pulsas Nuevo», «número 6 y Provisional») | Criterio 5 | → «La cabecera es la parte de arriba…: la rellenas y la guardas antes de añadir ninguna línea.» / «…el ERP da al asiento el siguiente número libre…» | corregido |
| B8 · paso 3 · detalle | «la sección siguiente lo explica» | «Sección» ahora es grupo de campos; hay que nombrar la parte | → «lo explica la parte siguiente, «Crear el numerador de justificantes {INI}»» | corregido |
| B8 · numerador · paso 4 | «el error típico del aviso de abajo», pero en Guiado el aviso no está debajo | Criterio 5 | → «que describe el aviso de esta parte» | corregido |
| B8 · pasos | «con los bloques Identificación…», «Baja al bloque Debe/Haber» | Grupo de campos | → «secciones» | corregido |
| B9 «Comprobar el cuadre» · aviso | Tercera vez que se dice que «Finalizar» desaparece (ya en el concepto y en la explicacion) | Criterio 5 | → «Si con las dos líneas el Cuadre sigue sin ser 0, revisa los importes…» | corregido |
| B9 · concepto, explicacion, paso, problema y aprendido | «bloque Totales» | Grupo de campos | → «sección Totales» | corregido |
| B11 «Crear un segundo asiento» · explicacion 1-2 | Repetían el detalle del paso 1 | Criterio 5 | → «Cada asiento nuevo se empieza desde la lista…» / «Después repites lo que hiciste en «Crear un asiento manual»…» | corregido |

### Etapa «Contabilizar, copiar y corregir»

| Dónde | Qué falla | Por qué | Antes → después | Estado |
|---|---|---|---|---|
| B12 «Contabilizar un asiento» · parte 1 · pasos 1 y 3 | Los detalles repetían las explicacion 1-4 | Criterio 5 | Paso 1: solo «Si no ves «Finalizar»…». Paso 3: «No lo pulses ahora: lo usarás en «Corregir los importes de un asiento».» | corregido |
| B12 · parte 2 · explicacion 1 | Repetía el aviso (contabiliza también lo de otros) | Criterio 5 | → para qué sirve el proceso (muchos provisionales de una vez) | corregido |
| B12 · parte 2 · paso 1 | «es el segundo bloque del formulario» | Grupo de campos | → «la segunda sección» | corregido |
| B12 · parte 3 · explicacion 4 | «comprueba en cejercic» (nombre de tabla) | Errores recurrentes: sin nombres de tabla | → «en «Ejercicios contables»» | corregido |
| B14 «Programar copias periódicas» · explicacion 1 | Misma lista que el detalle del paso 3 | Criterio 5 | → por qué las copias de 2027 empiezan en 1 | corregido |
| B15 «Corregir los importes» · explicacion 1-2 | Instrucciones de los pasos | Criterio 5 | → por qué se guarda línea a línea y por qué hay que recargar | corregido |
| B15 · aviso | «En el bloque del extracto» | Nombre de bloque impreciso | → «En el bloque «Consultar el extracto de una cuenta»» | corregido |
| B15 · paso 2 | «En el bloque Debe/Haber» | Grupo de campos | → «sección» | corregido |
| B15 · parte «Repasar los datos» · paso 1 | El detalle copiaba literalmente el del numerador (B8) | Criterio 5 | → «Si alguno de tus asientos salió con justificante «0»… lo explica la parte «Crear el numerador…»» | corregido |

### Etapa «Consultar»

| Dónde | Qué falla | Por qué | Antes → después | Estado |
|---|---|---|---|---|
| B16 «Detectar descuadres» · paso 1 | El detalle repetía la explicacion 1 (lista del menú Integridad) | Criterio 5 | → «Es el informe que cruza los apuntes de la contabilidad con el registro de impuestos.» | corregido |
| B18 «Consultar el extracto» · explicacion 1-3 | Repetían el ejemplo del concepto y los pasos 2-3 (tres apuntes y saldo 1.000 › 2.000 › 3.500) | Criterio 5 | → tabla ancha, cómo reconocer los apuntes propios y qué significa el saldo de la última fila | corregido |
| B19 «Consultar sumas y saldos» · explicacion 2-3 | El mismo ejemplo del periodo 11 salía tres veces (concepto, explicacion y paso 3) | Criterio 5 | → «Cada fila es una cuenta en un periodo…» / «Como filtras por el ejercicio 2026, las copias de 2027 no salen aquí.» | corregido |

### Etapa «Para saber más» (opcional)

| Dónde | Qué falla | Por qué | Antes → después | Estado |
|---|---|---|---|---|
| B20 «Cargar las tablas de Finanzas» · concepto | «unos maestros necesitan que otros existan antes» dos veces seguidas. Decía «la sección» | Criterio 5 | → «Fíjate: el orden completo lo ves en la parte «Cargar los maestros en orden».» | corregido |
| B20 · parte 3 · aviso «Truco» | Repetía la explicacion 5 | Criterio 5 | → «si al rellenar un campo su lista sale vacía, falta dar de alta antes ese otro maestro» | corregido |
| B21 «Crear un grupo auxiliar» · explicacion 2 | Repetía el paso 2 | Criterio 5 | → «El grupo nace vacío: sus códigos los añades en la parte siguiente.» | corregido |
| B21 · parte 2 · pasos | «los dos bloques vacíos», «En el bloque «Códigos auxiliares»» | Grupo de campos | → «secciones» | corregido |
| B22 «Asignar un grupo auxiliar» · explicacion 2 | Repetía el aviso y el paso 4 | Criterio 5 | → «La asignación se ve desde los dos lados…» | corregido |
| B22 · paso 2 y aviso | «bloque Identificación», «El bloque «Listado de cuentas contables»» | Grupo de campos | → «sección» | corregido |
| B23 «Crear un proyecto» · explicacion 3 | Repetía el paso 1 | Criterio 5 | → «partes del proyecto 0 «GENERAL»…: tu proyecto copia su estado y su sección por defecto» | corregido |
| B24 «Crear una sección» · aviso | «El bloque «Secciones autorizadas»» | Grupo de campos | → «La sección» | corregido |
| B25 «Distinguir Finanzas sola o integrada» · concepto | Volvía a definir «diario» (ya visto en B6) | Criterio 5 | → «En los dos escenarios, cada asiento va al diario de su tipo de operación…» | corregido |
| B25 · explicacion 4 | Ruta con «/» | Norma de rutas con › | → «Finanzas › Facturación › Compras › Fact. de compras» | corregido |
| B25 · aviso | DV/DC por tercera vez | Criterio 5 | → «Para saber a qué diario fue un asiento, mira la columna Diario…» | corregido |
| B26 «Registrar los saldos iniciales» · concepto | Activo, pasivo y neto sin explicar | Criterio 3: término sin explicar | → «las de activo, lo que la empresa tiene (…), al Debe; las de pasivo y neto, lo que debe y lo que es de los socios (…), al Haber» | corregido |
| B26 · aviso | «la 62999.00000 de Contabilidad básica», cuando ya estás en ese módulo | Resto de otro contexto | → «tu 62999.00000 si hiciste «Asignar un grupo auxiliar a una cuenta»» | corregido |
| B26 · paso 1 | «con los bloques Identificación…» | Grupo de campos | → «secciones» | corregido |
| B27 «Dar de alta un mnemotécnico propio» · concepto | Repetía la definición de B2. «que diste de alta en Contabilidad básica» (ya estás en ese módulo). El objetivo promete {INI}626, pero el concepto no lo anunciaba | Criterios 3, 4 y 5 | Abre con la remisión a B2 («consultaste los que ya existen; aquí creas los tuyos»), cita «Dar de alta una cuenta contable» y añade el {INI}626 para Tesorería | corregido |
| B27 · parte 2 · explicacion 1 | Repetía el paso 1 | Criterio 5 | → dónde está el enlace a la cuenta (pestaña de detalle) | corregido |
| B28 · título | «Tipo de asiento y plantillas de contabilización: dónde se configuran» lleva dos puntos y no va en infinitivo | Norma de títulos | → «Localizar el tipo de asiento y las plantillas» (el id no cambia) | corregido |
| B28 · paso 2 | «(o tu FC{INI})»: FC{INI} se crea en Compras | Criterio 3 | → «Abre la tipología FC… Tu FC{INI} la crearás después, en Compras.» | corregido |

## Dudas funcionales (no tocadas)

1. **Plantillas o tipo de asiento**: B7, B20 y B25 dicen que las plantillas de contabilización (XLS) son las que contabilizan los documentos («hace falta la plantilla en la tipología»). B28 dice que la factura contabiliza por el tipo de asiento de la tipología y que las plantillas son «otro mecanismo» de las integraciones. Las dos versiones chocan. Lo debe decidir alguien que conozca el ERP.
2. **Notas «{INI} Ejercicio 2 entrada de asientos» y «{INI} Ejercicio 5 segundo asiento»** (13 apariciones entre pasos, campos y checklist): usan la numeración antigua, en la que «ejercicio» era el bloque, y se confunde con el ejercicio contable. Es un dato que el alumno teclea y que sale en las capturas: no lo he cambiado.
3. **Color del botón de alta**: «rojo» en Maestros y «azul oscuro» en Contabilidad.
4. **Preguntas «De memoria»** que dicen «bloque «Datos fiscales»», «bloque «Información general»» o «bloque Debe/Haber»: no se tocan (`pregunta`), así que no coinciden con el texto del paso, que ahora dice «sección».
5. **Examen de Contabilidad**: dos preguntas hablan de «serie», «máscara de número» y «#d» de numeradores de documentos, pero el módulo enseña «Rotura» y «Numerador» de justificantes. Otra pregunta dice que los periodos «se copian del ejercicio anterior», y eso no aparece en ningún bloque.
6. **Referencias al caso sin ubicar**: «la comisión de 10,00 que apuntas a mano» (B3) y «los grabarás en el caso final (operación 1, 01-10-2026)» (B8 y B11) no dicen en qué módulo o bloque ocurre.
7. **Título del módulo 1** («Mantenimiento de tablas maestras» frente a «Datos maestros») y **circuito del JSON de Maestros** («Empresa lista para facturar»).
8. **Glosario de Maestros**: términos y ejemplos de Compras y Contabilidad. Es un tema de alcance.

## Recuento

- Hallazgos: 78 filas en las tablas (cada fila agrupa los sitios iguales de un mismo bloque).
- Corregidos: 74 filas. Son unas 110 cadenas editadas: 4 en `portadaDatos.ts`, unas 25 en `maestros.json`, unas 80 en `icon-contabilidad.json` y 1 en el examen de Maestros. Se cambió «bloque» por «sección» en unos 35 sitios donde nombraba un grupo de campos.
- Dudas funcionales no tocadas: 8 grupos (arriba). Cuatro de ellas también figuran como filas «duda» en las tablas: título del módulo, circuito del JSON, glosario y color del botón.
- Estructura: 0 errores con `comprobar_estructura.py`. No cambia ningún id, número de elementos, campo, hotspot ni respuesta.

## Tres ejemplos de antes y después

1. **Primera frase sin verbo** (Maestros, portada). «La empresa: la ficha que usan todos los documentos. […] Lees una y creas la tuya.» → «Los datos maestros son las fichas básicas que usan todos los documentos: la empresa, los terceros, los artículos, los bancos… […] Este módulo empieza por la primera de todas, la empresa: lees la ficha de una y creas la tuya.»
2. **Remisión a lo que aún no se ha hecho** (Contabilidad, B6, último paso). «Pulsa «Nuevo» para empezar un asiento.» · «Lo harás en el bloque siguiente.» (el siguiente es «Conocer el diario…») → «Lo harás en el bloque «Crear un asiento manual», al empezar la fase Operar.»
3. **Misma idea tres veces seguidas** (Contabilidad, B19). Concepto, explicacion 2 y paso 3 repetían «periodo 11: 57200 Haber 2.800, 62900 Debe 300…». La explicacion pasa a decir qué es cada fila y por qué no salen las copias de 2027: «Cada fila es una cuenta en un periodo, con lo que sumó al Debe y al Haber ese mes.» / «Como filtras por el ejercicio 2026, las copias de enero y febrero de 2027 no salen aquí.»
