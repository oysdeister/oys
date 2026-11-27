# Hecho: vídeo y capturas (H32, H33, H39)

## Hallazgo previo
El vídeo v2 (`nueva/v2`) ya está publicado: es el de la release `video-v1` (capítulos 2-10 de Compras; el 1 se rehízo después). Los 87 min coinciden con INDICE.md. No hay material v2 sin publicar, así que no se ha subido ningún clip nuevo a la release. v2 solo cubre Compras en la base TUTORIAL.

## H32 (vídeo grabado en otra base)
Hecho (en `app/src/content/videoSeries.ts`, sin tocar JSON):
- `icon-contabilidad-v-1-contabilizar` y el bloque `icon-contabilidad-v-1`: el tramo «Contabilizar la factura» de `fin-icon1` (factura ML0260020, otra base) se sustituye por el del cap. 8 de Compras (4:35-5:27, base TUTORIAL). Se mantiene «Se generan tres cosas» (fin-icon1).
No hecho:
- `icon-contabilidad-v-1-asiento`, `-factura-origen`, `-cartera-fiscales`, `-cartera`: el texto de los pasos cita cifras del vídeo antiguo (1.058,75; ML0260020). Cambiar el vídeo sin rehacer capturas y texto descuadra cifras. Cartera y registros fiscales no están en v2.
- `icon-contabilidad-v-2` (FC/FB directas en Finanzas): v2 no tiene ese circuito. El «57900» es una opción distractora del test (`icon-contabilidad.json` ~L5303), no un dato de otra base: no hay nada que corregir.
- carteras (remesas, PRVCC0, PEN), icon-activos-v-1 (AACF), tesoreria-6 (cajas), icon-contabilidad-2 (histórico 1999): sin material equivalente en TUTORIAL.
Avisos de texto: sigue siendo cierto el de `icon-contabilidad.json` ejercicio `icon-contabilidad-v-1`, sección `-asiento` (captura y cifras de otra base); no sobra ningún aviso por el cambio.

## H33 (bloques sin vídeo)
No se ha añadido ninguno: no hay tramo que encaje de verdad.
- Ventas (ventas-1, ventas-2): v2 es de compras; el circuito de venta no está grabado.
- maestros-3 (stock): v2 no enseña movimientos ni kardex.
- asientos-4/5/7-13, parametrizacion-2/4 (asiento manual, consultas de apuntes/extracto/sumas y saldos): v2 solo lee asientos generados; pantallas distintas.
- icon-impuestos-conceptos/-3/-4, icon-activos-conceptos/-3, icon-cartera-2/-3, tesoreria-7/-8: sin material.
Haría falta grabar: venta (albarán y factura de venta), stock/kardex, asiento manual, sumas y saldos.

## H39 (recapturas): NO HECHO
Chrome 9333 tenía sesión (abrí `ctercero` y cerré mi pestaña). No sobrescribí ninguna imagen:
- La demo actual se ve distinta de las capturas viejas (cabecera roja, tema oscuro, árbol de menú abierto, frente a cabecera verde, claro, sin árbol). Sobrescribir 11 imágenes con otro aspecto rompería la coherencia y los hotspots; cambiar el tema es un ajuste de cuenta que no me corresponde.
- Los listados de terceros mezclan códigos de todos (TCL, TVL, VLP, CAPMB, CAPNC, TCAPC…). Filtrar por «CAP» deja otros códigos CAP; hay que decidir con Sergi qué prefijo y dejar un juego propio, y las capturas de formulario (carteras-d-240, 255, 258, 259, maestros-n-17/18, tesoreria-n-01/14) dependen de registros TCA/BCA/BBVA_CA ya existentes.
Pendiente: lista y decisión de tema/encuadre; luego recapturar con `capturas_erp2.mjs` (TAB propio) y recalcular hotspots.
