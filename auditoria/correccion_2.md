# Corrección 2 (carteras.json y tesoreria.json)

Ids intactos (comparados con HEAD), sin pasos borrados. JSON válido y `npm --prefix app run build` correcto.

## Del senior
- A3 (`icon-cartera-v-6`): la 10000.00087 es ahora la cuenta puente de pagos ordenados (la 401 del PGC), ni capital ni banco; el banco baja al conciliar. Cambiado en concepto, campos[1] (significado y ejemplo), pasos[1], checklist[4], aprendido[2] y test[2].
- B6 (`icon-cartera-v-2-resultado`): «Si la factura está en la moneda de tu empresa (euros), no pasa.»
- B1 (`tesoreria-2-flujo`): el paso 4 avisa de que la captura muestra la 64420.00000.
- B7: «Registro de terceros» unificado a «Registro terceros» en carteras.json. Marcadas «ruta no comprobada»: Tipos remesas (`cartera-descuento`) y Emisión de adeudos SEPA (`cartera-mandato-sepa-fichero`). Pendiente de comprobar en la demo: «Gestiones sobre efectos» frente a «Gestiones sobre la cartera de efectos» (no unificado). «Fact. de compra» ya era el nombre del menú. `icon-contabilidad-v-3` no es de estos ficheros.

## De los juniors
- otro_sector 12 a 23: carteras-1 acortado con mapa de 4 partes y marcas «Puedes saltarlo / Déjalo como viene»; «Transferencia» en los tres desplegables; avisos naranjas ignorables; por qué CAR{INI} y no T{INI}; un cuadro demo/real en la factura de compra (IVA 00000); mandato SEPA con analogía del gimnasio y un cuadro inicial (mandato, 23000, fichero); aviso antes de «Guardar» y antes de la remesa; fichero «solo se mira»; tesoreria-4 empieza por «el banco te manda sus movimientos», N43 al final, partes de carga y revisión marcadas «solo se mira», conceptos «lo configura el responsable». El punto 11 es de fundamentos.json (no mío).
- sin_contabilidad 13 y 14: CAR{INI} explicado en carteras-5, jerga (analítica, línea financiera, RC, T2D), un cuadro demo/real para la 23000 antes de la remesa; impagado con regla del lado, 4315 = 43150.00000, «bloque extra», un cuadro único demo/real. No toqué 4315/572 ni 572/430-431.
- sin_erp 7 y 25 a 28: ruta única de Bancos propios; tabla de 4 filas para el 10,00 (en `tesoreria-4-manual`, filas añadidas al final de campos); tabla «si ves X, pulsa Y» con los cinco botones (en `tesoreria-5-pantalla`); avisos de que las capturas son de CAPT_BCO/TRI; un solo banco BBVA_{INI} (tesoreria-1).

## Notas
- Las tablas usan `campos` (columnas Campo / Qué significa / Ejemplo), sin tocar los índices anteriores.
- Se retiraron avisos duplicados (23000, impagado) para dejar un cuadro por bloque; el texto contable se conserva en el cuadro.
