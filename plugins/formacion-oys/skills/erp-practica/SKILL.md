---
name: erp-practica
description: Mantenimiento del ERP de práctica de la plataforma O&S: añadir pantallas, comportamientos, refrescar catálogo desde la demo y crear prácticas con comprobaciones. Úsala cuando pidan tocar `app/src/erp/`, `app/public/erp-cat/` o `app/scripts/erp-catalogo/`: «añade una pantalla al ERP», «haz que la factura valide como la demo», «actualiza el catálogo», «crea una práctica nueva».
---
# Mantenimiento del ERP de práctica

## Cuándo usarla
Cuando haya que modificar la réplica de Axional VNext integrada en la plataforma:
- Añadir o modificar pantallas propias del ERP.
- Añadir comportamiento a pantallas genéricas (validaciones, botones, defectos).
- Regenerar el catálogo desde la demo.
- Crear o ajustar prácticas transaccionales con corrección automática.

Reglas de oro: comportarse igual que la demo real (mismos rótulos, botones y flujo), usar solo datos ficticios.

## Dónde está
- `app/src/erp/` — motor, pantallas propias y prácticas.
  - `ErpApp.tsx` — escritorio, menú, buscador ⌘K.
  - `modelo.ts` — base de datos local `Db` y cálculos (totales, cuadra, facturaDeAlbaran…).
  - `practicas.ts` — prácticas y comprobaciones.
  - `pantallas/*.tsx` — pantallas propias (terceros, pedidos, facturas…).
- `app/src/erp/catalogo/` — catálogo y motor genérico.
  - `tipos.ts` — formato del catálogo (`CatObjeto`, `CatCol`, `CatBoton`…).
  - `comportamiento.ts` — contrato `CompObjeto` para comportamientos.
  - `motorComp.ts` — carga y ejecuta comportamientos.
  - `Generica.tsx` — pantalla genérica que lee el catálogo.
  - `botones.ts`, `expresion.ts`, `almacen.ts`, `datos.ts`, `propias.ts`, `extra.ts` — utilidades del motor.
- `app/public/erp-cat/` — JSON generados: `menu.json`, `obj/<código>.json`, `buscar.json`, `val.json`, `comp/<código>.json`.
- `app/scripts/erp-catalogo/condensar.py` — genera el catálogo desde una captura.
- Script de captura de la demo: copiado en `plugins/formacion-oys/scripts/harvest.mjs`.

## Pasos

### (a) Añadir una pantalla propia
1. Crea el componente en `app/src/erp/pantallas/<Nombre>.tsx` siguiendo el patrón de una existente (p. ej. `Pedidos.tsx` o `Facturas.tsx`).
2. Registra su código de objeto en `app/src/erp/catalogo/propias.ts`, en el mapa `PROPIA`: asocia el código Axional (ej. `ctercero`) con el nombre de pantalla que usas en `modelo.ts`.
3. Si necesita datos o lógica, añádelos a `modelo.ts` (estructura `Db` y funciones auxiliares).
4. Verifica que `ErpApp.tsx` la abre (usa `PROPIA` para decidir).
5. Compila y prueba.

### (b) Añadir un comportamiento a una pantalla genérica
1. Identifica el código de objeto (por ejemplo en `app/public/erp-cat/buscar.json` o en el menú).
2. Crea o edita `app/public/erp-cat/comp/<código>.json` siguiendo el contrato `CompObjeto` de `app/src/erp/catalogo/comportamiento.ts`.
3. Añade:
   - `campos`: obligatorios (`req`, `reqSi`), listas de valores (`lov`), defectos (`def`, `defExpr`), reglas de validación (`reglas` con `msg` literal).
   - `botones`: para cada botón, diálogo real (`dialogo`), precondiciones (`pre`), pasos (`pasos`) y mensajes (`ok`, `confirm`).
   - `alGuardar`, `alBorrar`: comprobaciones globales.
4. Usa mensajes de error y éxito **literales de la demo**. Captúralos con la demo real; nunca improvises textos.
5. El motor `Generica.tsx` lee automáticamente el comp. Prueba la pantalla.

### (c) Refrescar el catálogo desde la demo
1. Abre el Chrome de depuración (puerto 9333) e inicia sesión tú en la demo (skill `capturas-y-puntos`, paso 1). Nadie escribe contraseñas por ti.
2. Ejecuta la captura con el script copiado (una vez: `npm --prefix plugins/formacion-oys/scripts install`):
   ```bash
   export CAP_DIR=~/.cache/oys-demo-cap/cat   # debe tener index_prev.json
   node plugins/formacion-oys/scripts/harvest.mjs codigos.txt 4
   ```
   Llena `raw/`, `btn/` y `sub/` en `CAP_DIR`. `menutree.json` e `index_prev.json` se toman de la captura anterior (por confirmar cómo regenerarlos desde cero).
3. Ejecuta el condensador:
   ```bash
   python3 app/scripts/erp-catalogo/condensar.py "$CAP_DIR" app/public/erp-cat
   ```
4. Revisa los JSON generados en `app/public/erp-cat/`.

### (d) Añadir una práctica con sus comprobaciones
1. Edita `app/src/erp/practicas.ts`.
2. Añade un objeto `Practica` al array `PRACTICAS` (o `PRACTICAS_FINANZAS`): `id`, `titulo`, `pantalla`, `enunciado`, `datos`, `checks`.
3. En `checks`, escribe funciones `ok(d: Db, ini: string)` que consulten los datos del modelo (`d.terceros`, `d.facturas`, `d.asientos`…).
   - Usa `{T}`, `{ART}` e `{INI}` en enunciados y textos; se sustituyen con las iniciales del alumno.
   - Cada check lleva `puntos` y `pista`.
4. Si la práctica va ligada a un ejercicio, añádela en `PRACTICAS_POR_EJERCICIO` (clave = id del ejercicio, valor = array de ids de práctica).
5. Prueba la práctica completa desde la interfaz (`Practicar.tsx`) hasta obtener 100/100.

## Comprobar
- Desde la raíz del repo:
  ```bash
  npm --prefix app run build
  ```
- En el navegador, abre la plataforma y accede a `/erp`. Recorre las pantallas modificadas y ejecuta las prácticas implicadas.
- Verifica que los botones y mensajes coinciden con la demo (texto literal, mismo flujo).

## Errores típicos
- **Límite de la demo**: máximo 5 ejecuciones simultáneas por usuario. Si devuelve `500 Cannot exceed the maximum allowed concurrent object executions [5]` o `202 RUNNING`, espera y reintenta con pausas crecientes.
- **Sesión caducada**: la API responde `302/303` o muestra pantalla de login. No automatices el login: inicia sesión tú a mano en el Chrome de depuración.
- **Catálogo desactualizado**: si una pantalla no tiene botones o layouts, recaptura con `harvest.mjs` y ejecuta `condensar.py`. Luego revisa si los códigos de botón de `comp/*.json` siguen coincidiendo con el catálogo; si no, re-mapea las claves de `botones`.
- **Mensajes no literales**: cada `msg`, `ok`, `confirm` debe salir de una captura real de la demo. Si no tienes el texto, captúralo con datos `CAP` antes de añadirlo.
- **Datos reales**: no uses bases de clientes reales (Elysius). Trabaja solo con la demo y registros de prueba con prefijo `CAP`.
- **Chocar con otros cambios**: si lanzas varios agentes a la vez, que cada uno toque sus ficheros y solo uno haga commit.