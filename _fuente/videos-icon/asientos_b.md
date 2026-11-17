## 4. Conceptos clave

- Las tipologías de documentos —pedidos, albaranes, facturas, anticipos, movimientos internos— son donde se indica qué asiento debe generar cada documento si lo necesita (s. 29, 38).
- La pestaña **Contabilización** de una tipología es donde se configura la huella contable del documento (s. 12, 26).
- En albaranes existen varios tipos de asiento según la operación: asientos fijos, albaranes no facturados, provisión de servicios, etc. (s. 14, 19, 23).
- El indicador **Generar inmovilizado** conecta la tipología con Icon/activos permanentes (s. 28, 132).
- El inmovilizado se puede generar en dos momentos: al **validar** o al **contabilizar** el documento (s. 57, 99).
- El circuito normal del documento es: nace provisional, se valida y después se contabiliza (s. 60, 66).
- Para que se cree la ficha de activo se necesitan dos configuraciones: tipología con **Generar inmovilizado** y familia del artículo con **código de bien** y **serie** (s. 140, 177).
- La estructura de activos en Icon es jerárquica: **bienes → elementos → componentes** (s. 184, 294).
- El **bien** agrupa grupo de inmovilizado, grupo contable, serie y grupo fiscal (s. 195, 222, 238).
- El **grupo contable** contiene un paquete de seis cuentas contables (s. 203, 209).
- El **grupo fiscal** define el porcentaje o los años de depreciación/amortización del activo (s. 242, 246).
- El sistema propone como inicio de depreciación el primer día del mes siguiente a la compra, pero se puede modificar (s. 308, 316).
- Al contabilizar con la configuración, las fichas de Icon se crean automáticamente; desde componentes se puede volver al documento origen (s. 346, 354).
- Trabajando solo con Icon, habría que crear manualmente bien, elemento y componente (s. 339, 343).
- En estándar, si el servicio de instalación tiene su propia familia parametrizada, crea una ficha distinta; en la variante comentada se pueden vincular líneas para crear una sola ficha (s. 393, 421).

## 5. Problemas típicos

- **Familia del artículo sin parametrizar**: si la familia no tiene configurado *parámetros de inmovilizado* con código de bien y serie, no se crea ninguna ficha de activo (s. 172). Se resuelve completando esos dos datos obligatorios.
- **Indicador de la tipología apagado**: si la tipología de factura no tiene marcado *Generar inmovilizado*, la factura se contabiliza normalmente pero no crea componentes ni elementos (s. 174). Se resuelve activando el indicador y eligiendo validación o contabilización.
- **Duda con ítems de instalación**: un alumno preguntó qué pasa con el servicio de instalación al convertirse en bien (s. 371). Respuesta: depende de la familia del artículo; en estándar, cada artículo/servicio con su propia parametrización crea una ficha distinta, y la variante particular permite vincular líneas para no crear dos fichas (s. 393, 421).
- **Confusión con la fecha de depreciación**: la fecha de inicio de depreciación no tiene por qué coincidir con la compra; el sistema propone el primer día del mes siguiente y puede cambiarse manualmente (s. 307, 316).
- **Alta manual en Icon**: si no se aprovecha la integración, hay que crear a mano bien, elemento y componente (s. 338, 343).

## 6. Preguntas de test

1. ¿Dónde se configura qué asiento debe generar un documento?  
A. En la ficha del artículo  
B. En la pestaña Contabilización de la tipología  
C. En el maestro de proveedores  
D. En el módulo de cartera  
**Correcta: B**  
Explicación: la sesión indica que en las tipologías y su pestaña de contabilización se define qué asiento debe generarse (s. 12, 29).

2. ¿Qué indicador de la pestaña Contabilización conecta con Icon/activos permanentes?  
A. Albaranes no facturados  
B. Asientos fijos  
C. Generar inmovilizado  
D. Cuenta puente  
**Correcta: C**  
Explicación: el indicador *Generar inmovilizado* se conecta con tablas de Icon y crea la ficha de activo (s. 28, 132).

3. ¿En qué dos momentos puede generarse el inmovilizado?  
A. Al imprimir y al enviar  
B. Al validar o al contabilizar  
C. Al pedir y al cobrar  
D. Al archivar y al anular  
**Correcta: B**  
Explicación: la tipología permite elegir entre generar el inmovilizado al validar o al contabilizar (s. 57, 99).

4. ¿Qué configuraciones previas son imprescindibles para que se cree la ficha de activo?  
A. Tipología con *Generar inmovilizado* y familia del artículo con código de bien y serie  
B. Proveedor con RUC y factura validada  
C. Pedido y albarán facturados  
D. Grupo contable y cuenta puente  
**Correcta: A**  
Explicación: se necesita la tipología marcada y la familia del artículo con código de bien y serie obligatorios (s. 140, 177).

5. Si la tipología de factura no tiene marcado el indicador *Generar inmovilizado*, ¿qué ocurre?  
A. Se crea un componente sin elemento  
B. Da error al contabilizar  
C. Simplemente contabiliza y no crea ficha de activo  
D. Crea bien y elemento, pero no componente  
**Correcta: C**  
Explicación: la factura se contabiliza normalmente, pero no genera las fichas de Icon (s. 174).

6. ¿Cuál es la jerarquía de activos en Icon que se explica?  
A. Bienes → elementos → componentes  
B. Componentes → bienes → elementos  
C. Elementos → componentes → bienes  
D. Bienes → componentes → elementos  
**Correcta: A**  
Explicación: los bienes agrupan elementos y los elementos contienen componentes; la factura enlaza con componentes (s. 184, 294).

7. ¿Cuántas cuentas forman el grupo contable de un bien?  
A. Dos  
B. Cuatro  
C. Seis  
D. Ocho  
**Correcta: C**  
Explicación: se indica exactamente que el grupo contable es un paquete de seis cuentas (s. 203, 209).

8. ¿Qué dato define el porcentaje o los años de depreciación del activo?  
A. Grupo de inmovilizado  
B. Grupo contable  
C. Serie  
D. Grupo fiscal  
**Correcta: D**  
Explicación: el grupo fiscal tiene código, descripción, porcentaje y años para el consumo/depreciación del bien (s. 242, 246).

9. ¿Qué propone el sistema como fecha de inicio de depreciación?  
A. La fecha del pedido  
B. La fecha de contabilización  
C. El primer día del mes siguiente a la compra, y se puede modificar  
D. La fecha de factura sin posibilidad de cambio  
**Correcta: C**  
Explicación: el sistema propone el primer día del mes siguiente a la compra, pero el usuario puede cambiarla (s. 308, 316).

10. Según la respuesta a la duda del alumno, ¿qué pasa en estándar con un servicio de instalación que tiene su propia familia parametrizada?  
A. Se ignora  
B. Crea una ficha/componente distinto  
C. Se suma automáticamente al ascensor  
D. No se puede facturar  
**Correcta: B**  
Explicación: en estándar, cada artículo/servicio con su propia parametrización crea una ficha distinta (s. 393, 421).