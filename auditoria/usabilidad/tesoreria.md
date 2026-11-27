# Lectura en contexto y en orden: Tesorería (módulo 6)

Zona revisada: lo que sale en el volcado `06-tesoreria.md`. Incluye `tesoreria.json` (con los bloques icon-cartera-v-8 a v-11, que ya están en ese fichero) y `asientos-14` de `icon-contabilidad.json`. También `examenes/tesoreria.json`, `glosario/tesoreria.json` y la entrada `tesoreria` de `portadaDatos.ts` y de `etapas.ts`.
Orden de lectura: página del módulo → etapas Configurar → Operar (movimientos y conciliación, remesas en el banco) → Para saber más → examen y glosario.

## Página del módulo (#/modulo/tesoreria)

| Dónde | Qué falla | Por qué | Antes → después (resumido) | Estado |
|---|---|---|---|---|
| portadaDatos › frase | La primera frase no tiene verbo ni dice qué es el módulo (el mismo patrón que Sergi señaló en Datos maestros) | Criterio 1 | «El dinero que entra y sale del banco: lo registras…» → «Tesorería controla el dinero real que entra y sale de tus bancos: registras cada movimiento y lo casas con el extracto…» | corregido |
| portadaDatos › aprendes 2 y 3 | No anuncian dos cosas que el módulo sí hace: leer el asiento (bloque asientos-14) y la etapa «Remesas en el banco» | Criterio 4 | Se añade «y leer su asiento» y «también con tus remesas de pago y de cobro» | corregido |
| portadaDatos › recorrido «Conceptos» | Usa «AEB» sin explicarla | Criterio 3 | «comunes de la AEB» → «comunes a toda la banca española (AEB)» | corregido |
| portadaDatos › recorrido «Conciliación» (ej.) | Los botones no coinciden con los rótulos que usan los bloques: «Conciliar · Generar · Conciliar Efectos» | Criterio 4 (el alumno no los encontrará con ese nombre) | → «Conciliar banco» · «Generar tesorería» · «Conciliar cartera» | corregido |
| portadaDatos › recorrido «Movimiento» (ej.) | «remesa PSCTT»: el código no sale en ningún bloque del módulo | Criterio 3 | Sin cambio: no sé si PSCTT es el código bueno de la remesa con tesorería | duda |
| tesoreria.json › resumen | No menciona las remesas en el banco | Criterio 4 | Se añade «y harás lo mismo con tus remesas de pago y de cobro» | corregido |
| Lo básico › «Qué es la tesorería…» › explicacion 3 | Salto de tema: entre «de dónde nacen los movimientos» y «qué lleva un movimiento» aparece la previsión a medio plazo, con un parámetro que aún no se ha visto | Criterios 2 y 3 | «La previsión a medio plazo llega por… y por el parámetro «Notificar medio plazo»…» → frase puente: «Los préstamos y la financiación, además, anuncian cobros y pagos futuros: es la tesorería a medio plazo… La verás al final, en «Gestionar la financiación».» | corregido |
| Lo básico › «Cómo moverte…» › explicacion 5 | El orden de los bloques se salta la etapa de remesas | Criterio 4 | «(movimientos y conciliación)» → «(movimientos, extracto, conciliación y remesas en el banco)» | corregido |
| etapas.ts › «Movimientos, extracto y conciliación» | Dice «lees el extracto», pero el bloque lo carga o lo da de alta | Criterio 4 | «lees el extracto» → «cargas el extracto» | corregido |

## Configurar › Preparar el banco

| Dónde | Qué falla | Por qué | Antes → después (resumido) | Estado |
|---|---|---|---|---|
| Bloque 1 «Preparar el banco propio» › concepto ¶2 | Vuelve a definir la tesorería como si fuera nueva, cuando la página del módulo acaba de hacerlo | Criterio 5 | «Tesorería es el control…» → «Recuerda: tesorería es el control…» | corregido |
| Bloque 1 › concepto ¶3 y «Fíjate» | Dos párrafos dicen lo mismo («el banco del caso es BBVA_{INI}»); de dónde sale el banco quedaba al final | Criterio 5 | El origen (Cartera, bloque «Dar de alta bancos propios y cajas») pasa al ¶3; el «Fíjate» se queda solo con CAIXA{INI} | corregido |
| Bloque 1 › parte «Repasar el banco propio» › explicacion 1 | Dice «solo repasas», pero el paso 3 pide añadir el banco y el IBAN y guardar | Criterio 4 (texto y pasos se contradicen) | → «repasas lo que usa tesorería y solo añades el banco y un IBAN de prueba, que necesita el fichero del extracto» | corregido |
| Bloque 2 «Configurar flujos, operaciones y parámetros» › concepto ¶2 | Habla de «{INI}COM» antes de explicar qué son el flujo y la operación. Además dice que solo es para la comisión de 10,00, y el paso 6 también la usa para la de 3,50 | Criterios 3 y 4 | El párrafo se mueve detrás de la explicación de las dos piezas y se reescribe: un flujo y una operación {INI}COM para tus dos comisiones (10,00 a mano y 3,50 desde el banco propio) | corregido |
| Bloque 2 › parte «Crear la operación» › campos 4 y 8 (ej.) | Ejemplos de la captura (Cash Pooling, NETT) sin decir que son de la captura | Regla «todo dato tiene origen» | Se añade «(en la captura)»; en Flujo, «{INI}COM para tu operación» | corregido |

## Operar › Movimientos, extracto y conciliación

| Dónde | Qué falla | Por qué | Antes → después (resumido) | Estado |
|---|---|---|---|---|
| Bloque 3 «Registrar un movimiento manual» › aviso nota 2 | Repite casi palabra por palabra el «Fíjate» del concepto (PTES, remesa, bloque de Cartera) | Criterio 5 | → «Tu comisión de 10,00 no tiene efecto ni remesa detrás: por eso la creas a mano. El pago de 151,25 sí nació de tu remesa y ya está en esta misma lista (PMICDT).» | corregido |
| Bloque 4 «Entender el asiento…» (asientos-14) › concepto «Dónde:» | «Buscador › Movimientos de tesorería» no es una ruta de menú; el bloque anterior usa la ruta real | Criterio 4 y regla de rutas | → «Finanzas › Tesorería › Ops. corto plazo», pantalla «Movimientos de tesorería» (en el buscador, taptcuen) | corregido |
| Bloque 4 › parte 1 › explicacion 4 | Repite literalmente el ¶3 del concepto | Criterio 5 | → frase puente hacia el ejemplo: «Un pago es una salida: por eso el flujo del proveedor va al Debe y el banco al Haber, como en el ejemplo siguiente.» | corregido |
| Bloque 4 › parte 1 › paso 3 y checklist 3 | Pide escribir el asiento «antes de pulsar Contabilizar», pero ese movimiento ya se contabilizó en el bloque 3 (paso 6 y checklist 4) | Criterio 3 (pide algo que ya está hecho) | Texto: «Escribe el asiento que esperas y compáralo con el que deja «Contabilizar»». En el detalle y la checklist: «ya lo contabilizaste allí; si no, pulsa ahora «Contabilizar»» | corregido |
| Bloque 4 › parte 2 › aviso nota | Repite la explicacion 2 de la misma parte | Criterio 5 | → lo aplica a tu caso: «En tu comisión {INI}TRF, «Operación comisión» es {INI}COM: por eso los 3,50 salen como un movimiento aparte de -3,50» | corregido |
| Bloque 4 › concepto «Ejemplo» frente a parte 2 paso 2 y bloque 9 | El concepto dice que el pago deja «40000.T{INI} al debe… por 151,25». La parte 2 y el bloque 9 dicen «cuenta puente de la remesa al debe» | Dato contable | Sin cambio: hay que confirmar qué cuenta va al debe en el asiento del banco | duda |
| Bloque 5 «Dar de alta el extracto bancario» › concepto ¶1 | Empieza con «El banco te manda sus movimientos. Tú los comparas… Esa lista es el extracto»: no dice primero qué es | Criterio 1 | → «El extracto bancario es la lista de movimientos que te manda el banco, como el resumen mensual de tu cuenta. Tú la comparas con tus movimientos de tesorería.» | corregido |
| Bloque 5 › parte 1 › paso 4 | Remite a una parte posterior sin decir que está en el mismo bloque | Criterio 3 | Se añade «más abajo en este bloque» | corregido |
| Bloque 5 › parte 2 › explicacion 5 | Dice que, sin fichero, te saltes también «la siguiente» (revisar movimientos), que sigue siendo útil con el alta a mano | Criterio 6 | → «salta esta parte: das de alta las seis líneas a mano en la última parte del bloque y las revisas igual en la parte siguiente» | corregido |
| Bloque 5 › parte 4 «Conceptos comunes» › explicacion 1-2 | La parte empieza con «Ojo: esto lo configura el responsable…» antes de decir qué son los conceptos comunes | Criterio 1 | Se cambia el orden de las dos frases: primero qué son y después el «Ojo» | corregido |
| Bloque 5 › parte 5 «Conceptos propios» › explicacion 1-2 | Mismo problema de orden. Además, «Tú solo mira que existe» contradice el paso 4 de la parte 1 (crear 002, 004, 006 y 017 si faltan) y el «Sirve para dar de alta…» | Criterios 1 y 4 | Se cambia el orden. Ojo nuevo: «Tú solo creas, si faltan, los cuatro conceptos de tu caso (primera parte de este bloque); el resto, míralo sin cambiarlo» | corregido |
| Bloque 5 › parte 6 › título | «Dar de alta a mano el extracto de tu movimiento» anuncia una línea; la parte da de alta seis | Criterio 4 | → «Dar de alta a mano las seis líneas del extracto» (el id de sección no cambia) | corregido |
| Bloque 6 «Conciliar el banco» › parte 2 › paso 6 | «contabiliza… como en «Conciliar y contabilizar una remesa»»: remite a un bloque que viene después como si ya se hubiera hecho | Criterio 3 | → «Su contabilización la haces paso a paso en el bloque «Conciliar y contabilizar una remesa», en la etapa siguiente» | corregido |
| Bloque 6 › parte 4 «Conciliación automática» › explicacion 2 y paso 2 | «En la sesión se filtró…»: resto de la transcripción de la grabación | Criterio 5 | → «En la captura, de la demo TRI, se filtró…». En el paso: primero tus fechas (01-10-2026 a 31-12-2026) y después el 313 de la captura | corregido |

## Operar › Remesas en el banco (bloques que vienen de Cartera)

| Dónde | Qué falla | Por qué | Antes → después (resumido) | Estado |
|---|---|---|---|---|
| Bloque 7 «Conocer el circuito…» (icon-cartera-v-8) › concepto ¶1 | Vuelve a definir el extracto y la conciliación como algo nuevo justo después de los bloques 5 y 6, y no dice qué hace este bloque | Criterios 1 y 5 | Se añade una frase al principio: «Este bloque ordena el circuito de una remesa en el banco: qué emite el banco, qué hace la empresa y en qué orden.» | corregido |
| Bloque 8 «Crear el extracto de una remesa» (v-9) › concepto ¶3-4 | Vuelve a explicar los conceptos común y propio como si fueran nuevos | Criterio 5 | → «Como viste en «Dar de alta el extracto bancario», cada movimiento lleva dos códigos…»; «Fíjate también en el signo» | corregido |
| Bloque 8 › parte › aviso nota 1 | Repite lo que dicen el concepto y el campo 4 sobre los códigos 04 y 17 | Criterio 5 | → «Usa los mismos códigos que el fichero del caso (04/004 y 17/017): así tus líneas manuales son iguales a las cargadas» | corregido |
| Bloque 9 «Conciliar y contabilizar una remesa» (v-10) › concepto y parte 2 paso 1 | El bloque 6 ya pidió conciliar 151,25 y 3,50; aquí se piden otra vez como si estuvieran pendientes | Criterio 3 (orden) | Frase puente: «Si ya los casaste en «Conciliar el banco», no los concilies otra vez: búscalos en «Tesorería conciliada» y pasa a contabilizar». En el paso 1: «…salta al paso 4» | corregido |
| Bloque 10 «Conciliar un cobro y un anticipo» (v-11) › concepto | «ese -500» no se refiere a nada que se haya dicho antes (solo se habían mencionado «dos efectos») | Criterio 3 | «Genera dos efectos de signo contrario, +500 y -500…»; «el efecto negativo (-500) no mueve dinero» | corregido |
| Bloque 10 › título | El título dice «Conciliar», pero el bloque no concilia nada: los cobros se quedan pendientes y el anticipo solo se mira | Criterio 4 | Sin cambio: `carteras.json` (fuera de mi zona) cita el título literal. Propuesta: «Revisar en el banco un cobro y un anticipo» | duda |

## Operar › Para saber más (opcional)

| Dónde | Qué falla | Por qué | Antes → después (resumido) | Estado |
|---|---|---|---|---|
| Bloque 11 «Gestionar cajas» › parte 1 › explicacion 1 | Tautología: «La caja de efectivo registra… los movimientos de una caja» | Criterio 1 | → «El módulo de cajas registra, controla y cierra los movimientos de cada caja de efectivo.» | corregido |
| Bloque 11 › partes 3 y 4 › paso 1 | Las rutas de los pasos (Caja › Movimientos; Caja › Remesas › Registro) no coinciden con las de la parte (Registro y operativa; Cheques y Remesas) | Ruta del menú | Sin cambio: hay que comprobar el rótulo real del menú | duda |
| Bloque 12 «Gestionar la financiación» › parte 1 › explicacion 1 | Frase sin sujeto que abre la parte: «Registra y controla la deuda…» | Criterio 1 | → «El módulo de financiación registra y controla la deuda o el crédito que se devuelve en cuotas, como un préstamo bancario.» | corregido |
| Bloque 13 «Gestionar valores y avales» › concepto ¶1 | No dice qué reúne el bloque («Tesorería controla ambas cosas…») | Criterio 1 | → «Además del día a día, tesorería controla tres cosas más: las inversiones (cartera de valores), los avales… y cuánto dinero habrá (informes de posición).» | corregido |
| Bloque 13 › parte 1 › explicacion 1 | Frase sin sujeto: «Registra valores de inversión…» | Criterio 1 | → «La cartera de valores registra las inversiones de la empresa…» | corregido |
| Bloque 13 › parte 3 «Avales» › explicacion 1 | La parte empieza con un detalle (la comisión) en vez de decir qué se registra | Criterio 1 | → «Cada aval se registra con su banco, su importe y su comisión: el banco suele cobrar una comisión periódica por darlo.» | corregido |

## Examen y glosario

| Dónde | Qué falla | Por qué | Antes → después (resumido) | Estado |
|---|---|---|---|---|
| examen 3 › explicación | «Clase y Acción son datos que se ejecutan…»: no se entiende | Claridad | → «Clase y Acción dicen qué acción de cartera se ejecuta por detrás. Solo hacen falta cuando el movimiento nace en la cartera.» | corregido |
| examen 10 › explicación | «El signo depende de la base» choca con la «regla única del signo» del bloque 5 | Coherencia con el módulo | → «La referencia son los extractos ya cargados de esa cuenta. En la base de prácticas… cargos en positivo y abonos en negativo; en otras bases puede verse otro criterio.» (la respuesta correcta no cambia) | corregido |
| examen 14 › pregunta | «del mismo importe»: falta el signo contrario, que es la clave en todo el módulo | Coherencia | Se añade «y signo contrario» | corregido |
| examen 15 › explicación | «La sesión de conciliación automática…»: resto de la grabación | Criterio 5 | → «La conciliación automática se acota con…» | corregido |
| glosario › Extracto bancario (ej.) | Dato sin origen (BBVACCTRI, 2024, 227 movimientos) | Regla «todo dato tiene origen» | → las seis líneas de tu BBVA_{INI}, del 01-10-2026 al 31-12-2026, 3.077,25 | corregido |
| glosario › Conciliación bancaria (ej.) | «el signo… depende de la base» contradice el módulo | Coherencia | → «El cargo de 10,00 del extracto de BBVA_{INI} se casa con tu salida de -10,00…» | corregido |
| glosario › Conciliación automática (ej.) | Nombre de pantalla técnico (textract_concaut) y demo sin decir cuál es | Regla de códigos | → «En la demo TRI, la conciliación automática filtrada por…» | corregido |
| glosario › Extorno (ej.) | «Cancelar Extractos», con mayúscula; en los bloques sale «Cancelar extractos» | Rótulo literal | Sin cambio: no está comprobado cuál es el rótulo real | duda |

## Recuento

- Hallazgos: 48.
- Corregidos: 43.
- Dudas funcionales sin tocar: 5.
  1. Cuenta del debe en el asiento del pago (40000.T{INI} o cuenta puente).
  2. Código PSCTT del recorrido.
  3. Título del bloque v-11, que se cita desde `carteras.json`.
  4. Rutas de los pasos de Caja.
  5. Mayúscula de «Cancelar Extractos».
- `comprobar_estructura.py`: 0 errores estructurales y 0 avisos. Los cuatro JSON son válidos.

## Tres ejemplos de antes y después

1. **Primera frase de la página del módulo** (frase de portadaDatos)
   - Antes: «El dinero que entra y sale del banco: lo registras en tesorería y lo casas con el extracto que manda el banco.»
   - Después: «Tesorería controla el dinero real que entra y sale de tus bancos: registras cada movimiento y lo casas con el extracto que manda el banco.»
2. **Algo que ya se ha hecho** (asientos-14, paso 3)
   - Antes: «Antes de pulsar «Contabilizar», escribe el asiento que esperas… Contabiliza solo tu propio movimiento», aunque el bloque anterior ya lo había contabilizado.
   - Después: «Escribe el asiento que esperas y compáralo con el que deja «Contabilizar»… ya lo contabilizaste allí; si no lo hiciste, pulsa ahora «Contabilizar».»
3. **Remisión a un bloque que viene después** (Conciliar el banco, paso 6)
   - Antes: «Después, contabiliza los movimientos de 151,25 y de 3,50 como en «Conciliar y contabilizar una remesa».»
   - Después: «Su contabilización la haces paso a paso en el bloque «Conciliar y contabilizar una remesa», en la etapa siguiente.» En ese bloque se añade: «Si ya los casaste en «Conciliar el banco», no los concilies otra vez…»
