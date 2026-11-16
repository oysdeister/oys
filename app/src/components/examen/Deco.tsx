import { useMemo } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { anillo, hipotrocoide } from './guilloche';

/** Órbita guilloché de la portada del examen: roseta que gira despacio y el arco que la rodea */
export function OrbitaExamen({ codigo }: { codigo: string }) {
  const reducir = useReducedMotion();
  const trazos = useMemo(
    () => ({
      roseta: hipotrocoide(200, 200, 100, 37, 74, 1.55, 1600),
      aros: [0, 1, 2, 3].map((k) => anillo(200, 200, 172, 5, 30, (k * Math.PI) / 2, 600)),
    }),
    [],
  );
  return (
    <svg viewBox="0 0 400 400" className="ex-orbita" aria-hidden="true">
      <motion.g
        style={{ transformOrigin: '200px 200px' }}
        animate={reducir ? undefined : { rotate: 360 }}
        transition={{ duration: 120, repeat: Infinity, ease: 'linear' }}
      >
        <path d={trazos.roseta} fill="none" stroke="#4fbfa5" strokeWidth="0.6" opacity="0.55" />
      </motion.g>
      {trazos.aros.map((d, i) => (
        <motion.path
          key={i}
          d={d}
          fill="none"
          stroke={i % 2 ? '#e8edf4' : '#4fbfa5'}
          strokeWidth="0.7"
          opacity={i % 2 ? 0.25 : 0.6}
          initial={reducir ? false : { pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: 2.4, delay: 0.2 * i, ease: 'easeInOut' }}
        />
      ))}
      <motion.path
        d="M40 330 C 30 140, 170 30, 380 52"
        fill="none"
        stroke="#4fbfa5"
        strokeWidth="9"
        strokeLinecap="round"
        initial={reducir ? false : { pathLength: 0 }}
        animate={{ pathLength: 1 }}
        transition={{ duration: 1.6, delay: 0.3, ease: [0.6, 0, 0.2, 1] }}
      />
      <text x="200" y="196" textAnchor="middle" fill="currentColor" fontFamily="var(--display)" fontWeight="800" fontSize="44">
        80 %
      </text>
      <text x="200" y="226" textAnchor="middle" fill="currentColor" opacity="0.7" fontSize="14">
        para aprobar cada parte
      </text>
      {codigo && (
        <text x="200" y="262" textAnchor="middle" fill="#4fbfa5" fontSize="15" fontWeight="700" letterSpacing="1.5">
          {codigo}
        </text>
      )}
    </svg>
  );
}

/** Anillo de nota animado */
export function AnilloNota({ valor, etiqueta, tam = 150, umbral = 0.8 }: { valor: number; etiqueta: string; tam?: number; umbral?: number }) {
  const reducir = useReducedMotion();
  const r = 54;
  const ok = valor >= umbral;
  return (
    <figure className="ex-anillo" style={{ width: tam }}>
      <svg viewBox="0 0 140 140" width={tam} height={tam} aria-hidden="true">
        <circle cx="70" cy="70" r={r} fill="none" stroke="var(--line)" strokeWidth="10" />
        <motion.circle
          cx="70"
          cy="70"
          r={r}
          fill="none"
          stroke={ok ? 'var(--arc-deep)' : 'var(--error)'}
          strokeWidth="10"
          strokeLinecap="round"
          transform="rotate(-90 70 70)"
          initial={reducir ? false : { pathLength: 0 }}
          animate={{ pathLength: Math.max(0.001, valor) }}
          transition={{ duration: 1.4, ease: [0.2, 0.7, 0.2, 1], delay: 0.2 }}
        />
        <line x1="70" y1="10" x2="70" y2="22" stroke="var(--ink)" strokeWidth="2" transform={`rotate(${umbral * 360} 70 70)`} />
        <text x="70" y="78" textAnchor="middle" fontFamily="var(--display)" fontWeight="800" fontSize="28" fill="var(--ink)">
          {Math.round(valor * 100)}
          <tspan fontSize="15">%</tspan>
        </text>
      </svg>
      <figcaption>{etiqueta}</figcaption>
    </figure>
  );
}
