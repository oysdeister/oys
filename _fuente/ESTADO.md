# Estado del trabajo (para retomar tras compactar)

Proyecto: /Users/sergi.baulies/Downloads/practica-axional-oys
- `_fuente/manuales/<slug>/manual.md` + `img/` — texto extraído de los 6 docx (slugs: compras, ventas, maestros, asientos, parametrizacion, carteras)
- `_fuente/ESQUEMA.md` — esquema JSON que rellenan los subagentes
- `_fuente/json/<slug>.json` — salida de subagentes (sonnet). Hecho: parametrizacion (6 ej, 41 pasos, 24 hotspots; manual usa iniciales EC → {INI}; sin datos de numerador).
- `app/` — Vite + React 19 + TS + framer-motion + react-router-dom (HashRouter) + canvas-confetti + fuentes Bricolage Grotesque / Instrument Sans. base './'.

## Hecho en app
index.html (tema oscuro precarga), vite.config, tsconfig (resolveJsonModule), src/types.ts, src/lib/{progress.ts,sync.ts,texto.ts}, src/styles.css (paleta navy #1f2738 + turquesa #4fbfa5, ámbar señal #f2a93b; motivo: arco del logo).

## Pendiente
1. main.tsx, App.tsx (HashRouter, cabecera, bottom-nav móvil, tema), content/index.ts (importa JSON + copia imágenes a public/img/<slug>/)
2. Páginas: Home (órbita 3D con 6 módulos + mapa circuito), Módulo (circuito animado + ruta de ejercicios), Ejercicio (pestañas: Concepto / Guiado con hotspots / De memoria / Test / Demo real checklist con {INI} / Problemas), Taller (simuladores), Logros (insignias + ajustes alumno, exportar progreso), Examen, Certificado.
3. Simuladores (≥5): asiento debe/haber, máscara numerador (#e#s#6n → DISPC000001, de skill erp-nuevo-compras), ordenar circuito, leer Docflow (0PC000003 → 0AC000011 → 0FC000009, asiento 60000/40090/47200/40000.00010 48,40), base+IVA+total.
4. Petición extra de Sergi (mensaje a mitad de tarea): pensar como formador, más práctica (modo memoria, retos), EXAMEN final = teoría (banco de preguntas) + caso práctico de ciclo completo en Axional demo de memoria, con datos únicos por alumno (iniciales + referencia EX-{INI}-NNNN, cantidades/precios semilla) para saber qué registró; validación: alumno declara nº documentos y totales → app comprueba importes; panel examinador con consulta SQL (borrador, columnas sin verificar) y código de validación (SHA-256 de clave examinador + id examen); CERTIFICADO animado espectacular con marca O&S, imprimible A4.
   Datos fiables demo tutorial: empresa 0, deleg CENTRAL, almacén 0, artículo 13500620 (6000-2RS, tipo contable PROD, contabiliza), IVA 21 % → 47200, proveedor con dtos 1/2/3 y pronto pago a 0, grupo precio 00001, tipo pedido PC → albarán ACPC → factura FCOA.
5. Vídeo compras: 1,9 GB en carpeta temporal de otra sesión; enlazar por VITE_VIDEO_URL configurable con capítulos (INDICE: 1 0:00 Bienvenida; 2 7:41 Maestros; 3 17:42 Precios; 4 22:47 Numeración; 5 37:50 Pedido; 6 50:11 Albarán; 7 59:25 Factura; 8 1:05:52 Contabilizar; 9 1:14:07 Docflow; 10 1:24:45 Resumen).
6. Revisar JSON (cifras/rótulos/hotspots contra capturas), build, prueba navegador escritorio+móvil, entregar dist + 3 pasos despliegue + lista de no hecho. Avisar a Sergi con el resultado (autonomía).

## Despliegue (16-11-2026)
- Repo público https://github.com/sergibauli/oys (remote origin), Pages en modo Actions → https://sergibauli.github.io/oys/ . Workflow `.github/workflows/pages.yml` (build en app/, env VITE_CLAVE_EXAMINADOR=secrets.CLAVE_EXAMINADOR, VITE_VIDEO_URL=vars.VIDEO_URL).
- El secret CLAVE_EXAMINADOR NO se pudo crear (permiso denegado): que lo cree Sergi (`gh secret set CLAVE_EXAMINADOR -R sergibauli/oys`).
- Aún sin primer commit/push: hacerlo cuando compile todo.
- 3 agentes construyendo: páginas (Home/Module/Exercise/Logros), Taller+sims, Examen/Certificado/Examinador.
- Revisión: app/public/_check.html = hoja de 48 hotspots para revisar en navegador (dev server: .claude/launch.json «taller», puerto 5179).
- Revisado: carteras-049 remesa usa 57200 / 23000 (real en la demo); ventas-039 asiento 43000/47000/70000 133,10 con cabecera «AC».

## Fase 2 pedida por Sergi (16-11-2026, ~22:00)
- Todo ESPECTACULAR, con 3D donde aporte. El examen evalúa manuales + vídeo de compras (guiones en nueva/v2/cap01..cap10.md). Ya avisados los 3 agentes constructores.
- Cuando terminen: fase de revisión y pulido por secciones, con un agente «jefe» por sección (Portada+Módulo, Ejercicio, Taller, Examen+Certificado). Cada jefe revisa contenido, usabilidad y diseño con capturas en el navegador (escritorio + móvil), lanza sus subagentes para corregir y vuelve a revisar. Después yo reviso, compilo y hago push.
- Carpetas media/ y nueva/ (2 GB, material del vídeo copiado por la app) excluidas de git.
- Hecho: páginas (agente 1) y Taller 6 sims/27 rondas (agente 2). Pendiente de revisar en revisión: estados Docflow 0PC000003 etc. supuestos; token #a año y máscara EA26 inventada (#yy en cdocnumh); cuenta 470 en asiento de ventas; insignia Taller no cuenta cartera. num2 con useGrouping 'always' corregido.
