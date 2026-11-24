# Hecho: estructura Configurar / Operar (fase 2)

Sigue `auditoria/menu_propuesto.md`. Build y JSON correctos; lint sin errores nuevos (solo avisos previos).

## Módulos y etapas (ids de bloque por apartado)

0 Fundamentos (`fundamentos`, nuevo, sin fase): «Antes de tocar el ERP» → `fundamentos-1` (todavía no existe; mientras tanto la página muestra «Próximamente»). Navegación corta «Cómo está organizado el curso».
1 Maestros: Configurar «La empresa»: maestros-v-3, maestros-v-4.
2 Contabilidad básica (`icon-contabilidad`):
- Configurar · El plan de cuentas: maestros-v-1, maestros-v-2, parametrizacion-1, parametrizacion-2
- Configurar · Datos básicos que usarás después: maestros-1
- Configurar · Diario, periodos y plantillas: asientos-1, icon-contabilidad-1
- Operar · Escribir un asiento: asientos-2..5
- Operar · Contabilizar, copiar y corregir: asientos-6, 11, 12, 13
- Operar · Consultar: asientos-7, 8, 9, 10, 14
- Operar · Facturas que generan asientos: icon-contabilidad-v-1..4
- Opcional (sin fase) · Para saber más: parametrización completa: parametrizacion-icon-1, parametrizacion-3..6, parametrizacion-icon-2
3 Compras: Configurar · Maestros de compra: maestros-2, compras-1, compras-precios; Documentos: compras-tipos. Operar · Comprar: compras-3, compras-2, compras-factura; Devolver y controlar el stock: maestros-3.
4 Ventas: Configurar «Lo que ya tienes» sin bloques (nota + enlace a Compras); Operar · Vender: ventas-1, ventas-2.
5 Cartera: Configurar: carteras-1, carteras-3. Operar: Ver la cartera (icon-cartera-v-1, icon-cartera-1), Cobrar y pagar (carteras-5, icon-cartera-v-2, v-3, icon-cartera-2), Remesas (icon-cartera-v-4, v-5, v-7, carteras-7, icon-cartera-v-6), opcional Para saber más (icon-cartera-3).
6 Tesorería: Configurar: tesoreria-1, tesoreria-2. Operar: tesoreria-3..5; icon-cartera-v-8..11; opcional tesoreria-6..8.
7 Impuestos: Configurar: icon-impuestos-conceptos, -1, v-1, v-2, v-3. Operar · Declarar: -2, -4, -3.
8 Activos: Configurar: icon-activos-conceptos, -1, v-4. Operar: icon-activos-v-1, v-2, v-3; Amortizar y dar de baja: -2, -3.
9 Contabilidad avanzada y cierre (`contabilidad-avanzada`, nuevo): solo Operar · Cerrar el año: icon-contabilidad-2, icon-contabilidad-3.

## Qué se movió
- maestros.json: salen maestros-v-1, v-2, 1 (a icon-contabilidad.json) y maestros-2, maestros-3 (a compras.json). Quedan maestros-v-3 y v-4.
- icon-contabilidad.json: salen icon-contabilidad-2 y -3 (a contabilidad-avanzada.json). Título pasa a «Contabilidad básica».
- Se movieron los objetos tal cual (mismos ids de bloque y de sección).
- Imágenes: no se movió ningún fichero. `imgSrc` (content/index.ts) localiza la carpeta de origen por el nombre del fichero (mapa CARPETA_ORIGEN de los bloques movidos), así que las rutas siguen resolviendo y también en el examen y «De memoria».

## Progreso
Se guarda por id de bloque (`p.ejercicios[id]`) y por clave de examen: no cambia nada, no hace falta migración. Los alias de módulo no cambian (los ids antiguos siguen existiendo). Exámenes de módulo: claves = id de módulo (`icon-contabilidad`, `compras`, `maestros` conservan su nota).

## Código
- `etapas.ts`: `DefEtapa` con `fase`, `nota`, `enlace`; `FASES` con la frase de cada fase.
- `lib/ruta.ts`: `Etapa` hereda esos campos; una etapa sin bloques se conserva si trae nota.
- `ModulePage.tsx`: encabezados visibles «Configurar» y «Operar» (con frase, `id="configurar"` / `id="operar"`), apartados con subtítulo, aviso arriba «Si vas a usar el ERP como usuario, empieza por Operar» con desplazamiento a Operar (solo en módulos con las dos fases); módulos sin bloques muestran «Próximamente». CSS en `pages/ruta.css`. El enlace usa scroll suave, no `#operar` real, porque el router es HashRouter.
- `index.ts`: ORDEN nuevo, META de los dos módulos nuevos (iconos `cerebro` y `balanza`), «Contabilidad básica»; `esFinanzas` incluye `contabilidad-avanzada`.
- Numeración de módulos 0–9 en Home, Sidebar y página de módulo. FICHAS (portadaDatos.ts) para los dos módulos nuevos y reescritas las de Maestros y Contabilidad básica.
- Módulos vacíos: avance global, insignias y «Listo para el examen» ignoran los módulos sin bloques (`avance.ts`, `badges.ts`, `Logros.tsx`).
- `lib/examen.ts` (examen final): el ordenar-circuito excluye Fundamentos; las rutas de menú siguen cogiendo los bloques `maestros-*` aunque vivan en un módulo de finanzas. Aviso: el contenido de los exámenes finales ya generados cambia al cambiar la lista de módulos.

## Exámenes y glosario
- Banco de maestros (14 preguntas): 5 sobre tercero/cuenta/relaciones pasan a `icon-contabilidad`, 5 sobre artículos pasan a `compras`; maestros se queda con 4 (empresa y banco).
- Banco de `icon-contabilidad`: 4 preguntas de cierre/reapertura/balances/consolidación pasan al banco nuevo `examenes/contabilidad-avanzada.json` (4 preguntas).
- Fundamentos no tiene examen (no rompe: `claveExamen` devuelve null).
- Glosario: no se tocó (los términos siguen asignados al módulo donde estaban; el nuevo ORDEN solo cambia el orden de los módulos en el filtro). Pendiente si se quiere repartir.

## Textos corregidos
- compras.json: referencias a «Maestros», «bloque 1» y «bloque 6» sustituidas por el título del bloque; resumen.
- maestros.json: resumen y circuito nuevos; tabla de códigos con módulo y fase donde se crea cada uno (C, P, R, AG → Contabilidad básica; ROD, ALM → Compras; S → Maestros; V, E, CAR, BBVA → Cartera).
- carteras.json: «creaste en Maestros» (AG{INI}) → Contabilidad básica; «bloque 6/7», «ejercicios 14 a 17»; «Contabilidad general».
- tesoreria.json: «Asientos, ejercicio 14» → bloque «Entender el asiento de un movimiento de banco»; referencias a ejercicios numerados.
- icon-contabilidad.json: título, resumen, circuito y «módulo Contabilidad general» → «Contabilidad básica».

## Pendiente / aviso
- Los vídeos (`videoMapa.ts`, `video-*.ts`, `MOMENTOS_MODULO`) siguen asociados por módulo antiguo: el vídeo de introducción cuelga de `maestros` (encajaría en Fundamentos) y la serie de contabilidad de `icon-contabilidad`; no se tocó. Los momentos por id de bloque siguen funcionando.
- `sims/Circuito.tsx` dice «bloque 3 de Compras» (texto del simulador, no tocado).
- No hay hueco para los bloques *Nuevo* del menú: se añaden al final de la etapa que toque en `etapas.ts`.
