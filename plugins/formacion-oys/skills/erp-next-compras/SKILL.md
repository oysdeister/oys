---
name: erp-next-compras
description: "Compras en el ERP nuevo Deister Axional VNext (demo nextdemo.geasa.eu, base tutorial): maestros (tercero, proveedor, artículo, almacén), tarifas gcom_pricelist y gcom_pricegroup, numerador gsernumh y tipologías gcompedd, gcommovd y gcomfacd, oferta, pedido, albarán, contabilizar albarán, factura (registrar y conformar o generar desde el albarán), abono, stock, asientos esperados (60000, 40090, 47200, 40000) y trampas de la demo (CSV de líneas, Conformar solo en FCCL, sin CRC). Úsala siempre que haya que explicar, documentar, grabar, revisar o corregir el módulo Compras de la plataforma de formación, o cuando pregunten «¿qué asiento sale?», «¿por qué no contabiliza?» o «¿cómo se hace el pedido en la demo?»."
---

# Compras en el ERP nuevo (Axional VNext, demo nextdemo, base tutorial)

Esta skill es el mapa funcional del módulo **Compras** de «Practicando Axional Deister VNext»: qué se hace, en qué orden, con qué códigos del alumno, qué asiento sale y qué falla en la demo. Para **sacar capturas o automatizar el navegador** usa la skill `navegar-erp-next`; aquí no se repite. El inicio de sesión lo hace siempre el usuario.

## Circuito de un vistazo
Maestros → tarifa → numerador y tipologías → **oferta** (`gcomofeh`) → **pedido** (`gcompedh`, líneas `gcompedl`) → **albarán** (`gcomalbh`) → contabilizar albarán → **factura** (`gcomfach`) → contabilizar factura → abono → stock. Trazabilidad con **Docflow** (`gdocflowh`, menú ⌄ junto a la estrella de la ficha).

## Orden de la plataforma (etapas.ts, módulo `compras`)
| Fase | Etapa | Bloques (id) |
|---|---|---|
| Configurar | Maestros de compra | `maestros-2`, `compras-1`, `compras-precios` |
| Configurar | Documentos | `compras-tipos` |
| Configurar | Aprobación de pedidos | `compras-workflow-config` (ver skill `erp-next-workflow`) |
| Operar | Comprar | `compras-3`, `compras-2`, `compras-albaran-contabilizar`, `compras-factura`, `compras-generar-factura` |
| Operar | Facturas que generan asientos | `icon-contabilidad-v-1` a `-4` (módulo de contabilidad) |
| Operar | Devolver y controlar stock | `compras-abono-devolucion`, `maestros-3` |
| Operar | Aprobar pedidos: workflow | `compras-workflow` (ver skill `erp-next-workflow`) |

Detalle paso a paso, campos y errores de cada bloque: `references/bloques_compras.md` (13 bloques, con la fuente de cada dato).

## Códigos del alumno (caso continuo)
Iniciales de **2 letras** ({INI}). Tercero/proveedor `T{INI}`, grupo de precios `G{INI}`, lista `TF{INI}`, tipologías `OC{INI}` (oferta), `PC{INI}` (pedido), `AO{INI}` (albarán con origen) y `FC{INI}` (factura), todas de **4 caracteres como máximo**; artículo de la compra `13500620` (6000-2RS ISB, del propio catálogo de la demo), artículo de aprendizaje `ROD{INI}`, almacén `ALM{INI}`, cuenta logística `RS{INI}`, cliente `C{INI}` con efecto `R{INI}` y plazo `P{INI}` (los usa Ventas). Convención completa: `_fuente/CODIGOS_ALUMNO.md` del repo.
Cifras del caso: 10 uds × 12,50 = 125,00 + IVA 21 % 26,25 = **151,25**.

## Reglas clave (con su porqué)
- **Numeración**: Gestión › Maestros › Auxiliares › Numerador de documentos (`gsernumh`). Rotura `#e#s`, máscara `#e#s#6n` (0AC000001), sin año; la numeración fiscal va aparte en `cdocnumh`. Los alumnos **solo leen** series OC, PC, AC y FC: en tutorial la «Rotura» es obligatoria y no editable, así que no se crean series nuevas.
- **Tarifas**: modelo nuevo `gcom_pricelist` (fechas por línea, escalados por cantidad mínima, dto 1-3) + `gcom_pricegroup` (orden, condición, divisa, lista) + `gcom_pricelist_cond`. El proveedor (`gproveed`, Datos financieros › pestaña Tarifas) apunta a un **grupo**, no a una lista. Descuentos: `gcom_discgroup`/`gcom_disclist`. El modelo clásico sigue en el menú pero sus tablas no existen en la demo. Ver `references/notas_tarifas.md`.
- **Tipologías**: pedidos `gcompedd`, albaranes `gcommovd`, facturas `gcomfacd` (con tolerancias albarán-factura). Se enlazan con «Tabla origen»: pedido ← oferta, albarán ← pedido, factura ← suministros (albaranes); «Copiar líneas» Sí y «Actualización tabla origen» Sumando. «Relación proveedor» es obligatoria (ACR); si falta: «Hay errores en los datos del formulario». Ver `references/notas_tipos_documento.md`.
- **Relaciones contables del tercero**: ACR (41000) y PRO (40000). La factura FC contabiliza con PRO: sin ella sale «Cuenta tercero [T{INI}] no existente para relación: [PRO]».
- **Descuentos del proveedor a 0**: descuentos 1/2/3 y % pronto pago vienen vacíos; si se quedan así la factura no contabiliza («Cannot invoke Object.toString() because n is null») y no se arregla sobre la factura: se corrige en el proveedor y se genera otra.
- **Conformar depende de la tipología de factura** (`gcomfacd`): la **FCCL «Factura Claude»** sí trae en el desplegable ⌄ del título las opciones de Conformar (diálogo con albaranes pendientes → «Conformar» → toast Éxito → albarán «Facturado»). Las facturas **FC/FCOA** no las traen: ahí el camino es albarán › Acciones › **Generar factura**. Explica Conformar solo si la tipología lo tiene. Comprobado el 17-11-2026.
- **No hay CRC** (control albarán-factura) como en el ERP antiguo: lo hacen los datos de control, los bloqueos y validaciones de workflow, la comparación importe declarado/calculado y el informe `gcomfach_dif_albaran` («Diferencias entre albaranes y facturas», Compras › Facturas › Situación). La factura generada sale **Validada** si el importe coincide; en la demo una diferencia de 0,50 **no** la bloquea.
- **Workflow**: Gestionar (`*_vtabsel_workflow`), Autorizar (`*_awk`), Retroceder (`*_rwk`), pero en la demo Autorizar y Retroceder solo listan. Detalle en `erp-next-workflow`.

## Asientos esperados (diario DC, Compras)
| Momento | Líneas |
|---|---|
| Albarán contabilizado | 60000 Compras de mercancías **D** · 40090 Proveedores, facturas pendientes de recibir **H** (mismo importe; con el albarán del alumno, 125,00) |
| Factura registrada y conformada (camino A, albarán sin contabilizar) | 60000 **D** 125,00 · 47200 **D** 26,25 · 40000.T{INI} **H** 151,25 (3 líneas, cuadre 0,00) |
| Factura generada desde albarán contabilizado (camino B) | 40000.<tercero> **H** · 47200 **D** · 60000 **D** · 40090 **D** · 60000 **H** (5 líneas; la 40090 vuelve a cero: el asiento salda el del albarán). Ejemplo de la demo, 4 uds: H 60,50 · IVA D 10,50 · 60000 D 50 · 40090 D 50 · 60000 H 50 (total 110,50) |
Efecto neto idéntico en los dos caminos: gasto, IVA soportado y deuda. El rótulo de la 47200 en el plan de la demo es «HP, IVA exento» (el IVA del 21 % ESG va a esa cuenta). En la demo, con la empresa 0, algún IVA salió a `00000.00000` (cuenta sin definir): ver trampas.

## Trampas de la demo (base tutorial)
- **Pedido genérico**: `gcompedh` abre un formulario genérico (título «Failed to parse the expression [${Pedidos compras}]»), sin numerador ni pestaña de líneas: el número se **teclea** (p. ej. 0PC{INI}01) y las líneas se cargan por **CSV** en Compras › Pedidos › «Líneas de pedidos» › ⋮ › Importar (delimitador «;», cabecera con nombres físicos `cabid;linrel;orden;codart;varlog;numlot;canped;udmcom;canpre;udmpre;precio;impnet;canser;dtoimp`; `cabid` = «Identificador pedido» que ves en la lista; unidad `UNI`; `dtoimp` 0, si no error 26865; `impnet` = cantidad × precio, p. ej. 10 × 4 = 40). Es un apaño solo de la demo: en un cliente real las líneas se añaden desde la ficha y el estado no se cambia a mano.
- **Importe neto «50,00»** (fallo visto en Ventas con «Valorar: Tarifa»): el servidor calcula el neto al guardar; si sale un neto inesperado comprueba precio y «Importe dto.» antes de seguir. En compras el precio **no** se rellena solo desde la tarifa: teclea Precio, **Precio con IVA** (12,50 × 1,21 = 15,125) e **Importe dto.** (0), obligatorios aunque no haya descuento.
- «Generar albaranes desde pedidos» no devuelve pedidos si `gcompedd.comalb` está vacío (PC, PCSO, PCOF, PREP, PCCL); la empresa DIS no puede hacer albaranes (almacén de otra empresa): se trabaja con la empresa 0, delegación CENTRAL, departamento COMPRAS, almacén 0.
- Artículos de tipo contable **VEN** dan error 24709 «cuenta no definida» al contabilizar; solo el **13500620** (PRODUCTO/PROD) contabiliza. No cambiar nunca su tipo: la demo es compartida.
- «ELResolver no manejó el tipo: null…» al escribir la cantidad de una línea: cierra el aviso, reescribe la cantidad y guarda.
- La ventana del asiento tras Contabilizar solo carga bien la primera vez (puede enseñar el asiento del albarán); la lista de albaranes y facturas queda en caché: recarga o aplica/quita un filtro. La casilla «Prevista de Asiento Contable» se marca con el input, no con el texto.
- «Nuevo como» no existe en la tipología de pedidos de compra (y da error 17049 en la factura rectificativa). El abono RECT no se puede completar en tutorial: «Líneas origen» sale vacío y no se enlaza la factura rectificada. No hay albarán de devolución.
- «Generar acuerdo» desde la oferta falla («gsernumh_getserie: Sin máscara… [gcomacuh] Cod.[ACC]»): falta el numerador de acuerdos. Los movimientos internos fallan igual con la serie MOV: el número del movimiento se teclea.
- Si el desplegable «Familia» del artículo sale vacío: teclea el código exacto y sal con Tab. Tras guardar, el artículo puede no verse en la primera página: Filtros › Descripción.
- Con TF (transferencia) la factura exige cuenta bancaria del tercero: «DOMICILIACIÓN BANCARIA NO INFORMADA» → Datos bancarios con un IBAN de ejemplo (nunca uno real) y Banco ES2100.
- Detalle de lo creado en la demo y diferencias con lo esperado: `references/circuito_creado.md`.

## Lecciones de las sesiones (síntoma → causa → regla)
- «No existe Conformar» (dicho antes) → se miró con FC normal → Conformar depende de `gcomfacd`: con FCCL sí está (⌄ del título); no afirmarlo ni negarlo sin decir la tipología.
- Importe de proveedor ≠ importe de factura y no se bloquea → el programa no bloquea por sí solo; la factura queda Bloqueada (3000) solo si una validación de workflow lo exige.
- Importar líneas por CSV: el `cabid` es el «Identificador del pedido», no el número; el Mac añade `.csv.txt` al nombre; la coma decimal es otra trampa del alumno (usar punto, sin verificar); pasos «Selecciona datos» y «Opciones importación» y el mapeado por nombre de columna, sin comprobar (sin verificar).
- Errores que solo salen al contabilizar (ACR sin PRO, domiciliación, `tipcon [VEN]`, numerador de acuerdos, «NO SE HAN GENERADO APUNTES» en almacén) → se reproducen con registros propios (CAP…) y se cancelan; los que no se pudieron grabar se rotulan «no grabado».
- El Docflow no muestra el asiento → se abre desde la factura (⌄ › Asientos contables). El pago al proveedor no está en los manuales: la plataforma enseña «efectos de la compra» (sin fuente para 40000/57200).
- Relación proveedor: las tipologías del alumno (OC/PC/AO/FC{INI}) llevan ACR, pero PW{INI} (workflow) lleva PRO, igual que PC estándar, PWCP y PWVD; PCCL y PCVL llevan ACR (ver `erp-next-workflow`).
- Con empresa 0 el stock del artículo 13500620 llega para ventas porque ALMACEN CENTRAL tiene 83 DISP (no hay stock negativo en la demo).

## Qué no inventar
Rutas, objetos y rótulos salen de las referencias. Lo no comprobado (Retroceder, Denegar/Retornar/Designar, efecto de la casilla «Manual», pedido real con ficha completa) se dice «sin verificar». No pegues documentación oficial de Deister: resume con tus palabras.

## References
- `bloques_compras.md`: los 13 bloques de compras.json con pasos, campos, errores y asiento (empieza por su índice).
- `mapa_erp_nuevo.md`: rutas de menú y objetos del ERP nuevo.
- `notas_circuito.md`, `notas_tarifas.md`, `notas_tipos_documento.md`: notas verificadas de circuito, tarifas y tipologías.
- `circuito_creado.md`: documentos creados en tutorial, asientos y diferencias con lo esperado.
- `indice_capturas_hd.md`: índice de capturas HD con rects para callouts.
