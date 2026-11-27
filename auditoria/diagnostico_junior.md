# Diagnóstico para juniors sin base

Revisión de los 90 bloques actuales (y 5 que faltan) con el enfoque de `plan_fase2.md`, sección 4. La regla de cada fallo está en `guia_junior.md`.

Fecha: 24-11-2026. Fuente: `app/src/content/*.json` y `etapas.ts` del worktree. Compras, Fundamentos y `etapas.ts` los estaba editando otro agente a la vez: los bloques nuevos de Compras se han leído en su estado de hoy.

## Cómo se ha medido

Para cada bloque, en el orden de `etapas.ts`:

- **Formato**: ¿el `objetivo` es un logro? ¿El primer párrafo de `concepto` dice la consecuencia para la empresa? ¿Hay `ruta` en las partes con pantalla? ¿Cada paso que actúa lleva `detalle` con el resultado? ¿Hay `problemas`?
- **Términos**: primera aparición en el módulo de los términos de la lista 2.1 de la guía, y si se explican ahí.
- **Saltos**: datos que no son del alumno (vídeo, otra empresa, otra divisa) sin decir de dónde salen; cifras que contradicen el caso.
- **Tono**: frases de más de 24 palabras, rutas con `>` en vez de `›`, nombres internos.

Prioridad:

- **Alta**: el junior se atasca o aprende algo falso. Datos ajenos sin puente en un bloque central, varios términos clave sin explicar en el primer uso, más de un tercio de pasos sin resultado, partes sin ruta, o cifras que chocan con el caso.
- **Media**: un fallo de esos, o varios menores.
- **Baja**: pulido (un término, un par de `detalle`, una frase larga).

## Resumen

| Módulo | Bloques | Alta | Media | Baja |
|---|---|---|---|---|
| 0 · Fundamentos | 3 (sin escribir) | 3 | 0 | 0 |
| 1 · Maestros | 2 | 0 | 1 | 1 |
| 2 · Contabilidad básica | 30 | 5 | 16 | 9 |
| 3 · Compras | 12 | 3 | 3 | 6 |
| 4 · Ventas | 2 | 2 | 0 | 0 |
| 5 · Cartera | 14 | 6 | 7 | 1 |
| 6 · Tesorería | 12 | 2 | 5 | 5 |
| 7 · Impuestos | 8 | 2 | 4 | 2 |
| 8 · Activos | 8 | 0 | 4 | 4 |
| 9 · Contabilidad avanzada y cierre | 2 (+2 sin escribir) | 3 | 1 | 0 |
| **Total** | **95** | **26** | **41** | **28** |

Fallos que se repiten en todo el curso:

1. **Datos del vídeo sin puente.** Empresas LIZ, ALA y 001 (soles), dólares, proveedores 00003, 00027 y 00087, banco PRVCC0. El junior no sabe por qué no ve sus códigos. Es el fallo más grave de Cartera, Tesorería, Impuestos y las facturas de Contabilidad.
2. **«Si algo sale mal…» vacío.** 15 bloques sin `problemas`, casi todos de asientos (`asientos-1`, `-3`, `-4`, `-5`, `-7` a `-13`) y `parametrizacion-2` a `-6`.
3. **Pasos sin resultado esperado.** 215 pasos sin `detalle`. Peores: `ventas-2` (24 de 41), `ventas-1` (14 de 46), `icon-cartera-v-3` (9 de 13), `icon-cartera-v-5` (7 de 17), `icon-contabilidad-v-4` (6 de 11).
4. **La consecuencia para la empresa falta.** Casi todos los `concepto` tienen la comparación cotidiana, pero muchos no dicen qué pasa si no se hace (asientos, Compras, Impuestos, Activos).
5. **Ninguna línea «Dónde: «… › …»»** en `concepto`. Hay `ruta` en el 90 % de las partes (259 de 288), pero 28 partes con pasos van sin ella. 26 pasos escriben la ruta con `>`.
6. **Términos que se dan por sabidos al cambiar de módulo.** Debe, haber, asiento, efecto, remesa y tercero se explican en Contabilidad, pero Compras, Ventas, Cartera y Tesorería los usan sin explicar la primera vez.
7. **Cifras que no cuadran entre bloques.** Compras usa 10 uds. (151,25) en el circuito y 4 uds. (60,50) en los bloques nuevos. Ventas vende al proveedor T{INI}. Cartera usa CAR{INI}. No hay hilo.

---

## 0 · Fundamentos

`fundamentos.json` no tiene bloques hoy. `etapas.ts` ya pide `fundamentos-1`.

| Bloque | Qué falta | Prioridad |
|---|---|---|
| `fundamentos-1` (nuevo) | Todo. Temas de `plan_fase2.md` 4.2: contabilidad, debe y haber, asiento y apunte, plan contable y grupos 1-7. Cada concepto con frase llana, ejemplo del caso (operaciones 1 y 4) y pregunta de comprobación. | Alta |
| `fundamentos-2` (nuevo) | Todo. IVA soportado y repercutido, factura, albarán y pedido, cobro, pago y efecto, banco y conciliación, cierre. Ejemplos con las operaciones 4 a 13 del caso. | Alta |
| `fundamentos-navegar` (nuevo) | Todo. Entrar, menú, buscar una pantalla, ficha y rejilla, guardar, buscar registros, botones de acción y pestañas, con capturas reales. Hoy solo está la parte de vídeo `maestros-moverte-axional` dentro de `maestros-v-3`. | Alta |

---

## 1 · Maestros

| Bloque | Qué falta | Prioridad |
|---|---|---|
| `maestros-v-3` | Términos: el `objetivo` dice «su tercero, su plan contable y su moneda» y ni «tercero» ni «plan contable» se explican en el `concepto`. «La mayoría de los ejercicios del curso trabajan en la empresa 0» mezcla «ejercicio» (bloque) con ejercicio contable: di «bloques». Falta la frase del caso: «tu empresa es S{INI}; en la demo grabas en la 0». Formato: 2 pasos sin `detalle`; `maestros-v-3-vinculo`: «Vuelve a la lista del maestro de empresas (abre otra vez la ruta del menú)» sin decir la ruta. Sin `Ejemplo:`. | Media |
| `maestros-v-4` | Ruta con `>`: `maestros-v-4-alta-empresa` «Finanzas > Maestros > Parametrización > Empresas». Término: «Agrupación cuentas: Grupo de tesorería de la cuenta» (`maestros-v-4-banco-propio`) sin explicar tesorería ni agrupación. 2 pasos sin `detalle`. Por lo demás, buen arranque del caso. | Baja |

---

## 2 · Contabilidad básica

| Bloque | Qué falta | Prioridad |
|---|---|---|
| `icon-contabilidad-v-1` | Ruta: 4 de 5 partes sin `ruta` (`-contabilizar`, `-asiento`, `-cartera-fiscales`, `-cartera`). Salto: «En el vídeo se usa la factura ML0260020 … con el proveedor 00027» y un asiento de 1.058,75 sin puente con la compra de T{INI} (151,25). Términos: primera vez en el módulo de «albarán» («La factura de compra con origen albarán llega desde el circuito de compras»), «Docflow» (paso de `-factura-origen`) y «registros fiscales» (`objetivo`), sin explicar. Paso con `>`: «desde Gestión > Compras > Facturas». | Alta |
| `icon-contabilidad-v-2` | Salto: «empresa LIZ (Liz Sport España) con el proveedor 00003», artículo B a 5.000,00 → 6.050,00, sin puente. 5 de 15 pasos sin `detalle`; `-contabilizar-fc`: «Con el importe factura y el importe total en 6.050,00, pulsa «Validar»» no dice qué pasa. «Validar» sin explicar en el `concepto`. Parte `-contabilizar-fc` sin `ruta`. | Alta |
| `icon-contabilidad-v-4` | 6 de 11 pasos sin `detalle`; `-importe-0`: «Revisa el importe total de la factura antes de contabilizar.» no dice qué buscar ni qué ver. Parte `-importe-0` sin `ruta`. Salto: «en el vídeo, de julio en adelante» (periodo abierto de otra base). | Alta |
| `icon-contabilidad-v-3` | Ruta: las 2 partes sin `ruta` (`-rectificativa`, `-sustitutiva`): el junior no sabe dónde se hace. 5 de 7 pasos sin `detalle`; `-rectificativa`: «Recuerda: si hay que corregir un importe…, no elimines la factura.» no es un paso. Sin ejemplo numérico de una rectificativa. Sin consecuencia para la empresa en el primer párrafo más allá de «tiene que quedar registro». | Alta |
| `maestros-1` | Bloque de 90 min, 8 partes, 35 pasos, 7 sin `detalle` (`-articulos-fin`: «Comprueba que el artículo FOR{INI} aparece en la lista…»). Términos: `maestros-1-bancos-cajas` «Por los bancos y las cajas pasan los cobros, los pagos, las remesas y la conciliación de extractos» (remesa, conciliación y extracto, primera vez en el módulo, sin explicar); «flujos» y «agrupación» en el mismo apartado. Caso: crea C{INI}, P{INI} y R{INI}, pero no dice para qué servirán («la venta de 242,00 dará dos efectos de 121,00»). Salto: cambio de divisa en USD sin decir por qué. 4 frases de más de 24 palabras. | Alta |
| `asientos-2` | Términos: `objetivo` «asiento provisional» (provisional no se explica hasta `asientos-6`). `asientos-2-cabecera`: «En Justificante elige el numerador {INI}» antes de explicar qué es un numerador (se explica en la parte siguiente). Caso: practica un gasto de 1.000,00 y no se engancha al caso (aportación de 3.000,00). Solo 1 problema. | Media |
| `asientos-7` | Término: primera vez de IVA soportado y repercutido en el módulo, sin explicar: «Un asiento con 47200 IVA soportado sin rellenar la pestaña «Impuestos» sí saldría». Sin `problemas`. 2 pasos sin `detalle` (`-integridad`). | Media |
| `asientos-1` | Términos: `asientos-1-pantalla` «fecha, número, justificante, diario, ejercicio, periodo y totales» (ejercicio, periodo y justificante sin explicar); «DA cierre» sin explicar. Sin `problemas` (p. ej. «el código del diario solo admite 2 caracteres»). 1 paso sin `detalle`. | Media |
| `maestros-v-1` | Términos: `maestros-v-1-cuentas-contables` «Tras el punto puede ir el código de un tercero» y «el lado en el que suele crecer el saldo» (tercero y saldo sin explicar). Primer párrafo sin consecuencia para la empresa. 2 pasos sin `detalle`. | Media |
| `parametrizacion-1` | Términos: `concepto` «asientos, facturas de compra y plantillas contables» y «la analítica: el proyecto y la sección» (plantilla y proyecto, primera vez). 2 frases largas. | Media |
| `asientos-14` | Salto: «pago de una remesa … de 8.080,15 a un proveedor. Debe 40100.00003» (datos de la base) sin puente con el pago a T{INI}. Nombre interno `cbancpro` en el texto. | Media |
| `asientos-6` | 2 pasos sin `detalle` (`-finalizar`). Salto: «Abre tu asiento {INI}-DOC-002 (en las capturas, el 7)»: bien explicado, pero el resultado esperado del «Finalizar» falta. Una frase larga. | Media |
| `asientos-3` | Sin `problemas` (¿qué hago si no cuadra?). Sin línea `Dónde:`. | Media |
| `asientos-4` | Sin `problemas`. Primer párrafo sin consecuencia para la empresa (solo la comparación del tique). 1 paso sin `detalle`. | Media |
| `asientos-5` | Sin `problemas`. Primer párrafo sin consecuencia. `asientos-5-nuevo`: «Rellena la cabecera: Empresa 0, Fecha 12-11-2026, Diario {INI}…» sin `detalle`. | Media |
| `asientos-11` | Sin `problemas`. 2 de 4 pasos sin `detalle` (`-duplicar`: «Pulsa «Copiar asiento»…»). | Media |
| `asientos-12` | Sin `problemas`. 2 de 5 pasos sin `detalle` (`-copias`). Nombre interno `cperiodo_ins` en el texto. | Media |
| `asientos-13` | Sin `problemas`. 2 de 6 pasos sin `detalle` (`-cambiar`). | Media |
| `asientos-8` | Sin `problemas`. Primer párrafo sin consecuencia. Nombre interno `capuntes`. | Media |
| `asientos-9` | Sin `problemas`. 1 paso sin `detalle` (`-mayor`: «repite con 62903.00000 y 57200.00000»). | Media |
| `asientos-10` | Sin `problemas`. 2 de 3 pasos sin `detalle` (`-saldos`: «Abre la ruta y pulsa la lupa»). Es donde mejor se ve el caso (sumas y saldos): falta el `Ejemplo:` con 3.242,00 = 3.242,00. | Media |
| `icon-contabilidad-1` | Salto: `Modelos XLS` y «Sistema Excel» en un bloque de Configurar básico. 1 frase larga. | Baja |
| `maestros-v-2` | Término: `objetivo` «mnemotécnico» se explica bien en el primer párrafo. 1 paso sin `detalle`. Falta `Dónde:`. | Baja |
| `parametrizacion-2` | Sin `problemas`. Primer párrafo sin consecuencia. | Baja |
| `parametrizacion-icon-1` (opcional) | Término: «serie» sin explicar en `-orden-carga`. 3 frases largas. 3 pasos sin `detalle`. | Baja |
| `parametrizacion-icon-2` (opcional) | Término: «regularización» en `-plantillas-permiso` sin explicar. 3 pasos sin `detalle`. | Baja |
| `parametrizacion-3` (opcional) | 3 pasos sin `detalle` («Pulsa «Guardar»»). | Baja |
| `parametrizacion-4` (opcional) | Sin `problemas`. Primer párrafo sin consecuencia. | Baja |
| `parametrizacion-5` (opcional) | Sin `problemas`. Sin `Ejemplo:`. | Baja |
| `parametrizacion-6` (opcional) | Sin `problemas`. 2 pasos sin `detalle` («Pulsa «Guardar»»). | Baja |

---

## 3 · Compras

| Bloque | Qué falta | Prioridad |
|---|---|---|
| `compras-albaran-contabilizar` | Cifras contra el caso: «Las dos suman lo mismo, 50,00 en el ejemplo (asiento 78)» y «Debe 50,00». El alumno acaba de validar un albarán de 125,00 en `compras-2`. Términos: primera vez en el módulo de «debe», «haber» y «apunte» («Tiene dos líneas: gasto al debe y facturas pendientes de recibir al haber»), sin explicar. Cuenta puente 40090 sin explicar qué es. Primer párrafo sin consecuencia para la empresa. Sin `Ejemplo:` del caso. | Alta |
| `compras-generar-factura` | Cifras contra el caso: «4 unidades a 12,50 = 50,00», «60,50 (50,00 de base más 10,50 de IVA)» frente a 151,25 de `compras-factura`. Sin frase puente. Primer párrafo sin consecuencia. 1 paso sin `detalle` (`-validar`). | Alta |
| `maestros-2` | Términos: `concepto` «Primero das de alta el tercero también como cliente en Gestión» (tercero, primera vez en el módulo); `maestros-2-cliente` «Une un tipo de efecto y un plazo de pago» y «el estado PE» (efecto, plazo, estado, sin explicar); «tipo contable PRODUCTO y precio en la tarifa». 6 de 21 pasos sin `detalle` (`-cliente`: «Abre la ruta y pulsa «Nuevo».»). 3 frases largas. Caso: no dice que C{INI} será tu cliente en Ventas. | Alta |
| `compras-1` | Términos: `compras-1-tercero` «Sale en documentos, asientos y modelos fiscales» (asiento); `-condiciones` «crea con ellas los vencimientos de pago» (vencimiento); «créala en el plan contable». 6 frases de más de 24 palabras. Sin `Ejemplo:`. Primer párrafo sin consecuencia. | Media |
| `compras-abono-devolucion` | 3 de 9 pasos sin `detalle` (`-crear`: «En la lista de facturas pulsa «Nuevo».»). Sin ejemplo numérico (guía: 1 ud. = −15,13). Primer párrafo sin consecuencia. | Media |
| `maestros-3` | Salto: el stock que practica es de ROD{INI} en ALM{INI}, no del artículo del caso (13500620): falta la frase puente. 3 pasos sin `detalle` (`-movimientos`). | Media |
| `compras-tipos` | Primer párrafo sin consecuencia («Es como un molde»). Término: «También hay series de ventas y anticipos» (anticipo sin explicar). | Baja |
| `compras-3` | Primer párrafo sin consecuencia. Una frase larga. Por lo demás, buen enganche con el caso (10 × 12,50). | Baja |
| `compras-2` | Falta `Dónde:`. Buen enganche con el caso. | Baja |
| `compras-factura` | «haz los ejercicios del documento «Ejercicios Gestión de Compras»» confunde ejercicio (tarea) con ejercicio contable. 2 frases largas. | Baja |
| `compras-precios` | Término: «vigencia, es decir, el periodo en que vale»: bien. Falta `Dónde:`. | Baja |
| `compras-workflow` | Sin `Ejemplo:`. Falta `Dónde:`. | Baja |

---

## 4 · Ventas

| Bloque | Qué falta | Prioridad |
|---|---|---|
| `ventas-2` | 24 de 41 pasos sin `detalle` (`ventas-2-tipologia-oferta`: «Abre la ruta Gestión > Ventas > Maestros > Documentos > Ofertas. Se abre en modo lista…»). 12 pasos con `>`. Salto: vende al proveedor T{INI} («Cliente T{INI} / 0») sin explicar por qué. Cifras 5 × 22,00 = 133,10 fuera del caso, sin decirlo. Primer párrafo sin consecuencia. | Alta |
| `ventas-1` | Términos, primera vez en el módulo y sin explicar: `concepto` «La factura genera el asiento definitivo con cliente, IVA y ventas, y crea el vencimiento de cobro» (asiento, vencimiento); «qué serie lo numera y con qué plantilla se contabiliza» (serie, plantilla); `objetivo` «verás el cobro pendiente en la cartera» (cartera); «Debe caer en un ejercicio y un periodo abiertos» (`-contabilizar-albaran`). 14 de 46 pasos sin `detalle` (`-tipologia-albaran`: «Deja vacía la Tabla origen…»). 10 pasos con `>`. Salto: «Usa el tercero T{INI} que creaste en Compras… aquí solo lo das de alta como cliente» (vender a tu proveedor). 3 frases largas. Las cifras (242,00) sí cuadran con el caso. | Alta |

---

## 5 · Cartera

| Bloque | Qué falta | Prioridad |
|---|---|---|
| `icon-cartera-v-1` | Salto: «una factura del 02-05-2023 en dólares … 118,50 USD, que son 440,70 en la moneda de la empresa del vídeo. Esa moneda no es el euro». Primer contacto del junior con un efecto y lo ve en dos divisas. Falta el puente con los efectos de 121,00 de C{INI}. Parte `-vencimientos` sin `ruta`. 3 pasos sin `detalle` (`-factura`: «Fíjate en la banda EN CONTABILIDAD…»). | Alta |
| `icon-cartera-v-3` | Salto: «en el vídeo (empresa 001, en soles PEN) se paga con PEFE un efecto en dólares». 9 de 13 pasos sin `detalle` (`-cabecera`: «Entra en Finanzas › Cobros y Pagos › Gestiones sobre la cartera de efectos»). Partes `-seleccion` y `-cierre` sin `ruta`. Término: «caducidad Sí» antes de explicarla. | Alta |
| `icon-cartera-v-2` | Salto y concepto avanzado: «Los 4,26 de diferencia salen en «Diferencias cambio». … es una ganancia por diferencia de cambio». Un junior sin base no tiene la idea de divisa. 4 de 8 pasos sin `detalle` (`-boton`: «Abre el efecto TF/PE en Finanzas › Cobros y Pagos › Movimientos»). Término: «Pagos regularizar». | Alta |
| `icon-cartera-v-5` | Salto: «empresa 0 Deister Software, el banco PRVCC0 y el tercero 00087 LABORATORIOS UNION. Su efecto de 1.815,00». 7 de 17 pasos sin `detalle` (`-crear-remesa`: «Abre Finanzas › Cobros y Pagos › Remesas › Registro de remesas»). Partes `-seleccion-efectos` y `-agregar` sin `ruta`. Estado «PR (propuesto)»: bien, pero falta el caso (remesa de pago de 151,25 a T{INI}). | Alta |
| `icon-cartera-v-6` | Salto que enseña algo falso a un principiante: «Al haber va la 10000.00087 por 1.815,00». En el PGC la 100 es Capital; en esa base es la cuenta del banco. Hay que decirlo. Partes `-evolucionar` y `-extracto` sin `ruta`. 3 frases largas. Remesa RM026-000018 del vídeo sin puente. | Alta |
| `carteras-1` | Primer bloque del módulo y el que más términos da por sabidos (17 primeras apariciones): `-factura-compra` «gasto e IVA al debe, contra la cuenta 400 del proveedor al haber» (debe, haber); «es decir, la plantilla que fija serie y diario» (plantilla, serie, diario); `-tipo-efecto` «Días que se suman a la fecha prevista en tesorería» (tesorería); «otras, como la de remesa» (remesa). Salto: crea el tercero CAR{INI} y no dice que no es tu proveedor T{INI}. 2 frases largas. | Alta |
| `icon-cartera-v-7` | Partes `-domiciliacion` y `-tipos-efecto` sin `ruta`. 3 de 4 pasos sin `detalle` («Si al contabilizar aparece «DOMICILIACIÓN BANCARIA NO INFORMADA», revisa los datos bancarios…» sin decir dónde). | Media |
| `icon-cartera-v-4` | Parte `-tipos` sin `ruta`. 4 de 6 pasos sin `detalle` (`-empresa`: «Abre el maestro de empresas y selecciona la empresa 0 Deister Software.»). Salto: «la cuenta financiera PRVCC0» y los códigos CCHET, CSCTT, PSCTT sin puente con BBVA_{INI}. | Media |
| `icon-cartera-2` | Parte `-errores` sin `ruta`. Mensajes internos sin traducir: «da el error cefecges_estado_ava_05» (pon qué significa). Término: «conciliada» en `-errores` sin explicar. Sin `Ejemplo:` numérico. | Media |
| `carteras-5` | Término: `-cobro-individual` ««Abrir» deshace una gestión cerrada» antes de explicar qué es una gestión. 6 pasos sin `detalle` (`-articulo`: «Abre la ruta y pulsa «Añadir artículo»»). Cifras (242,00) cuadran con el caso, pero con CAR{INI} y un solo efecto: falta la frase puente (dos efectos de 121,00 de C{INI}). | Media |
| `carteras-7` | Salto: «el movimiento es de 8.080,15» y «40100.00003 en la demo» sin puente con el caso. 2 frases largas. | Media |
| `carteras-3` | 4 de 14 pasos sin `detalle` (`-banco`: «Abre la ruta y pulsa «Añadir bancos propios»»). Término: «Los numeradores están en la pestaña «Numeradores»» sin explicar. Sin `Ejemplo:`. | Media |
| `icon-cartera-1` | Nombres internos en el texto: «La plantilla es cefectos_p_pagda en la captura y cefectos_p_pagd…»: explica que es el nombre de la plantilla contable. Primer párrafo sin consecuencia. | Media |
| `icon-cartera-3` (opcional) | Nombres internos (`cefecges_det`, `camope`). 2 frases largas. Buenos ejemplos (500 €, 100 + 100 = 200). | Baja |

---

## 6 · Tesorería

| Bloque | Qué falta | Prioridad |
|---|---|---|
| `icon-cartera-v-11` | Salto confuso: «la remesa de cobro se refleja en un extracto de 5.082,00 en negativo» (un cobro en negativo, sin explicar el signo). Término: `objetivo` «anticipo» y «dos efectos de signo contrario». 4 de 9 pasos sin `detalle` (`-extracto-cobro`: «En «Concepto común» escribe 04.»). | Alta |
| `tesoreria-1` | Primer bloque del módulo. Términos: `concepto` «el formato de extracto con el que el banco envía los ficheros N43» (N43 y extracto sin explicar); `-comisiones` «Posición: Lado contable de la comisión: Haber o Debe» (debe y haber, primera vez en el módulo); «si se cobra por beneficiario o por efecto». 5 frases de más de 24 palabras. Nombre interno `cbancpro`. Caso: la comisión de 3,50 está, falta decir que es la del pago a T{INI}. | Alta |
| `icon-cartera-v-10` | 5 de 12 pasos sin `detalle` (`-filtros`: «En «Empresa» elige 0 Deister Software.»). Salto: 1.524,60 de la base sin puente. | Media |
| `tesoreria-2` | Términos: `concepto` «los días de margen («float») para buscar el apunte en el banco» (apunte sin explicar en el módulo); `objetivo` «cómo se concilia» (conciliar). 6 de 17 pasos sin `detalle` (`-operacion`: «Escribe el código {INI}COM y la descripción…»). 2 frases largas. | Media |
| `tesoreria-4` | Parte `tesoreria-4-n43` sin `ruta`. Salto: cuenta de prácticas CAPT_BCO (480,00) sin puente con BBVA_{INI}. 3 pasos sin `detalle`. 3 frases largas. | Media |
| `tesoreria-5` | 4 pasos sin `detalle` (`-pantalla`: «Mira las dos mitades: banco a la izquierda, ERP a la derecha»). 3 frases largas. Ejemplo 8.080,15 sin puente con el caso. | Media |
| `icon-cartera-v-8` | Parte `-circuito` sin `ruta`. 3 frases largas. Ejemplo con 401 y 57900 bien explicado. | Media |
| `tesoreria-3` | Falta `Dónde:`. Buen enganche con el caso (−10,00). | Baja |
| `icon-cartera-v-9` | «No pulses «Conciliar automático» en este ejercicio»: di «en este bloque». | Baja |
| `tesoreria-6` (opcional) | 2 pasos con `>` («Finanzas > Caja > Movimientos»). 3 frases largas. | Baja |
| `tesoreria-7` (opcional) | `objetivo` «cuadro de amortización» (amortización de un préstamo, distinta de la de Activos: dilo). 5 frases largas. | Baja |
| `tesoreria-8` (opcional) | 3 frases largas. Sin `Ejemplo:`. | Baja |

---

## 7 · Impuestos

| Bloque | Qué falta | Prioridad |
|---|---|---|
| `icon-impuestos-v-1` | Salto: «la empresa Triathlon [ALA] S.L. está en la zona ESAR (España Araba). El proveedor 00003…». Ningún dato del alumno: falta el puente con la compra de T{INI} (21 % sobre 125,00 = 26,25). 5 referencias al vídeo. | Alta |
| `icon-impuestos-conceptos` | Primer bloque del módulo, pero usa «base» y «cuota» antes de explicarlas: `concepto` «Ejemplo: una factura con base 800 € al 21 % lleva una cuota de 168 €». «Prorrata» remite a otro bloque. Cifras 2.100 − 1.260 = 840 sin el caso (42,00 − 26,25 = 15,75). | Alta |
| `icon-impuestos-v-3` | Salto: cambia la zona del proveedor 00003 de ESAR a ESCO y pide devolverla («Al terminar, devuelve la zona impositiva…»): explica que es un dato compartido de la demo. Cifras 1.200 y 800 sin el caso. | Media |
| `icon-impuestos-v-2` | Salto: factura FCALA23-000015 de ALA. 3 frases largas. Primer párrafo sin consecuencia. | Media |
| `icon-impuestos-1` | Término: «Lo verás en «Revisar el registro fiscal»» (registro fiscal, primera vez, sin explicar). 2 frases largas. Primer párrafo con consecuencia: bien. | Media |
| `icon-impuestos-3` | Primer párrafo sin consecuencia. Claves ES182 y ES190 y prorrata de la empresa FPE: mucho dato ajeno sin puente. 2 pasos sin `detalle` (`-modelos`). Falta el 303 del caso (15,75). | Media |
| `icon-impuestos-4` | 3 frases largas. 2 pasos sin `detalle` (`-control`). | Baja |
| `icon-impuestos-2` | Buenos ejemplos (prorrata, ISP). Falta el registro fiscal del caso (125,00 / 26,25). | Baja |

---

## 8 · Activos

El caso no tiene activos (guía 3.5): basta con que cada bloque use el ejemplo fijo del ordenador de 1.200,00.

| Bloque | Qué falta | Prioridad |
|---|---|---|
| `icon-activos-v-4` | Término: `concepto` «Que la tipología de factura genere inmovilizado no basta» (tipología, primera vez en el módulo). Parte `-requisito-creacion` sin `ruta`. 3 de 7 pasos sin `detalle` (`-codigo-bien-serie`: «Comprueba que el bien y la serie están informados.»). Salto: artículo 0012051 «ASCENSOR KONE…». | Media |
| `icon-activos-v-1` | Términos: `objetivo` «tipología de albarán» (albarán y tipología sin explicar en el módulo). Salto: tipología de albarán «cualquiera» del vídeo. Una frase larga. | Media |
| `icon-activos-v-2` | Términos: `concepto` «La factura nace provisional, se valida y después se contabiliza» (provisional y validar, primera vez). Sin `Ejemplo:` numérico. Primer párrafo sin consecuencia. | Media |
| `icon-activos-1` | Términos: «la serie que numerará sus elementos», «Ves la agrupación ES20», «el proyecto y la sección» sin explicar. | Media |
| `icon-activos-2` | Salto: «el elemento OPT000003 de 36.000 € se divide y nace OPT000101 con 1.800 €» sin puente. Buen ejemplo de 110 €/mes. | Baja |
| `icon-activos-3` | 2 frases largas. 1 paso sin `detalle`. | Baja |
| `icon-activos-v-3` | Primer párrafo sin consecuencia. «Cartera de efectos» sin explicar en el módulo. | Baja |
| `icon-activos-conceptos` | `icon-activos-conceptos-baja`: «qué asiento provoca retirar o vender un activo» (asiento, primera vez en el módulo). Sin rutas: correcto, es solo concepto. | Baja |

---

## 9 · Contabilidad avanzada y cierre

| Bloque | Qué falta | Prioridad |
|---|---|---|
| Caso final (nuevo) | Todo: las 13 operaciones del caso con tu empresa y la comprobación de las cifras de la guía 3.4. | Alta |
| «Cerrar el ejercicio de tu empresa» (nuevo) | Todo: regularización (61,50), cierre (3.077,25) y apertura de 2027. | Alta |
| `icon-contabilidad-2` | Saltos sin explicar: «el asiento que genera es siempre el 99999998, y sus saldos van al periodo 98»; «lanza la excepción capuntes_ejtmpcie_01». Términos: «saldo» y «asiento de cierre» en el primer párrafo sin la frase modelo. 4 frases de más de 24 palabras. Ejemplo 10.000 − 7.000 = 3.000 sin el caso (61,50). | Alta |
| `icon-contabilidad-3` | Contenido de experto para un junior: «funciones VBA», «@AX_SaldoBALANCE|2026|12|0|57200.00000», nombres internos `cctasal_agrs` y `ccuentas_agruph`. Término: «Importe acreedor: Movimientos al Haber» (acreedor). Falta el balance del caso (3.077,25 = 3.061,50 + 15,75). | Media |

---

## Siguientes pasos propuestos

1. Escribir Fundamentos (`fundamentos-1`, `-2`, `-navegar`) con el caso: es la base de todo lo demás.
2. Que Sergi decida D1 a D5 de la guía (empresa, cliente, banco, cantidad de la compra y cuentas †).
3. Reescribir las 26 de prioridad alta, empezando por Ventas, Cartera y las facturas de Contabilidad.
4. Añadir `problemas` a los 15 bloques que no tienen.
5. Pasar la revisión con los tres juniors simulados de `plan_fase2.md` 4.5.
