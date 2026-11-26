# Revisión senior tras los comentarios de José María: Ventas › Configurar y workflow de compras

Fecha: 26-11-2026. Solo lectura: no se ha tocado ningún fichero de contenido.
Fuentes: `app/src/content/{etapas.ts, compras.json, ventas.json, video-workflow.ts, videoSeries.ts}`, `app/src/lib/progress.ts`, `_fuente/CODIGOS_ALUMNO.md`, `nueva/ventas/NOTAS_VENTAS.md` (capturas `hd/v01…v79`), `nueva/workflow/NOTAS_WORKFLOW.md` (capturas `w01…w35`) y la skill `erp-nuevo-compras` (`references/notas_tipos_documento.md`).
Prioridad: **GRAVE** (enseña algo que, repetido en un cliente, descuadra la contabilidad o rompe datos) · **IMPORTANTE** (incorrecto, incoherente o falta algo que un consultor necesita) · **MEJORA**.

---

## 0. Diagnóstico de los comentarios de JM

- **(a) «Ventas › Configurar se centra en el contador».** Tiene razón, y la causa es estructural más que de redacción. `ventas-documentos` sí crea tres tipologías (PD/AP/FP), pero con menos campos y menos explicación que `compras-tipos`. **Lo más rico de la configuración de ventas está escondido en Operar**: `ventas-1` crea A{INI} (21 campos explicados) y F{INI}, y `ventas-2` crea O{INI}, PV{INI} y A{INI}2. En el menú de Configurar solo se ve un bloque de cliente y uno de documentos, y el primer apartado es el numerador.
- **(b) «No hay un punto de Configurar para el workflow».** Correcto: en `etapas.ts`, `compras-workflow` está en la etapa `operar` «Aprobar pedidos: workflow», y sus seis primeras partes son configuración pura. Propuesta en el §3.
- **(c) Mejorar todos los puntos.** Abajo van las faltas por bloque y los errores funcionales y contables (§4). Hay uno GRAVE en `ventas-1`: el ingreso se contabiliza dos veces.

---

## 1. `compras-tipos` frente a `ventas-documentos`

Leyenda de «¿Hay fuente?»: **N** = está en NOTAS_VENTAS.md o en una captura vNN · **J** = ya está en otro bloque de ventas.json (ventas-1 o ventas-2), así que se puede reaprovechar · **D** = hay que ir a la demo (se dice el objeto probable).

| # | Concepto / campo | En compras-tipos | En ventas-documentos | Hueco | ¿Hay fuente? |
|---|---|---|---|---|---|
| 1 | Ciclo completo con **oferta** (primer documento, sin origen) | Sí: OC{INI} › PC{INI} › AO{INI} › FC{INI} | No: empieza en el pedido. La oferta O{INI} solo sale en `ventas-2` (Operar) | Falta la tipología de oferta, o al menos explicarla, en Configurar | **J** `ventas-2-tipologia-oferta`; **N** serie OV en v20. Ficha `gvenofed` sin captura → **D** (`gvenofed`, copia de OV) |
| 2 | Numerador `gsernumh` (Rotura, máscara, contadores) | Sí | Sí, y con más detalle (Línea (n), contadores) | — | **N** v20–v23 |
| 3 | **Numeración fiscal** (`cdocnumh`, series con **Control cronológico**) | Una frase | Una frase | En ventas es una obligación legal: las facturas emitidas van correlativas y con fechas en orden. En la demo, el control cronológico está **marcado solo en las series fiscales de venta** (FVE, FVN, FVR, FVS, RV*) | Skill `notas_tipos_documento.md` §2b, captura `13_series_fiscales_cdocnumh_rejilla`. Ficha de una serie FV* → **D** (`cdocnumh`) |
| 4 | **Clases de pedido** (Tipo: Normal / Reposición / Programación / Muestras) | Sí | Solo «Normal / Activo», sin explicarlo | Falta | Opciones de venta no anotadas → **D** (`gvenpedd`, desplegable «Tipo») |
| 5 | Tabla origen + **Copiar líneas** (Sí / Validar / No) | Sí | Sí, con las ayudas literales | — | **N** v27 |
| 6 | **Actualizar origen** con un ejemplo de servicio parcial (pides 10, recibes 4, quedan 6) | Sí | Solo lo define | Falta el ejemplo numérico (pedido 10, se sirven 4, quedan 6 por servir y el pedido no pasa a «Servido») y falta **Restando**, que sirve para abonos y devoluciones | **N** v27 (ayudas de Sumando / Restando / No) |
| 7 | **Relación contable del tercero** en la tipología | Sí (Relación proveedor) | Solo como campo de FP y una nota en «Enlazar» | Falta explicar que la «Relación cliente» CLI de la tipología decide la cuenta 430 del asiento | **N** v35 (PDCP Impuestos), v28 (APCP Valoración), §4.4 (FPCP) |
| 8 | **Valoración** (Valorar, Precio tarifa, Fecha valoración, Descuentos especiales, Valoración inventario) | Valorar y Valoración inventario | Solo «Valorar: Tarifa» | Falta. Además está ligado al error E2 (con Valorar = Tarifa, la línea copiada sale a 50,00) | **N** §4.2 (Documento / Precio / sí / sí), v28; **J** `ventas-1-tipologia-albaran` (Precio tarifa, Valoración inventario, Orden) |
| 9 | **Movimiento de stock** (Entrada / Salida, cuentas logísticas) | Sí, explica NSAL y DISP | Nombra DISP › NSAL y «Salida» en una nota | Falta decir en una frase que la salida resta del stock disponible | **N** v26, v31 |
| 10 | **Suministro / Expedición albarán** | Explica «Suministro» | «Clase de expedición: Albarán», sin explicar | Falta: qué diferencia hay entre albarán y expedición, y por qué la factura tiene como origen «Expediciones» | Opciones sin anotar → **D** (`gvenmovd`, «Expedición albarán») |
| 11 | **Abono** (devolución) | Sí (campo Abono) | No | Falta | **D** (`gvenmovd` / `gvenfacd`, campo Abono; en compras las opciones son Sí, No y Anulación) |
| 12 | **Contabilizar el albarán**: plantilla y cuentas | Sí: 60000 al debe y 40090 al haber, o vacío | «Vacíos: no contabiliza» y una nota sobre AV | Falta explicar qué hace AV (430**9** «facturas pendientes de formalizar» contra 700) y que entonces la factura tiene que saldar la 4309 (FVOA). Hoy `ventas-1` lo enseña mal (§4 G1) | **J** ventas-1 (AV, 43090, FVOA); líneas de las plantillas → **D** (`gconasih`: AV y FVOA) |
| 13 | **Contabilizar la factura**: Tipo asiento y cuentas | Sí | Sí, pero el concepto pone «47000 al haber» sin el aviso del 477 | Añadir el aviso (§4 I1) | **N** v33, v71, v74 |
| 14 | **Datos contables / Tesorería** (interruptores) | No | Salen en «no» sin explicarlos | Falta qué activan | **N** v30, v33, v36; significado → **D** |
| 15 | Condición de selección SQL (`tipdoc IN (…)`) | No | Sí (mejor que compras) | — | **N** v32 |
| 16 | **Documento destino** (Albarán ventas, Tipo factura) | No | Sí (mejor que compras) | — | **N** v29, v35 |
| 17 | **Clase de factura** (completa, simplificada, rectificativa…) y **Clave impositiva / Calcular impuestos** | No | Solo como campo | Falta: es lo que decide el tipo de factura fiscal y si se calcula el IVA | **N** §4.2 (General / sí), §4.4 (Factura completa); opciones → **D** (`gvenfacd`, «Clase») |
| 18 | **Impresión del documento** | Sí (No / Sí / Preguntar) | No | Falta | La caja existe (§4.2–4.4); valor → **D** |
| 19 | **Docflow de la tipología** (grafo de qué tipologías enlaza) | No en el JSON (sí en la skill: capturas 03, 04 y 16) | No | Es la mejor forma de enseñar los enlaces entre tipos: conviene en los dos módulos | La caja existe en PDCP, APCP y FPCP (§4.2–4.4), sin captura → **D** |
| 20 | **Catálogo de tipologías de la demo** (qué hay y para qué sirve cada una) | La skill tiene las rejillas (10 albaranes, 7 facturas) | No | Falta la rejilla de PED, POF, ACL2, AV, FV, FVOA… con su origen y su asiento | **D** (rejillas de `gvenpedd`, `gvenmovd` y `gvenfacd`) |
| 21 | **Rectificativa / abono de venta** (origen Facturas, Restando) | Hay un bloque de abono en Operar | No | Falta al menos la tipología | Series RV* en `cdocnumh` (skill §2b) → **D** (`gvenfacd`) |
| 22 | **Generar factura frente a Conformar**, y relación con Modalidad / Método de facturación | Hay un bloque propio (compras-generar-factura) | No | Falta | **N** v56 (Acciones › Generar factura, no se usó) → **D** para el proceso de facturación periódica |
| 23 | Campos de **workflow** en la tipología (Grupo validación, Circuito) | Vía compras-workflow | No | Opcional: una nota que remita al workflow de compras | **N** (cajas «Validaciones workflow» y «Circuito worflow» en §4.2) |
| 24 | «Nuevo como» para copiar una tipología | No existe en compras (NOTAS_WORKFLOW paso 6) | Sí | — | **N** v24 |

**Propuesta para (a).** Sin cambiar ids:
1. Añadir a `ventas-documentos` una parte nueva al principio, «Mapa de las tipologías de venta», con las 8 tipologías del módulo (PD/AP/FP; A{INI}/F{INI}; O{INI}/PV{INI}/A{INI}2). Para cada una: origen, destino, si contabiliza y en qué bloque se crea. Así el alumno ve en Configurar todo lo que se configura.
2. Mover el numerador al final del bloque o dejarlo como apartado corto. Hoy ocupa la primera impresión del bloque.
3. Completar PD/AP/FP con los conceptos 4, 6, 7, 8, 10, 11, 12, 14, 17 y 19, aprovechando los textos de `ventas-1` y `ventas-2`, que ya los tienen.
4. No mover partes de `ventas-1` o `ventas-2` a Configurar sin una migración del progreso (ver §3.4: el progreso guarda el índice global del paso dentro del bloque).

---

## 2. `ventas-cliente` frente a lo que un consultor configura del cliente

| Qué se configura | Dónde (ERP) | ¿Está en ventas-cliente? | Hueco / comentario | Fuente |
|---|---|---|---|---|
| Identidad del tercero: NIF, Tipo ID fiscal, País emisor, Categoría | `ctercero` › Terceros | Solo Categoría | Bien que no se recree, pero conviene una línea sobre el NIF y el Tipo ID: la factura electrónica y el SII lo exigen | **N** v03 |
| **Clave fiscal tercero** (Régimen general), Idioma, Compensación | `ctercero` › Más datos | No | Falta: la clave fiscal entra en el cálculo del IVA | **N** §2.1 (por defecto), `rects/v10` |
| Relación contable CLI › 430 | `ctercero` › Relaciones | Sí | Incoherente con ventas-1, que añade 43000.00000 genérica (§4 I3) | **N** v05, v06 |
| Dirección y **Zona impositiva** (ESCO) | `ctercero` › Direcciones | Solo una nota («Añadir direccion») | IMPORTANTE: la zona impositiva decide si la venta lleva IVA peninsular o es exenta o intracomunitaria (Canarias, UE). Remitir a `icon-impuestos` | **N** v07 |
| Pestaña **Impuestos** del tercero | `ctercero` › Impuestos | No | Falta | **D** (`ctercero`, pestaña Impuestos) |
| Condición de cobro (tipo de efecto y plazo) | `ctercero` › Condiciones de cobro | Sí | Falta por qué el vencimiento sale el 28-12 y no el 25-12: ¿días de pago del cliente? | **N** v08, v09; día de pago → **D** |
| **Datos bancarios y mandato SEPA** | `ctercero` › Datos bancarios / Mandato | No | IMPORTANTE: R{INI} es un **recibo domiciliado** (CODIGOS_ALUMNO) y sin IBAN y mandato del cliente no se puede remesar. Ya existe `cartera-mandato-sepa` en Carteras: basta con remitir a él o adelantar el IBAN | **J** (carteras.json `cartera-mandato-sepa-iban` / `-mandato`) |
| Maestro de clientes: Identificación, Información general, Facturación | `gcliente` | Sí, bien | — | **N** v12–v14 |
| Cobros (Tercero cobro, Dirección cobro) | `gcliente` › Cobros | Solo un aviso | Bien | **N** v15 |
| **Agente** del cliente | `gcliente` › Agente | Solo un aviso | MEJORA: hoy el pedido obliga a elegir A01 a mano. Por comprobar en la demo si poner el agente en el cliente lo propone en el pedido | **D** (`gcliente` › Agente) |
| **Riesgo** (límite de crédito, tiempo de cartera) | `gcliente` › Riesgo | Solo un aviso | IMPORTANTE para un consultor: el riesgo bloquea pedidos. Hay que explicar qué es aunque se deje vacío | **N** v16 |
| Datos financieros: Portes y Divisa (sí); descuento comercial, % pronto pago, mínimo pedido o facturación (no) | `gcliente` › Datos financieros | En parte | Faltan descuentos y pronto pago | **N** v17 |
| **Tarifas**: Grupo precio, descuentos por familia, descuentos generales, rápeles, márgenes | `gcliente` › Tarifas | Solo «vacío: el precio se teclea» | **Falta todo el equivalente a `compras-precios`** | **N** v18 (opciones RMS «RMS test» y 00002 «CLIENTE») |
| Logística, Auxiliares e Impresión del cliente | `gcliente` | No | MEJORA | Sin captura → **D** |
| **Cuenta de ventas (700)** e IVA del artículo | Artículo o familia (datos contables, clave impositiva) | No | IMPORTANTE: el alumno no sabe de dónde sale la 70000 ni el 21 %. ventas-1 dice «según los datos contables del artículo» | **D** (ficha del artículo 13500620: datos contables y clave impositiva) |

**¿Faltan los precios de venta?** Sí. Compras tiene `compras-precios` (lista de precios `gcom_pricelist` y grupo `gcom_pricegroup`); Ventas no tiene nada: el precio de 20,00 se teclea. Propuesta: un bloque nuevo **`ventas-precios`** «Preparar los precios de venta» en Ventas › Configurar, entre «El cliente» y «Los documentos de venta», con tres partes:
- lista de precios de venta con el artículo 13500620 a 20,00;
- grupo de precios de venta;
- asignar el grupo a C{INI} (pestaña Tarifas, v18) y comprobar que el pedido propone 20,00.

Objetos probables, por analogía con compras: `gven_pricelist` / `gven_pricegroup`, ruta «Gestión › Ventas › Maestros › Tarifas › Precios». **Por comprobar en demo**: ni el objeto ni la ruta están en las notas; el desplegable de v18 solo prueba que hay grupos (RMS, 00002). De paso, conviene probar si con el precio propuesto por tarifa desaparece el error E2 (línea copiada a 50,00 con Valorar = Tarifa): **por comprobar**.

---

## 3. Workflow: separar configuración y operación

### 3.1 Qué es configuración y qué es operación

| Parte actual (id, NO se cambia) | Naturaleza | Destino |
|---|---|---|
| `compras-workflow-menu` «Las piezas y dónde están» | Concepto y mapa de menús | **Nuevo bloque `compras-workflow-config`** (primera parte) |
| `compras-workflow-validacion` «Elegir la validación» | Configuración (maestro) | `compras-workflow-config` |
| `compras-workflow-grupo` «Crear el grupo de validaciones y su línea» | Configuración | `compras-workflow-config` |
| `compras-workflow-rol` «Crear el rol que autoriza» | Configuración | `compras-workflow-config` |
| `compras-workflow-circuito` «Crear el circuito…» | Configuración | `compras-workflow-config` |
| `compras-workflow-tipologia` «Enlazar el grupo a la tipología» | Configuración | `compras-workflow-config` |
| `compras-workflow-prueba` «Probar: el pedido se bloquea» | Operación | se queda en `compras-workflow` |
| `compras-workflow-autorizar` «Autorizar el pedido desde Gestionar» | Operación | se queda en `compras-workflow` |
| `compras-workflow-consulta` «Autorizar y Retroceder…» | Operación (consultas) | se queda en `compras-workflow` |

### 3.2 `etapas.ts` (propuesta)

```ts
compras: [
  { fase: 'configurar', titulo: 'Maestros de compra', … bloques: ['maestros-2', 'compras-1', 'compras-precios'] },
  { fase: 'configurar', titulo: 'Documentos', … bloques: ['compras-tipos'] },
  { fase: 'configurar', titulo: 'Aprobación de pedidos: workflow',
    que: 'Montas el circuito de aprobación: la comprobación que bloquea, quién autoriza, el recorrido y la tipología que lo activa.',
    bloques: ['compras-workflow-config'] },
  … (Operar igual) …
  { fase: 'operar', titulo: 'Aprobar pedidos: workflow',
    que: 'Con la aprobación ya montada, haces un pedido que se bloquea y lo autorizas.',
    bloques: ['compras-workflow'] },
],
```
Así JM encuentra el punto de menú «Aprobación de pedidos: workflow» en Configurar. Como la etapa de configurar va antes, el bloque de Operar solo se abre después de la configuración.

### 3.3 Orden de las partes en `compras-workflow-config` y momentos de vídeo

Orden recomendado: el del capítulo 2 del vídeo. Construye de abajo arriba y evita la vuelta atrás de «deja Código workflow vacío y ponlo después»:

| Orden | Parte | Momento actual (`MOMENTOS_SECCION_WORKFLOW`) | ¿Encaja? |
|---|---|---|---|
| 1 | `compras-workflow-menu` | cap 1, 24–169 «qué es un workflow y dónde están las piezas» | Sí |
| 2 | `compras-workflow-rol` | cap 2, 9–57 | Sí |
| 3 | `compras-workflow-circuito` | cap 2, 57–215 | Sí |
| 4 | `compras-workflow-validacion` | cap 2, 247–290 «la validación del grupo» | **Por comprobar.** La escena se titula «La validación del grupo»: por el título parece el alta de la línea 36 dentro del grupo («Validaciones por grupo»), no la consulta del Maestro de validaciones. Si es así, el momento va a `compras-workflow-grupo` (que pasaría a 215–290) y `-validacion` se quedaría sin momento, o con cap 1, 52–91 «Cinco piezas». Hay que ver el clip `cap02.mp4` entre 247 y 290 |
| 5 | `compras-workflow-grupo` | cap 2, 215–247 | Sí (ver la fila anterior) |
| 6 | `compras-workflow-tipologia` | cap 2, 290–348 | Sí |

- Los momentos van por **id de parte** (`videoSeries.ts` → `momentosDeSeccion(id)`), no por bloque. Al mover las partes con el mismo id, **todos los momentos siguen funcionando sin tocar `video-workflow.ts`**.
- Opcional: rellenar `MOMENTOS_EJERCICIO_WORKFLOW` (hoy `{}`) con `'compras-workflow-config': [m(2, 0, 374, …)]` y `'compras-workflow': [m(3, 0, 352, …)]`, y actualizar el comentario «Cada tramo en una sola sección del bloque compras-workflow».
- La escena del cap 1 «Dónde se prueba: Compras» (118–142) cuadra mejor con la intro de Operar: se puede añadir a `compras-workflow-prueba` (la función `ordenar` ya admite varios tramos por parte).
- Con el orden nuevo, en `compras-workflow-grupo` el «Código workflow» se rellena al crear la línea. Hay que quitar el último paso de `-circuito` («Vuelve a Grupo de validaciones… rellena Código workflow»), su aviso «Punto de control» y la frase «Código workflow se deja vacío ahora» de `-grupo`.

### 3.4 Efectos secundarios que hay que resolver (sin cambiar ids)

1. **Progreso de los alumnos.** `progress.ts` guarda `pasos` como **índice global del paso dentro del bloque**. Las 6 partes que salen suman **22 pasos** (3+2+5+3+6+3) y las 3 que quedan, **23** (11+8+4). Si se sacan, los pasos 22–44 de `compras-workflow` pasan a ser 0–22, y quien ya llevaba progreso lo verá descolocado. Lo mismo pasa con `demo` (la checklist: los 6 primeros puntos son de configuración y los 3 últimos de operación). Hay dos salidas: una migración única en `progress.ts` para `compras-workflow` (índices < 22 → `compras-workflow-config` con el mismo índice; ≥ 22 → índice − 22; checklist < 6 → config, ≥ 6 → − 6), o aceptar y avisar del reinicio. Si se reordenan las partes dentro del bloque nuevo (§3.3), la migración tiene que aplicar también la permutación.
2. **Test, checklist y problemas** del bloque: repartirlos.
   - A config van: «¿Qué es un grupo de validaciones?», «¿Qué campo… enlaza…?», «¿Qué pasa si la línea… no tiene Código workflow?» y «¿Qué papel tiene la etapa Usuario?».
   - A operar van: la revalidación y Gestionar.
   - La nota del test guardada se queda en `compras-workflow`.
3. **Concepto de cada bloque.** El de config se queda con «las cinco piezas» y «Dónde: Finanzas › Maestros». El de operar abre con «requisito: haber hecho compras-workflow-config» y con el flujo Revalidación › Bloqueado › Gestionar › Autorizar.
4. `_fuente/CODIGOS_ALUMNO.md`: GW/RW/WF/PW se «crean en» `compras-workflow-config`.
5. Dar el nuevo bloque de alta en `compras.json` (`ejercicios`) con `numero` y `duracionMin` propios. El número visible sale de `etapas.ts`.

---

## 4. Errores e imprecisiones funcionales y contables

### GRAVE

**G1. `ventas-1`: el ingreso por ventas se contabiliza dos veces.**
- `ventas-1-contabilizar-albaran`, explicación: «al contabilizar tu albarán de 10 × 20,00 = 200,00, la plantilla AV carga la 43090 por el total contra ventas».
- `ventas-1-factura`, explicación: «FVOA "Factura venta origen albarán cont. total"… sí salda la 43090. Aquí se mantiene FV para que veas entero el asiento».
- Resultado: el albarán ya registró 4309 al debe y 700 al haber por 200,00. La factura con FV vuelve a registrar 430 al debe 242, 477/47000 al haber 42 y **700 al haber 200**. Las ventas quedan en 400,00 por una venta de 200,00 y la 4309 se queda con saldo para siempre.
- Corrección: o F{INI} usa la plantilla FVOA (que salda la 4309), o el albarán A{INI} no contabiliza. Hay que explicar el par «albarán contabilizado ⇒ factura "cont. total"». Esto es justo lo que compras explica bien con 60000/40090.
- Además, «carga la 43090 **por el total**» no aclara si es con IVA o sin él: en el albarán el IVA aún no se devenga, así que debería ser 200,00. **Por comprobar en demo**: líneas de las plantillas AV y FVOA en `gconasih`.

**G2. `compras-workflow-prueba`: enseña a saltarse la lógica del ERP.**
- Texto: «Si tu pedido sale "Validado", cambia el campo "Estado" a "Provisional" a mano y guarda (en la demo el Estado se puede cambiar a mano)».
- También carga las líneas importando un CSV directamente en «Líneas de pedidos».
- Es un parche de una demo rota (ficha genérica), pero está presentado como un recurso normal. Si un junior lo repite en un cliente:
  - cambia estados sin pasar por las validaciones;
  - mete líneas sin recalcular impuestos, totales ni workflow.
- Hay que marcar las dos cosas con un aviso de tipo «problema»: «Solo en esta demo. En un cliente nunca se cambia el Estado a mano ni se importan líneas a la tabla».

### IMPORTANTE

**I1. Cuenta del IVA repercutido sin aviso en Configurar y en los tests.**
- `ventas-documentos`, concepto: «La factura FP{INI} … genera el asiento: 43000 al debe por 242,00, **47000 al haber por 42,00**…», sin el aviso que sí llevan `ventas-pedido`, `ventas-1` y `ventas-2`.
- Además, el test de `ventas-pedido` da por correcta «43000 Debe 242,00 / 47000 Haber 42,00 / 70000 Haber 200,00».
- En el PGC el IVA repercutido va a la **477**. La demo usa la 47000, rotulada «Hacienda Pública, deudora por IVA» (v74).
- Hay que poner el aviso también en `ventas-documentos` y reformular el test: «47000 (en la demo; 477 en el plan contable)».

**I2. «Domiciliación bancaria» está mal explicada y la solución es incoherente.**
- Dónde: `ventas-cliente-cobro` (aviso), `ventas-pedido-contabilizar` (paso y aviso) y `ventas-1` (problema).
- Texto: «Domiciliación bancaria es la autorización para cobrar el recibo directamente en la cuenta del cliente». Eso es el **mandato SEPA del cliente**. El error dice «DOMICILIACION BANCARIA **DE LA EMPRESA** NO ENCONTRADA»: falta la cuenta bancaria propia de la empresa en la que se domicilian los cobros.
- En la demo el error salió con **TF (transferencia)**, no con un recibo domiciliado (NOTAS_VENTAS E3). Afirmar que «los tipos de efecto domiciliados, como tu R{INI}, la exigen» es una inferencia: **por comprobar en demo**.
- La solución (tipo de efecto EF «Al contado» con plazo P{INI} a 30 y 60 días) es contradictoria: un efecto al contado con vencimientos aplazados. Vale como parche de demo, pero hay que decirlo así. La solución real (dar de alta la domiciliación o banco propio de la empresa) está **por comprobar**: probablemente en el banco propio o en la empresa (bloque `tesoreria-1` «Preparar el banco»).

**I3. `ventas-1` contradice a `ventas-cliente` en la cuenta del cliente.**
- `ventas-cliente`: C{INI} tiene su subcuenta propia (43000.00901) y no se crea otra relación.
- `ventas-1-contabilizar-albaran`: manda añadir una relación CLI con «Cuenta 43000.00000 "Clientes (euros)"» (cuenta genérica) y usa la ruta «Gestión › Maestros › Terceros › Datos › Registro», distinta de la de ventas-cliente («Finanzas › Maestros › Terceros › Registro terceros»).
- Hay que unificar en la subcuenta propia y en una sola ruta.

**I4. La configuración de ventas vive en Operar.**
- `ventas-1` (A{INI}, F{INI}, comprobar el cliente) y `ventas-2` (O{INI}, PV{INI}, A{INI}2) son, en buena parte, configuración. Es la causa real del comentario (a). Ver la propuesta del §1.

**I5. `compras-workflow-rol`: «public» como aprobador.**
- Asignar el «Usuario público» al rol deja autorizar, en principio, a cualquiera: rompe la segregación de funciones, que es justo lo que el workflow pretende.
- NOTAS_WORKFLOW (d): «sin comprobar si limita a alguien en un entorno real». Hay que añadir un aviso: «Solo en la demo; en un cliente, usuarios nominales».

**I6. `compras-workflow`, concepto: el ejemplo no coincide con lo que se monta.**
- Texto: «Piensa en el jefe de una oficina que firma las compras de más de cierto importe…». La validación que se usa es la 36, «referencia de tercero no informada», que no tiene nada que ver con el importe.
- O se cambia el ejemplo, o se aclara que bloquear por importe necesitaría otra validación del maestro (**por comprobar en demo** si existe alguna por importe en `cworkflow_val_prog`).

**I7. Relación proveedor ACR o PRO: dos versiones distintas (compras-tipos frente a compras-workflow).**
- `compras-tipos` (PC{INI}, AO{INI}, FC{INI}): «Pon ACR: es la que pide la tipología. La deuda se anota luego por la relación PRO (40000)».
- `compras-workflow-tipologia` (PW{INI}): «Relación proveedor: Proveedores (PRO)», que es lo que se hizo en la demo (NOTAS_WORKFLOW paso 6). Las tipologías de la demo (PCSO, ACPC, FCOA) también usan «Proveedores» (skill §1, §3, §4).
- Contablemente, un proveedor de mercaderías va a la 400 (PRO) y un acreedor de servicios a la 410 (ACR). Que la tipología pida ACR y el asiento salga por PRO es, como poco, confuso.
- **Por comprobar en demo**: si «Relación proveedor» de `gcompedd`/`gcomfacd` admite PRO y con qué relación contabiliza la plantilla FC.

**I8. Momento de vídeo de `compras-workflow-validacion`.** Ver §3.3: por comprobar si 247–290 muestra el maestro o la línea del grupo.

### MEJORA

- **M1.** El vencimiento del 28-12 para «30 días» desde el 25-11 está sin explicar (`ventas-pedido-cobro`). Probablemente son días de pago del cliente o fecha valor: **por comprobar** (`ctercero` › Condiciones de cobro o `gcliente`).
- **M2.** `compras-workflow-prueba`: el número 0PW{INI}0001, tecleado a mano, no sigue la máscara #e#s#6n que enseña `compras-tipos` (saldría 0PC000xxx). Conviene decirlo para no confundir.
- **M3.** En el pedido de prueba, «Tipo efecto EF (Al contado) / Forma pago 30D» es incoherente. Mejor TF o RC con 30D, si la demo lo deja (**por comprobar**).
- **M4.** `compras-workflow-grupo`: la casilla «Manual» dice «déjala como viene» sin explicar nada. NOTAS (d): su efecto no se comprobó. Hay que decirlo así («no se ha comprobado qué cambia»).
- **M5.** `ventas-documentos-numerador`: añadir la numeración fiscal de venta con control cronológico (§1 fila 3).
- **M6.** `ventas-documentos-albaran`: explicar que el error E2 (importe 50,00 con Valorar = Tarifa) viene de la tipología y que el alumno lo encontrará en `ventas-pedido`.
- **M7.** `compras-workflow-tipologia`: «Stock planificado No» y «Tipo Normal» van sin explicar. Remitir a `compras-tipos`.
- **M8.** En el concepto de `compras-workflow` dice «Cuando el pedido se valida, el ERP ejecuta las comprobaciones», pero en la demo solo lo lanza «Revalidación». La frase de después lo aclara; mejor decirlo en la misma frase.

---

## 5. Qué hace falta ir a buscar a la demo (lista corta)

1. `gvenpedd`: opciones de «Tipo»; Docflow de PDCP.
2. `gvenmovd`: opciones de «Expedición albarán»; campo Abono; rejilla de tipologías.
3. `gvenfacd`: opciones de «Clase»; Abono; rejilla (FV, FVOA, rectificativa).
4. `gconasih`: líneas de las plantillas AV y FVOA (para G1).
5. `cdocnumh`: ficha de una serie fiscal FV* con control cronológico.
6. Tarifas de venta (lista y grupo, objeto probable `gven_pricelist` / `gven_pricegroup`) y asignarlas a C{INI}.
7. Domiciliación bancaria de la empresa: dónde se da de alta y si R{INI} la exige (I2).
8. `ctercero` › Impuestos y Datos bancarios; `gcliente` › Agente, Logística.
9. Artículo 13500620: datos contables (cuenta 700) y clave impositiva.
10. Vídeo `cap02.mp4`, 247–290: qué pantalla se ve (I8).
11. `cworkflow_val_prog`: ¿hay alguna validación por importe? (I6). Relación proveedor PRO o ACR en las tipologías de compra (I7).
