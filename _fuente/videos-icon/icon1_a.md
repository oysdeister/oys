## 2. Capítulos

1. **0–147 s | Factura, módulos y contabilización**
   - 0 s | Factura de compra con origen albarán (ejemplo)
   - 8 s | Módulos finanzas/gestión y facturas directas
   - 43 s | Contabilización; DocFlow y albaranes
   - 60 s | El “render” aumenta al contabilizar
   - 74 s | Se generan asientos, cartera y registros fiscales
   - 96 s | Asiento contable: debe/haber y cuadre por 1.058,75
   - 103 s | Cartera de efectos: importe por pagar 1.058,75
   - 120 s | Registros fiscales: IVA 21 % y base imponible

2. **148–603 s | Remesa y maestro de empresas (C-Empresa)**
   - 148 s | Remesa sirve para cobrar o pagar facturas
   - 152 s | Entrada a C-Empresa en Finanzas
   - 173 s | C-Empresa Deister ya parametrizada
   - 234 s | Ejemplo de tercero: Sorbitos Café
   - 260 s | Alta: fecha enero, moneda euros, datos del tercero
   - 362 s | Creación del ejercicio contable 2026
   - 388 s | Banco propio y cuenta financiera para remesas
   - 574 s | Práctica con Excel para crear C-Empresa propia

3. **604–1087 s | Facturas directas de compra y venta**
   - 604 s | Finanzas: facturas directas sin origen
   - 637 s | C Confac H: tipo FC, empresa y proveedor
   - 693 s | Datos financieros: cuenta financiera obligatoria
   - 707 s | Nº de factura y factura del proveedor editables
   - 755 s | Validación: importe total y de factura 6.050
   - 766 s | Contabilizar genera asientos, cartera y registros
   - 788 s | Detalle de impuestos: monto, cuota deducible e impuesto
   - 861 s | Error al validar factura de ventas FB; FAQ ID 2

4. **1088–1325 s | Rectificativa, sustitutiva y dudas**
   - 1088 s | Rectificativa como nota de crédito; uso en España
   - 1103 s | Sirve para descuentos o importe mal sin anular
   - 1114 s | En España debe quedar registro continuo
   - 1140 s | Sustitutiva para anular definitivamente
   - 1163 s | Diferencia entre rectificativa y sustitutiva
   - 1264 s | Pregunta de José: ¿se vincula al flujo original?
   - 1308 s | Confirmación: va vinculada y dentro del DocFlow

5. **1326–1669 s | Remesas: configuración e intento de pago**
   - 1326 s | Remesa para cobrar o pagar facturas
   - 1432 s | Ruta: Cobros y pagos › Remesas / registros
   - 1449 s | Creación de remesa clase pagar; empresa y cuenta
   - 1468 s | Clase cobrar/pagar; requisito de configuración previa
   - 1503 s | Alta de remesas con tesorería en bancos propios
   - 1561 s | Filtro por tercero Sorbitos para seleccionar efectos
   - 1642 s | Error: efecto cheque vs remesa transferencia
   - 1652 s | Cambio a remesa con cheque; se borra información

6. **1670–2076 s | Depuración de remesas y repaso de asientos**
   - 1670 s | Prueban con otra factura; son configuraciones
   - 1692 s | Usan factura de Gabriel; se intenta jalar efecto
   - 1856 s | La factura debe jalar su efecto para remesar
   - 1934 s | Repaso: cartera de efectos es importe por cobrar
   - 1988 s | Repaso: contabilizar genera tres elementos
   - 2003 s | Asiento contable: registro de entradas/salidas
   - 2030 s | Ejemplo compra mesa de 1.000; asiento debe/haber
   - 2047 s | Regla: asiento contable siempre cuadrado

Tramos muertos descartados: 1675–1855 s, repeticiones y espera al seleccionar efectos.

## 3. Transacciones y pantallas

### Factura de compra con origen albarán
- Ruta/menú: no se cita; se muestra desde gestión.
- Objeto/tabla: no se cita.
- Inicio/fin: 0–60 s.
- Pasos:
  1. Muestra factura de compra creada con origen albarán.
  2. Señala bloques DocFlow, acuerdos, albaranes y suministros.
  3. Indica que al contabilizar aumentará el “render”.
- Capturas: 0 s, 54 s, 60 s.

### Resultados tras contabilizar
- Ruta/menú: no se cita; se accede desde la factura contabilizada.
- Objeto/tabla: asientos contables, cartera de efectos, registros fiscales.
- Inicio/fin: 60–137 s.
- Pasos:
  1. Contabilizar factura; aumentan asientos, cartera y registros.
  2. Abrir asiento contable: debe/haber y cuadre por 1.058,75.
  3. Abrir cartera de efectos: importe por pagar 1.058,75.
  4. Abrir registros fiscales: IVA 21 %, base imponible y total 1.058,75.
- Capturas: 74 s, 96 s, 123 s.

### C-Empresa / Maestro de empresas
- Ruta/menú: Finanzas › C-Empresa (maestro de empresas).
- Objeto/tabla: C-Empresa / cempresa.
- Inicio/fin: 152–604 s.
- Pasos:
  1. Entrar en C-Empresa y usar un tercero existente, ej. Sorbitos Café.
  2. Fecha de inicio enero, moneda euros; nombre comercial, ID fiscal y datos se heredan del tercero.
  3. Confirmar plan contable España y calendario España; guardar.
  4. Crear ejercicio contable 2026 dentro del maestro.
  5. En Bancos propios, crear banco con entidad CAISA C13, cuenta financiera y fecha de apertura.
  6. Asignar cuenta 57.9 “Fondos en Movimiento para los Bancos”.
- Capturas: 359 s, 401 s, 446 s.

### Configuración de remesas por cuenta
- Ruta/menú: Finanzas › C-Empresa › Bancos propios › Remesas por cuenta.
- Objeto/tabla: no se cita.
- Inicio/fin: 1487–1551 s.
- Pasos:
  1. Abrir maestro de empresas: Bancos propios › Remesas por cuenta.
  2. Añadir remesa de pago/cobro con tesorería.
  3. Guardar y añadir el tipo contrario, cobro o pago.
  4. Verificar que al crear remesa aparezca el tipo configurado.
- Capturas: 1503 s, 1520 s, 1551 s.

### Factura directa de compra — C Confac H
- Ruta/menú: no se cita menú exacto; transacción C Confac H en Finanzas.
- Objeto/tabla: C Confac H.
- Inicio/fin: 637–805 s.
- Pasos:
  1. Entrar a C Confac H y elegir tipo FC.
  2. Seleccionar empresa Leasesport y proveedor Casanova.
  3. Rellenar en datos financieros la cuenta financiera obligatoria.
  4. Completar nº factura y factura del proveedor, editable.
  5. Crear línea/artículo y validar; importe total e importe factura 6.050,00.
  6. Contabilizar; ver asiento, cartera, registros y detalle de impuestos.
- Capturas: 693 s, 755 s, 788 s.

### Factura directa de venta — tipo FB
- Ruta/menú: no se cita; módulo Finanzas, tipo FB.
- Objeto/tabla: no se cita.
- Inicio/fin: 805–1032 s.
- Pasos:
  1. Abrir factura directa de ventas con tipo FB.
  2. Intentar validar la factura.
  3. No deja contabilizar; aparece error/FAQ ID 2.
  4. Descartan problema por facturas IJES ya contabilizadas.
  5. Queda pendiente de revisar con sistemas.
- Capturas: 861 s, 1032 s.

### Factura rectificativa y sustitutiva
- Ruta/menú: no se ejecuta; se menciona opción en Excel.
- Objeto/tabla: no se cita.
- Inicio/fin: 1088–1325 s.
- Pasos:
  1. Rectificativa: nota de crédito para descuentos o importe mal sin anular.
  2. En España debe quedar registro continuo de la factura.
  3. Sustitutiva: anula o reemplaza definitivamente la factura inicial.
  4. Diferencia: rectificativa corrige; sustitutiva anula/reemplaza.
- Capturas: 1103 s, 1140 s.

### Remesa / registros de cobros y pagos
- Ruta/menú: Finanzas › Cobros y pagos › Remesas, registros de cobros.
- Objeto/tabla: no se cita explícitamente.
- Inicio/fin: 1326–2076 s.
- Pasos:
  1. Entrar en Remesas / registros de cobros.
  2. Crear remesa: empresa Deister, cuenta financiera, fecha de remesa.
  3. Elegir clase Pagar para compra o Cobrar para venta.
  4. Elegir tipo de remesa coherente con el tipo de efecto, transferencia o cheque.
  5. Filtrar por tercero Sorbitos y cargar el efecto de la factura.
  6. Si no carga, revisar remesas por cuenta y tipo de efecto de la factura.
- Capturas: 1466 s, 1561 s, 1856 s.

### Repaso conceptual de asiento contable
- Ruta/menú: sin pantalla; explicación.
- Objeto/tabla: asientos contables.
- Inicio/fin: 1988–2076 s.
- Pasos:
  1. Contabilizar genera asientos, cartera y registros fiscales.
  2. Asiento contable registra entradas y salidas.
  3. Ejemplo didáctico: comprar mesa de 1.000.
  4. Regla: el asiento siempre debe cuadrar.
- Capturas: 2003 s, 2047 s.