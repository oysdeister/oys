## 1. Resumen

La sesión explica el módulo de Cobros y Pagos de Axional VNext desde la configuración previa hasta la ejecución de un pago. Se parte de una factura de compra para ver cómo los datos financieros —efecto `TF`, pago a 90 días, moneda e importe— se heredan de la ficha del tercero. En el maestro de terceros se revisan los datos bancarios, el perceptor y las condiciones comerciales. Después se explican los maestros de Cobros y Pagos: tipos de efecto, estados, indicadores de caducidad y estados iniciales por tipo. Se vuelve a la factura para comprobar que al contabilizar se genera automáticamente la cartera de efectos, tabla `cefectos`, y la pestaña de vencimientos. Luego se ejecuta un pago individual con la acción `PEFE` y se revisa el histórico de trazabilidad. Finalmente se configura la acción en maestros y se realiza una gestión masiva para pagar uno o varios efectos, con un problema no resuelto al cerrar múltiples efectos en el entorno de desarrollo.

---

## 2. Capítulos

Descartados: `2536–2545 s` (pregunta final sobre cómo detener la grabación; sin contenido formativo).

**0 s | 392 s | Configuración previa de la cartera**

- `0 s` | Objetivo: parametrizar cobros y pagos (cartera)
- `14 s` | Factura de compra: tipología, tercero y datos financieros
- `53 s` | Cabecera financiera: TF, 90 días, moneda e importe
- `97 s` | Ruta a maestro de terceros y búsqueda 41886
- `143 s` | Datos bancarios y perceptor de pago
- `244 s` | Condiciones comerciales: tipo de efecto y estado
- `361 s` | Días de vencimiento: 90 días o al contado

**393 s | 663 s | Tipos y estados de efecto**

- `393 s` | Regreso a factura: validación de condiciones
- `427 s` | Ruta a Cobros y pagos › Maestros › Efectos
- `438 s` | Maestro de Tipos: medios de pago/efectos
- `470 s` | Parámetros de tipo de efecto: clase, estado, riesgo
- `531 s` | Maestro de Estados: ciclo de cartera
- `566 s` | Ejemplo: transferencia en estado pendiente

**664 s | 828 s | Caducidad y bloqueo de cartera**

- `664 s` | Indicador de caducidad en estados
- `728 s` | Pagado con caducidad sí; pendiente con caducidad no
- `737 s` | Indicadores ordenado y propuesto
- `777 s` | Evitar que dos personas gestionen el mismo lote
- `813 s` | Para qué sirven estos dos estados

**829 s | 952 s | Estados iniciales por tipo**

- `829 s` | Conexión de Tipos y Estados
- `880 s` | Filtrar transferencias de pago
- `885 s` | Asignar bloqueado y pendiente a TF
- `913 s` | Dos estados visibles en condiciones comerciales

**953 s | 1263 s | De la factura a cefectos**

- `953 s` | Regreso a factura contabilizada
- `986 s` | Descontabilizar: solo origen albarán
- `1014 s` | Cartera de efectos redirige a Movimientos
- `1039 s` | Tabla cefectos: cabecera, importes e impuestos
- `1178 s` | Pestaña vencimientos: 2 de mayo + 90 días
- `1235 s` | Justificación de la configuración previa

**1264 s | 1644 s | Pago individual e histórico**

- `1264 s` | Botones de pago individual según tipo de efecto
- `1332 s` | Acción PEFE “Pago directo en efectivo”
- `1368 s` | Formulario: cuenta financiera, perceptor, factura
- `1497 s` | Resultado: efectivo, pagado y caducidad sí
- `1535 s` | Retroceder para reactivar opciones
- `1598 s` | Pestaña Histórico: tres líneas de trazabilidad

**1645 s | 1923 s | Acciones de cobros y pagos**

- `1645 s` | Re-ejecuta el botón y plantea su origen
- `1675 s` | Los botones provienen de una acción: código PEFE
- `1694 s` | Ruta a Maestros › Acciones
- `1705 s` | Filtro por clase pago y código PEFE
- `1731 s` | Configuración de PEFE: estado, efecto y asiento
- `1791 s` | Individual, masivo, remesa y diferencias
- `1817 s` | Campos editables: vencimiento, importe, cuenta
- `1862 s` | Orígenes: estado pendiente y transferencia

**1924 s | 2369 s | Gestión masiva de efectos**

- `1924 s` | Ruta a Gestiones sobre la cartera de efectos
- `1951 s` | Nueva gestión: empresa, moneda, clase y acción
- `2019 s` | Selector de efectos: filtro por documento
- `2120 s` | Documento de 118,50 USD marcado
- `2165 s` | Agregar efectos y cerrar gestión
- `2190 s` | Efecto actualizado a efectivo y pagado
- `2206 s` | Sin retroceder individual en gestión masiva
- `2365 s` | Error múltiple a revisar en entorno de desarrollo

**2370 s | 2545 s | Cierre y próximos temas**

- `2370 s` | Cierre del intento y explicación masiva
- `2446 s` | Primer vistazo y asimilación de la cartera
- `2469 s` | Próximas casuísticas: devoluciones y comisiones
- `2494 s` | Agradecimientos y cierre
- `2536 s` | Descartado: charla técnica de grabación

---

## 3. Transacciones y pantallas

### Factura de compra / factura de gestión — inspección inicial

- **Ruta de menú:** no se dicta de forma explícita; se parte desde las facturas de gestión y se aclara que aplica igual a las facturas de contabilidad.
- **Objeto/tabla:** cabecera de factura de compra/gestión.
- **Explicación:** `14–97 s` y revisitada en `393–420 s`.
- **Pasos en pantalla:**
  - Abre una factura de compra.
  - Señala que lo principal es la tipología, las fechas y el tercero; en este caso es un proveedor porque es factura de compra.
  - En la cabecera se muestran los datos financieros: tipo de efecto `TF` = transferencia, forma de pago a `90`, moneda e importe.
  - Después de revisar la ficha del tercero, vuelve a la factura y comprueba que muestra justo lo configurado: pago, efecto transferencia y 90 días.
- **Captura recomendada:** `66 s`, `81 s`.

### Registro de terceros / ficha de tercero

- **Ruta de menú:** `Finanzas › Maestros › Terceros › Registro de terceros`.
- **Objeto/tabla:** ficha/maestro de terceros; tercero `41886`.
- **Explicación:** `97–392 s`.
- **Pasos en pantalla:**
  - Accede al maestro y busca el tercero con código `41886`.
  - En **datos bancarios**, revisa/configura el banco de la nación, tipo de cuenta corriente, código internacional y CCI/cuenta bancaria.
  - Revisa el campo **perceptor**: permite indicar que los pagos de este proveedor los reciba otro tercero; si se deja vacío, el perceptor es el mismo tercero.
  - En **condiciones comerciales**, configura:
    - Condición de pago.
    - Tipo de efecto = `transferencia`.
    - Estado inicial = `pendiente`; también aparece `bloqueado`.
    - Días de vencimiento = `90`; existe opción de días, meses o efectivo/al contado.
- **Resultado:** al registrar la factura se heredan estas condiciones.
- **Captura recomendada:** `165 s`, `304 s`, `393 s`.

### Tipos de efecto

- **Ruta de menú:** `Finanzas › Cobros y pagos › Maestros › Efectos › Tipos y Estados › Tipos`.
- **Objeto/tabla:** maestro de tipos de efecto.
- **Explicación:** `438–530 s`.
- **Pasos en pantalla:**
  - Entra a Tipos y filtra.
  - Explica que este maestro contiene los medios de pago: letra, cheque, giro bancario, transferencia, etc.
  - Parámetros importantes:
    - `Clase`: cobro o pago. Si un efecto sirve para ambos, debe darse de alta en ambos.
    - Estado inicial por defecto; por ejemplo, los cheques nacen como pendiente.
    - Obligatoriedad de fecha de emisión.
    - Indicador de riesgo.
    - Posibilidad de configurar intereses y comisiones.
- **Captura recomendada:** `470 s`, `504 s`.

### Estados de cartera

- **Ruta de menú:** `Finanzas › Cobros y pagos › Maestros › Efectos › Estados`.
- **Objeto/tabla:** maestro de estados.
- **Explicación:** `531–827 s`.
- **Pasos en pantalla:**
  - Abre Estados y muestra todos los estados sin filtro.
  - Explica que al registrar una factura normalmente nace en estado `pendiente` y finaliza como `pagado` o `cobrado`.
  - Describe el ciclo de tesorería: contabilización, pase a finanzas, autorización, ordenación y envío del archivo al banco.
  - Configura el **indicador de caducidad**:
    - `sí` = documento caducado/finalizado; ejemplo: estado `pagado`.
    - `no` = sigue en ciclo; ejemplo: estado `pendiente`.
  - Explica los indicadores `ordenado` y `propuesto`: sirven para marcar documentos que ya están siendo gestionados por una persona y evitar que otro usuario los tome.
- **Captura recomendada:** `566 s`, `683 s`, `737 s`.

### Estados iniciales por tipo

- **Ruta de menú:** `Finanzas › Cobros y pagos › Maestros › Estados iniciales por tipos`.
- **Objeto/tabla:** maestro de estados iniciales por tipo.
- **Explicación:** `829–952 s`.
- **Pasos en pantalla:**
  - Indica que este maestro conecta los efectos con los estados.
  - Filtra transacciones de pago.
  - Busca `transferencia`.
  - Para la transferencia asigna dos estados iniciales: `bloqueado` y `pendiente`.
  - Por eso, en las condiciones comerciales del tercero, al elegir `TF` aparecen exactamente esos dos estados.
- **Captura recomendada:** `885 s`, `913 s`.

### Cartera de efectos de la factura — tabla `cefactos`

- **Ruta de menú:** se accede desde la pestaña `Cartera de efectos` de la factura; redirige a `Finanzas › Cobros y pagos › Movimientos`.
- **Objeto/tabla:** `cefectos` / cartera de efectos.
- **Explicación:** `953–1263 s`.
- **Pasos en pantalla:**
  - Parte de una factura de compras contabilizada.
  - Descontabiliza la factura y muestra que desaparecen `Cartera de efectos` y otras pestañas; solo queda el origen albarán.
  - Al contabilizar, se habilitan `Apuntes contables`, `Cartera de efectos` y otras tablas.
  - Abre `Cartera de efectos` y redirige a `Cobros y pagos › Movimientos`.
  - En `cefactos` muestra:
    - Empresa `125`.
    - Fecha del documento y fecha de vencimiento.
    - Número de documento y justificante interno.
    - Clase `pago`.
    - Tercero Jaime Rojas.
    - Representante/responsable si estuviera parametrizado.
    - Cuenta contable asignada desde terceros.
    - Efecto `transferencia`, estado `pendiente`, caducidad `no`.
    - Divisa `dólares`, importe `118.50 USD`, tipo de cambio `3.719`, importe local en soles.
    - Impuestos/Igv.
    - Perceptor: Jaime Rojas, ya que no se configuró otro diferente.
    - Identificador de asiento contable, fecha de contabilización y datos de control.
  - En la pestaña de vencimientos de la factura:
    - Muestra tipo de efecto `transferencia` y vencimiento.
    - Calcula automáticamente la fecha: factura del `2 de mayo` + `90 días`.
    - Si hubiera vencimientos particionados, aparecerían varias líneas y se crearía un efecto por cada una.
- **Captura recomendada:** `1039 s`, `1188 s`.

### Pago individual — acción `PEFE` / “Pago directo en efectivo”

- **Ruta de menú:** botón directamente en la tabla de movimientos de cartera de efectos.
- **Objeto/tabla:** `cefectos`; acción `PEFE`.
- **Explicación:** `1264–1644 s`.
- **Pasos en pantalla:**
  - Desde la cartera de efectos, se habilitan botones según tipo de efecto y configuración.
  - Pulsa el botón **Pago directo en efectivo**.
  - En el formulario aparecen:
    - Código de acción `PEFE`.
    - Fecha de contabilización del pago.
    - Fecha de vencimiento ya calculada a 90 días.
    - Tipo de efecto final.
    - Cuenta financiera de la empresa.
    - Perceptor, por si el pago lo recibe otro tercero distinto.
    - Número de factura.
    - Posibilidad de pago parcial o total.
  - Al aceptar:
    - La transacción cambia de `transferencia` y `pendiente` a `efectivo al contado` y `pagado`.
    - La caducidad cambia a `sí`.
    - Se deshabilitan los botones, salvo retroceder o devolver.
  - Si retrocede, el efecto vuelve a `transferencia` y `pendiente` y se reactivan los botones.
  - En la pestaña **Histórico** quedan tres líneas:
    1. Estado inicial.
    2. Pago con cuenta financiera, efecto `efectivo`, estado `pagado`, caducidad `sí`.
    3. Retroceso a transferencia/pendiente.
- **Captura recomendada:** `1368 s`, `1497 s`, `1598 s`.

### Maestro de acciones

- **Ruta de menú:** `Finanzas › Cobros y pagos › Maestros › Acciones`.
- **Objeto/tabla:** acción `PEFE`; clase `pago`.
- **Explicación:** `1645–1923 s`.
- **Pasos en pantalla:**
  - Va a relación de acciones.
  - Filtra por clase `pago` y código `PEFE`.
  - En la acción `PEFE` configura:
    - Descripción: `pago directo en efectivo`.
    - Estado final: `pagado`.
    - Efecto final: `efectivo`.
    - Generación de asiento contable.
    - Ejecución individual y/o masiva.
    - Acción de remesa.
    - Posibilidad de admitir diferencias de cambio.
    - Indicadores para trama bancaria.
  - Define los campos editables que se pedirán al usuario, como:
    - Vencimiento.
    - Importe.
    - Cuenta financiera.
    - Referencia.
  - En la pestaña de estados/origen restrictivos:
    - Solo toma estado `PE`, es decir `pendiente`.
    - Por eso el botón solo se muestra cuando el efecto está `transferencia` y `pendiente`.
- **Captura recomendada:** `1731 s`, `1817 s`, `1862 s`.

### Gestión masiva — Gestiones sobre la cartera de efectos

- **Ruta de menú:** `Finanzas › Cobros y pagos › Movimientos › Gestiones sobre la cartera de efectos`.
- **Objeto/tabla:** cabecera de gestión masiva de efectos.
- **Explicación:** `1924–2369 s`.
- **Pasos en pantalla:**
  - Abre `Gestiones sobre la cartera de efectos` y crea una nueva gestión.
  - En la cabecera de gestión:
    - Empresa.
    - Proyecto.
    - Moneda de la empresa.
    - Fecha de proceso.
    - Clase: `pagos`.
    - Acción: `pago directo en efectivo`.
    - Cuenta financiera.
    - Moneda: `dólares`, porque la factura está en dólares.
  - Abre **`Selección de efectos`**.
  - Filtra por clase `pago` o directamente por documento.
  - Localiza y marca el documento de `118,50 USD`.
  - Pulsa **`Agregar efectos`**.
  - El efecto pasa a **`Efectos relacionados`**.
  - Cierra la gestión.
  - Al actualizar la cartera, el efecto ya no está `transferencia/pendiente`, sino `efectivo/pagado`.
  - Pierde el botón de retroceder individual porque la modificación se hizo vía gestión masiva; para revertir hay que abrir la gestión.
  - Al probar con varios efectos, aparece un problema que impide cerrar; queda pendiente de revisión, indicando que se trata de un entorno de desarrollo.
- **Captura recomendada:** `1951 s`, `2120 s`, `2190 s`.