import { useMemo } from 'react';
import { motion, useReducedMotion } from 'framer-motion';

/* Piezas de movimiento de la teoría: la órbita de progreso y el salto entre preguntas. */

const P0 = { x: 2, y: 86 };
const P1 = { x: 50, y: -26 };
const P2 = { x: 98, y: 86 };
/** Punto de la curva de la órbita (Bézier cuadrática) en % del ancho y del alto */
const enOrbita = (t: number) => ({
  x: (1 - t) * (1 - t) * P0.x + 2 * (1 - t) * t * P1.x + t * t * P2.x,
  y: (1 - t) * (1 - t) * P0.y + 2 * (1 - t) * t * P1.y + t * t * P2.y,
});

/**
 * Barra de progreso en forma de órbita: el arco O&S con una estrella por pregunta.
 * Las respondidas brillan, la actual lleva un satélite y el trazo se enciende con lo respondido.
 */
export function OrbitaProgreso({ total, actual, hechas, latido }: { total: number; actual: number; hechas: boolean[]; latido?: string }) {
  const reducir = useReducedMotion();
  const n = hechas.filter(Boolean).length;
  const pos = (k: number) => enOrbita(total > 1 ? k / (total - 1) : 0.5);
  const sat = pos(actual);
  const d = `M${P0.x} ${P0.y} Q ${P1.x} ${P1.y} ${P2.x} ${P2.y}`;
  return (
    <div className="exv-orbita" aria-hidden="true">
      <svg viewBox="0 0 100 100" preserveAspectRatio="none" className="exv-orbita-svg">
        <defs>
          <linearGradient id="exv-neon" x1="0" x2="1">
            <stop offset="0%" stopColor="#5ff0d2" />
            <stop offset="50%" stopColor="#6fe9ff" />
            <stop offset="100%" stopColor="#8b7bff" />
          </linearGradient>
        </defs>
        <path d={d} className="exv-orbita-guia" vectorEffect="non-scaling-stroke" />
        <motion.path d={d} className="exv-orbita-traza" vectorEffect="non-scaling-stroke" initial={false} animate={{ pathLength: total ? n / total : 0 }} transition={{ duration: reducir ? 0 : 0.6, ease: [0.2, 0.7, 0.2, 1] }} />
      </svg>
      {hechas.map((h, k) => {
        const p = pos(k);
        return <span key={k} className={`exv-estrella ${h ? 'on' : ''} ${k === actual ? 'cur' : ''}`} style={{ left: `${p.x}%`, top: `${p.y}%` }} />;
      })}
      <motion.span
        className="exv-satelite"
        initial={false}
        animate={{ left: `${sat.x}%`, top: `${sat.y}%` }}
        transition={reducir ? { duration: 0 } : { type: 'spring', stiffness: 120, damping: 18 }}
      >
        <span key={latido} className={latido && !reducir ? 'exv-latido' : ''} />
      </motion.span>
      <span className="exv-orbita-cuenta">
        <b>{n}</b>/{total}
      </span>
    </div>
  );
}

/** Estelas de estrellas que salen del centro al cambiar de pregunta (efecto de salto) */
export function Hiperespacio({ semilla }: { semilla: number }) {
  const reducir = useReducedMotion();
  const estelas = useMemo(() => {
    let s = (semilla * 9301 + 49297) % 233280;
    const azar = () => {
      s = (s * 9301 + 49297) % 233280;
      return s / 233280;
    };
    return Array.from({ length: 26 }, (_, k) => ({ ang: (k / 26) * 360 + azar() * 12, largo: 30 + azar() * 40, retraso: azar() * 0.12, color: ['#5ff0d2', '#6fe9ff', '#8b7bff', '#ffffff'][k % 4] }));
  }, [semilla]);
  if (reducir) return null;
  return (
    <div className="exv-hiper" aria-hidden="true">
      {estelas.map((e, k) => (
        <i key={k} style={{ transform: `rotate(${e.ang}deg)`, ['--largo' as string]: `${e.largo}%`, ['--c' as string]: e.color, animationDelay: `${e.retraso}s` }} />
      ))}
    </div>
  );
}
