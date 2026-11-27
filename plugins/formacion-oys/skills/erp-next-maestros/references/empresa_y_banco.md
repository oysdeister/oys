# La empresa, su ejercicio y su banco (`maestros-v-3`, `maestros-v-4`)

Fuente: `app/src/content/maestros.json` (ids `maestros-v-3`, `maestros-v-4`), `etapas.ts` (maestros › «La empresa»), `_fuente/CODIGOS_ALUMNO.md`.

## Índice
1. Qué es una empresa en Axional
2. Leer la ficha (empresa 0)
3. Crear tu empresa S{INI}
4. Ejercicio y banco propio
5. Errores

## 1. Qué es una empresa
La sociedad que lleva su propia contabilidad; cada factura, asiento o movimiento de stock tiene una. Axional es **multiempresa y multimoneda**. Si grabas en la empresa equivocada, los importes acaban en la contabilidad de otra. La ficha guarda identificación fiscal, fecha de inicio, zona impositiva, plan contable y moneda. Relación **empresa-tercero 1 a 1**.

## 2. Leer la ficha (ruta «Finanzas › Maestros › Parametrización › Empresas»)
La demo tiene dos empresas: **0 Deister Software** (tercero 0; inicio 01-01-2000; Abierto; tipo ID NIF-Persona, NIF de prueba; zona **ESCO** «España continental»; moneda EUR; plan **ES / PGE 2008**; ejercicios 2019-2027) y **DIS Distribuidora S.L.** (tercero 00003). Campos clave: Empresa, Nombre empresa, Fecha inicio (no se contabiliza antes), Zona impositiva, Estado, Moneda empresa («Divisa funcional»), Plan contable, cuentas de diferencias de cambio (vacías en la 0: no trabaja con divisas) y Calendario (España). Sin plan contable desde el inicio, no se puede contabilizar. Pestañas de la ficha: Empresa, Ejercicio, Bancos propios, Clasificación, Empresa y agencias tributarias, Ajustes de impresión, Prorrata por empresa.

## 3. Crear tu empresa S{INI}
Orden (porque la empresa copia su identificación de un tercero):
1. **Tercero `TS{INI}`** («Finanzas › Maestros › Terceros › Registro terceros» › «Añadir tercero»): Nombre «Empresa prácticas {INI}», País emisor ES, Tipo ID fiscal NIF-Empresa, Id. fiscal B76543214 (NIF de prueba), Categoría la misma que el tercero 0 (en «Más datos»). Guardar → «Ver registro». Si se crea sola una relación contable, déjala. Pestaña Direcciones: «Añadir dirección», CP 08001 + dirección (dirección 0, domicilio fiscal). «Validar». **No** uses `C{INI}` ni `T{INI}`.
2. **Empresa** («Empresas» › «Añadir empresa»): Empresa = `S{INI}` (máx. 4 caracteres), Nombre «Empresa prácticas {INI}», Fecha inicio 01-01-2026, Estado Abierto, Moneda EUR, Plan contable ES (PGE 2008); «Datos fiscales»: Tipo ID NIF-Empresa, Estado emisor ES, Prorrata No (descuenta todo el IVA deducible). Pestaña «Identificación social»: Tercero `TS{INI}`, Dirección fiscal 0 (copia Id. fiscal, país, dirección, CP…). Si al guardar pide NIF empresa, el mismo B76543214. Aviso «¿Quieres guardar la dirección?» → «Guardar».
3. Revisa que la ficha tiene las mismas pestañas que la de la empresa 0.

`S{INI}` no tiene tipologías ni plantillas de contabilización: sirve para aprender, no para facturar. Las operaciones del curso van a la **empresa 0**.

## 4. Ejercicio y banco propio
- **Ejercicio**: ficha de la empresa › pestaña «Ejercicio» › «Añadir ejercicio»; Empresa viene rellena, Ejercicio 2026, Descripción «EJERCICIO 2026». Se proponen Estado Abierto, Numeración «Ejercicio» y Último asiento 0. Sin ejercicio abierto no se contabiliza. Basta el del año de trabajo.
- **Banco propio** (pestaña «Bancos propios» › «Añadir bancos propios»): Proyecto 0 y Sección 0, Cuenta financiera `CAIXA{INI}`, descripción «Banco Caixa {INI}», Tipo de dirección 0, elegir Banco y Entidad financiera de las listas, **Banco e IBAN a la vez** (IBAN de ejemplo `ES9121000418450200051332`), Cuenta 57200.00000, Agrupación cuentas = **CA** (ya existe; la propia `AG{INI}` se crea después en Contabilidad básica).

## 5. Errores
- «No me deja guardar la empresa»: campos con asterisco en Datos, Datos fiscales o Identificación social.
- No ves `S{INI}` en la lista: ¿guardaste? Filtro «Todos» o lupa con Empresa = S{INI}.
- «Las siguientes restricciones de verificación fallaron: Entidad y cuenta bancaria, ambos nulos o no nulos»: Banco e IBAN a la vez.
- Hay un código de prueba SCAP en la captura de alta (no guardado): no es del alumno.
