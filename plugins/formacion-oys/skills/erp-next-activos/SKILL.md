---
name: erp-next-activos
description: "Conocimiento funcional de Activos permanentes (inmovilizado) en el ERP Deister Axional VNext (demo nextdemo.geasa.eu, base TUTORIAL, empresa 0): bien, elemento y componente, grupos contables y fiscales, el ordenador {INI}ORD de 1.200,00 con cuadro de 4 cuotas de 300,00, albarán y factura que crean el activo (tipología CAPA, «Generación inmovilizado»), familia del artículo, contabilizar factura de activos, amortizar y baja o venta. Úsala siempre que haya que explicar, enseñar, montar o diagnosticar activos fijos, amortización, «la factura no crea el activo» o los bloques icon-activos-* de la plataforma."
---

# Activos fijos en el ERP VNext

Módulo de la plataforma: `icon-activos` (8 bloques). Menú: «Finanzas › Activos permanentes» (Maestros, Bienes, Elementos, Componentes, Procesos, Informes). Es el único módulo de este par donde el alumno **crea** datos: su ordenador `{INI}ORD`.

## Estructura de tres niveles (la idea que hay que dejar clara)

| Nivel | Qué es | Dónde se decide |
|---|---|---|
| **Bien** | Categoría genérica («Ordenador {INI}», «Maquinaria»). Solo clasifica, **no genera asiento** | grupo de inmovilizado, grupo contable (propuesto), serie, grupo y código fiscal, estado de componentes |
| **Elemento** | El activo concreto. Pertenece a **un solo bien** (para cambiar de categoría: traspaso). Lleva contabilidad y costes | grupo contable (el que **usa la contabilización**), proyecto, sección, cuenta de explotación, centro, localización; «Valores de los elementos» |
| **Componente** | Unidad mínima: cada compra o pieza. Aquí vive la amortización, el proveedor y la factura de origen | fechas de alta e inicio, «Identificación factura», «Valores de los componentes», «Cuadro amortización», botones de baja y venta |

Cuentas: las define el **grupo contable** (seis: inmovilizado, amortización acumulada, dotación, beneficios por venta, pérdidas por venta, puente de traspasos) y se heredan; no se escriben a mano. Límites de amortización: los fija el **grupo fiscal + código fiscal** (tabla oficial de Hacienda); el ERP no deja salirse. Contable dice a qué cuentas; fiscal dice cuánto se puede amortizar.

## Datos de la demo y del caso

- **Activo de prueba en TUTORIAL (solo mirar)**: bien `CAPASC` «Ascensor CAP», elemento `0000001`, componente `000002`, creado por la factura de prueba `0FC000012` (proveedor TCAPC, tipología CAPA «Factura activos CAP», 12.100,00 con IVA). Componente 000002: sistema A, Lineal, 10 %, 10 años, valor de inventario 6.000,00, alta e inicio 17-11-2026, primera cuota 17-11 a 31-12-2026 = 73,97 (6.000 × 10 % × 45 / 365).
- **Grupos de la demo**: único grupo de inmovilizado y único grupo contable **CAP1** (cuentas 21600.00000 inmovilizado, 28160.00000 amortización acumulada, 68100.00000 dotación, 77100.00000 beneficios, 67100.00000 pérdidas; puente vacía). Grupos fiscales ES0 Terrenos … ES8 Otros (nueve): ES5 transporte, ES6 mobiliario, **ES7 equipos electrónicos e informáticos** con código **ES72** «Equipos para procesos de informacion»: el ERP propone sistema A, Lineal, 25 % y 4 años (la tabla oficial de equipos informáticos admite como máximo 25 % y 8 años).
- **Tu ordenador** (bloque `icon-activos-1`): bien `{INI}ORD` «Ordenador {INI}» (empresa 0; grupo inmovilizado CAP1, grupo contable CAP1, grupo fiscal ES7, código fiscal ES72, serie AF, estado Activo) → elemento `AF` «Ordenador portatil {INI}» (código que propone el ERP; proyecto 0, sección 0; línea en «Valores de los elementos»: A, Lineal, 25 %, 4 años) → componente «Portatil {INI}» (alta e inicio 01-01-2026; proveedor TCAPC, factura `{INI}-ORD-001` (texto, no crea factura), valor en factura 1200, Id. fiscal B12345682; valores A + L + 25 + 4 + Activo + valor inventario 1200). El número del componente lo pone el ERP (en la prueba ZZ: 000003). **Cuadro: 2026-2029, 300,00 cada año, estado Pendiente** (mín. 150,00, máx. 300,00); 25,00 al mes; valor neto tras el año 1 = 900,00.
- **Orden obligatorio**: bien → elemento → **valores del elemento** → componente → valores del componente. Si falta la línea de valores del elemento, al guardar los valores del componente sale «Missing key in referenced table».
- Limitación de la demo: solo existe CAP1 (cuentas de instalaciones); un ordenador real iría a 217 y 2817. Mismo cálculo.
- El caso continuo del curso **no compra inmovilizado**: el resultado del caso (61,50) no cambia. El ordenador es ejemplo aparte.

## Mapa de bloques (orden de etapas.ts)

**Configurar — «El activo y sus maestros»**: `icon-activos-conceptos` (qué es, amortización lineal, VNC, baja/venta, cálculos a mano) · `icon-activos-1` (maestros y creación de `{INI}ORD`) · `icon-activos-v-4` (familia del artículo).
**Operar — «Del albarán al activo»**: `icon-activos-v-1` (albarán: pestaña «Contabilización», «Generar inmovilizado») · `icon-activos-v-2` (factura: «Generación inmovilizado») · `icon-activos-v-3` (contabilizar factura de activos, Docflow, componente 000002).
**Operar — «Amortizar y dar de baja»**: `icon-activos-2` (valores, cuadro, procesos) · `icon-activos-3` (baja, venta, informes).

## Cuándo se crea el activo (las dos condiciones)

La ficha nace de una **factura de compra** (lo habitual; el albarán suele estar en «No generar») si se cumplen a la vez:
1. La **tipología de factura** («Gestión › Compras › Maestros › Documentos › Tipos de facturas», pestaña «Contabilización») tiene «Generación inmovilizado» = «En validación» o «En contabilización». En la demo: **CAPA = «En contabilización»**; la estándar **FC «FACTURA COMPRA» = «No generar»** (por eso la factura PROV-{INI}-001 de 151,25 no crea nada: es mercancía).
2. La **familia del artículo** («Maestros › Artículos › Auxiliares › Familias», bloque «Parámetros inmovilizado») tiene **Bien y Serie de inmovilizado**. La familia 01.01.001352 del artículo 13500620 los tiene vacíos y el artículo es de tipo contable PROD: aunque se comprara con CAPA no crearía activo.
Si falla una, la factura contabiliza igual pero no se crea componente ni elemento. Diagnóstico: revisar siempre en este orden, tipología y familia. Fecha de inicio: el ERP propone el **primer día del mes siguiente** a la contabilización (ejemplo del vídeo: 07-06-2023 → 01-07-2023; en 0FC000012 coincide con la fecha de factura, 17-11-2026): revisarla; se cambia con «Fecha inicio depreciación».

## Asientos esperados (resumen; detalle en `references/asientos_y_trampas.md`)

- Compra del activo (contabilizar la factura): debe inmovilizado (cuenta del grupo contable, p. ej. 1.200,00) + IVA soportado 252,00; haber proveedor 1.452,00 (cifras de ejemplo; en la demo 0FC000012: 10.000,00 + 2.100,00 = 12.100,00).
- Amortización anual: **debe dotación 68x** (681; en CAP1 68100.00000) **/ haber amortización acumulada 28x** (2817; en CAP1 28160.00000), 300,00 para el ordenador.
- Baja o venta: primero la amortización pendiente hasta la fecha; luego se cancelan coste y amortización acumulada; el VNC sin amortizar es pérdida (671 material / 670 intangible); venta: precio − VNC → beneficio 771/770 o pérdida 671/670. Ordenador de 1.200,00 vendido a 1 año por 1.000,00: VNC 900,00, beneficio 100,00 (771); por 800,00, pérdida 100,00 (671).

## Reglas de trabajo

- Demo compartida: **no pulses «Contabilizar» ni «Descontabilizar»** en 0FC000012, no ejecutes «Contabilización amort.» (contabilizaría las cuotas de todos), ni «Baja», «Venta», «Traspaso», «División» ni «Cambio de amortización»: abre la ventana y sal con «Cancelar». «Contabilizar» queda como captura con su limitación.
- No cambies CAPASC, la familia, ni las tipologías CAPA/FC: las comparten todos.
- Crear bien/elemento/componente **no genera asiento**; las cuotas siguen en Pendiente hasta que alguien lanza el proceso de contabilización de amortizaciones.
- Define antes de usar: activo fijo, amortización, valor neto contable, asiento, debe/haber, tipología, Docflow, serie. Los alumnos son juniors sin base financiera.
- Códigos del alumno: `{INI}` = 2 letras; `{INI}ORD` tiene 5 caracteres (cabe: longitud comprobada en la prueba con ZZ).

## Cuándo leer cada referencia

- `references/estructura_y_creacion.md` — maestros, bien/elemento/componente, paso a paso de `{INI}ORD`, campos y errores.
- `references/circuito_compra_activo.md` — albarán, factura, familia, contabilizar, Docflow y componentes creados.
- `references/amortizar_baja_informes.md` — valores, cuadro, procesos (contabilizar, traspaso, cambio de amortización, división), baja, venta, informes, tablas técnicas.
- `references/asientos_y_trampas.md` — asientos, cálculos a mano, trampas y examen.

## Fuentes

`app/src/content/icon-activos.json` (8 bloques), `app/src/content/examenes/icon-activos.json` (16 preguntas), `auditoria/redaccion_imp_act_avanzada.md`, `_fuente/CODIGOS_ALUMNO.md` (sección «Impuestos y Activos»), commit 3555acb (datos de TUTORIAL y bien {INI}ORD), `erp-nuevo-icon-documentacion/references/hechos-activos.md` y `hechos-activos-b.md` (documentación oficial resumida).
