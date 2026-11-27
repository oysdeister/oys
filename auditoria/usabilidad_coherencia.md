# Usabilidad y coherencia de lectura — lista maestra (27-11-2026)

Lectura de toda la plataforma como alumno nuevo, de arriba abajo y en orden de pantalla (página de módulo → etapas → bloque: Concepto, Guiado, De memoria, Test, Demo real), sobre la versión publicada 3cec52f.
Método: volcado del texto visible en orden de pantalla (`auditoria/scripts/volcar_lectura.mjs`), corrección por secciones con el criterio común de `auditoria/usabilidad/BRIEF.md`, relectura de un junior simulado (`auditoria/usabilidad/BRIEF_JUNIOR.md`) y comprobación estructural contra el commit de partida (`auditoria/scripts/comprobar_estructura.py`: ids, partes, pasos, campos, test, respuestas correctas, imágenes y puntos clicables sin cambios).

El detalle de cada problema (dónde, qué falla, por qué, antes → después, estado) está en el informe de su sección, enlazado en la tabla.

## Recuento por sección

| Sección | Informe | Encontrados | Corregidos | Sin tocar (dudas o decisiones) |
|---|---|---:|---:|---:|
| Formación previa y Fundamentos | [previa-fundamentos.md](usabilidad/previa-fundamentos.md) | 37 | 30 | 7 (3 dudas funcionales + 4 a propósito) |
| Datos maestros y Contabilidad básica | [maestros-contabilidad.md](usabilidad/maestros-contabilidad.md) | 78 | 74 | 8 |
| Compras | [compras.md](usabilidad/compras.md) | 66 | 58 | 8 |
| Ventas | [ventas.md](usabilidad/ventas.md) | 49 | 39 | 10 |
| Cartera, cobros y pagos | [cartera.md](usabilidad/cartera.md) | 81 | 71 | 10 |
| Tesorería y bancos | [tesoreria.md](usabilidad/tesoreria.md) | 48 | 43 | 5 |
| Impuestos, Activos y Cierre | [impuestos-activos-cierre.md](usabilidad/impuestos-activos-cierre.md) | 68 | 59 | 9 |
| Páginas generales (inicio, vídeos, glosario, errores, exámenes, logros, ERP de práctica, taller, rótulos fijos) | [paginas-generales.md](usabilidad/paginas-generales.md) | 22 | 16 | 7 |
| **Total** | | **449** | **390** | **64** |

(En maestros-contabilidad, «78» agrupa sitios iguales de un mismo bloque: unas 110 cadenas editadas.)

### Relectura del junior simulado

| Zona | Informe | Páginas releídas | Se entienden | Arregladas en la relectura | Pendientes |
|---|---|---:|---:|---:|---:|
| Previa, Fundamentos, Maestros, Contabilidad | [junior_previa-a-contabilidad.md](usabilidad/junior_previa-a-contabilidad.md) | 24 | 13 | 11 (16 cadenas) | 3 dudas |
| Compras, Ventas, Cartera | [junior_compras-ventas-cartera.md](usabilidad/junior_compras-ventas-cartera.md) | 47 | 41 | 6 | 2 dudas |
| Tesorería, Impuestos, Activos, Cierre, páginas generales | [junior_tesoreria-cierre-generales.md](usabilidad/junior_tesoreria-cierre-generales.md) | 46 | 39 | 7 (9 cadenas) | 2 |

Lo que arregló la relectura: preguntas De memoria que decían «bloque» cuando su paso ya decía «sección», remisiones con el título incompleto, una palabra pegada («seamortiza»), dos contradicciones dentro de un bloque (cómo se abre un registro; empresa del caso S{INI} frente a empresa 0) y frases sin antecedente.

### Comprobaciones
- `auditoria/scripts/comprobar_estructura.py` contra 3cec52f: 0 errores estructurales y 0 avisos (ids, partes, pasos, campos, opciones, respuestas correctas, imágenes y puntos clicables iguales; ningún bloque pierde más del 35 % de texto).
- `comprobar_contenido.py` del plugin: de 34 a 29 avisos, ninguno nuevo.
- Build sin errores. Prueba de humo en escritorio y móvil (portada de módulo, bloque con Guiado, examen de módulo, glosario, vídeos, ERP de práctica, guía previa, taller) con la consola limpia.

## Problemas tipo y cómo se corrigieron

1. **Primera frase sin «qué es»**: las frases de portada de los módulos eran fragmentos sin verbo («La empresa: la ficha que usan todos los documentos…», «El dinero que entra y sale del banco: …»). Ahora cada una dice qué es el módulo y qué haces en él. Igual en etapas, conceptos de bloque y partes que empezaban por un «Ojo:».
2. **Restos de otro contexto**: «en esta sesión», «de la sesión anterior», «Comprobado en la demo», «la tabla está justo debajo», «los pasos de arriba» o «el cuadro de arriba» en pestañas donde no hay nada arriba (Guiado no muestra los avisos).
3. **Remisiones a lo que aún no se ha visto o con el bloque equivocado**: «del bloque anterior» cuando el anterior es otro, «como viste en Parametrización» (bloque opcional posterior), «creaste en Maestros» para datos que se crean en Contabilidad básica, «baja con la venta» en Compras, bloques de Configurar que citan uno de Operar como ya hecho.
4. **Repeticiones**: la misma lista en la explicación y en los pasos de la misma parte; partes que repetían un bloque anterior sin decir que es un repaso; Fundamentos volviendo a definir el ERP tras la formación previa; dos «Ejemplo:» seguidos con las mismas cifras.
5. **Orden**: avisos antes de explicar de qué hablan; el párrafo «Si nunca has trabajado con contabilidad…» entre el rótulo de una tabla y la tabla; el «Orden de los bloques» de Cartera que no seguía el orden real.
6. **Bloques fusionados o movidos que se presentaban como inicio de módulo** (Cartera, Tesorería, Compras): frase puente que los sitúa.
7. **Rótulos fijos que no casaban con el contenido**: la tabla de referencia de Datos maestros salía con cabeceras «Campo | Qué significa | Ejemplo» y lista maestros y rutas; ahora «Código en el buscador | Qué guarda | Ruta del menú». Botón «Seguir con el De memoria» → «Seguir: De memoria».
8. **Texto de trabajo visible** («no sabemos», «no lo hemos conseguido»): reescrito como «solo en esta demo» o «(sin verificar)».
9. **«Bloque» para un grupo de campos del formulario** (unos 80 sitios): ahora «sección» o «grupo de campos», para no confundirlo con los bloques del curso.

## El ejemplo de Sergi: la primera frase de Datos maestros

- Antes: «La empresa: la ficha que usan todos los documentos. Si está mal, el error se arrastra a cada pedido, factura y asiento. Lees una y creas la tuya.»
- Después: «Los datos maestros son las fichas básicas que usan todos los documentos: la empresa, los terceros, los artículos, los bancos… Si una está mal, el error se arrastra a cada pedido, factura y asiento. Este módulo empieza por la primera de todas, la empresa: lees la ficha de una y creas la tuya.»

## Lo que no se tocó (dudas funcionales y decisiones para Sergi)

Las listas completas están al final de cada informe. Las más importantes:
- **Contabilidad**: unos bloques dicen que la factura contabiliza con las plantillas XLS y otro que lo hace con el tipo de asiento (las plantillas serían de integraciones). El examen pregunta por series y máscaras «#d» que el módulo no enseña. Las notas «{INI} Ejercicio 2…» usan «ejercicio» en el sentido antiguo de bloque (salen en capturas).
- **Compras**: número de factura del proveedor PROV-{INI}-001 frente a FRA-{INI}-001 (y -002 frente a -003); fecha del caso 12-11-2026 frente a 09-10-2026; de dónde sale el «albarán de T{INI}» que se contabiliza si el objetivo dice que es de la demo.
- **Ventas**: el recorrido de la portada usa la venta de práctica (133,10) y el resto, la del caso (242,00); una pregunta De memoria pide «Descontabilizar» con el punto clicable en «Debe»; «Resumen de apuntes» frente a «Líneas de apuntes»; preguntas 10 y 11 del examen sin bloque que las explique; varios «no se ha comprobado» visibles.
- **Cartera**: «OP Ordenado» frente a OC; el mismo IBAN de prueba para T{INI} y C{INI}; «Cartera» frente a «Cartera de efectos»; «EN CONTABILIDAD» frente a «CONTABILIZADO»; seis campos con el ejemplo vacío.
- **Tesorería**: el pago a T{INI} lleva «40000.T{INI} al debe» en un sitio y «cuenta puente de la remesa» en otros; el título «Conciliar un cobro y un anticipo» no concilia nada; rutas de Cajas que no coinciden entre partes y pasos.
- **Impuestos, Activos, Cierre**: mnemotécnicos ES-IVA-SOP/REP frente a ESG-IVA-SV; la amortización «empieza el mes siguiente» pero la 0FC000012 empieza el mismo día; «Copia el asiento de resultados a origen» sin explicar; propuesta de mover «icon-activos-v-4» detrás de «v-2».
- **Formación previa**: estados OC y AU sin explicar; confirmar que «Axional Next» de las guías es «Axional Deister VNext»; las rutas de la guía del ERP usan «→» en vez de «›».
- **General**: `FASES` de etapas.ts no se pinta (se usa `FASE_UI` de lib/ruta.ts); Logros dice que se guarda solo en el navegador aunque con Clerk se guarda en la cuenta.
- **Títulos que no siguen la norma** pero se citan en muchos bloques (cambiarlos obliga a cambiar todas las citas): «Domiciliar un cliente: mandato SEPA y remesa de cobro», «Registrar un recibo devuelto (impagado)», «Cerrar el ejercicio de tu empresa: …», «Caso final: …».
- **Preguntas De memoria** que no casan con su paso (dicen «bloque» o cosas que el alumno no hace): se dejaron por prudencia.
