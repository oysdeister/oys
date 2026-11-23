# Lecciones del proyecto «Tutorial compras ERP»

- Herramientas: `whisper-cpp` + `models/ggml-large-v3-turbo.bin`, `yt-dlp`, `ffmpeg`, `tesseract` (OCR puntual), edge-tts en un `.venv`. Fish Audio no sirvió (402); edge-tts con Ximena sí.
- Dos Loom de 14 min y 1 h 46 min (1680×1048, 30 fps) dieron 9 capítulos + apertura, 125 escenas, 67 clips, 34 min.
- Tramos de ~20 min por agente; si un tramo es denso, fotogramas cada 20 s en subcarpeta propia (anota la fórmula del segundo).
- El guionista debe dejar fotogramas anotados por clip (inicio, mitad y final con recorte y callouts dibujados: `scripts/guion/grid.py`) para revisar a ojo.
- Correcciones típicas al revisar: workflow con más pasos de los que contaba el informe, mensajes de error que sí se veían, el documento nace bloqueado al guardar (no al validar), rótulos mal oídos («Escalando» → «Escandallo», «arroba e» → «#e»).
- Escenas de 10-40 s; parte las ideas largas antes que acelerar la voz.
- Escenas más cortas que su clip: acelera el clip (regla de velocidad en video-motor-remotion) o recorta el tramo.
- Render completo de 34 min ≈ 75 min por capítulos con GPU angle; renderiza por capítulos y concatena.
- Ejemplo de ESTADO.md para retomar tras una compactación: `../video-dos-sesiones/references/`.

## Lecciones de la v2 (VNext para principiantes, 16-11-2026)
- **Lo que pidió el usuario tras la v1**: público principiante absoluto; nada de «antes/ahora» ni versiones; overview del módulo y del menú; todo término técnico explicado en llano; mucho más lento; navegación en vivo (no capturas fijas); pantalla grande y plana; columna lateral pequeña. Lista de comprobación: `criterios_v2.md`.
- **Organización que funcionó**: criterios.md → especialistas Sonnet por capítulo (guion + `acciones` probadas en su propia pestaña, con revisor Sonnet) en paralelo → agente de diseño Opus (plantilla + generador de sincronía) en paralelo → grabación EN SERIE por un agente grabador por capítulo (pestaña principal) → verificador Opus por bloques de capítulos que corrige el texto directamente → render por capítulos en cola. Encargo tipo de especialista: `brief_especialistas_v2.md`.
- **Grabación en vivo**: `video-motor-remotion/scripts/v2/rec.mjs` (puppeteer `page.screencast`, viewport 1600×900 a 2× → 3200×1800, cursor SVG inyectado + onda en cada clic, tecleo a 140 ms/tecla, log JSON de eventos con `clave` y rect). Las escenas `pantalla` llevan `acciones` declarativas en el capNN.json; `"prep": true` = antes de grabar. El webm sale a 30 fps reales aunque declare 25.
- **Sincronía**: `gen_v2.py --clips` re-temporiza cada clip para que cada evento con `clave` caiga 0,3 s antes de su palabra (cursor/espera hasta 3×, tecleo hasta 2×); si no llega, **la voz espera** (huecos de silencio en el límite de frase más cercano). Los scroll se anclan a «baja/más abajo». Congelados finales >4 s: ralentiza hasta 0,6× y zoom lento.
- **La `clave` vive en el log de grabación** (rec/<id>.json): si se cambia en el json después de grabar, hay que cambiarla también en el log. Claves con dígitos («3 puntas») o con guion («NIF-Empresa») no casan con la voz; claves cortas («COM») casan por prefijo con otra palabra («compra»): usa frases.
- **Escenas que crean datos no se regraban desde cero**: si fallan a medias se arregla el estado en otra pestaña y se sigue con `--desde=`. Una regrabación puede sobrescribir una buena: guarda copia del webm antes.
- **Errores visibles del ERP** («Failed to parse the expression» en un título, correo de la empresa, botón Debug): se tapan con `tapas.json` + `busca_tapa.py`, sin regrabar.
- **Sesión del ERP**: caduca a las pocas horas; el login aparece con usuario/contraseña autocompletados y solo el usuario pulsa Entrar. Comprueba la sesión antes de cada grabación (si no, `NO ENCONTRADO` en el primer prep).
- **Estado compartido entre pestañas**: el menú lateral abierto/cerrado se comparte entre todas las pestañas del Chrome; cada escena fija el suyo (`asegura_menu`). `erp2.mjs` se cuelga en `browser.pages()` con pestañas chrome://: usar `erp2_ov.mjs` o targets de tipo página con timeout.
- **Coste y tiempos**: ~10 capítulos, 62 pantallas, ≈ 80 min de voz. Render ≈ 2,5 min por minuto de vídeo (clips 2560×1440); cola de render por capítulos en segundo plano mientras se verifica el resto.
