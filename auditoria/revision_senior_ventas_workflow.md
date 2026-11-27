# Revisión senior: Ventas (cliente, documentos, pedido) y Compras (workflow)

Fecha: 25-11-2026. Alcance: commits 6677b29 (compras-workflow) y 3975cac (ventas-cliente, ventas-documentos, ventas-pedido, etapas.ts).
Fuentes contrastadas: `nueva/ventas/NOTAS_VENTAS.md`, `nueva/workflow/NOTAS_WORKFLOW.md`, `_fuente/CODIGOS_ALUMNO.md`, maestros-2 de `compras.json`, y 16 capturas con el punto dibujado encima (ventas-n-05, 12, 21, 27, 31, 36, 42, 49, 55, 56; cob-workflow-8, 11, 14, 24). Los demás puntos se comprobaron con números contra los rects de las notas: todos coinciden con un margen de ±1 %.
Validación: los dos JSON se cargan bien y `npm --prefix app run build` termina sin errores. Sin commit.

## Hallazgos

| # | Dónde | Hallazgo | Gravedad | ¿Corregido? |
|---|---|---|---|---|
| 1 | ventas-pedido (paso de la prevista, avisos, problemas, vencimientos, checklist) y ventas-cliente (problemas) | La solución del error «DOMICILIACION BANCARIA DE LA EMPRESA NO ENCONTRADA.» decía que se cambiaran «Tipo efecto» a EF **y** «Forma pago» a 30D. Eso convierte los dos vencimientos de 121,00 del caso (P{INI}) en uno de 242,00. Además contradice la fuente: en la demo solo se cambió el «Tipo efecto» (E3 de las notas). Como R{INI} es un recibo domiciliado, es muy probable que el alumno se encuentre este error. | Alta | Sí: ahora solo se cambia el «Tipo efecto» a EF y se mantiene P{INI}, con dos vencimientos de 121,00 de tipo EF (en 6 sitios). |
| 2 | ventas-pedido, parte «Ver la prevista y contabilizar» | Decía que la 47000 «Hacienda Pública, deudora por IVA» recoge el IVA de la venta y no avisaba de nada. En una venta, el IVA repercutido es una deuda con Hacienda (cuenta 477 del plan contable español). La 4700 es lo contrario: lo que Hacienda te debe. ventas-1 ya lo explicaba, pero el alumno ve antes ventas-pedido. | Media | Sí: se explica como IVA repercutido y se añade una nota «Fíjate» igual que la de ventas-1. |
| 3 | concepto de ventas-pedido | Frase rota: «Son además de las tipologías y de las tipologías PDCP…». | Media | Sí. |
| 4 | título de ventas-cliente | El título «Dar de alta un cliente» contradice el contenido y etapas.ts, que dicen que el cliente se comprueba y se completa sin crear otro. | Media | Sí: el título pasa a «Preparar el cliente». También se cambian las 2 referencias de ventas-pedido. El id no cambia. |
| 5 | ventas-cliente, problemas | El error de «Tipo ID fiscal» se atribuía al «alta de la relación». En las notas (E1) ocurre en el alta del tercero. | Baja | Sí. |
| 6 | ventas-documentos, numerador | «En esta base los numeradores son de solo lectura» da a entender una restricción del ERP. Las notas solo dicen que se consultaron sin tocarlos. | Baja | Sí: ahora dice «Aquí solo los lees». |
| 7 | ventas-pedido, columna «Tipo Efecto» de Vencimientos | El ejemplo ponía EF, pero el del alumno es R{INI}. | Baja | Sí. |
| 8 | ventas-1, campo «Cliente» | Ponía como ejemplo «C{INI} Tercero {INI}». «Tercero {INI}» es el nombre del proveedor T{INI}; el cliente C{INI} se llama «Cliente Maestros {INI}». | Baja | Sí. |
| 9 | ventas-1 y ventas-2 frente a etapas.ts | No hay contradicciones: los dos bloques venden a C{INI}, remiten a «Vender: pedido, albarán y factura» como venta del caso y usan R{INI}/P{INI}. ventas-1 repite la comprobación del cliente que ya hace ventas-cliente: sobra, pero no es un error. | Info | No hace falta. |
| 10 | ventas-1 | Su factura usa R{INI}, así que puede dar el mismo error de domiciliación, y el bloque no lo menciona. | Baja | No: está fuera del alcance de estos commits. Conviene añadir la misma nota. |
| 11 | compras-workflow, parte «Probar» | «La revalidación solo actúa sobre pedidos en Provisional» contradice las notas: la segunda revalidación se lanzó con el pedido Bloqueado y creó la evaluación y el token. También contradice la propia parte «Autorizar» («vuelve a ejecutar Revalidación»). | Media | Sí: ahora dice «Provisional o Bloqueado; con el pedido Validado no devuelve nada». |
| 12 | compras-workflow, tipología (4 sitios) | Afirmaba que «Nuevo como» no existe en las tipologías de la demo. ventas-documentos lo usa (captura v24, menú «Nuevo» › «Nuevo como»). | Media | Sí: se limita a la tipología de pedidos de compra («no se encontró») y se dice que, si aparece, se puede copiar PC{INI}. |
| 13 | compras-workflow, rol | «public … vale cualquier usuario»: las notas dicen expresamente que no se comprobó. | Media | Sí. |
| 14 | compras-workflow, rol | «APROBADOR PEDIDOS {INI}» ocupa 20 caracteres con 2 iniciales; con 3 iniciales pasa del máximo. | Baja | Sí: se añade la regla de las 2 primeras iniciales. |
| 15 | compras-workflow, aviso | El texto «No hemos confirmado en las notas…» deja ver una fuente interna al alumno. | Baja | Sí. |
| 16 | cob-workflow-11, punto «Etapas 1 Inicio, 2 Usuario, 3 Fin» | El recuadro dejaba fuera la fila 3 (Fin). | Baja | Sí: h pasa de 9,3 a 12,0. |
| 17 | ventas-n-42 | El paso dice «Marca su casilla», pero el punto está sobre el número del albarán (Expedición), no sobre la casilla. | Baja | No: es aceptable, porque el paso se centra en localizar la fila. |
| 18 | compras-workflow | Los códigos GW{INI}, RW{INI}, WF{INI}, PW{INI} y el pedido 0PW{INI}0001 no están en `_fuente/CODIGOS_ALUMNO.md`. No chocan con ningún código existente. | Media | No: hay que darlos de alta en CODIGOS_ALUMNO (está fuera de los JSON). |
| 19 | compras-workflow | Afirmaciones que no salen de NOTAS_WORKFLOW: Receptor 0 y Facturador 00010 en el pedido; la cabecera del CSV y que «Deja dtoimp a 0 o la línea no entra»; el modo de validación «Líneas»; los títulos y el orden de las consultas Autorizar («Pedidos de compras pendientes de autorización») y Retroceder («… autorizaciones emitidas», «del más reciente al más antiguo»); «que tu usuario podría autorizar». | Media | No: no se pueden verificar con las fuentes. Hay que confirmarlas en la demo o quitarlas. |
| 20 | compras-workflow | Importar la línea con un CSV que lleva el `cabid` interno es muy técnico para un junior. Es lo único que funcionó porque la ficha del pedido es genérica. | Info | No: es una limitación de la demo, y ya está explicada. |

## Comprobaciones conformes (sin cambios)
- Cifras: 10 × 20,00 = 200,00; IVA del 21 % = 42,00; total 242,00; dos vencimientos de 121,00 (P{INI} al 50 % / 50 %). Asiento: 43000 al debe 242,00 / 47000 al haber 42,00 / 70000 al haber 200,00, con cuadre 0. Diario DV, justificante AC, estado «Contabilizado».
- Rutas, rótulos y estados: coinciden con las notas. Ejemplos: «Añadir relacion», «CONDICIONES DE COBRO A CLIENTE», «Albaranes de ventas a conformar», «Servido o Facturado», «Facturado», «Validado», PE «Pendiente», «Circuito worflow».
- Tipologías: PD{INI}, AP{INI} y FP{INI} con sus series, orígenes, opciones «Copiar líneas» / «Sumando», asientos y la condición `tipdoc IN ('AP{INI}')`. Todo coincide con PDCP, APCP y FPCP de las notas.
- Workflow: piezas, rutas, códigos de la captura (GCP, RCP, WFCP, PWCP, 0PWCP0001), validación 36, Bloqueos V / Validaciones 1, botones de Acciones pendientes y estados Autorizado / Finalizado / Ejecutado.
- Códigos del alumno: C{INI} es el cliente del caso, con R{INI} + P{INI} de maestros-2 (coincide con maestros-2-cliente). Ventas no crea otro cliente.
- Puntos sobre las capturas: los 14 revisados a ojo caen sobre lo que dicen, salvo los n.º 16 (corregido) y 17 (aceptable).
