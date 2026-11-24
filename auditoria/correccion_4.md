# Corrección 4: compras.json y ventas.json

Solo se han tocado `app/src/content/compras.json` y `app/src/content/ventas.json`. Ningún `id` cambiado; ningún paso con imagen borrado. JSON válido y `npm --prefix app run build` correcto.

## Senior M3
- Frase puente del IVA (47000.00000 «Hacienda Pública, deudora por IVA»; 4700 es lo que Hacienda te debe; el IVA que cobras va a la 477; configuración de la demo, no la copies) en `ventas-1-tipologia-factura` explicacion[1] y en `ventas-2-factura` explicacion[3].

## Juniors (sin contabilidad 7-12; sin ERP 2, 4-6, 8, 10-20)
- Albarán: una sola versión. Con «Asiento albaranes» informado: 60000 D / 40090 H. Con el campo vacío (AO{INI}): sin asiento hasta la factura. Ajustados compras-tipos (concepto y tipología de albarán), compras-2, compras-albaran-contabilizar y compras-factura. Las capturas usan el albarán de la demo (4 uds), que sí contabiliza; se dice en el concepto y en el paso 0.
- Dos caminos a la factura: nueva sección `compras-factura-caminos` (sin pasos) al principio de compras-factura, con tabla de efecto neto (A y B dejan 60000 D 125,00, 47200 D 26,25, 40000 H 151,25, 40090 a 0), regla de elección y «tu caso sigue el A». compras-generar-factura enlaza como camino B.
- Tolerancia 60,00 frente a 60,50: «la demo lo acepta; en una empresa real revisa la diferencia» (concepto, paso y aviso). Se ha quitado la frase que afirmaba una tolerancia de la tipología.
- Nº de factura: FRA-{INI}-001 pasa a PROV-{INI}-001 (como fundamentos y caso final); la generada, PROV-{INI}-002.
- Ventas: se vende a C{INI} en todo ventas-1 y ventas-2 (T{INI} sustituido en ejercicios y navegación). ventas-1-cliente pasa a «compruébalo: ya lo diste de alta». Vencimientos: con C{INI} salen dos efectos de 121,00 (R{INI}/P{INI}); la captura es de otro cliente (EF 242,00). Ajustados ejemplos, checklist y aprendido.
- Venta contada dos veces: aviso en el concepto de ventas-1 con el asiento correcto al lado (43000.00000 242,00 D; 47000.00000 42,00 y 43090 200,00 H); explicacion[3] y [4] de la factura acortadas.
- Campos «déjalo como viene»: Rotura, Tipo (pedido), Suministro albarán, Valorar/Valoración, Abono, Delegación/Departamento/Cambio/Receptor (compras y ventas), Holding, Orden, Evolución riesgo, Validar catálogo, Impresión, Precio tarifa, Compromiso inversión; Familia de ROD{INI}: «copia el código tal cual».
- Sumando: ejemplo numérico (pides 10, recibes 4, quedan 6) en compras-tipos.
- NSAL: una sola definición («fuera del inventario: lo que no cuenta como existencias»), en compras-tipos, compras-2, ventas-1 y ventas-2.
- Rutas: ventas sin códigos en la ruta (el código va en «En el buscador: …» al final del primer paso; la nota de navegación lo explica); compras-1 y compras-factura con ruta de menú y no de ficha. Ficha del tercero: frase Finanzas (ficha) / Gestión (papel).
- Errores de la demo: compras-3-pedido avisa antes del paso (paraQueSirve), da el resultado esperado y marca el camino estándar como opcional y fallido; ROD{INI} dice al inicio que es solo para aprender.
- Relación proveedor ACR / PRO: ACR es la que pide la tipología; la deuda se anota por PRO (40000).

## Pendiente fuera de mis ficheros
- caso-final (contabilidad-avanzada.json) op. 3 y 4: con AO{INI} no hay asiento de albarán; la factura da 60000 D 125,00 + 47200 D 26,25 / 40000 H 151,25 (sin 40090 en el caso). Hoy dice «40090 125,00 al debe».
- `datosSimulador` de ventas.json conserva `cliente: T{INI}` (datos del simulador; no tocado).
- Sin tocar: sin_contabilidad 1-6; sin_erp 1, 3, 7, 9, 21-29.
