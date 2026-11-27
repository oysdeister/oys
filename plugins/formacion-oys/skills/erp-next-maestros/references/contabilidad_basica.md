# Datos básicos de contabilidad (`maestros-1` en `icon-contabilidad.json`)

Fuentes: `app/src/content/icon-contabilidad.json` (bloque `maestros-1`, 8 secciones), `etapas.ts` (icon-contabilidad › «Datos básicos que usarás después»), `_fuente/CODIGOS_ALUMNO.md`. Los usan Ventas y Cartera.

## Índice
1. Tercero cliente C{INI}
2. Artículo financiero FOR{INI}
3. Cambio de divisa
4. Plazo de pago P{INI}
5. Tipo de efecto R{INI}
6. Cuenta 43000.00901 y perfil contable
7. Caja {INI}CAJA y agrupación AG{INI}
8. Municipio 08{INI}1
9. Errores

## 1. Tercero cliente `C{INI}` — «Finanzas › Maestros › Terceros › Registro terceros»
«Añadir tercero»: Tercero C{INI}; Nombre (el del alumno); Nombre comercial «Maestros {INI}»; País ES; Tipo ID NIF-Empresa; Id. fiscal **B12345674** (de prueba); «Más datos»: Categoría **001 Clientes** (propone relación CLI y cuenta 43000); Clave fiscal RGEN. Guardar → «Ver registro». Pestaña **Relaciones** › «Añadir relación»: Cliente / CLI / plan ES / cuenta 43000.00000 (si ya hay una fila Cliente/CLI, no la dupliques). Direcciones: CP 08001 + dirección (dirección 0). «Validar» → Validado (aparecen Cerrar y Activar). El tercero nace Provisional, cobros y pagos Abiertos.

## 2. Artículo financiero `FOR{INI}` — «Finanzas › Facturación › Maestros › Artículos»
«Añadir artículo»: Descripción «Servicios de formacion {INI}», Tipo fiscal Servicio, Clave fiscal **SOG**, mnemotécnicos compras **62300** y ventas **70500**; Unidad UN y Estado Abierto se proponen; datos contables «Todo». No se factura nada con él: es para aprender la ficha.

## 3. Cambio de divisa — «Finanzas › Maestros › Auxiliares › Monedas › Cambios diarios»
«Añadir cambio divisa»: fecha de hoy, Base 1,000000, Moneda origen USD, Cambio spot 0,920000, Divisa EUR, Compra 0,910000. Resultado 1 USD = 0,92 EUR. «Datos de control» confirma quién y cuándo.

## 4. Plazo de pago `P{INI}` — «Finanzas › Maestros › Terceros › Condiciones administrativas › Plazos de pago»
«Añadir plazo»: código **P{INI}** (máx. 3), Descripción «2 Vtos. 30 y 60 dias {INI}», Tipo cálculo **Variable**, Unidad Días; Primer plazo 30 / 50 %, Segundo 60 / 50 %, **Tercero y Cuarto 0 con 0 %** (obligatorios aunque no se usen). Con él, una factura de 242,00 se parte en dos efectos de 121,00.

## 5. Tipo de efecto `R{INI}` — «Finanzas › Cobros y Pagos › Maestros › Efectos › Tipos»
«Añadir tipo efecto»: Clase **Cobrar**, Tipo efecto R{INI} (máx. 3), Descripción «Recibo domiciliado {INI}», Estado inicial **PE** (Pendiente), Domiciliación bancaria «Tercero», Días decalaje 2, Días post-pago 4, Interés 0 / Riesgo Sí / Factura demora No; «Tesorería»: Fecha operación «Vencimiento»; «Clasificación»: código fiscal «Domiciliación bancaria». Es el tipo con el que se cobrarán los dos efectos de 121,00.

## 6. Cuenta `43000.00901` y perfil contable — «Finanzas › Maestros › Cuentas contables › Cuentas contables»
Se abre en consulta: Cuenta = `43000*` › «Ejecutar consulta». «Añadir cuenta»: plan PGE 2008, cuenta **43000.00901**, descripción «Cliente Maestros {INI}», Tipo **Terceros**, Activa **IEV**, Activar **Ambos** (el resto se propone: Debe, Abierto, Standard, 999 días, Periodificable No). Si la 00901 ya existe en la demo, usa la siguiente libre. Después «Finanzas › Maestros › Terceros › Perfil contable»: abre la fila de C{INI} con tipo relación Clientes y cambia la cuenta de 43000.00000 a 43000.00901 (guardar con el disquete; para que salga la lista borra y reescribe el último dígito). El aviso «Cuenta contable en operación…» de la 43000.00000 es la señal de que conviene una subcuenta propia. **El tercero vuelve a Provisional: «Validar».**

## 7. Caja `{INI}CAJA` y agrupación `AG{INI}`
«Finanzas › Cobros y Pagos › Maestros › Auxiliares › Bancos propios» › «Añadir bancos propios»: Empresa 0, Proyecto 0, Sección 0, Cuenta financiera **{INI}CAJA** (máx. 10), «Caja Maestros {INI}», Tipo «Caja de efectivo», Entidad financiera 0, Tipo de dirección 0, Cuenta **57000.00000**; sin Banco/IBAN. La «Agrupación cuentas» es obligatoria: crea antes «Finanzas › Tesorería › Maestros › Agrupaciones» › «Añadir grupo»: Tipo «Cuenta», Grupo tesorería **AG{INI}**, «Cajas Maestros {INI}». Vuelve a la caja, elige AG{INI} y guarda (formato AEB43 propuesto). Cartera (BBVA_{INI}, CAJA_{INI}) y maestros-v-4 (CAIXA{INI}) reutilizan `AG{INI}` o `CA`.

## 8. Municipio `08{INI}1` — «Finanzas › Maestros › Terceros › Localización › Países»
Países abre en consulta: País = `Espa*`. Pestaña «Municipios y poblaciones» › «Añadir municipio»: Provincia 08 (Barcelona), Población «Poblacion Maestros {INI}», Código Postal **08{INI}1** (inventado para no pisar uno real). El Id. municipio lo asigna el sistema. «Municipios y Poblaciones» abierto directamente no tiene alta.

## 9. Errores (de la plataforma)
En la fila editable de Relaciones falta el Plan contable → «Añadir relación». Tercero vuelve a Provisional tras cambios → «Validar». Agrupación vacía («Datos no disponibles») → crear `AG{INI}`. Alta de tercero sin cuentas de cliente/proveedor → revisa «Finanzas › Maestros › Terceros › Clasificación › Tipos de terceros» (`ctipoter`): mnemotécnicos 43000 y 40000.
