---
name: erp-nuevo-icon-documentacion
description: "Referencia para documentar, enseñar, crear ejercicios o preguntas y explicar parametrización y orden de carga de Finanzas en Axional Next (ICON). Cubre escenario solo Finanzas o integrado con documentos de gestión IGES, contabilidad general, cobros y pagos/cartera (estados, gestiones, generación de asiento y cuadre a fecha pasada, no documentado), tesorería y caja, impuestos/IVA y activos fijos. Cita `capuntes`, `casientos`, `cefectos`, `cefecges_pcs`, `cremesas`, `taptcuen`, `taptfluj`, `ccajamov`, `ctax_rule`, `ctax_move_head`, `cinmhead`, `cinmelem`, `csaldos`, `cctasal_agrs`. Útil para responder qué tablas intervienen o en qué orden se cargan."
---

# Finanzas en el ERP nuevo (Axional Next): lo que dice la documentación oficial

## Fuente
Visor next.mydeister.com/docs/view/wic_icon/menu/224/folder/148 (Finanzas, 219 páginas; requiere sesión). Cómo se descargó: la API del visor `/docs/view/wic_icon/menu/224/tree` (árbol) y `/docs/view/wic_icon/page/<id>/data` (XML en page_content); capturas en `/docs/view/wic_icon/page/<id>/media/file/<src>`. El MCP Airtool docs_* de Elysius no ve wic_icon. Copia local en el repo practica-axional-oys: `_fuente/icon/docs/*.md` (texto por sección) y `_fuente/icon/img_index.json`.

## Mapa del módulo (submódulos y rutas de menú)
- `Finanzas/Finanzas`: visión general del núcleo financiero y sus áreas integradas. (PAGE 791)
- `Finanzas/Finanzas/Maestros`: Validaciones y WorkFlow, Numeradores de documentos, Cuentas contables, Auxiliares y Parametrización, Tercero y Documentos***(IGES). (PAGE 792, PAGE 794, PAGE 797, PAGE 799, PAGE 889, PAGE 898, PAGE 733)
- `Finanzas/Finanzas/Contabilidad general`: Diario contable, Extractos, Saldos, Balances, Procesos periódicos y Configuración. (PAGE 857, PAGE 858, PAGE 859, PAGE 860, PAGE 861, PAGE 865, PAGE 868)
- `Finanzas/Finanzas/Cobros y pagos`: SEPA, cartera, gestiones, procesos, remesas y Gestión de Recobros. (PAGE 802, PAGE 810, PAGE 812, PAGE 959, PAGE 911)
- `Finanzas/Finanzas/Tesorería`: Traspasos, maestros, extractos bancarios, domiciliaciones, conciliación y posición. (PAGE 815, PAGE 817, PAGE 829, PAGE 839, PAGE 841, PAGE 1070)
- `Finanzas/Finanzas/Caja`: configuración, operativa, informes, cheques y remesas. (PAGE 764, PAGE 766, PAGE 768, PAGE 769, PAGE 913)
- `Finanzas/Impuestos`: registros fiscales, IVA, ISP, prorrata, maestros y e-Reporting. (PAGE 756, PAGE 949, PAGE 972, PAGE 954, PAGE 1081)
- `Finanzas/Activos permanentes`: maestros, situación, amortizaciones, bajas, ventas y procesos. (PAGE 771, PAGE 775)

## Orden de carga de tablas
La documentación no publica un único orden global para todo Finanzas; esta secuencia combina los pasos explícitos por área.

1. Sociedades y terceros: `ctercero` debe existir antes de crear `cempresa`; intervienen también `cterdire` y `cmonedas`. (PAGE 897, PAGE 817)
2. Plan contable y sistemas: `ccuentas`, `csistema` y `cdiarios`; `ctertipo`/`ccuentas` para cuentas de terceros. (PAGE 799, PAGE 1007)
3. Auxiliares contables: proyectos y secciones en `cproyect`/`cseccion`. (PAGE 799)
4. Ejercicio y periodos: `cejercic` y `cperiodo`; al crear el primer ejercicio se generan doce registros de periodificación. (PAGE 900, PAGE 868)
5. Usuarios y permisos: `cusergrp`, `gusergrp`, `cuserperh`, `cuserperl`, `cuserperv`; primero agrupación, después permisos y valores. (PAGE 795, PAGE 921)
6. Numeradores y tipos de documento: `gvenfacd`, `gcommovd`, `gvenpedd`, `gvenmovd`, `gcomacud`, `gcompedd`, etc. (PAGE 797)
7. Documentos y tipologías IGES: antes de operar se definen tipologías; los destinos de plantillas contables incluyen `capuntes`, `cimpcont` y `cefectos`. (PAGE 734, PAGE 735, PAGE 862)
8. Cuentas de terceros: no se crean previamente; el sistema las genera al validar la relación contable del tercero. (PAGE 799, PAGE 901)
9. Contabilidad general: `casientos` y `capuntes`; los estados exigen `imp_cuadre = 0` para `C`. (PAGE 1004, PAGE 1006)
10. Impuestos: `ctax_zone` → `ctax_class` → `ctax_artkey`, `ctax_terkey`, `ctax_dockey`, `ctax_clasif`, `ctax_cif_map` → `ctax_operkey` y `ctax_operation` → `ctax_type` → `ctax_rule` → excepciones y segmentaciones → agencia/periodos → mapeos `ctax_erep_map`, `cimpcont_2_ctax`. (PAGE 942, PAGE 935, PAGE 936, PAGE 937, PAGE 1038, PAGE 1040, PAGE 1057, PAGE 1055, PAGE 978, PAGE 939, PAGE 1081, PAGE 943, PAGE 945, PAGE 946, PAGE 1048, PAGE 1051, PAGE 1053, PAGE 1061, PAGE 1063)
11. Cartera: efectos y gestiones sobre `cefectos`, `cefecges_pcs`, `cefechis`, remesas en `cremesas` y reclasificaciones en `cefecrec_pcs`. (PAGE 810, PAGE 812, PAGE 1107, PAGE 959, PAGE 995)
12. Tesorería y caja: `tipocuenta`, `cbancpro`, `toperfin`, `tflujfin`, `tflujcar`, `tctaopec`, calendarios, `ttramovd`, `ttraempr`; caja con `ccajaope`, `ccajamon`, `ccajadef`, `ccajamov`. (PAGE 829, PAGE 817, PAGE 768)
13. Activos fijos: grupos `cinmgrps`, cuentas `cinmctas`, grupos fiscales `cinmfgrp`, tablas fiscales `cinmftab`, sistemas especiales, localizaciones; después `cinmhead`, `cinmelem`, `cinmeval`, `cinmcomp`. (PAGE 775, PAGE 771)
14. Balances por agrupación: ejecutar `cctasal_agrs_genera` para calcular `cctasal_agrs`. (PAGE 993)

## Dos escenarios: solo Finanzas e integrado con IGES

### Solo Finanzas
- La «Facturación financiera» como término literal figura como “No documentado”; tampoco está documentada la diferencia entre facturar desde ICON sin IGES y facturas procedentes de documentos de gestión. (PAGE 885, PAGE 887)
- En facturación, “solo es necesario definir el maestro de artículos a utilizar”. (PAGE 871)
- Las facturas directas, de alquiler con referencias catastrales, notas, descuentos, partida estadística, formatos y asociación de cuentas contables aparecen como funcionalidades comunes. (PAGE 885, PAGE 887)

### Integrado con IGES
- Documentos IGES: concursos, ofertas, formularios, solicitudes, acuerdos, planes de recepción/entrega, pedidos, albaranes y facturas. (PAGE 733)
- Circuitos posibles: `Pedido → Albarán → Factura`, `Oferta → Pedido → Albarán → Factura`, `Acuerdo → Albarán → Factura`, `Pedido de compra → Pedido de venta → Albarán de venta → Albarán de compra → Factura de venta → Factura de compra`, `Albarán de abono → Factura de abono`. (PAGE 733)
- La tipología se debe crear antes de dar de alta documentos; los campos documentados son `Tabla origen`, `Actualización tabla origen` (`Restando`/`Sumando`/`No`) y `Copiar líneas` (`Sí`/`Validar`/`No`). (PAGE 734, PAGE 735)
- La plantilla de contabilización debe definirse “en la tipología del documento” para poder contabilizar. (PAGE 886, PAGE 888)
- Las facturas de venta contabilizadas generan asiento contable, cartera de efectos y registros fiscales de forma automática. (PAGE 886)
- Las facturas de compra contabilizadas generan asiento, cartera de efectos y documento fiscal automáticamente, según la configuración de la cuenta contable. (PAGE 888)
- Los asientos de ventas se generan en el diario por defecto `VE`, con la fecha de emisión de la factura; en compras el asiento usa la fecha contable de la cabecera. (PAGE 886, PAGE 888)
- PAGE 733, PAGE 734 y PAGE 735 no documentan que pedido, albarán o factura IGES generen asiento por sí mismos, ni cuentas concretas, ni una plantilla asociada a cada tipología. (PAGE 733, PAGE 734, PAGE 735)

## Contabilidad general
- `casientos` es la cabecera del asiento; `capuntes` son las líneas. (PAGE 857, PAGE 1004, PAGE 1006)
- Estados de asiento: `P` Provisional, `X` Intermedio, `C` Contabilizado. (PAGE 1004)
- `csaldos` mantiene saldos acumulados y no es modificable desde pantalla. (PAGE 860, PAGE 993)
- `ccuentas` guarda el plan contable; campos relevantes: `tipcta`, `poscta`, `estado`, `ctaper` y `ctagrp`. (PAGE 1004)
- `ccuentas_agruph`, `ccuentas_agrupl` y `ccuentas_agrupt` definen agrupaciones; `cctasal_agrs` es la fuente de ESF y ER. (PAGE 993)
- `csistema.dessis`: `0` en sistemas de origen y `1` en el sistema real. (PAGE 1007)
- `ctaper`: `0` No periodificable, `1` Periodificable, `2` Distribuible. (PAGE 1004)
- Procesos de asientos: `Contabilizar`, `Descontabilizar`, `Generación de periodificaciones`, `Cambio de sistema`, `Auditoría`, `Copia masiva`, `Carga de asientos por plantilla`. (PAGE 1004, PAGE 1005, PAGE 1006, PAGE 1007, PAGE 1013, PAGE 1014, PAGE 1122)
- `Contabilizar` exige `imp_cuadre = 0` y pasa el asiento a `C`; `Descontabilizar` lo devuelve de `C` a `P`. (PAGE 1004, PAGE 1005)
- Generación de periodificaciones crea asientos `estado = 'C'` y marca el apunte origen `punteo = 'S'`. (PAGE 1006)
- Copia masiva usa `Cadencia` `0`, `1`, `3`, `6`, `12` y `Copiar todo` `0` limitada / `1` completa. (PAGE 1014)
- Cierre temporal: `capuntes_ejtmpcie`, genera `tmp_csaldos`, elimina e inserta apertura en `csaldos` y exige ejercicio siguiente en `cejercic` con estado `A`. (PAGE 994)
- Cierre definitivo genera asiento de cierre `99999999` y apertura `0`; período `99` para cierre y `0` para apertura. (PAGE 865)
- Plantillas de contabilización: hojas destino `capuntes`, `cimpcont`, `cefectos`; origen soporta `ccomfach`, `ccomfacl`, `ccomefec`, `param`. (PAGE 862)
- `cxlstemplate` guarda plantillas XLS de Cuentas anuales e Informes. (PAGE 869)

## Cobros y pagos (cartera)
- `cefectos` es la tabla central de efectos; las gestiones se cabecera en `cefecges_pcs` y detalle en `cefecges_det`. (PAGE 810, PAGE 812, PAGE 1107)
- Estados de gestión en `cefecges_pcs.pcs_estado`: `A` abierta y `C` cerrada; una gestión abierta no puede mantener fichero bancario asociado. (PAGE 812)
- El cierre ejecuta `cefecges_estado_ava` y actualiza `cefectos.estado`, `tipefe`, `caduca`, `cuenta`, `numges`, `openum`, `opeant`, `feccam`; `feccon` solo si hay asiento o tesorería. (PAGE 1107)
- Si la acción tiene `cefeacti.codast`, el cierre genera asiento mediante plantilla `cefeplah.codpla`; el asiento se crea con origen `cefecges_pcs` y número de gestión como identificador. (PAGE 1107)
- Si el estado final requiere tesorería, se crean movimientos en `taptcuen` y líneas de flujo en `taptfluj`. (PAGE 1107)
- Cada modificación del cierre genera una línea en `cefechis`, que permite reapertura. (PAGE 1107)
- Errores de cierre: `cefecges_estado_ava_01` a `_13`; incluyen gestión ya cerrada, falta de cuenta financiera, falta de serie en `cbancpro_nums`, diferencias de cambio sin asiento, deuda con documentos destino y tesorería a retroceder contabilizada. (PAGE 1107)
- Reclasificación: `cefecrec_pcs` cabecera, `cefecrec_ori` orígenes y `cefecrec_des` destinos; genera asiento en `casientos`/`capuntes` con contrapartida por diferencias y enlaza `pcs_loteid`. (PAGE 995)
- Anticipos: `cefectos_anticipo_gen`; genera un efecto positivo y otro negativo especulares. (PAGE 803)
- Remesas: `cremesas`; `estrem` `A` abierta / `C` cerrada; tipos de remesa sin tesorería y con tesorería, p. ej. `CCHES`, `CCHET`, `LCDTO`, `PCHES`, `PCHEK`. (PAGE 959, PAGE 816)
- Primera acción de remesa deja efectos en `Propuesto (PR)`; segunda acción los cambia a `Ordenado al pago (OP)`. (PAGE 816)
- `Retroceder estado` anula apuntes si el periodo contable sigue abierto; si ya fue cerrado, genera asiento de compensación. (PAGE 959)
- Alinear vencimientos genera una gestión de cartera y la avanza automáticamente. (PAGE 1002)
- Cambio de titularidad usa `cefetith`/`cefetitl`; `Confirmar` contabiliza el lote mediante el motor de reclasificación. (PAGE 996)
- Consulta de cartera a una fecha pasada: NO DOCUMENTADO; el histórico citado es `cefechis`. (PAGE 1107)
- Cuadre cartera-contabilidad: NO DOCUMENTADO como informe o consulta específica; se citan controles de diferencias de cambio y cuadre de reclasificaciones. (PAGE 995)

## Tesorería y caja
- Movimiento de tesorería en `taptcuen`; flujo financiero en `taptfluj`; operación financiera en `toperfin`. (PAGE 815, PAGE 829)
- Circuito general: origen de operación → movimiento de tesorería → conciliación bancaria → contabilización. (PAGE 815)
- Orígenes de movimientos: Cartera, Contabilidad, Extracto bancario, Manual y Otros. (PAGE 815)
- Cuentas financieras en `cbancpro`; tipos de cuenta en `tipocuenta`. (PAGE 829)
- `titescfg` solo puede contener un único registro y define la prioridad de criterios de determinación de flujo financiero. (PAGE 829)
- Traspasos: `ttramovh`, `ttramovd`, `ttraempr`; un traspaso intraempresa genera dos movimientos y uno interempresa genera cuatro. (PAGE 817)
- La anulación de traspaso solo es posible mientras los movimientos no estén conciliados. (PAGE 817)
- Extracto bancario: `textract_file`, `textract`, `tconcili`; carga según norma 43. (PAGE 839, PAGE 829)
- Signo del extracto referido desde la entidad financiera: ingreso en nuestra cuenta = signo negativo; pago = signo positivo. (PAGE 829)
- `Vincular` asocia varios apuntes de extracto; `Generar` inserta movimiento de tesorería y solicita operación financiera. (PAGE 839)
- El movimiento integrado automáticamente desde extracto figura con la letra `X`. (PAGE 824)
- Domiciliaciones: alta en `Terceros > Domiciliaciones` y registro en `tcondomi`. (PAGE 841)
- Caja: definición en `ccajadef`, operaciones en `ccajaope`, monedas en `ccajamon`, diario en `ccajamov`, líneas en `ccajalin`. (PAGE 768, PAGE 769)
- `ccajaope.numsec` debe ser nulo o `≥ 20` para ser válido en contabilización. (PAGE 768)
- Estados de caja: `ccajamov` `A`, `L`, `C`; `ccajadef` `A`/`C`; `ccajarem` `A`/`C`. (PAGE 913)
- Cheques: `ccajache` con estados `R · Registrado`, `P · Propuesto`, `C · Contabilizado`, `G · Gestionado`, `I · Impagado`. (PAGE 913)
- La liquidación agrupa `ccajalin`, `ccajaval` y `ccajaliq`; si hay descuadre por moneda, lanza excepción y bloquea. (PAGE 913)
- Contabilización de caja: procesos `ccajamov_wb_account` y `ccajamov_descon`; asiento a partir de movimientos definitivos. (PAGE 913)
- Orden de carga tesorería: `cmonedas`, `cempresa`, `ctercero`/`cterdire`; después `tipocuenta`, `cbancpro`, `toperfin`, `tflujfin`, `tflujcar`; después `tctaopec`, calendarios y conceptos. (PAGE 817, PAGE 829)

## Impuestos/IVA
- Motor fiscal: zona fiscal de empresa + zona fiscal de tercero + clave fiscal de artículo/propia o excepción → `ctax_rule` → `ctax_operation` + `ctax_type`. (PAGE 943)
- Entradas del motor: zona fiscal de empresa, zona fiscal de tercero, clave fiscal de artículo, clave fiscal de tercero, clase de impuesto y país. (PAGE 1081)
- El resultado se materializa en `ctax_move_head` y `ctax_move_line`; la línea fiscal usa `taxl_oper` y `taxl_code`. (PAGE 745, PAGE 949)
- Maestros principales: `ctax_zone`, `ctax_class`, `ctax_artkey`, `ctax_terkey`, `ctax_dockey`, `ctax_clasif`, `ctax_cif_map`, `ctax_operkey`, `ctax_operation`, `ctax_type`, `ctax_rule`. (PAGE 942, PAGE 935, PAGE 936, PAGE 937, PAGE 1038, PAGE 1040, PAGE 1057, PAGE 1055, PAGE 978, PAGE 939, PAGE 1081)
- `ctax_type.type_porcen` entre `-100` y `100`; `type_bascal` admite `0`, `1`, `2`, `3`, `5`, `6`; `type_status` `A/C`. (PAGE 939)
- Prorrata: `ctax_prorrata`; ejemplo base `1.000 €`, IVA `21%`, cuota `210 €`, prorrata `80%`, deducible `168 €`, no deducible `42 €`. (PAGE 947, PAGE 972)
- ISP: el destinatario declara el IVA y se generan IVA devengado y soportado; la operación puede tener porcentaje efectivo `0 %`. (PAGE 954)
- `ctax_move_head.taxh_ereport`: `0` No procesado, `1` SII-Facturas, `2` SAFT-PT, `3` SIF, `4` SIRE, `5` SII-Pagos, `6` SII-DOI, `7` TicketBAI. (PAGE 949)
- `ctax_agencia`: organismo tributario y parámetros de SII/TBAI/Zuzendu/Veri*Factu/SIF. (PAGE 946)
- `ctax_agencia_empresa`: empresa y agencia tributaria; obligación e-Reporting `0-9`. (PAGE 1053)
- `cimpcont_2_ctax`: mapeo `cimp` → `ctax`; no tiene CHECK sobre `code_value` ni claves foráneas a catálogos. (PAGE 1063)
- `ctax_erep_map`: mapeo e-Reporting con `tax_map_erep`, `tax_map_tipdoc`, `tax_map_oper`, `tax_map_type`, `tax_map_field`, `tax_map_valor`. (PAGE 1061)
- `ctax_artkey_zone`: excepción artículo/zona; no hay restricción que impida solapes de vigencia con distinta clave. (PAGE 943)

## Activos fijos
- Estructura jerárquica: `Bien → Elemento → Componente`; el bien se registra en `cinmhead`, el elemento en `cinmelem` y los componentes en `cinmcomp`. (PAGE 771)
- Valores por elemento: `cinmeval`; campos `Sistema`, `% Amortización`, `% Años` y `Amortización inicial`. (PAGE 771)
- `Amortización inicial` acumula automáticamente la suma de importes de sus homónimos en valores de componentes. (PAGE 771)
- Configuración documentada: `cinmgrps2`/`cinmgrps3`, `cinmctas2`/`cinmctas3`, `cinmfgrp2`/`cinmfgrp3`, `cinmftab2`, `cinmlopr2`, `cinmlosu2`. (PAGE 775)
- Sistemas de amortización: `L` Lineal, `D` Decreciente por coeficiente fijo y “cualquier otro sistema definido por el usuario”. (PAGE 771)
- Tabla oficial de amortizaciones fiscales limita los valores según porcentajes mínimo y máximo del grupo fiscal. (PAGE 775)
- `Contabilizar` genera amortizaciones pendientes y cambia el histórico del cuadro de amortizaciones a “Contabilizado”; `Descontabilizar` genera desamortizaciones, cambia el estado a “Normal” y crea asiento de signo inverso. (PAGE 771)
- El ejercicio contable del histórico de amortizaciones debe estar desagrupado en períodos contables. (PAGE 771)
- Traspaso de elementos genera apuntes contables de cambios; se contabiliza en la fecha de ejecución y toma datos del registro de parámetros por defecto. (PAGE 771)
- Cambio de amortización no genera asientos contables; sí cambia el histórico si la fecha del proceso no coincide con la finalización del período de amortización. (PAGE 771)
- División de elemento reparte proporcionalmente valor de adquisición, amortización acumulada e importes netos; no se menciona generación de asientos. (PAGE 771)
- Baja total, baja parcial o venta generan asientos según las Normas de Registro y Valoración (NRV). (PAGE 771)
- Fuera de servicio presenta contradicción literal: “se realizará un apunte contra Pérdidas procedentes del inmovilizado (671)” y “en este caso no genera apuntes contables”. (PAGE 771)
- Un elemento no puede pertenecer a varios bienes. (PAGE 771)

## Errores y advertencias típicas
- `cefecges_estado_ava_01` a `_13` en cierre de gestiones de cartera. (PAGE 1107)
- `capuntes_ejtmpcie_01`: “EJERCICIO DE APERTURA [empresa / ejercicio] INEXISTENTE O NO ACTIVO”. (PAGE 994)
- Cierre temporal repetido recalcula saldos de apertura con borrado + inserción; ajustes manuales previos sobre esos periodos se pierden. (PAGE 994)
- Plantillas de contabilización: errores literales `JavaNull`, `#¡REF!`, `#¿NOMBRE?`, `=Gestion!#¡REF!`. (PAGE 862)
- Carga rápida de asientos: `La columna "Tercero" del fichero no cumple con las condiciones.`, `Total debe [100.00] distinto al total haber [1.00]`. (PAGE 1105)
- Numeradores: si la serie incluye `#d` y la máscara de número no incluye `#d`, puede haber problemas de unicidad. (PAGE 797)
- Facturas de venta: “la fecha contable no debe ser menor a la fecha de facturación” y “No se puede contabilizar una factura que todavía no ha sido emitida”. (PAGE 886)
- Artículo sin `Mnemotécnico de compras` no se podrá usar en facturas de compra; sin `Mnemotécnico de ventas` no se podrá usar en facturas de venta. (PAGE 906)
- `ccajadef.opecob` y `opepag` deben informarse conjuntamente o permanecer ambos vacíos. (PAGE 768)
- Caja: no se permite liquidar si existen movimientos anteriores de la misma caja y empresa con fecha anterior y estado distinto de `Cerrado`. (PAGE 913)
- SEPA: el nombre se recorta a 70 caracteres en `Nm` después del filtro ISO 20022; «ß» pasa a «SS». (PAGE 802)
- Por agrupación: “Una cuenta no configurada en `ccuentas_agrupl` no aparecerá en ningún estado financiero, aunque tenga saldo”. (PAGE 993)
- `ctax_rule`: los bloques de compras o ventas deben informarse completos o permanecer vacíos. (PAGE 1081)
- `ctax_agencia_periodo`: el estado `L` Liquidado no es un valor actualmente permitido. (PAGE 1051)

## Referencias
- `references/hechos-parametrizacion.md`: parametrización general de Finanzas, rutas de menú, permisos, numeradores, empresa, tercero y ejercicio.
- `references/hechos-parametrizacion-b.md`: integración de documentos IGES con Contabilidad, tipologías, circuitos y plantillas XLS.
- `references/hechos-integracion.md`: facturación de compras y ventas, estados, contabilización y generación de asiento/cartera/fiscal.
- `references/hechos-contabilidad.md`: Contabilidad general, asientos, apuntes, costes, periodificación, auditoría y copia masiva.
- `references/hechos-contabilidad-b.md`: procesos periódicos, cierres, balances, agrupación y cuentas anuales XLS.
- `references/hechos-cartera.md`: Cobros y pagos, gestiones de cartera, remesas, reclasificaciones, anticipos y recobros.
- `references/hechos-tesoreria.md`: Tesorería, extractos bancarios, conciliación, caja, cheques y remesas de caja.
- `references/hechos-tesoreria-b.md`: maestros y orden de carga de Tesorería, campos de operaciones financieras y traspasos.
- `references/hechos-impuestos.md`: IVA, motor fiscal, maestros de impuestos, prorrata, ISP, SII y tablas fiscales.
- `references/hechos-activos.md`: Activos fijos, estructura Bien/Elemento/Componente, maestros y tablas.
- `references/hechos-activos-b.md`: procesos de amortización, bajas, ventas, traspasos, división y advertencias de activos.