import { useEffect, useMemo, useRef, useState, type ReactNode } from 'react';
import { enviarActa, enlaceCorreo } from '../lib/envio';
import { Link } from 'react-router-dom';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import confetti from 'canvas-confetti';
import { Icon } from '../components/Icon';
import { AnillosResultado, LeyendaAnillo, SECUENCIA } from '../components/examen/Deco';
import { PortadaEspacio } from '../components/examen/Espacio3D';
import { PreguntaVista, RevisionPregunta } from '../components/examen/Preguntas';
import { Hiperespacio, OrbitaProgreso } from '../components/examen/Viaje';
import { Constelacion, DesgloseTeoria } from '../components/examen/Desglose';
import { RutaFichas } from '../components/examen/RutaFichas';
import { copiar, descargar, reloj, useAhora, useArriba, useContador } from '../components/examen/util';
import { useProgreso } from '../lib/progress';
import { INSIGNIAS } from '../lib/badges';
import { MODULOS } from '../content';
import { num2 } from '../lib/texto';
import {
  APROBADO_EXAMEN,
  MIN_TEORIA,
  NOMBRE_TIPO,
  NUM_TEORIA,
  REPARTO,
  aciertaTeoria,
  bancoTeoria,
  desgloseTeoria,
  esTest,
  respondida,
  tipoDe,
  type RespuestaTeoria,
  type TipoPregunta,
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
import { NUM_TAREAS } from '../lib/examen';
import './examen.css';
import './examen-espacio.css';

const etiquetaOrigen = (o: string) => (o === 'criterio' ? 'Criterio' : o.startsWith('vídeo') ? o.replace('vídeo', 'Vídeo de compras ·') : `Manual de ${MODULOS.find((m) => m.id === o)?.titulo.toLowerCase() ?? o}`);

const MARCA = ['#5ff0d2', '#6fe9ff', '#8b7bff', '#f6b65a', '#ffffff'];
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
  const reducir = useReducedMotion();
  // El recorte del titular solo hace falta mientras entra: luego estorba al brillo del texto
  const [titularListo, setTitularListo] = useState(!!reducir);
  useArriba();

  const empezar = () => {
    if (!p.alumno.ini) return;
    examen.empezar({ ...p.alumno }, !listo);
    onEmpezar();
  };

  return (
    <div className="wrap ex-pagina">
      <section className="ex-hero ex-profundo">
        <div className="ex-hero-grid">
          <div className="ex-hero-txt">
            <motion.p className="ex-kicker" initial={reducir ? false : { opacity: 0, x: -12 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.5 }}>
              Practicando Axional Deister VNext · prueba final
            </motion.p>
            <h1 className="ex-titular ax-glow-text" aria-label="Examen final">
              {['Examen', 'final'].map((w, k) => (
                <span key={w} className={`ex-titular-clip ${titularListo ? 'libre' : ''}`} aria-hidden="true">
                  <motion.span
                    className="ex-titular-w"
                    initial={reducir ? false : { y: '105%', rotate: 4 }}
                    animate={{ y: '0%', rotate: 0 }}
                    transition={{ duration: 0.8, delay: 0.12 + k * 0.14, ease: [0.2, 0.8, 0.2, 1] }}
                    onAnimationComplete={() => k === 1 && setTitularListo(true)}
                  >
                    {w}
                  </motion.span>
                </span>
              ))}
            </h1>
            <motion.p className="lead muted" initial={reducir ? false : { opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.45 }}>
              Demuestra que sabes llevar un caso real de punta a punta en Axional: del alta del proveedor al cobro del cliente, de memoria y sin consultar nada. Si apruebas, consigues tu certificado.
            </motion.p>
            <div className="ex-stats">
              <Stat k={0} valor={NUM_TEORIA} texto={`preguntas · ${MIN_TEORIA} min`} />
              <Stat k={1} valor={NUM_TAREAS} texto="encargos en Axional" />
              <Stat k={2} valor={30} valor2={70} texto="teoría / práctica" />
            </div>
          </div>
          <div className="ex-hero-deco">
            <PortadaEspacio codigo={aMedias ? actual.codigo : `EX-${ini}-····`} />
          </div>
        </div>
      </section>

      <TiposPregunta />

      <div className="ex-portada-grid">
        <section className="sheet pad">
          <h2>Cómo funciona</h2>
          <ol className="ex-reglas">
            <li>
              <b>Teoría.</b> {NUM_TEORIA} preguntas con {MIN_TEORIA} minutos, sorteadas de un banco de más de {banco.tests + banco.clic + banco.video + banco.criterio + banco.otras}. Hay test, «¿dónde harías clic?» sobre capturas reales de Axional, circuitos que ordenar, parejas que relacionar, datos que calcular y una pregunta de cada capítulo del vídeo de compras. Cubre los seis manuales y los módulos de finanzas. Puedes ir adelante y atrás; no verás si aciertas hasta el final. Vale el 30 %.
            </li>
            <li>
              <b>Práctica.</b> {NUM_TAREAS} encargos encadenados que haces de verdad en la demo de Axional (base TUTORIAL). Al terminar cada uno anotas aquí lo que ves en pantalla: números de documento, importes, cuentas y estados. Vale el 70 %.
            </li>
            <li>
              <b>Tus datos son únicos.</b> Proveedor <code className="k">T{ini}EX</code>, cliente <code className="k">C{ini}EX</code> y un código de examen que pondrás en la «Referencia» del pedido, en «Factura proveedor» y en el «Documento» del asiento. Las cantidades y los precios solo los tienes tú.
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
                  <b>Tienes todos los módulos completados</b>
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
                  <button className="btn arc lg ex-cta" disabled={!puedeEmpezar} onClick={empezar}>
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

const TIPOS_PORTADA: { tipo: TipoPregunta | 'video'; n: number; titulo: string; texto: string; icono: string }[] = [
  { tipo: 'clic', n: REPARTO.clic, titulo: '¿Dónde harías clic?', texto: 'Una captura real por manual. Toca el botón o el campo.', icono: 'taller' },
  { tipo: 'video', n: REPARTO.video, titulo: 'Del vídeo', texto: 'Una por capítulo, con su fotograma y su minuto.', icono: 'video' },
  { tipo: 'orden', n: REPARTO.orden, titulo: 'Ordenar', texto: 'Pon en orden los pasos de un circuito.', icono: 'grip' },
  { tipo: 'relacion', n: REPARTO.relacion, titulo: 'Relacionar', texto: 'Une cuentas, documentos y estados.', icono: 'flecha' },
  { tipo: 'dato', n: REPARTO.dato, titulo: 'Completar', texto: 'Calcula un importe o escribe la cuenta.', icono: 'asiento' },
  { tipo: 'test', n: REPARTO.test + REPARTO.criterio, titulo: 'Test y criterio', texto: 'De los manuales y «¿qué pasa si…?».', icono: 'cerebro' },
];

function TiposPregunta() {
  const reducir = useReducedMotion();
  return (
    <section className="ext-tipos" aria-label="Tipos de pregunta de la teoría">
      {TIPOS_PORTADA.map((t, k) => (
        <motion.div
          key={t.tipo}
          className={`ext-tipo glass t-${t.tipo}`}
          initial={reducir ? false : { opacity: 0, z: -400, rotateX: 35, y: 30 }}
          animate={{ opacity: 1, z: 0, rotateX: 0, y: 0 }}
          transition={{ duration: 0.7, delay: 0.5 + k * 0.08, ease: [0.2, 0.8, 0.2, 1] }}
        >
          <span className="ext-ico" aria-hidden="true">
            <Icon name={t.icono} size={18} />
          </span>
          <b className="ext-n">{t.n}</b>
          <span className="ext-tit">{t.titulo}</span>
          <span className="ext-txt">{t.texto}</span>
        </motion.div>
      ))}
    </section>
  );
}

function Stat({ k, valor, valor2, texto }: { k: number; valor: number; valor2?: number; texto: string }) {
  const reducir = useReducedMotion();
  const retraso = 0.6 + k * 0.12;
  const a = useContador(valor, { duracion: 1.1, retraso });
  const b = useContador(valor2 ?? 0, { duracion: 1.1, retraso });
  return (
    <motion.div
      className="ex-stat glass"
      initial={reducir ? false : { opacity: 0, y: 16, rotateX: -40 }}
      animate={{ opacity: 1, y: 0, rotateX: 0 }}
      transition={{ duration: 0.6, delay: retraso, ease: [0.2, 0.7, 0.2, 1] }}
      aria-label={`${valor2 !== undefined ? `${valor} / ${valor2}` : valor} ${texto}`}
    >
      <b aria-hidden="true">
        {Math.round(a)}
        {valor2 !== undefined && <> / {Math.round(b)}</>}
      </b>
      <span aria-hidden="true">{texto}</span>
    </motion.div>
  );
}

/* ---------------------------------------------------------------- teoría */

const esCampoTexto = (t: EventTarget | null) => t instanceof HTMLElement && (t.isContentEditable || /^(INPUT|TEXTAREA|SELECT)$/.test(t.tagName));

const ICONO_TIPO: Record<TipoPregunta, string> = { test: 'cerebro', clic: 'taller', orden: 'grip', relacion: 'flecha', dato: 'asiento' };
const ENUNCIADO: Record<TipoPregunta, string> = {
  test: '',
  clic: 'Busca en la captura real',
  orden: 'Ordena los pasos',
  relacion: 'Relaciona',
  dato: 'Completa el dato',
};

function Teoria({ ex }: { ex: EstadoExamen }) {
  const [i, setI] = useState(() => Math.max(0, ex.teoria.findIndex((q, k) => !respondida(q, ex.respTeoria[k]))));
  const [dir, setDir] = useState(1);
  const [confirmar, setConfirmar] = useState(false);
  const reducir = useReducedMotion();
  const ahora = useAhora();
  const total = MIN_TEORIA * 60_000;
  const limite = new Date(ex.inicio).getTime() + total;
  const queda = limite - ahora;
  const hechas = ex.teoria.map((q, k) => respondida(q, ex.respTeoria[k]));
  const sinResponder = hechas.filter((h) => !h).length;
  const avance = useRef<number | undefined>(undefined);
  const [destello, setDestello] = useState('');
  const ancho = useMedia('(min-width: 761px)');
  useArriba();

  useEffect(() => {
    if (queda <= 0) examen.cerrarTeoria();
  }, [queda]);
  useEffect(() => () => window.clearTimeout(avance.current), []);

  const q = ex.teoria[i];
  const tipo = tipoDe(q);
  const ir = (n: number) => {
    window.clearTimeout(avance.current);
    const dest = Math.max(0, Math.min(ex.teoria.length - 1, n));
    if (dest === i) return;
    setDir(dest > i ? 1 : -1);
    setI(dest);
    setConfirmar(false);
  };
  const responder = (r: RespuestaTeoria) => {
    const antes = respondida(q, ex.respTeoria[i]);
    examen.responderTeoria(i, r);
    const ahoraSi = respondida(q, r);
    if (!reducir && ahoraSi && (!antes || tipo === 'test' || tipo === 'clic')) setDestello(`${i}-${Date.now()}`);
    window.clearTimeout(avance.current);
    if (tipo === 'test' && i < ex.teoria.length - 1) avance.current = window.setTimeout(() => ir(i + 1), reducir ? 0 : 320);
  };

  // Atajos: en las de test, 1–4 o A–D responden; ← → navegan. No interfieren con campos ni con las capturas.
  const teclas = useRef({ ir, responder, i, n: esTest(q) ? q.opciones.length : 0 });
  teclas.current = { ir, responder, i, n: esTest(q) ? q.opciones.length : 0 };
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.defaultPrevented || e.altKey || e.ctrlKey || e.metaKey || esCampoTexto(e.target)) return;
      if (document.querySelector('.exq-zoom')) return;
      const t = teclas.current;
      if (e.key === 'ArrowRight') {
        e.preventDefault();
        t.ir(t.i + 1);
        return;
      }
      if (e.key === 'ArrowLeft') {
        e.preventDefault();
        t.ir(t.i - 1);
        return;
      }
      if (!t.n) return;
      const k = '1234'.indexOf(e.key) >= 0 ? '1234'.indexOf(e.key) : 'abcd'.indexOf(e.key.toLowerCase());
      if (e.key.length === 1 && k >= 0 && k < t.n) {
        e.preventDefault();
        t.responder(k);
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  const estado = queda <= 60_000 ? 'final' : queda <= 3 * 60_000 ? 'urgente' : queda <= 10 * 60_000 ? 'aviso' : 'normal';
  const anuncio = queda <= 60_000 ? 'Queda 1 minuto' : queda <= 5 * 60_000 ? 'Quedan 5 minutos' : '';

  // Llegada desde el fondo del espacio (o vuelta hacia él al ir atrás)
  const llegar = reducir ? undefined : { opacity: 0, scale: dir > 0 ? 0.55 : 1.25, z: dir > 0 ? -600 : 240, rotateX: dir > 0 ? 14 : -10, filter: 'blur(6px)' };
  const irse = reducir ? undefined : { opacity: 0, scale: dir > 0 ? 1.18 : 0.6, z: dir > 0 ? 260 : -600, rotateX: dir > 0 ? -8 : 12, filter: 'blur(6px)' };

  const saltos = (
    <div className="ex-dots" role="tablist" aria-label="Preguntas">
      {ex.teoria.map((p, k) => (
        <button key={k} role="tab" aria-selected={k === i} className={`${hechas[k] ? 'hecha' : ''} ${k === i ? 'cur' : ''} t-${tipoDe(p)}`} onClick={() => ir(k)} aria-label={`Pregunta ${k + 1}, ${NOMBRE_TIPO[tipoDe(p)].toLowerCase()}${hechas[k] ? ', respondida' : ''}`}>
          {k + 1}
        </button>
      ))}
    </div>
  );

  return (
    <div className="wrap ex-pagina">
      <BarraExamen titulo="Teoría" sub={`Pregunta ${i + 1} de ${ex.teoria.length}`} codigo={ex.codigo} estado={estado} fraccion={queda / total}>
        <NucleoTiempo fraccion={queda / total} estado={estado} texto={reloj(queda)} />
      </BarraExamen>
      <div className="sr-only" aria-live="polite">
        {anuncio}
      </div>

      <OrbitaProgreso total={ex.teoria.length} actual={i} hechas={hechas} latido={destello} />

      {ancho ? (
        saltos
      ) : (
        <details className="ex-saltos">
          <summary>
            Ir a otra pregunta · {ex.teoria.length - sinResponder} de {ex.teoria.length} respondidas
          </summary>
          {saltos}
        </details>
      )}

      <div className="ex-q-wrap">
        <Hiperespacio key={`h-${i}`} semilla={i + 1} />
        <AnimatePresence mode="wait" custom={dir}>
          <motion.section
            key={i}
            className={`sheet pad ex-q exq-t-${tipo} ${destello.startsWith(`${i}-`) ? 'exq-destello' : ''}`}
            initial={llegar}
            animate={{ opacity: 1, scale: 1, z: 0, rotateX: 0, filter: 'blur(0px)' }}
            exit={irse}
            transition={{ duration: 0.42, ease: [0.2, 0.75, 0.2, 1] }}
            aria-labelledby={`exq-titulo-${i}`}
          >
            <div className="exq-cabeza">
              <span className="ex-origen">{etiquetaOrigen(q.origen)}</span>
              <span className="exq-tipo">
                <Icon name={ICONO_TIPO[tipo]} size={14} /> {NOMBRE_TIPO[tipo]}
              </span>
            </div>
            {ENUNCIADO[tipo] && <p className="exq-enunciado">{ENUNCIADO[tipo]}</p>}
            <h2 className={`ex-q-txt ${tipo !== 'test' ? 'exq-txt-sec' : ''}`} id={`exq-titulo-${i}`}>
              {q.pregunta}
            </h2>
            <PreguntaVista q={q} resp={ex.respTeoria[i]} onResp={responder} destello={destello.startsWith(`${i}-`) ? destello : undefined} />
            {tipo === 'test' && (
              <p className="ex-atajos small muted" aria-hidden="true">
                Atajos: <kbd>1</kbd>–<kbd>4</kbd> o <kbd>A</kbd>–<kbd>D</kbd> para responder, <kbd>←</kbd> <kbd>→</kbd> para moverte.
              </p>
            )}
          </motion.section>
        </AnimatePresence>
      </div>

      <div className="ex-nav">
        <button className="btn ghost" onClick={() => ir(i - 1)} disabled={i === 0}>
          <Icon name="atras" size={18} /> Anterior
        </button>
        {i < ex.teoria.length - 1 && (
          <button className={`btn ${hechas[i] && tipo !== 'test' ? 'arc' : 'ghost'}`} onClick={() => ir(i + 1)}>
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
            <span>Te quedan {sinResponder} sin responder del todo. Cuentan como fallo.</span>
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

function NucleoTiempo({ fraccion, estado, texto }: { fraccion: number; estado: string; texto: string }) {
  const r = 15;
  const c = 2 * Math.PI * r;
  const f = Math.max(0, Math.min(1, fraccion));
  return (
    <span className={`ex-nucleo-t ex-t-${estado}`} role="timer" aria-label={`Quedan ${texto}`}>
      <span className="ex-nucleo-t-esfera" aria-hidden="true">
        <svg viewBox="0 0 40 40">
          <circle className="trk" cx="20" cy="20" r={r} />
          <circle className="val" cx="20" cy="20" r={r} strokeDasharray={c} strokeDashoffset={c * (1 - f)} transform="rotate(-90 20 20)" />
        </svg>
      </span>
      <span className="ex-nucleo-t-txt">{texto}</span>
    </span>
  );
}

function BarraExamen({ titulo, sub, codigo, estado, fraccion, children }: { titulo: string; sub: string; codigo: string; estado?: string; fraccion?: number; children?: ReactNode }) {
  return (
    <div className={`ex-barra glass ${estado ? `ex-b-${estado}` : ''}`}>
      <div>
        <b>{titulo}</b>
        <span className="muted small"> · {sub}</span>
      </div>
      <code className="k ex-barra-cod">{codigo}</code>
      {children}
      {fraccion !== undefined && (
        <span className="ex-tiempo" aria-hidden="true">
          <i style={{ transform: `scaleX(${Math.max(0, Math.min(1, fraccion))})` }} />
        </span>
      )}
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
  // «Lo que la demo no hace sola» (campo opcional notas de TareaExamen)
  const notas: string[] = tarea.notas ?? [];
  const topRef = useRef<HTMLDivElement>(null);
  const navRef = useRef<HTMLElement>(null);
  const entregaRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (entregar) entregaRef.current?.scrollIntoView({ behavior: reducir ? 'auto' : 'smooth', block: 'nearest' });
  }, [entregar, reducir]);
  useArriba();

  // La pestaña del encargo actual siempre a la vista (solo en horizontal, sin mover la página)
  useEffect(() => {
    const nav = navRef.current;
    const el = nav?.children[i] as HTMLElement | undefined;
    if (!nav || !el) return;
    const izq = el.offsetLeft - 12;
    const der = el.offsetLeft + el.offsetWidth + 12 - nav.clientWidth;
    const left = izq < nav.scrollLeft ? izq : der > nav.scrollLeft ? der : null;
    if (left !== null) nav.scrollTo({ left: Math.max(0, left), behavior: reducir ? 'auto' : 'smooth' });
  }, [i, reducir]);

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
        <span className="timer ex-crono" role="timer" aria-label={`Llevas ${reloj(ahora - desde)}`}>
          <Icon name="reloj" size={18} /> {reloj(ahora - desde)}
        </span>
      </BarraExamen>

      <section className="ex-caso ex-profundo">
        <div className="ex-caso-cod">
          <span className="ex-caso-lbl">Tu código de examen</span>
          <div className="ex-codigo">{ex.codigo}</div>
        </div>
        <dl className="ex-caso-datos">
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
            <dd>0 · CENTRAL</dd>
          </div>
          <div>
            <dt>Almacén</dt>
            <dd>0</dd>
          </div>
        </dl>
        <a className="btn arc ex-caso-demo" href={DEMO_URL} target="_blank" rel="noreferrer">
          <span>
            <small>Abre Axional</small>
            nextdemo · TUTORIAL
          </span>
          <Icon name="flecha" size={18} />
        </a>
      </section>

      <nav className="ex-tareas" aria-label="Encargos" ref={navRef}>
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
          className="ex-encargo glass"
          initial={reducir ? false : { opacity: 0, y: 24, rotateX: -6 }}
          animate={{ opacity: 1, y: 0, rotateX: 0 }}
          exit={reducir ? undefined : { opacity: 0, y: -12 }}
          transition={{ duration: 0.35, ease: [0.2, 0.7, 0.2, 1] }}
        >
          <header className="ex-encargo-cab">
            <span className="ax-card-num ex-encargo-n" aria-hidden="true">{String(i + 1).padStart(2, '0')}</span>
            <div>
              <span className="muted small">{tarea.modulo === 'pantalla' ? 'Pregunta de pantalla' : 'Encargo'}</span>
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
          {notas.length > 0 && (
            <aside className="callout nota ex-notas" aria-label="Ojo con la demo">
              <b>Ojo con la demo</b>
              <ul>
                {notas.map((n) => (
                  <li key={n}>{n}</li>
                ))}
              </ul>
            </aside>
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
          <motion.div ref={entregaRef} className="sheet pad ex-entrega" role="alertdialog" aria-label="Confirmar entrega" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 20 }}>
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
  const [nuevo, setNuevo] = useState(false);
  const acta = useMemo(() => crearActa(ex), [ex]);
  const texto = useMemo(() => actaTexto(acta), [acta]);
  const lanzado = useRef(false);
  const d = (s: number) => (reducir ? 0 : s);
  useArriba();

  // Al entregar, el acta se manda sola al correo del formador (una vez por examen).
  const [enviando, setEnviando] = useState(false);
  const enviado = ex.envio?.ok === true;
  const intentado = useRef(false);
  const enviar = () => {
    setEnviando(true);
    void enviarActa(acta, texto).then((ok) => {
      examen.marcarEnvio(ex.codigo, ok);
      setEnviando(false);
    });
  };
  useEffect(() => {
    if (enviado || intentado.current) return;
    intentado.current = true;
    enviar();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (!r.aprobado || reducir || lanzado.current) return;
    lanzado.current = true;
    const t = setTimeout(() => {
      void confetti({ particleCount: 160, spread: 90, origin: { y: 0.4 }, colors: MARCA, disableForReducedMotion: true });
    }, (SECUENCIA.veredicto + 0.3) * 1000);
    return () => clearTimeout(t);
  }, [r.aprobado, reducir]);

  return (
    <div className="wrap ex-pagina">
      <motion.section className={`ex-hero ex-profundo ex-res ${r.aprobado ? 'aprobado' : 'suspenso'}`} initial={reducir ? false : { opacity: 0, scale: 0.97 }} animate={{ opacity: 1, scale: 1 }}>
        <div className="ex-res-grid">
          <div className="ex-res-txt">
            <p className="ex-kicker">Examen {ex.codigo}</p>
            <motion.h1 className="ax-glow-text ex-veredicto" initial={reducir ? false : { opacity: 0, y: 24, scale: 0.94 }} animate={{ opacity: 1, y: 0, scale: 1 }} transition={{ delay: d(SECUENCIA.veredicto), duration: 0.6, ease: [0.2, 0.8, 0.2, 1] }}>
              {r.aprobado ? '¡Aprobado!' : 'Esta vez no'}
            </motion.h1>
            <motion.p className="lead muted" initial={reducir ? false : { opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: d(SECUENCIA.veredicto + 0.25), duration: 0.5 }}>
              {r.aprobado
                ? 'Has superado las dos partes. Manda el acta al examinador para que valide tu certificado.'
                : `Necesitas un ${Math.round(APROBADO_EXAMEN * 100)} % en la teoría y en la práctica. Repasa lo que ha fallado y vuelve a intentarlo con un caso nuevo.`}
            </motion.p>
            <motion.div className={`ex-global ${r.aprobado ? 'ok' : 'mal'}`} initial={reducir ? false : { opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: d(SECUENCIA.veredicto + 0.4) }}>
              Nota global <b>{num2.format(r.global * 100)} %</b>
            </motion.div>
          </div>
          <div className="ex-anillos">
            <AnillosResultado teoria={r.teoria} practica={r.practica} global={r.global} aprobado={r.aprobado} umbral={APROBADO_EXAMEN} />
            <div className="ex-leyendas">
              <LeyendaAnillo valor={r.teoria} nombre="Teoría" detalle={`${r.aciertos}/${r.totalTeoria} aciertos`} color={r.teoria >= APROBADO_EXAMEN ? 'linear-gradient(135deg, #5ff0d2, #8b7bff)' : '#ff8a80'} retraso={SECUENCIA.teoria} />
              <LeyendaAnillo valor={r.practica} nombre="Práctica" detalle={`${r.puntos}/${r.maxPuntos} puntos`} color={r.practica >= APROBADO_EXAMEN ? 'linear-gradient(135deg, #8b7bff, #5ff0d2)' : '#ff8a80'} retraso={SECUENCIA.practica} />
            </div>
          </div>
        </div>
      </motion.section>

      <section className="sheet pad exr-teoria" aria-labelledby="exr-teoria-t">
        <div className="exr-teoria-cab">
          <h2 id="exr-teoria-t">Tu teoría, pregunta a pregunta</h2>
          <span className="exr-teoria-total">
            <b>{r.aciertos}</b> de {r.totalTeoria}
          </span>
        </div>
        <Constelacion teoria={ex.teoria} resp={ex.respTeoria} />
        <DesgloseTeoria bloques={r.desglose ?? desgloseTeoria(ex.teoria, ex.respTeoria)} />
      </section>

      <section className={`sheet pad ex-envio ${enviado ? 'ok' : ''}`} aria-live="polite">
        {enviado ? (
          <p>
            <b>Examen enviado a tu formador</b> con tu usuario «{ex.alumno.usuario || ex.alumno.nombre}».
          </p>
        ) : enviando ? (
          <p>Enviando tu examen a tu formador…</p>
        ) : ex.envio ? (
          <>
            <p>
              <b>No se ha podido enviar tu examen.</b> Reinténtalo o mándalo desde tu correo.
            </p>
            <div className="ex-botones">
              <button className="btn arc" onClick={enviar}>
                Reintentar el envío
              </button>
              <a className="btn ghost" href={enlaceCorreo(acta, texto)}>
                Enviar desde mi correo
              </a>
            </div>
          </>
        ) : null}
      </section>


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
                  <motion.i initial={reducir ? false : { width: 0 }} animate={{ width: `${(t.puntos / t.max) * 100}%` }} transition={{ delay: d(0.3 + k * 0.06), duration: 0.6 }} style={{ background: t.puntos / t.max >= APROBADO_EXAMEN ? 'var(--arc-deep)' : 'var(--signal)' }} />
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
            <ActaBloque texto={texto} codigo={ex.codigo} json={() => JSON.stringify(acta, null, 2)} etiqueta="Acta del examen">
              <Link className="btn arc" to="/certificado">
                Ver mi certificado
              </Link>
            </ActaBloque>
          </section>
        ) : (
          <div className="ex-res-lado">
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
            <details className="sheet pad ex-acta ex-acta-intento">
              <summary>
                <h3>Acta de este intento</h3>
              </summary>
              <p className="muted small">No sirve para el certificado, pero le cuenta a tu formador qué registraste en Axional. Pásasela si quieres que lo revise contigo.</p>
              <ActaBloque texto={texto} codigo={ex.codigo} json={() => JSON.stringify(acta, null, 2)} etiqueta="Acta de este intento" filas={7} />
            </details>
          </div>
        )}
      </div>

      <details className="sheet pad ex-revision">
        <summary>
          <h2>Revisa la teoría</h2>
        </summary>
        <ol>
          {ex.teoria.map((q, k) => {
            const bien = aciertaTeoria(q, ex.respTeoria[k]);
            return (
              <li key={k} className={bien ? 'ok' : 'mal'}>
                <span className="ex-origen">{etiquetaOrigen(q.origen)}</span> <span className="exq-tipo">{NOMBRE_TIPO[tipoDe(q)]}</span> <b>{q.pregunta}</b>
                <RevisionPregunta q={q} r={ex.respTeoria[k]} />
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

function ActaBloque({ texto, codigo, json, etiqueta, filas = 10, children }: { texto: string; codigo: string; json: () => string; etiqueta: string; filas?: number; children?: ReactNode }) {
  const [copiado, setCopiado] = useState(false);
  return (
    <>
      <textarea readOnly value={texto} rows={filas} aria-label={etiqueta} onFocus={(e) => e.currentTarget.select()} />
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
        <button className="btn ghost" onClick={() => descargar(`acta-${codigo}.json`, json())}>
          Descargar JSON
        </button>
        {children}
      </div>
    </>
  );
}
