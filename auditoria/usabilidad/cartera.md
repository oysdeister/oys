# Lectura en contexto y en orden: Módulo 5 «Cartera, cobros y pagos»

Zona revisada: lo que sale en el volcado `05-carteras.md` (página del módulo y 18 bloques de `carteras.json`), la entrada `carteras` de `portadaDatos.ts` y de `etapas.ts`, `examenes/carteras.json` y `glosario/carteras.json`. No se han tocado los bloques de `carteras.json` que se ven en Tesorería (`icon-cartera-v-8` a `v-11`).

El problema de fondo es la unión de los dos módulos antiguos. Varios bloques arrancaban como si fueran el inicio del módulo: «Una remesa es un paquete…» en los bloques 10 y 11, «Un efecto es…» en el 14 y «La cartera es…» en el 18. Otros repetían una parte de un bloque anterior sin decir que era un repaso. Y muchas partes remitían a «los pasos de arriba» o al «cuadro de arriba», que no existen en la pestaña donde se leen (Guiado no muestra los avisos). Además, en cinco partes la `explicacion` repetía uno a uno los pasos.

## Página del módulo (#/modulo/carteras)

| Dónde | Qué falla | Por qué | Antes → después (resumido) | Estado |
|---|---|---|---|---|
| portadaDatos › frase | No dice qué es la cartera; empieza por «Sigues los vencimientos (efectos)…» | Criterio 1: la primera frase dice qué es y para qué sirve | «Sigues los vencimientos…» → «La cartera es la lista de lo que la empresa tiene pendiente de cobrar y de pagar: un efecto por cada vencimiento… Aquí sigues cada efecto…» | corregido |
| resumen (JSON) | Habla de «TRI» sin explicarlo y dice que todos los bloques, salvo cuatro, son del vídeo (falso: cobro parcial, SEPA, impagado y descuento usan la demo) | Término no explicado y dato que ya no es cierto | «…los cuatro primeros de TRI…» → «Varios bloques salen de sesiones grabadas… y lo avisan» | corregido |
| resumen (JSON) | El orden no coincide con las etapas (cobro parcial y SEPA salían mezclados) | Criterio 6 | Reordenado: Cobrar y pagar → Remesas → Impagados → Para saber más | corregido |
| portadaDatos › aprendes 3 | No menciona los impagados (una etapa entera) | El título no coincide con el contenido | «…y llevarlos a tesorería.» → «…llevarlos a tesorería y registrar un recibo devuelto.» | corregido |
| portadaDatos › circuito 1, 3 y 4 (`d`) | Frases sin verbo («Cuándo se paga, con qué tipo de efecto, y la forma…», «La cuenta por la que…», «Un efecto suelto, varios…») | Frases huérfanas | P. ej. «La cuenta por la que se cobra…» → «Es la cuenta por la que se cobra o se paga. Solo admite los tipos de remesa que le añades.» | corregido |
| Lo básico › «Qué es la cartera» › explicación 7-12 | El «Orden de los bloques» no sigue `etapas.ts`: falta el cobro parcial, falta SEPA, faltan los impagados y presenta Tesorería como si fuera parte del módulo | Criterios 4 y 6 | Seis líneas rehechas con los nombres de las etapas: Preparar, Ver la cartera, Cobrar y pagar, Remesas, Impagados, Para saber más | corregido |
| Lo básico › «Cómo moverte» › explicación 8 | «En las tablas de campos de este manual» | Resto de otro contexto | → «de los bloques» | corregido |
| etapas.ts › `que` de 5 etapas | Sin verbo («Plazos, tipos de efecto y bancos propios.») o incompletas: «Remesas» no cita la tesorería ni SEPA; «Cobrar y pagar» no cita el cierre de la gestión | Criterios 1 y 4 | P. ej. «Agrupas efectos en una remesa y la llevas al banco.» → «Preparas el banco, creas y ordenas una remesa de pago, ves cómo pasa a tesorería y cobras un recibo domiciliado con mandato SEPA.» | corregido |

## Bloque 1 «Definir plazos de pago y tipos de efecto» (carteras-1)

| Dónde | Qué falla | Por qué | Antes → después (resumido) | Estado |
|---|---|---|---|---|
| Parte «Crear el tipo de efecto» › campo 2 | El ejemplo del código es CAR{INI}, que pasa de 3 caracteres y no es el código del bloque | Contradice el texto, el aviso y el test | Ej. CAR{INI} → E{INI} | corregido |
| Misma parte › paso 4 › detalle | «Déjalo como viene en los bloques Riesgo y Tesorería» | «Bloque» usado para un grupo de campos | → «Deja como vienen los grupos de campos Riesgo y Tesorería» | corregido |
| Parte «Registrar una factura de compra» › explicación | El «Ojo» sobre el IVA en la demo iba antes de decir qué pantalla es | Criterio 6: el aviso va donde se necesita | El «Ojo» pasa al final de la lista | corregido |
| Misma parte › paso 11 › detalle | «Lo del IVA, en el cuadro «En la demo / En una empresa real» de arriba» | Ese cuadro no existe y en Guiado no hay nada encima | → «…lo explica el recuadro «Ojo» de esta parte, en la pestaña Concepto» | corregido |
| Paso 4 › pregunta De memoria | «¿Dónde está el bloque para clasificar…?» | «Bloque» por grupo de campos | No se toca: es una `pregunta` | duda |

## Bloque 2 «Dar de alta bancos propios y cajas» (carteras-3)

| Dónde | Qué falla | Por qué | Antes → después (resumido) | Estado |
|---|---|---|---|---|
| Concepto › Ejemplo | «el cobro de 121,00 del efecto 1 y el del efecto 2»: el «efecto 1 y 2» todavía no se ha presentado | Criterio 3 | → «el cobro de los 242,00 de C{INI}, que llegan en dos efectos de 121,00: uno suelto y otro por remesa» | corregido |
| Parte «caja» › campo 6 | Ej. «{INI}» cuando la agrupación es AG{INI} | Incoherente con los pasos y el checklist | → AG{INI} | corregido |
| Parte «banco» › paso 3 › detalle | «Lee el aviso de abajo»: en Guiado no hay avisos | Remite a algo que no está | → «…lo ves en el último paso de esta parte» | corregido |

## Bloque 3 «Ver los efectos de una factura» (icon-cartera-v-1)

| Dónde | Qué falla | Por qué | Antes → después (resumido) | Estado |
|---|---|---|---|---|
| Concepto, párrafo 2 | Usa «forma de pago» sin decir que es el plazo de pago del bloque 1 | Criterio 3 | Se añade: «La forma de pago es el plazo de pago que creaste en… en esta pantalla se llama así» | corregido |
| Concepto, párrafo 3 | «…TF a 90 días… Lo viste en el bloque «Definir plazos…»»: allí no se vio TF ni 90 días | Remite a algo que no se hizo | → «Es lo mismo que viste con tu factura de CAR{INI}: el tipo E{INI} y el plazo V{INI} dejaron tres efectos PE» | corregido |
| Parte «Revisar la factura» › paso 1 | Anuncia los tres efectos en una parte que solo mira la factura | Salto de tema | → «verás el proveedor CAR{INI} y el importe 121,00; sus tres efectos los abres en la parte siguiente» | corregido |
| Partes 1 y 2 › avisos | El mismo aviso («Si la factura no está contabilizada, no verás la pestaña…») en dos partes seguidas | Criterio 5 | En la parte 1: «Si tu factura sigue en borrador, contabilízala antes…» | corregido |
| Parte «Abrir la cartera» › explicación 1 y aviso 1 | Dice que la cartera está en «Movimientos»; el bloque 4 avisa de que en la demo actual está en «Cobros y Pagos» | Contradicción entre bloques seguidos | Explicación: «En la base del vídeo está en… Movimientos; en la demo actual… Cobros y Pagos». Aviso reescrito | corregido |
| Concepto y pasos | El desplegable se llama «Cartera» aquí y «Cartera de efectos» en el bloque 1 | Posible rótulo distinto | No se toca: no está comprobado en la demo | duda |

## Bloque 4 «Conocer los estados y tipos de efecto» (icon-cartera-1)

| Dónde | Qué falla | Por qué | Antes → después (resumido) | Estado |
|---|---|---|---|---|
| Concepto | El «Fíjate» sobre Cobrar/Pagar cortaba la secuencia estado → tipo → acción → enlace | Criterio 2 | Se mueve detrás del enlace contable | corregido |
| Parte «Acciones y enlaces» › explicación 4 | Nombra «la plantilla Excel», que se explicaba dos párrafos más abajo | Criterio 3 | Se sube el párrafo del libro Excel; actlog dice «el libro Excel de la plantilla» | corregido |

## Bloque 5 «Cobrar efectos sueltos y en remesa» (carteras-5)

| Dónde | Qué falla | Por qué | Antes → después (resumido) | Estado |
|---|---|---|---|---|
| Parte 1 «Repasar los estados…» › paraQueSirve | Repite el bloque 4 como si fuera nuevo | Repetición por la fusión | → «Es un repaso rápido de «Conocer los estados y tipos de efecto»… Aquí solo localizas las acciones que vas a usar» | corregido |
| Parte «artículo» › paraQueSirve | «conceptos que no pasan por gestión»: se confunde con la «gestión sobre efectos» del mismo bloque | Término ambiguo | → «que no pasan por pedido ni albarán» | corregido |
| Parte «factura de venta» › explicación 5 | «El anticipo tiene su propio circuito»: el anticipo no ha salido | Frase huérfana | → «Usas una factura normal, no un anticipo… Los anticipos… en «Para saber más»» | corregido |
| Parte «cobro suelto» › paso 1 | «lee el aviso de abajo» (Guiado) | Remite a algo que no está | → «el paso siguiente explica por qué» | corregido |
| Partes «cobro suelto» y «preparar el banco» › aviso solución | «como en los pasos de arriba»: los avisos se leen en Concepto, sin pasos encima | Ídem | → «como en los pasos del Guiado» | corregido |
| Parte «remesa» › explicación | El «Ojo» de la 23000 iba antes de presentar la pantalla | Criterio 6 | Pasa al final | corregido |
| Parte «remesa» › paso 11 | «lee el cuadro de arriba» | Ídem | → «la explica el recuadro «Ojo» de esta parte, en la pestaña Concepto» | corregido |

## Bloques 6 a 9 (pagos, cierre y cobro parcial)

| Dónde | Qué falla | Por qué | Antes → después (resumido) | Estado |
|---|---|---|---|---|
| B7 «Pagar efectos con una gestión» › concepto | «Tras pagarlo, el efecto ya no tiene «Retroceder»…» quedaba descolgado tras el Ejemplo | Criterio 2 | Se sube antes del Ejemplo | corregido |
| B8 «Entender el cierre» › parte 2 › explicación 5 | Presenta actlog como nuevo («Un ajuste interno…»), pero ya salió en el bloque 4 | Repetición | → «El ajuste actlog, que viste en «Conocer los estados…», decide…» | corregido |
| B9 «Cobrar solo una parte» › parte 1 › explicación 1 | Propone usar «el de 242,00 de tu factura», que ya se cobró en el bloque 5 | Lleva al alumno a un efecto que no existe | → «Los de «Cobrar efectos sueltos…» ya están cobrados: si no te queda ninguno… haz otra factura de 242,00» | corregido |
| B9 › parte 1 › explicación 2 | Repite los pasos 1-3 («Abre la ruta y pulsa «Nuevo»…») | Criterio 5 | → «La cabecera es la misma que en el cobro suelto… Lo nuevo llega en la parte siguiente» | corregido |
| B9 › parte 2 › explicación 1-3 | Las tres explicaciones eran los tres pasos | Criterio 5 | Ahora explican la celda «Importe divisa», qué se ajusta y qué resume la cabecera | corregido |
| B9 › parte 3 › explicación 1 y 3 | Repiten los pasos («Pulsa «Cerrar»…», «desplegable › Asientos») | Criterio 5 | → «Al cerrar… como en el cobro suelto. Lo distinto es lo que pasa en la cartera» / «El asiento solo recoge lo cobrado…» | corregido |
| B9 › concepto › Ejemplo | «tus efectos son de 121,00»: no dice cuáles | Ambigüedad | → «los dos efectos de C{INI} son de 121,00» | corregido |

## Etapa «Remesas» (bloques 10 a 15)

| Dónde | Qué falla | Por qué | Antes → después (resumido) | Estado |
|---|---|---|---|---|
| B10 «Comprobar los tipos de remesa» › concepto, párrafo 1 | Empieza con «Una remesa es un paquete…», como si fuera la primera vez | Inicio de módulo dentro del módulo | → «Empieza la etapa de remesas. Ya cobraste con una en «Cobrar efectos sueltos…»… Ahora vas a pagar con una» | corregido |
| B10 › parte 1 › paraQueSirve | Habla de la cuenta PRVCC0, no del banco del alumno | Dato del vídeo sin puente | → «…tu banco BBVA_{INI}… En el vídeo es la cuenta PRVCC0» | corregido |
| B10 › parte 2 › explicación 3 | Tercera vez «PRVCC0 admite CCHET, CSCTT y PSCTT» | Criterio 5 | → cómo se lee cada código (C/P, medio, T/S) | corregido |
| B11 «Crear una remesa de pago» › concepto, párrafo 1 | Vuelve a definir la remesa | Ídem | → «Con tu banco listo, creas la remesa que paga a tu proveedor…» | corregido |
| B11 › parte 1 «Repasar los tipos…» › paraQueSirve | Repite entero el bloque anterior sin avisar | Repetición por la fusión | → «Es un repaso rápido del bloque anterior… Si ya lo comprobaste, pasa a la parte siguiente» | corregido |
| B11 › parte 4 › paraQueSirve | «el efecto de la factura de 00087 LABORATORIOS UNION» | El alumno agrega el de T{INI} | → «el efecto de 151,25 de T{INI}… En el vídeo es el de 00087…» | corregido |
| B11 › parte 4 › explicación 1 | Vuelve a presentar «Selección de efectos», que ya presentó la parte 3 | Criterio 5 | → «Partes de la pestaña… que filtraste en la parte anterior» | corregido |
| B13 «Resolver un efecto que no se remesa» › parte 1 › explicación 2 | «En la demo se evitó…», cuando el concepto dice «en el vídeo» | Origen del dato incoherente | → «En el vídeo se evitó…» | corregido |
| B14 «Entender cómo pasan los efectos a tesorería» › concepto | Arranca definiendo «efecto» sin enlazar con el movimiento que el alumno acaba de ver en el bloque 12 | Criterios 2 y 5 | Se añade el puente: «En «Evolucionar una remesa» viste que ordenar tu remesa creó un movimiento de -151,25. Aquí ves de dónde sale.» | corregido |
| B14 › parte 1 › explicación 3 | «(bloque Tesorería)» | «Bloque» por sección de la ficha | → «en la sección «Tesorería» de sus enlaces contables» | corregido |
| B14 › parte 1 › paso 2 | «mira el aviso de abajo» (Guiado) | Remite a algo que no está | → «si falta, sale «Cannot insert a null into column (taptcuen.fecval)»» | corregido |
| B15 «Domiciliar un cliente…» › parte «IBAN» › explicación 1-3 | Repiten los pasos (abrir, «Añadir banco», «Validar») | Criterio 5 | Ahora dicen dónde van los datos, que IBAN y banco van juntos y por qué hay que validar otra vez | corregido |
| B15 › parte «mandato» › explicación 1-2 | El «Ojo» del error iba primero y la explicación 2 repetía el paso 1 | Criterios 5 y 6 | → «El mandato se guarda en la ficha de C{INI}, pestaña «Mandato»»; el «Ojo» pasa al final | corregido |
| B15 › parte «mandato» › paso 6 | «como te avisamos arriba» | Remite a algo que no está, con voz de narrador | → «sale el error ID 15486 de la imagen. Está previsto y no es fallo tuyo» | corregido |
| B15 › parte «remesa» › explicación 1-5 | El «Ojo» iba primero y la 2-5 eran los pasos 2-5 | Criterios 5 y 6 | Ahora explican qué remesa es, por qué solo salen los efectos domiciliados y qué hace cada evolución. El «Ojo» pasa al final | corregido |
| B15 › parte «remesa» › aviso solución | «…y vuelve a facturar», cuando la parte 3 dice «No hagas otra factura» | Contradicción interna | → «…y pon la domiciliación en el efecto, como en la parte anterior. No hace falta volver a facturar» | corregido |
| B15 › parte «remesa» › paso 6 | «la anomalía del cuadro de arriba» | Remite a algo que no está | → «…que explica el recuadro «Ojo» de esta parte, en la pestaña Concepto» | corregido |

## Etapa «Impagados» (bloques 16 y 17)

| Dónde | Qué falla | Por qué | Antes → después (resumido) | Estado |
|---|---|---|---|---|
| B16 «Registrar un recibo devuelto» › concepto › Ejemplo | Usa el «efecto 1» de C{INI}, que se cobra suelto en el caso final y no es un recibo que devuelva el banco | El ejemplo no encaja con el caso | → «el recibo domiciliado del efecto 2… el que cobraste por remesa en «Domiciliar un cliente…»» | corregido |
| B16 › parte «gestión» › explicación 2 | Repite los pasos | Criterio 5 | → «La cabecera es como la del cobro… Solo cambia la acción: CDEV en lugar de COBD» | corregido |
| B16 › parte «efecto» › explicación 2-3 | Repiten los pasos 1-3 | Criterio 5 | → por qué marcar solo el tuyo; el cierre contabiliza la devolución como contabilizaba el cobro | corregido |
| B16 › parte «asiento» › explicación 3 | «El sentido correcto es el del Concepto» (ya estás en Concepto) y repetía el aviso de los gastos | Criterio 5 | → «…el que viste al principio del bloque… El banco te quita el dinero y el cliente vuelve a deberte» | corregido |
| B16 › parte «asiento» › paso 2 | «mira el cuadro de arriba» | Remite a algo que no está | → «lo explica el recuadro «Ojo» de esta parte, en la pestaña Concepto» | corregido |
| B17 › título | «Descuento de efectos (concepto)»: con paréntesis y sin infinitivo | Norma de títulos | → «Conocer el descuento de efectos» | corregido |
| B17 › concepto | «letras» sin explicar | Criterio 3 | Se añade: «(letras de cambio: efectos que el cliente ha aceptado pagar en una fecha)» | corregido |
| B17 › parte 1 › explicación 1 | «Abre la lista.», una orden en lugar de explicar | Duplica el paso 1 | → «En la lista de tipos de remesa, las de descuento…» | corregido |

## Para saber más (bloque 18)

| Dónde | Qué falla | Por qué | Antes → después (resumido) | Estado |
|---|---|---|---|---|
| B18 «Conocer los procesos avanzados» › concepto, párrafo 1 | «La cartera es la lista de efectos…», como si empezara el módulo | Inicio de módulo dentro del módulo | → «Hasta aquí has movido la cartera… con cobros, pagos y remesas normales. Casi siempre basta con eso. A veces…» | corregido |
| B18 › parte 5 › título | «…(p. ej. 31-12)» | Norma de títulos | → «Cuadrar la cartera a una fecha pasada» | corregido |

## Glosario y examen del módulo

| Dónde | Qué falla | Por qué | Antes → después (resumido) | Estado |
|---|---|---|---|---|
| Glosario «Tercero» › ejemplo | «T{INI} «Tercero Carteras», que es a la vez cliente y proveedor»: el tercero de cartera es CAR{INI}; T{INI} es el proveedor del caso | Un código, una cosa | → «CAR{INI}, con tu nombre, que es a la vez cliente y proveedor» | corregido |
| Glosario «Perceptor» › ejemplo | «Perceptor T{INI}… de la factura FC026-000001»: esa factura es de CAR{INI} | Dato incoherente con el bloque 1 | → CAR{INI} | corregido |
| Glosario «Validar» › ejemplo | «Al validar T{INI}…»: en este módulo se valida CAR{INI} | Ídem | → CAR{INI} | corregido |
| Glosario «Artículo financiero» | «asesoria» sin tilde | Ortografía | → «asesoría» | corregido |
| Examen p. 16 › explicación | «equivale a 1=0» | Jerga de SQL | → «Sin ningún filtro, el selector no trae nada: así evita cargar de golpe toda la cartera» | corregido |
| Examen p. 10 › explicación | «crea una cabecera inversa para mantener auditoría» | Jerga | → «crea otra al revés, enlazada a ella, para que quede rastro» | corregido |
| Examen p. 12 › explicación | «Si el importe difiere… escinde»: impreciso, porque si es mayor la línea se rechaza | Contradice el bloque 18 | → «Si el importe de la línea es menor que el efecto, el ERP parte el efecto original en dos» | corregido |

## Dudas funcionales y propuestas no aplicadas

| Dónde | Qué falla | Por qué no se toca | Estado |
|---|---|---|---|
| B12 «Evolucionar una remesa» (concepto, paso 2, aprendido) y glosario «Efecto propuesto y ordenado» | El efecto de pago pasa a «OP Ordenado»; el resto del módulo usa OC Ordenado | Puede ser un estado propio de los pagos: hay que comprobarlo en la demo | duda |
| B11, B13, B14 y B15 | El IBAN de prueba ES9121000418450200051332 se da a T{INI} (en Compras) y a C{INI} (aquí): el mismo IBAN para dos terceros | Dato funcional del caso | duda |
| B3 frente a B1 | Rótulo del desplegable: «Cartera» o «Cartera de efectos» | Sin comprobar | duda |
| B3 frente a B5 | Banda «EN CONTABILIDAD» (factura de compra del vídeo) frente a «CONTABILIZADO» (factura de venta de la demo) | Pueden ser bases distintas | duda |
| B13 y B15 | Usan R{INI} «Recibo domiciliado {INI}» y la factura FP{INI} de Ventas sin presentarlos aquí | Comprobar que Ventas los crea con ese código | duda |
| Títulos de B15 y B16 | «Domiciliar un cliente: mandato SEPA y remesa de cobro» (dos puntos) y «Registrar un recibo devuelto (impagado)» (paréntesis) no siguen la norma | Se citan en muchos bloques: renombrarlos obliga a cambiar todas las citas | propuesta |
| Preguntas De memoria | B1 paso 4 («el bloque para clasificar»), B11 paso 1 («Has abierto el banco PRVCC0», cuando el paso dice BBVA_{INI}) | Las `pregunta` no se tocan | propuesta |
| Orden en etapas.ts | «Resolver un efecto que no se remesa» va después de «Evolucionar una remesa», pero trata de la selección, que es anterior. «Cobrar solo una parte» encajaría tras «Cobrar efectos sueltos…» | Cambia el orden del curso: lo decide Sergi | propuesta |
| B5 parte 5, B10 y B11 parte 1 | Tres veces la misma pestaña «Remesas por cuenta» (añadir tipos) | Fusionar cambia la estructura (número de partes) | propuesta |
| B4 parte 1 › campos | Seis campos con «Ej.:» vacío | Sin dato fuente para rellenarlos | duda |

## Recuento

- Hallazgos: **81**.
- Corregidos: **71**, en `carteras.json`, `portadaDatos.ts`, `etapas.ts`, `glosario/carteras.json` y `examenes/carteras.json`.
- No aplicados: **10**. Son 6 dudas funcionales y 4 propuestas de estructura, títulos u orden.
- Validación: los tres JSON cargan bien. `comprobar_estructura.py` da 0 errores estructurales y 0 avisos. El volcado se ha regenerado en `scratchpad/volcado-cartera/`.

## Tres ejemplos de antes y después

1. **Primera frase del módulo** (portadaDatos)
   - Antes: «Sigues los vencimientos (efectos) que deja cada factura hasta que se cobran o se pagan: sueltos, en una gestión o en una remesa.»
   - Después: «La cartera es la lista de lo que la empresa tiene pendiente de cobrar y de pagar: un efecto por cada vencimiento de una factura. Aquí sigues cada efecto hasta que se cobra o se paga, suelto, con una gestión o en una remesa al banco.»

2. **Bloque que se presentaba como inicio del módulo** (B10, concepto)
   - Antes: «Una remesa es un paquete de efectos que se manda junto al banco para que los cobre o los pague…»
   - Después: «Empieza la etapa de remesas. Ya cobraste con una en «Cobrar efectos sueltos y en remesa»: una remesa es un paquete de efectos… Ahora vas a pagar con una, y antes compruebas que tu banco la admite.»

3. **Explicación que repetía los pasos** (B9, parte «Cambiar el importe»)
   - Antes: «Baja a «Selección de efectos» y marca solo el efecto…» / «Pulsa dos veces en su «Importe divisa» y escribe 100…»
   - Después: «En «Selección de efectos», cada fila trae en «Importe divisa» el importe completo del efecto. Esa celda se puede cambiar antes de agregarlo.» / «Si la bajas a 100, el «Importe local» y el total se ajustan solos. Eso es lo que cobrará la gestión.»
