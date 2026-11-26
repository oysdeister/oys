# Gravedad y hallazgos recurrentes

Índice: 1 Criterios de gravedad · 2 Catálogo de hallazgos recurrentes (A contabilidad, B coherencia del caso, C orden y estructura, D junior, E datos y demo, F progreso y exámenes, G forma) · 3 Preguntas de control rápidas.

Cada hallazgo indica dónde se vio (fichero de `auditoria/`). Los ids de bloque son los de entonces: compruébalos antes de citarlos hoy, porque varios bloques se han movido o reescrito.

## 1. Criterios de gravedad

| Nivel | Criterio | Ejemplos reales |
|---|---|---|
| **Crítico / GRAVE** | El alumno no puede terminar, o aprende algo que descuadra contabilidad o rompe datos compartidos | Bloque sin pasos que nunca se marca como hecho (`fundamentos-1`); la venta contabilizada dos veces (albarán con plantilla AV y factura con FV: 400,00 en ventas y 200,00 colgados en la 43090); «cambia la zona del proveedor 00003», dato compartido por todos |
| **Alto / IMPORTANTE** | Incorrecto, incoherente entre bloques, o el junior se atasca sin salida | Regla de debe y haber mal formulada («Debe: lo que la cuenta recibe»); el caso final cita un circuito de Ventas que ya no existe; un bloque exige algo que se crea módulos después; la solución de un error cambia dos campos y convierte dos vencimientos de 121,00 en uno de 242,00 |
| **Medio** | Confuso, repetido, contradictorio sin consecuencia grave | Cuatro cuentas financieras para dos cosas; test de dos bloques que se contradicen; ruta del menú con tres versiones |
| **Bajo / MEJORA** | Pulido | Título con dos puntos; «PGE 2008» en vez de PGC; campo `sesion` sin uso |

Desempate: error de contabilidad o de cifras, un nivel más; solo estilo, uno menos. Un hallazgo sin evidencia (cita o cálculo) no se puntúa: se devuelve.

Prioridad de corrección (de `_fuente/BRIEF_REVISION.md`): 1) contenido incorrecto contrastado con manual, captura o guion; 2) algo roto o inusable; 3) diseño o jerarquía pobre; 4) pulido.

## 2. Catálogo de hallazgos recurrentes

### A. Exactitud contable (senior)

- **Regla de debe y haber por «lo que recibe»** en vez de por tipo de cuenta: contradice el capital (que recibe pero va al haber). Regla correcta del curso: lo que tienes y lo que gastas, al debe; lo que debes, lo que es de los socios y lo que ganas, al haber. (`reauditoria.md` N11; `junior_otro_sector.md` 5; `junior_sin_contabilidad.md` 2)
- **Asiento al revés** en capturas o texto: impagado con la 4315 al haber y la 572 al debe (correcto: 4315 al debe, 572 al haber); cobro de remesa con el banco al haber. Mira las capturas, no solo el texto. (`reauditoria.md` H44; `revision_senior_fase2.md` §2)
- **IVA repercutido en la 47000** (configuración de la demo) frente a la 477 del PGC: debe decirse en cada sitio donde aparece, con «no la copies». La 4700 es lo que Hacienda te debe; la 477, lo que tú debes. (`revision_senior_ventas_workflow.md` 2; `correccion_3.md` M3)
- **Doble contabilización** de ventas o compras: albarán contabilizado (cuenta puente 43090 / 40090) más factura que vuelve a contabilizar. Se corrige con tipología de albarán sin plantilla de asiento, factura que salde la cuenta puente (FVOA) o «Descontabilizar» el albarán antes de facturar. (`reauditoria.md` N03; `revision_senior_final_jm.md` G1)
- **La cuenta puente de albaranes** debe explicarse como deuda provisional que vuelve a cero al facturar; la 400 es la deuda firme. (`correccion_3.md` B5)
- **Cuenta que no corresponde al flujo**: la 62999 (grupo 629) creada «para la comisión» cuando el caso necesita la 626; mnemotécnico 43000 que lleva a la 43000.00000 y no a la subcuenta del cliente; diario de ventas VE frente a DV. (`reauditoria.md` N22; `revision_senior_reauditoria_jm.md` G1)
- **Cuenta puente de pagos** (10000.00087) descrita como capital o banco: es la cuenta puente de pagos ordenados y el banco baja al conciliar. (`correccion_2.md` A3)
- **Fiscal**: plazo del 303 del 4T «antes del 30-01-2027» (sábado: pasa al 1-02-2027); «prorrata» usada para un % deducible por factura (la prorrata es la regla anual). (`reauditoria.md` N19)
- **Cifras mal sumadas o mal escritas**: «5 × 22,00 = 133,10» (falta 110,00 + 23,10 de IVA); concepto de 1 ud (−15,13) y práctica por 60,50. Revisa con script todas las expresiones «a ± b = c». (`reauditoria.md` N24; `revision_senior_fase2.md`)
- **Signo del extracto bancario**: una sola convención para todo el curso, con la equivalencia al signo del banco y el extracto del caso escrito en esa convención (las contradicciones entre `tesoreria-4`, `tesoreria-5`, `icon-cartera-v-9/-v-10` se vieron en `reauditoria.md` N04).
- **Cobro parcial con un efecto ya cobrado**; **descuento solo concepto** sin práctica; **tipo de efecto con «domiciliación bancaria»** (qué exige: tercero, empresa o nada) sin comprobar. (`reauditoria.md` H44; `revision_senior_final_jm.md` I2)

### B. Coherencia del caso continuo

- **«¿Cuál es mi empresa?»**: las operaciones se graban en la empresa 0 de la demo (compartida); `S{INI}` se crea solo para aprender alta, saldos iniciales y cierre. Una sola frase en todo el curso. Si un bloque dice «tu empresa S{INI} compra…», es un hallazgo. (`reauditoria.md` N05; `revision_senior_reauditoria_jm.md`)
- **Cliente del caso**: C{INI}; cualquier «T{INI} como cliente» es residuo (`caso-final-vender`, `datosSimulador` de Ventas, tabla de códigos). (`reauditoria.md` N20)
- **Cantidad de la compra**: 10 uds (125,00 / 151,25); los bloques de 4 uds (60,50) llevan frase puente. (`guia_junior.md` D4)
- **Bloques que prometen datos del alumno y no pueden** («Contabilizarás el albarán de T{INI}» cuando AO{INI} no contabiliza; «Generarás la factura de T{INI}» cuando ya se facturó). Deben decir «con un albarán de la demo». (`reauditoria.md` N09)
- **El caso final repite un circuito que ya cambió** (tras reescribir Ventas): tras cada cambio de circuito, `grep` del término viejo en `contabilidad-avanzada.json` y en los exámenes. (`revision_senior_reauditoria_jm.md` G2)
- **Operaciones del caso que nunca se practican con datos propios** (remesa de pago, remesa SEPA): falta una sección «Aplica a tu caso». (`reauditoria.md` N07)
- **Regularizar o cerrar en la empresa 0** lo vería todo el mundo: el caso final solo lo repasa; la práctica real va en S{INI}. (`revision_senior_fase2.md` A1)
- **Códigos del alumno**: 2 letras siempre; ninguna mención a 3 letras; longitudes máximas (P y R: 3; tipologías: 4); un código, una cosa (`_fuente/CODIGOS_ALUMNO.md`). Nombres de ejemplo coherentes (el cliente es «Cliente Maestros {INI}», no «Tercero {INI}»).

### C. Orden y estructura

- **Dependencia hacia delante**: un bloque usa algo que se crea después (Maestros usaba el cliente de Contabilidad; Contabilidad básica citaba una factura de Compras; un bloque de Tesorería exigido por Contabilidad). Propuesta tipo: mover el bloque con el mismo id (`etapas.ts` + `MOVIDOS`). (`reauditoria.md` N02, N06)
- **Configurar escondido en Operar** (tipologías de Ventas dentro del bloque de venta; workflow de Compras en Operar con seis partes de configuración). El módulo debe tener Configurar con el mismo nivel de detalle que Compras. (`revision_senior_jm_ventas_workflow.md` §0; `revision_senior_final_jm.md` §1)
- **«Para saber más» guarda lo necesario** (ejercicio y periodos, saldos iniciales): lo que un bloque obligatorio exige no puede estar en lo opcional. (`reauditoria.md` N12)
- **Orden interno de un módulo** (Remesas: v-4, v-5, v-6, v-7 antes de `carteras-7`; el bloque que retoma otro, justo detrás). (`reauditoria.md` N15)
- **Bloques demasiado largos** (más de ~60 min o ~35 pasos) y **repetición** (tercero explicado cinco veces; «Cómo moverte» en seis módulos; bancos y cajas cinco veces): una explicación en el módulo dueño, en el resto una frase y «lo creaste en…». (`reauditoria.md` H19-H26)
- **Carga total** del curso (40,8 h obligatorias frente a ~30 h previstas): decisión de Sergi, no del auditor. (`reauditoria.md` N26)
- **Etapa mal nombrada** («Antes de abrir el ERP» después de «Moverse por el ERP»). (`revision_junior_resto_jm.md`)
- **Palabra «bloque» con dos sentidos** (ejercicio del curso y grupo de campos de la ficha). (`revision_junior_resto_jm.md` §0)

### D. Lo que atasca al junior

- **Datos del vídeo sin puente** (LIZ, ALA, 001 en soles, dólares, proveedores 00003/00027/00087, banco PRVCC0): fallo más grave en Cartera, Tesorería, Impuestos y facturas de Contabilidad. Frase puente obligatoria. (`diagnostico_junior.md` fallo 1)
- **«Si algo sale mal» vacío** (15 bloques sin `problemas`), **pasos sin resultado esperado** (215 pasos sin `detalle`), **sin consecuencia para la empresa** en el `concepto`, **sin línea «Dónde»**. (`diagnostico_junior.md`)
- **Términos que se dan por sabidos al cambiar de módulo** (debe, haber, asiento, efecto, remesa, tercero, tipología, Docflow, SII, línea financiera, Cash Pooling). (`diagnostico_junior.md` fallo 6; `reauditoria.md` N31)
- **Valores de campo sin explicar** («Holding = T{INI}», «Proyecto 0», «Tipo de dirección 0», «Días decalaje 2»): o se explican o se dice «déjalo como viene». (`junior_sin_erp.md` 8-9; `junior_sin_contabilidad.md` 4)
- **Rutas con código técnico pegado** («Albaranes (en el buscador: gvenmovd)»), rutas de ficha (pestaña, ⌄) que no son de menú, tres caminos al mismo sitio, nombres de menú con varias versiones («Registro de terceros» / «Registro terceros»). (`junior_sin_erp.md` 4-7; `reauditoria.md` N23)
- **Arreglo «mágico»** de un fallo de la demo sin decir que es un fallo de la demo (importe neto a 50,00; escribir 1 y luego 0 en «Importe dto.»). (`revision_junior_ventas_workflow.md` B1)
- **Paso que exige un fichero** (CSV con «;») sin decir con qué programa se crea ni qué es cada columna. (`revision_junior_ventas_workflow.md` B2)
- **Captura de otro registro** sin avisar («la captura es de otro albarán; en el tuyo verás tu número»); misma captura en tres pasos sin decir dónde mirar. (`guia_junior.md` §1.4; `revision_junior_jm_ventas_workflow.md` §1)
- **Muros de números** (lista de 7 grupos con 12 cuentas el primer día): 4 cuentas para el caso y el resto en «Más adelante». (`junior_otro_sector.md` 6)
- **Cifras que se adelantan** sin origen (3.077,25 antes de explicar los 3,50 y los 10,00): desglose en el momento. (`junior_sin_contabilidad.md` 1)
- **Bloques de Configurar demasiado técnicos** (leer `ctaper = 1`, permisos MODAUD, «auditoría con IA»): a «Para saber más» sin cambiar ids. (`reauditoria.md` N25)

### E. Datos, demo y limitaciones

- **Texto interno visible**: «No sabemos si hay tolerancia», «no lo hemos conseguido. Pide a Deister…», «no está comprobado que el borrador del 303 lo contabilice». Comprobar en la demo o redactar «limitación de la demo». (`reauditoria.md` N18)
- **Limitación de la demo presentada como regla del ERP** (numerador de acuerdos que falla, tolerancia del 60,00 frente a 60,50 que «la demo lo acepta; en una empresa real revisa la diferencia», «Nuevo como» que no aparece en una tipología). Debe decir «solo en esta demo… en un cliente real…». (`revision_senior_final_jm.md` G2; `correccion_4.md`)
- **Dato compartido de la demo** que el bloque manda modificar (zona del proveedor 00003, tipología AACF que no existe): demostración de solo mirar o registro propio. (`reauditoria.md` N13, H06)
- **Cuenta de cliente compartida** (43000.00901 fija en la empresa 0): una subcuenta propia por alumno. (`reauditoria.md` N21; `revision_senior_final_jm.md` I3)
- **Datos de otro alumno o de otra base en capturas** (prefijo ajeno, base distinta de TUTORIAL): decidir tema y prefijo y recapturar. (`reauditoria.md` H32, H39) No se difuminan campos: los datos de la demo son falsos.
- **Revalidación o botón con comportamiento no comprobado** (qué estados admite): el auditor lo contrasta con las notas de la demo antes de aceptar la frase. (`revision_senior_ventas_workflow.md` 11)

### F. Progreso, exámenes y glosario

- **Fundamentos sin examen** y bancos de 4 preguntas (con `APROBADO = 0.8` un fallo suspende); bancos que no cubren los bloques nuevos; preguntas con «Según la documentación…». (`reauditoria.md` N10)
- **Test cuya respuesta correcta contradice el de otro bloque** (histórico del efecto frente a detalle de la gestión). Nunca se cambia la respuesta correcta sin revisar el bloque entero. (`reauditoria.md` N16)
- **Test invertido** (572 = 4.879 frente al extracto 5.000). (`correccion_3.md` A4)
- **Ids perdidos o duplicados** entre commits; ids movidos de fichero sin `MOVIDOS`. Script `--ids-contra`. (`revision_senior_fase2.md` §1)
- **Glosario**: términos que salen en el texto y no están; duplicados; definiciones que difieren de la frase modelo (`redaccion-junior/references/glosario_frases_modelo.md`).

### G. Forma

- **Títulos fuera de norma** (con dos puntos, paréntesis, no infinitivo, con código): «Vender: pedido, albarán y factura» → infinitivo corto. (`reauditoria.md` N29)
- **Nombres inconsistentes** («Deister Manager», «PGE 2008», «Ejercicio 2» repetido nueve veces como título interno). (`reauditoria.md` H38, N30)
- **Frases largas** (más de 20-24 palabras), rutas con «>» (26 pasos), párrafos de más de 3 frases, voz de manual. (`diagnostico_junior.md`)
- **Skill o documento de criterios desactualizado** respecto a una decisión (orden de módulos Contabilidad antes de Compras en `index.ts` frente a `criterios-sergi`): avisa para que Sergi confirme. (`reauditoria.md` N33)

### H. Lecciones de proceso (síntoma → causa → regla)

- **El director duda de un resumen** → el commit anunciaba lo hecho pero la reauditoría proponía mucho más (y un fichero quedó sin tocar) → el resumen separa tres listas: hecho, propuesto y no tocado.
- **Una frase «comprobada» que era deducida** («el proveedor tiene PRO, lo deduzco») → nadie distinguió visto de supuesto → cada afirmación del contenido se ha visto en la demo o en una fuente; lo deducido se marca «(sin verificar)» y pasa a «Necesita la demo».
- **Ayuda de un modelo externo con falsos positivos** → las observaciones se aceptaron sin contrastar → cada observación se comprueba a mano con `grep` sobre el JSON y se descartan las falsas antes de informar.
- **Referencias rotas tras reordenar** («Ver 1.6», «ejercicio 3 de 7», `portadaDatos.ts`, `circuito`) y ediciones perdidas con un reemplazo global → se reordenó sin buscar las referencias cruzadas → tras mover o renombrar, `grep` de las referencias numéricas y de los ids; los ids no cambian; los scripts de reemplazo trabajan sobre copia y se verifican con `git diff`.
- **Test cuya respuesta se adivina** (la correcta es la más larga; preguntas de memoria) → las opciones se redactaron sin equilibrar → opciones de longitud parecida y preguntas de causa («¿por qué…?»); nunca se cambia la `correcta` sin revisar el bloque.
- **Promesa de la interfaz sin cumplir** («Concepto › Guiado › Práctica › Demo real» y casi ningún bloque con Práctica; `?tab=erp` cae en Concepto sin avisar) → se describió la UI de memoria → comprobar la promesa en el código antes de dejarla en un texto.
- **Mezcla «cargo/abono» con «debe/haber»** en la misma sección → desconcierta al junior → un solo vocabulario y cada término explicado la primera vez con un ejemplo numérico.

## 3. Preguntas de control rápidas

- ¿Cada cifra sale del caso o de una fuente? ¿Cuadra el debe con el haber?
- ¿El bloque usa algo que el alumno aún no ha creado según `etapas.ts`?
- ¿Hay un dato ajeno (vídeo, otra empresa, otro registro) sin frase puente?
- ¿Se enseña algo que solo funciona en la demo como si fuera regla del ERP?
- ¿Quedó texto de trabajo («no sabemos», «hay que comprobar») visible al alumno?
- ¿El cambio cierra el mismo error en todos los sitios donde aparecía (caso final, examen, glosario, `datosSimulador`)?
