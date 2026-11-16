[IMG:compras-001.png]
DEISTER MANAGER  ·  MANUAL DE FORMACIÓN
SESIÓN 7
Gestión de compras
[TABLA]
|  |
[/TABLA]
Ejercicios documentados en la versión nueva del ERP
CONTENIDO
—	Cómo moverse por la versión nueva
01	Nuevo proveedor y tarifa de compras
02	Circuito de compras Albarán - Factura
03	Circuito Oferta - Pedido - Albarán - Factura
# Índice
Cómo usar este manual	3
Cómo moverse por la versión nueva	5
Ejercicio 1. Nuevo proveedor y tarifa de compras	6
Tercero	6
Relaciones contables del tercero	8
Direcciones	10
Condiciones de cobro y de pago	11
Lista de precios de compra (tarifa)	13
Grupo de precios de compra	15
Proveedor	16
Ejercicio 2. Circuito de compras Albarán - Factura	20
Tipología de albarán	20
Tipología de factura	22
Albarán de compras	24
Factura de compras	28
Conformar la factura con el albarán	29
Contabilizar la factura	31
Ejercicio 3. Circuito Oferta - Pedido - Albarán - Factura	38
Tipología de oferta	38
Tipología de pedido	39
Oferta de compras	41
Pedido de compras	43
Tipología de albarán con origen	47
Albarán de compras con origen	48
Factura, conformar y contabilizar	51
# Cómo usar este manual
Este manual repite los ejercicios de la Sesión 7 sobre la versión nueva del ERP (Deister Manager, base BBDD TUTORIAL en nextdemo.geasa.eu). Para cada pantalla explica para qué sirve en el negocio, dónde está, qué significa cada campo y qué consecuencias tiene, y los pasos exactos. Las capturas solo muestran la pantalla clave, el resultado o el error.
En los ejemplos se usan las iniciales CL (tercero TCL, tarifa TFCL, grupo GCL, albarán ACL, factura FCCL…). Sustitúyelas por las tuyas. Los campos marcados como obligatorios llevan asterisco rojo en la pantalla: si falta alguno, al guardar sale «Hay errores en los datos del formulario».
El circuito de compras completo es: Oferta del proveedor › Pedido › Albarán (la mercancía entra en el almacén) › Factura (se conforma con el albarán) › Contabilización (asiento de compras y deuda con el proveedor). Antes de empezar hay que tener el proveedor y las tipologías de cada documento, que fijan su serie de numeración, de dónde copian las líneas y cómo contabilizan.
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
# Cómo moverse por la versión nueva
Ya no se escribe la ruta (/ctercero, /gcomtarh…) en la barra de direcciones. Hay dos formas de abrir una pantalla:
•	Menú lateral: Finanzas o Gestión › módulo › carpeta › pantalla.
•	Buscador superior «Buscar» (Cmd/Ctrl + K): escribe el nombre o el código del objeto (ctercero, gcomalbh, «tarifa»…). Intro abre la pantalla en la pestaña actual; Cmd/Ctrl + Intro, en una nueva.
[TABLA]
| [IMG:compras-002.jpg] |
| Figura 1   Buscador global: cada resultado muestra el nombre de la pantalla y, a la derecha, su código de objeto (gcomtarh, gcom_pricelist…). |
[/TABLA]
Cada lista tiene arriba a la derecha un botón rojo «Añadir …» o «Nuevo», que abre el formulario en una ventana; se guarda con «Guardar» (abajo a la derecha). Ya no hace falta la «búsqueda vacía y limpiar». En la ficha de un registro, los botones de acción (Validar, Cerrar, Contabilizar…) y las pestañas están arriba; los cambios en la ficha se guardan con el icono del disquete de la barra superior.
[TABLA]
| Δ | CAMBIO / En la versión antigua los botones estaban en la barra inferior izquierda y las pestañas abajo. Ahora todo está en la parte superior de la ficha. |
[/TABLA]
# EJERCICIO 1
Nuevo proveedor y tarifa de compras
Un proveedor se monta en capas: primero el tercero (la persona jurídica, común a finanzas y gestión), después sus relaciones contables, direcciones y condiciones de pago, la tarifa de precios y, por último, el proveedor de compras que enlaza todo.
## Tercero
[TABLA]
| ? | ¿PARA QUÉ SIRVE? / El tercero es la ficha única de cualquier empresa o persona con la que trabajamos: identificación fiscal, direcciones, cuentas bancarias y relaciones contables. Se crea una sola vez y la usan clientes, proveedores, contabilidad y tesorería. Sin tercero no se puede dar de alta el proveedor, y sin sus relaciones contables la factura no podrá contabilizar. |
[/TABLA]
MENÚ    Finanzas   ›   Maestros   ›   Terceros   ›   Registro de terceros (ctercero)
[TABLA]
| CAMPO | QUÉ SIGNIFICA | VALOR DE EJEMPLO |
| Tercero | Código del tercero. Es la clave con la que se busca en todos los documentos. La pantalla no lo marca como obligatorio. | TCL |
| Nombre * | Razón social. Sale en documentos, asientos y modelos fiscales. | Tercero Claude |
| Nombre comercial | Nombre con el que se conoce. Se copia a las direcciones. | Tercero Claude |
| País emisor * | País que emite el identificador fiscal. Determina el tratamiento de IVA (nacional, UE, extranjero). | ES (España) |
| Tipo ID fiscal * | Clase de identificador (NIF empresa, NIF persona, NIF operador UE, pasaporte, no censado…). Va a los libros de IVA y al SII. | No censado |
| Id. fiscal * | NIF/CIF. Con «No censado» se admite 0. | 0 |
| Categoría * | Tipo de tercero. Trae la serie, la relación y la cuenta contable por defecto. Sustituye al antiguo «tipo» de información auxiliar. | 002 Proveedores |
| Clave fiscal tercero * | Régimen de IVA del tercero. | RGEN Régimen general (defecto) |
| Idioma * | Idioma de los documentos que se le envían. | es (defecto) |
| Empresas * | Sociedades del grupo que pueden usar el tercero. | ALL (defecto) |
| Estado / Estado cobros / Estado pagos * | Ciclo de vida del tercero y si admite cobros y pagos. Nace Provisional y Abierto. | Provisional / Abierto / Abierto |
| Holding | Tercero cabecera del grupo empresarial. Se informa cuando el tercero ya existe. | TCL |
[/TABLA]
*  Campo obligatorio: sin él no deja guardar.
1 	Abre la lista de terceros y pulsa «Añadir tercero».
2 	Rellena Tercero, Nombre y Nombre comercial.
3 	Rellena País emisor (escribe ESP y elige la línea), Tipo ID fiscal «No censado» e Id. fiscal 0.
4 	En Más datos elige Categoría 002 Proveedores. Deja los valores por defecto del resto.
5 	Pulsa «Guardar». Sale el aviso verde «Éxito» con el enlace «Ver registro».
6 	Abre la ficha con «Ver registro», pon Holding = TCL y guarda con el disquete de la barra superior.
[TABLA]
| [IMG:compras-003.jpg] |
| Figura 2   Alta del tercero: los campos con asterisco rojo son los obligatorios; Categoría 002 trae serie y cuenta por defecto. |
[/TABLA]
[TABLA]
| [IMG:compras-004.jpg] |
| Figura 3   Ficha del tercero: botones (Validar, Cerrar, Activar) y pestañas (Relaciones, Datos bancarios, Condiciones…) en la parte superior. |
[/TABLA]
[TABLA]
| Δ | CAMBIO / El alta se hace en una ventana emergente. El campo Tipo ID fiscal es nuevo y obligatorio; el antiguo «tipo Formación» se sustituye por la Categoría. |
[/TABLA]
## Relaciones contables del tercero
[TABLA]
| ? | ¿PARA QUÉ SIRVE? / La relación contable dice con qué papel trabaja el tercero (cliente, proveedor, acreedor…) y qué cuenta del plan contable usa. Cuando se contabiliza una factura, el ERP busca la cuenta del tercero según la relación de la tipología de factura; si no la encuentra, la factura no contabiliza. |
[/TABLA]
MENÚ    Ficha del tercero   ›   pestaña Relaciones   ›   Añadir relación
[TABLA]
| CAMPO | QUÉ SIGNIFICA | VALOR DE EJEMPLO |
| Tipo tercero * | Lado del tercero: Cliente o Proveedor. | Proveedor |
| Tipo relación * | Papel contable. Cada uno lleva su cuenta nemotécnica: PRO Proveedores 40000, ACR Acreedores 41000, CLI Clientes 43000… | ACR Acreedores |
| Plan contable * | Plan contable donde vive la cuenta. | PGE 2008 (ES) |
| Cuenta * | Cuenta contable del tercero. Se propone sola a partir del tipo de relación. | 41000.00000 |
| Retención | Marca si al tercero se le practica retención (IRPF). | Sin marcar |
[/TABLA]
*  Campo obligatorio: sin él no deja guardar.
1 	En la ficha del tercero, abre la pestaña «Relaciones» y pulsa «Añadir relación».
2 	Elige Tipo tercero Proveedor y Tipo relación ACR.
3 	Elige Plan contable PGE 2008 y comprueba que la Cuenta se propone sola (41000.00000).
4 	Pulsa «Guardar».
[TABLA]
| [IMG:compras-005.jpg] |
| Figura 4   Relación ACR: al elegir el tipo de relación, la cuenta 41000.00000 se propone sola. |
[/TABLA]
[TABLA]
| [IMG:compras-006.jpg] |
| Figura 5   Resultado: la relación sale en la rejilla; el aviso azul «Cuenta repetida» es solo informativo. |
[/TABLA]
[TABLA]
| Δ | CAMBIO / El antiguo tipo «410» es ahora ACR, y la cuenta se propone automáticamente. Si quieres una subcuenta propia (como la 4100.0* de sesiones anteriores), créala en el plan contable y selecciónala aquí. |
[/TABLA]
[TABLA]
| i | A TENER EN CUENTA / La tipología de factura contabiliza con la relación PRO (Proveedores, 40000). En el ejercicio 2 verás el error que sale si el tercero solo tiene ACR; puedes añadir ya aquí una segunda relación Proveedor / PRO / 40000.00000. |
[/TABLA]
## Direcciones
[TABLA]
| ? | ¿PARA QUÉ SIRVE? / La dirección es obligatoria para emitir cualquier documento: albaranes, pedidos y facturas se dirigen a una dirección del tercero. Además fija la zona impositiva, que decide el IVA que se aplica en compras y ventas. |
[/TABLA]
MENÚ    Ficha del tercero   ›   pestaña Direcciones   ›   Añadir dirección
[TABLA]
| CAMPO | QUÉ SIGNIFICA | VALOR DE EJEMPLO |
| Tipo de dirección * | Uso de la dirección. La 0 es el domicilio fiscal, que es la que se usa por defecto en los documentos. | 0 Dirección domicilio fiscal (defecto) |
| Nombre comercial | Se copia del tercero, en mayúsculas. | TERCERO CLAUDE |
| Idioma / Estado * | Idioma de la dirección y si está en uso. | es / Abierto (defecto) |
| País * | País de la dirección. | ESP (defecto) |
| Código Postal | Al elegirlo se rellenan Provincia y Población. | 08001 |
| Dirección * | Calle y número. | Carrer de Pelai 1 |
| Zona impositiva * | Zona de IVA (península, Canarias, UE…). Decide qué impuestos se calculan en los documentos. | ESCO (se rellena sola) |
[/TABLA]
*  Campo obligatorio: sin él no deja guardar.
1 	Abre la pestaña «Direcciones» y pulsa «Añadir dirección».
2 	Comprueba los valores por defecto (tipo 0, es, Abierto, ESP).
3 	Elige el Código Postal 08001: se rellenan Provincia y Población.
4 	Escribe la Dirección y comprueba que la Zona impositiva es ESCO.
5 	Pulsa «Guardar».
[TABLA]
| [IMG:compras-007.jpg] |
| Figura 6   Dirección: el código postal rellena provincia y población; la zona impositiva ESCO viene sola. |
[/TABLA]
## Condiciones de cobro y de pago
[TABLA]
| ? | ¿PARA QUÉ SIRVE? / Las condiciones dicen cómo y cuándo se cobra o se paga al tercero: tipo de efecto (transferencia, recibo, contado…) y plazo. Los albaranes y facturas las copian a sus datos financieros, y al contabilizar la factura generan los vencimientos de la cartera de pagos. |
[/TABLA]
MENÚ    Ficha del tercero   ›   pestañas Condiciones de cobro (Añadir cobro) y Condiciones de pago (Añadir pago)
[TABLA]
| CAMPO | QUÉ SIGNIFICA | VALOR DE EJEMPLO |
| Empresas * | Sociedades a las que aplica la condición. | ALL |
| Prioridad * | Orden si hay varias condiciones. | 0 |
| Tipo efecto * | Medio de cobro o pago. Una transferencia (TF) exigirá la cuenta bancaria del tercero al contabilizar. | Cobro: EF Al contado · Pago: TF Transferencia |
| Plazo pago * | Plazo de vencimiento (antes «Forma de pago»): días o meses, fijo o variable. | 30D (30 días) |
| Domiciliación | Cuenta bancaria del tercero que se usará. | Vacío |
| Día 1 a Día 4 * | Días fijos de pago del tercero. | 0 (defecto) |
[/TABLA]
*  Campo obligatorio: sin él no deja guardar.
1 	Abre la pestaña «Condiciones de cobro» y pulsa «Añadir cobro».
2 	Deja Empresas ALL y Prioridad 0; elige Tipo efecto EF y Plazo pago 30D. Pulsa «Guardar».
3 	Abre la pestaña «Condiciones de pago» y pulsa «Añadir pago».
4 	Elige Tipo efecto TF (escribe TF para filtrar) y Plazo pago 30D. Pulsa «Guardar».
[TABLA]
| [IMG:compras-008.jpg] |
| Figura 7   Condición de cobro: Tipo efecto EF y Plazo pago 30D; los días fijos se dejan a 0. |
[/TABLA]
[TABLA]
| [IMG:compras-009.jpg] |
| Figura 8   Condición de pago (la que usan las compras): Tipo efecto TF Transferencia, 30D. |
[/TABLA]
[TABLA]
| Δ | CAMBIO / Ya no hay una única pestaña «Condiciones» con un campo Cobro/Pago; hay dos pestañas separadas. La antigua «Forma de pago» se llama ahora «Plazo pago». |
[/TABLA]
[TABLA]
| i | A TENER EN CUENTA / Con TF, aprovecha para dar de alta la cuenta bancaria (IBAN y BIC) en la pestaña «Datos bancarios». Si no, la factura dará el error «DOMICILIACIÓN BANCARIA NO INFORMADA» al contabilizar. |
[/TABLA]
## Lista de precios de compra (tarifa)
[TABLA]
| ? | ¿PARA QUÉ SIRVE? / La lista de precios guarda el precio pactado con el proveedor para cada artículo y periodo. Sirve para valorar pedidos y albaranes sin teclear precios y para controlar desviaciones en la factura. Cada línea tiene su propia vigencia, así que se pueden cambiar precios sin crear otra tarifa. |
[/TABLA]
MENÚ    Gestión   ›   Compras   ›   Maestros   ›   Tarifas   ›   Precios   ›   Listas de precios (gcom_pricelist)
[TABLA]
| CAMPO | QUÉ SIGNIFICA | VALOR DE EJEMPLO |
| Código * | Identificador de la lista. | TFCL |
| Descripción * | Nombre de la lista. | Tarifa compras Claude |
| Agrupación empresas * | Sociedades que pueden usarla. | ALL |
| Divisa * | Moneda de los precios. | EUR |
| Línea · Fecha inicio * | Desde cuándo vale el precio. | 01-01-2026 |
| Línea · Fecha fin | Hasta cuándo vale. Una fecha lejana deja el precio vigente. | 31-12-2099 |
| Línea · Artículo * | Artículo al que aplica el precio. | 13500620 (6000-2RS ISB) |
| Línea · VL | Variante logística del artículo. | 0 |
| Línea · Estado * | Solo las líneas activas se aplican. | Activo |
| Línea · Precio | Precio unitario de compra pactado. | 12,50 |
| Línea · Cantidad mínima * | Cantidad desde la que aplica el precio (escalados). | 0 |
[/TABLA]
*  Campo obligatorio: sin él no deja guardar.
1 	Abre Listas de precios (se abre en modo ficha) y pulsa «Nuevo › Nuevo».
2 	Rellena Código TFCL, Descripción, Agrupación empresas ALL y Divisa EUR. Pulsa «Guardar».
3 	Ve a la ficha TFCL (flechas < > de la barra superior).
4 	En «Líneas de lista de precios» pulsa «Nuevo».
5 	Rellena Fecha inicio, Fecha fin 31-12-2099, Artículo 13500620, VL 0 y Precio 12,50. Pulsa «Guardar».
[TABLA]
| [IMG:compras-010.jpg] |
| Figura 9   Línea de la lista: las fechas de vigencia van en cada línea, no en la cabecera. |
[/TABLA]
[TABLA]
| [IMG:compras-011.jpg] |
| Figura 10   Resultado: TFCL con el artículo 6000-2RS ISB a 12,50, vigente de 01-01-2026 a 31-12-2099. |
[/TABLA]
[TABLA]
| Δ | CAMBIO / La antigua tarifa de compras (/gcomtarh) es ahora «Lista de precios de compra». La fecha de fin ya no está en la cabecera: va en cada línea. |
[/TABLA]
## Grupo de precios de compra
[TABLA]
| ? | ¿PARA QUÉ SIRVE? / El proveedor no apunta directamente a una lista de precios, sino a un grupo de precios. El grupo ordena una o varias listas (por ejemplo, una de campaña y otra general) y el ERP toma el precio de la primera que encaja. Así varios proveedores pueden compartir tarifas. |
[/TABLA]
MENÚ    Gestión   ›   Compras   ›   Maestros   ›   Tarifas   ›   Precios   ›   Grupo de precios (gcom_pricegroup)
[TABLA]
| CAMPO | QUÉ SIGNIFICA | VALOR DE EJEMPLO |
| Grupo * | Código del grupo. | GCL |
| Nombre * | Descripción del grupo. | Grupo precios Claude |
| Lista · Orden | Prioridad de la lista dentro del grupo (1 = la primera que se consulta). | 1 |
| Lista · Condición | Filtro opcional para aplicar la lista solo en ciertos casos. | Vacío |
| Lista · Divisa | Moneda. | EUR |
| Lista · Lista precio * | Lista de precios que forma parte del grupo. | TFCL |
[/TABLA]
*  Campo obligatorio: sin él no deja guardar.
1 	Abre Grupo de precios y pulsa «Nuevo».
2 	Rellena Grupo GCL y Nombre. Pulsa «Guardar».
3 	En la ficha, en «Listas de grupos de precio», pulsa «Nuevo».
4 	Rellena Orden 1, Divisa EUR y Lista precio TFCL. Pulsa «Guardar».
[TABLA]
| [IMG:compras-012.jpg] |
| Figura 11   Grupo GCL con la lista TFCL en orden 1. |
[/TABLA]
## Proveedor
[TABLA]
| ? | ¿PARA QUÉ SIRVE? / El proveedor es la ficha de compras del tercero: a quién se factura, centrales de compras y pagos, logística y tarifa. Los documentos de compra (oferta, pedido, albarán, factura) se hacen contra el proveedor, no contra el tercero. |
[/TABLA]
MENÚ    Gestión   ›   Maestros   ›   Terceros   ›   Proveedores   ›   Registro (gproveed)
[TABLA]
| CAMPO | QUÉ SIGNIFICA | VALOR DE EJEMPLO |
| Proveedor * | Tercero que se da de alta como proveedor. | TCL |
| Fecha alta * | Desde cuándo se le puede comprar. | Hoy (defecto) |
| Fecha baja | A partir de esta fecha no se le puede comprar. Una fecha lejana lo deja activo. | 31-12-2099 |
| Comercial * | Tercero comercial del proveedor. | TCL |
| Grupo de empresas * | Sociedades que le pueden comprar. | ALL |
| Tipo proveedor | Clasificación del proveedor. | 0 GENERAL |
| Grupo | Tercero de agrupación (ya no es «0 Recurrente»). | Vacío |
| Tercero / Dirección facturación | A quién y dónde factura el proveedor (pestaña Facturación). | TCL / 0 |
| Divisa | Moneda de compra. | EUR |
| Central de compras / Proveedor compras | Tercero que centraliza las compras y su proveedor. Van en pareja. | TCL / TCL |
| Central de pagos / Proveedor pagos | Tercero que centraliza los pagos y su proveedor. Van en pareja. | TCL / TCL |
| Grupo precio | Grupo de precios que valora sus compras (Datos financieros › Tarifas). | GCL |
[/TABLA]
*  Campo obligatorio: sin él no deja guardar.
1 	Abre el Maestro de proveedores y pulsa «Nuevo».
2 	Rellena Proveedor TCL, Comercial TCL, Grupo de empresas ALL, Tipo proveedor GENERAL y Divisa EUR. Deja vacías las centrales.
3 	Pulsa «Guardar».
4 	Abre la ficha del proveedor TCL (clic en el código).
5 	Pon Fecha baja 31-12-2099 y, en las pestañas Central de compras y Central de pagos, Central = TCL y Proveedor = TCL.
6 	En Datos financieros › Tarifas elige Grupo precio GCL.
7 	Guarda con el disquete.
[TABLA]
| [IMG:compras-013.jpg] |
| Figura 12   Error si se informa una central sin su proveedor: por eso se guarda primero sin centrales. |
[/TABLA]
[TABLA]
| [IMG:compras-014.jpg] |
| Figura 13   Ficha del proveedor: Fecha baja 2099 y central de pagos TCL con su proveedor TCL. |
[/TABLA]
[TABLA]
| [IMG:compras-015.jpg] |
| Figura 14   Datos financieros › Tarifas: Grupo precio GCL, que contiene la lista TFCL. |
[/TABLA]
[TABLA]
| Δ | CAMBIO / El proveedor ya no es una pestaña de /ctercero, sino el «Maestro de proveedores». La tarifa no se asigna directamente: se asigna un grupo de precios que contiene la lista. |
[/TABLA]
[TABLA]
| ! | PROBLEMA / «Las siguientes restricciones de verificación fallaron: si la central de pagos no es nula, tampoco lo será su proveedor…». |
[/TABLA]
[TABLA]
| ✓ | SOLUCIÓN / La central y su «Proveedor compras/pagos» van en pareja. Como TCL aún no es proveedor al darlo de alta, guarda primero sin centrales y después informa las dos parejas en la ficha. |
[/TABLA]
[TABLA]
| ✓   QUÉ HAS CONSEGUIDO |
| ✓	Tercero TCL con relación ACR 41000.00000, dirección 0 (CP 08001, ESCO) y condiciones de cobro EF 30D y de pago TF 30D. Compruébalo en Registro de terceros, en cada pestaña. / ✓	Lista de precios TFCL con el artículo 13500620 a 12,50 (01-01-2026 a 31-12-2099). Compruébalo en Listas de precios. / ✓	Grupo de precios GCL con la lista TFCL en orden 1. / ✓	Proveedor TCL, tipo GENERAL, fecha baja 2099, centrales TCL y grupo precio GCL. Compruébalo en el Maestro de proveedores: TCL sale en la lista. |
[/TABLA]
# EJERCICIO 2
Circuito de compras Albarán - Factura
Recibimos mercancía del proveedor con un albarán, después llega su factura, la conformamos contra el albarán y la contabilizamos. Antes creamos las tipologías de albarán y de factura.
## Tipología de albarán
[TABLA]
| ? | ¿PARA QUÉ SIRVE? / La tipología es la plantilla de un tipo de documento: con qué serie se numera, qué movimiento de stock hace (entrada en almacén), de qué documento copia las líneas y cómo se valora. Cada albarán que se cree con ella heredará este comportamiento. |
[/TABLA]
MENÚ    Gestión   ›   Compras   ›   Maestros   ›   Documentos   ›   Albaranes (gcommovd)
[TABLA]
| CAMPO | QUÉ SIGNIFICA | VALOR DE EJEMPLO |
| Tipo movimiento (código) * | Código de la tipología. | ACL |
| Descripción * | Nombre que se ve al elegir el tipo de documento. | Albarán Claude |
| Serie * | Numerador de los albaranes (antes «E11-»). | AC (ALBARÁN DE COMPRA) |
| Suministro albarán * | Si el documento es un suministro (albarán). | Suministro (defecto) |
| Tipo movimiento * | Efecto en stock: Entrada suma unidades al almacén. | Entrada |
| Cuenta origen / Cuenta destino * | Cuentas de stock entre las que se mueve la mercancía: de NSAL (no saldo) a DISP (disponible). | NSAL / DISP |
| Estado * | Solo las tipologías activas se pueden usar. | Activo |
| Tabla origen | Documento del que copia líneas. Vacío: el albarán se hace a mano. | Vacío |
| Relación proveedor * | Relación contable del proveedor. Debe ser una relación que tenga el tercero. | ACR Acreedores |
| Valorar / Valoración inventario * | Cómo se pone precio a las líneas y cómo valora el stock. | Tarifa / Normal |
| Abono * | Si el albarán es una devolución. | No |
[/TABLA]
*  Campo obligatorio: sin él no deja guardar.
1 	Abre Albaranes (tipologías) y pulsa «Nuevo».
2 	Rellena código ACL, Descripción y Serie AC.
3 	Elige Tipo movimiento Entrada, Cuenta origen NSAL y Cuenta destino DISP.
4 	Deja vacío el Documento origen.
5 	Baja al bloque Valoración y elige Relación proveedor ACR.
6 	Pulsa «Guardar».
[TABLA]
| [IMG:compras-016.jpg] |
| Figura 15   Identificación de la tipología ACL: serie AC, Entrada, NSAL › DISP. |
[/TABLA]
[TABLA]
| [IMG:compras-017.jpg] |
| Figura 16   Bloque Valoración: Relación proveedor ACR, campo nuevo y obligatorio. |
[/TABLA]
[TABLA]
| Δ | CAMBIO / La serie ya no es «E11-», sino el numerador AC. Es obligatorio el campo nuevo «Relación proveedor»; si falta, sale «Hay errores en los datos del formulario». |
[/TABLA]
## Tipología de factura
[TABLA]
| ? | ¿PARA QUÉ SIRVE? / La tipología de factura decide con qué serie se numeran las facturas, de qué documento toman las líneas (los albaranes) y con qué tipo de asiento contabilizan. El enlace Suministros + Sumando es lo que permite conformar albaranes y marcarlos como facturados. |
[/TABLA]
MENÚ    Gestión   ›   Compras   ›   Maestros   ›   Documentos   ›   Tipos de facturas (gcomfacd)
[TABLA]
| CAMPO | QUÉ SIGNIFICA | VALOR DE EJEMPLO |
| Tipo factura * | Código de la tipología. | FCCL |
| Descripción * | Nombre de la tipología. | Factura Claude |
| Serie * | Numerador de las facturas. En la base TUTORIAL se usa uno existente. | FC (FACTURA DE COMPRA) |
| Estado * | Activa o no. | Activo |
| Tabla origen | Documento del que se copian las líneas. Suministros = albaranes. Si se deja vacío, la factura no se enlaza con el albarán. | Suministros |
| Copiar líneas | Sí: copia las líneas del albarán a la factura al conformar. | Sí |
| Actualización tabla origen | Sumando: marca en el albarán las cantidades ya facturadas, para no facturarlas dos veces. | Sumando |
| Tipo asiento | Plantilla del asiento contable (pestaña Contabilización). | FC (FACTURA DE COMPRA) |
| Relación proveedor * | Relación contable del proveedor. | ACR Acreedores |
[/TABLA]
*  Campo obligatorio: sin él no deja guardar.
1 	Abre Tipos de facturas y pulsa «Nuevo».
2 	Rellena Tipo factura FCCL, Descripción y Serie FC.
3 	En Documento origen elige Tabla origen Suministros y Copiar líneas Sí.
4 	En Actualización tabla origen pulsa la tarjeta «Sumando».
5 	En la pestaña Contabilización elige Tipo asiento FC.
6 	Rellena Relación proveedor ACR y pulsa «Guardar».
[TABLA]
| [IMG:compras-018.jpg] |
| Figura 17   Alta rápida de serie desde el campo Serie: Rotura sale bloqueada y obligatoria, así que no se puede crear aquí. |
[/TABLA]
[TABLA]
| [IMG:compras-019.jpg] |
| Figura 18   Pestaña Contabilización: Tipo asiento FC. |
[/TABLA]
[TABLA]
| [IMG:compras-020.jpg] |
| Figura 19   Resultado: FCCL con serie FC, origen Suministros, Sumando y copiar líneas Sí (compárala con FCOA). |
[/TABLA]
[TABLA]
| Δ | CAMBIO / No existe /cserjush. Las series son «Numeradores de documentos». El botón «+» del campo Serie abre un alta rápida, pero en la base TUTORIAL «Rotura» es obligatoria y no editable: usamos la serie existente FC. |
[/TABLA]
## Albarán de compras
[TABLA]
| ? | ¿PARA QUÉ SIRVE? / El albarán registra la mercancía que entra en el almacén. Al validarlo, el stock del artículo aumenta y el albarán queda pendiente de facturar. Después se conformará con la factura del proveedor. |
[/TABLA]
MENÚ    Gestión   ›   Compras   ›   Albaranes   ›   Albaranes (gcomalbh)
[TABLA]
| CAMPO | QUÉ SIGNIFICA | VALOR DE EJEMPLO |
| Tipo documento * | Tipología del albarán. | ACL (Albarán Claude) |
| Empresa / Almacén / Delegación / Departamento * | Unidad de negocio. El almacén es donde entra el stock. | 0 Deister Software / CENTRAL / CENTRAL / COMPRAS (defecto) |
| Fecha albarán / Fecha proveedor * | Fecha del documento y del albarán del proveedor. | Hoy |
| Proveedor / Dirección * | A quién compramos. | TCL / 0 |
| Fecha recepción * | Día en que entra la mercancía. | Hoy |
| Tipo efecto / Forma pago * | Se copian de las condiciones de pago del tercero. | TF / 30 días |
| Divisa / Cambio * | Moneda del documento. | EUR / 1 |
| Línea · Artículo / VLP * | Artículo y variante que se recibe. | 13500620 / 0 |
| Línea · Cantidad / Unidad * | Unidades recibidas: es lo que suma al stock. | 10 UNIDAD |
| Línea · Precio | Precio unitario. En el formulario no lo propone la tarifa: se escribe. | 12,50 |
| Línea · Precio con IVA * | Precio unitario con IVA. | 15,125 |
| Línea · Importe dto. * | Descuento en importe (0 si no hay). | 0 |
[/TABLA]
*  Campo obligatorio: sin él no deja guardar.
1 	Abre Albaranes y pulsa «Nuevo».
2 	Elige Tipo documento ACL. Comprueba empresa, almacén, delegación y departamento por defecto.
3 	Elige Proveedor TCL y Dirección 0: los datos financieros (TF, 30 días) se rellenan solos.
4 	Comprueba la Fecha recepción y pulsa «Guardar».
5 	Abre la ficha (flecha de la fila › «Albaranes compras») y ve a la pestaña «Líneas».
6 	Pulsa «Nuevo», rellena Artículo 13500620, VLP 0, Cantidad 10, Precio 12,50, Precio con IVA e Importe dto. 0. Pulsa «Guardar».
7 	Pulsa «Validar» (botón verde, arriba a la derecha).
[TABLA]
| [IMG:compras-021.jpg] |
| Figura 20   Cabecera: tipo ACL y unidad de negocio por defecto; proveedor TCL con dirección 0. |
[/TABLA]
[TABLA]
| [IMG:compras-022.jpg] |
| Figura 21   Datos financieros copiados del tercero: Tipo efecto TF y Forma pago 30 días. |
[/TABLA]
[TABLA]
| [IMG:compras-023.jpg] |
| Figura 22   Línea: Precio con IVA e Importe dto. en rojo porque son obligatorios. |
[/TABLA]
[TABLA]
| [IMG:compras-024.jpg] |
| Figura 23   Resultado: albarán validado; el botón pasa a «Pasar a provisional» (para deshacer). |
[/TABLA]
[TABLA]
| Δ | CAMBIO / En la línea son obligatorios «Precio con IVA» e «Importe dto.» (0 si no hay descuento). El botón Validar está arriba a la derecha, no abajo a la izquierda. |
[/TABLA]
## Factura de compras
[TABLA]
| ? | ¿PARA QUÉ SIRVE? / La factura recoge lo que el proveedor nos cobra. Se crea la cabecera con el número de factura del proveedor y después se conforma con los albaranes recibidos, que aportan las líneas. Así se comprueba que se paga solo lo que ha entrado. |
[/TABLA]
MENÚ    Gestión   ›   Compras   ›   Facturas   ›   Facturas (gcomfach)
[TABLA]
| CAMPO | QUÉ SIGNIFICA | VALOR DE EJEMPLO |
| Tipo documento * | Tipología de la factura. | FCCL |
| Factura | Número interno. Lo pone el numerador de la serie: se deja vacío. | Vacío › 0FC000001 |
| Proveedor / Dirección * | Proveedor que factura. | TCL / 0 |
| Facturado por · Tercero * | Tercero que emite la factura. | TCL |
| Factura proveedor * | Número de la factura en papel del proveedor. Va a los libros de IVA. | PROV-CL-001 |
| Tipo de identificación / País emisor / CIF * | Datos fiscales del proveedor para el libro de IVA. Se copian del tercero. | No censado / ES / 0 |
| Tipo efecto / Forma pago * | Generan los vencimientos de pago al contabilizar. | TF / 30 días |
| Domiciliación (Datos financieros (2)) | Cuenta bancaria del tercero. Con TF hace falta para contabilizar. | 0 |
| Divisa / Cambio * | Moneda. | EUR / 1 |
[/TABLA]
*  Campo obligatorio: sin él no deja guardar.
1 	Abre Facturas y pulsa «Nuevo».
2 	Elige Tipo documento FCCL, Proveedor TCL y Dirección 0.
3 	Escribe la Factura proveedor (PROV-CL-001) y deja vacío el campo Factura.
4 	Comprueba los datos financieros (TF, 30 días, EUR) y pulsa «Guardar».
[TABLA]
| [IMG:compras-025.jpg] |
| Figura 24   Alta de la factura: Factura proveedor obligatoria; datos fiscales y financieros copiados del tercero. |
[/TABLA]
## Conformar la factura con el albarán
[TABLA]
| ? | ¿PARA QUÉ SIRVE? / Conformar es cruzar la factura con los albaranes pendientes del proveedor. Las líneas del albarán pasan a la factura, el albarán queda marcado como facturado (actualización «Sumando») y la factura queda validada, lista para contabilizar. |
[/TABLA]
MENÚ    Ficha de la factura   ›   desplegable (⌄) junto al título   ›   Conformar
[TABLA]
| CAMPO | QUÉ SIGNIFICA | VALOR DE EJEMPLO |
| Albaranes pendientes (casilla) * | Albaranes validados del proveedor que aún no están facturados. Se marca el que corresponde a la factura. | 0AC000002 (TCL, 125,00) |
| Líneas | Líneas del albarán marcado, para revisarlas antes de conformar. | 13500620 × 10 |
[/TABLA]
*  Campo obligatorio: sin él no deja guardar.
1 	En la ficha de la factura, abre el desplegable (⌄) junto al título y elige «Conformar».
2 	Marca la casilla del albarán 0AC000002 y revisa sus líneas abajo.
3 	Pulsa «Conformar»: el albarán pasa a «Albaranes conformados».
4 	Cierra la ventana y recarga la ficha.
5 	Comprueba en la pestaña «Líneas» la línea del albarán y, arriba, los botones «Pasar a provisional» y «Contabilizar».
[TABLA]
| [IMG:compras-026.jpg] |
| Figura 25   Opciones de conformar en el desplegable del título de la factura. |
[/TABLA]
[TABLA]
| [IMG:compras-027.jpg] |
| Figura 26   Ventana de conformar: marca el albarán pendiente; abajo se ven sus líneas. |
[/TABLA]
[TABLA]
| [IMG:compras-028.jpg] |
| Figura 27   Resultado: la factura tiene la línea del albarán (10 × 12,50 = 125,00) y ya muestra «Contabilizar». |
[/TABLA]
[TABLA]
| Δ | CAMBIO / Ya no existe la pestaña «Conformar albaranes». Las opciones (Conformar, por tercero comercial, por CIF, por delegación, por otros proveedores, Copiar líneas de pedido) están en el desplegable del título. |
[/TABLA]
## Contabilizar la factura
[TABLA]
| ? | ¿PARA QUÉ SIRVE? / Contabilizar genera el asiento de compras: gasto (600) e IVA soportado (472) al debe contra la deuda con el proveedor (400) al haber, y los vencimientos de pago. Para que funcione, el tercero tiene que tener la relación contable de la factura, la cuenta bancaria si se paga por transferencia, y el artículo un tipo contable con cuenta de compras. |
[/TABLA]
MENÚ    Ficha de la factura   ›   botón Contabilizar (morado, barra superior)
[TABLA]
| CAMPO | QUÉ SIGNIFICA | VALOR DE EJEMPLO |
| Fecha registro contable * | Fecha del asiento. Debe caer en un periodo contable abierto. | Hoy (12-11-2026) |
| Prevista de Asiento Contable | Enseña el asiento sin grabarlo, para revisarlo antes. | Marcada la primera vez |
[/TABLA]
*  Campo obligatorio: sin él no deja guardar.
1 	Pulsa «Contabilizar».
2 	Marca «Prevista de Asiento Contable» y pulsa «Aceptar» para revisar el asiento.
3 	Si sale un error, resuélvelo con la tabla de problemas de abajo.
4 	Vuelve a pulsar «Contabilizar» sin marcar la casilla y «Aceptar»: se abre el asiento generado.
5 	En la pestaña «Líneas de apuntes» comprueba que debe = haber.
[TABLA]
| [IMG:compras-029.jpg] |
| Figura 28   Diálogo de contabilizar: fecha de registro y casilla de prevista. |
[/TABLA]
[TABLA]
| ! | PROBLEMA / «Cuenta tercero [TCL] no existente para relación: [PRO]». La factura contabiliza con la relación PRO (Proveedores, 40000) y el tercero solo tiene ACR. Es el equivalente del antiguo «DEBE-HABER no cuadra: revisar las relaciones del tercero». |
[/TABLA]
[TABLA]
| [IMG:compras-030.jpg] |
| Figura 29   Error de relación: fíjate en la relación que pide, [PRO]. |
[/TABLA]
[TABLA]
| ✓ | SOLUCIÓN / En Terceros › TCL › Relaciones › Añadir relación: Proveedor / PRO / PGE 2008 / cuenta 40000.00000. |
[/TABLA]
[TABLA]
| ! | PROBLEMA / «DOMICILIACIÓN BANCARIA NO INFORMADA». Con efecto TF el pago es por transferencia y hace falta la cuenta bancaria del tercero. |
[/TABLA]
[TABLA]
| [IMG:compras-031.jpg] |
| Figura 30   Error de domiciliación bancaria al contabilizar. |
[/TABLA]
[TABLA]
| ✓ | SOLUCIÓN / En Terceros › TCL › Datos bancarios da de alta el IBAN y el BIC. En la factura: «Pasar a provisional», Datos financieros (2) › Domiciliación 0, guardar y «Validar». |
[/TABLA]
[TABLA]
| ! | PROBLEMA / «gcomfach [15]: tipast [FC] tipcta [L] relaci [M] tiprel [] tipcon [VEN] cuenta no definida». No hay cuenta contable para asiento FC + línea de artículo + tipo contable VEN: el artículo 13500620 tiene Tipo contable «Ventas». |
[/TABLA]
[TABLA]
| [IMG:compras-032.jpg] |
| Figura 31   Error de cuenta no definida: el dato clave es tipcon [VEN], el tipo contable del artículo. |
[/TABLA]
[TABLA]
| ✓ | SOLUCIÓN / En el artículo (Gestión › Maestros › Artículos, garticul), bloque Contabilidad, cambia Tipo contable de VEN a PROD (Producto) y guarda. O bien añade en Relaciones contables (gconcuen) la combinación VEN / FACTURA DE COMPRA / M con su cuenta de compras. No hace falta tocar la factura. |
[/TABLA]
[TABLA]
| [IMG:compras-033.jpg] |
| Figura 32   Artículo 13500620: Tipo contable PROD, que sí tiene cuenta de compras. |
[/TABLA]
[TABLA]
| Δ | CAMBIO / La cuenta de compras de la línea ya no sale de una cuenta del artículo o la familia, sino de Relaciones contables (gconcuen), combinando tipo de asiento, tipo de línea, relación y Tipo contable del artículo. |
[/TABLA]
[TABLA]
| i | A TENER EN CUENTA / También pueden salir errores de fechas de la empresa o del periodo contable, como en la versión antigua. Revísalos en «cempresa» y «cejercic» con el buscador. |
[/TABLA]
[TABLA]
| [IMG:compras-034.jpg] |
| Figura 33   Prevista: 60000 Compras 125,00 y IVA 26,25 al debe; proveedor 40000 al haber 151,25. No graba nada. |
[/TABLA]
[TABLA]
| i | A TENER EN CUENTA / En la base TUTORIAL la cuenta de IVA sale 00000.00000 porque el impuesto no tiene cuenta parametrizada; en una base real será la 472. |
[/TABLA]
[TABLA]
| [IMG:compras-035.jpg] |
| Figura 34   Asiento generado (diario DC Compras): 3 líneas, debe 151,25 = haber 151,25, cuadre 0,00. |
[/TABLA]
[TABLA]
| [IMG:compras-036.jpg] |
| Figura 35   Resultado: factura 0FC000001 en situación Contabilizada, con los botones Descontabilizar y Anular. |
[/TABLA]
[TABLA]
| ✓   QUÉ HAS CONSEGUIDO |
| ✓	Tipologías ACL (albarán, serie AC, Entrada NSAL › DISP, relación ACR) y FCCL (factura, serie FC, origen Suministros, Sumando, asiento FC). Compruébalas en sus listas de tipologías. / ✓	Albarán 0AC000002 de TCL, 10 × 12,50 = 125,00, validado: el stock del artículo 13500620 sube 10 unidades. / ✓	Factura 0FC000001 (PROV-CL-001) conformada con ese albarán y contabilizada. Compruébalo: situación Contabilizada y asiento del diario DC cuadrado a 151,25. / ✓	Correcciones de datos maestros: relación PRO en el tercero, cuenta bancaria en Datos bancarios y artículo 13500620 con tipo contable PROD. |
[/TABLA]
# EJERCICIO 3
Circuito Oferta - Pedido - Albarán - Factura
Ahora hacemos el circuito completo: pedimos oferta al proveedor, la convertimos en pedido, recibimos la mercancía con un albarán que viene del pedido y facturamos. Cada documento copia las líneas del anterior gracias a la tabla origen de su tipología.
## Tipología de oferta
[TABLA]
| ? | ¿PARA QUÉ SIRVE? / La oferta recoge el precio y las condiciones que propone el proveedor antes de comprar. Es el primer documento del circuito, así que su tipología no tiene documento origen. La oferta aceptada será el origen del pedido. |
[/TABLA]
MENÚ    Gestión   ›   Compras   ›   Maestros   ›   Documentos   ›   Ofertas (gcomofed)
[TABLA]
| CAMPO | QUÉ SIGNIFICA | VALOR DE EJEMPLO |
| Tipo oferta * | Código de la tipología. | OCCL |
| Descripción | Nombre de la tipología. | Oferta compras Claude |
| Serie * | Numerador de las ofertas (antes «OCT-»). | OC (OFERTA DE COMPRA) |
| Estado * | Activa o no. | Activo |
| Tabla origen | Vacío: la oferta es el primer documento. | Vacío |
| Valorar | Calcula importes en las líneas. | Sí |
| Impresión del documento | Si imprime al guardar (Sí / No / Preguntar). | No |
[/TABLA]
*  Campo obligatorio: sin él no deja guardar.
1 	Abre las tipologías de oferta y pulsa «Nuevo».
2 	Rellena Tipo oferta OCCL, Descripción, Serie OC y Estado Activo.
3 	Deja vacío el Documento origen.
4 	En «Impresión del documento» marca No y pulsa «Guardar».
[TABLA]
| [IMG:compras-037.jpg] |
| Figura 36   Tipología OCCL: serie OC y documento origen vacío. |
[/TABLA]
[TABLA]
| Δ | CAMBIO / La serie ya no se crea en /cserjush; se elige el numerador existente OC. La tipología tiene bloques nuevos: Valoración, Documento destino, Impresión del documento y Datos generales. |
[/TABLA]
## Tipología de pedido
[TABLA]
| ? | ¿PARA QUÉ SIRVE? / El pedido es el compromiso de compra con el proveedor. Su tipología con origen «Oferta compras» copia las líneas de la oferta aceptada y descuenta lo pedido de la oferta (Sumando). Después el pedido será el origen del albarán. |
[/TABLA]
MENÚ    Gestión   ›   Compras   ›   Maestros   ›   Documentos   ›   Pedidos (gcompedd)
[TABLA]
| CAMPO | QUÉ SIGNIFICA | VALOR DE EJEMPLO |
| Tipo pedido * | Código de la tipología. | PCCL |
| Descripción | Nombre de la tipología. | Pedido compra Claude |
| Serie * | Numerador de los pedidos. | PC (PEDIDO DE COMPRA) |
| Tipo * | Clase de pedido: Normal, Reposición, Programación o Muestras (antes en Indicativos). | Normal |
| Estado * | Activa o no. | Activo |
| Tabla origen | Documento del que copia las líneas. | Oferta compras |
| Copiar línea origen | Sí: copia las líneas de la oferta al pedido. | Sí |
| Actualización tabla origen | Sumando: marca en la oferta lo ya pedido. | Sumando |
| Relación proveedor * | Relación contable del proveedor (bloque Impuestos). | ACR Acreedores |
| Valorar | Calcula importes del pedido. | Sí |
[/TABLA]
*  Campo obligatorio: sin él no deja guardar.
1 	Abre las tipologías de pedido y pulsa «Nuevo». Puedes tomar como modelo la PCOF de la base.
2 	Rellena Tipo pedido PCCL, Descripción, Serie PC, Tipo Normal y Estado Activo.
3 	En Documento origen elige Tabla origen «Oferta compras» y Copiar línea origen «Sí».
4 	Pulsa la tarjeta «Sumando» de Actualización tabla origen.
5 	En el bloque Impuestos elige Relación proveedor ACR; pon Impresión No.
6 	Pulsa «Guardar».
[TABLA]
| [IMG:compras-038.jpg] |
| Figura 37   Tipología PCCL: serie PC, tipo Normal y la lista de tablas origen (elegimos Oferta compras). |
[/TABLA]
[TABLA]
| [IMG:compras-039.jpg] |
| Figura 38   Actualización Sumando y Relación proveedor ACR obligatoria. |
[/TABLA]
[TABLA]
| Δ | CAMBIO / Ya no hace falta crear la serie PC[iniciales] en /cserjush; se usa el numerador PC. El Tipo está en la cabecera y hay una pestaña nueva «Solicitud origen». |
[/TABLA]
## Oferta de compras
[TABLA]
| ? | ¿PARA QUÉ SIRVE? / Registramos la oferta del proveedor con su precio y su periodo de vigencia. Al validarla queda aceptada y lista para generar el pedido (o un acuerdo de compra). Cada línea tiene su propio estado (por ejemplo, Adjudicada). |
[/TABLA]
MENÚ    Gestión   ›   Compras   ›   Ofertas   ›   Ofertas (gcomofeh)
[TABLA]
| CAMPO | QUÉ SIGNIFICA | VALOR DE EJEMPLO |
| Tipo documento * | Tipología de la oferta. | OCCL |
| Empresa / Delegación / Departamento * | Unidad de negocio. | 0 / CENTRAL / COMPRAS (defecto) |
| Fecha oferta * | Fecha del documento. | Hoy |
| Inicio vigencia / Fin vigencia * | Periodo en que vale la oferta del proveedor. | Hoy / Hoy |
| Pedir a · Proveedor / Dirección * | Proveedor que oferta. | TCL / 0 |
| Recepcionar en · Tercero * | Dónde se recibirá la mercancía (nuestra empresa). | 0 DEISTER SOFTWARE |
| Línea · Artículo / VLP * | Artículo ofertado. | 13500620 / 0 |
| Línea · Cantidad ofertada / Unidad * | Unidades que oferta el proveedor. | 5 UNIDAD |
| Línea · Precio | Precio ofertado. | 12,00 |
| Línea · Precio con IVA / Importe dto. * | Como en el albarán, hay que informarlos. | 14,52 / 0 |
[/TABLA]
*  Campo obligatorio: sin él no deja guardar.
1 	Abre Ofertas y pulsa «Nuevo».
2 	Elige Tipo documento OCCL y comprueba la unidad de negocio y las fechas.
3 	En «Pedir a» elige Proveedor TCL y Dirección 0. Pulsa «Guardar»: se crea la oferta 0OC000001.
4 	En la pestaña «Líneas» pulsa «Nuevo» y rellena Artículo 13500620, Cantidad ofertada 5, Precio 12,00, Precio con IVA 14,52 e Importe dto. 0. Pulsa «Guardar».
5 	Pulsa «Validar».
[TABLA]
| [IMG:compras-040.jpg] |
| Figura 39   Cabecera de la oferta: tres fechas (oferta, inicio y fin de vigencia) y proveedor TCL. |
[/TABLA]
[TABLA]
| [IMG:compras-041.jpg] |
| Figura 40   Línea de la oferta: 5 unidades a 12,00; bloques nuevos Cantidades procesadas y Concurso. |
[/TABLA]
[TABLA]
| [IMG:compras-042.jpg] |
| Figura 41   Resultado: oferta validada; aparecen «Cerrar» y «Pasar a provisional». |
[/TABLA]
## Pedido de compras
[TABLA]
| ? | ¿PARA QUÉ SIRVE? / El pedido formaliza la compra al proveedor a partir de la oferta. Con la tipología PCCL y Origen = la oferta, copia sus líneas. En la versión nueva, el camino estándar es Oferta › Generar acuerdo › Generación de pedidos desde acuerdos. |
[/TABLA]
MENÚ    Gestión   ›   Compras   ›   Pedidos   ›   Pedidos (gcompedh)
[TABLA]
| CAMPO | QUÉ SIGNIFICA | VALOR DE EJEMPLO |
| Tipo documento * | Tipología del pedido. | PCCL |
| Empresa / Delegación / Departamento * | Unidad de negocio. | 0 / CENTRAL / COMPRAS |
| Fecha pedido * | Fecha del documento. | Hoy |
| Pedido | Número. Lo pone el numerador en el formulario diseñado. | 0 › 0PC000001 (a mano) |
| Proveedor / Dirección * | Proveedor al que se pide. | TCL / 0 |
| Divisa / Cambio * | Moneda. | EUR / 1 |
| Tipo efecto / Forma pago | Condiciones de pago. | TF / 30D |
| Receptor / Facturador | Quién recibe (nuestra empresa) y quién factura. | 0 / TCL |
| Origen | Oferta de la que vienen las líneas. | 0OC000001 |
| Almacén | Almacén donde se recibirá. | CENTRAL |
[/TABLA]
*  Campo obligatorio: sin él no deja guardar.
1 	Abre Pedidos y pulsa «Nuevo».
2 	Rellena Tipo documento PCCL, unidad de negocio, Fecha pedido, Proveedor TCL y Dirección 0.
3 	Pon Origen = 0OC000001 y pulsa «Guardar».
4 	Camino estándar alternativo: en la oferta validada, Acciones › «Generar acuerdo» (tipo ACC, vigencia) y después «Generación de pedidos desde acuerdos».
[TABLA]
| ! | PROBLEMA / En la base TUTORIAL el pedido no tiene formulario diseñado (el título muestra «Failed to parse the expression [${Pedidos compras}]»). Sale el formulario genérico con todos los campos de la tabla y sin valores por defecto. |
[/TABLA]
[TABLA]
| [IMG:compras-043.jpg] |
| Figura 42   Formulario genérico del pedido: todos los campos de la tabla, rellenados a mano. |
[/TABLA]
[TABLA]
| ! | PROBLEMA / El pedido se guarda con número 0 y sin líneas: el formulario genérico no aplica el numerador ni copia las líneas de la oferta. La tabla de líneas (gcompedl) no tiene botón Nuevo. |
[/TABLA]
[TABLA]
| ! | PROBLEMA / Oferta › Acciones › Generar acuerdo da «gsernumh_getserie: Sin máscara.Tab.[gcomacuh] Cod.[ACC]»: no existe numerador para los acuerdos de tipo ACC. |
[/TABLA]
[TABLA]
| [IMG:compras-044.jpg] |
| Figura 43   Oferta › Acciones › Generar acuerdo: tipo ACC y vigencia. |
[/TABLA]
[TABLA]
| [IMG:compras-045.jpg] |
| Figura 44   Error de numerador: falta la máscara de serie para la tabla gcomacuh y el tipo ACC. |
[/TABLA]
[TABLA]
| ✓ | SOLUCIÓN / En una base bien configurada, el administrador da de alta el numerador de gcomacuh/ACC en Numeradores de documentos (gsernumh). En la TUTORIAL, ponemos a mano el número 0PC000001 al pedido genérico y seguimos con el albarán metiendo la línea a mano. |
[/TABLA]
[TABLA]
| Δ | CAMBIO / En la versión nueva la oferta adjudicada genera un acuerdo de compra y del acuerdo salen los pedidos (gcomacuh_gen_gcompedh). |
[/TABLA]
## Tipología de albarán con origen
[TABLA]
| ? | ¿PARA QUÉ SIRVE? / Igual que la tipología de albarán del ejercicio 2, pero con tabla origen Pedidos: al recibir la mercancía se elige el pedido y el albarán copia sus líneas pendientes, descontándolas del pedido (Sumando). Así se controla lo pendiente de recibir. |
[/TABLA]
MENÚ    Gestión   ›   Compras   ›   Maestros   ›   Documentos   ›   Albaranes (gcommovd)
[TABLA]
| CAMPO | QUÉ SIGNIFICA | VALOR DE EJEMPLO |
| Tipo movimiento (código) / Descripción * | Código y nombre. | AOCL / Albarán con origen Claude |
| Serie * | Numerador de albaranes. | AC |
| Tipo movimiento / Cuenta origen / Cuenta destino * | Entrada en stock de NSAL a DISP. | Entrada / NSAL / DISP |
| Tabla origen | Documento del que copia las líneas. | Pedidos |
| Copiar líneas / Actualizar origen | Copia las líneas del pedido y marca lo recibido. | Sí / Sumando |
| Relación proveedor * | Relación contable del proveedor. | ACR |
[/TABLA]
*  Campo obligatorio: sin él no deja guardar.
1 	Abre Albaranes (tipologías) y pulsa «Nuevo».
2 	Rellena AOCL, Descripción, Serie AC, Entrada, NSAL y DISP.
3 	En Documento origen elige Tabla origen Pedidos, Copiar líneas Sí y Actualizar origen Sumando.
4 	En Valoración elige Relación proveedor ACR y pulsa «Guardar».
[TABLA]
| [IMG:compras-046.jpg] |
| Figura 45   Tipología AOCL: tabla origen Pedidos. |
[/TABLA]
## Albarán de compras con origen
[TABLA]
| ? | ¿PARA QUÉ SIRVE? / Con una tipología con origen, el campo «Origen» del albarán se convierte en un desplegable con los pedidos validados del proveedor que tienen líneas pendientes. Al elegir uno, el albarán copia sus líneas y no hay que teclear artículos ni precios. |
[/TABLA]
MENÚ    Gestión   ›   Compras   ›   Albaranes   ›   Albaranes (gcomalbh)
[TABLA]
| CAMPO | QUÉ SIGNIFICA | VALOR DE EJEMPLO |
| Tipo documento * | Tipología con origen. | AOCL |
| Proveedor / Dirección * | Proveedor del pedido. | TCL / 0 |
| Origen | Pedido del que se reciben las líneas. | Vacío (en TUTORIAL no hay pedido válido) |
| Línea · Artículo / Cantidad / Precio * | En la TUTORIAL se meten a mano, como en la oferta. | 13500620 / 5 / 12,00 |
| Línea · Precio con IVA / Importe dto. * | Obligatorios. | 14,52 / 0 |
[/TABLA]
*  Campo obligatorio: sin él no deja guardar.
1 	Abre Albaranes y pulsa «Nuevo». Elige Tipo documento AOCL, Proveedor TCL y Dirección 0.
2 	Abre el desplegable Origen: en una base bien configurada, elige el pedido.
3 	En la TUTORIAL sale vacío: guarda sin origen (0AC000003).
4 	En «Líneas › Nuevo» mete 13500620, 5 unidades a 12,00, Precio con IVA 14,52 e Importe dto. 0. Pulsa «Guardar».
5 	Pulsa «Validar».
[TABLA]
| [IMG:compras-047.jpg] |
| Figura 46   Desplegable Origen vacío: el pedido 0PC000001 no tiene líneas pendientes ni está validado. |
[/TABLA]
[TABLA]
| ! | PROBLEMA / Al escribir la cantidad sale «ELResolver no manejó el tipo: null con propiedad de 'null'»: la tipología espera los datos del pedido origen. |
[/TABLA]
[TABLA]
| [IMG:compras-048.jpg] |
| Figura 47   Aviso ELResolver al meter la cantidad sin pedido origen. |
[/TABLA]
[TABLA]
| ✓ | SOLUCIÓN / Cierra el aviso, vuelve a escribir la cantidad y guarda la línea. |
[/TABLA]
[TABLA]
| [IMG:compras-049.jpg] |
| Figura 48   Resultado: albarán 0AC000003 validado (botones Anular y Pasar a provisional). |
[/TABLA]
## Factura, conformar y contabilizar
[TABLA]
| ? | ¿PARA QUÉ SIRVE? / Se repite el ejercicio 2 con el nuevo albarán. Como los datos maestros ya están corregidos (relación PRO, cuenta bancaria y tipo contable PROD), la factura debe contabilizar a la primera: es la prueba de que el proveedor está bien configurado. |
[/TABLA]
MENÚ    Gestión   ›   Compras   ›   Facturas   ›   Facturas (gcomfach)
[TABLA]
| CAMPO | QUÉ SIGNIFICA | VALOR DE EJEMPLO |
| Tipo documento * | Tipología de factura. | FCCL |
| Proveedor / Dirección * | Proveedor. | TCL / 0 |
| Factura proveedor * | Número de la factura del proveedor. | PROV-CL-002 |
| Domiciliación (Datos financieros (2)) | Se informa ya al crear la factura, para evitar el error de domiciliación. | 0 |
| Albarán a conformar * | Albarán pendiente del proveedor. | 0AC000003 (60,00) |
[/TABLA]
*  Campo obligatorio: sin él no deja guardar.
1 	Crea la factura: tipo FCCL, proveedor TCL, dirección 0, Factura proveedor PROV-CL-002 y Domiciliación 0. Pulsa «Guardar».
2 	En el desplegable del título elige «Conformar», marca el albarán 0AC000003 y pulsa «Conformar».
3 	Cierra la ventana y recarga: la factura queda validada.
4 	Pulsa «Contabilizar» y «Aceptar».
[TABLA]
| [IMG:compras-050.jpg] |
| Figura 49   Albarán 0AC000003 en «Albaranes conformados» de la factura 0FC000002. |
[/TABLA]
[TABLA]
| [IMG:compras-051.jpg] |
| Figura 50   Asiento 2 (diario DC): 3 líneas, debe 72,60 = haber 72,60 (60,00 + 21 % IVA). |
[/TABLA]
[TABLA]
| ✓   QUÉ HAS CONSEGUIDO |
| ✓	Tipologías OCCL (oferta, serie OC), PCCL (pedido, serie PC, origen Oferta compras) y AOCL (albarán con origen Pedidos). / ✓	Oferta 0OC000001 de TCL, 5 × 12,00 = 60,00, validada. Compruébalo en Ofertas. / ✓	Pedido 0PC000001 creado con el formulario genérico, sin líneas (limitación de la base TUTORIAL). / ✓	Albarán 0AC000003 (AOCL) con la línea a mano, validado. / ✓	Factura 0FC000002 (PROV-CL-002) conformada y contabilizada a la primera: asiento 2 cuadrado a 72,60. / ✓	En la base TUTORIAL faltan el formulario del pedido y el numerador de acuerdos (gcomacuh/ACC); en una base real, la oferta genera el acuerdo y este, el pedido con líneas. |
[/TABLA]