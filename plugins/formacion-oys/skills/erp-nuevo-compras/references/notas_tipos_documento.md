# Tipos de documento de compra y series: ERP nuevo (nextdemo.geasa.eu, BBDD TUTORIAL)

Exploración en solo lectura del 14-11-2026. No se ha guardado ni modificado nada.
URL base: `https://nextdemo.geasa.eu/view/app/tutorial/` · rejilla `table/<objeto>/list/1` · ficha `table/<objeto>/form/<n>`.
Capturas en `nueva/screens/` (03–19). El panel se fijó a 800x700 a partir de la captura 06.

En la interfaz nueva, las «pestañas» de la ficha se muestran como **cajas plegables apiladas**. Cada caja puede tener varias pestañas internas, por ejemplo «Documento origen | Solicitud origen» o «Valoración | Anticipos | Contabilización».
**Menú ⋮ de las fichas de maestros** (gcompedd, gcommovd, gcomfacd, gsernumh, cdocnumh): solo tiene **Información · Metadata · Imprimir · Exportar** y «Más opciones». Información abre un panel técnico (Dashboard, Query, Fragments, SQL statistics, Bean, Cursor, Security). En estos maestros no hay procesos ni acciones de negocio.
La **ayuda de cada campo** está en el atributo `title` de la etiqueta. Aparece al pasar el ratón.

---

## 1. Tipología de pedidos: `gcompedd` (complemento de lo ya visto)
Ruta: Gestión › Compras › Maestros › Documentos › Pedidos · URL `.../dispatch/gcompedd`

### Ficha PC (form/1): cajas Docflow, Validaciones workflow y Circuito workflow
- **Docflow**: es un **grafo Graphviz** (SVG dentro de un shadow DOM), no una rejilla. Para PC muestra `PC → gcommovd → ACPC, AOCL`. Es decir, los tipos de albarán que admiten el pedido PC como origen. → **03_tipo_pedido_PC_docflow.png**
- **Validaciones workflow**: está vacía en PC (solo tiene el botón Recargar y un ⋮). PC no tiene «Grupo validación» ni «Circuito» en Datos generales.
- **Circuito workflow**: está vacía. Es un iframe sin contenido porque no hay circuito asignado.
- Datos de control de PC: modificado por un usuario de la demo.

### Ficha PCSO (form/4): pedido con origen en solicitud
- Identificación: Tipo pedido = PCSO · Descripción = PEDIDO COMPRA ORIGEN SOLICITUD · **Serie = PC** · Tipo = Normal · Estado = Activo.
- Documento origen: **Tabla origen = Solicitud compras** · Condición selección (SQL) vacía · **Copiar línea origen = Validar** (inserta desde un selector de líneas) · Actualización tabla origen = Sumando (según la rejilla).
- Solicitud origen: **Enlazar solicitud = No** («Especificar una solicitud y no enlaza múltiples solicitudes»). La otra opción es Sí, que permite líneas de varias solicitudes. Hay campos Condición solicitudes y Actualización solicitud origen (Sumando / Restando / No).
- Impuestos: Relación proveedor = Proveedores · Calcular impuestos = no. Valoración: Fecha valoración = Documento · **Valorar = sí** · Descuentos especiales = no · IVA incluido = no.
- Logística: Stock planificado = No; el resto está vacío. Datos generales: todo vacío (sin circuito ni grupo de validación).
- Datos de control: creado el 03-06-2020 y modificado el 27-07-2020.
- **Docflow PCSO**: `SC, SCC, SPOF, SCSO → gcomsold → PCSO → gcommovd → ACPC, AOCL`. Muestra el circuito completo solicitud → pedido → albarán. → **04_tipo_pedido_PCSO_docflow.png**

---

## 2. Maestro de SERIES / NUMERADORES

### 2a. **Numerador de documentos: `gsernumh`** (aquí está la serie PC) ★
- **Ruta de menú: Gestión › Maestros › Auxiliares › Numerador de documentos** → **12_menu_numerador_documentos.png**
- URL: `https://nextdemo.geasa.eu/view/app/tutorial/dispatch/gsernumh` (título «NUMERADORES DE DOCUMENTOS»).
- Cómo se llega desde el tipo de pedido: el desplegable del campo **Serie** de gcompedd es una consulta sobre gsernumh. El enlace del número de fila abre `table/gsernumh/form/1?q=…mask_code=PC`. → **06_tipo_pedido_PC_lookup_serie.png**
- La búsqueda global ⌘K con «serie» **no** encuentra gsernumh. Encuentra cdocnumh, glog_sernumber, glog_hunumh y las series de la Agencia Tributaria (gvenfach/cvenfach/gvenalbh_edoc_series). → **05_busqueda_global_serie.png**
- Rejilla (16 numeradores). Columnas: Tabla origen, Código, Descripción, Rotura, Numerador, Control cronológico, Fecha baja. → **09_numeradores_gsernumh_rejilla.png**

| Tabla origen | Código | Descripción | Rotura | Numerador | Ctrl. cronol. |
|---|---|---|---|---|---|
| gcompedh | **PC** | PEDIDO DE COMPRA | #e#s | #e#s#6n | no |
| gcomsolh | SC | SOLICITUD DE COMPRA | #e#s | #e#s#6n | no |
| gcomofeh | OC | OFERTA DE COMPRA | #e#s | #e#s#6n | no |
| gcommovh | AC | ALBARÁN DE COMPRA | #e#s | #e#s#6n | no |
| gcomfach | FC / RECT / ANTFC | FACTURA DE COMPRA / RECTIFICATIVA / ANTICIPO | #e#s | #e#s#6n | no |
| gcomanth | ANTCOM | ANTICIPO DE COMPRA | #e#s | #e#s#6n | no |
| ganticih, gmovproh, gvenfach (FV, ANTFV), gvenmovh (AV), gvenofeh (OV), gvenpedh (PV, PVRM) | … | ventas, anticipos y propuestas | #e#s | #e#s#6n | no |

- **Ficha PC (form/8)**. Caja «Datos». → **10_numerador_PC_ficha.png**
  - Tabla origen* = gcompedh · Código* = PC · Descripción* = PEDIDO DE COMPRA
  - **Rotura* = `#e#s`**. La ayuda dice «Máscara para crear una nueva serie»: es la clave del contador, aquí empresa + serie. El campo está bloqueado en gris.
  - **Numerador* = `#e#s#6n`**. La ayuda dice «Criterio de numeración»: empresa + serie + **contador de 6 dígitos**. **La longitud del contador va dentro de la máscara (`#6n`)**; no hay un campo de longitud aparte.
  - **Control cronológico = desmarcado**. La ayuda dice «Control cronológico de la numeración».
  - Fecha baja vacía.
- **Caja «Línea (2)»**: contadores generados por rotura. Columnas: Serie («Código de serie de justificante»), Fecha último documento, Último número, Modificado por, Fecha modificación. → **11_numerador_PC_contadores.png**
  - `0PC`: último documento el 14-04-2021, último número 1.
  - `DISPC`: último documento el 22-05-2025, **último número 8**, modificado el 15-06-2025.
  - Comprobación en la rejilla de pedidos gcompedh: los pedidos van de **DISPC000001 a DISPC000008** (empresa DIS + serie PC + 6 dígitos). Los pedidos de reposición (PREP) usan la misma serie y el mismo contador.
  - **El contador es por empresa y serie, no por año**: la rotura no lleva `#yy`. Para reiniciar por ejercicio habría que poner un token de año en la Rotura y en el Numerador. Así lo hace cdocnumh, que se describe a continuación.
  - No aparece la delegación en la máscara de compras. La demo no tiene ningún token de delegación en gsernumh.

### 2b. Series de documentos (fiscal / contable): `cdocnumh`
- **Ruta: Finanzas › Maestros › Auxiliares › Identificadores › Series de documentos**. En la misma carpeta están Series de justificantes, Detalle de justificantes y Detalle de numeradores.
- URL `.../dispatch/cdocnumh` (título «SERIES DE NUMERADORES DE DOCUMENTOS»). → **13_series_fiscales_cdocnumh_rejilla.png**
- Columnas: Tabla origen, Código, Descripción, Rotura, Máscara número, **Longitud número** (campo propio), **Control cronológico**, Fecha baja. Tiene 40 filas: FC, FCM, FCE, FCS, FCR, FCP, FCA, RCM, RCE…, FV*, RV*, DOC, PG, CMP.
- Valores habituales: Rotura `#e#yy#d` · Máscara `#d#e#yy-#n` · Longitud 6. CMP usa `#e#d` / `#e#n`.
- **Control cronológico marcado solo en las series de venta**: FVE, FVN, FVR, FVS (en las dos tablas, Facturas de venta y global), FVA y RVA, RVE, RVN, RVP, RVS. **En las series de compra está desmarcado.**
- Ficha FC (form/1, tabla origen «Factura de compra» = ccomfach): Rotura #e#yy#d · Máscara #d#e#yy-#n · Longitud 6 · Control cronológico no. → **07_numerador_FC_ficha.png**
- Caja «Serializador de documentos» (contadores): código `026FC`, última modificación 01-11-2026, número 1, **último documento `FC026-000001`**, modificado el 12-11-2026. → **08_numerador_FC_contadores.png**
  - Aquí **el contador sí reinicia por año** (`#yy` en la rotura). Es la numeración del registro fiscal de facturas recibidas, distinta de la serie interna de gsernumh.
  - Interpretación: `#d` = código de serie, `#yy` = año con 2 dígitos, `#n` = contador con la longitud del campo. **`#e` sale como «0» en la demo**: no está claro si es la empresa o un dígito de ejercicio; queda por confirmar.

---

## 3. Tipología de albaranes: `gcommovd`
Ruta: Gestión › Compras › Maestros › Documentos › Albaranes · URL `.../dispatch/gcommovd` (título «TIPOLOGÍA DE ALBARANES Y SUMINISTROS DE COMPRAS»). → **14_tipos_albaran_gcommovd_rejilla.png**

Rejilla (10 tipos, **todos con serie AC**):
| Tipo | Descripción | Suministro/Albarán | Cta. origen → destino |
|---|---|---|---|
| AC | ALBARAN COMPRA | Albarán | NSAL → DISP |
| ACL | Albarán Claude | Suministro | NSAL → DISP |
| ACPC | ALBARAN COMPRA ORIGEN PEDIDO | Albarán | NSAL → DISP |
| ACSC | ALBARAN COMPRA ORIGEN SOLICITUD | Albarán | NSAL → DISP |
| AEAN | … ORIGEN MOVIMIENTO INTERNO | Albarán | NSAL → NSAL |
| AMOS | ALBARAN COMPRA MOSTRADOR | Suministro | NSAL → DISP |
| AOCL | Albaran con origen Claude | Suministro | NSAL → DISP |
| AREP | ALBARAN COMPRA DE REPOSICIÓN | Albarán | NSAL → DISP |
| CONS | MOVIMIENTO DE CONSUMO ORIGEN SOLICITUD | Suministro | DISP → NSAL |
| TRAN | ALBARAN DE CARGO POR TRANSPORTE | Albarán | NSAL → NSAL |

La rejilla tiene unas 110 columnas (todas las opciones de la ficha). Entre ellas: Tabla destino, Documento destino, Tipo factura, Asiento suministros, Asiento albaranes, Asiento no facturados, Asiento provisiones y Circuito.

### Ficha de ejemplo ACPC (form/3)
- **Identificación**: Tipo movimiento = ACPC · **Serie = AC** · Suministro/albarán = Albarán · Tipo movimiento = Entrada · Cuenta origen NSAL → destino DISP · Activo.
- **Documento origen | Origen auxiliar**: **Tabla origen = Pedidos** · Copiar líneas = Sí (automático). El origen auxiliar está vacío.
- **Documento destino**: Tabla destino, Documento destino y Tipo factura están **vacíos**. La factura se enlaza desde el tipo de factura (FCOA, origen Suministros). Albarán pie documento = no.
- Cross-docking (saldo / no saldo): vacío.
- **Valoración | Anticipos | Contabilización**: Orden 0 · Valoración inventario = Origen · **Valorar = Tarifa** · Relación proveedor = Proveedores · Abono = No · Anticipos = Automático.
  - **Contabilización**: **Asiento suministros = VARIACIÓN DE EXISTENCIAS EN ENTRADAS (EXIE)** · **Asiento albaranes = ALBARAN DE COMPRA (AC)** · Asiento no facturados y Asiento provisiones vacíos · Generar inmovilizado = En validación · Provisión = no · **Datos contables = sí · Tesorería = sí**. → **15_tipo_albaran_ACPC_contabilizacion.png**
- Intrastat (Naturaleza, Régimen) · Consumos/Rapeles (Consumo No, Rápel No) · Facturación interempresa · Histórico (Tipo de estadística, Histórico = no).
- Disponibilidad: Lotes = Ambos · Stock depósitos = Ninguno · Proponer ubicación = Ninguno · Stock planificado = No · Control calidad = no.
- Inversiones · ABC · PVP · Indicativos (Acuerdos, Lotes automáticos, Actualizar pedidos, Insertar Catálogo, Insertar Tarifa y Reserva de presupuestos, todos a «no»).
- Impresión del documento · **Datos generales**: Etiqueta docflow, **Circuito** y **Grupo validación** vacíos · Validar catálogo = No.
- **Campos a ocultar**: unas 30 casillas. Casi todas están marcadas para ocultar (dtos., lote, status, código de barras, cantidades, precio con IVA…). Quedan visibles Unidad compras, Cuenta, Cantidad ubicada, Variables logísticas y Datos del lote.
- **Docflow ACPC**: `PC, PCSO, PCOF, PREP, PCCL → gcompedd → ACPC → gcomfacd → FCOA, FCCL` y `ACPC → gcommovd → TRAN`. → **16_tipo_albaran_ACPC_docflow.png**
- Validaciones workflow y Circuito workflow: vacías.
- Notas: «Albarán con origen pedido, generando directamente la entrada de stock.» Datos de control: creado el 03-06-2020 y modificado el 29-05-2025.

---

## 4. Tipología de facturas: `gcomfacd`
Ruta: Gestión › Compras › Maestros › Documentos › Tipos de facturas · URL `.../dispatch/gcomfacd`. → **17_tipos_factura_gcomfacd_rejilla.png**

| Tipo | Descripción | Serie | Tabla origen | Act. origen |
|---|---|---|---|---|
| ANT | ANTICIPO DE COMPRAS | ANTFC | Anticipos | No |
| FC | FACTURA COMPRA | FC | — | — |
| FCA | FACTURA COMPRA CON ANTICIPO | FC | — | — |
| FCCL | Factura Claude | FC | Suministros | Sumando |
| FCOA | FACTURA COMPRA ORIGEN ALBARAN | FC | Suministros | Sumando |
| FIVA | FACTURA COMPRA IVA INCLUIDO | FC | — | — |
| RECT | FACTURA RECTIFICATIVA | RECT | Facturas | Restando |

### Ficha de ejemplo FCOA (form/5)
- Identificación: Tipo factura = FCOA · **Serie = FC** (gsernumh, ayuda «Serie a utilizar en el documento») · Activo.
- Documento origen: **Tabla origen = Suministros** (albaranes) · copiar líneas = S · actualización del origen = Sumando.
- **Valoración**: **Abono = No** (las opciones son Sí, que pone las líneas en negativo; No; y Anulación, que anula todo el documento origen) · **% tolerancia** y **Importe tolerancia** vacíos · Valorar = sí · Descuentos especiales = no · IVA incluido = no · **Diferencia factura = no** · Albarán pie documento = no. → **18_tipo_factura_FCOA_valoracion.png**
- Anticipos: Tipo de anticipo vacío.
- **Contabilización**: **Tipo asiento = FACTURA COMPRA ORIGEN ALBARAN CONT. TOTAL** · Generación inmovilizado = No generar · Datos contables = sí.
- Indicativos: Acuerdos, Reserva de presupuestos.
- **Diferencia con albaranes**: Albarán compras diferencias y Albarán ventas diferencias (tipos de albarán que se generan por la diferencia) están vacíos. Junto con la tolerancia y «Diferencia factura», es el **control de diferencias albarán–factura**. Va ligado al menú Compras › Facturas › Diferencias Albarán - Factura.
- Histórico · **Impuestos**: Relación proveedor = Proveedores · Naturaleza · Clave impositiva · Régimen · **Clase = Factura completa**.
- Impresión del documento · **Datos generales**: Etiqueta docflow, Circuito y Tipo característica vacíos, Tipo ADO vacío, **Grupo validación = FC**. Es el único tipo revisado con workflow de validación asignado; aun así, la caja «Validaciones workflow» de la ficha sale vacía.
- Campos a ocultar: unas 20 casillas.
- **Docflow FCOA**: `AC, ACPC, ACSC, TRAN, AREP, AMOS, AEAN, CONS, ACL, AOCL → gcommovd → FCOA → gcomfacd → RECT`.
- Validaciones workflow y Circuito Workflow: vacías. Datos de control: creado el 29-11-2019 y modificado el 29-05-2025.

---

## 5. Vistazo rápido a otras tipologías
- **Solicitudes `gcomsold`** (Gestión › Compras › Maestros › Documentos › Solicitudes). Todas usan **serie SC**. En esta rejilla la serie aparece como **enlace rojo a gsernumh**. → **19_tipos_solicitud_gcomsold_rejilla.png**
  - SC SOLICITUD COMPRA: Valorar = Tarifa.
  - SCC SOLICITUD COMPRA CONSUMO: Valorar = No.
  - SCSO … ORIGEN SOLICITUD: tabla origen Solicitudes, Valorar = Tarifa.
  - SPOF … ORIGEN OFERTA Y TIPO PETICION: tabla origen Ofertas, copia línea Validar, Valorar = Tarifa.
- **Ofertas `gcomofed`**. Todas usan **serie OC**: OC OFERTA COMPRA · OCCL Oferta compras Claude · OCOF origen Ofertas · OCOS origen Solicitudes.
- **Concursos `gcomcond`**: la rejilla está **vacía («Sin datos»)**. Columnas: Código, Descripción, Serie, Estado, Impresión, Objeto impresión, Enlazar solicitud, Condición solicitudes, Tipo oferta, Estadísticas, Histórico, Público, Tipo ADO, Tipo característica, Grupo validación, Circuito, Notas, Fechas de validez, %Superación…

---

## 6. Control tipo «CRC» / auditoría de cambios
- **No hay ningún campo, pestaña ni indicador llamado CRC** en gcompedd, gcommovd, gcomfacd, gcomsold, gcomofed, gcomcond, gsernumh ni cdocnumh. La búsqueda global ⌘K de «crc» da «No se han encontrado resultados».
- Lo que sí hay:
  - Caja **«Datos de control»** en todas las tipologías: Creado por, Fecha creación, Modificado por y Fecha modificación. Solo guarda el último cambio; no hay histórico.
  - En las rejillas de contadores de gsernumh y cdocnumh: Modificado por y Fecha modificación por contador.
  - **Control cronológico** en los numeradores. Comprueba que la fecha y el número sean correlativos. Está activo solo en las series fiscales de venta de cdocnumh.
  - Indicador **«Histórico»** y «Tipo de estadística» en albarán y factura: actualizan la estadística o el histórico de compras, no auditan cambios.
  - **Tolerancias y diferencias** albarán–factura en gcomfacd: control de importes, no de cambios.
- Otras búsquedas ⌘K: «auditor» da caudctas (auditoría de apuntes contables), cconsol_all_mapped y tconcili_comp. «modificaci» da gcompedl_cambio_precios y gcomacul_cambio_precios (procesos de modificación de precios). «cambio» da además cefechis (histórico de cambios de efectos). **Ninguno es una auditoría de modificaciones de documentos de compra.**

---

## Capturas (03–19)
| Nº | Fichero | Contenido |
|---|---|---|
| 03 | 03_tipo_pedido_PC_docflow.png | gcompedd PC, caja Docflow (PC → gcommovd → ACPC/AOCL) |
| 04 | 04_tipo_pedido_PCSO_docflow.png | gcompedd PCSO, Docflow solicitud → pedido → albarán |
| 05 | 05_busqueda_global_serie.png | Búsqueda global ⌘K «serie» |
| 06 | 06_tipo_pedido_PC_lookup_serie.png | Desplegable del campo Serie (gsernumh: PC «PEDIDO DE COMPRA») |
| 07 | 07_numerador_FC_ficha.png | cdocnumh FC: rotura, máscara, longitud 6, control cronológico |
| 08 | 08_numerador_FC_contadores.png | cdocnumh FC, Serializador (026FC → FC026-000001) |
| 09 | 09_numeradores_gsernumh_rejilla.png | gsernumh, rejilla de numeradores |
| 10 | 10_numerador_PC_ficha.png | gsernumh PC: Rotura #e#s, Numerador #e#s#6n |
| 11 | 11_numerador_PC_contadores.png | gsernumh PC, contadores 0PC (1) y DISPC (8) |
| 12 | 12_menu_numerador_documentos.png | Menú Gestión › Maestros › Auxiliares › Numerador de documentos |
| 13 | 13_series_fiscales_cdocnumh_rejilla.png | cdocnumh, rejilla con control cronológico en las series de venta |
| 14 | 14_tipos_albaran_gcommovd_rejilla.png | gcommovd, rejilla |
| 15 | 15_tipo_albaran_ACPC_contabilizacion.png | gcommovd ACPC, Contabilización (EXIE / AC) |
| 16 | 16_tipo_albaran_ACPC_docflow.png | gcommovd ACPC, Docflow pedido → albarán → factura |
| 17 | 17_tipos_factura_gcomfacd_rejilla.png | gcomfacd, rejilla |
| 18 | 18_tipo_factura_FCOA_valoracion.png | gcomfacd FCOA, Valoración (abono, tolerancias, diferencia factura) |
| 19 | 19_tipos_solicitud_gcomsold_rejilla.png | gcomsold, rejilla (serie SC enlazada) |
