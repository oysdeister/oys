## 1. Resumen

La sesión repasa el papel de las tipologías en compras y ventas y cómo determinan si un documento deja huella contable (0-46). Se muestra la pestaña Contabilización de una tipología de albarán y se explican los tipos de asiento que pueden generarse: asientos fijos, albaranes no facturados y provisión (95-171). El formador se centra después en el indicador “generar inmovilizado” y en sus dos momentos de ejecución: validación o contabilización (187-347). Con una factura de activos de la clínica ERP se recorre el circuito solicitud-pedido-albarán-factura y se observa cómo al contabilizar se habilita la pestaña Componentes (366-606). Se detallan los requisitos para que se cree una ficha de activo: tipología con “generar inmovilizado” y familia del artículo con código de bien y serie (658-794). Se explican las tablas de Icon Bienes, Elementos y Componentes, junto con grupo contable, grupo fiscal y estados del activo (846-1320). En Componentes se revisan los datos de adquisición y la proyección de depreciación (1320-1503). La sesión cierra con una duda sobre servicios de instalación y con el anuncio de futuras sesiones sobre tipologías vinculadas a Icon (1639-1869).

## 2. Capítulos

**0 | 186 | Introducción a tipologías y asientos**

- 0 | Repaso de tipologías de compras y ventas
- 46 | Ruta de tipologías de albaranes en Compras
- 95 | Pestaña Contabilización de la tipología
- 118 | Asientos fijos, no facturados y provisión

**187 | 365 | Indicador generar inmovilizado**

- 187 | Indicador adicional dentro de Contabilización
- 251 | Genera una ficha auxiliar de control de activos
- 307 | Elige si se genera al validar o al contabilizar
- 318 | Documento provisional, validado y contabilizado

**366 | 616 | Demo: factura de activos**

- 366 | Abre albarán de activos y factura de activos
- 424 | Revisa la tipología de albarán de activos
- 463 | Abre tipología de factura y pestaña Contabilización
- 486 | Configurado para generar inmovilizado al contabilizar
- 533 | Circuito solicitud, pedido, albarán y factura
- 606 | Se habilita la pestaña Componentes

**617 | 845 | Cómo se genera la ficha de activo**

- 617 | Pestaña Componentes redirige a Activos Permanentes
- 658 | Requisito: tipología con generar inmovilizado
- 703 | Artículo ejemplo: ascensor
- 718 | Abre la familia del artículo
- 746 | Parámetros de inmovilizado: código de bien y serie
- 794 | Sin configuración de familia no se crea ficha

**846 | 1096 | Bienes y grupo contable**

- 846 | Estructura: Bienes, Elementos y Componentes
- 886 | Ruta Finanzas › Activos permanentes › Bienes
- 918 | Grupo de inmovilizado para mantenimiento
- 961 | Grupo contable: paquete de seis cuentas
- 1005 | Cuenta del activo y depreciación acumulada
- 1055 | Cuentas de beneficio o pérdida por venta

**1097 | 1319 | Grupo fiscal, estados y elementos**

- 1097 | Serie y grupo fiscal del bien
- 1122 | Grupo fiscal: porcentaje y años
- 1145 | Estados: en uso, obra en curso, no amortiza, fuera de servicio
- 1214 | Analogía artículo/familia con componente/bienes/elementos
- 1268 | Elemento ejemplo: refrigeradora industrial
- 1293 | Datos de proyecto, sección y área del elemento

**1320 | 1572 | Componentes: valores y amortización**

- 1320 | Componente: importe y datos de adquisición
- 1354 | Proveedor, factura, RUC/NIF y moneda
- 1397 | Fecha de inicio de depreciación propuesta
- 1442 | Proyección de depreciación hasta 2031
- 1488 | Totales a nivel de elemento
- 1558 | Creación automática de fichas al contabilizar

**1573 | 1885 | Integración, dudas y cierre**

- 1573 | Trazabilidad entre componente y factura
- 1614 | Resumen: albarán o factura, validación o contabilización
- 1639 | Pregunta sobre ítem de instalación
- 1690 | Servicio con familia y configuración
- 1731 | Estándar crea dos fichas; la variante ERP vincula líneas
- 1809 | Otros indicadores: compromiso de inversión
- 1841 | Cierre e invitación a proponer temas

Tramos muertos descartados: ninguno relevante.

## 3. Transacciones y pantallas

### Tipologías de albaranes

- Ruta: Compras › Maestros › Documentos › Tipologías de albaranes.
- Objeto/tabla: tipología de albarán, pestaña Contabilización.
- Inicio: 46, fin: 186.
- Pasos:
  - Abre una tipología cualquiera de albarán.
  - Entra en la pestaña Contabilización.
  - Revisa los tipos de asiento/indicadores: asientos fijos, albaranes no facturados, provisión de servicios.
  - Comenta que también existe el indicador de generar inmovilizado.
- Captura sugerida: 95, 118, 151.

### Tipología de factura de activos

- Ruta: Compras › Maestros › Documentos › Tipo de facturas.
- Objeto/tabla: tipología de factura de activos, pestaña Contabilización.
- Inicio: 463, fin: 501.
- Pasos:
  - Abre una tipología de factura.
  - Va a la pestaña Contabilización.
  - Revisa el indicador “generar inmovilizado”.
  - Comprueba las opciones: al validar o al contabilizar.
  - En el ejemplo está configurado para generar al contabilizar.
- Captura sugerida: 475, 484, 489.

### Factura de activos y circuito de compras

- Ruta: no se indica menú; se abre la factura de activos del circuito.
- Objeto/tabla: factura de activos, circuito solicitud-pedido-albarán-factura.
- Inicio: 505, fin: 617.
- Pasos:
  - Abre una factura de tipología “factura de activos”.
  - Revisa el circuito: solicitud, pedido, albarán y factura.
  - Verifica que la factura está validada y que ya puede contabilizarse.
  - Usa la opción de contabilizar y comprueba que queda contabilizada con datos de proveedor, tercero, empresa, departamento, importes y artículo.
  - Resultado: se habilita la pestaña Componentes.
- Captura sugerida: 533, 588, 606.

### Componentes, entrada inicial

- Ruta: Finanzas › Activos permanentes › Componentes.
- Objeto/tabla: ficha de componente generada automáticamente.
- Inicio: 617, fin: 703.
- Pasos:
  - Pulsa la pestaña Componentes de la factura.
  - El sistema redirige al módulo de contabilidad/Icon.
  - Visualiza la ficha del componente.
- Captura sugerida: 617, 637, 649.

### Artículo y familia: parámetros de inmovilizado

- Ruta: ficha de artículo y maestro de familias.
- Objeto/tabla: artículo ascensor, familia del artículo, apartado “Parámetros de inmovilizado”.
- Inicio: 703, fin: 842.
- Pasos:
  - Abre el artículo utilizado en la factura: un ascensor.
  - Abre la familia del artículo.
  - Localiza el apartado “Parámetros de inmovilizado”.
  - Revisa los campos obligatorios: código de bien y serie.
  - Explica que si la familia no tiene esa parametrización no se crea la ficha.
- Captura sugerida: 730, 746, 768.

### Bienes

- Ruta: Finanzas › Activos permanentes › Bienes.
- Objeto/tabla: bien.
- Inicio: 886, fin: 960.
- Pasos:
  - Abre el bien asociado desde la familia.
  - Revisa código, nombre y descripción.
  - Revisa el primer parámetro: grupo de inmovilizado.
  - Explica que sirve para activos que necesitan mantenimiento periódico.
- Captura sugerida: 896, 918.

### Grupo contable

- Ruta: abierto desde el bien.
- Objeto/tabla: grupo contable, paquete de cuentas.
- Inicio: 961, fin: 1096.
- Pasos:
  - Abre el maestro de grupo contable.
  - Ve código, descripción y plan contable.
  - Explica el paquete de seis cuentas.
  - Detalla: cuenta del activo, depreciación acumulada, gasto por depreciación, beneficio/pérdida por venta y cuenta puente opcional.
- Captura sugerida: 973, 1005, 1055.

### Grupo fiscal y estado del bien

- Ruta: desde el bien.
- Objeto/tabla: grupo fiscal y campo estado del bien.
- Inicio: 1097, fin: 1213.
- Pasos:
  - Revisa la serie y el grupo fiscal del bien.
  - Abre el grupo fiscal: código, descripción, porcentaje y años.
  - Explica el clasificador de estado: activo en uso, obra en curso, no amortiza y fuera de servicio.
- Captura sugerida: 1122, 1145.

### Elementos

- Ruta: Finanzas › Activos permanentes › Elementos.
- Objeto/tabla: elemento.
- Inicio: 1243, fin: 1319.
- Pasos:
  - Abre el nivel de elementos.
  - Muestra un ejemplo de elemento: refrigeradora industrial.
  - Revisa el bien del que arrastra, código de elemento, grupo contable y grupo fiscal.
  - Revisa datos de proyecto, sección y área.
- Captura sugerida: 1243, 1268, 1293.

### Componentes: datos de adquisición y amortización

- Ruta: Finanzas › Activos permanentes › Componentes.
- Objeto/tabla: componente.
- Inicio: 1320, fin: 1572.
- Pasos:
  - Abre el componente generado desde la factura.
  - Revisa proveedor, número de factura, fecha del documento, importe, RUC/NIF del proveedor y moneda.
  - Revisa fecha de contabilización y fecha de inicio de depreciación.
  - El sistema propone como inicio el primer día del mes siguiente.
  - Consulta la proyección de depreciación anual hasta 2031.
  - Explica que a nivel de elemento solo se ven totales.
- Captura sugerida: 1354, 1408, 1442.