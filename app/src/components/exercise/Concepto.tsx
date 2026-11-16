import { useReducedMotion } from 'framer-motion';
import type { Ejercicio } from '../../types';
import { conIni } from '../../lib/texto';
import { SeccionVista } from './SeccionVista';
import { parrafos } from './util';
import { IDEAS_VIDEO } from './videoIdeas';
import { Link } from 'react-router-dom';
import { CAPITULOS_VIDEO, VIDEO_POR_EJERCICIO } from '../../lib/config';
import { momentosDeSeccion } from '../../content/videoMapa';
import { Momentos } from './VideoMomento';
import { Icon } from '../Icon';

/** «Lo que cuenta el vídeo»: 2-3 ideas de cada capítulo enlazado al ejercicio */
function LoQueCuentaElVideo({ id }: { id: string }) {
  const caps = (VIDEO_POR_EJERCICIO[id] ?? [])
    .map((n) => ({ cap: CAPITULOS_VIDEO.find((c) => c.n === n), ideas: IDEAS_VIDEO[n] ?? [] }))
    .filter((x) => x.cap && x.ideas.length);
  if (!caps.length) return null;
  return (
    <section className="vid-block" aria-labelledby="vid-h">
      <h2 id="vid-h">
        <Icon name="video" size={22} /> Lo que cuenta el vídeo
      </h2>
      <div className="vid-cards">
        {caps.map(({ cap, ideas }) => (
          <article key={cap!.n} className="vid-card">
            <header className="vid-head">
              <span className="vid-n">{cap!.n}</span>
              <span>
                <strong>{cap!.titulo}</strong>
                <Link className="small" to={`/video/${cap!.n}`}>
                  Ver el capítulo {cap!.n} en el vídeo
                </Link>
              </span>
            </header>
            <ul>
              {ideas.map((t, k) => (
                <li key={k}>{t}</li>
              ))}
            </ul>
          </article>
        ))}
      </div>
    </section>
  );
}

export function Concepto({ ej, ini, modulo, onGuiado }: { ej: Ejercicio; ini: string; modulo: string; onGuiado: () => void }) {
  const reducir = useReducedMotion();
  const t = (x: string) => conIni(x, ini);
  return (
    <div className="concepto">
      <div className="concepto-intro">
        <h2>La idea</h2>
        {parrafos(ej.concepto).map((p, i) => (
          <p key={i} className={i === 0 ? 'lead-p' : undefined}>
            {t(p)}
          </p>
        ))}
      </div>

      <LoQueCuentaElVideo id={ej.id} />

      {ej.secciones.length > 1 && (
        <nav className="sec-index" aria-label="Partes del ejercicio">
          {ej.secciones.map((s, i) => (
            <a key={s.id} href={`#sec-${s.id}`} onClick={(e) => {
              e.preventDefault();
              document.getElementById(`sec-${s.id}`)?.scrollIntoView({ behavior: reducir ? 'auto' : 'smooth', block: 'start' });
            }}>
              <i>{i + 1}</i>
              {t(s.titulo)}
            </a>
          ))}
        </nav>
      )}

      {ej.secciones.map((s, i) => (
        <section key={s.id} id={`sec-${s.id}`} className="sec-block ax-panel">
          <header className="sec-head">
            <span className="sec-num">{i + 1}</span>
            <h3>{t(s.titulo)}</h3>
          </header>
          <Momentos lista={momentosDeSeccion(s.id)} />
          <SeccionVista s={s} ini={ini} modulo={modulo} />
        </section>
      ))}

      <div className="concepto-fin">
        <p>¿Lo tienes? Ahora hazlo tú sobre las pantallas reales.</p>
        <button className="btn arc" onClick={onGuiado}>
          Empezar el recorrido guiado
        </button>
      </div>
    </div>
  );
}
