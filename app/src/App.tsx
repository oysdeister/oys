import { useEffect, useRef, useState } from 'react';
import { HashRouter, Link, NavLink, Route, Routes, useLocation } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { Icon, Medal } from './components/Icon';
import { Onboarding } from './components/Onboarding';
import { useProgreso } from './lib/progress';
import { INSIGNIAS, insigniasGanadas } from './lib/badges';
import { avanceGlobal } from './lib/avance';
import Home from './pages/Home';
import ModulePage from './pages/ModulePage';
import ExercisePage from './pages/ExercisePage';
import Taller from './pages/Taller';
import Logros from './pages/Logros';
import Examen from './pages/Examen';
import Certificado from './pages/Certificado';
import Examinador from './pages/Examinador';

function useTema() {
  const [oscuro, setOscuro] = useState(() => document.documentElement.dataset.theme === 'dark');
  useEffect(() => {
    document.documentElement.dataset.theme = oscuro ? 'dark' : 'light';
    try {
      localStorage.setItem('oys-tema', oscuro ? 'oscuro' : 'claro');
    } catch {
      /* sin almacenamiento */
    }
  }, [oscuro]);
  return [oscuro, () => setOscuro((o) => !o)] as const;
}

const NAV = [
  { to: '/', label: 'Inicio', icon: 'inicio' },
  { to: '/taller', label: 'Taller', icon: 'taller' },
  { to: '/examen', label: 'Examen', icon: 'examen' },
  { to: '/logros', label: 'Logros', icon: 'logros' },
];

function Cabecera() {
  const [oscuro, toggle] = useTema();
  const p = useProgreso();
  const pct = avanceGlobal(p);
  return (
    <header className="top">
      <div className="wrap top-in">
        <Link to="/" className="brand" aria-label="Inicio">
          <img src={`${import.meta.env.BASE_URL}brand/${oscuro ? 'oys_logo_light' : 'oys_logo'}.png`} alt="O&S Consultores" />
          <span className="brand-name">
            Taller Axional
            <small>Práctica guiada del ERP</small>
          </span>
        </Link>
        <nav className="nav" aria-label="Principal">
          {NAV.map((n) => (
            <NavLink key={n.to} to={n.to} end={n.to === '/'}>
              {n.label}
            </NavLink>
          ))}
        </nav>
        <button className="icon-btn" onClick={toggle} aria-label={oscuro ? 'Modo claro' : 'Modo oscuro'} style={{ marginLeft: 'auto' }}>
          <Icon name={oscuro ? 'sol' : 'luna'} size={18} />
        </button>
      </div>
      <div className="meter top-meter" aria-hidden="true">
        <motion.i initial={false} animate={{ width: `${pct * 100}%` }} transition={{ type: 'spring', stiffness: 60, damping: 18 }} />
      </div>
    </header>
  );
}

function NavMovil() {
  return (
    <nav className="bottom-nav" aria-label="Principal">
      {[...NAV.slice(0, 2), { to: '/modulos', label: 'Módulos', icon: 'maestros' }, ...NAV.slice(2)].map((n) => (
        <NavLink key={n.to} to={n.to === '/modulos' ? '/#modulos' : n.to} end={n.to === '/'}>
          <Icon name={n.icon} />
          {n.label}
        </NavLink>
      ))}
    </nav>
  );
}

/** Avisa con una medalla cuando se gana una insignia nueva */
function AvisoInsignias() {
  const p = useProgreso();
  const ganadas = insigniasGanadas(p);
  const previas = useRef<string[] | null>(null);
  const [nueva, setNueva] = useState<string | null>(null);
  useEffect(() => {
    if (previas.current) {
      const n = ganadas.find((g) => !previas.current!.includes(g));
      if (n) {
        setNueva(n);
        const t = setTimeout(() => setNueva(null), 3800);
        previas.current = ganadas;
        return () => clearTimeout(t);
      }
    }
    previas.current = ganadas;
  }, [ganadas.join()]); // eslint-disable-line react-hooks/exhaustive-deps
  const b = INSIGNIAS.find((i) => i.id === nueva);
  return (
    <AnimatePresence>
      {b && (
        <motion.div className="toast" role="status" initial={{ y: 60, opacity: 0, x: '-50%' }} animate={{ y: 0, opacity: 1, x: '-50%' }} exit={{ y: 60, opacity: 0, x: '-50%' }}>
          <motion.div initial={{ rotateY: 180 }} animate={{ rotateY: 0 }} transition={{ duration: 0.8 }}>
            <Medal color={b.color} />
          </motion.div>
          Insignia nueva: {b.titulo}
        </motion.div>
      )}
    </AnimatePresence>
  );
}

function Rutas() {
  const loc = useLocation();
  useEffect(() => {
    if (loc.hash) return;
    window.scrollTo({ top: 0 });
  }, [loc.pathname, loc.hash]);
  return (
    <AnimatePresence mode="wait">
      <motion.main key={loc.pathname} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} transition={{ duration: 0.28, ease: [0.2, 0.7, 0.2, 1] }}>
        <Routes location={loc}>
          <Route path="/" element={<Home />} />
          <Route path="/modulo/:id" element={<ModulePage />} />
          <Route path="/ejercicio/:id" element={<ExercisePage />} />
          <Route path="/taller" element={<Taller />} />
          <Route path="/taller/:sim" element={<Taller />} />
          <Route path="/logros" element={<Logros />} />
          <Route path="/examen" element={<Examen />} />
          <Route path="/certificado" element={<Certificado />} />
          <Route path="/examinador" element={<Examinador />} />
          <Route path="*" element={<Home />} />
        </Routes>
      </motion.main>
    </AnimatePresence>
  );
}

export default function App() {
  const p = useProgreso();
  return (
    <HashRouter>
      <Cabecera />
      {!p.alumno.ini && <Onboarding />}
      <Rutas />
      <NavMovil />
      <AvisoInsignias />
      <footer className="footer">
        <div className="wrap">O&S Consultores · Ejercicios sobre Deister Axional (demo nextdemo.geasa.eu, base TUTORIAL). Tu progreso se guarda en este navegador.</div>
      </footer>
    </HashRouter>
  );
}
