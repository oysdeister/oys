import React, { useMemo } from 'react';
import { AbsoluteFill, Audio, Sequence, staticFile, useVideoConfig } from 'remotion';
import { TransitionSeries } from '@remotion/transitions';
import type { Escena, TutorialProps } from './types';
import { buildPlan, type Plan, type PlanItem } from './lib/plan';
import { SceneProvider } from './lib/scene';
import { getTransition } from './lib/transitions';
import { Background, Finish } from './components/Background';
import { ProgressBar, Subtitles } from './components/Overlays';
import { BrandProvider, Watermark, normMarca } from './components/Brand';
import { Portada, Cierre } from './scenes/Portada';
import { Capitulo } from './scenes/Capitulo';
import { Flujo } from './scenes/Flujo';
import { Pantalla } from './scenes/Pantalla';
import { Conceptos } from './scenes/Conceptos';
import { Estructura } from './scenes/Estructura';
import { Tip } from './scenes/Tip';
import { Comparativa } from './scenes/Comparativa';
import { Resumen } from './scenes/Resumen';
import { Calculo } from './scenes/Calculo';

export const SceneSwitch: React.FC<{ e: Escena; chapterNo: number }> = ({ e, chapterNo }) => {
  switch (e.tipo) {
    case 'portada':
      return <Portada e={e} />;
    case 'capitulo':
      return <Capitulo e={e} numero={chapterNo} />;
    case 'flujo':
      return <Flujo e={e} />;
    case 'pantalla':
      return <Pantalla e={e} />;
    case 'conceptos':
      return <Conceptos e={e} />;
    case 'estructura':
      return <Estructura e={e} />;
    case 'tip':
    case 'cuidado':
      return <Tip e={e} />;
    case 'comparativa':
      return <Comparativa e={e} />;
    case 'resumen':
      return <Resumen e={e} />;
    case 'calculo':
      return <Calculo e={e} />;
    case 'cierre':
      return <Cierre e={e} />;
    default:
      return null;
  }
};

const SceneSlot: React.FC<{ it: PlanItem; plan: Plan }> = ({ it, plan }) => {
  const ch = it.chapter !== null ? plan.chapters[it.chapter] : undefined;
  const cap = ch ? { numero: ch.numero, titulo: ch.titulo, total: plan.chapters.length } : undefined;
  return (
  <SceneProvider value={{ words: it.words, lead: it.lead, dur: it.dur, index: it.index, cap }}>
    <AbsoluteFill>
      <SceneSwitch e={it.escena} chapterNo={(it.chapter ?? 0) + 1} />
    </AbsoluteFill>
  </SceneProvider>
  );
};

export const Tutorial: React.FC<TutorialProps> = ({ guion, timing, capitulo }) => {
  const { fps } = useVideoConfig();
  const plan = useMemo(() => buildPlan(guion, timing, fps), [guion, timing, fps]);
  const subs = guion.config?.subtitulos !== false;

  const rango = chapterRange(plan, capitulo);

  return (
    <AbsoluteFill style={{ background: '#05070D' }}>
      <BrandProvider marca={normMarca(guion.config?.marca)}>
        <Sequence from={-rango.from} layout="none">
          <TutorialBody plan={plan} guion={guion} subs={subs} />
        </Sequence>
      </BrandProvider>
    </AbsoluteFill>
  );
};

/** Tramo a renderizar: todo o solo un capítulo (1, 2…). */
const chapterRange = (plan: Plan, capitulo?: number) => {
  if (!capitulo) return { from: 0, to: plan.total };
  const ch = plan.chapters.find((c) => c.numero === capitulo) ?? plan.chapters[capitulo - 1];
  return ch ? { from: ch.renderFrom, to: ch.renderTo } : { from: 0, to: plan.total };
};

const TutorialBody: React.FC<{ plan: Plan; guion: TutorialProps['guion']; subs: boolean }> = ({ plan, guion, subs }) => {
  const { fps } = useVideoConfig();
  return (
    <AbsoluteFill>
      <Background />
      <TransitionSeries>
        {plan.items.map((it, i) => {
          const tr = i > 0 && it.trans > 0 ? getTransition(it.transTipo, it.trans) : null;
          return (
            <React.Fragment key={it.escena.id}>
              {tr && <TransitionSeries.Transition presentation={tr.presentation} timing={tr.timing} />}
              <TransitionSeries.Sequence durationInFrames={it.dur} name={`${it.escena.tipo} · ${it.escena.id}`}>
                <SceneSlot it={it} plan={plan} />
              </TransitionSeries.Sequence>
            </React.Fragment>
          );
        })}
      </TransitionSeries>
      {plan.items
        .filter((it) => it.hasAudio)
        .map((it) =>
          it.audioTramos.length <= 1 ? (
            <Sequence key={`a-${it.escena.id}`} from={it.from + it.lead} durationInFrames={Math.ceil((it.durMs / 1000) * fps) + 6} name={`voz · ${it.escena.id}`}>
              <Audio src={staticFile(`audio/${it.escena.id}.mp3`)} />
            </Sequence>
          ) : (
            // voz con huecos: un <Audio> por tramo, cada uno retrasado por los silencios anteriores
            it.audioTramos.map(([a, b, r], k) => {
              const fa = Math.round((a / 1000) * fps);
              const fb = Math.round((b / 1000) * fps);
              const last = k === it.audioTramos.length - 1;
              const len = Math.max(1, fb - fa + (last ? 6 : 0));
              return (
                <Sequence key={`a-${it.escena.id}-${k}`} from={it.from + it.lead + fa + Math.round((r / 1000) * fps)} durationInFrames={len} name={`voz · ${it.escena.id} · ${k + 1}`}>
                  <Audio src={staticFile(`audio/${it.escena.id}.mp3`)} startFrom={fa} endAt={last ? undefined : fb} />
                </Sequence>
              );
            })
          ),
        )}
      <ProgressBar plan={plan} marca={guion.titulo ?? normMarca(guion.config?.marca)?.texto} />
      <Watermark plan={plan} />
      {subs && <Subtitles plan={plan} />}
      <Finish />
    </AbsoluteFill>
  );
};

export const calcDuration = (p: TutorialProps, fps = 30) => {
  const r = chapterRange(buildPlan(p.guion, p.timing, fps), p.capitulo);
  return r.to - r.from;
};
