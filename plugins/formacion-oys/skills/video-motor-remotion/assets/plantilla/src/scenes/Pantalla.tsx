import React from 'react';
import { AbsoluteFill, Freeze, interpolate, OffthreadVideo, Sequence, staticFile, useCurrentFrame, useVideoConfig } from 'remotion';
import type { Pantalla as PantallaT, Rect } from '../types';
import { C, F, glow, glass, hexA } from '../theme';
import { clamp, ease, easeInOut, enterAt, useScene, useTiempos } from '../lib/scene';
import { Icon } from '../components/Icons';

/** Panel flotante en 3D. Coordenadas: «panel» = píxeles del panel a escala 1 (contenido bajo la barra). */
const PW = 1180; // ancho del contenido a escala 1
const CHROME = 46;
const BASE_ANCHOR = { x: 1190, y: 520 };
const ZOOM_ANCHOR = { x: 1170, y: 500 };
const ZOOM_AREA = { w: 1040, h: 600 };

type Cam = { cx: number; cy: number; z: number; rx: number; ry: number; ax: number; ay: number };

const mixCam = (a: Cam, b: Cam, p: number): Cam => ({
  cx: a.cx + (b.cx - a.cx) * p,
  cy: a.cy + (b.cy - a.cy) * p,
  z: Math.exp(Math.log(a.z) + (Math.log(b.z) - Math.log(a.z)) * p),
  rx: a.rx + (b.rx - a.rx) * p,
  ry: a.ry + (b.ry - a.ry) * p,
  ax: a.ax + (b.ax - a.ax) * p,
  ay: a.ay + (b.ay - a.ay) * p,
});

/** Vídeo del clip con congelado antes/después. */
const Clip: React.FC<{ src: string; desde: number; len: number; rate: number; w: number; h: number; style?: React.CSSProperties }> = ({ src, desde, len, rate, w, h, style }) => {
  const frame = useCurrentFrame();
  const vf = frame - desde;
  const frozen = vf < 0 || vf >= len - 1;
  const at = vf < 0 ? desde : desde + len - 2;
  return (
    <Freeze frame={at} active={frozen}>
      <Sequence from={desde} layout="none">
        <OffthreadVideo src={src} muted playbackRate={rate} style={{ width: w, height: h, display: 'block', ...style }} />
      </Sequence>
    </Freeze>
  );
};

export const Pantalla: React.FC<{ e: PantallaT }> = ({ e }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const { dur } = useScene();
  const src = e.tamano ?? { w: 1680, h: 1048 };
  const base: Rect = e.recorte ?? { x: 0, y: 0, w: src.w, h: src.h };
  const k = PW / base.w; // px de vídeo → px de panel
  const PH = Math.round(base.h * k);
  const zooms = e.zooms ?? [];
  const callouts = e.callouts ?? [];
  const foco = e.foco ?? [];
  const tz = useTiempos(zooms, { inicio: 1, paso: 2.5 });
  const tc = useTiempos(callouts, { inicio: 2, paso: 1.8 });
  const tf = useTiempos(foco, { inicio: 1.5, paso: 1 });
  const t = frame / fps;

  // vídeo (coords originales) → panel
  const P = (r: Rect) => ({ x: (r.x - base.x) * k, y: (r.y - base.y) * k + CHROME, w: r.w * k, h: r.h * k });

  // ---------- cámara ----------
  const restCam: Cam = { cx: PW / 2, cy: (PH + CHROME) / 2, z: 1, rx: 5, ry: -10, ax: BASE_ANCHOR.x, ay: BASE_ANCHOR.y };
  const startCam: Cam = { ...restCam, z: 0.55, rx: 16, ry: -42, ax: 1500, ay: 600 };
  const intro = enterAt(frame, 0, fps, { damping: 22, stiffness: 55 });
  let cam = mixCam(startCam, restCam, intro);
  let zoomP = 0; // cuánto «enfocado» estamos (para la profundidad de campo)
  let focus: { x: number; y: number; w: number; h: number } | null = null;
  zooms.forEach((z, i) => {
    const d = Math.round((z.dur ?? 1.4) * fps);
    const p = interpolate(frame, [tz[i], tz[i] + d], [0, 1], { ...clamp, easing: easeInOut });
    if (p <= 0) return;
    let target: Cam;
    if (!z.rect) {
      target = restCam;
    } else {
      const r = P(z.rect);
      const zz = Math.min(ZOOM_AREA.w / r.w, ZOOM_AREA.h / r.h, 3.2);
      const dir = i % 2 === 0 ? -1 : 1;
      target = { cx: r.x + r.w / 2, cy: r.y + r.h / 2, z: zz, rx: z.giro?.x ?? 7, ry: z.giro?.y ?? 13 * dir, ax: ZOOM_ANCHOR.x, ay: ZOOM_ANCHOR.y };
    }
    cam = mixCam(cam, target, p);
    if (z.rect) {
      focus = P(z.rect);
      zoomP = zoomP + (1 - zoomP) * p;
    } else zoomP = zoomP * (1 - p);
  });
  // flotación suave
  const fx = Math.sin(t * 0.7) * 1.2;
  const fy = Math.sin(t * 0.5 + 1) * 6;
  const worldT = `translate3d(${cam.ax}px, ${cam.ay + fy}px, 0) rotateX(${cam.rx}deg) rotateY(${cam.ry + fx}deg) scale(${cam.z}) translate(${-cam.cx}px, ${-cam.cy}px)`;
  const inv = 1 / cam.z;

  // ---------- vídeo ----------
  const clipDesde = Math.round((e.clipDesde ?? 0.3) * fps);
  const rate = e.velocidad ?? 1;
  const clipLen = e.clip ? Math.round(((e.clip.fin - e.clip.inicio) * fps) / rate) : dur;
  const vsrc = staticFile(e.video ?? `clips/${e.id}.mp4`);
  const vidStyle: React.CSSProperties = { position: 'absolute', left: -base.x * k, top: -base.y * k, width: src.w * k, height: src.h * k };

  const calloutEnd = (i: number) => (callouts[i].hasta !== undefined ? Math.round(callouts[i].hasta! * fps) : (tc[i + 1] ?? dur + 10));
  const f0 = focus as { x: number; y: number; w: number; h: number } | null;
  const dof = zoomP > 0.02 && f0;

  return (
    <AbsoluteFill>
      {/* escenario 3D */}
      <AbsoluteFill style={{ perspective: 2200, perspectiveOrigin: '55% 45%', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', left: 0, top: 0, width: 0, height: 0, transformStyle: 'preserve-3d', transformOrigin: '0 0', transform: worldT }}>
          {/* paneles fantasma al fondo */}
          {[
            { x: -560, y: 60, w: 520, h: 360, z: -700, o: 0.5 },
            { x: PW + 80, y: -80, w: 460, h: 300, z: -900, o: 0.4 },
            { x: PW - 260, y: PH - 40, w: 560, h: 260, z: -500, o: 0.35 },
          ].map((g, i) => (
            <div
              key={i}
              style={{
                position: 'absolute',
                left: g.x,
                top: g.y + Math.sin(t * 0.6 + i) * 10,
                width: g.w,
                height: g.h,
                transform: `translateZ(${g.z}px)`,
                borderRadius: 20,
                background: 'linear-gradient(160deg, rgba(60,80,140,0.35), rgba(16,22,40,0.4))',
                border: `1px solid ${hexA('#9fb4ff', 0.18)}`,
                opacity: g.o * intro,
                filter: 'blur(2px)',
                padding: 26,
              }}
            >
              <div style={{ height: 14, width: '40%', borderRadius: 7, background: hexA(C.accent, 0.35) }} />
              {[0, 1, 2, 3].map((j) => (
                <div key={j} style={{ height: 10, width: `${80 - j * 14}%`, borderRadius: 5, background: hexA('#9fb4ff', 0.18), marginTop: 18 }} />
              ))}
            </div>
          ))}
          {/* halo detrás del panel */}
          <div
            style={{
              position: 'absolute',
              left: -200,
              top: -150,
              width: PW + 400,
              height: PH + CHROME + 300,
              transform: 'translateZ(-120px)',
              background: `radial-gradient(closest-side, ${hexA(C.accent2, 0.35)}, ${hexA(C.accent, 0.08)} 60%, transparent)`,
              opacity: intro,
            }}
          />

          {/* panel */}
          <div style={{ position: 'absolute', left: 0, top: 0, width: PW, height: PH + CHROME, transformStyle: 'preserve-3d' }}>
            <div
              style={{
                position: 'absolute',
                inset: 0,
                borderRadius: 20,
                overflow: 'hidden',
                background: '#0B0F1C',
                border: `1px solid ${hexA('#B8C8FF', 0.22)}`,
                boxShadow: `0 60px 140px rgba(0,0,0,0.65), ${glow(C.accent2, 0.4)}`,
                opacity: interpolate(intro, [0, 0.25], [0, 1], clamp),
              }}
            >
              {/* barra del navegador */}
              <div
                style={{
                  height: CHROME,
                  display: 'flex',
                  alignItems: 'center',
                  padding: '0 18px',
                  gap: 16,
                  background: 'linear-gradient(180deg, #1C2438, #141B2D)',
                  borderBottom: `1px solid ${hexA('#B8C8FF', 0.1)}`,
                }}
              >
                <div style={{ display: 'flex', gap: 8 }}>
                  {['#FF5F57', '#FEBC2E', '#28C840'].map((c) => (
                    <div key={c} style={{ width: 12, height: 12, borderRadius: '50%', background: c, opacity: 0.9 }} />
                  ))}
                </div>
                <div
                  style={{
                    flex: 1,
                    maxWidth: 560,
                    margin: '0 auto',
                    height: 28,
                    borderRadius: 8,
                    background: 'rgba(255,255,255,0.05)',
                    border: `1px solid ${hexA('#B8C8FF', 0.08)}`,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: 8,
                    fontFamily: F.body,
                    fontSize: 14,
                    color: C.textSoft,
                  }}
                >
                  <svg width="10" height="12" viewBox="0 0 11 13" fill="none">
                    <rect x="1" y="5.5" width="9" height="7" rx="1.5" fill={C.ok} opacity="0.85" />
                    <path d="M3 5.5V4a2.5 2.5 0 0 1 5 0v1.5" stroke={C.ok} strokeWidth="1.4" opacity="0.85" />
                  </svg>
                  {e.url ?? 'erp.empresa.local'}
                </div>
                <div style={{ width: 52 }} />
              </div>
              {/* contenido */}
              <div style={{ position: 'relative', width: PW, height: PH, overflow: 'hidden', background: '#fff' }}>
                {/* capa desenfocada (profundidad de campo) */}
                {dof && (
                  <div style={{ position: 'absolute', inset: 0, filter: `blur(${(7 * zoomP) / cam.z}px) saturate(0.7) brightness(0.8)` }}>
                    <Clip src={vsrc} desde={clipDesde} len={clipLen} rate={rate} w={src.w * k} h={src.h * k} style={vidStyle} />
                  </div>
                )}
                {/* capa nítida (con máscara de foco si hay zoom) */}
                <div
                  style={
                    dof
                      ? {
                          position: 'absolute',
                          inset: 0,
                          WebkitMaskImage: `radial-gradient(ellipse ${f0!.w * 0.85 + 60}px ${f0!.h * 0.85 + 50}px at ${f0!.x + f0!.w / 2}px ${f0!.y - CHROME + f0!.h / 2}px, black 55%, rgba(0,0,0,${1 - zoomP}) 100%)`,
                          maskImage: `radial-gradient(ellipse ${f0!.w * 0.85 + 60}px ${f0!.h * 0.85 + 50}px at ${f0!.x + f0!.w / 2}px ${f0!.y - CHROME + f0!.h / 2}px, black 55%, rgba(0,0,0,${1 - zoomP}) 100%)`,
                        }
                      : { position: 'absolute', inset: 0 }
                  }
                >
                  <Clip src={vsrc} desde={clipDesde} len={clipLen} rate={rate} w={src.w * k} h={src.h * k} style={vidStyle} />
                </div>

                {/* oscurecido alrededor del callout activo */}
                {callouts.map((c, i) => {
                  const start = tc[i];
                  const end = calloutEnd(i);
                  if (frame < start - 2 || frame > end + 12) return null;
                  const p = enterAt(frame, start, fps, { damping: 18 });
                  const out = interpolate(frame, [end, end + 10], [1, 0], clamp);
                  const r = P(c.rect);
                  const pad = 8 * inv;
                  return (
                    <div
                      key={i}
                      style={{
                        position: 'absolute',
                        left: r.x - pad,
                        top: r.y - CHROME - pad,
                        width: r.w + pad * 2,
                        height: r.h + pad * 2,
                        borderRadius: 10 * inv,
                        boxShadow: `0 0 0 4000px rgba(4,6,14,${0.38 * p * out})`,
                      }}
                    />
                  );
                })}

                {/* foco / cursor */}
                {foco.length > 0 &&
                  (() => {
                    let x = foco[0].x;
                    let y = foco[0].y;
                    for (let i = 1; i < foco.length; i++) {
                      const p = interpolate(frame, [tf[i] - 14, tf[i]], [0, 1], { ...clamp, easing: easeInOut });
                      x += (foco[i].x - x) * p;
                      y += (foco[i].y - y) * p;
                    }
                    const vis = Math.min(
                      interpolate(frame, [tf[0] - 8, tf[0] + 4], [0, 1], clamp),
                      interpolate(frame, [tf[foco.length - 1] + 40, tf[foco.length - 1] + 56], [1, 0], clamp),
                    );
                    const sx = (x - base.x) * k;
                    const sy = (y - base.y) * k;
                    const pulse = (frame % 36) / 36;
                    const u = inv;
                    return (
                      <div style={{ position: 'absolute', left: sx, top: sy, opacity: vis }}>
                        <div style={{ position: 'absolute', left: -80 * u, top: -80 * u, width: 160 * u, height: 160 * u, borderRadius: '50%', background: `radial-gradient(closest-side, ${hexA(C.accent, 0.3)}, transparent)` }} />
                        <div
                          style={{
                            position: 'absolute',
                            left: (-20 - pulse * 14) * u,
                            top: (-20 - pulse * 14) * u,
                            width: (40 + pulse * 28) * u,
                            height: (40 + pulse * 28) * u,
                            borderRadius: '50%',
                            border: `${2 * u}px solid ${hexA(C.accent, 0.85 * (1 - pulse))}`,
                          }}
                        />
                        <div style={{ position: 'absolute', left: -8 * u, top: -8 * u, width: 16 * u, height: 16 * u, borderRadius: '50%', background: hexA(C.accent, 0.95), boxShadow: glow(C.accent, 0.5) }} />
                      </div>
                    );
                  })()}
                {/* reflejo */}
                <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(115deg, rgba(255,255,255,0.08) 0%, transparent 28%)' }} />
              </div>
            </div>

            {/* capa flotante de callouts (separada del plano del panel) */}
            <div style={{ position: 'absolute', inset: 0, transform: 'translateZ(2px)', transformStyle: 'preserve-3d' }}>
              {callouts.map((c, i) => {
                const start = tc[i];
                const end = calloutEnd(i);
                if (frame < start - 2 || frame > end + 12) return null;
                const p = enterAt(frame, start, fps, { damping: 11, stiffness: 150 });
                const out = interpolate(frame, [end, end + 10], [1, 0], clamp);
                const r = P(c.rect);
                const pad = 8 * inv;
                const bx = r.x - pad;
                const by = r.y - pad;
                const bw = r.w + pad * 2;
                const bh = r.h + pad * 2;
                const lado = c.lado ?? 'derecha';
                const gapL = 70 * inv;
                const lx = lado === 'derecha' ? bx + bw + gapL : lado === 'izquierda' ? bx - gapL : bx + bw / 2;
                const ly = lado === 'arriba' ? by - gapL : lado === 'abajo' ? by + bh + gapL : by + bh / 2;
                const ax = lado === 'derecha' ? bx + bw : lado === 'izquierda' ? bx : bx + bw / 2;
                const ay = lado === 'arriba' ? by : lado === 'abajo' ? by + bh : by + bh / 2;
                const lineP = interpolate(frame, [start + 6, start + 18], [0, 1], { ...clamp, easing: ease });
                const lab = enterAt(frame, start + 12, fps, { damping: 12, stiffness: 140 });
                const shine = ((frame - start) % 60) / 60;
                const tr =
                  lado === 'derecha' ? 'translate(0,-50%)' : lado === 'izquierda' ? 'translate(-100%,-50%)' : lado === 'arriba' ? 'translate(-50%,-100%)' : 'translate(-50%,0)';
                return (
                  <div key={i} style={{ position: 'absolute', inset: 0, opacity: out }}>
                    <div
                      style={{
                        position: 'absolute',
                        left: bx,
                        top: by,
                        width: bw,
                        height: bh,
                        borderRadius: 10 * inv,
                        border: `${3 * inv}px solid ${C.accent}`,
                        boxShadow: `0 0 ${18 * inv}px ${hexA(C.accent, 0.7)}, 0 0 ${50 * inv}px ${hexA(C.accent, 0.35)}, inset 0 0 ${18 * inv}px ${hexA(C.accent, 0.3)}`,
                        transform: `scale(${1.3 - 0.3 * p})`,
                        opacity: interpolate(p, [0, 0.3], [0, 1], clamp),
                        overflow: 'hidden',
                      }}
                    >
                      <div
                        style={{
                          position: 'absolute',
                          top: 0,
                          bottom: 0,
                          width: '30%',
                          left: `${shine * 160 - 40}%`,
                          background: `linear-gradient(90deg, transparent, ${hexA('#ffffff', 0.4)}, transparent)`,
                          transform: 'skewX(-20deg)',
                        }}
                      />
                    </div>
                    <svg style={{ position: 'absolute', left: 0, top: 0, overflow: 'visible' }} width={1} height={1}>
                      <line x1={ax} y1={ay} x2={ax + (lx - ax) * lineP} y2={ay + (ly - ay) * lineP} stroke={C.accent} strokeWidth={3 * inv} strokeLinecap="round" />
                      <circle cx={ax} cy={ay} r={6 * inv * p} fill={C.accent} />
                    </svg>
                    <div style={{ position: 'absolute', left: lx, top: ly, transform: `${tr} scale(${inv * (0.7 + 0.3 * lab)})`, transformOrigin: lado === 'izquierda' ? '100% 50%' : '0 50%', opacity: interpolate(lab, [0, 0.3], [0, 1], clamp) }}>
                      <div
                        style={{
                          padding: '16px 24px',
                          borderRadius: 16,
                          background: 'linear-gradient(140deg, rgba(16,24,44,0.96), rgba(10,14,28,0.96))',
                          border: `1.5px solid ${hexA(C.accent, 0.6)}`,
                          boxShadow: `0 24px 60px rgba(0,0,0,0.5), ${glow(C.accent, 0.35)}`,
                          fontFamily: F.body,
                          fontWeight: 600,
                          fontSize: 28,
                          color: '#fff',
                          whiteSpace: 'nowrap',
                          display: 'flex',
                          alignItems: 'center',
                          gap: 14,
                        }}
                      >
                        <span
                          style={{
                            width: 30,
                            height: 30,
                            borderRadius: 9,
                            background: `linear-gradient(140deg, ${C.accent}, ${C.accent2})`,
                            color: '#06101A',
                            fontFamily: F.mono,
                            fontWeight: 700,
                            fontSize: 16,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                          }}
                        >
                          {i + 1}
                        </span>
                        {c.texto}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </AbsoluteFill>

      {/* velo para que la columna se lea aunque el panel pase por detrás */}
      <AbsoluteFill style={{ background: `linear-gradient(90deg, rgba(5,7,13,${0.55 + 0.3 * zoomP}) 0%, rgba(5,7,13,${0.35 + 0.3 * zoomP}) 30%, transparent 46%)` }} />
      {/* columna izquierda: título y pasos */}
      <div style={{ position: 'absolute', left: 110, top: 150, width: 430 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, opacity: enterAt(frame, 4, fps) }}>
          <Icon name="pantalla" size={22} color={C.accent} draw={interpolate(frame, [4, 30], [0, 1], clamp)} />
          <span style={{ fontFamily: F.mono, fontSize: 17, letterSpacing: '0.24em', color: C.accent }}>{(e.etiqueta ?? 'En pantalla').toUpperCase()}</span>
        </div>
        {e.titulo && (
          <div style={{ overflow: 'hidden', marginTop: 14, paddingBottom: 6 }}>
            <div
              style={{
                fontFamily: F.display,
                fontWeight: 600,
                fontSize: 56,
                lineHeight: 1.04,
                letterSpacing: '-0.025em',
                color: C.text,
                textShadow: '0 4px 30px rgba(0,0,0,0.6)',
                transform: `translateY(${(1 - enterAt(frame, 8, fps, { damping: 22 })) * 110}%)`,
              }}
            >
              {e.titulo}
            </div>
          </div>
        )}
        <div style={{ marginTop: 36, display: 'flex', flexDirection: 'column', gap: 14 }}>
          {callouts.map((c, i) => {
            const p = enterAt(frame, tc[i] - 4, fps, { damping: 12, stiffness: 140 });
            const isAct = frame >= tc[i] && frame < calloutEnd(i);
            const done = frame >= calloutEnd(i);
            return (
              <div
                key={i}
                style={{
                  ...glass({ borderRadius: 18 }),
                  background: 'linear-gradient(160deg, rgba(30,40,70,0.85), rgba(12,16,30,0.9))',
                  padding: '15px 18px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 16,
                  opacity: interpolate(p, [0, 1], [0, isAct ? 1 : 0.7]),
                  transform: `translateX(${(1 - p) * -30}px) scale(${isAct ? 1.02 : 1})`,
                  border: `1px solid ${isAct ? hexA(C.accent, 0.6) : C.line}`,
                  boxShadow: isAct ? glow(C.accent, 0.35) : '0 20px 50px rgba(0,0,0,0.4)',
                }}
              >
                <div
                  style={{
                    width: 36,
                    height: 36,
                    borderRadius: 10,
                    flexShrink: 0,
                    background: isAct ? `linear-gradient(140deg, ${C.accent}, ${C.accent2})` : done ? hexA(C.ok, 0.25) : hexA('#9fb4ff', 0.12),
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontFamily: F.mono,
                    fontWeight: 700,
                    fontSize: 17,
                    color: isAct ? '#06101A' : C.textSoft,
                  }}
                >
                  {done ? <Icon name="check" size={20} color={C.ok} stroke={2.6} /> : i + 1}
                </div>
                <span style={{ fontFamily: F.body, fontWeight: 500, fontSize: 24, color: C.text }}>{c.texto}</span>
              </div>
            );
          })}
        </div>
      </div>
    </AbsoluteFill>
  );
};
