---
name: video-dos-sesiones
description: Patrón para producir en paralelo, con dos sesiones de Claude Code, el vídeo de la versión antigua de un ERP y el de la nueva - una analiza las grabaciones antiguas y produce kb/ y la plantilla; la otra explora el ERP nuevo y espera kb/. Úsala cuando haya que documentar dos versiones o dos fuentes a la vez sin que se pisen.
---

# Dos sesiones en paralelo

## Reparto
- **Sesión A (antigua)**: vídeos → `kb/` (análisis por tramos, `guion_fusionado.md` verificado), plantilla `video/` y `tools/`. Renderiza su vídeo.
- **Sesión B (nueva)**: en `nueva/`, explora el ERP nuevo (Fase A: mapa, notas, capturas 4K) **sin esperar**; en la Fase B, cuando `kb/` está listo, cruza con el guion antiguo (`diferencias.md`), copia la plantilla a `nueva/video/` (enlaza `node_modules`) y produce su vídeo con los mismos capítulos.

## Coordinación
- Cada sesión mantiene un **ESTADO.md** (Hecho / En curso / Siguiente / Notas) que la otra lee; sirve también para retomar tras compactar. Ejemplos en `references/`.
- Contrato de entrega de A a B: `kb/guion_fusionado.md` (procedimientos y SIN PANTALLA = lo que B debe grabar), `video/` + `GUION_FORMATO.md`, `tools/voz.py` y `tools/clips.py`, la voz elegida y el vídeo final como referencia de ritmo.
- A avisa a B cuando `kb/` y `video/` están listos (mensaje entre sesiones o línea en ESTADO.md). B no escribe en `kb/` ni en `video/`.
- Ninguna pregunta al usuario: las dos avanzan solas y solo avisan con el resultado.
- Los renders compiten por la GPU: no los lances a la vez.
