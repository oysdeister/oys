# Amortizar, procesos, baja, venta e informes

Índice: 1 Valores · 2 Contabilizar amortizaciones · 3 Traspaso, cambio de amortización, división · 4 Baja, baja parcial, venta, desactivar · 5 Informes · 6 Tablas técnicas.
Fuente: `icon-activos.json` bloques `icon-activos-2` y `-3`; `hechos-activos.md` §5-6 y `hechos-activos-b.md`.

## 1. Valores del componente
«% Amortización» y «Años» marcan el ritmo; los años salen del % redondeando al alza (32 % → 100/32 = 3,1 → 4). «Valor neto» = valor de inventario − amortización acumulada. «Sistema» = juego de valores (casi todo A en la demo; también C y H): permite llevar a la vez amortización contable (A) y fiscal (C). «Sistema amortización»: L lineal, D decreciente u otro definido por la empresa. El % debe estar dentro de los límites del código fiscal (columnas «Mínimo» y «Máximo» del cuadro). Ejemplos: 600 al 20 % lineal = 120/año; ordenador 1.200 al 25 %/4 años = 300,00 al año, 25,00 al mes. Cuadro del {INI}ORD: cuatro cuotas de 300,00 en estado Pendiente (valor neto tras el primer año: 900,00).

## 2. Contabilizar amortizaciones («Finanzas › Activos permanentes › Procesos › Contabilización amort.»)
Genera el asiento de las cuotas pendientes del periodo, para los proyectos y sistemas elegidos. **Debe 68x (gasto) / haber 28x (amortización acumulada)**. «Contabilizar» pasa las cuotas a estado Contabilizado; «Descontabilizar» genera el asiento inverso y las devuelve a Pendiente (no «Normal»). El gasto se reparte entre centros de coste según la **imputación programada** del ejercicio (p. ej. 60 % oficina, 40 % almacén) y, si no la hay, va a la cuenta de explotación y centro del elemento. **Requisito: el ejercicio contable debe estar dividido en periodos (meses)**; si no, el proceso avisa y no arranca. En la demo compartida no se lanza (contabilizaría las cuotas de todos): se miran sus campos. El resultado muestra una fila por componente con periodo, %, importe, estado y total por empresa.

## 3. Otros procesos (mismo grupo «Procesos»)
- **Traspaso de elementos**: cambia bien, cuentas de inmovilizado, proyecto, sección, cuenta de explotación o centro. **Genera apuntes** en la fecha de ejecución (para eso existe la cuenta puente). Se marcan elementos y se pulsa «Traspasar elementos».
- **Cambio de amortización**: cambia sistema o % de los componentes elegidos dentro de los márgenes fiscales. **No genera asientos**, recalcula el cuadro desde la fecha del proceso y altera el histórico si esa fecha no coincide con el fin del periodo de amortización. Lista agrupada por empresa, bien y elemento.
- **División de un elemento**: lo parte en varios y reparte proporcionalmente valor de adquisición, amortización acumulada e importes netos; pide identificador, tipo (por porcentaje o por importe), número de divisiones, valor y serie de los nuevos (por defecto AUTO); no se documentan asientos. Captura: OPT000003 de 36.000 → original 34.200 + nuevo OPT000101 1.800 (5 %).
Regla mnemotécnica: traspasar genera apuntes; cambiar la amortización, no (¿cambia la contabilidad —cuentas, proyecto— o solo el ritmo?).

## 4. Baja, venta y desactivar (botones del componente)
- **Baja**: retira el componente entero; pide fecha, motivo y sistema (captura: programa de 4.000 al 33 % dado de baja el 04-11-2020, motivo «Deprecated»). Antes contabiliza la amortización pendiente; cancela inventario y amortización acumulada; el VNC restante a pérdidas (671 material / 670 intangible; el programa es intangible).
- **Baja parcial**: pide además el importe; divide el componente en dos (la parte retirada y la que sigue).
- **Venta**: como la baja + «Valor de venta» (en la captura también la cuenta del cobro). Resultado = precio − VNC: beneficio 771/770, pérdida 671/670. La cuenta del cobro es normalmente el banco (572; 57200 en la demo) o, si se cobra después, 543 Créditos a corto plazo por enajenación de inmovilizado. La captura usa 10200.00000 (dato de prueba). Aspiradora industrial 600 al 20 %, 5,57 amortizados, VNC 594,43, venta 450: **pérdida 144,43**.
- **Desactivar**: parada temporal; no sale del inventario, no genera apuntes; consulta al responsable contable si debe seguir amortizando. «Fuera de servicio»: marca retirado de uso; el curso no lo enseña (la documentación se contradice: apunte contra 671 y «no genera apuntes»: sin verificar). «Recalcular amortizaciones», «Activar», «Retroceder baja» y «Retroceder venta» existen en la barra.
Ventanas de baja y venta: **no aceptar, salir con «Cancelar»** en la demo.

## 5. Informes («Finanzas › Activos permanentes › Informes»)
Tres carpetas: «Amortizaciones» (Situación actual, Situación previsional a 5 años, Situación histórica, Auditoría; p. ej. «Amortizaciones de inmovilizado por proyectos», empresa CAN, proyecto 28 Madrid, bien ES2160 Mobiliario, total 11.166,67 con totales por bien, sistema, proyecto y empresa), «Situación» (Inventario, Elementos inactivos, Totalmente amortizados, Altas bajas y ventas…) y «Control de integridad» (diferencias entre el mayor y el inventario o la amortización acumulada). Además el grupo «Comprobación» (consultas por bien, elemento, componente y cuadro). Solo consulta: no insertan, modifican ni borran. Los elementos D tienen cuota más alta al principio que los L.

## 6. Tablas técnicas (resumen documentación; no inventar más)
`cinmhead` (bien), `cinmelem` (elemento), `cinmeval` (valores del elemento), `cinmcomp` y sus variantes `cinmcomp_bajap`, `_bajatot`, `_venta`, `_desact`, `_fuera`, `_traspasos` (componente y acciones), `cinamor` y `cinamor_contab_exe` (contabilización de amortizaciones), `cinmtras_pcs` (traspaso), `cinmcval_camsisamo` (cambio de amortización). La documentación no cita tablas SQL para baja/venta ni división.
