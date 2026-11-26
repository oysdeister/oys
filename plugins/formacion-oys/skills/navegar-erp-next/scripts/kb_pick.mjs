// Abre un desplegable (por etiqueta) y elige la opción cuyo texto empieza por <opcion>. Solo para filtros de consulta.
import puppeteer from 'puppeteer-core';
setTimeout(() => { console.log('TIMEOUT'); process.exit(2); }, 30000);
const [label, opt] = process.argv.slice(2);
const browser = await puppeteer.connect({ browserURL: 'http://127.0.0.1:9333', defaultViewport: null });
const pages = (await browser.pages()).filter((p) => p.url().includes('nextdemo.geasa.eu'));
const page = pages[pages.length - 1];
await page.setViewport({ width: 1920, height: 1080, deviceScaleFactor: 2 });
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
const box = await page.evaluate((t) => {
  const l = [...document.querySelectorAll('label')].find((l) => l.offsetParent && l.textContent.replace('*','').trim() === t);
  const s = l && l.closest('.v-input').querySelector('.v-input__slot');
  if (!s) return null; const r = s.getBoundingClientRect(); return { x: r.x + r.width / 2, y: r.y + r.height / 2 };
}, label);
if (!box) { console.log('NOT FOUND'); process.exit(0); }
await page.mouse.click(box.x, box.y);
await sleep(2500);
const opts = await page.evaluate(() => [...document.querySelectorAll('.menuable__content__active .v-list-item')].map((e) => e.innerText.replace(/\s+/g, ' ').trim()));
await page.screenshot({ path: process.env.PICKSHOT || '/dev/null', type: 'png' }).catch(()=>{});
console.log('opciones:', opts.join(' | '));
if (opt) {
  const ok = await page.evaluate((o) => { const e = [...document.querySelectorAll('.menuable__content__active .v-list-item')].find((e) => e.innerText.replace(/\s+/g, ' ').trim().startsWith(o)); if (e) { e.click(); return true; } return false; }, opt);
  console.log(ok ? 'picked' : 'opt not found');
}
await sleep(1000);
browser.disconnect(); process.exit(0);
