## 1. Resumen
La sesión explica cómo el módulo TAX de Axional calcula y parametriza impuestos a partir de las líneas de factura y de las tablas maestras fiscales. Cristóbal repasa la teoría: hasta cuatro impuestos por línea, sumarización en comprobantes y mapeo a operaciones/tipos para declaraciones. Presenta los maestros del módulo C-TAX: periodos fiscales, agencias, operaciones, tipos/clases, zonas, claves fiscales y reglas de asignación. Detalla la caracterización fiscal de empresa, tercero y documento: NIF/RUC, zona impositiva, clave de artículo, clave de documento y régimen. Marlon entra a Finanzas › Impuestos › Maestros y muestra C-Tax Rule como tabla maestra de cálculo. Con una factura de compra de ALA-Telefónica comprueba la regla 2586, que calcula IVA 21% y desglosa base, cuota y total. Después cambia la zona del tercero y añade dos artículos con claves fiscales distintas para ver las reglas 1477 y 1479, con impuestos por línea y por documento. Cierra con variantes de Perú y preguntas finales.

## 2. Capítulos

`0 | 504 | Modelo fiscal, periodos y agencias`
- `0s | Detalle de impuestos en líneas de factura`
- `55s | Sustentos tax y referencia catastral en documentos`
- `117s | Operación fiscal y tipo de impuesto`
- `135s | Modelo 303 y PDT 621`
- `227s | Capítulos, grupos y líneas de declaración`
- `286s | Periodos fiscales y agencias tributarias`

`504 | 957 | Origen de datos y maestros del módulo TAX`
- `504s | Origen de datos: compras, ventas y tesorería`
- `603s | Maestros de operaciones, tipos y clases`
- `702s | Claves fiscales de artículo, tercero y documento`
- `733s | Zonas fiscales y equivalencias con tablas antiguas`
- `820s | Reglas de mapeo: antigua CZOPEIM a CTAX`
- `903s | C-Taxter Shift, bienes inmuebles y grupos de IVA`

`957 | 1440 | Datos fiscales en maestros y entrada al módulo`
- `957s | Identificación fiscal y zona de empresa`
- `1008s | NIF/RUC, país, tipo y régimen en tercero`
- `1170s | Esquemas fiscales y regímenes del tercero`
- `1250s | Entrada al menú Finanzas › Impuestos › Maestros`
- `1382s | C-Tax Rule como tabla maestra de reglas`

`1440 | 1920 | Factura de compra y regla 2586`
- `1440s | Regla 1137: ID, campos y condicionantes`
- `1534s | Zona impositiva de empresa`
- `1646s | Zona impositiva en direcciones del tercero`
- `1733s | Clave fiscal BOG en maestro de artículos`
- `1804s | Factura ALA-Telefónica y material deportivo`
- `1842s | Pestaña impuestos: CLBC, SG y regla 2586`

`1920 | 2190 | Tipo de impuesto: porcentaje y base`
- `1920s | Regla 2586: clase IVA, vigencia y prioridad`
- `1988s | Código de operación para la declaración`
- `2026s | Tax Type SG: IVA general 21%`
- `2074s | Base de cálculo: importe neto o previos`
- `2103s | Mnemotécnicos y cuentas contables del impuesto`

`2190 | 2550 | Prueba de zona y nueva factura`
- `2196s | Motivo de aplicación de la regla 2586`
- `2248s | Cambio de zona del tercero a ESCO`
- `2310s | Nueva factura de compra FC con empresa ALA`
- `2358s | Línea de artículo a 1200 euros`
- `2430s | Validación y lectura de impuestos por documento`
- `2499s | Regla 1477 para zona ESCO`

`2550 | 2970 | Impuestos por línea y por documento`
- `2550s | Error si no existe regla para la combinación`
- `2593s | Artículo con clave fiscal SOR`
- `2650s | Segunda línea de 800 euros con clave diferente`
- `2758s | Validación y reglas 1477 y 1479 por línea`
- `2830s | Impuestos por línea y resumen por documento`
- `2913s | Destino a tablas base para declaraciones`

`2970 | 3267 | Variantes Perú y preguntas finales`
- `2970s | Variantes de claves de documento en SUNAT`
- `3030s | Régimen del tercero y tipo de RUC`
- `3178s | Pregunta sobre multisede y zonas fiscales`
- `3239s | Zonas en empresa y direcciones de tercero`

Tramo muerto descartado: `21:14-21:28` por espera de compartición de pantalla.