# Formación Axional · Guía de diseño v5 («tema guía»)

Sustituye la estética v3/v4 (cielo, cristal, neón y 3D) por la de las guías de formación previa de Drive (guia-contabilidad.html y guia-erp.html), que Sergi prefiere: clara, concisa y legible. Noviembre de 2026.

## Dónde vive
- `app/src/tema/guia.css`: tokens `--g-*` (papel #f6f5f2, tarjeta blanca, tinta #1d2430, navy del logo #1f2738, cabecera #0f2a4a, acento turquesa O&S #1a7d68) y componentes `.g-card .g-hero .g-kicker .g-lead .g-box(.info/.ok/.warn/.bad) .g-table .g-steps`. Remapea los tokens antiguos (`--ink`, `--paper`, `--sheet`, `--arc`, `--glass`, `--neon`…), así que las hojas viejas heredan el tema. Claro y oscuro.
- `app/src/tema/{shell,inicio-modulo,bloque,examenes,consulta}.css`: ajustes por área.
- `app/src/tema/ancho.css` (el último): ancho común de 1400 px; los párrafos a ~76ch y el resto (tarjetas, tablas, capturas, rejillas) a todo el ancho. Rejillas de 2–3 columnas en listas de tarjetas.
- Orden de carga en `app/src/main.tsx`: styles.css → sistema.css → app-ux.css → tema/*.css. Las hojas v3/v4 siguen ahí; lo nuevo se escribe en `tema/`.

## Reglas
- Fondo papel liso; contenido en tarjetas blancas con borde de 1 px y radio 14 px; sin sombras grandes, cristal, neón, degradados ni escenas 3D.
- Cabecera de página navy con kicker en mayúsculas pequeñas; un tamaño por papel: h1 36, h2 27, h3 20, cuerpo 17 px (móvil 28/22/18/16), interlineado 1,65.
- Recuadros con barra izquierda de 4 px y fondo tintado (clave, información, en el ERP, aviso). Tablas con borde fino y cabecera tintada. Pasos con número en círculo acento.
- Botones: radio 8 px; `.btn.arc` relleno acento (principal), `.btn` contorno, `.btn.ghost` texto. Flecha → solo si lleva a otra página (v4 sigue valiendo).
- Aprovecha el ancho: nada de columnas estrechas centradas con huecos a los lados (petición de Sergi).
- Letra del sistema (`--g-font`). Color por módulo (META de `content/index.ts`) como franja o número, no como fondo.
- Movimiento: solo fundidos cortos; `prefers-reduced-motion` lo apaga.
- La pantalla del ERP de práctica (`.erp`) imita a Axional y no sigue este tema; solo su envoltorio.
