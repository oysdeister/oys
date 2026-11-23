import { useEffect, useState } from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import { useProgreso } from '../lib/progress';
import { SALUDO, bienvenidaVista, marcaBienvenida, primerNombre } from '../lib/saludo';

const EASE = [0.2, 0.7, 0.2, 1] as const;

/** Al entrar (una vez por sesión del navegador): «Te damos la bienvenida, Laura» a pantalla completa unos segundos. */
export function Bienvenida() {
  const p = useProgreso();
  const reduce = useReducedMotion();
  const listo = !!(p.alumno.ini && p.alumno.usuario);
  const [ver, setVer] = useState(false);

  useEffect(() => {
    if (!listo || bienvenidaVista()) return;
    marcaBienvenida();
    setVer(true);
    const t = window.setTimeout(() => setVer(false), reduce ? 1800 : 2600);
    return () => window.clearTimeout(t);
  }, [listo, reduce]);

  useEffect(() => {
    if (!ver) return;
    const esc = (e: KeyboardEvent) => e.key === 'Escape' && setVer(false);
    window.addEventListener('keydown', esc);
    return () => window.removeEventListener('keydown', esc);
  }, [ver]);

  const pila = primerNombre(p.alumno.nombre);
  const letras = Array.from(`${SALUDO},`);

  return (
    <AnimatePresence>
      {ver && (
        <motion.div
          className="bnv"
          role="status"
          aria-live="polite"
          onClick={() => setVer(false)}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0, transition: { duration: 0.6, ease: EASE } }}
        >
          <motion.div
            className="bnv-in"
            initial={reduce ? false : { scale: 0.92, y: 24 }}
            animate={{ scale: 1, y: 0 }}
            exit={reduce ? undefined : { scale: 1.04, y: -16 }}
            transition={{ duration: 0.7, ease: EASE }}
          >
            <motion.span
              className="bnv-avatar"
              aria-hidden="true"
              initial={reduce ? false : { scale: 0, rotate: -30 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ type: 'spring', stiffness: 260, damping: 16, delay: 0.1 }}
            >
              {p.alumno.ini}
            </motion.span>
            <p className="bnv-saludo">
              {letras.map((c, i) => (
                <motion.span
                  key={i}
                  initial={reduce ? false : { opacity: 0, y: 18 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, ease: EASE, delay: 0.25 + i * 0.035 }}
                >
                  {c}
                </motion.span>
              ))}
            </p>
            <motion.p
              className="bnv-nombre"
              initial={reduce ? false : { opacity: 0, y: 24, filter: 'blur(8px)' }}
              animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
              transition={{ duration: 0.7, ease: EASE, delay: 0.6 }}
            >
              {pila}
            </motion.p>
            <motion.span
              className="bnv-raya"
              aria-hidden="true"
              initial={reduce ? false : { scaleX: 0 }}
              animate={{ scaleX: 1 }}
              transition={{ duration: 1.6, ease: EASE, delay: 0.7 }}
            />
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
