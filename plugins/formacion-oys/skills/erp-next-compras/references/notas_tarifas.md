# Tarifas de compra: ERP Axional nuevo (nextdemo.geasa.eu, BD `tutorial`)

Revisado el 14-11-2026 en solo lectura: no se ha creado, guardado, validado ni ejecutado nada.
URL base: `https://nextdemo.geasa.eu/view/app/tutorial/dispatch/<objeto>`.
Menú: Gestión › Compras › Maestros › Tarifas (salvo que se indique otra ruta).
Capturas en `nueva/screens/` (20 a 39b).

## Resumen del modelo

Hay dos modelos en el diccionario:

1. **Modelo nuevo de listas de precios, que es el que funciona en `tutorial`:**
   - **Lista de precios** (`gcom_pricelist`): cabecera con código, divisa y agrupación de empresas.
   - **Líneas** (`gcom_pricelist_line`): cada línea lleva sus propias fechas de inicio y fin, artículo, VL, unidad, cantidad mínima (para los escalados), precio, precio con IVA, descuentos 1, 2 y 3, descuento en importe y precio recomendado.
   - **Grupo de precios** (`gcom_pricegroup`): lista ordenada de pares (condición → lista de precios), con los campos Orden, Condición, Divisa y Lista precio.
   - El **proveedor** apunta a un grupo de precios en la pestaña Tarifas, campo «Grupo precio».
   - Para descuentos existe la misma estructura (`gcom_discgroup`, `gcom_disclist`, `gcom_disclist_cond`), pero está vacía.
2. **Modelo clásico de tarifas** (`gcomtarh`/`gcomtarl`, `gcomtarc`, `gventarh`): siguen existiendo los objetos y los campos (columna «Precios» del proveedor, «Tarifa precios» de la delegación y Condiciones de tarifados). Sin embargo, **la tabla `gcomtarh` no existe en `tutorial`**, y `gventarh` tampoco. Al abrir esos desplegables sale el error «The specified table (gcomtarh) is not in the database» (captura 30). En esta BD ese modelo está heredado y no funciona.

---

## 1. Listas de precios: `gcom_pricelist`
- Menú: Tarifas › Precios › Listas de precios. Título de la pantalla: «LISTA DE PRECIOS DE COMPRA».
- URL de la rejilla: `.../dispatch/gcom_pricelist` → `/table/gcom_pricelist/list/1`
- **Rejilla** (captura 20). Columnas: Código, Descripción, Divisa, Dependencias, Agrupación empresa, Clasificación, Referencia cliente.
  - COM | COM | EUR | ALL
  - TFCL | Tarifa compras Claude | EUR | ALL (la creó otro agente o una sesión anterior)
- **Ficha COM** (`/table/gcom_pricelist/form/1`). Bloques «Identificación» y «Líneas de lista de precios».
  - **Cabecera** (captura 21): Código* COM, Descripción* COM, Clasificación (vacío), Agrupación empresa* ALL («Holding de todas las sociedades»), Divisa* EUR, Dependencias, Referencia cliente.
  - **La cabecera no tiene fechas de validez ni indicador de IVA incluido.** Las fechas y el precio con IVA están en cada línea.
  - **Líneas** (captura 22): una rejilla editable con las columnas Fecha inicio, Fecha fin, Artículo, VL, Unidad, Cantidad mínima, Precio, Precio con IVA, Descuento 1, Descuento 2, Descuento 3, Descuento importe y Tipo.
    - Ejemplo: 01-01-2000 | 31-12-3000 | CORONA NB1.22.0310.200-2 TTN ISB | VL 0 | UNIDAD | 0,000 | 5,000000.
    - La lista COM tiene más de 20 líneas, todas con unidad UNIDAD y cantidad mínima 0.
    - La lista TFCL tiene una línea: 6000-2RS ISB, del 01-01-2026 al 31-12-2099, a 12,50.
  - **Ficha de línea** (`gcom_pricelist_line`). Se abre en un panel lateral (iframe) al pulsar el número de línea (capturas 23 y 24).
    - Artículo: Fecha inicio* 01-01-2000, Artículo*, VL 0, Unidad UNIDAD (UNI), Estado* Activo, Fecha fin 31-12-3000.
    - Precio: Precio 5,000000, Precio con IVA.
    - Descuentos: Descuento 1 0,000, Descuento 2, Descuento 3, Descuento importe.
    - Cantidad: Cantidad mínima* 0,000. Los escalados se hacen con varias líneas del mismo artículo y distinta cantidad mínima.
    - Precio recomendado: Precio, Descuento, Tipo.
    - Datos de control: ID línea, creado y modificado por, fechas.
  - No hay un campo de «precio neto». La pantalla no lo calcula; se deduce del precio y los descuentos.
  - No hay una unidad caja/palé específica. Se usan el campo «Unidad» (de la lista de unidades) y «VL» (variable logística).
- **Botones de la cabecera:** Copiar (amarillo), Nuevo, guardar, borrar y navegación.
- **Menú ⋮** (cabecera y línea): solo las opciones genéricas Información, Metadata, Imprimir y Exportar. No hay acciones propias.

## 2. Grupos de precios: `gcom_pricegroup`
- Menú: Tarifas › Precios › Grupo de precios. Título: «GRUPO DE PRECIOS DE COMPRAS».
- URL: `.../dispatch/gcom_pricegroup`
- **Rejilla** (captura 25). Columnas Grupo y Nombre. Contenido: 00001 PROVEEDOR, 00003 DISTRIBUIDORA S.L., GCL Grupo precios Claude, GROUP_GEN Grupo en general.
- **Ficha.** Bloque Identificación (Grupo*, Nombre*) y bloque «Listas de grupos de precio» (`gcom_pricegroup_line`, rejilla editable en la propia ficha). Captura 26.
  - Columnas de las líneas: **Orden | Condición | Divisa | Lista precio**.
  - 00001: Orden 400, Condición vacía, EUR, Lista COM.
  - 00003: Orden 400, Condición vacía, EUR, Lista COM.
  - GCL: Orden 1, Condición 1, EUR, Lista «Tarifa compras Claude» (TFCL).
  - GROUP_GEN: sin líneas.
- **Interpretación:** el grupo es el conjunto de tarifas que se aplica a un proveedor. Cada línea dice: «si se cumple la condición X, usa la lista Y», con una prioridad (Orden). Una condición vacía se aplica siempre. Es la evolución de «tarifa de proveedor + tarifa por defecto».

## 3. Condiciones de precios: `gcom_pricelist_cond`
- Menú: Tarifas › Precios › Condiciones de precios. Título: «CONDICIONES DE APLICACIÓN DE PRECIOS».
- URL: `.../dispatch/gcom_pricelist_cond`
- La rejilla está vacía. Columnas Código y Nombre. El formulario de búsqueda solo ofrece Código («Código de condición») y Nombre.
- La condición se referencia desde la línea del grupo de precios (campo «Condición»). No he podido ver la definición interna (si es una expresión SQL o filtros por delegación, artículo o familia) sin abrir «Nuevo», y no lo he hecho. **Pendiente de confirmar.**

## 4. Procesos de precios
- **Gestión de grupos por lista** (`gcom_pricelist_manager`, vtable). Captura 31.
  - Variable: Grupo* (por defecto `*`).
  - Muestra tres bloques: Listas de precios (COM, TFCL), Grupo de precios y los grupos aún no asignados (`gcom_pricegroup_nsel_vtabsel`).
  - Botones: **Eliminar** y **Añadir seleccionados**, para asignar o quitar listas en grupos de forma masiva. No los he pulsado.
- **Copia de listas** (`gcom_pricelist_vtabsel_copy`). Captura 32. Muestra los parámetros sin ejecutar nada.
  - Variables: Divisa*, list_date_start* (por defecto la fecha de hoy) y Código*.
  - Filtros: Código, Agrupación empresa, Clasificación, Descripción, Referencia cliente, Dependencias.
  - Copia listas a una nueva fecha de inicio. Equivale a la «copia de tarifa al año siguiente».
- **Carga de lista de precio** (`gcom_pricelist_doc`). Captura 33. Rejilla de ficheros vacía.
  - Columnas: Número de secuencia, Lista de archivos, Nombre, Fecha, Tipo y Tamaño del archivo, Datos del archivo (adjunto), Estado del archivo (por defecto «Pendiente»), y usuario y fecha de creación y actualización.
  - Se sube un fichero (Excel o CSV) y luego se procesa.
- **Informe `gven_pricelist_art`** («TARIFADO DE VENTAS POR ARTÍCULO», consulta). Filtros: Artículo, Descripción, Código, Clasificación, Fecha inicio y fin, VL, Precio, Descuentos 1 a 3, Descuento importe, Tipo. No lo he ejecutado.
- **Programación de actualización** (`gventara`, «ACTUALIZACIÓN PRECIOS TARIFAS»). Rejilla vacía.
  - Columnas: Identificador, Tipo actualización (por defecto «Valoración»), Tarifa compra, Tarifa venta, Grupo almacenes, Familia, Artículo, Fecha inicio y fin, Margen, Tolerancia actualización, Unidad y tipo de intervalo (Meses), Estado y auditoría.
  - Sirve para recalcular la tarifa de venta a partir de la de compra más un margen.
  - No tiene captura: la emulación de pantalla dio un render duplicado.

## 5. Descuentos
- `gcom_discgroup` («GRUPOS DE DESCUENTO»): columnas Grupo y Nombre. **Vacío.**
- `gcom_disclist` («LISTA DE DESCUENTOS»): columnas Código, Descripción, Divisa, Agrupación de empresas, Clasificación. **Vacío** (captura 27).
- `gcom_disclist_cond` («CONDICIONES DE APLICACIÓN DE DESCUENTOS»): columnas Código y Nombre. **Vacío.**
- `gven_disc_type` («CONCEPTOS DE DESCUENTOS»): columnas Código, Nombre, Descripción, Concepto contable. **Vacío.**
- La estructura es la misma que en precios: grupo de descuento → (condición → lista de descuentos). El proveedor tiene el campo «Grupo descuento».

## 6. Condiciones de tarifados: `gcomtarc` (modelo clásico)
- Menú: Tarifas › Condiciones comerciales › Condiciones de tarifa. Título: «CONDICIONES DE TARIFADOS». Rejilla editable y vacía (capturas 28 y 29).
- Columnas:
  - **Ámbito:** Empresa, Tabla, Tipo documento, Clasificación, Fecha inicio, Fecha fin, Hora inicio, Hora fin, **Prioridad**, Tercero, Dirección, Delegación, Departamento, Clasificación del proveedor.
  - **Resultado:** **Tarifa precios**, **Descuentos generales**, **Descuentos familias**.
- Valores del desplegable «Tabla»: Ofertas compras, Solicitudes compras, Acuerdos compras, Pedidos compras, Albaranes compras, Facturas compras, Planes de recepción.
- Es la tabla que, en el modelo clásico, **decide qué tarifa se aplica según el documento, el proveedor, la delegación, la fecha y la hora, por orden de Prioridad.**
- El desplegable «Tarifa precios» apunta a `gcomtarh`, que **no existe** en `tutorial` (error ID 14813, captura 30).

## 7. Asignación al PROVEEDOR: `gproveed`
- Encontrado con la búsqueda global «proveedor» → «MAESTRO DE PROVEEDORES» (`gproveed`). `gcomproveed` da 404.
- La búsqueda también devuelve informes `gcomtarh_artprov`, `gcomtarh_provart` y `gcomtarh_proveed` («TARIFAS DE COMPRAS POR PROVEEDORES…»), que son del modelo clásico.
- **Rejilla** (capturas 34 y 35). Columnas con datos de tarifa: Descuento comercial 1, 2 y 3, % Pronto pago, **Precios**, Descuentos familia, Descuentos generales, Rápeles y Fabricante.
  - 00001 PROVEEDOR y 00003 DISTRIBUIDORA tienen Precios = COM.
  - El enlace de «Precios» lleva a `dispatch/gcomtarh?tarpre=COM`, es decir, a la tarifa clásica. Como esa tabla no existe en `tutorial`, el enlace falla.
- **Ficha 00001**, pestaña **Tarifas** (captura 36): Descuentos generales, Rápeles, **Grupo precio = PROVEEDOR (00001)**, Descuentos familia, Fabricante [x], **Grupo descuento**.
  - En la ficha no aparece el campo «Precios» (tarpre); solo se ve en la rejilla.
- **Datos financieros:** Descuento comercial 1, 2 y 3, % Pronto pago, Divisa EUR, Mínimo pedido, Importe tolerancia, % tolerancia, % Royalty, Portes, Redondeo.
- **Menú ⋮:** solo las opciones genéricas. Botones Validar y Nuevo, que no he pulsado.

## 8. Asignación a la DELEGACIÓN: `gdelegac`
- «MAESTRO DE DELEGACIONES». **Rejilla** (captura 37). Columnas de tarifa: Tarifa precios, Tarifa descuento, Descuentos familia.
  - 0 CENTRAL: sin tarifa.
  - DIS001 DIS CENTRAL (empresa DIS): Tarifa precios = **TV**.
- **Ficha DIS001**, pestaña **Condiciones comerciales** (captura 38): Tarifa precios TV, Tarifa descuento, Descuentos familia, Grupo de Tarifa (desplegable vacío, «Datos no disponibles»).
  - En Identificación aparecen también «Catálogo de artículos» y «Catálogo de precios», ambos vacíos.
  - Hay una subpestaña «Tarifas precios», deshabilitada.
- El desplegable «Tarifa precios» de la delegación lanza el error «The specified table (gventarh) is not in the database». Por tanto, es la **tarifa de VENTA clásica**.
- **En la delegación no hay un campo de tarifa o grupo de precios de COMPRA del modelo nuevo.** La herencia «si no hay tarifa específica, se aplica la de la delegación» del modelo antiguo solo se ve aquí para venta, y con el modelo clásico.

## 9. Permisos para editar precios
No he encontrado ningún indicador del tipo «modificar precio» o «precio editable».
- **Tipo de pedido `gcompedd` (PC «PEDIDO COMPRA»)** (capturas 39a y 39b). Lo relacionado con precios es:
  - Valoración: Fecha valoración = Documento; Descuentos especiales off («Aplica descuentos especiales»); **Valorar ON** («Valorar económicamente el pedido»); **IVA incluido off**.
  - Indicativos: **Insertar Tarifa off** («Agrega el artículo a la tarifa asignada al proveedor»), Insertar Catálogo, Acuerdos («Buscar acuerdos con fechas y condiciones similares»), Validar catálogo (Delegación, Departamento, Almacén o No).
  - Impuestos: Calcular Impuestos ON.
  - **Campos a ocultar** en las líneas del pedido: Precio con IVA, % Dto. 1, 2 y 3, Importe dto., Unidad precios, entre otros (casi todos marcados). Sirve para **ocultar** columnas por tipo de documento, pero no para bloquear la edición del precio.
- No he revisado usuarios ni roles. La edición por perfil se controlaría con permisos u ocultaciones de objeto o columna del diccionario, que no se ven desde estas pantallas.

## 10. Orden de búsqueda del precio
- El ERP no muestra en pantalla un orden documentado. Lo que se deduce:
  - Modelo nuevo: proveedor → **Grupo precio** → líneas del grupo por **Orden** ascendente (GCL usa 1; 00001 y 00003 usan 400), filtrando por **Condición** y **Divisa** → **Lista de precios** → línea vigente por **fecha inicio/fin** del artículo, VL y unidad, con la **cantidad mínima** más alta que no supere la cantidad pedida (escalado).
  - Modelo clásico: `gcomtarc` con **Prioridad** por documento, tercero, delegación, departamento, clasificación y franja de fecha y hora.
- **Pendiente:** confirmar el algoritmo con la ayuda del objeto o el código, porque no se ve desde la interfaz.

## Capturas
| Nº | Fichero | Contenido |
|---|---|---|
| 20 | 20_listas_precios_rejilla.png | Rejilla `gcom_pricelist` |
| 21 | 21_lista_precios_COM_cabecera.png | Cabecera de la lista COM |
| 22 | 22_lista_precios_COM_lineas.png | Líneas de la lista COM |
| 23 | 23_linea_precio_articulo.png | Ficha de línea: artículo y fechas |
| 24 | 24_linea_precio_precio_descuentos.png | Ficha de línea: precio y descuentos |
| 25 | 25_grupos_precios_rejilla.png | Rejilla `gcom_pricegroup` |
| 26 | 26_grupo_precios_00001_listas.png | Grupo 00001: Orden, Condición, Divisa, Lista |
| 27 | 27_listas_descuentos_rejilla_vacia.png | `gcom_disclist` vacía |
| 28 | 28_condiciones_tarifa_gcomtarc_cols1.png | `gcomtarc`, columnas 1 |
| 29 | 29_condiciones_tarifa_gcomtarc_cols2.png | `gcomtarc`, columnas 2 (tarifa y descuentos) |
| 30 | 30_gcomtarc_error_gcomtarh_no_existe.png | Error: `gcomtarh` no existe |
| 31 | 31_gestion_grupos_por_lista.png | `gcom_pricelist_manager` |
| 32 | 32_copia_listas_parametros.png | Parámetros de la copia de listas |
| 33 | 33_carga_lista_precio_ficheros.png | Carga de lista desde fichero |
| 34 | 34_proveedores_rejilla.png | Rejilla de proveedores |
| 35 | 35_proveedores_rejilla_precios_descuentos.png | Proveedores: Precios y descuentos |
| 36 | 36_proveedor_00001_pestana_tarifas.png | Proveedor 00001, pestaña Tarifas (Grupo precio) |
| 37 | 37_delegaciones_rejilla_tarifas.png | Rejilla de delegaciones con tarifas |
| 38 | 38_delegacion_DIS001_condiciones_comerciales.png | DIS001, Condiciones comerciales |
| 39a | 39a_tipo_pedido_PC_valoracion.png | Tipo de pedido PC, Valoración |
| 39b | 39b_tipo_pedido_PC_insertar_tarifa.png | Tipo de pedido PC, Insertar Tarifa |
