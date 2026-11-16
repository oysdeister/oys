import { useState } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import type { Ejercicio } from '../../types';
import { conIni } from '../../lib/texto';
import { Icon } from '../Icon';

export function Problemas({ ej, ini }: { ej: Ejercicio; ini: string }) {
  const [abiertas, setAbiertas] = useState<number[]>([]);
  const reducir = useReducedMotion();
  const t = (x: string) => conIni(x, ini);
  if (!ej.problemas.length) return <p className="muted">No hay problemas típicos registrados para este ejercicio.</p>;
  return (
    <div>
      <p className="muted">Lo que suele fallar en la demo. Toca cada tarjeta para ver cómo se arregla.</p>
      <div className="flip-grid">
        {ej.problemas.map((pr, i) => {
          const on = abiertas.includes(i);
          return (
            <motion.button
              key={i}
              className="flip"
              aria-pressed={on}
              aria-label={on ? `Solución: ${t(pr.solucion)}` : `Problema: ${t(pr.problema)}. Toca para ver la solución.`}
              onClick={() => setAbiertas((a) => (on ? a.filter((x) => x !== i) : [...a, i]))}
              initial={reducir ? false : { opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.06 }}
            >
              <motion.span
                className="flip-in"
                animate={{ rotateY: on ? 180 : 0 }}
                transition={reducir ? { duration: 0 } : { type: 'spring', stiffness: 90, damping: 14 }}
              >
                <span className="flip-face flip-front">
                  <span className="flip-tag">
                    <Icon name="aviso" size={16} /> Problema
                  </span>
                  <span className="flip-txt">{t(pr.problema)}</span>
                  <span className="flip-hint small">Toca para ver la solución</span>
                </span>
                <span className="flip-face flip-back">
                  <span className="flip-tag">
                    <Icon name="check" size={16} /> Solución
                  </span>
                  <span className="flip-txt">{t(pr.solucion)}</span>
                </span>
              </motion.span>
            </motion.button>
          );
        })}
      </div>
    </div>
  );
}
