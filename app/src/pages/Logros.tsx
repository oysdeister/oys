import { useEffect, useRef, useState, type CSSProperties, type PointerEvent } from 'react';
import { AnimatePresence, motion, useMotionValue, useReducedMotion, useSpring } from 'framer-motion';
import confetti from 'canvas-confetti';
import { META, MODULOS } from '../content';
import { acciones, APROBADO, ejercicioCompletado, useProgreso, type Progreso, limpiaUsuario } from '../lib/progress';
import { avanceGlobal, avanceModulo } from '../lib/avance';
import { INSIGNIAS, type Insignia } from '../lib/badges';
import { clavesActivas } from '../lib/examenModulo';
import { Icon } from '../components/Icon';
import { NucleoOrbita } from '../components/shell/NucleoOrbita';
import { Planeta } from '../components/shell/Planeta';
import './aprender.css';
import './portada.css';


function limpiaIni(v: string) {
  return v.toUpperCase().replace(/[^A-ZÑ0-9]/g, '').slice(0, 4);
}

function DatosAlumno() {
  const p = useProgreso();
  const [nombre, setNombre] = useState(p.alumno.nombre);
  const [ini, setIni] = useState(p.alumno.ini);
  const [usuario, setUsuario] = useState(p.alumno.usuario);
  const [guardado, setGuardado] = useState(false);
  const cambiado = nombre.trim() !== p.alumno.nombre || ini !== p.alumno.ini || usuario !== p.alumno.usuario;
  const ok = nombre.trim().length > 1 && ini.length >= 2 && usuario.length >= 3;
  return (
    <form
      className="sheet pad lg-form"
      onSubmit={(e) => {
        e.preventDefault();
        if (!ok) return;
        acciones.setAlumno(nombre, ini, usuario);
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
      <label className="lg-label">
        Nombre de usuario
        <input className="field-input" value={usuario} maxLength={30} autoCapitalize="none" autoCorrect="off" spellCheck={false} onChange={(e) => setUsuario(limpiaUsuario(e.target.value))} />
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


/* ---------- Insignias: aspecto y cuánto falta para cada una ---------- */

/** Simuladores que pide la insignia «Taller completo» (lib/badges.ts) */
const SIMS_INSIGNIA = ['asiento', 'numerador', 'circuito', 'docflow', 'factura', 'cartera'];

interface Aspecto {
  color: string;
  icono: string;
  /** 0-1: cuánto llevas */
  valor: number;
  /** Texto corto del avance */
  cuenta: string;
}

function aspecto(b: Insignia, p: Progreso): Aspecto {
  const ejs = Object.values(p.ejercicios);
  if (b.id.startsWith('mod-')) {
    const id = b.id.slice(4);
    const m = MODULOS.find((x) => x.id === id);
    const hechos = m ? m.ejercicios.filter((e) => ejercicioCompletado(p.ejercicios[e.id])).length : 0;
    const total = m?.ejercicios.length ?? 1;
    return { color: META[id]?.color ?? b.color, icono: META[id]?.icono ?? 'check', valor: hechos / total, cuenta: `${hechos} de ${total} ejercicios` };
  }
  if (b.id.startsWith('exm-')) {
    const clave = b.id.slice(4);
    const mod = clavesActivas().find((c) => c.clave === clave)?.moduloId ?? clave;
    const nota = p.examenes?.[clave] ?? null;
    return { color: META[mod]?.color ?? b.color, icono: 'examen', valor: Math.min(1, (nota ?? 0) / APROBADO), cuenta: nota === null ? 'Sin hacer' : `Mejor nota: ${Math.round(nota * 100)} %` };
  }
  switch (b.id) {
    case 'primer-paso': {
      const v = ejs.some((e) => e.guiado) ? 1 : ejs.some((e) => e.pasos.length > 0) ? 0.5 : 0;
      return { color: b.color, icono: 'play', valor: v, cuenta: v >= 1 ? 'Hecho' : v > 0 ? 'Recorrido empezado' : 'Sin empezar' };
    }
    case 'sin-fallos': {
      const mejor = ejs.reduce((s, e) => Math.max(s, e.test ?? 0), 0);
      return { color: b.color, icono: 'cerebro', valor: mejor, cuenta: `Mejor test: ${Math.round(mejor * 100)} %` };
    }
    case 'manos': {
      let mejor = 0;
      MODULOS.forEach((m) => m.ejercicios.forEach((e) => {
        if (e.checklist.length) mejor = Math.max(mejor, Math.min(1, (p.ejercicios[e.id]?.demo.length ?? 0) / e.checklist.length));
      }));
      return { color: b.color, icono: 'check', valor: mejor, cuenta: `Mejor checklist: ${Math.round(mejor * 100)} %` };
    }
    case 'cuadrado':
      return { color: b.color, icono: 'asiento', valor: p.sims.asiento ? 1 : 0, cuenta: p.sims.asiento ? 'Hecho' : 'Simulador «Cuadra el asiento»' };
    case 'taller': {
      const n = SIMS_INSIGNIA.filter((s) => p.sims[s]).length;
      return { color: b.color, icono: 'taller', valor: n / SIMS_INSIGNIA.length, cuenta: `${n} de ${SIMS_INSIGNIA.length} simuladores` };
    }
    case 'listo': {
      const n = MODULOS.filter((m) => m.ejercicios.length > 0 && m.ejercicios.every((e) => ejercicioCompletado(p.ejercicios[e.id]))).length;
      return { color: 'var(--arc-deep)', icono: 'examen', valor: n / Math.max(1, MODULOS.length), cuenta: `${n} de ${MODULOS.length} módulos` };
    }
    default:
      return { color: b.color, icono: 'logros', valor: b.ganada(p) ? 1 : 0, cuenta: '' };
  }
}

/** Medalla propia: disco del color, arco O&S y el icono de la insignia; apagada muestra cuánto falta */
function Medalla({ a, on }: { a: Aspecto; on: boolean }) {
  return (
    <span className="pl-medal">
      <svg className="pl-m" viewBox="0 0 100 100" aria-hidden="true">
        {on ? (
          <>
            <circle cx="50" cy="50" r="46" fill={a.color} />
            <circle cx="50" cy="50" r="46" fill="url(#pl-luz)" />
            <circle cx="50" cy="50" r="37" fill="none" stroke="#fff" strokeOpacity="0.5" strokeWidth="2" strokeDasharray="3 4" />
            <path d="M20 70 C 14 38, 50 14, 86 30" fill="none" stroke="#fff" strokeOpacity="0.55" strokeWidth="5" strokeLinecap="round" />
          </>
        ) : (
          <>
            <circle cx="50" cy="50" r="44" fill="var(--paper)" stroke="var(--line)" strokeWidth="3" strokeDasharray="5 5" />
            <circle cx="50" cy="50" r="44" fill="none" stroke={a.color} strokeWidth="5" strokeLinecap="round" pathLength={1} strokeDasharray={`${Math.max(a.valor, 0)} 1`} transform="rotate(-90 50 50)" />
          </>
        )}
      </svg>
      {on && <span className="pl-shine" aria-hidden="true" />}
      <span className="pl-ico">
        <Icon name={a.icono} size={34} stroke={2.4} />
      </span>
    </span>
  );
}

function TarjetaInsignia({ b, a, on, nueva, i }: { b: Insignia; a: Aspecto; on: boolean; nueva: boolean; i: number }) {
  const reducir = useReducedMotion();
  const rx = useMotionValue(0);
  const ry = useMotionValue(0);
  const srx = useSpring(rx, { stiffness: 160, damping: 14 });
  const sry = useSpring(ry, { stiffness: 160, damping: 14 });
  const mover = (e: PointerEvent<HTMLDivElement>) => {
    if (reducir || !on || e.pointerType !== 'mouse') return;
    const r = e.currentTarget.getBoundingClientRect();
    rx.set(-((e.clientY - r.top) / r.height - 0.5) * 18);
    ry.set(((e.clientX - r.left) / r.width - 0.5) * 22);
  };
  return (
    <motion.div
      className={`glass pl-badge${on ? ' on neon-mod' : ''}`}
      style={{ ['--c' as string]: a.color, ['--mod' as string]: a.color, rotateX: srx, rotateY: sry, transformPerspective: 700 } as CSSProperties}
      initial={reducir ? false : nueva ? { opacity: 0, rotateY: 180, scale: 0.6 } : { opacity: 0, y: 18 }}
      animate={{ opacity: 1, y: 0, rotateY: 0, scale: 1 }}
      transition={nueva ? { delay: 0.5 + i * 0.12, type: 'spring', stiffness: 90, damping: 11 } : { delay: Math.min(i, 10) * 0.04, duration: 0.45 }}
      onPointerMove={mover}
      onPointerLeave={() => {
        rx.set(0);
        ry.set(0);
      }}
      role="listitem"
      aria-label={`${on ? 'Insignia ganada' : 'Insignia pendiente'}: ${b.titulo}. ${b.texto}${on ? '' : ` Llevas: ${a.cuenta}.`}`}
    >
      {nueva ? <span className="pl-new">¡Nueva!</span> : on ? <span className="pl-ok" aria-hidden="true"><Icon name="check" size={14} stroke={3.2} /></span> : null}
      <Medalla a={a} on={on} />
      <b>{b.titulo}</b>
      <span className="small muted">{b.texto}</span>
      {!on && (
        <span className="pl-prog" aria-hidden="true">
          <span className="ax-bar">
            <i style={{ width: `${a.valor * 100}%` }} />
          </span>
          <span>{a.cuenta}</span>
        </span>
      )}
    </motion.div>
  );
}

const CLAVE_VISTAS = 'oys-insignias-vistas';
function leerVistas(): string[] | null {
  try {
    const r = localStorage.getItem(CLAVE_VISTAS);
    const v: unknown = r ? JSON.parse(r) : null;
    return Array.isArray(v) ? v.filter((x): x is string => typeof x === 'string') : null;
  } catch {
    return null;
  }
}
function guardarVistas(ids: string[]) {
  try {
    localStorage.setItem(CLAVE_VISTAS, JSON.stringify(ids));
  } catch {
    /* sin almacenamiento: no pasa nada */
  }
}

export default function Logros() {
  const p = useProgreso();
  const reducir = useReducedMotion();
  const global = avanceGlobal(p);
  const lista = INSIGNIAS.map((b) => ({ b, on: b.ganada(p), a: aspecto(b, p) }));
  const ganadas = lista.filter((x) => x.on);
  const ids = ganadas.map((x) => x.b.id);
  // Insignias ganadas desde la última visita: se celebran una vez
  const [nuevas] = useState<string[]>(() => {
    const vistas = leerVistas();
    return vistas === null ? [] : ids.filter((id) => !vistas.includes(id));
  });
  const celebrado = useRef(false);
  useEffect(() => {
    guardarVistas(ids);
  }, [ids.join(',')]); // eslint-disable-line react-hooks/exhaustive-deps
  useEffect(() => {
    if (celebrado.current || !nuevas.length || reducir) return;
    celebrado.current = true;
    const t = setTimeout(() => {
      void confetti({ particleCount: 140, spread: 100, origin: { y: 0.4 }, colors: ['#4fbfa5', '#2a9c83', '#f2a93b', '#1f2738'], disableForReducedMotion: true });
    }, 700);
    return () => clearTimeout(t);
  }, [nuevas, reducir]);

  // La próxima insignia: la pendiente con más avance
  const proxima = lista.filter((x) => !x.on).sort((x, y) => y.a.valor - x.a.valor)[0];
  const ejTotal = MODULOS.reduce((s, m) => s + m.ejercicios.length, 0);
  const ejHechos = MODULOS.reduce((s, m) => s + m.ejercicios.filter((e) => ejercicioCompletado(p.ejercicios[e.id])).length, 0);
  const tests = Object.values(p.ejercicios).filter((e) => (e.test ?? 0) >= APROBADO).length;

  return (
    <div className="wrap lg pl">
      <header className="ax-banner pl-banner">
        <div className="pl-banner-in">
          <NucleoOrbita valor={global} etiqueta="de tu formación" size={190} className="pl-nucleo" />
          <div className="pl-banner-txt">
            <h1 className="lg-h1">Tus logros</h1>
            <p className="lead">
              {global >= 1 ? 'Lo tienes todo: a por el examen.' : ganadas.length === 0 ? 'Termina tu primer recorrido guiado y estrenas la primera insignia.' : 'Cada ejercicio que completas suma.'}
            </p>
            <div className="ax-stats pl-stats">
              <div className="ax-stat">
                <span className="ax-num">
                  {ganadas.length}
                  <small>/{INSIGNIAS.length}</small>
                </span>
                <span>insignias</span>
              </div>
              <div className="ax-stat">
                <span className="ax-num">
                  {ejHechos}
                  <small>/{ejTotal}</small>
                </span>
                <span>ejercicios</span>
              </div>
              <div className="ax-stat">
                <span className="ax-num">{tests}</span>
                <span>tests aprobados</span>
              </div>
            </div>
          </div>
          {proxima && (
            <motion.aside
              className="glass pl-next"
              style={{ ['--c' as string]: proxima.a.color } as CSSProperties}
              initial={reducir ? false : { opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3, duration: 0.5 }}
              aria-labelledby="prox-h"
            >
              <Medalla a={proxima.a} on={false} />
              <div>
                <h2 id="prox-h">Tu próxima insignia</h2>
                <strong>{proxima.b.titulo}</strong>
                <p>{proxima.b.texto}</p>
                <div className="ax-bar" aria-hidden="true">
                  <i style={{ width: `${Math.max(proxima.a.valor * 100, 2)}%` }} />
                </div>
                <p className="pl-next-cuenta">{proxima.a.cuenta}</p>
              </div>
            </motion.aside>
          )}
        </div>
      </header>

      <svg width="0" height="0" style={{ position: 'absolute' }} aria-hidden="true">
        <defs>
          <radialGradient id="pl-luz" cx="35%" cy="28%" r="75%">
            <stop offset="0" stopColor="#fff" stopOpacity="0.45" />
            <stop offset="0.5" stopColor="#fff" stopOpacity="0" />
            <stop offset="1" stopColor="#000" stopOpacity="0.18" />
          </radialGradient>
        </defs>
      </svg>

      <section className="lg-sec" aria-labelledby="ins-h">
        <h2 id="ins-h">Insignias</h2>
        <div className="pl-badges" role="list">
          {lista.map(({ b, on, a }, i) => (
            <TarjetaInsignia key={b.id} b={b} a={a} on={on} nueva={nuevas.includes(b.id)} i={i} />
          ))}
        </div>
      </section>

      <section className="lg-sec" aria-labelledby="av-h">
        <h2 id="av-h">Avance por módulo</h2>
        <div className="glass pl-planetas">
          <svg className="pl-planetas-traza" viewBox="0 0 600 60" preserveAspectRatio="none" aria-hidden="true">
            <defs>
              <linearGradient id="arcoNeon" x1="0" y1="0" x2="1" y2="0">
                <stop offset="0" stopColor="#5ff0d2" />
                <stop offset="0.55" stopColor="#6fe9ff" />
                <stop offset="1" stopColor="#8b7bff" />
              </linearGradient>
            </defs>
            <path className="orbita-trazo" d="M10 50 C 160 0, 440 0, 590 50" strokeWidth="3" vectorEffect="non-scaling-stroke" />
          </svg>
          <ul>
            {MODULOS.map((m) => {
              const meta = META[m.id] ?? { color: 'var(--arc)', icono: 'maestros', corto: m.titulo };
              const av = avanceModulo(p, m.id);
              const hechos = m.ejercicios.filter((e) => ejercicioCompletado(p.ejercicios[e.id])).length;
              return (
                <li key={m.id}>
                  <Planeta color={meta.color} valor={av} size={64} icono={meta.icono} etiqueta={meta.corto} pct to={`/modulo/${m.id}`} />
                  <span className="pl-planeta-ej">
                    {hechos} de {m.ejercicios.length} ejercicios
                  </span>
                </li>
              );
            })}
          </ul>
        </div>
      </section>

      <section className="pl-ajustes" aria-labelledby="aj-h">
        <h2 id="aj-h">Tus datos y tu copia</h2>
        <div className="lg-grid" style={{ marginTop: 16 }}>
          <DatosAlumno />
          <Copia />
          <Reiniciar />
        </div>
      </section>
    </div>
  );
}
