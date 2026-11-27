# Trampas, avisos y la lección «asientos al revés»

Fuente: avisos y problemas de `icon-contabilidad.json`, `carteras.json` (cartera-impagado-devolucion), `contabilidad-avanzada.json` (caso-final), `auditoria/reauditoria.md` (H44), `auditoria/revision_senior_fase2.md`, `auditoria/revision_junior_resto_jm.md`.

## Lección: asientos al revés (debe/haber invertidos)
**Qué pasa**: algunas plantillas de la demo generan el asiento con el Debe y el Haber cambiados respecto a lo que enseña la contabilidad, y las capturas lo muestran así.
- **Impagado/devolución** (plantilla `cefectos_c_devol`, mal configurada en la demo): sale 57200 Bancos al Debe y 43150 al Haber; lo correcto es **43150 «Efectos comerciales impagados» al Debe y 57200 «Bancos» al Haber** (el banco te quita lo que te había abonado). Los gastos del banco van a la 626 al Debe. Ejemplo del curso: 242,00 + 3,00.
- **Remesa de cobro SEPA** (caso final, operación 10): el asiento lleva al Haber una **23000** en lugar de la **43000.00901** del cliente; la subcuenta de C{INI} se queda con 121,00 en el mayor aunque el efecto esté CO. El banco 57200 sube igual 121,00.
- Capturas con asiento invertido (impagado, SEPA) pendientes de rehacer (reauditoría H39/H44): no copies el sentido de la captura.
**Cómo se trata** (decisión editorial): lee el asiento real de tu demo y **compáralo con el correcto** (tabla debe/haber del bloque). Si sale al revés, es la plantilla: **anótalo y sigue; no lo arregles tú** (la plantilla compartida la usan todos los alumnos) y avisa a contabilidad/al equipo de la demo. En una empresa real se revisa la plantilla con contabilidad. Un junior pidió exactamente esto («¿a quién aviso y qué hago?»): el texto debe decirlo.
**Otras inversiones legítimas** (no son errores):
- Banco/tesorería: salida = flujo al Debe y banco al Haber; entrada, al revés.
- **Extracto bancario**: debe y haber están vistos desde el banco; cargo (sale dinero) en positivo y abono en negativo, y en tu 572 es al revés (cargos al Haber, abonos al Debe). Tesorería guarda la salida en negativo: extracto +10,00 casa con tesorería −10,00.
- «Invertir asiento» (contraasiento) y «Retroceder» con periodo cerrado crean un asiento con las mismas cuentas al revés que compensa el original.
- Apertura del ejercicio = cierre al revés (cierre: 100, 129 y 4750 al Debe, 572 al Haber; apertura: 572 al Debe).
**Cómo detectarlo siempre**: ¿lo que tengo (banco, clientes) sube por el Debe? ¿lo que debo (proveedores), capital y ventas por el Haber? ¿suma Debe = suma Haber? Un descuadre «casi siempre es un apunte que falta (el IVA) o un importe en la columna equivocada». No confundas Debe/Haber con «lo que debo»/«lo que tengo»: piensa izquierda y derecha.

## Otras trampas por tema
| Tema | Trampa | Qué hacer |
|---|---|---|
| Cuenta | Plan escrito como «PGE» → «Error en la validación», `split of null` | Escribe el código ES |
| Cuenta | 62999.00000 ya existe (base compartida) | Filtra y usa un número libre |
| Cuenta | Cuenta con grupo auxiliar en una línea | La línea pide «Auxiliar»; usa otra cuenta o rellénalo |
| Posición | 10200 Capital muestra Debe | Es un dato de la ficha, no la regla |
| Mnemotécnico | No aparece en la lista | Ordena por Nemotécnico de mayor a menor |
| Mnemotécnico | Elegir PT en vez de ES | El plan de la empresa es PGE 2008 |
| Tercero | Vuelve a Provisional tras tocar sus pestañas | «Validar» otra vez |
| Tercero | Fila editable de Relaciones sin Plan | Usa «Añadir relación» |
| Plazo de pago | Solo 2 vencimientos | Escribe 0 en plazos 3 y 4 y sus % |
| Caja | Agrupación vacía | Crea AG{INI} antes en Tesorería › Maestros › Agrupaciones |
| Código postal | No hay alta en «Municipios y Poblaciones» | Alta desde la ficha del país |
| Grupo auxiliar | Cabecera sigue en «Terceros» | Reabre el grupo desde la lista |
| Numerador | Justificante «0» en todos | Máscaras `#e#yy` / `{INI}#yy-#n` |
| Asiento | «Nuevo» equivocado | El de las líneas está encima de las columnas |
| Asiento | Sin «Finalizar» | Cuadre ≠ 0 o ya finalizado |
| Asiento | No deja editar líneas | Está Contabilizado: «Abrir a provisional» |
| Asiento | Fecha fuera de periodo | Mes cerrado/inexistente: elige periodo abierto |
| Proceso Contabilización | Empresa «*» sin diario | Contabiliza lo de otros: filtra empresa y diario |
| Copias | `cperiodo_ins…` | Falta el ejercicio 2027 |
| Copias | Justificante AC | Cámbialo en la cabecera antes de finalizar |
| Consultas | Saldos mayores de lo esperado | Base compartida: calcula con tus documentos |
| Consultas | Saldos vacíos | Asientos provisionales o Empresa/Ejercicio mal |
| Integridad | Informe vacío | Es lo normal: no hay descuadres |
| Factura | Contabilizar no se activa | Importe factura ≠ importe total |
| Factura | Sin cartera | Importe total 0 |
| Factura | Sin botón Contabilizar | No está Validada o falta permiso CONTAB |
| Documentos de gestión | No genera asiento | Falta plantilla/tipo de asiento en la tipología |
| Asiento en diario inesperado | — | El diario lo pone el tipo de asiento |
| Plantilla Excel | `JavaNull`, `#¡REF!`, `#¿NOMBRE?` | Fallo del libro; avisa, no edites |
| Entorno | FB «ha sido consolidado»; «Table … does not exists» en Registros fiscales | Fallos del entorno de formación |
| Base de datos | Arriba no pone «BBDD TUTORIAL» | No sigas: es otra base |

## Lecciones de sesiones (síntoma → causa → regla)
- **Remesa de pago con contrapartida «capital»**. Síntoma: en la captura del asiento de la remesa de pago el Haber es 10000.00087. Causa: es la cuenta puente de pagos ordenados del enlace contable de la base de los vídeos, parametrizada sobre una cuenta de capital (lo correcto sería la 401). Regla: señálala como ejemplo de parametrización incorrecta, no como capital ni banco; el 572 lo pone tesorería al contabilizar el movimiento.
- **IVA de la demo**. El repercutido va a 47000.00000 y el soportado a 47200.00000 (en el PGC, 477 y 472; la liquidación va a 47500, 4750). Una ficha mostró descripciones repetidas (resto de la ficha anterior): no afirmes la descripción de esas cuentas (sin verificar). Usa siempre los códigos de la demo en los ejercicios y anota la diferencia con el PGC.
- **Copias de asiento**. Síntoma: cambias importes de una copia y no deja. Causa: la copia puede salir Contabilizada. Regla: «Abrir a provisional» antes de editar. El numerador de la fila EA es `EA#yy-#n`; el ejercicio 2027 ya existe; sumas y saldos y extracto se calculan sobre una base compartida: di «con tus asientos» y filtra por documento `{INI}-DOC*`.
- **Factura que no activa «Contabilizar»**. Síntoma: tras guardar la línea no aparece Contabilizar. Causa: falta escribir el «Importe factura» (6.050,00 en el ejemplo) en el bloque Importes, y debe coincidir con el total calculado. Regla: escríbelo, valida y contabiliza.
- **Orden pedagógico**. Síntoma: el extracto y los saldos usaban asientos que se crean después, y 36 preguntas de examen preguntaban cosas que se enseñan más adelante. Regla: crea y corrige antes de consultar; no preguntes en exámenes nada que se enseñe después.
- **Corregir una factura contabilizada**: descontabilizar antes de corregir; «Contabilizar» solo sale en Entrada/Validado.
