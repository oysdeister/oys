# Vídeo v2 «Tarifas y documentos de compra» · TRAMO 3 (43:00–1:04:30)

Fuentes: `media/v2_tarifas/tramo3.txt`, `transcript.srt` y 66 fotogramas propios cada 20 s (`media/v2_tarifas/t3/g_NNN.jpg`, segundo absoluto = 2580 + (NNN-1)*20; g_001 = 43:00, g_066 = 64:40). Se han mirado ~38 de los 66, incluidos todos los cambios de pantalla (los cambios de pantalla son pocos: hay largos tramos con la misma imagen).

Contexto en pantalla: ERP **Deister**, entorno «**O&S Learning (Test)**» (dbms=learning), usuario `<usuario> [sws100]`, Chrome en Windows 7, reloj del sistema 11/12/2015 (12:30 a 12:52 en el tramo). Servidor 212.36.72.159. Pestañas abiertas de Chrome: «Deister - 1», «Aplicaciones - Bases de…», «O&S Learning (Test)», «TIPOLOGÍA DE PEDIDOS…», «MAESTRO DE PROVEEDORES», «MAESTRO DE ARTÍCULOS», «TARIFAS DE PRECIOS DE…», «MAESTRO DE DELEGACIONES». La grabación solo muestra la pantalla del ponente (no hay Word).

## 1. Resumen en 5 líneas
1. Cierra la explicación de la **tipología de pedido de compra** (`PC`, «Pedido de Compra», objeto `gcompedd`): tipo de pedido normal/reposición/programación/muestras, validar catálogo, objeto de impresión, tipo de workflow `PCW01`.
2. Explica con ejemplos orales (ruedas, supermercados Bonpreu, formularios rosa y verde) para qué sirve cada opción; solo ve en pantalla Tipo, Validar catálogo, Compromiso inversión, Impresión y Tipo workflow.
3. Crea en vivo un **pedido de compra** (Compras › Pedidos › Registro, objeto `gcompedh`): tipo `PC`, proveedor `P00001` SEAT, dirección `0`; ve el maestro de proveedores y la dirección del tercero; el pedido nace como `151201PC000003`.
4. Añade dos líneas: **COCHE A6** ×3 a 2.000 (precio por tarifa del proveedor, neto 6.000,00) y **COCHE A4** ×4 sin tarifa (precio 0, luego 1.000 puesto a mano, neto 4.000,00); numeración de líneas 1 y 3 (el ponente dice que se numeran «de dos en dos»).
5. Termina (desde 1:00:55 la transcripción degenera en texto repetido) con pregunta sobre ocultar campos por permisos: «Campos a ocultar» del tipo de pedido frente a perfiles de usuario, y abre Maestros › Parametrización › Configuración (pantalla «Usuarios»).

## 2. Tabla de bloques

| # | Inicio–fin | Tema | Valor | Qué se ve |
|---|---|---|---|---|
| 1 | 43:00–45:50 | Cierre de la idea de reposición automática (ruedas, mínimo de stock, plazos de proveedor, workflow si el proveedor incumple) | Medio (concepto; buen guion para diagrama) | Pantalla «TIPOLOGÍA DE PEDIDOS DE COMPRAS» con el desplegable Tipo abierto (Normal, Reposición, Programación, Muestras); estático |
| 2 | 45:50–46:30 | Introducción al campo **Validar catálogo** | Medio | Misma pantalla; Tipo=Normal, Validar catálogo=No, Compromiso inversión=Sí (desde ~47:00) |
| 3 | 46:30–48:00 | Validar catálogo: surtido por delegación/almacén (ruedas/baterías/puertas; retail Bonpreu IPER vs súper) | Alto (regla de negocio clara) | Misma pantalla (Pestaña «Indicadores») |
| 4 | 48:00–48:29 | Compromiso de inversión, tesorería, terceros (muy mal transcrito) | Bajo | Misma pestaña |
| 5 | 48:29–50:10 | **Impresión de documentos**: objeto de impresión distinto del objeto de edición (`gcompedd`/pedido vs formato de papel); ejemplo formularios rosa y verde | Alto | Pestaña «Impresión de documentos»: Impresión=Sí, Objeto impresión vacío (frames g_020/g_021…, desde ~48:50) |
| 6 | 50:10–50:52 | **Workflow** (tipo workflow `PCW01` «Workflow Departamental»), se verá en otra sesión | Medio | Campo «Tipo workflow» resaltado (g_023, 50:20) |
| 7 | 50:52–51:50 | Navegar a Compras › Pedidos › Registro (menú contextual «Abrir enlace en una pestaña nueva») y abrir pedido existente 151201PC000002 | Alto (ruta de menú) | Escritorio con Pedidos desplegado: Registro, Regis…, e-Pro…, Impre…, Situa…, Segui…, Work…, Proce… (g_025); luego pedido `151201PC000002` Bloqueado 26000 (g_027) |
| 8 | 51:50–55:10 | Alta de pedido nuevo (botón página en blanco): cabecera por defecto, unidad de negocio, fechas, serie con máscara, referencia, origen, clasificación | Alto | Formulario «Pedidos compras» en blanco: Tipo documento PC, Empresa 01, Delegación D01, Departamento 0, Almacén D01; Pedido `151201PC-` (g_032, g_035, g_037) |
| 9 | 55:10–57:50 | Proveedor y dirección: P00001 SEAT, múltiples direcciones/delegaciones de proveedor, dirección fiscal 0 frente a dirección de entrega; «Recepcionar en» | Alto | Popup MAESTRO DE PROVEEDORES (g_039, ~56:00); popup DIRECCIONES DE TERCEROS (g_042–g_045, ~56:40–58:00); pedido guardado `151201PC000003` con estado Bloqueado (g_047) |
| 10 | 57:50–59:40 | Estado y workflow tras el alta; paso a las líneas; numeración de líneas | Medio | Cabecera con Estado «Bloqueado» 26000; pestaña Líneas (g_050, ~59:40) |
| 11 | 59:40–1:01:10 | Línea 1: COCHE A6 ×3 con precio de tarifa 2.000,000000 (neto 6.000,00); decimales parametrizables | Alto | Formulario «Líneas de pedido» (g_050–g_055) |
| 12 | 1:01:10–1:02:10 | Línea con artículo sin tarifa: COCHE A4 ×4 precio 0 (luego 1.000 a mano) | Alto | g_057 (A4 precio 0,000000), g_058 (A4 a 1.000,000000, neto 4.000,00; grid con 2 líneas: orden 3 y 1) |
| 13 | 1:02:10–1:03:00 | Ocultar campos / bloquear casillas: por tipo de pedido («Campos a ocultar») o por usuario | Medio-alto | Tipología con pestaña «Campos a ocultar» (g_059, 62:20) con casillas por campo |
| 14 | 1:03:00–1:04:30 | Perfil de usuario: menú Maestros › Parametrización › Configuración → «Usuarios» | Medio | Escritorio (g_061, g_063), jrep cargando (g_064), pantalla «Usuarios» (g_065–g_066) |

Nota de sincronía: las horas del reloj de pantalla avanzan a veces más de lo que avanza el vídeo (p. ej. 12:43 y 12:47 separados 4 min de reloj frente a ~3 min de vídeo); la grabación probablemente tiene cortes/pausas. Fiarse del fotograma, no de la transcripción para ubicar la pantalla (el audio va entre 0 y ~20 s por delante o por detrás).

## 3. Detalle por bloque útil

### Bloque 1–6 · Tipología de pedido de compra (43:00–50:52)

Ruta de pantalla: ya abierta en una pestaña como «TIPOLOGÍA DE PEDIDOS DE COMPRAS» (URL `…formauto_s_lite.jsp?code=gcompedd…`). **No se ve cómo se llega por menú** (probablemente Compras › Maestros › Documentos › Pedidos; en el bloque 7 se ve Compras › Maestros › Documentos ya desplegado «Concursos…»). Barra de iconos superior: ←, →, rayo, refrescar, nuevo, +, ✓, ✗, impresora, tabla, lupa, libro, home.

Pantalla (literal):
- Sección **Identificación**: *Tipo pedido* `PC`; *Descripción* «Pedido de Compra»; *Serie* `PC-`; *Pedido relacionado* (vacío); *Estado* «Activo».
- Sección **Documento origen** con pestañas «Documento origen» y «Solicitud origen»: *Tabla origen* «Ninguna»; *Actualización tabla origen* NULL; *Copia línea origen* NULL; *Condición selección*.
- Sección **Valoración**: *Fecha valoración* «Documento»; *Valorar* ✓; *Descuentos especiales*; *IVA incluido*; *Anticipos* «No»; *Tipo de anticipo*; *Tipo presupuesto*.
- **Facturación interempresa**: *Pedido venta*.
- Pestaña **Indicadores**: *Tipo* (desplegable: Normal, Reposición, Programación, Muestras; valor Normal); *Validar catálogo* (No); *Compromiso inversión* (Sí); casillas *Devolución*, *Tesorería*, *Datos contables*, *Dirección artículos/almacén*, *Estadísticas*, *Histórico*.
- **Logística**: *Tipo reserva*, *Tipo de propuesta*, *Stock planificado* (No), *Consistencia reservas*, *Alternativos*.
- Pestaña **Impresión de documentos**: *Impresión* (Sí); *Objeto impresión* (vacío).
- **Datos generales** (y pestaña «Campos a ocultar»): *Circuito*, *Tipo ADO*, *Tipo característica*, *Tipo workflow* `PCW01` «Workflow Departamental».
- Cajas inferiores: Información adicional, Datos de control (usuario alta <usuario>, 15-04-2015 11:27:40; usuario modificación <usuario>, 20-04-2015 10:24:27), «Workflow» y «Docflow».

Pasos que realiza: abre el desplegable *Tipo*; cambia a la pestaña Impresión de documentos (≈48:50); señala *Tipo workflow*. No guarda nada.

Conceptos y reglas de negocio explicados:
- **Reposición automática** (tipo «Reposición»): el sistema calcula la falta de stock, **genera el pedido solo** (artículo, precio de tarifa), y **envía un e-mail al proveedor** sin preguntar; por eso hacen falta **tarifas prefijadas**. Alternativa: el sistema solo genera un **aviso** y el responsable decide. Ejemplo: stock de 100 ruedas; faltan 6; pedido que llega en 3 horas; salida de 1 coche cada 2 horas → mínimo de 10 y reposición lanzada cada hora. Motivo de negocio: **stock mínimo**, el dinero de 84 ruedas inmovilizadas se libera.
- **Plazos de entrega del proveedor** parametrizados en el maestro de proveedores: el pedido se fecha; en la recepción se compara y, si el proveedor incumple, salta un **workflow**. («no lo vamos a ver»).
- **Validar catálogo**: por defecto un pedido admite **todos los artículos del maestro de artículos**. Si se activa, se limita a un **catálogo por delegación/departamento/almacén**. Ejemplo: delegación que solo gestiona ruedas → no puede pedir puertas ni baterías. Pensado para **retail**: Bonpreu con hipermercados («IPER», todos los artículos) y supermercados más pequeños (catálogo reducido); el maestro tiene todo pero el comprador de una tienda no puede elegir un artículo que no esté en su catálogo. «El uso lo define el cliente.»
- **Impresión de documentos**: todos los documentos de gestión tienen un **objeto de impresión** separado del objeto de edición. El pedido se edita con `gcompedd`/`gcompedh` (se ve en la URL, «gcom pedache» en el audio); el formato de papel/PDF es otro objeto, personalizable (logo, nota de advertencia…). Se vincula al **tipo de pedido**. Ejemplo: empresa que trabaja a mano con «formulario rosa» y «formulario verde» → dos tipos de pedido, cada uno con su objeto de impresión.
- **Workflow**: se asocia a todos los documentos como **condiciones de validación** programables; «lo veremos en una sesión más adelante».
- Compromiso de inversión, tesorería y datos contables: mencionados de pasada (audio ininteligible «compromiso de inversión subirá temas de terceros»), sin explicación.

Dudas/divagaciones: la historia de las ruedas y la reposición (43:00–46:00) es ejemplo oral largo; el audio de 48:00–48:29 está mal transcrito («como almacén compromiso de inversión subirá temas de terceros impresión de documento»).

### Bloque 7 · Acceso a Pedidos de compra (50:52–51:50)

Ruta de menú literal (escritorio `webOS/desktop/appinfo.jsp?dbms=learning`): **Compras › Pedidos › Registro** (al lado hay otro «Regis…», dos «e-Pro…» y carpetas «Impre…», «Situa…», «Segui…», «Work…», «Proce…»). Debajo: Albaranes, Facturas, Anticipos, Importaciones, Informes, **Maestros › Tarifas** y **Maestros › Documentos › Concursos…**. Se hace clic derecho en «Registro» para abrir en pestaña nueva (menú contextual de Chrome: «Abrir enlace en una pestaña nueva», «…ventana nueva», etc.).
Panel izquierdo: caja «Go!», casilla «Utilizar una única ventana», «Últimas ejecuciones» (REGISTRO DE IMPUESTOS, FACTURAS DE VENTAS, TERCEROS…).
Pantalla abierta (pedido existente 151201PC000002): título «Pedidos compras»; botones de pestañas «Líneas», «Workflow», «Documentos», «Docflow», «Selector de artículos por proveedor», «Anular Líneas». Estado «Bloqueado» (código 26000). Barra inferior: **Copiar, Validar, Anular, Enviar a Director General, >3000€ Autorizar, Bloquear, Enviar e-mail**.
Valores: proveedor `G00003` VEHICULOS A MOGOLLON S.A. (dirección AC, Gran Vía, Bilbao 48001), recepcionar en `G00001` ADMINISTRACION Y GESTION LA VIUDA ALEGRE (C/ Del Alicuécano nº 3, Málaga); divisa EUR 1,000000; Portes «Debidos»; Tipo efecto TF; Forma pago 090.

### Bloque 8 · Alta del pedido: cabecera (51:50–55:10)

Pasos: pulsa el icono de **nuevo** («goma» / «página en blanco», icono de hoja) de la barra de herramientas. Aparece un pedido en blanco con datos heredados del anterior en pantalla (unidad de negocio). El título de pestaña es «PEDIDOS DE COMPR…». Antes abre un popup «TIPOLOGÍA DE PEDIDOS DE COMPRAS» (g_029, popup vacío cargando) para ver el maestro del tipo.

Campos literales de **Unidad negocio**: *Tipo documento* `PC` «Pedido de Compra»; *Empresa* `01` ADMINISTRACION Y GESTION LA VIUDA ALEGRE; *Delegación* `D01` DELEGACIÓN V.A CENTRAL; *Departamento* `0` DEPARTAMENTO [0]; *Almacén* `D01` «Almacen DEL1 LA VIUDA».
Campos de **Pedido**: *Fecha pedido* 11-12-2015; *Inicio entrega*; *Fin entrega*; *Hora entrega*; *Estado* `E`; *Pedido* `151201PC-` (máscara año-mes + tipo; al guardar completa el número); *Origen*; *Referencia*; *Clasificación*; *Comprador*.
Pestañas: «Pedir a» / «Facturado por»; «Recepcionar en» / «Enviar a»; «Información general» / «Notas» / «Auxiliares»; **Datos financieros** (Presupuesto, Partida, Portes «Debidos», Tipo efecto, Forma pago, Divisa, Descuento general, Descuento pronto pago, % Retención, Anticipo, Importe neto); Datos de control; Líneas.

Reglas y explicaciones:
- Algunos datos se arrastran del pedido anterior; se pueden cambiar **tipo de pedido**, empresa (01; pregunta si definieron varias en el proyecto), delegación (central u otra), departamento y almacén.
- **Almacén** = dónde se recepciona la mercancía (concepto de almacén).
- *Inicio/Fin de entrega*: plazo que se da al proveedor; si el maestro de proveedores trae plazo de entrega, el sistema **corrige las fechas sumando días**.
- Al elegir el tipo de pedido se recupera la **serie vinculada**, con una máscara que contiene año, mes y empresa (de ahí `151201PC-`).
- *Referencia*: campo libre; en otros casos heredada del documento origen.
- *Origen*: si el pedido tuviera documento origen, no dejaría pasar el campo sin informarlo.
- *Clasificación*: valores definibles para todo documento; sirven informativamente (p. ej. «urgente», «normal») o con efecto en parametrización. **Regla de diseño**: si la distinción tiene impacto en otros conceptos, crear **otro tipo de documento**; si es solo informativa, usar clasificación.

Dudas: el ponente balbucea al principio («Es impedido que has intentado hacerlo de otro lado…»); transcripción 51:34–52:18 ininteligible.

### Bloque 9 · Proveedor, direcciones y entrega (55:10–58:00)

Popup **MAESTRO DE PROVEEDORES** (g_039, 56:00): columnas ID, Proveedor, Nombre, Identificación fiscal, Tipo proveedor; filas visibles: 1 `G00003` VEHICULOS A MOGOLLON S.A. 73203316C EMP; 2 `P00001` SEAT 18014275P PRO; 3 `P00003` PLASTICOS BARATOS; 4 `P00004` DETERGENTES SOLIDOS; 5 `P00005` THE WHITE MOUSE; 6 `P00006` RECFRA; 7 `P00007` WAGGEN; 8 `P00008` ANDRES ARQUITECTO; 9 `P00009` ANTONIO GONZALEZ; 10 `P00010` JOAQUIN RUIZ; 11 `P00011` SAT; 12 `P00012` REFRIGERADOR; 13 `P00013` Notarios Sarrià. Total 13.
Popup **DIRECCIONES DE TERCEROS** (g_042–g_045): una sola fila: Tercero `P00001` SEAT, Tipo dirección `0`, País Spain, Dirección «Gran Via», CP 08008, Población Barcelona, Provincia Barcelona.
Pedido guardado (g_047, ~58:40): `151201PC000003`, Proveedor `P00001` SEAT, dirección `0`, Gran Via, Barcelona 08008; Estado «Bloqueado» 26000; Forma pago 045; Tipo efecto TF; estado de pantalla «Loading».

Reglas:
- Al elegir el proveedor se recupera el **tercero** y su **dirección 0** (la fiscal); si hay más de una, se selecciona en el campo *Dirección*.
- Un **proveedor puede tener N direcciones/delegaciones** (ejemplo SEAT: un solo NIF, una central fiscal donde se mandan las facturas = dirección 0, pero los coches vienen de la sucursal X o Y; se pide a la más cercana o con la que hay pacto, y si no tiene stock se pide a la otra).
- Distinguir **dirección de facturación** (fiscal) de **dirección de pedido/entrega**, y **dirección de recepción** (a veces distinta del almacén logístico); esa información se envía al proveedor en el pedido.
- Al guardar se genera el **número de pedido** y pasa a estado de alta; luego «lo del estado» (workflow).

Dudas: 56:41–57:26 hay frases cortadas; «Casuísticas 1000» (57:08) es un fragmento sin sentido (¿«Tengo abiertas las …»?).

### Bloque 10–12 · Líneas del pedido (58:00–1:02:10)

Pantalla «Líneas de pedido» (URL `formauto_s.jsp?code=gcompedl…`), ruta: botón **Líneas** de la cabecera del pedido (pestañas «Líneas», «Workflow», «Documentos», «Docflow», «Selector de artículos por proveedor», «Anular Líneas»; sub-botones «Workflow», «Desglose tarifa», «Reservas», «Anulaciones», «Documentos»). En la parte superior se repite la cabecera del pedido en solo lectura (iconos).
Campos de la línea (literal): *Orden*, *Inicio entrega*, *Fin entrega*, *Artículo*, *Descripción*, *Cantidad pedida*, *Precio*, *% línea*, *Importe neto*, *Cantidad servida*, *Cantidad facturada*, *Modificar*, *Estado*, *Bloqueo*, *Wf*; cajas «Descripciones auxiliares» (Referencia proveedor, Descripción proveedor, «UNIDAD»); rejilla «Líneas» y «Stocks» (columnas Almacén, Cuenta, Depósito, Artículo, VL, Unidad, Descripción, Stock actual, Adjudicado, Entradas propuestas, Salidas propuestas, Stock disponible). Botones inferiores «Marcar como servida» y «Bloquear». Las fechas de entrega se **cogen de la cabecera** por defecto.

Pasos y valores:
1. Nueva línea: *Orden* 1 (g_050), fechas 11-12-2015.
2. *Artículo* `COCHE A6` (el desplegable muestra todos los artículos: «como no hemos creado surtidos… me salen todos»), *Cantidad pedida* 3 (g_052, 60:20).
3. Al grabar (~61:00): *Precio* 2.000,000000 desde la **tarifa del proveedor SEAT** («los 2.000 que tenía puesto»), *Importe neto* 6.000,00, *Estado* «Validada» (punto verde), *Modificar* «Sí» (g_054/g_055).
4. Segunda línea: *Orden* 3, *Artículo* `COCHE A4`, cantidad 4,00, **precio 0,000000** (no está en la tarifa), Importe neto 0,00, Validada (g_057, 61:40).
5. Después el precio queda a 1.000,000000 e *Importe neto* 4.000,00 (g_058, 62:00): se ha tecleado a mano; grid inferior con 2 líneas: orden 3 (A4) y 1 (A6).

Reglas y conceptos:
- **Numeración de líneas**: el ponente dice que se numeran «de dos en dos» (2, 4, 6) para poder insertar una línea entre medias; **en pantalla aparecen 1 y 3** (de dos en dos desde 1). Es un **ordinal**, no el número de líneas; programando se puede cambiar.
- **Precio por tarifa**: si el artículo está en la tarifa del proveedor, el precio se rellena automáticamente al dar de alta la línea; si no hay tarifa, queda a **0** y se puede teclear.
- **Decimales** parametrizables: por defecto 5–6 (los de base de datos) si no se limita; el descuento tiene los suyos; a nivel de precio unitario puede haber más decimales (precios muy pequeños) mientras que el importe sale a 2 («creo que se puede controlar»).
- La **cantidad** pedida es 3 → «Me crea la 3…»; se puede tocar la línea.

Dudas: **tramo con texto repetido/inventado 1:00:55–1:02:09** («Si yo ahora doy de alta, aún no lo registro… A partir del valor anterior, del 1…», «Si le pongo el…»). Solo son fiables las frases sueltas «tiro el 4 … se va a quedar con el precio 0» y «Pero después puedes bloquear cada una de las casillas». Todo lo demás de esos 70 s hay que reconstruirlo con las imágenes (g_054–g_058).

### Bloque 13 · Ocultar o bloquear campos (1:02:09–1:03:02)

Imagen g_059 (62:20): tipología de pedido con la pestaña **Campos a ocultar** de «Datos generales» activa, con casillas literales: *Fechas entrega*, *Orden*, *Status*, *Variable logística*, *Referencia proveedor*, *Descripción proveedor*, *Cantidad adjudicada*, *Cantidad extraída*, *Cantidad facturada*, *Cantidad base*, *Indicador regalo*, *Receptor*, *Unidad alternativa*, *Unidad recepciones*, *Unidad precios*, *Stock*, *Unidad compras*, *Lote*, *Código barras*, *Tab expedientes*, *Tab planificación de entregas*. Casillas desmarcadas en la captura: *Fechas entrega*, *Orden*, *Status*, *Cantidad facturada*, *Stock*; marcadas el resto.
Reglas: (a) por **tipo de pedido** se puede **ocultar** un dato en las líneas; (b) para que un usuario pueda **modificarlo** y otro no, es **configuración de usuario**, no tipo de pedido: «a nivel del usuario puedes definir un perfil que cuando accede a Compras tenga unas cosas u otras».

### Bloque 14 · Usuarios y perfiles (1:03:02–1:04:30)

Ruta literal: escritorio › **Maestros › Parametrización › Configuración** (carpeta «Errores» y «Configuración») → abre pantalla **«Usuarios»** (jrep `code=cuserids`). En el árbol de Maestros: Terceros, Artículos, Contabilización, **Parametrización** (Errores, Configuración), **Auxiliares** (Circuitos, Incoterms, Agrupaciones, Tipos créditos…).
Pantalla «Usuarios» (g_065/g_066): *Usuario* `<usuario>` «Carles Beya (O&S)», *Tipo* «Administrador», *Teléfono*, *E-Mail*, *Tercero*, *Dirección*. Sección **Área de finanzas**: *Grupo funcional de finanzas* `public` «Grupo público», *Grupo de empresas* `L01` «LEARNING 2015», *Grupo de proyectos*, *secciones*, *cuentas explotación*, *centros de coste*. Sección **Área de gestión**: *Grupo funcional de gestión* `public`, *Grupo de delegaciones*, *de departamentos*, *de almacenes*. Rejilla «Vista» con usuarios <usuario>, <usuario> (Diana Costa), <usuario> (David Laseras), <usuario> (Ismael Barreto), <usuario> (Jordi Clotet), <usuario> (Lucía García), <usuario> (Manolo Garfia), <usuario> (Maria Molto). (Nombres y e-mails de personas reales de O&S; **no mostrar** en un tutorial público: recortar la rejilla.)
Concepto: «existe una tabla donde defines perfiles de usuario; das de alta cada usuario y le defines un perfil». La explicación continúa fuera del tramo.

## 4. Planos aprovechables

Segundos absolutos del vídeo; recortes `x,y,w,h` sobre 1680x1048.

| # | Inicio–fin (s) | Recorte | Qué demuestra |
|---|---|---|---|
| P1 | 2580–2640 (43:00–44:00) | 0,184,1667,525 | Maestro «Tipología de pedidos de compras» con *Tipo pedido* PC, serie `PC-`, tipo workflow `PCW01` (plano estático de apoyo mientras suena la explicación) |
| P2 | 2640–2700 (44:00–45:00) | 160,495,330,110 (zoom) | Desplegable *Tipo*: Normal / Reposición / Programación / Muestras |
| P3 | 2880–2940 (48:00–49:00) | 0,473,840,105 | Pestaña Indicadores: *Validar catálogo* = No, *Compromiso inversión* = Sí |
| P4 | 2960–3020 (49:20–50:20) | 0,473,840,130 | Pestaña «Impresión de documentos»: *Impresión* Sí y *Objeto impresión* vacío |
| P5 | 3050–3100 (50:50–51:40) | 0,125,387,600 | Árbol del escritorio: **Compras › Pedidos › Registro** y clic derecho «Abrir enlace en pestaña nueva» |
| P6 | 3100–3140 (51:40–52:20) | 0,243,1667,545 | Pedido existente `151201PC000002` bloqueado con botones inferiores Copiar, Validar, Anular, Enviar a Director General, >3000€ Autorizar, Bloquear, Enviar e-mail |
| P7 | 3220–3340 (53:40–55:40) | 0,243,1667,545 | Alta de pedido nuevo: unidad de negocio, serie `151201PC-`, fechas, referencia, clasificación |
| P8 | 3340–3380 (55:40–56:20) | 177,171,1325,755 | Popup «Maestro de proveedores» con SEAT `P00001` |
| P9 | 3420–3460 (57:00–57:40) | 177,171,1325,755 | Popup «Direcciones de terceros» (SEAT, Gran Via, Barcelona) |
| P10 | 3500–3540 (58:20–59:00) | 0,243,1667,545 | Pedido grabado `151201PC000003` con estado «Bloqueado» (workflow) |
| P11 | 3560–3640 (59:20–60:40) | 0,210,1667,590 | Formulario de líneas: alta de línea con COCHE A6 (artículo, cantidad pedida) |
| P12 | 3640–3680 (60:40–61:20) | 0,210,1667,590 | Precio 2.000,000000 rellenado por tarifa y neto 6.000,00, estado «Validada» |
| P13 | 3690–3730 (61:30–62:10) | 0,210,1667,590 | Artículo sin tarifa: A4 a precio 0 y luego 1.000; rejilla con dos líneas (órdenes 3 y 1) |
| P14 | 3740–3770 (62:20–62:50) | 0,577,1667,132 | Pestaña «Campos a ocultar» con todas las casillas |
| P15 | 3830–3890 (63:50–64:50) | 0,184,1667,300 | Pantalla «Usuarios» (recortar para no mostrar la rejilla con nombres y e-mails) |

(Para P2, el desplegable se ve en frames g_001–g_012, hasta ~46:40.)

## 5. Optimización didáctica

**Qué sobra:** ejemplo de ruedas/reposición (43:00–46:00) con historia larga; ejemplo Bonpreu más corto; transcripción repetida 1:00:55–1:02:09; preguntas del público sobre decimales y numeración; tangente a perfiles de usuario y apertura de «Usuarios» (con datos personales); frases de relleno «¿Vale?».

**Qué falta:**
- La ruta de menú para llegar a la **tipología** (no se ve): Compras › Maestros › Documentos › Pedidos (a confirmar con v1).
- **Guardar** pedido y botón «Validar»: no se muestra; el estado «Bloqueado 26000» se explica solo de pasada («luego entramos en lo del estado»). Falta explicar por qué el pedido queda bloqueado (workflow departamental `PCW01`, regla >3000€) y cómo se desbloquea.
- Efecto de la **tarifa** vs precio a mano: se ve pero no se nombra la tarifa del proveedor (tabla/pantalla) ni se demuestra el botón «Desglose tarifa».
- Ejemplo real de **Validar catálogo = Sí** (nunca se prueba en pantalla).
- Qué hace cada tipo (Normal / Reposición / Programación / Muestras).
- Resultado de la impresión (botón impresora) y vínculo de «Objeto impresión».

**Mejor orden:** (1) tipos de documento y su tipología (Tipo, Validar catálogo, Impresión, Workflow) → (2) ruta a Pedidos › Registro → (3) cabecera (unidad de negocio, serie, fechas) → (4) proveedor y direcciones → (5) líneas con precio por tarifa → (6) precio a mano si no hay tarifa → (7) estado Bloqueado / workflow y botones. Dejar «Campos a ocultar» y perfiles de usuario como tema aparte («Configuración»).

**Con diagrama animado:** (a) reposición automática (stock mínimo → aviso o pedido → e-mail al proveedor → entrega en 3 h); (b) catálogo por delegación (maestro de artículos completo → filtro por delegación/tienda); (c) objeto de edición frente a objeto de impresión (un pedido, dos objetos: edición `gcompedd` / formato rosa y verde); (d) proveedor con N direcciones: fiscal 0 frente a entrega (SEAT sede y sucursales); (e) numeración de líneas 1, 3, 5 con hueco para insertar.

**Tips y cuidados:**
- Tip: «Serie con máscara año-mes-empresa»: `151201PC-`.
- Tip: usar *Clasificación* solo si es informativa; si afecta a otros datos, crear otro tipo de documento.
- Tip: los precios salen de la tarifa del proveedor; artículo sin tarifa → precio 0.
- Cuidado: un pedido con precio 0 se valida igual (aparece «Validada» con neto 0,00); revisar el precio antes de enviar.
- Cuidado: al crear pedidos con proveedor con varias direcciones, no confundir la dirección fiscal (0) con la de entrega.
- Cuidado: el pedido queda «Bloqueado» por el workflow; no es un error.
- Cuidado: ocultar campos por tipo de pedido afecta a todos los usuarios; los permisos por usuario se hacen en «Usuarios».

## 6. Glosario
- **Tipología de pedidos de compras** (`gcompedd`): maestro del tipo de pedido (código, serie, valoración, workflow, impresión).
- **Pedidos compras** (`gcompedh`) y **Líneas de pedido** (`gcompedl`): cabecera y detalle del pedido.
- **Tipo pedido PC** / serie `PC-`: pedido de compra estándar; número `AAMMPCnnnnnn`, p. ej. `151201PC000003`.
- **Tipo** (Normal, Reposición, Programación, Muestras).
- **Validar catálogo**: limita los artículos al catálogo de la delegación/almacén.
- **Compromiso inversión**: indicador del tipo (no explicado).
- **Objeto impresión**: objeto de formato de papel asociado al tipo.
- **Workflow Departamental `PCW01`**: flujo de validación del pedido; origina estado Bloqueado 26000.
- **Docflow**: seguimiento de documentos relacionados (cabecera y líneas, botón y caja).
- **Unidad de negocio**: Empresa 01, Delegación D01 DELEGACIÓN V.A CENTRAL, Departamento 0, Almacén D01.
- **Pedir a / Facturado por / Recepcionar en / Enviar a**: partes del pedido (proveedor, quien factura, quien recibe, dónde se envía).
- **Dirección 0**: dirección fiscal por defecto del tercero.
- **Clasificación**: etiqueta libre del documento (informativa).
- **Origen**: documento del que viene el pedido; obliga a informarlo si el tipo lo exige.
- **Selector de artículos por proveedor**: botón que ofrece los artículos de un proveedor.
- **Desglose tarifa**: botón de la línea que muestra el cálculo del precio por tarifa.
- **Estado de línea Validada** (punto verde) y **Estado de pedido Bloqueado** (punto rojo, código 26000).
- **Marcar como servida**: cierra la línea sin más recepciones.
- **Surtido / catálogo**: lista de artículos permitidos por delegación.
- **Campos a ocultar**: casillas del tipo de pedido que esconden campos en las líneas.
- **Grupo funcional de gestión (`public`)**: grupo de permisos de gestión del usuario.

## Tramos de transcripción dudosos
- 43:07–43:42: bien. 47:43–48:29: palabras sueltas incorrectas («como almacén compromiso de inversión subirá temas de terceros»).
- 51:34–52:18: ruido.
- 56:41–57:26 y 57:08 «Casuísticas 1000»: no fiable.
- 1:00:45–1:02:09: **texto repetido/inventado por Whisper**; valores 3, 4, precio 0, A6 2.000 y «bloquear cada una de las casillas» sí aparecen y están confirmados por los fotogramas.
- 1:01:00 y 1:01:30: la afirmación «solo tiene dos decimales» no se puede confirmar.
- «gden gcom petache» = `gcompedd`/`gcompedh`; «un tal» (44:58) y «A6» ok; «Bonpreu IPERS» = hipermercados (IPER).
