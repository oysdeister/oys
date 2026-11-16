[IMG:maestros-001.png]
DEISTER MANAGER  ·  MANUAL DE FORMACIÓN
SESIÓN 2
Maestros básicos
[TABLA]
|  |
[/TABLA]
Ejercicios documentados en la versión nueva del ERP
CONTENIDO
—	Antes de empezar
01	Mantenimiento de datos básicos de Contabilidad (ICON)
02	Mantenimiento de datos básicos de Gestión (IGES)
03	Consultas e informes de stock
# Índice
Cómo usar este manual	3
Antes de empezar	5
Qué son los datos básicos	5
Cómo moverse por la versión nueva	6
Ejercicio 1. Mantenimiento de datos básicos de Contabilidad (ICON)	7
1.1. Terceros (ctercero)	7
1.2. Artículos financieros (carticul)	11
1.3. Cambios de divisas (ccambios)	13
1.4. Formas de pago: plazos de pago (ctipopag)	15
1.5. Tipos de efectos (ctipoefe)	17
1.6. Cuentas contables y perfil contable del tercero (ccuentas / ctertipo)	20
1.7. Cuentas financieras: bancos y cajas (cbancpro)	25
1.8. Municipios y códigos postales (ctiponac / cmunicip)	28
Ejercicio 2. Mantenimiento de datos básicos de Gestión (IGES)	32
2.1. El tercero en Gestión: cliente (gcliente) y condiciones de cobro	32
2.2. Artículos logísticos (garticul)	34
2.3. Artículos por proveedor (gartprov)	37
2.4. Almacenes logísticos (galmacen)	39
2.5. Cuentas logísticas (galmctas)	42
Ejercicio 3. Consultas e informes de stock	45
3.1. Movimientos de almacén de usuario (geanmovh)	45
3.2. Stock global (galmstkg)	50
3.3. Traza de movimientos por artículo, kardex (garticul_evolstk)	51
# Cómo usar este manual
Este documento rehace la sesión «Mantenimiento de Datos Básicos» sobre la versión nueva del ERP (Deister Manager, base BBDD TUTORIAL en nextdemo.geasa.eu). El manual antiguo era un índice de pantallas con enlaces a vídeos, agrupadas en tres bloques: maestros de Contabilidad (ICON), maestros de Gestión (IGES) y consultas. Aquí cada pantalla se ha hecho de verdad: se da de alta un registro propio, se explica para qué sirve, dónde está en el menú, qué significa cada campo y qué pasos seguir.
Todos los datos creados llevan el prefijo MB (tercero MB1, artículo financiero MB, cuenta 43000.00901, artículo MB0001, almacén MB1…). Sustitúyelo por tus iniciales. En las tablas de campos, la columna «Oblig.» indica si la pantalla marca el campo con asterisco rojo. Los recuadros CAMBIO señalan lo que funciona distinto que en la versión antigua; PROBLEMA y SOLUCIÓN, los errores reales que salieron y cómo se resolvieron.
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
## Qué son los datos básicos
[TABLA]
| ? | ¿PARA QUÉ SIRVE? / Los datos básicos (maestros) son las fichas que usan después todos los documentos: el tercero con su cuenta contable y su forma de pago, los artículos, los almacenes, las cuentas bancarias o de caja, los cambios de divisa… Si un maestro está mal, el error se arrastra a cada pedido, factura o asiento. Por eso se dan de alta una vez, con cuidado, y se validan. |
[/TABLA]
Equivalencias entre el manual antiguo y la versión nueva:
[TABLA]
| CAMPO | QUÉ SIGNIFICA | VALOR DE EJEMPLO |
| ctercero (ICON) | Registro de terceros, con sus pestañas Relaciones, Direcciones, Condiciones de cobro… | Finanzas › Maestros › Terceros › Registro terceros |
| carticul | Artículos financieros (los que se usan en facturas sin stock). | Finanzas › Facturación › Maestros › Artículos |
| ccambios | Cambios diarios de divisa. | Finanzas › Maestros › Auxiliares › Monedas › Cambios diarios |
| ctipopag | Ahora se llama «Plazos de pago». La forma de pago completa (efecto + plazo) se asigna en el tercero. | Finanzas › Maestros › Terceros › Condiciones administrativas › Plazos de pago |
| ctipoefe | Tipos de efectos de cartera. | Finanzas › Cobros y Pagos › Maestros › Efectos › Tipos |
| ccuentas / ctertipo | Cuentas contables y «Perfil contable» (relaciones contables con terceros). | Finanzas › Maestros › Cuentas contables / Terceros › Perfil contable |
| cbancpro | «Bancos propios»: cuentas financieras de bancos y cajas. | Finanzas › Cobros y Pagos › Maestros › Auxiliares › Bancos propios |
| ctiponac (municipio / CP) | Países y, dentro de cada país, Municipios y poblaciones (códigos postales). | Finanzas › Maestros › Terceros › Localización |
| ctercero (IGES) | El tercero como cliente o proveedor de gestión: Maestro de clientes / Maestro de proveedores. | Gestión › Maestros › Terceros › Clientes / Proveedores |
| garticul / gartprov | Artículos logísticos y artículos por proveedor. | Gestión › Maestros › Artículos |
| galmacen / galmctas | Almacenes logísticos y cuentas logísticas. | Gestión › Logística › Maestros |
| galmstkg / garticul_evolstk | Stock global y Traza de movimientos por artículo (kardex). | Gestión › Logística › Stocks |
| Detalle de movimientos de almacén de usuario | Movimientos internos (cabecera y líneas). | Gestión › Logística › Movimientos internos › Movimientos |
[/TABLA]
## Cómo moverse por la versión nueva
•	Se entra por el menú lateral (icono de la esquina superior izquierda) o con el buscador «Buscar» (Cmd/Ctrl + K).
•	Cada pantalla abre en modo lista, en ficha o en modo consulta (QBE: un formulario de filtros con el botón «Ejecutar consulta»).
•	Para crear un registro: botón rojo «Añadir …» o «Nuevo» arriba a la derecha. Se rellena una ventana y se pulsa «Guardar».
•	Los campos con lista se rellenan escribiendo el código y eligiendo la fila; si no se despliega, pulsa flecha abajo.
•	Las fichas tienen pestañas (Relaciones, Direcciones, Líneas…) y los botones de acción (Validar, Cerrar…) en la barra superior.
[TABLA]
| Δ | CAMBIO / Los campos obligatorios llevan asterisco rojo. Si falta alguno, al guardar sale «Hay errores en los datos del formulario» y el campo se marca en rojo con «Este campo es obligatorio». |
[/TABLA]
[TABLA]
| i | A TENER EN CUENTA / Las listas largas muestran solo la primera página (unas 25 filas). Si un registro nuevo no aparece, no es que no se haya guardado: usa «Filtros» (por ejemplo, Descripción = RODAMIENTO*) para encontrarlo. |
[/TABLA]
# EJERCICIO 1
Mantenimiento de datos básicos de Contabilidad (ICON)
Se da de alta el circuito contable de un tercero: el tercero, su cuenta contable propia y su relación contable, su forma de cobro (tipo de efecto + plazo), un artículo financiero, un cambio de divisa, una caja y un código postal.
## 1.1. Terceros (ctercero)
[TABLA]
| ? | ¿PARA QUÉ SIRVE? / El tercero es la ficha única de cualquier persona o empresa con la que se trabaja: cliente, proveedor, acreedor, banco… Guarda los datos fiscales (NIF, país), las direcciones y la relación contable (qué cuenta 430/400 usa). Después, en Gestión, el mismo tercero se da de alta como cliente o proveedor. Mientras está «Provisional» no se puede usar en documentos. |
[/TABLA]
MENÚ    Finanzas   ›   Maestros   ›   Terceros   ›   Registro terceros (objeto ctercero)
[TABLA]
| CAMPO | QUÉ SIGNIFICA | VALOR DE EJEMPLO |
| Tercero | Código del tercero. | MB1 |
| Nombre * | Razón social. | Tercero Maestros MB |
| Nombre comercial | Nombre con el que se le conoce; se propone en las direcciones. | Maestros MB |
| País emisor * | País del documento fiscal. | ES España |
| Tipo ID fiscal * | Clase de identificación: NIF-Empresa, NIF-Persona, pasaporte, NIF operador UE… | NIF-Empresa |
| Id. fiscal * | NIF/CIF. Se valida el formato. | B12345674 (de prueba) |
| Estado / Estado cobros / Estado pagos * | Provisional hasta validar; cobros y pagos abiertos. | Provisional / Abierto / Abierto |
| Categoría * | Tipo de tercero. Propone la relación contable (CLI) y la cuenta (43000). | 001 Clientes |
| Clave fiscal tercero * | Régimen de IVA. | RGEN Régimen general |
| Prioridad de pago / Idioma / Empresas / Compensación * | Se proponen por defecto. | 0 / es / ALL / No |
[/TABLA]
*  Campo obligatorio: sin él no deja guardar.
1 	Abre la ruta y pulsa «Añadir tercero».
2 	Rellena Tercero, Nombre, Nombre comercial, País ES, Tipo ID fiscal NIF-Empresa e Id. fiscal.
3 	En Más datos elige la Categoría 001 Clientes (escribe 001 y elige la fila).
4 	Pulsa «Guardar». Abre la ficha (enlace «Ver registro» o el número de fila).
5 	Pestaña Relaciones › «Añadir relación»: tipo Cliente, relación CLI, plan ES y cuenta. Guarda.
6 	Pestaña Direcciones › «Añadir dirección»: código postal 08001 (rellena provincia y población) y la dirección. Guarda.
7 	Pulsa «Validar»: el estado pasa a Validado.
[TABLA]
| [IMG:maestros-002.jpg] |
| Figura 1   Alta del tercero MB1: los obligatorios son País emisor, Nombre, Tipo ID fiscal, Id. fiscal y Categoría. |
[/TABLA]
[TABLA]
| [IMG:maestros-003.jpg] |
| Figura 2   Ficha guardada: pestañas Relaciones, Datos bancarios, Condiciones de pago/cobro, Direcciones… y botón «Validar». |
[/TABLA]
[TABLA]
| [IMG:maestros-004.jpg] |
| Figura 3   Relación contable: tipo Cliente, relación CLI, plan PGE 2008 (ES) y cuenta. Plan contable es obligatorio. |
[/TABLA]
[TABLA]
| [IMG:maestros-005.jpg] |
| Figura 4   Dirección 0 «domicilio fiscal»: al elegir el CP 08001 se rellenan solos la provincia 08 y la población. |
[/TABLA]
[TABLA]
| [IMG:maestros-006.jpg] |
| Figura 5   Tercero validado: el estado cambia a «Validado» y aparecen los botones Cerrar y Activar. |
[/TABLA]
[TABLA]
| Δ | CAMBIO / La relación contable y las direcciones ya no son pantallas aparte: son pestañas de la ficha del tercero. |
[/TABLA]
[TABLA]
| ! | PROBLEMA / En la fila editable de la pestaña Relaciones no se ve el Plan contable y al guardarlo se queda en rojo. SOLUCIÓN: usa el botón «Añadir relación», que abre la ventana con todos los campos. |
[/TABLA]
[TABLA]
| i | A TENER EN CUENTA / Cualquier cambio posterior en las pestañas del tercero (relaciones, condiciones de cobro…) lo devuelve a «Provisional». Hay que volver a pulsar «Validar» (ver 1.6). |
[/TABLA]
## 1.2. Artículos financieros (carticul)
[TABLA]
| ? | ¿PARA QUÉ SIRVE? / El artículo financiero es el concepto que se usa en las facturas que no mueven stock (servicios, alquileres, suplidos). Lleva el tipo fiscal y las cuentas de compras y ventas: al contabilizar la factura, el importe va a esas cuentas. |
[/TABLA]
MENÚ    Finanzas   ›   Facturación   ›   Maestros   ›   Artículos (objeto carticul)
[TABLA]
| CAMPO | QUÉ SIGNIFICA | VALOR DE EJEMPLO |
| Artículo * | Código. | MB |
| Descripción artículo * | Texto que sale en la factura. | Servicios de formacion MB |
| Unidad medida / Estado * | Se proponen. | UN / Abierto |
| Tipo fiscal * | Naturaleza para el IVA: Bien, Servicio, Inversión, Alquiler, Suplido… | Servicio |
| Clave fiscal artículo * | Tipo de IVA que se aplica. | SOG Servicios a tipo general |
| Precio / Tipo descripción * | Si el precio y la descripción son fijos o variables en la factura. | Variable / Variable |
| Mnemotécnico de compras | Cuenta de gasto al comprar. | 62300 Servicios de profesionales independientes |
| Mnemotécnico de ventas | Cuenta de ingreso al vender. | 70500 Prestaciones de servicios |
| % Descuento compras / ventas * | Descuento por defecto. | 0,00 |
| Datos contables * | Qué datos contables se pueden cambiar en la línea de factura. | Todo |
[/TABLA]
*  Campo obligatorio: sin él no deja guardar.
1 	Abre la ruta y pulsa «Añadir artículo».
2 	Rellena código, descripción, Tipo fiscal Servicio y Clave fiscal SOG.
3 	Elige los mnemotécnicos 62300 (compras) y 70500 (ventas).
4 	Pulsa «Guardar».
[TABLA]
| [IMG:maestros-007.jpg] |
| Figura 6   Artículos financieros existentes (Alquiler, Bienes, Inversión, Servicios, Suplido) y su ruta en el menú lateral. |
[/TABLA]
[TABLA]
| [IMG:maestros-008.jpg] |
| Figura 7   Alta del artículo MB: Servicio, SOG, cuentas 62300 / 70500 y datos contables «Todo». |
[/TABLA]
[TABLA]
| [IMG:maestros-009.jpg] |
| Figura 8   El artículo MB aparece en la lista con sus mnemotécnicos. |
[/TABLA]
[TABLA]
| Δ | CAMBIO / Las cuentas se eligen por «mnemotécnico» (cuenta de 5 dígitos) en lugar de la cuenta completa. |
[/TABLA]
## 1.3. Cambios de divisas (ccambios)
[TABLA]
| ? | ¿PARA QUÉ SIRVE? / Cuando se compra o vende en otra moneda, el ERP convierte los importes a euros con el cambio del día. Si no hay cambio para esa fecha y divisa, el documento no se puede contabilizar. El cambio se introduce a mano o se importa. |
[/TABLA]
MENÚ    Finanzas   ›   Maestros   ›   Auxiliares   ›   Monedas   ›   Cambios diarios (objeto ccambios)
[TABLA]
| CAMPO | QUÉ SIGNIFICA | VALOR DE EJEMPLO |
| Fecha * | Día del cambio. | 12-11-2026 |
| Base * | Unidades de la moneda origen. | 1,000000 |
| Moneda origen * | Divisa que se convierte. | USD US Dollar |
| Cambio spot * | Equivalencia en la divisa destino. | 0,920000 |
| Divisa * | Divisa destino (la de la empresa). | EUR |
| Compra | Cambio de compra, si se distingue. | 0,910000 |
[/TABLA]
*  Campo obligatorio: sin él no deja guardar.
1 	Abre la ruta y pulsa «Añadir cambio divisa».
2 	Elige la moneda USD y escribe el cambio spot y el de compra.
3 	Pulsa «Guardar».
[TABLA]
| [IMG:maestros-010.jpg] |
| Figura 9   Cambio USD › EUR del 12-11-2026: 1 USD = 0,92 EUR (compra 0,91). |
[/TABLA]
[TABLA]
| [IMG:maestros-011.jpg] |
| Figura 10   El cambio queda en la lista con usuario y fecha de creación. |
[/TABLA]
## 1.4. Formas de pago: plazos de pago (ctipopag)
[TABLA]
| ? | ¿PARA QUÉ SIRVE? / El plazo de pago dice en cuántos vencimientos se divide una factura y a cuántos días o meses vence cada uno. Al contabilizar la factura, el ERP crea un efecto en la cartera por cada vencimiento. |
[/TABLA]
MENÚ    Finanzas   ›   Maestros   ›   Terceros   ›   Condiciones administrativas   ›   Plazos de pago (objeto ctipopag)
[TABLA]
| CAMPO | QUÉ SIGNIFICA | VALOR DE EJEMPLO |
| Plazo pago * | Código. | MB1 |
| Descripción plazo * | Texto descriptivo. | 2 Vtos. 30 y 60 dias MB |
| Unidad tiempo | Si los plazos se cuentan en días o meses. | Días |
| Tipo cálculo * | Fija (algoritmo de nº de plazos y cadencia), Variable (días de cada columna) o No generar (contado). | Variable |
| Primer / Segundo plazo * | Días hasta cada vencimiento. | 30 / 60 |
| % Plazo 1 / % Plazo 2 * | Porcentaje del total en cada vencimiento. | 50 / 50 |
| Tercer / Cuarto plazo y sus % * | Obligatorios aunque no se usen. | 0 |
[/TABLA]
*  Campo obligatorio: sin él no deja guardar.
1 	Abre la ruta y pulsa «Añadir plazo».
2 	Escribe código y descripción, elige Tipo cálculo «Variable» y Unidad tiempo «Días».
3 	Rellena 30 días / 50 % y 60 días / 50 %, y pon 0 en los plazos 3 y 4.
4 	Pulsa «Guardar».
[TABLA]
| [IMG:maestros-012.jpg] |
| Figura 11   Plazo MB1: cálculo Variable en días, 50 % a 30 días y 50 % a 60 días. |
[/TABLA]
[TABLA]
| ! | PROBLEMA / Al guardar con solo dos vencimientos sale «Hay errores en los datos del formulario»: Tercer plazo, Cuarto plazo y sus porcentajes son obligatorios. |
[/TABLA]
[TABLA]
| [IMG:maestros-013.jpg] |
| Figura 12   Error al guardar: los plazos 3 y 4 vacíos se marcan «Este campo es obligatorio». |
[/TABLA]
[TABLA]
| ✓ | SOLUCIÓN / Escribe 0 en los plazos y porcentajes que no se usan. |
[/TABLA]
[TABLA]
| [IMG:maestros-014.jpg] |
| Figura 13   El plazo MB1 en la lista de plazos de pago. |
[/TABLA]
[TABLA]
| Δ | CAMBIO / «Formas de pago» se llama ahora «Plazos de pago» y solo guarda los vencimientos. El tipo de efecto (recibo, transferencia…) se combina con el plazo en la pestaña «Condiciones de cobro/pago» del tercero (ver 1.6). |
[/TABLA]
## 1.5. Tipos de efectos (ctipoefe)
[TABLA]
| ? | ¿PARA QUÉ SIRVE? / El tipo de efecto es el medio de cobro o pago de cada vencimiento: recibo domiciliado, transferencia, pagaré, confirming… Decide si hace falta la cuenta bancaria del tercero, con qué fecha entra en la previsión de tesorería y si cuenta para el riesgo del cliente. |
[/TABLA]
MENÚ    Finanzas   ›   Cobros y Pagos   ›   Maestros   ›   Efectos   ›   Tipos (objeto ctipoefe)
[TABLA]
| CAMPO | QUÉ SIGNIFICA | VALOR DE EJEMPLO |
| Clase * | Cartera de cobros o de pagos. | Cobrar |
| Tipo efecto * | Código (2 caracteres). | MB |
| Descripción * | Nombre. | Recibo domiciliado MB |
| Estado inicial | Estado con el que nace el efecto. | PE Pendiente |
| Domiciliación bancaria * | No requiere / Tercero (pide la cuenta del cliente) / Empresa. | Tercero |
| Días decalaje * | Días que se suman a la fecha prevista de operación. | 2 |
| Días post-pago * | Días tras el vencimiento hasta liberar el riesgo. | 4 |
| Interés / Riesgo / Factura demora * | Interés de demora, control de riesgo y refacturación de intereses. | 0 / Sí / No |
| Fecha operación * | Fecha que usa la tesorería: emisión, vencimiento, ponderada… | Vencimiento |
| UN/EDIFACT y Código fiscal * | Códigos estándar del medio de pago para facturae y Hacienda. | Domiciliación bancaria |
[/TABLA]
*  Campo obligatorio: sin él no deja guardar.
1 	Abre la ruta y pulsa «Añadir tipo efecto».
2 	Clase Cobrar, código MB, descripción y estado inicial PE.
3 	Domiciliación «Tercero», días decalaje 2 y post-pago 4.
4 	En Tesorería elige Fecha operación «Vencimiento» y en Clasificación el código fiscal «Domiciliación bancaria».
5 	Pulsa «Guardar».
[TABLA]
| [IMG:maestros-015.jpg] |
| Figura 14   Tipos de efectos de la base: clase, estado inicial, días, riesgo, domiciliación y fecha de operación. |
[/TABLA]
[TABLA]
| [IMG:maestros-016.jpg] |
| Figura 15   Alta del tipo MB: domiciliación en la cuenta del tercero, decalaje 2 días, post-pago 4 y riesgo. |
[/TABLA]
[TABLA]
| [IMG:maestros-017.jpg] |
| Figura 16   Bloques Tesorería y Clasificación: fecha de operación Vencimiento y código fiscal Domiciliación bancaria. |
[/TABLA]
[TABLA]
| [IMG:maestros-018.jpg] |
| Figura 17   El tipo MB «Recibo domiciliado MB» en la lista. |
[/TABLA]
## 1.6. Cuentas contables y perfil contable del tercero (ccuentas / ctertipo)
[TABLA]
| ? | ¿PARA QUÉ SIRVE? / Cada cliente debería tener su subcuenta 430 propia para ver su saldo en el mayor. Se crea la cuenta en el plan contable y luego se asigna al tercero en su perfil contable (relación CLI). Las facturas del cliente se contabilizarán en esa subcuenta. |
[/TABLA]
MENÚ    Finanzas   ›   Maestros   ›   Cuentas contables   ›   Cuentas contables (objeto ccuentas)
[TABLA]
| CAMPO | QUÉ SIGNIFICA | VALOR DE EJEMPLO |
| Plan contable * | Plan de cuentas. | PGE 2008 (ES) |
| Cuenta * | Subcuenta completa (5 + 5 dígitos). | 43000.00901 |
| Descripción cuenta * | Nombre. | Tercero Maestros MB |
| Posición / Estado / Grupo * | Saldo natural, estado y grupo de partes vinculadas. | Debe / Abierto / Standard |
| Tipo * | Normal, Terceros, Entidades financieras, Costes, Analítica. | Terceros |
| Activa | Auxiliares que activa la cuenta (I impuestos, E efectos/cartera, V…). | IEV |
| Activar | Posición en la que se activan los procesos. | Ambos |
| Días máximos / Periodificable * | Inactividad máxima y periodificación. | 999 / No |
[/TABLA]
*  Campo obligatorio: sin él no deja guardar.
1 	Abre la ruta: sale en modo consulta. Escribe 43000* en Cuenta y pulsa «Ejecutar consulta» para ver las 430 existentes.
2 	Pulsa «Añadir cuenta», rellena plan, cuenta 43000.00901, descripción, tipo Terceros, Activa IEV y Activar Ambos. Guarda.
3 	Abre Finanzas › Maestros › Terceros › Perfil contable (ctertipo) y la relación CLI de MB1.
4 	Cambia la Cuenta a 43000.00901 (borra y reescribe el último dígito para que salga la lista) y guarda con el disquete.
5 	Vuelve a la ficha del tercero MB1 y pulsa «Validar», porque ha vuelto a Provisional.
[TABLA]
| [IMG:maestros-019.jpg] |
| Figura 18   Cuentas contables abre en modo consulta: filtro Cuenta = 43000*. |
[/TABLA]
[TABLA]
| [IMG:maestros-020.jpg] |
| Figura 19   Cuentas 430 existentes, todas de tipo Terceros con Activa IEV. |
[/TABLA]
[TABLA]
| [IMG:maestros-021.jpg] |
| Figura 20   Alta de la subcuenta 43000.00901 «Tercero Maestros MB» de tipo Terceros. |
[/TABLA]
[TABLA]
| [IMG:maestros-022.jpg] |
| Figura 21   La nueva cuenta en la lista. |
[/TABLA]
[TABLA]
| Δ | CAMBIO / «ctertipo» se presenta como «Relaciones contables con terceros» o «Perfil contable»: una fila por tercero, tipo y relación. |
[/TABLA]
[TABLA]
| i | A TENER EN CUENTA / Al abrir la relación de MB1 con 43000.00000 sale el aviso «Cuenta contable en operación. Esta cuenta ya está asociada a otro tercero.» Es la señal de que conviene darle una subcuenta propia. |
[/TABLA]
[TABLA]
| [IMG:maestros-023.jpg] |
| Figura 22   Perfil contable de MB1 con la cuenta genérica 43000.00000 y el aviso de cuenta compartida. |
[/TABLA]
[TABLA]
| [IMG:maestros-024.jpg] |
| Figura 23   Tras el cambio, la relación CLI de MB1 apunta a 43000.00901 y el aviso desaparece. |
[/TABLA]
[TABLA]
| ! | PROBLEMA / Después de cambiar la relación contable, el tercero MB1 vuelve a estado «Provisional» y no se podría usar en documentos. |
[/TABLA]
[TABLA]
| [IMG:maestros-025.jpg] |
| Figura 24   El tercero MB1 de nuevo en Provisional, con el botón «Validar» activo. |
[/TABLA]
[TABLA]
| ✓ | SOLUCIÓN / Abre la ficha del tercero y pulsa «Validar». Pasa lo mismo con cualquier cambio en sus pestañas. |
[/TABLA]
## 1.7. Cuentas financieras: bancos y cajas (cbancpro)
[TABLA]
| ? | ¿PARA QUÉ SIRVE? / Las cuentas financieras («Bancos propios») son los bancos y cajas de la empresa: por ellas pasan los cobros y pagos, se remesan los recibos y se concilian los extractos. Cada una tiene su cuenta contable 572 (banco) o 570 (caja). Aquí se da de alta una caja, que no necesita datos bancarios. |
[/TABLA]
MENÚ    Finanzas   ›   Cobros y Pagos   ›   Maestros   ›   Auxiliares   ›   Bancos propios (objeto cbancpro; también en Tesorería   ›   Maestros)
[TABLA]
| CAMPO | QUÉ SIGNIFICA | VALOR DE EJEMPLO |
| Empresa / Proyecto / Sección * | Unidad a la que pertenece la cuenta. | 0 Deister Software / 0 GENERAL / 0 |
| Cuenta financiera * | Código (máx. 10). | MBCAJA |
| Desc. cuenta financiera * | Nombre. | Caja Maestros MB |
| Moneda / Estado * | Divisa y estado. | EUR / Abierto |
| Tipo de cuenta * | Cuenta corriente, ahorro, crédito, factoring, caja de efectivo… | Caja de efectivo |
| Banco, IBAN, BIC | Solo para bancos. En una caja se dejan vacíos. | (vacío) |
| Entidad financiera / Tipo de dirección * | Tercero titular y su dirección. En una caja, la propia empresa. | 0 / 0 |
| Cuenta * | Cuenta contable donde se apuntan los movimientos. | 57000.00000 Caja, euros |
| Preferencia / Fecha apertura / Formato extracto * | Se proponen. | Sí / hoy / AEB43 |
| Agrupación cuentas * | Grupo de tesorería al que pertenece (maestro de agrupaciones). | MB Cajas Maestros MB |
[/TABLA]
*  Campo obligatorio: sin él no deja guardar.
1 	Abre la ruta y pulsa «Añadir bancos propios».
2 	Elige empresa 0, proyecto 0, sección 0; código MBCAJA y descripción.
3 	Tipo de cuenta «Caja de efectivo» (escribe «caja» en el buscador del desplegable).
4 	Entidad financiera 0 y Tipo de dirección 0; Cuenta 57000.00000.
5 	Agrupación cuentas MB (antes hay que crearla, ver el problema). Pulsa «Guardar».
[TABLA]
| ! | PROBLEMA / «Agrupación cuentas» es obligatoria y la lista sale vacía («Datos no disponibles»). Si se escribe a mano CA, la que tienen las cuentas existentes, sale «Error en la validación». |
[/TABLA]
[TABLA]
| [IMG:maestros-026.jpg] |
| Figura 25   La lista de Agrupación cuentas sale vacía aunque el campo es obligatorio. |
[/TABLA]
[TABLA]
| [IMG:maestros-027.jpg] |
| Figura 26   Causa: el maestro «Grupos de cuentas, flujos y operaciones financieras» (tagrupac) está vacío en TUTORIAL. |
[/TABLA]
[TABLA]
| ✓ | SOLUCIÓN / Crea antes una agrupación en Finanzas › Tesorería › Maestros › Agrupaciones (tagrupac): Tipo «Cuenta», grupo tesorería MB, descripción «Cajas Maestros MB». Después ya se puede elegir en la cuenta financiera. |
[/TABLA]
[TABLA]
| [IMG:maestros-028.jpg] |
| Figura 27   Alta de la agrupación de tipo Cuenta MB «Cajas Maestros MB». |
[/TABLA]
[TABLA]
| [IMG:maestros-029.jpg] |
| Figura 28   Caja MBCAJA: entidad 0, cuenta 57000.00000, formato AEB43 y agrupación MB. |
[/TABLA]
[TABLA]
| i | A TENER EN CUENTA / «Descripción banco» no se escribe: se rellena al elegir el Banco. Para una caja se deja vacía. No introduzcas nunca IBAN reales en la base de formación. |
[/TABLA]
[TABLA]
| Δ | CAMBIO / Bancos y cajas comparten pantalla; lo que los distingue es el «Tipo de cuenta». |
[/TABLA]
## 1.8. Municipios y códigos postales (ctiponac / cmunicip)
[TABLA]
| ? | ¿PARA QUÉ SIRVE? / El código postal rellena solo la provincia y la población en las direcciones de terceros, almacenes y empresas, y asegura que se escriban igual. España viene cargada; se da de alta un CP nuevo cuando falta (urbanizaciones, CP recientes, otros países). |
[/TABLA]
MENÚ    Finanzas   ›   Maestros   ›   Terceros   ›   Localización   ›   Países (ctiponac)   ›   pestaña Municipios y poblaciones
[TABLA]
| CAMPO | QUÉ SIGNIFICA | VALOR DE EJEMPLO |
| País * | Se toma del país abierto. | ESP España |
| Región / Distrito | Opcionales. | (vacío) |
| Provincia * | Provincia del municipio. | 08 Barcelona |
| Población * | Nombre del municipio o población. | Poblacion Maestros MB |
| Código Postal * | CP. | 08MB1 (de prueba) |
| Id. municipio | Lo asigna el sistema. | 56557 |
[/TABLA]
*  Campo obligatorio: sin él no deja guardar.
1 	Abre Países: sale en modo consulta. Filtra País = Espa* y ejecuta: se abre la ficha de España.
2 	Abre la pestaña «Municipios y poblaciones» y pulsa «Añadir municipio».
3 	Elige provincia 08, escribe la población y el código postal. Pulsa «Guardar».
4 	Compruébalo en Localización › Municipios y Poblaciones filtrando por el CP.
[TABLA]
| [IMG:maestros-030.jpg] |
| Figura 29   Ficha del país España: datos fiscales y SEPA, y pestañas Regiones, Provincias, Distritos y Municipios y poblaciones. |
[/TABLA]
[TABLA]
| [IMG:maestros-031.jpg] |
| Figura 30   Alta del municipio desde el país: provincia 08, población y CP. |
[/TABLA]
[TABLA]
| [IMG:maestros-032.jpg] |
| Figura 31   Municipio [08MB1] guardado, con Id. municipio asignado automáticamente. |
[/TABLA]
[TABLA]
| ! | PROBLEMA / Si se abre directamente «Municipios y Poblaciones» (cmunicip) no hay botón de alta, y en el desplegable de CP de una dirección tampoco aparece el «+» para crear uno. |
[/TABLA]
[TABLA]
| [IMG:maestros-033.jpg] |
| Figura 32   Municipios y poblaciones (cmunicip) en modo lista: sirve para consultar, pero no tiene botón «Añadir». |
[/TABLA]
[TABLA]
| ✓ | SOLUCIÓN / El alta se hace desde la ficha del país, pestaña «Municipios y poblaciones», botón «Añadir municipio». Después el CP ya se puede elegir en cualquier dirección (como el 08001 del apartado 1.1). |
[/TABLA]
[TABLA]
| ✓   QUÉ HAS CONSEGUIDO |
| ✓	Tercero MB1 validado, con dirección (CP 08001), relación CLI a su subcuenta 43000.00901 y condición de cobro MB + MB1. / ✓	Artículo financiero MB (Servicio, SOG, 62300/70500); cambio USD › EUR 0,92 del 12-11-2026. / ✓	Plazo de pago MB1 (30/60 días), tipo de efecto MB (recibo domiciliado), cuenta 43000.00901. / ✓	Caja MBCAJA en Bancos propios con la agrupación MB, y municipio 08MB1 «Poblacion Maestros MB». / CÓMO COMPROBARLO / →	La ficha de MB1 sale «Validado»; Perfil contable muestra CLI › 43000.00901 sin aviso; MBCAJA aparece en Bancos propios con cuenta 57000.00000. |
[/TABLA]
# EJERCICIO 2
Mantenimiento de datos básicos de Gestión (IGES)
Se completa la parte logística: el tercero como cliente, un artículo con stock, su proveedor, un almacén y una cuenta logística.
## 2.1. El tercero en Gestión: cliente (gcliente) y condiciones de cobro
[TABLA]
| ? | ¿PARA QUÉ SIRVE? / Para vender, el tercero se da de alta como cliente en Gestión. La ficha de cliente guarda las condiciones comerciales (comercial, tipo, divisa, facturación). La forma de cobro se asigna en la ficha del tercero, pestaña «Condiciones de cobro», uniendo un tipo de efecto y un plazo: es lo que se propondrá en pedidos y facturas. |
[/TABLA]
MENÚ    Gestión   ›   Maestros   ›   Terceros   ›   Clientes   ›   Registro (objeto gcliente)
[TABLA]
| CAMPO | QUÉ SIGNIFICA | VALOR DE EJEMPLO |
| Cliente * | Tercero que se da de alta como cliente. | MB1 Tercero Maestros MB |
| Fecha alta / Estado * | Se proponen. | hoy / Provisional |
| Comercial * | Tercero responsable comercial. | MB1 |
| Agrupación empresas * | Empresas que pueden venderle. | ALL |
| Tipo cliente * | Clasificación. | 0 GENERAL |
| Facturación * | Tercero y dirección de facturación, agrupación de albaranes, modalidad y método. Se proponen. | MB1 / 0 / Mensual / 1 Albarán-1 Factura |
| Cobros * | Tercero y dirección de cobro. Se proponen. | MB1 / 0 |
| Divisa (Datos financieros) * | Moneda de facturación. | EUR |
[/TABLA]
*  Campo obligatorio: sin él no deja guardar.
1 	Abre la ruta y pulsa «Nuevo».
2 	Elige el cliente MB1, el comercial MB1 y el tipo 0 GENERAL.
3 	Revisa las pestañas Facturación y Cobros (vienen propuestas) e informa la Divisa EUR. Guarda.
4 	Abre la ficha del tercero MB1 › pestaña «Condiciones de cobro» › «Añadir cobro».
5 	Tipo efecto MB, estado PE y plazo de pago MB1. Guarda y vuelve a «Validar» el tercero.
[TABLA]
| [IMG:maestros-034.jpg] |
| Figura 33   Alta del cliente MB1: comercial, tipo GENERAL y pestaña Facturación con los valores propuestos. |
[/TABLA]
[TABLA]
| [IMG:maestros-035.jpg] |
| Figura 34   MB1 en el Maestro de clientes con divisa EUR. |
[/TABLA]
[TABLA]
| [IMG:maestros-036.jpg] |
| Figura 35   Condiciones de cobro de MB1: efecto MB, estado PE y plazo «2 Vtos. 30 y 60 dias MB». |
[/TABLA]
[TABLA]
| Δ | CAMBIO / El cliente y el proveedor ya no son pestañas del tercero; son pantallas propias (Maestro de clientes / de proveedores). |
[/TABLA]
## 2.2. Artículos logísticos (garticul)
[TABLA]
| ? | ¿PARA QUÉ SIRVE? / El artículo logístico es el producto que se compra, se almacena y se vende con control de stock. Su familia decide la clave fiscal, la naturaleza y la reposición; su unidad base es en la que se lleva el stock. |
[/TABLA]
MENÚ    Gestión   ›   Maestros   ›   Artículos   ›   Registro (objeto garticul)
[TABLA]
| CAMPO | QUÉ SIGNIFICA | VALOR DE EJEMPLO |
| Artículo * | Código. | MB0001 |
| Descripción artículo | Se guarda en mayúsculas. | RODAMIENTO MAESTROS MB |
| Unidad base * | Unidad de stock. | UNIDAD (UNI) |
| Agrupación empresas * | Empresas que lo usan. | ALL |
| Tipo * | Clasificación del artículo. | ARTICULOS |
| Familia * | Agrupación comercial; propone clave fiscal y naturaleza. | 01.01.001352 Serie 6.0xx… |
| Clave fiscal / Naturaleza * | IVA y tipo de bien. Se heredan de la familia. | BOG / Bien |
| Stock / Diferencias albaranes / Tipo descripción * | Se proponen. | Sí / No / Fija |
[/TABLA]
*  Campo obligatorio: sin él no deja guardar.
1 	Abre la ruta y pulsa «Nuevo».
2 	Escribe código y descripción; elige unidad UNIDAD y tipo ARTICULOS.
3 	En Familia escribe el código 01.01.001352 y sal con Tab (ver el problema).
4 	Comprueba que se han rellenado clave fiscal BOG y naturaleza Bien. Guarda.
5 	Busca el artículo con Filtros, abre la ficha y pulsa «Validar».
[TABLA]
| [IMG:maestros-037.jpg] |
| Figura 36   Maestro de artículos: unidad base, familia, tipo contable y tipo de cada artículo. |
[/TABLA]
[TABLA]
| [IMG:maestros-038.jpg] |
| Figura 37   Alta de MB0001: la familia propone clave fiscal BOG y naturaleza Bien. |
[/TABLA]
[TABLA]
| ! | PROBLEMA / El desplegable de Familia no muestra ninguna opción al escribir ni al pulsar flecha abajo. |
[/TABLA]
[TABLA]
| ✓ | SOLUCIÓN / Teclea el código exacto de la familia y sal con Tab. Los códigos se consultan en Gestión › Maestros › Artículos › Auxiliares › Familias (gartfami). |
[/TABLA]
[TABLA]
| [IMG:maestros-039.jpg] |
| Figura 38   Tras guardar, MB0001 no sale en la primera página de la lista: se encuentra con Filtros › Descripción. |
[/TABLA]
[TABLA]
| [IMG:maestros-040.jpg] |
| Figura 39   Ficha de MB0001 activa tras «Validar»; menú Operación con Copiar y Cambiar unidad base. |
[/TABLA]
## 2.3. Artículos por proveedor (gartprov)
[TABLA]
| ? | ¿PARA QUÉ SIRVE? / Relaciona un artículo con los proveedores que lo sirven: referencia y descripción del proveedor, prioridad y condiciones de compra. El proveedor «asignado» con mejor prioridad es el que se propone al generar pedidos de compra. |
[/TABLA]
MENÚ    Gestión   ›   Maestros   ›   Terceros   ›   Proveedores   ›   Registro   ›   pestaña Artículos por proveedor (consulta en Gestión   ›   Maestros   ›   Artículos   ›   Proveedores)
[TABLA]
| CAMPO | QUÉ SIGNIFICA | VALOR DE EJEMPLO |
| Artículo * | Artículo que sirve el proveedor. | MB0001 |
| Asignado / Prioridad * | Si es proveedor habitual y su orden. | Sí / 1 |
| Estado / % reparto * | Se proponen. | Activo / 0,00 |
| Referencia y Descripción proveedor | Cómo lo llama el proveedor; sale en el pedido de compra. | REF-MB-6000 |
| Proveedor / Dirección * | Proveedor (el de la ficha) y su dirección. | 00001 PROVEEDOR / 0 |
| Condiciones de compra * | Unidad de compra, cantidades mínima, económica y múltiplo. | (por defecto) |
[/TABLA]
*  Campo obligatorio: sin él no deja guardar.
1 	Abre el proveedor en Gestión › Maestros › Terceros › Proveedores › Registro (aquí, 00001 PROVEEDOR).
2 	Ve a la pestaña «Artículos por proveedor» y pulsa «Nuevo».
3 	Elige MB0001, marca Asignado, prioridad 1, referencia y descripción del proveedor, y dirección 0.
4 	Pulsa «Guardar».
[TABLA]
| [IMG:maestros-041.jpg] |
| Figura 40   Artículos por proveedores abierto directamente: solo consulta, sin botón de alta. |
[/TABLA]
[TABLA]
| [IMG:maestros-042.jpg] |
| Figura 41   Alta desde la ficha del proveedor: MB0001, asignado, prioridad 1 y referencia REF-MB-6000. |
[/TABLA]
[TABLA]
| [IMG:maestros-043.jpg] |
| Figura 42   La pestaña muestra ya dos artículos del proveedor, el nuevo con REF-MB-6000. |
[/TABLA]
[TABLA]
| Δ | CAMBIO / La pantalla gartprov abierta sola es de consulta. El alta se hace desde la ficha del proveedor. |
[/TABLA]
## 2.4. Almacenes logísticos (galmacen)
[TABLA]
| ? | ¿PARA QUÉ SIRVE? / El almacén es el lugar físico donde se guarda el stock. Define cómo se valora (FIFO, precio medio), si admite stock negativo y a qué delegación y departamento pertenece, datos que heredan los movimientos de stock. |
[/TABLA]
MENÚ    Gestión   ›   Logística   ›   Maestros   ›   Almacenes   ›   Almacenes logísticos (objeto galmacen)
[TABLA]
| CAMPO | QUÉ SIGNIFICA | VALOR DE EJEMPLO |
| Almacén / Descripción * | Código y nombre. | MB1 / Almacen Maestros MB |
| Recinto / Empresa / Agrupación * | Recinto físico, empresa y agrupación. | 0 RECINTO CENTRAL / 0 / ALL |
| Tercero asociado / Tipo dirección * | Dirección del almacén; rellena país, CP y población. | 0 / 0 |
| Delegación / Departamento | Unidad de negocio del almacén. No sale con asterisco, pero los movimientos la exigen. | 0 CENTRAL / C COMPRAS |
| Tipo valoración * | Cómo se calcula el coste del stock. | FIFO |
| Fecha última valoración * | Fecha desde la que se valora. | 01-01-2026 |
| Stock negativo / Rupturas stock * | Si se permite vender sin stock y qué hacer con las roturas. | No / Ninguno |
[/TABLA]
*  Campo obligatorio: sin él no deja guardar.
1 	Abre la ruta y pulsa «Nuevo».
2 	Rellena código, descripción, recinto, empresa y agrupación; tercero 0 y dirección 0.
3 	En Información general elige Delegación CENTRAL y Departamento COMPRAS.
4 	En Valoración deja FIFO y escribe la fecha de última valoración. Guarda y pulsa «Validar».
[TABLA]
| [IMG:maestros-044.jpg] |
| Figura 43   Almacenes existentes: tipo de valoración FIFO o Medio y política de rupturas de stock. |
[/TABLA]
[TABLA]
| [IMG:maestros-045.jpg] |
| Figura 44   Alta del almacén MB1: la dirección del tercero 0 rellena país, CP y población; valoración FIFO. |
[/TABLA]
[TABLA]
| [IMG:maestros-046.jpg] |
| Figura 45   Información general del almacén: delegación CENTRAL y departamento COMPRAS. |
[/TABLA]
[TABLA]
| i | A TENER EN CUENTA / Si el almacén no tiene delegación y departamento, al grabar un movimiento interno sale «Delegación y departamento no informados para el almacén» (ver 3.1). Rellénalos ya en el alta. |
[/TABLA]
## 2.5. Cuentas logísticas (galmctas)
[TABLA]
| ? | ¿PARA QUÉ SIRVE? / Dentro de un almacén el stock se reparte en cuentas logísticas: disponible (DISP), calidad (CALI), cuarentena, tránsito o fuera de inventario (NSAL). Cada movimiento pasa stock de una cuenta a otra; los indicadores dicen qué cuentas se valoran, contabilizan, reservan o planifican. |
[/TABLA]
MENÚ    Gestión   ›   Logística   ›   Maestros   ›   Cuentas logísticas   ›   Registro (objeto galmctas)
[TABLA]
| CAMPO | QUÉ SIGNIFICA | VALOR DE EJEMPLO |
| Cuenta / Descripción * | Código y nombre. | MB1 / Stock reservado Maestros MB |
| Contabilizar / Valoración | Si el stock de la cuenta se contabiliza y se valora. | Sí / Sí |
| Adjudicación / Planificar / Calidad | Si cuenta para reservas, planificación y control de calidad. | Sí / Sí / No |
| Saldo * | Sí, No (no lleva saldo, como NSAL) o Negativos (permite saldo negativo). | Sí |
| Rupturas stock * | Tratamiento de roturas. | Ninguno |
[/TABLA]
*  Campo obligatorio: sin él no deja guardar.
1 	Abre la ruta y pulsa «Nuevo».
2 	Escribe código y descripción y marca los indicadores.
3 	Pulsa «Guardar».
[TABLA]
| [IMG:maestros-047.jpg] |
| Figura 46   Cuentas logísticas de la base: CALI, CUA, DISP, NSAL y TRAN con sus indicadores. |
[/TABLA]
[TABLA]
| [IMG:maestros-048.jpg] |
| Figura 47   Alta de la cuenta MB1 con contabilizar, valoración, adjudicación y planificar. |
[/TABLA]
[TABLA]
| [IMG:maestros-049.jpg] |
| Figura 48   La cuenta MB1 en la lista. |
[/TABLA]
[TABLA]
| ✓   QUÉ HAS CONSEGUIDO |
| ✓	Cliente MB1 en el Maestro de clientes (EUR) y condición de cobro MB + MB1 en el tercero. / ✓	Artículo logístico MB0001 validado, familia 01.01.001352; asignado al proveedor 00001 con prioridad 1 y referencia REF-MB-6000. / ✓	Almacén MB1 (FIFO, delegación CENTRAL, departamento COMPRAS) y cuenta logística MB1. / CÓMO COMPROBARLO / →	MB0001 sale con Filtros en el Maestro de artículos; la pestaña Artículos por proveedor de 00001 lo muestra; MB1 aparece en Almacenes y en Cuentas logísticas. |
[/TABLA]
# EJERCICIO 3
Consultas e informes de stock
Para que las consultas tengan datos se registra antes una entrada inicial de 10 unidades de MB0001 en el almacén MB1.
## 3.1. Movimientos de almacén de usuario (geanmovh)
[TABLA]
| ? | ¿PARA QUÉ SIRVE? / Los movimientos internos son entradas, salidas o traspasos de stock que no vienen de una compra o una venta: inventario inicial, regularizaciones, paso a calidad, cambio de ubicación. Su tipología fija de qué cuenta logística sale el stock y a cuál entra. Al validar el movimiento se actualiza el stock. |
[/TABLA]
MENÚ    Gestión   ›   Logística   ›   Movimientos internos   ›   Movimientos (objeto geanmovh; tipologías en Gestión   ›   Logística   ›   Maestros   ›   Documentos   ›   Movimientos EAN)
[TABLA]
| CAMPO | QUÉ SIGNIFICA | VALOR DE EJEMPLO |
| Tipo movimiento * | Tipología: cuentas origen y destino y serie. | RIDP Recuento inicial en disponible (NSAL › DISP) |
| Empresa / Almacén origen * | Dónde se mueve el stock. | 0 / MB1 |
| Fecha movimiento / recepción * | Fechas del movimiento. | 12-11-2026 |
| Movimiento | Número. Debería darlo la serie; en TUTORIAL hay que teclearlo. | MB000001 |
| Referencia | Texto libre (máx. 20). | Inventario inicial |
| Delegación / Departamento * | Se toman del almacén. | CENTRAL / COMPRAS |
| Cuenta origen / destino * | Se toman de la tipología. | NSAL / DISP |
| Línea: Artículo, VL, Lote, Cantidad, Unidad * | Qué se mueve y cuánto. | MB0001, 0, 0, 10, UNIDAD |
[/TABLA]
*  Campo obligatorio: sin él no deja guardar.
1 	Abre la ruta y pulsa «Nuevo». Elige el tipo RIDP y el almacén MB1.
2 	Escribe el número de movimiento MB000001 y una referencia corta. Guarda.
3 	Abre la ficha, pestaña «Líneas de movimiento» › «Nuevo»: artículo MB0001 y cantidad 10. Guarda.
4 	Pulsa «Validar»: el movimiento queda validado (aparece «Pasar a provisional») y el stock se actualiza.
[TABLA]
| [IMG:maestros-050.jpg] |
| Figura 49   Tipologías de movimiento: RIDP pasa stock de NSAL (fuera de inventario) a DISP (disponible). |
[/TABLA]
[TABLA]
| ! | PROBLEMA / Al guardar la cabecera sin número sale «gsernumh_getserie: Sin máscara. Tab.[geanmovh] Cod.[MOV]». La serie MOV no tiene configurada la numeración para movimientos internos en la base TUTORIAL. |
[/TABLA]
[TABLA]
| [IMG:maestros-051.jpg] |
| Figura 50   Error de serie al guardar el movimiento sin número. |
[/TABLA]
[TABLA]
| ✓ | SOLUCIÓN / Escribe tú el número en el campo «Movimiento» (MB000001). En una instalación real, pide que configuren la máscara de la serie MOV. |
[/TABLA]
[TABLA]
| ! | PROBLEMA / Después sale «Delegación y departamento no informados para el almacén [MB1]». El movimiento los toma del almacén y no se pueden escribir aquí. |
[/TABLA]
[TABLA]
| [IMG:maestros-052.jpg] |
| Figura 51   Segundo error: el almacén MB1 no tenía delegación ni departamento. |
[/TABLA]
[TABLA]
| ✓ | SOLUCIÓN / En la ficha del almacén MB1 informa Delegación CENTRAL y Departamento COMPRAS, guarda y valida (ver 2.4). Repite el movimiento. |
[/TABLA]
[TABLA]
| [IMG:maestros-053.jpg] |
| Figura 52   Cabecera correcta: RIDP, almacén MB1, número MB000001, delegación y departamento del almacén, NSAL › DISP. |
[/TABLA]
[TABLA]
| ! | PROBLEMA / Al elegir el artículo en la línea sale el aviso técnico «ELResolver no manejó el tipo: null con propiedad de 'null'» y la cantidad se queda en 0. |
[/TABLA]
[TABLA]
| [IMG:maestros-054.jpg] |
| Figura 53   Aviso técnico al elegir el artículo en la línea. |
[/TABLA]
[TABLA]
| ✓ | SOLUCIÓN / Cierra el aviso, vuelve a escribir la cantidad y guarda la línea con normalidad. |
[/TABLA]
[TABLA]
| [IMG:maestros-055.jpg] |
| Figura 54   Línea: MB0001, lote 0, cuentas NSAL › DISP, 10 unidades. |
[/TABLA]
[TABLA]
| [IMG:maestros-056.jpg] |
| Figura 55   Movimiento validado: el botón cambia a «Pasar a provisional». |
[/TABLA]
[TABLA]
| [IMG:maestros-057.jpg] |
| Figura 56   Detalle de movimientos (Líneas de movimientos internos): la línea de MB0001 por 10 unidades. |
[/TABLA]
## 3.2. Stock global (galmstkg)
[TABLA]
| ? | ¿PARA QUÉ SIRVE? / Listado de existencias: stock actual por almacén, cuenta logística, artículo y variable logística, con disponible, adjudicado (reservado), entradas y salidas previstas. Es la consulta de «¿cuánto tengo y dónde?». |
[/TABLA]
MENÚ    Gestión   ›   Logística   ›   Stocks   ›   Cuentas   ›   Stock global (objeto galmstkg)
1 	Abre la ruta: se muestra el stock de todos los almacenes.
2 	Pulsa «Filtros» › Almacén, marca MB1 y pulsa Intro.
3 	Lee la fila: cuenta DISP, artículo MB0001, stock 10 y disponible 10.
[TABLA]
| [IMG:maestros-058.jpg] |
| Figura 57   Stock global filtrado por el almacén MB1: 10 unidades disponibles de RODAMIENTO MAESTROS MB. |
[/TABLA]
## 3.3. Traza de movimientos por artículo, kardex (garticul_evolstk)
[TABLA]
| ? | ¿PARA QUÉ SIRVE? / El kardex lista, para un artículo, todos sus movimientos de stock en un periodo, con entradas, salidas y saldo acumulado, agrupados por tipo de documento. Sirve para explicar por qué el stock es el que es. |
[/TABLA]
MENÚ    Gestión   ›   Logística   ›   Stocks   ›   Ubicaciones   ›   Traza de movimientos por artículo-ubicación (objeto garticul_evolstk)
[TABLA]
| CAMPO | QUÉ SIGNIFICA | VALOR DE EJEMPLO |
| Empresa, Departamento, Cuenta, Depósito, VL, Unidad, Lote… * | Filtros; % significa «todos». | % |
| Almacén * | Almacén a consultar. | MB1 |
| Artículo * | Artículo a consultar. | MB0001 |
| Fecha inicial / Fecha fin * | Periodo. | 01-11-2026 / 12-11-2026 |
| Contabilizar / Periodo completo * | Qué movimientos incluir. | Todas / Sí |
[/TABLA]
*  Campo obligatorio: sin él no deja guardar.
1 	Abre la ruta: es una pantalla de variables.
2 	Cambia Almacén a MB1 y Artículo a MB0001; deja el resto en %. Revisa las fechas.
3 	Pulsa «Ejecutar consulta» y desplázate a la derecha para ver entradas, salidas y saldo.
[TABLA]
| [IMG:maestros-059.jpg] |
| Figura 58   Variables del kardex: almacén MB1, artículo MB0001 y periodo del 1 al 12 de noviembre. |
[/TABLA]
[TABLA]
| [IMG:maestros-060.jpg] |
| Figura 59   Resultado: un movimiento RIDP «Recuento inicial en disponible», documento MB000001. |
[/TABLA]
[TABLA]
| [IMG:maestros-061.jpg] |
| Figura 60   Columnas finales: NSAL › DISP, entradas 10, salidas 0, saldo 10. |
[/TABLA]
[TABLA]
| i | A TENER EN CUENTA / Precio y coste salen vacíos porque el recuento inicial se hizo sin valorar. Una entrada por compra traería el coste. |
[/TABLA]
[TABLA]
| ✓   QUÉ HAS CONSEGUIDO |
| ✓	Movimiento interno MB000001 (RIDP) validado: 10 × MB0001 en el almacén MB1, de NSAL a DISP. / ✓	Stock global de MB1: 10 unidades disponibles de MB0001. / ✓	Kardex de MB0001 en MB1: una entrada de 10 y saldo 10. / CÓMO COMPROBARLO / →	Stock global con filtro Almacén = MB1 y el kardex con almacén MB1 y artículo MB0001 deben coincidir (10 unidades). |
[/TABLA]