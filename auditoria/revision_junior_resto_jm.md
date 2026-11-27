# Revisión como junior: Fundamentos, Maestros, Contabilidad, Cartera, Tesorería, Impuestos, Activos y Contabilidad avanzada

Alumno simulado: junior sin contabilidad y sin experiencia en ERP. He leído los JSON en el orden real de `etapas.ts` e `index.ts` (0 Fundamentos → 1 Maestros → 2 Contabilidad básica → [3 Compras, 4 Ventas: no evaluados] → 5 Cartera → 6 Tesorería → 7 Impuestos → 8 Activos → 9 Contabilidad avanzada). No he evaluado ni ventas.json ni los bloques compras-workflow*.

Organización: módulo → bloque (id) → atasco → qué necesitaría. **BLOQUEANTE** = no puedo seguir; **MOLESTO** = sigo, pero con dudas o perdiendo tiempo. Los «tipos» son: 1 término sin explicar · 2 paso que da algo por sabido · 3 pantalla o botón no presentado · 4 dato de origen desconocido · 5 salto de orden · 6 referencia rota · 7 contradicción · 8 test no enseñado.

## 0. Comprobaciones automáticas (todos los módulos revisados)

- **Ids de bloque en etapas.ts**: existen todos. Los bloques movidos (icon-contabilidad-v-1…4 → Compras, asientos-14 → Tesorería) se resuelven con `MOVIDOS` en index.ts. No hay bloques huérfanos.
- **Vídeos**: todas las claves de `MOMENTOS_*` apuntan a una sección o ejercicio que existe, y todas las series y capítulos referenciados existen y tienen URL. No hay enlaces de vídeo rotos.
- **Referencias «bloque «…»» entre bloques**: todos los títulos de bloque citados existen. Pero la palabra «bloque» se usa a la vez para el ejercicio del curso y para el grupo de campos del formulario del ERP («bloque «Datos fiscales»», «bloque «Información auxiliar»», «bloque «Parámetros inmovilizado»»…: 40 citas en Maestros, Contabilidad, Cartera, Tesorería y Activos). [MOLESTO] **Necesitaría:** llamar «grupo de campos» o «sección del formulario» a los del ERP, o avisar una vez en Fundamentos: «En el ERP, un bloque es un grupo de campos dentro de la ficha; en el curso, un bloque es un ejercicio».
- **{INI}**: aparece 938 veces. La regla de longitud (3 caracteres en P y R, 4 en tipologías, usar 2 letras si tienes 3) solo se da en `maestros-nav-datos`; Fundamentos presenta {INI} sin decir cuántas letras ni si van en mayúsculas.

## 1. Fundamentos (fundamentos.json)

### fundamentos-nav-curso / fundamentos-navegar — Moverse por el ERP
- [MOLESTO] tipo 7: la etapa se llama «Antes de abrir el ERP» (fundamentos-1 y fundamentos-2), pero va **después** de «Moverse por el ERP», donde ya has abierto el ERP. **Necesitaría:** renombrarla «Conceptos que usarás en el ERP» o ponerla primero.
- [MOLESTO] (concepto) tipo 7: «Usarás la base de pruebas BBDD TUTORIAL» / «las operaciones del curso se graban en la empresa 0 … de la demo» / nav-curso: «la practicas en el ERP de práctica y en la demo real». No sé si BBDD TUTORIAL, la demo y el ERP de práctica son el mismo sitio. **Necesitaría:** «La demo es el ERP real, con la base BBDD TUTORIAL. El “ERP de práctica” es el simulador de esta web, donde no grabas nada».
- [MOLESTO] (fundamentos-navegar-entrar / EXP) tipo 2: «Entras con la dirección que te dé tu responsable y con tu usuario». No hay ninguna URL. Si estudio solo, no puedo empezar. **Necesitaría:** la dirección de la demo (o «la tienes en el correo de bienvenida») y a quién pedir el usuario.
- [MOLESTO] (concepto) tipo 1: «S{INI} no tiene tipologías ni configuración»: «tipología» no se explica hasta Compras. **Necesitaría:** «Una tipología es el tipo de documento (pedido, factura…) con su numeración y su comportamiento».
- [MOLESTO] (concepto) tipo 4: {INI} sin regla de formato. **Necesitaría:** «{INI} = tus iniciales en MAYÚSCULAS, 2 o 3 letras (p. ej. JMA). Algunos códigos admiten pocos caracteres: lo verás en Maestros».

### fundamentos-1 — Entender la contabilidad desde cero
- [MOLESTO] (fundamentos-1-contabilidad / EXP) tipo 4: «13,50 € de gastos del banco (3,50 + 10,00)». No se dice qué son los 10,00. **Necesitaría:** «3,50 de comisión por la transferencia y 10,00 de comisión de mantenimiento de la cuenta».
- [MOLESTO] tipo 7: aquí la venta es de «200,00 €» y en fundamentos-2 de «242,00 €». **Necesitaría:** «Vendes por 200,00 € + 21 % de IVA = 242,00 € que cobra el cliente».
- [MOLESTO] (fundamentos-1-iva / EXP) tipo 7: el IVA repercutido va a la «47000.00000, «Hacienda Pública, deudora por IVA»». «Deudora» choca con «se lo debes a Hacienda». **Necesitaría:** «En la demo se usa esa cuenta por configuración, aunque su nombre diga “deudora”; para ti es lo que debes a Hacienda».
- [MOLESTO] (fundamentos-1-debe-haber) tipo 1: «Capital social» se usa sin explicar (la 100 solo se lista después). **Necesitaría:** «Capital social: el dinero que los socios ponen para crear la empresa».

### fundamentos-2 — Entender el circuito de una factura y el cierre
- [MOLESTO] (fundamentos-2-efecto) tipo 4: los vencimientos «14-11-2026 y 14-12-2026» no tienen fecha de factura de la que partir. **Necesitaría:** «La factura de venta es del 15-10-2026: 30 y 60 días después».
- [MOLESTO] (fundamentos-2-contabilizar) tipo 1: «También crea el efecto de pago y el registro fiscal»: «registro fiscal» no se explica (se ve en Impuestos). **Necesitaría:** «el registro fiscal es la línea del libro de IVA que luego se declara».
- [MOLESTO] (fundamentos-2-mapa) tipo 4: «tu banco de trabajo BBVA_{INI}» no dice dónde se crea (en Cartera), y en Maestros crearás otro banco, CAIXA{INI}. **Necesitaría:** «BBVA_{INI} lo crearás en Cartera; en Maestros crearás CAIXA{INI} solo para aprender».
- Examen: la pregunta 10 (cuenta 129) y la 8 (asiento de cobro 572/430) no se han enseñado (ver Exámenes).

## 2. Maestros (maestros.json)

### maestros-nav-datos / maestros-nav-moverse (cabecera)
- [MOLESTO] tipo 7: «A{INI}, F{INI} y PV{INI} — … Se crean en Ventas, al empezar cada bloque de Operar», pero etapas.ts dice que Ventas › Configurar «creas tu juego único de seis tipologías». **Necesitaría:** actualizar la tabla de códigos con las seis tipologías de venta y el bloque de Configurar donde se crean.
- [MOLESTO] tipo 1: «El modo consulta (QBE)»: QBE sin explicar. **Necesitaría:** quitar «QBE» o decir «(consulta por ejemplo: rellenas lo que sabes y el ERP busca)».
- [MOLESTO] tipo 7: «pulsa el botón rojo «Añadir …»». En Contabilidad es «azul oscuro». **Necesitaría:** no citar el color.

### maestros-v-3 — Consultar la ficha de la empresa
- [MOLESTO] (concepto) tipo 7: «Los módulos Impuestos y Activos fijos consultan datos de ejemplo de la demo de los vídeos … «Triathlon [ALA] S.L.»», pero el mismo bloque dice que en TUTORIAL solo hay 0 y DIS. No sé si ALA existe en mi base. **Necesitaría:** «ALA no está en tu base TUTORIAL: en esos bloques miras las capturas o el vídeo y practicas en la empresa 0» (ver los bloqueantes de Impuestos y Activos).

### maestros-v-4 — Crear una empresa
- [MOLESTO] (concepto/resumen) tipo 7: «lo mínimo para facturar, cobrar y pagar», pero luego «S{INI} solo sirve para practicar su alta, sus saldos iniciales y su cierre». **Necesitaría:** cambiar el objetivo por «lo mínimo que necesita una empresa para existir en el ERP».
- [MOLESTO] (maestros-v-4-tercero / P2) tipo 2: «elige la Categoría que tenga el tercero 0 … míralo en la lista». No se dice en qué columna ni pantalla. **Necesitaría:** el valor de la categoría o «abre el tercero 0 y copia su Categoría (pestaña Más datos)».
- [MOLESTO] (maestros-v-4-tercero / P2) tipo 1/3: «Si al guardar se crea sola una relación contable» y «Ver registro»: ni la relación contable ni el botón se han presentado. **Necesitaría:** «Una relación contable une el tercero a sus cuentas (lo verás en Contabilidad). «Ver registro» abre la ficha recién creada».
- [MOLESTO] (maestros-v-4-banco-propio / P2) tipo 1/5: «Escribe 0 en Proyecto y Sección (no los usamos)». Proyecto y sección solo se explican en Contabilidad › Para saber más (parametrizacion-5 y 6). **Necesitaría:** «Proyecto y sección sirven para repartir costes por proyecto o departamento; aquí pon 0 (ninguno)».
- [MOLESTO] (maestros-v-4-banco-propio / CAMPO Banco) tipo 4: «Elígelo de la lista (en la captura, ES0019)». No sé cuál elegir. **Necesitaría:** «Elige ES0019 o cualquier banco: es solo para practicar».
- Examen: las preguntas 1 (banco o caja, «Tipo de cuenta») y 7 (explicación con la 570) usan contenido no enseñado en Maestros.


## 3. Contabilidad básica (icon-contabilidad.json; incluye maestros-v-1/2 y maestros-1, que se muestran aquí)

### parametrizacion-nav — Cómo moverte por el ERP (cabecera del módulo)
- [MOLESTO] (parametrizacion-nav / EXP «Para crear un registro») tipo 7: «pulsa el botón azul oscuro «Añadir …» arriba a la derecha» → en Maestros se decía «botón rojo «Añadir …»»; no sé de qué color es. **Necesitaría:** Un solo color (o decir «el botón «Añadir …» de arriba a la derecha», sin color) en todo el curso.
- [MOLESTO] (parametrizacion-nav / EXP «El alta se guarda») tipo 7: ««Guardar», abajo a la derecha» → en Fundamentos el guardar era el disquete de arriba a la derecha; no queda claro cuándo se usa cada uno. **Necesitaría:** Una frase: «en una ventana de alta, «Guardar» abajo; en una ficha ya creada, el disquete de arriba».
- [MOLESTO] (parametrizacion-nav / EXP «Ejemplo: pagas 100 €») tipo 1: «Anotas Debe 62900 Otros servicios 100 € / Haber 57200 Bancos 100 €» → códigos de 5 cifras sin punto, cuando Fundamentos decía «60000.00000». **Necesitaría:** «En el ERP las cuentas llevan punto y 5 cifras más (57200.00000); aquí escribimos solo la parte de la izquierda».
- [MOLESTO] (parametrizacion-nav / EXP «Las capturas llevan») tipo 4: «Las capturas llevan las iniciales del autor del manual (EC)» → no sé quién es EC ni por qué verá sus registros. **Necesitaría:** «EC son las iniciales de quien hizo el curso; sus registros están en la base compartida y no se tocan».

### maestros-v-1 — Consultar el plan contable y sus cuentas
- [MOLESTO] (maestros-v-1-cuentas-contables / EXP «Activa y Activar») tipo 7: «(la V no es una opción que necesites ahora)» → luego en «Dar de alta los datos básicos» tengo que escribir «Activa IEV», que lleva V. **Necesitaría:** Explicar I, E y V (impuestos, efectos, vencimientos…) o quitar la frase de la V.
- [MOLESTO] (maestros-v-1-cuentas-contables / EXP «Posición») tipo 7: «no decide por sí solo el lado de tus asientos» → después otro bloque dice «Un gasto va al Debe» como regla de la Posición. **Necesitaría:** Una sola definición: «Posición es el lado donde la cuenta suele acumular saldo; para escribir el asiento mira la regla de Fundamentos».
- [MOLESTO] (maestros-v-1-cuentas-contables / P4) tipo 1: «Periodificable tiene tres opciones: No, Periodificación… y Distribución» → no sé qué es periodificar hasta dos bloques después. **Necesitaría:** Un ejemplo en una línea (seguro anual repartido por meses) aquí mismo.
- [MOLESTO] (maestros-v-1-cuentas-contables / PROB) tipo 3: «escribe ccuentas en el buscador del menú» → «ccuentas» es un código técnico nunca presentado. **Necesitaría:** «Cada pantalla tiene un código técnico (ccuentas); se ve bajo el nombre en el buscador».

### maestros-v-2 — Entender los mnemotécnicos de cuentas
- [MOLESTO] (TEST 3) tipo 8: «¿Qué tipo de usuario utiliza normalmente los mnemotécnicos?» → el texto nunca habla de tipos de usuario ni de «no contable». **Necesitaría:** Añadir en el concepto: «Los mnemotécnicos los usa quien no es contable, para no conocer el plan».
- [MOLESTO] (maestros-v-2-concepto / CAMPO) tipo 7: «Nemotécnico» y «Mnemotécnico» → la pantalla pone «Nemotécnico» y el curso «mnemotécnico»; creo que son dos cosas. **Necesitaría:** «En pantalla sale escrito «Nemotécnico» (sin m); es lo mismo».
- [MOLESTO] (maestros-v-2-uso / EXP) tipo 4: «62300 para compras y 70500 para ventas» → no sé qué cuenta es la 62300 ni por qué ese artículo la usa. **Necesitaría:** «62300 es un gasto de servicios profesionales; 70500, un ingreso por prestación de servicios».
- [MOLESTO] (CONCEPTO) tipo 4: «La subcuenta propia de tu cliente C{INI}, la 43000.00901… se indica en la ficha del cliente» → el 00901 sale de la nada. **Necesitaría:** «00901 es un número libre que eliges tú en el bloque de datos básicos».

### parametrizacion-1 — Dar de alta una cuenta contable
- [BLOQUEANTE] (parametrizacion-1-cuenta / P5, P9) tipo 4: «La última fila, 62999.00000 «Gastos varios EC Administración», la creó el autor del manual.» → esa cuenta ya existe, así que ningún alumno puede crearla con el código que manda el paso. **Necesitaría:** Un código propio y único (por ejemplo 62999.{INI} o 62990.0000N) fijado desde el primer paso, y avisar de que todos los bloques siguientes usan ese.
- [BLOQUEANTE] (AVISO solución / P1 de «Modificar una cuenta») tipo 7: «Coge uno libre, por ejemplo 62999.00001. Úsalo también en los bloques «Modificar…»» → esos bloques (y Grupo auxiliar, Mnemotécnico propio, Saldos iniciales) dicen «abre la cuenta 62999.00000», que es la del autor; modificaría la cuenta de otra persona. **Necesitaría:** Sustituir 62999.00000 por «tu cuenta (la que creaste)» en todos los bloques posteriores.
- [MOLESTO] (parametrizacion-1-cuenta / CAMPO Activa) tipo 1: «C = costes, como el resto de la 629» → no sé qué hace «activar costes» ni por qué se pide analítica. **Necesitaría:** Una frase: «con C, al contabilizar el ERP pide proyecto y sección; los verás en Asientos».
- [MOLESTO] (PROB) tipo 7: «Plan contable, Cuenta, Descripción y Tipo son obligatorios» → la tabla marca con * también Posición, Estado, Grupo, Días máximos y Periodificable. **Necesitaría:** «Los que no rellenas tú vienen propuestos».
- [MOLESTO] (CONCEPTO) tipo 1: «Grupo * = … parte vinculada, para la memoria anual» → «parte vinculada» y «memoria anual» sin explicar. **Necesitaría:** «Déjalo en Standard; solo importa en grupos de empresas».

### parametrizacion-2 — Modificar una cuenta contable
- [BLOQUEANTE] (parametrizacion-2-descripcion / P1) tipo 4: «abre la cuenta 62999.00000 pulsando su número de fila» → es la cuenta del autor, no la mía (ver bloque anterior). **Necesitaría:** «Abre la cuenta que creaste antes (código propio)».
- [MOLESTO] (P1) tipo 3: «Si pulsas el código subrayado, sale un menú de pantallas relacionadas. Elige «Cuentas contables»» → no me han dicho cuándo conviene este camino. **Necesitaría:** Decir «usa el número de fila; el código subrayado solo si quieres saltar a otra pantalla».

### maestros-1 — Dar de alta los datos básicos de contabilidad
- [MOLESTO] (maestros-1-cuentas-perfil / EXP) tipo 7: «El código tras el punto identifica al tercero concreto: 43000.00901 es la cuenta de tu cliente C{INI}» → el 00901 no tiene relación con C{INI} y además es de otro alumno; confunde con la regla anterior de que va el código del tercero. **Necesitaría:** «Tras el punto va un número libre que eliges; aquí 00901, o el siguiente libre, y lo anotas».
- [MOLESTO] (maestros-1-cuentas-perfil / P3) tipo 4: «si 43000.00901 ya existe… usa otro número libre, como 43000.00902» → no sé cómo ver cuáles están libres ni qué hago con la validación de otros pasos que piden 00901. **Necesitaría:** «Filtra por 43000.009* y coge el siguiente libre; en los checks, usa el tuyo».
- [MOLESTO] (maestros-1-cuentas-perfil / P6) tipo 2: «Para que salga la lista, borra y reescribe el último dígito» → truco de pantalla sin explicar qué lista. **Necesitaría:** «El desplegable de cuentas solo se abre al teclear; borra el último número y vuelve a escribirlo».
- [MOLESTO] (maestros-1-tipos-efecto / P2) tipo 2: «En el bloque «Domiciliaciones» pulsa «Tercero» y escribe Días decalaje 2» → no sé si «Tercero» es un botón, una pestaña o un valor de lista. **Necesitaría:** «En Domiciliación bancaria elige «Tercero» en la lista; después escribe 2 en Días decalaje».
- [MOLESTO] (maestros-1-tipos-efecto / CAMPO) tipo 1: «Estado inicial = PE Pendiente»; «Fecha operación… emisión, vencimiento, ponderada» → «ponderada» y el estado PE no se explican. **Necesitaría:** «PE = Pendiente de cobro; ponderada = fecha media de varios vencimientos; déjalo en Vencimiento».
- [MOLESTO] (maestros-1-terceros / CAMPO Id. fiscal) tipo 4: «Id. fiscal B12345674 (de prueba)» → todos los alumnos usan el mismo NIF en una base compartida; no sé si el ERP rechazará el duplicado. **Necesitaría:** «Si sale «NIF duplicado», cambia el último dígito; solo importa que el formato sea válido».
- [MOLESTO] (maestros-1-plazos / P1) tipo 4: «el código admite como máximo 3 caracteres» → no recuerdo la regla de las 2 iniciales si las mías son 3 (P{INI} serían 4). **Necesitaría:** «Con 3 iniciales, usa solo las 2 primeras en este código (con JMA: PJM)».
- [MOLESTO] (maestros-1-municipios / CAMPO Código Postal) tipo 3: «Código Postal * … 08{INI}1 (de prueba)» → no veo para qué sirve crear un CP que no se usa más; letras en un CP. **Necesitaría:** «Es solo un ejercicio de alta; el CP real de tu dirección sigue siendo el 08001».

### asientos-1 — Crear un diario
- [MOLESTO] (asientos-1-diario / P2, PROB) tipo 4: «Si el código no cabe, el diario solo admite 2 caracteres» → mis iniciales son 3 letras y en todo el curso uso {INI} como diario, numerador y filtro; el límite aparece solo al fallar. **Necesitaría:** Decirlo antes del paso: «El diario lleva solo 2 letras; con 3 iniciales usa las 2 primeras y úsalas siempre en «Diario {INI}»».
- [MOLESTO] (asientos-1-diario / EXP) tipo 7: «en Finanzas › Contabilidad General › Diario contable › Diarios no está esta lista» → hay dos pantallas llamadas «Diarios» en rutas distintas. **Necesitaría:** «Ojo: «Diarios» del menú Maestros es la lista de diarios; «Diarios» de Diario contable son informes».
- [MOLESTO] (asientos-1 / PROB «Mi asiento no sale») tipo 5: «Busca por tu diario {INI} o por tu documento {INI}-DOC» → «documento {INI}-DOC» aún no existe; lo defino dos bloques después. **Necesitaría:** Quitar «documento» de esta ayuda o explicarlo.
- [MOLESTO] (asientos-1-pantalla / EXP) tipo 1: «justificante… dentro de su numerador» → «numerador» sin explicar aquí. **Necesitaría:** «El numerador es el contador que da número a cada asiento (lo creas en el bloque «Crear un asiento manual»)».
- [MOLESTO] (asientos-1-pantalla / EXP) tipo 3: «tres procesos: Contabilización, Descontabilización y Copia masiva» → nombrados sin dónde ni cuándo. **Necesitaría:** «Los usarás en «Contabilizar un asiento»; ahora no los abras».

### icon-contabilidad-1 — Conocer el diario, los periodos y las plantillas
- [MOLESTO] (icon-contabilidad-1-plantillas / EXP) tipo 6: «Como viste en Parametrización, las hojas destino son capuntes, cimpcont y cefectos» → no he visto nada de eso; solo aparece más abajo, en un bloque opcional. **Necesitaría:** Explicar capuntes/cimpcont/cefectos aquí o quitar el «como viste».
- [MOLESTO] (icon-contabilidad-1-procesos-masivos / P1-P4) tipo 1: «MODAUD», «AUDACEPTAR», «punteo P», «imp_cuadre = 0», «ctaper = 1» → siglas y campos técnicos sin explicar y que luego caen en el test. **Necesitaría:** Frase llana por cada una (qué es el permiso, qué es puntear, qué es ctaper) o quitar el test de memoria.
- [MOLESTO] (CHECK) tipo 2: «Abres un apunte y compruebas que tiene proyecto y sección»; «Consultas el Diario resumen» → ningún paso me manda hacerlo. **Necesitaría:** Pasos P para abrir un apunte y ejecutar el Diario resumen.
- [MOLESTO] (icon-contabilidad-1-configuracion / AVISO) tipo 7: «No pulses «Añadir ejercicio» ni «Añadir periodo»» → «Contabilizar un asiento» manda dar de alta ejercicios y periodos en la empresa 0. **Necesitaría:** Una regla única sobre quién crea el ejercicio 2027 de la empresa 0.
- [MOLESTO] (icon-contabilidad-1-plantillas / EXP) tipo 1: «Datos únicos estructurados», «Multilínea censado/indeterminado», «JavaNull» → vocabulario del programa sin traducir. **Necesitaría:** Decir «no hace falta entenderlo; solo localiza la hoja Origen y las pestañas destino».
- [MOLESTO] (icon-contabilidad-1-plantillas / P1) tipo 5: «ccomfach «Facturas de compra v2024 312»» → hablan de facturas de compra, módulo posterior. **Necesitaría:** «Es la plantilla de las facturas de compra, que verás en Compras».

### asientos-2 — Crear un asiento manual
- [MOLESTO] (asientos-2-lineas / CAMPO y P3) tipo 2: «Plan contable * = Lista de cuentas que puedes usar» → marcado obligatorio, pero ningún paso me dice qué elegir. **Necesitaría:** Un paso: «Plan contable: PGE 2008 (ES); suele venir puesto».
- [MOLESTO] (CONCEPTO) tipo 4: «Haber una cuenta de capital, del grupo 1, 3.000,00» → no sé qué cuenta es (10000, 10200…); en el bloque anterior vi 10200 y luego 10000. **Necesitaría:** «Capital social: 10000.00000» de forma única en todo el curso.
- [MOLESTO] (P4, CAMPO Notas) tipo 7: «{INI} Ejercicio 2 entrada de asientos» → «Ejercicio» aquí no es el año contable; confunde. **Necesitaría:** Cambiar el texto de Notas (p. ej. «{INI} Práctica 2 de asientos»).
- [MOLESTO] (asientos-2-cabecera / P3) tipo 5: «elige el numerador {INI}… Si aún no existe, créalo con el «+»… la sección siguiente lo explica» → me manda elegir algo que no existe todavía. **Necesitaría:** Mover el numerador antes de la cabecera, o decir en P3 «sáltate este campo y vuelve tras crear el numerador».
- [MOLESTO] (asientos-2-numerador / P4-P6) tipo 4: «las filas «Lotes de comunicación» (26)… tienen números… es el error típico» → descripción de capturas del autor mezclada con mis pasos; no sé si debo corregir algo mío. **Necesitaría:** Quitar P4/P5 si ya lo creé bien en P3, o decir «solo si tu justificante sale 0».
- [MOLESTO] (asientos-2-cabecera / P5, AVISO) tipo 4: «el asiento aparece… con el siguiente número libre (en las capturas, el 6)» → mi número será otro, pero tests y checks dicen «el 6», «el 7». **Necesitaría:** Sustituir «el 6» por «el asiento {INI}-DOC-001» en preguntas y comprobaciones.
- [MOLESTO] (asientos-2-numerador / CAMPO Rotura) tipo 1: «Rotura… MÁSCARA que decide cuándo vuelve a empezar el contador» → «rotura» sin ejemplo claro. **Necesitaría:** «Rotura = cuándo reinicia el contador: #e#yy = cada año y empresa».
- [MOLESTO] (CONCEPTO) tipo 4: «Los 3.000,00… los grabarás en el caso final (operación 1, con fecha 01-10-2026)» → aviso de un bloque que no está en este módulo. **Necesitaría:** «Más adelante, en el «Caso final», módulo 9».

### asientos-3 — Comprobar el cuadre
- [MOLESTO] (CONCEPTO / TEST 1) tipo 7: «Si no cuadra, no se puede guardar» (Fundamentos) frente a «Mientras el Cuadre no es 0, el botón «Finalizar» desaparece» → aquí puedo guardar una línea descuadrada y solo falla Finalizar. **Necesitaría:** Corregir Fundamentos: «no se puede contabilizar».
- [MOLESTO] (P2) tipo 3: «la barra muestra «Abrir a provisional»» → botón nombrado sin presentarlo. **Necesitaría:** «Lo verás en el bloque «Contabilizar un asiento»».
- [MOLESTO] (P1/P2) tipo 4: «CV-DOC-001», «asiento 7 (300,00)» → capturas con datos que no son los míos. **Necesitaría:** Una nota: «Las capturas son de otros asientos de práctica; los importes son los tuyos».

### asientos-4 — Añadir líneas a un asiento
- [MOLESTO] (TEST 1, CHECK) tipo 4: «¿Cuántas líneas tiene el asiento 6 al terminar este bloque?» → mi asiento no es el 6 (número automático en base compartida). **Necesitaría:** «el asiento {INI}-DOC-001».
- [MOLESTO] (P1) tipo 4: «cuenta 62903.00000 Correos y mensajería» → no se explica por qué ahora esta cuenta y no la mía. **Necesitaría:** «Usamos cuentas reales del plan (62902, 62903); tu cuenta de práctica se usa en otros bloques».

### asientos-5 — Crear un segundo asiento
- [MOLESTO] (P2) tipo 7: «Notas «{INI} Ejercicio 5 segundo asiento»» → «Ejercicio 5» no es un ejercicio contable. **Necesitaría:** Otra redacción de Notas.
- [MOLESTO] (TEST 2, 3 / CHECK) tipo 4: «¿Qué cuenta va al Debe en el asiento 7?» → mi asiento tendrá otro número. **Necesitaría:** «en el asiento {INI}-DOC-002».
- [MOLESTO] (CONCEPTO) tipo 5: «En el caso final, la aportación de 3.000,00 es otro asiento aparte» → remite a un caso que aún no he visto. **Necesitaría:** «(lo verás en el módulo 9)».

### asientos-6 — Contabilizar un asiento
- [BLOQUEANTE] (asientos-6-vigencia / EXP, AVISO solución) tipo 7: «Tiene ejercicios abiertos hasta 2026; en la captura ya aparece 2027»; «da de alta el ejercicio en… («Añadir ejercicio»)» → Maestros decía que la empresa 0 tiene ejercicios hasta 2027 y el bloque «Conocer el diario» prohíbe «Añadir ejercicio»; si falta 2027 no puedo hacer las copias de 2027 ni sé si debo crearlo. **Necesitaría:** «El ejercicio 2027 de la empresa 0 ya existe; compruébalo en cejercic. Si no sale, avisa a tu responsable; no lo crees tú».
- [MOLESTO] (asientos-6-proceso / P3) tipo 4: «ID. asiento 93, justificante CV26-000001, filtro Diario CV» → resultado de otro usuario en la captura. **Necesitaría:** Nota: «En tu pantalla saldrán tus datos».
- [MOLESTO] (asientos-6-vigencia / AVISO) tipo 1: «cperiodo_ins: Fechas del periodo fuera de rango de vigencia en empresa» → mensaje técnico sin traducir; «vigencia» sin definir hasta la sección. **Necesitaría:** «Significa que la fecha cae en un año o mes que la empresa no tiene creado».
- [MOLESTO] (P1/P2) tipo 4: «Abre tu asiento {INI}-DOC-002 (en las capturas, el 7)… La captura es del asiento 6» → alternan asientos y números de captura; cuesta saber cuál finalizo con botón y cuál con proceso. **Necesitaría:** Una línea: «El DOC-002 lo finalizas con el botón; el DOC-001 con el proceso, luego».

### asientos-11 — Duplicar un asiento
- [MOLESTO] (asientos-11-duplicar / P4, TEST 1) tipo 2: «puede salir Provisional o ya Contabilizada» → no me dicen qué hacer en cada caso, y asientos-12/13 dependen de ello. **Necesitaría:** «Si sale Provisional, déjalo así; en el bloque siguiente lo contabilizarás».
- [MOLESTO] (AVISO) tipo 1: «La copia lleva el justificante AC» → AC nunca explicado. **Necesitaría:** «AC es el justificante automático de los asientos copiados».
- [MOLESTO] (P4) tipo 1: «clasificación Manual» → columna no presentada. **Necesitaría:** «Manual = escrito a mano, no generado por una factura».
- [MOLESTO] (P1) tipo 4: ««Copiar asiento», el botón naranja de la barra superior» → colores distintos por bloque (morado en Finalizar). **Necesitaría:** Nombrar botones sin color.
- [MOLESTO] (CAMPO Copiar todo) tipo 1: «copia también los datos de cartera e impuestos» → cartera e impuestos sin contexto en este asiento. **Necesitaría:** «No afecta a tus asientos manuales; déjalo como está».

### asientos-12 — Programar copias periódicas
- [BLOQUEANTE] (asientos-12-copias / EXP y AVISO) tipo 7: «las copias de 2027 necesitan que exista el ejercicio 2027 de la empresa 0. Lo comprobaste en… «Contabilizar un asiento»» → ese bloque decía dos cosas opuestas (existe / «da de alta el ejercicio»); si no existe, no tengo permiso ni pasos para crearlo. **Necesitaría:** Confirmar que 2027 existe en la demo o dar pasos exactos si hay que pedirlo.
- [MOLESTO] (EXP) tipo 4: «asiento 9 de 2026… asientos 1 y 2 de 2027» → mis números serán otros. **Necesitaría:** Identificar por documento y fecha, no por número.
- [MOLESTO] (P5) tipo 2: «Si alguna copia está Provisional, contabilízala…» → decisión condicional sin cómo comprobar el estado de cada copia. **Necesitaría:** «Mira la columna Estado en la lista de asientos».
- [MOLESTO] (CONCEPTO) tipo 1: «La numeración de asientos empieza de nuevo cada año» → no sé por qué importa aquí. **Necesitaría:** Una frase de por qué (los asientos de 2027 tienen su propio contador).

### asientos-13 — Corregir los importes de un asiento
- [MOLESTO] (asientos-13-cambiar / P1) tipo 1: ««Abrir a provisional», el botón morado» → mezcla de colores. **Necesitaría:** Sin color.
- [MOLESTO] (P2-P3) tipo 3: «panel lateral… Cierra el panel con la X… «Recargar», la flecha circular» → botones nuevos con poca descripción. **Necesitaría:** Una captura o línea: «el panel se abre a la derecha; la X está arriba».
- [MOLESTO] (AVISO) tipo 5: «En el bloque del extracto verás este movimiento del 01-12-2026 con 1.500,00» → referencia adelante sin nombre. **Necesitaría:** «en «Consultar el extracto de una cuenta»».
- [MOLESTO] (asientos-13-resumen / P1) tipo 4: «EA26-000001 es el asiento 11 (EA-DOC-005)… del autor» → datos del autor que no puedo reproducir. **Necesitaría:** Quitar la referencia a EA.

### asientos-7 — Detectar descuadres tras contabilizar
- [MOLESTO] (CONCEPTO / EXP) tipo 7: «Con 47000 IVA repercutido (la cuenta de la demo; en el PGC es la 477)» → en Fundamentos la 47000 era «Hacienda Pública, deudora por IVA». **Necesitaría:** Un nombre único para la 47000 y explicar por qué no es la 477.
- [MOLESTO] (P1, P3, P4) tipo 6: «Descuadres General e impuestos» / «Descuadres contabilidad general-impuestos» / «Descuadres General -> Cartera por cuentas» → tres nombres para informes parecidos. **Necesitaría:** Los nombres exactos del menú y una lista.
- [MOLESTO] (EXP) tipo 3: «necesita la pestaña «Impuestos»» → pestaña del asiento que nunca he visto (solo vi «Líneas de apuntes» y «Saldos»). **Necesitaría:** «Es una pestaña del asiento que se usa en facturas; no la tocas aquí».
- [MOLESTO] (CONCEPTO) tipo 1: «IVA o IRPF… registro de impuestos» → IRPF y «registro» sin contexto. **Necesitaría:** «IRPF = retención sobre nóminas o profesionales».
- [MOLESTO] (P2) tipo 4: «Pon Empresa 0 y las fechas… de 01-11-2026 a 28-02-2027» → depende de haber seguido todo el módulo. **Necesitaría:** Decir de dónde sale esa fecha.

### asientos-8 — Consultar el listado de apuntes
- [MOLESTO] (ruta «Buscador › Líneas de asiento») tipo 6: «Buscador › Líneas de asiento» → no es una ruta de menú; no sé si está en el menú. **Necesitaría:** «Solo se abre con el buscador (capuntes)».
- [MOLESTO] (P2) tipo 3: «La lupa… «Ejecutar consulta»» → botón/lupa ya usados, pero «filtro queda como etiqueta» sin explicar. **Necesitaría:** «Las etiquetas muestran los filtros activos; puedes quitarlas».
- [MOLESTO] (P2) tipo 4: «EA-DOC-005, una prueba del autor» → dato ajeno. **Necesitaría:** Quitar referencia.

### asientos-9 — Consultar el extracto de una cuenta
- [MOLESTO] (asientos-9-mayor / P1) tipo 3: «Mayor de cuentas (en el buscador: capuntes_ext_cuenta_rep)» → código técnico larguísimo. **Necesitaría:** «Búscalo por «Mayor»».
- [MOLESTO] (P1 DET) tipo 3: «el campo Cuenta muestra «ES»… es normal» → no sé por qué «ES». **Necesitaría:** «ES es el código del plan; no lo borres».
- [MOLESTO] (P2) tipo 4: «El primer movimiento es el asiento 6» → mi número es otro, y los demás usuarios de la base añaden saldo. **Necesitaría:** «Reconoce tus filas por el documento {INI}-DOC».
- [MOLESTO] (TEST 2) tipo 8: «¿Qué saldo suman tus apuntes de la 62902.00000 en 2026? → 3.500,00» → solo coincide si otros no han usado la 62902 y si mi copia de diciembre está contabilizada. **Necesitaría:** Aclarar «cuenta solo tus apuntes» en la pregunta.

### asientos-10 — Consultar sumas y saldos
- [MOLESTO] (CONCEPTO «Ejemplo del caso») tipo 7: «el debe de tus cuentas sumará 3.242,00 (3.077,25 + 125,00 + 13,50 + 26,25)» → esa suma son saldos, no el Debe (el Debe solo del banco ya es 3.242). **Necesitaría:** «la suma de los saldos deudores será 3.242,00».
- [MOLESTO] (P3) tipo 4: «la 57200 del periodo 11 marca Haber 2.850… Debe 484,00… otras prácticas del curso» → cifras de otros alumnos; no sé si mi resultado es correcto. **Necesitaría:** «Si ves más, comprueba por documento».
- [MOLESTO] (TEST 2/3) tipo 8: «¿Cuánto suman al Haber de la 57200 tus asientos del periodo 11?» → depende de que DOC-003 esté Contabilizado, algo que el bloque anterior dejaba en el aire. **Necesitaría:** Una comprobación previa del estado.

### parametrizacion-icon-1 — Cargar las tablas de Finanzas en orden
- [MOLESTO] (parametrizacion-icon-1-vision-general / P3) tipo 6: «Lo practicas en Compras, en el bloque «Contabilizar una factura de compra»» → ese bloque no existe con ese título (hay «Registrar y contabilizar la factura» y «Contabilizar la factura»). **Necesitaría:** Poner el título real.
- [MOLESTO] (TEST 5) tipo 8: «Todo permiso necesita valores, aunque sea de tipo Verdadero/Falso» (distractor) → nunca se explican permisos de tipo Verdadero/Falso; la explicación lo da por sabido. **Necesitaría:** Dos frases sobre tipos de permiso.
- [MOLESTO] (CHECK 3, 4, 8, 9, 10, 11) tipo 2: «En cuentas contables, busca una cuenta de tercero y anota si se generó automáticamente» → no hay pasos para esos comprobantes. **Necesitaría:** Pasos P o quitar los CHECKs.
- [MOLESTO] (CONCEPTO) tipo 1: «unisociedad o multisociedad… consolidación… contabilidad de gestión»; «mandato SEPA»; «agrupación de permisos» → mucho vocabulario nuevo en una pantalla de solo mirar. **Necesitaría:** Mover a «Saber más» o poner un resumen de 1 línea por término.
- [MOLESTO] (TEST 3 explicación) tipo 8: «La empresa se da de alta antes como tercero» → frase confusa. **Necesitaría:** «Antes de crear la empresa debe existir su tercero».
- [MOLESTO] (P3 / EXP) tipo 3: «Finanzas › Facturación › Compras › Fact. de compras» → pantalla nueva sin presentar.

### parametrizacion-3 — Crear un grupo auxiliar
- [MOLESTO] (parametrizacion-3-grupo / CAMPO) tipo 4: «Grupo auxiliar * … 6 caracteres como máximo. (ej: {INI}EMP)» → con 3 iniciales llego justo a 6; no se dice qué hacer si mi {INI} fuera mayor. **Necesitaría:** «Con 3 iniciales ya llegas a 6».
- [MOLESTO] (parametrizacion-3-codigo / P1) tipo 4: «la captura… EC0001 y la cuenta 62999.00000» → captura del autor. **Necesitaría:** Nota «tu cuenta es otra».
- [MOLESTO] (CONCEPTO) tipo 4: «Ejemplo: con el grupo {INI}EMP en la cuenta 62999.00000, un gasto de José Gómez…» → «José Gómez» y {INI}0001 son inventados; no sé si es un empleado real. **Necesitaría:** «José Gómez es un nombre de ejemplo».

### parametrizacion-4 — Asignar un grupo auxiliar a una cuenta
- [BLOQUEANTE] (parametrizacion-4-asignar / P1) tipo 4: «Abre la ficha de la cuenta 62999.00000: en Cuentas contables filtra por 62999*» → la 62999.00000 es la del autor (ver parametrizacion-1). **Necesitaría:** «tu cuenta».
- [MOLESTO] (P2) tipo 3: «Grupo auxiliar (bloque Identificación, a la derecha de «Referencia cuenta»)» → «Referencia cuenta» nunca presentada. **Necesitaría:** Indicar dónde está el campo con otro punto de referencia.
- [MOLESTO] (TEST 4) tipo 8: «¿Qué grupos auxiliares ofrece la lista del campo en la demo, además del tuyo? → TERCER» → depende de otros alumnos. **Necesitaría:** Quitar la pregunta.

### parametrizacion-5 — Crear un proyecto
- [MOLESTO] (parametrizacion-5-proyecto / P1) tipo 4: «pulsa el número de fila 1 para abrir la ficha del proyecto 0 «GENERAL»» → no sé que la fila 1 sea la correcta con otros proyectos de alumnos. **Necesitaría:** «Busca la fila GENERAL por nombre».
- [MOLESTO] (CONCEPTO) tipo 1: «cuenta de costes… proyecto… sección» → ya definido, pero «Nuevo como» solo aparece dentro de una ficha (EXP) sin decir cómo se ve. **Necesitaría:** Una captura del botón.
- [MOLESTO] (P5) tipo 4: «EC1 ya tiene la sección ECADM» → datos del autor. **Necesitaría:** Nota.

### parametrizacion-6 — Crear una sección
- [MOLESTO] (parametrizacion-6-seccion / AVISO) tipo 4: «has creado… la cuenta ES 62999.00000, el grupo auxiliar {INI}EMP… No has tocado ningún registro de la demo que no sea tuyo» → contradice los bloques que me hicieron abrir la 62999.00000 del autor. **Necesitaría:** Corregir según el código único de la cuenta.
- [MOLESTO] (EXP) tipo 3: «botón «+» de la lista del campo Sección» → icono nuevo. **Necesitaría:** Descripción del botón.

### parametrizacion-icon-2 — Distinguir Finanzas sola o integrada
- [MOLESTO] (parametrizacion-icon-2-escenario-solo / EXP) tipo 1: «documentos de gestión (IGES)»; «workflow» → IGES sin explicar. **Necesitaría:** «IGES = módulo de gestión (compras, ventas, almacén)».
- [MOLESTO] (P3, EXP) tipo 7: «Facturas de compras» vs «Factura de compra» vs «Fact. de compras»; «Validada» vs «Validado» → nombres de pantalla y estado cambian. **Necesitaría:** Un nombre único.
- [MOLESTO] (P2/P4) tipo 6: «en el bloque «Contabilizar una factura de compra»»; «Crear facturas directas en Finanzas» → ninguno de los dos bloques existe con ese título en Compras. **Necesitaría:** Los títulos reales.
- [MOLESTO] (CHECK 7) tipo 2: «comprueba que un permiso de tipo Verdadero/Falso no tiene valores» → sin paso ni explicación previa. **Necesitaría:** Un paso o quitar el CHECK.
- [MOLESTO] (EXP) tipo 7: «hacen falta los valores defecto de usuario… la plantilla de contabilización en la tipología» → contradice el bloque siguiente («tipo de asiento»). **Necesitaría:** Decir qué mecanismo usa cada factura.

### contab-saldos-iniciales — Registrar los saldos iniciales de una empresa
- [MOLESTO] (OBJ / CONCEPTO) tipo 7: «5.000,00 € en el banco y 5.000,00 € de capital» → el caso del curso usa 3.000,00 de aportación; no sé si es lo mismo. **Necesitaría:** «Es un ejercicio aparte con otras cifras, solo en S{INI}».
- [MOLESTO] (contab-saldos-iniciales-cabecera / P2) tipo 2: «Deja el Diario en DG» → antes usaba mi diario {INI}; no sé por qué cambia. **Necesitaría:** Una frase de por qué.
- [MOLESTO] (AVISO) tipo 1: «El Justificante se rellena solo (AC)» → AC sin explicar. **Necesitaría:** «AC es el justificante automático».
- [MOLESTO] (CONCEPTO) tipo 6: «lo verás en «Cerrar el ejercicio de tu empresa»» → el título real es «Cerrar el ejercicio de tu empresa: regularizar y preparar el cierre», módulo posterior. **Necesitaría:** Título completo y «módulo 9».
- [MOLESTO] (AVISO problema) tipo 4: «(por ejemplo, la 62999.00000 de Contabilidad básica)» → cuenta con grupo auxiliar solo si hice el bloque opcional. **Necesitaría:** «si has hecho el bloque opcional».

### contab-mnemotecnicos-alta — Dar de alta un mnemotécnico propio
- [BLOQUEANTE] (OBJ / P5 / CAMPO) tipo 4: «enlazado a la cuenta 62999.00000» → es la del autor (ver parametrizacion-1). **Necesitaría:** «a tu cuenta».
- [MOLESTO] (CAMPO Nemotécnico) tipo 4: «En TUTORIAL tienen 5 cifras o letras. (ej: {INI}001)» → con 3 iniciales {INI}001 son 6; no sé si cabe. **Necesitaría:** «Con 3 iniciales, usa las 2 primeras».
- [MOLESTO] (P1, PROB) tipo 2: «ordenar la lista por Nemotécnico de mayor a menor» → no explica cómo ordenar. **Necesitaría:** «Clic en el título de la columna».
- [MOLESTO] (P3 DET) tipo 7: «Nemotécnico» frente a «mnemotécnico» (ver maestros-v-2). **Necesitaría:** Aclarar la ortografía de pantalla.

### contab-plantilla-alta — Tipo de asiento y plantillas de contabilización: dónde se configuran
- [BLOQUEANTE] (CONCEPTO / contab-plantilla-alta-localizar / EXP) tipo 7: «Aparte están las plantillas de contabilización… No las tocas en el día a día» y «La contabilización de tus facturas va por el tipo de asiento» → Fundamentos, «Conocer el diario» y «Distinguir Finanzas sola o integrada» dicen que la factura contabiliza con una plantilla indicada en la tipología. No sé qué debo revisar si una factura no contabiliza. **Necesitaría:** Una explicación única: «Factura de gestión = tipo de asiento (en la tipología); plantilla = integraciones y Finanzas sola», y alinear los demás bloques.
- [MOLESTO] (contab-plantilla-alta-tipologia / P2) tipo 5: «Abre la tipología FC (o tu FC{INI})» → mi FC{INI} se crea en Compras, módulo siguiente. **Necesitaría:** «Abre la FC de la demo; la tuya la verás en Compras».
- [MOLESTO] (CONCEPTO / CAMPO Importe) tipo 1: «-cabecera.imptot», «lineas.impnet» → fórmulas técnicas. **Necesitaría:** «imptot = total de la factura; impnet = neto sin IVA de la línea».
- [MOLESTO] (contab-plantilla-alta-localizar / CAMPO Modelo XLS) tipo 8: «Modelo XLS = Libro Excel… (ej: capuntes)» → capuntes es una hoja destino, no un modelo. **Necesitaría:** Corregir el ejemplo.
- [MOLESTO] (contab-plantilla-alta-localizar / EXP) tipo 1: «Sistema Excel» y «Sistema Clásico» → no sé la diferencia. **Necesitaría:** Una línea por sistema.
- [MOLESTO] (OBJ) tipo 5: «tipología de factura», «tipo de asiento» → conceptos de Compras antes de verlos. **Necesitaría:** «Verás Compras más adelante; aquí solo mira».

### Bloques sin etapa (fuera del recorrido del alumno)
- [MOLESTO] (asientos-14, icon-contabilidad-v-1, icon-contabilidad-v-2, icon-contabilidad-v-3) tipo 6: «BLOQUE asientos-14 en json pero no en etapas» → existen en el json pero el alumno no los ve; si algún texto los cita, no los encuentra. **Necesitaría:** Confirmar que nadie los cita o añadirlos a una etapa.


## 5. Cartera, cobros y pagos (carteras.json)

### Intro del módulo (nav-cartera / nav-contabilidad / nav-moverse)
- [MOLESTO] (carteras-nav-contabilidad) tipo 6: «Lo tienes explicado en Contabilidad básica, en «Para saber más»» → la etapa de Contabilidad básica se llama «Para saber más: parametrización completa»; no sé qué bloque buscar. **Necesitaría:** citar el título del bloque concreto de analítica.
- [MOLESTO] (carteras-nav-cartera) tipo 1: «PE pendiente, PR propuesto, OC ordenado, CO cobrado, PA pagado…» → los estados salen como siglas antes de saber qué es cada acción y no se dice que OC/OP se usan indistintamente (más adelante sale «OP Ordenado»). **Necesitaría:** una tabla única de estados con su sigla y un único código para «Ordenado».

### carteras-1 — Definir plazos de pago y tipos de efecto
- [MOLESTO] (carteras-1-tipo-efecto / CAMPO) tipo 7: «Admite 3 caracteres como máximo. (ej: CAR{INI})» → el ejemplo del campo es CAR{INI} (más de 3) y el paso usa E{INI}; además con iniciales de 3 letras E{INI} y V{INI} miden 4. **Necesitaría:** ejemplo E{INI} y repetir la regla «con 3 iniciales usa solo 2» también para E y V.
- [MOLESTO] (carteras-1-factura-compra / P6) tipo 4: «artículo S Servicios, precio 100» → mi artículo es FOR{INI}/ROD{INI}; no sé de dónde sale «S Servicios» ni si existe en la demo. **Necesitaría:** decir que «S Servicios» es un artículo ya existente de la demo (o usar FOR{INI}).
- [MOLESTO] (carteras-1-factura-compra / CAMPO Detalle) tipo 7: «La cuenta contable sale del artículo» → en Factura de venta se dice que la cuenta NO se propone sola. **Necesitaría:** aclarar si la cuenta se rellena sola en compra y no en venta, y por qué.
- [MOLESTO] (carteras-1-factura-compra / CAMPO Tipo de factura, P2) tipo 7: «FC Fact. compra» → Compras me hizo crear FC{INI} como tipología de factura de compra; aquí uso FC a secas y la pantalla es «Finanzas › Facturación › Compras», distinta de la de Compras. **Necesitaría:** explicar por qué hay dos pantallas de factura de compra y qué tipología elegir.
- [MOLESTO] (carteras-1-factura-compra / P5, P11) tipo 4: «FC026-000001» y «asiento 10 del diario DC» → números fijos que no tienen por qué coincidir con los míos en una demo compartida. **Necesitaría:** decir «el tuyo tendrá otro número; anótalo».
- [MOLESTO] (carteras-1-factura-compra / P11) tipo 6: «Lo del IVA, en el cuadro «En la demo / En una empresa real» de arriba» → no veo ningún cuadro con ese título (es un «Ojo»). **Necesitaría:** apuntar al texto «Ojo» de arriba.
- [MOLESTO] (CONCEPTO) tipo 4: «Aquí practicas con otro tercero, CAR{INI}» → CAR{INI} se da de alta con categoría 002 Proveedores y a la vez con relación Cliente; luego lo uso como cliente. **Necesitaría:** una línea que explique por qué un solo tercero hace de proveedor y cliente.

### carteras-3 — Dar de alta bancos propios y cajas
- [MOLESTO] (CONCEPTO / Ejemplo) tipo 5: «Su saldo final será 3.077,25» → cifra sin origen (capital, gastos de 10,00 y 3,50 aún no vistos); aparece en Contabilidad avanzada. **Necesitaría:** quitar la cifra o decir «esta cifra la entenderás en el caso final».
- [MOLESTO] (carteras-3-banco / CAMPO Preferencia / Formato extracto) tipo 5: «Formato extracto * … España AEB43» → extracto y AEB43 son de Tesorería, módulo posterior. **Necesitaría:** «déjalo como viene; lo entenderás en Tesorería».
- [MOLESTO] (carteras-3-caja / CAMPO Agrupación) tipo 7: «Usa el mismo que el banco. (ej: {INI})» → el ejemplo es {INI} y no AG{INI} como en el paso. **Necesitaría:** corregir a AG{INI}.
- [MOLESTO] (carteras-3-banco / CAMPO) tipo 7: «Tipo de cuenta» aparece dos veces en la tabla con valores distintos (IBAN/BBAN y Cuenta corriente). **Necesitaría:** unificar o renombrar el primero.

### icon-cartera-v-1 — Ver los efectos de una factura
- [MOLESTO] (icon-cartera-v-1-cartera / EXP vs P1) tipo 7: «La pestaña «Cartera de efectos» de la factura lleva a Finanzas › Cobros y Pagos › Movimientos» → el paso siguiente dice que en la demo no hay pestaña y se usa el desplegable «Cartera»; y el TEST y el CHECK preguntan por la pestaña. **Necesitaría:** describir solo el camino real de la demo y adaptar TEST/CHECK.
- [MOLESTO] (icon-cartera-v-1-cartera / ruta vs AVISO) tipo 7: «Finanzas › Cobros y Pagos › Movimientos» frente a «Finanzas › Cobros y Pagos › Cobros y Pagos» → dos nombres de menú para la misma pantalla. **Necesitaría:** dejar el nombre real de la demo y quitar el otro.
- [MOLESTO] (CONCEPTO / datos del vídeo) tipo 4: «empresa 125 … tercero 00041886 … USD … 440,70» → datos de otra base; solo uso mi FC026-000001 (en euros), así que no puedo comprobar nada de lo que se describe en la captura. **Necesitaría:** que todo el bloque use mi factura de tres efectos.
- [MOLESTO] (icon-cartera-v-1-vencimientos / P1) tipo 7: «Con un plazo de 90 días hay una sola» → mi factura tiene tres vencimientos. **Necesitaría:** enunciar el paso con mi caso (40/80/120).
- [MOLESTO] (icon-cartera-v-1-factura / CAMPO) tipo 7: «Forma pago … 090» frente a «Plazo pago» → misma cosa con otro nombre (se explica de pasada). **Necesitaría:** una nota fija «Forma pago = Plazo pago».

### icon-cartera-1 — Conocer los estados y tipos de efecto
- [MOLESTO] (icon-cartera-1-acciones / EXP) tipo 1: «plantilla Excel … hasta seis hojas, de capuntes10 a capuntes60 … actlog» → jerga técnica interna sin relación con lo que hago. **Necesitaría:** moverlo a un recuadro «Para quien administra» o quitarlo.
- [MOLESTO] (icon-cartera-1-vision / ruta, AVISO) tipo 7: «Movimientos» en la ruta y «En la demo … Cobros y Pagos › Cobros y Pagos» en el AVISO → no sé cuál abrir. **Necesitaría:** ruta única comprobada.
- [MOLESTO] (icon-cartera-1-vision / CAMPO) tipo 2: «Remesa = … (ej: )» → varios ejemplos vacíos; no sé qué debería ver. **Necesitaría:** rellenar los ejemplos con datos de mi cartera.
- [MOLESTO] (icon-cartera-1-acciones / P3) tipo 1: «CONBD, PAGD y PEFE» → CONBD sin explicar. **Necesitaría:** una frase sobre qué es CONBD.
- [MOLESTO] (CONCEPTO) tipo 4: «un pago directo llevaría el efecto de 151,25 de T{INI}» → el pago de T{INI} en el caso es por remesa, no directo. **Necesitaría:** decir «en tu caso lo pagarás por remesa; el pago directo es otra forma».
- [MOLESTO] (icon-cartera-1-estados / P1) tipo 3: «BQ Bloqueado» → estado nunca presentado antes. **Necesitaría:** una línea con su significado.

### carteras-5 — Cobrar efectos sueltos y en remesa
- [MOLESTO] (carteras-5-articulo) tipo 7: «Crear el artículo financiero ASE{INI}» → en Contabilidad básica ya creé FOR{INI} (Servicio, SOG, 62300/70500), igual que este. Se rompe «un código, una cosa». **Necesitaría:** reutilizar FOR{INI} o explicar por qué se crea otro.
- [MOLESTO] (carteras-5-factura-venta) tipo 3: «Finanzas › Facturación › Ventas › Factura de venta», tipo «FV» → en Ventas aprendí otra pantalla y la tipología F{INI}. No sé por qué hay dos. **Necesitaría:** explicar la diferencia entre la factura de Finanzas y la de Ventas y de dónde sale FV.
- [MOLESTO] (carteras-5-cobro-individual / CAMPO Perceptor) tipo 7: «Perceptor / Nombre = Tercero que paga» → en la factura de compra «Perceptor (quien cobra)». **Necesitaría:** aclarar que el perceptor es quien recibe el efecto en cada clase.
- [MOLESTO] (carteras-5-remesa / P1 y siguientes) tipo 4: «FVN026-000001», «FVN026-000002», «CA026-000001», «RM026-000001» → numeración fija; no sé de dónde sale la «RM026-000001 se queda vacía» ni si me saldrán los mismos números. **Necesitaría:** «tu número será otro» y quitar la referencia a RM026-000001.
- [MOLESTO] (CONCEPTO vs carteras-5-remesa / EXP «Ojo») tipo 7: «Al cobrar, entra el dinero en 57200… y sale la deuda de 43000» → el asiento de la remesa lleva 23000. **Necesitaría:** avisar ya en la introducción de la excepción.
- [MOLESTO] (carteras-5-remesa-banco / P4) tipo 2: «Si quieres probar los recibos domiciliados, repite con CSDDS» → es opcional, pero un bloque posterior da por hecho que CSDDS ya está en BBVA_{INI}. **Necesitaría:** decir que añadir CSDDS es necesario para «Domiciliar un cliente».
- [MOLESTO] (carteras-5-remesa-banco / P2) tipo 3: «En «Tipo de línea» pulsa «+»» → botón «+» y la ventana de alta no se explican. **Necesitaría:** un paso con los campos de ese alta.

### icon-cartera-v-2 — Pagar un efecto en efectivo
- [BLOQUEANTE] (icon-cartera-v-2-boton / P1) tipo 4: «Abre el efecto TF/PE en Finanzas › Cobros y Pagos › Movimientos» → no tengo ningún efecto TF/PE: los míos son E{INI}/PE y RC; el botón solo sale con TF+PE. No sé qué efecto abrir ni si debo gastar uno mío. **Necesitaría:** decir qué efecto usar en la demo (o crear una factura con tipo TF) y avisar si consume efectos del caso.
- [MOLESTO] (icon-cartera-v-2-boton / CAMPO) tipo 4: «Cuenta financiera … PRV00CRP», «Perceptor 00041886», «17-05-2023» → datos de otra base sin equivalente en la mía; «Fecha auxiliar (ej: )» vacío. **Necesitaría:** qué cuenta (BBVA_{INI} o CAJA_{INI}) elegir.
- [MOLESTO] (icon-cartera-v-2-resultado) tipo 1: «Pago, devolución» y «diferencia de cambio» → botón y concepto sin explicar antes. **Necesitaría:** una frase por cada uno.
- [MOLESTO] (CONCEPTO vs v-3) tipo 7: «base del vídeo, empresa 125 / en dólares» vs v-3 «empresa 001, sol peruano (PEN)» → dos vídeos con monedas y empresas distintas. **Necesitaría:** distinguir claramente «vídeo A» y «vídeo B».
- [MOLESTO] (CONCEPTO Ejemplo) tipo 4: «pagarías a T{INI} los 151,25 por remesa (lo verás en los bloques siguientes)» → ningún bloque siguiente hace ese pago con mis datos. **Necesitaría:** indicar dónde se hace el pago a T{INI}.

### icon-cartera-v-3 — Pagar efectos con una gestión
- [BLOQUEANTE] (icon-cartera-v-3-seleccion / P3) tipo 4: «Marca el efecto pendiente en la lista» y cabecera «Moneda USD» → PEFE solo vale para TF/PE y no tengo ningún efecto en dólares; mis efectos están en euros y son E{INI}, así que la lista saldrá vacía. **Necesitaría:** qué efecto concreto seleccionar y con qué moneda.
- [MOLESTO] (icon-cartera-v-3-cabecera / P1, ruta) tipo 7: «Gestiones sobre la cartera de efectos» → en la demo se llama «Gestiones sobre efectos» (ya usada en carteras-5). **Necesitaría:** un solo nombre.
- [MOLESTO] (icon-cartera-v-3-cabecera / P3) tipo 2: «Rellena empresa, fecha proceso, clase Pago, acción… y moneda USD» → no pide cuenta financiera, pero luego el error _02 dice que la acción la exige. **Necesitaría:** decir si hay que poner cuenta financiera y cuál.
- [MOLESTO] (icon-cartera-v-3-cabecera / P3) tipo 7: «clase Pago» → en Maestros y carteras-5 la clase es «Pagar». **Necesitaría:** unificar en «Pagar».
- [MOLESTO] (icon-cartera-v-3-cierre / AVISO) tipo 2: «Cierra la gestión con un solo efecto» → mi cartera tiene varios efectos de CAR{INI}. **Necesitaría:** cómo filtrar para que quede solo uno.

### icon-cartera-2 — Entender el cierre de una gestión
- [MOLESTO] (icon-cartera-2-cierre / EXP) tipo 1: «cefecges_estado_ava», «cefeacti.codast», «pcs_estado», «actlog … devuelve -2» → nombres internos de programación que no puedo relacionar con la pantalla. **Necesitaría:** reservarlos para un recuadro de consulta técnica.
- [MOLESTO] (TEST 3 vs icon-cartera-3-cuadre) tipo 8: «¿de dónde se restauran las deudas? → histórico del efecto» → en «Cuadrar la cartera» se dice que los valores previos están en el detalle de la gestión. **Necesitaría:** una sola respuesta coherente.
- [MOLESTO] (icon-cartera-2-cierre / P2) tipo 2: «Abre la acción de esa gestión en Relación de acciones» → no sé cómo llegar desde la gestión. **Necesitaría:** la ruta del menú.
- [MOLESTO] (icon-cartera-2-actualizacion / P1) tipo 4: «un efecto que hayas pagado en…» → si no pude pagar ninguno en los bloques anteriores, no tengo qué abrir. **Necesitaría:** un efecto de ejemplo con su número.
- [MOLESTO] (icon-cartera-2-cabecera / P1) tipo 4: «la gestión 0-14 de la demo» → mi gestión tendrá otro número. **Necesitaría:** «usa tu gestión de cobro».

### cartera-cobro-parcial — Cobrar solo una parte de un efecto
- [BLOQUEANTE] (cartera-cobro-parcial-gestion / EXP) tipo 4: «Usa un efecto de cobro en estado PE de CAR{INI}, por ejemplo el de 242,00 de tu factura de venta» → ese efecto y los dos de FVN026-000002 ya los cobré en carteras-5; no queda ninguno en PE. «Factura de nuevo» no dice con qué plazo ni importe. **Necesitaría:** pasos explícitos para una tercera factura de 242,00 con plazo 30D, o un aviso previo de reservar un efecto.
- [MOLESTO] (P4) tipo 2: «abre la gestión que sale la primera de la lista» → no sé en qué orden sale. **Necesitaría:** «la de estado Abierto con fecha de hoy».
- [MOLESTO] (P3 de cerrar / CAMPO Asiento) tipo 7: «43000.TCAPK» y «diario DG» frente a «43000.00000» de CAR{INI} y diario DC. **Necesitaría:** decir que mi línea llevará 43000.00000.
- [MOLESTO] (CAMPO Documento) tipo 4: «FVN026-000006 en la captura» → de otro alumno. **Necesitaría:** «tu número será otro».

### icon-cartera-v-4 — Comprobar los tipos de remesa de una cuenta
- [MOLESTO] (CONCEPTO) tipo 7: «Ya lo hiciste… con BBVA_{INI} y CSCTS» → CSCTS es de cobro; para pagar a T{INI} necesito PSCTT en BBVA_{INI} y nadie me dice que lo añada. **Necesitaría:** un paso «añade PSCTT a las Remesas por cuenta de BBVA_{INI}».
- [MOLESTO] (Dónde / P1) tipo 3: «Finanzas › Maestros › Parametrización › Empresas» → pantalla del maestro de empresas que no he usado como alumno de S{INI}. **Necesitaría:** indicar si es lo mismo que el alta de empresa de Maestros.
- [MOLESTO] (P3) tipo 4: «pagar el efecto de 1.815,00» → importe sin origen en este punto. **Necesitaría:** una línea previa.
- [MOLESTO] (CAMPO) tipo 7: «CSCTT» (con tesorería) frente a «CSCTS» de carteras-5. **Necesitaría:** recordar la diferencia S/T.

### icon-cartera-v-5 — Crear una remesa de pago
- [BLOQUEANTE] (icon-cartera-v-5-seleccion-efectos / P2) tipo 4: «Filtra por el tercero de la factura (en el vídeo, 00087)» y banco PRVCC0 → no sé si ese efecto de 1.815,00 existe en mi demo ni si debo usarlo; mi pago a T{INI} (151,25) con BBVA_{INI} nunca se explica y BBVA_{INI} no tiene PSCTT. **Necesitaría:** la lista de pasos con mis datos (T{INI}, BBVA_{INI}, PSCTT) o confirmar que 00087 existe en la demo.
- [MOLESTO] (CONCEPTO Ejemplo) tipo 4: «el 06-11 pagas a T{INI} los 151,25» → fecha sin origen; el caso final hablaba de 151,25 + 3,50 de comisión. **Necesitaría:** coherencia de importes y fechas con el caso.
- [MOLESTO] (agregar / EXP) tipo 7: «Relación de efectos remesados» → en carteras-5 se llamaba «Efectos seleccionados». **Necesitaría:** un solo nombre.
- [MOLESTO] (varios) tipo 4: «RM026-000012», «RM026-000018» → distintos números de remesa del vídeo. **Necesitaría:** no citarlos.
- [MOLESTO] (seleccion-efectos / EXP) tipo 2: «El tipo de efecto tiene que encajar» → mi tipo de efecto es E{INI}, no TF: no sé si encaja con PSCTT. **Necesitaría:** decir qué tipos admite PSCTT y si E{INI} vale.

### icon-cartera-v-6 — Evolucionar una remesa
- [MOLESTO] (icon-cartera-v-6-evolucionar / P1) tipo 4: «En la remesa RM026-000018» → no tengo esa remesa; no sé si evoluciono la mía o una del vídeo (compartida). **Necesitaría:** «tu remesa del bloque anterior».
- [MOLESTO] (CONCEPTO) tipo 7: «pasa a OP Ordenado» → hasta ahora «OC Ordenado». **Necesitaría:** unificar.
- [MOLESTO] (icon-cartera-v-6-asiento-tesoreria / ruta) tipo 5: «Finanzas › Tesorería › Ops. corto plazo» → pantalla de Tesorería, módulo posterior, sin presentar. **Necesitaría:** mencionar que es la pantalla de movimientos de tesorería.
- [MOLESTO] (P4) tipo 4: «fecha operación 25-07-2026» vs fecha remesa 23-06-2026. **Necesitaría:** explicar de dónde sale cada fecha.
- [MOLESTO] (CONCEPTO) tipo 4: «otra remesa de pago ya ordenada, de 1.524,60» → tercer importe de ejemplo (después de 1.815,00 y 8.080,15). **Necesitaría:** reducir los importes de ejemplo.

### icon-cartera-v-7 — Resolver un efecto que no se remesa
- [MOLESTO] (icon-cartera-v-7-domiciliacion / P1) tipo 2: «revisa los datos bancarios del tercero» → no dice cuándo ocurre el error ni cómo provocarlo; no puedo practicar nada. **Necesitaría:** un ejemplo reproducible o marcar el bloque como lectura.
- [MOLESTO] (Ejemplo) tipo 7: «el efecto de 151,25 a T{INI} es una transferencia (TF)» → en carteras-1 mi tipo de efecto era E{INI}, no TF. **Necesitaría:** aclarar que el pago a T{INI} usa TF.

### carteras-7 — Entender cómo pasan los efectos a tesorería
- [BLOQUEANTE] (carteras-7-remesa / EXP y P3) tipo 7: «Una remesa de tipo PSCTT … solo admite efectos de terceros con IBAN informado» → en carteras-1 puse el tipo E{INI} con domiciliación «No requiere … así no necesitas la cuenta bancaria del proveedor», y T{INI} no tiene IBAN en ningún bloque. No puedo pagar a T{INI}. **Necesitaría:** un paso que dé IBAN a T{INI} (el de ejemplo ES9121…) o quitar la exigencia.
- [MOLESTO] (Ejemplo / CAMPO) tipo 7: «BBVACCTRI», «BBVA c/c TRI 6805», «PRVCC0» → tres cuentas distintas de la base de formación. **Necesitaría:** un nombre único para la cuenta de capturas.
- [MOLESTO] (EXP) tipo 7: «En tu base TUTORIAL … En la base de formación de las capturas» → «base de formación» designa a la vez mi base TUTORIAL y la del vídeo. **Necesitaría:** nombres distintos para cada base.
- [MOLESTO] (CONCEPTO) tipo 6: «dos bloques de Tesorería y bancos: «Registrar un movimiento manual» y «Conciliar el banco»» → en icon-cartera-v-6 se citan otros tres. **Necesitaría:** la misma lista en ambos sitios.
- [MOLESTO] (P1) tipo 3: «Evolucionar estado … PTES «Pago a tesorería»» → distinto de la remesa; no sé cuándo usar cada uno. **Necesitaría:** un criterio.
- [MOLESTO] (Ejemplo) tipo 4: «remesa de 8.080,15 con proveedor 00003» → importe sin relación con mi caso.

### cartera-mandato-sepa — Domiciliar un cliente: mandato SEPA y remesa de cobro
- [BLOQUEANTE] (cartera-mandato-sepa-remesa / P2) tipo 2: «Rellena empresa 0, clase Cobrar, cuenta BBVA_{INI} y tipo CSDDS» → CSDDS solo sale si lo añadí en Remesas por cuenta de BBVA_{INI}, y en carteras-5 era opcional. Saldrá «Datos no disponibles». **Necesitaría:** un paso previo «añade CSDDS a BBVA_{INI}».
- [MOLESTO] (mandato / P6, Ojo) tipo 2: «Guardar (en la demo da error: está previsto)» → no puedo completar el paso por diseño; no sé si el resto depende del mandato. **Necesitaría:** decir que la remesa CSDDS funciona sin mandato guardado.
- [MOLESTO] (Ejemplo) tipo 4: «el efecto 2 de 121,00 de C{INI} se cobra el 14-12 con una remesa SEPA» → C{INI} no tiene IBAN ni mandato en ningún bloque. **Necesitaría:** un paso para dar IBAN a C{INI}.
- [MOLESTO] (factura / P3) tipo 2: «Los pasos de la línea son los de «Cobrar efectos…»» → sin importe ni plazo (en la captura 142,00). **Necesitaría:** importe y plazo concretos.
- [MOLESTO] (fichero / AVISO) tipo 6: «Ruta no comprobada … Búscala por su nombre» y botón «Soportes electrónicos 2025». **Necesitaría:** marcar el apartado como solo lectura o quitar la ruta dudosa.
- [MOLESTO] (CAMPO Cuenta) tipo 7: «43000.TCAPK» frente a 43000.00000. **Necesitaría:** decir que mi cuenta es 43000.00000.

### cartera-impagado-devolucion — Registrar un recibo devuelto (impagado)
- [MOLESTO] (asiento / P1-P4) tipo 7: la demo genera el asiento «al revés» y el bloque dice que lo compare y avise a contabilidad → no sé a quién avisar ni qué hacer si sale al revés. **Necesitaría:** «anótalo y sigue; no lo arregles».
- [MOLESTO] (gestion / P4) tipo 2: «abre la gestión que sale la primera de la lista» → orden desconocido. **Necesitaría:** «la última creada, estado Abierto».
- [MOLESTO] (asiento / CAMPO) tipo 4: «CA026-000004 (100,00, de otro cliente)». **Necesitaría:** no citar números ajenos.
- [MOLESTO] (efecto / CAMPO) tipo 4: «FVN026-000006» y «100,00 en la captura». **Necesitaría:** «tu importe será el tuyo».

### cartera-descuento — Descuento de efectos (concepto)
- [MOLESTO] (maestros / AVISO) tipo 6: «Ruta no comprobada: «Remesas › Maestros › Tipos remesas»» → no sé si el paso funciona. **Necesitaría:** ruta comprobada (en carteras-5 era Remesas › Maestros › Tipos remesas).
- [MOLESTO] (TEST 5) tipo 8: «¿Qué parte de este bloque se comprobó en la demo?» → pregunta sobre cómo se hizo el manual, no sobre contabilidad. **Necesitaría:** cambiarla por una de contenido.
- [MOLESTO] (acciones) tipo 1: «LCAC … tipo LE» y «letra de cambio» sin explicar qué es una letra. **Necesitaría:** una frase sobre la letra de cambio.

### icon-cartera-3 — Conocer los procesos avanzados de cartera (Para saber más)
- [MOLESTO] (anticipos / CAMPO) tipo 1: «numero1», «opeant», «camope», «pcs_seqori» → nombres internos. **Necesitaría:** quitarlos o moverlos a un recuadro técnico.
- [MOLESTO] (icon-cartera-3-cuadre) tipo 5: «31-12 para el cierre del año» → el cierre es un módulo posterior. **Necesitaría:** «lo verás en Cierre».
- [MOLESTO] (CONCEPTO) tipo 6: ««Conciliar un cobro y un anticipo» (Tesorería y bancos)» → el bloque existe pero es posterior; sin aviso. **Necesitaría:** «lo verás en el módulo de Tesorería».
- [MOLESTO] (varios CAMPO) tipo 2: «(ej: )» vacíos (numero1, Proceso invertido, Gestor, Cliente…). **Necesitaría:** ejemplos rellenos.


## 6. Tesorería (tesoreria.json; incluye asientos-14 e icon-cartera-v-8…11)

### tesoreria-nav — Presentación del módulo (Qué es la tesorería / Cómo moverte)
- [MOLESTO] (tesoreria-nav-vision / EXP ejemplo) tipo 4: «pagas una remesa de 8.080,15 €» → cifra de otra base que no es la de mi caso (151,25 / 3,50 / 10,00 / 3.077,25) y no se avisa aquí de que es ajena. **Necesitaría:** «Ejemplo con otra cifra; en tu caso será el pago de 151,25 a T{INI}».
- [MOLESTO] (tesoreria-nav-moverse / EXP) tipo 3: «Ops. corto plazo, Ops. medio plazo, Comprobación, Posición, Traspasos bancarios» → menciona pantallas y «Almacén ficheros» que nunca explica ni se usan después (salvo alguna); no sé cuáles me tocan. **Necesitaría:** una línea «En el caso solo usas: Bancos propios, Flujos, Operaciones, Ops. corto plazo, Extractos bancarios, Conciliación bancaria».

### tesoreria-1 — Preparar el banco propio
- [BLOQUEANTE] (tesoreria-1-comisiones / P3 y CAMPO Comisión) tipo 4: «Comisión = Código de la comisión bancaria. (ej: ADOP (código de la demo))» → piden elegir un código de comisión y no dicen cuál usar en mi caso ni dónde se crea el maestro «Comisiones» (Tesorería › Maestros › Comisiones), que nunca se presenta. **Necesitaría:** «Elige la comisión X (ya existe) o créala en Tesorería › Maestros › Comisiones con código/descripcion Y».
- [BLOQUEANTE] (tesoreria-1-comisiones / P3 y CHECK «Decide si la comisión va en un movimiento aparte») tipo 7: «Decide si la comisión va en un movimiento aparte» → el caso exige una línea de extracto de 3,50 separada de la de 151,25 («sus movimientos», bloque v-10) y Cartera solo crea el movimiento de -151,25, pero aquí el concepto dice «El banco te cargará 154,75 en total» y me deja elegir; no sé qué marcar. **Necesitaría:** «En tu caso deja «Operación comisión» vacía/rellénala con X» y qué movimiento(s) verás (154,75 en uno o 151,25 + 3,50).
- [MOLESTO] (tesoreria-1-comisiones / P2 y P5) tipo 4: «Elige la Posición» / «Rellena la Fecha inicio» → no dice si la comisión de mi caso es Debe o Haber ni qué fecha inicio poner (la captura usa 01-01-2000). **Necesitaría:** «Posición Haber; Fecha inicio 01-01-2026».
- [MOLESTO] (tesoreria-1-extracto / CHECK 2) tipo 7: «elige el Formato extracto de norma 43 (por ejemplo, BBVA AEB43)» → en Cartera se dejó el valor por defecto «España AEB43» y aquí el CAMPO dice «España AEB43»; no sé si debo cambiarlo. **Necesitaría:** «Deja España AEB43; no hay que cambiarlo».
- [MOLESTO] (tesoreria-1-extracto / EXP y P3) tipo 3: «Condiciones bancarias, Operaciones por cuenta, Sábados festivos y Liquidación» → pestañas nombradas sin explicar y que no se usan; «Operaciones por cuenta» podría ser necesaria para que BBVA_{INI} admita PMICDT/{INI}COM (parámetro «Relación cuenta y operación» del siguiente bloque) y no se dice. **Necesitaría:** «No necesitas rellenar ninguna pestaña salvo Comisiones» o indicar si hay que asociar operaciones a la cuenta.
- [MOLESTO] (tesoreria-1-extracto / CAMPO Fecha y Saldo extracto) tipo 4: «17-11-2026» y «-4.507,50» → cifras de la captura que no cuadran con mi caso (saldo final 3.077,25); el CHECK dice «vacíos o con datos del último» y duda. **Necesitaría:** «En tu BBVA_{INI} estarán vacíos hasta el final del módulo».

### tesoreria-2 — Configurar flujos, operaciones y parámetros
- [BLOQUEANTE] (tesoreria-2-flujo / P3, P4 y CHECK 1) tipo 4: «Elige el mnemotécnico de gastos bancarios» → no da el código; en la captura es ALMY→64420 y dice «elige uno que se traduzca a una 626», pero en el módulo de Contabilidad solo existe mi mnemotécnico {INI}001 (→62999), y no aparece aquí. **Necesitaría:** «Elige {INI}001 «Gastos de prueba {INI}» que creaste en «Dar de alta un mnemotécnico propio» (en la demo apunta a la 62999 en lugar de la 626)».
- [MOLESTO] (tesoreria-2-flujo / P2) tipo 4: «deja Posición «Ambos» o «Haber»» → doy a elegir entre dos valores sin decir cuál; y la Posición del flujo es Debe/Haber/Ambos mientras la de la operación es Entrada/Salida, sin explicar la correspondencia. **Necesitaría:** «Elige Ambos».
- [MOLESTO] (tesoreria-2-operacion / P3 y P4) tipo 4: «elige una del desplegable (en la captura, CAMT)» / «Interface … NOCAR» → Agrupación obligatoria sin valor concreto; la confundo con la agrupación AG{INI} de Contabilidad; además las capturas hablan de «Cash Pooling» y «Netting / Barrido» sin explicar. **Necesitaría:** «Agrupación: elige X (no es la AG{INI})».
- [MOLESTO] (tesoreria-2-conciliacion / ruta y P4) tipo 3: «Operaciones › Registro › {INI}COM › Parámetros conciliación» → la pestaña «Parámetros conciliación» no se ha presentado ni dice cómo llegar; «Al conciliar extracto» y «Al generar desde cartera» («Autorizar») se piden «revisar» sin decir qué valor dejar. **Necesitaría:** «Abre la operación y pulsa la pestaña «Parámetros conciliación»; deja Autorizar».
- [MOLESTO] (tesoreria-2-parametros / EXP) tipo 7: «Referencia: Documento: por número de operación» vs «por número de documento» en la EXP anterior → dos descripciones distintas del mismo criterio. **Necesitaría:** un único texto («número de documento del extracto»).
- [MOLESTO] (tesoreria-2-flujo / CAMPO) tipo 2: «Estado = Abierto (se puede usar)» → los pasos no dicen que hay que dejarlo en Abierto para poder usar el flujo en el siguiente bloque. **Necesitaría:** un paso «Deja Estado Abierto».

### tesoreria-3 — Registrar un movimiento manual
- [MOLESTO] (tesoreria-3-manual / P2) tipo 4: «Rellena la Fecha operación y la Fecha valor» → no da el valor; el 12-11 está solo en el concepto y sin año. **Necesitaría:** «Pon 12-11-2026 en las dos fechas».
- [MOLESTO] (tesoreria-3-manual / CAMPO Empresa y P1) tipo 4: «Empresa = La tuya (captura: 0, Deister Software)» → «tu empresa» puede ser S{INI}; BBVA_{INI} está en la empresa 0 y en otra no lo encontraré. **Necesitaría:** «Elige la empresa 0».
- [MOLESTO] (tesoreria-3-manual / P4) tipo 2: «¿La rejilla sale vacía con el aviso «Importes diferentes»? … Pulsa «Nuevo» en Flujos» → no sé si me saldrá el aviso ni si debo crear el flujo yo o lo propone la operación; la pestaña se llama «Flujos» y «Flujos de tesorería». **Necesitaría:** «Si la rejilla Flujos no trae {INI}COM, créalo con Nuevo, importe 10,00; pestaña Flujos de tesorería».
- [MOLESTO] (tesoreria-3-manual / CAMPO Validación y Auditado) tipo 3: «Validación … Auditado tesorería / contable» → casillas sin decir si hay que marcarlas antes de Contabilizar. **Necesitaría:** «No hace falta marcar Validación ni Auditado».
- [MOLESTO] (tesoreria-3-manual / P6 vs icon-cartera-v-8) tipo 7: «Pulsa «Contabilizar»» → aquí contabilizo antes de conciliar, pero v-8 dice «Contabilizar es siempre el último paso» y «No pases del extracto a contabilizar sin conciliar». **Necesitaría:** distinguir: movimiento manual se contabiliza al crearlo; el de remesa, tras conciliar.

### asientos-14 — Entender el asiento de un movimiento de banco
- [MOLESTO] (asientos-14 CONCEPTO / TEST 3) tipo 4: «40000.T{INI}» / «40100.00003» / «43000.00003» / «40000.00004» → formatos de cuentas de proveedor distintos (con {INI}, con 00003, con 00004) sin explicar la relación; en v-8/v-10 aparecen además 400, 401 y 10000.00027. **Necesitaría:** una nota: «40000.T{INI} es la subcuenta de tu proveedor; los otros códigos son de la base de Deister».
- [MOLESTO] (asientos-14-movimiento / EXP y P2) tipo 3: «otra base de datos, no TUTORIAL» / «CAP-TES-001» → capturas de bases que no puedo abrir; el TEST 3 pregunta por 40100.00003 (dato de captura, no mío). **Necesitaría:** «Solo mira la captura; en tu base verás tu movimiento de 10,00».
- [MOLESTO] (asientos-14-movimiento / P3) tipo 2: «escribe el asiento que esperas» → no da la solución para mi 10,00 (626 al Debe / 57200 al Haber) ni dónde escribirla, y la 626 no es la cuenta real de mi mnemotécnico {INI}001 (62999). **Necesitaría:** «Esperado: 62999 (tu flujo) 10,00 Debe / 57200 10,00 Haber».
- [MOLESTO] (asientos-14-comision / P1 y P2) tipo 7: «Baja a la vista «Comisiones»» → ahora «vista», antes «pestaña»; y el asiento «pago con comisión» no dice con qué flujo de comisión sale mi 3,50 (el flujo {INI}COM es de la de 10,00). **Necesitaría:** «Pestaña «Comisiones»; la de 3,50 usa el flujo Y».

### tesoreria-4 — Dar de alta el extracto bancario
- [BLOQUEANTE] (tesoreria-4-manual / P3) tipo 4: «Elige el concepto común 04 y un concepto propio de la lista» → no hay lista para mi banco: los conceptos propios son por banco (la captura muestra los de ES0019 Deutsche), BBVA_{INI} se creó sin Banco ni IBAN, y 04 es «giros, transferencias» (la captura de comisión usa 17). No puedo guardar el extracto. **Necesitaría:** «Concepto común 17 y concepto propio 900 (créalo antes en Conceptos propios para B{INI} con tipo conciliación Individual)» o uno ya existente.
- [BLOQUEANTE] (OBJ + tesoreria-4-manual / P4) tipo 4: «tiene seis líneas: la aportación de 3.000,00, el pago de 151,25 …» → solo se da de alta la de 10,00; faltan los pasos de las otras cinco (3.000, 151,25, 3,50, 121,00 ×2), y 3.000 es un asiento manual de Contabilidad sin movimiento de tesorería; así no puedo llegar al saldo 3.077,25. **Necesitaría:** tabla con las 6 líneas (fecha, concepto, importe, signo) y qué hacer con la de 3.000, o decir que el saldo 3.077,25 es solo referencia.
- [MOLESTO] (tesoreria-4-manual / EXP y P4) tipo 7: «Fíjate en el signo con que vienen los demás extractos de la cuenta» → BBVA_{INI} no tiene otros extractos; v-9 afirma que «en la demo TRI sale en negativo (ya lo viste en este bloque)» y no se vio. **Necesitaría:** «Escribe 10,00 en positivo (cargo)» sin remitir a otros extractos.
- [MOLESTO] (tesoreria-4-propios / CAMPO Operaciones a conciliar vs P6) tipo 7: «Déjalo como viene» / «Tú solo mira que existe» vs P6 «pulsa «Nuevo» y añade … la operación {INI}COM» → contradicción: ¿toco o no? **Necesitaría:** decidir y, si hay que añadirla, indicar los valores (Posición, Orden 1, Operación).
- [MOLESTO] (tesoreria-4-carga / CAMPO Registros y P5) tipo 4: «Registros = 5» → la captura cargó 2 extractos; no sé qué cuenta como «registro». Y «demo TRI», «CAPT_BCO» no se han presentado. **Necesitaría:** «Registros incluye cabecera y cierre» y una línea que defina «demo TRI».
- [MOLESTO] (tesoreria-4-extractos / EXP) tipo 7: «los dos son cargos y en esta base se escriben en positivo» vs «N43 … concepto propio 322, importe -42,35» y tesoreria-5 «-8.080,15» → signos distintos sin una regla única. **Necesitaría:** una tabla de signos al principio del bloque.
- [MOLESTO] (tesoreria-4-n43 / CAMPO Movimientos) tipo 1: «CCC1, CCC2» (en P2 manual) → siglas sin explicar. **Necesitaría:** «CCC = código cuenta cliente (nº de cuenta)».
- [MOLESTO] (tesoreria-4-comunes / P1) tipo 4: «Abre un concepto común, por ejemplo el 02» → CHECK me pide revisar el 02 pero nunca aclara si esa lista está en mi base compartida. **Necesitaría:** «Busca el 02 en la lista (existe en TUTORIAL)».

### tesoreria-5 — Conciliar el banco
- [BLOQUEANTE] (tesoreria-5-conciliar / P2 y CAMPO Importe extracto/tesorería) tipo 7: «Marca su movimiento de tesorería, del mismo importe» + «Importe extracto -8.080,15 / Importe tesorería -8.080,15» → en tesoreria-4 escribí el extracto en +10,00 y la tesorería sale -10,00; v-10 dice «mismo importe y signo contrario» y v-11 que con el signo cambiado «no casará». No sé si mi 10,00 y -10,00 casan ni qué signo debí poner. **Necesitaría:** «El extracto 10,00 (+) casa con la tesorería -10,00: la conciliación compara el importe sin signo» y corregir la captura.
- [BLOQUEANTE] (tesoreria-5-automatica / P1–P3 y CHECK 8) tipo 4: «Lanza la conciliación automática filtrando empresa, cuenta y concepto propio» → la captura es de «TRI / BBVACCTRI / 313»; mi BBVA_{INI} no tiene concepto propio ni integración, y mi único movimiento ya está conciliado a mano, así que no hay nada que probar; «tu empresa» (¿S{INI} o 0?). **Necesitaría:** «Solo mira la captura; en tu caso no se lanza» o datos para repetir la prueba (deshaz la conciliación y usa empresa 0 y concepto X).
- [MOLESTO] (tesoreria-5-conciliar y v-10) tipo 7: «Conciliar banco» (aquí) vs «Conciliar tesorería» (v-10, TEST «Conciliar tesorería»), y «Ejecutar consulta» vs «Ejecutar». **Necesitaría:** un único nombre de botón.
- [MOLESTO] (CONCEPTO / OBJ) tipo 4: «las seis líneas del extracto casan con sus movimientos» → los cobros de 121,00 salieron de remesa s/Tes y gestión COBD sin movimiento de tesorería, y la comisión 3,50 no existe en tesorería (Cartera solo creó -151,25); faltan los pasos con «Generar tesorería»/«Conciliar cartera» para esas líneas. **Necesitaría:** decir qué hacer con 3,50 y los dos 121,00 (o limitar el ejercicio a la línea de 10,00).
- [MOLESTO] (tesoreria-5-botones / CHECK 5 y 6) tipo 4: «Si en tu extracto hay un extorno … concílialo» / «localiza un efecto pendiente de tu empresa» → mi caso no tiene extornos ni efectos pendientes. **Necesitaría:** «Solo si lo ves; en tu caso no hay».
- [MOLESTO] (tesoreria-5-pantalla / P1) tipo 4: «Salen propuestas del 1 de enero a hoy» → hoy puede ser anterior a 12-11-2026 o no incluirla; no dice qué fechas. **Necesitaría:** «Pon 01-11-2026 a 31-12-2026».

### icon-cartera-v-8 — Conocer el circuito de extracto y conciliación
- [MOLESTO] (CONCEPTO / EXP) tipo 7: «401 al debe y 572 Bancos al haber» / «deuda del proveedor (400)» / «57900.00000 Fondos en movimiento» → 400 y 401 mezclados y cuenta del banco 57900 vs mi 57200. **Necesitaría:** «En tu caso: 40000.T{INI} al Debe, 57200 al Haber».
- [MOLESTO] (icon-cartera-v-8-circuito / EXP y AVISO) tipo 7: «Contabilizar es siempre el último paso» → contradice tesoreria-3, donde se contabiliza antes de conciliar. **Necesitaría:** matizar para remesas.
- [MOLESTO] (CONCEPTO) tipo 4: «PRVCC0», «base del vídeo» y «Registro de remesas» (Cartera) → términos de otra base no presentados en este módulo; la remesa de mi caso (151,25) ya se ordenó en Cartera y aquí no hay pasos para ella. **Necesitaría:** «Remesa de 151,25 de Cartera «Crear una remesa de pago»; el vídeo usa otra».
- [MOLESTO] (CONCEPTO) tipo 7: ««Ordenada» significa que ya está enviada, con su tesorería» → en Cartera hay remesas «ordenadas» sin tesorería (s/Tes). **Necesitaría:** «Ordenada con tesorería (c/Tes)».

### icon-cartera-v-9 — Crear el extracto de una remesa
- [BLOQUEANTE] (icon-cartera-v-9-alta-extracto / P2–P7 y CHECK 3, 4) tipo 4: «Escribe el importe del pago, 1.524,60» / «24-06-2026» / «PRVCC0» → los pasos y CHECK son con datos del vídeo y de otra cuenta; no dan los valores de mi caso (BBVA_{INI}, 151,25, comisión 3,50, fechas de noviembre de 2026). Crear 1.524,60 en la base compartida no me sirve para mi saldo. **Necesitaría:** pasos con mis valores (BBVA_{INI}, 06-11-2026, 151,25 positivo y otra línea de 3,50) y el vídeo solo como captura.
- [MOLESTO] (P5) tipo 4: «En «Concepto propio» escribe 13» → 13 existe en PRVCC0, no en BBVA_{INI} (ver tesoreria-4). **Necesitaría:** concepto propio válido para mi banco.
- [MOLESTO] (P2) tipo 7: «La cuenta financiera se carga sola» → en tesoreria-4 la elegía yo; aquí no sé si la rellena sola. **Necesitaría:** «Elige la cuenta; en la captura aparece sola».
- [MOLESTO] (CONCEPTO / Ojo) tipo 6: «En la demo TRI … en negativo (ya lo viste en el bloque «Dar de alta el extracto bancario»)» → ese bloque no lo muestra; contradice el signo positivo. **Necesitaría:** quitar la frase o mostrarlo.
- [MOLESTO] (P8) tipo 3: «No pulses «Conciliar automático»» → botón nunca presentado (en tesoreria-5 no sale; allí es «Conciliar banco»). **Necesitaría:** presentarlo o quitar el paso.

### icon-cartera-v-10 — Conciliar y contabilizar una remesa
- [MOLESTO] (icon-cartera-v-10-conciliar-contabilizar / P1) tipo 7: «Conciliar tesorería» → en tesoreria-5 el botón es «Conciliar banco». **Necesitaría:** mismo nombre.
- [MOLESTO] (icon-cartera-v-10-filtros / P3, P4 y CHECK 3) tipo 4: «Cuenta … asterisco» / «30-06-2026» / «extracto 1.524,60 … tesorería -1.524,60» → en mi base no tendré esos pendientes (mi caso es 151,25 y 3,50 en BBVA_{INI}, noviembre), y con * veo cuentas de otros alumnos. **Necesitaría:** «Elige BBVA_{INI}, 01-11-2026 a 31-12-2026; verás -151,25 y 151,25».
- [MOLESTO] (P6) tipo 4: «Al debe, la 10000.00027 … al haber, la 57900.00000» → cuentas de otra base; no me dice qué asiento ver en mi caso (40000.T{INI}/57200, más 3,50). **Necesitaría:** «En tu caso: 40000.T{INI} 151,25 Debe y 57200 Haber; 626/{INI}001 3,50».
- [MOLESTO] (icon-cartera-v-10-filtros / P5) tipo 7: «Pulsa «Ejecutar»» → antes «Ejecutar consulta». **Necesitaría:** un solo nombre.
- [MOLESTO] (CONCEPTO) tipo 7: «Tienen el mismo importe y signo contrario» → en tesoreria-5 los dos importes tienen el mismo signo. **Necesitaría:** regla única de signos.

### icon-cartera-v-11 — Conciliar un cobro y un anticipo
- [BLOQUEANTE] (icon-cartera-v-11-extracto-cobro / P2–P7 y CHECK 1, 2) tipo 4: «escribe 5.082,00 en negativo (-5.082,00)» → los pasos y CHECK usan una remesa de vídeo (5.082,00, concepto 13); mis dos cobros de 121,00 (14-11 efecto suelto y 14-12 remesa) no se dan de alta y además esos cobros salieron como s/Tes (sin movimiento de tesorería), sin decir cómo casan. **Necesitaría:** dos extractos de -121,00 en BBVA_{INI} (14-11-2026 y 14-12-2026) y cómo conciliarlos (Conciliar cartera / Generar tesorería).
- [MOLESTO] (EXP, TEST 3) tipo 7: «Si sale en positivo, no casará con su tesorería» → en tesoreria-5 la captura casa -8.080,15 con -8.080,15 (mismo signo); regla de signos incoherente entre bloques. **Necesitaría:** una tabla de signos única (pago: extracto +, tesorería -; cobro: extracto -, tesorería +).
- [MOLESTO] (P4) tipo 4: «Verás «13 TRANSFERENCIA»» → de nuevo concepto propio de otra base. **Necesitaría:** concepto propio disponible para BBVA_{INI}.
- [MOLESTO] (TEST 5) tipo 1: «se compensa o netea» → «netea» sin definir. **Necesitaría:** «netear = compensar».
- [MOLESTO] (icon-cartera-v-11-anticipo / P1) tipo 3: «Cobros y Pagos › Procesos › Especiales › Anticipos» → pantalla fuera de mi caso («Tu caso no tiene anticipos») pero con pasos y CHECK; no sé si es obligatoria. **Necesitaría:** marcarla «solo lectura, opcional».

### tesoreria-6 — Gestionar cajas de efectivo
- [MOLESTO] (tesoreria-6-configuracion / EXP, CAMPO y P3) tipo 7: «En su campo Cuenta financiera eliges la caja… (CAJA_{INI})» vs «La Cuenta financiera es opcional» → ¿obligatoria u opcional? y «Cuenta» obligatoria sin valor (solo «57000.00000» como ejemplo). **Necesitaría:** «Cuenta financiera CAJA_{INI}, Cuenta 57000.00000, Moneda EUR».
- [MOLESTO] (tesoreria-6-registro / P2 vs CHECK 6) tipo 7: «en la primera jornada de una caja nueva no aparece» vs CHECK «comprueba que se genera sola la línea de saldo inicial» → contradicción. **Necesitaría:** matizar «solo si hay saldo anterior».
- [MOLESTO] (tesoreria-6-cheques-remesas / AVISO) tipo 1: «La contabilización del diario» → «diario» (de caja) no explicado; «Depuración» (TEST), «Turno», «Justificante». **Necesitaría:** «diario = conjunto de movimientos de la jornada».
- [MOLESTO] (tesoreria-6-configuracion / P4, P5 y CHECK 3, 4) tipo 3: «maestro de tipos de operación de caja» / «tipos de moneda de caja» → pantallas sin ruta ni nombre de menú; solo se da la de «Definición de cajas». **Necesitaría:** ruta de cada una.
- [MOLESTO] (tesoreria-6-registro / CAMPO Estado de línea) tipo 4: «D (actualizado por liquidación)» → código sin explicar frente a «Inicial»/«Definitivo». **Necesitaría:** «Definitivo (D)».
- [MOLESTO] (tesoreria-6-registro / P1) tipo 6: «Finanzas › Caja › Movimientos» vs ruta del bloque «Registro y operativa» y «Caja › Remesas › Registro» vs «Cheques y Remesas» → rutas distintas para la misma pantalla. **Necesitaría:** rutas unificadas.

### tesoreria-7 — Gestionar la financiación
- [MOLESTO] (CONCEPTO / EXP) tipo 5: «No es la amortización de un activo fijo del módulo de Activos» / «vinculan contratos con inmovilizado» / «reclasificación contable» → remite a Activos y a conceptos de Cierre, que aún no he visto. **Necesitaría:** quitar la referencia o «lo verás más adelante».
- [MOLESTO] (tesoreria-7-vision / EXP) tipo 1: «Incremento de periodos», «Interempresa», «Capitalizada», «Retención», «Id tesorería» → términos sin explicar (Retención es de Impuestos). **Necesitaría:** una línea de glosario para cada uno.
- [MOLESTO] (CONCEPTO ejemplo y tesoreria-7-prestamos-lineas / EXP) tipo 1: «10.000 × 3 × 30 / 36.000» / «/ 36500» → constantes 360 y 365 días sin explicar. **Necesitaría:** «36.000 = 360 días × 100 %».
- [MOLESTO] (tesoreria-7-configuracion / EXP y P3) tipo 3: rutas diferentes («Maestros › Financiación» y «Financiación › Depósitos y préstamos C.P.») y «botones de contabilización automática» (registro-contratos P3) nunca presentados. **Necesitaría:** ruta única y breve descripción del botón.
- [MOLESTO] (tesoreria-7-configuracion / CAMPO Tipo financiación) tipo 4: «LESA» → código de la captura sin valor para mí (bloque informativo). **Necesitaría:** «Solo mira; no hace falta crear nada».

### tesoreria-8 — Gestionar valores y avales
- [MOLESTO] (tesoreria-8-cartera-maestros / EXP y CAMPO) tipo 1: «derivados», «Entidad gestora», «Cta. depósito», «agentes de cartera», «Regularización de inversión» → sin explicar. **Necesitaría:** una frase por término.
- [MOLESTO] (tesoreria-8-cartera-maestros / P1–P3 y tesoreria-8-avales / P1) tipo 3: «Mercados financieros», «Tipos de cartera», «Cuentas de la cartera de valores», «Avales de Garantía» → pantallas sin ruta de menú concreta. **Necesitaría:** ruta de cada una.
- [MOLESTO] (tesoreria-8-informes-posicion / P1) tipo 4: «Rellena Fecha inicial, Días máximos y la Cuenta financiera» → no da valores. **Necesitaría:** «Fecha 12-11-2026, Días 30, cuenta BBVA_{INI}».
- [MOLESTO] (tesoreria-8-avales / CAMPO) tipo 4: «Sociedad solicitante … Periodicidad = (ej: )» → todos los ejemplos vacíos en los campos del aval. **Necesitaría:** ejemplo de cada campo.
- [MOLESTO] (PROB) tipo 1: «cartera duplicada» → mensaje de error sin relación con ningún paso visto. **Necesitaría:** «aparece solo si repites el código de cartera».


## 7. Impuestos (icon-impuestos.json)

### icon-impuestos-conceptos — Entender el IVA
- [BLOQUEANTE] (icon-impuestos-conceptos-motor / P1) tipo 3: «Mira el detalle fiscal de una factura de compra con dos líneas de 100 €.» → No dice qué factura, ni en qué menú, ni existe aún la pestaña «Impuestos por documento» (se presenta dos bloques después); las reglas 73 y 153 no aparecen en ningún sitio. **Necesitaría:** quitar el paso (o marcarlo «solo lectura de la captura») o indicar factura, ruta «Finanzas › Facturación › Compras › Registro» y pestaña.
- [MOLESTO] (icon-impuestos-conceptos-motor / EXP) tipo 1: «Si hace falta afinar, mira también la clave del tercero y la del documento.» → «clave del documento» y «clave fiscal» no se han explicado; solo se explican en el bloque siguiente. **Necesitaría:** una frase: «Las claves son etiquetas fiscales que se explican en el siguiente bloque».
- [MOLESTO] (icon-impuestos-conceptos-motor / EXP) tipo 4: «empresa en zona ESCO + proveedor en zona ESCO + artículo con clave BOG» → No se dice si T{INI} está en ESCO ni qué clave tiene ROD{INI}; la tabla del curso nunca lo fija. **Necesitaría:** «T{INI} y la empresa 0 están en ESCO; tu artículo ROD{INI} lleva la clave …».
- [MOLESTO] (icon-impuestos-conceptos / Puente) tipo 4: «consultas facturas de ejemplo de la empresa ALA… otra empresa de la demo» → En Maestros se dice que la base TUTORIAL tiene solo la empresa 0 y DIS; no sé si ALA existe en mi entorno o solo en los vídeos. **Necesitaría:** «ALA solo sale en los vídeos / existe en la base X, entra con el selector de empresa».
- [MOLESTO] (icon-impuestos-conceptos-iva / AVISO) tipo 5: «La verás en «Liquidar y presentar las declaraciones».» → Prorrata se usa antes de definirse en el módulo (se define allí, aunque anunciado). Aceptable, pero «prorrata» aparece sin pantalla ni ejemplo hasta el último bloque.

### icon-impuestos-1 — Conocer los maestros fiscales
- [MOLESTO] (icon-impuestos-1-zonas / P3) tipo 3: «Si tu demo tiene una zona de Canarias, Ceuta o Melilla, ábrela» → Paso condicional sin decir qué buscar ni cuántas zonas hay. **Necesitaría:** «En la lista, busca ESCO y ESAR; las de Canarias/Ceuta/Melilla pueden no estar: sáltalo».
- [MOLESTO] (icon-impuestos-1-clases-tipos / EXP) tipo 7: «ES-IVA-SOP es el IVA soportado de las compras y ES-IVA-REP» → Contabilidad enseñó mnemotécnicos de 5 cifras como 62300; aquí son textos, y luego (v-2) salen ESG-IVA-SV/RV. Mi pantalla mostrará solo uno. **Necesitaría:** decir qué ve el alumno en su base y poner un único ejemplo en toda la ficha.
- [MOLESTO] (icon-impuestos-1-clases-tipos / P1) tipo 3: «Abre Finanzas › Impuestos › Maestros › Clases de impuestos» → Primera vez que aparece el menú Finanzas › Impuestos; no sé si mi usuario lo ve ni si hay que cambiar de empresa. **Necesitaría:** una línea «Si no ves Impuestos en el menú, escribe «Clases de impuestos» en el buscador».
- [MOLESTO] (icon-impuestos-1-operaciones / P2) tipo 4: «Abre la operación CCMESC.» → Es una operación de IPSI (Ceuta-Melilla), ejemplo lejano al caso y sin explicar qué es IPSI hasta ahora solo de pasada. **Necesitaría:** usar una operación ISP de IVA, o decir «es solo un ejemplo de ISP».
- [MOLESTO] (icon-impuestos-1-claves / P3) tipo 2: «Abre … Clave fiscal por zona y artículo y mira si hay alguna excepción.» → No dice cuál es el resultado esperado si no hay ninguna. **Necesitaría:** «En la demo la lista puede estar vacía; es normal».
- [MOLESTO] (icon-impuestos-1 / TEST sobre IRPF) tipo 8: «Un profesional te factura 1.000 € con un 21 % de IVA y un 15 % de retención de IRPF.» → Se enseña en una EXP de clases, pero la retención de IRPF nunca se opera en el curso y «quien paga ingresa» confunde. Respuesta coherente, solo es nuevo. **Necesitaría:** repetir la fórmula 1.000+210−150 en el EXP justo antes.

### icon-impuestos-v-1 — Comprobar los datos fiscales de empresa, tercero y artículo
- [BLOQUEANTE] (icon-impuestos-v-1-empresa / P1) tipo 4: «entra en la empresa ALA y abre la pestaña Identificación fiscal» → Mi ERP de práctica tiene la empresa 0 y DIS; no sé si ALA, el tercero 00003 y el artículo 002 existen en mi base o solo salen en los vídeos. Si no existen, los cinco CHECK son imposibles. **Necesitaría:** decir expresamente dónde están (otra base/otro usuario) o dar una alternativa con la empresa 0 (zona ESCO, ya vista en Maestros).
- [MOLESTO] (icon-impuestos-v-1-empresa / AVISO) tipo 2: «Esta pantalla no lleva captura en el curso. Si no encuentras la pestaña, busca el campo Zona impositiva» → Remite a una pantalla que ya vi en Maestros (empresa 0, ESCO) sin enlazarla. **Necesitaría:** «Es la misma ficha que viste en «Cabecera e identificación» (Maestros)».
- [MOLESTO] (icon-impuestos-v-1-tercero / P2) tipo 3: «Abre la pestaña Direcciones y localiza la zona impositiva de la dirección.» → No dice qué hacer si el tercero tiene varias direcciones ni en qué columna/campo sale la zona. **Necesitaría:** «Abre la dirección principal (la marcada como predeterminada); el campo Zona impositiva está en el detalle».
- [MOLESTO] (icon-impuestos-v-1 / Ejemplo) tipo 4: «la compra a T{INI} de 125,00 sale al 21 %, con 26,25 de IVA soportado» → Nunca compruebo la zona ni la clave de mi T{INI} ni de ROD{INI}; el módulo solo mira ALA. Además en Cartera se avisó de que el IVA de esa factura va a una cuenta «Instrumental» con tercero «No censado». **Necesitaría:** un paso «mira T{INI}: zona ESCO, clave RGEN; ROD{INI}: clave …» o aviso de que la demo no calcula bien tu caso.
- [MOLESTO] (icon-impuestos-v-1-articulo / EXP) tipo 7: «El artículo 002 Material deportivo tiene … BOG» → En Contabilidad mi artículo FOR{INI} llevaba SOG (servicio); BOG nunca se ha usado en mi caso. **Necesitaría:** aclarar que BOG es de bienes y SOG de servicios, y cuál usa ROD{INI}.

### icon-impuestos-v-2 — Leer la regla de impuestos de una factura
- [BLOQUEANTE] (icon-impuestos-v-2-factura-impuestos / P1) tipo 4: «localiza la factura FCALA23-000015» → Mismo problema: factura de ALA 2023 que no sé si existe en mi base; si la lista del Registro de compras de la empresa 0 no la muestra, no puedo hacer ningún CHECK del bloque. **Necesitaría:** cómo cambiar a la empresa ALA o un ejemplo equivalente con mi factura PROV-{INI}-001 (empresa 0).
- [MOLESTO] (icon-impuestos-v-2-factura-impuestos / AVISO) tipo 1: «La casilla Modificado manualmente indica si alguien los cambió a mano» → Casilla no localizada ni presentada (¿en qué pestaña?). **Necesitaría:** decir dónde está o quitar la frase.
- [MOLESTO] (icon-impuestos-1-reglas-agencia / P2) tipo 3: «Abre la ficha de un tercero con la pestaña Impuestos (en la captura, OUTDOOR SPORTS SA, código 00232)» → En v-1 las pestañas del tercero no incluían «Impuestos»; no sé ruta ni si 00232 existe. **Necesitaría:** ruta «Finanzas › Maestros › Terceros › Registro terceros› pestaña Impuestos» o marcar el paso como «solo captura».
- [MOLESTO] (icon-impuestos-1-reglas-agencia / P3) tipo 4: «el emisor (90002), el receptor (90003, distinto del emisor) y el porcentaje de base fiscal (40,000)» → Códigos y cifras sin origen (90002, 90003) y «grupo de IVA» no explicado. **Necesitaría:** una línea de qué es un grupo fiscal y que los códigos son de la captura.
- [MOLESTO] (icon-impuestos-v-2-regla-2586 / CAMPO) tipo 1: «Prioridad = Desempata … gana el número más alto» → En «Clases» el orden de precedencia es al revés; se explica, pero con dos números opuestos me lío. **Necesitaría:** un cuadro de dos filas «Precedencia: bajo primero / Prioridad: alto gana».
- [MOLESTO] (icon-impuestos-v-2-regla-2586 / EXP) tipo 4: «Impuesto de ventas: operación … VLBC … Una sola regla sirve para comprar y para vender» → No muestro cuál es la regla de la empresa 0 (ESCO+ESCO+BOG) que usa mi caso; solo ESAR. **Necesitaría:** «Para tu caso la regla es ESCO + ESCO + BOG; búscala filtrando por Zona empresa ESCO».

### icon-impuestos-v-3 — Probar las reglas de impuestos
- [BLOQUEANTE] (icon-impuestos-v-3-segunda-linea / P2) tipo 8/4: «la clave de la línea sale como SOE, pero la regla 1479 pide SOR… avisa a tu formador» → Si el artículo 008 devuelve SOE no se aplica la 1479 y no obtengo ESR 10 % ni el total 2.332; no sé cuál es la clave correcta del 008 ni cómo cambiarla (se dijo no tocar artículos). **Necesitaría:** decir qué clave tiene realmente el 008 y qué hacer (usar otro artículo con SOR o cambiar la clave de la línea).
- [BLOQUEANTE] (icon-impuestos-v-3-preparar-prueba / P1) tipo 4: «cambia la zona impositiva a España continental (ESCO). Guarda.» → Pide editar el tercero 00003 de la demo compartida (afecta a compañeros) y crear una factura de ALA con fecha 30-04-2023, con ejercicio posiblemente cerrado o sin permisos; no hay alternativa si no puedo editar. **Necesitaría:** confirmar que esa empresa/ejercicio admite facturas y que mi usuario puede editar el tercero, o dar un tercero de prueba propio.
- [MOLESTO] (icon-impuestos-v-3-preparar-prueba / P1) tipo 3: «entra en Direcciones y cambia la zona impositiva» → ¿Qué dirección si hay varias?. **Necesitaría:** «la dirección principal».
- [MOLESTO] (icon-impuestos-v-3-segunda-linea / EXP) tipo 1: «Añades una segunda línea (orden 4)» → ¿Por qué orden 4 y no 2? Nunca se explica. **Necesitaría:** «el orden es solo la posición de la línea; no importa».
- [MOLESTO] (icon-impuestos-v-3-preparar-prueba / P2) tipo 2: «El botón Validar del pie lo usarás después» → «Validar» ya se vio como provisional/validado, pero no sé dónde está el botón ni en qué se diferencia de Contabilizar. **Necesitaría:** «Validar no genera asiento: solo calcula impuestos; Contabilizar viene después».
- [MOLESTO] (icon-impuestos-v-3 / CONCEPTO) tipo 7: «ALA… factura de compra FC» y «Fact. de compras (FC)» → En Compras mi tipología es FC{INI} (4 caracteres) y aquí es el tipo estándar FC. **Necesitaría:** «Usa el tipo FC estándar de la demo, no tu FC{INI}».

### icon-impuestos-2 — Revisar el registro fiscal
- [MOLESTO] (icon-impuestos-2-registro / CAMPO) tipo 7: «Empresa = … (ej: TRI)» → La empresa se llamaba ALA («Triathlon [ALA] S.L.») y el tercero «00007» no es el 00003; el ejemplo no cuadra con v-2. **Necesitaría:** usar los mismos códigos (ALA, 00003) o decir que es otra captura.
- [MOLESTO] (icon-impuestos-2-registro / P1) tipo 4: «Comprueba empresa, fechas, tercero, zonas ESCO … abre un registro de compras» → Mi caso sería PROV-{INI}-001 en la empresa 0, pero no me dice que lo busque; además su registro fiscal puede no existir porque la demo lleva el IVA a «Instrumental». **Necesitaría:** «Busca tu registro: empresa 0, tercero T{INI}; si no sale, avisa».
- [MOLESTO] (icon-impuestos-2-registro / EXP) tipo 1: «clave de e-reporting (el canal de envío de la factura a Hacienda)» → E-reporting y «Traspasar a SII-Facturas» aparecen sin haber explicado SII (solo en un EXP de Clases). **Necesitaría:** definir «SII» en una línea aquí.
- [MOLESTO] (icon-impuestos-2-isp / P2) tipo 4: «En Comprobación del registro, filtra las líneas con la columna ISP marcada. Abre una» → No garantiza que haya líneas ISP en la demo. **Necesitaría:** «Si no hay ninguna, salta al paso 3».
- [MOLESTO] (icon-impuestos-2-isp / P1) tipo 4: «abre la operación CCMESC» → Es IPSI de Ceuta-Melilla, pero el ejemplo explicado es consultor alemán con IVA 21 %: no veo en pantalla un caso ISP de IVA. **Necesitaría:** una operación ISP de IVA del plan (p. ej., «compra de servicios a la UE») o aclarar que CCMESC es solo ilustrativa.
- [MOLESTO] (icon-impuestos-2-ejemplos / P1) tipo 3: «filtra por ejercicio fiscal. Localiza el bloque de la empresa ALA» → No dice cómo filtrar ni si hay datos del ejercicio 2026 o solo 2023. **Necesitaría:** «Filtra por 2023 para ver ALA, o 2026 para tu empresa 0».

### icon-impuestos-4 — Controlar los impuestos antes de declarar
- [BLOQUEANTE] (icon-impuestos-4-control / Ejemplo) tipo 7: «el asiento de la factura, que lleva 47200 IVA soportado por 26,25» → Choca con Cartera, donde la factura de la demo lleva el IVA a «00000.00000 Instrumental» y el tercero «No censado»; si es así mi control no mostrará 26,25 en 47200 ni registro fiscal coherente. **Necesitaría:** confirmar si el caso real de la demo lleva el IVA a 47200 o a «Instrumental» y, si es lo último, quitar el ejemplo del caso.
- [MOLESTO] (icon-impuestos-4-justificacion / P2) tipo 4: «saldría la cuenta 60000 con base 125,00 y cuota 26,25» → Mi compra usa el mnemotécnico del artículo (62300/Compras), no sé si 60000. **Necesitaría:** la cuenta de gasto real del caso.
- [MOLESTO] (icon-impuestos-4-control / EXP) tipo 1: «Justificación impuestos vía enlaces» → «enlaces» (enlace contable) no se explica; hay entrada en glosario pero el texto no la cita. **Necesitaría:** «enlace = vínculo entre el registro fiscal y el apunte del asiento».
- [MOLESTO] (icon-impuestos-4-importes-reglas / P2) tipo 2: «escribe >01-01-2000 (el signo > significa «posteriores a»)» → Sintaxis de filtro nunca presentada; ¿funciona en todos los campos? **Necesitaría:** una nota de operadores de filtro (>, <, rangos) al inicio de Integridad.
- [MOLESTO] (icon-impuestos-4-importes-reglas / P3) tipo 4: «En la demo todas valen 0» → Si varios compañeros han creado facturas de prueba (v-3) los contadores pueden no ser 0; no sé qué hacer si no. **Necesitaría:** «Si ves un contador distinto de 0 tras tus pruebas, anótalo; puede venir de otro alumno».
- [MOLESTO] (icon-impuestos-4-justificacion / AVISO) tipo 7: «Revisa el NIF… corrígelo en el maestro y regenera los registros afectados» → «regenerar registros» nunca se enseña (no hay botón ni proceso en la lista de cinco). **Necesitaría:** decir con qué proceso se regenera (¿Validación de impuestos?).

### icon-impuestos-3 — Liquidar y presentar las declaraciones
- [BLOQUEANTE] (icon-impuestos-3-caso / P3) tipo 7: «477 al debe 42,00. 472 al haber 26,25. 4750 al haber 15,75.» → Las cuentas del curso son 47200 y 47000 (en Fundamentos 47000 se llama «Hacienda Pública, deudora por IVA», no repercutido); 4750 no aparece nunca con código de demo y no se dice el código de 5 cifras. No sé qué cuentas escribir. **Necesitaría:** el asiento con los códigos reales de la demo (p. ej. 47000.00000 al debe, 47200.00000 y 4750x.00000 al haber) y su nombre exacto.
- [BLOQUEANTE] (icon-impuestos-3-caso / P1) tipo 3: «En la demo compartida solo mira: no presentes nada.» → La demo es compartida y mis cifras (42,00 / 26,25) se mezclan con las de otros alumnos; no sé qué casillas mirar ni cómo filtrar mi caso. **Necesitaría:** nº de casillas (repercutido, soportado, resultado) y un filtro por tercero/documento, o aceptar que solo se calcula a mano.
- [MOLESTO] (icon-impuestos-3-caso / AVISO) tipo 2: «No está comprobado que el borrador del 303 lo contabilice: en el caso, lo anotas tú.» → No sé cómo «anotarlo» (¿asiento manual? ¿en qué pantalla?, ¿en qué diario?). **Necesitaría:** ruta de Contabilidad básica para el asiento manual y diario.
- [MOLESTO] (icon-impuestos-3-caso / EXP) tipo 4: «El asiento de liquidación salda las dos cuentas de IVA y deja lo que debes en una tercera» → 477 con debe 42,00 contra 472 con haber 26,25 y 4750 haber 15,75 (cuadra), pero «Hacienda Pública, acreedora» ≠ «deudora» (fundamentos) sin diferencia explicada. **Necesitaría:** una línea: «deudora = Hacienda te debe; acreedora = tú le debes».
- [MOLESTO] (icon-impuestos-3-modelos / EXP) tipo 1: «Modelo 390 … 349» → Aparecen sin que ningún paso los toque; si no los uso, ¿hay que saber casillas? **Necesitaría:** decir que solo se piden de memoria.
- [MOLESTO] (icon-impuestos-3-claves / P1) tipo 3: «Pulsa Ordenar en la barra superior y elige Modelo.» → Botón «Ordenar» no presentado antes; ¿ES190 existe? **Necesitaría:** una captura o «si no ves Ordenar, haz clic en la cabecera de la columna Modelo».
- [MOLESTO] (icon-impuestos-3-prorrata / EXP) tipo 4: «la empresa FPE (otra empresa de la demo) … 2018» → Cuarta empresa distinta (ALA, FPE, 0, TRI) en un solo módulo. **Necesitaría:** una tabla de «qué empresa es cada una» al principio del módulo.
- [MOLESTO] (icon-impuestos-3-procesos / P1) tipo 5: «Casi todos piden un rango de fechas» → Menciona «Retroceder» antes de explicarlo en esta frase; y no sé si puedo ejecutarlos en demo compartida. **Necesitaría:** «No ejecutes los procesos en la demo compartida; solo localízalos».


## 8. Activos fijos (icon-activos.json)

### icon-activos-conceptos — Entender el activo fijo y la amortización
- [MOLESTO] (conceptos / CONCEPTO) tipo 5: «así el cierre sigue cuadrando: beneficio 61,50 y balance 3.077,25» → habla de «cierre» y «balance» como si ya los dominara; el Cierre es un módulo posterior (9) y aquí no se explica. **Necesitaría:** quitar la frase del cierre o decir «el resultado del caso (61,50) no cambia; el cierre lo verás al final del curso».
- [MOLESTO] (conceptos-activo / EXP) tipo 4: «Va a una cuenta del grupo 2 … 213 Maquinaria, 217 … 206» → cuentas de 3 cifras, pero en el ERP y en el módulo de Contabilidad las cuentas tienen 5 cifras (57200, 62900) y más abajo salen 20000/28000/68000. No sé si 213 y 21300 son lo mismo. **Necesitaría:** una frase: «El PGC usa 3 cifras; el ERP las amplía con ceros, 213 → 21300 o similar».
- [MOLESTO] (conceptos-amortizacion / EXP) tipo 1: «el deterioro de valor» → aparece dentro de la definición del VNC sin explicar (solo está en el glosario). **Necesitaría:** «deterioro: pérdida extra de valor por un daño o caída de mercado; en el curso no lo usaremos».
- [MOLESTO] (conceptos / CONCEPTO) tipo 4: «En la demo de prácticas (TUTORIAL) hay pocos activos y ninguna factura de activos: no los creas tú» → no queda claro qué voy a hacer en el módulo (todo mirar capturas de ALA). **Necesitaría:** un resumen al inicio: «en este módulo no grabas nada; miras capturas y calculas a mano».
- [MOLESTO] (conceptos-baja / EXP) tipo 1: «671 Pérdidas procedentes del inmovilizado material, o 670 si es intangible» → no he visto antes que el programa informático sea «intangible» salvo una línea previa; los bloques posteriores mezclan 670/671 sin recordármelo. **Necesitaría:** tabla pequeña material/intangible → 213/206, 68x, 670/671, 770/771.
- [MOLESTO] (conceptos-baja / P1) tipo 8: «vender por 450 € … 600 € con 5,57 € amortizados» → no explica de dónde sale 5,57 y luego el bloque 3 dice que antes de vender se contabiliza la amortización pendiente, lo que cambia el VNC. **Necesitaría:** «5,57 € es lo amortizado hasta ese día; si pasan más días, el VNC baja y el resultado cambia».

### icon-activos-1 — Conocer los maestros del activo
- [BLOQUEANTE] (icon-activos-1-bien / P1) tipo 3: «abre el bien ES2130 Maquinaria de la empresa ALA» → en TUTORIAL no existe ALA ni ES2130, y no se me dice cómo cambiar de empresa ni qué abrir en su lugar (solo «casi siempre de prueba con código CAP»). Los CHECK piden localizar ES20/ES200/ES2130. **Necesitaría:** «En TUTORIAL abre el bien CAPASC (empresa 0) y localiza los mismos campos; ES2130 y ES20 son solo de la captura».
- [BLOQUEANTE] (icon-activos-1-config / P2-P3) tipo 4: «abre el grupo ES20» y «el grupo contable ES200» → ids de la demo ALA; en TUTORIAL el grupo contable es CAP1 (se dice sueltamente en otro paso). No sé qué abrir. **Necesitaría:** indicar en cada paso el código real en TUTORIAL (CAP1…) o «si no existe, abre cualquier grupo de la lista».
- [MOLESTO] (icon-activos-1-bien / EXP) tipo 7: «bien ES2130 Maquinaria, grupo contable ES212 Instalaciones técnicas» frente a «Grupo inmovilizado = ES22» y, en el elemento, «Grupo contable ES213 Maquinaria» → la misma Maquinaria tiene tres grupos distintos (ES212/ES213, ES22 vs ES21 de la config). **Necesitaría:** que los ejemplos sean coherentes o avisar de que son capturas de datos distintos.
- [MOLESTO] (icon-activos-1-config / P4) tipo 7: «ES5 para una furgoneta, ES6 para una mesa y ES7 para un ordenador» frente al bien con «Grupo fiscal ES4 Instalaciones» y luego grupo fiscal «310 Equipo biomédico» → no entiendo qué códigos son oficiales. **Necesitaría:** decir que cada empresa/demo tiene su codificación de tablas fiscales.
- [MOLESTO] (icon-activos-1-bien / P2) tipo 2: «con un bien guardado (aquí el de prueba CAPASC)» → no me han dicho que guarde ni cree ningún bien; no sé de dónde sale CAPASC. **Necesitaría:** «CAPASC es un bien de prueba ya creado en TUTORIAL; no lo crees tú».
- [MOLESTO] (icon-activos-1-elemento / AVISO) tipo 1: «solo admite códigos dados de alta antes en el maestro de inversiones» → «Presupuesto» e «inversiones» no se han presentado. **Necesitaría:** una línea: «no lo usamos; déjalo vacío».
- [MOLESTO] (icon-activos-1-componente / EXP) tipo 1: «Cuadro de amortizaciones … Mínimo/Máximo» y «Componente … tipo Inversión inicial» → columnas y tipos sin explicar. **Necesitaría:** aviso breve de qué es «Inversión inicial» (compra nueva) y qué son Mínimo/Máximo (límites fiscales).

### icon-activos-v-4 — Comprobar la familia del artículo
- [BLOQUEANTE] (v-4-requisito-creacion / P1) tipo 5: «Confirma que la tipología FACT tiene «Generación inmovilizado» en «En contabilización»» → me pide comprobar un indicador de la tipología de factura que se explica en los bloques siguientes (v-1 y v-2), y FACT no existe en TUTORIAL. **Necesitaría:** reordenar (v-4 después de v-2) o explicar aquí el indicador y dónde verlo, y no pedir abrir FACT.
- [BLOQUEANTE] (v-4-abrir-articulo-familia / P1-P2) tipo 4: «localiza el artículo 0012051 … abre la familia 06010000» → no están en TUTORIAL; el fallback («abre cualquier familia») está en el CONCEPTO, pero los pasos y los CHECK siguen exigiendo 0012051, bien 020192 y serie CMP. **Necesitaría:** «Si no ves 0012051, abre cualquier familia y mira el bloque Parámetros inmovilizado: lo normal es que esté vacío».
- [MOLESTO] (v-4 / CONCEPTO) tipo 4: «el artículo 13500620 es de tipo PRODUCTO» → no recuerdo que en Maestros/Compras se haya elegido tipo PRODUCTO; no sé dónde se ve. **Necesitaría:** «lo viste en Compras al crear el artículo; ábrelo en Registro y mira «Tipo»».
- [MOLESTO] (v-4-codigo-bien-serie / EXP) tipo 1: «Sistema amortización vale Ninguno», «Agrupar elementos» → opciones sin sentido para mí en este punto (aún no sé qué es un sistema). **Necesitaría:** «se verán en el bloque Amortizar; aquí déjalos como están».
- [MOLESTO] (v-4-codigo-bien-serie / P2) tipo 2: «Pulsa en «Serie inmovilizado» … Sal con Esc» → mezcla de «solo mira» con editar un desplegable; no sé si puedo tocar la familia de la demo compartida. **Necesitaría:** «No modifiques nada; si el desplegable se abre, cierra con Esc».
- [MOLESTO] (v-4-abrir-articulo-familia / EXP) tipo 1: «clave fiscal BOG … decide el IVA del artículo» → la clave fiscal se menciona sin referencia al módulo de Impuestos (aunque es anterior). **Necesitaría:** remitir a «Impuestos › clave fiscal» o quitar la mención.

### icon-activos-v-1 — Revisar el albarán que crea el activo
- [MOLESTO] (v-1-contabilizacion / P1) tipo 4: «abre una tipología de albarán de compra cualquiera (en el vídeo, la AACF)» → si abro la mía AO{INI} puede que no tenga la pestaña igual; no sé cuál elegir. **Necesitaría:** «abre tu tipología AO{INI} (creada en Compras)».
- [MOLESTO] (v-1-asientos-contables / EXP) tipo 1: «Asiento suministros», «no facturados», «dotar una provisión» → «suministros» y «provisión» sin definir justo ahí. **Necesitaría:** «suministros = albaranes de compra en este ERP; provisión = gasto estimado sin factura (ver glosario)».
- [MOLESTO] (v-1-indicador-inmovilizado / TEST 3) tipo 8: «¿Qué valor tiene Generar inmovilizado en la tipología AACF del vídeo?» → la AACF no existe en la demo, solo se sabe por el vídeo, y el bloque admite que «tu tipología puede ser otro». **Necesitaría:** pregunta sobre el concepto («¿por qué un albarán normalmente no genera?»), no sobre un dato de otra demo.
- [MOLESTO] (v-1 / CONCEPTO) tipo 4: «el albarán de 10 uds. a T{INI} (125,00) es de existencias» → T{INI} es proveedor, en compras; correcto, pero «a T{INI}» suena a venta. **Necesitaría:** «del proveedor T{INI}».
- [MOLESTO] (v-1-contabilizacion / EXP) tipo 3: «pestañas («Valoración», «Anticipos», «Contabilización»…)» → «Anticipos» y «Valoración» se citan sin explicar. **Necesitaría:** «No las tocas; solo Contabilización».

### icon-activos-v-2 — Revisar la factura que crea el activo
- [BLOQUEANTE] (v-2-tipologia-factura / P1-P2 y v-2-opciones-indicador / P2) tipo 4: «abre la tipología FACT» y «Comprueba que FACT está en «En contabilización»» → FACT no existe en TUTORIAL; el CONCEPTO propone «FC «FACTURA COMPRA»», pero mi tipología es FC{INI} (4 caracteres, creada en Compras) y los pasos/CHECK piden tipo de asiento FACT. Puede que el indicador en FC no exista o sea otro valor. **Necesitaría:** «abre tu FC{INI}; su indicador valdrá probablemente No generar; FACT solo está en la captura».
- [MOLESTO] (v-2-circuito-estados / ruta) tipo 6: «Compras › Facturas › Consultar facturas» → los demás bloques usan «Gestión › Compras › Facturas › Facturas»; no sé si es la misma pantalla. **Necesitaría:** unificar el nombre del menú o aclararlo.
- [MOLESTO] (v-2-circuito-estados / EXP) tipo 7: «Después se valida: queda revisada y bloqueada» frente a «Provisional: aún se puede modificar» y «Validado = lista para contabilizar» → en el módulo de Contabilidad se explica Provisional/Validado; aquí «bloqueada» añade un matiz que no entiendo. **Necesitaría:** repetir la definición del glosario.
- [MOLESTO] (v-2-tipologia-factura / EXP) tipo 1: «Factura los suministros de tipología AACT, es decir, los albaranes de activos» → mezcla AACF (bloque anterior) y AACT sin decir que son dos tipologías distintas. **Necesitaría:** «AACF era existencias; AACT es el albarán de activos que factura FACT».
- [MOLESTO] (v-2 / CONCEPTO) tipo 4: «1.200,00 + 252,00 de IVA = 1.452,00» → bien (21 %), pero en Impuestos hablamos de «cuota»; no remite a ello. **Necesitaría:** «252,00 es la cuota de IVA al 21 %».
- [MOLESTO] (v-2-circuito-estados / TEST 4) tipo 8: «¿Qué tipología de albaranes factura FACT? AACT» → solo se enseña con capturas de la demo de vídeos, no con mi demo. **Necesitaría:** hacerla comprobable con un dato de TUTORIAL o enseñarla en el EXP con la condición de selección.

### icon-activos-v-3 — Contabilizar una factura de activos
- [BLOQUEANTE] (v-3-validar-contabilizar / P2 y CHECK 4) tipo 7: «Pulsa «Contabilizar»» frente a «no contabilices facturas que no sean tuyas» (CONCEPTO) y «Haz este bloque con las capturas» → el OBJ dice «contabilizarás», el paso dice pulsa, el aviso dice no toques la demo compartida; no sé si debo hacerlo. **Necesitaría:** decidir: «Solo mira las capturas; no pulses Contabilizar» o «Hazlo solo con una factura propia y luego descontabiliza».
- [BLOQUEANTE] (v-3-circuito-docflow / P1) tipo 3: «Abre la factura FACT0000044 desde Consultar facturas» → no existe en TUTORIAL y no hay alternativa; el módulo de Compras tampoco la creó. P2 y 4 CHECK dependen de ella. **Necesitaría:** «Abre tu factura PROV-{INI}-001, pestaña Docflow, para ver el gráfico; FACT0000044 es solo de la captura».
- [MOLESTO] (v-3-circuito-docflow / EXP) tipo 1: «SFOR, PSER, PACT, AACT» → códigos de tipologías de otra demo; yo he creado OC/PC/AO/FC. **Necesitaría:** equivalencias: SFOR = solicitud, PACT = pedido de activos, etc.
- [MOLESTO] (v-3-pestana-componentes / EXP) tipo 4: «componente 004105 del bien 010159 «Equipos médicos mayores», elemento 125017407» → códigos de un activo de otra empresa, sin relación con ALA ni ES2130. **Necesitaría:** avisar de que es un ejemplo sin relación con el resto.
- [MOLESTO] (v-3-pestana-componentes / EXP) tipo 1: «botón «Fecha inicio depreciación»» → habla de «depreciación» y no de amortización; ¿es lo mismo? **Necesitaría:** «depreciación = amortización».
- [MOLESTO] (v-3 / CONCEPTO) tipo 7: «Ejemplo: la factura se contabiliza el 07-06-2023» → fecha de 2023 cuando mi ejercicio es 2026; no sé si debo ajustar. **Necesitaría:** «La fecha es de la captura; en tu ejercicio sería 2026».

### icon-activos-2 — Amortizar un activo
- [BLOQUEANTE] (icon-activos-2-sistemas / P1) tipo 7: «Abre «Elementos», abre un elemento, pulsa la pestaña «Valores de los elementos»» → el bloque 1 dijo que los valores y el cuadro de amortizaciones están en el componente («Valores de los componentes»); aquí lo busco en el elemento, y el elemento ALA000008 no existe en TUTORIAL. No sé dónde mirar. **Necesitaría:** «Abre un componente y mira «Valores de los componentes»; si solo ves totales en el elemento, baja al componente».
- [MOLESTO] (icon-activos-2 / OBJ) tipo 7: «contabilizarás sus cuotas» frente a «En la demo compartida no lances el proceso» (P1 contabilización) → no puedo hacer lo que dice el objetivo. **Necesitaría:** cambiar OBJ a «leerás» y ajustar CHECK.
- [MOLESTO] (icon-activos-2-sistemas / EXP) tipo 1: «sistema A, C y H», «Amortización inicial» → no entiendo qué es un «sistema» ni para qué valen varios. **Necesitaría:** ejemplo: «A = contable, C = fiscal».
- [MOLESTO] (icon-activos-2-contabilizacion / EXP) tipo 1: «imputación programada» → término sin definir (solo se explica entre comas). **Necesitaría:** ejemplo con porcentajes de reparto entre centros.
- [MOLESTO] (icon-activos-2 / CONCEPTO) tipo 4: «681 … 2817» → son cuentas del PGC de 3-4 cifras; antes vi 68000/28000 (5 cifras). **Necesitaría:** equivalencia entre ambas notaciones.
- [MOLESTO] (icon-activos-2-sistemas / EXP) tipo 4: «con un 32 %, 100/32 = 3,1 → 4 años» frente a «mostrador 1.480 al 10 %» sin años → no sé si el ERP redondea años o porcentaje. **Necesitaría:** que lo marque el campo editable.
- [MOLESTO] (icon-activos-2-traspasos / TEST 5) tipo 8: «36.000 … nuevo 1.800 … ¿con cuánto queda el original?» → es aritmética sin ERP, correcta (34.200), pero el elemento OPT000003 es de la captura. **Necesitaría:** ok, solo marcar que es de ejemplo.

### icon-activos-3 — Dar de baja o vender un activo
- [BLOQUEANTE] (icon-activos-2-bajas-ventas / P1-P3) tipo 3: «Abre un componente y localiza los botones del pie…» → en TUTORIAL no hay componentes reales, solo CAP de prueba; y se dice «sal con CANCELAR». No sé si hay un componente que pueda abrir y si el pie existe en la demo. **Necesitaría:** «Abre el componente de prueba CAP… y localiza los botones; P2/P3 son solo capturas».
- [MOLESTO] (icon-activos-2-bajas-ventas / EXP) tipo 2: ««Fuera de servicio» … no está claro si genera un apunte contra pérdidas (671). No lo uses» → el curso admite no saber; confunde al alumno. **Necesitaría:** decir que «Fuera de servicio» no se enseña en el curso, sin dudas.
- [MOLESTO] (icon-activos-2-bajas-ventas / EXP) tipo 4: «En la captura sale 10200.00000, un valor de prueba» → cuenta 10200 (capital) en la venta; confunde con el 572/57200 que se pide usar. **Necesitaría:** «en la captura es un dato de prueba; tú pondrías 57200».
- [MOLESTO] (icon-activos-2-bajas-ventas / EXP) tipo 1: «543 Créditos a corto plazo por enajenación de inmovilizado» → «enajenación» sin explicar. **Necesitaría:** «enajenación = venta».
- [MOLESTO] (icon-activos-2-informes / P1) tipo 3: ««Informes» › «Amortizaciones»» → se citan «Situación», «Control de integridad», «Comprobación» sin decir en qué ruta están (ni si «Comprobación» cuelga de Informes). **Necesitaría:** árbol del menú completo.
- [MOLESTO] (icon-activos-2-informes / AVISO) tipo 5: «Antes de cerrar el ejercicio, lanza un informe de comprobación» → habla de cerrar ejercicio, módulo 9. **Necesitaría:** «más adelante, en el cierre, lo usarás».
- [MOLESTO] (icon-activos-2-informes / P1) tipo 4: «empresa CAN, proyecto 28 Madrid, total 11.166,67 €» → otro dato de otra empresa de demo (CAN), sin relación con ALA; ya van ALA, CAN, IRS más S{INI} y empresa 0. **Necesitaría:** cuadro «empresas de la demo» al inicio del módulo.
- [MOLESTO] (icon-activos-2-bajas-ventas / P2) tipo 4: «motivo «Deprecated»» → palabra inglesa sin explicar. **Necesitaría:** «Deprecated = obsoleto».



## 9. Contabilidad avanzada y cierre (contabilidad-avanzada.json; incluye icon-contabilidad-2, -3 y contab-cierre-practica)

### icon-contabilidad-2 — Cerrar y abrir el ejercicio
- [MOLESTO] (icon-contabilidad-2-cierre-definitivo-resto / PROB 2, y -procesos-periodicos-orden / EXP 2) tipo 7: «No lanza antes la regularización ni crea asientos reales.» frente a «Borra los asientos del cierre temporal y deja el ejercicio abierto.» → si el cierre temporal no crea asientos, no se entiende qué borra la reapertura ni por qué hay que hacerla antes del cierre definitivo; tampoco se dice si el cierre temporal cambia el estado del ejercicio. **Necesitaría:** una frase que diga qué cambia exactamente el cierre temporal (¿estado del ejercicio? ¿periodos?) y por qué después hay que reabrir.
- [MOLESTO] (icon-contabilidad-2 / CHECK 3) tipo 7: «Localizas la regularización de ejercicio y compruebas que genera el asiento 99999998.» → en el bloque siguiente la demo no genera ese asiento («no se vio ningún asiento de regularización (99999998)»). Un alumno que lo lance en su empresa no puede cumplir el CHECK. **Necesitaría:** cambiar el CHECK a «sabes que debería generar el 99999998 (la demo no lo genera)».
- [MOLESTO] (regularizacion-cierre-temporal / EXP 3-4) tipo 1: «Copia el asiento de resultados a origen y pasa los saldos a csaldos del ejercicio siguiente.» y «Los saldos de apertura quedan en los periodos especiales -1 y 0.» → «a origen», «csaldos», «periodos especiales -1 y 0» y «periodo 98» son jerga interna sin explicar. **Necesitaría:** quitar el detalle técnico o explicar en una línea: «periodo 98/99/0 = periodos especiales que el ERP reserva para regularización, cierre y apertura».
- [MOLESTO] (cierre-definitivo-resto / EXP 5) tipo 1: «según el maestro de deuda a largo plazo» y «área histórica» (y «según el patrón de cierre elegido» en regularización P1) → ninguna de las tres cosas se presenta como pantalla ni concepto. **Necesitaría:** una frase de qué es cada una y dónde se configura, o eliminarlas del texto de alumno.
- [MOLESTO] (procesos-periodicos-orden / P3 y regularizacion) tipo 6: «Regularización por ejercicio» (botón) frente a «Regularización ejercicio» (carpeta) y «Ajuste de cuentas en divisas» frente a «regularización de divisas» → el mismo proceso con tres nombres. **Necesitaría:** una tabla «concepto = nombre en menú = nombre del botón».
- [MOLESTO] (ver-fecha-pasada / P2) tipo 3: «Si el ejercicio ya se cerró, consulta el histórico de saldos.» → no se da ruta de menú ni nombre de pantalla del «histórico de saldos». **Necesitaría:** «Finanzas › Contabilidad General › Saldos › <nombre exacto>».
- [MOLESTO] (ver-fecha-pasada / P1) tipo 4: «consulta un periodo pasado, por ejemplo el periodo 12 de 2025» → los datos del alumno son de 2026 y no hay 2025 garantizado en su contexto. **Necesitaría:** usar «periodo 11 de 2026», que es donde tiene asientos.
- [MOLESTO] (concepto) tipo 7: «dejar a cero el resto de cuentas (bancos, clientes, proveedores…) con el asiento de cierre» frente al examen avanzada pregunta 9, que dice que las cuentas de balance «no se ponen a cero». Ver apartado de exámenes.

### contab-cierre-practica — Cerrar el ejercicio de tu empresa: regularizar y preparar el cierre
- [MOLESTO] (contab-cierre-practica-ejercicios / EXP 3 y P1 de -regularizar) tipo 4: «debería tener al menos un asiento de saldos iniciales y alguno de gasto o ingreso» y «si has hecho el de un gasto, ese también» frente al CONCEPTO «que solo tiene el asiento de saldos iniciales de 5.000,00 €». → S{INI} nunca tiene gastos ni ingresos (no hay bloque que los cree allí), así que la regularización no regulariza nada y el ejemplo 200 − 125 − 13,50 no se puede reproducir. **Necesitaría:** decirlo claro («tu empresa solo tiene balance: la regularización llevará 0 a la 129; lo importante es ver el cambio de estado») o añadir un asiento de gasto y otro de ingreso a hacer en S{INI}.
- [MOLESTO] (contab-cierre-practica-regularizar / AVISO problema) tipo 3: «La ficha de la empresa tiene vacío el campo «Programa regularización».» → ese campo no se ha presentado en Maestros (ficha de empresa) y no se indica cómo mirarlo. Además la solución es «consulta con el equipo de la demo». **Necesitaría:** pestaña/ruta donde ver el campo, o suprimir la referencia.
- [MOLESTO] (contab-cierre-practica-regularizar / EXP 4) tipo 1: «los periodos contables de enero a noviembre pasan a Cerrado. Diciembre sigue Abierto.» → ningún bloque previo (ni icon-contabilidad-2) dice que regularizar cierra periodos ni por qué diciembre queda abierto. **Necesitaría:** una frase («al regularizar, el ERP cierra los meses ya revisados; deja abierto el último para el asiento de cierre»).
- [MOLESTO] (regularizar / P2) tipo 2: «Abre el ejercicio 2026 de tu empresa y localiza los botones de cierre.» → no dice cómo se abre la ficha (clic en el número de fila de la lista, como en icon-contabilidad). **Necesitaría:** «pulsa el número de fila del ejercicio 2026».
- [MOLESTO] (regularizar / EXP 5, TEST 2) tipo 8: tras regularizar «se activan Reapertura y Cierre definitivo; se apagan Regularización y Reclasificación» → no dice si «Cierre temporal» queda activo; el test «Solo Cierre temporal» es ambiguo. **Necesitaría:** indicar el estado de los cinco botones tras regularizar.
- [MOLESTO] (regularizar / AVISO nota) tipo 2: «No se ha comprobado qué hace con los periodos que ya estaban cerrados.» → se pide pulsar una acción sin confirmación («se ejecuta al momento») cuyo deshacer no está verificado. **Necesitaría:** advertir antes del P3 de que la reapertura puede no reabrir enero-noviembre y decir a quién avisar.
- [MOLESTO] (icon-contabilidad / contab-saldos-iniciales CONCEPTO, referencia cruzada) tipo 6: «El asiento de apertura lo crea el ERP al cerrar un ejercicio (lo verás en «Cerrar el ejercicio de tu empresa»)» → en ese bloque el cierre definitivo no se ejecuta, así que el alumno nunca ve el asiento de apertura. **Necesitaría:** cambiar la promesa a «lo leerás explicado».

### icon-contabilidad-3 — Consultar balances y cuentas anuales
- [BLOQUEANTE] (icon-contabilidad-3-balances / AVISO 1 y PROB 1) tipo 2: «Calcula los saldos por agrupación antes de abrir el informe.» y, en el problema, «Calcula antes los saldos por agrupación del periodo.» → no hay paso, botón ni menú para calcularlos, y P3 dice a la vez «No los escribes aparte: son los mismos datos que pide la pantalla». Si el informe sale vacío, el alumno no sabe qué hacer. **Necesitaría:** decir si el cálculo es automático al ejecutar o dar la ruta exacta del proceso («Finanzas › … › Calcular saldos por agrupación») con sus parámetros.
- [BLOQUEANTE] (balances / CHECK 2 y P1-P2) tipo 3: «En Balances, abres un informe y compruebas que muestra Saldo anterior, Importe deudor, Importe acreedor, Saldo del período y Saldo acumulado.» → P1 solo enumera carpetas y P2 manda a «Por agrupación» (Situación financiera/Resultados integrales), que no es el informe con esas columnas. No se dice qué informe de Agregados/Por empresa abrir ni con qué filtros. **Necesitaría:** «Abre Balances › <carpeta> › <informe>, Empresa 0, Ejercicio 2026, periodos 1 a 12».
- [BLOQUEANTE] (cuentas-anuales / P1-P2) tipo 3: «Examina la estructura del Excel de cuentas anuales.» y «Localiza la pantalla de Cuentas Anuales e Informes» → no se da ningún fichero, captura ni ruta de menú (la ruta del apartado es solo la carpeta). El alumno no puede localizar ni el Excel ni la pantalla ni el botón «Ejecutar XLS». **Necesitaría:** ruta completa de «Cuentas Anuales e Informes» y qué plantilla abrir (nombre).
- [MOLESTO] (balances / P2 vs CHECK 5) tipo 7: «no hace falta ejecutarla» frente a «lanzas el Estado de Situación Financiera y anotas los parámetros que pide». → se pide lanzar y no lanzar. **Necesitaría:** unificar («ábrela y anota los cuatro parámetros; no la ejecutes en la demo»).
- [MOLESTO] (balances / EXP 3-5) tipo 1: «clasificador», «agrupación», «saldos por agrupación» y los niveles «Cuentas, Niveles o Jerarquías» no se definen (ni están en el glosario). **Necesitaría:** una frase: «una agrupación es la lista que dice qué cuentas suma cada línea del balance; el clasificador es el nombre de esa lista».
- [MOLESTO] (motor-consultas-excel / EXP 1-3, CHECK 8) tipo 7: «Hay tres funciones VBA.» pero solo se describen dos (la línea de AX_Saldo está duplicada); AXIONAL solo sale en CAMPO. El CHECK pide «localizas las funciones» y a la vez «En la demo está vacía («Sin datos»)»; el primer parámetro «tipo» (BALANCE) nunca se explica. **Necesitaría:** describir las tres funciones, quitar el duplicado, definir «tipo» y cambiar el CHECK a «sabes qué hace cada función».
- [MOLESTO] (balances / TEST 1) tipo 8: opciones «Directamente de los saldos de cada cuenta» y la correcta «De los saldos por agrupación calculados» → el texto dice «El ERP parte de los saldos de cada cuenta»; dos opciones son defendibles. **Necesitaría:** reformular la pregunta («¿qué dato usa el informe directamente?») o separar las opciones.
- [MOLESTO] (balances / TEST 2, P2 DET) tipo 8: «Los clasificadores BALANCE08 … son configuración interna: no salen en esta pantalla.» → se pregunta CTEPIG08, que el alumno nunca ve ni puede comprobar. **Necesitaría:** quitar la pregunta o mostrar dónde se ve.
- [MOLESTO] (consolidacion / CHECK 9, P1) tipo 3: «Las etapas y tareas están en la documentación (Visión general).» y CHECK «repasas las siete etapas» → no hay enlace ni pantalla con las siete etapas; en el menú solo hay cinco opciones y «Grupos consolidación», «Integración datos» no se explican. **Necesitaría:** poner las siete etapas en el propio bloque o enlazar la documentación, y una línea por cada opción de menú.

### caso-final — Caso final: tu empresa de principio a fin
- [BLOQUEANTE] (caso-final-banco-iva / P1, operación 11) tipo 7: «Da de alta el extracto en «Finanzas › Tesorería › Extractos bancarios › Almacén ficheros» y concílialo» → en Tesorería «tu banco BBVA_{INI} no recibe ficheros N43, así que no cargas ninguno» y solo se enseñó a crear a mano UNA línea (10,00) en «Extractos bancarios › Movimientos». Las otras cinco (3.000,00, −151,25, −3,50, +121,00, +121,00) no se explican: fecha, signo, concepto común/propio. Sin ellas no hay «seis líneas» ni 3.077,25. **Necesitaría:** una tabla con las seis líneas (fecha, concepto, importe con el signo de la base) y la ruta «Extractos bancarios › Movimientos» en lugar de «Almacén ficheros».
- [BLOQUEANTE] (caso-final-pagar-cobrar / P4, operación 10) tipo 3: «crea la remesa LRC{INI} con el efecto de 121,00» → LRC{INI} es una línea financiera, no una remesa; no se nombra el tipo (CSDDS); el cliente C{INI} no tiene IBAN ni se pide dárselo (el paso de preparar no lo comprueba), y Cartera avisa de que sin IBAN sale «Requiere la domiciliación bancaria del tercero!». **Necesitaría:** paso previo «añade IBAN de prueba a C{INI} en Datos bancarios y valida el tercero» y «tipo de remesa CSDDS, cuenta BBVA_{INI}».
- [BLOQUEANTE] (caso-final-pagar-cobrar / P4 y AVISO) tipo 7: «el asiento lleva 57200.00000 121,00 al debe y 43000.00901 121,00 al haber» y «la cuenta de tu cliente queda a cero» → Cartera avisa de que en la demo el cobro de la remesa SEPA lleva «la 23000, no la cuenta del cliente: es una anomalía de su plantilla». Con la anomalía el cliente no queda a cero ni cuadran las comprobaciones. **Necesitaría:** avisar en la operación 10 de la anomalía y dar la alternativa (cobrar el efecto 2 con gestión COBD) para que el banco siga en 3.077,25.
- [BLOQUEANTE] (caso-final-comprobar / P1-P3) tipo 2: «filtra por tus documentos (tu diario {INI} y tus justificantes)» → el Mayor de cuentas solo filtra empresa, fechas, cuenta, proyecto y sección. Solo la operación 1 está en el diario {INI}; los asientos de remesa, gestión y conciliación los crean plantillas con otros diarios, y la 57200 y el diario de la empresa 0 son compartidos. El alumno no puede aislar «sus» movimientos para ver 3.077,25. **Necesitaría:** para cada operación, el documento/justificante que la identifica (o comprobar el saldo en la ficha de BBVA_{INI}).
- [MOLESTO] (caso-final-vender / P1, operación 5) tipo 7: «la venta queda dos veces (70000 con 400,00 y 43090 con 200,00 al debe). En tu caso cuenta la venta una sola vez: 200,00.» → no se dice qué tipología/plantilla usar para que ocurra lo segundo; si el alumno usa FV, el resultado y las sumas y saldos no darán 61,50 ni 3.242,00. **Necesitaría:** indicar la tipología F{INI} y la plantilla (FVOA) exactas, o el asiento que el alumno debe ver.
- [MOLESTO] (caso-final-banco-iva / P2, operación 12) tipo 2: «prepara el modelo del cuarto trimestre» y luego «El asiento que anota la liquidación lleva…» → Impuestos dice «No está comprobado que el borrador del 303 lo contabilice: en el caso, lo anotas tú», pero aquí no se pide escribirlo ni en qué diario; y usa «47500 (475, …)» mientras Impuestos usa «4750». **Necesitaría:** paso explícito «escribe a mano el asiento de liquidación en tu diario {INI}» con las mismas cuentas que en Impuestos.
- [MOLESTO] (caso-final-pagar-cobrar / P1 y P2, operaciones 7 y 8) tipo 7: «la cuenta de tu flujo {INI}COM, por ejemplo la 62999.00000 que creaste en «Dar de alta una cuenta contable»» → en Tesorería el flujo usa un mnemotécnico que se traduce a una 626, y Contabilidad dice que la 62999 es «solo para practicar» y tiene grupo auxiliar (no guarda sin Auxiliar). La regularización final usa la «626». **Necesitaría:** una sola cuenta de gasto bancario en todo el caso y confirmar que no exige Auxiliar.
- [MOLESTO] (caso-final-comprar / P1, operación 1) tipo 2: «el capital (cuenta 100 del plan)» → en el ERP es 10000.00000 (como en saldos iniciales); no dice diario, fecha ni justificante. **Necesitaría:** «10000.00000, diario {INI}, fecha 01-10-2026, justificante {INI}».
- [MOLESTO] (caso-final-preparar / CAMPO proveedor, P2 de comprar) tipo 4: «Te vende el artículo 13500620» y «artículo 13500620» → de ese código no se dice de dónde sale; el contexto del curso dice que el artículo del alumno es ROD{INI} y «no se compra». **Necesitaría:** «el artículo 13500620 lo creaste en Compras › «Dar de alta el proveedor y el artículo»» (si es cierto) o usar ROD{INI}.
- [MOLESTO] (caso-final-pagar-cobrar / P1-P4) tipo 2: operaciones fechadas 06-11, 12-11, 14-11, 01-12, pero en «Gestiones sobre efectos» «La fecha de proceso es la de hoy» → el alumno no sabe que debe cambiar la fecha ni qué pasa con el periodo. **Necesitaría:** «pon Fecha proceso = fecha de la operación».
- [MOLESTO] (caso-final CONCEPTO y resumen / EXP 1) tipo 7: «4 unidades (preparar, comprar, vender y cobrar/pagar, y cerrar y comprobar)» frente a «preparar y comprar (operaciones 1 a 4), vender (5 y 6), pagar y cobrar (7 a 10) y, por último, conciliar … (11 a 13)». → las unidades no coinciden y el módulo tiene 7 apartados. **Necesitaría:** una sola lista de unidades.
- [MOLESTO] (caso-final-pagar-cobrar / P1, operación 7) tipo 2: «Neto: 400 151,25 y 626 3,50 al debe, 572 154,75 al haber» y «cuenta puente de la acción» → asiento denso y sin paso que registre los 3,50 de comisión (aparece al conciliar). **Necesitaría:** decir en qué momento se registra la comisión y quitar el «Neto».

## 10. Exámenes de módulo (app/src/content/examenes/)

### examenes/fundamentos.json — pregunta 10: «¿Qué haces con las cuentas de ingresos y gastos al cerrar el ejercicio?» → la respuesta («Las llevas a la 129 Resultado del ejercicio») usa una cuenta que fundamentos.txt nunca menciona (solo dice «cuenta de resultados»; «129» no sale). **Necesitaría:** nombrar la 129 en el apartado «Cierre del ejercicio» de Fundamentos.
### examenes/fundamentos.json — pregunta 8: «Cobras una factura de cliente de 121 € por transferencia. ¿Qué apuntes hace el asiento del cobro?» → Fundamentos solo enseña el asiento del pago a proveedor (400 debe / 572 haber); el cobro con 430 no se muestra, solo se nombra la 430. **Necesitaría:** un ejemplo de cobro (572 debe, 430 haber) en «Cobro, pago y efecto».

### examenes/maestros.json — pregunta 1: «¿Qué distingue un banco de una caja en el maestro de Bancos propios?» → el campo «Tipo de cuenta» no aparece en maestros.txt y la caja de efectivo se crea en Cartera (módulo 5, posterior). **Necesitaría:** quitar la pregunta o explicarlo en «Banco propio para remesas».
### examenes/maestros.json — pregunta 7: explicación «En una caja de efectivo se usa la 570.» → la 570 no se enseña en Maestros (solo se cita en Fundamentos); la respuesta correcta (572) sí está enseñada, falla solo la explicación. **Necesitaría:** quitar la mención o citar la caja.

### examenes/icon-contabilidad.json — pregunta 1: «En una factura, ¿qué confirma que ya está contabilizada?» → botón «Descontabilizar» de factura: no está en icon-contabilidad.txt (se practica en Compras, módulo 3, posterior). **Necesitaría:** moverla al examen de Compras.
### examenes/icon-contabilidad.json — pregunta 2: «¿Qué característica define a las facturas directas de Finanzas?» → «facturas directas» (FC/FB) no se enseñan en el módulo. **Necesitaría:** quitarla o explicarla.
### examenes/icon-contabilidad.json — pregunta 3: «En el SII español, ¿cuántas claves de rectificativa existen?» → R1 a R5 no se enseña (solo aparece SII en Impuestos, módulo 7). **Necesitaría:** moverla a Impuestos.
### examenes/icon-contabilidad.json — pregunta 4: «Una factura de importe total 0 ya está contabilizada y no aparece en la cartera.» → caso de factura a 0 sin cartera: no enseñado (Compras/Cartera, posteriores). **Necesitaría:** quitarla.
### examenes/icon-contabilidad.json — pregunta 10: «¿Qué ocurre si una cuenta con saldo no está configurada en ccuentas_agrupl?» → la tabla y las agrupaciones solo se tratan, sin nombre de tabla, en Contabilidad avanzada (módulo 9). **Necesitaría:** moverla a ese examen.
### examenes/icon-contabilidad.json — pregunta 13: «En una tipología documental, ¿qué indica el campo “Tabla origen”?» → solo hay un CHECK («revisa «Tabla origen»») sin explicación; en numeradores «Tabla origen» significa otra cosa («Documentos que numera»). **Necesitaría:** explicar el campo o quitar la pregunta.
### examenes/icon-contabilidad.json — pregunta 14: «¿Qué valores admite el campo “Actualización tabla origen” de una tipología?» → «Sumando/Restando» no está en el módulo (viene de Compras). **Necesitaría:** quitarla.
### examenes/icon-contabilidad.json — pregunta 15: «En una tipología sin documento origen, ¿qué ocurre con los campos “Actualización tabla origen” y “Copiar líneas”?» → no enseñado. **Necesitaría:** quitarla.
### examenes/icon-contabilidad.json — pregunta 16: «¿Qué comportamiento indica “Copiar líneas = Validar” en una tipología?» → no enseñado. **Necesitaría:** quitarla.
### examenes/icon-contabilidad.json — pregunta 17: «En la tipología de un documento, ¿para qué sirve la caja “Campos a ocultar”?» → no enseñado. **Necesitaría:** quitarla.
### examenes/icon-contabilidad.json — pregunta 18: «Cuando una condición de bloqueo de workflow no se cumple, ¿qué se requiere para continuar?» → workflow es del módulo Compras (posterior). **Necesitaría:** moverla.
### examenes/icon-contabilidad.json — pregunta 19: «¿Qué característica tienen los permisos estándar en los formularios de parametrización?» → solo se enseña el orden de permisos, no que los estándar sean intocables. **Necesitaría:** explicarlo o quitarla.
### examenes/icon-contabilidad.json — pregunta 21: «¿Cuáles son los estados posibles de un ejercicio contable?» → los estados Regularizado, Cerrado definitivamente y Traspasado al histórico solo se enseñan en el módulo 9. **Necesitaría:** moverla.
### examenes/icon-contabilidad.json — pregunta 22: «Al borrar un ejercicio contable, ¿qué se elimina?» → no hay ninguna parte que enseñe borrar ejercicios. **Necesitaría:** quitarla.
### examenes/icon-contabilidad.json — pregunta 23: «…¿dónde se indica la plantilla de contabilización que se utilizará?» → solo se dice «Para contabilizar hace falta una plantilla por cada origen», no que la tipología la contenga. **Necesitaría:** una frase que lo diga.
### examenes/icon-contabilidad.json — pregunta 28: «Un asiento en estado X (Intermedio), ¿qué efecto contable tiene?» → el estado X no se enseña (solo Provisional/Contabilizado) y la opción C («Acumula saldos y costes, y exige imp_cuadre = 0») es defendible. **Necesitaría:** quitarla.
### examenes/icon-contabilidad.json — pregunta 29: «¿Qué estados de asiento permiten guardar el asiento con imp_cuadre distinto de cero?» → estados P/X/C e «imp_cuadre» no se enseñan así. **Necesitaría:** quitarla.
### examenes/icon-contabilidad.json — pregunta 30: «¿Qué hace el proceso de descontabilización sobre un asiento contabilizado?» → el módulo enseña el botón «Abrir a provisional»; el proceso «Descontabilización» solo se nombra. **Necesitaría:** explicar el proceso.
### examenes/icon-contabilidad.json — pregunta 31: «Antes de lanzar una contabilización masiva, ¿qué debes revisar en los asientos filtrados?» → «imp_cuadre» y la contabilización masiva no se explican (solo se nombran los tres procesos). **Necesitaría:** explicarlo.
### examenes/icon-contabilidad.json — pregunta 33: «En copia masiva, ¿qué implica dejar Copiar todo = 0?» → el módulo da «Copiar todo» como Sí/No y nada sobre costes ni «concepto contable». **Necesitaría:** alinear pregunta y texto.
### examenes/icon-contabilidad.json — pregunta 34: «Si en 'Auditar seleccionados' un grupo de apuntes no cuadra al céntimo…» → «cuadrar al céntimo» no se enseña. **Necesitaría:** quitarla.
### examenes/icon-contabilidad.json — pregunta 35: «En la carga de asientos por plantilla, ¿qué sucede con las líneas que se dejan sin fecha?» → no hay bloque de carga de asientos por plantilla. **Necesitaría:** quitarla.
### examenes/icon-contabilidad.json — pregunta 36: «…¿qué mensaje aparece si el total del Debe no coincide con el total del Haber?» → no enseñado. **Necesitaría:** quitarla.
### examenes/icon-contabilidad.json — pregunta 37: «En un fichero de carga de asientos por plantilla, ¿cómo debe informarse la cuenta contable?» → no enseñado. **Necesitaría:** quitarla.
### examenes/icon-contabilidad.json — pregunta 38: «Si un fichero de carga de asientos por plantilla contiene varios asientos, ¿qué dato debe informarse…?» → no enseñado. **Necesitaría:** quitarla.
### examenes/icon-contabilidad.json — pregunta 39: «¿Cuál de estas situaciones bloquea el borrado de un asiento?» → no se enseña a borrar asientos (solo «Abrir a provisional» con periodo cerrado). **Necesitaría:** quitarla.
### examenes/icon-contabilidad.json — pregunta 40: «¿Qué estado de asiento se debe filtrar para lanzar correctamente una descontabilización masiva?» → no enseñado. **Necesitaría:** quitarla.
### examenes/icon-contabilidad.json — pregunta 12: «¿Qué puede provocar que la serie de un numerador incluya #d pero la máscara de número no lo incluya?» → la respuesta es correcta, pero la explicación habla de «delegación» y el módulo dice «#d el diario». **Necesitaría:** cambiar «delegación» por «diario».

### examenes/carteras.json — pregunta 7: «Los indicadores «propuesto» y «ordenado» de un efecto ayudan a…» → solo se enseñan los estados PR y OC, no que sean indicadores de bloqueo contra gestiones simultáneas. **Necesitaría:** explicarlo en estados de efecto.
### examenes/carteras.json — pregunta 10: «En una remesa abierta, ¿qué hace el icono de papelera sobre un efecto ya agregado?» → la papelera no aparece en carteras.txt (solo «Desagregar efectos» y «Retroceder»). **Necesitaría:** enseñarla o quitar la pregunta.
### examenes/carteras.json — pregunta 18: «¿Qué efectos admite la selección de una remesa?» → «misma sociedad y clase, no caducados y no remesados» no está dicho para remesas (solo «misma empresa» en reclasificaciones y que solo salen los domiciliados). **Necesitaría:** añadir la regla al bloque de remesas.

### examenes/tesoreria.json — pregunta 10: «¿Qué botón del movimiento manual de tesorería permite volver a calcular las comisiones bancarias?» → el botón «Recalcular comisión» no aparece en tesoreria.txt. **Necesitaría:** nombrar el botón en «Registrar un movimiento manual».
### examenes/tesoreria.json — pregunta 17: «Al confirmar un traspaso entre dos cuentas de la misma empresa, ¿cuántos movimientos de tesorería se generan?» → «Traspasos bancarios» solo se nombra en el menú. **Necesitaría:** explicarlo o quitarla.

### examenes/icon-impuestos.json — pregunta 3: «¿Cuál de las siguientes es una base de cálculo posible en un tipo de impuesto?» → el módulo solo dice «normalmente Importe neto»; la lista de bases (incluida «Importe con impuestos») no se enseña. **Necesitaría:** listar las bases posibles.

### examenes/icon-activos.json — sin fallos: las 16 preguntas se enseñan en icon-activos.txt y sus respuestas correctas coinciden.

### examenes/contabilidad-avanzada.json — pregunta 9: «Al cerrar el ejercicio, ¿qué pasa con los saldos de las cuentas de balance, como Bancos o Clientes?» → la explicación dice «Las cuentas de balance no se ponen a cero» pero el módulo enseña «dejar a cero el resto de cuentas (bancos, clientes, proveedores…) con el asiento de cierre» y el caso final «Cierre = Deja el balance a cero». **Necesitaría:** unificar (el cierre las deja a cero y la apertura las vuelve a abrir) y reescribir la explicación.
### examenes/contabilidad-avanzada.json — pregunta 2: «…¿cuál es el orden correcto de los procesos principales del cierre?» → la respuesta incluye «reapertura» antes del «cierre definitivo», pero el bloque práctico enseña regularizar → cierre definitivo, y la reapertura solo si te equivocas. **Necesitaría:** matizar «reapertura solo si estaba cerrado temporalmente».

## Nota de verificación

He comprobado a mano en el texto una muestra de los bloqueantes: la cuenta 62999.00001 como alternativa común, «hasta 2026» frente a «2019 a 2027», la cuenta 4750 sin código de demo, FACT0000044, el caso final con seis líneas en «Almacén ficheros» frente a «BBVA_{INI} no recibe ficheros N43», el efecto 00087 y PRVCC0 del vídeo, la clave SOE frente a SOR y la pregunta de SII sin enseñar (0 apariciones). Todas son ciertas. Matiz: «4750 Hacienda Pública, acreedora por IVA» es la cuenta correcta del PGC; el problema es que no se da el código de la demo (lo dejo como atasco).
