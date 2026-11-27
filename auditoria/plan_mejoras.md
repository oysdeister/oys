# Plan de mejoras tras la auditoría del curso VNext (24-11-2026)

Auditor: agente principal (contabilidad y Axional Deister VNext).
Fuente: informe de auditoría (artefacto de Sergi), 56 hallazgos H01–H56.
Verificación contra el contenido actual: `verificacion_A.md` (H01–H17, H22), `verificacion_B.md` (repeticiones, vídeo, nomenclatura, capturas) y `verificacion_C.md` (cobertura, duración, consulta). Ojo: B y C numeraron por orden propio; aquí manda la numeración del informe.

## Criterio

- Se arregla ya lo que bloquea o confunde al junior y se puede corregir sin cambiar ids, orden del curso ni alcance.
- No se toca el orden de módulos (Sergi lo fijó: maestros → compras → ventas → contabilidad → cartera → tesorería → impuestos → activos). El informe propone otro orden: es decisión de Sergi.
- Quitar, fusionar o recortar módulos, regrabar vídeo y crear bloques nuevos de cobertura son decisiones de alcance o necesitan material nuevo: quedan propuestos, no aplicados.

## Valoración y decisión

| ID | ¿Correcto hoy? | Gravedad (auditor) | Decisión | Mejora |
|---|---|---|---|---|
| H01 | Sí (Home dice que van dos cursos antes) | Crítica | Aplicar | Quitar el requisito: «No necesitas cursos previos» |
| H02 | Sí | Crítica | Pendiente de Sergi/Deister | Acceso autoservicio a TUTORIAL: depende de Deister |
| H03 | No verificable sin escribir en la demo | Crítica | Pendiente (demo) | Avisar en el bloque; corregir numerador y expresión en la demo lo hace Deister |
| H04 | Sí (se cita «Códigos del alumno» y no existe en la web) | Alta | Aplicar | Poner la tabla de códigos dentro de «Datos maestros» y enlazar desde Compras |
| H05 | Sí (compras-2 remite a una Práctica que no tiene) | Alta | Aplicar | Decir en qué bloque está la Práctica |
| H06 | Sí (AACF no existe en la demo y se pide abrirla) | Alta | Aplicar | Usar una tipología de albarán que sí exista |
| H07 | Sí («lo verás» de bloques ya hechos) | Media | Aplicar | «Ya lo viste en…» |
| H08 | Sí (empresa ALA sin explicar) | Alta | Aplicar (texto) | Explicar que Impuestos y Activos consultan datos de ejemplo de la empresa ALA de la demo |
| H09 | Parcial (el glosario emergente ayuda) | Alta | Aplicar | Definición mínima de asiento/debe/haber en el primer uso |
| H10 | Parcial | Alta | Aplicar | Una frase de IVA, zona y clave fiscal en el primer uso |
| H11 | Parcial (solo «domiciliación») | Media | Aplicar | Frase de domiciliación |
| H12 | Parcial («contabilizar») | Media | Aplicar | Definir «contabilizar» la primera vez |
| H13 | Parcial | Media | Aplicar | Una frase de plantilla de contabilización |
| H14 | Parcial (IRPF sin definir) | Media | Aplicar | Definir la retención de IRPF |
| H15 | No (ya resuelto) | — | Descartar | maestros-3 ya define tipología |
| H16 | Parcial (orden bien; lista numerada con números del JSON) | Media | Aplicar | Quitar la numeración que no coincide |
| H17 | Parcial (procesos masivos antes del primer asiento) | Media | Aplicar | Mover el bloque en `etapas.ts` sin cambiar ids |
| H18 | Sí | Alta | Pendiente de Sergi | Repartir Maestros es cambio de alcance |
| H19 | Sí | Media | Pendiente | Partir bloques cambia ids/progreso |
| H20 | Sí | Media | Pendiente | Ficha base única de tercero: rediseño |
| H21 | Parcial (la web ya oculta 4 de 7 por título repetido) | Media | Descartar | Ya resuelto en pantalla |
| H22 | Sí (asiento = apunte en 3 sitios) | Alta | Aplicar | Asiento = anotación completa; apunte = cada línea |
| H23–H26 | Sí (repeticiones) | Baja | Pendiente | Centralizar: rediseño de contenido |
| H27 | Sí | Alta | Pendiente | Continuidad de datos: rediseño |
| H28–H29 | Sí | Media | Pendiente | Reorganizar vídeo: decisión editorial |
| H30 | Sí (27 tramos idénticos) | Media | Aplicar | Quitar el tramo duplicado entre módulos; queda en el módulo dueño |
| H31 | Sí (saltos desordenados en compras-3) | Media | Aplicar | Ordenar los tramos de cada sección de menor a mayor |
| H32 | Parcial | Media | Pendiente | Regrabar: material nuevo |
| H33 | Sí | Baja | Pendiente | Vídeos nuevos: material nuevo |
| H34–H36 | Sí | Media | Pendiente | Reequilibrar o partir bloques: alcance |
| H37 | Parcial («Siempre sigue estos pasos» incluye Práctica, que solo tienen 6 bloques) | Alta | Aplicar | Corregir la portada: la Práctica está solo en 6 bloques |
| H38 | Sí | Baja | Aplicar (interfaz) | Un término por concepto en la interfaz: «ERP de práctica» (simulado) y «Demo real»; «bloque», no «ejercicio» |
| H39 | Parcial | Media | Pendiente | Recapturar listados sobre base limpia (sin difuminar) |
| H40 | Sí | Baja | Descartar | Cambiar numeración de ficheros no aporta al alumno; la web ya numera por `etapas.ts` |
| H41–H47 | Sí (parcial en H44, H46, H47: anticipo ya cubierto) | Alta | Pendiente | Bloques nuevos de cobertura: necesitan grabar y probar en la demo |
| H48–H52 | Sí (cifras base correctas; no existe módulo Almacén) | Media/Baja | Pendiente de Sergi | Recortes de módulos: alcance |
| H53 | Sí (⌘K busca solo títulos, 8 resultados) | Media | Aplicar | Buscar en todo el texto y en el glosario |
| H54 | Sí (213 pares sin índice) | Media | Aplicar | Página «Índice de errores» buscable |
| H55 | Parcial (tipología y N43 ya existen; falta PMICDT; duplicados) | Baja | Aplicar | Añadir PMICDT y unificar «Tipología» |
| H56 | Sí | Media | Pendiente | Guías de parametrización: contenido nuevo |

## Reparto de la ejecución

- **Contenido A (maestros, compras, ventas, impuestos, activos)**: H04, H05, H06, H08, H09–H14, H22.
- **Contenido B (contabilidad, cartera, tesorería, orden)**: H07, H16, H17, H22 (cartera).
- **Vídeo**: H30, H31.
- **UX y consulta**: H01, H37, H38, H53, H54, H55.

Revisión: perfil senior (Opus, exactitud de ERP y contabilidad) y perfil junior (Sonnet, comprensión) sobre el diff completo; después, revisión final del auditor.
