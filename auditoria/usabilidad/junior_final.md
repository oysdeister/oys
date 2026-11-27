# Revisión junior final: pasada transversal y de expertos (27-11-2026)

Zona: toda la plataforma, solo lo cambiado en `transversal_repeticiones.md`, `transversal_citas-glosarios.md` y `experto_*.md`. Leído en el orden del curso con un volcado nuevo (`node auditoria/scripts/volcar_lectura.mjs`, carpeta `volcado-junior` del scratchpad) y el `git diff --word-diff -U0 -- app/src`.

Método: script propio que recorre el volcado en orden y, para cada «…» precedido de «viste / repasaste / conociste / bloque / parte», comprueba que el título existe tal cual, que está antes en el curso y que el módulo que se nombra al lado es el suyo. Después, lectura a mano de las 74 cadenas añadidas con remisión y de la primera frase de cada Concepto. Datos unificados con `grep` en `app/src`. Glosario: duplicados con `gl_formas.py` y, para cada término, en qué módulo aparece y se explica primero.

## 1. Remisiones

| Página | Problema (como junior) | Grav. | Arreglo |
|---|---|---|---|
| Cartera › «Comprobar los tipos de remesa de una cuenta» (concepto y aviso) | «parte «Preparar el banco»»: busco esa parte y no existe; la que hay se llama «Preparar el banco: línea financiera y remesas por cuenta». Además «Preparar el banco» es el nombre de una etapa de Tesorería, así que me mandaba a un módulo que aún no he visto | 2 | Cita completa en los dos sitios |
| Cartera › página del módulo, «Lo mínimo de contabilidad…» | «Lo tienes explicado en Contabilidad básica, en «Para saber más»»: no hay nada con ese título exacto y, en esa etapa, el centro de coste está en dos bloques concretos | 2 | «…en los bloques opcionales «Crear un proyecto» y «Crear una sección»» |
| Cartera › «Entender cómo pasan los efectos a tesorería» | «dos bloques de Tesorería y bancos»: el módulo se llama «Tesorería y conciliación bancaria» | 1 | Nombre completo del módulo |
| Impuestos › «Probar las reglas de impuestos», paso del tipo ESG (detalle) | Cita «Conocer los maestros fiscales» dos veces en dos frases seguidas | 1 | Quitada la segunda |
| Resto (unas 70 remisiones) | Títulos existentes, anteriores en el curso y del módulo que dicen; el sitio citado explica de verdad el concepto (comprobado por muestra: maestro en «Leer la rejilla de registros», efecto y cartera en «Seguir el dinero…», remesa en «Crear el banco propio para remesas», mnemotécnico, numerador, «Remesas por cuenta») | — | Se entienden |

Las únicas remisiones «hacia delante» que salen en el script son avisos de futuro («lo practicas en Compras», «crearás copias»), no «lo viste».

## 2. Frases meta quitadas

| Página | Antes | Ahora |
|---|---|---|
| Datos maestros › «Cómo moverte por el ERP» | «…repásalo antes de seguir: aquí no se repiten.» | «…repásalo antes de seguir.» |
| Datos maestros › «Moverte por Axional» (paraQueSirve) | «…«Moverse por el ERP». Aquí solo lo aplicas; no se vuelve a explicar.» | Termina en la remisión |
| Cartera › «Lo mínimo de contabilidad…» (paraQueSirve) | «Aquí no se vuelve a explicar: si no lo recuerdas, repásalo allí.» | «Si no lo recuerdas, repásalo allí.» |
| Cartera › «Cómo moverte por el ERP» (paraQueSirve) | «…: aquí solo se remite allí.» | Quitado |
| Cartera › «Repasar los tipos de remesa del banco» | «Aquí no hay nada nuevo.» | Quitado |
| Ventas › «Cómo moverte por el ERP» (paraQueSirve) | «aquí se remite allí y se añade lo propio de Ventas» | «aquí está lo propio de Ventas» |
| Impuestos › «IVA repercutido, soportado y liquidación», explicación 1 | «…ya lo viste en Fundamentos. Aquí no se repite: solo se añade lo que pide la declaración.» (y el paraQueSirve ya decía lo mismo) | Glosa de media frase que me deja seguir el bloque: «Partes de lo que repasaste en Fundamentos: la base imponible (el importe sin IVA), el tipo (el porcentaje) y la cuota (el IVA en euros).» |

## 3. Primera frase de cada página

Me perdía en cinco Conceptos que empezaban por «Ya sabes…» o «En «X» viste…» y no decían qué iba a hacer (gravedad 2). Ahora la primera frase dice qué es la página y la remisión va detrás:
- Contabilidad básica «Consultar el plan contable y sus cuentas»: «En este bloque consultas el plan contable dentro del ERP: la lista ordenada de cuentas con su número, que repasaste en Fundamentos…».
- «Dar de alta una cuenta contable»: «Aquí das de alta una cuenta contable nueva: un cajón con número más…».
- «Dar de alta un mnemotécnico propio»: «Aquí creas tus propios mnemotécnicos, los atajos hacia una cuenta. Qué son… lo viste en «Entender los mnemotécnicos de cuentas».»
- Compras «Contabilizar el albarán de compra»: «Aquí contabilizas un albarán de compra. Contabilizar lo viste…».
- Cartera «Entender cómo pasan los efectos a tesorería»: «Aquí ves cómo un efecto pasa a tesorería. En «Evolucionar una remesa» viste…».
- Cierre «Cerrar el ejercicio de tu empresa»: «Aquí cierras el ejercicio de tu empresa, en el orden que viste en «Cerrar y abrir el ejercicio».»

Los demás que empiezan con remisión ya traen la glosa en la misma frase (IVA en Impuestos, cierre en Cierre B1, tipología en Ventas B4, efecto en Cartera B4): se entienden. Las partes de Fundamentos que empiezan por «Lo viste en «Contabilidad desde cero»…» van detrás de un paraQueSirve que ya dice para qué sirven: se entienden.

## 4. Datos unificados

| Dato | Resultado |
|---|---|
| PROV-{INI}-001 / -002 | 26 + 4 apariciones, ninguna FRA-. Tesorería usa PROV-ZZ-001 solo como ejemplo de lo que cambias por tus iniciales. Bien |
| 09-10-2026 (fecha de la factura del caso) | Igual en Compras B9 y Contabilidad (facturas). El simulador Docflow de Compras (`datosSimulador`) fecha la factura el 12-11-2026, la fecha de práctica del curso: no es texto, no lo toco (anotado) |
| «Cartera de efectos» | Ningún «› «Cartera»» suelto en `app/src`. La única «Cartera» es una opción falsa de examen. Bien |
| OC / OP | Coherente en Cartera y glosario. Cartera «Repasar los estados y las acciones» listaba solo «OC Ordenado»: ahora «OC Ordenado (OP en los pagos)» |
| Cuenta puente en el pago por remesa | Igual en Cartera, Tesorería, caso final y glosario. Fundamentos daba el asiento neto sin aviso y luego vería dos asientos (gravedad 2): añadida la glosa «el resultado es… (en el ERP, al pagar con una remesa, el importe pasa antes por una cuenta puente; lo verás en Cartera y en Tesorería)» |
| ES-IVA-SOP / ES-IVA-REP | Igual en Impuestos (B2, B4, examen) y glosario; ESG-IVA-SV/RV solo como «en la captura» |

## 5. Glosario

Duplicados por clave: 0 (quedan dos choques de forma ya conocidos, abajo). Todos los términos tienen ejemplo. Cambios, con el criterio de la pasada transversal («va en el módulo cuyo bloque lo explica primero»):

| Término | Problema | Arreglo |
|---|---|---|
| Signo del extracto, Cargo y abono, Contabilizar la conciliación | Estaban en Cartera, pero son de Tesorería (bloques que ahora se ven en Tesorería) | Movidos a `tesoreria.json`; ejemplos con tu pago de 151,25 en vez del 1.524,60 del vídeo |
| AEB43 | Repetía N43 («otro nombre de la norma 43») | Fusionado en «N43 (norma 43)» con alias AEB43 |
| Riesgo (Cartera) | Repetía «Riesgo del cliente» (Contabilidad) y decía «nos debe» | Quitado; alias «Riesgo» en «Riesgo del cliente» |
| Comercial y agente (Ventas) | Repetía «Agente» | Fusionado en «Agente» (alias «Comercial y agente») |
| Actualización «Sumando» (Compras) | «Sumando» solo sale en Ventas, donde ya lo explica «Actualizar origen» | Quitado (la forma no aparece en ningún texto) |
| Plan General de Contabilidad (PGC) (Activos) | Repetía «Plan contable» | Quitado; alias «Plan General de Contabilidad» y «PGC», y «2 inmovilizado» añadido a las familias |
| Maestro, Plan contable, Cuenta contable (Datos maestros); Saldo, Vencimiento (Contabilidad); Cuota, Tipo impositivo, 4T (Impuestos) | Los explica primero Fundamentos (rejilla, repaso de contabilidad, IVA, efecto) | Movidos a `fundamentos.json`; ejemplos con datos que ya conoces en Fundamentos (empresa 0, aportación de 3.000,00, compra de 125,00 + 26,25, vencimientos del 14-11 y 14-12, liquidación del 4T) |
| Objeto (del ERP) (Fundamentos) | La palabra no sale en Fundamentos; se explica en la portada de Compras | Movido a `compras.json`, con los ejemplos de esa portada (ctercero, gcomalbh) |
| Tipología (Datos maestros) | No sale en Datos maestros; nace en Compras «Preparar la numeración y los tipos de documento» | Movido a `compras.json` |
| Modo consulta (Datos maestros) | Solo sale en Contabilidad básica | Movido a `icon-contabilidad.json` |

Recuento: fundamentos 15 → 22, maestros 17 → 12, icon-contabilidad 63 → 62, compras 69 → 70, ventas 40 → 39, carteras 39 → 35, tesoreria 32 → 34, icon-impuestos 45 → 42, icon-activos 37 → 36. Ninguna clave se enlaza con `glosario#…` desde el contenido ni las skills (`grep`).

## Pendiente (con motivo)
- Choques de forma: «ACR» (alias de Acreedor y forma de «Relación PRO / ACR») y «Contabilizar» (Fundamentos y «Contabilizar (Real y Diferido)»). Funcionan; renombrar es decisión de Sergi. Sigue lo de «Relaciones contables» frente al plural de «Relación contable» (ya anotado en la transversal).
- «Ejercicio contable» se queda en Datos maestros: Fundamentos define el ejercicio, pero la entrada explica los doce periodos y su apertura, que nacen en Datos maestros.
- Fecha 12-11-2026 de la factura en `datosSimulador` de Compras (dato del simulador, no texto).

## Validación
`python3 -I auditoria/scripts/comprobar_estructura.py`: solo los 9 errores de número de entradas de glosario, 0 avisos. Todos los JSON cargan. Volcado regenerado y comprobación de remisiones sin fallos. Ediciones con Edit, cadena a cadena.

## Resumen
Páginas o entradas revisadas: unas 90 cadenas con remisión o primera frase, 6 datos unificados y los 10 glosarios. Confirmadas: unas 70 remisiones y 5 de los 6 datos. Arregladas: 4 remisiones, 7 frases meta, 6 primeras frases, 2 datos (OP, cuenta puente en Fundamentos) y 19 entradas de glosario (movidas o fusionadas). Pendientes: 3, por decisión de Sergi o porque no son texto.
