# Revisión senior de la reauditoría aplicada (commit 0b18e56)

Fecha: 26-11-2026. Revisor: consultor senior de finanzas y contabilidad (PGC, IVA, cartera, tesorería, activos).
Base: `auditoria/reauditoria.md` (commit b02e1c2), el diff de `0b18e56` y el estado en HEAD (`470d7ae`). Los commits `dc172e2` y `470d7ae`, posteriores, tocaron `etapas.ts`, `compras.json`, `maestros.json`, `CODIGOS_ALUMNO.md`, `lib/progress.ts` y `lib/examen.ts`. Lo he tenido en cuenta.
Fuera de alcance, según el encargo: `ventas.json`, los bloques `compras-workflow*` y `video-workflow.ts`. Solo he leído `ventas.json` para ver si el caso final sigue cuadrando con él.
Método: diff palabra a palabra de `0b18e56`, búsquedas en todo el texto de los JSON en HEAD (script propio que recorre ejercicio, sección y campo), lectura completa de los tres exámenes tocados y de los tests de sus bloques, cálculos rehechos a mano y `tsc --noEmit` (compila sin errores). No he abierto la demo ni el navegador.

## 0. Conclusión

- El commit no dice en ningún sitio que aplicara toda la reauditoría. Su mensaje solo enumera cinco cosas: «Fundamentos desbloqueado, exámenes, errores contables, orden de bloques y empresa del caso». Esas cinco están hechas en buena parte, y lo hecho es casi todo correcto.
- Del punto 3.A de la reauditoría, que tenía 12 acciones, quedan **sin aplicar o a medias**: el 7 (N09), el 10 (N16, N18, N27, N29-N32), el 11 (N12, N25) y el 12 (H25, N14). También quedan a medias el 5 (N20), el 6 (N15) y el 9 (N10). La prueba más simple está en el `--stat`: `0b18e56` solo cambia **1 línea** de `carteras.json` y de `compras.json` y no toca `icon-activos.json`. Todos los hallazgos de esos ficheros siguen igual.
- **Error contable nuevo:** el commit corrigió la 62999 en `parametrizacion-1`, pero el caso final sigue diciendo lo contrario (G1).
- **Error que ha aparecido después:** Ventas cambió de circuito en `dc172e2`/`470d7ae` y la operación 5 del caso final ya no coincide (G2).

## 1. Tabla punto por punto

Estados: **AC** = aplicado y correcto · **AI** = aplicado pero incorrecto o incompleto · **NA** = no aplicado · **B/C** = la reauditoría lo dejaba para la demo (B) o para que decida Sergi (C), así que no se esperaba en 0b18e56 · **FA** = fuera de alcance.

| Punto | Estado | Evidencia (fichero:clave) | Corrección propuesta |
|---|---|---|---|
| **N01** Fundamentos no se puede terminar | AC (por otra vía) | `components/exercise/Guiado.tsx` L167-182: si el bloque no tiene pasos, sale el botón «Lo he leído: marcar como hecho», que llama a `terminar()` → `acciones.terminarGuiado`. `pasosDe` y `ejercicioCompletado` no se han tocado, pero el guiado ya se puede marcar. `fundamentos-1` y `fundamentos-2` tienen 0 pasos. Al volver a entrar, `fin` sale de `estado.guiado`. Compila. | Ninguna obligatoria. Falta comprobarlo en el navegador con `?libre=0`. |
| N02 Maestros usa C{INI} como tercero de la empresa | AC | `maestros.json`: nueva sección `maestros-v-4-tercero` (TS{INI}, NIF B76543214, cuya letra de control es válida); `maestros-v-4-alta-empresa` y la «Identificación social» usan TS{INI}; el aviso dice que no se use C{INI} ni T{INI}; `maestros-v-3-vinculo` y el concepto de `maestros-v-3` lo explican; `_fuente/CODIGOS_ALUMNO.md` tiene la fila TS{INI}; examen de maestros, pregunta 5. | Menor: la sección nueva no tiene capturas ni está comprobada en la demo (Categoría, «Validar»). Comprobarla. |
| N03 Doble venta en el caso | FA / superado | En `ventas.json` (posterior), AP{INI} no lleva plantilla de asiento y `ventas-pedido` da el asiento 43000/47000/70000. **Pero el caso final no se ha actualizado:** ver G2. | Ver G2. |
| N04 Signo del extracto | NA (B) | `tesoreria-4-manual` y `icon-cartera-v-9/-10` no se han tocado. | Pendiente de la demo. |
| **N05** Una sola versión de «tu empresa» | AI | Bien en: `maestros-v-3` y `maestros-v-4` (concepto), `contab-saldos-iniciales-cabecera`, `contab-mnemotecnicos-alta`, `caso-final` (sección inicial y operación 1), `tesoreria-1`, `icon-contabilidad-v-2` (empresa 0), `fundamentos-1` («En el caso compras…»). **Sigue igual** `fundamentos.json:fundamentos-navegar.concepto`: «Ejemplo: tu empresa del curso es S{INI}…». | Cambiar la frase por: «Ejemplo: tus operaciones del curso se graban en la empresa 0 «Deister Software» de la demo, que comparten otros alumnos. Tu empresa S{INI} (tus iniciales sustituyen a {INI}) la crearás en Datos maestros y solo sirve para practicar su alta, sus saldos iniciales y su cierre. Aquí miras la 0 y DIS Distribuidora S.L.» |
| N06 Bloques movidos de Contabilidad básica | AC | `etapas.ts`: `icon-contabilidad-v-1..4` pasan a Compras › Operar y `asientos-14` a Tesorería, detrás de `tesoreria-3`. `index.ts`: `MOVIDOS` y `CARPETA_ORIGEN`. Textos ajustados en `asientos-3`, `-4`, `-8`, `-9`, `-10` («cuando termines el caso», «cuando registres en Compras»), `asientos-14` («bloque anterior») y `tesoreria-3` («bloque siguiente»). | — |
| N07 Operaciones 7 y 10 sin datos propios; «remesa LRC{INI}» | NA (B) | `contabilidad-avanzada.json:caso-final-pagar-cobrar`, operación 10: «crea la remesa LRC{INI}». | Corregir ya, sin esperar a la demo: «…y crea una remesa de cobro SEPA por la línea financiera LRC{INI} con el efecto de 121,00.» (ver G3). |
| N08 Ventas: Configurar vacío | FA / superado | `etapas.ts` (posterior): Ventas tiene ahora tres etapas de Configurar. | — |
| **N09** Compras promete el albarán del alumno | AI (casi NA) | Solo cambió `compras.json:compras-generar-factura-validar` (explicación con «albarán de la demo» y 10 uds = 125,00 + 26,25 = 151,25, cifras correctas). **Siguen igual** `compras-albaran-contabilizar.objetivo` («Contabilizarás el albarán de T{INI}») y `compras-generar-factura.objetivo` («Generarás la factura de T{INI} desde su albarán»). | Ver G4. |
| **N10** Exámenes | AI | Fundamentos: banco nuevo de 10 preguntas (AC). Contabilidad avanzada: de 4 a 10 (AC) y sin «Según la documentación» (AC). **Maestros: de 4 a 8**, por debajo de las 10 propuestas (AI). **NA**: `examenes/carteras.json` (sin impagado, SEPA, descuento ni cobro parcial) y `examenes/icon-contabilidad.json` (sin saldos iniciales, mnemotécnicos ni tipo de asiento). Contabilidad avanzada no tiene ninguna pregunta del caso final. Hay preguntas repetidas con los tests de los bloques: ver §3. | Añadir 2 preguntas a maestros; 2-3 por bloque nuevo en carteras e icon-contabilidad; 1-2 del caso final en contabilidad avanzada. Textos en §3. |
| **N11** Regla del debe y el haber en `asientos-2` | AC | `icon-contabilidad.json:asientos-2.concepto`: «lo que tienes … y lo que gastas van al Debe cuando crecen; lo que debes …, lo que es de los socios … y lo que ganas … van al Haber cuando crecen». Es correcta y coincide con Fundamentos. | — |
| N12 «Para saber más» guarda lo que hace falta antes | NA | `etapas.ts`: `contab-saldos-iniciales` sigue en la etapa opcional; `contab-cierre-practica` (módulo 9, obligatorio) usa sus 5.000,00 (`contab-cierre-practica-ejercicios`: «El 5.000,00 € de saldos iniciales de «Registrar los saldos iniciales…»»). La versión corta de ejercicio y periodos no ha subido a Configurar. | Ver G5. |
| N13 Activos e Impuestos tocan datos ajenos | NA | `icon-impuestos.json:icon-impuestos-v-3` (cambia la zona del proveedor 00003); `icon-activos.json:icon-activos-v-3`: el concepto dice «no contabilices facturas que no sean tuyas» y la sección `icon-activos-v-3-validar-contabilizar` manda «Pulsa «Contabilizar»». | Ver G7. |
| N14 Cuatro cuentas financieras | NA | Ni `carteras-3-caja` ni `tesoreria-6` mencionan {INI}CAJA. | En `carteras-3-caja`, explicación: «Si ya creaste {INI}CAJA en Contabilidad básica, es la misma idea: aquí la caja del caso es CAJA_{INI}.» |
| N15 Orden de Cartera | AI | Remesas ya va en orden v-4, v-5, v-6, v-7, carteras-7 (AC). `icon-cartera-2` sigue en 4.º lugar, antes de `cartera-cobro-parcial`, no al final (NA). `carteras-nav-cartera`, punto 6, «Orden de los bloques», no lista los bloques nuevos (NA). | Mover `icon-cartera-2` al final de «Cobrar y pagar efectos» y poner al día el punto 6. |
| N16 Cartera se contradice | NA | Test de `icon-cartera-2` («Del histórico del efecto») frente a test de `icon-cartera-3` («En el detalle de la gestión»); `carteras-1-tipo-efecto`: ejemplo CAR{INI} en un campo de 3 caracteres. | Unificar y poner un ejemplo de 3 caracteres. |
| N17 Tesorería repite | NA (B) | — | — |
| N18 Texto interno visible | NA | `compras-generar-factura.concepto` («No sabemos si hay tolerancia»), `compras-generar-factura-validar`, `compras-abono-devolucion-lineas` («no lo hemos conseguido. Pide a Deister»), `icon-activos-2-bajas-ventas` («no está claro si genera un apunte contra pérdidas (671)»), `icon-impuestos-3-caso` («No está comprobado…»). | Cambiarlo por «Limitación de la demo: …», con la frase en firme. |
| **N19** Plazo del 303 y prorrata | AC | Ya no queda ningún «30-01-2027» suelto: todos dicen «hasta el lunes 1-02-2027» (fundamentos-1-iva, icon-impuestos-3, -3-caso, caso-final ×3). El 30-01-2027 es sábado, comprobado. La prorrata está bien definida como porcentaje anual por operaciones exentas (`icon-impuestos-conceptos-iva`, `icon-impuestos-2-iva`). | Matiz opcional: si se domicilia el pago, el plazo acaba el 26 de enero. |
| **N20** Códigos desactualizados | AI | `CODIGOS_ALUMNO.md`: C{INI} y TS{INI} bien; la fila T{INI} la corrigió un commit posterior (AC). `Factura.tsx`: cliente por defecto C{INI} (AC). **Siguen mal**: `maestros.json:maestros-nav-datos`, punto 9 («Ventas lo reutiliza como cliente») y punto 12 («A{INI}, F{INI} y PV{INI} … Se crean en Ventas, al empezar cada bloque de Operar»); `contabilidad-avanzada.json:caso-final-vender.explicacion[0]` («das de alta como cliente a T{INI}»); `etapas.ts`, etapa de `maestros-1`: «los usarán Ventas y Cartera». | Ver G6 y MENOR. |
| N21 Subcuenta 43000.C{INI} | NA (B) | — | — |
| **N22** Cuentas mal explicadas | AC con resto | VE→DV en `parametrizacion-icon-2` (concepto, campo, ejemplo, test y checklist), `icon-contabilidad-v-1`, `asientos-1` y en el glosario (AC). El mnemotécnico 43000 apunta a la 43000.00000 y la subcuenta se fija en la ficha (`maestros-v-2`, AC). 62999 frente a 626 en `parametrizacion-1` (AC), **pero el caso final dice lo contrario**: G1. | Ver G1. |
| N23 Rutas | NA (B) | — | — |
| N24 Abono, stock y cifras | AI | La explicación de `compras-generar-factura-validar` está bien (AC). «5 × 22,00 = 133,10» está en `ventas-2`: FA. **NA**: `compras-abono-devolucion` (concepto de 1 ud por −15,13 y práctica por 60,50) y `cartera-cobro-parcial-gestion` («el de 242,00 de tu factura de venta», que ya se cobró). | `cartera-cobro-parcial-gestion`: «Usa un efecto de cobro en estado PE de CAR{INI}. Si no te queda ninguno, factura de nuevo como en «Cobrar efectos sueltos y en remesa» y usa el efecto nuevo.» |
| N25 Configurar demasiado técnico | NA | `etapas.ts`: `icon-contabilidad-1` sigue en Configurar; `maestros-1` y `maestros-2`, sin cambios. | Pasar esas secciones a «Para saber más». |
| N26 Carga del curso | C | — | — |
| N27 Fundamentos promete una Práctica en cada bloque | NA | `fundamentos.json:fundamentos-nav-curso`, punto 2: «…haces el test y la practicas en el ERP de práctica y en la demo real». | «…haces el test y, cuando el bloque la tiene, la practicas en el ERP de práctica y en la demo real.» |
| N28 Impuestos sin parte opcional | NA | `icon-impuestos-3` sigue en una sola etapa (la sección `icon-impuestos-3-prorrata` ya se titula «Para saber más»). | — |
| N29 Títulos fuera de norma | NA | `contab-plantilla-alta`, `compras-abono-devolucion`, `cartera-descuento`, `cartera-impagado-devolucion`, `cartera-mandato-sepa` y `contab-cierre-practica` siguen con dos puntos o paréntesis. | Los de la reauditoría. |
| N30 Nombres y restos | NA | `maestros.json` titula el módulo «Mantenimiento de tablas maestras»; `maestros-nav-datos` dice «Deister Manager»; `maestros-v-1` dice «España usa el plan PGE 2008». | `maestros-v-1`: «El plan contable español es el PGC 2007; en el ERP se llama «PGE 2008» y lleva el código ES.» |
| N31 Términos sin definir | NA | Sin cambios en `compras-1`, `tesoreria-1`, `tesoreria-2`… | — |
| N32 Contradicciones menores | NA | `compras-albaran-contabilizar-accion` («asiento previsto»); `icon-contabilidad-v-3` («si te equivocaste de proveedor» como ejemplo de sustitutiva en una compra). | `icon-contabilidad-v-3`: el ejemplo de sustitutiva debe ser una factura emitida, no una compra: «por ejemplo, si emitiste la factura a un cliente equivocado». |
| N33 Orden en `criterios-sergi` | C | — | — |
| H25 Frase puente plazos y efectos | NA | No hay «ya usaste» en `carteras.json`. | En `carteras-1`: «Ya usaste estas pantallas en Contabilidad básica para P{INI} y R{INI}; aquí creas V{INI} y E{INI}.» |
| Acción 3.A-2, operación 1 → `asientos-2` | AC | `caso-final-comprar`, campo 1 y operación 1: «Bloque: Crear un asiento manual» y «Grábalo en la empresa 0». | — |
| Acción 3.A-6, `ventas-2` a opcional | FA / superado | Ventas reestructurado después. | — |

## 2. Corrección contable de lo aplicado

Rehecho a mano y comprobado:

- **Compra del caso:** 10 × 12,50 = 125,00; IVA 21 % = 26,25; total 151,25. Asiento 600 125,00 D + 472 26,25 D / 400 151,25 H. Correcto (`fundamentos-1`, `compras-generar-factura-validar`, `asientos-3`).
- **Venta:** 10 × 20,00 = 200,00; IVA 42,00; total 242,00; dos efectos de 121,00 a 30 y 60 días desde el 15-10, que vencen el 14-11 y el 14-12. Correcto. El asiento que da ahora el caso no lo es: ver G2.
- **Liquidación del 303 del 4T:** 477 (47000.00000 en la demo) 42,00 D / 472 26,25 H + 4750 15,75 H. Cuadra (42,00 = 26,25 + 15,75). Correcto en `icon-impuestos-3-caso` y `caso-final`.
- **Banco:** +3.000,00 − 151,25 − 3,50 − 10,00 + 121,00 + 121,00 = **3.077,25**. Correcto.
- **Resultado:** 200,00 − 125,00 − 3,50 − 10,00 = **61,50**. La regularización (`caso-final-cerrar`) es 700 200,00 D / 600 125,00 + 626 13,50 + 129 61,50 H. Cuadra.
- **Balance a 31-12:** 572 3.077,25 = 100 3.000,00 + 129 61,50 + 4750 15,75. Cuadra.
- **Sumas y saldos** (`asientos-10`): 3.077,25 + 125,00 + 13,50 + 26,25 = 3.242,00 = 3.000,00 + 200,00 + 42,00. Cuadra. Pero son **saldos** deudores y acreedores, no «el debe»: ver MENOR.
- **Debe y haber** (`asientos-2`, `fundamentos-1`, examen de fundamentos): bien. Aportación: 572 D / 100 H.
- **Diario de ventas DV y de compras DC:** coherente en todos los sitios.
- **Mnemotécnico 43000 → 43000.00000:** bien. La subcuenta de cliente sale de la relación contable del tercero.
- **Prorrata:** definición (art. 102-104 LIVA), ejemplos 1.000 × 21 % = 210 con un 80 % → 168/42 y regularización del 5 % al 6 % sobre 10.000 = +100. Correctos.
- **Plazo del 303:** 30-01-2027 es sábado, así que el plazo pasa al lunes 1-02-2027. Correcto.
- **Comisiones (626 / 62999):** **incoherente**: ver G1.
- **Activos (213/281/681):** `icon-activos.json` no se tocó en 0b18e56. De paso, compruebo que 681 3.000/2817 y 1.200 → 300,00/año y 25,00/mes cuadran.

## 3. Exámenes revisados pregunta a pregunta

**`examenes/fundamentos.json`** (10, nuevo). Las 10 respuestas correctas lo son y ningún distractor es también correcto. Observaciones:
- P3: concordancia. Pone «¿Dónde se anota esos 210 €…?» y debe decir «¿Dónde se anotan esos 210 € de IVA?».
- P4: da la 477. Es correcto en el PGC; la explicación podría añadir «(en la demo, la 47000.00000)», como en el resto del curso.
- P7 («¿Qué es un efecto?») está repetida con el test de `fundamentos-2`. P9 (5.000 frente a 4.879) es la misma situación que otro test de `fundamentos-2`, con las cifras al revés. El banco no debería repetir los tests (`lib/examenModulo.ts`). Cambiar la P7 por: «Una factura de 242 € se paga en dos plazos de 121 € a 30 y 60 días. ¿Cuántos efectos genera?» (correcta: «Dos, de 121 € cada uno»).

**`examenes/maestros.json`** (8; P5-P8 son nuevas).
- P4 (ya existía): «¿Qué elementos son necesarios como mínimo para crear una empresa nueva y que pueda facturar, cobrar y pagar?». Da por buena la lista identificación, plan, moneda, ejercicio y banco. Pero el propio curso dice que S{INI}, que tiene todo eso, **no puede** operar porque le faltan tipologías y plantillas. Ver G6. Además, la correcta es la opción más larga y la única sin punto final, y eso da pista.
- P7 está repetida con el test de `maestros-v-4` («¿Qué cuenta contable se asigna al banco propio?»).
- P1 a P3, P5, P6 y P8 están bien.
- Faltan 2 para llegar a 10. Propuesta: (a) «¿Qué tercero unes a tu empresa S{INI}?» → «TS{INI}, un tercero propio de la sociedad», con C{INI}, T{INI} y CAR{INI} como distractores; (b) «¿En qué empresa grabas las operaciones del caso?» → «En la empresa 0 de la demo», con S{INI}, DIS y ALA como distractores.

**`examenes/contabilidad-avanzada.json`** (10; P5-P10 son nuevas). Todas las respuestas son correctas según el contenido.
- P5 (regularización), P6 (99999998) y P7 (reapertura) están repetidas con los tests de `contab-cierre-practica` e `icon-contabilidad-2`.
- No hay ninguna pregunta del caso final. Propuesta: «Al 31-12 del caso, ¿por qué cuadra el balance?» no sirve porque ya es test. Usar en su lugar: «En el caso, ¿qué cuentas salda el asiento de regularización?» → «700 200,00 al debe; 600 125,00, 626 13,50 y 129 61,50 al haber».
- P3 (ya existía) y el contenido de `icon-contabilidad-2-cierre-definitivo-resto` dicen que la reapertura borra los asientos «de cierre temporal», mientras que P8 y `icon-contabilidad-2-regularizacion-cierre-temporal` dicen que el cierre temporal no crea asientos reales. Ver MENOR.

## 4. Fundamentos desbloqueado y empresa del caso

- `index.ts`: `fundamentos` va primero en `ORDEN`. `etapas.ts`: tiene dos etapas sin fase. `lib/ruta.ts`: todo está abierto por defecto (`modoLibre`). Con `?libre=0`, `fundamentos-2` se abre al completar `fundamentos-1` (guiado con el botón nuevo + test). No hay ningún bloqueo.
- La empresa del caso es coherente en los módulos tocados (maestros, icon-contabilidad, tesoreria, contabilidad-avanzada, fundamentos-1) salvo en `fundamentos-navegar` (N05) y en el examen de maestros, P4 (G6).

---

## GRAVE (errores contables o que confunden al alumno)

**G1 · Cuenta de las comisiones contradictoria.** `contabilidad-avanzada.json` › `caso-final-pagar-cobrar`, paso «Operación 7», `detalle`: «(626 Servicios bancarios (en la demo, la cuenta de tu flujo {INI}COM, por ejemplo la 62999.00000 que creaste en «Dar de alta una cuenta contable») 3,50…». `parametrizacion-1.concepto` dice ahora: «No es la cuenta de tus comisiones: esas van a una 626». Este error lo ha creado 0b18e56: corrigió un sitio y no el otro.
Texto nuevo del paréntesis: «…más la comisión (3,50 al debe en la cuenta de tu flujo {INI}COM, que se traduce a una 626 «Servicios bancarios y similares», y 57200.00000 al haber).»

**G2 · La operación 5 del caso sigue el circuito de Ventas antiguo.** `contabilidad-avanzada.json` › `caso-final-vender`: `ruta`, `pasos[0]` (texto y detalle: «43090 (o 70000.00000)», «la venta queda dos veces», FVOA, «Lo aprendiste en «Vender del albarán a la factura»») y `explicacion[0]` («das de alta como cliente a T{INI}»). Ventas enseña ahora la venta del caso en `ventas-pedido` (PD{INI} › AP{INI} sin asiento › FP{INI}). El alumno lee dos asientos distintos para la misma venta.
- `ruta`: ["Gestión","Ventas","Pedidos","Pedidos"].
- `pasos[0].texto`: «Operación 5 · 15-10 · Venta a C{INI}. Abre «Gestión › Ventas › Pedidos › Pedidos», crea el pedido PD{INI} de 10 unidades del 13500620 a 20,00, sírvelo con el albarán AP{INI} y factúralo con FP{INI}.»
- `pasos[0].detalle`: «El stock baja a 0 y la factura suma 200,00 + 42,00 = 242,00. El albarán AP{INI} no lleva plantilla de asiento, así que la venta se contabiliza una sola vez, con la factura: 43000.00901 (C{INI}) 242,00 al debe y, al haber, 47000.00000 42,00 (IVA repercutido en la demo; 477 en el PGC) y 70000.00000 200,00. Lo aprendiste en «Vender: pedido, albarán y factura».»
- `explicacion[0]`: «Vendes a tu cliente C{INI}, el que comprobaste en «Preparar el cliente».»

**G3 · «Remesa LRC{INI}».** `caso-final-pagar-cobrar`, paso «Operación 10», `texto`: LRC{INI} es la línea financiera, no la remesa. El alumno buscará una remesa con ese código.
Texto nuevo: «…y crea una remesa de cobro SEPA por la línea financiera LRC{INI} con el efecto de 121,00. El banco la cobra el 14-12.»

**G4 · Compras promete el albarán del alumno y no puede (N09).** `compras.json`:
- `compras-albaran-contabilizar.objetivo` → «Contabilizarás un albarán de la demo que tiene plantilla de asiento y leerás el asiento que anota la mercancía recibida antes de la factura. Tu AO{INI} no contabiliza, así que aquí no lo uses.»
- `compras-generar-factura.objetivo` → «Generarás una factura desde un albarán de la demo, la contabilizarás y comprobarás que se salda la cuenta de facturas pendientes de recibir. Tu albarán de T{INI} ya lo facturaste en «Registrar la factura».»
- Repetir la misma idea en el primer párrafo de cada `concepto`.

**G5 · El cierre obligatorio depende de un bloque opcional (N12).** `contab-cierre-practica` (módulo 9) usa los 5.000,00 de `contab-saldos-iniciales`, y este sigue en la etapa opcional de `etapas.ts` («Para saber más: parametrización completa»). Mover `contab-saldos-iniciales` a una etapa obligatoria de Contabilidad avanzada, antes de `contab-cierre-practica`, sin cambiar el id. Si no, decir en `contab-cierre-practica-ejercicios`: «Si no hiciste «Registrar los saldos iniciales de una empresa», hazlo antes: sin saldos no hay nada que regularizar».

**G6 · La «empresa mínima» se contradice.** `examenes/maestros.json`, P4, junto con `etapas.ts` › maestros › etapa «La empresa» (`que`: «lo mínimo para facturar, cobrar y pagar»), frente a `maestros-v-4.concepto` («Tus operaciones del caso se graban en la empresa 0 … porque es la que tiene tipologías y plantillas»).
- P4, enunciado nuevo: «¿Qué datos necesita como mínimo la ficha de una empresa nueva para poder contabilizar?».
- P4, correcta nueva: «Identificación (copiada de su tercero), plan contable, moneda, ejercicio contable abierto y banco propio.»
- P4, explicación: «Con eso la empresa existe y puede contabilizar. Para facturar desde Gestión necesita además tipologías y plantillas; por eso el caso se graba en la empresa 0.»
- `etapas.ts`, `que`: «…creas la tuya, con su ejercicio y su banco: la base de una empresa.»

**G7 · Bloques que tocan datos de todos (N13).**
- `icon-activos.json` › `icon-activos-v-3-validar-contabilizar`, paso «Pulsa «Contabilizar»» → «Fíjate en el botón «Contabilizar». No lo pulses: la factura no es tuya.» (Así deja de contradecir el concepto.)
- `icon-impuestos.json` › `icon-impuestos-v-3` (paso de `icon-impuestos-v-3-preparar-prueba` que cambia la zona del proveedor 00003) → que el alumno solo mire las capturas, o que lo haga con un proveedor propio.

**G8 · Tabla de códigos del alumno desactualizada (N20).** `maestros.json` › `maestros-nav-datos`. Contradice a `CODIGOS_ALUMNO.md` y a Ventas.
- Punto 9: «T{INI} — tercero proveedor. Se crea en Compras, Configurar, bloque «Dar de alta el proveedor y el artículo». Ventas no lo usa: tu cliente es C{INI}.»
- Punto 12: «PD{INI}, AP{INI} y FP{INI} — tipologías de pedido, albarán y factura de venta. Se crean en Ventas, Configurar, bloque «Configurar los documentos de venta».»

## MENOR

1. `fundamentos.json` › `fundamentos-navegar.concepto`: «tu empresa del curso es S{INI}» (N05). Texto en la tabla.
2. `etapas.ts`, etapa de `maestros-1`: «los usarán Ventas y Cartera» → «los usarán Ventas y el caso final» (Cartera usa V{INI} y E{INI}).
3. `examenes/maestros.json`: 8 preguntas, por debajo de las 10 propuestas. La P7 está repetida con un test. Faltan las dos propuestas de §3.
4. `examenes/carteras.json` y `examenes/icon-contabilidad.json` no se han tocado: no cubren los bloques nuevos (N10).
5. Preguntas de examen repetidas con los tests: fundamentos P7 y P9; contabilidad avanzada P5, P6 y P7.
6. `examenes/fundamentos.json`, P3: «se anota» → «se anotan».
7. `contabilidad-avanzada.json` › `icon-contabilidad-2-cierre-definitivo-resto` y examen de contabilidad avanzada, P3: «borra los asientos de regularización y de cierre temporal o definitivo» → «borra los asientos de regularización y de cierre definitivo, y deshace el cierre temporal» (el temporal no crea asientos reales).
8. `icon-contabilidad.json` › `asientos-10.concepto`: «el debe de tus cuentas sumará 3.242,00 … y el haber, 3.242,00» → «los saldos deudores de tus cuentas sumarán 3.242,00 … y los acreedores, 3.242,00».
9. `fundamentos.json` › `fundamentos-1-iva`: la 47000.00000 rotulada «Hacienda Pública, deudora por IVA» como IVA repercutido despista (en el PGC, la 4700 es un activo). Añadir lo que ya dice el caso final: «Es configuración de la demo: en una empresa real el repercutido va a la 477».
10. N15: `icon-cartera-2` no está al final de su etapa y el punto 6 de `carteras-nav-cartera` («Orden de los bloques») no lista los bloques nuevos.
11. N18: textos internos visibles en `compras-generar-factura`, `compras-abono-devolucion-lineas`, `icon-activos-2-bajas-ventas` e `icon-impuestos-3-caso`.
12. N24: `cartera-cobro-parcial-gestion` usa el efecto de 242,00 ya cobrado; `compras-abono-devolucion`, cifras de 1 ud frente a 60,50.
13. N14 y H25: faltan las frases puente en `carteras-3-caja`, `tesoreria-6` y `carteras-1`.
14. N16, N25, N27, N28, N29, N30, N31 y N32: no aplicados (detalle en la tabla).
15. `maestros-v-4-tercero`: sección nueva sin capturas y sin comprobar en la demo.
16. N01: falta probarlo en el navegador con `?libre=0`. El código está bien y compila.
