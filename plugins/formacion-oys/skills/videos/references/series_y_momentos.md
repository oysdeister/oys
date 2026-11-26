# Series, momentos y reglas de colocación (plataforma oys)

## Releases en `oysdeister/oys` (los MP4 no van a git; la release es la fuente)
| Tag | Contenido | Serie / fichero |
|---|---|---|
| `video-v1` | Compras por capítulos (v2 del vídeo, base TUTORIAL; el cap. 1 se rehízo) | `videoMapa.ts` (`CAPITULOS`) |
| `video-tutoriales-fin-v1` | Tutoriales O&S de finanzas | `video-tutoriales-fin.ts` |
| `video-finanzas-v1`, `video-tesoreria-v1` | Recortes de las sesiones de los ponentes (baja calidad) | `video-finanzas.ts`, `video-tesoreria.ts` |
| `video-tablas-fin-v1` | Un vídeo corto por tabla de finanzas | `video-tablas-fin.ts` |
| `video-workflow-v1` | Aprobación de pedidos con workflow | `video-workflow.ts` |
| `video-ventas-v1` | Ventas, 6 capítulos | `video-ventas.ts` |
Nº de ficheros comprobado en 26-11-2026: video-v1 10, tesoreria-v1 11, finanzas-v1 60, tutoriales-fin-v1 5, tablas-fin-v1 28, workflow-v1 3, ventas-v1 6. Comprueba el listado vivo con `gh release list -R oysdeister/oys`. Crea siempre con `-R oysdeister/oys` (la URL antigua `sergibauli/oys` ya no vale).

## Preparar los ficheros del vídeo propio (salida de video-motor-remotion)
```bash
# 720p sin audio extra: el audio de la voz sí se conserva
ffmpeg -i out/caps/cap01.mp4 -vf "scale=-2:720" -c:v libx264 -crf 23 -preset slow -c:a aac -b:a 96k -pix_fmt yuv420p -movflags +faststart out/web/cap01.mp4
# póster (un fotograma representativo)
ffmpeg -ss 12 -i out/web/cap01.mp4 -frames:v 1 -q:v 3 app/public/img/<serie>-video/cap01.jpg
```
Para recortes de una sesión grabada usa `-an` solo si el clip no lleva voz útil; quita barras de Meet, participantes y nombres.

## Serie nueva, paso a paso
1. Copia `video-ventas.ts` (vídeo propio de O&S) o `video-tesoreria.ts` (recortes) y adapta `id`, `titulo`, `corto`, `intro`, `modulos`, `capitulos` (`n`, `titulo`, `inicio`, `duracion`, `url`, `poster`, `escenas`; los pósters van en `app/public/img/<serie>-video/`). Los tiempos de `escenas` son segundos dentro del clip; `inicio` es el del vídeo completo.
2. Registra la serie en `videoSeries.ts`: import, línea en `SERIES` (`Object.fromEntries(...)`), mapas de momentos dentro de `SECCION_BRUTA` y `EJERCICIO` (ambas son `juntar(...)`) y la serie en `seriesDeModulo`.
3. Define momentos con `{serie, capitulo, t, tCap, titulo, fin?}`: `t` = segundo en el vídeo completo, `tCap` = segundo en el clip, `fin` = dónde se para el reproductor y ofrece seguir viendo. En `video-ventas.ts` y `video-workflow.ts` hay un ayudante `m(capitulo, tCap, fin, titulo)` que calcula `t` desde el `inicio` del capítulo.
4. `npm --prefix app run build` (incluye `tsc -b`) y prueba en local con `VITE_<SERIE>_URL` si los clips no están subidos aún.

## Reglas de colocación (peticiones de Sergi)
- **El vídeo va primero** en la parte: orden vídeo → texto → pantallas (`VideoPrimero.tsx`); el de la tabla o concepto antes que otros.
- **Un tramo, un sitio**: no repitas el mismo tramo en varias secciones de una página ni en el bloque y su sección. Si un tramo ya lo enseña la sección «dueña» del concepto, añade su clave `serie|capítulo|t` a `QUITAR_POR_DUPLICADO` en `videoSeries.ts` (no borres el momento del fichero de origen). Si quitarlo deja la sección sin vídeo, se mantiene.
- Cada momento cubre solo lo que la sección explica (usa `fin`): la navegación básica por Axional va en Maestros («Moverte por Axional»), el overview de un módulo en su página («Antes de empezar»), no en cada bloque.
- Un vídeo grabado en otra base (cifras distintas) no sustituye a otro sin rehacer capturas y texto; si hay tramo equivalente en TUTORIAL, sustitúyelo en la sección y en el bloque.
- Vídeo del workflow al final de la parte, tras el circuito principal.
- Los ids de módulo, bloque y sección no cambian: guardan el progreso y los momentos.
- Nada de difuminar campos: los datos de la demo son falsos.
