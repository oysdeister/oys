import { useEffect, useMemo, useRef, useState } from 'react';
import { Link, useNavigate, useParams, useSearchParams } from 'react-router-dom';
import { useReducedMotion } from 'framer-motion';
import { CAPITULOS, MOMENTOS_SECCION, type CapituloVideo } from '../content/videoMapa';
import { META, MODULOS, todosEjercicios } from '../content';
import { seriesDeModulo, type SerieVideo } from '../content/videoSeries';
import { mmss } from '../lib/config';
import { baseUrl, conIni } from '../lib/texto';
import { useProgreso } from '../lib/progress';
import { Icon } from '../components/Icon';
import { CapitulosSerie } from '../components/video';
import './video.css';

const publicado = (c: CapituloVideo) => !!c.url;
const durTexto = (s: number) => {
  const m = Math.round(s / 60);
  return m >= 60 ? `${Math.floor(m / 60)} h ${m % 60} min` : `${m} min`;
};

/** Tarjeta de capítulo: miniatura con borde fino, número y título. */
function TarjetaCapitulo({ c, actual }: { c: CapituloVideo; actual?: number }) {
  const es = c.n === actual;
  return (
    <li>
      <Link to={`/video/${c.n}`} className={`vd-card${es ? ' es' : ''}`} aria-current={es ? 'page' : undefined}>
        <span className="vd-card-img">
          {c.poster && <img src={baseUrl(c.poster)} alt="" loading="lazy" width={640} height={360} />}
          <span className="vd-card-dur">{mmss(c.duracion)}</span>
          {es && <span className="vd-card-now">Estás aquí</span>}
        </span>
        <span className="vd-card-body">
          <span className="vd-card-n" aria-hidden="true">
            {c.n}
          </span>
          <span className="vd-card-t">
            <span className="sr-only">Capítulo {c.n}: </span>
            {c.titulo}
          </span>
          <span className="vd-card-meta">{c.escenas.length} escenas</span>
        </span>
      </Link>
    </li>
  );
}

function IndiceCapitulos({ actual }: { actual?: number }) {
  return (
    <ol className="vd-grid" aria-label="Índice de capítulos">
      {CAPITULOS.map((c) => (
        <TarjetaCapitulo key={c.n} c={c} actual={actual} />
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

function Reproductor({ c, tInicial }: { c: CapituloVideo; tInicial: number }) {
  const reducir = !!useReducedMotion();
  const navigate = useNavigate();
  const p = useProgreso();
  const video = useRef<HTMLVideoElement>(null);
  const lista = useRef<HTMLOListElement>(null);
  const [t, setT] = useState(tInicial);
  const idx = c.n - 1;
  const prev = CAPITULOS[idx - 1], next = CAPITULOS[idx + 1];
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
        <header className="g-hero cs-hero vd-head">
          <p className="g-kicker">
            Vídeo de compras · capítulo {c.n} de {CAPITULOS.length} · {durTexto(c.duracion)}
          </p>
          <h1 id="vd-cap-titulo">{c.titulo}</h1>
        </header>

        <div className="vd-player-grid">
          <div className="vd-screen">
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
          </div>

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
              {practicas.map((pr) => (
                <li key={pr.id} className="vd-prac" style={{ ['--mod' as string]: META[pr.modulo]?.color ?? 'var(--arc)' }}>
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
                  <Link className="btn sm" to={`/ejercicio/${pr.id}?tab=guiado`}>
                    Abrir el bloque
                  </Link>
                </li>
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
  const n = cap ? Number(cap) : undefined;
  const c = n ? CAPITULOS.find((x) => x.n === n) : undefined;
  const tInicial = Math.max(0, Number(q.get('t')) || 0);
  const algunoPublicado = CAPITULOS.some(publicado);

  return (
    <div className="vd">
      <div className="wrap">
        {!c && (
          <header className="g-hero cs-hero">
            <p className="g-kicker">Vídeos del curso</p>
            <h1>Vídeos</h1>
            <p className="cs-lead">Tutoriales propios, vídeos cortos por tabla y sesiones de formación grabadas, ordenados por módulo. Toca un capítulo para verlo aquí mismo.</p>
          </header>
        )}

        {!algunoPublicado && (
          <p className="callout nota vd-aviso" role="status">
            El vídeo aún no está publicado. Aquí tienes el índice para saber qué cuenta cada capítulo.
          </p>
        )}

        {c ? (
            <Reproductor key={c.n} c={c} tInicial={tInicial} />
          ) : (
            cap && (
              <p className="callout nota vd-aviso" role="status">
                Ese capítulo no existe. Elige uno del índice.
              </p>
            )
          )}

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
                  <section className="vc">
                    <div className="vc-cab">
                      <h3>Vídeo de compras · tutorial propio</h3>
                      <p className="muted small">Toca un capítulo para abrir su página, con el índice de escenas y los bloques que lo practican.</p>
                    </div>
                    <IndiceCapitulos />
                  </section>
                )}
                {series.map((x) => (
                  <CapitulosSerie key={x.id} serie={x.id} titulo={x.porTabla ? x.titulo : `${x.titulo} · ${origen(x)}`} intro={x.intro} />
                ))}
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
