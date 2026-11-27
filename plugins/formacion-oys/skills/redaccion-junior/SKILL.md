---
name: redaccion-junior
description: "Cómo redactar bloques de la plataforma «Practicando Axional Deister VNext» para juniors sin formación financiera ni experiencia en ERP: estructura del bloque (objetivo, concepto, partes, pasos con resultado, campos, test, checklist, problemas, aprendido), glosario con frases modelo, caso continuo con cifras, frases y errores recurrentes que corrigieron las revisiones. Úsala siempre que escribas, reescribas o corrijas el texto de un bloque, un concepto, un paso o un aviso, o cuando pidan «hazlo más claro para un junior», «redacta el bloque X», «aplica la guía junior» o «añade la frase puente»."
---

# Redactar para juniors sin base

El lector es un recién contratado que **no ha usado un ERP y no sabe contabilidad**. Si se atasca, no pregunta: abandona o hace algo mal sin saberlo. Cada decisión de redacción sirve a una pregunta: ¿qué necesita saber ya, aquí, para dar el siguiente paso?

Esta skill es el **cómo se escribe**. No la dupliques con las demás:
- Normas de estilo, idioma, títulos, datos y publicación: `criterios-sergi`.
- Esquema JSON, alta/edición de bloques, validación y comprobaciones: `modulo-y-bloque` (y `_fuente/ESQUEMA.md`).
- Reglas de redacción base: `_fuente/GUIA_REDACCION.md`; modelo de navegación y pestañas: `_fuente/UX_V5.md`.
- Auditar y verificar lo escrito: `auditar-contenido`.

## Flujo de trabajo

1. **Sitúa el bloque**: módulo, etapa (Configurar u Operar) y qué ha visto ya el alumno según `app/src/content/etapas.ts`. Lo que se crea después no se puede citar como hecho.
2. **Lee el bloque actual** (pestañas Concepto, Guiado y Demo real) y su fuente (manual en `_fuente/manuales/`, notas verificadas de la demo, capturas). Contrasta cifras, cuentas y rutas con la fuente, no con la memoria. Lo no comprobado se marca «(sin verificar)» o se deja `null`.
3. **Aplica la estructura** de `references/estructura_bloque.md` (formato de cada campo y lista de control).
4. **Explica los términos** la primera vez que salen en el módulo, con la frase modelo de `references/glosario_frases_modelo.md`.
5. **Engancha el bloque al caso continuo** (`references/caso_continuo.md`): cifras y códigos del caso en el `Ejemplo:`, en el `detalle` y en el `aprendido`; frase puente si el bloque practica con otros datos.
6. **Repasa los errores recurrentes** (`references/errores_recurrentes.md`).
7. **Valida**: JSON válido, build, y `python3 -I plugins/formacion-oys/skills/auditar-contenido/scripts/comprobar_contenido.py`. Pide revisión junior (otro agente); si tocaste cifras o cuentas, también senior.

## Las ocho reglas que más importan (con su porqué)

1. **Un bloque, un logro.** El `objetivo` es una frase en futuro y segunda persona con algo comprobable («Registrarás la factura de T{INI} y la contabilizarás por 151,25»). Dos logros o uno abstracto dejan al alumno sin saber cuándo ha terminado.
2. **El primer párrafo da el porqué.** Qué es + comparación cotidiana + qué pasa en la empresa si no se hace o se hace mal. Sin consecuencia, el junior no ve por qué importa.
3. **Cada paso dice qué verás.** `texto` imperativo con el rótulo literal entre «»; `detalle` con el resultado visible y la cifra del caso. Es lo que le permite comprobar que va bien sin pedir ayuda.
4. **La ruta se escribe con ›, literal y sin códigos.** `Dónde: «Finanzas › Cobros y Pagos › Remesas»`. El código técnico va aparte («En el buscador: …»).
5. **Cada término, explicado donde nace.** Entre comas o con «es decir», con la frase modelo y un ejemplo numérico. El glosario subraya, pero no sustituye.
6. **Todo dato tiene origen.** Si no es del alumno (empresa 0, vídeo, otra empresa, captura de otro registro), la misma frase dice de dónde sale. Y si es una limitación de la demo, se dice «solo en esta demo».
7. **Una idea por frase.** 12-15 palabras, 20 como máximo; párrafos de 3 frases o 60 palabras; listas cuando hay tres o más elementos iguales. Sin voz de manual.
8. **Nunca toques lo que guarda el progreso.** Ids, `campos.campo`, `imagen`, `hotspot`, `pregunta`, `correcta`, `numero`, `duracionMin`, `{INI}`, el número y orden de partes, pasos, checklist y test. Se puede aclarar la redacción del test y de su explicación, nunca la respuesta correcta.

## Configurar y Operar

Cada módulo tiene dos fases, siempre en este orden (`etapas.ts`):
- **Configurar**: dejas preparado lo que el ERP necesita (maestros, códigos, tipologías, parámetros). Explica el **porqué de cada campo** y marca lo que se deja como viene; el junior no sabe qué es ruido del formulario.
- **Operar**: el día a día con lo preparado (documentos, asientos, cobros, pagos, procesos). Muestra el **resultado en cada paso** y el asiento esperado.
- Lo avanzado o de referencia va a «Para saber más» (etapa opcional), nunca lo que otro bloque obligatorio necesita.
- Configurar debe tener el mismo nivel de detalle en todos los módulos (Ventas se igualó a Compras: mapa de la cadena, campos de enlace con ayudas literales, ejemplo numérico 10/4/6).
- Un bloque nuevo de Configurar lleva id nuevo; mover un bloque cambia `etapas.ts`, no su id.

## Frases útiles

- Consecuencia: «Si no lo registras, …», «Gracias a esto, …».
- Término: «un efecto, es decir, cada cobro o pago pendiente que deja una factura».
- Puente: «Ejemplo: en tu caso, … En la demo practicas con … porque …. El mecanismo es el mismo.»
- Captura ajena: «La captura es de otro albarán; en el tuyo verás tu número.»
- Déjalo: «Déjalo como viene: el caso no lo usa.»
- Limitación: «Solo en esta demo … En un cliente real …»
- Fallo de la demo: «Esto es un fallo de esta demo; en un ERP real no pasaría.»
- Aprendido: «Has creado la tipología PC{INI} para tus pedidos.»

## Qué no hacer

- Inventar cifras, cuentas, rutas o rótulos. Sin fuente, «(sin verificar)».
- Comparar versiones («antes», «ahora», «ERP antiguo»).
- Copiar documentación oficial de Deister (repo público): resume con tus palabras.
- Poner credenciales, nombres de personas o datos de clientes reales; solo la demo `nextdemo.geasa.eu` (base tutorial) y registros propios `{INI}` o `CAP`.
- Tapar o difuminar campos en capturas: los datos de la demo son falsos.
- Dejar texto de trabajo visible («no sabemos si…»).

## Referencias

- `references/estructura_bloque.md`: fórmula de cada campo, partes, pasos, problemas, aprendido, antes/después y lista de control.
- `references/glosario_frases_modelo.md`: ~100 términos con frase modelo y ejemplo del caso.
- `references/caso_continuo.md`: personajes y códigos, 13 operaciones, asientos, cuadres y frase puente.
- `references/errores_recurrentes.md`: errores que las revisiones corrigieron, agrupados, con su informe de origen.
