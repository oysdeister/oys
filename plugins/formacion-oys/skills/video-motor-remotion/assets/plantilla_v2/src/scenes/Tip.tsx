import React from 'react';
import { AbsoluteFill, interpolate, useCurrentFrame, useVideoConfig } from 'remotion';
import type { Tip as TipT } from '../types';
import { C, F, glow, glass, hexA } from '../theme';
import { clamp, enterAt } from '../lib/scene';
import { Icon } from '../components/Icons';

export const Tip: React.FC<{ e: TipT }> = ({ e }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const cuidado = e.tipo === 'cuidado';
  const col = cuidado ? C.danger : C.warn;
  const col2 = cuidado ? '#FF8A5C' : '#FFE08A';
  const etiqueta = e.etiqueta ?? (cuidado ? 'Cuidado' : 'Consejo');
  const card = enterAt(frame, 2, fps, { damping: 18, stiffness: 90 });
  const icon = enterAt(frame, 10, fps, { damping: 10, stiffness: 120 });
  const lab = enterAt(frame, 16, fps);
  const title = enterAt(frame, 20, fps, { damping: 20 });
  const words = e.texto.split(' ');

  return (
    <AbsoluteFill style={{ alignItems: 'center', justifyContent: 'center' }}>
      {/* luz ambiente */}
      <div style={{ position: 'absolute', width: 1400, height: 900, borderRadius: '50%', background: `radial-gradient(closest-side, ${hexA(col, 0.16 * card)}, transparent)`, top: 60 }} />
      <div
        style={{
          ...glass({ borderRadius: 40 }),
          position: 'relative',
          width: 1360,
          minHeight: 440,
          marginTop: -60,
          padding: '70px 80px 70px 70px',
          display: 'flex',
          gap: 70,
          alignItems: 'center',
          overflow: 'hidden',
          border: `1px solid ${hexA(col, 0.35)}`,
          boxShadow: `0 40px 100px rgba(0,0,0,0.5), ${glow(col, 0.3)}, inset 0 1px 0 rgba(255,255,255,0.1)`,
          opacity: interpolate(card, [0, 0.3], [0, 1], clamp),
          transform: `translateY(${(1 - card) * 60}px) scale(${0.94 + 0.06 * card})`,
        }}
      >
        {/* franja superior */}
        <div
          style={{
            position: 'absolute',
            left: 0,
            right: 0,
            top: 0,
            height: 6,
            background: cuidado
              ? `repeating-linear-gradient(135deg, ${col} 0 18px, transparent 18px 36px)`
              : `linear-gradient(90deg, transparent, ${col}, ${col2}, transparent)`,
            opacity: 0.85,
          }}
        />
        {/* icono */}
        <div style={{ position: 'relative', width: 220, height: 220, flexShrink: 0, transform: `scale(${icon})` }}>
          {[0, 1, 2].map((i) => {
            const ph = ((frame + i * 20) % 60) / 60;
            return (
              <div
                key={i}
                style={{
                  position: 'absolute',
                  inset: -ph * 50,
                  borderRadius: '50%',
                  border: `2px solid ${hexA(col, 0.5 * (1 - ph))}`,
                }}
              />
            );
          })}
          <div
            style={{
              position: 'absolute',
              inset: 0,
              borderRadius: '50%',
              background: `radial-gradient(circle at 35% 30%, ${hexA(col2, 0.55)}, ${hexA(col, 0.3)} 55%, ${hexA(col, 0.12)} 100%)`,
              border: `1.5px solid ${hexA(col, 0.7)}`,
              boxShadow: glow(col, 0.9),
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <Icon name={cuidado ? 'alerta' : 'bombilla'} size={110} color="#fff" stroke={1.5} draw={interpolate(frame, [10, 40], [0, 1], clamp)} />
          </div>
        </div>
        <div style={{ flex: 1 }}>
          <div style={{ fontFamily: F.mono, fontSize: 16, letterSpacing: '0.3em', textTransform: 'uppercase', color: col, opacity: lab, transform: `translateY(${(1 - lab) * 10}px)` }}>
            {etiqueta}
          </div>
          {e.titulo && (
            <div style={{ overflow: 'hidden', marginTop: 14, paddingBottom: 6 }}>
              <div style={{ fontFamily: F.display, fontWeight: 600, fontSize: 48, lineHeight: 1.06, letterSpacing: '-0.025em', color: C.text, transform: `translateY(${(1 - title) * 110}%)` }}>
                {e.titulo}
              </div>
            </div>
          )}
          <div style={{ marginTop: 24, fontFamily: F.body, fontSize: 28, lineHeight: 1.45, color: C.textSoft }}>
            {words.map((w, i) => {
              const p = interpolate(frame, [28 + i * 1.2, 40 + i * 1.2], [0, 1], clamp);
              return (
                <span key={i} style={{ opacity: 0.15 + 0.85 * p, display: 'inline-block', transform: `translateY(${(1 - p) * 8}px)`, marginRight: '0.26em' }}>
                  {w}
                </span>
              );
            })}
          </div>
        </div>
      </div>
    </AbsoluteFill>
  );
};
