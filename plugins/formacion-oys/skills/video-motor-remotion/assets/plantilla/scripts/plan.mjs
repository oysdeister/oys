// Muestra el plan (inicio, duración, transición, voz) de cada escena y capítulo.
// uso: node scripts/plan.mjs
import { buildSync } from 'esbuild';
import fs from 'node:fs';
const out = 'node_modules/.cache/plan.cjs';
fs.mkdirSync('node_modules/.cache', { recursive: true });
buildSync({ entryPoints: ['src/lib/plan.ts'], bundle: true, platform: 'node', format: 'cjs', outfile: out, logLevel: 'silent' });
const { buildPlan } = await import(`../${out}`);
const guion = JSON.parse(fs.readFileSync('src/data/guion.json', 'utf8'));
const timing = JSON.parse(fs.readFileSync('src/data/timing.json', 'utf8'));
const p = buildPlan(guion, timing, 30);
const s = (f) => (f / 30).toFixed(2).padStart(7);
console.log('escena                 tipo         inicio   dur  trans  voz-ini   voz-fin');
for (const it of p.items)
  console.log(`${it.escena.id.padEnd(22)} ${it.escena.tipo.padEnd(11)} ${s(it.from)} ${s(it.dur)} ${it.transTipo.padEnd(6)} ${s(it.from + it.lead)} ${s(it.from + it.lead + (it.durMs / 1000) * 30)}`);
for (const c of p.chapters) console.log(`Cap-${String(c.numero).padStart(2, '0')} «${c.titulo}»  render ${s(c.renderFrom)} → ${s(c.renderTo)}`);
console.log(`total ${s(p.total)} s (${p.total} fotogramas)`);
