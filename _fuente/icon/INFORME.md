# Informe: módulos de Finanzas (documentación oficial «wic_icon > Finanzas»)

Fuente: `_fuente/icon/docs/*.md` (219 páginas) y `_fuente/icon/img/` (capturas WebP). Todo lo leyó y redactó DeepSeek a través del MCP orquestador. Claude fijó la estructura, revisó y corrigió. Ningún título visible lleva «ICON»: los ids internos `icon-*` se mantienen.

## Módulos y ejercicios

**En la app (en `ORDEN`, después de `carteras`):**

| Módulo (id · título) | Ejercicios |
|---|---|
| `icon-contabilidad` · Contabilidad general (corto: «Contabilidad») | `icon-contabilidad-1` Estructura del diario: diarios, periodos y plantillas · `icon-contabilidad-2` Procesos periódicos: cierre y apertura del ejercicio · `icon-contabilidad-3` Balances y consolidación |
| `icon-cartera` · Cobros y pagos | `icon-cartera-1` Parametrización de la cartera: estados, acciones y enlaces contables · `icon-cartera-2` Cambio de estado que genera asiento · `icon-cartera-3` Procesos avanzados y cuadre de la cartera a una fecha pasada |
| `icon-impuestos` · Impuestos | `icon-impuestos-1` De dónde sale el impuesto de una línea · `icon-impuestos-2` Registro fiscal, tipos y reglas de IVA · `icon-impuestos-3` Liquidación y regularización · `icon-impuestos-4` Integridad de los impuestos |
| `icon-activos` · Activos fijos | `icon-activos-1` Estructura y configuración del inmovilizado · `icon-activos-2` Amortizaciones, cambios y bajas |

**Ampliación de un módulo existente:** `parametrizacion.json` lleva dos ejercicios nuevos al final. Los seis que ya había no se han tocado.
- `parametrizacion-icon-1`: Orden de carga de las tablas de Finanzas.
- `parametrizacion-icon-2`: Dos escenarios, Finanzas sola o integrada con los documentos de gestión (IGES).

**Fuera de `ORDEN`, para fusionar en `tesoreria.json`:** `icon-tesoreria.json` (id `icon-tesoreria`). `import.meta.glob` lo carga, pero `MODULOS` no lo incluye: no sale en la portada, el menú ni el examen. Comprobado con build.
- `icon-tesoreria-1`: Cajas de efectivo.
- `icon-tesoreria-2`: Financiación y líneas financieras.
- `icon-tesoreria-3`: Cartera de valores, avales e informes de posición.

No repite lo que ya cubre la sesión `videos-tesoreria`: banco propio, N43, conciliación ni movimiento manual.

**Candidatos a la fusión con `videos-icon`:**
- Los cuatro ejercicios `icon-impuestos-*` van al módulo «Impuestos».
- Los tres ejercicios `icon-cartera-*` van a «Cobros y pagos».

Todos los ids de ejercicio y de sección llevan su prefijo, y cada ejercicio se entiende por sí solo.

**No incluido, por el reparto con otras sesiones:**
- La introducción, duplicación y listado de asientos (`asientos.json` no se ha tocado).
- Las altas paso a paso de maestros contables y de impuestos.
- Las remesas paso a paso.
- Banco propio, extractos y conciliación.
- Los temas de `carteras.json` (plazo de pago, tipo de efecto, condiciones, bancos propios). No se ha añadido ningún `carteras-icon-N`, porque lo nuevo ya está en `icon-cartera`.

Cada ejercicio trae concepto, 3-5 secciones con ruta, explicación funcional y párrafo «Por dentro:» con las tablas que nombra la documentación, campos, pasos con capturas, avisos, 5 preguntas de test, checklist de 8-12 puntos y problemas típicos. Capturas: `app/public/img/<id>/<id>-NNN.webp` y `app/public/img/parametrizacion/parametrizacion-icon-NNN.webp`. No llevan hotspots: no se midieron, y la norma es «mejor sin hotspot que mal puesto».

## Ficheros tocados
- Nuevos: `app/src/content/icon-{contabilidad,cartera,impuestos,activos,tesoreria}.json` y `app/public/img/icon-*/`.
- Ampliado: `app/src/content/parametrizacion.json` (2 ejercicios al final) y `app/public/img/parametrizacion/parametrizacion-icon-*.webp`.
- `app/src/content/index.ts`: `ORDEN`, `META` (colores e iconos propios) y `esFinanzas()`.
- `app/src/components/Icon.tsx`: iconos `libro`, `cobros`, `impuestos` y `activos`.
- `app/src/pages/portadaDatos.ts`: `FICHAS` de los 4 módulos (frase, aprendes, circuito), redactadas por DeepSeek. Los literales se comprobaron con grep.
- `app/src/lib/examen.ts`: reparto del examen (ver abajo), `META_CORTO`, `ORDEN_MOD` y exclusiones de finanzas.
- `app/src/lib/badges.ts`, `app/src/pages/Examen.tsx`, `app/src/pages/Home.tsx`, `app/src/components/Onboarding.tsx` y `app/src/components/examen/CertificadoSVG.tsx`: textos que hablaban de «seis módulos».
- Diseño (subagente): `app/src/components/escena3d/EscenaPortada.tsx` (10 planetas sin solaparse; las etiquetas del fondo salen más pequeñas y tenues) y `app/src/components/examen/EscenaExamen.tsx` (colores desde `ORDEN` y `META`).
- Trabajo: `_fuente/icon/work/` (fichas `hechos-*.md`, verificaciones `verify-*.md`, borradores, `spec-comun.md`, `check.py`, `integrar.py` y `gasto.log`).

## Reparto del examen (decisión)
Antes la teoría tenía 30 preguntas: 6 de test, 6 de clic, 10 de vídeo y 8 de otros tipos. Ahora hay un test por módulo: los 6 de los manuales más los 4 de finanzas, es decir, `REPARTO.test = 10`.

Los clics siguen siendo 6, porque los módulos de finanzas no tienen zonas marcadas. Así la teoría pasa a **34 preguntas** y `MIN_TEORIA` sube de 40 a **45 minutos**. Se eligió así para que cada módulo cuente en el desglose sin quitar preguntas de vídeo ni de criterio.

Los módulos de finanzas quedan fuera de las preguntas «Ordenar el circuito», porque sus circuitos son conceptuales. También quedan fuera de las de rutas de menú, porque las rutas salen del árbol de la documentación y no se han comprobado en la demo.

## Revisión
1. DeepSeek `verify` comparó cada módulo con la documentación original y DeepSeek aplicó sus correcciones (tablas en `verify-*.md`). Las más relevantes:
   - Reapertura antes del cierre definitivo.
   - La auditoría automática por IA solo marca `punteo = P`.
   - El plan contable va antes que la empresa.
   - Los botones de anticipos son «Generar Efectos» y «Eliminar Efectos».
   - Las bajas de activos solo generan apuntes de amortización pendiente si esta existe.
2. Experto funcional (Claude, por muestreo con grep):
   - Corrigió 6 preguntas de test.
   - Reescribió unos 30 puntos de checklist que no se podían comprobar en una demo.
   - Quitó referencias a páginas y la palabra «icon» de `icon_chk_costes`.
   - Comprobó con grep las tablas y los códigos citados.
3. Experto en diseño (una pasada, unas 10 capturas, sin `javascript_tool`): ver los ficheros de diseño de arriba. Dijo que los módulos nuevos no tenían imágenes; se comprobó y es un error suyo, porque las 83 capturas referenciadas existen en `public/img`.
4. `npx tsc -b` y `npm run build` terminan limpios. Solo queda el aviso de tamaño de chunk, que ya salía antes.

## Dudas y datos que no se pudieron comprobar
- **Cuadre de cartera a fecha pasada:** la documentación no describe ningún informe ni consulta de cartera a una fecha, ni de cuadre entre cartera y contabilidad. El ejercicio `icon-cartera-3` lo dice en una nota y razona con lo que sí consta:
  - `cefectos` (estado, `feccon`) y el histórico `cefechis`.
  - `cefecges_pcs.pcs_fecpro` y su índice por empresa, fecha y estado.
  - `cefecges_det` y los asientos con origen `cefecges_pcs`.
  - En contabilidad: saldos históricos por periodo.
- **Escenario integrado:** las páginas de documentos IGES (733-735) no dicen qué tipología genera qué asiento. Se explica con lo que consta:
  - las plantillas de contabilización con hojas `capuntes`, `cimpcont` y `cefectos`;
  - el permiso «Contabilizar» con valores Real y Diferido;
  - lo que genera la factura financiera: asiento, efectos y registro fiscal (diario VE en ventas).
- **Contradicciones en la documentación de impuestos:**
  - `taxh_ereport` para SII Pagos vale 5 en el modelo de datos y 2 en el proceso.
  - `taxh_tiprec` invierte 2 y 3 entre las páginas 949 y 977.
  - Se explica en el texto y no se pregunta en el test.
- **Orden de carga:** solo una parte es explícita en la documentación (tercero de la empresa, plan contable, ejercicio y periodos, permisos, tipologías, plantilla por origen). El resto se deduce de los campos y el texto lo marca así.
- **Rutas de menú:** salen del árbol de la documentación, sin comprobar en la demo.
- **Pendiente de comprobar a ojo:** el tema claro con 10 planetas y la portada en móvil después de la animación de entrada. Quedan unas 20 notas honestas del tipo «la documentación no describe…».

## Gasto de DeepSeek (llamadas de esta sesión, desde `gasto.log`)
- ⎿ read hechos-parametrizacion · deepseek-v4-flash · gastado $0.0225 · equivalente Opus $1.833 (ahorro $1.810, 99%)
- ⎿ read hechos-contabilidad · deepseek-v4-flash · gastado $0.0233 · equivalente Opus $1.891 (ahorro $1.867, 99%)
- ⎿ read hechos-cartera · deepseek-v4-flash · gastado $0.0175 · equivalente Opus $1.444 (ahorro $1.427, 99%)
- ⎿ read hechos-tesoreria · deepseek-v4-flash · gastado $0.0209 · equivalente Opus $1.720 (ahorro $1.699, 99%)
- ⎿ read hechos-impuestos · deepseek-v4-flash · gastado $0.0247 · equivalente Opus $1.981 (ahorro $1.957, 99%)
- ⎿ read hechos-activos · deepseek-v4-flash · gastado $0.0102 · equivalente Opus $0.972 (ahorro $0.962, 99%)
- ⎿ read hechos-contabilidad-b · deepseek-v4-flash · gastado $0.0047 · equivalente Opus $0.310 (ahorro $0.306, 98%)
- ⎿ read hechos-parametrizacion-b · deepseek-v4-flash · gastado $0.0117 · equivalente Opus $0.988 (ahorro $0.976, 99%)
- ⎿ read hechos-activos-b · deepseek-v4-flash · gastado $0.0082 · equivalente Opus $0.712 (ahorro $0.704, 99%)
- ⎿ read hechos-tesoreria-b · deepseek-v4-flash · gastado $0.0075 · equivalente Opus $0.984 (ahorro $0.977, 99%)
- ⎿ read hechos-integracion · deepseek-v4-flash · gastado $0.0093 · equivalente Opus $0.994 (ahorro $0.985, 99%)
- ⎿ write icon-parametrizacion (borrador 1) · deepseek-v4-pro · gastado $0.0427 · equivalente Opus $0.988 (ahorro $0.945, 96%)
- ⎿ write icon-contabilidad (borrador 1) · deepseek-v4-pro · gastado $0.0345 · equivalente Opus $1.124 (ahorro $1.090, 97%)
- ⎿ write icon-cartera (borrador 1) · deepseek-v4-pro · gastado $0.0697 · equivalente Opus $1.951 (ahorro $1.881, 96%)
- ⎿ write icon-tesoreria (borrador 1) · deepseek-v4-pro · gastado $0.0450 · equivalente Opus $1.095 (ahorro $1.050, 96%)
- ⎿ write icon-impuestos (borrador 1) · deepseek-v4-pro · gastado $0.0336 · equivalente Opus $0.818 (ahorro $0.785, 96%)
- ⎿ write icon-activos (borrador 1) · deepseek-v4-pro · sin respuesta en 1920 s (timeout del MCP)
- ⎿ read hechos-tesoreria-c · deepseek-v4-flash · gastado $0.0093 · equivalente Opus $1.052 (ahorro $1.043, 99%)
- ⎿ read hechos-impuestos-b · deepseek-v4-flash · gastado $0.0021 · equivalente Opus $0.296 (ahorro $0.294, 99%)
- ⎿ write parametrizacion-icon (2 ejercicios) · deepseek-v4-pro · gastado $0.0405 · equivalente Opus $0.863 (ahorro $0.823, 95%)
- ⎿ write icon-cartera v2 · deepseek-v4-pro · gastado $0.0375 · equivalente Opus $0.792 (ahorro $0.755, 95%)
- ⎿ write icon-contabilidad v2 · deepseek-v4-pro · gastado $0.0434 · equivalente Opus $0.923 (ahorro $0.880, 95%)
- ⎿ write icon-activos (reintento, más corto) · deepseek-v4-pro · gastado $0.0227 · equivalente Opus $0.554 (ahorro $0.531, 96%)
- ⎿ write icon-impuestos v2 · deepseek-v4-pro · gastado $0.0654 · equivalente Opus $1.818 (ahorro $1.753, 96%)
- ⎿ write icon-tesoreria v2 · deepseek-v4-pro · gastado $0.0312 · equivalente Opus $0.704 (ahorro $0.673, 96%)
- ⎿ verify icon-cartera · deepseek-v4-flash · gastado $0.0158 · equivalente Opus $0.983 (ahorro $0.967, 98%)
- ⎿ verify icon-contabilidad · deepseek-v4-flash · gastado $0.0194 · equivalente Opus $1.111 (ahorro $1.092, 98%)
- ⎿ verify icon-impuestos · deepseek-v4-flash · gastado $0.0221 · equivalente Opus $1.184 (ahorro $1.162, 98%)
- ⎿ verify icon-tesoreria · deepseek-v4-flash · gastado $0.0190 · equivalente Opus $2.386 (ahorro $2.367, 99%)
- ⎿ verify icon-activos · deepseek-v4-flash · gastado $0.0091 · equivalente Opus $0.695 (ahorro $0.685, 99%)
- ⎿ verify parametrizacion-icon · deepseek-v4-flash · gastado $0.0177 · equivalente Opus $0.999 (ahorro $0.981, 98%)
- ⎿ write fix icon-cartera · deepseek-v4-pro · gastado $0.0255 · equivalente Opus $0.617 (ahorro $0.592, 96%)
- ⎿ write fix icon-contabilidad · deepseek-v4-pro · gastado $0.0214 · equivalente Opus $0.516 (ahorro $0.494, 96%)
- ⎿ write fix icon-impuestos · deepseek-v4-pro · gastado $0.0330 · equivalente Opus $0.785 (ahorro $0.752, 96%)
- ⎿ write fix icon-tesoreria · deepseek-v4-pro · gastado $0.0281 · equivalente Opus $0.678 (ahorro $0.650, 96%)
- ⎿ write fix icon-activos · deepseek-v4-pro · gastado $0.0210 · equivalente Opus $0.528 (ahorro $0.507, 96%)
- ⎿ write fix parametrizacion-icon · deepseek-v4-pro · gastado $0.0203 · equivalente Opus $0.512 (ahorro $0.492, 96%)
- ⎿ write FICHAS portada · deepseek-v4-pro · gastado $0.0357 · equivalente Opus $0.580 (ahorro $0.545, 94%)

**Total de esta sesión:** 38 llamadas (37 con respuesta; activos v1 agotó el tiempo), **$0,93 gastados** en DeepSeek frente a unos $38,4 de Opus equivalente (unos $37,5 ahorrados).
El experto funcional no usó DeepSeek. `delegar_gasto` del día (todas las sesiones de Sergi, no solo esta): 150 llamadas, $2,4844 gastados, $93,40 de Opus equivalente y $90,92 ahorrados.
