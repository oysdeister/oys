# La interfaz del ERP nuevo, por dentro

Fuentes: `app/src/content/fundamentos.json` (bloque `fundamentos-navegar`), `nueva/mapa_erp_nuevo.md`, `nueva/notas_circuito.md`, `nueva/diferencias.md`, `nueva/ventas/NOTAS_VENTAS.md`. Interfaz Vue/Vuetify, tema oscuro por defecto en la demo.

## Índice
1. Barra superior y menú
2. Buscador
3. Rejilla
4. Consulta con la lupa
5. Ficha
6. Ventanas de alta (modal), desplegables y pantallas de variables
7. Procesos, estados y Docflow
8. Ayuda y metadatos
9. Reglas para explicarlo a un junior

## 1. Barra superior y menú
Izquierda: botón del menú lateral (abre y cierra), «Manager» y la base de datos («BBDD TUTORIAL»). Centro: buscador. Derecha: avisos y usuario. El menú es un árbol; las rutas van con «›». Raíces que usa el curso: **Finanzas** (Maestros, Facturación, Cobros y Pagos, Tesorería…) y **Gestión** (Maestros, Compras, Ventas, Logística…). Si el menú no aparece, es el botón de la esquina superior izquierda.

## 2. Buscador
Ctrl+K (⌘K). Una o dos palabras, sin tildes. Muestra nombre de pantalla y código técnico. Sirve también para llegar por el código (`clientes`, `garticul`, `galmacen`, `cmunicip`). Si no sale, una palabra más corta o recorrer la carpeta del módulo.

## 3. Rejilla
Una fila por registro; el número de la izquierda abre la ficha. Muestra unas 25 filas: un registro recién creado puede no estar en la primera página (no significa que no se guardó): usa «Filtros» (p. ej. Descripción = RODAMIENTO*) o la lupa. Clic en el título de columna ordena. «Todos» y los filtros activos limitan lo que ves: si falta un registro, revísalos primero.

## 4. Consulta con la lupa
Abre un formulario de variables con los campos por los que buscar; rellena solo lo que conozcas y «Ejecutar consulta». Un solo resultado abre la ficha. Buscar no cambia datos. Algunas pantallas (Cuentas contables, Países, Municipios) se abren directamente en modo consulta, sin rejilla: se escribe el filtro (`43000*`, `Espa*`) y se ejecuta.

## 5. Ficha
Cajas plegables y pestañas por temas (p. ej. empresa: Empresa, Ejercicio, Bancos propios…). Asterisco rojo = obligatorio. Los campos de ayuda tienen `title` (ayuda por campo al pasar el ratón). Botones de la barra: Nuevo, Guardar (disquete), Eliminar (papelera, con confirmación), Anterior/Siguiente, Buscar, Recargar, ⋮. El ⋮ da Información (consultas SQL, estadísticas, diccionarios del objeto), Metadata, Imprimir y Exportar. Barra lateral «Datos de control»: creado/modificado por y fecha. Guardar solo se activa con cambios; sin pulsarlo se pierden.

## 6. Ventanas de alta, desplegables, variables
- Muchos altas («Añadir tercero», «Añadir relación», «Añadir dirección», «Nuevo» en pedidos) abren una **ventana emergente** con todos los campos. En las filas editables de una pestaña pueden faltar campos (p. ej. Plan contable): usa el botón «Añadir…».
- Desplegables: escribe el código y elige la fila; algunos (Familia de artículo) no muestran opciones al escribir: teclea el código exacto y sal con Tab. Campos de fecha: escribe sin guiones (`31122099`).
- Pantallas de **variables** (traza de movimientos por artículo, informes): formulario de filtros + «Ejecutar consulta».
- El código admite un máximo de caracteres (ver `_fuente/CODIGOS_ALUMNO.md`): con 2 iniciales todos caben.

## 7. Procesos, estados y Docflow
Estados: Provisional → Validado → Contabilizado (según objeto). Botones por estado: Validar, Pasar a provisional, Contabilizar, Descontabilizar, Anular. Procesos desde «Acciones» (Generar factura…) o desde menús propios (Generación de albaranes desde pedidos). Docflow: menú ⌄ junto a la estrella del título, gráfico de documentos relacionados. Workflow: Gestionar / Autorizar / Retroceder; pestaña «Evolución de workflow»; campos Validaciones y Bloqueos. «Datos de control» sustituye al CRC antiguo (no existe CRC).

## 8. Ayuda y metadatos
Ayuda por campo (`title`), panel Información (SQL, Bean, Security) en ⋮, glosario de la plataforma. Los menús de varios ficheros muestran el nombre de objeto técnico entre paréntesis.

## 9. Reglas para explicarlo a un junior
- Di siempre dónde está el botón («arriba a la derecha») y qué se ve después.
- Rótulos literales entre «».
- Aclara que la base es de pruebas y que Cancelar no graba.
- No des por sabido qué es una rejilla, una ficha o un maestro; la primera vez, una frase con un ejemplo.
