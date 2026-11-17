import { useEffect, useMemo, useRef, useState, type CSSProperties } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Icon } from '../Icon';
import { Anillo } from './Anillo';
import { META, getEjercicio, getModulo, todosEjercicios } from '../../content';
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
    if (!r) return [inicio, { label: 'Ejercicio' }];
    const meta = META[r.modulo.id];
    return [inicio, { label: meta?.corto ?? r.modulo.titulo, to: `/modulo/${r.modulo.id}`, color: meta?.color }, { label: r.ejercicio.titulo }];
  }
  const nombre = SECCIONES[a] ?? 'Inicio';
  if (b && (a === 'taller' || a === 'video')) return [inicio, { label: nombre, to: `/${a}` }, { label: a === 'video' ? `Capítulo ${b}` : 'Simulador' }];
  return [inicio, { label: nombre }];
}

const normal = (s: string) =>
  s
    .toLowerCase()
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '');

function Buscador() {
  const [q, setQ] = useState('');
  const [abierto, setAbierto] = useState(false);
  const [sel, setSel] = useState(0);
  const ref = useRef<HTMLInputElement>(null);
  const nav = useNavigate();
  const todos = useMemo(() => todosEjercicios(), []);
  const res = useMemo(() => {
    const t = normal(q.trim());
    if (!t) return [];
    return todos.filter(({ ejercicio, modulo }) => normal(`${ejercicio.titulo} ${ejercicio.objetivo} ${modulo.titulo}`).includes(t)).slice(0, 8);
  }, [q, todos]);

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

  const ir = (id: string) => {
    nav(`/ejercicio/${id}`);
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
        placeholder="Buscar un ejercicio"
        aria-label="Buscar un ejercicio"
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
            ir(res[sel].ejercicio.id);
          } else if (e.key === 'Escape') {
            setQ('');
            ref.current?.blur();
          }
        }}
      />
      <kbd>⌘K</kbd>
      {abierto && q.trim() && (
        <motion.div className="tb-results" initial={{ opacity: 0, y: -6 }} animate={{ opacity: 1, y: 0 }}>
          {res.length === 0 && <p className="muted">No hay ejercicios con «{q.trim()}». Prueba con «pedido», «factura» o «asiento».</p>}
          {res.map(({ ejercicio, modulo }, i) => (
            <a
              key={ejercicio.id}
              href={`#/ejercicio/${ejercicio.id}`}
              className={i === sel ? 'sel' : undefined}
              style={{ ['--mod' as string]: META[modulo.id]?.color } as CSSProperties}
              onMouseDown={(e) => {
                e.preventDefault();
                ir(ejercicio.id);
              }}
            >
              <span className="dot" />
              <span>
                <b>{ejercicio.titulo}</b>
                <small>
                  {META[modulo.id]?.corto ?? modulo.titulo} · ejercicio {ejercicio.numero}
                </small>
              </span>
            </a>
          ))}
        </motion.div>
      )}
    </div>
  );
}

export function Topbar({ onMenu }: { onMenu: () => void }) {
  const loc = useLocation();
  const p = useProgreso();
  const pct = avanceGlobal(p);
  const migas = migasDe(loc.pathname);
  return (
    <header className="tb">
      <button type="button" className="tb-menu" onClick={onMenu} aria-label="Abrir menú" aria-controls="barra-lateral">
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
      </nav>
      <div className="tb-right">
        <Buscador />
        <Link to="/logros" className="tb-progress" aria-label={`Progreso del curso: ${Math.round(pct * 100)} %`}>
          <Anillo valor={pct} size={34} grosor={4} />
          {Math.round(pct * 100)} %
        </Link>
      </div>
      <div className="meter top-meter" aria-hidden="true">
        <motion.i initial={false} animate={{ width: `${pct * 100}%` }} transition={{ type: 'spring', stiffness: 60, damping: 18 }} />
      </div>
    </header>
  );
}
