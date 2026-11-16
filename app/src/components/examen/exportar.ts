/* Exporta el certificado SVG a PNG con un canvas, sin dependencias.
   Incrusta el logo y las fuentes como data URL para que la imagen salga igual que en pantalla. */
import fuenteDisplay from '@fontsource-variable/bricolage-grotesque/files/bricolage-grotesque-latin-wght-normal.woff2?url';
import fuenteTexto from '@fontsource-variable/instrument-sans/files/instrument-sans-latin-wght-normal.woff2?url';
import { FAMILIA_CERT, FUENTE_CERT_URL } from './CertificadoSVG';

async function aDataUrl(url: string): Promise<string> {
  const r = await fetch(url);
  if (!r.ok) throw new Error(`No se pudo leer ${url}`);
  const b = await r.blob();
  return new Promise((res, rej) => {
    const fr = new FileReader();
    fr.onload = () => res(String(fr.result));
    fr.onerror = () => rej(fr.error);
    fr.readAsDataURL(b);
  });
}

/** Deja el clon en su estado final aunque la animación de entrada no haya terminado */
function estadoFinal(clon: SVGSVGElement) {
  clon.querySelectorAll<SVGElement>('[style]').forEach((el) => {
    ['opacity', 'stroke-dasharray', 'stroke-dashoffset', 'visibility', 'will-change'].forEach((p) => el.style.removeProperty(p));
  });
  clon.querySelectorAll('[pathLength]').forEach((el) => el.removeAttribute('pathLength'));
  clon.querySelectorAll('[opacity="0"]').forEach((el) => el.removeAttribute('opacity'));
}

/** Dibuja el SVG en un canvas y devuelve el PNG */
export async function svgABlob(svg: SVGSVGElement, escala = 2): Promise<Blob> {
  const vb = svg.viewBox.baseVal;
  const w = vb.width || 1123;
  const h = vb.height || 794;
  const clon = svg.cloneNode(true) as SVGSVGElement;
  clon.setAttribute('xmlns', 'http://www.w3.org/2000/svg');
  clon.setAttribute('xmlns:xlink', 'http://www.w3.org/1999/xlink');
  clon.setAttribute('width', String(w));
  clon.setAttribute('height', String(h));
  estadoFinal(clon);

  await Promise.all(
    Array.from(clon.querySelectorAll('image')).map(async (img) => {
      const href = img.getAttribute('href');
      if (href && !href.startsWith('data:')) img.setAttribute('href', await aDataUrl(new URL(href, location.href).href));
    }),
  );

  try {
    const [c, d, t] = await Promise.all([aDataUrl(FUENTE_CERT_URL), aDataUrl(fuenteDisplay), aDataUrl(fuenteTexto)]);
    const estilo = document.createElementNS('http://www.w3.org/2000/svg', 'style');
    estilo.textContent = `@font-face{font-family:'${FAMILIA_CERT}';src:url(${c}) format('woff2');font-weight:200 800;font-stretch:75% 100%;}
@font-face{font-family:'Bricolage Grotesque Variable';src:url(${d}) format('woff2');font-weight:200 800;}
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
  // Safari a veces pinta el SVG antes de aplicar las fuentes incrustadas: un segundo decode lo evita
  try {
    await img.decode();
  } catch {
    /* ya cargada */
  }

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
  return blob;
}

export async function svgAPng(svg: SVGSVGElement, nombreFichero: string, escala = 2) {
  const blob = await svgABlob(svg, escala);
  const a = document.createElement('a');
  a.href = URL.createObjectURL(blob);
  a.download = nombreFichero;
  document.body.appendChild(a);
  a.click();
  a.remove();
  setTimeout(() => URL.revokeObjectURL(a.href), 4000);
  return blob;
}
