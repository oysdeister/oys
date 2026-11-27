# Pasada transversal «repeticiones» (27-11-2026)

Objetivo: que cada concepto se explique una vez, en el primer sitio del orden del curso donde el alumno lo necesita (previa → Fundamentos → Datos maestros → Contabilidad básica → Compras → Ventas → Cartera → Tesorería → Impuestos → Activos → Cierre), y que en los demás sitios quede una remisión corta y exacta («Lo viste en «<parte o bloque>» (<módulo>)») más lo que el sitio aporta de nuevo.

Método: volcado con `node auditoria/scripts/volcar_lectura.mjs`, script propio que busca frases de definición («es », «es decir», «significa», «sirve para», «se llama») por término en cada módulo, bloque y parte, y revisión a mano de cada candidato. Antes y después (frases de definición detectadas): debe/haber 7 → 3, plan contable 16 → 12, maestro 28 → 24, apunte 26 → 23, asiento 103 → 91, efecto 84 → 71, remesa 35 → 31, IVA 40 → 34. Lo que queda son usos (aplicar el concepto a un caso) o matices nuevos, no redefiniciones.

No se han tocado glosarios, títulos, ids, listas (número u orden) ni capturas. Todas las remisiones citan títulos que existen (comprobado contra los `titulo` del contenido). `python3 -I auditoria/scripts/comprobar_estructura.py`: solo quedan los 9 errores de número de entradas de glosario, que son del otro agente.

## Mapa de conceptos

| Concepto | Dónde nace (explicación completa) | Sitios convertidos en remisión (y qué aportan ahora) |
|---|---|---|
| Debe y haber | Previa «Contabilidad desde cero», cap. 10 → Fundamentos «Distinguir debe y haber» | Contabilidad básica B1 concepto (aporta: la «posición» de cada cuenta); B8 concepto; Ventas B1 concepto y B5 concepto; Cartera portada «Lo mínimo de contabilidad para este módulo», B1 «Registrar una factura de compra financiera», B13 concepto |
| Asiento y apunte | Previa cap. 10-11 → Fundamentos «Distinguir asiento y apunte» | Contabilidad básica B1 parte «Cuentas contables» (quitada la definición entre paréntesis), B6 concepto, B8 concepto, B17 concepto; Ventas portada «El circuito de ventas», B1 y B5; Cartera B3 (detalle), B13; Tesorería B3 y B9; Impuestos B7 «Qué revisan los controles de integridad»; Activos B2 y B7 |
| Cuenta contable («cajón con número») | Fundamentos «Entender para qué sirve la contabilidad» | Contabilidad básica B1 «Cuentas contables», B3 concepto; Tesorería B1 concepto |
| Plan contable / PGC | Previa cap. 9 → Fundamentos «Situar las cuentas en el plan contable» | Datos maestros B1 concepto y «Leer los datos contables» (aporta: qué plan usa la empresa 0); Contabilidad básica portada «Cómo moverte por el ERP», B1 concepto y «Planes contables» (aporta: uno por país, cada empresa elige el suyo); Cartera portada; Impuestos B2 (tipos de impuesto) |
| Maestro | Fundamentos «Leer la rejilla de registros» | Datos maestros portada «Qué son los datos básicos», B1 «Leer la cabecera y la identificación»; Contabilidad básica B5 concepto, B20 concepto y «Tomar las decisiones previas»; Compras B2; Cartera B4; Activos B2 |
| Tercero | Datos maestros «Ver el vínculo con el tercero» | Contabilidad básica B1 «Cuentas contables», B5 concepto; Compras B2 concepto; Ventas B1 concepto (aporta: tercero frente a cliente); Cartera B1 «Dar de alta el tercero CAR{INI}», B2 concepto |
| Contabilizar | Fundamentos «Contabilizar» (y con un asiento, Contabilidad básica «Contabilizar un asiento») | Datos maestros B1 «Leer la cabecera y la identificación»; Compras B8 concepto; Tesorería B1, B3 y B11 |
| Efecto, cartera y vencimiento | Previa ERP cap. 15 → Fundamentos «Seguir el dinero: cobro, pago y efecto» | Contabilidad básica B5 concepto y «Crear el plazo de pago», B16, B25; Compras B1, B11 (dos explicaciones); Ventas B1 y B5; Cartera portada «Qué es la cartera de efectos», B2, B4, B14 |
| Tipo de efecto y plazo de pago | Contabilidad básica B5 «Tipos de efectos» y «Crear el plazo de pago» | Compras B1 «El tercero en Gestión», B2 «Condiciones de cobro y pago», B14 |
| Remesa | Datos maestros «Crear el banco propio para remesas» (completada: cobros o pagos) | Contabilidad básica B5 «Cuentas financieras: bancos y cajas»; Compras B11; Cartera B2 y B10 concepto; Cierre B4 «Pagar y cobrar» |
| Conciliar y extracto | Fundamentos «Conciliar el banco» | Contabilidad básica B5 «Cuentas financieras»; Cartera B14; Tesorería portada «Qué es la tesorería y la conciliación bancaria» (aporta: N43 y casar con movimientos de tesorería) |
| Tesorería | Cartera «Dar de alta bancos propios y cajas» | Cartera B14; Tesorería portada (se mantiene ampliada, con remisión) |
| IVA (base, tipo, cuota, soportado/repercutido, liquidación) | Previa → Fundamentos «Distinguir IVA soportado y repercutido» | Datos maestros B1; Compras B11; Cartera portada (aporta: el efecto lleva el IVA); Impuestos B1 concepto y «IVA repercutido, soportado y liquidación» (aporta: exenciones, base = neto de la línea, liquidación negativa, prorrata) |
| Ejercicio y periodo | Fundamentos «Cerrar el ejercicio» (ejercicio); Contabilidad básica B6 «Abrir la pantalla de asientos» (periodo) | Contabilidad básica B7 concepto, B20 concepto; Compras B14 concepto |
| Cierre, regularización, apertura | Fundamentos «Cerrar el ejercicio» | Cierre B1 concepto (aporta: cuenta 129, asientos y procesos del ERP) |
| Diario | Contabilidad básica «Crear un diario» | Contabilidad básica B7 concepto |
| Mnemotécnico | Contabilidad básica «Entender los mnemotécnicos de cuentas» | Contabilidad básica B27 concepto; Tesorería B2 «Crear el flujo financiero»; Impuestos B2 |
| Numerador y serie | Contabilidad básica «Crear un asiento manual» (justificantes); para documentos, Compras «Preparar la numeración y los tipos de documento» | Compras B4 concepto; Ventas B4 concepto, «Leer la numeración de los documentos» (dos explicaciones); Cartera B2 «Dar de alta el banco propio» |
| Tipología | Compras «Preparar la numeración y los tipos de documento» (también en el opcional Contabilidad básica B20, sin cambios) | Ventas B7 concepto |
| Docflow | Compras «Registrar y contabilizar la factura» | Compras B13 concepto; Ventas portada y B5 concepto; Activos B4 y B6 |
| Oferta | Fundamentos «Ordenar pedido, albarán y factura» | Ventas B7 «Comprobar la tipología de oferta O{INI}» (era idéntica a la de B4) |
| Cuenta puente | Compras «Contabilizar el albarán de compra» (40090) | Sin cambios: los demás sitios ya la usan sin redefinirla |

## Procedimientos y avisos repetidos

| Repetición | Dónde nace | Convertido en remisión |
|---|---|---|
| Menú lateral, buscador Ctrl/⌘ + K, barra superior | Fundamentos «Moverse por el ERP» | Datos maestros B1 «Moverte por Axional» (contradecía la portada, que decía «aquí no se repiten»); portadas de Compras, Ventas, Cartera y Tesorería |
| Buscar por código de objeto | Compras portada «Cómo moverte por el ERP» | Ventas portada |
| Crear con «Añadir …»/«Nuevo» y guardar | Datos maestros portada «Cómo moverte por el ERP» | Compras, Ventas y Cartera (portadas) |
| «Nuevo como» | Contabilidad básica portada | Ventas y Cartera (portadas) |
| Campos con lista y truco del Tab | Datos maestros (lista); Ventas (Tab) | Ventas y Cartera (portadas) |
| Aviso «Hay errores en los datos del formulario» / asterisco rojo | Fundamentos «Recorrer la ficha…» y Datos maestros portada | Contabilidad básica, Compras, Ventas (aviso) y Cartera (portadas) |
| «Demasiado largo» | Compras portada | Cartera portada |
| Números de documento orientativos | Compras portada | Ventas portada |
| «Un asiento siempre cuadra» dicho dos veces en la misma parte | — | Compras B11 «Revisar el asiento contable generado»: la explicación pasa a «compruébalo tú en la pantalla» |

## Pendiente o decidido no tocar

- Glosarios: no se tocan (otro agente).
- Contabilidad básica portada, repaso de una línea de debe y haber: se deja porque ya se presenta como repaso con remisión; solo se cambió la definición del plan de cuentas.
- Contabilidad básica B20 (opcional) define «tipología» antes que Compras; se deja porque un alumno que salte lo opcional necesita la definición de Compras.
- Previa (`app/src/content/previa/*.ts`): no tiene repeticiones con el curso que haya que quitar; es la fuente de la teoría y el curso ya remite a sus capítulos.
- Glosas breves de una palabra que aplican el concepto (por ejemplo «IVA soportado (47200)») se dejan: no son reexplicaciones.

## Resumen

- Se han convertido en remisión unas 75 reexplicaciones en 10 ficheros de contenido (maestros, icon-contabilidad, compras, ventas, carteras, tesoreria, icon-impuestos, icon-activos, contabilidad-avanzada; Fundamentos queda como origen).
- Conceptos centralizados: debe/haber, asiento/apunte, cuenta, plan contable, maestro, tercero, contabilizar, efecto, remesa, conciliar, IVA, ejercicio/periodo, cierre, mnemotécnico, numerador, Docflow, oferta. Más los procedimientos de navegación y el aviso de campos obligatorios en las 5 portadas.
- Ejemplo 1 (Contabilidad básica, B1): antes «Un plan contable es la lista ordenada de cuentas que usa la contabilidad de un país…» → ahora «Ya sabes qué es un plan contable: lo repasaste en Fundamentos, en «Situar las cuentas en el plan contable». Aquí lo ves dentro del ERP. Cada país tiene el suyo…».
- Ejemplo 2 (Cartera, portada): antes «Cada importe se anota en dos cuentas a la vez: una al debe… Ese apunte doble es el «asiento».» → ahora «Debe, haber, asiento y apunte los viste en Fundamentos, en «Distinguir debe y haber» y «Distinguir asiento y apunte». En la cartera los encontrarás en el asiento de cada cobro y de cada pago.»
- Ejemplo 3 (Impuestos, B1): antes «El IVA (impuesto sobre el valor añadido) grava el consumo. La empresa no lo paga de su bolsillo…» → ahora «Qué es el IVA, la base imponible, el tipo y la cuota ya lo viste en Fundamentos. Aquí no se repite: solo se añade lo que pide la declaración.»
- Estructura: 0 errores nuevos; solo los 9 de número de entradas de glosario, que son del otro agente.
