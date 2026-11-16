# Brief común para quien construya partes de la app

Proyecto: `/Users/sergi.baulies/Downloads/practica-axional-oys/app` (Vite + React 19 + TypeScript + framer-motion 14 + react-router-dom 7 con HashRouter + canvas-confetti). Plataforma de práctica de Deister Axional (ERP) para consultores junior de O&S Consultores, que no tienen Claude. Se abre con un enlace en cualquier navegador y en el móvil.

## Ya existe (léelo antes de escribir, no lo reescribas salvo para añadir lo imprescindible)
- `src/types.ts` — Modulo, Ejercicio, Seccion, Paso (imagen + hotspot en % x,y,w,h + etiqueta), Pregunta.
- `src/content/index.ts` — MODULOS, getModulo, getEjercicio, todosEjercicios, imgSrc(modulo, fichero), META (color/icono por módulo). Los JSON en `src/content/*.json` (compras, ventas, asientos, parametrizacion, carteras; maestros llegará después con el mismo esquema). Cada módulo tiene `datosSimulador` libre.
- `src/lib/progress.ts` — useProgreso(), acciones (setAlumno, marcarPaso, terminarGuiado, notaTest, toggleDemo, simSuperado, reiniciar, exportar, importar), ejercicioCompletado, avanceEjercicio, APROBADO=0.8. Progreso en localStorage con try/catch; `src/lib/sync.ts` es el punto de conexión a backend.
- `src/lib/texto.ts` — conIni(texto, ini) sustituye {INI}; euro, num2, redondea.
- `src/lib/avance.ts`, `src/lib/badges.ts` (INSIGNIAS, ids de sims: asiento, numerador, circuito, docflow, factura), `src/lib/config.ts` (VIDEO_URL, CAPITULOS_VIDEO, VIDEO_POR_EJERCICIO, urlCapitulo, mmss).
- `src/components/Icon.tsx` — `<Icon name=…/>` (maestros, engranaje, compras, ventas, asiento, cartera, inicio, taller, logros, examen, sol, luna, check, flecha, atras, play, grip, reloj, cerebro, aviso, video) y `<Medal color on label/>`.
- `src/App.tsx` — rutas: `/` Home, `/modulo/:id` ModulePage, `/ejercicio/:id` ExercisePage, `/taller` y `/taller/:sim` Taller, `/logros` Logros, `/examen` Examen, `/certificado` Certificado, `/examinador` Examinador. Cada página es `src/pages/<Nombre>.tsx` con `export default`.
- `src/styles.css` — sistema visual completo. Clases: wrap, sheet, pad, btn (ghost, arc, sm), chip (ok, warn), callout (why, problema, solucion, nota), menu-path, fields, player, shot, shot-frame, hotspot (live), hotspot-tag, miss, step-card, step-count, dots, quiz-opt (right, wrong, letter), check/box, badges/badge/medal, tabs/tab/tab-pill, route/route-item/route-num, circuit, orbit/station…, mod-grid/mod-card/arcdeco, hero/hero-grid/lead, ledger, balance/pan, token, mask-slot, reorder-item, exam-hero, timer, sim-grid, meter. Variables: --ink, --ink-2, --ink-3, --paper, --sheet, --line, --arc, --arc-deep, --arc-soft, --signal, --signal-soft, --error, --error-soft, --display, --text, --r-s/m/l, --shadow. Tema oscuro con `:root[data-theme='dark']`. Añade CSS nuevo en un fichero propio importado desde tu página (p. ej. `src/pages/examen.css`), no edites styles.css.

## Dirección de diseño (cúmplela)
- Marca O&S: tinta navy #1f2738 y el arco turquesa #4fbfa5 del logo (`public/brand/oys_logo.png`, versión para fondo oscuro `oys_logo_light.png`). El arco del logo es el motivo recurrente: órbitas, recorridos, sellos. Ámbar (--signal) solo para «haz clic aquí».
- Tipos: Bricolage Grotesque (titulares, se puede usar `font-variation-settings: 'wdth' 75`) e Instrument Sans (texto), cifras tabulares.
- Movimiento con framer-motion: un momento orquestado por pantalla y respuestas a las acciones del usuario (abrir, acertar, fallar, completar). 3D ligero con perspective/rotateX/rotateY. Respeta prefers-reduced-motion (`useReducedMotion`).
- Nada de etiquetas en mayúsculas sobre cada título, ni «→» al final de los botones, ni tarjetas idénticas con sombra gris por todas partes.
- Móvil primero en usabilidad: objetivos táctiles ≥ 44 px, sin scroll horizontal, gutter 16 px; la barra inferior móvil ocupa ~90 px abajo.
- Accesible: foco visible, botones reales, textos alternativos.

## Lenguaje
Castellano de España, tuteo, frases cortas y llanas para un junior. Nunca compares con «la versión anterior» del ERP. Rótulos de botones literales del ERP entre comillas latinas «».

## Reglas técnicas
- TypeScript estricto (noUnusedLocals/Parameters, verbatimModuleSyntax: usa `import type`). Comprueba con `cd app && npx tsc -b` y `npx vite build` al final; arregla tus errores. No toques ficheros de otros agentes salvo lo indicado.
- No añadas dependencias nuevas salvo que sea imprescindible (y dilo).
- `datosSimulador` es `Record<string, unknown>`: haz type guards; los datos pueden traer nulls.
