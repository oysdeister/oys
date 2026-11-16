import type { CSSProperties } from 'react';
import { Link, NavLink } from 'react-router-dom';
import { Icon } from '../Icon';
import { Anillo } from './Anillo';
import { MODULOS, META } from '../../content';
import { useProgreso } from '../../lib/progress';
import { avanceGlobal, avanceModulo } from '../../lib/avance';

const PRACTICA = [
  { to: '/taller', label: 'Taller', icon: 'taller' },
  { to: '/video', label: 'Vídeo', icon: 'video' },
  { to: '/examen', label: 'Examen', icon: 'examen' },
  { to: '/logros', label: 'Logros', icon: 'logros' },
];

const pct = (v: number) => `${Math.round(v * 100)} %`;

export function Sidebar({
  oscuro,
  onTema,
  plegada,
  onPlegar,
  onNavegar,
}: {
  oscuro: boolean;
  onTema: () => void;
  plegada: boolean;
  onPlegar: () => void;
  onNavegar: () => void;
}) {
  const p = useProgreso();
  const global = avanceGlobal(p);
  const ini = p.alumno.ini || '··';
  const nombre = p.alumno.nombre || 'Alumno';
  const t = (s: string) => (plegada ? s : undefined);
  return (
    <aside className="sb" aria-label="Navegación de la plataforma" id="barra-lateral">
      <Link to="/" className="sb-brand" onClick={onNavegar} aria-label="Taller Axional, inicio">
        <img src={`${import.meta.env.BASE_URL}brand/oys_logo_light.png`} alt="" />
        <span>
          <b>Taller Axional</b>
          <small>Práctica guiada del ERP</small>
        </span>
      </Link>

      <Link to="/logros" className="sb-profile" onClick={onNavegar} title={t(`${nombre} · ${pct(global)}`)}>
        <span className="sb-avatar">
          <Anillo valor={global} size={58} grosor={4} />
          <span className="sb-ini">{ini}</span>
        </span>
        <span className="sb-who">
          <b>{nombre}</b>
          <small>
            <em>{pct(global)}</em> del curso completado
          </small>
        </span>
      </Link>

      <nav className="sb-scroll" aria-label="Principal">
        <NavLink to="/" end className="sb-link" onClick={onNavegar} title={t('Inicio')}>
          <span className="sb-ico">
            <Icon name="inicio" />
          </span>
          <span className="sb-label">Inicio</span>
        </NavLink>

        <div className="sb-group">Módulos</div>
        {MODULOS.map((m) => {
          const meta = META[m.id] ?? { color: '#4fbfa5', icono: 'check', corto: m.titulo };
          const v = avanceModulo(p, m.id);
          return (
            <NavLink
              key={m.id}
              to={`/modulo/${m.id}`}
              className="sb-link sb-mod"
              onClick={onNavegar}
              style={{ ['--mod' as string]: meta.color } as CSSProperties}
              title={t(`${meta.corto} · ${pct(v)}`)}
            >
              <span className="sb-ico">
                <Icon name={meta.icono} size={20} />
              </span>
              <span className="sb-label">{meta.corto}</span>
              <span className={`sb-pct${v >= 1 ? ' full' : ''}`}>{pct(v)}</span>
              <span className="sb-minibar" aria-hidden="true">
                <i style={{ width: `${v * 100}%` }} />
              </span>
            </NavLink>
          );
        })}

        <div className="sb-group">Practicar y demostrar</div>
        {PRACTICA.map((n) => (
          <NavLink key={n.to} to={n.to} className="sb-link" onClick={onNavegar} title={t(n.label)}>
            <span className="sb-ico">
              <Icon name={n.icon} />
            </span>
            <span className="sb-label">{n.label}</span>
          </NavLink>
        ))}
      </nav>

      <div className="sb-foot">
        <button type="button" className="sb-btn" onClick={onTema} aria-label={oscuro ? 'Cambiar a tema claro' : 'Cambiar a tema oscuro'}>
          <Icon name={oscuro ? 'sol' : 'luna'} size={20} />
          <span>{oscuro ? 'Tema claro' : 'Tema oscuro'}</span>
        </button>
        <button type="button" className="sb-btn sq sb-collapse" onClick={onPlegar} aria-label={plegada ? 'Desplegar barra lateral' : 'Plegar barra lateral'} aria-expanded={!plegada}>
          <Icon name={plegada ? 'desplegar' : 'plegar'} size={20} />
        </button>
      </div>
    </aside>
  );
}
