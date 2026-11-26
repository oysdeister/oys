# Bloques de Cartera (carteras.json) paso a paso

Fuente: `app/src/content/carteras.json` y `auditoria/redaccion_cartera.md`. `{INI}` = iniciales del alumno. Las rutas empiezan por «Finanzas ›». Los datos de los bloques `icon-cartera-*` y `carteras-7` salen de capturas de otra base de Deister (códigos que no son del alumno).

## Índice
1. carteras-1 Plazos de pago y tipos de efecto
2. carteras-3 Bancos propios y cajas
3. icon-cartera-v-1 Efectos de una factura
4. icon-cartera-1 Estados y tipos de efecto
5. carteras-5 Cobro suelto y en remesa
6. icon-cartera-v-2 Pago en efectivo
7. icon-cartera-v-3 Pago con gestión
8. icon-cartera-2 Cierre de gestión
9. icon-cartera-v-4 Tipos de remesa de una cuenta
10. icon-cartera-v-5 Remesa de pago
11. icon-cartera-v-7 Efecto que no se remesa
12. icon-cartera-v-6 Evolucionar remesa
13. carteras-7 Paso a tesorería
14. icon-cartera-3 Procesos avanzados
15. cartera-cobro-parcial
16. cartera-mandato-sepa
17. cartera-impagado-devolucion
18. cartera-descuento

## 1. carteras-1 · Definir plazos de pago y tipos de efecto
Cuatro partes de ~5 min. Importes: factura de compra de 121,00 (100,00 + 21,00) en tres efectos 48,40 + 24,20 + 48,40.
1. **Plazo V{INI}** (Maestros › Terceros › Condiciones administrativas › Plazos de pago): tipo cálculo «Variable», unidad «Días», plazos 40/80/120 con 40/20/40 %, cuarto plazo a 0. «Añadir plazo» no responde desde la ficha: vuelve a la lista.
2. **Tipo de efecto E{INI}** (Cobros y Pagos › Maestros › Efectos › Tipos): clase «Pagar», estado inicial PE, domiciliación «No requiere», clasificación «Transferencia» en los tres desplegables. Código de 3 caracteres: TR{INI} da «Demasiado largo 4 / 3».
3. **Tercero CAR{INI}** (Maestros › Terceros › Registro terceros): categoría 002, relaciones Cliente/CLI/PGE 2008/43000.00000 y Proveedor/PRO/PGE 2008/40000.00000, dirección 0 (08001), condición de pago E{INI}+V{INI}, condición de cobro RC, PE, 30D; «Validar».
4. **Factura de compra FC** (Facturación › Compras › Fact. de compra): empresa 0, proveedor CAR{INI}, factura proveedor CAR-{INI}-001, importe 121; línea con artículo S, precio 100, **centro de coste 0 y cuenta de explotación 0 (obligatorios con cuenta de gasto)**; Validar, pestaña «Vencimientos» (3), Acciones › Contabilizar, desplegable ⌄ › «Cartera de efectos» y «Asientos contables».
Trampas: «Hay errores en los datos del formulario» (falta analítica); precio 1,000000 (texto seleccionado a medias: Cmd/Ctrl+A y reescribir); lista vacía al pulsar la flecha (escribe un carácter).

## 2. carteras-3 · Bancos propios y cajas
- Tercero entidad B{INI} «BBVA Carteras {INI}», categoría 008, dirección 0 (08001); Validar.
- Banco propio BBVA_{INI} (Cobros y Pagos › Maestros › Auxiliares › Bancos propios): empresa/proyecto/sección 0, entidad B{INI}, tipo de dirección 0, cuenta 57200.00000, agrupación AG{INI} (la de Contabilidad básica, no crear otra). **Banco y número de cuenta/IBAN: los dos o ninguno** («Entidad y cuenta bancaria, ambos nulos o no nulos»); en este bloque se dejan vacíos.
- Caja CAJA_{INI}: tipo de cuenta «Caja de efectivo», cuenta 57000.00000. Código máximo 10 caracteres (BBVA_CAJA_{INI} da «Demasiado largo 12 / 10»).

## 3. icon-cartera-v-1 · Ver los efectos de una factura
Factura contabilizada → efecto con el tipo de efecto, estado inicial y plazos del tercero. Ejemplo del vídeo: TF/PE, 118,50 USD = 440,70 en moneda local, vence 31-07-2023 (no mezclar con las cifras del caso). En la demo actual la pestaña «Cartera de efectos» no sale: usa ⌄ junto al número › «Cartera». Descontabilizar la factura borra sus efectos; para trabajar la cartera hay que volver a contabilizar. Pestañas del efecto: «Asiento origen», «Histórico». Subpestaña «Vencimientos» de la factura: un efecto por vencimiento; la forma de pago viene del tercero.

## 4. icon-cartera-1 · Estados y tipos de efecto
- Estados: PE Pendiente, PR Propuesto, OC Ordenado, PA Pagado, CO Cobrado, DV Devuelto (cuenta como impagado), BQ Bloqueado, DC Doc. descontado. El estado decide si el efecto se puede modificar.
- Tipos: TF transferencia, RC recibo, CH cheque, EF al contado; deciden el estado inicial y si exigen IBAN.
- Acciones (Maestros › Acciones › Relación de acciones): PEFE «Pago directo en efectivo» (PE→PA, enlace contable PAGD «Pago Directo Efecto», **no genera tesorería**); en las rejillas «Tesorería» y «Acciones» del enlace se ve qué tesorería crea. **Fórmula 0 en el asiento programable = movimiento de tesorería sin apunte contable.** Para ver intereses de impagados: tipo de efecto (Interés, Comisión impag.) o la acción.

## 5. carteras-5 · Cobrar efectos sueltos y en remesa (el bloque más largo)
Practica con CAR{INI} para no gastar los efectos de C{INI}. Cifras: 200,00 + 42,00 = 242,00.
1. Revisa estados y la acción COBD «Cobro directo».
2. Artículo **ASE{INI}** (Facturación › Maestros › Artículos): tipo fiscal Servicio, clave SOG, precio 200, mnemotécnicos 62300 y 70500.
3. Factura de venta FV a CAR{INI} (empresa 0, proyecto 0, sección 0): línea ASE{INI}, cuenta 70500.00000, centro de coste 0, cuenta de explotación 0; Validar y Contabilizar; «Vencimientos»: un efecto RC en PE de 242,00 (FVN026-000001). Elige al cliente con la fila y Tab, no con Intro.
4. Cobro suelto: Cobros y Pagos › Gestiones › Gestiones sobre efectos › «Nuevo»: empresa 0, clase Cobrar, acción COBD, cuenta BBVA_{INI}, perceptor CAR{INI}; en «Selección de efectos» marca el efecto y «Agregar efectos»; «Cerrar». Asiento: 57200.00000 debe, 43000.00000 haber.
5. Banco: en BBVA_{INI}, pestaña «Líneas financieras», línea LRC{INI} con tipo de línea REM{INI}; pestaña «Remesas por cuenta»: CSCTS, CSDDS, PSCTT.
6. Remesa: segunda factura FV a CAR{INI} con plazo **T2D** (dos efectos de 121,00); Registro de remesas › Nuevo: empresa 0, BBVA_{INI}, clase Cobrar, tipo CSCTS; «Selección de efectos» (sin filtro no trae nada) › «Agregar efectos»; «Evolucionar estado» dos veces («Remesa cobro transferencias, ordenar (s/Tes)» y «Remesa, confirmar pago por bancos (s/Tes)» con fecha de contabilización); pestaña «Apuntes».
Trampas: «Evolucionar estado» desde la ficha del efecto falla (`emi_repres_nif`); CSDDS sin IBAN da «Requiere la domiciliación bancaria del tercero!» (en este bloque desagrega y usa CSCTS); «No se permite cambiar el tipo de la remesa».

## 6. icon-cartera-v-2 · Pagar un efecto en efectivo
Botón «Pago directo en efectivo» en un efecto TF+PE (acción PEFE; se ve por los estados de origen). La ventana «Evolución de estados» pasa el efecto de TF/PE/No a **EF/PA/Sí** (al contado, pagado, caducidad Sí = cerrado). Quedan solo «Retroceder» y «Pago, devolución». La pestaña «Histórico» guarda tres líneas: inicial, pago, retroceso. El vídeo está en USD: aparece diferencia de cambio (118,50 × 3,719 = 440,70; × 3,683 = 436,44; 4,26 de ganancia); con euros no habría. Si el efecto está BQ no se ofrece PEFE. En la ventana se puede editar la cuenta financiera: es una configuración incorrecta de la demo, solo observar.

## 7. icon-cartera-v-3 · Pagar efectos con una gestión
Gestión nueva («Nuevo»): empresa, fecha de proceso, clase Pago, acción PEFE, moneda del efecto (USD en el vídeo; la del efecto en tu caso). «Selección de efectos»: filtra clase Pago, marca, «Agregar efectos» (pasa a «Efectos relacionados»), «Cerrar». El efecto queda EF/PA/Sí; **un pago hecho con gestión se deshace abriendo la gestión («Abrir»), no con «Retroceder» del efecto.** Crea siempre una gestión nueva; reutilizar una arrastra selecciones previas.

## 8. icon-cartera-2 · Cierre de una gestión
Cabecera (datos comunes) + detalle (efectos). «Cerrar» valida, cambia estado/tipo/caducidad/cuenta de los efectos, genera asiento solo si la acción tiene código de asiento (origen del asiento = la propia gestión), escribe el histórico (permite reabrir) y crea tesorería si el estado final lo exige. Errores literales `cefecges_estado_ava_NN`: 02 la acción exige cuenta financiera; 05 tesorería sin flujos; 06 diferencias de cambio sin asiento; 08 hay gastos y no banco; 11 tesorería contabilizada, conciliada o auditada (desconciliar antes de retroceder). En remesas: «Evolucionar estado» = lo mismo para todos sus efectos; «Retroceder» anula asientos con periodo abierto y los compensa con periodo cerrado. Caso: 151,25 de T{INI} de PE a PA y tesorería de -151,25.

## 9. icon-cartera-v-4 · Tipos de remesa de una cuenta
BBVA_{INI} (Bancos propios, abre la ficha, no solo la lista) › «Remesas por cuenta»: para el caso necesita **PSCTT** (pago por transferencia con tesorería) y **CSDDS** (cobro de recibos domiciliados SEPA, con LRC{INI}), en estado Abierto. Si está vacía, el tipo de la remesa no ofrece valores. El vídeo muestra PRVCC0 (empresa 0) con CCHET, CSCTT y PSCTT.

## 10. icon-cartera-v-5 · Crear una remesa de pago (operación 7 del caso)
Antes: PSCTT en el banco; efecto TF; proveedor con IBAN (T{INI} lo tiene de Compras). Registro de remesas › Nuevo: empresa 0, BBVA_{INI}, fechas, clase **Pagar**, tipo **PSCTT** («Pago transferencias (con Tesorería)»); la acción **RPSCTP** se rellena sola. «Selección de efectos» filtrando tercero T{INI}: carga el efecto de 151,25 de PROV-{INI}-001; «Agregar efectos»: pasa a «Relación de efectos remesados», total 151,25, efecto PE→PR. Fecha del caso 06-11-2026. La comisión de 3,50 la cobra el banco aparte (Tesorería). Si no aparece el efecto: factura sin contabilizar, importe 0 o tipo de efecto que no encaja con el de la remesa.

## 11. icon-cartera-v-7 · Efecto que no se remesa
Dos causas. (1) Domiciliación: «DOMICILIACIÓN BANCARIA NO INFORMADA» si el tipo de efecto la exige y el tercero no tiene IBAN; se informa en la ficha del tercero (Maestros › Terceros › Registro terceros), no en la remesa (en el vídeo se evitó con forma de pago cheque). (2) El tipo de efecto no encaja con el de la remesa (un cheque no entra en una remesa de transferencias). Caso: efecto TF de T{INI} sí entra en PSCTT; el efecto 2 de C{INI} es R{INI} y pide el IBAN del cliente hasta que se lo das en el bloque del mandato.

## 12. icon-cartera-v-6 · Evolucionar una remesa
«Evolucionar estado» en la remesa con efectos: estado CONTABILIZADO, efecto PR→OP con la acción RPSCTO «Remesa pago transferencias, ordenar (c/Tes)». Genera asiento + movimiento de tesorería + cambio de estado. Asiento (desplegable ⌄ › «Asientos contables»): **40000.T{INI} 151,25 al debe; cuenta puente al haber** (en el vídeo 10000.00087 con 1.815,00; en el PGC real, 401). El movimiento de tesorería (Tesorería › Ops. corto plazo): BBVA_{INI}, operación **PMICDT**, Salida, **-151,25**, 06-11-2026. Retroceder deshace la evolución; sin efectos no pasa nada.

## 13. carteras-7 · Cómo pasan los efectos a tesorería
Dos vías: evolucionar el efecto con la acción **PTES «Pago a tesorería»** (cuenta financiera, fechas; en el enlace contable, fila «Transferencia») o ordenar una remesa «con tesorería» (c/Tes) (pestaña «Tesorería» de la remesa › movimiento › pestaña «Flujos»). Resultado: efecto Ordenado + gestión + movimiento (cuenta financiera, importe del efecto, operación de la acción). Las s/Tes no crean movimiento. Ejemplo del vídeo: remesa de 8.080,15 al proveedor 00003 (debe 40100.00003). La remesa solo acepta deudas con IBAN. Error `taptcuen.fecval` nulo: revisar fechas.

## 14. icon-cartera-3 · Procesos avanzados (opcional, solo lectura)
Anticipos (Procesos › Especiales › Anticipos, tabla `cefectos_anticipo_gen`: «Generar efectos» crea dos efectos especulares +/−, p. ej. +500 cobrado hoy y −500 pendiente; «Eliminar efectos» mientras ninguno haya evolucionado; el −500 no tiene extracto); Reclasificaciones (orígenes y destinos suman cero; invertir exige periodo abierto); Cambios de titularidad (el importe de la línea no puede superar el efecto; si es menor se parte en dos); Alinear vencimientos; Recobros (solo edita la gestión quien la creó, el mismo día); cuadre a fecha pasada: Detalle a fecha histórica › «Generar situación de cartera» y «Situación de cartera» (se reconstruye con el histórico del efecto).

## 15. cartera-cobro-parcial
Gestión COBD con perceptor CAR{INI} y BBVA_{INI}; en «Selección de efectos» doble clic en «Importe divisa», escribe 100 y **Intro**; «Agregar efectos»; «Cerrar». Un efecto de 242,00 se parte: el primero cobrado por 100,00 y un segundo con el resto 142,00 en PE y número de orden 101. Asiento solo por el importe cobrado (57200 debe / 43000 haber). El caso cobra 121,00 enteros: es práctica aparte con un efecto que no sea de tu caso.

## 16. cartera-mandato-sepa (operación 10 del caso)
1. IBAN de C{INI}: ficha › «Datos bancarios» › «Añadir banco»: domiciliación 0, IBAN de prueba, banco (ES21 → CAIXABANK); Validar.
2. Mandato: pestaña «Mandato» › Nuevo: empresa 0, estado Activo, tipo de operación «Pago recurrente», referencia MAN{INI}001, titular C{INI}, domiciliación 0. Rellena primero la empresa (cambiarla borra el titular). **En la demo no guarda (ID 15486).** Campos del mandato: tipo de orden Core (normal) o B2B (entre empresas), fecha de firma anterior al primer cobro.
3. Domiciliar el efecto 2 (14-12-2026) en la cartera de efectos; si no deja, cóbralo sin remesa.
4. Remesa: Registro de remesas › Nuevo: empresa 0, Cobrar, BBVA_{INI}, tipo **CSDDS**, línea LRC{INI}, 01-12-2026; agrega el efecto de 121,00 de C{INI}; «Evolucionar estado» dos veces («Remesa cobro débito directo, ordenar (s/Tes)» y «Remesa, confirmar pago por bancos (s/Tes)»); pestaña «Apuntes»: 57200.00000 121,00 al debe (la contrapartida real es 430/431; la demo pone la 23000).
5. Fichero SEPA (Soportes electrónicos › Cobros › Emisión de adeudos directos SEPA Core y B2B): solo mirar, no se genera.

## 17. cartera-impagado-devolucion
Gestión clase Cobrar, acción **CDEV** (Cobro, devolución), perceptor CAR{INI}, efecto CO; «Agregar efectos», «Cerrar». El efecto pasa CO→DV, cuenta 43150.00000. Asiento correcto: 43150 al debe y 57200 al haber (242,00); con gastos de 3,00: 626 al debe y 245,00 al haber de 57200. Otras acciones: CPED (devuelto a pendiente), CDUD (dudoso), CCIN (incobrable), no probadas. Es un extra: el recibo de C{INI} del caso se cobra bien.

## 18. cartera-descuento (solo maestros, no se ejecutó en la demo)
Remesa de tipo Descuento: LCDTO, LCDTS, LCDTT (LCDTO y LCDTS comparten descripción: distingue por código). Acción LCDCAP propone las letras; RCDLCA «Remesa cobro descuento letras, ordenar» las deja en OC; estado **DC «Doc. descontado»**; CDEB «Cancelación descuento bancario» cierra al vencimiento. Faltan letras aceptadas para practicar.
