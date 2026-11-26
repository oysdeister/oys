---
name: erp-next-cartera
description: "Conocimiento funcional de Cartera, cobros y pagos del ERP Axional/Deister VNext (demo nextdemo.geasa.eu, base tutorial): plazos de pago, tipos de efecto, bancos propios y cajas, efectos de una factura, estados, acciones y enlaces contables, cobro suelto con gestión (COBD), pago en efectivo (PEFE), cierre de gestión, remesas de pago y cobro (PSCTT, CSCTS, CSDDS), evolucionar remesa, paso a tesorería (PTES), cobro parcial, mandato SEPA, impagado (CDEV) y descuento de efectos. Incluye asientos esperados y trampas de la demo. Úsala siempre que haya que documentar, enseñar, grabar, corregir o crear ejercicios o preguntas sobre efectos, remesas, cobros, pagos o gestiones, o cuando pregunten «¿qué asiento deja esta remesa?», «¿por qué no me deja remesar?» o «¿cómo se cobra un efecto?»."
---

# Cartera, cobros y pagos en el ERP nuevo (Axional VNext)

Módulo `carteras` de la plataforma (`app/src/content/carteras.json`, 18 bloques). Va después de Ventas y Compras, que son quienes crean los efectos, y antes de Tesorería, que recibe sus movimientos. Para banco, extracto y conciliación lee la skill `erp-next-tesoreria`.

## Qué es y por qué importa
- **Efecto** = cada cobro o pago pendiente que deja una factura contabilizada (uno por vencimiento). **Cartera** = la lista de todos los efectos: lo que te deben (cobro) y lo que debes (pago).
- Un efecto cambia de estado con una **acción** (COBD, PEFE, PTES…). La acción se aplica a un efecto suelto, a un grupo con una **gestión** o a un paquete que va al banco, la **remesa**.
- Cada cambio de estado puede generar un **asiento** (según el enlace contable de la acción) y/o un **movimiento de tesorería**. Si el asiento no cuadra con la realidad, casi siempre la causa está en la plantilla de la acción, no en el efecto.

## Mapa de rutas (menú «Finanzas ›»)
| Qué | Ruta |
|---|---|
| Plazos de pago | Maestros › Terceros › Condiciones administrativas › Plazos de pago (`ctipopag`) |
| Tipos de efecto, estados | Cobros y Pagos › Maestros › Efectos › Tipos / Estados |
| Acciones y enlaces contables | Cobros y Pagos › Maestros › Acciones › Relación de acciones |
| Bancos propios y cajas | Cobros y Pagos › Maestros › Auxiliares › Bancos propios |
| Cartera de efectos | Cobros y Pagos › Cobros y Pagos (y «Movimientos»); desde la factura, desplegable ⌄ › «Cartera» |
| Gestiones sobre efectos | Cobros y Pagos › Gestiones › Gestiones sobre efectos (la OCR del vídeo la llama «Gestiones sobre la cartera de efectos»; conviven los dos rótulos) |
| Remesas | Cobros y Pagos › Remesas › Registro de remesas |
| Procesos avanzados | Cobros y Pagos › Procesos (Anticipos, Reclasificaciones, Cambios de titularidad, Alinear vencimientos) y Detalle a fecha histórica |

## Orden de la plataforma (etapas.ts, módulo carteras)
1. **Configurar · Preparar**: `carteras-1` (plazo V{INI}, tipo de efecto E{INI}, tercero CAR{INI}, factura de compra FC de 121,00 en 3 efectos) y `carteras-3` (tercero entidad B{INI}, banco BBVA_{INI}, caja CAJA_{INI}).
2. **Operar · Ver la cartera**: `icon-cartera-v-1` (efectos de una factura), `icon-cartera-1` (estados, tipos, acciones).
3. **Cobrar y pagar**: `carteras-5` (cobro suelto + remesa de cobro), `icon-cartera-v-2` (PEFE), `icon-cartera-v-3` (pago con gestión), `icon-cartera-2` (cierre de gestión), `cartera-cobro-parcial`.
4. **Remesas**: `icon-cartera-v-4` (tipos de remesa de la cuenta), `-v-5` (crear remesa de pago), `-v-6` (evolucionar), `-v-7` (efecto que no se remesa), `carteras-7` (paso a tesorería), `cartera-mandato-sepa`.
5. **Impagados**: `cartera-impagado-devolucion`, `cartera-descuento`. **Para saber más** (opcional): `icon-cartera-3`.
Detalle paso a paso de cada bloque en `references/bloques_cartera.md`.

## Códigos del caso continuo
- Prácticas aparte, con el tercero **CAR{INI}** (cliente 43000 y proveedor 40000), el plazo **V{INI}** (40/80/120 días al 40/20/40 %), el tipo de efecto **E{INI}** (pago por transferencia; el código admite 3 caracteres) y el artículo **ASE{INI}**. Se usa CAR{INI} y no T{INI} para no cambiar las condiciones de pago del proveedor de Compras: si cambiaran, la factura del caso saldría en tres efectos y las cifras no cuadrarían.
- Banco **BBVA_{INI}** (57200.00000; el código admite 10 caracteres), caja **CAJA_{INI}** (57000.00000), entidad **B{INI}** (categoría 008), línea financiera **LRC{INI}** con tipo de línea **REM{INI}**.
- Pago del caso (operación 7): efecto de **151,25** de T{INI} (125,00 + 26,25 de IVA, tipo TF), remesa **PSCTT** desde BBVA_{INI}, 06-11-2026.
- Cobro del caso: venta FP{INI} de **242,00** a C{INI} en dos efectos de **121,00** (14-11 y 14-12), tipo R{INI} «Recibo domiciliado». Efecto 1 suelto con gestión **COBD**; efecto 2 en remesa **CSDDS** por LRC{INI} (01-12-2026, cobro 14-12-2026). Saldo final del banco: 3.077,25.
- Los bloques de vídeo (`icon-cartera-*`) usan códigos de otra base (empresa 125/001, PRVCC0, tercero 00087, USD/PEN): se explican con un puente a las cifras del caso. No los mezcles con las del alumno.

## Asientos esperados (debe / haber)
| Operación | Debe | Haber |
|---|---|---|
| Contabilizar factura de compra de 121,00 | gasto + IVA soportado | 40000 proveedor (y deja 3 efectos PE) |
| Cobro suelto COBD de 242,00 (`carteras-5`) | 57200.00000 Bancos | 43000.00000 Clientes |
| Remesa de cobro CSCTS/CSDDS al confirmar (s/Tes) | 57200.00000 | 430/431 cliente |
| Ordenar remesa de pago PSCTT (c/Tes) de 151,25 | 40000.T{INI} | cuenta puente que fija la acción (en la demo, 10000.xxxxx; en una empresa real, 401) |
| Cargo del banco, tras conciliar y contabilizar el movimiento (en Tesorería) | cuenta puente | 57200.00000 |
| Devolución CDEV de 242,00 | 43150.00000 Clientes impagados | 57200.00000 |
| Devolución con gastos del banco (3,00) | 43150 por 242,00 y 62600 por 3,00 | 57200 por 245,00 |
| Cobro parcial de 100,00 sobre un efecto de 242,00 | 57200 por 100,00 | 43000 por 100,00 (quedan 142,00 en un efecto nuevo PE, orden 101) |
Regla para el lado: el banco te quita dinero, baja su cuenta (572 al haber) y el cliente vuelve a deberte (4315 al debe). Una remesa o gestión «s/Tes» apunta la 572 directamente; una «c/Tes» no toca el banco hasta que se concilia el movimiento de tesorería, y si estuviera en los dos sitios se contaría dos veces.

## Tipos de remesa (se lee el código)
Primera letra C cobro / P pago; después tipo (SCT transferencia, SDD adeudo directo SEPA, CHE cheque, LEC letra, CNF confirming, PAG pagaré); última letra **T** con tesorería / **S** sin tesorería. Ejemplos: PSCTT, PSCTS, CSCTS, CSDDS, CSCTT, CCHET, LCDTO/LCDTS/LCDTT (descuento). Cada banco solo ofrece los tipos que tiene en su pestaña «Remesas por cuenta»; el tipo de una remesa guardada no se puede cambiar. Estados del efecto en una remesa: PE › PR propuesto (al agregar) › OC/OP ordenado (1.ª evolución) › CO/PA (2.ª, en las s/Tes).

## Trampas de la demo (comprobadas)
- Cobrar desde la ficha del efecto («Evolucionar estado») da «No such column 'emi_repres_nif'»: es un fallo de la base TUTORIAL. Cobra siempre con una gestión sobre efectos.
- Remesa nueva con «Tipo remesa» vacío: el banco no tiene remesas por cuenta. Añade CSCTS, CSDDS y PSCTT en BBVA_{INI}.
- CSDDS pide la domiciliación (IBAN) del cliente: «Requiere la domiciliación bancaria del tercero!» o «DOMICILIACIÓN BANCARIA NO INFORMADA». La factura de Ventas se hizo sin IBAN, así que el efecto nace sin domiciliación: se informa a mano en el efecto 2.
- Mandato SEPA: no se llega a guardar, error ID 15486 («El código comercial del acreedor [0] debe tener exactamente 3 caracteres»), dato de la empresa. El fichero SEPA no se genera.
- El asiento del cobro de la remesa CSDDS lleva la 23000 (inmovilizado) al haber en vez del cliente: plantilla mal configurada de la demo; por eso la 43000.00901 de C{INI} no queda a cero. Lo correcto es 572 al debe y 430/431 al haber.
- La plantilla de devolución de la demo sale al revés (57200 al debe, 43150 al haber): se comenta como anomalía; lo correcto es el de la tabla.
- La cuenta 100… como puente de pagos ordenados es configuración propia de la demo (en el PGC la 100 es Capital): no la copies.
- Gestión con varios efectos a veces no cierra (incidencia de la base del vídeo): cierra con un solo efecto. «Pago a tesorería» (PTES) puede dar «Cannot insert a null into column (taptcuen.fecval)»: revisa las fechas del diálogo y repite.
- Retroceder una gestión o remesa cuya tesorería ya está conciliada falla con `cefecges_estado_ava_11`: desconcilia primero. Con el periodo contable cerrado, retroceder no borra el asiento, lo compensa.
- Al cambiar la clase en una gestión se borra la acción: elige primero la clase. En «Importe divisa» pulsa Intro o no se guarda.
- Un efecto de importe 0 no entra en remesa ni en conciliación (la factura de 0 no genera cartera).
- Rutas sin respaldo en el repo (sin verificar): «Remesas › Maestros › Tipos remesas» y «Soportes electrónicos › Cobros › Emisión de adeudos directos SEPA».

## Lecciones de las sesiones (síntoma → causa → regla)
- Anticipo da dos efectos y solo el positivo va al banco → son especulares (+ cobrado, − pendiente de aplicar) → no remeses el negativo (`icon-cartera-3`).
- Remesa que no deja elegir tipo o cambiarlo → el tipo no se puede cambiar una vez guardada y cada banco solo ofrece los de «Remesas por cuenta» → añade el tipo al banco antes y crea la remesa nueva; una SDD necesita LRC e IBAN del cliente.
- Cobro de la domiciliación del efecto 2 y remesas reales ZZ sin comprobar (sin verificar) → alternativa probada: COBD sobre el efecto.
- Ejercicio de Cobros y pagos que no carga (`replaceAll is not a function`) → `ruta` venía como lista de listas → `ruta` siempre `string[]`.

## Referencias
- `references/bloques_cartera.md`: los 18 bloques con id, ruta, pasos clave, cifras y problemas. Léela para redactar o revisar un ejercicio concreto.
- `references/modelo_tecnico.md`: tablas (`cefectos`, `cefecges_pcs`, `cremesas`…), maestros, errores `cefecges_estado_ava_NN`, reclasificación, anticipos, titularidad y recobros, resumidos de la documentación de referencia (hechos-cartera). Léela para preguntas técnicas o de «por qué falla».
- Datos y convención de códigos: `_fuente/CODIGOS_ALUMNO.md` del repo. Redacción: `auditoria/redaccion_cartera.md`.
