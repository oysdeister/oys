import { useEffect, useMemo, useRef, useState, type ReactNode } from 'react';
import { Link } from 'react-router-dom';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import confetti from 'canvas-confetti';
import { Icon } from '../components/Icon';
import { OrbitaExamen, AnilloNota } from '../components/examen/Deco';
import { RutaFichas } from '../components/examen/RutaFichas';
import { copiar, descargar, reloj, useAhora } from '../components/examen/util';
import { useProgreso } from '../lib/progress';
import { INSIGNIAS } from '../lib/badges';
import { MODULOS } from '../content';
import { num2 } from '../lib/texto';
import {
  APROBADO_EXAMEN,
  MIN_TEORIA,
  NUM_TEORIA,
  bancoTeoria,
  actaTexto,
  corregirCampo,
  crearActa,
  examen,
  formatoValido,
  generarCaso,
  useExamen,
  type CampoExamen,
  type EstadoExamen,
  type TareaExamen,
} from '../lib/examen';
import './examen.css';

const etiquetaOrigen = (o: string) => (o === 'criterio' ? 'Criterio' : o.startsWith('vídeo') ? o.replace('vídeo', 'Vídeo de compras ·') : `Manual de ${MODULOS.find((m) => m.id === o)?.titulo.toLowerCase() ?? o}`);

const MARCA = ['#4fbfa5', '#2a9c83', '#1f2738', '#f2a93b', '#dff3ee'];
const DEMO_URL = 'https://nextdemo.geasa.eu';

export default function Examen() {
  const { actual } = useExamen();
  const [enCurso, setEnCurso] = useState(false);
  const activo = !!actual && actual.fase !== 'resultado' && enCurso;

  // Modo examen: fuera navegación y ayudas mientras se hace
  useEffect(() => {
    if (!activo) return;
    document.body.classList.add('modo-examen');
    return () => document.body.classList.remove('modo-examen');
  }, [activo]);

  if (actual && actual.fase === 'resultado') return <ResultadoVista ex={actual} onNuevo={() => { examen.descartar(); setEnCurso(false); }} />;
  if (!actual || !enCurso) return <Portada actual={actual} onEmpezar={() => setEnCurso(true)} />;
  if (actual.fase === 'teoria') return <Teoria ex={actual} />;
  return <Practica ex={actual} />;
}

/* ---------------------------------------------------------------- portada */

function Portada({ actual, onEmpezar }: { actual: EstadoExamen | null; onEmpezar: () => void }) {
  const p = useProgreso();
  const listo = INSIGNIAS.find((b) => b.id === 'listo')?.ganada(p) ?? false;
  const completos = MODULOS.filter((m) => INSIGNIAS.find((b) => b.id === `mod-${m.id}`)?.ganada(p)).length;
  const [confirmo, setConfirmo] = useState(false);
  const [descartar, setDescartar] = useState(false);
  const ini = p.alumno.ini || 'CL';
  const aMedias = actual && actual.fase !== 'resultado';
  const puedeEmpezar = !!p.alumno.ini && (listo || confirmo);
  const banco = bancoTeoria();

  const empezar = () => {
    if (!p.alumno.ini) return;
    examen.empezar({ ...p.alumno }, !listo);
    onEmpezar();
  };

  return (
    <div className="wrap ex-pagina">
      <motion.section className="exam-hero ex-hero" initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
        <div className="ex-hero-grid">
          <div className="ex-hero-txt">
            <p className="ex-kicker">Taller Axional · prueba final</p>
            <h1>Examen final</h1>
            <p className="lead muted">
              Demuestra que sabes llevar un caso real de punta a punta en Axional: del alta del proveedor al cobro del cliente, de memoria y sin consultar nada. Si apruebas, consigues tu certificado.
            </p>
            <div className="ex-stats">
              <div className="ex-stat">
                <b>{NUM_TEORIA}</b>
                <span>preguntas · {MIN_TEORIA} min</span>
              </div>
              <div className="ex-stat">
                <b>9</b>
                <span>encargos en Axional</span>
              </div>
              <div className="ex-stat">
                <b>30 / 70</b>
                <span>teoría / práctica</span>
              </div>
            </div>
          </div>
          <div className="ex-hero-deco">
            <OrbitaExamen codigo={aMedias ? actual.codigo : `EX-${ini}-····`} />
          </div>
        </div>
      </motion.section>

      <div className="ex-portada-grid">
        <section className="sheet pad">
          <h2>Cómo funciona</h2>
          <ol className="ex-reglas">
            <li>
              <b>Teoría.</b> {NUM_TEORIA} preguntas tipo test con {MIN_TEORIA} minutos, sorteadas de un banco de {banco.tests + banco.video + banco.criterio}: los tests de los seis manuales, el vídeo de compras y preguntas de criterio («¿qué pasa si…?»). Puedes ir adelante y atrás; no verás si aciertas hasta el final. Vale el 30 %.
            </li>
            <li>
              <b>Práctica.</b> Nueve encargos encadenados que haces de verdad en la demo de Axional (base TUTORIAL). Al terminar cada uno anotas aquí lo que ves en pantalla: números de documento, importes, cuentas y estados. Vale el 70 %.
            </li>
            <li>
              <b>Tus datos son únicos.</b> Proveedor <code className="k">T{ini}EX</code>, cliente <code className="k">C{ini}EX</code> y un código de examen que pondrás en «Su referencia». Las cantidades y los precios solo los tienes tú.
            </li>
            <li>
              <b>De memoria.</b> Durante el examen se ocultan la navegación y las ayudas. No abras los manuales ni los vídeos.
            </li>
            <li>
              <b>Aprobado.</b> Un 80 % en la teoría y un 80 % en la práctica. La coherencia de tu cadena de documentos también puntúa.
            </li>
            <li>
              <b>Validación.</b> Al aprobar se genera un acta. Mándala al examinador: lo comprueba en Axional y te da un código para validar tu certificado.
            </li>
          </ol>
          <p className="muted small">El examen se guarda en este navegador. Si cierras la pestaña, puedes reanudarlo; el tiempo de la teoría sigue corriendo.</p>
        </section>

        <section className="sheet pad ex-arranque">
          {!p.alumno.ini ? (
            <div className="callout nota">
              <b>Primero, tu nombre</b>
              Necesitamos tu nombre e iniciales para generar tus datos. Escríbelos en la ventana de bienvenida.
            </div>
          ) : (
            <>
              <h2>{aMedias ? 'Tienes un examen a medias' : `¿Listo, ${p.alumno.nombre.split(' ')[0]}?`}</h2>
              {aMedias ? (
                <p className="muted">
                  Código <code className="k">{actual.codigo}</code>, en la parte de {actual.fase === 'teoria' ? 'teoría' : 'práctica'}. Empezado el {new Date(actual.inicio).toLocaleString('es-ES', { dateStyle: 'medium', timeStyle: 'short' })}.
                </p>
              ) : listo ? (
                <div className="callout solucion">
                  <b>Tienes los seis módulos completados</b>
                  Puedes empezar cuando quieras.
                </div>
              ) : (
                <div className="callout nota">
                  <b>Aún no has completado todos los módulos</b>
                  Llevas {completos} de {MODULOS.length}. Te recomendamos terminarlos antes. Si aun así quieres hacer el examen, puedes; quedará anotado en el acta.
                  <label className={`check ${confirmo ? 'on' : ''}`} style={{ borderBottom: 0, paddingBottom: 0 }}>
                    <input type="checkbox" checked={confirmo} onChange={(e) => setConfirmo(e.target.checked)} />
                    <span className="box">{confirmo && <Icon name="check" size={16} stroke={3} />}</span>
                    <span className="check-txt" style={{ textDecoration: 'none', color: 'var(--ink)' }}>
                      Lo sé y quiero empezar igualmente
                    </span>
                  </label>
                </div>
              )}
              <div className="ex-botones">
                {aMedias ? (
                  <>
                    <button className="btn arc" onClick={onEmpezar}>
                      <Icon name="play" size={18} /> Reanudar examen
                    </button>
                    {!descartar ? (
                      <button className="btn ghost" onClick={() => setDescartar(true)}>
                        Descartar y empezar otro
                      </button>
                    ) : (
                      <button
                        className="btn ghost ex-peligro"
                        onClick={() => {
                          examen.descartar();
                          setDescartar(false);
                        }}
                      >
                        Sí, descartar este examen
                      </button>
                    )}
                  </>
                ) : (
                  <button className="btn arc ex-cta" disabled={!puedeEmpezar} onClick={empezar}>
                    <Icon name="reloj" size={18} /> Empezar examen
                  </button>
                )}
              </div>
              <p className="muted small">
                Ten abierta la demo en otra pestaña: <a href={DEMO_URL} target="_blank" rel="noreferrer">nextdemo.geasa.eu</a>, base TUTORIAL.
              </p>
            </>
          )}
          <p className="small">
            <Link to="/certificado">Ver mi certificado</Link>
          </p>
        </section>
      </div>
    </div>
  );
}

/* ---------------------------------------------------------------- teoría */

function Teoria({ ex }: { ex: EstadoExamen }) {
  const [i, setI] = useState(() => Math.max(0, ex.respTeoria.findIndex((r) => r === null)));
  const [dir, setDir] = useState(1);
  const [confirmar, setConfirmar] = useState(false);
  const reducir = useReducedMotion();
  const ahora = useAhora();
  const limite = new Date(ex.inicio).getTime() + MIN_TEORIA * 60_000;
  const queda = limite - ahora;
  const sinResponder = ex.respTeoria.filter((r) => r === null).length;

  useEffect(() => {
    if (queda <= 0) examen.cerrarTeoria();
  }, [queda]);

  const q = ex.teoria[i];
  const ir = (n: number) => {
    setDir(n > i ? 1 : -1);
    setI(Math.max(0, Math.min(ex.teoria.length - 1, n)));
    setConfirmar(false);
  };

  return (
    <div className="wrap ex-pagina">
      <BarraExamen titulo="Teoría" sub={`Pregunta ${i + 1} de ${ex.teoria.length}`} codigo={ex.codigo}>
        <span className={`timer ${queda < 3 * 60_000 ? 'ex-urgente' : ''}`} role="timer" aria-label={`Quedan ${reloj(queda)}`}>
          <Icon name="reloj" size={18} /> {reloj(queda)}
        </span>
      </BarraExamen>

      <div className="ex-dots" role="tablist" aria-label="Preguntas">
        {ex.teoria.map((_, k) => (
          <button key={k} role="tab" aria-selected={k === i} className={`${ex.respTeoria[k] !== null ? 'hecha' : ''} ${k === i ? 'cur' : ''}`} onClick={() => ir(k)} aria-label={`Pregunta ${k + 1}${ex.respTeoria[k] !== null ? ', respondida' : ''}`}>
            {k + 1}
          </button>
        ))}
      </div>

      <div className="ex-q-wrap">
        <AnimatePresence mode="wait" custom={dir}>
          <motion.section
            key={i}
            className="sheet pad ex-q"
            initial={reducir ? false : { opacity: 0, x: 40 * dir, rotateY: 8 * dir }}
            animate={{ opacity: 1, x: 0, rotateY: 0 }}
            exit={reducir ? undefined : { opacity: 0, x: -40 * dir, rotateY: -8 * dir }}
            transition={{ duration: 0.28 }}
          >
            <span className="ex-origen">{etiquetaOrigen(q.origen)}</span>
            <h2 className="ex-q-txt">{q.pregunta}</h2>
            <div role="radiogroup" aria-label="Opciones">
              {q.opciones.map((op, k) => {
                const sel = ex.respTeoria[i] === k;
                return (
                  <motion.button
                    key={k}
                    role="radio"
                    aria-checked={sel}
                    className={`quiz-opt ${sel ? 'sel' : ''}`}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => {
                      examen.responderTeoria(i, k);
                      if (i < ex.teoria.length - 1) setTimeout(() => ir(i + 1), reducir ? 0 : 260);
                    }}
                  >
                    <span className="letter">{'ABCD'[k]}</span>
                    <span>{op}</span>
                  </motion.button>
                );
              })}
            </div>
          </motion.section>
        </AnimatePresence>
      </div>

      <div className="ex-nav">
        <button className="btn ghost" onClick={() => ir(i - 1)} disabled={i === 0}>
          <Icon name="atras" size={18} /> Anterior
        </button>
        {i < ex.teoria.length - 1 && (
          <button className="btn ghost" onClick={() => ir(i + 1)}>
            Siguiente
          </button>
        )}
        <span style={{ flex: 1 }} />
        {!confirmar ? (
          <button className="btn" onClick={() => (sinResponder ? setConfirmar(true) : examen.cerrarTeoria())}>
            Terminar la teoría
          </button>
        ) : (
          <div className="ex-confirma" role="alert">
            <span>Te quedan {sinResponder} sin responder. Cuentan como fallo.</span>
            <button className="btn" onClick={() => examen.cerrarTeoria()}>
              Terminar igualmente
            </button>
            <button className="btn ghost" onClick={() => setConfirmar(false)}>
              Seguir
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

function BarraExamen({ titulo, sub, codigo, children }: { titulo: string; sub: string; codigo: string; children?: ReactNode }) {
  return (
    <div className="ex-barra">
      <div>
        <b>{titulo}</b>
        <span className="muted small"> · {sub}</span>
      </div>
      <code className="k ex-barra-cod">{codigo}</code>
      {children}
    </div>
  );
}

/* ---------------------------------------------------------------- práctica */

function Practica({ ex }: { ex: EstadoExamen }) {
  const caso = useMemo(() => generarCaso(ex.codigo), [ex.codigo]);
  const [i, setI] = useState(0);
  const [entregar, setEntregar] = useState(false);
  const ahora = useAhora();
  const desde = new Date(ex.finTeoria ?? ex.inicio).getTime();
  const reducir = useReducedMotion();
  const tarea = caso.tareas[i];
  const topRef = useRef<HTMLDivElement>(null);

  const rellenos = (t: TareaExamen) => t.campos.filter((c) => (ex.resp[c.id] ?? '').trim()).length;
  const vacios = caso.tareas.reduce((s, t) => s + t.campos.length - rellenos(t), 0);
  const malFormato = caso.tareas.flatMap((t) => t.campos).filter((c) => !formatoValido(c, ex.resp[c.id] ?? '')).length;

  const ir = (n: number) => {
    setI(n);
    setEntregar(false);
    topRef.current?.scrollIntoView({ behavior: reducir ? 'auto' : 'smooth', block: 'start' });
  };

  return (
    <div className="wrap ex-pagina" ref={topRef}>
      <BarraExamen titulo="Práctica" sub={`Encargo ${i + 1} de ${caso.tareas.length}`} codigo={ex.codigo}>
        <span className="timer" role="timer" aria-label={`Llevas ${reloj(ahora - desde)}`}>
          <Icon name="reloj" size={18} /> {reloj(ahora - desde)}
        </span>
      </BarraExamen>

      <section className="ex-caso">
        <div>
          <span className="muted small">Tu código de examen</span>
          <div className="ex-codigo">{ex.codigo}</div>
        </div>
        <dl>
          <div>
            <dt>Proveedor</dt>
            <dd>{caso.proveedor}</dd>
          </div>
          <div>
            <dt>Cliente</dt>
            <dd>{caso.cliente}</dd>
          </div>
          <div>
            <dt>Empresa</dt>
            <dd>0 · CENTRAL · almacén 0</dd>
          </div>
          <div>
            <dt>Axional</dt>
            <dd>
              <a href={DEMO_URL} target="_blank" rel="noreferrer">
                nextdemo · TUTORIAL
              </a>
            </dd>
          </div>
        </dl>
      </section>

      <nav className="ex-tareas" aria-label="Encargos">
        {caso.tareas.map((t, k) => {
          const n = rellenos(t);
          const hecho = n === t.campos.length;
          return (
            <button key={t.id} className={`ex-tarea-tab ${k === i ? 'cur' : ''} ${hecho ? 'hecha' : ''}`} onClick={() => ir(k)} aria-current={k === i ? 'step' : undefined}>
              <span className="ex-tarea-num">{hecho ? <Icon name="check" size={14} stroke={3} /> : k + 1}</span>
              <span className="ex-tarea-nom">{t.titulo}</span>
            </button>
          );
        })}
      </nav>

      <AnimatePresence mode="wait">
        <motion.article
          key={tarea.id}
          className="ex-encargo"
          initial={reducir ? false : { opacity: 0, y: 24, rotateX: -6 }}
          animate={{ opacity: 1, y: 0, rotateX: 0 }}
          exit={reducir ? undefined : { opacity: 0, y: -12 }}
          transition={{ duration: 0.35, ease: [0.2, 0.7, 0.2, 1] }}
        >
          <header className="ex-encargo-cab">
            <span className="ex-encargo-n">{String(i + 1).padStart(2, '0')}</span>
            <div>
              <span className="muted small">{tarea.modulo === 'pantalla' ? 'Pregunta de pantalla' : 'Encargo del cliente'}</span>
              <h2>{tarea.titulo}</h2>
            </div>
          </header>
          <p className="ex-encargo-txt">{tarea.encargo}</p>
          {tarea.datos.length > 0 && (
            <dl className="ex-datos">
              {tarea.datos.map((d) => (
                <div key={d.k}>
                  <dt>{d.k}</dt>
                  <dd>{d.v}</dd>
                </div>
              ))}
            </dl>
          )}
          <div className="ex-declara">
            <h3>{tarea.modulo === 'pantalla' ? 'Tu respuesta' : 'Lo que has registrado en Axional'}</h3>
            {tarea.campos.map((c) => (
              <Campo key={c.id} c={c} valor={ex.resp[c.id] ?? ''} />
            ))}
          </div>
        </motion.article>
      </AnimatePresence>

      <div className="ex-nav">
        <button className="btn ghost" onClick={() => ir(i - 1)} disabled={i === 0}>
          <Icon name="atras" size={18} /> Anterior
        </button>
        <span style={{ flex: 1 }} />
        {i < caso.tareas.length - 1 ? (
          <button className="btn" onClick={() => ir(i + 1)}>
            Siguiente encargo
          </button>
        ) : !entregar ? (
          <button className="btn arc" onClick={() => setEntregar(true)}>
            Entregar examen
          </button>
        ) : null}
      </div>

      <AnimatePresence>
        {entregar && (
          <motion.div className="sheet pad ex-entrega" role="alertdialog" aria-label="Confirmar entrega" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 20 }}>
            <h3>¿Entregas el examen?</h3>
            {vacios > 0 && <p>Te quedan {vacios} datos sin rellenar. Cuentan como fallo.</p>}
            {malFormato > 0 && <p className="ex-error-txt">Hay {malFormato} datos con un formato que no encaja. Revísalos.</p>}
            {vacios === 0 && malFormato === 0 && <p>Lo tienes todo rellenado. Una vez entregado ya no se puede cambiar.</p>}
            <div className="ex-botones">
              <button className="btn arc" onClick={() => examen.entregar()}>
                Sí, entregar
              </button>
              <button className="btn ghost" onClick={() => setEntregar(false)}>
                Repasar antes
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

const PISTA_FORMATO: Record<string, string> = {
  doc: 'Formato: serie y seis cifras, como en Axional',
  entero: 'Solo el número',
  importe: 'Un importe, por ejemplo 1.234,56',
  cuenta: 'Cinco cifras de la cuenta, por ejemplo 12345',
};

function Campo({ c, valor }: { c: CampoExamen; valor: string }) {
  const id = `campo-${c.id.replace('.', '-')}`;
  const ok = formatoValido(c, valor);
  const set = (v: string) => examen.responder(c.id, v);
  if (c.tipo === 'ruta') {
    return (
      <div className="ex-campo">
        <span className="ex-campo-lbl">{c.etiqueta}</span>
        <RutaFichas fichas={c.fichas ?? []} valor={valor} onChange={set} etiqueta={c.etiqueta} />
      </div>
    );
  }
  if (c.tipo === 'opcion') {
    return (
      <fieldset className="ex-campo">
        <legend className="ex-campo-lbl">{c.etiqueta}</legend>
        <div className="ex-opciones">
          {(c.opciones ?? []).map((o) => (
            <button type="button" key={o} className={`ex-opcion ${valor === o ? 'on' : ''}`} aria-pressed={valor === o} onClick={() => set(o)}>
              {o}
            </button>
          ))}
        </div>
      </fieldset>
    );
  }
  return (
    <div className="ex-campo">
      <label className="ex-campo-lbl" htmlFor={id}>
        {c.etiqueta}
      </label>
      <input
        id={id}
        className={`field-input ex-input ${!ok ? 'mal' : ''} ${c.tipo === 'importe' || c.tipo === 'cuenta' || c.tipo === 'entero' ? 'num' : ''}`}
        value={valor}
        placeholder={c.placeholder}
        inputMode={c.tipo === 'importe' ? 'decimal' : c.tipo === 'entero' || c.tipo === 'cuenta' ? 'numeric' : 'text'}
        autoCapitalize={c.tipo === 'doc' || c.tipo === 'texto' ? 'characters' : 'off'}
        autoComplete="off"
        spellCheck={false}
        aria-invalid={!ok}
        aria-describedby={!ok ? `${id}-err` : undefined}
        onChange={(e) => set(c.tipo === 'doc' ? e.target.value.toUpperCase() : e.target.value)}
      />
      {!ok && (
        <span id={`${id}-err`} className="ex-error-txt small">
          {PISTA_FORMATO[c.tipo] ?? 'Revisa el formato'}
        </span>
      )}
    </div>
  );
}

/* ---------------------------------------------------------------- resultado */

function ResultadoVista({ ex, onNuevo }: { ex: EstadoExamen; onNuevo: () => void }) {
  const r = ex.resultado!;
  const caso = useMemo(() => generarCaso(ex.codigo), [ex.codigo]);
  const reducir = useReducedMotion();
  const [copiado, setCopiado] = useState(false);
  const [nuevo, setNuevo] = useState(false);
  const texto = useMemo(() => (r.aprobado ? actaTexto(crearActa(ex)) : ''), [ex, r.aprobado]);
  const lanzado = useRef(false);

  useEffect(() => {
    if (!r.aprobado || reducir || lanzado.current) return;
    lanzado.current = true;
    const t = setTimeout(() => {
      void confetti({ particleCount: 160, spread: 90, origin: { y: 0.45 }, colors: MARCA, disableForReducedMotion: true });
    }, 1400);
    return () => clearTimeout(t);
  }, [r.aprobado, reducir]);

  return (
    <div className="wrap ex-pagina">
      <motion.section className="exam-hero ex-hero ex-res" initial={{ opacity: 0, scale: 0.97 }} animate={{ opacity: 1, scale: 1 }}>
        <div className="ex-res-grid">
          <div>
            <p className="ex-kicker">Examen {ex.codigo}</p>
            <h1>{r.aprobado ? '¡Aprobado!' : 'Esta vez no'}</h1>
            <p className="lead muted">
              {r.aprobado
                ? 'Has superado las dos partes. Manda el acta al examinador para que valide tu certificado.'
                : `Necesitas un ${Math.round(APROBADO_EXAMEN * 100)} % en la teoría y en la práctica. Repasa lo que ha fallado y vuelve a intentarlo con un caso nuevo.`}
            </p>
            <div className="ex-global">
              Nota global <b>{num2.format(r.global * 100)} %</b>
            </div>
          </div>
          <div className="ex-anillos">
            <AnilloNota valor={r.teoria} etiqueta={`Teoría · ${r.aciertos}/${r.totalTeoria}`} />
            <AnilloNota valor={r.practica} etiqueta={`Práctica · ${r.puntos}/${r.maxPuntos} ptos`} />
          </div>
        </div>
      </motion.section>

      <div className="ex-res-cols">
        <section className="sheet pad">
          <h2>Desglose de la práctica</h2>
          <ul className="ex-barras">
            {r.tareas.map((t, k) => (
              <li key={t.id}>
                <span>{t.titulo}</span>
                <span className="ex-barra-num">
                  {t.puntos}/{t.max}
                </span>
                <div className="meter" aria-hidden="true">
                  <motion.i initial={{ width: 0 }} animate={{ width: `${(t.puntos / t.max) * 100}%` }} transition={{ delay: 0.3 + k * 0.06, duration: 0.6 }} style={{ background: t.puntos / t.max >= APROBADO_EXAMEN ? 'var(--arc-deep)' : 'var(--signal)' }} />
                </div>
              </li>
            ))}
          </ul>
          <h3 style={{ marginTop: 24 }}>Coherencia de la cadena</h3>
          <ul className="ex-coh">
            {r.coherencia.map((c) => (
              <li key={c.id} className={c.ok ? 'ok' : 'mal'}>
                <span aria-hidden="true">{c.ok ? '✓' : '✕'}</span> {c.texto}
                <span className="sr-only">{c.ok ? ' (bien)' : ' (no)'}</span>
              </li>
            ))}
          </ul>
        </section>

        {r.aprobado ? (
          <section className="sheet pad ex-acta">
            <h2>Tu acta</h2>
            <p className="muted">Cópiala y mándasela al examinador. Él comprobará en Axional lo que has registrado y te dará un código de validación.</p>
            <textarea readOnly value={texto} rows={10} aria-label="Acta del examen" onFocus={(e) => e.currentTarget.select()} />
            <div className="ex-botones">
              <button
                className="btn"
                onClick={async () => {
                  setCopiado(await copiar(texto));
                  setTimeout(() => setCopiado(false), 2200);
                }}
              >
                {copiado ? 'Copiada' : 'Copiar acta'}
              </button>
              <button className="btn ghost" onClick={() => descargar(`acta-${ex.codigo}.json`, JSON.stringify(crearActa(ex), null, 2))}>
                Descargar JSON
              </button>
              <Link className="btn arc" to="/certificado">
                Ver mi certificado
              </Link>
            </div>
          </section>
        ) : (
          <section className="sheet pad">
            <h2>Siguiente intento</h2>
            <p className="muted">Tendrás un código nuevo, otras cantidades y otras preguntas. Repasa antes los módulos donde más has fallado.</p>
            {!nuevo ? (
              <button className="btn arc" onClick={() => setNuevo(true)}>
                Preparar otro intento
              </button>
            ) : (
              <div className="ex-botones">
                <button className="btn arc" onClick={onNuevo}>
                  Sí, empezar de cero
                </button>
                <button className="btn ghost" onClick={() => setNuevo(false)}>
                  Todavía no
                </button>
              </div>
            )}
          </section>
        )}
      </div>

      <details className="sheet pad ex-revision">
        <summary>
          <h2>Revisa la teoría</h2>
        </summary>
        <ol>
          {ex.teoria.map((q, k) => {
            const tu = ex.respTeoria[k];
            const bien = tu === q.correcta;
            return (
              <li key={k} className={bien ? 'ok' : 'mal'}>
                <span className="ex-origen">{etiquetaOrigen(q.origen)}</span> <b>{q.pregunta}</b>
                <div className="small">
                  Tu respuesta: {tu === null ? 'sin responder' : q.opciones[tu]} {bien ? '✓' : '✕'}
                  {!bien && <> · Correcta: {q.opciones[q.correcta]}</>}
                </div>
                <div className="small muted">{q.explicacion}</div>
              </li>
            );
          })}
        </ol>
      </details>

      <details className="sheet pad ex-revision">
        <summary>
          <h2>Revisa la práctica</h2>
        </summary>
        {caso.tareas.map((t) => (
          <div key={t.id} className="ex-rev-tarea">
            <h3>{t.titulo}</h3>
            <table className="fields">
              <tbody>
                {t.campos.map((c) => {
                  const v = corregirCampo(c, ex.resp[c.id]);
                  return (
                    <tr key={c.id} className={v === 'ok' ? 'ok' : 'mal'}>
                      <td>{c.etiqueta}</td>
                      <td>{ex.resp[c.id] || '—'}</td>
                      <td>{v === 'ok' ? '✓' : c.esperado !== undefined ? `✕ ${typeof c.esperado === 'number' ? num2.format(c.esperado) : c.esperado}` : '✕ formato'}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        ))}
      </details>
    </div>
  );
}
