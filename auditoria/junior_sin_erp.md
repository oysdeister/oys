# Recorrido de un junior sin ERP (Fundamentos, Maestros, Compras, Ventas, Tesorería)

Lectura del contenido (app/src/content/*.json) y de la portada y la página del módulo Compras en http://localhost:5191.
No se ha editado nada del curso. Los ids son los de bloque (y sección entre corchetes cuando ayuda).

## Lo que funciona bien
- fundamentos-navegar: ruta de menú, Ctrl+K, rejilla frente a ficha, botones (guardar/eliminar atenuados). Es el mejor bloque: cada término se explica al usarlo y cada paso trae captura con marco.
- Casi todas las secciones tienen «Dónde», «Para qué sirve» y un resultado esperado por paso.

## Dónde me pierdo

### Caso continuo (empresa, cliente, banco, artículo)
1. maestros-v-4 (concepto): «Las operaciones las grabas en la empresa 0 de la demo y mueves el dinero por el banco BBVA_{INI}, que crearás en Cartera». Creo S{INI} con ejercicio y banco CAIXA{INI}, y después nada de eso se usa: documentos en la empresa 0 y banco BBVA_{INI}. Necesito una frase que diga por qué creo una empresa que no voy a usar, o que el caso use S{INI}.
2. maestros-2 / ventas-1: «tu cliente es C{INI}» y, en Ventas, «das de alta como cliente a T{INI}, tu proveedor, porque las capturas son suyas». Cambio de personaje a mitad de curso. Necesito un único cliente en todo el caso. La etapa «Lo que ya tienes» de Ventas dice que el cliente ya está dado de alta, y luego ventas-1-cliente lo da de alta otra vez.
3. maestros-2-articulos-log: creo ROD{INI} y se avisa de que «En Compras no lo compras». Hago un maestro que no vuelvo a usar. Necesito saber de entrada que es solo para aprender.

### Pantalla y rutas
4. ventas-1 (todas las rutas): «Albaranes (en el buscador: gvenmovd)», «Clientes › Registro («Maestro de clientes»; en el buscador: gcliente)». La ruta del menú lleva pegadas notas y códigos técnicos y no sé qué teclear. Necesito la ruta limpia y el código aparte.
5. compras-1-relaciones, compras-2-conformar, compras-2-contabilizar: «ruta: Ficha del tercero › pestaña Relaciones › Añadir relacion», «desplegable (⌄) junto al título › Conformar». Eso no es una ruta de menú, y «⌄ junto a la estrella» no lo reconozco como botón. Necesito una captura del ⌄ y distinguir ruta de menú de ruta dentro de la ficha.
6. compras-1-tercero: pantalla en «Finanzas › Maestros › Terceros»; proveedor y cliente en «Gestión › Maestros › Terceros». No sé por qué el mismo tercero se crea en dos menús. Necesito una frase: Finanzas guarda la ficha, Gestión añade el papel de cliente o proveedor.
7. tesoreria-1-banco: «También llegas por Finanzas › Tesorería › Maestros › Bancos propios, o con el buscador escribiendo cban». Dos caminos al mismo sitio, más el menú de Maestros (Parametrización › Empresas › pestaña Bancos propios) y «Finanzas › Cobros y Pagos › Maestros › Auxiliares». Tres entradas a «bancos propios» sin saber cuál usar.

### Términos que salen sin explicar
8. compras-1-tercero: «Holding = T{INI}», «Categoría 002 Proveedores», «Tipo ID fiscal No censado». Necesito saber qué es un holding y por qué pongo mi propio código.
9. maestros-v-4-banco-propio: «escribe 0 en Proyecto y Sección», «Tipo de dirección 0», «Dirección fiscal 0», y la agrupación «AG{INI}, o CA» (no sé quién crea AG{INI}).
10. compras-3-pedido (P1): «Delegación CENTRAL, Departamento COMPRAS, Receptor 0 y Facturador T{INI}, Cambio 1, unidad de negocio». Ocho campos obligatorios y ninguno explicado. Necesito una línea por campo o «déjalo como viene».
11. compras-tipos y ventas-1-tipologia-*: «tarjeta Sumando», «Rotura», «Compromiso inversión No», «Evolución riesgo», «Valorar Tarifa», «Expedición albarán». Se dicen una vez y no sé si importan. Necesito marcar cuáles son «déjalo así».
12. compras-tipos (concepto): «Sumando ... le descuenta lo copiado». Sumar y descontar a la vez. Necesito un ejemplo numérico (pedido 10, recibo 4, quedan 6).
13. NSAL se explica distinto: compras-2 «no saldo: mercancía que aún no está en el almacén»; ventas-1 «fuera del inventario». Necesito una sola definición.

### No sé qué esperar tras el paso
14. compras-3-pedido: título «Failed to parse the expression [${Pedidos compras}]», número escrito a mano (0PC{INI}01), «tu pedido se queda sin líneas, y es normal». Todo el bloque documenta lo que falla en la base, no lo que debe pasar. Necesito saber qué se espera del pedido y que el fallo está previsto.
15. compras-2 y tipologías de albarán: el pedido no tiene líneas, así que el albarán se hace «a mano como uno sin origen», pero antes configuré origen Pedidos con «Sumando». Aprendo un circuito Oferta → Pedido → Albarán que luego no recorro. Necesito decir al principio qué cadena sí se ejecuta en esta base.
16. compras-albaran-contabilizar, compras-generar-factura, compras-abono-devolucion: se practica con «ese albarán de 4 unidades», de otro (0AC000017), y en el texto mi caso es de 10 unidades. Importes duplicados (50,00 y 125,00; 110,50 y 276,25; 60,50 y 151,25). Necesito que el texto y la captura hablen de lo mismo, o un cuadro «tu dato / lo que ves en la captura».
17. compras-abono-devolucion: «no pudimos completar el abono ... Lo que sigue es lo que sí funciona hasta ahora». Un bloque que termina en una cabecera vacía. Necesito saber qué resultado doy por bueno al acabar.
18. compras-factura y compras-generar-factura: dos formas de llegar a la misma factura. «Para cada albarán usa una de las dos». Necesito una regla para elegir y que no se haga el mismo albarán dos veces.
19. ventas-1-factura: «la venta queda registrada dos veces ... No es un error tuyo». Se enseña a propósito un asiento mal. Necesito que se diga en el concepto, con el resultado correcto al lado.
20. ventas-1-tipologia-factura (P5): «Condición selección: tipdoc IN ('A{INI}','A{INI}2')». Es SQL. Aviso de «copiar tal cual» pero no sé qué hace si me equivoco.

### Selector Configurar / Operar y menú lateral
21. Página del módulo Compras: «Si vas a usar el ERP como usuario, empieza por Operar», con Operar resaltada y el botón «Empezar por el bloque 1» (que es de Configurar). Operar necesita lo creado en Configurar (T{INI}, TF{INI}, FC{INI}). Necesito una indicación única para quien nunca ha usado el ERP: «primero Configurar».
22. Mismo sitio: «Cómo moverte por el ERP: ya lo viste en Datos maestros, en «Antes de empezar»», pero la navegación ahora está en Fundamentos › Moverse por el ERP. Referencia vieja.
23. Portada: «El curso empieza por lo básico en «Datos maestros»», cuando el módulo 0 es Fundamentos. Y Ventas se anuncia como «de la oferta al cobro pendiente» pero tiene 2 bloques (albarán y factura) y la oferta no se hace.
24. Menú lateral: el bloque lleva un número corrido (Operar empieza en el 6), lo que ayuda. Pero ventas no tiene bloques en Configurar («ya lo tienes») y no sé si esa fase se salta o se abre.

### Tesorería: conciliar el banco
25. tesoreria-4 / tesoreria-5: el extracto de mi banco tiene seis líneas (3.000,00; 151,25; 3,50; 10,00; 2 × 121,00), pero solo doy de alta una. Las capturas son de CAPT_BCO y de la demo TRI (8.080,15, 480,00). En la conciliación (P1 y P2) marco movimientos de una captura que no es la mía. Necesito que la captura coincida con mi extracto de 10,00 o que se avise paso a paso («no verás tu fila, usa la tuya»).
26. tesoreria-4 (concepto): signo del extracto «en la demo TRI salen en negativo; en TUTORIAL en positivo». Dos reglas de signo y debe/haber «desde el punto de vista del banco» frente a mi 572 «al revés». Para un junior es el punto más difícil: necesito una tabla de 3 filas (importe, extracto, tesorería) para mi movimiento de 10,00.
27. tesoreria-5-botones: «Cancelar extractos», «Generar tesorería», «Conciliar cartera», «Conciliar impagados», «Conciliar banco». Cinco botones con nombre parecido y solo uso uno. Necesito una tabla «si ves X, pulsa Y» al inicio del bloque.
28. tesoreria-1 (concepto) frente a maestros-v-4: banco propio CAIXA{INI} (Maestros) y BBVA_{INI} (Tesorería, «lo creaste en Cartera»). Dos bancos con nombres distintos y el módulo 5 queda por medio. Necesito un solo banco o aviso de dónde se crea.
29. Capturas: sin captura 39/146 pasos de Compras, 45/87 de Ventas y 24/144 de Tesorería; 35 pasos de Tesorería citan la captura de otra cuenta. Sin imagen no sé dónde está el botón (p. ej. «el disquete», «las flechas < >», «tarjeta»). Necesito imagen en los pasos con botón nuevo.

## Resumen de necesidades por prioridad
1. Un caso único y coherente (cliente, banco, empresa) y las cifras del texto iguales a las de las capturas.
2. Decir por adelantado qué partes de la base TUTORIAL fallan y qué resultado final se da por bueno.
3. Rutas de menú limpias, separadas de códigos del buscador y de rutas dentro de la ficha.
4. Una línea sobre cada campo obligatorio que se rellena sin entender (o «déjalo como viene»).
5. Una sola indicación de orden Configurar → Operar para quien llega sin experiencia.
