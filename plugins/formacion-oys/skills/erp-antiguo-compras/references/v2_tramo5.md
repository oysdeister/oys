# Vídeo v2 «Tarifas y documentos de compra en el sistema» · TRAMO 5 (1:26:00–1:46:36, final)

Fuentes: `media/v2_tarifas/tramo5.txt` (+ `transcript.srt`) y fotogramas f_00517–f_00640 (segundo = (N-1)*10; f517 = 5160 s = 1:26:00; f640 = 6390 s). Revisados ~62 fotogramas (todos los impares de f517 a f637, más f640 y varios pares/intermedios). Los fotogramas se ven a 1280x798; para recortes sobre 1680x1048 multiplicar por 1,3125.

Contexto leído en pantalla: ERP **Deister** (Axional), entorno «**O&S Learning (Test)**» (`dbms=learning`), usuario `<usuario> [sws100]`, Chrome en Windows, fecha 11/12/2015. Servidor `212.36.72.159`. La barra superior del navegador conserva ~10 pestañas abiertas (Deister, Aplicaciones, O&S Learning, ALBARANES, TIPOLOGÍA, PEDIDOS DE COMPRA, MAESTRO DE PR…, TARIFAS DE PREC…). **OJO**: el reloj de la franja gris de cada pestaña (p. ej. «13:10:30 CET») es el de la carga de esa pestaña, no el del vídeo; el reloj de Windows (esquina inferior derecha) va de 13:13 a 13:34 en este tramo.

## 1. Resumen en 5 líneas
1. Cierra el ciclo de compra del ejemplo: pedido PC `151201PC000003` en estado **Parcial** (4 pedidos, 3 servidos), qué hacer con lo no entregado («Marcar como servido» o un nuevo albarán), y albarán de recepción RC `201501RC-000002`.
2. Contabiliza el albarán: el apunte es **4009 (Haber 9.000) contra 6000 (Debe 9.000)**; explica por qué contabilizar albaranes (cuenta puente 4009 «Proveedores, facturas pendientes de recibir o de formalizar») y que lo decide el *tipo de albarán* (pestaña Valoración: Tarifa / Última compra / Coste medio / No).
3. Muestra la tipología de facturas de compra `FCA` y registra la factura del proveedor SEAT (`FACT-1`, importe 8.750), la vincula con **Conformar albaranes** y la valida.
4. Explica el mensaje del **CRC** (control de cambios concurrentes) y el **error 3000 «importe proveedor diferente importe factura»** del Workflow: 8.750 introducidos frente a 10.890 calculados (9.000 + 21 %), y corrige a 10.890.
5. Contabiliza la factura (asiento 64: 4000.000002 SEAT Haber 10.890 / 4720 Debe 1.890 / 4009 Debe 9.000); el vídeo se corta en seco a las 1:46:36 («y a la cuenta…») con el widget de grabación en pantalla.

## 2. Tabla de bloques

| # | Inicio–fin (hh:mm:ss) | Tema | Valor didáctico | Qué se ve (fotogramas) |
|---|---|---|---|---|
| 1 | 1:26:00–1:26:24 | Validar: procesos pesados que no se ejecutan solos; «por costumbre doy a Validar» | Medio (aclaración corta) | Formulario Pedidos de compra (f517, s5160) |
| 2 | 1:26:24–1:29:04 | Pedido parcial: estado de cabecera «Parcial», línea «Servida» frente a línea «Parcial»; «Marcar como servido»; nuevo albarán con el mismo origen; penalizaciones | **Alto** | Pedido PC 151201PC000003, líneas COCHE A4/COCHE A6, botones inferiores (f517–f535, s5160–5350) |
| 3 | 1:29:04–1:33:07 | Contabilizar el albarán: asiento 4009/6000; por qué contabilizar albaranes; cuenta 4009; tipo de asiento parametrizado en el tipo de albarán | **Alto** | Albarán RC 201501RC-000002, botón Contabilizar (f537), pestaña Apuntes «MOVIMIENTOS CONTABLES EN TIEMPO REAL» (f539), apunte 63 (f541–f559, s5400–5580) |
| 4 | 1:33:07–1:34:25 | Valoración del albarán: pedido manda; sin origen → Tarifa / Última compra / Coste medio | **Alto** | Tipología de albaranes y suministros RC, desplegable «Valorar» (f565, s5640); menú Compras › Maestros › Documentos con clic derecho (f561, s5600) |
| 5 | 1:34:25–1:35:35 | Tipología de facturas de compra (FCA): origen suministro, serie FC-, tipo asiento | Medio-alto | Tipología de facturas de compras en blanco (f563, s5620) y rellena FCA (f569, s5680) |
| 6 | 1:35:35–1:37:37 | Registrar una factura nueva: Factura proveedor, proveedor P00001 SEAT, importe 8.750; control de duplicados | **Alto** | Facturas compras en blanco (f577, s5760), campo rojo «Factura proveedor» ; relleno (f579–f585, s5780–5840) |
| 7 | 1:37:37–1:38:52 | Conformar albaranes: elegir el albarán a vincular (RC002, 9.000) y Conformar | **Alto** | Menú desplegable «Conformar albaranes» (f587, s5860), rejilla de conformado (f589–f591, s5880–5900), factura con líneas e IVA (f593, s5920) |
| 8 | 1:38:52–1:39:19 | Workflow de factura de compra obligatorio (añadir Tipo workflow en tipología) | Medio (pantalla no vista) | Factura Validada con pestaña «Workflow» y botón «Bloquear» (f597, s5960) |
| 9 | 1:39:19–1:42:38 | Mensaje CRC: hash de los datos, por qué salta, recargar | **Alto** (conceptual, mal rotulado en el ERP) | Pantalla estática (f599–f613, s5980–6120); cursor sobre «Forzar actualización de datos (Alt + R)» (f615, s6140) |
| 10 | 1:42:38–1:45:13 | Error 3000 importe proveedor ≠ importe factura; control de precios; corregir a 10.890 | **Alto** | Spinner «Realizando transacción…» (f617), botón «#nomacc» y «Bloquear» (f619–f621), Importe factura 8.750→10.890 (f623–f625, s6180–6240), Albarán origen «Facturado» |
| 11 | 1:45:13–1:46:36 | Contabilizar la factura: 4000/4720/4009; corte | Medio-alto (cortado) | Botón Contabilizar (f633), asiento 63 (f637) y asiento 64 (f635/f640, s6340–6390); widget de grabación al final |

## 3. Detalle por bloque útil

### Bloque 2 (1:26:24–1:29:04) Pedido parcial y cómo cerrarlo
- **Pantalla literal** (pestaña «PEDIDOS DE COM…», URL `formauto_s.jsp?code=gcompedh…`): secciones **Unidad negocio** (Tipo documento `PC` «Pedido de Compra», Empresa `01` «ADMINISTRACION Y GESTION LA VIUDA ALEGRE», Delegación `D01` «DELEGACIÓN V.A CENTRAL», Departamento `0`, Almacén `D01` «Almacen DEL1 LA VIUDA»); **Pedido** (Fecha pedido 11-12-2015, Inicio/Fin entrega 11-12-2015, Estado «Parcial», Pedido `151201PC000003`, Origen, Referencia, Clasificación, Comprador); **Pedir a** (Proveedor `P00001` SEAT, Gran Via, Barcelona) / **Recepcionar en** (Tercero `G00001`); **Datos financieros** (Divisa EUR, Tipo efecto TF, Forma pago 045, Importe neto 10.000,00); **Datos de control** (ID 16, usuario alta `<usuario>`).
- **Líneas** (columnas: Orden, Inicio entrega, Fin entrega, Artículo, Descripción, Cantidad pedida, Precio, % línea, Importe neto, Cantidad servida, Cantidad facturada, Estado, Bloqueo, Wf):
  - Línea 1: orden 3, COCHE A4, pedida 4,000, precio 1.000,000000, neto 4.000,00, servida 3,000, estado **Parcial** (punto naranja).
  - Línea 2: orden 1, COCHE A6, pedida 3,000, precio 2.000,000000, neto 6.000,00, servida 3,000, estado **Servida** (punto azul).
- **Botones inferiores literales**: «Copiar», «Validar», «Marcar como servido», «Anular», «Enviar e-mail».
- **Pasos**: (1) recargar datos tras recepcionar; (2) el pedido muestra estado Parcial; (3) opciones: dejarlo así (aparecerá en los informes de seguimiento de pedidos hasta que se complete), pulsar **Marcar como servido** (cabecera pasa a Servido, queda finalizado; se facturará lo recibido, 3 y no 4), o hacer otro pedido; (4) si viene el segundo camión: en el albarán de recepción con el mismo origen sale la línea que faltaba (1 unidad) y se recepciona.
- **Reglas de negocio**:
  - Estado de cabecera = Parcial mientras alguna línea no esté completa; las líneas tienen estado propio (Servida/Parcial).
  - Marcar como servido cierra el pedido y limita la facturación a lo servido.
  - Los informes de control de pedidos muestran los pendientes; desaparecen al recepcionarse.
  - Penalizaciones al proveedor por incumplimiento: «política de empresa», no del sistema.
- **Ejemplo**: pidió 4 coches A4, le sirven 3; 3 coches A6 pedidos y servidos.
- **Dudas/divagaciones**: pregunta «¿o no?» del chófer imaginario (el «chico del camión»); conversación hipotética con comentarios («los dos huevos»: Whisper, probable «los dos huecos»/«los dos casos»).
- **Whisper**: «marcar como servido desde el punto de esto» = «desde el botón de arriba»; «en este estado»; «tenido al albarán» (1:44) = «arrastrando del pedido al albarán». «Él ¿vale?» (1:26:24) no tiene sentido (¿«ahora»?).

### Bloque 3 (1:29:04–1:33:07) Contabilizar el albarán
- **Ruta**: Compras › Albaranes › (registro) — pestaña «ALBARANES DE C…» con la URL `…code=gcomalbh…`. No se ve el menú en este tramo (la pestaña ya estaba abierta).
- **Pantalla literal** (Albarán de compras, pestañas superiores «Albaranes compras», «Suministros», «Pedidos compras», «Apuntes»; subpestañas «Líneas», «Documentos ▾», «Docflow»): **Unidad negocio** (Tipo documento `RC` «Recepción de Compra», Empresa 01, Almacén D01, Delegación D01); **Albarán** (Fecha albarán, Fecha proveedor 11-12-2015, Fecha valor, Fecha contabilización, Estado «Validado», Albarán `201501RC-000002`, Origen `151201PC000003`); **Pedido a / Facturado por** (Proveedor `P00001` SEAT); **Recepcionado en / Enviado a** (Tercero `G00001`); **Información general / Importaciones / Notas / Auxiliares** (Fecha recepción, Cuenta origen `NDIS` «No Disponible», Cuenta destino `DISP` «Disponible», Muelle destino, Importe auxiliar); **Datos financieros** (Divisa EUR, Descuento comercial, Descuento pronto pago, % Retención, Anticipos, Importe 9.000,00).
- **Líneas del albarán**: COCHE A4 cantidad 3,000 precio 1.000,000000 neto 3.000,00 «Validada»; COCHE A6 cantidad 3,000 precio 2.000,000000 neto 6.000,00 «Validada»; total 9.000,00. Columnas: Orden, Artículo, Descripción, Cantidad, Cantidad recibida, Cantidad abonada, Precio, % línea, Importe neto, Estado, Bloqueo, Wf.
- **Botones inferiores antes de contabilizar**: «Copiar», «Validar», «Marcar como facturado», **«Contabilizar»** (tooltip «Hot Key: Alt+4»), «Enviar e-mail», «Actualizar datos económicos». **Después**: «Contabilizar» pasa a **«Descontabilizar»**, y aparece «Fecha contabilización 11-12-2015».
- **Pasos**: (1) pulsar Contabilizar; (2) ir a la pestaña **Apuntes** (tooltip «MOVIMIENTOS CONTABLES EN TIEMPO REAL»); (3) se abre «MOVIMIENTOS CONTABLES EN TIEMPO REAL» (`code=capuntes`) con pestañas «Apuntes», «Saldos» y, subpestañas, «Impuestos», «Cartera de efectos», «Costes», «Albaranes compras».
- **Apunte generado (literal)**: Empresa 01, Proyecto `ADM001` ADMINISTRACIÓN, Sección 0 GENERAL; Fecha 11-12-2015, **Asiento 63**, Diario `DC` «Diario Compras»; Justificante `A00000015`; Documento `201501RC-000002`; Sistema General; Origen «Gestión»; Generar costes marcado; Identificador apunte 585, lote 184, usuario `informix`. Vista: línea 1 cuenta `4009.000000` «Proveedores, facturas pendientes de recibir o de formalizar» **Haber 9.000,00**; línea 2 cuenta `6000.000000` **Debe 9.000,00**. Rejilla «Asiento» con las mismas dos líneas, total 9.000,00.
- **Reglas de negocio**:
  - El **botón Contabilizar solo existe si el tipo de albarán tiene «Tipo asiento» a generar** (pestaña Contabilización del tipo de albarán). «Si esto no estuviera aquí no me habría salido el botón».
  - Contabilizar el albarán es **opcional según cliente**: algunas empresas llevan el control de la 4009 (mercancía recibida y no facturada: gasto incurrido por buena fe contable, sabemos el tercero pero no hay factura); otras solo contabilizan factura.
  - Empresas de stock (mercancía en almacén = ya es del balance) conviene contabilizar el albarán; servicios, no.
  - Inconveniente: 4009 es cuenta genérica, «cuadrar la 4009 el día de…» (frase cortada) es difícil.
  - Al contabilizar la factura, el sistema retira el saldo de la 4009 (se verá al final).
  - El detalle contable lo explicará «Diana»/el formador «cuando contabilicemos».
- **Dudas/divagaciones**: usa «seis mil» (cuenta 6000) y «nueve mil» (importe y cuenta 4009) en la misma frase: Whisper escribe «cuatro mil nueve», «los nueve mil contra los nueve mil», «los seis mil» = **cuenta 6000**. Frase «contra una cuenta de artículos… aquí no hemos hecho una cuenta por cada artículo» = cada artículo puede tener su propia cuenta de gasto; aquí todos van a 6000.
- **Corrección**: «proveedores pendientes de factura» es la descripción coloquial; en pantalla: «Proveedores, facturas pendientes de recibir o de formalizar».

### Bloque 4 (1:33:07–1:34:25) Valoración del albarán
- **Ruta de menú literal** (escritorio, f561): panel izquierdo «O&S Learning (Test)» con «Inicio», caja «Go!», casilla «Utilizar una única ventana»; árbol Compras › … › **Maestros** › **Documentos** › Concursos, Ofertas, Formularios, Solicitudes, Acuerdos, Pedidos, Albaranes, Facturas, Anticipos, Clasificaciones, Bloqueos… (el árbol se ve cortado). Clic derecho sobre «Facturas» → menú contextual «Abrir enlace en una pestaña nueva / ventana nueva / ventana de incógnito / Guardar enlace como… / Copiar dirección de enlace / LastPass / Inspeccionar»; la barra de estado muestra `servlet/jrep?code=gcomfacd&user=<usuario>&dbms=learning`.
- **Pantalla literal** «TIPOLOGÍA DE ALBARANES Y SUMINISTROS DE COMPRAS» (`code=gcommovd`, f565): **Identificación** (Tipo movimiento `RC`, Descripción «Recepcion de Compra», Serie `RC-`, Suministro albarán «Albarán», Cuenta origen `NDIS`, Cuenta destino `DISP`, Estado «Activo»); pestañas «Documento origen», «Origen auxiliar», «Documento destino», «Facturación interempresa», «Cross-docking» (Tabla origen «Pedidos», Actualizar origen «Sumando», Copiar líneas «Validar», Condición selección `gcompedh.estcab in ('V','P')`); pestañas «**Valoración**», «Anticipos», «**Contabilización**», «Inversiones», «Impresión de documentos» y «Indicativos», «Stock», «Consumos/Rappels», «ABC». En Valoración: desplegable **Valorar** con opciones **«Tarifa», «Última compra», «Coste medio», «No»**; «Valoración inventario», «Orden», «Descuentos especiales», «Albarán de coste», «IVA incluido», «Abono», «Actualizar PVP», «Tipo PVP», «Consumo», «Rappel», «Control calidad». Al fondo: «Datos generales / Campos a ocultar» (Circuito, Tipo workflow, Tipo Característica), «Información adicional», «Datos de control», cuadros «Workflow» y «Docflow» (diagrama con nodos «FCA»).
- **Reglas**: si el albarán viene de un pedido, **el precio lo marca el pedido**; sin origen, el tipo de albarán decide con qué precio se valora: *Tarifa*, *Última compra* o *Coste medio*. Ejemplo: empresa de stock → coste medio; entrega diaria de una caja de leche → última compra. «El criterio lo marcas tú».
- **Nota**: la pestaña usa «Valorar» en la pantalla, la pregunta del asistente («si el albarán no se hubiera valorado, ¿me cogería el último precio?») se contesta con ese desplegable. La opción visible en el momento de la captura es «Coste medio» resaltada (el ratón hace de selector).
- **Whisper**: «me entrego en caja de leche cada día» = «me entregan una caja de leche cada día»; «es por decir no no está parametrizado» (frase ruidosa).

### Bloque 5 (1:34:25–1:35:35) Tipología de facturas de compra FCA
- **Pantalla literal** «TIPOLOGÍA DE FACTURAS DE COMPRAS» (`code=gcomfacd`): Identificación (Tipo factura `FCA`, Descripción «Factura de Compra de Albaranes», Serie `FC-`, Estado «Activo»); **Documento origen** (Tabla origen «Suministros», Actualización tabla origen «Sumando», Copiar líneas «Sí», Condición selección `gcommovh_s.estcab !='F'`); **Indicativos** (Tipo asiento `FCA`, Compromiso inversión «No», ABC compras «No», Datos contables, Generación inmovilizado «No generar», Estadísticas, Histórico); **Impresión de documentos** (Impresión «Sí», Objeto impresión); **Valoración** (Valorar marcado, Abono «No», Descuentos especiales, IVA incluido, Diferencias redondeo, Anticipos «No», Tipo de anticipo, Albarán compras diferencias, Albarán ventas diferencias, Tipo regularización); **Campos a ocultar** (Orden, Status, Cantidad abonada, Variable logística, Lote, Cantidad base, Operación IVA, Tipo IVA, Tipo IVA 2, Tipo retención, Unidad compras, Unidad precios, Código barras, Referencia proveedor, Indicador regalo, Tab expedientes); **Datos generales** (Circuito, Tipo ADO, Tipo Característica, Tipo workflow).
- **Conceptos**: «origen suministro» = factura **con albarán**; el tipo FCA lleva su tipo de asiento (que se usa al contabilizar la factura). «Tiene un asiento comprometido, no tiene mucho más juego».
- **Cuidado**: la primera vez que se abre la pantalla (f563) sale en blanco con el foco en «Tipo factura» (pantalla de consulta sin registro); se rellena al buscar `FCA`. Intermedio: f567 es una pestaña de **Google Calendar** con aviso «comite (Raúl Comas) is starting at 13:30» (ruido, tiene que cortarse).

### Bloque 6 (1:35:35–1:37:37) Registrar una factura de compra
- **Ruta**: Compras › **Facturas** › **Registro** (clic derecho sobre «Registro» en el árbol, f573: «Abrir enlace en una pestaña nueva»; status `servlet/jrep?code=gcomfach&user=<usuario>&dbms=learning`). Otros nodos hijos de Facturas visibles: dos «Impre…», «Situ…», «Segu…», «Cont…», «Work…», «Proce…».
- **Pantalla literal** «Facturas compras» (`gcomfach`), pestañas «Facturas compras», «Albaranes compras», «Apuntes»; subpestañas «Líneas», «Vencimientos», «Documentos ▾», «Docflow». Secciones: Unidad negocio (Tipo documento `FCA` «Factura de Compra de Albaranes», Empresa 01, Delegación D01, Departamento 0); **Factura** (Fecha factura, Fecha operación, Fecha valor = 11-12-2015; Estado `E`; Factura `1215FC-`; Origen; **Factura proveedor** en rojo = obligatorio; Clasificación); **Pedir a** (Proveedor, Dirección) / **Facturado por** (Tercero, Dirección) / «Pagar a»; **Impuestos** (Operación, Tipo impuesto, Descripción, Base imponible, Cuota impuesto, Cuota recargo); Información general / Notas / Datos bancarios / Auxiliares (CIF, Zona impositiva); **Datos financieros** (Divisa, Descuento general, Descuento pronto pago, % Retención, Presupuesto, Partida, Portes «Debidos», Tipo efecto, Forma pago, Banco, **Importe factura**, Importe neto).
- **Pasos**: (1) abrir Registro; (2) pulsar «Nuevo» (icono + de la barra superior, f585 cursor sobre él); (3) tipo FCA por defecto; (4) rellenar **Factura proveedor** = `FACT-1`; (5) **Proveedor** = `P00001` (SEAT; autocompleta Tercero facturado, CIF `18014275P`, Zona impositiva `ESCO`, Divisa EUR, Tipo efecto `TF`, Forma pago `045`); (6) **Importe factura** = 8.750; (7) guardar (spinner «Realizando transacción…», f585).
- **Reglas**: **número de factura de proveedor único por proveedor y fecha** (evita introducir dos veces la misma). El importe de factura se teclea a mano: refleja el papel que ha llegado y luego se concilia. Factura puede tener **múltiples orígenes** (varios albaranes), por eso se vincula con «Conformar albaranes» y no con un campo Origen.
- **Ejemplo**: «imaginemos que me dicen que son 8.750 euros».
- **Dudas**: «este no es el procedimiento habitual» (se refiere a introducir primero el importe a mano, o al proveedor); Whisper «el proveedor es SEAT que si no me equivoco es el proveedor 1» = `P00001`.

### Bloque 7 (1:37:37–1:38:52) Conformar albaranes
- **Menú desplegable** del botón «**Conformar albaranes ▾**» (f587): «Conformar albaranes», «Conformar otros terceros», «Conformar por cif», «Conformar por delegación», «Conformar otros proveedores», «Desconformar Albaranes», «Diferencias respecto albarán». (Con el estado de la factura ya «Validada» tras grabar.)
- **Pantalla de conformado** (f589, URL `gcomalbe…terfac=P00001 AND divisa='EUR'`): pestañas «Facturas compras», «Albaranes compras»; **Importes totales** («Importe conciliado» 0, «Importe Albarán» 0,00, «Importe con IVA» 0,00, «Importe diferencia» 0,00, «Importe Factura» 8750); rejilla **Identificación** (ID, Referencia, Fecha proveedor 11-12-2015, Fecha suministro 11-12-2015, Tipo documento `RC`, Delegación `D01`, Departamento 0, Suministro `201501RC-000002` (hipervínculo, tooltip «Albaranes compras»), Origen, Importe neto 9.000,00, Descuento general, Descuento pronto pago, Importe con IVA 10.890,00, Tercero `P00001`, Nombre SEAT, Divisa EUR, Cambio 1,000000, Estado «Validado», Notas, Clasificación). **Botones inferiores**: «Marcar», «Desmarcar», «Invertir selección», «Conformar», «Conformar todos», «Calcular».
- **Pasos**: (1) Conformar albaranes ▾ › «Conformar albaranes»; (2) el sistema busca los albaranes del mismo proveedor y divisa; (3) marcar la casilla de la fila RC002 (se pinta de amarillo, total 10.890); (4) «Conformar» (spinner «Realizando transacción…», f591); (5) vuelve a la factura con Líneas copiadas e Impuestos calculados.
- **Resultado en factura** (f593): Impuestos fila 1 Operación `CN`, Tipo impuesto `NOR` «IVA general», Base imponible 9.000,000, Cuota impuesto 1.890,000; Importe factura 8.750,00, **Importe neto 10.890,00**; Líneas: COCHE A6 3,000 UNI × 2.000,000000 = 6.000,00; COCHE A4 3,000 UNI × 1.000,000000 = 3.000,00 (ambas «Validada»); botones «Copiar», «Validar», «Contabilizar», «Enviar e-mail».
- **Reglas**: conformar = vincular albaranes a la factura, pudiendo marcar **más de uno**; la factura toma líneas e impuestos del albarán (IVA 21 % porque los artículos tienen IVA normal: 1.890 sobre 9.000). Con la conformación, el albarán pasa a estado «Facturado» (ver f625).
- **Atención**: el campo «Importe neto» de la factura muestra **10.890,00 (con IVA)**, mientras «Importe factura» muestra el importe tecleado; el rótulo «neto» confunde.

### Bloque 8 (1:38:52–1:39:19) Workflow en la factura
- Transcripción: «en esta factura no hay un Workflow definido… en todas las facturas hay que poner un Workflow que como mínimo chequee que este importe y este importe sean el mismo… voy a añadir tipología de facturas, tipo de asiento, Workflow facturas de compra, factura». Es decir: en «Tipología de facturas de compras» (`FCA`) se informa **Tipo workflow** (campo de Datos generales) y se graba.
- **Pantalla**: no se ve el cambio en el maestro (el tramo f595–f597 ya muestra la factura con pestaña nueva **«Workflow ▾»** y botón **«Bloquear»** en lugar de «Contabilizar»; Estado «Validada»).
- **Whisper dudoso**: «voy a ver si lo puedo añadir tipología de facturas tipo de asiento Workflow facturas de compra factura si ya lo voy a validar» (mezcla dos frases). El workflow «Facturas de compra» exacto no se lee.

### Bloque 9 (1:39:19–1:42:38) El mensaje del CRC
- **Pantalla**: no se ve el cuadro de error en ningún fotograma; entre f599 y f613 (s5980–6120) la pantalla permanece **idéntica** (factura Validada, cursor en reposo en (688,164) del fotograma), solo cambia el reloj de Windows 13:27→13:29. Plano muerto de ~2,5 min mientras explica. Después f615 (s6140): tooltip «Forzar actualización de datos (Alt + R) (Shift + Ctrl + R)» sobre el botón de refrescar de la barra superior.
- **Concepto**: antes de cualquier transacción, el sistema recalcula un **hash (CRC)** del conjunto de datos presentados (propios y de parametrización asociada, p. ej. el tipo de documento) y lo compara con el guardado al cargar; si no coincide, avisa «el CRC ha cambiado» y bloquea la acción: otro usuario (o él mismo en otra pestaña) ha modificado algo. No es cifrado de datos.
- **Reglas**: ante el mensaje, **recargar la pantalla** («Forzar actualización de datos») y repetir; también puede aparecer «Facturada» si alguien más la facturó en paralelo.
- **Ejemplo**: él mismo cambió la parametrización (el tipo de documento: añadió el workflow a FCA) con la factura abierta; por eso salta.
- **Crítica didáctica del ponente**: «no es muy intuitivo… el CRC ha cambiado, no sé qué es».
- **Whisper**: «¿qué es eso del CRC? que ha cambiado yo no he cambiado nada»; «CRC él cuando hace la consulta» = «CRC: cuando hace…». No hay texto repetido ni inventado en este tramo.

### Bloque 10 (1:42:38–1:45:13) Error 3000 y control de precios
- **Pasos reales**: tras recargar (f615) pulsa Validar → spinner «Realizando transacción…» (f617, s6160) → la factura queda bloqueada por el workflow. En f619–f621 (s6180–6200) la barra inferior muestra «Copiar», «Validar», **«#nomacc»**, «Bloquear», «Enviar e-mail» (**«#nomacc» es una etiqueta sin traducir** que ocupa el sitio de «Contabilizar»; no se explica). Selecciona/edita Base imponible `9000` y Cuota impuesto `1890` (f621) y por último cambia **Importe factura** a **10.890** (f623: «10.890» tecleado) y valida; en f625 Importe factura = 10.890,00 y aparece la rejilla «**Albarán origen**» (Referencia, Tipo documento `RC`, Delegación `D01`, Departamento, Fecha suministro 11-12-2015, Suministro `201501RC-000002`, Tercero `P00001`, Origen `151201PC000003`, Divisa EUR, Cambio, Estado «**Facturado**» (punto magenta), Notas, Fecha proveedor, Importe 9.000,00, Descuento general).
- **Mensaje literal citado**: «**error 3000 importe proveedor diferente importe factura**» (no aparece rótulo en fotograma, se cita de la transcripción).
- **Reglas de negocio**:
  - El Workflow mínimo de toda factura de compra **compara el importe tecleado por el proveedor con el importe calculado** (con IVA); si difiere, **bloquea la factura** (error 3000).
  - Cálculo: líneas 6.000 + 3.000 = base 9.000; IVA normal 21 % = 1.890; total **10.890** (la transcripción dice «10.990», error de Whisper o de voz; el ERP muestra 10.890,00).
  - Utilidad: detecta que el comercial se equivocó en el precio del pedido o que el proveedor factura mal; si facturan el cuarto coche no entregado la suma sería mayor y habría que conformar un segundo albarán.
  - «El precio lo vengo arrastrando del pedido al albarán y ahora la factura»: la factura no pide precios, los toma del albarán.
- **Dudas**: «ya está obligado» (1:43:29), «este precio tocan» (transc. 1:44:02) → «los precios que toca» ; «la ha generado el otro» (= «la ha generado el proveedor»).
- **Inconsistencia**: se introdujo 8.750 como importe del proveedor pero el valor «correcto» a conciliar es 10.890; en el vídeo se corrige el dato para que cuadre (el error era didáctico). No queda claro si se muestra el desbloqueo explícito.

### Bloque 11 (1:45:13–1:46:36) Contabilizar la factura
- **Pasos**: botón «**Contabilizar**» (f633, ratón sobre él, s6320) → pestaña/URL de «MOVIMIENTOS CONTABLES EN TIEMPO REAL»: se ve primero el asiento 63 del albarán (f637, s6360) y luego el asiento **64** (f635/f640, s6340–6390).
- **Asiento 64 literal**: Diario `DC` «Diario Compras», Justificante `A00000016`, **Documento `FACT-1`**, Identificador apunte 587, lote 185, usuario `informix`, Fecha alta 11-12-2015 13:30:53. Líneas de Vista: (1) cuenta `4000.000002` **SEAT**, Haber 10.890,00; (2) cuenta `4720.000000`, Debe 1.890,00; (3) cuenta `4009.000000`, Debe 9.000,00. Total asiento 10.890,00. Se ve el cursor sobre la fila 3 (4009).
- **Reglas**: «por defecto a la fecha del documento»; el apunte es parametrizable (cuenta del proveedor, cuenta del IVA y **la 4009 al Debe**, que cancela el Haber del albarán). El sistema «saca el saldo de la 4009» al contabilizar la factura.
- **Dudas**: «voy a dar y a la cuenta» queda cortado: el vídeo termina en seco (1:46:36). En f640 se ve la barra del grabador con «Restart / Pause / Stop» y «Capture / Effects / Tools / Help» (el ponente va a parar la grabación). El audio de 1:46:07–1:46:21 «¿lo veis?» no tiene contenido.
- **Whisper**: «a la 4009 aquí como debe en el anterior asiento los 4009 la 4009 era como a ver» = «la 4009 va al debe, como en el asiento anterior la 4009 estaba al haber, a ver…»; contenido real: la 4009 cambia de lado.

## 4. Planos aprovechables (segundos absolutos del vídeo; recorte x,y,w,h sobre 1680x1048)

| # | Inicio–fin (s) | Recorte x,y,w,h | Qué demuestra |
|---|---|---|---|
| 1 | 5160–5290 | 0,830,1680,180 (líneas y botones del pedido) | Estados por línea (Parcial/Servida) y botones «Validar», «Marcar como servido», «Anular» |
| 2 | 5160–5290 | 830,300,820,60 | Estado de cabecera «Parcial» del pedido 151201PC000003 |
| 3 | 5360–5379 | 0,960,820,60 | Botón «Contabilizar» (Alt+4) en la barra inferior del albarán |
| 4 | 5380–5395 | 380,170,320,70 | Pestaña «Apuntes» con tooltip «MOVIMIENTOS CONTABLES EN TIEMPO REAL» y botón «Descontabilizar» (0,970,560,40) |
| 5 | 5400–5580 | 0,640,1680,140 (rejilla Vista) + 0,300,1100,100 (Cuenta 4009) | Asiento 63: 4009 Haber 9.000 / 6000 Debe 9.000 |
| 6 | 5640–5660 | 0,380,880,130 | Desplegable «Valorar»: Tarifa / Última compra / Coste medio / No |
| 7 | 5600–5620 | 0,230,520,420 | Menú Compras › Maestros › Documentos y clic derecho «Abrir enlace en una pestaña nueva» |
| 8 | 5680–5700 | 0,310,1680,300 | Tipología de facturas de compras `FCA` (origen Suministros, Tipo asiento `FCA`) |
| 9 | 5760–5840 | 0,170,1680,860 | Alta de factura: Factura proveedor obligatoria, P00001 SEAT, Importe factura 8.750 |
| 10 | 5860–5870 | 380,205,230,220 | Submenú «Conformar albaranes ▾» con sus 7 opciones |
| 11 | 5880–5910 | 0,380,1680,170 + 0,970,800,40 | Rejilla de conformado: Importe conciliado/Albarán/Importe con IVA/diferencia/Factura 8750; botones Marcar…Calcular |
| 12 | 5920–5960 | 0,570,1680,380 | Impuestos CN/NOR/IVA general 9.000 + 1.890 y Líneas copiadas del albarán |
| 13 | 6140–6160 | 1060,100,350,100 | Botón «Forzar actualización de datos (Alt + R)» (solución al CRC) |
| 14 | 6180–6240 | 0,570,1680,420 | Corregir Importe factura 8.750 → 10.890 y botones Validar/«#nomacc»/Bloquear |
| 15 | 6240–6300 | 0,840,1680,110 | Rejilla «Albarán origen»: albarán en estado «Facturado» |
| 16 | 6320–6340 | 140,970,200,45 | Botón «Contabilizar» de la factura |
| 17 | 6340–6390 | 0,620,1680,170 | Asiento 64: 4000.000002 SEAT / 4720 / 4009 |

(Evitar: 5980–6120 pantalla fija sin cambios; 5660–5680 pestaña de Google Calendar; 6390–6396 widget del grabador.)

## 5. Optimización didáctica
- **Sobra**: la conversación hipotética del camión, los 2,5 min de pantalla fija sobre el CRC (5980–6120), la pestaña de Google Calendar (5660), «#nomacc» sin explicar, los bucles «¿vale?» y las divagaciones sobre política de empresa y penalizaciones (1:28:44–1:29:04); el final cortado (1:45:51–1:46:36).
- **Falta**: la configuración real del Workflow de factura de compra (cómo se asigna en `FCA` y cómo se desbloquea tras error 3000); la pestaña **Contabilización** del tipo de albarán (donde se ve el «Tipo asiento»); abrir un informe de pedidos pendientes; mostrar la **descontabilización**; el mensaje CRC y el error 3000 reales (no aparecen en ningún fotograma); el asiento de factura con explicación de debe/haber de la 4009; el estado del pedido tras facturar («Facturado»).
- **Mejor orden**: (1) pedido parcial y cierre; (2) albarán; (3) contabilizar albarán y 4009; (4) tipo de albarán (valoración + contabilización); (5) tipología de facturas FCA + Workflow; (6) registrar factura; (7) conformar; (8) validar y errores (CRC, 3000); (9) contabilizar factura.
- **Diagrama animado**: ciclo de documentos con estados (Pedido Parcial→Servido; Albarán Validado→Contabilizado→Facturado; Factura E→Validada→Bloqueada→Contabilizada); flujo de asientos 4009 (Haber en albarán, Debe en factura) con importes 9.000/10.890/1.890; mecanismo CRC (datos → hash → comparación → error); comparación importe proveedor vs. calculado.
- **Tips**: «Marcar como servido» cierra el pedido y se factura solo lo recibido; el criterio de valoración (última compra/coste medio) se fija en el tipo de albarán; Conformar admite varios albaranes; para el error CRC pulsa «Forzar actualización de datos (Alt + R)».
- **Cuidados**: el botón Contabilizar del albarán solo aparece si el tipo de albarán tiene tipo de asiento; el número de factura de proveedor no se puede repetir para el mismo proveedor y fecha; «Importe neto» en la factura es con IVA; el Workflow bloquea la factura si importe proveedor ≠ calculado; no contabilizar un albarán sin la política de la 4009 definida; cambiar la parametrización con documentos abiertos dispara el CRC.

## 6. Glosario
- **Pedido (PC)**: documento de compra al proveedor (`gcompedh`), estados Parcial/Servido.
- **Albarán de recepción (RC)** / **Suministro**: recepción de la mercancía (`gcomalbh`/`gcommovh`).
- **Tipología de albaranes y suministros de compras (`gcommovd`)**: define origen, valoración, contabilización.
- **Valorar**: criterio de precio sin pedido: Tarifa / Última compra / Coste medio / No.
- **Tipo asiento**: plantilla de asiento contable asociada a un tipo de documento (p. ej. `FCA`).
- **4009**: cuenta «Proveedores, facturas pendientes de recibir o de formalizar».
- **6000**: cuenta de compras/gasto del artículo. **4000.000002**: cuenta del proveedor SEAT. **4720**: IVA soportado.
- **FCA**: tipo de factura «Factura de Compra de Albaranes» (serie `FC-`).
- **Factura proveedor**: número de factura del proveedor (único por proveedor y fecha).
- **Conformar albaranes**: vincular albaranes a la factura de compra; **Desconformar** lo deshace.
- **Importe neto (factura)**: en pantalla muestra el total con IVA calculado.
- **Workflow**: validación automática asociada al tipo de documento (mínimo, comparar importes).
- **Error 3000**: «importe proveedor diferente importe factura».
- **CRC**: hash de comprobación de que los datos no han cambiado desde que se cargaron.
- **Docflow**: diagrama de flujo de documentos origen-destino del tipo.
- **«#nomacc»**: etiqueta sin traducir visible en la barra de botones (significado no confirmado).
- **Operación `CN` / tipo impuesto `NOR`**: operación nacional con IVA general.
- **Zona impositiva `ESCO`**, **Tipo efecto `TF`**, **Forma pago `045`**: datos del proveedor/financieros que se autocompletan.
- **Datos de control**: ID, usuario y fecha de alta/modificación.

## Avisos de calidad de la transcripción
- Palabras mal transcritas: «los huevos» → «los casos/huecos»; «cuatro mil nueve»/«los nueve mil» = 4009/9.000; «10.990» = 10.890; «tenido» = arrastrado; «de aquí 2 días» = «dentro de 2 días»; «de aquí 5 minutos» = «dentro de 5 minutos».
- 1:45:13–1:45:51: hueco de 38 s en la transcripción (silencio o ruido); 1:46:07–1:46:36: solo muletillas («¿lo veis?», «¿vale?», «pues vale voy a dar y a la cuenta»). No hay texto repetido en bucle ni inventado en este tramo, pero la última frase está **cortada**.
- Las fechas dentro de las pestañas («12:56:15», «13:10:30») no corresponden a la hora de la grabación: ignorarlas.
