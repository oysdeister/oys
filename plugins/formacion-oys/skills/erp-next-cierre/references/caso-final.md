# Caso final («Recorrer tu empresa de principio a fin»)

Fuente: `contabilidad-avanzada.json` › `caso-final` (32 KB); `auditoria/revision_senior_fase2.md`, `reauditoria.md`, `correccion_1.md`; `_fuente/CODIGOS_ALUMNO.md`.

## Índice
1. Qué es y reglas del caso
2. Las 13 operaciones
3. Anomalías de la demo
4. Cifras de control
5. Problemas típicos
6. Bloques, fuentes y pendientes

## 1. Qué es
Caso de repaso («examen de conducir en la calle»): 13 operaciones del 4T de 2026 con IVA general del 21 %, en 4 unidades (preparar y comprar 1-4; vender 5-6; pagar y cobrar 7-10; conciliar, liquidar IVA, cerrar y comprobar 11-13). Una unidad cada vez; no lleva capturas; se hace en la Demo real. **Las operaciones 1 a 12 se graban en la empresa 0 «Deister Software»** (compartida; tiene tipologías y plantillas); S{INI} no se usa aquí. **La 13 no se lanza** en la empresa 0: se repasa sobre el papel. Antes de empezar, comprueba tu empresa S{INI}, T{INI}, C{INI} (con P{INI} y R{INI}), el banco BBVA_{INI} (cuenta 57200) y el diario {INI}. Los códigos llevan tus 2 iniciales.

## 2. Las 13 operaciones
| # | Fecha | Operación | Ruta | Cifra | Bloque que lo enseña |
|---|---|---|---|---|---|
| 1 | 01-10 | Aportación de los socios | Finanzas › Contabilidad General › Diario contable › Asientos | 57200 D 3.000,00 / capital (100) H 3.000,00 | Crear un asiento manual (`asientos-2`) |
| 2 | 05-10 | Oferta y pedido a T{INI}: 10 × 12,50 del artículo 13500620, pedido 0PC{INI}01 | Gestión › Compras › Ofertas / Pedidos | 125,00 | Pedir: de la oferta al pedido |
| 3 | 07-10 | Albarán de entrada (AO{INI}: no genera asiento) | Gestión › Compras › Albaranes | 125,00; stock +10 | Recibir la mercancía |
| 4 | 09-10 | Factura PROV-{INI}-001: 60000 D 125,00 + 47200 D 26,25 / 40000.T{INI} H 151,25 | Gestión › Compras › Facturas | 151,25 | Registrar y contabilizar la factura |
| 5 | 15-10 | Venta a C{INI}: pedido PD{INI}, albarán AP{INI}, factura FP{INI}: 43000.00901 D 242,00 / 47000 H 42,00 + 70000 H 200,00 | Gestión › Ventas | 242,00; stock a 0 | Vender del albarán a la factura |
| 6 | 15-10 | Efectos de la venta: dos de 121,00 (14-11 y 14-12), tipo R{INI}, PE | Finanzas › Cobros y Pagos › Movimientos | 121,00 + 121,00 | Ver los efectos |
| 7 | 06-11 | Pago a T{INI} por remesa Pagar, tipo PSCTT, BBVA_{INI}; efecto 151,25 a OP | Cobros y Pagos › Remesas › Registro de remesas | 151,25 + 3,50 comisión | Crear una remesa de pago |
| 8 | 12-11 | Comisión de mantenimiento: movimiento manual, Salida 10,00, operación {INI}COM; 62600 D / 57200 H | Finanzas › Tesorería › Ops. corto plazo | 10,00 | Registrar un movimiento manual |
| 9 | 14-11 | Cobro del efecto 1: gestión COBD; 57200 D 121,00 / 43000.00901 H 121,00; PE → CO; no crea movimiento de tesorería | Cobros y Pagos › Gestiones | 121,00 | Cobrar efectos |
| 10 | 01-12 | Remesa de cobro SEPA del efecto 2: Cobrar, tipo CSDDS, línea LRC{INI}; cobro confirmado 14-12 | Remesas | 121,00 | Cobrar un recibo domiciliado con mandato SEPA |
| 11 | 31-12 | Concilia el extracto N43 de BBVA_{INI}: 6 líneas, termina en 3.077,25 | Tesorería › Extractos bancarios / Conciliación bancaria | 3.077,25 | Dar de alta el extracto; Conciliar |
| 12 | 31-12 | Liquida el IVA del 4T (modelo 303): 47000 D 42,00 / 47200 H 26,25 + 47500 H 15,75 | Finanzas › Impuestos › IVA › Borrador autoliquidación IVA (Modelo 303) | 15,75 (plazo hasta el lunes 1-02-2027) | Liquidar y presentar |
| 13 | 31-12 | Cerrar el año sobre el papel: regularización, cierre y apertura | Maestros › Cierres › Ejercicios contables | 61,50 | `contab-cierre-practica` |

Detalles: en la 11, las tres líneas con movimiento de tesorería (151,25, 3,50, 10,00) se concilian con «Conciliar banco»; aportación, cobro COBD y remesa s/Tes no tienen movimiento y se quedan en «Extracto pendiente» (se justifican con su asiento en la 57200). El extracto guarda cargos en positivo y abonos en negativo (saldo a tu favor -3.077,25). La 47000 es el IVA repercutido de la demo (477 en el PGC); 47500 = 475 Hacienda Pública acreedora por IVA. Los bloques de compras practican con 10 unidades a 12,50; los de «Contabilizar el albarán» y «Generar la factura» usan 4 unidades (50,00 y 60,50), mismo mecanismo.

## 3. Anomalías de la demo (no son errores del alumno)
- **Remesa de cobro (op. 10)**: el asiento lleva al Haber la **23000** en lugar de la 43000.00901. La 43000.00901 de C{INI} queda con 121,00 en el mayor aunque el efecto esté CO; el banco 57200 sube igual (ver `erp-next-contabilidad/references/trampas.md`, «asientos al revés»).
- «Generar tesorería» con la aportación o con un cobro y contabilizarlo duplica el importe en el banco: descontabiliza el movimiento generado.
- Regularización sin 99999998 en una empresa sin «Programa regularización» (ver `cierre-practica-sinicial.md`).

## 4. Cifras de control
Banco 57200 = 3.000,00 − 151,25 − 3,50 − 10,00 + 121,00 + 121,00 = **3.077,25** (Mayor de cuentas filtrado por tu diario y documentos; el saldo total de la empresa 0 es otro). Resultado **61,50**. IVA **15,75**. Balance 3.077,25 = 3.061,50 + 15,75. Cliente 242,00 − 121,00 − 121,00 = 0 y proveedor 151,25 − 151,25 = 0 (con la anomalía de la 23000, 43000.00901 muestra 121,00). Stock 13500620: 0 + 10 − 10 = 0. Sumas y saldos antes de liquidar IVA: Debe 3.242,00 (3.077,25 + 125,00 + 13,50 + 26,25) = Haber 3.242,00 (3.000,00 + 200,00 + 42,00).
Cierre sobre el papel: regularización 70000 200,00 D / 60000 125,00 + 626 13,50 + 129 61,50 H (cuadra); cierre: capital, 129 y Hacienda al Debe, banco 3.077,25 al Haber; apertura 2027: banco 3.077,25 al Debe.

## 5. Problemas típicos
| Síntoma | Solución |
|---|---|
| El banco no termina en 3.077,25 | Repasa operaciones 1, 7, 8, 9 y 10 en el Mayor de 57200 con tu diario; busca el asiento que falta o duplicado |
| Falta C{INI} o BBVA_{INI} | Vuelve a «Dar de alta los datos básicos de contabilidad» y «Dar de alta bancos propios y cajas» |
| «Fecha fuera de periodo» | Periodo cerrado: revisa Ejercicios contables o usa un periodo abierto |
| No encuentro la pantalla | Abre la ruta del paso o usa el buscador |
| Mi registro no sale en la lista | Revisa filtro y empresa: los documentos del caso están en la empresa 0, no en S{INI} |
| El IVA no sale 15,75 | Repasa operaciones 4, 5 y 12 (apuntes de 47000 y 47200 filtrados por tus documentos) |

## 6. Bloques, fuentes y pendientes
- Bloques: `caso-final` (en `etapas.ts`, etapa «Caso final»), `icon-contabilidad-2`, `contab-cierre-practica`, `icon-contabilidad-3`.
- Fuentes: `app/src/content/contabilidad-avanzada.json`, `etapas.ts`, `_fuente/CODIGOS_ALUMNO.md`, `auditoria/revision_senior_fase2.md` (regularización 700/600/626/129 «OK»; cierre y apertura «OK»; procesos y números 99999998/99999999/0 y periodos 98/99/0 «Correcto»), `auditoria/reauditoria.md` (N05 «tu empresa», N12 dependencia de saldos iniciales, N25 bloques demasiado técnicos), `auditoria/correccion_1.md`.
- Pendientes: cierre definitivo no ejecutado en la demo; contradicción sobre qué borra la reapertura (ver `procesos-de-cierre.md` §6); examen sin preguntas del caso final (la reauditoría propone «¿qué cuentas salda el asiento de regularización?»).

## Lecciones de sesiones (síntoma → causa → regla)
- **Cierre sobre la empresa 0 compartida**. Síntoma: el caso final regularizaría el ejercicio y pedía comprobar saldos que mueven todos los alumnos. Regla: el cierre se hace solo sobre el papel; avisa de no ejecutar cierres ni procesos masivos en la demo y no sugieras «borrar el ejercicio y recrearlo».
- **«Fechas fuera de rango»**: no cambies la empresa en una demo compartida; avisa al formador.
- **Asientos al revés** (impagado `cefectos_c_devol`, remesa SEPA con 23000): ver `erp-next-contabilidad/references/trampas.md`.
