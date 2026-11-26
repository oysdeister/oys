# Modelo técnico de la cartera (resumen propio)

Fuente: skill `erp-nuevo-icon-documentacion/references/hechos-cartera.md` (resumen de la documentación de referencia de Deister, no se copia aquí) y los bloques de `carteras.json`. Todo lo que no se ha visto en la demo va como «(sin verificar)».

## Índice
1. Tablas
2. Maestros de cartera
3. Cómo funciona el cierre de una gestión
4. Remesas: reglas y botones
5. Errores `cefecges_estado_ava_NN`
6. Procesos avanzados
7. SEPA y mandatos

## 1. Tablas
| Tabla | Qué guarda |
|---|---|
| `cefectos` | Un efecto: estado, tipo, caducidad, cuenta, número de gestión, importes y cambio |
| `cefechis` | Histórico del efecto; una línea por cada cambio del cierre de gestión; permite reabrir. Base de la «situación de cartera a una fecha» |
| `cefecges_pcs` | Cabecera de gestión: empresa, clase (C cobro / P pago), acción, fecha de proceso, tipo de efecto, cuenta financiera, importes, estado (A abierta / C cerrada), número de remesa, tipo de generación (0 automática, 1 manual, 2 asíncrona) |
| `cefecges_det` | Detalle: efectos de la gestión, importes, cambio, diferencia de cambio, gastos |
| `cefeacti` | Acción: código de asiento, estado final, tipo de efecto final |
| `cefecest` | Estados de efecto (campo caduca) |
| `cefeplah` | Plantilla Excel del asiento (hasta seis hojas; la 4.ª se reserva a gastos bancarios) |
| `cremesas` | Remesa: número, clase, tipo, fecha, cuenta financiera, línea financiera, estado (A/C), importe máximo, total |
| `cefectos_anticipo_gen` | Generador de anticipos |
| `cefecrec_pcs/ori/des` | Reclasificación: cabecera, orígenes, destinos |
| `cefetith/cefetitl` | Cambio de titularidad: cabecera y líneas |
| `taptcuen`, `taptfluj` | Movimiento de tesorería y sus flujos, cuando la acción lo pide |
| `casientos`, `capuntes` | Asiento generado |

## 2. Maestros de cartera
- **Tipo de efecto**: determina la forma de pago y el estado inicial (como mínimo uno). Domiciliación: N no la requiere, T la del tercero, E la de la empresa. Fecha de operación: E emisión, V vencimiento, P media ponderada. Si el tipo exige domiciliación y el tercero no la informa, la contabilización se cancela.
- **Asientos programables** (enlaces contables): orden, agrupar (No/Sí/Tercero/Único), cuenta (Nulo/Código/Máscara), posición (Debe/Haber/Signo), signo, tipo de cuenta (Tercero/Banco/Ambos), fórmula del importe. Fórmulas típicas: importe del efecto, importe − gastos, importe + gastos, total de la remesa menos comisiones e intereses, diferencia de cambio. **Fórmula 0: no hace apunte contable, solo movimiento de tesorería.**
- **Estados** (maestro): según el estado se desactivan las opciones de baja o modificación del efecto. El campo «Remesa» del efecto indica si está remesado y en cuál.

## 3. Cierre de una gestión
Botón «Cerrar» (misma función que el cierre masivo). Pasos: valida; actualiza en cada efecto estado (el final de la acción), tipo (si la acción lo informa), caducidad, cuenta (según plantilla), número de gestión, operación y fechas; importes y cambio solo si hay diferencias de cambio y la divisa difiere de la de la empresa; si la acción tiene código de asiento, genera el asiento con la plantilla (origen = gestión); escribe el histórico; si el estado final exige tesorería, crea el movimiento y sus flujos. Una gestión abierta no puede tener fichero bancario asociado. «Abrir» reabre (si la tesorería no está conciliada).
«Gestiones según filtro» (proceso masivo): crea una gestión por grupo empresa/divisa/tipo de efecto y la cierra en el acto, sin propuesta previa (sin verificar en la demo).

## 4. Remesas: reglas y botones
- Alta: insertar registro, informar tipo y cuenta financiera; la acción se fija sola por tipo. Solo se seleccionan efectos de la misma sociedad y clase, no caducados y no remesados; el total no puede pasar del importe máximo; si el agrupado no llega al mínimo exigido, no se agrega ninguno.
- Botones: Agregar efectos (masivo), Desagregar efectos (solo remesa abierta), Evolucionar estado, Retroceder estado, Eliminar remesa (solo sin efectos). La papelera por efecto lo excluye y lo retrocede.
- Primera acción deja los efectos en Propuesto (PR) y la segunda en Ordenado (OP). Evolucionar contabiliza y/o notifica a tesorería según el tipo.
- Retroceder: anula apuntes si el periodo sigue abierto; si está cerrado, genera asiento de compensación. Se cancela si la tesorería ya está conciliada con el extracto.
- Tipos sin tesorería (terminan en S): CCHES, CCNFS, CFCSS, CLECS, CPAGS, CSCTS, CSDDS, LCDTO; PCHES, PCNFS, PLECS, PPAGS, PSCTS, PSDDS. Con tesorería (terminan en T o similar): CCHET, CCNFT, CFCST, CLECT, CPAGT, CSCTT, CSDDT; PCHEK, PCHET, PCNFT, PLECT, PPAGT, PSCTI, PSCTT, PSDDT. Ojo: la demo usa también LCDTS y LCDTT de descuento.

## 5. Errores `cefecges_estado_ava_NN` (al cerrar o retroceder)
01 gestión ya cerrada · 02 la acción exige cuenta financiera y la gestión no la tiene · 03 no hay serie numérica activa para la cuenta financiera (definir en `cbancpro_nums`) · 04 falta operación deudora/acreedora en el enlace de tesorería · 05 movimiento de tesorería sin líneas de flujo · 06 diferencias de cambio sin asiento contable · 08 hay gastos y no hay banco · 09 el estado de la deuda no es origen válido de la acción · 10 la deuda tiene documentos destino · 11 tesorería a retroceder contabilizada, conciliada o auditada · 12 marcar propuesta sin remesa · 13 serie numérica superada.

## 6. Procesos avanzados
- **Reclasificación**: caduca deudas origen y crea destino(s); debe haber al menos un origen y un destino, misma empresa, suma en moneda local exactamente cero. El cierre genera el asiento (un apunte por origen y contrapartida por destino) y, si cambia empresa/proyecto/sección/cuenta, uno de compensación. Revertir exige periodo abierto y que nada se haya tocado después; la inversión crea una cabecera inversa enlazada, no borra la original.
- **Cambio de titularidad**: reasigna deudas a pagar a un sustituto (típico embargo). Porcentaje 1 a 100, importe máximo ≥ acumulado, destinatario distinto del titular; «Seleccionar deudas vivas» y «Confirmar» contabilizan con el motor de reclasificación.
- **Alinear vencimientos**: agrupa efectos pendientes de un tercero con vencimiento común mediante una gestión que avanza sola; reversible abriendo y eliminando la gestión.
- **Anticipo**: dos efectos especulares (+ cobrado/pagado ya, − pendiente de aplicar contra la factura); reversible mientras ninguno haya evolucionado.
- **Recobros**: reclamaciones, conflictos y agenda; un cliente solo tiene un gestor; una gestión solo la modifica quien la creó y el mismo día.
- **Cartera a una fecha pasada**: no hay informe documentado de cuadre cartera-contabilidad; la reconstrucción usa el histórico (`cefechis`) y «Generar situación de cartera» (sin verificar cómo cuadra con contabilidad).

## 7. SEPA y mandatos
Fichero SEPA = XML estandarizado para transferencias y adeudos. El nombre del titular se normaliza (filtro ISO 20022) y se recorta a 70 caracteres. Mandato: empresa acreedora, estado (Activo/Solicitado/Cancelado), clase cobro/pago, fecha de firma anterior al primer cobro, tipo de orden Core o B2B, tipo de operación (recurrente por defecto), identificador del acreedor, referencia, deudor, titular, domiciliación y banco.
