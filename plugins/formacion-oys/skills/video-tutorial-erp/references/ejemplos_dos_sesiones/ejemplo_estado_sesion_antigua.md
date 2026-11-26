# Estado del proyecto «Tutorial compras ERP» (sesión principal)

Objetivo: vídeo NUEVO fusionando los dos Loom (versión antigua del ERP), espectacular (3D, animaciones), voz es-ES-XimenaNeural (edge-tts),
completo por capítulos (≈20-35 min, cada sección bien explicada, sin prisas). La sesión «erp-nuevo-tutorial»
(<id-sesión>, trabaja en `nueva/`) hará el mismo vídeo de la versión nueva + diferencias, usando kb/ y video/.
El usuario quiere que ambas sesiones avancen SIN preguntarle.

## Hecho
- media-context-mcp registrado (user scope). whisper-cpp + models/ggml-large-v3-turbo.bin. yt-dlp, tesseract.
- Vídeos: media/src/d5fa…mp4 (v1, 14 min), media/src/8929…mp4 (v2, 1 h 46 min), 1680x1048 30 fps.
- Transcripciones whisper: media/v1_compras/, media/v2_tarifas/ (transcript.txt compacto, tramo1..5.txt), frames cada 10 s (f_N = (N-1)*10 s).
- kb/v1_analisis.md (agente Sonnet).
- tools/tts.mjs (Fish, no sirve: 402), tools/procesa.sh, tools/compacta.py, tools/.venv con edge-tts.

## En curso
- HECHO: kb/v2_tramo1..5.md. EN CURSO: agente Opus guionista → kb/guion_fusionado.md + video/src/data/guion.json (verifica contra frames).
- Agente Opus plantilla Remotion en video/ (+ tools/voz.py, tools/clips.py, video/GUION_FORMATO.md, render por capítulos, 3D).

## Siguiente
1. Revisar informes (yo): comprobar lo dudoso contra frames.
2. Agente Opus «guionista»: kb/guion_fusionado.md + video/src/data/guion.json (capítulos, escenas, clips con recortes).
3. voz.py → clips.py → render por capítulos → completo video/out/tutorial_compras.mp4.
4. Avisar a erp-nuevo-tutorial: kb/ y video/ listos (voz Ximena, no Fish).

## Notas de revisión
- v2_tramo2 y v2_tramo3 listos. tramo3 usa frames propios en media/v2_tarifas/t3/ (s = 2580+(N-1)*20).
- PRIVACIDAD: no mostrar la rejilla «Usuarios» (tramo3, nombres y e-mails reales). Difuminar cualquier dato personal en clips.
- Whisper inventa texto en v1 13:18–13:39 y v2 1:00:45–1:02:09: no usar como fuente.
- v2_tramo1 y v2_tramo4 listos. Excluir de los clips: avisos de Gmail (v2 s1170–1190, esquina inferior derecha), error JRepException (v2 s1060), ERR_CONNECTION_TIMED_OUT (v1 800–850, v2 957–1036). En tramo4 los recortes son estimados: ajustarlos sobre el fotograma.
- PLANTILLA LISTA (video/). Comandos: voz `tools/.venv/bin/python tools/voz.py`; clips `python3 tools/clips.py`; render por capítulo `cd video && npx remotion render Cap-01 out/cap01.mp4`; completo `Tutorial`. ~7,5 min de render por 3 min de vídeo (GPU angle, concurrencia 8). Ejemplo: video/out/ejemplo.mp4. DeepSeek sin saldo (402).
- GUION LISTO: kb/guion_fusionado.md + video/src/data/guion.json (125 escenas, 67 pantallas, ~34 min, 9 cap + apertura). Generador kb/verif/gen/gen.py.
- Verificación propia (Opus) contra fotograma: v2 6172 s «Bloqueada 3000 · IMPORTE PROVEEDOR != IMPORTE FACTURA», base 9.000, cuota 1.890, importe factura 8.750, neto 10.890 ✔; v2 5895 s conformar albaranes 201501RC-000002 / 151201PC000003, 10.890 ✔.
- EN CURSO: voz.py + clips.py + plan.mjs. Después: comprobar escenas más cortas que su clip (agregar-lineas, serie-ficha, fac-obligatorio, alta-factura) y render Cap-00..Cap-09.
- Velocidades de clips arregladas por el guionista (gen.py lee out/plan.txt). RENDER EN CURSO: video/out/caps/capNN.mp4 → video/out/tutorial_compras_erp.mp4 (concat). Al acabar: revisar 3-4 fotogramas, enviar al usuario cap01 y el completo, y avisar a erp-nuevo-tutorial.
