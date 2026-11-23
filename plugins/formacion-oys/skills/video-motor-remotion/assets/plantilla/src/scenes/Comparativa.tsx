import React from 'react';
import { AbsoluteFill, interpolate, useCurrentFrame, useVideoConfig } from 'remotion';
import type { Comparativa as CompT } from '../types';
import { C, F, glow, glass, hexA } from '../theme';
import { clamp, enterAt, useTiempos } from '../lib/scene';
import { Icon } from '../components/Icons';
import { SceneTitle } from '../components/ui';

const MARCAS: Record<string, { icono: string; color: string; texto: string }> = {
  mejora: { icono: 'arriba', color: C.ok, texto: 'Mejora' },
  nuevo: { icono: 'mas', color: C.accent, texto: 'Nuevo' },
  igual: { icono: 'igual', color: '#9AA7C7', texto: 'Igual' },
  eliminado: { icono: 'cruz', color: C.danger, texto: 'Eliminado' },
  cambio: { icono: 'cambio', color: C.accent2, texto: 'Cambia' },
};

const COL_W = 720;
const MID = 140;
const X_ANTES = (1920 - (COL_W * 2 + MID)) / 2;
const X_AHORA = X_ANTES + COL_W + MID;

export const Comparativa: React.FC<{ e: CompT }> = ({ e }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const t = useTiempos(e.filas, { inicio: 1.2, paso: 1.4 });
  const n = e.filas.length;
  const top = 340;
  const avail = 1080 - 200 - top;
  const rowGap = 16;
  const rowH = Math.min(118, (avail - rowGap * (n - 1)) / n);
  const head = enterAt(frame, 6, fps);
  const lblAntes = e.etiquetas?.antes ?? 'Antes';
  const lblAhora = e.etiquetas?.ahora ?? 'Ahora';

  return (
    <AbsoluteFill>
      <SceneTitle kicker={e.etiqueta ?? 'Antes vs Ahora'} title={e.titulo} />
      {/* cabeceras de columna */}
      {[
        { x: X_ANTES, txt: lblAntes, icono: 'reloj', color: '#9AA7C7' },
        { x: X_AHORA, txt: lblAhora, icono: 'rayo', color: C.accent },
      ].map((h, i) => (
        <div
          key={i}
          style={{
            position: 'absolute',
            left: h.x,
            top: 262,
            width: COL_W,
            display: 'flex',
            alignItems: 'center',
            gap: 14,
            opacity: head,
            transform: `translateY(${(1 - head) * 14}px)`,
          }}
        >
          <Icon name={h.icono} size={26} color={h.color} />
          <span style={{ fontFamily: F.mono, fontSize: 20, letterSpacing: '0.26em', textTransform: 'uppercase', color: h.color }}>{h.txt}</span>
          <div style={{ flex: 1, height: 1, background: `linear-gradient(90deg, ${hexA(h.color, 0.5)}, transparent)` }} />
        </div>
      ))}
      {/* eje central */}
      <div
        style={{
          position: 'absolute',
          left: 960 - 1,
          top: top - 10,
          width: 2,
          height: (rowH + rowGap) * n * interpolate(frame, [8, 30], [0, 1], clamp),
          background: `linear-gradient(180deg, ${hexA(C.accent, 0.5)}, ${hexA(C.accent2, 0.2)}, transparent)`,
        }}
      />
      {e.filas.map((f, i) => {
        const y = top + i * (rowH + rowGap);
        const pa = enterAt(frame, t[i], fps, { damping: 18 });
        const pb = enterAt(frame, t[i] + 10, fps, { damping: 16, stiffness: 130 });
        const pm = enterAt(frame, t[i] + 16, fps, { damping: 10, stiffness: 160 });
        const m = MARCAS[f.marca ?? 'mejora'] ?? MARCAS.mejora;
        const lit = interpolate(frame, [t[i] + 10, t[i] + 22, t[i] + 60], [0, 1, 0.35], clamp);
        return (
          <React.Fragment key={i}>
            {/* antes */}
            <div
              style={{
                position: 'absolute',
                left: X_ANTES,
                top: y,
                width: COL_W,
                height: rowH,
                borderRadius: 18,
                background: 'rgba(30,36,54,0.5)',
                border: `1px solid ${hexA('#9AA7C7', 0.16)}`,
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                padding: '0 28px',
                opacity: interpolate(pa, [0, 0.3], [0, 1], clamp),
                transform: `translateX(${(1 - pa) * -40}px)`,
              }}
            >
              {f.aspecto && <span style={{ fontFamily: F.mono, fontSize: 15, letterSpacing: '0.18em', textTransform: 'uppercase', color: C.textMute, marginBottom: 6 }}>{f.aspecto}</span>}
              <span
                style={{
                  fontFamily: F.body,
                  fontSize: 28,
                  color: hexA('#C8D2F0', 0.7),
                  textDecoration: f.marca === 'eliminado' ? 'line-through' : 'none',
                  textDecorationColor: hexA(C.danger, 0.7),
                }}
              >
                {f.antes || '—'}
              </span>
            </div>
            {/* ahora */}
            <div
              style={{
                ...glass({ borderRadius: 18 }),
                position: 'absolute',
                left: X_AHORA,
                top: y,
                width: COL_W,
                height: rowH,
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                padding: '0 28px',
                opacity: interpolate(pb, [0, 0.3], [0, 1], clamp),
                transform: `translateX(${(1 - pb) * 40}px)`,
                border: `1px solid ${hexA(m.color, 0.2 + 0.5 * lit)}`,
                boxShadow: lit > 0.4 ? glow(m.color, 0.35 * lit) : glass().boxShadow,
              }}
            >
              {f.aspecto && <span style={{ fontFamily: F.mono, fontSize: 15, letterSpacing: '0.18em', textTransform: 'uppercase', color: hexA(m.color, 0.85), marginBottom: 6 }}>{f.aspecto}</span>}
              <span style={{ fontFamily: F.body, fontWeight: 600, fontSize: 28, color: C.text }}>{f.ahora || '—'}</span>
            </div>
            {/* marca de diferencia */}
            <div
              style={{
                position: 'absolute',
                left: 960 - 30,
                top: y + rowH / 2 - 30,
                width: 60,
                height: 60,
                borderRadius: '50%',
                background: `radial-gradient(circle at 35% 30%, ${hexA(m.color, 0.55)}, ${hexA(m.color, 0.18)})`,
                border: `1.5px solid ${m.color}`,
                boxShadow: glow(m.color, 0.6),
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                transform: `scale(${pm})`,
              }}
            >
              <Icon name={m.icono} size={28} color="#fff" stroke={2.4} />
            </div>
          </React.Fragment>
        );
      })}
    </AbsoluteFill>
  );
};
