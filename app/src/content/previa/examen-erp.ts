/* Banco de preguntas del examen de la guía «Introducción al ERP» (formación previa). Copia literal del examen original:
   b = bloque, q = pregunta, o = opciones, a = índice de la correcta en o, e = explicación. */
import type { DefExamenPrevio, EjercicioPrevio, PreguntaPrevia } from './examen-comun';
import { eur, pick, rnd, shuffle } from './examen-comun';

const BLOQUES: Record<string, string> = {A:"Qué es un ERP y por qué",B:"Axional: entornos, pantallas y módulos",C:"Datos maestros",D:"Compras, ventas y almacén",E:"Integración y contabilidad",F:"Impuestos, costes y facturación",G:"Cobros, pagos, tesorería y caja",H:"Activos, presupuestos, workflows y consultoría"};

const BANK: PreguntaPrevia[] = [
{b:"A",q:"¿Qué significan las siglas ERP?",o:["Enterprise Resource Planning: planificación de recursos empresariales","Economic Report Program: programa de informes económicos","External Relationship Platform: plataforma de relación con terceros","Electronic Receipt Processing: proceso de facturas electrónicas"],a:0,e:"ERP es Enterprise Resource Planning: un sistema que planifica y gestiona los recursos de toda la empresa."},
{b:"A",q:"¿Cuál es la característica que mejor define a un ERP?",o:["Varios módulos que comparten una única base de datos","Un programa de contabilidad con muchos informes","Una hoja de cálculo compartida en la nube","Un programa distinto para cada departamento"],a:0,e:"La clave es la integración: todos los módulos leen y escriben en la misma base de datos, así un dato se introduce una sola vez."},
{b:"A",q:"Una empresa lleva el stock en un Excel, factura con otro programa y envía las facturas en papel a la gestoría. ¿Qué problema típico resuelve un ERP?",o:["Que cada dato se teclee varias veces y cada departamento vea una versión distinta","Que la empresa tenga que pagar IVA","Que los clientes paguen tarde","Que haya que hacer inventario físico"],a:0,e:"Sin ERP se crean silos de información: los datos se copian a mano y no cuadran. El ERP los integra."},
{b:"A",q:"¿Qué es un «silo de información»?",o:["Un departamento cuyos datos están aislados de los demás","Un almacén automático de gran altura","Una copia de seguridad de la base de datos","Un tipo de informe de stock"],a:0,e:"Un silo es un compartimento aislado: lo que sabe un departamento no lo sabe otro. El ERP rompe esas barreras."},
{b:"A",q:"Los ERP nacieron a partir de programas de…",o:["Planificación de materiales en la industria (MRP)","Correo electrónico","Contabilidad pública","Comercio electrónico"],a:0,e:"Primero fue el MRP (planificar materiales en fábricas), luego el MRP II y, al añadir finanzas, ventas, etc., nació el ERP."},
{b:"A",q:"¿Cuál de estos es un inconveniente real de implantar un ERP?",o:["Requiere tiempo, inversión y que la gente cambie su forma de trabajar","Obliga a teclear cada dato en cada departamento","Impide conocer el stock al día","No permite sacar balances"],a:0,e:"Implantar un ERP cuesta dinero, meses de trabajo y un cambio de costumbres. A cambio, ordena y automatiza."},
{b:"A",q:"Según la sesión, ¿por qué una empresa pequeña que crece acaba poniendo un ERP?",o:["Porque los Excel de cada uno dejan de cuadrar y aparece el caos","Porque la ley obliga a todas las empresas","Porque los bancos no aceptan facturas en Word","Porque Hacienda lo exige para el IVA"],a:0,e:"Al crecer, cada uno lleva su Excel, el almacén no cuadra y nadie sabe qué tiene. El ERP pone orden con una base de datos única."},
{b:"B",q:"¿Qué es un entorno de pruebas?",o:["Una copia separada del ERP para probar cambios sin afectar a los datos reales","El escritorio inicial de Axional","Un módulo de control de calidad","La base de datos de producción"],a:0,e:"Se trabaja con varios entornos: producción (real), pruebas y desarrollo. Los cambios se prueban antes de pasarlos a producción."},
{b:"B",q:"En el escritorio de Axional, ¿para qué sirven los canales?",o:["Para avisar a cada usuario de lo que tiene pendiente (aprobaciones, alertas…)","Para conectar con el banco","Para cambiar de entorno","Para importar ficheros Excel"],a:0,e:"Los canales muestran el trabajo pendiente del usuario, muy ligados a los workflows."},
{b:"B",q:"Abres una pantalla y aparece un formulario con campos vacíos. ¿Qué es?",o:["El formulario de búsqueda: se rellenan filtros y se pulsa Ejecutar","Un registro nuevo a punto de guardarse","Un error de carga","El menú de aplicaciones"],a:0,e:"Casi todas las pantallas empiezan con un formulario de búsqueda; al ejecutar se ve la lista o la ficha."},
{b:"B",q:"En un menú de Axional ves un elemento con icono de engranajes naranjas. ¿Qué suele ser?",o:["Un proceso que hace cambios automáticos, a menudo en bloque","Un informe de solo lectura","Un dato maestro","Un enlace a la documentación"],a:0,e:"Los procesos (contabilizar, calcular amortizaciones, cerrar ejercicio…) ejecutan cambios. Conviene saber qué hacen antes de lanzarlos."},
{b:"B",q:"¿Qué módulo implantan prácticamente todos los clientes?",o:["Finanzas","Producción","Transporte","Radiofrecuencia"],a:0,e:"Finanzas «va a todo el mundo»: incluso quien lleva compras o ventas en otro sistema usa las finanzas del ERP."},
{b:"B",q:"Según la sesión, ¿qué módulo cambia más de un cliente a otro?",o:["Ventas","Finanzas","Contabilidad general","Impuestos"],a:0,e:"Finanzas es igual en todas partes y compras es parecido; ventas cambia mucho según el negocio."},
{b:"B",q:"¿Qué es un «vertical»?",o:["Un desarrollo a medida del ERP para un sector concreto","Un tipo de balance","Un menú desplegable","Un almacén de gran altura"],a:0,e:"Ejemplo de la sesión: el vertical funerario, que trabaja con expedientes y órdenes de trabajo."},
{b:"B",q:"¿Para qué sirve el módulo de mantenimiento?",o:["Planificar y gestionar el mantenimiento preventivo, correctivo o predictivo de máquinas e instalaciones","Mantener actualizado el plan de cuentas","Hacer copias de seguridad","Gestionar las vacaciones del personal"],a:0,e:"Gestiona planes de mantenimiento y órdenes de trabajo, como en el ejemplo de los aviones del aeropuerto."},
{b:"C",q:"¿Cuál de estos es un dato maestro?",o:["Un proveedor","Un pedido de compra","Un albarán","Un pago"],a:0,e:"Los maestros son datos estables que se reutilizan (terceros, artículos, cuentas). Pedidos, albaranes y pagos son transacciones."},
{b:"C",q:"En Axional, ¿qué es un tercero?",o:["Cualquier persona o empresa con la que se trabaja: cliente, proveedor, banco…","Solo los clientes","Un tercer usuario que aprueba documentos","La tercera línea de un asiento"],a:0,e:"Un mismo tercero puede ser cliente y proveedor; guarda sus datos fiscales, bancarios y condiciones de cobro y pago."},
{b:"C",q:"Todas las facturas de un cliente salen con el vencimiento equivocado. ¿Dónde está probablemente el error?",o:["En las condiciones de cobro de su ficha de tercero","En el plan de cuentas","En el módulo de producción","En el proceso de cierre del ejercicio"],a:0,e:"Las facturas heredan la forma de pago del tercero. Hay que corregirla en su ficha."},
{b:"C",q:"¿Qué se define en la ficha de un artículo?",o:["Cómo se comporta: unidades, almacén, impuestos, cuentas contables, lotes…","Solo su precio de venta","El número de factura","La fecha de pago al proveedor"],a:0,e:"El artículo configura su funcionamiento en compras, ventas, almacén y contabilidad."},
{b:"C",q:"¿Por qué es tan importante revisar los datos maestros al implantar un ERP?",o:["Porque un error en un maestro se repite en todas las operaciones que lo usan","Porque los maestros se borran cada año","Porque solo los ve la dirección","Porque Hacienda los revisa"],a:0,e:"Un tercero con la forma de pago mal o un artículo con la cuenta mal contaminan cada documento que los use."},
{b:"C",q:"Al dar de alta un cliente, el ERP le crea normalmente…",o:["Una subcuenta contable propia, por ejemplo 43000.00121","Un almacén propio","Un presupuesto propio","Un entorno propio"],a:0,e:"La subcuenta permite llevar un mayor separado de cada cliente."},
{b:"C",q:"¿Cuál de estos NO es un dato maestro?",o:["Una factura de venta","Una cuenta contable","Un artículo","Una forma de pago"],a:0,e:"La factura es un documento transaccional; los otros son maestros."},
{b:"D",q:"¿Cuál es el orden habitual del circuito de compras?",o:["Solicitud → oferta → pedido → albarán → factura → pago","Factura → pedido → albarán → pago","Pedido → pago → albarán → factura","Albarán → oferta → factura → pedido"],a:0,e:"Cada documento nace del anterior: el pedido espera su albarán y el albarán, su factura."},
{b:"D",q:"¿Qué es un albarán?",o:["El documento que acompaña a la mercancía cuando se entrega o se recibe","La factura definitiva","Un contrato anual con un proveedor","Un recibo bancario"],a:0,e:"En compras registra la entrada de mercancía (sube el stock); en ventas, la salida."},
{b:"D",q:"¿Qué significa «casar» o conformar una factura de compra?",o:["Comprobar que coincide con el albarán (y el pedido) antes de aprobarla","Pagarla por transferencia","Enviarla a Hacienda","Juntar varias facturas en una"],a:0,e:"Así no se paga lo que no ha llegado ni a otro precio. En otros ERP se llama «three-way match»."},
{b:"D",q:"¿Qué diferencia hay entre un pedido y un contrato de compra?",o:["El pedido es para una compra puntual; el contrato fija condiciones para compras que se repiten","No hay diferencia","El contrato lo emite el cliente y el pedido el proveedor","El pedido se paga al contado y el contrato a plazos"],a:0,e:"Con un contrato no hay que repetir el concurso cada vez que se compra lo mismo."},
{b:"D",q:"¿Quién suele pagar las facturas de proveedor?",o:["El departamento financiero, desde finanzas","El departamento de compras","El almacén","El proveedor"],a:0,e:"Compras compra pero no paga: separar ambas funciones es un control interno habitual."},
{b:"D",q:"¿Qué documento de ventas reduce el stock del almacén?",o:["El albarán o expedición","La oferta","El pedido","El cobro"],a:0,e:"La salida física de mercancía es el albarán o expedición."},
{b:"D",q:"En logística, ¿qué es un «suministro»?",o:["Una entrada de mercancía en el almacén","Una salida de mercancía","Un recuento de inventario","Un pago a proveedor"],a:0,e:"Suministros son entradas; expediciones, salidas; movimientos internos, traspasos entre almacenes."},
{b:"D",q:"¿Para qué sirve el CRM?",o:["Para la parte comercial previa a la venta: campañas, oportunidades y ofertas","Para pagar a proveedores","Para calcular amortizaciones","Para declarar el IVA"],a:0,e:"El CRM gestiona el embudo de ventas: de las campañas a las oportunidades y de ahí a las ofertas."},
{b:"E",q:"En un ERP, ¿quién escribe el asiento de una factura de venta?",o:["Nadie: el ERP lo genera automáticamente al contabilizar la factura","El contable, a mano, cada noche","El cliente","El departamento de ventas en una hoja aparte"],a:0,e:"Los asientos de facturas, cobros, pagos o amortizaciones se generan solos. A mano solo se hacen ajustes."},
{b:"E",q:"Al contabilizar una factura de venta, ¿qué genera el ERP además del asiento?",o:["El registro fiscal del IVA y el efecto a cobrar en la cartera","Un pedido de compra","Una orden de producción","Un nuevo cliente"],a:0,e:"Una factura alimenta a la vez contabilidad, impuestos, cartera y, a partir del efecto, la previsión de tesorería."},
{b:"E",q:"¿Cómo sabe el ERP qué cuentas contables usar en cada asiento?",o:["Porque se ha parametrizado en unas tablas de configuración","Porque lo adivina por el importe","Porque lo pregunta cada vez al usuario","Porque usa siempre la misma cuenta"],a:0,e:"Parametrizar las cuentas de cada transacción es uno de los trabajos principales del consultor."},
{b:"E",q:"¿Qué consulta de Contabilidad General muestra todos los movimientos de una cuenta y su saldo?",o:["El extracto o mayor de cuentas","El modelo 303","La cartera de efectos","El cuadro de amortizaciones"],a:0,e:"El mayor (extracto) agrupa los apuntes por cuenta, con saldo acumulado."},
{b:"E",q:"¿Para qué sirve la consolidación en Contabilidad General?",o:["Para obtener las cuentas de un grupo de empresas como si fuera una sola","Para cerrar el ejercicio de una empresa","Para pagar varias facturas juntas","Para unir dos almacenes"],a:0,e:"Suma las contabilidades de las sociedades del grupo y elimina las operaciones entre ellas."},
{b:"E",q:"Todas las ventas de un artículo nuevo van a una cuenta equivocada. ¿Qué ha fallado?",o:["La parametrización contable del artículo o del tipo de operación","El cliente","El banco","El modelo 347"],a:0,e:"Se corrige la configuración y se rehacen los asientos afectados."},
{b:"E",q:"¿Por qué es importante llevar la contabilidad al día?",o:["Para que la dirección conozca cada mes cómo va la empresa y pueda decidir","Porque si no, el ERP se bloquea","Porque los clientes lo exigen","No es importante si se hace a final de año"],a:0,e:"Balances y cuentas de resultados al día permiten saber si se va a cobrar pronto o si se puede afrontar una inversión."},
{b:"F",q:"¿Qué es el modelo 303?",o:["La autoliquidación periódica del IVA","El resumen anual de operaciones con terceros","El plan de amortización","Una remesa de cobros"],a:0,e:"El 303 se presenta mensual o trimestralmente: IVA repercutido menos IVA soportado."},
{b:"F",q:"Según la sesión, ¿por qué la declaración del IVA sale «apretando un botón»?",o:["Porque cada transacción tiene configurados sus impuestos y se registran automáticamente","Porque Hacienda la calcula sola","Porque el IVA no hay que declararlo","Porque se copia la del año anterior"],a:0,e:"Cada operación registra sus impuestos al contabilizarse, así que el sistema ya tiene los totales."},
{b:"F",q:"A un abogado se le aplica una retención del 15 % sobre 1.000 € de honorarios. ¿Qué pasa con esos 150 €?",o:["La empresa los descuenta del pago y los ingresa en Hacienda por el abogado","La empresa se los queda como descuento","Se suman al IVA","Se pagan al abogado al año siguiente"],a:0,e:"La retención se descuenta al proveedor y se ingresa en Hacienda en su nombre."},
{b:"F",q:"¿Para qué sirve el submódulo de Costes?",o:["Para la contabilidad analítica: resultados por centro, proyecto o línea de negocio","Para pagar a proveedores","Para calcular el IVA","Para dar de alta artículos"],a:0,e:"Permite ver dónde se gana y dónde se pierde, y repartir gastos comunes entre centros."},
{b:"F",q:"El alquiler de 6.000 € se reparte entre tres departamentos por metros ocupados. ¿Cómo se llama esto en Costes?",o:["Un reparto de costes","Una remesa","Una conciliación","Una consolidación"],a:0,e:"Los repartos distribuyen un gasto común entre centros de coste según un criterio."},
{b:"F",q:"¿Qué es la facturación financiera?",o:["Registrar la factura directamente en finanzas, sin pedidos ni albaranes","Facturar intereses a un banco","Facturar solo a entidades financieras","Una factura que no lleva IVA"],a:0,e:"Es la opción para empresas sencillas sin almacén: la factura es un asiento con su cobro."},
{b:"F",q:"¿Qué tipo de empresa usaría normalmente la facturación financiera para sus ventas?",o:["Una consultora de servicios sin almacén","Una distribuidora con varios almacenes","Una fábrica de muebles","Un supermercado"],a:0,e:"Sin mercancía ni albaranes, basta con la factura financiera."},
{b:"G",q:"En Axional, ¿qué es un efecto?",o:["Cada vencimiento de cobro o de pago de una factura","Un efecto contable sobre el balance","Un tipo de asiento de cierre","Un proveedor habitual"],a:0,e:"Al contabilizar la factura se crea uno o varios efectos, con importe, vencimiento, tipo y estado."},
{b:"G",q:"Una factura de 3.000 € «a 30, 60 y 90 días» genera…",o:["Tres efectos de 1.000 €","Un efecto de 3.000 €","Tres facturas","Una remesa"],a:0,e:"Cada plazo es un efecto con su vencimiento."},
{b:"G",q:"¿Qué es una remesa?",o:["Un grupo de efectos que se envían juntos al banco para pagarlos o cobrarlos","Un envío de mercancía","Una devolución de un cliente","Un tipo de presupuesto"],a:0,e:"La remesa genera un único fichero (soporte electrónico) con todas las órdenes para el banco."},
{b:"G",q:"Forma de pago «30 días, día de pago 10». ¿Cuándo se paga una factura del 12 de julio?",o:["El 10 de septiembre","El 10 de agosto","El 11 de agosto","El 12 de agosto"],a:0,e:"12 de julio + 30 días = 11 de agosto; el día 10 de agosto ya ha pasado, así que se paga el 10 de septiembre."},
{b:"G",q:"¿Qué es la conciliación bancaria?",o:["Emparejar los movimientos del extracto del banco con los registrados en el ERP","Negociar con el banco las comisiones","Unir dos cuentas bancarias","Pedir un préstamo"],a:0,e:"Confirma que lo previsto ha ocurrido de verdad y detecta diferencias."},
{b:"G",q:"¿De dónde salen principalmente las previsiones de tesorería?",o:["De los efectos de la cartera: cada vencimiento es un cobro o pago previsto","De los presupuestos de ventas del año anterior","De los albaranes de compra","Del plan de cuentas"],a:0,e:"Cada efecto pendiente genera una previsión en su fecha; al cobrar o pagar, se concilia con el banco."},
{b:"G",q:"¿Para qué sirve el submódulo de Caja?",o:["Para controlar el efectivo de la empresa (caja chica), con arqueos y su paso al banco","Para gestionar las cuentas bancarias","Para calcular las nóminas","Para las remesas de pagos"],a:0,e:"Tesorería gestiona los bancos; Caja, el dinero en efectivo."},
{b:"G",q:"Al cerrar la tienda, el arqueo da 825 € que se llevan al banco. Al día siguiente el extracto muestra 820 €. ¿Qué ocurre?",o:["La conciliación no cuadra y hay que investigar la diferencia de 5 €","Se concilia automáticamente","Se anula el arqueo","Se genera un pedido de compra"],a:0,e:"Cualquier diferencia entre lo previsto y lo recibido hace saltar la alarma."},
{b:"H",q:"¿Qué es la amortización de un activo?",o:["El reparto de su coste entre los años en que se usa, reflejando su pérdida de valor","El pago a plazos de un préstamo","La venta del activo","El seguro del activo"],a:0,e:"Sin amortizar, el balance mostraría máquinas viejas con el valor de nuevas: una foto falsa."},
{b:"H",q:"¿Cuál de estos bienes NO se amortiza?",o:["Un terreno","Una furgoneta","Un ordenador","Una máquina"],a:0,e:"Los terrenos no pierden valor por el uso, por eso no se amortizan."},
{b:"H",q:"¿Qué es el valor residual?",o:["La parte del coste que se espera recuperar al final de la vida útil y no se amortiza","El IVA del activo","Lo que queda por pagar al proveedor","El valor del activo el primer día"],a:0,e:"Base amortizable = coste − valor residual."},
{b:"H",q:"¿Qué diferencia hay entre el presupuesto económico y el financiero?",o:["El económico prevé ingresos y gastos; el financiero, cobros y pagos","Ninguna","El económico es anual y el financiero mensual siempre","El financiero solo incluye bancos extranjeros"],a:0,e:"Uno mide resultados y el otro, dinero. Una venta a 90 días aparece en meses distintos en cada uno."},
{b:"H",q:"¿Qué es un workflow en un ERP?",o:["Un circuito de aprobación configurado según las condiciones de cada documento","Un informe de flujos de caja","Un tipo de almacén","Un proceso de cierre"],a:0,e:"Ejemplo: facturas de más de 1.000 € las aprueba el director; las demás, el responsable."},
{b:"H",q:"¿Qué ventaja principal da un workflow a la empresa?",o:["Todo queda monitorizado: se sabe en qué persona está parado cada documento","Elimina la necesidad de aprobar documentos","Calcula los impuestos","Reduce el stock"],a:0,e:"Las tareas pendientes aparecen en los canales y los atascos se detectan enseguida."},
{b:"H",q:"¿Qué es «parametrizar» un ERP?",o:["Configurarlo con sus propias tablas, sin programar","Programar pantallas nuevas","Comprar más licencias","Hacer copias de seguridad"],a:0,e:"Formas de pago, cuentas por tipo de factura o workflows son parametrización; un vertical es desarrollo."},
{b:"H",q:"Según la sesión, ¿qué recomendación general se da sobre el estándar del ERP?",o:["Si el estándar cubre lo que hace el cliente, seguir el estándar y desarrollar solo lo imprescindible","Desarrollar siempre a medida","Evitar el estándar porque es lento","Usar el estándar solo en producción"],a:0,e:"Cuanto más estándar, más fácil de mantener y actualizar; a medida, solo lo necesario."},
{b:"H",q:"Según la sesión, ¿qué diferencia hay entre Axional y SAP?",o:["SAP se configura mucho pero programar cuesta; Axional permite personalizar con más facilidad","SAP no tiene módulo de finanzas","Axional no permite workflows","No hay diferencias"],a:0,e:"Por eso Axional encaja en empresas con necesidades muy especiales que quieren el sistema a medida."}
];

/* ---------- ejercicios con cifras aleatorias (misma generación que el original) ---------- */
const CLASIF: [string, string][] = [
 ["Registrar la llegada de 50 cajas del proveedor (albarán)","log"],["Hacer un recuento de inventario del almacén","log"],["Traspasar mercancía de Barcelona a Madrid","log"],
 ["Pedir ofertas a tres proveedores para comprar sillas","com"],["Lanzar un pedido de compra a un proveedor","com"],
 ["Registrar el pedido que nos hace un cliente","ven"],["Preparar una oferta para un cliente","ven"],
 ["Lanzar una orden para fabricar 1.000 unidades","pro"],
 ["Consultar el mayor de la cuenta de bancos","cg"],["Sacar el balance de situación del trimestre","cg"],
 ["Preparar el modelo 303 del IVA","imp"],["Revisar las retenciones practicadas a profesionales","imp"],
 ["Enviar al banco una remesa de pagos a proveedores","cyp"],["Consultar los efectos pendientes de cobro de un cliente","cyp"],
 ["Conciliar el extracto bancario de ayer","tes"],["Ver la previsión de dinero de los próximos tres meses","tes"],
 ["Calcular la amortización anual de una furgoneta","act"],
 ["Hacer el arqueo del efectivo de la tienda","caj"],
 ["Dar de alta un nuevo proveedor con su forma de pago","mae"],["Crear un nuevo artículo con sus cuentas contables","mae"]];
const CLASIF_OPT: [string, string][] = [["com","Compras"],["ven","Ventas"],["log","Logística"],["pro","Producción"],["mae","Maestros"],["cg","Finanzas · Contabilidad general"],["imp","Finanzas · Impuestos"],["cyp","Finanzas · Cobros y pagos"],["tes","Finanzas · Tesorería"],["act","Finanzas · Activos permanentes"],["caj","Finanzas · Caja"]];
const CLASIF_EXP: Record<string, string> = {com:"Compras gestiona solicitudes, ofertas, pedidos y contratos con proveedores.",ven:"Ventas gestiona ofertas, pedidos, albaranes y facturas a clientes.",log:"Logística controla entradas, salidas, traspasos e inventarios del almacén.",pro:"Producción gestiona las órdenes de fabricación.",mae:"Los terceros y los artículos son datos maestros.",cg:"Mayores, saldos y balances están en Contabilidad General.",imp:"IVA, retenciones y declaraciones están en Impuestos.",cyp:"Efectos, cartera y remesas están en Cobros y Pagos.",tes:"Previsiones y conciliación bancaria están en Tesorería.",act:"Los bienes duraderos y su amortización están en Activos permanentes.",caj:"El efectivo y sus arqueos están en Caja."};
const MESES=["enero","febrero","marzo","abril","mayo","junio","julio","agosto","septiembre","octubre","noviembre","diciembre"];

function genExercises(): EjercicioPrevio[] {
  const ex: EjercicioPrevio[] = [];
  // 1. Factura de compra con IVA y su efecto
  const B=rnd(12,180)*25, iva=Math.round(B*0.21*100)/100, tot=Math.round((B+iva)*100)/100;
  ex.push({b:"E",t:"Factura de compra: asiento, IVA y efecto",
    txt:"Registras una factura de compra de material. Al contabilizarla, ¿qué importes genera el ERP?",
    datos:["Base imponible: "+eur(B,2),"IVA aplicable: 21 %","Pago en un solo vencimiento"],
    f:[{l:"IVA soportado (€)",v:iva,tol:0.01,d:2},{l:"Total de la factura (€)",v:tot,tol:0.01,d:2},{l:"Importe del efecto a pagar en cartera (€)",v:tot,tol:0.01,d:2}],
    exp:"IVA = "+eur(B,2)+" × 21 % = "+eur(iva,2)+". Total = "+eur(B,2)+" + "+eur(iva,2)+" = "+eur(tot,2)+". El efecto a pagar es el total de la factura: lo que se pagará al proveedor. El asiento: Debe 600 Compras "+eur(B,2)+" y 472 IVA soportado "+eur(iva,2)+" / Haber 400 Proveedores "+eur(tot,2)+"."});
  // 2. Factura con retención
  const H=rnd(8,60)*100, ret=pick([7,15,19]), ivaH=Math.round(H*0.21*100)/100, retI=Math.round(H*ret)/100, pagar=Math.round((H+ivaH-retI)*100)/100;
  ex.push({b:"F",t:"Factura de un profesional con retención",
    txt:"Un asesor te factura sus honorarios con IVA y retención. Calcula lo que retienes y lo que le pagas.",
    datos:["Honorarios (base): "+eur(H,2),"IVA: 21 %","Retención: "+ret+" %"],
    f:[{l:"Importe de la retención (€)",v:retI,tol:0.01,d:2},{l:"Importe a pagar al asesor (€)",v:pagar,tol:0.01,d:2}],
    exp:"Retención = "+eur(H,2)+" × "+ret+" % = "+eur(retI,2)+". A pagar = base + IVA − retención = "+eur(H,2)+" + "+eur(ivaH,2)+" − "+eur(retI,2)+" = "+eur(pagar,2)+". La retención se ingresa en Hacienda en nombre del asesor."});
  // 3. Remesa de pagos
  const dl=pick([10,15,20,25]); const efs: {d:number;i:number}[]=[]; const used: Record<number, number>={}; const nIn=rnd(2,4);
  while(efs.length<nIn){const d=rnd(1,dl); if(used[d])continue; used[d]=1; efs.push({d:d,i:rnd(4,80)*25});}
  while(efs.length<6){const d2=rnd(dl+1,30); if(used[d2])continue; used[d2]=1; efs.push({d:d2,i:rnd(4,80)*25});}
  efs.sort((a,b)=>a.d-b.d);
  const inR=efs.filter((e)=>e.d<=dl); const totR=inR.reduce((s,e)=>s+e.i,0);
  ex.push({b:"G",t:"Preparar una remesa de pagos",
    txt:"Vas a preparar la remesa del día "+dl+" con todos los efectos a pagar que vencen ese día o antes. ¿Cuántos efectos entran y cuál es el total?",
    datos:efs.map((e)=>"Efecto que vence el día "+e.d+": "+eur(e.i)),
    f:[{l:"Número de efectos en la remesa",v:inR.length,tol:0,d:0},{l:"Total de la remesa (€)",v:totR,tol:0.5,d:0}],
    exp:"Entran los efectos con vencimiento hasta el día "+dl+": "+(inR.length?inR.map((e)=>"día "+e.d+" ("+eur(e.i)+")").join(", "):"ninguno")+". Total: "+eur(totR)+". Los demás quedan para la remesa siguiente."});
  // 4. Vencimiento con día de pago
  const mes=rnd(0,8), dia=rnd(1,28), plazo=pick([30,60]), dp=pick([5,10,15,20,25]);
  const f0=new Date(2026,mes,dia), f1=new Date(2026,mes,dia+plazo);
  let fv=new Date(f1.getFullYear(),f1.getMonth(),dp); if(fv<f1) fv=new Date(f1.getFullYear(),f1.getMonth()+1,dp);
  const dias=Math.round((fv.getTime()-f0.getTime())/86400000);
  ex.push({b:"G",t:"Calcular un vencimiento con día de pago",
    txt:"Un proveedor tiene la forma de pago «"+plazo+" días, día de pago "+dp+"». Calcula cuándo se le paga una factura y cuántos días pasan desde la fecha de la factura.",
    datos:["Fecha de la factura: "+dia+" de "+MESES[mes]+" de 2026","Plazo: "+plazo+" días","Día de pago: el "+dp+" de cada mes"],
    f:[{l:"Mes del pago (número, 1 a 12)",v:fv.getMonth()+1,tol:0,d:0},{l:"Días desde la factura hasta el pago",v:dias,tol:0,d:0}],
    exp:"Factura del "+dia+" de "+MESES[mes]+" + "+plazo+" días = "+f1.getDate()+" de "+MESES[f1.getMonth()]+". El siguiente día "+dp+" es el "+dp+" de "+MESES[fv.getMonth()]+" (mes "+(fv.getMonth()+1)+"). Entre la factura y el pago pasan "+dias+" días."});
  // 5. Amortización lineal
  const C=rnd(12,90)*1000, VR=Math.round(C*pick([0,5,10])/100/500)*500, n=pick([4,5,8,10]), k=rnd(1,n-1);
  const cuota=Math.round((C-VR)/n*100)/100, neto=Math.round((C-cuota*k)*100)/100;
  ex.push({b:"H",t:"Plan de amortización lineal",
    txt:"Das de alta un activo en Activos permanentes con amortización lineal. Calcula la cuota anual y su valor en el balance al cabo de "+k+" año"+(k>1?"s":"")+".",
    datos:["Coste del activo: "+eur(C),"Valor residual: "+eur(VR),"Vida útil: "+n+" años"],
    f:[{l:"Cuota de amortización anual (€)",v:cuota,tol:0.5,d:2},{l:"Valor neto tras "+k+" año"+(k>1?"s":"")+" (€)",v:neto,tol:0.5,d:2}],
    exp:"Base amortizable = "+eur(C)+" − "+eur(VR)+" = "+eur(C-VR)+". Cuota = "+eur(C-VR)+" / "+n+" = "+eur(cuota,2)+" al año (asiento 681 a 281). Valor neto tras "+k+" año"+(k>1?"s":"")+" = "+eur(C)+" − "+k+" × "+eur(cuota,2)+" = "+eur(neto,2)+"."});
  // 6. Clasificación por módulo
  const items=shuffle(CLASIF).slice(0,5);
  ex.push({b:"B",t:"¿En qué módulo se hace?",kind:"sel",
    txt:"Indica en qué módulo o submódulo de Axional se realiza cada operación.",
    f:items.map((it)=>({l:it[0],v:it[1]})),
    exp:null});
  return ex;
}

export const EXAMEN_ERP: DefExamenPrevio = {
  slug: 'erp',
  h1: 'Examen: introducción al ERP y al módulo de finanzas',
  lead: 'Evaluación de la guía «Introducción al ERP y al módulo de finanzas». Hazlo sin consultar el material.',
  bloques: BLOQUES,
  bank: BANK,
  clasifOpt: CLASIF_OPT,
  clasifExp: CLASIF_EXP,
  ayudaClasif: 'Recuerda: compras, ventas, logística y producción son módulos de gestión; contabilidad general, impuestos, cobros y pagos, tesorería, activos y caja son submódulos de finanzas; terceros y artículos son datos maestros.',
  genExercises,
  prefijoCodigo: 'ERP',
  cert: {
    curso: 'Introducción al ERP y al módulo de finanzas',
    contenidos: [
      'Contenidos: qué es un ERP, módulos de Axional, datos maestros, circuitos de compras y ventas,',
      'integración contable, impuestos, cobros y pagos, tesorería, caja, activos y workflows.',
    ],
    fichero: 'Certificado ERP',
  },
};
