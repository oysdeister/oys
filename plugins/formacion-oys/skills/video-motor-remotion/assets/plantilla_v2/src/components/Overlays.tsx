import React, { useMemo } from 'react';
import { interpolate, useCurrentFrame, useVideoConfig } from 'remotion';
import type { Plan } from '../lib/plan';
import type { Word } from '../types';
import { C, F, glow, hexA } from '../theme';
import { clamp } from '../lib/scene';
import { Logo } from './Icons';
import type { Pantalla as PantallaT } from '../types';
import { zonasPantalla } from '../lib/pantalla';

// ---------- Subtítulos karaoke ----------
type Chunk = { words: Word[]; start: number; end: number };

/** Grafía en pantalla de lo que la voz lee fonéticamente («O y ese» → «O&S»). */
function fixGrafia(ws: Word[]): Word[] {
  const out: Word[] = [];
  for (let i = 0; i < ws.length; i++) {
    const m = ws[i + 2]?.w.match(/^ese([.,;:!?»]*)$/i);
    if (ws[i].w === 'O' && ws[i + 1]?.w === 'y' && m) {
      out.push({ ...ws[i], w: 'O&S' + m[1], d: ws[i + 2].o + ws[i + 2].d - ws[i].o });
      i += 2;
    } else out.push(ws[i]);
  }
  return out;
}

function chunkWords(words0: Word[], maxWords = 8, maxChars = 46): Chunk[] {
  const words = fixGrafia(words0);
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

/** Fracción (0-1) de «conflicto» entre los subtítulos y las marcas de una escena pantalla, suavizada en ±8 fotogramas.
 *  abajo: hay una marca en la franja inferior; arriba: también la hay en la superior. */
/** Fracción (0-1) de fotogramas en ±8 en que alguna marca de la pantalla activa cumple «test». */
export function zonaOcupada(plan: Plan, frame: number, fps: number, test: (z: { x: number; y: number; w: number; h: number }) => boolean): number {
  const it = plan.items.find((x) => frame >= x.from && frame < x.from + x.dur && x.escena.tipo === 'pantalla');
  if (!it) return 0;
  let k = 0;
  let n = 0;
  for (let d = -8; d <= 8; d += 2) {
    if (zonasPantalla(it.escena as PantallaT, it.words, it.lead, fps, it.dur, frame + d - it.from).some(test)) k++;
    n++;
  }
  return k / n;
}

function conflicto(plan: Plan, frame: number, fps: number): { abajo: number; arriba: number } {
  const it = plan.items.find((x) => frame >= x.from && frame < x.from + x.dur && x.escena.tipo === 'pantalla');
  if (!it) return { abajo: 0, arriba: 0 };
  let ab = 0;
  let ar = 0;
  let n = 0;
  for (let d = -8; d <= 8; d += 2) {
    const zs = zonasPantalla(it.escena as PantallaT, it.words, it.lead, fps, it.dur, frame + d - it.from);
    if (zs.some((z) => z.y + z.h > SUB_TOP_ABAJO)) ab++;
    if (zs.some((z) => z.y < SUB_BOTTOM_ARRIBA)) ar++;
    n++;
  }
  return { abajo: ab / n, arriba: ar / n };
}
const SUB_TOP_ABAJO = 1080 - 150;
const SUB_BOTTOM_ARRIBA = 170;

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

  const cf = conflicto(plan, frame, fps);
  const arriba = cf.abajo; // 0 = abajo, 1 = arriba
  const atenua = 1 - 0.6 * Math.min(cf.abajo, cf.arriba);

  const caja = (pos: React.CSSProperties, o: number) => (
    <div style={{ position: 'absolute', left: 0, right: 0, ...pos, display: 'flex', justifyContent: 'center', pointerEvents: 'none', opacity: o }}>
      <div
        style={{
          opacity: op,
          transform: `translateY(${(1 - inP) * 8}px)`,
          padding: '9px 22px 11px',
          borderRadius: 14,
          background: 'rgba(7,10,20,0.86)',
          border: `1px solid ${hexA('#9fb4ff', 0.16)}`,
          boxShadow: '0 12px 36px rgba(0,0,0,0.45)',
          maxWidth: 1240,
          fontFamily: F.body,
          fontWeight: 600,
          fontSize: 30,
          lineHeight: 1.25,
          textAlign: 'center',
        }}
      >
        {chunk.words.map((w, i) => {
          const isNow = ms >= w.o - 30 && ms < (chunk.words[i + 1]?.o ?? w.o + w.d + 200) - 30;
          const said = ms >= w.o + w.d;
          const p = interpolate(ms, [w.o - 60, w.o + 60], [0, 1], clamp);
          return (
            <span key={i} style={{ position: 'relative', display: 'inline-block', marginRight: i < chunk.words.length - 1 ? '0.26em' : 0 }}>
              <span style={{ color: isNow ? '#FFFFFF' : said || p > 0.5 ? hexA('#EEF2FF', 0.95) : hexA('#C8D2F0', 0.5) }}>{w.w}</span>
              {isNow && (
                <span
                  style={{
                    position: 'absolute',
                    left: -3,
                    right: -3,
                    bottom: -3,
                    height: 3,
                    borderRadius: 3,
                    background: `linear-gradient(90deg, ${C.accent}, ${C.accent2})`,
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

  return (
    <>
      {arriba < 0.999 && caja({ bottom: 40 }, (1 - arriba) * atenua)}
      {arriba > 0.001 && caja({ top: 62 }, arriba * atenua)}
    </>
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
  // durante las escenas «pantalla» el capítulo va en la barra del navegador: aquí se oculta
  let enPantalla = 0;
  for (const it of plan.items) {
    if (it.escena.tipo !== 'pantalla') continue;
    const a = it.from + Math.min(it.trans, 12);
    const b = it.from + it.dur;
    enPantalla = Math.max(enPantalla, Math.min(interpolate(frame, [it.from, a], [0, 1], clamp), interpolate(frame, [b - 12, b], [1, 0], clamp)));
  }
  const vis2 = vis * (1 - enPantalla);
  if (vis2 <= 0.01) return null;
  const curI = Math.max(0, chapters.findIndex((c) => frame >= c.from && frame < c.to));
  const cur = chapters[curI];
  const totalW = 560;
  const span = last - first;

  return (
    <div style={{ position: 'absolute', top: 40, left: 120, right: 120, height: 44, display: 'flex', alignItems: 'center', opacity: vis2, transform: `translateY(${(1 - vis) * -16}px)` }}>
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
