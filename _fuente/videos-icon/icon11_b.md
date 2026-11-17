## 4. Conceptos clave

- **Asiento contable**: registro oficial de hechos económicos; funciona como una balanza con debe/haber; una compra de laptop implica entrada de la laptop al debe y salida de dinero al haber; se usan cuentas contables del plan contable. (19, 30, 44, 56, 76)
- **Contabilizar una factura**: genera asiento contable, cartera de efectos y registros fiscales, que son los impuestos. (83, 255, 272)
- **Cartera de efectos / tabla `cefectos`**: contiene la deuda o el cobro de la factura; la clase indica si es pago o cobro y se visualiza el tipo de efecto, por ejemplo cheque o transferencia `TF`. (99, 279, 331, 345)
- **Efecto y tesorería**: el efecto de la cartera genera una tesorería a medio plazo `T-Movites`; al evolucionar la remesa se genera la tesorería `tabla Cuen`. (301, 619, 628, 655)
- **Remesa**: sirve para cobrar y pagar; una factura de compra usa clase `pagar` y una factura de venta usa clase `cobrar`. (113, 118, 476, 490, 1108)
- **Selector de efectos en la remesa**: se filtra por proveedor/tercero, se selecciona el efecto pendiente y se agrega a la relación de efectos remesados. (560, 569, 575, 587, 605, 609)
- **Evolución de la remesa**: al evolucionar estado, la remesa genera asiento contable y tesorería; en un pago de 1.815 aparece importe de -1.815. (619, 628, 644, 648, 655, 671)
- **Parametrización del tipo de remesa**: se hace en `cempresa > bancos propios > cuenta financiera > remesas por cuenta`; debe haber opciones de cobros, pagos y cheques para que la remesa muestre opciones. (494, 520, 534, 543)
- **Extracto bancario / `textra`**: estado de cuenta del banco donde se detallan ingresos y gastos/salidas de dinero. (137, 144)
- **Conciliación bancaria**: contrapartida entre la tesorería/contabilidad interna de la empresa y el extracto bancario del banco. (171, 173, 184, 190)
- **Varias facturas en una remesa**: se puede pagar/cobrar más de una factura en una remesa, siempre que los efectos tengan el mismo tipo de efecto. (1317, 1331, 1387, 1411)
- **Acceso a remesas**: atajo `C remesos`; también por ruta Finanzas › Cobros y pagos › Remesas › Registros de remesas. (970, 982, 1011)
- **Factura con importe total 0**: contabiliza y genera asiento/registro fiscal, pero no genera cartera de efectos; por tanto, no puede remesarse ni conciliarse. (381, 392, 423)

## 5. Problemas típicos

- **Facturas con importe total 0** (381, 392, 404, 423): varios alumnos tenían facturas con importe total cero. La factura deja contabilizar, genera asiento en 0 y registro fiscal en 0, pero no genera cartera de efectos. Esto impide hacer remesa o conciliación. Solución: revisar que el importe total de la factura sea distinto de cero.
- **Cartera de efectos aparece vacía** (404, 408, 432): era consecuencia del importe total 0; por eso no aparecía ni “jalaba” en el selector de efectos. Solución: corregir la factura para que tenga importe real.
- **Error por periodo cerrado** (819, 911, 917, 948): al crear facturas aparecía un error porque la empresa estaba creada con fecha del día y los periodos de enero a junio estaban cerrados. Las facturas debían empezar desde julio. Solución: revisar periodos contables abiertos; si se configuró mal el ejercicio/año de inicio, eliminar el ejercicio y volver a crearlo.
- **Error de tipo de asiento al contabilizar** (1220, 1250, 1255): si sale error relacionado con tipo de documento/asiento, en compras debe usarse tipo de asiento `EPC` y en ventas `FB`.
- **Domiciliación bancaria no informada** (1267, 1273, 1282): el error se debía a no haber parametrizado correctamente las domiciliaciones del tercero. Por eso algunos optaron por crear facturas con cheque por defecto.
- **Facturas creadas con cheque por defecto** (1158, 1173, 1184): muchas facturas de los alumnos estaban con tipo de efecto cheque. Recomendación de la sesión: pasarlas a provisional y cambiar el tipo de efecto a transferencia `TF` si se desea; también se puede probar con cheque, pero conviene practicar con `TF`.
- **Efectos de distinto tipo en una misma remesa** (1317, 1331, 1341): dos efectos de cheque sí evolucionan juntos, pero un efecto cheque y otro `TF` no van a poder evolucionar juntos. Solución: verificar que todas las facturas/efectos de la remesa tengan el mismo tipo de efecto.
- **Tipo de remesa sin opciones** (494, 520, 534, 543): si la remesa no muestra opciones, probablemente no está parametrizado el tipo de remesa. Solución: revisar `cempresa > bancos propios > cuenta financiera > remesas por cuenta`, con cobros, pagos y cheques.
- **Duda conceptual: factura rectificativa vs sustitutiva** (706, 728): la rectificativa corrige un error puntual sin emitir factura nueva; la sustitutiva anula/sustituye una factura previa por un error mayor, como proveedor o remitente.
- **Duda de acceso rápido a remesas** (970, 982, 1011): se puede usar el atajo `C remesos` o la ruta Finanzas › Cobros y pagos › Remesas › Registros de remesas.

## 6. Preguntas de test

1. Al contabilizar una factura, ¿qué se genera?  
a) Solo asiento contable  
b) Asiento contable, cartera de efectos y registros fiscales  
c) Solo extracto bancario  
d) Cartera de efectos y `textra`  
**Correcta: b**  
Explicación: la sesión indica que contabilizar genera asiento, cartera de efectos y registros fiscales/impuestos. (83, 255, 272)

2. La cartera de efectos que se genera al contabilizar una factura se conoce como tabla…  
a) `textra`  
b) `tabla Cuen`  
c) `C-fectos` / `cefectos`  
d) `cremesas`  
**Correcta: c**  
Explicación: se llama explícitamente tabla `C-fectos`. (279, 285)

3. Para remesar una factura de compra, la clase que se debe usar es…  
a) cobrar  
b) pagar  
c) rectificativa  
d) anticipo  
**Correcta: b**  
Explicación: una factura de compra implica que hay que pagar; una de venta implicaría cobrar. (476, 490, 1108)

4. ¿Qué ocurre si se contabiliza una factura con importe total 0?  
a) No se permite contabilizar  
b) Se genera cartera de efectos negativa  
c) Se generan asiento y registro fiscal, pero no cartera de efectos  
d) Se crea automáticamente un anticipo  
**Correcta: c**  
Explicación: la factura contabiliza, pero sin cartera de efectos no se puede remesar ni conciliar. (381, 392, 423)

5. ¿Dónde se parametriza el tipo de remesa?  
a) En el extracto `textra`  
b) En la cartera de efectos  
c) En `cempresa > bancos propios > cuenta financiera > remesas por cuenta`  
d) En el asiento contable  
**Correcta: c**  
Explicación: es la ruta de parametrización indicada para cobros, pagos y cheques. (494, 520, 534)

6. Si en una remesa se agregan un efecto tipo cheque y un efecto tipo `TF`, ¿qué ocurre?  
a) Se compensan automáticamente  
b) Evolucionan en dos tesorerías  
c) No van a poder evolucionar juntos  
d) Se convierten en pagaré  
**Correcta: c**  
Explicación: para evolucionar, los efectos de la remesa deben tener el mismo tipo de efecto. (1317, 1331, 1341)

7. Al evolucionar el estado de una remesa, se genera…  
a) Solo extracto bancario  
b) Asiento contable y tesorería (`tabla Cuen`)  
c) Solo registros fiscales  
d) Una factura rectificativa  
**Correcta: b**  
Explicación: la remesa evolucionada genera asiento contable y tesorería. (619, 628, 644, 655)

8. El extracto bancario se denomina en el sistema como…  
a) `textra`  
b) `cefectos`  
c) `cremesas`  
d) `casientos`  
**Correcta: a**  
Explicación: se menciona que su nomenclatura es `textra`. (137)

9. ¿Qué atajo se menciona para abrir remesas?  
a) `C cefectos`  
b) `textra`  
c) `C remesos`  
d) `C asientos`  
**Correcta: c**  
Explicación: se indica el atajo `C remesos`; además existe la ruta Finanzas › Cobros y pagos › Remesas › Registros de remesas. (970, 982, 1011)

10. Si al contabilizar aparece un error por tipo de asiento, en compras se debe usar…  
a) `FB`  
b) `EPC`  
c) `TF`  
d) `C-fectos`  
**Correcta: b**  
Explicación: en compras se usa `EPC`; para ventas se usaría `FB`. (1220, 1250, 1255)

11. La conciliación bancaria compara…  
a) factura con remesa  
b) tesorería/contabilidad interna con extracto bancario  
c) cartera de efectos con registros fiscales  
d) factura rectificativa con sustitutiva  
**Correcta: b**  
Explicación: es una contrapartida entre tu tesorería como empresa y el extracto del banco. (171, 184, 190)

12. ¿Se pueden pagar varias facturas en una sola remesa?  
a) No, solo una factura  
b) Sí, siempre que los efectos tengan el mismo tipo de efecto  
c) Sí, sin importar el tipo de efecto  
d) Solo si son facturas de venta  
**Correcta: b**  
Explicación: se puede pagar/cobrar varias facturas, pero no se pueden mezclar diferentes tipos de efecto. (1317, 1387, 1411)