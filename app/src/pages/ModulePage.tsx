import { useEffect, useLayoutEffect, useRef, useState, type CSSProperties, type ReactNode } from 'react';
import { Link, useParams } from 'react-router-dom';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import { META, MODULOS, getModulo } from '../content';
import { avanceEjercicio, ejercicioCompletado, useProgreso } from '../lib/progress';
import { avanceModulo } from '../lib/avance';
import { conIni } from '../lib/texto';
import { CapitulosSerie } from '../components/video';
import { seriesDeModulo } from '../content/videoSeries';
import { SIMS } from '../sims/registro';
import { Icon } from '../components/Icon';
import { SeccionVista } from '../components/exercise/SeccionVista';
import { estadoDe, pct, useMedia } from '../components/exercise/util';
import { FICHAS, type PiezaCircuito } from './portadaDatos';
import { useRevela } from '../components/exercise/Revela';
import './aprender.css';
import './portada.css';
import './pulido.css';

const EASE = [0.2, 0.7, 0.2, 1] as const;
const RITMO = 2800; // ms que se queda la ficha en cada pieza

function useAutoplay(n: number, reducir: boolean) {
  const [activo, setActivo] = useState(0);
  const [play, setPlay] = useState(!reducir);
  useEffect(() => {
    if (!play || n < 2) return;
    const t = setTimeout(() => setActivo((a) => (a + 1) % n), activo === 0 ? RITMO + 900 : RITMO);
    return () => clearTimeout(t);
  }, [play, activo, n]);
  return { activo, setActivo, play, setPlay };
}

function Doc({ color }: { color: string }) {
  return (
    <svg viewBox="0 0 24 30" width="30" height="38" aria-hidden="true">
      <path d="M3 2h12l6 6v20H3z" fill="var(--sheet)" stroke={color} strokeWidth="2" strokeLinejoin="round" />
      <path d="M15 2v6h6M7 14h10M7 18h10M7 22h6" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}

/** Circuito del módulo en escritorio: piezas en un arco sobre un suelo en perspectiva, y una ficha que viaja de una a otra */
function CircuitoH({ piezas, color, ini }: { piezas: PiezaCircuito[]; color: string; ini: string }) {
  const reducir = !!useReducedMotion();
  const n = piezas.length;
  const { activo, setActivo, play, setPlay } = useAutoplay(n, reducir);
  const pos = piezas.map((_, i) => {
    const f = n === 1 ? 0.5 : i / (n - 1);
    return { x: 7 + f * 86, y: 72 - Math.sin(f * Math.PI) * 40 };
  });
  const W = 1000;
  const H = 250;
  const pts = pos.map((p) => ({ x: (p.x / 100) * W, y: (p.y / 100) * H }));
  let d = `M ${pts[0].x} ${pts[0].y}`;
  for (let i = 0; i < pts.length - 1; i++) {
    const p0 = pts[i - 1] ?? pts[i];
    const p1 = pts[i];
    const p2 = pts[i + 1];
    const p3 = pts[i + 2] ?? p2;
    d += ` C ${p1.x + (p2.x - p0.x) / 6} ${p1.y + (p2.y - p0.y) / 6}, ${p2.x - (p3.x - p1.x) / 6} ${p2.y - (p3.y - p1.y) / 6}, ${p2.x} ${p2.y}`;
  }
  const pz = piezas[activo];
  const elegir = (i: number) => {
    setActivo(i);
    setPlay(false);
  };

  return (
    <div className="pc">
      <motion.div
        className="pc-stage"
        initial={reducir ? false : { rotateX: 38, opacity: 0, y: 30 }}
        whileInView={{ rotateX: 0, opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-60px' }}
        transition={{ duration: 1.1, ease: EASE }}
      >
        <div className="pc-floor" aria-hidden="true" />
        <svg className="pc-svg" viewBox={`0 0 ${W} ${H}`} preserveAspectRatio="none" aria-hidden="true">
          <path d={d} fill="none" stroke="var(--line)" strokeWidth={14} strokeLinecap="round" vectorEffect="non-scaling-stroke" />
          <motion.path
            d={d}
            fill="none"
            stroke={color}
            strokeWidth={6}
            strokeLinecap="round"
            vectorEffect="non-scaling-stroke"
            initial={{ pathLength: reducir ? 1 : 0 }}
            whileInView={{ pathLength: 1 }}
            viewport={{ once: true }}
            transition={{ duration: reducir ? 0 : 1.4, delay: 0.3, ease: [0.4, 0, 0.2, 1] }}
          />
        </svg>
        <div role="tablist" aria-label="Piezas del circuito">
          {piezas.map((p, i) => (
            <motion.button
              key={i}
              type="button"
              role="tab"
              aria-selected={i === activo}
              className={`pc-node${i === activo ? ' here' : ''}${i < activo ? ' seen' : ''}`}
              style={{ left: `${pos[i].x}%`, top: `${pos[i].y}%`, x: '-50%', y: -27 }}
              onClick={() => elegir(i)}
              initial={reducir ? false : { opacity: 0, scale: 0.4 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: reducir ? 0 : 0.35 + (i / Math.max(1, n - 1)) * 1.1, type: 'spring', stiffness: 260, damping: 18 }}
            >
              <span className="pc-dot">
                <span>{i + 1}</span>
              </span>
              <span className="pc-label">{p.t}</span>
            </motion.button>
          ))}
        </div>
        {!reducir && (
          <motion.div
            className="pc-token"
            aria-hidden="true"
            initial={false}
            animate={{ left: `${pos[activo].x}%`, top: `${pos[activo].y}%`, rotateY: activo * 360 }}
            transition={{ duration: 0.9, ease: [0.5, 0, 0.2, 1] }}
            style={{ x: '-50%', y: -100, transformPerspective: 500 }}
          >
            <motion.div animate={{ y: [0, -6, 0] }} transition={{ duration: 1.6, repeat: Infinity, ease: 'easeInOut' }}>
              <Doc color={color} />
            </motion.div>
          </motion.div>
        )}
      </motion.div>

      <div className="pc-panel" aria-live="polite">
        <span className="pc-panel-n">
          {activo + 1}
          <small>/{n}</small>
        </span>
        <AnimatePresence mode="wait" initial={false}>
          <motion.div
            key={activo}
            initial={reducir ? { opacity: 0 } : { opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={reducir ? { opacity: 0 } : { opacity: 0, y: -10 }}
            transition={{ duration: 0.25 }}
          >
            <h3>{pz.t}</h3>
            <p>{conIni(pz.d, ini)}</p>
            {pz.ej && (
              <span className="pc-ej">
                <b>Ejemplo del manual:</b> {conIni(pz.ej, ini)}
              </span>
            )}
          </motion.div>
        </AnimatePresence>
        <div className="pc-ctrl">
          <button type="button" onClick={() => elegir((activo - 1 + n) % n)} aria-label="Pieza anterior">
            <Icon name="atras" size={18} />
          </button>
          <button type="button" onClick={() => setPlay((v) => !v)} aria-label={play ? 'Pausar el recorrido' : 'Reproducir el recorrido'}>
            {play ? (
              <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                <rect x="5" y="4" width="5" height="16" rx="1.5" />
                <rect x="14" y="4" width="5" height="16" rx="1.5" />
              </svg>
            ) : (
              <Icon name="play" size={16} />
            )}
          </button>
          <button type="button" onClick={() => elegir((activo + 1) % n)} aria-label="Pieza siguiente">
            <Icon name="flecha" size={18} />
          </button>
        </div>
      </div>
    </div>
  );
}

/** Circuito en el móvil: una línea vertical con todas las piezas explicadas; el color avanza por ella */
function CircuitoV({ piezas, ini }: { piezas: PiezaCircuito[]; ini: string }) {
  const reducir = !!useReducedMotion();
  const n = piezas.length;
  const { activo, setActivo, setPlay } = useAutoplay(n, reducir);
  const refs = useRef<(HTMLLIElement | null)[]>([]);
  const [alto, setAlto] = useState(0);
  useLayoutEffect(() => {
    const li = refs.current[activo];
    if (li) setAlto(li.offsetTop + 2);
  }, [activo]);
  return (
    <ol className="pcv" aria-label="Piezas del circuito">
      <motion.span className="pcv-fill" aria-hidden="true" initial={false} animate={{ height: alto }} transition={{ duration: reducir ? 0 : 0.7, ease: EASE }} />
      {piezas.map((p, i) => (
        <li key={i} ref={(el) => { refs.current[i] = el; }} className={i === activo ? 'here' : ''}>
          <button
            type="button"
            className={`pcv-btn pc-node-v${i <= activo ? ' seen' : ''}`}
            aria-current={i === activo ? 'step' : undefined}
            onClick={() => {
              setActivo(i);
              setPlay(false);
            }}
          >
            <span className={`pc-node${i === activo ? ' here' : ''}${i < activo ? ' seen' : ''}`} style={{ position: 'static', transform: 'none', width: 'auto', minWidth: 0 }}>
              <span className="pc-dot">
                <span>{i + 1}</span>
              </span>
            </span>
            <span className="pcv-card">
              <strong>{p.t}</strong>
              <p>{conIni(p.d, ini)}</p>
              {p.ej && <span className="pc-ej">{conIni(p.ej, ini)}</span>}
            </span>
          </button>
        </li>
      ))}
    </ol>
  );
}

function Desplegable({ titulo, n, children, abiertoIni = false }: { titulo: string; n: number; children: ReactNode; abiertoIni?: boolean }) {
  const [abierto, setAbierto] = useState(abiertoIni);
  const reducir = useReducedMotion();
  return (
    <div className={`fold${abierto ? ' open' : ''}`}>
      <button className="fold-head" aria-expanded={abierto} onClick={() => setAbierto((a) => !a)}>
        <span className="fold-t">
          <span className="fold-n" aria-hidden="true">{String(n).padStart(2, '0')}</span>
          <span>{titulo}</span>
        </span>
        <motion.span className="fold-ico" animate={{ rotate: abierto ? 45 : 0 }} aria-hidden="true">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round"><path d="M12 5v14M5 12h14" /></svg>
        </motion.span>
      </button>
      <AnimatePresence initial={false}>
        {abierto && (
          <motion.div
            className="fold-body"
            initial={reducir ? { opacity: 0 } : { height: 0, opacity: 0 }}
            animate={reducir ? { opacity: 1 } : { height: 'auto', opacity: 1 }}
            exit={reducir ? { opacity: 0 } : { height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: EASE }}
          >
            <div className="fold-in">{children}</div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

/** Cabecera de sección: antetítulo pequeño con acento, titular con volumen y una línea de ayuda */
function CabSec({ id, n, kicker, titulo, texto }: { id?: string; n: number; kicker: string; titulo: string; texto?: string }) {
  const r = useRevela();
  return (
    <motion.header className="pm-cab" {...r(0, 14)}>
      <p className="kick">
        <span className="kick-n">{String(n).padStart(2, '0')}</span> {kicker}
      </p>
      <h2 id={id}>
        <span className="tx-grad">{titulo}</span>
      </h2>
      {texto && <p className="pm-cab-txt">{texto}</p>}
    </motion.header>
  );
}

/** Flecha «baja»: lleva con scroll suave a la ruta de ejercicios */
function Bajar({ destino, texto }: { destino: string; texto: string }) {
  const reducir = !!useReducedMotion();
  const ir = () => {
    const el = document.getElementById(destino);
    if (!el) return;
    el.scrollIntoView({ behavior: reducir ? 'auto' : 'smooth', block: 'start' });
    const foco = el.querySelector<HTMLElement>('h2');
    if (foco) {
      foco.setAttribute('tabindex', '-1');
      foco.focus({ preventScroll: true });
    }
  };
  return (
    <div className="pm-bajar-wrap">
      <button type="button" className="pm-bajar" onClick={ir} aria-label={`${texto}: baja hasta los ejercicios del módulo`}>
        <span>{texto}</span>
        <motion.span
          className="pm-bajar-ico"
          aria-hidden="true"
          animate={reducir ? undefined : { y: [0, 5, 0] }}
          transition={reducir ? undefined : { duration: 1.8, repeat: Infinity, ease: 'easeInOut' }}
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round">
            <path d="M12 5v14M6 13l6 6 6-6" />
          </svg>
        </motion.span>
      </button>
    </div>
  );
}

export default function ModulePage() {
  const { id = '' } = useParams();
  const p = useProgreso();
  const reducir = useReducedMotion();
  const r = useRevela();
  const movil = useMedia('(max-width: 700px)');
  const modulo = getModulo(id);

  if (!modulo) {
    return (
      <div className="wrap" style={{ padding: '60px 0' }}>
        <h1>No encuentro ese módulo</h1>
        <p className="muted">Vuelve al inicio y elige uno de la lista.</p>
        <Link className="btn" to="/">
          Volver al inicio
        </Link>
      </div>
    );
  }

  const ini = p.alumno.ini;
  const meta = META[modulo.id] ?? { color: 'var(--arc)', icono: 'maestros', corto: modulo.titulo };
  const ficha = FICHAS[modulo.id];
  const piezas: PiezaCircuito[] = ficha?.circuito ?? modulo.circuito.map((t) => ({ t, d: '' }));
  const av = avanceModulo(p, modulo.id);
  const minutos = modulo.ejercicios.reduce((s, e) => s + e.duracionMin, 0);
  const hechos = modulo.ejercicios.filter((e) => ejercicioCompletado(p.ejercicios[e.id])).length;
  const pendiente = modulo.ejercicios.find((e) => !ejercicioCompletado(p.ejercicios[e.id]));
  const siguiente = pendiente ?? modulo.ejercicios[0];
  const series = seriesDeModulo(modulo.id);
  const verVideo = series.length > 0;
  const sims = SIMS.filter((s) => s.modulo === modulo.id);
  const idx = MODULOS.findIndex((m) => m.id === modulo.id);
  const sigMod = MODULOS[idx + 1];
  const sigMeta = sigMod ? META[sigMod.id] : undefined;

  const ctaTexto = hechos === modulo.ejercicios.length ? 'Repasar el módulo' : av === 0 ? 'Empezar el módulo' : `Continuar con el ejercicio ${siguiente?.numero ?? ''}`;

  return (
    <div className="wrap mod-page pm" style={{ ['--mod' as string]: meta.color } as CSSProperties}>
      <Link to="/#modulos" className="btn ghost sm pm-volver">
        <Icon name="atras" size={18} /> Todos los módulos
      </Link>

      <header className="ax-banner pm-banner">
        <div className="pm-banner-in">
          <div className="pm-banner-txt">
            <p className="ax-kicker">
              Módulo {idx + 1} de {MODULOS.length}
              {modulo.sesion ? `, ${modulo.sesion.toLowerCase()}` : ''}
            </p>
            <h1 className="pm-h1">{modulo.titulo}</h1>
            <p className="lead">{ficha ? conIni(ficha.frase, ini) : conIni(modulo.resumen, ini)}</p>
            <div className="ax-stats pm-stats">
              <div className="ax-stat">
                <span className="ax-num">{modulo.ejercicios.length}</span>
                <span>ejercicios</span>
              </div>
              <div className="ax-stat">
                <span className="ax-num">{minutos}</span>
                <span>minutos</span>
              </div>
              <div className="ax-stat">
                <span className="ax-num">{hechos}</span>
                <span>completados</span>
              </div>
            </div>
            <div className="pm-ctas">
              {siguiente && (
                <Link className="btn arc lg" to={`/ejercicio/${siguiente.id}`}>
                  {ctaTexto}
                </Link>
              )}
              {sims[0] && (
                <Link className="btn ghost lg" to={`/taller/${sims[0].id}`}>
                  Practicar en el Taller
                </Link>
              )}
            </div>
          </div>
          <motion.div
            className="pm-planeta"
            initial={reducir ? false : { scale: 0.6, opacity: 0, rotate: -30 }}
            animate={{ scale: 1, opacity: 1, rotate: 0 }}
            transition={{ type: 'spring', stiffness: 70, damping: 14 }}
            role="img"
            aria-label={`${Math.round(av * 100)} % del módulo hecho`}
          >
            <svg className="pm-planeta-orbita" viewBox="0 0 100 100" aria-hidden="true">
              <circle cx="50" cy="50" r="47" fill="none" stroke="rgba(255,255,255,0.14)" strokeWidth="2" />
              <motion.circle
                cx="50"
                cy="50"
                r="47"
                fill="none"
                stroke="#7ff0d6"
                strokeWidth="2.6"
                strokeLinecap="round"
                transform="rotate(-90 50 50)"
                initial={{ pathLength: 0 }}
                animate={{ pathLength: Math.max(av, 0.002) }}
                transition={{ duration: reducir ? 0 : 1.2, delay: 0.4 }}
              />
            </svg>
            <span className="pm-esfera">
              <Icon name={meta.icono} size={44} />
            </span>
            <span className="pm-planeta-pct ax-num">
              {Math.round(av * 100)}
              <small>%</small>
            </span>
          </motion.div>
        </div>
        {ficha && (
          <div className="pm-aprendes" aria-labelledby="apr-h">
            <h2 id="apr-h" className="kick">Al terminar sabrás</h2>
            <ul>
              {ficha.aprendes.map((a, i) => (
                <motion.li key={i} className="pm-apr" {...r(i + 2, 12)}>
                  <span className="pm-apr-ico" aria-hidden="true">
                    <Icon name="check" size={16} stroke={3} />
                  </span>
                  <span>{conIni(a, ini)}</span>
                </motion.li>
              ))}
            </ul>
          </div>
        )}
      </header>
      <Bajar destino="ruta" texto="Ver tu ruta" />

      {piezas.length > 0 && (
        <section className="mod-sec" aria-labelledby="circ-h">
          <CabSec
            id="circ-h"
            n={1}
            kicker="Cómo encaja todo"
            titulo="El circuito"
            texto={movil ? 'Así viaja la información por este módulo. Toca una pieza para pararte en ella.' : 'Así viaja la información por este módulo. Cada pieza necesita la anterior: toca una para pararte en ella.'}
          />
          <div className="glass pm-panel">
            {movil ? <CircuitoV piezas={piezas} ini={ini} /> : <CircuitoH piezas={piezas} color={meta.color} ini={ini} />}
          </div>
        </section>
      )}

      {verVideo && (
        <section className="mod-sec pm-video" aria-label="Vídeo del módulo">
          <div className="ax-banner pm-video-in">
            {series.map((sv) => (
              <CapitulosSerie
                key={sv.id}
                serie={sv.id}
                titulo={series.length > 1 ? sv.titulo : `Vídeo del módulo: ${sv.capitulos.length} capítulos`}
                intro={sv.intro}
              />
            ))}
          </div>
        </section>
      )}

      {modulo.navegacion && modulo.navegacion.length > 0 && (
        <section className="mod-sec" aria-labelledby="antes-h">
          <CabSec id="antes-h" n={piezas.length > 0 ? 2 : 1} kicker="Lo básico" titulo="Antes de empezar" texto="Ábrelo cuando lo necesites: cada bloque se lee en un par de minutos." />
          <div className="folds">
            {modulo.navegacion.map((s, i) => (
              <Desplegable key={s.id} n={i + 1} titulo={conIni(s.titulo, ini)} abiertoIni={i === 0 && av === 0}>
                <SeccionVista s={s} ini={ini} conPasos />
              </Desplegable>
            ))}
          </div>
        </section>
      )}

      <section className="mod-sec pm-ruta" id="ruta" aria-labelledby="ruta-h">
        <CabSec
          id="ruta-h"
          n={(piezas.length > 0 ? 1 : 0) + (modulo.navegacion && modulo.navegacion.length > 0 ? 1 : 0) + 1}
          kicker={`${hechos} de ${modulo.ejercicios.length} hechos`}
          titulo="Tu ruta"
          texto="Cada ejercicio se completa con el recorrido guiado y el test aprobado. La checklist en la demo suma el resto."
        />
        <ol className="route mod-route">
          {modulo.ejercicios.map((e, i) => {
            const est = p.ejercicios[e.id];
            const done = ejercicioCompletado(est);
            const chip = estadoDe(est, e.checklist.length);
            const a = avanceEjercicio(est, e.checklist.length);
            const esSig = pendiente?.id === e.id;
            return (
              <motion.li
                key={e.id}
                initial={reducir ? false : { opacity: 0, x: -24 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, margin: '-40px' }}
                transition={{ delay: Math.min(i, 6) * 0.06, duration: 0.4 }}
              >
                <Link to={`/ejercicio/${e.id}`} className={`route-item${done ? ' done' : ''}${esSig ? ' next neon-mod' : ''}`}>
                  <span className="route-num">{done ? <Icon name="check" size={24} stroke={3} /> : e.numero}</span>
                  <span className="route-body">
                    <strong>{conIni(e.titulo, ini)}</strong>
                    <span className="small muted route-obj">{conIni(e.objetivo, ini)}</span>
                    <span className="ax-bar mod route-meter" aria-hidden="true">
                      <i style={{ width: `${a * 100}%` }} />
                    </span>
                  </span>
                  <span className="route-meta">
                    {esSig ? <span className="pm-tetoca">Te toca</span> : <span className={chip.clase}>{chip.texto}</span>}
                    <span className="small muted">
                      {pct(a)} · {e.duracionMin} min
                    </span>
                  </span>
                </Link>
              </motion.li>
            );
          })}
        </ol>
      </section>

      <nav className="po-puertas pm-sig" aria-label="Qué hacer después">
        {sigMod ? (
          <Link to={`/modulo/${sigMod.id}`} className="po-door po-door-examen" style={{ ['--mod' as string]: sigMeta?.color ?? 'var(--arc)' } as CSSProperties}>
            <span className="po-door-ico pm-sig-ico" aria-hidden="true">
              <Icon name={sigMeta?.icono ?? 'flecha'} size={26} />
            </span>
            <span className="po-door-txt">
              <span>Siguiente módulo</span>
              <strong>{sigMod.titulo}</strong>
              <span>{FICHAS[sigMod.id]?.recorrido ?? ''}</span>
            </span>
          </Link>
        ) : (
          <Link to="/examen" className="po-door po-door-examen">
            <span className="po-door-ico" aria-hidden="true">
              <Icon name="examen" size={26} />
            </span>
            <span className="po-door-txt">
              <span>Has llegado al último módulo</span>
              <strong>Examen final</strong>
              <span>Teoría y un caso práctico completo en la demo.</span>
            </span>
          </Link>
        )}
        <Link to={sims[0] ? `/taller/${sims[0].id}` : '/taller'} className="po-door po-door-taller">
          <span className="po-door-ico" aria-hidden="true">
            <Icon name="taller" size={26} />
          </span>
          <span className="po-door-txt">
            <span>Para afianzar</span>
            <strong>{sims[0] ? sims[0].titulo : 'El Taller'}</strong>
            <span>{sims[0] ? 'Simulador del Taller' : 'Simuladores para equivocarte sin miedo.'}</span>
          </span>
        </Link>
      </nav>
    </div>
  );
}
