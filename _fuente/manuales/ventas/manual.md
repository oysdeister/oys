[IMG:ventas-001.png]
DEISTER MANAGER  ·  MANUAL DE FORMACIÓN
SESIÓN 8
Gestión de ventas
[TABLA]
|  |
[/TABLA]
Ejercicios documentados en la versión nueva del ERP
CONTENIDO
—	Antes de empezar
01	Circuito de ventas Albarán-Factura
02	Circuito de ventas Oferta-Pedido-Albarán-Factura
# Índice
Cómo usar este manual	3
Antes de empezar	5
El circuito de ventas	5
Cómo moverse por la versión nueva	5
Ejercicio GV 1. Circuito de ventas Albarán-Factura	6
1. Tipología de albarán ACL	6
2. Tipología de factura FCL	10
3. El tercero como cliente	12
4. Albarán de ventas	14
5. Contabilizar el albarán	17
6. Factura de ventas: conformar y contabilizar	22
Ejercicio GV 2. Circuito de ventas Oferta-Pedido-Albarán-Factura	28
1. Tipología de ofertas OCL	28
2. Tipología de pedido PCL	29
3. Tipología de albarán ACL2	31
4. Tipología de factura	32
5. Oferta	32
6. Pedido	36
7. Albarán	38
8. Factura: conformar y contabilizar	41
# Cómo usar este manual
Este documento repite los ejercicios de la Sesión 8 sobre la versión nueva del ERP (Deister Manager, base BBDD TUTORIAL en nextdemo.geasa.eu). Para cada pantalla se explica para qué sirve en la empresa, dónde está en el menú, qué significa cada campo y qué pasos seguir. Los recuadros CAMBIO señalan lo que funciona distinto que en la versión antigua; los recuadros PROBLEMA y SOLUCIÓN, los errores que salen por el camino y cómo se resuelven.
En los ejemplos se usan las iniciales CL (tipologías ACL, FCL…, tercero «TCL»). Sustitúyelas por las tuyas. Se reutilizan el tercero TCL «Tercero Claude» y el artículo 13500620 (6000-2RS ISB) de la Sesión 7. En las tablas de campos, la columna «Oblig.» indica si la pantalla marca el campo con asterisco rojo.
## Recuadros que verás
[TABLA]
| ? | ¿PARA QUÉ SIRVE? | Abre cada apartado: explica qué se consigue y por qué se hace. |
| Δ | CAMBIO | Qué se hace distinto en la versión nueva del ERP. |
| ! | PROBLEMA | Un error que puede salir al hacer el ejercicio y su causa. |
| ✓ | SOLUCIÓN | Cómo resolver el problema anterior. |
| i | A TENER EN CUENTA | Avisos y detalles útiles sobre la base de pruebas. |
[/TABLA]
## Otros elementos
Ruta de menú. Dónde está la pantalla. Cada pieza es un nivel del menú lateral; también puedes abrirla con el buscador superior (Cmd/Ctrl + K).
MENÚ    Gestión   ›   Compras   ›   Albaranes
Tabla de campos. Qué se rellena, qué significa y un valor de ejemplo. Sustituye las iniciales del ejemplo por las tuyas.
[TABLA]
| CAMPO | QUÉ SIGNIFICA | VALOR DE EJEMPLO |
| Tercero * | Código del tercero que creas. | TCL |
| Nombre comercial | Nombre que verás en listas y documentos. | Tercero Carlos López |
[/TABLA]
*  Campo obligatorio: sin él no deja guardar.
Pasos numerados. Hazlos en orden. El texto entre comillas («Guardar») es un botón, una pestaña o un campo tal como aparece en pantalla.
1 	Pulsa «Añadir» arriba a la derecha.
2 	Rellena los campos y pulsa «Guardar».
Resumen. Cierra cada ejercicio con lo que has conseguido y cómo comprobar que ha ido bien.
# Antes de empezar
## El circuito de ventas
[TABLA]
| ? | ¿PARA QUÉ SIRVE? / Una venta pasa por varios documentos encadenados: la oferta (lo que proponemos al cliente), el pedido (lo que el cliente nos compra), el albarán (la mercancía que sale del almacén) y la factura (lo que le cobramos). Cada documento nace del anterior copiando sus líneas, y así el ERP sabe en todo momento qué falta por servir y qué falta por facturar. Al contabilizar la factura se genera el asiento (cliente, IVA y ventas) y el vencimiento que entra en la cartera de cobros. |
[/TABLA]
El comportamiento de cada documento lo decide su tipología (el «tipo de documento»): de qué documento viene, si copia las líneas, qué serie lo numera, si mueve stock y con qué plantilla se contabiliza. Por eso cada ejercicio empieza creando las tipologías y después los documentos.
•	Ejercicio GV 1: Albarán › Factura, contabilizando los dos.
•	Ejercicio GV 2: Oferta › Pedido › Albarán › Factura, contabilizando solo la factura.
## Cómo moverse por la versión nueva
•	Ya no se escribe la ruta (/gvenmovd, /gvenalbh…) en la barra de direcciones. Se usa el menú lateral (Gestión › Ventas › …) o el buscador superior «Buscar» (Cmd/Ctrl + K), escribiendo el nombre o el código del objeto.
•	Las tipologías se abren en modo ficha con el primer registro (o en modo lista, según la pantalla). Para crear una: botón rojo «Nuevo» arriba a la derecha › «Nuevo» (formulario en blanco) o «Nuevo como» (copia del registro que se está viendo).
•	En las listas de documentos, «Nuevo» abre el formulario en una ventana que se guarda con «Guardar» abajo a la derecha. Los cambios en una ficha se guardan con el icono del disquete de la barra superior.
•	Los botones de acción (Validar, Contabilizar, Anular…) están en la barra superior de la ficha, y las pestañas del registro (Líneas, Vencimientos…) arriba, en horizontal.
•	Los campos con lista (cliente, artículo, plantilla…) son de autocompletar: se escribe el código y se elige la fila. Si después no aparece la descripción debajo del campo, se sale del campo con Tab.
[TABLA]
| Δ | CAMBIO / Los campos obligatorios llevan un asterisco rojo en la etiqueta. Si se guarda sin ellos sale «Hay errores en los datos del formulario» y el campo que falta se marca en rojo con «Este campo es obligatorio». |
[/TABLA]
# EJERCICIO GV 1
Circuito de ventas Albarán-Factura
Primero se definen una tipología de albarán y una de factura unidas entre sí (la factura tiene como origen el albarán). En este ejercicio se contabilizan tanto el albarán como la factura.
## 1. Tipología de albarán ACL
[TABLA]
| ? | ¿PARA QUÉ SIRVE? / La tipología de albarán define cómo se comporta cada albarán de ese tipo: con qué serie se numera, de qué cuenta de stock sale la mercancía, de qué documento viene y si genera asiento contable. Se crea una vez y la usan todos los albaranes de ese tipo. Aquí el albarán es el primer paso del circuito, así que no tiene documento origen. |
[/TABLA]
MENÚ    Gestión   ›   Ventas   ›   Maestros   ›   Documentos   ›   Albaranes (objeto gvenmovd)
[TABLA]
| CAMPO | QUÉ SIGNIFICA | VALOR DE EJEMPLO |
| Tipo movimiento * | Código de la tipología. Es lo que se elige en «Tipo documento» al crear un albarán. | ACL |
| Descripción * | Nombre que verá el usuario en los desplegables. | Albaran ventas CL |
| Serie * | Numerador de los albaranes. El número final es empresa + serie + contador. | AV (0AV000001) |
| Estado * | Solo las tipologías activas se pueden usar en documentos nuevos. | Activo |
| Expedición albarán * | Indica que el documento es un albarán (y no una expedición). | Albarán |
| Cuenta origen * | Cuenta de stock de la que sale la mercancía al validar: el stock disponible baja. | DISP (disponible) |
| Cuenta destino * | Cuenta de stock a la que va: NSAL (no saldo) significa que sale del inventario de la empresa. | NSAL (no saldo) |
| Tabla origen | Documento anterior del circuito. Vacío equivale al antiguo «Ninguno»: el albarán se hace desde cero. | (vacío) |
| Copiar líneas / Actualizar origen | Solo tienen sentido si hay origen; sin origen deben quedar sin marcar. | (sin marcar) |
| Tipo factura | Tipología de factura que se propone al generar la factura desde el albarán. | FV Factura de Ventas |
| Orden * | Orden de aparición en las listas. | 0 |
| Valoración inventario * | Cómo se valora la salida de stock. | Normal |
| Valorar * | De dónde sale el precio de las líneas: de la tarifa del cliente. | Tarifa |
| Relación cliente * | Relación contable del tercero que se usa para la cuenta del cliente (la 430). | CLI Clientes |
| Precio tarifa * | Si la tarifa se aplica al precio sin IVA o con IVA. | Precio |
| Evolución riesgo * | Cómo afecta el albarán al riesgo de crédito del cliente. | Evolución (por defecto) |
| Tipo movimiento (Indicativos) * | Sentido del movimiento de almacén. Un albarán de ventas es una salida. | Salida |
| Validar catálogo * | Si se comprueba que el artículo está en el catálogo del cliente. | No |
| Impresión * | Si se imprime el albarán automáticamente al validarlo. | No |
| Asiento expediciones / Asiento albaranes | Plantilla de asiento que se usa al contabilizar. Vacío = el albarán no se contabiliza. | AV ALBARAN DE VENTA |
| Datos contables | Activado: el albarán genera asientos contables. | Activado |
[/TABLA]
*  Campo obligatorio: sin él no deja guardar.
1 	Abre la ruta. Se muestra la ficha del tipo AV «Albarán de Ventas (Picking)», que sirve de referencia.
2 	Pulsa «Nuevo › Nuevo» (formulario en blanco; ver el PROBLEMA de abajo sobre «Nuevo como»).
3 	Rellena Identificación: ACL, «Albaran ventas CL», serie AV, Albarán, DISP y NSAL.
4 	Deja vacía la Tabla origen y sin marcar Copiar líneas y Actualizar origen.
5 	En Documento destino elige Tipo factura FV.
6 	En la pestaña Valoración elige Normal, Tarifa, CLI y Precio.
7 	En Indicativos cambia Tipo movimiento a «Salida».
8 	En la pestaña Contabilización elige AV en los dos asientos y activa «Datos contables».
9 	Pulsa «Guardar»: sale el aviso verde «Éxito».
[TABLA]
| [IMG:ventas-002.jpg] |
| Figura 1   Alta en blanco: Actualizar origen sin marcar, Tipo factura FV y, en Valoración, los cinco campos obligatorios (asterisco rojo). |
[/TABLA]
[TABLA]
| [IMG:ventas-003.jpg] |
| Figura 2   Pestaña Contabilización: plantilla AV en los dos asientos y «Datos contables» activado. |
[/TABLA]
[TABLA]
| [IMG:ventas-004.jpg] |
| Figura 3   Resultado: tipología ACL guardada; fíjate en la serie AV, DISP › NSAL y la Tabla origen vacía. |
[/TABLA]
[TABLA]
| Δ | CAMBIO / Ya no hay que crear una serie de justificantes nueva (la pantalla cserjush no existe en la base TUTORIAL). Se reutiliza el numerador existente AV. |
[/TABLA]
[TABLA]
| ! | PROBLEMA / Si se crea con «Nuevo › Nuevo como» sobre AV y se vacía la Tabla origen, al guardar sale «El indicativo de actualización de tabla origen sólo puede informarse cuando la tabla origen está informada… Si no hay origen, no se ha de informar». Las tarjetas de «Actualizar origen» (Sumando / Restando / No) heredadas de AV no se pueden desmarcar. |
[/TABLA]
[TABLA]
| [IMG:ventas-005.jpg] |
| Figura 4   Error al guardar: con la Tabla origen vacía, Copiar líneas y Actualizar origen deben quedar sin valor. |
[/TABLA]
[TABLA]
| ✓ | SOLUCIÓN / Cancela y crea la tipología con «Nuevo › Nuevo» (en blanco), donde esos campos vienen vacíos. Es lo que el manual antiguo llamaba «dejar los demás valores en NULL». |
[/TABLA]
[TABLA]
| ! | PROBLEMA / En el formulario en blanco el Tipo movimiento de Indicativos viene como «Entrada». SOLUCIÓN: cámbialo a «Salida»; si no, el albarán sumaría stock en lugar de restarlo. |
[/TABLA]
[TABLA]
| i | A TENER EN CUENTA / En la versión antigua se ponía la plantilla FV en la pestaña Contabilización. En la nueva hay que usar AV; con FV el albarán no se contabiliza (ver el error 2 del apartado 5). Si NO se quiere contabilizar el albarán, se deja la pestaña vacía. |
[/TABLA]
## 2. Tipología de factura FCL
[TABLA]
| ? | ¿PARA QUÉ SIRVE? / La tipología de factura dice de qué documentos se alimenta la factura (aquí, de albaranes), qué albaranes puede recoger y con qué plantilla se contabiliza. Al contabilizar, la plantilla genera el asiento (430 cliente, 470 IVA repercutido, 700 ventas) y la factura crea los vencimientos que pasan a la cartera de cobros. |
[/TABLA]
MENÚ    Gestión   ›   Ventas   ›   Maestros   ›   Documentos   ›   Facturas (objeto gvenfacd)
[TABLA]
| CAMPO | QUÉ SIGNIFICA | VALOR DE EJEMPLO |
| Tipo factura * | Código de la tipología. | FCL |
| Descripción * | Nombre visible. | Factura ventas CL |
| Serie * | Numerador de las facturas. La numeración de facturas debe ser correlativa por serie (obligación fiscal). | FV (0FV000001) |
| Estado * | Solo las activas se pueden usar. | Activo |
| Tabla origen | Documento del que vienen las líneas. «Expediciones» son los albaranes de venta. | Expediciones |
| Condición selección | Filtro SQL de los albaranes que se pueden conformar en esta factura. | tipdoc IN ('ACL','ACL2') |
| Copiar líneas | Sí: al conformar un albarán, sus líneas se copian a la factura. | Sí |
| Actualización tabla origen | Sumando: la cantidad facturada se suma al albarán, que pasa a Facturado y deja de salir como pendiente. | Sumando |
| Precio tarifa / Relación cliente * | Igual que en la tipología de albarán: precio sin IVA y cuenta 430 del tercero. | Precio / CLI (heredados de FV) |
| Clase / Validar catálogo / Impresión * | Indicadores generales de la factura; se dejan los de FV. | (heredados de FV) |
| Compromiso inversión * | Solo para presupuestos de inversión. En ventas, No. | No |
| Tipo asiento | Plantilla de asiento que se usa al contabilizar la factura. | FV FACTURA DE VENTAS |
[/TABLA]
*  Campo obligatorio: sin él no deja guardar.
1 	Abre la ruta. Se muestra el tipo FV «Factura de Ventas», que ya tiene como origen Expediciones.
2 	Pulsa «Nuevo › Nuevo como» para copiar FV.
3 	Cambia Tipo factura a FCL y la Descripción a «Factura ventas CL». Deja la serie FV.
4 	Comprueba Tabla origen Expediciones, marca Copiar líneas «Sí» y deja Actualización «Sumando».
5 	Escribe en Condición selección: tipdoc IN ('ACL','ACL2').
6 	En la pestaña Contabilización comprueba Tipo asiento FV y Compromiso inversión No.
7 	Pulsa «Guardar».
[TABLA]
| [IMG:ventas-006.jpg] |
| Figura 5   Tipología FCL: origen Expediciones, condición de selección con nuestras dos tipologías de albarán y Copiar líneas «Sí». |
[/TABLA]
[TABLA]
| i | A TENER EN CUENTA / La condición de selección hace que, al conformar, solo salgan los albaranes ACL (este ejercicio) y ACL2 (GV 2), y no los de otros compañeros que trabajan en la misma base. |
[/TABLA]
## 3. El tercero como cliente
[TABLA]
| ? | ¿PARA QUÉ SIRVE? / Para vender a un tercero, este tiene que estar dado de alta como cliente. La ficha de cliente guarda las condiciones comerciales: tipo de cliente, comercial, divisa, cómo se agrupan los albaranes al facturar y la tarifa de precios. Los documentos de venta copian estos datos al elegir el cliente. |
[/TABLA]
MENÚ    Gestión   ›   Maestros   ›   Terceros   ›   Clientes (objeto gcliente, «Maestro de clientes   ›   )
[TABLA]
| CAMPO | QUÉ SIGNIFICA | VALOR DE EJEMPLO |
| Cliente * | Tercero que se da de alta como cliente (debe existir en Terceros). | TCL Tercero Claude |
| Fecha alta * | Fecha desde la que es cliente. Se propone la de hoy. | 12-11-2026 |
| Estado * | Provisional hasta que se valida el cliente. | Provisional |
| Comercial * | Tercero responsable comercial del cliente. | TCL |
| Agrupación empresas * | Empresas del grupo que pueden vender a este cliente. | ALL (todas) |
| Grupo | Grupo de clientes, útil para tarifas y estadísticas. | (vacío) |
| Tipo cliente * | Clasificación del cliente. | 0 GENERAL |
| Divisa (Datos financieros) * | Moneda en que se le factura. | EUR |
| Prioridad adjudicación / Portes / Mínimo pedido * | Datos logísticos y comerciales que se proponen al dar de alta. | (por defecto) |
| Facturación y Cobros | Tercero y dirección de facturación, agrupación de albaranes y método de facturación. Se proponen solos. | TCL, dirección 0, «1 Albarán-1 Factura» |
[/TABLA]
*  Campo obligatorio: sin él no deja guardar.
1 	Abre la ruta (o busca «clientes» con Cmd/Ctrl + K) y pulsa «Nuevo».
2 	Elige el Cliente TCL y el Comercial TCL.
3 	En Información general elige Tipo cliente 0 GENERAL.
4 	En Datos financieros informa la Divisa EUR.
5 	Pulsa «Guardar». El cliente aparece en la lista del Maestro de clientes.
[TABLA]
| [IMG:ventas-007.jpg] |
| Figura 6   Alta del cliente: los obligatorios son Cliente, Fecha alta, Estado, Comercial, Agrupación empresas y Tipo cliente. |
[/TABLA]
[TABLA]
| Δ | CAMBIO / El cliente ya no es una pestaña de /ctercero. Es una pantalla propia, el «Maestro de clientes» (gcliente). |
[/TABLA]
[TABLA]
| ! | PROBLEMA / Al guardar sin divisa sale «Hay errores en los datos del formulario». SOLUCIÓN: informa la Divisa en el bloque Datos financieros. |
[/TABLA]
## 4. Albarán de ventas
[TABLA]
| ? | ¿PARA QUÉ SIRVE? / El albarán documenta la mercancía que sale del almacén hacia el cliente: al validarlo baja el stock. Es la base para facturar: después se recoge (se «conforma») en la factura. Si su tipología tiene plantilla de asiento, además se puede contabilizar como venta pendiente de facturar. |
[/TABLA]
MENÚ    Gestión   ›   Ventas   ›   Albaranes   ›   Registro (objeto gvenalbh)
[TABLA]
| CAMPO | QUÉ SIGNIFICA | VALOR DE EJEMPLO |
| Tipo documento * | Tipología del albarán; decide serie, stock y contabilización. | ACL |
| Empresa / Delegación / Departamento * | Unidad de negocio. Se proponen por defecto. | 0 / CENTRAL / VENTAS |
| Almacén * | Almacén del que sale la mercancía. | ALMACEN CENTRAL |
| Fecha albarán * | Fecha de la salida de mercancía. | 12-11-2026 |
| Origen | Documento anterior (pedido). Vacío porque ACL no tiene origen. | (vacío) |
| Cliente / Dirección * | A quién se vende. «Entregar en» (Tercero) se rellena con la dirección del cliente. | TCL / 0 |
| Tipo Efecto / Forma Pago * | Condiciones de cobro; se proponen del tercero y pasan a la factura. | EF / 30D |
| Divisa / Cambio * | Moneda del albarán y su cambio. | EUR / 1 |
| Tipo de identificación / País emisor / CIF * | Datos fiscales del cliente; se copian del tercero. | (del tercero) |
| Situación / Estado * | Pendiente (de facturar) y Provisional (aún no validado). Los pone el sistema. | Pendiente / Provisional |
[/TABLA]
*  Campo obligatorio: sin él no deja guardar.
Líneas del albarán (pestaña Líneas › Nuevo):
[TABLA]
| CAMPO | QUÉ SIGNIFICA | VALOR DE EJEMPLO |
| Artículo * | Producto que se entrega. Sale del maestro de artículos. | 13500620 6000-2RS ISB |
| VL / Lote * | Variante logística y lote del artículo; 0 si el artículo no los usa. | 0 / 0 |
| Cantidad / Unidad * | Cantidad que sale del almacén y su unidad. | 10 UNIDAD |
| Cantidad precio / Unidad precio * | Cantidad y unidad sobre las que se calcula el importe. Se copian de la cantidad. | 10 UNIDAD |
| Precio | Precio unitario sin IVA. Sin tarifa asignada al cliente no se propone y hay que escribirlo. | 20,00 |
| Precio con IVA | Alternativa al Precio, con IVA incluido. Se excluyen: al escribir uno se vacía el otro. | (vacío) |
| Importe dto. | Descuento en importe. | 0 |
| Importe neto * | Cantidad × precio − descuentos. Lo calcula el sistema; es la base imponible de la línea. | 200,00 |
| Ubicación Origen / Ubicación Destino / Depósito * | Ubicación del almacén de la que sale la mercancía y depósito. Se proponen. | 0 / 0 / 0 |
[/TABLA]
*  Campo obligatorio: sin él no deja guardar.
1 	Abre la ruta y pulsa «Nuevo».
2 	Elige Tipo documento ACL y el Cliente TCL con dirección 0. Comprueba Almacén, Delegación y Departamento.
3 	Pulsa «Guardar»: el albarán recibe el número 0AV000001. Abre su ficha (clic en el número de fila o «Ver registro»).
4 	En la pestaña Líneas pulsa «Nuevo», elige el artículo 13500620 y sal del campo con Tab.
5 	Escribe Cantidad 10, Precio 20 e Importe dto. 0. Pulsa «Guardar»: importe neto 200,00.
6 	Pulsa «Validar» (botón verde arriba).
[TABLA]
| [IMG:ventas-008.jpg] |
| Figura 7   Cabecera del albarán: tipo ACL, unidad de negocio por defecto y «Entregar en» rellenado solo con la dirección del cliente. |
[/TABLA]
[TABLA]
| [IMG:ventas-009.jpg] |
| Figura 8   Línea: Cantidad 10 y Precio 20,00; el «Precio con IVA» queda vacío. |
[/TABLA]
[TABLA]
| [IMG:ventas-010.jpg] |
| Figura 9   Resultado: albarán validado; en la barra superior aparecen Contabilizar, No facturable, Anular y Pasar a provisional. |
[/TABLA]
[TABLA]
| Δ | CAMBIO / El albarán ya no queda «Bloqueado» ni se valida con un botón abajo a la izquierda. Queda Provisional y Validar está en la barra superior. |
[/TABLA]
## 5. Contabilizar el albarán
[TABLA]
| ? | ¿PARA QUÉ SIRVE? / Contabilizar el albarán registra la venta en contabilidad antes de facturarla: la plantilla AV carga la 43090 «Ventas pendiente de factura» contra ventas. Se usa cuando hay que reconocer el ingreso en el mes en que se entrega la mercancía aunque la factura se emita después. |
[/TABLA]
MENÚ    Ficha del albarán   ›   botón «Contabilizar
[TABLA]
| CAMPO | QUÉ SIGNIFICA | VALOR DE EJEMPLO |
| Fecha contabilización * | Fecha del asiento. Debe caer en un ejercicio y periodo abiertos. | 12-11-2026 |
| Prevista de Asiento Contable | Marcada: enseña el asiento que se generaría sin grabar nada. | Sin marcar |
[/TABLA]
*  Campo obligatorio: sin él no deja guardar.
1 	En el albarán validado pulsa «Contabilizar».
2 	Comprueba la fecha y pulsa «Aceptar».
3 	Si sale un error, resuélvelo como se indica abajo y vuelve a pulsar «Contabilizar › Aceptar».
[TABLA]
| [IMG:ventas-011.jpg] |
| Figura 10   Diálogo de Contabilizar con la casilla nueva «Prevista de Asiento Contable». |
[/TABLA]
[TABLA]
| Δ | CAMBIO / La casilla «Prevista de Asiento Contable» es nueva: permite revisar el asiento antes de generarlo. |
[/TABLA]
[TABLA]
| ! | PROBLEMA (ERROR 1) / «iges_get_ctertipo_cuenta: CUENTA DEL TERCERO [TCL] NO INFORMADA». El tercero no tiene relación contable de cliente, así que el ERP no sabe a qué cuenta 430 cargar. En la versión antigua salía al contabilizar la factura. |
[/TABLA]
[TABLA]
| [IMG:ventas-012.jpg] |
| Figura 11   Error 1: el tercero TCL no tiene cuenta contable de cliente. |
[/TABLA]
[TABLA]
| ✓ | SOLUCIÓN / Terceros (ctercero) › TCL › pestaña Relaciones › «Añadir relación»: Tipo tercero Cliente, Tipo relación CLI Clientes, Plan contable PGE 2008 y Cuenta 43000.00000 «Clientes (euros)», elegida del desplegable. Guardar. |
[/TABLA]
[TABLA]
| CAMPO | QUÉ SIGNIFICA | VALOR DE EJEMPLO |
| Tipo tercero * | Papel del tercero en la relación. | Cliente |
| Tipo relación * | Tipo de cuenta; CLI es la nemotécnica 43000 (el antiguo «430»). La tipología pide esta relación. | CLI Clientes |
| Plan contable * | Plan de cuentas de la empresa. | PGE 2008 (ES) |
| Cuenta | Cuenta contable real donde se cargan las ventas a crédito del cliente. | 43000.00000 |
[/TABLA]
*  Campo obligatorio: sin él no deja guardar.
[TABLA]
| [IMG:ventas-013.jpg] |
| Figura 12   Relación contable de cliente: tipo CLI, plan PGE 2008 y cuenta 43000.00000. |
[/TABLA]
[TABLA]
| ! | PROBLEMA (ERROR 2) / «gconasih_ApplyParams: EXPRESION:[cabecera.impant] NO CONTEMPLADA PARA EVALUAR IMPORTE». La plantilla FV es de facturas: usa el importe de anticipos de la cabecera de la factura, que un albarán no tiene. |
[/TABLA]
[TABLA]
| [IMG:ventas-014.jpg] |
| Figura 13   Error 2: la plantilla FV no sirve para albaranes. |
[/TABLA]
[TABLA]
| ✓ | SOLUCIÓN / En Contabilidad › Asientos programables (gconasih) existe la plantilla AV «ALBARAN DE VENTA». En la tipología ACL, pestaña Contabilización, pon AV en «Asiento expediciones» y «Asiento albaranes» y guarda con el disquete. |
[/TABLA]
[TABLA]
| [IMG:ventas-015.jpg] |
| Figura 14   Líneas de la plantilla AV: 43090 «Ventas pendiente de factura» por el total contra ventas según los datos contables del artículo. |
[/TABLA]
[TABLA]
| [IMG:ventas-016.jpg] |
| Figura 15   Resultado: albarán con Fecha contabilización y el botón «Descontabilizar». |
[/TABLA]
[TABLA]
| i | A TENER EN CUENTA / Si la tipología no tiene asientos, el albarán se queda en Validado. Es suficiente para facturarlo. |
[/TABLA]
[TABLA]
| ✓   QUÉ HAS CONSEGUIDO |
| ✓	Tipología de albarán ACL (sin origen, salida de almacén, asiento AV) y tipología de factura FCL (origen albaranes, asiento FV). / ✓	Cliente TCL en el Maestro de clientes y relación contable CLI 43000.00000 en el tercero. / ✓	Albarán 0AV000001: 10 × 20,00 = 200,00, validado y contabilizado. / ✓	Comprobación: en Gestión › Ventas › Albaranes el 0AV000001 sale con Situación Pendiente (de facturar) y fecha de contabilización. |
[/TABLA]
## 6. Factura de ventas: conformar y contabilizar
[TABLA]
| ? | ¿PARA QUÉ SIRVE? / La factura es el documento fiscal que se envía al cliente y da derecho a cobrar. No se teclean las líneas: se «conforman» los albaranes pendientes, que pasan a Facturado. Al contabilizarla se genera el asiento de venta con IVA y el vencimiento que entra en la cartera de cobros. |
[/TABLA]
MENÚ    Gestión   ›   Ventas   ›   Facturas   ›   Registro (objeto gvenfach)
[TABLA]
| CAMPO | QUÉ SIGNIFICA | VALOR DE EJEMPLO |
| Tipo documento * | Tipología de la factura: serie, origen y plantilla contable. | FCL |
| Empresa / Delegación / Departamento * | Unidad de negocio. Se proponen por defecto. | 0 / CENTRAL / VENTAS |
| Fecha factura * | Fecha de emisión; determina el periodo de IVA. | 12-11-2026 |
| Fecha valor * | Fecha a partir de la que se calculan los vencimientos. | 12-11-2026 |
| Cliente / Dirección * | A quién se factura. «Facturar a» se rellena solo. | TCL / 0 |
| Origen | No se informa a mano: las líneas llegan al conformar albaranes. | (vacío) |
| Tipo efecto / Forma pago * | Generan los vencimientos de la cartera. Se proponen del tercero. | EF / 30D |
| Divisa / Cambio * | Moneda de la factura. | EUR / 1 |
| Estado * | Provisional hasta que se conforman los albaranes. | Provisional |
[/TABLA]
*  Campo obligatorio: sin él no deja guardar.
1 	Abre la ruta y pulsa «Nuevo».
2 	Elige Tipo documento FCL y el Cliente TCL con dirección 0. Pulsa «Guardar»: factura 0FV000001.
3 	En la ficha, abre el desplegable (⌄) junto al título › «Albaranes de ventas a conformar».
4 	Marca el albarán 0AV000001 (abajo se ven sus líneas), pulsa «Conformar» y «Aceptar».
5 	Cierra la ventana y pulsa «Recargar»: la factura tiene la línea y queda validada.
6 	Pulsa «Contabilizar». Para revisar antes el asiento, marca «Prevista de Asiento Contable»; después repite sin la casilla y pulsa «Aceptar».
7 	Abre la pestaña «Vencimientos» para ver el cobro previsto.
[TABLA]
| [IMG:ventas-017.jpg] |
| Figura 16   Cabecera de la factura FCL: el campo Origen se deja vacío. |
[/TABLA]
[TABLA]
| [IMG:ventas-018.jpg] |
| Figura 17   Desplegable junto al título: aquí está «Albaranes de ventas a conformar». |
[/TABLA]
[TABLA]
| Δ | CAMBIO / Ya no hay botón ni pestaña «Conformar albaranes». La opción está en el desplegable (⌄) junto al título de la factura, junto con «Desconformar Albaranes de ventas». |
[/TABLA]
[TABLA]
| [IMG:ventas-019.jpg] |
| Figura 18   Ventana de conformar: solo sale el albarán ACL 0AV000001 gracias a la condición de selección de FCL. |
[/TABLA]
[TABLA]
| [IMG:ventas-020.jpg] |
| Figura 19   Resultado: la línea llega del albarán (10 × 20,00) y la factura ya muestra Contabilizar: queda validada al conformar. |
[/TABLA]
[TABLA]
| [IMG:ventas-021.jpg] |
| Figura 20   Prevista de asiento: 43000 Debe 242,00 (cliente), 47000 Haber 42,00 (IVA 21 %), 70000 Haber 200,00 (ventas). |
[/TABLA]
[TABLA]
| [IMG:ventas-022.jpg] |
| Figura 21   Resultado: Situación Contabilizada y Fecha registro contable informada. |
[/TABLA]
[TABLA]
| [IMG:ventas-023.jpg] |
| Figura 22   Pestaña Vencimientos: un efecto EF de 242,00 según la condición de cobro EF 30D del tercero. |
[/TABLA]
[TABLA]
| Δ | CAMBIO / No salieron los errores del manual antiguo de /cempresa y /cejercic (fechas fuera de vigencia), porque la empresa 0 y su ejercicio 2026 ya están definidos en TUTORIAL; ni el de asiento descuadrado, porque la cuenta 430 se puso bien desde el principio. |
[/TABLA]
[TABLA]
| i | A TENER EN CUENTA / El albarán ya se contabilizó (ventas contra 43090) y la factura usa FV (ventas contra 430), así que la venta queda registrada dos veces. En un circuito real con albarán contabilizado, la factura debería usar una plantilla que salde la 43090 (en Asientos programables existe FVOA «Factura venta origen albarán cont. total»). Aquí se mantiene FV para seguir el ejercicio original. |
[/TABLA]
[TABLA]
| ✓   QUÉ HAS CONSEGUIDO |
| ✓	Factura 0FV000001 (FCL, cliente TCL) con la línea del albarán 0AV000001: base 200,00 + IVA 42,00 = 242,00. / ✓	Asiento de venta: 430 Debe 242,00 / 470 Haber 42,00 / 700 Haber 200,00. / ✓	Vencimiento EF de 242,00 en la cartera de cobros. / ✓	Comprobación: la factura sale como Contabilizada en Gestión › Ventas › Facturas, y el albarán 0AV000001 pasa a Situación Facturado en la lista de albaranes. |
[/TABLA]
# EJERCICIO GV 2
Circuito de ventas Oferta-Pedido-Albarán-Factura
En este circuito NO se contabilizan los albaranes, SÍ las facturas. Cada paso tiene su tipología, distinta de las del GV 1 (salvo la factura, que se reutiliza), y cada tipología tiene como origen la anterior para que la cadena quede unida.
## 1. Tipología de ofertas OCL
[TABLA]
| ? | ¿PARA QUÉ SIRVE? / La oferta es la propuesta de precio que se envía al cliente antes de que compre. No mueve stock ni contabilidad. Si el cliente la acepta, se convierte en pedido. La tipología define su serie y que es el primer paso (sin origen). |
[/TABLA]
MENÚ    Gestión   ›   Ventas   ›   Maestros   ›   Documentos   ›   Ofertas (objeto gvenofed)
[TABLA]
| CAMPO | QUÉ SIGNIFICA | VALOR DE EJEMPLO |
| Tipo oferta * | Código de la tipología. | OCL |
| Descripción | Nombre visible. | Oferta ventas CL |
| Serie * | Numerador de las ofertas. | OV (0OV000001) |
| Estado * | Activo para poder usarla. | Activo |
| Tabla origen | Vacía: la oferta es el primer paso del circuito. | (vacío) |
| Copiar línea origen | Sin origen, se deja sin marcar. | (sin marcar) |
| Precio tarifa / Validar catálogo * | Precio sin IVA y sin control de catálogo; heredados de OV. | Precio / No |
[/TABLA]
*  Campo obligatorio: sin él no deja guardar.
1 	Abre la ruta (aquí se abre en modo lista) y abre el tipo OV «Oferta de Venta».
2 	Pulsa «Nuevo › Nuevo como».
3 	Cambia Tipo oferta a OCL y la Descripción a «Oferta ventas CL». Deja la serie OV y la Tabla origen vacía.
4 	Pulsa «Guardar».
[TABLA]
| [IMG:ventas-024.jpg] |
| Figura 23   Tipología OCL: serie OV, Tabla origen vacía y Copiar línea origen sin marcar. |
[/TABLA]
[TABLA]
| Δ | CAMBIO / Ya no hay que crear una serie de justificantes para ofertas; se usa el numerador OV. La vigencia tampoco se define en la serie, sino en cada oferta (Inicio vigencia y Fin vigencia). |
[/TABLA]
## 2. Tipología de pedido PCL
[TABLA]
| ? | ¿PARA QUÉ SIRVE? / El pedido recoge el compromiso del cliente: qué quiere, cuánto y cuándo. Reserva la demanda y es lo que el almacén sirve. Esta tipología toma como origen la oferta y copia sus líneas, y al servirse se convierte en albarán. |
[/TABLA]
MENÚ    Gestión   ›   Ventas   ›   Maestros   ›   Documentos   ›   Pedidos (objeto gvenpedd)
[TABLA]
| CAMPO | QUÉ SIGNIFICA | VALOR DE EJEMPLO |
| Tipo pedido * | Código de la tipología. | PCL |
| Descripción | Nombre visible. | Pedido ventas CL |
| Serie * | Numerador de los pedidos. | PV (0PV000002) |
| Tipo * | Clase de pedido. | Normal |
| Estado * | Activo para poder usarla. | Activo |
| Tabla origen | Documento anterior: la oferta. | Oferta |
| Copiar línea origen | Sí: al elegir la oferta, el pedido copia sus líneas automáticamente. | Sí |
| Actualización tabla origen | Sumando: la cantidad pedida se suma a la oferta, que queda cursada. | Sumando |
| Albarán ventas (Destinos) | Tipología de albarán que se propone al servir el pedido. | AV |
| Clave impositiva | Régimen de IVA por defecto. | General |
| Relación cliente * | Relación contable del tercero que se usa (cuenta 430). | CLI Clientes |
| Precio tarifa / Evolución riesgo / Validar catálogo / Stock planificado / Impresión * | Indicadores generales del pedido; se dejan los heredados de POF. | (heredados de POF) |
[/TABLA]
*  Campo obligatorio: sin él no deja guardar.
1 	Abre la ruta y abre el tipo POF «Pedido (con Oferta)», que ya tiene origen Oferta.
2 	Pulsa «Nuevo › Nuevo como».
3 	Cambia Tipo pedido a PCL y la Descripción a «Pedido ventas CL». Deja la serie PV.
4 	Comprueba Tabla origen Oferta, Copiar línea origen «Sí» y Actualización «Sumando».
5 	Comprueba Destinos › Albarán ventas AV y, en Impuestos, Relación cliente CLI.
6 	Pulsa «Guardar».
[TABLA]
| [IMG:ventas-025.jpg] |
| Figura 24   Tipología PCL: Actualización «Sumando», destino Albarán AV y Relación cliente CLI (obligatoria). |
[/TABLA]
## 3. Tipología de albarán ACL2
[TABLA]
| ? | ¿PARA QUÉ SIRVE? / Es el albarán de este circuito: nace del pedido, copia sus líneas y descuenta stock, pero no genera asiento. La venta se registrará en contabilidad solo al contabilizar la factura. |
[/TABLA]
MENÚ    Gestión   ›   Ventas   ›   Maestros   ›   Documentos   ›   Albaranes (objeto gvenmovd)
[TABLA]
| CAMPO | QUÉ SIGNIFICA | VALOR DE EJEMPLO |
| Tipo movimiento * | Código de la tipología. | ACL2 |
| Descripción * | Nombre visible. | Albaran ventas CL desde pedido |
| Serie / Expedición albarán * | Mismo numerador y tipo que ACL. | AV / Albarán |
| Cuenta origen / Cuenta destino * | La mercancía sale del stock disponible. | DISP / NSAL |
| Tabla origen | Documento anterior: el pedido. | Pedidos de venta |
| Copiar líneas | Sí: copia las líneas del pedido. | Sí |
| Actualizar origen | Sumando: la cantidad servida se suma al pedido, que pasa a «Servido o Facturado». | Sumando |
| Asiento expediciones / Asiento albaranes | Vacíos: el albarán no se contabiliza. | (vacío) |
| Datos contables | Desactivado. | Desactivado |
[/TABLA]
*  Campo obligatorio: sin él no deja guardar.
1 	Abre la ruta (se muestra el tipo AV) y pulsa «Nuevo › Nuevo como».
2 	Cambia Tipo movimiento a ACL2 y la Descripción a «Albaran ventas CL desde pedido».
3 	Elige Tabla origen «Pedidos de venta», Copiar líneas «Sí» y Actualizar origen «Sumando».
4 	En la pestaña Contabilización deja vacíos los dos asientos y desactiva «Datos contables».
5 	Pulsa «Guardar».
[TABLA]
| [IMG:ventas-026.jpg] |
| Figura 25   Tipología ACL2: Tabla origen «Pedidos de venta» y Copiar líneas «Sí». |
[/TABLA]
[TABLA]
| i | A TENER EN CUENTA / Como este albarán sí tiene origen, aquí «Nuevo como» sobre AV funciona sin el error del GV 1. |
[/TABLA]
## 4. Tipología de factura
Se reutiliza la tipología FCL del GV 1: tiene el mismo origen (albaranes), contabiliza con FV y su condición de selección tipdoc IN ('ACL','ACL2') ya admite el albarán ACL2.
## 5. Oferta
[TABLA]
| ? | ¿PARA QUÉ SIRVE? / Se registra la propuesta al cliente con sus precios y su vigencia. Mientras está vigente y validada se puede convertir en pedido; si vence, ya no aparece como origen. La adjudicación indica si el cliente la ha aceptado (Pendiente o Cursada). |
[/TABLA]
MENÚ    Gestión   ›   Ventas   ›   Ofertas   ›   Registro (objeto gvenofeh)
[TABLA]
| CAMPO | QUÉ SIGNIFICA | VALOR DE EJEMPLO |
| Tipo Documento * | Tipología de la oferta. | OCL |
| Empresa / Delegación / Departamento * | Unidad de negocio, por defecto. | 0 / CENTRAL / VENTAS |
| Fecha oferta * | Fecha de emisión. | 12-11-2026 |
| Inicio vigencia / Fin vigencia * | Periodo en que el precio ofertado es válido. Fuera de él la oferta no se puede pasar a pedido. | 12-11-2026 / 31-12-2026 |
| Cliente / Dirección * | A quién se oferta. | TCL / 0 |
| Agente * | Comercial que lleva la venta; sirve para comisiones y estadísticas. | A01 Agente 01 |
| Tipo Efecto / Forma Pago * | Cómo y cuándo pagará el cliente. Se proponen del tercero. | EF / 30D |
| Divisa / Cambio / Cálculo * | Moneda de la oferta y cómo se calcula el importe. | EUR / 1 / (por defecto) |
| Adjudicación / Estado * | Pendiente de aceptar y Provisional (sin validar). Los pone el sistema. | Pendiente / Provisional |
[/TABLA]
*  Campo obligatorio: sin él no deja guardar.
Línea de la oferta (pestaña Líneas › Nuevo): Artículo 13500620, Cantidad ofertada 5, Precio 22,00 (Precio con IVA vacío). El importe neto se calcula solo: 110,00. Los bloques Agente y Fechas de entrega de la línea son opcionales.
1 	Abre la ruta y pulsa «Nuevo».
2 	Elige Tipo documento OCL y el Cliente TCL con dirección 0.
3 	Cambia el Fin vigencia a 31-12-2026 (por defecto viene el mismo día).
4 	En Información general elige el Agente A01.
5 	Pulsa «Guardar»: oferta 0OV000001.
6 	En la pestaña Líneas pulsa «Nuevo»: artículo 13500620, Cantidad ofertada 5, Precio 22. Guarda.
7 	Pulsa «Validar» (botón verde arriba).
[TABLA]
| [IMG:ventas-027.jpg] |
| Figura 26   Cabecera de la oferta: tipo OCL y vigencia del 12-11-2026 al 31-12-2026. |
[/TABLA]
[TABLA]
| ! | PROBLEMA / Al guardar sale «Hay errores en los datos del formulario» y el campo Agente se marca en rojo. SOLUCIÓN: en Información general elige el Agente A01 «Agente 01» y vuelve a guardar. |
[/TABLA]
[TABLA]
| [IMG:ventas-028.jpg] |
| Figura 27   Error: el Agente es obligatorio. Tipo efecto EF y Forma pago 30D se han propuesto del tercero. |
[/TABLA]
[TABLA]
| [IMG:ventas-029.jpg] |
| Figura 28   Línea de la oferta: Precio 22,00; el Agente y las Fechas de entrega de la línea son opcionales. |
[/TABLA]
[TABLA]
| [IMG:ventas-030.jpg] |
| Figura 29   Resultado: oferta validada; aparecen Pasar a provisional y Cerrar y desaparece «Nuevo» en las líneas. |
[/TABLA]
[TABLA]
| Δ | CAMBIO / La oferta no queda «Bloqueada» con el botón Validar abajo a la izquierda; queda Provisional y Validar está en la barra superior. |
[/TABLA]
[TABLA]
| i | A TENER EN CUENTA / Usa datos parecidos al mundo real. Una vigencia de un solo día es poco habitual y además impide pasar la oferta a pedido al día siguiente. |
[/TABLA]
## 6. Pedido
[TABLA]
| ? | ¿PARA QUÉ SIRVE? / El pedido nace de la oferta aceptada: copia sus líneas y la oferta queda cursada. A partir de aquí el almacén prepara la mercancía. Su situación (Pendiente, Parcial, Servido o Facturado) dice cuánto queda por servir. |
[/TABLA]
MENÚ    Gestión   ›   Ventas   ›   Pedidos   ›   Registro (objeto gvenpedh)
[TABLA]
| CAMPO | QUÉ SIGNIFICA | VALOR DE EJEMPLO |
| Tipo documento * | Tipología del pedido. | PCL |
| Empresa / Delegación / Departamento * | Unidad de negocio, por defecto. | 0 / CENTRAL / VENTAS |
| Almacén * | Almacén que servirá el pedido. | ALMACEN CENTRAL |
| Fecha pedido * | Fecha en que el cliente hace el pedido. | 12-11-2026 |
| Inicio entrega / Fin entrega * | Plazo de entrega comprometido con el cliente. | 12-11-2026 / 12-11-2026 |
| Origen | Oferta de la que viene. Solo se ofrecen ofertas validadas y vigentes del cliente. | 0OV000001 |
| Cliente / Dirección * | A quién se vende. | TCL / 0 |
| Agente * | Se trae de la oferta. | A01 |
| Tipo efecto / Forma pago * | Condiciones de cobro, propuestas del tercero. | EF / 30D |
| Divisa / Cambio * | Moneda del pedido. | EUR / 1 |
| Entregas parciales / Reservas parciales / Prioridad adjudicación * | Si se puede servir y reservar por partes; se proponen del cliente. | (por defecto) |
| Situación / Estado * | Pendiente y Provisional; los pone el sistema. | Pendiente / Provisional |
[/TABLA]
*  Campo obligatorio: sin él no deja guardar.
1 	Abre la ruta y pulsa «Nuevo».
2 	Elige Tipo documento PCL y comprueba el Almacén CENTRAL.
3 	Elige primero el Origen 0OV000001 y después el Cliente TCL con dirección 0.
4 	Pulsa «Guardar»: pedido 0PV000002. La pestaña Líneas ya trae la línea de la oferta.
5 	Pulsa «Validar».
[TABLA]
| [IMG:ventas-031.jpg] |
| Figura 30   Cabecera del pedido: Origen 0OV000001 y Agente A01 traído de la oferta. |
[/TABLA]
[TABLA]
| ! | PROBLEMA / Al elegir el Origen se vacía el Cliente. SOLUCIÓN: elige primero el Origen y después vuelve a poner el Cliente. |
[/TABLA]
[TABLA]
| Δ | CAMBIO / En el manual antiguo el pedido «no reconocía el origen» y hubo que cambiar la fecha final de la oferta. Es el mismo motivo: una oferta con la vigencia vencida no aparece como origen. Por eso se amplió el Fin vigencia. |
[/TABLA]
[TABLA]
| [IMG:ventas-032.jpg] |
| Figura 31   Resultado: la línea de la oferta se ha copiado sola (5 × 22,00 = 110,00) porque PCL tiene Copiar línea origen «Sí». |
[/TABLA]
## 7. Albarán
[TABLA]
| ? | ¿PARA QUÉ SIRVE? / Se sirve el pedido: el albarán copia sus líneas, descuenta el stock al validarse y deja el pedido como servido. En este circuito no se contabiliza; queda Validado y pendiente de facturar. |
[/TABLA]
MENÚ    Gestión   ›   Ventas   ›   Albaranes   ›   Registro (objeto gvenalbh)
[TABLA]
| CAMPO | QUÉ SIGNIFICA | VALOR DE EJEMPLO |
| Tipo documento * | Tipología del albarán. | ACL2 |
| Almacén * | Almacén del que sale la mercancía. | ALMACEN CENTRAL |
| Fecha albarán * | Fecha de salida. | 12-11-2026 |
| Origen | Pedido que se sirve. | 0PV000002 |
| Cliente / Dirección * | A quién se entrega. | TCL / 0 |
| Agente | Heredado del pedido. | A01 |
[/TABLA]
*  Campo obligatorio: sin él no deja guardar.
1 	Abre la ruta y pulsa «Nuevo».
2 	Elige Tipo documento ACL2, el Origen 0PV000002 y después el Cliente TCL con dirección 0.
3 	Pulsa «Guardar»: albarán 0AV000002. La pestaña Líneas trae la línea del pedido.
4 	Revisa el importe neto de la línea (ver PROBLEMA).
5 	Pulsa «Validar». No aparece «Contabilizar», porque ACL2 no tiene asientos.
[TABLA]
| [IMG:ventas-033.jpg] |
| Figura 32   Cabecera del albarán ACL2 con Origen 0PV000002. |
[/TABLA]
[TABLA]
| ! | PROBLEMA / La línea copiada trae el precio correcto (22,00) pero un importe neto de 2,50 en lugar de 110,00. |
[/TABLA]
[TABLA]
| [IMG:ventas-034.jpg] |
| Figura 33   Línea copiada del pedido: precio 22,00 pero importe neto 2,50 (incorrecto). |
[/TABLA]
[TABLA]
| ✓ | SOLUCIÓN / Abre la línea (clic en el número de fila; se abre un panel lateral), vuelve a escribir el Precio 22 y el Importe dto. 0 y guarda con el disquete del panel. El importe neto se recalcula a 110,00. Revisa siempre los importes de las líneas copiadas antes de validar. |
[/TABLA]
[TABLA]
| [IMG:ventas-035.jpg] |
| Figura 34   Panel de la línea tras corregir: importe neto 110,00. |
[/TABLA]
[TABLA]
| [IMG:ventas-036.jpg] |
| Figura 35   Resultado: albarán validado por 110,00, sin botón Contabilizar. |
[/TABLA]
## 8. Factura: conformar y contabilizar
[TABLA]
| ? | ¿PARA QUÉ SIRVE? / Igual que en el GV 1: la factura recoge el albarán pendiente y, al contabilizarla, registra la venta y el IVA y crea el vencimiento. Es el único asiento del circuito, porque ni la oferta, ni el pedido, ni este albarán contabilizan. |
[/TABLA]
MENÚ    Gestión   ›   Ventas   ›   Facturas   ›   Registro (objeto gvenfach)
Los campos son los mismos que en el GV 1 (apartado 6): Tipo documento FCL, Cliente TCL, dirección 0 (si no se rellena sola, sal del campo Cliente con Tab).
1 	Abre la ruta, pulsa «Nuevo», elige FCL y el Cliente TCL y pulsa «Guardar»: factura 0FV000002.
2 	Abre el desplegable (⌄) junto al título › «Albaranes de ventas a conformar».
3 	Marca el albarán 0AV000002, pulsa «Conformar» y «Aceptar».
4 	Cierra la ventana y pulsa «Recargar»: la factura tiene la línea y queda validada.
5 	Pulsa «Contabilizar › Aceptar». Se abre la ventana del asiento generado; mira su pestaña «Líneas de apuntes».
[TABLA]
| [IMG:ventas-037.jpg] |
| Figura 36   Ventana de conformar: sale el ACL2 0AV000002 y ya no el 0AV000001, que está facturado. |
[/TABLA]
[TABLA]
| [IMG:ventas-038.jpg] |
| Figura 37   Resultado de conformar: en «Albaranes conformados» se ve la cadena completa (albarán 0AV000002, origen pedido 0PV000002). |
[/TABLA]
[TABLA]
| [IMG:ventas-039.jpg] |
| Figura 38   Apuntes del asiento: 430 Debe 133,10 / 470 IVA 23,10 / 700 Ventas 110,00; Debe = Haber, cuadre 0,00. |
[/TABLA]
[TABLA]
| [IMG:ventas-040.jpg] |
| Figura 39   Lista de pedidos: el 0PV000002 queda en situación «Servido o Facturado». |
[/TABLA]
[TABLA]
| i | A TENER EN CUENTA / Lo habitual es que la tipología de factura solo muestre albaranes validados y pendientes de facturar. En la versión nueva los albaranes ya facturados no vuelven a salir en la ventana de conformar. |
[/TABLA]
[TABLA]
| Δ | CAMBIO / No salieron los errores del manual antiguo al contabilizar la factura. La relación de cliente 430 ya se añadió en el GV 1, la empresa 0 y el ejercicio 2026 ya existen en TUTORIAL, y el asiento cuadra porque la cuenta del tercero es la 43000.00000. |
[/TABLA]
[TABLA]
| ✓ | SOLUCIÓN / Si en tu entorno saliera «fechas fuera de rango de vigencia en empresa», revisa la fecha de inicio de la empresa (cempresa) y crea el ejercicio del año (cejercic), como en la versión antigua. |
[/TABLA]
[TABLA]
| ✓   QUÉ HAS CONSEGUIDO |
| ✓	Tipologías OCL (oferta), PCL (pedido, origen oferta) y ACL2 (albarán, origen pedido, sin asiento); se reutiliza FCL. / ✓	Oferta 0OV000001 › pedido 0PV000002 › albarán 0AV000002 › factura 0FV000002, todos por 5 × 22,00 = 110,00. / ✓	Solo la factura está contabilizada: asiento DV de 133,10 (110,00 + IVA 23,10) y su vencimiento. / ✓	Comprobación: el pedido sale «Servido o Facturado» con origen 0OV000001, el albarán 0AV000002 «Facturado» y la factura «Contabilizada». |
[/TABLA]