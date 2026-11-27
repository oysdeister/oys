# Diarios, numerador, asientos manuales y saldos iniciales

Fuente: `icon-contabilidad.json` › `asientos-1` a `asientos-6`, `asientos-11` a `-13`, `contab-saldos-iniciales`, `icon-contabilidad-1`; `auditoria/redaccion_contabilidad.md`.

## Índice
1. Diario
2. Numerador de justificantes
3. Cabecera del asiento
4. Líneas, cuadre y Finalizar
5. Contabilizar uno o muchos
6. Duplicar, invertir y copias periódicas
7. Corregir importes
8. Saldos iniciales
9. Periodificaciones y otros procesos masivos
10. Ejercicio, periodos y vigencia

Concepto: un **asiento** anota una operación con dos o más **apuntes** (cuenta + importe al Debe o al Haber) que suman lo mismo. El **diario** es el libro donde se agrupan por origen (como una libreta por tipo de gasto). Con tu diario propio, tus asientos de práctica no se mezclan con los de otros alumnos.

## 1. Diario (`cdiarios`)
- Finanzas › Maestros › Auxiliares › Diarios (o «cdiarios» en el buscador). **No** es Contabilidad General › Diario contable › Diarios: ahí están los informes del libro diario (Anual, Resumen, Por asiento).
- Las listas pequeñas tienen una **fila en blanco al final con ⊕**: escribes `{INI}` (**solo 2 caracteres**) y «Entrada de asientos {INI}» y pulsas ⊕ («Éxito»). También con el «+» del pie de la lista del campo Diario del asiento.
- Existentes: DA Cierre y apertura, DC Compras, DD Distribución costes, DG General, DV Ventas… El diario por defecto de la cabecera es DG.

## 2. Numerador de justificantes (`cjusnumh`, desde Justificante › «+»)
El justificante es el código correlativo con que se cita el asiento en auditorías y extractos. Tabla origen «Asientos contables», código `{INI}`, «Asientos manuales {INI}», **Rotura `#e#yy`**, **Numerador `{INI}#yy-#n`**, **Justificación 6** → primer justificante `{INI}26-000001`. Huecos: `#e` empresa, `#yy` año, `#d` diario, `#n` contador. «Detalle serializador» guarda el último número por rotura.
**Trampa**: Rotura y Numerador son **máscaras, no valores**. Con `26` y `0` el asiento se guarda sin error pero el justificante sale «0» en todos (sin `#n` nunca se muestra el contador, aunque avanza). Corrige el numerador; los asientos ya guardados conservan el «0». Las copias llevan el justificante `AC`. En una empresa nueva (saldos iniciales) el Justificante se rellena solo (AC).

## 3. Cabecera (Finanzas › Contabilidad General › Diario contable › Asientos › Asientos, `casientos`)
«Nuevo» (botón azul de arriba; ¡no el «Nuevo» de la lista de líneas!). Campos: Empresa 0 · Diario `{INI}` · Sistema A General (único en TUTORIAL) · Fecha 12-11-2026 (de ella salen ejercicio 2026 y periodo 11) · Justificante `{INI}` · Documento `{INI}-DOC-001` (se copia a todas las líneas) · Notas (propone la descripción de las líneas) · Moneda EUR cambio 1 · Estado Provisional.
Se guarda primero la cabecera (banda naranja PROVISIONAL; botones Recalcular cuadre, Reordenar líneas, Finalizar, Copiar asiento) y después se añaden líneas en la pestaña «Líneas de apuntes». La lista muestra los asientos de **todas** las empresas.

## 4. Líneas, cuadre y Finalizar
- Pestaña «Líneas de apuntes» › «Nuevo» **de la lista de líneas** (a la derecha de las columnas): Proyecto 0 (la Sección pasa sola) · Cuenta 62902.00000 · Debe divisa 1000. Si escribes en Debe, Haber se bloquea a 0 y al revés. Cada línea nueva **propone el importe que falta para cuadrar** y hereda el documento.
- Ejemplo de práctica: línea 1 62902 Debe 1.000,00; línea 2 57200.00000 Haber 1.000,00. Puede tener más líneas (4 en el bloque asientos-4: 62903 Debe 250 / 57200 Haber 250 → total 1.250,00).
- Bloque **Totales**: nº de líneas, Debe, Haber, **Cuadre** (rojo mientras ≠ 0). Si no se actualiza, «Recalcular cuadre». Con Cuadre ≠ 0 desaparece «Finalizar».
- Aportación del caso (se graba en el caso final, no aquí): 57200 Debe 3.000,00 / capital (cuenta 100) Haber 3.000,00, fecha 01-10-2026, en la empresa 0.
- Un aviso de fecha fuera de periodo/ejercicio = el mes está cerrado o no existe.

## 5. Contabilizar
- **Finalizar** (botón morado): Estado → Contabilizado, banda FINALIZADO, aparece la pestaña «Saldos», el botón pasa a **«Abrir a provisional»** (deja el asiento modificable y quita sus importes del mayor; no se puede si el periodo está cerrado). Al contabilizar, `imp_cuadre` debe ser 0.
- **Proceso «Contabilización»** (Asientos › Procesos › Contabilización, `casientos_contab`): fechas + Empresa 0 + (Columnas de consulta) Diario `{INI}` → «Ejecutar consulta» → «¿Está seguro?» Aceptar → cada asiento sale «Proceso completado correctamente». **Trampa grave**: con la Empresa en «*» y sin filtrar diario contabiliza **todos los provisionales del rango, también los de otros alumnos**. Filtra siempre empresa y diario. «ID. asiento» es un número interno distinto del número de asiento.
- Un provisional no sale en balance ni en saldos.

## 6. Duplicar, invertir y copias periódicas
- Botón naranja **«Copiar asiento»** (disponible también contabilizado): Fecha, Documento, Descripción (sustituyen los del original), **Número a generar**, **Cadencia mensual** (meses entre copias), «Copiar todo» (copia también cartera e impuestos) y **«Invertir asiento»** (contraasiento: mismo asiento con Debe y Haber cambiados; anula el original).
- La copia sale con clasificación Manual y puede salir Provisional o ya Contabilizada: **mira el estado**. Lleva justificante `AC`. Al aceptar, la página intenta abrir el asiento nuevo en otra pestaña; si el navegador la bloquea, la copia está creada igual.
- Copias periódicas: Fecha 01-12-2026, Número a generar 3, Cadencia 1 → 01-12-2026, 01-01-2027 y 01-02-2027. La numeración de asientos **empieza de nuevo cada año** (los de 2027 son el 1 y el 2). Necesitan que exista el **ejercicio 2027** de la empresa 0; si no, al contabilizar sale `cperiodo_ins: Fechas del periodo fuera de rango de vigencia en empresa`.

## 7. Corregir importes
Solo con el asiento **Provisional** (si está Contabilizado: «Abrir a provisional»). Las líneas no se editan en la cuadrícula: pulsa el número de la fila (columna izquierda) → panel lateral → cambia Debe divisa/Haber divisa → disquete del panel (el campo modificado lleva barra roja hasta guardar) → cierra con la X → «Recargar» ↻. Si cambias una sola línea, el asiento se descuadra (Cuadre en rojo, sin Finalizar): cambia también su **contrapartida**. Ejemplo: 62902 y 57200 de 1.000 a 1.500; total 1.750,00 con la línea de 250. Después «Finalizar».

## 8. Saldos iniciales (contab-saldos-iniciales)
Asiento manual normal con **fecha del primer día del ejercicio**; activo (banco, clientes) al Debe, pasivo y neto (capital, proveedores) al Haber. Práctica: empresa **S{INI}** (no la 0), diario DG, fecha 01-01-2026 (escribe 01012026; comprueba Ejercicio 2026 y Período 1; con la fecha de hoy cae en el periodo 11 y ya no son saldos iniciales), Notas «{INI} Saldos iniciales», líneas: 57200.00000 Debe 5.000,00 «Saldo inicial bancos»; 10000.00000 Haber 5.000,00 «Capital inicial» → Cuadre 0,00 → Finalizar. Se anota **una sola vez**; si te equivocas, abre a provisional y corrige, no crees otro. No lo confundas con el asiento de **apertura**, que crea el ERP al cerrar un ejercicio (`erp-next-cierre`). Si eliges una cuenta con grupo auxiliar (62999), la línea no guarda («Auxiliar» obligatorio).

## 9. Periodificaciones y otros procesos masivos (solo localizar; no lanzar en la demo)
Asientos › Procesos: **Generación de periodificaciones** (Cuenta destino, fecha del primer asiento, nº de periodificaciones y cadencia; seguro de 1.200 € = 12 × 100; también «Periodificar» desde una línea), **Auditar cuentas** (permisos MODAUD para lanzar y AUDACEPTAR para aceptar propuestas con IA, que solo propone punteo = P), **Cambio de sistema contable** (traspaso; solo asientos con `imp_cuadre = 0`), Descontabilización, Copia masiva (Cadencia 0/1/3/6/12). Cambian los apuntes de todos: basta leer filtros.

## 10. Ejercicio, periodos y vigencia
Tres pantallas por buscador: Maestro de empresas (`cempresa`: vigencia), Ejercicios contables (`cejercic`), Períodos contables (`cperiodo`). En TUTORIAL la empresa 0 vigente desde 2000. Error `cperiodo_ins…`: revisa la Fecha inicio de la empresa (anterior al ejercicio, fecha fin vacía o posterior), da de alta el ejercicio y sus periodos; no cambies la vigencia de empresas que no sean tuyas.
