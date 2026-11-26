# Glosario con frases modelo

Índice: Moverse por el ERP · Contabilidad · Documentos de compra y venta · IVA · Cobros, pagos y banco · Activos y cierre.

Cómo usarlo: la **primera vez** que un término sale en un módulo se explica ahí mismo, entre comas o con «es decir», con la frase modelo de la tabla (puedes acortarla, sin cambiar su sentido). Si es contable, añade el ejemplo numérico en el mismo párrafo o en un `Ejemplo:` justo después. En el resto del módulo se usa sin más; en otro módulo se vuelve a explicar con la misma frase, porque el alumno puede entrar directo. El glosario de la web subraya y enlaza, pero no sustituye a la explicación en línea. Los ejemplos salen del caso continuo (`caso_continuo.md`).

Fuente: `auditoria/guia_junior.md` §2.1, con el plazo del 303 corregido (reauditoría N19). Si el término tiene entrada en `app/src/content/glosario/<módulo>.json`, que la definición coincida con esta frase.

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
| Modelo 303 | la declaración trimestral (o mensual) del IVA | 303 del 4T 2026: 15,75, hasta el 1-02-2027 (el 30-01 cae en sábado). |
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
