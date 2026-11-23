# Análisis v2 «Tarifas y documentos de compra en el sistema» · TRAMO 2 (21:30–43:00 = 1290–2580 s)

Fuentes: `media/v2_tarifas/tramo2.txt` y fotogramas f_00130 (s1290) a f_00259 (s2580), cada 10 s. Vistos 38 fotogramas (f130, 132, 134, 136, 139, 142, 145, 146, 148, 152, 156, 160, 164, 178, 179, 182, 184, 185, 187, 188, 192, 195, 200, 206, 212, 219, 229, 233, 239, 249, 259…) más un barrido automático de diferencias entre los 130 fotogramas, que localiza todos los cambios de pantalla (ver sección 2). Los fotogramas miden 1280x798: para recortar sobre 1680x1048 multiplicar por 1,3125.

Contexto leído en pantalla: ERP Deister (Axional), entorno «O&S Learning (Test)» (`dbms=learning`, usuario `<usuario>`), Chrome en Windows 7, reloj del PC 12:09–12:30 del 11/12/2015 (el reloj de pantalla avanza a la par del vídeo: f130 = 12:09, f259 = 12:30). URL de la pantalla: `coreapps/wic_iges/formauto_s_lite.jsp?code=gcompedd&user=<usuario>&dbms=learning…`. Es decir, **la pantalla que se enseña en todo el tramo es «TIPOLOGÍA DE PEDIDOS DE COMPRAS» (tabla `gcompedd`), tipo de pedido «PC – Pedido de Compra»**; no se crea ningún documento. Pestañas del navegador visibles: Deister-1, Aplicaciones - Bases de…, O&S Learning (Test) (lea…), TIPOLOGÍA DE PEDIDOS (activa), MAESTRO DE PROVEED…, MAESTRO DE ARTÍCULO…, TARIFAS DE PRECIOS DE…, MAESTRO DE DELEGACI….

## 1. Resumen en 5 líneas
1. Tramo íntegro sobre la ficha «TIPOLOGÍA DE PEDIDOS DE COMPRAS» del tipo PC: primero la serie de numeración («SERIES DE JUSTIFICANTES», ventana modal) y luego los bloques de la ficha.
2. Explica con criterio práctico cómo numerar documentos: serie `PC-`, justificación de 6 dígitos, vigencia perpetua o anual con máscaras (año, mes, empresa), el límite de 20 posiciones del campo destino y el riesgo de repetir número tras un millón.
3. Recorre después la ficha por bloques: estado, documento origen (solicitud de compra), actualización de tabla origen, valoración (fecha, descuentos especiales/rappel), anticipos.
4. Introduce conceptos de negocio sin demostrarlos: rappel, anticipos, facturación interempresa (holding, pedido de venta simétrico) y tipos de pedido (Normal, Reposición, Programación, Muestras) con el ejemplo del stock mínimo de ruedas.
5. Vídeo estático: un solo cambio de pantalla real (cierre de la modal a 29:40); el resto son movimientos de ratón y desplegables, así que el audio manda y casi todo el valor visual está en 2–3 pantallas.

## 2. Tabla de bloques
Tiempos = transcripción (que va unos segundos por delante/detrás de la imagen); los cambios de pantalla se fechan por fotograma.

| # | Inicio–fin | Tema | Valor didáctico | Qué se ve |
|---|---|---|---|---|
| 1 | 21:30–22:45 | Serie de numeración: número único, no necesariamente correlativo; rango de vigencia (anual o perpetua) | Alto | Modal «SERIES DE JUSTIFICANTES» sobre la ficha tipo PC (f130–f145). Ratón sobre «Control cronológico» (f130–132), calendario desplegado en «Fecha inicio» (f134, abril 2015) |
| 2 | 22:45–25:13 | Máscaras de serie: año, año+mes, código de empresa; qué crea el sistema («Copy from mask…») | Alto | Misma modal, ventana movida/redimensionada a 24:10 (f146). Grid «Vista» con 9 series PC (f146–f164) y tooltips sobre «Copy from mask [yy#e] + serie [PC-]» (f152, f178) |
| 3 | 25:13–29:37 | Límite de 20 posiciones del campo del documento, justificación de 6, duplicados tras 999 999, sentido común al dimensionar, no meter información redundante en la serie | Alto (reglas y consejos) | Sin cambio de pantalla: la modal con campo «Justificación = 6» (f156–f178); ratón sobre «Serie PC-» (f160–f164), texto «PC» seleccionado (f178) |
| 4 | 29:37–30:03 | Serie activa/no activa y cierre de la modal; ficha vuelve a verse completa | Medio | Cambio a la ficha completa a s1780 (f179): ratón sobre «Estado» = Activo |
| 5 | 30:03–31:39 | Documento origen: tabla origen «Ninguna» o «Solicitud compras» y condición de selección | Alto | Bloque «Documento origen» (f182–f188): ratón sobre pestaña, «Tabla origen» = Ninguna (f184), «Solicitud compras» con «Condición selección» activa (f187–f188), vuelve a Ninguna (f192) |
| 6 | 31:15–32:02 | Actualizar tabla origen (suma/resta/ninguna): ejemplo pedido 3 recepcionados 3 pendientes 0 | Alto (concepto), demo mínima | Ratón sobre «Actualización tabla origen = NULL» (f192, s1910) |
| 7 | 32:02–32:48 | Valoración: fecha de valoración (fecha inicio, fecha fin, documento, no valorar) y «Valorar» | Alto | Desplegable «Fecha valoración» abierto (f195, s1940): Fecha inicio / Fecha fin / Documento / No valorar |
| 8 | 32:48–35:17 | Descuentos especiales y rappel (frente a descuentos por escalados de tarifa) | Medio (concepto, solo se señala la casilla) | Ratón sobre «Descuentos especiales» (f200–f206) |
| 9 | 35:17–36:00 | Anticipos: pago por adelantado vinculado al pedido; la factura de compra solo por el pendiente | Medio-alto | Ratón sobre «Anticipos = No» (f212, s2110) |
| 10 | 36:00–39:26 | Facturación interempresa: holding, pedido de compra intercompañía enlazado a su pedido de venta simétrico | Medio-alto (diagrama ideal) | Ratón/foco en «Pedido venta» del bloque «Facturación interempresa» (f219, f229, f233) |
| 11 | 39:26–42:53+ | Tipos de pedido: Normal, Reposición, Programación, Muestras; stock mínimo y pedido automático de reposición (ruedas) | Alto (concepto) / bajo (ejemplo largo) | Desplegable «Tipo» del bloque «Indicativos» abierto con las 4 opciones (f239 s2380, f249, f259 hasta ≥43:00) |

## 3. Detalle por bloque útil

Ruta de menú: **no se ve ni se dice en este tramo**. La pantalla ya está abierta en una pestaña previa («TIPOLOGÍA DE PEDIDOS…», código `gcompedd`). La ruta es la de v1: Compras › Maestros › Documentos, entrada de tipos de pedido (comprobar en v1_analisis/tramo 1). Para el tutorial: no inventar ruta, grabar un plano de entrada.

### Bloque 1–3 (21:30–29:37) Serie de numeración (ventana «SERIES DE JUSTIFICANTES», tabla `cserjush`)
- **Pantalla** (se ve en f130–f178): título «SERIES DE JUSTIFICANTES», cabecera de ventana «viernes 11 de diciembre de 2015 12:04:38 CET» y «cserjush: 43, total: 9». Dos pestañas: «Series de justificantes» (activa) y «Numerador de justificantes». Barra de botones de la modal: flecha izda, flecha dcha, rayo, refrescar, hoja (nuevo), «+», check (aceptar), «X», ventana, impresora, tabla, lupa, libro. Iconos de ayuda/estrella/paleta abajo a la derecha.
- **Sección «Identificación»**: «Tabla» = «Pedidos de compras» (desplegable); «Serie» = `PC-` con botón de búsqueda; descripción «Pedidos de Compra».
- **Sección «Información complementaria»** (campos literales): «Numerador» (casilla marcada), «Justificación» = `6`, «Excluir separador» (marcada), «Control cronológico» (sin marcar), «Renovación» = `Perpetua`, «Generar» (marcada), «Fecha inicio» = `15-04-2015`, «Fecha fin» = `31-12-3000`.
- **Sección «Datos de control»**: Usuario alta <usuario>, Fecha alta 15-04-2015 11:16:21, Usuario modificación <usuario>, Fecha modificación 15-04-2015 11:16:45.
- **Sección «Vista»** (grid con 9 filas, columnas Tabla, Serie, Descripción, Numerador, Justificación, Excluir separador, Control cronológico, Renovación, Generar, Fecha inicio, Fecha fin). Filas leídas (todas «Pedidos de compras», justificación 6, Perpetua, 15-04-2015 a 31-12-3000):
  1. `15#0401PC-` · «Copy from mask [yy#mm#e] + serie [PC-]»
  2. `1501PC-` · «Copy from mask [yy#e] + serie [PC-]»
  3. `1501PC2-` · «Copy from mask [yy#e] + serie [PC2-]»
  4. `1502PC-` · «Copy from mask [yy#e] + serie [PC-]»
  5. `1503PC-` · «Copy from mask [yy#e] + serie [PC-]»
  6. `150401PC-` · «Copy from mask [yymm#e] + serie [PC-]»
  7. `151201PC-` · «Copy from mask [yymm#e] + serie [PC-]»
  8. `PC-` · «Pedidos de Compra» (fila seleccionada, sin máscara)
  9. `PC2-` · (sin descripción)
- **Pasos que hace el ponente** (en realidad solo señala): leer la serie PC-; pasar el ratón por «Control cronológico»; abrir el calendario de «Fecha inicio» (se ve abril 2015, día 15 resaltado); recorrer con el ratón las series generadas por máscara y detenerse en sus tooltips.
- **Conceptos y reglas**
  - Una serie solo necesita dar un número que identifique el documento de forma unívoca; no tiene por qué ser correlativa (sin «Control cronológico»). Si una empresa exige correlatividad cronológica, se marca «Control cronológico» (lo dice indirectamente: «puede haber empresas que… dicen no, las series tienen que ser correlativas»).
  - Vigencia: «Fecha inicio»/«Fecha fin»; «Renovación»: anual o toda la vida (`Perpetua`).
  - Es genérico para todos los tipos de documento (cada tabla tiene sus series; «Tabla» = Pedidos de compras).
  - Máscaras: se añaden a la serie para que el sistema genere automáticamente una **copia de la serie con la máscara delante** (de ahí «Copy from mask»). Código de máscara en pantalla: `yy` = 2 dígitos de año, `mm` = 2 dígitos de mes, `#e` = código de empresa (el ponente dice «arroba e… si no me equivoco el código de la empresa»; en pantalla se ve **«#»**, no «@», Whisper lo oye como «arroba»). Ejemplo hablado: «año 15 para la empresa 01 el PC» → `1501PC-`, que numera 1, 2, 3 empezando de nuevo cada año.
  - Sin máscara el sistema genera `PC-000001`… (el ponente dice «PC 0001 002», Whisper: confusión; son 6 dígitos de justificación) «desde el día que empiezo hasta el día que me muera».
  - **El número de documento se guarda en un campo del pedido de 20 posiciones** (el ponente dice «DOXER», probable `docser`/«serie de documento»; no se lee en pantalla, ver avisos). Máscara + caracteres de la serie + dígitos del número deben caber en 20.
  - **Regla de duplicados**: con justificación 6, tras 999 999 pedidos el siguiente pierde el dígito de más y vuelve a generar `PC-000001`; las condiciones de trigger de la tabla lo rechazan como duplicado y el cliente llama «10 años después diciendo que no puede crear pedidos». Hay que dimensionar según pedidos/año (ejemplo: 1 000 pedidos/año → 6 dígitos son de sobra; con año y mes en la máscara: «30 pedidos al mes»).
  - Criterio de diseño: no meter información redundante en la serie (empresa, año, tipo y delegación ya están en otros campos del documento); si la máscara añade datos (delegación, etc.) el número final puede ser más corto. El valor por defecto del sistema es **serie de 6** («un millón de registros dan para muchos años en la mayoría de empresas»); si una empresa genera un millón en 6 meses hay que ampliar, vigilando los 20 caracteres.
- **Dudas/divagaciones**: 22:45–23:05 repite varias veces «vale»; «3 9 3 9» (29:37 aprox., 26:01) es Whisper por «999999»; «Petcom» (28:09) es un ejemplo inventado de serie larga que se desaconseja (no aparece en pantalla). Sobra el repaso de ejemplo de 26:28–27:25 (se repite la idea).

### Bloque 4 (29:37–30:03) Estado y cierre de la modal
- **Pantalla**: a s1780 se cierra «SERIES DE JUSTIFICANTES» y aparece la ficha completa «TIPOLOGÍA DE PEDIDOS DE COMPRAS». Cabecera: botones de la barra superior (atrás, adelante, rayo, refrescar, nuevo, «+», check, «X», ventana, impresora, tabla, lupa, libro, casa). Línea de estado: «gcompedd: 2, gcircuit: 0, cwkflbih: 10, cpub_tipoadok: 0, ccaractd: 0, total: 2».
- **Sección «Identificación»**: «Tipo pedido» = `PC`, «Descripción» = «Pedido de Compra», «Serie» = `PC-` (desplegable), «Pedido relacionado» (vacío), «Estado» = `Activo` (desplegable).
- **Regla**: «Estado»: activo/no activo (se desactiva el tipo cuando ya no se quiere usar «por cambios en la evolución de la gestión de la empresa»).

### Bloque 5 (30:03–31:39) Documento origen
- **Pantalla**: bloque «Documento origen» con pestaña hermana «Solicitud origen». Campos literales: «Tabla origen» (desplegable: `Ninguna`, `Solicitud compras`), «Actualización tabla origen» (`NULL`), «Copia línea origen» (`NULL`), «Condición selección» (caja larga de ancho completo).
- **Pasos mostrados**: ratón sobre la pestaña «Documento origen» (f182); sobre «Tabla origen = Ninguna» (f184–f185); se cambia a «Solicitud compras» y se pone el foco en «Condición selección» (f187–f188, s1860–1870); se vuelve a «Ninguna» (f192).
- **Conceptos**: el pedido puede ser el primer documento del flujo (tabla origen ninguna) o nacer de una solicitud de compra; en ese caso se puede imponer una condición (SQL) que la solicitud debe cumplir para poder ser origen. Se anticipa que el albarán se hará en base al pedido «más de lo mismo».
- **Dudas**: no se explica «Copia línea origen» ni la pestaña «Solicitud origen» (aparece pero no se abre).

### Bloque 6 (31:15–32:02) Actualización de tabla origen
- **Pantalla**: campo «Actualización tabla origen» = `NULL` con ratón encima (f192).
- **Concepto y ejemplo**: al hacer los albaranes se actualiza el pedido (tabla origen) sumando o restando cantidades: «pedí 3, recibo 3 → pedidos 3, recepcionados 3, pendientes 0». Se puede sumar, restar o no actualizar.
- **Aviso**: el ponente no muestra las opciones del desplegable (solo `NULL` visible).

### Bloque 7 (32:02–32:48) Valoración
- **Pantalla**: sección «Valoración»: «Fecha valoración» (`Documento` por defecto), «Valorar» (casilla marcada), «Descuentos especiales» (sin marcar), «IVA incluido» (sin marcar), «Anticipos» (`No`), «Tipo de anticipo» y «Tipo presupuesto» (vacíos, deshabilitados).
- **Desplegable «Fecha valoración»** (f195): `Fecha inicio`, `Fecha fin`, `Documento`, `No valorar`.
- **Conceptos**: valorar = poner precio a los registros; se puede valorar a fecha de inicio, de fin (un pedido puede cubrir un periodo) o a la fecha del documento («única»), o no valorar.

### Bloque 8 (32:48–35:17) Descuentos especiales y rappel
- **Pantalla**: solo el cursor sobre «Descuentos especiales» (f200–f206).
- **Conceptos**: diferenciar los descuentos por escalado de la tarifa (ya visto antes en tarifas) de los «descuentos especiales» asociados al pedido. Ejemplo: **rappel** = descuento por volumen acumulado en un periodo. El pedido solo queda «etiquetado» con el descuento; otro proceso posterior analiza todos los pedidos con ese descuento, suma, y genera un **albarán de venta** (parametrizable) para reclamar al proveedor un importe «por haberle comprado… durante un determinado periodo»; el descuento define «a partir de tal importe se aplica un x por ciento».
- **Dudas**: el ponente reconoce que no domina el tema («no vamos a entrar porque tampoco yo lo conozco en demasía»). Valor de diagrama, no de pantalla.

### Bloque 9 (35:17–36:00) Anticipos
- **Pantalla**: desplegable «Anticipos» = `No` (f212); «Tipo de anticipo» deshabilitado.
- **Concepto y ejemplo**: el anticipo se define contra un tercero como importe («te doy mil a cuenta»); al definir el pedido se vincula: pedido de 2 000, 1 000 ya anticipados, por tanto «la factura de compra solo por ese importe pendiente» (1 000). Documentos de anticipo aparte.

### Bloque 10 (36:00–39:26) Facturación interempresa
- **Pantalla**: sección «Facturación interempresa» con un único campo «Pedido venta» (desplegable vacío, foco en f229/f233).
- **Concepto**: holding de varias empresas fiscalmente distintas pero en el mismo sistema; un tercero puede ser otra empresa del grupo. Si el pedido de compra es a una empresa del holding, se le asocia un **pedido de venta**; entrando solo un documento, «el sistema me genera el simétrico en la otra delegación de la otra empresa» (pedido de compra intercompañía ⇄ pedido de venta), con precio pactado entre compañías. Alternativa manual: imprimir y que compras de la sociedad 2 lo teclee como venta.
- **Ejemplos**: «tú eres el de compras de la sociedad dos». No se enseña ningún pedido interempresa real. «Inter tía» (38:06) = «intercompañía» mal transcrito.

### Bloque 11 (39:26–43:00) Tipos de pedido y reposición
- **Pantalla**: sección «Indicativos» (pestaña hermana «Impresión de documentos»): «Tipo» (`Normal`) con desplegable abierto → `Normal`, `Reposición`, `Programación`, `Muestras` (f239, f249, f259: la lista queda abierta desde 39:40 hasta pasado 43:00). Otros campos del bloque: «Validar catálogo» = `No`, «Compromiso inversión» = `Sí`, casillas «Devolución», «Tesorería», «Datos contables», «Dirección artículos/almacén», «Estadísticas», «Histórico». Bloque «Logística» (pestaña de contexto): «Tipo reserva», «Tipo de propuesta», «Stock planificado» = `No`, «Consistencia reservas», «Alternativos». Bloque «Datos generales» (pestaña «Campos a ocultar»): «Circuito», «Tipo ADO», «Tipo característica», «Tipo workflow» = `PCW01` «Workflow Departamental». Debajo: «Información adicional», «Datos de control» (Fecha alta 15-04-2015 11:27:40; modificación <usuario> 20-04-2015 10:24:27), «Workflow» y «Docflow» (cortados).
- **Concepto y ejemplo**: el tipo de pedido «Normal» es el de este tutorial; «Reposición» lo genera el sistema solo. Ejemplo de la fábrica de coches: stock mínimo de **10 ruedas** definido por artículo/almacén (más stock de reposición, stock de rotura…); un proceso programado (cada hora/día/semana) calcula el stock de todos los artículos y, si está en o bajo el límite, genera **un aviso o un pedido de reposición**. Para que genere el pedido hay que tener definido un tipo de pedido de reposición (se corta en 43:00: «porque va a ser ese el tipo de pedido…»). Se introducen «para que veáis los conceptos», sin demostración.
- **Aviso**: el ponente enumera «reposición, muestras, programación o normal» (39:51) y no explica Programación ni Muestras.

## 4. Planos aprovechables (segundos absolutos del vídeo; recorte x,y,w,h sobre 1680x1048)
| # | Vídeo (s) | Recorte | Qué demuestra |
|---|---|---|---|
| P1 | 1290–1450 | 138,193,1326,752 | Ventana «SERIES DE JUSTIFICANTES» completa: serie PC- con justificación 6, perpetua, fecha fin 31-12-3000 y grid de series (plano general para presentar el concepto) |
| P2 | 1290–1330 | 180,436,1260,80 (fila «Información complementaria») | Campos Numerador, Justificación = 6, Excluir separador, Control cronológico, Renovación = Perpetua, Generar, Fecha inicio/fin (resaltar «Justificación» con zoom) |
| P3 | 1330–1360 | 1100,495,380,140 (calendario) | Calendario de «Fecha inicio» (abril 2015): vigencia de la serie |
| P4 | 1450–1560 | 138,604,1326,290 (grid «Vista») | Las 9 series: `PC-` sin máscara frente a `1501PC-`, `150401PC-`… («Copy from mask») ; zoom a las columnas Serie y Descripción para mostrar la máscara [yy#e] |
| P5 | 1520–1540 | 138,688,820,30 | Tooltip «Copy from mask [yy#e] + serie [PC-]» (f152) |
| P6 | 1780–1800 | 0,190,1680,340 | Ficha «TIPOLOGÍA DE PEDIDOS DE COMPRAS»: Identificación y Documento origen (primer plano de la ficha, con «Estado = Activo») |
| P7 | 1850–1870 | 0,302,1680,70 | «Tabla origen» pasa a «Solicitud compras» y se activa «Condición selección» (único cambio de campo real de todo el tramo) |
| P8 | 1930–1950 | 0,385,830,130 | Desplegable «Fecha valoración»: Fecha inicio / Fecha fin / Documento / No valorar |
| P9 | 2170–2330 | 840,385,840,90 | Bloque «Facturación interempresa» con «Pedido venta» (para ilustrar con diagrama animado la pareja pedido compra ⇄ pedido venta) |
| P10 | 2380–2580 | 160,490,140,100 | Desplegable «Tipo»: Normal, Reposición, Programación, Muestras (plano estático, sirve de fondo para explicar tipos de pedido) |

Nota: no hay planos de acción reales (clic a clic) más allá de P7 y P8; el resto son pantallas estáticas con voz.

## 5. Optimización didáctica
- **Sobra**: la parte de 26:01–29:37 se repite varias veces con ejemplos de nombre de serie («Petcom»); los «vale», las divagaciones sobre cuánto pedidos hace «esta gente»; rappel con admisión de desconocimiento; el ejemplo de las ruedas (40:14–42:53) alargado.
- **Falta**: ruta de menú de acceso a «Tipología de pedidos de compras» y a «Series de justificantes» (no se dice cómo se abre la modal; probablemente desde el campo «Serie» con su botón/lista); demostración del «Numerador de justificantes» (pestaña que ni se abre); qué hace «Copia línea origen»; las pestañas «Solicitud origen», «Impresión de documentos» y «Campos a ocultar»; explicar Programación y Muestras; el valor real del código de campo de 20 posiciones (hay que verificar el nombre del campo en el diccionario: no aparece en pantalla); comprobar en Whisper «DOXER».
- **Mejor orden**: 1) ficha tipo de pedido (Identificación, Estado) → 2) serie y numeración (modal) → 3) documento origen y actualización de origen → 4) valoración y descuentos → 5) anticipos → 6) interempresa → 7) tipos de pedido. Es decir, empezar por la ficha y abrir la modal desde «Serie», porque ahora la modal aparece sin contexto.
- **Diagrama animado**: (a) construcción de un número de documento: máscara [yy#e] + serie PC- + 6 dígitos = 15 01 PC- 000001, con barra de «20 posiciones máximas»; (b) desbordamiento tras 999 999 (el 1 000 000 pierde el 1 y duplica `PC-000001`); (c) pedido con anticipo (2 000 − 1 000 = factura de 1 000); (d) pedido → recepción → pedido actualizado (3/3/0); (e) rappel: pedidos etiquetados → análisis periódico → albarán de venta al proveedor; (f) interempresa: pedido de compra sociedad 1 ⇄ pedido de venta sociedad 2; (g) reposición: stock < 10 ruedas → proceso programado → aviso o pedido de reposición.
- **Tip**: «Para series con año, usa máscara en lugar de crear series a mano: el sistema genera la copia automáticamente»; «El valor por defecto de 6 dígitos da para un millón de documentos»; «Define como activo/no activo en lugar de borrar tipos que ya no se usan».
- **Cuidado**: «Máscara + serie + dígitos ≤ 20 posiciones»; «Tras 999 999 documentos (con justificación 6) el número se repite y el trigger rechaza el alta como duplicado, el pedido ya no se puede crear»; «Si exiges correlatividad cronológica, activa Control cronológico»; «Cambiar la serie con documentos ya creados puede dar duplicados».
- **Aviso de calidad de fuente**: transcripción sin bloques repetidos ni texto inventado en este tramo; la calidad es buena aunque con puntuación desordenada. Palabras dudosas: «DOXER» (campo no visible), «3 9 3 9» (999999), «arroba e» (#e), «PC 0001 002» (PC-000001), «inter tía» (intercompañía), «1501» (año 15, empresa 01, ver grid). Nota de coherencia: en la transcripción el ponente dice «año 15 para la empresa 01», que coincide con la fila `1501PC-`, y la fila `15#0401PC-` demuestra la máscara con almohadilla literal.

## 6. Glosario de términos del ERP (literales de pantalla)
- **Tipología de pedidos de compras** (tabla `gcompedd`): maestro de tipos de pedido de compra; el tipo «PC – Pedido de Compra».
- **Tipo pedido**: código del tipo (`PC`).
- **Serie / Series de justificantes** (tabla `cserjush`): numeración de documentos por tabla; «PC-» para pedidos de compras.
- **Justificación**: número de dígitos del contador (6 → hasta 999 999).
- **Excluir separador**: no incluye el separador al formar el número (marcada).
- **Numerador / Numerador de justificantes**: marca de que la serie numera y pestaña del contador.
- **Control cronológico**: exige que los números sigan el orden de fechas.
- **Renovación (Perpetua)**: vigencia de la serie (anual o toda la vida).
- **Generar**: la serie se usa para generar números.
- **Máscara («Copy from mask»)**: plantilla que antepone año/mes/empresa a la serie; [yy#e], [yy#mm#e], [yymm#e].
- **Tabla origen / Condición selección**: documento del que nace el pedido (p. ej. «Solicitud compras») y su filtro.
- **Actualización tabla origen**: sumar/restar en el documento origen lo servido/recibido.
- **Copia línea origen**: opciones de copia de líneas del origen (no explicado).
- **Fecha valoración (Fecha inicio / Fecha fin / Documento / No valorar)**: fecha con la que se pone precio.
- **Valorar**: poner precio a las líneas.
- **Descuentos especiales / Rappel**: descuentos asociados al pedido; el rappel se calcula a posteriori por volumen en un periodo y genera un albarán de venta contra el proveedor.
- **Anticipos / Tipo de anticipo**: pago adelantado a un tercero, vinculable al pedido.
- **Facturación interempresa / Pedido venta**: enlace entre pedido de compra de una sociedad del holding y su pedido de venta simétrico.
- **Tipo (Normal / Reposición / Programación / Muestras)**: clase de pedido de compra.
- **Validar catálogo, Compromiso inversión, Stock planificado, Tipo workflow (PCW01 Workflow Departamental)**: indicadores de la ficha (no explicados en este tramo).
- **Stock de reposición / stock de rotura**: parámetros de artículo/almacén que disparan un pedido o aviso de reposición.
- **Delegación**: centro/sede dentro de la empresa; en intercompañía, la «otra delegación de la otra empresa».
