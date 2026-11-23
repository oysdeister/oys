# Plugin `formacion-oys`

Skills de Claude Code para mantener y mejorar la plataforma **«Practicando Axional Deister VNext»** (https://oysdeister.github.io/oys/) sin depender de nadie.

## Instalar

Dentro de Claude Code, con el repo clonado:

```
/plugin marketplace add oysdeister/oys
/plugin install formacion-oys@oysdeister
```

Si abres Claude Code en la carpeta del repo y aceptas confiar en ella, te propone instalarlo solo (lo declara `.claude/settings.json`). Para actualizarlo después: `/plugin marketplace update oysdeister`.

## Qué trae

| Skill | Para qué |
|---|---|
| `criterios-sergi` | Normas del proyecto: tuteo, claridad para juniors, títulos, vídeo primero, datos de la demo, qué pedir a Sergi. **Léela primero.** |
| `arrancar-y-publicar` | Entorno local, build, prueba de humo, despliegue en GitHub Pages y comprobación. |
| `modulo-y-bloque` | Añadir o editar módulos y bloques: esquema JSON, títulos, orden, glosario, examen. |
| `capturas-y-puntos` | Capturas de la demo con puppeteer, WebP, puntos de los pasos y OCR de campos. |
| `videos` | Trocear grabaciones en capítulos, releases de GitHub y enlazar el minuto. |
| `erp-practica` | ERP de práctica: pantallas, comportamientos, catálogo y prácticas con corrección. |
| `diseno-y-ux` | Sistema de diseño, reglas de claridad y validación con agentes-junior. |
| `acceso-clerk-google` | Login con Clerk y Google: cómo funciona, qué falta y quién hace qué. |
| `erp-nuevo-*`, `erp-antiguo-compras`, `erp-diferencias-antiguo-nuevo` | Conocimiento funcional de Axional (compras, tesorería, finanzas, documentación oficial). |
| `video-tutorial-erp`, `video-motor-remotion`, `video-dos-sesiones` | Hacer vídeos tutoriales nuevos con Remotion y locución. |

Scripts en `scripts/`: `capturas_erp2.mjs` (manejar la demo y sacar capturas) y `harvest.mjs` (descargar el catálogo de pantallas). Instálalos una vez con `npm --prefix plugins/formacion-oys/scripts install`.

## Cómo pedir las cosas

Habla normal; Claude elige la skill. Ejemplos:

- «Arranca la web en local y enséñame el bloque de alta de proveedor.»
- «Añade al módulo de Ventas un bloque para hacer un abono.»
- «Cambia la captura del paso 3 de Generar factura y recoloca el punto.»
- «Publica los cambios.»

Mejoras al plugin: edita los `SKILL.md` de esta carpeta y publícalos como cualquier otro cambio.
