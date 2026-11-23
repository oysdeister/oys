---
name: video-tutorial-erp
description: Orquesta de principio a fin un vídeo tutorial de documentación de un ERP (Deister u otro) a partir de grabaciones Loom o de capturas del ERP, para cualquier módulo (compras, ventas, almacén…). Úsala cuando pidan «hacer un vídeo tutorial», «documentar en vídeo el módulo X», «convertir estos Loom en un tutorial» o rehacer un vídeo de formación del ERP. Para la plantilla y el render, video-motor-remotion; para el contenido funcional, las skills erp-*.
---

# Vídeo tutorial de un ERP (orquestador)

Opus decide, reparte y revisa; los agentes baratos (Sonnet) hacen el volumen. El usuario quiere **solo el resultado**: trabaja sin preguntas intermedias y avisa al final con el vídeo.

## Requisitos fijos del usuario
- Diseño espectacular en 3D (paneles flotantes, cámara con dolly, tarjetas que se voltean).
- Pantallas reales paso a paso con **callouts numerados** por cada clic.
- Cobertura completa por **capítulos**, 20-35 min en total, sin prisas; un `resumen` al final de cada capítulo.
- Logo O&S como copyright (`config.marca`), voz **es-ES-XimenaNeural** (edge-tts).
- Castellano de España, tuteo, números en cifras en la narración.

## Flujo
1. **Obtener vídeos**: `yt-dlp <url Loom>` a `media/src/<id>.mp4`. No uses el transcript de Loom del MCP Atlassian: es malo.
2. **Transcribir y extraer fotogramas**: `scripts/procesa.sh <id> <alias>` (whisper-cpp `large-v3-turbo`, `-l es`, con prompt de vocabulario; un fotograma cada 10 s, `f_N = (N-1)*10 s`). `scripts/compacta.py transcript.json salida.txt` compacta y parte en tramos.
3. **Análisis en tramos de ~20 min**: un agente Sonnet por tramo, cada uno con sus frames y su transcripción → `kb/vX_tramoN.md` (pantallas, rutas, campos, datos, tiempos, tramos sucios). Plantilla del encargo en `references/encargos.md`.
4. **Guionista Opus**: fusiona los tramos en `kb/guion_fusionado.md` + `video/src/data/guion.json`, reordena por capítulos y **verifica cada dato y recorte contra el fotograma** (sección «Verificación»). Generador de ejemplo: `scripts/guion/` (gen.py valida tramos, recortes, tramos sucios y velocidades; md.py escribe el guion legible). Ejecútalos con `PROYECTO=<carpeta base>`.
5. **Revisión Opus**: comprueba en los frames lo dudoso y las cifras clave. Las decisiones y las cifras las fijas tú.
6. **Locución, clips, velocidades y render por capítulos**: skill `video-motor-remotion`.
7. Revisa 3-4 fotogramas del render final y entrega el capítulo 1 y el completo.

Si no hay grabación (ERP nuevo), se graba con capturas 4K: ver `erp-nuevo-compras` («Capturas»).

## Privacidad y limpieza (obligatorio)
Ningún clip puede mostrar: rejillas de usuarios (nombres, e-mails), Gmail, Google Calendar, pantallas de login, errores de conexión o de informe, widget del grabador, pantallas en blanco, ventanas de correo. Recorta las barras del navegador y de Windows. Anota los tramos sucios en el guion para que `gen.py` los rechace.

## Errores típicos
- **Whisper inventa texto en los silencios**: corrige siempre con la pantalla; los rótulos literales mandan.
- Cifras de la voz que no cuadran con la pantalla (p. ej. dice 10.990 y se ve 10.890): manda la pantalla.
- Pasos que se nombran pero no se ven: márcalos «SIN PANTALLA», no los inventes.
- Recortes estimados por los agentes: ajústalos sobre el fotograma.

## Coste
Delega lectura y análisis en modelos baratos (Sonnet o DeepSeek con el orquestador); Opus solo para guion, verificación y decisiones. Más detalle y lecciones: `references/lecciones.md`.
