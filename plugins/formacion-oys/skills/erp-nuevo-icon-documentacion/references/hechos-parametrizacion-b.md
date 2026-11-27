# Ficha de referencia — Integración Documentos IGES ↔ Contabilidad

> Alcance: PAGE 733, 734, 735, 859, 860, 862, 868. Se ignora «test1».

## 1) Conceptos clave

- **Documentos IGES**: concursos (solo en compras), ofertas, formularios, solicitudes (solo en compras), acuerdos, planes de recepción (compras) o de entrega (ventas), pedidos, albaranes y facturas (PAGE 733).
- **Tipología**: variante de un mismo documento, p. ej. "factura directa, factura de abono, factura con IVA incluido, etc." (PAGE 733).
- **Circuito**: encadenamiento de documentos; puede ir de dos documentos hasta "seis documentos o más" (PAGE 733).
- **Circuito básico**: Pedido ➔ Albarán ➔ Factura (PAGE 733).
- **Campos de tipología**: "Tabla origen", "Actualización tabla origen" y "Copiar líneas" (PAGE 735).
- **Plantilla de contabilización**: "patrón de contabilización" por cada origen de impactos, registrado mediante hojas de cálculo (PAGE 862).
- **Libro de plantilla**: una **hoja origen** con los datos a procesar y una o más **hojas destino** con el mapeo de valores destino (PAGE 862).
- **Libro como función de transformación**: Origen → f(x) → Resultado (PAGE 862).
- **Saldo**: diferencia entre debe y haber; deudor si debe > haber, acreedor si haber > debe, o cero (PAGE 860).
- **Ejercicio contable**: persigue el control de la numeración de los asientos contables y el soporte de los períodos contables (PAGE 868).
- **Extractos**: extractos detallados de apuntes contables que reflejan el saldo acumulado desde distintas perspectivas (PAGE 859).
- **Hallazgo clave**: PAGE 733/734/735 no indican qué documento IGES contabiliza, ni campo/indicador de contabilización, ni plantilla, ni cuentas/tablas contables (PAGE 733).

## 2) Rutas de menú exactas

- **Finanzas/Contabilidad general/Contabilizadores/Modelos XLS** (PAGE 862).
- No consta en la ficha ninguna otra ruta de menú literal para tipologías IGES, extractos, saldos ni ejercicio contable (PAGE 733).
- La captura `p862_ccomtemplate.webp 1115x450 — Modelos XLS` corresponde a esa ruta (PAGE 862).

## 3) Tablas y campos que nombra la documentación

- **`ccomfach`** — tabla principal de referencia; campo **`fecfac`** (etiqueta "Fecha de emisión", celda A11/D11) (PAGE 862).
- **`ccomfach.opimp1`, `ccomfach.opimp2`, `ccomfach.opimp3`, `ccomfach.opimp4`** — cuatro operaciones impositivas en datos únicos estructurados (PAGE 862).
- **`ccomefec`** — tabla con campo **`fecven`**, ejemplo de área multilínea censado (PAGE 862).
- **`ccomfacl`** — tabla principal con campo **`linid`**, ejemplo de área multilínea indeterminado (PAGE 862).
- **`capuntes`** — registro de asientos contables; también "Registro de contabilidad de costes" y "Registro en partidas presupuestarias" (PAGE 862).
- **`cimpcont`** — registro de datos fiscales (PAGE 862).
- **`cefectos`** — registro de efectos en cartera (PAGE 862).
- **`param`** — tabla usada por los criterios de selección/entrada en las áreas de datos de la hoja origen (PAGE 862).
- **`tconplah`** y **`tconplal`** — etiquetas que aparecen en el diagrama de la página (PAGE 862).
- **`cefeplah`**, **`cefeplal_con`**, **`cefeplal_tes`** — etiquetas del bloque de código (PAGE 862).
- **Tabla de ejercicio** — controla la numeración de asientos y soporta los períodos contables (PAGE 868).
- **Tablas de períodos contables y de períodos de impuestos** — reciben doce registros al crear el primer ejercicio contable (PAGE 868).
- **Campos de tipología** — "Tabla origen" = **Ninguna** sin documento origen; "Actualización tabla origen" = **Restando / Sumando / No**; "Copiar líneas" = **Sí / Validar / No** (PAGE 735).

## 4) Circuitos y orden de carga o secuencia de pasos

- `Oferta ➔ Pedido ➔ Albarán ➔ Factura` (PAGE 733).
- `Acuerdo ➔ Pedido ➔ Albarán ➔ Factura` (PAGE 733).
- `Oferta ➔ Albarán ➔ Factura` (PAGE 733).
- `Acuerdo ➔ Albarán ➔ Factura` (PAGE 733).
- `Pedido ➔ Albarán ➔ Factura` (PAGE 733).
- `Pedido de compra ➔ Pedido de venta ➔ Albarán de venta ➔ Albarán de compra ➔ Factura de venta ➔ Factura de compra` (PAGE 733).
- `Albarán de abono ➔ Factura de abono` (PAGE 733).
- **Ciclo básico de ventas**: tipologías "Pedido de venta directo", "Albarán con origen pedido" y "Factura con origen albarán" (PAGE 735).
- **Ciclo básico de compras**: "Pedido de compra directo", "Albarán con origen pedido" y "Factura con origen albarán" (PAGE 734).
- **Puesta en marcha contable**: definir el ejercicio del año corriente natural o contable; si hay migración, crear registros de años anteriores; los siguientes ejercicios toman como modelo los períodos del ejercicio anterior (PAGE 868).

## 5) Procesos, botones y acciones con su efecto

- **"Conformar albarán"**: opción en cabecera al crear factura de venta con origen albarán; permite conformar varios albaranes en una única factura (PAGE 735).
- Al **validar la factura de venta** quedan vinculados pedido, albarán y factura (PAGE 735).
- En **albarán de venta**, si la tipología copia líneas, "estas solo se copian si existe disponibilidad de stock" (PAGE 735).
- En **factura de compra**: acceder a la pestaña **"Albaranes compras conformar"** y pulsar **"Conformar"** (PAGE 734).
- Si el albarán de compra contiene el **100%** de las cantidades del pedido, el estado del pedido pasa a **Servido**; si se modifican cantidades, pasa a **Parcial** (PAGE 734).
- El **proceso de contabilización** puede almacenar un libro de cálculo con los datos recibidos y procesados (PAGE 862).
- **Auditoría de apuntes contables**: consultar estado, auditar los no auditados y "tirar para atrás" la acción (PAGE 859).
- Proceso **"Repartir saldos contables"** por proyecto/sección/cuenta (PAGE 860).
- La **consulta de saldos acumulados** de contabilidad general se mantiene automáticamente y no es modificable desde pantalla; permite acceder a los apuntes que conforman el saldo (PAGE 860).
- Al crear el **primer ejercicio contable**, la aplicación genera **doce registros** en períodos contables y períodos de impuestos, para los doce meses naturales (PAGE 868).
- Si el modelo no corresponde a año/meses naturales, hay que acceder a la **tabla de períodos contables** y ajustar (PAGE 868).
- Informes disponibles: por ejercicio, períodos, proyectos, proyectos y secciones, cuentas y auxiliares; además **saldos vivos de documentos**, **saldos vivos en divisa** y **justificante de saldos vivos por importe** (PAGE 860).

## 6) Advertencias y errores típicos

- **`JavaNull`** — incidencia por ausencia de etiqueta para un campo (PAGE 862).
- **`#¡REF!`** — celda origen borrada (PAGE 862).
- **`#¿NOMBRE?`** — nombre de celda inexistente (PAGE 862).
- **`=Gestion!#¡REF!`** — celda origen borrada para etiqueta de nombre (PAGE 862).
- En tipologías **sin documento origen**, "Actualización tabla origen" y "Copiar líneas" se dejan a **NULL** (PAGE 735).
- PAGE 862 cita como orígenes "de factura, amortizaciones, tesorería, etc.", pero **no detalla la asociación concreta** con las tipologías IGES de PAGE 735/734 (PAGE 862).
- La **auditoría de apuntes** permite revertir la acción, pero no se documenta el efecto contable de la reversión (PAGE 859).
- Las capturas de pasos de ventas y compras (`p735_IGES_vent_paso_01..06`, `p734_IGES_comp_paso_01..06`) ilustran la secuencia, pero la ficha no transcribe sus rótulos (PAGE 735).