# Reauditoría del curso «Practicando Axional Deister VNext» (25-11-2026)

Estado revisado: rama `claude/strange-raman-307052`, commit `e36e72d` (10 módulos 0-9 con Configurar y Operar, Fundamentos y caso continuo).
Método: lectura completa de los 10 JSON de contenido (volcados a texto; 4 módulos los revisaron subagentes y yo comprobé con grep las citas que uso), `etapas.ts`, `index.ts`, exámenes, glosario y el código de progreso (`lib/ruta.ts`, `lib/progress.ts`, `components/exercise/Guiado.tsx`). No he tocado la demo: lo que necesita la demo va en el punto 3.

Numeración H: manda `plan_mejoras.md`. Ojo: `verificacion_B.md` numeró H18-H39 por su cuenta y no coincide; aquí se sigue la del plan.

Recuento: **18 Resueltos · 19 Parciales · 17 Pendientes · 2 Descartados**. Hallazgos nuevos: **33** (3 críticos, 10 altos).

---

## 1. Hallazgos H01–H56: estado hoy

| ID | Tema | Estado | Evidencia | Qué falta |
|---|---|---|---|---|
| H01 | Portada exigía cursos previos | Resuelto | `pages/Home.tsx` sin requisito; `maestros-nav-datos` «Si nunca has trabajado con contabilidad…» | — |
| H02 | Acceso autoservicio a TUTORIAL | Pendiente | Depende de Deister | Decisión Sergi/Deister |
| H03 | Numerador de acuerdos y pedido rotos en la demo | Pendiente | `compras-3`: «Failed to parse», número de pedido a mano, «Generar acuerdo» falla | Deister; mientras, reescribir como «limitación de la demo» (ver N18) |
| H04 | Tabla «Códigos del alumno» inexistente | Resuelto | `maestros-nav-datos` contiene la tabla | Está desactualizada: ver N20 |
| H05 | Compras remitía a una Práctica inexistente | Resuelto | `compras-2` remite a la Práctica de `compras-factura`, que existe (`erp/practicas.ts:639`) | — |
| H06 | Activos pedía abrir AACF | Resuelto | `icon-activos-v-1`: «en la demo de prácticas no existe la tipología AACF. Abre una … cualquiera» | — |
| H07 | Tesorería «lo verás» de bloques ya hechos | Resuelto | Sin «lo verás en» en `tesoreria.json` | — |
| H08 | Empresa ALA sin explicar | Parcial | `maestros-v-3` lo explica; `icon-impuestos-conceptos`, `icon-activos-conceptos` tienen puente | No dicen que los datos son de 2023; `icon-impuestos-2` «filtra por ejercicio fiscal» sin año; empresa «TRI» en `icon-impuestos-2-registro` sin explicar |
| H09 | Asiento/debe/haber antes de explicarlos | Resuelto | `fundamentos-1` (debe y haber, asiento y apunte) | Regla mal formulada en `asientos-2`: ver N11 |
| H10 | IVA, zona, clave fiscal sin definir | Resuelto | `fundamentos-1-iva`, `maestros-v-3-cabecera` (zona ESCO) | — |
| H11 | Domiciliación, efecto, remesa | Parcial | `fundamentos-2` define efecto y remesa | `carteras-5` usa CSDDS/SDD sin definir SEPA ni mandato y remite en pasado a un bloque posterior |
| H12 | «Contabilizar» sin definir | Resuelto | `maestros-v-3-cabecera`, `fundamentos-2` | — |
| H13 | Plantilla de contabilización | Parcial | `contab-plantilla-alta` | «Tipo de asiento» y «plantilla» siguen mezclados (`icon-contabilidad-v-4`: «el código de la plantilla contable») |
| H14 | Retención IRPF sin definir | Resuelto | `compras-1` la define | `asientos-7` «IRPF (los impuestos y retenciones)» es impreciso (Baja) |
| H15 | Tipología | Descartado | Ya resuelto en el informe | — |
| H16 | Numeración de bloques que no coincide | Parcial | La web numera por `etapas.ts` | `ventas-nav-circuito` dice «bloque 1/2»; orden de Remesas en Cartera (N15) |
| H17 | Procesos masivos antes del primer asiento | Resuelto | `icon-contabilidad-2/-3` en módulo 9 | — |
| H18 | Repartir Maestros | Resuelto | `maestros.json` solo con `maestros-v-3`, `maestros-v-4` | Pero Maestros depende ahora de Contabilidad: N02 |
| H19 | Bloques largos sin partir | Pendiente | `maestros-1` 90 min/35 pasos; `carteras-5` 75/42; `ventas-1` 60/46; `ventas-2` 75/41; `carteras-1` 60/30 | Partir con ids nuevos o pasar secciones a «Para saber más» (punto 3) |
| H20 | Tercero explicado 5 veces | Pendiente | Alta de C{INI} en `maestros-1`, `maestros-2` y `ventas-1-cliente`; tercero en `compras-1`, `carteras-1` | Ficha base única y «lo creaste en…» |
| H21 | «Cómo moverte» repetido | Parcial | `fundamentos-navegar` existe, pero siguen 6 navegaciones «Cómo moverte por el ERP» (compras, maestros ×2, carteras, icon-contabilidad, ventas) y `tesoreria-nav-moverse` | Dejar en cada módulo solo lo propio y enlazar a Fundamentos |
| H22 | Asiento = apunte | Resuelto | Uso coherente en todo el curso | — |
| H23 | Bancos y cajas 5 veces | Parcial | Puente AG{INI} en `carteras-3-banco` | Cuatro cuentas financieras para dos cosas: N14 |
| H24 | Tipología repetida | Parcial | Definida en `compras-tipos` | Se usa antes en `compras-nav-moverte` y se vuelve a enseñar en `ventas-1`/`ventas-2` |
| H25 | Plazos y tipos de efecto 3 veces | Pendiente | `maestros-1` (P{INI}, R{INI}) y `carteras-1` (V{INI}, E{INI}) en las mismas pantallas, sin «ya usaste esta pantalla» | Frase puente en `carteras-1` |
| H26 | Ejercicio, cuenta, numerador repetidos | Parcial | Se definen en línea | `asientos-2` vuelve a explicar el numerador con máscaras |
| H27 | Continuidad de datos | Parcial | Caso continuo y `caso-final` creados; frases «Ejemplo: en tu caso…» | Incoherencias: N05, N07, N09, N20 |
| H28 | Clip de Compras en 11 secciones | Pendiente | Sin cambios en vídeo salvo H30/H31/H32 | Decisión editorial |
| H29 | Hasta 6 tramos por sección | Pendiente | Ídem | Ídem |
| H30 | 27 tramos idénticos | Resuelto | Commit `50a99a0` | No re-medido en esta revisión |
| H31 | Saltos desordenados en compras-tipos | Resuelto | Commit `50a99a0` | No re-medido |
| H32 | Vídeo de otra base | Parcial | `hecho_video.md`: un tramo de `icon-contabilidad-v-1` pasa a TUTORIAL | Resto necesita grabación |
| H33 | Bloques sin vídeo | Pendiente | Ventas 0/2; asiento manual, stock, sumas y saldos | Grabar |
| H34 | Módulos desequilibrados | Parcial | Ventas sigue con 2 bloques; Cartera 18 | Ver N26 |
| H35 | Bloques mal dimensionados | Pendiente | Ver H19 | — |
| H36 | Extremos de duración y clics | Pendiente | Ver H19 | — |
| H37 | «Siempre sigue estos pasos» con Práctica | Parcial | `Home.tsx:242` ya lo corrige | `fundamentos-nav-curso` repite que cada bloque se practica «en el ERP de práctica» (N27) |
| H38 | Nombres inconsistentes | Parcial | Interfaz dice «bloque» | «Deister Manager» en `maestros-nav-datos`; «Ejercicio 2 entrada de asientos» 9 veces en `icon-contabilidad.json`; «PGE 2008» frente a PGC |
| H39 | Capturas con datos de otros alumnos | Pendiente | `hecho_video.md`: no hecho | Decidir tema y prefijo y recapturar |
| H40 | Numeración de ficheros | Descartado | La web numera por `etapas.ts` | — |
| H41 | Saldos iniciales, plan, mnemotécnicos | Parcial | `contab-saldos-iniciales`, `contab-mnemotecnicos-alta` | Están en «Para saber más» pero el caso y el cierre los necesitan (N22); alta de plan completo no |
| H42 | Plantillas, tipo de asiento, cierre práctico | Parcial | `contab-plantilla-alta` (comprobado en demo), `contab-cierre-practica` | Confusión tipo de asiento/plantilla (H13) |
| H43 | 431, mandato, fichero SEPA | Parcial | `cartera-mandato-sepa` | Ruta del fichero SEPA sin comprobar; capturas con 23000 |
| H44 | Impagados, descuento, cobro parcial | Parcial | `cartera-impagado-devolucion`, `cartera-descuento`, `cartera-cobro-parcial` | Capturas del impagado con el asiento al revés; descuento solo concepto; cobro parcial usa un efecto ya cobrado |
| H45 | Workflow y albarán contabilizado (40090) | Resuelto | `compras-workflow`, `compras-albaran-contabilizar` | Se practica con un albarán de la demo, no el del alumno (N09) |
| H46 | Generar factura, rápeles, diferencias | Parcial | `compras-generar-factura` | Rápeles y diferencias albarán-factura sin tratar |
| H47 | Devoluciones y abonos en compras | Parcial | `compras-abono-devolucion` | La demo no tiene tipología de devolución; cifras incoherentes (N33) |
| H48–H52 | Recortes y reequilibrio por módulo (Ventas con 5 tipologías, Almacén) | Pendiente | Sin cambio de alcance; no hay módulo Almacén | Decisión Sergi (N26) |
| H53 | Búsqueda solo en títulos | Resuelto | `lib/buscar.ts` | — |
| H54 | Índice de errores | Resuelto | `pages/Errores.tsx`, ruta `/errores` | — |
| H55 | Glosario: PMICDT, duplicados | Resuelto | PMICDT en `glosario/tesoreria.json` y `carteras.json`; la UI fusiona duplicados | Limpieza de datos opcional |
| H56 | Guías de parametrización y fichas | Pendiente | No existen | Contenido nuevo |

---

## 2. Hallazgos nuevos

### Críticos

**N01 · Fundamentos no se puede terminar.** `fundamentos-1` y `fundamentos-2` tienen 0 pasos. `pasosDe` (`lib/ruta.ts:32`) no quita la pestaña Guiado. `Guiado.tsx:167` pinta «Este bloque no tiene pasos guiados» y nunca llama a `terminarGuiado`. `ejercicioCompletado` (`lib/progress.ts:147`) exige `guiado`. Resultado: `fundamentos-1` nunca queda terminado y `fundamentos-2` queda cerrado; el módulo 0 nunca llega al 100 %. (Deducido del código; comprobar en el navegador.)
Propuesta: en `pasosDe`, quitar «guiado» si el bloque no tiene pasos; en `ejercicioCompletado`, no exigir guiado en ese caso. Alternativa: 3-4 pasos de comprobación en cada bloque.

**N02 · Maestros (módulo 1) depende de Contabilidad (módulo 2) y usa el cliente como tercero de la empresa.** `maestros-v-4-alta-empresa`: «Usa el tercero C{INI} que creaste en «Dar de alta los datos básicos de contabilidad»». Ese bloque es del módulo 2. Además, el propio módulo enseña que la relación empresa-tercero es 1 a 1 (`maestros-v-3-vinculo`): unir la empresa al tercero que luego es su cliente confunde sociedad con cliente.
Propuesta: en `maestros-v-4`, crear un tercero propio de la empresa (p. ej. «Empresa prácticas {INI}») y no usar C{INI}. Si la captura muestra C{INI}, frase puente hasta recapturar.

**N03 · El caso final no cuadra si el alumno sigue Ventas tal cual.** `ventas-1` crea A{INI} con plantilla AV y contabiliza el albarán (43090 contra 70000); la factura F{INI} con FV vuelve a abonar la 70000. El propio concepto lo admite y luego dice «En tu caso la venta cuenta una sola vez: 200,00». En el ERP el alumno verá 400,00 en ventas y 200,00 colgados en la 43090; el beneficio 61,50 de `caso-final-comprobar` no sale.
Propuesta: A{INI} sin plantilla de asiento (como AO{INI} en Compras) o F{INI} con FVOA que salde la 43090. Comprobar en la demo, ajustar el test de plantilla y la sección «Contabilizar el albarán».

### Altos

**N04 · Signo del extracto contradictorio.** `tesoreria-4-manual`: «los cargos se escriben en positivo en el extracto» y «escribe 10,00»; `tesoreria-5` enseña extracto y tesorería con el mismo signo (−8.080,15); `icon-cartera-v-10` dice «mismo importe y signo contrario»; `icon-cartera-v-9` dice que en N43 va sin signo y `tesoreria-4-n43` muestra «-42,35». El caso usa −151,25, −3,50, −10,00.
Propuesta: una regla única con la equivalencia al signo bancario y el extracto del caso escrito en esa convención.

**N05 · No queda claro cuál es «tu empresa».** `fundamentos-navegar`: «tu empresa del curso es S{INI}»; `fundamentos-1`: «Tu empresa S{INI} compra… Se graba en la empresa 0»; `maestros-v-4`: «S{INI} … el caso no la usa»; `contab-saldos-iniciales`: «Usa tu empresa S{INI}, no la 0» con 5.000,00; `caso-final-comprar` op. 1 remite a ese bloque (opcional) para la aportación de 3.000,00 en la empresa 0.
Propuesta: una sola frase en todo el curso: «Tus operaciones van en la empresa 0. S{INI} solo sirve para practicar crear una empresa, los saldos iniciales y el cierre». Op. 1 del caso: remitir a `asientos-2` (asiento manual), no a un bloque opcional.

**N06 · Contabilidad básica usa cosas que se crean después.** «Facturas que generan asientos» (`icon-contabilidad-v-1` a `-v-4`) vive en Gestión › Compras y cita «tu factura PROV-{INI}-001 de T{INI}», que nace en Compras (módulo 3). `asientos-14` exige el movimiento manual de Tesorería (módulo 6). `asientos-3/8/9/10` dan por hechos los seis movimientos del banco.
Propuesta: mover `icon-contabilidad-v-1..4` al final de Compras · Operar y `asientos-14` a Tesorería (mismos ids; añadir a `CARPETA_ORIGEN`). En `asientos-3/8/9/10`, «cuando termines el caso».

**N07 · Las operaciones 7 y 10 del caso nunca se practican con datos propios.** La remesa de pago (`icon-cartera-v-4..v-6`, `carteras-7`) solo usa datos del vídeo (PRVCC0, 00087, 1.815,00). La remesa SEPA del efecto 2 exige IBAN y mandato de C{INI}, pero `cartera-mandato-sepa` lo hace con CAR{INI}. Además `caso-final-pagar-cobrar` dice «crea la remesa LRC{INI}»: LRC{INI} es la línea financiera, no la remesa.
Propuesta: sección «Aplica a tu caso» al final de `icon-cartera-v-5` y de `cartera-mandato-sepa` (T{INI}, C{INI}, BBVA_{INI}); corregir «remesa por la línea financiera LRC{INI}».

**N08 · Ventas: Configurar vacío con una nota falsa, y tipologías dentro de Operar.** La nota de `etapas.ts` dice que reutilizas «cliente, artículo, almacén, numeración» de Compras y que las tipologías se crean «copiando lo que ya hiciste en Compras». El cliente nace en Contabilidad, el artículo y el almacén del caso son de la demo, y las tipologías copian AV y FV de la demo. `ventas-1-cliente` manda «Nuevo» y añadir CLI con 43000.00000 cuando C{INI} ya tiene 43000.00901. 22 pasos de `ventas-1` y 17 de `ventas-2` son configuración.
Propuesta: reescribir la nota; reducir `ventas-1-cliente` a «comprueba que C{INI} está activo»; bloque nuevo de Configurar (id nuevo) con A{INI} y F{INI}; `ventas-2` en etapa opcional (no entra en el caso).

**N09 · Dos bloques de Compras prometen el albarán del alumno y no pueden.** `compras-albaran-contabilizar`: «Contabilizarás el albarán de T{INI}», pero AO{INI} no contabiliza («Con ese campo vacío, como tu AO{INI}, no hay asiento»). `compras-generar-factura`: «Generarás la factura de T{INI} desde su albarán», pero ese albarán ya se facturó por el camino A (`compras-factura-caminos`).
Propuesta: decir en objetivo, concepto y primer paso que se practica con un albarán de la demo; sacar PROV-{INI}-002 del caso.

**N10 · Exámenes.** Fundamentos no tiene examen. Maestros y Contabilidad avanzada tienen 4 preguntas cada uno: con `APROBADO = 0.8`, un fallo suspende. Los bancos no cubren los bloques nuevos: Cartera sin impagado, SEPA, descuento ni cobro parcial; Contabilidad sin saldos iniciales, mnemotécnicos ni tipo de asiento; Contabilidad avanzada sin cierre práctico ni caso final. `examenes/contabilidad-avanzada.json` tiene «Según la documentación de cierre…», frase vetada.
Propuesta: banco de Fundamentos (10-12 preguntas distintas de los tests); subir Maestros y Contabilidad avanzada a 10 o más; 2-3 preguntas por bloque nuevo.

**N11 · Regla de debe y haber mal formulada.** `asientos-2` (concepto): «Debe (columna izquierda: lo que la cuenta recibe)». Con esa regla, el capital que recibe la aportación iría al debe. Contradice `fundamentos-1-debe-haber` y `maestros-v-1`.
Propuesta: usar la regla de Fundamentos (lo que tienes y lo que gastas, al debe; lo que debes, lo que es de los socios y lo que ganas, al haber).

**N12 · Contabilidad básica: «Para saber más» guarda lo que hace falta antes.** Ejercicio, periodo y vigencia se explican a fondo en `parametrizacion-icon-1` (opcional), pero `asientos-6`, `asientos-12` y `icon-contabilidad-v-4` los exigen. Los saldos iniciales (`contab-saldos-iniciales`, opcional) los necesitan `contab-cierre-practica` (módulo 9) y la op. 1 del caso.
Propuesta: subir a Configurar una versión corta de ejercicio y periodos; marcar `contab-saldos-iniciales` como necesario para el módulo 9, o moverlo a Configurar.

**N13 · Activos e Impuestos tocan o cuentan datos que no son del alumno.** `icon-impuestos-v-3` manda cambiar la zona del proveedor 00003, dato compartido por todos. `icon-activos-v-3`: «no contabilices facturas que no sean tuyas» y luego «Pulsa «Contabilizar»».
Propuesta: los dos como demostración (solo mirar) o con un proveedor propio.

### Medios

**N14 · Cuatro cuentas financieras para dos cosas.** CAIXA{INI} (Maestros), {INI}CAJA 57000 (Contabilidad), BBVA_{INI} 57200 y CAJA_{INI} 57000 (Cartera). `carteras-3-caja` no dice que {INI}CAJA ya existe; `icon-contabilidad` (v-2) sugiere CAIXA{INI} como cuenta financiera. Propuesta: frase puente en `carteras-3-caja` y `tesoreria-6`; decidir si {INI}CAJA sobra.

**N15 · Orden de Cartera.** En «Remesas», `carteras-7` ya pulsa «Evolucionar estado» antes de `icon-cartera-v-6` «Evolucionar una remesa», que retoma la remesa de `v-5` tras dos bloques. `icon-cartera-1` y `icon-cartera-2` (actlog, `cefecges_estado_ava_NN`) están antes del primer cobro práctico. `carteras-nav` «Orden de los bloques» no lista los cuatro bloques nuevos. Propuesta: `v-4, v-5, v-6, v-7, carteras-7`; `icon-cartera-2` al final de su etapa; actualizar el aviso.

**N16 · Cartera se contradice.** Test de `icon-cartera-2` (al reabrir se restaura «del histórico del efecto») frente a test de `icon-cartera-3` («en el detalle de la gestión», con el histórico como distractor). Estado OC en todo el módulo y OP en `v-6`. Cuenta puente 10000.00087 (`v-6`) y 40100.00003 (`carteras-7`) sin frase que las una. Ejemplo de `carteras-1-tipo-efecto` «CAR{INI}» en un campo de 3 caracteres. Propuesta: unificar y corregir.

**N17 · Tesorería repite y se contradice.** «Conciliar tesorería» (`icon-cartera-v-10`) frente a «Conciliar banco» (`tesoreria-5`). `tesoreria-3` contabiliza antes de conciliar y `icon-cartera-v-8` dice «Contabilizar viene después de conciliar» sin distinguir movimiento manual y remesa. `v-9`/`v-10` repiten `tesoreria-4`/`-5` con cifras del vídeo (1.524,60, −5.082,00). La comisión 3,50 del caso no se configura como línea aparte (`tesoreria-1-comisiones`). Propuesta: un nombre de botón; regla de cuándo se contabiliza; `v-8..v-11` como opcional o con cifras del caso.

**N18 · Texto interno visible para el alumno.** `compras-3`: «No sabemos si hay tolerancia», «no lo hemos conseguido. Pide a Deister…»; `icon-impuestos-3-caso`: «No está comprobado que el borrador del 303 lo contabilice»; `icon-activos-2`: «no está claro si genera un apunte contra pérdidas (671)». Propuesta: comprobar en la demo y redactar en firme, o un aviso «limitación de la demo».

**N19 · Fiscal.** El plazo del 303 del 4T se da como «antes del 30-01-2027» (fundamentos, impuestos ×2, caso final ×3). El 30-01-2027 es sábado: el plazo pasa al lunes 1-02-2027. «Prorrata» se usa para un % deducible por factura en `icon-impuestos-2` y `-3`. Propuesta: «hasta el 1-02-2027 (el 30 de enero cae en sábado)»; reservar «prorrata» para la regla anual.

**N20 · Códigos y datos del caso desactualizados.** Tabla de `maestros-nav-datos`: «T{INI} … Ventas lo reutiliza como cliente» y «A{INI}, F{INI}… al empezar cada bloque de Operar»; `_fuente/CODIGOS_ALUMNO.md` igual. `caso-final-vender`: «das de alta como cliente a T{INI}» (Ventas ya usa C{INI}). `ventas.json` `datosSimulador`: `"cliente": "T{INI}"` y un único efecto de 242,00 (el caso tiene dos de 121,00). Etapa de `maestros-1`: «los usarán Ventas y Cartera» (Cartera no usa P{INI} ni R{INI}). Propuesta: corregir los cinco sitios.

**N21 · Cuenta del cliente compartida.** C{INI} usa 43000.00901, número fijo en la empresa 0 compartida; `maestros-1` ya admite «usa otro número libre». El caso y la comprobación final citan 43000.00901. El proveedor usa 40000.T{INI}. Propuesta: 43000.C{INI} (comprobar en la demo que admite letras, como la 40000.T{INI}).

**N22 · Cuentas mal explicadas en Contabilidad.** `maestros-v-2`: el mnemotécnico 43000 «te lleva a… la 43000.00901» (apunta a 43000.00000). `parametrizacion-1`: la 62999 «hace de 626 en tu caso», pero es del subgrupo 629 y `contab-mnemotecnicos-alta` no la une a ningún flujo; `tesoreria-2-flujo` enseña 64420. `parametrizacion-icon-2` dice que el diario de ventas es «VE» (y el test lo da por bueno); `asientos-1` dice DV. Propuesta: corregir las tres.

**N23 · Rutas con varias versiones o sin comprobar.** «Registro de terceros» (8 veces) frente a «Registro terceros» (menú); tercero por Finanzas o por Gestión; «Gestiones sobre la cartera de efectos» frente a «Gestiones › Gestiones sobre efectos»; «Cobros y Pagos › Movimientos» frente a «› Cobros y Pagos»; «Tipos de facturas» (Compras) frente a «Facturas» (Ventas); rutas de Impuestos y Activos sin prefijo. Sin comprobar: «Tipos remesas» (`cartera-descuento`) y la emisión SEPA XML. Propuesta: una pasada con la demo y unificar.

**N24 · Abono y stock incoherentes.** `compras-abono-devolucion`: concepto de 1 ud (−15,13) y práctica por 60,50, sin albarán de devolución; `maestros-3` dice que el 13500620 acaba en 0; `ventas-2` vende 5 uds más con stock 0. `ventas-2` concepto: «5 × 22,00 = 133,10» (falta 110,00 + 23,10 de IVA). `cartera-cobro-parcial` usa «el de 242,00 de tu factura de venta», ya cobrado en `carteras-5`. Propuesta: marcar abono y ventas-2 como prácticas fuera del caso y corregir las cifras.

**N25 · Bloques de Configurar demasiado técnicos para un junior.** `icon-contabilidad-1` (Configurar) pide leer `ctaper = 1`, permisos MODAUD/AUDACEPTAR, «auditoría con IA», `imp_cuadre`. `maestros-1` mete divisa, municipio y artículo financiero que el caso no usa. `maestros-2` (60 min) crea ROD{INI}, ALM{INI}, RS{INI} que solo usa `maestros-3`. Propuesta: esas secciones a «Para saber más» sin cambiar ids.

**N26 · La carga ha crecido.** Obligatorio hoy: 40,8 h (Contabilidad básica 7,6 h; Cartera 9,3 h; Compras 5,8 h). La auditoría apuntaba a unas 30 h. Activos (2,5 h) es obligatorio aunque no entra en el caso; los bloques `icon-activos-v-1..v-4` solo miran documentos de otra empresa. Propuesta: decisión de Sergi (punto 3).

**N27 · Fundamentos promete una Práctica en cada bloque.** `fundamentos-nav-curso`: «la practicas en el ERP de práctica y en la demo real». Solo 5 bloques la tienen. Propuesta: copiar la frase de `Home.tsx:242`.

**N28 · Impuestos sin parte opcional.** `icon-impuestos-3` mezcla el 303 del caso con 390/349, claves, prorrata y SII en una etapa obligatoria. Propuesta: separar lo avanzado (bloque nuevo opcional o secciones marcadas).

### Bajos

**N29 · Títulos fuera de norma** (no infinitivo, con dos puntos o paréntesis): `contab-plantilla-alta`, `compras-workflow`, `compras-abono-devolucion`, `cartera-descuento`, `cartera-impagado-devolucion`, `cartera-mandato-sepa`, `contab-cierre-practica`. Propuesta: «Configurar el tipo de asiento», «Aprobar pedidos con workflow», «Devolver mercancía y registrar el abono», «Entender el descuento de efectos», «Registrar un recibo devuelto», «Domiciliar un cliente y remesar el cobro», «Cerrar el ejercicio de tu empresa».

**N30 · Nombres y restos.** Módulo 1 titulado «Mantenimiento de tablas maestras» (la web lo llama «Datos maestros»); campo `sesion` con «Sesión 0/2/7/8/11» o vacío (no se usa en la interfaz; limpiar). `maestros-v-1`: «España usa el plan PGE 2008» (es el nombre del ERP; el plan es el PGC 2007); grupos 1 y 2 como «financiación propia» e «inmovilizado».

**N31 · Términos sin definir donde se usan por primera vez.** «tipología» (`compras-nav-moverte`, `maestros-v-2`), «serie» (`compras-1`), «Docflow» (`ventas-1-factura`), «SII» (`icon-contabilidad-v-3`), «IGES» (`parametrizacion-icon-2`), «línea financiera» y «acción PTES» (`tesoreria-1`, `tesoreria-3`), TicketBAI/VERIFACTU (`icon-impuestos-1`), «Cash Pooling/Netting» (`tesoreria-2`).

**N32 · Contradicciones menores.** «Prevista de asiento»: «asiento previsto» (`compras-albaran-contabilizar`) frente a «no graba nada» (`compras-2`, `ventas-1`). `asientos-1` dice que la aportación irá en tu diario y `asientos-2` que la grabarás en el caso final. `icon-contabilidad-v-3`: ejemplo de rectificativa «te equivocaste de proveedor» en una compra (rectifica el proveedor).

**N33 · Criterio de orden desactualizado.** La skill `criterios-sergi` fija «maestros → compras → ventas → contabilidad…»; `index.ts` ORDEN pone Contabilidad básica antes de Compras (decisión de fase 2). Propuesta: que Sergi confirme el orden y se actualice la skill.

---

## 3. Propuesta de ajustes priorizada

### A. Hacer ya (sin cambiar ids de bloques ni de secciones)

| # | Acción | Hallazgos | Esfuerzo |
|---|---|---|---|
| 1 | Arreglar el bloqueo de Fundamentos (`pasosDe` y `ejercicioCompletado` sin Guiado si no hay pasos) y probarlo en el navegador | N01 | 30 min |
| 2 | Una sola versión de «tu empresa» (empresa 0 para el caso; S{INI} para alta, saldos y cierre) en `fundamentos-navegar`, `fundamentos-1`, `maestros-v-4`, `contab-saldos-iniciales`, `caso-final`; op. 1 → `asientos-2` | N05 | 1 h |
| 3 | `maestros-v-4`: tercero propio de la empresa, no C{INI} | N02 | 1 h (+ captura si sale C{INI}) |
| 4 | Errores contables de texto: regla debe/haber de `asientos-2`; VE→DV; mnemotécnico 43000; 62999/626; plazo del 303; prorrata; 5 × 22,00; 4 uds en `compras-generar-factura-validar` | N11, N19, N22, N24 | 2 h |
| 5 | Actualizar códigos: tabla de `maestros-nav-datos`, `CODIGOS_ALUMNO.md`, `caso-final-vender`, `datosSimulador` de Ventas (C{INI}, dos efectos de 121,00), etapa de `maestros-1` | N20 | 1 h |
| 6 | Mover bloques entre módulos y etapas en `etapas.ts` (ids intactos): `icon-contabilidad-v-1..4` al final de Compras · Operar, `asientos-14` a Tesorería; Remesas en orden v-4, v-5, v-6, v-7, carteras-7; `icon-cartera-1/-2` al final de su etapa; `ventas-2` a etapa opcional | N06, N15, N08 | 2 h |
| 7 | `compras-albaran-contabilizar` y `compras-generar-factura`: «con un albarán de la demo» | N09 | 1 h |
| 8 | Nota de Configurar de Ventas y `ventas-1-cliente` (comprobar C{INI}, no crear CLI) | N08 | 1 h |
| 9 | Exámenes: banco de Fundamentos; Maestros y Contabilidad avanzada a 10 o más; preguntas de los bloques nuevos; quitar «Según la documentación» | N10 | 5 h |
| 10 | Quitar texto interno (N18), rótulos y títulos (N29, N30), frase de Práctica (N27), términos (N31), contradicciones menores (N32, N16 salvo comprobación) | N16, N18, N27, N29-N32 | 3 h |
| 11 | Pasar a «Para saber más» las secciones técnicas de Configurar y subir lo necesario (ejercicio y periodos, saldos iniciales) | N12, N25 | 2 h |
| 12 | Frases puente de repetición («ya usaste esta pantalla», cuentas financieras) | H25, N14 | 1 h |

Total aproximado: 20-21 h de redacción y código. Después, build, prueba de humo y agentes-junior (skill `diseno-y-ux`).

### B. Necesita la demo o grabación

| Acción | Hallazgos | Esfuerzo |
|---|---|---|
| Decidir y comprobar cómo evitar la doble venta (A{INI} sin plantilla o F{INI} con FVOA) y reescribir `ventas-1` | N03 | 2-3 h |
| Fijar la convención de signo del extracto y escribir el extracto del caso (seis líneas, incluida la aportación con «Generar tesorería») | N04, N17 | 3 h |
| Sección «Aplica a tu caso» para la remesa de pago de T{INI} y la remesa SEPA de C{INI} (IBAN y mandato) | N07 | 3 h |
| Comprobar si el borrador del 303 contabiliza y si la baja de activo genera 671 | N18 | 1 h |
| Comprobar si la subcuenta 43000.C{INI} es posible | N21 | 30 min |
| Recorrer las rutas dudosas y unificar | N23 | 2 h |
| Recapturas con datos propios (H39) y capturas con asiento invertido (impagado, SEPA) | H39, H44 | 1 día |
| Grabar Ventas, asiento manual, sumas y saldos, stock | H33 | 1-2 días |
| Bloque nuevo de Configurar en Ventas (A{INI}, F{INI}) con id nuevo, probado en la demo | N08 | 3 h |

### C. Decisión de Sergi

- **Carga del curso (40,8 h obligatorias).** Pasar a opcional Activos · Operar, `ventas-2`, `icon-cartera-3` y los bloques técnicos de Cartera; o aceptar la duración (N26, H48-H52).
- **Partir bloques largos con ids nuevos** (`maestros-1`, `carteras-5`, `carteras-1`, `ventas-1`), manteniendo los antiguos para no perder progreso (H19, H35, H36).
- **Orden del curso**: confirmar Contabilidad antes de Compras y actualizar `criterios-sergi` (N33).
- **Acceso y numerador de la demo** con Deister (H02, H03).
- **Prefijo y tema de las recapturas** (H39).
- **Vídeo**: recorte a un tramo por sección (H28, H29).
- **Guías de parametrización** (H56) y módulo Almacén (H52).
