# Lectura en contexto y en orden: Ventas (módulo 4)

Zona revisada: volcado `04-ventas.md`, `app/src/content/ventas.json`, `examenes/ventas.json`, `glosario/ventas.json` y la entrada `ventas` de `portadaDatos.ts` y `etapas.ts`.
Orden tenido en cuenta: el alumno llega desde Compras (y antes, Contabilidad básica y Maestros). No se cita Cartera ni Tesorería como ya vistas (no había ninguna cita así).
Todas las ediciones se hicieron con Edit, cadena a cadena. Estructura: `comprobar_estructura.py` da 0 errores y 0 avisos. Los tres JSON validan.

## Página del módulo (portada, «Para situarte», «Lo básico del ERP», etapas)

| Dónde | Qué falla | Por qué | Antes → después (resumido) | Estado |
|---|---|---|---|---|
| portadaDatos › frase | No dice qué es el módulo; una frase larga con punto y coma | Criterio 1 | «Montas los documentos de venta y llevas una venta del albarán a la factura y, en el circuito completo…; el vencimiento queda en cartera» → «Ventas es la parte del ERP donde registras lo que vendes a tus clientes. Preparas el cliente, los precios y los documentos, y llevas una venta del pedido a la factura, con su asiento y su cobro pendiente.» | corregido |
| portadaDatos › aprendes[1] | «Dar de alta un cliente», pero el bloque 1 no crea el cliente: lo comprueba y lo completa. Los precios no salían | Criterio 4 | «Dar de alta un cliente y recorrer…» → «Completar tu cliente y sus precios, y recorrer oferta, pedido, albarán y factura.» | corregido |
| portadaDatos › circuito y recorrido | El recorrido muestra la venta de práctica (oferta 5 × 22,00, 133,10, «Del albarán y la oferta a la factura»), mientras la frase, el resumen y el bloque 5 se centran en la venta del caso (pedido 10 × 20,00, 242,00) | Criterio 4: el ejemplo de la portada no es el caso | No tocado: son cifras y códigos | duda |
| etapas.ts › «Practicar otros circuitos» | La frase no tiene verbo | Criterio 1 | «Con las tipologías que ya creaste: del albarán…» → «Recorres dos circuitos más con las tipologías que ya creaste: del albarán a la factura y de la oferta a la factura.» | corregido |
| Lo básico › «El circuito de ventas» › paraQueSirve | Anuncia «las tipologías» antes de explicarlas y omite el cliente y los precios, que son las dos primeras etapas | Criterios 3 y 4 | «…por qué antes de vender hay que preparar las tipologías.» → «…por qué, antes de vender, preparas el cliente, los precios y las tipologías (los tipos de documento).» | corregido |
| Lo básico › «El circuito de ventas» › explicacion 4 | «En este curso el albarán no genera asiento» choca con el bloque 6, donde el albarán A{INI} sí contabiliza | Criterio 4: contradicción | → «En tu venta del caso no genera asiento: lo genera la factura. Algunas empresas sí contabilizan el albarán; lo practicarás en «Vender del albarán a la factura».» | corregido |
| Lo básico › «El circuito de ventas» › explicacion 9 | Cadena escrita con «>» y mayúsculas («Pedido > Albarán > Factura») | Norma de rutas y cadenas | → «pedido › albarán › factura», «albarán › factura», «oferta › pedido › albarán › factura» | corregido |
| Lo básico › «Cómo moverte por el ERP» › aviso 2 | «…de la sesión anterior»: resto de otro contexto que no dice de dónde sale cada dato | Criterio 5 | → «Reutilizas el tercero C{INI}, que creaste en Contabilidad básica, y el artículo 13500620 (6000-2RS ISB) de la demo, el mismo que usaste en Compras.» | corregido |

## Configurar › El cliente › Bloque 1 «Preparar el cliente»

| Dónde | Qué falla | Por qué | Antes → después (resumido) | Estado |
|---|---|---|---|---|
| Concepto, párrafo 2 («Ojo: antes de empezar…») | Va antes de explicar qué es el tercero, el cliente y la relación contable, y ya usa «relación «Clientes» (CLI)». Además atribuye R{INI} y P{INI} al bloque de gestión, cuando se crean en Contabilidad básica | Criterios 3 y 6 | El párrafo pasa detrás de «Segundo, la relación contable…», justo antes del «Ejemplo». Ahora dice que R{INI} y P{INI} se crearon con el tercero en «Dar de alta los datos básicos de contabilidad» y que la condición de cobro que los usa se creó en «Dar de alta los datos básicos de gestión» | corregido |
| Parte 1 › explicacion 5 | «la que diste de alta en Maestros»: la cuenta 43000.00901 se crea en Contabilidad básica, no en Maestros | Criterio 3 (remite al bloque equivocado) | → «la que diste de alta en «Dar de alta los datos básicos de contabilidad»» | corregido |
| Parte 1 › paso 2 › detalle | El mismo origen erróneo («que creaste en Maestros») | Criterio 3 | → «…si es la que creaste en Contabilidad básica» | corregido |
| Parte 6 › aviso | Nombra la plantilla FVOA, que aún no se ha explicado (sale en el bloque 3), y remite a «ver «Vender del albarán a la factura»», que viene después | Criterio 3 | → «Los descuentos a 0 no evitan un fallo de la demo en ventas. Una factura con la plantilla de asiento FVOA (la conocerás en «Conocer las tipologías de venta») dio «Cannot invoke…»…» | corregido |
| Parte 7 › explicacion 4 | Frase suelta: «El detalle de las plantillas de asiento está en…», que no conecta con la anterior | Criterio 5 | → «Las plantillas de asiento, que reúnen la cuenta del cliente, la de ventas y el IVA, las verás en detalle en «Conocer las tipologías de venta».» | corregido |
| Test 3 › pregunta | «condición de cobro de Maestros»: esa condición se pone en Compras | Criterio 3 | → «…la condición de cobro que le pusiste en Compras (R{INI} y P{INI})» | corregido |
| Checklist 4 | «es la de Maestros»: el mismo error | Criterio 3 | → «es la que le pusiste en Compras» | corregido |
| Parte 5 › aviso; parte 6 › explicacion 3 | Hay texto de trabajo visible: «Con R{INI} el mensaje no se ha comprobado», «No se ha comprobado si poniéndolo aquí el pedido lo propone» | Guía junior: no dejar texto de trabajo; pero avisa de lo que no está verificado | No tocado | duda |

## Configurar › Los precios de venta › Bloque 2 «Preparar los precios de venta»

| Dónde | Qué falla | Por qué | Antes → después | Estado |
|---|---|---|---|---|
| Todo el bloque | Sin hallazgos de orden: va de para qué a dónde, de dónde a cómo y de cómo a qué verás, y remite a Compras («igual que en compras») y a bloques futuros solo en futuro | — | — | — |

## Configurar › Los documentos de venta › Bloques 3 y 4

| Dónde | Qué falla | Por qué | Antes → después (resumido) | Estado |
|---|---|---|---|---|
| B4 › «Crear la tipología de albarán AP{INI}» › explicacion 1 | «Comprobado en la demo.» es texto de trabajo | Criterio 5 | Se quita la frase; el resto queda igual | corregido |
| B4 › AP{INI} › aviso 3 | «No se ha comprobado si tiene que ver con «Valorar» «Tarifa»» es texto de trabajo | Igual que en el bloque 1 | No tocado | duda |
| B3 | Sin hallazgos de orden. Las remisiones a bloques futuros van en futuro («lo verás en…») | — | — | — |

## Operar › Vender › Bloque 5 «Vender: pedido, albarán y factura»

| Dónde | Qué falla | Por qué | Antes → después (resumido) | Estado |
|---|---|---|---|---|
| Concepto, párrafo «Docflow…» | Una frase suelta («Docflow… lo verás al final») entre el asiento y «Dos pasos van en orden fijo» | Criterios 2 y 5 | → «Para llegar a ese asiento recorres tres pantallas, una por documento. Al final verás el Docflow, el gráfico que dibuja la cadena pedido › albarán › factura.» (frase puente hacia los pasos) | corregido |
| «Ver la prevista y contabilizar» › paso 2 › detalle | «el mensaje con R{INI} no se ha comprobado» | Texto de trabajo | No tocado | duda |
| Paso 6 («Resumen de apuntes») frente a B7 › paso 5 («Líneas de apuntes») | El mismo asiento se describe con dos pestañas distintas | Posible incoherencia | No tocado: es un rótulo del ERP | duda |

## Operar › Practicar otros circuitos › Bloque 6 «Vender del albarán a la factura»

| Dónde | Qué falla | Por qué | Antes → después (resumido) | Estado |
|---|---|---|---|---|
| Concepto, párrafo «Ojo, esto es lo importante» | Termina con «Se comprobó en la demo.», que es texto de trabajo | Criterio 5 | Se quita la frase | corregido |
| Concepto, «Fíjate: vendes a tu cliente» | «la 43000.00901 que creaste en Maestros»: se creó en Contabilidad básica | Criterio 3 | → «…que creaste en «Dar de alta los datos básicos de contabilidad»» | corregido |
| Parte 1 › pasos 2 a 8 | Los rótulos del ERP van sin comillas («Comprueba la Identificación: serie AV…») | Norma de rótulos «» | → «Comprueba la «Identificación»: «Serie» AV, «Estado» «Activo»…», y lo mismo en «Cuenta origen», «Tabla origen», «Documento destino», «Valoración», «Indicativos» y «Contabilización» | corregido |
| Parte 1 › paso 9 › detalle; checklist 1 | «DISP > NSAL» con «>» | Norma de cadenas | → «DISP › NSAL», como en el bloque 4 | corregido |
| Parte 3 › campo 1 | «Tercero que das de alta como cliente», en una parte que solo comprueba | Criterio 4 | → «Tercero que es cliente. Ya lo diste de alta en Compras.» | corregido |
| Parte 5 › aviso, solución del error 2 | Da la ruta de AV como «Contabilidad › Asientos programables», mientras el paso 7 y el bloque 3 dicen «Gestión › Maestros › Contabilización › Asientos» | Criterio 4: dos rutas para la misma pantalla | → «está en Gestión › Maestros › Contabilización › Asientos» | corregido |
| Parte 5 › pasos 3 y 8 | «Contabilizar > Aceptar» | Norma de cadenas | → «Contabilizar» › «Aceptar» (también en B7 › parte 8 › paso 5) | corregido |
| Parte 5 › paso 6; test 3 (opción) | «EXPRESIÓN» con tilde, pero el aviso, el problema y el bloque 4 citan el mensaje literal «EXPRESION» | Rótulo literal del ERP | → «EXPRESION» (también en la pregunta 7 del examen) | corregido |
| Parte 5 › paso 8 | La pregunta De memoria es «¿Qué botón aparece ahora en su lugar para deshacerlo?» (la respuesta sería «Descontabilizar»), pero el punto clicable es «Debe» | Criterio 4: la pregunta y el punto no casan | No tocado: `pregunta` y `hotspot` no se tocan | duda |
| Parte 6 › paso 1 › detalle | «Comprobado en la demo con un albarán de captura (la captura es ese albarán…)» | Texto de trabajo | → «La captura es de otro albarán, ya facturado; el tuyo sale «Pendiente».» | corregido |
| Parte 6 › paso 9 › detalle | «en el bloque Fecha»: aquí «bloque» es un grupo de campos | Norma: «bloque» solo para los bloques del curso | → «en el grupo de campos «Fecha»» | corregido |
| Test 4 › explicación | «a conformar» > Conformar» | Norma de cadenas | → «Albaranes de ventas a conformar» › «Conformar» | corregido |
| Problema 7 | «(se probó con la factura aún sin contabilizar)» | Texto de trabajo, pero limita lo que se sabe | No tocado | duda |

## Operar › Practicar otros circuitos › Bloque 7 «Vender de la oferta a la factura»

| Dónde | Qué falla | Por qué | Antes → después (resumido) | Estado |
|---|---|---|---|---|
| Concepto, párrafo 2 | «La tipología dice cómo se numera…» va al final, detrás de «Aquí no creas tipologías…» | Criterio 6: primero qué es, después qué haces | La frase sube detrás de la definición de tipología | corregido |
| Concepto, los dos «Ejemplo:» | Dos párrafos seguidos repiten 5 × 22,00 = 110,00 + 23,10 = 133,10 | Criterio 5 | El segundo pasa a ser un puente sin cifras repetidas: «Es una venta de práctica, distinta de la de tu caso (… 242,00), que ya hiciste en «Vender: pedido, albarán y factura»…» | corregido |
| Parte 4 › paraQueSirve | Empieza por lo que no haces y no dice para qué sirve la parte | Criterio 1 | → «Sirve para comprobar que la factura de este circuito es tu FP{INI}… Aquí no creas otra tipología de factura.» | corregido |
| Parte 5 › explicacion 3 | «Usa datos parecidos al mundo real» no conecta con nada y no dice que el fin de vigencia viene con el mismo día | Criterios 2 y 5 | → «Por defecto, el «Fin vigencia» es el mismo día de la oferta. Una vigencia de un solo día… Por eso lo amplías hasta el 31-12-2026.» | corregido |
| Parte 5 › explicacion 4 | «(pestaña Líneas > Nuevo)» | Norma de cadenas y rótulos | → «(pestaña «Líneas» › «Nuevo»)» | corregido |
| Parte 5 › explicacion 5 | «Los bloques Agente y Fechas de entrega» | Norma: «bloque» solo para los bloques del curso | → «Los grupos de campos «Agente» y «Fechas de entrega»» | corregido |
| Parte 8 › paso 2; aviso de comprobación | Cadenas con «>» | Norma de cadenas | → «›» | corregido |
| Parte 8 › paso 4 › detalle | «Está en el bloque «Albaranes conformados»» | Norma «bloque» | → «Está en la sección «Albaranes conformados», columna «Origen».» | corregido |
| Parte 7 › paso 5 | Pide reescribir el precio 22 y, si el disquete no se activa, usar el truco del descuento. El aviso, el problema y el test dicen que reescribir el mismo precio no recalcula | Posible contradicción; la pregunta va ligada al punto «Precio» | No tocado | duda |

## Examen y glosario

| Dónde | Qué falla | Por qué | Antes → después (resumido) | Estado |
|---|---|---|---|---|
| Examen, pregunta 7 (opción correcta) | «EXPRESIÓN» con tilde frente al literal «EXPRESION» | Rótulo literal | → «EXPRESION» (no cambian el texto ni el índice de la respuesta) | corregido |
| Examen, preguntas 10 y 11 | Preguntan por «emitir» la factura y por la fecha contable frente a la de facturación; ningún bloque del módulo lo explica | Criterio 3: se evalúa algo no visto | No tocado | duda |
| Glosario «Indicativos (tipo de movimiento)» | «Bloque de la tipología» | Norma «bloque» | → «Caja de la ficha de la tipología…» | corregido |
| Glosario «Objeto (nombre técnico…)» | «Sale entre paréntesis en la Ruta»: en el módulo sale en los pasos como «En el buscador: …» | Criterio 4 | → «Sale en los pasos como «En el buscador: …»; sirve para encontrar la pantalla…» | corregido |
| Glosario «Asiento programable» | «configurada en Contabilidad»: la pantalla está en Gestión | Criterio 4 | → «Plantilla de asiento («Gestión › Maestros › Contabilización › Asientos») que usan…» | corregido |
| Glosario «Contado (EF)» | El ejemplo es de un solo efecto a 30D (la captura de CCP); el caso del alumno tiene dos efectos de 121,00 | Puede confundir | No tocado: es un dato | duda |

## Recuento

- Hallazgos: 49 (los de varias líneas parecidas cuentan como uno).
- Corregidos: 39.
- Dudas funcionales o de dato, sin tocar: 10. Son el recorrido de la portada; la pregunta y el punto de B6 › parte 5 › paso 8; el texto «no se ha comprobado» (B1 dos veces, B4, B5 y B6 › problema 7); «Resumen» frente a «Líneas de apuntes»; el paso 5 del albarán de B7; las preguntas 10 y 11 del examen; y el ejemplo EF del glosario.
- Estructura: 0 errores y 0 avisos en `comprobar_estructura.py`. JSON válidos.

## Tres ejemplos de antes y después

1. **Primera frase de la página del módulo** (criterio 1).
   Antes: «Montas los documentos de venta y llevas una venta del albarán a la factura y, en el circuito completo, de la oferta a la factura; el vencimiento queda en cartera.»
   Después: «Ventas es la parte del ERP donde registras lo que vendes a tus clientes. Preparas el cliente, los precios y los documentos, y llevas una venta del pedido a la factura, con su asiento y su cobro pendiente.»

2. **Algo que se usa antes de explicarlo y que remite a un bloque posterior** (B1 › «Ver el riesgo, los descuentos y el agente»).
   Antes: «En la demo, una factura de venta con la plantilla FVOA dio «Cannot invoke…» aunque los descuentos… En compras ese mismo error se arregla…; en ventas no basta (ver «Vender del albarán a la factura»).»
   Después: «Los descuentos a 0 no evitan un fallo de la demo en ventas. Una factura con la plantilla de asiento FVOA (la conocerás en «Conocer las tipologías de venta») dio «Cannot invoke…», aunque los descuentos y el pronto pago del cliente estaban a 0. En compras, ese mismo error se arregla poniendo los descuentos a 0; en ventas no basta.»

3. **Contradicción entre la página del módulo y un bloque** («El circuito de ventas» frente al bloque 6).
   Antes: «El albarán… En este curso no genera asiento: lo generará la factura (en otras empresas, el albarán también se puede contabilizar).»
   Después: «El albarán… En tu venta del caso no genera asiento: lo genera la factura. Algunas empresas sí contabilizan el albarán; lo practicarás en «Vender del albarán a la factura».»
