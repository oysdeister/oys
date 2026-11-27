# Segunda pasada de experto: Módulo 5 «Cartera, cobros y pagos» (27-11-2026)

Zona: lo que sale en el volcado `05-carteras` (página del módulo y 18 bloques de `carteras.json`), `examenes/carteras.json`, `glosario/carteras.json` y las entradas `carteras` de `portadaDatos.ts` y `etapas.ts`. No se han tocado los bloques de Tesorería (`icon-cartera-v-8` a `v-11`).
Fuentes: skill `erp-next-cartera` (SKILL, `bloques_cartera.md`, `modelo_tecnico.md`), `erp-nuevo-icon-documentacion` (hechos-cartera, PAGE 816), `caso_continuo.md`, `_fuente/CODIGOS_ALUMNO.md` y el OCR de las capturas (`_fuente/campos-ocr/ocr.jsonl`).

## Dudas y problemas resueltos

| Duda o problema | Decisión del experto ERP (fuente) | Cómo queda explicado | Sitios cambiados | Visto bueno junior |
|---|---|---|---|---|
| «OP Ordenado» (B12) frente a «OC Ordenado» (resto) | Son dos códigos del mismo estado: OC en los cobros, OP «Ordenado al pago» en los pagos (documentación PAGE 816; captura `v-icon11-011.jpg` muestra OP en la remesa de pago; skill: «OC/OP ordenado») | Se presenta en B4, donde nacen los estados: «Ordenado tiene dos códigos: OC en los cobros y OP («Ordenado al pago») en los pagos». B12 remite a OC del cobro | Lo básico expl. 4; B4 concepto; B12 concepto; glosario «Estado del efecto», «Ordenar una remesa», «Efecto propuesto y ordenado» (ejemplo con el 151,25 de T{INI}); portada › circuito 4 | Sí |
| Mismo IBAN de prueba para T{INI} y C{INI} | Es intencionado: `CODIGOS_ALUMNO.md` lo fija para los dos (dato de ejemplo, no código) | Se dice por qué: «En una empresa real cada tercero tiene su propia cuenta; aquí todos usan el de ejemplo porque no mueve dinero» | B15 parte 1 paso 2 detalle | Sí (antes parecía un error) |
| Desplegable «Cartera» (B3) frente a «Cartera de efectos» (B1) | «Cartera de efectos»: lo muestran las capturas de la demo `carteras-n-02.webp` y `ventas-n-54.webp` | Un solo rótulo, «Cartera de efectos», en todo el módulo | B3 concepto, parte 2 aviso y paso 1, problema 1 | Sí |
| Banda «EN CONTABILIDAD» frente a «CONTABILIZADO» | Bases distintas: EN CONTABILIDAD en la base del vídeo (`v-cobros-001.jpg`); CONTABILIZADO en TUTORIAL (`carteras-d-268`, `icon-cartera-n-04`) | «En la base del vídeo pone EN CONTABILIDAD; en la demo actual, CONTABILIZADO. Significan lo mismo.» El texto del paso 3 sigue diciendo EN CONTABILIDAD porque la captura lo muestra | B3 parte 1 expl. 1, campo 6, paso 3 detalle, checklist 2, problema 1 | Sí |
| R{INI} y FP{INI} usados sin presentarlos | R{INI} nace en «Dar de alta los datos básicos de contabilidad»; FP{INI} en «Configurar los documentos de venta» y la factura en «Vender: pedido, albarán y factura» (`CODIGOS_ALUMNO.md`) | Se dice de dónde vienen la primera vez que salen (B12 Resolver y B15) | B12 concepto; B15 concepto | Sí |
| Seis campos del bloque 4 con el ejemplo vacío (y siete más en B4, B6, B7 y B8) | Ejemplos sacados del propio módulo: efectos de CAR{INI} de B1 (48,40), remesa RM026-000018 del vídeo, PAGD «Pago Directo Efecto» de B4 | Ejemplos con tus datos; donde el dato no existe, regla general («la que propone la ventana», «el número de la factura…») | B4 parte 1 campos 1-6, parte 3 campo 2; B6 campo 4; B7 campos 2-4 y parte 3 campo 1; B8 campos «Fecha proceso», «Código de asiento», «Enlace contable», «Fecha contabilización», «Retroceder» | Sí |
| Cifras de los cobros a C{INI}: dos efectos de 121,00 (B2) frente a uno de 242,00 (B5) | No hay contradicción: C{INI} tiene dos efectos de 121,00 (caso, operaciones 6, 9 y 10); el de 242,00 es la práctica con CAR{INI}. Pero B5 decía que los dos efectos de C{INI} se cobran en el caso final, y B15 remesa el efecto 2 en Cartera | B2: «el efecto 1 (vence el 14-11) se cobra suelto y el efecto 2 (vence el 14-12), por remesa». B5: «el efecto 2 lo remesas en «Cobrar un recibo domiciliado…» y el efecto 1 lo cobras suelto en el caso final… Con CAR{INI} haces dos facturas, cada una de 242,00…» | B2 concepto; B5 concepto | Sí (era lo que le liaba) |
| Títulos fuera de norma | «Cobrar un recibo domiciliado con mandato SEPA» (cubre IBAN, mandato, domiciliación y remesa CSDDS) y «Registrar un recibo devuelto» | Todas las citas cambiadas | `carteras.json` (título y 9 citas), `contabilidad-avanzada.json` (2 citas, zona de otro agente), `plugins/.../erp-next-cierre/references/caso-final.md` (1); resumen y «Orden de los bloques» | Sí |
| Pregunta De memoria B1 paso 4 («el bloque para clasificar») | El punto clicable es la franja de los tres desplegables | «¿Dónde están los tres desplegables de clasificación en los que eliges «Transferencia»?» | B1 parte 2 paso 4 | Sí |
| Pregunta De memoria B11 paso 1 («Has abierto el banco PRVCC0») | El paso es con BBVA_{INI}; la captura es PRVCC0 | «Has abierto tu banco BBVA_{INI} (en la captura, PRVCC0)…» | B11 parte 1 paso 1 | Sí |
| Dos preguntas más que pedían cifras del vídeo como si fueran tuyas | Del caso concreto a la regla: tu cifra primero, la de la captura después | «…el total (151,25 en tu remesa; 1.815,00 en la captura)» y «…el importe (-151,25 en tu caso; -1.815,00 en la captura)» | B11 parte 4; B12 Evolucionar paso 6 | Sí |
| Orden: «Resolver un efecto que no se remesa» después de «Evolucionar una remesa» | Trata la selección de efectos, que va antes de ordenar. Además así «Evolucionar» queda pegado a «Entender cómo pasan los efectos a tesorería», que arranca con «En «Evolucionar una remesa» viste…» | Nuevo orden de la etapa: tipos de remesa → crear → resolver efecto que no entra → evolucionar → tesorería → mandato SEPA. No había remisiones «bloque anterior/siguiente» que se rompieran | `etapas.ts` (orden y `que`); Lo básico › Orden de los bloques; resumen del módulo | Sí |
| Tres partes repiten la pestaña «Remesas por cuenta» (B5 parte 5, B10, B11 parte 1) | Nace en B5 parte 5 (primera vez que la rellenas, con la lectura de los códigos) | Se explica solo en B5. B10 remite («La conociste en «Cobrar efectos sueltos y en remesa» (parte «Preparar el banco»)… Aquí solo compruebas…») y quita el «Ojo» repetido; B11 parte 1 remite y dice «Aquí no hay nada nuevo» | B10 concepto, parte 1 expl. 2 y aviso; B11 parte 1 expl. 1 | Sí |
| Texto de trabajo visible: «la ruta no está comprobada» | Regla del brief | «Solo en esta demo el fichero no se genera; en una empresa real lo genera tesorería desde esta pantalla.» | B15 parte 5 expl. 1 | Sí |
| «Forma de pago cheque» (B12 Resolver) chocaba con B3, donde «forma de pago» es el plazo | Lo que evita la domiciliación es el tipo de efecto cheque | «un efecto de tipo cheque… Lo que cambia es el tipo de efecto, no el plazo de pago» | B12 Resolver concepto, paraQueSirve, expl. 2, campo 2 (significado), aprendido, problema | Sí (nuevo hallazgo) |
| «lo que el cliente nos debe» | Tuteo del curso | «te debe» | B1 parte 2 campo 8 | Sí |

## Repeticiones quitadas
- Pestaña «Remesas por cuenta»: explicada una vez (B5 parte 5); B10 y B11 remiten.
- «Ojo: si la pestaña está vacía…» del concepto de B10 (ya está en B5 y en los avisos y problemas de B10).
- OC/OP: se explica en B4; B12 y el glosario remiten.

## Resuelto en genérico
- Campo «Cuenta financiera» del efecto (B4): «BBVA_{INI}, si el efecto se cobra o se paga por tu banco» (no se afirma cuándo se rellena).
- Campo «Fechas…» (B4): «la fecha de tu factura FC026-000001 y, en su primer efecto, esa fecha más 40 días» (la fecha exacta de la factura depende del día en que la grabó el alumno).

## Sin resolver
- Campos con «Ej.:» vacío en «Conocer los procesos avanzados de cartera» (numero1 y numero2, pcs_seqori, Gestor, Cliente, feccon, Histórico, Detalle de la gestión): bloque opcional de solo lectura, sin dato fuente que no sea inventado.
- La skill `erp-next-cartera` (SKILL.md, mapa de rutas, y `bloques_cartera.md` §3) sigue diciendo «desplegable ⌄ › «Cartera»». Las capturas dicen «Cartera de efectos». No es de mi zona: conviene corregir la skill.
- «Cobrar solo una parte de un efecto» encajaría justo detrás de «Cobrar efectos sueltos y en remesa» (los cobros juntos y después los pagos). No lo he movido: al final de la etapa no rompe ninguna remisión, y cambiar más el orden del curso lo decide Sergi.

## Validación
Los JSON cargan. `comprobar_estructura.py`: 0 errores estructurales y 0 avisos. Volcado regenerado sin errores.
