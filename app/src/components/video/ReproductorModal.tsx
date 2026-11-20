import { useEffect, useMemo, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { Link } from 'react-router-dom';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import type { MomentoVideo } from '../../content/videoMapa';
import { serieDe } from '../../content/videoSeries';
import { mmss } from '../../lib/config';
import { baseUrl } from '../../lib/texto';
import { Icon } from '../Icon';
import './video-modal.css';

export interface ReproductorModalProps {
  /** Serie de vídeo (videoSeries.ts); por defecto, compras */
  serie?: string;
  /** Capítulo (1-10) que se abre */
  capitulo: number;
  /** Segundo dentro del clip del capítulo en que empieza */
  t?: number;
  /** Si es false, la ventana no se muestra (permite la animación de salida) */
  abierto: boolean;
  onCerrar: () => void;
}

/**
 * Clip de un capítulo en una ventana modal sobre la página actual, con su índice de escenas.
 * Esc o un toque fuera la cierran. En móvil ocupa toda la pantalla.
 */
export function ReproductorModal({ serie, capitulo, t = 0, abierto, onCerrar }: ReproductorModalProps) {
  const sv = serieDe(serie);
  const CAPITULOS = sv.capitulos;
  const reducir = !!useReducedMotion();
  const [n, setN] = useState(capitulo);
  const [inicio, setInicio] = useState(t);
  const [ahora, setAhora] = useState(t);
  const [fallo, setFallo] = useState(false);
  const video = useRef<HTMLVideoElement>(null);
  const cerrar = useRef<HTMLButtonElement>(null);
  const caja = useRef<HTMLDivElement>(null);
  const lista = useRef<HTMLOListElement>(null);
  const c = CAPITULOS.find((x) => x.n === n) ?? CAPITULOS[0];
  const alCerrar = useRef(onCerrar);
  alCerrar.current = onCerrar;

  // Cada vez que se abre, vuelve al capítulo y segundo pedidos
  useEffect(() => {
    if (!abierto) return;
    setN(capitulo);
    setInicio(t);
    setAhora(t);
  }, [abierto, capitulo, t]);

  // Foco, Esc, trampa de foco y bloqueo del scroll de la página
  useEffect(() => {
    if (!abierto) return;
    const previo = document.activeElement as HTMLElement | null;
    const overflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    const id = window.setTimeout(() => cerrar.current?.focus(), 30);
    const tecla = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.preventDefault();
        alCerrar.current();
      } else if (e.key === 'Tab' && caja.current) {
        const f = [...caja.current.querySelectorAll<HTMLElement>('button:not([disabled]), a[href], video, [tabindex]:not([tabindex="-1"])')];
        if (!f.length) return;
        const primero = f[0], ultimo = f[f.length - 1];
        if (e.shiftKey && document.activeElement === primero) {
          e.preventDefault();
          ultimo.focus();
        } else if (!e.shiftKey && document.activeElement === ultimo) {
          e.preventDefault();
          primero.focus();
        }
      }
    };
    document.addEventListener('keydown', tecla);
    return () => {
      window.clearTimeout(id);
      document.removeEventListener('keydown', tecla);
      document.body.style.overflow = overflow;
      previo?.focus?.();
    };
  }, [abierto]);

  // Salto al segundo pedido. Se guarda como pendiente y se aplica en loadedmetadata,
  // se reintenta en canplay/loadeddata si el navegador lo ignora y se da por hecho al llegar.
  const pendiente = useRef<number | null>(null);
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
    if (!abierto) return;
    pendiente.current = inicio > 0 ? inicio : null;
    const v = video.current;
    if (!v) return;
    aplicarSalto(v);
    void v.play().catch(() => undefined);
  }, [abierto, n, inicio]); // eslint-disable-line react-hooks/exhaustive-deps

  const escena = useMemo(() => {
    let k = 0;
    c.escenas.forEach((e, i) => {
      if (e.t <= ahora + 0.25) k = i;
    });
    return k;
  }, [c, ahora]);

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
    setAhora(s);
    void v.play().catch(() => undefined);
  };
  const irCapitulo = (k: number) => {
    setN(k);
    setInicio(0);
    setAhora(0);
  };
  useEffect(() => setFallo(false), [n, sv.id, abierto]);
  const prev = CAPITULOS.find((x) => x.n === n - 1), next = CAPITULOS.find((x) => x.n === n + 1);

  return createPortal(
    <AnimatePresence>
      {abierto && (
        <motion.div
          className="vm-fondo"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: reducir ? 0 : 0.25 }}
          onMouseDown={(e) => {
            if (e.target === e.currentTarget) onCerrar();
          }}
        >
          <motion.div
            ref={caja}
            className="vm-caja"
            role="dialog"
            aria-modal="true"
            aria-labelledby="vm-titulo"
            initial={reducir ? false : { opacity: 0, rotateX: 12, y: 40, scale: 0.94 }}
            animate={{ opacity: 1, rotateX: 0, y: 0, scale: 1 }}
            exit={reducir ? { opacity: 0 } : { opacity: 0, rotateX: -8, y: 24, scale: 0.96 }}
            transition={{ duration: reducir ? 0 : 0.45, ease: [0.16, 0.8, 0.2, 1] }}
            style={{ transformPerspective: 1400 }}
          >
            <header className="vm-cab">
              <span className="vm-num" aria-hidden="true">
                {String(c.n).padStart(2, '0')}
              </span>
              <div className="vm-cab-txt">
                <p className="vm-kicker">
                  {sv.titulo} · capítulo {c.n} de {CAPITULOS.length}
                </p>
                <h2 id="vm-titulo">{c.titulo}</h2>
              </div>
              <button ref={cerrar} type="button" className="vm-cerrar" onClick={onCerrar} aria-label="Cerrar el vídeo">
                <span aria-hidden="true">×</span>
              </button>
            </header>

            <div className="vm-cuerpo">
              <div className="vm-pantalla">
                {c.url ? (
                  <video
                    key={`${sv.id}-${c.n}`}
                    ref={video}
                    src={c.url}
                    poster={c.poster ? baseUrl(c.poster) : undefined}
                    controls
                    playsInline
                    preload="metadata"
                    onError={() => setFallo(true)}
                    onLoadedMetadata={(e) => aplicarSalto(e.currentTarget)}
                    onLoadedData={(e) => aplicarSalto(e.currentTarget)}
                    onCanPlay={(e) => aplicarSalto(e.currentTarget)}
                    onTimeUpdate={(e) => {
                      comprobarSalto(e.currentTarget);
                      if (pendiente.current === null) setAhora(e.currentTarget.currentTime);
                    }}
                    onSeeked={(e) => {
                      comprobarSalto(e.currentTarget);
                      setAhora(e.currentTarget.currentTime);
                    }}
                  >
                    Tu navegador no puede reproducir este vídeo. <a href={c.url}>Descárgalo aquí</a>.
                  </video>
                ) : (
                  <p className="vm-nopub">
                    <Icon name="aviso" /> Este capítulo aún no está publicado.
                  </p>
                )}
                {fallo && c.url && (
                  <p className="vm-nopub vm-fallo" role="status">
                    <Icon name="aviso" /> No se ha podido cargar el clip. Búscalo en la grabación: {sv.original ? sv.corto : sv.titulo} ·{' '}
                    {mmss(c.inicio + ahora)} — {c.escenas[escena]?.titulo ?? c.titulo}
                  </p>
                )}
              </div>

              <aside className="vm-escenas" aria-label="Escenas del capítulo">
                <ol ref={lista}>
                  {c.escenas.map((e, i) => (
                    <li key={e.t + e.titulo}>
                      <button
                        type="button"
                        className={`vm-escena${i === escena ? ' es' : ''}`}
                        aria-current={i === escena ? 'true' : undefined}
                        onClick={() => saltar(e.t)}
                        disabled={!c.url}
                      >
                        <span className="vm-escena-t">{mmss(e.t)}</span>
                        <span>{e.titulo}</span>
                      </button>
                    </li>
                  ))}
                </ol>
              </aside>
            </div>

            <footer className="vm-pie">
              <div className="vm-pie-nav">
                <button type="button" className="btn ghost sm" onClick={() => prev && irCapitulo(prev.n)} disabled={!prev}>
                  <Icon name="atras" /> Anterior
                </button>
                <button type="button" className="btn ghost sm" onClick={() => next && irCapitulo(next.n)} disabled={!next}>
                  Siguiente <Icon name="flecha" />
                </button>
              </div>
              {sv.pagina && (
                <Link className="vm-pagina" to={`${sv.pagina}/${c.n}?t=${Math.floor(ahora)}`} onClick={onCerrar}>
                  Abrir en la página del vídeo
                </Link>
              )}
            </footer>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>,
    document.body,
  );
}

/**
 * Dónde está el momento: «Vídeo «Compras» · cap. 3, 04:12» o, si es un trozo de una grabación
 * original, el minuto de la sesión para buscarlo a mano («Vídeo «Sesión 1» · 1:02:33»).
 */
export function dondeMomento(m: MomentoVideo) {
  const sv = m.serie ? serieDe(m.serie) : null;
  if (sv?.original) return `Vídeo «${sv.corto}» · ${mmss(m.t)}`;
  return `${sv ? `Vídeo «${sv.corto}»` : 'Vídeo de Compras'} · cap. ${m.capitulo}, ${mmss(m.tCap)}`;
}

/** Botón «Ver el vídeo · cap. N, mm:ss — título» que abre el momento en la ventana modal. */
export function BotonMomento({ m, className }: { m: MomentoVideo; className?: string }) {
  const [abierto, setAbierto] = useState(false);
  return (
    <>
      <button type="button" className={`vm-boton${className ? ` ${className}` : ''}`} onClick={() => setAbierto(true)} aria-haspopup="dialog">
        <span className="vm-boton-play" aria-hidden="true">
          <Icon name="play" />
        </span>
        <span className="vm-boton-txt">
          <strong>Ver el vídeo</strong>
          <span>
            {dondeMomento(m)} — {m.titulo}
          </span>
        </span>
      </button>
      <ReproductorModal serie={m.serie} capitulo={m.capitulo} t={m.tCap} abierto={abierto} onCerrar={() => setAbierto(false)} />
    </>
  );
}
