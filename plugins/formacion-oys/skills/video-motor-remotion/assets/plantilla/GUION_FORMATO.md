# Formato del guion (`src/data/guion.json`)

El vídeo se rellena entero desde un guion JSON. `tools/voz.py` genera la locución (edge-tts, `es-ES-XimenaNeural`, rate `+0%` por defecto) en `public/audio/<id>.mp3` + `<id>.words.json` y escribe `src/data/timing.json`; `tools/clips.py` recorta los clips de pantalla a `public/clips/<id>.mp4`. Remotion lee guion + timing y calcula duraciones, capítulos, subtítulos y transiciones.

## Raíz

```json
{ "titulo": "Compras en el ERP", "config": { … }, "escenas": [ … ] }
```

### `config`

| Campo | Tipo | Por defecto | Qué hace |
|---|---|---|---|
| `voz` | string | `es-ES-XimenaNeural` | Voz edge-tts (cada escena puede sobrescribirla) |
| `rate` | string | `+0%` | Velocidad de la voz (`+5%`, `-5%`…) |
| `entrada` | s | 0.6 | Silencio antes de que empiece la voz en cada escena |
| `colchon` | s | 1.3 | Margen tras la voz antes de pasar a la siguiente escena |
| `pausaCapitulo` | s | 1.2 | Respiro extra al final de la escena que precede a cada capítulo |
| `transicion` | s | 0.8 | Duración de las transiciones (solapan escenas) |
| `subtitulos` | bool | true | Subtítulos karaoke abajo |
| `marca` | objeto o string | — | Marca de la empresa: mosca en la esquina, logo animado en portada y cierre, copyright (ver abajo) |

### `config.marca`

```json
"marca": { "logo": "brand/oys_logo_light.png", "texto": "O&S Consultores", "copyright": "© 2026 O&S Consultores",
           "ancho": 544, "alto": 332, "zonaTexto": { "x": 140, "y": 128, "w": 290, "h": 162 },
           "centroTrazo": { "x": 55, "y": 72 }, "inicioTrazo": 238 }
```

| Campo | Descripción |
|---|---|
| `logo` | PNG en `public/` (versión clara para fondo oscuro) |
| `texto` | Nombre de la empresa |
| `copyright` | Por defecto `© <año> <texto>` |
| `ancho`, `alto` | Tamaño del PNG en px (544×332) |
| `zonaTexto` | Caja del texto dentro del PNG (px). Lo que queda fuera (el arco) se dibuja con un barrido circular y después aparece el texto. Sin ella, revelado simple |
| `centroTrazo`, `inicioTrazo` | Centro (%) y ángulo inicial (grados, 0 = arriba, horario) del barrido |
| `mosca` | `false` quita la mosca de la esquina (≈110 px, opacidad 0,7, abajo a la derecha; se oculta en portada y cierre, donde sale el logo grande) |

La barra de capítulos muestra a la izquierda `titulo` del guion.

## Duración

`escena = entrada + voz + colchon + pausa (+ pausaCapitulo si la siguiente es un capítulo)`.
`duracion` (s) la fija a mano (útil para escenas sin narración). El total es la suma menos los solapes de transición. Sin `timing.json` (voz aún no generada) se estima a 2,6 palabras/s. La escena se alarga sola si la voz no ha terminado antes de la transición.

## Sincronizar con la locución («Cuando»)

Muchos elementos aceptan uno de estos dos campos:

- `t`: segundos desde el inicio de la escena (incluye la `entrada`).
- `clave`: palabra o frase de la narración. Se compara sin acentos ni mayúsculas y por prefijo (`"albar"` casa con «albaranes»); se busca en orden, después de la coincidencia anterior. Si no aparece, se usa el escalonado automático.

Sin `t` ni `clave` los elementos aparecen escalonados automáticamente.

## Campos comunes a todas las escenas

| Campo | Tipo | Descripción |
|---|---|---|
| `id` | string | Único; da nombre a audio, clip y composición `E-<id>` (letras, números, guiones) |
| `tipo` | string | `portada`, `capitulo`, `flujo`, `pantalla`, `conceptos`, `estructura`, `tip`, `cuidado`, `comparativa`, `resumen`, `calculo`, `cierre` |
| `narracion` | string | Texto de la locución (también los subtítulos) |
| `voz`, `rate` | string | Sobrescriben los de `config` |
| `etiqueta` | string | Antetítulo pequeño (sustituye al del tipo) |
| `duracion` | s | Duración fija |
| `colchon` | s | Sobrescribe `config.colchon` |
| `pausa` | s | Respiro extra al final |
| `transicion` | string | Transición de **entrada**: `auto`, `fade`, `slide`, `slide-arriba`, `wipe`, `zoom`, `luz` (barrido de luz), `vuelo` (fly-through 3D), `ninguna`. `auto`: `luz` para capítulos, `zoom` para el cierre, `vuelo` entre dos `pantalla` seguidas; si no, rota |
| `clip` | `{src, inicio, fin}` | Recorte para `clips.py`; `src` absoluto o relativo a `video/`, tiempos en s |

## Tipos de escena

### `portada`
| Campo | Oblig. | Descripción |
|---|---|---|
| `titulo` | sí | Título grande (letras que emergen del desenfoque) |
| `subtitulo` | | Línea secundaria |
| `etiqueta` | | Píldora sobre el título |

### `capitulo`
Abre un capítulo: entra en la barra de progreso y crea la composición `Cap-NN`.
| Campo | Oblig. | Descripción |
|---|---|---|
| `titulo` | sí | |
| `numero` | | Por defecto, el orden del capítulo |
| `subtitulo` | | |

### `flujo`
Documentos como tarjetas 3D: llegan apiladas boca abajo, se voltean cuando se pronuncia su `clave` y un paquete de datos viaja por el enlace desde el documento anterior. El nodo activo se resalta y los anteriores reciben un sello.
| Campo | Oblig. | Descripción |
|---|---|---|
| `titulo` | | |
| `nodos[]` | sí | `{id, titulo, subtitulo?, icono?, codigo?, importe?, divisa?, t?/clave?}`; `codigo` = «PED-0142»; `importe` sale con contador animado |
| `enlaces[]` | | `{de, a, texto?}`; si falta, se encadenan en orden |

```json
{ "id": "circuito", "tipo": "flujo", "titulo": "Tres documentos, un mismo circuito",
  "nodos": [ { "id": "ped", "titulo": "Pedido", "icono": "pedido", "clave": "pedido", "codigo": "PED-0142", "importe": 31500 },
             { "id": "alb", "titulo": "Albarán", "icono": "albaran", "clave": "albarán" } ],
  "enlaces": [ { "de": "ped", "a": "alb", "texto": "entrega" } ] }
```

### `pantalla`
Clip real del ERP en un panel de navegador flotante en 3D. La cámara se inclina y hace dolly hasta cada `zoom`, con profundidad de campo (desenfoca lo que queda fuera). **Todas las coordenadas van en píxeles del vídeo original.**
| Campo | Oblig. | Descripción |
|---|---|---|
| `clip` | sí* | Recorte de origen (*o `video`) |
| `video` | | Fichero en `public/` (por defecto `clips/<id>.mp4`) |
| `titulo`, `url` | | Columna izquierda y barra de direcciones |
| `tamano` | | `{w,h}` del vídeo original (por defecto 1680×1048) |
| `recorte` | | `{x,y,w,h}`: parte del vídeo que se ve (p. ej. sin la barra del navegador antiguo ni la de Windows) |
| `clipDesde` | | s de escena en que arranca el clip (0.3); antes y después se congela |
| `velocidad` | | `playbackRate` del clip |
| `zooms[]` | | `{t?/clave?, rect?, dur? (1.4), giro? {x,y} en grados}`; sin `rect` la cámara vuelve al plano general |
| `callouts[]` | | `{t?/clave?, rect, texto, lado? derecha·izquierda·arriba·abajo, hasta? (s)}`: caja con brillo, conector y etiqueta; además aparece como paso numerado a la izquierda |
| `foco[]` | | `{t?/clave?, x, y}`: anillo pulsante que se desplaza entre puntos |

```json
{ "id": "menu-compras", "tipo": "pantalla", "titulo": "El menú de Compras",
  "clip": { "src": "../media/src/origen.mp4", "inicio": 122, "fin": 130 },
  "recorte": { "x": 0, "y": 84, "w": 1680, "h": 926 },
  "zooms": [ { "clave": "fíjate", "rect": { "x": 0, "y": 150, "w": 800, "h": 460 } } ],
  "callouts": [ { "clave": "Compras para", "rect": { "x": 14, "y": 270, "w": 362, "h": 30 }, "texto": "Módulo de Compras" } ] }
```

### `conceptos`
Tarjetas con icono que aparecen al pronunciarse su clave.
| Campo | Oblig. | Descripción |
|---|---|---|
| `titulo`, `subtitulo` | | |
| `items[]` | sí | `{titulo, texto?, icono?, t?/clave?}` (1–6 items) |
| `disposicion` | | `rejilla` (por defecto) o `lista` |

### `estructura`
Árbol jerárquico: raíz → ramas → hijos. Los conectores se dibujan y cada hijo se ilumina al nombrarlo.
| Campo | Oblig. | Descripción |
|---|---|---|
| `titulo` | | |
| `raiz` | sí | `{titulo, subtitulo?, icono?, t?/clave?}` |
| `ramas[]` | sí | `{titulo, icono?, t?/clave?, hijos: [{titulo, detalle?, t?/clave?}]}` (2–3 ramas, ≤ 5 hijos) |

Orden de sincronización: raíz, rama 1, sus hijos, rama 2, sus hijos…

### `tip` / `cuidado`
Tarjeta destacada con bombilla (ámbar) o alerta (coral).
| Campo | Oblig. | Descripción |
|---|---|---|
| `texto` | sí | |
| `titulo` | | |
| `etiqueta` | | Por defecto «Consejo» / «Cuidado» |

### `comparativa`
Dos columnas «Antes» / «Ahora» con una marca de diferencia en el centro.
| Campo | Oblig. | Descripción |
|---|---|---|
| `titulo` | | |
| `etiquetas` | | `{antes?, ahora?}` |
| `filas[]` | sí | `{aspecto?, antes, ahora, marca?, t?/clave?}`; `marca`: `mejora` (por defecto), `nuevo`, `igual`, `eliminado`, `cambio`; máx. ~5 filas |

### `resumen`
Checklist que se va marcando, con anillo de progreso. Recomendado al final de cada capítulo.
| Campo | Oblig. | Descripción |
|---|---|---|
| `titulo` | | Por defecto «En resumen» |
| `items[]` | sí | `{texto, t?/clave?}` (3–6) |

### `calculo`
Precio con contadores animados: base → pasos → resultado (p. ej. 35.000 → −10 % → 31.500).
| Campo | Oblig. | Descripción |
|---|---|---|
| `titulo` | | |
| `base` | sí | `{etiqueta, valor}` |
| `pasos[]` | sí | `{etiqueta, porcentaje? (negativo = descuento), importe?, t?/clave?}`; los porcentajes se aplican en cascada |
| `resultado` | | Etiqueta final (por defecto «Precio neto») |
| `divisa`, `decimales` | | `€`, 0 |

### `cierre`
| Campo | Oblig. | Descripción |
|---|---|---|
| `titulo` | sí | |
| `subtitulo` | | |
| `siguientes[]` | | Temas siguientes (píldoras) |

Termina con un fundido a negro.

## Iconos

`pedido` `albaran` `factura` `tarifa` `calendario` `devolucion` `rectificar` `cabecera` `lineas` `check` `bombilla` `alerta` `documento` `stock` `proveedor` `euro` `engranaje` `buscar` `rayo` `capas` `usuario` `reloj` `estrella` `flecha` `mas` `igual` `cruz` `arriba` `cambio` `pantalla`

## Comandos

```bash
# desde la carpeta base
tools/.venv/bin/python tools/voz.py            # solo regenera lo que cambió (--force, --solo id1,id2)
python3 tools/clips.py                         # --force
# desde video/
npx remotion studio                            # vista previa
npx remotion render Tutorial out/tutorial.mp4 --concurrency=6
npx remotion render Cap-01 out/cap01.mp4       # un capítulo (el 1.º incluye la portada; el último, el cierre)
node scripts/stills.mjs out/stills E-precio:9s Tutorial:1200 Cap-02:-30
```

`remotion.config.ts` usa el render por GPU (`angle`) y concurrencia 8: unas 3-4 veces más rápido que el software por defecto con las escenas 3D y los desenfoques (≈ 5-6 fps en un Mac M; un vídeo de 30 min tarda del orden de 2,5-3 h, por eso conviene renderizar por capítulos).

Composiciones: `Tutorial` (completo), `Cap-NN` (una por cada escena `capitulo`, con la barra de progreso global), `E-<id>` (una escena suelta) y `D-<id>` (galería de `src/data/demo.json`, sin voz). Si se concatenan los `Cap-NN` sale exactamente el `Tutorial`.

## Consejos de redacción

- Escenas de 10–40 s; mejor partir una idea larga en dos escenas que acelerar la voz.
- Un `resumen` breve al final de cada capítulo y una `pausa` cuando cambie el bloque.
- Escribe los números en cifras en la narración (`35.000 euros`, `10 por ciento`): la voz los lee bien y el subtítulo queda claro.
- Elige claves únicas y en el orden en que se dicen; si una palabra se repite, usa una frase («Compras para»).
