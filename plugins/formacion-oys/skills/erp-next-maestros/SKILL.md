---
name: erp-next-maestros
description: "Maestros del ERP Deister Axional VNext (demo nextdemo, base tutorial) y el caso continuo del curso - empresa S{INI} con ejercicio y banco, terceros (cliente C{INI}, proveedor T{INI}, tercero de la empresa TS{INI}), relaciones contables CLI/PRO/ACR, artículos (financieros FOR{INI}, logístico ROD{INI}, el 13500620 de la demo), plazos de pago, tipos de efecto, cambios de divisa, cuentas contables, bancos y cajas, almacén ALM{INI}, cuenta logística y stock. Úsala siempre que haya que crear, consultar o explicar un maestro, elegir un código con las iniciales del alumno o resolver errores de alta (restricciones de verificación, Provisional, desplegable vacío)."
---

# Maestros del ERP nuevo y caso continuo

Un **maestro** es una ficha que se crea una vez y se reutiliza en muchos documentos; si está mal, el error se copia en cada factura, efecto o asiento. En el curso los maestros se dan de alta en **Configurar** (antes de operar) y cada módulo posterior los reutiliza. Para orientarte en las pantallas y sus trampas: skill `navegar-erp-next`.

## Mapa de bloques (id → qué crea) — orden de `etapas.ts`
| Módulo / etapa | Bloque (id) | Qué hace | Referencia |
|---|---|---|---|
| Maestros · La empresa | `maestros-v-3` | Lee la ficha de la empresa 0 (tercero, plan ES PGE 2008, EUR, zona ESCO) | `references/empresa_y_banco.md` |
| | `maestros-v-4` | Crea el tercero `TS{INI}`, la empresa `S{INI}`, su ejercicio 2026 y el banco `CAIXA{INI}` | ídem |
| Contabilidad básica · Datos básicos | `maestros-1` (icon-contabilidad.json) | Cliente `C{INI}`, artículo financiero `FOR{INI}`, cambio USD→EUR, plazo `P{INI}`, tipo de efecto `R{INI}`, cuenta 43000.00901 y perfil contable, caja `{INI}CAJA` + agrupación `AG{INI}`, municipio `08{INI}1` | `references/contabilidad_basica.md` |
| Compras · Maestros de compra | `maestros-2` | Cliente en Gestión con condiciones de cobro, artículo `ROD{INI}`, artículo por proveedor, almacén `ALM{INI}`, cuenta logística `RS{INI}` | `references/gestion_basica.md` |
| | `compras-1` | Proveedor `T{INI}` (tercero, relaciones ACR+PRO, dirección, cobro/pago, banco, validar, proveedor de Gestión) y revisión del artículo 13500620 | `references/terceros_y_proveedor.md` |
| Compras · Devolver y controlar stock | `maestros-3` | Movimiento RIDP, stock global y kardex de `ROD{INI}` | `references/gestion_basica.md` |

Otros bloques usan estos maestros: `compras-precios` (lista `TF{INI}` y grupo `G{INI}`), Ventas (`C{INI}` es el cliente del caso), Cartera (plazo `V{INI}`, tipo `E{INI}`, tercero `CAR{INI}`), Tesorería (`BBVA_{INI}`, `{INI}COM`).

## Caso continuo en una frase
Tu empresa **S{INI}** (con tercero `TS{INI}`, ejercicio 2026, banco `CAIXA{INI}`) existe para aprender su ficha, pero **no tiene tipologías ni plantillas**: las operaciones de Compras, Ventas, Cartera y Tesorería se graban en la **empresa 0 «Deister Software»**, compartida. Compras: proveedor propio `T{INI}` y el artículo de la demo **13500620** (6000-2RS ISB, tipo contable PRODUCTO, no se modifica). Ventas: cliente `C{INI}` (el de Maestros). El artículo `ROD{INI}` sirve para aprender la ficha y el stock: **no se compra**.

## Reglas
1. **`{INI}` = 2 letras siempre** (nombre + primer apellido, sin tildes, mayúsculas): varios campos admiten pocos caracteres (plazo y tipo de efecto 3, tipologías 4, diario 2, empresa 4). Tabla completa: `references/codigos_alumno_maestros.md`; fuente `_fuente/CODIGOS_ALUMNO.md`.
2. **Un código, una cosa**: si dos bloques necesitan lo mismo, el segundo lo reutiliza («usa el tercero C{INI} que creaste»). No crees duplicados.
3. **No uses `C{INI}` ni `T{INI}` como tercero de la empresa**: usa `TS{INI}`.
4. Con `TF` (transferencia) la factura necesita cuenta bancaria del tercero; con `PRO` el tercero necesita su relación contable; el artículo debe ser PRODUCTO. Antes de contabilizar, descuentos y pronto pago a 0.
5. Datos de ejemplo, nunca reales: IBAN `ES9121000418450200051332`, NIF `B12345674` (cliente) y `B76543214` (empresa).
6. En la base compartida no cambies lo que no creaste (empresa 0, artículo 13500620, proveedor 00001, familias, cuentas genéricas 43000.00000 / 41000.00000). Cambia solo las propias `{INI}`.
7. Tras cambiar cualquier pestaña de un tercero, vuelve a «Validar».

## Errores de alta más frecuentes
«Hay errores en los datos del formulario» (campo con asterisco rojo vacío o plazos 3 y 4 sin 0) · «restricciones de verificación fallaron: Entidad y cuenta bancaria…» (Banco e IBAN a la vez) · tercero en Provisional (revalidar) · desplegable de Familia vacío (teclear código y Tab) · «Agrupación cuentas» sin opciones (crear antes `AG{INI}`) · «Delegación y departamento no informados» (rellenar en el almacén). Causas y arreglos de cada bloque: `references/`.

## Lecciones de las sesiones (síntoma → causa → regla)
- Tercero que vuelve a Provisional tras validarlo → cada cambio de pestaña lo reabre (workflow TER) → validar al final, con relación, dirección y condición de cobro ya puestas.
- «DOMICILIACION BANCARIA DE LA EMPRESA NO ENCONTRADA» en la prevista de venta → condición de cobro con tipo de efecto TF y sin cuenta de la empresa → usar EF (al contado) o dar de alta la domiciliación.
- Ejemplos del manual que no existen en la demo → en TUTORIAL solo hay las empresas 0 y DIS, 4 planes contables y mnemotécnicos de 5 cifras → contrastar con la demo antes de publicar y usar la empresa 0.
- «Demasiado largo» al crear códigos → campos de 3-5 caracteres → iniciales de 2 letras; los conceptos bancarios propios de 3 caracteres son compartidos por banco: el primero los crea y los demás los reutilizan.
- Factura de un proveedor que solo tiene ACR falla al contabilizar → la tipología pide PRO (PWCP, PWVD y PC estándar llevan PRO; PCCL y PCVL, ACR) → el proveedor debe tener la relación que pide la tipología.

## Preguntas que no resuelve esta skill
Tarifas y documentos de compra: `erp-next-compras`. Asientos, cuentas y diario: `erp-next-contabilidad`. Remesas y bancos de cartera: `erp-next-tesoreria`. Dudas de redacción o verificación de datos: `_fuente/DATOS_DUDOSOS.md` y `criterios-sergi`.
