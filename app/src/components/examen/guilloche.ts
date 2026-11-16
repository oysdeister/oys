/* Generadores de trazos guilloché en SVG (sin dependencias). Todo es geometría pura. */

const f = (n: number) => n.toFixed(1);

function mcd(a: number, b: number): number {
  return b ? mcd(b, a % b) : a;
}

/** Hipotrocoide (espirógrafo): la roseta clásica de los billetes */
export function hipotrocoide(cx: number, cy: number, R: number, r: number, d: number, escala = 1, puntos = 1400) {
  const T = (2 * Math.PI * r) / mcd(R, r);
  let s = '';
  for (let i = 0; i <= puntos; i++) {
    const t = (T * i) / puntos;
    const x = cx + escala * ((R - r) * Math.cos(t) + d * Math.cos(((R - r) / r) * t));
    const y = cy + escala * ((R - r) * Math.sin(t) - d * Math.sin(((R - r) / r) * t));
    s += `${i ? 'L' : 'M'}${f(x)} ${f(y)}`;
  }
  return s + 'Z';
}

/** Anillo ondulado: r(θ) = r0 + amp·sin(lóbulos·θ + fase). Varias fases dan el trenzado. */
export function anillo(cx: number, cy: number, r0: number, amp: number, lobulos: number, fase: number, puntos = 720) {
  let s = '';
  for (let i = 0; i <= puntos; i++) {
    const t = (2 * Math.PI * i) / puntos;
    const rr = r0 + amp * Math.sin(lobulos * t + fase);
    s += `${i ? 'L' : 'M'}${f(cx + rr * Math.cos(t))} ${f(cy + rr * Math.sin(t))}`;
  }
  return s + 'Z';
}

/** Onda a lo largo de un segmento: para las bandas del marco */
export function onda(x0: number, y0: number, x1: number, y1: number, amp: number, periodo: number, fase: number) {
  const L = Math.hypot(x1 - x0, y1 - y0);
  const ux = (x1 - x0) / L;
  const uy = (y1 - y0) / L;
  const n = Math.max(2, Math.ceil(L / 3));
  let s = '';
  for (let i = 0; i <= n; i++) {
    const d = (L * i) / n;
    const o = amp * Math.sin((2 * Math.PI * d) / periodo + fase);
    s += `${i ? 'L' : 'M'}${f(x0 + ux * d - uy * o)} ${f(y0 + uy * d + ux * o)}`;
  }
  return s;
}

/** Marco trenzado de un rectángulo: devuelve los trazos de las cuatro bandas */
export function marco(x: number, y: number, w: number, h: number, amp: number, periodo: number, hebras: number) {
  const out: string[] = [];
  for (let k = 0; k < hebras; k++) {
    const fase = (k * 2 * Math.PI) / hebras;
    out.push(onda(x, y, x + w, y, amp, periodo, fase));
    out.push(onda(x + w, y, x + w, y + h, amp, periodo, fase));
    out.push(onda(x + w, y + h, x, y + h, amp, periodo, fase));
    out.push(onda(x, y + h, x, y, amp, periodo, fase));
  }
  return out;
}

/** El arco del logo O&S: media luna que nace gruesa abajo a la izquierda y se afila arriba a la derecha */
export const ARCO = {
  // borde exterior, que también sirve de guía para la máscara que lo «dibuja»
  guia: 'M64 690 C 60 250, 380 40, 1070 70',
  relleno: 'M64 690 C 60 250, 380 40, 1070 70 C 392 60, 86 262, 88 690 Z',
};
