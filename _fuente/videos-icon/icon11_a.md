## 1. Resumen

La sesión arranca con un repaso conceptual del asiento contable, su lógica de debe/haber y el ejemplo de una compra de laptop. Después se explica el circuito documental de una factura: al contabilizar se generan asiento contable, cartera de efectos y registros fiscales. Se abre una factura de compra con origen albarán y se muestra la cartera de efectos `cefectos`, con importe 1.815, clase pago/cobro y tipo de efecto TF. Se enseña a parametrizar los tipos de remesa en `cempresa` › bancos propios › remesas por cuenta. Luego se crea una remesa de pago, se selecciona el efecto, se agrega y se evoluciona el estado, generando tesorería `tapete Cuen` y su asiento contable. Se dedica un tramo a resolver un error de periodos contables cerrados y a explicar el acceso por atajo `C remesos` y por menú Finanzas. Por último, se repasan tipos de efecto, tipos de asiento EPC/FB, el error de domiciliación bancaria y se deja como práctica contabilizar y remesar facturas de compra/venta.

## 2. Capítulos

Descartes: no se detectan tramos muertos largos; solo se omiten pausas breves de confirmación o esperas.

| inicio (s) | fin (s) | título |
|---|---:|---|
| 0 | 237 | Asiento contable y circuito documental |
| 239 | 365 | Contabilizar factura de compra y cefectos |
| 365 | 557 | Importe cero, parámetros de remesa y empresa |
| 557 | 678 | Selección de efectos y evolución de remesa |
| 686 | 960 | Rectificativas, sustitutivas y periodos contables |
| 960 | 1220 | Accesos, rutas y tipos de efecto |
| 1220 | 1440 | Errores de contabilización y multi-efecto |
| 1440 | 1640 | Práctica final, anticipos y cierre |

### Capítulo 1 — Asiento contable y circuito documental

- 0 | Pregunta inicial: ¿qué es un asiento contable?
- 19 | José define el asiento contable.
- 56 | Ejemplo de balanza y compra de laptop.
- 99 | La factura genera asiento, cartera y registros.
- 118 | Remesa: cobros y pagos según tipo de factura.
- 137 | Extracto bancario `textra` como estado de cuenta.
- 173 | Conciliación: contabilidad interna vs banco.
- 203 | Aclaración: la conciliación asegura coincidencia.

### Capítulo 2 — Contabilizar factura de compra y cefectos

- 239 | Pantalla de facturas; empiezan por compras.
- 250 | Factura de compra con origen albarán.
- 255 | Acción de contabilizar.
- 262 | Asiento contable: debe/haber y cuentas.
- 279 | Filtro para asientos, cartera y registros.
- 285 | Ventana `cefectos` con el efecto.
- 301 | Efecto de deuda por 1.815.
- 345 | Clase pago/cobro y tipo de efecto TF.

### Capítulo 3 — Importe cero, parámetros de remesa y empresa

- 365 | Se anuncia remesar factura de compra.
- 372 | Aviso: muchas facturas con importe cero.
- 382 | Importe cero: no genera cartera de efectos.
- 408 | Síntoma: cartera vacía tras contabilizar.
- 451 | Vuelta a la remesa con empresa Deister.
- 468 | Cuenta financiera y clase pagar/cobrar.
- 498 | Tipo de remesa parametrizado en `cempresa`.
- 506 | Ruta: empresa, bancos propios, remesas por cuenta.

### Capítulo 4 — Selección de efectos y evolución de remesa

- 557 | Selector de efectos de la remesa.
- 575 | Filtro por proveedor/tercero.
- 587 | Aparece efecto de 1.815 TF pendiente.
- 609 | Se agrega el efecto a la remesa.
- 619 | Efectos remesados: 1.815.
- 626 | Evolucionar estado para generar tesorería.
- 636 | Genera tesorería `tapete Cuen`.
- 648 | Asiento contable de 1.815 en remesa.

### Capítulo 5 — Rectificativas, sustitutivas y periodos contables

- 686 | Pregunta por dudas tras remesa.
- 697 | Repaso de factura rectificativa y sustitutiva.
- 718 | José explica la diferencia entre ambas.
- 761 | Objetivo: llegar a remesar facturas contabilizadas.
- 781 | Error común en facturas de compra.
- 822 | Diagnóstico: problema de periodo contable.
- 883 | Pantalla compartida: empresa/ejercicio 26.
- 911 | Periodos enero-junio cerrados; empezar en julio.

### Capítulo 6 — Accesos, rutas y tipos de efecto

- 960 | Cierre del tema de periodos; dudas por chat.
- 971 | Atajo para remesas: `C remesos`.
- 982 | C de contabilidad/finanzas.
- 1001 | Tarea: contabilizar y remesar dos facturas.
- 1031 | Ruta Finanzas > Cobros y pagos > Remesas.
- 1045 | Facturas disponibles y probar multi-tercero.
- 1102 | Circuito completo: asiento, cartera, fiscal, remesa.
- 1184 | Cambiar a provisional y tipo de efecto TF.

### Capítulo 7 — Errores de contabilización y multi-efecto

- 1220 | Error a revisar: tipo de documento/asiento.
- 1253 | Compras: asiento EPC; ventas: FB.
- 1267 | Error de domiciliación bancaria no informada.
- 1282 | Causa: domiciliaciones mal parametrizadas.
- 1300 | Por eso usaron cheque por defecto.
- 1331 | Dos efectos con mismo tipo cheque sí jalan.
- 1340 | Mezclar cheque y TF no evoluciona.
- 1436 | Cierre: probar cobros y pagos con varios efectos.

### Capítulo 8 — Práctica final, anticipos y cierre

- 1440 | Anticipo se explicará mañana.
- 1452 | Borrado de pruebas previas.
- 1488 | Aviso: anticipo no se explicará aún.
- 1503 | Repaso: contabilizar y remesar facturas.
- 1512 | Anticipo usa tabla `efectos anticipos`.
- 1533 | Registrar códigos de prueba con slash.
- 1560 | Entender para qué sirve cada paso.
- 1596 | Cierre de remesa y próxima conexión.

## 3. Transacciones y pantallas

### Factura de compra con origen albarán

- **Inicio/fin:** 239–365
- **Ruta/menú:** no se indica en este tramo; se accede desde la lista de facturas creadas.
- **Objeto/tabla:** factura de compra; asientos contables (`casientos`); registros fiscales.
- **Pasos y valores:**
  - Abre una factura de compra con origen albarán.
  - Revisa importe total de ejemplo: 1.815.
  - Pulsa **contabilizar**.
  - Comprueba el asiento contable generado: debe/haber con cuentas de ingreso/salida.
  - Usa el filtro para ver asientos, cartera de efectos y registros fiscales.
- **Captura sugerida:** 262, 279, 285

### Cartera de efectos / `cefectos`

- **Inicio/fin:** 279–359
- **Objeto/tabla:** `cefectos` (ventana “C-fectos”).
- **Pantalla mostrada:**
  - Efecto de deuda por 1.815.
  - Clase del efecto: pago o cobro.
  - Tipo de efecto: transferencia, identificado como TF.
  - Estado: pendiente.
  - Se menciona que el efecto generará tesorería a medio plazo `T-Movites`.
- **Captura sugerida:** 293, 345, 353

### Parametrización de remesas por cuenta

- **Inicio/fin:** 498–548
- **Ruta/menú:** `cempresa` › **bancos propios** (`cbancpro`) › **cuenta financiera** › **remesas por cuenta**.
- **Objeto/tabla:** `cempresa`, `cbancpro`.
- **Pasos y valores:**
  - Entrar a la empresa.
  - Ir a **bancos propios**.
  - Abrir la **cuenta financiera**.
  - Localizar la opción **remesas por cuenta**.
  - Verificar que estén parametrizados cobros, pagos y cheques.
  - Si están vacíos, la remesa no permitirá jalar ninguna opción/render.
- **Captura sugerida:** 534, 539, 543

### Registro de remesa / `cremesas`

- **Inicio/fin:** 451–619
- **Ruta/menú:** más adelante se indica **Finanzas › Cobros y pagos › Remesas › Registros de remesas**.
- **Objeto/tabla:** `cremesas`.
- **Pasos y valores:**
  - Abrir una remesa para una factura de compra.
  - Empresa: **Deister**.
  - Cuenta financiera visible y verificada.
  - Clase: **pagar**, porque es factura de compra.
  - Tipo de remesa: parametrizado en `cempresa`.
  - Abrir **selección de efectos**.
  - Filtrar por proveedor/tercero.
  - Verificar efecto por 1.815, tipo TF y estado pendiente.
  - Seleccionar y agregar el efecto.
  - El efecto pasa a la relación de efectos remesados por 1.815.
- **Captura sugerida:** 464, 587, 619

### Evolución de remesa y generación de tesorería

- **Inicio/fin:** 626–678
- **Objeto/tabla:** `tapete Cuen` (tesorería); asiento contable.
- **Pasos y valores:**
  - Pulsar **evolucionar estado**.
  - La remesa genera tesorería `tapete Cuen`.
  - Se genera asiento contable por 1.815.
  - Debe: entra el gasto.
  - Haber: sale el pago.
  - La tesorería muestra importe **-1.815** porque es un pago.
- **Captura sugerida:** 648, 661, 671

### Ejercicio contable y periodos

- **Inicio/fin:** 883–956
- **Objeto/tabla:** `cempresa` › ejercicio contable.
- **Pantalla mostrada:**
  - Ejercicio número: **26**.
  - Periodos de enero a junio aparecen cerrados.
  - Las facturas deben empezar desde julio.
  - Si se quieren abrir periodos anteriores, hay que eliminar el ejercicio y volver a crearlo después de configurar bien el año de inicio de la empresa.
- **Captura sugerida:** 911, 920, 948

### Ruta y atajo de remesas

- **Inicio/fin:** 970–1037
- **Objeto/tabla:** `cremesas`.
- **Atajo:** `C remesos`.
- **Explicación:** C corresponde al módulo de finanzas/contabilidad.
- **Ruta de menú:** **Finanzas › Cobros y pagos › Remesas › Registros de remesas**.
- **Captura sugerida:** 1031

### Factura con origen pedido: provisional, TF y tipo de asiento

- **Inicio/fin:** 1184–1258
- **Objeto/tabla:** factura con origen pedido.
- **Pasos y valores:**
  - Pasar la factura a **provisional**.
  - Cambiar el tipo de efecto a **TF**.
  - Si sale error de contabilización, revisar tipo de documento/tipo de asiento.
  - Para compras: tipo de asiento **EPC**.
  - Para ventas: tipo de asiento **FB**.
- **Captura sugerida:** 1203, 1253, 1255

### Error de domiciliación bancaria no informada

- **Inicio/fin:** 1267–1300
- **Tipo:** mensaje/error mostrado en pantalla.
- **Causa explicada:**
  - Las domiciliaciones bancarias del tercero no están bien parametrizadas.
  - Por eso algunos crearon facturas usando cheque por defecto.
- **Captura sugerida:** 1267, 1273

### Remesa multi-efecto y restricción por tipo de efecto

- **Inicio/fin:** 1084–1436
- **Pantalla:** selector de efectos de remesa.
- **Pasos y valores:**
  - Se pueden filtrar y agregar varios efectos/terceros.
  - Se pueden pagar varias facturas en una misma remesa.
  - Todos los efectos deben compartir el mismo tipo de efecto: cheque con cheque o TF con TF.
  - Si se mezclan cheque y TF, no se puede evolucionar la remesa correctamente.
- **Captura sugerida:** 1084, 1331, 1340