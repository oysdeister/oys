import { useEffect, useState, type ReactNode } from 'react';
import { Link, useParams } from 'react-router-dom';
import { AnimatePresence, animate, motion, useMotionValue, useReducedMotion, useTransform } from 'framer-motion';
import { META, getModulo } from '../content';
import { avanceEjercicio, ejercicioCompletado, useProgreso } from '../lib/progress';
import { avanceModulo } from '../lib/avance';
import { conIni } from '../lib/texto';
import { CAPITULOS_VIDEO, VIDEO_URL, mmss, urlCapitulo } from '../lib/config';
import { Icon } from '../components/Icon';
import { SeccionVista } from '../components/exercise/SeccionVista';
import { estadoDe, pct, useMedia } from '../components/exercise/util';
import './aprender.css';

/** Circuito del módulo: piezas unidas por el arco O&S, con una ficha de documento que viaja de una a otra */
function Circuito({ piezas, color }: { piezas: string[]; color: string }) {
  const reducir = useReducedMotion();
  const vertical = useMedia('(max-width: 700px)');
  const n = piezas.length;
  const [activo, setActivo] = useState(0);
  const [vuelta, setVuelta] = useState(0);
  // Plano inclinado en 3D: entra casi tumbado y se levanta hasta 24°
  const INCL = vertical || reducir ? 0 : 24;
  const tilt = useMotionValue(vertical || reducir ? 0 : 64);
  const contra = useTransform(tilt, (v) => -v);
  useEffect(() => {
    const c = animate(tilt, INCL, { duration: reducir ? 0 : 1.6, ease: [0.2, 0.7, 0.2, 1] });
    return () => c.stop();
  }, [INCL, tilt, reducir]);

  useEffect(() => {
    if (reducir || n < 2) return;
    let k = 0;
    let iv: ReturnType<typeof setInterval> | undefined;
    const arranque = setTimeout(() => {
      iv = setInterval(() => {
        k++;
        if (k >= n) {
          k = 0;
          setVuelta((v) => v + 1);
        }
        setActivo(k);
      }, 1500);
    }, 1400);
    return () => {
      clearTimeout(arranque);
      if (iv) clearInterval(iv);
    };
  }, [n, reducir]);

  if (!n) return null;

  // Posiciones en % del contenedor
  const pos = piezas.map((_, i) => {
    const f = n === 1 ? 0.5 : i / (n - 1);
    if (vertical) return { x: 14 + Math.sin(f * Math.PI) * 10, y: (100 / n) * (i + 0.5) };
    return { x: 6 + f * 88, y: 78 - Math.sin(f * Math.PI) * 46 };
  });
  const W = vertical ? 100 : 1000;
  const H = vertical ? 100 : 260;
  const pts = pos.map((p) => ({ x: (p.x / 100) * W, y: (p.y / 100) * H }));
  // Curva suave que pasa por todas las piezas (Catmull-Rom → Bézier)
  let d = `M ${pts[0].x} ${pts[0].y}`;
  for (let i = 0; i < pts.length - 1; i++) {
    const p0 = pts[i - 1] ?? pts[i];
    const p1 = pts[i];
    const p2 = pts[i + 1];
    const p3 = pts[i + 2] ?? p2;
    const c1 = { x: p1.x + (p2.x - p0.x) / 6, y: p1.y + (p2.y - p0.y) / 6 };
    const c2 = { x: p2.x - (p3.x - p1.x) / 6, y: p2.y - (p3.y - p1.y) / 6 };
    d += ` C ${c1.x} ${c1.y}, ${c2.x} ${c2.y}, ${p2.x} ${p2.y}`;
  }

  return (
    <div className={`circ ${vertical ? 'circ-v' : 'circ-h'}`} style={vertical ? { height: n * 76 } : undefined} role="list" aria-label="Circuito del módulo">
      <motion.div className="circ-plane" style={{ rotateX: tilt }}>
      <svg viewBox={`0 0 ${W} ${H}`} preserveAspectRatio="none" aria-hidden="true">
        <path d={d} fill="none" stroke="var(--line)" strokeWidth={12} strokeLinecap="round" vectorEffect="non-scaling-stroke" />
        <motion.path
          d={d}
          fill="none"
          stroke={color}
          strokeWidth={5}
          strokeLinecap="round"
          vectorEffect="non-scaling-stroke"
          initial={{ pathLength: reducir ? 1 : 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: reducir ? 0 : 1.3, ease: [0.4, 0, 0.2, 1] }}
        />
      </svg>
      {piezas.map((pz, i) => {
        const visitada = !reducir && i < activo;
        const aqui = !reducir && i === activo;
        return (
          <motion.div
            key={i}
            role="listitem"
            className={`circ-node${aqui ? ' here' : ''}${visitada ? ' seen' : ''}`}
            style={{ left: `${pos[i].x}%`, top: `${pos[i].y}%`, x: vertical ? -23 : '-50%', y: '-50%', rotateX: contra, z: vertical ? 0 : 24 }}
            initial={reducir ? false : { scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: reducir ? 0 : 0.15 + (i / Math.max(1, n - 1)) * 1.1, type: 'spring', stiffness: 260, damping: 18 }}
          >
            <span className="circ-dot">{i + 1}</span>
            <span className="circ-label">{pz}</span>
          </motion.div>
        );
      })}
      {!reducir && n > 1 && (
        <motion.div
          key={vuelta}
          className="circ-token"
          aria-hidden="true"
          initial={{ left: `${pos[0].x}%`, top: `${pos[0].y}%`, opacity: 0, scale: 0.6 }}
          animate={{ left: `${pos[activo].x}%`, top: `${pos[activo].y}%`, opacity: 1, scale: 1, rotateY: activo * 360 }}
          transition={{
            left: { duration: 0.9, ease: [0.5, 0, 0.2, 1] },
            top: { duration: 0.9, ease: [0.5, 0, 0.2, 1] },
            rotateY: { duration: 0.9, ease: [0.5, 0, 0.2, 1] },
            opacity: { duration: 0.3, delay: vuelta === 0 ? 1.3 : 0 },
          }}
          style={{ x: vertical ? -45 : '-50%', y: vertical ? '-50%' : '-150%', rotateX: contra, z: vertical ? 0 : 60 }}
        >
          <svg viewBox="0 0 24 30" width="22" height="28">
            <path d="M3 2h12l6 6v20H3z" fill="var(--sheet)" stroke={color} strokeWidth="2" strokeLinejoin="round" />
            <path d="M15 2v6h6M7 14h10M7 18h10M7 22h6" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" />
          </svg>
        </motion.div>
      )}
      </motion.div>
    </div>
  );
}

function Desplegable({ titulo, children, abiertoIni = false }: { titulo: string; children: ReactNode; abiertoIni?: boolean }) {
  const [abierto, setAbierto] = useState(abiertoIni);
  const reducir = useReducedMotion();
  return (
    <div className={`fold${abierto ? ' open' : ''}`}>
      <button className="fold-head" aria-expanded={abierto} onClick={() => setAbierto((a) => !a)}>
        <span>{titulo}</span>
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
            transition={{ duration: 0.3, ease: [0.2, 0.7, 0.2, 1] }}
          >
            <div className="fold-in">{children}</div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default function ModulePage() {
  const { id = '' } = useParams();
  const p = useProgreso();
  const reducir = useReducedMotion();
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
  const av = avanceModulo(p, modulo.id);
  const minutos = modulo.ejercicios.reduce((s, e) => s + e.duracionMin, 0);
  const hechos = modulo.ejercicios.filter((e) => ejercicioCompletado(p.ejercicios[e.id])).length;
  const siguiente = modulo.ejercicios.find((e) => !ejercicioCompletado(p.ejercicios[e.id])) ?? modulo.ejercicios[0];
  const verVideo = modulo.id === 'compras' && !!VIDEO_URL;

  return (
    <div className="wrap mod-page" style={{ ['--mod' as string]: meta.color }}>
      <nav className="crumbs" aria-label="Migas">
        <Link to="/">Inicio</Link>
        <span aria-hidden="true">/</span>
        <span>{modulo.titulo}</span>
      </nav>

      <header className="mod-hero">
        <motion.div
          className="mod-badge"
          initial={reducir ? false : { rotateY: -90, opacity: 0 }}
          animate={{ rotateY: 0, opacity: 1 }}
          transition={{ type: 'spring', stiffness: 80, damping: 12 }}
        >
          <svg viewBox="0 0 100 100" aria-hidden="true">
            <circle cx="50" cy="50" r="44" fill="none" stroke="var(--line)" strokeWidth="7" />
            <motion.circle
              cx="50"
              cy="50"
              r="44"
              fill="none"
              stroke={meta.color}
              strokeWidth="7"
              strokeLinecap="round"
              transform="rotate(-90 50 50)"
              initial={{ pathLength: 0 }}
              animate={{ pathLength: Math.max(av, 0.001) }}
              transition={{ duration: reducir ? 0 : 1.2, delay: 0.3 }}
            />
          </svg>
          <span className="mod-badge-ico" style={{ color: meta.color }}>
            <Icon name={meta.icono} size={34} />
          </span>
        </motion.div>
        <div>
          <span className="chip">{modulo.sesion}</span>
          <h1 className="mod-h1">{modulo.titulo}</h1>
          <p className="lead mod-lead">{conIni(modulo.resumen, ini)}</p>
          <div className="mod-stats">
            <span>
              <b>{modulo.ejercicios.length}</b> ejercicios
            </span>
            <span>
              <b>{minutos}</b> min
            </span>
            <span>
              <b>{Math.round(av * 100)}</b> % hecho
            </span>
            <span>
              <b>{hechos}</b> completados
            </span>
          </div>
          {siguiente && (
            <Link className="btn arc" to={`/ejercicio/${siguiente.id}`} style={{ marginTop: 18 }}>
              {hechos === 0 && av === 0 ? 'Empezar el módulo' : hechos === modulo.ejercicios.length ? 'Repasar el módulo' : 'Continuar'}
            </Link>
          )}
        </div>
      </header>

      {modulo.circuito.length > 0 && (
        <section className="mod-sec">
          <h2>El circuito</h2>
          <p className="muted">Así viaja un documento por este módulo. Cada pieza depende de la anterior.</p>
          <Circuito piezas={modulo.circuito} color={meta.color} />
        </section>
      )}

      {modulo.navegacion && modulo.navegacion.length > 0 && (
        <section className="mod-sec">
          <h2>Antes de empezar</h2>
          <div className="folds">
            {modulo.navegacion.map((s, i) => (
              <Desplegable key={s.id} titulo={conIni(s.titulo, ini)} abiertoIni={i === 0 && av === 0}>
                <SeccionVista s={s} ini={ini} conPasos />
              </Desplegable>
            ))}
          </div>
        </section>
      )}

      <section className="mod-sec">
        <h2>Tu ruta</h2>
        <ol className="route mod-route">
          {modulo.ejercicios.map((e, i) => {
            const est = p.ejercicios[e.id];
            const done = ejercicioCompletado(est);
            const chip = estadoDe(est, e.checklist.length);
            const a = avanceEjercicio(est, e.checklist.length);
            return (
              <motion.li
                key={e.id}
                initial={reducir ? false : { opacity: 0, x: -24 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, margin: '-40px' }}
                transition={{ delay: Math.min(i, 6) * 0.06, duration: 0.4 }}
              >
                <Link to={`/ejercicio/${e.id}`} className={`route-item${done ? ' done' : ''}`}>
                  <span className="route-num">{done ? <Icon name="check" size={24} stroke={3} /> : e.numero}</span>
                  <span className="route-body">
                    <strong>{conIni(e.titulo, ini)}</strong>
                    <span className="small muted route-obj">{conIni(e.objetivo, ini)}</span>
                    <span className="meter route-meter" aria-hidden="true">
                      <i style={{ width: `${a * 100}%` }} />
                    </span>
                  </span>
                  <span className="route-meta">
                    <span className={chip.clase}>{chip.texto}</span>
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

      {verVideo && (
        <section className="mod-sec">
          <h2>El vídeo del módulo</h2>
          <p className="muted">Salta directamente al capítulo que necesites.</p>
          <ol className="video-list">
            {CAPITULOS_VIDEO.map((c) => (
              <li key={c.n}>
                <a href={urlCapitulo(c.t)} target="_blank" rel="noopener noreferrer">
                  <span className="video-t">{mmss(c.t)}</span>
                  <span>{c.titulo}</span>
                  <Icon name="play" size={16} />
                </a>
              </li>
            ))}
          </ol>
        </section>
      )}
    </div>
  );
}
