# Taller Axional · Guía de diseño v3 («espacio y cristal»)

Sustituye la dirección visual de la v2 y mantiene su escala tipográfica, su rejilla y sus componentes `ax-*` (los nombres no cambian, solo su aspecto). Referencia: `_fuente/referencia/diseno-sergi.webp`.

## 1. Idea en una frase

Un cielo azul profundo con estrellas, por el que orbitan los módulos como planetas alrededor de tu progreso. Encima flotan tarjetas de cristal con bordes de neón. **El anillo de la órbita es el arco del logo O&S.**

- **Tema principal: oscuro espacial** (es el tema por defecto). El claro es un «cielo de día» con el mismo cristal.
- **El fondo es global**: lo pinta la estructura (`components/shell/Espacio.tsx`). **No pongáis fondos opacos de página** (`background: var(--paper)` en contenedores grandes); dejad ver el cielo.
- Ámbar (`--signal`) sigue siendo **solo** «haz clic aquí».

## 2. Tokens nuevos (en `styles.css`)

| Token | Oscuro | Claro | Uso |
|---|---|---|---|
| `--space-1` / `--space-2` / `--space-3` | #050b24 / #0b1d55 / #1747b8 | #f3f7ff / #dce8ff / #b9d0ff | degradado del cielo |
| `--glass` | degradado azul translúcido (≈ rgba(30,60,150,.8) → rgba(10,22,64,.9)) | blanco translúcido | relleno de cristal |
| `--neon` | turquesa #5ff0d2 → violeta #8b7bff → ámbar #f6b65a | igual, más suave | borde degradado |
| `--glow` | resplandor exterior turquesa y violeta | sombra azulada suave | sombra de las tarjetas |
| `--glow-strong` | más intenso | — | hover, elementos activos |
| `--cyan` | #6fe9ff | #1d8fd1 | segundo acento luminoso (brillos, reflejos) |
| `--violet` | #8b7bff | #6b5ce0 | tercer acento del neón |
| `--sheet` | rgba(22,42,104,.72) | rgba(255,255,255,.82) | superficies pequeñas (antes blanco) |
| `--sheet-solid` | #13245a | #ffffff | cuando necesitéis opaco (menús, inputs sobre imágenes) |
| `--paper` | #081436 | #eaf1ff | fondo de campos (`input`), no de páginas |

Los de la v2 (`--ink`, `--ink-2`, `--ink-3`, `--line`, `--arc`, `--arc-deep`, `--arc-soft`, `--signal`, `--error`, `--fs-*`, `--sp-*`, `--r-*`) se mantienen con el mismo nombre. En oscuro, `--ink` pasa a ser casi blanco (#eef3ff). Usad siempre variables y nunca `#fff` ni `#1f2738` sueltos para el texto.

Radios: tarjetas `--r-l` (28 px), paneles y banners `--r-xl` (36 px).

## 3. El cristal se aplica solo

Estas clases ya son de cristal con borde de neón y resplandor, sin que hagáis nada: `.sheet`, `.mod-card`, `.ax-card`, `.ax-panel`, `.ax-banner`, `.route-item`, `.badge`, `.quiz-opt`, `.tabs`, `.callout` (con tinte), `.chip`, `.btn`, `.meter`, `.ax-bar` y `.glass` (la utilidad genérica para lo vuestro).

La técnica es `background: var(--glass) padding-box, var(--neon) border-box` con `border: 1.5px solid transparent`. Por eso:
- **Si redefinís `background` en un elemento con estas clases, perdéis el neón.** Para teñir, usad `--glass-tint: <color>` (se mezcla con el cristal) o un hijo.
- Para un neón de un solo color (el del módulo), añadid `.neon-mod` y definid `--mod`.
- `.glass.flat` es cristal sin neón ni resplandor, para elementos dentro de otra tarjeta.
- Los pseudo-elementos `::before` y `::after` de `.sheet` siguen libres para vosotros. `.ax-card` sí usa `::after`, para el brillo.

## 4. Componentes reutilizables (`components/shell/`)

### `<Planeta>`: el módulo como planeta
```tsx
import { Planeta } from '../components/shell/Planeta';
<Planeta color={meta.color} valor={0.4} size={72} icono="compras" etiqueta="Compras" />
```
Es una esfera brillante (degradado radial con reflejo y sombra) con el anillo de progreso alrededor y el icono en blanco. Las props `etiqueta` y `pct` son opcionales: van debajo, y `pct` muestra el %. Si pasáis `to`, el planeta es un enlace. Las clases son `.planeta`, `.planeta-esfera`, `.planeta-anillo` y `.planeta-txt`.

### `<NucleoOrbita>`: el núcleo central
```tsx
import { NucleoOrbita } from '../components/shell/NucleoOrbita';
<NucleoOrbita valor={pct} etiqueta="de tu formación" size={220} />
```
Es una burbuja de cristal esférica con el % muy grande, un halo turquesa y un reflejo.

### Órbita de la portada (la monta Home)
El anillo es un `<svg>` con un `<path>` de arco (no un círculo completo) con `stroke="url(#arcoNeon)"`, `stroke-width` de 6 a 10 y un filtro de resplandor. Debajo va una copia ancha y difuminada. Los planetas se colocan sobre el arco. Clases de ayuda: `.orbita-trazo` (trazo luminoso) y `.orbita-guia` (órbitas finas punteadas de fondo).

### Otras piezas con estilo nuevo
- `.ax-card-num`: el número grande y translúcido en la esquina superior derecha de la tarjeta (`<span className="ax-card-num">03</span>`).
- `.ax-check`: el check circular turquesa (`<span className="ax-check on"><Icon name="check" size={16}/></span>`). Sin `.on`, es un círculo vacío.
- `.ax-card-icon`: un cuadradito redondeado con el color del módulo de fondo y el icono en blanco.
- `.btn`: píldora clara luminosa (la principal neutra). `.btn.arc`: degradado turquesa brillante con resplandor (la acción principal). `.btn.ghost`: contorno luminoso. `.btn.signal`: ámbar, solo para «haz clic aquí».

## 5. Tipografía

Igual que en la v2 (cuerpo de 18,5/17 px, mínimo 14 px, Bricolage estrecha y gruesa en los titulares). En oscuro los titulares son blancos, con un brillo de texto muy sutil (`.ax-glow-text`) solo en el titular del banner o de la portada.

## 6. Movimiento

- La transición entre páginas (3D ligero) la hace la estructura.
- Las estrellas parpadean muy poco; las órbitas de fondo giran lentamente (con `prefers-reduced-motion`, todo quieto).
- Planetas: al pasar el ratón crecen un 6 % y aumenta el resplandor. No hagáis rebotar nada.
- Las respuestas a acciones (acertar, fallar o completar) pueden usar un destello de neón: `.flash-ok` y `.flash-ko`.

## 7. Móvil

- Barra inferior con muesca y un **botón central elevado y luminoso** («Seguir», que lleva al siguiente ejercicio pendiente; al acabarlo todo, «Examen»). A los lados: Inicio, Taller, Vídeo y Examen o Logros. **Dejad libres 120 px abajo.**
- Tarjetas a una columna con un radio de 24 px. Cuerpo de 17 px. Sin scroll horizontal.

## 8. Lista de ajustes para cada jefe

1. Quitad los fondos opacos de las páginas y de los contenedores grandes, para que se vea el cielo.
2. Quitad `background` propio de los elementos que usan `.sheet`, `.ax-card` o `.mod-card` (o pasadlo a `--glass-tint`).
3. Los colores fijos claros (`#fff`, `#f6f8fa`, `white`) en fondos de vuestras tarjetas rompen el oscuro: pasadlos a `var(--sheet)` o `.glass`.
4. Las tarjetas de módulo: icono en cuadradito, número grande translúcido en la esquina (`.ax-card-num`), titular grande y check (`.ax-check`).
5. Comprobad el contraste: texto `--ink` o `--ink-2` sobre cristal, nunca `--ink-3` en párrafos.
6. Revisad a 1440 y 375 px, en oscuro (principal) y en claro.
