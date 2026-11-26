# Orden de carga de Finanzas, Finanzas sola o integrada, plantillas y tipo de asiento

Fuente: `icon-contabilidad.json` › `parametrizacion-icon-1`, `parametrizacion-icon-2`, `contab-plantilla-alta`, `icon-contabilidad-1`; documentación oficial resumida en `erp-nuevo-icon-documentacion` (orden de carga por áreas, PAGE 797-1007).

## Índice
1. Decisiones previas
2. Orden de carga (maestros)
3. Qué produce contabilizar
4. Finanzas sola o integrada con gestión
5. Tipo de asiento (lo que usan las facturas de gestión)
6. Plantillas de contabilización (Excel y Clásico)
7. Permiso «Contabilizar»: Real o Diferido
8. Ejercicio y periodos

## 1. Decisiones previas (bloque de reflexión, no se rellena nada)
¿Una sociedad o varias? ¿Uno o varios países? ¿Maestros compartidos entre empresas? ¿Consolidación, contabilidad de gestión o codificación concreta? Los maestros son tablas de datos fijos y se agrupan en cuatro ámbitos: generales (diarios, monedas, calendarios), terceros, empresas y usuarios, más workflow y los propios de cada área. La demo es multisociedad en un solo país: dos empresas, 0 «Deister Software» y DIS «Distribuidora S.L.» (ambas ESP). Áreas de Finanzas: Costes, Impuestos, Consolidación, Saldos contables, Cartera de cobros y pagos, Tesorería, Activos permanentes, Inversiones, Financiación a largo plazo, Caja, Presupuesto económico y financiero.

## 2. Orden de carga (por qué unos maestros van antes que otros)
Regla práctica: si un campo te obliga a elegir un valor de otro maestro, ese maestro tiene que existir antes.

Orden recomendado del bloque: **permisos por grupo → tercero de empresa → plan contable (PGC) → empresa → ejercicio y periodos → cuentas → numeradores por tipo de documento → terceros funcionales (con auxiliares mínimos) → tipologías → plantillas de contabilización.**

- Permisos: primero la agrupación (p. ej. «CONTABILIDAD GENERAL», código técnico `capuntes`), luego permisos y valores.
- Empresa: antes el tercero (autocompleta los datos fiscales) y un plan contable ya dado de alta; pide también moneda, idioma y zona impositiva. Código de 4 caracteres. La empresa 0 usa el tercero 0; la DIS, el 00003.
- Ejercicio: pide empresa; al crear el primero se generan 12 periodos contables y 12 fiscales (en los siguientes se copian del anterior). Una factura del 15-03-2026 cae en ejercicio 2026, periodo 3.
- Tercero: aunque esté activo, no funciona hasta que defines direcciones, relaciones contables, domiciliaciones (cuenta bancaria), condiciones de pago y contactos.
- Numerador: da número a los documentos (dispensador de turnos). Serie = grupo que comparte contador. Máscara `{INI}#yy-#n` → `{INI}26-000001`. Trampa: la serie lleva `#d` pero el número no → duplicados; pon `#d` en ambas o en ninguna.
- Tipología: debe existir al menos una antes de crear un documento de compras o ventas. Para contabilizar hace falta una plantilla o tipo de asiento por cada origen.
- Orden en la documentación oficial (tablas): `ctercero` → `ccuentas`/`csistema`/`cdiarios` → auxiliares `cproyect`/`cseccion` → `cejercic`/`cperiodo` → usuarios y permisos → numeradores y tipos de documento → tipologías IGES → cuentas de terceros (las genera el sistema al validar la relación contable del tercero) → asientos → impuestos `ctax_*` → cartera → tesorería y caja → activos fijos → balances por agrupación (`cctasal_agrs_genera`). Detalle en la skill de documentación oficial.

Comprobaciones en la demo: Grupos de permisos (Finanzas › Maestros › Parametrización), Empresas (Parametrización › Empresas), Ejercicios (Maestros › Cierres › Ejercicios contables: «Periodos contables (12)» y «Periodos fiscales (12)»), los meses salen en catalán en la demo.

## 3. Qué produce contabilizar
Contabilizar pasa el documento a la contabilidad y ya no se edita. Genera **asiento + cartera de efectos + registros fiscales** (según la cuenta contable). Se puede saltar del documento a su asiento y volver; casi siempre se puede deshacer (Descontabilizar) si nada lo impide. Cada área genera sus propios tipos de asiento.

## 4. Finanzas sola o integrada
- **Sola**: las facturas se registran directamente en Finanzas (Facturación › Ventas / Compras). Ventas: cabecera y líneas; al validar se calculan importes, impuestos y vencimientos y se comprueba el workflow. La fecha contable de una venta no puede ser anterior a la fecha de factura; no se contabiliza una factura no emitida. Estados de compra: Provisional, Bloqueado, Validada (Contabilizada). Orden: **guardar → validar → contabilizar**.
- **Integrada (IGES)**: pedidos, albaranes y facturas viven en documentos de gestión (Compras/Ventas); se contabilizan con plantilla o tipo de asiento por origen, definido en la tipología.
- Diarios de la demo: **DV** Ventas, **DC** Compras, DG General, DA Cierre y apertura, DD Distribución costes. (La documentación oficial cita `VE` como diario por defecto de ventas; en la demo es DV.)
- Para contabilizar hacen falta los **valores defecto de usuario** (asientos en tiempo real o borrador) y la plantilla/tipo de asiento en la tipología.

## 5. Tipo de asiento (contab-plantilla-alta)
- Cada tipología de factura dice su tipo de asiento en la pestaña **Contabilización** (al lado de «Anticipos»): Gestión › Compras › Maestros › Documentos › Tipos de facturas. FC usa el tipo «FACTURA DE COMPRA» (FC); sin él la factura no contabiliza.
- Se define en Gestión › Maestros › Contabilización › Asientos: tiene un **diario** (DC en compras, DV en ventas; lo trae el tipo de asiento, no la factura) y **líneas** (qué cuenta se mueve y con qué importe). En FC: proveedor con `-cabecera.imptot` (el signo menos lo lleva al Haber) y compra con `lineas.impnet` (Debe). El IVA no está en esas líneas: lo añade el ERP con los impuestos calculados (pestaña Impuestos).
- Ejemplo: 100 + 21 → proveedor 121 al Haber, compras 100 al Debe, IVA soportado 21 al Debe.
- **No edites tipos de asiento de la demo**: los comparten todos los alumnos.
- Antes de contabilizar comprueba el tipo de documento: factura de compra EPC, de venta FB (sin verificar el alcance general).

## 6. Plantillas de contabilización
- Finanzas › Contabilidad General › Contabilizadores, dos carpetas: **Sistema Excel › Modelos XLS** (`ccon_template_xls`; también por Cmd/Ctrl+K «Modelos de plantilla de contabilización») y **Sistema Clásico › Plantillas de contabilización**. No la confundas con «Plantillas de asientos del motor de contabilización».
- Cada libro XLS: hoja **origen** (datos del documento: Identificación, Proveedor, Importes, Impuestos, Pagos, líneas…) y hojas **destino** por convenio `capuntes` (asientos, costes, partidas), `cimpcont` (datos fiscales) y `cefectos` (cartera). Etiquetas `tabla.campo` (ccomfach.fecfac, ccomefec.fecven, ccomfacl.linid, capuntes.cuenta). Áreas: cabecera, datos únicos estructurados, multilínea censado o indeterminado.
- Errores de plantilla: `JavaNull`, `#¡REF!`, `#¿NOMBRE?` → fallo del libro; no lo edites, avisa a quien lo mantiene. Las hojas «Input» y «Datos de cuentas anuales XLS» no son plantillas de contabilización.
- Las plantillas Clásico/XLS las usan sobre todo las integraciones; la contabilización de las facturas de gestión del curso va por el tipo de asiento. No las modifiques en la demo (cambiarías la contabilización de todos).

## 7. Permiso «Contabilizar»
Código CONTAB, valores **Real** (asiento a contabilidad definitiva) o **Diferido** (área de revisión que luego se traspasa a real). Sin permiso no contabilizas. En la ficha del usuario hay además un indicador para que los procesos registren en diferido o real. Los permisos tipo Verdadero/Falso no llevan valores.

## 8. Ejercicio y periodos
Empresa con vigencia (la 0: desde 01-01-2000, sin fecha fin) → ejercicio por año → periodos mensuales (Abierto/Cerrado; un periodo cerrado no admite asientos). En TUTORIAL los doce periodos de 2026 están abiertos; el ejercicio 2027 de la empresa 0 puede existir ya (las copias periódicas lo necesitan). No pulses «Añadir ejercicio»/«Añadir periodo» en la empresa 0 (ejercicios compartidos): solo en tu empresa `S{INI}`.
