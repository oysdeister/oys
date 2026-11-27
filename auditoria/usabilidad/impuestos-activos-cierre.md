# Lectura en contexto: Impuestos, Activos fijos y Contabilidad avanzada y cierre

Sección «impuestos-activos-cierre» (módulos 7, 8 y 9). Leído en orden de pantalla con los volcados `07-icon-impuestos.md`, `08-icon-activos.md` y `09-contabilidad-avanzada.md`. El volcado regenerado tras los cambios está en el scratchpad, carpeta `volcado-iac`.

Ficheros tocados (solo con Edit, cadena a cadena): `app/src/pages/portadaDatos.ts` (3 frases), `app/src/content/etapas.ts` (5 «que» de etapa), `icon-impuestos.json`, `icon-activos.json`, `contabilidad-avanzada.json`, `examenes/icon-activos.json` (texto de 2 opciones) y `glosario/icon-activos.json` (1 definición).

## Páginas de módulo y etapas

| Dónde | Qué falla | Por qué | Antes → después (resumido) | Estado |
|---|---|---|---|---|
| Impuestos › frase de portada | No dice qué es el módulo; arranca con «Entiendes…» | Criterio 1 | «Entiendes el IVA desde cero y sigues cómo el ERP decide…» → «Este módulo explica cómo calcula el ERP el IVA de cada factura y cómo se declara a Hacienda. Empiezas por el IVA desde cero y terminas en la liquidación del trimestre.» | corregido |
| Activos › frase de portada | No dice qué es un activo ni para qué sirve el módulo | Criterio 1 | «Entiendes la amortización desde cero, organizas…» → «Este módulo explica cómo controla el ERP lo que la empresa compra para usar varios años, como un ordenador o una máquina…» | corregido |
| Contabilidad avanzada › frase de portada | No menciona el caso final, que es la mitad del módulo | Criterio 1 y 4 | «Cierras el ejercicio, abres el siguiente y consultas…» → «Este módulo cierra el curso: aprendes a cerrar el año contable, abrir el siguiente y consultar los balances. Terminas con el caso final…» | corregido |
| Impuestos › etapa «Cómo decide el ERP el impuesto» | Frase sin verbo | Criterio 1 | «Qué calcula el ERP y por qué, los maestros…» → «Entiendes qué calcula el ERP y por qué, recorres los maestros fiscales, compruebas los datos… y lees la regla…» | corregido |
| Impuestos › etapa «Declarar» | Frase sin verbo | Criterio 1 | «Registro fiscal, control antes de presentar y liquidación.» → «Revisas el registro fiscal de cada factura, lo controlas antes de presentar y liquidas el IVA del trimestre.» | corregido |
| Activos › etapa «El activo y sus maestros» | Frase sin verbo | Criterio 1 | «Qué es un activo fijo y cómo se amortiza…» → «Entiendes qué es un activo fijo y cómo se amortiza, ves cómo lo guarda el ERP…» | corregido |
| Activos › etapa «Amortizar y dar de baja» | Frase sin verbo | Criterio 1 | «La vida del activo hasta que sale de la empresa.» → «Sigues la vida del activo: lo amortizas cada año y, al final, lo das de baja o lo vendes.» | corregido |
| Cierre › etapa «Cerrar el año» | Lista de sustantivos | Criterio 1 | «Cierre, apertura, balances y consolidación.» → «Aprendes a cerrar el ejercicio y abrir el siguiente, lo practicas con tu empresa y consultas los balances y la consolidación.» | corregido |
| Activos › orden de etapas | «Comprobar la familia del artículo» (Configurar) habla de la tipología de factura, que se ve después, en Operar | Criterio 3 | Textos reescritos para no darla por vista (ver Activos, bloque 3). Mover el bloque detrás de «Revisar la factura que crea el activo» es decisión de orden del curso | duda |

## Módulo 7: Impuestos

| Dónde | Qué falla | Por qué | Antes → después (resumido) | Estado |
|---|---|---|---|---|
| B1 Entender el IVA › Concepto, párr. 4 | Definición de «tercero» metida en medio de la explicación de la regla | Frase huérfana; el tercero se vio en Maestros | «Lo decide una regla. Un tercero es cualquier persona… La regla mira…» → «Lo decide una regla, que mira tres datos: la zona fiscal de la empresa, la del tercero (el cliente o proveedor de la factura) y la clave fiscal del artículo.» | corregido |
| B1 › parte «IVA repercutido…» › explicación 1 | Repite la idea del primer párrafo del concepto | Criterio 5, pero es leve | Sin cambio | duda (menor) |
| B2 Conocer los maestros fiscales › Operaciones impositivas › explicación 5 | «Autofactura» sin explicar, y «que es la ficha fiscal…» parece describir el bloque | Criterio 3; frase ambigua | «…que el ERP usa para generar la autofactura. La verás en «Revisar el registro fiscal», que es la ficha fiscal…» → «Con ellas el ERP genera la autofactura, la factura que el comprador se hace a sí mismo… La ISP se explica a fondo en el bloque «Revisar el registro fiscal».» | corregido |
| B3 Comprobar los datos fiscales › Concepto, párr. 2 | Vuelve a definir «tercero» (otra vez en orden distinto) | Repetición huérfana | «…Un tercero es cualquier persona o empresa con la que trabajas.» → «En este bloque compruebas esos tres datos en sus fichas, sin cambiar nada.» | corregido |
| B3 › Empresa (expl. 2 y paso 1), Artículo (paso 1), problema 2 | «bloque «Datos fiscales»», «bloque «Contabilidad»» para un grupo de campos | En la interfaz «bloque» es la lección | → «grupo de campos «…»» (4 sitios) | corregido |
| B4 Leer la regla › Abrir el tipo › explicación 4 | «El bloque Cuentas usa mnemotécnicos, es decir…»: vuelve a definir lo visto en B2 | Repetición; «bloque» | → «El grupo de campos «Cuentas» lleva los mnemotécnicos que viste en «Conocer los maestros fiscales». En la captura, de la demo de los vídeos, son ESG-IVA-SV…» | corregido |
| B4 › Abrir el tipo › paso 1 | «En esta demo los mnemotécnicos son ESG-IVA-SV…», pero B2 dice que en tu demo son ES-IVA-SOP / ES-IVA-REP y que ESG-IVA-SV es de los vídeos | Contradicción entre bloques | → «En la captura, de la demo de los vídeos, … ESG-IVA-SV y ESG-IVA-RV; en tu demo pueden salir otros códigos, como los ES-IVA-SOP y ES-IVA-REP…» | corregido · duda funcional: confirmar en TUTORIAL qué mnemotécnicos tiene ESG |
| B4 › Cómo elige el ERP la regla › paraQueSirve | «Generalizar lo visto con la 2586»: el alumno ha trabajado con la 73 | Criterio 4 | → «…lo que has visto con la regla 73…» | corregido |
| B4 › Cómo elige… › explicaciones 1-2 y aviso | «tres bloques», «el bloque de compras» | «bloque» = lección | → «tres grupos de campos», «el grupo de compras» | corregido |
| B4 › aprendido 1-3 y problema 2 | Dicen que el alumno leyó la FCALA23-000015 y siguió la regla 2586; él leyó la 0FC000012 y la 73 | Lo aprendido no es lo que el bloque hace | «Has leído… FCALA23-000015», «base 800,00…», «regla 2586» → 0FC000012, 10.000,00 × 21 % = 2.100,00, regla 73 (con la captura entre paréntesis) | corregido |
| B5 Probar las reglas › Concepto | La limitación («solo lo miras en las capturas») llega en el 6.º párrafo, después de narrar como si el alumno fuera a hacerlo; «validar» se vuelve a explicar | Criterio 6 y 5 | Párrafo de limitación subido al 2.º lugar: «En este bloque no cambias ningún dato: el cambio y la factura nueva los hace el formador en el vídeo…»; fuera «es decir, al darla por buena» | corregido |
| B5 › Añadir una línea de servicios › paso 2 | «mira el aviso de abajo»: en Guiado el aviso no está debajo | Resto de otro contexto | → «En el campo Clave fiscal art. de la línea sale SOE, aunque la regla 1479 pide SOR: tómalo como un error de la captura.» | corregido |
| B5 › aprendido 1, 3 y 5 | «Has cambiado la zona…», «Has añadido una línea…», «Has devuelto la zona del 00003 a ESAR»: el bloque prohíbe hacerlo | Lo aprendido contradice el bloque | → «Has visto en las capturas que…», «…En tu demo lo has comprobado con las reglas 73 y 153», «Sabes por qué en la demo compartida no se cambia la zona de un tercero que no es tuyo…» | corregido |
| B5 › problema 4 | «Revísala antes de empezar» invita a tocar un tercero compartido | Contradice el aviso | → «Avisa a tu formador: tú no cambies datos que no son tuyos.» | corregido |
| B5 › Validar y leer la regla 1477 › pregunta De memoria | «Has validado y abierto…»: el alumno no valida | Pregunta no se toca (guarda progreso) | Sin cambio | duda |
| B6 Revisar el registro fiscal › parte 1 paraQueSirve; parte 2 paso 1; checklist 3 | «qué guarda cada bloque», «el bloque de la empresa 0», «el bloque de ALA» | «bloque» = lección | → «qué guarda su cabecera y qué guardan sus líneas», «las filas de la empresa 0 y su total», «las filas de ALA» | corregido |
| B6 › aprendido 2 | «registro de la FCALA23-000015»: el alumno buscó el de la 0FC000012 | Criterio 4 | → «…de la factura de prueba 0FC000012…» | corregido |
| B7 Controlar los impuestos › parte 1 › explicación 1 | Primera frase de la parte = definición de asiento, ya visto en Contabilidad básica | Frase descolgada | → «Recuerda: un asiento es el registro contable de una operación, y cada una de sus líneas es un apunte…» | corregido |
| B8 Liquidar y presentar › Calcular tu 303 › aviso | «como los que hiciste en «Contabilidad general»»: no existe ese bloque | Remisión a algo inexistente | → «como el que hiciste con tu diario {INI} en «Crear un asiento manual»» | corregido |
| B8 › Concepto | «cifras de práctica (2.100 €, la empresa FPE)»: 2.100 no sale en esas partes | Dato huérfano | → «cifras de práctica, como la prorrata de la empresa FPE» | corregido |
| B8 › aprendido 2 | «Con las cifras de práctica, 2.100 − 1.260 = 840 €»: cifras de B1, no de este bloque | Repetición fuera de sitio | Frase quitada | corregido |
| Examen de Impuestos, pregunta 4 | Pregunta por la casilla «Modificado manualmente», que no sale en ningún bloque | Criterio 3 | Sin cambio (cambiar el examen es decisión de Sergi) | duda |

## Módulo 8: Activos fijos

| Dónde | Qué falla | Por qué | Antes → después (resumido) | Estado |
|---|---|---|---|---|
| B1 Entender el activo › Concepto, último párr. | «el resultado del caso (61,50) no cambia; el cierre lo verás al final del curso»: cifra sin contexto y remisión suelta | Criterio 3 y 5 | → «el caso continuo no compra inmovilizado, así que su resultado, 61,50 de beneficio, no cambia» | corregido |
| B1 › Distinguir un activo fijo › explicación 3 | «Una cuenta contable es un cajón con número…» en el módulo 8 | Definición huérfana | Frase quitada | corregido |
| B2 Conocer los maestros › paraQueSirve de las partes 1, 2 y 3 | «Aquí preparas…», «crear la categoría…», «dar de alta cada activo…»: las partes se titulan «Revisar», «Abrir un bien», «Abrir un elemento» | Criterio 4 | → «Aquí revisas…», «Sirve para ver por dentro un bien…», «Sirve para ver la ficha de cada activo concreto…» | corregido |
| B2, B3, B4 (≈14 sitios en explicaciones, pasos, campos, checklist y aprendido) | «bloque «Cuentas»», «bloque «Parámetros inmovilizado»», «bloque central»… para grupos de campos de la ficha | «bloque» = lección | → «grupo de campos «…»», «lista «Elementos»», «parte central de la ficha» | corregido |
| B2, B3, B4 › preguntas De memoria y etiqueta de punto «Bloque Cuentas» | Siguen diciendo «bloque» | Campos protegidos | Sin cambio | duda |
| B3 Comprobar la familia del artículo › Concepto, párr. 1 | Empieza por «Que la tipología… genere inmovilizado no basta»: la tipología de factura se ve después | Criterio 3 | → «Para que una compra cree sola la ficha de un activo, el artículo… tiene que estar preparado… La otra condición… la verás en la fase Operar, en «Revisar la factura que crea el activo».» | corregido |
| B3 › Comprobar las dos condiciones › paso 1 | «Recuerda…» / «La viste en «Revisar la factura que crea el activo»»: ese bloque viene después | Criterio 3 | → «Ten presente…» / «La comprobarás en el bloque «Revisar la factura que crea el activo»: CAPA está en…» | corregido |
| B4 Revisar si el albarán crea el activo › Concepto, párr. 1 | Arranca definiendo «albarán» (visto en Compras) y dice «Si la casilla está mal» antes de presentar la casilla | Desorden | → «Un activo no solo se da de alta a mano, como hiciste con tu ordenador: también puede nacer de una compra. Es como un formulario… Si la casilla está mal…»; el albarán se nombra en el párr. 3 | corregido |
| B4 › pregunta De memoria de la parte 1 | «Estás en el albarán que crea el activo»: el albarán no lo crea | Pregunta protegida | Sin cambio | duda |
| B6 Contabilizar una factura de activos › Concepto y parte 3 | Dice que el ERP propone el primer día del mes siguiente, pero en la 0FC000012 de tu demo el componente empieza el mismo día (17-11-2026) | Posible contradicción funcional | Sin cambio | duda funcional |
| B6 › pregunta De memoria de la parte 2 (paso 3) | «Has contabilizado la factura»: el alumno no la contabiliza | Pregunta protegida | Sin cambio | duda |
| B7 Amortizar un activo › Concepto, párr. 2 | «si la empresa comprara un ordenador… Es tu componente «Portatil {INI}»»: hipótesis y hecho a la vez | Incoherente | → «tu componente «Portatil {INI}», el que creaste en «Conocer los maestros del activo», cuesta 1.200,00 y se amortiza en 4 años…» | corregido |
| B7 › Concepto, párr. 3 | «Antes del asiento, dos grupos de cuentas.» sin verbo | Frase incompleta | → «Antes de ver el asiento, conviene conocer dos grupos de cuentas.» | corregido |
| B7 › Concepto, párr. 4 | «El debe y el haber son los dos lados de cada cuenta…» en el módulo 8 | Definición huérfana | Frase quitada | corregido |
| B7 › Leer los valores › explicación 4 | «Más detalles. «Sistema»: …» | Muletilla sin verbo | → ««Sistema» es el juego de valores con el que se amortiza…» | corregido |
| B8 Dar de baja o vender › Concepto, párr. 2 | «Generan los asientos del bloque «Entender…». Primero, … Después, …»: frases cortadas sin verbo | Mala conexión | → «Generan los asientos que viste en el bloque «Entender…»: primero, …; después, …» | corregido |
| B8 › Consultar los informes › aviso | «Más adelante, en el cierre del ejercicio, lanzarás un informe de comprobación por bien»: el módulo de cierre no lo tiene | Remisión a algo que no existe | → «Antes de cerrar el ejercicio, conviene lanzar un informe de comprobación por bien…» | corregido |
| Glosario › «Parámetros de inmovilizado de la familia» | «Bloque de la familia…» | «bloque» = lección | → «Grupo de campos de la familia…» | corregido |
| Examen de Activos, pregunta 14 | «valor de adquisición… importes netos»; el módulo dice «valor de inventario» y «valor neto» | Términos distintos de los enseñados | Opciones 1 y 3 reescritas con «valor de inventario» y «valor neto» (sin cambiar la correcta ni el orden) | corregido |

## Módulo 9: Contabilidad avanzada y cierre

| Dónde | Qué falla | Por qué | Antes → después (resumido) | Estado |
|---|---|---|---|---|
| B1 Cerrar y abrir el ejercicio › Concepto, párr. 2 | «Una cuenta es un cajón con número…» en el último módulo | Definición descolgada | → «Para entender el cierre recuerda dos ideas. El saldo de una cuenta es… Y los grupos 6 y 7 del plan contable son los gastos y los ingresos.» | corregido |
| B1 › Concepto, párr. 5 | «…para ver el mecanismo; el mecanismo es el mismo» | Redundante | → «usa cifras redondas; el mecanismo es el mismo» | corregido |
| B1 › Concepto, párr. 7 | «Tienen un orden recomendado. Además, hay varias formas…»: frases sueltas | Sin puente hacia las partes | → «En las partes siguientes ves su orden recomendado, qué hace cada uno y cómo ver la contabilidad a una fecha pasada.» | corregido |
| B1 › Regularizar y cerrar temporalmente › explicación 3 | «pasa los saldos a csaldos»: nombre de tabla | Código técnico para el alumno | → «guarda los saldos en «Saldos Contables» del ejercicio siguiente» | corregido · duda funcional: «Copia el asiento de resultados a origen» no se entiende y no lo he tocado |
| B2 Cerrar el ejercicio de tu empresa › Concepto, párr. 2 | «el cierre son tres pasos… Por último, si te equivocas, la reapertura…»: la reapertura no es un paso del cierre | Incoherente con B1 | → «dos pasos… Si te equivocas, la reapertura deshace el cierre.» | corregido |
| B2 › Concepto, párr. 5 | «saldos iniciales… que hiciste antes»: el bloque es opcional («Para saber más») | Puede no estar hecho | → «…de «Registrar los saldos iniciales de una empresa»» | corregido |
| B2 › Concepto, párr. 7 | «Aviso: en la demo se comprobó… se explica con la documentación» | Texto de trabajo y tono de manual | → «Ojo: en este bloque llegas hasta la regularización. El cierre definitivo solo lo localizas y lo lees, sin pulsarlo: en esta demo no está probado.» | corregido |
| B2 › Tener el ejercicio… › aviso | «El 5.000,00 € de saldos iniciales… es» | Concordancia | → «Los 5.000,00 €… son» | corregido |
| B2 › Regularizar el ejercicio 2026 › aviso 3 | «No se ha comprobado qué hace con los periodos que ya estaban cerrados» | Texto de trabajo visible | → «Después, revisa en qué estado quedan los periodos de enero a noviembre.» | corregido · duda funcional (qué hace la reapertura con los periodos) |
| B2 › Cierre definitivo y reapertura › paraQueSirve | «Se explica con la documentación: no se ha ejecutado en la demo» | Tono de manual | → «En este bloque no lo ejecutas: solo localizas sus botones.» | corregido |
| B2 › Cierre definitivo… › explicación 3 | Repite el cierre temporal de B1 en una parte que no lo anuncia | Criterio 4 y 5 | → «No confundas el cierre definitivo con el Cierre temporal, que viste en «Cerrar y abrir el ejercicio»: …» | corregido |
| B2 › Cierre definitivo… › avisos 1 y 2 | «Este apartado…»; «Después de cerrar, consulta los asientos…» contradice «no lo pulses» | Contradicción | → «Esta parte es solo de lectura…»; «En una empresa real, después del cierre definitivo comprobarías…» | corregido |
| B2 › Cierre definitivo… › paso 1 | «No lo pulses todavía»: insinúa que luego sí | Contradicción | → «No lo pulses.» | corregido |
| B2 y caso final › títulos | «Cerrar el ejercicio de tu empresa: regularizar y preparar el cierre» y «Caso final: tu empresa de principio a fin» llevan dos puntos | Norma de títulos | Sin cambio: el caso final cita el título literal en 4 sitios; renombrar es decisión de títulos | duda |
| B3 Consultar balances › Balances › explicación 1 | «Balances genera y consulta balances de saldos…» | Tono de manual; no dice qué es | → «La carpeta «Balances» reúne los informes que resumen los saldos de las cuentas…» | corregido |
| B3 › checklist 5 | «lanzas el Estado de Situación Financiera», pero el paso dice «no hace falta ejecutarla» | Contradicción leve | Sin cambio | duda |
| B3 › Conocer la consolidación › paso 1 | «Las etapas y tareas están en la documentación (Visión general)» | Remite a material que el alumno no tiene | → «Las siete etapas de esta parte son el método de trabajo: no salen como opciones del menú.» | corregido |
| Caso final › Resumen › operación 5 | Remite a «Vender del albarán a la factura», pero el paso de la operación 5 (PD › AP › FP) se aprende en «Vender: pedido, albarán y factura» | Bloque equivocado | → «Bloque: Vender: pedido, albarán y factura» | corregido |

## Recuento

- Encontrados: 68.
- Corregidos: 59 (8 en portada y etapas, 20 en Impuestos, 15 en Activos y 16 en Cierre, contando exámenes y glosario). En 3 de ellos dejo también una duda funcional.
- Sin tocar y apuntados como duda: 9. Son 4 preguntas De memoria o etiquetas protegidas que dicen algo que el alumno no hace o usan «bloque», 1 pregunta de examen sobre algo que no se enseña, 2 títulos con dos puntos, 1 checklist contradictorio y la repetición leve de B1 en Impuestos. Aparte queda el orden de etapas de Activos.
- Dudas funcionales que no he resuelto: mnemotécnicos de ESG en TUTORIAL (ES-IVA-SOP o ESG-IVA-SV); fecha de inicio de amortización (el texto dice «primer día del mes siguiente», la 0FC000012 empieza el mismo día); qué significa «Copia el asiento de resultados a origen»; qué hace la reapertura con los periodos cerrados.
- Validación: los JSON tocados cargan bien y `comprobar_estructura.py` da 0 errores estructurales y 0 avisos (30 ficheros comparados con HEAD).

## Tres ejemplos de antes y después

1. **Lo aprendido decía algo que el bloque prohíbe hacer** (Impuestos › Probar las reglas › aprendido 5).
   Antes: «Has devuelto la zona del tercero 00003 a ESAR para no afectar a tus compañeros.»
   Después: «Sabes por qué en la demo compartida no se cambia la zona de un tercero que no es tuyo: cambiaría el IVA de las facturas de tus compañeros.»

2. **Remisión a un bloque que todavía no se ha visto** (Activos › Comprobar la familia del artículo, fase Configurar).
   Antes: «Que la tipología de factura (…) genere inmovilizado no basta. El artículo que se factura también tiene que estar preparado.» y, en el paso, «La viste en «Revisar la factura que crea el activo»».
   Después: «Para que una compra cree sola la ficha de un activo, el artículo que se factura tiene que estar preparado. (…) La otra condición, que la tipología de la factura genere inmovilizado, la verás en la fase Operar, en «Revisar la factura que crea el activo».» y «La comprobarás en el bloque…».

3. **Texto de trabajo y tono de manual** (Cierre › Cerrar el ejercicio de tu empresa › Concepto).
   Antes: «Aviso: en la demo se comprobó hasta la regularización. El cierre definitivo no se ha comprobado paso a paso: se explica con la documentación.»
   Después: «Ojo: en este bloque llegas hasta la regularización. El cierre definitivo solo lo localizas y lo lees, sin pulsarlo: en esta demo no está probado.»
