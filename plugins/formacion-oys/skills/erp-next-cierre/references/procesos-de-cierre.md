# Procesos de cierre y apertura

Fuente: `contabilidad-avanzada.json` › `icon-contabilidad-2`; documentación oficial (`erp-nuevo-icon-documentacion`: cierre temporal PAGE 994, cierre definitivo PAGE 865, `capuntes_ejtmpcie`).

## Índice
1. Carpeta de procesos y orden
2. Regularización y cierre temporal
3. Cierre definitivo, reapertura, histórico y deuda LP
4. Botones de la ficha del ejercicio
5. Ver la contabilidad a una fecha pasada
6. Contradicción pendiente sobre la reapertura

## 1. Carpeta y orden (Finanzas › Contabilidad General › Procesos › Cerrar ejercicio contable)
Contiene: Ajuste de cuentas en divisas, Ajuste cartera en divisas, Regularización ejercicio, Cierre temporal del ejercicio contable, Cierre definitivo del ejercicio contable, Reapertura de ejercicio y Reclasificación deuda largo plazo. **El paso a histórico no está en esa carpeta.** Si no la encuentras, escribe «Cerrar ejercicio» en el buscador.
- Regularización de cuentas en divisas («Ajuste de cuentas en divisas»): ajusta al cambio de cierre las cuentas en moneda extranjera (una deuda de 1.000 $ vale distinto en euros en enero y en diciembre). Actualización de deuda de cartera en moneda extranjera: igual para la cartera.
- Orden: divisas → deuda en divisa → regularización → cierre temporal → (reapertura si estaba cerrado temporalmente) → cierre definitivo → paso a histórico → reclasificación LP.
- El cierre temporal **no sustituye** a la regularización ni al cierre definitivo. No lances estos procesos en la demo: cambian el ejercicio para todo el mundo; basta con localizarlos y leer qué piden.

## 2. Regularización y cierre temporal
- **Regularización**: crea apuntes que pasan los saldos de ingresos y gastos a una cuenta de Pérdidas y Ganancias según las **definiciones de regularización de la empresa** (patrón de cierre elegido). Pide Empresa y Ejercicio. Genera el asiento **99999998**, saldos en el **periodo 98**, y marca el ejercicio **regularizado (R)**.
- **Cierre temporal**: prepara los saldos de apertura del ejercicio siguiente; **no lanza antes la regularización ni crea asientos reales**. Copia el asiento de resultados a origen y pasa los saldos a `csaldos` del ejercicio siguiente (saldos de apertura en periodos -1 y 0). Exige que el ejercicio siguiente exista en estado A. Se puede repetir: recalcula apertura y resultados y **pierde los ajustes manuales previos**.

## 3. Cierre definitivo, reapertura, histórico y deuda LP
- **Cierre definitivo**: si el ejercicio está regularizado, genera el asiento de cierre de balance **99999999** (periodo 99, última fecha del último periodo) y el de **apertura** del siguiente (asiento 0, periodo 0, primera fecha del primer periodo); el ejercicio pasa a «cerrado». Si estaba cerrado temporalmente, reábrelo antes.
- **Reapertura de ejercicio**: aviso en rojo: borra el asiento de apertura, el de cierre y el de regularización de PyG; el ejercicio vuelve a «abierto».
- **Paso a histórico**: lleva los apuntes de un ejercicio **cerrado** a un área histórica («HISTÓRICO DE APUNTES»); allí solo se consultan y quedan fuera de la mayoría de los informes.
- **Reclasificación de deuda a largo plazo**: «Genera asiento contable para traspaso de LP a CP» (largo plazo = más de un año). Salda las cuentas de LP y pasa a corto la parte que toca según el maestro de deuda a largo plazo. Pide Empresa, Diario, Justificante y Vencimiento.

## 4. Botones de la ficha del ejercicio (Maestros › Cierres › Ejercicios contables)
Cinco botones: Reclasificación de deuda, Reapertura de ejercicio, Cierre definitivo, Cierre temporal, Regularización por ejercicio. Los grises no se pueden usar en el estado actual. Ejercicio Abierto: activos Reclasificación, Cierre temporal y Regularización. Regularizado: se activan Reapertura y Cierre definitivo y se apagan Regularización y Reclasificación.

## 5. Contabilidad a una fecha pasada
No hay un informe específico. Tres formas: saldos por periodo (Contabilidad General › Saldos: una columna por periodo 1-12 y «Total» = apertura + doce periodos; el saldo a 31-12 es ese Total), histórico de saldos (ejercicios cerrados) y Mayor de cuentas filtrando hasta la fecha. El cierre temporal no sirve para consultar.

## 6. Contradicción pendiente (sin resolver)
La reauditoría (`auditoria/revision_senior_reauditoria_jm.md`, punto 7) detecta que un texto dice que la reapertura borra los asientos «de cierre temporal» y otro que el cierre temporal no crea asientos reales. Criterio acordado: la reapertura borra los asientos de regularización y de cierre definitivo y **deshace** el cierre temporal. No se ha comprobado en la demo qué hace la reapertura con periodos ya cerrados.
