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

Mapa completo (qué skill o agente usar en cada caso): skill **`mapa-formacion-oys`**.

### Skills del ERP Axional VNext

| Skill | Para qué |
|---|---|
| `navegar-erp-next` | Moverse por el ERP y automatizar la demo: Chrome en el puerto 9333 + puppeteer, sesión caducada, capturas 4K, datos de prueba `{INI}`/`CAP`, scripts. |
| `erp-next-maestros` | Empresa, terceros, artículos, plazos, tipos de efecto, almacén. |
| `erp-next-contabilidad` | Plan contable, mnemotécnicos, diarios, asientos, consultas, facturas de Finanzas. |
| `erp-next-cierre` | Cierre y apertura del ejercicio, balances, caso final. |
| `erp-next-compras` | Precios, tipologías, pedido, albarán, factura, abono, stock. |
| `erp-next-workflow` | Aprobación de pedidos de compra con workflow. |
| `erp-next-ventas` | Cliente, precios, tipologías, pedido, albarán, factura. |
| `erp-next-cartera` | Efectos, cobros y pagos, gestiones, remesas, SEPA, impagados. |
| `erp-next-tesoreria` | Banco propio, extracto N43, conciliación, cajas, financiación. |
| `erp-next-impuestos` | IVA, reglas de impuestos, registro fiscal, declaraciones. |
| `erp-next-activos` | Activos fijos y amortización. |
| `erp-nuevo-icon-documentacion` | Hechos de la documentación oficial de Finanzas. |
| `erp-antiguo-compras`, `erp-diferencias-antiguo-nuevo` | ERP antiguo (2015) y qué cambia. |

### Skills de producción y de la plataforma

| Skill | Para qué |
|---|---|
| `criterios-sergi` | Normas del proyecto. **Léela primero.** |
| `modulo-y-bloque` | Añadir o editar módulos y bloques: esquema JSON, etapas, glosario, examen. |
| `redaccion-junior` | Redactar para juniors sin conocimientos; caso continuo y glosario. |
| `auditar-contenido` | Auditar con perfiles auditor, senior contable y junior; script de comprobaciones. |
| `capturas-y-puntos` | Capturas de la demo, WebP, puntos de los pasos y OCR de campos. |
| `video-tutorial-erp` | Orquestar un vídeo tutorial nuevo (Loom o grabación en vivo; dos sesiones antiguo/nuevo). |
| `video-motor-remotion` | Plantilla Remotion, voz Ximena, grabación con `rec.mjs`, render por capítulos. |
| `videos` | Trocear, clips web 720p, releases de GitHub y enlace con minuto. |
| `erp-practica` | ERP de práctica de la web. |
| `diseno-y-ux` | Sistema de diseño y UX v5. |
| `acceso-clerk-google` | Login con Clerk y Google. |
| `arrancar-y-publicar` | Entorno local, build, prueba de humo y GitHub Pages. |

### Agentes

| Agente | Modelo | Para qué |
|---|---|---|
| `consultor-erp-next` | Sonnet | Responder cómo se hace algo en el ERP (solo lectura). |
| `navegador-demo` | Sonnet | Transaccionar, comprobar y capturar en la demo. |
| `auditor-contenido` | Opus | Auditar la plataforma y dejar informe. |
| `revisor-senior-contable` | Opus | Revisar exactitud contable. |
| `revisor-junior` | Sonnet | Revisar claridad para un recién llegado. |
| `productor-video` | Sonnet | Vídeo tutorial de principio a fin. |
| `redactor-bloque` | Sonnet | Crear o corregir un bloque. |

Scripts generales en `scripts/` (`capturas_erp2.mjs`, `harvest.mjs`); los de navegación están en `skills/navegar-erp-next/scripts/`. Instálalos una vez con `npm --prefix plugins/formacion-oys/scripts install`.

## Cómo pedir las cosas

Habla normal; Claude elige la skill. Ejemplos:

- «Arranca la web en local y enséñame el bloque de alta de proveedor.»
- «Añade al módulo de Ventas un bloque para hacer un abono.»
- «Cambia la captura del paso 3 de Generar factura y recoloca el punto.»
- «Publica los cambios.»

Mejoras al plugin: edita los `SKILL.md` de esta carpeta y publícalos como cualquier otro cambio.
