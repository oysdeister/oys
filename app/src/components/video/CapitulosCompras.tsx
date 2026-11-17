import { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, useReducedMotion } from 'framer-motion';
import { serieDe } from '../../content/videoSeries';
import { mmss } from '../../lib/config';
import { baseUrl } from '../../lib/texto';
import { Icon } from '../Icon';
import { ReproductorModal } from './ReproductorModal';
import './video-modal.css';

/** Capítulos de un vídeo (por defecto, compras): al tocar uno se reproduce en una ventana sobre la página. */
export function CapitulosSerie({ serie, titulo, intro }: { serie?: string; titulo?: string; intro?: string }) {
  const sv = serieDe(serie);
  const CAPITULOS = sv.capitulos;
  const hid = `vc-titulo-${sv.id}`;
  const reducir = !!useReducedMotion();
  const [cap, setCap] = useState<number | null>(null);
  const [ultimo, setUltimo] = useState(1);
  const total = Math.round(CAPITULOS.reduce((a, c) => a + c.duracion, 0) / 60);
  return (
    <section className="vc" aria-labelledby={hid}>
      <div className="vc-cab">
        <h2 id={hid}>{titulo ?? `${sv.titulo}, por capítulos`}</h2>
        {intro && <p className="vc-intro">{intro}</p>}
        <p className="muted small">
          {total} minutos en {CAPITULOS.length} capítulos. Toca uno para verlo aquí mismo.{' '}
          {sv.pagina && <Link to={sv.pagina}>Ver la página del vídeo</Link>}
        </p>
      </div>
      <ol className="vc-lista">
        {CAPITULOS.map((c, i) => (
          <motion.li
            key={c.n}
            initial={reducir ? false : { opacity: 0, y: 18, rotateX: -14 }}
            animate={{ opacity: 1, y: 0, rotateX: 0 }}
            transition={{ duration: 0.45, delay: 0.04 * i }}
            style={{ transformPerspective: 900 }}
          >
            <button
              type="button"
              className="vc-cap"
              aria-haspopup="dialog"
              onClick={() => {
                setUltimo(c.n);
                setCap(c.n);
              }}
            >
              <span className="vc-img">
                {c.poster && <img src={baseUrl(c.poster)} alt="" loading="lazy" width={640} height={360} />}
                <span className="vc-play" aria-hidden="true">
                  <Icon name="play" />
                </span>
                <span className="vc-dur">{mmss(c.duracion)}</span>
              </span>
              <span className="vc-txt">
                <span className="vc-n" aria-hidden="true">
                  {String(c.n).padStart(2, '0')}
                </span>
                <span>
                  <span className="vm-sr">Capítulo {c.n}: </span>
                  {c.titulo}
                </span>
              </span>
            </button>
          </motion.li>
        ))}
      </ol>
      <ReproductorModal serie={sv.id} capitulo={cap ?? ultimo} t={0} abierto={cap !== null} onCerrar={() => setCap(null)} />
    </section>
  );
}

/** El vídeo de compras (alias histórico) */
export function CapitulosCompras({ titulo = 'El vídeo de compras, por capítulos' }: { titulo?: string }) {
  return <CapitulosSerie titulo={titulo} />;
}
