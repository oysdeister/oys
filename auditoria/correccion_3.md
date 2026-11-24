# Corrección 3: fundamentos.json y maestros.json

Ids intactos (comprobado). json.load y `npm --prefix app run build` correctos. Sin commit.

## Revisión senior
- A4: test de fundamentos-2 invertido (572 = 4.879 €, extracto = 5.000 €).
- M3: fundamentos-1-iva, «477 en el PGC; la demo lo lleva a la 47000.00000, "Hacienda Pública, deudora por IVA", por configuración».
- M5: fundamentos-2-banco, 3.000,00 − 151,25 − 3,50 − 10,00 + 121,00 + 121,00.
- B5: la 400 es la deuda firme (con la factura); la 40090, deuda provisional, pasa a un aviso «Más adelante».

## junior_otro_sector (4 a 10)
- debe-haber: regla por tipo de cuenta, ejemplo del bar y tabla (campos) con banco, proveedor y compra.
- plan-contable: 4 cuentas (572, 400, 600, 700) y el resto en «Más adelante».
- Desglose 3.000 + 242 − 151,25 − 3,50 − 10,00 = 3.077,25 en debe-haber; en contabilidad, 13,50 = 3,50 + 10,00.
- N43 quitado. Máquina de café en contabilizar; cierre de caja del bar en cierre.

## junior_sin_contabilidad
- Puntos 1 y 2 hechos (desglose y lado según tipo de cuenta). El 4 es de maestros-1, que ya no está en maestros.json (está en icon-contabilidad.json): no tocado.

## junior_sin_erp
- Puntos 1 y 28: maestros-v-4 dice que S{INI} y CAIXA{INI} son solo para aprender y que el caso usa la empresa 0 y BBVA_{INI}.
- Punto 3: ROD{INI} «solo para aprender» en su primer uso (navegación) y en la tabla de códigos.
- Punto 9: Proyecto y Sección, Tipo de dirección 0 («déjalo») y quién crea AG{INI}.
- Primer bloque de Fundamentos (fundamentos-navegar): grabas en la empresa 0, compartida, porque S{INI} no tiene tipologías ni configuración.

## Incidencia
El script `scratchpad/ed.py` lo pisó otro corrector y lo ejecuté sin querer: duplicó en icon-impuestos.json la sección `icon-impuestos-3-caso` y el primer elemento del checklist de `icon-impuestos-3`. No lo reparé (fichero ajeno).
