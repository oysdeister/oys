# Cliente y precios de venta

Índice: 1 Tercero · 2 Maestro de clientes · 3 Condición de cobro · 4 Impuestos, banco, riesgo, agente · 5 Cuenta de ventas · 6 Precios (lista, grupo, cliente).
Fuente: `ventas.json` bloques `ventas-cliente` y `ventas-precios`; recorrido de la demo del 25 y 26-11-2026 (notas de captura de Ventas, secciones 2, 9.4 y 9.5).

## 1. El tercero y su relación contable (`ctercero`)
- Un cliente son **dos fichas**: el **tercero** (identidad: nombre, NIF, direcciones, relación contable; vive en Finanzas, se guarda una sola vez aunque compres y vendas) y el **cliente** (ficha comercial; vive en Gestión).
- Pestañas del tercero: Terceros · Relaciones · Datos bancarios · Condiciones de pago · Condiciones de cobro · Direcciones · Contactos · Mandato · Impuestos · E-mails.
- Categoría «Clientes» (001) ofrece la relación **CLI** y la cuenta 43000. Pestaña «Relaciones» → «Añadir relacion» (sin tilde, rótulo del ERP): Tipo tercero Cliente, Tipo relación «Clientes» (CLI), Plan contable ES (PGE 2008), **Cuenta vacía**: al guardar la pone el ERP (en la demo de captura salió 43000.00CCP; en el curso, la subcuenta de C{INI}, p. ej. 43000.00901). No uses la 43000.00000 genérica.
- Sin la relación, al contabilizar sale `iges_get_ctertipo_cuenta: CUENTA DEL TERCERO [C{INI}] NO INFORMADA`.
- El tercero también necesita dirección 0 (pestaña Direcciones, «Añadir direccion»): el pedido la propone al elegir el cliente. Zona impositiva ESCO (peninsular) viene puesta.
- Alta de tercero de captura (referencia, no del curso): NIF-Empresa, categoría 001, relación CLI, dirección, condición de cobro, «Validar».

## 2. Maestro de clientes (`gcliente`, «MAESTRO DE CLIENTES»)
Ficha de cajas con pestañas internas: Identificación · Información general / Facturación / Cobros / Agente / Riesgo · Logística / Auxiliares / Impresión · Datos financieros / Tarifas / Reservas · Datos de control.
| Campo | Caja | Valor del curso |
|---|---|---|
| Cliente* | Identificación | C{INI} (busca por Tercero, Nombre o Id. fiscal) |
| Fecha alta*, Estado* | Identificación | hoy; Provisional al crear, **Activo** al guardar |
| Comercial* | Identificación | se propone el mismo código (responsable interno; no es el agente del pedido) |
| Agrupación empresas* | Identificación | ALL «Holding de todas las sociedades» |
| Tipo cliente* | Información general | 0 GENERAL (único que ofrece la demo) |
| Tercero facturación*, Dirección facturación* | Facturación | C{INI}, 0 |
| Agrupación albaranes* | Facturación | «Tercero y más campos» (otras: Tercero facturación, Tercero comercial, Por tipos de IVA, No agrupar) |
| Modalidad facturación* | Facturación | Mensual (diaria, semanal, decenal, quincenal, no facturable) |
| Método facturación* | Facturación | «1 Albarán-1 Factura» (otros: 1 Pedido-1 Factura, 1 P.completo-1 Factura, 1 Ter.envío/facturación/comercial-1 Factura) |
| Tercero cobro*, Dirección cobro* | Cobros | C{INI}, 0 |
| Portes*, Divisa* | Datos financieros | Debidos, EUR (sin divisa no guarda: «Hay errores en los datos del formulario») |
| Grupo precio | Tarifas | vacío al principio; GV{INI} tras «Preparar los precios de venta» |
- **No hay «Tipo efecto» ni «Forma pago» en el cliente.** Salen de la condición de cobro del tercero.
- Al guardar el cliente queda «Activo»; «Validar» no hace falta (Validaciones 0, sin mensaje). La ficha guardada trae «Pedir datos», «Validar», «Nuevo» y además pestañas Destinos, Artículos por cliente, Notas, Workflow.
- C{INI} ya existe: se abre desde la lista (código azul o n.º de fila) y se comprueba. «Nuevo» crearía otro cliente.

## 3. Condición de cobro (pestaña «Condiciones de cobro» del tercero)
- Botón «Añadir cobro»: Empresas* ALL · Tipo efecto* · Descripción* (la rellena sola) · Plazo pago*.
- Tipo efecto: EF «Al contado», RC «Recibo», DD «Recibo domiciliado», TF «Transferencia», CH «Cheque», PG «Pagaré», TJ «Pago mediante tarjeta». El desplegable sale «Datos no disponibles» hasta teclear letras del código.
- Plazo: 30D «30 días», T2D «2 Vtos. 30 y 60 días», 30F «30 días FIJOS». El de C{INI} es **P{INI}** (50 % a 30 y 50 % a 60 días) con tipo **R{INI}**.
- Pedido, albarán y factura **copian** Tipo efecto y Forma pago de aquí (al elegir cliente + Tab).
- Cada alta o cambio de condición devuelve el tercero a «Provisional» (workflow TER). Por eso se valida el último (botón «Validar» de la barra → Estado «Validado»).
- «Domiciliación bancaria» del tipo de efecto (`ctipoefe`): «No requiere» EF, RC, CH; «Tercero» DD, MB, CN, TFX y R{INI}; «Empresa» TF, GI, FC, FS. Con TF la prevista de la factura falla con «DOMICILIACION BANCARIA DE LA EMPRESA NO ENCONTRADA.» (la empresa 0 no tiene domiciliación). Con R{INI} el mensaje exacto **no se ha comprobado** (sin verificar).
- Ejemplo de la demo: el tercero 00002 tiene en Datos bancarios una cuenta (Domiciliación 0, ALL, banco e IBAN); sirve para ver dónde está, no se copia. C{INI} no tiene datos bancarios ni mandato (pestaña Mandato = autorización SEPA).

## 4. Lo que revisa un consultor (el curso lo deja vacío)
- Impuestos: «Clave fiscal tercero» (Régimen general, en Terceros › Más datos), «Zona impositiva» de la dirección (ESCO; decide IVA peninsular, Canarias o UE), pestaña «Impuestos» (excepciones: Operación Origen, Impuesto origen, Operación Destino, Impuesto destino, fechas, Justificación; vacía en C{INI}). No tocar la zona.
- Riesgo (cliente, tercero facturación, federación, grupo, Tiempo cartera 0): límite de crédito; superarlo puede bloquear pedidos.
- Descuentos: Descuento comercial 1/2/3, % pronto pago, Mínimo pedido, Mínimo facturación; vacíos/0 en C{INI}. Ponerlos a 0 resuelve en Compras el error `Object.toString()`, pero **no** el de FVOA en Ventas.
- Agente: pestaña «Agente»; vacío en C{INI}. No se ha comprobado si, rellenándolo, el pedido lo propone (sin verificar).

## 5. De dónde sale la cuenta de ventas y el IVA
Cliente → cuenta del debe (relación CLI, 43000). Artículo → cuenta del haber: el 13500620 tiene Tipo contable PRODUCTO (`gcontipo`, «TIPOS DE CONTABILIZACIÓN»), que lleva la **70000.00000 «Ventas mercancías»** en «ALBARAN DE VENTA», «FACTURA DE VENTAS» y «FACTURA VENTA ORIGEN ALBARAN CONT. TOTAL» (y la 60000.00000 en las de compra). El IVA sale de la clave fiscal del artículo, BOG (bienes a tipo general, 21 %), propuesta por la familia.

## 6. Precios de venta
Dos piezas, como en compras: la **lista** guarda precios con vigencia; el **grupo** reúne listas en orden con condición. El cliente apunta al **grupo**, no a la lista (campo «Grupo precio», pestaña «Tarifas»).
- Lista `gven_pricelist` «LISTA DE PRECIOS DE VENTA»: cabecera Código* (máx. 12), Descripción*, Agrupación empresa*, Divisa*. Líneas «Líneas de lista de precios»: Fecha inicio*, Fecha fin, Artículo*, Precio (sin IVA) o Precio con IVA (excluyentes), Descuento 1/2/3, Descuento importe, Cantidad mínima* (0 = desde la primera unidad; sirve para escalados), Precio recomendado, Estado. Demo: una sola lista **TV «Tarifa Ventas»** (ALL, EUR) con el 13500620 a **5,25**.
- Curso: `LV{INI}` «Tarifa venta {INI}», ALL, EUR, línea 01-01-2026 a 31-12-2099, 13500620, Precio 20, Cantidad mínima 0. «Nuevo» de la barra → «Nuevo» (en blanco) → «Guardar»; luego «Nuevo» en las líneas.
- Grupo `gven_pricegroup` «GRUPO DE PRECIOS DE VENTAS»: Grupo* (máx. 12), Nombre*; filas «Listas de grupo de precios de venta»: Orden* (se prueba el más bajo primero), Condición (vacía = siempre), Divisa*, Lista precio*. Demo: 00002 «CLIENTE» (órdenes 1 `GVENTARC-TERCE: 00002|TARIFA: TV`, 301 `DELEGACION : DIS CENTRAL`, 400 sin condición; todas TV), GROUP_GEN, RMS.
- Curso: `GV{INI}` «Grupo venta {INI}», una fila: Orden 1, EUR, LV{INI}, sin condición.
- Asignación: C{INI} › Tarifas › Grupo precio GV{INI} → disquete.
- **Prueba hecha en la demo**: con el grupo 00002 en un cliente de captura, una línea de pedido del 13500620 × 10 sin teclear precio quedó a 5,250000 e importe 52,50. El «Precio» **se rellena al guardar la línea**, no al elegir el artículo (en el diálogo sigue vacío). Con GV{INI} saldría 20,000000 y 200,00 (inferido del mismo mecanismo; no probado con LV/GV propios, sin verificar). Si queda vacío: revisar grupo del cliente, fila del grupo → lista, línea vigente en la fecha del pedido; si no, teclear 20.
- Otras condiciones de la pestaña Tarifas (vacías en el curso): Descuentos generales, Rápeles, Descuentos familia, Márgenes venta, Grupo descuento.
- No asignar el grupo a otros clientes ni cambiar la lista TV.
