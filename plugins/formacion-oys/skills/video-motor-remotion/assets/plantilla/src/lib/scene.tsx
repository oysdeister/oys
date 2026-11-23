import React, { createContext, useContext, useMemo } from 'react';
import { Easing, interpolate, spring, useCurrentFrame, useVideoConfig } from 'remotion';
import type { Cuando, Word } from '../types';
import { findClave } from './plan';

type SceneCtx = { words: Word[]; lead: number; dur: number; index: number };
const Ctx = createContext<SceneCtx>({ words: [], lead: 15, dur: 300, index: 0 });

export const SceneProvider: React.FC<{ value: SceneCtx; children: React.ReactNode }> = ({ value, children }) => (
  <Ctx.Provider value={value}>{children}</Ctx.Provider>
);
export const useScene = () => useContext(Ctx);

/** Convierte una lista de «Cuando» en fotogramas de escena (en orden).
 *  Sin t ni clave (o clave no encontrada) → escalonado desde «inicio» cada «paso» s. */
export function useTiempos(list: Cuando[], opts: { inicio?: number; paso?: number } = {}): number[] {
  const { words, lead } = useScene();
  const { fps } = useVideoConfig();
  return useMemo(() => {
    const inicio = opts.inicio ?? 0.6;
    const paso = opts.paso ?? 0.5;
    let cursor = 0;
    let last = -Infinity;
    return list.map((c, i) => {
      if (typeof c.t === 'number') return (last = Math.round(c.t * fps));
      if (c.clave) {
        const idx = findClave(words, c.clave, cursor);
        if (idx >= 0) {
          cursor = idx + 1;
          return (last = lead + Math.round((words[idx].o / 1000) * fps));
        }
      }
      const f = Math.round((inicio + i * paso) * fps);
      return (last = Math.max(f, last + Math.round(paso * fps)));
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [JSON.stringify(list), words, lead, fps, opts.inicio, opts.paso]);
}

/** Spring 0→1 que arranca en el fotograma «at». */
export function useEnter(at = 0, cfg: { damping?: number; mass?: number; stiffness?: number; dur?: number } = {}) {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  return spring({
    frame: frame - at,
    fps,
    config: { damping: cfg.damping ?? 18, mass: cfg.mass ?? 0.9, stiffness: cfg.stiffness ?? 120 },
    durationInFrames: cfg.dur,
  });
}

export const enterAt = (frame: number, at: number, fps: number, cfg: { damping?: number; stiffness?: number; mass?: number } = {}) =>
  spring({ frame: frame - at, fps, config: { damping: cfg.damping ?? 18, mass: cfg.mass ?? 0.9, stiffness: cfg.stiffness ?? 120 } });

export const ease = Easing.bezier(0.22, 1, 0.36, 1);
export const easeInOut = Easing.bezier(0.65, 0, 0.35, 1);

export const clamp = { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' } as const;
export const lerp = (f: number, a: number, b: number, from: number, to: number, easing = ease) =>
  interpolate(f, [a, b], [from, to], { ...clamp, easing });

/** Salida suave en los últimos fotogramas de la escena (para elementos que no deben cortar en seco). */
export function useExit(frames = 12) {
  const frame = useCurrentFrame();
  const { dur } = useScene();
  return interpolate(frame, [dur - frames, dur], [1, 0], clamp);
}
