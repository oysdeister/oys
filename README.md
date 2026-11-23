# Practicando Axional Deister VNext

Plataforma de formación de O&S Consultores para juniors: módulos del ERP Axional Deister VNext con concepto, guiado sobre capturas, test, prácticas en un ERP simulado, vídeos por capítulos, examen y certificado.

- Web: https://oysdeister.github.io/oys/ (cada push a `main` se publica con `.github/workflows/pages.yml`).
- Código: `app/` (React + Vite). Contenido: `app/src/content/`. Guías de trabajo: `_fuente/`.

```bash
npm --prefix app ci
npm --prefix app run dev
```

## Trabajar en la plataforma con Claude Code

El repo trae el plugin **`formacion-oys`** (`plugins/formacion-oys/`) con las skills para mantenerla: publicar, editar módulos y bloques, capturas, vídeos, ERP de práctica, diseño, acceso y los criterios del proyecto. Detalle en [plugins/formacion-oys/README.md](plugins/formacion-oys/README.md).

### Qué tienes que hacer tú (compañero)

1. **Instalar Claude Code** (https://claude.com/claude-code) e iniciar sesión con tu cuenta.
2. **Instalar las herramientas**: Git, Node 22 y GitHub CLI (`brew install git node@22 gh`), y entrar en GitHub con `gh auth login` (marca el permiso `workflow` si vas a tocar `.github/`).
3. **Clonar el repo**:
   ```bash
   gh repo clone oysdeister/oys
   cd oys
   npm --prefix app ci
   ```
4. **Instalar el plugin**: abre `claude` dentro de la carpeta `oys`, acepta confiar en ella y acepta instalar `formacion-oys`. Si no te lo propone:
   ```
   /plugin marketplace add oysdeister/oys
   /plugin install formacion-oys@oysdeister
   ```
5. Prueba: pide «arranca la web en local». Antes de cambiar nada, pide «léeme los criterios de Sergi».

### Qué tiene que hacer Sergi

1. **Permiso de escritura** en el repo: GitHub → `oysdeister/oys` → Settings → Collaborators → Add people → rol *Write*.
2. **Acceso a la web**: si el compañero no tiene correo `@oysconsultores.com`, añadirlo a la variable `CORREOS_EXTRA` del repo (y, mientras Clerk siga en modo invitación, invitarlo en Clerk → Users → Invitations).
3. **Solo si lo va a necesitar**:
   - Clerk (cambiar el acceso): invitarlo al workspace de Clerk.
   - Demo de Deister (capturas y catálogo del ERP): darle usuario de `nextdemo.geasa.eu`.
   - Google Cloud o Cloudflare (dominio propio): esos pasos los sigue haciendo Sergi.
