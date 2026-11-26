# Los 13 bloques de Compras (app/src/content/compras.json)

Fuente: `app/src/content/compras.json` (ejercicios[]) y `etapas.ts`; revisiones en `auditoria/redaccion_compras_ventas.md`, `auditoria/revision_senior_ventas_workflow.md` y `auditoria/revision_junior_ventas_workflow.md`. {INI} = 2 iniciales del alumno. Los bloques de workflow (`compras-workflow-config`, `compras-workflow`) están en la skill `erp-next-workflow`.

Índice: 1 maestros-2 · 2 compras-1 · 3 compras-precios · 4 compras-tipos · 5 compras-3 · 6 compras-2 · 7 compras-albaran-contabilizar · 8 compras-factura · 9 compras-generar-factura · 10 compras-abono-devolucion · 11 maestros-3 · 12-13 workflow (otra skill).

## 1. `maestros-2` · Dar de alta los datos básicos de gestión
Objetivo: lo necesario para comprar y vender con stock: cliente C{INI}, artículo, su proveedor, almacén y cuenta logística. Un maestro se crea una vez y se reutiliza.
- **Cliente** (Gestión › Maestros › Terceros › Clientes › Registro, «Maestro de clientes»): cliente y proveedor no son pestañas del tercero, son pantallas propias. Cliente C{INI} (el tercero de contabilidad), Comercial C{INI}, Agrupación empresas ALL, Tipo cliente 0 GENERAL, Facturación C{INI}/0/Mensual/1 Albarán-1 Factura, Divisa EUR. Luego, en la ficha del tercero, pestaña «Condiciones de cobro» › «Añadir cobro»: tipo efecto R{INI}, estado PE (Pendiente), plazo P{INI} (50 % a 30 días y 50 % a 60 días: una venta de 242,00 deja dos efectos de 121,00); «Validar» de nuevo el tercero.
- **Artículo** (Gestión › Maestros › Artículos › Registro): ROD{INI} «RODAMIENTO MAESTROS {INI}», unidad UNIDAD, agrupación ALL, tipo ARTICULOS, familia `01.01.001352` (teclea el código y Tab: hereda clave fiscal BOG y naturaleza Bien), Stock Sí. Validar. Se busca con Filtros › Descripción.
- **Artículo por proveedor**: «Artículos por proveedores» abierto directamente solo consulta; el alta se hace en la ficha del proveedor (00001), pestaña «Artículos por proveedor» › Nuevo: ROD{INI}, Asignado, prioridad 1, referencia REF-{INI}-6000, dirección 0.
- **Almacén** (Gestión › Logística › Maestros › Almacenes › Almacenes logísticos): ALM{INI}, recinto 0 RECINTO CENTRAL, empresa 0, agrupación ALL, tercero 0 y dirección 0, **Delegación CENTRAL y Departamento COMPRAS** (sin ellos los movimientos fallan: «Delegación y departamento no informados para el almacén»), valoración FIFO, fecha última valoración 01-01-2026. Validar.
- **Cuenta logística** (Gestión › Logística › Maestros › Cuentas logísticas): RS{INI} «Stock reservado Maestros {INI}», marca Contabilizar, Valoración, Adjudicación, Planificar; Saldo Sí; Rupturas Ninguno. Cada movimiento pasa stock de una cuenta a otra (NSAL, DISP, CALI, CUA, TRAN…).

## 2. `compras-1` · Dar de alta el proveedor y el artículo
Orden: tercero → relaciones → direcciones → condiciones y banco → validar → proveedor → artículo.
- **Tercero** (Finanzas › Maestros › Terceros › Registro de terceros › «Añadir tercero»): T{INI}, Nombre, País emisor ES, Tipo ID fiscal «No censado», Id. fiscal 0, Categoría 002 Proveedores, clave fiscal RGEN, Idioma es, Empresas ALL; estado Provisional/Abierto/Abierto. Tras guardar, «Ver registro» y Holding = T{INI} (si no hay grupo, el propio tercero). Error «Hay errores en los datos del formulario» = falta un obligatorio.
- **Relaciones** (pestaña «Relaciones» › «Añadir relacion»): Proveedor/**ACR** Acreedores (41000.00000) y Proveedor/**PRO** Proveedores (40000), plan ES (PGE 2008); la cuenta se rellena al salir del campo plan. Sin PRO la factura no contabiliza. Puede salir el aviso informativo «Cuenta repetida».
- **Dirección**: tipo 0 domicilio fiscal, CP 08001 (rellena provincia y población), zona impositiva ESCO.
- **Condiciones**: «Condiciones de cobro» EF + 30D; «Condiciones de pago» **TF Transferencia + 30D** (la que copian albaranes y facturas); «Datos bancarios» IBAN de ejemplo, Banco ES2100 (CAIXABANK), BIC CAIXESBBXXX, domiciliación 0 (sin Banco: «Entidad y cuenta bancaria, ambos nulos o no nulos»). Validar el tercero; si cambias algo vuelve a Provisional.
- **Proveedor** (Gestión › Maestros › Terceros › Proveedores › Registro, «Nuevo»): T{INI}, comercial T{INI}, ALL, tipo 0 GENERAL, divisa EUR, **descuentos 1/2/3 y pronto pago = 0**, Fecha baja 31-12-2099; después las centrales (compras y pagos) = T{INI} con su proveedor, **en pareja y guardando antes sin ellas** (si no, error de restricción). Grupo precio G{INI} se asigna al final (bloque de tarifas).
- **Artículo 13500620** (6000-2RS ISB): solo se comprueba: Tipo contable PRODUCTO (PROD) en «Contabilidad», clave fiscal BOG, naturaleza Bien, estado Activo. **No se cambia**: error `tipcon [VEN] cuenta no definida` si la línea lleva otro artículo.

## 3. `compras-precios` · Preparar los precios de compra
- Lista (Gestión › Compras › Maestros › Tarifas › Precios › Listas de precios, «Nuevo › Nuevo»): TF{INI}, ALL, EUR; línea: inicio 01-01-2026, fin 31-12-2099, artículo 13500620, VL 0 (variante logística), Activo, **precio 12,50**, cantidad mínima 0.
- Grupo (… › Grupo de precios): G{INI}, línea orden 1, divisa EUR, lista TF{INI}.
- Asignar G{INI} en el proveedor: Datos financieros › pestaña Tarifas, y guardar con el disquete.
- Trampa: la línea del pedido o albarán no siempre toma el precio de la tarifa en tutorial; si sale vacío, teclea 12,50.

## 4. `compras-tipos` · Preparar la numeración y los tipos de documento
- **Numerador** (Gestión › Maestros › Auxiliares › Numerador de documentos; el buscador superior no lo encuentra por «serie»): solo lectura de OC, PC, AC, FC. «Sin máscara» = falta el numerador del tipo.
- **Oferta** OC{INI} (… › Maestros › Documentos › Ofertas): serie OC, Activo, sin origen, Valorar Sí, Impresión No.
- **Pedido** PC{INI}: serie PC, tipo Normal, origen «Oferta compras», Copiar línea origen Sí, **Sumando**, Relación proveedor **ACR**.
- **Albarán** AO{INI} (… › Documentos › Albaranes): serie AC, Suministro, movimiento **Entrada**, cuenta origen NSAL → destino DISP, origen «Pedidos», Copiar líneas Sí, Actualizar origen Sumando, Relación proveedor ACR, Valorar Tarifa, Valoración inventario Normal, Abono No.
- **Factura** FC{INI} (… › Documentos › Tipos de facturas): serie FC (existente; el «+» de Serie no deja crear porque Rotura es obligatoria y no editable), origen «Suministros», Copiar líneas Sí, Sumando, **Tipo asiento FC** (no FCOA ni FCAD; en el bloque «Anticipos · Contabilización») y Relación proveedor ACR. Compara con FCCL y FCOA (origen Suministros) y FC (sin origen).
- Errores: «Demasiado largo» = código de más de 4 caracteres; «Hay errores…» = falta Relación proveedor.

## 5. `compras-3` · Pedir: de la oferta al pedido
- **Oferta** (Compras › Ofertas › Ofertas): tipo OC{INI}, empresa 0/CENTRAL/COMPRAS, fechas hoy, proveedor T{INI}/dirección 0, recepcionar en tercero 0 DEISTER SOFTWARE; línea 13500620, VLP 0, cantidad 10 UNIDAD, precio 12,50, **precio con IVA 15,125, importe dto. 0** (obligatorios). Validar → línea «Adjudicada».
- **Pedido** (Compras › Pedidos › Pedidos): formulario genérico, todo a mano: tipo PC{INI}, fecha, **Pedido = 0PC{INI}01 (se teclea)**, proveedor T{INI}, divisa EUR/cambio 1, tipo efecto TF, forma pago 30D, receptor 0, facturador T{INI}, Origen = la oferta.
- Opcional que falla a propósito: Oferta › Acciones › «Generar acuerdo» (tipo ACC) → «Sin máscara» del numerador `gcomacuh`. En una base bien configurada seguiría «Generación de pedidos desde acuerdos».

## 6. `compras-2` · Recibir la mercancía con el albarán
- Compras › Albaranes › Albaranes › Nuevo: tipo AO{INI}, empresa 0, almacén CENTRAL, delegación CENTRAL, departamento COMPRAS, proveedor T{INI} (copia dirección 0, TF, 30 días, EUR).
- «Origen» sale vacío en tutorial (el pedido no tiene líneas ni está validado): guardar sin origen, abrir el albarán › «Albaranes compras» › pestaña Líneas › Nuevo: 13500620, VLP 0, cantidad 10 (borra el 0,0000), precio 12,50, precio con IVA 15,125, importe dto. 0.
- Validar (botón verde): Estado Validado y el stock sube 10. Aparecen «Pasar a provisional», «Anular», «No facturable».
- Errores: «ELResolver no manejó el tipo: null…» (reescribir la cantidad) y «Hay errores…» (faltan precio con IVA / importe dto.).

## 7. `compras-albaran-contabilizar` · Contabilizar el albarán de compra
- Se usa un **albarán de la demo cuya tipología tiene plantilla de asiento**; el AO{INI} del alumno **no contabiliza**. Ejemplo de la captura: 4 uds = 50,00 (el del alumno sería 125,00).
- Albarán validado › «Contabilizar» › Fecha contabilización (la propone el ERP) › «Aceptar» → ventana del asiento y el botón pasa a «Descontabilizar».
- Asiento: **60000.00000 Compras de mercancías D 50,00** · **40090.00000 Proveedores, facturas pendientes de recibir o de formalizar H 50,00** (cuenta puente: la deuda provisional que salda la factura). Cuadre 0,00.
- Errores: no sale «Contabilizar» (no validado o ya contabilizado); error 24709 (artículo VEN: usa 13500620); la ventana del asiento solo carga bien la primera vez.

## 8. `compras-factura` · Registrar y contabilizar la factura
Hay **dos caminos** (este bloque = A; el siguiente = B). Mismo efecto neto: compra 125,00, IVA 26,25, deuda 151,25.
- **Cabecera** (Compras › Facturas › Facturas › Nuevo): tipo FC{INI}, proveedor T{INI} (rellena «Facturado por»), «Factura» vacía (la numera la serie: 0FC000001), **Factura proveedor PROV-{INI}-001** (la del papel; va a los libros de IVA), TF/30 días/EUR; «Datos financieros (2)» › Banco 0.
- **Conformar**: ficha › ⌄ junto al título › «Conformar» (solo factura en Provisional y tipología con origen Suministros): marcar el albarán validado (125,00) → «Conformar» → «Éxito»; el albarán queda «Facturado». Cerrar y **recargar** la ficha. Importe total 151,25; botones «Pasar a provisional» y «Contabilizar».
- **Contabilizar**: primero con «Prevista de Asiento Contable» marcada (no graba; abre «Esquema de Asiento Contable» con el asiento o el error) y después sin marcar. Asiento de 3 líneas en diario DC: 40000.T{INI} H 151,25 · 47200 D 26,25 · 60000 D 125,00; estado FINALIZADO; la factura pasa a Contabilizada («Descontabilizar», «Anular»).
- Errores: relación PRO inexistente; «DOMICILIACIÓN BANCARIA NO INFORMADA» (alta de Datos bancarios; luego Pasar a provisional › Banco 0 › Validar); `tipcon [VEN]`; fechas de empresa o periodo contable (revisar `cempresa` y `cejercic`).

## 9. `compras-generar-factura` · Generar la factura desde el albarán
- Albarán contabilizado › «Acciones» › **«Generar factura»**: Factura proveedor PROV-{INI}-002 e **Importe factura** (con IVA, p. ej. 60,00 declarado frente a 60,50 calculado). Sin mensaje; el albarán pasa a «Facturado». La factura se abre por ⌄ › «Facturas compras» (la lista está en caché).
- Factura generada: Validada, Validaciones 0; importe declarado ≠ calculado **no bloquea** en la demo (en una empresa real se revisa; ver `gcomfach_dif_albaran`). Líneas: 13500620, 4,000 UNIDAD, 12,500000, neto 50,00.
- Contabilizar: 5 líneas, debe = haber = 110,50: 40000.<tercero> H 60,50 · 47200 D 10,50 · 60000 D 50,00 · **40090 D 50,00** (salda el albarán) · 60000 H 50,00. Sin ese saldo la compra se contaría dos veces. Se abre desde ⌄ › «Asientos contables» (diario DC, serie 0FC).
- Errores: no sale «Generar factura» (albarán ya facturado o su tipología sin tipo de factura); «Cannot invoke Object.toString()…» (descuentos del proveedor vacíos).

## 10. `compras-abono-devolucion` · Devolución y abono del proveedor
- La corrección de una compra facturada es una **factura rectificativa**: tipología **RECT** (serie RECT, origen Facturas, Actualización **Restando**). En tutorial no hay albarán de devolución (se crearía una tipología nueva de albarán en Maestros › Documentos › Albaranes); no se pulsó «Anular».
- Crear: Facturas › Nuevo, tipo RECT, proveedor T{INI}, Factura proveedor ABO-{INI}-001, tipo efecto EF (si sale «TFEF»/«Demasiado largo», selecciona todo y elige EF), importe factura; Guardar → Provisional, número 0RECT000001. Ejemplo de ud: −12,50 − 2,63 = −15,13.
- Límite de tutorial: ⌄ › «Copiar líneas de factura» deja «Líneas origen» vacío; falta enlazar la rectificada (sin verificar cómo hacerlo). «Nuevo como» da error 17049.

## 11. `maestros-3` · Registrar y consultar el stock
- Tipología de movimiento **RIDP** «Recuento inicial en disponible» (NSAL › DISP), Gestión › Logística › Maestros › Documentos › Movimientos EAN.
- Gestión › Logística › Movimientos internos › Movimientos › Nuevo: tipo RIDP, almacén ALM{INI}, **Movimiento {INI}000001 (se teclea; la serie MOV falla con «Sin máscara» [geanmovh])**, referencia (máx. 20), línea ROD{INI}, lote 0, cantidad 10, UNIDAD; Validar.
- Consultas: Gestión › Logística › Stocks › Cuentas › **Stock global** (Filtros › Almacén ALM{INI}: 10 en DISP) y Stocks › Ubicaciones › **Traza de movimientos por artículo-ubicación** (kardex: pantalla de variables, `%` = todos; entradas 10, saldo 10). Precio y coste vacíos: el recuento inicial no se valoró; una entrada por compra traería el coste.
