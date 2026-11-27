# Maestros fiscales (Finanzas › Impuestos › Maestros)

Índice: 1 Zonas · 2 Clases y tipos · 3 Operaciones · 4 Claves fiscales · 5 Reglas · 6 Excepciones y otros maestros · 7 Tablas técnicas `ctax_*`.
Fuente general: `icon-impuestos.json`, bloques `icon-impuestos-1`, `-v-1`, `-v-2`, `-v-3`; tablas de `hechos-impuestos.md` (resumen de la documentación oficial, páginas 935-1081).

## Orden de configuración (de dentro a fuera)
Zonas → clases → claves (artículo, tercero, documento) → claves de operaciones → operaciones → tipos → reglas → excepciones (clave por zona y artículo, impuestos por tercero, prorrata, grupos fiscales) → agencias y periodos → mapeos de e-reporting. La regla solo combina piezas que ya existen: si una pieza está mal, todas las facturas que la usan calculan mal.

## 1. Zonas fiscales («Zonas fiscales»)
Una zona es un **territorio fiscal, no un país**. Demo: ESCO España continental, ESAR España Araba (Álava), EUR Unión Europea, INT resto del mundo. Campos: Código, Descripción, País (ESP), **TAI** (dentro del territorio de aplicación del IVA español: península, Baleares, País Vasco y Navarra; fuera: Canarias, Ceuta, Melilla → IGIC/IPSI), Intrastat (estadística de comercio de bienes UE). ESAR y ESCO aplican los mismos tipos: al pasar un proveedor de ESAR a ESCO cambia la regla, no el porcentaje. (`icon-impuestos-1`)

## 2. Clases y tipos de impuesto
- «Clases de impuestos»: familia (IVA, IRPF, IGIC, IPSI). IVA = tipo Normal, **orden de precedencia 1** (el más bajo se calcula primero), envío «SII Facturas». Tipos de clase: N Normal, R Retención, D Detracción, E Equivalencia, S Especiales, M Medioambientales, X Otros.
- «Tipos de impuestos»: porcentaje dentro de la clase. **ESG** «ES, IVA 21 % General», **ESR** «ES, IVA 10 % reducido». Base de cálculo «Importe neto», % (21,000), «Aplicar deducción», «Aplicar prorrata». No lleva cuentas sino **mnemotécnicos** (alias que el plan contable traduce a cuenta): ES-IVA-SOP (soportado) / ES-IVA-REP (repercutido) en la demo de prácticas; ESG-IVA-SV / ESG-IVA-RV en la demo de los vídeos (S soportado, R repercutido, V validado; SN/RN no validados). Las pestañas inferiores «Reglas en adquisiciones» y «Reglas en entregas» listan las reglas que devuelven el tipo.
- Retención IRPF: se resta. 1.000 + 210 (21 %) − 150 (15 %) = 1.060 a pagar; los 150 los ingresa quien paga la factura. (`icon-impuestos-1`, test)
- IVA en España: general 21 %, reducido 10 %, superreducido 4 %; hay exentas.

## 3. Operaciones impositivas
Se leen por partes: CLBC Compra·Local·Bienes·Corrientes, CLSC (servicios), VLBC Venta·Local·Bienes·Corrientes. Campos: Código, Descripción, Clasificación, **Sujeta** (No / Sí / Destino (OSS) = venta a particulares UE que tributa en destino y se declara por ventanilla única), **ISP**, operación ISP recibida y emitida, Libro fiscal (R «L.R. de Facturas Recibidas»), Naturaleza (Bien, Servicio, Inversión, Alquiler, Suplido…). **No sujeta ≠ exenta**: la exenta está dentro del IVA pero la ley la libera. Ejemplo de ISP en la demo: CCMESC (Ceuta-Melilla, IPSI) con AXRSC recibida y AXESC emitida. Si se marca ISP hay que informar **las dos** operaciones o no se acepta. (`icon-impuestos-1`, `-2`)

## 4. Claves fiscales
- **Por artículo** («Claves impositivas por artículo»): naturaleza fiscal y tipo. BOG Bienes tipo general, BOR Bienes tipo reducido, SOG Servicios tipo general (el artículo financiero FOR{INI} de Contabilidad), SOR Servicios reducido, BOGISP «Local ISP», BOGNQ «sin recargo». Muchos artículos comparten clave. El artículo solo lleva la clave; **el porcentaje está en el tipo que devuelve la regla**.
- **Por tercero** («Clave fiscal por terceros»): régimen. RGEN general, RREQ recargo de equivalencia (5,2 % sobre bienes al 21 %; 1,4 % al 10 %; 0,5 % al 4 %: 100 + 21 + 5,20 = 126,20), REBU bienes usados, REAGYP agricultura, RECC criterio de caja.
- **Por documento**: régimen especial que lleva el documento (la mayoría no).
- **Por zona y artículo**: excepción con fechas de vigencia; **no solapar** vigencias del mismo artículo y zona (el ERP no sabría cuál elegir; no hay restricción técnica que lo impida). Si la lista sale vacía es normal.

## 5. Reglas de asignación («Reglas de asignación», ventana «Reglas de aplicación de impuestos»)
Tres bloques: Identificación (clase, país, fecha de inicio, prioridad, estado Abierto/Cerrado) · Condiciones de aplicación (zona empresa, zona tercero, clave tercero, clave artículo, clave documento, tipo CIF, prorrata) · Impuesto de compras / de ventas (operación, tipo, clave para declaraciones, % deducible/aplicable). **El bloque de compras y el de ventas se informan completos o vacíos.**
Reglas verificadas en la demo de prácticas: 73 (BOG, 21 %, inicio 01-01-2017, prioridad 101) y 153 (BOR, 10 %). En la demo de los vídeos: 2586 ESAR+ESAR+BOG (prioridad 1, clave tercero y documento vacías), 1477 ESAR+ESCO+BOG, 1479 ESAR+ESCO+SOR → CLSC + ESR. Consulta: en «Reglas de asignación» escribe 73 en «Id. regla» y «Ejecutar consulta»; o filtra «Zona empresa» = ESCO para ver las que aplican a la empresa 0. (`icon-impuestos-v-2`, `-v-3`)

## 6. Otros maestros
- **Impuestos por tercero**: sustituye impuesto u operación de un tercero durante unas fechas (ej. cliente OUTDOOR SPORTS SA, 00232, del 21 % al 0 % exento en 2021; solo en capturas).
- **Grupos fiscales** (grupo IVA): emisor, receptor (distinto del emisor), % de base fiscal (40 % en la captura; códigos 90002/90003 son de la captura).
- **Periodos fiscales**: 01-12 mensuales, 1T-4T trimestrales, 0A anual. Periodo contable ≠ periodo fiscal: el fiscal decide en qué liquidación entra el registro.
- **Agencias tributarias**: parámetros de envío (SII, TicketBAI, VERIFACTU).
- **Claves de operaciones** («Claves tributarias para declaraciones fiscales»): clave, subclave, modelo (ES190…), tipo (Decl. periódica / e-Reporting), marca Estándar. Una clave con desglose exige subclave (190G01 = G + 01).
- **Prorrata por empresa y actividad**: provisional, definitivo, cuenta de prorrata; si se informa CNAE hay que informar proyecto o sección. La empresa 0 no aplica prorrata (campo «Prorrata» = No).

## 7. Tablas técnicas (resumen de la documentación; no inventar otras)
`ctax_zone` (zone_taiter por defecto 1; zone_intrast), `ctax_class`, `ctax_type` (type_porcen −100..100; type_bascal 0 neto,1,2,3,5,6; type_porded, type_porpro), `ctax_operation` (oper_isp, oper_in_oper, oper_out_oper; triangular solo 0/1; destino ≠ la propia), `ctax_artkey`, `ctax_terkey`, `ctax_dockey`, `ctax_clasif`, `ctax_artkey_zone` (vigfin ≥ vigini), `ctax_rule` (rule_priori, rule_status A/C, rule_zonemp, rule_zonter, rule_keyter, rule_keyart, rule_in_oper/taxcode, rule_out_oper/taxcode, rule_prorrata), `ctax_tershift` (impuestos por tercero), `ctax_grpfis` (teremi ≠ terrec; porbas 0-100), `ctax_prorrata` (porcen 0-100, fecfin ≥ fecini), `ctax_period`, `ctax_agencia`, `ctax_agencia_periodo` (A/C; «L» Liquidado no permitido), `ctax_agencia_empresa`, `ctax_operkey` (orden > 0), `ctax_cif_map`, `ctax_erep_map`, `cimpcont_2_ctax`. Registro: `ctax_move_head` y `ctax_move_line` (ver `registro_declaracion_controles.md`). Secuencia del motor según la documentación: empresa y zona → tercero y zona → clave de artículo → clase → clave de tercero, CIF y excepciones → prorrata → reglas compatibles → vigencia y prioridad → operación y tipo → deducibilidad, validación y envío.
