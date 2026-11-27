# Análisis del vídeo v2 «Tarifas y documentos de compra en el sistema» — TRAMO 1 (00:00–21:30)

Fuentes: `media/v2_tarifas/tramo1.txt` y fotogramas f_00001–f_00130 (segundo = (N-1)*10). Revisados los 130 fotogramas en mosaicos de 4 (cada mosaico = 40 s) y ampliados los dudosos. Coordenadas de recorte sobre 1680x1048 (el fotograma original medido en mosaico tiene 1000 px de ancho, factor 1,68).

Datos de contexto leídos en pantalla: ERP **Deister** (Axional), entorno «**O&S Learning (Test)**» (`dbms=learning`, servidor `212.36.72.159`), usuario `<usuario> [sws100]`, Chrome en Windows 7, reloj 11/12/2015. Es la **continuación** del vídeo v1 (mismo entorno, mismos datos de demo: empresa 03 «VEHICULOS A MOGOLLON S.A.», tercero/tarifa `G00003`, artículo COCHE A6). Se graba con Camtasia; **hay un corte**: el reloj de Windows pasa de 11:33 (s990) a 12:04 (s1020), es decir ~31 min de pausa.

## 1. Resumen en 5 líneas
1. Continúa el tema «dónde se asigna la tarifa»: en el **maestro de delegaciones** (delegación TGN «ALMACEN TARRAGONA») se puede fijar una tarifa de **venta** (no de compra); jerarquía: primero la del cliente, si no tiene, la de la delegación.
2. La tarifa de **compra** se asigna al **proveedor** (pestaña Proveedores › Datos económicos › «Tarifa precios»); se demuestra cambiando el proveedor P00001 SEAT de la tarifa `COMPRA` a `G00003`.
3. Larga digresión (≈ 6 min, 10:00–15:26) sobre política de precios: precio pactado en el pedido o precio precargado de la tarifa, permisos por usuario, actualización de tarifas por rangos de fecha, figura del jefe de compras, rappels.
4. Vuelta al circuito de documentos: abre Compras › Maestros › Documentos › Pedidos, intento fallido (timeout, corte de grabación) y después la pantalla «TIPOLOGÍA DE PEDIDOS DE COMPRAS» con los tipos `PC` y `PC2`.
5. Explica la **serie** del tipo de pedido (`PC-`) y abre «SERIES DE JUSTIFICANTES»: numerador, justificación con ceros (6 → PC-000001), excluir separador y control cronológico; el tramo termina a media frase en el control cronológico.

## 2. Tabla de bloques

| # | Inicio–fin | Tema | Valor didáctico | Qué se ve |
|---|---|---|---|---|
| 1 | 00:00–00:58 | Maestro de delegaciones: abrir la delegación TGN y repasar su ficha | Medio | Formulario «MAESTRO DE DELEGACIONES» vacío (f1–f3, s0–20), listado (f4, s30) y ficha de TGN (f5, s40) |
| 2 | 00:58–02:14 | «Condiciones comerciales» de la delegación: tarifa de venta, no de compra; tabla equivalente de ventas | Alto | Ficha TGN estática; ratón sobre «Tarifa precios»; lookup «TARIFAS DE PRECIOS DE VENTAS (DEFINICIÓN)» (f9, s80); vistazo a la tarifa de compra G00003 (f10, s90) |
| 3 | 02:14–05:43 | Jerarquía cliente > delegación; delegación obligatoria; una sola tarifa de venta para todos | Alto (concepto, sin demostración) | Pantalla casi fija en TGN; ratón en «Tarifa precios», «Tarifa descuento», «Descuentos familia» (f13–f33, s120–320) |
| 4 | 05:43–07:05 | La compra se tarifa a nivel proveedor (el proveedor impone el precio) | Alto (concepto) | Pestaña «TARIFAS DE PRECIOS DE COMPRAS» con G00003; ratón sobre pestaña «Proveedores» (tooltip «MAESTRO DE PROVEEDORES») (f34–f40, s330–390); vuelta a delegación (f41, s400) |
| 5 | 07:05–08:43 | Asignar tarifa al proveedor P00001 SEAT: Proveedores › Datos económicos › Tarifa precios = G00003 | Alto (única demostración de campo) | Nueva pestaña `servlet/jrep?code=ctercero`, listado TERCEROS, ficha P00001, MAESTRO DE PROVEEDORES, lookup de tarifas (f42–f48, s410–470) |
| 6 | 07:55–11:29 | Proveedor sin tarifa; precio pactado en el pedido; precarga de tarifa; permisos por usuario; actualizar tarifa por fechas | Alto en fondo / bajo en imagen | Ficha del proveedor estática (f48–f62, s470–610) y luego tarifa G00003 estática (f63–f93, s620–920) |
| 7 | 11:29–15:26 | Digresión de organización: jefe de compras, rappels, riesgo de concentración de proveedores, especialista de ventas | Bajo (divagación) | Misma pantalla de la tarifa G00003 sin cambios |
| 8 | 15:26–15:57 | Cierre del tema tarifas («COCHE A6 a 2000 por unidad; lo veremos en el pedido») y vuelta al circuito | Medio (puente) | Tarifa G00003; el escritorio con el menú Maestros/Compras (f95–f96, s940–950) |
| 9 | 15:57–17:16 | Abrir Compras › Maestros › Documentos › Pedidos; intento fallido y corte | Ruido (con una ruta de menú útil) | Menú contextual sobre «Pedidos» (f97), carga en blanco, Camtasia Studio, `ERR_CONNECTION_TIMED_OUT` (f97–f102, s960–1010); reloj salta a 12:04 |
| 10 | 17:16–17:59 | Maestro «TIPOLOGÍA DE PEDIDOS DE COMPRAS»: tipos `PC` y `PC2` | Alto | Listado con 2 filas (f106–f108, s1050–1070) y ficha de `PC` (f109, s1080) |
| 11 | 17:59–19:13 | Código de tipo, nomenclatura y campo «Serie» (PC-) | Alto | Ficha PC; cursor en Tipo pedido, Descripción y Serie (f109–f115, s1080–1140) |
| 12 | 19:13–21:30 | Tabla de series de justificantes: numerador, justificación (6 → PC-0000001), excluir separador, control cronológico | Alto | Lookup «SERIES DE JUSTIFICANTES» (f116, s1150) y ficha de la serie PC- (f117–f130, s1160–1290) |

## 3. Detalle por bloque útil

### Bloques 1–3 (00:00–05:43) Tarifa de venta en la delegación

- **Pantallas**
  - Pestaña del navegador «MAESTRO DE DELEGACIO…» (URL `servlet/jrep?code=gdelegac&user=<usuario>&dbms=learning`; después `coreapps/wic_iges/formauto_s_lite.jsp?code=gdelegac…&ppos=11`).
  - Formulario de búsqueda vacío (f1–f3) con botones inferiores (atrás, adelante, ayuda, «Visualizar documento» —tooltip en f2—). f4: listado con columnas ID, Identificador delegación, Delegación, Descripción, Empresa, Descripción, Agrupación, Descripción, Fecha cierre, Departamento, Descripción, Catálogo de artículos, Descripción, Tercero, Nombre, Dirección, Dirección, Código postal, Población, Teléfono, Teléfono 2, Fax (la fila aún está cargando).
- **Ficha «MAESTRO DE DELEGACIONES» (f5 en adelante)**
  - Pestañas superiores: «Delegaciones», «Autorizaciones», «Departamentos», «Almacenes-delegación», «Catálogos», «Tarifas precios» (esta última atenuada).
  - Bloque «Identificación»: Delegación `TGN` + `ALMACEN TARRAGONA`; Empresa `03` (`VEHICULOS A MOGOLLON S.A`); Agrupación `ALL`; Departamento (vacío); Catálogo de artículos (vacío); Catálogo de precios (vacío).
  - Bloque «Estado»: Estado `Activo`; Fecha alta `10-12-2015`; Fecha baja (vacía); Fecha cierre `01-01-3000`; Referencia numérica.
  - Pestañas «Dirección | Información auxiliar»: Tercero `G00003` (`VEHICULOS A MOGOLLON S.A.`); Dirección `ACTGN`; País `ESP`/Spain; Población `43002` Tarragona; Provincia `43` Tarragona; Teléfono; Teléfono 2; Fax; E-Mail.
  - **«Condiciones comerciales»**: **Tarifa precios**, **Tarifa descuento**, **Descuentos familia** (los tres vacíos en TGN). A su derecha pestañas «Logística | Imagen»: Stock (casilla), Tipo retractilado.
  - Rejillas inferiores: «Delegaciones» (11: `D03E` «DEL. VEHÍCULOS LAS PALMAS», empresa 03, agrupación ALL, Activo, tercero G00003, dirección FV; 12: `TGN` «ALMACEN TARRAGONA», dirección ACTGN; columnas Tarifa precios, Tarifa descuento, Descuentos familia, Stock, Fecha cierre, Fecha alta, Fecha baja; «Página 3 de 3», «View 11 - 12 of 12»), «Departamentos» (DEPARTAMENTO [0], proyecto ADM001), «Almacenes-delegación», «Jerarquías».
  - Botones inferiores: «Validar», «Copiar».
- **Lookup «TARIFAS DE PRECIOS DE VENTAS (DEFINICIÓN)» (f9, s80)**: ventana emergente con columnas ID, Tarifa, Descripción, Fecha inicio, Fecha fin, Divisa. Filas: `VENTA` «TARIFA VENTA» 01-04-2015–31-08-2015 EUR; `VENTA02` «TARIFA VENTA LAVADORA» 01-04-2015–31-08-2015 EUR; `VENTA02B` «VENTA ARTICULOS DESCUENTOS» 01-04-2015–30-09-2015 EUR. Aparece al pulsar el desplegable de «Tarifa precios» (el ratón pasa por el campo en f6–f8); no se selecciona ninguna.
- **Pasos**
  1. Abrir el maestro por URL (no se ve el menú) y listar.
  2. Abrir la delegación TGN.
  3. Señalar «Condiciones comerciales» y abrir el lookup de tarifas de ventas (s80).
  4. Saltar a la pestaña del navegador de la tarifa de compra G00003 (s90) para comparar «lo que veíamos antes» y volver.
  5. Quedarse en la ficha mientras habla (s100–320), moviendo el ratón por Tarifa precios, Tarifa descuento y Descuentos familia.
- **Conceptos y reglas de negocio**
  - La delegación es **una de las posibilidades** de asociar una tarifa; en las condiciones comerciales de la delegación solo se define tarifa de **venta** (no de compra). El ponente corrige un error propio: «tenía en la cabeza que se podían poner los dos y no es correcto».
  - Existe la tabla de tarifas de **venta** con la misma estructura que la de compra.
  - **Prioridad de aplicación en ventas**: cuando se vende desde una delegación, el sistema mira **primero la tarifa de venta del cliente**; si el cliente no tiene, aplica la de la **delegación**.
  - Caso típico: política de venta única para todos los clientes → una sola tarifa a nivel de delegación; un cliente importante con condiciones propias → tarifa de venta en su ficha de cliente.
  - **Toda venta se hace desde una delegación** (es obligatorio indicarla); toda empresa tiene como mínimo una delegación y un departamento; con una sola sede, empresa y delegación coinciden incluso en código («tienen el mismo código pero tengo los dos campos»). Al abrir una segunda delegación hay que definir la tarifa en cada una (puede ser la misma).
  - La tarifa es un **combinado**: tarifa de precios + tarifa de descuentos + descuentos por familia (los tres campos están en la ficha); además la propia tarifa puede llevar descuentos.
- **Dudas y divagaciones**
  - Pregunta de un asistente «¿De compra sí, de venta?» respondida «de venta» (2:14–2:29).
  - Se dice que el cliente tiene «una tarifa de venta» pero no se enseña la ficha de cliente.
  - La frase «Tarifa de precios, tarifa precios de ventas, ¿vale? En Heaven Tarache» (01:35) es ininteligible; probable error de Whisper (no coincide con nada de la pantalla).
  - El maestro de delegaciones no se abre por menú; solo se ve la URL. El campo «Catálogo de precios» (vacío, bloque Identificación) no se menciona y puede confundirse con «Tarifa precios».

### Bloque 4 (05:43–07:05) La compra se tarifa por proveedor

- **Pantalla**: se vuelve a la pestaña «TARIFAS DE PRECIOS DE COMPRAS» (URL `coreapps/wic_iges/formauto_s.jsp?code=gcomtarh…`, cabecera «gcomtarh: 2, total: 2»), tarifa `G00003`.
  - Pestañas superiores «Tarifas precios | Proveedores» (f34, s330 con tooltip «MAESTRO DE PROVEEDORES» al pasar sobre «Proveedores»; la barra de estado muestra `servlet/jrep?code=gproveed… cond=gproveed.tarpre = 'G00003'`, es decir, el enlace lista los proveedores que usan esa tarifa); subpestañas «Líneas | Desglose descuentos tarifa».
  - Identificación: Tarifa `G00003` «VEHICULOS A MOGOLLON S.A.»; Divisa `EUR`; Descuentos (casilla); Clasificación; Referencia; Fecha inicio `01-04-2015`; Fecha fin `01-01-3000`.
  - «Parámetros de aplicación»: Prioridad `0`; Lunes a Domingo marcados (los 7 días).
  - «Datos de control»: Identificador tarifa `2`; Usuario alta `<usuario>`; Fecha alta 10-12-2015 13:38:05; Usuario modificación `<usuario>`; Fecha modificación 10-12-2015 13:44:10.
  - Rejilla «Vista»: 1 `COMPRA` «TARIFA COMPRA» (31-08-2015); 2 `G00003` «VEHICULOS A MOGOLLON S.A.» (01-01-3000).
  - Rejilla «Líneas»: COCHE A6, VLP 0, Unidad `UNI`, 01-04-2015 a 01-01-3000, Precio `2.000,000000`, Precio unitario `2.000,000000`, Descuento tarifa `0,0000`, Descuento comercial `0,0000`, IVA incluido, Precio neto, %Bonificación `0,0000`.
  - Botón inferior: «Copiar».
- **Conceptos**
  - En compras el precio **lo pone el proveedor**: no tiene sentido una tarifa de compras por delegación porque «estoy presuponiendo que todos los que me venden se van a plegar a mis condiciones».
  - Cada proveedor aporta su propia tarifa de venta, que para la empresa es su **tarifa de compra**. Al hacer el pedido a un proveedor u otro, el sistema propondrá precios distintos y la empresa decide a quién compra «en función de las condiciones y muchas cosas».
  - Matiz expositivo: «cuando empiezan un poco al revés»: en compras se define primero el proveedor y luego el precio, pero en el sistema se define la tarifa y se asocia a proveedores.
- **Dudas**: en la imagen el ponente no muestra la lista de proveedores del enlace; solo pasa el ratón (s330–390).

### Bloque 5 (07:05–08:43) Asignar tarifa de precios a un proveedor

- **Ruta**: no hay menú; se teclea la URL `servlet/jrep?code=ctercero&user=<usuario>&dbms=learning` en una pestaña nueva (f42, s410).
- **Pantallas y pasos**
  1. Pestaña «Cargando…» → formulario «TERCEROS» con «Realizando consulta…» (f43, s420).
  2. Listado «TERCEROS» (f44, s430): columnas Tercero, Nombre, Nombre auxiliar, Identificación fiscal, Empresas operacionales, Tipo, Descripción, Actividad, Clasificación, Cargo, Estado, Grupo, Holding. Filas: B00001 BANCO PRUEBA (BNC); C00001 CAJA MALA (CAJ); G00001 ADMINISTRACION Y GESTION LA VIUDA ALEGRE (EMP); G00002 NEVERAS FRIAS (EMP); G00003 VEHICULOS A MOGOLLON S.A. (EMP); K00001 JAUMET DE LA SERRA … K00014 Hamburguesas Celestina (CLI); P00001 SEAT (PRO, PROVEEDORES). «Páginas resultantes: 1».
  3. Ficha «Terceros» de `P00001` SEAT (f45, s440): pestañas «Relaciones, Clientes, **Proveedores** (tooltip «MAESTRO DE PROVEEDORES»), Domicilios, Condiciones, Direcciones, Referencias, Asociaciones, Clasificaciones, Características»; fila 2 «Autorizaciones…, Documentos, Notas, Organigrama, Situación global». Se hace clic en «Proveedores».
  4. **«MAESTRO DE PROVEEDORES»** (`code=gproveed`, cond `gproveed.codigo = 'P00001'`) (f46, s450): pestañas «Proveedores | Terceros | Tarifas precios | Descuentos generales | Situación de proveedores» y «Autorizaciones, Destinos, Artículos por proveedor, Almacenes, Notas». Campos: Proveedor `P00001` SEAT; Grupo; Federación; Comercial `P00001`; Fecha alta 14-04-2015; Agrupación empresas `L01`; «Información general»: Tipo proveedor `PRO`, Clasificación, Password web, Validar catálogo, Pedidos parciales ✓, Estado de gestión, Estado `Activo`, Bloqueo `0`, Workflow; «Logística | Auxiliares | Impresión»: Transportista, Depósito, Tipo transporte, Plazo entrega `0`, Días demora `0,00`, Calidad ✓, Certificación ISO, Sector transporte; «Central de pagos»/«Central de compras»; «Facturación»: Modalidad autofacturación `No autofacturable`, Agrupación albaranes `Tercero y más campos`, Tercero facturación `P00001`, Dirección facturación `0`.
  5. **«Datos económicos»**: Portes `Debidos`; Divisa `EUR`; Redondeo; Descuento comercial `0,000`; Descuento pronto pago `0,000`; Tarifas fabricante ✓; **Tarifa precios** `COMPRA` → **`G00003`**; **Tarifa descuentos**; **Tarifa descuentos familia**; Mínimo pedido `0,00`; % Royalty `0,00`.
  6. Lookup «TARIFAS DE PRECIOS DE COMPRAS (DEFINICIÓN)» (f47, s460): filas 1 `COMPRA` «TARIFA COMPRA» 01-04-2015–31-08-2015 EUR; 2 `G00003` «VEHICULOS A MOGOLLON S.A.» 01-04-2015–01-01-3000 EUR.
  7. Resultado (f48, s470): Tarifa precios = `G00003`; «Datos de control» con Usuario modificación `<usuario>`, **Fecha modificación 11-12-2015 11:22:16** (antes 15-04-2015 16:33:03), lo que indica que se ha grabado (no se ve el clic en «Validar»).
  8. Rejilla inferior «Condiciones según destino» (Delegación, Dirección, Agente, Divisa, Tarifa Precios, Tarifa Descuento, Tipo Efecto, Forma Pago, % Descuento general, % Descuento pronto pago, Transportista, Mínimo Pedido, Portes): visible pero no comentada.
- **Conceptos**
  - En el proveedor, pestaña «Proveedores», en «Datos económicos» se define «la tarifa de precios que me aplica».
  - Si el proveedor **no tiene tarifa** y se hace el pedido, **el sistema no propone precios**: el usuario tiene que informarlos en el propio pedido (07:55–08:15).
- **Dudas y errores**
  - El ponente dice que «ahora le he puesto la tarifa que teníamos ahí puesta» (08:43): la imagen confirma el cambio COMPRA → G00003, pero **el proveedor SEAT recibe una tarifa cuyo código y descripción son los de la propia empresa** (tercero G00003 = empresa 03 «VEHICULOS A MOGOLLON S.A.»). Es un dato de demo incoherente que puede confundir a un alumno.
  - Whisper repite dos veces «Y ahora mismo, este es un proveedor… ¿Vale?» (06:31 y 07:05): el segundo segmento es un eco; el silencio entre 07:05 y 07:55 corresponde a la navegación (~50 s de carga).

### Bloque 6 (07:55–11:29) Política de precios en el pedido (fondo importante, imagen estática)

- **Pantalla**: ficha del proveedor P00001 con Tarifa precios G00003 (s470–610, reloj 11:24–11:26), luego pestaña de la tarifa G00003 con el ratón sobre «Fecha fin» de la fila 2 de «Vista» (s620–930).
- **Reglas y ejemplos explicados**
  - **Doble posibilidad en el pedido**: (a) el sistema **precarga** el precio de la tarifa del proveedor al cargar la línea («me tendría que traer el precio que me viene de la tarifa»; se comprobará cuando se haga el pedido), o (b) el usuario pacta otro precio y lo **machaca** en el pedido (ejemplo: «¿A 2.000? No… 1.800. Venga, va. A 1.800»).
  - **Permisos por usuario**: se puede controlar por usuario si se puede tocar el precio o no. Administrativo de compras = no puede modificar la tarifa; responsable de compras / «Juan Palomo» (hace todo él) = permisos totales.
  - **Mantenimiento de tarifas**: otra persona llama semanalmente a proveedores («¿cuánto tienes ahora el coche A6? A 2.000») y actualiza la tarifa **por rangos de fecha** («hasta ayer valía tanto, a partir de mañana y hasta la semana que viene vale tanto»), con respaldo de correos de aprobación; así los administrativos reciben las tarifas ya actualizadas.
  - **Modelo alternativo**: empresas sin tarifas precreadas; se llama a varios proveedores, se elige el más barato y se rellena el pedido a mano (precios incluidos), se cierra, imprime, envía por correo, espera el OK y la mercancía para hacer el albarán.
- **Errores de transcripción**: «Voy a pre-crear tarifas, olvídate de las tarifas» (11:09) = «¿pre-crear tarifas? Olvídate de las tarifas»; «cortatisas» = «cortapisas»; «al barán» = «albarán».

### Bloque 7 (11:29–15:26) Digresión organizativa (valor bajo)

- Contenido: los administrativos frente al **jefe de compras**; compras puntuales frente a negocio basado en comprar al mínimo coste; análisis de volúmenes y **reparto entre proveedores para minimizar el riesgo** (si todo se compra a uno que cierra, los demás suben los precios); especialista de ventas / director general; **rappels** («si a lo largo del año te compro más de 3.000 unidades me haces un 5 % a posteriori»), que están por encima del pedido y se pactan en la relación anual, idem con clientes (descuento a final de año).
- **Mensaje clave del ponente (14:45–15:26)**: «tenemos tablas para aburrir» y las tarifas de compra se pueden gestionar de 50 maneras; lo que hay montado en el ejemplo es lo más sencillo: tarifa de compra con la tarifa de VEHICULOS A MOGOLLON, con el A6 a 2.000 por unidad; «veremos cuando hagamos el pedido si esto nos aparece».
- **Pantalla**: sin cambios (tarifa G00003, s690–930). No hay ningún elemento de pantalla que mostrar.

### Bloque 8–9 (15:26–17:16) Vuelta al circuito de documentos: menú y corte

- **Ruta de menú literal (f95–f96, s940–950, desktop `webOS/desktop/appinfo.jsp?dbms=learning`)**: panel izquierdo «O&S Learning (Test)» con «Inicio», caja «Go!», casilla «Utilizar una única ventana». Secciones: Finanzas, Compras, Ventas, Logística, Producción, Análisis, Presupuestos, **Maestros** (Terceros, Artículos, Contabilización, Parametrización › Errores / Configuración, Auxiliares, Biblioteca; tooltip «Configuración» en f95).
  - **Compras** › Concursos, Ofertas, Formularios, Solicitudes, Acuerdos, **Pedidos**, Albaranes, Facturas, Anticipos, Importaciones, Informes, **Maestros** › **Tarifas**, **Documentos** › Concursos, Ofertas, Formularios, Solicitudes, Acuerdos, **Pedidos**, Albaranes, Facturas, Anticipos, Clasificaciones, Bloqueos/Autorizaciones (se ven en f105 con tooltip «Albaranes»).
- **Pasos**: abre Compras (f96), despliega Maestros › Documentos y hace clic derecho sobre «Pedidos» (menú contextual de Chrome «Abrir enlace en una pestaña nueva…», f97, s960). Se abre pestaña `servlet/jrep?code=gcompedd` («Cargando…», f98–f99) que no llega a mostrarse; se ve **Camtasia Studio** (f100, s990, «Record the screen») y el reproductor de Camtasia Recorder (f101–f102) con la pestaña mostrando **«Esta página web no está disponible» (ERR_CONNECTION_TIMED_OUT)**. Después el reloj salta a 12:04 y el menú vuelve a aparecer (f103–f104, s1020–1030) con Compras › Maestros › Documentos desplegado y la lista completa hasta «Bloqueos/Autorizaciones».
- **Transcripción**: de 15:57 a 17:16 la voz dice «vamos a centrarnos en los pedidos… vamos a dar a un vale vale volvamos a los tipos de documento»: es el punto del corte/segunda toma. **Esta parte conviene cortarla**.
- **Conceptos**: en Compras › Maestros › Documentos están «todos los posibles tipos de documento»; se tratan pedido → albarán → factura.

### Bloque 10 (17:16–17:59) Tipología de pedidos de compras

- **Ruta**: Compras › Maestros › Documentos › **Pedidos** → pestaña «TIPOLOGÍA DE PEDIDOS DE COMPRAS» (código `gcompedd`, URL `servlet/jrep?code=gcompedd…`).
- **Pantallas**
  - Formulario de búsqueda (f106, s1050): bloques «Identificación» (Tipo pedido, Descripción, Serie, Pedido relacionado, Estado), «Documento origen | Solicitud origen» (Tabla origen, Actualización tabla origen, Copia línea origen, Condición selección), «Valoración», «Facturación interempresa» (Pedido venta), «Indicativos | Impresión de documentos», «Logística», «Datos generales | Campos a ocultar», «Información adicional», «Datos de control».
  - Listado (f107–f108, s1060–1070): columnas ID, Tipo pedido, Descripción, Serie, Tabla origen, Actualización tabla origen, Copia línea origen, Enlazar solicitud, Actualización solicitud origen, Condición solicitudes, Pedido venta, Valorar, Fecha valoración, Devolución, Tesorería, Tipo reserva… Filas: `PC` «Pedido de Compra» serie `PC-` (Tabla origen «Ninguna», Valorar ✓, Fecha valoración «Documento»); `PC2` «Pedido de Compra» serie `PC2-`.
  - **Error visible en pantalla (f107, s1060)** bajo la lista: «deister.webstudio.core.jsql.jrep.JRepException: Application is trying to read data from row 3 and does not exist. Total rows in buffers are 2. Physical rows in recordset are 2». Desaparece en f108.
- **Concepto**: «aquí tenemos definidos ya dos tipos de pedidos de compra»; se detallarán las posibilidades del tipo de pedido.

### Bloque 11 (17:59–19:13) Ficha del tipo de pedido PC y serie

- **Ficha «TIPOLOGÍA DE PEDIDOS DE COMPRAS» (f109, s1080), `formauto_s_lite.jsp?code=gcompedd`**
  - Identificación: Tipo pedido `PC`; Descripción `Pedido de Compra`; **Serie `PC-`**; Pedido relacionado; Estado `Activo`.
  - «Documento origen»: Tabla origen `Ninguna`; Actualización tabla origen `NULL`; Copia línea origen `NULL`; Condición selección.
  - «Valoración»: Fecha valoración `Documento`; Valorar ✓; Descuentos especiales; IVA incluido; Anticipos `No`; Tipo de anticipo; Tipo presupuesto. «Facturación interempresa»: Pedido venta.
  - «Indicativos»: Tipo `Normal`; Validar catálogo `No`; Compromiso inversión `Sí`; Devolución, Tesorería, Datos contables, Dirección artículos/almacén, Estadísticas, Histórico (casillas sin marcar). «Logística»: Tipo reserva, Tipo de propuesta, Stock planificado `No`, Consistencia reservas, Alternativos.
  - «Datos generales»: Circuito, Tipo ADO, Tipo característica, **Tipo workflow `PCW01` («Workflow Departamental»)**. «Información adicional». «Datos de control»: Usuario alta `<usuario>`, Fecha alta 15-04-2015 11:27:40, Usuario modificación `<usuario>`, Fecha modificación 20-04-2015 10:24:27. Secciones «Workflow» y «Docflow» más abajo (no se abren).
- **Pasos**: se sitúa el cursor en «Tipo pedido» (s1090–1110), «Descripción» (s1110) y «Serie» (s1120–1140).
- **Conceptos y reglas**
  - Un tipo de pedido lleva siempre un **código** y una **tipología** pensados para «clarificar al máximo los circuitos que va a representar»; si hay varios tipos de pedido por condicionantes diferentes, se refleja en la **nomenclatura** del código.
  - Al generar un documento el sistema le da **por defecto un número basado en la serie fijada en la tipología**.
- **Dudas**: «las series… no sé si os ha salido ya» (la serie no se explicó en el vídeo anterior). No se explican otros campos de la ficha (Valoración, Indicativos, Workflow); el ponente solo anuncia «vamos a detallar las funcionalidades» y se centra solo en la serie.

### Bloque 12 (19:13–21:30) Series de justificantes

- **Ruta**: ficha del tipo de pedido › campo «Serie» (icono de lookup) › ventana «SERIES DE JUSTIFICANTES» (código `cserjush`).
- **Pantallas**
  - Lookup (f116, s1150, reloj 12:07): columnas ID, Tabla, Serie, Descripción. 9 filas, todas «Pedidos de compras»: `15#0401PC-` «Copy from mask [yy#mm#e] + serie [PC-]»; `1501PC-` «Copy from mask [yy#e] + serie [PC-]»; `1501PC2-` «… serie [PC2-]»; `1502PC-`; `1503PC-`; `150401PC-` «Copy from mask [yymm#e] + serie [PC-]»; `151201PC-`; `PC-` «Pedidos de Compra»; `PC2-`.
  - Ficha «SERIES DE JUSTIFICANTES» (f117–f130, s1160–1290), pestañas «Series de justificantes | Numerador de justificantes»: Tabla `Pedidos de compras`; Serie `PC-`; descripción «Pedidos de Compra». «Información complementaria»: **Numerador** ✓; **Justificación** `6`; **Excluir separador** ✓; **Control cronológico** ☐; **Renovación** `Perpetua`; **Generar** ✓; Fecha inicio `15-04-2015`; Fecha fin `31-12-3000`. «Datos de control»: Usuario alta `<usuario>`, 15-04-2015 11:16:21; Usuario modificación `<usuario>`, 15-04-2015 11:16:45. Rejilla «Vista» con las 9 series (columnas Tabla, Serie, Descripción, Numerador, Justificación, Excluir separador, Control cronológico, Renovación, Generar, Fecha inicio, Fecha fin; todas con Justificación 6, Renovación Perpetua, 15-04-2015 a 31-12-3000).
  - Ruido en pantalla: toasts de Gmail en la esquina inferior derecha («Francisco Rovira Romero · Ticket modified: Activación activo» en f118 y «Support Request 218246 – Activación activo» en f119–f120): **evitar en los recortes** (tarea: recortar por encima de x ≈ 1300, y ≈ 900 del fotograma 1680x1048, es decir, mantener el cuadro de la ventana y excluir la esquina).
- **Pasos**: cursor en Serie (s1120–1140) → clic en el lookup (s1150) → se abre la ficha de la serie PC- (s1160) → el ratón recorre Numerador, Justificación (el valor queda seleccionado, no se cambia: sigue `6`, s1200–1230), Excluir separador (s1235) y Control cronológico (s1259–1290).
- **Conceptos y reglas de negocio**
  - La serie del tipo de documento (`PC-`) es el prefijo del número de documento. Se define en la tabla de «series de justificantes», con una fila por tabla/serie; el **código de la serie lo decide el cliente** (no tiene por qué ser «pc»; puede incluir un guion final) y se le pone nombre.
  - **Justificación = 6** ⇒ el primer pedido será `PC-0000001` según la transcripción (con 6 de justificación sería `PC-000001`, véase dudas), después el 2, 3, 4, etc. Si no hubiese justificación, no se rellenaría con ceros.
  - **Numerador**: la serie numera correlativamente. **Excluir separador**: decide si se quita o se muestra el guion. **Control cronológico**: si se marca, el sistema verifica que el número siguiente se genera con fecha posterior a la del anterior; lo normal es que caigan en orden, pero sin control un pedido con fecha de ayer introducido hoy recibiría un número posterior al de uno de hoy (la frase se corta en 21:30).
  - Las máscaras de ejemplo (`[yy#mm#e]`, `[yy#e]`, `[yymm#e]`) en las descripciones de las series muestran que se puede **incluir el año/mes en el número** (series 1501PC-, 150401PC-…); no se explican en el vídeo.
- **Dudas / errores de transcripción**
  - «número de registro de camp de valores de justificación» = «campo de justificación» (Justificación). «justificar por valores» = «justificar con ceros».
  - Se dice «PC guión 0000001» (7 cifras) con «6» de justificación: contradicción menor (6 dígitos = `PC-000001`); y «Excluir separador» está **marcado** en pantalla, de modo que el guion en el número podría no mostrarse, mientras el ponente habla de «el guion que hay aquí». Confirmar con el formador/tester antes de dibujar un ejemplo numérico definitivo.
  - El texto de la transcripción desde 20:35 es continuo y razonable; sin repeticiones sospechosas.

## 4. Planos aprovechables

Recortes `x,y,w,h` sobre 1680x1048. Todos son pantalla del navegador (la barra del navegador ocupa y 0–100; la barra de tareas de Windows empieza en y ≈ 1005). Contenido útil: y 100–1005.

| # | Segundos absolutos | Recorte (x,y,w,h) | Qué demuestra |
|---|---|---|---|
| P1 | 40–70 | 0,100,1680,905 | Ficha completa del maestro de delegaciones TGN (tercero, dirección, estado, «Condiciones comerciales»). Para situar al alumno |
| P2 | 105–330 | 0,630,1680,270 | Banda «Condiciones comerciales» + rejilla Delegaciones: campos Tarifa precios, Tarifa descuento y Descuentos familia vacíos en TGN (acompaña la explicación «tarifa de venta de la delegación», 100–320 s) |
| P3 | 78–88 | 170,160,1330,780 | Lookup «TARIFAS DE PRECIOS DE VENTAS (DEFINICIÓN)» con VENTA, VENTA02 y VENTA02B (demuestra que el campo «Tarifa precios» de la delegación ofrece las tarifas de venta) |
| P4 | 330–395 | 0,100,1680,620 | Tarifa de compras G00003 con cursor sobre la pestaña «Proveedores»: la tarifa y su relación con proveedores. Usar con la locución «las compras se definen a nivel de proveedor» |
| P5 | 440–470 | 0,100,1680,905 | Secuencia terceros → proveedor P00001 → lookup → Tarifa precios = G00003 (**mejor plano demostrativo del tramo**); incluir también 430 para el listado de TERCEROS |
| P6 | 450–480 | 0,640,1680,260 | Zoom en «Facturación + Datos económicos»: Tarifa precios, Tarifa descuentos, Tarifa descuentos familia, Descuento comercial, Mínimo pedido |
| P7 | 940–955 | 0,130,400,700 | Árbol del menú con Compras › Maestros › Tarifas / Documentos (para el plano de «ruta de menú» de pedidos); mejor tomar el plano en 1030–1045 (f104–f105) con todos los tipos de documento visibles hasta Bloqueos/Autorizaciones |
| P8 | 1050–1060 | 0,100,1680,420 | Listado «TIPOLOGÍA DE PEDIDOS DE COMPRAS» con PC y PC2 y sus columnas (evitar f107 con el mensaje de error; usar s1070) |
| P9 | 1080–1145 | 0,100,1680,905 | Ficha PC del tipo de pedido (Identificación, serie PC-, Valoración, Indicativos, Tipo workflow PCW01) |
| P10 | 1120–1145 | 0,175,1680,100 | Zoom en la línea «Tipo pedido / Descripción / Serie / Estado» con el cursor en «Serie» |
| P11 | 1150–1160 | 176,168,1330,760 | Lookup «SERIES DE JUSTIFICANTES» con las 9 series (PC-, PC2-, 1501PC-…) |
| P12 | 1160–1300 | 176,168,1330,760 (evitar el toast de f118–f120; empezar en 1200) | Ficha de la serie PC-: Numerador, Justificación 6, Excluir separador, Control cronológico, Renovación Perpetua; coincide con las explicaciones de 20:06–21:16 |
| P13 | 1200–1235 | 176,415,1330,100 | Zoom en la línea «Numerador / Justificación / Excluir separador / Control cronológico / Renovación / Generar / Fechas» |

No hay planos que mostrar en 00:00–00:30 más que el formulario vacío, ni en 690–930 s (pantalla estática de la tarifa).

## 5. Optimización didáctica

**Qué sobra**
- 11:29–15:26 (digresión jefe de compras / rappels / riesgo): ~4 min sin pantalla; convertir en un cuadro de texto breve («el mantenimiento de tarifas lo hace el responsable de compras; el administrativo solo consume»).
- 15:57–17:16 (intento fallido de carga, Camtasia, timeout, «vale vale»): ruido total. Fotogramas f97–f103 (s960–1020). Solo conservar la ruta de menú desde f104 (s1030).
- 00:00–00:58 y la espera de carga de TERCEROS (s410–430), la espera de «Realizando consulta…» (f106) y los tiempos con la pantalla estática (s100–330 y 480–930) se pueden acelerar o sustituir por diagramas.
- Frases ininteligibles o dobles de Whisper: «Heaven Tarache» (01:35), eco «Y ahora mismo, este es un proveedor» (07:05), «mamá Darían» (04:40).

**Qué falta (y no se enseña)**
- No se llega a **hacer un pedido**: la promesa «veremos si el precio de 2.000 del A6 aparece» queda para otros tramos.
- No se muestra la ficha de **cliente** con su tarifa de venta (aunque se explique la prioridad cliente > delegación).
- No se muestra la ruta de menú para llegar a Delegaciones ni a Terceros (se usan URLs directas).
- No se explica qué contienen «Valoración», «Indicativos», «Workflow/Docflow» del tipo de pedido ni qué hace «Tipo workflow PCW01».
- Falta decir dónde se activa/desactiva el permiso por usuario para tocar precios (se afirma «hay maneras» sin enseñarlas).
- Falta la regla de cómo elige el sistema entre varias tarifas (Prioridad, días de la semana, fechas) que aparece en «Parámetros de aplicación» de la tarifa.

**Mejor orden para el tutorial**
1. Qué es una tarifa y qué tipos hay (ya visto en v1) → 2. **Dónde se asigna**: cuadro comparativo ventas (cliente → delegación) / compras (proveedor) → 3. Demostración real con **proveedor P00001 SEAT** (la única que aparece en pantalla) → 4. Reglas de precio en el pedido (precargar / pactar / permisos / vigencia por fechas) → 5. Circuito de documentos: ruta de menú de tipos de documento → pedido → serie.
Dejar la digresión organizativa como «para saber más».

**Qué merece diagrama animado**
- Jerarquía de aplicación de tarifa en ventas: cliente → delegación → «sin tarifa, no se propone precio» (y compras: proveedor).
- Ciclo de vida de una tarifa por rangos de fecha (precio hasta ayer / desde mañana).
- Estructura de la numeración: serie `PC-` + justificación 6 → `PC-000001`, `PC-000002`…; con y sin ceros; con y sin separador; con y sin control cronológico (ejemplo: pedido fechado ayer introducido hoy).
- Relación empresa – delegación – departamento (una empresa tiene como mínimo una delegación y un departamento).

**Tips y cuidados**
- **Tip**: en la delegación solo se define tarifa de **venta**; la de compra se asigna siempre al proveedor.
- **Tip**: en ventas el sistema mira primero la tarifa del cliente y, si no tiene, la de la delegación.
- **Cuidado**: si el proveedor no tiene tarifa, el pedido no propondrá precios; hay que informarlos en la línea.
- **Cuidado**: quien tenga permisos totales puede sobrescribir el precio de la tarifa; si se quiere impedir, limitar por usuario.
- **Cuidado**: las tarifas tienen vigencia por fechas (Fecha inicio / Fecha fin); si caduca (como `COMPRA`, fin 31-08-2015), no se aplicará.
- **Tip**: la serie del documento decide el número que se genera; si hay varios tipos de pedido, usar una nomenclatura que se vea en el código (`PC`, `PC2`).
- **Cuidado**: «Control cronológico» marcado impedirá numerar un pedido con fecha anterior al último ya numerado.
- **Aviso de calidad**: los recortes del tramo 1170–1230 s incluyen avisos de Gmail en la esquina inferior derecha; recortar fuera.
- **Aviso de datos**: el proveedor SEAT usa la tarifa `G00003` de la propia empresa; si se enseña al alumno, advertir que es un dato de demo.

## 6. Glosario de términos del ERP

| Término | Significado en el vídeo / ERP |
|---|---|
| Tarifa de precios | Conjunto de precios por artículo con divisa y vigencia (cabecera «TARIFAS DE PRECIOS DE COMPRAS/VENTAS (DEFINICIÓN)»; líneas con Precio, Descuentos, Precio neto) |
| Tarifa de descuento | Tarifa de condiciones de descuento; campo «Tarifa descuento» en delegación y «Tarifa descuentos» en proveedor |
| Descuentos familia | Descuentos por familia de artículos (campo «Descuentos familia» en delegación, «Tarifa descuentos familia» en proveedor) |
| Delegación | Sede o unidad comercial de una empresa; toda venta se realiza desde una (maestro `gdelegac`); ejemplo TGN «ALMACEN TARRAGONA», D03E «DEL. VEHÍCULOS LAS PALMAS» |
| Empresa / Agrupación | Empresa (03) y agrupación de empresas (ALL) a las que pertenece la delegación |
| Tercero | Persona o entidad de la ficha maestra «TERCEROS» (`ctercero`): empresas (G…), clientes (K…), proveedores (P…), banco (B…), caja (C…) |
| Proveedor | Tercero con ficha «MAESTRO DE PROVEEDORES» (`gproveed`); pestañas Proveedores, Terceros, Tarifas precios, Descuentos generales, Situación de proveedores |
| Datos económicos | Bloque del proveedor con Portes, Divisa, Descuento comercial, Descuento pronto pago, Tarifa precios, Tarifa descuentos, Mínimo pedido, % Royalty |
| Rappel | Descuento a posteriori por volumen anual de compra/venta, fuera de la tarifa de pedido |
| Tipología de pedidos de compras | Maestro (`gcompedd`) de tipos de pedido (`PC`, `PC2`) con serie, valoración, workflow, etc. |
| Serie | Prefijo del número de documento (`PC-`, `PC2-`), definida en «Series de justificantes» |
| Series de justificantes | Tabla (`cserjush`) que define tabla, serie, numerador, justificación, separador, control cronológico, renovación y fechas |
| Numerador | Indicador de que la serie numera correlativamente |
| Justificación | Número de dígitos (con ceros a la izquierda) del contador (valor 6 en la demo) |
| Excluir separador | Si se marca, se suprime el guion separador de la serie en el número |
| Control cronológico | Verificación de que el siguiente número tiene fecha posterior al anterior |
| Renovación | Periodicidad del contador (valor `Perpetua`) |
| Tipo workflow (PCW01) | Flujo de aprobación del pedido («Workflow Departamental») |
| Compromiso inversión | Indicador de la tipología de pedido (valor `Sí` en PC) |
| Valorar / Fecha valoración | Indicadores del tipo de pedido: si el documento se valora y con qué fecha (valor `Documento`) |
| Validar | Botón inferior de las fichas que graba (el timestamp «Fecha modificación» del proveedor cambia a 11:22:16) |
| Copiar | Botón inferior en la ficha de tarifa para duplicar la tarifa |
| Lookup | Ventana emergente de selección de un valor maestro (por ejemplo, de tarifas o de series) |
| Camtasia | Software de grabación de pantalla usado para el vídeo (aparece en el corte, s990–1010) |
