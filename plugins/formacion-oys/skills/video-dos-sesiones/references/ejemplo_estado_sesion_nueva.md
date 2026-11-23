# Estado Fase B — vídeo del ERP nuevo (actualizado 14-11-2026)

Autorización del usuario: autonomía total dentro de la base `tutorial` de nextdemo; solo avisar con el resultado final.

## Hecho
- Mapa y notas: `mapa_erp_nuevo.md` (requisitos del vídeo incluidos), `notas_tarifas.md`, `notas_tipos_documento.md`, `notas_circuito.md`.
- Capturas HD 3840x2160: `hd/01…41` (+28b, 34a, 39a) de documentos existentes; índice con zooms en `hd/INDICE.md`.
- Herramienta Chrome: `tools/erp.mjs` (Chrome aparte, puerto 9333, sesión iniciada por el usuario). Voz/clips: `tools/voz.py`, `tools/clips.py` (copias que apuntan a `nueva/video`); ejecutar voz con `../tools/.venv/bin/python nueva/tools/voz.py` desde la base.
- Plantilla Remotion copiada: `nueva/video/` (node_modules enlazado al de `video/`). Formato: `nueva/video/GUION_FORMATO.md`.
- Diferencias v1: `diferencias.md` (antes de crear el circuito real; actualizar con `circuito_creado.md`).

## En curso
- Subagente creando en `tutorial` un pedido PC nuevo → albarán → factura con capturas `hd/50…99` → `circuito_creado.md` + sección en `hd/INDICE.md`.

## Pendiente
1. Actualizar `diferencias.md` con el circuito creado (workflow, contabilización, asientos, precio desde tarifa).
2. `nueva/video/src/data/guion.json`: mismos 9 capítulos + apertura del guion fusionado (`kb/guion_fusionado.md`, ~34 min, `video/src/data/guion.json` de referencia y generador `kb/verif/gen/`), escenas `pantalla` con las capturas HD (PNG → mp4 con `ffmpeg -loop 1 -t N`, `tamano` 3840x2160), callouts numerados por clic, `flujo` 3D, `comparativa` Antes/Ahora por cada diferencia, `resumen` al final de cada capítulo, `config.marca` con logo O&S (`brand/oys_logo_light.png`).
3. Voz es-ES-XimenaNeural (`voz.py`), render por capítulos (`npx remotion render Cap-NN`, ~7,5 min de render por 3 min de vídeo) y concatenar → `nueva/out/tutorial_compras_erp_nuevo.mp4`.
4. Avisar a la sesión principal y al usuario solo con el resultado.

## Referencia
- Vídeo antiguo renderizado: `video/out/tutorial_compras_erp.mp4` (34:11, 9 capítulos; capítulos en `video/out/caps/`). Referencia de ritmo y estilo. Render completo ≈ 75 min (GPU angle, concurrencia 8).

## Render (lanzado)
- `tools/render_all.sh` renderiza Cap-01…09 en `out/caps/` (salta los ya hechos) y concatena en `out/tutorial_compras_erp_nuevo.mp4`; log en `out/render.log`. Guion generado por `video/scripts/gen_guion.py` (34:07, 126 escenas); `pantalla` admite `imagen`; LEEME en `video/LEEME_RENDER.md`.
