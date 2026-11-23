# Mapa del circuito de compras — ERP nuevo (nextdemo.geasa.eu, BBDD TUTORIAL)

Entorno: https://nextdemo.geasa.eu/view/app/tutorial/home/ · base **tutorial** (BBDD TUTORIAL) · interfaz nueva (Vue/Vuetify, tema oscuro, menú en árbol a la izquierda, búsqueda global ⌘K).
Acceso directo a cualquier objeto: `https://nextdemo.geasa.eu/view/app/tutorial/dispatch/<objeto>` → abre `table/<objeto>/list/1` (rejilla) y la ficha en `table/<objeto>/form/1`.
Capturas: `nueva/screens/NN_nombre.png` (resolución del panel, ~800 px de ancho).

## Requisito del vídeo (petición del usuario, 14-11-2026)
Vídeo explicativo **mucho más impresionante** que un pase de capturas: animaciones que expliquen qué es cada cosa y cómo funciona, diseño cuidado, todo claro y evidente, voz clara. Misma voz que el tutorial de la versión antigua: **es-ES-XimenaNeural (edge-tts, NO Fish Audio)**, venv en `tools/.venv`, generada con `tools/voz.py` (de la sesión principal: leer, no tocar).
Ampliación: diseño con **imágenes 3D y animaciones espectaculares** (p. ej. pantallas del ERP como paneles 3D en perspectiva con cámara que se acerca al campo explicado, circuito pedido→albarán→factura como flujo 3D animado a partir del Docflow, escenas «Antes vs Ahora» en pantalla partida), y que se entienda perfectamente. Duración (indicación del usuario transmitida por la sesión principal): nada de vídeo corto y rápido; **20-35 min por capítulos**, escenas de 10-40 s según el concepto, ritmo pausado y **resumen al final de cada capítulo**; estilo espectacular, 3D y cercano.
Marca: **logo O&S Consultores como copyright** — `video/public/brand/oys_logo_light.png` (fondo oscuro) y `oys_logo.png` (colores originales), transparentes; mosca en una esquina + portada + cierre «© 2026 O&S Consultores», configurable con `marca` en guion.json (copiar al proyecto propio si se trabaja sobre una copia de la plantilla).
Capturas HD para paneles 3D: `nueva/hd/` (1920x1080 @2x = 3840x2160, desde un Chrome aparte con `nueva/tools/erp.mjs`), índice en `nueva/hd/INDICE.md`.
Enfoque (matiz del usuario): tutorial **explicativo paso a paso con capturas reales de cada clic** (ruta de menú, campo que se rellena, botón que se pulsa, resultado) en escenas `pantalla` encadenadas con callouts numerados; las animaciones son para el concepto, la evidencia del cómo es la pantalla. Clics a cubrir: lista de precios y su asignación al proveedor, numerador, tipo de pedido, alta y validación del pedido, generar albarán, contabilizar albarán, generar factura, conformar y contabilizar factura (requiere crear datos en `tutorial`, con permiso del usuario).
Se hace en la Fase B, cuando la sesión principal haya terminado de analizar los dos Loom (guion en `kb/`).

## Menú Gestión › Compras (rutas y objetos)

### Documentos del circuito
| Ruta | Objeto |
|---|---|
| Compras › Licitaciones › Concursos | gcomconh |
| Compras › Ofertas › Ofertas | gcomofeh |
| Compras › Formularios › Formularios | (gcomforh) |
| Compras › Solicitudes › Solicitudes | gcomsolh |
| Compras › Solicitudes › Procesos › Generar pedidos | gcomsolh_gen_gcompedh |
| Compras › Acuerdos › Acuerdos | gcomacuh (procesos: generar pedidos/albaranes/facturas) |
| Compras › Planes de recepción › Planes | — |
| **Compras › Pedidos › Pedidos** | **gcompedh** |
| Compras › Pedidos › Impresión › Impresión pedidos de compra | gcompedh_print |
| Compras › Pedidos › Situación › Pendientes de suministrar | gcompedh_pte_sumin |
| Compras › Pedidos › Work Flow › Gestionar / Autorizar / Retroceder | gcompedh_vtabsel_workflow / gcompedh_awk / gcompedh_rwk |
| Compras › Pedidos › Procesos › Revalidación / Revalorización / Modificación de precios | gcompedh_valida_n / gcompedh_revalo_n / gcompedl_cambio_precios |
| **Compras › Albaranes › Albaranes** | **gcomalbh** |
| **Compras › Albaranes › Procesos › Generación de albaranes desde pedidos** | **gcompedh_gen_gcomalbh** |
| Compras › Albaranes › Situación › Pendientes de factura | gcomalbh_pte_fact |
| Compras › Albaranes › Contabilización › Contabilizar | gcomalbh_contabn |
| Compras › Albaranes › Work Flow › Gestionar / Retroceder | gcomalbh_vtabsel_workflow / gcomalbh_rwk |
| **Compras › Facturas › Facturas** | **gcomfach** |
| Compras › Facturas › Diferencias Albarán - Factura › Conceptos / Usuarios / Procesar | gsrm_comfac_diff / gsrm_comfac_user / gcomfacl_gen_albdiff |
| Compras › Facturas › Situación › Diferencias entre albaranes y facturas | gcomfach_dif_albaran |
| Compras › Facturas › Contabilización › Contabilización de facturas de compras | gcomfach_contabn |
| Compras › Facturas › Work Flow › Gestionar / Autorizar / Retroceder | gcomfach_vtabsel_workflow / gcomfach_awk / gcomfach_rwk |
| Compras › Facturas › Procesos › Autofacturación | gcomfach_autofac |

### Maestros › Documentos (tipologías)
| Ruta | Objeto |
|---|---|
| Concursos | gcomcond |
| Ofertas | gcomofed |
| Formularios | gcomford |
| Solicitudes | gcomsold |
| Acuerdos | gcomacud |
| Planes de recepción | gcom_recplan_type |
| **Pedidos** | **gcompedd** |
| **Albaranes** | **gcommovd** |
| **Tipos de facturas** | **gcomfacd** |
| Anticipos | gcomantd |
| Clasificaciones | gclasdoc |

### Maestros › Tarifas (modelo NUEVO: listas/grupos/condiciones)
| Ruta | Objeto |
|---|---|
| Condiciones comerciales › Condiciones de tarifa | gcomtarc |
| Condiciones comerciales › Programación de actualización de tarifas | gventara |
| Condiciones comerciales › Actualización de tarifas | gventara_act_gventarl |
| **Precios › Grupo de precios** | **gcom_pricegroup** |
| **Precios › Listas de precios** | **gcom_pricelist** |
| **Precios › Condiciones de precios** | **gcom_pricelist_cond** |
| Precios › Procesos › Carga de listas / Copia de listas / Gestión de listas / Gestión de grupos | gcom_pricelist_doc / gcom_pricelist_vtabsel_copy / gcom_pricelist_manager / gven_pricegroup_manager |
| Precios › Informes › Tarifas por artículo / por artículo y cliente / Detalle tarifas | gven_pricelist_art / gven_pricelist_cliart / gven_pricelist_artdet |
| **Descuentos › Grupos de descuento** | **gcom_discgroup** |
| **Descuentos › Listas de descuentos** | **gcom_disclist** |
| **Descuentos › Condiciones de descuentos** | **gcom_disclist_cond** |
| Descuentos › Tipos de concepto | gven_disc_type |
| Descuentos especiales › Conceptos / Generales / Familias | gcomdtoc / gcomdtgh / gcomdtfh |

### Maestros › Rápeles de compras
Contrato rapeles (gcom_rebcont), Tipos (gcom_rebcont_type), Cálculo de provisiones, Liquidación, Apertura.

## Pantallas revisadas

### 01–02 · Tipología de pedidos de compras (gcompedd)
Ruta: Gestión › Compras › Maestros › Documentos › Pedidos. Capturas `01_tipos_pedido_lista.png`, `02_tipo_pedido_PC_identificacion.png`.
Rejilla: Tipo pedido, Descripción, Serie, Tabla origen, Actualización tabla origen, Copiar línea origen, Enlazar solicitud.
Tipos en la demo: PC (Pedido compra), PCCL (Pedido compra Claude — serie PC, origen Oferta compras, ya existía), PCOF (origen oferta), PCSO (origen solicitud, copiar línea «Validar»), PREP (reposición). Todos con serie **PC**.
Ficha PC, pestañas:
- **Identificación**: Tipo pedido*, Descripción, Serie*, Tipo* (Normal), Pedido relacionado, Estado* (Activo).
- **Documento origen**: Tabla origen, Condición selección (SQL), «Inserta automáticamente líneas del documento origen».
- **Solicitud origen**: enlazar una/múltiples solicitudes.
- **Impuestos**: Clave impositiva, Relación proveedor* (Proveedores), Calcular impuestos.
- **Valoración**: Fecha valoración (Documento), Descuentos especiales, Valorar, **IVA incluido**.
- **Anticipos**: Tipo de anticipo. **Contabilidad**: Datos contables, Tesorería.
- **Logística**: reservas, tipo de propuesta, **tipo de albarán**, stock planificado, alternativos.
- **Indicativos**: Acuerdos, Plan de recepción, Distribución repartos, Devolución, Estadísticas, Insertar catálogo, Dirección artículos/proveedor, **Insertar tarifa**, Histórico, Reserva de presupuestos.
- Facturación interempresa (pedido venta), Impresión del documento (objeto impresión).
- **Datos generales**: Etiqueta docflow, **Circuito**, Tipo característica, **Grupo validación**, Orden WMS, Tipo ADO.
- **Campos a ocultar**: casillas por columna de línea (% dto. 1/2/3, precio con IVA, unidad alternativa, lote, referencia proveedor…). NUEVO: ocultación de columnas por tipo de documento.
- **Docflow**, **Validaciones workflow**, **Circuito workflow** (rejillas), Información adicional, Datos de control (creado/modificado por y fecha).
- Serie, máscara (año/empresa), longitud y control cronológico: NO están en el tipo de pedido → están en el maestro de series (pendiente de localizar).

## Detalle por sección (Fase A cerrada)
- Series y tipos de documento → `notas_tipos_documento.md`, capturas 03–19.
- Tarifas → `notas_tarifas.md`, capturas 20–39b.
- Circuito pedido → albarán → factura → `notas_circuito.md`, capturas 40–69.

## Resumen para el guion y las diferencias
**Series / numeración**
- Serie de documento: Gestión › Maestros › Auxiliares › Numerador de documentos (`gsernumh`). Rotura `#e#s`, máscara `#e#s#6n` (empresa + serie + 6 dígitos; longitud dentro de la máscara), contador por empresa+serie **sin año** (DISPC000001…), casilla **Control cronológico** (desmarcada en PC).
- Numeración fiscal aparte: Finanzas › Maestros › Auxiliares › Identificadores › Series de documentos (`cdocnumh`): campo «Longitud número», rotura con año `#e#yy#d`, máscara `#d#e#yy-#n` (FC026-000001); cronológico solo en ventas.

**Tipos de documento**
- Pedidos `gcompedd` (serie PC; PC, PCOF, PCSO, PREP, PCCL), albaranes `gcommovd` (10 tipos, serie AC; ACPC origen pedidos), facturas `gcomfacd` (7 tipos; FCOA origen albarán, grupo validación FC; tolerancias albarán-factura % / importe).
- **Docflow** gráfico por tipo (PC → ACPC/AOCL; SC → PCSO → …). «Campos a ocultar» por tipo de documento.

**Tarifas (gran cambio)**
- Modelo clásico (`gcomtarh`/`gcomtarc`/`gventarh`) presente en menú pero sus tablas **no existen** en `tutorial` (error al abrir).
- Modelo nuevo: **Lista de precios** `gcom_pricelist` (cabecera: código, divisa, clasificación… sin fechas ni IVA incluido; líneas: fechas inicio/fin por línea, artículo, VL, unidad, cantidad mínima → escalados, precio, precio con IVA, dto 1-3, dto importe, estado, precio recomendado). **Grupo de precios** `gcom_pricegroup` = lista ordenada de (orden, condición, divisa, lista). Descuentos con la misma estructura (vacíos). Procesos: gestión masiva, copia a nueva fecha, carga desde fichero.
- Proveedor `gproveed`, pestaña Tarifas: **Grupo precio** / Grupo descuento / descuentos generales y de familia / rápeles.
- Delegación `gdelegac`: solo campos de tarifa de venta clásica → no se ve herencia «tarifa de delegación» para compras.
- Sin permiso específico «editar precios»; solo «Insertar tarifa», «Valorar», «IVA incluido» y ocultación de columnas en el tipo de pedido. Usuarios/roles no revisados.

**Circuito (ejemplo real)**
- Pedido **DISPC000007** (PC, validado, servido, 349,14) → albarán **DISAC000011** (ACPC, facturado) → factura **DISFC000005** (FCOA, base 349,14, total 422,46), proveedor 00001, 10-06-2025, 5 líneas.
- Pedido → albarán: proceso **Compras › Albaranes › Procesos › Generación de albaranes desde pedidos** (`gcompedh_gen_gcomalbh`, botón «Generar albaranes»).
- Albarán → factura: en el albarán validado, **Acciones › Generar factura** (no hay proceso masivo).
- Factura: Validar / Pasar a provisional / Contabilizar / Descontabilizar / Anular. Trazabilidad con **Docflow** (`gdocflowh`, menú ⌄ junto a la estrella).
- Workflow: Gestionar (`*_vtabsel_workflow`), Autorizar (`*_awk`), Retroceder; subpestaña «Evolución de workflow»; campos Validaciones/Bloqueos.
- Diferencias albarán-factura: informe `gcomfach_dif_albaran`, conceptos `gsrm_comfac_diff`, proceso `gcomfacl_gen_albdiff` (albaranes de ajuste).
- **CRC: no existe.** Equivalentes: «Datos de control» (creado/modificado/validado/impreso), indicador Modificar, bloqueos y validaciones de workflow, tolerancias albarán-factura, control cronológico del numerador.

**Pegas de la demo**: la ficha de `gcompedh` sale genérica (sin pestañas/líneas; error de título `${Pedidos compras}`), líneas en `gcompedl`; las líneas de albarán/factura no muestran el origen (solo Docflow); no se ejecutaron «Generar albaranes» ni «Generar factura» (requieren permiso del usuario para crear datos en `tutorial`).

## Fase B — pendiente
Cruce con `kb/` → `diferencias.md`; grabar el circuito (si el usuario lo autoriza, crear en `tutorial` un pedido → albarán → factura nuevo para grabarlo en vivo); vídeo Remotion 3D 20-35 min por capítulos con la voz Fish Audio de la sesión principal → `nueva/out/tutorial_compras_erp_nuevo.mp4`.
