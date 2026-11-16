import { useState } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { acciones } from '../lib/progress';
import { Espacio } from './shell/Espacio';

const EASE = [0.2, 0.7, 0.2, 1] as const;

/** Primera visita: bienvenida a pantalla completa. Pide nombre e iniciales; las iniciales sustituyen a {INI} en los códigos de los ejercicios. */
export function Onboarding() {
  const reduce = useReducedMotion();
  const [nombre, setNombre] = useState('');
  // Lo que teclea el alumno. Vacío = usar la sugerencia (que se ve como placeholder, nunca se concatena).
  const [ini, setIni] = useState('');
  const sugeridas = nombre
    .trim()
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 3)
    .map((w) => w[0]?.toUpperCase() ?? '')
    .join('')
    .replace(/[^A-ZÑ0-9]/g, '')
    .slice(0, 4);
  const valor = ini || sugeridas;
  const ok = nombre.trim().length > 1 && valor.length >= 2;
  const muestra = valor || 'LM';
  const base = import.meta.env.BASE_URL;

  const d = (t: number) => (reduce ? { duration: 0 } : { delay: t, duration: 0.8, ease: EASE });

  return (
    <motion.div className="onb" role="dialog" aria-modal="true" aria-labelledby="onb-titulo" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0, transition: { duration: 0.5 } }}>
      <Espacio />
      <svg className="onb-arc" viewBox="0 0 1200 900" preserveAspectRatio="xMidYMid slice" aria-hidden="true">
        <defs>
          <linearGradient id="onb-g" x1="0" y1="1" x2="1" y2="0">
            <stop offset="0" stopColor="#2a9c83" />
            <stop offset="0.6" stopColor="#4fbfa5" />
            <stop offset="1" stopColor="#b6f2e3" />
          </linearGradient>
          <filter id="onb-blur" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="18" />
          </filter>
        </defs>
        <motion.path d="M600 980 C 600 560, 880 210, 1260 130" fill="none" stroke="#4fbfa5" strokeWidth="60" strokeLinecap="round" filter="url(#onb-blur)" opacity="0.5" initial={{ pathLength: reduce ? 1 : 0 }} animate={{ pathLength: 1 }} transition={reduce ? { duration: 0 } : { duration: 1.8, ease: EASE, delay: 0.15 }} />
        <motion.path d="M600 980 C 600 560, 880 210, 1260 130" fill="none" stroke="url(#onb-g)" strokeWidth="26" strokeLinecap="round" initial={{ pathLength: reduce ? 1 : 0 }} animate={{ pathLength: 1 }} transition={reduce ? { duration: 0 } : { duration: 1.8, ease: EASE, delay: 0.15 }} />
        <motion.path d="M760 980 C 770 690, 960 420, 1260 380" fill="none" stroke="#4fbfa5" strokeOpacity="0.18" strokeWidth="2" strokeDasharray="4 12" initial={{ pathLength: reduce ? 1 : 0 }} animate={{ pathLength: 1 }} transition={reduce ? { duration: 0 } : { duration: 2.4, ease: EASE, delay: 0.5 }} />
      </svg>
      <div className="onb-grain" aria-hidden="true" />

      <div className="onb-in">
        <div className="onb-copy">
          <motion.img className="onb-logo" src={`${base}brand/oys_logo_light.png`} alt="O&S Consultores" initial={{ opacity: 0, y: reduce ? 0 : 14 }} animate={{ opacity: 1, y: 0 }} transition={d(0.6)} />
          <motion.h1 id="onb-titulo" initial={{ opacity: 0, y: reduce ? 0 : 30 }} animate={{ opacity: 1, y: 0 }} transition={d(0.85)}>
            Aprende Axional con las manos en el ERP.
          </motion.h1>
          <motion.p className="onb-lead" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={d(1.15)}>
            Seis módulos, del maestro de artículos al asiento contable. Practicas aquí con capturas reales y luego lo haces de memoria en la demo.
          </motion.p>
          <motion.ul className="onb-facts" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={d(1.35)}>
            <li>
              <b>6</b> módulos
            </li>
            <li>
              <b>6</b> simuladores
            </li>
            <li>
              <b>1</b> examen con certificado
            </li>
          </motion.ul>
        </div>

        <motion.form
          className="onb-card"
          initial={reduce ? { opacity: 0 } : { opacity: 0, y: 40, rotateX: -14, rotateY: 8, transformPerspective: 1200 }}
          animate={reduce ? { opacity: 1 } : { opacity: 1, y: 0, rotateX: 0, rotateY: 0 }}
          transition={reduce ? { duration: 0.2 } : { type: 'spring', stiffness: 80, damping: 16, delay: 1.0 }}
          onSubmit={(e) => {
            e.preventDefault();
            if (ok) acciones.setAlumno(nombre, valor);
          }}
        >
          <div className="onb-avatar" aria-hidden="true">
            <motion.span key={muestra} initial={{ scale: reduce ? 1 : 0.7, opacity: 0.4 }} animate={{ scale: 1, opacity: 1 }} transition={{ type: 'spring', stiffness: 400, damping: 18 }}>
              {muestra}
            </motion.span>
          </div>
          <h2>Antes de empezar</h2>
          <p className="onb-help">En la demo cada persona crea sus propios datos. Tus códigos llevarán tus iniciales para no chocar con los de tus compañeros.</p>

          <label className="onb-field">
            <span>Nombre y apellidos</span>
            <input autoFocus value={nombre} onChange={(e) => setNombre(e.target.value)} autoComplete="name" placeholder="Laura Martín" />
          </label>
          <label className="onb-field">
            <span>Iniciales (2 a 4 letras)</span>
            <input
              className="onb-ini"
              value={ini}
              placeholder={sugeridas || 'LM'}
              maxLength={4}
              autoCapitalize="characters"
              onChange={(e) => setIni(e.target.value.toUpperCase().replace(/[^A-ZÑ0-9]/g, '').slice(0, 4))}
            />
            {!ini && sugeridas && <small>Usaremos «{sugeridas}». Escribe otras si lo prefieres.</small>}
          </label>

          <div className="onb-codes" aria-live="polite">
            <span>
              Proveedor <code>T{muestra}</code>
            </span>
            <span>
              Tarifa <code>TF{muestra}</code>
            </span>
            <span>
              Examen <code>EX-{muestra}</code>
            </span>
          </div>

          <button className="btn arc lg onb-go" type="submit" disabled={!ok}>
            Empezar a practicar
          </button>
        </motion.form>
      </div>
    </motion.div>
  );
}
