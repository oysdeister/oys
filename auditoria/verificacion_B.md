# Verificación B (H18-H39) contra el contenido ACTUAL de la rama claude/strange-raman-307052

AVISO: informe.txt no lleva IDs H. Los he asignado por orden de aparición (sección 4: 4.1 orden, 4.2 maestros, 4.3 compartidos, 4.4 vídeo, 4.5 estructura) y por los temas que citó el encargo (H21 moverte, H24 tipología, H30 tramos idénticos, H37 práctica, H38 nombres, H39 capturas). Si tu numeración difiere en H18-H20, H22, H25-H29, H31-H36, vuelve a casar por el texto de cada fila.
Medido con scripts sobre app/src/content/*.json + videoMapa/videoSeries/video-*.ts (evaluados con node). 86 bloques, 341 secciones+bloques como filas; 255 secciones.

## Resumen
| ID | Tema (mi asignación) | Vigente | Arreglo mínimo |
|---|---|---|---|
| H18 | Referencias adelantadas | Sí | Frase «lo verás en X» en el primer uso; mover «Contabilizar/debe-haber» a nota corta en Compras 6 |
| H19 | Maestros cajón de sastre | Sí (composición); el 35 % no lo he podido medir | Separar sin cambiar ids: reordenar ETAPAS (etapas.ts) y marcar maestros-1 secciones de cartera/divisas como «ampliación» |
| H20 | Tercero explicado 5 veces | Sí | Una ficha base (maestros-1-terceros); en compras-1-tercero, carteras-1-tercero, carteras-3-entidad y ventas-1-cliente dejar solo «lo que cambia» + enlace |
| H21 | 7 «Cómo moverte» | Parcial | Dejar solo maestros-moverte-axional; borrar texto de las otras 6 o reducirlas a un enlace |
| H22 | Debe/haber/asiento 8 veces y contradicción | Sí | Unificar «asiento = conjunto de apuntes; apunte = línea» en maestros-v-1-cuentas-contables e icon-cartera-v-8 |
| H23 | Bancos y cajas 5 veces | Sí | Fuente única carteras-3-banco/caja; maestros-v-4-banco-propio y tesoreria-1-banco → enlace |
| H24 | Tipología, párrafo literal repetido | No (literal); sí 5 explicaciones | Nada literal que borrar; opcional unificar glosario (2 entradas «Tipología») |
| H25 | Plazos y tipos de efecto 3 veces | Sí | maestros-1-plazos/tipos-efecto → enlace a carteras-1 |
| H26 | Ejercicio 3 · cuenta 2 · numerador 4 | Sí | Una explicación por concepto y enlaces |
| H27 | 156/255 secciones con vídeo; 100 con ≥2 tramos | Sí (exacto) | Recorte editorial en videoMapa/video-*.ts (≤1 tramo por sección) |
| H28 | Cap. 2 de compras en 11 secciones, 3 módulos | Sí (exacto) | Dejar el clip en maestros-1-terceros/plazos/tipos-efecto o en compras-1; quitar de los demás |
| H29 | Hasta 6 tramos por sección | Sí (máx. 6) | Igual que H27 |
| H30 | 27 tramos idénticos, 14 en módulos distintos | Sí (exacto) | Quitar la copia en la sección «no dueña» (lista abajo) |
| H31 | Compras 3: 11 tramos en 30 min y saltos | Sí (exacto) | Reducir compras-tipos a 1 tramo por sección y en orden creciente |
| H32 | Base distinta: 17 bloques avisan | Parcial: 13-20 según criterio; 57900 sigue en icon-contabilidad-v-2 | Revisar a mano; no hay arreglo mecánico |
| H33 | Huecos de vídeo | Sí | Ventas 0 de 2 bloques y Contabilidad 11 de 29 sin vídeo (también impuestos 3, activos 2, cartera 2, tesorería 2, maestros 1) |
| H34 | Módulos desequilibrados | Sí | Es decisión de estructura; no hay arreglo mínimo |
| H35 | Bloques mal dimensionados | Sí (cifras exactas; ver nota) | Solo si se decide fundir; no tocar ids |
| H36 | Extremos de duración y clics | Sí | Ídem |
| H37 | Práctica ERP en pocos bloques | Parcial | Cambiar «Siempre sigue estos pasos» (Home.tsx ~L236) y/o quitar «Práctica» del bloque compras-2 |
| H38 | Nombres inconsistentes | Sí | Elegir un término y sustituir en ~15 cadenas de componentes + 9 de contenido |
| H39 | Capturas con datos de otros | Parcial: hay listados de la base compartida; no verificable del todo | Recortar/pixelar no (regla del proyecto); sustituir captura por una con base limpia |

## H21 — los 7 sitios
ids (todos «Cómo moverte…»):
1. maestros-nav-moverse (maestros.json, navegacion)
2. maestros-moverte-axional («Moverte por Axional», 1.ª sección del bloque maestros-v-3, con el vídeo tut-intro; videoIndice)
3. compras-nav-moverte
4. ventas-nav-moverse
5. parametrizacion-nav (icon-contabilidad.json; su texto es en realidad una intro de debe/haber, plan, auxiliares)
6. carteras-nav-moverse
7. tesoreria-nav-moverse («Cómo moverte por tesorería»; es un listado del menú de tesorería)
Estado actual: ModulePage.tsx L124-140 ya deduplica por título idéntico: en compras, ventas, contabilidad y carteras el alumno ve «Cómo moverte por el ERP: ya lo viste en Datos maestros». Se ven completos: 1, 2 y 7 (el 7 porque su título es distinto). Los otros 4 están ocultos pero siguen en el JSON (y el 5 pierde su intro de debe/haber para el alumno).
Único recomendado: el 2 (maestros-moverte-axional): es el primero que ve el alumno, trae el vídeo y el mapa del menú. Eliminar o reducir a una línea el 1; renombrar el 7 a «El menú de Tesorería» (no es navegación general); mover el texto contable del 5 a otro título («Lo mínimo de contabilidad»).

## H24 — tipología
Búsqueda de párrafos (≥40 car.) idénticos entre bloques y de similitud >0,75 en párrafos que mencionan «tipolog»: no hay ningún párrafo literal repetido sobre tipología. Lo más parecido: carteras-1-factura-compra / carteras-5-factura-venta (0,94, «Tipología de la factura de compra/venta, es decir, la plantilla que fija serie y diario») y icon-activos-v-1/v-2 (0,87, ruta + AACF/FACT). Explicaciones de tipología hoy: compras-tipos (4 secciones), ventas-1 (2), ventas-2 (4), icon-activos-v-2, glosario maestros.json y glosario icon-contabilidad.json (dos entradas «Tipología» con definiciones distintas). Conclusión: la afirmación «párrafo literal repetido» ya no se sostiene (o se corrigió).

## H30 — tramos idénticos (serie, capítulo, inicio t, fin): 27
(bloque#n = posición en JSON; MULTI = módulos distintos)
- tut-contabilidad c3 t276: asientos-1-diario ×2 y icon-contabilidad-1-diario ×2 (mismo tramo duplicado dentro de la misma sección)
- tut-contabilidad c3 t296: asientos-6-vigencia, icon-contabilidad-v-4-periodos, icon-contabilidad-1-configuracion ×2
- tab-cartera c2 t0: carteras-3-banco, carteras-3-caja, tesoreria-1-banco (MULTI)
- tab-cartera c3 t0: carteras-5-remesa-banco, icon-cartera-v-4-tipos, icon-cartera-v-5-remesas-por-cuenta
- fin-maestros c4 t790: maestros-v-3-cabecera, asientos-6-vigencia (MULTI)
- fin-maestros c4 t876: maestros-v-3-vinculo, parametrizacion-icon-1-orden-carga (MULTI)
- fin-maestros c1 t92: maestros-v-1-planes-contables, parametrizacion-icon-1-orden-carga (MULTI)
- fin-maestros c2 t368: maestros-v-1-cuentas-contables, parametrizacion-1-cuenta (MULTI)
- compras c2 t452: maestros-1-terceros, compras-1-tercero (MULTI)
- compras c2 t593: maestros-1-terceros, compras-1-condiciones (MULTI)
- compras c2 t623: maestros-1-plazos, carteras-1-plazo (MULTI)
- compras c2 t615: maestros-1-tipos-efecto, carteras-1-tipo-efecto (MULTI)
- compras c8 t4007: maestros-1-cuentas-perfil, compras-1-relaciones (MULTI)
- fin-icon1 c2 t367: maestros-v-4-ejercicio, asientos-6-vigencia (MULTI)
- compras c2 t609: compras-1-condiciones, carteras-1-tercero (MULTI)
- compras c7 t3517: compras-2-factura, compras-2-conformar
- compras c8 t4128: compras-2-contabilizar, asientos-2-lineas (MULTI)
- fin-icon1 c1 t17: parametrizacion-icon-2-escenario-solo, icon-contabilidad-v-1-factura-origen
- tab-contabilidad c6 t0: parametrizacion-icon-2-plantillas-permiso, icon-contabilidad-1-plantillas
- tab-tesoreria c1 t0: asientos-14-comision, tesoreria-1-comisiones (MULTI)
- fin-icon11 c6 t885: icon-contabilidad-v-4-periodos, icon-contabilidad-1-configuracion
- tab-cartera c5 t0: icon-cartera-1-estados, carteras-5-estados
- fin-icon11 c8 t1267 y t1340: icon-cartera-v-7-domiciliacion, icon-cartera-v-7-tipos-efecto (2 tramos)
- tab-tesoreria c3 t0: tesoreria-2-operacion, tesoreria-2-conciliacion
- tab-impuestos c3 t0: icon-impuestos-1-clases-tipos, icon-impuestos-v-2-tipo-impuesto
- tab-impuestos c4 t0: icon-impuestos-v-2-regla-2586, icon-impuestos-1-reglas-agencia
Totales: 27 repetidos, 14 en módulos distintos (coincide con el informe). Filas de tramo en sección: 304 (301 sin duplicados internos), no 271.

## H37 — práctica en el ERP simulado
- src/erp/practicas.ts L636-645 (PRACTICAS_POR_EJERCICIO): 6 bloques con práctica, 7 prácticas: maestros-2 (erp-articulo), compras-1 (erp-proveedor), compras-factura (erp-circuito, erp-parcial), asientos-6 (erp-asiento), icon-cartera-v-5 (erp-pago), tesoreria-5 (erp-conciliacion; + PRACTICAS_FINANZAS).
- Total 86 bloques: 80 obligatorios + 6 de ampliación (etapas con opcional:true) → «6 de 80» exacto sobre obligatorios (6 de 86 en total).
- Portada, src/pages/Home.tsx: L233-236 «Un bloque es una tarea del ERP. Siempre sigue estos pasos, en este orden.», L256-257 etiqueta «En algunos bloques» junto al paso Práctica (paso «De memoria» lleva «Opcional»), L263-265 «La Práctica es un ERP simulado dentro de esta web y se corrige solo. La Demo real es el ERP de demostración de Deister, en otra pestaña.» (el paso se llama «Práctica»: src/lib/ruta.ts L18 «Lo haces en el ERP de práctica de esta web»). Ya hay matiz («En algunos bloques»), pero «Siempre» lo contradice y no dice que son 6.
- pasosDe() (ruta.ts) oculta el paso si el bloque no tiene práctica, así que no hay pasos fantasma.
- Incoherencia relacionada: bloque compras-2 («Recibir la mercancía con el albarán», compras-2#ej) dice «en la Práctica, con el botón «Generar albaranes»», pero no tiene práctica (erp-circuito está en compras-factura). Cambiar a «en el ERP de práctica de «Registrar y contabilizar la factura»» o quitar la frase.

## H38 — nombres (visible en componentes)
- «ERP de práctica»: 5 (auth/Acceso.tsx L81 y L196; components/shell/Sidebar.tsx L13; components/shell/Topbar.tsx L19; lib/ruta.ts L18). Además pages/ErpPractica.tsx L22 «réplica de Axional VNext».
- «Demo real»: 3 (lib/ruta.ts L19 etiqueta del paso; pages/Home.tsx L264; lib/badges.ts L23 «demo real»). Tab interna id 'demo'.
- «demo» suelto = ERP real: ≥10 (Home.tsx L211 y L223; ModulePage.tsx L231; Logros.tsx L41; Onboarding.tsx L82; DemoReal.tsx L58; Examen.tsx L141, L219, L639; Examinador.tsx L213; App.tsx L170 «demo nextdemo.geasa.eu»).
- «ERP simulado»: 1 (Home.tsx L263). «demo de prácticas»: 0 en componentes, 9 en contenido (icon-activos.json). «Deister Manager»: 0 en componentes; 1 en contenido (maestros-nav-datos «ERP Deister Manager»); «Manager» en el marco del ERP simulado: erp/ErpApp.tsx L118 («Manager · BBDD TUTORIAL») y L267.
- Marca: «Formación Axional Deister VNext» (Sidebar L67, Onboarding L56, Acceso, Home L355), «Practicando Axional Deister VNext» (Examen, certificado, envio.ts), footer «Ejercicios sobre Deister Axional» (App.tsx L170), «Axional Next» en content/video-tesoreria.ts L2/L166.
- «ejercicio» con sentido de bloque en textos visibles: 4 (App.tsx L170 «Ejercicios sobre…»; pages/Logros.tsx L211 «{hechos} de {total} ejercicios»; pages/Glosario.tsx L207 «En los ejercicios aparecen…»; pages/Video.tsx L391 «Abrir el ejercicio»). La UI central (ModulePage, Home, Sidebar) ya dice «bloque». En contenido JSON quedan ~25 casos de bloque (carteras ~12 «En el ejercicio…», «ejercicios 14 a 17», tesoreria ~6 «orden de los ejercicios», maestros «Todos los ejercicios del curso trabajan en la empresa 0», ventas «el ejercicio está montado así a propósito») frente a «ejercicio contable» (maestros-v-4-ejercicio, icon-contabilidad…, legítimo; ~260 menciones).

## H39 — capturas con datos de otros alumnos
No lo puedo verificar al 100 %. Método usado: OCR (tesseract spa) de las 437 capturas de app/public/img/*/*.webp (scratchpad/ocr/*.txt) y lectura visual de 2. Hallazgos:
- Las capturas se hicieron con al menos dos juegos de iniciales (CA: ~21 imágenes, CL: ~20; también CAPN), no son las del alumno.
- Hay capturas de LISTADOS de la base compartida con códigos ajenos. Ejemplo comprobado visualmente: carteras-d-240 (lista de Terceros con 0, 00001…A01, BCA, MB1, TCA, TCL: TCL es de otra persona). Con OCR aparecen BCA/MB1/020411 en carteras-d-254/255/258/259, maestros-d-91/115, maestros-n-17/18, tesoreria-n-01/14; y mezcla CA+CL en carteras-d-251/285, asientos-d-197/221/222.
- Los listados de asientos/apuntes (asientos-d-*) y de documentos de compras/ventas son los candidatos más probables (el propio contenido admite «la demo es compartida» y «no los de otros alumnos»).
- Cómo detectarlo: OCR + regex de códigos por iniciales (T/ROD/ALM/CAJA_/BBVA_ + ≠ iniciales del autor) y revisión visual de las pantallas «lista». Para cerrarlo hay que abrir las capturas tipo lista (~30-60) a mano; no lo he hecho completo.
- Ojo con la regla de memoria del proyecto: los datos de la demo son falsos; no difuminar. El arreglo es recapturar sobre una base limpia o elegir captura de ficha en vez de lista.

## Notas de cifras
- Duración total 2.376 min (39,6 h) ✓. Contabilidad 29 bloques 521 min (8,7 h) ✓; Ventas 2 bloques 135 min ✓; maestros-1 90 min, 8 partes, 35 pasos ✓; ventas-1 46, ventas-2 41, carteras-5 42 clics ✓.
- Contabilidad con 8-30 min: 25 bloques por mi criterio (el informe dice 19; criterio no reproducible).
- Glosario: 435 entradas, 367 términos únicos, 50 términos repetidos (68 entradas sobrantes; el informe decía 63).
- Maestros-v-3 (bloque 1) usa «contabiliz*» 10 veces ✓; maestros-1 «domicili*» 15 veces ✓ (informe 14).
