import { useEffect, useRef, useState, type ReactNode } from 'react';
import { createPortal } from 'react-dom';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import type { Hotspot } from '../../types';

export interface Marca {
  id: number;
  x: number;
  y: number;
}

/** Captura real del ERP sobre la que se hace clic. Devuelve el punto en % de la imagen.
 * Con «ampliable», una lupa la abre casi a pantalla completa; ahí también se puede hacer clic. */
export function Captura({
  src,
  alt,
  onPunto,
  children,
  clicable = true,
  ampliable = false,
  instruccion,
}: {
  src: string;
  alt: string;
  onPunto?: (x: number, y: number) => void;
  children?: ReactNode;
  clicable?: boolean;
  ampliable?: boolean;
  /** Se repite arriba de la captura ampliada */
  instruccion?: string;
}) {
  const [grande, setGrande] = useState(false);
  useEffect(() => {
    if (!grande) return;
    const f = (e: KeyboardEvent) => { if (e.key === 'Escape') { e.stopPropagation(); setGrande(false); } };
    window.addEventListener('keydown', f, true);
    const o = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => { window.removeEventListener('keydown', f, true); document.body.style.overflow = o; };
  }, [grande]);
  const marco = (zoom: boolean) => (
    <Marco src={src} alt={alt} clicable={clicable} onPunto={onPunto ? (x, y) => { onPunto(x, y); } : undefined} zoom={zoom}>
      {children}
    </Marco>
  );
  return (
    <div className={`shot${ampliable ? ' shot-amp' : ''}`}>
      {marco(false)}
      {ampliable && (
        <button type="button" className="shot-lupa" onClick={() => setGrande(true)} aria-label="Ampliar la captura" title="Ampliar la captura">
          <svg viewBox="0 0 24 24" width="20" height="20" aria-hidden="true"><circle cx="10.5" cy="10.5" r="6.5" fill="none" stroke="currentColor" strokeWidth="2.2" /><path d="M15.5 15.5L21 21M10.5 7.5v6M7.5 10.5h6" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" /></svg>
          <span>Ampliar</span>
        </button>
      )}
      {grande &&
        createPortal(
          <div className="shot-zoom" role="dialog" aria-modal="true" aria-label="Captura ampliada" onClick={() => setGrande(false)}>
            <div className="shot-zoom-cab" onClick={(e) => e.stopPropagation()}>
              <span>{instruccion && <b className="shot-zoom-instr">{instruccion}</b>}{clicable ? 'Puedes hacer clic aquí mismo. Esc o «Cerrar» para volver.' : 'Esc o «Cerrar» para volver.'}</span>
              <button type="button" className="btn sm" onClick={() => setGrande(false)} autoFocus>Cerrar</button>
            </div>
            <div className="shot-zoom-in" onClick={(e) => e.stopPropagation()}>{marco(true)}</div>
          </div>,
          document.body,
        )}
    </div>
  );
}

function Marco({ src, alt, clicable, onPunto, zoom, children }: { src: string; alt: string; clicable: boolean; onPunto?: (x: number, y: number) => void; zoom: boolean; children?: ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);
  return (
    <div
      ref={ref}
      className={`shot-frame${clicable ? '' : ' no-click'}${zoom ? ' shot-frame-zoom' : ''}`}
      onPointerUp={(e) => {
        if (!clicable || !onPunto || !ref.current) return;
        if (e.pointerType === 'mouse' && e.button !== 0) return;
        const r = ref.current.getBoundingClientRect();
        onPunto(((e.clientX - r.left) / r.width) * 100, ((e.clientY - r.top) / r.height) * 100);
      }}
    >
      <img src={src} alt={alt} draggable={false} />
      {children}
    </div>
  );
}

/** Marcas rojas donde el alumno tocó sin acertar */
export function Fallos({ marcas }: { marcas: Marca[] }) {
  const reducir = useReducedMotion();
  return (
    <AnimatePresence>
      {marcas.map((m) => (
        <motion.span
          key={m.id}
          className="miss"
          style={{ left: `${m.x}%`, top: `${m.y}%` }}
          initial={reducir ? { opacity: 1 } : { scale: 0.2, opacity: 0 }}
          animate={reducir ? { opacity: 1 } : { scale: [0.2, 1.2, 1], opacity: 1, x: [0, -5, 5, -3, 0] }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.45 }}
          aria-hidden="true"
        >
          <svg viewBox="0 0 24 24" width="100%" height="100%">
            <path d="M8 8l8 8M16 8l-8 8" stroke="var(--error)" strokeWidth="3" strokeLinecap="round" />
          </svg>
        </motion.span>
      ))}
    </AnimatePresence>
  );
}

/** Caja del hotspot. modo: aro (guiado), pista (resaltado fuerte), acierto (verde), revelar (ámbar sin oscurecer), oculto (solo área). */
export function CajaHotspot({ h, modo, conEtiqueta = true }: { h: Hotspot; modo: 'aro' | 'pista' | 'acierto' | 'revelar'; conEtiqueta?: boolean }) {
  const reducir = useReducedMotion();
  const abajo = h.y + h.h > 84;
  const derecha = h.x > 62;
  const style = { left: `${h.x}%`, top: `${h.y}%`, width: `${h.w}%`, height: `${h.h}%` };
  if (modo === 'acierto') {
    return (
      <motion.div className="hotspot hs-ok" style={style} initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} aria-hidden="true">
        {!reducir && (
          <motion.span className="hs-burst" initial={{ scale: 0.8, opacity: 0.9 }} animate={{ scale: 1.9, opacity: 0 }} transition={{ duration: 0.7, ease: 'easeOut' }} />
        )}
        <motion.span className="hs-check" initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: 'spring', stiffness: 400, damping: 14 }}>
          <svg viewBox="0 0 24 24" width="22" height="22"><path d="M5 12l5 5 9-10" fill="none" stroke="#fff" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" /></svg>
        </motion.span>
      </motion.div>
    );
  }
  return (
    <div className={`hotspot ${modo === 'revelar' ? 'hs-reveal' : 'live'}${modo === 'pista' ? ' hs-hint' : ''}`} style={style} aria-hidden="true">
      {!reducir && (
        <motion.span
          className="ping"
          animate={{ scale: [1, modo === 'pista' ? 1.45 : 1.22], opacity: [1, 0] }}
          transition={{ duration: modo === 'pista' ? 0.9 : 1.4, repeat: Infinity, ease: 'easeOut' }}
        />
      )}
      {conEtiqueta && h.etiqueta && (
        <span className={`hotspot-tag${abajo ? ' up' : ''}${derecha ? ' right' : ''}`}>{h.etiqueta}</span>
      )}
    </div>
  );
}
