// erp2.mjs: como erp.mjs pero con eventos reales de puppeteer (Vuetify).
// Uso: node erp2.mjs <cmd> [args...]  (varios comandos encadenados con ' ;; ')
//   goto <url|objeto> | url | shot <nombre> | eval "<js>"
//   clickxy x y | clicksel "<css>" | clicktext "<texto exacto>" [n]  (ratón real en el centro)
//   type "<texto>" | key <Tecla> [veces] | sleep ms
//   rect "<css o texto>"   -> rects (CSS px 1920x1080)
//   fields                 -> etiquetas visibles de inputs con valor y rect
//   buttons                -> botones visibles con texto y rect
//   focus "<label>"        -> clic real en el input de la etiqueta
//   msgs                   -> diálogos / snackbars / alertas visibles
//   menu                   -> elementos de menú/listas desplegadas visibles
import puppeteer from 'puppeteer-core';
import path from 'node:path';
import fs from 'node:fs';
import { fileURLToPath } from 'node:url';

setTimeout(() => { console.log('TIMEOUT'); process.exit(2); }, Number(process.env.TMO || 90000));
const HERE = path.dirname(fileURLToPath(import.meta.url));
const OUT = process.env.SHOTDIR || path.join(HERE, 'shots');
const BASE = 'https://nextdemo.geasa.eu/view/app/tutorial/dispatch/';
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

const browser = await puppeteer.connect({ browserURL: 'http://127.0.0.1:9333', defaultViewport: null });
const pages = (await browser.pages()).filter((p) => p.url().includes('nextdemo.geasa.eu'));
// TAB=<nombre>: cada agente usa su propia pestaña (registro en .tabs.json), sin robar el foco a otros.
let page;
if (process.env.TAB) {
  const REG = path.join(HERE, '.tabs.json');
  const reg = fs.existsSync(REG) ? JSON.parse(fs.readFileSync(REG, 'utf8')) : {};
  const all = await browser.pages();
  page = all.find((p) => p.target()._targetId === reg[process.env.TAB]);
  if (!page) {
    const cdp = await browser.target().createCDPSession();
    const { targetId } = await cdp.send('Target.createTarget', { url: 'about:blank', newWindow: true });
    await sleep(800);
    page = (await browser.pages()).find((p) => p.target()._targetId === targetId);
    reg[process.env.TAB] = targetId;
    fs.writeFileSync(REG, JSON.stringify(reg, null, 1));
  }
} else {
  page = (process.env.PAGE ? pages.filter((p) => p.url().includes(process.env.PAGE)).pop() : pages.filter((p) => !p.url().includes('dbstudio')).pop()) || (await browser.pages())[0];
}
try { const cs = await page.target().createCDPSession(); await cs.send('Emulation.setFocusEmulationEnabled', { enabled: true }); } catch {}
await page.bringToFront();
const vp = await page.evaluate(() => [innerWidth, innerHeight, devicePixelRatio]);
if (vp[0] !== 1920 || vp[1] !== 1080 || vp[2] !== 2) await page.setViewport({ width: 1920, height: 1080, deviceScaleFactor: 2 });
const settle = async (ms = 1500) => {
  await sleep(ms);
  try { await page.waitForNetworkIdle({ idleTime: 500, timeout: 8000 }); } catch {}
};

const vis = `(e)=>{const r=e.getBoundingClientRect();const s=getComputedStyle(e);return r.width>0&&r.height>0&&s.visibility!=='hidden'&&s.display!=='none'&&r.bottom>0&&r.top<1080}`;
const R = (r) => [Math.round(r.x), Math.round(r.y), Math.round(r.width), Math.round(r.height)];

async function findText(t, n = 0) {
  return page.evaluate((t, n, visSrc) => {
    const vis = eval(visSrc);
    const els = [...document.querySelectorAll('button, a, .v-btn, .v-list-item, .v-tab, [role=option], [role=menuitem], td, th, label, span, div')]
      .filter((e) => vis(e) && (e.innerText || e.textContent || '').trim() === t);
    // prefer the deepest-most interactive
    const pick = els.map((e) => e.closest('button,a,.v-list-item,.v-tab,[role=option],[role=menuitem]') || e);
    const uniq = [...new Set(pick)];
    const el = uniq[n] || uniq[uniq.length - 1];
    if (!el) return null;
    const r = el.getBoundingClientRect();
    return { x: r.x + r.width / 2, y: r.y + r.height / 2, rect: [r.x, r.y, r.width, r.height].map(Math.round), count: uniq.length };
  }, t, n, vis);
}

async function run(cmd, a, b, c) {
  if (cmd === 'goto') {
    const url = a.startsWith('http') ? a : BASE + a;
    await page.goto(url, { waitUntil: 'domcontentloaded' });
    await settle(3000);
    console.log(page.url(), '|', await page.title());
  } else if (cmd === 'url') {
    console.log(page.url(), '|', await page.title());
  } else if (cmd === 'shot') {
    await settle(800);
    fs.mkdirSync(OUT, { recursive: true });
    await page.screenshot({ path: path.join(OUT, a + '.png') });
    console.log('shot', a);
  } else if (cmd === 'eval') {
    const r = await page.evaluate(a);
    console.log(typeof r === 'string' ? r : JSON.stringify(r));
  } else if (cmd === 'clickxy') {
    await page.mouse.click(Number(a), Number(b));
    await settle(Number(c || 1200));
    console.log('clickxy', a, b);
  } else if (cmd === 'dblxy') {
    await page.mouse.click(Number(a), Number(b), { clickCount: 2 });
    await settle(1200);
    console.log('dblxy', a, b);
  } else if (cmd === 'hover') {
    await page.mouse.move(Number(a), Number(b));
    await sleep(600);
  } else if (cmd === 'clicksel') {
    const el = (await page.$$(a)).at(Number(b || 0));
    if (!el) { console.log('NOT FOUND'); return; }
    const bx = await el.boundingBox();
    await page.mouse.click(bx.x + bx.width / 2, bx.y + bx.height / 2);
    await settle(1200);
    console.log('clicksel', R(bx));
  } else if (cmd === 'clicktext') {
    const f = await findText(a, Number(b || 0));
    if (!f) { console.log('NOT FOUND', a); return; }
    await page.mouse.click(f.x, f.y);
    await settle(Number(c || 1500));
    console.log('clicktext', a, f.rect, 'of', f.count);
  } else if (cmd === 'type') {
    await page.keyboard.type(a, { delay: 50 });
    await settle(900);
    console.log('typed', a);
  } else if (cmd === 'key') {
    for (let i = 0; i < Number(b || 1); i++) {
      const parts = a.split('+'); const k = parts.pop();
      for (const m of parts) await page.keyboard.down(m);
      await page.keyboard.press(k);
      for (const m of parts.reverse()) await page.keyboard.up(m);
      await sleep(150);
    }
    await settle(700);
    console.log('key', a);
  } else if (cmd === 'selall') {
    await page.keyboard.press('KeyA', { commands: ['selectAll'] });
    await sleep(300);
    console.log('selall');
  } else if (cmd === 'sleep') {
    await sleep(Number(a));
  } else if (cmd === 'rect') {
    const r = await page.evaluate((q, visSrc) => {
      const vis = eval(visSrc);
      let els = [];
      try { els = [...document.querySelectorAll(q)]; } catch {}
      if (!els.length) els = [...document.querySelectorAll('button,a,label,span,div,td,input')].filter((e) => (e.innerText || '').trim() === q);
      return els.filter(vis).slice(0, 8).map((e) => { const r = e.getBoundingClientRect(); return [e.tagName, (e.innerText || e.value || '').slice(0, 40), Math.round(r.x), Math.round(r.y), Math.round(r.width), Math.round(r.height)]; });
    }, a, vis);
    console.log(JSON.stringify(r));
  } else if (cmd === 'fields') {
    const r = await page.evaluate((visSrc) => {
      const vis = eval(visSrc);
      const root = [...document.querySelectorAll('.v-dialog--active')].filter(vis).pop() || document;
      return [...root.querySelectorAll('.v-input')].filter(vis).filter((vi)=>vi.querySelector('label')).map((vi) => {
        const l = vi.querySelector('label');
        const inp = vi.querySelector('input:not([type=hidden]),textarea');
        const sel = vi.querySelector('.v-select__selection, .v-select__selections');
        const r = vi.getBoundingClientRect();
        const val = (inp && inp.value) || (sel && sel.innerText) || '';
        return `${(l && l.innerText || '?').trim()} = ${val.replace(/\s+/g, ' ').trim()} @${Math.round(r.x)},${Math.round(r.y)},${Math.round(r.width)},${Math.round(r.height)}${vi.classList.contains('error--text') ? ' ERR' : ''}${vi.classList.contains('v-input--is-disabled') || vi.classList.contains('v-input--is-readonly') ? ' RO' : ''}`;
      }).join('\n');
    }, vis);
    console.log(r);
  } else if (cmd === 'buttons') {
    const r = await page.evaluate((visSrc) => {
      const vis = eval(visSrc);
      return [...document.querySelectorAll('button, .v-btn')].filter(vis).map((e) => {
        const r = e.getBoundingClientRect();
        const t = (e.innerText || '').replace(/\s+/g, ' ').trim() || e.getAttribute('aria-label') || e.title || (e.querySelector('i') && e.querySelector('i').className.replace(/.*mdi-/, 'mdi-').split(' ')[0]) || '';
        return `${t} @${Math.round(r.x)},${Math.round(r.y)},${Math.round(r.width)},${Math.round(r.height)}${e.disabled ? ' DIS' : ''}`;
      }).join('\n');
    }, vis);
    console.log(r);
  } else if (cmd === 'focus') {
    const f = await page.evaluate((t, visSrc) => {
      const vis = eval(visSrc);
      const root = [...document.querySelectorAll('.v-dialog--active')].filter(vis).pop() || document;
      const l = [...root.querySelectorAll('label')].filter(vis).find((l) => l.innerText.replace('*', '').trim() === t);
      const vi = l && l.closest('.v-input');
      const i = vi && (vi.querySelector('input:not([type=hidden]),textarea') || vi.querySelector('.v-input__slot'));
      if (!i) return null;
      i.scrollIntoView({ block: 'center' });
      const r = i.getBoundingClientRect();
      return { x: r.x + Math.min(r.width / 2, 60), y: r.y + r.height / 2, rect: [r.x, r.y, r.width, r.height].map(Math.round) };
    }, a, vis);
    if (!f) { console.log('NOT FOUND', a); return; }
    await sleep(300);
    await page.mouse.click(f.x, f.y);
    await settle(Number(b || 900));
    console.log('focus', a, f.rect);
  } else if (cmd === 'msgs') {
    const r = await page.evaluate((visSrc) => {
      const vis = eval(visSrc);
      return [...document.querySelectorAll('.v-dialog--active, .v-snack__content, .v-alert, [role=alert], [role=alertdialog], .v-messages__message, .swal2-popup, .notification')]
        .filter(vis).map((e) => e.innerText.replace(/\s+/g, ' ').trim().slice(0, 400)).filter(Boolean).join('\n---\n');
    }, vis);
    console.log(r || '(sin mensajes)');
  } else if (cmd === 'menu') {
    const r = await page.evaluate((visSrc) => {
      const vis = eval(visSrc);
      return [...document.querySelectorAll('.menuable__content__active .v-list-item, .v-menu__content .v-list-item, [role=listbox] [role=option], [role=menu] [role=menuitem]')]
        .filter(vis).slice(0, 40).map((e) => { const r = e.getBoundingClientRect(); return `${e.innerText.replace(/\s+/g, ' ').trim()} @${Math.round(r.x)},${Math.round(r.y)},${Math.round(r.width)},${Math.round(r.height)}`; }).join('\n');
    }, vis);
    console.log(r || '(sin menú)');
  } else if (cmd === 'pick') {
    // clic en la fila del desplegable activo cuya celda tenga exactamente el texto a
    const f = await page.evaluate((t) => {
      const m = [...document.querySelectorAll('.menuable__content__active')].pop();
      if (!m) return { err: 'no menu' };
      const cells = [...m.querySelectorAll('td, .v-list-item__title, .v-list-item')].filter((c) => c.innerText.trim() === t && c.getBoundingClientRect().width > 0);
      const c = cells[0];
      if (!c) return { err: 'no cell', rows: m.innerText.slice(0, 400).replace(/\s+/g, ' ') };
      const r = c.getBoundingClientRect();
      return { x: r.x + r.width / 2, y: r.y + r.height / 2, rect: [r.x, r.y, r.width, r.height].map(Math.round) };
    }, a);
    if (f.err) { console.log('PICK FAIL', f.err, f.rows || ''); return; }
    await page.mouse.click(f.x, f.y);
    await settle(Number(b || 1500));
    console.log('pick', a, f.rect);
  } else if (cmd === 'menutext') {
    const t = await page.evaluate(() => { const m = [...document.querySelectorAll('.menuable__content__active')].pop(); return m ? m.innerText.replace(/\s+/g, ' ').slice(0, 1500) : '(sin menú)'; });
    console.log(t);
  } else if (cmd === 'text') {
    const r = await page.evaluate(() => document.body.innerText.replace(/\n{2,}/g, '\n'));
    console.log(r.slice(Number(a || 0), Number(a || 0) + Number(b || 4000)));
  } else {
    console.log('cmd?', cmd);
  }
}

try {
  const argv = process.argv.slice(2);
  const groups = [[]];
  for (const x of argv) { if (x === ';;') groups.push([]); else groups[groups.length - 1].push(x); }
  for (const g of groups) if (g.length) await run(...g);
} catch (e) {
  console.log('ERROR', e.message);
} finally {
  browser.disconnect();
  process.exit(0);
}
