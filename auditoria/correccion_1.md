# Corrección 1 (contabilidad-avanzada.json e icon-contabilidad.json)

Aplicado del senior: A1, A2, M1, M2, M3 (caso-final y asientos-7), M4, M5 (caso-final), M6, B2, B3, B4, B7 (icon-contabilidad-v-3 y caso-final-preparar).
Aplicado de los juniors: sin_contabilidad 3, 5, 6, 17, 18, 19, 20 (capital, 626, 47500); otro_sector 28-31 (caso-final: resumen de 13 filas, 4 unidades, cierre sobre el papel, cifras); sin_erp (maestros-v-4 y cierre: el cierre real en S{INI}, resultado bueno).

Cambios clave
- caso-final: nueva sección `caso-final-resumen` (tabla de 13 filas: operación, bloque, importe) con la frase de las 4 unidades; concepto, `caso-final-cerrar` y comprobar dicen que en la empresa 0 no se lanza regularización, cierre ni apertura; se repasa con 200,00 − 125,00 − 13,50 = 61,50. Comprobación con Mayor de cuentas filtrado por tu diario. IVA repercutido en 47000.00000 con la frase «Es configuración de la demo: no la copies».
- contab-cierre-practica: «Qué resultado es el bueno» (Regularizado y enero a noviembre Cerrado; el 99999998 ausente es límite de la demo).
- maestros-v-1: Posición explicada como dato de la ficha, sin contradicción; saldo deudor/acreedor definidos.
- parametrizacion-1: la 62999 es de práctica y se enlaza al flujo de comisiones; hace de 626 en la demo.
- asientos-2 a 5: cada uno une la aportación de 3.000,00 con su práctica; aviso de que el numerador se configura una vez.
- Ids: ninguno perdido; solo nuevo `caso-final-resumen`. No se borró ningún paso con imagen ni hotspot.

Pendiente / dudas
- Que el flujo {INI}COM use la 62999 no está comprobado en la demo; el texto dice «por ejemplo».
- La tabla del resumen usa «campos» (campo, significado, ejemplo); la columna significado lleva «Bloque: …». Revisar cómo se pinta.
- Comprobado: json.load OK y `npm --prefix app run build` OK.
