import { memo } from 'react';

/** Generador pseudoaleatorio con semilla: el cielo es siempre el mismo */
function rng(seed: number) {
  let s = seed;
  return () => {
    s = (s * 16807) % 2147483647;
    return (s - 1) / 2147483646;
  };
}

const r = rng(20261116);
const ESTRELLAS = Array.from({ length: 190 }, (_, i) => ({
  x: r() * 1600,
  y: r() * 1000,
  rad: r() < 0.08 ? 1.6 + r() * 0.9 : 0.5 + r() * 0.8,
  o: 0.25 + r() * 0.65,
  tw: i % 9 === 0,
  d: (r() * 6).toFixed(2),
}));

/** Fondo global: cielo azul profundo, estrellas, estelas orbitales finas, el arco O&S y viñeteado */
export const Espacio = memo(function Espacio() {
  return (
    <div className="espacio" aria-hidden="true">
      <svg className="espacio-cielo" viewBox="0 0 1600 1000" preserveAspectRatio="xMidYMid slice">
        <defs>
          <linearGradient id="esp-arco" x1="0" y1="1" x2="1" y2="0">
            <stop offset="0" stopColor="#5ff0d2" stopOpacity="0" />
            <stop offset="0.35" stopColor="#5ff0d2" stopOpacity="0.55" />
            <stop offset="0.75" stopColor="#6fe9ff" stopOpacity="0.35" />
            <stop offset="1" stopColor="#8b7bff" stopOpacity="0" />
          </linearGradient>
        </defs>
        <g className="espacio-orbitas" fill="none">
          <ellipse cx="1180" cy="330" rx="620" ry="250" transform="rotate(-14 1180 330)" />
          <ellipse cx="1180" cy="330" rx="820" ry="360" transform="rotate(-14 1180 330)" strokeDasharray="2 10" />
          <ellipse cx="300" cy="900" rx="520" ry="170" transform="rotate(10 300 900)" />
        </g>
        <path className="espacio-arco" d="M120 1040 C 140 620, 620 160, 1640 120" fill="none" stroke="url(#esp-arco)" strokeWidth="3" strokeLinecap="round" />
        <g className="espacio-estrellas">
          {ESTRELLAS.map((s, i) => (
            <circle key={i} cx={s.x.toFixed(1)} cy={s.y.toFixed(1)} r={s.rad.toFixed(2)} opacity={s.o.toFixed(2)} className={s.tw ? 'tw' : undefined} style={s.tw ? { animationDelay: `${s.d}s` } : undefined} />
          ))}
        </g>
      </svg>
      <div className="espacio-vineta" />
    </div>
  );
});
