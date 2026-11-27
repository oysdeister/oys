# Fuentes, bloques y puntos pendientes

Índice: 1 Bloques de la plataforma · 2 Vídeo · 3 Fuentes consultadas · 4 Historia de decisiones recientes · 5 Sin verificar / dudas.

## 1. Bloques de `app/src/content/ventas.json` (módulo «Gestión de ventas», Sesión 8; circuito Oferta › Pedido › Albarán › Factura › Asiento › Vencimiento)
| id | Título | Etapa (etapas.ts) | Dur. | Qué enseña |
|---|---|---|---|---|
| `ventas-cliente` | Preparar el cliente | Configurar › El cliente | 35 min | tercero + CLI, Maestro de clientes, condición de cobro, impuestos, banco y mandato, riesgo/descuentos/agente, cuenta de ventas |
| `ventas-precios` | Preparar los precios de venta | Configurar › Los precios de venta | 25 | LV{INI}, GV{INI}, grupo en el cliente, precio al guardar la línea |
| `ventas-tipologias-mapa` | Conocer las tipologías de venta | Configurar › Los documentos de venta | 25 | cadena, campos de enlace, plantillas AV/FV/FVOA, tipo contable |
| `ventas-documentos` | Configurar los documentos de venta | Configurar › Los documentos de venta | 70 | numerador, PD/AP/FP, enlaces, O, PV, A, numeración fiscal |
| `ventas-pedido` | Vender: pedido, albarán y factura | Operar › Vender | 60 | venta del caso 242,00, prevista, asiento, vencimientos, Docflow |
| `ventas-1` | Vender del albarán a la factura | Operar › Practicar otros circuitos | 60 | A{INI}, asiento del albarán, descontabilizar, FVOA |
| `ventas-2` | Vender de la oferta a la factura | Operar › Practicar otros circuitos | 75 | oferta 5 × 22,00 → factura 133,10 |
Navegación del módulo: `ventas-nav-circuito` y `ventas-nav-moverse` (cómo abrir pantallas, Nuevo vs Nuevo como, estados). Existe además un glosario (`glosario/ventas.json`) y un examen (`examenes/ventas.json`) y un examen práctico en `app/src/lib/examen.ts` que usa O{INI}, PV{INI}, AP{INI}, FP{INI}.
Dependencias de otros módulos: tercero C{INI} y relación CLI (Contabilidad › «Dar de alta los datos básicos de contabilidad»), R{INI} y P{INI} (Contabilidad básica › «Dar de alta los datos básicos de contabilidad», `maestros-1`), cliente C{INI} en Gestión y su condición de cobro (Compras › «Dar de alta los datos básicos de gestión», `maestros-2`), stock inicial (`compras-2`, 10 unidades).
Convención de códigos: `_fuente/CODIGOS_ALUMNO.md` (sección Ventas). `A{INI}2` y `F{INI}` ya no existen; el pedido desde oferta pasó de `P{INI}` a `PV{INI}` (chocaba con el plazo de Maestros).

## 2. Vídeo «Ventas en Axional Deister VNext» (`app/src/content/video-ventas.ts`, release `video-ventas-v1`, 6 capítulos)
1 Bienvenida: el módulo de ventas (4:52) · 2 El cliente (6:18) · 3 La numeración y los tipos de documento (6:46) · 4 El pedido de venta (7:17) · 5 Del albarán a la factura (11:18) · 6 Resumen y ejercicios (2:47). Se registra en `videoSeries.ts`.

## 3. Fuentes consultadas
- `app/src/content/ventas.json`, `etapas.ts`, `video-ventas.ts`, `glosario/ventas.json`.
- Notas de captura de Ventas del 25 y 26-11-2026 (`nueva/ventas/NOTAS_VENTAS.md` del repositorio de trabajo): datos creados, rutas de menú, objetos, rects de captura, errores E1–E5, catálogo de la demo, plantillas, FVOA, precios, descontabilizar.
- `auditoria/redaccion_compras_ventas.md`, `revision_senior_ventas_workflow.md`, `revision_junior_ventas_workflow.md`, `revision_*_jm_ventas_workflow.md` (decisiones de redacción y hallazgos).
- `_fuente/CODIGOS_ALUMNO.md` (códigos {INI}).
- Capturas de la plataforma: `app/public/img/ventas/ventas-n-NN.webp`.

## 4. Historia reciente (git)
- `dc172e2` Ventas con Configurar (cliente y documentos) y Operar (pedido, albarán y factura) comprobados en la demo.
- `470d7ae` Ventas › Configurar al nivel de Compras.
- `fd7ea8f` y `00ee36d` vídeo tutorial completo.
- `cffb2af` repaso final: AP{INI} se copia de AV (estándar) en lugar de ACL2; stock del 13500620 explicado (10 comprados frente a 25 vendidos; 15 de práctica salen de ALMACEN CENTRAL con 83 disponibles); FVOA; vencimientos 2 × 121,00; truco de recálculo «Importe dto.» unificado; domiciliación y ejercicio en ventas-1/ventas-2; grupo GV{INI}; campo Agente.
- `4404ce8` iniciales siempre de 2 letras.

## 5. Sin verificar / dudas
- Mensaje exacto de domiciliación con R{INI} («Tercero»): solo comprobado con TF.
- Si rellenar el Agente en el cliente hace que el pedido lo proponga.
- Que el Precio salga a 20,000000 con LV{INI}/GV{INI} propios (comprobado el mecanismo con el grupo 00002 y la lista TV).
- Causa de que la primera «Contabilizar» no grabe el asiento; causa del Importe neto 50,00 (¿Valorar «Tarifa»?).
- Que el asiento descontabilizado del albarán desaparezca en Contabilidad.
- Por qué el vencimiento a 30 días cae el 28-12-2026 y no el 25-12.
- Existencia en ventas de un control albarán-factura equivalente al de compras (no hay CRC en compras; en ventas no se ha investigado).
- Cuentas de IVA: la demo usa 47000.00000 para el IVA repercutido; no se ha confirmado si el responsable de contenidos quiere sustituirla por la 477 en los textos (las capturas seguirían mostrando 47000).
- Tipología de abono/rectificativa de venta: no existe en la demo, por lo que devoluciones de venta están fuera de alcance.
