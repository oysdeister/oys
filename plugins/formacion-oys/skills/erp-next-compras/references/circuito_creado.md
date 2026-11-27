# Circuito de compras creado en `tutorial` (14-11-2026)

Entorno: https://nextdemo.geasa.eu, base `tutorial`, usuario <usuario>. Capturas en `nueva/hd/` (50 a 99b); el índice con los rects está en `nueva/hd/INDICE.md`, sección «Circuito creado paso a paso».
Herramienta nueva: `nueva/tools/erp2.mjs`. Usa eventos reales de puppeteer: clickxy, clicktext, focus, type, key, selall, pick (elige una fila del desplegable), fields, buttons, menu, msgs y rect. Al conectar trae la pestaña al frente, porque con la pestaña oculta los desplegables y diálogos de Vuetify no se pintan. Con `PAGE=dbstudio` actúa sobre la pestaña de DBStudio (solo se han lanzado SELECT).

## Documentos creados

| Documento | Número | Tipo | Empresa / deleg. / almacén | Proveedor | Importes | Estado final |
|---|---|---|---|---|---|---|
| Pedido (cabecera) | id 11, nº «0» | PC | DIS / DIS001 / 0000 | 00001 | 0 | **Borrado** (no se le podían poner líneas; era nuestro) |
| Albarán 1 | **0AC000004** (cabid 27) | AC | 0 / CENTRAL / 0 | 00001 | 10 × 00000016 a 5,00 + 4 × 32515225 a 6,25 = **75,00** | Validado · Facturado · **sin contabilizar** (error de cuenta) |
| Factura 1 | **0FC000003** (cabid 17) | FCOA | 0 / CENTRAL | 00001, FRA-TUTORIAL-01 | Base 75,00 + IVA 21 % 15,75 = **90,75** | Validada · **sin contabilizar** (error de cuenta) |
| Albarán 2 | **0AC000005** (cabid 28) | AC | 0 / CENTRAL / 0 | 00001 | 10 × 13500620 (6000-2RS) a 4,00 = **40,00** | Validado · Facturado · **Contabilizado: asiento 16** (id_asiento 53, diario DC, 14-11-2026) |
| Factura 2 | **0FC000004** (cabid 18) | FCOA | 0 / CENTRAL | 00001, FRA-TUTORIAL-02 | Base 40,00 + IVA 8,40 = **48,40** | Validada · **Contabilizada: asiento 17** (id_asiento 55, lote 55, serie 0FC, numerador 4) |

Asiento 16 (albarán 0AC000005): 60000.00000 Compras a proveedor D 40,00 / 40090.00000 Compras pendiente de factura H 40,00.
Asiento 17 (factura 0FC000004): 40000.00000 Proveedores H 48,40 · **00000.00000 D 8,40 (IVA, cuenta sin definir: sale «Instrumental»)** · 60000 D 40,00 · 40090 D 40,00 (albarán origen) · 60000 H 40,00 (retroceso del albarán). Total 88,40 / 88,40.
Docflow: 0AC000005 (Facturado) → 0FC000004 (Validado). No hay pedido en la cadena.

## Diferencias con lo esperado (material para el vídeo)

1. **Pedido sin numerador ni líneas.** `gcompedh` se abre con el formulario genérico: unos 40 campos obligatorios, sin valores por defecto ni datos traídos del proveedor. Al guardar, el «Pedido» se queda con lo que se teclee («0»): **el numerador DISPC###### no se aplica**. `gcompedl` no tiene botón Nuevo (ni filtrando por el pedido), así que **no se pueden crear líneas ni validar el pedido** desde la interfaz. El pedido de prueba (id 11) se borró.
2. **«Generar albaranes desde pedidos» nunca devuelve pedidos.** La consulta del panel exige `gcompedd.comalb IS NOT NULL` (tipo de albarán a generar), y el campo está vacío en PC, PCSO, PCOF, PREP y PCCL. Para arreglarlo hay que tocar el maestro de tipos de pedido, cosa que no se ha hecho (capturas 67 y 89).
3. **La empresa DIS no puede hacer albaranes nuevos.** El único almacén de DIS001 (0000) tiene la empresa 0, y la validación del almacén da «Error en la validación» con DIS (captura 90). Por eso los albaranes y facturas nuevos son de la **empresa 0 (Deister Software), delegación CENTRAL, departamento COMPRAS, almacén 0**, que son los valores por defecto del usuario, y no de DIS como DISPC000007. Con la empresa 0, el ACPC no encuentra pedidos de origen (captura 91).
4. Como alternativa para enseñar un pedido, se usa **DISPC000001**, que ya existía (validado y pendiente, 5 × 00000016 a 5,00 de la tarifa, pestaña Tarifa con Precio tarifa 5,00). No se ha podido convertir en albarán.
5. **El precio NO se rellena solo desde la tarifa** en la línea del albarán. Ni Precio ni Precio tarifa se rellenan, aunque la cabecera tiene Grupo precio 00001 (→ lista COM). El diálogo de línea no ejecuta lógica de campo: hay que teclear Precio, **Precio con IVA** e **Importe dto.**, que son obligatorios (captura 92). El importe neto sí lo calcula el servidor al guardar. Se ha tecleado el precio de la tarifa COM (5,00, 6,25 y 4,00).
6. **El albarán 1 y la factura 1 no se pueden contabilizar.** Sale «tipast [AC/FCOA] tipcta [L] relaci [M] tipcon [VEN] cuenta no definida» (error ID 24709). Los artículos 00000016 y 32515225 son de tipo contable VEN, y para ese tipo no hay cuenta. Del COM, el único artículo con tipo contable PROD (que sí tiene cuentas) es 13500620, y por eso el circuito 2 usa ese artículo, con una sola línea. Antes de hoy, ningún albarán de la base estaba contabilizado.
7. **La factura sale ya validada** al generarla desde el albarán, porque el Importe factura declarado coincide con el total. **«Conformar» no aparece con la tipología FCOA** (Acciones solo tiene «Copiar» y el buscador no encuentra «conforma»); corregido el 17-11-2026: la tipología **FCCL** sí lo trae en el ⌄ del título (ver `bloques_compras.md`, bloque `compras-factura`). Con FCOA hace ese papel la comprobación entre el importe declarado y el calculado, más el informe `gcomfach_dif_albaran`.
8. En el asiento de la factura 2, el **IVA soportado va a la cuenta 00000.00000**: la cuenta de IVA no está parametrizada en la empresa 0.
9. Al contabilizar la factura 2, la ventana del asiento que se abre muestra el **asiento 16 del albarán**, no el 17 de la factura (captura 98f). El asiento correcto se ve en `casientos` id 55 (captura 98g).
10. **Workflow**: ningún documento quedó bloqueado (Validaciones 0). No hay paso de autorización que capturar.
11. Aviso de interfaz: cuando el albarán tiene líneas, al lado de «Validar» aparece **«Anular»**, que pide motivo. Se pulsó por error y se canceló en la confirmación, sin efecto.

## Qué queda en la base (todo creado hoy, en `tutorial`)
0AC000004, 0FC000003 (sin contabilizar, como ejemplo del error) y 0AC000005, 0FC000004 con los asientos 16 y 17. No se ha modificado ningún maestro (tarifas, proveedores, numeradores, tipos, almacenes ni cuentas) y no se ha borrado nada que ya existiera. Si se quiere limpiar el ejemplo del error: «Pasar a provisional» y borrar 0FC000003, y después anular 0AC000004.

## Circuito real conseguido el 16-11-2026 (vídeo v2)
- **Líneas de pedido**: la ficha de `gcompedh` es genérica y no tiene líneas; se cargan con Compras › Pedidos › «Líneas de pedidos» (`gcompedl`) › ⋮ › Importar: CSV con «;», cabecera con nombres físicos (`cabid;linrel;orden;codart;varlog;numlot;canped;udmcom;canpre;udmpre;precio;impnet;canser;dtoimp`), `cabid` = Identificador del pedido, unidad `UNI`, `dtoimp` 0 (si no, error 26865). El número del pedido se teclea (no aplica el numerador).
- **Configuración hecha**: PC → Tipo de albarán ACPC; ACPC → Copiar líneas «Validar», Actualizar origen «Sumando» (el pedido pasa a Servido), Tipo factura FCOA; IVA 21 % (ctax_type ESG) → cuenta 47200 (rótulo del plan «HP, IVA exento»).
- **Proveedor nuevo**: tercero (NIF, dirección, condición de pago, validar) + proveedor (GENERAL, EUR, grupo precio 00001). Descuentos 1/2/3 y pronto pago a 0: si quedan vacíos, la factura no contabiliza («Cannot invoke Object.toString() because n is null», gcomfach_Account1) y no se arregla en sitio.
- **Circuito del vídeo**: proveedor 00010 Rodamientos del Norte → pedido 0PC000003 → albarán 0AC000011 (asiento 60000 D / 40090 H) → factura 0FC000009 (40000.00010 H 48,40 · 47200 D 8,40 · 60000 D 40 · 40090 D 40 · 60000 H 40). En Docflow la factura contabilizada sigue mostrando «Validado».
- La ventana de asiento tras Contabilizar solo carga la primera vez; la lista de albaranes queda en caché (recargar). La casilla «Prevista» se marca con el input, no con el texto.
