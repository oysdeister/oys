# Brief para los jefes de revisión de sección

Contexto: lee `_fuente/BRIEF_APP.md` (app, diseño, lenguaje, reglas técnicas) y `_fuente/ESTADO.md`. La app está publicada en https://oysdeister.github.io/oys/ y corre en local en **http://127.0.0.1:5179/** (servidor Vite ya arrancado: NO arranques otro ni lo pares).

Petición de Sergi (dueño): cada sección tiene que ser **espectacular**: diseño propio y acorde a su función, animaciones (3D ligero donde aporte, framer-motion), impecable en móvil, y contenido fiel a los manuales (`_fuente/manuales/<slug>/manual.md` + capturas) y al vídeo de compras (guiones `nueva/v2/cap01.json…cap10.json` y `.md`). Revisa como formador de ERP exigente y como diseñador.

## Tu trabajo
1. **Revisa** tu sección en el navegador integrado:
   - Usa SIEMPRE tu propia pestaña. Crea una con `tabs_create` y pasa su `tabId` en cada llamada, porque otros jefes usan el mismo panel a la vez. No cierres pestañas ajenas.
   - Para ver la vista de móvil, emula `resize_window` con `tabId`.
   - Prueba en escritorio (≥1280) y móvil (375×812), y en tema claro y oscuro.
   - En la primera visita sale un formulario de nombre e iniciales: rellénalo, por ejemplo «Prueba Revisión» con «PR».
   - Mira capturas y prueba las interacciones de verdad: clics, arrastres, teclado. Lee la consola por si hay errores.
2. **Haz una lista** de defectos y mejoras, en este orden de prioridad:
   1. contenido incorrecto (cifras, rótulos, cuentas, pasos) contrastado con el manual, la captura o el guion;
   2. algo roto o inusable (sobre todo en móvil);
   3. diseño pobre o genérico, poca jerarquía o falta de efecto «guau»;
   4. pulido.
3. **Corrige.**
   - Si tu entorno te permite lanzar subagentes (herramienta Agent), reparte las correcciones entre 1 y 3. Dale a cada uno ficheros disjuntos y un brief completo.
   - Después revísales el contenido, la usabilidad y el diseño en el navegador, y pídeles otra pasada si no llega al nivel.
   - Si no puedes lanzar subagentes, corrige tú.
4. **Comprueba** con `cd app && npx tsc -b && npx vite build`, sin errores.
5. **Responde** con un resumen breve:
   - qué revisaste;
   - qué cambiaste;
   - qué datos dudosos quedan, con su fuente;
   - y las limitaciones.

## Reglas de ficheros (hay 4 jefes en paralelo)
- Toca solo los ficheros de tu sección (abajo).
- `src/styles.css`, `src/App.tsx`, `src/lib/*` (salvo `lib/examen.ts` para el jefe de examen) y los JSON de `src/content/` son compartidos: no los edites.
  - Si necesitas un cambio ahí, descríbelo exacto en tu respuesta (fichero, qué y por qué).
  - Excepción: el jefe de Ejercicios puede corregir datos de contenido en `src/content/*.json` (cifras, rótulos, hotspots mal colocados), porque los JSON solo los toca él.
- No hagas commits ni push.
- No añadas dependencias sin una razón fuerte; si lo haces, dilo.
