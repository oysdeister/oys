import React from 'react';
import { AbsoluteFill, interpolate, useCurrentFrame, useVideoConfig } from 'remotion';
import type { Calculo as CalculoT } from '../types';
import { C, F, glow, glass, hexA } from '../theme';
import { clamp, enterAt, useTiempos } from '../lib/scene';
import { Counter, SceneTitle, fmtNum } from '../components/ui';
import { Icon } from '../components/Icons';

/** Cálculo de precio con contadores: base → descuentos/recargos → resultado. */
export const Calculo: React.FC<{ e: CalculoT }> = ({ e }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const dec = e.decimales ?? 0;
  const div = e.divisa ?? '€';
  const t = useTiempos(e.pasos, { inicio: 2.2, paso: 2 });
  const tBase = Math.round(0.8 * fps);
  const tRes = (t.length ? t[t.length - 1] : tBase) + Math.round(1.2 * fps);

  // valores acumulados
  const vals: number[] = [e.base.valor];
  e.pasos.forEach((p, i) => {
    const prev = vals[i];
    vals.push(p.porcentaje !== undefined ? prev * (1 + p.porcentaje / 100) : prev + (p.importe ?? 0));
  });
  let cur = 0;
  t.forEach((f, i) => frame >= f && (cur = i + 1));
  const heroFrom = cur === 0 ? 0 : vals[cur - 1];
  const heroAt = cur === 0 ? tBase : t[cur - 1];
  const resP = enterAt(frame, tRes, fps, { damping: 9, stiffness: 140 });
  const card = enterAt(frame, 4, fps, { damping: 16 });
  const heroIn = enterAt(frame, tBase, fps, { damping: 12 });
  const bump = cur > 0 ? enterAt(frame, t[cur - 1], fps, { damping: 7, stiffness: 220 }) : 1;
  const delta = cur > 0 ? vals[cur] - vals[cur - 1] : 0;
  const deltaP = cur > 0 ? enterAt(frame, t[cur - 1] + 4, fps, { damping: 10, stiffness: 160 }) : 0;

  const linea = (label: string, value: number | null, at: number, chip: React.ReactNode, key: string, from?: number, strong = false) => {
    const p = enterAt(frame, at, fps, { damping: 11, stiffness: 150 });
    return (
      <div
        key={key}
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 18,
          padding: '20px 26px',
          borderRadius: 18,
          opacity: interpolate(p, [0, 0.3], [0, 1], clamp),
          transform: `translateX(${(1 - p) * -40}px) scale(${0.9 + 0.1 * p})`,
          background: strong ? `linear-gradient(90deg, ${hexA(C.accent, 0.16)}, ${hexA(C.accent2, 0.1)})` : 'transparent',
          border: strong ? `1px solid ${hexA(C.accent, 0.5)}` : '1px solid transparent',
          boxShadow: strong ? glow(C.accent, 0.35 * p) : 'none',
        }}
      >
        {chip}
        <span style={{ fontFamily: F.body, fontWeight: strong ? 700 : 500, fontSize: strong ? 32 : 29, color: strong ? '#fff' : C.textSoft, flex: 1 }}>{label}</span>
        {value !== null && (
          <Counter
            from={from ?? 0}
            to={value}
            at={at + 4}
            dur={26}
            dec={dec}
            suffix={` ${div}`}
            style={{ fontFamily: F.display, fontWeight: 700, fontSize: strong ? 40 : 32, color: strong ? '#fff' : C.text, letterSpacing: '-0.02em' }}
          />
        )}
      </div>
    );
  };

  return (
    <AbsoluteFill>
      <SceneTitle kicker={e.etiqueta ?? 'Cálculo del precio'} title={e.titulo} />

      {/* ticket */}
      <div
        style={{
          ...glass({ borderRadius: 32 }),
          position: 'absolute',
          left: 120,
          top: 270,
          width: 820,
          padding: '26px 22px',
          opacity: interpolate(card, [0, 0.3], [0, 1], clamp),
          transform: `translateY(${(1 - card) * 40}px)`,
        }}
      >
        {linea(e.base.etiqueta, e.base.valor, tBase, <Icon name="tarifa" size={30} color={C.accent} draw={interpolate(frame, [tBase, tBase + 24], [0, 1], clamp)} />, 'b')}
        {e.pasos.map((p, i) => {
          const neg = (p.porcentaje ?? p.importe ?? 0) < 0;
          const col = neg ? C.ok : C.warn;
          const txt = p.porcentaje !== undefined ? `${p.porcentaje > 0 ? '+' : '−'}${fmtNum(Math.abs(p.porcentaje), p.porcentaje % 1 ? 1 : 0)} %` : `${(p.importe ?? 0) > 0 ? '+' : '−'}${fmtNum(Math.abs(p.importe ?? 0), dec)}`;
          return linea(
            p.etiqueta,
            vals[i + 1] - vals[i],
            t[i],
            <span style={{ fontFamily: F.mono, fontWeight: 700, fontSize: 19, color: col, padding: '6px 12px', borderRadius: 10, background: hexA(col, 0.14), border: `1px solid ${hexA(col, 0.45)}`, minWidth: 92, textAlign: 'center' }}>
              {txt}
            </span>,
            `p${i}`,
          );
        })}
        <div style={{ height: 1, margin: '12px 20px', background: `linear-gradient(90deg, transparent, ${hexA('#9fb4ff', 0.3)}, transparent)`, opacity: resP }} />
        {linea(e.resultado ?? 'Precio neto', vals[vals.length - 1], tRes, <Icon name="check" size={30} color={C.ok} stroke={2.6} draw={interpolate(frame, [tRes, tRes + 18], [0, 1], clamp)} />, 'r', vals[0], true)}
      </div>

      {/* cifra protagonista */}
      <div style={{ position: 'absolute', left: 1000, top: 300, width: 800, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <div style={{ fontFamily: F.mono, fontSize: 18, letterSpacing: '0.28em', color: C.textMute, opacity: heroIn }}>
          {(cur === 0 ? e.base.etiqueta : frame >= tRes ? e.resultado ?? 'Precio neto' : e.pasos[cur - 1].etiqueta).toUpperCase()}
        </div>
        <div
          style={{
            marginTop: 18,
            transform: `scale(${(0.85 + 0.15 * heroIn) * (1 + (1 - bump) * 0.08)})`,
            opacity: heroIn,
            textShadow: `0 0 60px ${hexA(C.accent, 0.35)}`,
          }}
        >
          <Counter
            from={heroFrom}
            to={vals[cur]}
            at={heroAt}
            dur={30}
            dec={dec}
            style={{
              fontFamily: F.display,
              fontWeight: 700,
              fontSize: 170,
              letterSpacing: '-0.05em',
              backgroundImage: `linear-gradient(180deg, #FFFFFF 30%, ${C.accent} 130%)`,
              WebkitBackgroundClip: 'text',
              backgroundClip: 'text',
              color: 'transparent',
            }}
          />
          <span style={{ fontFamily: F.display, fontWeight: 600, fontSize: 80, color: hexA(C.accent, 0.9), marginLeft: 14 }}>{div}</span>
        </div>
        {/* delta */}
        <div style={{ height: 70, marginTop: 10 }}>
          {cur > 0 && (
            <div
              key={cur}
              style={{
                fontFamily: F.mono,
                fontWeight: 700,
                fontSize: 30,
                color: delta < 0 ? C.ok : C.warn,
                padding: '10px 22px',
                borderRadius: 14,
                background: hexA(delta < 0 ? C.ok : C.warn, 0.12),
                border: `1px solid ${hexA(delta < 0 ? C.ok : C.warn, 0.45)}`,
                transform: `translateY(${(1 - deltaP) * 20}px) scale(${deltaP})`,
                opacity: interpolate(frame, [t[cur - 1] + 70, t[cur - 1] + 90], [1, 0.45], clamp),
              }}
            >
              {delta < 0 ? '−' : '+'}
              {fmtNum(Math.abs(delta), dec)} {div}
            </div>
          )}
        </div>
        {/* barra de ahorro */}
        <div style={{ width: 620, marginTop: 34, opacity: heroIn }}>
          <div style={{ height: 14, borderRadius: 8, background: hexA('#9fb4ff', 0.12), overflow: 'hidden', position: 'relative' }}>
            <div
              style={{
                position: 'absolute',
                inset: 0,
                width: `${interpolate(frame, [heroAt, heroAt + 30], [(heroFrom || vals[0]) / Math.max(...vals), vals[cur] / Math.max(...vals)], clamp) * 100}%`,
                borderRadius: 8,
                background: `linear-gradient(90deg, ${C.accent2}, ${C.accent})`,
                boxShadow: glow(C.accent, 0.4),
              }}
            />
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 12, fontFamily: F.mono, fontSize: 16, color: C.textMute, letterSpacing: '0.1em' }}>
            <span>0</span>
            <span>
              {fmtNum(Math.max(...vals), dec)} {div}
            </span>
          </div>
        </div>
      </div>
    </AbsoluteFill>
  );
};
