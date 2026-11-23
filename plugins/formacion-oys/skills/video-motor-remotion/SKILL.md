---
name: video-motor-remotion
description: Plantilla Remotion de O&S para vídeos tutoriales 3D guiados por un guion JSON (pantallas reales con callouts, flujos 3D, comparativas Antes/Ahora, resúmenes, logo O&S) y sus comandos de locución edge-tts, recorte de clips, ajuste de velocidades y render por capítulos. Úsala al montar, previsualizar o renderizar un vídeo tutorial, al escribir o corregir guion.json, o cuando el render sea lento o falle.
---

# Motor de vídeo Remotion

## Instalar en un proyecto
```bash
cp -R <skill>/assets/plantilla <proyecto>/video && cd <proyecto>/video && npm install
mkdir -p <proyecto>/tools && cp <skill>/scripts/{voz.py,clips.py,render_all.sh} <proyecto>/tools/
python3 -m venv <proyecto>/tools/.venv && <proyecto>/tools/.venv/bin/pip install edge-tts
```
`voz.py` y `clips.py` buscan `../video` respecto a su carpeta; con otra ruta, `VIDEO_DIR=<carpeta video>`.

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
Lo aplica `../video-tutorial-erp/scripts/guion/gen.py`; recalcúlalo siempre que cambie la voz.

## Rendimiento
- `remotion.config.ts`: `gl=angle` (GPU) y concurrencia 8: 3-4 veces más rápido que software. ≈ **7,5 min de render por cada 3 min de vídeo**; 34 min ≈ 75 min. Renderiza por capítulos y en segundo plano.
- Si Chrome headless no arranca, descomprime a mano el zip descargado en `node_modules/.remotion/chrome-headless-shell/` y vuelve a lanzar.
- Sin `timing.json` la duración se estima a 2,6 palabras/s; Ximena real ≈ 2,45.

## v2: navegación grabada en vivo (recomendado para ERP web)
- Plantilla `assets/plantilla_v2/` (pantalla al 92 % y plana, vuelo 3D solo al entrar, título en la barra del navegador, resaltes ámbar, callouts cian, subtítulos que se apartan de las marcas, `tapas`, huecos de voz). Cadena completa en `assets/plantilla_v2/LEEME_V2.md`.
- Scripts `scripts/v2/`: `rec.mjs` (grabador con cursor y log de eventos; ajusta `BASE` a la URL del ERP), `gen_v2.py` (une capNN.json, re-temporiza clips contra la voz y genera efectos desde el log), `busca_tapa.py`, `erp2_ov.mjs` (pestaña propia por agente).
- Orden: `gen_v2.py` → `voz.py` → `gen_v2.py --clips [--solo=ids]` → stills → `npx remotion render Cap-NN`.
