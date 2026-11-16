import type { CSSProperties } from 'react';
import { Link, useParams } from 'react-router-dom';
import { motion, useReducedMotion } from 'framer-motion';
import { Icon } from '../components/Icon';
import { NucleoOrbita } from '../components/shell/NucleoOrbita';
import { useProgreso } from '../lib/progress';
import { SIMS } from '../sims/registro';
import '../sims/taller.css';
import './portada.css';

function Lista() {
  const p = useProgreso();
  const r = useReducedMotion();
  const hechos = SIMS.filter((s) => p.sims[s.id]).length;
  return (
    <div className="wrap tl-lista">
      <header className="ax-banner tl-banner">
        <div className="tl-banner-in">
          <div className="tl-banner-txt">
            <h1>Taller</h1>
            <p className="lead">
              Simuladores para practicar lo que más cuesta al principio: cuadrar asientos, numerar documentos, seguir un circuito, leer un Docflow, calcular una factura y seguir un efecto de cartera. Primero con los datos reales de los
              ejercicios y después con variaciones nuevas.
            </p>
          </div>
          <NucleoOrbita valor={hechos / SIMS.length} etiqueta={`${hechos} de ${SIMS.length} superados`} size={180} className="tl-nucleo" />
        </div>
      </header>
      <ul className="tl-banco">
        {SIMS.map((s, i) => {
          const ok = !!p.sims[s.id];
          return (
            <motion.li
              key={s.id}
              initial={r ? false : { opacity: 0, y: 30, rotateX: -18 }}
              animate={{ opacity: 1, y: 0, rotateX: 0 }}
              transition={{ delay: 0.06 * i, type: 'spring', stiffness: 120, damping: 16 }}
              className={`tl-puesto ${ok ? 'ok' : ''}`}
            >
              <Link to={`/taller/${s.id}`} className="ax-card neon-mod tl-puesto-link" style={{ ['--sim' as string]: s.color, ['--mod' as string]: s.color } as CSSProperties}>
                <span className="ax-card-num" aria-hidden="true">
                  {String(i + 1).padStart(2, '0')}
                </span>
                <span className="tl-puesto-dibujo">{s.dibujo}</span>
                <h2>{s.titulo}</h2>
                <span className="tl-puesto-res">{s.resumen}</span>
                <span className="tl-puesto-pie">
                  <span className="chip">{s.rondas} rondas</span>
                  {ok ? (
                    <span className="tl-puesto-ok">
                      <span className="ax-check on" aria-hidden="true">
                        <Icon name="check" size={16} />
                      </span>
                      Superado
                    </span>
                  ) : (
                    <span className="btn arc sm tl-puesto-ir">
                      Empezar <Icon name="play" size={14} />
                    </span>
                  )}
                </span>
              </Link>
            </motion.li>
          );
        })}
      </ul>
    </div>
  );
}

export default function Taller() {
  const { sim } = useParams();
  const s = SIMS.find((x) => x.id === sim);
  if (!s) return <Lista />;
  const C = s.Componente;
  return (
    <div className="wrap">
      <C key={s.id} />
    </div>
  );
}
