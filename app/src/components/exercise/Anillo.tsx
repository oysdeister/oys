import { useEffect, useState } from 'react';
import { animate, motion, useReducedMotion } from 'framer-motion';

/** Anillo de nota con el arco O&S: se dibuja y la cifra cuenta hasta el valor */
export function Anillo({ valor, size = 168, color, etiqueta }: { valor: number; size?: number; color?: string; etiqueta?: string }) {
  const reducir = useReducedMotion();
  const [n, setN] = useState(reducir ? Math.round(valor * 100) : 0);
  useEffect(() => {
    if (reducir) {
      setN(Math.round(valor * 100));
      return;
    }
    const c = animate(0, Math.round(valor * 100), { duration: 1.2, ease: [0.2, 0.7, 0.2, 1], onUpdate: (v) => setN(Math.round(v)) });
    return () => c.stop();
  }, [valor, reducir]);
  const trazo = color ?? (valor >= 0.8 ? 'var(--arc-deep)' : valor >= 0.5 ? 'var(--signal)' : 'var(--error)');
  return (
    <div className="ring" style={{ width: size, height: size }} role="img" aria-label={`${Math.round(valor * 100)} por ciento${etiqueta ? `, ${etiqueta}` : ''}`}>
      <svg viewBox="0 0 120 120" width={size} height={size} aria-hidden="true">
        <circle cx="60" cy="60" r="50" fill="none" stroke="var(--line)" strokeWidth="10" />
        <motion.circle
          cx="60"
          cy="60"
          r="50"
          fill="none"
          stroke={trazo}
          strokeWidth="10"
          strokeLinecap="round"
          transform="rotate(-90 60 60)"
          initial={{ pathLength: reducir ? valor : 0 }}
          animate={{ pathLength: Math.max(valor, 0.001) }}
          transition={{ duration: reducir ? 0 : 1.2, ease: [0.2, 0.7, 0.2, 1] }}
        />
      </svg>
      <div className="ring-in" aria-hidden="true">
        <strong>{n}<small>%</small></strong>
        {etiqueta && <span>{etiqueta}</span>}
      </div>
    </div>
  );
}
