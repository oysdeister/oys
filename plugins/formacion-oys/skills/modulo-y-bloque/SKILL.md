---
name: modulo-y-bloque
description: Añade o edita un módulo o un bloque (ejercicio) de contenido de «Practicando Axional Deister VNext». Actívala con frases como «añade el módulo X», «edita el bloque Y», «crea el ejercicio Z» o «revisa el contenido de un módulo».
---
# Módulo y bloque de contenido

## Cuándo usarla
- Vas a crear, editar o revisar un módulo, bloque, glosario o examen por módulo.
- Frases típicas: «añade el módulo de ventas», «edita el bloque compras-2», «monta el test de carteras», «revisa el glosario de maestros».

## Dónde está
- Contenido de cada módulo: `app/src/content/<id>.json`
- Esquema TypeScript: `app/src/types.ts`
- Registro, orden y metadatos: `app/src/content/index.ts`
- Etapas pedagógicas: `app/src/content/etapas.ts`
- Glosario: `app/src/content/glosario/<id>.json` y `app/src/content/glosario.ts`
- Examen por módulo: `app/src/content/examenes/<id>.json` y `app/src/lib/examenModulo.ts`
- Imágenes: `app/public/img/<id>/`
- Reglas de contenido: `_fuente/ESQUEMA.md`, `_fuente/UX_V5.md`, `_fuente/MEJORAS_GRANOLA.md`, `_fuente/CODIGOS_ALUMNO.md`

## Pasos
1. Localiza el módulo o bloque.
   - Si existe, edita `app/src/content/<id>.json`.
   - Si es nuevo, crea el fichero y regístralo en `ORDEN` y `META` de `app/src/content/index.ts`.
2. Sigue el esquema de `app/src/types.ts`.
   - `Modulo`: id, titulo, sesion, resumen, circuito, navegacion?, ejercicios, datosSimulador?.
   - `Ejercicio`: id, numero, titulo, objetivo, concepto, duracionMin, secciones, test, checklist, problemas.
   - `Seccion`: id, titulo, paraQueSirve, ruta, explicacion, campos, pasos, avisos.
   - `Paso`: texto, detalle?, imagen? y hotspot? (x,y,w,h en %; etiqueta literal del elemento).
3. Respeta las pestañas y su orden por bloque: Concepto → Guiado → De memoria → Test → [Práctica] → Demo real.
   - En Concepto, el vídeo va primero en cada parte con vídeo.
   - Un paso sin contenido no se muestra.
4. Aplica las reglas de `_fuente/ESQUEMA.md`.
   - Cambia iniciales CL por `{INI}` en códigos y nombres de ejemplo.
   - Sin comparaciones ni menciones a versiones.
   - Cifras, cuentas, códigos y rótulos literales exactos.
   - Las capturas van en pasos; no repitas imagen salvo necesidad.
   - El hotspot se mide con margen; si no hay punto claro, omítelo.
5. Usa títulos cortos, en infinitivo, sin códigos internos de tabla ni ids `icon-*`.
   - El alumno no ve códigos; el nombre visible corto está en `META.corto`.
6. Ordena los módulos y bloques según `app/src/content/index.ts` y `app/src/content/etapas.ts`.
   - Orden del curso: `maestros → compras → ventas → icon-contabilidad → carteras → tesoreria → icon-impuestos → icon-activos`.
   - No cambies ids de ejercicio: guardan progreso y momentos de vídeo.
   - Si fusionas módulos, usa `ALIAS_MODULO` para redirigir ids antiguos.
7. Códigos del alumno: usa `{INI}` y consulta `_fuente/CODIGOS_ALUMNO.md`.
   - Un código, una cosa; si ya existe, reutilízalo y di dónde se creó.
   - Respeta longitudes máximas por tabla.
8. Glosario: añade entradas en `app/src/content/glosario/<id>.json` con `termino`, `definicion`, `ejemplo` y opcionalmente `alias`.
   - El glosario funciona sin fichero; el primer término manda.
9. Examen por módulo: crea o edita `app/src/content/examenes/<id>.json` con `pregunta`, `opciones`, `correcta`, `explicacion`.
   - Usa la lógica de `app/src/lib/examenModulo.ts`.
   - Las preguntas no se repiten entre módulos ni con los tests de ejercicios.
10. Examen final y certificado: `app/src/lib/examen.ts` monta la teoría a partir de los tests de los bloques (reparto en `REPARTO`; las preguntas que dependen del contexto se excluyen) más un caso práctico con código `EX-<INI>-XXXX`. Rutas `#/examen`, `#/certificado` y `#/examinador`. Si añades tests a un bloque, entran solos en el banco del examen final.
11. Valida el JSON antes de subir.
```bash
python3 -c "import json;json.load(open('app/src/content/<id>.json'))"
python3 -c "import json;json.load(open('app/src/content/examenes/<id>.json'))"
python3 -c "import json;json.load(open('app/src/content/glosario/<id>.json'))"
```
12. Build y prueba local (skill `arrancar-y-publicar`):
```bash
npm --prefix app run build
npm --prefix app run dev -- --port 5179 --strictPort
```
   Abre `http://localhost:5179/#/ejercicio/<id-del-bloque>` y `#/modulo/<id>/examen`.

## Comprobar
- El JSON carga sin errores.
- El módulo nuevo aparece en `ORDEN` y `META`.
- Las imágenes referenciadas existen en `app/public/img/<id>/`.
- Cada hotspot tiene rectángulo en % dentro de 0-100 y etiqueta visible.
- Los ids de ejercicio y sección no cambiaron.
- El bloque abre en el orden correcto de pestañas; el vídeo sale primero en Concepto.
- Los títulos son cortos, en infinitivo y sin códigos internos.
- Los códigos del alumno usan `{INI}` y no duplican códigos existentes.
- Glosario y examen por módulo cargan y se enlazan correctamente.
- Valida el recorrido con un agente-junior: pídele que haga el bloque como alumno nuevo y anota dónde se atasca.

## Errores típicos
- Poner el vídeo al final de una parte de Concepto; va primero.
- Usar en un paso una captura de otra parte; solo reutiliza captura de su misma parte.
- Cambiar un id de ejercicio o sección; rompe progreso guardado y momentos de vídeo.
- Mostrar códigos internos (`icon-*`, códigos de tabla) en títulos visibles.
- Repetir una práctica del ERP en dos bloques; cada práctica vive en un solo bloque.
- Crear un código de alumno que ya existe; reutilízalo y remite a dónde se creó.
- No numerar todos los campos o no mostrar su descripción cuando hay captura.
- Dejar un paso vacío visible (De memoria sin pantallas, Práctica sin enunciado, etc.).
- Usar iniciales literales CL en vez de `{INI}`.
- No registrar el módulo nuevo en `ORDEN` y `META`.
