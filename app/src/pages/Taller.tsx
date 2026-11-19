import { useMemo, useRef, type CSSProperties, type PointerEvent } from 'react';
import { Link, useParams } from 'react-router-dom';
import { motion, useReducedMotion } from 'framer-motion';
import { Icon } from '../components/Icon';
import { NucleoOrbita } from '../components/shell/NucleoOrbita';
import { useProgreso } from '../lib/progress';
import { SIMS, type SimInfo } from '../sims/registro';
import { leeAvanceTaller } from '../sims/kit';
import '../sims/taller.css';
import '../sims/taller-portada.css';
import './portada.css';

type Estado = 'nuevo' | 'curso' | 'ok';

function Tarjeta({ s, i, estado, hechas, reducido }: { s: SimInfo; i: number; estado: Estado; hechas: number; reducido: boolean }) {
  const ref = useRef<HTMLAnchorElement>(null);
  // Profundidad: la tarjeta se inclina hacia el puntero (solo ratón y sin movimiento reducido)
  const mueve = (e: PointerEvent<HTMLAnchorElement>) => {
    if (reducido || e.pointerType !== 'mouse' || !ref.current) return;
    const b = ref.current.getBoundingClientRect();
    const x = (e.clientX - b.left) / b.width - 0.5;
    const y = (e.clientY - b.top) / b.height - 0.5;
    ref.current.style.setProperty('--rx', `${(-y * 10).toFixed(2)}deg`);
    ref.current.style.setProperty('--ry', `${(x * 12).toFixed(2)}deg`);
    ref.current.style.setProperty('--mx', `${((x + 0.5) * 100).toFixed(1)}%`);
    ref.current.style.setProperty('--my', `${((y + 0.5) * 100).toFixed(1)}%`);
  };
  const suelta = () => {
    ref.current?.style.setProperty('--rx', '0deg');
    ref.current?.style.setProperty('--ry', '0deg');
  };
  const rotulo = estado === 'ok' ? 'Superado' : estado === 'curso' ? 'En curso' : 'Sin empezar';
  const cta = estado === 'ok' ? 'Repetir' : estado === 'curso' ? 'Seguir' : 'Empezar';
  return (
    <motion.li
      initial={reducido ? false : { opacity: 0, y: 40, rotateX: -24, scale: 0.94 }}
      animate={{ opacity: 1, y: 0, rotateX: 0, scale: 1 }}
      transition={{ delay: 0.07 * i, type: 'spring', stiffness: 110, damping: 15 }}
      className={`tlp-item est-${estado}`}
    >
      <Link
        ref={ref}
        to={`/taller/${s.id}`}
        className="ax-card neon-mod tlp-nave"
        style={{ ['--sim' as string]: s.color, ['--mod' as string]: s.color } as CSSProperties}
        onPointerMove={mueve}
        onPointerLeave={suelta}
        aria-label={`${s.titulo}. ${rotulo}. ${Math.min(hechas, s.rondas)} de ${s.rondas} rondas. ${cta}.`}
      >
        <span className="tlp-brillo" aria-hidden="true" />
        {estado !== 'nuevo' && (
          <span className="tlp-estado" aria-hidden="true">
            {estado === 'ok' ? <Icon name="check" size={14} stroke={3} /> : <span className="tlp-punto" />}
            {rotulo}
          </span>
        )}
        <h2>{s.titulo}</h2>
        <span className="tl-puesto-res">{s.resumen}</span>
        <span className="tlp-pie">
          <span className="tlp-progreso">
            <span className="tlp-barra">
              <span style={{ width: `${(Math.min(hechas, s.rondas) / s.rondas) * 100}%` }} />
            </span>
            <small>
              {Math.min(hechas, s.rondas)} de {s.rondas} rondas
            </small>
          </span>
          <span className={`btn sm tlp-cta ${estado === 'ok' ? 'ghost' : 'arc'}`}>
            {cta} <Icon name={estado === 'ok' ? 'flecha' : 'play'} size={14} />
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
    <div className="wrap tl-lista">
      <header className="ax-banner tl-banner">
        <div className="tl-banner-in">
          <div className="tl-banner-txt">
            <h1>Taller</h1>
            <p className="lead">Minijuegos para practicar lo que más cuesta al principio. Primero con los datos de los bloques y después con variaciones nuevas.</p>
            <div className="tlp-resumen">
              <span className="chip">
                <b>{rondasHechas}</b>&nbsp;de {rondasTotal} rondas
              </span>
              <span className="chip">
                <b>{superados}</b>&nbsp;de {SIMS.length} medallas
              </span>
              {siguiente && (
                <Link className="btn arc tlp-seguir" to={`/taller/${siguiente.s.id}`}>
                  {siguiente.estado === 'curso' ? 'Seguir' : 'Empezar'}: {siguiente.s.titulo} <Icon name="play" size={14} />
                </Link>
              )}
            </div>
          </div>
          <NucleoOrbita valor={superados / SIMS.length} etiqueta={`${superados} de ${SIMS.length} superados`} size={180} className="tl-nucleo" />
        </div>
      </header>
      <ul className="tlp-banco">
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
