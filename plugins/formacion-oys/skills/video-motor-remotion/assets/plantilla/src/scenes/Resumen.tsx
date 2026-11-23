import React from 'react';
import { AbsoluteFill, interpolate, useCurrentFrame, useVideoConfig } from 'remotion';
import type { Resumen as ResumenT } from '../types';
import { C, F, glow, glass, hexA } from '../theme';
import { clamp, ease, enterAt, lerp, useTiempos } from '../lib/scene';

export const Resumen: React.FC<{ e: ResumenT }> = ({ e }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const t = useTiempos(e.items, { inicio: 1.2, paso: 1.2 });
  const n = e.items.length;
  const done = t.filter((f) => frame >= f + 6).length;
  const prog = t.reduce((a, f) => a + lerp(frame, f, f + 14, 0, 1, ease), 0) / Math.max(1, n);
  const title = enterAt(frame, 4, fps, { damping: 20 });
  const card = enterAt(frame, 8, fps, { damping: 18, stiffness: 90 });
  const R = 120;
  const circ = 2 * Math.PI * R;
  const rowH = Math.min(112, 620 / n);
  const cardH = rowH * n + 68;
  const cardTop = Math.max(170, 520 - cardH / 2);

  return (
    <AbsoluteFill>
      {/* izquierda: título + anillo */}
      <div style={{ position: 'absolute', left: 140, top: Math.max(170, 520 - 250), width: 520 }}>
        <div style={{ fontFamily: F.mono, fontSize: 18, letterSpacing: '0.26em', color: C.accent, opacity: title }}>{(e.etiqueta ?? 'Resumen').toUpperCase()}</div>
        <div style={{ overflow: 'hidden', marginTop: 12, paddingBottom: 8 }}>
          <div style={{ fontFamily: F.display, fontWeight: 600, fontSize: 84, lineHeight: 1, letterSpacing: '-0.035em', color: C.text, transform: `translateY(${(1 - title) * 110}%)` }}>
            {e.titulo ?? 'En resumen'}
          </div>
        </div>
        <div style={{ position: 'relative', width: 300, height: 300, marginTop: 60, opacity: card, transform: `scale(${0.9 + 0.1 * card})` }}>
          <svg width={300} height={300} viewBox="0 0 300 300" style={{ transform: 'rotate(-90deg)' }}>
            <defs>
              <linearGradient id="rs-g" x1="0" y1="0" x2="1" y2="1">
                <stop offset="0" stopColor={C.accent} />
                <stop offset="1" stopColor={C.accent2} />
              </linearGradient>
            </defs>
            <circle cx={150} cy={150} r={R} stroke={hexA('#9fb4ff', 0.12)} strokeWidth={10} fill="none" />
            <circle
              cx={150}
              cy={150}
              r={R}
              stroke="url(#rs-g)"
              strokeWidth={10}
              fill="none"
              strokeLinecap="round"
              strokeDasharray={circ}
              strokeDashoffset={circ * (1 - prog)}
              style={{ filter: `drop-shadow(0 0 10px ${hexA(C.accent, 0.6)})` }}
            />
          </svg>
          <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
            <div style={{ fontFamily: F.display, fontWeight: 700, fontSize: 92, color: C.text, letterSpacing: '-0.04em', lineHeight: 1 }}>
              {done}
              <span style={{ color: C.textMute, fontSize: 56 }}>/{n}</span>
            </div>
            <div style={{ fontFamily: F.mono, fontSize: 15, letterSpacing: '0.2em', color: C.textMute, marginTop: 8 }}>COMPLETADO</div>
          </div>
        </div>
      </div>

      {/* derecha: checklist */}
      <div
        style={{
          ...glass({ borderRadius: 34 }),
          position: 'absolute',
          left: 760,
          top: cardTop,
          width: 1040,
          padding: '34px 40px',
          opacity: interpolate(card, [0, 0.3], [0, 1], clamp),
          transform: `translateX(${(1 - card) * 60}px)`,
        }}
      >
        {e.items.map((it, i) => {
          const p = enterAt(frame, t[i] - 4, fps, { damping: 18 });
          const ck = lerp(frame, t[i] + 2, t[i] + 14, 0, 1, ease);
          const pop = enterAt(frame, t[i], fps, { damping: 9, stiffness: 180 });
          const isLast = frame >= t[i] && (i === n - 1 || frame < t[i + 1]);
          return (
            <div
              key={i}
              style={{
                height: rowH,
                display: 'flex',
                alignItems: 'center',
                gap: 28,
                padding: '0 18px',
                borderRadius: 18,
                borderBottom: i < n - 1 ? `1px solid ${hexA('#9fb4ff', 0.08)}` : 'none',
                background: isLast ? `linear-gradient(90deg, ${hexA(C.ok, 0.1)}, transparent 70%)` : 'transparent',
              }}
            >
              <div
                style={{
                  width: 52,
                  height: 52,
                  borderRadius: '50%',
                  flexShrink: 0,
                  border: `2px solid ${ck > 0 ? C.ok : hexA('#9fb4ff', 0.3)}`,
                  background: ck > 0 ? hexA(C.ok, 0.18 + 0.6 * ck) : 'transparent',
                  boxShadow: ck > 0 ? glow(C.ok, 0.5 * ck) : 'none',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  transform: `scale(${ck > 0 ? 0.8 + 0.2 * pop : 1})`,
                }}
              >
                <svg width={28} height={28} viewBox="0 0 24 24" fill="none">
                  <path d="M5 12.5l4.5 4.5L19 7.5" stroke="#04140C" strokeWidth={3.2} strokeLinecap="round" strokeLinejoin="round" pathLength={1} strokeDasharray={1} strokeDashoffset={1 - ck} />
                </svg>
              </div>
              <span
                style={{
                  fontFamily: F.body,
                  fontWeight: 500,
                  fontSize: 34,
                  color: ck > 0 ? C.text : hexA('#C8D2F0', 0.4),
                  opacity: 0.35 + 0.65 * p,
                  transform: `translateX(${(1 - p) * 20}px)`,
                }}
              >
                {it.texto}
              </span>
            </div>
          );
        })}
      </div>
    </AbsoluteFill>
  );
};
