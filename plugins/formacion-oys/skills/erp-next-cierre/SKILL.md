---
name: erp-next-cierre
description: "Cierre y apertura del ejercicio contable en el ERP Deister Axional Next (demo nextdemo.geasa.eu, base TUTORIAL): orden de los procesos de cierre (regularización, cierre temporal, cierre definitivo, reapertura, paso a histórico, reclasificación de deuda a largo plazo), asientos 99999998 y 99999999, cierre práctico en la empresa propia S{INI}, balances y estados por agrupación (Situación financiera, Resultados integrales), cuentas anuales Excel, motor de consultas Excel, consolidación y el caso final de 13 operaciones con sus cifras (banco 3.077,25, IVA 15,75, beneficio 61,50). Úsala siempre que documentes, enseñes, grabes, corrijas o prepares ejercicios sobre cerrar el año, regularizar, abrir 2027, el balance, la cuenta de resultados o el caso final, o ante «EJERCICIO DE APERTURA INEXISTENTE O NO ACTIVO» o «¿por qué no veo el asiento 99999998?»."
---

# Cierre y apertura del ejercicio, balances y caso final (ERP Next)

Skill funcional del módulo «Contabilidad avanzada y cierre» de «Practicando Axional Deister VNext» (fase **Operar**, una vez al año). Lo no comprobado en la demo va marcado «(sin verificar)». El login lo hace el usuario.

## Relación con otras skills
Base contable (cuentas, asientos, saldos iniciales, mayor): `erp-next-contabilidad`. Empresa S{INI} y su ejercicio: `erp-next-maestros`. IVA del caso: `erp-next-impuestos`. Efectos, remesas y extracto del caso: `erp-next-cartera`, `erp-next-tesoreria`. Compras y ventas del caso: `erp-next-compras`, `erp-next-ventas`. Documentación oficial (cierre PAGE 865, 994, 993): `erp-nuevo-icon-documentacion`.

## Idea central (con analogía)
Cerrar el año es como hacer inventario y cerrar la caja el 31 de diciembre: calculas cuánto has ganado, dejas las cuentas a cero y al día siguiente arrancas con lo que tenías. Si se hace mal o fuera de orden, el beneficio sale equivocado y el año siguiente empieza con saldos que no son los tuyos. Tres pasos, **en este orden**:
1. **Regularizar**: llevar todos los gastos e ingresos (grupos 6 y 7) a la cuenta de resultados **129** («Resultado del ejercicio»). Con 10.000 € de ventas y 7.000 € de gastos, la 129 queda con 3.000 € de beneficio y los grupos 6 y 7 a cero.
2. **Cerrar**: dejar a cero el resto de cuentas (bancos, clientes, proveedores…) con el asiento de cierre.
3. **Abrir**: copiar esos saldos al 1 de enero siguiente con el asiento de apertura (el cierre al revés).

## Pantallas
| Qué | Ruta |
|---|---|
| Procesos de cierre | Finanzas › Contabilidad General › Procesos › Cerrar ejercicio contable |
| Ficha del ejercicio (botones de cierre) | Finanzas › Maestros › Cierres › Ejercicios contables |
| Saldos / saldos por periodo | Finanzas › Contabilidad General › Saldos |
| Balances | Finanzas › Contabilidad General › Balances |
| Consolidación | Finanzas › Contabilidad General › Consolidación |

## Reglas clave (con su porqué)
- **Orden recomendado**: regularización de divisas → actualización de deuda en divisa → regularización → cierre temporal; luego, reapertura si estaba cerrado temporalmente → cierre definitivo → paso a histórico → reclasificación de deuda a largo plazo. Los procesos cambian asientos y saldos de todos: revísalos antes de lanzarlos.
- **Dos ejercicios hacen falta**: el que cierras (2026) y el siguiente (2027) en estado **A (Abierto)**. Sin el 2027 el cierre temporal para con «EJERCICIO DE APERTURA INEXISTENTE O NO ACTIVO» (y no hay dónde abrir).
- **Números reservados**: regularización = asiento **99999998**, periodo 98 (ejercicio → Regularizado, R); cierre definitivo = **99999999**, periodo 99, última fecha del último periodo; apertura = asiento **0**, periodo 0, primera fecha del primer periodo; saldos de apertura del cierre temporal en periodos -1 y 0.
- **En la demo nunca regularices ni cierres la empresa 0**: su ejercicio lo comparten todos los alumnos. El cierre real se practica en tu empresa `S{INI}`; el caso final se repasa sobre el papel.
- **Hasta dónde llegó la comprobación**: en la demo se verificó hasta la regularización (Estado Regularizado, enero a noviembre Cerrado, diciembre Abierto). El cierre definitivo se explica con la documentación (sin verificar en la demo).
- **Resultado bueno** del bloque práctico: Estado del ejercicio 2026 = Regularizado y periodos de enero a noviembre = Cerrado. Si no ves el 99999998, es límite de la demo (la empresa no tiene «Programa regularización»), no un error del alumno; no lances «Cierre definitivo» sin comprobarlo.
- «Regularización por ejercicio» **se ejecuta al pulsarla, sin confirmación**: comprueba empresa y ejercicio antes.
- Con el ejercicio Abierto solo están activos Reclasificación de deuda, Cierre temporal y Regularización por ejercicio (Reapertura y Cierre definitivo en gris); tras regularizar se invierte (se activan Reapertura y Cierre definitivo).

## Qué leer según la tarea
- Procesos y números de asiento, orden, reapertura, histórico, fecha pasada → `references/procesos-de-cierre.md`.
- Práctica en S{INI} (ejercicio 2027, regularizar, resultado bueno, problemas) → `references/cierre-practica-sinicial.md`.
- Balances, estados por agrupación, cuentas anuales Excel, motor de consultas Excel, consolidación → `references/balances-y-cuentas-anuales.md`.
- Caso final de 13 operaciones, cifras de control, anomalías de la demo → `references/caso-final.md`.
- Bloques (id), fuentes y puntos pendientes → al final de `references/caso-final.md`.

## Bloques que lo enseñan (`etapas.ts`, módulo `contabilidad-avanzada`)
Etapa «Cerrar el año»: `icon-contabilidad-2` (cerrar y abrir: procesos), `contab-cierre-practica` (cierre de tu empresa), `icon-contabilidad-3` (balances y cuentas anuales). Etapa «Caso final»: `caso-final`. Dependencia: `contab-cierre-practica` usa los 5.000,00 de `contab-saldos-iniciales` (bloque de `erp-next-contabilidad`, hoy en la etapa opcional: la reauditoría propone moverlo a obligatoria antes del cierre).

## Cifras de control del caso (úsalas siempre igual)
Banco 3.000,00 − 151,25 − 3,50 − 10,00 + 121,00 + 121,00 = **3.077,25**; resultado 200,00 − 125,00 − 3,50 − 10,00 = **61,50**; IVA 42,00 − 26,25 = **15,75**; balance 3.077,25 = capital 3.000,00 + beneficio 61,50 + Hacienda 15,75. Regularización: Debe 70000 Ventas 200,00 / Haber 60000 125,00 + 626 13,50 + 129 61,50. Cierre: Debe capital, 129 y Hacienda / Haber banco 3.077,25; apertura 2027: banco 3.077,25 al Debe.
