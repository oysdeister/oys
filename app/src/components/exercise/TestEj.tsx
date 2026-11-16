import { useMemo, useState } from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import confetti from 'canvas-confetti';
import type { Ejercicio } from '../../types';
import { APROBADO, acciones, useProgreso } from '../../lib/progress';
import { conIni } from '../../lib/texto';
import { Anillo } from './Anillo';
import { COLORES_MARCA, barajar } from './util';

const LETRAS = 'ABCDEFGH';

export function TestEj({ ej, ini, onIr }: { ej: Ejercicio; ini: string; onIr: (tab: string) => void }) {
  const reducir = useReducedMotion();
  const p = useProgreso();
  const mejor = p.ejercicios[ej.id]?.test ?? null;
  const [intento, setIntento] = useState(0);
  const [i, setI] = useState(0);
  const [elegida, setElegida] = useState<number | null>(null);
  const [aciertos, setAciertos] = useState(0);
  const [fin, setFin] = useState(false);
  const t = (x: string) => conIni(x, ini);

  // Opciones barajadas por pregunta, nuevas en cada intento
  const ordenes = useMemo(() => ej.test.map((q) => barajar(q.opciones.map((_, k) => k))), [ej, intento]); // eslint-disable-line react-hooks/exhaustive-deps

  if (!ej.test.length) return <p className="muted">Este ejercicio no tiene test.</p>;

  const q = ej.test[i];
  const total = ej.test.length;

  const elegir = (k: number) => {
    if (elegida !== null) return;
    setElegida(k);
    if (k === q.correcta) setAciertos((a) => a + 1);
  };

  const siguiente = () => {
    if (i >= total - 1) {
      const nota = aciertos / total;
      acciones.notaTest(ej.id, nota);
      setFin(true);
      if (nota >= APROBADO && !reducir) {
        void confetti({ particleCount: 150, spread: 90, origin: { y: 0.55 }, colors: COLORES_MARCA, disableForReducedMotion: true });
      }
      return;
    }
    setI(i + 1);
    setElegida(null);
  };

  const reintentar = () => {
    setIntento((n) => n + 1);
    setI(0);
    setElegida(null);
    setAciertos(0);
    setFin(false);
  };

  if (fin) {
    const nota = aciertos / total;
    const ok = nota >= APROBADO;
    return (
      <motion.div className="sheet pad test-fin" initial={{ opacity: 0, rotateX: -12, y: 20 }} animate={{ opacity: 1, rotateX: 0, y: 0 }} transition={{ type: 'spring', stiffness: 110, damping: 16 }} style={{ transformPerspective: 1000 }}>
        <Anillo valor={nota} size={190} etiqueta={`${aciertos} de ${total}`} />
        <div>
          <h2>{ok ? 'Aprobado' : 'Casi'}</h2>
          <p className="muted">
            {ok
              ? 'Tienes claros los conceptos. Ahora pásalo a la demo real.'
              : `Necesitas un ${Math.round(APROBADO * 100)} % para aprobar. Repasa el concepto y vuelve a intentarlo: las opciones cambian de orden.`}
          </p>
          {mejor !== null && <p className="small muted">Tu mejor nota: {Math.round(Math.max(mejor, nota) * 100)} %</p>}
          <div className="row-btns">
            {ok ? (
              <button className="btn arc" onClick={() => onIr('demo')}>
                Ir a la demo real
              </button>
            ) : (
              <button className="btn arc" onClick={() => onIr('concepto')}>
                Repasar el concepto
              </button>
            )}
            <button className="btn ghost" onClick={reintentar}>
              Reintentar
            </button>
          </div>
        </div>
      </motion.div>
    );
  }

  const acerto = elegida !== null && elegida === q.correcta;

  return (
    <div className="test">
      <div className="test-top">
        <span className="small muted">
          Pregunta {i + 1} de {total}
        </span>
        {mejor !== null && <span className={`chip${mejor >= APROBADO ? ' ok' : ''}`}>Mejor nota {Math.round(mejor * 100)} %</span>}
      </div>
      <div className="meter" aria-hidden="true">
        <motion.i initial={false} animate={{ width: `${((i + (elegida !== null ? 1 : 0)) / total) * 100}%` }} />
      </div>
      <AnimatePresence mode="wait">
        <motion.div
          key={`${intento}-${i}`}
          className="test-q"
          initial={reducir ? { opacity: 0 } : { opacity: 0, x: 30 }}
          animate={{ opacity: 1, x: 0 }}
          exit={reducir ? { opacity: 0 } : { opacity: 0, x: -30 }}
          transition={{ duration: 0.25 }}
        >
          <h3 className="test-preg">{t(q.pregunta)}</h3>
          <div role="radiogroup" aria-label="Opciones">
            {ordenes[i].map((k, n) => {
              const clase = elegida === null ? '' : k === q.correcta ? ' right' : k === elegida ? ' wrong' : ' dim';
              return (
                <motion.button
                  key={k}
                  role="radio"
                  aria-checked={elegida === k}
                  className={`quiz-opt${clase}`}
                  onClick={() => elegir(k)}
                  disabled={elegida !== null && k !== elegida && k !== q.correcta}
                  animate={elegida === k && k !== q.correcta && !reducir ? { x: [0, -8, 8, -5, 5, 0] } : elegida !== null && k === q.correcta && !reducir ? { scale: [1, 1.02, 1] } : {}}
                  transition={{ duration: 0.4 }}
                >
                  <span className="letter">{LETRAS[n]}</span>
                  <span>{t(q.opciones[k])}</span>
                </motion.button>
              );
            })}
          </div>
          <AnimatePresence>
            {elegida !== null && (
              <motion.div className={`callout ${acerto ? 'solucion' : 'problema'}`} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} aria-live="polite">
                <b>{acerto ? 'Correcto' : 'No es esa'}</b>
                {t(q.explicacion)}
              </motion.div>
            )}
          </AnimatePresence>
          {elegida !== null && (
            <div className="row-btns" style={{ marginTop: 16 }}>
              <button className="btn arc" onClick={siguiente} autoFocus>
                {i >= total - 1 ? 'Ver mi nota' : 'Siguiente pregunta'}
              </button>
            </div>
          )}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
