# De los hallazgos a las correcciones

Índice: 1 Ciclo · 2 Priorizar · 3 Agrupar y repartir · 4 Reglas al corregir · 5 Verificar y reauditar · 6 Cuándo no corregir · 7 Registro y cierre.

Ejemplos: `auditoria/plan_mejoras.md` (decisión por hallazgo), `plan_fase2.md` (cambio de alcance), `correccion_1…6.md`, `verificacion_A…C.md`, `reauditoria.md` §3.

## 1. Ciclo

```
auditar (3 miradas) → informes en auditoria/ → plan (decidir) → corregir por grupos de ficheros
→ verificar (otra pasada) → reauditar → publicar (build, humo, juniors)
```

Se repite hasta que la reauditoría deja solo lo que necesita demo o decisión de Sergi. Una pasada de correcciones **siempre** acaba con una revisión senior del diff (los commits de corrección introducen errores nuevos: un fix de la 62999 que el caso final contradice, un circuito reescrito que el caso final no sigue).

## 2. Priorizar

Reparte los hallazgos en tres cubos (como la sección 3 de `reauditoria.md`):

- **A · Hacer ya**: se arregla sin cambiar ids, orden ni alcance. Errores de texto contable, códigos desactualizados, frases puente, texto interno, títulos, términos, bloques movidos de etapa con el mismo id.
- **B · Necesita la demo o grabación**: cifras o rutas sin comprobar, signo del extracto, «Aplica a tu caso» de remesas, recapturas, vídeos nuevos. Se redacta una lista de comprobaciones concretas (qué probar, en qué registro propio) y se hace en la demo con registros `CAP` o `{INI}`; el login lo hace siempre el usuario.
- **C · Decisión de Sergi**: carga del curso, partir bloques con ids nuevos, orden de módulos, acceso a TUTORIAL, tema y prefijo de recapturas, recorte de vídeo, módulos nuevos. El auditor propone; no aplica.

Dentro de A, orden: crítico → alto → medio → bajo; contabilidad y cifras antes que estilo. Estima esfuerzo por fila (horas) para que Sergi vea el coste.

## 3. Agrupar y repartir

- Agrupa por **fichero de contenido** (`compras.json`, `ventas.json`, `carteras.json`+`tesoreria.json`, `icon-contabilidad.json`+`contabilidad-avanzada.json`, `fundamentos.json`+`maestros.json`, `icon-impuestos.json`+`icon-activos.json`, interfaz). Dos agentes no tocan el mismo fichero.
- Los ficheros compartidos (`etapas.ts`, `index.ts`, `CODIGOS_ALUMNO.md`, `styles.css`) los toca una sola persona al final, o el que lidera; los demás **describen el cambio exacto** (fichero, qué y por qué).
- Dale a cada corrector: la lista de hallazgos de su grupo con cita y texto propuesto, las reglas de la sección 4, y la skill `redaccion-junior`. Pide un fichero `auditoria/correccion_<n>.md` (plantilla E) con lo aplicado y lo no aplicado.
- Un cambio de significado contable lo decide el senior, no el redactor: si el corrector duda, lo deja «no aplicado» con el motivo.

## 4. Reglas al corregir

- **No cambies ids** (módulo, bloque, parte). Tampoco `campos.campo`, `imagen`, `hotspot`, `pregunta`, `correcta`, `numero`, `duracionMin`, el token `{INI}`, el número ni el orden de partes, pasos, checklist y preguntas del test (guardan progreso y capturas). Detalle en `_fuente/GUIA_REDACCION.md` («Lo que no se toca»).
- Mover un bloque de módulo o etapa: mismo id, edita `etapas.ts` y registra el origen en `MOVIDOS`/`CARPETA_ORIGEN`; si desaparece un id de módulo, `ALIAS_MODULO`. Partir un bloque largo: ids **nuevos** y el antiguo se mantiene.
- Cada corrección cierra el error **en todos los sitios** (`grep` del término en JSON, exámenes, glosario, `datosSimulador`, `CODIGOS_ALUMNO.md`, skills del plugin).
- Cifras, cuentas y rótulos literales solo se cambian con fuente (manual, nota, captura). Lo no comprobado se marca «(sin verificar)» o «ruta no comprobada».
- Una limitación de la demo se redacta como «solo en esta demo» con lo que pasaría en un cliente real.
- Sin credenciales, nombres de personas ni clientes reales; sin pegar documentación oficial.
- Valida tras cada fichero: `python3 -c "import json;json.load(open('app/src/content/<f>.json'))"`, y al final `cd app && npx tsc -b && npx vite build`.

## 5. Verificar y reauditar

1. **Script**: `comprobar_contenido.py --ids-contra <commit-previo>` (ids perdidos 0, sin cuentas que no cuadren, sin frases vetadas).
2. **Verificación** (otra pasada, solo lectura): por hallazgo, Resuelto / Parcial / Pendiente / Descartado con evidencia (plantilla D). Un «Resuelto» sin evidencia vale como «Pendiente».
3. **Revisión senior del diff** palabra a palabra, y búsqueda global del término corregido.
4. **Prueba en la demo** de lo que dependía de ella, con registros propios; anota qué registro, acción y resultado.
5. **Reauditoría**: nueva tabla de estado con recuento; los hallazgos nuevos que aparezcan se numeran aparte.
6. **Humo y juniors**: build, portada, módulo, bloque con Guiado, examen, glosario, vídeo y ERP de práctica en escritorio y móvil, consola limpia; y agentes-junior sobre los bloques tocados (skills `arrancar-y-publicar`, `diseno-y-ux`).

## 6. Cuándo no corregir

- La causa es la base de la demo (falta una tipología, el numerador falla): se documenta como limitación y se pide a Deister; no se «arregla» el texto para ocultarla.
- El hallazgo exige regrabar vídeo, recapturar o cambiar el alcance: va a B o C.
- Dos informes se contradicen: decide el contraste con la fuente (manual, captura, demo), no el número de informes que lo dicen.
- Falta de acceso o de material (login, secretos, grabaciones): se le pide a Sergi; nadie teclea contraseñas por él.

## 7. Registro y cierre

- Todo queda en `auditoria/`: informes, plan, correcciones, verificaciones. Enlázalos entre sí por nombre de fichero y por id de hallazgo.
- El mensaje de commit (en español) dice qué cambia **para el alumno** y cita los hallazgos cerrados; los commits los hace quien lo pida el usuario (squash a `main`, push, comprobar Pages en verde, según `criterios-sergi`).
- Al cerrar, actualiza `_fuente/ESTADO.md` con lo hecho y lo pendiente, y deja en la reauditoría el recuento final.
