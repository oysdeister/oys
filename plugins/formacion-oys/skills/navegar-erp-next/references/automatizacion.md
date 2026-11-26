# Automatizar el ERP con Chrome + puppeteer

## Índice
1. Preparación
2. Sesión: inicio y caducidad
3. Scripts de `scripts/` (esta skill)
4. Scripts de `plugins/formacion-oys/scripts/`
5. Herramientas de `nueva/tools/` (fuera del repo)
6. Recetas
7. Capturas 4K

## 1. Preparación
1. Chrome con depuración en el puerto 9333 y perfil propio:
   `"/Applications/Google Chrome.app/Contents/MacOS/Google Chrome" --remote-debugging-port=9333 --user-data-dir=$HOME/.chrome-erp`
2. El usuario abre `https://nextdemo.geasa.eu/view/app/tutorial/home/` e inicia sesión **él mismo**.
3. Dependencias: `puppeteer-core ^23.11.1`. **Hay dos `package.json` con la misma dependencia**: el canónico es `plugins/formacion-oys/scripts/package.json` (con `package-lock.json`; ahí viven `capturas_erp2.mjs` y `harvest.mjs`, `npm install` en esa carpeta); el de `skills/navegar-erp-next/scripts/` es solo una copia para que los scripts de esta skill (`erp.mjs`, `erp2.mjs`…) se ejecuten por separado (`cd` a esa carpeta y `npm install`). Si ya tienes `node_modules` en la canónica, no hace falta instalar en la otra: copia el script a la canónica o usa `NODE_PATH=<ruta>/plugins/formacion-oys/scripts/node_modules`. No edites uno sin editar el otro.
4. Conexión: `puppeteer.connect({ browserURL: 'http://127.0.0.1:9333', defaultViewport: null })`. Al terminar, `browser.disconnect()` (no `close()`: cerraría el Chrome del usuario).

## 2. Sesión: inicio y caducidad
- Nunca escribas contraseñas ni las pidas por el chat. Si aparece el login, para y avisa al usuario (los briefs de las sesiones lo exigen: «si ves login, para y avisa»).
- Detección **verificada en el código**: solo `plugins/formacion-oys/scripts/harvest.mjs` la implementa. Sus llamadas a la API con `redirect: 'manual'` tratan los estados 0, 302 y 303 como sesión perdida, escriben `SESION_CADUCADA` en la carpeta de salida y salen con código 5. También reintenta con espera en 503, 429, -1 y -2 y en «maximum allowed concurrent» (500).
- Detección **recomendada (sin verificar en la demo)**: tras `goto`, comprueba con `erp2.mjs url` que la URL sigue en `/view/app/tutorial/` y que el título no es el del login; si una captura sale con un formulario de acceso, descártala.
- Una pestaña oculta o sin foco hace que no se pinten desplegables ni diálogos: `erp2.mjs` ya llama a `bringToFront` y a `Emulation.setFocusEmulationEnabled`.

## 3. Scripts de `scripts/` (esta skill)
Todos conectan al puerto 9333, toman la última pestaña de `nextdemo.geasa.eu` y fijan 1920×1080 @2x. Las capturas van a `../hd/` (se crea) salvo que se indique otra cosa. Ajusta `BASE` si cambias de base (`/view/app/<base>/dispatch/`).

| Script | Para qué | Comandos / uso |
|---|---|---|
| `erp.mjs` | CLI mínima | `goto <url\|objeto>`, `shot <NN_nombre> [sel]`, `click "<texto>"`, `clickrow <n>`, `tab "<texto>"`, `eval "<js>"`, `url`. Clics por JS (no siempre sirven con Vuetify). |
| `erp2.mjs` | CLI principal, eventos reales de ratón/teclado | `goto`, `url`, `shot`, `eval`, `clickxy x y`, `dblxy`, `hover`, `clicksel "<css>" [n]`, `clicktext "<texto exacto>" [n] [ms]`, `type`, `key <Tecla> [veces]` (combinaciones con «+», p. ej. `Control+KeyK`, sin verificar), `selall`, `sleep`, `rect`, `fields`, `buttons`, `focus "<etiqueta>"`, `msgs`, `menu`, `pick "<texto>"`, `menutext`, `text <inicio> <longitud>`. Se encadenan con `;;`. Variables: `TMO` (timeout ms, 90000), `PAGE` (filtra pestaña por URL, p. ej. `dbstudio`). |
| `menushot.mjs` | Abre un menú (por texto, `sel` o `xy`) y captura sin elegir opción | `node menushot.mjs "<texto>" <nombre> [sel\|xy]`; `MOUSE=1`, `HOVER=1`, `WAIT=ms`. Pulsa Escape al acabar. |
| `kb.mjs` | Teclado real para filtros de consulta | `type "<etiqueta>" "<texto>"`, `key <Tecla>`, `eval`, `clickxy x y` |
| `kb_pick.mjs` | Abre un desplegable por etiqueta y elige la opción que empieza por un texto | `node kb_pick.mjs "<etiqueta>" "<opción>"`; `PICKSHOT=<ruta>` guarda captura |
| `up_csv.mjs` | Sube un CSV al `input[type=file]` del asistente Importar | `node up_csv.mjs <fichero.csv> <registro_tabs.json>` (lee el id de la pestaña `pedido2` del registro; adapta el nombre) |
| `dbg_conexion.mjs` | Diagnóstico: conecta a una pestaña concreta (`TABID=<targetId>`), pinta título, sesión CDP y viewport | para saber si Chrome responde |

Salida de `fields`: `Etiqueta = valor @x,y,w,h` con flags `ERR` (campo en error) y `RO` (solo lectura). `buttons`: `texto @x,y,w,h [DIS]`. Coordenadas en px CSS 1920×1080; para hotspots dividir entre 19,2 y 10,8 (ver `capturas-y-puntos`).

## 4. Scripts de `plugins/formacion-oys/scripts/`
- `capturas_erp2.mjs`: versión actual de `erp2.mjs` con `SHOTDIR=<carpeta>` (salida) y `TAB=<nombre>` (pestaña propia por agente, registrada en `.tabs.json` junto al script, creada con `Target.createTarget`). Es el que usa `capturas-y-puntos`. Prefiérelo cuando trabajen varios agentes.
- `harvest.mjs <codes.txt> [conc]`: recoge el catálogo de pantallas por la API (listado, formulario de alta vacío, fila 1, botones con campos, subrejillas) y lo guarda comprimido en `CAP_DIR` (por defecto `~/.cache/oys-demo-cap/cat`). **Cuidado**: abre un formulario de alta y, si hay filas, la ficha 1; al final envía una petición DELETE sobre ese formulario (sin verificar si solo cierra la edición o puede borrar la fila: revisa el código antes de lanzarlo). Lanzarlo solo en la base de pruebas y con concurrencia baja. Necesita `index_prev.json` en la carpeta de salida. Es el único con detección de sesión caducada (ver 2). No se copia a esta skill porque depende de la API interna (CSRF `window.__CSRF__`, cabecera `r-uuid`).

## 5. Herramientas de `nueva/tools/` (repo principal, fuera del plugin)
- `dbg6.mjs` → copiado como `dbg_conexion.mjs` (genérico).
- `up_csv.mjs` → copiado (genérico, con el nombre de pestaña `pedido2` en el registro).
- `imp.sh <fichero.csv>`: repite el asistente de Importar de «Líneas de pedidos» (`gcompedl`): `goto gcompedl`, abre ⋮ (clic 1886,84), «Importar», sube el CSV con `up_csv.mjs`, y recorre Siguiente → Siguiente → Acabar, con delimitador `;`. **No se copia**: depende de `erp2_ov.mjs`, de coordenadas fijas del diálogo y de la pestaña `pedido2`. Úsalo como plantilla.
- `kb_pick.mjs` idéntico al de esta skill; `clips.py` es de vídeo (ver `video-motor-remotion`).

## 6. Recetas
- Abrir una pantalla y ver su estructura: `node erp2.mjs goto gcomfach ';;' fields ';;' buttons`.
- Buscar un registro: `clickxy` en la lupa (esquina superior derecha), `focus "Empresa"` + `type DIS`, `clicktext "Ejecutar consulta"`.
- Elegir en un desplegable: `focus "<etiqueta>"` → `type <código>` → `pick "<texto de la fila>"` (o `kb_pick.mjs`).
- Ver un mensaje de error: `msgs` tras el clic; hazlo antes de la captura.
- Salir sin grabar: `clicktext Cancelar`.
- Un diálogo vacío casi siempre es pestaña sin foco: repite.

## 7. Capturas 4K
`shot <nombre>` (PNG 3840×2160). Después WebP 1920×1080 q82 con `cwebp` y hotspots, en `capturas-y-puntos`. Cada captura: ruta, objeto y rects de los callouts en un índice (ejemplo: `../../erp-next-compras/references/indice_capturas_hd.md`). Para vídeo se graba a 1600×900 con tema claro (`video-motor-remotion`).
