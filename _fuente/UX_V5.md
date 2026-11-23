# UX v5 · Un solo camino

La v4 ordenó el aspecto. La v5 ordena **el recorrido**. Un junior que no sabe finanzas ni ha visto el ERP tiene que saber siempre tres cosas: **dónde está, qué toca ahora y por qué**.

Fuentes:
- Nota de voz de Sergi en Granola, «Revisión de módulos de formación: compras, maestros y contabilidad».
- Recorrido de 11 juniors simulados, uno por módulo más uno de portada y extras. Informes y capturas en la carpeta de notas `ux-v5/`.

## 1. Diagnóstico (priorizado)

| # | Problema | Dónde | Lo vieron |
|---|---|---|---|
| 1 | **No hay un primer paso.** El módulo abre con 4 entradas a la vez: botones, índice «En esta página», «Tu ruta» y «El circuito». «Antes de empezar» está al final y dice «ábrelo cuando lo necesites». | Todas las páginas de módulo | 10 de 10 juniors de módulo |
| 2 | **Cuatro contadores a la vez.** «Ejercicio 2 de 8», «Paso 2 de 6», «Parte 1 de 8» y «01/45». No se distingue apartado de subapartado. | Página de ejercicio | 9 de 10 |
| 3 | **Se puede saltar sin acabar.** «Siguiente ejercicio» está siempre activo. Sergi pide no saltar al bloque siguiente sin terminar el actual. | Pie del ejercicio | Sergi y 3 juniors |
| 4 | **El Concepto es el manual entero.** Hasta 12.700 px, 8 partes y 6-10 cajas por parte: tarjetas 01/02/03, «¿Para qué sirve?», campos y avisos. | `compras-1`, `maestros-1`, `icon-activos-1`… | 6 de 10 |
| 5 | **Vídeos repetidos.** «Sesión de finanzas 1» sale entera en Maestros, Contabilidad y Cartera. El mismo clip aparece en la cabecera, en el Concepto y en el Guiado. | `video-finanzas.ts`, ExercisePage, Guiado | Sergi y 5 juniors |
| 6 | **Temas duplicados entre módulos.** Extracto y conciliación en Cartera (bloques 14-17) y en Tesorería (4-5). Banco propio en Maestros, Cartera y Tesorería. El asiento de tesorería en Asientos. | carteras, tesoreria, asientos | 4 juniors |
| 7 | **Prácticas del ERP mal asignadas.** La misma práctica se repite en dos bloques; la de «Albarán-Factura» es la de «Oferta-Pedido-Albarán-Factura». | `practicas.ts` | Compras y Asientos |
| 8 | **El ERP de práctica queda estrecho.** El enunciado ocupa un tercio fijo a la derecha y corta columnas. Sergi pide el ERP más grande y las instrucciones en ventana. | Paso Práctica | Sergi y portada |
| 9 | **Pantallas en blanco.** 11 secciones de Contabilidad general tenían la ruta de menú como texto: `s.ruta.map is not a function`. | `icon-contabilidad.json` | Contabilidad |
| 10 | **Pasos vacíos.** «De memoria: este ejercicio no tiene pantallas con clic» y demos sin checklist se muestran igualmente. | Impuestos, Activos | 2 juniors |
| 11 | **Vocabulario sin definir.** Módulo, ejercicio, práctica, demo real, taller y examen no se explican en ninguna parte. | Portada | Portada |
| 12 | **La portada tiene tres botones al mismo sitio:** «Empezar», «Ver ruta» y «Tu primer ejercicio». | Portada | Portada |

Contenido que **no** se reescribe en esta versión, pero queda señalado en `ux-v5/pendientes-contenido.md`:
- signo del extracto bancario;
- examen de Asientos que pregunta lo que no se enseña;
- doble contabilización a propósito en Ventas 1;
- tercero 00003 compartido en Impuestos;
- pasos sin captura.

## 2. El modelo: cuatro niveles, siempre los mismos nombres

```
Curso
└── Módulo  (10, numerados 1-10, en orden)
    └── Etapa  (A, B, C… · apartado: agrupa bloques de un mismo tema)
        └── Bloque  (antes «ejercicio» · una tarea del ERP)
            └── Paso  (siempre en este orden; un paso sin contenido no aparece)
                Concepto → Guiado → De memoria → Test → [Práctica] → Demo real
                (Práctica solo en los bloques con ejercicio en el ERP de práctica)
                (dentro del Concepto, el bloque se divide en «partes»)
```

«De memoria» es **opcional** (decisión de Sergi): no cuenta para terminar el bloque ni para el porcentaje; un bloque se termina con Guiado + Test aprobado.

Reglas:
- **Un número por nivel, y solo uno a la vista por nivel:** «Módulo 3 de 10», «Bloque 1 de 3», «Paso 2 de 6» y «Parte 1 de 8».
- **Un bloque se abre cuando el anterior está hecho** (Guiado completo y Test aprobado). Uno ya empezado no se vuelve a cerrar. Para revisar el curso entero sin hacerlo: `?libre=1` en la URL; `?libre=0` lo quita.
- **Ampliación aparte:** lo avanzado o de referencia va en «Para saber más». Se abre al terminar el módulo y no cuenta para el avance.
- **«Problemas» ya no es una pestaña:** va al final de la Demo real, como «Si algo falla en la demo».
- **Un paso sin contenido no se enseña.** Sin práctica preparada, no hay paso Práctica. Sin pantallas ni pasos que ordenar, no hay De memoria.
- **Cada tema en un solo módulo.** Extracto y conciliación pasan a Tesorería. Cada serie de vídeo pertenece a un solo módulo. Cada práctica del ERP vive en un solo bloque.

## 3. Portada

```
┌──────────────────────────────────────────────────────────────────┐
│ Hola, Ana                                     (escena de planetas)│
│ Aprende Axional haciéndolo                                        │
│ 10 módulos… Entiendes la idea, la practicas y la repites.         │
│ [ Seguir: Compras, bloque 2  → ]      ← UN solo botón             │
│ Módulo 3, bloque 2: Circuito Albarán-Factura. Paso: Test.         │
└──────────────────────────────────────────────────────────────────┘
 Cómo funciona
 1. 10 módulos, en orden. Cada uno usa lo del anterior.
 2. Cada módulo tiene bloques. Se abren de uno en uno.
 3. Cada bloque, siempre en el mismo orden: Concepto → Guiado → … → Demo real (algunos con Práctica).
 ┌ Práctica = ERP de mentira en esta web · Demo real = ERP de verdad ┐
 └ Taller = juegos para repasar · Examen final = certificado          ┘

 Tu ruta
 │
 ①  ▣ Datos maestros     Las fichas que usan todos…     [Empieza aquí] 0/7 · 5 h
 ②  ▣ Parametrización    Antes de contabilizar…                        0/7 · 2 h
 ③  ▣ Compras            …
 │   …
 ⑩  ▣ Activos fijos
 [ Taller ]  [ Examen final ]
```

## 4. Página de módulo: tres apartados numerados, de arriba abajo

```
← Todos los módulos
(▣) Módulo 3 de 10
Compras                                                   ← h1
Das de alta un proveedor… y llevas una compra hasta el asiento.
▬▬▬▬▬▭▭▭▭▭  1 de 3 bloques terminados
[ Seguir: bloque 2, Test → ]                              ← UN solo botón
────────────────────────────────────────────────────────────
(1) Antes de empezar                                      ← h2
    Un vistazo de 2 minutos al recorrido.
    ✓ Lo que sabrás hacer (3 líneas)
    ① Oferta  ② Pedido  ③ Albarán  ④ Factura  ⑤ Conformar  ⑥ Contabilizar
    Lo básico del ERP para este módulo                    ← h3
    ▸ Cómo moverte por el ERP                       (plegable)

(2) Los bloques                                            ← h2
    Hazlos en orden. Cada bloque tiene los mismos pasos…
    A. Preparar la compra                                  ← h3 (etapa)
    │ ✓  Bloque 1. Proveedor, artículo y tarifa   ▬▬▬▬▬▬ 60 min   Hecho
    B. Comprar
    │ 2  Bloque 2. Circuito Albarán-Factura       ▬▬▭▭▭▭ 60 min   Te toca
    │ 🔒 Bloque 3. Oferta-Pedido-Albarán-Factura  ▭▭▭▭▭▭ 60 min   Cerrado
    Para saber más (opcional)

(3) Para cerrar el módulo                                  ← h2
    [ Examen del módulo · 15 preguntas, apruebas con un 80 % ]
    [ Siguiente: módulo 4, Ventas ]

Material de consulta (no hace falta para avanzar)
    Simulador del Taller · ▸ Vídeos completos del módulo (plegado)
```

Se quitan: el banner con estadísticas y planeta, el índice «En esta página», el circuito 3D animado, la serie de vídeos desplegada en medio y las tres «puertas» finales.

## 5. Página de bloque: una secuencia lineal con «Siguiente»

```
← Compras | Bloque 2 de 3
Circuito de compras Albarán-Factura                        ← h1
Tendrás un albarán validado, su factura conformada y el asiento.

┌ (✓1 Concepto)─(✓2 Guiado)─(③ De memoria)─(4 Test)─(5 Práctica)─(6 Demo real) ┐  ← fijo al hacer scroll
└ Paso 3 de 6: De memoria. Repites sin ayuda.                                    ┘

  … contenido del paso …

──────────────────────────────────────────────────────────────
[← Guiado]                                [ Siguiente: Test → ]
(en el último paso)  [ Siguiente bloque: … ]  o  🔒 «Para abrir el bloque 3, termina el Guiado y aprueba el Test»
```

**Paso 1, Concepto**, como lectura y no como tarjetas:

```
La idea                                                    ← h2
Antes de comprar, el ERP necesita saber a quién…  (párrafo grande)

┌ Este bloque tiene 8 partes. Léelas en orden: ┐
│ 1 Tercero   2 Relaciones   3 Direcciones …   │  ← índice; marca la parte en la que estás
└──────────────────────────────────────────────┘
Parte 1 de 8                                               ← antetítulo
Tercero                                                    ← h2
(▶ Míralo en el vídeo · cap. 2, 1:50)   ← el vídeo SOLO aquí
Para qué sirve. El tercero es la ficha única…
Dónde se mira en el ERP: [Finanzas]›[Maestros]›[Terceros]
• explicación en viñetas, sin tarjetas numeradas
[captura con números ①②③ + campos]   ← tocar un número enseña su campo
▌Ojo. …  ▌Solución. …                 ← avisos con una barra a la izquierda, sin caja
- - - - - - - - - - - - - - - - - - - - - -
                         [ Parte 2: Relaciones contables ]
```

**Paso 5, Práctica.** El ERP ocupa todo el ancho. El enunciado se abre encima, en una ventana que se cierra:

```
┌ Da de alta tu proveedor · Falta: «El tercero TAJ existe» · 2/100 · [Ver enunciado y corrección] ┐
┌──────────────────────────── ERP de práctica (todo el ancho) ──────────────┬─ enunciado ─┐
│ TERCEROS  [Nuevo]                                                         │ 1. …   [×]  │
│ …                                                                         │ Corrección  │
└───────────────────────────────────────────────────────────────────────────┴─────────────┘
```

## 6. Barra lateral

Los módulos van numerados (1. Datos maestros… 10. Activos fijos). El módulo en el que estás se despliega con sus bloques: hecho ✓, abierto con su número y cerrado en gris. Es lo que pidió Sergi: «desplegar submódulo 1, 2 y 3 desde el menú».

## 7. Lenguaje visual

- **Jerarquía con tamaño y sangría, no con cajas.** h1 para la página; h2 para los apartados, con número en círculo oscuro en el módulo; h3 para las etapas y lo básico. La única caja es la que se toca: bloque, botón o plegable.
- **Números solo donde hay orden:** apartados del módulo, bloques, pasos y partes. La explicación va en viñetas.
- **Un único botón principal por pantalla:** arriba en módulo y portada, abajo a la derecha en el bloque.
- Se mantienen los tokens y la tipografía de la v4 (`sistema.css`). Las hojas nuevas están en `app/src/pages/ruta.css`.

## 8. Textos

Frases cortas. Cada cosa dice **qué es, para qué sirve y dónde se mira en el ERP**. «Bloque» en vez de «ejercicio» en toda la interfaz. El «ejercicio contable» del ERP no cambia.
