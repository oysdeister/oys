import { useState } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import type { Ejercicio } from '../../types';
import { conIni } from '../../lib/texto';
import { Ideas, SeccionVista } from './SeccionVista';
import { VerMas, useRevela } from './Revela';
import { parrafos } from './util';
import { IDEAS_VIDEO } from './videoIdeas';
import { Link } from 'react-router-dom';
import { CAPITULOS_VIDEO, VIDEO_POR_EJERCICIO } from '../../lib/config';
import { momentosDeSeccion } from '../../content/videoMapa';
import { Momentos } from './VideoMomento';
import { Icon } from '../Icon';

/** Ideas de un capítulo: tres a la vista y el resto tras «Ver más» */
function IdeasCap({ ideas }: { ideas: string[] }) {
  const [todo, setTodo] = useState(false);
  const r = useRevela();
  const vis = todo ? ideas : ideas.slice(0, 3);
  return (
    <>
      <ul>
        {vis.map((t, k) => (
          <motion.li key={k} {...r(k, 10)}>
            {t}
          </motion.li>
        ))}
      </ul>
      {ideas.length > 3 && <VerMas abierto={todo} resto={ideas.length - 3} que={ideas.length - 3 === 1 ? 'idea más' : 'ideas más'} onClick={() => setTodo((v) => !v)} />}
    </>
  );
}

/** «Lo que cuenta el vídeo»: 2-3 ideas de cada capítulo enlazado al ejercicio */
function LoQueCuentaElVideo({ id }: { id: string }) {
  const r = useRevela();
  const caps = (VIDEO_POR_EJERCICIO[id] ?? [])
    .map((n) => ({ cap: CAPITULOS_VIDEO.find((c) => c.n === n), ideas: IDEAS_VIDEO[n] ?? [] }))
    .filter((x) => x.cap && x.ideas.length);
  if (!caps.length) return null;
  return (
    <section className="vid-block" aria-labelledby="vid-h">
      <p className="kick">Resumen del vídeo</p>
      <h2 id="vid-h">
        <Icon name="video" size={22} /> <span className="tx-grad">Lo que cuenta el vídeo</span>
      </h2>
      <div className="vid-cards">
        {caps.map(({ cap, ideas }, i) => (
          <motion.article key={cap!.n} className="vid-card" {...r(i)}>
            <header className="vid-head">
              <span className="vid-n">{cap!.n}</span>
              <span>
                <strong>{cap!.titulo}</strong>
                <Link className="small" to={`/video/${cap!.n}`}>
                  Ver el capítulo {cap!.n} en el vídeo
                </Link>
              </span>
            </header>
            <IdeasCap ideas={ideas} />
          </motion.article>
        ))}
      </div>
    </section>
  );
}

export function Concepto({ ej, ini, modulo, onGuiado }: { ej: Ejercicio; ini: string; modulo: string; onGuiado: () => void }) {
  const reducir = useReducedMotion();
  const r = useRevela();
  const t = (x: string) => conIni(x, ini);
  const [primero, ...resto] = parrafos(ej.concepto);
  return (
    <div className="concepto">
      <div className="concepto-intro">
        <p className="kick">Antes de tocar nada</p>
        <h2>
          <span className="tx-grad">La idea</span>
        </h2>
        {primero && (
          <motion.p className="lead-p concepto-lead" {...r(0)}>
            {t(primero)}
          </motion.p>
        )}
        <Ideas parrafos={resto} ini={ini} />
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
        <motion.section key={s.id} id={`sec-${s.id}`} className="sec-block ax-panel" {...r(0, 28)}>
          <header className="sec-head">
            <span className="sec-num">{i + 1}</span>
            <span className="sec-head-txt">
              <span className="kick">
                Parte {i + 1} de {ej.secciones.length}
              </span>
              <h3>{t(s.titulo)}</h3>
            </span>
          </header>
          <Momentos lista={momentosDeSeccion(s.id)} />
          <SeccionVista s={s} ini={ini} modulo={modulo} />
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
