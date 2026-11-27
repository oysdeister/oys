import React, { useMemo } from 'react';
import { interpolate, useCurrentFrame, useVideoConfig } from 'remotion';
import type { Plan } from '../lib/plan';
import type { Word } from '../types';
import { C, F, glow, hexA } from '../theme';
import { clamp } from '../lib/scene';
import { Logo } from './Icons';

// ---------- Subtítulos karaoke ----------
type Chunk = { words: Word[]; start: number; end: number };

function chunkWords(words: Word[], maxWords = 8, maxChars = 46): Chunk[] {
  const out: Chunk[] = [];
  let cur: Word[] = [];
  const flush = () => {
    if (!cur.length) return;
    const last = cur[cur.length - 1];
    out.push({ words: cur, start: cur[0].o, end: last.o + last.d });
    cur = [];
  };
  words.forEach((w, i) => {
    cur.push(w);
    const chars = cur.map((x) => x.w).join(' ').length;
    const next = words[i + 1];
    const nextChars = next ? chars + 1 + next.w.length : 0;
    const fin = /[.!?…:]$/.test(w.w);
    const coma = /[,;]$/.test(w.w);
    const pausa = next ? next.o - (w.o + w.d) > 260 : true;
    if (fin || (coma && cur.length >= 4) || (pausa && cur.length >= 3) || cur.length >= maxWords || nextChars > maxChars) flush();
  });
  flush();
  // evita colas de una sola palabra
  for (let i = out.length - 1; i > 0; i--) {
    if (out[i].words.length === 1 && out[i - 1].words.length <= maxWords + 1 && !/[.!?…:]$/.test(out[i - 1].words[out[i - 1].words.length - 1].w)) {
      out[i - 1].words.push(...out[i].words);
      out[i - 1].end = out[i].end;
      out.splice(i, 1);
    }
  }
  return out;
}

export const Subtitles: React.FC<{ plan: Plan }> = ({ plan }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const chunked = useMemo(() => plan.items.map((it) => chunkWords(it.words)), [plan]);

  // escena con voz activa en este fotograma
  let active: { chunk: Chunk; ms: number; idx: number; chunkStartF: number; chunkEndF: number } | null = null;
  for (let i = 0; i < plan.items.length; i++) {
    const it = plan.items[i];
    if (!it.words.length) continue;
    const audioFrom = it.from + it.lead;
    const ms = ((frame - audioFrom) / fps) * 1000;
    if (ms < -200 || ms > it.durMs + 400) continue;
    const chunks = chunked[i];
    let ci = chunks.findIndex((c, k) => ms < (chunks[k + 1]?.start ?? Infinity) - 40);
    if (ci < 0) ci = chunks.length - 1;
    const c = chunks[ci];
    if (ms > c.end + 450) continue;
    active = {
      chunk: c,
      ms,
      idx: ci,
      chunkStartF: audioFrom + (c.start / 1000) * fps,
      chunkEndF: audioFrom + ((c.end + 450) / 1000) * fps,
    };
    break;
  }
  if (!active) return null;
  const { chunk, ms } = active;
  const inP = interpolate(frame, [active.chunkStartF - 6, active.chunkStartF + 2], [0, 1], clamp);
  const outP = interpolate(frame, [active.chunkEndF - 6, active.chunkEndF], [1, 0], clamp);
  const op = Math.min(inP, outP);

  return (
    <div style={{ position: 'absolute', left: 0, right: 0, bottom: 58, display: 'flex', justifyContent: 'center', pointerEvents: 'none' }}>
      <div
        key={active.idx}
        style={{
          opacity: op,
          transform: `translateY(${(1 - inP) * 10}px)`,
          padding: '16px 30px 18px',
          borderRadius: 20,
          background: 'linear-gradient(180deg, rgba(10,14,26,0.78), rgba(6,9,18,0.82))',
          border: `1px solid ${hexA('#9fb4ff', 0.14)}`,
          boxShadow: '0 20px 60px rgba(0,0,0,0.5), inset 0 1px 0 rgba(255,255,255,0.06)',
          backdropFilter: 'blur(14px)',
          maxWidth: 1500,
          fontFamily: F.body,
          fontWeight: 600,
          fontSize: 38,
          lineHeight: 1.25,
          letterSpacing: '-0.005em',
          textAlign: 'center',
        }}
      >
        {chunk.words.map((w, i) => {
          const isNow = ms >= w.o - 30 && ms < (chunk.words[i + 1]?.o ?? w.o + w.d + 200) - 30;
          const said = ms >= w.o + w.d;
          const p = interpolate(ms, [w.o - 60, w.o + 60], [0, 1], clamp);
          return (
            <span key={i} style={{ position: 'relative', display: 'inline-block', marginRight: i < chunk.words.length - 1 ? '0.28em' : 0 }}>
              <span
                style={{
                  color: isNow ? '#FFFFFF' : said || p > 0.5 ? hexA('#EEF2FF', 0.96) : hexA('#C8D2F0', 0.42),
                  textShadow: isNow ? `0 0 18px ${hexA(C.accent, 0.8)}` : 'none',
                }}
              >
                {w.w}
              </span>
              {isNow && (
                <span
                  style={{
                    position: 'absolute',
                    left: -4,
                    right: -4,
                    bottom: -4,
                    height: 4,
                    borderRadius: 4,
                    background: `linear-gradient(90deg, ${C.accent}, ${C.accent2})`,
                    boxShadow: glow(C.accent, 0.5),
                    transform: `scaleX(${interpolate(ms, [w.o, w.o + Math.max(120, w.d)], [0.2, 1], clamp)})`,
                    transformOrigin: 'left',
                  }}
                />
              )}
            </span>
          );
        })}
      </div>
    </div>
  );
};

// ---------- Barra de progreso por capítulos ----------
export const ProgressBar: React.FC<{ plan: Plan; marca?: string }> = ({ plan, marca }) => {
  const frame = useCurrentFrame();
  const { chapters } = plan;
  if (!chapters.length) return null;
  const first = chapters[0].from;
  const last = chapters[chapters.length - 1].to;
  const vis = Math.min(interpolate(frame, [first + 10, first + 30], [0, 1], clamp), interpolate(frame, [last - 10, last + 8], [1, 0], clamp));
  if (vis <= 0) return null;
  const curI = Math.max(0, chapters.findIndex((c) => frame >= c.from && frame < c.to));
  const cur = chapters[curI];
  const totalW = 560;
  const span = last - first;

  return (
    <div style={{ position: 'absolute', top: 40, left: 120, right: 120, height: 44, display: 'flex', alignItems: 'center', opacity: vis, transform: `translateY(${(1 - vis) * -16}px)` }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
        <Logo size={30} />
        {marca && <span style={{ fontFamily: F.mono, fontSize: 15, letterSpacing: '0.22em', color: C.textMute, textTransform: 'uppercase' }}>{marca}</span>}
      </div>
      <div style={{ flex: 1 }} />
      <div style={{ display: 'flex', alignItems: 'center', gap: 22 }}>
        <div style={{ textAlign: 'right', overflow: 'hidden', height: 26 }}>
          <div key={curI} style={{ fontFamily: F.body, fontSize: 19, fontWeight: 500, color: C.textSoft, whiteSpace: 'nowrap' }}>
            <span style={{ fontFamily: F.mono, color: C.accent, marginRight: 10, letterSpacing: '0.1em' }}>
              {String(cur.numero).padStart(2, '0')}/{String(chapters.length).padStart(2, '0')}
            </span>
            {cur.titulo}
          </div>
        </div>
        <div style={{ display: 'flex', gap: 6, width: totalW }}>
          {chapters.map((c, i) => {
            const w = ((c.to - c.from) / span) * (totalW - 6 * (chapters.length - 1));
            const p = interpolate(frame, [c.from, c.to], [0, 1], clamp);
            const isCur = i === curI;
            return (
              <div key={i} style={{ width: Math.max(24, w), height: 5, borderRadius: 5, background: hexA('#9fb4ff', 0.14), overflow: 'hidden', position: 'relative' }}>
                <div
                  style={{
                    position: 'absolute',
                    inset: 0,
                    width: `${p * 100}%`,
                    borderRadius: 5,
                    background: isCur ? `linear-gradient(90deg, ${C.accent2}, ${C.accent})` : hexA(C.accent, 0.55),
                    boxShadow: isCur ? glow(C.accent, 0.35) : 'none',
                  }}
                />
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
