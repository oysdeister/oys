// Vuelca el texto que ve el alumno, en el orden de pantalla, por módulo (portada del módulo + bloques en orden de etapas).
// Uso: node auditoria/scripts/volcar_lectura.mjs <carpeta_salida>
import fs from 'node:fs'; import path from 'node:path'; 
const raiz = path.resolve(path.dirname(new URL(import.meta.url).pathname), '../..');
const C = path.join(raiz, 'app/src/content');
async function cargaTs(f) { return import(f); }  // Node ≥23 quita los tipos de .ts
const out = process.argv[2]; fs.mkdirSync(out, { recursive: true });
const { ETAPAS, FASES } = await cargaTs(path.join(C, 'etapas.ts'));
const { FICHAS } = await cargaTs(path.join(raiz, 'app/src/pages/portadaDatos.ts'));
const ORDEN = ['fundamentos', 'maestros', 'icon-contabilidad', 'compras', 'ventas', 'carteras', 'tesoreria', 'icon-impuestos', 'icon-activos', 'contabilidad-avanzada'];
const bloques = {}; const mods = {};
for (const id of ORDEN) { const m = JSON.parse(fs.readFileSync(path.join(C, id + '.json'), 'utf8')); mods[id] = m;
  m.ejercicios.forEach((e, i) => { bloques[e.id] = { e, fichero: `app/src/content/${id}.json`, idx: i }; }); }
const sec = (s, L, donde) => {
  L.push(`#### Parte «${s.titulo}»  (${donde}; sección id ${s.id})`);
  if (s.paraQueSirve) L.push(`[paraQueSirve] ${s.paraQueSirve}`);
  if (s.ruta) L.push(`[ruta] ${Array.isArray(s.ruta) ? s.ruta.join(' › ') : s.ruta}`);
  (s.explicacion || []).forEach((x, i) => L.push(`[explicacion ${i + 1}] ${x}`));
  (s.campos || []).forEach((c, i) => L.push(`[campo ${i + 1}] ${c.campo} — ${c.significado} — Ej.: ${c.ejemplo}`));
  (s.avisos || []).forEach((a) => L.push(`[aviso ${a.tipo}] ${a.texto}`));
  if ((s.pasos || []).length) { L.push(`(pasos: se ven en Guiado y De memoria)`);
    s.pasos.forEach((p, i) => { L.push(`[paso ${i + 1}] ${p.texto}`); if (p.detalle) L.push(`   [detalle] ${p.detalle}`); if (p.pregunta) L.push(`   [pregunta De memoria] ${p.pregunta}`); if (p.hotspot) L.push(`   [punto clicable] ${p.hotspot.etiqueta}`); }); }
};
const usados = new Set();
for (const id of ORDEN) { const m = mods[id]; const f = FICHAS[id] || {}; const L = [];
  L.push(`# Módulo ${ORDEN.indexOf(id)}: ${m.titulo}  (id ${id}; fichero app/src/content/${id}.json; portada en app/src/pages/portadaDatos.ts)`);
  L.push(`## Página del módulo (#/modulo/${id}), de arriba abajo`);
  L.push(`[frase portadaDatos] ${f.frase || '(sin ficha: usa resumen)'}`); L.push(`[resumen JSON, se usa en la portada general] ${m.resumen}`);
  (f.aprendes || []).forEach((a) => L.push(`[aprendes portadaDatos] ${a}`));
  if (f.circuito) L.push(`[recorrido portadaDatos] ${f.circuito.map((p) => `${p.t}: ${p.d}${p.ej ? ' (' + p.ej + ')' : ''}`).join(' → ')}`);
  (m.navegacion || []).forEach((s) => sec(s, L, 'página del módulo › Lo básico del ERP para este módulo'));
  const et = ETAPAS[id] || []; let fase = null; let n = 0;
  for (const E of et) { if (E.fase && E.fase !== fase) { fase = E.fase; L.push(`## FASE ${FASES[fase].titulo}: ${FASES[fase].que}`); }
    L.push(`## Etapa «${E.titulo}»${E.opcional ? ' (opcional)' : ''}: ${E.que}${E.nota ? ' · nota: ' + E.nota : ''}`);
    for (const b of E.bloques) { const B = bloques[b]; if (!B) { L.push(`(bloque ${b} no encontrado)`); continue; } usados.add(b); n++; const e = B.e;
      L.push(`\n### Bloque ${n}: ${e.titulo}  (id ${b}; ${B.fichero} ejercicios[${B.idx}])`);
      L.push(`[objetivo] ${e.objetivo}`); L.push(`--- Concepto ---`); L.push(`[concepto] ${e.concepto}`);
      e.secciones.forEach((s, i) => sec(s, L, `Concepto, parte ${i + 1} de ${e.secciones.length}`));
      L.push(`--- Test ---`); e.test.forEach((t, i) => L.push(`[test ${i + 1}] ${t.pregunta} | opciones: ${t.opciones.map((o, j) => (j === t.correcta ? '✔' : '') + o).join(' / ')} | explicación: ${t.explicacion}`));
      L.push(`--- Demo real ---`); e.checklist.forEach((c, i) => L.push(`[checklist ${i + 1}] ${c}`));
      e.problemas.forEach((p, i) => L.push(`[problema ${i + 1}] ${p.problema} → ${p.solucion}`));
      (e.aprendido || []).forEach((a, i) => L.push(`[aprendido ${i + 1}] ${a}`)); } } 
  fs.writeFileSync(path.join(out, `${String(ORDEN.indexOf(id)).padStart(2, '0')}-${id}.md`), L.join('\n') + '\n'); }
const resto = Object.keys(bloques).filter((b) => !usados.has(b)); fs.writeFileSync(path.join(out, 'sin-etapa.txt'), resto.join('\n'));
console.log('sin etapa:', resto.length, resto.join(' '));
