# Taller Axional · Guía de diseño v2 («plataforma»)

Sergi quiere una **plataforma de formación de primer nivel**: más espectacular, letras más grandes y todo más impresionante. Esta guía es lo que cada jefe de sección aplica a sus páginas. La estructura (barra lateral, barra superior, barra inferior móvil, transiciones, onboarding) la hace el director de diseño en `App.tsx` y `components/shell/`. **No la repliquéis en vuestras páginas.**

## 1. Idea

- **El marco es navy profundo y el contenido es luz.** La barra lateral siempre es navy (también en tema claro), con el arco turquesa a gran escala detrás. El área de contenido es papel frío con un arco gigante muy tenue en el fondo.
- **Una página = un banner + contenido.** Cada página abre con un banner (`.ax-banner`) con el titular grande y estrecho de Bricolage, una línea de explicación y, si aplica, su progreso. Después, contenido con aire.
- **Un momento memorable por página.** El banner ya da el carácter: no añadáis animaciones de entrada a cada tarjeta.

## 2. Escala tipográfica (obligatoria)

Cuerpo **18,5 px en escritorio** y **17 px en móvil** (ya puesto en `body`). **Nada por debajo de 14 px** (`--fs-xs`). Si tenéis `font-size: 0.7rem/0.75rem/0.8rem/12px/13px` en vuestro CSS, subidlo a `var(--fs-xs)` o más.

| Token | Escritorio | Móvil | Uso |
|---|---|---|---|
| `--fs-xs` | 14 px | 14 px | mínimo absoluto: notas, pies de tabla, contadores |
| `--fs-sm` | 16 px | 15,5 px | metadatos, chips, etiquetas de campo |
| `--fs-md` | 18,5 px | 17 px | cuerpo (`body`) |
| `--fs-lg` | 21 px | 19 px | entradillas (`.lead`), texto de pasos |
| `--fs-xl` | 26 px | 22 px | `h3`, títulos de tarjeta |
| `--fs-2xl` | 36 px | 28 px | `h2`, títulos de sección |
| `--fs-3xl` | 56 px | 38 px | `h1` de página normal |
| `--fs-hero` | 88 px | 46 px | titular del banner (`.ax-banner h1`) y portada |

Titulares: Bricolage Grotesque, **estrecho y pesado**: `font-variation-settings: 'wdth' 75; font-weight: 800; letter-spacing: -0.03em; line-height: 0.95`. Clase de ayuda: `.ax-display`. Los `h1` y `h2` globales ya lo llevan; `h3` va en wdth 85 y 700.

Cifras grandes (notas, %, contadores): `.ax-num` (Bricolage, wdth 75, 800, cifras tabulares).

Prohibido: rótulos en mayúsculas espaciadas encima de cada título, una palabra del titular en otro color, «→» al final de botones.

## 3. Rejilla y espaciado

- Ancho de lectura de contenido: `.wrap` (máx. 1240 px, se mantiene). Dentro del nuevo marco el `.wrap` ya deja el aire correcto respecto a la barra lateral.
- Escala de espacio: `--sp-1` 8 · `--sp-2` 12 · `--sp-3` 16 · `--sp-4` 24 · `--sp-5` 32 · `--sp-6` 48 · `--sp-7` 72 · `--sp-8` 104 px.
- Entre secciones de una página: `.ax-section` (margen superior `--sp-7`, en móvil `--sp-6`).
- Rejillas: `.ax-grid` (auto-fill, mín. 300 px, hueco 24 px), `.ax-grid.cols-2`, `.ax-grid.cols-3`. Pasan a 1 columna en móvil.
- Párrafos: máx. 68 ch (ya global).

## 4. Tokens

Se **mantienen todos los antiguos** con el mismo nombre (algunos con valor retocado). Nuevos:

| Nuevo | Valor claro | Equivale / sustituye | Para |
|---|---|---|---|
| `--navy-950` | #0b111c | — | fondo más profundo (marco, banners oscuros) |
| `--navy-900` | #111a2b | antes `#0b1220` suelto | paneles oscuros |
| `--navy-800` | #18223a | — | superficies dentro del marco |
| `--navy-700` | #1f2738 | `--ink` en claro | navy de marca fijo (no cambia con el tema) |
| `--arc-glow` | rgba(79,191,165,.45) | — | brillos, halos, focos |
| `--grad-navy` | degradado 160° navy-800 → navy-950 | `.exam-hero` | banners oscuros |
| `--grad-arc` | degradado 120° arc-deep → arc | `.meter > i` | barras de progreso, rellenos |
| `--sheet-2` | #f6f8fa | — | fondo de tablas/zonas dentro de una tarjeta |
| `--shadow-lg` | sombra profunda azulada | `--shadow` (más grande) | tarjetas destacadas, modales |
| `--r-xl` | 34 px | `--r-l` era 26 | banners y paneles grandes |
| `--fs-*`, `--sp-*` | ver arriba | — | tipografía y espacio |
| `--sidebar-w` | 288 px (plegada 88) | — | lo usa la estructura |

Retocados: `--paper` #edf1f5 (casi igual), `--r-l` 24 px, `--shadow` algo más profunda. `--ink` sigue siendo el navy en claro y el texto claro en oscuro.

Color de módulo: seguid usando `META[id].color` como `--mod` en el contenedor. Las clases nuevas lo leen (`var(--mod, var(--arc))`).

## 5. Componentes de plataforma (clases nuevas en `styles.css`)

### Banner de página `.ax-banner`
```tsx
<header className="ax-banner" style={{ ['--mod' as string]: meta.color }}>
  <div className="ax-banner-in">
    <div className="ax-banner-text">
      <p className="ax-kicker">Módulo 3 de 6</p>          {/* opcional, frase normal, no mayúsculas */}
      <h1>Compras</h1>
      <p className="lead">Del pedido a la factura contabilizada.</p>
      <div className="ax-banner-actions"><a className="btn arc lg">Seguir</a></div>
    </div>
    <div className="ax-banner-side">{/* anillo, cifra, ilustración o nada */}</div>
  </div>
</header>
```
Navy profundo con el arco gigante en turquesa (o en `--mod`), grano sutil y brillo. Siempre texto claro. Variante `.ax-banner.light` (papel con arco tenue) para páginas de lectura larga. En móvil se apila y el titular baja a `--fs-hero` móvil.

### Tarjeta de curso / módulo `.ax-card`
```tsx
<Link className="ax-card" to="…" style={{ ['--mod' as string]: color }}>
  <span className="ax-card-icon"><Icon name="compras" /></span>
  <h3>Compras</h3>
  <p className="muted">8 ejercicios · 2 h</p>
  <div className="ax-bar"><i style={{ width: '40%' }} /></div>
  <span className="ax-card-foot">40 % hecho</span>
</Link>
```
Franja superior con el color del módulo, arco de esquina, sombra profunda al pasar el ratón (sube 4 px). Variante `.ax-card.feature` (ocupa 2 columnas, fondo navy). `.ax-card.done` añade sello turquesa.

### Barras y anillos de progreso
- `.ax-bar` + `<i style={{width}}>`: 10 px, relleno `--grad-arc` (o `--mod` si el padre lo define y añades `.mod`). `.ax-bar.lg` 14 px.
- `.ax-ring`: componente `<Anillo valor={0.4} size={64} />` exportado desde `components/shell/Anillo.tsx`. Usadlo para progreso circular, no hagáis otro.

### Paneles `.ax-panel`
Superficie blanca, `--r-xl`, borde fino, sombra profunda, padding 32/20 px. `.ax-panel.dark` navy con texto claro. `.ax-panel-head` (título + acciones a la derecha).

### Tablas `.ax-table`
Cabecera 14 px en peso 650 (sin mayúsculas), filas de 56 px, cebra suave `--sheet-2`, cifras alineadas a la derecha con `.num`. En móvil, envolver en `.ax-table-scroll` (scroll horizontal dentro de la tarjeta, nunca de la página).

### Cifras destacadas `.ax-stat`
```tsx
<div className="ax-stat"><span className="ax-num">12</span><span>ejercicios hechos</span></div>
```
Fila de cifras: `.ax-stats`. Úsalas solo si los números importan de verdad.

### Botones
Se mantienen `.btn`, `.ghost`, `.arc`, `.sm`. Nuevo `.btn.lg` (56 px, `--fs-lg`) para la acción principal de la página y `.btn.light` (blanco sobre navy, para banners). `.btn.signal` = ámbar, **solo** para «haz clic aquí» en simuladores/guiado.

## 6. Movimiento y 3D

- **Transición entre páginas**: la hace `App.tsx` (entrada con leve giro 3D y desenfoque). No metáis otra animación de entrada de página.
- **Sí**: el momento orquestado del banner o del contenido principal (p. ej., la órbita de la portada, el certificado), respuestas a acciones (acertar, fallar, completar, abrir), inclinación 3D en tarjetas destacadas al pasar el ratón (`rotateX/rotateY` ≤ 6°, `perspective: 1000px`).
- **No**: fade-in escalonado en cada tarjeta, rebotes continuos, parallax por todas partes, cualquier animación infinita salvo un brillo/pulso de «haz clic aquí».
- Siempre `useReducedMotion()` → sin 3D ni desplazamientos, solo opacidad.
- Duraciones: 0,2 s (respuestas) · 0,45 s (paneles) · 0,8–1,2 s (momento orquestado). Curva por defecto `[0.2, 0.7, 0.2, 1]`.

## 7. Móvil (≤ 760 px)

- Barra superior compacta (60 px) con logo, título de página y botón de menú; la barra lateral se abre como cajón desde la izquierda.
- Barra inferior con 5 accesos grandes (Inicio, Taller, Vídeo, Examen, Logros): **deja 110 px libres abajo** (ya lo hace `main`; no pongáis `position: fixed` abajo sin `bottom: 110px`).
- Gutter 16 px, sin scroll horizontal. Objetivos táctiles ≥ 48 px.
- Cuerpo 17 px, nada por debajo de 14 px. Titular del banner 46 px máx., estrecho.
- Las rejillas pasan a 1 columna; tablas dentro de `.ax-table-scroll`.
- Lo `sticky` arriba: `top: 72px` (debajo de la barra móvil); en escritorio `top: 76px` (debajo de la barra superior fina de 64 px).

## 8. Qué cambia para vuestras páginas (lista de ajustes)

1. Sustituid vuestra cabecera de página (hero propio, `exam-hero`, títulos sueltos) por `.ax-banner` o, si ya tenéis un hero espectacular (portada, certificado), mantenedlo pero con la escala nueva.
2. **Quitad vuestras migas** (`.crumbs`): ahora la barra superior las muestra. `.crumbs` queda oculta en escritorio y móvil para no duplicar; si la necesitáis como enlace «volver», usad `.btn.ghost.sm` con el icono `atras`.
3. Revisad tamaños: nada < 14 px; textos de ayuda a `--fs-sm`, cuerpo a `--fs-md`.
4. Tarjetas → `.ax-card`; contenedores → `.ax-panel`; tablas → `.ax-table`; barras → `.ax-bar`.
5. `sticky` con `top` según §7.
6. Comprobad tema claro y oscuro y 375 px de ancho.
7. Clases antiguas siguen funcionando (`sheet`, `pad`, `mod-card`, `route-item`, `quiz-opt`, `callout`…) con la escala nueva; no hace falta migrarlas todas, pero lo visible arriba de cada página sí.
