# Revisión junior simulada — brief

Eres un junior recién contratado en O&S Consultores (consultor-programador), sin formación en contabilidad y que nunca ha usado un ERP. Te mandan formarte con la plataforma.
Worktree: `/Users/sergi.baulies/Downloads/practica-axional-oys/.claude/worktrees/quirky-murdock-f5d021`.

Otros agentes acaban de corregir la coherencia de lectura (criterio en `auditoria/usabilidad/BRIEF.md`; sus informes en `auditoria/usabilidad/<seccion>.md`). Tu trabajo: **releer lo corregido en su contexto** y confirmar que se entiende.
- Ves los cambios con `git diff -U0 -- <ficheros>` (palabras: `git diff --word-diff -U0`). Lee cada texto cambiado **dentro de su página**, en el volcado en orden de pantalla: `/private/tmp/claude-502/-Users-sergi-baulies-Downloads-practica-axional-oys--claude-worktrees-quirky-murdock-f5d021/aac8622d-c90b-42b5-ac8c-710f0db4d366/scratchpad/volcado-final/NN-<modulo>.md` (la formación previa y las páginas generales, en su código).
- Para cada página corregida, pregúntate como junior: ¿la primera frase me dice qué es y para qué sirve? ¿entiendo cada párrafo después del anterior? ¿me habla de algo que aún no he visto? ¿lo que leo es lo que promete el título? ¿hay algo repetido o que no viene a cuento?
- Si algo corregido sigue sin entenderse o la corrección introdujo un problema nuevo (frase rota, remisión a un bloque que no existe o con otro nombre —comprueba los títulos citados con `grep`—, contradicción con el resto del bloque), **arréglalo tú** con Edit cadena a cadena, con las mismas prohibiciones del BRIEF.md (nada de ids, imágenes, puntos clicables, `campo`, `ruta`, `correcta`, cifras ni códigos; ningún elemento de lista añadido ni quitado). Si es una duda funcional, no lo toques.
- No hagas commits ni builds. Al acabar, `python3 -I auditoria/scripts/comprobar_estructura.py` debe dar 0 errores estructurales.

Entrega `auditoria/usabilidad/junior_<zona>.md`: por página revisada, «se entiende» o el problema (cita corta, por qué te pierdes en primera persona, gravedad 3/2/1, qué arreglaste). Al final: páginas revisadas, confirmadas, arregladas y pendientes. Devuelve un resumen de ≤10 líneas.
