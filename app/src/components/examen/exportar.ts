/* Exporta el certificado SVG a PNG con un canvas, sin dependencias.
   Incrusta el logo y las dos fuentes como data URL para que la imagen salga igual que en pantalla. */
import fuenteDisplay from '@fontsource-variable/bricolage-grotesque/files/bricolage-grotesque-latin-wght-normal.woff2?url';
import fuenteTexto from '@fontsource-variable/instrument-sans/files/instrument-sans-latin-wght-normal.woff2?url';

async function aDataUrl(url: string): Promise<string> {
  const r = await fetch(url);
  const b = await r.blob();
  return new Promise((res, rej) => {
    const fr = new FileReader();
    fr.onload = () => res(String(fr.result));
    fr.onerror = () => rej(fr.error);
    fr.readAsDataURL(b);
  });
}

export async function svgAPng(svg: SVGSVGElement, nombreFichero: string, escala = 2) {
  const vb = svg.viewBox.baseVal;
  const w = vb.width || 1123;
  const h = vb.height || 794;
  const clon = svg.cloneNode(true) as SVGSVGElement;
  clon.setAttribute('xmlns', 'http://www.w3.org/2000/svg');
  clon.setAttribute('width', String(w));
  clon.setAttribute('height', String(h));

  await Promise.all(
    Array.from(clon.querySelectorAll('image')).map(async (img) => {
      const href = img.getAttribute('href');
      if (href && !href.startsWith('data:')) img.setAttribute('href', await aDataUrl(new URL(href, location.href).href));
    }),
  );

  try {
    const [d, t] = await Promise.all([aDataUrl(fuenteDisplay), aDataUrl(fuenteTexto)]);
    const estilo = document.createElementNS('http://www.w3.org/2000/svg', 'style');
    estilo.textContent = `@font-face{font-family:'Bricolage Grotesque Variable';src:url(${d}) format('woff2');font-weight:200 800;}
@font-face{font-family:'Instrument Sans Variable';src:url(${t}) format('woff2');font-weight:400 700;}`;
    clon.insertBefore(estilo, clon.firstChild);
  } catch {
    /* sin fuentes incrustadas: se usa la tipografía del sistema */
  }

  const xml = new XMLSerializer().serializeToString(clon);
  const src = `data:image/svg+xml;charset=utf-8,${encodeURIComponent(xml)}`;
  const img = new Image();
  img.decoding = 'async';
  await new Promise<void>((res, rej) => {
    img.onload = () => res();
    img.onerror = () => rej(new Error('No se pudo dibujar el certificado'));
    img.src = src;
  });

  const canvas = document.createElement('canvas');
  canvas.width = Math.round(w * escala);
  canvas.height = Math.round(h * escala);
  const ctx = canvas.getContext('2d');
  if (!ctx) throw new Error('Canvas no disponible');
  ctx.fillStyle = '#ffffff';
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

  const blob = await new Promise<Blob | null>((res) => canvas.toBlob(res, 'image/png'));
  if (!blob) throw new Error('No se pudo crear la imagen');
  const a = document.createElement('a');
  a.href = URL.createObjectURL(blob);
  a.download = nombreFichero;
  document.body.appendChild(a);
  a.click();
  a.remove();
  setTimeout(() => URL.revokeObjectURL(a.href), 4000);
}
