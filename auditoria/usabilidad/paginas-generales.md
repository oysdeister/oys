# Lectura en contexto: páginas generales y textos fijos (noviembre de 2026)

Zona: textos fijos de Inicio, cabecera, menú, pie, página de módulo, página de bloque y sus pasos (Concepto, Guiado, De memoria, Test, Demo real), Vídeos, Glosario, Errores, Examen final y de módulo, Certificado, Logros, ERP de práctica y Taller. Solo se han cambiado cadenas visibles; ningún id, ruta ni clave. La única lógica añadida es la condición de cabeceras de la tabla de referencia (ver «Página de módulo»), que es de solo presentación.

Lectura hecha sobre el código y el volcado (`scratchpad/volcado/*.md`): obscura bloquea `localhost` y no hay puppeteer instalado en el repo, así que no se ha pintado ninguna página.

## Inicio `#/` (`pages/Home.tsx`)

| Dónde | Qué falla | Por qué | Antes → después (resumido) | Estado |
|---|---|---|---|---|
| Cabecera › frase de entrada (alumno nuevo) | «justo debajo» no es cierto: entre la frase y la formación previa están el «Te toca», el botón y los datos | Remite a un sitio que no es el siguiente (criterio 5) | «empieza por la formación previa, justo debajo» → «empieza por las dos guías de «Antes de empezar con Axional», aquí debajo» | corregido |
| Cabecera › botón «Seguir» | «Seguir con el De memoria», «Seguir con el Demo real»: concordancia rota | Plantilla con artículo fijo y rótulos de distinto género | «Seguir con el ${paso}» → «Seguir: ${paso}» | corregido |
| «Tu ruta» › entrada | «cada uno usa lo que montaste en el anterior»: pasado para un alumno que aún no ha empezado | Da por hecho algo que no se ha hecho (criterio 3) | «montaste» → «preparas» | corregido |
| «Tu ruta» › frase de cada módulo | Sale la primera frase de `portadaDatos.ts` (p. ej. «La empresa: la ficha que usan todos los documentos.»), sin verbo y sin decir qué es el módulo | Es el ejemplo de Sergi; el texto es de los agentes de módulo | Sin cambio (fuera de mi zona); se verá corregido cuando cambien `frase` | duda (otra zona) |

## Página de módulo `#/modulo/<id>` (`pages/ModulePage.tsx`, `components/exercise/SeccionVista.tsx`, `components/exercise/VideoPrimero.tsx`)

| Dónde | Qué falla | Por qué | Antes → después (resumido) | Estado |
|---|---|---|---|---|
| Parte 1 «Para situarte» › tarjeta del vídeo | «Luego empieza por el bloque 1.», pero debajo del vídeo siguen «Qué aprenderás», el recorrido y «Lo básico del ERP» | Manda saltar contenido de la misma parte (criterio 6) | → «Luego lee el resto de esta parte y empieza por el bloque 1.» | corregido |
| Parte 1 › lista de logros | Lista con marcas de verificación sin título: tras el vídeo no se sabe si son cosas hechas, requisitos u objetivos | Lista sin frase que la presente (criterio 1) | Añadido el rótulo «Qué aprenderás» (`<h3>`, sin clases ni lógica nuevas) | corregido |
| Parte 1 › «Lo básico del ERP» › Datos maestros › tabla | Cabeceras «Campo \| Qué significa \| Ejemplo» sobre una tabla que lista maestros (`ctercero`, `carticul`…) con su ruta de menú: ni son campos ni la ruta es un ejemplo | El rótulo no casa con el contenido (criterio 4) | Solución genérica: si la tabla tiene 2 filas o más y **todos** los «ejemplos» contienen «›» (son rutas de menú), las cabeceras pasan a «Código en el buscador \| Qué guarda \| Ruta del menú», tal como lo anuncia la frase previa del JSON («cada maestro, el código con el que lo encuentras en el buscador y la ruta del menú»). Si no, «Campo \| Qué es \| Ejemplo». He revisado todas las tablas: solo `maestros-nav-datos` cumple la condición; ninguna tabla de campos de un bloque tiene más de una ruta. | corregido |
| Parte 1 › tablas de campos | «Qué significa» en la página de módulo y «Qué es» en el bloque (`CapturaCampos.tsx`) para la misma columna | Dos rótulos para lo mismo | Unificado en «Qué es» | corregido |
| Parte 2 «Los bloques» › entrada | «cada uno usa lo que montaste en el anterior» | Pasado sin haber empezado | «montaste» → «preparas» | corregido |
| Parte 2 › aviso sobre Operar | «¿La empresa ya está configurada?»: en Compras o Ventas no se configura «la empresa», sino lo que pide la fase Configurar del módulo | Término equívoco: en Maestros «la empresa» es un bloque concreto | → «¿Ya tienes hecha la fase Configurar de este módulo? Ve directo a Operar…» | corregido |
| Página de módulo › frase bajo el título | Es `ficha.frase` de `portadaDatos.ts` (lo que Sergi ve al entrar en Datos maestros) | Otra zona | Sin cambio | duda (otra zona) |
| `maestros.json` › `maestros-nav-datos` › explicacion 1 y 2 | «En esta sesión…» (resto de una sesión grabada) y «La tabla de códigos está justo debajo» (está, pero a 1 elemento; luego viene otra tabla) | Restos de contexto (criterio 5) | Lo apunto para el agente de Maestros | duda (otra zona) |
| `etapas.ts` › `FASES` | Texto que no se pinta: la página usa `FASE_UI` de `lib/ruta.ts`. Los dos dicen lo mismo con palabras distintas | Texto duplicado, sin efecto en pantalla | Sin cambio; propongo dejar un solo origen | duda |

## Página de bloque `#/ejercicio/<id>` (`pages/ExercisePage.tsx`, `components/exercise/*`)

| Dónde | Qué falla | Por qué | Antes → después (resumido) | Estado |
|---|---|---|---|---|
| Barra de navegación tras Guiado | «O sáltatela y pasa al Test»: el pronombre femenino no remite a nada («De memoria» es un paso) | Concordancia | → «O sáltate este paso y ve al Test» | corregido |
| Guiado › paso sin captura | «hazlo en el ERP siguiendo la instrucción y pulsa «Continuar»»: el Guiado es sobre capturas, no se trabaja en el ERP | Instrucción que saca al alumno de la página | → «Este paso no tiene captura: lee la instrucción y pulsa «Continuar».» | corregido |
| De memoria › resultado | «Sigue con el test» en minúscula; el resto de la interfaz dice «Test» (nombre del paso) | Rótulo de paso inconsistente | → «Sigue con el Test.» | corregido |
| Guiado › contador «Clic n de N» | Cuenta también pasos en los que no se hace clic (los de solo lectura) | Rótulo algo inexacto; cambiarlo a «Paso» chocaría con «Paso 2 de 6» de la cabecera del bloque | Sin cambio | duda |

## Otras páginas

| Dónde | Qué falla | Por qué | Antes → después (resumido) | Estado |
|---|---|---|---|---|
| Aviso de cambio de iniciales (`App.tsx`) | Pone de ejemplo `PROV-{xx}-001`, un código que el curso no usa (los códigos son `T{INI}`, `C{INI}`…) | Contradice `_fuente/CODIGOS_ALUMNO.md` | `PROV-{xx}-001` → `C{xx}` | corregido |
| Examen de módulo › entrada | «Cada vez que lo haces, salen otras preguntas, en otro orden.» (frase cosida con plantilla) | Sintaxis rota en una de las dos ramas | → «…cambian las preguntas y su orden.» / «…las preguntas y las opciones salen en otro orden.» | corregido |
| Examen final › resultado suspendido | «Repasa lo que ha fallado» | Sujeto equivocado | → «Repasa lo que has fallado» | corregido |
| Vídeos › aviso global | «El vídeo aún no está publicado» cuando el aviso trata de todos los vídeos | Singular por plural | → «Los vídeos aún no están publicados.» | corregido |
| ERP de práctica › entrada | «Axional VNext»; el resto del curso dice «Axional Deister VNext». Además afirma «con el menú completo» | Nombre del producto inconsistente; «completo» no lo he podido comprobar | Nombre unificado; «menú completo» sin tocar | corregido / duda |
| Logros › «Llévate tu progreso» | «Se guarda solo en este navegador», pero el pie dice «Tu progreso se guarda en tu cuenta» cuando Clerk está activo | Puede contradecir el pie según la configuración | Sin cambio (depende de lógica) | duda |
| Glosario, Errores, Taller, Certificado, Examinador, cabecera, menú, pie | Leídos de arriba abajo: la entrada dice qué es la página y para qué sirve, y los rótulos casan con lo que presentan | — | Sin cambios | — |

## Recuento

- Encontrados: 22.
- Corregidos: 16 (un caso de «ERP de práctica» se corrige solo a medias).
- Dudas no tocadas: 7. Tres son de otra zona: `frase` de `portadaDatos.ts` y dos restos en `maestros-nav-datos`. Las otras cuatro: `FASES` sin uso, contador «Clic», «menú completo» del ERP de práctica y el texto de Logros sobre dónde se guarda el progreso con Clerk.
- `npx tsc -b`: sin errores. `comprobar_estructura.py`: 0 errores estructurales, 0 avisos.

## Tres ejemplos de antes y después

1. **Rótulo que no casa con el contenido** (página de Datos maestros, tabla de referencia): «Campo | Qué significa | Ejemplo» con filas como «ctercero (Contabilidad) — Registro de terceros… — Ej.: Finanzas › Maestros › Terceros › Registro terceros» → «Código en el buscador | Qué guarda | Ruta del menú».
2. **Instrucción que salta contenido** (tarjeta del vídeo en «Para situarte»): «Luego empieza por el bloque 1.» → «Luego lee el resto de esta parte y empieza por el bloque 1.»
3. **Algo dado por hecho antes de hacerlo** (Inicio y «Los bloques»): «cada uno usa lo que montaste en el anterior» → «cada uno usa lo que preparas en el anterior».
