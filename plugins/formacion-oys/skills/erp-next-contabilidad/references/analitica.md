# Analítica y auxiliares: grupos auxiliares, proyectos y secciones

Fuente: `icon-contabilidad.json` › `parametrizacion-3` a `parametrizacion-6` (bloques opcionales de «parametrización completa»).

La analítica dice a qué parte del negocio pertenece cada gasto o ingreso, con dos etiquetas: **proyecto** (división u obra) y **sección** (departamento o centro de coste). Cada apunte de una cuenta de **Costes** se asigna a un proyecto y una sección (la demo usa 0 «GENERAL»). Así sacas la cuenta de resultados por división o por departamento. En las líneas de asiento también hay Dimensión 1 y 2, obligatorias y a 0 «General» en TUTORIAL.

## Grupo auxiliar (alternativa a las subcuentas)
Lista de códigos que reparte el saldo de una cuenta sin crear una subcuenta por caso (hucha común con pegatinas de colores). Tres pasos: crear el grupo → añadir sus códigos → asignarlo a las cuentas.
1. Finanzas › Maestros › Cuentas contables › Grupos auxiliares (`cctaauxh`) › «Añadir grupos»: `{INI}EMP` (máx. 6 caracteres) «Empleados {INI}» (la descripción se guarda en MAYÚSCULAS). Existe `TERCER` «Terceros» y los de otros alumnos.
2. Abre la ficha del grupo (número de fila) › «Añadir codigos»: `{INI}0001` (máx. 14 caracteres) con un empleado de ejemplo, Estado Abierto. **Trampa**: tras guardar un grupo nuevo la cabecera puede seguir mostrando «Terceros»; si «Añadir codigos» sale con «Terceros» bajo el título, el código iría al grupo TERCER. Cancela y reabre el grupo desde la lista; comprueba que bajo el título sale tu grupo antes de guardar.
3. Cuenta (62999.00000) › campo «Grupo auxiliar» = `{INI}EMP` › disquete. Comprobación: ficha del grupo › «Recargar» (↻) en «Listado de cuentas contables» (no se actualiza solo; «Sin datos» hasta recargar).
Efecto: cada apunte de esa cuenta pide un código del grupo, y el mayor se consulta por empleado. **Consecuencia práctica**: una línea con una cuenta que tiene grupo auxiliar no guarda y marca «Auxiliar» como obligatorio (por eso los saldos iniciales usan 57200 y 10000, que no lo tienen).

## Proyecto (`cproyect`)
Finanzas › Maestros › Auxiliares › Proyectos. Desde la lista, «Añadir proyecto» abre una ventana en blanco sin copiar nada; **«Nuevo» y «Nuevo como» solo salen dentro de una ficha**. Abre antes el proyecto 0 «GENERAL» (número de fila 1) › «Añadir proyecto › Nuevo como» (copia estado y sección, deja en blanco código y descripción) › `DIV{INI}` «División 1 {INI}» (máx. 12) › Guardar («Éxito»). Solo los proyectos abiertos se usan en apuntes; Empresa/Tercero/Dirección limitan o vinculan el proyecto (aquí vacíos).

## Sección (`cseccion`)
Finanzas › Maestros › Auxiliares › Secciones › «Añadir sección»: `{INI}ADM` «Administración {INI}», Abierto (máx. 12; se puede crear también con el «+» de la lista del campo Sección del proyecto). Después asígnala al proyecto: abre DIV{INI}, borra el 0, escribe `{INI}`, elige `{INI}ADM`, disquete. El bloque «Secciones autorizadas» del proyecto limita las secciones combinables; vacío = cualquiera. La sección por defecto del proyecto se propone al contabilizar.

Resultado del tema en TUTORIAL: cuenta ES 62999.00000, grupo `{INI}EMP` con `{INI}0001`, proyecto `DIV{INI}` y sección `{INI}ADM`; no se toca nada de la demo que no sea tuyo.
