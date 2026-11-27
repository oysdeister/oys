import { useMemo, useState, type CSSProperties } from 'react';
import { Link, Navigate, useParams } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { META, MODULOS, getModulo } from '../content';
import { APROBADO, acciones, useProgreso } from '../lib/progress';
import { claveExamen, preguntasDe, MAX_PREG } from '../lib/examenModulo';
import { conIni } from '../lib/texto';
import { Glosa } from '../components/Glosario';
import { Icon } from '../components/Icon';
import { barajar, barajarDistinto } from '../components/exercise/util';
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
  // Con un banco grande (módulos fusionados) cada intento saca MAX_PREG preguntas distintas
  const orden = (previo && banco.length <= MAX_PREG ? barajarDistinto(previo.orden) : barajar(base)).slice(0, MAX_PREG);
  return { orden, opciones: orden.map((i) => barajar(banco[i].opciones.map((_, k) => k))) };
}

export default function ExamenModulo() {
  const { id = '' } = useParams();
  const p = useProgreso();
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

  // Módulo fusionado (ALIAS_MODULO): la URL antigua lleva al examen del módulo vigente
  if (modulo && modulo.id !== id) return <Navigate to={`/modulo/${modulo.id}/examen`} replace />;

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
  const total = Math.min(banco.length, MAX_PREG);

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
  };

  const estilo = { ['--mod' as string]: meta.color } as CSSProperties;
  const nMod = MODULOS.findIndex((m) => m.id === modulo.id);

  if (fase === 'inicio') {
    return (
      <div className="wrap exm" style={estilo}>
        <Link to={`/modulo/${modulo.id}`} className="btn ghost sm pm-volver">
          <Icon name="atras" size={18} /> {modulo.titulo}
        </Link>
        <header className="exg-cab">
          <p className="exg-kicker">Módulo {nMod} · Examen del módulo</p>
          <h1>{meta.corto}</h1>
          <p className="exg-lead">
            {total} preguntas de test sobre lo que has visto en el módulo. Cada vez que lo haces, {banco.length > total ? 'cambian las preguntas y su orden' : 'las preguntas y las opciones salen en otro orden'}.
          </p>
        </header>
        <dl className="exg-cifras">
          <div>
            <dt>{total}</dt>
            <dd>preguntas de test</dd>
          </div>
          <div>
            <dt>1</dt>
            <dd>respuesta correcta por pregunta</dd>
          </div>
          <div>
            <dt>{Math.round(APROBADO * 100)} %</dt>
            <dd>para aprobar</dd>
          </div>
          <div className={mejor !== null && mejor >= APROBADO ? 'ok' : undefined}>
            <dt>{mejor === null ? '—' : `${Math.round(mejor * 100)} %`}</dt>
            <dd>tu mejor nota</dd>
          </div>
        </dl>
        <section className="exg-panel">
          <h2>Antes de empezar</h2>
          <ul className="exm-reglas">
            <li>Una sola respuesta correcta por pregunta.</li>
            <li>Puedes volver atrás y cambiar respuestas hasta que termines.</li>
            <li>Apruebas con un {Math.round(APROBADO * 100)} %. Al final verás las que has fallado con su explicación.</li>
          </ul>
          <div className="row-btns">
            <button className="btn arc lg" onClick={() => empezar(nIntento > 0 || mejor !== null)}>
              {mejor === null ? 'Empezar el examen' : 'Repetir el examen'}
            </button>
          </div>
        </section>
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
        <motion.div className={`exg-panel exm-fin ${ok ? 'ok' : 'ko'}`} initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
          <div className="exm-nota" aria-label={`${aciertos} de ${total} aciertos`}>
            <b>{Math.round(nota * 100)} %</b>
            <span>
              {aciertos} de {total} aciertos
            </span>
          </div>
          <div>
            <p className="exg-kicker">Módulo {nMod} · {meta.corto}</p>
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
                <li key={n} className="exm-fallo">
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
      <div className="exg-panel exm-test">
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
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
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
