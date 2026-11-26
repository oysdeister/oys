---
name: navegar-erp-next
description: "Cómo moverse por el ERP Deister Axional VNext (menú, buscador Ctrl+K, rejilla y ficha, lupa de consulta, guardar, pestañas, botones de proceso, Docflow, campos obligatorios, ayuda por campo) y cómo automatizarlo con Chrome en el puerto 9333 + puppeteer (sesión iniciada a mano por el usuario, capturas 4K, pestañas propias). Incluye las convenciones de datos de prueba ({INI}, CAP) y cómo no romper el caso del curso. Úsala siempre que haya que abrir una pantalla del ERP, buscar un registro, sacar capturas, probar un paso en la demo o explicar a un junior cómo orientarse."
---

# Navegar el ERP nuevo (Axional VNext, nextdemo, base tutorial)

Entorno: `https://nextdemo.geasa.eu/view/app/tutorial/home/`, base **tutorial** («BBDD TUTORIAL» en la barra superior). Es una copia de prueba compartida por todos los alumnos. Bloque de la plataforma que lo enseña: `fundamentos-navegar` (`fundamentos.json`).

## Orientarse en 5 gestos (lo que enseña el curso)
1. **Reconocer la pantalla**: barra superior con botón de menú, «Manager», base de datos, buscador y usuario. Si no pone «BBDD TUTORIAL», no grabes nada y avisa.
2. **Menú lateral**: árbol de carpetas. Las rutas del curso se leen de izquierda a derecha: «Finanzas › Maestros › Parametrización › Empresas». La pantalla actual sale resaltada.
3. **Buscador**: «Buscar» o Ctrl+K (⌘K en Mac). Escribe una palabra corta y sin tildes; el resultado trae el nombre y el código técnico del objeto (`garticul`, `galmacen`, `gcomfach`…). Flechas + Intro.
4. **Rejilla → ficha**: casi todo abre una rejilla (una fila por registro, ~25 filas por página, no todas). El número azul/rojo de la izquierda abre la ficha. Arriba: «Todos» (qué registros ves), «Ordenar», «Filtros»; a la derecha: añadir, lupa, recargar. La lupa abre un formulario de consulta (p. ej. Empresa = DIS) y «Ejecutar consulta»; con un solo resultado abre la ficha directamente.
5. **Ficha**: pestañas por temas, campos con asterisco rojo = obligatorios (sin ellos no guarda), botones arriba a la derecha: añadir, guardar (disquete, solo activo si hay cambios), eliminar (papelera, pide confirmación), anterior/siguiente, buscar, recargar y ⋮ (más acciones).

Más detalle (cajas plegables, ayuda por campo, pantallas de variables, ventanas de alta, desplegables) en `references/interfaz.md`.

## Acceso directo por URL
`https://nextdemo.geasa.eu/view/app/tutorial/dispatch/<objeto>` abre la rejilla del objeto (`table/<objeto>/list/1`). Para un registro concreto, ábrelo desde la rejilla o con la lupa. Mapa de rutas y objetos de Compras: `../erp-next-compras/references/mapa_erp_nuevo.md`.

## Botones de proceso, estados y Docflow
Los documentos cambian de estado con botones: «Validar», «Pasar a provisional», «Contabilizar», «Descontabilizar», «Anular», y en el menú «Acciones» procesos como «Generar factura». Un tercero que se edita vuelve a Provisional: hay que volver a «Validar». **Docflow** (menú ⌄ junto a la estrella del título) dibuja la cadena de documentos origen/destino. El workflow tiene Gestionar, Autorizar y Retroceder como objetos aparte. No todas las opciones existen en todas las tipologías (p. ej. Conformar solo en FCCL).

## Automatizar con puppeteer (capturas y pruebas)
Reglas, porque el navegador integrado de Claude no sirve (≈800 px, sin `javascript_tool` en este proyecto):
1. Chrome aparte con depuración: `"/Applications/Google Chrome.app/Contents/MacOS/Google Chrome" --remote-debugging-port=9333 --user-data-dir=$HOME/.chrome-erp`.
2. **La sesión la inicia siempre el usuario a mano.** Claude nunca escribe una contraseña ni pide que se la pasen. Si ve la pantalla de login, para y lo dice.
3. `npm install` en `plugins/formacion-oys/scripts/` (package.json canónico, con lock; el de `navegar-erp-next/scripts/` es una copia, ver `references/automatizacion.md`) y conecta con `puppeteer.connect({ browserURL: 'http://127.0.0.1:9333', defaultViewport: null })`.
4. Viewport 1920×1080 con `deviceScaleFactor: 2` = capturas 3840×2160. La pestaña debe estar al frente (o con `Emulation.setFocusEmulationEnabled`): si no, Vuetify no pinta desplegables ni diálogos.
5. Con varios agentes en el mismo Chrome, cada uno usa **su pestaña** (`TAB=<nombre>`) y no hace `bringToFront` sobre las ajenas.
6. Detecta sesión caducada antes de fiarte de una captura: `url` no debe llevar a una página de login y el título/URL debe seguir en `/view/app/tutorial/`; en llamadas a la API, estados 0/302/303 indican sesión perdida (así lo trata `harvest.mjs`). Detalle en `references/automatizacion.md`.

Scripts y su uso: `references/automatizacion.md` (erp.mjs, erp2.mjs, menushot.mjs, kb.mjs, kb_pick.mjs, up_csv.mjs, dbg_conexion.mjs; y `plugins/formacion-oys/scripts/capturas_erp2.mjs` y `harvest.mjs`). Capturas → WebP y hotspots: skill `capturas-y-puntos`.

## Datos de prueba y cómo no romper el caso del curso
- La demo es compartida y los datos son falsos: no difuminar ni tapar campos.
- Los registros del alumno llevan sus iniciales `{INI}` (siempre 2 letras) según `_fuente/CODIGOS_ALUMNO.md`: `C{INI}` cliente, `T{INI}` proveedor, `ROD{INI}` artículo, `S{INI}` empresa, `P{INI}`, `R{INI}`… Lista completa en `../erp-next-maestros/references/codigos_alumno_maestros.md`.
- Para capturas y pruebas del autor se usan registros **propios** con prefijo `CAP` (CAPC, CAPV, CAPK, TCAPC, TCAPV, TCAPK, CAPF, CAPW…). Se crean, se anotan en un fichero de entrega y **no se borra nada que no hayas creado tú**.
- No modifiques registros del caso que usan otros bloques: el artículo `13500620` (tipo contable PRODUCTO), la empresa 0, el proveedor 00001, las tipologías de la demo (PC, ACPC, FCOA, FCCL, FV…), el plan ES. Si un paso pide cambiar algo compartido, crea una copia propia («Nuevo como»).
- Para ver una pantalla sin grabar: navega, abre el diálogo y sal con «Cancelar». Graba solo en registros propios.
- Uso de iniciales de prueba `ZZ`: aparecen en los datos del curso solo en (1) el fichero N43 del caso `app/public/n43/caso_BBVA_ZZ.n43` y sus referencias (`TZZ`, `PROV-ZZ-001`, `CZZ`, `LRCZZ`), que el alumno descarga y cambia por sus iniciales, y (2) la prueba de Activos con `ZZORD`, comprobada en la demo (`CODIGOS_ALUMNO.md`). En los scripts y notas de navegación no hay registros ZZ.
- IBAN de ejemplo (`ES9121000418450200051332`), NIF de prueba (B12345674, B76543214): nunca datos reales.

## Trampas conocidas de la demo
Resumen; lista completa con causa y arreglo en `references/trampas_demo.md`: sesión caducada, desplegable de Familia sin opciones (teclear el código y Tab), ventana de asiento tras Contabilizar que solo carga la primera vez, listas en caché, importar CSV de líneas de pedido (delimitador `;`, `dtoimp` 0), «Prevista» que se marca con el input, errores de descuentos vacíos (`n is null`), series sin máscara, pantallas de solo consulta sin botón de alta.

## Cuándo leer qué
- Orientación, ayudas, desplegables, cajas: `references/interfaz.md`.
- Scripts y recetas puppeteer: `references/automatizacion.md`.
- Algo falla en la demo: `references/trampas_demo.md`.
