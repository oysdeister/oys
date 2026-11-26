---
name: video-motor-remotion
description: "Plantilla Remotion de O&S (v1 con capturas y v2 con navegación grabada en vivo) y sus herramientas: locución edge-tts es-ES-XimenaNeural, grabador puppeteer rec.mjs, recorte de clips, re-temporizado voz-clic y render por capítulos. Úsala al montar, previsualizar o renderizar un vídeo, al escribir o corregir guion.json o capNN.json, al grabar la demo con rec.mjs, o cuando el render sea lento o falle. Para orquestar un tutorial nuevo, video-tutorial-erp; para subirlo a la plataforma, videos."
---

# Motor de vídeo Remotion

## Instalar en un proyecto
```bash
cp -R <skill>/assets/plantilla <proyecto>/video && cd <proyecto>/video && npm install
mkdir -p <proyecto>/tools && cp <skill>/scripts/{voz.py,clips.py,render_all.sh} <proyecto>/tools/
python3 -m venv <proyecto>/tools/.venv && <proyecto>/tools/.venv/bin/pip install edge-tts
```
`voz.py` y `clips.py` buscan `../video` respecto a su carpeta; con otra ruta, `VIDEO_DIR=<carpeta video>`.
Para la v2: `cp -R <skill>/assets/plantilla_v2 <proyecto>/video`, copia `<skill>/assets/plantilla/public/brand` a `<proyecto>/video/public/brand` (la v2 no lo trae), `npm install`, y copia **toda** `<skill>/scripts/v2/*` a `<proyecto>/tools/` (junto a `voz.py`): `recorta.py`, `busca_tapa.py` y `gen_v2.py` leen y escriben `../rec/`, `../video/` respecto a su carpeta (grabaciones en `<proyecto>/rec/`).

## Guion
Todo sale de `video/src/data/guion.json`; el formato completo está en `assets/plantilla/GUION_FORMATO.md` (léelo antes de escribir). Tipos: `portada`, `capitulo`, `flujo`, `pantalla`, `conceptos`, `estructura`, `tip`, `cuidado`, `comparativa`, `resumen`, `calculo`, `cierre`. Sincroniza con `clave` (palabra de la narración) o `t`. Coordenadas de `pantalla` en píxeles del vídeo original (`tamano`, por defecto 1680×1048; capturas 4K: 3840×2160; una imagen fija con `imagen` o pasada a mp4 con `ffmpeg -loop 1 -t N`). Marca O&S: `config.marca` con `brand/oys_logo_light.png`. Ejemplo completo real: `references/guion_compras_antiguo.json`.

## Comandos (desde la base del proyecto)
```bash
tools/.venv/bin/python tools/voz.py      # locución + src/data/timing.json (--force, --solo id1,id2)
python3 tools/clips.py                   # recorta public/clips/<id>.mp4 (--force)
cd video && node scripts/plan.mjs > out/plan.txt   # duración real de cada escena
npx remotion studio                      # vista previa
node scripts/stills.mjs out/stills E-<id>:9s Cap-02:-30   # fotogramas de control
npx remotion render Cap-01 out/caps/cap01.mp4             # un capítulo
tools/render_all.sh video out/tutorial.mp4 9              # todos los capítulos + concat ffmpeg
```
Concat manual: lista `file 'capNN.mp4'` y `ffmpeg -f concat -safe 0 -i lista.txt -c copy salida.mp4`. Los `Cap-NN` concatenados son exactamente `Tutorial`.

## Regla de velocidad de clip
Tras `voz.py` y `plan.mjs`, para cada `pantalla` con clip:
- `velocidad = (fin − inicio) / (dur − 1,1)` (1,1 = `clipDesde` 0,3 + 0,8 de transición), redondeada hacia arriba a 0,05, **entre 1 y 2,2**. Si pasa de 2,2, recorta el tramo.
- Callouts y zooms sincronizados por segundo de vídeo: `t_escena = clipDesde + t_clip / velocidad` (con `t_clip` desde el inicio del tramo).
Lo aplica `../video-tutorial-erp/scripts/guion/gen.py` (v1; avisa si pasa de 2,2). En la v2 no se usa: `gen_v2.py --clips` re-temporiza cada clip contra la voz (acelera hasta 3×, o 2× con tecleo, y si no llega inserta silencios en la voz). Recalcula siempre que cambie la voz.

## Voz
`scripts/voz.py` usa **edge-tts con `es-ES-XimenaNeural`** (`VOZ_DEFECTO`; en v2 `config` pone rate −5 %). Regenera solo las escenas cuyo texto, voz o rate cambian (hash) y escribe `timing.json` con las palabras. Fish Audio no sirvió; edge-tts sí. Si cambia la narración de una pantalla, relanza `voz.py` y `gen_v2.py --clips`. Escribe los códigos para que se lean bien («cero A C cinco») y los números en cifras.

## Trampas de la grabación y la sincronía (síntoma → causa → regla)
- Clave que no casa con la voz → está en el log `rec/<id>.json`, no solo en el JSON, o lleva dígitos/guion, o es corta y casa por prefijo con otra palabra → cámbiala también en el log y usa frases sin dígitos ni guion.
- Escena que crea datos falla a medias → no se regraba desde cero → arregla el estado en otra pestaña, sigue con `--desde=<id>` y guarda copia del webm antes (una regrabación pisa la buena).
- Error del ERP visible («Failed to parse the expression», botón Debug) → fallo de la demo → `tapas.json` + `busca_tapa.py`, sin regrabar.
- Cabecera roja y paneles oscuros → el ERP sigue `prefers-color-scheme` → `rec.mjs` fuerza tema claro; empieza cada tanda con `goto`.
- Varias sesiones pisándose → un solo Chrome, una pestaña propia por agente (`erp2_ov.mjs`), un solo grabador y un solo render (cerrojos).

## Salida para la plataforma
Cada capítulo se renderiza a `out/caps/capNN.mp4` (1920×1080, H.264+AAC) y se concatena a `out/<tutorial>.mp4`. Para la web, haz `out/web/capNN.mp4` a 720p y `posterNN.jpg` (comando y subida en la skill `videos`).

## Rendimiento
- `remotion.config.ts`: `gl=angle` (GPU) y concurrencia 8: 3-4 veces más rápido que software. ≈ **7,5 min de render por cada 3 min de vídeo**; 34 min ≈ 75 min. Renderiza por capítulos y en segundo plano.
- Si Chrome headless no arranca, descomprime a mano el zip descargado en `node_modules/.remotion/chrome-headless-shell/` y vuelve a lanzar.
- Sin `timing.json` la duración se estima a 2,6 palabras/s (`lib/plan.ts`); Ximena real ≈ 2,45 (`gen.py`).
- Cada vídeo de la v2 dura ≈ 2,5 min de render por minuto de vídeo (clips 2560×1440); un solo grabador y un solo render a la vez.

## v2: navegación grabada en vivo (recomendado para ERP web)
- Plantilla `assets/plantilla_v2/` (pantalla al 92 % y plana, vuelo 3D solo al entrar, título en la barra del navegador, resaltes ámbar, callouts cian, subtítulos que se apartan de las marcas, `tapas`, huecos de voz). Cadena completa en `assets/plantilla_v2/LEEME_V2.md`.
- Scripts `scripts/v2/`: `rec.mjs` (grabador con cursor y log de eventos; ajusta `BASE` a la URL del ERP), `gen_v2.py` (une capNN.json, re-temporiza clips contra la voz y genera efectos desde el log), `busca_tapa.py`, `erp2_ov.mjs` (pestaña propia por agente).
- Orden: `gen_v2.py` → `voz.py` → `gen_v2.py --clips [--solo=ids]` → stills → `npx remotion render Cap-NN`.
- Grabación en vivo, en serie: `CDP=http://127.0.0.1:9334 TMO=5000000 node scripts/v2/rec.mjs capNN.json [--solo=id] [--desde=id] [--dry]`; formato de `acciones` en `GUION_FORMATO.md` (sección «pantalla v2»). Después `python3 scripts/v2/recorta.py <id>` quita esperas muertas. Graba en un **Chrome headless propio** (puerto 9334, `CDP=http://127.0.0.1:9334`) para no robar el foco al usuario; la sesión del ERP la inicia él. `SETTLE_MAX` (3 s) evita esperas de 9 s por clic en ERPs que sondean la red, y `recorta.py` limpia grabaciones antiguas. Detalle en `video-tutorial-erp/references/lecciones.md` (Grabación, 25-11-2026).
