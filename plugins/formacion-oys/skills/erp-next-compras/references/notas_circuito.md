# Circuito de compras pedido → albarán → factura (interfaz nueva Axional)

Entorno: https://nextdemo.geasa.eu, base `tutorial` (diccionarios wic_tutorial, wic_iges, wic_icon). Exploración en solo lectura el 14-11-2026: no se ha guardado, validado, generado ni ejecutado nada.
URL genérica de entrada: `https://nextdemo.geasa.eu/view/app/tutorial/dispatch/<objeto>`. Las rejillas acaban en `/table/<objeto>/list/1`, las fichas en `/table/<objeto>/form/<n>` y los informes o procesos en `/qbe/<objeto>` (formulario de filtro), que al ejecutar pasan a `/vtable/<objeto>/form/1`.
Ruta de menú: la interfaz nueva no tiene árbol de menú visible. Se entra por el buscador global (⌘K, campo «Buscar» de la barra roja), que busca por título y por código de objeto. Las rutas indicadas abajo son las del buscador.

## Ejemplo de trazabilidad completa

| Documento | Número | Tipo | Fecha | Estado | Importe |
|---|---|---|---|---|---|
| Pedido | **DISPC000007** (id 8, fila 7) | PC «PEDIDO COMPRA» | 10-06-2025 | Validado · situación **Servido** | 349,14 neto |
| Albarán | **DISAC000011** (id/cabid 23) | ACPC «ALBARAN COMPRA ORIGEN PEDIDO» | 10-06-2025 | Validado · estado documento **Facturado** | 349,14 |
| Factura | **DISFC000005** | FCOA «FACTURA COMPRA ORIGEN ALBARAN» | 10-06-2025 | Validado · situación Entrada | base 349,14 · total 422,46 |

Proveedor 00001 «PROVEEDOR» (CIF A79935607, Madrid). Receptor/delegación 00003 «DISTRIBUIDORA S.L.» (Badalona). Empresa DIS, delegación DIS CENTRAL, departamento Distribuidora, almacén Central (0000). Mismas 5 líneas en los tres documentos:

| Artículo | Descripción | Cantidad | Precio | Importe |
|---|---|---|---|---|
| 90037985 | BPFL-12-15-17 INOX ISB | 38 | 3,33 | 126,54 |
| 32515225 | BPF-40 (4 AGUJEROS) ISB | 15 | 6,25 | 93,75 |
| 11540000 | TUERCA KM 0 ISB | 2 | 0,05 | 0,10 |
| 13906033 | CORONA EB1.20.0644.200-1STPN ISB | 35 | 2,25 | 78,75 |
| 00000016 | CORONA NB1.22.0310.200-2 TTN ISB | 10 | 5,00 | 50,00 |

La trazabilidad se ve en el **Docflow** (menú ⌄ junto a la estrella en la ficha del albarán o de la factura): pedidos (1) → suministros (1) → facturas (1), con una tarjeta por documento que muestra número, estado, tipo y fecha. Captura 55. El Docflow es el objeto `gdocflowh` (vtable) con las variables CABID=23 y TABNAME=gcomalbh.

Otros albaranes con origen pedido ya facturados, por si hace falta otro ejemplo: DISAC000006 (250,00) → DISFC000001, DISAC000007 (41,25), DISAC000008 (221,50) y DISAC000009 (8.150,00), que encajan por importe con DISFC000002, 3 y 4.

---

## 1. Pedidos de compras — `gcompedh`

- Buscador: «PEDIDOS DE COMPRAS» (gcompedh). URL: `/dispatch/gcompedh` → `/table/gcompedh/list/1`.
- **Rejilla** (captura 40): Identificador pedido, Tipo documento, Empresa, Delegación, Departamento, Fecha pedido, Pedido, Proveedor, Dirección, Divisa, Cambio, Cálculo, Estado, Bloqueos, Procesos, Validaciones, Situación, Notas, Tipo efecto, Forma pago, Receptor, Facturador, Destinatario, datos de dirección, Inicio, fin y hora de entrega, Importe bruto, Importe neto, Anticipo, Zona impositiva, Presupuesto, Partida, Expediente, % dto. 1-3, % pronto pago, % retención, Portes, Almacén, Comprador, Enviado a WMS, Modificar, auxiliares y auditoría (creado o modificado por y fechas de creación, modificación, validación e impresión). 9 pedidos: DISPC000001…000008 (DIS) y 0PC000001 («Pedido compra Claude», provisional, de otra prueba).
- **Ficha** (capturas 41 y 45): en este entorno `gcompedh` se abre con el **formulario genérico de tabla**: una sola columna de campos, **sin pestañas, sin líneas y sin botones de proceso**. El título falla: la miga muestra «Failed to parse the expression [${Pedidos compras}] 1». Es un defecto del diccionario de la demo.
  - Ejemplo DISPC000001: Tipo documento PEDIDO COMPRA (PC), Empresa DIS, Delegación DIS CENTRAL (DIS001), Fecha 22-05-2025, Proveedor 00001, Divisa EUR, Cambio 1, **Estado Validado**, Procesos «Presupuesto», Validaciones 0, **Situación Pendiente**, Tipo efecto EF, Receptor 00003, Facturador 00001, Inicio y fin de entrega 22-05-2025, Importe bruto y neto 25,00, Zona impositiva ESCO, Portes Debidos, Almacén Central, Enviado a WMS No, Modificar Sí, creado y modificado por <usuario> el 22-05-2025 18:10:19, validado el 23-05-2025 14:16:59.
  - Ejemplo DISPC000007: Estado Validado, **Situación Servido**, importe 349,14, validado el 10-06-2025 09:58:58.
- **Menú ⋮** (captura 42): solo Información (consultas SQL, estadísticas y diccionarios del objeto), Metadata, Imprimir y Exportar. No hay validar, generar albarán ni workflow en la ficha. Barra: Nuevo, guardar, borrar, anterior y siguiente, buscar, recargar.
- **Líneas** — objeto aparte `gcompedl` («LÍNEAS DE PEDIDOS DE COMPRAS»), `/dispatch/gcompedl` (capturas 43 y 44).
  - Rejilla: Artículo, Descripción, VLP, Ref. proveedor, Lote, Inicio y fin de entrega, Cantidad pedida, Unidad, Cantidad y unidad alternativa, Cantidad y unidad de precio, Precio, Precio con IVA, % Dto. 1-3, Importe dto., Importe neto, **Cantidad adjudicada, Extraída, Servida, Facturada y Anulada**, Bonificación, Receptor, Orden, Validaciones pendientes, Regalo, Modificar.
  - Ficha de línea (con pestañas): Artículo, Vigencia, Estado, Cantidad, Precio, Tarifa, Costes, Descuentos - Importe neto, **Cantidades procesadas**, Impuestos, Dirección de envío, Auxiliares, Cambios de precio, Datos contables, Anulaciones, Documentos, Notas, Movimientos planificados. Ejemplo de la línea 1 del pedido 1: artículo 00000016, 5 UNIDAD a 5,00 = 25,00, servida, facturada y adjudicada 0, impuesto CLBC/ESG regla 73.
  - Botones de la línea: **«Marcar como servida»** y **«Anular»**.
- **Paso al documento siguiente**: no se hace desde la ficha del pedido, sino con el proceso `gcompedh_gen_gcomalbh` (sección 2) o creando un albarán de tipo «ALBARAN COMPRA ORIGEN PEDIDO» (ACPC).

## 2. Generación de albaranes desde pedidos — `gcompedh_gen_gcomalbh`

- Buscador: «GENERACIÓN DE ALBARANES CON ORIGEN PEDIDOS». URL: `/dispatch/gcompedh_gen_gcomalbh` → `/qbe/...` → `/vtable/gcompedh_gen_gcomalbh/form/1`.
- **Filtro** (captura 46): variable obligatoria **Tipo documento** (tipo de pedido: PC PEDIDO COMPRA, PCSO PEDIDO COMPRA ORIGEN SOLICITUD, PCOF PEDIDO COMPRA ORIGEN OFERTA, PREP PEDIDO COMPRA REPOSICIÓN y PCCL Pedido compra Claude, todos de serie PC). Columnas de filtro: Pedido, Fecha pedido, Almacén, Empresa, Delegación, Departamento, Proveedor, Importe neto, Artículo, VLP.
- **Resultado** (captura 47; consulta ejecutada con PC, sin generar): tres paneles. «Pedidos de compras», con filtro rápido «Pendiente» (Situación, Tipo, Empresa, Delegación, Departamento, Fecha, Pedido, Referencia, Proveedor, Nombre, Importe neto, Inicio entrega…). «Línea del pedido» (Pedido, Artículo, Descripción, VLP, Cantidad pedida, Unidad, Precio, % Dto. 1-3, Importe neto). «Albaranes de compras», que recoge los albaranes generados (Tipo, Empresa, Almacén, Delegación, Departamento, Fecha, Albarán, Referencia, Origen, Proveedor, Importe, Estado). En la demo sale «Sin datos». Botón azul **«Generar albaranes»** arriba a la derecha (no pulsado).
- Por tanto, **pedido → albarán se genera con este proceso**: se seleccionan pedidos o líneas y se pulsa «Generar albaranes».

## 3. Albaranes de compras — `gcomalbh`

- Buscador: «ALBARANES DE COMPRAS». URL: `/dispatch/gcomalbh` → `/table/gcomalbh/list/1`.
- **Rejilla** (captura 50): filtro rápido «Todos», Ordenar, Filtros. Una barra de color a la izquierda indica el estado. Columnas: Albarán, Proveedor, Tipo documento, Delegación, Departamento, Almacén, Almacén destino, Empresa, Fecha albarán, proveedor y recepción, Referencia, Dirección, Importe bruto, Importe, Divisa, Cambio, **Estado, Estado documento**, Tipo efecto, Muelle destino, Forma pago, terceros (delegación, facturación, receptor), Traspasado a EDI, Estadísticas, Histórico, **Origen, Origen auxiliar**, Anticipos, Clasificación, Fecha contabilización, Fecha no facturado, % descuentos, Zonas, Presupuesto, Partida, Expediente, Fecha valor, Portes, Modificar, % Retención, Notas, Contenedor, Dossier, Despacho aduana o tránsito, Evolucionado, Importe auxiliar, Enviado a WMS, **Procesos, Bloqueos, Validaciones**.
  - Datos: 12 albaranes. Facturados: DISAC000011, 009, 008, 007 y 006 (todos ACPC «origen pedido», Procesos «IPa»), además de 0AC000002 y 0AC000003. Pendientes de facturar: DISAC000012 (1.500.000,00), 010, 003, 002 y 001 (AC «ALBARAN COMPRA», Procesos «P»). Todos en estado Validado.
- **Ficha DISAC000011** (capturas 51 a 56, 69). La miga muestra «DISAC000011 [00001]» (albarán y proveedor).
  - Pestañas principales: **Albaranes compras | Líneas | Impuestos | Anticipos | Documentos | Notas**.
  - Bloques y subpestañas de «Albaranes compras»:
    - Unidad de negocio: Tipo documento ALBARAN COMPRA ORIGEN PEDIDO (ACPC), Empresa DIS, Almacén Central (0000), Delegación DIS CENTRAL, Departamento Distribuidora.
    - Fecha: albarán y proveedor 10-06-2025.
    - Albarán | Origen auxiliar | Estado: Albarán DISAC000011, **Estado documento Facturado, Estado Validado, Validaciones 0**.
    - Pedido a | Facturado por | Recepcionado en | Enviado a: proveedor 00001 Salvador de Madariaga, 28702 San Sebastián de los Reyes; tercero de facturación 00001; recepcionado en 00003 DISTRIBUIDORA S.L., C/ del Plàstic 12, 08915 Badalona.
    - Información general | Indicadores | Notas | Auxiliares: Referencia «ALBARAN PROVEEDOR», Fecha recepción 10-06-2025; Histórico [ ], Modificar Sí, Estadísticas [ ], EDI [ ].
    - Datos financieros: EF, Contado, Portes Debidos, % Retención 0. Importaciones: Evolucionado [ ].
    - Impuestos | Descuentos | Procesos asociados | Permisos de procesos: ESCO/ESCO y descuentos a 0.
    - Importe | Anticipo | Tarifas: EUR, cambio 1, importe bruto e importe 349,14, anticipos 0.
    - Líneas (5) y **Workflow | Evolución de workflow** (captura 56). La rejilla de workflow tiene el filtro «Pendientes» y las columnas Fase, Validación, Desc. validación, Id. línea, Descripción actividad, Código workflow, Descripción de rol, Usuario efectivo, Estado. Está vacía en el ejemplo.
  - Líneas (captura 52): Artículo, Descripción, VLP, Cantidad, Unidad, Precio, Importe neto, Ubicación origen y destino, Cantidad ubicada, Cantidad anulada, Validaciones pendientes. La ficha de línea (`gcomalbl`, panel lateral) tiene las pestañas Artículo, Vigencia, Estado, Cantidad, Precio, Tarifa, Costes, Descuentos, Ubicaciones, **Cantidades procesadas** (ubicada 0, abonada 0, anulada 0, recibida 0, **facturada 38**), Impuestos, Dirección de envío, **Cuentas** (origen NSAL, destino DISP), Auxiliares, Datos contables, Documentos (ficheros adjuntos), Notas, Anulaciones. **No hay un campo visible con el pedido origen en la línea.** El enlace con el pedido se ve con el Docflow o con el menú ⌄ «Pedidos compras».
  - **Botones de la barra:**
    - Albarán ya facturado: «Acciones ⋮» (Actualizar datos económicos, Copiar; captura 53), **Contabilizar** y Nuevo.
    - Albarán pendiente de facturar (DISAC000010): **Pasar a provisional, Contabilizar, No facturable, Anular**, y en Acciones **«Generar factura»**, Actualizar datos económicos y Copiar (captura 59).
  - **Menú ⌄ junto a la estrella** (documentos relacionados, captura 54): **Docflow, Suministros, Pedidos compras, Facturas compras**. «Pedidos compras» abre el pedido en una pestaña nueva.
  - **Menú ⋮**: Información, Metadata, Imprimir, Exportar.
  - **Barra lateral derecha** (icono de tabla, captura 69): resumen «Datos de Albarán», «Proveedor» y **«Datos de control»**: Identificador albarán 23, Fecha validación 10-06-2025 09:59:36, Fecha impresión vacía, Creado por <usuario> el 10-06-2025 09:59:35, Modificado por <usuario> el 10-06-2025 09:59:35. El primer icono de la barra es el de comentarios.
- **Paso a factura**: botón **Acciones → «Generar factura»** en la ficha de un albarán validado y pendiente (no ejecutado, así que no se han visto sus parámetros). No existe un proceso masivo `gcomalbh_gen_gcomfach`: el buscador no devuelve nada para «conform» (Conformar vive en el ⌄ del título de las facturas FCCL, no en el buscador), «facturar» (solo ventas) ni `gcomalbh_*`.

## 4. Facturas de compras — `gcomfach`

- Buscador: «FACTURAS DE COMPRAS». URL: `/dispatch/gcomfach` → `/table/gcomfach/list/1`.
- **Rejilla** (captura 60): Factura, Proveedor, Tipo documento, Empresa, Delegación, Departamento, Origen, Factura proveedor, Clasificación, Fecha factura, operación y valor, Tercero, Dirección, Clave impositiva, Tipo de identificación, País emisor, CIF, Zonas, Documento rectificado, Fecha de rectificación, Presupuesto, Partida, % Pronto pago, Portes, % Retención, Tipo efecto, Forma pago, Banco, **Importe factura**, Divisa, Cambio, Importe bruto, Importe total… La barra de color indica el estado: morado = contabilizada (0FC00000x), verde = validada, naranja = provisional (DISFC000006). 9 facturas: DISFC000001…000006, MAL-260908, 0FC000001 y 0FC000002.
- **Ficha DISFC000005** (capturas 61 a 64):
  - Pestañas principales: **Facturas compras | Líneas | Impuestos por documento | Vencimientos | Anticipos | Expedientes | Documentos | Notas**.
  - Bloques y subpestañas:
    - Unidad de negocio: FACTURA COMPRA ORIGEN ALBARAN (FCOA), DIS, DIS CENTRAL, Distribuidora.
    - Fecha: factura y valor 10-06-2025; fecha de registro contable vacía.
    - Factura | Estado: DISFC000005; **Estado Validado, Situación Entrada, Validaciones 0**.
    - Pedir a | Facturado por | Pagado por: 00001 PROVEEDOR.
    - Información general: Factura proveedor «FACTURA PROVEEDOR 4», NIF-Empresa, ES, CIF A79935607.
    - Indicadores, Auxiliares, Notas.
    - Datos financieros: EF, Contado, Debidos, retención 0.
    - Impuestos: ESCO, fecha de operación 10-06-2025.
    - Descuentos, Procesos asociados, Permisos de procesos.
    - Importe: EUR, **Importe factura 0,00** (importe declarado sin informar), **Base imponible 349,14, Importe total 422,46**.
    - Anticipo: 0 / IVA anticipado 0. Tarifas. Contabilidad: relación proveedor «Proveedores».
    - Líneas, y **Workflow | Evolución de workflow**.
  - Líneas (captura 62): Artículo, Descripción, VLP, **Cantidad facturada**, Unidad, Cantidad y unidad alternativa, Precio, Importe neto, Validaciones pendientes. La ficha de línea (`gcomfacl`) tiene las pestañas Artículo, Estado, Cantidad (facturada, abonada, bonificación), Precio, Tarifa, Costes, Descuentos, Impuestos (CLBC/ESG 21 %, regla 73), Auxiliares, Datos contables, Documentos, Notas. **No muestra el albarán origen**: el enlace se consulta con el menú ⌄ «Albaranes compras».
  - **Botones según estado:**
    - Provisional (DISFC000006): **Validar** y Nuevo; borrar habilitado.
    - Validada (DISFC000005): **Acciones** (solo «Copiar»; captura 64), **Pasar a provisional**, **Contabilizar** y Nuevo.
    - Contabilizada (0FC000001): **Descontabilizar**, **Anular** y Acciones.
  - **Menú ⌄** (captura 63): **Docflow, Albaranes compras, Suministros**, «Registros fiscales» (deshabilitado) y «Copiar líneas de pedido» (deshabilitado; con origen pedido). «Albaranes compras» abre DISAC000011.
  - El panel Líneas de una factura provisional solo tiene «Nuevo» y el ⋮ (Información, Columnas, Imprimir, Exportar, Importar). No hay un botón para traer albaranes.
- **Cómo se genera desde albaranes**: **un botón, no un proceso de menú**. Se usa Acciones → «Generar factura» en la ficha del albarán, y sale una factura de tipo FCOA «FACTURA COMPRA ORIGEN ALBARAN». También existen `gcomacuh_gen_gcomfach` (desde acuerdos) y `gcomfach_autofac` (autofacturación).

## 5. Workflow y autorizaciones

- `gcompedh_vtabsel_workflow` «GESTIÓN DE WORKFLOW DE PEDIDO DE COMPRAS» (captura 48). Tiene un QBE con filtros de cabecera (identificador, tipo, empresa, delegación, departamento, fechas, pedido, proveedor, dirección, almacén, tipo efecto, forma pago, importe neto). El resultado se divide en dos franjas:
  - **«FORMULARIOS CON AUTORIZACIONES PENDIENTES»** (azul): panel «Pedidos con autorizaciones pendientes» (Tipo, Empresa, Delegación, Departamento, Fecha, Pedido, Proveedor, Nombre, Divisa, Importe neto, Validaciones, **Atraso (días)**, Creado por) y panel «Pendientes | Detalle», con los grupos Documento (Pedido, Artículo), Acción (Validación, -, Actividad) y Workflow (Código workflow, Rol, Usuario efectivo, Estado).
  - **«PEDIDOS CON ACCIONES REALIZADAS»** (verde): mismos paneles para «Realizado».
  - Vacío en la demo.
- `gcompedh_awk` «PEDIDOS DE COMPRAS PENDIENTES DE AUTORIZACIÓN» (captura 49). Texto: relación de pedidos que el usuario puede autorizar y que están bloqueados por las reglas de validación estándar o por el workflow. Filtros: Empresa, Delegación, Departamento, Tipo documento, Identificador pedido, Pedido, **Fecha pedido (obligatoria)**, Proveedor, Fecha modificación, Modificado por, **Validación**. No se ha ejecutado.
- `gcomfach_awk` «FACTURAS DE COMPRAS PENDIENTES DE AUTORIZACIÓN» (captura 65). Texto: facturas en estado bloqueado; desde el número de factura se entra al registro y se autoriza el bloqueo. Mismos filtros con Fecha factura obligatoria.
- Objetos relacionados que aparecen en el buscador: `gcompedh_wkf_penaut`, `gcompedl_wkf_penaut`, `gcompedh_rwk` (autorizaciones emitidas), `gcomalbh_vtabsel_workflow`, `gcomalbh_wkf_penaut`, `gcomfach_vtabsel_workflow`, `gcomfach_wkf_penaut`, `gcomfach_rwk` y `gworkflow_tree` («Validaciones workflow»).
- En las fichas de albarán y factura el workflow se ve en la subpestaña **Workflow / Evolución de workflow**, y la cabecera muestra los campos **Validaciones** (número de validaciones pendientes), **Bloqueos** y **Procesos**.

## 6. Diferencias albarán-factura

- `gcomfach_dif_albaran` «DIFERENCIAS EN CANTIDADES Y / O IMPORTES ENTRE ALBARANES Y FACTURAS» (captura 66). Informe de facturas conformadas contra albaranes con diferencias de cantidad o de importe neto de línea (misma divisa), agrupado por empresa. Filtros: Empresa, Tipo documento, Delegación, Departamento, **Fecha factura***, Factura, **Proveedor***, Factura proveedor, Fecha registro contable, Artículo.
- `gsrm_comfac_diff` «CONCEPTOS DE DIFERENCIAS» (captura 67). Mantenimiento con las columnas Código de concepto, Descripción, Tipo de diferencia, Tipo de albarán, Tipo de albarán de abono. Vacío en la demo.
- `gcomfacl_gen_albdiff` «PROCESAR DIFERENCIAS DE FACTURAS» (captura 68). Proceso que **genera albaranes de ajuste** de las diferencias de las facturas seleccionadas respecto a sus albaranes origen; antes hay que asociar un concepto de ajuste a cada diferencia. Filtros: Identificador factura, Tipo, Empresa, Delegación, Departamento, Fecha factura, Fecha operación, Factura, Proveedor, Dirección, Divisa, Estado… No se ha ejecutado.

## 7. Situación

- `gcompedh_pte_sumin` «PEDIDOS PENDIENTES DE SUMINISTRAR (RESUMEN)» (captura 57). Pedidos con cantidades pendientes de suministrar, agrupados dinámicamente por proveedor, tipología, delegación, departamento, almacén y comprador. Filtros: Empresa, Tipo documento, Delegación, Departamento, **Fecha pedido***, Pedido, **Proveedor***, Inicio entrega, Fin entrega, y un bloque «Grupos».
- `gcomalbh_pte_fact` «ALBARANES PENDIENTES DE RECEPCIÓN FACTURA» (captura 58). Albaranes sin factura recibida o pendientes de conformar, agrupados por empresa, proveedor, tipo, delegación, departamento, almacén, fecha, clasificación, artículos, VLP y familias. Filtros: Empresa, Tipo, Delegación, Departamento, **Fecha albarán***, Albarán, Proveedor, y un bloque «Grupos» que se puede reordenar y ocultar.
- Otros que aparecen en el buscador: `gcompedh_situacion` (situación de pedidos), `gcompedh_suminis` (seguimiento de suministros por pedido), `gcomalbh_pedidos` (albaranes recibidos por pedido), `gcomfach_alb_proved` (albaranes facturados por proveedor), `gcomalbh_pte_contab` y `gcomfach_pte_contab` (pendientes de contabilizar), `gcomalbh_contab_nfac` (contabilizar albaranes con factura sin recibir), `gcomalbh_genprov` (provisiones de albaranes).

## 8. Control CRC, control de cambios y auditoría

- **No se ha encontrado ningún control CRC, hash ni pestaña de control de cambios** en pedido, albarán ni factura. El buscador no devuelve nada para «crc», «hash», «modificaciones» ni «docflow». Para «cambios» y «auditor» solo salen objetos de otras áreas: `cefechis` (histórico de cambios de efectos), `cterbanc_thread` (traza de cambios en datos bancarios) y `caudctas` (auditoría de apuntes).
- Lo que hay en su lugar:
  1. Campos de auditoría en cabecera: Creado por y fecha de creación, Modificado por y fecha de modificación, Fecha validación y Fecha impresión. En el albarán y la factura salen en la barra lateral «Datos de control» (captura 69); en el pedido, al final del formulario.
  2. El indicador **Modificar (Sí/No)** en cabecera y líneas, que permite o bloquea la edición.
  3. Los campos **Validaciones**, **Bloqueos** y **Procesos** (por ejemplo «IPa» o «P» en albaranes, «Presupuesto» en pedidos), más el workflow (Workflow / Evolución de workflow) y los objetos de autorización `*_awk`.
  4. Las transiciones de estado con botón: Pasar a provisional, Validar, Contabilizar, Descontabilizar, Anular y No facturable.
  5. El **Docflow** (`gdocflowh`) como trazabilidad entre documentos.

## Flujo resumido

1. **Pedido** (`gcompedh` + líneas `gcompedl`): se crea en provisional y se valida (estado Validado). La situación pasa de Pendiente a Servido según las cantidades servidas de las líneas. Si hay reglas de validación o workflow, queda bloqueado y se autoriza en `gcompedh_awk` o `gcompedh_vtabsel_workflow`.
2. **Albarán** con proceso `gcompedh_gen_gcomalbh`: se elige el tipo de pedido, se filtra, se seleccionan pedidos o líneas pendientes y se pulsa **«Generar albaranes»**. Sale un albarán de tipo ACPC «ALBARAN COMPRA ORIGEN PEDIDO», validado y con estado documento Pendiente de facturar.
3. **Factura** desde la ficha del albarán: **Acciones → «Generar factura»**. Sale una factura FCOA «FACTURA COMPRA ORIGEN ALBARAN», y el albarán pasa a estado documento Facturado. La factura se valida y se contabiliza con los botones Contabilizar y Descontabilizar. Las diferencias de cantidad o importe se revisan en `gcomfach_dif_albaran` y se regularizan con `gcomfacl_gen_albdiff` (albaranes de ajuste según los conceptos de `gsrm_comfac_diff`).

## Capturas (carpeta `nueva/screens/`)

40_pedidos_rejilla · 41_pedido_ficha_cabecera · 42_pedido_menu_acciones · 43_pedido_lineas_rejilla · 44_pedido_linea_ficha · 45_pedido_DISPC000007_estado · 46_gen_albaranes_desde_pedidos_filtro · 47_gen_albaranes_desde_pedidos_resultado · 48_workflow_pedidos_gestion · 49_pedidos_pendientes_autorizacion · 50_albaranes_rejilla · 51_albaran_ficha_cabecera · 52_albaran_lineas · 53_albaran_menu_acciones · 54_albaran_menu_relacionados · 55_docflow_pedido_albaran_factura · 56_albaran_workflow · 57_pedidos_pte_suministrar · 58_albaranes_pte_factura · 59_albaran_pendiente_generar_factura · 60_facturas_rejilla · 61_factura_ficha_cabecera · 62_factura_lineas · 63_factura_menu_relacionados · 64_factura_menu_acciones · 65_facturas_pendientes_autorizacion · 66_dif_albaran_factura · 67_conceptos_diferencias · 68_procesar_diferencias_facturas · 69_albaran_sidebar_datos_control

## Pendiente o no verificado

- No se han abierto los diálogos de «Generar albaranes» ni de «Generar factura», porque podrían ejecutar sin pedir confirmación. Sus parámetros están sin ver.
- La ficha del pedido usa el formulario genérico (sin líneas ni acciones). No se ha visto la versión con pestañas que puede existir en otro diccionario.
- No se ha ejecutado ningún informe QBE que pida fecha obligatoria (awk, pte_sumin, pte_fact, dif_albaran), así que no se sabe si traen datos.
