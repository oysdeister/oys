# Terceros y proveedor T{INI} (`compras-1`)

Fuentes: `app/src/content/compras.json` (bloque `compras-1`, 6 secciones), `etapas.ts` (compras › «Maestros de compra»), `_fuente/CODIGOS_ALUMNO.md`.

## Índice
1. Idea: el proveedor se monta en capas
2. Tercero T{INI}
3. Relaciones contables ACR y PRO
4. Dirección
5. Condiciones de cobro, de pago, banco y validar
6. Proveedor en Gestión
7. Artículo 13500620 (solo se revisa)
8. Tipos de tercero resumidos
9. Errores y qué bloque los explica

## 1. Capas
**Tercero** (ficha común a Finanzas y Gestión) → relaciones contables → dirección → condiciones de cobro/pago → datos bancarios → «Validar» → **proveedor** de Gestión. Si algo falla, el error sale tarde, al contabilizar la factura de compra. `T{INI}` es **solo de Compras** (y para pagar su efecto de 151,25 en Cartera, sin tocar sus condiciones); Ventas usa `C{INI}`; Cartera usa `CAR{INI}`.

## 2. Tercero `T{INI}` — «Finanzas › Maestros › Terceros › Registro de terceros»
«Añadir tercero»: Tercero T{INI}, Nombre y Nombre comercial (el del alumno), País emisor ES, **Tipo ID fiscal «No censado»**, **Id. fiscal 0**. «Más datos»: Categoría **002 Proveedores**; Clave fiscal RGEN, Idioma es y Empresas ALL por defecto; estado Provisional / Abierto / Abierto. Guardar → «Ver registro» → **Holding = T{INI}** (el propio tercero, porque no pertenece a ningún grupo) → disquete.

## 3. Relaciones — pestaña «Relaciones» › «Añadir relacion»
1. Tipo tercero **Proveedor**, Tipo relación **ACR** (Acreedores), Plan **ES** (PGE 2008) → Cuenta 41000.00000 (se rellena al salir del campo Plan). Puede salir el aviso azul «Cuenta repetida»: informativo.
2. Segunda: Proveedor / **PRO** (Proveedores) / ES → 40000. En la demo el ERP asignó una subcuenta propia (40000.T{INI}).
**La plantilla de la factura de compra (FC) busca PRO**: sin ella, «Cuenta tercero [T{INI}] no existente para relación: [PRO]». Solo con ACR la factura no contabiliza.

## 4. Dirección
Pestaña «Direcciones» › «Añadir direccion»: tipo 0 domicilio fiscal, idioma es, Abierto, país ESP; CP 08001 (rellena provincia 08 y población Barcelona), Dirección, **Zona impositiva ESCO** (viene sola).

## 5. Cobro, pago, banco, validar
- «Condiciones de cobro» › «Añadir cobro»: Empresas ALL, Prioridad 0, Tipo efecto **EF Al contado**, Plazo **30D**, días fijos 0.
- «Condiciones de pago» › «Añadir pago»: Tipo efecto **TF Transferencia**, Plazo **30D**: es la que copian albaranes y facturas de compra.
- «Datos bancarios» › «Añadir banco»: Domiciliación 0, IBAN de ejemplo `ES9121000418450200051332`, Banco **ES2100 (CAIXABANK)**, BIC CAIXESBBXXX. Con TF la factura necesita esta cuenta («DOMICILIACIÓN BANCARIA NO INFORMADA»). Banco vacío → «Entidad y cuenta bancaria, ambos nulos o no nulos».
- Primera pestaña «Terceros» › **«Validar»** (botón verde): Estado Validado. Cualquier cambio posterior lo devuelve a Provisional.

## 6. Proveedor — «Gestión › Maestros › Terceros › Proveedores › Registro»
«Nuevo»: Proveedor **T{INI}**, Comercial T{INI}, Grupo de empresas ALL, Tipo proveedor **0 GENERAL**; centrales vacías. «Datos financieros»: Divisa EUR y **0 en Descuento comercial 1, 2, 3 y % Pronto pago** (si quedan vacíos, la factura no contabiliza: «Cannot invoke "Object.toString()" because "n" is null»). Guardar. Abre la ficha: **Fecha baja 31-12-2099** (tecleada `31122099`) y, en «Central de compras» y «Central de pagos», Central = T{INI} y Proveedor = T{INI}; guardar con el disquete (central y proveedor van en pareja; una central sin proveedor da error de restricciones de verificación). El **Grupo precio G{INI}** (Datos financieros › Tarifas) se asigna después, en `compras-precios`.

## 7. Artículo 13500620
«Gestión › Maestros › Artículos › Registro» › Filtros: ficha del 13500620 (6000-2RS ISB, unidad UNIDAD, tipo ARTICULOS, familia 01.01.001352). Comprueba en «Contabilidad» **Tipo contable PRODUCTO (PROD)**, clave fiscal **BOG** y naturaleza Bien, Estado Activo. **No lo cambies**: la demo es compartida. Si fuera tuyo y estuviera en Provisional, «Validar».

## 8. Tipos de tercero (resumen)
Cliente C{INI}: categoría 001, relación CLI (43000), plazo/efecto de cobro de Maestros. Proveedor T{INI}: categoría 002, relaciones ACR + PRO, cobro EF/30D y pago TF/30D, IBAN. Tercero de la empresa TS{INI}: sin relaciones contables, no es cliente ni proveedor.

## 9. Errores
«Hay errores en los datos del formulario» → campo obligatorio (Tipo ID fiscal, Id. fiscal, Categoría). Factura sin relación PRO → añadir la relación (se ve en `compras-factura`). `tipcon [VEN]` → artículo equivocado. Banco → ES2100.
