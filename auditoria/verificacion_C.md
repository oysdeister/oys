# Verificación C (H41-H56) contra el contenido actual

Nota: el informe no numera las H. Las he asignado por orden: H41-H47 = huecos de cobertura de la sección 05 (Contabilidad: saldos/apertura/plan/mnemotécnicos; plantillas/tipo de asiento/cierre; Cartera: 431/mandato/SEPA; impagados/devoluciones/descuento/parciales; Compras: workflow/40090; Generar factura/descuentos/rápeles/diferencias; devoluciones/abonos/anticipos), H48-H52 = duración/ahorros por módulo, H53 = búsqueda, H54 = índice de errores, H55 = glosario, H56 = guías/fichas.
Ids de bloque entre corchetes; E = explicación, P = pasos, X = problemas.

## H41-H47 cobertura
- Saldos iniciales: 0 apariciones de «saldos iniciales»/«saldo inicial» como tema. «Apertura» solo en [icon-contabilidad-2] (Cerrar y abrir el ejercicio, E+P+X) y [asientos-1] (E). Vigente: no hay bloque de saldos iniciales/asiento de apertura del arranque.
- Plan contable: solo se consulta [maestros-v-1] (Consultar el plan contable). Hay ALTA de una cuenta en [parametrizacion-1] (62999, 10 pasos) y cuentas en [maestros-1] (90 min). Alta de plan completo: no. Vigente parcial (cuenta sí, plan no).
- Mnemotécnicos: [maestros-v-2] (Entender, 15 min, solo lectura), [maestros-1] y [tesoreria-2] los usan en pasos. Alta de mnemotécnicos: no encontrada. Vigente.
- Cierre: [icon-contabilidad-2] (35 min). Todos sus pasos son «Localiza/Recuerda/Consulta»: no se cierra nada. Vigente («sin práctica»).
- Plantillas de contabilización: [icon-contabilidad-1] sección «Entender las plantillas» (3 pasos de lectura), [parametrizacion-icon-2] (40 min, «Entender las plantillas y el permiso Contabilizar»). Nunca se crean/configuran. Vigente.
- Tipo de asiento: solo explicación en [compras-factura], [icon-activos-v-1/v-2], [icon-contabilidad-v-4] (P en v-4 y v-2 de activos son consulta). Sin alta. Vigente.
- 431 (cuentas de efectos): 0 apariciones de «431». Vigente.
- Mandato SEPA: «mandato» 1 vez, solo E en [parametrizacion-icon-1]. SEPA en [carteras-1], [carteras-5], [icon-contabilidad-3] solo como E o mención. Fichero SEPA: no se genera en pasos. Vigente.
- Impagados/devoluciones de efectos: [icon-cartera-1] (E+P+X), [carteras-5] (P), [tesoreria-5] y [tesoreria-6] (E+P). Hay algo de práctica, pero no un bloque de impagado. «devoluci» de efectos: [icon-cartera-v-2/v-3] (P). Vigente parcial: tratado de pasada, sin bloque propio.
- Descuento de efectos: 0 apariciones. Pagos parciales/cobro parcial: 0 en cartera (el «parcial» que sale es de activos y ventas-2). Vigente.
- Workflow/aprobaciones: [parametrizacion-icon-1] (E), [parametrizacion-icon-2] (E+P, como permisos), [icon-contabilidad-3] «aprobaci» (E). Ni en Compras. Vigente.
- 40090 (contabilización del albarán): 0 apariciones. Contabilizar albarán solo en [ventas-1] (sección «Contabilizar el albarán», 8 pasos) y mención en [compras-factura]. Compras no lo practica. Vigente.
- «Generar factura»: 0 en Compras. Solo [tesoreria-7] (5 veces). «Generar albarán»: solo 1 mención en [compras-2]. Vigente.
- Descuentos: hay muchos en [compras-1] (10), [compras-tipos] (6), [compras-2] (5): descuentos de línea y de precios sí; rápeles/rappel: 0 apariciones. Vigente para rápeles.
- Diferencias albarán-factura: «diferencias» solo genéricas (no de compras). Vigente.
- Devoluciones/abonos/anticipos en compras: [compras-tipos] menciona abono (P) y anticipo (E+P) dentro de la tipología; [icon-cartera-v-11] (Anticipos, T+E+P+X), [icon-cartera-3] (anticipos, E+P), [tesoreria-4] (abono/anticipo). Devolución de compra: solo [compras-tipos] 1 mención. Anticipo está cubierto en cartera; abono/devolución de compra no. Vigente parcial (anticipo no es hueco).

## H48-H52 duración y bloques (suma de duracionMin / nº de bloques)
| Módulo | min | h | bloques | problemas |
|---|---|---|---|---|
| maestros | 279 | 4,65 | 7 | 21 |
| compras | 180 | 3,0 | 6 | 20 |
| ventas | 135 | 2,25 | 2 | 10 |
| icon-contabilidad | 521 | 8,7 | 29 | 34 |
| carteras | 495 | 8,25 | 14 | 37 |
| tesoreria | 420 | 7,0 | 12 | 36 |
| icon-impuestos | 199 | 3,3 | 8 | 30 |
| icon-activos | 147 | 2,45 | 8 | 25 |
Total 2376 min (39,6 h) en 86 bloques. El informe dice «80 bloques» (6 de ERP simulado): no cuadra con 86; revisar. Las cifras por módulo del informe (Tesorería 420, Ventas 135, Impuestos 199, Activos 147, Contabilidad 29 bloques/8,7 h, Ventas 2 bloques) SÍ coinciden.
- H49: Ventas crea 5 tipologías: [ventas-1] albarán A{INI} y factura F{INI}; [ventas-2] oferta O{INI}, pedido PV{INI}, albarán A{INI}2 (y «Reutilizar la tipología de factura»). [compras-tipos] ya crea oferta, pedido, albarán y factura. El informe dice «4 ya vistas en compras»: correcto en cuanto a tipos de documento (oferta, pedido, albarán, factura; la A{INI}2 es un 5.º alta repetida). Vigente.
- H52 Almacén: NO existe módulo Almacén. Lo más cercano es [maestros-3] «Registrar y consultar el stock» (45 min: movimientos de almacén 11 pasos, stock global, kardex) dentro de Datos maestros, más almacén en [maestros-2]. El «Almacén ~70 min» del informe no es un módulo actual. Vigente la propuesta (crear módulo ligero o dejarlo en maestros).

## H53 Búsqueda ⌘K (hoy)
- app/src/components/shell/Topbar.tsx:60-65: `todos = todosEjercicios()`; `res` filtra `normal(ejercicio.titulo + objetivo + modulo.titulo).includes(t)` y `.slice(0, 8)`. Atajo ⌘K/Ctrl+K en :69. Solo título + objetivo del bloque + título del módulo (el informe dice «solo títulos»: casi; incluye objetivo). Máx. 8 resultados. No busca secciones, pasos, problemas, ni glosario.
- Cambio mínimo: crear app/src/lib/buscar.ts que, una sola vez (módulo-nivel, perezoso), construya un índice plano de entradas {ejercicioId, seccionId?, tipo, texto normalizado} con titulo+objetivo+concepto de bloque, titulo+paraQueSirve+explicacion de cada sección, pasos[].texto/detalle, problemas[].problema/solucion y GLOSARIO (termino+definicion). Topbar usa `buscar(q, 30)` con puntuación (título 3, sección 2, resto 1, bonus por prefijo), agrupa por bloque, y navega a /ejercicio/:id (para glosario a /glosario#<clave>). Rendimiento: índice con ~2400 min de contenido ≈ unos cientos de KB de texto: construirlo una vez al primer ⌘K (useMemo/lazy) y poner debounce 80 ms; limitar a 30 resultados y mostrar fragmento con la coincidencia. Sin dependencias externas.

## H54 Índice de errores
- Pares problema/solución: 213 en `problemas` (21+20+10+34+37+36+30+25). Coincide con el informe.
- No existe una página que los reúna: se muestran por bloque en la pestaña «demo» (components/exercise/DemoReal.tsx:37-90, `problemasNuevos` en components/exercise/util.ts:99 quita los que ya están en los avisos; ExercisePage.tsx:66 trata ?tab=problemas como demo). No hay ruta /errores.
- Diseño mínimo: ruta `<Route path="/errores" element={<Errores />} />` en app/src/App.tsx junto a /glosario (:127); página app/src/pages/Errores.tsx copiando Glosario.tsx (buscador con `normaliza`, `resaltar`, atajo «/», filtro por módulo con META, chips) y reusando glosario.css (o errores.css que importe sus tokens). Datos: `todosEjercicios().flatMap(...problemas)` → {modulo, ejercicio, problema, solucion}; lista de tarjetas con enlace a `/ejercicio/<id>?tab=demo#problemas`. Enlaces: añadir `{ to: '/errores', label: 'Errores', icon: 'alerta' }` a PRACTICA en components/shell/Sidebar.tsx:13-20, y etiqueta en Topbar.tsx:22 (mapa de rutas→título). Opcional: aplicar `problemasNuevos` o mostrar los 213 enteros.

## H55 Glosario
- 8 ficheros en app/src/content/glosario/. 435 entradas, 367 términos únicos (por minúscula). Duplicados: 50 términos repetidos (68 entradas sobrantes; el informe dice 63: mismo orden de magnitud, la diferencia es el criterio de normalización). Ejemplos entre ficheros: base imponible (4 ficheros), cartera de efectos, remesa, efecto, tercero, vencimiento, IVA, plan contable, debe y haber; y duplicados dentro del mismo fichero: apunte, asiento, debe, haber, ejercicio, empresa, periodo, consolidación, registro fiscal (icon-contabilidad). Nota: glosario.ts:44-75 ya fusiona por `claveDe` en tiempo de ejecución (modulos[], alias), así que la UI no repite términos; la limpieza es de datos. El informe y la lista de duplicados siguen vigentes en los ficheros.
- Faltantes: «tipología» EXISTE (icon-contabilidad y maestros) y «tipología de documento»; «N43» EXISTE como «n43 (norma 43)»; «PMICDT» NO existe (aparece solo en tesoreria.json:316,436,1163 como operación). Vigente solo para PMICDT; tipología y N43 ya están (H55 sobreafirma).

## H56 Guías / fichas
- No hay guías de parametrización ni fichas por maestro: ningún componente ni contenido con ese nombre. Lo más parecido: la tabla «Códigos del alumno» (maestros.json:22), la sección «circuito»/«navegacion» de cada Módulo (campos del tipo Modulo) y `campos-pos.json` (campos de pantallas). Vigente.
