---
name: erp-nuevo-icon
description: Conocimiento funcional de Finanzas del ERP Axional/Deister versión Next aprendido en las grabaciones de la carpeta `Icon` (fuente de vídeos, no un módulo). Cubre facturación financiera directa FC/FB y contabilización, maestro de empresas (`cempresa`), facturas rectificativas y sustitutivas, remesas, extracto y conciliación bancaria, cartera de efectos y acciones de cobro/pago, maestros contables (planes, cuentas, mnemotécnicos), impuestos TAX (introducción y tablas maestras) y tipologías con generación de activos fijos/inmovilizado. Úsala para documentar, enseñar, grabar o crear ejercicios o preguntas de finanzas en el ERP nuevo.
---

# Finanzas en el ERP nuevo (vídeos `Icon`)

## Fuentes
- Carpeta `~/Downloads/VNEXT Doumentacion/Icon` (carpeta de grabaciones; no es un módulo). Ocho sesiones de Meet de Deister:
  - **Finanzas 1** (`icon1`): ~35 min. Facturas, maestro de empresas, facturas directas FC/FB, rectificativa/sustitutiva y primer intento de remesa.
  - **Finanzas 1.1** (`icon11`): ~27 min. Cartera de efectos, remesa de pago completa, periodos cerrados, tipos de efecto y errores.
  - **Finanzas 2** (`icon2`): ~25 min. Extracto bancario y conciliación manual con clase pagar y cobrar.
  - **Maestros contables** (`maestros`): ~44 min. Plan contable, cuentas, mnemotécnicos, empresa, tercero, direcciones, datos bancarios y condiciones comerciales.
  - **Impuestos TAX introducción** (`tax-intro`): ~61 min. Conceptos fiscales: directos/indirectos, jurisdicción, zonas fiscales, tipos, retención, percepción, detracción.
  - **Impuestos TAX tablas** (`tax-tablas`): ~40+ min. Maestros TAX, reglas de asignación, operaciones y tipos de impuesto.
  - **Cobros y pagos** (`cobros`): ~42 min. Cartera, tipos/estados de efecto, caducidad, pago individual PEFE y gestión masiva.
  - **Asientos y activos fijos** (`asientos`): ~31 min. Tipologías, generación de inmovilizado y estructura bienes/elementos/componentes.
- Aviso: `6. Tesorería.mp4` es duplicado de Tesorería 2 (ver skill `erp-nuevo-tesoreria`).
- Las grabaciones son de Meet sobre entornos reales de Perú; **no uses esos datos** (nombres, RUC, soles/IGV). Usa la demo española `nextdemo` (empresa TRI, plan ES, euros) y base tutorial.

## En la plataforma
- Ejercicios de vídeo dentro de los módulos por tema: icon-contabilidad (Contabilidad general: facturas y contabilización), icon-cartera (Cobros y pagos: cartera, remesas, extracto y conciliación), icon-impuestos (Impuestos), icon-activos (Activos fijos) y maestros.
- Series de vídeo troceadas en `app/src/content/video-finanzas.ts`, series `fin-<vídeo>`, Release `video-finanzas-v1`, clips recortados por privacidad.
- Pipeline: whisper-cli large-v3-turbo → análisis DeepSeek → agente por vídeo con fotogramas → `ensamblar.py` en `_fuente/videos-icon/`.

## Circuitos funcionales

### Contabilizar factura de gestión
- Al contabilizar una factura se generan **asiento contable**, **cartera de efectos** (`cefectos`) y **registros fiscales**.
- Si el importe total es 0, contabiliza asiento y registro fiscal en 0 pero no genera cartera; por tanto no se puede remesar ni conciliar.
- Ciclo del documento: provisional → validado → contabilizado.

### Maestro de empresas (`cempresa`)
- Finanzas › Maestros › Empresas. Define código, nombre, fecha de inicio, ID fiscal, zona impositiva, tercero vinculado 1:1, plan contable, moneda y calendario.
- Crear ejercicio contable; periodos cerrados impiden contabilizar.
- Bancos propios: cuenta financiera y configuración «remesas por cuenta» para que aparezcan los tipos de remesa.

### Facturas directas de Finanzas
- En Finanzas se crean facturas directas sin origen albarán/pedido: **FC** para compras, **FB** para ventas.
- Requieren empresa, tercero y cuenta financiera en datos financieros.
- El botón de contabilizar solo se activa si **importe total = importe factura**.
- **Rectificativa**: corrige sin anular (descuentos, importe mal). **Sustitutiva**: anula/reemplaza definitivamente. Ambas quedan vinculadas al DocFlow original.

### Remesas
- Ruta: Finanzas › Cobros y pagos › Remesas › Registros de remesas.
- Clase **pagar** para facturas de compra; **cobrar** para ventas.
- Tipo de remesa configurado en `cempresa` › bancos propios › cuenta financiera › remesas por cuenta.
- Seleccionar efectos pendientes, agregar y **evolucionar estado**: genera tesorería (`taptcuen`) y asiento contable.
- Los efectos de una misma remesa deben compartir tipo de efecto (TF con TF; cheque con cheque).

### Extracto y conciliación
- Extracto: Finanzas › Tesorería › Extractos bancarios y movimientos. Concepto común 04; importe positivo para pago y negativo para cobro (perspectiva del banco).
- Conciliación: Finanzas › Tesorería › Conciliación bancaria. Filtrar empresa/cuenta/fechas, ejecutar, comparar extracto pendiente vs tesorería pendiente, conciliar y **contabilizar**.

### Cartera de efectos
- Tabla `cefectos`. Tipos de efecto (transferencia, cheque, etc.), estados (pendiente, bloqueado, pagado, cobrado), estados iniciales por tipo.
- Indicador de caducidad; indicadores ordenado/propuesto para evitar gestiones simultáneas.
- Acción **PEFE** («pago directo en efectivo»): botón individual; en gestión masiva (`Gestiones sobre la cartera`) procesa varios y no permite retroceder individual.

### Maestros contables
- Planes contables (`Finanzas › Maestros › Cuentas › Planes contables`): codificación por país, p. ej. ES/PG2008.
- Cuentas contables: separador punto para identificar tercero en la cuenta.
- Mnemotécnicos: códigos alfanuméricos no contables asociados a plan y cuenta.
- Relaciones contables del tercero: la cuenta base identifica cliente/proveedor; el código tras el punto identifica al tercero.

### Impuestos TAX
- Tabla central `ctax_rule` (reglas de asignación). Datos de empresa (zona), tercero (direcciones) y artículo (clave fiscal).
- Tipo de impuesto define porcentaje y base de cálculo (importe neto o con impuestos previos).
- Al validar, impuestos por documento muestran operación, tipo, base, porcentaje, importe e ID de regla. Código de operación p. ej. CLBC.
- Si no existe regla, error; crear registro en `C-Tax Rule`.

### Tipologías y activos fijos/inmovilizado
- Tipología › pestaña Contabilización: asientos fijos, albaranes no facturados, provisión y **Generar inmovilizado**.
- Requisitos: tipología marcada + familia del artículo con código de bien y serie.
- Estructura: **bienes → elementos → componentes**; grupo contable (paquete de seis cuentas) y grupo fiscal (porcentaje/años).
- Depreciación: el sistema propone el primer día del mes siguiente; puede modificarse.

## Problemas típicos

| Síntoma | Causa | Solución |
|---|---|---|
| Factura contabiliza pero no aparece en remesa | Importe total 0; no genera cartera | Corregir factura a importe real y volver a contabilizar |
| Error al contabilizar por periodo cerrado | Ejercicio con periodos cerrados o empresa con fecha mal configurada | Revisar ejercicio; eliminar y recrear si es necesario |
| Remesa no muestra tipo | Falta `remesas por cuenta` en banco propio | Configurar cobro/pago en `cempresa` › bancos propios |
| Efecto no carga en remesa | Tipo de efecto no coincide con tipo de remesa (cheque vs transferencia) | Alinear tipo de efecto y tipo de remesa |
| Factura directa no activa contabilizar | Importe total ≠ importe factura | Igualar importes antes de validar |
| Error FAQ ID 2 en factura de venta directa | Error del entorno de training | Revisar con sistemas; en demo normal no debería ocurrir |
| Domiciliación bancaria no informada | Domiciliaciones del tercero sin parametrizar | Parametrizar domiciliaciones o usar transferencia/cheque |
| Remesa con efectos de distinto tipo no evoluciona | Mezcla TF y cheque | Separar por tipo de efecto |
| Extracto con signos confusos | Se razona desde la perspectiva del banco | Pago positivo, cobro negativo |
| Tesorería conciliada sin asiento | No se pulsó `Contabilizar` | Entrar al importe y contabilizar |
| Error sin regla de impuestos | Falta `ctax_rule` para combinación empresa/tercero/artículo | Crear regla en Finanzas › Impuestos › Maestros › Reglas de asignación |
| No se crea activo fijo al contabilizar | Tipología o familia sin parametrización de inmovilizado | Marcar `Generar inmovilizado` y configurar código de bien y serie |
| Pago masivo no se puede retroceder individual | Procesado por gestión masiva | Abrir la gestión y actualizar desde los efectos |

## Cómo usarla
- Para crear ejercicios, preguntas o vídeos de Finanzas Next.
- Cargar skills hermanas: `erp-nuevo-compras`, `erp-nuevo-tesoreria` y `video-tutorial-erp`.
- Usar la demo española `nextdemo` (empresa TRI, plan ES, euros) para ejercicios; no reproduzcas datos de clientes reales.