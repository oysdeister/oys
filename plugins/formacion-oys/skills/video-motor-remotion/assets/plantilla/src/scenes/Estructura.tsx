import React from 'react';
import { AbsoluteFill, interpolate, useCurrentFrame, useVideoConfig } from 'remotion';
import type { Estructura as EstructuraT, EstructuraNodo } from '../types';
import { C, F, glow, glass, hexA } from '../theme';
import { clamp, ease, enterAt, lerp, useTiempos } from '../lib/scene';
import { IconBadge, SceneTitle } from '../components/ui';

const ROOT = { w: 580, h: 120, y: 262 };
const BR = { h: 100, y: 468 };
const CH = { h: 62, gap: 12, y0: 602 };

export const Estructura: React.FC<{ e: EstructuraT }> = ({ e }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // orden de aparición: raíz, rama 1, sus hijos, rama 2, sus hijos…
  const flat: EstructuraNodo[] = [e.raiz];
  e.ramas.forEach((r) => {
    flat.push(r);
    (r.hijos ?? []).forEach((h) => flat.push(h));
  });
  const T = useTiempos(flat, { inicio: 0.8, paso: 0.6 });
  let k = 0;
  const tRoot = T[k++];
  const tR: number[] = [];
  const tH: number[][] = [];
  e.ramas.forEach((r) => {
    tR.push(T[k++]);
    tH.push((r.hijos ?? []).map(() => T[k++]));
  });

  const nb = e.ramas.length;
  const gap = nb > 2 ? 60 : 140;
  const bw = Math.min(640, (1680 - gap * (nb - 1)) / nb);
  const totalW = nb * bw + (nb - 1) * gap;
  const bx0 = (1920 - totalW) / 2;
  const rootX = (1920 - ROOT.w) / 2;
  const rootP = enterAt(frame, Math.min(tRoot, 10), fps, { damping: 16 });
  const rootOn = interpolate(frame, [tRoot, tRoot + 12], [0.35, 1], clamp);
  const busY = (ROOT.y + ROOT.h + BR.y) / 2;

  return (
    <AbsoluteFill>
      <SceneTitle kicker={e.etiqueta ?? 'Estructura'} title={e.titulo} />

      {/* conectores */}
      <svg width={1920} height={1080} style={{ position: 'absolute', inset: 0 }}>
        <defs>
          <filter id="es-glow" filterUnits="userSpaceOnUse" x="0" y="0" width="1920" height="1080">
            <feGaussianBlur stdDeviation="3" result="b" />
            <feMerge>
              <feMergeNode in="b" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>
        {e.ramas.map((r, i) => {
          const cx = bx0 + i * (bw + gap) + bw / 2;
          const d = `M960,${ROOT.y + ROOT.h} L960,${busY - 16} Q960,${busY} ${960 + Math.sign(cx - 960) * 16},${busY} L${cx - Math.sign(cx - 960) * 16},${busY} Q${cx},${busY} ${cx},${busY + 16} L${cx},${BR.y}`;
          const dd = Math.abs(cx - 960) < 1 ? `M960,${ROOT.y + ROOT.h} L960,${BR.y}` : d;
          const p = lerp(frame, tR[i] - 14, tR[i] + 2, 0, 1, ease);
          // raíl hacia los hijos
          const hijos = r.hijos ?? [];
          const railX = bx0 + i * (bw + gap) + 34;
          const lastY = CH.y0 + (hijos.length - 1) * (CH.h + CH.gap) + CH.h / 2;
          const lastT = tH[i].length ? tH[i][tH[i].length - 1] : tR[i];
          const railP = hijos.length ? lerp(frame, tR[i] + 4, Math.max(tR[i] + 12, lastT), 0, 1, ease) : 0;
          const railLen = lastY - (BR.y + BR.h);
          return (
            <g key={i}>
              <path d={dd} stroke={hexA('#9fb4ff', 0.18)} strokeWidth={2} fill="none" />
              <path d={dd} stroke={C.accent} strokeWidth={2.5} fill="none" pathLength={1} strokeDasharray={1} strokeDashoffset={1 - p} filter="url(#es-glow)" />
              {hijos.length > 0 && (
                <>
                  <line x1={railX} y1={BR.y + BR.h} x2={railX} y2={lastY} stroke={hexA('#9fb4ff', 0.14)} strokeWidth={2} />
                  <line x1={railX} y1={BR.y + BR.h} x2={railX} y2={BR.y + BR.h + railLen * railP} stroke={hexA(C.accent, 0.8)} strokeWidth={2} filter="url(#es-glow)" />
                </>
              )}
              {hijos.map((_, j) => {
                const y = CH.y0 + j * (CH.h + CH.gap) + CH.h / 2;
                const hp = lerp(frame, tH[i][j] - 6, tH[i][j] + 4, 0, 1, ease);
                return <line key={j} x1={railX} y1={y} x2={railX + 30 * hp} y2={y} stroke={C.accent} strokeWidth={2} opacity={hp} />;
              })}
            </g>
          );
        })}
      </svg>

      {/* raíz */}
      <div
        style={{
          ...glass({ borderRadius: 26 }),
          position: 'absolute',
          left: rootX,
          top: ROOT.y,
          width: ROOT.w,
          height: ROOT.h,
          display: 'flex',
          alignItems: 'center',
          gap: 24,
          padding: '0 30px',
          opacity: rootP,
          transform: `translateY(${(1 - rootP) * -30}px)`,
          border: `1px solid ${hexA(C.accent, 0.3 + 0.4 * rootOn)}`,
          boxShadow: `${glow(C.accent, 0.45 * rootOn)}, inset 0 1px 0 rgba(255,255,255,0.1)`,
        }}
      >
        <IconBadge name={e.raiz.icono ?? 'capas'} size={72} on={rootOn} />
        <div>
          <div style={{ fontFamily: F.display, fontWeight: 600, fontSize: 40, letterSpacing: '-0.02em', color: C.text }}>{e.raiz.titulo}</div>
          {e.raiz.subtitulo && <div style={{ fontFamily: F.body, fontSize: 22, color: C.textSoft, marginTop: 2 }}>{e.raiz.subtitulo}</div>}
        </div>
      </div>

      {/* ramas + hijos */}
      {e.ramas.map((r, i) => {
        const x = bx0 + i * (bw + gap);
        const p = enterAt(frame, tR[i], fps, { damping: 16 });
        const on = interpolate(frame, [tR[i], tR[i] + 10], [0, 1], clamp);
        return (
          <React.Fragment key={i}>
            <div
              style={{
                ...glass({ borderRadius: 22 }),
                position: 'absolute',
                left: x,
                top: BR.y,
                width: bw,
                height: BR.h,
                display: 'flex',
                alignItems: 'center',
                gap: 20,
                padding: '0 24px',
                opacity: interpolate(p, [0, 0.3], [0.0, 1], clamp),
                transform: `translateY(${(1 - p) * 30}px) scale(${0.96 + 0.04 * p})`,
                border: `1px solid ${hexA(C.accent2, 0.25 + 0.45 * on)}`,
                background: `linear-gradient(140deg, ${hexA(C.accent2, 0.22)}, rgba(14,20,38,0.7))`,
              }}
            >
              <IconBadge name={r.icono ?? 'capas'} size={58} on={on} color={C.accent2} color2={C.accent} />
              <div style={{ fontFamily: F.display, fontWeight: 600, fontSize: 36, color: C.text, letterSpacing: '-0.02em' }}>{r.titulo}</div>
              <div style={{ flex: 1 }} />
              <span style={{ fontFamily: F.mono, fontSize: 16, color: C.textMute, letterSpacing: '0.14em' }}>{(r.hijos ?? []).length} CAMPOS</span>
            </div>
            {(r.hijos ?? []).map((h, j) => {
              const y = CH.y0 + j * (CH.h + CH.gap);
              const hp = enterAt(frame, tH[i][j], fps, { damping: 16, stiffness: 140 });
              const lit = interpolate(frame, [tH[i][j], tH[i][j] + 8, tH[i][j] + 40], [0, 1, 0.25], clamp);
              return (
                <div
                  key={j}
                  style={{
                    position: 'absolute',
                    left: x + 72,
                    top: y,
                    width: bw - 72,
                    height: CH.h,
                    borderRadius: 14,
                    display: 'flex',
                    alignItems: 'center',
                    padding: '0 20px',
                    gap: 16,
                    background: `linear-gradient(90deg, ${hexA(C.accent, 0.06 + 0.12 * lit)}, rgba(16,22,40,0.55))`,
                    border: `1px solid ${hexA(C.accent, 0.12 + 0.5 * lit)}`,
                    boxShadow: lit > 0.5 ? glow(C.accent, 0.3 * lit) : 'none',
                    opacity: interpolate(hp, [0, 0.3], [0, 1], clamp),
                    transform: `translateX(${(1 - hp) * -30}px)`,
                  }}
                >
                  <div style={{ width: 8, height: 8, borderRadius: 2, transform: 'rotate(45deg)', background: C.accent, boxShadow: glow(C.accent, 0.4) }} />
                  <span style={{ fontFamily: F.body, fontWeight: 600, fontSize: 25, color: C.text }}>{h.titulo}</span>
                  <div style={{ flex: 1 }} />
                  {h.detalle && <span style={{ fontFamily: F.mono, fontSize: 18, color: hexA(C.accent, 0.9), letterSpacing: '0.04em' }}>{h.detalle}</span>}
                </div>
              );
            })}
          </React.Fragment>
        );
      })}
    </AbsoluteFill>
  );
};
