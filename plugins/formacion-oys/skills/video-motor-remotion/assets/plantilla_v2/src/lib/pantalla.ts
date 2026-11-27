// Geometría y cámara de la escena «pantalla» (funciones puras: las usan la escena y los subtítulos).
import { interpolate } from 'remotion';
import type { Pantalla, Rect, Word } from '../types';
import { calcTiempos, clamp, easeInOut } from './scene';

export const FW = 1920;
export const FH = 1080;
/** alto de la barra del navegador */
export const CH = 30;
/** ancho máximo del panel (92 % del encuadre) */
const PW_MAX = 1768;
/** margen mínimo arriba + abajo */
const MARGEN_V = 36;

export type Geom = {
  src: { w: number; h: number };
  base: Rect;
  /** px de vídeo → px de panel */
  k: number;
  PW: number;
  PH: number;
  /** esquina superior izquierda del panel (incluida la barra) en el encuadre */
  X0: number;
  Y0: number;
};

export function geom(e: Pantalla): Geom {
  const src = e.tamano ?? { w: 3200, h: 1800 };
  const base: Rect = e.recorte ?? { x: 0, y: 0, w: src.w, h: src.h };
  let PW = PW_MAX;
  let PH = (PW * base.h) / base.w;
  const maxH = FH - MARGEN_V - CH;
  if (PH > maxH) {
    PH = maxH;
    PW = (PH * base.w) / base.h;
  }
  PW = Math.round(PW);
  PH = Math.round(PH);
  const k = PW / base.w;
  return { src, base, k, PW, PH, X0: Math.round((FW - PW) / 2), Y0: Math.round((FH - PH - CH) / 2) };
}

export type Cam = { z: number; cx: number; cy: number };

const mix = (a: Cam, b: Cam, p: number): Cam => ({
  z: Math.exp(Math.log(a.z) + (Math.log(b.z) - Math.log(a.z)) * p),
  cx: a.cx + (b.cx - a.cx) * p,
  cy: a.cy + (b.cy - a.cy) * p,
});

/** rect de vídeo → coordenadas de contenido del panel (a zoom 1) */
export const toPanel = (g: Geom, r: Rect): Rect => ({ x: (r.x - g.base.x) * g.k, y: (r.y - g.base.y) * g.k, w: r.w * g.k, h: r.h * g.k });

/** Cámara 2D: zoom «z» con el punto (cx, cy) del contenido en el centro de la ventana. Nunca enseña fuera del vídeo. */
export function camAt(e: Pantalla, g: Geom, frame: number, fps: number, tz: number[]): Cam {
  const rest: Cam = { z: 1, cx: g.PW / 2, cy: g.PH / 2 };
  let cam = rest;
  (e.zooms ?? []).forEach((zm, i) => {
    const d = Math.max(1, Math.round((zm.dur ?? 1.2) * fps));
    const p = interpolate(frame, [tz[i], tz[i] + d], [0, 1], { ...clamp, easing: easeInOut });
    if (p <= 0) return;
    let target = rest;
    if (zm.rect) {
      const r = toPanel(g, zm.rect);
      const z = Math.max(1, Math.min(2.2, g.PW / r.w, g.PH / r.h));
      target = { z, cx: r.x + r.w / 2, cy: r.y + r.h / 2 };
    }
    cam = mix(cam, target, p);
  });
  const hw = g.PW / (2 * cam.z);
  const hh = g.PH / (2 * cam.z);
  return { z: cam.z, cx: Math.min(Math.max(cam.cx, hw), g.PW - hw), cy: Math.min(Math.max(cam.cy, hh), g.PH - hh) };
}

/** contenido (zoom 1) → ventana del panel (px dentro del área de contenido) */
export const toView = (g: Geom, cam: Cam, r: Rect): Rect => ({
  x: g.PW / 2 + (r.x - cam.cx) * cam.z,
  y: g.PH / 2 + (r.y - cam.cy) * cam.z,
  w: r.w * cam.z,
  h: r.h * cam.z,
});

export type Marca = { tipo: 'callout' | 'resalte'; i: number; n: number; rect: Rect; texto?: string; lado?: string; start: number; end: number; oscurece: boolean };

/** Callouts y resaltes con su intervalo en fotogramas de escena. */
export function marcas(e: Pantalla, words: Word[], lead: number, fps: number, dur: number): Marca[] {
  const cs = e.callouts ?? [];
  const rs = e.resaltes ?? [];
  const tc = calcTiempos(cs, words, lead, fps, { inicio: 2, paso: 1.8 });
  const tr = calcTiempos(rs, words, lead, fps, { inicio: 2, paso: 2.5 });
  const out: Marca[] = [];
  cs.forEach((c, i) =>
    out.push({
      tipo: 'callout', i, n: i + 1, rect: c.rect, texto: c.texto, lado: c.lado, start: tc[i],
      end: c.hasta !== undefined ? Math.round(c.hasta * fps) : (tc[i + 1] ?? dur + 10), oscurece: true,
    }),
  );
  rs.forEach((r, i) =>
    out.push({
      tipo: 'resalte', i, n: 0, rect: r.rect, texto: r.etiqueta, lado: r.lado, start: tr[i],
      end: r.hasta !== undefined ? Math.round(r.hasta * fps) : tr[i] + Math.round(3 * fps), oscurece: r.oscurece !== false,
    }),
  );
  return out;
}

/** Zonas del encuadre (px de 1920×1080) ocupadas por callouts/resaltes activos en «frame» (para apartar los subtítulos). */
export function zonasPantalla(e: Pantalla, words: Word[], lead: number, fps: number, dur: number, frame: number): Rect[] {
  const g = geom(e);
  const tz = calcTiempos(e.zooms ?? [], words, lead, fps, { inicio: 1, paso: 2.5 });
  const cam = camAt(e, g, frame, fps, tz);
  const out: Rect[] = [];
  for (const m of marcas(e, words, lead, fps, dur)) {
    if (frame < m.start - 4 || frame > m.end + 8) continue;
    const v = toView(g, cam, toPanel(g, m.rect));
    const y0 = g.Y0 + CH + v.y - 12;
    const extra = m.texto ? 70 : 0; // la etiqueta puede caer debajo
    out.push({ x: g.X0 + v.x - 12, y: y0, w: v.w + 24, h: v.h + 24 + extra });
  }
  return out;
}
