> Copia saneada de `nueva/workflow/NOTAS_WORKFLOW.md` (usuarios sustituidos por `<usuario>`). Capturas originales fuera del plugin.

# Workflow de aprobación de pedidos de compra en Axional VNext (demo `tutorial`)

Comprobado en https://nextdemo.geasa.eu, base `tutorial`, el 25-11-2026, con el usuario de la sesión `<usuario>`. Capturas 3840×2160 en `nueva/workflow/hd/` del repo. Los rects son CSS 1920×1080 `[x, y, ancho, alto]`.

Resumen: **funciona**. En Next ya no hay `cerrcode` / `cwkftiph` / `cwkftipl` / `cwkfgrup` / `cwkfgest` (sus URL dan 404). El modelo nuevo es: **validación** (código JS que dice si un documento se bloquea) → **grupo de validaciones** → **circuito de workflow** (diagrama Inicio → tarea de usuario con rol → Fin) → **tipología del pedido** con el campo «Grupo validación». El pedido de prueba 0PWCP0001 quedó **Bloqueado**, se autorizó con el botón **Autorizar** de «Acciones pendientes» y pasó a **Validado**.

## (a) Qué es cada pieza, en lenguaje llano

| Pieza | Qué es | Objeto | Equivale en el ERP antiguo |
|---|---|---|---|
| Maestro de validaciones | Catálogo de comprobaciones ya programadas (51 en la demo, más algunas 40xx). Cada una es una clase JS que devuelve «sí, bloquear» o «no». Ejemplo: 36 «REFERENCIA DE TERCERO NO INFORMADA» bloquea si el documento no tiene referencia del proveedor. | `cworkflow_val_prog` | Código de bloqueo `cerrcode` + comprobación programada (INCLUDE XSQL) |
| Grupo de validaciones | Paquete de comprobaciones que se aplica a una tabla (aquí, Pedidos de compras). | `cworkflow_val` | Tipo de workflow `cwkftiph` |
| Validaciones por grupo | Cada línea del grupo: fase, validación, qué bloquea (Validación / Contabilización / Impresión), «Manual» y el circuito de workflow que decide quién autoriza. | `cworkflow_val_item` | Subpestaña «Bloqueos» `cwkftipl` |
| Rol de workflow + usuarios por rol | Quién puede autorizar. | `cworkflow_role`, `cworkflow_role_user` | Grupo de gestores `cwkfgrup` / autorizantes |
| Circuito de workflow | Diagrama del recorrido: etapas (Inicio, Usuario, Decisión, Proceso, Temporizador, Fin) y conectores entre ellas. Una etapa «Usuario» con un rol se queda pendiente hasta que alguien de ese rol la autoriza. Al llegar a «Fin», la validación queda autorizada. | `cworkflow_code`, `cworkflow_code_box`, `cworkflow_code_ref` | Acción y estado final de `cwkftipl` |
| Tipología del pedido | Campo «Grupo validación» (`gcompedd.tipwkf`): enlaza el tipo de pedido con su grupo de validaciones. | `gcompedd` | Tipo de workflow en la tipología |
| Traza / Evaluación / Token | Lo que pasa en cada pedido: la validación pendiente (P) o autorizada (A), el recorrido del circuito y cada paso pendiente o ejecutado. | `cworkflow_val_log`, `cworkflow_run`, `cworkflow_token` | — |

Funcionamiento comprobado en el código del motor (diccionario `wic_icon`, MCP de diccionario Axional de solo lectura, que es el mismo diccionario que usa el menú de la demo: atributo `dict="wic_icon"`): módulo JS `workflowRule` y función `cworkflowEngine`. Al validar el pedido, el motor ejecuta cada validación del grupo. Si una bloquea, crea una traza «Pendiente» y el pedido queda **Bloqueado**. Si esa validación tiene circuito, crea la evaluación y el token de la etapa Usuario. Cuando el usuario autoriza, el motor llega a «Fin», pasa la traza a «Autorizado», da la evaluación por «Finalizada» y el pedido queda **Validado**. La lógica propia de `gcompedh` vive en el diccionario `wic_iges`, que el MCP no alcanza.

## (b) Pasos de configuración, en orden

Rutas de menú literales (árbol de la izquierda):

| Pantalla | Ruta | Objeto |
|---|---|---|
| Maestro de validaciones | Finanzas › Maestros › Validaciones › Maestro de validaciones | `cworkflow_val_prog` |
| Grupo de validaciones | Finanzas › Maestros › Validaciones › Grupo de validaciones | `cworkflow_val` |
| Validaciones por grupo | Finanzas › Maestros › Validaciones › Validaciones por grupo | `cworkflow_val_item` |
| Traza de validaciones | Finanzas › Maestros › Validaciones › Traza de validaciones | `cworkflow_val_log` |
| Diseño de workflow | Finanzas › Maestros › Acciones y workflow › Diseño de workflow | `cworkflow_design` |
| Usuarios por roles | Finanzas › Maestros › Acciones y workflow › Usuarios por roles | `cworkflow_role_user` (lista sin botón Nuevo: se asignan desde el rol) |
| Flujogramas de evaluaciones | Finanzas › Maestros › Acciones y workflow › Flujogramas de evaluaciones | `cworkflow_flowchart` |
| Circuitos / Actividades / Conectores / Roles | Finanzas › Maestros › Acciones y workflow › Definiciones › Circuitos de workflow · Actividades de workflow · Conectores de workflow · Roles de workflow | `cworkflow_code` · `cworkflow_code_box` · `cworkflow_code_ref` · `cworkflow_role` |
| Substituciones / Evaluación / Token | … › Definiciones › Substituciones por role · Evaluación de WKF · Token por hito o acción | `cworkflow_role_bis` · `cworkflow_run` · `cworkflow_token` |
| Tipología de pedido | Gestión › Compras › Maestros › Documentos › Pedidos | `gcompedd` |
| Work Flow de pedidos | Gestión › Compras › Pedidos › Work Flow › Gestionar · Autorizar · Retroceder · Pendientes de autorizar · Pendientes de autorizar detalle | `gcompedh_vtabsel_workflow` · `gcompedh_awk` · `gcompedh_rwk` · `gcompedh_wkf_penaut` · `gcompedl_wkf_penaut` |
| Revalidación | Gestión › Compras › Pedidos › Procesos › Revalidación | `gcompedh_valida_n` |

Hay el mismo bloque «Work Flow» en Ofertas, Solicitudes, Acuerdos, Planes de recepción, Albaranes y Facturas de compras, y en Ventas.

**Paso 1. Elegir la validación** (no se crea nada). Maestro de validaciones › Ejecutar consulta. Usamos **36 · REFERENCIA DE TERCERO NO INFORMADA** (Modo validación «Documento», tablas `gcomofeh gcomacuh gcompedh …`; código `return !data.refter`). No existe una validación genérica de «autorización siempre»: para eso habría que programar una clase nueva en este maestro.

**Paso 2. Grupo de validaciones.** Grupo de validaciones › **Añadir grupo**:
- Código validación · código del grupo · `GCP`
- Descripción validación · nombre · `WORKFLOW PEDIDOS COMPRA CP (prueba)`
- Nombre tabla · tabla del documento · `Pedidos de compras`
- Información adicional · nota libre
- **Guardar** → «Éxito».

**Paso 3. Validación del grupo.** Abrir GCP › bloque «Validaciones por grupo» › **Añadir detalle**:
- Definición fase · orden · `1`
- Validación · `36` (REFERENCIA DE TERCERO NO INFORMADA). «Modo validación» lo rellena el sistema (Documento).
- Manual · casilla · marcada
- Bloqueo · qué se bloquea si no pasa · `Validación` (opciones: Validación, Contabilización, Impresión)
- Código workflow · circuito que decide la autorización · `WFCP` (se añadió en el paso 7; sin circuito el pedido se bloquea, pero no hay botón para autorizarlo)
- **Guardar**.

**Paso 4. Rol.** Roles de workflow › **Añadir rol**: Código de rol `RCP`, Descripción de rol `APROBADOR PEDIDOS CP` (máximo 20 caracteres), Información libre › **Guardar**. Dentro del rol, bloque «Roles de usuario / Asignación de roles» › **Nuevo**: Código usuario. **El usuario de la sesión no aparece en el desplegable** (solo salen otros dos usuarios de la demo y `public`), así que se asignó **`public` (Usuario público)**. Con eso, el usuario de la sesión pudo autorizar.

**Paso 5. Circuito.** Circuitos de workflow › **Añadir circuito**: Código workflow `WFCP`, Descripción workflow `APROBACION PEDIDOS COMPRA CP` › **Guardar**. Pestaña «Etapas wkf» › **Añadir etapa**, tres veces:
1. Tipo actividad `Inicio`, Descripción actividad `INICIO` (ID acción 1)
2. Tipo actividad `Usuario`, Descripción `APROBAR PEDIDO`, Perfil o roles asignados `APROBADOR PEDIDOS CP` (ID 2)
3. Tipo actividad `Fin`, Descripción `FIN` (ID 3)

Pestaña «Conectores wkf» › **Añadir conector**, dos veces: Origen `INICIO` → Destino `APROBAR PEDIDO`, y Origen `APROBAR PEDIDO` → Destino `FIN` (Condición vacía). El diagrama se ve en Diseño de workflow (w23b).

**Paso 6. Tipología de pedido.** Gestión › Compras › Maestros › Documentos › Pedidos › **Nuevo**. **No hay «Nuevo como»** en Next (ni en ⋮, ni en el menú contextual de la fila, ni en la ficha), así que se creó desde cero con los campos obligatorios de PC:
- Tipo pedido `PWCP` · Descripción `PEDIDO COMPRA CON WORKFLOW (prueba CP)` · Serie `PC` · Tipo `Normal` · Estado `Activo` · Relación proveedor `Proveedores` (PRO) · Stock planificado `No`
- **Grupo validación** (`tipwkf`, sección Datos generales) · `GCP`
- **Guardar**. En la ficha hay además las secciones «Validaciones workflow» y «Circuito worflow» (así, con la errata), vacías en PC.

**Paso 7.** Volver a Validaciones por grupo y poner Código workflow `WFCP` en la línea de GCP (w24).

## (c) Prueba con datos reales

1. **Pedido** (Gestión › Compras › Pedidos › Pedidos › Nuevo; ficha genérica): id **18**, Pedido **0PWCP0001** (número tecleado), Tipo documento PWCP, Empresa 0, Delegación CENTRAL, Departamento COMPRAS, Fecha 25-11-2026, Proveedor 00010 Rodamientos del Norte, S.L., Divisa EUR, Tipo efecto EF, Forma pago 30D, Zonas ESCO, Portes Debidos, Almacén 0, Modificar Sí, entrega del 25-11-2026 al 31-12-2026, **Referencia vacía** (eso es lo que dispara la validación 36).
2. **Línea** por Gestión › Compras › Pedidos › Líneas de pedidos › ⋮ › Importar (CSV, delimitador «;»): `18;1;1;13500620;0;0;10;UNI;10;UNI;4;40;0;0` → «1 row(s) inserted». 10 × 13500620 6000-2RS ISB a 4,00 = 40,00.
3. **Guardar la ficha no lanza el workflow** (ni al crear el pedido, ni al importar la línea, ni al cambiar Estado a mano). Lo lanza **Procesos › Revalidación** (`gcompedh_valida_n`) con filtro Pedido = 0PWCP0001, **con el pedido en Provisional**. Con el pedido en Validado, el proceso no devolvía nada.
4. **Bloqueo**: Revalidación → «Pedido validado … Bloqueado», importe 40,00. Ficha del pedido: **Estado Bloqueado, Bloqueos V, Validaciones 1**. Traza: validación 36, Estado **Pendiente**, tabla gcompedh.
5. **Autorizar (gcompedh_awk)** lista el pedido (consulta: traza en P, `estcab='E'`), pero es un **informe sin botón de autorizar**.
6. Con el circuito WFCP ya puesto en la validación, otra Revalidación (pedido aún Bloqueado) crea la **evaluación 1** (WFCP, Pendiente) y el **token 1** (INICIO → APROBAR PEDIDO, Pendiente, rol APROBADOR PEDIDOS CP).
7. **Gestionar** (`gcompedh_vtabsel_workflow`), Pedido 0PWCP0001 › Ejecutar consulta › marcar el pedido en «Pedidos con autorizaciones pendientes» › en «Pendientes» sale la línea APROBAR PEDIDO / WFCP / APROBADOR PEDIDOS CP / Pendiente › enlace «1» del número de fila › se abre **ACCIONES PENDIENTES** (`gcompedh_wkf_run_pending`, `is_authorizable = 1`) con los botones **Denegar · Autorizar · Retornar · Designar** › **Autorizar** › diálogo «Respuesta usuario» (`Aprobado en prueba del curso`) › **Aceptar**.
8. **Resultado**: pedido **Validado**, Bloqueos vacío, Validaciones 0. Traza **Autorizado**. Evaluación **Finalizado**. Token **Ejecutado**, Respuesta usuario «Aprobado en prueba del curso», Usuario efectivo `<usuario>`. No hizo falta otra revalidación.
9. **Retroceder** (`gcompedh_rwk`, Fecha 25-11-2026, Pedido 0PWCP0001) lista el pedido: Validado, REFERENCIA DE TERCERO NO INFORMADA, APROBACION PEDIDOS COMPRA CP, 40,00. Es un **informe sin acción**: no se pudo deshacer la autorización desde ahí.

## (d) Qué NO se pudo comprobar y por qué

- **Retroceder una autorización**: el informe «Retroceder» solo lista. La acción «Retornar» de Acciones pendientes solo está en tokens pendientes, y «Pedidos con acciones realizadas» de Gestionar salió vacío para 0PWCP0001. Sin comprobar.
- **Denegar / Retornar / Designar**: no se probaron.
- **Asignar como autorizante al usuario <usuario> con su nombre**: no está en el desplegable de usuarios del rol. Se usó `public`, sin comprobar si limita a alguien en un entorno real.
- **Que el workflow salte al validar desde la ficha**: la ficha de `gcompedh` en la demo es genérica (título «Failed to parse the expression [${Pedidos compras}]», sin botón Validar). Solo se lanzó con Procesos › Revalidación. Sin comprobar en una ficha real.
- **«Nuevo como»** de tipologías: no existe en la interfaz de Next de la demo.
- **Casilla «Manual»** de la validación: no se comprobó su efecto (el código de `workflowRule` no la usa; la autorización la hace el circuito).
- **Bloqueos estándar 30180/30190 y códigos `cerrcode` > 25000**: no existen en Next (404). El equivalente son los números de validación del Maestro de validaciones.
- **Gestión › Ventas/Logística › Maestros › Documentos › Bloqueos/Autorizaciones** (`cerrauth`): da página de error.
- La lógica de `gcompedh` (diccionario `wic_iges`) no se pudo leer: el MCP solo llega a `wic_icon`.
- Antes de esta prueba no había **ningún workflow configurado en la demo**: grupos, circuitos, roles, evaluaciones y trazas estaban vacíos, y ninguna tipología de pedido tenía «Grupo validación».

## (e) Índice de capturas (orden de recorrido)

| Fichero | Qué muestra | Rects CSS 1920×1080 |
|---|---|---|
| w01_maestro_validaciones | Maestro de validaciones con la fila 36 «REFERENCIA DE TERCERO NO INFORMADA»; menú Finanzas › Maestros › Validaciones abierto | Fila 36 [248,558,1690,26] · menú «Maestro de validaciones» [100,486,128,21] |
| w02_grupo_validacion_alta | Alta del grupo GCP (diálogo) | Diálogo [641,278,638,525] · Código [658,404,196,44] · Nombre tabla [862,470,400,44] |
| w03_grupo_validacion_lista | Lista de grupos con GCP | Fila [255,156,1650,26] |
| w04_validacion_por_grupo_alta | Diálogo «Detalle de validaciones por grupo»: fase 1, validación 36, Manual, Bloqueo Validación | Diálogo [461,300,998,481] · Validación [672,447,186,44] · Bloqueo [478,513,381,44] · Código workflow [867,513,381,44] |
| w05_grupo_con_validacion | Ficha GCP con la línea 1 / 36 | Fila [255,517,1610,26] |
| w06_tipologia_PWCP_grupo_validacion | Alta de la tipología PWCP con «Grupo validación» = GCP | Grupo validación [43,515,1828,44] |
| w07_pedido_PWCP_alta | Alta del pedido 0PWCP0001 | Tipo documento [792,118,161,44] · Pedido [961,184,161,44] · Proveedor [1130,184,161,44] · Estado [623,316,161,44] · Referencia (vacía) [961,581,161,44] |
| w11_lineas_importar_ok | Importar CSV de líneas: «1 row(s) inserted» | — |
| w12_gestionar_workflow_vacio | Gestionar, todavía sin pendientes (antes del circuito) | — |
| w08_revalidacion_qbe | Revalidación con Pedido = 0PWCP0001 | Pedido [1226,398,240,54] |
| w09_revalidacion_confirmar | «¿Está seguro de ejecutar el proceso?» | Aceptar [1126,608,68,22] |
| w10_revalidacion_resultado | Resultado: «Pedido validado … Bloqueado 40,00» | Fila [249,145,1918,21] |
| w16_pedido_bloqueado | Ficha: Estado Bloqueado, Bloqueos V, Validaciones 1 | Estado [265,380,390,44] · Bloqueos [663,380,390,44] · Validaciones [1458,380,390,44] · Referencia [1061,645,390,44] |
| w15_traza_validaciones_P | Traza: validación 36, Estado Pendiente, sin workflow | Validación [265,182,525,44] · Código workflow [798,182,525,44] · Estado [1330,182,525,44] |
| w13_autorizar_qbe | Autorizar: consulta con Fecha pedido 25-11-2026 | Fecha pedido [674,460,240,54] |
| w14_autorizar_resultado | Autorizar: el pedido sale, pero sin botón | Fila [249,144,1661,21] |
| w17_rol_alta | Alta del rol RCP | — |
| w18_rol_usuario_public | Asignación del usuario `public` al rol | Código usuario [658,480,298,44] |
| w19_circuito_alta | Alta del circuito WFCP | Código workflow [658,437,145,44] · Descripción [811,437,451,44] |
| w20_circuito_etapas | Etapas 1 Inicio, 2 Usuario (RCP), 3 Fin | Lista [255,410,1600,90] |
| w21_etapa_usuario_rol | Etapa «Usuario» APROBAR PEDIDO con rol APROBADOR PEDIDOS CP | Tipo actividad [502,202,910,44] · Perfil o roles [502,334,910,44] |
| w22_conector_alta | Conector INICIO → APROBAR PEDIDO | Origen [578,627,362,44] · Destino [974,627,362,44] |
| w23_circuito_conectores | Conectores 1 y 2 | — |
| w23b_diseno_workflow | Diseño de workflow WFCP: nodos, conectores y diagrama Start → APROBAR PEDIDO → FIN | Diagrama [1365,130,540,550] · Nodos [255,270,1095,225] · Conectores [255,505,1095,175] |
| w24_validacion_con_workflow | Línea de GCP con Código workflow = APROBACION PEDIDOS COMPRA CP | Código workflow [901,248,628,44] |
| w25_revalidacion_con_workflow | Revalidación otra vez (sigue Bloqueado; arranca el circuito) | Fila [249,145,1918,21] |
| w26_evaluacion_wkf_token_pendiente | Evaluación WFCP Pendiente con token INICIO → APROBAR PEDIDO Pendiente | Token [255,635,1610,26] |
| w27_gestionar_pendiente | Gestionar: pedido marcado y línea «APROBAR PEDIDO … Pendiente» | Pedido [255,291,1650,24] · Pendiente [255,489,1650,24] · enlace «1» [262,495,10,20] |
| w28_acciones_pendientes_autorizar | Acciones pendientes con Denegar / Autorizar / Retornar / Designar | Autorizar [1619,73,77,22] · Denegar [1540,73,71,22] · Estado [265,314,402,44] · is_authorizable [675,314,402,44] |
| w29_autorizar_dialogo | Diálogo Autorizar con «Respuesta usuario» | Diálogo [710,436,500,209] · Aceptar [1126,607,68,22] |
| w30_autorizado_resultado | Pantalla tras Aceptar (sin mensaje visible) | — |
| w31_pedido_validado | Ficha: Estado Validado, Bloqueos vacío, Validaciones 0 | Estado [265,380,390,44] · Bloqueos [663,380,390,44] · Validaciones [1458,380,390,44] |
| w32_traza_autorizado | Traza: Estado Autorizado, workflow WFCP | Estado [1330,182,525,44] |
| w33_evaluacion_finalizada | Evaluación Finalizado; token Ejecutado por <usuario> | Token [255,635,1610,26] |
| w34_retroceder_qbe | Retroceder: consulta Fecha + Pedido | Fecha [674,398,240,54] · Pedido [950,398,240,54] |
| w35_retroceder_lista | Retroceder: lista el pedido, sin acción | Fila [249,145,1661,21] |

Los rects marcados como fila o lista se estimaron desde la captura (±5 px). Los de campos salen de `fields`/`rect`.

## (f) Datos creados en la demo `tutorial` (todos de prueba, borrables)

| Dónde | Código / id | Detalle |
|---|---|---|
| `cworkflow_val` | GCP | WORKFLOW PEDIDOS COMPRA CP (prueba), tabla Pedidos de compras |
| `cworkflow_val_item` | GCP / fase 1 | Validación 36, Bloqueo V, Manual sí, workflow WFCP |
| `cworkflow_role` | RCP | APROBADOR PEDIDOS CP |
| `cworkflow_role_user` | RCP / public | Id usuario 2 |
| `cworkflow_code` | WFCP | APROBACION PEDIDOS COMPRA CP |
| `cworkflow_code_box` | 1, 2, 3 | INICIO (Inicio), APROBAR PEDIDO (Usuario, RCP), FIN (Fin) |
| `cworkflow_code_ref` | 1, 2 | INICIO→APROBAR PEDIDO, APROBAR PEDIDO→FIN |
| `gcompedd` | PWCP | PEDIDO COMPRA CON WORKFLOW (prueba CP), serie PC, Grupo validación GCP |
| `gcompedh` | id 18 · 0PWCP0001 | Proveedor 00010, empresa 0, 40,00 €, ahora Validado |
| `gcompedl` | cabid 18, línea 1 | 10 × 13500620 a 4,00 |
| `cworkflow_val_log` | 1 | Pedido 18, validación 36, Autorizado |
| `cworkflow_run` | 1 | WFCP, Finalizado |
| `cworkflow_token` | 1 | INICIO→APROBAR PEDIDO, Ejecutado, <usuario> |

No se tocó ninguna tipología ni dato de la demo que no fuera nuestro. El intento de teclear en el campo «Grupo validación» de PC no se guardó (se recargó sin guardar). 
