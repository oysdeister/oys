import { bloquesObligatorios } from '../lib/ruta';
import { useEffect, useRef, useState, type CSSProperties } from 'react';
import { Link } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { META, MODULOS } from '../content';
import { acciones, APROBADO, ejercicioCompletado, useProgreso, type Progreso, limpiaUsuario } from '../lib/progress';
import { avanceGlobal, avanceModulo } from '../lib/avance';
import { INSIGNIAS, type Insignia } from '../lib/badges';
import { clavesActivas } from '../lib/examenModulo';
import { Icon } from '../components/Icon';
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
      className="g-card lg-form"
      onSubmit={(e) => {
        e.preventDefault();
        if (!ok) return;
        acciones.setAlumno(nombre, ini, usuario);
        setGuardado(true);
        setTimeout(() => setGuardado(false), 2200);
      }}
    >
      <h2>Tus datos</h2>
      <p className="small muted">Tus iniciales aparecen en todos los códigos de los bloques. Si las cambias, usa las nuevas también en la Demo real.</p>
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
    <div className="g-card lg-copia">
      <h2>Llévate tu progreso</h2>
      <p className="small muted">Descarga o copia tu progreso para tener una copia aparte o para seguir en otro navegador, en otro ordenador o en el móvil: allí lo cargas con «Cargar un fichero» o lo pegas abajo.</p>
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
    <div className="g-card lg-reset">
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
            Se borran tus pasos, notas, listas de la Demo real y simuladores. No se puede deshacer: si quieres guardar una copia, descárgala antes.
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
    const hechos = m ? bloquesObligatorios(m).filter((e) => ejercicioCompletado(p.ejercicios[e.id])).length : 0;
    const total = m ? bloquesObligatorios(m).length || 1 : 1;
    return { color: META[id]?.color ?? b.color, icono: META[id]?.icono ?? 'check', valor: hechos / total, cuenta: `${hechos} de ${total} bloques` };
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
      return { color: b.color, icono: 'play', valor: v, cuenta: v >= 1 ? 'Hecho' : v > 0 ? 'Guiado empezado' : 'Sin empezar' };
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
      return { color: b.color, icono: 'check', valor: mejor, cuenta: `Mejor Demo real: ${Math.round(mejor * 100)} %` };
    }
    case 'cuadrado':
      return { color: b.color, icono: 'asiento', valor: p.sims.asiento ? 1 : 0, cuenta: p.sims.asiento ? 'Hecho' : 'Simulador «Cuadra el asiento»' };
    case 'taller': {
      const n = SIMS_INSIGNIA.filter((s) => p.sims[s]).length;
      return { color: b.color, icono: 'taller', valor: n / SIMS_INSIGNIA.length, cuenta: `${n} de ${SIMS_INSIGNIA.length} simuladores de la insignia` };
    }
    case 'listo': {
      const conBloques = MODULOS.filter((m) => bloquesObligatorios(m).length > 0);
      const n = conBloques.filter((m) => bloquesObligatorios(m).length > 0 && bloquesObligatorios(m).every((e) => ejercicioCompletado(p.ejercicios[e.id]))).length;
      return { color: 'var(--arc-deep)', icono: 'examen', valor: n / Math.max(1, conBloques.length), cuenta: `${n} de ${conBloques.length} módulos` };
    }
    default:
      return { color: b.color, icono: 'logros', valor: b.ganada(p) ? 1 : 0, cuenta: '' };
  }
}

/** Medalla plana: círculo del color con el icono; apagada, aro gris con lo que llevas */
function Medalla({ a, on }: { a: Aspecto; on: boolean }) {
  return (
    <span className="lgx-medalla">
      <svg viewBox="0 0 100 100" aria-hidden="true">
        {on ? (
          <circle cx="50" cy="50" r="46" fill={a.color} />
        ) : (
          <>
            <circle cx="50" cy="50" r="44" fill="var(--g-paper)" stroke="var(--g-line)" strokeWidth="5" />
            {a.valor > 0 && <circle cx="50" cy="50" r="44" fill="none" stroke={a.color} strokeWidth="5" strokeLinecap="round" pathLength={1} strokeDasharray={`${a.valor} 1`} transform="rotate(-90 50 50)" />}
          </>
        )}
      </svg>
      <span className="lgx-medalla-ico">
        <Icon name={a.icono} size={26} stroke={2.2} />
      </span>
    </span>
  );
}

function TarjetaInsignia({ b, a, on, nueva }: { b: Insignia; a: Aspecto; on: boolean; nueva: boolean }) {
  return (
    <li
      className={`lgx-insignia${on ? ' on' : ''}`}
      style={{ ['--c' as string]: a.color } as CSSProperties}
      aria-label={`${on ? 'Insignia ganada' : 'Insignia pendiente'}: ${b.titulo}. ${b.texto}${on ? '' : ` Llevas: ${a.cuenta}.`}`}
    >
      <Medalla a={a} on={on} />
      <span className="lgx-insignia-txt">
        <b>
          {b.titulo}
          {nueva && <span className="lgx-nueva">Nueva</span>}
        </b>
        <span>{b.texto}</span>
        <span className={`lgx-cuenta${on ? ' ok' : ''}`}>
          {on ? (
            <>
              <Icon name="check" size={14} stroke={3} /> Ganada
            </>
          ) : (
            a.cuenta
          )}
        </span>
      </span>
    </li>
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
  const global = avanceGlobal(p);
  const lista = INSIGNIAS.map((b) => ({ b, on: b.ganada(p), a: aspecto(b, p) }));
  const ganadas = lista.filter((x) => x.on);
  const ids = ganadas.map((x) => x.b.id);
  // Insignias ganadas desde la última visita: se marcan como «Nueva» una vez
  const [nuevas] = useState<string[]>(() => {
    const vistas = leerVistas();
    return vistas === null ? [] : ids.filter((id) => !vistas.includes(id));
  });
  useEffect(() => {
    guardarVistas(ids);
  }, [ids.join(',')]); // eslint-disable-line react-hooks/exhaustive-deps

  // La próxima insignia: la pendiente con más avance
  const proxima = lista.filter((x) => !x.on).sort((x, y) => y.a.valor - x.a.valor)[0];
  const ejTotal = MODULOS.reduce((s, m) => s + bloquesObligatorios(m).length, 0);
  const ejHechos = MODULOS.reduce((s, m) => s + bloquesObligatorios(m).filter((e) => ejercicioCompletado(p.ejercicios[e.id])).length, 0);
  const tests = Object.values(p.ejercicios).filter((e) => (e.test ?? 0) >= APROBADO).length;

  return (
    <div className="wrap lg cs-pag lgx">
      <header className="g-hero cs-hero">
        <p className="g-kicker">Tu avance</p>
        <h1>Tus logros</h1>
        <p className="cs-lead">
          {global >= 1 ? 'Lo tienes todo: a por el examen.' : ganadas.length === 0 ? 'Termina tu primer Guiado y estrenas la primera insignia.' : 'Cada bloque que completas suma.'}
        </p>
        <p className="cs-datos">
          <span>
            <b>{Math.round(global * 100)} %</b> de tu formación
          </span>
          <span>
            <b>
              {ganadas.length} de {INSIGNIAS.length}
            </b>{' '}
            insignias
          </span>
          <span>
            <b>
              {ejHechos} de {ejTotal}
            </b>{' '}
            bloques
          </span>
          <span>
            <b>{tests}</b> {tests === 1 ? 'test aprobado' : 'tests aprobados'}
          </span>
        </p>
      </header>

      {proxima && (
        <aside className="g-box info lgx-proxima" aria-labelledby="prox-h" style={{ ['--c' as string]: proxima.a.color } as CSSProperties}>
          <span className="t" id="prox-h">
            Tu próxima insignia: {proxima.b.titulo}
          </span>
          <p>{proxima.b.texto}</p>
          <span className="cs-barra" aria-hidden="true">
            <i style={{ width: `${Math.max(proxima.a.valor * 100, 2)}%` }} />
          </span>
          <p className="lgx-proxima-cuenta">{proxima.a.cuenta}</p>
        </aside>
      )}

      <section className="cs-sec" aria-labelledby="ins-h">
        <h2 id="ins-h">Insignias</h2>
        <ul className="lgx-insignias">
          {lista.map(({ b, on, a }) => (
            <TarjetaInsignia key={b.id} b={b} a={a} on={on} nueva={nuevas.includes(b.id)} />
          ))}
        </ul>
      </section>

      <section className="cs-sec" aria-labelledby="av-h">
        <h2 id="av-h">Avance por módulo</h2>
        <ul className="g-card lgx-mods">
          {MODULOS.map((m, i) => {
            const meta = META[m.id] ?? { color: 'var(--arc)', icono: 'maestros', corto: m.titulo };
            const av = avanceModulo(p, m.id);
            const total = bloquesObligatorios(m).length;
            const hechos = bloquesObligatorios(m).filter((e) => ejercicioCompletado(p.ejercicios[e.id])).length;
            return (
              <li key={m.id} style={{ ['--c' as string]: meta.color } as CSSProperties}>
                <Link to={`/modulo/${m.id}`} className="lgx-mod">
                  <span className="lgx-mod-n">{i}</span>
                  <span className="lgx-mod-nom">{meta.corto}</span>
                  <span className="cs-barra lgx-mod-barra" aria-hidden="true">
                    <i style={{ width: `${Math.round(av * 100)}%` }} />
                  </span>
                  <span className="lgx-mod-cuenta">
                    {hechos} de {total} bloques
                  </span>
                  <span className="lgx-mod-pct">{Math.round(av * 100)} %</span>
                </Link>
              </li>
            );
          })}
        </ul>
      </section>

      <section className="cs-sec" aria-labelledby="aj-h">
        <h2 id="aj-h">Tus datos y tu copia</h2>
        <div className="lg-grid lgx-ajustes">
          <DatosAlumno />
          <Copia />
          <Reiniciar />
        </div>
      </section>
    </div>
  );
}
