# Conocimiento de las grabaciones «Icon» (Finanzas) conservado

Heredado de la antigua skill `erp-nuevo-icon` (y de su gemela en el plugin `oys`). Aquí queda lo que **no es contabilidad básica** para que no se pierda; el desarrollo vive en las skills hermanas `erp-next-cartera`, `erp-next-tesoreria`, `erp-next-impuestos` y `erp-next-activos`.

## Las ocho sesiones (Meet de Deister, entornos reales de Perú: no uses sus datos)
- **Finanzas 1** (`icon1`, ~35 min): facturas, maestro de empresas, facturas directas FC/FB, rectificativa/sustitutiva, primer intento de remesa.
- **Finanzas 1.1** (`icon11`, ~27 min): cartera de efectos, remesa de pago completa, periodos cerrados, tipos de efecto y errores.
- **Finanzas 2** (`icon2`, ~25 min): extracto bancario y conciliación manual (clase pagar y cobrar).
- **Maestros contables** (`maestros`, ~44 min): plan contable, cuentas, mnemotécnicos, empresa, tercero, direcciones, datos bancarios, condiciones comerciales.
- **Impuestos TAX introducción** (`tax-intro`, ~61 min) y **tablas** (`tax-tablas`, ~40 min).
- **Cobros y pagos** (`cobros`, ~42 min): cartera, tipos/estados de efecto, caducidad, pago individual PEFE, gestión masiva.
- **Asientos y activos fijos** (`asientos`, ~31 min): tipologías, generación de inmovilizado, bienes/elementos/componentes.
- `6. Tesorería.mp4` es duplicado de Tesorería 2.
- Pipeline: whisper-cli large-v3-turbo → análisis DeepSeek → agente por vídeo con fotogramas → `ensamblar.py` en `_fuente/videos-icon/`.

## Maestro de empresas (`cempresa`)
Finanzas › Maestros › Empresas: código, nombre, fecha de inicio, ID fiscal, zona impositiva, tercero vinculado 1:1, plan contable, moneda, calendario. Crear ejercicio; periodos cerrados impiden contabilizar. Bancos propios: cuenta financiera y «remesas por cuenta» para que aparezcan los tipos de remesa. (Práctica de alta de empresa S{INI}: `erp-next-maestros`.)

## Remesas
Finanzas › Cobros y pagos › Remesas › Registros de remesas. Clase **pagar** (compras) o **cobrar** (ventas). El tipo de remesa se configura en `cempresa` › bancos propios › cuenta financiera › remesas por cuenta. Se seleccionan efectos pendientes, se agregan y se **evoluciona el estado**: genera tesorería (`taptcuen`) y asiento. Los efectos de una remesa deben compartir tipo de efecto (TF con TF, cheque con cheque).

## Extracto y conciliación
Extracto: Finanzas › Tesorería › Extractos bancarios y movimientos; concepto común 04; en la grabación pago positivo y cobro negativo (perspectiva del banco). Conciliación: Finanzas › Tesorería › Conciliación bancaria: filtrar empresa/cuenta/fechas, ejecutar, comparar extracto pendiente vs tesorería pendiente, conciliar y **contabilizar** (sin «Contabilizar» queda conciliada sin asiento).

## Cartera de efectos (`cefectos`)
Tipos de efecto (transferencia, cheque…), estados (pendiente, bloqueado, pagado, cobrado) y estado inicial por tipo. Indicador de caducidad; indicadores ordenado/propuesto evitan gestiones simultáneas. Acción **PEFE** («pago directo en efectivo»): botón individual; en gestión masiva (Gestiones sobre la cartera) procesa varios y no permite retroceder individualmente (abre la gestión y actualiza desde los efectos).

## Impuestos TAX
Tabla `ctax_rule` (reglas de asignación) con datos de empresa (zona), tercero (direcciones) y artículo (clave fiscal). El tipo de impuesto fija el porcentaje y la base (neto o con impuestos previos). Al validar, impuestos por documento muestran operación, tipo, base, %, importe e ID de regla (código de operación p. ej. CLBC). Sin regla, error: crear registro en Finanzas › Impuestos › Maestros › Reglas de asignación.

## Tipologías y activos fijos
Tipología › pestaña Contabilización: asientos fijos, albaranes no facturados, provisión y **Generar inmovilizado** (requiere tipología marcada + familia del artículo con código de bien y serie). Estructura bienes → elementos → componentes; grupo contable (seis cuentas) y fiscal (porcentaje/años). La depreciación propone el primer día del mes siguiente (modificable).

## Tabla de problemas heredada (síntoma → causa → solución)
| Síntoma | Causa | Solución |
|---|---|---|
| Contabiliza pero no aparece en remesa | Importe total 0, no genera cartera | Corregir importe y volver a contabilizar |
| Error por periodo cerrado | Ejercicio con periodos cerrados / empresa con fecha mal | Revisar ejercicio |
| Remesa sin tipo | Falta «remesas por cuenta» en el banco propio | Configurar cobro/pago en bancos propios |
| Efecto no carga en remesa | Tipo de efecto ≠ tipo de remesa | Alinear |
| Factura directa no activa contabilizar | Importe total ≠ importe factura | Igualar |
| Error «FAQ ID 2» en venta directa | Entorno de training | Revisar con sistemas |
| Domiciliación no informada | Domiciliaciones del tercero sin parametrizar | Parametrizar o usar transferencia/cheque |
| Remesa mezclada no evoluciona | TF y cheque juntos | Separar por tipo |
| Extracto con signos confusos | Se razona desde el banco | Pago positivo, cobro negativo (en el extracto) |
| Tesorería conciliada sin asiento | No se pulsó Contabilizar | Contabilizar desde el importe |
| Error sin regla de impuestos | Falta `ctax_rule` | Crearla |
| No se crea activo fijo | Tipología o familia sin parametrizar | Marcar «Generar inmovilizado», código de bien y serie |
| Pago masivo no retrocede individual | Gestión masiva | Abrir la gestión |
