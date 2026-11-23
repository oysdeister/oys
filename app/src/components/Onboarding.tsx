import { useState } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { acciones, getProgreso, limpiaUsuario } from '../lib/progress';
import { olvidaBienvenida } from '../lib/saludo';
import { Espacio } from './shell/Espacio';

const EASE = [0.2, 0.7, 0.2, 1] as const;

/** Iniciales a partir del nombre («Laura Martín» → «LM»); si solo hay una palabra, sus dos primeras letras. */
function inicialesDe(nombre: string) {
  const limpio = (w: string) => w.normalize('NFD').replace(/[̀-ͯ]/g, '').toUpperCase().replace(/[^A-ZÑ0-9]/g, '');
  const palabras = nombre.trim().split(/\s+/).map(limpio).filter(Boolean);
  const ini = palabras.slice(0, 3).map((w) => w[0]).join('');
  return (ini.length >= 2 ? ini : (palabras[0] ?? '').slice(0, 2)).slice(0, 4);
}

/** Usuario a partir del nombre («Laura Martín» → «lmartin»). */
function usuarioDe(nombre: string, ini: string) {
  const partes = limpiaUsuario(nombre).split('.').filter(Boolean);
  const u = partes.length > 1 ? `${partes[0][0]}${partes[1]}` : (partes[0] ?? '');
  return u.length >= 3 ? u : `${u}${ini.toLowerCase()}`.padEnd(3, 'x');
}

/**
 * Primer acceso: solo «¿Cómo te llamas?».
 * Las iniciales (sustituyen a {INI} en los códigos de los bloques) y el usuario del examen salen del nombre.
 */
export function Onboarding() {
  const reduce = useReducedMotion();
  const previo = getProgreso().alumno;
  const [nombre, setNombre] = useState(previo.nombre);
  const ok = nombre.trim().length > 1 && inicialesDe(nombre).length >= 2;
  const base = import.meta.env.BASE_URL;
  const d = (t: number) => (reduce ? { duration: 0 } : { delay: t, duration: 0.7, ease: EASE });

  return (
    <motion.div className="onb onb2" role="dialog" aria-modal="true" aria-labelledby="onb-titulo" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0, transition: { duration: 0.5 } }}>
      <Espacio />
      <div className="onb-grain" aria-hidden="true" />
      <div className="onb2-in">
        <header className="onb2-top">
          <motion.img className="onb2-logo" src={`${base}brand/oys_logo_light.png`} alt="O&S Consultores" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={d(0.1)} />
        </header>
        <div className="onb2-escena">
          <form
            className="onb2-paso"
            onSubmit={(e) => {
              e.preventDefault();
              if (!ok) return;
              const ini = previo.ini || inicialesDe(nombre);
              olvidaBienvenida(); // que la bienvenida salga justo después
              acciones.setAlumno(nombre, ini, usuarioDe(nombre, ini));
            }}
          >
            <motion.p className="acc-eyebrow" initial={{ opacity: 0, x: reduce ? 0 : -16 }} animate={{ opacity: 1, x: 0 }} transition={d(0.2)}>
              <span className="acc-punto" aria-hidden="true" /> Formación Axional Deister VNext
            </motion.p>
            <h1 id="onb-titulo" className="onb2-pregunta">
              {['¿Cómo te', 'llamas?'].map((t, i) => (
                <span key={t} className="acc-linea">
                  <motion.span
                    className={i === 1 ? 'acc-brillo' : undefined}
                    initial={{ y: reduce ? 0 : '105%', opacity: reduce ? 0 : 1 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={reduce ? { duration: 0.3 } : { delay: 0.3 + i * 0.14, duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
                  >
                    {t}
                  </motion.span>
                </span>
              ))}
            </h1>
            <motion.div
              className="onb2-card"
              initial={reduce ? { opacity: 0 } : { opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={reduce ? { duration: 0.2 } : { type: 'spring', stiffness: 90, damping: 18, delay: 0.7 }}
            >
              <label className="onb2-campo" htmlFor="onb-nombre">
                Tu nombre y apellidos
              </label>
              <input id="onb-nombre" className="onb2-input" autoFocus value={nombre} onChange={(e) => setNombre(e.target.value)} autoComplete="name" placeholder="Nombre Apellido" />
              <p className="onb2-nota">Con él te saludamos y sacamos tus iniciales para los códigos de la demo.</p>
              <button className="btn arc lg onb-go" type="submit" disabled={!ok}>
                Empezar
              </button>
            </motion.div>
          </form>
        </div>
      </div>
    </motion.div>
  );
}
