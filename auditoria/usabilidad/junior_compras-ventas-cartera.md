# Revisión junior: Compras, Ventas y Cartera (noviembre de 2026)

He releído como junior lo que corrigieron los agentes de coherencia (informes `compras.md`, `ventas.md` y `cartera.md`). Lo he leído en el volcado final (`03-compras`, `04-ventas`, `05-carteras`), en el orden de la pantalla, y con `git diff --word-diff`.
He comprobado con `grep` todos los títulos de bloque citados en los textos corregidos. Todos existen y están en el fichero correcto: «Preparar la numeración y los tipos de documento», «Contabilizar el albarán de compra», «Rectificar o sustituir una factura», «Dar de alta los datos básicos de contabilidad», «Qué son los datos básicos», «Vender del albarán a la factura», «Conocer las tipologías de venta», «Cobrar efectos sueltos y en remesa», «Evolucionar una remesa», «Conciliar un cobro y un anticipo»…

## Compras (módulo 3)

| Página | Resultado | Gravedad | Qué arreglé |
|---|---|---|---|
| Portada (frase, etapas) | Se entiende. La primera frase ya dice qué es Compras, y cada etapa empieza con un verbo. | — | — |
| Lo básico del ERP › «Cómo moverte» | Se entiende. La remisión a «Para situarte» › «Lo básico del ERP para este módulo» › «Qué son los datos básicos» existe en Datos maestros. | — | — |
| B1 Dar de alta los datos básicos de gestión | Se entiende. Cliente → ejemplo → «Después pasas a lo físico…» van bien encadenados. | — | — |
| B2 Dar de alta el proveedor y el artículo | Se entiende («Son dos maestros más, como los del bloque anterior»). | — | — |
| B4 Preparar la numeración y los tipos de documento | Se entiende. El ejemplo de la máscara ya va pegado al numerador. | — | — |
| B5 Montar la aprobación de pedidos | Se entiende. | — | — |
| B6 Pedir: de la oferta al pedido | Se entiende. La remisión a «Preparar la numeración…» ya es la correcta. | — | — |
| B8 Contabilizar el albarán de compra | Se entiende. El «Como viste en Contabilidad básica» me sitúa. | — | — |
| B9 Registrar y contabilizar la factura | Se entiende. | — | — |
| B10 Generar la factura desde el albarán | «Para cada albarán usa uno solo. Si ya facturaste ese albarán, usa otro.» No sé a qué se refiere «uno solo»: ¿un albarán, un camino? | 2 | → «Cada albarán se factura por un solo camino: si ya facturaste ese albarán, usa otro.» |
| B11 a B14 (facturas que generan asientos) | Se entienden. B11 ya dice que la factura propia se contabilizó antes. B14 empieza diciendo de qué va. | — | — |
| B15 Devolución y abono | Se entiende. Enlaza con B13, que ya he hecho, y no queda texto de trabajo. | — | — |
| B16 Stock / B17 Probar el workflow | Se entienden. | — | — |
| Examen y glosario | Se entienden. Ya no queda «En el ERP nuevo» ni ningún código de tabla en las preguntas. | — | — |

## Ventas (módulo 4)

| Página | Resultado | Gravedad | Qué arreglé |
|---|---|---|---|
| Portada y «El circuito de ventas» | Se entiende. El albarán remite a «Vender del albarán a la factura», que existe. | — | — |
| «Cómo moverte» › aviso de iniciales | Se entiende («C{INI}, que creaste en Contabilidad básica»; el artículo, «el mismo que usaste en Compras»). | — | — |
| B1 Preparar el cliente | Se entiende. El «Ojo: antes de empezar…» ahora va detrás de explicar tercero, cliente y relación contable, y ya sé de qué me habla. | — | — |
| B1 › aviso FVOA y explicación de plantillas | Se entiende. Anuncia «Conocer las tipologías de venta» en futuro. | — | — |
| B6 Vender del albarán a la factura | Se entiende. La ruta de la plantilla AV ya coincide con la del resto del bloque. | — | — |
| B7 Vender de la oferta a la factura | Se entiende. Deja claro que es una venta de práctica distinta de la del caso. | — | — |
| Glosario y examen | Se entienden. | — | — |

## Cartera (módulo 5)

| Página | Resultado | Gravedad | Qué arreglé |
|---|---|---|---|
| Etapa «Ver la cartera» (etapas.ts) | «qué estados, tipos y acciones los mueven»: un estado no mueve un efecto. Me lío al leerlo. | 1 | → «Ves qué efectos deja una factura, qué estados y tipos tienen y qué acciones los mueven.» |
| Resumen del módulo | Tiene el mismo problema («los estados, tipos y acciones que lo mueven»). | 1 | → «Después lees un efecto, sus estados y tipos y las acciones que lo mueven.» |
| Lo básico › «Qué es la cartera de efectos» › explicación 3 | «lo que nos deben… lo que debemos»: el resto del curso me tutea. | 1 | → «lo que te deben… lo que debes» |
| Lo básico › orden de los bloques | Se entiende. Ya coincide con las etapas. | — | — |
| B1 y B2 (Preparar) | Se entienden. Las remisiones al recuadro «Ojo» de la pestaña Concepto existen: un «Ojo:» en la explicación sale como recuadro. | — | — |
| B3 Ver los efectos de una factura | Se entiende. Enlaza con mi factura de CAR{INI} del B1. | — | — |
| B4 Conocer los estados y tipos de efecto | Se entiende. | — | — |
| B5 Cobrar efectos sueltos y en remesa | Se entiende. | — | — |
| B7 Pagar efectos con una gestión | La frase nueva «Tras pagarlo, el efecto ya no tiene botón «Retroceder» propio…» no deja claro a qué se refiere «pagarlo». | 2 | → «Un efecto pagado con una gestión ya no tiene botón «Retroceder» propio: el pago se deshace abriendo la gestión.» |
| B8 Entender el cierre de una gestión | Se entiende (el actlog remite a «Conocer los estados y tipos de efecto»). | — | — |
| B9 Cobrar solo una parte › parte 1 › paraQueSirve | «del cobro individual»: en todo el módulo ya se llama «cobro suelto». | 1 | → «del cobro suelto» |
| B9 › partes 2 y 3 | Se entienden. La explicación ya no repite los pasos. | — | — |
| B10 a B14 (remesas y tesorería) | Se entienden. Cada concepto enlaza con el bloque anterior, y la lectura de los códigos de remesa está explicada en B5. | — | — |
| B15 Mandato SEPA y remesa de cobro | Se entiende. Las explicaciones ya no copian los pasos, y el «Ojo» va al final. | — | — |
| B16 Recibo devuelto / B17 Descuento | Se entienden. | — | — |
| B18 Procesos avanzados | Se entiende. «Conciliar un cobro y un anticipo» existe en Tesorería. | — | — |
| Glosario y examen | Se entienden. | — | — |

## Dudas funcionales que no he tocado

- Ventas B1 y Compras B1 dicen que la condición de cobro de C{INI} (R{INI} y P{INI}) se pone en «Dar de alta los datos básicos de gestión». Sin embargo, el objetivo de «Dar de alta los datos básicos de contabilidad» dice que ahí se dan de alta el plazo P{INI} y el recibo R{INI} del cliente. Hay que confirmar en qué bloque se asignan al tercero.
- Cartera B2 (ejemplo) dice que los 242,00 de C{INI} llegan «en dos efectos de 121,00: uno suelto y otro por remesa». Cartera B5 cobra un efecto de 242,00 de CAR{INI}. Hay que comprobar que las cifras del caso cuadran.
- Siguen abiertas las dudas que dejaron los agentes anteriores (PROV/FRA, fecha 09-10 frente a 12-11, albarán contable «de T{INI}»…).

## Recuento

- Páginas revisadas: 47 (Compras 14, Ventas 7, Cartera 18, más etapas, resúmenes, glosarios y exámenes).
- Confirmadas sin cambios: 41.
- Arregladas: 6 (1 en Compras y 5 en Cartera: etapa, resumen, tuteo, B7 y B9).
- Pendientes: 2 dudas funcionales nuevas, sin tocar.
- Validación: los 3 JSON cargan, y `comprobar_estructura.py` da 0 errores estructurales y 0 avisos.
