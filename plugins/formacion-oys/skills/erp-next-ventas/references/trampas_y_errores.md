# Trampas y errores de Ventas (literales, causa y solución)

Índice: A Errores con mensaje · B Comportamientos que desconciertan · C Datos y contabilidad de la demo · D Qué no hacer.
Fuente: `ventas.json` (campos `problemas` y avisos de cada bloque) y las notas de recorrido de la demo (sección 6 y 9).

## A. Errores con mensaje
| Dónde | Mensaje o síntoma | Causa | Solución |
|---|---|---|---|
| Alta de tercero | «Este campo es obligatorio.» en Tipo ID fiscal | el clic no abrió el desplegable del propio campo | abrir el desplegable del campo y elegir (p. ej. NIF-Empresa) |
| Guardar cualquier ficha | «Hay errores en los datos del formulario» | falta un obligatorio (asterisco rojo; el campo sale en rojo con «Este campo es obligatorio») | rellenarlo: Divisa en el cliente, Agente A01 en oferta y pedido |
| Código de tipología, lista o grupo | «Demasiado largo» | tipologías máx. 4; lista y grupo máx. 12; sobran espacios o letras | PD/PV/AP/FP + 2 iniciales; LV/GV + iniciales |
| Guardar A{INI} copiada de AV con la Tabla origen vaciada | «El indicativo de actualización de tabla origen sólo puede informarse cuando la tabla origen está informada…» | las tarjetas Copiar líneas/Actualizar origen copiadas no se desmarcan | cancelar y crear con «Nuevo › Nuevo» en blanco |
| Contabilizar el albarán A{INI} | `iges_get_ctertipo_cuenta: CUENTA DEL TERCERO [C{INI}] NO INFORMADA` | el tercero no tiene relación CLI | Finanzas › Terceros › C{INI} › Relaciones › «Añadir relacion»: Cliente, CLI, ES, Cuenta vacía; guardar |
| Contabilizar el albarán A{INI} | `gconasih_ApplyParams: EXPRESION:[cabecera.impant] NO CONTEMPLADA PARA EVALUAR IMPORTE` | la tipología lleva FV (plantilla de facturas) | poner AV en «Asiento expediciones» y «Asiento albaranes» |
| Prevista o contabilizar la factura | «DOMICILIACION BANCARIA DE LA EMPRESA NO ENCONTRADA.» y faltan líneas (no sale la 70000) | tipo de efecto con «Domiciliación bancaria» «Empresa» (TF) o «Tercero» (DD, R{INI}) sin esa cuenta | atajo de la demo: factura › «Pasar a provisional» › Tipo efecto = EF › disquete › «Validar» › contabilizar; no tocar Forma pago ni el cliente. Con R{INI} el mensaje no se ha comprobado (sin verificar) |
| Prevista con plantilla FVOA | `Cannot invoke "Object.toString()" because "n" is null` | fallo de la demo (asiento FVOA, origen gvenfach); persiste con descuentos y pronto pago a 0 (cliente y factura) | no usar FVOA: FP{INI} sigue con FV y se descontabiliza el albarán A{INI} |
| Contabilizar factura | «fechas fuera de rango de vigencia en empresa» | la fecha cae fuera de los ejercicios de la empresa 0 | no tocar empresa ni ejercicios (compartido); avisar al formador |

## B. Comportamientos que desconciertan
- **Línea del albarán con Importe neto 50,00** (pedido de 10 × 20,00; en la oferta, 2,50 en vez de 110,00): la línea copiada trae el importe mal calculado. Se corrige en la ficha de la línea con «Importe dto.» 1 → guardar → 0 → guardar; reescribir el mismo Precio no recalcula (el disquete ni se activa). Sospecha no comprobada: tiene que ver con Valorar «Tarifa» de AP{INI} (sin verificar).
- **Contabilizar la primera vez solo muestra «Process gconasih_InsertCasientos»** y la factura sigue sin contabilizar: recargar (⟳), comprobar que sigue el botón «Contabilizar», repetir «Contabilizar › Aceptar». Un solo asiento queda creado. Causa no aclarada.
- **El tercero vuelve a «Provisional»** al añadir/cambiar la condición de cobro (workflow TER): «Validar» otra vez, al final.
- **El cliente elegido no rellena dirección ni tipo efecto**: falta salir del campo con Tab.
- **Al elegir el «Origen» se vacía el Cliente** (albarán y pedido): origen primero, cliente después.
- **«Origen» del pedido o del albarán vacío en la lista**: en albarán solo salen pedidos 0PV… de todos los alumnos; elige el tuyo. Oferta con vigencia vencida no aparece como origen: ampliar Fin vigencia.
- **El albarán no sale en «Albaranes de ventas a conformar»**: la condición de FP{INI} debe ser exactamente `tipdoc IN ('AP{INI}','A{INI}')` con códigos correctos y apóstrofos rectos (no comillas curvas); el albarán debe estar Validado y pendiente (los facturados no vuelven a salir).
- **La factura no copia las líneas sola**: FV trae «Copiar líneas» en «Validar»; en FP{INI} debe ser «Sí».
- **Desplegable «Tipo efecto» con «Datos no disponibles»**: teclear letras del código (EF); las listas solo se llenan al escribir.
- **El «Precio» del diálogo de la línea del pedido queda vacío** aunque haya tarifa: se rellena al guardar la línea; mira la rejilla.
- **La factura contabilizada sigue «Validado» en el Docflow**; es normal.
- **«Descontabilizar» no deshace nada más**: el documento sigue Validado/Facturado y la Fecha contabilización queda vacía.
- Los números de captura (0PV000006, etc.) no son los del alumno: la demo es compartida; usar siempre los propios. Las listas muestran registros de otros alumnos y de capturas (CL, CP, VD, CAP): no tocar.
- Hay cuatro objetos distintos para cada documento: tipología (`gvenpedd`/`gvenmovd`/`gvenfacd`/`gvenofed`) y documento (`gvenpedh`/`gvenalbh`/`gvenfach`/`gvenofeh`). Los nombres de tabla del numerador (`gvenmovh` para albaranes) difieren del objeto de pantalla (`gvenalbh`).

## C. Datos y contabilidad de la demo
- **Venta contada dos veces**: contabilizar un albarán A{INI} (AV) y luego una factura FP{INI} (FV) da ventas 400,00 por una venta de 200,00 y 43090 con 200,00 para siempre. Antes de facturar, «Descontabilizar» el albarán.
- **IVA repercutido en la 47000.00000** («Hacienda Pública, deudora por IVA») en vez de la 477 del PGC: configuración de la demo; no la copies como modelo.
- **FVOA** lleva diario **DC «Compras»** y ninguna tipología la usa («Documentos del tipo de asiento» sale «Sin datos»).
- **No hay abono ni rectificativa de venta** en la demo.
- **Stock compartido**: 83 unidades disponibles del 13500620 el 26-11-2026; si falta stock al validar, avisar al formador.
- **ALMACEN CENTRAL** tiene código 0; al teclear CENTRAL lo encuentra por nombre.
- **Tarifa**: la tarifa de la demo (TV) pone el 13500620 a 5,25; con el grupo del curso (GV{INI}) sale 20,00. Si en el pedido sale 5,25 es que el cliente tiene el grupo 00002.
- **Numeración fiscal** (`cdocnumh`): FVN con Control cronológico: facturas correlativas con fechas en orden.

## D. Qué no hacer
- No crear otro tercero o cliente (se abre el existente desde la lista) ni cambiar la condición de cobro de C{INI} (el caso necesita los dos vencimientos de 121,00).
- No crear tipologías de factura distintas de FP{INI} ni de albarán distintas de AP{INI} y A{INI}: un código, una cosa.
- No modificar PED, POF, AV, FV, OV, TV, plantillas (`gconasih`), tipos contables, zona impositiva, ejercicios ni la empresa.
- No pulsar «Evolucionar estado» ni «Retroceder» en la Cartera de efectos de la factura.
- No poner tu grupo de precios a otros clientes.
