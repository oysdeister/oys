import { useEffect, useMemo, useRef, useState, type CSSProperties } from 'react';
import { Cuenta } from '../../auth/Cuenta';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Icon } from '../Icon';
import { Anillo } from './Anillo';
import { META, MODULOS, getEjercicio, getModulo } from '../../content';
import { buscar, TIPOS } from '../../lib/buscar';
import { conIni } from '../../lib/texto';
import './buscador.css';
import { bloqueQueToca, numeroBloque } from '../../lib/ruta';
import { useProgreso } from '../../lib/progress';
import { avanceGlobal } from '../../lib/avance';

interface Miga {
  label: string;
  to?: string;
  color?: string;
}

const SECCIONES: Record<string, string> = {
  erp: 'ERP de práctica',
  taller: 'Taller',
  video: 'Vídeos',
  glosario: 'Glosario',
  errores: 'Índice de errores',
  logros: 'Logros',
  examen: 'Examen',
  certificado: 'Certificado',
  examinador: 'Panel del examinador',
};

export function migasDe(pathname: string): Miga[] {
  const [, a, b] = pathname.split('/');
  const inicio: Miga = { label: 'Inicio', to: '/' };
  if (!a) return [{ label: 'Inicio' }];
  if (a === 'modulo' && b) {
    const m = getModulo(b);
    return [inicio, { label: META[b]?.corto ?? m?.titulo ?? 'Módulo', color: META[b]?.color }];
  }
  if (a === 'ejercicio' && b) {
    const r = getEjercicio(b);
    if (!r) return [inicio, { label: 'Bloque' }];
    const meta = META[r.modulo.id];
    return [inicio, { label: meta?.corto ?? r.modulo.titulo, to: `/modulo/${r.modulo.id}`, color: meta?.color }, { label: r.ejercicio.titulo }];
  }
  const nombre = SECCIONES[a] ?? 'Inicio';
  if (b && (a === 'taller' || a === 'video')) return [inicio, { label: nombre, to: `/${a}` }, { label: a === 'video' ? `Capítulo ${b}` : 'Simulador' }];
  return [inicio, { label: nombre }];
}

function Buscador() {
  const [q, setQ] = useState('');
  const [abierto, setAbierto] = useState(false);
  const [sel, setSel] = useState(0);
  const ref = useRef<HTMLInputElement>(null);
  const nav = useNavigate();
  const ini = useProgreso().alumno.ini;
  // el índice se construye la primera vez que se busca; la búsqueda se retrasa un instante al teclear
  const [qBusca, setQBusca] = useState('');
  useEffect(() => {
    const id = window.setTimeout(() => setQBusca(q), q ? 80 : 0);
    return () => window.clearTimeout(id);
  }, [q]);
  const res = useMemo(() => buscar(qBusca, 30), [qBusca]);

  useEffect(() => {
    const k = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        ref.current?.focus();
      }
    };
    window.addEventListener('keydown', k);
    return () => window.removeEventListener('keydown', k);
  }, []);

  const ir = (to: string) => {
    nav(to);
    setQ('');
    setAbierto(false);
    ref.current?.blur();
  };

  return (
    <div className="tb-search" role="search">
      <Icon name="buscar" size={18} />
      <input
        ref={ref}
        type="search"
        placeholder="Buscar en el curso"
        aria-label="Buscar en bloques, secciones, errores y glosario"
        role="combobox"
        aria-expanded={abierto && !!q.trim()}
        aria-controls="tb-resultados"
        aria-activedescendant={res[sel] ? `tb-res-${sel}` : undefined}
        aria-autocomplete="list"
        value={q}
        onChange={(e) => {
          setQ(e.target.value);
          setSel(0);
          setAbierto(true);
        }}
        onFocus={() => setAbierto(true)}
        onBlur={() => setTimeout(() => setAbierto(false), 150)}
        onKeyDown={(e) => {
          if (e.key === 'ArrowDown') {
            e.preventDefault();
            setSel((s) => Math.min(s + 1, res.length - 1));
          } else if (e.key === 'ArrowUp') {
            e.preventDefault();
            setSel((s) => Math.max(s - 1, 0));
          } else if (e.key === 'Enter' && res[sel]) {
            ir(res[sel].to);
          } else if (e.key === 'Escape') {
            setQ('');
            ref.current?.blur();
          }
        }}
      />
      <kbd>⌘K</kbd>
      {abierto && q.trim() && (
        <motion.div className="tb-results" id="tb-resultados" role="listbox" aria-label="Resultados" initial={{ opacity: 0, y: -6 }} animate={{ opacity: 1, y: 0 }}>
          {res.length === 0 && qBusca === q && <p className="muted">No hay nada con «{q.trim()}». Prueba con «pedido», «factura» o «asiento».</p>}
          {res.map((r, i) => (
            <a
              key={`${r.to}-${i}`}
              id={`tb-res-${i}`}
              role="option"
              aria-selected={i === sel}
              href={`#${r.to}`}
              className={i === sel ? 'sel' : undefined}
              style={{ ['--mod' as string]: META[r.modulo]?.color } as CSSProperties}
              onMouseDown={(e) => {
                e.preventDefault();
                ir(r.to);
              }}
            >
              <span className="dot" />
              <span className="tb-res-txt">
                <b>
                  <em className={`tb-tipo ${r.tipo}`}>{TIPOS[r.tipo]}</em>
                  {conIni(r.titulo, ini)}
                </b>
                {r.fragmento && <span className="tb-frag">{conIni(r.fragmento, ini)}</span>}
                <small>{r.donde}</small>
              </span>
            </a>
          ))}
        </motion.div>
      )}
    </div>
  );
}

export function Topbar({ onMenu, abierto = false }: { onMenu: () => void; abierto?: boolean }) {
  const loc = useLocation();
  const p = useProgreso();
  const pct = avanceGlobal(p);
  const migas = migasDe(loc.pathname);
  // En la portada, junto a «Inicio»: por dónde vas (solo texto; la acción está en la portada)
  const vasPor = useMemo(() => {
    if (loc.pathname !== '/') return null;
    for (const m of MODULOS) {
      const b = bloqueQueToca(p, m);
      if (b) return { color: META[m.id]?.color, t: `${META[m.id]?.corto ?? m.titulo}, bloque ${numeroBloque(m, b.id)}` };
    }
    return null;
  }, [loc.pathname, p]);
  return (
    <header className="tb">
      <button type="button" className="tb-menu" onClick={onMenu} aria-label="Abrir menú" aria-controls="barra-lateral" aria-expanded={abierto}>
        <Icon name="menu" size={24} />
      </button>
      <Link to="/" className="tb-logo" aria-label="Inicio">
        <img src={`${import.meta.env.BASE_URL}brand/oys_logo.png`} alt="" className="logo-claro" />
        <img src={`${import.meta.env.BASE_URL}brand/oys_logo_light.png`} alt="" className="logo-oscuro" />
      </Link>
      <nav className="tb-crumbs" aria-label="Estás en">
        {migas.map((m, i) => {
          const ultimo = i === migas.length - 1;
          return (
            <span key={i} className="tb-crumb">
              {i > 0 && (
                <span className="sep" aria-hidden="true">
                  /
                </span>
              )}
              {m.color && <span className="dot" style={{ ['--mod' as string]: m.color } as CSSProperties} aria-hidden="true" />}
              {ultimo || !m.to ? <span aria-current={ultimo ? 'page' : undefined}>{m.label}</span> : <Link to={m.to}>{m.label}</Link>}
            </span>
          );
        })}
        {vasPor && (
          <span className="tb-vaspor">
            <span className="dot" style={{ ['--mod' as string]: vasPor.color } as CSSProperties} aria-hidden="true" />
            Vas por {vasPor.t}
          </span>
        )}
      </nav>
      <div className="tb-right">
        <Buscador />
        <Link to="/logros" className="tb-progress" aria-label={`Progreso del curso: ${Math.round(pct * 100)} %`}>
          <Anillo valor={pct} size={34} grosor={4} />
          {Math.round(pct * 100)} %
        </Link>
        <Cuenta />
      </div>
      <div className="meter top-meter" aria-hidden="true">
        <motion.i initial={false} animate={{ width: `${pct * 100}%` }} transition={{ type: 'spring', stiffness: 60, damping: 18 }} />
      </div>
    </header>
  );
}
