# Plantillas de encargo a los agentes

## Analista de tramo (Sonnet)
> Analiza el tramo N (de hh:mm a hh:mm) del vídeo `<alias>`. Tienes `media/<alias>/tramoN.txt` (transcripción whisper, puede inventar texto en silencios) y los fotogramas `media/<alias>/frames/f_XXXXX.jpg` (f_N = (N-1)*10 s). Escribe `kb/<alias>_tramoN.md` con: 1) secuencia de pantallas con segundo de inicio y fin; 2) ruta de menú, nombre de pantalla, campos y valores literales tal como se ven; 3) procedimiento paso a paso; 4) conceptos explicados; 5) tramos sucios (login, usuarios, correo, errores, pantallas en blanco, avisos) con segundos; 6) dudas. Cita siempre el segundo. No inventes lo que no se ve.

## Guionista (Opus)
> Fusiona `kb/*.md` en un guion por capítulos (20-35 min, resumen al final de cada uno) con el formato de `video/GUION_FORMATO.md`. Cada escena `pantalla` lleva tramo, recorte, zooms y callouts numerados por clic. Verifica cada dato, tramo y recorte contra el fotograma y documenta la sección «Verificación» (datos comprobados, correcciones, exclusiones de privacidad, SIN PANTALLA, dudoso). Salidas: `kb/guion_fusionado.md` y `video/src/data/guion.json`.

## Ejemplo real
Guion y verificación del vídeo de compras antiguo: `../../erp-antiguo-compras/references/guion_fusionado.md` y `verificacion.md`.
