import React from 'react';
import { AbsoluteFill, Easing, interpolate } from 'remotion';
import type { TransitionPresentation, TransitionPresentationComponentProps } from '@remotion/transitions';
import { linearTiming } from '@remotion/transitions';
import { fade } from '@remotion/transitions/fade';
import { slide } from '@remotion/transitions/slide';
import { wipe } from '@remotion/transitions/wipe';
import type { Transicion } from '../types';
import { C } from '../theme';

type P = Record<string, never>;
const cl = { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' } as const;

/** «Zoom-through»: la escena saliente se acerca y se desenfoca; la entrante llega desde el fondo. */
const ZoomThrough: React.FC<TransitionPresentationComponentProps<P>> = ({ children, presentationDirection, presentationProgress: p }) => {
  const entering = presentationDirection === 'entering';
  const style: React.CSSProperties = entering
    ? {
        transform: `scale(${interpolate(p, [0, 1], [0.78, 1])})`,
        opacity: interpolate(p, [0.15, 0.7], [0, 1], cl),
        filter: `blur(${interpolate(p, [0, 1], [14, 0])}px)`,
      }
    : {
        transform: `scale(${interpolate(p, [0, 1], [1, 1.55])})`,
        opacity: interpolate(p, [0, 0.65], [1, 0], cl),
        filter: `blur(${interpolate(p, [0, 1], [0, 18])}px)`,
      };
  return <AbsoluteFill style={style}>{children}</AbsoluteFill>;
};

/** «Barrido de luz»: un haz diagonal cruza la pantalla revelando la escena nueva. */
const LightSweep: React.FC<TransitionPresentationComponentProps<P>> = ({ children, presentationDirection, presentationProgress: p }) => {
  const e = interpolate(p, [0, 1], [-25, 125]); // posición del haz (%)
  const skew = 18;
  if (presentationDirection === 'exiting') {
    return (
      <AbsoluteFill style={{ clipPath: `polygon(${e + skew}% 0, 100% 0, 100% 100%, ${e}% 100%)`, opacity: interpolate(p, [0.7, 1], [1, 0.6], cl) }}>
        {children}
      </AbsoluteFill>
    );
  }
  return (
    <AbsoluteFill>
      <AbsoluteFill style={{ clipPath: `polygon(0 0, ${e + skew}% 0, ${e}% 100%, 0 100%)` }}>{children}</AbsoluteFill>
      {/* haz */}
      <AbsoluteFill style={{ pointerEvents: 'none', mixBlendMode: 'screen', opacity: interpolate(p, [0, 0.1, 0.9, 1], [0, 1, 1, 0]) }}>
        <div
          style={{
            position: 'absolute',
            top: '-10%',
            height: '120%',
            left: `${e + skew / 2}%`,
            width: 520,
            marginLeft: -260,
            transform: `skewX(${-Math.atan((skew / 100) * (1920 / 1080)) * (180 / Math.PI)}deg)`,
            background: `linear-gradient(90deg, transparent 0%, ${C.accent2}22 25%, ${C.accent}88 46%, #ffffff 50%, ${C.accent}88 54%, ${C.accent2}22 75%, transparent 100%)`,
            filter: 'blur(6px)',
          }}
        />
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

/** «Vuelo»: la cámara viaja por el espacio de un panel a otro (sale hacia la izquierda y hacia la cámara,
 *  el nuevo llega desde el fondo a la derecha). */
const FlyThrough: React.FC<TransitionPresentationComponentProps<P>> = ({ children, presentationDirection, presentationProgress: p }) => {
  const entering = presentationDirection === 'entering';
  const q = entering ? 1 - p : p; // 0 = en su sitio
  const style: React.CSSProperties = entering
    ? {
        transform: `translate3d(${q * 900}px, ${q * -60}px, ${q * -2200}px) rotateY(${q * -38}deg) rotateX(${q * 6}deg)`,
        opacity: interpolate(p, [0, 0.35], [0, 1], cl),
        filter: `blur(${q * 8}px)`,
      }
    : {
        transform: `translate3d(${q * -1300}px, ${q * 40}px, ${q * 700}px) rotateY(${q * 42}deg)`,
        opacity: interpolate(p, [0.45, 0.9], [1, 0], cl),
        filter: `blur(${q * 10}px)`,
      };
  return (
    <AbsoluteFill style={{ perspective: 1600, perspectiveOrigin: '50% 45%' }}>
      <AbsoluteFill style={{ ...style, transformStyle: 'preserve-3d' }}>{children}</AbsoluteFill>
    </AbsoluteFill>
  );
};

const flyThrough = (): TransitionPresentation<P> => ({ component: FlyThrough, props: {} as P });
const zoomThrough = (): TransitionPresentation<P> => ({ component: ZoomThrough, props: {} as P });
const lightSweep = (): TransitionPresentation<P> => ({ component: LightSweep, props: {} as P });

export function getTransition(tipo: Exclude<Transicion, 'auto'>, frames: number) {
  const timing = linearTiming({ durationInFrames: frames, easing: Easing.bezier(0.65, 0, 0.35, 1) });
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let presentation: TransitionPresentation<any>;
  switch (tipo) {
    case 'slide':
      presentation = slide({ direction: 'from-right' });
      break;
    case 'slide-arriba':
      presentation = slide({ direction: 'from-bottom' });
      break;
    case 'wipe':
      presentation = wipe({ direction: 'from-top-left' });
      break;
    case 'zoom':
      presentation = zoomThrough();
      break;
    case 'luz':
      presentation = lightSweep();
      break;
    case 'vuelo':
      presentation = flyThrough();
      break;
    default:
      presentation = fade();
  }
  return { timing, presentation };
}
