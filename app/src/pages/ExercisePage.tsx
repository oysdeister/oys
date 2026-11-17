import { useEffect, useRef, type KeyboardEvent } from 'react';
import { Link, useParams, useSearchParams } from 'react-router-dom';
import { AnimatePresence, LayoutGroup, motion, useReducedMotion } from 'framer-motion';
import { META, getEjercicio, todosEjercicios } from '../content';
import { APROBADO, avanceEjercicio, useProgreso } from '../lib/progress';
import { conIni } from '../lib/texto';
import { CAPITULOS_VIDEO, VIDEO_POR_EJERCICIO } from '../lib/config';
import { momentosDeEjercicio } from '../content/videoMapa';
import { Momentos } from '../components/exercise/VideoMomento';
import { Anillo } from '../components/exercise/Anillo';
import { Icon } from '../components/Icon';
import { Concepto } from '../components/exercise/Concepto';
import { Guiado } from '../components/exercise/Guiado';
import { DeMemoria } from '../components/exercise/DeMemoria';
import { TestEj } from '../components/exercise/TestEj';
import { DemoReal } from '../components/exercise/DemoReal';
import { Problemas } from '../components/exercise/Problemas';
import { Practicar } from '../erp/Practicar';
import { PRACTICAS_POR_EJERCICIO, useNotas } from '../erp/practicas';
import { estadoDe } from '../components/exercise/util';
import './aprender.css';
import './pulido.css';

const TABS = [
  { id: 'concepto', label: 'Concepto' },
  { id: 'guiado', label: 'Guiado' },
  { id: 'memoria', label: 'De memoria' },
  { id: 'test', label: 'Test' },
  { id: 'erp', label: 'Practica en el ERP' },
  { id: 'demo', label: 'En la demo real' },
  { id: 'problemas', label: 'Problemas' },
] as const;

export default function ExercisePage() {
  const { id = '' } = useParams();
  const [sp, setSp] = useSearchParams();
  const reducir = useReducedMotion();
  const p = useProgreso();
  const notasErp = useNotas();
  const tabsRef = useRef<HTMLDivElement>(null);
  const hallado = getEjercicio(id);
  const tabActual = sp.get('tab') ?? 'concepto';

  // La pestaña activa siempre a la vista en la barra deslizable (móvil)
  useEffect(() => {
    const el = tabsRef.current;
    const btn = el?.querySelector<HTMLElement>('[role=tab][aria-selected=true]');
    if (el && btn && el.scrollWidth > el.clientWidth) el.scrollTo({ left: Math.max(0, btn.offsetLeft - 24), behavior: 'smooth' });
  }, [tabActual, id]);

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
  const practicasEj = PRACTICAS_POR_EJERCICIO[ej.id] ?? [];
  const tabs = TABS.filter((x) => x.id !== 'erp' || practicasEj.length > 0);
  const tabParam = sp.get('tab');
  const tab = tabs.some((x) => x.id === tabParam) ? (tabParam as string) : 'concepto';

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
    erp: practicasEj.length > 0 && practicasEj.every((x) => (notasErp[x]?.nota ?? 0) >= 1),
    demo: ej.checklist.length > 0 && (e?.demo.length ?? 0) >= ej.checklist.length,
  };

  const onTeclaTabs = (ev: KeyboardEvent<HTMLDivElement>) => {
    const k = tabs.findIndex((x) => x.id === tab);
    let n = -1;
    if (ev.key === 'ArrowRight') n = (k + 1) % tabs.length;
    else if (ev.key === 'ArrowLeft') n = (k - 1 + tabs.length) % tabs.length;
    else if (ev.key === 'Home') n = 0;
    else if (ev.key === 'End') n = tabs.length - 1;
    if (n < 0) return;
    ev.preventDefault();
    ev.stopPropagation();
    ir(tabs[n].id);
    const btn = tabsRef.current?.querySelectorAll<HTMLButtonElement>('[role=tab]')[n];
    btn?.focus();
    btn?.scrollIntoView({ block: 'nearest', inline: 'nearest' });
  };

  const momentos = momentosDeEjercicio(ej.id);
  const nPasos = ej.secciones.reduce((n, x) => n + x.pasos.length, 0);
  const capitulos = (VIDEO_POR_EJERCICIO[ej.id] ?? []).map((n) => CAPITULOS_VIDEO.find((c) => c.n === n)).filter((c): c is (typeof CAPITULOS_VIDEO)[number] => !!c);

  return (
    <div className="wrap ex-page" style={{ ['--mod' as string]: meta.color }}>
      <header className={`ax-banner ex-banner${tab !== 'concepto' ? ' ex-compact' : ''}`} style={{ ['--mod' as string]: meta.color }}>
        <div className="ax-banner-in">
          <div className="ax-banner-text">
            <p className="ax-kicker ex-kicker">
              <Link to={`/modulo/${modulo.id}`} className="ex-back">
                <Icon name="atras" size={16} /> {modulo.titulo}
              </Link>
              <span aria-hidden="true">·</span> Ejercicio {ej.numero} de {modulo.ejercicios.length}
            </p>
            <h1>{conIni(ej.titulo, ini)}</h1>
            <p className="lead">{conIni(ej.objetivo, ini)}</p>
            <div className="ex-chips">
              <span className="chip">
                <Icon name="reloj" size={14} /> {ej.duracionMin} min
              </span>
              <span className="chip">{nPasos} pasos guiados</span>
              <span className={estado.clase}>{estado.texto}</span>
            </div>
            {momentos.length > 0 ? (
              <div className="ex-vm">
                <Momentos lista={momentos.slice(0, 3)} compacto />
              </div>
            ) : (
              capitulos.length > 0 && (
                <div className="ex-video">
                  <Icon name="video" size={18} />
                  <span>En el vídeo:</span>
                  {capitulos.map((c) => (
                    <Link key={c.n} className="chip" to={`/video/${c.n}`}>
                      Cap. {c.n} · {c.titulo}
                    </Link>
                  ))}
                </div>
              )
            )}
          </div>
          <div className="ax-banner-side ex-side">
            <motion.div className="ex-num ax-num" initial={reducir ? false : { rotateY: -70, opacity: 0 }} animate={{ rotateY: 0, opacity: 1 }} transition={{ type: 'spring', stiffness: 90, damping: 14 }}>
              {ej.numero}
            </motion.div>
            <Anillo valor={avance} size={104} etiqueta="hecho" />
          </div>
        </div>
      </header>

      <div ref={tabsRef} className="tabs ex-tabs" role="tablist" aria-label="Partes del ejercicio" onKeyDown={onTeclaTabs}>
        <LayoutGroup id={`tabs-${ej.id}`}>
          {tabs.map((x) => {
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
          {tab === 'concepto' && <Concepto ej={ej} ini={ini} modulo={modulo.id} onGuiado={() => ir('guiado')} />}
          {tab === 'guiado' && <Guiado ej={ej} modulo={modulo.id} ini={ini} onIr={ir} />}
          {tab === 'memoria' && <DeMemoria ej={ej} modulo={modulo.id} ini={ini} />}
          {tab === 'test' && <TestEj ej={ej} ini={ini} onIr={ir} />}
          {tab === 'erp' && <Practicar ids={practicasEj} ini={ini} />}
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
