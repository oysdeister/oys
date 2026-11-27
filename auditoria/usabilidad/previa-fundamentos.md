# Lectura en contexto: formación previa y módulo 0 Fundamentos

Sección «previa-fundamentos». Lectura de arriba abajo como alumno sin base: portada `#/formacion`, guía de contabilidad, guía del ERP, exámenes previos y, después, el módulo 0 (portada, etapas, tres bloques, glosario y examen). El hilo principal es el paso de la previa a Fundamentos.

## Formación previa · portada y páginas

| Dónde | Qué falla | Por qué | Antes → después (resumido) | Estado |
|---|---|---|---|---|
| Portada `#/formacion` › introducción (`Formacion.tsx`) | Frase coja («de las que se estudian en la universidad»). «Cada guía tiene su propio examen» repite lo anterior. No dice qué pasa después, en Fundamentos | 1, 5, encaje | «Dos guías de base, de las que se estudian…» / «…antes del módulo 0. Cada guía tiene su propio examen.» → «Esta formación previa reúne dos guías de base, del nivel de un primer curso universitario…» / «Léelas en orden y aprueba el examen de cada una antes de empezar por el módulo 0, Fundamentos. Fundamentos ya no repite esta teoría: la repasa con las cifras del caso.» | corregido |
| Guía › cierre «Has llegado al final» (`GuiaPrevia.tsx`) | «Corrige solo y explica cada respuesta»: la frase no tiene sujeto | 5 | → «El examen se corrige solo y explica cada respuesta.» | corregido |
| Exámenes previos (`examen-contabilidad.ts`, `examen-erp.ts`) | Revisados los 54 + 61 enunciados y sus explicaciones: encajan con lo que explica cada guía y no usan términos que no salgan antes | — | Sin cambios | — |

## Formación previa · «Contabilidad desde cero» (`contabilidad.ts`)

| Dónde | Qué falla | Por qué | Antes → después (resumido) | Estado |
|---|---|---|---|---|
| Portada de la guía (hero) | «Pantallas reales del ERP Axional ICON»: presenta ICON como si fuera el nombre del producto. La guía del ERP dice que ICON es un entorno | 3, 4 | → «pantallas reales del ERP Axional, sacadas de su entorno de pruebas «Desarrollo ICON»» | corregido |
| Cap. 0 › recuadros «En Axional ICON» | Es la primera guía, pero sus recuadros verdes ya usan objeto, buscador, «Ejecutar», ficha y pestaña. La guía del ERP los explica después, y la orientación sobre el buscador no llega hasta el cap. 16 | 3 | Se añade al anunciar los recuadros verdes: ICON es el entorno de pruebas; son un adelanto; cada pantalla se busca por su nombre o código (*ctercero*), se pulsa «Ejecutar» y se abre una ficha con pestañas; lo explica la guía «Qué es un ERP» (apartado 2) | corregido |
| Cap. 0 › «Al terminar: el examen» | «Haz el examen de evaluación: el examen de esta guía»: redundante | 5 | → «Cuando acabes la guía, haz su examen.» | corregido |
| Cap. 3 › pie de la captura de condiciones de cobro | «Tipo de efecto DD» sale nueve capítulos antes de que el cap. 12 explique qué es un efecto | 3 | → «(un efecto es cada cobro pendiente, capítulo 12; DD es recibo domiciliado…)» | corregido |
| Cap. 16 › «Para orientarte en ICON» | La orientación llegaba al final | 6 | Ahora está resumida en el cap. 0; aquí queda como recordatorio | no hace falta tocarlo |
| Cap. 12 › ejercicio 1 (estado «OC») | Solo se explica el estado PE. OC (y AU, en el pie de la cartera de la guía del ERP, cap. 15) no se explican | 3 | No tocado: no sé qué significa cada estado en ICON | **duda** |
| Cap. 6 › recuadro ICON | Dice que en las capturas del cap. 12 se verá el proyecto «08 Barcelona», pero el pie de esa captura no lo nombra | 4 | No tocado: no puedo comprobar la captura | **duda** |
| Cap. 14 › tabla de presupuesto | Usa la cuenta 601, que no sale en la lista de cuentas del cap. 9 (allí está la 600) | 3 | No tocado: es correcta en el PGC y no cambia la lectura | no tocado |

## Formación previa · «Introducción al ERP y al módulo de finanzas» (`erp.ts`)

| Dónde | Qué falla | Por qué | Antes → después (resumido) | Estado |
|---|---|---|---|---|
| Cap. 0 › «Conviene haber leído antes» | «…lee primero la guía «Contabilidad desde cero», en la carpeta *formacion-contabilidad*»: resto del HTML original, porque en la plataforma no hay carpeta | 5 | → «…el apartado 1 de esta formación previa» | corregido |
| Cap. 0 › tabla «Plan de estudio» | La columna se llamaba «Bloque», que en la plataforma significa otra cosa | estilo | → «Parte» | corregido |
| Cap. 0 › recuadros «En Axional» | Habla de entornos ICON e IGES antes de que el cap. 3 explique qué es un entorno. Además, la guía dice «Axional Next» y el curso, «Axional Deister VNext» | 3, encaje | → «…Axional Next, la versión de Axional con la que trabajarás en el curso (allí la verás como «Axional Deister VNext»). Salen de dos entornos (copias del ERP para pruebas, capítulo 3)…» | corregido (**duda**: confirmar que Next y VNext son el mismo producto) |
| Cap. 5 › pie de las condiciones de cobro | «Tipo de efecto DD» antes de que el cap. 15 explique qué es un efecto | 3 | → «(recibo domiciliado; el efecto, cada cobro pendiente, se explica en el capítulo 15)» | corregido |
| Caps. 6, 7 y 21 › menús de Compras y Ventas | «Cada bloque tiene…», «todos los bloques de los menús»: «bloque» para un grupo del menú | estilo | → «apartado» (3 sitios) | corregido |
| Toda la guía | Rutas escritas con «→» en vez de «›» (17 flechas, mezcladas con flechas de secuencia) | estilo | No tocado: habría que separar caso a caso las rutas de las secuencias | pendiente |

## Módulo 0 Fundamentos · página del módulo

| Dónde | Qué falla | Por qué | Antes → después (resumido) | Estado |
|---|---|---|---|---|
| Frase de portada (`portadaDatos.ts`) | No tiene verbo y es falsa: dice «antes de abrir el ERP», pero el primer bloque abre el ERP. No dice qué es el módulo ni cómo encaja con la previa | 1, encaje | «Los conceptos que usarás en todo el curso, antes de abrir el ERP: debe y haber…» → «Fundamentos es el punto de partida del curso: aprendes a moverte por el ERP y repasas, con las cifras de tu caso, lo que viste en la formación previa.» | corregido |
| `resumen` del JSON (portada general) | Empezaba sin verbo: «Lo propio de Axional antes de empezar: …» | 1 | → «Es el punto de partida del curso: aprendes a moverte por el ERP y conoces el caso…» | corregido |
| «Para situarte» › aprendes | «Entender qué es un ERP» repite la previa. No decía que debe y haber e IVA son repaso | encaje | → «Moverte por el ERP y saber cómo está organizado este curso» · «Repasar debe y haber, asiento y apunte con las cifras de tu caso» · «Repasar qué son el IVA, un efecto y contabilizar» | corregido |
| Etapa «Moverse por el ERP» (`etapas.ts`) | «…lees una rejilla y una ficha y guardas», pero el bloque dice «solo miras, no grabes» | 4 | → «…y ves cómo se guarda» | corregido |
| «Lo básico del ERP» › explicación 2 | «tipologías» sale sin explicar | 3 | No tocado: es solo un ejemplo dentro de una lista y Maestros lo explica | no tocado |

## Fundamentos › Bloque 1 «Moverse por el ERP»

| Dónde | Qué falla | Por qué | Antes → después (resumido) | Estado |
|---|---|---|---|---|
| Concepto, párrafo 1 | Vuelve a definir qué es un ERP como si fuera nuevo, sin decir que ya se vio en la previa | encaje, 5 | «Un ERP es el programa donde…» → «En la formación previa viste qué es un ERP: el programa donde… Ahora toca moverte por él.» | corregido |
| Concepto, párrafo 2 | Frases sin verbo. Habla de «cinco gestos», pero la parte tiene seis y en otro orden | 1, 4 | → «…los gestos que usarás en todo el curso: reconocer la pantalla, abrir el menú, buscar una pantalla, leer la rejilla, buscar un registro y recorrer su ficha.» | corregido |
| Concepto, párrafo 3 | No conecta con la previa. El alumno viene de capturas de otros entornos (escritorio con canales) y aquí ve otra pantalla (Manager, BBDD TUTORIAL) | encaje, 2 | Se añade que es una copia de pruebas «como los entornos de la formación previa» y que la demo se ve algo distinta, pero el menú, el buscador, la lista y la ficha funcionan igual | corregido |
| Concepto, «Ejemplo:» | No era un ejemplo del párrafo anterior. Mezclaba la creación de S{INI} (módulo siguiente) con «tipologías», sin explicar | 2, 3 | → «Ejemplo: en este bloque miras las dos empresas de la demo, la 0 y DIS. En la 0 grabarás las operaciones del curso. S{INI} la crearás en Maestros…, pero no tiene la configuración que necesitan los documentos.» | corregido |
| Parte «Leer la rejilla» › explicación 2 | Define el maestro como «una ficha», pero la ficha no se explica hasta la parte 6 | 3 | → «un registro que se crea una vez» (registro se define en la explicación 1) | corregido |

## Fundamentos › Bloque 2 «Repasar la contabilidad con el caso del curso»

| Dónde | Qué falla | Por qué | Antes → después (resumido) | Estado |
|---|---|---|---|---|
| Concepto, párrafo 3 | Las partes 3 y 5 usan T{INI} y C{INI} sin presentarlos. «Se graba en la empresa 0» aparece en un bloque que no abre el ERP | 3, 5 | → «compras 10 unidades a tu proveedor T{INI}… Después vendes esas unidades a tu cliente C{INI}. Cuando lo hagas en el ERP, lo grabarás en la empresa 0.» | corregido |
| Parte «Situar las cuentas» › explicaciones 3 y 4 | Dice que 100 Capital social y 472 llegarán «más adelante», pero ya se usaron en las partes 2 y 3. «Los grupos restantes: 1…, 2…» no es una frase completa | 3, 5 | → «En este repaso ya han salido 100 Capital social y 472 IVA soportado. Más adelante verás 430, 477 y 570…» · «Los grupos que faltan son el 1 (financiación), el 2… y el 3…» | corregido |

## Fundamentos › Bloque 3 «Seguir una factura hasta el banco y el cierre»

| Dónde | Qué falla | Por qué | Antes → después (resumido) | Estado |
|---|---|---|---|---|
| Objetivo | El título incluye el cierre, pero el objetivo no | 4 | → «…desde el pedido hasta el banco y el cierre, y explicar qué hace «Contabilizar».» | corregido |
| Concepto, párrafo 1 | «Una factura… antes pasa por pedido, albarán y factura» no tiene sentido. Además, repite el arranque de la parte 2 | 1, 5 | → «Una compra no termina en la factura: antes hay un pedido y un albarán, y después un efecto, un pago, el banco y el cierre del año.» | corregido |
| Concepto, párrafo 3 | «Al final verás qué hace «Contabilizar»», pero es la parte 3 de 6 | 5 | → «En la tercera parte verás…» | corregido |
| Concepto, «Ejemplo:» | «Cobras en dos efectos» antes de la parte que explica qué es un efecto | 3 | → «dos efectos (dos cobros pendientes)» | corregido |
| Parte «Contabilizar» › explicación 2 | Define otra vez qué es un maestro (ya se vio en el bloque 1). El artículo 13500620 no dice de dónde sale | 5, criterio | → «Los maestros, que ya viste en el bloque «Moverse por el ERP», son los registros que se crean una vez…: tu proveedor T{INI} o un artículo de la demo, el 13500620.» | corregido |
| Parte «Ver cómo encaja el curso» › explicaciones 3 y 4 | Repite la parte «Cómo está organizado el curso» de la página del módulo (orden y Configurar/Operar), y la lista de módulos no conecta con «el camino del dinero» | 5, 2 | → la lista de módulos más «Compras y Ventas crean las facturas; Cartera y Tesorería cobran, pagan y cuadran el banco; al final…» · «Como viste en la página del módulo, cada uno tiene dos fases…» | corregido |

## Fundamentos › glosario y examen

| Dónde | Qué falla | Por qué | Antes → después (resumido) | Estado |
|---|---|---|---|---|
| `glosario/fundamentos.json` › Efecto | El ejemplo («242 € a 30 días, un efecto de 242 €») no es el del caso, que son dos efectos de 121 €. Es correcto, pero no es el mismo | caso continuo | No tocado: no se contradicen | no tocado |
| `examenes/fundamentos.json` | Las 10 preguntas encajan con los bloques 2 y 3 | — | Sin cambios | — |

## Recuento

- Encontrados: **37**.
- Corregidos: **30** (portada y páginas de la previa 2, guía de contabilidad 4, guía del ERP 7, Fundamentos 17).
- Dudas funcionales no tocadas: **3**: qué significan los estados OC y AU de un efecto en ICON; si la captura del cap. 12 muestra el proyecto «08 Barcelona»; si «Axional Next» de las guías es el mismo producto que «Axional Deister VNext» del curso (el texto ya lo da por hecho: confírmalo).
- No tocados a propósito: 5 (orientación del cap. 16, cuenta 601, rutas con «→» en la guía del ERP, «tipologías» en la página del módulo, ejemplo del glosario de efecto).
- Validación: los 3 JSON de Fundamentos son válidos. Las dos guías previas se analizan sin errores. `comprobar_estructura.py`: 0 errores estructurales y 0 avisos.

## Tres ejemplos de antes y después

1. **Primera frase del módulo** (página `#/modulo/fundamentos`).
   Antes: «Los conceptos que usarás en todo el curso, antes de abrir el ERP: debe y haber, asiento, IVA, efecto y contabilizar.»
   Después: «Fundamentos es el punto de partida del curso: aprendes a moverte por el ERP y repasas, con las cifras de tu caso, lo que viste en la formación previa.»

2. **Encaje previa → Fundamentos** (bloque 1, primer párrafo).
   Antes: «Un ERP es el programa donde la empresa registra todo lo que hace… Es como el cuaderno de la empresa…»
   Después: «En la formación previa viste qué es un ERP: el programa donde la empresa registra todo lo que hace (compras, ventas, cobros, pagos y contabilidad). Ahora toca moverte por él.»

3. **Frase sin sentido** (bloque 3, concepto).
   Antes: «Una factura casi nunca se paga el mismo día: antes pasa por pedido, albarán y factura, y después por efecto, pago, banco y cierre.»
   Después: «Una compra no termina en la factura: antes hay un pedido y un albarán, y después un efecto, un pago, el banco y el cierre del año.»
