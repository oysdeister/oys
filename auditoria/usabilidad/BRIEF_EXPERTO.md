# Segunda pasada: resolver lo pendiente con criterio de experto (27-11-2026)

Worktree: `/Users/sergi.baulies/Downloads/practica-axional-oys/.claude/worktrees/quirky-murdock-f5d021`. Servidor de desarrollo en http://localhost:5179 (no lo pares). No uses `javascript_tool` ni el navegador integrado.

## Qué pide Sergi
La primera pasada (`auditoria/usabilidad_coherencia.md`, informes en `auditoria/usabilidad/<seccion>.md` y `junior_*.md`) dejó sin tocar unas 70 dudas funcionales y decisiones. Sergi quiere que **se resuelvan**, con criterio, actuando a la vez como tres revisores que se ponen de acuerdo:
1. **Experto funcional en Axional Deister VNext y en finanzas**: decide qué es lo correcto en el ERP y en contabilidad.
2. **Experto en comprensión y formación**: decide cómo se explica para que se entienda, en qué orden y sin repetir.
3. **Junior sin base** (ni ERP ni contabilidad): relee el resultado y confirma que lo entiende a la primera.
Además:
- **Del caso concreto a la regla general.** Si un fallo aparece en un sitio, búscalo y corrígelo en todos los sitios iguales de tu zona (`grep`). Y cuando un texto explica algo atado a un solo ejemplo («en la 0FC000012 empieza el 17-11»), di primero la regla general y luego el ejemplo como ejemplo.
- **Coherencia total**: el mismo concepto, cifra, código, nombre de pantalla, número de documento y fecha del caso se dicen igual en todo el módulo (Concepto, Guiado, De memoria, Test, Demo real, glosario, examen, portada) y casan con los módulos anteriores.
- **Ordenado por módulos y sin repeticiones**: cada cosa se explica una vez, en el módulo y bloque donde nace; después solo se remite («lo viste en …»). Lo que es de otro módulo no se reexplica aquí.

## De dónde sale la verdad (en este orden)
1. Skills de conocimiento del plugin: `plugins/formacion-oys/skills/erp-next-<modulo>/SKILL.md` y sus `references/` (comprobado en la demo), `navegar-erp-next`, `erp-next-workflow`, `mapa-formacion-oys`.
2. Caso continuo y códigos: `plugins/formacion-oys/skills/redaccion-junior/references/caso_continuo.md`, `_fuente/CODIGOS_ALUMNO.md`, `_fuente/DATOS_DUDOSOS.md`.
3. Las capturas del propio bloque (`app/public/img/...`; puedes mirarlas con Read) y lo que dice la mayoría de los sitios del contenido que sí están verificados.
4. Conocimiento contable general (PGC español) para la teoría.
Decide con la fuente más fuerte. Si las fuentes de verdad no lo resuelven, escribe el texto de forma que sea cierto en cualquier caso (genérico, sin afirmar el dato dudoso) y apúntalo como «resuelto en genérico». Solo si ni eso es posible, déjalo como duda, con el motivo.

## Qué puedes cambiar ahora (más que en la primera pasada)
- Cifras, números de documento, fechas, nombres de pantalla y textos de los botones cuando la fuente de verdad lo respalde, para unificarlos.
- **Títulos de bloque y de parte** que no sigan la norma (cortos, en infinitivo, sin dos puntos ni paréntesis), **actualizando todas las citas** de ese título en todo el repo (`grep -rn` en `app/src`).
- Preguntas De memoria (`pasos[].pregunta`) para que casen con su paso y con su punto clicable (el punto clicable manda: no lo muevas).
- Preguntas de examen y de test que evalúan algo que no se enseña: reescribe la pregunta, las opciones y la explicación para evaluar lo que sí se enseña, **manteniendo el número de opciones y la respuesta correcta en el mismo índice** (`correcta`), que debe ser de verdad la correcta.
- El orden de los bloques dentro de una etapa en `app/src/content/etapas.ts` (no los ids). Si mueves un bloque, revisa las remisiones «bloque anterior/siguiente».
- Quitar el texto de trabajo visible («no se ha comprobado», «no sabemos»): sustitúyelo por la regla general cierta o por «Solo en esta demo…».

## Lo que sigue prohibido
- `id`, `numero`, `duracionMin`, `imagen`, `hotspot`, `campos[].campo`, `ruta`, `correcta`, número u orden de elementos de las listas (partes, pasos, campos, opciones, test, checklist, problemas, aprendido). `python3 -I auditoria/scripts/comprobar_estructura.py` debe dar 0 errores estructurales (los avisos de longitud, revísalos).
- Inventar datos sin fuente.
- Tocar lo que el alumno teclea y sale en una captura si la captura lo muestra (si el texto lo contradice, cambia el texto, no la captura).
- Zonas de otros agentes. Edita solo con Edit, cadena a cadena (varios agentes tocan a la vez `maestros.json`, `icon-contabilidad.json`, `carteras.json`, `portadaDatos.ts`, `etapas.ts`, `glosario/*.json`); si Edit falla porque cambió el fichero, relee y repite. Si un arreglo necesita cambiar algo de otra zona (p. ej., una cita a un título que renombras), hazlo con Edit puntual y apúntalo.
- Commits y builds de producción.

## Qué entregas
1. Arreglos aplicados.
2. `auditoria/usabilidad/experto_<seccion>.md`: tabla «Duda o problema | Decisión del experto ERP (fuente) | Cómo queda explicado | Sitios cambiados | Visto bueno junior (sí / qué cambió)», más las repeticiones quitadas y lo que sigue sin resolver con su motivo.
3. Resumen de ≤12 líneas: resueltos, resueltos en genérico, pendientes y 3 ejemplos de antes y después.
