# El caso continuo: tu empresa de principio a fin

Índice: 1 Reglas · 2 Personajes y códigos · 3 Operaciones del caso · 4 Asientos · 5 Comprobaciones de cuadre · 6 Frase puente · 7 Estado de las decisiones.

Fuente: `auditoria/guia_junior.md` §3 y §7 (decisiones D1-D5), cifras rehechas a mano en `revision_senior_fase2.md` §2, correcciones posteriores (`revision_senior_reauditoria_jm.md`, `revision_senior_final_jm.md`) y `_fuente/CODIGOS_ALUMNO.md` (manda para códigos y longitudes). Los bloques `caso-final-*` de `app/src/content/contabilidad-avanzada.json` son la versión que ve el alumno. Si algo de aquí choca con ellos o con `CODIGOS_ALUMNO.md`, manda lo vigente y se avisa.

## 1. Reglas

- Las cifras del caso son estas y no otras. Si un bloque necesita una cifra y no está, se pide antes de inventarla.
- Ningún paso cambia sus cifras por el caso (guardan capturas y progreso). El caso entra por `concepto` (`Ejemplo:`), `detalle` y `aprendido`.
- Cada vez que sale un dato que no es del alumno (empresa 0, LIZ, ALA, 00003, 00027, 00087, PRVCC0, CAPT_BCO, dólares), se dice de dónde sale **en esa misma frase**.
- Cuando un bloque reutiliza algo del caso, se dice con «lo creaste en…»: «Usa el proveedor T{INI} que creaste en «Dar de alta el proveedor y el artículo»».
- Las iniciales `{INI}` son **2 letras** siempre. Nunca menciones 3 letras.

## 2. Personajes y códigos

| Papel | Código | Dónde se crea | Nota |
|---|---|---|---|
| Tu empresa de práctica | `S{INI}` «Empresa prácticas {INI}», ejercicio 2026, banco `CAIXA{INI}`, tercero propio `TS{INI}` | Maestros › `maestros-v-4` | Solo sirve para practicar alta de empresa, saldos iniciales y cierre. No es cliente ni proveedor |
| Empresa donde se graban las operaciones | **empresa 0 «Deister Software»** de la demo (unidad 0 / CENTRAL) | Ya existe | Compartida por todos los alumnos; por eso en ella no se regulariza ni se cierra |
| Tu proveedor | `T{INI}` «Tercero {INI}» | Compras › `compras-1` | Cuenta en la prevista: 40000.T{INI} |
| Tu cliente | `C{INI}` «Cliente Maestros {INI}», plazo `P{INI}` (50 % a 30 días, 50 % a 60), tipo de efecto `R{INI}` (recibo domiciliado) | Contabilidad › «Dar de alta los datos básicos de contabilidad»; cliente en Gestión en el bloque de datos básicos de gestión | La subcuenta de cliente es propia de cada alumno; evita la 43000.00901 fija si ya está ocupada |
| Tu artículo | `13500620` «6000-2RS ISB», tipo contable PRODUCTO | Ya existe en la demo | No se modifica. `ROD{INI}` es solo para aprender la ficha: no se compra |
| Tu banco de trabajo | `BBVA_{INI}` (57200); caja `CAJA_{INI}` (57000) | Cartera › `carteras-3` | Lo usan Cartera y Tesorería |
| Tu diario | `{INI}` «Entrada de asientos {INI}» | Contabilidad › `asientos-1` | Asientos manuales |
| Tipologías de compra | OC, PC, AO, FC + `{INI}` | Compras › `compras-tipos` | Máx. 4 caracteres. AO{INI} no contabiliza el albarán |
| Tipologías de venta | O, PD, PV, AP, A, FP + `{INI}` (juego único creado en `ventas-documentos`; lista exacta en `CODIGOS_ALUMNO.md`) | Ventas › Configurar | AP{INI} (copia de AV, estándar, cambiando la «Tabla origen» a «Pedidos de venta») sin plantilla de asiento; la factura lleva el asiento 43000 / 47000 / 70000 |
| Línea financiera de cobros | `LRC{INI}` | Cartera | **No es la remesa**: es la línea. Escribir «crea la remesa LRC{INI}» es un error |

Comprueba siempre longitudes y nombres exactos en `_fuente/CODIGOS_ALUMNO.md` antes de citar un código nuevo.

## 3. Operaciones del caso (4T de 2026, IVA 21 %)

| Nº | Fecha | Operación | Importes |
|---|---|---|---|
| 1 | 01-10 | Los socios aportan dinero al banco | 3.000,00 |
| 2 | 05-10 | Oferta y pedido 0PC{INI}01 a T{INI} | 10 uds × 12,50 = 125,00 + IVA |
| 3 | 07-10 | Llega la mercancía: albarán | Stock +10 (valor 125,00) |
| 4 | 09-10 | Factura PROV-{INI}-001 de T{INI} | 125,00 + 26,25 = **151,25** |
| 5 | 15-10 | Venta a C{INI}: albarán y factura | 10 × 20,00 = 200,00 + 42,00 = **242,00**; stock 0 |
| 6 | 15-10 | La factura de venta deja dos efectos (P{INI}, R{INI}) | 121,00 vence 14-11; 121,00 vence 14-12 |
| 7 | 06-11 | Pago a T{INI} con remesa de pago por transferencia | 151,25 + comisión del banco 3,50 |
| 8 | 12-11 | Comisión de mantenimiento a mano ({INI}COM) | 10,00 |
| 9 | 14-11 | Cobro suelto del efecto 1 (gestión COBD) | 121,00 |
| 10 | 01-12 | Efecto 2 en una remesa de cobro SEPA; el banco cobra el 14-12 | 121,00 |
| 11 | 31-12 | Conciliación del extracto de BBVA_{INI} | Seis líneas, saldo 3.077,25 |
| 12 | 31-12 | Liquidación del IVA del 4T (modelo 303) | 42,00 − 26,25 = **15,75**; plazo hasta el **1-02-2027** (el 30-01 cae en sábado) |
| 13 | 31-12 | Regularización, cierre y apertura de 2027 | Beneficio **61,50** |

## 4. Asientos del caso

Cuentas del PGC; la demo difiere donde se indica. Las marcadas † no están comprobadas en la demo (sin verificar): hasta confirmarlas escribe el grupo o la cuenta tal como la nombra la plataforma. Comprobadas y usadas ya en `caso-final`: 62600.00000 (mnemotécnico `{INI}626`), 57200.00000, 43000.00901, 47000.00000, 47200.00000, 47500, 40090 y 60000.

| Nº | Asiento | Debe | Haber |
|---|---|---|---|
| 1 | Aportación | 57200 Bancos 3.000,00 | Capital (cuenta 100 del plan; la subcuenta exacta, sin verificar) 3.000,00 |
| 3 | Albarán de compra contabilizado (solo si la tipología lo contabiliza; AO{INI} no) | 60000 Compras 125,00 | 40090 Compras pendientes de factura 125,00 |
| 4 | Factura de compra | 40090 125,00 (o 60000 si el albarán no se contabilizó) · 47200 IVA soportado 26,25 | 40000.T{INI} Proveedor 151,25 |
| 5 | Factura de venta | 43000.00901 Cliente C{INI} (o la siguiente subcuenta libre) 242,00 | 47000 IVA repercutido en la demo 42,00 · 70000 Ventas 200,00 |
| 7 | Pago a T{INI} | 40000.T{INI} 151,25 · 62600 Servicios bancarios 3,50 (flujo {INI}COM, mnemotécnico {INI}626) | 57200 Bancos 154,75 |
| 8 | Comisión manual | 62600 10,00 | 57200 10,00 |
| 9 y 10 | Cobros de los efectos | 57200 121,00 (cada uno) | 43000.<subcuenta> 121,00 (cada uno) |
| 12 | Liquidación del IVA | 47000 (IVA repercutido en la demo; 477 en el PGC) 42,00 | 47200 26,25 · 47500 (475, Hacienda Pública acreedora por IVA) 15,75 |
| 13a | Regularización | 70000 200,00 | 60000 125,00 · 62600 13,50 · 129† Resultado 61,50 |
| 13b | Cierre | capital† 3.000,00 · 129† 61,50 · 47500 15,75 | 57200 3.077,25 |
| 13c | Apertura 01-01-2027 | 57200 3.077,25 | capital† 3.000,00 · 129† 61,50 · 47500 15,75 |

Fíjate: la demo lleva el IVA repercutido a la **47000.00000**, que en el PGC es la «Hacienda Pública, deudora por IVA»; el IVA repercutido del PGC va a la **477**. Cada sitio donde salga dice «es configuración de la demo: no la copies». Con la tipología AP{INI} sin plantilla de asiento, el albarán no genera asiento y la venta se cuenta una sola vez (200,00 de ventas); comprueba el texto vigente en `ventas-pedido` y `ventas-1` (si un albarán se contabiliza, se descontabiliza antes de facturar).

## 5. Comprobaciones de cuadre (úsalas en los `Ejemplo:`)

- **Compra**: 10 × 12,50 = 125,00; × 21 % = 26,25; total 151,25.
- **Venta**: 10 × 20,00 = 200,00; × 21 % = 42,00; total 242,00. Margen 200,00 − 125,00 = 75,00.
- **Efectos**: 242,00 × 50 % = 121,00 + 121,00.
- **Stock**: 0 + 10 − 10 = 0.
- **Banco** (BBVA_{INI}): 3.000,00 − 154,75 − 10,00 + 121,00 + 121,00 = **3.077,25**.
- **Clientes**: 242,00 − 121,00 − 121,00 = 0. **Proveedor**: 151,25 − 151,25 = 0.
- **IVA 4T**: 42,00 − 26,25 = 15,75 a ingresar.
- **Resultado**: 200,00 − 125,00 − 3,50 − 10,00 = **61,50**.
- **Sumas y saldos antes de liquidar el IVA**: deudores 3.077,25 + 125,00 + 13,50 + 26,25 = 3.242,00; acreedores 3.000,00 + 200,00 + 42,00 = 3.242,00.
- **Balance al 31-12**: banco 3.077,25 = capital 3.000,00 + beneficio 61,50 + Hacienda 15,75.
- **Abono de 1 ud**: −12,50 − 2,63 = −15,13. **Activo de práctica** (el caso no compra inmovilizado): ordenador de 1.200,00 a 4 años = 300,00 al año (25,00 al mes); valor neto tras 1 año 900,00; venta por 1.000,00 = 100,00 de beneficio.

## 6. Frase puente (cuando un bloque practica con otros datos)

Un párrafo `Ejemplo:` en el `concepto`, con esta forma:

> Ejemplo: en tu caso, [operación con cifras del caso]. En la demo practicas con [datos del bloque] porque [motivo: base del vídeo, registro de prácticas, empresa con divisa]. El mecanismo es el mismo.

Casos frecuentes: compras de 4 uds = 60,50 frente a 125,00 + 26,25 = 151,25; vídeo con USD/PEN, ALA, 1.815,00, 8.080,15, 1.524,60 o 5.082,00; capturas de otro registro (en `detalle`: «La captura es de otro albarán; en el tuyo verás tu número»); Activos e Impuestos con la empresa ALA («es otra empresa de la demo; tu compra a T{INI} sale al 21 %»).

## 7. Estado de las decisiones (a fecha de las auditorías)

D1 (operaciones en la empresa 0), D2 (cliente C{INI}), D3 (banco BBVA_{INI}), D4 (10 uds) y D5 (cuentas PGC estándar) están **decididas**. Siguen **sin verificar en la demo**: las cuentas con † (capital y 129; la 62600 y la 47500 ya constan en la plataforma), la posibilidad de una subcuenta de cliente con letras (43000.C{INI}), si el borrador del 303 contabiliza y si la baja de un activo genera la 671, y la ruta de la emisión del fichero SEPA y de «Tipos remesas». El signo del extracto (convención única) está pendiente de decidir con la demo.
