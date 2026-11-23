import React from 'react';
import { AbsoluteFill, interpolate, useCurrentFrame, useVideoConfig } from 'remotion';
import type { Flujo as FlujoT } from '../types';
import { C, F, glow, hexA } from '../theme';
import { clamp, ease, easeInOut, enterAt, lerp, useTiempos } from '../lib/scene';
import { Counter, IconBadge, SceneTitle } from '../components/ui';
import { Icon, Logo } from '../components/Icons';

const NW = 380; // tarjeta-documento
const NH = 440;
const CY = 590;
const VIAJE = 26; // fotogramas que tarda el paquete de datos

/** Diagrama de documentos: tarjetas 3D que llegan boca abajo apiladas, se voltean al nombrarlas
 *  y reciben un «paquete» de datos que viaja por la línea desde el documento anterior. */
export const Flujo: React.FC<{ e: FlujoT }> = ({ e }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const n = e.nodos.length;
  const act = useTiempos(e.nodos, { inicio: 1.4, paso: 1.6 });
  const t = frame / fps;

  const gap = Math.min(200, (1700 - n * NW) / Math.max(1, n - 1));
  const totalW = n * NW + (n - 1) * gap;
  const x0 = (1920 - totalW) / 2;
  const pos = e.nodos.map((_, i) => ({ x: x0 + i * (NW + gap), y: CY - NH / 2 }));
  const idx = (id: string) => e.nodos.findIndex((nd) => nd.id === id);
  const enlaces = e.enlaces ?? e.nodos.slice(1).map((nd, i) => ({ de: e.nodos[i].id, a: nd.id, texto: undefined as string | undefined }));

  let activo = -1;
  act.forEach((f, i) => frame >= f && (activo = i));

  return (
    <AbsoluteFill>
      <SceneTitle kicker={e.etiqueta ?? 'Circuito'} title={e.titulo} />

      {/* enlaces + paquetes */}
      <svg width={1920} height={1080} style={{ position: 'absolute', inset: 0, overflow: 'visible' }}>
        <defs>
          <filter id="fl-glow" filterUnits="userSpaceOnUse" x="0" y="0" width="1920" height="1080">
            <feGaussianBlur stdDeviation="4" result="b" />
            <feMerge>
              <feMergeNode in="b" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>
        {enlaces.map((l, k) => {
          const a = idx(l.de);
          const b = idx(l.a);
          if (a < 0 || b < 0) return null;
          const x1 = pos[a].x + NW + 18;
          const x2 = pos[b].x - 22;
          const y = CY;
          const start = act[b] - VIAJE;
          const draw = lerp(frame, start - 8, start + VIAJE * 0.7, 0, 1, ease);
          const appear = enterAt(frame, 10 + k * 4, fps);
          return (
            <g key={k} opacity={appear}>
              <defs>
                <linearGradient id={`fl-g-${k}`} gradientUnits="userSpaceOnUse" x1={x1} y1={y} x2={x2} y2={y}>
                  <stop offset="0" stopColor={C.accent2} />
                  <stop offset="1" stopColor={C.accent} />
                </linearGradient>
              </defs>
              <line x1={x1} y1={y} x2={x2} y2={y} stroke={hexA('#9fb4ff', 0.25)} strokeWidth={2} strokeDasharray="3 10" strokeLinecap="round" />
              <line x1={x1} y1={y} x2={x1 + (x2 - x1) * draw} y2={y} stroke={`url(#fl-g-${k})`} strokeWidth={4} strokeLinecap="round" filter="url(#fl-glow)" />
              <path
                d={`M${x2 - 14},${y - 10} L${x2},${y} L${x2 - 14},${y + 10}`}
                stroke={C.accent}
                strokeWidth={4}
                fill="none"
                strokeLinecap="round"
                strokeLinejoin="round"
                opacity={interpolate(draw, [0.9, 1], [0, 1], clamp)}
                filter="url(#fl-glow)"
              />
              {/* chispas continuas una vez conectado */}
              {draw >= 1 &&
                [0, 0.33, 0.66].map((o) => {
                  const tt = (((frame - start) / 45 + o) % 1 + 1) % 1;
                  return <circle key={o} cx={x1 + (x2 - x1) * tt} cy={y} r={3} fill="#fff" opacity={Math.sin(tt * Math.PI) * 0.8} filter="url(#fl-glow)" />;
                })}
              {l.texto && (
                <foreignObject x={(x1 + x2) / 2 - 120} y={y + 22} width={240} height={44}>
                  <div style={{ display: 'flex', justifyContent: 'center', opacity: interpolate(draw, [0.5, 1], [0, 1], clamp) }}>
                    <span
                      style={{
                        fontFamily: F.mono,
                        fontSize: 13,
                        letterSpacing: '0.14em',
                        textTransform: 'uppercase',
                        color: C.textSoft,
                        padding: '6px 12px',
                        borderRadius: 999,
                        background: 'rgba(10,14,26,0.8)',
                        border: `1px solid ${C.line}`,
                      }}
                    >
                      {l.texto}
                    </span>
                  </div>
                </foreignObject>
              )}
            </g>
          );
        })}
      </svg>

      {/* paquete de datos viajando */}
      {enlaces.map((l, k) => {
        const a = idx(l.de);
        const b = idx(l.a);
        if (a < 0 || b < 0) return null;
        const start = act[b] - VIAJE;
        if (frame < start || frame > act[b] + 4) return null;
        const p = interpolate(frame, [start, act[b]], [0, 1], { ...clamp, easing: easeInOut });
        const x1 = pos[a].x + NW - 10;
        const x2 = pos[b].x + 30;
        const x = x1 + (x2 - x1) * p;
        const y = CY - Math.sin(p * Math.PI) * 70;
        const land = interpolate(frame, [act[b] - 3, act[b] + 4], [1, 0], clamp);
        return (
          <div key={`pk-${k}`} style={{ position: 'absolute', left: x - 34, top: y - 34, width: 68, height: 68, opacity: land, transform: `scale(${0.7 + 0.5 * Math.sin(p * Math.PI)}) rotate(${p * 360}deg)` }}>
            {/* estela */}
            <div style={{ position: 'absolute', inset: -30, borderRadius: '50%', background: `radial-gradient(closest-side, ${hexA(C.accent, 0.5)}, transparent)` }} />
            <div
              style={{
                position: 'absolute',
                inset: 0,
                borderRadius: 18,
                background: `linear-gradient(140deg, ${C.accent}, ${C.accent2})`,
                boxShadow: glow(C.accent, 0.9),
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                border: '1.5px solid rgba(255,255,255,0.6)',
              }}
            >
              <Icon name="documento" size={34} color="#06101A" stroke={2.2} />
            </div>
          </div>
        );
      })}

      {/* tarjetas 3D */}
      <AbsoluteFill style={{ perspective: 1800, perspectiveOrigin: '50% 40%' }}>
        {e.nodos.map((nd, i) => {
          const appear = enterAt(frame, 4 + i * 6, fps, { damping: 14, stiffness: 90 });
          const flip = enterAt(frame, act[i], fps, { damping: 11, stiffness: 95 }); // 0 = boca abajo
          const isAct = i === activo;
          const lift = isAct ? enterAt(frame, act[i], fps, { damping: 10, stiffness: 120 }) : activo > i ? 0.25 : 0;
          const done = activo > i ? enterAt(frame, act[i + 1] ?? 0, fps, { damping: 8, stiffness: 180 }) : 0;
          const tilt = (i - (n - 1) / 2) * -7; // abanico
          const float = Math.sin(t * 1.1 + i * 1.3) * 6;
          const fan = flip; // la pila se abre al voltear
          const col = [C.accent, C.accent2, C.accent3, C.ok][i % 4];
          const backIcon = nd.icono ?? 'documento';
          return (
            <div
              key={nd.id}
              style={{
                position: 'absolute',
                left: pos[i].x,
                top: pos[i].y,
                width: NW,
                height: NH,
                transformStyle: 'preserve-3d',
                transform: `translate3d(0, ${(1 - appear) * -220 + float - lift * 18}px, ${(1 - appear) * 400 + lift * 70}px) rotateX(${6 + (1 - appear) * 40}deg) rotateY(${tilt * (1 - lift * 0.6)}deg)`,
                opacity: interpolate(appear, [0, 0.2], [0, 1], clamp),
              }}
            >
              {/* hojas apiladas detrás */}
              {[2, 1].map((s) => (
                <div
                  key={s}
                  style={{
                    position: 'absolute',
                    inset: 0,
                    borderRadius: 26,
                    background: `linear-gradient(160deg, ${hexA(col, 0.18)}, rgba(14,18,34,0.92))`,
                    border: `1px solid ${hexA(col, 0.25)}`,
                    transform: `translate3d(${s * (8 + fan * 10)}px, ${s * (8 - fan * 2)}px, ${-s * 16}px) rotateZ(${s * (1.5 + fan * 3.5) * (i % 2 ? -1 : 1)}deg)`,
                    boxShadow: '0 20px 40px rgba(0,0,0,0.4)',
                  }}
                />
              ))}
              {/* tarjeta que se voltea */}
              <div style={{ position: 'absolute', inset: 0, transformStyle: 'preserve-3d', transform: `rotateY(${(1 - flip) * 180}deg)` }}>
                {/* dorso */}
                <div
                  style={{
                    position: 'absolute',
                    inset: 0,
                    borderRadius: 26,
                    backfaceVisibility: 'hidden',
                    WebkitBackfaceVisibility: 'hidden',
                    transform: 'rotateY(180deg)',
                    background: `radial-gradient(circle at 30% 20%, ${hexA(col, 0.4)}, transparent 55%), linear-gradient(160deg, #1B2340, #0C1122)`,
                    border: `1.5px solid ${hexA(col, 0.45)}`,
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: 26,
                    overflow: 'hidden',
                    boxShadow: '0 40px 80px rgba(0,0,0,0.5)',
                  }}
                >
                  <div
                    style={{
                      position: 'absolute',
                      inset: 0,
                      backgroundImage: `repeating-linear-gradient(45deg, ${hexA('#9fb4ff', 0.06)} 0 2px, transparent 2px 22px)`,
                    }}
                  />
                  <Logo size={92} />
                  <div style={{ opacity: 0.6 }}>
                    <Icon name={backIcon} size={44} color={col} />
                  </div>
                  <span style={{ fontFamily: F.mono, fontSize: 16, letterSpacing: '0.3em', color: C.textMute }}>{String(i + 1).padStart(2, '0')}</span>
                </div>
                {/* cara */}
                <div
                  style={{
                    position: 'absolute',
                    inset: 0,
                    borderRadius: 26,
                    backfaceVisibility: 'hidden',
                    WebkitBackfaceVisibility: 'hidden',
                    background: `linear-gradient(165deg, ${hexA(col, 0.2)} 0%, transparent 42%), linear-gradient(180deg, #131B31, #0B1020)`,
                    border: `1.5px solid ${isAct ? hexA(col, 0.85) : hexA('#9fb4ff', 0.2)}`,
                    boxShadow: isAct ? `0 40px 90px rgba(0,0,0,0.55), ${glow(col, 0.7)}` : '0 30px 70px rgba(0,0,0,0.5)',
                    padding: '30px 30px 26px',
                    display: 'flex',
                    flexDirection: 'column',
                    overflow: 'hidden',
                  }}
                >
                  {/* brillo especular según giro */}
                  <div
                    style={{
                      position: 'absolute',
                      inset: 0,
                      background: `linear-gradient(${110 + tilt * 3}deg, transparent 30%, rgba(255,255,255,${0.1 * flip}) 48%, transparent 62%)`,
                      transform: `translateX(${(1 - flip) * -60 + 30}%)`,
                    }}
                  />
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <IconBadge name={nd.icono} size={84} on={interpolate(frame, [act[i], act[i] + 12], [0.3, 1], clamp)} color={col} draw={interpolate(frame, [act[i] + 2, act[i] + 30], [0, 1], clamp)} />
                    <span style={{ fontFamily: F.mono, fontSize: 16, letterSpacing: '0.12em', color: hexA(col, 0.95), padding: '6px 10px', border: `1px solid ${hexA(col, 0.4)}`, borderRadius: 8 }}>
                      {nd.codigo ?? `DOC-${String(i + 1).padStart(3, '0')}`}
                    </span>
                  </div>
                  <div style={{ marginTop: 30, fontFamily: F.display, fontWeight: 700, fontSize: 54, letterSpacing: '-0.03em', color: C.text, lineHeight: 1 }}>{nd.titulo}</div>
                  {nd.subtitulo && <div style={{ fontFamily: F.body, fontSize: 25, color: C.textSoft, marginTop: 10 }}>{nd.subtitulo}</div>}
                  {/* líneas de documento */}
                  <div style={{ marginTop: 26, display: 'flex', flexDirection: 'column', gap: 12 }}>
                    {[0.9, 0.7, 0.8].map((w, j) => (
                      <div
                        key={j}
                        style={{
                          height: 9,
                          borderRadius: 5,
                          width: `${w * 100 * lerp(frame, act[i] + 8 + j * 4, act[i] + 22 + j * 4, 0, 1)}%`,
                          background: j === 0 ? hexA(col, 0.4) : hexA('#9fb4ff', 0.16),
                        }}
                      />
                    ))}
                  </div>
                  <div style={{ flex: 1 }} />
                  {nd.importe !== undefined && (
                    <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', borderTop: `1px solid ${hexA('#9fb4ff', 0.14)}`, paddingTop: 16 }}>
                      <span style={{ fontFamily: F.mono, fontSize: 15, letterSpacing: '0.2em', color: C.textMute }}>IMPORTE</span>
                      <Counter
                        to={nd.importe}
                        at={act[i] + 6}
                        dur={30}
                        suffix={` ${nd.divisa ?? '€'}`}
                        style={{ fontFamily: F.display, fontWeight: 700, fontSize: 38, color: C.text, letterSpacing: '-0.02em' }}
                      />
                    </div>
                  )}
                </div>
              </div>
              {/* sello de hecho */}
              {done > 0 && (
                <div
                  style={{
                    position: 'absolute',
                    right: -14,
                    top: -14,
                    width: 52,
                    height: 52,
                    borderRadius: '50%',
                    background: C.ok,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    boxShadow: glow(C.ok, 0.6),
                    transform: `translateZ(30px) scale(${done})`,
                  }}
                >
                  <Icon name="check" size={28} color="#04140C" stroke={3.2} draw={Math.min(1, done * 1.3)} />
                </div>
              )}
            </div>
          );
        })}
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
