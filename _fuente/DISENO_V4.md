# Taller Axional · Guía de diseño v4 («orden y profundidad»)

Mantiene la v3 (cielo profundo, cristal y neón, marca O&S) y corrige tres cosas que se veían en uso: títulos demasiado grandes, controles que no decían qué hacían y contenido útil por debajo del pliegue. Todo vive en **`app/src/sistema.css`**, que se carga la última y manda sobre las hojas de cada página. No hay que tocar página a página.

## 1. Escala tipográfica

Tercera mayor (×1,25) sobre 16 px. El `rem` vuelve a 16 px, así que todo lo que estaba en `rem` baja a la vez.

| Papel | Token | Escritorio | Móvil | Dónde |
|---|---|---|---|---|
| Titular de portada | `--t-display` | 34–54 px | 30–38 px | Solo la portada |
| Título de página | `--t-page` | 27–38 px | 24–28 px | Todo `h1` dentro de una página |
| Sección | `--t-section` | 21–26 px | 21 px | `h2` |
| Bloque o tarjeta | `--t-block` | 17–19 px | 17 px | `h3` |
| Cuerpo | `--fs-md` | 16 px | 16 px | Texto |

Un tamaño por papel en toda la app: si un `h2` necesita otro tamaño, es que no es un `h2`.

## 2. Lenguaje de controles

| Intención | Aspecto | Regla |
|---|---|---|
| Ir a otra página | Flecha → al final, que avanza al pasar | Todo `<a class="btn">` sin icono propio la lleva sola. Las tarjetas-enlace (`a.ax-card`, `a.route-item`, `a.po-door`) la llevan en el pie. Volver = ← delante. |
| Hacer algo aquí | Botón sin flecha | `<button class="btn">`: relleno turquesa (principal), contorno (secundaria), texto (terciaria). |
| Desplegar | Chevron ⌄ que gira 180° | `aria-expanded` siempre. Usa `<span class="ctl-chev" aria-hidden="true" />` dentro del botón; `<details>` lo lleva solo. |
| Abrir una ventana | Icono propio (▶ en vídeo) | `aria-haspopup="dialog"`. |
| Pestañas | Pastilla que se desliza | Si son pasos, numeradas (1 Concepto, 2 Guiado…); lo que es consulta va aparte, sin número. Debajo, «Paso n de N» y «Siguiente: …». |
| Menú | Hamburguesa | `aria-expanded` refleja si el cajón está abierto. |

Estados comunes: **hover** levanta 2 px; **foco** anillo ámbar doble (`--focus-ring`), visible en claro y oscuro; **pulsado** baja 1 px y escala a 0,97. Alto mínimo táctil: 44 px.

## 3. Organización

- **Cabeceras compactas**: título, resumen y acciones en ~40 % de la primera pantalla; las pestañas del ejercicio quedan visibles sin hacer scroll.
- **Módulo**: índice fijo «En esta página» (Tu ruta · El circuito · Vídeo · Antes de empezar) que marca la sección en la que estás. **Tu ruta va primero**: es lo que el alumno viene a hacer.
- **Ejercicio**: fuera de «Concepto» la cabecera se recoge (el resumen ya se leyó).
- Ritmo vertical: 56 px entre secciones (40 en móvil).

## 4. Movimiento

Solo `transform` y `opacity`; con `prefers-reduced-motion` se apaga todo.

- **Entre páginas**: la nueva sube desde el fondo inclinada (rotateX 9°, translateZ −90 px) y la anterior se aleja.
- **Tarjetas que se inclinan** hacia el puntero (máx. 7°, menos cuanto más ancha). Un solo oyente global: `lib/inclinar.ts`. Usa la propiedad `rotate`, así no choca con framer-motion. Solo con ratón.
- **Entradas escalonadas** de rejillas (50 ms entre elementos) y la cabecera entra con profundidad.
- **Suelo en perspectiva**: rejilla turquesa que se desliza despacio bajo el contenido.
