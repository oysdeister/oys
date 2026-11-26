---
name: capturas-y-puntos
description: "Capturas 4K de la demo Axional VNext (nextdemo.geasa.eu, base tutorial) con puppeteer conectado al Chrome del usuario, conversión a WebP y colocación de hotspots y puntos de campos. Úsala cuando digas «sacar capturas de la demo», «renovar la captura de un paso», «actualizar hotspots», «colocar puntos de campos» o «ejecutar campos-ocr». Cómo conectar y moverse por el ERP: navegar-erp-next."
---

# Capturas y puntos de la demo

## Cuándo usarla
- Necesitas renovar capturas de la plataforma de formación.
- Recolocas hotspots o puntos de campos.
- Generas `campos-pos.json` con el OCR.

## Capturas 4K: dónde está el resto
Las capturas salen a 3840×2160 (viewport 1920×1080 con `deviceScaleFactor: 2`). Arranque de Chrome en el puerto 9333, inicio de sesión a mano por el usuario, pestaña propia (`TAB`), detección de sesión caducada y datos de prueba (`{INI}`, prefijo `CAP`): skill `navegar-erp-next` (`references/automatizacion.md`, sección «Capturas 4K»). Esta skill cubre lo que viene después: elegir la pantalla, convertir a WebP, hotspots y puntos de campos.

## Dónde está
- `app/public/img/<modulo>/` – capturas WebP de cada módulo.
- `app/src/content/<modulo>.json` – pasos: imágenes, hotspots, texto.
- `app/src/content/campos-pos.json` – puntos de campos por sección.
- `app/src/content/camposPos.ts` – acceso TS a los puntos.
- `_fuente/campos-ocr/` – pipeline OCR (`ocr.swift`, `casar.py`, `ocr.jsonl`, `sin-situar.tsv`).
- `plugins/formacion-oys/scripts/capturas_erp2.mjs` – script puppeteer. Otros scripts de navegación (erp.mjs, erp2.mjs, menushot.mjs, kb*.mjs) y las reglas de sesión, pestañas y datos de prueba: skill `navegar-erp-next`.

## Pasos
0. Una sola vez, instala puppeteer-core junto al script:
   ```bash
   npm --prefix plugins/formacion-oys/scripts install
   ```
1. Abre Chrome con depuración. El usuario inicia sesión él mismo; Claude nunca teclea contraseñas.
   ```bash
   "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome" \
     --remote-debugging-port=9333 --user-data-dir=$HOME/.chrome-erp
   ```
2. Prepara variables y ejecuta el script:
   ```bash
   export SHOTDIR=/ruta/de/salida
   export TAB=<tu-nombre>
   export TMO=90000
   node plugins/formacion-oys/scripts/capturas_erp2.mjs <cmd> [args] ';;' <cmd> [args] ...
   ```
   Comandos principales: `goto <objeto|url>`, `url`, `shot <nombre>` (PNG 3840×2160), `clickxy x y`, `clicktext "texto exacto" [n]`, `type "texto"`, `key <Tecla>`, `sleep ms`, `rect "<css o texto>"`, `fields`, `buttons`, `focus "<label>"`, `msgs`, `menu`, `pick <texto>` (elige fila de desplegable), `menutext`, `text <inicio> <longitud>`, y también `dblxy x y`, `hover`, `clicksel "<css>"`, `selall`, `eval "<js>"`. Los comandos se encadenan con `;;`. `TAB=<nombre>` abre y reutiliza una pestaña propia (registro `.tabs.json`).
3. Reproduce la pantalla del paso (misma que la captura antigua, preferible con datos reales). Usa `fields`/`buttons`/`menu` para inspeccionar; `clicktext`/`focus`/`pick` para navegar; `rect` para cajas.
   - `fields` devuelve etiquetas de inputs con valor y rect: `Etiqueta = valor @x,y,w,h` (flags `ERR`, `RO`). 
   - `buttons` devuelve botones visibles con texto y rect.
   - `rect` busca por CSS o texto exacto.
   - Las coordenadas son px CSS 1920×1080; captura a 2x (3840×2160).
   - Desplegables y diálogos solo se pintan si la pestaña está al frente; si salen vacíos, repite.
   - Si una pantalla solo se consigue grabando, crea un registro propio con prefijo `CAP` (ya existen CAPC, CAPV y CAPK) y nunca toques registros ajenos.
4. Haz la captura: `shot <nombre>` (guarda `<SHOTDIR>/<nombre>.png`).
5. Convierte a WebP 1920×1080 calidad 82 y coloca en `app/public/img/<modulo>/` con nombre `<modulo>-d-<n>.webp` (demo) o `compras-v-<n>.webp` (vídeo). Por ejemplo con `cwebp` (`brew install webp`):
   ```bash
   cwebp -q 82 -resize 1920 1080 "$SHOTDIR/<nombre>.png" -o app/public/img/<modulo>/<modulo>-d-<n>.webp
   ```
6. Actualiza `app/src/content/<modulo>.json`: cambia `imagen` y, si procede, `hotspot`.
   - Hotspot en % de la imagen: `x = px_x / 19.2`, `y = px_y / 10.8`, `w = px_w / 19.2`, `h = px_h / 10.8`, con ~0,5 % de margen.
   - Usa `rect`, `fields` o `buttons` para obtener el rect del elemento y sitúa el punto sobre el elemento nombrado. Conserva la `etiqueta`.
7. Para campos de la tabla sin hotspot, genera los puntos con OCR:
   ```bash
   swift _fuente/campos-ocr/ocr.swift app/public/img/<modulo>/*.webp > _fuente/campos-ocr/ocr.jsonl
   python3 _fuente/campos-ocr/casar.py
   ```
   - `ocr.swift` usa Vision de macOS: una línea JSONL por imagen con texto y %.
   - `casar.py` casa etiquetas de campos con OCR y escribe `app/src/content/campos-pos.json`.
   - Corrige a mano con `EXCLUIR` (no situar) y `FIJAR` (posición forzada) en `_fuente/campos-ocr/casar.py`.
   - Revisa `_fuente/campos-ocr/sin-situar.tsv` para los que quedan sin situar.
8. Revisa los puntos a ojo: arranca el servidor local (`npm --prefix app run dev -- --port 5179 --strictPort`) y abre el bloque con la lupa y comprueba cada hotspot sobre la captura. Dibuja el hotspot sobre una copia de control y mírala reducida (~1400 px) si es necesario.

## Reglas de las capturas (lecciones)
- **Solo lectura**: navega y abre diálogos, pero nunca Guardar, Validar, Aceptar, Contabilizar, Borrar ni Conformar en una captura de revisión; sal con «Cancelar». Si la pantalla solo existe tras grabar (error, contabilizar, remesa), hazla con un registro propio `CAP…`.
- Desplegable «Tipo efecto» con «Datos no disponibles»: no carga hasta que tecleas letras del código; teclea primero y repite.
- Estado irrepetible (cuadre en rojo, línea sin guardar, asiento provisional frente a contabilizado): deja la captura vieja y aclara la diferencia en una frase del paso.
- Captura que contradice el texto (estado final cuando el texto pide el inicial, o códigos distintos a los del alumno): dilo en el paso o vuelve a capturar.
- Hotspot diminuto (disquete de un diálogo anidado, p. ej. cuentas dentro de un grupo auxiliar): ensánchalo a ~3,5 %.
- Obscura es una instancia compartida: abre pestaña propia (`browser_tab_new` y `browser_tab_switch`) antes de cada acción y no toques pestañas ni cookies ajenas.
- La demo es compartida: los números de documento (0AV000001, 0PC000001…) son orientativos; escribe solo en registros propios.

## Comprobar
- `git diff` solo muestra cambios en `imagen` y `hotspot` deseados.
- Ninguna imagen de `app/public/img/<modulo>/` queda huérfana: busca su nombre en los JSON.
- `campos-pos.json` recién generado y `sin-situar.tsv` revisado.

## Errores típicos
- Desplegable o diálogo vacío: la pestaña no está al frente; vuelve a ponerla y repite.
- Chrome sin sesión (todo redirige a `/account/login` o la demo devuelve 503): para, avisa y pide al usuario que inicie sesión; nunca teclees tú la contraseña.
- Hotspot descolocado: olvidaste el margen de 0,5 % o usaste px en vez de %; recalcula.
- Usar `javascript_tool` del navegador integrado: no se usa en este proyecto. Para capturas, el script puppeteer; para consultar páginas, obscura.
- Grabar en la demo sin querer: para capturar, navega y abre diálogos, pero sal con «Cancelar». Solo graba en registros propios `CAP…` cuando la pantalla no se pueda conseguir de otra forma, y nunca toques registros ajenos.
- Querer tapar o difuminar campos: los datos son falsos, no los tapes.
- OCR no encuentra un campo: usa `FIJAR` para forzar su posición o deja en `sin-situar.tsv`.