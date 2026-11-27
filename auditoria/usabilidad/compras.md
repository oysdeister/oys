# Lectura en contexto y en orden — Módulo 3 Compras (noviembre de 2026)

Zona: todo lo que sale en `03-compras.md` (bloques de `compras.json`, `maestros-2` y `maestros-3`, e `icon-contabilidad-v-1` a `v-4` de `icon-contabilidad.json`), `examenes/compras.json`, `glosario/compras.json` y la entrada `compras` de `portadaDatos.ts` y `etapas.ts`.
Orden del alumno: llega después de Datos maestros y Contabilidad básica. Ya ha creado C{INI}, P{INI}, R{INI}, ha escrito asientos y conoce el debe y el haber.

## Página del módulo

| Dónde | Qué falla | Por qué | Antes → después (resumido) | Estado |
|---|---|---|---|---|
| Portada › frase | No dice qué es el módulo; empieza con lo que haces | Criterio 1 (primera frase = qué es y para qué) | «Das de alta un proveedor…» → «Compras es la parte del ERP donde registras lo que pides a tus proveedores, lo que recibes y lo que te facturan. Das de alta…» | corregido |
| Etapa «Maestros de compra» | Frase sin verbo y con el proveedor dos veces | Criterio 1 y 5 | «Gestión: cliente, artículo, proveedor y almacén; después tu proveedor…» → «Das de alta los datos de Gestión (cliente, artículo y almacén), tu proveedor y el precio que le pagas.» | corregido |
| Etapa «Documentos» | Frase sin verbo | Criterio 1 | «Cómo se numera…» → «Preparas cómo se numera y cómo se comporta cada documento del ciclo de compra.» | corregido |
| Etapa «Aprobación de pedidos» | «La pruebas…»: pronombre sin antecedente; no dice qué se hace | Criterio 1 | → «Montas quién aprueba los pedidos y qué los bloquea. Lo pruebas al final de Operar…» | corregido |
| Etapa «Facturas que generan asientos» | «Contabilizas facturas» cuando la del alumno ya está contabilizada en la etapa anterior | Criterio 3/4 | → «Lees qué genera una factura al contabilizarla, registras facturas directas y corriges las que fallan.» | corregido |
| Lo básico del ERP › «Cómo moverte» › explicación 5 | Remite a «Antes de empezar», rótulo que no existe en la página de Datos maestros | Criterio 5 (resto de otro contexto) | «…en «Antes de empezar», dentro de «Qué son los datos básicos»» → «…en «Para situarte» › «Lo básico del ERP para este módulo» › «Qué son los datos básicos»» | corregido |
| Portada › recorrido «Factura» | Ejemplo FRA-{INI}-001; el bloque usa PROV-{INI}-001 | Dato del caso incoherente | — | duda |

## Bloque 1 · Dar de alta los datos básicos de gestión (maestros-2)

| Dónde | Qué falla | Por qué | Antes → después (resumido) | Estado |
|---|---|---|---|---|
| Concepto › párrafo 1 | Empieza por «Los maestros logísticos…», no conecta con el título «datos básicos de gestión» y olvida al cliente del objetivo | Criterio 1 y 4 | → «Los datos básicos de gestión son las fichas que Compras y Ventas necesitan además de las contables: el cliente, el artículo, su proveedor y el almacén. Como los maestros de Contabilidad básica…» | corregido |
| Concepto › párrafo 2 | Vuelve a definir «tercero» (visto en Contabilidad básica) y no dice que C{INI} ya existe | Criterio 3/5 | «al tercero C{INI}: así se llama en el ERP a…» → «al tercero C{INI} que creaste en Contabilidad básica. Es a quien venderás en Ventas…» | corregido |
| Concepto › orden | El «Ejemplo:» del cliente salía después del párrafo del artículo y el almacén; la cuenta logística iba suelta | Criterio 2 y 6 | Cliente → ejemplo del cliente → «Después pasas a lo físico…» (artículo, almacén y cuenta logística en un párrafo) | corregido |
| Concepto › «Dónde:» | Solo la ruta de clientes en un bloque de cinco pantallas | Criterio 4 | → «el cliente, el artículo y su proveedor, en «Gestión › Maestros»; el almacén y la cuenta logística, en «Gestión › Logística › Maestros»» | corregido |
| Cliente › paso 3 | «bloque «Datos financieros»» para un grupo de campos del ERP | «Bloque» es la unidad del curso | → «sección «Datos financieros»» | corregido |
| Artículos logísticos › paraQueSirve | Empieza por ROD{INI} y el 13500620 antes de decir qué es un artículo | Criterio 1 y 3 | → «Un artículo es el producto que…. Aquí creas ROD{INI}, un artículo solo para aprender su ficha y su stock.» | corregido |
| Artículos logísticos › explicaciones | La pantalla salía en tercer lugar, tras la familia | Criterio 6 (dónde antes que cómo) | Pantalla → unidad base → familia → «Fíjate» | corregido |
| Artículos logísticos › explicación 4 | «En Compras no lo compras: allí…»: resto de cuando el bloque estaba en Datos maestros | Criterio 5 | → «No lo compras: en las compras de este módulo usas el 13500620…» | corregido |
| Artículos por proveedor › explicaciones 2 y 3 | «Hay una consulta en…» suelta; la 3 repite la idea sin enlazar | Criterio 2 y 5 | → «Para consultar qué proveedores sirven cada artículo tienes «…»» / «Fíjate: esa pantalla… solo sirve para consultar» | corregido |
| Artículos por proveedor › paso 2 | Usa el proveedor 00001 sin decir por qué; T{INI} aún no existe | Criterio 3 (dato sin origen) | + «Es un proveedor de la demo: tu proveedor T{INI} lo creas en el bloque siguiente.» | corregido |

## Bloque 2 · Dar de alta el proveedor y el artículo (compras-1)

| Dónde | Qué falla | Por qué | Antes → después (resumido) | Estado |
|---|---|---|---|---|
| Concepto › párrafo 1 | Repite la definición de maestro del bloque anterior («como un contacto del móvil») | Criterio 5 | → «Son dos maestros más, como los del bloque anterior: el proveedor y el artículo.» | corregido |
| Tercero › explicación 2 y paso 1 | «dos bloques», «el bloque «Identificación»» | «Bloque» = unidad del curso | → «dos secciones», «la sección «Identificación»» | corregido |

## Bloque 4 · Preparar la numeración y los tipos de documento (compras-tipos)

| Dónde | Qué falla | Por qué | Antes → después (resumido) | Estado |
|---|---|---|---|---|
| Concepto › orden | El ejemplo de la máscara #e#s#6n salía cinco párrafos después del numerador | Criterio 2 | El «Ejemplo:» de la máscara va justo detrás del párrafo del numerador | corregido |
| Concepto › párrafo «Primero miras…» | La limitación de la demo (pedido sin líneas) salía antes de presentar las cuatro tipologías | Criterio 6 | Se mueve al final del párrafo de las tipologías: «En esta demo el pedido se queda sin líneas, así que en Operar escribirás el albarán a mano.» | corregido |
| Concepto › «Ojo:» | 60000 y 40090 sin decir qué son | Criterio 3 | → «60000 (compras) al debe y 40090 (compras pendientes de factura) al haber» | corregido |
| Tipología de oferta › explicación 2 | «tiene los bloques Valoración…» | «Bloque» = unidad del curso | → «La ficha de la tipología tiene las secciones…» | corregido |
| Tipología de albarán › explicación 3 | «como el albarán de la demo del bloque «Contabilizar el albarán de compra»»: lo da por visto y viene después | Criterio 3 | → «lo verás con un albarán de la demo en el bloque «…»» | corregido |

## Bloque 5 · Montar la aprobación de pedidos (compras-workflow-config)

| Dónde | Qué falla | Por qué | Antes → después (resumido) | Estado |
|---|---|---|---|---|
| Rol › explicación 3 | «Un rol es en realidad una lista de usuarios» repite la explicación 1 | Criterio 5 | Empieza directamente por «En una empresa real aquí pondrías…» | corregido |
| Grupo › explicación 4 | «No se ha comprobado qué cambia si la quitas»: texto de trabajo visible | Criterio 5 | → «déjala como viene: el caso no la usa.» | corregido |
| Grupo › aviso «Punto de control» | Repite palabra por palabra la consecuencia del aviso anterior | Criterio 5 | → «abre la línea 1 del grupo y comprueba que «Código workflow» muestra tu WF{INI}.» | corregido |

## Bloque 6 · Pedir: de la oferta al pedido (compras-3)

| Dónde | Qué falla | Por qué | Antes → después (resumido) | Estado |
|---|---|---|---|---|
| Concepto › párrafo 3 | «las tipologías OC{INI} y PC{INI} del bloque anterior»: el anterior es el de la aprobación | Criterio 3 (remisión equivocada) | → «del bloque «Preparar la numeración y los tipos de documento»» | corregido |
| Oferta › explicación 2 | «Los bloques de la línea…» | «Bloque» = unidad del curso | → «La ficha de la línea tiene, entre otras, las secciones…» | corregido |

## Bloque 8 · Contabilizar el albarán de compra (compras-albaran-contabilizar)

| Dónde | Qué falla | Por qué | Antes → después (resumido) | Estado |
|---|---|---|---|---|
| Concepto › párrafos 1-2 | Define otra vez contabilizar, asiento, debe y haber como si fueran nuevos | Criterio 2 (sin puente con Contabilidad básica) | → «Como viste en Contabilidad básica, contabilizar es…» / «Genera un asiento con sus apuntes al debe y al haber, como los que escribiste en Contabilidad básica.» | corregido |
| Contabilizar › aviso | «En la demo no lo hemos pulsado» | Texto de trabajo | → «…lo revierte (sin verificar en esta demo).» | corregido |
| Asiento › paso 2 | «En tu asiento, Debe es… 125,00», cuando el objetivo dice que tu AO{INI} no contabiliza | Criterio 4 (contradice el objetivo) | → «Con las 10 unidades del caso, el Debe sería 125,00.» | corregido |
| Demo real › problema 3 | «Tu albarán lleva la tipología AO{INI}»: manda buscar el que no sirve | Criterio 4 | → «Busca uno validado cuya tipología contabilice: tu AO{INI} no sirve en este bloque.» | corregido |
| Paso 1, checklist 1, aprendido 5 (y Bloque 10: explicación 1, paso 1, checklist 1) | Hablan del «albarán de T{INI}» que contabiliza, pero el objetivo dice que es de la demo y nadie explica cómo nace un albarán de T{INI} con tipología contable | Dato funcional: ¿qué albarán abre el alumno? | — | duda |

## Bloque 9 · Registrar y contabilizar la factura (compras-factura)

| Dónde | Qué falla | Por qué | Antes → después (resumido) | Estado |
|---|---|---|---|---|
| Concepto › «Fíjate:» | «errores que aprenderás a leer» sin decir dónde | Criterio 3 | + «en la parte «Contabilizar la factura»» | corregido |
| Campo «Factura proveedor» vs checklist 1 y aprendido 1 | PROV-{INI}-001 en el campo; FRA-{INI}-001 en checklist, aprendido y portada | Código del caso incoherente | — | duda |

## Bloque 10 · Generar la factura desde el albarán (compras-generar-factura)

| Dónde | Qué falla | Por qué | Antes → después (resumido) | Estado |
|---|---|---|---|---|
| Concepto › «Ejemplo comprobado» | «No sabemos si hay tolerancia…»: texto de trabajo | Criterio 5 | → «Solo en esta demo la diferencia pasa sin aviso; en una empresa real revísala antes de contabilizar.» | corregido |
| Importes › aviso 2 | «no sabemos si la tipología tolera un margen» | Texto de trabajo | → misma frase de limitación | corregido |
| Campo PROV-{INI}-002 vs checklist FRA-{INI}-003 | Dos números distintos para la misma factura | Código incoherente | — | duda |

## Bloque 11 · Contabilizar una factura de compra (icon-contabilidad-v-1)

| Dónde | Qué falla | Por qué | Antes → después (resumido) | Estado |
|---|---|---|---|---|
| Concepto › primera frase | Enseña a contabilizar como si fuera nuevo, dos bloques después de que el alumno contabilizó su factura | Criterio 1 y 3 | → «En este bloque miras con calma qué genera una factura de compra al contabilizarla. Ya contabilizaste la tuya en «Registrar y contabilizar la factura»…» | corregido |
| Concepto › párrafos 2-3 | Vuelve a definir factura, albarán, asiento, debe y haber | Criterio 5 | → «La factura de este bloque viene de un albarán, como la tuya.» / «el asiento, con su debe y su haber, que suman lo mismo» | corregido |
| Concepto › «Ejemplo:» | «PROV-{INI}-001 que acabas de registrar»: se registró dos bloques antes | Criterio 3 | → «que contabilizaste en «Registrar y contabilizar la factura»» | corregido |

## Bloque 12 · Crear facturas directas en Finanzas (icon-contabilidad-v-2)

| Dónde | Qué falla | Por qué | Antes → después (resumido) | Estado |
|---|---|---|---|---|
| Concepto › párrafo 1 | «un gasto suelto que no pasó por Compras», dentro del módulo de Compras | Criterio 5 | → «…que no pasó por el circuito de oferta, pedido y albarán que acabas de recorrer» | corregido |
| Concepto › párrafo 3 | «Un tercero es cualquier persona…»: redefinición a mitad de Compras | Criterio 5 | → «El tercero de la factura de compra es el proveedor, como en Gestión.» | corregido |
| Concepto › factura de venta FB | Aparece una venta en Compras sin decir por qué | Criterio 3 | → «Al final preparas también una factura directa de venta FB, para ver que el formulario es el mismo; las ventas las trabajarás a fondo en el módulo de Ventas…» | corregido |
| Paso 3 (texto vs detalle) | «en la demo, la 0» y, en el detalle, «usa los que te indique el formador» | Dato contradictorio | — | duda |

## Bloque 13 · Rectificar o sustituir una factura (icon-contabilidad-v-3)

| Dónde | Qué falla | Por qué | Antes → después (resumido) | Estado |
|---|---|---|---|---|
| Rectificativa › explicaciones | Empezaba por «En otros países…» y la 2 decía «esos cambios» sin antecedente | Criterio 2 y 6 | España (para qué) → original vinculada → «En otros países… nota de crédito: cumple el mismo papel» | corregido |

## Bloque 14 · Resolver una factura que no contabiliza (icon-contabilidad-v-4)

| Dónde | Qué falla | Por qué | Antes → después (resumido) | Estado |
|---|---|---|---|---|
| Concepto › primera frase | Define contabilizar; no conecta con «Resolver una factura que no contabiliza» | Criterio 1 y 4 | → «A veces una factura no contabiliza, o contabiliza sin dejar lo que esperas. En este bloque aprendes a encontrar la causa. Recuerda que…» | corregido |
| Test 3 › explicación | Dice «modificar la tipología» y la pregunta va del tipo de efecto | Criterio 4 | → «…así puedes modificar el tipo de efecto.» | corregido |
| Concepto y periodos | La compra del caso es «del 09-10-2026»; el Bloque 9 contabiliza «Hoy (12-11-2026)» | Fecha del caso incoherente | — | duda |

## Bloque 15 · Devolución de mercancía y abono del proveedor (compras-abono-devolucion)

| Dónde | Qué falla | Por qué | Antes → después (resumido) | Estado |
|---|---|---|---|---|
| Concepto › párrafo 1 | No enlaza con el bloque «Rectificar o sustituir una factura» que el alumno acaba de hacer | Criterio 2 | «Es como una tachadura con firma…» → «Es la rectificativa que viste en «Rectificar o sustituir una factura», aplicada a una devolución.» | corregido |
| Concepto › párrafo 2 | «restando» sin explicar | Criterio 3 | → «copia de las facturas con «Restando»: lo que abonas se descuenta de la factura original» | corregido |
| Concepto › «Atención:» | «no pudimos completar… lo que sí funciona hasta ahora»: texto de trabajo; «Atención» no es un rótulo de recuadro | Criterio 5 | → «Ojo: solo en esta demo faltan piezas… llegas hasta la cabecera y ves dónde se para.» | corregido |
| Tipologías › aviso 2 | «No hemos pulsado «Anular»…» | Texto de trabajo | → «No pulses «Anular» en los albaranes de la demo: pide un motivo y no se puede deshacer.» | corregido |
| Copiar líneas › paraQueSirve, explicación 3, aviso de solución y nota | «hasta dónde llegamos», «no encontramos», «no lo hemos conseguido», «No lo hemos comprobado» | Texto de trabajo (4 frases) | → «hasta dónde llega la demo», «la ficha no muestra el campo…», «Solo en esta demo no se puede hacer…; avisa al formador», «(sin verificar en esta demo)» | corregido |

## Bloque 16 · Registrar y consultar el stock (maestros-3)

| Dónde | Qué falla | Por qué | Antes → después (resumido) | Estado |
|---|---|---|---|---|
| Concepto › «Ojo:» | «baja 10 con la venta»: la venta aún no se ha hecho (Ventas va después) | Criterio 3 | → «subió 10 con el albarán de compra y bajará 10 cuando lo vendas en Ventas» | corregido |

## Bloque 17 · Probar y autorizar un pedido con workflow (compras-workflow)

| Dónde | Qué falla | Por qué | Antes → después (resumido) | Estado |
|---|---|---|---|---|
| Concepto › párrafos 1-2 | Empieza por una orden («Antes de este bloque haz…») y sigue con «Ahora lo pruebas», sin decir qué es el bloque | Criterio 1 | → «En este bloque compruebas que funciona la aprobación de pedidos que montaste en «Montar la aprobación de pedidos»…: el rol…, el circuito…. Si aún no la has montado, hazlo antes.» | corregido |

## Glosario y examen del módulo

| Dónde | Qué falla | Por qué | Antes → después (resumido) | Estado |
|---|---|---|---|---|
| Glosario › «Unidad de negocio» | «Bloque de la cabecera… nuestra empresa» | Tuteo; «bloque» | → «Sección de la cabecera… tu empresa» | corregido |
| Glosario › «Régimen general de IVA» | «nos cobra… nosotros» | Tuteo | → «te cobra… tú lo puedes deducir» | corregido |
| Glosario › «Descuento comercial y pronto pago» | «que nos hace» | Tuteo | → «que te hace» | corregido |
| Glosario › «Relaciones contables (gconcuen)» | Código de tabla en el término | Norma de no mostrar tablas | No se toca: el término es la clave de enlace del glosario | duda |
| Examen › pregunta 1 | La explicación dice «ya no se conforma desde la factura», y el Bloque 9 conforma desde la factura | Contradice el módulo y compara versiones | → «…con Acciones › Generar factura (el camino B). Conformar se hace desde la factura (el camino A).» | corregido |
| Examen › pregunta 2 | «sustituye al botón… del ERP antiguo»; explicación con gcompedh_gen_gcomalbh | Comparación de versiones y código interno | → «En una base bien configurada, ¿qué proceso crea el albarán a partir de las líneas de un pedido?» | corregido |
| Examen › pregunta 3 | «En el ERP nuevo no existe CRC»; opciones con gcomfach_dif_albaran y cdocnumh | Comparación de versiones, sigla y tablas nunca vistas | → «¿Qué mecanismos controlan las diferencias entre el albarán y la factura?»; opciones con el informe «Diferencias entre albaranes y facturas» y «la serie fiscal de las facturas» | corregido |
| Examen › preguntas 5, 10, 12, 14 y 15 | «En el ERP nuevo…» y «gcomfacd» | Comparación de versiones y código de tabla | Se quita la coletilla y el código; la 5 precisa «cuya tipología lleva plantilla de asiento» | corregido |
| Examen › pregunta 10 | Da por hecho que hay tolerancias en la tipología de factura; el Bloque 10 dice que no está comprobado | Dato funcional | — | duda |

## Pendiente que no es de orden (lo dejo anotado)

- La palabra «bloque» para secciones del formulario del ERP sigue en unos 20 textos de pasos y en preguntas de «De memoria» (Bloques 2, 4 y 11). He cambiado las que estaban en explicaciones y conceptos. Las preguntas no las he tocado, porque guardan el progreso.
- El Bloque 7 (checklist 5) usa el «Stock global» antes de que el Bloque 16 lo explique. Da la ruta, así que no bloquea al alumno.

## Recuento

- Hallazgos: 66.
- Corregidos: 58 (portada y etapas 6, Bloque 1 10, Bloque 2 3, Bloque 4 5, Bloque 5 3, Bloque 6 2, Bloque 8 4, Bloque 9 1, Bloque 10 2, Bloque 11 3, Bloque 12 3, Bloque 13 1, Bloque 14 2, Bloque 15 8, Bloque 16 1, Bloque 17 1, glosario 3, examen 4 filas, que suman 8 preguntas).
- Dudas funcionales no tocadas: 8 (albarán contable «de T{INI}» de los Bloques 8 y 10; números de factura del proveedor PROV/FRA; número de la factura del Bloque 10; fecha del caso 09-10 frente a 12-11; empresa del Bloque 12; tolerancias en el examen; término «gconcuen» del glosario; número de factura en el recorrido de la portada, que va con la de PROV/FRA).
- Validación: los 4 JSON cargan; `comprobar_estructura.py` da 0 errores estructurales y 0 avisos.

## Tres ejemplos de antes y después

1. **Primera frase que no dice qué es el bloque** (Bloque 1, concepto)
   - Antes: «Los maestros logísticos son las fichas que describen las cosas físicas: producto, proveedor y almacén.»
   - Después: «Los datos básicos de gestión son las fichas que Compras y Ventas necesitan además de las contables: el cliente, el artículo, su proveedor y el almacén. Como los maestros de Contabilidad básica, se crean una vez y se reutilizan en muchos documentos.»
2. **Remisión equivocada** (Bloque 6, concepto)
   - Antes: «Usas las tipologías OC{INI} y PC{INI} del bloque anterior». El bloque anterior es «Montar la aprobación de pedidos».
   - Después: «Usas las tipologías OC{INI} y PC{INI} del bloque «Preparar la numeración y los tipos de documento»».
3. **Algo ya hecho tratado como nuevo** (Bloque 11, concepto)
   - Antes: «Contabilizar una factura es pasarla a la contabilidad…». Y luego: «la factura PROV-{INI}-001 que acabas de registrar». Pero el alumno la contabilizó dos bloques antes.
   - Después: «En este bloque miras con calma qué genera una factura de compra al contabilizarla. Ya contabilizaste la tuya en «Registrar y contabilizar la factura»; ahora lees, una a una, las tres cosas que deja.»
