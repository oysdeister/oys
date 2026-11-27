# Errores recurrentes al redactar (los que corrigieron las revisiones)

Índice: 1 Forma · 2 Contenido contable · 3 Caso continuo · 4 Pantalla y rutas · 5 Demo, capturas y limitaciones · 6 Cómo evitarlos al escribir.

Cada punto sale de un hallazgo real; el informe donde se vio está entre paréntesis (`auditoria/…`). Para auditarlos, ver la skill `auditar-contenido` (`references/gravedad_y_hallazgos.md`).

## 1. Forma

- **Frases largas** con «y… y…» o punto y coma: parte en dos. 12-15 palabras mejor; 20 como máximo. (`diagnostico_junior.md`)
- **Voz de manual**: «según la documentación», «cabe destacar», «es importante señalar», «versión anterior». Fuera. (`reauditoria.md` N10)
- **Ruta con «>»** en vez de «›»; ruta con código técnico pegado («Albaranes (en el buscador: gvenmovd)»). (`diagnostico_junior.md`; `junior_sin_erp.md` 4)
- **Título fuera de norma**: con dos puntos, paréntesis, sin infinitivo o con códigos. «Vender: pedido, albarán y factura» → «Vender del pedido a la factura». Corto, en infinitivo, sin ids ni nombres de tabla. (`reauditoria.md` N29)
- **«Ejercicio»** en la interfaz: se dice «bloque». Y «bloque» no se usa también para un grupo de campos de la ficha del ERP: di «grupo de campos» o «sección del formulario». (`revision_junior_resto_jm.md`)
- **Tablas de campos largas sin criterio**: lo que el caso no usa se marca «Déjalo como viene» o se pasa a «Más adelante».
- **Nombres de tabla** (`gcompedh`, `cefectos`) en el texto del alumno: solo si tiene que teclearlos.

## 2. Contenido contable

- **Regla del debe y el haber por «lo que recibe»**: es falsa (el capital recibe y va al haber). Usa la regla por tipo de cuenta: lo que tienes y lo que gastas, al debe; lo que debes, lo que es de los socios y lo que ganas, al haber. Añade un ejemplo del bar (compras café y pagas a 30 días) y la tabla de tres filas (banco, proveedor, compra). (`reauditoria.md` N11; `correccion_3.md`)
- **Posición Debe/Haber de una cuenta** presentada como contradicción: explícala como dato de la ficha. (`correccion_1.md`)
- **IVA repercutido en la 47000** sin aviso: di que es configuración de la demo y que en el PGC es la 477; la 4700 es lo que Hacienda te debe. (`revision_senior_ventas_workflow.md`)
- **Asiento al revés** en texto o captura (impagado, cobro de remesa): dibuja el asiento con debe y haber explícitos y compruébalo con el senior. (`reauditoria.md` H44)
- **Venta o compra contada dos veces** (albarán contabilizado y factura): explica el efecto neto, qué cuenta puente interviene y cómo se evita. (`reauditoria.md` N03; `correccion_4.md`)
- **Cuenta equivocada para el flujo** (62999 en vez de 626; mnemotécnico que lleva a otra subcuenta): comprueba el flujo completo. (`reauditoria.md` N22)
- **Plazos y términos fiscales**: el 303 del 4T vence el 1-02-2027 (el 30-01 es sábado); «prorrata» solo para la regla anual. (`reauditoria.md` N19)
- **Cifras sin origen o mal sumadas**: desglosa en el momento (3.000 + 242 − 151,25 − 3,50 − 10,00 = 3.077,25) y rehaz cada «a ± b = c». (`junior_sin_contabilidad.md` 1; `reauditoria.md` N24)
- **Conceptos avanzados el primer día** (cuenta puente 40090, mnemotécnicos, N43): a una nota «Más adelante». (`junior_otro_sector.md` 8-9)
- **Muro de números**: 4 cuentas para el caso y el resto aparte. (`junior_otro_sector.md` 6)

## 3. Caso continuo

- **«Tu empresa»**: las operaciones se graban en la empresa 0; `S{INI}` solo para alta, saldos iniciales y cierre. Una sola frase, siempre la misma. (`reauditoria.md` N05)
- **Cliente T{INI}** en Ventas: el cliente es C{INI}; si la captura muestra otro, frase puente. (`reauditoria.md` N20)
- **Prometer datos propios que no se pueden usar** («contabilizarás el albarán de T{INI}» cuando no contabiliza): di «con un albarán de la demo». (`reauditoria.md` N09)
- **Cantidad del caso**: 10 uds (125,00 / 151,25); 4 uds (60,50) solo con puente. (`guia_junior.md` D4)
- **Códigos**: 2 letras; ni «3 letras» ni `PV{INI}` con problema de longitud; un código, una cosa; el cliente se llama «Cliente Maestros {INI}», el proveedor «Tercero {INI}». (`_fuente/CODIGOS_ALUMNO.md`)
- **Caso final desfasado** respecto a un circuito reescrito: tras cambiar un bloque, busca el término viejo en `contabilidad-avanzada.json` y en los exámenes. (`revision_senior_reauditoria_jm.md` G2)
- **LRC{INI}** es la línea financiera, no la remesa. (`reauditoria.md` N07)

## 4. Pantalla y rutas

- **Ruta de ficha vs. ruta de menú**: «Ficha del tercero › pestaña Relaciones › Añadir» no es una ruta de menú; di «abre la ficha, ve a la pestaña…». Explica el icono (⌄ junto al título) con captura. (`junior_sin_erp.md` 5)
- **Tres entradas a la misma pantalla**: elige una y menciona las otras como «también». (`junior_sin_erp.md` 7)
- **Menú con varios nombres**: usa el rótulo del menú real («Registro terceros», no «Registro de terceros»; «Gestiones sobre efectos»). Si no está comprobado, `null` o «ruta no comprobada». (`reauditoria.md` N23)
- **Dos «Nuevo» seguidos** (Nuevo › Nuevo): explica por qué. (`revision_junior_jm_ventas_workflow.md` §2)
- **El mismo tercero en dos menús**: Finanzas guarda la ficha; Gestión añade el papel de cliente o proveedor. Una frase. (`junior_sin_erp.md` 6)
- **Términos del ERP sin presentar** (disquete, icono ⟳, rejilla, ficha): presentarlos antes del primer paso que los usa. (`revision_junior_ventas_workflow.md` B1)

## 5. Demo, capturas y limitaciones

- **Arreglo de un fallo de la demo presentado como técnica normal** (importe neto a 50,00; «Importe dto.» 1 y luego 0): di antes «Esto es un fallo de esta demo; en un ERP real no pasaría». (`revision_junior_ventas_workflow.md` B1)
- **Limitación de la demo escrita como regla del ERP** (tolerancia, «Nuevo como», numerador): «solo en esta demo… en un cliente real…». (`revision_senior_final_jm.md` G2)
- **Texto de trabajo visible**: «no sabemos si…», «no lo hemos conseguido». Comprueba o redacta como limitación. (`reauditoria.md` N18)
- **Fichero que el alumno debe crear** (CSV con «;») sin decir con qué programa ni qué es cada columna. (`revision_junior_ventas_workflow.md` B2)
- **Captura de otro registro** (otro albarán, otro cliente, otro alumno, otra base): avísalo en el `detalle` o recaptura. No difumines campos: los datos de la demo son falsos.
- **Pedir cambiar un dato compartido** de la demo: haz el paso de solo mirar o usa un registro propio. (`reauditoria.md` N13)
- **Datos del vídeo** (LIZ, ALA, 001, 00003, 00027, 00087, PRVCC0, dólares): di de dónde salen en esa misma frase. (`diagnostico_junior.md`)

## 6. Cómo evitarlos al escribir

1. Antes de escribir, abre `etapas.ts` y mira qué ha visto el alumno ya y qué no.
2. Escribe el `Ejemplo:` con una cifra de `caso_continuo.md`; si no existe la cifra, no la inventes.
3. Redacta el `detalle` de cada paso como «lo que ves»; si no sabes qué se ve, mira la captura o pregunta.
4. Relee con la lista de control de `estructura_bloque.md` y pasa `comprobar_contenido.py`.
5. Pide una revisión junior (otro agente) y, si tocas cifras o cuentas, una senior. No te autoverifiques.
