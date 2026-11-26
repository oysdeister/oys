# Bloques de la plataforma que enseñan esta skill y fuentes

## Módulo `icon-contabilidad` («Contabilidad básica»), según `app/src/content/etapas.ts`
| Etapa (fase) | Bloques (id) | Referencia |
|---|---|---|
| El plan de cuentas (Configurar) | `maestros-v-1`, `maestros-v-2`, `parametrizacion-1`, `parametrizacion-2` | plan-cuentas-y-mnemotecnicos.md |
| Datos básicos (Configurar) | `maestros-1` | datos-basicos.md |
| Diario, periodos y plantillas (Configurar) | `asientos-1`, `icon-contabilidad-1` | diarios-y-asientos.md, orden-de-carga-y-escenarios.md |
| Escribir un asiento (Operar) | `asientos-2`, `asientos-3`, `asientos-4`, `asientos-5` | diarios-y-asientos.md |
| Contabilizar, copiar y corregir (Operar) | `asientos-6`, `asientos-11`, `asientos-12`, `asientos-13` | diarios-y-asientos.md |
| Consultar (Operar) | `asientos-7`, `asientos-8`, `asientos-9`, `asientos-10` | consultas.md |
| Para saber más (opcional) | `parametrizacion-icon-1`, `parametrizacion-3` a `-6`, `parametrizacion-icon-2`, `contab-saldos-iniciales`, `contab-mnemotecnicos-alta`, `contab-plantilla-alta` | orden-de-carga-y-escenarios.md, analitica.md, diarios-y-asientos.md, plan-cuentas-y-mnemotecnicos.md |
Otros módulos que reutilizan esta skill:
- `compras` › «Facturas que generan asientos»: `icon-contabilidad-v-1`, `-v-2`, `-v-3`, `-v-4` → facturas-y-asientos-generados.md
- `tesoreria` › `asientos-14` (asiento de un movimiento de banco) → facturas-y-asientos-generados.md §6
- `fundamentos` (`fundamentos-1`, `fundamentos-2`: debe/haber, asiento, IVA, efecto, cierre) y `maestros` (`maestros-v-3`/`-v-4`: ficha de empresa y crear empresa S{INI}).
- `contabilidad-avanzada`: cierre y caso final → skill `erp-next-cierre`.

## Fuentes (rutas en el repo)
- `app/src/content/icon-contabilidad.json` (33 bloques; extrae por id con python: `[e for e in d['ejercicios'] if e['id']=='asientos-2']`), `fundamentos.json`, `maestros.json`, `etapas.ts`, `glosario/icon-contabilidad.json`, `examenes/`.
- `_fuente/CODIGOS_ALUMNO.md` (códigos `{INI}` y longitudes máximas; sección «Contabilidad general»).
- `auditoria/redaccion_contabilidad.md` (reescritura junior), `auditoria/revision_senior_fase2.md`, `auditoria/revision_senior_final_jm.md`, `auditoria/reauditoria.md`, `auditoria/guia_junior.md`, `auditoria/revision_junior_resto_jm.md`.
- Documentación oficial resumida: skill `erp-nuevo-icon-documentacion` (visor de Finanzas, 219 páginas; no copies texto oficial). Referencias suyas: `hechos-contabilidad*.md`, `hechos-parametrizacion*.md`.
- Grabaciones «Icon»: carpeta de vídeos (no es un módulo); series troceadas en `app/src/content/video-finanzas.ts` (`fin-<vídeo>`, release `video-finanzas-v1`). Datos de esas grabaciones (empresa Perú, RUC, soles) **no se usan**: demo española nextdemo, empresa TRI, plan ES, euros.
- Oys hermano `~/claude-plugins/baulies-marketplace/plugins/oys/skills/erp-nuevo-icon` (versión idéntica a la anterior `erp-nuevo-icon`; su contenido está en `conocimiento-videos-icon.md`).

## Datos pendientes o sin verificar
- Pantalla de la sustitutiva (FU): solo concepto en el vídeo.
- Factura de venta FB: error «ha sido consolidado» del entorno de formación (puede haberse corregido).
- Ruta sin pantalla propia comprobada: `icon-contabilidad-v-4` › importe 0 (se ve desde cualquier factura).
- Capturas con asiento invertido (impagado y remesa SEPA): pendientes de recaptura.
- Los `detalle` añadidos en la reescritura junior se dedujeron de capturas y guía; conviene repaso con la demo abierta.
