---
name: erp-next-ventas
description: "Conocimiento funcional de Ventas en el ERP Deister Axional VNext (demo nextdemo.geasa.eu, base tutorial): preparar el cliente (tercero, relación CLI 43000, Maestro de clientes, condición de cobro, impuestos, banco), precios de venta (lista y grupo), tipologías de oferta/pedido/albarán/factura (PD{INI}, AP{INI}, FP{INI}, O{INI}, PV{INI}, A{INI}), y vender pedido→albarán→factura, albarán→factura u oferta→factura con su asiento, vencimiento, Docflow y stock del 13500620. Úsala siempre que expliques, enseñes, prepares o depures Ventas del curso, o salga «DOMICILIACION BANCARIA», «Importe neto 50,00», FVOA, «Conformar» o un albarán que no sale en la factura."
---

# Ventas en el ERP nuevo (Axional VNext, base tutorial)

Esta skill recoge lo verificado en la demo para el módulo «Gestión de ventas» de la plataforma (`app/src/content/ventas.json`, 7 bloques). Lo que no esté comprobado en la demo va marcado «(sin verificar)». La demo es compartida: los números de documento (0PV…, 0AV…, 0FV…) los pone el ERP y cambian por alumno; las capturas de la plataforma son de registros de captura (CCP, PDCP, APCP, FPCP) y el alumno usa los suyos con `{INI}` (2 letras).

## Caso continuo y códigos
- Cliente: **C{INI}** (tercero + cliente). Ventas **no lo crea**: lo comprueba y completa. Lo crearon Contabilidad básica, bloque «Dar de alta los datos básicos de contabilidad» (tercero y relación CLI, subcuenta 43000.00901 o la siguiente libre, tipo de efecto **R{INI}** «Recibo domiciliado» y plazo **P{INI}** 30/60 días), y Compras, bloque «Dar de alta los datos básicos de gestión» (cliente en Gestión y su condición de cobro R{INI} + P{INI}).
- Artículo **13500620** «6000-2RS ISB» (tipo contable PRODUCTO, IVA clave BOG 21 %) y agente **A01** «Agente 01»: ya existen en la demo.
- Venta del caso: 10 × 20,00 = 200,00 + IVA 42,00 = **242,00**, cobrada en dos vencimientos de 121,00 (30 y 60 días). Venta de práctica oferta→factura: 5 × 22,00 = 110,00 + 23,10 = **133,10** (no se suma al caso).
- Un único juego de seis tipologías, todas creadas en Configurar (máx. 4 caracteres; con 2 iniciales PD/PV/AP/FP quedan justos): `O{INI}` oferta, `PD{INI}` pedido sin origen, `PV{INI}` pedido desde oferta, `AP{INI}` albarán desde pedido (sin asiento), `A{INI}` albarán sin origen que contabiliza, `FP{INI}` factura (única). Precios: lista `LV{INI}` y grupo `GV{INI}` (máx. 12 caracteres).

## Orden de trabajo (etapas.ts, módulo `ventas`)
**Configurar**
1. El cliente → bloque `ventas-cliente` (`references/cliente_y_precios.md`).
2. Los precios de venta → `ventas-precios` (mismo fichero).
3. Los documentos → `ventas-tipologias-mapa` (mapa) y `ventas-documentos` (crear las seis) (`references/tipologias_y_documentos.md`).

**Operar**
4. Vender: pedido → albarán → factura → asiento → vencimiento → Docflow: `ventas-pedido`.
5. Otros circuitos: albarán → factura (`ventas-1`) y oferta → factura (`ventas-2`) (`references/circuito_de_venta.md`).

## Mapa de pantallas (ruta literal › objeto)
| Pantalla | Ruta | Objeto |
|---|---|---|
| Terceros | Finanzas › Maestros › Terceros › Registro terceros | `ctercero` |
| Maestro de clientes | Gestión › Maestros › Terceros › Clientes › Registro | `gcliente` |
| Numerador de documentos | Gestión › Maestros › Auxiliares › Numerador de documentos | `gsernumh` |
| Tipología de ofertas / pedidos / albaranes / facturas | Gestión › Ventas › Maestros › Documentos › Ofertas · Pedidos · Albaranes · Facturas | `gvenofed` · `gvenpedd` · `gvenmovd` · `gvenfacd` |
| Listas / Grupos de precios de venta | Gestión › Ventas › Maestros › Tarifas › Precios › Listas de precios · Grupos de precios | `gven_pricelist` · `gven_pricegroup` |
| Ofertas / Pedidos / Albaranes / Facturas | Gestión › Ventas › Ofertas › Ofertas · Pedidos › Pedidos · Albaranes › Albaranes · Facturas › Facturas | `gvenofeh` · `gvenpedh` (líneas `gvenpedl`) · `gvenalbh` (líneas `gvenalbl`) · `gvenfach` |
| Plantillas de asiento / Tipos contables | Gestión › Maestros › Contabilización › Asientos · Tipos | `gconasih` · `gcontipo` |
| Tipos de efecto | Finanzas › Cobros y Pagos › Maestros › Efectos › Tipos | `ctipoefe` |
| Numeración fiscal | Finanzas › Maestros › Auxiliares › Identificadores | `cdocnumh` |

Se abren con el menú lateral o con el buscador superior «Buscar» (Cmd/Ctrl + K) escribiendo el objeto; no se escribe la ruta en la barra de direcciones.

## Reglas clave (con su porqué)
- **Cada documento copia del anterior** por «Tabla origen» (pedido ← Oferta; albarán ← Pedidos de venta; factura ← Expediciones, que es como el ERP llama a los albaranes). Hacia delante, «Albarán ventas» (en el pedido) y «Tipo factura» (en el albarán) fijan la tipología siguiente. Sin esos enlaces los documentos no se encadenan: se rellenan al final, cuando ya existen AP{INI} y FP{INI}.
- **Solo la factura genera asiento** en el circuito del curso: 43000.00xxx D 242,00 · 47000.00000 H 42,00 · 70000.00000 H 200,00 (diario DV «Ventas», justificante AC). AP{INI} deja los dos asientos vacíos. El IVA lo añade el ERP («FACTURAS DE VENTA [Tax]»); la cuenta de ventas sale del tipo contable del artículo (PRODUCTO › 70000.00000) y la del cliente de la relación CLI.
- **Tipo efecto y Forma pago** salen de la condición de cobro del tercero, no del cliente. Hay que salir del campo Cliente con Tab para que los proponga.
- **Orden fijo en el albarán**: primero «Origen» (tu pedido), después «Cliente» (si no, al elegir el origen se vacía el cliente).
- **La factura no teclea líneas**: se «conforma» el albarán desde el desplegable ⌄ junto al título › «Albaranes de ventas a conformar». La condición de FP{INI} `tipdoc IN ('AP{INI}','A{INI}')` (apóstrofos rectos) limita qué albaranes salen.
- **Agente** es obligatorio en oferta y pedido y no se rellena solo (distinto del «Comercial» del cliente): A01.
- **Valida el tercero al final**: añadir o cambiar la condición de cobro lo devuelve a «Provisional» (workflow TER).
- No hay en la demo tipología de abono ni de factura rectificativa de venta: el módulo no tiene devoluciones.
- Nunca modifiques maestros de la demo (PED, POF, AV, FV, TV, plantillas, tipos): se copian con «Nuevo como» y se comprueban sin tocar.

## Trampas habituales (detalle en `references/trampas_y_errores.md`)
Importe neto 50,00 en la línea copiada al albarán · «DOMICILIACION BANCARIA DE LA EMPRESA NO ENCONTRADA.» al contabilizar (atajo: tipo efecto EF en la factura) · primera contabilización que solo muestra «Process gconasih_InsertCasientos» · FVOA da «Cannot invoke "Object.toString()"…» · albarán A{INI} contabilizado + factura = venta contada dos veces (descontabilizar el albarán antes) · A{INI} copiada de AV no guarda (créala en blanco) · oferta vencida no sale como origen · IVA repercutido en la 47000 (rótulo «Hacienda Pública, deudora por IVA») es configuración de la demo, no un modelo: en el PGC el IVA repercutido va a la 477 y la 4700 es lo que Hacienda debe al cliente (DATOS_DUDOSOS). En los asientos se deja lo que usa la demo (47000.00000).

## Stock del 13500620
En Compras se compran 10 unidades en ALMACEN CENTRAL (almacén 0). Ventas saca 25: 10 del pedido del caso (esas sí son las compradas), 10 del albarán A{INI} y 5 de la oferta. Las 15 de práctica salen del stock que la demo ya tenía (83 disponibles el 26-11-2026, compartidas por todos). Al validar un albarán, la mercancía pasa de la cuenta logística DISP a NSAL; si el ERP avisa de falta de stock, se avisa al formador.

## References
- `references/cliente_y_precios.md`: tercero, relación CLI, Maestro de clientes, condición de cobro, impuestos, banco/mandato, riesgo, listas y grupos de precios.
- `references/tipologias_y_documentos.md`: catálogo de la demo, numeración, creación de las seis tipologías campo a campo, plantillas de asiento y tipos contables, numeración fiscal.
- `references/circuito_de_venta.md`: pasos de los tres circuitos, asientos esperados, vencimientos, cartera, Docflow, stock.
- `references/trampas_y_errores.md`: errores literales con causa y solución.
- `references/fuentes_y_pendientes.md`: de dónde sale cada dato (bloque, fichero) y lo «sin verificar».
Para capturar pantallas del ERP (Chrome + puppeteer) usa la skill hermana de compras (`erp-next-compras`, sección «Capturas 4K»). Para el asiento y la cartera de cobro, `erp-next-contabilidad` y `erp-next-tesoreria`.
