---
name: erp-next-workflow
description: "Aprobación de pedidos de compra con workflow en el ERP nuevo Deister Axional VNext (demo nextdemo.geasa.eu, base tutorial): rol de workflow, circuito (Inicio, Usuario, Fin), validación 36, grupo de validaciones, tipología PW{INI} con «Grupo validación», Revalidación, pedido Bloqueado, Gestionar, Acciones pendientes, Autorizar, traza, evaluación y token, y la «Relación proveedor PRO» de PWCP, PWVD y PC (PCCL y PCVL llevan ACR). Úsala siempre que haya que montar, probar, explicar, grabar o revisar el workflow de aprobación (bloques compras-workflow-config y compras-workflow), o cuando pregunten «¿por qué mi pedido no se bloquea?», «¿quién puede autorizar?» o «¿por qué no sale el botón Autorizar?»."
---

# Aprobación de pedidos con workflow (ERP nuevo, demo tutorial)

Un pedido de compra puede quedar **Bloqueado** hasta que alguien con permiso lo autorice. La plataforma lo enseña en dos bloques de `compras.json`: `compras-workflow-config` (etapa «Aprobación de pedidos» de **Configurar**) y `compras-workflow` (etapa «Aprobar pedidos: workflow», al final de **Operar**: primero sabes comprar, después pruebas la aprobación). Para capturas y navegador, skill `navegar-erp-next`; el login lo hace el usuario. Contexto de compras: skill `erp-next-compras`.

Comprobado en la demo el 25-11-2026 (usuario de la sesión `<usuario>`). Resultado: **funciona**. En Next ya no existen `cerrcode`, `cwkftiph`, `cwkftipl`, `cwkfgrup` ni `cwkfgest` (sus URL dan 404).

## Las cinco piezas (se montan en este orden)
| # | Pieza | Qué es | Objeto | Equivalente en el ERP antiguo |
|---|---|---|---|---|
| 1 | **Rol** RW{INI} | Quién puede firmar; es una lista de usuarios | `cworkflow_role`, `cworkflow_role_user` | grupo de gestores `cwkfgrup` |
| 2 | **Circuito** WF{INI} | Diagrama Inicio → tarea «Usuario» (con el rol) → Fin; en «Fin» la validación queda autorizada | `cworkflow_code`, `_code_box` (etapas), `_code_ref` (conectores) | acción y estado final de `cwkftipl` |
| 3 | **Validación** 36 | Comprobación ya programada (clase JS): «¿bloqueo este documento?». La 36 «REFERENCIA DE TERCERO NO INFORMADA» bloquea si «Referencia» está vacía (`return !data.refter`) | `cworkflow_val_prog` (maestro, ~51 en la demo) | código de bloqueo `cerrcode` |
| 4 | **Grupo de validaciones** GW{INI} | Paquete de comprobaciones sobre «Pedidos de compras»; cada línea: fase, validación, qué bloquea, circuito | `cworkflow_val`, `cworkflow_val_item` | tipo de workflow `cwkftiph` / bloqueos `cwkftipl` |
| 5 | **Tipología** PW{INI} | Tipología de pedido con el campo «Grupo validación» (`gcompedd.tipwkf`) = GW{INI} | `gcompedd` | tipo de workflow en la tipología |
Cadena: PW{INI} usa GW{INI}; el grupo lleva la validación 36 y el circuito WF{INI}; el circuito espera al rol RW{INI}. Lo que ocurre en cada pedido se ve en la **traza** (`cworkflow_val_log`), la **evaluación** (`cworkflow_run`) y el **token** (`cworkflow_token`).

Cómo funciona el motor (función `cworkflowEngine`, módulo `workflowRule`, diccionario `wic_icon`): al validar, ejecuta cada validación del grupo; si una bloquea crea una traza «Pendiente» y el pedido queda Bloqueado; si la validación tiene circuito, crea evaluación y token de la etapa Usuario; al autorizar llega a «Fin», la traza pasa a «Autorizado», la evaluación a «Finalizada» y el pedido a Validado.

## Configurar (bloque `compras-workflow-config`)
Configuración en **Finanzas**; trabajo diario con pedidos en **Gestión** (dos menús distintos).
1. **Rol**: Finanzas › Maestros › Acciones y workflow › Definiciones › Roles de workflow › «Añadir rol»: Código RW{INI}, Descripción «APROBADOR PEDIDOS {INI}» (**máx. 20 caracteres**: 18 + 2 iniciales; con 3 iniciales no cabe). Dentro, «Roles de usuario» › Nuevo › Código usuario: en la demo el desplegable solo ofrece unos pocos usuarios y el del alumno puede faltar, así que se asigna **`public`** (Usuario público). Solo para la demo: en un cliente real se asignan las personas concretas que aprueban. «Usuarios por roles» es una lista sin botón Nuevo.
2. **Circuito**: … › Definiciones › Circuitos de workflow › «Añadir circuito» WF{INI} «APROBACION PEDIDOS {INI}»; pestaña «Etapas wkf» › 3 etapas: Inicio (INICIO), Usuario (APROBAR PEDIDO, con «Perfil o roles asignados» = RW{INI}, desplegable que no se teclea), Fin (FIN); pestaña «Conectores wkf» › INICIO→APROBAR PEDIDO y APROBAR PEDIDO→FIN, «Condición» vacía. Comprueba el diagrama en Acciones y workflow › Diseño de workflow (Start › APROBAR PEDIDO › FIN).
3. **Validación**: Finanzas › Maestros › Validaciones › Maestro de validaciones: solo se localiza la **36** (modo «Documento», tablas `gcomofeh gcomacuh gcompedh…`); es de consulta: no se crea nada. No existe una validación de «autorizar siempre».
4. **Grupo**: Validaciones › Grupo de validaciones › «Añadir grupo»: GW{INI}, «WORKFLOW PEDIDOS {INI}», Nombre tabla «Pedidos de compras». Luego, en «Validaciones por grupo» › «Añadir detalle»: Definición fase 1, Validación 36, Bloqueo «Validación» (opciones: Validación, Contabilización, Impresión), casilla «Manual» como viene, **Código workflow = WF{INI}**. Sin circuito el pedido se bloquea pero **no hay botón para autorizarlo**. Comprueba que la línea 1 muestra tu circuito.
5. **Tipología**: Gestión › Compras › Maestros › Documentos › Pedidos › «Nuevo» (no hay «Nuevo como» en esta tipología): Tipo pedido **PW{INI}** (4 caracteres), Descripción, Serie PC, Tipo Normal, Estado Activo, **Relación proveedor** (ver abajo), Stock planificado No, y en «Datos generales» **Grupo validación = GW{INI}**. Se deja vacío el «Circuito» de Datos generales. Las secciones «Validaciones workflow» y «Circuito worflow» (errata del ERP) salen vacías en pedidos de compra.

## Relación proveedor PRO en la tipología (cambio del 26-11-2026)
Comprobado en la demo:  el tipo **PWCP** (con el que se probó el workflow), el estándar **PC** y **PWVD** llevan Relación proveedor **«Proveedores» (PRO)**; otros, **PCCL y PCVL**, llevan **ACR**. En PW{INI} el alumno elige **PRO**, no ACR como en las otras tipologías de pedido del módulo. Vale cualquier relación que tenga el proveedor del pedido: el tercero T{INI} tiene ACR y PRO (si le falta una, ver `erp-next-compras`).

## Operar: probar y autorizar (bloque `compras-workflow`)
1. **Pedido** (Gestión › Compras › Pedidos › Pedidos › Nuevo; ficha genérica): Tipo PW{INI}, **Pedido 0PW{INI}0001 (se teclea)**, empresa 0, delegación CENTRAL, departamento COMPRAS, fecha de hoy, proveedor 00010, divisa EUR, tipo efecto EF, forma pago 30D, **Referencia vacía** (dispara la 36), Estado **Provisional**, Bloqueos vacío. Anota el «Identificador pedido» (número interno de la primera columna de la lista).
2. **Línea por CSV** (la ficha no tiene líneas): Compras › Pedidos › «Líneas de pedidos» › ⋮ › Importar, delimitador «;». Fila de datos de la demo: `18;1;1;13500620;0;0;10;UNI;10;UNI;4;40;0;0` (el primer número es el Identificador del pedido: cámbialo por el tuyo). 10 × 4,00 = 40,00 → «1 row(s) inserted». Apaño solo de la demo.
3. **Revalidación** (Compras › Pedidos › Procesos › Revalidación, `gcompedh_valida_n`), filtro Pedido = el tuyo, con el pedido en **Provisional** (o ya Bloqueado: así arranca el circuito si lo enlazaste tarde; con el pedido Validado no devuelve nada) › «Ejecutar consulta» › «Aceptar». **Guardar la ficha no lanza el workflow.** El texto del resultado dice «Pedido validado» aunque quede bloqueado: manda la columna Estado.
4. **Bloqueo**: ficha con Estado **Bloqueado**, Bloqueos **V**, Validaciones **1**; traza (Finanzas › Maestros › Validaciones › Traza de validaciones): validación 36 «Pendiente».
5. **Autorizar** (Compras › Pedidos › Work Flow › **Gestionar**, `gcompedh_vtabsel_workflow`): filtra por Pedido › Ejecutar consulta › marca el pedido en «Pedidos con autorizaciones pendientes» › en «Pendientes» sale APROBAR PEDIDO / WF{INI} / rol / Pendiente › enlace «1» del número de fila → «ACCIONES PENDIENTES» (`gcompedh_wkf_run_pending`) con **Denegar · Autorizar · Retornar · Designar**. `is_authorizable` = 1 si tu usuario tiene el rol de la etapa. Pulsa solo **Autorizar** › «Respuesta usuario» («Aprobado en prueba del curso») › «Aceptar». No hay mensaje de confirmación: se confirma abriendo el pedido.
6. **Resultado**: pedido **Validado**, Bloqueos vacío, Validaciones 0; traza «Autorizado»; evaluación (Evaluación de WKF) «Finalizado»; token «Ejecutado» por tu usuario con la respuesta. No hace falta revalidar.
7. **Autorizar** (`gcompedh_awk`, exige Fecha pedido) y **Retroceder** (`gcompedh_rwk`) son **informes sin botón**: solo listan. No se puede deshacer una autorización desde ahí.

## Trampas y errores frecuentes
- Pedido con Referencia vacía que no se bloquea al guardar → falta **Revalidación** (con el pedido Provisional).
- Pedido Bloqueado sin tarea en Gestionar → a la línea del grupo le falta «Código workflow»; ponlo y revalida.
- La captura muestra el pedido «Validado»: no es el estado de partida; solo en la demo se puede cambiar el Estado a Provisional a mano o crear otro (0PW{INI}0002). En un cliente real el Estado nunca se cambia a mano ni se importan líneas a la tabla.
- `is_authorizable` = 0 → la etapa «Usuario» no lleva tu rol RW{INI} o el rol no tiene asignado el usuario.
- Códigos de la captura de la demo (no del alumno): GCP, RCP «APROBADOR PEDIDOS CP», WFCP, PWCP, 0PWCP0001.

## Lecciones de las sesiones (síntoma → causa → regla)
- El pedido no se bloquea al guardar → la ficha genérica de `gcompedh` no dispara el workflow; lo lanza Procesos › Revalidación (`gcompedh_valida_n`) con el pedido en Provisional → revalidar siempre, y con el pedido Validado no devuelve nada.
- Pedido Bloqueado pero sin botón de autorizar → la línea del grupo no lleva «Código workflow» (circuito) → ponlo y revalida.
- El usuario de la sesión no sale en el desplegable de usuarios del rol (solo otros dos y `public`) → asignar `public` solo en la demo; `is_authorizable = 0` = rol sin usuario válido; «Perfil o roles asignados» es multiselección, no se teclea.
- «Pedido validado… Estado Bloqueado» → es el nombre del proceso; manda la columna Estado. En la lista de validaciones busca por «Número validación», no por el índice gris de fila.
- El campo «Circuito» de la tipología es de Docflow: se deja vacío (el circuito va en la línea del grupo).
- «Retroceder» es un informe sin acción; Denegar sin probar. Docs y vídeos antiguos de Drive describen el modelo anterior (`cwkf*`): no aplicarlos.
- Un alumno que abría `compras-workflow` antes de configurar veía su progreso mal migrado: existe `compras-workflow-config` vacío para eso (`progress.ts`).

## Sin verificar
Retroceder una autorización real; Denegar, Retornar y Designar; que `public` limite a alguien en un entorno real; que el workflow salte al validar desde una ficha de pedido completa (la de la demo es genérica); el efecto de la casilla «Manual»; la lógica de `gcompedh` (diccionario `wic_iges`, no accesible). No existen bloqueos estándar 30180/30190 ni `cerrcode` > 25000 en Next; Ventas/Logística › Maestros › Documentos › Bloqueos/Autorizaciones (`cerrauth`) da página de error.

## Fuentes y References
`app/src/content/compras.json` (ids `compras-workflow-config` y `compras-workflow`, secciones `-menu`, `-rol`, `-circuito`, `-validacion`, `-grupo`, `-tipologia`, `-prueba`, `-autorizar`, `-consulta`), `etapas.ts`, `video-workflow.ts` (serie `tut-workflow`, 3 capítulos, release `video-workflow-v1`), `auditoria/revision_senior_ventas_workflow.md` y `revision_junior_ventas_workflow.md`, y las notas de la sesión de comprobación (`nueva/workflow/NOTAS_WORKFLOW.md`, copia en `references/`). Detalle en `references/notas_workflow.md` (rutas de menú, objetos, datos creados en la demo e índice de capturas).
