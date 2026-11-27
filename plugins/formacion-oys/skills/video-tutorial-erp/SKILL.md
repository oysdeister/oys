---
name: video-tutorial-erp
description: "Orquesta de principio a fin un vídeo tutorial nuevo de un ERP (Deister Axional VNext u otro) para cualquier módulo - desde grabaciones Loom o grabando en vivo la demo - pensado para principiantes. Úsala siempre que pidan «hacer un vídeo tutorial», «documentar en vídeo el módulo X», «convertir estos Loom en un tutorial», «grabar el vídeo de ventas/workflow» o rehacer un vídeo de formación, y también si hay que coordinar dos sesiones en paralelo. Plantilla y render: video-motor-remotion; trocear, subir y enlazar en la plataforma: videos; contenido funcional: skills erp-*."
---

# Vídeo tutorial de un ERP (orquestador)

Opus decide, reparte y revisa; los agentes baratos (Sonnet o DeepSeek) hacen el volumen. El usuario quiere **solo el resultado**: trabaja sin preguntas intermedias y avisa al final con el vídeo.

## Dos rutas según la fuente
- **Grabaciones existentes (Loom, Meet)** → ruta A (v1, 3D con capturas y clips recortados).
- **Demo viva del ERP nuevo (nextdemo.geasa.eu, base tutorial)** → ruta B (v2, recomendada): navegación grabada en vivo con puppeteer (`rec.mjs`), voz sincronizada con los clics. Es la que se usó para compras, ventas y workflow.

Antes de empezar lee `references/requisitos_principiantes.md` (público, contenido por módulo, datos de la demo) y pasa `references/criterios_v2.md` como lista de comprobación.

## Ruta A: desde grabaciones
1. `yt-dlp <url Loom>` a `media/src/<id>.mp4`. No uses el transcript de Loom del MCP Atlassian: es malo.
2. `scripts/procesa.sh <id> <alias>` (whisper-cpp `large-v3-turbo`, `-l es`, un fotograma cada 10 s, `f_N = (N-1)*10 s`) y `scripts/compacta.py` para partir en tramos.
3. Un agente por tramo de ~20 min → `kb/vX_tramoN.md` (plantilla en `references/encargos.md`).
4. Guionista Opus: fusiona en `kb/guion_fusionado.md` + `video/src/data/guion.json` y verifica cada dato y recorte contra el fotograma (`scripts/guion/`: gen.py, md.py, grid.py; ejecútalos con `PROYECTO=<base>`).
5. Revisión Opus de lo dudoso y de las cifras; las decisiones y cifras las fijas tú.

## Ruta B: grabación en vivo
1. **Criterios y datos**: `criterios.md` del vídeo y `datos.md` (qué registros existen ya en la demo, códigos propios del vídeo, últimos números de documento). Mira antes de grabar para no duplicar.
2. **Guion por capítulo** (`capNN.json` + `.md`): escenas `pantalla` con `acciones` declarativas; brief de especialista en `references/brief_especialistas_v2.md`, un especialista Sonnet por capítulo, con su revisor.
3. **Grabación EN SERIE** (un solo Chrome): `video-motor-remotion/scripts/v2/rec.mjs`, en un Chrome headless propio (puerto 9334) para no robar el foco; el usuario inicia la sesión del ERP. Reglas y trampas de la grabación (tema oscuro, esperas de red, tecleo, listas, iframes) en `references/lecciones.md`.
4. **Limpieza** con `recorta.py` (esperas muertas) y `tapas.json` (errores visibles), sin regrabar.
5. **Voz → clips → render por capítulos**: skill `video-motor-remotion`.
6. **Verificador Opus** por bloques de capítulos: comprueba cifras en fotogramas y corrige el texto; cada capítulo acaba con «Qué has aprendido». Entrega `out/INDICE.md` (minutos) y `out/PENDIENTE.md` (lo que no se pudo hacer).
7. Pasa a `videos` para trocear a `web/capNN.mp4`, subir la release y enlazar.

## Privacidad y limpieza (obligatorio)
Ningún clip muestra: rejillas de usuarios (nombres, e-mails), Gmail, Calendar, login, errores de conexión o de informe, widget del grabador, pantallas en blanco ni ventanas de correo. Recorta barras del navegador y de Windows; anota los tramos sucios para que `gen.py` los rechace. Los datos de la demo son falsos: no se difuminan campos, cuentas ni importes. Solo en recortes de grabaciones de reuniones (Meet) se ocultan caras, webcams, nombres de participantes, IBAN y datos de clientes reales; recorta a la zona del ERP y revisa una hoja de fotogramas cada ~10 s antes de dar el clip por bueno.

## Errores típicos
- Whisper inventa texto en los silencios: manda la pantalla y los rótulos literales.
- Cifras dichas que no cuadran con lo visto: manda la pantalla. Pasos nombrados pero no vistos: «SIN PANTALLA», no los inventes.
- Tras **Guardar** un documento de ventas el ERP vuelve a la lista: añade una escena que abra la ficha.
- Escenas que crean datos no se regraban desde cero; guarda copia del webm antes de regrabar.
- Sesión del ERP caducada (todo redirige a login o el primer `prep` da `NO ENCONTRADO`): para, avisa y sigue con lo que no necesita demo; el usuario inicia la sesión, tú nunca tecleas la contraseña.
- La demo es compartida: los números de documento no coinciden entre alumnos; en los guiones habla de «el siguiente número» y crea solo registros con código propio del vídeo.
- Un solo grabador y un solo render a la vez (compiten por el Chrome y la GPU); renderiza por capítulos en cola.
- No des el vídeo por publicado sin comprobarlo en pantalla (serie visible en su módulo).

## Coordinación y coste
Dos versiones o fuentes a la vez: `references/dos_sesiones.md` (ESTADO.md para retomar). Delega lectura y análisis en modelos baratos; Opus solo para guion, verificación y decisiones. Más lecciones: `references/lecciones.md`.
