# Datos básicos de contabilidad (bloque maestros-1)

Fuente: `icon-contabilidad.json` › `maestros-1` (48 KB, el bloque más largo), `_fuente/CODIGOS_ALUMNO.md`. Los maestros son fichas que se crean una vez y se reutilizan en todas las facturas, efectos y asientos: si la ficha está mal, el error se copia en cada documento.

## Índice
Tercero · Artículo financiero · Cambio de divisa · Plazo de pago · Tipo de efecto · Subcuenta del cliente y perfil contable · Caja y agrupación · Municipio

Objetivo del bloque: dar de alta al cliente **C{INI}** con su cuenta, su plazo **P{INI}** y su recibo **R{INI}**, para facturarle y cobrarle la venta de 242,00 en dos efectos de 121,00. En la demo se trabaja dentro de la empresa 0.

## Tercero (Finanzas › Maestros › Terceros › Registro terceros, `ctercero`)
- Alta: «Añadir tercero». Tercero `C{INI}`, Nombre, Nombre comercial «Maestros {INI}», País ES, Tipo ID fiscal NIF-Empresa, Id. fiscal de prueba B12345674, Categoría **001 Clientes** (propone relación CLI y cuenta 43000), Clave fiscal RGEN.
- Nace «Provisional» y así no se puede usar en documentos: pulsa **«Validar»**. **Cualquier cambio posterior** en sus pestañas (relaciones, condiciones de cobro…) lo devuelve a Provisional: vuelve a validar.
- Pestañas: Relaciones, Datos bancarios, Condiciones de pago/cobro, Direcciones. Relación contable: «Añadir relación» (tipo Cliente, relación CLI, plan ES, cuenta 43000.00000). **Trampa**: en la fila editable de la pestaña Relaciones no se ve el Plan contable y al guardar queda en rojo; usa el botón «Añadir relación» (abre la ventana con todos los campos). Si ya hay una fila Cliente/CLI propuesta por la categoría, no la dupliques: ábrela y revisa.
- Dirección 0 «domicilio fiscal» con CP 08001 (rellena provincia 08 y población).
- Después, en Gestión, el mismo tercero se da de alta como cliente/proveedor.

## Artículo financiero (Finanzas › Facturación › Maestros › Artículos, `carticul`)
- Concepto de factura sin existencias: `FOR{INI}` «Servicios de formacion {INI}», Tipo fiscal Servicio, Clave fiscal SOG, mnemotécnicos 62300 (compras) y 70500 (ventas), datos contables «Todo». Existentes: Alquiler, Bienes, Inversión, Servicios, Suplido.

## Cambio de divisa (Finanzas › Maestros › Auxiliares › Monedas › Cambios diarios, `ccambios`)
- Práctica USD › EUR: base 1,000000, spot 0,920000, compra 0,910000. En el caso todo va en euros. Sin cambio para fecha y divisa, el documento en esa moneda no se puede contabilizar.

## Plazo de pago (Finanzas › Maestros › Terceros › Condiciones administrativas › Plazos de pago, `ctipopag`)
- `P{INI}` «2 Vtos. 30 y 60 dias {INI}»: Tipo cálculo **Variable**, Unidad Días, 30/50 % y 60/50 %. **Trampa**: tercer y cuarto plazo y sus % son obligatorios aunque no se usen: escribe 0 (si no, «Hay errores en los datos del formulario»). Código de 3 caracteres como máximo.
- Con él, 242,00 se parte en dos efectos de 121,00. El plazo solo guarda vencimientos; el tipo de efecto se combina con él en «Condiciones de cobro/pago» del tercero (lo haces en `erp-next-maestros`/Gestión).

## Tipo de efecto (Finanzas › Cobros y Pagos › Maestros › Efectos › Tipos, `ctipoefe`)
- `R{INI}` «Recibo domiciliado {INI}»: Clase Cobrar, estado inicial PE, domiciliación **Tercero** (pide el IBAN del cliente), días decalaje 2, días post-pago 4, Riesgo marcado, Fecha operación Vencimiento, código fiscal «Domiciliación bancaria». Máximo 3 caracteres.
- Decide si hace falta cuenta bancaria del tercero, cuándo entra el efecto en la previsión de tesorería y si cuenta para el riesgo del cliente.

## Subcuenta del cliente y perfil contable
- Cuentas contables: `43000.00901` «Cliente Maestros {INI}», Terceros, Activa `IEV`, Activar Ambos (copia la forma de las 43000* existentes). Si ya existe (la base es compartida), usa la siguiente libre (43000.00902) y úsala en todos los pasos.
- Finanzas › Maestros › Terceros › Perfil contable («Relaciones contables con terceros»; una fila por tercero, tipo y relación): abre la fila de C{INI} (Tipo relación Clientes), cambia la Cuenta de 43000.00000 a 43000.00901 y guarda con el disquete (si no sale la lista, borra y reescribe el último dígito). Después **vuelve a Validar** el tercero.

## Caja y agrupación (Finanzas › Cobros y Pagos › Maestros › Auxiliares › Bancos propios, `cbancpro`)
- `{INI}CAJA` «Caja Maestros {INI}», empresa 0, proyecto 0, sección 0, Tipo de cuenta «Caja de efectivo», entidad 0, dirección 0, cuenta 57000.00000, formato AEB43. Bancos y cajas comparten pantalla; los distingue el «Tipo de cuenta». Sin IBAN en una caja. **Nunca escribas IBAN reales.**
- **«Agrupación cuentas» es obligatoria** y puede salir vacía («Datos no disponibles»): crea antes la tuya en Finanzas › Tesorería › Maestros › Agrupaciones («Añadir grupo»: Tipo Cuenta, `AG{INI}`, «Cajas Maestros {INI}»). Una agrupación es la carpeta en la que Tesorería junta cuentas. Banco 572, caja 570.
- Los banco propios del caso (BBVA_{INI}, CAIXA{INI}) se crean en Tesorería y Maestros.

## Municipio y código postal
- El alta del CP **no** existe en «Municipios y Poblaciones» (solo consulta; el desplegable de CP tampoco tiene «+»). Se hace en la ficha del país: Finanzas › Maestros › Terceros › Localización › Países › España › pestaña «Municipios y poblaciones» › «Añadir municipio»: provincia 08, población «Poblacion Maestros {INI}», CP de prueba `08{INI}1`. El Id. municipio lo asigna el sistema.

## Resultado esperado (checklist del bloque)
Tercero C{INI} Validado con relación CLI y dirección 0 · FOR{INI} en la lista · cambio USD › EUR · plazo P{INI} 50/50 a 30 y 60 · tipo R{INI} · 43000.00901 en el perfil contable sin aviso de cuenta compartida · {INI}CAJA con 57000.00000 y AG{INI} · municipio 08{INI}1.
