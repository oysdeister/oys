# Acceso con Clerk y progreso por alumno

La plataforma pide entrar con una cuenta de Clerk. Sin sesión iniciada no se carga la app, así que no se ven los ejercicios ni el vídeo. El progreso de cada alumno se guarda en su cuenta y lo recupera en cualquier navegador o dispositivo.

## Cómo funciona

| Pieza | Fichero |
|---|---|
| `ClerkProvider`, pantalla de entrada (siempre oscura, con intro) y bloqueo de la app | `app/src/auth/Acceso.tsx` |
| Formularios propios: entrar con código, crear cuenta (Google o correo), vuelta de Google, invitaciones | `app/src/auth/FormularioAcceso.tsx` |
| Escena 3D de la pantalla de acceso (carga diferida) | `app/src/auth/EscenaAcceso.tsx` |
| Clave, direcciones de vuelta y filtro de correos | `app/src/auth/config.ts` |
| Botón de usuario, indicador de guardado y botón **Salir** (barra superior) | `app/src/auth/Cuenta.tsx` |
| Formato compacto y fusión del progreso | `app/src/auth/compacto.ts` |
| Subida con debounce, modo sin conexión y cambio de usuario | `app/src/auth/sincronizar.ts` |
| Aviso de cambios que lanzan los almacenes | `app/src/lib/sync.ts` |
| Estilos (fondo espacial, cristal y neón) | `app/src/auth/auth.css` |

- **Clave:** se lee de `VITE_CLERK_PUBLISHABLE_KEY`. Si no está definida, la app funciona como antes: sin login y con el progreso solo en el navegador.
- **Sin pantallas de Clerk:** el alumno no ve nunca componentes, ventanas ni páginas alojadas de Clerk. Los formularios son de la plataforma y usan la API (`useSignIn`/`useSignUp` de `@clerk/react/legacy`):
  - **Ya tengo cuenta:** correo → `signIn.create` + `prepareFirstFactor('email_code')` → código de 6 cifras → `attemptFirstFactor` → `setActive`.
  - **Crear cuenta:** nombre, apellidos y correo → `signUp.create` + `prepareEmailAddressVerification('email_code')` → código → `attemptEmailAddressVerification` → `setActive`.
  - **Sin Google** (decisión de Sergi, 24-11-2026): no hay botón de Google para entrar ni para registrarse. Si llega una vuelta antigua de Google (`…/oys/?acceso=google`), la pantalla la termina con `handleRedirectCallback`.
  - Invitaciones de Clerk (`__clerk_ticket` en la URL): botón «Aceptar invitación y entrar».
  - Antes de llamar a Clerk se comprueba que el correo sea `@oysconsultores.com` (o de `CORREOS_EXTRA`).
  - El avatar de la barra superior es propio (foto o iniciales); ya no se usa `<UserButton>`.
  - En desarrollo, `?demo=codigo|registro|error|hecho` fuerza un estado para revisar el diseño sin mandar correos.
- **Dónde se guarda:** en `user.unsafeMetadata.oys` de Clerk, sin backend. Clerk admite como máximo 8 KB de metadata por usuario.
  - En JSON tal cual, el progreso completo de los 80 ejercicios ocupa unos 8,9 KB y no cabe.
  - Por eso se compacta: los pasos y la checklist se guardan como máscaras de bits y se quitan los textos. Así ocupa unos 3 KB con todo completado.
  - Del examen solo se guarda el último aprobado, sin las preguntas, que se regeneran a partir del código.
  - Si alguna vez el progreso pasa de 7 KB, se descartan primero las insignias vistas y luego las respuestas de teoría.
- **Qué se sincroniza:**
  - pasos, guiado, test y checklist de cada ejercicio;
  - simuladores superados y rondas del Taller;
  - notas de las prácticas del ERP;
  - examen aprobado (con su validación) y **examen a medias** (fase, respuestas de teoría y de práctica; las preguntas se regeneran desde el código);
  - insignias vistas;
  - preferencias: tema claro u oscuro y barra lateral plegada (se aplican en un navegador nuevo; si el navegador ya tiene las suyas, mandan las suyas).
- **Qué no se sincroniza:** los datos que el alumno crea en el ERP de práctica (`oys-erp-sim-v1`). Solo los datos de partida ya ocupan varios KB y crecen con cada documento, así que no caben en los 8 KB de Clerk; harían falta un almacén aparte (por ejemplo, Supabase). La nota de cada práctica sí se guarda.
- **Examen a medias:** si se termina o se descarta en un dispositivo, los demás ya no lo recuperan. Las respuestas se guardan como lista para que no se mezclen con las de un examen anterior.
- **Carga:** la app no se pinta hasta fusionar el progreso de la cuenta (se ve «Cargando tu progreso…» un momento).
- **Fusión:** al entrar, se junta el progreso local con el de la cuenta y siempre gana el mayor avance:
  - pasos y checklist: se suman los de los dos lados;
  - tests y notas: la mejor nota;
  - simuladores y guiado: cuenta como hecho si está hecho en cualquiera de los dos;
  - examen: gana el validado; si los dos lo están o ninguno, la nota más alta.
  - El progreso que ya hubiera en un navegador antes de Clerk se suma a la primera cuenta que entre en él.
- **Solo correos de O&S:** aunque alguien tenga cuenta (por ejemplo, invitado por error o con un Google personal), la app solo se abre si la cuenta tiene un correo verificado `@oysconsultores.com`. Si no, ve «Solo cuentas de O&S» y un botón para salir. El dominio se cambia con `VITE_DOMINIO_PERMITIDO` (vacío = cualquiera) y se pueden añadir correos sueltos con `VITE_CORREOS_EXTRA` (separados por comas), como variables de repositorio `DOMINIO_PERMITIDO` y `CORREOS_EXTRA`. Es un filtro de la interfaz, igual que el login. En Clerk, el equivalente automático es **Allowlist**, que es de pago (Pro).
- **Google en ventana emergente:** en GitHub Pages, la redirección de Clerk tras Google volvía a la raíz del dominio (`sergibauli.github.io/`, 404) y no a `/oys/`. Por eso Google se abre en una ventana emergente (`oauthFlow="popup"`) y la app no sale de su página. Probado en la web publicada el 17-11-2026.
- **Datos del alumno:** al entrar por primera vez ya no se pide nombre, iniciales ni usuario. Salen de la cuenta: nombre completo o, si no lo hay, la parte del correo antes de la `@`; las iniciales de ese nombre; y el usuario a partir del correo. Las iniciales se usan en los códigos de los ejercicios (por ejemplo, `TSB`).
- **Guardado:** se guarda 2 segundos después del último cambio, al ocultar la pestaña y al pulsar **Salir**.
  - Sin conexión, todo sigue funcionando en local. Lo pendiente se sube al volver la red o en la siguiente visita.
  - El punto de la barra superior indica el estado: verde, guardado; ámbar, pendiente; rosa, sin conexión.
- **Varios alumnos en el mismo navegador:** si entra otra cuenta, se borra el progreso local de la anterior, que ya está en su cuenta, y se carga el de la nueva.
- **Ojo:** el alumno puede modificar su propio `unsafeMetadata`. Sirve para guardar progreso, no como prueba de nada. El certificado sigue necesitando el código del examinador.

## Configuración hecha (17-11-2026)

Aplicación **OYS** del workspace personal de Clerk (plan **Hobby**), instancia de **desarrollo** (`fair-spaniel-1505.clerk.accounts.dev`):

1. **Configure → User & authentication → Access mode → Invite-only.** Nadie se registra por su cuenta; solo entran los invitados. La lista blanca por dominio (`@oysconsultores.com`) es **Allowlist**, que en Clerk es de pago (Pro).
2. El acceso es con correo y contraseña (contraseña de 15 caracteres como mínimo) y también con Google, pero solo para cuentas ya invitadas.
3. La publishable key de desarrollo está en `app/.env.local`, que git no sube.

## Prueba hecha (17-11-2026, en local)

1. Entrar con Google: la app abre directamente, sin formulario («Hola, Sergi · SB»).
2. Marcar 2 de los 12 puntos de la checklist de maestros-1: se guarda en la cuenta (203 bytes).
3. Pulsar **Salir** y borrar todo el `localStorage`, como en un navegador nuevo.
4. Volver a entrar: vuelven el alumno y los 2 puntos marcados.

## Configuración de Clerk para el acceso nuevo (23-11-2026, pendiente de Sergi)

En el panel de Clerk, aplicación **OYS**, instancia de desarrollo:

1. **Configure → User & authentication → Email:** activa *Sign-up with email*, *Verify at sign-up* con **Email verification code**, y *Sign-in with email* con **Email verification code**.
2. **Configure → User & authentication → Password:** desactiva *Sign-up with password* (el acceso nuevo no usa contraseñas; si se deja obligatoria, el registro por correo se queda a medias).
3. **Configure → User & authentication → Personal information** (o *Name*): activa **First and last name** (la pantalla los pide siempre).
4. **Configure → SSO connections → Google:** desactívalo, porque la plataforma ya no ofrece entrar con Google. Si lo dejas activo no pasa nada visible, pero sobra.
5. **Configure → Restrictions / Access mode:** cambia **Invite-only** a **Public** para que «Crear cuenta» funcione. La app solo abre la plataforma a correos `@oysconsultores.com` (y `CORREOS_EXTRA`); quien se registre con otro correo verá «Solo cuentas de O&S». Para que Clerk ni siquiera cree esas cuentas hace falta **Allowlist** (de pago).
6. **Bot protection:** si está activa, no hay nada que hacer: el formulario de registro ya incluye el hueco `clerk-captcha`.

Sin Google, no hace falta configurar nada en Google Cloud para el acceso.

## Lo que tienes que hacer tú

### 1. Pasar la clave a GitHub Actions

La publishable key (`pk_...`) es pública: acaba en el JavaScript de la web. La secret key (`sk_...`) no se usa ni se tiene que poner en ningún sitio.

1. Ve a GitHub → repositorio `oysdeister/oys` → **Settings → Secrets and variables → Actions → Variables → New repository variable**.
2. Nombre: `CLERK_PUBLISHABLE_KEY`. Valor: la `pk_test_...` de Clerk (**Configure → API keys**).
3. El workflow `.github/workflows/pages.yml` ya la pasa al build como `VITE_CLERK_PUBLISHABLE_KEY`.

Si prefieres guardarla como secret, créala en **Secrets** con el mismo nombre y cambia `vars.` por `secrets.` en el workflow.

### 2. Invitar a los alumnos

1. Ve a Clerk → **Users → Invitations → Invite user**.
2. Escribe el correo del alumno.
3. Si te deja elegir la URL de redirección, pon `https://oysdeister.github.io/oys/`.
4. El alumno recibe un correo. Al abrir el enlace, llega a la web con la invitación y ve el formulario de alta, donde crea su contraseña o entra con Google.

### 3. Origen permitido

Las instancias de desarrollo de Clerk aceptan cualquier origen, `oysdeister.github.io` incluido; no hay nada que añadir. El campo **allowed origins** solo existe en producción.

## Límites de Clerk en GitHub Pages

- **La instancia de desarrollo funciona en GitHub Pages**, con estos límites:
  - como máximo **100 usuarios**;
  - un distintivo «Development mode» en los formularios;
  - el inicio de sesión con Google usa las credenciales compartidas de Clerk.

  Para una formación interna de juniors suele bastar.
- **La instancia de producción exige un dominio propio** en el que puedas crear registros DNS. Clerk usa esos registros para la sesión y para el correo. `oysdeister.github.io` no sirve, porque el dominio no es tuyo.
  - Si se quiere producción, crea un subdominio de la empresa, por ejemplo `practica.oysconsultores.com`, apuntado a GitHub Pages (Settings → Pages → Custom domain), y en Clerk pulsa **Go to prod** con ese dominio.
  - Clerk te pedirá varios CNAME (`clerk.`, `accounts.` y los de correo) en el DNS de `oysconsultores.com`.
  - La `pk_live_...` resultante sustituye a la `pk_test_...` en la variable de GitHub.
  - Con dominio propio, la web pasa de `/oys/` a `/`. Ya funciona porque Vite compila con `base: './'`.

## Aviso: Clerk en GitHub Pages solo protege la interfaz

Con GitHub Pages, Clerk **no** protege los ficheros, solo oculta la app a quien no ha entrado:

- El repositorio es **público**: el contenido de los ejercicios (`app/src/content/*.json`) se puede leer en GitHub.
- Las capturas (`/oys/img/...`), los JSON y el JavaScript compilado se descargan por URL directa sin sesión.
- Los vídeos de las releases de GitHub también se pueden abrir por URL directa.

Es una barrera razonable para una formación interna, pero no es privacidad real.

### Alternativa con privacidad real (no implementada)

Para que el contenido quede protegido de verdad, la web tiene que servirse desde un sitio que compruebe la sesión **antes** de entregar cada fichero:

1. **Repositorio privado** en GitHub. GitHub Pages con repositorio privado exige GitHub Enterprise Cloud, así que hay que cambiar de hosting.
2. **Vercel o Netlify** con un middleware de Clerk (`clerkMiddleware`, o un Edge Function en Netlify) que exija sesión para todas las rutas, imágenes incluidas.
3. **Vídeos** fuera de las releases públicas: en el propio hosting detrás del middleware, o en un almacenamiento con URLs firmadas (Cloudflare R2, S3 o Bunny Stream).
4. **Instancia de producción** de Clerk con dominio propio (punto anterior).

**Coste aproximado** (precios públicos; compruébalos antes de decidir):

| Pieza | Coste |
|---|---|
| Clerk | gratis hasta 10.000 usuarios activos al mes en producción |
| Vercel | plan Hobby gratis, pero solo para uso no comercial; para una empresa, Pro, unos 20 $ por usuario y mes |
| Netlify | gratis o Pro, unos 19 $ al mes |
| Dominio | el de la empresa |
| Vídeos | Cloudflare R2 sin coste de salida y unos céntimos por GB guardado |

**Pasos:**

1. Hacer privado el repositorio.
2. Conectarlo a Vercel o Netlify.
3. Añadir el middleware de Clerk.
4. Mover los vídeos.
5. Pasar Clerk a producción con el dominio.
6. Apagar GitHub Pages.

## Probar en local

```bash
cd app
echo "VITE_CLERK_PUBLISHABLE_KEY=pk_test_..." > .env.local
npm run dev
```
