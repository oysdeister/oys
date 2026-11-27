# Vídeo v2 · cadena de montaje

Carpeta: `nueva/v2/video` (ruta con espacios: entrecomilla). Formato de escenas: `GUION_FORMATO.md` (sección «pantalla v2» al final).

## Cadena

```bash
cd "nueva/v2/tools"
# 1) guion: une cap01.json … cap10.json → video/src/data/guion.json
#    (añade la escena «capitulo» si falta, portada/cierre por defecto si faltan, quita «acciones» y campos ajenos,
#     pone config: Ximena -5 %, entrada 0,8 s, colchón 2 s, pausaCapitulo 2 s, marca O&S; avisa de «comparativa»
#     y de palabras prohibidas)
python3 gen_v2.py

# 2) voz (edge-tts es-ES-XimenaNeural) → video/public/audio/<id>.mp3 + video/src/data/timing.json
#    (el venv está en BASE/tools/.venv; voz.py usa VIDEO = v2/video y solo regenera lo que cambia)
../../../tools/.venv/bin/python voz.py

# 3) clips: por cada «pantalla» con rec/<id>.webm + rec/<id>.json → video/public/clips/<id>.mp4 (2560×1440, sin audio)
#    re-temporizados con la voz + efectos (zooms, resaltes, callouts, focos) + «duracion»; guarda video/src/data/sync.json
python3 gen_v2.py --clips            # --solo id1,id2 · --force · --res 1920|2560|3200

# 4) plan, comprobaciones y fotogramas
cd ../video
node scripts/plan.mjs > out/plan.txt
npx tsc --noEmit
ESCALA=1 node scripts/stills.mjs out/stills E-<id>:5s Cap-03:-30     # ESCALA=1 → 1920×1080

# 5) render por capítulos y concat
mkdir -p out/caps
for n in 01 02 03 04 05 06 07 08 09 10; do npx remotion render Cap-$n out/caps/cap$n.mp4; done
for n in 01 02 03 04 05 06 07 08 09 10; do echo "file '$PWD/out/caps/cap$n.mp4'"; done > out/caps/lista.txt
ffmpeg -y -f concat -safe 0 -i out/caps/lista.txt -c copy ../../out/tutorial_compras_vnext_v2.mp4
```

Si cambia la narración de una pantalla: `voz.py` y otra vez `gen_v2.py --clips` (el re-temporizado depende de la voz).
`gen_v2.py` sin `--clips` reaplica lo último de `sync.json` mientras la narración no cambie (si cambia, avisa).

## Re-temporizado (gen_v2.py --clips)

- El screencast de puppeteer escribe 30 fotogramas por segundo real aunque el webm diga 25 fps: se toma fotograma/30 como reloj (coincide con el log de `rec.mjs`).
- Cada acción del log con `clave` (click, type/fill, resalta, pick, key) es un ancla: su evento cae 0,3 s antes de que la voz diga la clave (prefijo sin acentos, en orden, como `clave` en Remotion).
- Entre anclas: si el vídeo va por delante, se congela justo antes de que el cursor arranque hacia el objetivo (el cursor se mueve y hace clic al decir la palabra); si va por detrás, se acelera el tramo hasta **3×** (solo cursor o espera) o **2×** (si hay tecleo en el tramo) y, si aun así no llega, **la voz espera**: se inserta un silencio justo antes de la palabra clave (en medio de la pausa anterior), de modo que el clic siempre cae con su palabra o 0,3 s antes (criterio C5).
- Los silencios van en la escena como `huecos: [{s, ms}]` (`s` = segundo de la voz original, `ms` = silencio). La plantilla (`lib/plan.ts`) retrasa las palabras posteriores (subtítulos y `clave`) y alarga la voz; `Tutorial.tsx` toca el mp3 en varios `<Audio startFrom/endAt>` desplazados (el mp3 y `timing.json` de `voz.py` no se tocan, así que es reejecutable). Escenas sin `huecos`: igual que antes.
- Los `scroll` también son anclas: con su `clave` o, si no la traen, con la primera «baja / abajo / bajamos / desplaza…» de la voz antes de la siguiente clave.
- El silencio se pone en el **límite de frase** (palabra terminada en punto, coma, dos puntos…) más cercano antes de la palabra clave y no antes de la ancla anterior; si no hay ninguno, en la pausa justo antes de la palabra.
- **Congelado final**: si la voz sigue más de 4 s sobre la última imagen, el tramo final (después de la última acción) se ralentiza hasta 0,6× y, si aún sobra, se añade un zoom lento hacia el último resalte (o una vuelta lenta al plano general si estaba con zoom).
- `sync.json` y `guion.json` se escriben de forma atómica y `--clips` solo actualiza en `sync.json` las escenas que procesa (se puede lanzar en paralelo por capítulos con `--solo`).
- Los fotogramas se remapean uno a uno (ffmpeg decodifica → Python → ffmpeg codifica, x264 crf 16, GOP 30): sin saltos ni mezclas. ≈ 7 s por cada 20 s de clip.
- `duracion` de la escena = máx(entrada + voz + colchón (+ pausa de capítulo), 0,3 + clip + 1 s).

## Efectos generados desde el log (coordenadas de escena = px CSS × 2, `tamano` 3200×1800)

| Evento | Efecto |
|---|---|
| `resalta` con `etiqueta` | callout cian numerado con la etiqueta (oscurece el resto) |
| `resalta` sin etiqueta | resaltado ámbar del rect (oscurece el resto) |
| `type`/`fill` (campo) | resaltado ámbar del campo mientras se teclea (+0,8 s), sin oscurecer |
| `click`/`pick` | anillo cian breve en el punto; si lleva `clave`, resaltado ámbar 2 s |
| clave + elemento pequeño | zoom 2D suave (≤ 1,55×) que arranca cuando el cursor sale hacia él y vuelve al plano general; zonas cercanas se agrupan |

Si la escena del `capNN.json` trae `zooms`, `callouts`, `resaltes` o `foco` propios, se respetan y no se generan los de ese tipo.

## Diseño de la escena `pantalla` (v2)

- Panel de 1768×995 (92 % del ancho), plano (0°) mientras se explica; el vuelo 3D solo en la entrada (≈1 s). Transición de entrada `fade` (o `vuelo` entre dos pantallas).
- Barra de navegador fina (30 px) con «PASO · título» a la izquierda, URL en el centro y «NN/TT capítulo» a la derecha; la barra de capítulos global se oculta durante las pantallas.
- Zoom = dolly 2D dentro de la ventana (la barra no se mueve), nunca enseña fuera del vídeo, sin desenfoques.
- Subtítulos compactos (30 px, fondo oscuro) abajo; si una marca cae en la franja inferior suben arriba, y si hay marcas arriba y abajo se atenúan. La mosca O&S lleva placa oscura sobre el ERP y se atenúa si hay una marca en su esquina.

## Rendimiento medido (Mac, GPU angle, concurrencia 8)

- Pantalla con clip 2560×1440: 15 s de vídeo en 40 s (≈ 30 s de render + bundle) → ≈ 2 s de render por segundo.
- Escenas de concepto 3D, algo más: ≈ 2-2,5 min de render por minuto de vídeo. Un vídeo de 40 min ≈ 1,5 h (renderiza por capítulos).

## Prueba

`src/data/guion_prueba.json` (fuente `guion_prueba.fuente.json`; pantalla con `rec/prueba.webm` y eventos con clave añadidos a mano en `rec/prueba.json`, original en `rec/prueba.orig.json`). Para usarla: copiarla a `guion.json`, `voz.py`, `python3 gen_v2.py --entrada ../video/src/data/guion_prueba.fuente.json --salida ../video/src/data/guion_prueba.json --clips`. Fotogramas en `out/stills_diseno/`, render de 15 s en `out/prueba_pantalla.mp4`. Los datos de la v1 están en `out/v1_data/`.

## Tapas (parches sobre el vídeo, criterio B8)

Para tapar un texto erróneo de la grabación (p. ej. «Failed to parse the expression [${Pedidos compras}]» en el título de la ficha del pedido) sin volver a grabar:

1. Localiza el rect (px 3200×1800 = CSS × 2) en un fotograma del webm y el tramo en que se ve:
   `python3 tools/busca_tapa.py c5-validar 930,140,390,60 600` → `[(212, 1481)]` (fotogramas a 30 fps).
2. Añádelo a `v2/tapas.json` (por escena): `{"rect": {...}, "texto": "PEDIDOS DE COMPRAS", "desdeFrame": 212, "hastaFrame"?: …, "margen"?: 9}`. Estilo por defecto: fondo `#F1F1F1`, Roboto 500, 31 px de vídeo, espaciado `0.09em`, color `#1F1F1F` (igual que el título de la ficha); `fondo`, `color`, `tamano`, `espaciado`, `peso`, `dy` lo cambian.
3. `python3 gen_v2.py --clips --solo <id>` convierte los fotogramas a segundos de escena con el re-temporizado y escribe `tapas` en la escena (sync.json → guion.json; no se pierden al regenerar el guion).

La plantilla pinta la tapa dentro del vídeo (se mueve con el zoom). Casos actuales: título «Failed to parse…» en c5-lineas, c5-validar y c6-servido; correo info@deister.es de la ficha del albarán (fondo blanco, sin texto) en c6-cabecera, c6-contabilizar, c6-lineas, c6-prevista y c6-validar (`busca_tapa.py` admite una referencia de otra grabación: `… 2280,1305,200,48 c6-cabecera:600`).
El botón «Debug» del ERP (abajo a la derecha) lo tapa en todas las pantallas la placa opaca de la mosca O&S.
