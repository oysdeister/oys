// Ayuda de teclado (solo para filtros de búsqueda): node kb.mjs type "<label>" "<texto>" | key "<Tecla>" | clickxy x y
import puppeteer from 'puppeteer-core';
setTimeout(() => { console.log('TIMEOUT'); process.exit(2); }, 25000);
const [cmd, a, b] = process.argv.slice(2);
const browser = await puppeteer.connect({ browserURL: 'http://127.0.0.1:9333', defaultViewport: null });
const pages = (await browser.pages()).filter((p) => p.url().includes('nextdemo.geasa.eu'));
const page = pages[pages.length - 1];
await page.setViewport({ width: 1920, height: 1080, deviceScaleFactor: 2 });
try {
  if (cmd === 'type') {
    const ok = await page.evaluate((t) => {
      const l = [...document.querySelectorAll('label')].find((l) => l.offsetParent && l.textContent.replace('*','').trim() === t);
      const i = l && l.closest('.v-input').querySelector('input,textarea');
      if (!i) return false; i.scrollIntoView({block:'center'}); i.focus(); return true;
    }, a);
    if (!ok) console.log('NOT FOUND'); else { await page.keyboard.type(b, { delay: 40 }); console.log('typed'); }
  } else if (cmd === 'key') {
    await page.keyboard.press(a); console.log('pressed', a);
  } else if (cmd === 'eval') {
    const r = await page.evaluate(a); console.log(typeof r === 'string' ? r : JSON.stringify(r));
  } else if (cmd === 'clickxy') {
    await page.mouse.click(Number(a), Number(b)); console.log('clicked', a, b);
  }
  await new Promise((r) => setTimeout(r, 1500));
} finally { browser.disconnect(); process.exit(0); }
