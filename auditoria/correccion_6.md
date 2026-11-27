# Corrección 6: interfaz (juniors otro sector, sin ERP, sin contabilidad)

## Portada (Home.tsx, portadaDatos.ts)
- Entrada: «El ERP es donde la empresa apunta todo: un fallo aquí es un cobro que se pierde» y «empieza por el 0, Fundamentos».
- Nota «No necesitas formación previa»: ahora dice Fundamentos (módulo 0), no Datos maestros.
- Hito «Hoy: 1 bloque · N min» junto al tiempo total (N sale del bloque que toca).
- Práctica vs Demo real: se dice que, si el bloque tiene Práctica, se hace primero; «De memoria» es el único paso opcional (así es en el código, no «1, 2 y 4»).
- Ventas se anuncia como del albarán a la factura y, en el circuito completo, de la oferta a la factura; el vencimiento queda en cartera. (El `resumen` de ventas.json sigue diciendo «de la oferta al cobro»: es de otro agente.)

## Búsqueda ⌘K (lib/buscar.ts)
- Glosario: el fragmento empieza por el inicio de la definición.
- Título exacto +40; título que empieza por lo buscado +10; empate: título más corto. «IVA»: IVA, IVA soportado, IVA repercutido antes de «Cuentas de IVA».
- «dónde» muestra «Módulo · título del bloque» (ya no «bloque N»).

## /errores (Errores.tsx, errores.css)
- Duplicados idénticos (mismo problema y solución) en una tarjeta con enlaces a todos los bloques. Con los JSON actuales: 332 avisos pasan a 327 tarjetas.
- Sección «Lo que más pasa» (los que salen en varios bloques), y dentro de cada módulo, primero los más repetidos.
- Búsqueda sin palabras vacías (no, me, puedo, deja...), con raíz para coincidencia parcial («cobrar» encuentra «cobro»); si no hay coincidencia total, enseña los parecidos con un aviso.
- Enlaces con el nombre del bloque, no «Bloque N».
- Mensajes técnicos (texto entre «» con «:», «[», «_», «error», «#e», o que empieza como `tabla: ...`, TypeError, ORA-): aspecto de código y etiqueta «Mensaje del ERP»; no se reescriben.

## Módulo y menú
- ModulePage: «Cómo moverte por el ERP: está en Fundamentos › Moverse por el ERP» (enlace a fundamentos-navegar).
- Aviso: «¿La empresa ya está configurada? Ve directo a Operar. Si es tu primera vez, empieza por el bloque 1, en Configurar.»
- Sidebar: una fase sin bloques (Ventas › Configurar) es un enlace informativo «ya lo tienes, ver qué reutilizas», sin contador ni despliegue.

## Glosario
- Nuevo glosario/fundamentos.json: ERP, Contabilidad, Debe, Haber, Asiento, Apunte, IVA soportado, IVA repercutido, Efecto, Conciliar, Cierre del ejercicio (alias Cierre). Al ir primero en el orden de módulos, su definición llana prevalece al fusionar con las que ya existían.
- icon-impuestos.json: AEAT, HP (Hacienda Pública), 4T (cuarto trimestre). icon-contabilidad.json: Saldo acreedor, Saldo deudor. carteras.json: Impagado. compras.json: alias ACR y Acreedores en «Acreedor».
- Nota: «4T» y «HP» miden menos de 3 letras, así que no se subrayan en el texto (regla de glosario.ts); se encuentran por «Cuarto trimestre» y «Hacienda Pública».

## Comprobación
- `npm --prefix app run build` correcto. Lint: sin errores nuevos (solo el de src/erp/catalogo/Generica.tsx, previo).
- Navegador (localhost:5191): portada, #/modulo/compras, #/errores y ⌘K «IVA» comprobados; Ventas muestra el enlace «ya lo tienes».
- No se probó en el navegador la búsqueda «no puedo cobrar» ni las tarjetas «Mensaje del ERP» (la lógica está compilada).
