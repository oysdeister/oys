---
name: mapa-formacion-oys
description: "Índice del plugin formacion-oys: qué skill o agente usar para cada tarea de la formación en Axional Deister VNext (dudas del ERP por módulo, moverse y transaccionar en la demo, capturas, vídeos, crear o auditar bloques, publicar la plataforma). Úsala cuando no sepas por dónde empezar, cuando pregunten «¿qué skills hay?», «¿qué agente uso para…?», «¿cómo está organizado el plugin?» o al arrancar una tarea que toca varias áreas a la vez."
---

# Mapa del plugin `formacion-oys`

El plugin junta lo aprendido al montar la plataforma «Practicando Axional Deister VNext» (https://oysdeister.github.io/oys/): el ERP módulo a módulo, cómo moverse por la demo, cómo producir vídeos y cómo construir y mantener la plataforma. Elige por la tarea; casi siempre combinarás una skill de plataforma con una del ERP.

Antes de cambiar nada de la plataforma, lee `criterios-sergi`: son decisiones ya tomadas (tuteo, juniors, vídeo primero, no tapar datos de la demo, ids que no se cambian).

## 1. El ERP Axional VNext (conocimiento funcional)

| Tarea o duda | Skill |
|---|---|
| Moverse por el ERP, automatizar la demo (Chrome en el puerto 9333 + puppeteer), sesión caducada, capturas 4K, datos de prueba `{INI}`/`CAP` | `navegar-erp-next` |
| Empresa, terceros, artículos, plazos, tipos de efecto, almacén | `erp-next-maestros` |
| Plan contable, mnemotécnicos, diarios, asientos, consultas, facturas de Finanzas | `erp-next-contabilidad` |
| Cierre y apertura del ejercicio, balances, caso final | `erp-next-cierre` |
| Compras: precios, tipologías, pedido, albarán, factura, abono, stock | `erp-next-compras` |
| Aprobación de pedidos con workflow | `erp-next-workflow` |
| Ventas: cliente, precios, tipologías, pedido, albarán, factura | `erp-next-ventas` |
| Cartera: efectos, cobros y pagos, gestiones, remesas, SEPA, impagados | `erp-next-cartera` |
| Tesorería: banco propio, extracto N43, conciliación, cajas, financiación | `erp-next-tesoreria` |
| IVA, reglas de impuestos, registro fiscal, declaraciones | `erp-next-impuestos` |
| Activos fijos y amortización | `erp-next-activos` |
| Documentación oficial de Finanzas (hechos por área) | `erp-nuevo-icon-documentacion` |
| ERP antiguo (2015) y qué cambia con el nuevo | `erp-antiguo-compras`, `erp-diferencias-antiguo-nuevo` |

## 2. Producción: capturas y vídeos

| Tarea | Skill |
|---|---|
| Capturas de la demo en WebP, puntos de los pasos y OCR de campos | `capturas-y-puntos` (y `navegar-erp-next` para la conexión) |
| Orquestar un vídeo tutorial nuevo (Loom o grabación en vivo), requisitos para principiantes, dos sesiones antiguo/nuevo | `video-tutorial-erp` |
| Plantilla Remotion, voz edge-tts Ximena, grabar con `rec.mjs`, render por capítulos | `video-motor-remotion` |
| Trocear, clips web 720p con póster, release de GitHub, enlazar el minuto desde un bloque | `videos` |

## 3. La plataforma de formación

| Tarea | Skill |
|---|---|
| Normas del proyecto | `criterios-sergi` |
| Crear o editar un módulo o un bloque (esquema JSON, etapas, glosario, examen) | `modulo-y-bloque` |
| Redactar para juniors sin conocimientos | `redaccion-junior` |
| Auditar con perfiles auditor, senior contable y junior; de hallazgos a correcciones | `auditar-contenido` |
| CSS, componentes y UX v5 | `diseno-y-ux` |
| ERP de práctica dentro de la web | `erp-practica` |
| Login con Clerk y Google | `acceso-clerk-google` |
| Arrancar, compilar, prueba de humo y publicar en GitHub Pages | `arrancar-y-publicar` |

## 4. Agentes

Lánzalos con la herramienta Agent (`formacion-oys:<nombre>`). Cada uno carga sus skills.

| Agente | Modelo | Para qué | Toca ficheros |
|---|---|---|---|
| `consultor-erp-next` | Sonnet | «¿Cómo se hace X en el ERP?» sin entrar en la demo | No |
| `navegador-demo` | Sonnet | Transaccionar, comprobar o capturar en la demo (la sesión la abre el usuario) | Capturas y notas |
| `auditor-contenido` | Opus | Auditar módulos de la plataforma y dejar informe en `auditoria/` | Solo el informe |
| `revisor-senior-contable` | Opus | Exactitud contable de bloques, skills o guiones | Solo el informe |
| `revisor-junior` | Sonnet | Claridad para un recién llegado | Solo el informe |
| `productor-video` | Sonnet | Vídeo tutorial de principio a fin hasta dejarlo enlazado | Sí (sin publicar) |
| `redactor-bloque` | Sonnet | Crear o corregir un bloque con datos verificados | Sí (sin publicar) |

## Recorridos típicos

- **Bloque nuevo**: `redactor-bloque` → (dato dudoso) `navegador-demo` → `revisor-senior-contable` + `revisor-junior` → `arrancar-y-publicar`.
- **Vídeo nuevo**: `productor-video` (usa `navegar-erp-next` y la skill del módulo) → `arrancar-y-publicar`.
- **Reauditoría**: `auditor-contenido` por módulo → correcciones con `redactor-bloque` en ficheros distintos → verificación por otro agente → publicar.
- **Duda de un junior**: `consultor-erp-next`.

## Reglas que valen para todo

- Solo la demo `nextdemo.geasa.eu`, base tutorial. Nunca bases de clientes reales.
- El login lo hace siempre el usuario; nadie escribe contraseñas por él.
- Lo que no se ha comprobado en la demo o en la plataforma se marca «(sin verificar)».
- El repo es público: sin credenciales, datos personales ni documentación de Deister copiada.
