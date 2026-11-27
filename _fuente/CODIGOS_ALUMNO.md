# Códigos del alumno

Regla: **un código, una cosa**. Si dos bloques necesitan lo mismo, el segundo lo **reutiliza** y lo dice («Usa el tercero T{INI} que creaste en …; no crees otro»). Si son cosas distintas, llevan códigos distintos aunque vivan en tablas distintas.

## Iniciales del alumno: siempre 2 letras

`{INI}` = iniciales del alumno. Son **siempre 2 letras**, nunca 3.

- Cómo se calculan: primera letra del nombre + primera letra del primer apellido. «Laura Martín Ruiz» → **LM**.
- Sin tildes y en mayúsculas: «Óscar Núñez» → ON.
- Si el nombre tiene una sola palabra, se usan sus 2 primeras letras: «Laura» → LA.
- Alumnos que tenían 3 letras guardadas (p. ej. PDJ): la app las pasa a 2 sola, con el nombre si lo conoce (si no, las 2 primeras). Les sale un aviso **una sola vez** con las iniciales de antes y las de ahora. Lo que ya crearon en la demo no cambia; los códigos nuevos llevan las 2 letras.
- Variantes en el ERP de práctica: `{T}` = T + iniciales (TLM) y `{ART}` = ROD + iniciales (RODLM).

Por qué 2: varios campos de código son muy cortos. Con 3 letras, el ERP da «Demasiado largo».

Longitudes máximas comprobadas en el diccionario Axional (campo `codigo` de cada tabla):

| Tabla (pantalla) | Máx. | Nota |
|---|---|---|
| ctipopag (Plazos de pago) | 3 | `P{INI}`, `V{INI}`: justo (3 de 3) |
| ctipoefe (Tipos de efectos) | 3 | `R{INI}`, `E{INI}`: justo (3 de 3) |
| galmctas (Cuentas logísticas) | 4 | `RS{INI}`: justo (4 de 4) |
| gcompedd / gcommovd / gcomfacd y oferta (tipologías de compra) | 4 | `OC{INI}`, `PC{INI}`, `PW{INI}`, `AC{INI}`, `AO{INI}`, `FC{INI}`: justo (4 de 4) |
| gvenofed / gvenpedd / gvenmovd / gvenfacd (tipologías de venta) | 4 | `PD{INI}`, `PV{INI}`, `AP{INI}`, `FP{INI}`: justo (4 de 4). `O{INI}`, `A{INI}`: 3 |
| cdiarios (Diarios) | 2 | `{INI}`: justo (2 de 2) |
| Empresa (código de la sociedad) | 4 | `S{INI}`: 3 |
| Flujo financiero / grupo auxiliar | 6 | `{INI}COM`, `{INI}EMP`: 5 |
| Cuenta financiera (bancos y cajas) | 10 | `BBVA_{INI}`, `CAJA_{INI}`, `CAIXA{INI}`: 7; `{INI}CAJA`: 6 |
| gven_pricelist / gven_pricegroup (lista y grupo de precios de venta) | 12 | `LV{INI}`, `GV{INI}` (comprobado en el diálogo: contador «/ 12») |
| ctercero, galmacen, tagrupac | 12 | |
| garticul, carticul (artículos) | 16 | |

Con 2 iniciales **todos los códigos caben**. Muchos quedan justos: plazos y tipos de efecto (3), tipologías de compra y de venta (4), cuenta logística `RS{INI}` (4), diario `{INI}` (2) y la descripción del rol «APROBADOR PEDIDOS {INI}» (20). Por eso no se admiten 3 letras.

Otros textos con límite: la descripción del rol de workflow admite 20 caracteres («APROBADOR PEDIDOS » ocupa 18 + 2 iniciales = 20). El código postal de prueba `08{INI}1` tiene 5 caracteres, como un CP real.

Glosarios: `glosario/maestros.json` y `glosario/compras.json` ya usan estos códigos. En la plataforma, el artículo que se compra es siempre el 13500620 (también en el ERP simulado: prácticas «Pedido › albarán › factura» y «Entregas parciales»).

## Maestros y Compras (cerrado)

| Código | Qué es | Dónde se crea | Dónde se reutiliza |
|---|---|---|---|
| `C{INI}` | Tercero **cliente** «Cliente Maestros {INI}» (antes `{INI}1`) (NIF de prueba B12345674, categoría 001) | Maestros › maestros-1 «Terceros» | maestros-1 (perfil contable 43000.00901), maestros-2 (cliente y comercial en Gestión, condiciones de cobro), Ventas (cliente del caso) |
| `FOR{INI}` | Artículo financiero «Servicios de formacion {INI}» (antes `{INI}`) | maestros-1 «Artículos financieros» | — |
| `P{INI}` | Plazo de pago 30/60 días (50 % / 50 %) «2 Vtos. 30 y 60 dias {INI}» (antes `{INI}1`) | maestros-1 «Plazos de pago» | maestros-2 (condición de cobro de C{INI}). Ventas pasó su pedido a `PV{INI}` y Cartera usa `V{INI}` para su plazo 40/80/120 |
| `R{INI}` | Tipo de efecto **a cobrar** «Recibo domiciliado {INI}» (antes `{INI}`) | maestros-1 «Tipos de efectos» | maestros-2 (condición de cobro de C{INI}) |
| `43000.00901` | Subcuenta de cliente de C{INI} (si existe, la siguiente libre) | maestros-1 «Cuentas contables» | maestros-1 «Perfil contable» |
| `{INI}CAJA` | Cuenta financiera de caja (57000.00000) | maestros-1 «Bancos y cajas» | — |
| `AG{INI}` | Agrupación de tesorería «Cajas Maestros {INI}» (antes `{INI}`) | maestros-1 «Bancos y cajas» | maestros-v-4 (banco CAIXA{INI}), Cartera (BBVA_{INI}, CAJA_{INI}) |
| `08{INI}1` | Código postal / municipio de prueba | maestros-1 «Municipios» | — |
| `ROD{INI}` | Artículo logístico «RODAMIENTO MAESTROS {INI}» (antes `{INI}0001`, chocaba con el código auxiliar de Contabilidad; para aprender la ficha, **no se compra**) | maestros-2 «Artículos logísticos» | maestros-2 (artículo del proveedor 00001, REF-{INI}-6000), maestros-3 (movimiento, stock, kardex); ERP simulado práctica «Crea y activa tu artículo» |
| `ALM{INI}` | Almacén «Almacen Maestros {INI}» (antes `{INI}1`) | maestros-2 «Almacenes» | maestros-3 |
| `RS{INI}` | Cuenta logística «Stock reservado Maestros {INI}» (antes `{INI}1`) | maestros-2 «Cuentas logísticas» | — |
| `{INI}000001` | Número del movimiento interno RIDP (a mano) | maestros-3 | maestros-3 (kardex) |
| `TS{INI}` | Tercero **de la empresa** S{INI} «Empresa prácticas {INI}» (NIF de prueba B76543214, sin relaciones contables). No es cliente ni proveedor | maestros-v-4 «Crear el tercero de tu empresa» | maestros-v-4 (identificación social de S{INI}) |
| `S{INI}` | Empresa «Empresa prácticas {INI}» | maestros-v-4 | — |
| `CAIXA{INI}` | Banco propio de la empresa S{INI} | maestros-v-4 | — |
| `T{INI}` | Tercero **proveedor** «Tercero {INI}» (No censado, Id. 0, categoría 002) y su ficha de proveedor | Compras › compras-1 «Tercero» y «Proveedor» | compras-2, compras-3, Ventas **no** (su cliente es C{INI}), Cartera: solo para **pagar su efecto de 151,25** con la remesa PSCTT (icon-cartera-v-5/-v-6, operación 7 del caso), sin tocar sus condiciones ni su IBAN de Compras; el resto de Cartera usa CAR{INI}. ERP simulado (prácticas de compras y pago) |
| `TF{INI}` | Lista de precios de compra (tarifa) | compras-precios | compras-precios (grupo G{INI}) |
| `G{INI}` | Grupo de precios de compra | compras-precios | compras-precios (proveedor T{INI}) |
| `13500620` | Artículo **de la demo** que se compra (6000-2RS ISB, tipo contable PRODUCTO). No se modifica | ya existe | compras-1 (tarifa), compras-2 y compras-3 (oferta, albaranes, factura), Ventas, ERP simulado (pedido › albarán › factura) |
| `AC{INI}` | Tipología de albarán de compra sin origen (antes `A{INI}`, chocaba con la de Ventas). **Ningún bloque la crea ya**: solo aparece en `datosSimulador` (el glosario usa AO{INI}) | — | simulador |
| `FC{INI}` | Tipología de factura de compra | compras-tipos | compras-factura |
| `OC{INI}` | Tipología de oferta de compra | compras-tipos | compras-3 |
| `PC{INI}` | Tipología de pedido de compra | compras-tipos | compras-3, compras-2 |
| `0PC{INI}01` | Número del pedido (a mano, formulario genérico) | compras-3 | compras-3 |
| `AO{INI}` | Tipología de albarán de compra con origen pedido | compras-tipos | compras-2 |
| `GW{INI}` | Grupo de validaciones «WORKFLOW PEDIDOS {INI}» sobre «Pedidos de compras», con la validación 36 | compras-workflow-config «Crear el grupo de validaciones y su línea» | compras-workflow-config (tipología PW{INI}) |
| `RW{INI}` | Rol de workflow «APROBADOR PEDIDOS {INI}» (descripción de 20 caracteres como máximo: 18 + 2 iniciales = 20, justo; asignado al usuario `public`) | compras-workflow-config «Crear el rol que autoriza» | compras-workflow-config (etapa «Usuario» del circuito WF{INI}) |
| `WF{INI}` | Circuito de workflow «APROBACION PEDIDOS {INI}» (Inicio, Usuario con el rol RW{INI}, Fin) | compras-workflow-config «Crear el circuito» | compras-workflow-config (línea del grupo GW{INI}) |
| `PW{INI}` | Tipología de pedido de compra con workflow (serie PC, «Grupo validación» GW{INI}). No sustituye a PC{INI} | compras-workflow-config «Enlazar el grupo a la tipología de pedido» | compras-workflow (pedido de prueba) |
| `0PW{INI}0001` | Número del pedido de prueba con PW{INI} (a mano, formulario genérico); su Identificador pedido lo asigna el ERP y va en el CSV de líneas | compras-workflow «Probar» | compras-workflow (revalidación y autorización) |
| `PROV-{INI}-001` / `-002` | Número de factura del proveedor | compras-2 / compras-3 | Cartera (pago de la factura) |

## Cartera, Ventas, Tesorería, Contabilidad, Impuestos y Activos (cerrado)

Longitudes comprobadas en el diccionario (wic_table_object): `tlinefin.linfin` 12, `tlinetip.codigo` 6, `cdiarios.codigo` **2**, `cjusnumh.mask_code` 6, `cproyect` / `cseccion` 12, `cctaauxl.ctaaux` 14.

### Cartera (carteras.json)

| Código | Qué es | Dónde se crea | Dónde se reutiliza |
|---|---|---|---|
| `V{INI}` | Plazo de pago 40/80/120 días (40/20/40 %) (antes `{INI}1`) | carteras-1 «Plazo de pago» | condición de pago de CAR{INI}, factura CAR-{INI}-001 |
| `E{INI}` | Tipo de efecto **a pagar**, transferencia (antes `T{INI}`, chocaba con el tercero) | carteras-1 «Tipo de efecto» | condición de pago de CAR{INI}, efectos de la factura, ERP simulado (datos de cartera) |
| `CAR{INI}` | Tercero «Tercero Carteras», cliente CLI 43000 y proveedor PRO 40000 (antes `T{INI}`). **No es el proveedor T{INI} de Compras**: lleva otras condiciones (E{INI}+V{INI}, cobro RC/PE/30D) y así no se tocan las de Compras | carteras-1 «Tercero» | carteras-1 (factura de compra), carteras-5 (factura de venta, cobro y remesa) |
| `CAR-{INI}-001` | Número de factura del proveedor CAR{INI} (antes `PROV-{INI}-001`, repetía el de Compras) | carteras-1 | — |
| `B{INI}` | Tercero entidad financiera «BBVA Carteras {INI}» | carteras-3 | banco BBVA_{INI}, caja CAJA_{INI} |
| `BBVA_{INI}` | Banco propio (57200) | carteras-3 | carteras-5, Tesorería (todo), examen práctico |
| `CAJA_{INI}` | Caja de efectivo (57000). Es otra caja, distinta de `{INI}CAJA` de Maestros | carteras-3 | Tesorería (cajas) |
| `AG{INI}` | Agrupación de tesorería **de Maestros**: se reutiliza, no se crea otra (antes Cartera creaba `{INI}`) | Maestros › maestros-1 | BBVA_{INI}, CAJA_{INI} |
| `ASE{INI}` | Artículo financiero «Servicios de asesoría {INI}» (antes `{INI}1`) | carteras-5 | facturas de venta de carteras-5 |
| `LRC{INI}` | Línea financiera «Remesas de cobro {INI}» de BBVA_{INI} (antes `{INI}1`) | carteras-5 | remesas por cuenta |
| `REM{INI}` | Tipo de línea financiera «Remesas cobro {INI}» (antes `{INI}`) | carteras-5 | LRC{INI} |
| `CONTRATO-{INI}-001` | Referencia de la línea financiera | carteras-5 | — |
| `MAN{INI}001` | Referencia del mandato SEPA de **C{INI}** (en la demo no se llega a guardar: error 15486) | cartera-mandato-sepa | — |
| IBAN de prueba `ES9121000418450200051332` | Datos bancarios (domiciliación 0) de T{INI} (Compras) y de **C{INI}** (cartera-mandato-sepa). No es un código, es un dato de prueba | compras-1 / cartera-mandato-sepa | remesa PSCTT de T{INI}, remesa CSDDS del efecto 2 de C{INI} |

Remesas de Cartera: la de **pago** (icon-cartera-v-4 a v-7, carteras-7) es la del caso, con el efecto de 151,25 de **T{INI}** (tipo TF, ya tiene IBAN), PSCTT y BBVA_{INI}, fecha 06-11-2026. La de **cobro** SEPA (cartera-mandato-sepa) es la del caso, con el efecto 2 de 121,00 de **C{INI}** (FP{INI}, tipo R{INI}), CSDDS, línea LRC{INI}, 01-12-2026 y cobro el 14-12-2026. BBVA_{INI} lleva en «Remesas por cuenta» CSCTS, CSDDS (con LRC{INI}) y PSCTT (carteras-5-remesa-banco). carteras-5 sigue con CAR{INI}. El número de remesa (RM…) lo pone el ERP: los de las capturas no son del alumno.

### Ventas (ventas.json)

| Código | Qué es | Dónde se crea | Dónde se reutiliza |
|---|---|---|---|
| `C{INI}` | **El cliente de Ventas**: el tercero cliente de Maestros. Ventas no crea otro: en `ventas-cliente` lo **comprueba y completa** (relación CLI, datos del Maestro de clientes, condición de cobro R{INI} + P{INI} de Maestros sin cambiarla, validación). El proveedor T{INI} de Compras ya no se usa como cliente | Maestros › maestros-1 «Terceros» y maestros-2 «El tercero en Gestión: cliente y condiciones de cobro» | ventas-cliente, ventas-pedido, ventas-1, ventas-2 |
| `PD{INI}` | Tipología de pedido de venta sin origen (copia de PED, serie PV, destino albarán AP{INI}) | ventas-documentos | ventas-pedido |
| `PV{INI}` | Tipología de pedido de venta **desde oferta** (copia de POF, serie PV, origen «Oferta», Sumando, destino albarán AP{INI}) (antes `P{INI}`, chocaba con el plazo de Maestros). Máx. 4: justo con 2 iniciales | ventas-documentos «Crear la tipología de pedido PV{INI}, desde la oferta» | ventas-2 (solo comprueba), examen práctico (lib/examen.ts) |
| `O{INI}` | Tipología de oferta de venta (copia de OV, serie OV, sin origen) | ventas-documentos «Crear la tipología de oferta O{INI}» | ventas-2 (solo comprueba), examen práctico |
| `AP{INI}` | Tipología de albarán de venta desde pedido (copia de AV estándar, serie AV, origen «Pedidos de venta», «Copiar líneas» Sí, Sumando, sin asiento, Tipo factura FP{INI}) | ventas-documentos | ventas-pedido, ventas-2 (sustituye a la antigua `A{INI}2`), examen práctico |
| `A{INI}` | Tipología de albarán de venta **sin origen que contabiliza** (Nuevo › Nuevo en blanco, serie AV, Salida, plantilla AV en los dos asientos, Tipo factura FP{INI}) | ventas-documentos «Crear la tipología de albarán A{INI}, que contabiliza» | ventas-1 (solo comprueba) |
| `FP{INI}` | **Única** tipología de factura de venta (copia de FV, serie FV, origen Expediciones con condición `tipdoc IN ('AP{INI}','A{INI}')`, «Copiar líneas» Sí, Sumando, asiento FACTURA DE VENTAS) | ventas-documentos | ventas-pedido, ventas-1, ventas-2 (sustituye a la antigua `F{INI}`), examen práctico |
| `LV{INI}` | Lista de precios de venta «Tarifa venta {INI}» (13500620 a 20,00; código máx. 12) | ventas-precios «Crear la lista de precios de venta LV{INI}» | ventas-precios (grupo GV{INI}) |
| `GV{INI}` | Grupo de precios de venta «Grupo venta {INI}» (lista LV{INI} en orden 1; código máx. 12) | ventas-precios «Crear el grupo de precios GV{INI}» | ventas-precios (Grupo precio de C{INI}), ventas-pedido (precio propuesto) |

Ventas usa un **único juego** de seis tipologías, todas creadas en Configurar (`ventas-documentos`): O{INI}, PD{INI}, PV{INI}, AP{INI}, A{INI} y FP{INI}. Los bloques de Operar (ventas-pedido, ventas-1, ventas-2) las reutilizan y lo dicen. `A{INI}2` y `F{INI}` ya no existen (la condición `tipdoc` de FP{INI} cubre AP{INI} y A{INI}). Longitud máxima de los códigos de tipología de venta: 4 (con 2 iniciales, PD/PV/AP/FP quedan justos).

### Tesorería (tesoreria.json)

| Código | Qué es | Dónde se crea | Dónde se reutiliza |
|---|---|---|---|
| `BBVA_{INI}`, `CAJA_{INI}` | Los de Cartera (no se crean otros) | carteras-3 | tesoreria-1 a 6 |
| `{INI}COM` | Flujo financiero «Comisión» y su operación financiera de salida (mismo código a propósito: la operación usa ese flujo). Cuenta del flujo: mnemotécnico `{INI}626` | tesoreria-2 | tesoreria-3, 4, 5; «Operación comisión» de `{INI}TRF` |
| `{INI}TRF` | Código de la comisión bancaria «Comisión transferencias {INI}» de BBVA_{INI} (Haber, PMICDT, fija 3,50, desde 01-10-2026, «Operación comisión» {INI}COM). 5 caracteres; **longitud y maestro no comprobados en la demo** (la captura de Deister usaba ADOP) | tesoreria-1-comisiones (se completa al final de tesoreria-2-operacion) | asientos-14, caso final op. 7 |
| IBAN de prueba `ES8101820001310200000001` | Banco ES0182 (BBVA) y cuenta 0182 0001 31 0200000001 de **BBVA_{INI}**, para recibir el N43. Dato de prueba (dígitos de control calculados), igual para todos los alumnos | tesoreria-1-banco (último paso) | fichero `app/public/n43/caso_BBVA_ZZ.n43` |
| Conceptos propios `002`, `004`, `006`, `017` del banco ES0182 | **No son del alumno**: son compartidos por banco (3 caracteres, sin sitio para iniciales). El primero que los necesita los crea; los demás los reutilizan sin cambiarlos | tesoreria-4-n43 (último paso) | tesoreria-4, icon-cartera-v-9/-v-11 |
| `caso_BBVA_{INI}.n43` | Fichero N43 del caso (6 líneas, saldo final 3.077,25), copia de `/n43/caso_BBVA_ZZ.n43` con ZZ cambiado por las iniciales | tesoreria-4-n43 | tesoreria-4-carga |

### Contabilidad general (icon-contabilidad.json)

| Código | Qué es | Dónde se crea | Dónde se reutiliza |
|---|---|---|---|
| `62999.00000` | Cuenta «Gastos varios {INI}» | parametrizacion-1 | parametrizacion-2, 4 |
| `{INI}001` | Mnemotécnico «Gastos de prueba {INI}» → 62999.00000 (5 caracteres) | contab-mnemotecnicos-alta | — (no se usa para comisiones) |
| `{INI}626` | Mnemotécnico «Servicios bancarios {INI}» → **62600.00000** «Servicios bancarios y similares» del plan ES (PGE 2008; existe en TUTORIAL, tipo Costes, sin grupo auxiliar). 5 caracteres, como `{INI}001` | contab-mnemotecnicos-alta (2 pasos al final de «Enlazarlo a una cuenta de un plan»); si no se hizo, tesoreria-2-flujo lo explica | flujo {INI}COM (tesoreria-2), asientos-14, caso final op. 7, 8 y 13 |
| `{INI}EMP` / `{INI}0001` | Grupo auxiliar «Empleados {INI}» / código auxiliar «José Gómez» | parametrizacion-3 | parametrizacion-4 |
| `DIV{INI}` | Proyecto «División 1 {INI}» (antes `{INI}1`) | parametrizacion-5 | parametrizacion-6, asientos |
| `{INI}ADM` | Sección «Administración {INI}» | parametrizacion-6 | proyecto DIV{INI} |
| `{INI}` | Diario «Entrada de asientos {INI}» (el código del diario solo admite 2 caracteres) y su numerador de justificantes «Asientos manuales {INI}» | asientos-1 / asientos-2 | asientos-2 a 13 |
| `{INI}-DOC-001`, `{INI}26-000001` | Documento y justificante de los asientos manuales | asientos-2 | — |

### Impuestos y Activos

Impuestos no crea códigos: el alumno solo lee datos de la demo (empresa 0 en ESCO, proveedor de prueba TCAPC, artículo 13500620 con clave BOG, factura de prueba 0FC000012, reglas 73 y 153) y no cambia ningún tercero. Activos crea el ordenador del alumno, comprobado en la demo con las iniciales de prueba ZZ (bien ZZORD, elemento AF, componente 000003, cuadro 2026-2029 de 300,00).

| Código | Qué es | Dónde se crea | Dónde se reutiliza |
|---|---|---|---|
| `{INI}ORD` | Bien «Ordenador {INI}» (empresa 0, grupo inmovilizado y contable CAP1, grupo fiscal ES7, código fiscal ES72, serie AF). Longitud: 5 caracteres | icon-activos-1 «Crear tu propio ordenador» | icon-activos-2 (valores y cuadro), icon-activos-3 (botones de baja y venta, sin aceptar) |
| `AF` | Elemento «Ordenador portatil {INI}» del bien {INI}ORD: se deja el código que propone el ERP (la serie del bien). Lleva una línea en «Valores de los elementos» (A, Lineal, 25 %, 4 años) | icon-activos-1 «Crear tu propio ordenador» | componente «Portatil {INI}» |
| «Portatil {INI}» | Componente del elemento {INI}ORD AF: el número lo pone el ERP (en la prueba ZZ, 000003). Proveedor de prueba TCAPC, valor 1.200,00, alta e inicio 01-01-2026, valores A + L + 25 % + 4 años | icon-activos-1 «Crear tu propio ordenador» | icon-activos-2, icon-activos-3 |
| `{INI}-ORD-001` | Número de factura del proveedor en la identificación del componente (texto, no crea factura) | icon-activos-1 | — |

## Otros módulos (solo leídos, no editados)

| Código | Módulo | Qué es |
|---|---|---|
| `O{INI}`, `PD{INI}`, `PV{INI}`, `AP{INI}`, `A{INI}`, `FP{INI}`, `LV{INI}`, `GV{INI}` | Ventas | Tipologías y precios de venta (ver tabla de Ventas) |
| `DIV{INI}` | Contabilidad (icon-contabilidad) | Proyecto «División 1 {INI}» |
| `{INI}EMP`, `{INI}0001` | Contabilidad | Grupo auxiliar y código auxiliar «José Gómez» (por eso el artículo de Maestros pasa a ROD{INI}) |
| `{INI}ADM` | Contabilidad | Sección |
| `{INI}COM` | Tesorería | Flujo y operación financiera |

## Colisiones de Cartera

Resueltas (ver la tabla de Cartera): plazo `V{INI}`, tipo de efecto `E{INI}`, artículo `ASE{INI}`, línea `LRC{INI}` y tercero propio `CAR{INI}` (no se reutiliza T{INI} para no cambiar las condiciones de pago y cobro del proveedor de Compras; la factura de Cartera va a la cuenta PRO 40000 y la de Compras a ACR 41000).
