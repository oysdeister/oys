# Encargo: módulos ICON (Finanzas) en «Practicando Axional Deister VNext»

Worktree: `/Users/sergi.baulies/Downloads/practica-axional-oys/.claude/worktrees/icon-docs-819b1f` (rama `claude/icon-docs-819b1f`). Trabaja SOLO aquí. No hagas commit ni push (lo hace la sesión que te lanza).

## Qué quiere Sergi (nota de reunión)
Guía de parametrización + guía formativa con ejemplos prácticos del módulo de finanzas ICON (versión Next), para gente que ya conoce Axional. Bloques: cuentas a cobrar, cuentas a pagar, contabilidad general, activos fijos, tesorería y cajas, impuestos. Debe cubrir:
- Orden de carga de tablas: qué tablas intervienen y en qué secuencia.
- Dos escenarios: ICON instalado solo, e ICON integrado con documentos IGES (factura de venta → asiento, albarán → asiento).
- Eventos: cambio de estado de cartera que genera asiento.
- Uso avanzado: cuadre de cartera a fecha pasada (p. ej. 31-12, cierre), tablas que intervienen.
- Cada punto de menú: qué hace y cómo, funcional y técnico.

## Fuentes (ya en disco, no hace falta navegador)
- `_fuente/icon/docs/*.md`: documentación oficial `wic_icon` > Finanzas (219 páginas), un fichero por sección. Cabecera de página `=== PAGE <id> | <ruta> | <nombre>`. Capturas citadas como `[IMG <fichero>.webp <ancho>x<alto> — pie]`.
- `_fuente/icon/img/*.webp` (456 capturas) + `_fuente/icon/img_index.json`.
- `_fuente/icon/icon_docs.json`: XML original por si hace falta.
- Ficheros grandes: Diario contable 164 KB, Maestros Impuestos 205 KB, Soportes electrónicos 340 KB (este último fuera de alcance salvo una mención).

## Producto esperado
Módulos nuevos en `app/src/content/icon-<x>.json` con el esquema de `_fuente/ESQUEMA.md` / `app/src/types.ts` (mira `app/src/content/carteras.json` como ejemplo real). Propuesta (ajústala si la documentación lo pide, máximo 6):
1. `icon-parametrizacion` — Visión general de ICON, orden de carga de tablas (empresas, plan contable, terceros, diarios, tipos de efecto, bancos, impuestos…), escenarios solo/integrado con IGES, tipologías de documentos IGES que contabilizan.
2. `icon-contabilidad` — Contabilidad general: diario contable, asientos, procesos periódicos, cierre/apertura, balances.
3. `icon-cartera` — Cuentas a cobrar y a pagar: efectos, gestiones, remesas, procesos, recobros, cambio de estado → asiento, cuadre de cartera a fecha pasada.
4. `icon-tesoreria` — Tesorería y Caja: bancos, extractos, conciliación, cajas, informes de posición. (Fundido en `tesoreria.json` como ejercicios 6 a 8.)
5. `icon-impuestos` — IVA, procesos de impuestos, maestros de impuestos (SII como mención si sale).
6. `icon-activos` — Activos permanentes (amortizaciones).

Por ejercicio: objetivo, concepto, secciones con ruta de menú, explicación funcional y técnica (tablas que intervienen, p. ej. `cefectos`, `capuntes`…, solo si la documentación las nombra), campos, pasos guiados con capturas, avisos, test de 4-5 preguntas, checklist «hazlo en la demo» (6-15 puntos verificables) y problemas típicos. 2-4 ejercicios por módulo.

Reglas de contenido (de Sergi, obligatorias):
- Español de España, tuteo, llano para un junior. Sin comparar con la versión antigua del ERP («antes/ahora», «versión anterior»…).
- No inventes cifras, cuentas, rótulos ni tablas: todo debe salir de la documentación. Si algo no está, no lo pongas.
- Capturas: copia las que uses a `app/public/img/<id-modulo>/` con nombre `<id-modulo>-NNN.webp` y pon ese nombre en `paso.imagen`. Hotspot solo si en la captura se ve claro el elemento (mídelo abriendo la imagen con Read; rectángulo en % con margen). Mejor sin hotspot que con uno mal puesto.
- Si usas `{INI}` sigue la regla de ESQUEMA.md; si no hay códigos con iniciales, no lo uses.
- JSON válido. Ids de ejercicio `icon-cartera-1`… y de sección únicas.

## Registro en la app
- `app/src/content/index.ts`: añade los ids a `ORDEN` (después de `carteras`) y entradas en `META` (color e icono). Comprueba qué iconos existen (busca el componente de iconos que usa `META[...].icono`) y reutiliza uno existente o añade uno nuevo coherente.
- Banco del examen: `app/src/lib/examen.ts` ya toma los `test` de todos los `MODULOS`. Comprueba que añadir 6 módulos no rompe el reparto (p. ej. número fijo de preguntas por módulo, `pasosClic`, `DE_CONTEXTO`, `Desglose.tsx` con `META[b.clave]`, `badges.ts`, `portadaDatos.ts` y la órbita de la portada con N planetas). Si el examen pasa de 30 preguntas fijas, decide un reparto razonable y explícalo.
- Busca otros sitios que enumeren módulos a mano (`grep -rn "carteras" app/src`) y añade ICON donde haga falta (insignias, portada, `videoMapa.ts` no).

## Cómo trabajar (regla de Sergi: delegar el volumen a DeepSeek)
- Usa el MCP `orquestador` (`mcp__plugin_ely-orquestador-deepseek_orquestador__*`): `delegar` con `task: read` (deepseek-v4-flash) para extraer de cada sección una ficha de hechos con citas `PAGE id`, y con `task: write` (deepseek-v4-pro) para redactar el borrador de cada JSON a partir de tu especificación cerrada. Ficheros siempre por ruta en `files`, resultados largos con `out` en `_fuente/icon/work/`. Comprueba las citas con `verificar_citas` y haz `grep` de cifras, rótulos y tablas sospechosos. Muestra el pie de gasto de cada llamada en tu informe.
- Tú (Opus) decides la estructura, revisas y corriges. Lee los JSON finales enteros antes de darlos por buenos.

## Equipo: tú eres el LÍDER
Lanza dos subagentes con la herramienta Agent si la tienes (si no, haz tú esos dos papeles por separado, al final):
1. **Experto funcional ICON**: revisa cada módulo contra `_fuente/icon/docs/` (exactitud, rutas de menú, tablas, orden de carga, escenarios, cuadre a fecha pasada, cambio de estado → asiento), y que tests y checklists sean verificables. Corrige directamente en los JSON.
2. **Experto en diseño y usabilidad**: arranca el servidor de desarrollo (`.claude/launch.json` o `npm run dev` en `app/`, puerto libre, en segundo plano), recorre la portada, los módulos ICON, un ejercicio, el examen y el certificado en escritorio (1440) y móvil (390), modo claro y oscuro, y revisa aspecto (guía `_fuente/DISENO_V3.md`), legibilidad, capturas y hotspots, y que los 6 módulos nuevos encajen en la portada, la barra lateral y la órbita sin romper el diseño. Corrige CSS o componentes si hace falta, con cambios mínimos.

## Cierre
- En `app/`: `npx tsc -b` y `npm run build` limpios.
- Escribe `_fuente/icon/INFORME.md`: módulos y ejercicios creados, ficheros tocados, decisiones (reparto del examen), dudas o datos que no se pudieron comprobar, gasto de DeepSeek.
- Devuelve un resumen corto (≤ 25 líneas).
