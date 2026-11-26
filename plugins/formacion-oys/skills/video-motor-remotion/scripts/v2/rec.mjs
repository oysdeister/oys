// rec.mjs — grabador de navegación en vivo para el ERP (Deister Axional VNext, nextdemo, base tutorial)
//
// Uso:  node rec.mjs <guion.mjs> [--dry]          (desde nueva/v2/tools)
//   <guion.mjs> exporta `export default async function (R) { ... }`.
//   --dry  ejecuta los pasos sin grabar (para probar).
//
// API de R (todas async; los objetivos «t» pueden ser):
//   'Texto exacto'                 → elemento visible cuyo texto es exactamente ese (botón, pestaña, fila, menú…)
//   {text:'…', n:1}                → la n-ésima coincidencia
//   {label:'Proveedor'}            → el input del campo con esa etiqueta (en el diálogo activo si lo hay)
//   {sel:'css', n:0}               → selector CSS
//   {xy:[x,y]}                     → coordenadas CSS
//   {row:'texto'}                  → celda de una rejilla/desplegable que contiene ese texto
// R.goto(objetoOUrl)               navega (sin animación) y espera
// R.start(nombre)                  empieza a grabar rec/<nombre>.webm + rec/<nombre>.json (eventos)
// R.stop()                         termina la grabación
// R.move(t, {ms})                  mueve el cursor con trayectoria humana
// R.click(t, {espera})             mueve + clic (onda visible) + espera
// R.dbl(t)                         doble clic
// R.type(texto, {delay})           teclea a ritmo humano (por defecto 140 ms por tecla)
// R.fill(label, texto)             clic en el campo + selecciona todo + teclea
// R.pick(texto)                    elige una fila del desplegable abierto
// R.key('Enter' | 'Tab' | 'Meta+k')
// R.pause(ms)                      pausa visible (el cursor queda quieto)
// R.mark(id, t?)                   apunta en el log un instante con nombre (y el rect de t si se da)
// R.rect(t)                        devuelve [x,y,w,h] en px CSS
// R.scroll(t|null, dy)             rueda del ratón sobre t
// R.text()  R.fields()  R.msgs()   lectura (para comprobar)
// R.shot(nombre)                   captura fija a rec/shots/<nombre>.png
//
// El log (rec/<nombre>.json) guarda {t (s desde el inicio del vídeo), tipo, objetivo, rect, texto}
// con rects en píxeles CSS del viewport (1600×900). El vídeo sale a 2× (3200×1800).
import puppeteer from 'puppeteer-core';
import path from 'node:path';
import fs from 'node:fs';
import { fileURLToPath, pathToFileURL } from 'node:url';

const HERE = path.dirname(fileURLToPath(import.meta.url));
const REC = path.join(HERE, '..', 'rec');
const BASE = 'https://nextdemo.geasa.eu/view/app/tutorial/dispatch/';
const VW = Number(process.env.VW || 1600), VH = Number(process.env.VH || 900);
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
const DRY = process.argv.includes('--dry');

const CURSOR_JS = `(() => {
  if (window.top !== window) return; // sin cursor dentro de iframes (duplicaba el cursor y ralentizaba el render)
  if (window.__oysCursor) return;
  window.__oysCursor = true;
  const mk = () => {
    if (!document.body) return setTimeout(mk, 50);
    const st = document.createElement('style');
    st.textContent = \`
      #oys-cur{position:fixed;left:0;top:0;width:30px;height:30px;z-index:2147483647;pointer-events:none;transform:translate(-3px,-2px);transition:none;filter:drop-shadow(0 2px 3px rgba(0,0,0,.45))}
      .oys-rip{position:fixed;z-index:2147483646;pointer-events:none;width:16px;height:16px;margin:-8px 0 0 -8px;border-radius:50%;border:3px solid #ffb300;background:rgba(255,179,0,.35);animation:oysrip .7s ease-out forwards}
      @keyframes oysrip{to{transform:scale(4.2);opacity:0}}
      .oys-hl{position:fixed;z-index:2147483645;pointer-events:none;border:3px solid #ffb300;border-radius:8px;box-shadow:0 0 0 4000px rgba(10,20,40,.0),0 0 18px rgba(255,179,0,.8);transition:opacity .3s}
    \`;
    document.head.appendChild(st);
    const c = document.createElement('div');
    c.id = 'oys-cur';
    c.innerHTML = '<svg viewBox="0 0 24 24" width="30" height="30"><path d="M4 2 L4 20 L9 15.5 L12.4 22.5 L15.3 21.2 L11.9 14.3 L18.5 14.3 Z" fill="#fff" stroke="#111" stroke-width="1.4" stroke-linejoin="round"/></svg>';
    document.body.appendChild(c);
    const p = window.__oysPos || [800, 450];
    c.style.left = p[0] + 'px'; c.style.top = p[1] + 'px';
    addEventListener('mousemove', (e) => { window.__oysPos = [e.clientX, e.clientY]; c.style.left = e.clientX + 'px'; c.style.top = e.clientY + 'px'; }, true);
    addEventListener('mousedown', (e) => { const r = document.createElement('div'); r.className = 'oys-rip'; r.style.left = e.clientX + 'px'; r.style.top = e.clientY + 'px'; document.body.appendChild(r); setTimeout(() => r.remove(), 800); }, true);
    new MutationObserver(() => { if (c.parentNode !== document.body || document.body.lastElementChild !== c) document.body.appendChild(c); }).observe(document.body, { childList: true });
  };
  mk();
})();`;

const browser = await puppeteer.connect({ browserURL: process.env.CDP || 'http://127.0.0.1:9333', defaultViewport: null });
let ajenas = [];
try { ajenas = Object.values(JSON.parse(fs.readFileSync(path.join(HERE, '..', '..', 'tools', '.tabs.json'), 'utf8'))); } catch {}
const tg = browser.targets().filter((t) => t.type() === 'page' && t.url().includes('nextdemo.geasa.eu') && !t.url().includes('dbstudio') && !ajenas.includes(t._targetId));
let page = null;
for (const t of tg.reverse()) { try { page = await Promise.race([t.page(), new Promise((_, r) => setTimeout(() => r(0), 8000))]); if (page) break; } catch {} }
if (!page) throw new Error('sin pestaña principal');
try { const cs = await page.target().createCDPSession(); await cs.send('Emulation.setFocusEmulationEnabled', { enabled: true }); } catch {}
if (!process.env.CDP || process.env.CDP.includes('9333')) await page.bringToFront(); // en headless (9334) no hace falta y no roba el foco
await page.setViewport({ width: VW, height: VH, deviceScaleFactor: 2 });
await page.evaluateOnNewDocument(CURSOR_JS);
await page.evaluate(CURSOR_JS);

let pos = await page.evaluate(() => window.__oysPos || [800, 450]);
let recorder = null, t0 = 0, log = [], recName = null;
const now = () => (t0 ? (Date.now() - t0) / 1000 : 0);
let CLAVE = null;
const ev = (tipo, extra = {}) => { if (recorder || DRY) log.push({ t: +now().toFixed(2), tipo, ...(CLAVE ? { clave: CLAVE } : {}), ...extra }); };

const settle = async (ms = 900) => {
  await sleep(ms);
  try { await page.waitForNetworkIdle({ idleTime: 400, timeout: Number(process.env.SETTLE_MAX || 3000) }); } catch {} // la demo sondea la red: con 8000 cada clic esperaba ~9 s
  try { await page.evaluate(CURSOR_JS); } catch {}
};

const VIS = `(e)=>{const r=e.getBoundingClientRect();const s=getComputedStyle(e);return r.width>0&&r.height>0&&s.visibility!=='hidden'&&s.display!=='none'&&r.bottom>0&&r.top<innerHeight&&r.right>0&&r.left<innerWidth}`;

async function locate(t) {
  if (t && t.xy) { const [w, h] = t.wh || [20, 20]; return { x: t.xy[0], y: t.xy[1], rect: [t.xy[0] - w / 2, t.xy[1] - h / 2, w, h] }; }
  const q = typeof t === 'string' ? { text: t } : t;
  const r = await page.evaluate((q, visSrc) => {
    const vis = eval(visSrc);
    const dlg = [...document.querySelectorAll('.v-dialog--active, .v-dialog__content--active .v-dialog')].filter(vis).pop();
    let el = null;
    // frame:true -> buscar dentro del iframe (p. ej. el diálogo de Docflow); el rect se devuelve en coordenadas de la página
    // frame:true -> iframe de 1.er nivel; frame:2 -> iframe anidado dentro de él; OX/OY acumulan los desplazamientos
    let FR = q.frame ? document.querySelector('iframe') : null;
    let D = FR ? FR.contentDocument : document;
    let OX = FR ? FR.getBoundingClientRect().x : 0, OY = FR ? FR.getBoundingClientRect().y : 0;
    while (FR && q.frame === 2 && D.querySelector('iframe')) { FR = D.querySelector('iframe'); D = FR.contentDocument; OX += FR.getBoundingClientRect().x; OY += FR.getBoundingClientRect().y; }
    const norm = (s) => (s || '').replace(/\s+/g, ' ').trim();
    if (q.sel) {
      el = [...D.querySelectorAll(q.sel)].filter(vis)[q.n || 0];
    } else if (q.label) {
      const root = dlg || document;
      const ls = [...root.querySelectorAll('label')].filter(vis).filter((l) => norm(l.innerText).replace(/\s*\*$/, '') === q.label);
      const l = ls[q.n || 0];
      const vi = l && l.closest('.v-input');
      el = vi && (vi.querySelector('input:not([type=hidden]),textarea') || vi.querySelector('.v-input__slot'));
      if (el && el.getBoundingClientRect().width < 5) el = vi.querySelector('.v-input__slot') || el; // selects con input de ancho 0
      if (el) el.scrollIntoView({ block: 'nearest' });
    } else if (q.row) {
      const roots = [...[...document.querySelectorAll('.menuable__content__active')].filter(vis).reverse(), dlg, document].filter(Boolean);
      let cells = [];
      for (const m of roots) { cells = [...m.querySelectorAll('td, .v-list-item__title, .v-list-item')].filter(vis).filter((c) => norm(c.innerText).includes(q.row)); if (cells.length) break; } // un tooltip activo («Recargar») no debe tapar la rejilla
      el = cells[q.n || 0];
    } else if (q.text) {
      const root = FR ? D : (q.global ? document : (dlg || document));
      const els = [...root.querySelectorAll('button, a, .v-btn, .v-list-item, .v-tab, [role=option], [role=menuitem], [role=tab], td, th, label, span, div, i, p, h1, h2, h3, li, text, tspan')]
        .filter((e) => vis(e) && norm(e.innerText || e.textContent) === q.text);
      const pick = [...new Set(els.map((e) => e.closest('button,a,.v-list-item,.v-tab,[role=option],[role=menuitem],[role=tab]') || e))];
      el = pick[q.n || 0];
    }
    if (!el) return null;
    const b = el.getBoundingClientRect();
    return { x: OX + b.x + Math.min(b.width / 2, q.label ? 70 : 1e9), y: OY + b.y + b.height / 2, rect: [OX + b.x, OY + b.y, b.width, b.height].map(Math.round) };
  }, q, VIS);
  if (!r) throw new Error('NO ENCONTRADO: ' + JSON.stringify(t));
  return r;
}

const ease = (k) => (k < 0.5 ? 2 * k * k : 1 - Math.pow(-2 * k + 2, 2) / 2);
async function moveTo(x, y, ms) {
  const [x0, y0] = pos;
  const d = Math.hypot(x - x0, y - y0);
  const dur = ms ?? Math.min(1400, 450 + d * 0.9);
  const steps = Math.max(8, Math.round(dur / 16));
  const bend = (Math.random() - 0.5) * Math.min(80, d * 0.15);
  for (let i = 1; i <= steps; i++) {
    const k = ease(i / steps);
    const nx = x0 + (x - x0) * k - (y - y0) / (d || 1) * bend * Math.sin(Math.PI * k);
    const ny = y0 + (y - y0) * k + (x - x0) / (d || 1) * bend * Math.sin(Math.PI * k);
    await page.mouse.move(nx, ny);
    await sleep(dur / steps);
  }
  pos = [x, y];
}

const R = {
  page, BASE, sleep,
  async goto(o, ms = 2500) {
    const url = o.startsWith('http') ? o : BASE + o;
    await page.goto(url, { waitUntil: 'domcontentloaded' });
    await settle(ms);
    ev('goto', { url });
  },
  async start(name) {
    recName = name;
    log = [];
    fs.mkdirSync(REC, { recursive: true });
    await page.evaluate(CURSOR_JS);
    await page.mouse.move(pos[0], pos[1]);
    if (!DRY) recorder = await page.screencast({ path: path.join(REC, name + '.webm') });
    t0 = Date.now();
    ev('start', { vw: VW, vh: VH, escala: 2 });
    await sleep(600);
  },
  async stop() {
    ev('stop');
    await sleep(500);
    if (recorder) await recorder.stop();
    recorder = null;
    fs.writeFileSync(path.join(REC, recName + '.json'), JSON.stringify({ nombre: recName, vw: VW, vh: VH, escala: 2, eventos: log }, null, 1));
    console.log('grabado', recName, now().toFixed(1) + ' s', log.length, 'eventos');
    t0 = 0;
  },
  async move(t, o = {}) {
    const f = await locate(t);
    ev('move', { obj: t, rect: f.rect });
    await moveTo(f.x, f.y, o.ms);
    await sleep(o.after ?? 250);
    return f.rect;
  },
  async click(t, o = {}) {
    const f = await locate(t);
    ev('move', { obj: t, rect: f.rect });
    await moveTo(f.x, f.y, o.ms);
    await sleep(o.antes ?? 350);
    ev('click', { obj: t, rect: f.rect });
    await page.mouse.down(); await sleep(90); await page.mouse.up();
    await settle(o.espera ?? 1200);
    return f.rect;
  },
  async dbl(t, o = {}) {
    const f = await locate(t);
    await moveTo(f.x, f.y);
    await sleep(350);
    ev('click', { obj: t, rect: f.rect, doble: true });
    await page.mouse.click(f.x, f.y, { clickCount: 2 });
    await settle(o.espera ?? 1500);
    return f.rect;
  },
  async type(txt, o = {}) {
    const ini = now();
    for (const ch of String(txt)) {
      await page.keyboard.type(ch);
      await sleep((o.delay ?? 140) + Math.random() * 60);
    }
    ev('type', { texto: String(txt), desde: +ini.toFixed(2) });
    await settle(o.espera ?? 700);
  },
  async fill(label, txt, o = {}) {
    const r = await R.click({ label }, { espera: 400 });
    await page.keyboard.down('Meta'); await page.keyboard.press('KeyA'); await page.keyboard.up('Meta');
    await sleep(200);
    ev('fill', { label, rect: r, texto: String(txt) });
    await R.type(txt, o);
    return r;
  },
  async pick(txt, o = {}) {
    return R.click({ row: txt }, o);
  },
  async key(k, o = {}) {
    const parts = k.split('+'); const last = parts.pop();
    for (const m of parts) await page.keyboard.down(m);
    await page.keyboard.press(last);
    for (const m of parts.reverse()) await page.keyboard.up(m);
    ev('key', { key: k });
    await settle(o.espera ?? 800);
  },
  async pause(ms = 1500) { ev('pause', { ms }); await sleep(ms); },
  async mark(id, t) {
    let rect = null;
    if (t) rect = (await locate(t)).rect;
    ev('mark', { id, rect });
  },
  async rect(t) { return (await locate(t)).rect; },
  async scroll(t, dy = 300) {
    if (t) { const f = await locate(t); await moveTo(f.x, f.y); }
    ev('scroll', { dy });
    const n = Math.max(1, Math.round(Math.abs(dy) / 60));
    for (let i = 0; i < n; i++) { await page.mouse.wheel({ deltaY: Math.sign(dy) * 60 }); await sleep(40); }
    await settle(600);
  },
  async text() { return page.evaluate(() => document.body.innerText); },
  async msgs() {
    return page.evaluate((visSrc) => {
      const vis = eval(visSrc);
      return [...document.querySelectorAll('.v-dialog--active, .v-snack__content, .v-alert, [role=alert], [role=alertdialog]')].filter(vis).map((e) => e.innerText.replace(/\s+/g, ' ').trim().slice(0, 300)).filter(Boolean);
    }, VIS);
  },
  async fields() {
    return page.evaluate((visSrc) => {
      const vis = eval(visSrc);
      const root = [...document.querySelectorAll('.v-dialog--active')].filter(vis).pop() || document;
      return [...root.querySelectorAll('.v-input')].filter(vis).filter((vi) => vi.querySelector('label')).map((vi) => {
        const l = vi.querySelector('label'); const inp = vi.querySelector('input:not([type=hidden]),textarea');
        const sel = vi.querySelector('.v-select__selection, .v-select__selections'); const r = vi.getBoundingClientRect();
        return `${(l.innerText || '').trim()} = ${((inp && inp.value) || (sel && sel.innerText) || '').replace(/\s+/g, ' ').trim()} @${Math.round(r.x)},${Math.round(r.y)},${Math.round(r.width)},${Math.round(r.height)}`;
      });
    }, VIS);
  },
  async shot(name) {
    fs.mkdirSync(path.join(REC, 'shots'), { recursive: true });
    const out = path.join(REC, 'shots', name + '.png');
    try { await Promise.race([page.screenshot({ path: out }), new Promise((_, r) => setTimeout(() => r(new Error('shot timeout')), 12000))]); }
    catch (e) { // pestaña oculta: último fotograma del webm
      const w = path.join(REC, name.replace(/_fin$/, '') + '.webm');
      if (!fs.existsSync(w)) throw e;
      const { execFileSync } = await import('node:child_process');
      execFileSync('ffmpeg', ['-y', '-loglevel', 'error', '-sseof', '-0.5', '-i', w, '-frames:v', '1', '-vf', 'scale=1600:-1', out]);
    }
  },
  log: (...a) => console.log(...a),
};

setTimeout(() => { console.log('TIMEOUT'); process.exit(2); }, Number(process.env.TMO || 900000));
const script = process.argv.slice(2).find((a) => !a.startsWith('--'));
const arg = (k) => { const a = process.argv.find((x) => x.startsWith('--' + k + '=')); return a && a.split('=')[1]; };
// Objetivo de una acción JSON: texto | campo | sel | xy | fila
const tgt0 = (a) => a.campo ? { label: a.campo, n: a.n } : a.sel ? { sel: a.sel, n: a.n } : a.xy ? { xy: a.xy, wh: a.wh } : a.fila ? { row: a.fila, n: a.n } : (a.n ? { text: a.texto, n: a.n } : a.texto);
const tgt = (a) => { const t = tgt0(a); if (!a.frame) return t; const o = typeof t === 'string' ? { text: t } : { ...t }; o.frame = a.frame; return o; };
const VARS = {};
async function accion(a) {
  CLAVE = a.clave || null;
  switch (a.a) {
    case 'goto': await R.goto(a.url || a.objeto, a.ms); break;
    case 'click': await R.click(tgt(a), { espera: a.espera }); break;
    case 'dblclick': await R.dbl(tgt(a), { espera: a.espera }); break;
    case 'move': case 'hover': await R.move(tgt(a)); break;
    case 'type':
      if (a.campo || a.sel) await R.click(tgt(a), { espera: 400 });
      if (a.limpiar !== false && (a.campo || a.sel)) { const sel = await R.page.evaluate(() => { const e = document.activeElement; if (e && typeof e.select === 'function' && e.value !== undefined) { e.select(); return true; } return false; }); if (!sel) { await R.page.keyboard.down('Meta'); await R.page.keyboard.press('KeyA'); await R.page.keyboard.up('Meta'); } } // Meta+A por CDP no selecciona en inputs (macOS)
      await R.type(a.texto, { delay: a.delay });
      if (a.enter) await R.key('Enter');
      break;
    case 'pick': await R.pick(a.texto, { espera: a.espera }); break;
    case 'abre_lista': {
      // clic en el campo y, si la lista no muestra a.fila tras ~3 s, otro clic (hasta 3 intentos)
      for (let i = 0; i < 3; i++) {
        await R.click(tgt(a), { espera: 500 });
        let ok = false;
        for (let k = 0; k < 8 && !ok; k++) { await sleep(400); try { await locate({ row: a.fila }); ok = true; } catch {} }
        if (ok) break;
      }
      break; }
    case 'key': for (let i = 0; i < (a.veces || 1); i++) await R.key(a.tecla); break;
    case 'scroll': await R.scroll(a.sel || a.texto ? tgt(a) : null, a.dy || 300); break;
    case 'resalta': { const r = await R.move(tgt(a)); ev('resalta', { rect: r, ms: a.ms || 2500, texto: a.etiqueta }); await R.pause(a.ms || 2500); break; }
    case 'pausa': await R.pause(a.ms || 1500); break;
    case 'espera': { const t1 = Date.now(); while (Date.now() - t1 < (a.ms || 15000)) { const tx = await R.text(); if (tx.includes(a.texto)) break; await sleep(400); } break; }
    case 'tab': await R.click({ text: a.texto, n: a.n }, { espera: a.espera }); break;
    case 'marca': await R.mark(a.id || a.clave, a.texto || a.campo ? tgt(a) : null); break;
    case 'menu': for (const x of a.ruta) await R.click(x, { espera: 900 }); break;
    case 'asegura_menu': {
      const abierto = async () => R.page.evaluate(() => [...document.querySelectorAll('*')].some((e) => e.children.length === 0 && e.textContent.trim() === 'Finanzas' && e.offsetParent && e.getBoundingClientRect().x < 100 && e.getBoundingClientRect().y < 200 && e.getBoundingClientRect().x > 40));
      const quiere = a.estado !== 'cerrado';
      if ((await abierto()) !== quiere) { await R.page.evaluate(() => document.querySelectorAll('button.v-btn--icon')[0].click()); await sleep(1200); }
      break; }
    case 'leeid': {
      // Lee el identificador (2.ª cifra de la fila: nº de fila + id) de la fila de rejilla que contiene a.pedido; lo guarda en VARS[a.var||'id'];
      // con resalta:true mueve el cursor a esa celda y la resalta.
      const id = await R.page.evaluate((p) => {
        document.querySelectorAll('[data-oys-id]').forEach((e) => e.removeAttribute('data-oys-id'));
        const tr = [...document.querySelectorAll('tbody tr')].filter((r) => (r.innerText || '').includes(p)).pop();
        if (!tr) return null;
        const tds = [...tr.querySelectorAll('td')].filter((t) => /^\d+$/.test((t.innerText || '').trim()));
        const td = tds[1]; if (!td) return null;
        td.setAttribute('data-oys-id', '1');
        return td.innerText.trim();
      }, a.pedido);
      if (!id) throw new Error('leeid: no encuentro la fila de ' + a.pedido);
      VARS[a.var || 'id'] = id; console.log('leeid', a.pedido, '=', id);
      if (a.resalta) { const r = await R.move({ sel: '[data-oys-id]' }); ev('resalta', { rect: r, ms: a.ms || 2500, texto: a.etiqueta }); await R.pause(a.ms || 2500); }
      break; }
    case 'csv': {
      // Escribe un CSV (delimitador ';') antes de subirlo. a.cabecera: string; a.lineas: [string]; «{id}» (o {<var>}) se sustituye por lo leído con leeid.
      const sub = (t) => String(t).replace(/\{(\w+)\}/g, (m, k) => (k in VARS ? VARS[k] : m));
      const f = path.resolve(a.fichero || path.join(REC, 'lineas_' + (a.var || 'id') + '.csv'));
      fs.mkdirSync(path.dirname(f), { recursive: true });
      fs.writeFileSync(f, [a.cabecera, ...(a.lineas || [])].map(sub).join('\n') + '\n');
      VARS.fichero = f; console.log('csv', f);
      break; }
    case 'upload': {
      // Sube un fichero al input[type=file] de la página (por defecto el escrito por «csv»).
      const h = await R.page.$(a.sel || 'input[type=file]');
      if (!h) throw new Error('upload: no hay input[type=file]');
      await h.uploadFile(path.resolve(a.fichero || VARS.fichero)); ev('upload', { fichero: path.basename(a.fichero || VARS.fichero) });
      await settle(a.espera ?? 2000);
      break; }
    case 'espera_frame': {
      // Espera (sondeando el contenido del iframe, lo que además lo despierta) a que aparezca a.texto (sin distinguir mayúsculas)
      const t1 = Date.now(); let ok = false;
      while (Date.now() - t1 < (a.ms || 30000)) {
        ok = await R.page.evaluate((t) => { try { const f = document.querySelector('iframe'); return !!f && f.contentDocument.body.innerText.toLowerCase().includes(t.toLowerCase()); } catch (e) { return false; } }, a.texto);
        if (ok) break; await sleep(500);
      }
      console.log('espera_frame', a.texto, ok); break; }
    case 'shot': await R.shot(a.nombre); break;
    default: throw new Error('acción desconocida ' + a.a);
  }
  CLAVE = null;
}
try {
  if (script.endsWith('.json')) {
    // capNN.json: graba cada escena «pantalla» con «acciones» como rec/<id>.webm
    const cap = JSON.parse(fs.readFileSync(script, 'utf8'));
    const solo = arg('solo') ? arg('solo').split(',') : null;
    const desde = arg('desde');
    let on = !desde;
    for (const e of cap.escenas) {
      if (e.id === desde) on = true;
      if (!on || !e.acciones || (solo && !solo.includes(e.id))) continue;
      console.log('== escena', e.id);
      const prep = e.acciones.filter((a) => a.prep);
      for (const a of prep) await accion(a);
      await R.start(e.id);
      for (const a of e.acciones.filter((a) => !a.prep)) await accion(a);
      await R.pause(800);
      await R.stop();
      await R.shot(e.id + '_fin');
    }
  } else {
    const mod = await import(pathToFileURL(path.resolve(script)).href);
    await mod.default(R);
  }
} catch (e) {
  console.log('ERROR', e.message);
  if (recorder) { try { await R.stop(); } catch {} }
  try { await R.shot('error_' + Date.now()); } catch {}
  process.exitCode = 1;
} finally {
  browser.disconnect();
  setTimeout(() => process.exit(process.exitCode || 0), 300);
}
