# BRIEF v2 — vídeo «Compras en Deister Axional VNext» para principiantes

BASE = la carpeta que contiene `nueva/` (la carpeta de trabajo). Todas las rutas son relativas a `BASE/nueva/`.
Lee primero `v2/criterios.md`: es la lista de comprobación que se usará para aprobar o rechazar tu trabajo.

## Qué ha pedido el usuario
Rehacer el vídeo de compras para **usuarios finales principiantes** (no saben de ERP, compras, finanzas ni contabilidad):
- Nada de comparar con otra versión. Nada de «aplicar cambios». El producto se llama «Deister Axional VNext».
- Al inicio, un overview del módulo de compras y un recorrido por el menú, bloque a bloque.
- El ciclo puede empezar en una oferta o en un concurso/licitación; hoy se cubre el ciclo con un proveedor habitual o nuevo.
- Todo concepto técnico se explica en lenguaje llano.
- Muy despacio, para que el usuario lo vaya haciendo en su pantalla a la vez. Navegación grabada en vivo (cursor, clics, escritura), no capturas fijas.
- Circuito completo y real en la base `tutorial`: proveedor, lista de precios, pedido, albarán, factura y contabilización.

## Reglas
- ERP: https://nextdemo.geasa.eu, base de datos **tutorial**. Solo esa base. La sesión la inicia Sergi; **nunca escribas credenciales**. Si ves la página de login, espera (comprueba cada 2 min hasta 60 min) y avanza mientras con la documentación.
- En `tutorial` puedes leer todo y crear o configurar lo necesario para el circuito (proveedor, línea de precios, tipo de albarán del tipo de pedido, cuenta de IVA, pedidos y documentos de prueba). No borres nada que no hayas creado tú. Anota todo lo que crees o configures en `v2/datos.md` (sección de tu capítulo).
- Navegador: Chrome aparte en el puerto 9333, manejado con `tools/erp2.mjs` **siempre con tu propia pestaña**: `TAB=<tu-nombre> node tools/erp2.mjs <cmd> …` (ver cabecera del fichero: goto, fields, buttons, clicktext, focus, type, key, pick, menu, msgs, text, shot, rect, eval…). No uses `tools/erp.mjs`, no cierres ni navegues pestañas ajenas, no llames a bringToFront. Las capturas de `shot` van a `hd/`; usa nombres con prefijo `v2_<cap>_`.
- Escribe solo en `v2/` (y en `hd/v2_*`). No toques `video/`, `out/` ni nada de la v1.
- Español de España, frases cortas, tú al usuario («pulsa», «verás»). Nada de jerga sin explicar.

## Documentación existente (léela antes de ir al ERP)
- `mapa_erp_nuevo.md` (rutas de menú y objetos), `notas_tarifas.md`, `notas_tipos_documento.md`, `notas_circuito.md`, `circuito_creado.md` (qué se creó en v1, errores encontrados y por qué), `hd/INDICE.md` (capturas 4K con rects).
- Skill `formacion-oys:erp-next-compras` (conocimiento funcional del ERP nuevo y de las capturas con puppeteer).
- Guion v1 como referencia de contenido (NO de enfoque): `video/scripts/gen_guion.py`. Formato de escenas: `video/GUION_FORMATO.md`.

## Hechos clave ya conocidos
- Empresa **0** (Deister Software), delegación **CENTRAL**, departamento COMPRAS, almacén **0**: valores por defecto del usuario. La empresa DIS no tiene almacén propio: no usarla.
- Artículo con cuentas contables: **13500620** (rodamiento 6000-2RS, tipo contable PROD). Los de tipo VEN dan «cuenta no definida».
- Precios: lista **COM** dentro del grupo de precios **00001 PROVEEDOR**; el proveedor apunta al grupo en su pestaña Tarifas. En la línea del documento el precio no se propone solo en la demo: confirmar por qué (¿falta línea vigente, grupo, fechas?) y, si se puede, configurarlo para que salga solo.
- Pedido (`gcompedh`): en v1 el alta daba número 0 y no dejaba añadir líneas; el tipo de pedido no tenía «Tipo de albarán» (caja Logística), por eso «Generar albaranes» (`gcompedh_gen_gcomalbh`) no encontraba pedidos. Hay que resolverlo con configuración en tutorial.
- Factura: se genera desde el albarán con Acciones › Generar factura (tipo FCOA). La cuenta de IVA soportado de la empresa no está definida (el IVA sale a 00000.00000): configurarla si es posible.
- Docflow (`gdocflowh`): grafo pedido → suministro (albarán) → factura.

## Datos del circuito (propuesta; el agente de maestros la confirma en `v2/datos.md`)
- Proveedor **nuevo** creado en el vídeo, p. ej. «Rodamientos del Norte, S.L.» (NIF de prueba válido), con grupo de precios 00001.
- Artículo 13500620, 10 unidades a 4,00 € → base imponible 40,00 €, IVA 21 % 8,40 €, total 48,40 €.

## Capítulos y responsables
| Cap | Título provisional | Agente |
|---|---|---|
| 1 | Bienvenida: qué es el módulo de compras y su menú (ciclo, oferta, concurso) | overview |
| 2 | Los maestros: el proveedor y el artículo | maestros |
| 3 | Los precios: listas y grupos de precios | maestros |
| 4 | Cómo se numeran los documentos: tipos, numerador y series | configuracion |
| 5 | El pedido de compra | pedido |
| 6 | El albarán: recibir la mercancía | albaran |
| 7 | La factura del proveedor | factura |
| 8 | Contabilizar: qué es un asiento y cómo se genera | factura |
| 9 | Docflow: seguir el rastro de una compra | configuracion |
| 10 | Resumen y cierre | overview |

## Entregable de cada especialista: `v2/capNN.json` (uno por capítulo) + notas en `v2/capNN.md`
```json
{ "cap": 5, "titulo": "El pedido de compra", "subtitulo": "…",
  "escenas": [
    { "id": "c5-intro", "tipo": "conceptos", "narracion": "…", "...": "campos según video/GUION_FORMATO.md" },
    { "id": "c5-nuevo", "tipo": "pantalla", "titulo": "Crea el pedido",
      "narracion": "Arriba a la derecha está el botón Nuevo. Púlsalo. …",
      "acciones": [
        { "a": "goto", "url": "gcompedh" },
        { "a": "pausa", "ms": 1500 },
        { "a": "click", "texto": "Nuevo", "clave": "Nuevo" },
        { "a": "type", "campo": "Proveedor", "texto": "00001", "clave": "proveedor" },
        { "a": "pick", "texto": "00001 Rodamientos del Norte, S.L." },
        { "a": "resalta", "campo": "Fecha", "ms": 2500, "clave": "fecha" },
        { "a": "click", "texto": "Guardar", "clave": "Guardar" },
        { "a": "espera", "texto": "Pendiente" },
        { "a": "pausa", "ms": 2000 }
      ] }
  ] }
```
Acciones disponibles (el grabador `tools/rec.mjs` las ejecutará a ritmo humano, con cursor visible): `goto {url|objeto}`, `menu {ruta:[...]}` (navegar por el menú lateral), `click {texto|sel|campo|xy}`, `dblclick`, `type {campo|sel, texto, enter?}`, `pick {texto}` (opción de desplegable), `key {tecla, veces?}`, `scroll {sel?, dy}`, `resalta {campo|texto|sel, ms}`, `pausa {ms}`, `espera {texto|sel}`, `tab {texto}` (pestaña del formulario). `clave` = palabra de la narración en la que debe ocurrir esa acción (sirve para sincronizar voz, zoom y resaltado).

Reglas del guion:
- Cada escena `pantalla` = un paso completo y continuo (≈ 15–45 s de voz). La narración dice dónde está cada cosa antes de pulsarla y confirma el resultado después.
- Antes de los pasos de pantalla, una escena de concepto (`conceptos`, `flujo`, `estructura`, `calculo` o `tip`) explica en llano lo que se va a hacer y por qué.
- Cierra cada capítulo con `resumen` («Qué has hecho») y, si procede, un `tip` «Comprueba que…».
- **Valida las acciones en el ERP**: ejecútalas tú con `erp2.mjs` en tu pestaña (cuando el capítulo crea datos, créalos de verdad como prueba y anótalo) y comprueba que los textos, etiquetas de campo y botones existen exactamente así. Guarda capturas de referencia `hd/v2_capNN_*.png`.
- Revisor: lanza un subagente revisor (Agent, model sonnet) que compruebe en el ERP (solo lectura) cada paso, campo y explicación de tu capítulo y que sea apto para principiantes y cumpla `v2/criterios.md`. Corrige lo que señale.
- Devuelve al terminar un resumen de ≤ 15 líneas: ficheros entregados, escenas y duración estimada (palabras/2), datos creados, problemas sin resolver.

---
## ACTUALIZACIÓN (sesión v2, manda sobre lo anterior)
- Tú **no grabas**. Escribe y valida el guion y las acciones. La grabación la hace después, en serie, `node v2/tools/rec.mjs v2/capNN.json [--solo id1,id2]` en la pestaña principal (viewport 1600×900 CSS a 2×, cursor visible, clics con onda, tecleo a 140 ms/tecla). Cada escena `pantalla` con `acciones` se graba como `v2/rec/<id>.webm` + `<id>.json` (eventos con su `clave` y rect).
- Para validar en el ERP usa **siempre tu pestaña**: `TAB=<tu-nombre> node nueva/tools/erp2.mjs …` (ejecutado desde BASE; cada agente tiene su nombre). Nunca la pestaña principal ni bringToFront. Si un desplegable no se pinta con la pestaña en segundo plano, anótalo y sigue.
- Formato de acciones aceptado por rec.mjs (campo `a`): `goto {url}` · `click {texto|campo|sel|fila, n?, espera?}` · `dblclick` · `move` · `type {campo?|sel?, texto, enter?, limpiar?}` (si lleva campo, hace clic, selecciona todo y teclea) · `pick {texto}` (fila del desplegable abierto que CONTIENE el texto) · `key {tecla: "Enter"|"Tab"|"Escape"…, veces?}` · `scroll {dy, sel?}` · `resalta {texto|campo|sel, ms, etiqueta?}` (lleva el cursor y deja un resaltado; usar mucho) · `pausa {ms}` · `espera {texto, ms?}` · `tab {texto}` (pestaña del formulario) · `marca {id, texto?|campo?}`. `texto` = texto visible EXACTO del elemento; `campo` = etiqueta exacta del campo (sin asterisco). Prohibido `xy`.
- `"prep": true` en una acción = se ejecuta antes de empezar a grabar (p. ej. el `goto` inicial o abrir el registro), no sale en el vídeo.
- Ritmo: entre acción y acción pon `pausa` de 1500–3000 ms; tras cada guardado o pantalla nueva, 3000 ms. Cada acción importante lleva `clave` = palabra de su narración (la que se dice justo cuando ocurre). La narración describe primero dónde está lo que se va a pulsar («arriba a la derecha, el botón azul Nuevo») y luego confirma el resultado.
- Nada de escenas `comparativa`. Nada de «antes / ahora», «versión anterior», «ha cambiado», «Axional Deister».
- **Datos fijos del circuito** (todos los capítulos los usan igual): empresa 0 · delegación CENTRAL · departamento COMPRAS · almacén 0 · proveedor nuevo **código 00010 «Rodamientos del Norte, S.L.»** (lo crea el capítulo 2 en la grabación; el agente de maestros elige un NIF de prueba válido y lo anota en `v2/datos.md`) · grupo de precios **00001** · lista **COM** · artículo **13500620** (rodamiento 6000-2RS) · **10 unidades a 4,00 €** → base 40,00 €, IVA 21 % 8,40 €, total 48,40 €. Si al validar un dato no funciona, anota la alternativa en `v2/datos.md` y avisa en tu resumen.
- Si para validar necesitas crear datos de prueba, usa códigos de prueba (proveedor `T` + tu capítulo, referencias «PRUEBA») y bórralos o anúlalos al terminar; anótalo en `v2/datos.md`. Lo que sea **configuración necesaria** para el circuito (tipo de albarán del tipo de pedido, cuenta de IVA, precio automático, formulario de líneas del pedido…) déjalo hecho de verdad y documentado en `v2/datos.md`.
- Revisor: lanza un subagente (Agent, model "sonnet") que compruebe en el ERP con su propia pestaña (`TAB=<tu-nombre>-rev`), solo lectura, cada paso, rótulo y explicación, y que sea apto para principiantes según `v2/criterios.md`. Corrige lo que señale.
