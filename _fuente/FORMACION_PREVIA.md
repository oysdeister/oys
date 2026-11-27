# Formación previa «Antes de empezar con Axional»

Petición de José M. Ayguavives (noviembre de 2026): antes de la formación de Axional, un capítulo propio con cultura general de universidad, cada apartado con su examen independiente:

1. **Conceptos de contabilidad general** → `#/formacion/contabilidad` y `#/formacion/contabilidad/examen`
2. **Qué es un ERP** → `#/formacion/erp` y `#/formacion/erp/examen`

Portada de la sección: `#/formacion`. En la barra lateral va arriba, en la carpeta «Formación previa», separada de los «Módulos de Axional».

## De dónde sale

Drive compartido, carpeta «FORMACIÓN AXIONAL»: `formacion-contabilidad/` (guia-contabilidad.html, examen.html, capturas/) y `formacion-erp/` (guia-erp.html, examen.html, capturas/).
Se convirtieron a páginas React nativas (no iframe):

- Contenido de los capítulos: `app/src/content/previa/contabilidad.ts` y `erp.ts` (HTML propio y estático por capítulo).
- Capturas: `app/public/img/previa/{contabilidad,erp}/*.webp`.
- Exámenes: `app/src/content/previa/examen-*.ts` (banco literal) y `app/src/pages/previa/ExamenPrevio.tsx` (misma lógica: 25 preguntas, 6 ejercicios con cifras aleatorias, aprobado al 70 %, certificado PDF con jsPDF).
- Progreso (capítulos leídos, intentos y mejor nota): `app/src/lib/previa.ts`, clave `oys-previa-v1` del navegador (todavía no se sincroniza con la cuenta).
- Si cambian las guías: descárgalas a `<trabajo>/fuentes/` (guia-*.html y, para los bancos, examen-*.app.js con el script propio de cada examen) y ejecuta `PREVIA_TRABAJO=<trabajo> python3 app/scripts/previa/extraer.py` y `bancos.py`.

## Solapes con «0. Fundamentos» y qué se decidió

- «Moverse por el ERP» (`fundamentos-navegar`) es propio de Axional: se queda igual.
- `fundamentos-1` y `fundamentos-2` eran teoría general sin pantallas del ERP y repetían la guía de contabilidad (capítulos 7-11 y 16) y la de ERP (capítulos 6, 7, 10 y 15). No se borran (guardan progreso y alimentan el examen final), pero pasan a ser **repaso con el caso del curso**:
  - `fundamentos-1`: «Repasar la contabilidad con el caso del curso» (antes «Entender la contabilidad desde cero»).
  - `fundamentos-2`: «Seguir una factura hasta el banco y el cierre» (antes «Entender el circuito de una factura y el cierre»).
  - Su Concepto remite a la formación previa para la teoría completa; la etapa se llama «Repaso con el caso del curso».
- Pendiente de decidir con José M.: si se recortan más esos dos bloques ahora que la teoría completa está en la formación previa.
