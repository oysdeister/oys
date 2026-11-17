## 4. Conceptos clave

- Un plan contable es una relación o cartilla de códigos numéricos que identifica cada transacción económica/financiera de la empresa; cada país tiene su propia codificación. — s 15-20
- Lo primero para la configuración contable es tener creado un plan contable con su código; por ejemplo, España usa `ES` / PG 2008 y Perú usa `PE`. — s 28-33
- Después del plan contable se crean las cuentas contables; son los códigos que aparecen en el campo “cuenta”, por ejemplo `10200` para capital. — s 34-44
- Axional permite separar el código de cuenta con un punto y añadir a la derecha un código para identificar a un tercero concreto y poder analizar a nivel contable. — s 46-58
- En la cuenta contable hay indicadores con consecuencias contables: lógica de debe/haber, tipo terceros, tipo costes, gestión de impuestos, cartera y periodificable. — s 62-98
- Para calcular impuestos y generar cartera, la cuenta debe tener la marca de terceros. — s 73-82
- La cartera es la gestión de cobros y pagos: pagar una factura, cambiarla por letra, autorizarla o cargarla al banco. — s 84-89
- Los mnemotécnicos de cuentas no son códigos contables; son identificadores alfanuméricos para que usuarios no contables o módulos identifiquen transacciones, y por detrás se asocian a plan contable y cuenta. — s 102-117
- Con plan contable + cuentas contables + mnemotécnicos ya se puede iniciar la parametrización de una empresa. — s 118-119
- Axional es multiempresa y multimoneda; una misma base/usuario puede acceder a varias empresas y la moneda funcional define en qué moneda se presenta la información contable. — s 124-126, 193-203
- En la empresa se define: código, nombre, fecha de inicio importante para ejercicios contables, identificación fiscal, zona impositiva, plan contable, moneda y calendario. — s 132-219
- La empresa debe vincularse a un tercero previamente creado; la relación empresa-tercero es uno a uno. — s 156-159, 408-412
- En la ficha del tercero se definen datos fiscales como NIF/RUC/NIT, tipo de tercero, direcciones con zona impositiva, datos bancarios y condiciones comerciales. — s 203-381
- El código de tipo de tercero, p. ej. `100` en `ctipoTER`, puede crear automáticamente cuentas contables de cliente/proveedor al dar de alta al tercero usando mnemotécnicos. — s 257-279
- En VNext la interfaz cambió de pestañas a links; las tablas relacionadas se consultan y editan sin salir del formulario principal. — s 385-401
- El código a la derecha del punto identifica al tercero; si es cliente o proveedor lo identifica la cuenta base, por ejemplo `4000` proveedor y `44` cliente. — s 488-513

## 5. Problemas típicos

- ¿Se puede asociar más de un tercero a una empresa? No, la relación empresa-tercero es uno a uno; si hay otra empresa, se necesita otro tercero. — s 408-412
- Para facturación electrónica en Colombia se acostumbra asociar varios contactos/roles; el vínculo empresa-tercero sigue siendo 1:1, pero pueden usarse jerarquías y agrupaciones de empresas/terceros. — s 415-447
- Si no se identifica el plan contable en la empresa desde el inicio, no se podrá realizar la contabilización. — s 188-189
- Al intentar crear una nueva relación contable en VNext se produjo un error (“hemos fallado”); se mostró una relación ya existente del tercero `00074` para explicar el resultado esperado. — s 473-491
- Duda sobre si los dígitos finales del código identifica cliente o proveedor: en realidad identifican al tercero concreto; el tipo cliente/proveedor lo determina la cuenta base contable. — s 452-513
- Duda sobre si una entidad regula qué número corresponde a proveedor, cliente, etc.: sí, existen entidades contables por país; en Perú, el Consejo Normativo de Contabilidad, disponible desde la página del MEF. — s 515-527

## 6. Preguntas de test

1. ¿Qué es un plan contable?  
A) Una relación de terceros clientes y proveedores.  
B) Una cartilla de códigos numéricos que identifican transacciones económicas/financieras.  
C) Una tabla de impuestos de cada país.  
D) Un calendario fiscal para cierres.  
**Correcta: B. Explicación:** En s 15-18 se define como una relación/cartilla de códigos numéricos que identifican cada transacción.

2. Según la sesión, ¿cuál es el primer paso para comenzar una configuración contable?  
A) Crear empresas.  
B) Crear terceros.  
C) Crear el plan contable.  
D) Crear mnemotécnicos.  
**Correcta: C. Explicación:** En s 28-33 se indica que lo primero es tener creado un plan contable con código.

3. ¿Qué identifica el código que aparece a la derecha del punto en una cuenta contable?  
A) Si la cuenta es cliente o proveedor.  
B) El país del plan contable.  
C) Un tercero concreto.  
D) La moneda funcional.  
**Correcta: C. Explicación:** En s 46-58 y s 488-513 se aclara que ese código identifica al tercero.

4. ¿Qué marca/indicador de cuenta permite calcular impuestos y generar cartera?  
A) Periodificable.  
B) Tipo costes.  
C) Tipo terceros.  
D) Lógica de debe/haber.  
**Correcta: C. Explicación:** En s 73-82 se dice que para calcular impuesto y generar cartera la cuenta debe tener marca de terceros.

5. ¿Qué son los mnemotécnicos de cuentas?  
A) Códigos contables numéricos obligatorios.  
B) Identificadores no contables que se asocian a plan y cuenta para usuarios no contables.  
C) Números de cuenta bancaria.  
D) Workflows de validación de terceros.  
**Correcta: B. Explicación:** En s 102-117 se explica que son códigos no contables utilizados en módulos y asociados internamente a cuentas contables.

6. ¿Qué tres elementos se consideran suficientes para iniciar la parametrización de una empresa?  
A) Plan contable, cuentas y mnemotécnicos.  
B) Empresa, banco y calendario.  
C) Moneda, workflow e impuestos.  
D) Tercero, cartera y condiciones comerciales.  
**Correcta: A. Explicación:** En s 118-119 se resume que con esas tres cosas ya se puede comenzar.

7. ¿Cuántos terceros se pueden vincular a una empresa?  
A) Uno, relación uno a uno.  
B) Varios, según contactos.  
C) Hasta cuatro.  
D) Depende del país.  
**Correcta: A. Explicación:** En s 408-412 se responde que no, solo un tercero por empresa.

8. Si una empresa está configurada con plan contable de España y moneda euro, al registrar una factura…  
A) Usa el plan contable de Perú.  
B) Busca el plan contable de España y presenta la contabilidad en euros.  
C) Cambia automáticamente a dólares.  
D) No se contabiliza.  
**Correcta: B. Explicación:** En s 179-201 se indica que la operación busca el plan configurado y la información financiera se presenta en euros.

9. ¿Qué facilita el código de tipo de tercero configurado en `ctipoTER`?  
A) Validar el NIF de España.  
B) Crear automáticamente cuentas contables de cliente/proveedor al dar de alta el tercero.  
C) Generar facturas electrónicas.  
D) Configurar el calendario fiscal.  
**Correcta: B. Explicación:** En s 257-264 se explica que crea automáticamente las cuentas contables al crear el tercero.

10. ¿Dónde se configura la zona impositiva del tercero?  
A) En datos bancarios.  
B) En condiciones comerciales.  
C) En direcciones.  
D) En workflow.  
**Correcta: C. Explicación:** En s 314-327 se muestra la zona impositiva dentro de direcciones del tercero.

11. Según las condiciones comerciales mostradas, ¿cuál es el estado inicial de una factura/cartera?  
A) Cobrado.  
B) Pagado.  
C) Pendiente.  
D) Autorizado.  
**Correcta: C. Explicación:** En s 348-366 se indica que nace como pendiente y luego evoluciona a cobrado/pagado.