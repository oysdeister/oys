# Trampas conocidas de la demo (nextdemo, base tutorial)

Fuentes: `nueva/notas_circuito.md`, `nueva/circuito_creado.md`, `nueva/diferencias.md`, `nueva/ventas/NOTAS_VENTAS.md`, `nueva/workflow/NOTAS_WORKFLOW.md` (worktree wizardly-jepsen), `nueva/fin/ESTADO.md` (worktree optimistic-blackwell), `app/src/content/*.json` (problemas de cada bloque) y notas de las sesiones de captura. Todo lo de aquí está observado en la demo, salvo lo marcado «(sin verificar)».

## Índice
- Sesión y navegador
- Ventanas y pantallas
- Datos y maestros
- Documentos y contabilización
- Importar líneas (CSV)
- Qué no existe en la demo

## Sesión y navegador
| Síntoma | Causa | Qué hacer |
|---|---|---|
| Captura con login o peticiones 302/303 | Sesión caducada | Parar y pedir al usuario que inicie sesión (nunca teclear la contraseña). |
| Desplegable o diálogo vacío en la captura | Pestaña sin foco o oculta | `bringToFront`, repetir. |
| Dos agentes se pisan | Misma pestaña | `TAB=<nombre>` (capturas_erp2.mjs) y no tocar pestañas ajenas. |
| «Failed to parse the expression [${Pedidos compras}]» en la miga | Defecto de la ficha genérica de `gcompedh` | Es de la demo; las líneas van por `gcompedl`. |

## Lecciones de las sesiones (síntoma → causa → regla)
- Desplegables vacíos, clics en la pestaña de otro agente → `erp2.mjs` (esta skill) ignora `TAB=` y coge la última pestaña → usar `plugins/formacion-oys/scripts/capturas_erp2.mjs` (soporta `TAB`) y cerrar la pestaña propia al acabar.
- Obscura (navegador headless compartido): la pestaña activa es global → lecturas de pantallas ajenas, `ref` invalidados. Regla: `browser_tab_new` + `browser_tab_switch` a la propia antes de cada acción, no tocar cookies ni pestañas ajenas, sin escrituras si hay riesgo. No sube ficheros (no sirve para Importar CSV), no abre `localhost` (usar Chrome headless por CDP) y no pinta rejillas anchas; un registro único se lee por URL `…/list/1?q=`.
- `javascript_tool` del navegador integrado: cada uso pide aprobación → usar `curl -I`, puppeteer desde Bash u obscura.
- Teclado: «FVFPVD» en lugar de «FPVD», Meta+A no selecciona, doble clic cierra el desplegable → teclear el código, esperar la lista y elegir la fila (`pick`/`kb_pick.mjs`); poner tope de unos 3 s por clic.
- «Tipo efecto» (y otros) sale «Datos no disponibles» → no carga hasta teclear letras del código → teclear primero.
- Números de documento (0AV000001, 0FC000001…) que no coinciden con los del alumno → la demo es compartida → los números del curso son orientativos; el pedido se teclea con iniciales (`0PC{INI}01`); solo escribir registros propios y «Nuevo como» para no tocar ajenos.
- Errores visibles del propio ERP («Failed to parse the expression […]», «ELResolver no manejó el tipo: null») → fallos de la demo, no del alumno → explicarlos como tales.
- Metadatos: la demo publica menú y pantallas por REST; para agentes, scripts que guardan JSON/capturas en disco y devuelven un resumen gastan menos contexto que leer páginas enteras.

## Ventanas y pantallas
- Altas en **ventana emergente** (modal): hay que guardar dentro de la ventana; «Cancelar» no graba.
- La ventana del **asiento** tras «Contabilizar» solo carga la primera vez; al repetir «Contabilizar» → «Aceptar» se abre. La lista de albaranes queda en caché: recargar.
- «Prevista» (casilla) se marca con el `input`, no con el texto de la etiqueta.
- Pantallas de solo consulta sin botón de alta: «Artículos por proveedores» (alta desde la ficha del proveedor, pestaña Artículos por proveedor), «Municipios y Poblaciones» (alta desde la ficha del país), «Cuentas contables» abre en modo consulta.
- Desplegable de **Familia** (artículo) sin opciones: teclear el código exacto (`01.01.001352`) y Tab.
- En la fila editable de Relaciones del tercero no sale el Plan contable: usar «Añadir relación».
- Tras guardar, el registro no sale en la primera página de la rejilla (~25 filas): Filtros › Descripción.
- Cualquier cambio en las pestañas de un tercero lo devuelve a Provisional: «Validar» otra vez.

## Datos y maestros
- Descuentos 1/2/3 y % pronto pago del proveedor/cliente vacíos → al contabilizar «Cannot invoke "Object.toString()" because "n" is null»: ponerlos a 0 (y en la factura, «Pasar a provisional» y cambiarlos).
- Tercero sin relación contable PRO → «Cuenta tercero [T…] no existente para relación: [PRO]».
- Tipo de efecto TF sin cuenta bancaria del tercero → «DOMICILIACIÓN BANCARIA NO INFORMADA»; en ventas, «DOMICILIACION BANCARIA DE LA EMPRESA NO ENCONTRADA.»
- Artículo de tipo contable Ventas (casi todos los de la demo) → «… tipcon [VEN] cuenta no definida» en compras. El 13500620 es PRODUCTO.
- Banco sin IBAN o IBAN sin banco → «restricciones de verificación fallaron: Entidad y cuenta bancaria, ambos nulos o no nulos».
- Central de pagos/compras sin su proveedor (o al revés) → error de restricciones de verificación: guardar sin centrales y completarlas después.
- Plazo de pago con solo dos vencimientos: poner 0 en 3.º y 4.º plazo y sus %.
- Almacén sin Delegación ni Departamento → «Delegación y departamento no informados para el almacén» al registrar un movimiento.
- Serie MOV sin máscara → «gsernumh_getserie: Sin máscara. Tab.[geanmovh] Cod.[MOV]»: teclear el número del movimiento a mano.
- Cuenta financiera: «Agrupación cuentas» obligatoria; si la lista sale vacía hay que crear antes la agrupación (Finanzas › Tesorería › Maestros › Agrupaciones).
- Mandato SEPA: en la demo no se llega a guardar (error 15486).

## Documentos y contabilización
- El numerador de documentos (`gsernumh`) no se aplica en el alta de pedidos desde el modal: el número se teclea.
- «Generar albaranes» no devuelve pedidos si `gcompedd.comalb` está vacío; la empresa DIS no puede hacer albaranes (almacén de otra empresa); el precio no se rellena desde la tarifa en el diálogo de la línea (sí aparece al guardar, en ventas).
- Conformar solo existe en algunas tipologías de factura (FCCL sí; FC/FCOA no).
- En ventas la 1.ª vez que se pulsa «Contabilizar» puede cargar solo «Process gconasih_InsertCasientos» sin contabilizar: repetir.
- «Evolucionar estado» desde la ficha del efecto falla en la demo (`emi_repres_nif`): enseñar el pago con la gestión masiva.

## Importar líneas (CSV)
Gestión › Compras › Pedidos › «Líneas de pedidos» (`gcompedl`) › ⋮ › Importar: CSV con delimitador «;», cabecera con nombres físicos (`cabid;linrel;orden;codart;varlog;numlot;canped;udmcom;canpre;udmpre;precio;impnet;canser;dtoimp`), `cabid` = identificador del pedido, unidad `UNI`, `dtoimp` 0 (si no, error 26865). Resultado esperado: «1 row(s) inserted». Para subir el fichero con puppeteer: `up_csv.mjs`.

## Qué no existe en la demo
Tarifas del modelo clásico (`gcomtarh`, `gcomtarc`, `gventarh`: ID 19401), CRC. El control lo cubren «Datos de control», bloqueos, tolerancias albarán-factura y `gcomfach_dif_albaran`.
