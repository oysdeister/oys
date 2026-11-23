import { useEffect, useMemo, useState } from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import { Glosa } from '../Glosario';
import { Icon } from '../Icon';
import type { Ejercicio } from '../../types';
import { APROBADO, acciones, useProgreso } from '../../lib/progress';
import { conIni } from '../../lib/texto';
import { barajar } from './util';

const LETRAS = 'ABCDEFGH';
const EASE = [0.2, 0.7, 0.2, 1] as const;

/** Anillo con el porcentaje del resultado. */
function AnilloNota({ n, ok, reduce }: { n: number; ok: boolean; reduce: boolean | null }) {
  const R = 54;
  const C = 2 * Math.PI * R;
  return (
    <div className={`qz-anillo${ok ? ' ok' : ' ko'}`} aria-hidden="true">
      <svg viewBox="0 0 128 128" width="128" height="128">
        <circle cx="64" cy="64" r={R} className="qz-anillo-fondo" />
        <motion.circle
          cx="64"
          cy="64"
          r={R}
          className="qz-anillo-valor"
          strokeDasharray={C}
          initial={{ strokeDashoffset: reduce ? C * (1 - n) : C }}
          animate={{ strokeDashoffset: C * (1 - n) }}
          transition={{ duration: reduce ? 0 : 1.2, ease: EASE, delay: 0.2 }}
        />
      </svg>
      <span className="qz-anillo-txt">
        {Math.round(n * 100)}
        <small>%</small>
      </span>
    </div>
  );
}

/** Chispas al aprobar (solo decorativas; nada con movimiento reducido). */
function Chispas() {
  const piezas = Array.from({ length: 14 }, (_, i) => i);
  return (
    <span className="qz-chispas" aria-hidden="true">
      {piezas.map((i) => {
        const ang = (i / piezas.length) * Math.PI * 2;
        const d = 90 + (i % 3) * 26;
        return (
          <motion.i
            key={i}
            style={{ ['--h' as string]: `${(i * 47) % 360}` }}
            initial={{ x: 0, y: 0, scale: 0.4, opacity: 1 }}
            animate={{ x: Math.cos(ang) * d, y: Math.sin(ang) * d, scale: 1, opacity: 0 }}
            transition={{ duration: 1.1, ease: EASE, delay: 0.35 + (i % 4) * 0.03 }}
          />
        );
      })}
    </span>
  );
}

/**
 * Paso «Test»: una pregunta cada vez, tarjetas de respuesta grandes y respuesta inmediata.
 * Solo cuenta como hecho al aprobar; hasta entonces la página no muestra su «Siguiente».
 */
export function TestEj({ ej, ini, onListo, onIr }: { ej: Ejercicio; ini: string; onListo: (listo: boolean) => void; onIr: (tab: string) => void }) {
  const p = useProgreso();
  const reduce = useReducedMotion();
  const mejor = p.ejercicios[ej.id]?.test ?? null;
  const yaAprobado = mejor !== null && mejor >= APROBADO;
  const [intento, setIntento] = useState(0);
  const [i, setI] = useState(0);
  const [elegida, setElegida] = useState<number | null>(null);
  const [aciertos, setAciertos] = useState(0);
  // Acierto o fallo de cada pregunta ya contestada (pinta la barra por tramos)
  const [res, setRes] = useState<boolean[]>([]);
  // Aprobado otro día: empieza en el resultado (puede repetirlo)
  const [fin, setFin] = useState(yaAprobado);
  const [nota, setNota] = useState<number | null>(null);
  const t = (x: string) => conIni(x, ini);

  // Opciones barajadas por pregunta, nuevas en cada intento
  const ordenes = useMemo(() => ej.test.map((q) => barajar(q.opciones.map((_, k) => k))), [ej, intento]); // eslint-disable-line react-hooks/exhaustive-deps

  const aprobado = fin && (nota !== null ? nota >= APROBADO : yaAprobado);
  useEffect(() => { onListo(aprobado || !ej.test.length); }, [aprobado, ej.test.length, onListo]);

  const total = ej.test.length;
  const q = ej.test[i];

  const elegir = (k: number) => {
    if (elegida !== null || fin) return;
    setElegida(k);
    const bien = k === q.correcta;
    if (bien) setAciertos((a) => a + 1);
    setRes((r) => [...r, bien]);
  };

  // Teclado: A-H (o 1-8) eligen opción
  useEffect(() => {
    if (fin || !total) return;
    const tecla = (e: KeyboardEvent) => {
      if (e.metaKey || e.ctrlKey || e.altKey) return;
      const el = e.target as HTMLElement | null;
      if (el && (el.tagName === 'INPUT' || el.tagName === 'TEXTAREA' || el.isContentEditable)) return;
      // Solo si el foco está en el test o en ninguna parte (no al navegar por la barra lateral)
      if (el && el !== document.body && !el.closest('.qz')) return;
      const k = e.key.toUpperCase();
      const n = LETRAS.indexOf(k) >= 0 ? LETRAS.indexOf(k) : /^[1-8]$/.test(k) ? Number(k) - 1 : -1;
      if (n >= 0 && n < ordenes[i].length && elegida === null) {
        e.preventDefault();
        elegir(ordenes[i][n]);
      }
    };
    window.addEventListener('keydown', tecla);
    return () => window.removeEventListener('keydown', tecla);
  });

  if (!total) return <p className="muted">Este bloque no tiene test.</p>;

  const siguiente = () => {
    if (i >= total - 1) {
      const n = aciertos / total;
      acciones.notaTest(ej.id, n);
      setNota(n);
      setFin(true);
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
    setRes([]);
    setNota(null);
    setFin(false);
  };

  if (fin) {
    const n = nota ?? mejor ?? 0;
    const ok = n >= APROBADO;
    return (
      <motion.div className={`qz qz-fin${ok ? ' ok' : ' ko'}`} initial={{ opacity: 0, y: reduce ? 0 : 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, ease: EASE }}>
        <div className="qz-fin-medalla">
          <AnilloNota n={n} ok={ok} reduce={reduce} />
          {ok && nota !== null && !reduce && <Chispas />}
          <motion.span
            className="qz-fin-sello"
            aria-hidden="true"
            initial={{ scale: reduce ? 1 : 0 }}
            animate={{ scale: 1 }}
            transition={{ type: 'spring', stiffness: 320, damping: 14, delay: reduce ? 0 : 1.1 }}
          >
            <Icon name={ok ? 'logros' : 'repetir'} size={20} stroke={2.2} />
          </motion.span>
        </div>
        <div className="qz-fin-txt">
          <p className="qz-fin-titulo">{ok ? (nota === null ? 'Test aprobado' : 'Aprobado') : 'Todavía no'}</p>
          <p className="pl-res">
            {nota !== null ? `${aciertos} de ${total} respuestas correctas (${Math.round(n * 100)} %).` : `Ya aprobaste este test con un ${Math.round(n * 100)} %.`}{' '}
            {nota === null ? '' : ok ? '' : `Para aprobar necesitas un ${Math.round(APROBADO * 100)} % (${Math.ceil(APROBADO * total)} de ${total}).`}
          </p>
          {nota !== null && res.length === total && (
            <ol className="qz-resumen" aria-label="Resultado por pregunta">
              {res.map((b, k) => (
                <li key={k} className={b ? 'bien' : 'mal'} title={`Pregunta ${k + 1}: ${b ? 'correcta' : 'incorrecta'}`}>
                  <Icon name={b ? 'check' : 'cerrar'} size={14} stroke={3} />
                  <span className="sr-only">
                    Pregunta {k + 1}: {b ? 'correcta' : 'incorrecta'}
                  </span>
                </li>
              ))}
            </ol>
          )}
          {!ok && (
            <p className="muted">
              Repasa el{' '}
              <button type="button" className="pl-link en-linea" onClick={() => onIr('concepto')}>
                Concepto
              </button>{' '}
              y vuelve a intentarlo: las opciones cambian de orden.
            </p>
          )}
          {ok && nota !== null && mejor !== null && mejor > n && <p className="muted">Tu mejor nota: {Math.round(mejor * 100)} %.</p>}
          <div className="pl-btns">
            {ok ? (
              <button type="button" className="btn ghost qz-btn" onClick={reintentar}>
                <Icon name="repetir" size={18} /> Repetir el test
              </button>
            ) : (
              <button type="button" className="btn arc qz-btn" onClick={reintentar}>
                <Icon name="repetir" size={18} /> Volver a intentarlo
              </button>
            )}
          </div>
        </div>
      </motion.div>
    );
  }

  const acerto = elegida !== null && elegida === q.correcta;

  return (
    <div className="qz">
      <div className="qz-cab">
        <span className="qz-icono" aria-hidden="true">
          <Icon name="cerebro" size={22} />
        </span>
        <p className="qz-cont" aria-live="polite">
          <b>
            Pregunta {i + 1} de {total}
          </b>
        </p>
        <span className="qz-marcador" aria-label={`${aciertos} aciertos`}>
          <Icon name="check" size={15} stroke={3} /> {aciertos}
        </span>
      </div>
      <ol className="qz-tramos" aria-hidden="true">
        {ej.test.map((_, k) => (
          <li key={k} className={k < res.length ? (res[k] ? 'bien' : 'mal') : k === i ? 'actual' : ''}>
            <span />
          </li>
        ))}
      </ol>

      <AnimatePresence mode="wait" initial={false}>
        <motion.div
          key={`${intento}-${i}`}
          className="qz-pregunta"
          initial={reduce ? { opacity: 0 } : { opacity: 0, x: 40 }}
          animate={{ opacity: 1, x: 0 }}
          exit={reduce ? { opacity: 0 } : { opacity: 0, x: -40 }}
          transition={{ duration: reduce ? 0.12 : 0.35, ease: EASE }}
        >
          <p className="pl-instr qz-instr">
            <Glosa>{t(q.pregunta)}</Glosa>
          </p>
          <div className="qz-opcs" role="group" aria-label="Respuestas">
            {ordenes[i].map((k, n) => {
              const estado = elegida === null ? '' : k === q.correcta ? ' bien' : k === elegida ? ' mal' : ' apagada';
              return (
                <motion.button
                  key={k}
                  type="button"
                  aria-pressed={elegida === k}
                  className={`qz-opc${estado}`}
                  onClick={() => elegir(k)}
                  disabled={elegida !== null}
                  initial={reduce ? false : { opacity: 0, y: 12 }}
                  animate={
                    estado === ' apagada'
                      ? { opacity: 0.5, y: 0 }
                      : reduce
                      ? { opacity: 1 }
                      : estado === ' mal'
                        ? { opacity: 1, y: 0, x: [0, -9, 9, -6, 6, -2, 0] }
                        : estado === ' bien'
                          ? { opacity: 1, y: 0, scale: [1, 1.035, 1] }
                          : { opacity: 1, y: 0 }
                  }
                  transition={estado ? { duration: 0.45, ease: 'easeOut' } : { duration: 0.3, ease: EASE, delay: 0.05 + n * 0.05 }}
                >
                  <span className="qz-letra" aria-hidden="true">
                    {estado === ' bien' ? <Icon name="check" size={18} stroke={3} /> : estado === ' mal' ? <Icon name="cerrar" size={18} stroke={3} /> : LETRAS[n]}
                  </span>
                  <span className="qz-opc-txt">{t(q.opciones[k])}</span>
                  <span className="sr-only">{estado === ' bien' ? ' (respuesta correcta)' : estado === ' mal' ? ' (tu respuesta, incorrecta)' : ''}</span>
                </motion.button>
              );
            })}
          </div>

          <AnimatePresence>
            {elegida !== null && (
              <motion.div
                className={`qz-feedback ${acerto ? 'bien' : 'mal'}`}
                initial={reduce ? { opacity: 0 } : { opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.35, ease: EASE }}
              >
                <motion.span
                  className="qz-feedback-icono"
                  aria-hidden="true"
                  initial={reduce ? false : { scale: 0, rotate: -40 }}
                  animate={{ scale: 1, rotate: 0 }}
                  transition={{ type: 'spring', stiffness: 380, damping: 15, delay: 0.08 }}
                >
                  <Icon name={acerto ? 'check' : 'aviso'} size={22} stroke={2.6} />
                </motion.span>
                <div className="qz-feedback-txt">
                  <p className="pl-expl" aria-live="polite">
                    <b>{acerto ? 'Correcto.' : 'No es correcta.'}</b> <Glosa>{t(q.explicacion)}</Glosa>
                  </p>
                  <div className="pl-btns">
                    <button type="button" className="btn arc qz-btn" onClick={siguiente} autoFocus>
                      {i >= total - 1 ? 'Ver el resultado' : 'Siguiente pregunta'}
                    </button>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </AnimatePresence>
      {elegida === null && (
        <p className="qz-pista">
          Pulsa una respuesta o usa las teclas <kbd>A</kbd>–<kbd>{LETRAS[ordenes[i].length - 1]}</kbd>.
        </p>
      )}
    </div>
  );
}
