# Vídeos por tabla de finanzas — inventario y decisiones

Encargo: un vídeo por tabla o maestro de finanzas (para qué sirve y cómo se parametriza), colocado como tarjeta «Mira primero el vídeo» al principio de la sección que explica esa tabla. Release: `video-tablas-fin-v1`. Serie: `app/src/content/video-tablas-fin.ts`.

## Calidad de las grabaciones de los ponentes

Los clips publicados (`video-finanzas-v1`, `video-tesoreria-v1`) son recortes del vídeo de Meet con muy poca tasa de bits (17–100 kbps). Lo que se puede salvar depende del original:

| Sesión (original en `~/Downloads/VNEXT Doumentacion`) | Original | Clip publicado | Veredicto |
|---|---|---|---|
| 1. Capacitación maestros contables (`fin-maestros`) | 852×480 | 720×338, 17 kbps | Ilegible: no se salva → vídeo nuevo |
| 4. Módulo de Cobros y Pagos (`fin-cobros`) | 1920×1080 | 1510×720, 100 kbps | Salvable: recorte del ERP desde el original |
| 3. TAX – Tablas maestras (`fin-tax-tablas`) | 2048×1152 | 1276×720, 84 kbps | Salvable |
| 5. Asientos contables en tipologías (`fin-asientos`) | 1920×1080 | 1500×720, 88 kbps | Salvable |
| Tesorería 1 y 2 (`tesoreria-1`, `tesoreria-2`) | 1152–1280×720 | 1100×538, 38–65 kbps | Letra de 6 px: no se salva → vídeo nuevo |
| Formación ICON 1 / 1.1 / 2 (`fin-icon1`, `fin-icon11`, `fin-icon2`) | 1920×1080 | — | Solo tocan tablas de pasada (≤ 40 s): vídeo nuevo |

En las series de los ponentes, `inicio + t` del clip = segundo del original (comprobado con fotogramas).

## Decisión por tabla

Leyenda: **Nuevo** = vídeo Remotion con pantallas reales de la demo (grabadas a 2×, 2560×1440; render 1920×1080), callouts, voz Ximena y logo O&S. **Mejorado** = trozo del original de los ponentes recortado a la zona del ERP, a 1920×1080, con nitidez y buena tasa de bits. **Sin cambios** = ya lo explica un vídeo propio de O&S de buena calidad.

### Contabilidad general (`icon-contabilidad`)

| Tabla | Sección donde va | Ponentes (release · clip · minuto) | Calidad | Decisión |
|---|---|---|---|---|
| Plan y cuentas contables (`ccuentas`) | parametrizacion-1-cuenta | finanzas-v1 · maestros-cap01 1:02 y cap02 0:00–5:45 | Ilegible | Nuevo |
| Grupos auxiliares (`cctaauxh`) | parametrizacion-3-grupo | — | — | Nuevo |
| Proyectos (`cproyect`) | parametrizacion-5-proyecto | — | — | Nuevo |
| Secciones (`cseccion`) | parametrizacion-6-seccion | — | — | Nuevo |
| Numeradores de justificantes (`cjusnumh`) | asientos-2-numerador | — | — | Nuevo |
| Plantillas de contabilización (`ccon_template_xls`) | icon-contabilidad-1-plantillas, parametrizacion-icon-2-plantillas-permiso | — | — | Nuevo |
| Diarios | asientos-1-diario, icon-contabilidad-1-diario | — (tutorial O&S con-cap03 0:26) | Buena | Sin cambios |
| Ejercicios y periodos (`cejercic`, `cperiodo`) | icon-contabilidad-1-configuracion, icon-contabilidad-v-4-periodos, asientos-6-vigencia | finanzas-v1 · icon11-cap06 0:00 (65 s); tutorial O&S con-cap03 0:46 | Buena (tutorial) | Sin cambios |

### Cartera, cobros y pagos (`carteras`)

| Tabla | Sección donde va | Ponentes | Calidad | Decisión |
|---|---|---|---|---|
| Plazos de pago | carteras-1-plazo | — | — | Nuevo |
| Tipos de efecto | carteras-1-tipo-efecto | finanzas-v1 · cobros-cap02 0:34–2:18 | Salvable | Mejorado |
| Estados de efecto | icon-cartera-1-estados, carteras-5-estados | finanzas-v1 · cobros-cap02 2:18–4:30 y cobros-cap04 0:00–2:04 | Salvable | Mejorado |
| Acciones sobre efectos | icon-cartera-1-acciones | finanzas-v1 · cobros-cap07 0:00–4:39 | Salvable | Mejorado |
| Bancos propios y cajas | carteras-3-banco, carteras-3-caja, tesoreria-1-banco | finanzas-v1 · icon1-cap02 4:01 (de pasada) | Pequeña | Nuevo |
| Remesas por cuenta (tipos de remesa del banco) | carteras-5-remesa-banco, icon-cartera-v-5-remesas-por-cuenta, icon-cartera-v-4-tipos | finanzas-v1 · icon1-cap06 2:36, icon11-cap03 2:13 (≤ 25 s) | Pequeña | Nuevo |

### Tesorería (`tesoreria`)

| Tabla | Sección donde va | Ponentes | Calidad | Decisión |
|---|---|---|---|---|
| Comisiones del banco | tesoreria-1-comisiones, asientos-14-comision | — | — | Nuevo |
| Flujos financieros | tesoreria-2-flujo | tesoreria-v1 · cap02 (54 s) | Ilegible | Nuevo |
| Operaciones financieras y parámetros de conciliación | tesoreria-2-operacion, tesoreria-2-conciliacion | tesoreria-v1 · cap01 (38 s), cap09 0:25–3:31 | Ilegible | Nuevo |
| Parámetros de tesorería | tesoreria-2-parametros | — | — | Nuevo |
| Conceptos comunes (N43) | tesoreria-4-comunes | tesoreria-v1 · cap09 3:31 | Ilegible | Nuevo |
| Conceptos propios | tesoreria-4-propios | tesoreria-v1 · cap08 0:00–4:50 | Ilegible | Nuevo |
| Definición de cajas | tesoreria-6-configuracion | — | — | Nuevo |

### Impuestos (`icon-impuestos`)

| Tabla | Sección donde va | Ponentes | Calidad | Decisión |
|---|---|---|---|---|
| Zonas fiscales | icon-impuestos-1-zonas | finanzas-v1 · tax-tablas-cap02 3:49, cap04 4:11 (contexto Perú) | Salvable, poco centrado | Nuevo |
| Clases de impuestos | icon-impuestos-1-clases-tipos | finanzas-v1 · tax-tablas-cap02 1:39 (de pasada) | — | Nuevo |
| Tipos de impuestos | icon-impuestos-1-clases-tipos, icon-impuestos-v-2-tipo-impuesto | finanzas-v1 · tax-tablas-cap05 5:26–8:10 | Salvable | Mejorado |
| Operaciones impositivas | icon-impuestos-1-operaciones | finanzas-v1 · tax-tablas-cap01 1:57 (de pasada) | — | Nuevo |
| Claves fiscales (artículo, tercero, documento) | icon-impuestos-1-claves | finanzas-v1 · tax-tablas-cap02 3:18 (30 s) | — | Nuevo |
| Reglas de asignación | icon-impuestos-v-2-regla-2586, icon-impuestos-1-reglas-agencia | finanzas-v1 · tax-tablas-cap04 1:28–4:11 | Salvable | Mejorado |

### Activos fijos (`icon-activos`)

| Tabla | Sección donde va | Ponentes | Calidad | Decisión |
|---|---|---|---|---|
| Grupos contables y fiscales del activo | icon-activos-1-config | finanzas-v1 · asientos-cap05 1:12–4:59 | Salvable | Mejorado |
| Bienes | icon-activos-1-bien | finanzas-v1 · asientos-cap05 0:00–1:12 | Salvable, corto | Nuevo |
| Valores y sistemas de amortización | icon-activos-2-sistemas | finanzas-v1 · asientos-cap06 1:17–2:48 (proyección, no la tabla) | — | Nuevo |

Elementos y componentes del activo no son tablas de parametrización (son el activo concreto): se quedan con los vídeos que ya tienen.

## Resultado

Publicado el 23-11-2026 en 4 tandas (Tesorería; Cartera; Activos; Contabilidad; Impuestos). 22 nuevos, 6 mejorados, 2 sin cambios.
Regenerar la serie: `python3 _fuente/gen_video_tablas.py`; prueba de humo: `node _fuente/humo_tablas.mjs http://localhost:4791/` con `vite preview` (92 rutas, 37 tarjetas, 0 errores).
Fuentes de trabajo (fuera de git): `optimistic-blackwell-254536/nueva/fin/tab-{con,car,tes,imp,act}` (guiones, grabaciones, ENTREGA.md) y `tab-mej` (prep.py, subs.py, plantilla Remotion de los mejorados).

| Módulo | Tabla | Resultado | Duración | Fichero en la release |
|---|---|---|---|---|
| Contabilidad general | Cuentas contables | Nuevo | 2:11 | `con-cuentas-contables.mp4` |
| Contabilidad general | Grupos auxiliares | Nuevo | 1:38 | `con-grupos-auxiliares.mp4` |
| Contabilidad general | Proyectos | Nuevo | 1:38 | `con-proyectos.mp4` |
| Contabilidad general | Secciones | Nuevo | 1:29 | `con-secciones.mp4` |
| Contabilidad general | Numeradores de justificantes | Nuevo | 1:55 | `con-numeradores-justificantes.mp4` |
| Contabilidad general | Plantillas de contabilización | Nuevo | 1:52 | `con-plantillas-contabilizacion.mp4` |
| Contabilidad general | Diarios | Sin cambios (tutorial con-cap03, 0:26) | 1:36 (capítulo) | `video-tutoriales-fin-v1/con-cap03.mp4` |
| Contabilidad general | Ejercicios y periodos | Sin cambios (tutorial con-cap03, 0:46) | 1:36 (capítulo) | `video-tutoriales-fin-v1/con-cap03.mp4` |
| Cartera, cobros y pagos | Plazos de pago | Nuevo | 2:24 | `car-plazos-pago.mp4` |
| Cartera, cobros y pagos | Bancos propios y cajas | Nuevo | 2:16 | `car-bancos-propios-cajas.mp4` |
| Cartera, cobros y pagos | Remesas por cuenta | Nuevo | 2:04 | `car-remesas-por-cuenta.mp4` |
| Cartera, cobros y pagos | Tipos de efecto | Mejorado | 1:45 | `mej-tipos-efecto.mp4` |
| Cartera, cobros y pagos | Estados de efecto | Mejorado | 3:37 | `mej-estados-efecto.mp4` |
| Cartera, cobros y pagos | Acciones sobre efectos | Mejorado | 3:51 | `mej-acciones-efecto.mp4` |
| Tesorería | Comisiones del banco | Nuevo | 2:08 | `tes-comisiones-banco.mp4` |
| Tesorería | Flujos financieros | Nuevo | 2:00 | `tes-flujos-financieros.mp4` |
| Tesorería | Operaciones financieras | Nuevo | 2:04 | `tes-operaciones-financieras.mp4` |
| Tesorería | Parámetros de tesorería | Nuevo | 1:50 | `tes-parametros-tesoreria.mp4` |
| Tesorería | Conceptos comunes | Nuevo | 1:57 | `tes-conceptos-comunes.mp4` |
| Tesorería | Conceptos propios | Nuevo | 2:07 | `tes-conceptos-propios.mp4` |
| Tesorería | Definición de cajas | Nuevo | 1:32 | `tes-definicion-cajas.mp4` |
| Impuestos | Zonas fiscales | Nuevo | 2:21 | `imp-zonas-fiscales.mp4` |
| Impuestos | Clases de impuestos | Nuevo | 2:10 | `imp-clases-impuestos.mp4` |
| Impuestos | Tipos de impuestos | Mejorado | 2:45 | `mej-tipos-impuesto.mp4` |
| Impuestos | Reglas de asignación de impuestos | Mejorado | 2:44 | `mej-reglas-impuesto.mp4` |
| Impuestos | Operaciones impositivas | Nuevo | 2:31 | `imp-operaciones-impositivas.mp4` |
| Impuestos | Claves fiscales | Nuevo | 2:33 | `imp-claves-fiscales.mp4` |
| Activos fijos | Bienes | Nuevo | 2:10 | `act-bienes.mp4` |
| Activos fijos | Valores de amortización | Nuevo | 1:52 | `act-valores-amortizacion.mp4` |
| Activos fijos | Grupos contables y fiscales del activo | Mejorado | 3:48 | `mej-grupos-activo.mp4` |
