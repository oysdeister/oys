import React from 'react';
import { Composition, type CalculateMetadataFunction } from 'remotion';
import { Tutorial, calcDuration } from './Tutorial';
import type { Guion, Timing, TutorialProps } from './types';
import { buildPlan } from './lib/plan';
import guionJson from './data/guion.json';
import timingJson from './data/timing.json';
import demoJson from './data/demo.json';

const guion = guionJson as unknown as Guion;
const timing = timingJson as unknown as Timing;
const demo = demoJson as unknown as Guion;
const FPS = 30;

const calc: CalculateMetadataFunction<TutorialProps> = ({ props }) => ({
  durationInFrames: Math.max(1, calcDuration(props, FPS)),
});

/** Una composición con una sola escena del guion (para previsualizar y sacar stills). */
const una = (g: Guion, id: string): TutorialProps => ({
  guion: { ...g, escenas: g.escenas.filter((e) => e.id === id) },
  timing,
});

export const RemotionRoot: React.FC = () => (
  <>
    <Composition
      id="Tutorial"
      component={Tutorial}
      width={1920}
      height={1080}
      fps={FPS}
      durationInFrames={300}
      defaultProps={{ guion, timing }}
      calculateMetadata={calc}
    />
    {/* una composición por capítulo: Cap-01, Cap-02… (para iterar y renderizar por partes) */}
    {buildPlan(guion, timing, FPS).chapters.map((ch) => (
      <Composition
        key={`cap-${ch.numero}`}
        id={`Cap-${String(ch.numero).padStart(2, '0')}`}
        component={Tutorial}
        width={1920}
        height={1080}
        fps={FPS}
        durationInFrames={300}
        defaultProps={{ guion, timing, capitulo: ch.numero }}
        calculateMetadata={calc}
      />
    ))}
    {guion.escenas.map((e) => (
      <Composition
        key={e.id}
        id={`E-${e.id}`}
        component={Tutorial}
        width={1920}
        height={1080}
        fps={FPS}
        durationInFrames={300}
        defaultProps={una(guion, e.id)}
        calculateMetadata={calc}
      />
    ))}
    {demo.escenas.map((e) => (
      <Composition
        key={`d-${e.id}`}
        id={`D-${e.id}`}
        component={Tutorial}
        width={1920}
        height={1080}
        fps={FPS}
        durationInFrames={300}
        defaultProps={una(demo, e.id)}
        calculateMetadata={calc}
      />
    ))}
  </>
);
