# Guía de reescritura para juniors sin base

Encargo: `plan_fase2.md`, sección 4. Para quién: un junior recién contratado que **nunca ha usado un ERP** y **no sabe contabilidad ni finanzas**. Esta guía la aplican todos los redactores, bloque a bloque. Completa `_fuente/GUIA_REDACCION.md` y no la sustituye: si chocan, manda «Lo que no se toca» de esa guía.

Orden de trabajo de cada bloque:

1. Lee el bloque en la web (pestañas Concepto, Guiado y Demo real).
2. Aplica el **formato** (apartado 1).
3. Aplica la **regla de los términos** con la lista común (apartado 2).
4. Engancha el bloque al **caso continuo** (apartado 3).
5. Repasa el **tono** (apartado 4) y la lista de control (apartado 6).

---

## 1. Formato obligatorio de cada bloque

Cada parte del formato vive en un campo real del JSON (`app/src/types.ts`). La web ya las pinta: no hace falta tocar código.

| Parte | Campo del JSON | Dónde lo ve el alumno | Regla |
|---|---|---|---|
| **Qué vas a aprender** | `objetivo` | Cabecera del bloque, en todas las pestañas | Una frase, verbo en futuro y segunda persona: «Registrarás…», «Sabrás leer…». Un logro que se pueda comprobar. Si usa un término nuevo, lo explica el primer párrafo de `concepto`. |
| **Por qué le importa a la empresa** | Primer párrafo de `concepto` (sale grande) | Concepto, arriba | Tres frases como mucho: qué es, una comparación cotidiana y **qué pasa en la empresa si no se hace o se hace mal** (dinero, Hacienda, cliente, proveedor). |
| **Dónde está la pantalla** | `secciones[].ruta` (array) **y** una línea en `concepto` | Migas de cada parte (Concepto y Guiado) y texto del concepto | `ruta` relleno en toda parte que abre una pantalla. En `concepto`, último párrafo: `Dónde: «Gestión › Compras › Pedidos › Pedidos».` Si hay varias pantallas, la principal. |
| **Pasos con el resultado esperado** | `secciones[].pasos[].texto` + `pasos[].detalle` | Guiado (paso a paso) y Concepto (lista) | `texto`: una acción, rótulo literal. `detalle`: **qué ves después**, con el dato concreto (estado, número, importe). Todo paso que pulsa, guarda o valida lleva `detalle`. |
| **Si algo sale mal…** | `problemas[]` (+ `avisos` de tipo `problema` en la parte) | Demo real, «Si algo falla» (y recuadro «Ojo» del Concepto) | De 2 a 5 por bloque que trabaja en el ERP. `problema` = el síntoma tal como sale en pantalla. `solucion` = qué haces y dónde, en una o dos frases. |
| Qué has aprendido | `aprendido[]` | Final del último paso | Ya existe en todos los bloques. Que nombre el código del alumno y la cifra del caso cuando la haya. |

### 1.1 «Qué vas a aprender» (`objetivo`)

- Bien: «Registrarás la factura de tu proveedor T{INI} y la contabilizarás por 151,25.»
- Mal: «Sabrás qué es un plan contable y qué te dicen los indicadores de cada cuenta.» (dos logros y uno abstracto). Mejor: «Sabrás encontrar una cuenta en el plan contable y leer en su ficha si es de gasto o de ingreso.»
- Sin códigos de tabla ni ids internos.

### 1.2 «Por qué le importa a la empresa» (primer párrafo de `concepto`)

Fórmula: **qué es** + **comparación** + **consecuencia**.

> Un albarán es el papel que llega con la mercancía y dice qué te han traído. Es como el tique de entrega de un paquete. Si no lo registras, el almacén no sabe que tiene la mercancía y la factura del proveedor no se puede comprobar.

La comparación ya existe en casi todos los bloques. Lo que suele faltar es la **consecuencia**. Frases útiles:

- «Si no lo haces, …» (no se puede facturar, el IVA sale mal, pagas dos veces, el banco no cuadra).
- «Gracias a esto, …» (cobras a tiempo, sabes cuánto debes, Hacienda recibe lo correcto).

### 1.3 La línea de la ruta de menú

- Literal, tal como sale en el menú, entre «» y separada con ›: `Dónde: «Finanzas › Cobros y Pagos › Remesas › Registro de remesas».`
- Nunca `>` ni `/`. Varios pasos usan hoy `Finanzas > Maestros > …`: cámbialo a `›`.
- `ruta` (array) en toda parte con pasos que abren una pantalla. La parte que solo explica (sin pantalla) puede llevar `null`.
- El primer paso de una parte que abre pantalla dice la ruta: «Abre «Finanzas › Contabilidad General › Asientos › Asientos»».
- Si la ruta no se ha comprobado en la demo, no la inventes: deja `null` y apúntalo en el diagnóstico.

### 1.4 Pasos con el resultado esperado (`detalle`)

- `texto`: imperativo, una acción: «Pulsa «Validar»». Los datos con su campo: «En «Cantidad» escribe 10».
- `detalle`: empieza por lo que **ves**: «Verás…», «El estado pasa a…», «La línea suma…». Una o dos frases.
- Pon la cifra del caso cuando el paso mueve importes: «La línea suma 10 × 12,50 = 125,00».
- Si la captura es de otro registro, dilo: «La captura es de otro albarán (0AC000002). En el tuyo verás tu número».
- Un paso de solo lectura («Fíjate en…») también lleva `detalle`: qué debe sacar el alumno de esa pantalla.
- `pregunta` (De memoria), `imagen` y `hotspot` **no se tocan**.

### 1.5 «Si algo sale mal…» (`problemas`)

- `problema`: el síntoma literal. Si es un mensaje del ERP, entre «»: «Sale «Cuenta tercero [T{INI}] no existente para relación: [PRO]»».
- `solucion`: qué haces, dónde y cómo compruebas que se arregló.
- Mínimo dos por bloque que trabaja en el ERP. Fuentes: los avisos `problema` del propio bloque, los errores del índice de errores y los típicos de un principiante:
  - «No encuentro la pantalla» → ruta y buscador del menú.
  - «No me deja guardar» → campos con asterisco en rojo.
  - «Mi registro no sale en la lista» → filtro o empresa de la consulta.
  - «Fecha fuera de periodo» → periodo cerrado.
- La web quita de Demo real los problemas repetidos con un «Ojo» del Concepto (`problemasNuevos`): no los dupliques a mano.

---

## 2. Regla de los términos

1. Cada término financiero o del ERP se explica **en línea la primera vez que sale en el módulo**. El orden de lectura es el de `etapas.ts`. Dentro de un bloque, el orden es `objetivo` → `concepto` → partes → pasos.
2. Se explica **ahí mismo**, entre comas o con «es decir», con la **frase modelo** de la tabla. Si el término es contable, añade el **ejemplo numérico** la primera vez, en el mismo párrafo o en un `Ejemplo:` justo después.
3. Si sale primero en `objetivo`, la explicación va en el primer párrafo de `concepto`.
4. En el resto del módulo se usa sin más. En otro módulo se vuelve a explicar, con la misma frase modelo (el alumno puede entrar directo a ese módulo).
5. El glosario subraya y enlaza, pero **no sustituye** a la explicación en línea.
6. Usa siempre la frase modelo de la tabla. Puedes acortarla, pero sin cambiar su sentido. Así el alumno oye la misma definición en todo el curso.
7. Los ejemplos numéricos salen del caso continuo (apartado 3). No inventes otras cifras.

### 2.1 Lista común de términos

**Moverse por el ERP**

| Término | Frase modelo | Ejemplo |
|---|---|---|
| ERP | el programa donde la empresa registra todo lo que hace: compras, ventas, cobros, pagos y contabilidad | Una compra registrada en Compras aparece sola en Contabilidad. |
| Menú | la lista de la izquierda; cada rama lleva a una pantalla | «Gestión › Compras › Pedidos › Pedidos». |
| Pantalla | cada ventana del ERP donde consultas o grabas un tipo de dato | La pantalla de pedidos. |
| Rejilla (lista) | la vista en filas: un registro por fila, para buscar y elegir | La lista de pedidos, uno por fila. |
| Ficha | la vista de un solo registro, con todos sus campos y pestañas | La ficha del pedido 0PC{INI}01. |
| Registro | cada elemento guardado: un tercero, un pedido, un asiento | El tercero T{INI} es un registro. |
| Campo obligatorio | el que lleva asterisco (*); sin él no se puede guardar | «Proveedor *». |
| Pestaña | cada parte de una ficha que agrupa datos relacionados | La pestaña «Líneas» de un pedido. |
| Botón de acción | el botón de la barra de arriba que cambia el estado de un documento | «Validar», «Contabilizar». |
| Maestro | una ficha que se crea una vez y se reutiliza en muchos documentos | El proveedor T{INI}, el artículo 13500620. |
| Código del alumno ({INI}) | tus iniciales dentro del código, para que tus registros no choquen con los de otros alumnos | T{INI} con iniciales JP es TJP. |
| Empresa | la sociedad que lleva su propia contabilidad; todo documento pertenece a una | Empresa 0 «Deister Software» en la demo; S{INI} es la tuya. |
| Unidad de negocio | empresa, delegación y departamento: qué parte de la empresa hace el documento | 0 / CENTRAL / COMPRAS. |
| Tercero | cualquier persona o empresa con la que trabajas; el mismo tercero puede ser cliente y proveedor | T{INI} te vende; C{INI} te compra. |
| Tipología | el tipo de un documento: dice cómo se numera, de dónde viene y cómo se contabiliza | La tipología PC{INI} para tus pedidos. |
| Serie y numerador | el contador que da número a cada documento, como el dispensador de turnos de una tienda | Máscara #e#s#6n: empresa 0, serie AC, contador → 0AC000001. |
| Validar | dar por bueno un documento para que siga el circuito; antes está en provisional | Al validar el albarán, el stock sube 10. |
| Provisional | borrador: todavía se puede cambiar y no cuenta en saldos | Un asiento provisional no sale en el balance. |
| Docflow | el gráfico que encadena los documentos de una operación: de qué viene y qué genera | Oferta → pedido → albarán → factura de T{INI}. |
| Workflow | el circuito de aprobación: el documento espera a que alguien con permiso lo autorice | Un pedido grande queda bloqueado hasta que lo aprueba el jefe. |

**Contabilidad**

| Término | Frase modelo | Ejemplo (caso continuo) |
|---|---|---|
| Contabilidad | el registro en euros de todo lo que entra y sale de la empresa, ordenado por cuentas | Compras 125,00, ventas 200,00, banco 3.077,25. |
| Cuenta contable | un cajón con número donde se guarda un tipo de importe | 57200 Bancos, 60000 Compras, 70000 Ventas. |
| Subcuenta | un cajón dentro del cajón, por ejemplo uno por cliente | 43000.00901 es la cuenta de tu cliente C{INI}. |
| Plan contable | la lista ordenada de todas las cuentas; en España, el PGC | El grupo 6 son gastos; el 7, ingresos. |
| Grupos 1-7 | 1 financiación propia, 2 inmovilizado, 3 existencias, 4 clientes, proveedores y Hacienda, 5 bancos y caja, 6 gastos, 7 ingresos | 10000 Capital (1), 40000 Proveedores (4), 57200 Bancos (5). |
| Debe y haber | los dos lados de cada cuenta: debe a la izquierda, haber a la derecha | Entra dinero en el banco: 57200 al debe por 121,00. |
| Asiento | la anotación completa de una operación; lo que va al debe suma lo mismo que lo que va al haber | Compra: debe 125,00 + 26,25 = haber 151,25. |
| Apunte | cada línea de un asiento: una cuenta y un importe al debe o al haber | 47200 IVA soportado, debe 26,25. |
| Cuadre | debe menos haber; en un asiento siempre da 0 | 151,25 − 151,25 = 0,00. |
| Diario | el libro donde se guardan los asientos, uno detrás de otro; hay uno por origen | DC Compras, DV Ventas, {INI} tus asientos manuales. |
| Justificante | el número que identifica un asiento dentro de su numerador | {INI}26-000001. |
| Contabilizar | pasar un documento a la contabilidad: genera su asiento y ya cuenta en los saldos | Contabilizas la factura y nace el asiento de 151,25. |
| Saldo | lo que queda en una cuenta: suma del debe menos suma del haber (o al revés) | Banco: 3.000,00 + 242,00 − 164,75 = 3.077,25. |
| Extracto (mayor) de una cuenta | la lista de movimientos de una cuenta con su saldo después de cada uno | El mayor de 57200 muestra seis movimientos. |
| Sumas y saldos | el resumen de todas las cuentas: cuánto suma cada lado y qué saldo queda | 70000 Ventas: haber 200,00, saldo 200,00. |
| Ejercicio | el año contable de la empresa | Ejercicio 2026, del 01-01 al 31-12. |
| Periodo | cada mes del ejercicio; si está cerrado, no deja contabilizar en esa fecha | Periodo 10 = octubre de 2026. |
| Plantilla contable | la regla que dice qué cuentas lleva el asiento de cada documento | La plantilla de la factura de compra pone 60000, 47200 y 40000. |
| Mnemotécnico | un alias de cuenta que el ERP traduce a la cuenta real de cada empresa, como un contacto del móvil | Mnemotécnico 70500 → cuenta de ventas de servicios. |
| Tipo contable (de un artículo) | el dato del artículo que decide a qué cuenta va su compra o su venta | 13500620 es PRODUCTO: su compra va a 60000. |
| Analítica (proyecto y sección) | dos etiquetas que dicen a qué parte del negocio va cada gasto | Proyecto DIV{INI}, sección {INI}ADM. |
| Cuenta de resultados | ingresos menos gastos del año: lo que gana o pierde la empresa | 200,00 − 125,00 − 13,50 = 61,50 de beneficio. |
| Balance | la foto de un día: lo que la empresa tiene y lo que debe | Banco 3.077,25 = capital 3.000,00 + beneficio 61,50 + Hacienda 15,75. |

**Documentos de compra y venta**

| Término | Frase modelo | Ejemplo (caso continuo) |
|---|---|---|
| Oferta | el precio que te propone el proveedor antes de comprar, como un presupuesto | 10 uds. del 13500620 a 12,50 = 125,00. |
| Pedido | el encargo en firme que haces al proveedor | Pedido 0PC{INI}01 de 10 uds. |
| Albarán | el papel que llega con la mercancía y dice qué te han traído; al validarlo, el stock cambia | Albarán de 10 uds.: stock +10. |
| Factura | el documento fiscal con el que el proveedor te cobra (o tú cobras al cliente); lleva IVA | PROV-{INI}-001: 125,00 + 26,25 = 151,25. |
| Conformar | cruzar la factura con los albaranes que paga y marcarlos como facturados | Conformas el albarán de 125,00 con la factura. |
| Prevista del asiento | la simulación del asiento antes de grabarlo | Ves 60000 125,00 y 47200 26,25 al debe. |
| Tarifa (lista de precios) | los precios pactados con un proveedor o cliente, para no teclearlos en cada pedido | TF{INI}: 13500620 a 12,50. |
| Stock | las existencias: lo que hay en el almacén; entra y sale con movimientos | Tras la compra, 10; tras la venta, 0. |
| Kardex | el historial de entradas y salidas de un artículo, como el extracto del banco | +10 el 07-10, −10 el 15-10, saldo 0. |
| Factura rectificativa (abono) | la factura de signo contrario que corrige otra ya contabilizada; la original no se borra | Devuelves 1 ud.: −12,50 − 2,63 = −15,13. |
| Cuenta puente de albaranes | la cuenta que guarda la compra o la venta mientras falta la factura; vuelve a cero al facturar | 40090: haber 125,00 con el albarán, debe 125,00 con la factura. |

**IVA**

| Término | Frase modelo | Ejemplo (caso continuo) |
|---|---|---|
| IVA | un impuesto que paga el consumidor final; la empresa lo cobra al vender, lo paga al comprar y entrega la diferencia a Hacienda | 21 % sobre la base. |
| Base imponible | el importe sobre el que se calcula el IVA: el precio sin impuestos | 10 × 12,50 = 125,00. |
| Tipo de IVA | el porcentaje que se aplica: 21 % general, 10 % reducido, 4 % superreducido | 21 %. |
| Cuota | el IVA en euros: base × tipo | 125,00 × 21 % = 26,25. |
| IVA soportado | el IVA que pagas en tus compras; lo puedes restar | 26,25 en la compra a T{INI}, cuenta 47200. |
| IVA repercutido | el IVA que cobras en tus ventas; se lo debes a Hacienda | 42,00 en la venta a C{INI}. |
| Liquidación del IVA | repercutido menos soportado del periodo; si sale positivo, lo ingresas | 42,00 − 26,25 = 15,75 a ingresar. |
| Modelo 303 | la declaración trimestral (o mensual) del IVA | 303 del 4T 2026: 15,75, antes del 30-01-2027. |
| Registro fiscal | la ficha fiscal de cada factura: la que vería Hacienda | Base 125,00, cuota 26,25, total 151,25. |
| Zona y clave fiscal | dónde tributa la empresa o el tercero (zona) y cómo tributa el artículo (clave); con ellas el ERP elige el IVA | ESCO + ESCO + BOG → 21 %. |
| Prorrata | el porcentaje del IVA soportado que puedes restar cuando no todo es deducible | Con prorrata del 80 %: 26,25 × 80 % = 21,00 deducibles. |
| Inversión del sujeto pasivo | cuando el comprador declara a la vez el IVA soportado y el repercutido; a pagar queda 0 | Consultor alemán: 420 − 420 = 0. |
| Retención de IRPF | la parte que restas de la factura de un profesional y que ingresas tú en Hacienda | 1.000 + 210 − 150 = 1.060 a pagar. |

**Cobros, pagos y banco**

| Término | Frase modelo | Ejemplo (caso continuo) |
|---|---|---|
| Cobro / pago | el dinero que entra (te pagan) o sale (pagas) de verdad | Cobras 121,00 el 14-11. |
| Plazo de pago | cuántos pagos y a cuántos días se reparte una factura | P{INI}: 50 % a 30 días y 50 % a 60 días. |
| Vencimiento | la fecha en que toca pagar o cobrar | 14-11-2026 y 14-12-2026. |
| Efecto | cada cobro o pago pendiente que deja una factura, con su importe y su vencimiento | La venta de 242,00 deja dos efectos de 121,00. |
| Cartera | la lista de todos los efectos: lo que te deben y lo que debes | Dos efectos de C{INI} y uno de T{INI}. |
| Tipo de efecto | cómo se paga o cobra: recibo domiciliado, transferencia, cheque… | R{INI} recibo domiciliado; TF transferencia. |
| Estado del efecto | en qué punto está: PE Pendiente, CO Cobrado, PA Pagado, PR Propuesto (en remesa), DV Devuelto | Efecto 1 pasa de PE a CO. |
| Gestión (de cobro o pago) | la bandeja donde juntas efectos para cobrarlos o pagarlos de una vez; al cerrarla, el ERP hace el asiento | Gestión COBD del efecto de 121,00. |
| Remesa | un paquete de efectos que mandas junto al banco para que los cobre o los pague | Remesa de pago a T{INI} por 151,25. |
| Mandato SEPA | la autorización firmada del cliente para cargarle recibos en su cuenta | C{INI} firma el mandato y le cargas 121,00. |
| Recibo devuelto (impagado) | el recibo que el banco del cliente rechaza; el efecto vuelve a estar pendiente | Si devuelven 121,00, el efecto pasa a DV. |
| Banco propio (cuenta financiera) | la ficha de cada cuenta bancaria o caja de la empresa, unida a su cuenta contable | BBVA_{INI} → 57200. |
| Tesorería | el control del dinero real que entra y sale del banco y la caja | Saldo de BBVA_{INI}: 3.077,25. |
| Movimiento de tesorería | cada entrada o salida real de dinero; las salidas se ven en negativo | Comisión: −10,00. |
| Flujo y operación financiera | flujo: el motivo del dinero (comisión, cobro…); operación: qué haces con el banco y qué asiento genera | {INI}COM, comisión de mantenimiento. |
| Extracto bancario (N43) | la lista de movimientos que manda el banco; N43 es el formato de fichero de la banca española | Extracto de BBVA_{INI} con seis líneas. |
| Conciliar | casar cada línea del extracto del banco con su movimiento en el ERP | −151,25 del banco = −151,25 de tesorería. |
| Float | los días de margen para buscar un movimiento en el extracto | Float 1: un pago del miércoles se busca de martes a jueves. |
| Comisión | lo que cobra el banco por un servicio; es un gasto | 3,50 por la transferencia a T{INI}. |
| Anticipo | dinero que cobras o pagas antes de la factura; luego se descuenta | Señal de 500: efecto +500 cobrado y −500 pendiente. |

**Activos y cierre**

| Término | Frase modelo | Ejemplo |
|---|---|---|
| Activo fijo (inmovilizado) | un bien que la empresa usa varios años: un ordenador, una máquina, una furgoneta | Ordenador de 1.200,00. |
| Amortización | repartir el coste de un activo entre los años que se usa; cada parte es gasto del año | 1.200,00 / 4 años = 300,00 al año (25,00 al mes). |
| Valor neto | lo que queda del activo: coste menos amortización acumulada | Tras 1 año: 1.200,00 − 300,00 = 900,00. |
| Baja o venta de un activo | sacarlo del inventario; si lo vendes por más de su valor neto, ganas | Lo vendes por 1.000,00: 1.000,00 − 900,00 = 100,00 de beneficio. |
| Regularización | llevar todos los gastos e ingresos del año a la cuenta de resultados (129) | 70000 200,00 − 60000 125,00 − 62600 13,50 → 129 61,50. |
| Cierre del ejercicio | dejar a cero todas las cuentas el 31-12 con el asiento de cierre | Banco 3.077,25 al haber; capital, 129 y Hacienda al debe. |
| Apertura | copiar los saldos al 01-01 del año siguiente | El banco empieza 2027 con 3.077,25. |
| Consolidación | sumar las cuentas de las empresas de un grupo y quitar lo que se venden entre ellas | La matriz vende 1.000 a su filial: en el grupo se elimina. |

---

## 3. El caso continuo: tu empresa de principio a fin

### 3.1 Personajes y códigos

Todos salen de `_fuente/CODIGOS_ALUMNO.md`. No se crean códigos nuevos para el caso.

| Papel | Código | Dónde se crea | Nota |
|---|---|---|---|
| Tu empresa | `S{INI}` «Empresa prácticas {INI}», ejercicio 2026, banco `CAIXA{INI}` | Maestros › `maestros-v-4` | En la demo los documentos se graban en la empresa **0 «Deister Software»** (unidad 0 / CENTRAL), porque S{INI} no tiene tipologías ni plantillas. Dilo así: «Tu empresa es S{INI}; en la demo trabajas dentro de la empresa 0». Ver decisión D1. |
| Tu proveedor | `T{INI}` «Tercero {INI}» | Compras › `compras-1` | Cuenta del proveedor en la prevista: 40000.T{INI}. |
| Tu cliente | `C{INI}` «Cliente Maestros {INI}», subcuenta 43000.00901, plazo `P{INI}` (50 % a 30 días y 50 % a 60 días), tipo de efecto `R{INI}` (recibo domiciliado) | Contabilidad › `maestros-1`; cliente en Gestión en Compras › `maestros-2` | Hoy Ventas vende a T{INI}. Ver decisión D2. |
| Tu artículo | `13500620` «6000-2RS ISB», tipo contable PRODUCTO | Ya existe en la demo | No se modifica. |
| Tu banco de trabajo | `BBVA_{INI}` (57200), caja `CAJA_{INI}` (57000) | Cartera › `carteras-3` | Lo usan Cartera y Tesorería. Ver decisión D3. |
| Tu diario | `{INI}` «Entrada de asientos {INI}» | Contabilidad › `asientos-1` | Para los asientos manuales. |

### 3.2 Las operaciones del caso, con fechas

Todas en 2026, en el cuarto trimestre (4T). IVA general del 21 %.

| Nº | Fecha | Operación | Importes |
|---|---|---|---|
| 1 | 01-10 | Los socios aportan dinero al banco | 3.000,00 |
| 2 | 05-10 | Oferta y pedido 0PC{INI}01 a T{INI} | 10 uds. × 12,50 = 125,00 + IVA |
| 3 | 07-10 | Llega la mercancía: albarán | Stock +10. Valor 125,00 |
| 4 | 09-10 | Factura PROV-{INI}-001 de T{INI} | Base 125,00 + IVA 26,25 = **151,25** |
| 5 | 15-10 | Venta a C{INI}: albarán y factura | 10 uds. × 20,00 = 200,00 + IVA 42,00 = **242,00**. Stock 0 |
| 6 | 15-10 | La factura de venta deja dos efectos (P{INI}, R{INI}) | 121,00 vence 14-11; 121,00 vence 14-12 |
| 7 | 06-11 | Pagas a T{INI} con una remesa de pago por transferencia | 151,25 + comisión del banco 3,50 |
| 8 | 12-11 | Apuntas a mano una comisión de mantenimiento ({INI}COM) | 10,00 |
| 9 | 14-11 | Cobras el efecto 1 suelto (gestión COBD) | 121,00 |
| 10 | 01-12 | Mandas el efecto 2 en una remesa de cobro SEPA (LRC{INI}); el banco lo cobra el 14-12 | 121,00 |
| 11 | 31-12 | Concilias el extracto de BBVA_{INI} | Seis líneas, saldo 3.077,25 |
| 12 | 31-12 | Liquidas el IVA del 4T (modelo 303) | 42,00 − 26,25 = **15,75** a ingresar antes del 30-01-2027 |
| 13 | 31-12 | Regularizas, cierras y abres 2027 | Beneficio **61,50** |

### 3.3 Los asientos del caso

Las cuentas son las que enseña la demo en los bloques actuales (`compras-factura`, `ventas-1`, `carteras-5`). Las marcadas con † hay que comprobarlas en la demo antes de publicarlas como literales; hasta entonces, escribe el grupo («una cuenta del grupo 626, servicios bancarios»).

| Nº | Asiento | Debe | Haber |
|---|---|---|---|
| 1 | Aportación de los socios | 57200.00000 Bancos 3.000,00 | 10000 Capital social† 3.000,00 |
| 3 | Albarán de compra contabilizado (si la tipología lo contabiliza) | 60000.00000 Compras 125,00 | 40090 Compras pendientes de factura 125,00 |
| 4 | Factura de compra | 40090 125,00 (o 60000.00000 si el albarán no se contabilizó) · 47200.00000 IVA soportado 26,25 | 40000.T{INI} Proveedor 151,25 |
| 5a | Albarán de venta contabilizado (plantilla AV) | 43090 Clientes pendientes de factura 200,00 | 70000.00000 Ventas 200,00 |
| 5b | Factura de venta | 43000.00901 Cliente C{INI} 242,00 | 47700.00000 IVA 42,00 · 43090 200,00 (o 70000.00000 si el albarán no se contabilizó) |
| 7 | Pago a T{INI} | 40000.T{INI} 151,25 · 626 Servicios bancarios† 3,50 | 57200.00000 Bancos 154,75 |
| 8 | Comisión manual | 626 Servicios bancarios† 10,00 | 57200.00000 Bancos 10,00 |
| 9 | Cobro del efecto 1 | 57200.00000 Bancos 121,00 | 43000.00901 121,00 |
| 10 | Cobro del efecto 2 por remesa | 57200.00000 Bancos 121,00 | 43000.00901 121,00 |
| 12 | Liquidación del IVA | 47700.00000 42,00 | 47200.00000 26,25 · 47500 Hacienda acreedora por IVA† 15,75 |
| 13a | Regularización | 70000.00000 200,00 | 60000.00000 125,00 · 626† 13,50 · 12900 Resultado del ejercicio† 61,50 |
| 13b | Cierre | 10000† 3.000,00 · 12900† 61,50 · 47500† 15,75 | 57200.00000 3.077,25 |
| 13c | Apertura 01-01-2027 | 57200.00000 3.077,25 | 10000† 3.000,00 · 12900† 61,50 · 47500† 15,75 |

Fíjate: la demo lleva el IVA repercutido a la 47000; en el PGC va a la 477. `ventas-1` ya lo avisa; mantenlo.

### 3.4 Comprobaciones de cuadre (úsalas en los `Ejemplo:`)

- **Compra**: 10 × 12,50 = 125,00; 125,00 × 21 % = 26,25; total 151,25.
- **Venta**: 10 × 20,00 = 200,00; 200,00 × 21 % = 42,00; total 242,00. Margen: 200,00 − 125,00 = 75,00.
- **Efectos de la venta**: 242,00 × 50 % = 121,00 + 121,00.
- **Stock**: 0 + 10 − 10 = 0.
- **Banco** (BBVA_{INI}): 3.000,00 − 154,75 − 10,00 + 121,00 + 121,00 = **3.077,25**.
- **Clientes**: 242,00 − 121,00 − 121,00 = 0. **Proveedor**: 151,25 − 151,25 = 0.
- **IVA 4T**: 42,00 − 26,25 = 15,75 a ingresar.
- **Resultado**: 200,00 − 125,00 − 3,50 − 10,00 = **61,50** de beneficio.
- **Sumas y saldos antes de liquidar el IVA**: debe 3.077,25 + 125,00 + 13,50 + 26,25 = 3.242,00; haber 3.000,00 + 200,00 + 42,00 = 3.242,00.
- **Balance al 31-12**: activo (banco) 3.077,25 = patrimonio neto 3.061,50 (3.000,00 + 61,50) + pasivo 15,75 (Hacienda).

### 3.5 Qué hace cada módulo con el caso

Para cada módulo: la operación del caso, dónde se cuenta y la frase puente cuando el bloque practica con otros datos.

**Frase puente** (obligatoria cuando el bloque usa datos que no son del caso): un párrafo `Ejemplo:` en `concepto` con esta forma:

> Ejemplo: en tu caso, [operación con cifras del caso]. En la demo practicas con [datos del bloque] porque [motivo: base del vídeo, registro de prácticas, empresa con divisa]. El mecanismo es el mismo.

No cambies las cifras de los pasos: la frase puente las explica.

| Módulo | Operación del caso | Cifras | Bloques donde se cuenta | Frase puente necesaria |
|---|---|---|---|---|
| **0 · Fundamentos** | Todo el caso en papel, sin ERP: las 13 operaciones como cuentas en T | Todas las del 3.2-3.4 | `fundamentos-1` (debe y haber con la operación 1 y la 4; asiento y apunte con la 4; plan y grupos 1-7 con las cuentas del caso), `fundamentos-2` (IVA con la 4 y la 5; efecto con la 6; cobro, pago, remesa con la 7, 9 y 10; conciliación con la 11; cierre con la 13), `fundamentos-navegar` (buscar el tercero T{INI}, abrir su ficha) | No: es donde nace el caso. Cada concepto: frase llana, ejemplo del caso y una pregunta de comprobación. |
| **1 · Maestros** | Creas tu empresa | S{INI}, ejercicio 2026, banco CAIXA{INI} | `maestros-v-3`, `maestros-v-4` | `maestros-v-3`: «La demo trabaja en la empresa 0; en el caso, esa es la empresa donde graban tus documentos». |
| **2 · Contabilidad básica** | Configurar: tu cliente C{INI} con P{INI} y R{INI}, tu diario {INI}. Operar: el asiento de la aportación (operación 1) y leer el asiento de la compra (operación 4) | 3.000,00; 125,00 + 26,25 = 151,25 | `maestros-1` (C{INI}, P{INI}, R{INI}), `asientos-1`, `asientos-2` a `asientos-6`, `asientos-10` (sumas y saldos), `icon-contabilidad-v-1` | `asientos-2`: «En la demo practicas con un gasto de 1.000,00; tu caso empieza con la aportación de 3.000,00 al banco». `icon-contabilidad-v-1`: «El vídeo usa la factura ML0260020 de 1.058,75; la de tu caso es la de T{INI}, de 151,25, que harás en Compras». `asientos-14`: «En tu caso, el pago a T{INI} deja 40000.T{INI} al debe y 57200 al haber por 151,25». |
| **3 · Compras** | Operaciones 2, 3 y 4 | 10 × 12,50 = 125,00; IVA 26,25; total 151,25; stock +10 | `compras-precios`, `compras-3`, `compras-2`, `compras-albaran-contabilizar`, `compras-factura`, `compras-generar-factura`, `maestros-3` | `compras-albaran-contabilizar` y `compras-generar-factura` enseñan un ejemplo comprobado de **4 uds. = 50,00 + 10,50 = 60,50**: añade «La captura es de un albarán de 4 uds.; el tuyo es de 10 × 12,50 = 125,00 y su factura, de 151,25». `compras-abono-devolucion`: si se usa cifra, devolución de 1 ud.: −12,50 − 2,63 = −15,13. `maestros-3`: el stock de ROD{INI} es práctica aparte; el del caso es el 13500620 (+10). |
| **4 · Ventas** | Operación 5 | 10 × 20,00 = 200,00; IVA 42,00; total 242,00; stock 0; efectos 121,00 + 121,00 | `ventas-1` | `ventas-2` (5 × 22,00 = 133,10) **no entra en el caso**: «Es otra venta para practicar el circuito largo; no la sumes a tu caso». Si se aprueba D2, `ventas-1` vende a C{INI}. |
| **5 · Cartera** | Operaciones 6, 7 (parte de cartera), 9 y 10 | Efectos 121,00 + 121,00 (R{INI}); efecto a pagar 151,25 (TF) | `icon-cartera-v-1` (ver los efectos), `carteras-5` (cobro suelto y remesa), `icon-cartera-v-5` y `icon-cartera-v-6` (remesa de pago), mandato SEPA y recibo devuelto (bloques nuevos) | `carteras-1`: «CAR{INI} es un tercero solo para practicar plazos; tu proveedor del caso sigue siendo T{INI}». `carteras-5`: «Tu caso cobra 242,00 de C{INI} en dos efectos de 121,00: uno suelto y otro en remesa». Vídeo con USD/PEN (`icon-cartera-v-1`, `-v-2`, `-v-3`) y efecto de 1.815,00 (`-v-5`, `-v-6`): frase puente con 151,25. |
| **6 · Tesorería** | Operaciones 7 (comisión 3,50), 8 y 11 | Movimientos +3.000,00, −151,25, −3,50, −10,00, +121,00, +121,00; saldo 3.077,25 | `tesoreria-1` (comisión 3,50), `tesoreria-2` y `tesoreria-3` ({INI}COM, −10,00), `tesoreria-4` y `tesoreria-5` (extracto y conciliación), `icon-cartera-v-9` a `-v-11` | `tesoreria-4`: «CAPT_BCO es la cuenta de prácticas; tu extracto del caso tiene seis líneas y termina en 3.077,25». Vídeo con 8.080,15, 1.524,60 y 5.082,00: frase puente con 151,25 (pago) y 121,00 (cobro). |
| **7 · Impuestos** | Operación 12 | Repercutido 42,00; soportado 26,25; 303 del 4T = 15,75 | `icon-impuestos-conceptos`, `icon-impuestos-2`, `icon-impuestos-3` | Los bloques usan 800/968 y 2.100 − 1.260 = 840: añade «En tu caso: 42,00 − 26,25 = 15,75». Vídeo con la empresa ALA: «es otra empresa de la demo, en Álava; tu compra a T{INI} combina ESCO + ESCO + PRODUCTO → 21 %» (comprobar la clave). |
| **8 · Activos** | **No entra en el hilo**: el caso no compra inmovilizado | Ejemplo propio y fijo: ordenador de 1.200,00 a 4 años = 300,00/año; valor neto tras 1 año 900,00 | `icon-activos-conceptos`, `icon-activos-2`, `icon-activos-3` | «Tu empresa todavía no tiene activos fijos. Si comprara un ordenador de 1.200,00, …». Así el cierre del caso sigue cuadrando. |
| **9 · Cierre** | Operación 13 y caso final | Beneficio 61,50; cierre 3.077,25; balance 3.077,25 = 3.061,50 + 15,75 | `icon-contabilidad-2`, `icon-contabilidad-3`, bloque nuevo «Cerrar el ejercicio de tu empresa», caso final | `icon-contabilidad-2` usa 10.000 − 7.000 = 3.000: añade la versión del caso. El caso final repasa las 13 operaciones y pide comprobar las cifras del 3.4. |

### 3.6 Reglas del caso

- Las cifras del caso son estas y no otras. Si un bloque nuevo necesita una cifra, sale de la tabla 3.2. Si no está, pídela antes de inventarla.
- Ningún paso cambia sus cifras por el caso (guardan capturas y progreso). El caso entra por `concepto` (`Ejemplo:`), `detalle` y `aprendido`.
- Cada vez que sale un dato que no es del alumno (empresa 0, LIZ, ALA, 00003, 00087, PRVCC0, CAPT_BCO), di de dónde sale en esa misma frase.
- Cuando un bloque reutiliza algo del caso, dilo con «lo creaste en…»: «Usa el proveedor T{INI} que creaste en «Dar de alta el proveedor y el artículo»».

---

## 4. Tono

Criterios de Sergi (`criterios-sergi`) y `GUIA_REDACCION.md`:

- Español de España y tuteo: «pulsa», «abre», «fíjate». Nada de «usted» ni de voseo.
- Una idea por frase. Frases de 12 a 15 palabras; 20 como mucho. Sin «y… y…» ni punto y coma.
- Párrafos de 3 frases o 60 palabras como mucho.
- Rótulos del ERP literales y entre «»: «Validar», «Prevista de Asiento Contable», «Albaranes pendientes».
- Sin relleno ni voz de manual: fuera «cabe destacar», «según la documentación», «es importante señalar».
- Sin comparaciones de versiones («antes», «ahora», «versión anterior»).
- Sin nombres de tabla (`gcompedh`, `cefectos`, `cjusnumh`) salvo que el alumno los tenga que escribir.
- Ningún dato sin contexto: cuenta, importe o código, siempre con su origen.
- En la interfaz se dice «bloque», no «ejercicio».

Antes y después:

> Antes: «Pulsa Contabilizar y comprueba que se generan el asiento contable, la cartera de efectos y los registros fiscales.»
>
> Después: «Pulsa «Contabilizar».» · detalle: «Se crean tres cosas: el asiento (151,25), el efecto a pagar a T{INI} y el registro fiscal con 26,25 de IVA.»

---

## 5. Lo que no se toca

Lo fija `GUIA_REDACCION.md`: ids de módulo, bloque y sección; `campos.campo`; `imagen`; `hotspot`; `pregunta`; `correcta`; `numero`; `duracionMin`; el token `{INI}`; cifras de los pasos; códigos de cuenta; rótulos; el número y orden de partes, pasos, `checklist`, preguntas y opciones del test.

Lo que **sí** puedes añadir o cambiar: `objetivo`, `concepto`, `paraQueSirve`, `explicacion`, `campos.significado`, `pasos.texto` (sin cambiar la acción), `pasos.detalle`, `avisos`, `problemas`, `aprendido`, `ruta` cuando hoy es `null` y la ruta se ha comprobado, y la explicación de las preguntas del test.

---

## 6. Lista de control del redactor (por bloque)

- [ ] `objetivo`: un logro, verbo en futuro, sin códigos internos.
- [ ] Primer párrafo de `concepto`: qué es + comparación + consecuencia para la empresa.
- [ ] Último párrafo de `concepto`: `Dónde: «… › …».`
- [ ] `ruta` relleno en cada parte con pantalla; pasos con `›`, no `>`.
- [ ] Cada paso que actúa tiene `detalle` con el resultado que se ve.
- [ ] De 2 a 5 `problemas`, con el síntoma literal.
- [ ] Cada término de la lista 2.1 explicado la primera vez que sale en el módulo, con la frase modelo.
- [ ] El bloque se engancha al caso (cifras del 3.2-3.4) o lleva la frase puente.
- [ ] Ningún dato ajeno sin decir de dónde sale (vídeo, otra empresa, captura de otro registro).
- [ ] Frases de 20 palabras como mucho; párrafos de 3 frases.
- [ ] JSON válido: `python3 -c "import json;json.load(open('…'))"`.

---

## 7. Decisiones pendientes para Sergi

- **D1. Empresa del caso.** Hoy todo se graba en la empresa 0 de la demo. Propuesta: el relato habla de «tu empresa S{INI}», y cada bloque aclara que en la demo trabajas en la empresa 0. Alternativa: configurar S{INI} entera (tipologías, plantillas, diarios), que hoy no es viable en la demo.
- **D2. Cliente del caso.** `ventas-1` y `ventas-2` venden a T{INI} (el proveedor). El menú propuesto dice C{INI}. C{INI} ya es cliente en Gestión (`maestros-2`) con P{INI} y R{INI}, lo que da dos efectos de 121,00, perfectos para el cobro suelto y la remesa SEPA. Cambiarlo toca campos `ejemplo` y pasos de Ventas (códigos, no cifras), y quizá capturas. Hasta que decida, la frase puente de Ventas dice: «En el caso, tu cliente es C{INI}; en este bloque das de alta como cliente a T{INI} para practicar».
- **D3. Banco del caso.** CAIXA{INI} es el banco de S{INI}. Cartera y Tesorería usan BBVA_{INI} en la empresa 0. Propuesta: el caso mueve el dinero por BBVA_{INI}.
- **D4. Cantidad de la compra.** Los bloques del circuito (`compras-3`, `compras-2`, `compras-factura`) usan 10 uds. (125,00 / 151,25). Los nuevos comprobados en la demo (`compras-albaran-contabilizar`, `compras-generar-factura`) usan 4 uds. (50,00 / 60,50). El caso usa **10 uds.**, porque es lo que el alumno teclea en `compras-3` y `compras-2`. Los bloques de 4 uds. llevan la frase puente.
- **D5. Cuentas marcadas con †** (10000, 12900, 47500, 626): comprobar en la demo el código literal antes de publicarlas.

## Decisiones del auditor (D1-D5)

- D1: las operaciones del caso se graban en la empresa 0 de la demo (la que está configurada). La empresa S{INI} es la que el alumno crea en Maestros; se usa para practicar su alta y su cierre. Dilo así en el relato.
- D2: Ventas vende al cliente C{INI} (creado en Contabilidad básica › «Dar de alta los datos básicos de contabilidad»). Si las capturas muestran T{INI}, añade una frase puente.
- D3: el banco del caso es BBVA_{INI}.
- D4: la compra del caso es de 10 uds. Los bloques que usan 4 uds. llevan una frase puente.
- D5: usa las cuentas estándar del PGC (100, 129, 475, 626…); el revisor senior las contrasta.
