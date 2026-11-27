import { useMemo, type CSSProperties } from 'react';
import { Link, useParams } from 'react-router-dom';
import { Icon } from '../components/Icon';
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
function Segmentos({ total, hechas }: { total: number; hechas: number }) {
  return (
    <span className="tlg-seg" aria-hidden="true">
      {Array.from({ length: total }, (_, i) => (
        <i key={i} className={i < hechas ? 'on' : ''} />
      ))}
    </span>
  );
}

function Tarjeta({ s, estado, hechas }: { s: SimInfo; estado: Estado; hechas: number }) {
  const n = Math.min(hechas, s.rondas);
  const rotulo = ROTULO[estado];
  const cta = CTA[estado];
  return (
    <li>
      <Link
        to={`/taller/${s.id}`}
        className={`tlg-card est-${estado}`}
        style={{ ['--sim' as string]: s.color } as CSSProperties}
        aria-label={`${s.titulo}. ${rotulo}. ${n} de ${s.rondas} rondas. ${cta}.`}
      >
        <span className="tlg-top">
          <span className="tlg-ico" aria-hidden="true">
            <Icon name={iconoSim(s.id)} size={22} stroke={2} />
          </span>
          <span className={`tlg-estado est-${estado}`} aria-hidden="true">
            {estado === 'ok' && <Icon name="check" size={14} stroke={3} />}
            {rotulo}
          </span>
        </span>
        <h2>{s.titulo}</h2>
        <span className="tlg-res">{s.resumen}</span>
        <span className="tlg-pie">
          <span className="tlg-prog">
            <Segmentos total={s.rondas} hechas={n} />
            <small>
              {n} de {s.rondas} rondas
            </small>
          </span>
          <span className="tlg-cta" aria-hidden="true">
            {cta} <Icon name="flecha" size={16} stroke={2.4} />
          </span>
        </span>
      </Link>
    </li>
  );
}

function Lista() {
  const p = useProgreso();
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
    <div className="wrap cs-pag tlg">
      <header className="g-hero cs-hero">
        <p className="g-kicker">Practicar y demostrar</p>
        <h1>Taller</h1>
        <p className="cs-lead">Simuladores para practicar lo que más cuesta al principio. Primero con los datos de los bloques y después con variaciones nuevas.</p>
        <p className="cs-datos">
          <span>
            <b>
              {rondasHechas} de {rondasTotal}
            </b>{' '}
            rondas
          </span>
          <span>
            <b>
              {superados} de {SIMS.length}
            </b>{' '}
            simuladores superados
          </span>
        </p>
        {siguiente && (
          <Link className="btn cs-btn" to={`/taller/${siguiente.s.id}`}>
            {siguiente.estado === 'curso' ? 'Seguir' : 'Empezar'}: {siguiente.s.titulo}
            <Icon name="flecha" size={18} stroke={2.4} />
          </Link>
        )}
      </header>
      <ul className="tlg-banco">
        {datos.map((d) => (
          <Tarjeta key={d.s.id} s={d.s} estado={d.estado} hechas={d.hechas} />
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
    <div className="wrap cs-pag">
      <C key={s.id} />
    </div>
  );
}
