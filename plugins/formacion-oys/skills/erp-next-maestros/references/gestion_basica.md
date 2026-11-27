# Datos básicos de gestión (`maestros-2`) y stock (`maestros-3`)

Fuentes: `app/src/content/compras.json` (ids `maestros-2`, `maestros-3`), `etapas.ts` (compras › «Maestros de compra» y «Devolver y controlar el stock»), `_fuente/CODIGOS_ALUMNO.md`. Ruta raíz «Gestión».

## Índice
1. Cliente en Gestión y condiciones de cobro
2. Artículo logístico ROD{INI}
3. Artículo por proveedor
4. Almacén ALM{INI}
5. Cuenta logística RS{INI}
6. Stock: movimiento, stock global, kardex (`maestros-3`)
7. Errores

Requisitos: haber hecho `maestros-1` (C{INI}, P{INI}, R{INI}). No se crea ningún tercero nuevo.

## 1. Cliente en Gestión — «Gestión › Maestros › Terceros › Clientes › Registro»
«Nuevo»: Cliente **C{INI}**, Comercial **C{INI}** (en la demo el comercial también es un tercero), Tipo cliente **0 GENERAL**, Agrupación empresas ALL (propuesta). Facturación y Cobros vienen propuestos (C{INI} / dirección 0, Mensual, 1 Albarán-1 Factura). «Datos financieros» › Divisa **EUR**. Guardar: aparece en el Maestro de clientes, Activo (la plataforma lo muestra «Provisional» en el campo y «Activo» en el paso: sin verificar cuál es el estado final real). Ventas usa **este** cliente: no se crea otro.
**Condición de cobro**: ficha del tercero C{INI} (Finanzas) › pestaña «Condiciones de cobro» › «Añadir cobro»: Tipo efecto **R{INI}**, Estado **PE**, Plazo **P{INI}**; guardar y «Validar» de nuevo. Queda «2 Vtos. 30 y 60 dias {INI}».

## 2. Artículo `ROD{INI}` — «Gestión › Maestros › Artículos › Registro»
«Nuevo»: Artículo **ROD{INI}** (ROD de rodamiento; antes `{INI}0001`, que chocaba con el código auxiliar de Contabilidad), Descripción «RODAMIENTO MAESTROS {INI}» (se guarda en mayúsculas), Unidad base UNIDAD (UNI), Agrupación ALL, Tipo ARTICULOS, **Familia 01.01.001352** (teclear el código exacto y Tab: el desplegable no muestra opciones; los códigos están en «Gestión › Maestros › Artículos › Auxiliares › Familias»); se rellenan clave fiscal **BOG** (IVA 21 %) y naturaleza Bien; Stock Sí / Diferencias albaranes No / Tipo descripción Fija. Guarda, búscalo con Filtros › Descripción, abre la ficha y «Validar» (el menú Operación ofrece Copiar y Cambiar unidad base). **Es para aprender la ficha y el stock; no se compra.**
El artículo que **se compra** es siempre el **13500620** (6000-2RS ISB, tipo contable **PRODUCTO**, BOG, Activo), que ya existe y no se modifica; casi todos los demás artículos de la demo tienen tipo contable Ventas, que da «… tipcon [VEN] cuenta no definida» al contabilizar una compra (`compras-1`, sección «Artículo que vas a comprar»).

## 3. Artículo por proveedor — «Gestión › Maestros › Terceros › Proveedores › Registro»
«Artículos por proveedores» abierto directamente es de solo consulta. Abre el proveedor **00001 PROVEEDOR** › pestaña «Artículos por proveedor» › «Nuevo»: Artículo ROD{INI}, casilla **Asignado**, Prioridad 1, Referencia proveedor **REF-{INI}-6000**, Descripción proveedor «Rodamiento 6000 segun catalogo proveedor», Dirección 0; Estado Activo y % reparto 0,00 propuestos. Guardar. (No se modifican las condiciones del 00001: solo se añade una línea propia.)

## 4. Almacén `ALM{INI}` — «Gestión › Logística › Maestros › Almacenes › Almacenes logísticos»
«Nuevo»: Almacén **ALM{INI}**, «Almacen Maestros {INI}», Recinto **0 RECINTO CENTRAL**, Empresa **0**, Agrupación ALL, Tercero asociado 0 y Tipo dirección 0 (rellenan país, CP, población). «Información general»: **Delegación CENTRAL y Departamento COMPRAS** (no llevan asterisco, pero sin ellos los movimientos fallan con «Delegación y departamento no informados para el almacén [ALM{INI}]»). «Valoración»: **FIFO** (alternativa: Medio) y Fecha última valoración 01-01-2026. Guardar y «Validar». Stock negativo No, Rupturas Ninguno.

## 5. Cuenta logística `RS{INI}` — «Gestión › Logística › Maestros › Cuentas logísticas › Registro»
«Nuevo»: **RS{INI}**, «Stock reservado Maestros {INI}» (código máx. 4: justo). «Indicativos»: Contabilizar, Valoración, Adjudicación y Planificar marcados; Calidad sin marcar. «Disponibilidad»: Saldo Sí, Rupturas Ninguno. Existen CALI, CUA, DISP, NSAL y TRAN. Ningún bloque posterior la reutiliza (solo para aprender).

## 6. Stock (`maestros-3`)
1. Tipología **RIDP** en «Gestión › Logística › Maestros › Documentos › Movimientos EAN»: pasa stock de **NSAL** (fuera de inventario) a **DISP** (disponible).
2. «Gestión › Logística › Movimientos internos › Movimientos» › «Nuevo»: Tipo movimiento RIDP, Almacén origen ALM{INI}. La serie **MOV** no tiene máscara en la demo («gsernumh_getserie: Sin máscara. Tab.[geanmovh] Cod.[MOV]»): teclea el número **{INI}000001** en «Movimiento» y una referencia («Inventario inicial»). La delegación y el departamento los toma del almacén (por eso se rellenan en el alta).
3. Pestaña «Líneas de movimiento» (al final) › «Nuevo»: Artículo ROD{INI} (Tab), cantidad **10**; cuentas NSAL › DISP, lote 0 y unidad se rellenan solos. Si sale «ELResolver no manejó el tipo: null…», cierra el aviso y reescribe la cantidad (no siempre aparece). «Validar»: el estado pasa a Validado y se actualiza el stock.
4. **Stock global** («Gestión › Logística › Stocks › Cuentas › Stock global»): Filtros › Almacén ALM{INI}: cuenta DISP, 10 unidades disponibles.
5. **Kardex** («… › Stocks › Ubicaciones › Traza de movimientos por artículo-ubicación», pantalla de variables): Almacén ALM{INI}, Artículo ROD{INI}, fecha inicial el día 1 del mes, fecha fin hoy; resultado: un RIDP «Recuento inicial en disponible», documento {INI}000001, entradas 10, salidas 0, saldo 10.

## 7. Errores
Familia vacía → código exacto y Tab. Artículo no visible tras guardar → ~25 filas, usa Filtros. «Artículos por proveedores» sin botón de alta → desde el proveedor. Almacén sin delegación/departamento → rellenarlos y repetir el movimiento. Serie MOV sin máscara → número a mano. Pantalla no encontrada → buscador con `clientes`, `garticul`, `galmacen`.
