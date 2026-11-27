# Resumen de referencia — Contabilidad general (Axional Next, módulo Finanzas, `wic_icon`)

## 1) Conceptos clave

- **Asiento**: unidad de información del diario; varios apuntes lo componen y cada asiento expresa un hecho contable. PAGE 857
- **Apunte**: línea del asiento; el cuadre contable del asiento se garantiza mediante parámetros del mantenimiento de configuración de usuarios. PAGE 857
- **proyecto / sección**: identificadores alfanuméricos por apunte para contabilidad por proyectos/operaciones. PAGE 858
- **Saldo**: diferencia entre debe y haber; puede ser deudor, acreedor o cero. **Estado del ejercicio**: abierto, regularizado o cerrado. PAGE 860
- **Estados de asiento**: `P` Provisional (no afecta a `csaldos` ni a `ccossalc`, editable), `X` Intermedio (acumula saldos contables, no costes), `C` Contabilizado (acumula saldos y costes, exige `imp_cuadre = 0`). PAGE 1004
- **punteo**: `N` Pendiente (ámbar), `S` Auditado (lima), `P` Propuesta provisional de la IA (azul); en pantalla como `No`, `Sí`, `Propuesta IA`. PAGE 1013
- **`caudctas_prop.estado`**: `P` pendiente, `A` aceptada, `R` rechazada; **`criterio`**: `1` mismo `docser`, `2` `docser` equivalente, `3` `docser` neutralizado por apuntes posteriores. PAGE 1110
- **Distribución variable**: curva `cdistrih`/`cdistril` con porcentaje por período; un período con porcentaje cero no genera asiento y adelanta un mes la fecha del siguiente. PAGE 1006
- **Distribución fija**: por número de períodos y cadencia en meses; importe = original ÷ número de períodos. PAGE 1006
- **Costes**: reparto del importe de un gasto/ingreso entre centros de coste para contabilidad analítica. PAGE 1118
- **Periodificación**: reparto de un apunte en varios períodos mediante asientos con `origen='capuntes'`. PAGE 1006
- **`cempresa.descon`**: `0` cambia signo, `1` intercambia debe/haber. **Invertir asiento**: `0` no invertir, `1` invertir. PAGE 1014
- **`Cadencia` (copia masiva)**: `0` misma fecha, `1` mes, `3` trimestral, `6` semestral, `12` anual. PAGE 1014
- **`Copiar todo`**: `0` limitada (costes se copian; impuestos no; cartera no; concepto contable se omite) / `1` completa (impuestos sin indicador de envío al SII y ejercicio/período fiscal por recalcular; cartera con estado y caducidad según tipo de efecto; concepto se conserva). PAGE 1116
- **`csistema.dessis`**: `0` en sistemas de origen y `1` en el sistema real. PAGE 1007
- **`ccuentas.tipcta`**: `N` Normal, `T` Terceros, `C` Costes, `A` Analítica; **`ctaper`**: `0` No periodificable, `1` Periodificable, `2` Distribuible; **`poscta`**: `D` Deudora, `C` Acreedora; **`estado`**: `A` Abierta, `B` Bloqueada a entrada manual, `C` Cerrada. PAGE 1004

## 2) Rutas de menú exactas

- `Finanzas/Finanzas/Contabilidad general` — Visión general. PAGE 857
- `Finanzas/Finanzas/Contabilidad general/Diario contable` — Diario, Extractos, Saldos, Plantillas de contabilización, Asientos y apartados 2 a 9 (Cabecera y apuntes, Impuestos y cartera, Costes, Costes desde apuntes, Costes desde asientos, Periodificación y distribución, Carga rápida, Revisión de datos). PAGE 858, 859, 860, 862, 931, 1116-1123
- `Finanzas/Finanzas/Contabilidad general/Balances` — Balances, Cuentas anuales XLS, Por agrupación. PAGE 861, 869, 993
- `Finanzas/Finanzas/Contabilidad general/Procesos períodicos` — Procesos periódicos, Otros procesos, Cierre temporal de ejercicio. PAGE 865, 866, 994
- `Finanzas/Finanzas/Contabilidad general/Configuración` — Configuración del ejercicio y de los períodos contables. PAGE 868
- `Finanzas/Finanzas/Contabilidad general` — Motor de consultas excel. PAGE 973
- `Finanzas/Finanzas/Contabilidad general/Diario contable/Procesos sobre asientos` — Contabilización, Descontabilización, Generación de periodificaciones, Cambio de sistema, Auditoría, Copia masiva, Carga de asientos por plantilla, Auditoría automática. PAGE 1004-1014, 1105, 1110
- `Finanzas/Contabilidad General/Diario Contable/Asientos/Procesos/Carga de Asientos por plantilla` — Carga rápida de asientos. PAGE 1122

## 3) Tablas y campos

- `csaldos`: saldos acumulados; su tabla de saldos agrupados es `cctasal_agrs`, calculada por `cctasal_agrs_genera`. PAGE 993
- `ccuentas`: maestra de cuentas; campos `nombre`, `tipcta`, `poscta`, `estado`, `activa`/`tipact` (`I` Impuestos, `C` Costes, `E` Efectos), `ctaper`, `ctagrp` (`0` Normal, `1` Parte vinculada, `2` Parte relacionada). PAGE 1004, 1007, 1013
- `ccuentas_agruph`: `codgrp`, `nomgrp`, `clasif`, `nivlon`, `orden`, `debhab` (`1` o `-1`), `nivaut`. PAGE 993
- `ccuentas_agrupl`: `cuenta`, `signo` (`P`, `N`, `D`, `H`), `porcen`, `proygrp`, `seccgrp`, `prodes`, `secdes`. PAGE 993
- `ccuentas_agrupt`: relaciones de suma entre códigos de agrupación. PAGE 993
- `cctasal_agrs`: fuente única de Estado de Situación Financiera (`BALANCE08`) y Estado de Resultados (`CTEPIG08`); parámetros `pStrEmpcode`, `pIntEjerci`, `pIntPeriodIni`, `pIntPeriodFin`, `pStrCondSql`. PAGE 993
- `casientos`: `id_asiento`, `empcode`, `fecha`, `fecha_aux`, `ejercicio`, `periodo`, `diario`, `asient`, `jusser`, `docser`, `refext_serie`, `refext_numero`, `moneda`, `cambio`, `camope`, `sistem`, `estado`, `notas`, `origen`, `id_origen`, `clasif`, `imp_cuadre`, `max_orden`. PAGE 1004
- `capuntes`: `id_apunte`, `id_asiento`, `orden`, `empcode`, `proyec`/`seccio`, `placon`/`cuenta`, `dimcode1`/`dimcode2`, `debe`/`haber`, `divdeb`/`divhab`, `cantid1`/`cantid2`, `codaux`/`ctaaux`, `contra_cuenta`, `tercer`, `punteo`, `fecha_val`, `moneda`/`cambio`/`camope`. PAGE 1006
- `ctertipo` y `ccuentas` (columna `Activa` con `EV`): requisitos para generar cartera desde el apunte. PAGE 1117
- `caudctas_prop`: `estado`, `criterio`; no guarda el sistema contable (se obtiene vía apunte/asiento). PAGE 1110
- `cdistrih` / `cdistril`: curva de distribución variable (porcentaje por período). PAGE 1006
- `csistema`: `codigo`, `dessis`. PAGE 1007
- `ccoscont`: registros de costes; junto con `ccosdesc`, `cproyect`, `cseccion`, `cctaauxl`, `ctax_move_head`, `cefectos` se verifican en el cambio de sistema. PAGE 1007, 1119
- `cxlstemplate`: alta de Documentos XLS para Cuentas anuales e Informes. PAGE 869
- `ccomfach`, `ccomefec`, `ccomfacl`, `capuntes`, `cimpcont`, `cefectos`: destino de hojas de Plantillas de contabilización. PAGE 862
- `cempresa`, `cperiodo`, `csaldos`, `cniveles`: tablas auxiliares en ejemplos SQL de cuentas anuales XLS. PAGE 869

## 4) Circuitos y orden de carga/secuencia

- **Carga rápida de asientos**: crear plantilla base → descargar modelo → rellenar → revisar → subir XLS → procesar XLS → `Asientos contables` → contabilizar → (si procede) `Retroceder`. PAGE 1122
- **Ciclo del asiento**: cabecera → líneas de apuntes → reordenar/copiar → impuestos/cartera → costes → periodificar/distribuir → revisar → contabilizar. PAGE 1116-1121, 1123
- **Cierre temporal de ejercicio**: proceso `capuntes_ejtmpcie`, validación del ejercicio siguiente y traslado de saldos a `csaldos`. PAGE 994
- **Contabilización masiva**: filtrar empresa, diario y estado `Provisional` → revisar `imp_cuadre` → corregir hasta cuadre cero → lanzar (FECINI, FECFIN, EMPCODE, COND) → revisar informe → corregir y repetir. PAGE 1004
- **Descontabilización masiva**: filtrar `Contabilizado` → confirmar período no cerrado a libros oficiales → lanzar (FECINI, FECFIN, EMPCODE, COND) → revisar informe → corregir → volver a contabilizar. PAGE 1005
- **Generación de periodificaciones**: confirmar `ctaper = 1` → acción → cuenta destino → modalidad → fecha primer período → ejecutar → revisar informe → verificar asientos `Contabilizado`. PAGE 1006
- **Costes desde apunte**: seleccionar apunte → `Nuevo` (100 %, importe completo, cuenta del apunte) → modificar %/importe → segundo registro con el pendiente → comprobar 100 %. PAGE 1119
- **Costes desde asiento**: seleccionar asiento → `NUEVO Costes` (0 %, Debe 0, Haber 0, cuenta nula) → primer registro fija base del 100 % → proponer pendientes → comprobar 100 %. PAGE 1120
- **Cambio de sistema**: filtrar asientos → lanzar → sistema destino → ejecutar → corregir → repetir. PAGE 1007
- **Copia masiva**: empresa origen + condición → empresa destino → fecha → número de asientos → cadencia → invertir → copiar todo → concepto/documento → `Ejecutar copia masiva` → revisar cuadrícula. PAGE 1014
- **Generar impuestos + cartera**: `Generar impuestos` → formulario → aceptar → líneas de impuestos → `Generar cartera` → importe/moneda/tipo de efecto → confirmar. PAGE 1117
- **Cuentas anuales XLS**: definir plantilla → alta en `Cuentas Anuales e Informes` → SQL de agrupación y datos → parámetros → `Ejecutar` → atender variables → descargar del histórico → `Eliminar histórico` con confirmación. PAGE 869
- **Balance por agrupación**: ejecutar `cctasal_agrs_genera` antes de abrir el reporte. PAGE 993

## 5) Procesos, botones y acciones con efecto

- `Generar impuestos`: exige cuenta con indicador `(I)` en columna `Activa` de `ccuentas`, posición contable admitida y apunte sin documento fiscal; solo un impuesto y una cabecera por apunte. PAGE 931, 1117
- `Generar efectos`: exige cuenta admitiendo efectos y apunte sin efectos; si el apunte requiere impuestos y cartera, generar primero los impuestos. PAGE 931, 1117
- `Periodificar` / `Distribuir`: cuenta periodificable o distribuible y apunte no marcado como periodificado. PAGE 931
- `Generar costes`: cuenta o concepto admiten costes y asiento no contabilizado o costes abiertos. PAGE 931
- `Abrir costes`: cambia un asiento contabilizado a `costes abiertos`; mientras tanto no figura como contabilizado. `Cerrar costes`: lo devuelve a `contabilizado`. PAGE 1118
- `Redistribuir costes`: regenera líneas desde programa de imputación. `Ajuste de redondeo`: recalcula importes. PAGE 1118
- `Copiar asiento`: nuevo asiento con el mismo estado que el original; documentos fiscales copiados marcados como `anuladores`; fechas documento/operación/valor/vencimiento desplazadas igual que la fecha del asiento. PAGE 1116
- `Contabilizar`: estado `C`, exige `imp_cuadre = 0`, incorpora a saldos acumulados y hace apto para libros oficiales. PAGE 1004
- `Descontabilizar`: `C` → `P`; solo cambian `estado`, `user_updated` y `date_updated`; `jusser` no se altera; `imp_cuadre` no se recalcula. PAGE 1005
- `Auditar seleccionados` (`MODAUD`): única empresa, sistema, plan y cuenta; debe = haber al céntimo o no se marca ninguno. PAGE 1013
- `Auditado (por documento)` / `Auditado (por saldo)` / `Auditoría IA` (`MODAUD`): marcan propuestas automáticas. `Aceptar auditados` (`AUDACEPTAR`) / `Rechazar auditados` (sin permiso especial). PAGE 1110
- `Retroceder` (Carga rápida): solo con registro contabilizado; lo devuelve a `No contabilizado` y elimina registros contables y costes creados. PAGE 1122
- `Ejecutar copia masiva`: nuevo asiento con estado del origen; `punteo` a `N`; `clasif` fija `Manual`; `jusser` regenerado; `origen`/`id_origen` solo se copian si `Copiar orígenes = 1`. PAGE 1014
- `Cambio de sistema`: si falla un asiento del filtro, se detiene todo y no traspasa ningún registro; destino por defecto `dessis = 1` o código más alto si hay varios. PAGE 1007
- `Agrupación de apuntes`: el asiento generado toma como fecha de contabilización la de finalización del proceso y como concepto por defecto `"AGRUPACIÓN"`. PAGE 1123
- **Contabilización tiempo real / diferida / apuntes externos**: traspaso del área diferida al área real con verificaciones de integridad. PAGE 1123
- **Generación de periodificaciones**: asientos generados en `estado = 'C'`; apunte origen marcado `punteo = 'S'`; `clasif` = `Periodificación` o `Distribución variable`; redondeo `HALF_UP`. PAGE 1006
- **Anulación de periodificación**: elimina asientos, desmarca `Auditado = No`, recalcula importes acumulados y tablas vinculadas. PAGE 1121
- **Balance por agrupación (`cctasal_agrs_genera`)**: borra y reinserta los registros del período procesado. PAGE 993

## 6) Advertencias y errores típicos

- Borrado de asiento bloqueado si: `Período contable cerrado`, `Fecha marcada como inmutable`, `Asiento de procesos de sistema` sin privilegios, `Asiento creado por otro usuario` sin privilegios, `Período de costes cerrado` (si afecta a costes) o `Período de impuestos cerrado` (si afecta a impuestos). PAGE 1116
- Si el apunte requiere impuestos y cartera, generar primero los impuestos y después los efectos. PAGE 931
- Solo un impuesto y una cabecera por apunte; si se cambia la cuenta vinculada a un único tercero activo se actualizan datos; con más de un tercero el proceso se detiene con error; todos los registros fiscales del mismo apunte deben tener la misma fecha. PAGE 1117
- Al borrar el apunte se eliminan impuestos y apuntes de cuota generados; en costes, también sus costes. PAGE 1117, 1118
- Si el asiento está contabilizado no se pueden añadir ni modificar costes sin abrirlos; solo se permite generar costes desde asiento si no existen apuntes contables. PAGE 1118
- Plantillas de contabilización: errores literales `JavaNull`, `#¡REF!`, `#¿NOMBRE?`, `=Gestion!#¡REF!`. PAGE 862
- Carga de asientos por plantilla: mensajes literales `La columna "Tercero" del fichero no cumple con las condiciones.`, `La columna "Analítico" del fichero no cumple con las condiciones.`, `La columna "Juss" del fichero no cumple con las condiciones.`, `El fichero no contiene datos.`, `Total debe [100.00] distinto al total haber [1.00]`. PAGE 1105
- En la carga, las líneas sin fecha se omiten sin mensaje; si formaban parte del asiento puede quedar incompleto o descuadrado; la cuenta debe informarse como texto (ej. `62500.00000`); si hay varios asientos debe informarse `Asiento`. PAGE 1105
- `c_casientos3` exige que `estado = 'C'` implique `imp_cuadre = 0`; los estados `P` y `X` pueden tener cuadre distinto de cero. PAGE 1004
- Descontabilización: el motivo no se registra de forma estructurada; `X` queda fuera del proceso masivo; no exige condición sobre `imp_cuadre`. PAGE 1005
- Balance por agrupación: una cuenta no configurada en `ccuentas_agrupl` no aparece aunque tenga saldo. PAGE 993
- Auditoría por saldo: máximo 20.000 apuntes pendientes, 3.000 semillas y 90 segundos; auditoría IA máximo 5.000 apuntes por tupla y ejecución, confianza mínima 70; `DOC000` y documentos genéricos no se concilian. PAGE 1110
- Avisos literales `LBL_AUD_WARN_S` (auditados no cuadran), `LBL_AUD_WARN_P` (propuestos IA no cuadran), `LBL_AUD_PSS_PARCIAL` (proceso incompleto); la IA solo propone, no audita; una propuesta no se acepta si el grupo no cuadra al céntimo o falta `AUDACEPTAR`. PAGE 1110
- Auditoría de apuntes: el detalle muestra inicialmente solo `punteo = 'N'`; el filtro SQL de la barra permite ver `S`, `P` o `Todos`; los avisos de cuadre de cabecera son informativos y no bloquean. PAGE 1013
- Cambio de sistema: si falla cualquier asiento del filtro se detiene todo el proceso y no traspasa ningún registro; el informe puede aparecer vacío aunque el traspaso se haya ejecutado correctamente (verificar `sistem`). PAGE 1007
- Periodificación: si la cuenta está marcada como Distribución y la distribución no existe puede no generarse; la anulación está sujeta a las mismas restricciones que `Borrar asiento`. PAGE 1121
- Carga rápida de asientos: puede presentar incidencias si los datos son incongruentes; contabilización/descontabilización depende de período abierto y permisos; la descontabilización elimina los registros contables y costes creados. PAGE 1122
- Copia masiva: no distingue el estado del asiento origen; un asiento provisional y uno contabilizado pueden copiarse. PAGE 1014