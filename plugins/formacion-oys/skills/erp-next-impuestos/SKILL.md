---
name: erp-next-impuestos
description: "Conocimiento funcional de Impuestos (IVA) en el ERP Deister Axional VNext (demo nextdemo.geasa.eu, base TUTORIAL, empresa 0): cómo decide el ERP el IVA de una línea (zona de empresa + zona de tercero + clave de artículo → regla → operación y tipo), maestros fiscales, regla 73 y 153, pestaña «Impuestos por documento», registro fiscal, prorrata, ISP, modelo 303, SII y controles de integridad. Úsala siempre que haya que explicar, enseñar, probar o resolver dudas de IVA, impuestos, «¿por qué esta factura lleva este IVA?», «no me valida la factura por regla», liquidar el 303 o los bloques icon-impuestos-* de la plataforma."
---

# Impuestos (IVA) en el ERP VNext

Módulo de la plataforma: `icon-impuestos` (6 bloques). Menú principal: «Finanzas › Impuestos». El alumno **solo lee** datos de la demo y calcula a mano su 303; no crea códigos propios ni toca terceros ajenos.

## La idea central

Nadie teclea el IVA en una factura. Al **validar**, el ERP busca una **regla de asignación** con tres entradas obligatorias:

| Entrada | Dónde está | Valor en la demo |
|---|---|---|
| Zona fiscal de la empresa | «Finanzas › Maestros › Parametrización › Empresas», bloque «Datos fiscales», campo «Zona impositiva» | empresa 0 «Deister Software», NIF A58738147, zona **ESCO** |
| Zona fiscal del tercero | «Finanzas › Maestros › Terceros › Registro terceros», pestaña **Direcciones** (por dirección, no en la cabecera) | proveedor de prueba **TCAPC**, dirección 0, ESCO |
| Clave fiscal del artículo | «Gestión › Maestros › Artículos › Registro», bloque «Contabilidad», «Clave fiscal» | artículo 13500620: **BOG** «Bienes a tipo general», naturaleza Bien |

Afinan (opcionales): clave fiscal del tercero (RGEN régimen general, RREQ recargo de equivalencia, RECC criterio de caja…), clave del documento, tipo CIF y prorrata. Un campo de condición **vacío** en la regla vale para cualquier valor.

La regla **devuelve dos cosas**: la *operación impositiva* (CLBC = Compra · Local · Bienes · Corrientes) y el *tipo de impuesto* (ESG «ES, IVA 21 % General»; ESR 10 %). El tipo da el porcentaje.

Reglas de la demo: **73** = ESCO + ESCO + RGEN + BOG → CLBC + ESG (21 %, 100 % deducible; en ventas VLBC + ESG). **153** = igual pero clave BOR → CLBC + ESR (10 %). Cambiar solo la clave de artículo cambia regla y porcentaje: es la prueba que hace el alumno en la demo compartida.

Desempate y huecos: si encajan varias reglas gana la **prioridad más alta** (10 gana a 1; al revés que el orden de precedencia de las *clases*, donde el más bajo va primero). Si no encaja ninguna, **la factura no se puede validar**: hay que crear la regla en «Finanzas › Impuestos › Maestros › Reglas de asignación» (nunca corregir el IVA en la factura).

## Mapa de bloques (orden de etapas.ts)

**Configurar — «Cómo decide el ERP el impuesto»**
1. `icon-impuestos-conceptos` Entender el IVA (repercutido, soportado, base, cuota, liquidación; cálculo a mano).
2. `icon-impuestos-1` Conocer los maestros fiscales (zonas, clases, tipos, operaciones, claves).
3. `icon-impuestos-v-1` Comprobar datos fiscales de empresa, tercero y artículo.
4. `icon-impuestos-v-2` Leer la regla de una factura (0FC000012, regla 73).
5. `icon-impuestos-v-3` Probar las reglas (cambiar zona/clave → cambia la regla; capturas de ALA).

**Operar — «Declarar»**
6. `icon-impuestos-2` Revisar el registro fiscal (cabecera/líneas, deducible/no deducible, ISP).
7. `icon-impuestos-4` Controlar los impuestos antes de declarar (siete controles de Integridad).
8. `icon-impuestos-3` Liquidar y presentar (303 del caso, asiento de liquidación; 390, 349, prorrata, SII).

## Datos del caso continuo (cifras fijas)

- Compra a T{INI}: 10 × 12,50 = **125,00**, IVA soportado 21 % = **26,25**, total **151,25** (factura PROV-{INI}-001).
- Venta a C{INI}: 10 × 20,00 = **200,00**, IVA repercutido **42,00**, total 242,00.
- 303 del 4T 2026: 42,00 − 26,25 = **15,75 a ingresar**. Plazo: hasta el 30 de enero; el 30-01-2027 es sábado, pasa al **lunes 1-02-2027**.
- Datos de la demo que el alumno solo mira: factura de compra **0FC000012** (tipología CAPA «Factura activos CAP», empresa 0, proveedor TCAPC, factura proveedor FRA-ACT-001, base 10.000,00, cuota deducible 2.100,00, total 12.100,00, regla 73; validada y contabilizada; es la misma que crea el componente 000002 de Activos). Proveedor TCAPC «Tercero CAP compras», NIF B12345682, RGEN.
- Las capturas son de la demo de los vídeos (empresa ALA, Álava, zona ESAR; proveedor 00003; artículo 002 Material deportivo; factura FCALA23-000015 base 800,00, cuota 168,00, total 968,00, regla 2586 ESAR+ESAR+BOG). Mecanismo idéntico; **no mezcles códigos de ALA con los de la empresa 0**.

## Asiento de liquidación (el alumno lo escribe en papel)

| Cuenta de la demo | Debe | Haber | PGC |
|---|---|---|---|
| 47000.00000 (IVA repercutido en la demo) | 42,00 | | 477 |
| 47200.00000 (IVA soportado) | | 26,25 | 472 |
| 47500.00000 «Hacienda Pública, acreedora por IVA» | | 15,75 | 4750 |

El debe (42,00) iguala el haber (26,25 + 15,75). La demo rotula 47000.00000 «Hacienda Pública, deudora por IVA» pero la usa para el repercutido: es una rareza del plan PGE 2008 de la demo, no un error del alumno. En el curso **no se presenta el 303 ni se graba el asiento** en la demo compartida (como asiento manual iría en el diario {INI}).

Detalle de asientos de compra/venta y otras trampas: `references/asientos_y_trampas.md`.

## Reglas de trabajo

- **Solo lectura en la demo compartida**: no cambiar la zona de ningún tercero que no sea tuyo (cambiaría el IVA de las facturas de todos los alumnos), no cambiar la clave del artículo 13500620, no pulsar «Descontabilizar»/«Anular» en 0FC000012, no ejecutar los procesos de «Finanzas › Impuestos › Procesos» ni presentar el 303.
- El borrador del 303 y «Comprobación del registro» suman la empresa 0 **entera** (compartida): no salen solo tus 42,00 y 26,25. Filtra por tercero (T{INI} o TCAPC) y calcula tus cifras a mano.
- Rutas: el menú de la demo de prácticas cuelga de «Gestión › Compras…» y «Finanzas › Impuestos…»; si no encuentras una pantalla, escríbela en el buscador del menú («Empresas», «Terceros», «303»).
- Explica con el porqué, para juniors sin formación financiera: define repercutido/soportado, base/cuota, tercero, zona, clave, asiento antes de usarlos.

## Cuándo leer cada referencia

- `references/maestros_fiscales.md` — al explicar o localizar zonas, clases, tipos, operaciones, claves, reglas, impuestos por tercero, grupos fiscales, periodos, agencias, claves de declaración, prorrata; con tablas técnicas `ctax_*`.
- `references/registro_declaracion_controles.md` — registro fiscal, ISP, prorrata, modelos 303/390/349, SII/VERIFACTU/TicketBAI, procesos y los siete controles de integridad con sus literales.
- `references/asientos_y_trampas.md` — asientos esperados, cifras de práctica, errores típicos y qué aprende el alumno; bloques de la plataforma por tema.

## Fuentes

`app/src/content/icon-impuestos.json` (8 bloques), `app/src/content/examenes/icon-impuestos.json` (14 preguntas), `auditoria/redaccion_imp_act_avanzada.md`, `_fuente/CODIGOS_ALUMNO.md` (sección «Impuestos y Activos»), commit 3555acb (datos de TUTORIAL), y `erp-nuevo-icon-documentacion/references/hechos-impuestos.md` (tablas `ctax_*`, resumen de la documentación oficial).
