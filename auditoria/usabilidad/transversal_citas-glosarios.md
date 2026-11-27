# Pasada transversal: citas, nombre del producto y glosarios (27-11-2026)

Zona: todo `app/src` (y `app/index.html`), más las skills del plugin cuando citan lo mismo. No se han reescrito explicaciones de los bloques (eso lo revisa la pasada de repeticiones).

Scripts nuevos en `auditoria/scripts/`:
- `citas.py`: lista toda cita «…» con forma de título (infinitivo, 3 palabras o más) que no casa con ningún título vigente de módulo, bloque, parte, navegación o etapa, y marca como VIEJO las que casan con un título de los últimos 5 commits. Uso: `python3 -I auditoria/scripts/citas.py .`
- `gl_formas.py` (con `formas()` y `clave()` iguales a `glosario.ts`) y `union.py`: comparan dos carpetas de glosario y dicen qué términos o alias desaparecen y qué formas subrayables se pierden. Uso: `python3 -I auditoria/scripts/union.py <antes> app/src/content/glosario`.

## 1. Citas a títulos

| Duda o problema | Decisión (fuente) | Cómo queda | Sitios cambiados | Visto bueno junior |
|---|---|---|---|---|
| Citas al título viejo «Caso final: tu empresa de principio a fin» | El bloque se llama «Recorrer tu empresa de principio a fin» (`contabilidad-avanzada.json`, `caso-final`) | «… (bloque «Recorrer tu empresa de principio a fin»)» | `icon-contabilidad.json` (2 conceptos, asientos-2 y asientos-5); skill `erp-next-cierre/references/caso-final.md` (encabezado) | Sí |
| Cita a «Cerrar el ejercicio de tu empresa: regularizar y preparar el cierre», y además repetida en la misma frase | Título vigente «Cerrar el ejercicio de tu empresa» | La primera frase ya remite al bloque; la segunda queda «La teoría está en «Cerrar y abrir el ejercicio».» | `contabilidad-avanzada.json` (caso-final, detalle de la regularización) | Sí: se quita la remisión doble |
| La skill de Ventas cita «Preparar los precios» | Título vigente «Preparar los precios de venta» | Cita completa | `erp-next-ventas/references/cliente_y_precios.md` | Sí |
| ¿Cada cita dice el módulo correcto? | Comprobado con script: toda cita a un título de bloque con un nombre de módulo a menos de 30 caracteres, antes o después, se cruzó con el módulo real del bloque (contando los bloques que `index.ts` mueve: facturas a Compras y `asientos-14` a Tesorería) | 0 discrepancias | — | — |

Resto de la salida de `citas.py` revisada a mano: son botones y procesos del ERP («Pasar a provisional», «Copiar líneas de factura», «Generar albaranes desde pedidos»…), nombres de pantalla o pestaña («Datos contables», «Selección de efectos») o títulos de escenas de vídeo (`video-finanzas.ts`, «Validar y leer la regla 1477», que describe el vídeo, no cita la parte). No son citas a bloques.

Títulos que siguen fuera de norma (no se han renombrado aquí porque son decisión de su sección): «Vender: pedido, albarán y factura» (la skill `redaccion-junior/errores_recurrentes.md` propone «Vender del pedido a la factura») y «Pedir: de la oferta al pedido» (Compras), ambos con dos puntos.

## 2. Nombre del producto

«Axional Deister VNext» en todo lo visible:
- `video-ventas.ts`: título «Ventas en Axional Deister VNext» (y el comentario); la skill `erp-next-ventas/references/fuentes_y_pendientes.md` que cita ese título.
- `video-tutoriales-fin.ts`: «Introducción a Axional Deister VNext».
- `video-tesoreria.ts`: «Axional Next» → «Axional Deister VNext»; «Next» suelto en títulos de capítulo, escenas e introducciones → «VNext» (forma corta que ya usa `video-finanzas.ts`). Los ids (`bancoNext`) no se tocan.
- `video-workflow.ts` (comentario), `examenes/ventas.json` (pregunta «… en Axional Deister VNext?») y `app/index.html` (meta description).
- No quedan «Deister Axional», «Axional Next» ni «Next» suelto en `app/src` fuera de `src/erp` (comentarios técnicos del ERP de práctica, que dicen «Axional VNext» y no se ven).

## 3. Glosarios

Cargador: `glosario.ts` toma `./glosario/*.json` por glob y ordena por `ORDEN`; si una clave sale en varios ficheros gana la definición del primero y los demás solo suman alias. El subrayado del texto es global (no depende del módulo), así que mover un término de fichero no cambia qué se subraya. Se ha creado `glosario/contabilidad-avanzada.json` (el servidor de desarrollo ya lo sirve).

Criterio: cada término va en el glosario del módulo cuyo bloque lo explica primero (no el que solo lo nombra). Por eso lo que explica el repaso de Fundamentos (asiento, debe/haber, IVA, base imponible, efecto, contabilizar, conciliar) vive en Fundamentos.

Recuento (antes de esta pasada → después): fundamentos 11 → 15, maestros 20 → 17, icon-contabilidad 100 → 63, compras 69 → 69, ventas 51 → 40, carteras 69 → 39, tesoreria 35 → 32, icon-impuestos 53 → 45, icon-activos 39 → 37, contabilidad-avanzada 0 → 13. **Duplicados por clave: 0** (antes, 35 claves repetidas, algunas en 3 o 4 ficheros).

### Movidos
| Destino | Términos |
|---|---|
| Contabilidad avanzada y cierre (nuevo fichero) | Consolidación, Regularización, Asiento de apertura, Cierre temporal, Reapertura, Paso a histórico, Reclasificación de deuda a largo plazo, Regularización de divisas, Cuentas anuales, SQL, VBA (macros de Excel), Operaciones intragrupo, Participaciones no dominantes |
| Compras (facturas) | Factura directa, Nota de crédito, Factura sustitutiva, Periodo cerrado, Condiciones de cobro / de pago (se ponen en «Dar de alta los datos básicos de gestión»), Perceptor, Contabilizar un albarán (nace en el bloque «Contabilizar el albarán de compra»; definición para compra y venta) |
| Ventas | Factura de venta |
| Cartera | Mandato SEPA, Días de decalaje |
| Tesorería | Movimiento de tesorería, Comisión bancaria (fusionada), Flujo (fusionado en Flujo financiero) |
| Fundamentos | IVA, Base imponible, Contabilizar, Objeto (del ERP) |

Se quedan en Contabilidad básica Balance y Cuenta de resultados (los explica «Consultar el plan contable y sus cuentas») y Sumas y saldos.

### Fusionados (se queda uno; los demás pasan a alias o se quitan)
| Se queda (fichero) | Se fusionan | Alias añadidos |
|---|---|---|
| Asiento (fundamentos) | Asiento contable (carteras, compras) | Asiento contable |
| Debe (fundamentos) | Debe y haber (carteras, ventas), Debe y Haber (icon-contabilidad) | Debe y haber |
| Efecto, IVA soportado, IVA repercutido (fundamentos) | sus copias de carteras, compras, ventas e impuestos; se añaden la cuenta 472/477 y el dato de la demo (47000.00000) | — |
| Conciliar (fundamentos) | Conciliación bancaria (tesorería) | Conciliación bancaria |
| Plan contable (maestros) | Plan contable (carteras): familias por primer dígito | PGE 2008 |
| Cuenta financiera (banco propio) (maestros) | Cuenta financiera y Banco propio (carteras) | Banco propio |
| Provisional / Validado (maestros) | Validar (carteras), Provisional (icon-contabilidad), Provisional / Validado (ventas) | Provisional, Validado, Validar |
| Zona impositiva (maestros, nombre del campo en la ficha) | Zona fiscal (impuestos) | Zona fiscal |
| Tipología (maestros) | Tipología de documento (activos) | Tipología de documento |
| Tercero, IBAN (maestros); Remesa (carteras) | copias de carteras / maestros | — |
| Tipo de asiento (icon-contabilidad) | Plantilla de asiento (tipo de asiento) (compras) y Asiento programable (ventas): el mismo maestro | Plantilla de asiento, Asiento programable |
| Cuenta mnemotécnica (icon-contabilidad) | copias de carteras y tesorería, Mnemotécnico contable (impuestos) | Mnemotécnicos, Mnemotécnico contable |
| Cuadre, Diario, Periodo, Numerador, Divisa y cambio, Plazo de pago, Tipo de efecto, Vencimiento, Saldo, Domiciliación bancaria, Analítica, Artículo financiero, Clave fiscal, Relación contable (icon-contabilidad) | Cuadre del asiento, Diario contable, Periodo contable, Numerador de justificantes, Divisa, Tipo de cambio, Proyecto y sección (→ alias de Proyecto) y las copias de carteras, ventas y tesorería | Cuadre del asiento, Periodo contable, Numerador de justificantes, Cambio aplicado, Proyecto y sección |
| Abono (factura rectificativa) (compras) | Factura rectificativa (icon-contabilidad, impuestos): por diferencias o por sustitución | — |
| Docflow (compras) | DocFlow (icon-contabilidad), Docflow (activos, ventas) | — |
| Serie (numerador) (compras) | Serie de numeración (carteras), Numerador (#e#s#6n) (ventas): la máscara #e#s#6n pasa a la definición | Serie de numeración |
| Libro de IVA (compras) | Libro registro (impuestos) | Libro registro, Libros registro (se quita el alias SII, que ya es término de Impuestos) |
| Circuito de workflow (compras) | Workflow (icon-contabilidad; ya era alias) | — |
| Fecha valor (ventas) | Fecha valor de carteras y tesorería: una entrada con los dos sentidos (factura: base de los vencimientos; banco: día en que el dinero entra o sale) | — |
| Prorrata (impuestos) | Prorrata de IVA (maestros); se quita el alias «Prorrata» repetido en «Prorrata provisional y definitiva» | Prorrata de IVA |

Renombres pedidos:
- «Relaciones contables (gconcuen)» → **«Relaciones contables»** (alias `gconcuen`); su definición y ejemplo dicen ahora «tipo de asiento» en vez de «plantilla de asiento».
- «Plantilla de asiento (tipo de asiento)» de Compras: duplicaba «Tipo de asiento» → **fusionado** en él (alias «Plantilla de asiento»).

### Comprobación de que no se pierde nada (`union.py`)
Todos los términos y alias de antes siguen subrayándose, salvo cuatro formas largas que solo existían como nombre con paréntesis y no aparecen escritas así en ningún texto (`grep` en `app/src` y skills: 0): «Numerador (#e#s#6n)», «Objeto (nombre técnico de la pantalla)», «Plantilla de asiento (tipo de asiento)» y «Relaciones contables (gconcuen)» (renombres y fusiones de arriba). Formas nuevas: «gconcuen», «Libros registro».

### Ejemplos
- Todos los términos movidos o fusionados tienen ejemplo con datos del caso ({INI}, 125,00 + 26,25, 242,00, 3,50 y 10,00 de comisiones con {INI}COM y 62600, efecto 2 de 121,00 en la remesa CSDDS…) o dicen de dónde salen («En la demo…», «En el vídeo de facturas…»).
- Además se marca la fuente en 14 ejemplos con datos de la demo o del vídeo que no la decían: Cartera (1.524,60 y 1.815,00 del vídeo), Activos (ES2130, ES200, ES5, componente 004105, mostrador 1.480 €, aspiradora 594,43, series ELE/CMP), Tesorería (cuenta de prácticas CAPT_BCO) y Ventas (5 × 22,00 = 133,10 de «Vender de la oferta a la factura»).
- Unos 180 ejemplos son ilustraciones genéricas sin datos de ninguna base («Un ordenador: 4 años», «Préstamo de 10.000 € a 5 años»): no dan cifras que el alumno pueda confundir con las de la demo y se dejan así.

## 4. Restos pequeños

| Duda o problema | Decisión (fuente) | Cómo queda | Sitios cambiados | Visto bueno junior |
|---|---|---|---|---|
| Compras bloque 7 («Recibir la mercancía con el albarán») remite a «Generar albaranes» en la práctica del bloque 9 sin explicarlo | La práctica (`erp/practicas.ts`, `erp-circuito`) lo hace con «Acciones › Generar albaranes» del pedido validado | Se dice aquí en una frase: «En el ERP de prácticas es más corto: con el pedido validado, en «Acciones», eliges «Generar albaranes» y se crea el albarán con el pedido como origen; lo harás en la Práctica del bloque «Registrar y contabilizar la factura».» | `compras.json` (compras-2, concepto) | Sí |
| Objetivo del bloque 11 de Compras («Contabilizar una factura de compra»): «Contabilizarás una factura…» cuando la del alumno ya está contabilizada | El concepto dice «Ya contabilizaste la tuya…; ahora lees… lo que deja», y las cifras son las de la factura del vídeo (875 / 1.058,75) | Objetivo: «Seguirás la contabilización de una factura de compra con origen albarán y comprobarás qué genera…». Lo aprendido, igual: «Has seguido la contabilización…» | `icon-contabilidad.json` (icon-contabilidad-v-1) | Sí |
| Skill `erp-next-cartera`: «Cartera» donde la pantalla dice «Cartera de efectos» | Menú ⌄ de la factura: «Cartera de efectos» (skill `erp-next-ventas/circuito_de_venta.md`) | «desplegable ⌄ › «Cartera de efectos»» | `erp-next-cartera/SKILL.md`, `erp-next-cartera/references/bloques_cartera.md` | — |
| Skill `erp-next-ventas`: «Compras/Maestros» para la condición de cobro | R{INI} y P{INI} se crean en Contabilidad básica («Dar de alta los datos básicos de contabilidad», maestros-1); el cliente en Gestión y su condición de cobro, en Compras («Dar de alta los datos básicos de gestión», maestros-2) | Dice los dos bloques con su módulo | `erp-next-ventas/SKILL.md`, `erp-next-ventas/references/fuentes_y_pendientes.md` | — |

## 5. Estructura
`python3 -I auditoria/scripts/comprobar_estructura.py`: 9 «errores», todos el número de entradas de los glosarios (esperables: términos movidos, fusionados y el renombre). Ningún otro error estructural; 0 avisos. Todos los JSON de `app/src/content` cargan.

Nota de método: los glosarios se reescribieron con un script de una sola pasada (comprobaba que ningún fichero había cambiado entre la lectura y la escritura y conservaba el formato de cada uno), porque eran unas 150 operaciones; el resto de cambios se hizo con Edit cadena a cadena.

## Pendiente (con motivo)
- **«Relaciones contables» secuestra el plural de «Relación contable».** Unos 12 textos dicen «relaciones contables» en el sentido del tercero (Datos maestros, Contabilidad básica, Cartera, la definición de Tercero) y el subrayado los lleva al término de Compras (las reglas de gconcuen). Ya pasaba antes del renombre, porque la forma sin paréntesis era la misma. Para arreglarlo hace falta un nombre distinto para las reglas (p. ej., «Relaciones contables de Gestión») o cambiar esos textos a «la relación contable de cada papel». Lo decide Sergi.
- «Contabilizar (Real y Diferido)» (icon-contabilidad) comparte la forma «Contabilizar» con el término de Fundamentos. Gana Fundamentos por orden alfabético, así que funciona, pero un nombre como «Contabilización real o diferida» lo dejaría limpio.
- «Adjudicación» tiene dos sentidos (reserva de stock en Compras y oferta adjudicada en Ventas). Son dos términos distintos y se quedan los dos; el subrayado de «Adjudicación» suelta va al de Compras.
- «Cuadro de amortización» (préstamo, Tesorería) y «Cuadro de amortizaciones» (activos) son conceptos distintos con casi el mismo nombre. Se quedan los dos.
- No se han rehubicado términos únicos que el repaso de Fundamentos también explica (Cuota, Tipo impositivo, en Impuestos). No están duplicados; moverlos es opcional.
