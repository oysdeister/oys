import React, { useMemo } from 'react';
import { AbsoluteFill, random, useCurrentFrame } from 'remotion';
import { C, hexA } from '../theme';

/** Fondo persistente: gradientes vivos, suelo en perspectiva, partículas, grano y viñeta. */
export const Background: React.FC<{ dim?: number }> = ({ dim = 0 }) => {
  const f = useCurrentFrame();
  const t = f / 30;

  const particles = useMemo(
    () =>
      new Array(70).fill(0).map((_, i) => ({
        x: random(`px${i}`) * 1920,
        y: random(`py${i}`) * 1080,
        r: 0.6 + random(`pr${i}`) * 1.8,
        sp: 4 + random(`ps${i}`) * 14,
        ph: random(`pp${i}`) * Math.PI * 2,
        hue: random(`ph${i}`),
      })),
    [],
  );

  const blob = (cx: number, cy: number, r: number, color: string, a: number) =>
    `radial-gradient(${r}px circle at ${cx}px ${cy}px, ${hexA(color, a)} 0%, ${hexA(color, a * 0.35)} 40%, transparent 70%)`;

  const b1x = 420 + Math.sin(t * 0.13) * 160;
  const b1y = 260 + Math.cos(t * 0.11) * 90;
  const b2x = 1560 + Math.cos(t * 0.09) * 180;
  const b2y = 760 + Math.sin(t * 0.12) * 110;
  const b3x = 1100 + Math.sin(t * 0.07 + 1) * 260;
  const b3y = 120 + Math.cos(t * 0.1) * 60;

  return (
    <AbsoluteFill style={{ background: C.ink, overflow: 'hidden' }}>
      <AbsoluteFill
        style={{
          background: [
            blob(b1x, b1y, 900, C.accent2, 0.26),
            blob(b2x, b2y, 1000, C.accent, 0.13),
            blob(b3x, b3y, 700, C.accent3, 0.07),
            `linear-gradient(180deg, ${C.ink} 0%, ${C.ink2} 55%, #070A14 100%)`,
          ].join(','),
        }}
      />
      {/* horizonte luminoso */}
      <div
        style={{
          position: 'absolute',
          left: 0,
          right: 0,
          top: 640,
          height: 2,
          background: `linear-gradient(90deg, transparent, ${hexA(C.accent, 0.35)} 30%, ${hexA(C.accent2, 0.45)} 70%, transparent)`,
          filter: 'blur(1px)',
          opacity: 0.55,
        }}
      />
      {/* suelo en perspectiva */}
      <div style={{ position: 'absolute', left: -960, right: -960, top: 640, height: 900, perspective: 700, perspectiveOrigin: '50% 0%' }}>
        <div
          style={{
            position: 'absolute',
            inset: 0,
            transformOrigin: '50% 0%',
            transform: 'rotateX(72deg)',
            backgroundImage: `linear-gradient(${hexA(C.accent, 0.22)} 1.5px, transparent 1.5px), linear-gradient(90deg, ${hexA(C.accent, 0.16)} 1.5px, transparent 1.5px)`,
            backgroundSize: '90px 90px',
            backgroundPosition: `0px ${(f * 0.9) % 90}px`,
            maskImage: 'linear-gradient(180deg, transparent 0%, black 18%, black 55%, transparent 100%)',
            WebkitMaskImage: 'linear-gradient(180deg, transparent 0%, black 14%, black 50%, transparent 95%)',
            height: 2600,
          }}
        />
      </div>
      {/* rejilla de puntos muy sutil arriba */}
      <AbsoluteFill
        style={{
          backgroundImage: `radial-gradient(${hexA('#9fb4ff', 0.09)} 1px, transparent 1.4px)`,
          backgroundSize: '36px 36px',
          maskImage: 'radial-gradient(1100px 600px at 50% 30%, black 0%, transparent 75%)',
          WebkitMaskImage: 'radial-gradient(1100px 600px at 50% 30%, black 0%, transparent 75%)',
        }}
      />
      {/* partículas */}
      <AbsoluteFill>
        <svg width={1920} height={1080}>
          {particles.map((p, i) => {
            const y = ((p.y - t * p.sp) % 1080 + 1080) % 1080;
            const x = p.x + Math.sin(t * 0.4 + p.ph) * 14;
            const tw = 0.35 + 0.65 * (0.5 + 0.5 * Math.sin(t * 1.3 + p.ph));
            const col = p.hue < 0.6 ? C.accent : p.hue < 0.9 ? '#B9C6FF' : C.accent3;
            return <circle key={i} cx={x} cy={y} r={p.r} fill={col} opacity={0.5 * tw} />;
          })}
        </svg>
      </AbsoluteFill>
      {dim > 0 && <AbsoluteFill style={{ background: `rgba(3,5,10,${dim})` }} />}
    </AbsoluteFill>
  );
};

/** Viñeta + grano por encima de todo. */
export const Finish: React.FC = () => {
  const f = useCurrentFrame();
  return (
    <AbsoluteFill style={{ pointerEvents: 'none' }}>
      <AbsoluteFill style={{ background: 'radial-gradient(140% 100% at 50% 45%, transparent 55%, rgba(0,0,0,0.55) 100%)' }} />
      <AbsoluteFill style={{ opacity: 0.06, mixBlendMode: 'overlay' }}>
        <svg width="1920" height="1080">
          <filter id="grain">
            <feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="2" seed={f % 8} stitchTiles="stitch" />
            <feColorMatrix type="saturate" values="0" />
          </filter>
          <rect width="1920" height="1080" filter="url(#grain)" />
        </svg>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
