# Asientos esperados, trampas y errores típicos (Impuestos)

Fuente: `icon-impuestos.json` (campos «avisos», «problemas», «aprendido»), `examenes/icon-impuestos.json`, `auditoria/redaccion_imp_act_avanzada.md`, commit 3555acb.

## Asientos esperados
| Operación | Debe | Haber | Nota |
|---|---|---|---|
| Compra T{INI} (125,00 + 26,25 = 151,25) | gasto/existencias 125,00 (cuenta del artículo, sin verificar aquí) · **47200.00000** IVA soportado 26,25 | proveedor 151,25 | La cuota 26,25 al debe de 47200.00000 es lo que compara «Justificación vía asientos» |
| Venta a C{INI} (200,00 + 42,00 = 242,00) | cliente 242,00 | ventas 200,00 · **47000.00000** (IVA repercutido de la demo) 42,00 | |
| Liquidación 4T 2026 | 47000.00000 · 42,00 | 47200.00000 · 26,25 y 47500.00000 · 15,75 | A mano; no se graba en la demo compartida |
| ISP (2.000 sin IVA) | IVA soportado 420 | IVA repercutido 420 | Neto 0 |
Discrepancia a recordar: la auditoría de redacción habla de «IVA repercutido 47700, liquidación en 47500» como nombres PGC; en la demo el contenido verificado usa **47000.00000 / 47200.00000 / 47500.00000** (PGC 477 / 472 / 4750). Usa siempre las de la demo en ejercicios.

## Trampas de la demo (compartida)
- Empresa 0, TCAPC, 0FC000012, regla 73/153 y artículo 13500620 son **compartidos**: solo mirar. Cambiar la zona de la dirección de un tercero (ej. 00003 de ESAR a ESCO en el vídeo) altera el IVA de todos; en la plataforma se hace solo en captura. Si un compañero ve otra regla, alguien dejó la zona cambiada: devolverla.
- Borrador 303 y «Comprobación del registro» incluyen a todos los alumnos.
- Las capturas son de ALA (ESAR); la demo de prácticas es empresa 0 (ESCO). No confundir 2586/1477/1479 (vídeos) con 73/153 (prácticas).
- Mnemotécnicos distintos según instalación (ES-IVA-SOP/REP vs ESG-IVA-SV/RV).
- Verifactu: fechas de obligatoriedad aplazadas varias veces (no afirmar fechas).
- La pantalla «Empresas» no lleva captura en el curso; se encuentra con el buscador.

## Errores típicos y respuesta
| Síntoma | Causa / qué hacer |
|---|---|
| Al validar: «no existe regla para la combinación» | Anotar zonas y claves del mensaje y pedir/crear la regla en Reglas de asignación; no tocar la factura |
| IVA distinto del esperado | Revisar los tres datos (zona empresa, zona de la dirección del tercero, clave del artículo): cambiar uno cambia la regla |
| No ves la zona del tercero | Está en Direcciones, por dirección |
| No ves el % en el artículo | El artículo solo tiene clave; el % está en el tipo (ESG) |
| Regla con clave tercero vacía parece incompleta | Vacío = vale cualquier valor |
| Dos reglas encajan | Gana la prioridad más alta |
| «No aparece el botón de nuevo registro» | Pasar a modo lista (solo se habilita ahí) |
| Registro fiscal no se guarda por fecha | La fecha no puede ser anterior a la del documento |
| ISP sin autofactura | Falta operación recibida/emitida o no se lanzó «Autofacturas e ISP» |
| Clave con desglose no se guarda | Falta subclave |
| Regularización de prorrata rara | Falta % definitivo del año o tipos sin «Aplicar prorrata» |
| Envío SII sin registros | E-Reporting distinto de SII-Fact o fuera del rango de fechas |
| Esperabas que el control corrigiera | Los controles localizan; se corrige en documento o maestro |
| Confundir repercutido/soportado | Repercutido = lo cargas tú al vender; soportado = lo soportas tú al comprar |
| Confundir periodo contable/fiscal | El fiscal decide en qué liquidación entra el registro |

## Cálculos de práctica (para tests)
Base 500 al 21 % → 105 (total 605). Base 1.200 al 21 % → 252 (total 1.452). Liquidación 3.150 − 2.100 = 1.050 a ingresar. 2.100 − 1.260 = 840 (cifras de ALA). Recargo de equivalencia: 126,20. IRPF: 1.060. Prorrata 80 %: 168 + 42. 2.332 (factura del vídeo).

## Preguntas de examen frecuentes (14 en `examenes/icon-impuestos.json`)
Orden de precedencia (más bajo primero) vs prioridad de regla (más alta gana); otras claves que afinan (tercero y documento); mnemotécnicos; «Modificado manualmente»; dónde crear la regla que falta; pestaña Rectifica; «Aplicar prorrata»; ISP exige recibida + emitida; SII desde el registro con «Traspasar a SII-Facturas»; agencias tributarias; solape de excepciones; «Destino (OSS)»; importe fiscal de línea = suma de cuatro; prioridad vs precedencia.

## Lecciones de sesiones (síntoma → causa → regla)
- **Reglas de asignación 73 y 153**: comprobadas en TUTORIAL; gana la prioridad más alta (10 se impone a 1), al revés que la precedencia de clases (el más bajo primero). Un test era ambiguo por mezclar ambas.
- **Cuota**: base de cálculo = importe neto (800 × 21 % = 168); no partas la frase con negritas a mitad.
- **Controles de Integridad**: son siete (justificación vía enlaces/asientos, CIF, importes, inconsistencias, duplicados, descuadres, …) y varios salen vacíos en la demo; para la captura se usó «Inconsistencias de impuestos». Vacío es lo normal, no un fallo.
- **IVA en la demo**: repercutido 47000.00000, soportado 47200.00000 (PGC 477 y 472); no afirmes la descripción de la ficha (sin verificar).
- **Sin comprobar en la demo (sin verificar)**: reglas 1477, 1479 y 2586 (son de la demo de los vídeos), Docflow de la factura de gestión y que el borrador del 303 genere asiento.
- **Datos fuera de TUTORIAL**: los ejercicios usaban datos de otra base; se rehicieron con la factura 0FC000012 y el bien CAPASC. Comprueba que todo código existe en TUTORIAL.
