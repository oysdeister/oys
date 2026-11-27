import { useEffect, useRef, useState } from 'react';
import { HashRouter, Route, Routes, useLocation } from 'react-router-dom';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import { Medal } from './components/Icon';
import { Sidebar } from './components/shell/Sidebar';
import { Topbar } from './components/shell/Topbar';
import { BottomNav } from './components/shell/BottomNav';
import { Onboarding } from './components/Onboarding';
import { Bienvenida } from './components/Bienvenida';
import { useProgreso } from './lib/progress';
import { CLERK_ACTIVO } from './auth/Acceso';
import { INSIGNIAS, insigniasGanadas } from './lib/badges';
import { fijarModoLibre } from './lib/ruta';
import Home from './pages/Home';
import ModulePage from './pages/ModulePage';
import ExercisePage from './pages/ExercisePage';
import Taller from './pages/Taller';
import Logros from './pages/Logros';
import Examen from './pages/Examen';
import ExamenModulo from './pages/ExamenModulo';
import Certificado from './pages/Certificado';
import Examinador from './pages/Examinador';
import Video from './pages/Video';
import ErpPractica from './pages/ErpPractica';
import Glosario from './pages/Glosario';
import { avisoIniciales, cerrarAvisoIniciales } from './lib/iniciales';
import Errores from './pages/Errores';
import Formacion from './pages/previa/Formacion';
import GuiaPrevia from './pages/previa/GuiaPrevia';
import ExamenPrevio from './pages/previa/ExamenPrevio';

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

function usePlegada() {
  const [plegada, setPlegada] = useState(() => {
    try {
      return localStorage.getItem('oys-barra') === 'plegada';
    } catch {
      return false;
    }
  });
  useEffect(() => {
    try {
      localStorage.setItem('oys-barra', plegada ? 'plegada' : 'abierta');
    } catch {
      /* sin almacenamiento */
    }
  }, [plegada]);
  return [plegada, () => setPlegada((v) => !v)] as const;
}

/** Avisa con una medalla cuando se gana una insignia nueva */
/** Aviso de una vez: las iniciales guardadas con 3 letras pasan a 2 (los códigos de la demo cambian). */
function AvisoIniciales() {
  const p = useProgreso();
  const [cerrado, setCerrado] = useState(false);
  // Se lee al pintar: la migración puede ocurrir al fusionar con la cuenta, y entonces cambian las iniciales y se repinta
  const aviso = cerrado ? null : avisoIniciales();
  if (!aviso || !p.alumno.ini) return null;
  const xx = p.alumno.ini;
  return (
    <div className="toast toast-ini" role="status">
      <span>
        Tus iniciales ahora son <b>{xx}</b> (antes {aviso.antes}): en la demo usa códigos como <code>T{xx}</code> o <code>PROV-{xx}-001</code>. Con 3 letras algunos códigos no caben.
      </span>
      <button
        type="button"
        className="btn sm"
        onClick={() => {
          cerrarAvisoIniciales();
          setCerrado(true);
        }}
      >
        Entendido
      </button>
    </div>
  );
}

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
  const reduce = useReducedMotion();
  useEffect(() => {
    if (loc.hash) return;
    window.scrollTo({ top: 0 });
  }, [loc.pathname, loc.hash]);
  // ?libre=1 abre todos los bloques (para revisar el curso sin hacerlo entero); ?libre=0 lo quita
  useEffect(() => {
    const libre = new URLSearchParams(loc.search).get('libre');
    if (libre !== null) fijarModoLibre(libre === '1');
  }, [loc.search]);
  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={loc.pathname}
        className="page-host"
        /* Cambio de página: un fundido corto, sin movimiento */
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: reduce ? 0 : 0.12 }}
      >
        <Routes location={loc}>
          <Route path="/" element={<Home />} />
          <Route path="/formacion" element={<Formacion />} />
          <Route path="/formacion/:guia" element={<GuiaPrevia />} />
          <Route path="/formacion/:guia/examen" element={<ExamenPrevio />} />
          <Route path="/modulo/:id" element={<ModulePage />} />
          <Route path="/modulo/:id/examen" element={<ExamenModulo />} />
          <Route path="/ejercicio/:id" element={<ExercisePage />} />
          <Route path="/erp" element={<ErpPractica />} />
          <Route path="/taller" element={<Taller />} />
          <Route path="/taller/:sim" element={<Taller />} />
          <Route path="/video" element={<Video />} />
          <Route path="/video/:cap" element={<Video />} />
          <Route path="/glosario" element={<Glosario />} />
          <Route path="/errores" element={<Errores />} />
          <Route path="/logros" element={<Logros />} />
          <Route path="/examen" element={<Examen />} />
          <Route path="/certificado" element={<Certificado />} />
          <Route path="/examinador" element={<Examinador />} />
          <Route path="*" element={<Home />} />
        </Routes>
      </motion.div>
    </AnimatePresence>
  );
}

function Marco() {
  const p = useProgreso();
  const [oscuro, toggleTema] = useTema();
  const [plegada, togglePlegada] = usePlegada();
  const [cajon, setCajon] = useState(false);
  const loc = useLocation();
  useEffect(() => setCajon(false), [loc.pathname]);
  useEffect(() => {
    if (!cajon) return;
    const k = (e: KeyboardEvent) => e.key === 'Escape' && setCajon(false);
    window.addEventListener('keydown', k);
    return () => window.removeEventListener('keydown', k);
  }, [cajon]);
  return (
    <div className={`app-shell${plegada ? ' collapsed' : ''}${cajon ? ' drawer' : ''}`}>
      <Sidebar oscuro={oscuro} onTema={toggleTema} plegada={plegada} onPlegar={togglePlegada} onNavegar={() => setCajon(false)} />
      <div className="sb-scrim gsb-velo" onClick={() => setCajon(false)} aria-hidden="true" />
      <div className="app-main">
        <Topbar onMenu={() => setCajon(true)} abierto={cajon} />
        <main>
          <Rutas />
        </main>
        <footer className="footer">
          <div className="wrap">
            <img src={`${import.meta.env.BASE_URL}brand/oys_logo.png`} alt="O&S Consultores" className="logo-claro" />
            <img src={`${import.meta.env.BASE_URL}brand/oys_logo_light.png`} alt="O&S Consultores" className="logo-oscuro" />
            <span>Formación sobre Axional Deister VNext. Demo real: nextdemo.geasa.eu, base TUTORIAL. {CLERK_ACTIVO ? 'Tu progreso se guarda en tu cuenta.' : 'Tu progreso se guarda en este navegador.'}</span>
          </div>
        </footer>
      </div>
      <BottomNav />
      <AvisoInsignias />
      <AvisoIniciales />
      <AnimatePresence>{(!p.alumno.ini || !p.alumno.usuario) && <Onboarding key="onb" />}</AnimatePresence>
      <Bienvenida />
    </div>
  );
}

export default function App() {
  return (
    <HashRouter>
      <Marco />
    </HashRouter>
  );
}
