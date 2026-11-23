---
name: arrancar-y-publicar
description: Cubre arrancar el entorno local, compilar, probar y desplegar la plataforma «Practicando Axional Deister VNext» en GitHub Pages. Úsala cuando pidan "arranca el entorno", "lanza el taller", "haz una prueba de humo", "publica", "despliega", "comprueba el despliegue" o "¿por qué falla Pages?".
---

# Arrancar y publicar la plataforma

## Cuándo usarla

- Quieres levantar el entorno de desarrollo (`npm run dev` o el perfil «taller»).
- Tienes que compilar o pasar el lint antes de entregar cambios.
- Necesitas hacer una prueba de humo previa a publicar.
- Vas a desplegar en GitHub Pages o comprobar un despliegue.
- Algo falla en el build o en el workflow de Pages.

## Dónde está

- `app/` — proyecto React + Vite. Todos los comandos de npm se lanzan con `--prefix app`.
- `.github/workflows/pages.yml` — workflow que compila y publica en GitHub Pages.
- `.claude/launch.json` — perfiles de arranque: «taller» (puerto 5179) y «ux» (puerto 5191).
- `app/package.json` — scripts `dev`, `build`, `lint`, `preview`.
- `app/src/lib/config.ts` — usa `VITE_VIDEO_URL` para enlazar el vídeo de compras.
- `.gitignore` — excluye `video/` anclado a `/video/`, `media/`, `nueva/` y otros.
- `CLERK.md` — explica el acceso con Clerk y las variables `VITE_*` de dominio y correos.

## Pasos

### 1. Prepara el entorno local

```bash
npm --prefix app ci
```

Si vienes de un `git pull` con dependencias nuevas (p. ej. Clerk), repítelo:

```bash
npm --prefix app install
```

Arranca el servidor de desarrollo con el perfil «taller» (puerto 5179):

```bash
# En Claude Code: pide «arranca el taller» (usa el perfil «taller» de .claude/launch.json)
# o a mano:
npm --prefix app run dev -- --port 5179 --strictPort
```

Queda en `http://localhost:5179`. Si necesitas otro perfil, usa «ux» (puerto 5191, host 127.0.0.1).

Variables de entorno para desarrollo (en `app/.env.local` o exportadas antes de lanzar):

- `VITE_CLERK_PUBLISHABLE_KEY` — si no está definida, la app funciona sin login y guarda el progreso solo en el navegador (CLERK.md).
- `VITE_VIDEO_URL` — enlace al vídeo tutorial de compras para incrustarlo (config.ts).
- `VITE_DOMINIO_PERMITIDO` — dominio de correo con acceso; por defecto `oysconsultores.com` (vacío = cualquiera).
- `VITE_CORREOS_EXTRA` — correos extra permitidos, separados por comas.

### 2. Compila y pasa el lint

```bash
npm --prefix app run build
npm --prefix app run lint
```

El build genera la carpeta `app/dist`. No uses `npm run build` en la raíz.

### 3. Prueba de humo antes de publicar

Levanta una vista previa del bundle:

```bash
npm --prefix app run preview
```

Abre la URL que indique (normalmente `http://localhost:4173`) y comprueba en escritorio y móvil:

- portada,
- un módulo,
- un ejercicio con Guiado,
- examen de módulo,
- glosario,
- vídeo,
- ERP de práctica.

Revisa también la consola del navegador: sin errores ni avisos graves. Usa el modo responsivo o un móvil real para la revisión móvil.

### 4. Despliega en GitHub Pages

El flujo normal: trabaja en una rama `claude/*` (o en el worktree que abre Claude Code), pasa la prueba de humo y haz squash a `main`. Antes de empezar, `git pull` en `main`: otras personas también publican. El push a `main` dispara `.github/workflows/pages.yml`.

```bash
git checkout -b claude/mi-cambio
# haz cambios, commit y push
git push -u origin claude/mi-cambio
# cuando esté listo:
git checkout main
git pull
git merge --squash claude/mi-cambio
git commit -m "Descripción del cambio"
git push origin main
```

Si trabajas directamente en `main`, basta con commit y push.

### 5. Comprueba el despliegue

```bash
gh run list -R oysdeister/oys --workflow pages.yml
gh run watch -R oysdeister/oys <ID_DEL_RUN>
curl -I https://oysdeister.github.io/oys/
```

Para ver las variables del repositorio (los secretos no se listan):

```bash
gh variable list -R oysdeister/oys
```

### 6. Aviso sobre .gitignore y Assets

- `video/` está anclado a `/video/` en `.gitignore`. No cambies esa regla a `video/` genérico: rompería `app/src/components/video` y `app/public/video` (ya pasó en despliegues de e3e628d y 89bb17c).
- `media/` y `nueva/` también se excluyen de git; no las fuerces con `git add -f`.
- Si necesitas añadir contenido de esas carpetas, revisa primero su propósito: son material grande generado localmente.

## Comprobar

- `npm --prefix app run build` termina sin errores y genera `app/dist`.
- `npm --prefix app run lint` no reporta problemas.
- `npm --prefix app run preview` sirve la web y las rutas clave abren en escritorio y móvil.
- La consola del navegador queda limpia durante la prueba.
- `gh run list -R oysdeister/oys --workflow pages.yml` muestra el último run en verde.
- `curl -I https://oysdeister.github.io/oys/` devuelve `HTTP/2 200`.
- `gh variable list -R oysdeister/oys` muestra `VIDEO_URL` y, si aplica, `CLERK_PUBLISHABLE_KEY`, `DOMINIO_PERMITIDO` y `CORREOS_EXTRA`.

## Errores típicos

- **Error de compilación tras un pull con dependencias nuevas**: ejecuta `npm --prefix app install` antes de `npm --prefix app run build`.
- **Vite en el puerto 5179 devuelve 500 tras un cambio**: mata el proceso viejo y vuelve a arrancar.
- **El despliegue falla por `.gitignore`**: comprueba que `video/` esté escrita como `/video/`; si está sin la barra inicial, ignora también los ficheros de `app/src/components/video` y `app/public/video`.
- **Al hacer push a `.github/workflows` da error 403**: el token de GitHub no tiene el scope `workflow`. Refréscalo con `gh auth refresh -h github.com -s workflow` (si actúas como oysdeister, añade `-u oysdeister` y luego `gh auth switch -u oysdeister`).
- **La web en Pages no muestra login**: revisa que la variable `CLERK_PUBLISHABLE_KEY` esté definida en el repositorio y que el workflow la pase como `VITE_CLERK_PUBLISHABLE_KEY`.
- **El vídeo no se incrusta**: falta la variable `VIDEO_URL` en el repositorio o no se pasó al build como `VITE_VIDEO_URL`.
- **Las rutas internas no funcionan en Pages**: la app usa `HashRouter`; las URLs deben llevar `#` (por ejemplo `https://oysdeister.github.io/oys/#/modulo`). No uses rutas sin hash.
- **`npm run build` en la raíz falla**: siempre usa `--prefix app`.
- **Capturas o contenido grande no aparece**: `media/`, `nueva/` y `video/` están fuera de git; no las subas, enlázalas o cópialas a `public/` si realmente deben publicarse.