# Requisitos de un vídeo para principiantes

Resumen de lo que ha pedido Sergi tras la v1 y de las correcciones de la revisión en Loom del 23-11-2026 (`_fuente/CORRECCIONES_LOOM.md`). La lista de comprobación completa por capítulo está en `criterios_v2.md`; las tablas de vídeos por tabla de finanzas, en `_fuente/VIDEOS_TABLAS.md`.

## Quién ve el vídeo
Un junior sin formación financiera ni experiencia en ERP, sin formador al lado. Por eso:
- Cada término técnico (módulo, maestro, tipo de documento, numerador, asiento, debe y haber, Docflow…) se explica la primera vez en llano, con un ejemplo cotidiano.
- Nada de «antes/ahora», versiones, migraciones ni escenas `comparativa`.
- Saludo «Hola, bienvenidos a O&S Consultores»; producto «Deister Axional VNext» (en la voz, «O y ese» y «uve next»). Castellano de España, tuteo, cifras en números, códigos leídos de forma natural.
- Mucho más despacio que la v1: el alumno repite los pasos mientras mira. La voz nunca va por delante de la imagen (el clic se dice cuando se ve).

## Qué lleva cada módulo
1. **Capítulo 1 = overview**: para qué sirve el módulo, el circuito y un recorrido por el menú. Es el vídeo de bienvenida; la navegación básica por Axional (barra superior, buscador, menú lateral) vive en Maestros, no en cada módulo.
2. Un capítulo por punto del menú, en el orden del curso (maestro, precios, numeración y tipos, documento origen, albarán, factura, contabilización).
3. Un **solo ciclo completo con origen**; el circuito sin origen se cuenta como nota.
4. Contabilización con cifras reales (asiento, cuentas, debe/haber, base, IVA) y trazabilidad con Docflow.
5. Cada capítulo acaba con un «Qué has aprendido» propio (no un resumen único del vídeo). Sin «consejos antes de empezar».

## Datos y pantalla
- Datos de la demo (base `tutorial`, nextdemo.geasa.eu): son falsos; **no se tapan ni difuminan campos**. Lo que sí se tapa es un error visible del ERP (`tapas.json`).
- Cada cifra, código y rótulo dicho coincide con lo que se ve; manda la pantalla sobre la voz.
- Códigos del alumno con sus iniciales (`{INI}`, ver `_fuente/CODIGOS_ALUMNO.md`) y, donde se crea un tercero, Nombre = nombre del alumno. En el vídeo se usan códigos propios del vídeo (p. ej. CVID), distintos de los del alumno.
- Pantalla del ERP grande (≥ 80 % del ancho), plana; la perspectiva 3D solo al entrar. Navegación en vivo, no capturas fijas, salvo que no haya otra opción.
- Nada de login, contraseñas, e-mails, usuarios ni ventanas ajenas en pantalla.

## Calidad de la fuente
Los clips de las sesiones de los ponentes tienen tasas de 17-100 kbps; si la letra no se lee, no se salva con recortes: se hace un vídeo nuevo grabado en la demo (decisión por tabla en `_fuente/VIDEOS_TABLAS.md`: Nuevo / Mejorado / Sin cambios).

## Cuando el vídeo no cubre un bloque
No fuerces un tramo que no encaja: anota qué hay que grabar (venta, stock/kardex, asiento manual, sumas y saldos…) en `out/PENDIENTE.md` (p. ej. `auditoria/hecho_video.md`, H32 y H33). Cambiar el vídeo de un bloque sin rehacer capturas y texto descuadra cifras.
