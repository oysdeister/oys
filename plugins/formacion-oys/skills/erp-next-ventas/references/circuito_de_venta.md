# Circuito de venta: pasos, asientos, vencimientos, Docflow y stock

Índice: 0 Requisitos · 1 Pedido → albarán → factura (`ventas-pedido`) · 2 Contabilizar · 3 Vencimientos, cartera y Docflow · 4 Albarán → factura (`ventas-1`) · 5 Oferta → factura (`ventas-2`) · 6 Resumen de asientos · 7 Stock.
Fuente: `ventas.json` bloques `ventas-pedido`, `ventas-1`, `ventas-2` y `datosSimulador`; recorrido de la demo (notas de Ventas, secciones 5 y 9). Los números de captura (0PV000006, 0AV000006, 0FV000007, asiento 84) son de registros de captura; los del alumno serán otros.

## 0. Requisitos (si falta algo, se vuelve al bloque que lo crea; no se crea en Ventas)
C{INI} tercero + cliente con R{INI}/P{INI} · artículo 13500620 · agente A01 · tipologías PD{INI}, AP{INI}, FP{INI} (+ O{INI}, PV{INI}, A{INI} para los otros dos circuitos) · opcional, GV{INI} en el cliente para que el precio salga solo.
Patrón general de pantalla: lista → «Nuevo» (abre el formulario en ventana) → «Guardar» abajo a la derecha. Los campos con lista se llenan al teclear; tras elegir el Cliente hay que **salir con Tab**. Registros ya existentes: se abren desde la lista pulsando el número o el código azul (no «Nuevo»); «Filtros» ayuda a encontrarlos. El disquete (arriba a la derecha) guarda cambios en una ficha; ⟳ «Recargar» relee.
Estados: **Provisional** (borrador, editable) → **Validado** con «Validar»; la factura además **Contabilizada**.

## 1. Pedido → albarán → factura (la venta del caso)
**Pedido** (`gvenpedh`, «PEDIDOS DE VENTAS»; Gestión › Ventas › Pedidos › Pedidos)
1. «Nuevo»; Tipo documento* = PD{INI}. Empresa 0, Delegación CENTRAL, Departamento VENTAS vienen puestos. Con PD{INI} el campo «Origen» queda bloqueado.
2. Almacén* = código 0 «ALMACEN CENTRAL» (teclea CENTRAL y elige la fila).
3. Cliente* = C{INI} + **Tab**: rellena dirección, «Entregar en», tipo de identificación, país emisor, CIF, **Tipo efecto*** y **Forma pago*** (de la condición de cobro: R{INI} y P{INI}), Divisa EUR, Cambio 1,000000.
4. Agente* = A01 «Agente 01» (obligatorio; la lista ofrece A01 y A04). «Guardar» → número 0PV…, Provisional, Situación Pendiente. Apunta el número: se usa de origen en el albarán.
5. Pestaña «Líneas» (pestañas: Pedidos ventas · Líneas · Impuestos · Descuentos · Documentos · Notas · Características) › «Nuevo» › «LÍNEAS DE PEDIDOS DE VENTAS»: Artículo* 13500620 (+ Tab: VL 0, Lote 0, Unidad UNIDAD), Cantidad pedida* 10 (Cantidad precio pasa a 10,000), Precio 20 (o vacío si hay tarifa: sale al guardar). Importe neto sigue en 0,00 en el diálogo y se calcula al guardar. «Guardar» → rejilla 13500620 · 10,000 · UNIDAD · 20,000000 · 200,00.
6. «Validar» → Validado, importe 200,00. Botones: Acciones (Enviar a WMS, Generar picking, Borrar reservas, Reservar stock, Copiar; **no hay «Generar albarán»**), Pasar a provisional, Anular, Marcar como servido, Nuevo.

**Albarán** (`gvenalbh`, «ALBARANES DE VENTAS»; Gestión › Ventas › Albaranes › Albaranes)
1. «Nuevo»; Tipo documento* = AP{INI} (Almacén ALMACEN CENTRAL viene puesto).
2. **Primero «Origen»**: teclea 0PV → lista con Pedido, Empresa, Fecha pedido (de todos los alumnos) → tu pedido. **Después Cliente*** C{INI} + Tab (rellena direcciones, CIF, Agente 01, Tipo efecto, Forma pago; Origen sigue). «Guardar» → 0AV…, Provisional; las líneas se copian solas (Copiar líneas Sí).
3. Pestañas: Albaranes ventas · Líneas · Líneas componentes · Impuestos · Descuentos · Documentos · Notas. En «Líneas» comprueba el Importe neto: **debe ser 200,00**. En la demo sale **50,00** con precio 20,000000 (Base imponible 1 = 50,000000): fallo de la demo, no del alumno.
4. Corrección: abre la ficha de la línea con el **número azul de fila** (el «1», no el código del artículo; `gvenalbl`, «LÍNEAS DE ALBARANES DE VENTAS»): «Importe dto.» = 1 → disquete (Importe neto 199,00) → «Importe dto.» = 0 → disquete (200,00). Reescribir el mismo Precio no recalcula (el disquete ni se activa si no cambia el valor). En ventas-2 la línea sale con neto 2,50 en lugar de 110,00 y se corrige igual (panel lateral; el disquete es el primer icono gris a la izquierda de la papelera).
5. «Validar» → Validado, importe 200,00. Botones: Acciones (Generar factura, Expedir, Copiar), Anular, Pasar a provisional, No facturable, Nuevo. **No sale «Contabilizar»** porque AP{INI} no tiene asientos.

**Factura** (`gvenfach`, «FACTURAS DE VENTAS»; Gestión › Ventas › Facturas › Facturas)
1. «Nuevo»; Tipo documento* FP{INI}; Cliente* C{INI} + Tab (Facturar a, tipo efecto, forma pago, EUR). «Guardar» → 0FV…, Provisional, Situación Entrada, 0,00. «Origen» vacío (no se rellena a mano).
2. Desplegable **⌄ junto al título** → «Albaranes de ventas a conformar» (el menú tiene: Docflow · Registros fiscales · Albaranes de ventas a conformar · Desconformar Albaranes de ventas).
3. Ventana «ALBARANES DE VENTAS A CONFORMAR» (iframe; cajas Identificación, Líneas, Albaranes conformados, Líneas): fila con la tipología AP{INI}, tu albarán, cliente, Validado, Pendiente, 200,00 → marca la casilla → «Conformar» (también «Conformar todos») → «Confirmación: ¿Estás seguro que quieres ejecutar la acción 'Conformar'?» → «Aceptar».
4. El albarán pasa a «Albaranes conformados» (Origen = el pedido; Estado documento **Facturado**). Cierra la ventana (X) y «Recargar».
5. La factura queda **Validado** directamente: Base imponible 200,00, Importe 242,00 (IVA 21 % = 42,00). Botones: Acciones, Pasar a provisional, **Contabilizar**, eFactura. «Acciones» del albarán ofrece «Generar factura» como alternativa; el curso usa siempre Conformar.
Solo salen albaranes validados y pendientes de facturar del cliente, filtrados por la condición de FP{INI}; los ya facturados no vuelven a salir. Conformar es propio de esta ventana; no hay en ventas un «CRC» (sin verificar si hay control albarán-factura equivalente al de compras).

## 2. Contabilizar la factura
1. «Contabilizar» → «Confirmación» con casilla **«Prevista de Asiento Contable»**. Marcada + «Aceptar»: ventana «Esquema de Asiento Contable - Facturas ventas» (iframe), «Process gconasih_InsertCasientos» → «Proceso de Apuntes»: **43000.00xxx «FACTURAS DE VENTA» Debe 242,00 · 47000.00000 «FACTURAS DE VENTA [Tax]» Haber 42,00 · 70000.00000 «VENTAS {cliente}» Haber 200,00**. Los dos vencimientos no cambian el asiento (siguen siendo tres apuntes).
2. Si sale «DOMICILIACION BANCARIA DE LA EMPRESA NO ENCONTRADA.» y faltan líneas (falta la 70000): atajo de la demo → cierra la prevista; en la factura «Pasar a provisional» → cabecera, solo «Tipo efecto» = **EF** (no tocar «Forma pago» ni el cliente) → disquete → «Validar» → vuelve a pedir la prevista.
3. Contabilizar de verdad: «Contabilizar» con la casilla **desmarcada** → «Aceptar». Se abre el asiento («Asientos contables › AC»): banda FINALIZADO (solo el color de un asiento contabilizado), Diario **DV «Ventas»**, Sistema A «General», Justificante AC, Serie 0FV, Documento 0FV…, Origen gvenfach, Ejercicio 2026, Período 11, Estado **Contabilizado**, Debe 242,00 = Haber 242,00, Cuadre 0,00. Pestañas del asiento: Asiento · Líneas de apuntes · Impuestos · Carteras · Costes · Tesorería · Saldos · Periodificaciones. «Resumen de apuntes (5)» = 3 líneas + 2 filas de totales. Ejemplo de captura: asiento 84 (ID 144).
4. **La primera vez** puede mostrar solo «Process gconasih_InsertCasientos» y la factura sigue sin contabilizar (causa no aclarada). Recarga con ⟳, comprueba que sigue «Contabilizar» y «Fecha contabilización» vacía, y repite «Contabilizar › Aceptar»: a la segunda se abre el asiento (solo se crea un asiento).
5. Factura recargada: Situación **Contabilizada**, Fecha registro contable y Fecha contabilización informadas; botones Acciones, **Descontabilizar**, eFactura, Anular, Nuevo.
Requisito: Fecha en ejercicio y periodo abiertos (empresa 0, ejercicio 2026). Si sale «fechas fuera de rango de vigencia en empresa», es configuración compartida: se avisa al formador.

## 3. Vencimientos, cartera y Docflow
- Pestaña «Vencimientos»: Fecha vencimiento, Tipo Efecto, Efecto, Importe local, Importe divisa, Importe IVA, Importe retención, Naturaleza (Ordinario), IVA no validado, Perceptor, Domiciliación. Con R{INI}/P{INI}: **dos filas de 121,00** (30 y 60 días; si cambiaste el tipo a EF, salen con EF). La captura (cliente con un solo plazo) muestra una fila de 242,00 con 42,00 de IVA: factura del 25-11-2026, vence el 28-12-2026 (la fecha la calcula el ERP desde la fecha valor; no se investigó por qué no el 25-12).
- ⌄ del título con la factura contabilizada: Docflow · Albaranes ventas · Expediciones · Asientos contables · **Cartera de efectos** · Registros fiscales · Albaranes de ventas a conformar.
- «CARTERA DE EFECTOS {factura}» (iframe; botones Evolucionar estado, Retroceder, Nuevo; pestañas Cartera de efectos · Historia efecto · Asientos contables): Clase* **Cobrar**, Documento, Orden, Auxiliar FP{INI}, Tercero, Cuenta 43000.00xxx, Tipo de efecto*, Estado* **PE «Pendiente»**, importes, Impuestos 42,00, Vencimiento, Perceptor. No pulses Evolucionar estado ni Retroceder aquí; el cobro se registra después (módulo Cartera).
- **Docflow**: «Pedidos ventas 1 » Expediciones 1 » Facturas ventas 1»; el círculo «1» es el n.º de documentos de ese tipo. Tarjetas: pedido **Servido o Facturado**, albarán **Facturado**, factura **Validado** (aunque esté contabilizada, igual que en compras). Docflow y Cartera se abren en ventanas aparte: ciérralas con la X.

## 4. Albarán → factura (`ventas-1`, tipología A{INI}, sin pedido, con asiento)
Verificar A{INI} (caja a caja: serie AV, Activo, Albarán, DISP/NSAL, sin origen, Tipo factura FP{INI}, Valoración Normal/Tarifa/Clientes/Precio, Indicativos Salida, Contabilización AV en los dos asientos y Datos contables activado) y que la condición de FP{INI} incluye A{INI} (si no, añadirlo con coma y apóstrofos rectos; disquete).
1. Albarán `gvenalbh`: «Nuevo», Tipo documento A{INI}, Cliente C{INI} dirección 0, «Guardar» (0AV…, Provisional). Pestaña Líneas › «Nuevo»: 13500620 + Tab, Cantidad 10, Precio 20, Importe dto. 0 → «Guardar»: Importe neto 200,00 («Precio con IVA» queda vacío; son excluyentes). «Validar»: Validado, Situación Pendiente; salen Pasar a provisional, Contabilizar, No facturable, Anular.
2. «Contabilizar» › «Aceptar» (casilla de prevista opcional): asiento del albarán **43090.00000 «Clientes, facturas pendientes de formalizar» D 200,00 · 70000.00000 «Ventas mercancías» H 200,00** (diario DV; el total del albarán, sin IVA). Errores posibles: `iges_get_ctertipo_cuenta: CUENTA DEL TERCERO [C{INI}] NO INFORMADA` (falta la relación CLI) y `EXPRESION:[cabecera.impant] NO CONTEMPLADA…` (A{INI} lleva FV en vez de AV).
3. **Descontabiliza el albarán antes de facturar** (ficha del albarán › «Descontabilizar» › «Confirmación» › «Aceptar»; sin mensajes). Resultado probado: «Fecha contabilización» vacía, Situación y Estado sin cambios, el botón vuelve a «Contabilizar»; funciona también con el albarán ya conformado en una factura aún sin contabilizar. No se comprobó en Contabilidad que el asiento del albarán desaparezca del libro (sin verificar). Por qué: FP{INI} usa FV, que apunta otra vez 200,00 en la 70000 y no salda la 43090; sin descontabilizar, las ventas suman 400,00 por una venta de 200,00 y la 43090 queda con 200,00. En una empresa real que contabiliza albaranes, la pareja correcta es AV + FVOA (en la demo FVOA falla).
4. Factura como en el punto 1 (FP{INI}, cliente, ⌄ › Conformar), contabilizar (prevista, atajo EF si hace falta) y revisar «Vencimientos». Asiento neto de la venta: 43000.00901 D 242,00 · 47000.00000 H 42,00 · 70000.00000 H 200,00; albarán Facturado.
Margen orientativo si se hubiera comprado a 12,50: 200,00 − 125,00 = 75,00. Esta venta es de práctica: no se suma a la del caso.

## 5. Oferta → pedido → albarán → factura (`ventas-2`, 5 × 22,00)
Verificar O{INI}, PV{INI} (Tabla origen Oferta, Copiar Sí, Sumando, Albarán ventas AP{INI}, Relación cliente Clientes), AP{INI} y FP{INI} (condición con AP{INI}).
1. **Oferta** (`gvenofeh`; Gestión › Ventas › Ofertas › Ofertas): «Nuevo», Tipo documento O{INI}, Cliente C{INI} dir. 0; **Fin vigencia = 31-12-2026** (por defecto el mismo día: una oferta vencida no sale como origen del pedido); en Información general **Agente A01** (obligatorio; sin él «Hay errores en los datos del formulario» y el campo en rojo); «Guardar» (0OV…, Provisional). Líneas › «Nuevo»: 13500620, Cantidad ofertada 5, Precio 22 (neto 110,00 se calcula; Agente y Fechas de entrega de la línea opcionales). «Validar»: Validado, Adjudicación **Pendiente** (Pasar a provisional, Cerrar, Anular). Tras pasar a pedido queda «Cursada» y el botón es «Abrir».
2. **Pedido**: «Nuevo», Tipo documento PV{INI}, Almacén 0; **primero «Origen» (la oferta), después Cliente** (al elegir origen se vacía el cliente); el Agente A01 viene de la oferta. «Guardar» (0PV…): la línea llega copiada (110,00). «Validar».
3. **Albarán**: «Nuevo», AP{INI}, Origen = el pedido, después Cliente, «Guardar» (0AV…); línea con precio 22,00 pero neto 2,50: se fuerza el recálculo («Importe dto.» 1, guardar, 0, guardar) → 110,00. «Validar»: sin botón Contabilizar.
4. **Factura**: FP{INI} + cliente, ⌄ › Conformar (solo sale el albarán de este circuito), Recargar, «Contabilizar › Aceptar»: **asiento 133,10 = 43000.00901 D 133,10 · 47000.00000 H 23,10 · 70000.00000 H 110,00** (cuadre 0,00).
5. Lista de pedidos: el tuyo queda «Servido o Facturado» (origen la oferta); albarán «Facturado»; factura «Contabilizada». Solo la factura contabiliza.
Docflow de referencia del simulador: oferta 0OV000001 (Validada, adjudicación Pendiente hasta pasar a pedido; vigencia 12-11-2026 a 31-12-2026) → pedido 0PV000002 → albarán 0AV000002 (Facturado, sin contabilizar) → factura 0FV000002 (133,10 Contabilizada) → asiento DV.

## 6. Resumen de asientos
| Documento | Asiento |
|---|---|
| Oferta, pedido | ninguno |
| Albarán AP{INI} | ninguno |
| Albarán A{INI} (AV) | 43090 D = total · 70000 H (se descontabiliza antes de facturar) |
| Factura FP{INI} (FV) | 43000.00xxx D total · 47000.00000 H IVA · 70000.00000 H base |
Cuadro de la venta del caso: 242,00 = 200,00 + 42,00. El IVA repercutido va en la demo a la 47000.00000 (rótulo «Hacienda Pública, deudora por IVA»; en el PGC la 4700 es lo que Hacienda te debe y el IVA cobrado va a la 477): es configuración de la demo, no se copia.

## 7. Stock del 13500620
Compras mete 10 unidades en ALMACEN CENTRAL (código 0). Ventas saca 25 en total: 10 del pedido del caso (las compradas), 10 del albarán A{INI} y 5 de la oferta. Las 15 de práctica salen del stock existente de la demo (**83 unidades disponibles el 26-11-2026**, compartidas por todos). Al validar un albarán la mercancía pasa de DISP a NSAL (sale del stock disponible); el «Tipo movimiento» Salida de Indicativos evita que sume. Si el ERP avisa de falta de stock, avisar al formador. El kardex y el movimiento de stock se ven en Maestros (maestros-3).
