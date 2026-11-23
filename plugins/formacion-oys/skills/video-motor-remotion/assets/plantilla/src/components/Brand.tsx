import React, { createContext, useContext } from 'react';
import { Img, interpolate, staticFile, useCurrentFrame } from 'remotion';
import type { Marca } from '../types';
import type { Plan } from '../lib/plan';
import { C, F } from '../theme';
import { clamp } from '../lib/scene';

type MarcaN = Required<Pick<Marca, 'texto'>> & Marca & { copyrightTxt: string };

const Ctx = createContext<MarcaN | null>(null);

/** Normaliza config.marca (string o {logo, texto…}). */
export const normMarca = (m?: string | Marca): MarcaN | null => {
  if (!m) return null;
  const o: Marca = typeof m === 'string' ? { texto: m } : m;
  const texto = o.texto ?? '';
  return { ...o, texto, copyrightTxt: o.copyright ?? `© ${new Date().getFullYear()} ${texto}` };
};

export const BrandProvider: React.FC<{ marca: MarcaN | null; children: React.ReactNode }> = ({ marca, children }) => (
  <Ctx.Provider value={marca}>{children}</Ctx.Provider>
);
export const useMarca = () => useContext(Ctx);

/**
 * Logotipo de la empresa con entrada animada.
 *  draw 0→1: el trazo (todo lo que queda fuera de «zonaTexto») se revela con un barrido circular.
 *  text 0→1: aparece el texto (lo que queda dentro de «zonaTexto»).
 *  Sin zonaTexto: revelado simple de todo el logo.
 */
export const BrandLogo: React.FC<{ width: number; draw?: number; text?: number; style?: React.CSSProperties }> = ({ width, draw = 1, text = 1, style }) => {
  const m = useMarca();
  if (!m?.logo) return null;
  const W = m.ancho ?? 544;
  const H = m.alto ?? 332;
  const h = (width * H) / W;
  const src = staticFile(m.logo);
  const z = m.zonaTexto;
  const img: React.CSSProperties = { position: 'absolute', inset: 0, width, height: h };
  if (!z) {
    const p = Math.min(draw, text);
    return (
      <div style={{ position: 'relative', width, height: h, ...style }}>
        <Img src={src} style={{ ...img, opacity: p, clipPath: `inset(0 ${(1 - p) * 100}% 0 0)`, filter: `blur(${(1 - p) * 6}px)` }} />
      </div>
    );
  }
  // zona de texto en %
  const x1 = (z.x / W) * 100;
  const y1 = (z.y / H) * 100;
  const x2 = ((z.x + z.w) / W) * 100;
  const y2 = ((z.y + z.h) / H) * 100;
  const sweep = draw * 200; // grados de barrido
  const cx = m.centroTrazo?.x ?? 55;
  const cy = m.centroTrazo?.y ?? 71;
  const desde = m.inicioTrazo ?? 240;
  const mask = `conic-gradient(from ${desde}deg at ${cx}% ${cy}%, #000 0deg, #000 ${sweep}deg, transparent ${sweep + 6}deg)`;
  return (
    <div style={{ position: 'relative', width, height: h, ...style }}>
      {/* trazo */}
      <Img
        src={src}
        style={{
          ...img,
          clipPath: `polygon(evenodd, 0 0, 100% 0, 100% 100%, 0 100%, 0 0, ${x1}% ${y1}%, ${x2}% ${y1}%, ${x2}% ${y2}%, ${x1}% ${y2}%, ${x1}% ${y1}%)`,
          WebkitMaskImage: draw >= 1 ? undefined : mask,
          maskImage: draw >= 1 ? undefined : mask,
          filter: draw < 1 ? `drop-shadow(0 0 ${10 * (1 - draw) + 4}px ${C.brand}aa)` : `drop-shadow(0 0 4px ${C.brand}66)`,
        }}
      />
      {/* texto */}
      <Img
        src={src}
        style={{
          ...img,
          clipPath: `polygon(${x1}% ${y1}%, ${x2}% ${y1}%, ${x2}% ${y2}%, ${x1}% ${y2}%)`,
          opacity: interpolate(text, [0, 0.6], [0, 1], clamp),
          transform: `translateY(${(1 - text) * 10}px)`,
          filter: `blur(${(1 - text) * 8}px)`,
        }}
      />
    </div>
  );
};

/** Mosca de copyright en la esquina inferior derecha (se oculta en portada y cierre, donde va el logo grande). */
export const Watermark: React.FC<{ plan: Plan }> = ({ plan }) => {
  const frame = useCurrentFrame();
  const m = useMarca();
  if (!m?.logo || m.mosca === false) return null;
  let vis = 1;
  for (const it of plan.items) {
    if (it.escena.tipo !== 'portada' && it.escena.tipo !== 'cierre') continue;
    const s0 = it.from;
    const e0 = it.from + it.dur;
    const inside = Math.min(s0 === 0 ? 1 : interpolate(frame, [s0, s0 + 12], [0, 1], clamp), interpolate(frame, [e0 - 12, e0], [1, 0], clamp));
    vis = Math.min(vis, 1 - inside);
  }
  if (vis <= 0.01) return null;
  return (
    <div style={{ position: 'absolute', right: 34, bottom: 26, opacity: 0.7 * vis, display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 4, pointerEvents: 'none' }}>
      <BrandLogo width={110} />
      <span style={{ fontFamily: F.body, fontSize: 11, color: 'rgba(230,236,255,0.75)', letterSpacing: '0.04em' }}>{m.copyrightTxt}</span>
    </div>
  );
};
