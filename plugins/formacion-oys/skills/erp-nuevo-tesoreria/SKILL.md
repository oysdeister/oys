---
name: erp-nuevo-tesoreria
description: Conocimiento funcional de Tesorería y conciliación bancaria en el ERP Axional/Deister versión Next. Cubre bancos propios (cbancpro), operaciones financieras (toperfin), flujos (taptfluj), comisiones, parámetros (titescfg), movimiento de tesorería (taptcuen), el paso de efecto o remesa a tesorería, extracto N43 (textract_file/textract), conceptos comunes (tconcomu) y propios (tconprop), y conciliación individual y automática (textract_concaut). Incluye el índice minutado de las dos sesiones de formación de Deister (noviembre de 2024) y dónde están los clips. Úsala para documentar, enseñar, grabar o crear ejercicios o preguntas de tesorería en el ERP nuevo.
---

# Tesorería en el ERP nuevo (Axional Next)

## Fuentes
- Carpeta `~/Downloads/VNEXT Doumentacion/Tesorería`. Contiene dos grabaciones de Meet de Deister, impartidas por Marlon Fernández y Rebeca Nascimento:
  - Sesión I: 31 min, 2024-11-23.
  - Sesión II: 59 min, 2024-11-27.
  - Cada sesión tiene su PDF de diapositivas con capturas de Next.
- Grabaciones sin editar:
  - En la sesión I casi siempre enseñan la **versión antigua**; las pantallas de Next solo salen a ratos.
  - El ejemplo es una clínica de Perú (soles, cuentas 10-4). No uses esos datos: usa los de la demo (empresa Triathlon TRI, BBVACCTRI, 57200).
- Las transcripciones completas de las sesiones no se incluyen en este repo público (las tiene Sergi). Índice temático de la sesión II en `references/sesion2_indice.md`.
- Clips publicados: Release `video-tesoreria-v1` de oysdeister/oys (11 clips, 77 MB, `cap01`…`cap11.mp4`), mapa en `app/src/content/video-tesoreria.ts` (base cambiable con `VITE_VIDEO_TESORERIA_URL`). Criterio de Sergi: «solo pantalla, recortada» — solo tramos con Next, recortados sin Meet, caras, barra del navegador ni nombres; tapados IBAN, usuarios (marlon.fernandez, deister_peru…), filas «PER», calendario «LIMA». Revisar con OCR (tesseract) 1 fps antes de publicar.
  - Sesión I (solo 3 tramos con Next): cap01 Operaciones financieras 18:23 · cap02 Flujos 20:18 · cap03 Movimiento de tesorería 24:34.
  - Sesión II: cap04 Del efecto al movimiento 3:20 · cap05 De la remesa a la tesorería 10:45 · cap06 Extracto N43 y carga 19:21 · cap07 Conciliación individual 24:39 · cap08 Conceptos propios 31:08 · cap09 Operaciones a conciliar y conceptos comunes 35:58 · cap10 Botones de la conciliación 43:07 · cap11 Conciliación automática 50:00.
  - La sesión I es casi toda diapositivas o versión antigua; la sesión II enseña Next en el entorno «Deister Perú / ICON next» (por eso hay que tapar tanto).

## Modelo
Del lado de la tesorería: **cartera/factura** → movimiento de tesorería `tmovites`/`taptcuen` (con su fecha de operación y fecha valor) → flujos `taptfluj`.

Del lado del banco: fichero N43 → `textract_file` → extracto `textract`.

Los dos lados se casan en `tconcili` mediante un mapeo: operaciones y flujos de un lado, conceptos comunes y propios del otro.

Un movimiento de tesorería necesita siempre **banco propio + operación financiera + flujo con cuenta contable**.

## Maestros y campos clave
- **Bancos propios** (`cbancpro`, ruta Finanzas › Cobros y pagos › Maestros › Auxiliares › Bancos propios). Campos:
  - Identificación: empresa, código de cuenta financiera, descripción, moneda.
  - Banco: entidad, IBAN o BBAN, tipo de cuenta, agrupación, BIC/SWIFT, cuenta contable (p. ej. 57200).
  - Uso: preferencias (pagos, cobros, ambos o ninguno), estado, línea financiera (factoring/confirming).
  - Calendario (sirve para calcular comisiones e intereses) y fechas de apertura y vencimiento.
  - Numeradores de cheques, pagarés, recibos y letras.
  - **Control del extracto**: formato (p. ej. BBVA AEB43), fecha del extracto y saldo del extracto.
  - En Next, al pie de la ficha, aparecen como vistas el calendario, los numeradores, las remesas por cuenta, las operaciones y las comisiones.
- **Operaciones financieras** (`toperfin`).
  - **Posición**: Entrada o Salida.
  - **Interface**: el asiento al contabilizar, p. ej. «Sin cartera de efectos» (NOCAR).
  - **Información complementaria**: agrupación, flujo, concepto, y clase y acción cuando viene de cartera.
  - **Parámetros de conciliación**:
    - Referencia: *No considerar* concilia por importe; *Documento* concilia por número de operación; también 1.ª o 2.ª referencia.
    - Float de fecha de operación y float de fecha valor: margen en ± días.
    - **Primer registro**: con importes repetidos, toma el primero que encuentra.
    - «Al conciliar extracto» y «Al generar desde cartera»: Autorizar…
  - En Next hay campo **Estado** (Abierto/Cerrado).
- **Flujos financieros**:
  - Código, descripción, agrupación y estado.
  - **Tipo de flujo**: Comisión, Interés o No gasto.
  - **Posición**: Debe, Haber o Ambos.
  - **Cuenta contable** (obligatoria en la práctica), proyecto, sección, cuenta de explotación, centro de coste.
  - Factura financiera (artículo y tipo de factura).
  - Detalle de cuentas mnemotécnicas por plan contable.
- **Comisiones bancarias**, por cuenta financiera:
  - Posición, operación sobre la que se calcula, código de comisión y operación de comisión. Si se informa la operación de comisión, se genera un movimiento aparte.
  - Comisión por beneficiario o por efecto.
  - Tipo fijo o variable: importe o porcentaje, importe exento, importe mínimo y máximo, fecha de inicio.
- **Parámetros de tesorería** (`titescfg`): notificar medio plazo, relación cuenta y operación, borrar cartera, conciliar, conciliar estimados, detener carga de extractos, búsqueda de flujos (p. ej. XEITCO), fecha contable (de operación o de proceso), tolerancias en % y en importe.

## Circuito
1. **De la cartera a la tesorería.**
   - Al cobrar o pagar un efecto (acción de cartera, p. ej. PTES) o al contabilizar una **remesa** (tipo p. ej. PSCTT, botón «Agregar efectos»), nace el movimiento `taptcuen` con su flujo.
   - Los enlaces contables de cartera deciden las cuentas.
   - Error típico: la fecha valor no cuadra.
2. **Movimiento manual.** Botones: Auditar tesorería, Contabilizar, Anular pseudo-conciliación y Recalcular comisión. Lleva las casillas auditado tesorería y auditado contable. El asiento va de la cuenta del banco a las cuentas de los flujos o efectos; la comisión, a la 626.
3. **Extracto N43.**
   - Se sube al almacén de ficheros y se pulsa «Cargar extracto bancario». El resultado son líneas `textract` con fecha de operación, fecha valor, documento, referencias, concepto común, concepto propio e importe.
   - **Conceptos comunes**: códigos estándar de la AEB, p. ej. 02 Abonarés-entregas-ingresos.
   - **Conceptos propios**, por banco: tipo de conciliación Individual o Total por día, Integración Debe/Haber con su operación, criterio de filtro «%» y la rejilla **Operaciones a conciliar** (posición, orden, operación, texto, %, importe). Un concepto propio sin operación vinculada no concilia.
4. **Conciliación individual** (pantalla Conciliación bancaria, `textract_concil_taptcuen_vtab`).
   - Pestañas «Extracto bancario pendiente/conciliado» y «Tesorería pendiente/conciliada/Selección de efectos».
   - Botones Cancelar extractos, Generar, Conciliar efectos, Conciliar y Desconciliar.
5. **Conciliación automática** (`textract_concaut`). Se filtra por empresa, cuenta, fechas y conceptos, y devuelve lo conciliado y lo pendiente. Si no concilia, revisa el concepto propio y los parámetros de la operación.

## Contenido ya creado (plataforma O&S)
- Módulo `tesoreria.json`, 5 ejercicios: 1 Banco propio preparado para tesorería (remite a Carteras 3) · 2 Operación financiera, flujo y parámetros · 3 Movimiento de tesorería manual · 4 Extracto N43 y conceptos del banco · 5 Conciliación individual y automática.
- Sin repetir contenido (criterio de Sergi, módulos por tema funcional): efecto, acción PTES, enlaces contables y remesa PSCTT con tesorería están en `carteras-7` «De la cartera a la tesorería»; el asiento del movimiento (57200 / 40000, comisión 62600) en `asientos-14`.
- Códigos reales de operaciones de la demo: ACOPCL = gestión de cuentas, apertura y cierre (no es cobro); pagos PMICDT, PMIDDT, PNOMIN; cash pooling CMCAPL (flujo NETT). El campo de la comisión aparte se llama «Operación comisión».
- Simulador del taller `Concilia.tsx` y ronda 6 de `Asiento.tsx`.
- Preguntas de tesorería en `lib/examen.ts`.
- Dudas sin confirmar en la demo: rutas de menú de toperfin, flujos, tconcomu, titescfg y textract_concaut (en el vídeo se abren con el buscador); cuenta 626 (es la del PGC); la base TUTORIAL no tiene ficheros N43.
