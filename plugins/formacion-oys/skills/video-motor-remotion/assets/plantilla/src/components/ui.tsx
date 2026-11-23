import React from 'react';
import { interpolate, useCurrentFrame, useVideoConfig } from 'remotion';
import { C, F, glow, hexA } from '../theme';
import { clamp, enterAt } from '../lib/scene';
import { Icon } from './Icons';

/** Antetítulo + título de escena con revelado por máscara. */
export const SceneTitle: React.FC<{ kicker?: string; title?: string; sub?: string; at?: number; x?: number; y?: number; align?: 'left' | 'center'; size?: number }> = ({
  kicker,
  title,
  sub,
  at = 2,
  x = 120,
  y = 118,
  align = 'left',
  size = 60,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const k = enterAt(frame, at, fps, { damping: 20 });
  const t = enterAt(frame, at + 5, fps, { damping: 22, stiffness: 110 });
  const s = enterAt(frame, at + 12, fps, { damping: 22 });
  const line = interpolate(frame - at, [0, 22], [0, 1], { ...clamp });
  return (
    <div
      style={{
        position: 'absolute',
        left: align === 'center' ? 0 : x,
        right: align === 'center' ? 0 : undefined,
        top: y,
        textAlign: align,
        display: 'flex',
        flexDirection: 'column',
        alignItems: align === 'center' ? 'center' : 'flex-start',
      }}
    >
      {kicker && (
        <div style={{ display: 'flex', alignItems: 'center', gap: 14, opacity: k, transform: `translateY(${(1 - k) * 14}px)` }}>
          <div style={{ width: 36 * line, height: 2, background: `linear-gradient(90deg, ${C.accent}, ${C.accent2})`, boxShadow: glow(C.accent, 0.4) }} />
          <span style={{ fontFamily: F.mono, fontSize: 18, letterSpacing: '0.24em', color: C.accent, textTransform: 'uppercase', fontWeight: 500 }}>{kicker}</span>
        </div>
      )}
      {title && (
        <div style={{ overflow: 'hidden', paddingBottom: 8, marginTop: kicker ? 10 : 0 }}>
          <div
            style={{
              fontFamily: F.display,
              fontWeight: 600,
              fontSize: size,
              letterSpacing: '-0.025em',
              lineHeight: 1.05,
              color: C.text,
              transform: `translateY(${(1 - t) * 105}%)`,
              opacity: interpolate(t, [0, 0.4], [0, 1], clamp),
            }}
          >
            {title}
          </div>
        </div>
      )}
      {sub && (
        <div style={{ fontFamily: F.body, fontSize: 26, color: C.textSoft, marginTop: 6, opacity: s, transform: `translateY(${(1 - s) * 12}px)` }}>{sub}</div>
      )}
    </div>
  );
};

/** Insignia de icono con gradiente y brillo. «on» 0→1 enciende. */
export const IconBadge: React.FC<{ name?: string; size?: number; on?: number; color?: string; color2?: string; round?: boolean; iconScale?: number; draw?: number }> = ({
  name,
  draw,
  size = 96,
  on = 1,
  color = C.accent,
  color2 = C.accent2,
  round = false,
  iconScale = 0.46,
}) => (
  <div
    style={{
      width: size,
      height: size,
      borderRadius: round ? '50%' : size * 0.28,
      position: 'relative',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: `linear-gradient(140deg, ${hexA(color, 0.12 + 0.28 * on)} 0%, ${hexA(color2, 0.1 + 0.3 * on)} 100%)`,
      border: `1px solid ${hexA(color, 0.25 + 0.5 * on)}`,
      boxShadow: `inset 0 1px 0 rgba(255,255,255,${0.08 + 0.12 * on}), ${on > 0.05 ? glow(color, 0.55 * on) : 'none'}`,
      flexShrink: 0,
    }}
  >
    <Icon name={name} size={size * iconScale} color={on > 0.5 ? '#FFFFFF' : hexA('#DDE6FF', 0.75)} stroke={1.6} draw={draw} />
  </div>
);

/** Píldora de texto pequeño (mono). */
export const Chip: React.FC<{ children: React.ReactNode; color?: string; style?: React.CSSProperties }> = ({ children, color = C.accent, style }) => (
  <span
    style={{
      fontFamily: F.mono,
      fontSize: 17,
      letterSpacing: '0.08em',
      color,
      padding: '6px 12px',
      borderRadius: 999,
      border: `1px solid ${hexA(color, 0.35)}`,
      background: hexA(color, 0.08),
      whiteSpace: 'nowrap',
      ...style,
    }}
  >
    {children}
  </span>
);

/** Formato numérico español: 35.000 · 31.500,50 */
export const fmtNum = (v: number, dec = 0) =>
  v.toLocaleString('es-ES', { minimumFractionDigits: dec, maximumFractionDigits: dec, useGrouping: 'always' } as unknown as Intl.NumberFormatOptions);

/** Contador animado entre «from» y «to» desde el fotograma «at». */
export const Counter: React.FC<{ from?: number; to: number; at: number; dur?: number; dec?: number; prefix?: string; suffix?: string; style?: React.CSSProperties }> = ({
  from = 0,
  to,
  at,
  dur = 24,
  dec = 0,
  prefix = '',
  suffix = '',
  style,
}) => {
  const frame = useCurrentFrame();
  const p = interpolate(frame, [at, at + dur], [0, 1], { ...clamp, easing: (t) => 1 - Math.pow(1 - t, 3) });
  const v = from + (to - from) * p;
  return (
    <span style={{ fontVariantNumeric: 'tabular-nums', ...style }}>
      {prefix}
      {fmtNum(v, dec)}
      {suffix}
    </span>
  );
};
