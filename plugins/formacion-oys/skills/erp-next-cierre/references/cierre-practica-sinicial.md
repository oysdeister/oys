# Cierre práctico en tu empresa S{INI}

Fuente: `contabilidad-avanzada.json` › `contab-cierre-practica`; `auditoria/revision_senior_fase2.md` (A1), `auditoria/correccion_1.md`, `auditoria/reauditoria.md` (N05, N12).

## Por qué S{INI} y no la empresa 0
La empresa 0 «Deister Software» la comparten todos los alumnos (es la que tiene tipologías y plantillas): regularizarla cerraría el ejercicio de todos. S{INI} (creada en `maestros-v-4`) sirve solo para tres cosas: su alta, sus saldos iniciales y su cierre; no puede operar el caso porque le faltan tipologías y plantillas. Tiene solo el asiento de saldos iniciales de 5.000,00 (57200 Debe / 10000 Haber, 01-01-2026), así que las cifras del cierre práctico son otras que las del caso; el mecanismo es el mismo.

## Pasos
1. **Tener los dos ejercicios**: Finanzas › Maestros › Cierres › Ejercicios contables › «Añadir ejercicio» → Empresa `S{INI}`, Ejercicio 2027, Descripción «EJERCICIO 2027». Estado Abierto, Último asiento 0. «Éxito». Si no ves los tuyos, filtra por S{INI}. Antes de cerrar la empresa debe tener el asiento de saldos iniciales (hazlo antes en `contab-saldos-iniciales`: sin movimientos no hay nada que regularizar).
2. **Regularizar 2026**: abre el ejercicio 2026 de S{INI} → comprueba que sus asientos de 2026 están contabilizados → pulsa **«Regularización por ejercicio»** (se ejecuta al momento, sin confirmación).
3. **Comprobar el resultado bueno**: Estado **Regularizado**; periodos de enero a noviembre **Cerrado**; diciembre sigue Abierto; ahora se activan «Reapertura de ejercicio» y «Cierre definitivo».
4. **Cierre definitivo y reapertura** → solo explicados (sin ejecutar en la demo; sin verificar). Después de cerrar, se consultarían el asiento 99999999 y el de apertura en la lista de asientos de tu empresa.

## Trampas de este bloque
| Síntoma | Causa | Solución |
|---|---|---|
| He regularizado y no veo el 99999998 | La demo no lo generó: la ficha de la empresa tiene vacío «Programa regularización» | No es error tuyo; tu ejercicio en Regularizado ya es el resultado bueno; no sigas con el cierre definitivo |
| Reapertura y Cierre definitivo en gris | El ejercicio sigue Abierto | Regulariza primero |
| «EJERCICIO DE APERTURA INEXISTENTE O NO ACTIVO» | Falta el ejercicio siguiente en estado A | Créalo en Ejercicios contables y repite |
| Cierre definitivo con el ejercicio cerrado temporalmente | — | Lanza antes la reapertura |
| Quiero deshacer la regularización | — | «Reapertura de ejercicio», solo en tu empresa (no se ha comprobado qué hace con los periodos que ya estaban cerrados) |
| Mi ejercicio 2027 no sale | Filtro de empresa | Filtra por S{INI}; comprueba que pulsaste «Guardar» |
Si el cierre se planea con cifras del caso (sobre el papel): regularización 70000 200,00 D / 60000 125,00 + 626 13,50 + 129 61,50 H.
