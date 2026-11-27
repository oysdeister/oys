import React from 'react';
import { AbsoluteFill, interpolate, useCurrentFrame, useVideoConfig } from 'remotion';
import type { Capitulo as CapT } from '../types';
import { C, F, glow, hexA } from '../theme';
import { clamp, easeInOut, enterAt, lerp, useScene } from '../lib/scene';

export const Capitulo: React.FC<{ e: CapT; numero: number }> = ({ e, numero }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const { dur } = useScene();
  const num = String(e.numero ?? numero).padStart(2, '0');

  const sweep = lerp(frame, 0, 26, 0, 1, easeInOut); // barrido de la banda
  const numIn = enterAt(frame, 6, fps, { damping: 22, stiffness: 70 });
  const kick = enterAt(frame, 14, fps);
  const title = enterAt(frame, 18, fps, { damping: 20, stiffness: 100 });
  const sub = enterAt(frame, 28, fps);
  const rule = lerp(frame, 22, 50, 0, 1);
  const drift = interpolate(frame, [0, dur], [0, -40]);

  return (
    <AbsoluteFill>
      {/* banda de barrido */}
      <div
        style={{
          position: 'absolute',
          top: 0,
          bottom: 0,
          left: `${interpolate(sweep, [0, 1], [-40, 110])}%`,
          width: '40%',
          background: `linear-gradient(90deg, transparent, ${hexA(C.accent, 0.08)} 40%, ${hexA(C.accent, 0.22)} 50%, ${hexA(C.accent2, 0.08)} 60%, transparent)`,
          transform: 'skewX(-14deg)',
          opacity: interpolate(sweep, [0, 0.1, 0.85, 1], [0, 1, 1, 0]),
        }}
      />
      {/* número gigante en contorno */}
      <div
        style={{
          position: 'absolute',
          left: 70 + drift,
          top: 120,
          fontFamily: F.display,
          fontWeight: 700,
          fontSize: 640,
          lineHeight: 1,
          letterSpacing: '-0.06em',
          color: 'transparent',
          WebkitTextStroke: `2px ${hexA(C.accent, 0.5)}`,
          clipPath: `inset(0 ${100 - numIn * 100}% 0 0)`,
          opacity: 0.9,
          textShadow: `0 0 60px ${hexA(C.accent, 0.15)}`,
        }}
      >
        {num}
      </div>
      <div
        style={{
          position: 'absolute',
          left: 70 + drift * 0.5,
          top: 120,
          fontFamily: F.display,
          fontWeight: 700,
          fontSize: 640,
          lineHeight: 1,
          letterSpacing: '-0.06em',
          backgroundImage: `linear-gradient(180deg, ${hexA(C.accent2, 0.35)}, transparent 75%)`,
          WebkitBackgroundClip: 'text',
          backgroundClip: 'text',
          color: 'transparent',
          opacity: numIn * 0.6,
        }}
      >
        {num}
      </div>

      <div style={{ position: 'absolute', left: 860, top: 360, right: 120 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 16, opacity: kick, transform: `translateX(${(1 - kick) * -30}px)` }}>
          <div style={{ width: 12, height: 12, borderRadius: 3, background: C.accent, boxShadow: glow(C.accent, 0.6), transform: 'rotate(45deg)' }} />
          <span style={{ fontFamily: F.mono, fontSize: 22, letterSpacing: '0.3em', color: C.accent }}>{(e.etiqueta ?? 'Capítulo').toUpperCase()} {num}</span>
        </div>
        <div style={{ overflow: 'hidden', marginTop: 18, paddingBottom: 10 }}>
          <div
            style={{
              fontFamily: F.display,
              fontWeight: 600,
              fontSize: e.titulo.length > 26 ? 84 : 104,
              lineHeight: 1.02,
              letterSpacing: '-0.035em',
              color: C.text,
              transform: `translateY(${(1 - title) * 110}%)`,
            }}
          >
            {e.titulo}
          </div>
        </div>
        <div
          style={{
            height: 2,
            width: 720 * rule,
            marginTop: 22,
            background: `linear-gradient(90deg, ${C.accent}, ${hexA(C.accent2, 0.6)}, transparent)`,
            boxShadow: glow(C.accent, 0.35),
          }}
        />
        {e.subtitulo && (
          <div style={{ marginTop: 26, fontFamily: F.body, fontSize: 36, color: C.textSoft, opacity: sub, transform: `translateY(${(1 - sub) * 14}px)` }}>{e.subtitulo}</div>
        )}
      </div>
      {/* marco de esquinas */}
      {[
        { l: 60, t: 60, r: 0 },
        { r: 60, t: 60, rot: 90 },
        // (sin esquina inferior derecha: ahí va la mosca de la marca)
        { l: 60, b: 60, rot: 270 },
      ].map((p, i) => (
        <div
          key={i}
          style={{
            position: 'absolute',
            left: p.l,
            right: p.r || undefined,
            top: p.t,
            bottom: p.b,
            width: 34,
            height: 34,
            borderTop: `2px solid ${hexA(C.accent, 0.5)}`,
            borderLeft: `2px solid ${hexA(C.accent, 0.5)}`,
            transform: `rotate(${p.rot ?? 0}deg)`,
            opacity: interpolate(frame, [10 + i * 2, 24 + i * 2], [0, 1], clamp),
          }}
        />
      ))}
    </AbsoluteFill>
  );
};
