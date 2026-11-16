import { motion, useReducedMotion } from 'framer-motion';
import type { Ejercicio } from '../../types';
import { conIni } from '../../lib/texto';
import { SeccionVista } from './SeccionVista';
import { parrafos } from './util';
import { IDEAS_VIDEO } from './videoIdeas';
import { CAPITULOS_VIDEO, VIDEO_POR_EJERCICIO, VIDEO_URL, mmss, urlCapitulo } from '../../lib/config';
import { Icon } from '../Icon';

/** «Lo que cuenta el vídeo»: 2-3 ideas de cada capítulo enlazado al ejercicio */
function LoQueCuentaElVideo({ id }: { id: string }) {
  const reducir = useReducedMotion();
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
        {caps.map(({ cap, ideas }, i) => (
          <motion.article
            key={cap!.n}
            className="vid-card"
            initial={reducir ? false : { opacity: 0, rotateY: -35, x: -30 }}
            whileInView={{ opacity: 1, rotateY: 0, x: 0 }}
            viewport={{ once: true, margin: '-40px' }}
            transition={{ delay: i * 0.1, type: 'spring', stiffness: 90, damping: 15 }}
            style={{ transformPerspective: 1000, transformOrigin: '0% 50%' }}
          >
            <header className="vid-head">
              <span className="vid-n">{cap!.n}</span>
              <span>
                <strong>{cap!.titulo}</strong>
                {VIDEO_URL ? (
                  <a className="small" href={urlCapitulo(cap!.t)} target="_blank" rel="noopener noreferrer">
                    Ver desde el minuto {mmss(cap!.t)}
                  </a>
                ) : (
                  <span className="small muted">Capítulo {cap!.n} · desde {mmss(cap!.t)}</span>
                )}
              </span>
            </header>
            <ul>
              {ideas.map((t, k) => (
                <li key={k}>{t}</li>
              ))}
            </ul>
          </motion.article>
        ))}
      </div>
    </section>
  );
}

export function Concepto({ ej, ini, onGuiado }: { ej: Ejercicio; ini: string; onGuiado: () => void }) {
  const reducir = useReducedMotion();
  const t = (x: string) => conIni(x, ini);
  return (
    <div className="concepto">
      <div className="obj-card">
        <svg className="obj-arc" viewBox="0 0 200 120" aria-hidden="true">
          <path d="M10 112 C 4 50, 80 8, 196 26" fill="none" stroke="currentColor" strokeWidth="9" strokeLinecap="round" />
        </svg>
        <span className="obj-label">Al terminar</span>
        <p className="obj-text">{t(ej.objetivo)}</p>
      </div>

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
        <motion.section
          key={s.id}
          id={`sec-${s.id}`}
          className="sec-block"
          initial={reducir ? false : { opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-60px' }}
          transition={{ duration: 0.45, ease: [0.2, 0.7, 0.2, 1] }}
        >
          <header className="sec-head">
            <span className="sec-num">{i + 1}</span>
            <h3>{t(s.titulo)}</h3>
          </header>
          <SeccionVista s={s} ini={ini} />
        </motion.section>
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
