# Brief de montaje final (vídeos de finanzas → plataforma)

S = /private/tmp/claude-502/-Users-sergi-baulies-Downloads-practica-axional-oys--claude-worktrees-videos-icon-748154/bdc464cd-4a77-4602-bba7-98e3dab0a329/scratchpad
W = /Users/sergi.baulies/Downloads/practica-axional-oys/.claude/worktrees/videos-icon-748154 (rama claude/videos-icon-748154; NO push)
Entradas por vídeo en S/analisis/<id>.{ejercicios,capitulos,momentos,crop}.json (copia en W/_fuente/videos-icon/).
Ids de vídeo: icon1, icon11, icon2, maestros, tax-intro, tax-tablas, cobros, asientos.
Script base: S/ensamblar.py (corta clips con recorte/tapado/difuminado, pósters, genera content/<módulo>.json y content/video-icon.ts). Adáptalo a lo de abajo.
Infra ya hecha: content/videoSeries.ts (SERIES, momentosDe*, seriesDeModulo), MomentoVideo.serie, CapitulosSerie, ReproductorModal con serie. Lee esos ficheros antes de tocar nada.

## Reglas de Sergi (obligatorias)
1. NADA visible al alumno puede llamarse «ICON» (ni módulos, ni títulos, ni series, ni botones). ICON es la fuente, no el tema. Organiza por TEMA funcional.
2. Sin repetir contenido: ni entre vídeos, ni con módulos existentes (maestros, parametrizacion, compras, ventas, asientos, carteras), ni con la sesión icon-docs (sus módulos icon-parametrizacion, icon-contabilidad, icon-cartera, icon-tesoreria, icon-impuestos, icon-activos y ejercicios carteras-icon-N / parametrizacion-icon-N; su lista en «/Users/sergi.baulies/Library/Application Support/Claude/side-session-notes/local_3a429acd-3ea5-467e-807a-1de5d7a4aa19/icon-estado.md» si existe). Reparto: nosotros = TRANSACCIONES vistas en vídeo con su capítulo; icon-docs = conceptos y parametrización.
3. Privacidad: repo público. Ninguna captura ni clip con caras, tira de participantes, nombres de personas, correos, teléfonos, IBAN ni nombres de clientes reales («Quirón», «Clínica Ricardo Palma», «QA Quiron…», «Administradora Clínica Ricardo Palma», «C. Ricardo Palma», proveedores reales). Empresas de demo (Jewel S.A.C., VIVA OFFICE…) pueden quedar.
4. Español de España, tuteo, frases cortas, sin comparar con la versión antigua. Diseño espectacular, marca O&S (guía W/_fuente/DISENO_V3.md).

## Reparto por módulo (destino)
- `facturacion` (NUEVO, «Facturación en Finanzas»): de icon1 los ejercicios de contabilizar factura de gestión, facturas directas FC/FB y rectificativa vs sustitutiva; de icon11 el de contabilizar factura de compra y cartera (FUSIÓNALO con el de icon1 si repiten) y la parte de «cuando no contabiliza» (errores de contabilización: importe 0, periodo cerrado).
- `cobros-pagos` (NUEVO, «Cobros, pagos y remesas»): los 5 de cobros; la remesa de icon1; de icon11 tipos de remesa, crear remesa, evolucionar remesa y la parte «cuando no remesa» (domiciliación no informada, cheque vs TF); los 4 de icon2 (extracto, conciliación, cobro). Fusiona los que repitan (p. ej. remesa de icon1 vs icon11).
- `impuestos` (NUEVO, «Impuestos»): ejercicios de tax-tablas. tax-intro = SOLO serie de vídeo (capítulos) en este módulo, sin ejercicios (es teoría con normativa de Perú; los conceptos los pone icon-docs).
- `activos-fijos` (NUEVO, «Activos fijos»): los 6 de asientos (tipología → contabilización, generación de inmovilizado, ficha de activo, componentes, bienes y grupos).
- `maestros.json` (EXISTENTE): añade al final los ejercicios del vídeo maestros que no repitan lo que ya hay, y el de icon1 «alta de empresa, ejercicio y banco propio». Renumera solo los añadidos (numero continúa). No cambies los ejercicios existentes salvo para enriquecerlos (añadir problemas típicos o momento de vídeo) si el vídeo cubre lo mismo.
- No crees módulos con otros nombres. Ids de ejercicio: `<módulo>-v-<n>` (p. ej. `facturacion-v-1`, `maestros-v-1`), secciones `<id ejercicio>-<slug>`; actualiza a la vez las claves de momentos.

## Imágenes
`imgSrc(modulo, fichero)` = public/img/<módulo>/<fichero>. Mueve (git mv) cada captura al directorio del módulo destino con nombre `<vídeo>-NNN.jpg`; en `maestros` usa `video-maestros-NNN.jpg` y `video-icon1-NNN.jpg` (ya existen maestros-NNN). Actualiza los `imagen`. Borra los directorios viejos (finanzas-icon, maestros-contables, asientos-gestion) y las capturas no referenciadas. ANTES, mira cada captura (Read) buscando datos de rule 3; si hay, tápalos con ffmpeg drawbox o descártala.

## Series de vídeo (sin «ICON»)
Ids `fin-<vídeo>`; títulos: icon1 «Sesión de finanzas 1: de la factura a la remesa», icon11 «Sesión de finanzas 2: remesas paso a paso», icon2 «Sesión de finanzas 3: extracto y conciliación», maestros «Maestros contables», tax-intro «Impuestos: conceptos básicos», tax-tablas «Impuestos: tablas maestras», cobros «Cartera de cobros y pagos», asientos «Contabilización y activos fijos»; `corto` de 1-2 palabras; `intro` de una frase. `modulos`: la serie se muestra en los módulos destino de sus ejercicios (icon1 en facturacion y cobros-pagos; icon11 en cobros-pagos y facturacion; icon2 en cobros-pagos; maestros en maestros; tax-* en impuestos; cobros en cobros-pagos; asientos en activos-fijos). Renombra content/video-icon.ts → content/video-finanzas.ts (y exports SERIES_FIN…). Release: `video-finanzas-v1`, clips `<vídeo>-capNN.mp4`. `url` vacía hasta que Sergi apruebe la subida (lista S/publicados.txt). Pósters en public/video/finanzas/.

## Clips
Corta todos con ensamblar.py --clips (recorte + tapado + difuminado de crop.json) a S/clips/. Después revisión de privacidad: por cada clip extrae 1 fotograma cada 10 s, monta hojas de contacto (ffmpeg tile) y míralas; si algo de la regla 3 se ve, ajusta crop.json y vuelve a cortar ese clip. Conocidos: icon2 hacia 465 s y 1140-1190 s webcams; cobros 953-1366 difuminado; nombres de cliente en asientos.

## Registro en la app
- content/index.ts: ORDEN y META (nuevos: facturacion, cobros-pagos, impuestos, activos-fijos; colores distintos y armoniosos; iconos de Icon.tsx: 'finanzas', 'cobro', 'impuesto' ya existen; añade 'activo'). Orden pedagógico sugerido: maestros, parametrizacion, compras, ventas, facturacion, asientos, carteras, cobros-pagos, impuestos, activos-fijos.
- lib/examen.ts: META_CORTO y ORDEN_MOD con los nuevos.
- Cabecera de cada módulo nuevo: titulo, resumen (2-3 frases), circuito (4-6 pasos), sesion "".
- Busca otros sitios con listas fijas de módulos (`grep -rn "'carteras'" app/src`) y añade los nuevos.

## Delegación
Redacción voluminosa (fusionar ejercicios repetidos, resúmenes, preguntas nuevas) con el MCP orquestador `delegar` (task write, deepseek-v4-pro; ficheros por ruta en `files`, `out` a disco). Tú revisas. Muestra el pie de gasto. Si DeepSeek da error de saldo, para y dilo.

## Cierre
`cd W/app && npx tsc -b && npm run build` limpios. Commit en la rama (sin clips .mp4, sin SRT). Devuelve: módulos con su lista de ejercicios (id + título), nº de capturas por módulo, clips cortados (S/clips, tamaño total), dudas de privacidad pendientes y coste DeepSeek.
