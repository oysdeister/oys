import React from 'react';
import { AbsoluteFill, Easing, interpolate, useCurrentFrame, useVideoConfig } from 'remotion';
import type { Portada as PortadaT, Cierre as CierreT } from '../types';
import { C, F, glow, hexA } from '../theme';
import { clamp, ease, enterAt, lerp, useScene } from '../lib/scene';
import { Logo } from '../components/Icons';
import { BrandLogo, useMarca } from '../components/Brand';
import { Chip } from '../components/ui';

/** Título con letras que suben desde el desenfoque, escalonadas. */
export const RevealTitle: React.FC<{ text: string; at: number; size: number; stagger?: number }> = ({ text, at, size, stagger = 1.6 }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const words = text.split(' ');
  let n = 0;
  return (
    <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', columnGap: size * 0.26 }}>
      {words.map((w, wi) => (
        <span key={wi} style={{ display: 'inline-flex', overflow: 'visible' }}>
          {w.split('').map((ch, ci) => {
            const s = enterAt(frame, at + n++ * stagger, fps, { damping: 16, stiffness: 90 });
            return (
              <span
                key={ci}
                style={{
                  display: 'inline-block',
                  fontFamily: F.display,
                  fontWeight: 700,
                  fontSize: size,
                  letterSpacing: '-0.035em',
                  lineHeight: 1.02,
                  backgroundImage: `linear-gradient(180deg, #FFFFFF 20%, ${hexA('#CFE9FF', 0.9)} 60%, ${hexA(C.accent, 0.95)} 120%)`,
                  WebkitBackgroundClip: 'text',
                  backgroundClip: 'text',
                  color: 'transparent',
                  transform: `translateY(${(1 - s) * 60}px) rotateX(${(1 - s) * 50}deg)`,
                  opacity: interpolate(s, [0, 0.5], [0, 1], clamp),
                  filter: `blur(${(1 - s) * 10}px)`,
                }}
              >
                {ch}
              </span>
            );
          })}
        </span>
      ))}
    </div>
  );
};

/** Pseudoaleatorio determinista (mismo resultado en cada fotograma). */
const rnd = (i: number, k = 0) => {
  const x = Math.sin(i * 127.1 + k * 311.7) * 43758.5453;
  return x - Math.floor(x);
};

/** Parte el título en dos líneas equilibradas (si es largo). */
const splitLines = (t: string): string[] => {
  if (t.includes('|')) return t.split('|').map((x) => x.trim()).slice(0, 2);
  const w = t.split(' ');
  if (t.length <= 16 || w.length < 2) return [t];
  let best = 1;
  let bd = Infinity;
  for (let i = 1; i < w.length; i++) {
    const d = Math.abs(w.slice(0, i).join(' ').length - w.slice(i).join(' ').length);
    if (d < bd) { bd = d; best = i; }
  }
  return [w.slice(0, best).join(' '), w.slice(best).join(' ')];
};

/** Partículas de polvo luminoso que vuelan hacia la cámara. */
const Particles: React.FC<{ frame: number; on: number }> = ({ frame, on }) => (
  <AbsoluteFill style={{ pointerEvents: 'none' }}>
    {Array.from({ length: 110 }).map((_, i) => {
      const speed = 0.0025 + rnd(i, 3) * 0.004;
      const z = (rnd(i, 1) + frame * speed) % 1; // 0 lejos → 1 cerca
      const ang = rnd(i, 2) * Math.PI * 2;
      const rad = 0.08 + rnd(i, 4) * 0.9;
      const persp = 0.25 + z * z * 2.2;
      const x = 960 + Math.cos(ang) * rad * 900 * persp;
      const y = 540 + Math.sin(ang) * rad * 560 * persp;
      const s = (1 + rnd(i, 5) * 2.4) * (0.4 + z * 1.8);
      const a = on * Math.min(1, z * 3) * (1 - Math.max(0, z - 0.85) / 0.15) * (0.35 + rnd(i, 6) * 0.65);
      const col = rnd(i, 7) > 0.75 ? C.brand : rnd(i, 7) > 0.45 ? C.accent : '#ffffff';
      return (
        <div key={i} style={{ position: 'absolute', left: x, top: y, width: s, height: s, borderRadius: '50%', background: col, opacity: a, boxShadow: `0 0 ${s * 3}px ${col}` }} />
      );
    })}
  </AbsoluteFill>
);

/** Una línea del título: cada letra sube tras una máscara; encima, un barrido de luz recortado al texto. */
const TitleLine: React.FC<{ text: string; at: number; size: number; frame: number; fps: number; accent?: boolean; sweepAt: number }> = ({ text, at, size, frame, fps, accent, sweepAt }) => {
  const words = text.split(' ');
  const base: React.CSSProperties = {
    fontFamily: F.display,
    fontWeight: 700,
    fontSize: size,
    letterSpacing: '-0.04em',
    lineHeight: 1.0,
    fontKerning: 'none',
    whiteSpace: 'pre',
  };
  const fill = accent
    ? `linear-gradient(100deg, ${C.accent} 0%, #9FF3FF 35%, #FFFFFF 55%, ${C.brand} 100%)`
    : `linear-gradient(180deg, #FFFFFF 25%, #D9ECFF 70%, ${hexA(C.accent, 0.9)} 125%)`;
  const sweep = interpolate(frame, [sweepAt, sweepAt + 34], [-0.25, 1.25], clamp);
  let n = 0;
  const row = (render: (w: string, wi: number) => React.ReactNode) => (
    <div style={{ display: 'flex', justifyContent: 'center', columnGap: size * 0.24 }}>{words.map(render)}</div>
  );
  return (
    <div style={{ position: 'relative', filter: `drop-shadow(0 0 ${size * 0.18}px ${hexA(accent ? C.accent : '#8fb8ff', 0.35)})` }}>
      {row((w, wi) => (
        <span key={wi} style={{ display: 'inline-flex', overflow: 'hidden', padding: `${size * 0.04}px 0 ${size * 0.12}px`, margin: `-${size * 0.04}px 0 -${size * 0.12}px` }}>
          {w.split('').map((ch, ci) => {
            const s = enterAt(frame, at + n++ * 1.5, fps, { damping: 15, stiffness: 95 });
            return (
              <span
                key={ci}
                style={{
                  ...base,
                  display: 'inline-block',
                  backgroundImage: fill,
                  backgroundSize: accent ? `${text.length * size * 0.56}px 100%` : undefined,
                  backgroundPosition: accent ? `${-(n - 1 + wi) * size * 0.56}px 0` : undefined,
                  WebkitBackgroundClip: 'text',
                  backgroundClip: 'text',
                  color: 'transparent',
                  transform: `translateY(${(1 - s) * 115}%) rotate(${(1 - s) * 8}deg)`,
                  filter: `blur(${(1 - s) * 6}px)`,
                }}
              >
                {ch}
              </span>
            );
          })}
        </span>
      ))}
      {/* barrido de luz */}
      <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none' }}>
        {row((w, wi) => (
          <span
            key={wi}
            style={{
              ...base,
              display: 'inline-block',
              padding: `${size * 0.04}px 0 ${size * 0.12}px`,
              margin: `-${size * 0.04}px 0 -${size * 0.12}px`,
              backgroundImage: `linear-gradient(100deg, transparent ${sweep * 100 - 14}%, rgba(255,255,255,0.95) ${sweep * 100}%, transparent ${sweep * 100 + 14}%)`,
              backgroundSize: '1920px 100%',
              backgroundAttachment: 'fixed',
              WebkitBackgroundClip: 'text',
              backgroundClip: 'text',
              color: 'transparent',
            }}
          >
            {w}
          </span>
        ))}
      </div>
    </div>
  );
};

export const Portada: React.FC<{ e: PortadaT }> = ({ e }) => {
  const frame = useCurrentFrame();
  const marca = useMarca();
  const { fps } = useVideoConfig();
  const { dur } = useScene();

  const line = lerp(frame, 0, 16, 0, 1, ease);
  const open = lerp(frame, 12, 38, 0, 1, ease);
  // cámara: entra desde lejos e inclinada, después sigue acercándose despacio
  const dolly = lerp(frame, 6, 110, 0, 1, Easing.out(Easing.cubic));
  const camZ = -900 * (1 - dolly) + interpolate(frame, [110, Math.max(111, dur)], [0, 70], clamp);
  const camRX = 18 * (1 - dolly);
  const camRY = -6 * (1 - dolly) + Math.sin(frame / 70) * 1.2;
  const beam = interpolate(frame, [10, 50, 140, 220], [0, 1, 0.75, 0.55], clamp);
  const lines = splitLines(e.titulo);
  const size = lines.length > 1 ? Math.min(172, Math.round(1560 / (Math.max(...lines.map((l) => l.length)) * 0.52))) : e.titulo.replace('|', ' ').length > 14 ? 170 : 210;
  const t1 = 30;
  const t2 = t1 + lines[0].replace(/ /g, '').length * 1.5 + 4;
  const titleEnd = t2 + (lines[1] ?? '').replace(/ /g, '').length * 1.5;
  const sweepAt = titleEnd + 10;
  const bar = enterAt(frame, titleEnd - 4, fps, { damping: 22, stiffness: 70 });
  const subWords = (e.subtitulo ?? '').split(' ').filter(Boolean);
  const subAt = titleEnd + 8;
  const chip = enterAt(frame, subAt + subWords.length * 3 + 6, fps, { damping: 20 });
  const pres = enterAt(frame, 40, fps, { damping: 20 });
  const flareX = interpolate(frame, [sweepAt, sweepAt + 34], [-200, 2120], clamp);
  const flareA = interpolate(frame, [sweepAt, sweepAt + 6, sweepAt + 28, sweepAt + 34], [0, 1, 1, 0], clamp);

  return (
    <AbsoluteFill style={{ alignItems: 'center', justifyContent: 'center', overflow: 'hidden' }}>
      {/* fondo profundo: viñeta + rejilla en perspectiva */}
      <AbsoluteFill style={{ background: `radial-gradient(ellipse at 50% 45%, ${hexA(C.accent2, 0.22 * open)} 0%, transparent 55%), radial-gradient(ellipse at 50% 120%, ${hexA(C.brand, 0.18 * open)} 0%, transparent 50%)` }} />
      <div
        style={{
          position: 'absolute',
          left: -960,
          right: -960,
          top: 620,
          height: 900,
          backgroundImage: `linear-gradient(${hexA(C.accent, 0.16)} 1px, transparent 1px), linear-gradient(90deg, ${hexA(C.accent, 0.16)} 1px, transparent 1px)`,
          backgroundSize: '90px 90px',
          backgroundPosition: `0 ${(frame * 1.6) % 90}px`,
          transform: 'perspective(700px) rotateX(72deg)',
          transformOrigin: '50% 0%',
          WebkitMaskImage: 'linear-gradient(180deg, #000 0%, transparent 75%)',
          maskImage: 'linear-gradient(180deg, #000 0%, transparent 75%)',
          opacity: open * 0.8,
        }}
      />
      {/* haz de luz volumétrico */}
      <div
        style={{
          position: 'absolute',
          left: 960 - 700,
          top: -300,
          width: 1400,
          height: 1300,
          background: `conic-gradient(from 168deg at 50% 0%, transparent 0deg, ${hexA(C.accent, 0.16)} 10deg, ${hexA('#ffffff', 0.22)} 12deg, ${hexA(C.accent, 0.16)} 14deg, transparent 24deg)`,
          filter: 'blur(26px)',
          transform: `rotate(${Math.sin(frame / 50) * 3}deg)`,
          transformOrigin: '50% 0%',
          opacity: beam,
          mixBlendMode: 'screen',
        }}
      />
      <Particles frame={frame} on={open} />

      {/* escenario 3D con la cámara */}
      <div style={{ position: 'absolute', inset: 0, perspective: 1400, perspectiveOrigin: '50% 45%' }}>
        <div
          style={{
            position: 'absolute',
            inset: 0,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            paddingBottom: 120,
            transformStyle: 'preserve-3d',
            transform: `translateZ(${camZ}px) rotateX(${camRX}deg) rotateY(${camRY}deg)`,
          }}
        >
          {e.etiqueta && (
            <div style={{ marginBottom: 34, opacity: chip, transform: `translateZ(40px) translateY(${(1 - chip) * 14}px)` }}>
              <Chip style={{ fontSize: 19, letterSpacing: '0.24em', textTransform: 'uppercase', padding: '10px 22px' }}>{e.etiqueta}</Chip>
            </div>
          )}
          {/* marca */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 26, marginBottom: 46, transform: 'translateZ(60px)' }}>
            {marca?.logo && <BrandLogo width={210} draw={lerp(frame, 10, 44, 0, 1, ease)} text={enterAt(frame, 36, fps, { damping: 16 })} />}
            {marca && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 6, opacity: pres, transform: `translateX(${(1 - pres) * -24}px)` }}>
                <span style={{ fontFamily: F.display, fontWeight: 600, fontSize: 40, color: C.text, letterSpacing: '0.01em' }}>{marca.texto}</span>
                <span style={{ fontFamily: F.mono, fontSize: 17, letterSpacing: '0.42em', color: C.brand, textTransform: 'uppercase' }}>presenta</span>
              </div>
            )}
          </div>

          {/* título */}
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: size * 0.02, transform: 'translateZ(120px)' }}>
            {lines.map((l, i) => (
              <TitleLine key={i} text={l} at={i === 0 ? t1 : t2} size={i === 0 && lines.length > 1 ? size * 0.78 : size} frame={frame} fps={fps} accent={i === lines.length - 1 && lines.length > 1} sweepAt={sweepAt + i * 5} />
            ))}
          </div>

          {/* barra de luz bajo el título */}
          <div
            style={{
              marginTop: 34,
              width: 900 * bar,
              height: 3,
              borderRadius: 2,
              background: `linear-gradient(90deg, transparent, ${C.accent} 25%, #fff 50%, ${C.brand} 75%, transparent)`,
              boxShadow: glow(C.accent, 1),
              transform: 'translateZ(90px)',
            }}
          />

          {/* subtítulo palabra a palabra */}
          {subWords.length > 0 && (
            <div style={{ marginTop: 30, display: 'flex', gap: 14, transform: 'translateZ(80px)' }}>
              {subWords.map((w, i) => {
                const s = enterAt(frame, subAt + i * 3, fps, { damping: 18 });
                return (
                  <span key={i} style={{ fontFamily: F.body, fontWeight: 400, fontSize: 44, color: C.textSoft, display: 'inline-block', opacity: s, transform: `translateY(${(1 - s) * 26}px)`, filter: `blur(${(1 - s) * 8}px)` }}>
                    {w}
                  </span>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* destello que acompaña al barrido */}
      <div
        style={{
          position: 'absolute',
          left: flareX - 260,
          top: 540 - 260,
          width: 520,
          height: 520,
          borderRadius: '50%',
          background: `radial-gradient(circle, rgba(255,255,255,0.55) 0%, ${hexA(C.accent, 0.25)} 22%, transparent 60%)`,
          opacity: flareA * 0.7,
          mixBlendMode: 'screen',
          pointerEvents: 'none',
        }}
      />

      {/* barras cinematográficas y línea de luz inicial */}
      <div style={{ position: 'absolute', left: 0, right: 0, top: 0, height: 540 * (1 - open), background: '#000' }} />
      <div style={{ position: 'absolute', left: 0, right: 0, bottom: 0, height: 540 * (1 - open), background: '#000' }} />
      <div
        style={{
          position: 'absolute',
          left: '50%',
          top: 539,
          width: 1920 * line,
          marginLeft: -960 * line,
          height: 2,
          background: `linear-gradient(90deg, transparent, ${C.accent} 30%, #fff 50%, ${C.accent} 70%, transparent)`,
          boxShadow: glow(C.accent, 1.4),
          opacity: interpolate(open, [0, 0.6], [1, 0], clamp),
        }}
      />
    </AbsoluteFill>
  );
};

export const Cierre: React.FC<{ e: CierreT }> = ({ e }) => {
  const frame = useCurrentFrame();
  const marca = useMarca();
  const { fps } = useVideoConfig();
  const { dur } = useScene();
  const logoS = enterAt(frame, 4, fps, { damping: 14, stiffness: 80 });
  const sub = enterAt(frame, 26, fps);
  const fadeOut = interpolate(frame, [dur - 24, dur], [0, 1], clamp);
  return (
    <AbsoluteFill style={{ alignItems: 'center', justifyContent: 'center' }}>
      <div
        style={{
          position: 'absolute',
          width: 1100,
          height: 1100,
          borderRadius: '50%',
          background: `radial-gradient(circle, ${hexA(C.accent, 0.18)} 0%, ${hexA(C.accent2, 0.12)} 35%, transparent 65%)`,
          transform: `scale(${0.7 + 0.3 * logoS})`,
        }}
      />
      <div style={{ transform: `scale(${0.5 + 0.5 * logoS})`, opacity: logoS, marginBottom: 46 }}>
        {marca?.logo ? (
          <BrandLogo width={400} draw={lerp(frame, 4, 36, 0, 1, ease)} text={enterAt(frame, 30, fps, { damping: 16 })} />
        ) : (
          <Logo size={150} p={lerp(frame, 4, 44, 0, 1, ease)} />
        )}
      </div>
      <RevealTitle text={e.titulo} at={12} size={120} />
      {e.subtitulo && (
        <div style={{ marginTop: 26, fontFamily: F.body, fontSize: 30, color: C.textSoft, opacity: sub, transform: `translateY(${(1 - sub) * 16}px)` }}>{e.subtitulo}</div>
      )}
      {e.siguientes && e.siguientes.length > 0 && (
        <div style={{ marginTop: 56, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 18 }}>
          <span style={{ fontFamily: F.mono, fontSize: 17, letterSpacing: '0.26em', color: C.textMute, opacity: sub }}>A CONTINUACIÓN</span>
          <div style={{ display: 'flex', gap: 14 }}>
            {e.siguientes.map((s, i) => {
              const p = enterAt(frame, 36 + i * 6, fps);
              return (
                <div key={i} style={{ opacity: p, transform: `translateY(${(1 - p) * 14}px)` }}>
                  <Chip color={i === 0 ? C.accent : '#B9C6FF'} style={{ fontSize: 20, padding: '10px 18px', fontFamily: F.body, letterSpacing: 0 }}>
                    {s}
                  </Chip>
                </div>
              );
            })}
          </div>
        </div>
      )}
      {marca && (
        <div
          style={{
            position: 'absolute',
            bottom: 176,
            left: 0,
            right: 0,
            textAlign: 'center',
            fontFamily: F.body,
            fontSize: 22,
            letterSpacing: '0.06em',
            color: C.textSoft,
            opacity: enterAt(frame, 50, fps),
          }}
        >
          {marca.copyrightTxt}
        </div>
      )}
      <AbsoluteFill style={{ background: '#000', opacity: fadeOut }} />
    </AbsoluteFill>
  );
};
