# Códigos del alumno

Regla: **un código, una cosa**. Si dos bloques necesitan lo mismo, el segundo lo **reutiliza** y lo dice («Usa el tercero T{INI} que creaste en …; no crees otro»). Si son cosas distintas, llevan códigos distintos aunque vivan en tablas distintas.

`{INI}` = iniciales del alumno (2 letras, p. ej. JP). Longitudes máximas comprobadas en el diccionario Axional (campo `codigo` de cada tabla):

| Tabla (pantalla) | Máx. | Nota |
|---|---|---|
| ctipopag (Plazos de pago) | 3 | `P{INI}` cabe con 2 iniciales |
| ctipoefe (Tipos de efectos) | 3 | `R{INI}` cabe con 2 iniciales |
| galmctas (Cuentas logísticas) | 4 | `RS{INI}` |
| gcommovd / gcomfacd (tipologías de albarán / factura de compra) | 4 | `AC{INI}`, `AO{INI}`, `FC{INI}` |
| ctercero, galmacen, tagrupac | 12 | |
| garticul, carticul (artículos) | 16 | |

Con iniciales de 3 letras, en los códigos de 3 o 4 caracteres se usan solo las 2 primeras.

Glosarios: `glosario/maestros.json` y `glosario/compras.json` ya usan estos códigos. En la plataforma, el artículo que se compra es siempre el 13500620 (también en el ERP simulado: prácticas «Pedido › albarán › factura» y «Entregas parciales»).

## Maestros y Compras (cerrado)

| Código | Qué es | Dónde se crea | Dónde se reutiliza |
|---|---|---|---|
| `C{INI}` | Tercero **cliente** «Cliente Maestros {INI}» (antes `{INI}1`) (NIF de prueba B12345674, categoría 001) | Maestros › maestros-1 «Terceros» | maestros-1 (perfil contable 43000.00901), maestros-2 (cliente y comercial en Gestión, condiciones de cobro), maestros-v-4 (identificación de la empresa S{INI}) |
| `FOR{INI}` | Artículo financiero «Servicios de formacion {INI}» (antes `{INI}`) | maestros-1 «Artículos financieros» | — |
| `P{INI}` | Plazo de pago 30/60 días (50 % / 50 %) «2 Vtos. 30 y 60 dias {INI}» (antes `{INI}1`) | maestros-1 «Plazos de pago» | maestros-2 (condición de cobro de C{INI}). Ventas pasó su pedido a `PV{INI}` y Cartera usa `V{INI}` para su plazo 40/80/120 |
| `R{INI}` | Tipo de efecto **a cobrar** «Recibo domiciliado {INI}» (antes `{INI}`) | maestros-1 «Tipos de efectos» | maestros-2 (condición de cobro de C{INI}) |
| `43000.00901` | Subcuenta de cliente de C{INI} (si existe, la siguiente libre) | maestros-1 «Cuentas contables» | maestros-1 «Perfil contable» |
| `{INI}CAJA` | Cuenta financiera de caja (57000.00000) | maestros-1 «Bancos y cajas» | — |
| `AG{INI}` | Agrupación de tesorería «Cajas Maestros {INI}» (antes `{INI}`) | maestros-1 «Bancos y cajas» | maestros-v-4 (banco CAIXA{INI}), Cartera (BBVA_{INI}, CAJA_{INI}) |
| `08{INI}1` | Código postal / municipio de prueba | maestros-1 «Municipios» | — |
| `ROD{INI}` | Artículo logístico «RODAMIENTO MAESTROS {INI}» (antes `{INI}0001`, chocaba con el código auxiliar de Contabilidad; para aprender la ficha, **no se compra**) | maestros-2 «Artículos logísticos» | maestros-2 (artículo del proveedor 00001, REF-{INI}-6000), maestros-3 (movimiento, stock, kardex); ERP simulado práctica «Crea y activa tu artículo» |
| `ALM{INI}` | Almacén «Almacen Maestros {INI}» (antes `{INI}1`) | maestros-2 «Almacenes» | maestros-3 |
| `RS{INI}` | Cuenta logística «Stock reservado Maestros {INI}» (antes `{INI}1`) | maestros-2 «Cuentas logísticas» | — |
| `{INI}000001` | Número del movimiento interno RIDP (a mano) | maestros-3 | maestros-3 (kardex) |
| `S{INI}` | Empresa «Empresa prácticas {INI}» | maestros-v-4 | — |
| `CAIXA{INI}` | Banco propio de la empresa S{INI} | maestros-v-4 | — |
| `T{INI}` | Tercero **proveedor** «Tercero {INI}» (No censado, Id. 0, categoría 002) y su ficha de proveedor | Compras › compras-1 «Tercero» y «Proveedor» | compras-2, compras-3, Ventas (lo da de alta como cliente: mismo tercero), Cartera **no** (usa su tercero CAR{INI}), ERP simulado (prácticas de compras y pago) |
| `TF{INI}` | Lista de precios de compra (tarifa) | compras-1 | compras-1 (grupo G{INI}) |
| `G{INI}` | Grupo de precios de compra | compras-1 | compras-1 (proveedor T{INI}) |
| `13500620` | Artículo **de la demo** que se compra (6000-2RS ISB, tipo contable PRODUCTO). No se modifica | ya existe | compras-1 (tarifa), compras-2 y compras-3 (oferta, albaranes, factura), Ventas, ERP simulado (pedido › albarán › factura) |
| `AC{INI}` | Tipología de albarán de compra sin origen (antes `A{INI}`, chocaba con la de Ventas) | compras-2 | compras-2 |
| `FC{INI}` | Tipología de factura de compra | compras-2 | compras-2, compras-3 |
| `OC{INI}` | Tipología de oferta de compra | compras-3 | compras-3 |
| `PC{INI}` | Tipología de pedido de compra | compras-3 | compras-3 |
| `0PC{INI}01` | Número del pedido (a mano, formulario genérico) | compras-3 | compras-3 |
| `AO{INI}` | Tipología de albarán de compra con origen pedido | compras-3 | compras-3 |
| `PROV-{INI}-001` / `-002` | Número de factura del proveedor | compras-2 / compras-3 | Cartera (pago de la factura) |

## Cartera, Ventas, Tesorería, Contabilidad, Impuestos y Activos (cerrado)

Longitudes comprobadas en el diccionario (wic_table_object): `tlinefin.linfin` 12, `tlinetip.codigo` 6, `cdiarios.codigo` **2**, `cjusnumh.mask_code` 6, `cproyect` / `cseccion` 12, `cctaauxl.ctaaux` 14.

### Cartera (carteras.json)

| Código | Qué es | Dónde se crea | Dónde se reutiliza |
|---|---|---|---|
| `V{INI}` | Plazo de pago 40/80/120 días (40/20/40 %) (antes `{INI}1`) | carteras-1 «Plazo de pago» | condición de pago de CAR{INI}, factura CAR-{INI}-001 |
| `E{INI}` | Tipo de efecto **a pagar**, transferencia (antes `T{INI}`, chocaba con el tercero) | carteras-1 «Tipo de efecto» | condición de pago de CAR{INI}, efectos de la factura, ERP simulado (datos de cartera) |
| `CAR{INI}` | Tercero «Tercero Carteras», cliente CLI 43000 y proveedor PRO 40000 (antes `T{INI}`). **No es el proveedor T{INI} de Compras**: lleva otras condiciones (E{INI}+V{INI}, cobro RC/PE/30D) y así no se tocan las de Compras | carteras-1 «Tercero» | carteras-1 (factura de compra), carteras-5 (factura de venta, cobro y remesa) |
| `CAR-{INI}-001` | Número de factura del proveedor CAR{INI} (antes `PROV-{INI}-001`, repetía el de Compras) | carteras-1 | — |
| `B{INI}` | Tercero entidad financiera «BBVA Carteras {INI}» | carteras-3 | banco BBVA_{INI}, caja CAJA_{INI} |
| `BBVA_{INI}` | Banco propio (57200) | carteras-3 | carteras-5, Tesorería (todo), examen práctico |
| `CAJA_{INI}` | Caja de efectivo (57000). Es otra caja, distinta de `{INI}CAJA` de Maestros | carteras-3 | Tesorería (cajas) |
| `AG{INI}` | Agrupación de tesorería **de Maestros**: se reutiliza, no se crea otra (antes Cartera creaba `{INI}`) | Maestros › maestros-1 | BBVA_{INI}, CAJA_{INI} |
| `ASE{INI}` | Artículo financiero «Servicios de asesoría {INI}» (antes `{INI}1`) | carteras-5 | facturas de venta de carteras-5 |
| `LRC{INI}` | Línea financiera «Remesas de cobro {INI}» de BBVA_{INI} (antes `{INI}1`) | carteras-5 | remesas por cuenta |
| `REM{INI}` | Tipo de línea financiera «Remesas cobro {INI}» (antes `{INI}`) | carteras-5 | LRC{INI} |
| `CONTRATO-{INI}-001` | Referencia de la línea financiera | carteras-5 | — |

### Ventas (ventas.json)

| Código | Qué es | Dónde se crea | Dónde se reutiliza |
|---|---|---|---|
| `T{INI}` | **El proveedor de Compras**: Ventas lo da de alta como cliente, no crea otro tercero | Compras › compras-1 | ventas-1, ventas-2 |
| `A{INI}` / `A{INI}2` | Tipologías de albarán de venta (sin origen / desde pedido) | ventas-1 / ventas-2 | F{INI}, examen práctico |
| `F{INI}` | Tipología de factura de venta | ventas-1 | ventas-2, examen práctico |
| `O{INI}` | Tipología de oferta de venta | ventas-2 | examen práctico |
| `PV{INI}` | Tipología de pedido de venta (antes `P{INI}`, chocaba con el plazo de Maestros) | ventas-2 | examen práctico (lib/examen.ts) |

### Tesorería (tesoreria.json)

| Código | Qué es | Dónde se crea | Dónde se reutiliza |
|---|---|---|---|
| `BBVA_{INI}`, `CAJA_{INI}` | Los de Cartera (no se crean otros) | carteras-3 | tesoreria-1 a 6 |
| `{INI}COM` | Flujo financiero «Comisión» y su operación financiera de salida (mismo código a propósito: la operación usa ese flujo) | tesoreria-2 | tesoreria-3, 4 |

### Contabilidad general (icon-contabilidad.json)

| Código | Qué es | Dónde se crea | Dónde se reutiliza |
|---|---|---|---|
| `62999.00000` | Cuenta «Gastos varios {INI}» | parametrizacion-1 | parametrizacion-2, 4 |
| `{INI}EMP` / `{INI}0001` | Grupo auxiliar «Empleados {INI}» / código auxiliar «José Gómez» | parametrizacion-3 | parametrizacion-4 |
| `DIV{INI}` | Proyecto «División 1 {INI}» (antes `{INI}1`) | parametrizacion-5 | parametrizacion-6, asientos |
| `{INI}ADM` | Sección «Administración {INI}» | parametrizacion-6 | proyecto DIV{INI} |
| `{INI}` | Diario «Entrada de asientos {INI}» (el código del diario solo admite 2 caracteres) y su numerador de justificantes «Asientos manuales {INI}» | asientos-1 / asientos-2 | asientos-2 a 13 |
| `{INI}-DOC-001`, `{INI}26-000001` | Documento y justificante de los asientos manuales | asientos-2 | — |

### Impuestos y Activos

Sin códigos propios del alumno (solo `{INI}` en notas de factura de Impuestos).

## Otros módulos (solo leídos, no editados)

| Código | Módulo | Qué es |
|---|---|---|
| `A{INI}`, `A{INI}2`, `F{INI}`, `PV{INI}`, `O{INI}` | Ventas | Tipologías de venta (ver tabla de Ventas) |
| `DIV{INI}` | Contabilidad (icon-contabilidad) | Proyecto «División 1 {INI}» |
| `{INI}EMP`, `{INI}0001` | Contabilidad | Grupo auxiliar y código auxiliar «José Gómez» (por eso el artículo de Maestros pasa a ROD{INI}) |
| `{INI}ADM` | Contabilidad | Sección |
| `{INI}COM` | Tesorería | Flujo y operación financiera |

## Colisiones de Cartera

Resueltas (ver la tabla de Cartera): plazo `V{INI}`, tipo de efecto `E{INI}`, artículo `ASE{INI}`, línea `LRC{INI}` y tercero propio `CAR{INI}` (no se reutiliza T{INI} para no cambiar las condiciones de pago y cobro del proveedor de Compras; la factura de Cartera va a la cuenta PRO 40000 y la de Compras a ACR 41000).
