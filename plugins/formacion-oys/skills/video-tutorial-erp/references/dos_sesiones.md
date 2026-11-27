# Dos sesiones en paralelo (versión antigua y nueva del ERP)

Úsalo cuando haya que documentar dos versiones o dos fuentes a la vez sin que se pisen. Ejemplos de ESTADO.md en `ejemplos_dos_sesiones/`.

## Reparto
- **Sesión A (antigua)**: vídeos → `kb/` (análisis por tramos, `guion_fusionado.md` verificado), plantilla `video/` y `tools/`. Renderiza su vídeo.
- **Sesión B (nueva)**: en `nueva/`, explora el ERP nuevo (Fase A: mapa, notas, capturas 4K) sin esperar; en la Fase B, cuando `kb/` está listo, cruza con el guion antiguo (`diferencias.md`), copia la plantilla a `nueva/video/` (enlaza `node_modules`) y produce su vídeo con los mismos capítulos.

## Coordinación
- Cada sesión mantiene un **ESTADO.md** (Hecho / En curso / Siguiente / Notas) que la otra lee; sirve también para retomar tras compactar o tras una pausa del usuario (anota la hora, qué se ha grabado y el siguiente comando).
- Contrato de entrega de A a B: `kb/guion_fusionado.md` (procedimientos y SIN PANTALLA = lo que B debe grabar), `video/` + `GUION_FORMATO.md`, `tools/voz.py` y `tools/clips.py`, la voz elegida y el vídeo final como referencia de ritmo.
- A avisa a B cuando `kb/` y `video/` están listos (mensaje entre sesiones o línea en ESTADO.md). B no escribe en `kb/` ni en `video/`.
- Ninguna pregunta al usuario: las dos avanzan solas y solo avisan con el resultado.
- Los renders compiten por la GPU y las grabaciones por el Chrome de la demo: no los lances a la vez.
