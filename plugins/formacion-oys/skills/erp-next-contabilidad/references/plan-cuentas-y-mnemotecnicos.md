# Plan contable, cuentas y mnemotécnicos

Fuente: `icon-contabilidad.json` (maestros-v-1, maestros-v-2, parametrizacion-1, parametrizacion-2, contab-mnemotecnicos-alta), `_fuente/CODIGOS_ALUMNO.md`, `erp-nuevo-icon-documentacion` (PAGE 799, 1004).

## Índice
1. Planes contables
2. La cuenta: formato, subcuentas e indicadores
3. Alta de una cuenta propia (62999)
4. Modificar y renumerar
5. Mnemotécnicos
6. Mnemotécnico {INI}626 (comisiones bancarias)

## 1. Planes contables
- Finanzas › Maestros › Cuentas contables › Planes contables. En TUTORIAL hay cuatro: **AD** (PG Andorra 2012), **ES** (PGE 2008, el de España), **PE** (PG Perú 2019) y **PT** (PG Portugal). Cada país codifica a su manera.
- «Formato cuenta contable» del plan ES: `#####.#####` (5 cifras, punto, 5 cifras).
- Primero va el plan, luego las cuentas: sin plan no se crean cuentas. Es el primer paso de la configuración contable.
- Grupos del PGC: 1 financiación propia, 2 inmovilizado, 3 existencias, 4 clientes/proveedores/Hacienda, 5 bancos y caja, 6 gastos, 7 ingresos.

## 2. La cuenta (`ccuentas`)
- Formato `43000.00901`: a la izquierda la cuenta base (43000 = clientes, 40000 = proveedores); tras el punto, el código del tercero (subcuenta). `43000.00000` es la genérica.
- Indicadores de la ficha:
  - **Posición** (Debe/Haber): dato de la ficha, no la regla del asiento (trampa para juniors: 10200 Capital muestra Debe y crece por el Haber).
  - **Tipo**: Normal, Terceros (430/400, abre subcuentas y activa impuestos y cartera), Entidades financieras (bancos), Costes (gastos e ingresos de gestión, grupos 6 y 7; piden analítica) o Analítica (grupo 9).
  - **Activa** (qué procesos auxiliares: I impuestos, E efectos, C costes; en las 430 de la demo `IEV`) y **Activar** (en qué lado: Debe, Haber, Ambos).
  - **Periodificable**: No, Periodificación (reparte a partes iguales) o Distribución (con porcentajes). Ejemplo: seguro anual de 1.200 € pagado en enero, 100 € al mes.
  - **Días máximos** (999 = sin límite práctico), **Grupo** (Standard; marca partes vinculadas para la memoria), **Grupo auxiliar** (ver `analitica.md`), **Estado** (solo cuentas Abiertas admiten apuntes).
- Consulta: la pantalla abre en modo consulta; `10200*` («empieza por») + «Ejecutar consulta»; se abre la ficha pulsando el número de fila (no el código subrayado, que abre un menú de pantallas relacionadas).
- Con el tipo Terceros, la cuenta del cliente muestra el aviso «Cuenta contable en operación. Esta cuenta ya está asociada a otro tercero» si es la genérica compartida: señal de que conviene darle subcuenta propia (ver `datos-basicos.md`).

## 3. Alta de una cuenta propia (parametrizacion-1)
- Práctica: **62999.00000 «Gastos varios {INI}»**, plan ES, Tipo Costes, Activa C, Activar Ambos, Posición Debe, Estado Abierto, Grupo Standard, 999 días, Periodificable No. Se copia el modelo de las 629* existentes (consulta `629*`).
- En «Plan contable» escribe el **código** (ES), no la descripción (PGE): si no, «Error en la validación» y a veces `TypeError: Cannot read property 'split' of null` (la pantalla no sabe qué formato de cuenta aplicar). Escribe ES, sal con Tab o elige la fila.
- Base compartida: si 62999.00000 ya existe, filtra `62999*` y usa un número libre (p. ej. 62999.00001) en todos los bloques siguientes.
- No es la cuenta de las comisiones del caso (esas van a la 62600 «Servicios bancarios y similares»); sirve solo para practicar el alta.

## 4. Modificar y renumerar (parametrizacion-2)
- La descripción se cambia en la ficha y se guarda con el disquete de la barra superior (barra vertical azul = cambio sin guardar). Es solo la etiqueta: se puede cambiar aunque haya apuntes.
- El **código** no se cambia en la ficha: con movimientos se usa Finanzas › Maestros › Cuentas contables › Cambio código de cuenta.

## 5. Mnemotécnicos (maestros-v-2)
- Un mnemotécnico es un alias de 5 cifras (en TUTORIAL coincide con la cuenta base: 10200 → 10200.00000). Una línea de detalle por plan contable («Detalle cuentas mnemotécnicas»).
- Lo usan artículos (compras 62300, ventas 70500), tipos de tercero (001 Clientes → 43000, 002 Proveedores → 40000: Finanzas › Maestros › Terceros › Clasificación › Tipos de terceros, `ctipoter`), tipologías y flujos de tesorería.
- La subcuenta propia de un cliente (43000.00901) **no** sale del mnemotécnico: se indica en su perfil contable.
- Si el tipo de tercero no indica los mnemotécnicos de cliente/proveedor, al dar de alta un tercero no se crean las cuentas.
- Alta (contab-mnemotecnicos-alta): Mnemotécnicas de cuentas › «Añadir cuentas» (abre «Cuentas mnemotécnicas»; el botón dice «cuentas» aunque crees un mnemotécnico) → código + descripción → Guardar → abrirlo (la lista ordena de menor a mayor y los códigos con letras salen al final: ordena de mayor a menor) → «Añadir detalle» → plan **ES** (cuidado: PT está debajo) → cuenta. El campo Cuenta depende del plan: elige primero el plan.
- Compartidos por toda la base: pon `{INI}` en el código. `{INI}001` «Gastos de prueba {INI}» → 62999.00000 (solo práctica; no se usa para comisiones). Un mnemotécnico puede apuntar a cuentas distintas en cada plan; un plan sin línea no se puede traducir.

## 6. {INI}626 (comisiones del banco)
- `{INI}626` «Servicios bancarios {INI}» → **62600.00000** «Servicios bancarios y similares» del plan ES (existe en TUTORIAL, tipo Costes, sin grupo auxiliar: no la crees). 5 caracteres, como `{INI}001`.
- Lo usa el flujo de tesorería `{INI}COM` (comisión de mantenimiento de 10,00 el 12-11-2026 y comisión de 3,50 del pago a T{INI}). Una comisión es un servicio bancario, no un gasto vario. Se crea en los dos últimos pasos de «Enlazarlo a una cuenta de un plan»; si no se hizo, `tesoreria-2-flujo` lo explica.
- Sin cuenta contable en el flujo, el movimiento de tesorería no se puede contabilizar.
