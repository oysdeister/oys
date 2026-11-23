---
name: diseno-y-ux
description: Mantiene el sistema de diseño v4 y la guía de usabilidad UX v5 de la plataforma. Úsala cuando toques CSS, componentes de interfaz o valides la UX con agentes-junior: «arregla el CSS», «lanza los juniors», «revisa la UX», «prueba de humo».
---

# Diseño y UX

## Cuándo usarla
- Modificas `app/src/sistema.css`, `app/src/styles.css` o añades páginas/componentes.
- Aplicas las guías `_fuente/DISENO_V4.md` y `_fuente/UX_V5.md`.
- Lanzas validación con agentes-junior sin formación financiera.
- Preparas publicación y necesitas la prueba de humo.

## Dónde está
- `app/src/sistema.css`: tokens, tipografías Bricolage Grotesque e Instrument Sans, colores por módulo (cielo profundo, cristal y neón), tema claro/oscuro, controles. Se carga la última y manda sobre todo.
- `app/src/styles.css`: estilos base.
- `app/src/main.tsx`: importa `sistema.css` después de App.
- `_fuente/DISENO_V4.md`: guía de diseño v4.
- `_fuente/UX_V5.md`: guía de usabilidad v5.
- `app/src/lib/inclinar.ts`: inclinación de tarjetas al puntero.
- `components/exercise/Concepto.tsx`, `components/exercise/CapturaCampos.tsx`, `components/exercise/Guiado.tsx`, `components/exercise/VideoPrimero.tsx`: piezas del paso de ejercicio.
- `app/src/pages/ModulePage.tsx`, `app/src/pages/ExercisePage.tsx`, `app/src/pages/ruta.css`.
- `app/src/content/*.json`: datos de módulos, bloques y pasos.
- `app/src/content/glosario.ts` y `app/src/content/glosario/*.json`.
- `app/src/content/icon-contabilidad.json`, `app/src/content/video-finanzas.ts`, `app/src/content/campos-pos.json`: ejemplos de contenido.

## Pasos

### 1. Aplica el sistema de diseño
Lee `_fuente/DISENO_V4.md`. Claves:
- Escala tipográfica 1,25 sobre 16 px; un tamaño por papel (`--t-display`, `--t-page`, `--t-section`, `--t-block`, `--fs-md`).
- Controles: flecha → solo para ir a otra página; botón sin flecha para hacer algo aquí; chevron para desplegar; `aria-expanded` siempre.
- Táctil mínimo 44 px; hover levanta 2 px; foco anillo ámbar (`--focus-ring`).
- Movimiento solo `transform` y `opacity`; respeta `prefers-reduced-motion`.
- Colores y tokens en `app/src/sistema.css`. No pongas `!important` fuera de ahí.

### 2. Aplica la usabilidad v5
Lee `_fuente/UX_V5.md`. Modelo:
```
Curso → Módulo (8) → Etapa (A, B, C) → Bloque → Paso
Paso: Concepto → Guiado → De memoria → Test → [Práctica] → Demo real
```
Reglas:
- Un número por nivel y solo uno a la vista: «Módulo 3 de 10», «Bloque 1 de 3», «Paso 2 de 6», «Parte 1 de 8».
- Todo está abierto por defecto (decisión de Sergi, `app/src/lib/ruta.ts`). `?libre=0` activa el modo guiado, en el que un bloque se abre cuando el anterior está hecho; `?libre=1` lo vuelve a quitar.
- «Ejercicio» se llama «bloque» en toda la interfaz.
- Un paso sin contenido no se enseña. «Problemas» va al final de la Demo real.
- El vídeo va primero en cada parte del Concepto; después texto y pantallas clicables.

### 3. Valida con agentes-junior
Lanza subagentes que simulan ser juniors sin formación financiera. Usa el brief resumido:
```text
Eres un junior recién contratado en O&S Consultores: consultor-programador, sin formación en finanzas ni contabilidad, que nunca ha usado el ERP Axional Deister. Te mandan formarte con la plataforma.
Recorre tu zona en escritorio (1440 px) y móvil (390 px) con capturas completas y el texto visible de cada pantalla. Anota cada punto en el que te pierdas.
Para cada hallazgo entrega: tipo (orden poco claro, jerarquía confusa, cuadros de más, texto que no se entiende, dato sin contexto, repetición, incoherencia, otro); dónde (ruta #/... y captura); qué ves (cita literal corta); por qué te pierdes (en primera persona); gravedad (3 bloquea, 2 confunde, 1 molesta); propuesta concreta.
Busca especialmente: qué hacer primero al entrar, si se distingue apartado de subapartado, cuántas cajas sobran, palabras técnicas sin explicar, datos sin origen, temas repetidos entre módulos, contradicciones.
Entrega el informe como `hallazgos/<area>.md` y devuelve un resumen de 10 líneas con los 5 más graves.
```
Cada agente cubre un módulo o la portada; guarda sus informes fuera del repo (en la carpeta temporal de la sesión). Para recorrer la web, los agentes usan puppeteer u obscura, nunca `javascript_tool`. Hallazgos típicos (de auditorías existentes):
- No hay primer paso claro: cuatro entradas a la vez en el módulo.
- Cuatro contadores simultáneos («Ejercicio 2 de 8», «Paso 2 de 6», «Parte 1 de 8», «01/45»).
- Se puede saltar sin acabar; «Siguiente» siempre activo.
- Concepto de 12.700 px con 6-10 cajas por parte.
- Vídeos repetidos en cabecera, Concepto y Guiado.
- Pantallas en blanco por rutas de menú como texto (`s.ruta.map is not a function`).
- Capturas de otra parte en el Guiado de Contabilidad general.

Aplica los hallazgos en el código y vuelve a validar.

### 4. Prueba de humo antes de publicar
```bash
npm --prefix app run build   # incluye tsc -b
```
Debe terminar sin errores. Después recorre las rutas clave en escritorio y móvil (lista en `arrancar-y-publicar`). Para probar en local:
```bash
npm --prefix app run dev -- --port 5191 --strictPort --host 127.0.0.1
```
Abre `http://127.0.0.1:5191`. Para probar el modo guiado: `http://127.0.0.1:5191/#/?libre=0`.

## Comprobar
- `npm --prefix app run build` limpio.
- Tamaños y tokens según `DISENO_V4.md`; sin `!important` fuera de `sistema.css`.
- Un solo botón principal por pantalla.
- Con `?libre=0`, los bloques se abren en orden; sin él, todo está abierto.
- Los pasos sin contenido no aparecen.

## Errores típicos
- Tocar CSS de página en vez de añadir tokens a `app/src/sistema.css`.
- Usar «ejercicio» en vez de «bloque» en textos de interfaz.
- Poner el vídeo al final de una parte del Concepto.
- Reutilizar una captura de otra parte en el Guiado.
- Dejar campos sin número o ficha en `CapturaCampos.tsx`.
- Publicar sin haber hecho `npm --prefix app run build` ni la prueba de humo.