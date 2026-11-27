# Auditoria: junior de otro sector (hosteleria y atencion al cliente)

Perfil: sin estudios tecnicos ni contables, cuesta leer textos largos. Recorrido: portada, Fundamentos, Cartera (Configurar y SEPA), Tesoreria (extracto), Activos (amortizar), caso final, busqueda y errores. Contenido leido en `app/src/content/*.json`; portada, busqueda y errores vistos en el navegador (localhost:5191). No se ha editado nada.

Lo que funciona (para no romperlo):
- Los `concepto` abren con una analogia cotidiana: "cuaderno de la empresa", "compra online", "hucha al reves", "abono de transporte anual de 120 euros" (icon-activos-conceptos). Es lo que mas engancha.
- Las tarjetas "Compruebalo: ... -> respuesta" de Fundamentos son cortas y me dejan comprobar si lo he entendido.
- El caso continuo (10 x 12,50 = 125,00; IVA 26,25; 151,25; banco 3.077,25) da hilo.
- La busqueda con Cmd+K pone el Glosario primero y los bloques despues. "no me deja guardar" encuentra 8 errores.

## Puntos donde me pierdo o me aburro

### Portada
1. `home` (portada). "Cada bloque es una tarea del ERP: lees la idea, la haces paso a paso y la repites en la Demo real." Un ERP no se explica hasta entrar en el bloque 1. Necesito una frase de por que me importa: "el ERP es donde la empresa apunta todo; un fallo aqui es un cobro que se pierde". Ademas no se que es "Demo real".
2. `home`, "Como funciona un bloque". Seis pasos (Concepto, Guiado, De memoria, Test, Practica, Demo real). "Practica" y "Demo real" se parecen y no se cual hacer. Necesito: "Haz 1, 2 y 4. El resto es opcional".
3. `home`, "No necesitas formacion previa. El curso empieza por lo basico en «Datos maestros»." Contradice la tarjeta "Modulo 0 Fundamentos" de arriba. Necesito que diga "Fundamentos".
4. `home`, contador "0 de 89 bloques, 41 h". Asusta. Necesito un primer hito corto: "Hoy: 1 bloque, 20 minutos".

### Fundamentos
5. `fundamentos-1` / `fundamentos-1-asiento-apunte`. "Apunte 1: 600 Compras, debe 125,00. Apunte 2: 472 IVA soportado, debe 26,25. Apunte 3: 400 Proveedores, haber 151,25."
   Dos secciones antes dije que "lo que entra va al debe" en Bancos. Aqui una compra (sale dinero) tambien va al debe. Me bloqueo.
   Necesito una regla corta con 3 ejemplos: "gasto y lo que tengo al debe; lo que debo y lo que cobro al haber". O una tabla de dos filas con un ejemplo de bar: "compras cafe y pagas a 30 dias".
6. `fundamentos-1-plan-contable`. Una lista de 7 grupos con 12 numeros de cuenta (100, 400, 472, 477, 570, 572, 600, 700...). Para alguien que no sabe contabilidad es una pared de numeros.
   Necesito solo 4 cuentas para el caso (banco, proveedores, compras, ventas) y el resto en un cajon "para mirar luego".
7. `fundamentos-1-debe-haber`. "Al final del caso, el saldo de Bancos sera 3.077,25." No veo como sale. Necesito la cuenta en una linea: 3.000 + 242 - 151,25 - 13,50 = 3.077,25.
8. `fundamentos-2-banco`. "La contabilidad tiene su propia cuenta 572 Bancos... N43 es el formato de fichero de la banca espanola." Llega "N43" sin necesidad. Necesito: "El banco te manda una lista de movimientos. La empresa la compara con la suya".
9. `fundamentos-2-documentos`. "el albaran... puede contabilizarse en una cuenta puente (la 40090)... vuelve a cero al facturar". Concepto avanzado en el primer dia. Necesito moverlo a una nota "mas adelante".
10. `fundamentos-2-contabilizar`. "El ERP los saca del documento con la plantilla contable, la regla que dice que cuentas lleva el asiento de cada documento". Necesito un ejemplo cotidiano: "como la maquina de cafe: pulsas 'cafe con leche' y ella sabe los ingredientes".
11. `fundamentos-2-cierre`. "regularizacion", "cuenta de resultados", "apertura" en 4 frases seguidas. Necesito la imagen del cierre de caja del bar: contar, dejar a cero, empezar al dia siguiente con el fondo de caja.

### Cartera
12. `carteras-1` (bloque entero). 34.000 caracteres, 4 tareas (plazo, tipo de efecto, tercero, factura de compra) en un bloque. Me canso. Necesito 4 bloques de 5 minutos, con una frase de por que importa cada uno.
13. `carteras-1-tipo-efecto`. "UN/EDIFACT «Credit transfer», Codigo Factura-E «Transferencia» y Codigo fiscal «Transferencia»". Tres siglas sin explicar. Necesito: "Elige 'Transferencia' en los tres. No se tocan mas".
14. `carteras-1-tercero`. "«No censado» se usa sin NIF real y permite poner 0 en «Id. fiscal»... El aviso naranja «Cif already exists!» solo informa...". Muchos avisos juntos y el "PGE 2008". Necesito saber que puedo ignorar los avisos naranjas.
15. `carteras-1` (concepto). "CAR{INI} no es tu proveedor del caso: T{INI} no se toca." Rompe el caso continuo y no se por que he de crear otro tercero. Necesito reutilizar T{INI}, o una frase de por que.
16. `carteras-1-factura-compra`. "En la base TUTORIAL el IVA va a la cuenta 00000.00000 «Instrumental». En una base bien configurada iria a la 472." Me dicen que lo que veo esta mal sin poder arreglarlo. Necesito esta nota en un aviso aparte, no dentro del paso.
17. `cartera-mandato-sepa` (concepto). "Core para particulares y empresas, B2B solo entre empresas... pago unico o recurrente... CSDDS... 430, o 431 si el recibo se llevaba como efecto en gestion de cobro." Siete conceptos en cuatro parrafos. Necesito la analogia: "el mandato es la autorizacion firmada para que te cobren el recibo del gimnasio".
18. `cartera-mandato-sepa-mandato`. El paso final "Pulsa «Guardar»" termina en "En la demo no se llega a guardar: sale el error de la imagen" (ID 15486). Me hacen seguir pasos que se que fallan. Necesito saberlo antes de empezar, con la solucion ("avisa a quien administre la base").
19. `cartera-mandato-sepa-remesa`. Dos veces el aviso de la cuenta "23000 (inmovilizado)... anomalia de la demo". No se si lo hago bien o mal. Necesito un solo cuadro "En la demo sale X. En una empresa real saldria Y. No te preocupes".
20. `cartera-mandato-sepa-fichero`. "No se ejecuto en la demo... Esto no se comprobo en la demo." Me pide un paso y a la vez dice que no se ha probado. Necesito "Este paso solo se mira; no se hace".

### Tesoreria (extracto)
21. `tesoreria-4` (concepto). "Debe y haber van aqui desde el punto de vista del banco" y despues "En tu cuenta 572 es al reves". Dos reglas opuestas en la misma pagina. Necesito una tabla de 4 lineas: "Pagas al proveedor: en el extracto sale como X, en tu 572 como Y".
22. `tesoreria-4` (concepto) y `tesoreria-4-manual`. Mezcla de bases: TRI, BBDD TUTORIAL, CAPT_BCO "no es la tuya", y el signo cambia segun la base ("480,00 en el extracto y -480,00 en tesoreria"). Necesito UN solo ejemplo con mi banco BBVA_{INI}: "tu comision de 10,00".
23. `tesoreria-4-comunes` y `tesoreria-4-propios`. "Consejo Superior Bancario", "Asociacion Espanola de Banca", "Criterio filtro «%»", "Posicion + Operacion de entrada". Muy tecnico para un primer extracto. Necesito: "Esto lo configura el responsable; tu solo mira que existe".
24. `tesoreria-4` (concepto), 9 parrafos antes del primer paso (N43 con tres partes, continuidad de saldos, integracion, conceptos). Necesito empezar por: "El banco te manda sus movimientos. Tu los comparas con los tuyos", y dejar el formato para despues.

### Activos (amortizar)
25. `icon-activos-2` (concepto). El texto de abajo repite el ordenador de 1.200 y el componente de 4.000 al 33 %, con "68x" y "28x" sin explicar el "x". Necesito un unico ejemplo (el ordenador: 25,00 al mes) y que se vea el asiento en dos lineas.
26. `icon-activos-2` / `icon-activos-conceptos`. "en tu caso no hay activos... Con un ordenador de 1.200,00 a 4 anos...". El caso continuo se rompe en el modulo 8 y las capturas son de la empresa ALA. No veo mi empresa aqui. Necesito que mi empresa S{INI} compre el ordenador en el caso o una frase de por que este modulo es distinto.
27. `icon-activos-2-sistemas`. "«Sistema»: el juego de valores... «Sistema amortizacion»: L lineal o D decreciente... sistemas especiales... «Valor inventario», «Valor residual», «Amortizacion acumulada», «Valor neto»". Siete campos en un bloque. Necesito 3 campos clave (porcentaje, anos, valor neto) y el resto, en "mas detalles".
28. `icon-activos-2-traspasos-cambios`. Tres procesos (traspaso, cambio, division) con "cuenta puente de traspasos" y "OPT000101". Necesito: "Esto es opcional. Pasa a 'para saber mas'".

### Caso final
29. `caso-final`. Trece operaciones en un bloque, rutas largas ("Gestion > Ventas > Maestros > Documentos > Albaranes") y cuentas de seis cifras (43000.00901, 47700.00000, 40090). Parece un examen sin ayuda. Necesito dividirlo en 3 bloques (comprar, vender, cobrar y cerrar) y un resumen visual de las 13 operaciones.
30. `caso-final-preparar`. "En la demo grabas dentro de la empresa 0 «Deister Software», porque S{INI} no tiene tipologias ni plantillas." El caso dice que es "tu empresa de principio a fin" y luego se hace en otra. Necesito esta explicacion al principio de todo el curso.
31. `caso-final-comprar`. "Los de «Contabilizar el albaran de compra» y «Generar la factura desde el albaran» usan 4 unidades (50,00 y 60,50); el mecanismo es el mismo." Mis cifras no coinciden con las de la tabla. Necesito que el caso use siempre las mismas cifras.
32. `caso-final-cerrar`. "La regularizacion lleva 70000.00000 Ventas 200,00 al debe y 60000.00000 125,00, una cuenta del grupo 626 por 13,50 y la 129 por 61,50 al haber." Muy denso. Necesito el esquema de cuatro cifras: ventas 200 - compras 125 - gastos banco 13,50 = beneficio 61,50.

### Busqueda Cmd+K
33. Buscador, "IVA". El primer resultado del glosario empieza con "...o se vende. La empresa cobra IVA a sus clientes..." (recortado). No veo la definicion desde el principio. Necesito que el glosario enseñe siempre el inicio de la definicion.
34. Buscador, "IVA". Aparecen "Cuentas de IVA (472 y 477)" y "Grupo de IVA" antes que "IVA repercutido" e "IVA soportado". Necesito primero los conceptos basicos.
35. Buscador, "remesa". El primer bloque ("Cobrar efectos sueltos y en remesa") es uno largo; el que busco, "Crear una remesa de pago", es el tercero. Los resultados se parecen y los distingo por "bloque 5/10/11/12". Necesito una etiqueta en lenguaje llano ("Aprender", "Hacer", "Si falla").

### Pagina de errores
36. `/errores`, buscador "no puedo cobrar" da 0 resultados, aunque "no me deja guardar" si funciona. Escribo como hablo. Necesito que ignore palabras sueltas ("puedo") y busque por la mas util ("cobrar").
37. `/errores`, 332 avisos, muchos repetidos ("No me deja guardar", 4 o mas veces con el mismo texto). Necesito agrupar los iguales y mostrar los frecuentes primero ("Lo que mas pasa").
38. `/errores`. Mensajes tecnicos copiados del sistema: «cperiodo_ins: Fechas del periodo fuera de rango de vigencia en empresa», «TypeError: Cannot read property 'split' of null», «Rotura #e#yy». Necesito debajo una linea llana: "Significa: la fecha esta en un mes cerrado".
39. `/errores`. Las etiquetas "Bloque 25", "Bloque 26", "Bloque 30" bajo Contabilidad basica (24 bloques en la portada) me despistan. Necesito el nombre del bloque con un enlace, sin numero.

## Falta transversal
- "Por que le importa a la empresa": solo aparece en la primera linea de cada `concepto` y se pierde en el resto. Necesito una linea con el coste real ("si el albaran no se contabiliza, el inventario no cuadra con el balance") al inicio de cada seccion.
- Un ejemplo de bar o tienda en cada tema nuevo (debe y haber, efecto, remesa, amortizacion).
- Una caja "Si te atascas, esto lo puedes saltar" en cada bloque largo.
