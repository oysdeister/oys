import { Component, Suspense, lazy, useEffect, useState, type ReactNode } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { OrbitaExamen } from './Deco';
import { hayWebGL } from '../escena3d/tipos';

const EscenaExamen = lazy(() => import('./EscenaExamen'));

class Respaldo extends Component<{ alternativa: ReactNode; children: ReactNode }, { fallo: boolean }> {
  state = { fallo: false };
  static getDerivedStateFromError() {
    return { fallo: true };
  }
  componentDidCatch() {
    /* la órbita CSS toma el relevo */
  }
  render() {
    return this.state.fallo ? this.props.alternativa : this.props.children;
  }
}

function useMedia(q: string) {
  const [si, setSi] = useState(() => window.matchMedia(q).matches);
  useEffect(() => {
    const m = window.matchMedia(q);
    const f = () => setSi(m.matches);
    m.addEventListener('change', f);
    return () => m.removeEventListener('change', f);
  }, [q]);
  return si;
}

/**
 * Decoración de la portada del examen. Con WebGL, pantalla ancha y movimiento permitido:
 * escena 3D (carga perezosa). En móvil, sin WebGL o con movimiento reducido: la órbita CSS 3D.
 */
export function PortadaEspacio({ codigo }: { codigo: string }) {
  const reducir = !!useReducedMotion();
  const ancho = useMedia('(min-width: 761px)');
  const [webgl] = useState(hayWebGL);
  const css = <OrbitaExamen codigo={codigo} />;
  if (!webgl || !ancho || reducir) return css;
  return (
    <div className="exe-hero">
      <Respaldo alternativa={css}>
        <Suspense fallback={<div className="exe-cargando" aria-hidden="true" />}>
          <EscenaExamen reducir={false} />
        </Suspense>
      </Respaldo>
      <motion.div className="exe-capa" initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 2.1, duration: 0.7, ease: [0.2, 0.8, 0.2, 1] }}>
        <span className="exe-pct">
          80<small>%</small>
        </span>
        <span className="exe-et">para aprobar cada parte</span>
        <span className="ex-orbita-cod">{codigo}</span>
      </motion.div>
    </div>
  );
}
