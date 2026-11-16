import { useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import { META, MODULOS } from '../content';
import { acciones, ejercicioCompletado, useProgreso } from '../lib/progress';
import { avanceGlobal, avanceModulo } from '../lib/avance';
import { INSIGNIAS } from '../lib/badges';
import { Icon, Medal } from '../components/Icon';
import { Anillo } from '../components/exercise/Anillo';
import './aprender.css';

function limpiaIni(v: string) {
  return v.toUpperCase().replace(/[^A-ZÑ0-9]/g, '').slice(0, 4);
}

function DatosAlumno() {
  const p = useProgreso();
  const [nombre, setNombre] = useState(p.alumno.nombre);
  const [ini, setIni] = useState(p.alumno.ini);
  const [guardado, setGuardado] = useState(false);
  const cambiado = nombre.trim() !== p.alumno.nombre || ini !== p.alumno.ini;
  const ok = nombre.trim().length > 1 && ini.length >= 2;
  return (
    <form
      className="sheet pad lg-form"
      onSubmit={(e) => {
        e.preventDefault();
        if (!ok) return;
        acciones.setAlumno(nombre, ini);
        setGuardado(true);
        setTimeout(() => setGuardado(false), 2200);
      }}
    >
      <h2>Tus datos</h2>
      <p className="small muted">Tus iniciales aparecen en todos los códigos de los ejercicios. Si las cambias, usa las nuevas también en la demo.</p>
      <label className="lg-label">
        Nombre y apellidos
        <input className="field-input" value={nombre} onChange={(e) => setNombre(e.target.value)} autoComplete="name" />
      </label>
      <label className="lg-label">
        Iniciales (2 a 4 letras)
        <input className="field-input lg-ini" value={ini} maxLength={4} onChange={(e) => setIni(limpiaIni(e.target.value))} />
      </label>
      <div className="row-btns">
        <button className="btn" type="submit" disabled={!ok || !cambiado}>
          Guardar cambios
        </button>
        <AnimatePresence>
          {guardado && (
            <motion.span className="mem-ok" role="status" initial={{ opacity: 0, x: -6 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0 }}>
              Guardado
            </motion.span>
          )}
        </AnimatePresence>
      </div>
    </form>
  );
}

function Copia() {
  const p = useProgreso();
  const [texto, setTexto] = useState('');
  const [msg, setMsg] = useState<{ ok: boolean; t: string } | null>(null);
  const fichero = useRef<HTMLInputElement>(null);

  const descargar = () => {
    const blob = new Blob([acciones.exportar()], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `progreso-axional-${p.alumno.ini || 'alumno'}.json`;
    document.body.appendChild(a);
    a.click();
    a.remove();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
  };

  const copiar = async () => {
    try {
      await navigator.clipboard.writeText(acciones.exportar());
      setMsg({ ok: true, t: 'Copiado. Pégalo en otro navegador para seguir allí.' });
    } catch {
      setMsg({ ok: false, t: 'No he podido copiar. Usa «Descargar» en su lugar.' });
    }
  };

  const importar = (t: string) => {
    const ok = acciones.importar(t.trim());
    setMsg(ok ? { ok: true, t: 'Progreso recuperado.' } : { ok: false, t: 'Ese texto no es un progreso válido. Comprueba que lo has copiado entero.' });
    if (ok) setTexto('');
  };

  return (
    <div className="sheet pad lg-copia">
      <h2>Llévate tu progreso</h2>
      <p className="small muted">Se guarda solo en este navegador. Para seguir en otro ordenador o en el móvil, descárgalo aquí y cárgalo allí.</p>
      <div className="row-btns">
        <button className="btn" onClick={descargar}>
          Descargar
        </button>
        <button className="btn ghost" onClick={() => void copiar()}>
          Copiar
        </button>
        <button className="btn ghost" onClick={() => fichero.current?.click()}>
          Cargar un fichero
        </button>
        <input
          ref={fichero}
          type="file"
          accept="application/json,.json"
          hidden
          onChange={(e) => {
            const f = e.target.files?.[0];
            if (!f) return;
            void f.text().then(importar);
            e.target.value = '';
          }}
        />
      </div>
      <label className="lg-label">
        O pega aquí el texto copiado
        <textarea className="field-input lg-area" rows={4} value={texto} onChange={(e) => setTexto(e.target.value)} spellCheck={false} />
      </label>
      <button className="btn ghost sm" onClick={() => importar(texto)} disabled={!texto.trim()}>
        Recuperar progreso
      </button>
      <AnimatePresence>
        {msg && (
          <motion.p key={msg.t} role="status" className={`small lg-msg${msg.ok ? ' ok' : ' bad'}`} initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
            {msg.t}
          </motion.p>
        )}
      </AnimatePresence>
    </div>
  );
}

function Reiniciar() {
  const [confirmar, setConfirmar] = useState(false);
  const [hecho, setHecho] = useState(false);
  return (
    <div className="sheet pad lg-reset">
      <h2>Empezar de cero</h2>
      <p className="small muted">Borra todo tu avance en este navegador. Tus datos (nombre e iniciales) se quedan.</p>
      <AnimatePresence mode="wait" initial={false}>
        {!confirmar ? (
          <motion.div key="a" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <button className="btn ghost" onClick={() => { setConfirmar(true); setHecho(false); }}>
              Reiniciar mi progreso
            </button>
            {hecho && <p className="small mem-ok" role="status">Progreso reiniciado.</p>}
          </motion.div>
        ) : (
          <motion.div key="b" className="callout problema" initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} role="alertdialog" aria-label="Confirmar reinicio">
            <b>¿Seguro?</b>
            Se borran pasos, notas, checklists y simuladores. No se puede deshacer: si quieres guardar una copia, descárgala antes.
            <div className="row-btns" style={{ marginTop: 12 }}>
              <button
                className="btn lg-danger"
                onClick={() => {
                  acciones.reiniciar();
                  setConfirmar(false);
                  setHecho(true);
                }}
              >
                Sí, borrar mi progreso
              </button>
              <button className="btn ghost" onClick={() => setConfirmar(false)} autoFocus>
                Cancelar
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default function Logros() {
  const p = useProgreso();
  const reducir = useReducedMotion();
  const global = avanceGlobal(p);
  const ganadas = INSIGNIAS.filter((b) => b.ganada(p)).length;

  return (
    <div className="wrap lg">
      <header className="lg-hero">
        <Anillo valor={global} size={150} color="var(--arc-deep)" etiqueta="total" />
        <div>
          <h1 className="lg-h1">Tus logros</h1>
          <p className="lead muted">
            {ganadas} de {INSIGNIAS.length} insignias. {global >= 1 ? 'Lo tienes todo: a por el examen.' : 'Cada ejercicio que completas suma.'}
          </p>
          {p.alumno.nombre && (
            <p className="small muted">
              {p.alumno.nombre} · <code className="k">{p.alumno.ini}</code>
            </p>
          )}
        </div>
      </header>

      <section className="lg-sec" aria-labelledby="ins-h">
        <h2 id="ins-h">Insignias</h2>
        <div className="badges">
          {INSIGNIAS.map((b, i) => {
            const on = b.ganada(p);
            return (
              <motion.div
                key={b.id}
                className={`badge${on ? '' : ' off'}`}
                initial={reducir ? false : { opacity: 0, rotateY: -90 }}
                animate={{ opacity: on ? 1 : 0.5, rotateY: 0 }}
                transition={{ delay: i * 0.05, type: 'spring', stiffness: 110, damping: 14 }}
                style={{ transformPerspective: 800 }}
              >
                <Medal color={b.color} on={on} label={on ? `Insignia ganada: ${b.titulo}` : `Insignia pendiente: ${b.titulo}`} />
                <b>{b.titulo}</b>
                <span className="small muted">{b.texto}</span>
              </motion.div>
            );
          })}
        </div>
      </section>

      <section className="lg-sec" aria-labelledby="av-h">
        <h2 id="av-h">Avance por módulo</h2>
        <ul className="lg-mods">
          {MODULOS.map((m, i) => {
            const meta = META[m.id] ?? { color: 'var(--arc)', icono: 'maestros', corto: m.titulo };
            const av = avanceModulo(p, m.id);
            const hechos = m.ejercicios.filter((e) => ejercicioCompletado(p.ejercicios[e.id])).length;
            return (
              <li key={m.id}>
                <Link to={`/modulo/${m.id}`} className="lg-mod">
                  <span className="lg-mod-ico" style={{ color: meta.color }}>
                    <Icon name={meta.icono} />
                  </span>
                  <span className="lg-mod-name">
                    <strong>{m.titulo}</strong>
                    <span className="small muted">
                      {hechos} de {m.ejercicios.length} ejercicios completados
                    </span>
                  </span>
                  <span className="meter lg-mod-meter" aria-hidden="true">
                    <motion.i initial={{ width: 0 }} animate={{ width: `${av * 100}%` }} transition={{ delay: 0.2 + i * 0.07, duration: 0.9 }} style={{ background: meta.color }} />
                  </span>
                  <span className="lg-mod-pct">{Math.round(av * 100)} %</span>
                </Link>
              </li>
            );
          })}
        </ul>
      </section>

      <section className="lg-grid">
        <DatosAlumno />
        <Copia />
        <Reiniciar />
      </section>
    </div>
  );
}
