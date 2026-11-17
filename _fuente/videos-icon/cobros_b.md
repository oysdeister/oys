## 4. Conceptos clave
- La parametrización previa existe para poder gestionar un cobro o un pago; a eso se le llama cartera (s 0).
- Al registrar una factura se heredan condiciones de pago desde la ficha del tercero: tipo de efecto y días de vencimiento (s 53; s 126).
- El “efecto” equivale al medio de pago: transferencia, contado, cheque, pagaré, factoring, letra, giro, etc. (s 271).
- En la ficha del tercero se configuran dos bloques clave para cartera: datos bancarios y condiciones comerciales (s 126).
- El “perceptor” permite indicar si cobra/paga el mismo tercero u otro diferente; si se deja vacío, es el mismo tercero (s 177; s 233).
- Las condiciones comerciales definen clase pago/cobro, tipo de efecto, estado inicial y vencimiento en días/meses/efectivo (s 239).
- Los estados controlan el ciclo de tesorería: pendiente, autorizado, ordenado, pagado/cobrado (s 596).
- El indicador de caducidad en un estado indica si el documento ya finalizó su ciclo; “sí” implica que no aparecerá como pendiente (s 699).
- Los maestros de tipos y estados se conectan mediante “estados iniciales por tipos”; por ejemplo, transferencia puede tener estados iniciales pendiente y bloqueado (s 846).
- Al contabilizar una factura se habilitan las pestañas de apuntes contables y cartera de efectos; si se descontabiliza, desaparecen (s 986; s 1000).
- La tabla de cartera de efectos es `cefectos` y consolida empresa, fechas, vencimiento, tercero, tipo de efecto, estado, importes, impuestos y perceptor (s 1026).
- Los botones de cartera cambian según el tipo de efecto; no es lo mismo transferencia, cheque o letra (s 1298).
- Una acción sirve para evolucionar un efecto de un estado a otro, por ejemplo de pendiente a pagado (s 1344).
- La acción “pago directo en efectivo” mostrada cambia el efecto a efectivo, estado pagado y caducidad sí (s 1495).
- Cada manipulación en cartera deja trazabilidad en la pestaña de histórico (s 1547).
- Los botones/acciones se configuran en Finanzas › Cobros y pagos › Maestros › Acciones; allí se define descripción, estado final, efecto final, asiento y si es individual o masiva (s 1694; s 1750).
- La gestión masiva permite seleccionar varios efectos, agregarlos y cerrar la gestión para pagarlos/cobrarlos en lote (s 1924).
- Si una acción se ejecutó de forma masiva, no se retrocede con el botón individual; hay que abrir la gestión y actualizar desde los efectos (s 2196; s 2247).
- Los intereses por pago a terceros pueden configurarse en el maestro de efectos o gestionarse desde la propia acción (s 1433).

## 5. Problemas típicos
- **Duda de alumno: intereses por tipo de efecto.** Iván pregunta si se pueden configurar intereses por pago a terceros según el tipo de efecto (s 1423). Se responde que sí: en el maestro de efectos o mediante la propia acción (s 1433).
- **Un efecto bloqueado no permite ejecutar la acción mostrada.** La acción configurada para estado pendiente no se ejecuta si el estado no es pendiente, por ejemplo bloqueado (s 1882). Solución: gestionar efectos que estén en el estado origen esperado.
- **Al descontabilizar desaparece la cartera de efectos.** Se hace la prueba de descontabilizar y dejan de verse las tablas; solo al contabilizar se habilitan apuntes y cartera (s 986; s 1000).
- **Configuración de cuenta financiera en pago directo.** Al ejecutar “pago directo en efectivo”, el ponente detecta: “esto está mal configurado, no debería permitirme colocar la cuenta” (s 1659). No se corrige en la demo; se continúa con el ejemplo.
- **El selector de efectos se queja / falta un dato.** Al seleccionar efectos aparece “algo me está faltando” (s 2053) y se sospecha que se está jalando información de la gestión anterior (s 2073). Se resuelve creando una gestión nueva desde el botón nuevo (s 2078).
- **Error gestionando varios efectos a la vez.** Al intentar cerrar una gestión con varios efectos, el sistema da problema: “tengo un problema ahorita gestionando varios efectos, tengo que revisarlo” (s 2364). No se resuelve en el momento; se aclara que están en entorno de desarrollo (s 2333).
- **Pago masivo y retroceso individual.** Después de pagar de forma masiva no se puede retroceder desde el documento individual (s 2196). Solución: abrir la gestión y actualizar desde los efectos para volver a habilitar opciones (s 2196; s 2247).

## 6. Preguntas de test
1. ¿Qué es un “tipo de efecto” en Axional?  
a) Un estado de caducidad de la factura.  
b) Un medio de pago como transferencia, cheque, pagaré o letra.  
c) La fecha de vencimiento de una factura.  
d) El código de cuenta financiera.  
**Correcta: b.** Se define como medio de pago: transferencia, contado, pagaré, cheque, factoring, letra, etc. (s 271).

2. ¿De dónde se heredan las condiciones de pago al registrar una factura?  
a) Del maestro de acciones.  
b) De la pestaña de histórico.  
c) De la ficha del tercero, en condiciones comerciales.  
d) Del selector de gestión masiva.  
**Correcta: c.** La factura toma condiciones como tipo de efecto y días desde la ficha del tercero (s 126; s 239).

3. ¿Qué es el “perceptor” en la ficha del tercero?  
a) El banco que financia la operación.  
b) El tercero que recibe el cobro/pago, que puede ser distinto al titular de la ficha.  
c) La cuenta contable del efecto.  
d) El indicador de caducidad.  
**Correcta: b.** Permite definir si paga/cobra el mismo tercero u otro diferente; vacío equivale al mismo tercero (s 177; s 233).

4. ¿Qué significa el indicador de caducidad “sí” en un estado?  
a) Que el documento sigue pendiente.  
b) Que el documento está propuesto en remesa.  
c) Que el cobro/pago está caducado y no aparecerá en pendientes.  
d) Que el efecto está bloqueado.  
**Correcta: c.** Si la caducidad es “sí”, el ciclo finalizó y no requiere más gestión (s 699).

5. Al contabilizar una factura, ¿qué ocurre en la pantalla de factura?  
a) Se borra la pestaña de apuntes contables.  
b) Se habilitan apuntes contables y cartera de efectos.  
c) Se genera automáticamente una remesa bancaria.  
d) Se paga directamente en efectivo.  
**Correcta: b.** Al contabilizar se habilitan las tablas de apuntes y cartera de efectos (s 1000).

6. Si el tercero tiene vencimientos particionados, ¿qué se genera?  
a) Una única línea consolidada de vencimiento.  
b) Varias líneas de vencimiento y un efecto por cada vencimiento.  
c) Solo una línea de impuestos.  
d) Nada hasta cerrar la gestión.  
**Correcta: b.** Si el vencimiento está dividido en partes, se generan varias líneas y un efecto por cada vencimiento (s 1221).

7. ¿Qué acción mostrada deja el efecto en “efectivo” y estado “pagado”?  
a) Autorizar.  
b) Ordenar al pago.  
c) Pago directo en efectivo.  
d) Devolución.  
**Correcta: c.** Al ejecutar “pago directo en efectivo”, el efecto cambia a efectivo, pagado y caducidad sí (s 1495).

8. ¿Dónde se configura el botón “pago directo en efectivo”?  
a) En la ficha del tercero.  
b) En Finanzas › Cobros y pagos › Maestros › Acciones.  
c) En la pestaña de vencimientos.  
d) En el maestro de bancos.  
**Correcta: b.** Los botones provienen de una acción configurada en ese menú (s 1694).

9. ¿Qué diferencia hay entre ejecutar la acción por botón y por gestión masiva?  
a) El botón no genera histórico.  
b) La gestión masiva permite seleccionar y procesar varios efectos a la vez; el botón es individual.  
c) El botón solo sirve para devoluciones.  
d) No hay ninguna diferencia.  
**Correcta: b.** La acción puede ejecutarse individualmente o de manera masiva mediante una gestión (s 1750; s 1924).

10. Si un efecto se pagó de forma masiva, ¿cómo se retrocede?  
a) Pulsando el botón retroceder del documento.  
b) Eliminando la factura.  
c) Abriendo la gestión y actualizando desde los efectos.  
d) Contabilizando de nuevo la factura.  
**Correcta: c.** Tras una gestión masiva no se retrocede individualmente; se abre la gestión y se actualiza en efectos (s 2196).

11. Según la consulta de Iván, ¿dónde se pueden configurar intereses por pago a terceros?  
a) Solo en la pestaña de vencimientos.  
b) En el maestro de efectos o a través de la propia acción.  
c) Solo en la cuenta bancaria.  
d) No se pueden configurar intereses.  
**Correcta: b.** Se pueden configurar en el maestro de efectos y también mediante la acción (s 1433).

12. Los indicadores “ordenado” y “propuesto” sirven para:  
a) Identificar que alguien ya está gestionando ciertos efectos y evitar que otro los toque.  
b) Confirmar que un efecto ya está pagado.  
c) Definir la cuenta financiera.  
d) Calcular el tipo de cambio.  
**Correcta: a.** Son marcas para evitar que dos personas gestionen el mismo paquete de efectos (s 690).