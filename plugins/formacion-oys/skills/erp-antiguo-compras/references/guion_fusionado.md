# Guion fusionado · «Compras en el ERP: de la tarifa a la factura»

Vídeo-tutorial NUEVO que fusiona y reordena las dos grabaciones Loom de la versión antigua del ERP (Deister, entorno «O&S Learning (Test)», diciembre de 2015):

- **v1** «Gestión de compras: pedidos, albaranes y facturas» (14 min) — `media/src/d5fa69379c7249d39e647c155c18476e.mp4`
- **v2** «Tarifas y documentos de compra en el sistema» (1 h 46 min, continuación de v1) — `media/src/892906aeff8347e98a952208dbb5682b.mp4`

Voz: `es-ES-XimenaNeural` (castellano de España, tuteo). **125 escenas, 67 clips de pantalla, 9 capítulos, duración estimada ≈ 34 min** (estimación a 2,45 palabras/s, la velocidad medida de Ximena en la demo, más entrada 0,6 s + colchón 1,3 s por escena y 0,8 s de solape por transición). El JSON del motor está en `video/src/data/guion.json` (el ejemplo anterior se guardó como `guion.ejemplo.json`).

## Cómo leer este guion

- **Qué se hace**: el paso de negocio, redactado sin depender de la pantalla antigua. Es lo que la sesión de la versión nueva debe volver a grabar.
- **SIN PANTALLA**: el paso existe en el procedimiento, pero no aparece en los vídeos de origen. En el vídeo antiguo se dice así, sin inventarlo; en la versión nueva **hay que grabarlo**.
- **Qué se ve**: escena del motor. En las de `pantalla`: vídeo de origen, tramo (h:mm:ss y segundos), recorte `x,y,w,h` sobre 1680×1048, zooms y callouts. El motor numera solo los callouts de cada escena (1, 2, 3…) y el `etiqueta` de la escena da el paso global («Crear el pedido · paso 3 de 7»).
- Todos los tramos y recortes se comprobaron sobre fotogramas reales (ver «Verificación»). Las anotaciones están en `kb/verif/clips/<id>_{a,b,c}.jpg` (inicio, mitad y final de cada clip, con el recorte y los callouts dibujados).

## Índice de capítulos

| Cap. | Título | Escenas | Clips | Duración estimada |
|---|---|---|---|---|
| — | Apertura | 3 | 0 | 0 min 56 s |
| 1 | El ciclo de compra | 5 | 1 | 1 min 15 s |
| 2 | Tarifas | 13 | 6 | 4 min 32 s |
| 3 | Dónde se aplica la tarifa | 16 | 8 | 4 min 05 s |
| 4 | Tipos de documento y series | 13 | 6 | 3 min 44 s |
| 5 | El tipo de pedido por dentro | 13 | 6 | 4 min 19 s |
| 6 | Crear y validar el pedido | 16 | 12 | 3 min 43 s |
| 7 | Del pedido al albarán | 20 | 14 | 5 min 00 s |
| 8 | Del albarán a la factura | 21 | 14 | 5 min 03 s |
| 9 | Resumen final | 5 | 0 | 1 min 16 s |
| | **Total** | **125** | **67** | **33 min 55 s** |

## Procedimientos paso a paso (resumen para la versión nueva)

**Consultar una tarifa**
- Abre Precios › Registro — Navegar a Compras › Maestros › Tarifas › Precios › Registro. *(v1 8:21; `menu-tarifas`)*
- La cabecera: tarifa COMPRA — Consultar una tarifa: código, divisa, fecha inicio/fin, parámetros de aplicación (prioridad, días). Identificar si está vigente. *(v1 9:01; `cabecera-compra`)*
- Las líneas de la tarifa — Revisar columnas de línea: artículo, unidad, inicio/fin vigencia, precio, precio unitario, descuento tarifa, descuento comercial, IVA incluido, precio neto. *(v1 9:01; `lineas-compra`)*
- Una línea por dentro: COCHE A6 en G00003 — Entrar en una línea de tarifa: artículo, unidad, vigencia, precio; existe el botón «Escalado de precios». *(v1 10:00; `linea-a6`)*
- Descuentos generales de la línea — Revisar los descuentos de una línea: orden, valor, fórmula (porcentaje), tipo (escalado), base de cálculo, canal y período de liquidación. *(v1 10:40; `descuentos-generales`)*

**Sin pantalla**
- Alta de una tarifa nueva — Crear tarifa: nueva cabecera (código, divisa, fechas) y añadir líneas (artículo, unidad, vigencia, precio). Grabar en la versión nueva. *(SIN PANTALLA; `sp-alta-tarifa`)*
- Cómo llegar a Terceros — Abrir el maestro de Terceros y buscar el proveedor. *(SIN PANTALLA; `sp-terceros`)*
- Crear una serie nueva — Crear una serie (tabla, código, numerador, justificación, separador, control cronológico, renovación, máscara) y asignarla al tipo de documento. *(SIN PANTALLA; `sp-alta-serie`)*
- Añadir el workflow al tipo FCA — En la tipología de facturas FCA, informar Tipo workflow (control importe proveedor = importe calculado). *(SIN PANTALLA; `sp-workflow-fca`)*

**Ventas**
- La ficha de la delegación — Abrir una delegación y localizar Condiciones comerciales (tarifa precios, tarifa descuento, descuentos familia). *(v2 1:40; `delegacion`)*

**Asignar tarifa**
- Abre el tercero y su pestaña Proveedores — En la ficha del tercero, pulsar la pestaña Proveedores. *(v2 7:19; `prov-paso1`)*
- Busca Tarifa precios en Datos económicos — En Datos económicos, localizar Tarifa precios y abrir su lista. *(v2 7:28; `prov-paso2`)*
- Elige la tarifa vigente — Seleccionar en la lista la tarifa de compra vigente. *(v2 7:43.5; `prov-paso3`)*
- Graba: el proveedor ya tiene su tarifa — Grabar el proveedor con la nueva tarifa de precios. *(v2 7:49; `proveedor-tarifa`)*

**Definir la serie**
- Abre Maestros › Documentos › Pedidos — Navegar a Compras › Maestros › Documentos e identificar los tipos de pedido, albarán y factura. *(v1 2:44; `menu-documentos`)*
- Dos tipos de pedido — Abrir la tipología de pedidos de compra y ver los tipos existentes. *(v2 17:50; `tipos-pedido-lista`)*
- La ficha del tipo PC — Abrir el tipo de pedido: código, descripción, serie, estado (activo/no activo). *(v2 18:08; `ficha-pc`)*
- Abre la lista de series — Desde el campo Serie del tipo de documento, abrir la lista de series y entrar en la serie. *(v2 19:15; `abrir-serie`)*
- La serie de numeración — Desde Serie, abrir Series de justificantes: tabla, serie, numerador, justificación, excluir separador, control cronológico, renovación, fechas. *(v2 20:40; `serie-ficha`)*

**Configurar el tipo**
- Documento origen — Definir si el pedido tiene documento origen (ninguno / solicitud de compra) y la condición de selección. *(v2 30:52; `documento-origen`)*
- Valoración — Elegir la fecha de valoración (inicio, fin, documento, no valorar) y marcar Valorar. *(v2 32:17; `valoracion`)*
- Clases de pedido — Elegir la clase del tipo de pedido (Normal, Reposición, Programación, Muestras). *(v2 39:56; `tipos-pedido`)*
- Validar catálogo — Limitar los artículos pedibles al catálogo de la delegación/almacén (Validar catálogo). *(v2 18:08; `validar-catalogo`)*
- Impresión de documentos — Asociar al tipo de pedido el objeto (formato) de impresión. *(v2 49:38; `impresion`)*
- Workflow y campos a ocultar — Asignar el tipo de workflow y elegir qué campos de línea se ocultan en este tipo de pedido. *(v2 1:02:38; `campos-ocultar`)*

**Crear el pedido**
- Abre Compras › Pedidos › Registro — Abrir Compras › Pedidos › Registro. *(v2 51:10; `menu-pedidos`)*
- Pulsa Nuevo — En el registro de pedidos, pulsar Nuevo. *(v2 51:58; `ped-nuevo`)*
- Rellena la unidad de negocio y las fechas — Nuevo pedido: tipo, empresa, delegación, departamento, almacén; fechas de pedido y entrega; serie (número al guardar); origen, referencia, clasificación. *(v2 54:32; `alta-cabecera`)*
- Elige el proveedor — Informar el proveedor (Pedir a) y revisar Recepcionar en. *(v2 55:56; `ped-proveedor`)*
- Elige la dirección del proveedor — Elegir proveedor y su dirección (0 = fiscal); revisar Pedir a / Facturado por / Recepcionar en / Enviar a. *(v2 56:06; `proveedor-direccion`)*
- Guarda: el pedido recibe número — Guardar la cabecera; comprobar número asignado y estado inicial. *(v2 57:54; `ped-guardar`)*
- Añade la línea del COCHE A6 — Añadir línea: artículo y cantidad; el precio se propone desde la tarifa del proveedor; importe neto calculado. *(v2 1:00:12; `lineas-a6`)*
- Añade el COCHE A4, sin tarifa — Añadir un artículo sin tarifa: precio 0, teclear el precio pactado; observar la numeración de líneas. *(v2 1:01:46; `lineas-a4`)*

**Validar el pedido**
- Pulsa >3000€ Autorizar — Con el pedido bloqueado por el workflow, lanzar la autorización e indicar el motivo. *(v2 1:08:04; `val-paso1`)*
- Aprobaciones encadenadas — Ejecutar las aprobaciones sucesivas del workflow. *(v2 1:08:20; `val-paso2`)*
- Confirma el envío — Enviar el pedido al proveedor y confirmar el envío. *(v2 1:08:45; `val-paso3`)*
- Pedido validado — Comprobar estado Validado e importe neto. *(v2 1:09:56; `pedido-validado`)*

**Crear el albarán**
- Abre Compras › Albaranes › Registro — Abrir Compras › Albaranes › Registro. *(v2 1:18:32; `alb-menu`)*
- Nuevo albarán de tipo RC — Nuevo albarán: tipo RC, empresa/delegación/almacén, fecha de recepción; informar Origen. *(v2 1:19:46; `alta-albaran`)*
- El origen es obligatorio — Informar el campo Origen (obligatorio en el tipo RC). *(v2 1:20:06; `alb-origen-obligatorio`)*
- Elige el pedido de origen — Seleccionar el pedido de origen (mismo empresa/delegación/departamento); se heredan proveedor, divisa, tipo de efecto y forma de pago. *(v2 1:20:26; `popup-pedidos`)*
- Datos heredados del pedido — Comprobar los datos heredados del pedido. *(v2 1:20:50; `alb-heredados`)*
- Inserta el albarán — Insertar (grabar) la cabecera del albarán. *(v2 1:21:10; `alb-insertar`)*
- Albarán creado: pulsa Agregar líneas pedido — Guardar la cabecera del albarán; localizar «Agregar líneas pedido». *(v2 1:21:33; `albaran-guardado`)*

**Agregar líneas del pedido**
- Agregar las líneas del pedido — Agregar líneas del pedido: marcar, ajustar la cantidad recibida, agregar; lo no recibido queda pendiente. *(v2 1:23:16; `agregar-lineas`)*

**Contabilizar el albarán**
- Pulsa Contabilizar — Contabilizar el albarán y abrir la pestaña Apuntes. *(v2 1:29:29; `alb-contabilizar`)*
- Consulta el asiento — Contabilizar el albarán y consultar el asiento (pestaña Apuntes). *(v2 1:29:55; `asiento-albaran-pantalla`)*

**Registrar la factura**
- Abre Compras › Facturas › Registro — Abrir Compras › Facturas › Registro. *(v2 1:35:24; `fac-menu`)*
- Nueva factura: falta el número del proveedor — Nueva factura de tipo FCA; el número de factura del proveedor es obligatorio. *(v2 1:35:56; `fac-obligatorio`)*
- Teclea el número del proveedor — Informar el número de factura del proveedor. *(v2 1:36:19; `fac-numero`)*
- Elige el proveedor y teclea el importe — Nueva factura: tipo FCA; número de factura del proveedor (obligatorio, único por proveedor y fecha); proveedor; importe total de la factura en papel. *(v2 1:36:56; `alta-factura`)*

**Conformar albaranes**
- Conformar albaranes — Abrir «Conformar albaranes» y elegir la opción. *(v2 1:37:40; `conformar-menu`)*
- Elegir el albarán — Marcar uno o varios albaranes del proveedor y conformar. *(v2 1:38:00; `conformar-rejilla`)*
- Resultado: líneas e impuestos copiados — Comprobar líneas, base imponible, cuota de IVA y total calculado tras conformar. *(v2 1:38:53; `factura-impuestos`)*

**Resolver el error 3000**
- Si sale el CRC, recarga — Pulsar «Forzar actualización de datos» (Alt+R). *(v2 1:42:20; `forzar-actualizacion`)*
- Valida: factura bloqueada — Validar la factura y leer el motivo del bloqueo (código 3000). *(v2 1:42:45; `err-validar`)*
- Corrige el importe — Corregir el importe de la factura y validar de nuevo. *(v2 1:43:34; `err-corregir`)*

**Contabilizar la factura**
- Contabiliza con fecha — Contabilizar la factura indicando la fecha de contabilización. *(v2 1:45:24; `fac-contabilizar`)*
- Consulta el asiento de la factura — Contabilizar la factura y revisar su asiento. *(v2 1:45:44; `asiento-factura-pantalla`)*

## Apertura  (≈ 0 min 56 s)

### 1. `portada` · portada · Compras en el ERP — *Tutorial · Módulo de Compras*  (≈ 18 s)

**Narración:** ¡Hola! Soy Ximena y te acompaño en este tutorial de compras. Vamos a recorrer, con calma y con un ejemplo real, todo el camino de una compra: desde el precio de la tarifa hasta el asiento de la factura.

**Qué se ve:**
- Portada: «Compras en el ERP» — Tarifas, pedidos, albaranes y facturas

### 2. `mapa` · conceptos · Qué vas a aprender  (≈ 17 s)

**Qué se hace:** Presentar el índice del tutorial.

**Narración:** Primero verás las tarifas, porque de ellas sale el precio. Después, los tipos de documento y sus series de numeración. Luego crearemos y validaremos un pedido. Y para terminar, el albarán y la factura, hasta los asientos contables.

**Qué se ve:**
- Tarjetas: Tarifas (De dónde sale el precio) · Tipos y series (Cómo se numeran los documentos) · El pedido (Crearlo, valorarlo y validarlo) · Albarán y factura (Recibir, conformar y contabilizar)

### 3. `ejemplo` · conceptos · El ejemplo que seguiremos  (≈ 23 s)

**Qué se hace:** Fijar los datos de ejemplo: un proveedor con tarifa, dos artículos (uno en la tarifa y otro no), una empresa con su delegación y almacén.

**Narración:** Usaremos los datos de un entorno de formación de una versión anterior del ERP. Compraremos al proveedor SEAT dos modelos de coches, el A6 y el A4, para la empresa 01, delegación y almacén D cero uno. Los nombres son de prueba; lo que cuenta es el circuito.

**Qué se ve:**
- Tarjetas: Proveedor P00001 · SEAT · Artículos COCHE A6 y COCHE A4 · Empresa 01 · Delegación D01 · Almacén D01

> **Nota de revisión:** Los datos son de demo y alguno es poco realista (ver capítulo 2).

## Capítulo 1 · El ciclo de compra  (≈ 1 min 15 s)

### 4. `cap1` · capitulo · El ciclo de compra  (≈ 4 s)

**Narración:** Capítulo uno: el ciclo de compra.

**Qué se ve:**
- Capitulo: «El ciclo de compra» — Pedido, albarán y factura

### 5. `ciclo` · flujo · Tres documentos, un mismo circuito  (≈ 26 s)

**Qué se hace:** Explicar el ciclo Pedido → Albarán → Factura y qué representa cada documento.

**Narración:** El ciclo básico tiene tres documentos. En el pedido dices qué quieres comprar y a qué proveedor. El albarán le cuenta al sistema que la mercancía ha llegado. Y la factura recoge tu compromiso de pago. ¿Ves que los importes no coinciden? Llegaron menos coches de los pedidos y la factura lleva IVA. Lo entenderás paso a paso.

**Qué se ve:**
- Flujo 3D: Pedido [151201PC000003] 10.000 € → Albarán [201501RC-000002] 9.000 € → Factura [FACT-1] 10.890 €

> **Nota de revisión:** Importes reales del ejemplo: pedido 10.000 (sin IVA), albarán 9.000 (3 de 4 COCHE A4), factura 10.890 (9.000 + 21 % IVA).

### 6. `antes` · estructura · Antes del primer pedido  (≈ 19 s)

**Qué se hace:** Repasar los requisitos previos: maestros (artículo, proveedor, tarifa) y parametrización (tipo de documento, serie, workflow).

**Narración:** Para que todo esto funcione tiene que existir algo antes. En los maestros: el artículo, el proveedor y su tarifa de compra. Y en la parametrización: el tipo de documento, su serie de numeración y, si lo hay, el workflow de aprobación.

**Qué se ve:**
- Árbol: Lo que debe existir → Maestros: Artículo, Proveedor, Tarifa de compra; Parametrización: Tipo de documento, Serie de numeración, Workflow

### 7. `menu-compras` · pantalla · El módulo de Compras  (≈ 14 s)

**Qué se hace:** Abrir el módulo Compras y localizar sus carpetas y Maestros › Tarifas / Documentos.

**Narración:** Todo el circuito vive en el módulo de Compras. Cada documento tiene su carpeta: concursos, ofertas, pedidos, albaranes, facturas… Y en maestros encontrarás las tarifas y los tipos de documento.

**Qué se ve:**
- Clip **v1** 2:16–2:19.5 (136–139.5 s, 3.5 s); recorte `0,115,1080,640` sobre 1680×1048; panel 3D «El módulo de Compras».
- Zoom a `0,260,420,360` al decir «carpeta»
- Callout 1: «Compras» → `20,274,340,24` («compras»)
- Callout 2: «Una carpeta por documento» → `20,300,300,242` («carpeta»)
- Callout 3: «Maestros: Tarifas y Documentos» → `20,542,300,66` («maestros»)

### 8. `repaso-cap1` · resumen ·  — *Capítulo 1*  (≈ 16 s)

**Narración:** En resumen: el pedido dice qué compras y a quién, el albarán registra lo que ha llegado y la factura lo que debes pagar. Y antes de empezar, maestros y parametrización.

**Qué se ve:**
- Checklist: Pedido: qué compras y a quién · Albarán: lo que ha llegado · Factura: lo que debes pagar · Antes: maestros y parametrización

## Capítulo 2 · Tarifas  (≈ 4 min 32 s)

### 9. `cap2` · capitulo · Tarifas  (≈ 4 s)

**Narración:** Capítulo dos: las tarifas.

**Qué se ve:**
- Capitulo: «Tarifas» — Cabecera, líneas, descuentos y escalados

### 10. `tarifa-concepto` · conceptos · ¿Qué es una tarifa?  (≈ 26 s)

**Qué se hace:** Explicar que la tarifa se crea de forma independiente y se le asocian artículos; tipos (precios / descuentos); vigencia.

**Narración:** Una tarifa es un concepto aparte: se define sola, con su código y sus condiciones, y después se le cuelgan los artículos. No vas del artículo a la tarifa, sino al revés. Un mismo artículo puede estar en varias tarifas, de compra o de venta. Las hay de precios y de descuentos. Y todas tienen fechas de validez.

**Qué se ve:**
- Tarjetas: Se define sola (Código y condiciones; luego, sus artículos) · Un artículo, varias tarifas (De compra, de venta…) · Precios o descuentos (Dos clases de tarifa) · Con vigencia (Fechas de inicio y fin)

### 11. `articulo-sin-precio` · pantalla · La ficha del artículo  (≈ 22 s)

**Qué se hace:** Abrir un artículo y comprobar que no tiene campo de tarifa ni precio de compra; sí unidades y proveedores.

**Narración:** Fíjate en la ficha de un artículo. Tiene su código, su unidad base y las unidades de precios o de compras. Lo que no tiene es un precio de compra: el precio no vive en el artículo, vive en la tarifa. Más abajo, eso sí, aparecen sus proveedores.

**Qué se ve:**
- Clip **v1** 7:04–7:11.5 (424–431.5 s, 7.5 s); recorte `0,88,1680,918` sobre 1680×1048; panel 3D «La ficha del artículo».
- Zoom a `0,230,1680,320` al decir «unidad»
- Zoom de vuelta al plano general al decir «abajo»
- Callout 1: «Artículo COCHE A3» → `4,290,860,24` («código»)
- Callout 2: «Unidad base UNI» → `866,290,100,24` («unidad base»)
- Callout 3: «Unidades de precios, compras…» → `836,436,830,92` («unidades de»)
- Callout 4: «Proveedores habituales» → `0,734,1680,74` («abajo»)

> **Nota de revisión:** Clip cortado antes de 435 s, cuando se despliega el menú «Características» sobre la ficha.

### 12. `anatomia` · estructura · Anatomía de una tarifa de compra  (≈ 24 s)

**Qué se hace:** Describir la estructura: cabecera (código, divisa, validez, prioridad, días), líneas (artículo, unidad, vigencia, precio) y descuentos por línea.

**Narración:** Una tarifa tiene tres partes. La cabecera, con el código, la divisa, las fechas de validez, la prioridad y los días en que se aplica. Las líneas, una por artículo, con su unidad, su vigencia y su precio. Y por línea, los descuentos generales, que pueden ir por escalones y ser de tipo escalado.

**Qué se ve:**
- Árbol: Tarifa de compra → Cabecera: Código y divisa (EUR), Fechas de validez (inicio → fin), Prioridad y días (lunes a domingo); Líneas: Artículo y unidad, Vigencia de la línea, Precio y descuentos; Descuentos: Descuentos generales (−10 % · −12 %), Escalado (según cantidad)

### 13. `menu-tarifas` · pantalla · Abre Precios › Registro — *Consultar una tarifa · paso 1 de 5*  (≈ 13 s)

**Qué se hace:** Navegar a Compras › Maestros › Tarifas › Precios › Registro.

**Narración:** Las tarifas de compra están en Compras, maestros, tarifas. Verás tres entradas: condiciones de tarifado, precios y descuentos. Para mantener precios entra en precios y después en registro.

**Qué se ve:**
- Clip **v1** 8:21–8:32 (501–512 s, 11.0 s); recorte `0,115,1080,640` sobre 1680×1048; panel 3D «Abre Precios › Registro».
- Zoom a `0,330,420,300` al decir «tres»
- Callout 1: «Condiciones tarifados» → `70,370,240,22` («condiciones»)
- Callout 2: «Precios › Registro» → `70,392,220,88` («precios»)
- Callout 3: «Descuentos» → `70,480,200,22` («descuentos»)
- Foco en (140,425) al decir «registro»

### 14. `cabecera-compra` · pantalla · La cabecera: tarifa COMPRA — *Consultar una tarifa · paso 2 de 5*  (≈ 32 s)

**Qué se hace:** Consultar una tarifa: código, divisa, fecha inicio/fin, parámetros de aplicación (prioridad, días). Identificar si está vigente.

**Narración:** Esta es la cabecera de la tarifa COMPRA: su código, la divisa en euros y las fechas de validez, del 1 de abril al 31 de agosto de 2015. Ya estaba caducada. En los parámetros de aplicación hay una prioridad, cuyo uso no se explica en la grabación, y los días de la semana, aquí de lunes a viernes. En la vista, la otra tarifa, G cero cero cero cero tres, sigue vigente.

**Qué se ve:**
- Clip **v1** 9:01–9:37 (541–577 s, 36.0 s, velocidad ×1.35); recorte `0,88,1680,918` sobre 1680×1048; panel 3D «La cabecera: tarifa COMPRA».
- Zoom a `820,250,740,90` al decir «fechas»
- Zoom a `0,320,1680,90` al decir «parámetros»
- Zoom de vuelta al plano general al decir «vista»
- Callout 1: «COMPRA · EUR» → `0,264,740,50` («código»)
- Callout 2: «01-04-2015 → 31-08-2015» → `1245,262,300,52` («fechas»)
- Callout 3: «Prioridad 0 · lunes a viernes» → `0,344,1680,52` («parámetros»)
- Callout 4: «COMPRA caducada · G00003 vigente» → `0,540,1680,52` («vista»)

> **Nota de revisión:** La prioridad entre tarifas no se explica en las fuentes: no se afirma su efecto.

### 15. `lineas-compra` · pantalla · Las líneas de la tarifa — *Consultar una tarifa · paso 3 de 5*  (≈ 30 s)

**Qué se hace:** Revisar columnas de línea: artículo, unidad, inicio/fin vigencia, precio, precio unitario, descuento tarifa, descuento comercial, IVA incluido, precio neto.

**Narración:** Debajo están las líneas. Cada una lleva el artículo y la unidad en que se da el precio; en clase se puso el ejemplo de la unidad, la caja o el palé. Después, la vigencia de la línea, que por defecto hereda la de la cabecera; el precio y el precio unitario; y el descuento de tarifa y el comercial. En esta tarifa, el COCHE A6 vale 35.000 euros.

**Qué se ve:**
- Clip **v1** 9:01–9:37 (541–577 s, 36.0 s, velocidad ×1.45); recorte `0,88,1680,918` sobre 1680×1048; panel 3D «Las líneas de la tarifa».
- Zoom a `0,610,1680,330` al decir «líneas»
- Callout 1: «Artículo y unidad» → `30,624,750,30` («artículo»)
- Callout 2: «Vigencia de la línea» → `780,624,176,30` («vigencia»)
- Callout 3: «Precio y precio unitario» → `956,624,226,30` («precio»)
- Callout 4: «Dto. tarifa · Dto. comercial» → `1182,624,198,30` («descuento de»)
- Callout 5: «COCHE A6 · 35.000» → `0,710,1182,26` («35.000»)

### 16. `linea-a6` · pantalla · Una línea por dentro: COCHE A6 en G00003 — *Consultar una tarifa · paso 4 de 5*  (≈ 23 s)

**Qué se hace:** Entrar en una línea de tarifa: artículo, unidad, vigencia, precio; existe el botón «Escalado de precios».

**Narración:** Ahora abrimos una línea de la otra tarifa, la G cero cero cero cero tres. Es el mismo COCHE A6, en unidades, vigente hasta el año 3000. Y el precio es de 2.000 euros. Arriba tienes además un botón de escalado de precios, que en la grabación no se llega a abrir.

**Qué se ve:**
- Clip **v1** 10:00–10:25 (600–625 s, 25.0 s, velocidad ×1.3); recorte `0,88,1680,918` sobre 1680×1048; panel 3D «Una línea por dentro: COCHE A6 en G00003».
- Zoom a `0,360,1680,100` al decir «línea»
- Callout 1: «COCHE A6 · UNI» → `4,408,560,30` («COCHE»)
- Callout 2: «01-04-2015 → 01-01-3000» → `795,408,250,30` («vigente»)
- Callout 3: «Precio 2.000» → `1060,406,300,34` («2.000»)
- Callout 4: «Escalado de precios» → `4,320,150,24` («escalado de»)

### 17. `a6-dos-precios` · comparativa · Mismo artículo, dos tarifas, dos precios  (≈ 28 s)

**Qué se hace:** Explicar que el precio depende de la tarifa aplicada; comparar dos tarifas del mismo artículo.

**Narración:** Ojo: el mismo COCHE A6 vale 35.000 euros en una tarifa y 2.000 en la otra. No es un fallo: son dos tarifas distintas con datos de prueba poco realistas. Lo importante: el precio del pedido depende de la tarifa vigente del proveedor. En nuestro ejemplo es la G cero cero cero cero tres, a 2.000 euros, y esa es la cifra que seguiremos.

**Qué se ve:**
- Comparativa «Tarifa COMPRA» / «Tarifa G00003»: Validez: Hasta 31-08-2015 | Hasta 01-01-3000; Días: Lunes a viernes | Los siete días; COCHE A6: 35.000 € | 2.000 €; En el ejemplo: Caducada | La que usa el pedido

> **Nota de revisión:** CORRECCIÓN: en los originales la diferencia 35.000 / 2.000 no se comenta. Se presenta como dos tarifas distintas con datos de demo y se fija 2.000 (G00003) como precio del ejemplo, que es el que aparece después en el pedido.

### 18. `descuentos-generales` · pantalla · Descuentos generales de la línea — *Consultar una tarifa · paso 5 de 5*  (≈ 26 s)

**Qué se hace:** Revisar los descuentos de una línea: orden, valor, fórmula (porcentaje), tipo (escalado), base de cálculo, canal y período de liquidación.

**Narración:** Debajo de la línea están los descuentos generales: dos escalones de descuento comercial, del 10 y del 12 por ciento. Son de tipo escalado, es decir, según la cantidad, sobre el precio base; los tramos no se llegan a ver. Y un aviso: en el pedido del ejemplo el A6 entra a 2.000 euros justos, sin descuento en la línea.

**Qué se ve:**
- Clip **v1** 10:40–11:08 (640–668 s, 28.0 s, velocidad ×1.25); recorte `0,88,1680,918` sobre 1680×1048; panel 3D «Descuentos generales de la línea».
- Zoom a `0,770,1680,110` al decir «debajo»
- Callout 1: «−10,00 y −12,00» → `455,814,100,54` («10»)
- Callout 2: «Escalado · Precio base» → `640,814,206,54` («escalado»)
- Callout 3: «Liquidación: Distribuidor · Factura» → `1408,814,258,54` («aviso»)

> **Nota de revisión:** CORRECCIÓN: la columna marcada es «Escandallo» (no «Escalando», como decía el informe v1). Las fuentes no explican cuándo se aplican estos descuentos; en el pedido el A6 sale a 2.000 × 3 = 6.000 sin descuento. No se afirma el mecanismo.

### 19. `sp-alta-tarifa` · cuidado · SIN PANTALLA · Alta de una tarifa nueva — *Sin pantalla*  (≈ 17 s)

**Qué se hace:** Crear tarifa: nueva cabecera (código, divisa, fechas) y añadir líneas (artículo, unidad, vigencia, precio). Grabar en la versión nueva.

**Narración:** Un aviso: en la grabación solo se consulta una tarifa que ya existía. El alta de una tarifa nueva, con su cabecera y sus líneas, no aparece, así que no te la enseñamos clic a clic.

**Qué se ve:**
- Tarjeta SIN PANTALLA: «Alta de una tarifa nueva» — En la grabación solo se consulta una tarifa existente. El alta de cabecera y líneas no se ve.

> **Nota de revisión:** SIN PANTALLA: el paso no aparece en los vídeos de origen; no se muestra ni se describe más allá de lo que consta.

### 20. `tip-vigencia` · tip · Cambia precios con nuevas vigencias  (≈ 21 s)

**Qué se hace:** Mantener tarifas por tramos de vigencia.

**Narración:** Un consejo de la propia clase: cuando un proveedor cambia el precio, no lo machaques. Actualiza la tarifa por rangos de fecha: hasta ayer valía tanto y a partir de mañana vale tanto. Así el histórico queda claro y los administrativos reciben la tarifa ya al día.

**Qué se ve:**
- Tarjeta tip: «Cambia precios con nuevas vigencias» — No sobrescribas el precio: cierra el tramo de fechas y abre otro. «Hasta ayer valía tanto; desde mañana, tanto».

### 21. `repaso-cap2` · resumen ·  — *Capítulo 2*  (≈ 18 s)

**Narración:** Repasemos. La tarifa se define aparte del artículo. La cabecera lleva código, divisa y validez. Las líneas, artículo, unidad, vigencia y precio. Puede haber descuentos por escalones. Y el precio depende siempre de la tarifa vigente.

**Qué se ve:**
- Checklist: La tarifa se define aparte del artículo · Cabecera: código, divisa, validez · Líneas: artículo, unidad, vigencia, precio · Descuentos por escalones · Precio según la tarifa vigente

## Capítulo 3 · Dónde se aplica la tarifa  (≈ 4 min 05 s)

### 22. `cap3` · capitulo · Dónde se aplica la tarifa  (≈ 5 s)

**Narración:** Capítulo tres: dónde se aplica la tarifa.

**Qué se ve:**
- Capitulo: «Dónde se aplica la tarifa» — Proveedor, delegación y permisos

### 23. `reglas-aplicacion` · estructura · ¿De dónde sale el precio?  (≈ 24 s)

**Qué se hace:** Explicar la resolución de tarifa: compras → proveedor; ventas → cliente y, si no, delegación.

**Narración:** El precio propuesto sale de sitios distintos en compras y en ventas. En compras, de la tarifa del proveedor; si no tiene, lo pones a mano. En ventas, el sistema mira primero la tarifa del cliente y, si no tiene, la de la delegación. Por eso toda venta se hace desde una delegación.

**Qué se ve:**
- Árbol: Precio propuesto → Compras: Tarifa del proveedor (Datos económicos), Sin tarifa: a mano; Ventas: 1.º Tarifa del cliente, 2.º Tarifa de la delegación, Toda venta lleva delegación

### 24. `correccion-delegacion` · comparativa · Una corrección importante  (≈ 19 s)

**Qué se hace:** Dejar claro que en la delegación solo hay tarifa de venta.

**Narración:** En la primera grabación se dijo que la delegación admite tarifa de compra y de venta. El propio formador lo rectificó en la siguiente sesión: en la delegación solo se define tarifa de venta. La de compra va siempre en el proveedor.

**Qué se ve:**
- Comparativa «Se dijo al principio» / «Lo correcto»: Delegación: Tarifa de compra y de venta | Solo tarifa de venta; Tarifa de compra: Proveedor o delegación | Siempre en el proveedor

> **Nota de revisión:** CORRECCIÓN entre vídeos: v1 (11:27–13:18) afirmaba compra y venta en la delegación; v2 (01:00–02:30) lo corrige.

### 25. `delegacion` · pantalla · La ficha de la delegación — *Ventas · la delegación*  (≈ 17 s)

**Qué se hace:** Abrir una delegación y localizar Condiciones comerciales (tarifa precios, tarifa descuento, descuentos familia).

**Narración:** Esta es la ficha de una delegación, la de Tarragona. En el bloque de condiciones comerciales hay tres campos: tarifa de precios, tarifa de descuento y descuentos por familia. Juntos forman la tarifa de venta de la delegación.

**Qué se ve:**
- Clip **v2** 1:40–2:04 (100–124 s, 24.0 s, velocidad ×1.55); recorte `0,88,1680,918` sobre 1680×1048; panel 3D «La ficha de la delegación».
- Zoom a `0,600,900,170` al decir «condiciones»
- Callout 1: «TGN · Almacén Tarragona» → `0,264,656,26` («Tarragona»)
- Callout 2: «Condiciones comerciales» → `0,640,830,78` («condiciones»)
- Foco en (200,676) al decir «precios»
- Foco en (560,676) al decir «descuento»
- Foco en (200,702) al decir «familia»

> **Nota de revisión:** El maestro de delegaciones se abrió por URL; la ruta de menú no se ve en las fuentes.

### 26. `lookup-ventas` · pantalla · Solo tarifas de venta  (≈ 12 s)

**Qué se hace:** Desplegar el campo Tarifa precios de la delegación y comprobar que solo ofrece tarifas de venta.

**Narración:** La prueba: al desplegar la tarifa de precios de la delegación, la lista que aparece es la de tarifas de venta. No hay ninguna de compra.

**Qué se ve:**
- Clip **v2** 1:21–1:29 (81–89 s, 8.0 s); recorte `110,150,1460,820` sobre 1680×1048; panel 3D «Solo tarifas de venta».
- Zoom a `180,330,1310,180` al decir «lista»
- Callout 1: «Tarifas de precios de ventas» → `186,176,600,26` («lista»)
- Callout 2: «VENTA · VENTA02 · VENTA02B» → `186,405,1290,84` («ninguna»)

### 27. `tarifa-proveedores` · pantalla · La compra se tarifa por proveedor  (≈ 23 s)

**Qué se hace:** Desde una tarifa de compra, consultar qué proveedores la tienen asignada (pestaña Proveedores).

**Narración:** En compras manda el proveedor: cada uno te vende con sus condiciones, y su tarifa de venta es tu tarifa de compra. Por eso la tarifa de compra se asocia al proveedor. Desde la propia tarifa, la pestaña proveedores te lleva al maestro de proveedores, filtrado por los que la usan.

**Qué se ve:**
- Clip **v2** 5:35–6:10 (335–370 s, 35.0 s, velocidad ×1.9); recorte `0,88,1680,918` sobre 1680×1048; panel 3D «La compra se tarifa por proveedor».
- Zoom a `0,170,700,120` al decir «pestaña»
- Zoom de vuelta al plano general al decir «filtrado»
- Callout 1: «Pestaña Proveedores» → `128,178,110,28` («pestaña»)

### 28. `sp-terceros` · cuidado · SIN PANTALLA · Cómo llegar a Terceros — *Sin pantalla*  (≈ 13 s)

**Qué se hace:** Abrir el maestro de Terceros y buscar el proveedor.

**Narración:** Primer paso: abrir la ficha de terceros. En el vídeo se abre tecleando su dirección en el navegador, así que la ruta del menú no la verás.

**Qué se ve:**
- Tarjeta SIN PANTALLA: «Cómo llegar a Terceros» — En el vídeo la ficha de terceros se abre tecleando su dirección; la ruta de menú no se ve.

> **Nota de revisión:** SIN PANTALLA: el paso no aparece en los vídeos de origen; no se muestra ni se describe más allá de lo que consta.

### 29. `prov-paso1` · pantalla · Abre el tercero y su pestaña Proveedores — *Asignar tarifa · paso 1 de 4*  (≈ 10 s)

**Qué se hace:** En la ficha del tercero, pulsar la pestaña Proveedores.

**Narración:** En la ficha del tercero SEAT, pulsa la pestaña proveedores. Se abre el maestro de proveedores de ese tercero.

**Qué se ve:**
- Clip **v2** 7:19–7:23.8 (439–443.8 s, 4.8 s); recorte `0,88,1680,918` sobre 1680×1048; panel 3D «Abre el tercero y su pestaña Proveedores».
- Callout 1: «Tercero P00001 · SEAT» → `0,292,800,24` («SEAT»)
- Callout 2: «Pulsa Proveedores» → `184,206,100,26` («pestaña»)

### 30. `prov-paso2` · pantalla · Busca Tarifa precios en Datos económicos — *Asignar tarifa · paso 2 de 4*  (≈ 11 s)

**Qué se hace:** En Datos económicos, localizar Tarifa precios y abrir su lista.

**Narración:** Baja hasta el bloque datos económicos. El campo tarifa precios tiene la tarifa COMPRA, que ya está caducada. Abre su lista desplegable.

**Qué se ve:**
- Clip **v2** 7:28–7:38 (448–458 s, 10.0 s); recorte `0,88,1680,918` sobre 1680×1048; panel 3D «Busca Tarifa precios en Datos económicos».
- Zoom a `0,690,1300,210` al decir «datos»
- Callout 1: «Bloque Datos económicos» → `0,710,1680,96` («datos»)
- Callout 2: «Tarifa precios: COMPRA (caducada)» → `836,730,326,26` («COMPRA»)

### 31. `prov-paso3` · pantalla · Elige la tarifa vigente — *Asignar tarifa · paso 3 de 4*  (≈ 13 s)

**Qué se hace:** Seleccionar en la lista la tarifa de compra vigente.

**Narración:** La lista muestra las tarifas de compra con sus fechas: COMPRA, caducada, y G cero cero cero cero tres, vigente. Elige la G cero cero cero cero tres.

**Qué se ve:**
- Clip **v2** 7:43.5–7:48 (463.5–468 s, 4.5 s); recorte `110,150,1460,820` sobre 1680×1048; panel 3D «Elige la tarifa vigente».
- Zoom a `180,380,1310,100` al decir «vigente»
- Callout 1: «COMPRA · hasta 31-08-2015» → `188,406,1290,26` («COMPRA»)
- Callout 2: «Elige G00003 · hasta 01-01-3000» → `188,433,1290,26` («elige»)

### 32. `proveedor-tarifa` · pantalla · Graba: el proveedor ya tiene su tarifa — *Asignar tarifa · paso 4 de 4*  (≈ 17 s)

**Qué se hace:** Grabar el proveedor con la nueva tarifa de precios.

**Narración:** Ya está: tarifa precios queda con la G cero cero cero cero tres. Junto a ella puedes asignar también una tarifa de descuentos y otra de descuentos por familia. Al grabar cambia la fecha de modificación.

**Qué se ve:**
- Clip **v2** 7:49–8:02 (469–482 s, 13.0 s); recorte `0,88,1680,918` sobre 1680×1048; panel 3D «Graba: el proveedor ya tiene su tarifa».
- Zoom a `0,690,1300,210` al decir «tarifa»
- Callout 1: «Tarifa precios: G00003» → `836,730,326,26` («tarifa»)
- Callout 2: «Tarifa descuentos · por familia» → `836,752,326,50` («descuentos»)
- Callout 3: «Modificado 11-12-2015 11:22:16» → `1290,862,380,26` («fecha»)

> **Nota de revisión:** No se ve el clic en «Validar»; el cambio queda acreditado por la fecha de modificación (11-12-2015 11:22:16).

### 33. `flujo-precio` · flujo · Cómo llega el precio al pedido  (≈ 15 s)

**Qué se hace:** Resumir la cadena línea → proveedor → tarifa → precio propuesto.

**Narración:** Junta las piezas. Al crear una línea de pedido, el sistema mira el proveedor, busca su tarifa de precios, encuentra el artículo y te propone el precio: 2.000 euros para el A6.

**Qué se ve:**
- Flujo 3D: Línea de pedido → Proveedor → Tarifa → Precio propuesto 2.000 €

### 34. `politica-precios` · conceptos · ¿Precio de tarifa o precio pactado?  (≈ 22 s)

**Qué se hace:** Explicar precio precargado vs pactado y el control por usuario.

**Narración:** En el pedido tienes dos posibilidades. El sistema precarga el precio de la tarifa, o pactas otro y lo cambias, por ejemplo de 2.000 a 1.800. Si no hay tarifa, lo teclea quien hace el pedido. Y se puede decidir por usuario quién puede tocar el precio y quién no.

**Qué se ve:**
- Tarjetas: Precargado (Sale de la tarifa al crear la línea) · Pactado (Se puede cambiar: de 2.000 a 1.800) · Sin tarifa (El precio se teclea) · Por usuario (Quién puede tocar el precio)

### 35. `permisos-precios` · pantalla · Permiso «Precios» por grupo  (≈ 22 s)

**Qué se hace:** Configuración de usuarios › grupo funcional de gestión › Permisos › agrupación Pedidos de compras › Precios (Ver / Ver y modificar / No permitido).

**Narración:** ¿Dónde se decide? En los permisos del grupo de usuarios. Aquí ves el grupo public con la agrupación pedidos de compras. La fila precios admite tres valores: ver precios, ver y modificar precios, o no permitido. Se llega desde la configuración de usuarios, pinchando en su grupo funcional de gestión.

**Qué se ve:**
- Clip **v2** 1:07:16–1:07:36 (4036–4056 s, 20.0 s); recorte `0,140,1400,800` sobre 1680×1048; panel 3D «Permiso «Precios» por grupo».
- Zoom a `0,560,1400,150` al decir «fila»
- Callout 1: «Grupo public» → `4,256,700,26` («public»)
- Callout 2: «Pedidos de compras» → `828,348,316,22` («agrupación»)
- Callout 3: «Precios» → `0,606,1340,28` («fila»)
- Callout 4: «Ver · Ver y modificar · No permitido» → `1174,630,164,58` («tres»)

> **Nota de revisión:** PRIVACIDAD: no se usa la rejilla «Usuarios» (nombres y e-mails reales, v2 ~3830–3940 s). Este tramo solo muestra el grupo y sus permisos.

### 36. `cuidado-public` · cuidado · No toques el grupo public  (≈ 17 s)

**Qué se hace:** Crear un grupo específico en lugar de modificar el grupo por defecto.

**Narración:** Cuidado: el grupo public lo usan todos por defecto. Si le quitas los precios, nadie los verá. Crea un grupo nuevo, por ejemplo comprador, copiado de public, cambia solo ese permiso y asígnalo a quien corresponda.

**Qué se ve:**
- Tarjeta cuidado: «No toques el grupo public» — Todos los usuarios lo usan por defecto. Crea un grupo nuevo (por ejemplo, «comprador») copiado de public, cambia solo el permiso y asígnaselo a quien toque.

### 37. `repaso-cap3` · resumen ·  — *Capítulo 3*  (≈ 18 s)

**Narración:** En resumen: en compras, la tarifa va en el proveedor. La delegación solo lleva tarifa de venta. En ventas manda el cliente y luego la delegación. Y el permiso de precios se da por grupo de usuarios.

**Qué se ve:**
- Checklist: Compras: tarifa en el proveedor · Delegación: solo tarifa de venta · Ventas: cliente y luego delegación · Permiso Precios por grupo

## Capítulo 4 · Tipos de documento y series  (≈ 3 min 44 s)

### 38. `cap4` · capitulo · Tipos de documento y series  (≈ 5 s)

**Narración:** Capítulo cuatro: tipos de documento y series.

**Qué se ve:**
- Capitulo: «Tipos de documento y series» — Cómo se numera cada documento

### 39. `menu-documentos` · pantalla · Abre Maestros › Documentos › Pedidos — *Definir la serie · paso 1 de 3*  (≈ 19 s)

**Qué se hace:** Navegar a Compras › Maestros › Documentos e identificar los tipos de pedido, albarán y factura.

**Narración:** Los tipos se definen en Compras, maestros, documentos. Hay entradas para concursos, ofertas, formularios, solicitudes o acuerdos, que sirven para circuitos más largos. Las que nos interesan son pedidos, albaranes y facturas. Además están las clasificaciones y los bloqueos o autorizaciones.

**Qué se ve:**
- Clip **v1** 2:44–3:07 (164–187 s, 23.0 s, velocidad ×1.05); recorte `0,115,1080,640` sobre 1680×1048; panel 3D «Abre Maestros › Documentos › Pedidos».
- Zoom a `0,370,420,290` al decir «concursos»
- Callout 1: «Circuitos largos» → `86,408,200,88` («concursos»)
- Callout 2: «Pedidos · Albaranes · Facturas» → `86,518,200,66` («pedidos»)
- Callout 3: «Clasificaciones · Bloqueos» → `86,606,230,44` («clasificaciones»)

### 40. `tipos-pedido-lista` · pantalla · Dos tipos de pedido — *Definir la serie · paso 1 de 3*  (≈ 15 s)

**Qué se hace:** Abrir la tipología de pedidos de compra y ver los tipos existentes.

**Narración:** Al abrir los tipos de pedido aparecen dos: PC y PC2, los dos pedidos de compra, cada uno con su serie. El código del tipo debe dejar claro el circuito que representa.

**Qué se ve:**
- Clip **v2** 17:50–17:56 (1070–1076 s, 6.0 s); recorte `0,140,1400,560` sobre 1680×1048; panel 3D «Dos tipos de pedido».
- Zoom a `0,200,1400,180` al decir «dos»
- Callout 1: «PC (serie PC-) · PC2 (serie PC2-)» → `0,322,1300,44` («dos»)

> **Nota de revisión:** Se evita 1060 s (error JRepException en pantalla).

### 41. `tip-clasificacion` · tip · ¿Otro tipo o una clasificación?  (≈ 14 s)

**Qué se hace:** Decidir entre crear un tipo de documento o usar el campo Clasificación.

**Narración:** Una regla útil de la clase: si una diferencia entre pedidos cambia su comportamiento, crea otro tipo de documento. Si solo es informativa, como urgente o normal, usa la clasificación.

**Qué se ve:**
- Tarjeta tip: «¿Otro tipo o una clasificación?» — Si la diferencia cambia el comportamiento, crea otro tipo de documento. Si solo es informativa (urgente, normal…), usa la clasificación.

### 42. `ficha-pc` · pantalla · La ficha del tipo PC — *Definir la serie · paso 2 de 3*  (≈ 22 s)

**Qué se hace:** Abrir el tipo de pedido: código, descripción, serie, estado (activo/no activo).

**Narración:** Esta es la ficha del tipo PC. Arriba, el código, la descripción y la serie, el prefijo con el que se numeran sus pedidos. Y el estado: un tipo que ya no usas se desactiva, no se borra. Las demás opciones las verás abajo en el capítulo siguiente.

**Qué se ve:**
- Clip **v2** 18:08–18:40 (1088–1120 s, 32.0 s, velocidad ×1.75); recorte `0,88,1680,918` sobre 1680×1048; panel 3D «La ficha del tipo PC».
- Zoom a `0,240,1680,60` al decir «código»
- Zoom de vuelta al plano general al decir «abajo»
- Callout 1: «Tipo PC · Pedido de Compra» → `4,268,548,24` («código»)
- Callout 2: «Serie PC-» → `794,268,128,24` («serie»)
- Callout 3: «Estado Activo» → `1560,268,100,24` («estado»)

### 43. `abrir-serie` · pantalla · Abre la lista de series — *Definir la serie · paso 2 de 3*  (≈ 13 s)

**Qué se hace:** Desde el campo Serie del tipo de documento, abrir la lista de series y entrar en la serie.

**Narración:** Desde la lupa del campo serie se abre la lista de series de pedidos de compras. Verás la PC y varias copias con máscara. Abre la serie PC.

**Qué se ve:**
- Clip **v2** 19:15–19:20.5 (1155–1160.5 s, 5.5 s); recorte `110,150,1460,820` sobre 1680×1048; panel 3D «Abre la lista de series».
- Zoom a `180,400,1310,260` al decir «copias»
- Callout 1: «Series de Pedidos de compras» → `188,405,1290,248` («lupa»)
- Callout 2: «151201PC- · copia con máscara» → `188,570,1290,24` («copias»)
- Callout 3: «Abre PC-» → `188,597,1290,24` («abre»)

### 44. `serie-ficha` · pantalla · La serie de numeración — *Definir la serie · paso 3 de 3*  (≈ 26 s)

**Qué se hace:** Desde Serie, abrir Series de justificantes: tabla, serie, numerador, justificación, excluir separador, control cronológico, renovación, fechas.

**Narración:** Desde el campo serie se abre la tabla de series de justificantes, una fila por tabla y serie. El código de la serie lo decides tú. Numerador indica que numera correlativamente. Justificación, seis: el contador se rellena con ceros hasta seis cifras. Excluir separador quita el guion. Control cronológico, ahora lo vemos. Y la renovación: anual o perpetua.

**Qué se ve:**
- Clip **v2** 20:40–21:30 (1240–1290 s, 50.0 s, velocidad ×1.8); recorte `110,150,1460,820` sobre 1680×1048; panel 3D «La serie de numeración».
- Zoom a `170,430,900,70` al decir «numerador»
- Zoom de vuelta al plano general al decir «perpetua»
- Callout 1: «Serie PC-» → `696,382,200,24` («tabla»)
- Callout 2: «Numerador» → `182,442,112,50` («numerador»)
- Callout 3: «Justificación 6» → `296,442,124,50` («seis»)
- Callout 4: «Excluir separador ✓» → `422,442,172,50` («separador»)
- Callout 5: «Control cronológico» → `596,442,184,50` («cronológico»)
- Callout 6: «Renovación Perpetua» → `782,442,224,50` («perpetua»)

> **Nota de revisión:** Se evita 1165–1199 s (avisos de Gmail en la esquina inferior derecha).

### 45. `numero-documento` · estructura · Cómo se forma el número  (≈ 22 s)

**Qué se hace:** Explicar la composición: máscara (año, mes, empresa) + serie + contador justificado.

**Narración:** Mira el número real de nuestro pedido: quince, doce, cero uno, PC, y un tres con ceros delante. Tiene tres piezas. La máscara: año 15, mes 12 y empresa 01. La serie: PC, sin el guion, porque está marcado excluir separador. Y el contador, con sus seis cifras.

**Qué se ve:**
- Árbol: 151201PC000003 → Máscara: yy · año (15), mm · mes (12), #e · empresa (01); Serie: PC (sin guion); Contador: 6 cifras (000003)

> **Nota de revisión:** CORRECCIÓN: el formador dice «PC guion 0000001» (7 cifras); con justificación 6 son 6 cifras (000001). En el número real 151201PC000003 el guion no aparece, coherente con «Excluir separador» marcado en todas las series (verificado en el fotograma de 1225 s).

### 46. `series-mascara` · pantalla · Series generadas por máscara  (≈ 25 s)

**Qué se hace:** Ver en la rejilla de series las copias generadas automáticamente a partir de la máscara.

**Narración:** No tienes que crear estas series a mano. Si la serie lleva máscara, el sistema genera una copia con el año, el mes o la empresa delante. Lo dice la descripción: copia desde la máscara, más la serie PC. Así salen quince cero uno PC o quince doce cero uno PC, que es la de nuestro pedido.

**Qué se ve:**
- Clip **v2** 25:05–25:40 (1505–1540 s, 35.0 s, velocidad ×1.65); recorte `110,150,1460,820` sobre 1680×1048; panel 3D «Series generadas por máscara».
- Zoom a `140,650,900,240` al decir «descripción»
- Callout 1: «Copy from mask [yy#e] + serie [PC-]» → `330,664,420,160` («descripción»)
- Callout 2: «151201PC- · máscara [yymm#e]» → `140,814,1300,22` («nuestro»)

> **Nota de revisión:** Códigos de máscara literales en pantalla: [yy#mm#e], [yy#e], [yymm#e] (el formador dice «arroba e»; en pantalla es «#e»).

### 47. `control-cronologico` · comparativa · Control cronológico  (≈ 24 s)

**Qué se hace:** Explicar la opción Control cronológico de la serie.

**Narración:** Sin control cronológico, el número solo tiene que ser único. Lo normal es que caigan en orden, pero un pedido con fecha de ayer grabado hoy recibe un número posterior al de uno de hoy. Si marcas el control, el sistema verifica que cada número nuevo se genere con fecha posterior a la del anterior.

**Qué se ve:**
- Comparativa «Sin control» / «Con control»: El número: Único, no necesariamente en orden de fecha | Sigue el orden de las fechas; Pedido de ayer grabado hoy: Recibe un número posterior | Se comprueba la fecha

### 48. `cuidado-desbordamiento` · cuidado · Dimensiona la justificación  (≈ 22 s)

**Qué se hace:** Calcular el tamaño de la serie según el volumen esperado y el límite de 20 posiciones.

**Narración:** Cuidado con quedarte corto. Con seis cifras caben 999.999 documentos. El siguiente pierde una cifra, vuelve a dar el uno, y el sistema lo rechaza por duplicado: de repente no se pueden crear pedidos. Y recuerda que máscara, serie y contador tienen que caber en las 20 posiciones del número.

**Qué se ve:**
- Tarjeta cuidado: «Dimensiona la justificación» — Con 6 cifras caben 999.999 documentos. El siguiente vuelve a dar 000001, se rechaza por duplicado y no se pueden crear más pedidos. Máscara + serie + contador ≤ 20 posiciones.

> **Nota de revisión:** Regla explicada oralmente (v2 25:13–29:37); el nombre del campo de 20 posiciones no se ve en pantalla.

### 49. `sp-alta-serie` · cuidado · SIN PANTALLA · Crear una serie nueva — *Sin pantalla*  (≈ 11 s)

**Qué se hace:** Crear una serie (tabla, código, numerador, justificación, separador, control cronológico, renovación, máscara) y asignarla al tipo de documento.

**Narración:** La grabación consulta la serie PC, pero no muestra cómo se crea una serie nueva ni cómo se le asigna una máscara.

**Qué se ve:**
- Tarjeta SIN PANTALLA: «Crear una serie nueva» — La grabación consulta la serie PC-; no se ve cómo se da de alta una serie ni cómo se asigna una máscara.

> **Nota de revisión:** SIN PANTALLA: el paso no aparece en los vídeos de origen; no se muestra ni se describe más allá de lo que consta.

### 50. `repaso-cap4` · resumen ·  — *Capítulo 4*  (≈ 18 s)

**Narración:** Repaso: los tipos están en Compras, maestros, documentos, y cada tipo tiene su serie. El número se forma con máscara, serie y contador. Activa el control cronológico si lo exiges. Y vigila el límite de cifras.

**Qué se ve:**
- Checklist: Tipos en Compras › Maestros › Documentos · Cada tipo tiene su serie · Número = máscara + serie + contador · Control cronológico, si lo exiges · Ojo al límite de cifras

## Capítulo 5 · El tipo de pedido por dentro  (≈ 4 min 19 s)

### 51. `cap5` · capitulo · El tipo de pedido por dentro  (≈ 5 s)

**Narración:** Capítulo cinco: el tipo de pedido por dentro.

**Qué se ve:**
- Capitulo: «El tipo de pedido por dentro» — Origen, valoración, anticipos, interempresa y tipos

### 52. `documento-origen` · pantalla · Documento origen — *Configurar el tipo · 1 de 6*  (≈ 29 s)

**Qué se hace:** Definir si el pedido tiene documento origen (ninguno / solicitud de compra) y la condición de selección.

**Narración:** Documento origen. La lista admite muchos orígenes: ofertas, acuerdos marco, órdenes de trabajo, pedidos de venta… En clase se explican dos. Con tabla origen ninguna, el pedido es el primer documento del circuito. Si eliges solicitud de compras, el pedido nace de una solicitud, y la condición de selección, una sentencia de tipo SQL, filtra qué solicitudes valen. Al lado, la actualización de la tabla origen.

**Qué se ve:**
- Clip **v2** 30:52–31:12 (1852–1872 s, 20.0 s); recorte `0,88,1680,918` sobre 1680×1048; panel 3D «Documento origen».
- Zoom a `0,300,1680,80` al decir «primer»
- Callout 1: «Orígenes posibles» → `172,348,150,184` (t=0.6 s)
- Callout 2: «Tabla origen: Ninguna / Solicitud compras» → `0,326,530,22` («primer»)
- Callout 3: «Condición de selección» → `0,352,1640,22` («condición»)
- Callout 4: «Actualización tabla origen» → `552,326,254,22` («actualización»)

> **Nota de revisión:** CORRECCIÓN: el desplegable Tabla origen (1852 s) ofrece: Oferta compras, Pedido compras, Acuerdos marco, Órdenes de trabajo, Pedido ventas, Solicitud compras, Orden producción, Acuerdos de ventas, Descuento general, Descuento familia y Ninguna; el informe solo citaba Ninguna / Solicitud compras. Solo se explican esas dos.

### 53. `actualizar-origen` · flujo · Actualizar el origen  (≈ 20 s)

**Qué se hace:** Explicar la actualización del documento origen (sumar/restar/no actualizar).

**Narración:** Esa opción decide si el documento siguiente actualiza su origen sumando, restando o nada. El ejemplo de la clase: pido 3 y recibo 3; el pedido queda con 3 servidas y 0 pendientes. Lo verás en el albarán, que actualiza el pedido sumando.

**Qué se ve:**
- Flujo 3D: Pedido 3 uds → Albarán 3 uds → Pedido actualizado 0 uds

### 54. `valoracion` · pantalla · Valoración — *Configurar el tipo · 2 de 6*  (≈ 20 s)

**Qué se hace:** Elegir la fecha de valoración (inicio, fin, documento, no valorar) y marcar Valorar.

**Narración:** Marcar valorar es poner precio a las líneas. La fecha de valoración decide con qué fecha se busca ese precio: la de inicio o la de fin, cuando el pedido cubre un periodo; la del documento, que es lo habitual; o no valorar.

**Qué se ve:**
- Clip **v2** 32:17–32:30 (1937–1950 s, 13.0 s); recorte `0,88,1680,918` sobre 1680×1048; panel 3D «Valoración».
- Zoom a `0,380,700,160` al decir «fecha»
- Callout 1: «Valorar ✓» → `132,432,30,24` («poner precio»)
- Callout 2: «Fecha inicio · Fecha fin · Documento · No valorar» → `4,452,104,72` («fecha»)

### 55. `rappel` · flujo · Descuentos especiales: el rappel  (≈ 27 s)

**Qué se hace:** Distinguir descuentos de tarifa y descuentos especiales (rappel a posteriori).

**Narración:** Los descuentos especiales no son los escalados de la tarifa. Piensa en un rappel: si este año te compro más de 3.000 unidades, me haces un 5 por ciento a posteriori. El pedido solo queda etiquetado; un proceso periódico suma los pedidos y genera un albarán de venta para reclamar el importe al proveedor. En clase solo se presentó la idea.

**Qué se ve:**
- Flujo 3D: Pedidos etiquetados → Proceso periódico → Albarán de venta

> **Nota de revisión:** Concepto sin demostración; el formador admite no dominarlo.

### 56. `anticipos` · calculo · Anticipos — *Pedido con anticipo*  (≈ 15 s)

**Qué se hace:** Vincular un anticipo al pedido para facturar solo el pendiente.

**Narración:** Los anticipos son pagos por adelantado a un proveedor. Si un pedido de 2.000 euros está vinculado a un anticipo de mil, la factura de compra solo será por el pendiente: otros mil.

**Qué se ve:**
- Contadores: Pedido 2.000 € → Anticipo ya pagado → Factura por el pendiente

### 57. `interempresa` · flujo · Facturación interempresa  (≈ 23 s)

**Qué se hace:** Asociar un tipo de pedido de venta para generar el documento simétrico en compras intercompañía.

**Narración:** En un grupo con varias sociedades en el mismo sistema, el proveedor puede ser otra empresa del grupo. Con el campo pedido de venta del bloque interempresa, al grabar el pedido de compra el sistema genera el pedido de venta simétrico en la otra sociedad. Así nadie tiene que teclearlo dos veces.

**Qué se ve:**
- Flujo 3D: Pedido de compra → Pedido de venta

> **Nota de revisión:** Concepto explicado oralmente; no se muestra ningún pedido interempresa real.

### 58. `tipos-pedido` · pantalla · Clases de pedido — *Configurar el tipo · 3 de 6*  (≈ 17 s)

**Qué se hace:** Elegir la clase del tipo de pedido (Normal, Reposición, Programación, Muestras).

**Narración:** En indicativos eliges la clase de pedido: normal, reposición, programación o muestras. El de este tutorial es normal. El de reposición lo genera el propio sistema. Programación y muestras se nombran en la clase, pero no se explican.

**Qué se ve:**
- Clip **v2** 39:56–40:20 (2396–2420 s, 24.0 s, velocidad ×1.35); recorte `0,88,1680,918` sobre 1680×1048; panel 3D «Clases de pedido».
- Zoom a `0,460,700,140` al decir «normal»
- Callout 1: «Normal · Reposición · Programación · Muestras» → `168,508,116,78` («normal»)

### 59. `reposicion` · flujo · Reposición automática  (≈ 25 s)

**Qué se hace:** Explicar la reposición automática por stock mínimo.

**Narración:** Así funciona la reposición. Defines un stock mínimo, por ejemplo diez ruedas. Un proceso programado revisa el stock cada hora o cada día. Si está en el mínimo, genera un aviso o directamente un pedido de reposición, con el precio de la tarifa, y lo envía por correo al proveedor. Por eso necesita tarifas ya creadas.

**Qué se ve:**
- Flujo 3D: Stock bajo mínimo → Proceso programado → Aviso o pedido → E-mail al proveedor

> **Nota de revisión:** Concepto oral, sin demostración.

### 60. `validar-catalogo` · pantalla · Validar catálogo — *Configurar el tipo · 4 de 6*  (≈ 20 s)

**Qué se hace:** Limitar los artículos pedibles al catálogo de la delegación/almacén (Validar catálogo).

**Narración:** Validar catálogo. Por defecto, un pedido admite todos los artículos del maestro. Si lo activas, solo los del catálogo de la delegación o del almacén. El ejemplo de la clase: una cadena con hipermercados, que piden de todo, y supermercados con un surtido reducido.

**Qué se ve:**
- Clip **v2** 18:08–18:30 (1088–1110 s, 22.0 s, velocidad ×1.15); recorte `0,88,1680,918` sobre 1680×1048; panel 3D «Validar catálogo».
- Zoom a `0,460,700,120` al decir «catálogo»
- Callout 1: «Validar catálogo: No» → `4,520,276,22` («catálogo»)

> **Nota de revisión:** Nunca se prueba con valor «Sí» en las fuentes.

### 61. `impresion` · pantalla · Impresión de documentos — *Configurar el tipo · 5 de 6*  (≈ 22 s)

**Qué se hace:** Asociar al tipo de pedido el objeto (formato) de impresión.

**Narración:** En la pestaña impresión de documentos se vincula el objeto de impresión: el formato en papel o PDF, distinto de la pantalla con la que editas. Si una empresa usa dos impresos, por ejemplo uno rosa y otro verde, tendrá dos tipos de pedido, cada uno con el suyo.

**Qué se ve:**
- Clip **v2** 49:38–49:56 (2978–2996 s, 18.0 s); recorte `0,88,1680,918` sobre 1680×1048; panel 3D «Impresión de documentos».
- Zoom a `0,450,700,110` al decir «pestaña»
- Callout 1: «Impresión de documentos» → `106,466,176,22` («pestaña»)
- Callout 2: «Objeto impresión» → `4,514,420,24` («objeto»)

### 62. `campos-ocultar` · pantalla · Workflow y campos a ocultar — *Configurar el tipo · 6 de 6*  (≈ 28 s)

**Qué se hace:** Asignar el tipo de workflow y elegir qué campos de línea se ocultan en este tipo de pedido.

**Narración:** En datos generales está el tipo de workflow, en PC el departamental; lo verás al validar. Y la pestaña campos a ocultar tiene casillas, una por cada dato de la línea: fechas de entrega, stock, lote, código de barras… Afecta a todos los usuarios del tipo. Si quieres que uno pueda modificar un dato y otro no, eso va en el perfil del usuario.

**Qué se ve:**
- Clip **v2** 1:02:38–1:02:55 (3758–3775 s, 17.0 s); recorte `0,88,1680,918` sobre 1680×1048; panel 3D «Workflow y campos a ocultar».
- Zoom a `0,560,1680,140` al decir «casillas»
- Callout 1: «Campos a ocultar» → `138,574,120,22` («casillas»)
- Callout 2: «Una casilla por campo de línea» → `0,606,1660,88` («fechas»)

> **Nota de revisión:** Las fuentes no aclaran si la casilla marcada oculta o muestra el campo; no se afirma.

### 63. `repaso-cap5` · resumen ·  — *Capítulo 5*  (≈ 19 s)

**Narración:** Repaso: el origen puede ser ninguno o una solicitud. Se valora, normalmente, con la fecha del documento. Hay rappel y anticipos. En interempresa se genera el pedido simétrico. Y además: clase de pedido, catálogo, impresión, workflow y campos a ocultar.

**Qué se ve:**
- Checklist: Origen: ninguno o solicitud · Valoración con fecha de documento · Rappel y anticipos · Interempresa: pedido simétrico · Clase, catálogo, impresión · Workflow y campos a ocultar

## Capítulo 6 · Crear y validar el pedido  (≈ 3 min 43 s)

### 64. `cap6` · capitulo · Crear y validar el pedido  (≈ 5 s)

**Narración:** Capítulo seis: crear y validar el pedido.

**Qué se ve:**
- Capitulo: «Crear y validar el pedido» — Cabecera, líneas y workflow

### 65. `menu-pedidos` · pantalla · Abre Compras › Pedidos › Registro — *Crear el pedido · paso 1 de 7*  (≈ 12 s)

**Qué se hace:** Abrir Compras › Pedidos › Registro.

**Narración:** Para crear el pedido, abre Compras, pedidos, registro. En la misma carpeta tienes también la impresión, la situación, el seguimiento y el workflow de los pedidos.

**Qué se ve:**
- Clip **v2** 51:10–51:12.8 (3070–3072.8 s, 2.8 s); recorte `0,115,1080,640` sobre 1680×1048; panel 3D «Abre Compras › Pedidos › Registro».
- Zoom a `0,290,420,250` al decir «registro»
- Callout 1: «Compras › Pedidos» → `20,308,200,24` («pedidos»)
- Callout 2: «Registro» → `50,331,150,22` («registro»)
- Callout 3: «b2b, e-Procurement, Impresión, Situación, Seguimiento…» → `50,353,300,176` («seguimiento»)

> **Nota de revisión:** Se evita 3075,5–3117 s: aparece una pantalla de inicio de sesión (usuario visible, contraseña enmascarada).

### 66. `ped-nuevo` · pantalla · Pulsa Nuevo — *Crear el pedido · paso 2 de 7*  (≈ 14 s)

**Qué se hace:** En el registro de pedidos, pulsar Nuevo.

**Narración:** Se abre el último pedido, el anterior, aún bloqueado. Pulsa el botón nuevo de la barra superior y aparece un pedido en blanco, con la serie y sin número.

**Qué se ve:**
- Clip **v2** 51:58–52:16 (3118–3136 s, 18.0 s, velocidad ×1.65); recorte `0,88,1680,918` sobre 1680×1048; panel 3D «Pulsa Nuevo».
- Callout 1: «Pedido anterior: Bloqueado» → `1008,366,200,24` («anterior»)
- Callout 2: «Pulsa Nuevo» → `1150,112,50,50` («nuevo»)
- Callout 3: «151201PC- sin número» → `1250,264,336,24` («blanco»)

### 67. `alta-cabecera` · pantalla · Rellena la unidad de negocio y las fechas — *Crear el pedido · paso 3 de 7*  (≈ 28 s)

**Qué se hace:** Nuevo pedido: tipo, empresa, delegación, departamento, almacén; fechas de pedido y entrega; serie (número al guardar); origen, referencia, clasificación.

**Narración:** Con el botón nuevo aparece un pedido en blanco. En la unidad de negocio eliges el tipo, PC, la empresa, la delegación, el departamento y el almacén donde recibirás la mercancía. Las fechas de entrega son el plazo que das al proveedor. Con el tipo llega la serie con su máscara; el número se completa al guardar. Y además: origen, referencia y clasificación.

**Qué se ve:**
- Clip **v2** 54:32–55:00 (3272–3300 s, 28.0 s, velocidad ×1.1); recorte `0,88,1680,918` sobre 1680×1048; panel 3D «Rellena la unidad de negocio y las fechas».
- Zoom a `0,250,840,150` al decir «unidad»
- Zoom a `830,250,840,120` al decir «serie»
- Callout 1: «PC · Empresa 01 · Delegación D01 · Almacén D01» → `0,262,830,128` («unidad»)
- Callout 2: «Fecha y plazo de entrega» → `836,262,290,52` («entrega»)
- Callout 3: «151201PC- : se completa al guardar» → `1250,262,336,24` («serie»)
- Callout 4: «Origen · Referencia · Clasificación» → `1250,288,336,76` («referencia»)

> **Nota de revisión:** Según la clase, si el proveedor tiene plazo de entrega en su ficha, el sistema ajusta las fechas; no se demuestra.

### 68. `ped-proveedor` · pantalla · Elige el proveedor — *Crear el pedido · paso 4 de 7*  (≈ 9 s)

**Qué se hace:** Informar el proveedor (Pedir a) y revisar Recepcionar en.

**Narración:** En pedir a, elige el proveedor SEAT. A la derecha, recepcionar en indica quién recibe la mercancía.

**Qué se ve:**
- Clip **v2** 55:56–56:01.5 (3356–3361.5 s, 5.5 s); recorte `0,88,1680,918` sobre 1680×1048; panel 3D «Elige el proveedor».
- Zoom a `0,400,1680,120` al decir «pedir»
- Callout 1: «Proveedor P00001 · SEAT» → `0,424,420,24` («pedir»)
- Callout 2: «Recepcionar en: G00001» → `836,424,830,24` («recepcionar»)

### 69. `proveedor-direccion` · pantalla · Elige la dirección del proveedor — *Crear el pedido · paso 5 de 7*  (≈ 18 s)

**Qué se hace:** Elegir proveedor y su dirección (0 = fiscal); revisar Pedir a / Facturado por / Recepcionar en / Enviar a.

**Narración:** En pedir a eliges el proveedor, SEAT, y el sistema trae su dirección cero, la fiscal. Un proveedor puede tener varias direcciones: la central, donde mandas las facturas, y sucursales desde las que sirve. Distingue bien facturación, pedido y recepción.

**Qué se ve:**
- Clip **v2** 56:06–56:13 (3366–3373 s, 7.0 s); recorte `110,150,1460,820` sobre 1680×1048; panel 3D «Elige la dirección del proveedor».
- Zoom a `180,360,1310,100` al decir «dirección»
- Callout 1: «SEAT · dirección 0 · Gran Via · Barcelona» → `190,406,1290,26` («dirección»)

> **Nota de revisión:** No se usa la lista de proveedores (3340–3355 s) porque muestra nombres de terceros con apariencia de personas.

### 70. `ped-guardar` · pantalla · Guarda: el pedido recibe número — *Crear el pedido · paso 6 de 7*  (≈ 17 s)

**Qué se hace:** Guardar la cabecera; comprobar número asignado y estado inicial.

**Narración:** Pulsa insertar para guardar la cabecera. El pedido recibe su número: quince, doce, cero uno, PC, y el tres. Y fíjate: nace bloqueado, con el código 26000, por el workflow del tipo PC. Abajo aparecen sus botones.

**Qué se ve:**
- Clip **v2** 57:54–58:16 (3474–3496 s, 22.0 s, velocidad ×1.15); recorte `0,88,1680,918` sobre 1680×1048; panel 3D «Guarda: el pedido recibe número».
- Callout 1: «151201PC000003» → `1416,262,170,26` («número»)
- Callout 2: «Bloqueado 26000» → `1008,366,200,24` («bloqueado»)
- Callout 3: «Botones del workflow» → `0,962,1100,32` («botones»)

> **Nota de revisión:** El pedido ya está «Bloqueado 26000» tras guardar (fotograma ≈3488 s), antes de pulsar nada más.

### 71. `lineas-a6` · pantalla · Añade la línea del COCHE A6 — *Crear el pedido · paso 7 de 7*  (≈ 20 s)

**Qué se hace:** Añadir línea: artículo y cantidad; el precio se propone desde la tarifa del proveedor; importe neto calculado.

**Narración:** Pulsa líneas y crea la primera. Las fechas de entrega se heredan de la cabecera. Elige el artículo, COCHE A6, y una cantidad de tres. Al grabar, el precio aparece solo: 2.000 euros, de la tarifa del proveedor. Importe neto, 6.000, y la línea validada.

**Qué se ve:**
- Clip **v2** 1:00:12–1:00:36 (3612–3636 s, 24.0 s, velocidad ×1.2); recorte `0,88,1680,918` sobre 1680×1048; panel 3D «Añade la línea del COCHE A6».
- Zoom a `0,450,1680,80` al decir «línea»
- Callout 1: «COCHE A6» → `228,488,160,26` («artículo»)
- Callout 2: «3» → `842,488,100,26` («tres»)
- Callout 3: «2.000 de la tarifa» → `968,488,120,26` («2.000»)
- Callout 4: «6.000» → `1188,488,96,26` («6.000»)
- Callout 5: «Validada» → `1486,488,90,26` («validada»)

### 72. `lineas-a4` · pantalla · Añade el COCHE A4, sin tarifa — *Crear el pedido · paso 7 de 7*  (≈ 25 s)

**Qué se hace:** Añadir un artículo sin tarifa: precio 0, teclear el precio pactado; observar la numeración de líneas.

**Narración:** Ahora el COCHE A4, cuatro unidades. Como no está en la tarifa, el precio queda a cero, y aun así la línea se valida. Lo tecleamos a mano: 1.000 euros, importe 4.000. Fíjate en los órdenes de las líneas: uno y tres. Se numeran saltando de dos en dos, para poder intercalar una línea entre medias.

**Qué se ve:**
- Clip **v2** 1:01:46–1:02:09 (3706–3729 s, 23.0 s); recorte `0,88,1680,918` sobre 1680×1048; panel 3D «Añade el COCHE A4, sin tarifa».
- Zoom a `0,450,1680,80` al decir «cero»
- Zoom a `0,660,1680,90` al decir «órdenes»
- Callout 1: «Sin tarifa: 0» → `968,488,120,26` («cero»)
- Callout 2: «A mano: 1.000» → `968,488,120,26` («mano»)
- Callout 3: «Órdenes 3 y 1» → `0,694,1660,34` («órdenes»)

> **Nota de revisión:** El formador dice «de dos en dos (2, 4, 6)»; en pantalla son 1 y 3. Se evita 3695–3705 s (ventana emergente en blanco).

### 73. `cuidado-precio-cero` · cuidado · Un precio cero también se valida  (≈ 10 s)

**Qué se hace:** Revisar líneas a 0 antes de validar/enviar.

**Narración:** Cuidado con esto: una línea con precio cero también queda validada. Revisa siempre los precios antes de enviar el pedido.

**Qué se ve:**
- Tarjeta cuidado: «Un precio cero también se valida» — La línea del A4 quedó «Validada» con importe 0,00. Revisa los precios antes de enviar el pedido.

### 74. `calculo-pedido` · calculo · El importe del pedido — *Pedido 151201PC000003*  (≈ 8 s)

**Qué se hace:** Comprobar el importe neto del pedido.

**Narración:** Sumamos: 6.000 del A6 más 4.000 del A4. El pedido queda en 10.000 euros, sin IVA.

**Qué se ve:**
- Contadores: COCHE A6 · 3 × 2.000 6.000 € → COCHE A4 · 4 × 1.000 → Importe neto del pedido

### 75. `val-paso1` · pantalla · Pulsa >3000€ Autorizar — *Validar el pedido · paso 1 de 4*  (≈ 13 s)

**Qué se hace:** Con el pedido bloqueado por el workflow, lanzar la autorización e indicar el motivo.

**Narración:** El pedido está bloqueado y supera los 3.000 euros, así que la barra ofrece el botón autorizar de más de 3.000 euros. Púlsalo, escribe el motivo y acepta.

**Qué se ve:**
- Clip **v2** 1:08:04–1:08:17 (4084–4097 s, 13.0 s, velocidad ×1.1); recorte `0,88,1680,918` sobre 1680×1048; panel 3D «Pulsa >3000€ Autorizar».
- Callout 1: «Bloqueado 26000» → `1008,366,200,24` («bloqueado»)
- Callout 2: «Pulsa >3000€ Autorizar» → `390,962,130,30` (t=1.21 s)
- Callout 3: «Escribe el motivo y Ok» → `616,386,444,318` (t=8.85 s)

### 76. `val-paso2` · pantalla · Aprobaciones encadenadas — *Validar el pedido · paso 2 de 4*  (≈ 14 s)

**Qué se hace:** Ejecutar las aprobaciones sucesivas del workflow.

**Narración:** Después llega una cadena de aprobaciones, cada una como un botón en el mismo sitio de la barra: aprobar jefe de central, aprobar director general y aprobación del comité.

**Qué se ve:**
- Clip **v2** 1:08:20–1:08:44 (4100–4124 s, 24.0 s, velocidad ×2.2); recorte `0,88,1680,918` sobre 1680×1048; panel 3D «Aprobaciones encadenadas».
- Callout 1: «Aprobar Jefe de Central» → `210,962,175,30` (t=0.75 s)
- Callout 2: «Aprobar Director General» → `210,962,180,30` (t=4.85 s)
- Callout 3: «Aprobación Comité» → `210,962,148,30` (t=8.48 s)

### 77. `val-paso3` · pantalla · Confirma el envío — *Validar el pedido · paso 3 de 4*  (≈ 12 s)

**Qué se hace:** Enviar el pedido al proveedor y confirmar el envío.

**Narración:** El último paso es confirmar el envío del pedido por correo al proveedor. En la grabación el correo no estaba configurado y se confirmó directamente.

**Qué se ve:**
- Clip **v2** 1:08:45–1:08:58 (4125–4138 s, 13.0 s, velocidad ×1.25); recorte `0,88,1680,918` sobre 1680×1048; panel 3D «Confirma el envío».
- Callout 1: «Confirmar Envío mail» → `210,962,155,30` («confirmar»)

> **Nota de revisión:** Se excluye 4140–4192 s (ventana de e-mail y dirección tecleada).

### 78. `pedido-validado` · pantalla · Pedido validado — *Validar el pedido · paso 4 de 4*  (≈ 13 s)

**Qué se hace:** Comprobar estado Validado e importe neto.

**Narración:** Ya está: estado validado, importe neto 10.000 euros. En la barra inferior aparece un botón nuevo, marcar como servida, señal de que el pedido ya puede recibirse.

**Qué se ve:**
- Clip **v2** 1:09:56–1:10:01.5 (4196–4201.5 s, 5.5 s); recorte `0,88,1680,918` sobre 1680×1048; panel 3D «Pedido validado».
- Callout 1: «Validado» → `1008,366,200,24` («validado»)
- Callout 2: «Importe neto 10.000,00» → `1500,764,160,26` («10.000»)
- Callout 3: «Aparece Marcar como servida» → `0,972,900,30` («servida»)

### 79. `repaso-cap6` · resumen ·  — *Capítulo 6*  (≈ 17 s)

**Narración:** Repaso: la cabecera define la unidad de negocio y el proveedor. El número se genera al guardar. El precio sale de la tarifa o se teclea si no la hay. Y validar dispara el workflow.

**Qué se ve:**
- Checklist: Cabecera: unidad de negocio y proveedor · El número se genera al guardar · Precio de tarifa, o a mano si no hay · Validar dispara el workflow

## Capítulo 7 · Del pedido al albarán  (≈ 5 min 00 s)

### 80. `cap7` · capitulo · Del pedido al albarán  (≈ 4 s)

**Narración:** Capítulo siete: del pedido al albarán.

**Qué se ve:**
- Capitulo: «Del pedido al albarán» — Recepción, parciales y contabilización

### 81. `tipologia-rc` · pantalla · El tipo de albarán RC  (≈ 22 s)

**Qué se hace:** Definir el tipo de albarán de recepción: origen pedidos, condición (validado/parcial), actualizar origen sumando, cuentas logísticas origen/destino.

**Narración:** El albarán también tiene su tipo: RC, recepción de compra, en Compras, maestros, documentos, albaranes. Su tabla origen es pedidos. La condición de selección solo admite pedidos validados o parciales. Actualiza el origen sumando lo recibido. Y mueve la mercancía entre cuentas logísticas: de no disponible a disponible.

**Qué se ve:**
- Clip **v2** 1:11:02–1:11:32 (4262–4292 s, 30.0 s, velocidad ×1.2); recorte `0,88,1680,918` sobre 1680×1048; panel 3D «El tipo de albarán RC».
- Zoom a `0,240,1680,140` al decir «origen»
- Callout 1: «RC · Recepción de Compra · serie RC-» → `0,266,870,26` («recepción»)
- Callout 2: «Tabla origen: Pedidos» → `0,324,370,26` («origen»)
- Callout 3: «estcab in ('V','P')» → `0,350,370,24` («condición»)
- Callout 4: «Actualizar origen: Sumando» → `584,324,256,26` («sumando»)
- Callout 5: «NDIS → DISP» → `1166,266,260,26` («cuentas»)

### 82. `reglas-rc` · conceptos · Reglas del albarán de recepción  (≈ 24 s)

**Qué se hace:** Resumir las reglas del albarán de recepción.

**Narración:** Cuatro reglas. El albarán de recepción nace de un pedido: lo normal es no recibir nada que no se haya pedido, aunque podría existir otro tipo sin origen. El pedido debe estar validado o parcial. Cada recepción suma a la cantidad servida; una devolución restaría. Y albarán o suministro funcionan igual: el albarán implica papel.

**Qué se ve:**
- Tarjetas: Nace de un pedido (No se recibe lo que no se ha pedido) · Pedido V o P (Validado o servido parcial) · Suma al pedido (La devolución restaría) · Albarán o suministro (Igual para el sistema)

### 83. `alb-menu` · pantalla · Abre Compras › Albaranes › Registro — *Crear el albarán · paso 1 de 6*  (≈ 5 s)

**Qué se hace:** Abrir Compras › Albaranes › Registro.

**Narración:** Para recibir la mercancía, abre Compras, albaranes, registro.

**Qué se ve:**
- Clip **v2** 1:18:32–1:18:35.5 (4712–4715.5 s, 3.5 s); recorte `0,115,1080,640` sobre 1680×1048; panel 3D «Abre Compras › Albaranes › Registro».
- Zoom a `0,280,420,200` al decir «registro»
- Callout 1: «Compras › Albaranes» → `28,330,200,24` («albaranes»)
- Callout 2: «Registro» → `60,353,140,24` («registro»)

### 84. `alta-albaran` · pantalla · Nuevo albarán de tipo RC — *Crear el albarán · paso 2 de 6*  (≈ 16 s)

**Qué se hace:** Nuevo albarán: tipo RC, empresa/delegación/almacén, fecha de recepción; informar Origen.

**Narración:** Pulsa nuevo y elige el tipo RC, con la misma empresa, delegación y almacén que el pedido. El número se completa al guardar. Ya ves las cuentas logísticas que heredará: de no disponible a disponible.

**Qué se ve:**
- Clip **v2** 1:19:46–1:20:00 (4786–4800 s, 14.0 s); recorte `0,88,1680,918` sobre 1680×1048; panel 3D «Nuevo albarán de tipo RC».
- Zoom a `0,250,840,150` al decir «tipo»
- Callout 1: «Tipo RC» → `0,266,620,26` («tipo»)
- Callout 2: «201501RC- : número al guardar» → `1250,264,350,24` («guardar»)
- Callout 3: «NDIS → DISP» → `0,688,420,50` («cuentas»)

### 85. `alb-origen-obligatorio` · pantalla · El origen es obligatorio — *Crear el albarán · paso 3 de 6*  (≈ 10 s)

**Qué se hace:** Informar el campo Origen (obligatorio en el tipo RC).

**Narración:** Si intentas seguir sin origen, el sistema lo marca en rojo: debes completarlo, porque el tipo RC exige un pedido.

**Qué se ve:**
- Clip **v2** 1:20:06–1:20:20 (4806–4820 s, 14.0 s, velocidad ×1.6); recorte `0,88,1680,918` sobre 1680×1048; panel 3D «El origen es obligatorio».
- Zoom a `830,240,840,110` al decir «origen»
- Callout 1: «Debe completar (Origen)» → `1180,282,440,30` («origen»)

### 86. `popup-pedidos` · pantalla · Elige el pedido de origen — *Crear el albarán · paso 4 de 6*  (≈ 17 s)

**Qué se hace:** Seleccionar el pedido de origen (mismo empresa/delegación/departamento); se heredan proveedor, divisa, tipo de efecto y forma de pago.

**Narración:** Abre la lista del campo origen. Solo salen pedidos de la misma empresa y delegación: es el error típico de las pruebas, si no coinciden no encontrarás el pedido. Elige el nuestro, el de 10.000 euros.

**Qué se ve:**
- Clip **v2** 1:20:26–1:20:40 (4826–4840 s, 14.0 s); recorte `110,150,1460,820` sobre 1680×1048; panel 3D «Elige el pedido de origen».
- Zoom a `180,400,1310,120` al decir «misma»
- Callout 1: «Pedidos de la misma empresa y delegación» → `186,444,1300,62` («misma»)
- Callout 2: «151201PC000003 · 10.000,00» → `186,444,1300,22` («nuestro»)

### 87. `alb-heredados` · pantalla · Datos heredados del pedido — *Crear el albarán · paso 4 de 6*  (≈ 11 s)

**Qué se hace:** Comprobar los datos heredados del pedido.

**Narración:** Con el origen elegido, el albarán hereda del pedido el proveedor, SEAT, la divisa, el tipo de efecto y la forma de pago.

**Qué se ve:**
- Clip **v2** 1:20:50–1:21:06 (4850–4866 s, 16.0 s, velocidad ×1.8); recorte `0,88,1680,918` sobre 1680×1048; panel 3D «Datos heredados del pedido».
- Callout 1: «Origen 151201PC000003» → `1270,288,340,24` («origen»)
- Callout 2: «Proveedor P00001 · SEAT» → `0,426,420,24` («proveedor»)
- Callout 3: «Tipo efecto TF · Forma pago 045» → `836,716,300,48` («forma»)

### 88. `alb-insertar` · pantalla · Inserta el albarán — *Crear el albarán · paso 5 de 6*  (≈ 8 s)

**Qué se hace:** Insertar (grabar) la cabecera del albarán.

**Narración:** Pulsa insertar, o mayúsculas más intro. El albarán se graba y queda validado al momento.

**Qué se ve:**
- Clip **v2** 1:21:10–1:21:22 (4870–4882 s, 12.0 s, velocidad ×1.55); recorte `0,88,1680,918` sobre 1680×1048; panel 3D «Inserta el albarán».
- Callout 1: «Insertar (Shift + Enter)» → `1200,112,50,50` («insertar»)
- Callout 2: «Validado» → `1008,366,120,24` («validado»)

### 89. `albaran-guardado` · pantalla · Albarán creado: pulsa Agregar líneas pedido — *Crear el albarán · paso 6 de 6*  (≈ 13 s)

**Qué se hace:** Guardar la cabecera del albarán; localizar «Agregar líneas pedido».

**Narración:** Al insertar, el albarán recibe su número, con el pedido como origen, y queda validado solo: algunos tipos se autovalidan. Arriba aparece el botón clave: agregar líneas pedido.

**Qué se ve:**
- Clip **v2** 1:21:33–1:21:46 (4893–4906 s, 13.0 s); recorte `0,88,1680,918` sobre 1680×1048; panel 3D «Albarán creado: pulsa Agregar líneas pedido».
- Callout 1: «201501RC-000002» → `1270,262,340,24` («número»)
- Callout 2: «Origen 151201PC000003» → `1270,288,340,24` («origen»)
- Callout 3: «Validado» → `1008,366,120,24` («validado»)
- Callout 4: «Agregar líneas pedido» → `272,206,150,24` («agregar»)

### 90. `agregar-lineas` · pantalla · Agregar las líneas del pedido — *Agregar líneas del pedido · marcar, ajustar y agregar*  (≈ 30 s)

**Qué se hace:** Agregar líneas del pedido: marcar, ajustar la cantidad recibida, agregar; lo no recibido queda pendiente.

**Narración:** El botón abre las líneas del pedido que aún no se han recibido: tres A6 y cuatro A4. Marcamos las dos. Pero el camión solo trae tres A4, así que cambiamos su cantidad antes de agregar. Pulsamos agregar líneas pedido y el sistema las copia al albarán y lo valida. Si volvemos a abrir la selección, solo queda un A4 pendiente, y el pedido de origen ya figura como parcial.

**Qué se ve:**
- Clip **v2** 1:23:16–1:24:06 (4996–5046 s, 50.0 s, velocidad ×1.9); recorte `0,88,1680,918` sobre 1680×1048; panel 3D «Agregar las líneas del pedido».
- Callout 1: «Pendientes: A6 · 3 y A4 · 4» → `0,596,1660,46` (t=0.83 s)
- Callout 2: «Marcadas» → `0,596,60,46` (t=3.46 s)
- Callout 3: «Cantidad del A4: 3» → `958,620,176,24` (t=13.98 s)
- Callout 4: «Agregar líneas pedido» → `312,972,140,30` (t=17.67 s)
- Callout 5: «Queda 1 COCHE A4 · pedido Parcial» → `0,596,1660,24` (t=22.93 s)

> **Nota de revisión:** Clip acelerado. Marcado ≈5002 s, edición de cantidad ≈5026 s, transacción ≈5034 s, resultado (pendiente 1, pedido Parcial) ≈5042 s. El informe decía 4915–5030; el tramo útil verificado es 4996–5046.

### 91. `albaran-lineas` · pantalla · Las líneas del albarán — *Resultado*  (≈ 12 s)

**Qué se hace:** Revisar líneas y total del albarán.

**Narración:** Estas son las líneas del albarán: tres A4 a 1.000 y tres A6 a 2.000, ambas validadas. Total, 9.000 euros. Abajo está el botón contabilizar.

**Qué se ve:**
- Clip **v2** 1:29:12–1:29:29 (5352–5369 s, 17.0 s, velocidad ×1.35); recorte `0,88,1680,918` sobre 1680×1048; panel 3D «Las líneas del albarán».
- Callout 1: «A4 · 3 × 1.000 · A6 · 3 × 2.000» → `0,862,1640,50` («líneas»)
- Callout 2: «9.000,00» → `1300,912,200,28` («9.000»)
- Callout 3: «Contabilizar» → `322,972,80,30` («contabilizar»)

> **Nota de revisión:** Se corta antes del spinner «Realizando transacción» (≈5372 s). Verificar al renderizar que el plano previo es el mismo desplazamiento de página.

### 92. `calculo-albaran` · calculo · El importe del albarán — *Albarán 201501RC-000002*  (≈ 10 s)

**Qué se hace:** Comprobar el importe del albarán frente al pedido.

**Narración:** La cuenta: 6.000 del A6 más 3.000 de los tres A4 recibidos. 9.000 euros. El cuarto A4 sigue pendiente.

**Qué se ve:**
- Contadores: COCHE A6 · 3 × 2.000 6.000 € → COCHE A4 · 3 × 1.000 (de 4) → Importe del albarán

### 93. `pedido-parcial` · pantalla · El pedido, ahora parcial — *Resultado en el pedido*  (≈ 12 s)

**Qué se hace:** Refrescar el pedido y revisar estado de cabecera y de cada línea (Servida / Parcial).

**Narración:** Al refrescar el pedido, su estado es parcial. Cada línea tiene el suyo: el A6 está servido, tres de tres; el A4, parcial, tres de cuatro.

**Qué se ve:**
- Clip **v2** 1:26:05–1:26:22 (5165–5182 s, 17.0 s, velocidad ×1.5); recorte `0,88,1680,918` sobre 1680×1048; panel 3D «El pedido, ahora parcial».
- Callout 1: «Parcial» → `1008,314,160,24` («parcial»)
- Callout 2: «A4: 4 pedidas, 3 servidas · A6: Servida» → `0,890,1660,48` («línea»)

### 94. `opciones-parcial` · conceptos · ¿Y el coche que falta?  (≈ 20 s)

**Qué se hace:** Decidir qué hacer con lo pendiente: nuevo albarán o «Marcar como servido».

**Narración:** Con el A4 que falta tienes dos caminos. Esperar: cuando llegue, otro albarán con el mismo origen te ofrecerá la línea pendiente. O marcar el pedido como servido: queda cerrado y se factura solo lo recibido. Mientras tanto, aparecerá en los informes de pedidos pendientes.

**Qué se ve:**
- Tarjetas: Esperar el resto (Otro albarán con el mismo origen) · Marcar como servido (Se cierra y se factura lo recibido) · Seguimiento (Sale en los informes de pendientes)

### 95. `alb-contabilizar` · pantalla · Pulsa Contabilizar — *Contabilizar el albarán · paso 1 de 2*  (≈ 12 s)

**Qué se hace:** Contabilizar el albarán y abrir la pestaña Apuntes.

**Narración:** Pulsa contabilizar. Al terminar, el botón pasa a descontabilizar y se rellena la fecha de contabilización. Para ver el asiento, abre la pestaña apuntes.

**Qué se ve:**
- Clip **v2** 1:29:29–1:29:43 (5369–5383 s, 14.0 s, velocidad ×1.15); recorte `0,88,1680,918` sobre 1680×1048; panel 3D «Pulsa Contabilizar».
- Callout 1: «Pulsa Contabilizar» → `314,972,92,28` (t=0.73 s)
- Callout 2: «Ahora: Descontabilizar» → `310,972,118,28` (t=7.26 s)
- Callout 3: «Fecha contabilización» → `1003,340,80,24` (t=8.13 s)
- Callout 4: «Pestaña Apuntes» → `400,180,78,26` (t=9.87 s)

### 96. `asiento-albaran-pantalla` · pantalla · Consulta el asiento — *Contabilizar el albarán · paso 2 de 2*  (≈ 21 s)

**Qué se hace:** Contabilizar el albarán y consultar el asiento (pestaña Apuntes).

**Narración:** En la pestaña apuntes ves el asiento 63 del diario de compras, con el albarán como documento. La cuenta 4009 es proveedores, facturas pendientes de recibir o de formalizar. En la vista, la 4009 al haber por 9.000 euros y la 6000 al debe por lo mismo.

**Qué se ve:**
- Clip **v2** 1:29:55–1:30:15 (5395–5415 s, 20.0 s, velocidad ×1.05); recorte `0,88,1680,918` sobre 1680×1048; panel 3D «Consulta el asiento».
- Zoom a `0,360,1120,50` al decir «cuenta»
- Zoom a `0,770,1680,80` al decir «vista»
- Callout 1: «Asiento 63 · Diario Compras» → `560,288,320,48` («asiento»)
- Callout 2: «201501RC-000002» → `1110,288,330,24` («documento»)
- Callout 3: «4009 · Proveedores, facturas pendientes de recibir o de formalizar» → `6,374,1100,24` («cuenta»)
- Callout 4: «4009 haber 9.000 · 6000 debe 9.000» → `0,790,1660,46` («vista»)

### 97. `por-que-4009` · conceptos · ¿Por qué contabilizar el albarán?  (≈ 26 s)

**Qué se hace:** Decidir la política de contabilización de albaranes (cuenta 4009).

**Narración:** ¿Para qué? Para reflejar un gasto ya incurrido: tienes la mercancía y sabes a quién se la debes, aunque no tengas factura. Es opcional: tiene sentido en empresas con stock y menos en servicios. El botón solo aparece si el tipo de albarán tiene tipo de asiento. Y la 4009 es una cuenta genérica, así que conviene vigilar su cuadre.

**Qué se ve:**
- Tarjetas: Gasto ya incurrido (Mercancía recibida sin factura) · Opcional (Empresas de stock, sí; servicios, quizá no) · Según el tipo (Sin tipo de asiento, no hay botón) · Cuadrar la 4009 (Cuenta genérica: vigílala)

### 98. `valorar-sin-pedido` · pantalla · ¿Y si el albarán no tiene pedido?  (≈ 22 s)

**Qué se hace:** Elegir el criterio de valoración del tipo de albarán para albaranes sin pedido.

**Narración:** Si el albarán viene de un pedido, el precio lo marca el pedido. Si no tiene origen, lo decide el tipo de albarán, en valoración: tarifa, última compra o coste medio. Una empresa de stock quizá prefiera coste medio; la caja de leche que llega cada día, última compra.

**Qué se ve:**
- Clip **v2** 1:34:04–1:34:18 (5644–5658 s, 14.0 s); recorte `0,88,1680,918` sobre 1680×1048; panel 3D «¿Y si el albarán no tiene pedido?».
- Zoom a `0,380,700,140` al decir «tipo»
- Callout 1: «Tarifa · Última compra · Coste medio · No» → `170,410,126,90` («tipo»)

> **Nota de revisión:** Se corta antes de 5660 s (pestaña de Google Calendar con aviso de reunión).

### 99. `repaso-cap7` · resumen ·  — *Capítulo 7*  (≈ 19 s)

**Narración:** Repaso: el albarán nace del pedido. Con agregar líneas traes las del pedido y ajustas lo recibido; si falta algo, el pedido queda parcial. El asiento lleva la 6000 contra la 4009. Y sin pedido, valora el tipo de albarán.

**Qué se ve:**
- Checklist: El albarán nace del pedido · Agregar líneas y ajustar cantidades · Recepción parcial: pedido Parcial · Asiento: 6000 contra 4009 · Sin pedido, valora el tipo

## Capítulo 8 · Del albarán a la factura  (≈ 5 min 03 s)

### 100. `cap8` · capitulo · Del albarán a la factura  (≈ 5 s)

**Narración:** Capítulo ocho: del albarán a la factura.

**Qué se ve:**
- Capitulo: «Del albarán a la factura» — Conformar, controlar y contabilizar

### 101. `tipologia-fca` · pantalla · El tipo de factura FCA  (≈ 22 s)

**Qué se hace:** Revisar el tipo de factura: origen suministros, condición (no facturados), tipo de asiento, tipo de workflow.

**Narración:** La factura también tiene tipo: FCA, factura de compra de albaranes, serie FC. Su origen son los suministros, es decir, los albaranes, y solo los que no están facturados. Lleva su tipo de asiento para contabilizar. Fíjate en que el tipo de workflow está vacío: luego lo echaremos de menos.

**Qué se ve:**
- Clip **v2** 1:34:46–1:34:54 (5686–5694 s, 8.0 s); recorte `0,88,1680,918` sobre 1680×1048; panel 3D «El tipo de factura FCA».
- Zoom a `0,250,1680,190` al decir «suministros»
- Callout 1: «FCA · Factura de Compra de Albaranes · FC-» → `0,266,1680,26` («albaranes»)
- Callout 2: «Tabla origen: Suministros» → `0,324,560,26` («suministros»)
- Callout 3: «estcab != 'F'» → `0,350,700,24` («facturados»)
- Callout 4: «Tipo asiento FCA» → `4,406,280,24` («asiento»)

> **Nota de revisión:** Ruta: Compras › Maestros › Documentos › Facturas. Se evita 5660–5683 s (Google Calendar).

### 102. `fac-menu` · pantalla · Abre Compras › Facturas › Registro — *Registrar la factura · paso 1 de 4*  (≈ 6 s)

**Qué se hace:** Abrir Compras › Facturas › Registro.

**Narración:** Cuando llega la factura del proveedor, abre Compras, facturas, registro.

**Qué se ve:**
- Clip **v2** 1:35:24–1:35:26.5 (5724–5726.5 s, 2.5 s); recorte `0,115,1080,640` sobre 1680×1048; panel 3D «Abre Compras › Facturas › Registro».
- Zoom a `0,220,420,220` al decir «registro»
- Callout 1: «Compras › Facturas» → `28,250,200,24` («facturas»)
- Callout 2: «Registro» → `60,273,140,24` («registro»)

### 103. `fac-obligatorio` · pantalla · Nueva factura: falta el número del proveedor — *Registrar la factura · paso 2 de 4*  (≈ 13 s)

**Qué se hace:** Nueva factura de tipo FCA; el número de factura del proveedor es obligatorio.

**Narración:** Con nuevo se abre una factura de tipo FCA. El campo factura proveedor está en rojo: es obligatorio, y si lo dejas vacío el sistema te avisa.

**Qué se ve:**
- Clip **v2** 1:35:56–1:36:16 (5756–5776 s, 20.0 s, velocidad ×1.85); recorte `0,88,1680,918` sobre 1680×1048; panel 3D «Nueva factura: falta el número del proveedor».
- Zoom a `830,240,840,120` al decir «rojo»
- Callout 1: «Tipo FCA» → `0,264,620,24` («FCA»)
- Callout 2: «Factura proveedor: obligatorio» → `1250,314,350,24` («rojo»)
- Callout 3: «Debe completar (Factura proveedor)» → `1130,308,470,32` (t=7.33 s)

### 104. `fac-numero` · pantalla · Teclea el número del proveedor — *Registrar la factura · paso 3 de 4*  (≈ 13 s)

**Qué se hace:** Informar el número de factura del proveedor.

**Narración:** Teclea el número que trae el papel, FACT uno. No se puede repetir para el mismo proveedor y fecha, así evitas registrar dos veces la misma factura.

**Qué se ve:**
- Clip **v2** 1:36:19–1:36:36 (5779–5796 s, 17.0 s, velocidad ×1.6); recorte `0,88,1680,918` sobre 1680×1048; panel 3D «Teclea el número del proveedor».
- Callout 1: «FACT-1» → `1250,314,350,24` («FACT»)

### 105. `alta-factura` · pantalla · Elige el proveedor y teclea el importe — *Registrar la factura · paso 4 de 4*  (≈ 15 s)

**Qué se hace:** Nueva factura: tipo FCA; número de factura del proveedor (obligatorio, único por proveedor y fecha); proveedor; importe total de la factura en papel.

**Narración:** Elige el proveedor SEAT, que completa el resto de datos, y teclea el importe total que dice el papel: 8.750 euros. Al grabar, la factura recibe su número interno con la serie FC.

**Qué se ve:**
- Clip **v2** 1:36:56–1:37:25 (5816–5845 s, 29.0 s, velocidad ×2.0); recorte `0,88,1680,918` sobre 1680×1048; panel 3D «Elige el proveedor y teclea el importe».
- Zoom a `0,370,840,110` al decir «SEAT»
- Zoom a `830,860,840,80` al decir «8.750»
- Callout 1: «Proveedor P00001 · SEAT» → `0,398,420,24` («SEAT»)
- Callout 2: «Importe factura 8.750» → `1250,900,410,26` («8.750»)
- Callout 3: «1215FC-000001» → `1250,262,350,24` («número»)

> **Nota de revisión:** CORRECCIÓN: el importe 8.750 es un dato puesto a propósito por el formador («imaginemos que me dicen que son 8.750»); no cuadra con el albarán y provoca después el error 3000.

### 106. `conformar-menu` · pantalla · Conformar albaranes — *Conformar albaranes · paso 1 de 3*  (≈ 18 s)

**Qué se hace:** Abrir «Conformar albaranes» y elegir la opción.

**Narración:** Una factura puede venir de varios albaranes, por eso no se enlaza con un campo origen sino con el botón conformar albaranes. El menú tiene variantes: por otros terceros, por CIF, por delegación, desconformar o ver diferencias respecto al albarán.

**Qué se ve:**
- Clip **v2** 1:37:40–1:37:52 (5860–5872 s, 12.0 s); recorte `0,88,1680,918` sobre 1680×1048; panel 3D «Conformar albaranes».
- Zoom a `300,190,560,250` al decir «botón»
- Callout 1: «Conformar albaranes y variantes» → `384,204,190,216` («botón»)

### 107. `conformar-rejilla` · pantalla · Elegir el albarán — *Conformar albaranes · paso 2 de 3*  (≈ 19 s)

**Qué se hace:** Marcar uno o varios albaranes del proveedor y conformar.

**Narración:** El sistema busca los albaranes del mismo proveedor y divisa. Aparece el nuestro: 9.000 euros, 10.890 con IVA. Arriba, los totales comparan lo conciliado con el importe de la factura. Marcamos el albarán, se puede marcar más de uno, y pulsamos conformar.

**Qué se ve:**
- Clip **v2** 1:38:00–1:38:32 (5880–5912 s, 32.0 s, velocidad ×1.65); recorte `0,88,1680,918` sobre 1680×1048; panel 3D «Elegir el albarán».
- Zoom a `0,370,1680,180` al decir «totales»
- Callout 1: «201501RC-000002 · 9.000 · con IVA 10.890» → `0,516,1660,26` («proveedor»)
- Callout 2: «Importe factura 8.750» → `0,384,1680,58` («totales»)
- Callout 3: «Marcar · Conformar» → `0,972,600,30` («conformar»)

### 108. `factura-impuestos` · pantalla · Resultado: líneas e impuestos copiados — *Conformar albaranes · paso 3 de 3*  (≈ 18 s)

**Qué se hace:** Comprobar líneas, base imponible, cuota de IVA y total calculado tras conformar.

**Narración:** La factura toma las líneas y los impuestos del albarán: IVA general, base 9.000 y cuota 1.890. Abajo conviven dos cifras: el importe que tecleaste, 8.750, y el que llaman importe neto, 10.890, que en realidad ya lleva el IVA.

**Qué se ve:**
- Clip **v2** 1:38:53–1:38:58 (5933–5938 s, 5.0 s); recorte `0,88,1680,918` sobre 1680×1048; panel 3D «Resultado: líneas e impuestos copiados».
- Zoom a `0,600,1680,100` al decir «impuestos»
- Callout 1: «IVA general · base 9.000 · cuota 1.890» → `0,636,1660,26` («impuestos»)
- Callout 2: «Factura 8.750 · Importe neto 10.890» → `1250,900,410,42` («neto»)

### 109. `calculo-iva` · calculo · El total calculado — *Factura FACT-1*  (≈ 11 s)

**Qué se hace:** Calcular el total con IVA.

**Narración:** La cuenta del sistema: 9.000 euros más el 21 por ciento de IVA dan 10.890. El papel decía 8.750. Algo no cuadra.

**Qué se ve:**
- Contadores: Base imponible (albarán) 9.000 € → IVA general 21 % → Total con IVA

> **Nota de revisión:** CORRECCIÓN: la transcripción dice «10.990»; el ERP muestra 10.890,00.

### 110. `sp-workflow-fca` · cuidado · SIN PANTALLA · Añadir el workflow al tipo FCA — *Sin pantalla*  (≈ 13 s)

**Qué se hace:** En la tipología de facturas FCA, informar Tipo workflow (control importe proveedor = importe calculado).

**Narración:** Antes de validar, el formador asignó un workflow al tipo de factura FCA. Ese cambio no se ve en la grabación, pero tuvo una consecuencia que sí verás.

**Qué se ve:**
- Tarjeta SIN PANTALLA: «Añadir el workflow al tipo FCA» — El formador añadió un tipo de workflow a la tipología FCA con la factura abierta; ese cambio no se ve en pantalla.

> **Nota de revisión:** SIN PANTALLA: el paso no aparece en los vídeos de origen; no se muestra ni se describe más allá de lo que consta.

### 111. `crc` · flujo · El aviso del CRC  (≈ 28 s)

**Qué se hace:** Ante «el CRC ha cambiado», recargar la pantalla y repetir la acción.

**Narración:** Al cambiar el tipo FCA con la factura abierta, salió el aviso de que el CRC ha cambiado. Cuando abres una pantalla, el sistema calcula una huella, un CRC, de los datos y de su parametrización. Si algo cambia mientras tanto, en otra pestaña o por otro usuario, al grabar no coincide y te para. No es un error de datos: recarga y repite.

**Qué se ve:**
- Flujo 3D: Abres la pantalla → Algo cambia → Al grabar → Recargar

> **Nota de revisión:** El cuadro del mensaje CRC no aparece en ningún fotograma (pantalla fija 5980–6120 s); se explica con diagrama.

### 112. `forzar-actualizacion` · pantalla · Si sale el CRC, recarga — *Resolver el error 3000 · paso 1 de 3*  (≈ 10 s)

**Qué se hace:** Pulsar «Forzar actualización de datos» (Alt+R).

**Narración:** Para recargar tienes este botón de la barra superior: forzar actualización de datos, con el atajo alt más erre.

**Qué se ve:**
- Clip **v2** 1:42:20–1:42:30 (6140–6150 s, 10.0 s, velocidad ×1.3); recorte `0,88,1680,918` sobre 1680×1048; panel 3D «Si sale el CRC, recarga».
- Zoom a `900,100,640,120` al decir «botón»
- Callout 1: «Forzar actualización (Alt + R)» → `1100,112,340,86` («botón»)

### 113. `err-validar` · pantalla · Valida: factura bloqueada — *Resolver el error 3000 · paso 2 de 3*  (≈ 13 s)

**Qué se hace:** Validar la factura y leer el motivo del bloqueo (código 3000).

**Narración:** Pulsa validar. El workflow compara importes y la factura queda bloqueada con el código 3000. Pasa el ratón por la lupa: importe proveedor distinto de importe factura.

**Qué se ve:**
- Clip **v2** 1:42:45–1:42:54 (6165–6174 s, 9.0 s); recorte `0,88,1680,918` sobre 1680×1048; panel 3D «Valida: factura bloqueada».
- Zoom a `830,290,840,120` al decir «bloqueada»
- Callout 1: «Pulsa Validar» → `76,972,72,30` («valida»)
- Callout 2: «Bloqueada 3000: IMPORTE PROVEEDOR != IMPORTE FACTURA» → `1005,318,460,76` («bloqueada»)

> **Nota de revisión:** CORRECCIÓN: el informe de tramo 5 decía que el mensaje no aparece en ningún fotograma; sí se ve: Estado «Bloqueada 3000» con la descripción «IMPORTE PROVEEDOR != IMPORTE FACTURA» (≈6172 s).

### 114. `error-3000` · comparativa · Error 3000: los importes no cuadran  (≈ 20 s)

**Qué se hace:** Validar la factura; si el workflow bloquea por diferencia de importes (error 3000), revisar y corregir el importe.

**Narración:** Ahora sí, validamos, y el workflow compara el importe tecleado con el calculado. No coinciden, así que bloquea la factura con el error 3000: importe proveedor diferente importe factura. Te avisa si el proveedor factura mal o si el precio del pedido estaba equivocado.

**Qué se ve:**
- Comparativa «Tecleado (proveedor)» / «Calculado (sistema)»: Factura FACT-1: 8.750 € | 10.890 €; Al validar: Workflow: error 3000, bloqueada | Corregido a 10.890: cuadra

> **Nota de revisión:** El texto del error 3000 se cita del audio (1:42:38); no aparece en ningún fotograma.

### 115. `err-corregir` · pantalla · Corrige el importe — *Resolver el error 3000 · paso 3 de 3*  (≈ 16 s)

**Qué se hace:** Corregir el importe de la factura y validar de nuevo.

**Narración:** La solución es revisar el papel y los albaranes. Aquí el error era a propósito, así que corrige el importe de la factura a 10.890, el que de verdad corresponde, y vuelve a validar.

**Qué se ve:**
- Clip **v2** 1:43:34–1:43:52 (6214–6232 s, 18.0 s, velocidad ×1.35); recorte `0,88,1680,918` sobre 1680×1048; panel 3D «Corrige el importe».
- Callout 1: «Importe factura → 10.890» → `1250,570,410,140` («importe»)

> **Nota de revisión:** Antes de corregir el importe se ve cómo el formador repasa base y cuota (≈6185–6200 s). Verificar al renderizar la posición del campo, porque la página está desplazada.

### 116. `correccion-importe` · pantalla · Importe corregido y albarán facturado — *Resultado*  (≈ 15 s)

**Qué se hace:** Verificar importe corregido, líneas y estado «Facturado» del albarán de origen.

**Narración:** La factura queda en 10.890 y validada. Debajo, las líneas que vinieron del albarán, con los precios arrastrados desde el pedido. Y en albarán origen, el nuestro ya figura como facturado.

**Qué se ve:**
- Clip **v2** 1:44:00–1:44:22 (6240–6262 s, 22.0 s, velocidad ×1.5); recorte `0,88,1680,918` sobre 1680×1048; panel 3D «Importe corregido y albarán facturado».
- Zoom a `0,760,1680,180` al decir «líneas»
- Callout 1: «Importe factura 10.890» → `1498,580,162,24` («10.890»)
- Callout 2: «A6 6.000 · A4 3.000» → `0,788,1660,34` («líneas»)
- Callout 3: «Albarán origen: Facturado» → `0,896,1660,28` («facturado»)

### 117. `fac-contabilizar` · pantalla · Contabiliza con fecha — *Contabilizar la factura · paso 1 de 2*  (≈ 10 s)

**Qué se hace:** Contabilizar la factura indicando la fecha de contabilización.

**Narración:** Pulsa contabilizar. El sistema pide la fecha de contabilización, por defecto la del documento; acepta. La factura pasa a contabilizada.

**Qué se ve:**
- Clip **v2** 1:45:24–1:45:36.5 (6324–6336.5 s, 12.5 s, velocidad ×1.1); recorte `0,88,1680,918` sobre 1680×1048; panel 3D «Contabiliza con fecha».
- Callout 1: «Fecha de contabilización · Ok» → `650,428,380,232` (t=1.66 s)
- Callout 2: «Contabilizada» → `1008,342,130,24` (t=7.57 s)
- Callout 3: «Descontabilizar» → `88,972,106,30` (t=8.48 s)

### 118. `asiento-factura-pantalla` · pantalla · Consulta el asiento de la factura — *Contabilizar la factura · paso 2 de 2*  (≈ 18 s)

**Qué se hace:** Contabilizar la factura y revisar su asiento.

**Narración:** Y este es su asiento, el 64, con FACT uno como documento. Tres líneas: la cuenta del proveedor SEAT al haber por 10.890; la 4720, la del IVA, al debe por 1.890; y la 4009 al debe por 9.000.

**Qué se ve:**
- Clip **v2** 1:45:44–1:45:56 (6344–6356 s, 12.0 s); recorte `0,88,1680,918` sobre 1680×1048; panel 3D «Consulta el asiento de la factura».
- Zoom a `0,680,1680,90` al decir «tres»
- Callout 1: «Asiento 64» → `700,190,120,22` («asiento»)
- Callout 2: «FACT-1» → `1250,190,240,22` («documento»)
- Callout 3: «4000.000002 SEAT · 4720 · 4009» → `0,694,1660,66` («tres»)

> **Nota de revisión:** El vídeo de origen termina a 6396 s con el widget del grabador (≥6389 s); el clip acaba en 6356.

### 119. `vida-4009` · flujo · La vida de la cuenta 4009  (≈ 17 s)

**Qué se hace:** Explicar cómo la factura cancela el saldo de la 4009 generado por el albarán.

**Narración:** Y esta es la vida de la 4009: el albarán la abona por 9.000, la factura la carga por lo mismo, y su saldo vuelve a cero. Si algún albarán se queda sin factura, lo verás aquí.

**Qué se ve:**
- Flujo 3D: Albarán 9.000 € → Factura 9.000 € → Saldo 4009 0 €

### 120. `repaso-cap8` · resumen ·  — *Capítulo 8*  (≈ 20 s)

**Narración:** Repaso: el número de factura del proveedor es obligatorio y único. La factura se conforma con uno o varios albaranes. Si sale el CRC, recarga y repite. El error 3000 avisa de importes distintos. Y al contabilizar, la factura cancela la 4009.

**Qué se ve:**
- Checklist: Número del proveedor, obligatorio y único · Conformar uno o varios albaranes · CRC: recarga y repite · Error 3000: importes distintos · La factura cancela la 4009

## Capítulo 9 · Resumen final  (≈ 1 min 16 s)

### 121. `cap9` · capitulo · Resumen final  (≈ 4 s)

**Narración:** Capítulo nueve: resumen final.

**Qué se ve:**
- Capitulo: «Resumen final» — Todo el circuito de un vistazo

### 122. `ciclo-completo` · flujo · El circuito completo  (≈ 24 s)

**Qué se hace:** Recapitular el circuito con las cifras del ejemplo.

**Narración:** Todo el recorrido. La tarifa del proveedor puso el precio del A6, 2.000 euros. El pedido sumó 10.000 y pasó el workflow. El albarán recibió 9.000, con un A4 pendiente, y se contabilizó contra la 4009. Y la factura, conformada con ese albarán, se validó por 10.890 con IVA y canceló la 4009.

**Qué se ve:**
- Flujo 3D: Tarifa 2.000 € → Pedido [151201PC000003] 10.000 € → Albarán [201501RC-000002] 9.000 € → Factura [FACT-1] 10.890 €

### 123. `errores-tipicos` · conceptos · Errores típicos y su solución  (≈ 22 s)

**Qué se hace:** Repasar incidencias frecuentes y su solución.

**Narración:** Y por si te atascas. ¿Precio cero? Revisa la tarifa del proveedor. ¿No encuentras el pedido al hacer el albarán? Comprueba empresa, delegación y que esté validado o parcial. ¿Pedido bloqueado? Es el workflow. ¿El CRC ha cambiado? Recarga. ¿Error 3000? El importe tecleado no coincide con el calculado.

**Qué se ve:**
- Tarjetas: Precio 0 (Revisa la tarifa del proveedor) · No encuentro el pedido (Misma empresa y delegación; estado V o P) · Pedido bloqueado (Es el workflow, no un error) · El CRC ha cambiado (Forzar actualización (Alt + R)) · Error 3000 (Importe tecleado ≠ calculado)

### 124. `checklist` · resumen · Checklist de una compra  (≈ 15 s)

**Narración:** Tu checklist: tarifa vigente asignada al proveedor; tipo y serie bien dimensionados; pedido validado tras el workflow; albarán con lo realmente recibido; factura conformada y cuadrada; y la 4009, sin saldos olvidados.

**Qué se ve:**
- Checklist: Tarifa vigente asignada al proveedor · Tipo y serie bien dimensionados · Pedido validado tras el workflow · Albarán con lo realmente recibido · Factura conformada y cuadrada · 4009 sin saldos olvidados

### 125. `cierre` · cierre · ¡Ya dominas el circuito de compras!  (≈ 17 s)

**Narración:** Y hasta aquí este tutorial. Ya sabes llevar una compra desde la tarifa hasta el asiento de la factura. En próximos vídeos veremos el workflow, la contabilidad, las devoluciones y el seguimiento de pedidos. ¡Hasta pronto!

**Qué se ve:**
- Cierre: «¡Ya dominas el circuito de compras!» — De la tarifa al asiento de la factura; siguientes: Workflow de aprobación, Contabilidad de compras, Devoluciones, Seguimiento de pedidos

## Verificación

Revisor independiente. Se leyeron enteros los informes `kb/v1_analisis.md`, `kb/v2_tramo1..5.md` y `kb/ESTADO.md`, y se contrastó todo dato de pantalla con fotogramas extraídos del vídeo original (1680×1048) con `ffmpeg -ss <s>` en `kb/verif/`. Ningún dato del guion procede solo de un informe.

### Método

1. Fotogramas exactos de cada dato (cifras, códigos, rutas, campos) y montajes para localizar los cambios de pantalla.
2. Para **cada uno de los 67 clips**: fotograma al inicio (+0,5 s), a la mitad y al final (−0,5 s), con el recorte y los rectángulos de zooms y callouts dibujados encima (`kb/verif/clips/<id>_{a,b,c}.jpg`). Cuando alguno de los tres caía en otra pantalla, en una carga, en una página desplazada o en un aviso, se recortó el tramo y se volvió a comprobar.
3. Validación automática: todos los clips apuntan a `../media/src/…mp4` existentes, el tramo cae dentro de la duración (v1 860 s, v2 6396 s), ningún clip pisa un tramo sucio, todos los rectángulos caen dentro del recorte, ningún recorte incluye la barra de Windows (y ≤ 1006) ni la de marcadores de Chrome (y ≥ 88 en pantallas de ERP), cada `clave` aparece en orden en la narración, y los iconos y tipos son los del motor. El JSON parsea y `npx tsc --noEmit` pasa.
4. Aviso de método: en los montajes con `fps=1/N` el instante real puede desviarse hasta N/2 s, así que **todos los límites de clip se fijaron con fotogramas exactos**, no con montajes.

### Datos comprobados en pantalla (segundo del vídeo)

| Dato | Dónde | Resultado |
|---|---|---|
| Ruta Compras › Maestros › Tarifas › Condiciones tarifados / Precios (Registro, Impresión, Informes) / Descuentos | v1 362, 505 | ✔ literal |
| Compras › Maestros › Documentos: Concursos, Ofertas, Formularios, Solicitudes, Acuerdos, Pedidos, Albaranes, Facturas, Anticipos, Clasificaciones, Bloqueos/Autorizaciones | v1 175 | ✔ |
| Compras › Pedidos: Registro, Registro b2b, e-Procurement (familias), e-Procurement (formularios), Impresión, Situación, Seguimiento, Work Flow, Procesos | v2 3072 | ✔ (el informe abreviaba «Regis…», «Proce…») |
| Compras › Albaranes: Registro, Impresión, Situación, Seguimiento, Contabilización, Work Flow, Procesos, Fuera factura, Costes asociados | v2 4713 | ✔ **nuevo**: el informe decía que no se veía la ruta |
| Compras › Facturas: Registro, Impresión, Impresión factura-albaranes, Situación, Seguimiento, Contabilización, Work Flow, Procesos | v2 5724 | ✔ |
| Tarifa COMPRA: EUR, 01-04-2015 → 31-08-2015, prioridad 0, lunes a viernes; COCHE A6 **35.000,000000** | v1 548 | ✔ |
| Tarifa G00003: vigente hasta 01-01-3000, siete días; línea COCHE A6 **2.000,000000** | v1 548 (Vista), 600 | ✔ |
| Descuentos generales de la línea: orden 5 y 10, DES «DESCUENTO COMERCIAL», **−10,00 / −12,00**, Porcentaje, Escalado, Precio base, Distribuidor, Factura | v1 600 | ✔ (la columna marcada es **Escandallo**, no «Escalando») |
| Delegación TGN «ALMACEN TARRAGONA»: Condiciones comerciales (Tarifa precios, Tarifa descuento, Descuentos familia) vacías | v2 110 | ✔ |
| Lista del campo: TARIFAS DE PRECIOS DE VENTAS: VENTA, VENTA02, VENTA02B | v2 82 | ✔ |
| Proveedor P00001 SEAT, Datos económicos, Tarifa precios COMPRA → **G00003**, fecha de modificación 11-12-2015 11:22:16 | v2 452, 464, 476 | ✔ |
| Permisos del grupo `public`, agrupación PEDIDOS DE COMPRAS, fila 8 Precios: Ver precios / Ver y modificar precios / No permitido | v2 4045 | ✔ (sin datos personales en el encuadre) |
| Tipos de pedido PC y PC2, series PC- y PC2- | v2 1072 | ✔ (se evita el error JRepException de 1060 s) |
| Ficha PC: serie PC-, estado Activo, Tipo workflow **PCW01 «Workflow Departamental»** | v2 1120 | ✔ |
| Serie PC-: Numerador ✔, **Justificación 6**, **Excluir separador ✔**, Control cronológico ☐, Renovación Perpetua, 15-04-2015 → 31-12-3000 | v2 1225 | ✔ |
| Máscaras: `[yy#mm#e]` (15#0401PC-), `[yy#e]` (1501PC-, 1501PC2-, 1502PC-, 1503PC-), `[yymm#e]` (150401PC-, **151201PC-**); Excluir separador marcado en las nueve series | v2 1157, 1225, 1525 | ✔ |
| Tabla origen (desplegable completo) | v2 1852,5 | ✔ ver corrección 4 |
| Fecha valoración: Fecha inicio / Fecha fin / Documento / No valorar | v2 1942 | ✔ |
| Tipo: Normal / Reposición / Programación / Muestras | v2 2400 | ✔ |
| Pedido **151201PC000003** creado y «Bloqueado 26000» al guardar | v2 3488, 3525 | ✔ |
| Línea COCHE A6 3 × **2.000** = 6.000,00 Validada; COCHE A4 4 × 0 → **1.000** = 4.000,00; órdenes 1 y 3 | v2 3622–3665, 3716–3725 | ✔ |
| Importe neto del pedido **10.000,00** y estado Validado | v2 4222 | ✔ |
| Botones del workflow del pedido | v2 4075–4200 | ✔ ver corrección 1 |
| Tipo RC: Tabla origen Pedidos, `gcompedh.estcab in ('V','P')`, Actualizar origen Sumando, NDIS → DISP, Valorar Tarifa | v2 4270 | ✔ |
| Albarán **201501RC-000002**, origen 151201PC000003, Validado | v2 4897 | ✔ |
| Agregar líneas: A6 3 y A4 4 → se cambia A4 a 3 → queda 1 pendiente y el pedido pasa a Parcial | v2 4996–5046 | ✔ |
| Albarán: A4 3 × 1.000 = 3.000; A6 3 × 2.000 = 6.000; total **9.000,00** | v2 5362 | ✔ |
| Pedido Parcial: A4 4 pedidas / 3 servidas «Parcial», A6 3/3 «Servida» | v2 5170 | ✔ |
| Asiento 63, diario DC, documento 201501RC-000002: **4009** «Proveedores, facturas pendientes de recibir o de formalizar» haber 9.000; **6000** debe 9.000 | v2 5430 | ✔ |
| Valorar del tipo de albarán: Tarifa / Última compra / Coste medio / No | v2 5648 | ✔ |
| Tipo FCA «Factura de Compra de Albaranes», serie FC-, Tabla origen Suministros, `gcommovh_s.estcab !='F'`, Tipo asiento FCA, Tipo workflow vacío | v2 5690 | ✔ |
| Factura nueva: «DEBE COMPLETAR (Factura proveedor)»; **FACT-1**; P00001 SEAT; Importe factura **8.750** (tecleado 8750 a 5839, formateado a 5842) | v2 5769, 5790, 5844 | ✔ |
| Conformar albaranes (7 opciones); fila 201501RC-000002, importe 9.000, con IVA **10.890,00**; Importe factura 8750 | v2 5866, 5895 | ✔ |
| Impuestos CN / NOR / IVA general, base **9.000**, cuota **1.890**; Importe factura 8.750, «Importe neto» 10.890 | v2 5935 | ✔ |
| «Forzar actualización de datos (Alt + R) (Shift + Ctrl + R)» | v2 6145 | ✔ |
| Factura «Bloqueada 3000», descripción **IMPORTE PROVEEDOR != IMPORTE FACTURA** | v2 6172 | ✔ ver corrección 2 |
| Importe corregido 10.890; albarán origen «Facturado» | v2 6232–6262 | ✔ |
| Contabilizar factura: ventana «Fecha contabilización 11-12-2015 · Ok» → «Contabilizada» | v2 6326, 6334 | ✔ **nuevo** |
| Asiento 64, documento FACT-1: 4000.000002 SEAT haber 10.890; 4720 debe 1.890; 4009 debe 9.000 | v2 6345 | ✔ |

### Correcciones respecto a los informes y a los vídeos originales

1. **Workflow del pedido.** El informe del tramo 4 hablaba de «26000 → 26010 OTRO WORKFLOW» y de unos botones «Enviar a Director General / >3000€ Autorizar». En los fotogramas se ve la secuencia completa: **>3000€ Autorizar** (motivo, 4094 s) → **Aprobar Jefe de Central** (4104) → **Aprobar Director General** (4112) → **Aprobación Comité** (4120) → **Confirmar Envío mail** (4128) → **Validado** con «Marcar como servida» (4200). Coincide con el audio (1:08:08). Se presenta como parametrización propia de esa instalación.
2. **Error 3000.** El informe del tramo 5 decía que el mensaje no se veía en ningún fotograma. Sí se ve: Estado «Bloqueada 3000» y la descripción «IMPORTE PROVEEDOR != IMPORTE FACTURA» (6172 s). Se usa como evidencia.
3. **El pedido nace bloqueado** al guardar la cabecera (3488 s), antes de pulsar nada más. No es consecuencia de pulsar Validar, como sugería el informe.
4. **Tabla origen** del tipo de pedido admite 11 valores (Oferta compras, Pedido compras, Acuerdos marco, Órdenes de trabajo, Pedido ventas, Solicitud compras, Orden producción, Acuerdos de ventas, Descuento general, Descuento familia, Ninguna). El informe solo citaba dos, y en clase solo se explican esos dos.
5. **COCHE A6, 35.000 frente a 2.000.** Ningún original lo comenta. Se presenta como dos tarifas distintas con datos de demo (COMPRA caducada, G00003 vigente) y se fija 2.000 como precio del ejemplo, que es el que propone después el pedido (3622 s).
6. **Delegación.** v1 afirma que la delegación lleva tarifa de compra y de venta; v2 lo rectifica (solo venta). El guion enseña la versión correcta y lo dice de forma explícita (escena `correccion-delegacion`).
7. **Descuentos escalados.** Se ven −10 % y −12 % en la línea del A6, pero el pedido sale a 3 × 2.000 = 6.000 sin descuento. Las fuentes no explican por qué (puede ser el umbral del escalado o la liquidación en factura). El guion lo señala sin afirmar el mecanismo, y el cálculo de 1.800 se marca como ejemplo ilustrativo.
8. **Justificación 6.** El formador dice «PC guion 0000001» (7 cifras). Son 6 cifras, y el guion queda fuera por «Excluir separador»: el número real es 151201PC000003.
9. **10.990 → 10.890.** La transcripción dice 10.990; el ERP muestra 10.890,00 (9.000 + 21 %).
10. **8.750.** Es un importe puesto a propósito por el formador para provocar el control; el guion lo explica así.
11. «Escandallo» (no «Escalando»); «#e» (no «arroba e») en las máscaras; «FACT-1», «Factura de Compra de Albaranes» y demás rótulos, literales de pantalla.
12. Tiempos ajustados frente a los informes: la lista de direcciones del proveedor está abierta en 3362–3373 s; el asiento 64 se ve en 6342–6356 s (de 6356 a 6378 se vuelve a ver el 63); la pantalla «Líneas de pedidos de compras» a 3650 s y la ventana en blanco a 3700 s quedan fuera.

### Exclusiones por privacidad y limpieza (ningún clip las toca; lo comprueba `gen.py`)

- **Rejilla «Usuarios»** con nombres y e-mails reales: v2 ≈3800–3960 s. El permiso de precios se enseña desde la pantalla de permisos del grupo (4036–4056 s), sin usuarios.
- **Pantalla de inicio de sesión** (usuario visible y contraseña enmascarada): v2 3075,5–3117 s. Detectada en esta revisión; no constaba en los informes.
- **Avisos de Gmail**: v2 1165–1199 s. **Google Calendar**: pestaña a 5659–5684 s y aviso emergente en la esquina inferior derecha a ≈5695–5705 s (detectado en esta revisión; el clip FCA acaba en 5694 s).
- **Errores de conexión** (ERR_CONNECTION_TIMED_OUT, Camtasia): v1 790–860 s y v2 955–1049 s. **JRepException**: v2 1058–1069,5 s.
- **Widget del grabador**: v2 ≥ 6389 s. **Pantallas en blanco o en carga**: v1 455–488, v2 3695–3705, 5383,6–5391,5, 6337–6339,5 s, entre otras.
- **Ventana de e-mail** con la dirección tecleada: v2 4140–4192 s.
- **Listas de terceros y proveedores** con nombres de apariencia personal (v2 436 s y 3338–3355 s): no se usan.
- Todos los recortes de pantalla del ERP empiezan en y = 88 (fuera quedan la barra de marcadores, con «Gmail O&S», y las pestañas) y acaban en y ≤ 1006 (fuera la barra de Windows y su reloj).
- Quedan visibles **códigos de usuario de login** (`<usuario>`, `<usuario>`, `<usuario>`…) en los bloques «Datos de control» y algún tooltip. No son nombres ni e-mails, pero si se quiere el máximo cuidado, se pueden difuminar en el render.

### Pasos que no se ven en los originales (marcados como SIN PANTALLA o solo citados)

Alta de una tarifa nueva (cabecera y líneas) · ruta de menú a Terceros y a Delegaciones (se abrieron tecleando la dirección) · alta de una serie y de su máscara · grabar cambios en el tipo de pedido (solo se consulta; el único cambio en vivo es Tabla origen a Solicitud compras) · asignar el workflow al tipo FCA · el cuadro del mensaje CRC · segundo albarán para el A4 pendiente · «Marcar como servido» · desconformar y descontabilizar · tipos de pedido interempresa, reposición, rappel y anticipos (solo conceptos).

### Dudoso o pendiente

- **Prioridad** y **días** de la tarifa: se ven, pero su efecto no se explica; el guion no lo afirma.
- **Campos a ocultar**: no consta si la casilla marcada oculta o muestra el campo.
- **Límite de 20 posiciones** del número y **regla del duplicado tras 999.999**: solo constan de palabra; el nombre del campo no se ve.
- **«#nomacc»**: rótulo sin traducir en la barra de la factura bloqueada (6169 s); no se nombra en la narración.
- **Duración y velocidad de clips**: tras `voz.py`, `gen.py` lee la duración real de cada escena en `video/out/plan.txt` y fija `velocidad` = (fin − inicio) / (duración − 0,3 − 0,8), entre 1 y 2,2 (36 escenas aceleradas, máximo 2,2; `alta-factura` se recortó a 5816–5845 s para no pasar de 2,2). Ningún clip queda cortado. Los `t` de los callouts por tiempo se recalculan como clipDesde + (segundo del vídeo − inicio) / velocidad. Comprobado con stills renderizados de val-paso1, val-paso2, agregar-lineas, alb-contabilizar y fac-obligatorio (`video/out/stills_vel/`).
- Los **callouts sincronizados por tiempo** (`t` calculado desde el segundo del vídeo con la velocidad del clip) están en `validar` (val-paso1/2), `agregar-lineas`, `alb-contabilizar`, `fac-obligatorio`, `fac-contabilizar` y `documento-origen`; si se cambia la velocidad, hay que recalcularlos (lo hace `gen.py`).

### Regenerar

Las fuentes del guion están en `kb/verif/gen/`: `escenas.py` (escenas, con «Qué se hace» y notas), `gen.py` (genera `guion.json`, valida y dibuja los fotogramas: `python3 gen.py --write --frames`) y `md.py` (este documento).

