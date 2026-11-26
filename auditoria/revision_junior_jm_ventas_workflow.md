# Revisión como junior: Compras (Configurar + workflow) y Ventas (Configurar + Operar)

Lector: junior sin formación financiera que no ha usado Axional. Solo lectura de `compras.json`, `ventas.json` y `etapas.ts`; capturas abiertas: `cob-workflow-17` y `ventas-n-41`. Nada se ha ejecutado en el ERP.

## Veredicto rápido
- Compras Configurar y Ventas Configurar se entienden y son los mejores bloques: cada campo trae su significado y los errores típicos están previstos.
- Ventas está en buena parte bien explicada, pero tiene dos recorridos que se pisan: `ventas-documentos`/`ventas-pedido` (tipologías PD/AP/FP) y `ventas-1`/`ventas-2` (tipologías A/F/O/PV).
- El workflow es el bloque más duro del bloque de estudio: mezcla configurar, probar y autorizar, y exige usar un fichero CSV.
- Lo busqué en Configurar. Está en Operar y me confundí.

---
## 1. Compras › Configurar › compras-1 (proveedor y artículo)
**Dónde me atasco**
- Paso 1 «Tipo ID fiscal»: se dice «elige primero País emisor». Está dicho, pero en el paso, no en la tabla de campos.
- Orden del alta: el grupo G{INI} se asigna al proveedor en `compras-precios` (hay que volver a la ficha del proveedor). Está avisado, pero obliga a ir y volver.
- `Holding`: aparece en el paso 3 con «Déjalo como T{INI}». No sé qué es un holding; la explicación está en el campo, no en el paso.

**Palabras sin explicar o explicadas tarde**
- «Tercero» se explica (ficha común), pero «categoría», «clave fiscal», «zona impositiva ESCO», «SII» (sí se explica), «Domiciliación» (se explica en el campo, no en el paso 3 donde se escribe `0`).
- «Plan contable PGE 2008»: se dice «escribe ES», pero nunca qué es PGE ni por qué 2008.
- «Subcuenta propia», «relación ACR/PRO»: se explica qué es cada una, pero no por qué se necesitan dos.

**Pasos que no podría hacer solo**
- P3 del proveedor: «Central de compras» es un desplegable y «Proveedor compras» es un campo de texto. Sin la nota de problemas, el error de pareja es casi seguro.
- Pasos del artículo: la misma captura (`compras-v-11`) se usa en tres pasos distintos; no sé dónde mirar en cada uno.

## 2. compras-precios
- Entendible. Echo en falta: qué pasa si no hay precio en la tarifa (hay una nota, «escribe 12,50 a mano»), pero no hay aviso previo de que la tarifa no se aplica sola en la demo.
- «VL» se explica una vez (variante logística) y luego se usa sin glosa en `ventas-pedido` (sí se explica de nuevo allí).
- «Cantidad mínima» y «Condición» del grupo: se definen en una línea, sin ejemplo.
- P1 «Nuevo › Nuevo»: no dice por qué hay dos «Nuevo».

## 3. compras-tipos
- El mejor ejemplo de tipologías: campo a campo, con `Tabla origen`, `Sumando`, `Copiar líneas` y la regla «máximo 4 caracteres».
- Atascos: P2 de la factura dice «Suministros»; solo en una EXP se dice que Suministros = albaranes de compra. «NSAL/DISP» se define.
- «Relación proveedor ACR» se repite en los tres documentos con la misma explicación; bien.
- Falta: una tabla-resumen final de los cuatro documentos (qué origen, qué serie, qué asiento) para comprobar que has entendido la cadena.
- El código de 4 caracteres se avisa con «2 iniciales», pero `OC{INI}`, `PC{INI}`, `AO{INI}` y `FC{INI}` con 3 iniciales dan 5 caracteres en la mayoría de ellos; el aviso está solo en una EXP y un PROB.

## 4. Compras › Operar › compras-workflow («Aprobar pedidos: workflow»)
**Dónde lo buscaría**
- En Configurar. Todo el bloque es configuración: validación, grupo, rol, circuito y tipología. Solo el último tercio (autorizar) es operar. El menú del bloque ya lo dice en su EXP: «la configuración está en Finanzas y el trabajo diario en Gestión». El bloque entero está en Operar porque va «al final del módulo a propósito».
- Propuesta: dos bloques. «Montar el workflow» en Configurar y «Probar y autorizar un pedido» en Operar. Si se prefiere uno solo, que la etapa lo diga en el título: «Configurar y probar un workflow».

**Dónde me atasco**
- Paso previo: el bloque presupone que sé hacer un pedido de compra (`compras-3`), pero no lo enlaza ni explica por qué aquí uso proveedor `00010` y artículo 13500620 a 4,00 en vez de mi T{INI} a 12,50. El ejemplo «10 unidades a 4,00 = 40,00» contradice el 12,50 del resto del módulo.
- Concepto de partida, «validación»: en el texto es «una comprobación programada», en el paso es una fila de un catálogo de 50. No sé por qué elegimos la 36.
- `Revalidación`: aparece como proceso que «lanza el workflow», pero guardar no lo lanza. Un junior espera que bloquee al guardar; hay que leer la EXP completa.
- El pedido se crea a mano con un número que tecleo (`0PW{INI}0001`) porque «la ficha es genérica y es un fallo de la demo». Eso rompe todo lo aprendido: el ERP numera solo.
- No hay pestaña de líneas: hay que escribir un CSV a mano (P5) e importarlo (P6). Los pasos del asistente de importación («Selecciona datos», «Mapeado de columnas», «Opciones importación») no se detallan.
- Identificador pedido (`cabid`): hay que apuntarlo y meterlo en el CSV; si me equivoco, no hay línea.

**Palabras sin explicar**
- «Token», «Evaluación de WKF», «Traza de validaciones», `is_authorizable`, `run_data`, `box_id_target`, «Usuario público (`public`)», «Designar/Retornar/Denegar», «gcompedh», «cabid», «linrel», «canpre», «impnet», «dtoimp», «Holding» (de compras-1).
- Una frase compara con Ventas («en ventas validas con un botón», «en las tipologías de ventas sí sale Nuevo como»). Compras va antes que Ventas en el orden de módulos: aún no sé de qué hablas.

**Pasos que no podría hacer con lo que se dice**
- Mapear columnas del importador.
- Elegir qué usuario asignar si `public` no sale.
- Entender por qué Receptor y Facturador valen `0` y `00010` y de dónde salen (solo «en la captura»).
- Interpretar la captura `cob-workflow-17`: muestra Estado «Validado» y Bloqueos «V» y el paso dice «no los copies».

**Captura vs texto**
- `cob-workflow-17` casa con el paso, pero muestra datos que hay que ignorar (Validado, V) y las columnas de la lista incluyen «Procesos: Presupuesto» que no se explica.

## 5. Ventas › Configurar › ventas-cliente
**Dónde me atasco**
- «Este bloque no crea nada de cero»: bien dicho, pero hay que haber hecho antes dos bloques de otros módulos (Contabilidad, Compras). Está enlazado en texto, no con botón al bloque.
- La condición de cobro R{INI}/P{INI} («2 vencimientos a 30 y 60 días») se creó en Compras, un bloque de gestión; no es obvio que un cliente de Ventas dependa de un bloque de Compras.
- «Workflow del tercero (TER)» se nombra en el PROB y en la EXP sin definir. El workflow se explica por primera vez en el último bloque de Compras. Un junior que no lo hizo se pierde.
- «Estado» significa cosas distintas según la ficha: está avisado, bien.

**Palabras sin explicar**
- «Agrupación empresas ALL», «Modalidad/Método facturación», «Portes debidos/pagados», «Holding», «Riesgo», «Comercial vs Agente»: el último par sí se aclara.
- «Domiciliación bancaria»: la explican en una nota.

**Qué echo en falta frente a Compras**
- Compras tenía «Grupo de precios/Tarifa»: aquí «Grupo precio» está vacío y se dice que el precio se teclea. Correcto, pero sin decir por qué en Ventas no hay tarifa.

## 6. ventas-documentos
**Bien frente a Compras**
- Sí explica las tres tipologías campo a campo (pedido, albarán y factura), con las capturas de las tipologías PDCP/APCP/FPCP.
- Sí explica «Nuevo como» y la regla de los 4 caracteres.

**Lo que echo en falta frente a Compras**
- No hay tipología de **oferta** aquí: está en `ventas-2` dentro de Operar. En Compras sí estaba junto a las demás.
- El concepto «condición selección» (`tipdoc IN ('AP{INI}')`) es nuevo y no está en Compras: se explica, pero el junior no sabe SQL ni dónde ver `tipdoc`.
- «Expedición albarán *», «Clase *», «Valorar *», «Relación cliente *» tienen una frase vaga («Clase de expedición», «Cómo se valora el precio»).
- «NSAL/DISP» aparece como «cuentas logísticas» sin explicar «no saldo». Sí se explica en `ventas-1`, `ventas-2` y en Compras.
- No hay tabla resumen de la cadena pedido › albarán › factura.

**Pasos que no podría hacer**
- P1 del pedido: «Nuevo como» sobre la tipología PED. `ventas-1` dice «No uses Nuevo como»; ver sección 8.

## 7. ventas-pedido (Operar › Vender)
**Bien**
- Bloque muy claro: pasos numerados, asiento 43000/47000/70000 con importes, vencimientos de 121,00.

**Dónde me atasco**
- «Importe neto» mal calculado (50,00 en vez de 200,00) en el albarán: se llama fallo de la demo y se corrige con «Importe dto. 1» y luego «0». Un junior no entiende por qué; no se dice cómo comprobar si le sale a él antes de tocar.
- «DOMICILIACION BANCARIA DE LA EMPRESA NO ENCONTRADA» se anuncia en `ventas-cliente`, se resuelve aquí (cambiar «Tipo efecto» a EF) y vuelve a aparecer en `ventas-1`. Un junior cree que se ha equivocado en el cliente.
- «Contabilizar dos veces» si sale `Process gconasih_InsertCasientos`: instrucción técnica sin explicar qué es.
- «Hacienda Pública deudora por IVA» contra 47000: se avisa de que es configuración de la demo; confunde a quien sabe contabilidad y a quien no.

**Palabras sin explicar**
- «Prevista», «Docflow» (se define como gráfico), «Evolucionar estado», «Retroceder», «Situación», «Servido o Facturado», «banda FINALIZADO», «justificante AC», «ALMACEN CENTRAL código 0».

**Captura vs texto**
- `ventas-n-41` muestra el menú ⌄ con «Docflow, Registros fiscales, Albaranes de ventas a conformar, Desconformar»; casa con el texto. La captura trae `Estado Provisional` y cliente CCP, avisado en el bloque.

## 8. ventas-1 y ventas-2 («Practicar otros circuitos»)
**Contradicciones con lo anterior**
- `ventas-documentos` dice «copia con Nuevo como PED/ACL2/FV». `ventas-1` dice: con «Nuevo como» sobre AV da un error y hay que usar «Nuevo en blanco». `ventas-2` vuelve a usar «Nuevo como» sobre AV y dice que aquí sí funciona. Un junior no sabe cuál es la norma.
- Dos juegos de tipologías para lo mismo: AP{INI}/FP{INI} (Configurar) y A{INI}/F{INI}/A{INI}2/O{INI}/PV{INI} (Operar). `ventas-2` reutiliza F{INI} «del bloque anterior» y la condición `tipdoc IN ('A{INI}','A{INI}2')`, que no coincide con `tipdoc IN ('AP{INI}')` de FP{INI}.
- `ventas-1-cliente` dice «pulsa Nuevo» en el paso 1 y luego «si ya sale no lo repitas»; `ventas-cliente` dice «no pulses Nuevo». Un junior duplica el cliente.
- Albarán: `ventas-documentos` y `ventas-pedido` dicen que el albarán no genera asiento; `ventas-1` dice que sí (plantilla AV, 43090) y que la venta queda «contada dos veces a propósito». Es correcto como ejercicio, pero choca con la regla anterior y nadie lo advierte al principio.
- Códigos de más de 4 caracteres: `A{INI}2` y `PV{INI}` con 3 iniciales son 5 caracteres. El bloque solo avisa de la regla en `O{INI}`.
- Rutas de acceso diferentes para el tercero: «Finanzas › Maestros › Terceros › Registro terceros» (ventas-cliente) y «Gestión › Maestros › Terceros › Datos › Registro» (ventas-1, error 1).
- `ventas-1` cita «mira el error 2 de «Contabilizar el albarán»» (sección que es la propia).

**Estructura**
- En Operar se crean tipologías (A{INI}, F{INI}, O{INI}, PV{INI}, A{INI}2): eso es Configurar. Un junior no sabe que debe volver a crearlas.
- La etapa se titula «Practicar otros circuitos» pero sustituye en parte a ventas-documentos.
- Las dos tipologías duplican el mismo documento de la demo (AV, FV, POF, OV), sin que se sepa qué va dónde.

**Otros**
- El asiento de albarán 43090 y FVOA no se explica a quien no sabe contabilidad («pendiente de facturar»).
- `ventas-2`: fechas de ejemplo `12-11-2026` y Fin vigencia hasta `31-12-2026`; hoy es 26-11-2026, así que una oferta de un solo día vencería; se avisa, bien.

## 9. Ventas frente a Compras: qué echo en falta
| Tema | Compras | Ventas |
|---|---|---|
| Tipologías campo a campo | Sí (oferta, pedido, albarán, factura) | Pedido, albarán y factura en Configurar; oferta en Operar |
| Tabla-resumen de la cadena | No | No |
| Workflow | Un bloque propio al final | Solo se menciona «workflow TER» sin enlace |
| Condición de cobro | Se crea en Compras | Se comprueba en Ventas, sin enlace al bloque |
| Tarifa/precio | Lista y grupo de precios | Sin tarifa: se teclea el precio, sin explicar por qué |
| Numerador | Una sección y un error propio | Lo mismo, bien |
| Qué hacer si falta algo | «Vuelve a ese bloque» | Igual, pero sin enlace pulsable |
| Ejercicio equivalente | Operar: pedir, recibir, facturar, abonar | Operar: pedido, albarán, factura, sin devoluciones |

## 10. Los 10 problemas más graves (resumen)
1. workflow › toda la estructura: es configuración puesta en Operar; lo busqué en Configurar. Ayudaría partirlo en «Montar» (Configurar) y «Probar y autorizar» (Operar).
2. workflow › Probar: pedido sin numerador automático, sin pestaña de líneas y con CSV a mano e importador sin detallar. Ayudaría un CSV descargable y los 4 pasos del asistente con captura.
3. workflow › Probar: proveedor 00010 y precio 4,00 contradicen T{INI} a 12,50 del módulo. Ayudaría decir por qué y usar el mismo precio.
4. workflow › intro/Probar: compara con «Ventas» (botón Validar, Nuevo como) antes de haberlo visto. Ayudaría quitar la referencia.
5. workflow › Autorizar: token, evaluación de WKF, traza, is_authorizable sin glosar. Ayudaría un glosario de 5 términos.
6. ventas-1/ventas-2 › tipologías: dos juegos de tipologías (AP/FP frente a A/F/A2/O/PV) y condiciones `tipdoc` distintas. Ayudaría un único juego o una frase que diga qué se reutiliza.
7. ventas-1 frente a ventas-documentos › «Nuevo como»: una dice «úsalo», otra «no lo uses». Ayudaría una norma única: en blanco si no hay origen.
8. ventas-1-cliente › P1: «pulsa Nuevo» cuando ventas-cliente dice «no pulses Nuevo» (cliente duplicado). Ayudaría quitar la sección o convertirla en comprobación.
9. ventas-1/ventas-2 › códigos: `A{INI}2` y `PV{INI}` son 5 caracteres con 3 iniciales y dan «Demasiado largo». Ayudaría la regla en cada código.
10. ventas-1 › albarán contabiliza (43090) frente a «el albarán no genera asiento» de ventas-documentos/pedido. Ayudaría avisar al principio de que el circuito difiere a propósito.

Otros: ventas-cliente usa «workflow TER» sin definir; DOMICILIACION BANCARIA se anuncia en el cliente y se arregla en la factura; falta tarifa y oferta en Configurar de Ventas.
