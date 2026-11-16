import { motion, useReducedMotion } from 'framer-motion';

/** Anillo de progreso con el turquesa del arco. `valor` de 0 a 1. */
export function Anillo({ valor, size = 64, grosor = 6, className = '', texto }: { valor: number; size?: number; grosor?: number; className?: string; texto?: string }) {
  const reduce = useReducedMotion();
  const r = (size - grosor) / 2;
  const c = 2 * Math.PI * r;
  const v = Math.max(0, Math.min(1, valor || 0));
  return (
    <span className={`ax-ring-wrap ${className}`} style={{ width: size, height: size, fontSize: size }}>
      <svg className="ax-ring" width={size} height={size} viewBox={`0 0 ${size} ${size}`} aria-hidden="true" style={{ transform: 'rotate(-90deg)' }}>
        <circle className="trk" cx={size / 2} cy={size / 2} r={r} fill="none" strokeWidth={grosor} />
        <motion.circle
          className="val"
          cx={size / 2}
          cy={size / 2}
          r={r}
          fill="none"
          strokeWidth={grosor}
          strokeLinecap="round"
          strokeDasharray={c}
          initial={false}
          animate={{ strokeDashoffset: c * (1 - v) }}
          transition={reduce ? { duration: 0 } : { type: 'spring', stiffness: 50, damping: 16 }}
        />
      </svg>
      {texto !== undefined && <span className="ax-num">{texto}</span>}
    </span>
  );
}
