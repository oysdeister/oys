# Redacción Compras y Ventas (guía junior)

Ficheros: `app/src/content/compras.json` y `app/src/content/ventas.json`. Sin cambios de `id`, pasos, imágenes, hotspots, preguntas, test ni checklist. Comprobado con `json.load` y `npm --prefix app run build`.

Cambios en todos los bloques: rutas de menú con `›` en lugar de `>` (solo cadenas que empiezan por Gestión, Finanzas, Contabilidad, Terceros o Maestros; los botones «Nuevo > Nuevo como» y «Contabilizar > Aceptar» se dejan), y párrafo final `Dónde: «… › …».` en `concepto`.

## Ventas (prioridad alta)

- **ventas-1**: `objetivo` con la cifra 242,00; `concepto` reescrito con primer párrafo qué es, comparación y consecuencia. Explica en línea albarán, factura, tipología, serie, plantilla contable, contabilizar, asiento, debe y haber, vencimiento, efecto, cartera, IVA y base imponible. Ejemplo del caso (10 × 20,00 = 200,00 + 42,00 = 242,00, margen 75,00). Frase puente D2 (tu cliente es C{INI}; aquí das de alta a T{INI} porque las capturas son suyas) y D1 (la demo graba en la empresa 0). 14 `detalle` nuevos, sección Cliente reescrita en la explicación, «Validar»/«Provisional» explicados, `campos` de Fecha contabilización con ejercicio y periodo, `aprendido` con la cifra del caso.
- **ventas-2**: `objetivo` con 133,10; `concepto` reescrito con consecuencia, tipología, contabilizar, asiento, vencimiento y base imponible. Frase puente: la venta de 5 × 22,00 = 133,10 es práctica y no se suma al caso (242,00); vende a T{INI} y no a C{INI}. 24 `detalle` nuevos (y uno más en la tipología de pedido). Glosa de serie y stock, `aprendido` con la cifra.

## Compras

- **compras-albaran-contabilizar** (alta): primer párrafo con consecuencia. Explica contabilizar, debe, haber, apunte y la cuenta puente 40090. Frase puente D4 (captura de 4 uds. = 50,00; el tuyo, 10 × 12,50 = 125,00 y factura de 151,25). Ajustadas las cifras en explicación y en un `detalle`; nuevo problema «No encuentro mi albarán»; `aprendido`.
- **compras-generar-factura** (alta): primer párrafo con consecuencia; IVA soportado explicado; frase puente D4 (4 uds. = 60,50 frente a 125,00 + 26,25 = 151,25) y asiento de 110,50 frente a 276,25; `detalle` del paso de `-validar`; `aprendido`.
- **maestros-2** (alta): `objetivo` y `concepto` reescritos con consecuencia. Explica maestro, tercero, stock, tipo de efecto, plazo, efecto y estado PE. Ejemplo del caso (C{INI}, R{INI}, P{INI}, 242,00 = 2 × 121,00), aclaración «C{INI} es tu cliente en Ventas», tipo contable y tarifa explicados, 7 `detalle` nuevos, problema «No encuentro la pantalla», `aprendido`.
- **compras-1** (media): primer párrafo con consecuencia; `Ejemplo:` del caso (10 × 12,50 = 125,00 + 26,25 = 151,25, empresa 0); asiento, modelos fiscales, vencimiento y plan contable explicados en línea; `aprendido`.
- **compras-abono-devolucion** (media): primer párrafo con consecuencia; ejemplo de 1 ud. (−12,50 − 2,63 = −15,13) con puente hacia la factura de 4 uds. (60,50) de los pasos; 3 `detalle` nuevos.
- **maestros-3** (media): consecuencia en el primer párrafo; frase puente (el caso usa el 13500620; aquí ROD{INI} es de aprendizaje); 3 `detalle` nuevos.
- **compras-tipos** (baja): consecuencia, ejemplo del caso, «anticipos» explicado.
- **compras-3**, **compras-2**, **compras-precios**, **compras-workflow**, **compras-factura** (baja): consecuencia donde faltaba, `Dónde:`; en compras-2 «stock» explicado; en compras-workflow `Ejemplo:` con el pedido de 125,00; en compras-factura «ejercicios» cambiado por «prácticas» en el aviso.

## Pendiente o decisión

- **47000 / 47700**: `ventas.json` conserva «47000.00000» en pasos, checklist y detalles. Todos son anteriores a esta pasada, vienen de capturas de la demo (rótulo «Hacienda Pública, deudora por IVA») y la regla dura prohíbe cambiar códigos de cuenta. No he escrito ninguna cuenta de IVA nueva. `compras.json` no tiene 47000. Si el auditor confirma que hay que sustituirlas, es un reemplazo de texto en 9 ocurrencias de ventas, pero las capturas seguirán mostrando 47000.
- **D2 (cliente C{INI})**: los pasos y las capturas de Ventas siguen con T{INI}. Solo hay frase puente, sin cambiar la acción.
- **D5**: no he escrito cuentas con † (10000, 129, 475, 626).
- Compras-1 conserva 6 `problemas` (la guía pide 2 a 5); no he borrado ninguno.
- Frases largas: no se han reescrito las que ya existían salvo en los textos tocados.
