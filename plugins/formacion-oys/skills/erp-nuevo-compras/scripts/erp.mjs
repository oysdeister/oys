// CLI mínima para manejar el Chrome del ERP (puerto 9333) y sacar capturas 1920x1080 @2x.
// Uso:
//   node erp.mjs goto <url|objeto>        navega (objeto => /view/app/tutorial/dispatch/<objeto>)
//   node erp.mjs shot <NN_nombre> [sel]   captura 1920x1080 @2x en ../hd/<NN_nombre>.png (sel opcional: solo ese elemento)
//   node erp.mjs click "<texto>"          pulsa el primer elemento visible cuyo texto sea exactamente <texto>
//   node erp.mjs clickrow <n>             abre la fila n de la rejilla (enlace numérico rojo)
//   node erp.mjs tab "<texto>"            activa la pestaña con ese texto
//   node erp.mjs eval "<js>"              evalúa JS y muestra el resultado
//   node erp.mjs url                      muestra URL y título
import puppeteer from 'puppeteer-core';
import path from 'node:path';
import fs from 'node:fs';
import { fileURLToPath } from 'node:url';

const HERE = path.dirname(fileURLToPath(import.meta.url));
const OUT = path.join(HERE, '..', 'hd');
fs.mkdirSync(OUT, { recursive: true });
const BASE = 'https://nextdemo.geasa.eu/view/app/tutorial/dispatch/';
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

const [cmd, arg, arg2] = process.argv.slice(2);
const browser = await puppeteer.connect({ browserURL: 'http://127.0.0.1:9333', defaultViewport: null });
const pages = (await browser.pages()).filter((p) => p.url().includes('nextdemo.geasa.eu'));
const page = pages[pages.length - 1] || (await browser.pages())[0];
await page.setViewport({ width: 1920, height: 1080, deviceScaleFactor: 2 });

const settle = async (ms = 2500) => {
  await sleep(ms);
  try { await page.waitForNetworkIdle({ idleTime: 600, timeout: 8000 }); } catch {}
};

try {
  if (cmd === 'goto') {
    const url = arg.startsWith('http') ? arg : BASE + arg;
    await page.goto(url, { waitUntil: 'domcontentloaded' });
    await settle(3000);
    console.log(page.url(), '|', await page.title());
  } else if (cmd === 'shot') {
    await settle(1200);
    const file = path.join(OUT, arg + '.png');
    if (arg2) {
      const el = await page.$(arg2);
      await el.screenshot({ path: file });
    } else {
      await page.screenshot({ path: file });
    }
    console.log('ok', file);
  } else if (cmd === 'click') {
    const ok = await page.evaluate((t) => {
      const els = [...document.querySelectorAll('button, a, .v-list-item, .v-tab, div, span')].filter(
        (e) => e.offsetParent !== null && e.textContent.trim() === t);
      const el = els[els.length - 1];
      if (!el) return false;
      el.click();
      return true;
    }, arg);
    await settle(1500);
    console.log(ok ? 'clicked' : 'NOT FOUND', page.url());
  } else if (cmd === 'clickrow') {
    const ok = await page.evaluate((n) => {
      const a = [...document.querySelectorAll('a')].find((e) => e.offsetParent !== null && e.textContent.trim() === String(n));
      if (!a) return false;
      a.click();
      return true;
    }, arg);
    await settle(2500);
    console.log(ok ? 'opened' : 'NOT FOUND', page.url());
  } else if (cmd === 'tab') {
    const ok = await page.evaluate((t) => {
      const el = [...document.querySelectorAll('.v-tab')].find((e) => e.textContent.trim() === t);
      if (!el) return false;
      el.scrollIntoView({ block: 'center' });
      el.click();
      return true;
    }, arg);
    await settle(1000);
    console.log(ok ? 'tab' : 'NOT FOUND');
  } else if (cmd === 'eval') {
    const r = await page.evaluate(arg);
    console.log(typeof r === 'string' ? r : JSON.stringify(r, null, 1));
  } else if (cmd === 'url') {
    console.log(page.url(), '|', await page.title());
  }
} finally {
  browser.disconnect();
}
