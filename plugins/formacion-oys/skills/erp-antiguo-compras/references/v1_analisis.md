# Análisis del vídeo v1 «Gestión de compras: pedidos, albaranes y facturas» (Loom, ~14 min)

Fuentes: `media/v1_compras/transcript.txt` y 86 fotogramas (f_00001 = s0, f_00002 = s10 ... f_00086 = s850). Revisados 54 fotogramas (todos los impares, más f46, f54, f58, f78) con cambios de pantalla cubiertos. Coordenadas de recorte sobre 1680x1048 (fotograma de 1280 px × 1,3125).

Datos de contexto leídos en pantalla: ERP **Deister** (Axional), entorno «**O&S Learning (Test)**» (dbms=learning), usuario `<usuario> [sws100]`, navegador Chrome en Windows 7, fecha del reloj 11/12/2015 (10:59–11:13). Documento Word visible: «PL-Plan-Formacion-Incorporaciones-ERP-2015 v2.docx» (Plan de formación, versión 1.0, 26/11/2015), «3.6 SESION 7 GESTIÓN DE COMPRAS. Fecha: 11/12/2015, Formador: Raül Comas».

## 1. Resumen en 5 líneas
1. Sesión de formación (2015) que anuncia el ciclo básico de compra Pedido → Albarán → Factura, pero el vídeo **no llega a crear ningún pedido, albarán ni factura**.
2. Muestra el menú Compras › Maestros › Documentos (tipos de documento) y Compras › Maestros › Tarifas (Condiciones tarifados, Precios, Descuentos), sin llegar a abrir ningún tipo de documento.
3. El grueso (≈ 60 %) es una discusión conceptual con otros asistentes sobre «tarifa» frente a «artículo», y la explicación de la tarifa de compra (cabecera con divisa y fechas de validez, líneas con artículo/unidad/precio/descuentos).
4. Explica que la tarifa se asocia al proveedor (tarifa G00003 = proveedor «VEHICULOS A MOGOLLON S.A.») o a la delegación, y es de donde el pedido tomará el precio.
5. Termina abruptamente: intenta abrir el maestro de delegaciones, la página da ERR_CONNECTION_TIMED_OUT y la transcripción degenera en texto repetido (alucinación de Whisper) hasta «Para cortar el vídeo».

## 2. Bloques temáticos
Los tiempos de pantalla se han contrastado con la hora del reloj y con el contenido de cada fotograma; la transcripción y la imagen van sincronizadas con un desfase menor de ~20 s.

| # | Inicio–fin | Tema | Valor didáctico | Qué se ve en pantalla |
|---|---|---|---|---|
| 1 | 00:00–01:34 | Objetivo y ciclo básico Pedido–Albarán–Factura (qué es cada documento) | Alto (concepto, reutilizable en diagrama) | Word con el plan de formación «3.6 SESION 7 GESTIÓN DE COMPRAS» y la lista de contenidos; el ponente subraya «Pedido», «Albarán», «Factura» en «Ciclo de gestión: Pedido – Albarán - Factura» (f1–f11, s0–100) |
| 2 | 01:34–02:58 | Definir tipos de documento: menú Compras › Maestros › Documentos; documentos de ciclos complejos (concursos, ofertas, formularios, solicitudes) | Medio-alto (ruta de menú real) | Escritorio Deister con árbol del menú: Compras desplegado, carpeta Maestros › Documentos con 11 entradas (f13–f21, s120–200) |
| 3 | 02:58–05:48 | Debate «tarifa vs artículo»: la tarifa es un concepto abstracto con código y condiciones de precio, de la que cuelgan artículos | Medio (idea clave, mal expresada: conversación a varias voces) | Pantalla casi estática del menú; ratón sobre Tarifas; en f27 (s260) cambia a Word, «3.5 SESION 6 GESTIÓN DE EMPRESA … Tarifas de Compra y Venta» (f23–f37, s220–360) |
| 4 | 05:48–07:34 | Por qué la tarifa va antes que el pedido (de ella sale el precio); se abre un artículo (COCHE A3) para comprobar que **no** tiene tarifa/precio | Medio-alto | Escritorio con caja «Go!» (teclea «/» en f39); ficha «MAESTRO DE ARTÍCULOS» COCHE A3 (f39–f47, s380–460) |
| 5 | 07:34–08:50 | Tipos de tarifa: de precios y de descuento (simplificar: solo tarifa de compra); navegación Tarifas › Precios › Registro | Medio | Árbol Tarifas expandido; «CONDICIONES DE TARIFA…» abre en pestaña en blanco (f47, s460); Precios › Registro (f51–f53); pantalla «TARIFAS DE PRECIOS DE COMPRAS (DEFINICIÓN)» cargando (f54, s530) |
| 6 | 08:50–09:50 | Cabecera de tarifa: divisa, fechas de validez, tarifa caducada (COMPRA) y vigente (G00003) | Alto | «TARIFAS DE PRECIOS DE COMPRAS» con tarifa COMPRA, luego G00003 (f55–f57, s540–570) |
| 7 | 09:50–11:27 | Líneas de tarifa: artículo, unidad (unidad/caja/palé), vigencia por línea, precio unitario, descuento tarifa/comercial, precio neto, escalados; descuentos generales | Alto | Pestaña Líneas de G00003 «TARIFAS DE COMPRAS (PRECIOS)» con línea COCHE A6 y grid «Descuentos generales» (f59–f69, s580–680) |
| 8 | 11:27–13:18 | ¿Dónde se aplica la tarifa? Se asocia al maestro de proveedores o al maestro de delegaciones (campos de tarifa de compra y de venta) | Alto (concepto), pero sin demostración | Vuelta a la cabecera G00003; ratón sobre pestaña «Proveedores» (tooltip «MAESTRO DE PROVEEDORES»); luego Maestros › Parametrización › Configuración (Empresa, Grupos, Valores…) (f71–f79, s700–780) |
| 9 | 13:18–14:10 | Intento fallido de abrir delegaciones y cierre del vídeo | Ruido | Pestaña nueva con `servlet/jrep?code=gdelegac` → «Esta página web no está disponible, ERR_CONNECTION_TIMED_OUT» (f81–f86, s800–850); transcripción 13:18–13:39 repetida («Es que no tengo dos campos, no lo han visto…») |

## 3. Detalle por bloque útil

### Bloque 1 (00:00–01:34) Ciclo básico
- **Pantalla**: Word, no el ERP. Lista literal de contenidos de la sesión: «Tipos de Documentos Pedido», «Tipos de Documentos Albarán», «Tipos de Documentos Factura», «Ciclo de gestión: Pedido – Albarán - Factura», «Estados de los Documentos», «Seguimiento de documentos», «Contabilización de documentos».
- **Pasos**: señala con el cursor/selecciona Pedido, Albarán, Factura en la línea del ciclo.
- **Conceptos**: Pedido = lo que queremos comprar y a qué tercero. Albarán = comunicar al sistema que hemos recibido la mercancía pedida. Factura = documento que certifica/valora el compromiso de pago al tercero por el material suministrado. Los procesos reales pueden ser más elaborados.
- **Dudas/errores**: lo anunciado en el plan (Estados, Seguimiento, Contabilización) no se trata en este vídeo.

### Bloque 2 (01:34–02:58) Maestros de documentos
- **Ruta de menú (literal, f13–f21)**: panel izquierdo «O&S Learning (Test)» con botón «Inicio», caja «Go!», casilla «Utilizar una única ventana». Secciones: Finanzas, Compras, Ventas, Logística, Producción, Análisis, Presupuestos (y Maestros, visible en f79).
  - **Compras** › Concursos, Ofertas, Formularios, Solicitudes, Acuerdos, Pedidos, Albaranes, Facturas, Anticipos, Importaciones, Informes, **Maestros**.
  - **Compras › Maestros** › Tarifas, **Documentos**.
  - **Compras › Maestros › Documentos** › Concursos, Ofertas, Formularios, Solicitudes, Acuerdos, Pedidos, Albaranes, Facturas, Anticipos, Clasificaciones, Bloqueos/Autorizaciones. (Tooltip «Clasificaciones» en f17; la URL de estado muestra `servlet/jrep?code=gclasdoc`.)
- **Pasos**: abre Logística brevemente (f13, probablemente al buscar), despliega Compras, luego Maestros › Documentos; pasa el ratón por Facturas y Acuerdos. **No abre ninguna pantalla de tipo de documento.**
- **Conceptos**: cada tipo de documento (pedido, albarán, factura) se define aquí; hay tipos para ciclos largos (concursos, ofertas, formularios, solicitudes) que no se van a usar ahora.
- **Dudas**: dice que «aquí dice tarifas pero la tarifa no la pondría en el maestro de artículos» (3:29). No se enseña ni se rellena ningún tipo de documento, que era el objetivo declarado.

### Bloque 3 (02:58–05:48) Debate conceptual sobre tarifas
- **Pantalla**: menú Maestros › Tarifas (con tooltip «Tarifas») sin abrir nada; Word en 4:20 con «Tarifas de Compra y Venta» de la sesión 6 (indica que la tarifa se vio en otra sesión).
- **Conceptos explicados**: la tarifa es un concepto abstracto con un código y unas condiciones de precio; bajo la tarifa cuelgan los artículos a los que afecta; se define de forma aislada y se le dice a qué artículos corresponde (no se va del artículo a la tarifa); un mismo artículo puede estar en tarifas de ventas, compras, producción.
- **Divagaciones**: preguntas cruzadas de asistentes, «si no lo visteis lo vemos otro día», fragmentos poco inteligibles en 2:58–3:29 («Pero yo he entrado a compras y ya tiene que haber una… Un curso suficientemente… Ah, vale»). Valor didáctico bajo en forma, útil en fondo.

### Bloque 4 (05:48–07:34) La tarifa antes del pedido; el artículo sin tarifa
- **Pantalla**: se teclea «/» en la caja «Go!» (f39) y se abre «**MAESTRO DE ARTÍCULOS**» (URL `coreapps/wic_iges/formauto_s.jsp?code=garticul`).
- **Campos visibles (artículo COCHE A3, f43)**: Pestañas «Artículos», «Stocks cuentas», «Situación artículo», «Artículos producción», «Compradores»; subpestañas «Variable logística», «Ean», «Unidades por artículo», «Niveles stocks», «Artículos por proveedor», «Catálogos», «Workflow», «Formulaciones», «Imágenes», «Documentos», «Características». Identificación: Artículo `COCHE A3`, Descripción `COCHE A3`, Unidad base `UNI`, Unidad auxiliar, Relación variable, Estado `Activo`, Bloqueo `0`, Workflow. Información general: Agrupación empresas `L01`, Familia `010101` («Vehiculos Berlinas Gasolina»). Contabilidad: Tipo contable `MP` («Materia Prima»), Clave impositiva `BOR` («Bienes a tipo general»). Unidades de medida prioritarias: Unidad precios, Unidad coste, Unidad ventas, Unidad compras, Unidad expediciones, Unidad recepciones (vacías). Logística: Clasificación `Normal`, Lotes `No`, Stock `Sí`. Info complementaria: Fecha alta 14-04-2015, Tipo `PROD`, Tipo descripción `Variable`, Modificar `Sí`. Sub-rejillas «Proveedores» (G00003 VEHICULOS A MOGOLLON S.A., Grupo almacenes D03B, Prioridad 99, VLP 01, Estado Activo), «Clientes», «Catálogo», «Impuestos compras» (Zona empresa ESCO / Zona tercero ESCO, ESIC, ESIS …) e «Impuestos ventas». Se despliega el menú de «Características» (Características, Iso, Localización, Configurador) en f45.
- **Conceptos**: el precio del artículo en el pedido sale de la tarifa; en el maestro de artículos no hay campo de tarifa («Yo aquí no tengo tarifa»); en la entrada de almacén de la sesión anterior se pidió un importe que se dejó en 0 «porque suponía que no había tarifa».
- **Errores**: al transcribir, «premio» = precio. Se mezcla el ejemplo del coche con «el precio que quieres por un coche».

### Bloque 5 (07:34–08:50) Tipos de tarifa y navegación
- **Ruta de menú (f35–f53)**: Compras › Maestros › **Tarifas** › «Condiciones tarifados» (código `gcomtarc`), **Precios** (› Registro, Impresión, Informes), **Descuentos**.
- **Pasos**: hace clic en «Condiciones tarifados» (se abre una pestaña «CONDICIONES DE TARIFA…» que se queda en blanco, f47), vuelve al escritorio, abre Precios › **Registro** (icono de pantalla) → «TARIFAS DE PRECIOS DE COMPRAS (DEFINICIÓN)» (código `gcomtarh`).
- **Conceptos**: tarifas de precios (precio por artículo) y tarifas de descuento (condiciones de descuento: por volumen, etc.; puede ser muy complejo); el ejemplo se simplifica a una tarifa de compra.
- **Errores**: la pantalla «Condiciones tarifados» no carga (hoja blanca); no se explica qué es.

### Bloque 6 (08:50–09:50) Cabecera de tarifa
- **Pantalla** «TARIFAS DE PRECIOS DE COMPRAS» (tabs «Tarifas precios», «Proveedores»; subtabs «Líneas», «Desglose descuentos tarifa»; botón inferior «Copiar»).
- **Campos (tarifa COMPRA, f55)**: Tarifa `COMPRA` / «TARIFA COMPRA»; Divisa `EUR`; Descuentos (casilla); Clasificación; Referencia; Fecha inicio `01-04-2015`; Fecha fin `31-08-2015`. «Parámetros de aplicación»: Prioridad `0`; Lunes–Domingo (marcados L–V; sábado y domingo sin marcar). «Datos de control»: Identificador tarifa 1, Usuario alta `<usuario>`, Fecha alta 15-04-2015 13:38:58, Usuario modificación `<usuario>`. Rejilla «Vista» con las 2 tarifas: COMPRA (fin 31-08-2015) y G00003 «VEHICULOS A MOGOLLON S.A.» (fin 01-01-3000).
- **Pasos**: muestra COMPRA («esta estaría caducada ya»), selecciona G00003 en la rejilla «Vista» (f57) «que todavía es vigente».
- **Conceptos**: una tarifa tiene divisa y fechas de validez; la tarifa se va cambiando (nuevas vigencias).

### Bloque 7 (09:50–11:27) Líneas y descuentos de tarifa
- **Rejilla «Líneas» de COMPRA (f55)**: columnas Artículo, Descripción, VLP, Unidad, Inicio vigencia, Fin vigencia, Precio, Precio unitario, Descuento tarifa, Descuento comercial, IVA incluido, Precio neto, %Bonificación; 10 de 13 filas visibles (COCHE A3 15.000, A4 20.000, A6 35.000, C3 8.000, C4 15.000, C5 20.000, LAVADORA01 325, LAVADORA02 650, LAVADORA03 190, NEVERA01 625; todas UNI, 01-04-2015 a 31-08-2015). Paginación «Página 1 de 2», «View 1 - 10 of 13».
- **Pantalla de línea (f59, «TARIFAS DE COMPRAS (PF…», código `gcomtarl`) de G00003**: «Línea de la tarifa» con Artículo `COCHE A6`, VLP 0, Unidad `UNI`, Inicio vigencia `01-04-2015`, Fin vigencia `01-01-3000`, Precio `2.000,000000`, Precio unitario, Descuento tarifa `0,0000`, Descuento comercial `0,0000`, IVA incluido. «Datos generales»: Tipo, %Bonificación, Precio recomendado, Descuento recomendado, Precio neto. «Datos auxiliares» (Auxiliar numérico 1–3, alfanumérico 1–3). «Datos de Control». Botón «Escalado de precios». Rejilla «Descuentos generales»: Orden `5`, Descuento `DES`, Descripción `DESCUENTO COMERCIAL`, Valor `-10,00`, Fórmula `Porcentaje`, Tipo `Escalado`, Base cálculo `Precio base`, Escalando marcado, Canal liquidación `Distribuidor`, Período liquidación `Factura`; y Orden `10`, Valor `-12,00`. Rejilla «Descuentos familia» vacía.
- **Pasos**: entra en la línea de COCHE A6 desde la rejilla; pasa el ratón por la cabecera «Fórmula» (f59), «Unidad» (f61), «Lines» (f67) y el tooltip «Escalado» sobre Tipo (f69); recorre la fila.
- **Conceptos**: el precio puede darse por distintas unidades (unidad, caja, palé; ejemplo de botellas), la vigencia por línea hereda la de la cabecera, existe precio unitario, descuento de tarifa, descuento comercial, indicador de disponible, precio neto; descuentos por escalado de cantidades.
- **Errores/dudas**: dice «descuento comercial del 10 %» y «este otro descuento», mientras en pantalla hay dos escalones (-10,00 y -12,00). El precio de COCHE A6 en G00003 es 2.000 frente a 35.000 en COMPRA (incoherencia del dato de demo no comentada). Dice «tarifa de descuento… tarifa por línea» sin ejemplificar el escalado.

### Bloque 8 (11:27–13:18) Dónde se asigna la tarifa
- **Pantalla**: vuelve a cabecera G00003 (f71–f77); pasa el ratón por la pestaña «Proveedores» (tooltip «MAESTRO DE PROVEEDORES», URL de estado `servlet/jrep?code=gproveed… cond=gproveed.tarpre = 'G00003'`). Luego escritorio, **Maestros › Parametrización › Configuración** con «Errores», «Empresa», «Grupos», «Valores … por grupos de gestión» (nombre cortado), y carpetas «Terceros», «Artículos», «Contabilización», «Auxiliares», «Biblioteca» (f79, tooltip «Grupos»).
- **Conceptos**: la tarifa (código G003 dicho / G00003 en pantalla) se asocia en el maestro de proveedores y también en el maestro de delegaciones, donde hay un campo de tarifa de compra y otro de venta; la tarifa de la delegación se aplicará a todos los documentos hechos con esa delegación; a nivel de delegación hay «más posibilidades».
- **Dudas/errores**: el ponente no encuentra el sitio del maestro de delegaciones en el menú («Maestros, terceros… configuración, empresa… Es que no tengo dos campos»). Un asistente pregunta «¿has dicho compras de ventas?». No se muestra el campo «tarifa» del proveedor.

### Bloque 9 (13:18–14:10) Fallo y cierre
- Se abre `servlet/jrep?code=gdelegac&user=<usuario>&dbms=learning` (pantalla de delegaciones) y la página no carga: «Esta página web no está disponible - ERR_CONNECTION_TIMED_OUT». Sin valor; se corta. La transcripción de 13:18 a 13:39 repite «Es que no tengo dos campos, no lo han visto…» (alucinación; no hay audio útil) y termina con «Para cortar el vídeo, ¿verdad? Para pararlo, ¿no?».

## 4. Planos aprovechables
Rectángulos x,y,w,h sobre 1680x1048. Tiempos en segundos de vídeo.

| # | Tramo (s) | Recorte x,y,w,h | Qué demuestra |
|---|---|---|---|
| P1 | 120–160 | 0,236,385,490 | Menú Compras desplegado: Concursos, Ofertas, Formularios, Solicitudes, Acuerdos, Pedidos, Albaranes, Facturas, Anticipos, Importaciones, Informes, Maestros |
| P2 | 170–215 | 0,236,385,490 (o 10,243,360,470) | Menú **Compras › Maestros › Documentos** con las 11 entradas (Concursos … Clasificaciones, Bloqueos/Autorizaciones) y la subcarpeta Tarifas |
| P3 | 330–350 | 10,243,360,470 | Menú **Compras › Maestros › Tarifas** abierto: Condiciones tarifados, Precios, Descuentos |
| P4 | 490–520 | 10,243,360,470 | Navegación Tarifas › Precios › Registro / Impresión / Informes (clic en «Registro») |
| P5 | 540–560 | 0,243,1680,155 | Cabecera de tarifa COMPRA: Tarifa, Divisa EUR, Descuentos, Fecha inicio 01-04-2015 / fin 31-08-2015 (tarifa caducada), días de aplicación L–V |
| P6 | 540–560 | 0,600,1680,330 | **Rejilla de líneas de tarifa** COMPRA (Artículo, Unidad, Inicio/Fin vigencia, Precio, Descuento tarifa/comercial, IVA incluido, Precio neto, %Bonificación) con 10 artículos y paginación 1 de 2 |
| P7 | 560–575 | 0,490,1680,100 | Rejilla «Vista» con COMPRA caducada frente a G00003 vigente (fin 01-01-3000) |
| P8 | 580–640 | 0,348,1660,100 | Formulario «Línea de la tarifa»: Artículo COCHE A6, Unidad UNI, Vigencia, Precio 2.000, descuentos |
| P9 | 580–680 | 0,760,1680,130 | Rejilla «Descuentos generales»: DESCUENTO COMERCIAL -10,00 / -12,00, Porcentaje, Escalado, Precio base, Distribuidor, Factura |
| P10 | 420–445 | 0,728,1680,95 | Maestro de artículos COCHE A3: sub-rejilla Proveedores (G00003 VEHICULOS A MOGOLLON S.A., Prioridad 99) y comprobación de que el artículo no lleva campo de tarifa |
| P11 | 420–440 | 0,240,1680,330 | Maestro de artículos: Identificación, información general y contabilidad (campos del artículo) |
| P12 | 710–750 | 0,184,520,60 | Pestaña «Proveedores» de la tarifa con tooltip «MAESTRO DE PROVEEDORES» (enlace tarifa-proveedor, código G00003) |
| P13 | 780–790 | 0,453,385,265 | Maestros › Parametrización › Configuración (Empresa, Grupos, Valores…) |
| P14 | 0–100 | 340,160,1000,620 | Word «SESION 7 GESTIÓN DE COMPRAS» con la lista de contenidos (solo como referencia de programa; no recomendable en el nuevo tutorial) |

Descartar: 460–470 (hoja en blanco «Condiciones tarifados»), 480–520 (cargando) y 800–850 (error de conexión).

## 5. Optimización didáctica
**Sobra**
- Todo el bloque 3 (debate a varias voces, reformulaciones, «si no lo visteis lo vemos otro día»): condensar en 20–30 s de locución con diagrama.
- Escenas del Word, esperas de carga («Realizando consulta…»), la hoja en blanco de Condiciones tarifados y el error ERR_CONNECTION_TIMED_OUT.
- Referencias a conversaciones previas («lo que visteis ayer»), nombres propios de asistentes y los intentos de buscar la pantalla de delegaciones.
- Detalle de ciclos largos (concursos, ofertas, formularios, solicitudes): una frase y un recuadro «no se verá aquí».

**Falta explicar (y en el vídeo ni se muestra)**
- **Todo lo que dice el título**: crear un pedido de compra, convertirlo en albarán (recepción) y generar la factura; estados de cada documento, seguimiento y contabilización (anunciados en el plan).
- Crear/editar los tipos de documento (pedido, albarán, factura) en Compras › Maestros › Documentos, con sus campos y opciones; qué hacen «Clasificaciones» y «Bloqueos/Autorizaciones».
- Cómo se alta una tarifa nueva (botones, validar, Copiar), no solo consultarla.
- Dónde se rellena la tarifa en el maestro de proveedores y en el de delegaciones (campos exactos), y la **prioridad de aplicación** si coinciden varias tarifas.
- Cómo el precio llega al pedido (se prometió «cuando le ponga el artículo en el pedido me va a poner un precio») y qué pasa si no hay tarifa (importe 0).
- Qué significan VLP, Fórmula, Escalando, Canal liquidación, Período liquidación, Precio neto, %Bonificación.

**Orden lógico recomendado**
1. Diagrama del ciclo Pedido → Albarán → Factura (qué hace cada documento y qué efecto tiene: compromiso, recepción de stock, obligación de pago).
2. Tipos de documento: Compras › Maestros › Documentos.
3. Maestros previos: artículo, proveedor (con su tarifa) y delegación; cómo la tarifa fija el precio (diagrama).
4. Tarifa de compra: cabecera → líneas → descuentos/escalados → vigencia.
5. Asignar la tarifa (proveedor / delegación).
6. Pedido → Albarán → Factura en pantalla, con estados, seguimiento y contabilización.

**Conceptos para diagrama animado (no pantalla real)**
- Ciclo de documentos y relación entre ellos (con sus estados).
- Jerarquía Tarifa (código + divisa + fechas) → líneas (artículo + unidad + vigencia + precio) → descuentos/escalados.
- Cadena de resolución del precio: pedido → proveedor/delegación → tarifa → línea → precio (y descuento comercial).
- Unidades del artículo (unidad / caja / palé) y precio por unidad.
- Relación 1-N tarifa–artículos y el mismo artículo en varias tarifas (compras, ventas).
- Escalado de descuentos (-10 %, -12 % según cantidad), si se mantiene.

**Tips y cuidados**
- Tip: la tarifa se define de forma aislada y luego se le añaden artículos; no se parte del artículo.
- Tip: las tarifas se cambian con nuevas vigencias; la fecha de la línea hereda la de la cabecera por defecto.
- Tip: se puede asignar tarifa en proveedor o en delegación (y en delegación hay compra y venta).
- Cuidado: una tarifa caducada (Fecha fin 31-08-2015) no aplica; si no hay tarifa vigente el importe del albarán/pedido sale a 0.
- Cuidado: el precio de un mismo artículo puede diferir entre tarifas (COCHE A6: 35.000 en COMPRA, 2.000 en G00003); conviene un ejemplo con datos coherentes.
- Cuidado: no confundir tarifa de precios con tarifa de descuento; ni «Descuento tarifa» con «Descuento comercial».
- Cuidado: la tarifa afecta a todos los documentos de la delegación.
- Para la locución: «precio» (la transcripción dice «premio»), «Mogollón» (no «almofillón»), «G00003».

## 6. Glosario
- **Deister / Axional**: ERP de la formación («O&S Learning (Test)», dbms=learning).
- **Escritorio**: pantalla principal con árbol de menú, caja «Go!» y «Últimas ejecuciones».
- **Pedido**: documento que define qué se compra y a qué tercero.
- **Albarán**: documento que registra la recepción de la mercancía pedida.
- **Factura**: documento que recoge el compromiso de pago al proveedor.
- **Concursos / Ofertas / Formularios / Solicitudes / Acuerdos / Anticipos / Importaciones**: otros documentos y carpetas del módulo Compras (ciclos más complejos).
- **Maestros de documentos**: Compras › Maestros › Documentos; definen los tipos de cada documento.
- **Clasificaciones, Bloqueos/Autorizaciones**: entradas del maestro de documentos (su función no se explica).
- **Tercero**: cliente o proveedor con quien se relaciona la empresa.
- **Tarifa**: conjunto de condiciones de precio con código, divisa y fechas, asociado a artículos.
- **Tarifa de precios / de descuento**: dos tipos de tarifa.
- **Condiciones tarifados**: pantalla de Tarifas (código `gcomtarc`); no se llegó a ver.
- **Divisa**: moneda de la tarifa (EUR).
- **Fecha inicio / Fecha fin**: validez de la tarifa; también Inicio/Fin vigencia por línea.
- **Prioridad / días de aplicación**: parámetros de aplicación (Prioridad 0, Lunes–Domingo).
- **Vista**: rejilla con las tarifas existentes.
- **Línea de tarifa**: precio de un artículo con unidad y vigencia.
- **VLP**: columna de línea de tarifa; no se explica en el vídeo.
- **Unidad**: unidad de medida del precio (UNI); el ponente cita caja y palé.
- **Precio / Precio unitario**: importe de la línea y su valor por unidad.
- **Descuento tarifa / Descuento comercial**: descuentos de la línea.
- **IVA incluido / Precio neto**: indicadores de la línea.
- **%Bonificación, Precio recomendado, Descuento recomendado**: campos de «Datos generales» de la línea (no explicados).
- **Escalado de precios / Escalando**: precios o descuentos en función de cantidades.
- **Descuentos generales / Descuentos familia**: rejillas de descuentos por tarifa o por familia de artículos.
- **Fórmula (Porcentaje) / Base cálculo (Precio base) / Canal liquidación (Distribuidor) / Período liquidación (Factura)**: columnas del descuento.
- **Maestro de artículos**: ficha del artículo (código garticul), con unidad base, familia, tipo contable y sus proveedores.
- **Unidad base / Unidad auxiliar**: unidades del artículo.
- **Maestro de proveedores**: ficha del proveedor; la tarifa se asocia aquí (pestaña Proveedores de la tarifa; filtro `tarpre`).
- **Delegación / Maestro de delegaciones**: sede de la empresa; admite tarifa de compra y de venta (pantalla `gdelegac`, no mostrada).
- **Parametrización › Configuración › Empresa / Grupos**: carpeta de Maestros vista en f79.
- **G00003**: código de proveedor «VEHICULOS A MOGOLLON S.A.» y de su tarifa; **COMPRA**: tarifa genérica.
- **Datos de control**: auditoría del registro (usuario alta, fecha alta, usuario modificación).

Limitaciones: la rejilla de G00003 muestra solo la línea COCHE A6; de las dos pantallas citadas («Condiciones tarifados», «Delegaciones») no se vio contenido; el nombre completo de la entrada «Valores … por grupos de gestión» está cortado; el significado de VLP no se lee ni se explica.
