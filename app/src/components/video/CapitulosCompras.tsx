import { useState } from 'react';
import { Link } from 'react-router-dom';
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
  const [cap, setCap] = useState<number | null>(null);
  const [ultimo, setUltimo] = useState(1);
  const total = Math.round(CAPITULOS.reduce((a, c) => a + c.duracion, 0) / 60);
  return (
    <section className="vc" aria-labelledby={hid}>
      <div className="vc-cab">
        <h2 id={hid}>{titulo ?? `${sv.titulo}, por capítulos`}</h2>
        {intro && <p className="vc-intro">{intro}</p>}
        <p className="muted small">
          {total} {total === 1 ? 'minuto' : 'minutos'} en {CAPITULOS.length} {CAPITULOS.length === 1 ? 'capítulo' : 'capítulos'}. Toca {CAPITULOS.length === 1 ? 'el capítulo' : 'uno'} para verlo aquí mismo.{' '}
          {sv.pagina && <Link to={sv.pagina}>Ver la página del vídeo</Link>}
        </p>
      </div>
      <ol className="vc-lista">
        {CAPITULOS.map((c) => (
          <li key={c.n}>
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
                {c.audio && <span className="vc-audio">Podcast · solo audio</span>}
                <span className="vc-play" aria-hidden="true">
                  <Icon name="play" />
                </span>
                <span className="vc-dur">{mmss(c.duracion)}</span>
              </span>
              <span className="vc-txt">
                <span className="vc-n" aria-hidden="true">
                  {c.n}
                </span>
                <span>
                  <span className="vm-sr">Capítulo {c.n}: </span>
                  {c.titulo}
                </span>
              </span>
            </button>
          </li>
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
