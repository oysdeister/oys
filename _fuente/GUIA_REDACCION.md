# Guía de redacción de los bloques

Para quién: un junior recién contratado, sin formación financiera, que nunca ha abierto Axional. Español de España, tuteo, frases cortas. Rótulos del ERP literales entre «». Cifras, cuentas, códigos y rótulos **exactos**: si dudas de un dato, no lo toques.

## Medidas

- **Frase**: una idea, 20 palabras como mucho (mejor 12–15). Si hay «y… y…» o un punto y coma, parte la frase.
- **Párrafo**: 3 frases o 60 palabras como mucho. En `concepto`, un párrafo por línea (`\n\n`).
- **Lista** en vez de párrafo cuando hay 3 o más elementos del mismo tipo (estados, pasos, opciones). En JSON, cada ítem de `explicacion` es un punto de la lista: uno por idea.
- Sin relleno ni voz de manual («cabe destacar», «según la documentación», «es importante señalar»).
- Nombres de tabla (`gcompedh`, `cefectos`) solo si el alumno los tiene que escribir; si no, fuera.

## Cómo arranca un bloque (`objetivo` + `concepto`)

1. `objetivo`: **qué vas a conseguir**, en una frase con verbo de acción («Darás de alta…», «Sabrás leer…»).
2. Primer párrafo del `concepto` (sale grande): **qué es y por qué importa en la empresa**, con una comparación cotidiana. Ej.: «Un plan contable es como el índice de cajones de un archivo: cada importe va a su cajón».
3. Párrafos siguientes: cómo lo hace Axional y qué datos vas a usar (de dónde salen los códigos y los importes).
4. Un párrafo `Ejemplo: …` con números si el bloque mueve importes (base, IVA, total, debe/haber).

## Cajas (prefijos que la web convierte en recuadros)

Úsalos al principio de un párrafo del `concepto` o de un ítem de `explicacion`:

- `Ejemplo: …` → recuadro de ejemplo. Un caso concreto con cifras o códigos reales del bloque.
- `Fíjate: …` → recuadro de atención. Lo que se suele pasar por alto (un rótulo que cambia de nombre, una pestaña escondida).
- `Ojo: …` → recuadro de aviso. Lo que, si se hace mal, rompe algo o no deja seguir.

Máximo una caja de cada tipo por parte. Los `avisos` mantienen su `tipo` (`problema` = «Ojo», `nota`, `solucion`); escríbelos como una o dos frases accionables.

## Cada parte (`seccion`)

- `paraQueSirve`: una o dos frases. Empieza por el beneficio («Aquí decides…», «Sirve para…»).
- `explicacion`: de 2 a 5 ítems, cada uno con una idea. La primera palabra que haga falta explicar se explica ahí mismo o se deja tal cual para que la enlace el glosario.
- `campos.significado`: qué es + para qué sirve, en una frase («Plazo hasta el vencimiento. Decide cuándo pagas.»). `ejemplo` exacto, sin tocar.
- `pasos.texto`: imperativo, una acción y el rótulo literal («Pulsa «Guardar»»). Los datos a teclear, con su campo: «En «Cantidad» escribe 10». `detalle`: qué ves después o por qué; una o dos frases. `pregunta` (De memoria) **no se toca**.

## Términos técnicos

La primera vez que sale en el bloque, explícalo entre comas o con «es decir» (asiento, efecto, remesa, tipología, Docflow, mnemotécnico, tercero, debe/haber…). Después úsalo sin más. El glosario subraya los términos automáticamente: no hace falta marcarlos.

## Cierre: «Qué has aprendido» (`aprendido`)

De 3 a 5 frases en segunda persona y pasado, una por logro concreto del bloque («Has creado la tipología PC{INI} para tus pedidos.»). Solo lo que el bloque enseña de verdad.

## Lo que no se toca

Ids (`id` de módulo, bloque, sección), `campos.campo` (casa con los puntos de la captura), `imagen`, `hotspot`, `pregunta`, `ruta`, `correcta`, `numero`, `duracionMin`, el token `{INI}`, cifras, códigos de cuenta, rótulos y el número y orden de secciones, pasos, `checklist`, preguntas y opciones del test (guardan el progreso). Problemas y test: se pueden aclarar redacciones, nunca cambiar la respuesta correcta ni su sentido.
