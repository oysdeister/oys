# Redacción de Contabilidad básica (icon-contabilidad.json)

Guía aplicada: `auditoria/guia_junior.md` (formato por campo, regla de los términos, caso continuo y D1-D5). No se ha cambiado ningún `id`, paso con imagen ni hotspot, ni cifras de pasos.

## Prioridad alta

- `icon-contabilidad-v-1`: objetivo con un logro; concepto reescrito (por qué importa, albarán, IVA, asiento, efecto y registros fiscales explicados; frase puente ML0260020/00027 con T{INI} 151,25; línea Dónde); ruta en las 4 partes que faltaban; «>» cambiado por ›; detalle en pasos y puente en asiento y cartera; 2 problemas nuevos; aprendido con la cifra del caso.
- `icon-contabilidad-v-2`: objetivo con un solo logro (quita la venta FB); concepto reescrito (por qué importa, validar, provisional, contabilizar, tercero; frase puente LIZ/00003 con T{INI} 151,25; Dónde); detalle en 6 pasos que no lo tenían; ruta en -contabilizar-fc; 2 problemas nuevos.
- `icon-contabilidad-v-3`: concepto reescrito (consecuencia con Hacienda, Docflow explicado, ejemplo numérico de rectificativa y devolución de T{INI} −15,13, Dónde); ruta en las 2 partes; 5 pasos con detalle y los 2 «Recuerda» convertidos en pasos de acción; 2 problemas en forma «Si algo sale mal».
- `icon-contabilidad-v-4`: concepto reescrito (consecuencia, periodo, ejercicio, tipo de asiento, cartera, remesar y conciliar explicados; puente del vídeo de julio con la demo y con tu caso; Dónde); detalle en 6 pasos; 4 problemas reescritos como síntoma; -importe-0 queda sin ruta (no hay pantalla comprobada propia; se hace desde la ficha de cualquier factura).
- `maestros-1`: objetivo con un logro de caso (C{INI}, P{INI}, R{INI}); concepto: maestro y cuenta contable explicados, para qué servirán P{INI} y R{INI} (242,00 en dos efectos de 121,00), empresa 0 en la demo, Dónde; USD explicado como práctica; agrupación, flujos y operaciones explicados en bancos-cajas; subcuenta y saldo explicados; 7 pasos con detalle; problemas recortados de 7 a 5.

## Prioridad media

- `asientos-2`: objetivo sin «provisional»; concepto: consecuencia, provisional definido, frase puente aportación 3.000,00 / gasto 1.000,00, Dónde; detalle del paso Justificante (numerador explicado antes de usarlo); 2 problemas.
- `asientos-7`: concepto: IVA soportado y repercutido explicados con la frase modelo, Dónde; detalle de 2 pasos; 2 problemas nuevos.
- `asientos-1`: concepto: consecuencia, caso (aportación 3.000,00), DA cierre explicado, Dónde; justificante, ejercicio y periodo explicados antes de usarlos; detalle del paso 2; 2 problemas.
- `maestros-v-1`: concepto: consecuencia, contabilidad y grupos 1-7 definidos con el caso (57200, capital 3.000,00), Dónde; tercero y saldo explicados en línea; detalle de 2 pasos; el paso «Recuerda» pasa a «Fíjate» con detalle; problema nuevo.
- `parametrizacion-1`: concepto: plantilla contable y proyecto/sección definidos, caso (comisión 10,00 en el grupo 626), Dónde; problema nuevo.
- `asientos-14`: concepto: consecuencia, frase puente con el pago a T{INI} (151,25) y el de 8.080,15, Dónde; quitado el nombre interno cbancpro del texto.
- `asientos-6`: concepto: caso de la aportación y Dónde; detalle de «Finalizar» y de la comprobación; problema de fecha fuera de periodo.
- `asientos-3`: concepto: caso de cuadre 151,25 − 151,25 = 0,00 y Dónde; 2 problemas.
- `asientos-4`: concepto: consecuencia y Dónde; detalle del paso 1; 2 problemas.
- `asientos-5`: concepto: consecuencia y Dónde; detalle de la cabecera; 2 problemas.
- `asientos-11`: concepto: consecuencia y Dónde; detalle de 2 pasos; 2 problemas.
- `asientos-12`: concepto: consecuencia y Dónde; detalle de 2 pasos; 2 problemas (cperiodo_ins deja de ser texto suelto).
- `asientos-13`: concepto: consecuencia y Dónde; detalle de 2 pasos; 2 problemas.
- `asientos-8`: concepto: consecuencia, apunte del caso y Dónde; 2 problemas.
- `asientos-9`: concepto: caso del mayor de 57200 (3.077,25) y Dónde; detalle del paso de repetir con otras cuentas; 2 problemas.
- `asientos-10`: concepto: consecuencia, ejemplo del caso 3.242,00 = 3.242,00 y Dónde; detalle de 2 pasos; 2 problemas.

## Prioridad baja

- `icon-contabilidad-1`: Modelos XLS y «Sistema Excel» aclarados en línea (plantilla guardada como fichero Excel; no se edita).
- `maestros-v-2`: concepto: consecuencia, caso (43000 → 43000.00901), Dónde; detalle del paso 1 de «Uso»; problema nuevo.
- `parametrizacion-2`: concepto: consecuencia y Dónde; detalle del resultado final; 2 problemas.
- `parametrizacion-icon-1`: detalle en 3 pasos; «serie» explicada en el campo Numerador.
- `parametrizacion-icon-2`: detalle en 3 pasos; «regularización» explicada con la frase modelo.

## No tocados

`parametrizacion-3` a `-6`, `contab-saldos-iniciales`, `contab-mnemotecnicos-alta` y `contab-plantilla-alta` no figuran en el diagnóstico y no se han tocado.

## Pendiente de comprobar en la demo

- `icon-contabilidad-v-4` › `-importe-0` sigue con `ruta` vacía: no hay una pantalla propia comprobada.
- Cuentas del caso con †: se han evitado literales nuevos; en las frases puente solo hay 57200, 60000, 47200 y 40000.T{INI}, que ya salen en la guía.
- Los `detalle` nuevos describen resultados deducidos de las capturas y de la guía; conviene un repaso de un revisor que tenga la demo abierta.
