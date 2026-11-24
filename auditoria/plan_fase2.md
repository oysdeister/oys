# Fase 2: cambios de alcance de la auditoría (pedido de Sergi, 24-11-2026)

Sergi: «no veo la etapa Configurar de Contabilidad y de Compras, ni la parte que dijimos que haríamos y especificamos en la auditoría y el vídeo».

Regla de oro: **ningún id de bloque (ejercicio) ni de sección cambia**. Guardan el progreso y los momentos de vídeo. Un módulo nuevo lleva id nuevo; si un id de módulo deja de existir, va a `ALIAS_MODULO`.

## 1. Nueva estructura (cada módulo con etapas «Configurar» y «Operar», en ese orden)

| Nº | Módulo (id) | Configurar | Operar |
|---|---|---|---|
| 0 | Fundamentos (`fundamentos`, nuevo) | — (solo conceptos: un bloque corto `fundamentos-1`: qué es un ERP, debe y haber, asiento y apunte, IVA, efecto, contabilizar) | — |
| 1 | Maestros (`maestros`) | maestro de empresas y alta de empresa (`maestros-v-3`, `maestros-v-4`) | lo común que quede (moverse por el ERP) |
| 2 | Contabilidad básica (`icon-contabilidad`) | `parametrizacion-icon-1` (orden de carga), `maestros-v-1` (planes y cuentas), `maestros-v-2` (mnemotécnicos), `maestros-1` (datos básicos de Finanzas), `parametrizacion-1…6`, `icon-contabilidad-1` (diarios, periodos, plantillas) | diario, asiento manual, contabilizar (`asientos-*`, `icon-contabilidad-v-*`) |
| 3 | Compras (`compras`) | `maestros-2` (datos básicos de Gestión), `compras-1`, `compras-precios`, `compras-tipos` | `compras-3`, `compras-2`, `compras-factura` |
| 4 | Ventas (`ventas`) | lo que en ventas-1/2 es preparar (si no se puede partir, Configurar = enlace a lo ya preparado en Compras) | ventas |
| 5 | Cartera (`carteras`) | `carteras-1`, `carteras-3` | resto |
| 6 | Tesorería (`tesoreria`) | `tesoreria-1`, `tesoreria-2` | resto |
| 7 | Impuestos (`icon-impuestos`) | maestros fiscales y reglas | declarar |
| 8 | Activos (`icon-activos`) | parámetros | operar activos |
| 9 | Contabilidad avanzada y cierre (`contabilidad-avanzada`, nuevo) | — | procesos masivos, cierre y apertura, balances, consolidación (`icon-contabilidad-2`, `icon-contabilidad-3`) |

Las etapas pueden tener subtítulo (p. ej. «Configurar · El plan de cuentas»), pero el alumno tiene que ver claramente las dos fases.
`maestros-3` (stock) va a Compras, Operar (o a Configurar si es preparación de almacén).

## 2. Pendientes de la auditoría que se aplican ahora

- H18: repartir Maestros (lo hace la nueva estructura).
- H19, H34–H36: bloques largos. Solo se parten si hay forma segura (bloque nuevo con id nuevo y el antiguo sigue existiendo); si no, se reduce la carga (pasos, clics) sin cambiar ids, o se apunta el motivo.
- H23–H26: centralizar repeticiones (tercero, bancos y cajas, tipología, plazos y tipos de efecto, ejercicio y periodos, numerador): una explicación en el módulo dueño y en el resto una frase + «lo viste en …».
- H27 y H47: continuidad: los bloques reutilizan los códigos del alumno (`_fuente/CODIGOS_ALUMNO.md`); caso final de principio a fin con la empresa propia del alumno.
- H41–H46: bloques de cobertura nuevos (ids nuevos), comprobados en la demo (base TUTORIAL, Chrome 9333, registros con prefijo CAP o `{INI}`).
- H32, H33, H39: vídeo y capturas con lo que exista (cap01 de Compras, `nueva/v2/out`); recapturar listados con datos ajenos. Lo imposible se apunta con el motivo.

## 3. Lo que sigue fuera

- H02 (acceso autoservicio) y H03 (numerador y expresión rotos en la demo): dependen de Deister.

## 4. Ampliación de Sergi: enfoque para juniors sin base

Sergi pide que la plataforma sirva a juniors sin conocimiento previo de cómo navegar por el ERP, de contabilidad ni de finanzas. Revisa y reescribe un especialista en finanzas y formación de principiantes (Opus).

1. **Navegación desde cero**: un bloque de Fundamentos, «Moverse por el ERP» (`fundamentos-navegar`). Cubre entrar, el menú, buscar una pantalla, ficha y rejilla, guardar, buscar registros, botones de acción y pestañas, con capturas reales. Cada bloque recuerda en una línea la ruta de menú de su pantalla.
2. **Finanzas desde cero**: `fundamentos-1` y, si hace falta, `fundamentos-2`. Temas:
   - qué es la contabilidad;
   - debe y haber, con un ejemplo del día a día;
   - asiento y apunte;
   - plan contable y grupos 1-7;
   - IVA soportado y repercutido;
   - factura, albarán y pedido;
   - cobro, pago y efecto;
   - banco y conciliación;
   - cierre del ejercicio.

   Cada concepto lleva una frase llana, un ejemplo numérico sencillo y una mini pregunta de comprobación.
3. **Formato de cada bloque**: «Qué vas a aprender» (objetivo), «Por qué le importa a la empresa», pasos con el resultado esperado y «Si algo sale mal…» (problemas). Ningún término se queda sin definir la primera vez: el glosario no sustituye a la explicación en línea.
4. **Caso continuo** para todo el curso: la misma empresa, el mismo proveedor y el mismo cliente del alumno. El hilo va de configurar a comprar, vender, cobrar y pagar, declarar el IVA y cerrar. Cubre H27 y H47.
5. **Revisión con varios juniors simulados**: uno sin estudios contables, uno que nunca ha usado un ERP y uno de otro sector. Hacen el recorrido completo y se corrige hasta que lo superan.
