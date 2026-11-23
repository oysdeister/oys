# Índice de capturas HD: ERP Axional nuevo (nextdemo.geasa.eu, BBDD TUTORIAL)

Todas las capturas son de 3840x2160 (1920x1080 @2x), con tema oscuro y en solo lectura: no se ha guardado, generado ni validado nada.
URL base: `https://nextdemo.geasa.eu/view/app/tutorial/dispatch/<objeto>`.
El menú lateral está abierto en 01, 02, 06 y 17 para enseñar la ruta. En el resto está cerrado.
Zoom: es el campo que merece el acercamiento de cámara, con su posición aproximada en % (x, y) de la imagen.

| Captura | Qué muestra | Ruta de menú / objeto | Zoom (x %, y %) |
|---|---|---|---|
| 01_numerador_rejilla | Rejilla de los 16 numeradores (Rotura, Numerador, Control cronológico). | Gestión › Maestros › Auxiliares › Numerador de documentos · `gsernumh` | Fila PC, columna Numerador `#e#s#6n` (45, 32). Menú «Numerador d…» (8, 45) |
| 02_numerador_PC_ficha | Ficha del numerador PC «PEDIDO DE COMPRA» con la caja de contadores, con el menú abierto. | Igual · `gsernumh` form/8 | Numerador `#e#s#6n` (14, 32). Rotura `#e#s` (57, 26) |
| 03_numerador_PC_contadores | La misma ficha sin menú: contadores 0PC (1) y DISPC (último número 8). | Igual · `gsernumh` form/8, caja «Línea (2)» | Fila DISPC, Último número 8 (51, 58). Control cronológico desmarcado (53, 32) |
| 04_series_fiscales_cdocnumh | Rejilla de series fiscales con la columna Control cronológico marcada solo en las series de venta. | Finanzas › Maestros › Auxiliares › Identificadores › Series de documentos · `cdocnumh` | Casillas rojas de Control cronológico, FVE…FVS (41, 34). Longitud número 6 (36, 16) |
| 05_serie_fiscal_FC_ficha | Ficha de la serie FC (Factura de compra) y serializador 026FC → FC026-000001. | Igual · `cdocnumh` form/1 | Rotura `#e#yy#d` (75, 20). Máscara `#d#e#yy-#n` (5, 26). Último documento FC026-000001 (46, 43) |
| 06_tipos_pedido_rejilla | Rejilla de tipos de pedido (PC, PCCL, PCOF, PCSO, PREP; todos con serie PC), con el menú abierto. | Gestión › Compras › Maestros › Documentos › Pedidos · `gcompedd` | Menú «Pedidos» (9, 58). Columna Serie PC (34, 18) |
| 07_tipo_pedido_PC_identificacion | Ficha PC: Identificación (Serie PC, Tipo Normal, Activo) y Documento origen (copiar líneas, actualización). | Igual · `gcompedd` form/1 | Serie PC (51, 20). Copiar línea origen (20, 59) |
| 08_tipo_pedido_PC_valoracion | Caja Valoración: Fecha valoración = Documento, Valorar activado, IVA incluido desactivado. | Igual · pestaña Valoración | Interruptor Valorar (40, 25). Fecha valoración (20, 19) |
| 09_tipo_pedido_PC_indicativos | Indicativos: Validar catálogo, Acuerdos, Insertar Catálogo, Insertar Tarifa (desactivado). | Igual · pestaña Indicativos | Insertar Tarifa (66, 33) |
| 10_tipo_pedido_PC_campos_ocultar | Campos a ocultar en las líneas (casi todos marcados) y Docflow PC → gcommovd → ACPC/AOCL. | Igual · pestaña Campos a ocultar | Precio con IVA y % Dto. (62, 26). Docflow (49, 63) |
| 11_tipo_pedido_PC_docflow | Caja Docflow (grafo PC → gcommovd → ACPC, AOCL), Validaciones workflow y Circuito workflow vacíos. | Igual · caja Docflow | Grafo (49, 28) |
| 12_tipos_albaran_rejilla | Rejilla de tipos de albarán (todos con serie AC), cuenta origen/destino NSAL → DISP. | Gestión › Compras › Maestros › Documentos › Albaranes · `gcommovd` | Fila ACPC (12, 22). Columna Serie AC (33, 22) |
| 13_tipo_albaran_ACPC_ficha | Ficha ACPC: Serie AC, Albarán, Entrada; Tabla origen = Pedidos, condición `gcompedh.estcab IN ("V","P")`, Copiar líneas = Sí. | Igual · `gcommovd` form/3 | Tabla origen Pedidos (20, 39). Condición selección (52, 38). Copiar líneas Sí (20, 61) |
| 14_tipos_factura_rejilla | Rejilla de tipos de factura (ANT, FC, FCA, FCCL, FCOA, FIVA, RECT) con serie, origen y tipo de asiento. | Gestión › Compras › Maestros › Documentos › Tipos de facturas · `gcomfacd` | Fila FCOA (15, 25). Tabla origen Suministros (32, 25) |
| 15_tipo_factura_FCOA_control_diferencias | FCOA, Valoración: Abono, **% tolerancia**, **Importe tolerancia** (vacíos), Valorar, **Diferencia factura**. | Igual · `gcomfacd` form/5, pestaña Valoración | % tolerancia (20, 26). Importe tolerancia (40, 26). Diferencia factura (62, 33) |
| 16_tipo_factura_FCOA_grupo_validacion | FCOA, Datos generales: **Grupo validación = FC** y Docflow (10 tipos de albarán → gcommovd → FCOA → gcomfacd). | Igual · pestaña Datos generales | Grupo validación FC (20, 43). Docflow (49, 70) |
| 17_listas_precios_rejilla | Rejilla de listas de precios (COM, TFCL), con el menú abierto. | Gestión › Compras › Maestros › Tarifas › Precios › Listas de precios · `gcom_pricelist` | Menú «Listas…» (10, 50). Fila COM (20, 16) |
| 18_lista_precios_COM_cabecera | Cabecera COM (Agrupación ALL, Divisa EUR, sin fechas en cabecera) y principio de las líneas. | Igual · `gcom_pricelist` form/1 | Divisa EUR (70, 26). Columna Fecha inicio de las líneas (26, 47) |
| 19_lista_precios_COM_lineas | Líneas de la lista COM con todas las columnas: Fecha inicio/fin, Artículo, VL, Unidad, Cantidad mínima, Precio, Precio con IVA, Dto. 1-3, Dto. importe, Tipo. | Igual · caja «Líneas de lista de precios» (formulario ensanchado para que quepan todas las columnas) | Fecha inicio/fin (10, 45). Cantidad mínima (47, 43). Precio (54, 45). Descuento 1 (66, 43) |
| 20_linea_precio_detalle | Panel lateral de la línea 1 (00000016): Fecha inicio 01-01-2000, Fecha fin 31-12-3000, Unidad, Estado, Precio 5,00, Descuentos. | Igual · clic en el nº de línea → `gcom_pricelist_line` | Fecha inicio (68, 21). Fecha fin (68, 52). Precio (68, 64) |
| 21_grupos_precios_rejilla | Rejilla de grupos de precios (00001, 00003, GCL, GROUP_GEN). | Tarifas › Precios › Grupo de precios · `gcom_pricegroup` | Fila 00001 PROVEEDOR (11, 16) |
| 22_grupo_precios_00001_listas | Grupo 00001: línea Orden 400 · Condición vacía · EUR · Lista COM. | Igual · `gcom_pricegroup` form/1 | Fila Orden 400 → Lista COM (50, 37) |
| 23_proveedor_00001_tarifas | Proveedor 00001, caja Tarifas: **Grupo precio = PROVEEDOR (00001)**, Grupo descuento, Rápeles. | Maestro de proveedores · `gproveed` form/1, pestaña Tarifas | Grupo precio (80, 67) |
| 24_delegacion_condiciones_comerciales | Delegación DIS001: Condiciones comerciales (Tarifa precios TV, Grupo de Tarifa) y Catálogo de precios. | Maestro de delegaciones · `gdelegac` form/2 | Tarifa precios TV (12, 69). Grupo de Tarifa (37, 75) |
| 25_condiciones_tarifa_error | Error «Table 'gcomtarh' does not exists in (logical) database 'primary:tutorial'» (ID 19401). Escena «antes vs ahora». | `dispatch/gcomtarh` (tarifa clásica, a la que enlazan gcomtarc y la columna Precios del proveedor) | Mensaje de error (50, 51) |
| 26_pedidos_rejilla | Rejilla de pedidos: DISPC000001…000008 y 0PC000001. **DISPC000007** está en la fila 7, Validado y Servido. | Gestión › Compras › Pedidos › Pedidos · `gcompedh` | Fila DISPC000007 (45, 30). Situación Servido (91, 30) |
| 27_pedido_DISPC000007_ficha | Ficha (formulario genérico) del pedido DISPC000007: PC, DIS, proveedor 00001, Validado, Servido, 349,14. ⚠ La miga muestra «Failed to parse the expression…», un defecto del diccionario de la demo; conviene taparlo o desenfocarlo. | Igual · `gcompedh` form/7 | Pedido DISPC000007 (60, 26). Estado Validado / Situación Servido (13, 42). Importe bruto 349,14 (24, 93) |
| 28_pedido_DISPC000007_lineas | Las 5 líneas del pedido, filtradas por Identificador pedido = 8 (chip de filtro visible). | Líneas de pedidos de compras · `gcompedl` (QBE: Identificador pedido 8) | Chip de filtro (24, 8). Cantidad pedida y Precio (50, 20) |
| 28b_pedido_DISPC000007_lineas_cantidades | Extra: la misma rejilla desplazada a la derecha, con Cantidad adjudicada, extraída, **servida** y **facturada**, anulada y validaciones. | Igual | Cantidad servida (61, 20). Cantidad facturada (64, 20) |
| 29_generar_albaranes_desde_pedidos | Pantalla de filtro del proceso: variable obligatoria Tipo documento y columnas Pedido, Fecha, Almacén, Proveedor… (sin ejecutar ni generar). | Gestión › Compras › Albaranes › Procesos › Generación de albaranes desde pedidos · `gcompedh_gen_gcomalbh` | Tipo documento* (35, 25) |
| 30_albaranes_rejilla | Rejilla de albaranes, con la barra de estado y los tipos ACPC «ORIGEN PEDIDO» frente a AC. | Gestión › Compras › Albaranes › Albaranes · `gcomalbh` | Fila DISAC000011 (10, 23). Tipo ALBARAN COMPRA ORIGEN PEDIDO (22, 23) |
| 31_albaran_DISAC000011_ficha | Ficha DISAC000011 [00001]: ACPC, DIS, Almacén Central, **Estado documento Facturado**, Validado, importe 349,14. Botones Acciones y Contabilizar. | Igual · `gcomalbh` form/4 | Estado documento Facturado (78, 38). Tipo documento ACPC (10, 25). Importe 349,14 (95, 94) |
| 32_albaran_DISAC000011_lineas | Pestaña Líneas (5): artículo, cantidad, precio e importe neto, igual que en el pedido. | Igual · pestaña Líneas | Columna Importe neto (55, 35) |
| 33_albaran_menu_acciones | Menú **Acciones** abierto con **«Generar factura»**, Actualizar datos económicos y Copiar (sin pulsar). Es el albarán **DISAC000010**, pendiente de facturar: en DISAC000011, ya facturado, la opción no aparece. También se ven los botones Pasar a provisional, Contabilizar, No facturable y Anular. | `gcomalbh` form/5 (DISAC000010) | «Generar factura» (58, 11). Estado documento Pendiente (77, 38) |
| 34_docflow_pedido_albaran_factura | Docflow desde el albarán: Pedidos compras (1) → Suministros (1) → Facturas compras (1), con las tarjetas DISPC000007 Servido → DISAC000011 Facturado → DISFC000005 Validado. | Ficha DISAC000011 › menú ⌄ junto a la estrella › Docflow (`gdocflowh`) | Tarjetas de los 3 documentos (50, 66). Contadores (50, 30) |
| 34a_albaran_menu_documentos_relacionados | Extra: menú ⌄ del albarán abierto (Docflow, Suministros, Pedidos compras, Facturas compras). | Ficha DISAC000011 › ⌄ | Menú (27, 14) |
| 35_facturas_rejilla | Rejilla de facturas (DISFC000001…000006, MAL-260908, 0FC…), barra de color por estado. | Gestión › Compras › Facturas › Facturas · `gcomfach` | Fila DISFC000005 (10, 25). Factura proveedor «FACTURA PROVEEDOR 4» (52, 25) |
| 36_factura_DISFC000005_ficha | Ficha DISFC000005 [00001]: FCOA, Validado, Situación Entrada, Factura proveedor 4, CIF, base imponible 349,14 y total 422,46. | Igual · `gcomfach` form/5 | Estado / Situación (80, 38). Base imponible / Importe total (88, 94) |
| 37_factura_DISFC000005_lineas | Pestaña Líneas (5) con la Cantidad facturada. | Igual · pestaña Líneas | Columna Cantidad facturada (42, 35) |
| 38_factura_menu_acciones | Menú Acciones de una factura validada (solo «Copiar») y botones Pasar a provisional y Contabilizar. | Ficha DISFC000005 › Acciones | «Copiar» (66, 11). Botones Pasar a provisional y Contabilizar (80, 8) |
| 39_workflow_pedidos | Gestión de workflow de pedidos, ya ejecutada: franjas «FORMULARIOS CON AUTORIZACIONES PENDIENTES» (azul) y «PEDIDOS CON ACCIONES REALIZADAS» (verde). Vacía en la demo. | Gestión › Compras › Pedidos › Work Flow › Gestionar · `gcompedh_vtabsel_workflow` | Franja azul (50, 14). Columna Atraso (días) (86, 26). Franja verde (50, 49) |
| 39a_workflow_pedidos_filtro | Extra: el formulario de filtro de la misma pantalla. | Igual (QBE) | Filtros (50, 35) |
| 40_diferencias_albaran_factura | Pantalla de filtro del informe de diferencias en cantidades o importes, con su texto explicativo, Fecha factura* y Proveedor*, y los grupos. | Gestión › Compras › Facturas › Situación › Diferencias entre albaranes y facturas · `gcomfach_dif_albaran` | Texto explicativo (50, 17). Fecha factura* / Proveedor* (42, 44) |
| 41_datos_control_sidebar | Barra lateral derecha de DISAC000011: Datos de Albarán, Proveedor y **Datos de control** (Identificador 23, Fecha validación 10-06-2025 09:59:36, Creado y Modificado por <usuario>). | Ficha DISAC000011 › icono de lista de la barra derecha | Bloque Datos de control (91, 62) |

## Lo que no se ha podido sacar o se ha sacado de otra forma
- **29**: solo está el filtro. El desplegable obligatorio «Tipo documento» no se abre con la automatización, así que no se han podido ejecutar los paneles de resultado. Aun así, no se habría pulsado «Generar albaranes».
- **33**: está hecha con DISAC000010 y no con DISAC000011, porque «Generar factura» solo aparece en albaranes pendientes de facturar.
- **25**: sale de abrir directamente `gcomtarh` (error ID 19401), no del desplegable de `gcomtarc`. El mensaje es el mismo problema: la tabla de tarifas clásica no existe.
- **27**: la miga del pedido tiene el defecto de diccionario «Failed to parse the expression [${Pedidos compras}]».
- **19**: para que se vean todas las columnas, se ensanchó el contenedor del formulario de 1200 a 1820 px. Es un cambio visual en el navegador; no toca datos.
- Ayudas añadidas en `nueva/tools/`: `kb.mjs` (teclado y JS sin cambiar el tamaño de la vista), `menushot.mjs` (abre un menú y lo captura) y `kb_pick.mjs` (no ha funcionado con los desplegables de la QBE).

## Circuito creado paso a paso (14-11-2026, datos creados en la base `tutorial`)

Capturas 3840x2160 (1920x1080 @2x), tema oscuro. Rect = (x, y, ancho, alto) en píxeles de la imagen 3840x2160, aproximado, para colocar callouts. Herramienta: `nueva/tools/erp2.mjs` (eventos reales de ratón y teclado).
**Resumen de lo que se ha podido hacer** (detalle en `nueva/circuito_creado.md`): la ficha de pedidos de la demo es genérica y no deja crear líneas, y el proceso «Generar albaranes» no devuelve pedidos. Por eso el circuito completo se ha hecho con albarán → factura → contabilización en la empresa 0. El orden del vídeo sería: 50–65 tarifa y pedido (con sus bloqueos), 66–67 y 89 proceso de generación, 68–88 y 90–96c primer albarán y factura (0AC000004 → 0FC000003, con errores de contabilización), y 97a–99b circuito completo con contabilización (0AC000005 → 0FC000004).

| Captura | Paso | Qué se rellena o pulsa | Rect callout (x,y,w,h) | Resultado |
|---|---|---|---|---|
| 50_tarifa_COM_lineas_articulos | Evidencia de tarifa | Lista de precios COM (`gcom_pricelist` form/1), rejilla de líneas | Línea 1 (00000016) 778,1044,2280,52 · Precio 2280,1044,160,52 · Línea 17 (BPF-40) 778,1876,2280,52 | 00000016 a 5,000000 y 32515225 BPF-40 a 6,250000, vigentes de 01-01-2000 a 31-12-3000 |
| 51_tarifa_COM_linea_00000016_precio | Detalle de la línea | Clic en el nº 1 de la línea → panel `gcom_pricelist_line` | Artículo 1588,538,2106,80 · Precio 1588,1332,2106,80 | Precio 5,000000, estado Activo |
| 52_tarifa_COM_linea_32515225_precio | Detalle de la línea | Clic en el nº 17 | Artículo 1588,538,2106,80 · Precio 1588,1332,2106,80 | Precio 6,250000 |
| 53_proveedor_00001_grupo_precio | Asignación al proveedor | Proveedor 00001 (`gproveed` form/1), caja Tarifas | Grupo precio 2492,1400,1206,88 | Grupo precio = PROVEEDOR (00001) → lista COM |
| 54_pedidos_rejilla_boton_nuevo | Alta del pedido | Rejilla `gcompedh`, botón Nuevo | Nuevo 3454,146,116,44 | Se abre el diálogo de alta |
| 55_pedido_nuevo_ficha_vacia | Ficha nueva | Diálogo «PEDIDOS DE COMPRAS» vacío (formulario genérico, sin pestañas) | Diálogo 1212,108,1414,1944 | Muchos campos obligatorios (*) y ningún valor por defecto |
| 56_pedido_tipo_documento_desplegable | Tipo de pedido | Tipo documento: se escribe «PC» y se abre la tabla | Campo 1584,374,322,88 · Fila PC 1590,542,796,48 | PC PEDIDO COMPRA, serie PC |
| 57_pedido_proveedor_00001_desplegable | Proveedor | Proveedor: «00001» | Campo 2260,506,322,88 · Desplegable 2262,598,624,98 | El desplegable muestra la columna **Precios = COM** |
| 58_pedido_cabecera_rellena_arriba | Cabecera rellena (1) | PC, DIS, DIS CENTRAL, Departamento Distribuidora, 14-11-2026, Pedido «0», 00001, dir. 0, EUR, cambio 1, Provisional, EF, forma de pago 0, receptor 00003, facturador 00001, Ref. «PEDIDO TUTORIAL», entregas 14-11-2026 | Pedido 1922,506,322,88 | Hay que teclear a mano todo lo que DISPC000007 tiene relleno |
| 59_pedido_cabecera_rellena_abajo | Cabecera rellena (2) | Importes 0, ESCO/ESCO, descuentos 0, Portes Debidos, Almacén 0000, WMS No, Modificar Sí; botón Guardar | Guardar 2368,1976,226,44 | Se pulsa Guardar → «Éxito» |
| 60_pedido_guardado_rejilla_numero_0 | Cabecera guardada | Rejilla tras guardar | Fila id 11 102,780,3700,52 · Pedido 1634,780,154,52 | **Pedido = «0»: el numerador DISPC###### no se aplica** desde el formulario genérico |
| 61_pedido_lineas_sin_boton_nuevo | Alta de líneas | `gcompedl` filtrado por el pedido 11 | Barra 3400,146,420,44 | «Sin datos» y **sin botón Nuevo**: no se pueden crear líneas de pedido |
| 62_pedido_guardado_ficha_sin_lineas | Ficha del pedido | `gcompedh` form/10 | Pedido 1882,510,900,88 | Sin líneas, sin Validar y con el error de miga `${Pedidos compras}`. El pedido se borró después (era nuestro) |
| 63_pedido_alternativo_DISPC000001_validado_pendiente | Pedido alternativo | DISPC000001 (pedido existente, validado y pendiente) | Pedido 1882,510,900,88 · Estado 48,774,900,88 · Situación 48,906,900,88 | Validado / Pendiente, 25,00 |
| 64_pedido_DISPC000001_linea_precio_tarifa | Línea con precio de tarifa | Ficha de la línea `gcompedl` | Precio 52,1454,862,82 · Cant. servida 968,1854,898,66 | 5 × 00000016 a 5,00 = 25,00 (el precio de COM); servida 0 |
| 65_pedido_DISPC000001_linea_pestana_tarifa | Pestaña Tarifa | Pestaña «Tarifa» de la línea | Precio tarifa 52,1454,862,82 | Precio tarifa 5,000000, descuento 0 |
| 66_gen_albaran_filtro_tipo_PC_pedido | Generar albarán | `gcompedh_gen_gcomalbh`: Tipo documento PC + Pedido DISPC000001; Ejecutar consulta | Tipo 1108,480,520,108 · Pedido 1108,764,480,108 · Ejecutar 2400,286,274,44 | Pasa a los 3 paneles |
| 67_gen_albaran_resultado_sin_pedidos | Resultado del proceso | Paneles Pedidos / Línea / Albaranes (filtro Todos) | Panel pedidos 28,270,3780,260 · Generar albaranes 3296,148,272,40 | **Sin datos** con cualquier tipo de pedido: no se puede pulsar «Generar albaranes» con nada seleccionado |
| 89_diagnostico_gen_albaran_condicion_comalb | Diagnóstico | ⋮ del panel › Información › Query | Líneas 67-69 del SQL 1700,1980,768,132 | La consulta exige `gcompedd.comalb IS NOT NULL`, y el campo está vacío en los 5 tipos de pedido |
| 68_albaranes_rejilla_boton_nuevo | Alta de albarán | Rejilla `gcomalbh`, Nuevo | Nuevo 3454,146,116,44 | Diálogo con valores por defecto del usuario (empresa 0, CENTRAL, COMPRAS) |
| 69_albaran_nuevo_tipo_ACPC_desplegable | Vía alternativa: ACPC | Tipo documento «ACPC» | Campo 80,374,720,88 · Fila ACPC 128,540,600,54 | ALBARAN COMPRA ORIGEN PEDIDO |
| 90_albaran_error_validacion_almacen | Error | Empresa DIS + Almacén 0000 | Almacén 1552,374,720,88 | «Error en la validación»: el almacén 0000 es de la empresa 0, así que DIS no tiene almacén → no se pueden hacer albaranes DIS |
| 91_albaran_ACPC_origen_sin_pedidos | Error | Empresa 0, ACPC, proveedor 00001; Origen | Origen 2388,644,426,88 | «Datos no disponibles»: no hay pedidos válidos que enlazar |
| 70_albaran_nuevo_cabecera_rellena | Albarán AC | Tipo AC, empresa 0, ALMACEN CENTRAL, CENTRAL, COMPRAS, proveedor 00001 (dirección, EF y Contado se rellenan solos), Ref. «ALBARAN TUTORIAL» | Proveedor 80,914,286,88 · Guardar 3534,1976,226,44 | Guardar → «Éxito» |
| 71_albaran_guardado_0AC000004_numerador | Número asignado | Rejilla de albaranes | Fila 20,312,3800,52 · Nº 300,312,140,52 | **0AC000004**, que sí sale del numerador |
| 72_albaran_0AC000004_ficha_provisional | Ficha | Ficha del albarán | Albarán 1912,794,414,60 · Validar 3190,146,126,44 | Provisional, importe 0 |
| 73_albaran_lineas_vacias_boton_nuevo | Líneas | Pestaña Líneas, Nuevo | Nuevo 3404,488,116,44 | Abre «LÍNEAS DE ALBARANES DE COMPRAS» |
| 74_albaran_linea1_articulo_desplegable | Línea 1 | Artículo «00000016» | Campo 626,418,1594,88 · Fila 674,560,366,54 | CORONA NB1.22.0310.200-2 TTN ISB |
| 75_albaran_linea1_cantidad_10_precio_vacio | Cantidad | VLP 0, Cantidad 10 | Cantidad 626,1084,632,88 · Precio 626,1486,596,88 | **El precio NO se rellena desde la tarifa** (ni Precio ni Precio tarifa) |
| 92_error_linea_precio_obligatorio | Error | Guardar la línea sin precio | Precio con IVA 628,768,592,68 · Importe dto. 1930,768,626,68 | «Hay errores en los datos del formulario»: Precio con IVA e Importe dto. obligatorios |
| 76_albaran_cabecera_tarifas_grupo_precio_00001 | Comprobación | Cabecera, caja Importe › Tarifas | Grupo precio 1910,1966,860,80 | Grupo precio 00001 heredado del proveedor (la tarifa está bien enlazada) |
| 77_albaran_linea1_rellena_precio_manual | Línea 1 (manual) | Precio 5 (el de la tarifa COM), Precio con IVA 6,05, Importe dto. 0 | Precio 626,1026,596,88 · Guardar 3000,1976,226,44 | Guardada: 10 × 5 = 50,00 (el servidor calcula el importe neto) |
| 78_albaran_linea2_rellena | Línea 2 | 32515225, VLP 0, cantidad 4, precio 6,25, con IVA 7,5625, dto. 0 | Artículo 626,418,1594,88 | Guardada: 25,00 |
| 79_albaran_dos_lineas_total_75 | Líneas | Rejilla con 2 líneas | Filas 28,618,3692,108 · Importe neto 1950,618,230,108 | 50,00 + 25,00 |
| 80_albaran_antes_validar_boton | Validar | Botón Validar (al lado sale «Anular»: cuidado, piden motivo) | Validar 3056,146,126,44 | — |
| 81_albaran_validado_total_75 | Albarán validado | — | Estado 3214,794,354,60 · Importe 3222,2000,474,60 · Contabilizar 3124,146,192,44 | Validado, importe 75,00; aparecen Acciones, No facturable, Anular, Pasar a provisional, Contabilizar |
| 82_albaran_contabilizar_dialogo_fecha | Contabilizar albarán | Diálogo: Fecha contabilización 14-11-2026 | Fecha 1460,974,920,88 · Aceptar 2252,1272,134,52 | — |
| 83_albaran_contabilizar_prevista_marcada | Vista previa | Casilla «Prevista de Asiento Contable» | Casilla 1460,1090,366,88 | — |
| 84_albaran_prevista_asiento_error_cuenta | Error | Aceptar con prevista | Mensaje 348,608,3142,120 | «gcomalbh [27]: tipast [AC] tipcta [L] relaci [M] tiprel [] tipcon [VEN] cuenta no definida» |
| 93_error_contabilizar_albaran_cuenta_no_definida | Error | Aceptar sin prevista | Diálogo de error 1118,910,1600,338 | Error ID 24709, el mismo texto. Causa: los artículos de tipo contable VEN no tienen cuenta |
| 85_albaran_acciones_generar_factura | Generar factura | Acciones ⋮ | «Generar factura» 2040,190,408,80 | — |
| 86_generar_factura_dialogo_relleno | Diálogo | Fecha 14-11-2026, Factura proveedor «FRA-TUTORIAL-01», Importe factura 90,75 | F. proveedor 1460,1032,920,88 · Importe 1460,1148,920,88 · Aceptar 2252,1330,134,52 | — |
| 87_albaran_estado_facturado | Resultado | Ficha del albarán | Estado documento 2838,794,344,60 | Estado documento **Facturado** |
| 88_facturas_rejilla_0FC000003 | Factura nueva | Rejilla `gcomfach` | Fila 20,312,3800,52 | **0FC000003** FCOA, FRA-TUTORIAL-01 |
| 94_factura_0FC000003_validada_base_75_total_90_75 | Ficha de la factura | — | Estado/Situación 2834,760,770,88 · Importes 2728,1966,970,88 | Sale ya **Validado** / Entrada, Importe factura 90,75 = Base 75,00 + IVA → Total 90,75 |
| 95_factura_lineas | Líneas | Pestaña Líneas | Filas 28,618,3692,108 | 10 × 5,00 = 50,00 y 4 × 6,25 = 25,00 |
| 95b_factura_impuestos_IVA_21 | IVA | Impuestos por documento | Fila ESG/CLBC aprox. 28,600,3692,60 | Base 75,00, 21 %, cuota 15,75, total 90,75 |
| 96_factura_acciones_sin_conformar | Conformar | Acciones ⋮ | «Copiar» 2408,190,400,80 | Solo «Copiar»: **no hay acción de conformar** |
| 96b_buscador_conformar_sin_resultados | Conformar | Buscador ⌘K «conforma» | 1320,300,1200,400 | «No se han encontrados resultados» |
| 97_factura_contabilizar_dialogo_prevista | Contabilizar factura 1 | Contabilizar: Fecha registro contable, Prevista marcada | Casilla 1460,1090,366,88 | — |
| 96c_factura_0FC000003_prevista_error_cuenta | Error | Prevista del asiento | Mensaje 348,608,3142,120 | «gcomfach [17]: tipast [FCOA] … tipcon [VEN] cuenta no definida»: la factura 1 queda validada y sin contabilizar |
| 97a_albaran2_0AC000005_linea_6000-2RS | Circuito 2 | Albarán AC 0AC000005 «ALBARAN TUTORIAL 2», línea 13500620 (6000-2RS, tipo contable PROD), 10 × 4,00 (precio COM, manual) | Fila 28,618,3692,54 | 40,00 |
| 97b_albaran2_validado_40 | Validado | Validar | Estado 3214,794,354,60 · Importe 3222,2000,474,60 | Validado, 40,00 |
| 97c_albaran2_prevista_asiento_60000_40090 | Prevista del asiento | Contabilizar + Prevista; se despliega la fila | Apuntes 430,1000,3020,288 | 60000 Compras D 40 / 40090 Compras pendiente de factura H 40 |
| 97d_albaran2_contabilizar_dialogo | Contabilizar | Diálogo sin prevista, Aceptar | Aceptar 2252,1272,134,52 | — |
| 97e_albaran2_asiento_16_contabilizado | Asiento | Se abre el asiento | Nº asiento 648,750,640,60 · Estado 1228,1590,308,60 | **Asiento 16** (id 53), diario DC, FINALIZADO / Contabilizado; el albarán pasa a mostrar «Descontabilizar» |
| 97f_albaran2_asiento_16_apuntes | Apuntes | `casientos` id 53 | Rejilla apuntes 30,1658,3688,274 | 2 apuntes, 40,00 / 40,00 |
| 98a_albaran2_contabilizado_acciones_generar_factura | Generar factura 2 | Acciones › Generar factura | 2302,190,400,80 | — |
| 98b_generar_factura2_dialogo | Diálogo | FRA-TUTORIAL-02, importe 48,40 | 1460,1032,920,88 · 1460,1148,920,88 | Albarán → Facturado |
| 98c_factura2_0FC000004_validada_40_48_40 | Factura 2 | Ficha 0FC000004 | Estado 2834,760,770,88 · Importes 2728,1966,970,88 | Validado, base 40,00, total 48,40 |
| 98d_factura2_prevista_asiento | Prevista | Contabilizar + Prevista, fila desplegada | Apuntes 430,1000,3020,590 · IVA 430,1222,3020,70 | 40000 H 48,40; **00000.00000 D 8,40 (IVA sin cuenta)**; 60000 D 40; 40090 D 40; 60000 H 40 |
| 98e_factura2_contabilizar_dialogo | Contabilizar | Sin prevista, Aceptar | Aceptar 2252,1272,134,52 | — |
| 98f_factura2_tras_contabilizar_popup | Resultado (aviso) | Ventana que se abre al contabilizar | Ventana 192,216,3456,1720 | ⚠ Muestra el asiento 16 del albarán y no el de la factura (defecto de la demo) |
| 98g_factura2_asiento_17_apuntes | Asiento de la factura | `casientos` id 55 | Rejilla apuntes 30,1658,3688,384 · IVA 30,1806,3688,52 | **Asiento 17**, serie 0FC, numerador 4, 88,40 / 88,40, 5 apuntes |
| 98h_factura2_contabilizada_boton_descontabilizar | Factura contabilizada | Ficha | Descontabilizar 2944,146,238,44 | Situación Contabilizada; botones Descontabilizar y Anular |
| 99a_factura2_menu_documentos_relacionados | Docflow | Menú ⌄ junto a la estrella | «Docflow» 866,190,394,60 | Docflow, Albaranes compras, Suministros, Asientos contables, Cartera de efectos… |
| 99b_docflow_albaran_factura | Docflow final | Docflow | Tarjetas 1162,1058,1514,754 | Suministros (1) 0AC000005 Facturado → Facturas compras (1) 0FC000004 Validado. **Sin pedido** (no se pudo enlazar) |

Workflow (89–95 del plan): ningún documento quedó bloqueado ni pendiente de autorizar (Validaciones 0 en albaranes y facturas), así que no hay captura de desbloqueo.
