# Redacción del módulo 5 · Cartera (`app/src/content/carteras.json`)

Se tocan los 18 bloques. No cambia ningún `id`, paso, `imagen`, `hotspot`, `pregunta`, `campo`, test ni cifra de los pasos. Comprobado: el JSON carga y `npm --prefix app run build` pasa. Todos los pasos del módulo tienen ya `detalle`, todas las partes tienen `ruta` y todos los `concepto` cierran con «Dónde: …».

Cambios comunes: `concepto` reescrito con consecuencia para la empresa, términos explicados en línea (efecto, cartera, vencimiento, tercero, asiento, debe y haber, tesorería, remesa, gestión, conciliada, numerador, plantilla), frase puente `Ejemplo:` con el hilo del caso (venta de 242,00 a C{INI} en dos efectos de 121,00: uno suelto y otro en remesa SEPA; pago de 151,25 a T{INI} por remesa) y un `problemas` más cuando el bloque tenía menos de 3.

## Prioridad alta
- `carteras-1`: concepto nuevo; dice que CAR{INI} no es el proveedor T{INI}; define debe, haber, serie, diario, tipología, tesorería y remesa donde salen; 3 `detalle` nuevos o ampliados; 2 problemas nuevos («No encuentro la pantalla», «No me deja guardar»); `aprendido` enlaza con los 151,25.
- `icon-cartera-v-1`: puente 118,50 USD / 440,70 frente a los 151,25 y 121,00 del caso; `ruta` de «vencimientos»; `detalle` de los pasos que faltaban; nota del vídeo sin «TRI»; 3.er problema.
- `icon-cartera-v-2`: puente con 151,25 y explicación de divisa y de la diferencia de cambio; «Pagos regularizar» aclarado; `detalle` en los pasos sin resultado.
- `icon-cartera-v-3`: puente con empresa 001, PEN y USD; «caducidad Sí» explicada; `ruta` en «selección» y «cierre»; `detalle` en 9 pasos; 4.º problema.
- `icon-cartera-v-5`: puente con la remesa de pago a T{INI} (151,25, BBVA_{INI}) frente a 00087, PRVCC0 y 1.815,00; `ruta` en «selección» y «agregar»; `detalle` nuevos; 2 problemas nuevos.
- `icon-cartera-v-6`: corregido «Al haber va la 10000.00087». Ahora dice que en el PGC la 100 es Capital, que en esa base de formación la 100… hace de cuenta del banco y no de capital, que no se debe copiar, y que en una empresa real iría la 401 con el banco (572) por tesorería. Se alinean `campos`, paso 2 de «asiento-tesoreria», `aprendido` y `checklist`. Puente con 151,25, `ruta` en «evolucionar» y «extracto», frases cortas y un problema nuevo.

## Prioridad media
- `icon-cartera-v-7`: concepto con consecuencia y puente (TF de 151,25); `ruta` en las dos partes que no la tenían (terceros y remesas); `detalle` en los 4 pasos; 2 problemas nuevos con la ruta de la ficha del tercero.
- `icon-cartera-v-4`: puente BBVA_{INI} frente a PRVCC0; `ruta` en «tipos»; `detalle` en 5 pasos; problema nuevo.
- `icon-cartera-2`: ejemplo con 151,25; «conciliada» explicada; `cefecges_estado_ava_05` traducido; `ruta` en «errores»; `detalle` en 8 pasos; problema `_11`.
- `carteras-5`: concepto con la frase puente de los dos efectos de 121,00; «Abrir» y gestión explicadas antes; `detalle` en 8 pasos; problema nuevo.
- `carteras-7`: ejemplo con 151,25 frente a 8.080,15 y 40100.00003; fuera «demo TRI»; `detalle` ampliados; problema nuevo.
- `carteras-3`: BBVA_{INI} enlazado con el caso (3.077,25); numerador explicado; `detalle` en 3 pasos; problema nuevo.
- `icon-cartera-1`: ejemplo con 151,25; `cefectos_p_pagda`/`cefectos_p_pagd` explicado como nombre interno de la plantilla; «Dónde».

## Prioridad baja y bloques nuevos
- `icon-cartera-3`: nombres internos (`numefe`, `opeant`, `camope`, `cefecges_det`) aclarados; el ejemplo de 500 € marcado como ajeno al caso.
- `cartera-cobro-parcial`: concepto con consecuencia, puente (efectos de 121,00 frente a 242,00) y `detalle` en 7 pasos; problema nuevo.
- `cartera-mandato-sepa`: solo formato. Contenido contable intacto (572 al debe y 430/431 al haber). Consecuencia en el primer párrafo, hilo con el efecto 2 en remesa SEPA (LRC{INI}), «Dónde» y `detalle` en 10 pasos.
- `cartera-impagado-devolucion`: solo formato. Contenido contable intacto (43150 al debe y 572 al haber). Consecuencia, hilo con el efecto de 121,00 que pasa a DV, «Dónde» y `detalle` en 5 pasos.
- `cartera-descuento`: consecuencia, aclaración de que el caso no usa descuento, «Dónde», `detalle` en 6 pasos y un problema nuevo.

## Pendiente de comprobar
- Las `ruta` nuevas salen de rutas ya escritas en el propio bloque; no se han vuelto a navegar en la demo.
- `Ejemplo:` de `icon-cartera-v-2`/`-v-3`: «con euros no habría diferencia» es razonamiento, no captura.
