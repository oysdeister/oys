[IMG:carteras-001.png]
DEISTER MANAGER  ·  MANUAL DE FORMACIÓN
FINANZAS · CARTERAS
Cartera de efectos
[TABLA]
|  |
[/TABLA]
Ejercicios documentados en la versión nueva del ERP
CONTENIDO
—	Antes de empezar
—	Ejercicio CARTERAS 1. Plazo de pago, tipo de efecto y condiciones del tercero
—	Ejercicio CARTERAS 3. Bancos propios
—	Ejercicio CARTERAS 5. Circuito de cobros
# Índice
Cómo usar este manual	3
Antes de empezar	5
Qué es la cartera de efectos	5
Cómo moverse por la versión nueva	5
Ejercicio CARTERAS 1. Plazo de pago, tipo de efecto y condiciones del tercero	6
1. Plazo de pago CA1 (antes «forma de pago»)	6
2. Tipo de efecto TCA (transferencia de pago)	8
3. Tercero TCA y sus condiciones de pago y cobro	11
4. Factura de compra financiera y sus efectos	14
Ejercicio CARTERAS 3. Bancos propios	20
5. Tercero de la entidad financiera	20
6. Banco propio BBVA_CA	21
7. Caja de efectivo CAJA_CA	23
Ejercicio CARTERAS 5. Circuito de cobros	26
8. Estados y acciones de los efectos	26
9. Artículo financiero CA1	27
10. Factura de venta y su efecto de cobro	29
11. Cobro individual del efecto: gestión sobre efectos	33
12. Cobro de varios efectos con una remesa	37
12.1 Preparar el banco: línea financiera y remesas por cuenta	37
12.2 Crear la remesa, agregar los efectos y cobrarla	40
# Cómo usar este manual
Este documento repite los ejercicios de carteras (cobros y pagos, bancos y remesas) sobre la versión nueva del ERP (Deister Manager, base BBDD TUTORIAL en nextdemo.geasa.eu). Para cada pantalla se explica para qué sirve en la empresa, dónde está en el menú, qué significa cada campo y qué pasos seguir. Los recuadros CAMBIO señalan lo que funciona distinto que en la versión antigua; los recuadros PROBLEMA y SOLUCIÓN, los errores reales que salieron al hacer los ejercicios y cómo se resuelven.
En los ejemplos se usan códigos con las letras CA (plazo CA1, tipo de efecto TCA, tercero TCA «Tercero Carteras», banco BBVA_CA…). Sustitúyelas por tus iniciales. En las tablas de campos, la columna «Oblig.» indica si la pantalla marca el campo con asterisco rojo.
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
## Qué es la cartera de efectos
[TABLA]
| ? | ¿PARA QUÉ SIRVE? / Cada factura que se contabiliza deja uno o varios vencimientos: lo que nos tienen que pagar (cartera de cobros) o lo que tenemos que pagar (cartera de pagos). Cada vencimiento es un «efecto» con su tipo (recibo, transferencia, cheque…), su fecha y su estado (pendiente, propuesto, ordenado, cobrado…). Tesorería trabaja sobre la cartera: agrupa efectos en remesas para enviarlos al banco, los cobra o paga uno a uno y, en cada cambio de estado, el ERP genera el asiento contable correspondiente. |
[/TABLA]
Los ejercicios siguen el orden del manual original:
•	Ejercicio CARTERAS 1: forma de pago (ahora «plazo de pago»), tipo de efecto, condiciones del tercero y factura de compra que genera los efectos.
•	Ejercicio CARTERAS 3: bancos propios: una cuenta bancaria y una caja de efectivo.
•	Ejercicio CARTERAS 5: circuito de cobros: artículo financiero, factura de venta, cobro individual de un efecto y cobro de varios efectos con una remesa.
## Cómo moverse por la versión nueva
•	Ya no se escribe la ruta (/ctipopag, /cbancpro…) en la barra de direcciones. Se usa el menú lateral (botón ☰ arriba a la izquierda, Finanzas › …) o el buscador superior «Buscar» (Cmd/Ctrl + K), escribiendo el nombre de la pantalla.
•	Las listas tienen un botón rojo arriba a la derecha («Añadir …» o «Nuevo») que abre el alta en una ventana; se guarda con «Guardar» abajo a la derecha. En las fichas, «Nuevo» ofrece «Nuevo registro» (en blanco) o «Nuevo como» (copia del registro que se está viendo).
•	Los campos con lista (tercero, cuenta, plazo…) son de autocompletar: se escribe el código, se espera a que salga la lista y se elige la fila. Si después no aparece la descripción debajo del campo, se sale del campo con Tab: muchos valores relacionados (dirección, plazo, cuenta) se rellenan al salir.
•	Las pestañas del registro están arriba, en horizontal, y los botones de acción (Validar, Contabilizar, Evolucionar estado…) en la barra superior. El desplegable (⌄) junto al título lleva a los documentos relacionados: asientos, cartera de efectos, registros fiscales.
[TABLA]
| Δ | CAMBIO / Los campos obligatorios llevan un asterisco rojo en la etiqueta y muchos campos tienen una longitud máxima: si se pasa, el campo se pone en rojo con «Demasiado largo» y el contador de caracteres (por ejemplo 4 / 3). |
[/TABLA]
# Ejercicio CARTERAS 1. Plazo de pago, tipo de efecto y condiciones del tercero
Se define un plazo de pago a 120 días en tres vencimientos (40 % - 20 % - 40 %), un tipo de efecto de pago por transferencia y un tercero que los usa en sus condiciones de pago. Al final se registra una factura de compra y se comprueba que recupera esas condiciones y genera tres efectos en la cartera de pagos.
## 1. Plazo de pago CA1 (antes «forma de pago»)
[TABLA]
| ? | ¿PARA QUÉ SIRVE? / El plazo de pago dice en cuántos vencimientos se divide una factura, a cuántos días o meses vence cada uno y qué porcentaje del total va en cada vencimiento. Se asigna al tercero y desde ahí pasa a sus facturas; al contabilizarlas, el ERP crea un efecto por cada plazo. |
[/TABLA]
MENÚ    Finanzas   ›   Maestros   ›   Terceros   ›   Condiciones administrativas   ›   Plazos de pago (objeto ctipopag)
[TABLA]
| CAMPO | QUÉ SIGNIFICA | VALOR DE EJEMPLO |
| Plazo pago * | Código del plazo. Es lo que se elige en el tercero y en las facturas. | CA1 |
| Descripción plazo * | Texto que se ve en las listas. | 3 plazos 40-20-40 en 120 dias CA |
| Unidad tiempo | Si los plazos se cuentan en días o en meses. | Días |
| Tipo cálculo * | Variable: se indican los días de cada plazo. Fija: número de plazos y cadencia. No generar: contado, sin vencimientos. | Variable |
| Primer / Segundo / Tercer / Cuarto plazo * | Días desde la fecha de factura hasta cada vencimiento. 0 = no se usa. | 40 / 80 / 120 / 0 |
| % Plazo 1 a 4 * | Porcentaje del importe que vence en cada plazo. Si se dejan a 0, el importe se reparte a partes iguales. | 40 / 20 / 40 / 0 |
[/TABLA]
*  Campo obligatorio: sin él no deja guardar.
1 	Abre la ruta: sale la lista de plazos (0, 30D, T2D, T3D…). Puedes abrir T3D para ver cómo está hecho uno de tres plazos.
2 	Desde la lista, pulsa «Añadir plazo».
3 	Escribe Plazo pago CA1 y la descripción; elige Tipo cálculo «Variable» y Unidad tiempo «Días».
4 	Rellena los plazos 40, 80 y 120 con los porcentajes 40, 20 y 40; deja el cuarto a 0.
5 	Pulsa «Guardar»: sale «Éxito» y CA1 aparece en la lista.
[TABLA]
| [IMG:carteras-002.jpg] |
| Figura 1   Plazo de referencia T3D: tres plazos a 30, 60 y 90 días con los porcentajes a 0 (reparto a partes iguales). |
[/TABLA]
[TABLA]
| [IMG:carteras-003.jpg] |
| Figura 2   Alta del plazo CA1: Variable, Días, plazos 40 / 80 / 120 con 40 / 20 / 40 %. |
[/TABLA]
[TABLA]
| Δ | CAMBIO / La antigua pantalla «Formas de pago» se llama ahora «Plazos de pago» y el campo de las facturas y del tercero se llama «Plazo pago». La estructura (tipo de cálculo, unidad de tiempo, cuatro plazos con su porcentaje) es la misma. |
[/TABLA]
[TABLA]
| i | A TENER EN CUENTA / El botón «Añadir plazo» no responde si se pulsa desde la ficha de un plazo; hay que volver a la lista (icono de lista o menú) y pulsarlo allí. |
[/TABLA]
## 2. Tipo de efecto TCA (transferencia de pago)
[TABLA]
| ? | ¿PARA QUÉ SIRVE? / El tipo de efecto es el instrumento con el que se cobra o se paga: recibo, transferencia, cheque, pagaré… Decide en qué estado nace el efecto, si hace falta una cuenta bancaria (del tercero o de la empresa), cómo cuenta para el riesgo del cliente y qué código fiscal se declara. Hay tipos de cobro y tipos de pago con el mismo código. |
[/TABLA]
MENÚ    Finanzas   ›   Cobros y Pagos   ›   Maestros   ›   Efectos   ›   Tipos (objeto ctipoefe)
[TABLA]
| CAMPO | QUÉ SIGNIFICA | VALOR DE EJEMPLO |
| Clase * | Cobrar (cartera de cobros) o Pagar (cartera de pagos). | Pagar |
| Tipo efecto * | Código del tipo. Máximo 3 caracteres. | TCA |
| Descripción * | Nombre del tipo. | Transferencia CA |
| Estado inicial | Estado en el que nace el efecto al contabilizar la factura. | PE Pendiente |
| Domiciliación bancaria * | No requiere / Tercero (exige la cuenta bancaria del tercero) / Empresa (exige una cuenta de la empresa). | No requiere |
| Días decalaje * | Días que se suman a la fecha de operación prevista para la tesorería. | 0 |
| Días post-pago * | Días tras el vencimiento que el efecto sigue contando en el riesgo. | 0 |
| Riesgo / Interés / Comisión impag. / Factura demora * | Control de riesgo comercial y cargos si el efecto queda impagado. | Riesgo marcado, 0, 0, sin marcar |
| Fecha operación * | Fecha de referencia para la previsión de tesorería (emisión, vencimiento, remesa…). | Emisión |
| UN/EDIFACT / Código Factura-E / Código fiscal * | Clasificación del medio de pago para factura electrónica y declaraciones. | Credit transfer / Transferencia / Transferencia |
[/TABLA]
*  Campo obligatorio: sin él no deja guardar.
1 	Abre la ruta y pulsa «Añadir tipo efecto».
2 	Elige Clase «Pagar», escribe el tipo TCA y la descripción, y elige Estado inicial PE (escribe PE y elige la fila).
3 	Deja Domiciliación bancaria en «No requiere» (así no hace falta la cuenta bancaria del proveedor para este ejercicio).
4 	En Clasificación elige UN/EDIFACT «Credit transfer», Código Factura-E «Transferencia» y Código fiscal «Transferencia».
5 	Pulsa «Guardar».
[TABLA]
| [IMG:carteras-004.jpg] |
| Figura 3   Lista de tipos de efectos: clase, estado inicial (casi todos PE), días post-pago, domiciliación y fecha de operación. |
[/TABLA]
[TABLA]
| [IMG:carteras-005.jpg] |
| Figura 4   Alta del tipo TCA: clase Pagar, estado inicial PE Pendiente y domiciliación «No requiere». |
[/TABLA]
[TABLA]
| [IMG:carteras-006.jpg] |
| Figura 5   Bloques Riesgo y Tesorería del tipo de efecto; se dejan los valores por defecto. |
[/TABLA]
[TABLA]
| ! | PROBLEMA / El manual antiguo proponía códigos como TFx (TF + iniciales). Con «TFCA» el campo se pone en rojo con «Demasiado largo 4 / 3». |
[/TABLA]
[TABLA]
| [IMG:carteras-007.jpg] |
| Figura 6   El código del tipo de efecto admite como máximo 3 caracteres. |
[/TABLA]
[TABLA]
| ✓ | SOLUCIÓN / Usa un código de 3 caracteres, por ejemplo TCA (T de transferencia + CA). |
[/TABLA]
[TABLA]
| Δ | CAMBIO / El estado inicial ya no se crea desde el tipo de efecto; se elige de la lista de estados existentes (PE Pendiente). Los estados están en Finanzas › Cobros y Pagos › Maestros › Efectos › Estados (cefecest). |
[/TABLA]
## 3. Tercero TCA y sus condiciones de pago y cobro
[TABLA]
| ? | ¿PARA QUÉ SIRVE? / El tercero es la ficha única de la empresa con la que trabajamos. Sus condiciones de pago (como proveedor) y de cobro (como cliente) dicen con qué tipo de efecto y con qué plazo se le paga o se le cobra; las facturas las copian a sus datos financieros. Para contabilizar hacen falta además sus relaciones contables (cuenta 400 de proveedor, 430 de cliente) y una dirección. |
[/TABLA]
MENÚ    Finanzas   ›   Maestros   ›   Terceros   ›   Registro de terceros (objeto ctercero)
[TABLA]
| CAMPO | QUÉ SIGNIFICA | VALOR DE EJEMPLO |
| Tercero / Nombre / Nombre comercial * | Código y razón social. | TCA / Tercero Carteras |
| País emisor / Tipo ID fiscal / Id. fiscal * | Identificación fiscal. Con «No censado» se admite 0. | ES / No censado / 0 |
| Categoría * | Tipo de tercero; trae serie y relación por defecto. | 002 Proveedores |
| Relaciones (pestaña) * | Papel contable y cuenta: Cliente CLI 43000.00000 y Proveedor PRO 40000.00000. | CLI y PRO |
| Direcciones (pestaña) * | Dirección 0 de domicilio fiscal; el código postal rellena provincia y población. | 08001 Carrer de Pelai 2 |
| Condiciones de pago › Tipo efecto / Plazo pago * | Cómo y cuándo se le paga como proveedor. | TCA / CA1 |
| Condiciones de cobro › Tipo efecto / Estado efecto / Plazo pago * | Cómo y cuándo se le cobra como cliente (se usa en el ejercicio 5). | RC Recibo / PE / 30D |
[/TABLA]
*  Campo obligatorio: sin él no deja guardar.
1 	Abre la lista de terceros, pulsa «Añadir tercero» y rellena TCA, «Tercero Carteras», ES, No censado, 0 y categoría 002. Pulsa «Guardar».
2 	Abre la ficha (fila TCA) y, en la pestaña «Relaciones», añade Cliente / CLI / PGE 2008 / 43000.00000 y Proveedor / PRO / PGE 2008 / 40000.00000.
3 	En «Direcciones» añade la dirección 0 con el código postal 08001 y la calle.
4 	En «Condiciones de pago» pulsa «Añadir pago», elige Tipo efecto TCA y Plazo pago CA1 y guarda.
5 	En «Condiciones de cobro» pulsa «Añadir cobro», elige RC, estado PE y plazo 30D y guarda.
6 	Pulsa «Validar» en la barra superior: el tercero pasa de Provisional a Validado.
[TABLA]
| [IMG:carteras-008.jpg] |
| Figura 7   Alta del tercero TCA. El aviso naranja «Cif already exists!» es solo informativo: otro tercero también tiene Id. fiscal 0. |
[/TABLA]
[TABLA]
| [IMG:carteras-009.jpg] |
| Figura 8   Relaciones de TCA: Cliente CLI 43000.00000 y Proveedor PRO 40000.00000; «Cuenta repetida» es un aviso informativo. |
[/TABLA]
[TABLA]
| [IMG:carteras-010.jpg] |
| Figura 9   Condición de pago: tipo de efecto TCA y plazo CA1. Es la que recuperarán las facturas de compra. |
[/TABLA]
[TABLA]
| [IMG:carteras-011.jpg] |
| Figura 10   Pestaña Condiciones de pago con la línea guardada. |
[/TABLA]
[TABLA]
| Δ | CAMBIO / Ya no hay una única pestaña «Condiciones» con un campo Cobro/Pago; hay dos pestañas separadas, «Condiciones de pago» y «Condiciones de cobro». En la de cobro el estado del efecto es obligatorio; en la de pago se toma el estado inicial del tipo de efecto. |
[/TABLA]
## 4. Factura de compra financiera y sus efectos
[TABLA]
| ? | ¿PARA QUÉ SIRVE? / La factura de compra de Finanzas (sin albarán ni pedido) registra un gasto o servicio del proveedor. Al elegir el proveedor copia sus condiciones de pago; al contabilizarla genera el asiento (gasto e IVA contra la 400) y un efecto de pago por cada plazo, que quedan en la cartera esperando su pago. |
[/TABLA]
MENÚ    Finanzas   ›   Facturación   ›   Compras   ›   Fact. de compra (objeto ccomfach)
[TABLA]
| CAMPO | QUÉ SIGNIFICA | VALOR DE EJEMPLO |
| Tipo de factura * | Tipología de factura de compra (serie, diario). | FC Fact. compra |
| Empresa / Proyecto / Sección * | Unidad de negocio. Al elegir la empresa hay que volver a rellenar proyecto y sección. | 0 / 0 / 0 |
| Proveedor / Tipo de dirección * | Tercero que factura; trae nombre, Id. fiscal y dirección. | TCA / 0 |
| Factura proveedor * | Número de la factura del proveedor. | PROV-CA-001 |
| Número factura | Lo pone la serie al guardar. | FC026-000001 |
| Datos financieros › Perceptor / Tipo efecto / Plazo pago * | Se copian de las condiciones de pago del tercero. | TCA / TCA / CA1 |
| Importe factura * | Total de control de la factura. | 121,00 |
| Detalle › Artículo / Precio / Cuenta * | Línea de la factura; la cuenta sale del artículo. | S Servicios / 100,00 / 60000.00000 |
| Detalle › Centro coste / Cuenta explotación * | Analítica: obligatorios con cuentas de gasto. | 0 / 0 |
[/TABLA]
*  Campo obligatorio: sin él no deja guardar.
1 	Abre la ruta y pulsa «Nuevo documento».
2 	Elige Tipo de factura FC y Empresa 0; vuelve a elegir Proyecto 0 y Sección 0.
3 	Elige el Proveedor TCA y escribe la Factura proveedor PROV-CA-001.
4 	Abre la pestaña «Datos financieros»: comprueba que salen TCA y el plazo CA1 sin haberlos escrito.
5 	Escribe el Importe factura 121 y pulsa «Guardar». Abre la factura (FC026-000001).
6 	En la pestaña «Detalle» pulsa «Nuevo»: artículo S Servicios, precio 100, centro de coste 0 y cuenta de explotación 0. Guarda.
7 	Pulsa «Validar» y mira la pestaña «Vencimientos»: salen tres vencimientos.
8 	Abre «Acciones › Contabilizar». Comprueba los efectos con el desplegable (⌄) del título › «Cartera de efectos» o en Cobros y Pagos.
[TABLA]
| [IMG:carteras-012.jpg] |
| Figura 11   Alta de la factura de compra: tipo FC, empresa 0, proveedor TCA con su dirección y factura del proveedor PROV-CA-001. |
[/TABLA]
[TABLA]
| [IMG:carteras-013.jpg] |
| Figura 12   Datos financieros recuperados del tercero: perceptor TCA, tipo efecto TCA y plazo CA1. |
[/TABLA]
[TABLA]
| [IMG:carteras-014.jpg] |
| Figura 13   Línea de la factura: S Servicios, 1 × 100,00; cuenta 60000.00000 con centro de coste y cuenta de explotación 0. |
[/TABLA]
[TABLA]
| [IMG:carteras-015.jpg] |
| Figura 14   Vencimientos de la factura validada: 48,40 + 24,20 + 48,40 = 121,00 (40 / 20 / 40 %) a 40, 80 y 120 días. |
[/TABLA]
[TABLA]
| [IMG:carteras-016.jpg] |
| Figura 15   Cartera de efectos: los tres efectos de pago de TCA (filas 14 a 16) en estado PE, con órdenes 1, 2 y 3. |
[/TABLA]
[TABLA]
| [IMG:carteras-017.jpg] |
| Figura 16   Asiento 10 de la factura (diario DC Compras): 3 líneas, debe 121,00 = haber 121,00. |
[/TABLA]
[TABLA]
| ! | PROBLEMA / Al guardar la línea con solo artículo y precio sale «Hay errores en los datos del formulario»: Centro coste y Cuenta explotación pasan a ser obligatorios en cuanto se informa una cuenta de gasto o de ingreso. |
[/TABLA]
[TABLA]
| ✓ | SOLUCIÓN / Elige Centro coste 0 y Cuenta explotación 0 (escribe 0 y elige la fila). Si la lista sale vacía al pulsar la flecha, escribe un carácter. |
[/TABLA]
[TABLA]
| i | A TENER EN CUENTA / Si al escribir el precio sale 1,000000 en lugar de 100, el campo tenía el texto seleccionado a medias: selecciona todo (Cmd/Ctrl + A) y vuelve a escribirlo. |
[/TABLA]
[TABLA]
| Δ | CAMBIO / Los efectos se ven en la propia factura (pestaña «Vencimientos») y, una vez contabilizada, en el asiento (pestaña «Carteras») y en Finanzas › Cobros y Pagos › Cobros y Pagos (cefectos). Ya no hay una pestaña «Apuntes» en la factura: el asiento se abre desde el desplegable del título. |
[/TABLA]
[TABLA]
| [IMG:carteras-018.jpg] |
| Figura 17   Asiento de la factura, pestaña Carteras: los tres efectos generados al contabilizar. |
[/TABLA]
[TABLA]
| ✓   QUÉ HAS CONSEGUIDO |
| ✓	Plazo de pago CA1 (3 plazos a 40, 80 y 120 días al 40 / 20 / 40 %) y tipo de efecto de pago TCA (transferencia, estado inicial PE). / ✓	Tercero TCA validado, con relaciones CLI y PRO, dirección 0, condición de pago TCA + CA1 y condición de cobro RC + PE + 30D. / ✓	Factura de compra FC026-000001 (PROV-CA-001) de 121,00 contabilizada (asiento 10). Compruébalo: en la cartera hay tres efectos de pago PE de 48,40, 24,20 y 48,40. |
[/TABLA]
# Ejercicio CARTERAS 3. Bancos propios
Se definen las cuentas financieras de la empresa: una cuenta corriente en un banco (BBVA_CA) y una caja de efectivo (CAJA_CA). Son las cuentas contra las que se cobran y pagan los efectos y las que llevan las remesas al banco.
## 5. Tercero de la entidad financiera
[TABLA]
| ? | ¿PARA QUÉ SIRVE? / Cada banco propio está ligado a un tercero «entidad financiera» con su dirección. Como en la versión antigua, hay que crearlo antes que el banco. |
[/TABLA]
MENÚ    Finanzas   ›   Maestros   ›   Terceros   ›   Registro de terceros (objeto ctercero)
[TABLA]
| CAMPO | QUÉ SIGNIFICA | VALOR DE EJEMPLO |
| Tercero / Nombre * | Código y nombre del banco. | BCA / BBVA Carteras CA |
| País emisor / Tipo ID fiscal / Id. fiscal * | Identificación fiscal. | ES / No censado / 0 |
| Categoría * | Tipo de tercero: 008 Entidades Financieras. | 008 |
| Dirección 0 * | Domicilio del banco; es obligatoria para usarlo en el banco propio. | 08001 Plaça de Catalunya 5 |
[/TABLA]
*  Campo obligatorio: sin él no deja guardar.
1 	Da de alta el tercero BCA con la categoría 008 Entidades Financieras.
2 	Añade la dirección 0 en la pestaña «Direcciones» y pulsa «Validar».
[TABLA]
| [IMG:carteras-019.jpg] |
| Figura 18   Lista de terceros con BCA «BBVA Carteras CA», categoría Entidades Financieras. |
[/TABLA]
## 6. Banco propio BBVA_CA
[TABLA]
| ? | ¿PARA QUÉ SIRVE? / El banco propio (cuenta financiera) representa una cuenta de la empresa en un banco: a qué cuenta contable (572) van sus movimientos, qué tipos de remesa admite y con qué líneas financieras (contratos) trabaja. Es la cuenta que se elige al cobrar, pagar y remesar. |
[/TABLA]
MENÚ    Finanzas   ›   Cobros y Pagos   ›   Maestros   ›   Auxiliares   ›   Bancos propios (objeto cbancpro)
[TABLA]
| CAMPO | QUÉ SIGNIFICA | VALOR DE EJEMPLO |
| Empresa / Proyecto / Sección * | Unidad de negocio. | 0 / 0 / 0 |
| Cuenta financiera * | Código de la cuenta. Máximo 10 caracteres. | BBVA_CA |
| Desc. cuenta financiera * | Nombre de la cuenta. | BBVA cuenta corriente CA |
| Moneda / Estado * | Divisa y estado. | EUR / Abierto |
| Banco / Tipo de cuenta (IBAN, BBAN) / Núm. cuenta / IBAN | Datos bancarios. Si se informa el banco hay que informar también la cuenta. | Vacíos en el ejercicio |
| Tipo de cuenta * | Cuenta corriente, de ahorro, de crédito, caja de efectivo… | Cuenta corriente |
| Entidad financiera / Tipo de dirección * | Tercero del banco y su dirección. | BCA / 0 |
| Cuenta * | Cuenta contable de la tesorería. | 57200.00000 |
| Preferencia / Fecha apertura / Formato extracto * | Datos de gestión; se dejan los valores por defecto. | Sí / hoy / España AEB43 |
| Agrupación cuentas * | Grupo de tesorería para los informes. Se crea con «+» si no existe. | CA Bancos y cajas CA |
[/TABLA]
*  Campo obligatorio: sin él no deja guardar.
1 	Abre la ruta y pulsa «Añadir bancos propios».
2 	Rellena empresa, proyecto y sección 0, la cuenta financiera BBVA_CA y su descripción.
3 	Deja vacíos Banco, número de cuenta e IBAN (ver el PROBLEMA de abajo).
4 	Elige Entidad financiera BCA, Tipo de dirección 0 y Cuenta 57200.00000 (escribe 5720 para filtrar).
5 	En Agrupación cuentas pulsa «+» y crea el grupo: Tipo Cuenta, Grupo tesorería CA, Descripción «Bancos y cajas CA».
6 	Pulsa «Guardar».
[TABLA]
| [IMG:carteras-020.jpg] |
| Figura 19   Información complementaria del banco: entidad BCA, cuenta 57200.00000 y agrupación CA. |
[/TABLA]
[TABLA]
| ! | PROBLEMA / Si se elige el Banco (por ejemplo ES0057 BBVA) sin escribir el número de cuenta, al guardar sale «Las siguientes restricciones de verificación fallaron: Entidad y cuenta bancaria, ambos nulos o no nulos». |
[/TABLA]
[TABLA]
| [IMG:carteras-021.jpg] |
| Figura 20   Error al guardar el banco con la entidad bancaria informada y sin número de cuenta. |
[/TABLA]
[TABLA]
| ✓ | SOLUCIÓN / O se informan los dos (banco y cuenta o IBAN) o ninguno. En este manual no se escriben datos bancarios reales: el banco se deja vacío. En un caso real, la persona responsable introduce el IBAN de la empresa en esta pantalla. |
[/TABLA]
[TABLA]
| i | A TENER EN CUENTA / El antiguo recuadro «Numeradores» está ahora en la pestaña «Numeradores» de la ficha del banco; la ficha tiene además las pestañas Condiciones bancarias, Operaciones por cuenta, Comisiones, Remesas por cuenta y Líneas financieras. |
[/TABLA]
## 7. Caja de efectivo CAJA_CA
[TABLA]
| ? | ¿PARA QUÉ SIRVE? / La caja de efectivo es otra cuenta financiera, sin datos bancarios, para los cobros y pagos en metálico. Se da de alta en la misma pantalla. |
[/TABLA]
MENÚ    Finanzas   ›   Cobros y Pagos   ›   Maestros   ›   Auxiliares   ›   Bancos propios (objeto cbancpro)
[TABLA]
| CAMPO | QUÉ SIGNIFICA | VALOR DE EJEMPLO |
| Cuenta financiera * | Código de la caja (máximo 10 caracteres). | CAJA_CA |
| Desc. cuenta financiera * | Nombre de la caja. | Caja efectivo CA |
| Tipo de cuenta * | Tipo «Caja de efectivo». | Caja de efectivo |
| Entidad financiera / Tipo de dirección * | Tercero y dirección asociados. | BCA / 0 |
| Cuenta * | Cuenta contable de caja. | 57000.00000 Caja, euros |
| Agrupación cuentas * | Mismo grupo que el banco. | CA |
[/TABLA]
*  Campo obligatorio: sin él no deja guardar.
1 	Pulsa «Añadir bancos propios» y rellena empresa, proyecto, sección, CAJA_CA y la descripción.
2 	Elige Tipo de cuenta «Caja de efectivo», entidad BCA, dirección 0, cuenta 57000.00000 y agrupación CA.
3 	Pulsa «Guardar».
[TABLA]
| [IMG:carteras-022.jpg] |
| Figura 21   Alta de la caja: tipo Caja de efectivo, sin banco, cuenta 57000.00000. |
[/TABLA]
[TABLA]
| ! | PROBLEMA / El código «BBVA_CAJA_CA» del manual antiguo (BBVA_Caja_x) da «Demasiado largo 12 / 10». SOLUCIÓN: usa un código de 10 caracteres como máximo, por ejemplo CAJA_CA. |
[/TABLA]
[TABLA]
| [IMG:carteras-023.jpg] |
| Figura 22   Lista de bancos propios con BBVA_CA (57200) y CAJA_CA (57000) en la agrupación CA. |
[/TABLA]
[TABLA]
| ✓   QUÉ HAS CONSEGUIDO |
| ✓	Tercero BCA «BBVA Carteras CA» (entidad financiera) con dirección 0. / ✓	Agrupación de cuentas CA y cuentas financieras BBVA_CA (57200.00000) y CAJA_CA (57000.00000, caja de efectivo). / ✓	Compruébalo en la lista de Bancos propios. Las líneas financieras y remesas de BBVA_CA se completan en el ejercicio 5. |
[/TABLA]
# Ejercicio CARTERAS 5. Circuito de cobros
Se monta el circuito completo de un cobro: un artículo financiero, una factura de venta al tercero TCA, el cobro individual de su efecto (de PE Pendiente a CO Cobrado) y el cobro de varios efectos juntos mediante una remesa enviada al banco BBVA_CA.
## 8. Estados y acciones de los efectos
[TABLA]
| ? | ¿PARA QUÉ SIRVE? / El ciclo de vida de un efecto se define con dos maestros. Los estados (PE Pendiente, PR Propuesto, OC Ordenado, CO Cobrado, PA Pagado, DV Devuelto…) dicen si el efecto está liquidado o impagado. Las acciones son los pasos permitidos: cada una lleva el efecto a un estado final y genera su asiento con una plantilla contable. El circuito PE › CO de un cobro ya viene definido en la base; no hace falta crear estados nuevos. |
[/TABLA]
MENÚ    Finanzas   ›   Cobros y Pagos   ›   Maestros   ›   Efectos   ›   Estados (cefecest) y Maestros   ›   Acciones   ›   Relación de acciones (cefeacti)
[TABLA]
| [IMG:carteras-024.jpg] |
| Figura 23   Estados de los efectos: PE Pendiente (liquidación pendiente), CO Cobrado y PA Pagado (liquidado), DV Devuelto (impagado)… |
[/TABLA]
[TABLA]
| [IMG:carteras-025.jpg] |
| Figura 24   Acciones sobre efectos: COBD Cobro directo (individual) lleva el efecto a CO con el asiento COBD; las acciones de remesa están marcadas como «Acción remesa». |
[/TABLA]
[TABLA]
| Δ | CAMBIO / Lo que el manual antiguo llamaba «definir un nuevo circuito de cobros» se apoya ahora en la Relación de acciones: estado final, asiento, plantilla y si la acción es individual o de remesa. Para el ejercicio se usan las acciones existentes COBD y las de los tipos de remesa. |
[/TABLA]
## 9. Artículo financiero CA1
[TABLA]
| ? | ¿PARA QUÉ SIRVE? / Los artículos de Finanzas son los conceptos que se facturan sin pasar por gestión (servicios, alquileres, suplidos…). Deciden el tipo fiscal (IVA) y la cuenta de compras o ventas de la línea. |
[/TABLA]
MENÚ    Finanzas   ›   Facturación   ›   Maestros   ›   Artículos (objeto carticul)
[TABLA]
| CAMPO | QUÉ SIGNIFICA | VALOR DE EJEMPLO |
| Artículo / Descripción * | Código y nombre. | CA1 / Servicios de asesoria CA |
| Unidad medida / Estado * | Unidad y estado. | UN / Abierto |
| Tipo fiscal / Clave fiscal artículo * | Naturaleza para el IVA: bien, servicio, alquiler, suplido… | Servicio / SOG |
| Precio / Precio de venta * | Precio variable con un precio propuesto. | Variable / 200,00 |
| Mnemotécnico de compras / ventas | Cuenta contable propuesta para compras y para ventas. | 62300 / 70500 |
| % Descuento compras / ventas * | Descuento por defecto. | 0 / 0 |
[/TABLA]
*  Campo obligatorio: sin él no deja guardar.
1 	Abre la ruta y pulsa «Añadir artículo».
2 	Rellena CA1, la descripción, Tipo fiscal «Servicio» y Clave fiscal SOG.
3 	Escribe el precio de venta 200 y elige los mnemotécnicos 62300 y 70500.
4 	Pulsa «Guardar».
[TABLA]
| [IMG:carteras-026.jpg] |
| Figura 25   Alta del artículo CA1: servicio SOG, precio 200, mnemotécnicos 62300 (compras) y 70500 (ventas). |
[/TABLA]
El tercero TCA ya tiene la relación de cliente CLI (43000) y la condición de cobro RC / PE / 30D creadas en el apartado 3:
[TABLA]
| [IMG:carteras-027.jpg] |
| Figura 26   Condición de cobro de TCA: tipo de efecto RC Recibo, estado PE Pendiente y plazo 30 días. |
[/TABLA]
## 10. Factura de venta y su efecto de cobro
[TABLA]
| ? | ¿PARA QUÉ SIRVE? / La factura de venta de Finanzas registra un ingreso al cliente. Copia del tercero la condición de cobro y, al contabilizarla, genera el asiento (430 contra ventas e IVA) y el efecto de cobro en estado PE. |
[/TABLA]
MENÚ    Finanzas   ›   Facturación   ›   Ventas   ›   Factura de venta (objeto cvenfach)
[TABLA]
| CAMPO | QUÉ SIGNIFICA | VALOR DE EJEMPLO |
| Tipo de factura * | Tipología de factura de venta. | FV Factura de ventas |
| Empresa / Proyecto / Sección * | Unidad de negocio. | 0 / 0 / 0 |
| Cliente * | Tercero; al salir del campo con Tab copia nombre, dirección y datos financieros. | TCA |
| Perceptor / Tipo efecto / Plazo pago / Cuenta * | Datos financieros copiados de la condición de cobro y de la relación CLI. | TCA / RC / 30 días / 43000.00000 |
| Detalle › Artículo / Precio * | Línea; el precio sale del artículo. | CA1 / 200,00 |
| Detalle › Cuenta / Centro coste / Cuenta explotación * | Cuenta de ventas y analítica (obligatorias). | 70500.00000 / 0 / 0 |
[/TABLA]
*  Campo obligatorio: sin él no deja guardar.
1 	Abre la ruta y pulsa «Nuevo documento».
2 	Elige FV, empresa 0, proyecto 0 y sección 0.
3 	Escribe TCA en Cliente, elige la fila y pulsa Tab: se rellenan dirección, RC, 30 días y la cuenta 43000.00000.
4 	Pulsa «Guardar» y abre la factura (#1).
5 	En «Detalle» pulsa «Nuevo»: artículo CA1, cuenta 70500.00000, centro de coste 0 y cuenta de explotación 0. Guarda.
6 	Pulsa «Validar» y después «Contabilizar»: la factura toma el número FVN026-000001 y la banda «CONTABILIZADO».
7 	Mira la pestaña «Vencimientos»: un efecto RC en estado PE de 242,00.
[TABLA]
| [IMG:carteras-028.jpg] |
| Figura 27   Alta de la factura de venta: tras salir del campo Cliente con Tab se copian dirección, RC, 30 días y la cuenta 43000.00000. |
[/TABLA]
[TABLA]
| [IMG:carteras-029.jpg] |
| Figura 28   Línea de la factura: CA1 a 200,00 con la cuenta 70500.00000. |
[/TABLA]
[TABLA]
| ! | PROBLEMA / Si se elige el cliente con Intro y no se sale del campo, Nombre tercero, Dirección, Tipo efecto y Plazo pago se quedan vacíos y el formulario no deja guardar. |
[/TABLA]
[TABLA]
| ✓ | SOLUCIÓN / Elige la fila del cliente y pulsa Tab (o haz clic en otro campo); en ese momento se cargan todos los datos del tercero. |
[/TABLA]
[TABLA]
| ! | PROBLEMA / La cuenta de la línea no se propone sola desde el mnemotécnico del artículo y, al guardarla, Centro coste y Cuenta explotación salen en rojo como obligatorios. |
[/TABLA]
[TABLA]
| [IMG:carteras-030.jpg] |
| Figura 29   Error al guardar la línea: con la cuenta 70500 son obligatorios el centro de coste y la cuenta de explotación. |
[/TABLA]
[TABLA]
| ✓ | SOLUCIÓN / Elige la cuenta 70500.00000 de la lista y rellena Centro coste 0 y Cuenta explotación 0. |
[/TABLA]
[TABLA]
| [IMG:carteras-031.jpg] |
| Figura 30   Factura FVN026-000001 contabilizada: un vencimiento RC / PE de 242,00 (200,00 + 42,00 de IVA). |
[/TABLA]
[TABLA]
| Δ | CAMBIO / El número definitivo de la factura (FVN026-000001) se asigna al contabilizar; mientras está provisional la ficha se titula «#1». Tras contabilizar, los botones pasan a ser «Descontabilizar», «Copiar» y «eFactura». |
[/TABLA]
[TABLA]
| i | A TENER EN CUENTA / El manual antiguo hacía en este punto una factura de anticipo. En la versión nueva el anticipo se gestiona con su propio circuito; aquí se usa una factura normal porque lo que interesa es el ciclo del efecto en cartera. |
[/TABLA]
## 11. Cobro individual del efecto: gestión sobre efectos
[TABLA]
| ? | ¿PARA QUÉ SIRVE? / Cobrar un efecto suelto (el cliente paga por transferencia o en caja) se hace con una gestión: un documento que reúne uno o varios efectos, les aplica una acción (aquí COBD Cobro directo) contra una cuenta financiera y, al cerrarlo, cambia su estado a CO y genera el asiento de cobro. |
[/TABLA]
MENÚ    Finanzas   ›   Cobros y Pagos   ›   Gestiones   ›   Gestiones sobre efectos (objeto cefecges_pcs)
[TABLA]
| CAMPO | QUÉ SIGNIFICA | VALOR DE EJEMPLO |
| Empresa / Proyecto / Sección * | Unidad de negocio. | 0 / 0 / 0 |
| Fecha proceso / Clase * | Fecha del cobro y cartera. | Hoy / Cobrar |
| Acción * | Acción que se aplica a los efectos. | COBD Cobro directo |
| Manual * | Gestión manual (los efectos se eligen a mano). | Sí |
| Cuenta financiera | Banco o caja donde entra el dinero. | BBVA_CA |
| Perceptor / Nombre * | Tercero que paga; el nombre se rellena solo. | TCA / Tercero Carteras |
[/TABLA]
*  Campo obligatorio: sin él no deja guardar.
1 	Abre la ruta y pulsa «Nuevo». Rellena empresa 0, clase Cobrar, acción COBD, cuenta financiera BBVA_CA y perceptor TCA (sal con Tab). Guarda.
2 	Abre la gestión (0-5) y baja a la pestaña «Selección de efectos».
3 	Marca solo el efecto de TCA (FVN026-000001, 242,00) y pulsa «Agregar efectos».
4 	En «Efectos seleccionados» comprueba el efecto; la cabecera suma 242,00.
5 	Pulsa «Cerrar» y confirma: el efecto pasa a CO Cobrado.
6 	Abre el asiento con el desplegable (⌄) del título › «Asientos contables».
[TABLA]
| [IMG:carteras-032.jpg] |
| Figura 31   Ficha del efecto de cobro: TCA, cuenta 43000, tipo RC, estado PE, 242,00; botones Evolucionar estado y Retroceder. |
[/TABLA]
[TABLA]
| ! | PROBLEMA / Desde la ficha del efecto, el botón «Evolucionar estado» abre su diálogo pero al desplegar «Acción» (o escribir COBD) sale «Se ha producido un error … No such column 'emi_repres_nif'». Es un error de la base TUTORIAL en la lista de valores de esa pantalla. |
[/TABLA]
[TABLA]
| [IMG:carteras-033.jpg] |
| Figura 32   Error de la base TUTORIAL al elegir la acción desde la ficha del efecto. |
[/TABLA]
[TABLA]
| ✓ | SOLUCIÓN / Cobra el efecto con una «Gestión sobre efectos» (pasos de arriba), que hace lo mismo y además permite cobrar varios efectos a la vez. |
[/TABLA]
[TABLA]
| [IMG:carteras-034.jpg] |
| Figura 33   Alta de la gestión: clase Cobrar, acción COBD Cobro directo, cuenta BBVA_CA y perceptor TCA. |
[/TABLA]
[TABLA]
| [IMG:carteras-035.jpg] |
| Figura 34   Selección de efectos: salen todos los efectos de cobro pendientes; se marca solo el de TCA. |
[/TABLA]
[TABLA]
| [IMG:carteras-036.jpg] |
| Figura 35   Gestión cerrada: el efecto ha pasado de PE a CO Cobrado (con «Abrir» se deshace). |
[/TABLA]
[TABLA]
| [IMG:carteras-037.jpg] |
| Figura 36   Asiento del cobro CA026-000001: 57200.00000 Bancos al debe y 43000.00000 Clientes al haber, 242,00. |
[/TABLA]
[TABLA]
| Δ | CAMBIO / En la versión antigua el efecto se avanzaba desde la propia cartera; ahora lo normal es agrupar los cobros y pagos en gestiones (o en remesas, apartado 12), que dejan rastro del proceso y del asiento generado. |
[/TABLA]
## 12. Cobro de varios efectos con una remesa
[TABLA]
| ? | ¿PARA QUÉ SIRVE? / Una remesa agrupa varios efectos de cobro para presentarlos juntos al banco. Su tipo decide el circuito: al agregar los efectos pasan a PR (propuesto), al ordenarla a OC (ordenado) y al confirmar el cobro a CO, con el asiento del banco. Antes hay que preparar el banco: una línea financiera y los tipos de remesa que admite («Remesas por cuenta»). |
[/TABLA]
## 12.1 Preparar el banco: línea financiera y remesas por cuenta
MENÚ    Bancos propios   ›   BBVA_CA   ›   pestañas «Líneas financieras   ›   y «Remesas por cuenta
[TABLA]
| CAMPO | QUÉ SIGNIFICA | VALOR DE EJEMPLO |
| Línea financiera / Descripción * | Contrato del banco con el que se trabaja. | CA1 / Remesas de cobro CA |
| Tipo de línea * | Clase de contrato. En TUTORIAL no hay ninguno: se crea con «+». | CA Remesas cobro CA |
| Referencia financiera * | Referencia del contrato (no es un dato bancario). | CONTRATO-CA-001 |
| Fecha inicio / Fecha fin * | Vigencia del contrato. | 01-11-2026 / 31-12-2027 |
| Cargo / Límite concedido / Límite operativo * | Tipo de operación y límites. | Gestión cobros / 100.000 / 100.000 |
| Remesas por cuenta › Remesa * | Tipo de remesa que admite la cuenta. | CSCTS (y CSDDS) |
| Remesas por cuenta › Línea financiera / Límite | Línea asociada y límite de importe. | CA1 / 100.000 |
[/TABLA]
*  Campo obligatorio: sin él no deja guardar.
1 	Abre BBVA_CA y la pestaña «Líneas financieras»; pulsa «Nuevo».
2 	Escribe la línea CA1 y la descripción; en Tipo de línea pulsa «+» y crea CA «Remesas cobro CA».
3 	Rellena referencia, fechas, cargo «Gestión cobros» y límites. Guarda.
4 	En «Remesas por cuenta» pulsa «Nuevo», elige la remesa CSCTS (Cobro transferencias, sin Tesorería) y guarda. Repite con CSDDS si quieres probar los recibos domiciliados.
[TABLA]
| [IMG:carteras-038.jpg] |
| Figura 37   Sin remesas por cuenta, al crear la remesa el Tipo remesa no ofrece valores («Datos no disponibles»). |
[/TABLA]
[TABLA]
| [IMG:carteras-039.jpg] |
| Figura 38   Línea financiera CA1 de BBVA_CA con el tipo de línea CA creado desde el «+». |
[/TABLA]
[TABLA]
| [IMG:carteras-040.jpg] |
| Figura 39   Tipos de remesas de efectos (cremesad): cada tipo tiene su serie (RM), clase y acción inicial. |
[/TABLA]
[TABLA]
| [IMG:carteras-041.jpg] |
| Figura 40   Remesas por cuenta de BBVA_CA con el tipo de remesa asociado. |
[/TABLA]
[TABLA]
| ! | PROBLEMA / En la remesa nueva el Tipo remesa sale vacío porque la cuenta financiera no tiene definidas sus «Remesas por cuenta». SOLUCIÓN: añade en el banco los tipos de remesa que vaya a usar (pasos de arriba). |
[/TABLA]
## 12.2 Crear la remesa, agregar los efectos y cobrarla
MENÚ    Finanzas   ›   Cobros y Pagos   ›   Remesas   ›   Registro de remesas (objeto cremesas)
[TABLA]
| CAMPO | QUÉ SIGNIFICA | VALOR DE EJEMPLO |
| Empresa / Cuenta financiera * | Empresa y banco al que se presenta. | 0 / BBVA_CA |
| Fecha remesa / Fecha valor * | Fechas de la remesa. | Hoy |
| Clase / Tipo remesa * | Cartera y tipo; el tipo solo ofrece los definidos en el banco. | Cobrar / CSCTS |
| Justificante / Acción * | Se rellenan solos con el tipo: serie RM y acción inicial. | RM026-000002 / RCSCTP |
| Importe máximo / Total remesa * | Límite y suma de los efectos agregados. | 1.000.000.000 / 242,00 |
[/TABLA]
*  Campo obligatorio: sin él no deja guardar.
1 	Para tener varios efectos, crea otra factura de venta a TCA con «Nuevo › Nuevo como» desde la FVN026-000001, cambia el Plazo pago a T2D, añade la línea CA1 y contabilízala: FVN026-000002 genera 2 efectos de 121,00.
2 	Abre el Registro de remesas y pulsa «Nuevo»: empresa 0, cuenta BBVA_CA, clase Cobrar, tipo CSCTS (sal con Tab). Guarda.
3 	Abre la remesa, pestaña «Selección de efectos», marca los dos efectos de FVN026-000002 y pulsa «Agregar efectos»: pasan a PR y el total es 242,00.
4 	Pulsa «Evolucionar estado» y acepta «Remesa cobro transferencias, ordenar (s/Tes)»: los efectos pasan a OC.
5 	Vuelve a pulsar «Evolucionar estado» y acepta «Remesa, confirmar pago por bancos (s/Tes)» con la fecha de contabilización: los efectos pasan a CO.
6 	Mira la pestaña «Apuntes» de la remesa con el asiento del cobro.
[TABLA]
| [IMG:carteras-042.jpg] |
| Figura 41   Segunda factura con plazo T2D: dos vencimientos de 121,00. |
[/TABLA]
[TABLA]
| [IMG:carteras-043.jpg] |
| Figura 42   Alta de la remesa: al elegir el tipo se rellenan el justificante RM y la acción inicial. |
[/TABLA]
[TABLA]
| [IMG:carteras-044.jpg] |
| Figura 43   Selección de efectos de la remesa: se marcan los dos efectos de FVN026-000002. |
[/TABLA]
[TABLA]
| [IMG:carteras-045.jpg] |
| Figura 44   Efectos agregados: pasan de PE a PR Propuesto y el total de la remesa es 242,00. |
[/TABLA]
[TABLA]
| [IMG:carteras-046.jpg] |
| Figura 45   Remesa ordenada: efectos en OC y nuevas pestañas Gestión remesas, Apuntes y Tesorería. |
[/TABLA]
[TABLA]
| [IMG:carteras-047.jpg] |
| Figura 46   Confirmación del cobro por el banco con la fecha de contabilización. |
[/TABLA]
[TABLA]
| [IMG:carteras-048.jpg] |
| Figura 47   Remesa cobrada: los dos efectos en CO; «Evolucionar estado» ya no está disponible. |
[/TABLA]
[TABLA]
| [IMG:carteras-049.jpg] |
| Figura 48   Apuntes de la remesa: asiento con 57200.00000 Bancos al debe y una línea por efecto al haber. |
[/TABLA]
[TABLA]
| ! | PROBLEMA / Con el tipo CSDDS (Cobro débitos directos - domiciliaciones) los efectos se agregan, pero al ordenar la remesa sale «cefectos_upd: [FVN026-000002] Requiere la domiciliación bancaria del tercero!». |
[/TABLA]
[TABLA]
| [IMG:carteras-050.jpg] |
| Figura 49   Error al ordenar una remesa de recibos domiciliados sin cuenta bancaria del cliente. |
[/TABLA]
[TABLA]
| ✓ | SOLUCIÓN / Un recibo domiciliado se carga en la cuenta del cliente, así que hace falta su IBAN en la pestaña «Datos bancarios» del tercero y la domiciliación en la factura (la introduce la persona responsable, no se escribe en este manual). Para el ejercicio se desagregan los efectos («Desagregar efectos») y se usa el tipo CSCTS, que no la exige. |
[/TABLA]
[TABLA]
| ! | PROBLEMA / Si se intenta cambiar el tipo de una remesa ya creada sale «cremesas_upd: No se permite cambiar el tipo de la remesa». SOLUCIÓN: crea una remesa nueva con el tipo correcto (la RM026-000001 se queda vacía). |
[/TABLA]
[TABLA]
| [IMG:carteras-051.jpg] |
| Figura 50   El tipo de la remesa no se puede cambiar una vez guardada. |
[/TABLA]
[TABLA]
| i | A TENER EN CUENTA / En la base TUTORIAL la plantilla contable de la confirmación lleva la contrapartida a la 23000.00000; en una base bien parametrizada será la cuenta del cliente o de efectos en gestión de cobro (430 / 431). |
[/TABLA]
[TABLA]
| i | A TENER EN CUENTA / «Copiar» en una factura de venta abre un diálogo con «Facturas» y «Cadencia mensual»: crea tantas facturas provisionales como se indique, una por mes. Abre una pestaña nueva con el resultado, así que puede parecer que no ha hecho nada: compruébalo en la lista de facturas. |
[/TABLA]
[TABLA]
| [IMG:carteras-052.jpg] |
| Figura 51   Lista de facturas de venta de TCA: las dos contabilizadas y las dos copias provisionales creadas con «Copiar». |
[/TABLA]
[TABLA]
| Δ | CAMBIO / El antiguo «cobro remesa a apuntes» es ahora la secuencia de «Evolucionar estado» de la remesa (proponer › ordenar › confirmar). «Retroceder» deshace el último paso. Los efectos ya no se añaden con un botón «Agregar efectos» fijo, sino desde la pestaña «Selección de efectos». |
[/TABLA]
[TABLA]
| ✓   QUÉ HAS CONSEGUIDO |
| ✓	Artículo financiero CA1 (servicio, 200,00) y tercero TCA como cliente (CLI 43000, cobro RC / PE / 30D). / ✓	Factura de venta FVN026-000001 (242,00) cobrada de forma individual con la gestión 0-5 (COBD): efecto en CO y asiento CA026-000001. / ✓	Banco BBVA_CA con línea financiera CA1 y remesas por cuenta CSCTS y CSDDS. / ✓	Factura FVN026-000002 (2 × 121,00) cobrada con la remesa RM026-000002 (CSCTS): efectos PE › PR › OC › CO y asiento del banco. Compruébalo en la cartera de efectos: los tres efectos de TCA están en CO. |
[/TABLA]