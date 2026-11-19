import { useMemo, useState, type CSSProperties } from 'react';
import { Link, useParams } from 'react-router-dom';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import confetti from 'canvas-confetti';
import { META, getModulo } from '../content';
import { APROBADO, acciones, useProgreso } from '../lib/progress';
import { claveExamen, preguntasDe } from '../lib/examenModulo';
import { conIni } from '../lib/texto';
import { Glosa } from '../components/Glosario';
import { Icon } from '../components/Icon';
import { NucleoOrbita } from '../components/shell/NucleoOrbita';
import { COLORES_MARCA, barajar, barajarDistinto } from '../components/exercise/util';
import type { Pregunta } from '../types';
import './examen-modulo.css';

const LETRAS = 'ABCDEFGH';

interface Intento {
  /** Índices de las preguntas del banco, en el orden de este intento */
  orden: number[];
  /** Orden de las opciones de cada pregunta (por posición en el intento) */
  opciones: number[][];
}

function nuevoIntento(banco: Pregunta[], previo?: Intento): Intento {
  const base = banco.map((_, i) => i);
  // El orden de las preguntas cambia siempre respecto al intento anterior
  const orden = previo ? barajarDistinto(previo.orden) : barajar(base);
  return { orden, opciones: orden.map((i) => barajar(banco[i].opciones.map((_, k) => k))) };
}

export default function ExamenModulo() {
  const { id = '' } = useParams();
  const p = useProgreso();
  const reducir = useReducedMotion();
  const modulo = getModulo(id);
  const banco = useMemo(() => preguntasDe(id), [id]);
  const clave = claveExamen(id);
  const [fase, setFase] = useState<'inicio' | 'examen' | 'fin'>('inicio');
  const [intento, setIntento] = useState<Intento>(() => nuevoIntento(banco));
  const [nIntento, setNIntento] = useState(0);
  const [i, setI] = useState(0);
  const [resp, setResp] = useState<(number | null)[]>([]);
  const ini = p.alumno.ini;
  const t = (x: string) => conIni(x, ini);

  if (!modulo || !clave || !banco.length) {
    return (
      <div className="wrap" style={{ padding: '60px 0' }}>
        <h1>Este módulo aún no tiene examen</h1>
        <p className="muted">Vuelve al módulo y sigue con los bloques.</p>
        <Link className="btn" to={modulo ? `/modulo/${modulo.id}` : '/'}>
          Volver
        </Link>
      </div>
    );
  }

  const meta = META[modulo.id] ?? { color: 'var(--arc)', icono: 'examen', corto: modulo.titulo };
  const mejor = p.examenes?.[clave] ?? null;
  const total = banco.length;

  const empezar = (repetir: boolean) => {
    if (repetir) {
      setIntento((prev) => nuevoIntento(banco, prev));
      setNIntento((n) => n + 1);
    }
    setI(0);
    setResp(Array(total).fill(null));
    setFase('examen');
    window.scrollTo({ top: 0 });
  };

  const aciertos = intento.orden.reduce((s, qi, pos) => s + (resp[pos] === banco[qi].correcta ? 1 : 0), 0);

  const terminar = () => {
    const nota = aciertos / total;
    acciones.notaExamenModulo(clave, nota);
    setFase('fin');
    window.scrollTo({ top: 0 });
    if (nota >= APROBADO && !reducir) {
      void confetti({ particleCount: 160, spread: 95, origin: { y: 0.5 }, colors: COLORES_MARCA, disableForReducedMotion: true });
    }
  };

  const estilo = { ['--mod' as string]: meta.color } as CSSProperties;

  if (fase === 'inicio') {
    return (
      <div className="wrap exm" style={estilo}>
        <Link to={`/modulo/${modulo.id}`} className="btn ghost sm pm-volver">
          <Icon name="atras" size={18} /> {modulo.titulo}
        </Link>
        <header className="ax-banner exm-banner">
          <p className="ax-kicker">Examen del módulo</p>
          <h1>{meta.corto}</h1>
          <p className="lead">
            {total} preguntas de test sobre lo que has visto en el módulo. Cada vez que lo haces, las preguntas y las opciones salen en otro orden.
          </p>
          <ul className="exm-reglas">
            <li>Una sola respuesta correcta por pregunta.</li>
            <li>Puedes volver atrás y cambiar respuestas hasta que termines.</li>
            <li>Apruebas con un {Math.round(APROBADO * 100)} %. Al final verás las que has fallado con su explicación.</li>
          </ul>
          {mejor !== null && <p className={`chip${mejor >= APROBADO ? ' ok' : ''}`}>Tu mejor nota: {Math.round(mejor * 100)} %</p>}
          <div className="row-btns">
            <button className="btn arc lg" onClick={() => empezar(nIntento > 0 || mejor !== null)}>
              {mejor === null ? 'Empezar el examen' : 'Repetir el examen'}
            </button>
          </div>
        </header>
      </div>
    );
  }

  if (fase === 'fin') {
    const nota = aciertos / total;
    const ok = nota >= APROBADO;
    const falladas = intento.orden.map((qi, pos) => ({ q: banco[qi], r: resp[pos] })).filter((x) => x.r !== x.q.correcta);
    return (
      <div className="wrap exm" style={estilo}>
        <Link to={`/modulo/${modulo.id}`} className="btn ghost sm pm-volver">
          <Icon name="atras" size={18} /> {modulo.titulo}
        </Link>
        <motion.div className={`sheet pad test-fin ${ok ? 'flash-ok' : 'flash-ko'}`} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <div className={`test-nucleo${ok ? ' ok' : ' ko'}`}>
            <NucleoOrbita valor={nota} size={210} etiqueta={`${aciertos} de ${total} aciertos`} />
          </div>
          <div>
            <h2>{ok ? 'Examen aprobado' : 'Todavía no'}</h2>
            <p className="muted">
              {ok
                ? `Has acertado ${aciertos} de ${total}. Queda guardado en tu progreso y en tus logros.`
                : `Has acertado ${aciertos} de ${total}. Necesitas un ${Math.round(APROBADO * 100)} % para aprobar: repasa las falladas y vuelve a intentarlo.`}
            </p>
            {mejor !== null && <p className="small muted">Tu mejor nota: {Math.round(Math.max(mejor, nota) * 100)} %</p>}
            <div className="row-btns">
              <button className="btn arc" onClick={() => empezar(true)}>
                Repetir el examen
              </button>
              <Link className="btn ghost" to={`/modulo/${modulo.id}`}>
                Volver al módulo
              </Link>
            </div>
          </div>
        </motion.div>

        {falladas.length > 0 ? (
          <section className="exm-repaso" aria-labelledby="rep-h">
            <h2 id="rep-h">Repaso de las que has fallado ({falladas.length})</h2>
            <ol>
              {falladas.map(({ q, r }, n) => (
                <li key={n} className="glass exm-fallo">
                  <p className="exm-fallo-q">
                    <Glosa>{t(q.pregunta)}</Glosa>
                  </p>
                  <p className="exm-tuya">
                    <span>Tu respuesta</span> {r === null ? 'Sin responder' : t(q.opciones[r])}
                  </p>
                  <p className="exm-buena">
                    <span>Correcta</span> {t(q.opciones[q.correcta])}
                  </p>
                  <p className="small muted">
                    <Glosa>{t(q.explicacion)}</Glosa>
                  </p>
                </li>
              ))}
            </ol>
          </section>
        ) : (
          <p className="callout solucion exm-perfecto">
            <b>Sin fallos.</b> Has acertado todas las preguntas.
          </p>
        )}
      </div>
    );
  }

  const qi = intento.orden[i];
  const q = banco[qi];
  const elegida = resp[i] ?? null;
  const respondidas = resp.filter((r) => r !== null).length;
  const elegir = (k: number) => setResp((rs) => rs.map((r, n) => (n === i ? k : r)));

  return (
    <div className="wrap exm" style={estilo}>
      <Link to={`/modulo/${modulo.id}`} className="btn ghost sm pm-volver">
        <Icon name="atras" size={18} /> Salir del examen
      </Link>
      <div className="test glass exm-test">
        <div className="test-top">
          <span className="small muted">
            Examen de {meta.corto} · pregunta {i + 1} de {total}
          </span>
          <span className="chip">{respondidas} respondidas</span>
        </div>
        <div className="meter" aria-hidden="true">
          <motion.i initial={false} animate={{ width: `${(respondidas / total) * 100}%` }} />
        </div>
        <AnimatePresence mode="wait">
          <motion.div
            key={`${nIntento}-${i}`}
            className="test-q"
            initial={reducir ? { opacity: 0 } : { opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            exit={reducir ? { opacity: 0 } : { opacity: 0, x: -30 }}
            transition={{ duration: 0.22 }}
          >
            <h3 className="test-preg">
              <Glosa>{t(q.pregunta)}</Glosa>
            </h3>
            <div role="radiogroup" aria-label="Opciones">
              {intento.opciones[i].map((k, n) => (
                <button key={k} role="radio" aria-checked={elegida === k} className={`quiz-opt${elegida === k ? ' picked' : ''}`} onClick={() => elegir(k)}>
                  <span className="letter">{LETRAS[n]}</span>
                  <span>{t(q.opciones[k])}</span>
                </button>
              ))}
            </div>
            <div className="row-btns exm-nav">
              {i > 0 && (
                <button className="btn ghost" onClick={() => setI(i - 1)}>
                  Anterior
                </button>
              )}
              {i < total - 1 ? (
                <button className="btn arc" onClick={() => setI(i + 1)} disabled={elegida === null}>
                  Siguiente pregunta
                </button>
              ) : (
                <button className="btn arc" onClick={terminar} disabled={respondidas < total}>
                  Terminar y ver mi nota
                </button>
              )}
            </div>
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}
