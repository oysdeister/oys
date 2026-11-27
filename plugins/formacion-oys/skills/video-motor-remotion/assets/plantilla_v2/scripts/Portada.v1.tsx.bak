import React from 'react';
import { AbsoluteFill, interpolate, useCurrentFrame, useVideoConfig } from 'remotion';
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

export const Portada: React.FC<{ e: PortadaT }> = ({ e }) => {
  const frame = useCurrentFrame();
  const marca = useMarca();
  const { fps } = useVideoConfig();
  const { dur } = useScene();

  // 1) línea de luz que se abre  2) barras cinematográficas que se separan
  const line = lerp(frame, 0, 18, 0, 1);
  const open = lerp(frame, 14, 40, 0, 1);
  const logoP = lerp(frame, 18, 60, 0, 1);
  const logoS = enterAt(frame, 16, fps, { damping: 14, stiffness: 80 });
  const sub = enterAt(frame, 44, fps, { damping: 20 });
  const chip = enterAt(frame, 54, fps, { damping: 20 });
  const flare = interpolate(frame, [40, 80], [-0.3, 1.3], clamp);
  const drift = interpolate(frame, [0, dur], [1, 1.05]);

  return (
    <AbsoluteFill style={{ alignItems: 'center', justifyContent: 'center' }}>
      {/* orbe tras el título */}
      <div
        style={{
          position: 'absolute',
          width: 1300,
          height: 1300,
          borderRadius: '50%',
          background: `radial-gradient(circle, ${hexA(C.accent2, 0.32)} 0%, ${hexA(C.accent, 0.1)} 35%, transparent 65%)`,
          transform: `scale(${open * drift})`,
          opacity: open,
        }}
      />
      {/* anillos */}
      {[0, 1, 2].map((i) => (
        <div
          key={i}
          style={{
            position: 'absolute',
            width: 520 + i * 260,
            height: 520 + i * 260,
            borderRadius: '50%',
            border: `1px solid ${hexA(i === 1 ? C.accent : '#9fb4ff', 0.12 - i * 0.03)}`,
            transform: `scale(${0.6 + 0.4 * enterAt(frame, 20 + i * 6, fps, { damping: 30, stiffness: 50 })}) rotate(${frame * (0.08 + i * 0.03)}deg)`,
            opacity: open,
            borderTopColor: hexA(C.accent, 0.4 - i * 0.1),
          }}
        />
      ))}

      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', transform: `scale(${drift})` }}>
        {marca?.logo ? (
          <div style={{ marginBottom: 34, transform: `scale(${0.85 + 0.15 * logoS})` }}>
            <BrandLogo width={300} draw={lerp(frame, 12, 46, 0, 1, ease)} text={enterAt(frame, 40, fps, { damping: 16 })} />
          </div>
        ) : (
          <div style={{ transform: `scale(${0.6 + 0.4 * logoS})`, opacity: logoS, marginBottom: 44 }}>
            <Logo size={128} p={logoP} />
          </div>
        )}
        {e.etiqueta && (
          <div style={{ opacity: chip, transform: `translateY(${(1 - chip) * 12}px)`, marginBottom: 30 }}>
            <Chip style={{ fontSize: 19, letterSpacing: '0.22em', textTransform: 'uppercase', padding: '9px 20px' }}>{e.etiqueta}</Chip>
          </div>
        )}
        <div style={{ position: 'relative', perspective: 800 }}>
          <RevealTitle text={e.titulo} at={24} size={e.titulo.length > 22 ? 112 : 140} />
          {/* destello que recorre el título */}
          <div
            style={{
              position: 'absolute',
              inset: '-10% -5%',
              background: `linear-gradient(105deg, transparent ${flare * 100 - 12}%, rgba(255,255,255,0.55) ${flare * 100}%, transparent ${flare * 100 + 12}%)`,
              mixBlendMode: 'overlay',
              pointerEvents: 'none',
            }}
          />
        </div>
        {e.subtitulo && (
          <div
            style={{
              marginTop: 30,
              fontFamily: F.body,
              fontWeight: 400,
              fontSize: 38,
              color: C.textSoft,
              letterSpacing: '-0.005em',
              opacity: sub,
              transform: `translateY(${(1 - sub) * 18}px)`,
              filter: `blur(${(1 - sub) * 6}px)`,
            }}
          >
            {e.subtitulo}
          </div>
        )}
      </div>

      {/* barras cinematográficas */}
      <div style={{ position: 'absolute', left: 0, right: 0, top: 0, height: 540 * (1 - open), background: '#000' }} />
      <div style={{ position: 'absolute', left: 0, right: 0, bottom: 0, height: 540 * (1 - open), background: '#000' }} />
      <div
        style={{
          position: 'absolute',
          left: '50%',
          top: 540 - 1 - (1 - open) * 0,
          width: 1920 * line,
          marginLeft: -960 * line,
          height: 2,
          background: `linear-gradient(90deg, transparent, ${C.accent} 30%, #fff 50%, ${C.accent} 70%, transparent)`,
          boxShadow: glow(C.accent, 1.2),
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
        <div style={{ marginTop: 26, fontFamily: F.body, fontSize: 36, color: C.textSoft, opacity: sub, transform: `translateY(${(1 - sub) * 16}px)` }}>{e.subtitulo}</div>
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
            bottom: 178,
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
