# Asientos esperados, cálculos y trampas (Activos)

Fuente: `icon-activos.json` («avisos», «problemas», «aprendido»), `examenes/icon-activos.json`, `auditoria/redaccion_imp_act_avanzada.md`, commit 3555acb.

## Asientos
| Momento | Debe | Haber | Cuentas de la demo (grupo CAP1) |
|---|---|---|---|
| Contabilizar factura de activo (ordenador 1.200 + IVA 21 % 252) | inmovilizado 1.200,00 · IVA soportado 252,00 | proveedor 1.452,00 | 21600.00000 (un ordenador real: 217); IVA 47200.00000 |
| Amortización anual (contabilizar cuota) | dotación 300,00 | amortización acumulada 300,00 | 68100.00000 / 28160.00000 (reales: 681 / 2817) |
| Baja (VNC sin amortizar) | amortización acumulada + pérdida | inmovilizado | 28160.00000 · 67100.00000 / 21600.00000. Antes, la amortización pendiente hasta la fecha |
| Venta con beneficio (1 año, 1.000,00) | banco 1.000,00 · amort. acumulada 300,00 | inmovilizado 1.200,00 · beneficio 100,00 | 57200 · 28160.00000 / 21600.00000 · 77100.00000 (771) |
| Venta con pérdida (800,00) | banco 800,00 · amort. acumulada 300,00 · pérdida 100,00 | inmovilizado 1.200,00 | 67100.00000 (671) |
| Descontabilizar amortización | (inverso del asiento de amortización) | | las cuotas vuelven a Pendiente |
Los asientos de venta/baja son derivación de las reglas del PGC del curso (VNC, 671/771); los importes con cuentas concretas de la demo no se han verificado ejecutándolos (sin verificar: la demo compartida no permite probarlos).
Crear bien, elemento y componente **no genera asiento**.

## Cálculos de práctica
- Ordenador 1.200 / 4 años = 300 al año, 25 al mes; VNC tras 1 año 900; tras 2 años 600.
- Furgoneta 20.000, residual 2.000, 6 años: (20.000 − 2.000)/6 = 3.000; VNC a 2 años 14.000; a 4 años 8.000.
- Máquina 10.000, amortizado 6.000 (VNC 4.000): venta a 5.000 → +1.000 (771); a 3.000 → −1.000 (671); tirada → −4.000.
- Programa 4.000 al 33 % = 1.320/año (≈ 110/mes). Mostrador 1.480 al 10 % desde 01-05-2018: 245 días → 99,34. Componente 000002: 73,97 (45 días).
- Aspiradora: 600 − 5,57 = 594,43; venta 450 → −144,43.

## Trampas de la demo
- CAPASC, 0000001, 000002, 0FC000012, CAP1, CAPA y la familia 01.01.001352 son compartidos: solo mirar. No pulses «Contabilizar»/«Descontabilizar» ni lances procesos masivos.
- Solo existe el grupo contable CAP1: las cuentas son de instalaciones (21600/28160…), no de equipos informáticos.
- La captura de alta de bien (ES2130 de ALA) muestra el bloque «Cuentas» vacío; en CAPASC sale relleno (gris, de solo lectura).
- El menú «Compras» cuelga de «Gestión » en la demo de prácticas.
- Rutas de Gestión de v-1, v-2, v-3 y v-4 tomadas de los avisos del propio bloque (pendiente de reconfirmar en la demo, según la auditoría).
- El ejercicio debe estar dividido en periodos para contabilizar amortizaciones.
- La fecha de inicio de amortización la propone el ERP (primer día del mes siguiente): revisarla.
- Tipos contables: el artículo 13500620 es PROD, no INMOVILIZADO; no crearía activo.

## Errores típicos
| Síntoma | Respuesta |
|---|---|
| La factura contabiliza y no crea ficha | «Generación inmovilizado» en «No generar» → cambiarlo; si está bien, falta Bien o Serie en la familia |
| No sabes si sale al validar o contabilizar | Mira el indicador de la tipología (CAPA y FACT: al contabilizar) |
| No aparece «Contabilizar» | La factura no está validada |
| No aparece la pestaña «Componentes» tras validar | Normal con «En contabilización»: contabiliza |
| «Missing key in referenced table» | Falta la línea de «Valores de los elementos» |
| Proceso de amortización no arranca | Ejercicio sin dividir en periodos |
| % de amortización rechazado | Fuera de límites del código fiscal |
| Tras dividir no salen elementos | Revisa tipo, número, valor y serie (AUTO) |
| Esperabas asiento tras «Cambio de amortización» | No genera: solo recalcula el cuadro |
| Venta con resultado inesperado | Antes se contabiliza la amortización hasta la fecha: el VNC es el de ese día |
| Informes sin poder editar | Son de consulta; edita el componente |
| Elemento en dos bienes | Imposible; traspaso |

## Examen (16 preguntas en `examenes/icon-activos.json`)
Terreno no se amortiza; lineal resta el valor residual; primer año por días; cuenta puente de traspasos (una de las seis del grupo contable); el alta de un bien no genera asiento ni elementos; un elemento pertenece a un único bien; unidad mínima = componente; proveedor y factura de origen en el componente; varios sistemas (A, C, H) para contable y fiscal; amortización = 68x al debe / 28x al haber; ejercicio dividido en periodos; reparto por imputación programada o cuenta de explotación y centro del elemento; traspaso mueve elementos y genera apuntes; división reparte valor de adquisición, amortización acumulada y netos; antes de baja o venta se registra la amortización pendiente; «Control de integridad» compara mayor e inventario.

## Lecciones de sesiones (síntoma → causa → regla)
- **«Missing key in referenced table (f_cinmcval1)»**: guardaste los valores del componente antes que los del elemento. Orden: bien → elemento → valores del elemento → componente → valores del componente → cuadro.
- **Compra que crea (o no) activo**: la tipología CAPA «En contabilización» genera inmovilizado; FC «No generar»; el artículo 13500620 no crea activo (familia sin parámetros).
- **Amortización**: el proceso `cinmamor_contab` genera el asiento (y un contraasiento al descontabilizar); no lo lances en la demo compartida. El estado del cuadro es «Pendiente» (no «Normal») y la fecha de inicio es el mismo día de la alta. La ventana «Venta» de tu demo no pide cuenta de cobro (la de la captura sí).
- **Datos fuera de TUTORIAL**: los ejercicios usaban datos de otra base; se rehicieron con el bien CAPASC y la factura 0FC000012.
