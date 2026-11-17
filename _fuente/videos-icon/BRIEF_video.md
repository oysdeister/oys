# Brief: agente experto de UN vídeo de formación (plataforma «Practicando Axional Deister VNext», O&S Consultores)

Variables: S = /private/tmp/claude-502/-Users-sergi-baulies-Downloads-practica-axional-oys--claude-worktrees-videos-icon-748154/bdc464cd-4a77-4602-bba7-98e3dab0a329/scratchpad
W = /Users/sergi.baulies/Downloads/practica-axional-oys/.claude/worktrees/videos-icon-748154 (repo, app en W/app)
Vídeo original: «/Users/sergi.baulies/Downloads/VNEXT Doumentacion/Icon/<fichero>» (solo lectura).

Material ya preparado:
- Transcripción whisper: S/audio/<id>.srt (puede estar aún generándose: si no existe o S/audio/<id>.log no contiene «total time», espera con un bucle `until grep -q "total time" S/audio/<id>.log; do sleep 30; done` en Bash con timeout 600000, repitiendo si hace falta).
- Fotogramas: S/frames/<id>/f_NNNN.jpg, uno cada 15 s (f_0001 ≈ t=0 s, f_NNNN ≈ (N-1)·15 s), 1280 px.
- Prompt de análisis: S/prompt_analisis.md

## Pasos
1. Análisis del audio con DeepSeek (MCP orquestador, herramienta `delegar`, task "write", files=[S/prompt_analisis.md, S/audio/<id>.srt], max_tokens 16000). Hazlo en DOS llamadas para que no se corte: (a) solo secciones 1, 2 y 3 → out S/analisis/<id>_a.md; (b) solo secciones 4, 5 y 6 → out S/analisis/<id>_b.md. Si una sale cortada, divídela más. No leas el SRT entero tú: usa `grep`/`sed -n` sobre el SRT solo para comprobar tiempos dudosos.
2. «Lee» el vídeo: mira con Read los fotogramas de cada transacción (unos 15-30 en total, elegidos con los segundos del análisis) para confirmar qué pantalla, menú, campos y botones aparecen de verdad. Corrige el análisis donde el audio engañe (nombres de objetos, rutas de menú visibles en la barra/breadcrumb, nombres de campos).
3. Capítulos: escribe S/analisis/<id>.capitulos.json = array de
   `{"n":1,"titulo":"…","inicio":<s>,"duracion":<s>,"escenas":[{"t":<s relativo al inicio del capítulo>,"titulo":"…"}]}`
   4-9 capítulos que cubran toda la parte útil (se pueden saltar tramos muertos), cortes en cambios de tema reales. Títulos en español de España, ≤45 caracteres, claros para un junior.
4. Capturas: para cada paso que lo merezca extrae el fotograma a resolución completa:
   `ffmpeg -v error -ss <seg> -i "<vídeo>" -frames:v 1 -vf scale=1600:-2 -q:v 3 W/app/public/img/<modulo>/<id>-NNN.jpg`
   (NNN correlativo 001…). Mira cada captura con Read: si sale borrosa, en transición o con datos personales visibles (correos, caras de webcam en primer plano), prueba otro segundo o descártala. Entre 12 y 30 capturas por vídeo.
5. Ejercicios: escribe S/analisis/<id>.ejercicios.json = array de objetos con el esquema `Ejercicio` de W/app/src/types.ts (mira de ejemplo `jq '.ejercicios[1]' W/app/src/content/asientos.json`). Reglas:
   - 3-6 ejercicios guiados por vídeo, cada uno una transacción o bloque práctico que el junior pueda repetir en la demo (nextdemo, base tutorial). id = "<modulo>-<id>-<k>", numero = k (se renumera luego), secciones con id "<id ejercicio>-<slug>".
   - `objetivo`, `concepto` (2-3 párrafos), `duracionMin`, `secciones` (paraQueSirve, ruta como array de menú o null, explicacion, campos {campo, significado, ejemplo}, pasos {texto, detalle?, imagen?: "<id>-NNN.jpg", hotspot?: {x,y,w,h en % de la imagen, etiqueta}}, avisos {tipo: problema|solucion|nota}), `test` 4-6 preguntas (opciones 4, correcta índice 0-3 variado, explicacion), `checklist` 5-8 comprobaciones que el junior marca en la demo, `problemas` [{problema, solucion}] con los problemas típicos que salen en el vídeo.
   - Usa {INI} (iniciales del alumno) en códigos de ejemplo que el junior crea (como en los módulos existentes).
   - Español de España, tuteo, frases cortas. NO compares con la versión antigua del ERP. No inventes campos ni rutas: lo que no se vea ni se diga, no lo pongas. Si el formador comete un error y lo corrige, conviértelo en «problema típico».
   - Hotspots solo si en la captura se ve claramente el botón/campo; mide sus coordenadas en % sobre la imagen.
6. Momentos del vídeo: escribe S/analisis/<id>.momentos.json = `{"<id sección>": [{"capitulo":n,"t":<s absoluto>,"tCap":<s relativo al capítulo>,"titulo":"…"}], …}` — el punto exacto del vídeo donde se explica cada sección (1-2 por sección).
7. Resumen final (tu respuesta, ≤250 palabras): qué enseña el vídeo, capítulos, ejercicios creados, nº de capturas, dudas o tramos dudosos, y coste DeepSeek gastado (pie de cada llamada).

No toques ningún otro fichero del repo (ni index.ts, ni otros JSON); no hagas commits.
