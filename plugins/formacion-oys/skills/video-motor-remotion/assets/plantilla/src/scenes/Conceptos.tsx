import React from 'react';
import { AbsoluteFill, interpolate, useCurrentFrame, useVideoConfig } from 'remotion';
import type { Conceptos as ConceptosT } from '../types';
import { C, F, glow, glass, hexA } from '../theme';
import { clamp, enterAt, useTiempos } from '../lib/scene';
import { IconBadge, SceneTitle } from '../components/ui';

const PALETA = [C.accent, C.accent2, '#4DA3FF', C.accent3, C.ok, C.warn];

export const Conceptos: React.FC<{ e: ConceptosT }> = ({ e }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const n = e.items.length;
  const t = useTiempos(e.items, { inicio: 1, paso: 1.2 });
  const lista = e.disposicion === 'lista';
  const cols = lista ? 1 : n <= 2 ? n : n === 4 ? 2 : 3;
  const rows = Math.ceil(n / cols);
  const top = e.subtitulo ? 330 : 300;
  const areaH = 1080 - 200 - top;
  const gapX = 36;
  const gapY = 30;
  const cardW = lista ? 1300 : (1680 - gapX * (cols - 1)) / cols;
  const cardH = Math.min(lista ? 120 : 250, (areaH - gapY * (rows - 1)) / rows);
  const left = (1920 - (cardW * cols + gapX * (cols - 1))) / 2;

  let activo = -1;
  t.forEach((f, i) => frame >= f && (activo = i));

  return (
    <AbsoluteFill>
      <SceneTitle kicker={e.etiqueta ?? 'Conceptos'} title={e.titulo} sub={e.subtitulo} />
      {e.items.map((it, i) => {
        const c = i % cols;
        const r = Math.floor(i / cols);
        const x = left + c * (cardW + gapX);
        const y = top + r * (cardH + gapY);
        const p = enterAt(frame, t[i], fps, { damping: 15, stiffness: 120 });
        const ghost = enterAt(frame, 4 + i * 3, fps);
        const isAct = i === activo;
        const col = PALETA[i % PALETA.length];
        const sweep = interpolate(frame, [t[i], t[i] + 22], [-30, 130], clamp);
        return (
          <React.Fragment key={i}>
            {/* hueco anticipado */}
            <div
              style={{
                position: 'absolute',
                left: x,
                top: y,
                width: cardW,
                height: cardH,
                borderRadius: 26,
                border: `1.5px dashed ${hexA('#9fb4ff', 0.16)}`,
                opacity: ghost * (1 - p),
              }}
            />
            <div
              style={{
                ...glass({ borderRadius: 26 }),
                position: 'absolute',
                left: x,
                top: y,
                width: cardW,
                height: cardH,
                padding: lista ? '0 34px' : '0 40px',
                display: 'flex',
                alignItems: 'center',
                gap: 32,
                overflow: 'hidden',
                opacity: interpolate(p, [0, 0.35], [0, 1], clamp) * (activo > i ? 0.78 : 1),
                transform: `translateY(${(1 - p) * 50}px) scale(${0.95 + 0.05 * p})`,
                border: `1px solid ${isAct ? hexA(col, 0.65) : C.line}`,
                boxShadow: isAct ? `${glow(col, 0.45)}, inset 0 1px 0 rgba(255,255,255,0.1)` : glass().boxShadow,
              }}
            >
              {/* destello de entrada */}
              <div
                style={{
                  position: 'absolute',
                  top: 0,
                  bottom: 0,
                  width: '25%',
                  left: `${sweep}%`,
                  background: `linear-gradient(90deg, transparent, ${hexA(col, 0.18)}, transparent)`,
                  transform: 'skewX(-18deg)',
                }}
              />
              {/* barra de color lateral */}
              <div style={{ position: 'absolute', left: 0, top: 24, bottom: 24, width: 4, borderRadius: 4, background: col, opacity: isAct ? 1 : 0.35, boxShadow: isAct ? glow(col, 0.5) : 'none' }} />
              <IconBadge name={it.icono} size={lista ? 72 : 104} on={interpolate(frame, [t[i], t[i] + 12], [0, 1], clamp) * (isAct ? 1 : 0.6)} color={col} color2={C.accent2} />
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ display: 'flex', alignItems: 'baseline', gap: 14 }}>
                  <span style={{ fontFamily: F.mono, fontSize: 16, color: isAct ? col : C.textMute, letterSpacing: '0.16em' }}>{String(i + 1).padStart(2, '0')}</span>
                  <span style={{ fontFamily: F.display, fontWeight: 600, fontSize: lista ? 38 : 46, letterSpacing: '-0.02em', color: C.text }}>{it.titulo}</span>
                </div>
                {it.texto && <div style={{ fontFamily: F.body, fontSize: lista ? 26 : 29, lineHeight: 1.35, color: C.textSoft, marginTop: 10 }}>{it.texto}</div>}
              </div>
            </div>
          </React.Fragment>
        );
      })}
    </AbsoluteFill>
  );
};
