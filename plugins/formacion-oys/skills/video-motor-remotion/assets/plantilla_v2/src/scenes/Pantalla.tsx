import React from 'react';
import { AbsoluteFill, Freeze, Img, interpolate, OffthreadVideo, Sequence, staticFile, useCurrentFrame, useVideoConfig } from 'remotion';
import type { Pantalla as PantallaT, Rect } from '../types';
import { C, F, hexA } from '../theme';
import { clamp, enterAt, useScene, useTiempos } from '../lib/scene';
import { CH, camAt, geom, marcas, toPanel, toView, type Marca } from '../lib/pantalla';
import { Icon } from '../components/Icons';

/**
 * Escena «pantalla» v2: el ERP ocupa ~92 % del ancho, plano y nítido mientras se explica.
 * La perspectiva solo aparece en la entrada (vuelo corto). Los zooms son un dolly 2D dentro de la ventana
 * (la barra del navegador no se mueve) y nunca enseñan fuera del vídeo. Sin desenfoques.
 */

const AMBAR = '#FFB300';

/** Vídeo del clip con congelado antes/después. */
const Clip: React.FC<{ src: string; desde: number; len: number; rate: number; style?: React.CSSProperties }> = ({ src, desde, len, rate, style }) => {
  const frame = useCurrentFrame();
  const vf = frame - desde;
  const frozen = vf < 0 || vf >= len - 1;
  const at = vf < 0 ? desde : desde + len - 2;
  return (
    <Freeze frame={at} active={frozen}>
      <Sequence from={desde} layout="none">
        <OffthreadVideo src={src} muted playbackRate={rate} style={style} />
      </Sequence>
    </Freeze>
  );
};

/** Etiqueta de un callout o resalte (alto contraste: fondo sólido, texto blanco). */
const Etiqueta: React.FC<{ m: Marca; v: Rect; PW: number; PH: number; p: number; color: string }> = ({ m, v, PW, PH, p, color }) => {
  if (!m.texto) return null;
  const estW = m.texto.length * 13 + (m.n ? 44 : 0) + 40;
  const gap = 34;
  let lado = m.lado;
  if (!lado) {
    if (v.x + v.w + gap + estW < PW - 10) lado = 'derecha';
    else if (v.x - gap - estW > 10) lado = 'izquierda';
    else if (v.y + v.h + gap + 60 < PH) lado = 'abajo';
    else lado = 'arriba';
  }
  const cxr = v.x + v.w / 2;
  const cyr = v.y + v.h / 2;
  const ax = lado === 'derecha' ? v.x + v.w : lado === 'izquierda' ? v.x : cxr;
  const ay = lado === 'arriba' ? v.y : lado === 'abajo' ? v.y + v.h : cyr;
  let lx = lado === 'derecha' ? ax + gap : lado === 'izquierda' ? ax - gap : ax;
  const ly = lado === 'arriba' ? ay - gap : lado === 'abajo' ? ay + gap : ay;
  // que no se salga por los lados
  if (lado === 'arriba' || lado === 'abajo') lx = Math.min(Math.max(lx, estW / 2 + 8), PW - estW / 2 - 8);
  const tr = lado === 'derecha' ? 'translate(0,-50%)' : lado === 'izquierda' ? 'translate(-100%,-50%)' : lado === 'arriba' ? 'translate(-50%,-100%)' : 'translate(-50%,0)';
  const lp = interpolate(p, [0.2, 1], [0, 1], clamp);
  return (
    <>
      <svg style={{ position: 'absolute', left: 0, top: 0, overflow: 'visible' }} width={1} height={1}>
        <line x1={ax} y1={ay} x2={ax + (lx - ax) * lp} y2={ay + (ly - ay) * lp} stroke={color} strokeWidth={3} strokeLinecap="round" />
        <circle cx={ax} cy={ay} r={5 * p} fill={color} />
      </svg>
      <div style={{ position: 'absolute', left: lx, top: ly, transform: `${tr} scale(${0.85 + 0.15 * lp})`, opacity: lp }}>
        <div
          style={{
            padding: '9px 18px 10px',
            borderRadius: 12,
            background: '#0A1122',
            border: `2px solid ${color}`,
            boxShadow: `0 14px 36px rgba(0,0,0,0.45), 0 0 22px ${hexA(color, 0.35)}`,
            fontFamily: F.body,
            fontWeight: 600,
            fontSize: 24,
            lineHeight: 1.2,
            color: '#fff',
            whiteSpace: 'nowrap',
            display: 'flex',
            alignItems: 'center',
            gap: 12,
          }}
        >
          {m.n > 0 && (
            <span
              style={{
                width: 28,
                height: 28,
                borderRadius: 8,
                background: color,
                color: '#06101A',
                fontFamily: F.mono,
                fontWeight: 700,
                fontSize: 16,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              {m.n}
            </span>
          )}
          {m.texto}
        </div>
      </div>
    </>
  );
};

export const Pantalla: React.FC<{ e: PantallaT }> = ({ e }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const { dur, words, lead, cap } = useScene();
  const g = geom(e);
  const { PW, PH, X0, Y0, src, base, k } = g;
  const tz = useTiempos(e.zooms ?? [], { inicio: 1, paso: 2.5 });
  const foco = e.foco ?? [];
  const tf = useTiempos(foco, { inicio: 1.5, paso: 1 });
  const cam = camAt(e, g, frame, fps, tz);
  const ms = marcas(e, words, lead, fps, dur);

  // ---------- entrada: vuelo corto en 3D que termina plano ----------
  const intro = enterAt(frame, 0, fps, { damping: 26, stiffness: 70 });
  const q = 1 - Math.min(1, intro);
  const plano = q < 0.002;
  const panelT = plano
    ? undefined
    : `perspective(2400px) translate3d(${q * 140}px, ${q * 40}px, ${-q * 520}px) rotateX(${q * 10}deg) rotateY(${-q * 22}deg)`;

  // ---------- vídeo ----------
  const clipDesde = Math.round((e.clipDesde ?? 0.3) * fps);
  const rate = e.velocidad ?? 1;
  const clipLen = e.clipDur
    ? Math.round((e.clipDur * fps) / rate)
    : e.clip
      ? Math.round(((e.clip.fin - e.clip.inicio) * fps) / rate)
      : dur + 30;
  const vsrc = staticFile(e.imagen ?? e.video ?? `clips/${e.id}.mp4`);
  const vidStyle: React.CSSProperties = { position: 'absolute', left: -base.x * k, top: -base.y * k, width: src.w * k, height: src.h * k, display: 'block' };
  const content = `translate(${PW / 2 - cam.cx * cam.z}px, ${PH / 2 - cam.cy * cam.z}px) scale(${cam.z})`;

  // marca activa más reciente → oscurece el resto
  const activas = ms.filter((m) => frame >= m.start - 2 && frame <= m.end + 12);
  const foc = [...activas].filter((m) => m.oscurece).sort((a, b) => a.start - b.start).pop();

  return (
    <AbsoluteFill>
      {/* halo detrás del panel */}
      <div
        style={{
          position: 'absolute',
          left: X0 - 120,
          top: Y0 - 80,
          width: PW + 240,
          height: PH + CH + 160,
          background: `radial-gradient(closest-side, ${hexA(C.accent2, 0.28)}, ${hexA(C.accent, 0.06)} 65%, transparent)`,
          opacity: intro,
        }}
      />
      <div
        style={{
          position: 'absolute',
          left: X0,
          top: Y0,
          width: PW,
          height: PH + CH,
          transform: panelT,
          transformOrigin: '30% 50%',
          opacity: interpolate(intro, [0, 0.2], [0, 1], clamp),
        }}
      >
        <div
          style={{
            position: 'absolute',
            inset: 0,
            borderRadius: 12,
            overflow: 'hidden',
            background: '#0B0F1C',
            border: `1px solid ${hexA('#B8C8FF', 0.22)}`,
            boxShadow: `0 40px 100px rgba(0,0,0,0.6), 0 0 60px ${hexA(C.accent2, 0.18)}`,
          }}
        >
          {/* barra del navegador (fina) con el título del paso */}
          <div
            style={{
              height: CH,
              display: 'flex',
              alignItems: 'center',
              padding: '0 14px',
              gap: 12,
              background: 'linear-gradient(180deg, #1A2236, #131A2B)',
              borderBottom: `1px solid ${hexA('#B8C8FF', 0.1)}`,
              position: 'relative',
            }}
          >
            <div style={{ display: 'flex', gap: 7 }}>
              {['#FF5F57', '#FEBC2E', '#28C840'].map((c) => (
                <div key={c} style={{ width: 10, height: 10, borderRadius: '50%', background: c, opacity: 0.85 }} />
              ))}
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginLeft: 8, maxWidth: 640, overflow: 'hidden', opacity: enterAt(frame, 6, fps) }}>
              <Icon name="pantalla" size={15} color={C.accent} />
              <span style={{ fontFamily: F.mono, fontSize: 11, letterSpacing: '0.2em', color: C.accent, textTransform: 'uppercase' }}>{e.etiqueta ?? 'Paso'}</span>
              {e.titulo && (
                <span style={{ fontFamily: F.body, fontWeight: 600, fontSize: 15, color: '#EEF2FF', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{e.titulo}</span>
              )}
            </div>
            <div style={{ flex: 1 }} />
            <div
              style={{
                position: 'absolute',
                left: '50%',
                transform: 'translateX(-50%)',
                height: 20,
                padding: '0 14px',
                borderRadius: 6,
                background: 'rgba(255,255,255,0.05)',
                border: `1px solid ${hexA('#B8C8FF', 0.08)}`,
                display: 'flex',
                alignItems: 'center',
                gap: 7,
                fontFamily: F.body,
                fontSize: 12,
                color: C.textMute,
                maxWidth: 420,
                whiteSpace: 'nowrap',
              }}
            >
              <svg width="9" height="11" viewBox="0 0 11 13" fill="none">
                <rect x="1" y="5.5" width="9" height="7" rx="1.5" fill={C.ok} opacity="0.85" />
                <path d="M3 5.5V4a2.5 2.5 0 0 1 5 0v1.5" stroke={C.ok} strokeWidth="1.4" opacity="0.85" />
              </svg>
              {e.url ?? 'nextdemo.geasa.eu'}
            </div>
            {cap && (
              <span style={{ fontFamily: F.body, fontSize: 12, color: C.textMute, whiteSpace: 'nowrap', maxWidth: 420, overflow: 'hidden', textOverflow: 'ellipsis' }}>
                <span style={{ fontFamily: F.mono, color: hexA(C.accent, 0.85), marginRight: 8 }}>
                  {String(cap.numero).padStart(2, '0')}/{String(cap.total).padStart(2, '0')}
                </span>
                {cap.titulo}
              </span>
            )}
          </div>

          {/* contenido */}
          <div style={{ position: 'relative', width: PW, height: PH, overflow: 'hidden', background: '#fff' }}>
            <div style={{ position: 'absolute', left: 0, top: 0, width: PW, height: PH, transformOrigin: '0 0', transform: content }}>
              {e.imagen ? <Img src={vsrc} style={vidStyle} /> : <Clip src={vsrc} desde={clipDesde} len={clipLen} rate={rate} style={vidStyle} />}
              {/* tapas: corrigen textos del vídeo (se mueven con el zoom) */}
              {(e.tapas ?? []).map((tp, i) => {
                if (tp.desde !== undefined && frame < Math.round(tp.desde * fps)) return null;
                if (tp.hasta !== undefined && frame > Math.round(tp.hasta * fps)) return null;
                const r = toPanel(g, tp.rect);
                return (
                  <div
                    key={`t${i}`}
                    style={{
                      position: 'absolute',
                      left: r.x,
                      top: r.y,
                      width: r.w,
                      height: r.h,
                      background: tp.fondo ?? '#F1F1F1',
                      display: 'flex',
                      alignItems: 'center',
                      paddingLeft: (tp.margen ?? 10) * k,
                      fontFamily: F.erp,
                      fontWeight: tp.peso ?? 500,
                      fontSize: (tp.tamano ?? 31) * k,
                      letterSpacing: tp.espaciado ?? '0.09em',
                      color: tp.color ?? '#1F1F1F',
                      whiteSpace: 'nowrap',
                      overflow: 'hidden',
                    }}
                  >
                    <span style={{ display: 'inline-block', transform: tp.dy ? `translateY(${tp.dy * k}px)` : undefined }}>{tp.texto}</span>
                  </div>
                );
              })}
            </div>
            {/* foco: oscurece todo menos la marca activa */}
            {foc &&
              (() => {
                const p = enterAt(frame, foc.start, fps, { damping: 20 });
                const out = interpolate(frame, [foc.end, foc.end + 12], [1, 0], clamp);
                const v = toView(g, cam, toPanel(g, foc.rect));
                const pad = 8;
                return (
                  <div
                    style={{
                      position: 'absolute',
                      left: v.x - pad,
                      top: v.y - pad,
                      width: v.w + pad * 2,
                      height: v.h + pad * 2,
                      borderRadius: 10,
                      boxShadow: `0 0 0 4000px rgba(6,10,24,${0.34 * p * out})`,
                    }}
                  />
                );
              })()}
          </div>
        </div>

        {/* capa de marcas (no se recorta: las etiquetas pueden salir del panel) */}
        <div style={{ position: 'absolute', left: 0, top: CH, width: PW, height: PH }}>
          {activas.map((m) => {
            const p = enterAt(frame, m.start, fps, { damping: 14, stiffness: 140 });
            const out = interpolate(frame, [m.end, m.end + 12], [1, 0], clamp);
            const v = toView(g, cam, toPanel(g, m.rect));
            const color = m.tipo === 'callout' ? C.accent : AMBAR;
            const pad = 7;
            const pulse = 0.5 + 0.5 * Math.sin(((frame - m.start) / fps) * Math.PI * 1.6);
            return (
              <div key={`${m.tipo}-${m.i}`} style={{ position: 'absolute', inset: 0, opacity: out }}>
                <div
                  style={{
                    position: 'absolute',
                    left: v.x - pad,
                    top: v.y - pad,
                    width: v.w + pad * 2,
                    height: v.h + pad * 2,
                    borderRadius: 9,
                    border: `3px solid ${color}`,
                    boxShadow: `0 0 ${12 + 10 * pulse}px ${hexA(color, 0.75)}, inset 0 0 10px ${hexA(color, 0.25)}`,
                    transform: `scale(${1.18 - 0.18 * p})`,
                    opacity: interpolate(p, [0, 0.3], [0, 1], clamp),
                  }}
                />
                <Etiqueta m={m} v={{ x: v.x - pad, y: v.y - pad, w: v.w + pad * 2, h: v.h + pad * 2 }} PW={PW} PH={PH} p={p} color={color} />
              </div>
            );
          })}

          {/* anillos de clic */}
          {foco.map((f, i) => {
            const s = tf[i];
            const end = f.hasta !== undefined ? Math.round(f.hasta * fps) : s + Math.round(1.2 * fps);
            if (frame < s || frame > end + 8) return null;
            const v = toView(g, cam, toPanel(g, { x: f.x, y: f.y, w: 0, h: 0 }));
            const ph = ((frame - s) % 24) / 24;
            const op = interpolate(frame, [end - 6, end + 8], [1, 0], clamp);
            return (
              <div key={`f${i}`} style={{ position: 'absolute', left: v.x, top: v.y, opacity: op }}>
                <div
                  style={{
                    position: 'absolute',
                    left: -14 - ph * 30,
                    top: -14 - ph * 30,
                    width: 28 + ph * 60,
                    height: 28 + ph * 60,
                    borderRadius: '50%',
                    border: `3px solid ${hexA(C.accent, 0.95 * (1 - ph))}`,
                  }}
                />
                <div style={{ position: 'absolute', left: -6, top: -6, width: 12, height: 12, borderRadius: '50%', background: hexA(C.accent, 0.9), boxShadow: `0 0 12px ${C.accent}` }} />
              </div>
            );
          })}
        </div>
      </div>
    </AbsoluteFill>
  );
};
