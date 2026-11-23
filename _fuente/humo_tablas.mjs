// Prueba de humo: node _fuente/humo_tablas.mjs <url base> → rutas sin errores y tarjetas de vídeo por tabla en su sección
import puppeteer from '/Users/sergi.baulies/Downloads/practica-axional-oys/.claude/worktrees/optimistic-blackwell-254536/nueva/fin/_tools/node_modules/puppeteer-core/lib/esm/puppeteer/puppeteer-core.js';
import fs from 'node:fs';
const BASE = process.argv[2];
const spec = JSON.parse(fs.readFileSync(new URL('./video_tablas.json', import.meta.url)));
const mods = ['maestros','compras','ventas','icon-contabilidad','carteras','tesoreria','icon-impuestos','icon-activos'];
const ejer = []; for (const m of mods) { const d = JSON.parse(fs.readFileSync(new URL(`../app/src/content/${m}.json`, import.meta.url))); for (const e of d.ejercicios) ejer.push([e.id, e.secciones.map((s) => s.id)]); }
const esperado = {}; for (const e of spec) for (const s of e.secciones) esperado[s] ??= e.titulo;
const b = await puppeteer.launch({ executablePath: '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome', headless: 'new' });
const p = await b.newPage(); const err = [];
p.on('pageerror', (e) => err.push(`${p.url()} ${e.message}`));
p.on('console', (m) => m.type() === 'error' && !/favicon|Failed to load resource/.test(m.text()) && err.push(`${p.url()} ${m.text()}`));
const rutas = ['/', ...mods.map((m) => `/modulo/${m}`), ...ejer.map(([id]) => `/ejercicio/${id}`)];
let ok = 0, tarjetas = 0; const mal = [];
for (const r of rutas) {
  await p.goto(`${BASE}#${r}`, { waitUntil: 'networkidle0' }); await new Promise((x) => setTimeout(x, 150));
  const txt = await p.evaluate(() => document.body.innerText.length);
  if (txt < 50) mal.push(`${r}: página vacía`); else ok++;
  const id = r.startsWith('/ejercicio/') && r.slice(11);
  if (id) for (const s of ejer.find((e) => e[0] === id)[1]) if (esperado[s]) {
    await p.waitForSelector(`#sec-${s} .vp .vp-que`, { timeout: 4000 }).catch(() => {});
    const q = await p.evaluate((s) => document.querySelector(`#sec-${s} .vp .vp-que`)?.textContent ?? null, s);
    if (q && q.includes(esperado[s])) tarjetas++; else mal.push(`${r} #${s}: tarjeta «${q}» (esperaba ${esperado[s]})`);
  }
}
console.log(`rutas ${ok}/${rutas.length} · tarjetas ${tarjetas}/${Object.keys(esperado).length} · errores ${err.length}`);
for (const x of [...mal, ...err.slice(0, 10)]) console.log(' ', x);
await b.close(); process.exit(mal.length || err.length ? 1 : 0);
