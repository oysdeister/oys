import { useState } from 'react';
import { motion } from 'framer-motion';
import { acciones } from '../lib/progress';

/** Primera visita: nombre e iniciales. Las iniciales sustituyen a «CL» en todos los códigos de los ejercicios. */
export function Onboarding() {
  const [nombre, setNombre] = useState('');
  const [ini, setIni] = useState('');
  const sugeridas = nombre
    .trim()
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((w) => w[0]?.toUpperCase() ?? '')
    .join('');
  const valor = ini || sugeridas;
  const ok = nombre.trim().length > 1 && valor.length >= 2;
  return (
    <div style={{ position: 'fixed', inset: 0, zIndex: 100, display: 'grid', placeItems: 'center', padding: 16, background: 'color-mix(in srgb, var(--ink) 55%, transparent)', backdropFilter: 'blur(6px)' }}>
      <motion.form
        className="sheet pad"
        style={{ width: 'min(520px, 100%)' }}
        initial={{ opacity: 0, y: 30, rotateX: -12 }}
        animate={{ opacity: 1, y: 0, rotateX: 0 }}
        transition={{ type: 'spring', stiffness: 120, damping: 16 }}
        onSubmit={(e) => {
          e.preventDefault();
          if (ok) acciones.setAlumno(nombre, valor);
        }}
      >
        <h2>Antes de empezar</h2>
        <p className="muted" style={{ marginTop: 10 }}>
          En la demo cada persona crea sus propios datos. Los códigos llevan tus iniciales para que no choquen con los de tus compañeros: si eres Laura Martín, tu proveedor será <code className="k">TLM</code> y tu tarifa <code className="k">TFLM</code>.
        </p>
        <label className="small" style={{ fontWeight: 650, display: 'block', marginTop: 18 }}>
          Nombre y apellidos
          <input className="field-input" autoFocus value={nombre} onChange={(e) => setNombre(e.target.value)} autoComplete="name" />
        </label>
        <label className="small" style={{ fontWeight: 650, display: 'block', marginTop: 14 }}>
          Iniciales (2 a 4 letras)
          <input
            className="field-input"
            value={valor}
            maxLength={4}
            onChange={(e) => setIni(e.target.value.toUpperCase().replace(/[^A-ZÑ0-9]/g, ''))}
            style={{ fontFamily: 'var(--display)', fontWeight: 800, fontSize: '1.6rem', letterSpacing: '0.08em' }}
          />
        </label>
        <button className="btn arc" type="submit" disabled={!ok} style={{ marginTop: 22, width: '100%' }}>
          Empezar a practicar
        </button>
      </motion.form>
    </div>
  );
}
