# Revisión como junior: Ventas (cliente, documentos, vender) y Compras (workflow)

Lector simulado: recién contratado, sin formación contable y sin haber usado nunca un ERP.
Alcance leído de principio a fin: navegación de `ventas.json`, bloques `ventas-cliente`, `ventas-documentos`, `ventas-pedido` y `compras-workflow` (`compras.json`), con los glosarios `ventas.json` y `compras.json`.
Capturas abiertas y comparadas con el texto (28): ventas-n-03, 04, 05, 07, 12, 14, 17, 21, 27, 28, 33, 36, 37, 41, 46, 47, 50, 51, 53, 55, 56 y cob-workflow-5, 9, 11, 17, 18, 24, 25.
No se ha editado ningún contenido. Formato de cada punto: ubicación › frase › por qué atasca › propuesta.

---

## 1. BLOQUEA (un junior se queda parado o hace algo mal sin saberlo)

### B1. Importe neto del albarán: arreglo «mágico» sin explicación y con una captura que no lo muestra
- Ubicación: ventas-pedido › «Crear el albarán desde el pedido» › pasos «Comprueba el Importe neto… Si sale 50,00», «Abre la ficha de la línea… pon Importe dto. 1», «Vuelve a poner Importe dto. 0».
- Frase: «Reescribir el mismo Precio no recalcula: el disquete ni se activa si el valor no cambia.»
- Por qué atasca:
  1. Nadie dice que es un fallo de la demo. Un junior cree que lo ha hecho mal («10 × 20 = 50»), o que en un ERP real se arregla poniendo un descuento falso.
  2. En la fila de la línea hay dos enlaces azules (el «1» del n.º de fila y el código 13500620). El paso dice «enlace del n.º de fila» sin señalarlo en la captura (n-36).
  3. La captura n-37 es la ficha con Importe dto. 0,00 e Importe neto 50,00, es decir, el estado ANTES de tocar nada. No enseña el 199,00 ni el 200,00 que promete el texto.
  4. «Disquete» y «icono ⟳» no se han explicado antes de este punto.
- Propuesta de texto: «Esto es un fallo de la demo (en un ERP real no pasaría): la línea copia bien el precio pero calcula mal el neto. Para obligar al ERP a recalcular, haz un cambio y deshazlo. 1) En la rejilla Líneas pulsa el número azul de la izquierda de la fila (el “1”), no el código del artículo. 2) En “Importe dto.” escribe 1 y pulsa el icono del disquete (arriba a la derecha): el neto pasa a 199,00. 3) Escribe 0 y guarda: pasa a 200,00.» Añadir captura de la ficha con 199,00 y otra con 200,00.

### B2. Compras › workflow › «Probar»: añadir la línea del pedido importando un CSV sin decir cómo se crea el fichero
- Ubicación: compras-workflow › «Probar: el pedido se bloquea» › paso 2.
- Frase: «Añade una línea al pedido con “Líneas de pedidos › ⋮ › Importar” (CSV con “;”)… cabid;linrel;orden;codart;…»
- Por qué atasca:
  - No se dice con qué programa se crea el CSV, ni dónde se guarda, ni la codificación.
  - No se explica qué es cada columna (cabid, linrel, varlog, udmcom…).
  - «El primer número es el Identificador pedido… el tuyo no será 18»: en la captura 17 el «Identificador pedido» sale vacío y en blanco, y no se dice dónde verlo una vez guardado.
  - «Deja dtoimp a 0 o la línea no entra» no tiene sentido para un junior.
  - La captura 18 muestra solo el último paso del asistente sobre una lista general de líneas de TODOS los pedidos, con el menú lateral replegado. No se ve cómo se llega a «Líneas de pedidos › ⋮ › Importar».
  - En ventas la misma acción se hace con «Líneas › Nuevo». El junior no entiende por qué aquí hay que importar.
- Propuesta de texto: explicar el porqué («la ficha de pedidos de compra de la demo no deja añadir líneas a mano, por eso se importan») y dar el fichero listo: «Descarga `lineas-pedido.csv` (botón) y cambia solo el primer número por el Identificador de tu pedido, que ves en la columna “Identificador pedido” de la lista Pedidos». Si no hay descarga, dar los pasos para crearlo (Bloc de notas, “Guardar como”, UTF-8) y una captura de cómo abrir el asistente.

### B3. Compras › workflow › «Probar»: pedido tecleado a mano y captura con el estado contrario al texto
- Ubicación: compras-workflow › «Probar» › paso 1 + captura cob-workflow-17.
- Frase: «Escribe el Pedido a mano, por ejemplo 0PW{INI}0001… El Estado debe quedar en “Provisional”.»
- Por qué atasca:
  - En el bloque de numeración de ventas se enseña que el número «lo pone el ERP, tú no lo escribes» y que sale con la máscara #e#s#6n (0PV000006). Aquí se pide lo contrario sin motivo, y con un formato distinto (0PW{INI}0001, y la serie es PC).
  - Se enumeran nueve campos a rellenar de una vez (Empresa, Delegación, Departamento, Proveedor, Divisa, Tipo efecto, Forma pago, Receptor, Facturador) sin explicar ninguno (Receptor y Facturador no están en el glosario).
  - La captura 17 muestra Estado «Validado» y Bloqueos «V», justo el estado que el texto dice que NO debe tener. El junior no sabe si ha hecho algo mal.
  - Si el pedido se queda «Validado», la revalidación «no devuelve nada» y el aviso reconoce «No hemos confirmado cómo pasar un pedido ya Validado de vuelta a Provisional». Callejón sin salida.
- Propuesta de texto: «En esta demo el número del pedido no se genera solo: lo escribes tú (0PW{INI}0001). Es solo para esta práctica.» Sustituir la lista de nueve campos por una tabla corta (campo / qué poner / qué es). Poner una captura con Estado «Provisional». Añadir el rescate: «Si el pedido ha quedado Validado, crea otro con número 0PW{INI}0002; no intentes arreglarlo.»

### B4. Dependencias ocultas: el bloque da por hecho cliente, condición de cobro, artículo y agente creados en otros módulos
- Ubicación: ventas-cliente › concepto («Ya existe como tercero… y como cliente… no crees otro») y todo el módulo Ventas. La navegación del módulo no tiene «Antes de empezar».
- Frase: «C{INI} ya existe: lo creaste en “Dar de alta los datos básicos de contabilidad”… La condición de C{INI} es la que creaste en “Dar de alta los datos básicos de gestión”.»
- Por qué atasca:
  - «Datos básicos de gestión» no está en Ventas. Es `maestros-2`, dentro del módulo Compras («Maestros de compra»), y «datos básicos de contabilidad» está en Contabilidad. Un junior que abre Ventas primero no sabe que debe ir antes a dos módulos, ni cuál es su orden.
  - Los títulos citados no son enlaces.
  - Si falta algo, el texto dice «no crees otro», así que no hay camino alternativo. Falta un artículo (13500620, A01 «Agente 01», R{INI}/P{INI}) y el bloque se rompe en el pedido.
- Propuesta de texto, antes del primer bloque de Ventas: «Antes de empezar necesitas (con enlace a cada bloque): 1) tercero C{INI} con relación Clientes (Contabilidad › Datos básicos de contabilidad); 2) cliente C{INI}, condición de cobro R{INI}/P{INI} y artículo 13500620 (Compras › Datos básicos de gestión). Si algo falta, vuelve a ese bloque. No lo crees aquí.» Añadir lo mismo como nota en `etapas.ts` (campo `nota`).

### B5. «Abrir un registro que ya existe» no se enseña, y la captura del cliente es la de CREAR uno
- Ubicación: ventas-cliente › «Comprobar el tercero…» paso 1 («entra en la ficha de C{INI}») y «Completar el cliente…» paso 1; ventas-documentos › pasos «Abre la tipología PED / ACL2 / FV»; navegación › «Cómo moverte por el ERP».
- Frase: «Abre “Registro” de Clientes y busca C{INI} en la lista. Si no está, pulsa “Nuevo”.»
- Por qué atasca:
  - «Cómo moverte» explica Nuevo, Guardar y el disquete, pero no cómo abrir un registro existente desde una lista (clic en el código azul o en el n.º de fila), ni cómo buscar uno (filtros, «Buscar»).
  - La captura n-07 es el diálogo «Nuevo» de CCP con Estado «Provisional» y la lista de fondo. Muestra crear, mientras el texto dice «ábrelo y comprueba». El hotspot «Tipo cliente» solo señala un campo.
  - Con 5 clientes en la lista basta mirar. Con la demo compartida (muchos alumnos) no, y no se enseña el filtro.
- Propuesta de texto, en «Cómo moverte»: «Abrir un registro: en la lista, pulsa su código azul (o el número de fila). Buscarlo: escribe en la fila de filtros o usa “Filtros”.» En el paso: «En la lista, pulsa el código azul C{INI}. No pulses “Nuevo”: ya existe.» Cambiar la captura por la ficha abierta (no el diálogo de alta).

---

## 2. CONFUNDE (se entiende a medias, o el texto y la imagen se contradicen)

### Capturas que no corresponden o contradicen el texto
| Dónde | Problema | Propuesta |
|---|---|---|
| ventas-cliente › «Comprobar la condición de cobro…» paso 2, captura n-12 | La pregunta es «¿Qué campo dice cuántos vencimientos y a cuántos días cobras?» (respuesta: Plazo pago). El hotspot marca «Tipo efecto» (x 1,8 %, y 31 %), no «Plazo pago» (a la derecha). Además la captura es de CCP en pleno alta (se escribe «30D»), no «abre la fila y cierra con Cancelar». | Mover el hotspot a «Plazo pago» y etiquetarlo así. Texto: «Plazo pago = cuándo vence (30D: a 30 días). Tipo efecto = cómo se paga (TF: transferencia).» |
| ventas-pedido › contabilizar, paso 2, captura n-47 | El texto dice «la prevista solo muestra dos líneas: 43000… y 47000…». La captura muestra el error en rojo y la tabla «Asientos programables» sin ninguna línea de apuntes. | Reescribir: «Verás el error en rojo y no se despliegan apuntes. Si los desplegaras faltaría la línea de ventas.» O sustituir la captura. |
| ventas-pedido › contabilizar, pasos 5-6, capturas n-50 y n-51 | Ambas muestran «Resumen de apuntes (5)» y el texto dice «tres apuntes». Salen 3 filas más 2 de totales. Aparecen sin explicar «FINALIZADO», diario DV y justificante AC. | Añadir: «El (5) cuenta las 3 líneas más las 2 de totales. FINALIZADO es solo la banda de color del asiento ya contabilizado. DV = diario de ventas (el “libro” donde se anotan las ventas).» |
| ventas-pedido › vencimiento, captura n-55 y texto | La captura muestra tipo EF «Al contado», mientras en n-27 y n-41 el mismo documento tiene TF y 30 días. El texto explica el cambio en el aviso, pero la secuencia visual es contradictoria. Además «Contado» con vencimiento el 28-12 (factura 25-11, 33 días) suena absurdo. | En el paso: «En esta captura el tipo es EF porque se corrigió en la cabecera (pasos de la prevista). Tu efecto tendrá el tipo R{INI}.» En glosario «Contado (EF)»: «En la demo EF es solo una etiqueta; el vencimiento lo marca la forma de pago (30D), no el tipo.» |
| compras-workflow › Rol / Circuito, capturas cob-workflow-9, 11, 24 y 25 | Los textos hablan de RW{INI} y «APROBADOR PEDIDOS {INI}»; las capturas muestran el rol con código RCP, y en la rejilla de etapas «Perfil o roles asignados» sale el código (RCP), no la descripción. En la tabla de campos el «ejemplo» de «Perfil o roles asignados» es la descripción, y en el paso se pide el código. | Unificar: «Perfil o roles asignados: escribe el CÓDIGO del rol (RW{INI}), no su descripción.» |
| compras-workflow › Grupo, captura cob-workflow-5 | Se usa para los pasos 1 y 2. El paso 1 («pulsa Añadir grupo») enseña el diálogo ya relleno de GCP con «Información adicional». El texto dice que esa nota «no es obligatoria», pero la captura la muestra rellenada y no dice cuándo se rellena. | Una captura por paso: lista vacía con el botón «Añadir grupo» y diálogo relleno. |
| compras-workflow › Gestionar, captura cob-workflow-25 | La pantalla «Acciones pendientes» muestra ~20 campos técnicos (run_data con JSON, run_cabid, box_id_target…). Solo importan Autorizar y is_authorizable. | Marcar solo los dos con recuadro y añadir: «Lo demás es técnico: no lo toques.» |

### Palabras o conceptos que no se explican la primera vez (y no están en los glosarios)
- **Debe / Haber** (ventas-cliente › concepto, «líneas al debe y al haber que suman lo mismo»; también en `ventas-documentos`). No están definidos en ningún glosario de Ventas. Propuesta: «Debe = lo que entra a la cuenta, Haber = lo que sale. En una factura de venta: el cliente te debe 242 (debe), 42 son IVA y 200 son venta (haber).»
- **Efecto, vencimiento, cartera (de cobros / de efectos), Evolucionar estado** (ventas-pedido › «Ver el vencimiento»). Solo hay una definición de «Contado (EF)» en el glosario. Falta «Cartera de efectos»: «lista de los cobros pendientes de la empresa».
- **Domiciliación bancaria** (ventas-cliente, ventas-pedido, problemas): ni qué es ni por qué la exige el «Tipo efecto». Propuesta: «Domiciliación: autorización para cobrar el recibo directamente en la cuenta del cliente. La empresa de la demo no tiene cuenta propia para ello, por eso el asiento falla con ese tipo de efecto.»
- **Validar / Provisional / Validado / Contabilizado / Facturado / Activo**: se usan desde ventas-cliente sin decir qué hace «Validar» ni en qué se diferencian. Además «Estado» significa cosas distintas en tercero (Provisional/Validado), cliente (Provisional/Activo) y documento. Falta una tabla «Estados y qué significan».
- **Docflow**: aparece en el resumen y en el concepto del bloque, y solo se explica en la última sección; no está en el glosario de Ventas.
- **Comercial (cliente) vs Agente (pedido)**: el glosario define «Agente» como «comercial que lleva la venta», y el cliente tiene un campo «Comercial» distinto, con el mismo código. No se aclara si son lo mismo. Propuesta: «En el cliente, “Comercial” es el responsable interno (por defecto el mismo código). En el pedido, “Agente” es quien lleva la venta y se pide siempre: elige A01.»
- **Tipología**: ventas-documentos › concepto «es como un molde» pero en el glosario de Ventas solo existen «tipología de pedido/albarán/factura», no la genérica, y la primera mención en la navegación es un inciso entre comillas.
- **Serie, Rotura, #e#s#6n** (ventas-documentos › numerador): se da la máscara pero no se descifra cada símbolo (e = empresa, s = serie, 6n = contador de 6 cifras). La definición de «Rotura» en la tabla de campos («Máscara para crear una nueva serie: cuándo empieza un contador nuevo») es circular. Propuesta: «Rotura: qué cosas hacen que el contador empiece desde 1 (aquí: otra empresa u otra serie).»
- **tipdoc IN ('AP{INI}')** (ventas-documentos › factura): no se dice qué es `tipdoc` (la columna «tipo de documento» del albarán), ni que hay que teclear apóstrofos rectos, mayúsculas y paréntesis exactamente así. Si copian con comillas tipográficas, falla en silencio («no aparece tu albarán»).
- **Portes «Debidos» / «Modalidad Mensual» + «Método 1 Albarán-1 Factura»** (ventas-cliente): si es mensual, ¿por qué cada albarán tiene su factura? Propuesta: «Mensual aquí no se usa: con “1 Albarán-1 Factura” cada albarán genera una factura. Lo comprobarás al conformar.»
- **Empresa 0, Delegación CENTRAL, Departamento VENTAS, Almacén 0 / «ALMACEN CENTRAL»** (ventas-pedido): se dice «vienen puestos», pero no qué son. La frase sobre el almacén «El código es 0, pero al teclear CENTRAL lo encuentra por el nombre» es confusa y la captura n-28 muestra solo «0».
- **VL, Lote, Cantidad precio, Importe bruto, Base imponible 1** (pedido y albarán): VL solo está en el glosario de Compras. Aparecen como «se rellenan VL 0, Lote 0» sin traducir.
- **Cuenta 47000 «Hacienda Pública, deudora por IVA»** (ventas-pedido › contabilizar, y captura n-51). El texto dice que el IVA es lo que cobras y debes ingresar, pero el nombre de la cuenta («deudora») sugiere lo contrario. El glosario dice que en un plan bien montado sería la 477. Propuesta, en el paso: «En la demo el nombre de la cuenta es “deudora”, que es el de otra operación; es una peculiaridad de la demo, no un error tuyo.»
- **Compras-workflow**: «Traza de validaciones», «token», «evaluación del circuito / Evaluación de WKF», «Bloqueos V» («Letra del bloqueo»; ¿V de qué?), «Stock planificado», «Tipo Normal», «Código workflow», «Manual». Solo están en el glosario Validación, Grupo, Rol, Circuito y Revalidación.
  - Propuesta de definiciones breves: «Traza: el historial de cada comprobación (Pendiente/Autorizado). Token: el “testigo” que avanza por el circuito; si está pendiente, alguien tiene que resolverlo. V = bloqueo de Validación.»
- **Casilla «Manual»** (compras-workflow › Grupo): «Sale marcada. Su efecto no se ha comprobado en la demo». No dice qué hacer (¿dejarla? ¿quitarla?). Propuesta: «Déjala como viene.»

### Pasos que un junior no sabría hacer con lo que dice
- ventas-cliente › «Comprobar la condición de cobro» › paso 1: «Si falta, “Añadir cobro” abre el diálogo para crearla»: no dice qué valores poner (R{INI}, P{INI}) ni de dónde salen (solo en el bloque de Maestros). El paso 2 dice «No cambies nada». Se contradice con «Si falta».
- ventas-cliente › «Si no hay fila, pulsa “Añadir relacion”…»: no dice que se elija «Tipo tercero: Cliente» (la captura n-05 lo trae por defecto). Funciona de casualidad.
- ventas-documentos › «Crear la tipología de factura» › pasos 1 y 3: sin captura (el paso 1 no la tiene). Junto con «Nuevo como» y el cambio de dos campos, deja muchos puntos ciegos.
- ventas-documentos › «Enlazar»: se editan dos tipologías ya guardadas; «ficha ya guardada» contra el modo lista/diálogo anterior: no se dice cómo volver a abrirlas.
- ventas-pedido › albarán › «Origen»: la lista (captura n-33) muestra los pedidos de todos los alumnos (0PV000002… 0PV000006), con solo número, empresa y fecha. El texto dice «Elige el que validaste», pero ningún paso anterior dijo «apunta tu número 0PV…». Propuesta: en el paso de validar el pedido, añadir «Apunta tu número de pedido (0PV…): lo necesitarás para elegir el Origen del albarán».
- ventas-pedido › albarán › orden «primero Origen, después Cliente»: justificación «Es el orden con el que se comprobó el circuito» (voz del autor). El junior no sabe qué pasa si lo invierte. Propuesta: «Si eliges el cliente antes, el campo Origen se vacía / no ofrece tus pedidos» (si es cierto) o quitar la frase.
- ventas-pedido › contabilizar › pasos 3 y 5: bifurcación sin criterio: «Si sale “DOMICILIACION…”, pasa a provisional, cambia a EF y 30D». El junior no sabe si le tocará. Además esto cambia el resultado (1 vencimiento de 242 en vez de 2 de 121) y contradice ventas-cliente («No la cambies: el caso necesita esos dos vencimientos»). El checklist acepta ambos finales sin decir cuál es el esperado.
  - Propuesta: decidir un camino único. Si el error es seguro con R{INI}, ponerlo como paso normal y decir «Verás 1 vencimiento de 242». Si es condicional, dar una prueba clara de en qué caso sale.
- ventas-pedido › contabilizar › paso 5: «A la segunda se abrió el asiento… No se ha aclarado por qué ocurre». Voz del autor; el junior no sabe si dudar de su propio trabajo. Propuesta: «A veces el ERP necesita pulsar Contabilizar dos veces. Si tras “Aceptar” solo ves “Process gconasih_InsertCasientos”, recarga y repite una vez.»
- compras-workflow › Rol: «Código usuario → public»; el aviso dice que el usuario de la sesión (oys.jma) no aparece. El junior no sabe cuál es «su usuario» ni dónde verlo. Propuesta: «Tu usuario aparece arriba a la derecha (icono de persona). Si no está en la lista, elige public: significa “cualquier usuario”.» Y reordenar: el `concepto` dice «el rol es la lista de personas que pueden firmar», pero luego se asigna «public» (todos). Añadir: «En una empresa real aquí pondrías a las personas concretas.»
- compras-workflow › Gestionar / Revalidación: «filtra por tu pedido» sin explicar cómo (hay filtros en la cabecera de la consulta). Solo la captura 19/24 lo insinúa.
- compras-workflow › Autorizar y Retroceder: la sección completa es un «señuelo»: dos pantallas cuyos nombres sugieren acción («Autorizar», «Retroceder») y que «solo listan». El junior las abre pensando que son el paso de autorizar. Propuesta: renombrar la sección «Dos consultas que NO sirven para autorizar» y moverla a Ampliar (opcional), o avisarlo al principio del bloque.

### Frases largas, ambiguas o con voz de «cuaderno de campo»
- ventas-cliente › concepto, párrafo 3: «Dos datos mandan sobre los documentos de venta. La condición de cobro del tercero dice con qué tipo de efecto y en cuántos días cobras; el pedido, el albarán y la factura la copian. El efecto es el cobro pendiente: el recibo que cobrarás. La relación contable “Clientes” (CLI) dice a qué cuenta del cliente, la 43000, va el asiento de la factura.» Siete ideas en tres frases y cuatro términos sin definir (efecto, relación contable, 43000, asiento).
- ventas-pedido › concepto: cinco párrafos; el «Ejemplo» mezcla 8 números (13500620, 20,00, 200,00, 21 %, 42,00, 242,00, 43000/47000/70000, 121,00). Propuesta: una tabla de dos columnas con el asiento esperado.
- navegación › «Cómo moverte por el ERP»: una lista de 11 viñetas, de las cuales dos («Ojo… tipologías… 4 caracteres» y «Fíjate: números de documento orientativos») no son de navegación. La frase «Con iniciales de dos letras (por ejemplo, CL) salen PDCL, APCL y FPCL en los bloques principales, y ACL, FCL, ACL2, OCL y PVCL en los de práctica» es ilegible para un principiante. Propuesta: «Los códigos de tipología tienen 4 caracteres como máximo: usa PD + tus 2 iniciales, AP + 2 iniciales, FP + 2 iniciales.»
- `{INI}`: no se define de dónde salen las iniciales. Unas veces son 2 letras (tipologías) y otras el código completo (C{INI}, T{INI}); con 3 letras se corta «solo en tipologías». Falta una regla única: «{INI} = tus iniciales (2 letras). Si tienes 3, usa las 2 primeras SIEMPRE, también en el filtro `tipdoc IN (...)`.»
- compras-workflow: voz de autor y dudas del propio autor en el texto del alumno: «No hemos confirmado en las notas…», «El autor», «oys.jma», «No hemos comprobado si limita a alguien», «Denegar, Retornar y Designar no se han probado», «(así, con la errata)», «Failed to parse the expression…». Un junior lee «no se ha probado» como «puede fallarme». Propuesta: moverlas a una caja «Limitaciones de la demo» al final, redactadas para el alumno («En la demo estas tres no se pueden practicar»).
- ventas-cliente › pasos: el tercero «ya existe» y a la vez se dan instrucciones para crearlo (Problemas: «Tipo ID fiscal… al guardar un tercero nuevo»). Esa entrada es de otro bloque y distrae.
- ventas-cliente › paso 5 «Al pulsar Validar no apareció ningún mensaje: el Estado ya era Activo y las validaciones, 0»: voz del autor, e innecesario si el paso es «comprueba que queda Activo».

### Saltos de lógica
1. Ventas-documentos explica que la tipología del albarán «no genera asiento» y la de la factura «sí», pero en el concepto de Ventas (navegación) el albarán «baja el stock», y en el glosario hay «Contabilizar un albarán… con plantilla AV». Aparecen tres versiones: el albarán no contabiliza, el albarán se puede contabilizar (AV, 43090) y el albarán baja stock (sin ningún paso que lo compruebe). Propuesta: una frase que lo ordene («En este curso el albarán NO se contabiliza; en otras empresas sí, con la plantilla AV») y quitar o demostrar el stock.
2. Navegación: «Cada documento nace del anterior copiando sus líneas», pero PD{INI} no tiene origen y el pedido se teclea a mano. Se aclara después; conviene anunciarlo desde el principio.
3. El bloque Ventas-pedido enseña «Acciones › Generar factura» (aviso) y luego dice «aquí usarás Conformar»: dos caminos sin criterio. Propuesta: una frase de cuándo usar cada uno.
4. Compras-workflow: la configuración se hace en 4 secciones consecutivas (Grupo → Rol → Circuito → Tipología) con una vuelta atrás obligatoria («Vuelve a Grupo de validaciones… rellena Código workflow»). El junior lo olvida y el pedido se bloquea «sin botón para autorizar». Propuesta: punto de control al final de «Circuito»: «Antes de seguir, comprueba que la línea 1 del grupo ya muestra tu WF{INI}.»
5. Compras-workflow › «Probar»: la ficha del pedido «no tiene botón Validar», pero el junior viene de aprender en ventas que se «Valida» el documento. Una frase al inicio: «En esta demo no se valida con botón: se lanza con Procesos › Revalidación.»

---

## 3. MEJORA (calidad, tono, orden)

- Poner en cada bloque principal un único aviso fijo al inicio: «Las capturas son del cliente CCP (códigos 0PV000006, 0AV000006, 0FV000007, cuenta 43000.00CCP). Los tuyos serán otros». Hoy la advertencia está repetida en ~15 sitios (concepto, detalle de cada paso, avisos) y el junior acaba sin leer ninguna.
- Pasos que juntan 3 acciones o más: ventas-cliente › «Abre la pestaña Facturación: Tercero facturación…, Dirección…, Agrupación…, Modalidad…, Método…» (5 comprobaciones); compras-workflow › «Probar» paso 1. Propuesta: una tabla campo/valor y un solo verbo («comprueba»).
- Pasos sin captura: ventas-documentos › factura paso 1; ventas-pedido › pedido paso 4 (Agente) y albarán paso 1; compras-workflow › tipología pasos 1 y 2 (se apoya en la captura 16, que es el final); compras-workflow › Rol paso 1 y 2 comparten captura. El hotspot del paso 2 de grupo y el paso 1 coinciden con la misma imagen.
- Glosario de Ventas: añadir Debe/Haber, Efecto, Cartera de efectos, Vencimiento, Docflow, Domiciliación, Provisional/Validado, Base imponible, Stock, Tipología (genérica), Cuenta 47000. Quitar «DISP y NSAL» de la primera lectura (detalle logístico que no se usa) o enlazarlo solo desde la tipología de albarán.
- Glosario de Compras: añadir Traza, Token, Bloqueo (V/C/I), Receptor/Facturador, Stock planificado.
- Orden de ideas en ventas-documentos: «Dónde» enumera dos rutas; las tablas de campos repiten literalmente la frase de explicación. Reducir las tablas a lo que se teclea y dejar fuera lo que «viene puesto».
- ventas-documentos › «Con “Nuevo como” copias… PED, ACL2 y FV»: no dice por qué ACL2 y no ACL, ni qué hacer si no existen (se queda sin camino alternativo en la demo de otro entorno).
- Textos de test: la pregunta del albarán «¿Qué eliges primero?» se responde «Con ese orden se comprobó el circuito»; quitar esa justificación de autor y poner una razón funcional.
- ventas-pedido › vencimiento: «la fecha la calcula el ERP» (25-11 + 30D = 28-12). Un junior calcula 25-12 y se asusta. Propuesta: «El ERP cuenta 30 días desde la “Fecha valor” y la ajusta a un día hábil/de pago; no tiene que coincidir exactamente con tu cálculo» (confirmar la regla real antes de escribirla).
- Docflow: la captura n-56 muestra tres círculos con un «1» y tres tarjetas; el texto dice «Verás tres tarjetas». Aclarar que el círculo es el número de documentos de ese tipo en la cadena.
- compras-workflow › concepto: «Piensa en el jefe de una oficina que firma las compras» es una buena analogía; repetirla al principio de «Gestionar» («tú ahora eres el jefe que firma»). Mover «Este bloque va al final del módulo a propósito» a la ficha del módulo, no al texto del alumno.
- Ortografía/rótulos: el texto avisa de «Añadir relacion» (sin tilde) y «Circuito worflow»: está bien avisarlo una vez, pero conviene marcarlo con un estilo específico («rótulo literal del ERP») para que no parezca un error del curso.

---

## 4. Top 5 de problemas más graves
1. B1 (albarán): arreglo del Importe neto con «Importe dto.» sin explicar que es un fallo de la demo y con una captura que no lo enseña.
2. B2 (workflow): importar un CSV sin decir cómo se crea ni cómo se llega al asistente.
3. B3 (workflow): número de pedido tecleado a mano (contradice el bloque de numeración) y captura con Estado «Validado» frente al «Provisional» que exige el texto, sin salida si se equivoca.
4. B4 (Ventas): dependencias ocultas de otros módulos (cliente, condición R{INI}/P{INI}, artículo 13500620, agente A01), sin «Antes de empezar».
5. B5 y rama de domiciliación: no se enseña a abrir un registro existente (la captura n-07 es la de crear uno), y la prevista contable abre una bifurcación (error de domiciliación) que cambia el resultado (1 vencimiento de 242 frente a 2 de 121) sin criterio.
