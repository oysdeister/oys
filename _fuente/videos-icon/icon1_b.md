## 4. Conceptos clave

- Existen dos módulos: **gestión** y **finanzas**. En gestión se crean facturas con origen albarán/pedido/solicitud; en finanzas también se pueden crear facturas directas sin ese origen (s. 8, 21, 30, 621, 637).
- **Contabilizar una factura genera tres cosas**: asiento contable, cartera de efectos y registros fiscales (s. 74, 86, 781).
- El asiento contable contiene **debe y haber** y debe quedar cuadrado: si sale 1.000 de la empresa es porque entraron 1.000 por otro lado (s. 91, 96, 2051, 2054).
- La **cartera de efectos** es el importe pendiente de pago o cobro de la factura; ese importe es el que luego debe aparecer en la remesa para remesarse (s. 103, 113, 1934).
- Los **registros fiscales** son los impuestos; en el ejemplo se ve IVA 21%, base imponible y total (s. 123, 125, 128, 133).
- La **remesa** sirve para cobrar o pagar facturas. Si la factura es de compra se usa clase **pagar**; si es de venta, clase **cobrar** (s. 148, 1332, 1470, 1475).
- El **maestro de empresas** (`C-Empresa`, dentro de finanzas) se usa para parametrizar la empresa: tercero, plan contable, ID fiscal, ejercicio contable y bancos propios (s. 157, 183, 316, 347, 366, 393).
- Al crear la empresa hay que crear el **ejercicio contable**; si la empresa existiera desde años anteriores, habría que añadir también los ejercicios previos (s. 366, 377, 386).
- En **bancos propios** se configura una cuenta financiera, por ejemplo la cuenta **57.9 Fondos en Movimiento para Bancos**, para usarla en remesas (s. 393, 401, 446, 473).
- Para que aparezca el tipo de remesa hay que configurar en bancos propios la opción **“remesas por cuenta”** con cobro/pago de tesorería según corresponda (s. 1503, 1515, 1520, 1526).
- Las facturas directas de finanzas usan tipo **FC para compras** y **FB para ventas**; hay que indicar empresa, proveedor/cliente y una cuenta financiera en datos financieros (s. 651, 681, 693, 805, 831).
- En factura directa, si el **importe total** no coincide con el **importe factura**, no se activa el botón de contabilizar (s. 755, 762, 766).
- La **factura rectificativa** sirve para modificar o corregir sin anular (descuentos, importe mal, etc.). La **factura sustitutiva** sirve para anular definitivamente la factura inicial (s. 1113, 1154, 1163).
- En España debe quedar **registro de todo lo que sucede con la factura**; por eso se usan rectificativas/sustitutivas en lugar de eliminar y crear otra (s. 1125, 1135).
- Una factura rectificativa **sí queda vinculada al documento original**; va dentro del DocFlow del circuito (s. 1291, 1308).

## 5. Problemas típicos

- **La factura directa de venta no validaba/contabilizaba en el training.** Al validar una factura de venta directa no la dejaba contabilizar y salía un error tipo FAQ ID 2. (usuario) indica que es un error del entorno de training y que lo verá con sistemas; en plataforma normal no debería suceder (s. 878, 1032, 1035, 1192).
- **Duda de un alumno: ¿la factura rectificativa es parte del flujo original o va separada?** Se resolvió diciendo que sí va vinculada al documento original y dentro del DocFlow que se está construyendo (s. 1280, 1291, 1308).
- **En la remesa no cargaba ningún efecto al filtrar por tercero.** La factura estaba con tipo de efecto **cheque** y la remesa estaba configurada como **transferencia**; al no coincidir, el efecto no “jala” a la remesa (s. 1584, 1601, 1627, 1633, 1642).
- **Si no configuras “remesas por cuenta” en bancos propios, no aparece el tipo de remesa.** Hay que añadir en el maestro de empresas > bancos propios > remesas por cuenta tanto el cobro como el pago de tesorería (s. 1482, 1487, 1503, 1515, 1520, 1545).
- **Si el importe factura no coincide con el importe total, no se activa el botón de contabilizar.** En la factura directa debe revisarse que ambos importes coincidan antes de validar (s. 755, 762, 766).
- **Al rehacer/probar la remesa se borraba información.** Se comenta que la remesa estaba parametrizada con cheque y por la configuración se perdía lo cargado; se opta por probar con otra factura/configuración (s. 1662, 1664, 1670).

## 6. Preguntas de test

1. **¿Qué tres elementos genera contabilizar una factura?**  
   A. Pedido, albarán y factura directa  
   B. Asiento contable, cartera de efectos y registros fiscales  
   C. Banco propio, cuenta financiera y remesa  
   D. Factura rectificativa, sustitutiva y DocFlow  
   **Correcta: B.** Se repite al contabilizar: asiento contable, cartera de efectos y registros fiscales (s. 74, 86, 781).

2. **¿Para qué sirve una remesa?**  
   A. Crear facturas directas en finanzas  
   B. Parametrizar el maestro de empresas  
   C. Cobrar o pagar facturas  
   D. Generar registros fiscales  
   **Correcta: C.** La remesa sirve para cobrar o pagar facturas (s. 148, 1332).

3. **Si tienes una factura de compra que debes pagar, ¿qué clase de remesa debes usar?**  
   A. Cobrar  
   B. Pagar  
   C. Rectificativa  
   D. Sustitutiva  
   **Correcta: B.** Como es factura de compra, se usa la clase “pagar” (s. 1470, 1475).

4. **¿Qué se debe configurar en el maestro de empresas para que aparezca el tipo de remesa?**  
   A. El plan contable de España  
   B. El ID fiscal del tercero  
   C. En bancos propios, la opción “remesas por cuenta”  
   D. La fecha de apertura del ejercicio contable  
   **Correcta: C.** En bancos propios se añade/remesa por cuenta con cobro o pago de tesorería (s. 1503, 1515).

5. **En una factura directa, ¿qué condición debe darse para que se active el botón de contabilizar?**  
   A. Tener creado antes el albarán  
   B. Que el importe total coincida con el importe factura  
   C. Tener configurada una factura rectificativa  
   D. Usar siempre el proveedor Casanova  
   **Correcta: B.** Si no coinciden “importe factura” e “importe total”, no se activa contabilizar (s. 755, 762, 766).

6. **¿Cuál es la diferencia entre factura rectificativa y sustitutiva?**  
   A. La rectificativa se usa para eliminar facturas y la sustitutiva solo para descuentos  
   B. La rectificativa modifica/corrige sin romper el registro y la sustitutiva anula definitivamente la factura inicial  
   C. La sustitutiva es de Perú y la rectificativa es de España  
   D. Las dos sirven para pagar facturas de compra  
   **Correcta: B.** La rectificativa se usa para modificaciones como descuentos o importe mal; la sustitutiva para anular definitivamente (s. 1113, 1154, 1163).

7. **¿Qué es la cartera de efectos?**  
   A. El IVA de la factura  
   B. El debe y haber del asiento  
   C. El banco propio de la empresa  
   D. El monto pendiente de pagar/cobrar que luego se lleva a la remesa  
   **Correcta: D.** La cartera de efectos es el monto por pagar/cobrar de la factura que debe aparecer en la remesa (s. 103, 113, 1934).

8. **En la remesa no se cargaba el efecto. ¿Cuál fue la causa?**  
   A. La fecha de la remesa no era editable  
   B. El tipo de efecto de la factura era cheque y la remesa estaba como transferencia  
   C. Faltaba el ID fiscal en `C-Empresa`  
   D. El ejercicio contable era 2026  
   **Correcta: B.** Si el tipo de efecto no coincide con el tipo de remesa configurado, el efecto no jala (s. 1627, 1633, 1642).

9. **¿La factura rectificativa está vinculada al flujo original?**  
   A. No, es un documento totalmente separado  
   B. Solo si es de ventas  
   C. Sí, va vinculada dentro del DocFlow  
   D. Solo si se crea en gestión  
   **Correcta: C.** Se indica que va vinculada al DocFlow del circuito original (s. 1291, 1308).

10. **¿Qué pueden hacer en el módulo de finanzas respecto a las facturas?**  
    A. Crear facturas directas sin origen albarán/pedido/solicitud  
    B. Solo contabilizar facturas de gestión  
    C. Eliminar facturas sin dejar registro en España  
    D. Crear únicamente remesas, nunca facturas  
    **Correcta: A.** En finanzas se pueden crear facturas directas, sin necesidad de origen albarán o pedido (s. 30, 621, 637).

11. **¿Qué cuenta financiera menciona la instructora para el banco propio?**  
    A. 430 Clientes  
    B. 410 Proveedores  
    C. 57.9 Fondos en Movimiento para los Bancos  
    D. 470 Hacienda Pública deudora  
    **Correcta: C.** Indica usar la cuenta 57.9 para el banco (s. 446, 473).

12. **¿Qué tipos de factura directa se mencionan para compras y ventas?**  
    A. FC para compras y FB para ventas  
    B. FB para compras y FC para ventas  
    C. FV para ventas y FP para compras  
    D. FD para directas y FR para rectificativas  
    **Correcta: A.** FC se usa porque es factura de compras; FB es factura de ventas (s. 651, 805).