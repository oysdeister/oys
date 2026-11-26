import { useEffect, useMemo, useRef, useState, type KeyboardEvent, type PointerEvent } from 'react';
import { Link, useNavigate, useParams, useSearchParams } from 'react-router-dom';
import { AnimatePresence, motion, useMotionValue, useReducedMotion, useSpring } from 'framer-motion';
import { CAPITULOS, MOMENTOS_SECCION, type CapituloVideo } from '../content/videoMapa';
import { META, MODULOS, todosEjercicios } from '../content';
import { seriesDeModulo, type SerieVideo } from '../content/videoSeries';
import { mmss } from '../lib/config';
import { baseUrl, conIni } from '../lib/texto';
import { useProgreso } from '../lib/progress';
import { Icon } from '../components/Icon';
import { CapitulosSerie } from '../components/video';
import './video.css';

const TOTAL = CAPITULOS.reduce((a, c) => a + c.duracion, 0);
const publicado = (c: CapituloVideo) => !!c.url;
const dos = (n: number) => String(n).padStart(2, '0');
const durTexto = (s: number) => {
  const m = Math.round(s / 60);
  return m >= 60 ? `${Math.floor(m / 60)} h ${m % 60} min` : `${m} min`;
};

/* ---------- Geometría del arco (el del logo O&S) ---------- */
const AW = 1000, AH = 210, X0 = 40, X1 = 960, Y0 = 186, SAG = 140;
const R = ((X1 - X0) / 2) ** 2 / (2 * SAG) + SAG / 2;
const CX = (X0 + X1) / 2, CY = Y0 - SAG + R;
const MAXA = Math.asin((X1 - X0) / 2 / R);
const punto = (f: number) => {
  const a = -MAXA + 2 * MAXA * f;
  return [CX + R * Math.sin(a), CY - R * Math.cos(a)] as const;
};
const tramo = (f0: number, f1: number) => {
  const [ax, ay] = punto(f0), [bx, by] = punto(f1);
  return `M ${ax.toFixed(1)} ${ay.toFixed(1)} A ${R.toFixed(1)} ${R.toFixed(1)} 0 0 1 ${bx.toFixed(1)} ${by.toFixed(1)}`;
};
const LIMITES = CAPITULOS.reduce<number[]>((acc, c) => [...acc, acc[acc.length - 1] + c.duracion / TOTAL], [0]);

/** Barra de capítulos con forma de arco. Cada tramo mide lo que dura su capítulo. */
function ArcoCapitulos({ actual, progreso, onIr }: { actual?: number; progreso: number; onIr: (n: number) => void }) {
  const reducir = !!useReducedMotion();
  const hueco = 0.004;
  const tecla = (n: number) => (e: KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      onIr(n);
    }
  };
  return (
    <svg className="vd-arc" viewBox={`0 0 ${AW} ${AH}`} role="group" aria-label="Capítulos del vídeo en el arco">
      <defs>
        <linearGradient id="vd-neon" gradientUnits="userSpaceOnUse" x1="0" x2="1000" y1="0" y2="0">
          <stop offset="0" stopColor="#5fe3c8" />
          <stop offset="0.55" stopColor="#63e6ff" />
          <stop offset="1" stopColor="#a68bff" />
        </linearGradient>
      </defs>
      <path d={tramo(0, 1)} className="vd-arc-base" />
      {CAPITULOS.map((c, i) => {
        const f0 = LIMITES[i] + hueco, f1 = LIMITES[i + 1] - hueco;
        const visto = actual !== undefined && c.n < actual;
        const es = c.n === actual;
        const fin = es ? f0 + (f1 - f0) * Math.min(1, Math.max(0, progreso)) : f1;
        const [mx, my] = punto((f0 + f1) / 2);
        return (
          <g
            key={c.n}
            className={`vd-arc-seg${es ? ' es' : ''}${visto ? ' visto' : ''}`}
            role="button"
            tabIndex={0}
            aria-label={`Capítulo ${c.n}: ${c.titulo}, ${durTexto(c.duracion)}`}
            aria-current={es ? 'step' : undefined}
            onClick={() => onIr(c.n)}
            onKeyDown={tecla(c.n)}
          >
            <path d={tramo(f0, f1)} className="vd-arc-hit" />
            <path d={tramo(f0, f1)} className="vd-arc-track" />
            {(visto || es) && (
              <motion.path
                d={tramo(f0, fin)}
                className="vd-arc-fill"
                initial={reducir ? false : { pathLength: 0 }}
                animate={{ pathLength: 1 }}
                transition={{ duration: 0.9, delay: 0.05 * i, ease: [0.2, 0.7, 0.2, 1] }}
              />
            )}
            <circle cx={mx} cy={my - 30} r={es ? 23 : 18} className="vd-arc-dot" />
            <text x={mx} y={my - 30} className="vd-arc-num" dominantBaseline="central" textAnchor="middle">
              {c.n}
            </text>
          </g>
        );
      })}
    </svg>
  );
}

/** Tarjeta de capítulo con inclinación 3D ligera al pasar el ratón. */
function TarjetaCapitulo({ c, actual, i }: { c: CapituloVideo; actual?: number; i: number }) {
  const reducir = !!useReducedMotion();
  const rx = useMotionValue(0), ry = useMotionValue(0);
  const srx = useSpring(rx, { stiffness: 220, damping: 18 }), sry = useSpring(ry, { stiffness: 220, damping: 18 });
  const mover = (e: PointerEvent<HTMLAnchorElement>) => {
    if (reducir || e.pointerType !== 'mouse') return;
    const r = e.currentTarget.getBoundingClientRect();
    ry.set(((e.clientX - r.left) / r.width - 0.5) * 12);
    rx.set(-((e.clientY - r.top) / r.height - 0.5) * 10);
  };
  const es = c.n === actual;
  return (
    <motion.li
      initial={reducir ? false : { opacity: 0, y: 26, rotateX: -18 }}
      animate={{ opacity: 1, y: 0, rotateX: 0 }}
      transition={{ duration: 0.55, delay: 0.04 * i, ease: [0.2, 0.7, 0.2, 1] }}
      style={{ transformPerspective: 900 }}
    >
      <motion.div style={{ rotateX: srx, rotateY: sry, transformPerspective: 900 }}>
        <Link
          to={`/video/${c.n}`}
          className={`vd-card${es ? ' es' : ''}`}
          aria-current={es ? 'page' : undefined}
          onPointerMove={mover}
          onPointerLeave={() => {
            rx.set(0);
            ry.set(0);
          }}
        >
          <span className="vd-card-img">
            {c.poster && <img src={baseUrl(c.poster)} alt="" loading="lazy" width={640} height={360} />}
            <span className="vd-card-dur">
              <Icon name="reloj" /> {mmss(c.duracion)}
            </span>
            {es && <span className="vd-card-now">Estás aquí</span>}
          </span>
          <span className="vd-card-body">
            <span className="vd-card-n" aria-hidden="true">
              {dos(c.n)}
            </span>
            <span className="vd-card-t">
              <span className="sr-only">Capítulo {c.n}: </span>
              {c.titulo}
            </span>
            <span className="vd-card-meta">{c.escenas.length} escenas</span>
          </span>
        </Link>
      </motion.div>
    </motion.li>
  );
}

function IndiceCapitulos({ actual }: { actual?: number }) {
  return (
    <ol className="vd-grid" aria-label="Índice de capítulos">
      {CAPITULOS.map((c, i) => (
        <TarjetaCapitulo key={c.n} c={c} actual={actual} i={i} />
      ))}
    </ol>
  );
}

type Practica = {
  id: string;
  titulo: string;
  modulo: string;
  secciones: { id: string; titulo: string; tCap: number; que: string }[];
};

/** Ejercicios y secciones que se explican en este capítulo (el mapa, leído al revés). */
function practicasDe(n: number, ini: string): Practica[] {
  const res: Practica[] = [];
  for (const { modulo, ejercicio } of todosEjercicios()) {
    const secciones = ejercicio.secciones.flatMap((s) =>
      (MOMENTOS_SECCION[s.id] ?? [])
        .filter((m) => m.capitulo === n)
        .slice(0, 1)
        .map((m) => ({ id: s.id, titulo: conIni(s.titulo, ini), tCap: m.tCap, que: m.titulo })),
    );
    if (secciones.length) res.push({ id: ejercicio.id, titulo: conIni(ejercicio.titulo, ini), modulo: modulo.id, secciones });
  }
  return res;
}

function Reproductor({ c, tInicial, onTiempo }: { c: CapituloVideo; tInicial: number; onTiempo: (s: number) => void }) {
  const reducir = !!useReducedMotion();
  const navigate = useNavigate();
  const p = useProgreso();
  const video = useRef<HTMLVideoElement>(null);
  const lista = useRef<HTMLOListElement>(null);
  const [t, setT] = useState(tInicial);
  const idx = c.n - 1;
  const prev = CAPITULOS[idx - 1], next = CAPITULOS[idx + 1];
  useEffect(() => onTiempo(t), [t, onTiempo]);
  const escena = useMemo(() => {
    let k = 0;
    c.escenas.forEach((e, i) => {
      if (e.t <= t + 0.25) k = i;
    });
    return k;
  }, [c, t]);
  const practicas = useMemo(() => practicasDe(c.n, p.alumno.ini), [c.n, p.alumno.ini]);

  // Salto inicial (?t=): pendiente hasta que el vídeo tenga metadatos; se reintenta en canplay
  const pendiente = useRef<number | null>(tInicial > 0 ? tInicial : null);
  const aplicarSalto = (v: HTMLVideoElement) => {
    const s = pendiente.current;
    if (s === null || v.readyState < 1) return;
    if (Math.abs(v.currentTime - s) > 0.75) v.currentTime = Math.min(s, (v.duration || c.duracion) - 1);
  };
  const comprobarSalto = (v: HTMLVideoElement) => {
    const s = pendiente.current;
    if (s !== null && Math.abs(v.currentTime - s) <= 0.75) pendiente.current = null;
  };
  useEffect(() => {
    pendiente.current = tInicial > 0 ? tInicial : null;
    if (video.current) aplicarSalto(video.current);
  }, [c.n, tInicial]); // eslint-disable-line react-hooks/exhaustive-deps

  // La escena en curso se mantiene visible dentro de su lista (sin mover la página)
  useEffect(() => {
    const ol = lista.current;
    const li = ol?.children[escena] as HTMLElement | undefined;
    if (!ol || !li || ol.scrollHeight <= ol.clientHeight + 4) return;
    const arriba = li.offsetTop - ol.offsetTop;
    if (arriba < ol.scrollTop || arriba + li.offsetHeight > ol.scrollTop + ol.clientHeight)
      ol.scrollTo({ top: arriba - ol.clientHeight / 3, behavior: reducir ? 'auto' : 'smooth' });
  }, [escena, reducir]);

  const saltar = (s: number) => {
    const v = video.current;
    if (!v) return;
    pendiente.current = s;
    v.currentTime = s;
    setT(s);
    void v.play().catch(() => undefined);
  };

  const fin = () => {
    if (next) navigate(`/video/${next.n}`);
  };

  return (
    <>
      <section className="vd-stage" aria-labelledby="vd-cap-titulo">
        <motion.div
          className="vd-head"
          initial={reducir ? false : { opacity: 0, x: -24 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, ease: [0.2, 0.7, 0.2, 1] }}
        >
          <span className="vd-big" aria-hidden="true">
            {dos(c.n)}
          </span>
          <div>
            <p className="vd-kicker">
              Capítulo {c.n} de {CAPITULOS.length} · {durTexto(c.duracion)}
            </p>
            <h1 id="vd-cap-titulo" className="vd-h1">
              {c.titulo}
            </h1>
          </div>
        </motion.div>

        <div className="vd-player-grid">
          <motion.div
            className="vd-screen"
            initial={reducir ? false : { opacity: 0, rotateX: 14, rotateY: -10, y: 30, scale: 0.96 }}
            animate={{ opacity: 1, rotateX: 0, rotateY: 0, y: 0, scale: 1 }}
            transition={{ duration: 0.75, ease: [0.16, 0.8, 0.2, 1] }}
            style={{ transformPerspective: 1400 }}
          >
            {publicado(c) ? (
              <video
                key={c.n}
                ref={video}
                className="vd-video"
                src={c.url}
                poster={c.poster ? baseUrl(c.poster) : undefined}
                controls
                playsInline
                preload="metadata"
                onLoadedMetadata={(e) => aplicarSalto(e.currentTarget)}
                onLoadedData={(e) => aplicarSalto(e.currentTarget)}
                onCanPlay={(e) => aplicarSalto(e.currentTarget)}
                onTimeUpdate={(e) => {
                  comprobarSalto(e.currentTarget);
                  if (pendiente.current === null) setT(e.currentTarget.currentTime);
                }}
                onSeeked={(e) => {
                  comprobarSalto(e.currentTarget);
                  setT(e.currentTarget.currentTime);
                }}
                onEnded={fin}
              >
                Tu navegador no puede reproducir este vídeo. <a href={c.url}>Descárgalo aquí</a>.
              </video>
            ) : (
              <div className="vd-noweb">
                {c.poster && <img src={baseUrl(c.poster)} alt="" />}
                <p>
                  <Icon name="aviso" /> Este capítulo aún no está publicado. Mientras tanto, mira de qué trata en su índice de escenas.
                </p>
              </div>
            )}
          </motion.div>

          <aside className="vd-scenes" aria-label="Escenas del capítulo">
            <h2 className="vd-h2">Escenas</h2>
            <ol ref={lista} className="vd-scene-list">
              {c.escenas.map((e, i) => {
                const es = i === escena;
                return (
                  <li key={e.t + e.titulo}>
                    <button
                      type="button"
                      className={`vd-scene${es ? ' es' : ''}${i < escena ? ' visto' : ''}`}
                      aria-current={es ? 'true' : undefined}
                      onClick={() => saltar(e.t)}
                      disabled={!publicado(c)}
                    >
                      <span className="vd-scene-t">{mmss(e.t)}</span>
                      <span className="vd-scene-name">{e.titulo}</span>
                      {es && <motion.span layoutId="vd-scene-mark" className="vd-scene-mark" aria-hidden="true" />}
                    </button>
                  </li>
                );
              })}
            </ol>
          </aside>
        </div>

        <nav className="vd-steps" aria-label="Capítulo anterior y siguiente">
          {prev ? (
            <Link className="vd-step prev" to={`/video/${prev.n}`}>
              <Icon name="atras" />
              <span>
                <small>Capítulo {prev.n}</small>
                {prev.titulo}
              </span>
            </Link>
          ) : (
            <Link className="vd-step prev" to="/video">
              <Icon name="atras" />
              <span>
                <small>Volver</small>
                Todos los capítulos
              </span>
            </Link>
          )}
          {next && (
            <Link className="vd-step next" to={`/video/${next.n}`}>
              <span>
                <small>Capítulo {next.n}</small>
                {next.titulo}
              </span>
              <Icon name="flecha" />
            </Link>
          )}
        </nav>
      </section>

      <section className="vd-practica" aria-labelledby="vd-practica-t">
        <h2 id="vd-practica-t" className="vd-h2">
          Practícalo
        </h2>
        {practicas.length ? (
          <>
            <p className="muted">Estos bloques piden registrar lo que se explica en el capítulo. Pulsa el minuto para verlo otra vez.</p>
            <ul className="vd-prac-grid">
              {practicas.map((pr, i) => (
                <motion.li
                  key={pr.id}
                  className="vd-prac"
                  style={{ ['--mod' as string]: META[pr.modulo]?.color ?? 'var(--arc)' }}
                  initial={reducir ? false : { opacity: 0, y: 16, rotateX: -12 }}
                  animate={{ opacity: 1, y: 0, rotateX: 0 }}
                  transition={{ duration: 0.45, delay: 0.35 + 0.06 * i }}
                >
                  <div className="vd-prac-head">
                    <span className="vd-prac-mod">{META[pr.modulo]?.corto ?? pr.modulo}</span>
                    <h3>{pr.titulo}</h3>
                  </div>
                  <ul className="vd-prac-secs">
                    {pr.secciones.map((s) => (
                      <li key={s.id}>
                        <button type="button" className="vd-prac-t" onClick={() => saltar(s.tCap)} disabled={!publicado(c)} aria-label={`Ver en el vídeo, minuto ${mmss(s.tCap)}: ${s.que}`}>
                          <Icon name="play" /> {mmss(s.tCap)}
                        </button>
                        <span>{s.titulo}</span>
                      </li>
                    ))}
                  </ul>
                  <Link className="btn sm arc" to={`/ejercicio/${pr.id}?tab=guiado`}>
                    Abrir el bloque
                  </Link>
                </motion.li>
              ))}
            </ul>
          </>
        ) : (
          <p className="muted">Este capítulo es de contexto: no hay un bloque que lo practique directamente. Sigue con el siguiente capítulo.</p>
        )}
      </section>
    </>
  );
}

export default function Video() {
  const { cap } = useParams();
  const [q] = useSearchParams();
  const navigate = useNavigate();
  const reducir = !!useReducedMotion();
  const n = cap ? Number(cap) : undefined;
  const c = n ? CAPITULOS.find((x) => x.n === n) : undefined;
  const tInicial = Math.max(0, Number(q.get('t')) || 0);
  const algunoPublicado = CAPITULOS.some(publicado);
  const [tiempo, setTiempo] = useState(tInicial);
  const fraccion = c ? Math.min(1, tiempo / c.duracion) : 0;

  return (
    <div className="vd">
      <div className="wrap">
        {c && (
          <header className="vd-hero compact">
            <ArcoCapitulos actual={c.n} progreso={fraccion} onIr={(k) => navigate(`/video/${k}`)} />
          </header>
        )}

        {!algunoPublicado && (
          <p className="callout nota vd-aviso" role="status">
            El vídeo aún no está publicado. Aquí tienes el índice para saber qué cuenta cada capítulo.
          </p>
        )}

        <AnimatePresence mode="wait">
          {c ? (
            <motion.div key={c.n} exit={reducir ? undefined : { opacity: 0, rotateY: 8, x: -30 }} style={{ transformPerspective: 1200 }}>
              <Reproductor c={c} tInicial={tInicial} onTiempo={setTiempo} />
            </motion.div>
          ) : (
            cap && (
              <p className="callout nota vd-aviso" role="status">
                Ese capítulo no existe. Elige uno del índice.
              </p>
            )
          )}
        </AnimatePresence>

        {c && (
          <section className="vd-index" aria-labelledby="vd-index-t">
            <h2 id="vd-index-t" className="vd-h2">Todos los capítulos</h2>
            <IndiceCapitulos actual={c.n} />
          </section>
        )}

        {!c &&
          MODULOS.map((m, i) => {
            const series = seriesDeModulo(m.id).filter((x) => x.id !== 'compras');
            if (!series.length && m.id !== 'compras') return null;
            return (
              <section key={m.id} className="vd-index vd-otras" aria-labelledby={`vd-mod-${m.id}`}>
                <h2 id={`vd-mod-${m.id}`} className="vd-h2">
                  {i}. {META[m.id]?.corto ?? m.titulo}
                </h2>
                {m.id === 'compras' && (
                  <>
                    <h3 className="vd-h2">Vídeo de compras · tutorial propio</h3>
                    <IndiceCapitulos />
                  </>
                )}
                {series.length > 0 && <div className="ax-banner vd-otras-in">
                  {series.map((x) => (
                    <CapitulosSerie key={x.id} serie={x.id} titulo={`${x.titulo} · ${origen(x)}`} intro={x.intro} />
                  ))}
                </div>}
              </section>
            );
          })}
      </div>
    </div>
  );
}

/** De dónde sale el vídeo: grabación de una sesión, tutorial propio o vídeo por tabla */
function origen(x: SerieVideo): string {
  if (x.porTabla) return 'un vídeo por tabla';
  if (x.original || x.id.startsWith('fin-')) return 'sesión de formación grabada';
  return 'tutorial propio';
}
