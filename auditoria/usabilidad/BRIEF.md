# Lectura en contexto y en orden — brief común (noviembre de 2026)

Repo (worktree): `/Users/sergi.baulies/Downloads/practica-axional-oys/.claude/worktrees/quirky-murdock-f5d021` · app en `app/` · servidor de desarrollo ya arrancado en http://localhost:5179 (no lo pares ni arranques otro).
Antes de nada lee: `plugins/formacion-oys/skills/criterios-sergi/SKILL.md`, `plugins/formacion-oys/skills/redaccion-junior/SKILL.md` (y su `references/errores_recurrentes.md`), `plugins/formacion-oys/skills/modulo-y-bloque/SKILL.md`, `app/src/types.ts`.

## Qué pasa y qué te toca
Ya hubo una pasada de redacción frase a frase. La información es correcta, pero Sergi ve frases sin sentido, fuera de orden, que remiten a algo que aún no se ha visto o que no conectan con su título. Su ejemplo: al entrar en Datos maestros, lo primero que sale es «La empresa: la ficha que usan todos los documentos. Si está mal…», una frase sin verbo que no dice qué es el módulo de «Datos maestros».
Tu trabajo es **la lectura en contexto y en orden**: cómo se encadena lo que ve el alumno en pantalla, de arriba abajo, página a página.

## Cómo leer
- Tienes un volcado del texto visible en orden de pantalla: `/private/tmp/claude-502/-Users-sergi-baulies-Downloads-practica-axional-oys--claude-worktrees-quirky-murdock-f5d021/aac8622d-c90b-42b5-ac8c-710f0db4d366/scratchpad/volcado/NN-<modulo>.md`. Cada línea lleva entre corchetes el campo del JSON de donde sale y cada bloque dice su fichero e índice (`ejercicios[i]`). Lo regeneras tras tus cambios con `node auditoria/scripts/volcar_lectura.mjs <tu_carpeta>` (no machaques la carpeta común).
- Orden real en pantalla: página del módulo = frase (portadaDatos.ts) → «Para situarte» (aprendes + recorrido) → «Lo básico del ERP para este módulo» (navegación del JSON) → fases y etapas (etapas.ts) con los bloques (título + objetivo) → examen. Bloque = título + objetivo → Concepto (párrafos de `concepto`; los que empiezan por «Ejemplo:», «Fíjate:», «Ojo:» salen como recuadro; «Dónde:») → partes (título de sección, vídeo, `paraQueSirve`, ruta, `explicacion`, capturas con campos, `avisos`) → Guiado (pasos: texto + detalle) → De memoria (pasos con `pregunta`) → Test → Demo real (checklist, problemas, aprendido).
- Si quieres verlo pintado: `http://localhost:5179/#/ejercicio/<id>` o `#/modulo/<id>` con puppeteer u obscura. **No uses `javascript_tool` ni el navegador integrado** (lo comparten otros agentes).

## Criterio común (lo que corriges)
1. **La primera frase de cada página dice qué es y para qué sirve** (página de módulo, etapa, bloque, parte). Con verbo, completa, y conectada con el título que tiene encima.
2. **Cada párrafo conecta con el anterior.** Sin saltos de tema; si cambia de tema, una frase puente.
3. **Nada se usa antes de explicarlo.** Ni términos, ni códigos del alumno, ni bloques o pantallas que vienen después («como hiciste en…» solo si ya se hizo, según el orden de etapas.ts y de los módulos: fundamentos → maestros → contabilidad básica → compras → ventas → cartera → tesorería → impuestos → activos → cierre).
4. **Títulos y textos coinciden**: lo que dice la parte es lo que anuncia su título; el objetivo del bloque es lo que el bloque hace.
5. **Sin frases huérfanas ni repetidas**: frases que no dicen nada en su sitio, restos de otro contexto («en esta sesión», «como se ve arriba» cuando no está arriba, «la tabla está justo debajo» cuando no lo está), listas duplicadas (misma idea en `explicacion` y en los pasos de la misma parte), repetición de la misma explicación en partes seguidas.
6. Orden lógico: de lo general a lo concreto; para qué → dónde → cómo → qué verás. Avisos donde se necesitan, no antes.
Además, de paso: español de España, tuteo, comillas latinas para rótulos, «bloque» y no «ejercicio», frases cortas.

## Lo que NO tocas
- Ningún `id`, `numero`, `duracionMin`, `imagen`, `hotspot` (coordenadas ni `etiqueta`), `campos[].campo`, `ruta`, `correcta`, número u orden de partes, pasos, campos, opciones, test, checklist, problemas y aprendido (el script `auditoria/scripts/comprobar_estructura.py` lo comprueba: debe dar 0 errores estructurales).
- Rótulos literales del ERP entre «», cifras, cuentas, importes, códigos, `{INI}`, datos de la demo. **Si dudas de un dato funcional, no lo toques y apúntalo** como duda.
- El sentido técnico. Reordenar frases dentro de un mismo campo de texto o entre `explicacion[i]` de la misma parte sí se puede (no cambia el número de elementos). Puedes vaciar el contenido duplicado de un elemento reescribiéndolo para que diga algo útil y distinto, pero no borrar elementos de listas.
- Ficheros o bloques de otras secciones (mira «Tu zona» en tu encargo). Varios agentes editan a la vez el mismo JSON (`maestros.json`, `icon-contabilidad.json`, `carteras.json`) y `portadaDatos.ts`/`etapas.ts`: **edita solo con la herramienta Edit, cadena a cadena** (nunca reescribas un fichero entero con un script). Si Edit falla porque el fichero cambió, vuelve a leer el trozo y repite.
- No hagas commits ni builds de producción (sí puedes validar JSON con `python3 -c "import json;json.load(open(F))"`).

## Qué entregas
1. Correcciones aplicadas en tu zona.
2. `auditoria/usabilidad/<seccion>.md` con: una tabla por página (módulo › bloque › parte) con columnas «Dónde | Qué falla | Por qué | Antes → después (resumido) | Estado (corregido / duda)», y al final el recuento (encontrados, corregidos, dudas funcionales no tocadas) y 3 ejemplos de antes y después que muestren bien el tipo de arreglo.
3. Antes de terminar: valida tus JSON y pasa `python3 -I auditoria/scripts/comprobar_estructura.py` (si da errores que no son tuyos, ignóralos y dilo).
4. Devuelve un resumen de ≤12 líneas: recuento, 3 ejemplos antes→después y las dudas funcionales.
