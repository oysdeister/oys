# Tipologías de venta, numeración y plantillas de asiento

Índice: 1 Qué es una tipología · 2 Numeración · 3 Catálogo de la demo · 4 Campos de enlace · 5 Crear las seis tipologías · 6 Enlazar · 7 Plantillas de asiento · 8 Numeración fiscal.
Fuente: `ventas.json` bloques `ventas-tipologias-mapa`, `ventas-documentos`; recorrido de la demo del 25 y 26-11-2026 (secciones 3, 4 y 9 de las notas de Ventas).

## 1. Qué es
La tipología es el molde de cada documento: serie (contador), documento origen y destino, si copia líneas, si actualiza el origen, si mueve stock y con qué plantilla se contabiliza. Una tipología mal hecha produce documentos sin número, sin líneas o sin asiento. Las fichas son cajas apiladas con pestañas internas. Botón «Nuevo» de la barra: menú «Nuevo» (en blanco) y «Nuevo como» (copia el registro que ves en una ventana con «Guardar» abajo a la derecha). **Código máx. 4 caracteres** («Demasiado largo» si se pasa).

## 2. Numeración (`gsernumh`, solo lectura)
Rejilla: Tabla origen, Código, Descripción, Rotura, Numerador, Control cronológico, Fecha baja (16 filas). Las de ventas: OV (gvenofeh), PV (gvenpedh; también PVRM), AV (gvenmovh), FV (gvenfach; también ANTFV anticipo). Rotura `#e#s` (empresa + serie, sin año) y Numerador `#e#s#6n` (empresa + serie + contador de 6 cifras): empresa 0 + PV + 000006 = 0PV000006. «Línea (n)» lista los contadores (Serie, Fecha último documento, Último número). Ninguno de ventas tiene Control cronológico. Sin numerador no se puede numerar un documento: por eso las tipologías usan series existentes. Ayudas literales: Rotura «Máscara para crear una nueva serie»; Numerador «Criterio de numeración».

## 3. Catálogo propio de la demo (no tocar; las filas con CL, CP, VD o CAP son de otros alumnos o capturas)
- Ofertas `gvenofed`: **OV** «Oferta de Venta» (serie OV, sin origen, Precio tarifa Precio, Impresión Sí); OVRM «Ofertas (Circuito o-p-a-f)» (origen «Ofertas de venta»; circuito especial que no se usa).
- Pedidos `gvenpedd`: **PED** «Pedido (sin Oferta)» (sin origen); **POF** «Pedido (con Oferta)» (origen Oferta, Copiar Sí, Sumando); PRM «Pedido (con Oferta)» (origen Oferta, sin actualizar). Los tres dan paso a AV. Tipo: Normal, Reposición, Programación, Muestras.
- Albaranes `gvenmovd`: **AV** «Albarán de Ventas (Picking)»: serie AV, DISP › NSAL, Salida, **Tabla origen «Propuesta de movimiento»** (el picking del almacén), asientos vacíos, Tipo factura «Factura de Ventas», Valorar Tarifa. «Tabla origen» admite: Pedidos de venta, Expediciones, Facturas ventas, Albarán de compras, Facturas compras, Movimientos EAN, Propuesta de movimiento, Acuerdos de ventas, Planificación de entrega, Órdenes trabajo, Contrato de mantenimiento, Tickets de TPV, Órdenes de descarga.
- Facturas `gvenfacd`: solo **FV** «Factura de Ventas» (Expediciones, Sumando, Copiar «Validar», Tipo asiento FACTURA DE VENTAS, Relación cliente Clientes, Clase Factura completa, Abono no, Impresión Sí). **No hay abono ni rectificativa de venta.**
- FVOA no es una tipología: es una plantilla de asiento (`gconasih`).

## 4. Campos de enlace (caja «Documento origen»)
- «Tabla origen»: de qué documento copia; vacía = primero de la cadena. Si no hay origen, «Copiar líneas» y «Actualizar origen» deben quedar sin valor: si no, «El indicativo de actualización de tabla origen sólo puede informarse cuando la tabla origen está informada…».
- «Copiar líneas»: **Sí** «Inserta automáticamente líneas del documento origen» · **Validar** «Inserta desde un selector de líneas del documento origen» · **No** «No copia ni permite seleccionar líneas del documento origen».
- «Actualización tabla origen»: **Sumando** «Actualiza la línea del documento origen sumando» (pedido de 10, albarán de 4: el pedido anota 4 servidas y sigue Pendiente/Parcial hasta las 10) · **Restando** (devoluciones; no se usa) · **No**.
- «Condición selección (text/sql)»: filtra los documentos origen elegibles (en FP{INI}, `tipdoc IN (…)`; `tipdoc` guarda el código de la tipología del albarán).
- Hacia delante: «Albarán ventas» (caja Destinos del pedido) y «Tipo factura» (Documento destino del albarán).

## 5. Crear las seis tipologías del curso
Norma: si en la demo hay una con el **mismo origen** que la tuya, cópiala con «Nuevo › Nuevo como» y cambia solo lo indicado; si ambas tienen origen pero distinto, cópiala y cambia la «Tabla origen» en la misma ventana; si la tuya **no tiene origen** y la de la demo sí, créala con «Nuevo › Nuevo» (en blanco), porque al vaciar la «Tabla origen» de una copia el ERP no deja guardar (las tarjetas de Actualizar origen copiadas no se desmarcan).

| Tipología | Pantalla | Cómo | Valores clave |
|---|---|---|---|
| **O{INI}** «Oferta ventas {INI}» | `gvenofed` | Nuevo como sobre OV | serie OV, Estado Activo, sin origen, Precio tarifa Precio. La vigencia va en cada oferta |
| **PD{INI}** «Pedido venta {INI} sin origen» | `gvenpedd` | Nuevo como sobre PED | serie PV, Tipo Normal, sin Tabla origen, Relación cliente Clientes, Clave impositiva General, Precio tarifa Precio. **Albarán ventas = AP{INI}** (al final) |
| **PV{INI}** «Pedido ventas {INI} desde oferta» | `gvenpedd` | Nuevo como sobre POF | serie PV, Tabla origen Oferta, Copiar Sí, Sumando; **Destinos › Albarán ventas = AP{INI}** (viene AV) |
| **AP{INI}** «Albarán venta {INI} desde pedido» | `gvenmovd` | Nuevo como sobre **AV** (estándar) y, en la misma ventana, Tabla origen «Pedidos de venta» | serie AV, Expedición «Albarán», DISP › NSAL, Copiar líneas Sí, Actualizar origen Sumando, Valorar Tarifa, Relación cliente Clientes, Abono sin marcar, **Asiento expediciones y Asiento albaranes vacíos** (Datos contables y Tesorería «no»), Indicativos › Tipo movimiento Salida. **Tipo factura = FP{INI}** (al final) |
| **A{INI}** «Albarán ventas {INI}» (contabiliza) | `gvenmovd` | **Nuevo (en blanco)** | Tipo movimiento A{INI}, serie AV, Estado Activo, Expedición Albarán, DISP/NSAL, sin origen (Copiar líneas y Actualizar origen sin marcar), Tipo factura FP{INI}; Valoración: Valoración inventario Normal, Valorar Tarifa, Relación cliente Clientes, Precio tarifa Precio; Indicativos › Tipo movimiento **Salida** (en blanco viene «Entrada» y sumaría stock); Contabilización: **AV «ALBARAN DE VENTA»** en Asiento expediciones y Asiento albaranes y Datos contables activado |
| **FP{INI}** «Factura venta {INI} desde albarán» | `gvenfacd` | Nuevo como sobre FV | serie FV, Tabla origen Expediciones, **Condición `tipdoc IN ('AP{INI}','A{INI}')`**, Copiar líneas **Sí** (FV trae Validar), Sumando, Tipo asiento FACTURA DE VENTAS, Relación cliente Clientes, Clase Factura completa. Única factura del curso: sirve a los tres circuitos |
- AP{INI} sobre AV: comprobado en la demo (copia de AV con Tabla origen cambiada a Pedidos de venta; «Copiar líneas» Sí y «Sumando» ya vienen de AV; si «Copiar líneas» no está en Sí, márcalo). Una versión anterior copiaba de ACL2 (de un alumno): ya no.
- Con FV en lugar de AV en los asientos del albarán, al contabilizarlo sale `EXPRESION:[cabecera.impant] NO CONTEMPLADA PARA EVALUAR IMPORTE` (FV es plantilla de facturas y busca anticipos).
- «Expedición albarán»: Albarán o Expedición (las dos son salidas; el ERP llama «Expediciones» al conjunto). «Valorar»: Tarifa «Se aplican tarifas y descuentos según cliente o delegación» · Última venta · Precio medio · No.
- Cuenta origen/destino son cuentas logísticas: DISP «DISPONIBLE PARA SER UTILIZADO» (stock vendible) y NSAL «NO SALDO» (fuera del inventario).
- FP{INI}: «Clase» (Factura completa, simplificada, Ticket, sustitutivas, DIVA, Rectificativa, notas de crédito/débito, DUA, importación, asiento resumen, anulación, donativo, otros) pasa a los registros fiscales de IVA; «Clave impositiva» vacía = la del cliente y el artículo; Impresión Sí imprime al guardar; Grupo validación y Circuito (Validaciones workflow) vacíos.

## 6. Enlazar
En la ficha ya guardada: AP{INI} › Documento destino › Tipo factura FP{INI}; PD{INI} (y PV{INI}) › Destinos › Albarán ventas AP{INI}; guardar con el disquete. Comprobación de la cadena: pedido › AP{INI}; albarán › Tabla origen Pedidos de venta y Tipo factura FP{INI}; factura › Expediciones y condición con AP{INI} y A{INI}.

## 7. Plantillas de asiento (`gconasih`, «CABECERAS ASIENTOS PROGRAMABLES»; cada una lista abajo «Documentos del tipo de asiento»)
- **AV «ALBARAN DE VENTA»** (diario DV): 43090 «Tercero/Clientes» `cabecera.imptot` («VENTAS PENDIENTE DE FACTURA»; rótulo de la cuenta «Clientes, facturas pendientes de formalizar»); línea M «Datos contables» `-lineas.impnet` (ventas, «Relación artículos» M = la cuenta sale del tipo contable del artículo); 70600 `-cabecera.impdtpp` (pronto pago). Documentos que la usan: ACL, CAPV (de otros alumnos).
- **FV «FACTURA DE VENTAS»**: Tercero/Clientes `cabecera.imptot`; M Líneas `-lineas.impnet`; 70600; 43800 `cabecera.impant` (anticipos). El IVA lo añade el ERP (línea «[Tax]»).
- **FVOA «FACTURA VENTA ORIGEN ALBARAN CONT. TOTAL»** (diario DC «Compras»): las cuatro de FV + 43090 `-albaorig.imptot` («ALBARAN», salda la 43090 al haber) + M `albaorig.imptot` («RETROCESO ALBARAN», ventas al debe): pareja de AV (albarán AV + factura FVOA cuentan la venta una vez). **Ninguna tipología la usa y en la demo la prevista falla** (ver trampas).
- Tipo contable PRODUCTO (`gcontipo`): M → 70000.00000 en las de venta (60000.00000 en las de compra).
- No cambies plantillas ni tipos contables: la demo es compartida.

## 8. Numeración fiscal (`cdocnumh`, «SERIES DE NUMERADORES DE DOCUMENTOS», Finanzas)
Aparte del número de gestión (0FV…), la factura tiene numeración fiscal correlativa. Serie **FVN «Fact. venta»**: Rotura `#e#yy#d`, Máscara `#d#e#yy-#n`, longitud 6, **Control cronológico marcado** (número y fecha en orden; obligación legal), serializador 026FVN, último FVN026-000006. En ventas la rotura lleva el año: contador nuevo cada año. Solo lectura.
