/* Banco de preguntas del examen de la guía «Contabilidad desde cero» (formación previa). Copia literal del examen original:
   b = bloque, q = pregunta, o = opciones, a = índice de la correcta en o, e = explicación. */
import type { DefExamenPrevio, EjercicioPrevio, PreguntaPrevia } from './examen-comun';
import { eur, fmt, pick, rnd, shuffle } from './examen-comun';

const BLOQUES: Record<string, string> = {A:"Situación económica y financiera",B:"Ciclo financiero y maduración",C:"Normas y tipos de contabilidad",D:"Balance",E:"Pérdidas y ganancias",F:"Cuentas y partida doble",G:"Cierres, presupuestos y ratios"};

const BANK: PreguntaPrevia[] = [
{b:"A",q:"Una empresa cierra el año con 30.000 € de beneficio y su cuenta bancaria en descubierto. ¿Cuál es la explicación más probable?",o:["Ha vendido, pero buena parte de las ventas aún no se ha cobrado","La contabilidad está mal: con beneficio el banco no puede estar en negativo","Ha registrado las ventas por su importe con IVA","No ha aplicado la partida doble"],a:0,e:"Beneficio y dinero no coinciden. Las ventas cuentan como ingreso al facturar, pero el dinero llega al cobrar. Es la situación que lleva a la insolvencia con beneficios."},
{b:"A",q:"Según el principio de devengo, una factura de venta emitida el 28 de diciembre y cobrada el 15 de febrero es ingreso de:",o:["Diciembre, el mes de la factura","Febrero, el mes del cobro","Ambos meses, a partes iguales","Ninguno hasta que se cobre"],a:0,e:"El devengo registra el ingreso cuando se produce la venta, no cuando entra el dinero."},
{b:"A",q:"¿Cuál de estas operaciones cambia el resultado del ejercicio?",o:["Contabilizar la amortización anual de una máquina","Cobrar una factura de un cliente","Pagar a un proveedor una factura ya registrada","Recibir el dinero de un préstamo bancario"],a:0,e:"La amortización es un gasto. Las otras tres solo cambian la forma del activo o del pasivo (dinero por derecho de cobro, dinero por deuda): no hay ingreso ni gasto."},
{b:"A",q:"¿Cuál de estas operaciones reduce la tesorería sin afectar al resultado?",o:["Devolver al banco una parte del principal del préstamo","Pagar el alquiler del mes","Pagar los intereses del préstamo","Pagar la factura de la luz del mes"],a:0,e:"Devolver principal reduce el banco y la deuda a la vez. Alquiler, intereses y luz son gastos y sí reducen el resultado."},
{b:"A",q:"Una empresa está en situación de insolvencia cuando:",o:["No puede atender con regularidad sus pagos, aunque tenga beneficios","Tiene pérdidas dos años seguidos","Su fondo de maniobra es positivo pero pequeño","No ha depositado las cuentas anuales"],a:0,e:"Insolvencia es falta de capacidad de pago. Puede ocurrir con beneficios si no se cobra a tiempo."},
{b:"A",q:"Los intereses que paga una empresa por su préstamo son un coste:",o:["Financiero","De producción","De administración","De comercialización"],a:0,e:"Los intereses son el coste del dinero prestado: coste financiero."},
{b:"A",q:"El sueldo de un comercial y la campaña de publicidad son costes de:",o:["Comercialización","Producción","Administración","Financieros"],a:0,e:"Son costes de vender y llegar al cliente: comercialización."},
{b:"B",q:"Almacén 20 días, fabricación 25 días, cobro a clientes 60 días tras la venta y pago a proveedores a 45 días. ¿Cuántos días hay que financiar?",o:["60","105","150","45"],a:0,e:"Ciclo completo: 20 + 25 + 60 = 105 días. Menos los 45 días que financian los proveedores: 105 − 45 = 60."},
{b:"B",q:"¿Qué medida reduce la necesidad de financiación sin pedir dinero al banco?",o:["Pactar con proveedores pagar a 60 días en vez de 30","Ampliar el plazo de cobro a los clientes para vender más","Aumentar el stock de seguridad del almacén","Comprar maquinaria al contado"],a:0,e:"Pagar más tarde, de forma pactada, acorta los días que la empresa tiene que financiar. Las otras tres medidas alargan el ciclo o consumen tesorería."},
{b:"B",q:"Un cliente que debe pagar 1.000 € a 60 días ofrece pagar hoy 980 €. ¿Qué es?",o:["Un descuento por pronto pago: adelanta la tesorería a cambio de 20 €","Un descuento comercial sin efecto en la tesorería","Un impago parcial de 20 €","Un préstamo del cliente a la empresa"],a:0,e:"Pronto pago o descuento financiero: se renuncia a una parte del importe a cambio de cobrar antes."},
{b:"B",q:"Factura del 20 de marzo con forma de pago «30 días, día de pago 5». ¿Cuál es el vencimiento?",o:["5 de mayo","19 de abril","5 de abril","20 de abril"],a:0,e:"A 30 días es el 19 de abril. El siguiente día 5 a partir de esa fecha es el 5 de mayo."},
{b:"B",q:"La financiación de proveedores consiste en:",o:["El plazo pactado para pagarles, durante el cual la empresa dispone de ese dinero","Un préstamo con intereses que concede el proveedor","Retrasar el pago más allá de lo acordado","Un anticipo que la empresa entrega al proveedor"],a:0,e:"Es el aplazamiento pactado en la forma de pago. No consiste en retrasar pagos sin acuerdo."},
{b:"B",q:"A igual volumen de ventas, ¿por qué un bar necesita menos financiación del circulante que una consultora?",o:["Porque cobra al contado y la consultora cobra a 30 o 60 días","Porque tiene menos gastos de personal","Porque paga menos IVA","Porque no tiene que llevar contabilidad"],a:0,e:"El bar cobra en el momento de la venta. La consultora adelanta sueldos y espera semanas para cobrar."},
{b:"C",q:"¿Quién aprueba las cuentas anuales de una sociedad?",o:["La junta general de socios","Los administradores","El Registro Mercantil","El auditor"],a:0,e:"Los administradores las formulan, la junta las aprueba y después se depositan en el Registro Mercantil."},
{b:"C",q:"¿Dónde se depositan las cuentas anuales para que cualquiera pueda consultarlas?",o:["En el Registro Mercantil","En la Agencia Tributaria","En el Banco de España","En el Registro de la Propiedad"],a:0,e:"El depósito en el Registro Mercantil las hace públicas."},
{b:"C",q:"Un cliente que te debe 8.000 € ha entrado en concurso de acreedores y es dudoso que pague. Aplicando el principio de prudencia:",o:["Se reconoce ya la posible pérdida","Se espera a que el juez resuelva para registrar nada","Se anula la factura de venta","No se hace nada hasta la fecha de vencimiento"],a:0,e:"La prudencia obliga a reconocer los riesgos en cuanto se conocen, y a no anticipar beneficios dudosos."},
{b:"C",q:"Sobre la contabilidad analítica, ¿qué afirmación es correcta?",o:["Es voluntaria y reparte ingresos y costes por línea, producto o proyecto","Es obligatoria y se deposita en el Registro Mercantil","Es la que se presenta a Hacienda","Sustituye a la contabilidad financiera en las pymes"],a:0,e:"La analítica es interna y voluntaria. La financiera es la obligatoria y la que se presenta hacia fuera."},
{b:"C",q:"Una consultora gana 80.000 € en total. La línea A gana 100.000 € y la línea B pierde 30.000 €. ¿Cuál es el resultado de la línea C?",o:["+10.000 €","−10.000 €","+50.000 €","−50.000 €"],a:0,e:"80.000 = 100.000 − 30.000 + C. Por tanto C = 10.000 €."},
{b:"C",q:"La norma que fija cómo se contabiliza en España es:",o:["El Plan General de Contabilidad","La Ley del IVA","El Código de Comercio de 1885 en exclusiva","Las normas internas de cada empresa"],a:0,e:"El PGC contiene los principios, el cuadro de cuentas y los modelos de cuentas anuales."},
{b:"C",q:"El principio de uniformidad significa que:",o:["Un criterio contable elegido se mantiene en el tiempo","Todas las empresas usan las mismas subcuentas","Ingresos y gastos se compensan entre sí","Las cuentas se presentan en euros"],a:0,e:"Si se cambia de criterio cada año, las cifras de distintos años dejan de ser comparables."},
{b:"D",q:"¿Cuál es la ecuación fundamental del balance?",o:["Activo = Patrimonio neto + Pasivo","Activo + Pasivo = Patrimonio neto","Activo = Ingresos − Gastos","Patrimonio neto = Activo + Pasivo"],a:0,e:"Lo que la empresa tiene (activo) se financia con dinero de los socios (patrimonio neto) o de terceros (pasivo)."},
{b:"D",q:"La empresa compra una licencia de su ERP que usará varios años. ¿Dónde se registra?",o:["Inmovilizado intangible","Gasto del ejercicio","Existencias","Inmovilizado material"],a:0,e:"Es un bien sin forma física que dura más de un año: inmovilizado intangible. Después se amortiza."},
{b:"D",q:"Una factura de venta pendiente de cobro a 30 días es:",o:["Activo corriente","Pasivo corriente","Ingreso del año siguiente","Patrimonio neto"],a:0,e:"Es un derecho de cobro que se convertirá en dinero en menos de un año: activo corriente (cuenta 430)."},
{b:"D",q:"Préstamo de 100.000 € que se devuelve en 5 años, 20.000 € este año. ¿Cómo aparece en el balance?",o:["20.000 € en pasivo corriente y 80.000 € en pasivo no corriente","100.000 € en pasivo no corriente","100.000 € en pasivo corriente","100.000 € en patrimonio neto"],a:0,e:"Lo que vence en los próximos doce meses es corriente; el resto, no corriente."},
{b:"D",q:"Las reservas son:",o:["Beneficios de años anteriores que no se repartieron","Dinero guardado en una cuenta bancaria para emergencias","Provisiones para pagar impuestos","El capital aportado por los socios"],a:0,e:"Las reservas son patrimonio neto, no dinero. Ese beneficio puede estar invertido en máquinas, stock o clientes."},
{b:"D",q:"Activo total 500.000 € y pasivo total 320.000 €. ¿Cuánto es el patrimonio neto?",o:["180.000 €","820.000 €","320.000 €","500.000 €"],a:0,e:"Patrimonio neto = Activo − Pasivo = 500.000 − 320.000 = 180.000 €."},
{b:"D",q:"El IVA repercutido de las ventas, pendiente de liquidar, aparece en el balance como:",o:["Pasivo corriente","Ingreso","Activo corriente","Patrimonio neto"],a:0,e:"Es dinero que se debe a Hacienda en el corto plazo. No es un ingreso de la empresa."},
{b:"D",q:"Los tornillos en el almacén pendientes de vender son:",o:["Existencias, dentro del activo corriente","Inmovilizado material","Un gasto del ejercicio","Pasivo corriente"],a:0,e:"El stock es activo corriente: se venderá y se convertirá en dinero en menos de un año."},
{b:"E",q:"Máquina de 48.000 €, vida útil de 8 años, amortización lineal. ¿Cuál es su valor en balance al cabo de 3 años?",o:["30.000 €","18.000 €","42.000 €","48.000 €"],a:0,e:"Cuota anual: 48.000 / 8 = 6.000 €. Tras 3 años: 48.000 − 18.000 = 30.000 €."},
{b:"E",q:"Sobre la amortización, ¿qué afirmación es correcta?",o:["Es un gasto que no supone salida de dinero en el año en que se registra","Es un pago anual al banco","Es un ingreso que compensa la compra","Reduce el pasivo de la empresa"],a:0,e:"El dinero salió al comprar el bien. La amortización reparte ese coste entre los años de uso."},
{b:"E",q:"Ventas 300.000 €, compras 120.000 €, personal 90.000 €, otros gastos 40.000 €, amortización 15.000 € e intereses 5.000 €. ¿Resultado antes de impuestos?",o:["30.000 €","35.000 €","45.000 €","50.000 €"],a:0,e:"300.000 − 120.000 − 90.000 − 40.000 − 15.000 − 5.000 = 30.000 €. 35.000 € sería el resultado de explotación, antes de intereses."},
{b:"E",q:"Si una empresa no amortiza sus máquinas:",o:["Su activo y su beneficio aparecen sobrevalorados","Solo cambia su tesorería","Su activo aparece infravalorado","No cambia nada en las cuentas"],a:0,e:"Al no registrar el gasto, el beneficio sale más alto, y las máquinas siguen valoradas como nuevas."},
{b:"E",q:"Una venta de 1.210 € con el IVA del 21 % incluido. ¿Cuánto aparece como ingreso en la cuenta de pérdidas y ganancias?",o:["1.000 €","1.210 €","210 €","1.210 € en ventas y 210 € en gastos"],a:0,e:"1.210 / 1,21 = 1.000 €. Los 210 € de IVA son una deuda con Hacienda, no ingreso."},
{b:"E",q:"La junta decide no repartir dividendos con el beneficio del año. Ese beneficio:",o:["Pasa a reservas, dentro del patrimonio neto","Se queda para siempre en la cuenta 129","Se ingresa en Hacienda","Se registra como deuda con los socios"],a:0,e:"El beneficio no repartido se convierte en reservas y refuerza los recursos propios."},
{b:"E",q:"En la PyG aparece una variación de existencias positiva de 5.000 €. Significa que:",o:["Al cierre hay más stock que al empezar: parte de lo comprado no se consumió","Se han vendido 5.000 € más de lo previsto","Se han perdido 5.000 € de mercancía","Ha subido el precio de la materia prima"],a:0,e:"El stock que queda en almacén no es gasto del año, por eso corrige las compras a la baja."},
{b:"F",q:"La cuenta 640 Sueldos y salarios pertenece al grupo:",o:["6, gastos","4, acreedores y deudores","7, ingresos","1, financiación básica"],a:0,e:"Grupo 6: compras y gastos. Va a la cuenta de pérdidas y ganancias."},
{b:"F",q:"El grupo 5 del cuadro de cuentas recoge:",o:["Cuentas financieras: bancos, caja y deudas a corto plazo","Ventas e ingresos","Existencias","Clientes y proveedores"],a:0,e:"Grupo 5: cuentas financieras. Clientes y proveedores están en el grupo 4."},
{b:"F",q:"La cuenta 430 Clientes tiene normalmente saldo:",o:["Deudor","Acreedor","Cero siempre","Negativo"],a:0,e:"Es un activo: crece en el Debe. Su saldo normal es deudor."},
{b:"F",q:"La cuenta 400 Proveedores tiene normalmente saldo:",o:["Acreedor","Deudor","Cero siempre","Negativo"],a:0,e:"Es un pasivo: crece en el Haber. Su saldo normal es acreedor."},
{b:"F",q:"Venta a crédito de 2.000 € más el 21 % de IVA. ¿Cuál es el asiento correcto?",o:["Debe 430: 2.420 / Haber 700: 2.000 y Haber 477: 420","Debe 430: 2.000 / Haber 700: 2.000","Debe 700: 2.000 y Debe 477: 420 / Haber 430: 2.420","Debe 430: 2.420 / Haber 700: 2.420"],a:0,e:"El cliente debe el total con IVA (Debe 430). El ingreso es la base (Haber 700). El IVA es deuda con Hacienda (Haber 477)."},
{b:"F",q:"Un cliente paga por transferencia una factura de 1.210 €. ¿Cuál es el asiento?",o:["Debe 572 Bancos / Haber 430 Clientes","Debe 430 Clientes / Haber 572 Bancos","Debe 572 Bancos / Haber 700 Ventas","Debe 700 Ventas / Haber 430 Clientes"],a:0,e:"Entra dinero (Debe 572) y se cancela el derecho de cobro (Haber 430). La venta ya se registró al facturar."},
{b:"F",q:"Compra de mercaderías de 500 € más 105 € de IVA, a pagar en 30 días. ¿Cuál es el asiento?",o:["Debe 600: 500 y Debe 472: 105 / Haber 400: 605","Debe 400: 605 / Haber 600: 500 y Haber 472: 105","Debe 600: 605 / Haber 400: 605","Debe 600: 500 / Haber 572: 500"],a:0,e:"Gasto e IVA soportado al Debe. La deuda con el proveedor (pasivo) al Haber por el total."},
{b:"F",q:"Un aumento de una cuenta de pasivo se anota en:",o:["El Haber","El Debe","Cualquiera de los dos lados","No se anota hasta que se paga"],a:0,e:"Pasivo y patrimonio neto crecen en el Haber. El activo crece en el Debe."},
{b:"F",q:"Los socios aportan 10.000 € de capital por transferencia. ¿Cuál es el asiento?",o:["Debe 572 Bancos / Haber 100 Capital social","Debe 100 Capital social / Haber 572 Bancos","Debe 572 Bancos / Haber 700 Ventas","Debe 572 Bancos / Haber 170 Deudas a largo plazo"],a:0,e:"Aumenta el banco (activo, Debe) y el capital (patrimonio neto, Haber). No es un ingreso ni una deuda."},
{b:"F",q:"¿Qué diferencia hay entre el libro diario y el libro mayor?",o:["El diario lista los asientos por fecha; el mayor agrupa los movimientos por cuenta","El diario es para gastos y el mayor para ingresos","El diario es interno y el mayor se deposita en el Registro Mercantil","El mayor solo recoge las cuentas de balance"],a:0,e:"Son los mismos movimientos ordenados de dos formas: por fecha y por cuenta."},
{b:"F",q:"Un balance de sumas y saldos muestra Debe 50.400 € y Haber 50.000 €. ¿Qué indica?",o:["Hay un error: algún asiento no cuadra o está mal registrado","Un beneficio de 400 €","Una pérdida de 400 €","Que todo es correcto"],a:0,e:"Por la partida doble, la suma del Debe siempre es igual a la del Haber. Si no, hay un error."},
{b:"G",q:"Activo corriente 200.000 € y pasivo corriente 250.000 €. ¿Qué indica el fondo de maniobra?",o:["Es −50.000 €: las deudas a corto superan a los recursos a corto, hay riesgo de liquidez","Es +50.000 €: la empresa tiene margen","Es −50.000 €: la empresa tiene pérdidas","No se puede calcular sin la cuenta de resultados"],a:0,e:"Fondo de maniobra = AC − PC = −50.000 €. No mide beneficio, sino capacidad de pago a corto."},
{b:"G",q:"Activo corriente 150.000 €, existencias 60.000 € y pasivo corriente 100.000 €. ¿Cuánto vale la prueba ácida?",o:["0,90","1,50","0,60","2,50"],a:0,e:"(150.000 − 60.000) / 100.000 = 0,90. 1,50 sería el ratio de liquidez, que incluye el stock."},
{b:"G",q:"El asiento de regularización de fin de año:",o:["Salda las cuentas de los grupos 6 y 7 contra la 129 para obtener el resultado","Salda todas las cuentas de balance","Abre la contabilidad del año siguiente","Liquida el IVA del último trimestre"],a:0,e:"Gastos e ingresos se llevan a la 129, que recoge el resultado. Después vienen el cierre y la apertura."},
{b:"G",q:"Presupuesto de ventas de abril 80.000 €; ventas reales 72.000 €. ¿Cuál es la desviación?",o:["−8.000 €, un 10 % por debajo","+8.000 €, un 10 % por encima","−8.000 €, un 11 % por debajo","−72.000 €"],a:0,e:"72.000 − 80.000 = −8.000 €. Sobre lo presupuestado: −8.000 / 80.000 = −10 %."},
{b:"G",q:"La conciliación bancaria consiste en:",o:["Comparar el saldo de la cuenta 572 con el extracto del banco y explicar las diferencias","Negociar las comisiones con el banco","Pagar a todos los proveedores el mismo día","Pedir al banco un préstamo para cubrir el descubierto"],a:0,e:"Es una tarea del cierre mensual: asegura que lo contabilizado coincide con lo que dice el banco."},
{b:"G",q:"Pasivo total 300.000 € y patrimonio neto 150.000 €. ¿Ratio de endeudamiento (pasivo / patrimonio neto)?",o:["2,00","0,50","1,50","0,33"],a:0,e:"300.000 / 150.000 = 2. Por cada euro de los socios hay dos de deuda."},
{b:"G",q:"Una empresa conoce que no puede pagar sus deudas. ¿En qué plazo debe solicitar el concurso de acreedores?",o:["En los dos meses siguientes","En los seis meses siguientes","Cuando lo pida algún acreedor","Al cerrar el ejercicio"],a:0,e:"La ley concursal obliga a solicitarlo en los dos meses siguientes a conocer la insolvencia."},
{b:"G",q:"¿Para qué sirve el presupuesto de tesorería?",o:["Anticipar cuándo faltará dinero para buscar financiación a tiempo","Calcular el beneficio del año","Fijar el precio de venta de los productos","Calcular la amortización de los activos"],a:0,e:"Prevé cobros, pagos y saldo de banco por periodo. Su objetivo es evitar quedarse sin dinero."}
];

/* ---------- ejercicios con cifras aleatorias (misma generación que el original) ---------- */
const CLASIF: [string, string][] = [
 ["Maquinaria de la fábrica","anc"],["Licencia de software para 5 años","anc"],["Furgoneta de reparto","anc"],
 ["Stock de tornillos en almacén","ac"],["Factura de cliente pendiente de cobro","ac"],["Saldo en cuenta corriente bancaria","ac"],["IVA soportado pendiente de compensar","ac"],
 ["Capital aportado por los socios","pn"],["Beneficios de años anteriores no repartidos","pn"],
 ["Préstamo bancario: cuotas que vencen dentro de 3 años","pnc"],
 ["Factura de proveedor a pagar en 60 días","pc"],["IVA repercutido pendiente de ingresar","pc"],["Cuota del préstamo que vence este año","pc"],
 ["Sueldos del mes","g"],["Alquiler de la nave","g"],["Amortización anual de la maquinaria","g"],["Intereses del préstamo","g"],
 ["Venta de cajas de tornillos","i"],["Prestación de un servicio de mantenimiento","i"]];
const CLASIF_OPT: [string, string][] = [["anc","Activo no corriente"],["ac","Activo corriente"],["pn","Patrimonio neto"],["pnc","Pasivo no corriente"],["pc","Pasivo corriente"],["g","Gasto (PyG)"],["i","Ingreso (PyG)"]];
const CLASIF_EXP: Record<string, string> = {anc:"Bien o derecho que se usa más de un año.",ac:"Se convierte en dinero en menos de un año, o ya es dinero.",pn:"Recursos propios de los socios: no se devuelven.",pnc:"Deuda que vence a más de un año.",pc:"Deuda que vence en menos de un año.",g:"Reduce el resultado del periodo (grupo 6).",i:"Aumenta el resultado del periodo (grupo 7)."};

function genExercises(): EjercicioPrevio[] {
  const ex: EjercicioPrevio[] = [];
  // 1. Asiento de venta
  const B=rnd(24,196)*50, iva=Math.round(B*0.21*100)/100, tot=Math.round((B+iva)*100)/100;
  ex.push({b:"F",t:"Asiento de una venta a crédito",
    txt:"Tornillos del Vallès emite una factura de venta a un cliente, con cobro a 30 días. Indica los importes del asiento.",
    datos:["Base imponible: "+eur(B,2),"IVA aplicable: 21 %"],
    f:[{l:"Debe de 430 Clientes",v:tot,tol:0.01,d:2},{l:"Haber de 700 Ventas",v:B,tol:0.01,d:2},{l:"Haber de 477 IVA repercutido",v:iva,tol:0.01,d:2}],
    exp:"IVA = "+eur(B,2)+" × 21 % = "+eur(iva,2)+". El cliente debe la base más el IVA: "+eur(tot,2)+" (Debe 430). El ingreso es solo la base (Haber 700) y el IVA es deuda con Hacienda (Haber 477). Debe y Haber suman lo mismo."});
  // 2. Periodo de maduración
  const al=rnd(3,8)*5, fa=rnd(2,6)*5, co=pick([30,45,60,90]), pa=pick([30,45,60]);
  const ciclo=al+fa+co, fin=ciclo-pa;
  ex.push({b:"B",t:"Periodo de maduración",
    txt:"Calcula el ciclo completo (desde que entra la materia prima hasta que se cobra) y los días que la empresa tiene que financiar.",
    datos:["Días en almacén: "+al,"Días de fabricación: "+fa,"Días de cobro a clientes tras la venta: "+co,"Días de pago a proveedores: "+pa],
    f:[{l:"Ciclo completo (días)",v:ciclo,tol:0,d:0},{l:"Días a financiar",v:fin,tol:0,d:0}],
    exp:"Ciclo = "+al+" + "+fa+" + "+co+" = "+ciclo+" días. Los proveedores financian "+pa+" días, así que la empresa financia "+ciclo+" − "+pa+" = "+fin+" días."});
  // 3. Amortización
  const n=pick([4,5,8,10]), cuota=rnd(3,12)*1000, K=cuota*n, t=rnd(2,n-1), vn=K-cuota*t;
  ex.push({b:"E",t:"Amortización lineal",
    txt:"La empresa compra una máquina y la amortiza en línea recta, sin valor residual.",
    datos:["Precio de compra: "+eur(K),"Vida útil: "+n+" años","Años transcurridos: "+t],
    f:[{l:"Amortización anual (€)",v:cuota,tol:0.5,d:0},{l:"Valor en balance tras "+t+" años (€)",v:vn,tol:0.5,d:0}],
    exp:"Cuota anual = "+eur(K)+" / "+n+" = "+eur(cuota)+". Amortización acumulada en "+t+" años = "+eur(cuota*t)+". Valor en balance = "+eur(K)+" − "+eur(cuota*t)+" = "+eur(vn)+"."});
  // 4. Cuenta de resultados
  const V=rnd(30,60)*10000, C=Math.round(V*rnd(35,45)/100/1000)*1000, P=Math.round(V*rnd(20,28)/100/1000)*1000, O=Math.round(V*rnd(8,14)/100/1000)*1000, A=rnd(5,20)*1000, I=rnd(2,9)*1000, cobros=Math.round(V*0.85/1000)*1000;
  const RE=V-C-P-O-A, RAI=RE-I;
  ex.push({b:"E",t:"Cuenta de pérdidas y ganancias",
    txt:"Con estos datos del año, calcula el resultado de explotación y el resultado antes de impuestos. Cuidado: no todos los datos sirven.",
    datos:["Ventas (sin IVA): "+eur(V),"Cobrado de clientes en el año: "+eur(cobros),"Compras de materia prima: "+eur(C),"Gastos de personal: "+eur(P),"Otros gastos de explotación: "+eur(O),"Amortización: "+eur(A),"Intereses del préstamo: "+eur(I)],
    f:[{l:"Resultado de explotación (€)",v:RE,tol:0.5,d:0},{l:"Resultado antes de impuestos (€)",v:RAI,tol:0.5,d:0}],
    exp:"Explotación = "+eur(V)+" − "+eur(C)+" − "+eur(P)+" − "+eur(O)+" − "+eur(A)+" = "+eur(RE)+". Antes de impuestos se restan los intereses: "+eur(RE)+" − "+eur(I)+" = "+eur(RAI)+". Lo cobrado no se usa: el resultado se calcula con lo facturado (devengo), no con lo cobrado."});
  // 5. Ratios
  const PC=rnd(8,30)*5000; let AC=PC+rnd(-6,10)*5000; if(AC<=PC*0.5)AC=PC+20000;
  const EX=Math.round(AC*rnd(25,45)/100/1000)*1000;
  const FM=AC-PC, RL=Math.round(AC/PC*100)/100, PA=Math.round((AC-EX)/PC*100)/100;
  ex.push({b:"G",t:"Fondo de maniobra y ratios de liquidez",
    txt:"Con estas partidas del balance, calcula el fondo de maniobra y los ratios. Redondea los ratios a dos decimales.",
    datos:["Activo corriente: "+eur(AC),"   de los que existencias: "+eur(EX),"Pasivo corriente: "+eur(PC)],
    f:[{l:"Fondo de maniobra (€)",v:FM,tol:0.5,d:0},{l:"Ratio de liquidez",v:RL,tol:0.011,d:2},{l:"Prueba ácida",v:PA,tol:0.011,d:2}],
    exp:"Fondo de maniobra = "+eur(AC)+" − "+eur(PC)+" = "+eur(FM)+(FM<0?" (negativo: riesgo de no poder pagar a corto plazo)":"")+". Liquidez = "+fmt(AC)+" / "+fmt(PC)+" = "+fmt(RL,2)+". Prueba ácida = ("+fmt(AC)+" − "+fmt(EX)+") / "+fmt(PC)+" = "+fmt(PA,2)+"."});
  // 6. Clasificación
  const items=shuffle(CLASIF).slice(0,5);
  ex.push({b:"D",t:"Clasifica cada partida",kind:"sel",
    txt:"Indica dónde va cada partida: en qué bloque del balance o si es gasto o ingreso de la cuenta de pérdidas y ganancias.",
    f:items.map((it)=>({l:it[0],v:it[1]})),
    exp:null});
  return ex;
}

export const EXAMEN_CONTABILIDAD: DefExamenPrevio = {
  slug: 'contabilidad',
  h1: 'Examen: contabilidad desde cero',
  lead: 'Evaluación de la guía introductoria de contabilidad. Hazlo sin consultar el material.',
  bloques: BLOQUES,
  bank: BANK,
  clasifOpt: CLASIF_OPT,
  clasifExp: CLASIF_EXP,
  ayudaClasif: 'Del 1 al 5 del cuadro de cuentas, balance: activo (lo que se tiene), patrimonio neto y pasivo (de dónde sale el dinero). Corriente o no corriente según venza en menos o más de un año. Grupos 6 y 7: gastos e ingresos.',
  genExercises,
  prefijoCodigo: 'CTB',
  cert: {
    curso: 'Contabilidad desde cero',
    contenidos: [
      'Contenidos: situación económica y financiera, ciclo financiero, normas contables, balance,',
      'pérdidas y ganancias, partida doble, cierres, presupuestos y ratios.',
    ],
    fichero: 'Certificado contabilidad',
  },
};
