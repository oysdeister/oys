// Pulsa un botón por texto exacto (para abrir un menú), espera y captura 1920x1080@2x en ../hd/<nombre>.png. No pulsa opciones.
import puppeteer from 'puppeteer-core';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
setTimeout(() => { console.log('TIMEOUT'); process.exit(2); }, 40000);
const HERE = path.dirname(fileURLToPath(import.meta.url));
const [text, name, mode] = process.argv.slice(2);
const browser = await puppeteer.connect({ browserURL: 'http://127.0.0.1:9333', defaultViewport: null });
const pages = (await browser.pages()).filter((p) => p.url().includes('nextdemo.geasa.eu'));
const page = pages[pages.length - 1];
await page.setViewport({ width: 1920, height: 1080, deviceScaleFactor: 2 });
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
await sleep(800);
const box = await page.evaluate((t, mode, nojs) => {
  let els;
  if (mode === 'xy') { const [x,y]=t.split(',').map(Number); els=[document.elementFromPoint(x,y)]; }
  else if (mode === 'sel') els = [...document.querySelectorAll(t)].filter((e) => e.offsetParent !== null);
  else els = [...document.querySelectorAll('button, a, .v-btn, span, div')].filter((e) => e.offsetParent !== null && e.textContent.trim() === t);
  const el = els[0]; if (!el) return null;
  const b = el.closest('button') || el; const r = b.getBoundingClientRect(); const o={bubbles:true,cancelable:true,clientX:r.x+r.width/2,clientY:r.y+r.height/2,view:window}; if (!nojs) for (const ev of ['pointerdown','mousedown','pointerup','mouseup']) b.dispatchEvent(new (ev.startsWith('pointer')?PointerEvent:MouseEvent)(ev,o)); if (!nojs) b.click();
  return { x: r.x + r.width / 2, y: r.y + r.height / 2, html: b.outerHTML.slice(0, 120) };
}, text, mode, !!process.env.MOUSE);
if (!box) { console.log('NOT FOUND'); process.exit(0); }
if (process.env.MOUSE) { await page.mouse.move(box.x, box.y); await sleep(300); if (!process.env.HOVER) { await page.mouse.down(); await sleep(80); await page.mouse.up(); } }
await sleep(Number(process.env.WAIT || 2500));
const items = await page.evaluate(() => [...document.querySelectorAll('.menuable__content__active, .v-menu__content, [role=menu]')].filter(e=>getComputedStyle(e).display!=='none').map((e) => e.innerText.replace(/\s+/g, ' ')).join(' || '));
console.log('menu:', items);
await page.screenshot({ path: path.join(HERE, '..', 'hd', name + '.png') });
console.log('ok', name);
await page.keyboard.press('Escape');
await sleep(500);
browser.disconnect(); process.exit(0);
