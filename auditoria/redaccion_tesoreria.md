# Redacción de Tesorería (app/src/content/tesoreria.json)

Aplicada la guía junior (D1-D5). No cambia ningún id, imagen, hotspot, pregunta, test ni el número de pasos. JSON válido y `npm --prefix app run build` correcto.

## Prioridad alta
- `icon-cartera-v-11`: objetivo con un solo logro (extracto de cobro y efectos del anticipo). Concepto reescrito: qué es un cobro y extracto, consecuencia, signo negativo explicado, frase puente (caso: 121,00 de C{INI} el 14-11 y el 14-12; vídeo: 5.082,00), cartera y efecto explicados, `Dónde`. 4 `detalle` nuevos (pasos 2-5). 2 problemas nuevos (no guarda; no casa por el signo).
- `tesoreria-1`: objetivo con BBVA_{INI} y comisión de 3,50. Concepto reescrito en párrafos cortos: tesorería, movimiento, cuenta contable, contabilizar, extracto, N43, comisión y flujo explicados en línea. Hilo del caso (empresa 0, pago de 151,25 + comisión 3,50 = 154,75) y puente con CAPT_BCO. `Dónde`. Campos Posición (debe y haber), Com. beneficiario y Com. efecto aclarados. `detalle` del paso 4 de comisiones con el 3,5000. Un problema nuevo. `aprendido` con 3,50.

## Prioridad media
- `icon-cartera-v-10`: concepto con consecuencia, puente (caso 151,25 + 3,50; vídeo 1.524,60), asiento y apunte explicados, `Dónde`. 5 `detalle` nuevos (empresa 0 según D1, fechas, Ejecutar, y las dos pestañas conciliadas). 1 problema nuevo.
- `tesoreria-2`: objetivo con {INI}COM. Concepto: conciliar, extracto y flujo en línea; caso de la comisión de 10,00 el 12-11; «apunte» sustituido por «movimiento»; `Dónde`. Mnemotécnico con la frase modelo. 6 `detalle` nuevos (operación pasos 1 y 4, conciliación 3, parámetros 1-3). Plan contable explicado en el paso 2 del flujo. 1 problema nuevo (agrupación obligatoria).
- `tesoreria-4`: objetivo en dos logros. Concepto con extracto, N43, integración y debe/haber (punto de vista del banco) explicados. Hilo: extracto de seis líneas que acaba en 3.077,25. Puente con CAPT_BCO y la línea de 10,00. `Dónde`. 3 `detalle` nuevos. 1 problema nuevo. La parte `tesoreria-4-n43` queda con `ruta` null: solo explica, no abre pantalla.
- `tesoreria-5`: objetivo con el extracto de 10,00. Concepto: conciliar con consecuencia, caso (seis líneas, saldo 3.077,25), efectos de cartera explicados, puente con la remesa de 8.080,15 de la demo TRI, rutas con ›, `Dónde`. 4 `detalle` nuevos. Problemas fundidos de 6 a 5.
- `icon-cartera-v-8`: parte `-circuito` con `ruta` (Finanzas › Cobros y Pagos › Remesas › Registro de remesas, la misma que usan otros bloques de Cartera). Concepto en párrafos cortos con puente (caso 151,25 + 3,50; vídeo 1.524,60 PRVCC0), remesa y asiento explicados, `Dónde`. 1 `detalle` y 1 problema nuevos.

## Prioridad baja
- `tesoreria-3`: objetivo con la comisión de 10,00. Hilo del caso (12-11, {INI}COM), flujos explicados, puente con CAPT_BCO, `Dónde`, `aprendido` con 10,00, 1 problema nuevo.
- `icon-cartera-v-9`: «en este ejercicio» pasa a «en este bloque». Puente con el caso (151,25 y 3,50) y con PRVCC0. Cuenta financiera explicada. `Dónde`.
- `tesoreria-6`: 2 pasos y la lista de control con `>` pasan a `›`. Consecuencia, contabilizar explicado, aviso de que el caso no usa la caja, `Dónde`.
- `tesoreria-7`: `>` a `›` en textos y avisos. Cuadro de amortización distinguido de la amortización de activos, aviso de que el caso no usa financiación, `Dónde`.
- `tesoreria-8`: Ejemplo con la cifra del caso (3.077,25) y aviso de que no hay inversiones ni avales, `Dónde`. Frases acortadas.

## Dudas para Sergi
- `tesoreria-4` y `icon-cartera-v-9`: el signo del extracto (cargos en positivo en la base de prácticas, en negativo en la demo TRI) choca con el ejemplo de la guía (−151,25). Los textos del caso hablan de importes sin signo.
- Cuentas con † (626, etc.) no aparecen: no se ha escrito ninguna cuenta nueva.
