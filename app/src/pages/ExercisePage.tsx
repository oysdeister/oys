import { useRef, type KeyboardEvent } from 'react';
import { Link, useParams, useSearchParams } from 'react-router-dom';
import { AnimatePresence, LayoutGroup, motion, useReducedMotion } from 'framer-motion';
import { META, getEjercicio, todosEjercicios } from '../content';
import { APROBADO, avanceEjercicio, useProgreso } from '../lib/progress';
import { conIni } from '../lib/texto';
import { CAPITULOS_VIDEO, VIDEO_POR_EJERCICIO, VIDEO_URL, mmss, urlCapitulo } from '../lib/config';
import { Icon } from '../components/Icon';
import { Concepto } from '../components/exercise/Concepto';
import { Guiado } from '../components/exercise/Guiado';
import { DeMemoria } from '../components/exercise/DeMemoria';
import { TestEj } from '../components/exercise/TestEj';
import { DemoReal } from '../components/exercise/DemoReal';
import { Problemas } from '../components/exercise/Problemas';
import { estadoDe, pct } from '../components/exercise/util';
import './aprender.css';

const TABS = [
  { id: 'concepto', label: 'Concepto' },
  { id: 'guiado', label: 'Guiado' },
  { id: 'memoria', label: 'De memoria' },
  { id: 'test', label: 'Test' },
  { id: 'demo', label: 'En la demo real' },
  { id: 'problemas', label: 'Problemas' },
] as const;

export default function ExercisePage() {
  const { id = '' } = useParams();
  const [sp, setSp] = useSearchParams();
  const reducir = useReducedMotion();
  const p = useProgreso();
  const tabsRef = useRef<HTMLDivElement>(null);
  const hallado = getEjercicio(id);

  if (!hallado) {
    return (
      <div className="wrap" style={{ padding: '60px 0' }}>
        <h1>No encuentro ese ejercicio</h1>
        <p className="muted">Puede que el enlace esté mal escrito.</p>
        <Link className="btn" to="/">
          Volver al inicio
        </Link>
      </div>
    );
  }

  const { modulo, ejercicio: ej } = hallado;
  const ini = p.alumno.ini;
  const meta = META[modulo.id] ?? { color: 'var(--arc)', icono: 'maestros', corto: modulo.titulo };
  const e = p.ejercicios[ej.id];
  const estado = estadoDe(e, ej.checklist.length);
  const avance = avanceEjercicio(e, ej.checklist.length);
  const todos = todosEjercicios();
  const pos = todos.findIndex((x) => x.ejercicio.id === ej.id);
  const sig = todos[pos + 1];
  const tabParam = sp.get('tab');
  const tab = TABS.some((x) => x.id === tabParam) ? (tabParam as string) : 'concepto';

  const ir = (t: string) => {
    setSp(t === 'concepto' ? {} : { tab: t }, { replace: true });
    const el = tabsRef.current;
    if (el) {
      const top = el.getBoundingClientRect().top + window.scrollY - 90;
      if (window.scrollY > top) window.scrollTo({ top, behavior: reducir ? 'auto' : 'smooth' });
    }
  };

  const hechoTab: Record<string, boolean> = {
    guiado: !!e?.guiado,
    test: (e?.test ?? 0) >= APROBADO,
    demo: ej.checklist.length > 0 && (e?.demo.length ?? 0) >= ej.checklist.length,
  };

  const onTeclaTabs = (ev: KeyboardEvent<HTMLDivElement>) => {
    const k = TABS.findIndex((x) => x.id === tab);
    let n = -1;
    if (ev.key === 'ArrowRight') n = (k + 1) % TABS.length;
    else if (ev.key === 'ArrowLeft') n = (k - 1 + TABS.length) % TABS.length;
    else if (ev.key === 'Home') n = 0;
    else if (ev.key === 'End') n = TABS.length - 1;
    if (n < 0) return;
    ev.preventDefault();
    ev.stopPropagation();
    ir(TABS[n].id);
    const btn = tabsRef.current?.querySelectorAll<HTMLButtonElement>('[role=tab]')[n];
    btn?.focus();
    btn?.scrollIntoView({ block: 'nearest', inline: 'nearest' });
  };

  const capitulos = VIDEO_URL ? (VIDEO_POR_EJERCICIO[ej.id] ?? []).map((n) => CAPITULOS_VIDEO.find((c) => c.n === n)).filter((c): c is (typeof CAPITULOS_VIDEO)[number] => !!c) : [];

  return (
    <div className="wrap ex-page" style={{ ['--mod' as string]: meta.color }}>
      <nav className="crumbs" aria-label="Migas">
        <Link to="/">Inicio</Link>
        <span aria-hidden="true">/</span>
        <Link to={`/modulo/${modulo.id}`}>{modulo.titulo}</Link>
        <span aria-hidden="true">/</span>
        <span>Ejercicio {ej.numero}</span>
      </nav>

      <header className="ex-head ex-hero">
        <motion.div className="ex-num" initial={reducir ? false : { rotateY: -70, opacity: 0 }} animate={{ rotateY: 0, opacity: 1 }} transition={{ type: 'spring', stiffness: 90, damping: 14 }}>
          {ej.numero}
        </motion.div>
        <div className="ex-title">
          <div className="ex-chips">
            <Link to={`/modulo/${modulo.id}`} className="chip mod-chip">
              <Icon name={meta.icono} size={14} /> {meta.corto}
            </Link>
            <span className="chip">
              <Icon name="reloj" size={14} /> {ej.duracionMin} min
            </span>
            <span className={estado.clase}>{estado.texto}</span>
            {avance > 0 && <span className="chip">{pct(avance)}</span>}
          </div>
          <h1 className="ex-h1">{conIni(ej.titulo, ini)}</h1>
        </div>
        {sig && (
          <Link className="btn ghost sm ex-next" to={`/ejercicio/${sig.ejercicio.id}`}>
            {sig.modulo.id === modulo.id ? 'Siguiente ejercicio' : `Empezar ${META[sig.modulo.id]?.corto ?? sig.modulo.titulo}`}
          </Link>
        )}
      </header>

      {capitulos.length > 0 && (
        <div className="ex-video">
          <Icon name="video" size={18} />
          <span className="small">En el vídeo:</span>
          {capitulos.map((c) => (
            <a key={c.n} className="chip" href={urlCapitulo(c.t)} target="_blank" rel="noopener noreferrer">
              {mmss(c.t)} · {c.titulo}
            </a>
          ))}
        </div>
      )}

      <div ref={tabsRef} className="tabs ex-tabs" role="tablist" aria-label="Partes del ejercicio" onKeyDown={onTeclaTabs}>
        <LayoutGroup id={`tabs-${ej.id}`}>
          {TABS.map((x) => {
            const sel = x.id === tab;
            return (
              <button
                key={x.id}
                role="tab"
                id={`tab-${x.id}`}
                aria-selected={sel}
                aria-controls="panel-ej"
                tabIndex={sel ? 0 : -1}
                className="tab"
                onClick={() => ir(x.id)}
              >
                {sel && <motion.span layoutId="tab-pill" className="tab-pill" transition={reducir ? { duration: 0 } : { type: 'spring', stiffness: 420, damping: 34 }} />}
                {x.label}
                {hechoTab[x.id] && (
                  <span className="tick" aria-label="hecho">
                    <Icon name="check" size={11} stroke={3.5} />
                  </span>
                )}
              </button>
            );
          })}
        </LayoutGroup>
      </div>

      <AnimatePresence mode="wait" initial={false}>
        <motion.section
          key={tab}
          id="panel-ej"
          role="tabpanel"
          aria-labelledby={`tab-${tab}`}
          className="panel"
          initial={reducir ? { opacity: 0 } : { opacity: 0, y: 14, rotateX: -4 }}
          animate={{ opacity: 1, y: 0, rotateX: 0 }}
          exit={reducir ? { opacity: 0 } : { opacity: 0, y: -8 }}
          transition={{ duration: 0.26, ease: [0.2, 0.7, 0.2, 1] }}
          style={{ transformPerspective: 1400, transformOrigin: '50% 0' }}
        >
          {tab === 'concepto' && <Concepto ej={ej} ini={ini} onGuiado={() => ir('guiado')} />}
          {tab === 'guiado' && <Guiado ej={ej} modulo={modulo.id} ini={ini} onIr={ir} />}
          {tab === 'memoria' && <DeMemoria ej={ej} modulo={modulo.id} ini={ini} />}
          {tab === 'test' && <TestEj ej={ej} ini={ini} onIr={ir} />}
          {tab === 'demo' && <DemoReal ej={ej} ini={ini} />}
          {tab === 'problemas' && <Problemas ej={ej} ini={ini} />}
        </motion.section>
      </AnimatePresence>

      {sig && (
        <Link className="ex-foot sheet" to={`/ejercicio/${sig.ejercicio.id}`}>
          <span className="small muted">{sig.modulo.id === modulo.id ? 'Siguiente ejercicio' : `Siguiente módulo: ${sig.modulo.titulo}`}</span>
          <strong>
            {sig.ejercicio.numero}. {conIni(sig.ejercicio.titulo, ini)}
          </strong>
          <Icon name="flecha" />
        </Link>
      )}
    </div>
  );
}
