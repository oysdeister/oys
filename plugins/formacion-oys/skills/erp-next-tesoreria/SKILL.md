---
name: erp-next-tesoreria
description: "Conocimiento funcional de Tesorería y conciliación bancaria del ERP Axional/Deister VNext (demo nextdemo.geasa.eu, base tutorial): banco propio (cbancpro) y comisiones, operaciones financieras (toperfin), flujos (tflujfin), parámetros (titescfg), movimiento de tesorería manual (taptcuen), extracto N43 del caso (textract_file/textract), conceptos comunes y propios, conciliación individual y automática, cajas, financiación, valores y avales, y extracto, conciliación y contabilización de una remesa, de un cobro y de un anticipo. Con asientos esperados, signo del extracto y trampas de la demo. Úsala siempre que haya que documentar, enseñar, grabar, corregir o crear ejercicios o preguntas de tesorería, o cuando pregunten «¿por qué no concilia?», «¿qué asiento deja el movimiento?» o «¿cómo cargo el N43?»."
---

# Tesorería y conciliación bancaria en el ERP nuevo (Axional VNext)

Módulo `tesoreria` de la plataforma (`app/src/content/tesoreria.json`, 12 bloques). Recibe los movimientos que nacen en Cartera (skill `erp-next-cartera`) y los compara con lo que dice el banco.

## Modelo en una frase
Cartera/factura → **movimiento de tesorería** (`taptcuen`, con fecha de operación y fecha valor) con sus **flujos** (`taptfluj`) → **conciliación** (`tconcili`) con el **extracto** del banco (fichero N43 → `textract_file` → `textract`) → **contabilización** (asiento).
Un movimiento necesita siempre **banco propio + operación financiera + al menos un flujo con cuenta contable**. Los dos lados se casan con conceptos: comunes (códigos estándar de la banca, `tconcomu`) y propios (de cada banco, `tconprop`) y su mapeo a operaciones.
- **Movimiento** = qué entra o sale; **flujo** = por qué (nómina, comisión…); **operación** = cómo (transferencia…).

## Orden de la plataforma (etapas.ts)
1. **Configurar · Preparar el banco**: `tesoreria-1` (banco propio BBVA_{INI}, formato de extracto, comisión {INI}TRF de 3,50), `tesoreria-2` (flujo, operación y parámetros {INI}COM).
2. **Operar · Movimientos, extracto y conciliación**: `tesoreria-3` (movimiento manual de 10,00), `asientos-14` (asiento del movimiento, en contabilidad), `tesoreria-4` (extracto N43), `tesoreria-5` (conciliar).
3. **Remesas en el banco**: `icon-cartera-v-8` (circuito), `-v-9` (extracto de una remesa), `-v-10` (conciliar y contabilizar), `-v-11` (cobro y anticipo).
4. **Para saber más** (opcional): `tesoreria-6` cajas, `-7` financiación, `-8` valores y avales.
Pasos y trampas bloque a bloque: `references/bloques_tesoreria.md`.

## Rutas (menú «Finanzas ›»)
Bancos propios: Cobros y Pagos › Maestros › Auxiliares › Bancos propios · Flujos: Tesorería › Maestros › Flujos financieros › Flujos financieros · Operaciones: Tesorería › Maestros › Operaciones › Registro · Parámetros: Tesorería › Maestros › Parametrización tesorería · Conceptos: Tesorería › Maestros › Conceptos › Comunes / Conceptos propios · Movimientos: Tesorería › Ops. corto plazo (buscador: «Movimientos de tesorería» o `taptcuen`) · Extractos: Tesorería › Extractos bancarios › Almacén ficheros / Movimientos · Conciliación: Tesorería › Conciliación bancaria · Automática: Tesorería › Procesos › Conciliación automática (`textract_concaut`) · Cajas: Caja · Financiación: Tesorería › Financiación · Valores: Tesorería › Cartera de Valores · Avales: Tesorería › Avales de garantías · Posición: Tesorería › Posición. Las rutas de toperfin, flujos, conceptos, parámetros y concili. automática no se han confirmado una a una (en el vídeo se abren con el buscador).

## Datos del caso continuo
- Empresa **0** de la demo (donde se graba todo el caso); la empresa S{INI} solo sirve para practicar altas y cierre. Banco **BBVA_{INI}** (57200.00000), creado en Cartera (`carteras-3`); no uses CAIXA{INI} de Maestros.
- Comisión del banco **{INI}TRF**: Posición Haber, operación PMICDT, tipo Fijo, 3,5000 desde 01-10-2026, «Operación comisión» = {INI}COM. Flujo **{INI}COM** (tipo flujo Comisión, posición Ambos, cuenta contable por el mnemotécnico {INI}626 → 62600.00000), operación **{INI}COM** (Salida, concepto «Pago», float 1 y 1).
- Movimiento manual: 12-11-2026, Salida, 10,00, operación {INI}COM (se ve como -10,00).
- Extracto del caso (N43 de 6 líneas, 01-10 a 31-12-2026, saldo final **3.077,25**): aportación 3.000,00 (-3.000,00 en el ERP); pago a T{INI} 151,25; comisión transferencia 3,50; comisión mantenimiento 10,00; cobro efecto 1 de C{INI} 121,00 (-121,00); cobro remesa efecto 2 121,00 (-121,00). Conceptos: común 02/04/06/17 y propio 002/004/006/017 del banco ES0182. Fichero `caso_BBVA_{INI}.n43` = copia de `app/public/n43/caso_BBVA_ZZ.n43` cambiando ZZ por las iniciales. Elige un camino: cargar el fichero en «Almacén ficheros» **o** dar de alta las seis líneas a mano; los dos duplican cada línea. 3.000 − 151,25 − 3,50 − 10,00 + 121,00 + 121,00 = 3.077,25.

## Signo del extracto (la trampa más repetida)
El extracto guarda los importes **desde el punto de vista del banco**: un cargo (sale dinero tuyo) en **positivo**, un abono (entra) en **negativo** (comprobado cargando un N43 en la cuenta CAPT_BCO: cargos de 480,00 y 12,50 positivos, saldo a favor de 4.507,50 guardado como -4.507,50). En tesorería es al revés (salida negativa). Por eso el extracto +10,00 casa con la tesorería -10,00. En el fichero N43 el importe va sin signo con clave 1 (cargo) o 2 (abono). En la ficha de conceptos, Debe/Haber también son del banco: cargo = Debe y abono = Haber (clave 1 y 2 del N43); en tu 572 es al revés: los cargos van al Haber y los abonos al Debe. Suma del extracto del caso con signo del banco: -3.077,25 (= 3.077,25 a tu favor). (La base TUTORIAL no tiene N43 propios; en la demo TRI el signo se vio al revés: pendiente de confirmar, está en DATOS_DUDOSOS.)

## Asientos esperados
| Situación | Debe | Haber |
|---|---|---|
| Movimiento manual de 10,00 contabilizado (comisión de mantenimiento) | 62600.00000 (flujo {INI}COM) | 57200.00000 |
| Pago de 151,25 a T{INI}, al conciliar el cargo y contabilizar el movimiento | cuenta puente de la acción de ordenar (la que dejó 40000.T{INI} al debe en Cartera) | 57200.00000 |
| Resultado neto del pago | 40000.T{INI} 151,25 + 62600 3,50 | 57200 154,75 |
| Comisión de 3,50 (movimiento {INI}COM propio) | 62600.00000 | 57200.00000 |
| Cobro de 121,00 con COBD o remesa s/Tes | ya contabilizado en Cartera (57200 / 430) | no se contabiliza otra vez |
Salida: cuenta del flujo al debe y banco al haber; entrada, al revés; siempre Debe = Haber. Con «Operación comisión» informada la comisión genera otro movimiento y otro asiento; vacía, es un flujo más del mismo asiento. Sin cuenta contable en un flujo el movimiento no contabiliza. En la base del vídeo la cuenta del banco era la 57900 «Fondos en movimiento», no la 572.

## Conciliar el caso: qué casa y qué no
- **Casan con tesorería**: 10,00 (manual), 151,25 (PMICDT de la remesa PSCTT) y 3,50 (comisión; si no existe el movimiento porque «Recalcular comisión» no lo creó, márcala y «Generar tesorería» con {INI}COM, y esa sí se contabiliza).
- **No tienen movimiento**: -3.000,00 (aportación, asiento manual) y los dos -121,00 (COBD y remesa s/Tes ya apuntaron la 572). Se quedan en «Extracto pendiente» y se justifican con su asiento. **No uses «Generar tesorería» con ellas: el banco subiría dos veces.** El saldo 3.077,25 lo comprueba la 57200.
- Conciliar no contabiliza: después hay que entrar en el importe de «Tesorería conciliada» y pulsar «Contabilizar».
- Botones: «Conciliar banco» (manual), «Cancelar extractos» (extorno: mismo importe en + y −, no toca tesorería), «Generar tesorería» (integración manual de un movimiento que solo está en el banco), «Conciliar cartera» (efecto que no pasó por tesorería, desde «Selección de efectos»), «Desconciliar». Desconciliar un movimiento nacido del extracto (origen Extracto, marca X) lo elimina si no está contabilizado.

## Conceptos propios y automática (lo que enseñaron las sesiones de Deister)
- Tipo de conciliación del concepto propio: **Individual** (importe a importe) o **Total por día** (suma todos los importes del mismo concepto y crea un solo movimiento; p. ej. cinco salidas de 100 = una de 500).
- **Integración** (Debe/Haber con su operación): crea el movimiento de tesorería de lo que solo trae el banco (comisiones, impuestos, ITF). Criterio de filtro con patrón (p. ej. «comisión*») cuando el texto identifica el movimiento y no el código.
- **Operaciones a conciliar** (posición, orden, operación, texto, %, importe): mapea el concepto propio con operaciones de tesorería; sin operación vinculada el concepto no concilia.
- Parámetros de la operación: Referencia (No considerar = por importe aproximado; Documento; 1.ª o 2.ª referencia), **float** de fecha operación y fecha valor (± días; 1 si el banco carga un día después), **Primer registro** (con importes repetidos toma el primero), «Al conciliar extracto», «Al generar desde cartera». Tolerancias en % y en importe en los parámetros de tesorería para diferencias de céntimos.
- Un concepto propio que viene en el N43 y no existe da error al cargar: dalo de alta (banco, concepto, descripción, tipo). Un extracto cuyo saldo inicial no es el final del anterior no carga: carga en orden y sin huecos (fecha y saldo del extracto en la ficha del banco).
- La conciliación automática filtra por empresa, cuenta, fechas y concepto, y devuelve pendientes y conciliados; si no concilia, revisa concepto propio, parámetros de la operación y tolerancias.

## Trampas y avisos
- «Fecha valor» es obligatoria en el movimiento manual; sin ella no se graba.
- Agrupación obligatoria en la operación financiera (si no deja guardar, elige una en Información complementaria).
- La comisión sale en el mismo movimiento o aparte según «Operación comisión» vacía o llena.
- Banco con entidad informada sin cuenta/IBAN no guarda (los dos o ninguno).
- Dudas sin confirmar: ruta de menú de varios maestros; cuenta 626 (la del PGC; en TUTORIAL es 62600); la 64420 que sale en una captura es el flujo ALMY de otra base: el alumno ve {INI}626 → 62600.00000 (DATOS_DUDOSOS: texto que pide 626 con flujo traducido a 64420).
- Las capturas del vídeo (CAPT_BCO, PRVCC0, remesas de 8.080,15 y 1.524,60, 5.082,00) son de otras bases: se explican con un puente a las cifras del caso.

## Referencias
- `references/bloques_tesoreria.md`: los 12 bloques paso a paso.
- `references/modelo_tecnico.md`: tablas, cajas, traspasos, comisiones, financiación, valores y avales (resumen propio de la documentación de referencia).
- `references/sesion2_indice.md`: índice minutado de la sesión II de formación de Deister (noviembre de 2024) para localizar clips: cap01 Operaciones financieras, cap02 Flujos, cap03 Movimiento de tesorería (sesión I, solo 3 tramos con Next); cap04 Del efecto al movimiento, cap05 De la remesa a la tesorería, cap06 Extracto N43 y carga, cap07 Conciliación individual, cap08 Conceptos propios, cap09 Operaciones a conciliar y conceptos comunes, cap10 Botones de la conciliación, cap11 Conciliación automática. Release `video-tesoreria-v1` de oysdeister/oys, mapa en `app/src/content/video-tesoreria.ts`. Criterio: solo pantalla, recortada, sin Meet ni caras; la sesión I es casi toda diapositivas o versión antigua. Las transcripciones completas no están en el repo público; su ejemplo es una clínica de Perú: no uses esos datos, usa los de la demo.
