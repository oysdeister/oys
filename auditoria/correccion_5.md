# Corrección 5: icon-impuestos.json e icon-activos.json

## icon-impuestos.json
- M3: la sección nueva «Tu 303 del caso» usa 477 (PGC) y explica que la demo lleva el IVA repercutido a la 47000.00000 por configuración.
- M6: ruta del 303 en «Finanzas › Impuestos › IVA › Borrador autoliquidación IVA (Modelo 303)» (concepto, ruta de la sección de modelos y paso nuevo).
- Punto 15 (icon-impuestos-conceptos): cifras del caso primero (125,00 / 200,00 / 26,25 / 42,00 / 15,75), ALA como puente; campos de la sección de IVA con cifras del caso; la sección «motor» presenta zona (ESCO), clave (BOG), operación (CLBC) y tipo (ESG) de uno en uno.
- Punto 16 (icon-impuestos-3): sección nueva `icon-impuestos-3-caso` con las tres cifras, el asiento (477 debe 42,00; 472 haber 26,25; 4750 haber 15,75) y la AEAT explicada. Modelos, claves, prorrata y SII/VERIFACTU/TicketBAI pasan a «Para saber más», con menos texto. Se quita el paso «303 a mano con 2.100».

## icon-activos.json
- Puntos 24 y 25 (icon-activos-2): un solo ejemplo, el ordenador de 1.200,00 (300,00 al año, 25,00 al mes), con asiento de dos líneas (681 debe y 2817 haber, 300,00) y explicación de 68x y 28x.
- Punto 26: frase que enlaza con el caso («si la empresa del caso comprara un ordenador…») y por qué las capturas son de ALA.
- Punto 27: «Leer los valores de amortización» queda con 3 campos (% amortización, años, valor neto); el resto va como «Más detalles» en la explicación.
- Punto 24 (traspasos): la sección pasa a «Opcional: traspasar, cambiar la amortización o dividir un elemento».

Ningún `id` existente cambiado ni pasos con imagen borrados. Añadido un id nuevo: `icon-impuestos-3-caso`. JSON válido y build correcto. Sin commit.
