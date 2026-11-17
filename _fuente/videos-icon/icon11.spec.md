# Tarea: redactar ejercicios guiados (JSON) para la plataforma «Practicando Axional Deister VNext»

Te paso: types_ej.ts (esquema), ejemplo_ejercicio.json (ejemplo terminado: copia tono y estructura), icon11_a.md e icon11_b.md (análisis del vídeo; los nombres de objetos del audio están mal transcritos, MANDAN los datos verificados de abajo).
Devuelve SOLO un array JSON válido (sin ```), de 5 ejercicios `Ejercicio`. Español de España, tuteo, frases cortas. No compares con la versión antigua del ERP. No inventes campos, rutas ni tablas: lo que no esté aquí o en el análisis, no lo pongas. Usa {INI} (iniciales del alumno) solo en códigos que el junior cree; aquí casi todo se hace sobre datos ya existentes, así que úsalo poco (p. ej. en notas de la remesa).
Cada ejercicio: id "finanzas-icon-icon11-k", numero k, titulo, objetivo, concepto (2-3 párrafos separados por \n\n), duracionMin, secciones (2-3 por ejercicio; id "<id ejercicio>-<slug>"; titulo, paraQueSirve, ruta (array o null), explicacion (array de 1-3 textos), campos [{campo, significado, ejemplo}], pasos [{texto, detalle?, imagen?, hotspot?}], avisos [{tipo: problema|solucion|nota, texto}]), test (4-6 preguntas, 4 opciones, correcta 0-3 VARIADA, explicacion), checklist (5-8 textos), problemas [{problema, solucion}].
Pon en `imagen` SOLO las imágenes del mapa de abajo y copia el hotspot exacto cuando se indique (etiqueta incluida). No pongas imagen en todos los pasos: solo donde el mapa la asigna.

## Datos verificados en pantalla (demo «Deister Perú», base Training IGES)
- Facturas de compra: menú Gestión › Compras › Facturas › Facturas. Ficha «FACTURAS DE COMPRAS»: tipo documento «FACTURA COMPRA ORIGEN ALBARAN», empresa 0 Deister Software, delegación CENTRAL, departamento COMPRAS, proveedor/tercero 00087 LABORATORIOS UNION, factura proveedor FC-012345, fecha 23-06-2026. Botones arriba: «Pasar a provisional», «Contabilizar» (y «Descontabilizar» cuando ya está contabilizada), «Nuevo». Estado del documento: Contabilizado / Validado.
- Al contabilizar se generan: asiento contable, cartera de efectos y registros fiscales (impuestos).
- Cartera de efectos: ficha «CARTERA DE EFECTOS › FC-012345»; pestañas Cartera de efectos, Historia efecto, Asientos contables. Clase Pagar, tipo de efecto TF (transferencia), moneda EUR, importe 1.815,00, vencimiento 23-07-2026, tercero 00087, estado Pendiente (PE), botón «Crear/Incorporar remesa» no usado. Es la deuda con el proveedor.
- Una factura con importe total 0 contabiliza y genera asiento y registro fiscal, pero NO genera cartera de efectos: no se puede remesar ni conciliar.
- Remesas: menú Finanzas › Cobros y Pagos › Remesas › Registro de remesas (el formador usa el atajo de buscador «C remesas»/lista «Remesas de cobros y pagos»). Se pulsa «Nuevo» y sale el formulario «REMESAS DE COBROS Y PAGOS»: Empresa 0 Deister Software, Fecha remesa y Fecha valor 23-06-2026, Cuenta financiera PRVCC0 (Previsiones, c/c Emp 0), Moneda EUR, Cambio 1,000000, Clase Pagar (para facturas de compra; Cobrar para ventas), Estado Abierto, Tipo remesa PSCTT «Pago transferencias (con Tesorería)». Se guarda con «Guardar». Resultado: remesa RM026-000018.
- Tipos de remesa disponibles solo si están parametrizados: Maestro de empresas (Finanzas › Maestros › Parametrización › Empresas) › empresa 0 › pestaña «Bancos propios» › banco PRVCC0 › pestaña «Remesas por cuenta». Allí aparecen CCHET (cobro cheque), CSCTT (cobro transferencia) y PSCTT (pago transferencia), estado Abierto. Si está vacío, la remesa no ofrece tipos.
- En la ficha de la remesa, pestaña inferior «Selección de efectos»: filtro por Tercero (00087), muestra el efecto id 90, clase Pagar, tipo TF, estado PE, importe 1.815,00, documento FC-012345. Botón «Agregar efectos» pasa el efecto a «Relación de efectos remesados» (total remesa 1.815,00). Si se agregan efectos de distinto tipo (cheque y TF) en la misma remesa no se puede evolucionar bien: mismo tipo de efecto en toda la remesa. Se pueden meter varias facturas/terceros en una remesa si comparten tipo.
- Botón «Evolucionar estado»: la remesa pasa de Abierto a Cerrado/CONTABILIZADO (banda morada «CONTABILIZADO»), con pestañas Información, Gestión remesas, Apuntes. «Retroceder» deshace.
- Asiento generado (ASIENTOS CONTABLES, tipo AC, estado Contabilizado): 2 líneas, documento FC-012345, cuenta 40000.00087 LABORATORIOS UNION al Debe 1.815,00 y cuenta 10000.00087 al Haber 1.815,00, descripción «Efecto ordenado de LABORATORIOS UNION». Botones «Abrir a provisional», «Copiar asiento».
- Tesorería generada: «MOVIMIENTOS DE TESORERÍA › PMICDT», cuenta financiera PRVCC0, posición Salida, importe -1.815,00 (es un pago), fecha operación 25-07-2026, operación financiera PMICDT «Pagos emitidos transferencias de crédito», clase de cartera Pagar. Menú Finanzas › Tesorería › Ops. corto plazo. La tesorería se cruza después con el extracto bancario en la conciliación.
- Circuito: factura → (contabilizar) asiento + cartera de efectos + registros fiscales → remesa (cobrar/pagar) → extracto bancario → conciliación bancaria.
- Periodos cerrados (problema típico de facturas de compra al contabilizar): Maestro de empresas › pestaña Ejercicio: ejercicio 2026 con 12 periodos contables; enero-junio estaban «Cerrado» y julio en adelante «Abierto». Si la fecha de la factura cae en un periodo cerrado no contabiliza: usar fechas de periodo abierto (desde julio). Para abrir periodos anteriores habría que borrar el ejercicio y recrearlo tras fijar bien el año de inicio de la empresa.
- Error «DOMICILIACIÓN BANCARIA NO INFORMADA» al contabilizar: las domiciliaciones bancarias del tercero no están parametrizadas; el grupo lo evitó usando forma de pago cheque. Facturas «origen pedido»: antes de cambiar el tipo de efecto hay que «Pasar a provisional»; en la pestaña de tipología/contabilización se ve el tipo de asiento: compras EPC, ventas FB (si falla contabilizar, revisa el tipo de documento/tipo de asiento).
- Otra: la ficha de una factura contabilizada muestra «Descontabilizar» (no contabilizar de nuevo).

## Mapa de capturas (imagen → qué muestra) y hotspots
- icon11-001.jpg: ficha factura compra FC-012345 con botón Contabilizar. hotspot {"x":84.7,"y":20.9,"w":4.6,"h":2.4,"etiqueta":"Contabilizar"}
- icon11-002.jpg: la misma factura ya contabilizada (botón Descontabilizar).
- icon11-003.jpg: cartera de efectos FC-012345 (clase Pagar, TF, 1.815).
- icon11-004.jpg: formulario Nueva remesa vacío (lista de remesas detrás).
- icon11-005.jpg: formulario remesa con desplegable de Tipo remesa PSCTT. hotspot en el tipo: {"x":33.6,"y":74.6,"w":16.8,"h":2.9,"etiqueta":"Tipo remesa PSCTT"}; botón guardar: {"x":61.8,"y":93.6,"w":5.8,"h":2.4,"etiqueta":"Guardar"}
- icon11-006.jpg: Maestro de empresas › Bancos propios › PRVCC0 › Remesas por cuenta. hotspot pestaña: {"x":61.2,"y":26.6,"w":7.2,"h":2.4,"etiqueta":"Remesas por cuenta"}
- icon11-007.jpg: remesa RM026-000018, pestaña Selección de efectos con el efecto 90. hotspot: {"x":64.2,"y":21,"w":5.5,"h":2.2,"etiqueta":"Agregar efectos"}
- icon11-008.jpg: remesa con efecto en Relación de efectos remesados (1.815). hotspot: {"x":77.7,"y":21,"w":6.6,"h":2.2,"etiqueta":"Evolucionar estado"}
- icon11-009.jpg: asiento AC generado (40000.00087 Debe / 10000.00087 Haber).
- icon11-010.jpg: movimiento de tesorería PMICDT -1.815.
- icon11-011.jpg: remesa CONTABILIZADO con sus efectos incluidos.
- icon11-012.jpg: Maestro de empresas › Ejercicio con periodos contables (enero-junio cerrados).
- icon11-013.jpg: factura de compra origen pedido (botones Pasar a provisional / Contabilizar).
- icon11-014.jpg: lista de facturas de compra.
- icon11-015.jpg: ventana de error «DOMICILIACIÓN BANCARIA NO INFORMADA».

## Reparto de ejercicios
1. Contabilizar una factura de compra y ver sus efectos (imágenes 001, 002, 003, 009 opcional) — incluye el caso importe 0.
2. Parametrizar los tipos de remesa de la cuenta financiera (006).
3. Crear una remesa de pago y agregar el efecto (004, 005, 007, 008).
4. Evolucionar la remesa: asiento y tesorería (008, 011, 009, 010) y qué viene después (extracto y conciliación, solo concepto).
5. Cuando no contabiliza ni remesa: periodos cerrados, domiciliación, tipo de efecto distinto (012, 013, 014, 015).
