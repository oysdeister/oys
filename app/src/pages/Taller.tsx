import { Link, useParams } from 'react-router-dom';
import { motion, useReducedMotion } from 'framer-motion';
import { Icon } from '../components/Icon';
import { useProgreso } from '../lib/progress';
import { SIMS } from '../sims/registro';
import '../sims/taller.css';

function Lista() {
  const p = useProgreso();
  const r = useReducedMotion();
  const hechos = SIMS.filter((s) => p.sims[s.id]).length;
  return (
    <div className="wrap tl-lista">
      <header className="tl-lista-cab">
        <div>
          <h1>Taller</h1>
          <p className="lead muted">
            Simuladores para practicar lo que más cuesta al principio: cuadrar asientos, numerar documentos, seguir un circuito y leer un Docflow. Primero con los datos reales de los
            ejercicios y después con variaciones nuevas.
          </p>
        </div>
        <div className="tl-lista-cont" aria-label={`${hechos} de ${SIMS.length} superados`}>
          <svg viewBox="0 0 120 70" aria-hidden="true">
            <path d="M10 64 A50 50 0 0 1 110 64" fill="none" stroke="var(--line)" strokeWidth="9" strokeLinecap="round" />
            <motion.path
              d="M10 64 A50 50 0 0 1 110 64"
              fill="none"
              stroke="var(--arc)"
              strokeWidth="9"
              strokeLinecap="round"
              initial={{ pathLength: 0 }}
              animate={{ pathLength: hechos / SIMS.length }}
              transition={{ duration: r ? 0 : 1.1, ease: [0.2, 0.7, 0.2, 1] }}
            />
          </svg>
          <b>
            {hechos}/{SIMS.length}
          </b>
          <span>superados</span>
        </div>
      </header>
      <ul className="tl-banco">
        {SIMS.map((s, i) => {
          const ok = !!p.sims[s.id];
          return (
            <motion.li
              key={s.id}
              style={{ ['--sim' as string]: s.color }}
              initial={r ? false : { opacity: 0, y: 30, rotateX: -18 }}
              animate={{ opacity: 1, y: 0, rotateX: 0 }}
              transition={{ delay: 0.08 * i, type: 'spring', stiffness: 120, damping: 16 }}
              className={`tl-puesto ${ok ? 'ok' : ''} ${i % 3 === 0 ? 'ancho' : ''}`}
            >
              <Link to={`/taller/${s.id}`} className="tl-puesto-link">
                <span className="tl-puesto-dibujo">{s.dibujo}</span>
                <span className="tl-puesto-txt">
                  <span className="tl-puesto-n">{String(i + 1).padStart(2, '0')}</span>
                  <h2>{s.titulo}</h2>
                  <span className="muted">{s.resumen}</span>
                  <span className="tl-puesto-pie">
                    <span className="chip">{s.rondas} rondas</span>
                    {ok ? (
                      <span className="chip ok">
                        <Icon name="check" size={14} /> Superado
                      </span>
                    ) : (
                      <span className="tl-puesto-ir">
                        Empezar <Icon name="play" size={14} />
                      </span>
                    )}
                  </span>
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
