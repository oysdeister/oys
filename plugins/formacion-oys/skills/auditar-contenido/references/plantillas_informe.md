# Plantillas de informe

Índice: A Reauditoría · B Revisión senior · C Revisión junior · D Verificación · E Corrección (hecho) · F Plan · Convenciones de nombre.

Ejemplos reales: `auditoria/reauditoria.md`, `revision_senior_reauditoria_jm.md`, `revision_junior_ventas_workflow.md`, `verificacion_A.md`, `correccion_4.md`, `plan_mejoras.md`.

## Convenciones

- Un fichero por informe en `auditoria/`, en español, sin datos personales.
- Nombres: `reauditoria.md`, `revision_senior_<alcance>.md`, `revision_junior_<alcance>.md`, `junior_<perfil>.md`, `verificacion_<letra>.md`, `correccion_<n>.md`, `plan_<tema>.md`, `hecho_<tema>.md`.
- Cabecera común: título, **fecha**, **rama y commit revisados**, **alcance** (qué sí, qué fuera), **método** (qué se leyó, qué se probó, qué no se tocó), **validación** (build, JSON).
- Ids de hallazgo estables: si ya existe una numeración (`H01–H56` del plan), manda esa. Los nuevos llevan otro prefijo (`N01…`, `G1…`, `B1…`). Avisa si otro informe numeró por su cuenta.
- Cada hallazgo cita `id` de bloque (y parte entre corchetes si ayuda) y la frase literal. Sin cita no es un hallazgo.

## A. Reauditoría (auditor)

```
# Reauditoría de «<curso>» (<fecha>)
Estado revisado: rama, commit. Método: ... Recuento: N Resueltos · N Parciales · N Pendientes · N Descartados. Hallazgos nuevos: N (x críticos, y altos).

## 1. Hallazgos previos: estado hoy
| ID | Tema | Estado | Evidencia | Qué falta |

## 2. Hallazgos nuevos
### Críticos   **N01 · <título>.** <qué pasa, con cita>. Propuesta: <qué hacer>.
### Altos / Medios / Bajos

## 3. Propuesta de ajustes priorizada
A. Hacer ya (sin cambiar ids)   | # | Acción | Hallazgos | Esfuerzo |
B. Necesita la demo o grabación | Acción | Hallazgos | Esfuerzo |
C. Decisión de Sergi            (carga, partir bloques, orden del curso, acceso, vídeo, recapturas)
```

Se redacta «Propuesta:» en cada hallazgo y se suma el esfuerzo por bloque A (orientativo, en horas).

## B. Revisión senior

```
# Revisión senior: <alcance>
Fecha, base (commit/diff), fuera de alcance, método (qué rehiciste a mano, qué probaste en la demo, qué no).
Prioridad: GRAVE (descuadra o rompe datos) · IMPORTANTE (incorrecto o incoherente) · MEJORA.

## 0. Conclusión / Veredicto  (se puede publicar: sí/no, y bloqueantes)
## 1. Cifras del caso rehechas   | Comprobación | Cálculo | Resultado OK/Error |
## 2. Hallazgos
| # | Dónde | Hallazgo | Gravedad | ¿Corregido? |
  o, si es revisión de un cambio: tabla «punto por punto» con AC/AI/NA/B/C/FA, evidencia y corrección propuesta.
## 3. Prueba en la demo (si la hubo): qué registro propio, qué acción, qué se vio.
## 4. Datos dudosos que quedan (con su fuente)
```

Cuando propongas texto, escribe el **texto exacto** y la ubicación (`fichero:clave`), para que el corrector no tenga que interpretar.

## C. Revisión junior

```
# Revisión como junior: <alcance>
Perfil (sin ERP / sin contabilidad / otro sector). Qué leíste, en qué orden, qué capturas abriste. «No se ha editado nada.»
## Veredicto rápido (3-4 viñetas)
## Lo que funciona (para no romperlo)
## Dónde me pierdo (por módulo › bloque)
### BLOQUEA     B1. <ubicación> · Frase: «...» · Por qué atasca: ... · Propuesta de texto: «...»
### MOLESTO
### Pulido
## Comprobaciones mecánicas (pasos sin detalle, rutas con «>», frases largas, términos sin explicar, datos ajenos sin puente)
```

Punto mínimo: ubicación › cita › por qué atasca › qué necesito. Si el junior propone texto, que sea llano y con la cifra del caso.

## D. Verificación (solo lectura)

```
# Verificación <letra> de <ids>
Nota de método: cómo casaste los ids si el informe no los traía; orden actual de bloques; qué cambió desde el informe.
| ID | Estado (Resuelto/Parcial/Pendiente/Descartado) | Evidencia (fichero:clave, cita) | Qué falta |
```

Incluye siempre un **chequeo de ids** (perdidos 0, nuevos N, movidos entre ficheros) y la comprobación de que los ids movidos siguen resolviéndose (`MOVIDOS`, `ALIAS_MODULO`).

## E. Corrección (hecho)

```
# Corrección <n>: <ficheros>
Ids intactos (comprobado). JSON válido y build correcto. Sin commit.
## Del senior   <código del hallazgo>: <qué se cambió y en qué campos>
## De los juniors   <informe> <puntos>: <qué se cambió>
## No aplicado / pendiente   <hallazgo>: motivo (demo, decisión, fuera de alcance)
```

Una corrección por **grupo de ficheros disjuntos** (así varios agentes trabajan a la vez sin pisarse).

## F. Plan

Tabla de decisión por hallazgo: ¿Correcto hoy? · Gravedad (auditor) · Decisión (Aplicar / Pendiente de Sergi / Pendiente demo / Descartar) · Mejora. Criterio explícito arriba (se arregla ya lo que bloquea y no cambia ids, orden ni alcance; recortar o regrabar queda propuesto, no aplicado).
