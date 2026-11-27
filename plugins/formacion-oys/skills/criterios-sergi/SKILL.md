---
name: criterios-sergi
description: Reglas de trabajo y de estilo que Sergi ha fijado para la plataforma «Practicando Axional Deister VNext» (idioma, claridad para juniors, títulos, vídeo primero, datos de la demo, validación antes de publicar). Úsala SIEMPRE antes de cambiar contenido, textos, diseño o código de la plataforma, y cuando alguien pregunte «¿cómo lo quiere Sergi?», «¿qué normas hay?» o «¿esto se puede publicar?».
---

# Criterios de Sergi para la plataforma

Son decisiones ya tomadas. No las vuelvas a discutir: aplícalas. Si un cambio que te piden choca con una, dilo y pregunta antes de hacerlo.

## Para quién escribimos

- El alumno es un **junior recién contratado en O&S**: consultor o programador, **sin formación financiera** y que nunca ha usado Axional Deister.
- Toda palabra técnica (asiento, efecto, remesa, tipología, Docflow…) se explica la primera vez o enlaza al glosario.
- Ningún dato sin contexto: si sale una cuenta, un importe o un código, se dice de dónde sale.

## Idioma y tono

- **Español de España**, con **tuteo** («pulsa», «abre», «fíjate»). Nada de «usted» ni de voseo.
- Frases cortas. Una idea por frase. Sin relleno ni frases de documentación oficial («según la documentación…»).
- Rótulos del ERP **literales**, tal como salen en la pantalla, entre comillas latinas «».

## Títulos y estructura

- Títulos de bloque **cortos y en infinitivo** («Dar de alta un proveedor», «Generar la factura»), **sin códigos** de tabla ni ids internos (`gcompedh`, `icon-*`).
- Orden de módulos y bloques con **criterio de experto**: primero lo que hace falta para lo siguiente (maestros → compras → ventas → contabilidad → cartera → tesorería → impuestos → activos).
- En la interfaz se dice **«bloque»**, no «ejercicio».
- **El vídeo va primero**: en cada parte con vídeo, el orden es vídeo → texto → pantallas clicables.
- Un paso sin contenido no se enseña. Un paso solo usa capturas de **su misma parte**.
- Cada campo de una tabla de campos lleva **su número** y, si sale en la captura, **su punto**.
- Los ids de módulo, bloque y sección **no se cambian**: guardan el progreso de los alumnos y los momentos de vídeo.

## Datos y privacidad

- **No tapes ni difumines campos** en capturas ni vídeos: los datos de la demo de Deister son falsos.
- **Nunca uses bases de datos de clientes reales** (por ejemplo, Elysius) para capturas, ejemplos ni pruebas. Solo la demo `nextdemo.geasa.eu` (base tutorial) y registros propios con prefijo `CAP` o con las iniciales del alumno `{INI}`.
- Códigos del alumno únicos y reutilizables: sigue `_fuente/CODIGOS_ALUMNO.md`.
- Nadie teclea contraseñas por ti: el login de la demo, Clerk o GitHub lo haces tú a mano.
- El repo `oysdeister/oys` es **público**: no subas claves, secretos, `.env.local`, transcripciones de reuniones ni documentación de Deister copiada (ya está en `.gitignore`: `_fuente/icon/docs/`…).

## Herramientas

- En el navegador **no uses `javascript_tool`**. Para capturas y automatizar la demo, puppeteer (`plugins/formacion-oys/scripts/capturas_erp2.mjs`); para leer páginas, obscura o el navegador sin ejecutar JS.
- El trabajo de volumen (leer muchos ficheros, redactar mucho texto, revisar lotes) se puede delegar en subagentes; **revisa siempre** lo que devuelven antes de darlo por bueno.

## Antes de publicar

1. `npm --prefix app run build` sin errores.
2. **Prueba de humo**: portada, un módulo, un bloque con Guiado, examen de módulo, glosario, vídeo y ERP de práctica, en escritorio y móvil, consola limpia (skill `arrancar-y-publicar`).
3. Si cambiaste contenido o pantallas, **valida con agentes-junior** (skill `diseno-y-ux`) y aplica lo grave.
4. Commit con mensaje en español que diga qué cambia para el alumno; squash a `main`; push; comprueba que el despliegue de Pages queda en verde.

## Qué pedir a Sergi

- Accesos: Clerk, Google Cloud, Cloudflare, secretos y variables del repo, permiso `workflow` del token.
- Decisiones de alcance: quitar o fusionar módulos, cambiar el orden del curso, cambiar el examen o el certificado.
- Material nuevo: grabaciones, transcripciones o manuales que no estén en el repo.
