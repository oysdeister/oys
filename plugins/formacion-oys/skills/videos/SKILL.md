---
name: videos
description: "Trocea grabaciones o vídeos ya renderizados en capítulos de 720p con póster (ffmpeg), súbelos como release de GitHub en oysdeister/oys, regístralos como serie en la plataforma (video-<serie>.ts, videoSeries.ts, videoMapa.ts) y enlaza el minuto desde las secciones y bloques sin repetir tramos. Úsala siempre que pidan «trocea el vídeo de tesorería», «sube los clips a la release», «registra la serie de ventas», «añade momentos a esta sección», «enlaza el minuto en el ejercicio» o «este vídeo sale repetido». No crea vídeos nuevos: eso es video-tutorial-erp y video-motor-remotion."
---
# Vídeos troceados en capítulos

## Cuándo usarla
- Convierte una grabación larga en capítulos cortos para enlazar desde ejercicios o secciones.
- Sube los clips a una release de GitHub y regístralos como serie.
- Enlaza un minuto concreto desde un bloque con el botón «Míralo en el vídeo».
- Para crear vídeos tutoriales nuevos con Remotion, no uses esta skill: usa `video-tutorial-erp` y `video-motor-remotion` de este plugin. Si el vídeo es propio de O&S, parte de `out/web/capNN.mp4` (720p) y `posterNN.jpg` que deja el render.
- Reglas de colocación (el vídeo va primero, un tramo en un solo sitio, `QUITAR_POR_DUPLICADO`), ffmpeg para 720p y póster y pasos de una serie nueva: `references/series_y_momentos.md`.

## Dónde está
- Repo: `oysdeister/oys` · web publicada: https://oysdeister.github.io/oys/
- Releases existentes (`video-v1` compras, `video-tesoreria-v1`, `video-finanzas-v1`, `video-tutoriales-fin-v1`, `video-tablas-fin-v1`, `video-workflow-v1`, `video-ventas-v1`): tabla con su fichero de serie en `references/series_y_momentos.md`.
- Series y capítulos: `app/src/content/video-<serie>.ts` (ej. `video-tesoreria.ts`) y registro en `app/src/content/videoSeries.ts`.
- Compras es la excepción: vive en `app/src/content/videoMapa.ts`.
- Componentes: `app/src/components/video/` (`ReproductorModal`, `BotonMomento`, `CapitulosCompras`).
- Página propia de vídeo: ruta `/video` y `/video/:cap?t=` (solo compras la tiene; las demás series se muestran en sus módulos).
- El vídeo va primero en cada bloque: `app/src/components/exercise/VideoPrimero.tsx` (antes de texto y capturas).
- Los MP4 no se suben a git: `.gitignore` incluye `/video/` y `/app/public/video-tesoreria/`. La release de GitHub es la fuente.

## Pasos
1. **Recorta los clips con ffmpeg (720p).**  
   Cada clip es un tramo continuo de la grabación, sin barra de Meet, participantes, nombres ni datos reales.  
   ```bash
   ffmpeg -i "grabacion.mp4" -ss 00:01:03 -to 00:01:41 -vf "scale=-2:720" -c:v libx264 -crf 23 -preset slow -pix_fmt yuv420p -movflags +faststart -an "cap01.mp4"
   ```
   Con `-ss` antes o después de `-i` el fotograma de corte es el mismo (comprobado): usa el que prefieras. Antes de subir, revisa hojas de fotogramas cada ~10 s de cada clip.  
   Usa nombres `cap01.mp4`, `cap02.mp4`… según vayas a referenciarlos en el fichero de serie.

2. **Sube los clips a una release de GitHub.**  
   Crea una release nueva o sube a una existente.  
   ```bash
   gh release create video-tu-serie-v1 cap01.mp4 cap02.mp4 -R oysdeister/oys
   ```
   Si la release ya existe:  
   ```bash
   gh release upload video-tu-serie-v1 cap03.mp4 -R oysdeister/oys
   ```
   Para sustituir un clip sin cambiar su URL, vuelve a subirlo con el mismo nombre y `--clobber`. Mientras no esté revisado, crea la release con `--draft` (no la verán desde la web).
   La base para las URLs será `https://github.com/oysdeister/oys/releases/download/<tag>`.

3. **Crea el fichero de serie** `app/src/content/video-<serie>.ts`.  
   Copia la estructura de `video-tesoreria.ts` y adapta:  
   - `titulo`, `corto`, `intro`, `modulos` (para mostrarse en el módulo).  
   - `capitulos`: cada capítulo con `n`, `titulo`, `inicio`, `duracion`, `url`, `poster`, `escenas`, `fichero`.  
   - Calcula la URL con la release por defecto: `const RELEASE = 'https://github.com/oysdeister/oys/releases/download/<tag>'` y `clip(f)` = `${RELEASE}/${f}.mp4` (como `video-ventas.ts`). Solo `video-tesoreria.ts` admite sustituir la base con `VITE_VIDEO_TESORERIA_URL` para probar en local; si quieres lo mismo en una serie nueva, añade tú esa variable.  
   - Pósters en `app/public/img/<serie>-video/` (ej. `img/tesoreria-video/cap01.jpg`).  
   - Exporta `SERIES_<SERIE>`, `MOMENTOS_SECCION_<SERIE>`, `MOMENTOS_EJERCICIO_<SERIE>`.

4. **Registra la serie** en `app/src/content/videoSeries.ts`.  
   Añade el import y una línea en `SERIES` usando `Object.fromEntries(...map(...))`.  
   Incluye tus mapas de momentos en `SECCION_BRUTA` (secciones) y `EJERCICIO` (ejercicios), que son llamadas a `juntar(...)`, y añade la serie a la lista de `seriesDeModulo` (si no, no sale en la página del módulo).  
   Si la serie tiene ejercicios, usa `MOMENTOS_EJERCICIO_<SERIE>`; si tiene secciones, `MOMENTOS_SECCION_<SERIE>`.

5. **Enlaza el minuto desde un bloque.**  
   En tu fichero de serie, define momentos con `{serie, capitulo, t, tCap, titulo, fin?}` (`fin` = segundo del clip donde se para el reproductor). `video-ventas.ts` y `video-workflow.ts` traen un ayudante `m(capitulo, tCap, fin, titulo)` que calcula `t` desde el `inicio` del capítulo.  
   Los componentes `BotonMomento` y `VideoPrimero` ya los muestran si están registrados para el id de sección o ejercicio.

6. **Compila y prueba.**  
   ```bash
   npm --prefix app run build
   ```
   Para probar en local, usa el dev server y navega a la ruta del vídeo o a un bloque con momento.

Para compras, no se crea `video-compras.ts`: se edita `CAPITULOS` en `app/src/content/videoMapa.ts` (con las URLs de la release `video-v1` escritas en cada capítulo). La ruta `/video/:cap?t=` es de compras.

## Comprobar
- `npm --prefix app run build` termina sin errores (ya incluye `tsc -b`).
- La serie aparece en la página del módulo correspondiente.
- El botón «Míralo en el vídeo» abre el reproductor en el minuto correcto.
- La URL del clip apunta a la release de GitHub y funciona desde la web publicada.
- Los clips no están en git: `git status` no muestra MP4 nuevos.

## Privacidad de las grabaciones de reuniones
- Los datos de la demo son falsos: **no difumines campos, cuentas ni importes** (ni en vídeo ni en capturas). Solo se ocultan caras, webcams, nombres de participantes de Meet, IBAN y datos de clientes reales.
- Síntoma: se ven caras, la tira de participantes, la cabecera de una clínica real, un IBAN o NIF de un extracto. Causa: se tapó por OCR sobre fotogramas sueltos y nadie revisó los cortes finales. Regla: recorta el clip a la zona del ERP y revisa hojas de fotogramas antes de subir.

## Errores típicos
- **Afirmar que el vídeo está en la web sin mirarlo en pantalla**: comprueba la serie en la página del módulo (solo compras tiene `#/video`; el resto se ve dentro de sus módulos).
- **No uses `video/` sin barra en `.gitignore`**: ignorarías `app/src/components/video` y `app/public/video`. Ancla con `/video/` o rutas concretas.
- **Olvidar registrar la serie** en `videoSeries.ts`: el fichero existe pero no se muestra.
- **Confundir segundos de la sesión con segundos del clip**: en `video-tesoreria.ts` los tiempos de sesión se convierten a `tCap`; si pones `t` mal, el salto cae en otro sitio.
- **Nombres de fichero que no coinciden** con `fichero` del capítulo (`cap01.mp4` vs `cap1.mp4`): la reproducción falla.
- **Usar la URL antigua de `sergibauli/oys`**: la plataforma publicada usa `oysdeister/oys`; las releases nuevas deben crearse con `-R oysdeister/oys`.