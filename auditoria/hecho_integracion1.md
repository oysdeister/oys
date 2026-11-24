# Hecho: integración 1 (fundamentos y compras)

Sin commit. JSON, build y lint correctos (solo avisos previos; sin errores fuera de src/erp).

## Fundamentos
- `fundamentos.json`: ejercicios `fundamentos-navegar` (1), `fundamentos-1` (2), `fundamentos-2` (3).
- `etapas.ts`: «Moverse por el ERP» (fundamentos-navegar) primero y «Antes de abrir el ERP» (fundamentos-1, -2) después. Criterio de principiante: lo primero que necesita es saber entrar, abrir pantallas y guardar (20 min, práctico), y el vídeo de introducción (qué es un ERP y cómo moverte) encaja ahí; los conceptos contables después, con el ERP ya reconocible.
- «Próximamente» desaparece (el módulo ya tiene 3 bloques).
- Imágenes: `imgSrc` ya resuelve `img/fundamentos/` (el bloque pertenece al módulo fundamentos); no hizo falta tocar el resolvedor. Comprobado en navegador.
- Vídeo: `video-tutoriales-fin.ts` enlaza tut-intro cap. 1 a `fundamentos-navegar-entrar`; se deja también en `maestros-moverte-axional` y la serie lista `fundamentos` y `maestros`.
- Extra: el glosario marcaba «base de datos» / «base de pruebas» como «Base imponible» (alias «Base»). `glosario.ts`: el patrón ya no marca «base» delante de «de datos» o «de pruebas».

## Compras
Orden final: Configurar · Maestros de compra (maestros-2, compras-1, compras-precios); Documentos (compras-tipos, compras-workflow). Operar · Comprar (compras-3, compras-2, compras-albaran-contabilizar, compras-factura, compras-generar-factura); Devolver y controlar el stock (compras-abono-devolucion, maestros-3).
- `numero` reasignado 1–12 según ese orden (el visible sale de etapas.ts: 6–12 en Operar).
- compras-generar-factura: «bloque anterior» sustituido por el título del bloque; el concepto explica que es otra forma de llegar a lo mismo que «Registrar y contabilizar la factura» (usar una u otra por albarán).
- Los textos con registros de la demo (0AC000017, asiento 78, 0FC000021, 0RECT000001) ya los presentan como orientativos y los pasos usan T{INI}, AO{INI}, FRA-{INI}-003, ABO-{INI}-001. No había «bloque N».
- compras-abono-devolucion sigue parcial (la demo no tiene tipología de devolución).

## Comprobado en el navegador (5191)
#/modulo/fundamentos, #/ejercicio/fundamentos-navegar (capturas visibles, tarjeta de vídeo), #/modulo/compras?fase=operar (12 bloques, 5 Configurar / 7 Operar), #/ejercicio/compras-albaran-contabilizar (captura visible).

## Pendiente
- El resumen/circuito de compras.json no menciona workflow, albarán contabilizado ni abono.
- Sin examen de fundamentos.
