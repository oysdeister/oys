import { loadFont as loadDisplay } from '@remotion/google-fonts/SpaceGrotesk';
import { loadFont as loadBody } from '@remotion/google-fonts/Inter';
import { loadFont as loadMono } from '@remotion/google-fonts/JetBrainsMono';

const display = loadDisplay('normal', { weights: ['400', '500', '600', '700'], subsets: ['latin', 'latin-ext'] });
const body = loadBody('normal', { weights: ['400', '500', '600', '700'], subsets: ['latin', 'latin-ext'] });
const mono = loadMono('normal', { weights: ['400', '500', '700'], subsets: ['latin', 'latin-ext'] });

/** Tokens de diseño. Paleta «tinta + eléctrico»: fondo casi negro azulado,
 *  acento cian eléctrico, secundario violeta, y semánticos ámbar / coral / menta. */
export const theme = {
  font: {
    display: `${display.fontFamily}, system-ui, sans-serif`,
    body: `${body.fontFamily}, system-ui, sans-serif`,
    mono: `${mono.fontFamily}, ui-monospace, monospace`,
  },
  color: {
    ink: '#05070D',
    ink2: '#0A0E1A',
    ink3: '#111829',
    text: '#EEF2FF',
    textSoft: 'rgba(226,232,255,0.72)',
    textMute: 'rgba(200,210,240,0.46)',
    line: 'rgba(160,180,255,0.14)',
    lineStrong: 'rgba(160,190,255,0.28)',
    glass: 'rgba(22,30,52,0.55)',
    glassHi: 'rgba(40,52,88,0.55)',
    accent: '#2EE6FF', // cian eléctrico
    accent2: '#7C5CFF', // violeta
    accent3: '#FF4FD8', // magenta (destellos)
    ok: '#4FDDBF',
    brand: '#5BC2AE', // turquesa del arco O&S
    warn: '#FFB547',
    danger: '#FF5470',
  },
  radius: { s: 12, m: 20, l: 28, xl: 40 },
  // safe-area: barra arriba, subtítulos abajo
  safe: { top: 120, bottom: 190, side: 120 },
  fps: 30,
  width: 1920,
  height: 1080,
} as const;

export const C = theme.color;
export const F = theme.font;

export const glow = (color: string, k = 1) =>
  `0 0 ${18 * k}px ${color}55, 0 0 ${48 * k}px ${color}33, 0 0 ${96 * k}px ${color}1f`;

/** Vidrio esmerilado discreto. */
export const glass = (extra: React.CSSProperties = {}): React.CSSProperties => ({
  background: `linear-gradient(160deg, rgba(48,62,104,0.42) 0%, rgba(16,22,40,0.62) 60%, rgba(12,16,30,0.7) 100%)`,
  border: `1px solid ${C.line}`,
  boxShadow: `inset 0 1px 0 rgba(255,255,255,0.07), 0 30px 80px rgba(0,0,0,0.45)`,
  backdropFilter: 'blur(18px) saturate(140%)',
  WebkitBackdropFilter: 'blur(18px) saturate(140%)',
  borderRadius: theme.radius.l,
  ...extra,
});

export const hexA = (hex: string, a: number) => {
  const h = hex.replace('#', '');
  const n = parseInt(h, 16);
  return `rgba(${(n >> 16) & 255},${(n >> 8) & 255},${n & 255},${a})`;
};
