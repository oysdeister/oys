## 4. Conceptos clave

- **Hasta 4 impuestos por línea**: las facturas de finanzas permiten detalle de impuestos por línea; la versión Nexo y últimas versiones 2021 soportan por defecto 4 impuestos por línea. Al sumarizar, vía disparador o acumulador, se rellena una tabla auxiliar con bases y cuotas en el comprobante de compra/venta (23-35, 75-84).
- **Operación fiscal y tipo de impuesto**: son los dos conceptos centrales del detalle fiscal. La operación fiscal sirve para mapear en qué casilla/declaración se consignará; el tipo de impuesto da porcentaje y forma de cálculo (104-112, 124-132).
- **Módulo fiscal `C-TAX`**: todo el módulo fiscal moderno usa tablas con prefijo `C-TAX`. Los periodos fiscales pasan de la antigua `C-IN-CONT` a `C-TAX-PIRI`; también se modernizan nombres de zonas, impuestos y reglas (319-322, 145-150).
- **Periodo fiscal vs periodo contable**: el periodo fiscal normalmente es por meses naturales calendario, mientras que el contable puede seguir otro ciclo anual (50-56).
- **Agencias tributarias**: se definen por empresa/sucursal/ubicación y tienen periodos tributarios con fecha inicio/fin. La fecha fin sirve para cerrar periodos e impedir movimientos posteriores (57-75).
- **Origen del dato fiscal**: el módulo se alimenta de albaranes/facturas de compra y venta, facturas sencillas de contabilidad, POS, entradas por tesorería y duplicación de asientos con impuestos (76-94).
- **Tabla maestra central: reglas de asignación `C-Tax Rule`**: concentra la parametrización del cálculo de impuestos. Los campos principales son zona de empresa, zona del tercero, tipo de CIF, clave del tercero, clave del artículo y tipo de impuesto (559-667, 1066-1085).
- **Maestros que alimentan la regla**: la empresa guarda su zona impositiva en `Identificación fiscal`; el tercero guarda zona impositiva en `Direcciones`; el artículo guarda su `clave fiscal`, p. ej. BOG = bien ordinario/general (719-748, 772-798, 863-874).
- **Tipo de impuesto**: define el porcentaje, p. ej. IVA español general 21%, y la base de cálculo: importe neto para IVA/IGV o importe con impuestos previos para casos como retenciones. También esconde mnemotécnicos contables, p. ej. cuenta 472 de IVA (1136-1223, 1257-1265).
- **Resultado al validar la factura**: se crea la pestaña de impuestos por documento, mostrando operación, tipo de impuesto, base, porcentaje, importe y el ID de la regla que lo calculó (923-1015).
- **Código de operación**: dentro de la regla se codifican operaciones de compra y venta, p. ej. `CLBC` = compra local de bienes corrientes, para ubicar importes en la declaración (960-967, 1090-1128).
- **Varias reglas en un mismo documento**: si hay artículos con claves fiscales distintas, se generan reglas distintas; si comparten clave, se suman en la misma fila. La cabecera es la sumatoria de líneas (1844-1934).
- **Variantes por país**: Perú usa además clave de documento SUNAT, régimen del tercero y tipo de RUC para distinguir factura/boleta/honorarios/guías o aplicar IGV reducido temporal (1996-2112).
- **Destino final**: el detalle fiscal calculado es la base/origen para las declaraciones mensuales, semestrales o anuales, como el PDT 621 en Perú (1935-1979).

## 5. Problemas típicos

| Problema | Cómo se resuelve | Segundo |
|---|---|---|
| No existe regla para la combinación empresa/tercero/artículo | Al validar, el sistema arroja error y pide crear un registro en `C-Tax Rule`/`ZRule` con las combinaciones detectadas. Hay que ir a reglas de asignación y dar de alta la regla necesaria | 1381-1383, 1628-1667 |
| Se cambia la zona impositiva del tercero y no se entiende por qué cambió la regla | El sistema busca la regla que coincida con zona empresa, zona tercero y clave artículo. Si la zona cambia, p. ej. ESAR → ESCO, aplicará otra regla; si no existe, fallará | 1397-1414, 1601-1642 |
| En versión Nexo no aparece el botón de nuevo registro | Hay que ubicarse en **modo lista**; solo así se habilita el botón de nuevo registro | 1427-1442 |
| Una factura muestra varias filas de impuestos/reglas | No es un duplicado: se genera una fila por cada combinación distinta de regla. A nivel de línea se ve el cálculo individual y en cabecera la sumatoria | 1844-1934 |
| Empresa con varias sedes o regímenes fiscales diferentes | La zona impositiva se configura en la dirección del tercero y en la identificación fiscal de la empresa, no como un único valor global | 2187-2228 |
| Cálculo incorrecto de retenciones | Revisar la base de cálculo del tipo de impuesto: IVA/IGV suele usar importe neto; retenciones pueden requerir importe con impuestos previos | 1165-1223 |
| Error al mapear importes a un formulario | Revisar el código de operación en la regla, p. ej. `CLBC` para compra local de bienes corrientes; si falta o está mal, no se ubicará en la casilla | 960-967, 1098-1128 |
| En Perú, una regla no distingue tipo de documento SUNAT o régimen especial | Agregar variantes como clave de documento SUNAT, régimen del tercero y tipo de RUC; por ejemplo factura vs honorarios no aplican el mismo impuesto | 1996-2112 |

## 6. Preguntas de test

1. **¿Cuál es la tabla maestra principal para parametrizar el cálculo de impuestos?**  
   A. `ctax_piri`  
   B. `ctax_rule` / reglas de asignación  
   C. `ctax_type`  
   D. `gcomfach`  
   **Correcta: B.** Es la tabla que concentra las variables del cálculo fiscal (559-567).

2. **En el ejemplo de factura de compra de ALA Triatlón con Telefónica España y material deportivo, la regla 2586 se activa por la combinación:**  
   A. ESAR + ESCO + BOG  
   B. ESAR + ESAR + BOG  
   C. ESAR + ESAR + SOR  
   D. ESAR + ESCO + SOR  
   **Correcta: B.** La regla 2586 tiene zona empresa ESAR, zona tercero ESAR y clave de artículo BOG (1066-1085, 1591-1603).

3. **¿Qué datos fiscales se guardan en el maestro de empresa?**  
   A. Solo el nombre fiscal  
   B. Tercero, RUC/CID y zona impositiva  
   C. La lista de artículos exentos  
   D. La periodicidad contable  
   **Correcta: B.** En la pestaña de identificación fiscal se relaciona el tercero, se coloca el RUC y se asigna la zona impositiva (719-748).

4. **¿Dónde se configura la zona impositiva de un tercero?**  
   A. Maestro de terceros > Direcciones  
   B. Maestro de artículos > Clave fiscal  
   C. Maestro de empresas > Identificación fiscal  
   D. Tipología de documento  
   **Correcta: A.** Se encuentra en la subtabla de direcciones del tercero (772-798).

5. **El código numérico que aparece en la pestaña de impuestos por documento, p. ej. 2586, es:**  
   A. El número de asiento contable  
   B. El ID de la regla de impuestos usada  
   C. El código de operación SUNAT  
   D. El código del tercero  
   **Correcta: B.** Es el ID de la regla que viene de la tabla de reglas de impuestos (1000-1015).

6. **Si al validar una factura no existe regla para la combinación detectada, el sistema:**  
   A. Aplica la regla más parecida  
   B. Deja el impuesto en cero  
   C. Arroja error y pide crear un registro de regla  
   D. No valida hasta reiniciar  
   **Correcta: C.** Pide crear el registro con las combinaciones que detecta (1628-1667).

7. **Además del porcentaje, ¿qué otro parámetro clave define el tipo de impuesto?**  
   A. El color de factura  
   B. La base de cálculo  
   C. El vendedor  
   D. La forma de pago  
   **Correcta: B.** Define si se calcula sobre importe neto o sobre importe con impuestos previos (1165-1223).

8. **Una factura con dos artículos de claves fiscales distintas, p. ej. BOG y SOR, genera:**  
   A. Una sola regla sumando ambos  
   B. Un error de descuadre  
   C. Dos reglas distintas en impuestos por documento  
   D. Ninguna regla  
   **Correcta: C.** Se genera una fila por cada combinación distinta de regla (1844-1934).

9. **El código `CLBC` que aparece en impuestos representa:**  
   A. Una clave fiscal de artículo  
   B. Un tipo de CIF  
   C. Una operación fiscal de compra local de bienes corrientes  
   D. Una cuenta contable  
   **Correcta: C.** Es la operación fiscal usada para mapear el importe en la declaración (960-967).

10. **En la versión Nexo, para crear un nuevo registro de factura hay que:**  
    A. Estar en modo ficha  
    B. Estar en modo lista para habilitar el botón nuevo registro  
    C. Borrar caché  
    D. Usar una transacción distinta  
    **Correcta: B.** Solo en modo lista se habilita el botón de nuevo registro (1427-1442).

11. **En Perú, además de zona empresa, zona tercero y clave de artículo, se puede usar en la regla:**  
    A. El código de actividad CNAE  
    B. La cuenta de IVA  
    C. La clave de documento SUNAT  
    D. La fecha de vencimiento  
    **Correcta: C.** Permite diferenciar factura, boleta, honorarios, guía de remisión, etc. (1996-2052).

12. **En el módulo fiscal moderno, los periodos fiscales se guardan en la tabla:**  
    A. `C-IN-CONT`  
    B. `C-TAX-PIRI`  
    C. `C-Tax Rule`  
    D. `C-Tax Type`  
    **Correcta: B.** La antigua `C-IN-CONT` pasa a llamarse `C-TAX-PIRI` (319-322).