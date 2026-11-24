# Revisión senior de la fase 2

Alcance: `git diff 50a99a0 HEAD -- app/src/content` (commits 98e2f0e y 80585a6). Revisión en solo lectura. Contraste con `auditoria/guia_junior.md` (caso continuo, D1-D5), `_fuente/DATOS_DUDOSOS.md`, `_fuente/ESTADO.md`, `_fuente/manuales/ventas/manual.md` y el OCR de capturas `_fuente/campos-ocr/ocr.jsonl`.

**Veredicto: NO hay visto bueno todavía.** Las cifras del caso cuadran en todos los módulos. Los ids están intactos. Pero hay 4 errores graves: 2 de práctica en el caso final, 1 contable en Cartera y 1 respuesta de test mal planteada. Además hay varias correcciones medias de cuentas y de rutas.

---

## 1. Ids (comprobado con script)

Script: compara todos los `id` de texto de cada JSON de `app/src/content` (módulos, ejercicios, secciones, navegación, exámenes y glosario) entre `50a99a0` y `HEAD`.

- Ids en 50a99a0: 360. En HEAD: 436.
- **Perdidos: 0.** Nuevos: 76 (fundamentos-*, caso-final-*, cartera-cobro-parcial/descuento/impagado/mandato-*, compras-abono/albaran-contabilizar/generar-factura/workflow-*, contab-cierre-practica/mnemotecnicos-alta/plantilla-alta/saldos-iniciales-*, contabilidad-avanzada, fundamentos).
- Ningún id cambia de tipo de nodo ni se duplica.
- 35 ids cambian de fichero sin cambiar de nombre: `maestros-1*`, `maestros-v-1*` y `maestros-v-2*` pasan a icon-contabilidad.json. `maestros-2*` y `maestros-3*` pasan a compras.json. `icon-contabilidad-2*` y `icon-contabilidad-3*` pasan a contabilidad-avanzada.json. El progreso se guarda por id de ejercicio (`app/src/lib/progress.ts`, `ejercicios: {}`), así que el alumno no lo pierde.

**Resultado: OK.**

## 2. Cifras del caso (rehechas a mano)

| Comprobación | Cálculo | Resultado |
|---|---|---|
| Compra | 10 × 12,50 = 125,00; 125,00 × 21 % = 26,25; total 151,25 | OK |
| Venta | 10 × 20,00 = 200,00; × 21 % = 42,00; total 242,00; efectos 121,00 + 121,00 | OK |
| Banco | 3.000,00 − 151,25 − 3,50 − 10,00 + 121,00 + 121,00 = 3.077,25 | OK |
| IVA | 42,00 − 26,25 = 15,75 (303 del 4T, plazo 30-01-2027) | OK |
| Resultado | 200,00 − 125,00 − 3,50 − 10,00 = 61,50 | OK |
| Regularización | debe 700 200,00 = haber 600 125,00 + 626 13,50 + 129 61,50 | OK |
| Sumas y saldos antes de liquidar el IVA | deudores 3.077,25 + 125,00 + 13,50 + 26,25 = 3.242,00; acreedores 3.000,00 + 200,00 + 42,00 = 3.242,00 | OK |
| Balance | 3.077,25 = 3.000,00 + 61,50 + 15,75 | OK |
| Cierre y apertura | cierre: 100, 129 y 4750 al debe, 572 al haber 3.077,25; apertura: al revés | OK |
| Abono | −12,50 − 2,63 (12,50 × 21 % = 2,625) = −15,13 | OK |
| Prorrata | 26,25 × 80 % = 21,00; 210 × 80 % = 168 y 42 no deducible | OK |
| Activos | 1.200 / 4 = 300 al año, 25 al mes; valor neto 900; venta por 1.000 = 100 de beneficio; 1.200 + 252 = 1.452; mostrador 148 × 245 / 365 = 99,34 | OK |
| Diferencia de cambio (icon-cartera-v-2) | 118,50 × 3,719 = 440,70; × 3,683 = 436,44; 4,26 de ganancia en un pago | OK |

Un script recorre además las 76 expresiones «a ± b = c» de todos los JSON. No hay ningún error: solo «100 / 32 = 3,1», que es un redondeo.

Las cuentas del enunciado están bien en el texto: 472, 477 y 4750; 400/430, 572, 600/700, 626, 100 y 129; albarán contra la 40090; impagado con la 4315 al debe y la 572 al haber; cobro de remesa con la 572 al debe y la 430/431 al haber.

## 3. Correcciones, por gravedad

### ALTA

**A1. contabilidad-avanzada.json · `caso-final-cerrar` · pasos[0]** — No dice en qué empresa se regulariza, y la cifra del detalle no puede salir.
- Texto actual: «Operación 13 · 31-12 · Regulariza, cierra y abre 2027. Abre «Finanzas › Maestros › Cierres › Ejercicios contables», abre el ejercicio 2026 y pulsa «Regularización por ejercicio».» Detalle: «El estado pasa a Regularizado. La regularización lleva 70000.00000 Ventas 200,00 al debe…».
- Problema: las operaciones del caso están en la empresa 0 (D1), compartida por todos los alumnos. Si el alumno pulsa en la 0, regulariza el ejercicio de todos. Si pulsa en S{INI}, ya lo regularizó en `contab-cierre-practica`: el botón sale gris y S{INI} solo tiene los 5.000,00 de saldos iniciales, así que nunca verá 200,00 / 125,00 / 61,50.
- Propuesta: pasos[0].texto «Operación 13 · 31-12 · Repasa la regularización de tu caso sin lanzarla. Abre «Finanzas › Maestros › Cierres › Ejercicios contables» y localiza «Regularización por ejercicio». No la pulses en la empresa 0: su ejercicio es de todos los alumnos.» Detalle: «La regularizaste en tu empresa S{INI} en «Cerrar el ejercicio de tu empresa». Con las cifras del caso, la regularización llevaría 70000.00000 Ventas 200,00 al debe y, al haber, 60000.00000 125,00, la 626 Servicios bancarios 13,50 y la 129 61,50.» Ampliar la `nota` final: «No lances la regularización ni el cierre definitivo en la empresa 0».

**A2. contabilidad-avanzada.json · `caso-final-comprobar` · pasos[0] y [1], y `caso-final` · problemas[0]** — La comprobación en el ERP no puede salir.
- Texto actual: «Abre «Finanzas › Contabilidad General › Saldos › Saldos cuentas» y mira el banco 57200.00000.» / «Verás 3.077,25.» y «Mira el saldo del IVA: 47700.00000 con 42,00 y 47200.00000 con 26,25.»
- Problema: en la empresa 0 las cuentas 57200.00000, 47000.00000 y 47200.00000 las mueven todos los alumnos, así que el saldo no será 3.077,25 ni 42,00. Además la 47700.00000 no existe en la demo: el IVA repercutido va a la 47000.00000 (A4).
- Propuesta: pasos[0].texto «Abre «Finanzas › Contabilidad General › Extractos › Mayor de cuentas» con la cuenta 57200.00000 y filtra por tus documentos (tu diario {INI} y tus justificantes).» Detalle: «Suma solo tus movimientos: +3.000,00 − 151,25 − 3,50 − 10,00 + 121,00 + 121,00 = 3.077,25. El saldo total de la cuenta es otro, porque la empresa 0 la comparten todos los alumnos.» pasos[1]: «Mira tus apuntes de IVA: 47000.00000 (IVA repercutido en la demo) con 42,00 y 47200.00000 con 26,25.» Cambiar también problemas[0].solucion, que hoy remite a «Saldos cuentas».

**A3. carteras.json · `icon-cartera-v-6`** — Dice que la 10000.00087 hace de banco. Es falso y contradice al propio módulo.
- Textos actuales:
  - `concepto` (3.er párrafo): «En la base de formación del vídeo, la cuenta 100… hace de cuenta del banco, no de capital.»
  - `-asiento-tesoreria` campos[1].significado: «En esa base, la 100… hace de cuenta del banco, no de capital.» y campos[1].ejemplo: «10000.00087 (en esa base, cuenta de banco; no es capital)».
  - pasos[1].detalle: «en esa base la 10000.00087 hace de banco, no de capital».
  - checklist[4]: «En esa base hace de cuenta del banco, no de capital; en una empresa real sería la 401.»
  - aprendido[2]: «En esa base la 10000 hace de cuenta del banco, no es capital.»
  - test[2].explicacion: «Lo habitual es la 401 de efectos a pagar.»
- Pruebas:
  1. La cuenta lleva el sufijo del tercero (.00087), algo propio de una cuenta de tercero y no de un banco.
  2. En el mismo concepto pone «El banco (572) lo apunta después el movimiento de tesorería».
  3. En `icon-cartera-v-8` (tesoreria.json) pone «Al ordenar la remesa… todavía no toca el banco».
  4. En `icon-cartera-v-10-conciliar-contabilizar` pasos[5].detalle, al conciliar sale «Al debe, la 10000.00027, la cuenta que abonó la orden… Al haber, la 57900.00000 … la cuenta del banco».
  - Conclusión: la 10000.xxxxx es la cuenta puente de pagos ordenados de esa base, el equivalente a la 401, y no el banco.
- Propuesta: cambiar «hace de cuenta del banco, no de capital» por «hace de cuenta puente de pagos ordenados (lo que en el PGC sería la 401), no de capital ni de banco. El banco baja después, al conciliar» en las cinco frases. campos[1].ejemplo: «10000.00087 (en esa base, puente de pagos ordenados; no es capital ni banco)». test[2].explicacion: «… en la base del vídeo es la 10000.00087, una cuenta puente de pagos ordenados. En el PGC sería la 401 si pagas con efectos (pagarés). Con transferencia, el banco (572) se apunta al conciliar».
- Respuesta a la pregunta del encargo: en una remesa de pago, al ordenarla va al haber la cuenta puente que fije la acción (401 o similar). La 572 va al haber cuando el banco carga el pago (conciliación). El neto es 400 al debe y 572 al haber.

**A4. fundamentos.json · `fundamentos-2` · test[3]** — La respuesta marcada como correcta es falsa.
- Texto actual: pregunta «Tu cuenta 572 marca 5.000 € y el extracto del banco, 4.879 €. ¿Qué es probable?»; correcta = 1, «Hay un pago de 121 € que el banco aún no ha cargado».
- Problema: si el banco aún no ha cargado un pago que ya anotaste, el extracto sería mayor que la 572 (5.121), no menor.
- Propuesta: invertir los saldos en la pregunta: «Tu cuenta 572 marca 4.879 € y el extracto del banco, 5.000 €. ¿Qué es probable?». La opción, la respuesta correcta y la explicación se quedan igual.

### MEDIA

**M1. contabilidad-avanzada.json · `caso-final-vender` · `ruta` y pasos[0].texto** — La ruta lleva a las tipologías y no a los documentos.
- Texto actual: ruta Gestión › Ventas › Maestros › Documentos › Albaranes. Paso: «Abre «Gestión › Ventas › Maestros › Documentos › Albaranes»… Después abre «Gestión › Ventas › Maestros › Documentos › Facturas»».
- Esa ruta es la de las tipologías (`gvenmovd` y `gvenfacd` en ventas-1).
- Propuesta: ruta Gestión › Ventas › Albaranes › Albaranes. Paso: «Abre «Gestión › Ventas › Albaranes › Albaranes»… Después abre «Gestión › Ventas › Facturas › Facturas»» (rutas literales ya usadas en `ventas-1-albaran` y `ventas-1-factura`).

**M2. contabilidad-avanzada.json · `caso-final-vender` · pasos[0].detalle** — La venta queda contada dos veces en la demo.
- `ventas-1-factura` explicacion[3] avisa de que el albarán se contabiliza con AV (43090 contra 70000) y la factura con FV (43000 contra 70000), así que «la venta queda registrada dos veces». El caso da 70000 = 200,00 y beneficio 61,50, pero quien siga ventas-1 tal cual verá 400,00 en la 70000 y 200,00 colgados en la 43090.
- Añadir al detalle: «Ojo: en «Vender del albarán a la factura» la factura usa la plantilla FV y la venta queda dos veces (70000 con 400,00 y 43090 con 200,00 al debe). En tu caso cuenta la venta una sola vez: 200,00. Con una plantilla que salde la 43090 (FVOA), el asiento sería 43000.00901 242,00 al debe, y 47000.00000 42,00 y 43090 200,00 al haber.»

**M3. La cuenta del IVA repercutido de la demo es la 47000, no la 47700.**
- Evidencia: ventas-2-factura pasos[4].detalle copia el rótulo de la demo «47000.00000 Hacienda Pública, deudora por IVA». `_fuente/DATOS_DUDOSOS.md` y el OCR traen el mismo rótulo. La 47700 solo existe en el simulador (`app/src/erp/modelo.ts`).
- Correcciones:
  - fundamentos.json · `fundamentos-1-iva` · explicacion[2]: «(cuenta 477; la demo lo lleva a la 47700)» → «(cuenta 477; la demo lo lleva a la 47000.00000)».
  - contabilidad-avanzada.json · `caso-final-vender` pasos[0].detalle, `caso-final-banco-iva` pasos[1].detalle y `caso-final-comprobar` pasos[1]: «47700.00000» → «47000.00000 (IVA repercutido en la demo; 477 en el PGC)».
  - icon-contabilidad.json · `asientos-7` (concepto): «Con 47700 IVA repercutido» → «Con 47000 IVA repercutido (la cuenta de la demo)».
- Frase puente para ventas.json · `ventas-1-tipologia-factura` · explicacion[1]. Texto actual: «Fíjate: la demo lleva el IVA a la 47000. En el PGC, el plan contable español, el IVA repercutido va a la 477.» Propuesta: «Fíjate: la demo lleva el IVA repercutido a la 47000.00000, que su plan rotula «Hacienda Pública, deudora por IVA». En el PGC, el plan contable español, la 4700 es lo que Hacienda te debe, y el IVA que cobras va a la 477 «IVA repercutido». Es una configuración de la demo: no la copies.» Añade la misma frase puente en `ventas-2-factura` explicacion[3], porque su pasos[4].detalle enseña ese rótulo sin explicarlo.

**M4. contabilidad-avanzada.json · `caso-final-pagar-cobrar` · pasos[0].detalle** — El asiento del pago se presenta como uno solo, pero en el ERP son dos.
- Texto actual: «El asiento lleva 40000.T{INI} 151,25 y una cuenta del grupo 626 (servicios bancarios) 3,50 al debe, y 57200.00000 154,75 al haber.»
- Propuesta: «En el ERP lo ves en dos momentos. Al ordenar la remesa: 40000.T{INI} 151,25 al debe contra la cuenta puente de la acción. Al conciliar el cargo del banco: la cuenta puente al debe y 57200.00000 al haber, más la comisión (626 Servicios bancarios 3,50 al debe y 57200.00000 al haber). Neto: 400 151,25 y 626 3,50 al debe, 572 154,75 al haber.» (Coherente con A3, icon-cartera-v-8 y icon-cartera-v-10.)

**M5. Las «seis líneas» del extracto se cuentan con cinco términos.**
- `caso-final-banco-iva` pasos[0].detalle «termina en 3.077,25: 3.000,00 − 154,75 − 10,00 + 121,00 + 121,00» y `fundamentos-2-banco` explicacion[3]: esa suma tiene cinco términos, pero el texto habla de seis líneas.
- Propuesta: «3.000,00 − 151,25 − 3,50 − 10,00 + 121,00 + 121,00» (como en tesoreria-4).
- Añadir en `caso-final-comprar` (Operación 1): «La aportación es un asiento manual y no crea movimiento de tesorería. Para conciliar la línea de +3.000,00 del extracto, genera su tesorería con «Generar tesorería» al conciliar (bloque «Conciliar el banco»).»

**M6. contabilidad-avanzada.json · `caso-final-banco-iva` · pasos[1]** — Ruta del 303.
- Texto actual: «Abre «Finanzas › Impuestos › Declaraciones fiscales» y prepara el modelo 303».
- `icon-impuestos-3` y el OCR dicen que el 303 está en el grupo IVA: «Borrador autoliquidación IVA (Modelo 303)».
- Propuesta: «Abre «Finanzas › Impuestos › IVA › Borrador autoliquidación IVA (Modelo 303)» (o escribe 303 en el buscador)». En el detalle, presentar el asiento de liquidación como «el asiento que anota la liquidación», sin decir que lo genera el borrador. No está comprobado que el borrador contabilice.

### BAJA

**B1. tesoreria.json · `tesoreria-2-flujo` · pasos[2] y [3]** — El paso 2 dice que el mnemotécnico se traduce a una 626, pero el paso 3 enseña 64420.00000 (ya estaba en 50a99a0; también figura en DATOS_DUDOSOS).
- Propuesta para pasos[3].detalle: «En la captura, el flujo ALMY se traduce a la 64420.00000. Para tus comisiones elige un mnemotécnico que se traduzca a una 626 «Servicios bancarios y similares».»

**B2. contabilidad-avanzada.json · `caso-final-*`** (pagar-cobrar pasos[0] y [1], cerrar pasos[0]) — «una cuenta del grupo 626».
- Propuesta: «la 626 Servicios bancarios (en la demo, la cuenta de tu flujo {INI}COM)». La 626 es una cuenta del subgrupo 62, no un grupo.

**B3. contabilidad-avanzada.json · `icon-contabilidad-2-procesos-periodicos-orden` · campos[2].significado** — «(Pérdidas y Ganancias, 129)» → «(129 Resultado del ejercicio)». «Pérdidas y ganancias» era el nombre de la 129 en el PGC de 1990.

**B4. contabilidad-avanzada.json · `caso-final-comprobar` · campos (fila «Sumas y saldos antes de liquidar el IVA»)** — Significado actual: «Debe y haber suman lo mismo.» Propuesta: «Los saldos deudores suman lo mismo que los acreedores.» Las sumas del debe de todos los movimientos son mayores que 3.242,00.

**B5. fundamentos.json · `fundamentos-2-documentos` · explicacion[2]** — «La deuda con el proveedor y el IVA nacen con la factura.» → «La deuda firme con el proveedor (400) y el IVA nacen con la factura.» Mantener la frase de la 40090 y añadir «que es una deuda provisional», como dice Compras.

**B6. carteras.json · `icon-cartera-v-2-resultado` · explicacion[3]** — «Con euros no pasa.» → «Si la factura está en la moneda de tu empresa (euros), no pasa.» La frase de v-1 y v-3 es correcta.

**B7. Rutas con dos versiones o sin comprobar:**
- «Registro terceros» frente a «Registro de terceros». El OCR del menú solo trae «Registro terceros». `caso-final-preparar` usa las dos versiones (pasos[1] y [2]). Unificar en «Registro terceros».
- icon-contabilidad.json · `icon-contabilidad-v-3`: la ruta «Finanzas › Facturación › Compras › Facturas de compras» usa el título de la ventana. El menú dice «Fact. de compras» (OCR).
- Sin respaldo en el repo: «Finanzas › Cobros y Pagos › Remesas › Maestros › Tipos remesas» (`cartera-descuento`) y «… › Soportes electrónicos › Cobros › Emisión de adeudos directos SEPA Core y B2B (XML v.02)» (`cartera-mandato-sepa-fichero`). Dejarlas como no comprobadas o poner `null`.
- Para Gestiones conviven «Gestiones sobre la cartera de efectos» (OCR) y «Gestiones › Gestiones sobre efectos» (que usan `caso-final`, `cartera-cobro-parcial` y `cartera-impagado`). Comprobar en la demo y unificar.
- Sí tienen respaldo «Work Flow», «Verificar Mandates» y «Cambio código de cuenta».

## 4. Frases revisadas sin corrección

- Tesorería, signo del extracto (`tesoreria-4`, `icon-cartera-v-9`): debe y haber vistos desde el banco, y en la 572 al revés. Correcto.
- Impagado (`cartera-impagado-devolucion`): 4315 al debe y 572 al haber, con aviso de que la demo lo hace al revés. Correcto.
- Cobro de remesa (`cartera-mandato-sepa`, `carteras-5`): 572 al debe y 430/431 al haber, con la 23000 señalada como anomalía. Correcto.
- Albarán de compra (`compras-albaran-contabilizar`, `compras-generar-factura`): 60000 al debe y 40090 al haber; la factura salda la 40090. Correcto.
- Cierre (`icon-contabilidad-2`, `contab-cierre-practica`): orden de los procesos, asientos 99999998, 99999999 y 0 y periodos 98, 99 y 0. Correcto.
- Activos: ordenador de 1.200,00 y furgoneta. Correcto.
- Impuestos: 303 trimestral y plazo del 4T. Correcto.
