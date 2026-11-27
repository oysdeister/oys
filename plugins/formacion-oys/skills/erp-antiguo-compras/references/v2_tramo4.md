# Vídeo v2 «Tarifas y documentos de compra en el sistema» — TRAMO 4 (1:04:30–1:26:00)

Fuentes: `media/v2_tarifas/tramo4.txt` y fotogramas f_00388–f_00517 (segundo = (N-1)·10). Vistos 45 fotogramas, incluidos todos los que cambian de pantalla (detectados por tamaño de fichero entre f_438 y f_517: cambios en 441, 451–454, 463–466, 472–473, 483–485, 492, 501–508).

Contexto leído en pantalla: ERP **Deister** (versión 2015), entorno «**O&S Learning (Test)**» (dbms=learning), usuario `<usuario>`, Chrome en Windows 7, reloj 11/12/2015 (12:49 en f388; 13:13 en f513). Pestañas abiertas del navegador (visibles arriba): «CONFIGURACIÓN…», «TIPOLOGÍA DE PEDI…», «LÍNEAS DE PEDI…», «MAESTRO DE PR(oveedores)», «MAESTRO DE AR(tículos)», «TARIFAS DE PRE(cios)», «MAESTRO DE DE(legaciones)».
Desfase voz/pantalla: la pantalla suele ir 0–20 s por delante o por detrás de lo que se dice (el ponente cambia de pestaña mientras sigue hablando).

## 1. Resumen en 5 líneas
1. Cierra el bloque de **perfiles de usuario** (grupos funcionales, grupos de empresas/delegaciones) y muestra cómo ocultar **precios** en pedidos de compra con el grupo `public` (permiso «Precios»: Ver precios / Ver y modificar precios / No permitido).
2. Valida el **pedido de compra 151201PC000003** (SEAT, 10.000,00 EUR): queda bloqueado por **workflow** (26000 → 26010 «OTRO WORKFLOW»), se autoriza y se confirma el envío por e-mail; acaba en estado **Validado**.
3. Explica la **tipología de albaranes y suministros de compras** «RC – Recepción de Compra»: tabla origen Pedidos, condición de selección `gcompedh.estcab in ('V','P')`, actualizar origen «Sumando», valoración, contabilización, stock, lotes, cuentas logísticas NDIS → DISP.
4. Crea el **albarán 201501RC-000002** con origen el pedido, y con el botón «Agregar líneas pedido» recepciona COCHE A6 ×3 y COCHE A4 ×3 (de 4 pedidos): albarán Validado, importe 9.000,00; el pedido pasa a **Parcial** (A4 Parcial, A6 Servida).
5. Mucha explicación oral útil (pedido sin origen, errores típicos de pruebas con empresa/delegación distintas, recepcionista sin precios) pero solo ~45 % del tiempo hay acción en pantalla; en 1:10–1:18 la pantalla está casi fija.

## 2. Tabla de bloques
| # | Inicio–fin | Tema | Valor | Qué se ve |
|---|---|---|---|---|
| 1 | 1:04:31–1:05:39 (3871–3939 s) | Configuración de usuarios: grupo funcional finanzas/gestión `public`, grupo de empresas, delegaciones, departamentos, almacenes | Medio | Pantalla «Usuarios» (usuario `<usuario>` Carles Beya, Tipo Administrador), áreas «Área de finanzas» y «Área de gestión», grilla «Vista» con los 8+ usuarios (f388–f392) |
| 2 | 1:05:39–1:07:34 (3939–4054 s) | Permisos del grupo de gestión `public`: «Precios» en pedidos de compra; perfil «comprador» sin precios; ampliar el estándar con parámetros propios | Alto | Popup «CONFIGURACIÓN DE GRUPOS DE USUARIOS» (Grupos gestión/Usuarios; pestañas Preferencias de grupos de usuarios/Permisos; agrupación ALL) y luego página «Permisos» agrupación PEDIDOS DE COMPRAS con desplegable de la fila 8 «Precios» (f396–f414) |
| 3 | 1:07:34–1:10:16 (4054–4216 s) | Validar el pedido: bloqueo de workflow, autorización, envío de e-mail | Alto | Ficha «Pedidos compras» PC 151201PC000003, popup «Autorizar» (Motivo/Ok), tooltip «OTRO WORKFLOW», «Realizando transacción…», estado «Validado» (f410–f422) |
| 4 | 1:10:16–1:18:18 (4216–4698 s) | Definir el tipo de documento «RC Recepción de Compra» (albarán de recepción) | Alto | «TIPOLOGÍA DE ALBARANES Y SUMINISTROS DE COMPRAS», pestañas Documento origen / Valoración / Anticipos / Contabilización / Inversiones / Impresión de documentos / Indicativos / Stock / Consumos/Rappels (f426–f472). Pantalla casi estática (f_438–f_472 con pocos cambios) |
| 5 | 1:18:18–1:21:24 (4698–4884 s) | Alta de la cabecera del albarán; coherencia empresa/delegación/almacén con el pedido; campo Origen | Alto | «Albaranes compras» nuevo, tipo RC; popup «PEDIDOS DE COMPRAS» con 3 pedidos; cabecera guardada 201501RC-000002 (f473–f490) |
| 6 | 1:21:24–1:24:30 (4884–5070 s) | Agregar líneas del pedido: botón «Agregar líneas pedido», marcar, editar cantidad, agregar | Alto | Pantalla «SELECCIÓN DE LÍNEAS…» con COCHE A6 (3) y COCHE A4 (4); casillas marcadas; spinner; segunda pasada con COCHE A4 pendiente 1 y pedido «Parcial» (f492–f512) |
| 7 | 1:24:30–1:26:00 (5070–5160 s) | Ver líneas del albarán, importe 9.000,00; refresco del pedido; validación automática vs manual | Alto | Albarán con importe 9.000,00, líneas COCHE A4 3 y COCHE A6 3 «Validada»; pedido en «Parcial» con líneas A4 Parcial / A6 Servida (f509–f517) |

## 3. Detalle de bloques útiles

### Bloque 1 — Ficha de usuario (1:04:31–1:05:39)
- Pantalla (título de pestaña «CONFIGURACIÓN DE…»; URL `formauto_s.jsp?code=cuserids`), pestaña **Usuarios**.
- Secciones y campos literales: **Identificación** (Usuario `<usuario>`, nombre «Carles Beya (O&S)», Tipo «Administrador», Teléfono, E-Mail, Tercero, Dirección); **Área de finanzas**: «Grupo funcional de finanzas» = `public` («Grupo público»), «Grupo de empresas» = `L01` («LEARNING 2015»), «Grupo de proyectos», «Grupo de secciones», «Grupo de cuentas explotación», «Grupo de centros de coste»; **Área de gestión**: «Grupo funcional de gestión» = `public`, «Grupo de delegaciones», «Grupo de departamentos», «Grupo de almacenes». Grilla «Vista» con columnas Usuario, Nombre, Tipo, Tercero, Dirección, Grupo funcional de finanzas, Grupo de empresas, … E-Mail (usuarios <usuario>, <usuario> Diana Costa, <usuario> David Laseras, <usuario>, <usuario>, <usuario>, <usuario>, <usuario>…).
- Reglas: si no se pone nada, el usuario tiene por defecto perfil de finanzas `public` y de gestión `public` (siempre existen). Si se define un **grupo de empresas**, el usuario solo ve datos de ese grupo en el mundo finanzas; en gestión lo mismo con **grupos de delegaciones, departamentos y almacenes**. Si no se define nada, lo ve todo.
- Dudas/divagación: el ponente llega con la frase ya empezada («Si no lo pones…»); el resumen de la pantalla ya apareció antes del tramo.

### Bloque 2 — Permisos de grupo y ocultar precios (1:05:39–1:07:34)
- Ruta (inferida del clic en el enlace `public` de «Grupo funcional de gestión»): Configuración › Usuarios › enlace del grupo `public` → popup **«CONFIGURACIÓN DE GRUPOS DE USUARIOS»** → pestañas **Grupos gestión | Usuarios**; subpestañas **Preferencias de grupos de usuarios | Permisos**; campo «Agrupación» (valor ALL). Ruta de menú literal no se ve en este tramo.
- Con Agrupación ALL: tabla «Permisos» ID/Agrupación/Código/valor (semáforo verde + desplegable). Ejemplos: ACUERDOS DE COMPRAS (Cambiar programación, Cerrar, Copiar, Copiar líneas origen, Generar anticipos, Generar pedidos, Modificar importes, **Precios = «Ver y modificar precios»**, Servir), ACUERDOS DE VENTAS (Cerrar, Copiar, …, Precios).
- Con Agrupación = **PEDIDOS DE COMPRAS** (la ventana se abre a pantalla completa): filas 1 Adjudicar, 2 Anular, 3 Copiar, 4 Copiar líneas origen, 5 Generar anticipos, 6 Generar propuestas de movimiento, 7 Pedidos de compra interempresa, **8 Precios**, 9 Servir; todos «Permitido» salvo Precios = «Ver y modificar precios». Desplegable de la fila 8: **Ver precios / Ver y modificar precios / No permitido** (f400, f405, f410). Se marca la casilla de la fila 8. Barra inferior: **Marcar, Desmarcar, Invertir selección, Modificar marcados, Asignar todos, Desasignar todos**.
- Reglas/ejemplo: como se hace sobre `public` (que usan todos), nadie vería precios; la forma correcta es **crear un grupo nuevo (p. ej. «comprador» que no ve precios) copiado de `public`**, cambiar solo el parámetro y asignarlo a los usuarios. «No puedo tocarlo todo, pero puedo poner estos.» Extensible: se pueden añadir parámetros propios en las tablas y comprobarlos en el objeto correspondiente (solo para esa instalación, no estándar).
- Transcripción: la frase «a los usuarios que asigne ese perfil… no pueden ver el perfil» debe leerse «no pueden ver los precios».
- Aviso: el ponente muestra el desplegable pero no queda claro en pantalla qué valor deja guardado (en f405 sigue «Ver y modificar precios»).

### Bloque 3 — Validar el pedido, workflow y e-mail (1:07:34–1:10:16)
- Pantalla: **«Pedidos compras»** (pestaña del navegador «PEDIDOS DE COMP…», `formauto_s.jsp?code=gcompedh`). Botones superiores: **Líneas, Workflow, Documentos, Docflow, Selector de artículos por proveedor, Anular Líneas**.
- Datos del pedido: Tipo documento `PC` «Pedido de Compra»; Empresa `01` «ADMINISTRACION Y GESTION LA VIUDA ALEGRE»; Delegación `D01` «DELEGACIÓN V.A CENTRAL»; Departamento `0`; Almacén `D01` «Almacen DEL1 LA VIUDA»; Fecha pedido/Inicio entrega/Fin entrega 11-12-2015; **Pedido `151201PC000003`**; Proveedor `P00001` SEAT (Gran Via, Barcelona); «Recepcionar en» Tercero `G00001`, Málaga; Divisa EUR; Portes Debidos; Tipo efecto `TF`; Forma pago `045`; **Importe neto 10.000,00**; Datos de control: ID 16, usuario `<usuario>`, alta 11-12-2015 12:43:16.
- Pasos: (1) vuelve a la cabecera; (2) botón **Validar** → el pedido queda con **Estado «Bloqueado» 26000** (bloqueo de workflow de departamento); botones de la barra inferior pasan a **Copiar, Validar, Anular, Enviar a Director General, >3000€ Autorizar, Bloquear, Enviar e-mail** (f414); (3) aparece popup **«Autorizar»** con campo **Motivo** y botón **Ok** (f414); (4) el bloqueo cambia a **26010** (tooltip **«OTRO WORKFLOW»**, 20 a la derecha) y los botones pasan a **Copiar, Validar, Anular, Confirmar Envío mail, Bloquear, Enviar e-mail** (f418); (5) pulsa **Enviar e-mail** → destinatario, con copia, asunto «pedido de formación»; no funciona (utilidad de e-mail sin parametrizar) y se pulsa **Confirmar Envío mail** forzando «lo he enviado»; spinner «Realizando transacción…» (f422); (6) Estado **Validado** (punto verde, 0), botones **Copiar, Validar, Marcar como servida, Anular, Bloquear, Enviar e-mail**; fecha modificación 12:55:18.
- Concepto: el workflow de aprobación es parametrizable («aprobar jefe de central», bucle «aprobar director general», «aprobar comité») y se verá en su sesión. Los botones «Enviar a Director General» y «>3000€ Autorizar» son personalizaciones de la instalación (el importe neto es 10.000 €).
- Transcripción mal oída: «raul.com as graba isconsultores.com» = dirección de correo de OYS consultores (ilegible, no usar); «bloqueo… el nombre que tiene no es muy halagüeño» se refiere al texto del bloqueo («OTRO WORKFLOW»). «Alvarán» = albarán en todo el tramo.
- Divagación: ~40 s sobre la utilidad de e-mail rota, ruido didáctico.

### Bloque 4 — Tipología «RC Recepción de Compra» (1:10:16–1:18:18)
- Ruta literal: **Compras › Maestros › Documentos › Albaranes** (citada en voz: «compras, albaranes, maestros, documentos, albaranes»); pantalla **«TIPOLOGÍA DE ALBARANES Y SUMINISTROS DE COMPRAS»** (`code=gcommovd`).
- Cabecera «Identificación»: Tipo movimiento `RC`; Descripción «Recepcion de Compra»; Serie `RC-`; **Suministro albarán** = «Albarán»; Cuenta origen `NDIS`; Cuenta destino `DISP`; Estado «Activo». Datos de control: alta `<usuario>` 15-04-2015 11:59:21, modif. `<usuario>` 20-04-2015.
- Pestañas principales: **Documento origen | Origen auxiliar | Documento destino | Facturación interempresa | Cross-docking**. En «Documento origen»: **Tabla origen = Pedidos**; **Condición selección = `gcompedh.estcab in ('V','P')`**; **Actualizar origen = Sumando**; **Copiar líneas = Validar**.
- Subpestañas izquierda: **Valoración** (Valor «Tarifa», Valoración inventario «Origen», Orden 0, Descuentos especiales, Albarán de coste, IVA incluido, Abono «No», Actualizar PVP «Online», Tipo PVP), **Anticipos**, **Contabilización** (Asiento suministros, Asiento albaranes = `ALBC`, Asiento no facturados, Tesorería, Datos contables, Tipo ADO, Generar inmovilizado «No generar»), **Inversiones**, **Impresión de documentos** (Impresión «Sí», Objeto impresión).
- Subpestañas derecha: **Indicativos** (Tipo movimiento «Entrada», Naturaleza «Ninguna», Validar catálogo «Delegación», Actualizar pedidos, Numeración lotes, Estadísticas, Histórico), **Stock** (Lotes «Origen», Stock depósitos «Origen», Stock planificado «No», Proponer ubicación «Origen», Propuesta de movimiento), **Consumos/Rappels** (Consumo «Sí», Rappel «No», Control calidad), **ABC**.
- Más abajo: «Datos generales» (Circuito, Tipo workflow, Tipo Característica) y «Campos a ocultar»; paneles **Workflow** y **Docflow** (diagrama con cajas FCA, etc.).
- Reglas de negocio que explica:
  - El tipo tiene **tabla origen = pedidos**: todo albarán de recepción nace de un pedido. Puede existir otro tipo de albarán **sin origen** (ejemplo «la caja de leche semanal» que se factura sin pedido), pero lo normal es no recepcionar nada no pedido; el control está en el muelle (el albarán físico del proveedor debe traer la referencia del pedido).
  - **Condición de selección**: el pedido debe estar `V` (Validado) o `P` (servido Parcial); es una sentencia tipo SQL que se aplica en la búsqueda. Estados de pedido: Validado, Servido, Parcial.
  - **Actualizar origen «Sumando»**: cada recepción suma a «cantidad servida» del pedido; en un albarán de **devolución** con origen pedido sería restando.
  - Valoración: según tarifa, coste medio o última compra. Contabilización: tipo de asiento (se aplaza a la sesión de contabilidad). Indicativos: entrada/salida/interno afectan a efectos en stock. Lotes: depende de si el artículo tiene lote (campo en maestro de artículos); trazabilidad de lote en compra y venta. También: stock en depósito, consumo, rappel, workflow, campos a ocultar.
  - **Albarán vs Suministro**: igual para el sistema; albarán implica soporte papel, suministro solo entrega.
  - **Cuentas logísticas**: en recepción mueve de `NDIS` (No disponible) a `DISP` (Disponible); con más cuentas podría ir a «pendiente de control de garantía».
- Transcripción: «an que es una sentencia tipo SQL» = «Condición selección, que es…»; «Actualizaré el pedido sumando» = «Actualizar origen: Sumando»; «tochanas/tochadas» (ejemplo del camión de mercancía no pedida) es palabra mal oída, no usar. «Diana se le quedó el otro día pendiente» = sesión anterior sobre contabilización.
- Divagación: ejemplos largos (caja de leche, camión en el muelle, 1:11:04–1:12:51) y recorrido casi fila por fila de las pestañas (1:15:12–1:17:58). La pantalla permanece inmóvil largos tramos.

### Bloque 5 — Alta de cabecera de albarán (1:18:18–1:21:24)
- Ruta: **Compras › Albaranes** (pantalla «Albaranes compras», `code=gcomalbh`; pestañas **Albaranes compras | Suministros | Pedidos compras | Facturas compras | Apuntes**; botones **Líneas, Documentos, Docflow**).
- Campos: Tipo documento `RC` «Recepcion de Compra»; Empresa `01`; Almacén `D01`; Delegación `D01`; Departamento `0`; Albarán «201501RC-» (se numera al guardar); Fecha albarán / Fecha proveedor 11-12-2015; Origen; Estado «E» (editable); **Fecha recepción** 11-12-2015; Cuenta origen `NDIS` «No Disponible»; Cuenta destino `DISP` «Disponible»; Muelle destino; Tercero `G00001`; Pedido a/Facturado por.
- Regla: al pasar por **Origen** el sistema exige informarlo porque el tipo tiene tabla origen; el popup **PEDIDOS DE COMPRAS** (grilla filtrada) lista solo pedidos de **la misma empresa y delegación**: 151201PC000003 (10.000,00), 1501PC000002 (5.800,00), 1501PC000001 (5.800,00), proveedor `P00001` SEAT. Al elegir, recupera el proveedor (P00001 SEAT, Gran Via, Barcelona), divisa EUR, Tipo efecto `TF`, Forma pago `045`.
- **Cuidado** (error típico de formación): empresa, delegación y departamento del albarán deben coincidir con los del pedido; si no, «no encuentro el pedido de origen». El ejemplo oral con ciudades (Málaga/Valencia/Sevilla) es solo ilustración; en pantalla el tercero de recepción es Málaga.
- Pasos: Nuevo (botón «+» de la barra superior) → Tipo documento RC → rellenar empresa/almacén/delegación → Origen (popup pedidos) → Fecha recepción → **Insertar (Shift+ENTER)**, tooltip visible en f488 → se crea 201501RC-000002, ID 14, usuario alta `<usuario>` 13:06:36, estado «Validado».
- Nota: la cabecera sale ya «Validado» (los documentos pueden autovalidar). Botones del pie tras guardar: **Copiar, Validar, Marcar como facturado, Contabilizar, Enviar e-mail, Actualizar datos económicos**; en la barra secundaria aparecen **Agregar líneas pedido** y **Generar albarán de devolución**.
- Transcripción: «Lourdes» (1:19:14) probablemente «Lleida», no determinable, evitar.

### Bloque 6 — Agregar líneas del pedido (1:21:24–1:24:30)
- Pantalla: pulsar **Agregar líneas pedido** abre «SELECCIÓN DE LÍNEAS…» (`gcompedl_sel_gcommovh`), con cabecera «Albarán» y «Pedido origen» (Estado Validado) y grilla **Líneas**: columnas ID, Orden, Inicio entrega, Fin entrega, Artículo, Descripción, Referencia proveedor, Cantidad pedida (editable), Cantidad servida, Cantidad facturada, Precio, % línea, Importe neto. Líneas: 1 Orden 1 COCHE A6, pedida 3,000, precio 2.000,000000, neto 6.000,00; 2 Orden 3 COCHE A4, pedida 4,000, precio 1.000,000000, neto 4.000,00. Botones inferiores: **Marcar, Desmarcar, Invertir selección, Agregar líneas pedido**.
- Pasos: marcar las dos líneas (casillas) → editar la «Cantidad pedida» de A4 (a 3) → pulsar **Agregar líneas pedido** (inferior) → spinner «Realizando transacción…» → vuelve a la pestaña **Líneas** del albarán.
- Reglas: (1) el sistema ofrece solo las líneas **todavía no recepcionadas**; si quedan pendientes, tras agregar vuelve a salir la línea restante (f_501–f_503: COCHE A4 pendiente 1,000 con servida 3,000 y pedido en **Parcial**). (2) Al agregar el sistema ya hace el proceso de validación del albarán; si hubiera error saldría estado de error de bloqueo. (3) El recepcionista (perfil sin precios) puede ser distinto del comprador; los perfiles deberían ocultar precios también en albaranes, no solo pedidos.
- Dudas: la voz habla de «líneas» (pestaña) en catalán mezclado («a dalt ahí un tap», «l'albaran»), mala transcripción; «de los cuatro a cuatro son los menores» = «de los A4, entran 3 en vez de 4».
- Por pantalla el segmento dura más (f492–f512, 1:21:30–1:23:30) que lo hablado entre 1:21:46 y 1:24:12.

### Bloque 7 — Resultado: albarán y pedido (1:24:30–1:26:00)
- Albarán 201501RC-000002 tras agregar: **Importe 9.000,00**; pestaña **Líneas**: Orden 3 COCHE A4, cantidad 3,000, precio 1.000,000000, neto 3.000,00, Estado «Validada»; Orden 1 COCHE A6, 3,000, 2.000,000000, neto 6.000,00; total 9.000,00 (f512–f513).
- Pedido 151201PC000003 tras «actualizar datos»: **Estado «Parcial»** (naranja); líneas: A4 pedida 4,000, servida 3,000, estado «Parcial»; A6 pedida 3,000, servida 3,000, estado «Servida» (azul); botones **Copiar, Validar, Marcar como servida, Anular, Enviar e-mail**; fecha modificación 13:09:20 (f517).
- Concepto: «validar» no siempre es manual; algunos documentos se **autovalidan**. El pedido no se autovalidó al subir líneas (estaba «en error» no por falta de datos sino porque la validación no es automática en ese tipo).
- La frase «¿me saldría y me lo pondría en rojo?» es una pregunta de un asistente; la respuesta cierra el tramo sin concluir.

## 4. Planos aprovechables (coordenadas sobre 1680×1048; factor 1,3125 desde fotograma de 1280×798; el fotograma tiene pie de barra de tareas Windows: contenido útil y entre y≈75 y 765 del fotograma)
| Inicio–fin (s) | Recorte x,y,w,h | Qué demuestra |
|---|---|---|
| 3870–3910 | 0,200,1680,560 | Ficha de usuario: áreas finanzas/gestión y grupos (Grupo de empresas L01) |
| 3950–3975 | 175,170,1330,760 | Popup «Configuración de grupos de usuarios»: permisos por agrupación con semáforo |
| 4000–4090 | 0,370,1680,360 | Permisos PEDIDOS DE COMPRAS: fila «Precios» y desplegable (Ver precios / Ver y modificar / No permitido) |
| 4110–4130 | 0,230,1680,730 | Validar pedido: popup «Autorizar» (Motivo/Ok), estado Bloqueado 26000 y botones de workflow |
| 4140–4160 | 800,360,880,70 | Bloqueo 26010 «OTRO WORKFLOW» con tooltip (acercar) |
| 4210–4230 | 0,230,1680,760 | Pedido Validado, botones Copiar/Validar/Marcar como servida |
| 4250–4300 | 0,180,1680,540 | Tipología RC: Documento origen, Tabla origen Pedidos, Condición selección `gcompedh.estcab in ('V','P')` |
| 4360–4400 | 0,380,1680,150 | Indicativos/Stock/Contabilización (asiento ALBC, lotes Origen) de la tipología |
| 4720–4760 | 0,230,1680,590 | Albarán nuevo: cabecera, cuenta origen NDIS «No Disponible» → destino DISP «Disponible» |
| 4830–4850 | 175,170,1330,760 | Popup de pedidos de compras: solo aparecen los de misma empresa y delegación |
| 4890–4905 | 0,220,1680,770 | Albarán guardado 201501RC-000002, origen 151201PC000003, estado Validado |
| 4915–4930 | 0,200,1680,500 | Pantalla «Selección de líneas…» con COCHE A6 y A4 |
| 5000–5030 | 0,550,1680,200 | Marcar líneas y Agregar líneas pedido (spinner) |
| 5110–5130 | 0,130,1680,980 | Albarán con líneas Validada e importe 9.000,00 |
| 5150–5160 | 0,820,1680,200 | Pedido en estado Parcial con A4 Parcial / A6 Servida (cantidades 4 vs 3) |

Aviso para el recorte: en f_00513 y f_00517 la página está desplazada ~60 px hacia arriba; recalcular el recorte y a partir de y del fotograma real.

## 5. Optimización didáctica
- **Sobra**: tipos de albarán sin pedido (caja de leche), anécdotas del muelle (~1:11:04–1:12:51), fallo del e-mail y dirección ilegible, recorrido pestaña por pestaña de la tipología (1:15–1:18, la pantalla casi no cambia), diálogo sobre «rojo o no» (1:25).
- **Falta**: la ruta literal del menú para llegar a Permisos de grupo; valor definitivo del permiso Precios; qué significan los códigos de bloqueo 26000/26010 (aparecen sin explicar); estado final del pedido tras el segundo albarán; mostrar «Docflow» (diagrama) que sale en pantalla pero no se explica; no se llega a recepcionar la línea pendiente de A4.
- **Mejor orden**: 1) Ciclo pedido→albarán: pedido validado (bloque 3) → 2) tipología RC y por qué exige pedido (bloque 4, condensado a 4–5 reglas) → 3) alta de cabecera y coherencia de empresa/delegación (bloque 5) → 4) agregar líneas parcial (6–7) → 5) permisos de precios por perfil como «extra» de seguridad (bloques 1–2) al final o en otro vídeo.
- **Diagrama animado**: (a) ciclo Pedido (Validado) → Albarán de recepción (suma «cantidad servida») → pedido Parcial/Servido, con cuentas logísticas NDIS → DISP; (b) la condición de selección `V`/`P` filtrando qué pedidos se pueden recepcionar; (c) estados del pedido: Bloqueado 26000 → 26010 → Validado → Parcial → Servido; (d) herencia de permisos `public` → grupo «comprador».
- **Tips**: «Informa primero el Origen: el sistema trae proveedor, divisa y forma de pago»; «Agregar líneas pedido valida el albarán solo»; «Puedes cambiar la cantidad antes de agregar: el resto queda pendiente para otro albarán».
- **Cuidados**: empresa/delegación/departamento deben coincidir con el pedido; no cambiar permisos sobre `public` (afecta a todos) → copiar a un grupo nuevo; el pedido debe estar Validado o Parcial para poder recepcionarlo; la recepción parcial deja el pedido en «Parcial».

## 6. Glosario
- **Grupo funcional de finanzas / de gestión** (`public`): perfil de permisos por área; por defecto todos usan `public`.
- **Grupo de empresas / delegaciones / departamentos / almacenes**: restringe qué datos ve el usuario; vacío = todo.
- **Permiso «Precios»**: valores Ver precios / Ver y modificar precios / No permitido, por agrupación (PEDIDOS DE COMPRAS, ACUERDOS DE COMPRAS…).
- **Pedido de compra (PC)**: documento a proveedor; número `151201PC000003` (año-mes-día + tipo + secuencial).
- **Workflow / bloqueo (26000, 26010)**: control de autorización; «Autorizar» con motivo; «OTRO WORKFLOW».
- **Estado de pedido**: Bloqueado, Validado, Parcial, Servido.
- **Tipología de albaranes y suministros de compras (RC)**: define cómo funciona un tipo de albarán (origen, valoración, contabilización, stock).
- **Tabla origen / Condición selección / Actualizar origen «Sumando»**: documento del que nace, filtro SQL de documentos seleccionables y cómo se actualiza el origen.
- **Albarán vs Suministro**: igual funcionalmente; albarán lleva soporte papel.
- **Cuenta logística NDIS/DISP**: «No Disponible» → «Disponible».
- **Agregar líneas pedido**: botón que trae al albarán las líneas pendientes del pedido de origen.
- **Albarán de devolución**: se genera con «Generar albarán de devolución»; resta en el pedido.
- **Docflow**: diagrama del flujo de documentos de una tipología (FCA…).
- **Tipo efecto TF / Forma pago 045**: datos financieros heredados del pedido.
