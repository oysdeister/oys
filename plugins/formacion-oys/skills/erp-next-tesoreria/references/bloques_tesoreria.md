# Bloques de Tesorería (tesoreria.json) paso a paso

Fuente: `app/src/content/tesoreria.json`, `app/src/content/icon-contabilidad.json` (`asientos-14`) y `auditoria/redaccion_tesoreria.md`. Rutas desde «Finanzas ›». `{INI}` = iniciales.

## Índice
1. tesoreria-1 · 2. tesoreria-2 · 3. tesoreria-3 · 4. asientos-14 · 5. tesoreria-4 · 6. tesoreria-5 · 7. icon-cartera-v-8 · 8. icon-cartera-v-9 · 9. icon-cartera-v-10 · 10. icon-cartera-v-11 · 11. tesoreria-6 (cajas) · 12. tesoreria-7 (financiación) · 13. tesoreria-8 (valores y avales)

## 1. tesoreria-1 · Preparar el banco propio
Banco BBVA_{INI} (Cobros y Pagos › Maestros › Auxiliares › Bancos propios), ya creado en Cartera. Tres datos clave: cuenta financiera, cuenta contable (57200.00000) y formato del extracto. Pasos: comprobar la «Cuenta» contable; informar banco y un IBAN de prueba (para recibir el N43; el del caso es el de la entidad ES0182, igual para todos los alumnos); en «Control extracto bancario» elegir el «Formato extracto» de norma 43 y mirar Fecha y Saldo del extracto; repasar pestañas (Operaciones por cuenta, Comisiones, Numeradores, Remesas por cuenta). **Comisión {INI}TRF**: pestaña «Comisiones» › Nuevo: Posición Haber, operación PMICDT, comisión {INI}TRF, «Operación comisión» vacía por ahora, sin marcar «Com. beneficiario» ni «Com. efecto», fecha inicio 01-10-2026, Tipo Fijo, importe 3,5000. Al pagar 151,25 el banco cargará 154,75. Longitud y maestro del código de comisión no comprobados.
Trampas: extracto nuevo no carga (saldo inicial ≠ saldo final del anterior); comisión dentro del movimiento cuando la querías aparte (rellena «Operación comisión») y al revés (vacíala).

## 2. tesoreria-2 · Flujos, operaciones y parámetros
- **Flujo {INI}COM** (Tesorería › Maestros › Flujos financieros › Flujos financieros): tipo flujo «Comisión» (solo sirve para comisiones; sin marcar es normal), posición «Ambos», cuenta contable = mnemotécnico {INI}626 (62600.00000, «Detalle cuentas mnemotécnicas» muestra la real). Sin cuenta contable no se contabiliza.
- **Operación {INI}COM** (Operaciones › Registro): Posición «Salida», estado Abierto, Interface (el asiento al contabilizar), Información complementaria con agrupación obligatoria, concepto «Pago» y flujo {INI}COM. Después, en la comisión de BBVA_{INI}, «Operación comisión» = {INI}COM y «Recalcular comisión» del pago de 151,25.
- **Parámetros de conciliación**: Referencia, float 1 y 1, «Primer registro», «Al conciliar extracto», «Al generar desde cartera».
- **Parametrización tesorería** (registro único): notificar medio plazo, fecha contable (de operación o de proceso), búsqueda de flujos, tolerancias en % y en €.
Ejemplo: con float 1 un pago del miércoles se busca en el extracto del martes al jueves.

## 3. tesoreria-3 · Movimiento manual
Ops. corto plazo › Nuevo: empresa 0, BBVA_{INI}, fecha operación y valor 12-11-2026, Posición Salida, importe 10,00, operación {INI}COM; guarda y revisa los Flujos (o pestaña «Flujos de tesorería»); «Conciliado» queda vacío hasta casar con el extracto; «Contabilizar». Botones del movimiento: Auditar tesorería, Contabilizar, Anular pseudo-conciliación, Recalcular comisión. Casillas auditado tesorería y auditado contable. Muchos movimientos no se crean a mano: nacen de la acción PTES o de remesas c/Tes. Captura de la cuenta de prácticas CAPT_BCO (salida de 480,00).

## 4. asientos-14 · El asiento de un movimiento de banco
Escribe antes el asiento esperado y luego «Contabilizar». Salida: flujo al debe, banco al haber. Comisión de mantenimiento: 62600.00000 debe / 57200.00000 haber, 10,00. Pago a T{INI}: 40000.T{INI} / 57200 por 151,25 al final; comisión 62600 / 57200 por 3,50. Ejemplo de la demo: remesa de 8.080,15, debe 40100.00003.

## 5. tesoreria-4 · Extracto bancario
Concepto: el N43 tiene cabecera, una línea por movimiento y cierre; cada línea con concepto común (02 ingresos, 04 transferencias, 06 remesas, 17 comisiones) y propio. Extracto del caso (ver SKILL). Pasos de **cargar**: descarga el fichero del caso, cambia ZZ por tus iniciales en referencias y nombre, comprueba que existen los conceptos propios 002, 004, 006, 017 del banco ES0182; «Almacén ficheros» › Nuevo (y de nuevo «Nuevo») › adjunta `caso_BBVA_{INI}.n43`; formato norma 43; empresa 0 y BBVA_{INI}; Guardar; «Cargar extracto bancario» y confirma; estado «Procesado». Revisa en Extractos bancarios › Movimientos. **Alta a mano**: Nuevo, empresa 0, BBVA_{INI}, fechas, concepto común y propio, importe (cargo en positivo), seis líneas.
- Conceptos comunes (Maestros › Conceptos › Comunes): dónde se asigna la operación para cargos (Debe) y abonos (Haber).
- Conceptos propios: banco, código, tipo de conciliación (Individual / Total por día), Integración (operación a crear si no está en tesorería), Criterio filtro, rejilla «Operaciones a conciliar» (vacía en los del caso).
Trampas: concepto propio inexistente al cargar; saldo inicial incoherente; si haces las dos vías, líneas duplicadas.

## 6. tesoreria-5 · Conciliar el banco
Conciliación bancaria: fecha inicio/fin, empresa, cuenta, «Ejecutar consulta»; izquierda extracto, derecha tesorería; pestañas «Extracto pendiente/conciliado», «Tesorería pendiente/conciliada», «Selección de efectos». Marca extracto y tesorería de igual importe y signo contrario › «Conciliar banco»; ambos guardan el número del otro («huellas»). Caso: conciliar 10,00, 151,25 y 3,50; dejar pendientes -3.000,00 y los dos -121,00. Botones: ver SKILL. Automática: Procesos › Conciliación automática (empresa, cuenta, fechas, concepto propio opcional).

## 7. icon-cartera-v-8 · Circuito de extracto y conciliación
Extracto = documento del banco; conciliación = comparación de la empresa (no son lo mismo). Orden: remesa ordenada → extracto → conciliación → contabilización; no contabilices justo tras el extracto. Dos asientos: al ordenar, deuda del proveedor (400) a la cuenta de la acción, sin tocar el banco; al conciliar y contabilizar, el asiento del banco. En el PGC: 401 debe / 572 haber; en la base del vídeo, 57900 «Fondos en movimiento». Caso: pago de 151,25 del 06-11-2026 con comisión 3,50 (vídeo: remesa de 1.524,60, banco PRVCC0).

## 8. icon-cartera-v-9 · Extracto de una remesa de pago
Extractos bancarios › Movimientos › Nuevo: empresa 0, BBVA_{INI}, 06-11-2026 en las dos fechas, común 04, propio 004, **151,25 en positivo**; y la comisión: 06-11-2026, común 17, propio 017, 3,50. No pulses «Conciliar automático» aquí. Si cargaste el N43 ya las tienes. Cuenta financiera: elige primero la empresa 0.

## 9. icon-cartera-v-10 · Conciliar y contabilizar una remesa
Conciliación bancaria: empresa 0, BBVA_{INI}, 01-11-2026 a 30-11-2026, «Ejecutar»; marca extracto 151,25 y tesorería -151,25 › «Conciliar banco»; verifica «Extracto conciliado» y «Tesorería conciliada»; en «Tesorería conciliada» pulsa el importe subrayado -151,25 › «Contabilizar» (sin esto no hay asiento ni fecha de contabilización). Asiento: **cuenta puente al debe, 57200.00000 al haber, 151,25**; la comisión: 62600.00000 / 57200.00000 por 3,50. Vídeo: remesa de 1.524,60, en la base del vídeo debe 10000.00027 y haber 57900.

## 10. icon-cartera-v-11 · Cobro y anticipo
Extracto de cobro en **negativo**: Movimientos › Nuevo, 14-11-2026, común 04, propio 004, **-121,00**; y efecto 2: 14-12-2026, común 06, propio 006, -121,00 (dos líneas de -121,00). **No tienen movimiento de tesorería** (COBD y remesa s/Tes apuntan la 572 con su asiento): se justifican con el asiento, no se contabilizan otra vez. Vídeo: remesa de cobro de 5.082,00, común 04, propio 13. **Anticipo**: en finanzas no genera factura; genera dos efectos (+500 que se cobra con su remesa y extracto; −500 pendiente que se compensa con la factura futura y no mueve dinero). Proceso en Cobros y Pagos › Procesos › Especiales › Anticipos. El caso no tiene anticipos.

## 11. tesoreria-6 · Cajas (opcional; el caso no usa la caja)
Finanzas › Caja: Visión general, Maestros (Definición de cajas, Tipos de operación de caja, Tipos de moneda de caja), Movimientos (jornada con línea de saldo inicial, vales, liquidación), Cheques y Remesas (Incluir en remesa, «Cheque impagado», «Deshacer impagado»), Dashboard y KPI, Informes (Resumen de caja). CAJA_{INI} es la de Cartera. Ejemplo: vale de 50 € baja el saldo y al cancelarlo vuelve. Trampas: descuadre en liquidación; no se liquida con movimientos anteriores sin cerrar de la misma caja y empresa; en la definición, operación de cobro y de pago **juntas o ambas vacías**.

## 12. tesoreria-7 · Financiación (opcional; el caso no pide dinero prestado)
Tesorería › Financiación: contratos (préstamos, leasing, renting, pólizas), revisión de intereses, cuadro de amortización (tabla de cuotas, no es la amortización de activos; botón «Generar factura»), configuración (grupos de cuentas LP/CP, tipos de financiación con Generar tesorería, flujo capital y flujo intereses), préstamos y depósitos CP, líneas financieras. Interés: 10.000 × 3 × 30 / 36.000 = 25. Errores: «Método de cálculo no contemplado» (usa Francés, Americano, Italiano o Incremento de periodos); «No especificada parametrización para la cuenta y empresa…» (da de alta la parametrización de cuentas de préstamos y depósitos); no se desactiva un contrato con cuotas facturadas o con tesorería.

## 13. tesoreria-8 · Valores y avales (opcional)
Cartera de Valores (renta variable: dividendo; renta fija: cupón) con Maestros (Mercados financieros, Tipos de cartera, Cuentas); Avales de garantías (botón «Generar tesorería», pestaña Tesorería; cancelar solo borra las cuotas pendientes de contabilizar); Posición › «Flujos por tramos de días» y cash flow. Error: cartera duplicada (mismo código, valor, moneda y número de títulos). El caso termina con 3.077,25 en BBVA_{INI} y sin inversiones.
