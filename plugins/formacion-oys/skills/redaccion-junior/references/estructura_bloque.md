# Estructura de un bloque para juniors

Índice: 1 Campos del bloque · 2 Fórmulas por campo · 3 Parte (sección), campos y pasos · 4 Test, checklist, problemas, aprendido · 5 Ejemplo antes y después · 6 Lista de control.

El esquema JSON exacto está en `_fuente/ESQUEMA.md` y `app/src/types.ts`; las normas de estilo, en `criterios-sergi`; el alta y edición de bloques, en `modulo-y-bloque`. Aquí solo está **cómo se escribe** cada campo para que lo entienda alguien sin base. Fuentes: `auditoria/guia_junior.md` §1 y §4-6, `_fuente/GUIA_REDACCION.md`, `_fuente/UX_V5.md`, `auditoria/redaccion_*.md`.

## 1. Campos del bloque y dónde los ve el alumno

El alumno recorre cada bloque en este orden: **Concepto → Guiado → De memoria (opcional) → Test → [Práctica] → Demo real**; los «problemas» salen al final de la Demo real como «Si algo falla».

| Parte | Campo JSON | Dónde se ve |
|---|---|---|
| Qué vas a aprender | `objetivo` | Cabecera del bloque |
| Por qué importa | primer párrafo de `concepto` (sale grande) | Concepto |
| Dónde está la pantalla | `secciones[].ruta` + último párrafo del `concepto` | Migas y texto |
| Partes | `secciones[]` | Concepto y Guiado |
| Pasos con resultado | `pasos[].texto` + `pasos[].detalle` | Guiado |
| Si algo sale mal | `problemas[]` y `avisos` tipo `problema` | Demo real |
| Qué has aprendido | `aprendido[]` | Final del Guiado |
| Comprobaciones | `checklist[]` (6-15, concretas y verificables) y `test[]` (4-5 preguntas) | Demo real y Test |

## 2. Fórmulas por campo

**`objetivo`**: una frase, verbo en futuro y segunda persona, **un logro comprobable**.
- Bien: «Registrarás la factura de tu proveedor T{INI} y la contabilizarás por 151,25.»
- Mal: dos logros y uno abstracto («Sabrás qué es un plan contable y qué te dicen los indicadores de cada cuenta»). Mejor: «Sabrás encontrar una cuenta en el plan contable y leer en su ficha si es de gasto o de ingreso.»
- Sin códigos de tabla ni ids internos. Si usa un término nuevo, lo explica el primer párrafo del `concepto`.

**`concepto`** (párrafos separados por `\n\n`):
1. **Qué es + comparación cotidiana + consecuencia** (tres frases como mucho). «Un albarán es el papel que llega con la mercancía. Es como el tique de entrega de un paquete. Si no lo registras, el almacén no sabe que la tiene y la factura no se puede comprobar.» Fórmulas de consecuencia: «Si no lo haces, …» (no se puede facturar, el IVA sale mal, pagas dos veces, el banco no cuadra) o «Gracias a esto, …» (cobras a tiempo, sabes lo que debes).
2. Cómo lo hace Axional y de dónde salen los datos del bloque.
3. `Ejemplo: …` con las cifras del caso (base, IVA, total, debe y haber).
4. Frase puente si el bloque practica con datos que no son del caso (`caso_continuo.md` §6).
5. Último párrafo: `Dónde: «Finanzas › Cobros y Pagos › Remesas › Registro de remesas».`

**Cajas** (prefijo al inicio de un párrafo o ítem; máximo una de cada tipo por parte): `Ejemplo:`, `Fíjate:` (lo que se pasa por alto), `Ojo:` (lo que, si se hace mal, rompe algo). Los `avisos` conservan su `tipo` (`problema`, `nota`, `solucion`) y se escriben en una o dos frases accionables.

## 3. Parte, campos y pasos

**Parte (`seccion`)**
- `paraQueSirve`: una o dos frases que empiezan por el beneficio («Aquí decides…», «Sirve para…»).
- `explicacion`: 2 a 5 ítems, una idea cada uno; una lista cuando hay 3 o más elementos del mismo tipo.
- `ruta`: array en toda parte que abre pantalla (`null` solo si no hay pantalla o la ruta no se ha comprobado). Se escribe con **›** y rótulos literales, nunca con `>` ni `/`, y **sin códigos técnicos pegados** (el código va aparte: «En el buscador: gvenmovd»).
- `campos`: `campo` (no se toca: casa con los puntos de la captura), `significado` = qué es + para qué sirve en una frase («Plazo hasta el vencimiento. Decide cuándo pagas.»), `ejemplo` exacto. Si un campo se deja como viene, di «Déjalo como viene».

**Paso (`pasos[]`)**
- `texto`: imperativo, una acción, rótulo literal: «Pulsa «Validar»». Datos con su campo: «En «Cantidad» escribe 10». El primer paso de una parte que abre pantalla dice la ruta.
- `detalle`: empieza por lo que **ves**: «Verás…», «El estado pasa a…», «La línea suma 10 × 12,50 = 125,00». Una o dos frases. Todo paso que pulsa, guarda o valida lleva `detalle`; también los de «Fíjate en…» (qué debe sacar el alumno de esa pantalla).
- Si la captura es de otro registro, dilo en el `detalle`.
- `pregunta` (De memoria), `imagen` y `hotspot` no se tocan.

## 4. Test, checklist, problemas, aprendido

- **`problemas`**: de 2 a 5 por bloque que trabaja en el ERP. `problema` = el síntoma tal como sale: «Sale «Cuenta tercero [T{INI}] no existente para relación: [PRO]»». `solucion` = qué haces, dónde, y cómo compruebas que se arregló, en una o dos frases. Típicos de principiante: «No encuentro la pantalla» (ruta y buscador del menú), «No me deja guardar» (campos con asterisco rojo), «Mi registro no sale en la lista» (filtro o empresa), «Fecha fuera de periodo» (periodo cerrado). La web quita de la Demo real los problemas repetidos con un «Ojo» del Concepto: no los dupliques a mano.
- **`aprendido`**: 3 a 5 frases en segunda persona y pasado, una por logro concreto, con el código del alumno y la cifra del caso cuando la haya: «Has creado la tipología PC{INI} para tus pedidos.»
- **`test`**: 4-5 preguntas basadas solo en lo que el bloque enseña (si no se enseña, es un hallazgo). Se puede aclarar la redacción y la `explicacion`; **nunca** se cambia la respuesta correcta ni su sentido.
- **`checklist`**: acciones que el alumno puede comprobar en la demo, con códigos y cifras.

## 5. Antes y después

> Antes: «Pulsa Contabilizar y comprueba que se generan el asiento contable, la cartera de efectos y los registros fiscales.»
> Después: texto «Pulsa «Contabilizar».» · detalle «Se crean tres cosas: el asiento (151,25), el efecto a pagar a T{INI} y el registro fiscal con 26,25 de IVA.»

## 6. Lista de control (por bloque)

- [ ] `objetivo`: un logro, futuro, sin códigos internos.
- [ ] Primer párrafo del `concepto`: qué es + comparación + consecuencia.
- [ ] Último párrafo: `Dónde: «… › …».`
- [ ] `ruta` en cada parte con pantalla; `›` y no `>`; sin códigos técnicos.
- [ ] Cada paso que actúa lleva `detalle` con el resultado visible.
- [ ] De 2 a 5 `problemas` con el síntoma literal.
- [ ] Términos de la lista común explicados la primera vez en el módulo (`glosario_frases_modelo.md`).
- [ ] Enganchado al caso (cifras de `caso_continuo.md`) o con frase puente.
- [ ] Ningún dato ajeno sin decir de dónde sale.
- [ ] Frases de 20 palabras como mucho; párrafos de 3 frases o 60 palabras.
- [ ] Ids, `campos.campo`, imágenes, hotspots, preguntas, `correcta`, orden y número de pasos intactos.
- [ ] JSON válido y `python3 -I plugins/formacion-oys/skills/auditar-contenido/scripts/comprobar_contenido.py` sin avisos nuevos.
