# Revisión junior: tesorería, impuestos, activos, cierre y páginas generales

Zona: volcados 06-tesoreria, 07-icon-impuestos, 08-icon-activos y 09-contabilidad-avanzada (incluido asientos-14 de `icon-contabilidad.json`), sus exámenes y glosarios, sus entradas de `portadaDatos.ts` y `etapas.ts`, y los textos fijos cambiados de las páginas generales (App, DeMemoria, Guiado, SeccionVista, ErpPractica, Examen, ExamenModulo, ExercisePage, Home, ModulePage, Video).
He leído cada texto corregido dentro de su página, en orden de pantalla, y he comprobado con `grep` los títulos de bloque que se citan.

## Tesorería (06)

| Página | Resultado |
|---|---|
| Página del módulo (frase, aprendes, recorrido, «Qué es la tesorería…», «Cómo moverte…») | Se entiende. La remisión a «Gestionar la financiación» (bloque opcional) existe. |
| B1 Preparar el banco propio (concepto, parte 1) | Se entiende. El «Recuerda:» encaja porque la página del módulo ya explica qué es tesorería. |
| B2 Configurar flujos, operaciones y parámetros | Se entiende. Lo que promete el concepto («al final del bloque los enlazas a la comisión de 3,50») se cumple en los pasos 6 y 7 de la operación. |
| B3 Registrar un movimiento manual | Se entiende. El aviso nuevo («Tu comisión de 10,00 no tiene efecto ni remesa…») encaja con el concepto. |
| B4 Entender el asiento de un movimiento de banco (asientos-14) | Se entiende. El paso 3 ya no te hace contabilizar dos veces y la «Operación comisión» de la parte 2 habla de tu {INI}TRF. Duda funcional, no tocada: el concepto dice que el pago a T{INI} deja «al final» 40000.T{INI} al debe, y el paso 2 de la parte 2 pone «cuenta puente de la remesa» al debe. Como junior no sé cuál de las dos es la buena. |
| B5 Dar de alta el extracto bancario | Problema, gravedad 2, arreglado. En la parte 6, «sigues con las otras cinco de la tabla» y el paso 5 «las otras cinco líneas de la tabla»: la tabla de esa parte es la del signo, con el ejemplo de 10,00, y las seis líneas están en la lista del concepto, arriba. No encontraba esas cinco líneas. Ahora pone «de la lista del principio del bloque» y «las otras cinco líneas del caso». |
| B6 Conciliar el banco | Dos problemas, arreglados. (a) Gravedad 2: en el paso 6, «Su contabilización la haces paso a paso…» sale justo después de la frase de la comisión generada, así que yo entendía que solo se contabilizaba esa. Ahora pone «La contabilización de estos dos movimientos…». (b) Gravedad 1: en la parte 1, «Arriba están los botones (mira la tabla de abajo) «Cancelar extractos»…» tiene un paréntesis que corta la lista. Ahora la lista va entera y después viene «La tabla de abajo te dice cuándo usar cada uno.». |
| B7 Conocer el circuito de extracto y conciliación | Se entiende. La primera frase nueva dice qué hace el bloque. |
| B8 Crear el extracto de una remesa | Se entiende («Como viste en «Dar de alta el extracto bancario»…»). |
| B9 Conciliar y contabilizar una remesa | Se entiende. Las salidas «si ya los casaste en «Conciliar el banco»…» del concepto y del paso 1 coinciden. |
| B10 Conciliar un cobro y un anticipo | Se entiende. |
| B11-B13 Cajas, financiación, valores y avales | Se entiende. Cada primera frase nueva dice de qué módulo o pieza se habla. |
| Examen y glosario | Se entiende. Gravedad 1, arreglado: la pregunta «del mismo importe y signo contrario y pulsar» llevaba dos «y» seguidas. Ahora tiene una coma antes de «y pulsar». |

## Impuestos (07)

| Página | Resultado |
|---|---|
| Página del módulo y etapas | Se entiende. |
| B1 Entender el IVA | Se entiende. La definición de tercero ahora va dentro de la frase de la regla. |
| B2 Conocer los maestros fiscales (operación ISP) | Se entiende. Existe la remisión a la parte «Inversión del sujeto pasivo (ISP)» de «Revisar el registro fiscal». |
| B3 Comprobar los datos fiscales | Se entiende («grupo de campos» en lugar de «bloque» evita confundirlo con un bloque del curso). |
| B4 Leer la regla de impuestos de una factura | Problema, gravedad 1, arreglado. En la parte 3, «Ejemplo: … Por eso 800 × 21 % = 168,00.»: tras leer que mi factura es de 10.000,00, el 800 me despistaba. Ahora pone «Por eso, en la captura, 800 × 21 % = 168,00.». Lo demás encaja: regla 73, 0FC000012 y los mnemotécnicos ES-IVA-SOP/REP del bloque 2. |
| B5 Probar las reglas de impuestos | Se entiende. El concepto ya dice de entrada que no cambias nada. Pendiente, gravedad 1, no tocado: el título de la parte 1, «Cambiar la zona del tercero y crear la factura», promete una acción que el bloque no te deja hacer (solo miras capturas). La nota sobre SOE y SOR sale en el paso 2 y en el aviso, pero en el Guiado el aviso no se ve, así que la dejo. |
| B6 Revisar el registro fiscal, B7 Controlar, B8 Liquidar | Se entiende. Existe la remisión a «Crear un asiento manual». |

## Activos (08)

| Página | Resultado |
|---|---|
| Página del módulo y etapas | Se entiende. |
| B1 Entender el activo fijo | Se entiende. |
| B2 Conocer los maestros del activo | Se entiende. Los paraQueSirve ahora dicen «revisas» o «ver», que es lo que haces. |
| B3 Comprobar la familia del artículo | Se entiende. El concepto avisa de que la condición de la tipología se ve después, en «Revisar la factura que crea el activo». El paso «Ten presente la primera condición» casa con el aviso de esa parte («tipología y familia»). |
| B4 Revisar si el albarán crea el activo | Se entiende. «Como hiciste con tu ordenador» remite al bloque 2, que ya está hecho. |
| B7 Amortizar un activo | Problema, gravedad 2, arreglado. La corrección dejó la frase rota «con el que seamortiza». Ahora pone «se amortiza». |
| B8 Dar de baja o vender | Se entiende. |
| Examen y glosario | Se entiende («valor de inventario» y «valor neto», como en los bloques). |

## Cierre y caso final (09)

| Página | Resultado |
|---|---|
| Página del módulo y etapa | Se entiende. |
| B1 Cerrar y abrir el ejercicio | Se entiende. La frase puente nueva anuncia lo que traen las partes. |
| B2 Cerrar el ejercicio de tu empresa | Se entiende. «Dos pasos» casa con la regularización y el cierre definitivo, y la reapertura queda como deshacer. Los títulos citados existen: «Crear una empresa» y «Registrar los saldos iniciales de una empresa». |
| B3 Consultar balances | Se entiende. |
| B4 Caso final | Se entiende. Existe el bloque «Vender: pedido, albarán y factura». |

## Páginas generales

| Página | Resultado |
|---|---|
| Home (lead, botón «Seguir: …», «Tu ruta») | Se entiende. «Las dos guías de «Antes de empezar con Axional», aquí debajo» coincide con el título de la sección que hay justo debajo. |
| ModulePage (vídeo «Luego lee el resto de esta parte…», «Qué aprenderás», aviso de Operar) | Se entiende. |
| SeccionVista (cabeceras de la tabla) | Se entiende. En mis módulos ninguna tabla cumple la condición de «mapa»: solo la cumple maestros-nav-datos. |
| Guiado, DeMemoria, ExercisePage, Examen, ExamenModulo, Video, ErpPractica, App (aviso de iniciales) | Se entiende. |

## Recuento

- Páginas revisadas: 46 (13 bloques de tesorería y 8 de impuestos, 8 de activos, 4 de cierre, 4 páginas de módulo, exámenes y glosarios, y 9 componentes o páginas generales).
- Confirmadas sin cambios: 39.
- Arregladas: 7 páginas, con 9 cadenas: B5, B6 y examen de tesorería; B4 de impuestos; B7 de activos.
- Pendientes: 2 (sin tocar). Una es funcional: en asientos-14, ¿la cuenta del debe del pago de 151,25 es 40000.T{INI} o la cuenta puente de la remesa? La otra es menor: el título de la parte 1 del bloque 5 de impuestos, que promete una acción que no haces.
- `python3 -I auditoria/scripts/comprobar_estructura.py`: 0 errores estructurales y 0 avisos. No he cambiado TSX.
