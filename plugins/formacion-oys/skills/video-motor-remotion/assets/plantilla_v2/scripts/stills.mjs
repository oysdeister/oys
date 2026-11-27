// Renderiza varios fotogramas sueltos con un único bundle.
// ESCALA=1 para fotogramas a 1920×1080 (por defecto 0,5)
// uso: node scripts/stills.mjs out/stills  E-portada:20 E-portada:90 Tutorial:1500 ...
//      (frame admite «s» para segundos: E-flujo:6s; y «-N» desde el final)
import { bundle } from '@remotion/bundler';
import { renderStill, selectComposition, openBrowser } from '@remotion/renderer';
import path from 'node:path';
import fs from 'node:fs';

const [outDir, ...specs] = process.argv.slice(2);
fs.mkdirSync(outDir, { recursive: true });
const serveUrl = await bundle({ entryPoint: path.resolve('src/index.ts') });
const browser = await openBrowser('chrome');
for (const spec of specs) {
  const [id, fr] = spec.split(':');
  const comp = await selectComposition({ serveUrl, id, puppeteerInstance: browser });
  let frame = fr?.endsWith('s') ? Math.round(parseFloat(fr) * comp.fps) : parseInt(fr ?? '0', 10);
  if (frame < 0) frame = comp.durationInFrames + frame;
  frame = Math.min(frame, comp.durationInFrames - 1);
  const output = path.join(outDir, `${id}_${String(frame).padStart(5, '0')}.png`);
  await renderStill({ composition: comp, serveUrl, frame, output, puppeteerInstance: browser, scale: Number(process.env.ESCALA || 0.5) });
  console.log('ok', output);
}
await browser.close({ silent: true });
