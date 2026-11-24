# Hecho: integración 2 (cartera y contabilidad)

Sin commit. JSON (json.load), build y lint correctos (solo avisos previos; sin errores fuera de src/erp).

## Bloques integrados
- `carteras.json` (numero 14-17): cartera-cobro-parcial (en «Cobrar y pagar efectos», tras icon-cartera-2), cartera-mandato-sepa (al final de «Remesas»), cartera-impagado-devolucion y cartera-descuento (apartado nuevo «Impagados», entre Remesas y Para saber más). Resumen del módulo ampliado.
- `icon-contabilidad.json` (numero 15-17): contab-saldos-iniciales, contab-mnemotecnicos-alta, contab-plantilla-alta, al final de «Para saber más: parametrización completa» (opcional).
- `contabilidad-avanzada.json` (numero 8): contab-cierre-practica justo después de icon-contabilidad-2.
- `etapas.ts` actualizado; `index.ts`: contab-cierre-practica añadido a CARPETA_ORIGEN (sus capturas están en img/icon-contabilidad/).
- Cobro de partes y registros de la demo (TCAPK, FVN026-000006, CA026-000004, asiento 83) se presentan como ejemplo; lo del alumno va con {INI}.

## Correcciones contables
1. Devolución: concepto, sección del asiento, test, checklist, problemas y «aprendido» reescritos. Asiento correcto: 43150 «Efectos comerciales impagados» al debe y 57200 «Bancos» al haber (ej. 242,00); gastos a la 626 «Servicios bancarios y similares» al debe (ej. 242,00 + 3,00). Aviso con el texto pedido sobre la plantilla de la demo (cefectos_c_devol) y revisión con contabilidad. Las capturas siguen siendo las de la demo (sentido invertido): se avisa en el texto. Test: 6 preguntas, la del asiento y la de gastos tienen como correcta la contable; sale la pregunta que daba por bueno el sentido de la demo.
2. Mandato SEPA: la 23000.TCAPK deja de presentarse como normal (concepto, paso del asiento, aviso, test, checklist, problemas, aprendido). Lo habitual: 572 al debe y 430/431 del cliente al haber; la demo usa 23000 por la configuración de su plantilla.
3. contab-plantilla-alta: quitada la ruta «Gestión › Compras › Tipologías de factura»; se usa la ya verificada en compras-tipos (Gestión › Compras › Maestros › Documentos › Tipos de facturas) y la pestaña Contabilización queda marcada como no comprobada.
4. carteras-5: el aviso de CSDDS ya no dice que sea imposible; en la demo sí se puede si el tercero tiene IBAN y la factura lleva domiciliación, con referencia al bloque «Domiciliar un cliente: mandato SEPA y remesa de cobro» (aviso, detalle de pasos, checklist, problemas).
5. Imágenes: comprobadas todas (cob-* de los 8 bloques): existen todas, no se quitó ninguna referencia.
Extra: sin «bloque anterior»; referencias por título (p. ej. «Consultar los mnemotécnicos» → «Entender los mnemotécnicos de cuentas»).

## Comprobado en el navegador (5191)
#/modulo/carteras?fase=operar (17 bloques; Impagados con 16 y 17), #/ejercicio/cartera-impagado-devolucion (texto nuevo, capturas visibles), #/modulo/contabilidad-avanzada (3 bloques, el nuevo en 2.º), #/ejercicio/contab-cierre-practica y contab-saldos-iniciales (capturas visibles).

## Pendiente
- Capturas de la devolución y del cobro SEPA muestran el asiento de la demo (al revés / con 23000): no se pudieron rehacer.
- No se tocaron exámenes ni glosario; el aviso del módulo Cartera («Orden de los bloques») no lista los bloques nuevos.
