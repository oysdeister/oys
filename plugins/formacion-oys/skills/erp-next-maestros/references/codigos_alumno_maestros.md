# Códigos del alumno en Maestros y Compras

Fuente única: `_fuente/CODIGOS_ALUMNO.md` (sección «Maestros y Compras (cerrado)»). `{INI}` = 2 letras (primera del nombre + primera del primer apellido; sin tildes; una sola palabra → sus 2 primeras letras). «Un código, una cosa».

## Longitudes máximas comprobadas
Plazos de pago `P{INI}`, `V{INI}` y tipos de efecto `R{INI}`, `E{INI}`: 3 · cuenta logística `RS{INI}`: 4 · tipologías de compra y de venta: 4 · diario: 2 · empresa: 4 (`S{INI}`: 3) · cuenta financiera: 10 · ctercero, galmacen, tagrupac: 12 · artículos: 16 · lista/grupo de precios de venta: 12. Textos: la descripción del rol de workflow admite 20 caracteres.

## Maestros (los que crea esta skill)
| Código | Qué es | Dónde se crea | Dónde se reutiliza |
|---|---|---|---|
| `TS{INI}` | Tercero de la empresa (NIF B76543214), no es cliente ni proveedor | `maestros-v-4` | identificación social de `S{INI}` |
| `S{INI}` | Empresa «Empresa prácticas {INI}» | `maestros-v-4` | — |
| `CAIXA{INI}` | Banco propio de S{INI} (agrupación CA) | `maestros-v-4` | — |
| `C{INI}` | Tercero cliente (NIF B12345674, categoría 001) | `maestros-1` | `maestros-2`, Ventas (cliente del caso) |
| `43000.00901` | Subcuenta de cliente | `maestros-1` | perfil contable de C{INI} |
| `FOR{INI}` | Artículo financiero «Servicios de formacion {INI}» | `maestros-1` | — |
| `P{INI}` | Plazo 30/60 días 50/50 «2 Vtos. 30 y 60 dias {INI}» | `maestros-1` | condición de cobro de C{INI} |
| `R{INI}` | Tipo de efecto a cobrar «Recibo domiciliado {INI}» | `maestros-1` | condición de cobro de C{INI} |
| `{INI}CAJA` | Caja 57000.00000 | `maestros-1` | — |
| `AG{INI}` | Agrupación de tesorería «Cajas Maestros {INI}» | `maestros-1` | CAIXA{INI}, BBVA_{INI}, CAJA_{INI} |
| `08{INI}1` | CP/municipio de prueba | `maestros-1` | — |
| `ROD{INI}` | Artículo logístico «RODAMIENTO MAESTROS {INI}» (no se compra) | `maestros-2` | `maestros-2` (artículo por proveedor), `maestros-3` |
| `REF-{INI}-6000` | Referencia del proveedor 00001 para ROD{INI} | `maestros-2` | — |
| `ALM{INI}` | Almacén «Almacen Maestros {INI}» | `maestros-2` | `maestros-3` |
| `RS{INI}` | Cuenta logística «Stock reservado Maestros {INI}» | `maestros-2` | — |
| `{INI}000001` | Número del movimiento RIDP (a mano) | `maestros-3` | kardex |

## Compras (los que usan los maestros)
`T{INI}` proveedor «Tercero {INI}» (No censado, Id. 0, categoría 002; `compras-1`), `TF{INI}` lista de precios de compra y `G{INI}` grupo (`compras-precios`), `FC{INI}`, `OC{INI}`, `PC{INI}`, `AO{INI}` tipologías de compra (`compras-tipos`; `AC{INI}` ya no la crea ningún bloque), `PW{INI}`, `GW{INI}`, `RW{INI}`, `WF{INI}` (workflow de pedidos), `PROV-{INI}-001/-002` números de factura del proveedor. Artículo comprado: **13500620**. Proveedor de la demo para el artículo por proveedor: **00001 PROVEEDOR**.

## Otros módulos que reutilizan maestros
Ventas: `C{INI}`, y `LV{INI}`/`GV{INI}`, `O{INI}`, `PD{INI}`, `PV{INI}`, `AP{INI}`, `A{INI}`, `FP{INI}`. Cartera: `V{INI}`, `E{INI}`, `CAR{INI}`, `B{INI}`, `BBVA_{INI}`, `CAJA_{INI}`. Tesorería: `{INI}COM`, `{INI}TRF`. Contabilidad: `{INI}001`, `{INI}626`, `DIV{INI}`, `{INI}ADM`, diario `{INI}`.

## Iniciales de prueba ZZ
`ZZ` solo aparece como alumno de prueba en el fichero `app/public/n43/caso_BBVA_ZZ.n43` y en Activos (`ZZORD`, comprobado en la demo). Las capturas y pruebas del autor usan registros `CAP…` (ver `navegar-erp-next`).
