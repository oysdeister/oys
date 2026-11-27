# Estructura, maestros y creación de {INI}ORD

Índice: 1 Conceptos · 2 Maestros · 3 Bien · 4 Elemento · 5 Componente · 6 Crear {INI}ORD paso a paso · 7 Problemas.
Fuente: `icon-activos.json` bloques `icon-activos-conceptos` y `icon-activos-1`; `hechos-activos.md` §1-4; `_fuente/CODIGOS_ALUMNO.md`.

## 1. Conceptos para juniors
Activo fijo (inmovilizado): bien comprado para usarlo más de un año (portátil, furgoneta; también software = intangible). Su compra va a una cuenta del **grupo 2**, no a gasto. Cada año una parte del coste pasa a gasto (dotación, cuenta 68x) y lo ya amortizado se acumula en otra cuenta que resta del activo (28x). El ERP muestra las cuentas con 5 cifras + auxiliar (216 → 21600.00000). Terrenos: en general no se amortizan. Amortización lineal = (coste − valor residual) / años; decreciente = más cuota al principio. VNC = coste − amortización acumulada. Primer año parcial: por **días** (mostrador 1.480 al 10 % desde 01-05-2018: 148 × 245 / 365 = 99,34). Hacienda limita con tabla de coeficientes (equipos informáticos: máx. 25 % y 8 años).

## 2. Maestros («Finanzas › Activos permanentes › Maestros»)
Subcarpetas: «Grupos» (grupos de inmovilizado), «Cuentas» (grupos contables, seis cuentas), «Bienes inmuebles», «Sistemas amortización» (especiales; si nadie lo indica, no se necesitan), «Ubicaciones» (localizaciones y sublocalizaciones) y «Tablas fiscales» (Registro y Grupos). Los nombres largos salen cortados: pasa el ratón. Orden de configuración: grupos de inmovilizado → grupos contables → grupos y códigos fiscales → tabla oficial → sistemas especiales → localizaciones. Tablas técnicas citadas por la documentación: `cinmgrps2/3` (grupos), `cinmctas2/3` (cuentas), `cinmfgrp2/3` (grupos fiscales), `cinmftab2` (tabla oficial), `cinmlopr2` (localizaciones), `cinmlosu2` (sublocalizaciones).
- Demo de prácticas: grupo CAP1 «Instalaciones CAP» (inmovilizado y contable). Cuentas CAP1: 21600.00000, 28160.00000, 68100.00000, 77100.00000, 67100.00000.
- Demo de vídeos (otra empresa): ES20 Intangibles, ES21 Materiales; grupo contable ES200 Investigación con 20000, 28000, 68000, 77000, 67000, 29900.
- Fiscal: ES0 Terrenos, ES4 Instalaciones (ES14 Maquinaria, ES43 «Resto instalaciones»), ES5 Elementos de transporte, ES6 Mobiliario y enseres, ES7 Equipos electrónicos e informáticos (ES72), ES8 Otros. Cada instalación tiene su propia codificación.

## 3. Bien («Finanzas › Activos permanentes › Bienes»; `cinmhead`)
Campos: Empresa, Bien, Descripción, Grupo inmovilizado, Grupo contable (informativo; **se propone** al crear elementos), Serie inmovilizado (contador de los elementos; no hay maestro de series descrito), Grupo fiscal, Código fiscal, Estado de componentes (estado inicial de los componentes). El bloque «Cuentas» sale relleno y en gris (solo lectura) al guardar. CAPASC: CAP1/CAP1/ES4/ES43/serie AF/Activo. Captura de vídeos: bien ES2130 Maquinaria, ES212, serie ELE, ES4/ES14.

## 4. Elemento («Elementos»; `cinmelem`)
Información contable y de costes: Grupo contable (**el del elemento es el que usa la contabilización**), Proyecto, Sección, Cuenta explotación, Centro, Localización, Sublocalización; Partida y Presupuesto (el presupuesto solo admite códigos dados de alta en el maestro de inversiones: déjalo vacío). Pestaña «Valores de los elementos» (`cinmeval`): Sistema, % Amortización, % Años (valor por defecto de componentes) y Amortización inicial (suma automática de las de sus componentes; sirve para activos ya parcialmente amortizados). CAPASC elemento 0000001: grupo CAP1, proyecto 0 GENERAL, sección 0 General, resto vacío; si no sale en la lista, ábrelo desde el componente con el enlace «Elemento».

## 5. Componente («Componentes»; `cinmcomp`)
Arriba: fecha de alta, fecha de inicio de amortización, «Identificación factura» (proveedor, número de factura, fecha, valor en factura, Id. fiscal, documento). Pestañas «Valores de los componentes» (sistema, sistema de amortización L/D, %, años, valor de inventario, residual, amortización acumulada, valor neto, estado) y «Cuadro amortización». Al pie: «Baja», «Baja parcial», «Venta», «Desactivar», «Fuera de servicio», «Recalcular amortizaciones», y también «Contabilizar», «Activar», «Retroceder venta», «Retroceder baja». Si en el elemento solo ves totales, baja al componente. Tipo «Inversión» = la compra que da de alta el activo.

## 6. Crear {INI}ORD (empresa 0, ordenador 1.200,00, uso desde 01-01-2026)
1. «Bienes» › «Nuevo»: Empresa 0, Bien `{INI}ORD`, Descripción «Ordenador {INI}», Grupo inmovilizado CAP1, Grupo contable CAP1, Grupo fiscal ES7, Código fiscal ES72; deja serie AF y estado Activo; «Guardar» (cuentas se rellenan solas).
2. «Elementos» › «Nuevo»: Empresa 0, Bien {INI}ORD, Descripción «Ordenador portatil {INI}», Elemento = AF (el que propone), proyecto 0, sección 0; «Guardar» (grupos copiados del bien).
3. Elemento {INI}ORD AF › pestaña «Valores de los elementos» › «Nuevo»: el ERP propone A, Lineal, 25,000 %, 4 años (salen de ES72); «Guardar» sin cambiar.
4. Mismo elemento › pestaña «Componentes» › «Nuevo»: Descripción «Portatil {INI}», fecha alta 01-01-2026, fecha inicio 01-01-2026, proveedor TCAPC, número factura {INI}-ORD-001, fecha factura 01-01-2026, valor en factura 1200, Id. fiscal B12345682; «Guardar» (el ERP asigna el número del componente).
5. Componente › «Valores de los componentes» › «Nuevo»: Sistema A, Sistema amortización L, % 25, Años 4, Estado Activo, Valor inventario 1200; «Guardar».
6. Pestaña «Cuadro amortización»: cuatro filas 2026-2029 (1 enero a 31 diciembre), 25,00 % Lineal, importe 300,00 (mín. 150,00, máx. 300,00), estado Pendiente.
No genera asiento. TCAPC solo se cita; no se modifica. Cuadro del vídeo (componente 000019 de 5.168 € al 50 %, 2 años): 1.946,85 + 2.584 + 637,15 = 5.168 (2018-2020).

## 7. Problemas
- «Missing key in referenced table» al guardar valores del componente → crea antes la línea de «Valores de los elementos».
- El elemento no propone grupo contable → el bien no tiene grupo contable.
- Porcentaje no aceptado → fuera de los límites del código fiscal (columnas Mínimo/Máximo del cuadro).
- Un elemento en dos bienes → imposible; usa traspaso.
- Confundir grupo contable y fiscal → contable: cuentas; fiscal: cuánto amortizar.
