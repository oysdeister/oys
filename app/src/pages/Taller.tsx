import { useMemo, type CSSProperties } from 'react';
import { Link, useParams } from 'react-router-dom';
import { motion, useReducedMotion } from 'framer-motion';
import { Icon, Medal } from '../components/Icon';
import { NucleoOrbita } from '../components/shell/NucleoOrbita';
import { useProgreso } from '../lib/progress';
import { SIMS, type SimInfo } from '../sims/registro';
import { iconoSim, leeAvanceTaller } from '../sims/kit';
import '../sims/taller.css';
import '../sims/taller-portada.css';
import '../sims/taller-app.css';
import './portada.css';

type Estado = 'nuevo' | 'curso' | 'ok';

const ROTULO: Record<Estado, string> = { nuevo: 'Nuevo', curso: 'En curso', ok: 'Superado' };
const CTA: Record<Estado, string> = { nuevo: 'Empezar', curso: 'Seguir', ok: 'Repetir' };

/** Barra segmentada: un tramo por ronda */
function Segmentos({ total, hechas, reducido, retraso = 0 }: { total: number; hechas: number; reducido: boolean; retraso?: number }) {
  return (
    <span className="tla-seg" aria-hidden="true">
      {Array.from({ length: total }, (_, i) => (
        <i key={i}>
          {i < hechas && (
            <motion.b
              initial={reducido ? false : { scaleX: 0 }}
              animate={{ scaleX: 1 }}
              transition={{ delay: retraso + 0.06 * i, duration: 0.45, ease: [0.2, 0.7, 0.2, 1] }}
            />
          )}
        </i>
      ))}
    </span>
  );
}

function Tarjeta({ s, i, estado, hechas, reducido }: { s: SimInfo; i: number; estado: Estado; hechas: number; reducido: boolean }) {
  const n = Math.min(hechas, s.rondas);
  const rotulo = ROTULO[estado];
  const cta = CTA[estado];
  return (
    <motion.li
      initial={reducido ? false : { opacity: 0, y: 24, scale: 0.97 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ delay: 0.06 * i, type: 'spring', stiffness: 170, damping: 20 }}
      className={`tla-item est-${estado}`}
    >
      <Link
        to={`/taller/${s.id}`}
        className={`ax-card neon-mod tlp-nave tla-card est-${estado}`}
        style={{ ['--sim' as string]: s.color, ['--mod' as string]: s.color } as CSSProperties}
        aria-label={`${s.titulo}. ${rotulo}. ${n} de ${s.rondas} rondas. ${cta}.`}
      >
        <span className="tla-top">
          <span className="tla-ico" aria-hidden="true">
            <Icon name={iconoSim(s.id)} size={30} stroke={2} />
            {estado === 'ok' && (
              <span className="tla-ico-medalla">
                <Medal color="#f6b65a" />
              </span>
            )}
          </span>
          <span className="tla-estado" aria-hidden="true">
            {estado === 'ok' ? <Icon name="check" size={14} stroke={3} /> : estado === 'curso' ? <span className="tla-punto" /> : <Icon name="destello" size={14} />}
            {rotulo}
          </span>
        </span>
        <h2>{s.titulo}</h2>
        <span className="tla-res">{s.resumen}</span>
        <span className="tla-pie">
          <span className="tla-prog">
            <Segmentos total={s.rondas} hechas={n} reducido={reducido} retraso={0.3 + 0.06 * i} />
            <small>
              <b>{n}</b> de {s.rondas} rondas
            </small>
          </span>
          <span className="tla-cta" aria-hidden="true">
            {cta} <Icon name="flecha" size={16} stroke={2.4} />
          </span>
        </span>
      </Link>
    </motion.li>
  );
}

function Lista() {
  const p = useProgreso();
  const r = !!useReducedMotion();
  const avance = useMemo(() => leeAvanceTaller(), []);
  const datos = SIMS.map((s) => {
    const ok = !!p.sims[s.id];
    const hechas = ok ? s.rondas : Math.min(avance[s.id] ?? 0, s.rondas);
    const estado: Estado = ok ? 'ok' : hechas > 0 ? 'curso' : 'nuevo';
    return { s, ok, hechas, estado };
  });
  const superados = datos.filter((d) => d.ok).length;
  const rondasHechas = datos.reduce((a, d) => a + d.hechas, 0);
  const rondasTotal = SIMS.reduce((a, s) => a + s.rondas, 0);
  const siguiente = datos.find((d) => d.estado === 'curso') ?? datos.find((d) => d.estado === 'nuevo');
  return (
    <div className="wrap tl-lista tla-lista">
      <header className="ax-banner tl-banner tla-banner">
        <div className="tl-banner-in">
          <div className="tl-banner-txt">
            <h1>Taller</h1>
            <p className="lead">Minijuegos para practicar lo que más cuesta al principio. Primero con los datos de los bloques y después con variaciones nuevas.</p>
            <div className="tla-resumen">
              <div className="tla-stat">
                <span className="tla-stat-num">
                  <b>{rondasHechas}</b>&nbsp;de {rondasTotal} rondas
                </span>
                <span className="tla-stat-barra" aria-hidden="true">
                  <motion.i
                    initial={r ? false : { scaleX: 0 }}
                    animate={{ scaleX: rondasTotal ? rondasHechas / rondasTotal : 0 }}
                    transition={{ delay: 0.35, duration: 0.8, ease: [0.2, 0.7, 0.2, 1] }}
                  />
                </span>
              </div>
              <div className="tla-stat oro">
                <span className="tla-stat-num">
                  <b>{superados}</b>&nbsp;de {SIMS.length} medallas
                </span>
                <span className="tla-medallas" aria-hidden="true">
                  {datos.map((d) => (
                    <i key={d.s.id} className={d.ok ? 'on' : ''} />
                  ))}
                </span>
              </div>
            </div>
            {siguiente && (
              <Link className="btn arc tlp-seguir tla-seguir" to={`/taller/${siguiente.s.id}`} style={{ ['--sim' as string]: siguiente.s.color } as CSSProperties}>
                <span className="tla-seguir-ico" aria-hidden="true">
                  <Icon name={iconoSim(siguiente.s.id)} size={18} />
                </span>
                <span>
                  {siguiente.estado === 'curso' ? 'Seguir' : 'Empezar'}: {siguiente.s.titulo}
                </span>
                <Icon name="flecha" size={18} stroke={2.4} />
              </Link>
            )}
          </div>
          <NucleoOrbita valor={superados / SIMS.length} etiqueta={`${superados} de ${SIMS.length} superados`} size={180} className="tl-nucleo" />
        </div>
      </header>
      <ul className="tlp-banco tla-banco">
        {datos.map((d, i) => (
          <Tarjeta key={d.s.id} s={d.s} i={i} estado={d.estado} hechas={d.hechas} reducido={r} />
        ))}
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
