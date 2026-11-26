# Índice minutado de la sesión II de tesorería (formación Deister, nov. 2024)

Resumen propio, sin citar a los ponentes ni reproducir la grabación. Los minutos [mm:ss] sirven para localizar clips en `app/src/content/video-tesoreria.ts`. Los datos de ejemplo del vídeo (empresa TRI, cifras, fechas) son de otra base: no los uses; usa los de la demo.

**Notas de lectura**  
- La sesión **no menciona en ningún momento** si la pantalla es versión **Next** o **antigua**; por tanto, no lo deduzco y lo indico como “versión no deducible”.  
- La sesión **no cita literalmente** tablas como `tconcomu`, `tconprop` o `textract_concaut`; habla de “conceptos comunes”, “conceptos propios”, `textract_file`/`textract` y “conciliación automática/masiva”.  
- Marco con **(dudoso)** aquello que la sesión no deja claro.

---

## 1) ÍNDICE POR TEMAS

| [mm:ss] | Tema — qué se explica — versión |
|---|---|
| [00:00] | Apertura de la sesión II de tesorería y objetivo general — se pide preguntar en cualquier momento — versión no deducible. |
| [00:25] | Repaso de la sesión anterior — bancos, cuentas financieras, operaciones y flujos, comisiones y parámetros de tesorería — versión no deducible. |
| [00:51] | Alcance de hoy — generar tesorería desde un efecto/remesa, conciliar y cargar extracto; conceptos comunes y propios — versión no deducible. |
| [01:43] | Esquema general — izquierda cobros/pagos y cartera; derecha entidad financiera/extracto; centro tesorería y conciliación — versión no deducible. |
| [04:04] | Factura de compras → cartera — descontabilizar/contabilizar factura, fechas, plazo, cuenta financiera; genera asientos, cartera y registros fiscales — versión no deducible. |
| [05:26] | Cartera/efecto — datos del documento, vencimiento, importes, tipo de efecto TFE transferencia, estado pendiente y caducidad — versión no deducible. |
| [06:16] | Generación individual de tesorería desde efecto — botón/evolución de estados, acción PTs, operación/flujo y enlace contable — versión no deducible. |
| [09:04] | Configuración del enlace contable de cartera — clase pago + tipo TF transferencia genera movimiento de tesorería con operación PM/CDT (dudoso) — versión no deducible. |
| [10:45] | Remesa → tesorería — registro de remesas, selección de efectos, evolución de estado, vínculos y tesorería generada — versión no deducible. |
| [19:21] | Extracto bancario norma 43 — estructura del fichero, cuentas, movimientos, saldos inicial/final y validación de fechas/saldos — versión no deducible. |
| [21:12] | Carga de extracto — almacén de ficheros, nueva carga, formato, empresa/cuenta, procesamiento y resultados `textract_file`/`textract` (dudoso) — versión no deducible. |
| [24:39] | Conciliación individual básica — pantalla partida banco/ERP, selección de movimientos, pestañas de conciliado y marcas — versión no deducible. |
| [28:19] | Dudas iniciales — conceptos del banco no mapeados y movimientos no locales (comisiones, impuestos); se remite a conceptos — versión no deducible. |
| [30:15] | Parametrización de conceptos propios — `cbancpro`, `tconprop`, BBVA/norma 43, tipo de conciliación, familias e integración — versión no deducible. |
| [35:58] | Operaciones a conciliar — mapeo concepto propio ↔ operación financiera y parámetros de conciliación — versión no deducible. |
| [39:29] | Conceptos comunes — códigos de operaciones financieras, estándar español/Consejo Superior Bancario (dudoso), para identificar movimientos o integrar — versión no deducible. |
| [40:21] | Conceptos propios en modo lista/formulario — repaso de la configuración mostrada — versión no deducible. |
| [40:50] | Conciliación individual y botones — cancelar extractos, generar, conciliar efectos y conciliar — versión no deducible. |
| [49:38] | Conciliación automática/masiva — requisitos de conceptos propios, ejemplo concepto 313, rango/cuenta/empresa, proceso y resultado — versión no deducible. |
| [55:13] | Dudas finales — importes que no coinciden/tolerancia y terminología debe/haber frente a cobro/pago; alineación de términos — versión no deducible. |

---

## 2) DETALLE POR TRANSACCIÓN/PANTALLA

### A. Efecto/cartera → tesorería individual — versión no deducible
- **Ruta/menú dicho:** no se cita una ruta de menú concreta; se parte de una factura de compras, se contabiliza y se va a **cartera** [04:54]–[05:26].
- **Botón/acción:** en el efecto se usa **“evolución de estados”**; la acción concreta que se menciona es **“PTs”** [06:16]–[07:49]. También se dice que el botón se llama igual que en la remesa: **“evolucionar estado”** [17:33].
- **Campos/estado del efecto:** tipo de efecto **TFE transferencia** [05:51]; estado **pendiente** [05:51]; indicador de **caducidad** importante, con idea de que se caduque cuando se concilia [05:51].
- **Valores de ejemplo:** empresa **TRI/triatlón**, factura de compras con fecha **1 de septiembre**, plazo **30 días**, cuenta financiera asignada aunque no obligatoria [03:24]–[04:54].
- **Regla:** la acción está configurada para **generar tesorería directa** [06:42]; al evolucionar, la cartera pasa a estado **ordenado** (“conocida ordenada” en la sesión, dudoso) y genera **gestión y tesorería** [07:49].
- **Resultado en tesorería:** movimiento de tesorería con **cuenta financiera, importe, operación, flujo y efecto relacionado** [08:14]–[08:39].
- **Configuración asociada:** en la gestión **PTs**, dentro de **“enlace contable de cartera”**, para efectos de clase **pago** y tipo **TF transferencia** se indica que se genere un movimiento de tesorería con una operación; se menciona **PM y CDT** (dudoso) [09:04]–[10:19].

### B. Remesa → tesorería — versión no deducible
- **Ruta de menú dicha:** **módulo de cobros y pagos → remesas → registro de remesas** [11:13].
- **Botones nombrados:** **Nuevo registro** [11:43]; **Selección de efectos** [13:35]; **Agrego efecto** [17:02]; **Evolucionar estado** [17:33]; confirmación y **aceptar** [17:33].
- **Campos de la nueva remesa:** empresa **TRI** [12:43]; fecha de la remesa [12:43]; cuenta financiera/cuenta de bancos [12:43]; fecha valor [12:43]; clase **pago** [12:43]–[13:08]; tipo **transferencia** [13:08]; efectos **transferencias** [13:08]; opción para que **genere tesorería** [13:08]; código ya creado [13:08]; se guarda [13:35].
- **Selección de efectos:** se puede buscar por columnas, por fecha o por rango [14:08]; se comenta un vencimiento en **octubre** y otro el **31** [14:08]–[16:23].
- **Resultado:** al evolucionar y aceptar, la cartera pasa a **ordenado, ordenado** [17:58]; desde cartera hay vínculo a la **tesorería** y a la **remesa** creada; desde la remesa también se puede ir a su tesorería [17:58].
- **Tesorería generada:** movimiento de tesorería con cuenta financiera, importe remesado, operaciones, flujos y efectos relacionados; en el ejemplo, **un efecto** [18:27].
- **Aviso/problema:** durante la práctica la pantalla “se puso lento” y “se quedó pegado” al usar remesas, por lo que se crea otra remesa [12:10]–[15:53].

### C. Extractos bancarios N43 y carga de fichero — versión no deducible
- **Ruta de menú dicha:** **tesorería → extractos bancarios → almacén de ficheros** [21:12]. Para cargar: **tesorería → extractos bancarios → nueva carga** [21:42].
- **Formato/fichero:** se muestra un fichero de ejemplo con muchos números; se dice que sigue la **norma 43 en España** [19:48]–[20:18]. En la carga se menciona **“ADB 43”** (dudoso) [21:42].
- **Campos de carga:** cargar el fichero [21:42]; formato **norma 43** [21:42]; nombre [22:07]; empresa [22:07]; cuenta financiera [22:07].
- **Estructura del fichero:** encabezado con número de cuenta; líneas de movimientos/transacciones con códigos; al final repite cuenta y coloca **saldos finales**; también hay **saldo inicial** y **saldo final** [20:18]–[20:43].
- **Regla/validación:** el sistema lee el fichero y valida **fechas y saldos**; debe haber continuidad: si un extracto termina con saldo **50.000**, el siguiente debe empezar con **50.000** [20:43]–[21:12].
- **Procesamiento:** primero se crea el registro y el fichero queda almacenado en el ERP, pudiéndose volver a descargar [22:33]; después se procesa/carga el extracto bancario, se descomprime y se pide confirmación [22:33].
- **Resultados:** se generan registros en **`textract_file`** y otra tabla de interpretación mencionada como **`textract`** (dudoso), con todos los registros traducidos; en el ejemplo se habla de **227 registros** de casi todo octubre [22:59]–[24:07].
- **Requisito de mapeo:** la cuenta bancaria se mapea con **`cbancpro`** y los conceptos propios con **`tconprop`**; si falta el concepto propio en la tabla, puede dar error al cargar [32:26]–[32:53].

### D. Conceptos propios (`tconprop`) — versión no deducible
- **Ruta de menú dicha:** **Finanzas → Tesorería → Maestros → y conceptos → conceptos propios** [31:07].
- **Valores de ejemplo:** se entra al banco **BBVA**, según la **norma 43** [31:32]; concepto propio **313** de “intereses, comisiones y custodia” [50:41].
- **Campos explicados:** identificar el **banco** al que se ingresa [33:19]; **dominio bancario**, que será **estándar** [33:19]; **concepto propio**, que es el código del concepto [33:19]; **descripción** del concepto [33:19]; **tipo de conciliación**: **individual** o **por día** [33:19].
- **Significado del tipo de conciliación:** **individual** = monto a monto; **por día** = suma todos los conceptos y lo convierte en un solo monto; ejemplo: 5 ingresos o 5 salidas de 100 con el mismo concepto se suman y ponen **500**, generando un solo movimiento de tesorería [33:19]–[33:45].
- **Otros campos:** **familia**, para separar los conceptos [33:45]; **módulo de integración**, para mapear movimientos del extracto que no están en tesorería [34:12].
- **Integración debe/haber:** se puede poner **debe** para ingresos, que activa operaciones financieras de entrada; y **haber** para salidas, por ejemplo **ITF** [34:37]–[35:02]. Se mencionan instrumentos/comisiones/“valores otros” (dudoso) [35:33].
- **Regla/aviso:** cada banco tiene sus conceptos propios y vienen informados en el fichero; hay que meterlos para que al cargar no salga error de que el concepto propio no está en la tabla [31:32]–[32:26]. También se indica que la pantalla tiene **modo lista** y **modo formulario** [40:21].

### E. Conceptos comunes (`tconcomu`) — versión no deducible
- **Ruta de menú dicha:** no se da una ruta explícita para conceptos comunes en la sesión; la ruta citada [31:07] es para **conceptos propios**.
- **Qué se explica:** son **códigos de operaciones financieras**, más orientados al estándar español; se menciona al **“Jextinto Consejo Superior Bancario”** (dudoso) [39:29]–[39:56].
- **Uso:** sirven si no se tiene un concepto propio bien definido; ayudan a identificar movimientos de extracto bancario y asignarles una **entrada** o **salida**, o integrarlos [39:56]–[40:21].
- **Campos/valores de ejemplo:** la sesión no detalla campos ni valores concretos de esta pantalla.

### F. Operaciones a conciliar — versión no deducible
- **Ruta de menú dicha:** no se cita una ruta de menú específica; se habla de **“operaciones a conciliar”** [35:58].
- **Qué permite:** identificar operaciones financieras existentes en `taptcuen` para conciliarlas con el extracto [35:58]–[36:23].
- **Ejemplo/campos:** operación de salida **pago de nómina**; se indica “posición a ver” (dudoso), se pone un **orden**, se escoge la operación financiera **nómina/pagos de nómina** y se **inserta** [36:23]–[36:48].
- **Regla:** si el extracto trae un concepto propio y en `taptcuen` existe el concepto, se concilia; se usa para la **conciliación masiva** [36:48]–[37:13].
- **Parámetros de conciliación:** se abre la operación financiera y se configuran parámetros [37:13]–[37:44]:
  - Se puede hacer que agarre el **primer registro**; si hay dos con el mismo importe, toma el primero [37:44]–[38:09].
  - Se puede configurar para ir por **documento/referencia bancaria** y evitar que un movimiento no le pertenezca a un extracto [38:09].
  - Opción **“no considerar”**: busca por monto y agarra el monto que más se asemeje [38:09]–[38:37].
  - **Fecha FLOAD** (dudoso): permite buscar con diferencia de **1, 2 o 7 días**; ejemplo: operación hoy miércoles y el banco debita al día siguiente, se pone **1 día**; cuenta un día adelante y un día atrás [38:37]–[39:04].

### G. Conciliación individual — versión no deducible
- **Entrada/consulta:** se selecciona un **rango de fechas**, la **empresa** y la **cuenta financiera**, y se ejecuta [25:07].
- **Pantalla:** está partida en dos; izquierda **extracto bancario**, derecha **movimientos de tesorería** [25:32]–[25:59].
- **Operación básica:** se marca un movimiento de extracto contra un movimiento de tesorería y se **concilia** [26:27].
- **Efecto visual:** los movimientos desaparecen del listado y pasan a las pestañas **“extracto bancario conciliado”** y **“tesorería conciliada”** [26:27].
- **Marcas que deja:** en tesorería, campo **conciliado**, asignación de un **correlativo/numerito** y link al extracto bancario [26:58]; en el extracto, marca de **conciliado** y vínculo al movimiento de tesorería [27:24].
- **Botones explicados:**
  - **Cancelar extractos:** para **extornos del banco** con dos operaciones iguales, una positiva y otra negativa, por ejemplo **42.35 positivo y 42.35 negativo**; hacen efecto cero y solo se pasan; se seleccionan ambos y se concilian con **cancelar extractos**; solo se puede hacer desde el extracto [40:50]–[41:45].
  - **Generar:** para el proceso de **integración**; se selecciona un movimiento como una comisión/ITF que no está en `taptcuen`, se elige la **operación financiera** con **flujo de comisión** y crea un movimiento en `taptcuen` con operación, importe y flujo de comisión [41:45]–[42:12].
  - **Conciliar efectos:** cuando no hay movimiento de tesorería previo pero hay una factura/efecto no enviado a tesorería; se usa el **selector de efectos** de la pantalla, se selecciona el efecto de cobro o pago según el extracto y se pulsa **conciliar efectos** [42:12]–[44:03]. Se abre un pop-up para escoger **acción a generar** = **pago**, se menciona **PT** (dudoso), **fecha** y **nota** “Reconocimiento de factura a tesorería”; genera una **gestión con destino en tesorería ya conciliada** y un movimiento de tesorería ya conciliado [44:03]–[44:56].
  - **Conciliar:** es el mapping entre dos importes seleccionados [44:56].

### H. Conciliación automática/masiva (`textract_concaut`) — versión no deducible
- **Nombre en la sesión:** se habla de **conciliación automática** [49:38] y **conciliación masiva** [37:13]; no se cita literalmente `textract_concaut`.
- **Requisito:** para que sea óptima hay que tener bien parametrizados los **conceptos propios**, para que el sistema sepa qué conciliar, con qué, en qué rango de fechas y con qué conceptos [49:38]–[50:03].
- **Ejemplo:** en el extracto aparece **intereses, comisiones y custodia**, concepto propio **313** [50:41]; se busca en conceptos propios [50:41]–[51:19]. Como no está informado en `taptcuen`, se quiere que genere una **operación de salida** identificada como **comisión** [51:19]–[51:44].
- **Pasos/parametrización comentada:** se deja configurado y se **desconcilla** [51:44]–[52:17]; se usa la conciliación masiva para que lo integre [52:17]–[52:48].
- **Campos del proceso:** **rango de fecha**, **cuenta bancaria**, **empresa**, **concepto propio 313**, marca/fecha; se mencionan fechas **2-1-21** y rango **01/2021–07/01/2021** (sesión confusa, dudoso) y se da al **proceso** [52:48]–[53:43].
- **Resultado:** el movimiento del extracto estaba sin conciliar; al actualizar aparece **conciliado**, no editable, se añade **numerador** y se crea el **movimiento en tesorería** identificado con la operación configurada, con **operación, flujo y administración de la cuenta** [54:17]–[54:43].
- **Regla adicional:** para el caso de descripciones repetidas de TPV que no vienen en el código sino en la descripción, se puede usar el **criterio de filtro** en integración y buscar por **primera o segunda referencia** de la operación/documento en la conciliación masiva [45:22]–[48:45].

### I. Desconciliar — versión no deducible
- **Mención:** solo se dice **“vamos a desconciliarlo”** [51:44] y se repite al dejar la configuración del concepto 313 para probar la conciliación masiva [52:17].
- **Datos concretos:** la sesión **no detalla ruta de menú, botón, campos ni confirmación** de desconciliación.

### J. Contabilizar — versión no deducible
- **Factura:** se menciona **descontabilizar** una factura para ver el caso desde el inicio [04:04], y luego **contabilizar** para que se genere la cartera [04:54].
- **Resultado:** al contabilizar se generan **asientos, cartera y registros fiscales** [05:26].
- **Ruta/botones:** no se detalla la pantalla ni botón exacto de contabilización.
- **Relacionado:** en la gestión de cartera se muestra el **“enlace contable de cartera”** para configurar la generación de tesorería [09:29].

---

## 3) PROBLEMAS TÍPICOS O DUDAS QUE SALIERON Y RESPUESTA

- **¿Qué se hace si en el extracto llega un concepto del banco que no está mapeado? ¿Y si hay movimientos en extracto que no existen localmente, como comisiones bancarias o impuestos?**  
  Se responde que se verá en la parte de **conceptos**, que hay dos tipos de conceptos y que se explica en la parte de conceptos [28:19]–[29:10].

- **El concepto propio no está en la tabla y da error al cargar el extracto.**  
  Hay que configurar todos los conceptos propios del banco; al cargar el fichero se mapea la cuenta con **`cbancpro`** y los conceptos propios con **`tconprop`**; si no están, puede fallar la carga [31:32]–[32:53].

- **Comisiones o gastos que no se generan desde el ERP, como ITF, comisiones bancarias, etc.**  
  Se usa el **módulo de integración**: se configura **debe/haber**, se enlaza con operaciones financieras de entrada/salida y se crea un movimiento de tesorería para poder conciliarlo [34:12]–[35:33].

- **Si hay dos movimientos con el mismo importe, ¿cómo evita el sistema coger el equivocado?**  
  Por defecto puede coger el **primer registro** si hay dos con el mismo importe; se puede configurar para ir por **documento/referencia bancaria**, o usar **“no considerar”** para que busque por monto más semejante [37:44]–[38:37].

- **Diferencias de fecha entre operación y banco.**  
  Se puede usar **fecha FLOAD** (dudoso) con **1, 2 o 7 días** de margen; por ejemplo, operación el miércoles y débito del banco al día siguiente: 1 día de diferencia, contando un día adelante y uno atrás [38:37]–[39:04].

- **Extornos del banco con dos operaciones exactamente iguales, una positiva y una negativa.**  
  Se seleccionan ambos movimientos y se usa **cancelar extractos**; solo se puede hacer desde el extracto y no se manda a tesorería porque es efecto cero [40:50]–[41:45].

- **Factura/efecto que no se ha mandado a tesorería pero aparece en el extracto.**  
  Se usa **conciliar efectos**: se selecciona el efecto de cartera y la salida del extracto, se elige la acción a generar (pago), fecha y nota; se genera una gestión con destino en tesorería ya conciliada y un movimiento de tesorería conciliado [42:12]–[44:56].

- **Comisiones de TPV/datáfono que se repiten con un patrón que viene en la descripción, no en el código del concepto.**  
  Se responde que si la descripción está en `taptcuen` se pueden usar la **primera y segunda referencia** de la operación financiera; en integración se puede poner un **criterio de filtro** (ejemplo “comisión*”) para que la conciliación masiva busque por la descripción del extracto, aunque no coincida toda la descripción [45:22]–[48:45].

- **Concepto propio 313 de intereses/comisiones/custodia que no está informado en `taptcuen`.**  
  Se configura una operación de salida como comisión y se usa la conciliación masiva para integrarlo; el proceso concilia, añade numerador y crea el movimiento de tesorería con operación y flujo [50:41]–[54:43].

- **¿En la conciliación bancaria se dan casos donde los importes no coinciden? ¿Qué procede?**  
  Se responde que sí puede darse y depende de la parametrización de tesorería; en **Tesorería → Maestros** se puede dar un **margen de tolerancia** para conciliar [55:13]–[56:10].

- **Comentario/duda sobre terminología: se usa “debe/haber” pero en tesorería sería más claro “cobro/pago”; además en Teoperfin hay un campo de posición entrada/salida y otro de cobro/pago que resultaría redundante.**  
  Se responde que están alineados y **unificando términos** [56:10]–[57:38].

- **Incidencia práctica:** la pantalla se puso lenta y “se quedó pegado” al trabajar con remesas; se optó por crear otra remesa y continuar [12:10]–[15:53].