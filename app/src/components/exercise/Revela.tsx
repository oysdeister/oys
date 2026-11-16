import type { ReactNode } from 'react';
import { motion, useReducedMotion } from 'framer-motion';

const EASE = [0.2, 0.7, 0.2, 1] as const;

/** Props de framer-motion para que un elemento aparezca al entrar en pantalla (quieto con movimiento reducido) */
export function useRevela() {
  const reducir = !!useReducedMotion();
  return (i = 0, dist = 18) =>
    reducir
      ? {}
      : {
          initial: { opacity: 0, y: dist },
          whileInView: { opacity: 1, y: 0 },
          viewport: { once: true, margin: '-40px' },
          transition: { duration: 0.5, delay: Math.min(i, 8) * 0.07, ease: EASE },
        };
}

/** Bloque que aparece al hacer scroll */
export function Revela({ children, className, i = 0, as = 'div' }: { children: ReactNode; className?: string; i?: number; as?: 'div' | 'section' | 'li' }) {
  const r = useRevela();
  const M = as === 'section' ? motion.section : as === 'li' ? motion.li : motion.div;
  return (
    <M className={className} {...r(i)}>
      {children}
    </M>
  );
}

/** Botón «Ver más / Ver menos» para listas largas */
export function VerMas({ abierto, resto, onClick, que = 'más' }: { abierto: boolean; resto: number; onClick: () => void; que?: string }) {
  return (
    <button type="button" className={`ver-mas${abierto ? ' open' : ''}`} aria-expanded={abierto} onClick={onClick}>
      <span>{abierto ? 'Ver menos' : `Ver ${resto} ${que}`}</span>
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <path d="M6 9l6 6 6-6" />
      </svg>
    </button>
  );
}

/** Separa la primera frase (titular de la tarjeta) del resto, si es corta */
export function partir(p: string): { cab: string; resto: string } {
  const m = p.match(/^(.{12,150}?(?:\.(?=\s+[A-ZÁÉÍÓÚÑ¿¡«(0-9])|:(?=\s)))\s+/);
  if (!m) return { cab: '', resto: p };
  const resto = p.slice(m[0].length).trim();
  if (resto.length < 25) return { cab: '', resto: p };
  return { cab: m[1], resto };
}
