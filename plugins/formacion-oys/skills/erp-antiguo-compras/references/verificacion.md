## Verificación

Revisor independiente. Se leyeron enteros los informes `kb/v1_analisis.md`, `kb/v2_tramo1..5.md` y `kb/ESTADO.md`, y se contrastó todo dato de pantalla con fotogramas extraídos del vídeo original (1680×1048) con `ffmpeg -ss <s>` en `kb/verif/`. Ningún dato del guion procede solo de un informe.

### Método

1. Fotogramas exactos de cada dato (cifras, códigos, rutas, campos) y montajes para localizar los cambios de pantalla.
2. Para **cada uno de los 67 clips**: fotograma al inicio (+0,5 s), a la mitad y al final (−0,5 s), con el recorte y los rectángulos de zooms y callouts dibujados encima (`kb/verif/clips/<id>_{a,b,c}.jpg`). Cuando alguno de los tres caía en otra pantalla, en una carga, en una página desplazada o en un aviso, se recortó el tramo y se volvió a comprobar.
3. Validación automática: todos los clips apuntan a `../media/src/…mp4` existentes, el tramo cae dentro de la duración (v1 860 s, v2 6396 s), ningún clip pisa un tramo sucio, todos los rectángulos caen dentro del recorte, ningún recorte incluye la barra de Windows (y ≤ 1006) ni la de marcadores de Chrome (y ≥ 88 en pantallas de ERP), cada `clave` aparece en orden en la narración, y los iconos y tipos son los del motor. El JSON parsea y `npx tsc --noEmit` pasa.
4. Aviso de método: en los montajes con `fps=1/N` el instante real puede desviarse hasta N/2 s, así que **todos los límites de clip se fijaron con fotogramas exactos**, no con montajes.

### Datos comprobados en pantalla (segundo del vídeo)

| Dato | Dónde | Resultado |
|---|---|---|
| Ruta Compras › Maestros › Tarifas › Condiciones tarifados / Precios (Registro, Impresión, Informes) / Descuentos | v1 362, 505 | ✔ literal |
| Compras › Maestros › Documentos: Concursos, Ofertas, Formularios, Solicitudes, Acuerdos, Pedidos, Albaranes, Facturas, Anticipos, Clasificaciones, Bloqueos/Autorizaciones | v1 175 | ✔ |
| Compras › Pedidos: Registro, Registro b2b, e-Procurement (familias), e-Procurement (formularios), Impresión, Situación, Seguimiento, Work Flow, Procesos | v2 3072 | ✔ (el informe abreviaba «Regis…», «Proce…») |
| Compras › Albaranes: Registro, Impresión, Situación, Seguimiento, Contabilización, Work Flow, Procesos, Fuera factura, Costes asociados | v2 4713 | ✔ **nuevo**: el informe decía que no se veía la ruta |
| Compras › Facturas: Registro, Impresión, Impresión factura-albaranes, Situación, Seguimiento, Contabilización, Work Flow, Procesos | v2 5724 | ✔ |
| Tarifa COMPRA: EUR, 01-04-2015 → 31-08-2015, prioridad 0, lunes a viernes; COCHE A6 **35.000,000000** | v1 548 | ✔ |
| Tarifa G00003: vigente hasta 01-01-3000, siete días; línea COCHE A6 **2.000,000000** | v1 548 (Vista), 600 | ✔ |
| Descuentos generales de la línea: orden 5 y 10, DES «DESCUENTO COMERCIAL», **−10,00 / −12,00**, Porcentaje, Escalado, Precio base, Distribuidor, Factura | v1 600 | ✔ (la columna marcada es **Escandallo**, no «Escalando») |
| Delegación TGN «ALMACEN TARRAGONA»: Condiciones comerciales (Tarifa precios, Tarifa descuento, Descuentos familia) vacías | v2 110 | ✔ |
| Lista del campo: TARIFAS DE PRECIOS DE VENTAS: VENTA, VENTA02, VENTA02B | v2 82 | ✔ |
| Proveedor P00001 SEAT, Datos económicos, Tarifa precios COMPRA → **G00003**, fecha de modificación 11-12-2015 11:22:16 | v2 452, 464, 476 | ✔ |
| Permisos del grupo `public`, agrupación PEDIDOS DE COMPRAS, fila 8 Precios: Ver precios / Ver y modificar precios / No permitido | v2 4045 | ✔ (sin datos personales en el encuadre) |
| Tipos de pedido PC y PC2, series PC- y PC2- | v2 1072 | ✔ (se evita el error JRepException de 1060 s) |
| Ficha PC: serie PC-, estado Activo, Tipo workflow **PCW01 «Workflow Departamental»** | v2 1120 | ✔ |
| Serie PC-: Numerador ✔, **Justificación 6**, **Excluir separador ✔**, Control cronológico ☐, Renovación Perpetua, 15-04-2015 → 31-12-3000 | v2 1225 | ✔ |
| Máscaras: `[yy#mm#e]` (15#0401PC-), `[yy#e]` (1501PC-, 1501PC2-, 1502PC-, 1503PC-), `[yymm#e]` (150401PC-, **151201PC-**); Excluir separador marcado en las nueve series | v2 1157, 1225, 1525 | ✔ |
| Tabla origen (desplegable completo) | v2 1852,5 | ✔ ver corrección 4 |
| Fecha valoración: Fecha inicio / Fecha fin / Documento / No valorar | v2 1942 | ✔ |
| Tipo: Normal / Reposición / Programación / Muestras | v2 2400 | ✔ |
| Pedido **151201PC000003** creado y «Bloqueado 26000» al guardar | v2 3488, 3525 | ✔ |
| Línea COCHE A6 3 × **2.000** = 6.000,00 Validada; COCHE A4 4 × 0 → **1.000** = 4.000,00; órdenes 1 y 3 | v2 3622–3665, 3716–3725 | ✔ |
| Importe neto del pedido **10.000,00** y estado Validado | v2 4222 | ✔ |
| Botones del workflow del pedido | v2 4075–4200 | ✔ ver corrección 1 |
| Tipo RC: Tabla origen Pedidos, `gcompedh.estcab in ('V','P')`, Actualizar origen Sumando, NDIS → DISP, Valorar Tarifa | v2 4270 | ✔ |
| Albarán **201501RC-000002**, origen 151201PC000003, Validado | v2 4897 | ✔ |
| Agregar líneas: A6 3 y A4 4 → se cambia A4 a 3 → queda 1 pendiente y el pedido pasa a Parcial | v2 4996–5046 | ✔ |
| Albarán: A4 3 × 1.000 = 3.000; A6 3 × 2.000 = 6.000; total **9.000,00** | v2 5362 | ✔ |
| Pedido Parcial: A4 4 pedidas / 3 servidas «Parcial», A6 3/3 «Servida» | v2 5170 | ✔ |
| Asiento 63, diario DC, documento 201501RC-000002: **4009** «Proveedores, facturas pendientes de recibir o de formalizar» haber 9.000; **6000** debe 9.000 | v2 5430 | ✔ |
| Valorar del tipo de albarán: Tarifa / Última compra / Coste medio / No | v2 5648 | ✔ |
| Tipo FCA «Factura de Compra de Albaranes», serie FC-, Tabla origen Suministros, `gcommovh_s.estcab !='F'`, Tipo asiento FCA, Tipo workflow vacío | v2 5690 | ✔ |
| Factura nueva: «DEBE COMPLETAR (Factura proveedor)»; **FACT-1**; P00001 SEAT; Importe factura **8.750** (tecleado 8750 a 5839, formateado a 5842) | v2 5769, 5790, 5844 | ✔ |
| Conformar albaranes (7 opciones); fila 201501RC-000002, importe 9.000, con IVA **10.890,00**; Importe factura 8750 | v2 5866, 5895 | ✔ |
| Impuestos CN / NOR / IVA general, base **9.000**, cuota **1.890**; Importe factura 8.750, «Importe neto» 10.890 | v2 5935 | ✔ |
| «Forzar actualización de datos (Alt + R) (Shift + Ctrl + R)» | v2 6145 | ✔ |
| Factura «Bloqueada 3000», descripción **IMPORTE PROVEEDOR != IMPORTE FACTURA** | v2 6172 | ✔ ver corrección 2 |
| Importe corregido 10.890; albarán origen «Facturado» | v2 6232–6262 | ✔ |
| Contabilizar factura: ventana «Fecha contabilización 11-12-2015 · Ok» → «Contabilizada» | v2 6326, 6334 | ✔ **nuevo** |
| Asiento 64, documento FACT-1: 4000.000002 SEAT haber 10.890; 4720 debe 1.890; 4009 debe 9.000 | v2 6345 | ✔ |

### Correcciones respecto a los informes y a los vídeos originales

1. **Workflow del pedido.** El informe del tramo 4 hablaba de «26000 → 26010 OTRO WORKFLOW» y de unos botones «Enviar a Director General / >3000€ Autorizar». En los fotogramas se ve la secuencia completa: **>3000€ Autorizar** (motivo, 4094 s) → **Aprobar Jefe de Central** (4104) → **Aprobar Director General** (4112) → **Aprobación Comité** (4120) → **Confirmar Envío mail** (4128) → **Validado** con «Marcar como servida» (4200). Coincide con el audio (1:08:08). Se presenta como parametrización propia de esa instalación.
2. **Error 3000.** El informe del tramo 5 decía que el mensaje no se veía en ningún fotograma. Sí se ve: Estado «Bloqueada 3000» y la descripción «IMPORTE PROVEEDOR != IMPORTE FACTURA» (6172 s). Se usa como evidencia.
3. **El pedido nace bloqueado** al guardar la cabecera (3488 s), antes de pulsar nada más. No es consecuencia de pulsar Validar, como sugería el informe.
4. **Tabla origen** del tipo de pedido admite 11 valores (Oferta compras, Pedido compras, Acuerdos marco, Órdenes de trabajo, Pedido ventas, Solicitud compras, Orden producción, Acuerdos de ventas, Descuento general, Descuento familia, Ninguna). El informe solo citaba dos, y en clase solo se explican esos dos.
5. **COCHE A6, 35.000 frente a 2.000.** Ningún original lo comenta. Se presenta como dos tarifas distintas con datos de demo (COMPRA caducada, G00003 vigente) y se fija 2.000 como precio del ejemplo, que es el que propone después el pedido (3622 s).
6. **Delegación.** v1 afirma que la delegación lleva tarifa de compra y de venta; v2 lo rectifica (solo venta). El guion enseña la versión correcta y lo dice de forma explícita (escena `correccion-delegacion`).
7. **Descuentos escalados.** Se ven −10 % y −12 % en la línea del A6, pero el pedido sale a 3 × 2.000 = 6.000 sin descuento. Las fuentes no explican por qué (puede ser el umbral del escalado o la liquidación en factura). El guion lo señala sin afirmar el mecanismo, y el cálculo de 1.800 se marca como ejemplo ilustrativo.
8. **Justificación 6.** El formador dice «PC guion 0000001» (7 cifras). Son 6 cifras, y el guion queda fuera por «Excluir separador»: el número real es 151201PC000003.
9. **10.990 → 10.890.** La transcripción dice 10.990; el ERP muestra 10.890,00 (9.000 + 21 %).
10. **8.750.** Es un importe puesto a propósito por el formador para provocar el control; el guion lo explica así.
11. «Escandallo» (no «Escalando»); «#e» (no «arroba e») en las máscaras; «FACT-1», «Factura de Compra de Albaranes» y demás rótulos, literales de pantalla.
12. Tiempos ajustados frente a los informes: la lista de direcciones del proveedor está abierta en 3362–3373 s; el asiento 64 se ve en 6342–6356 s (de 6356 a 6378 se vuelve a ver el 63); la pantalla «Líneas de pedidos de compras» a 3650 s y la ventana en blanco a 3700 s quedan fuera.

### Exclusiones por privacidad y limpieza (ningún clip las toca; lo comprueba `gen.py`)

- **Rejilla «Usuarios»** con nombres y e-mails reales: v2 ≈3800–3960 s. El permiso de precios se enseña desde la pantalla de permisos del grupo (4036–4056 s), sin usuarios.
- **Pantalla de inicio de sesión** (usuario visible y contraseña enmascarada): v2 3075,5–3117 s. Detectada en esta revisión; no constaba en los informes.
- **Avisos de Gmail**: v2 1165–1199 s. **Google Calendar**: pestaña a 5659–5684 s y aviso emergente en la esquina inferior derecha a ≈5695–5705 s (detectado en esta revisión; el clip FCA acaba en 5694 s).
- **Errores de conexión** (ERR_CONNECTION_TIMED_OUT, Camtasia): v1 790–860 s y v2 955–1049 s. **JRepException**: v2 1058–1069,5 s.
- **Widget del grabador**: v2 ≥ 6389 s. **Pantallas en blanco o en carga**: v1 455–488, v2 3695–3705, 5383,6–5391,5, 6337–6339,5 s, entre otras.
- **Ventana de e-mail** con la dirección tecleada: v2 4140–4192 s.
- **Listas de terceros y proveedores** con nombres de apariencia personal (v2 436 s y 3338–3355 s): no se usan.
- Todos los recortes de pantalla del ERP empiezan en y = 88 (fuera quedan la barra de marcadores, con «Gmail O&S», y las pestañas) y acaban en y ≤ 1006 (fuera la barra de Windows y su reloj).
- Quedan visibles **códigos de usuario de login** (`<usuario>`, `<usuario>`, `<usuario>`…) en los bloques «Datos de control» y algún tooltip. No son nombres ni e-mails, pero si se quiere el máximo cuidado, se pueden difuminar en el render.

### Pasos que no se ven en los originales (marcados como SIN PANTALLA o solo citados)

Alta de una tarifa nueva (cabecera y líneas) · ruta de menú a Terceros y a Delegaciones (se abrieron tecleando la dirección) · alta de una serie y de su máscara · grabar cambios en el tipo de pedido (solo se consulta; el único cambio en vivo es Tabla origen a Solicitud compras) · asignar el workflow al tipo FCA · el cuadro del mensaje CRC · segundo albarán para el A4 pendiente · «Marcar como servido» · desconformar y descontabilizar · tipos de pedido interempresa, reposición, rappel y anticipos (solo conceptos).

### Dudoso o pendiente

- **Prioridad** y **días** de la tarifa: se ven, pero su efecto no se explica; el guion no lo afirma.
- **Campos a ocultar**: no consta si la casilla marcada oculta o muestra el campo.
- **Límite de 20 posiciones** del número y **regla del duplicado tras 999.999**: solo constan de palabra; el nombre del campo no se ve.
- **«#nomacc»**: rótulo sin traducir en la barra de la factura bloqueada (6169 s); no se nombra en la narración.
- **Duración y velocidad de clips**: tras `voz.py`, `gen.py` lee la duración real de cada escena en `video/out/plan.txt` y fija `velocidad` = (fin − inicio) / (duración − 0,3 − 0,8), entre 1 y 2,2 (36 escenas aceleradas, máximo 2,2; `alta-factura` se recortó a 5816–5845 s para no pasar de 2,2). Ningún clip queda cortado. Los `t` de los callouts por tiempo se recalculan como clipDesde + (segundo del vídeo − inicio) / velocidad. Comprobado con stills renderizados de val-paso1, val-paso2, agregar-lineas, alb-contabilizar y fac-obligatorio (`video/out/stills_vel/`).
- Los **callouts sincronizados por tiempo** (`t` calculado desde el segundo del vídeo con la velocidad del clip) están en `validar` (val-paso1/2), `agregar-lineas`, `alb-contabilizar`, `fac-obligatorio`, `fac-contabilizar` y `documento-origen`; si se cambia la velocidad, hay que recalcularlos (lo hace `gen.py`).

### Regenerar

Las fuentes del guion están en `kb/verif/gen/`: `escenas.py` (escenas, con «Qué se hace» y notas), `gen.py` (genera `guion.json`, valida y dibuja los fotogramas: `python3 gen.py --write --frames`) y `md.py` (este documento).
