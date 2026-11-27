# Los tres perfiles de auditoría

Índice: 1 Auditor · 2 Senior contable · 3 Junior (y sus tres variantes) · 4 Prompt base para un subagente · 5 Alcance y reparto.

Fuentes del método: `auditoria/reauditoria.md`, `revision_senior_*.md`, `revision_junior_*.md`, `junior_sin_erp.md`, `junior_sin_contabilidad.md`, `junior_otro_sector.md`, `diagnostico_junior.md`, `_fuente/BRIEF_REVISION.md`.

## 1. Auditor (cobertura, coherencia, datos verificados, capturas, orden)

**Objetivo**: decir el estado real del curso frente a una lista de hallazgos y descubrir los nuevos. Responde «¿está hecho?» con evidencia, no con el mensaje del commit.

**Lee**: los JSON de `app/src/content/` (volcados a texto con un script que recorra ejercicio, sección y campo), `etapas.ts`, `index.ts` (ORDEN, META, MOVIDOS, ALIAS), `examenes/`, `glosario/`, `lib/ruta.ts`, `lib/progress.ts`, `components/exercise/Guiado.tsx` si el hallazgo es de progreso.

**Mira**:
- **Cobertura**: qué temas del plan (`plan_fase2.md`, informe de auditoría) tienen bloque y cuáles no; examen con preguntas de los bloques nuevos; glosario con los términos que salen.
- **Coherencia entre bloques**: un dato, una versión. Códigos del alumno (`_fuente/CODIGOS_ALUMNO.md`), «tu empresa», cliente, banco, cantidades del caso, nombres de rutas de menú, signo del extracto.
- **Orden**: ningún bloque usa algo que se crea después (comprueba `etapas.ts` contra las citas «creaste en…»). Configurar antes de Operar. Numeración que ve el alumno = posición en `etapas.ts`, no el `numero` del JSON.
- **Datos verificados**: cada cifra, cuenta o ruta tiene fuente (manual, nota de la demo, captura). Lo dudoso está en `_fuente/DATOS_DUDOSOS.md` o marcado «(sin verificar)».
- **Capturas y vídeos**: existen los ficheros, los hotspots caen en 0-100, la captura es de la misma parte del paso, no muestra datos de otro alumno ni otra base (ver «datos de otra base» en `gravedad_y_hallazgos.md`), las claves de `MOMENTOS_*` apuntan a ids que existen.
- **Carga**: horas obligatorias por módulo frente al objetivo; bloques de más de ~60 min o ~35 pasos.
- **Ids**: ninguno perdido entre dos commits (script `--ids-contra`).

**Método de estado** (por hallazgo previo): Resuelto / Parcial / Pendiente / Descartado, con evidencia (`fichero:clave` o cita) y «qué falta».

**Entrega**: plantilla A de `plantillas_informe.md`.

## 2. Senior contable (exactitud)

**Perfil**: consultor senior de finanzas y contabilidad (PGC, IVA, cartera, tesorería, activos) que conoce Axional.

**Objetivo**: que lo enseñado sea correcto y reproducible en una empresa real, y que las cifras del caso cuadren de principio a fin.

**Qué comprueba, por este orden**:
1. **Asientos**: debe = haber; el lado correcto según el tipo de cuenta (lo que tienes y lo que gastas, al debe; lo que debes, lo que es de los socios y lo que ganas, al haber). Busca **asientos al revés** (impagado con la 4315 al haber, cobro de remesa con el banco al haber, capital al debe) y **doble contabilización** (albarán y factura que abonan la misma venta).
2. **Cuentas**: código y nombre correctos en el PGC (472 IVA soportado, 477 IVA repercutido, 4750 Hacienda acreedora por IVA, 400/430, 572, 600/700, 626 servicios bancarios, 129 resultado, 100 capital). Cuando la demo difiere por configuración (IVA repercutido a la 47000.00000), el texto lo dice y avisa «no lo copies».
3. **Importes**: rehaz a mano cada operación (base × tipo = cuota; total; reparto en efectos; saldo del banco; resultado; balance). Recorre además con script todas las expresiones «a ± b = c» del JSON.
4. **IVA y fiscal**: tipos, soportado/repercutido, liquidación, plazos (un plazo que cae en sábado pasa al lunes hábil), prorrata (solo la regla anual; un % deducible por factura no se llama prorrata), inversión del sujeto pasivo, IRPF.
5. **Cartera y tesorería**: estados del efecto, qué asiento genera cada acción (cobro, remesa, impagado, descuento), signo del extracto y del movimiento, cuenta puente de cada flujo, cuándo se contabiliza y cuándo se concilia.
6. **Activos y cierre**: amortización (cuota anual y mensual, valor neto), baja con beneficio o pérdida, regularización, cierre y apertura.
7. **Contraste con la demo o la captura**: un dato que solo está en el texto es «sin verificar». Si el senior prueba en la demo, solo toca registros propios (prefijo `CAP` o `{INI}`) y lo anota (qué registro, qué hizo, qué vio).
8. **Seguridad de datos**: ningún bloque manda cambiar un dato compartido de la demo (zona de un proveedor común, regularizar el ejercicio de la empresa 0, contabilizar facturas ajenas).

**Entrega**: plantilla B. Cada hallazgo con: dónde (`id`), qué dice, qué es correcto, fuente, corrección propuesta con el texto exacto cuando sea corto. Cierra con tabla «punto por punto» de la reauditoría (AC aplicado y correcto · AI aplicado pero incorrecto o incompleto · NA no aplicado · B/C pendiente de demo o de decisión · FA fuera de alcance) y un veredicto («se puede publicar / no» con los bloqueantes).

## 3. Junior (sin ERP, sin contabilidad, de otro sector)

**Perfil**: recién contratado que no ha usado un ERP ni sabe contabilidad. Lee el curso **en el orden real de `etapas.ts`**, solo con lo que el curso ha dicho antes (más el glosario emergente, que ayuda pero no sustituye).

Tres variantes; úsalas por separado porque encuentran cosas distintas:

| Variante | Qué le pasa | Qué encuentra |
|---|---|---|
| **Sin ERP** (informático o consultor) | Entiende de tecnología, no de este programa | Rutas ambiguas (código técnico pegado a la ruta, «⌄ junto a la estrella»), dos caminos a la misma pantalla, campos con valor sin explicar («Holding», «Proyecto 0»), «bloque» usado con dos sentidos |
| **Sin contabilidad** (técnico) | Sabe de ERP, no de debe y haber | Términos sin definir, el lado del asiento sin regla, cifras sin origen, cuentas que el caso nunca usa |
| **Otro sector** (hostelería, atención al cliente) | Cuesta leer textos largos, necesita motivación | Muros de números, párrafos largos, conceptos avanzados el primer día, falta de «por qué me importa», contador de horas que asusta |

**Qué anota en cada atasco**: ubicación (id de bloque y, si ayuda, de parte) › cita literal › por qué atasca › qué necesitaría. Tipos de atasco que usa `revision_junior_resto_jm.md`: 1 término sin explicar · 2 paso que da algo por sabido · 3 pantalla o botón no presentado · 4 dato de origen desconocido · 5 salto de orden · 6 referencia rota · 7 contradicción · 8 test que pregunta lo que no se enseña.

**Clasificación**: **BLOQUEA** (se queda parado o hace algo mal sin saberlo) · **MOLESTO** (sigue con dudas o pierde tiempo) · **Pulido**.

**Lo que funciona también se anota** («para no romperlo»): analogías cotidianas del `concepto`, tarjetas «Compruébalo», cifras del caso con hilo, búsqueda ⌘K.

**Comprobaciones mecánicas que hace el junior** (por JSON): pasos sin `detalle`; partes con pasos y sin `ruta`; bloques sin `problemas`; frases de más de 24 palabras; rutas con «>»; término de la lista común sin explicar la primera vez en el módulo; cifras que chocan con el caso; datos ajenos (LIZ, ALA, 001, 00003, 00027, 00087, PRVCC0, dólares) sin puente.

**Cómo probar la plataforma en el navegador** (si se hace): pestaña propia, formulario de nombre e iniciales («Prueba Revisión» / «PR»), escritorio ≥1280 y móvil 375×812, tema claro y oscuro, consola limpia, `?libre=1` para ver todo sin desbloquear. En este entorno no se usa `javascript_tool` del navegador integrado; para automatizar, puppeteer u obscura.

**Entrega**: plantilla C.

## 4. Prompt base para un subagente

Un subagente solo conoce lo que le pones. Incluye siempre:

1. **Rol y perfil** (una de las tres miradas; para el junior, la variante).
2. **Alcance**: módulos o ids, rama y commit, y qué queda fuera.
3. **Qué leer y cómo**: `app/src/content/<módulo>.json` con un script que vuelque ejercicio › parte › campo (no cargar los JSON enteros), `etapas.ts` para el orden, y las fuentes que contrastar.
4. **Qué NO hacer**: no editar contenido (solo lectura) ni lanzar commits; no usar datos de clientes reales; no escribir credenciales ni nombres de personas.
5. **Formato de salida**: la plantilla que corresponda y la ruta del fichero (`auditoria/<informe>.md`).
6. **Criterio de gravedad** (copia los cuatro niveles) y la obligación de **citar** (id de bloque o parte y frase literal) y de **marcar «(sin verificar)»** lo que no pueda contrastar.
7. **Lo que ya está arreglado** (informes previos) para no repetirlo.

Al recibir el informe: `grep` de una muestra de citas, desechar las que no existan, y fijar tú la gravedad de los críticos. Quien audita no decide alcance; las decisiones van a Sergi.

## 5. Alcance y reparto

- Revisión completa: un junior por variante sobre todo el curso, un senior por grupo de módulos (Fundamentos, Maestros y Contabilidad; Compras y Ventas; Cartera, Tesorería; Impuestos, Activos y Cierre) y un auditor que recoja todo.
- Revisión de un cambio: el senior lee el `git diff` del commit palabra a palabra y las búsquedas globales del término cambiado (el mismo error suele repetirse en otro bloque: el caso final sigue diciendo lo que el bloque ya corrigió).
- Tras una corrección, revisión **cruzada**: quien revisa no es quien corrigió.
