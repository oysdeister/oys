---
name: acceso-clerk-google
description: Cómo funciona el inicio de sesión con Clerk/Google y la sincronización del progreso en la plataforma. Úsala cuando preguntes por el login, el guardado en la cuenta, las variables de Clerk, dar de alta alumnos o migrar a la instancia de producción con dominio propio.
---

# Acceso con Clerk, Google y progreso por alumno

## Cuándo usarla

Activa esta skill si el usuario dice frases como:  
«¿Cómo funciona el login?», «No puedo entrar», «¿Cómo doy de alta a un alumno?», «El progreso no se guarda en la nube», «¿Qué variables hay que configurar?», «¿Cómo pasamos a producción con dominio propio?», «¿Qué falta para quitar el logo de Clerk?», «¿Cómo se migra el progreso de los alumnos?».

## Dónde está

| Fichero | Qué hace |
|---|---|
| `app/src/auth/Acceso.tsx` | Pantalla de entrada, `ClerkProvider`, botón Google, filtro de dominio. |
| `app/src/auth/Cuenta.tsx` | Botón de usuario, indicador de guardado, botón **Salir**. |
| `app/src/auth/sincronizar.ts` | Subida con debounce, modo sin conexión, cambio de usuario. |
| `app/src/auth/compacto.ts` | Formato compacto y fusión del progreso. |
| `app/src/lib/sync.ts` | Aviso de cambios que lanzan los almacenes. |
| `app/src/auth/auth.css` | Estilos de la pantalla de acceso. |
| `.github/workflows/pages.yml` | Variables que se pasan al build. |
| `CLERK.md` | Cómo funciona el acceso y qué se sincroniza (8 KB por usuario). |

**Aún no están en `main`** (viven en la rama `claude/google-oys-1d2156`, commits `8e88745` y `4c9a008`): `_fuente/ACCESO_GOOGLE_OYS.md` (guía de producción), `_fuente/DNS_FORMACION_OYS.md` (registros DNS), `_fuente/scripts/migrar-progreso-clerk.mjs` (migrar progreso), `.github/scripts/comprobar-dominio.mjs`, el logo `_fuente/brand/oys_google_120.png` y el cambio de `pages.yml` que usa `DOMINIO_PROPIO`. Léelos con:
```bash
git fetch origin
git show origin/claude/google-oys-1d2156:_fuente/ACCESO_GOOGLE_OYS.md
```
A 23-11-2026 esa rama solo está en el ordenador de Sergi: si `git fetch` no la trae, pídele que la suba (`git push origin claude/google-oys-1d2156`, con un token con permiso `workflow`).

## Pasos

### Mantenimiento habitual

1. **Dar de alta a un usuario externo**  
   Si el correo no es `@oysconsultores.com`, añádelo a la variable de repositorio `CORREOS_EXTRA` (separado por comas):  
   ```bash
   gh variable get CORREOS_EXTRA -R oysdeister/oys   # mira los que ya hay: set los sustituye
   gh variable set CORREOS_EXTRA -R oysdeister/oys --body "correo1@externo.com,correo2@externo.com"
   ```
   Después vuelve a publicar (Actions → Run workflow o un push a `main`): las variables se leen al compilar.  
   Además, si la instancia de Clerk está en modo **Invite-only** (desarrollo actual), hay que invitar al usuario desde el panel de Clerk → **Users → Invitations**.  
   La app solo deja pasar correos verificados que cumplan el filtro (dominio o lista de extra).

2. **Comprobar variables del repositorio**  
   En GitHub → Settings → Secrets and variables → Actions → Variables:  
   - `CLERK_PUBLISHABLE_KEY` → `pk_test_...` (instancia de desarrollo).  
   - `CLERK_PUBLISHABLE_KEY_PROD` → `pk_live_...` (instancia de producción, aún sin activar).  
   - `DOMINIO_PERMITIDO` → por defecto `oysconsultores.com`.  
   - `CORREOS_EXTRA` → correos externos permitidos.  
   - `DOMINIO_PROPIO` → `formacion.oysconsultores.com` (interruptor de producción, aún no creada).  

3. **Probar en local**  
   Pide la clave publicable de desarrollo a Sergi (o cópiala de la variable del repo) y:
   ```bash
   echo "VITE_CLERK_PUBLISHABLE_KEY=<clave pk_test>" > app/.env.local
   npm --prefix app run dev
   ```
   `app/.env.local` no se sube a git (comprueba `git status`). Sin ese fichero, la app entra sin login.

### Migración a producción (pendiente, solo Sergi)

Estos pasos requieren acceso a Clerk, Google Cloud, Cloudflare o secretos. **Solo Sergi** puede hacerlos.

1. **DNS en Cloudflare** (necesita acceso a la zona `oysconsultores.com`).  
   Crea en Cloudflare los registros CNAME de `_fuente/DNS_FORMACION_OYS.md` (sin `_dmarc`).  
   Comprueba con:  
   ```bash
   for h in formacion clerk accounts clkmail clk._domainkey clk2._domainkey; do echo "$h → $(dig +short CNAME $h.oysconsultores.com)"; done
   ```

2. **Logo en Google Cloud** (solo Sergi, el navegador integrado no sube ficheros).  
   Sube `_fuente/brand/oys_google_120.png` en Google Cloud → OAuth consent screen → Branding.

3. **Llevar esos commits a `main`**  
   La rama se separó de `main` hace tiempo: no la empujes encima. Aplica solo sus dos commits en una rama nueva desde `main`:
   ```bash
   git switch -c claude/acceso-google origin/main
   git cherry-pick 8e88745 4c9a008
   ```
   Resuelve conflictos, pasa la prueba de humo y haz squash a `main`. Como toca `.github/workflows`, el token necesita el permiso `workflow`.

4. **Migrar progreso** (justo antes de activar producción).  
   Desde la raíz del repo:  
   ```bash
   CLERK_SK_DEV=sk_test_... CLERK_SK_PROD=sk_live_... node _fuente/scripts/migrar-progreso-clerk.mjs
   ```  
   Ejecuta primero sin `--aplicar` para ver el simulacro. Si está bien, repite con `--aplicar`.

5. **Dominio propio en GitHub Pages**  
   - Settings → Pages → Custom domain: `formacion.oysconsultores.com` → Save y espera a **DNS check successful**.  
   - Crea la variable `DOMINIO_PROPIO` con valor `formacion.oysconsultores.com`.  
   - Actions → Publicar en GitHub Pages → Run workflow.

6. **Probar**  
   - Abre `https://formacion.oysconsultores.com` en incógnito.  
   - **Continuar con Google** debe mostrar «O&S Formación» con el logo, sin «Clerk».  
   - Entra con tu cuenta de O&S: debe cargar tu progreso anterior.  
   - Con una cuenta personal de Gmail: no debe dejar pasar (pantalla Interna de Google o filtro de la app).

## Comprobar

- Después de añadir un correo externo, pide al alumno que entre: debe ver la app y no «Solo cuentas de O&S».  
- En local, si `VITE_CLERK_PUBLISHABLE_KEY` no está definida, la app funciona sin login (solo para depurar).  
- Tras la migración, comprueba que `https://oysdeister.github.io/oys/` redirige a `https://formacion.oysconsultores.com/`.  
- El build fallará en el paso **Comprobar dominio propio y clave de producción** si `CLERK_PUBLISHABLE_KEY_PROD` no es `pk_live_` o su dominio no coincide con `DOMINIO_PROPIO`.

## Errores típicos

- **Usuario externo no entra**: falta añadir su correo a `CORREOS_EXTRA` o no está invitado en Clerk (si la instancia es Invite-only).  
- **La pantalla de Google muestra «Clerk»**: se está usando la instancia de desarrollo; hay que completar la migración a producción con cliente OAuth propio.  
- **El logo no aparece en Google**: el logo no se subió en Google Cloud (solo Sergi puede hacerlo).  
- **El progreso se reinicia al cambiar a producción**: no se ejecutó el script `migrar-progreso-clerk.mjs` antes de activar `DOMINIO_PROPIO`.  
- **El workflow falla al activar producción**: revisa que `CLERK_PUBLISHABLE_KEY_PROD` sea `pk_live_` y que el DNS de Clerk esté verificado.  
- **Sin dominio propio no se puede usar producción de Clerk**: `oysdeister.github.io` no sirve; hace falta un dominio de la empresa.