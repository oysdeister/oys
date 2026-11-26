---
name: auditar-contenido
description: "Cómo auditar la plataforma «Practicando Axional Deister VNext» con tres perfiles (auditor, senior contable y junior) y convertir los hallazgos en correcciones. Úsala siempre que pidan «audita el curso», «reauditoría», «revisa como senior», «revisa como junior», «comprueba que cuadran los asientos», «¿qué falta en el módulo X?», «verifica las correcciones» o antes de publicar contenido nuevo. Incluye plantillas de informe, criterios de gravedad, hallazgos recurrentes y un script de comprobaciones automáticas."
---

# Auditar el contenido de la plataforma

La plataforma enseña Axional Deister VNext a juniors sin formación financiera ni experiencia en ERP. Un error aquí no rompe un sistema: enseña algo falso a quien aún no sabe distinguirlo. Por eso se audita con **tres miradas distintas**, cada una con un informe propio en `auditoria/`, y las correcciones se aplican y se **vuelven a verificar** (el ciclo no acaba en el informe).

## Las tres miradas

| Perfil | Pregunta que responde | Lee | Informe |
|---|---|---|---|
| **Auditor** | ¿Está todo, en orden, coherente y comprobado? | JSON, `etapas.ts`, `index.ts`, exámenes, glosario, código de progreso | `reauditoria.md`, `plan_*.md`, `verificacion_*.md` |
| **Senior contable** | ¿Es correcto lo que se enseña? (asientos, cuentas, IVA, cartera, cifras) | JSON + capturas + notas verificadas de la demo | `revision_senior_<alcance>.md` |
| **Junior** | ¿Entiende un recién llegado cada paso sin pedir ayuda? | JSON en el orden de `etapas.ts`, como lo leería el alumno | `revision_junior_<alcance>.md`, `junior_<perfil>.md` |

Lee `references/perfiles.md` para el encargo concreto de cada una (qué leer, qué buscar, cómo redactar el prompt si la delegas en un subagente).

## Flujo

1. **Fija el alcance**: módulos, commit o rama, y qué queda fuera. Anótalo en la cabecera del informe (fecha, rama, commit). Sin esto, nadie sabe a qué versión se refiere un hallazgo.
2. **Comprobaciones automáticas primero** (barato y objetivo):
   `python3 -I plugins/formacion-oys/skills/auditar-contenido/scripts/comprobar_contenido.py --ids-contra <ref-git>`
   Detecta JSON roto, pasos sin «detalle», partes sin ruta, rutas con «>», frases vetadas, texto interno, cuentas que no cuadran e **ids perdidos**. Es solo lectura. Revisa cada aviso: hay falsos positivos (p. ej. un signo menos en «450 − 594,43 = 144,43»).
3. **Lanza las tres miradas** sobre el mismo estado del repo. Pueden ir en paralelo, en subagentes, con módulos repartidos. Para volúmenes grandes delega la lectura según las normas del usuario, pero **comprueba tú con `grep`** cada cita que vayas a usar: un hallazgo con un id o una frase inexistente es ruido.
4. **Contrasta con la fuente**, no con tu memoria: manuales (`_fuente/manuales/`), notas verificadas (`nueva/*`), capturas, `_fuente/CODIGOS_ALUMNO.md`, `_fuente/DATOS_DUDOSOS.md`. Lo que no esté respaldado se marca «(sin verificar)» y pasa a la lista «Necesita la demo».
5. **Registra** en `auditoria/` con la plantilla de `references/plantillas_informe.md`: tabla de hallazgos con id, ubicación, cita, gravedad, propuesta y estado.
6. **Pasa a correcciones** siguiendo `references/de_hallazgos_a_correcciones.md` (priorizar, agrupar por fichero, aplicar sin cambiar ids, verificar, reauditar).

## Gravedad (resumen; detalle en `references/gravedad_y_hallazgos.md`)

- **Crítico / GRAVE**: el alumno no puede avanzar, o aprende algo que, repetido en un cliente, descuadra la contabilidad o rompe datos (asiento al revés, doble contabilización, tocar un dato compartido de la demo).
- **Alto / IMPORTANTE**: incorrecto, incoherente con otro bloque, o el junior se atasca sin salida (dato de otra base sin puente, término clave sin explicar, orden que obliga a usar algo que se crea después).
- **Medio**: confuso o repetido; el junior avanza con dudas.
- **Bajo / MEJORA**: pulido (título fuera de norma, una frase larga, un término menor).

Regla de desempate: si dudas entre dos niveles, sube uno cuando el error sea de **contabilidad o de cifras** (el alumno lo memorizará) y baja uno cuando sea solo de estilo.

## Reglas que evitan los fallos más caros

- **Los ids no se tocan** (módulo, bloque, parte): guardan el progreso y los momentos de vídeo. Toda propuesta que implique mover un bloque dice «mismo id; cambia `etapas.ts`/`MOVIDOS`» y toda partición crea ids nuevos. Comprueba con `--ids-contra`.
- **El senior rehace las cuentas a mano**, no se fía de que «parece cuadrar»: base × tipo = cuota, debe = haber, saldo final del banco, resultado. Las cifras del caso están en la skill `redaccion-junior` (`references/caso_continuo.md`).
- **El junior simulado no sabe nada que el curso no haya dicho antes** (por el orden de `etapas.ts`, no por el de los ficheros). El glosario subraya términos, pero no sustituye a la explicación en línea.
- **Separa «error» de «limitación de la demo»**: lo que falla por la base TUTORIAL (numerador, falta una tipología) no se corrige en el texto como si fuera un error del curso; se redacta como aviso «solo en esta demo».
- **Texto interno visible** («no sabemos si…», «no está comprobado…») es un hallazgo: o se comprueba en la demo y se redacta en firme, o se reescribe como limitación.
- **Privacidad**: los informes van a un repo público. Sin credenciales, sin nombres de alumnos, empleados o clientes, sin bases de clientes reales; solo la demo `nextdemo.geasa.eu` (base tutorial). Sin copiar documentación oficial de Deister.
- **No tapes datos de la demo en capturas**: son falsos (criterio de Sergi).
- **Quien corrige no se autoverifica**: la verificación y la reauditoría las hace otra pasada (otro agente o modelo). Los informes de verificación dicen por hallazgo «Resuelto / Parcial / Pendiente / Descartado» con evidencia.

## Antes de dar por bueno

Build sin errores (`cd app && npx tsc -b && npx vite build`), prueba de humo y, si cambió contenido o pantallas, pasada con agentes-junior (skills `arrancar-y-publicar` y `diseno-y-ux`). Normas de estilo y de publicación: skill `criterios-sergi`. Cómo se redactan los bloques que corriges: skill `redaccion-junior`. Esquema JSON y alta de bloques: skill `modulo-y-bloque`.

## Referencias

- `references/perfiles.md`: encargo, método y prompt base de cada perfil.
- `references/plantillas_informe.md`: plantillas de reauditoría, revisión senior, revisión junior, verificación y corrección.
- `references/gravedad_y_hallazgos.md`: criterios con ejemplos y catálogo de hallazgos recurrentes (con el fichero de auditoría donde se vieron).
- `references/de_hallazgos_a_correcciones.md`: de la tabla de hallazgos al commit, con reparto entre agentes.
- `scripts/comprobar_contenido.py`: comprobaciones automáticas (solo lectura).
