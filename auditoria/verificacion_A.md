# Verificación A (solo lectura) de H01, H04–H17, H22, H40

Repo: /Users/sergi.baulies/Downloads/practica-axional-oys/.claude/worktrees/strange-raman-307052 (rutas relativas a `app/src/`).

Notas de método
- El informe no trae códigos H**. Los he deducido por el orden de las tablas/viñetas del informe: sección 3 = H01–H08 (portada/M1, demo real, Compras 4-5, «Códigos del alumno», Compras 5 práctica, Activos 4 AACF, Tesorería 6, empresa Triathlon); 4.1 = H09–H15 (asiento/debe/haber, IVA, efecto/cartera, contabilizar/mnemotécnicos, plantillas AV/FV+43090, IRPF/SII, tipología); saltos internos = H16 (Cartera) y H17 (Contabilidad); H22 = fila «Debe, haber, asiento» de 4.3 (coincide con lo pedido). **H40 es una deducción incierta**: lo he tomado como «Casi no se practica la configuración» (sección 5, huecos). Confirmar.
- Numeración que ve el alumno: `lib/ruta.ts` `numeroBloque()` = posición (1…n) dentro de `bloquesDe(m)`, que sale de `content/etapas.ts` (`ETAPAS[módulo]`, lista de ids por etapa). El `numero` del JSON NO se usa. Un id que no esté en etapas va al final en «Más bloques». Orden de módulos: `content/index.ts` `ORDEN`.
- El contenido ha cambiado desde el informe: Cartera y Cobros/Pagos están fusionados (14 bloques), Contabilidad tiene 29, Maestros 7 (el antiguo «bloque 4» de 90 min es hoy `maestros-1`, bloque 4).
- Glosario global: `content/glosario.ts` resalta CUALQUIER término del glosario (de cualquier módulo) en todo el texto con ventana de definición (`components/Glosario.tsx`, `Glosa`). Por eso muchas «referencias adelantadas» (H09–H15) quedan mitigadas: el alumno ve la definición al pasar el ratón, aunque el texto no la dé en línea.

Orden actual (ids y títulos), por módulo
- Maestros: 1 maestros-v-3 Consultar la ficha de la empresa · 2 maestros-v-1 Consultar el plan contable y sus cuentas · 3 maestros-v-2 Entender los mnemotécnicos de cuentas · 4 maestros-1 Dar de alta los datos básicos de contabilidad · 5 maestros-v-4 Crear una empresa · 6 maestros-2 Dar de alta los datos básicos de gestión · 7 maestros-3 Registrar y consultar el stock.
- Compras: 1 compras-1 · 2 compras-precios · 3 compras-tipos · 4 compras-3 (Pedir) · 5 compras-2 (Recibir con el albarán) · 6 compras-factura.
- Contabilidad (icon-contabilidad): 1 parametrizacion-icon-1 Cargar las tablas de Finanzas en orden · 2 icon-contabilidad-1 Conocer el diario, los periodos y las plantillas · 3 parametrizacion-1 · 4 parametrizacion-2 · 5 parametrizacion-3 · 6 parametrizacion-4 · 7 parametrizacion-5 · 8 parametrizacion-6 · 9 asientos-1 Crear un diario · 10 asientos-2 Crear un asiento manual · 11 asientos-3 · 12 asientos-4 · 13 asientos-5 · 14 asientos-6 Contabilizar un asiento · 15 asientos-11 · 16 asientos-12 · 17 asientos-13 · 18 asientos-7 · 19 asientos-8 · 20 asientos-9 · 21 asientos-10 · 22 icon-contabilidad-v-1 … 25 icon-contabilidad-v-4 · 26 icon-contabilidad-2 Cerrar y abrir el ejercicio · 27 icon-contabilidad-3 Consultar balances y cuentas anuales (incluye consolidación) · 28 parametrizacion-icon-2 (opcional) · 29 asientos-14 (opcional).
- Cartera (carteras): 1 carteras-1 Definir plazos y tipos de efecto · 2 carteras-3 Bancos y cajas · 3 icon-cartera-v-1 Ver los efectos de una factura · 4 icon-cartera-1 Estados y tipos de efecto · 5 carteras-5 Cobrar efectos sueltos y en remesa · 6 icon-cartera-v-2 · 7 icon-cartera-v-3 · 8 icon-cartera-2 · 9 icon-cartera-v-4 Comprobar los tipos de remesa · 10 icon-cartera-v-5 Crear una remesa de pago · 11 icon-cartera-v-7 Resolver un efecto que no se remesa · 12 carteras-7 Entender cómo pasan los efectos a tesorería · 13 icon-cartera-v-6 Evolucionar una remesa · 14 icon-cartera-3 (opcional).
- Tesorería: 1 tesoreria-1 · 2 tesoreria-2 · 3 tesoreria-3 · 4 tesoreria-4 Dar de alta el extracto bancario · 5 tesoreria-5 Conciliar el banco · 6 icon-cartera-v-8 Conocer el circuito de extracto y conciliación · 7 icon-cartera-v-9 · 8 icon-cartera-v-10 · 9 icon-cartera-v-11 · 10-12 tesoreria-6/7/8 (opcionales).
- Impuestos y Activos: ver etapas.ts (Activos 4 = icon-activos-v-1 Revisar el albarán que crea el activo).

---

## H01 — Portada exige dos cursos previos; M1 dice que no hace falta base
Vigente: SÍ.
- `pages/Home.tsx` ~l. 270-273 (bloque «ini-notas»): «Antes de esta formación van dos cursos que no están en esta web: el de contabilidad (con su examen) y el de introducción al ERP.»
- Contradice `content/maestros.json`, navegacion/0 (id maestros-nav-datos, explicacion/4), mostrado en «Antes de empezar» del módulo Datos maestros (`pages/ModulePage.tsx` l. 99-130): «Si nunca has trabajado con contabilidad, no te preocupes. Cada término … se explica en lenguaje llano la primera vez que sale.»
- No hay otras menciones en componentes (Bienvenida, Onboarding, ModulePage, Sidebar) ni en README.
- Arreglo mínimo: en `Home.tsx` sustituir el párrafo por «No necesitas cursos previos: el módulo Datos maestros explica en llano lo básico del ERP y de la contabilidad. Si ya los conoces, empieza donde quieras.» (decisión 3 del informe: quitar el requisito). Si se mantiene el requisito, entonces cambiar la frase de maestros-nav-datos.

## H04 — «Códigos del alumno» no existe
Vigente: SÍ.
- `content/compras.json` navegacion/0 (compras-nav-moverte) explicacion/4: «…tipología de albarán AO{INI}… La tabla completa está en «Códigos del alumno».»
- `content/maestros.json` navegacion/0 (maestros-nav-datos) explicacion/1: «…Así cada código nombra una sola cosa. La tabla completa está en «Códigos del alumno».»
- Búsqueda en todo `app/src`, `app/public`, README y `_fuente` (sin distinguir mayúsculas/tildes): solo esas dos frases; la tabla existe solo como fichero interno `_fuente/CODIGOS_ALUMNO.md` (no se muestra en la web). Ninguna página/ruta/componente la renderiza.
- Arreglo mínimo: quitar la frase en ambos sitios (o «Cada bloque te dice qué código crear.»). Alternativa: publicar la tabla (página nueva), mayor coste.

## H05 — Compras, bloque 5 remite a una Práctica que no tiene
Vigente: SÍ.
- Bloque 5 = `compras-2` (Recibir la mercancía con el albarán). `content/compras.json` ejercicios/4 (compras-2) `concepto`: «…Lo generas con el proceso «Generación de albaranes desde pedidos»; en la Práctica, con el botón «Generar albaranes».»
- `erp/practicas.ts` `PRACTICAS_POR_EJERCICIO`: solo `compras-factura` (bloque 6) tiene práctica de compras (`erp-circuito`, `erp-parcial`); `compras-2` no → el paso «Práctica» no aparece en este bloque (`lib/ruta.ts pasosDe`).
- Arreglo mínimo: en compras.json, ejercicios/4 concepto, cambiar «en la Práctica, con el botón «Generar albaranes»» por «en la Práctica del bloque «Registrar y contabilizar la factura», con el botón «Generar albaranes»».

## H06 — Activos, bloque 4: avisa de que AACF no existe en la demo, pero la Demo real pide abrirla
Vigente: SÍ.
- Bloque 4 = `icon-activos-v-1`. `content/icon-activos.json` ejercicios/2 `concepto`: «Fíjate: en la demo de prácticas no existe la tipología AACF. Abre cualquier tipología de albarán (por ejemplo AC «ALBARAN COMPRA»)…»
- Pero: ejercicios/2 secciones/0 pasos/0 texto: «…y abre la tipología AACF.»; `checklist/0` (paso Demo real): «Abres «Compras» › «Maestros» › «Documentos» › «Albaranes» y la tipología AACF.»; además test/2 pregunta «…en la tipología AACF?» y secciones 0-2 hablan de AACF.
- Arreglo mínimo: icon-activos.json ejercicios/2: en `secciones/0/pasos/0/texto` cambiar «abre la tipología AACF» por «abre una tipología de albarán (por ejemplo AC «ALBARAN COMPRA»)» y en `checklist/0` cambiar «y la tipología AACF» por «y una tipología de albarán (por ejemplo AC)». Las menciones «en AACF» de las secciones son del vídeo/captura; basta el aviso del concepto.

## H07 — Tesorería, bloque 6 remite a bloques de Tesorería ya hechos
Vigente: SÍ (y también en el bloque 7).
- Bloque 6 = `icon-cartera-v-8` (vive en `content/tesoreria.json` ejercicios/8). `concepto`: «Lo verás con más detalle en el módulo Tesorería, en los bloques «Dar de alta el extracto bancario» y «Conciliar el banco».» Esos son los bloques 4 y 5 (ya hechos), estamos dentro del módulo Tesorería.
- Bloque 7 = `icon-cartera-v-9` (tesoreria.json ejercicios/9) `concepto`: «…(lo verás en Tesorería, bloque «Dar de alta el extracto bancario»)».
- Arreglo mínimo: ejercicios/8 concepto → «Ya lo has visto con más detalle en los bloques «Dar de alta el extracto bancario» y «Conciliar el banco» de este módulo.»; ejercicios/9 concepto → «(lo viste en el bloque «Dar de alta el extracto bancario»)». (Otras frases de estos bloques que dicen «lo ves en el bloque…» son correctas porque apuntan a bloques posteriores del mismo módulo.)

## H08 — Impuestos y Activos usan Triathlon [ALA] S.L. con facturas de 2023; M1 dice «empresa 0»
Vigente: SÍ.
- `content/maestros.json` ejercicios/0 (maestros-v-3) `concepto`: «…Todos los ejercicios del curso trabajan en la empresa 0.»
- `content/icon-impuestos.json` ejercicios/2 (icon-impuestos-v-1) concepto: «En la demo de los vídeos, la empresa Triathlon [ALA] S.L. está en la zona ESAR»; ejercicios/3 (icon-impuestos-v-2): factura «FCALA23-000015»; ejercicios/4: fecha contable 30-04-2023.
- `content/icon-activos.json` ejercicios/1 secciones/1 explicacion/2: «en la captura, empresa Triathlon [ALA] S.L., bien ES2130…»; ejercicios/5 (icon-activos-v-3) facturas del 07-06-2023.
- Arreglo mínimo: maestros.json ejercicios/0 concepto: «Todos los ejercicios del curso trabajan en la empresa 0.» → «La mayoría de los ejercicios trabajan en la empresa 0; los de Impuestos y Activos fijos usan la empresa ALA (Triathlon [ALA] S.L.) de la demo de los vídeos y avisan de ello.»

## H09 — Compras 6 usa asiento, debe/haber y tipo de asiento antes de Contabilidad
Vigente: PARCIAL (sin definición en línea; mitigado por el glosario emergente).
- Bloque 6 = `compras-factura`. `content/compras.json` ejercicios/5 secciones/2 `paraQueSirve`: «Contabilizar genera el asiento de compras y los vencimientos de pago. Gasto (600) e IVA soportado (472) van al debe, y la deuda con el proveedor (400) al haber.» También explicacion/2 «Se combinan el tipo de asiento, el tipo de línea…» y test/2 «¿cuánto suman el debe y el haber?».
- Mitigación: el glosario resalta «debe», «haber», «asiento», «tipo de asiento» con definición (glosario/icon-contabilidad.json, maestros.json, compras.json «Asiento contable… líneas al debe y al haber»).
- Arreglo mínimo: compras.json ejercicios/5 secciones/2 paraQueSirve, añadir tras «…vencimientos de pago.»: «Un asiento anota cada importe en una columna, debe o haber, y las dos suman lo mismo.»

## H10 — IVA, zona impositiva, clave fiscal en Maestros/Compras/Ventas antes de Impuestos
Vigente: PARCIAL (casi resuelto).
- Zona impositiva: definida en línea (maestros-v-3 concepto «decide qué impuestos se le aplican»; compras-1 secciones/2 paraQueSirve «decide qué IVA se aplica»). IVA: definido en ventas-1 concepto («El IVA es el impuesto que añades al precio…»), glosario en maestros/compras/carteras/ventas. Clave fiscal: en línea en maestros-2 («clave fiscal (cómo tributa en el IVA)»).
- Falta definición en línea en `compras.json` ejercicios/0 (compras-1) secciones/5 explicacion/1: «Para comprar importan cinco datos: descripción, unidad, familia, tipo contable y clave fiscal.» y campos/7 «Clave fiscal tercero *» / «RGEN Régimen general (defecto)».
- Arreglo mínimo: en ese explicacion/1 añadir «La clave fiscal dice cómo tributa el artículo en el IVA (bien o servicio, tipo general, reducido…).»

## H11 — Maestros: efecto, cartera, remesa, domiciliación, conciliación
Vigente: PARCIAL (solo «domiciliación» sin definir).
- Bloque 4 = `maestros-1`. concepto define efecto («Un efecto es un cobro o un pago pendiente…»); secciones/5 (bancos-cajas) explicacion/1 define remesa y conciliar («Una remesa es un paquete de recibos…»). Quedan 15 usos de «domicili*» sin definición en línea: secciones/4 (tipos-efecto) paraQueSirve «recibo domiciliado, transferencia, pagaré…», campos/4 «Domiciliación bancaria *», pasos/1 texto «Pon domiciliación «Tercero»…». Glosario: «Domiciliación bancaria» (maestros.json y carteras.json).
- Arreglo mínimo: maestros.json ejercicios/3 secciones/4 `explicacion`, añadir frase «Domiciliar un recibo es cargarlo directamente en la cuenta bancaria del cliente, por eso hace falta su IBAN.»

## H12 — «Contabilizar» (10 veces en M1) y mnemotécnicos antes de Compras 6/Contabilidad
Vigente: PARCIAL. Mnemotécnicos: NO (resuelto, el bloque 3 `maestros-v-2` «Entender los mnemotécnicos de cuentas» los explica antes de usarlos; maestros-1 explicacion remite a él). «Contabilizar»: SÍ sin definir en línea.
- Primer uso: `content/maestros.json` ejercicios/0 (maestros-v-3, bloque 1) secciones/1 explicacion/1: «No se puede contabilizar con una fecha anterior a la de inicio.» (y campos/2, avisos/0, test/2, aprendido/4). Glosario: «Contabilizar» existe en glosario/compras.json y carteras.json (ventana emergente).
- Arreglo mínimo: maestros.json ejercicios/0 secciones/1 explicacion/1, añadir «Contabilizar es pasar un documento a la contabilidad, es decir, generar su asiento.»

## H13 — Ventas 1: plantillas de contabilización AV/FV y cuenta 43090 antes de Contabilidad
Vigente: PARCIAL.
- `content/ventas.json` ejercicios/0 (ventas-1): concepto «…con qué plantilla se contabiliza»; secciones/0 pasos/7 «¿Dónde eliges la plantilla AV para el asiento de expediciones?»; avisos/5 «usa la plantilla AV, no la FV». La cuenta 43090 sí se explica en línea (secciones/4 paraQueSirve: «La plantilla AV carga la 43090 «Ventas pendiente de factura» contra ventas.»). La «plantilla de asiento» solo sale definida en el campo (campos/19 significado: «Plantilla de asiento que se usa al contabilizar…») y en el glosario («Asiento programable», «Plantilla de asiento (tipo de asiento)»).
- Arreglo mínimo: ventas.json ejercicios/0 secciones/0 explicacion/3, añadir «La plantilla de asiento es la regla, definida en Contabilidad, que dice qué cuentas lleva el asiento de cada documento.»

## H14 — Compras 1: retención IRPF y SII antes de Impuestos
Vigente: PARCIAL.
- `content/compras.json` ejercicios/0 (compras-1) secciones/0 campos/4 significado: «…Va a los libros de IVA y al SII, el envío de las facturas a Hacienda.» (SII definido en línea) y secciones/1 campos/4 significado: «Márcala si al tercero se le practica retención (IRPF).» (sin definir; glosario «Retención de IRPF» solo en icon-impuestos).
- Arreglo mínimo: cambiar ese significado por «Márcala si al tercero se le practica retención de IRPF: parte de la factura que retienes y pagas a Hacienda en su nombre (típico de profesionales).»

## H15 — Maestros 7: «tipología» antes de Compras 3
Vigente: NO en lo esencial (resuelto).
- Hoy `maestros-3` (bloque 7) define en línea: maestros.json ejercicios/5 secciones/0 explicacion/1 «Su tipología, es decir, la plantilla del movimiento, fija de qué cuenta logística sale el stock…»; glosario «Tipología» (maestros.json). Residuo menor: `maestros-v-2` concepto menciona «tipologías» en una lista sin definir (bloque 3, ya con glosario).
- Arreglo (opcional): nada obligatorio. Si se quiere: en maestros-v-2 concepto, tras «tipologías…» añadir «(la tipología es la plantilla de un tipo de documento)».

## H16 — Cartera: «Avanzar y retroceder/Evolucionar una remesa» antes de los bloques de remesas
Vigente: PARCIAL (orden de bloques corregido; queda incoherencia de numeración/orden en el texto).
- Orden actual (`content/etapas.ts`, etapa «Remesas»): 9 icon-cartera-v-4 Comprobar los tipos de remesa · 10 icon-cartera-v-5 Crear una remesa de pago · 11 icon-cartera-v-7 Resolver un efecto que no se remesa · 12 carteras-7 Entender cómo pasan los efectos a tesorería · 13 icon-cartera-v-6 Evolucionar una remesa. Ya va después de crear la remesa (10). El orden lo controlan los arrays `bloques` de `ETAPAS.carteras` (no el JSON).
- Quedan: (a) `content/carteras.json` navegacion/0 (carteras-nav-cartera) explicacion/9 lista «12) evolucionar la remesa y revisar su asiento y su tesorería; 13) cómo un pago o una remesa crean su movimiento de tesorería» y explicacion/10-11 «14)…17)… 18) procesos avanzados»: usa el `numero` del JSON, no el que ve el alumno (en pantalla 12 = tesorería, 13 = evolucionar, el último es 14, y 14-17 están en Tesorería como 6-9). (b) icon-cartera-1 (bloque 4) concepto: «Lo verás en el bloque «Evolucionar una remesa»» (referencia adelantada legítima). (c) `carteras-5` (bloque 5) ya crea y evoluciona una remesa de cobro antes de los bloques 9-13.
- Arreglo mínimo: reescribir carteras.json navegacion/0 explicacion/6-11 sin numerar o con la numeración visible: «Remesas: tipos de remesa del banco; crear una remesa de pago; cuando un efecto no se puede remesar; cómo un pago o una remesa crean su movimiento de tesorería; evolucionar la remesa y revisar su asiento.» y quitar los números 14)-18). (Alternativa sin tocar texto: intercambiar `carteras-7` e `icon-cartera-v-6` en etapas.ts.)

## H17 — Contabilidad abre con consolidación y procesos masivos antes del primer asiento
Vigente: PARCIAL.
- Hoy la consolidación está al final (bloque 27 `icon-contabilidad-3`, sección icon-contabilidad-3-consolidacion). Pero el bloque 1 (`parametrizacion-icon-1`) aún la menciona: icon-contabilidad.json ejercicios/0 concepto «…con consolidación o con contabilidad de gestión…» y secciones/0 explicacion/1 («Sus áreas son: Costes, Impuestos, Consolidación…»); y el bloque 2 `icon-contabilidad-1` (concepto: «Además hay procesos masivos que trabajan sobre los apuntes ya hechos.»; sección `icon-contabilidad-1-procesos-masivos` «Localizar los procesos masivos de mantenimiento») va antes del primer asiento (bloque 10 `asientos-2`).
- Control del orden: `content/etapas.ts`, `ETAPAS['icon-contabilidad']`, 1.ª etapa «Cómo se organiza la contabilidad» = ['parametrizacion-icon-1','icon-contabilidad-1'].
- Arreglo mínimo (sin cambiar ids): en etapas.ts mover `'icon-contabilidad-1'` de la etapa 1 al principio de la etapa «Facturas que generan asientos» (antes de `icon-contabilidad-v-1`) y ajustar el `que` de la etapa 1 («…en qué orden se cargan las tablas de Finanzas.»). Los bloques son mantenibles porque el progreso va por id.

## H22 — Debe/haber/asiento/apunte: definiciones contradictorias
Vigente: SÍ.
- «Asiento = apunte»: `content/maestros.json` ejercicios/1 (maestros-v-1, bloque 2) secciones/1 (maestros-v-1-cuentas-contables) explicacion/0: «Un asiento es el apunte contable de una operación.»; `content/carteras.json` ejercicios/0 (carteras-1) secciones/3 explicacion/1: «El asiento contable es el apunte del gasto: gasto e IVA al debe…»; `content/icon-activos.json` ejercicios/2 concepto: «…qué asientos (apuntes contables) genera».
- «Apunte = cada línea del asiento»: `icon-contabilidad.json` ejercicios/18 (asientos-8) concepto «Un apunte es cada línea de un asiento: una cuenta con su importe al Debe o al Haber.»; ejercicios/9 (asientos-2) concepto «Cada anotación de una cuenta se llama apunte.»; glosario/icon-contabilidad.json (Asiento = «Conjunto de apuntes»; Apunte = «Cada línea de un asiento»); icon-impuestos ejercicios/7 «Cada línea del asiento es un apunte».
- Debe/haber: coherentes entre sí (izquierda/derecha, suman lo mismo); solo el glosario de maestros añade «Por convenio, lo que tienes o te deben crece en el debe…» y asientos-2 dice «Debe (…lo que la cuenta recibe)»: no se contradicen.
- Arreglo mínimo (3 frases): maestros.json: «Un asiento es el apunte contable de una operación.» → «Un asiento es la anotación contable de una operación; cada línea suya, en una cuenta, es un apunte.»; carteras.json: «El asiento contable es el apunte del gasto» → «El asiento contable es la anotación del gasto»; icon-activos.json: «qué asientos (apuntes contables) genera» → «qué asientos contables genera».

## H40 (deducido: «Casi no se practica la configuración») — incierto, confirmar el ID
Vigente: SÍ.
- `erp/practicas.ts` `PRACTICAS_POR_EJERCICIO`: solo 6 bloques con Práctica de 86 (maestros-2, compras-1, compras-factura [2 prácticas], asientos-6, icon-cartera-v-5, tesoreria-5). Ninguna de configuración de tipologías (compras-tipos), numeradores, plazos/tipos de efecto (carteras-1, maestros-1; 60 y 90 min) ni cobros/remesas de cobro (carteras-5); sus pasos son solo Guiado/Demo real. `pages/Home.tsx` (~l. 255) presenta «Práctica… En algunos bloques».
- Arreglo mínimo (sin ids nuevos): añadir una práctica a `erp/practicas.ts` y registrarla en `PRACTICAS_POR_EJERCICIO` para `carteras-1` (plazo P{INI} + tipo de efecto R{INI}); coste medio. Sin desarrollo: dejar claro en Home que la Práctica no cubre configuración.
- Si H40 era en realidad otro ítem (p. ej. «Nombres» o «Capturas con datos de otros alumnos» de 4.5), dímelo y lo verifico.
