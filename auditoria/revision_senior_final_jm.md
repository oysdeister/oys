# Revisión senior final: Ventas › Configurar y workflow de Compras (tras los comentarios de JM)

Fecha: 26-11-2026. Revisado el `git diff` contra HEAD (ventas.json, compras.json, etapas.ts, progress.ts, compacto.ts, sincronizar.ts, examen.ts, CODIGOS_ALUMNO.md, glosarios) y 28 capturas nuevas `ventas-n-57…80`, más la prueba en la demo.
Prioridad: **GRAVE** · **IMPORTANTE** · **MEJORA**.

## Veredicto

**Se puede publicar** después del humo y de la pasada con agentes-junior que pide `criterios-sergi` (no hechos aquí). Lo del director está cumplido y los GRAVE de la revisión previa están resueltos. Lo que queda (abajo) no rompe datos ni contabilidad.

## 1. Objetivo del director

| Objetivo | Estado |
|---|---|
| Ventas › Configurar al nivel de Compras › Configurar | **Cumplido.** Tres etapas: «El cliente» (7 partes: impuestos, banco y mandato, riesgo y descuentos, cuenta de ventas), «Los precios de venta» (`ventas-precios`, equivalente a `compras-precios`, probado en la demo con el grupo 00002) y «Los documentos de venta» (`ventas-tipologias-mapa` + `ventas-documentos`). |
| Tipos de documento explicados como en `compras-tipos` | **Cumplido y mejor que compras.** Mapa de la cadena O › PV › AP › FP, campos de enlace con las ayudas literales (Sí/Validar/No, Sumando/Restando/No) y el ejemplo 10/4/6, plantillas AV/FV/FVOA leídas en `gconasih`, tipo contable PRODUCTO › 70000, Tipo de pedido, Expedición albarán, Valorar, Abono, Clase fiscal, Impresión y numeración fiscal FVN con control cronológico. |
| Juego único de tipologías | **Cumplido.** O, PD, PV, AP, A y FP{INI}, todas creadas en `ventas-documentos`; `ventas-1` y `ventas-2` solo las comprueban. `A{INI}2` y `F{INI}` desaparecen del contenido, de CODIGOS_ALUMNO.md y del caso del examen (`examen.ts`). |
| Workflow configurable desde Compras › Configurar | **Cumplido.** Etapa «Aprobación de pedidos» con `compras-workflow-config` (rol › circuito › validación › grupo › tipología); `compras-workflow` queda en Operar con prueba, autorización y consultas. Ids de sección sin cambiar; los momentos de vídeo van por id de sección y siguen funcionando. |

## 2. Revisión previa: GRAVE e IMPORTANTE

| Punto | Estado |
|---|---|
| G1 Doble venta en `ventas-1` | **Resuelto.** El texto lo explica (AV ⇒ FVOA; FVOA da error en la demo) y manda descontabilizar el albarán antes de facturar. Ese paso **ya está probado** (§3). |
| G2 Parches de la demo en `compras-workflow-prueba` | **Resuelto.** Aviso «Solo en esta demo… En un cliente real…» y test propio. |
| I1 IVA a la 47000 sin aviso | **Resuelto** en `ventas-documentos`, `ventas-tipologias-mapa`, `ventas-1` y el test de `ventas-pedido` («en la demo»; 477 en el PGC). |
| I2 Domiciliación bancaria | **Resuelto con honestidad.** Se explica la columna «Domiciliación bancaria» del tipo de efecto (Tercero/Empresa/No requiere, comprobado en `ctipoefe`). Lo que pasa con R{INI} se marca como no comprobado. El cambio a EF se presenta como atajo de la demo. |
| I3 Cuenta del cliente | **Resuelto.** Subcuenta propia en todos los bloques; se acaba la 43000.00000 genérica. |
| I4 Configuración escondida en Operar | **Resuelto** (ver §1). |
| I5 «public» como aprobador | **Resuelto.** Aviso de segregación de funciones y pregunta de test. |
| I6 Ejemplo del importe | **Resuelto.** El ejemplo es ahora la referencia del proveedor; para bloquear por importe se dice que hace falta otra validación. |
| I7 ACR/PRO en compras | No era objeto de este cambio. Sigue igual (ver §6). |

Coherencia contable comprobada: albarán A{INI} 43090 D / 70000 H por 200,00 (sin IVA), factura 43000.00901 D 242,00 / 47000 H 42,00 / 70000 H 200,00, cuenta 70000 del tipo contable PRODUCTO (captura n-66). Plantillas AV y FVOA (líneas 5 y 6, 43090 y «RETROCESO ALBARAN») cuadran con las capturas n-64 y n-65. Las longitudes de CODIGOS_ALUMNO.md (tipologías 4, listas y grupos 12) coinciden con el texto.

## 3. Prueba en la demo: «Descontabilizar» el albarán

Chrome del puerto 9334, pestaña `senior-jm`, copia del script en el scratchpad. Solo se tocó **0AV000008** (CAPV / TCAPV, «CAP prueba FVOA»).
- El albarán, ya contabilizado y conformado en 0FV000009 (factura sin contabilizar), muestra «Descontabilizar» en la barra superior.
- Al pulsarlo sale el diálogo «Confirmación»: «¿Estás seguro que quieres ejecutar la acción 'Descontabilizar'?». Se pulsó «Aceptar».
- No sale ningún mensaje. La «Fecha contabilización» queda vacía, la Situación (Facturado) y el Estado (Validado) no cambian y el botón pasa a «Contabilizar».
- **Funciona.** El texto pasa a ser un hecho comprobado. Captura nueva `ventas-n-81.webp` (antes de descontabilizar), con hotspot en el botón.
- No se miró en Contabilidad si el asiento 86 desapareció; el ERP lo da por descontabilizado.
- Anotado en `nueva/ventas/NOTAS_VENTAS.md` §9.3 y §9.6.

## 4. Capturas y hotspots

Se revisaron 13 hotspots dibujados sobre su captura: n-57, n-58, n-61 (Sumando), n-65, n-66, n-67, n-69, n-72, n-73, n-75, n-79, n-80 y el nuevo n-81. Todos caen sobre su elemento; no hubo que mover ninguno. En n-58 el rectángulo abarca PED y POF con la etiqueta «POF»: es aceptable, porque el paso compara las dos. Todas las imágenes existen y todos los rectángulos están dentro de 0-100. La única huérfana, `ventas-n-07`, ya lo era antes.

## 5. Correcciones aplicadas

1. **`ventas-1` (G1 cerrado)**
   - Concepto, explicación de la factura y paso 0 de `ventas-1-factura`: «Descontabilizar» pasa de «no comprobado» a hecho comprobado, con su diálogo y su resultado. El paso 0 lleva la captura n-81 y su hotspot.
   - Problema nuevo al final: «facturaste sin descontabilizar», con la solución comprobada.
2. **Checklist de `ventas-1`** (el progreso de «Demo real» va por índice)
   - El cambio había reordenado los 13 puntos: a quien ya llevaba ticks le saldrían marcados otros puntos.
   - Ahora cada índice 0-12 vuelve a significar lo de antes, con los códigos nuevos.
   - Los tres puntos nuevos (descontabilizado, FVOA, ninguna tipología nueva) van **al final**: pasa de 13 a 16 puntos.
3. **`ventas-documentos`**: el aviso de FP{INI} y la última explicación de «Crear la tipología de albarán A{INI}» remiten ahora a la solución comprobada.
4. **Referencias a módulos posteriores** (Carteras e Impuestos van después de Ventas)
   - Se quitan las remisiones a «Domiciliar un cliente…» (3), al módulo de impuestos (1), «Lo cobrarás en el módulo de Carteras» y «se practican en Carteras».
   - «Contabilidad básica» pasa a llamarse por el título real del bloque.
5. **`app/src/lib/progress.ts` (IMPORTANTE, fallo de la migración)**
   - El fallo: un alumno nuevo que abría primero `compras-workflow` guardaba ese bloque sin `compras-workflow-config`. En la lectura siguiente, la migración tomaba ese progreso por el formato viejo y lo repartía mal (su paso 0 de la prueba acababa en la configuración).
   - El arreglo: `conEjercicio` crea vacío `compras-workflow-config` en cuanto se toca `compras-workflow`.
6. Comprobado: los JSON de contenido y glosario cargan y `npm --prefix app run build` termina sin errores. No hay commit.

**Pasos y secciones.** No se añadieron ni se quitaron pasos. Solo cambió la checklist de `ventas-1`, con tres puntos añadidos al final. Los ids no cambiaron.

## 6. Qué queda (no bloquea)

- **IMPORTANTE: iniciales de 3 letras.**
  - El texto dice «con 3 iniciales usa solo 2» (PDJA), pero la plataforma pinta `{INI}` completo: PDJAM, APJAM y la condición `tipdoc IN ('APJAM','AJAM')`.
  - Con 3 letras el alumno teclea APJA y la condición que se le muestra no casa.
  - Ya pasaba en Compras (PC/AO/FC{INI}). Hace falta una decisión: limitar las iniciales a 2 en el alta o un marcador `{INI2}`.
- **IMPORTANTE: AP{INI} se copia de ACL2.**
  - ACL2 es la tipología de otro alumno (CL), y el mapa dice que esas filas no son de la demo.
  - Si alguien la borra, el paso se rompe. Alternativa, sin probar: «Nuevo como» de AV y cambiar el origen a «Pedidos de venta».
- **MEJORA: stock.** Ventas saca 10 + 10 + 5 = 25 unidades del 13500620. Hay que comprobar que lo comprado en Compras llega, o avisar del stock negativo en la demo.
- **MEJORA:** las marcas de Guiado de `ventas-1-tipologia-factura` cambiaron de sentido (de «crear» a «comprobar»). El impacto es pequeño y se deja así.
- **MEJORA:** `ventas-n-02` y `ventas-d-174/175` se repiten en `ventas-documentos` y `ventas-2`.
- **Pendiente de la revisión previa:**
  - I7, ACR o PRO en `compras-tipos`.
  - I8, el momento de vídeo de `compras-workflow-validacion`.
  - El mensaje real con R{INI} sin IBAN.
  - Comprobar en Contabilidad que el asiento del albarán desaparece al descontabilizar.
- **Antes de publicar:** prueba de humo y agentes-junior (skill `criterios-sergi`).
