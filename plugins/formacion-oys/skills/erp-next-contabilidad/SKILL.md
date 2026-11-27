---
name: erp-next-contabilidad
description: "Contabilidad de Finanzas en el ERP Deister Axional Next (demo nextdemo.geasa.eu, base TUTORIAL), configurar y operar: plan contable y cuentas (ccuentas), mnemotécnicos ({INI}626), datos básicos (tercero, plazo, tipo de efecto, subcuenta 430, caja), orden de carga de Finanzas, grupos auxiliares, proyectos y secciones, Finanzas sola o integrada, diarios, numerador de justificantes, periodos, plantillas y tipo de asiento, asientos manuales (cuadre, Finalizar, duplicar, copias, corregir, saldos iniciales), consultas (apuntes, mayor, sumas y saldos), facturas directas FC/FB, rectificativas y sustitutivas, factura que no contabiliza y asientos al revés. Úsala siempre que documentes, enseñes, grabes o corrijas contabilidad en el ERP nuevo, o preguntes «¿por qué no contabiliza?», «¿cómo creo un asiento?» o «¿qué cuenta lleva esto?». El cierre del ejercicio está en erp-next-cierre."
---

# Contabilidad en el ERP Next (Finanzas)

Skill funcional para el curso «Practicando Axional Deister VNext». Todo lo de aquí está comprobado en la demo (`nextdemo.geasa.eu`, base TUTORIAL) o sale de la documentación oficial; lo no comprobado va marcado «(sin verificar)». El login lo hace siempre el usuario.

## Cuándo la cargas y con qué otras skills
- Cierre, apertura, balances y caso final: `erp-next-cierre`.
- Terceros, empresa, banco y ejercicio de la empresa propia: `erp-next-maestros`.
- Efectos, remesas, cobros y pagos: `erp-next-cartera`; extracto, conciliación, bancos: `erp-next-tesoreria`; IVA y reglas TAX: `erp-next-impuestos`; inmovilizado: `erp-next-activos`; facturas de gestión: `erp-next-compras` y `erp-next-ventas`.
- Qué dice la documentación oficial (tablas, orden de carga, estados): `erp-nuevo-icon-documentacion` (no se modifica; enlázala, no la copies: el repo es público).
- Moverte por el ERP, capturas y vídeo: `navegar-erp-next`, `capturas-y-puntos`, `video-tutorial-erp`.

## Mapa rápido de pantallas (buscador: Cmd/Ctrl + K y el nombre técnico)
| Qué | Ruta | Técnico |
|---|---|---|
| Planes contables | Finanzas › Maestros › Cuentas contables › Planes contables | – |
| Cuentas | Finanzas › Maestros › Cuentas contables › Cuentas contables | `ccuentas` |
| Mnemotécnicos | … › Cuentas contables › Mnemotécnicas de cuentas | – |
| Cambio de código de cuenta | … › Cuentas contables › Cambio código de cuenta | – |
| Grupos auxiliares | … › Cuentas contables › Grupos auxiliares | `cctaauxh` |
| Proyectos / Secciones | Finanzas › Maestros › Auxiliares › Proyectos / Secciones | `cproyect` / `cseccion` |
| Diarios | Finanzas › Maestros › Auxiliares › Diarios | `cdiarios` |
| Numerador de justificantes | desde el campo Justificante del asiento («+») | `cjusnumh` |
| Ejercicios y periodos | Finanzas › Maestros › Cierres › Ejercicios contables | `cejercic`, `cperiodo` |
| Terceros / Perfil contable | Finanzas › Maestros › Terceros › Registro terceros / Perfil contable | `ctercero` |
| Asientos | Finanzas › Contabilidad General › Diario contable › Asientos › Asientos | `casientos` |
| Contabilización masiva | … › Asientos › Procesos › Contabilización | `casientos_contab` |
| Líneas de asiento (apuntes) | buscador | `capuntes` |
| Mayor (extracto de cuenta) | Finanzas › Contabilidad General › Extractos › Mayor de cuentas | `capuntes_ext_cuenta_rep` |
| Sumas y saldos | Finanzas › Contabilidad General › Saldos › Saldos cuentas | `csaldos` |
| Integridad (descuadres) | Finanzas › Contabilidad General › Diario contable › Integridad | – |
| Plantillas de contabilización | Finanzas › Contabilidad General › Contabilizadores (Sistema Excel / Clásico) | `ccon_template_xls` |
| Facturas directas | Finanzas › Facturación › Compras › Fact. de compras / Ventas | – |

## Flujo recomendado (el orden de etapas de la plataforma)
**Configurar**: (1) plan contable y mnemotécnicos → (2) tu cuenta de gasto → (3) datos básicos (cliente, plazo, tipo de efecto, subcuenta 430, caja) → (4) diario y periodos → (5) [opcional] auxiliares, proyecto, sección, orden de carga completo, saldos iniciales.
**Operar**: (6) escribir un asiento → (7) contabilizar, duplicar, copias periódicas, corregir → (8) consultar apuntes, mayor, sumas y saldos y descuadres → (9) facturas que contabilizan.
Qué bloque enseña cada paso: `references/bloques-y-fuentes.md`.

## Reglas que sostienen todo (con su porqué)
1. **Un asiento siempre cuadra**: Debe = Haber. El ERP esconde «Finalizar» mientras el Cuadre no sea 0, para impedir contabilizar descuadres.
2. **Lo que tienes y lo que gastas crece por el Debe; lo que debes, lo de los socios y lo que ganas crece por el Haber.** La «Posición» de la ficha de la cuenta es un dato de la ficha, no la regla del asiento (la 10200 Capital sale con posición Debe y crece por el Haber).
3. **Provisional no cuenta.** Solo los asientos Contabilizados entran en el mayor y en sumas y saldos. «Abrir a provisional» los saca otra vez (si el periodo está abierto).
4. **El maestro guarda el mnemotécnico, no la cuenta**; el ERP lo traduce a la cuenta del plan de la empresa al contabilizar. Por eso el mismo artículo sirve con planes distintos.
5. **Solo las cuentas de tipo Terceros** calculan impuestos y generan efectos. Las de gasto son de tipo Costes y piden proyecto y sección.
6. **Contabilizar una factura genera tres cosas**: asiento, cartera de efectos y registro fiscal. Con importe total 0 genera asiento y fiscal pero no cartera.
7. **La base TUTORIAL es compartida.** Pon siempre `{INI}` (2 letras) en los códigos; filtra por tu diario/documento; nunca ejecutes procesos masivos con la empresa en «*». No toques tipos de asiento, plantillas ni cuentas de la demo.
8. **Una factura no se borra**: se rectifica o se sustituye (queda registro para Hacienda).

## Qué leer según la tarea
- Plan, cuentas, tipos, indicadores, mnemotécnicos, `{INI}626`, cambio de código → `references/plan-cuentas-y-mnemotecnicos.md`.
- Datos básicos del caso (tercero C{INI}, P{INI}, R{INI}, 43000.00901, {INI}CAJA, CP) → `references/datos-basicos.md`.
- Orden de carga de Finanzas, decisiones previas, Finanzas sola o integrada, plantillas, tipo de asiento, permiso «Contabilizar» → `references/orden-de-carga-y-escenarios.md`.
- Grupos auxiliares, proyectos, secciones → `references/analitica.md`.
- Diario, numerador, asiento manual, Finalizar, duplicar, copias, corregir, invertir, saldos iniciales, ejercicio y periodos → `references/diarios-y-asientos.md`.
- Apuntes, mayor, sumas y saldos, Integridad, libro diario → `references/consultas.md`.
- Contabilizar facturas, facturas directas FC/FB, rectificativas y sustitutivas, factura que no contabiliza, asiento de un movimiento de banco → `references/facturas-y-asientos-generados.md`.
- Errores, avisos y la lección «asientos al revés» → `references/trampas.md` (léelo antes de revisar o escribir cualquier asiento de ejemplo).
- Qué enseña cada bloque (id) y fuentes → `references/bloques-y-fuentes.md`.
- Conocimiento de las grabaciones «Icon» sobre remesas, extracto, cartera, TAX y activos, y tabla de problemas heredada → `references/conocimiento-videos-icon.md`.

## Caso continuo del curso (cifras que debes respetar)
Empresa 0 «Deister Software» (todos los alumnos comparten sus documentos); empresa propia `S{INI}` solo para alta, saldos iniciales y cierre. Aportación 3.000,00 (57200 al Debe, capital al Haber); compra a `T{INI}` 125,00 + 26,25 = 151,25 (factura PROV-{INI}-001, fecha 09-10-2026); venta a `C{INI}` 200,00 + 42,00 = 242,00 en dos efectos de 121,00 (30 y 60 días); comisión 10,00 y 3,50 a la 62600; banco final 3.077,25; IVA 15,75 a ingresar; beneficio 61,50. En los bloques de práctica de Contabilidad se usan cifras de ensayo (gasto 1.000,00, fecha 12-11-2026) porque sirven para ver el mecanismo.

## Al editar contenido
Respeta `criterios-sergi` (idioma, juniors sin base contable, datos de demo falsos: no difuminar). Cada concepto abre con una analogía cotidiana y una frase «si no lo haces…». Códigos de alumno: `_fuente/CODIGOS_ALUMNO.md` (diario de 2 caracteres, grupo auxiliar y flujo de 6 como máximo, plazo y tipo de efecto de 3).
