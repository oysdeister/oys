import { createContext, useCallback, useContext, useEffect, useRef, useState, type ReactNode } from 'react';
import { avisarCambio } from '../lib/sync';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import confetti from 'canvas-confetti';
import { Link } from 'react-router-dom';
import { Icon, Medal } from '../components/Icon';
import { acciones, useProgreso } from '../lib/progress';
import { getModulo } from '../content';
import { num2, redondea } from '../lib/texto';

/* ---------- Datos: lectura segura de datosSimulador ---------- */

export const esObj = (v: unknown): v is Record<string, unknown> => typeof v === 'object' && v !== null && !Array.isArray(v);
export const lista = (v: unknown): unknown[] => (Array.isArray(v) ? v : []);
export const num = (v: unknown, d = 0) => (typeof v === 'number' && Number.isFinite(v) ? v : d);
export const txt = (v: unknown, d = '') => (typeof v === 'string' ? v : d);

export function datosSim(modulo: string): Record<string, unknown> {
  const d = getModulo(modulo)?.datosSimulador;
  return esObj(d) ? d : {};
}

/** Iniciales del alumno para sustituir {INI} (CL si aún no las ha escrito) */
export function useIni() {
  return useProgreso().alumno.ini || 'CL';
}

/* ---------- Números ---------- */

/** Lee un importe tecleado: admite «48,40», «48.40», «1.250,00» o «1250» */
export function leeImporte(s: string): number | null {
  const t = s.trim().replace(/[\s€]/g, '');
  if (!t) return null;
  let n = t;
  if (t.includes(',')) n = t.replace(/\./g, '').replace(',', '.');
  else if (/^\d{1,3}(\.\d{3})+$/.test(t)) n = t.replace(/\./g, '');
  const v = Number(n);
  return Number.isFinite(v) ? redondea(v) : null;
}

export const igual = (a: number | null, b: number) => a !== null && Math.abs(a - b) < 0.005;
export const f2 = (n: number) => num2.format(n);

/* ---------- Azar para las variaciones ---------- */

export const azar = (a: number, b: number) => a + Math.floor(Math.random() * (b - a + 1));
export const elige = <T,>(xs: readonly T[]): T => xs[Math.floor(Math.random() * xs.length)];
export function baraja<T>(xs: readonly T[]): T[] {
  const r = [...xs];
  for (let i = r.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [r[i], r[j]] = [r[j], r[i]];
  }
  // nunca devuelve el orden correcto si hay más de un elemento
  if (r.length > 1 && r.every((x, i) => x === xs[i])) [r[0], r[1]] = [r[1], r[0]];
  return r;
}
export const pad = (n: number, d: number) => String(n).padStart(d, '0');

/* ---------- Celebración ---------- */

const COLORES = ['#5ff0d2', '#8b7bff', '#f6b65a', '#6fe9ff', '#ffffff'];

export function confeti(reducido: boolean, fuerte = true, color?: string) {
  if (reducido) return;
  const colors = color ? [color, ...COLORES] : COLORES;
  try {
    if (fuerte) {
      const fin = Date.now() + 1400;
      const tiro = () => {
        confetti({ particleCount: 6, angle: 60, spread: 65, origin: { x: 0, y: 0.75 }, colors, disableForReducedMotion: true });
        confetti({ particleCount: 6, angle: 120, spread: 65, origin: { x: 1, y: 0.75 }, colors, disableForReducedMotion: true });
        if (Date.now() < fin) requestAnimationFrame(tiro);
      };
      tiro();
      setTimeout(() => {
        try {
          confetti({ particleCount: 120, spread: 360, startVelocity: 34, ticks: 90, origin: { x: 0.5, y: 0.42 }, colors, shapes: ['star', 'circle'], scalar: 1.1, disableForReducedMotion: true });
        } catch {
          /* nada */
        }
      }, 350);
    } else {
      confetti({ particleCount: 46, spread: 75, startVelocity: 30, origin: { y: 0.7 }, colors, scalar: 0.85, disableForReducedMotion: true });
    }
  } catch {
    /* sin canvas: no pasa nada */
  }
}

/* ---------- Avance por rondas (solo para la portada del Taller) ---------- */

export const CLAVE_AVANCE = 'oys-taller-avance-v1';

/** Rondas superadas como máximo en cada simulador (vive en este navegador) */
export function leeAvanceTaller(): Record<string, number> {
  try {
    const raw = localStorage.getItem(CLAVE_AVANCE);
    const d: unknown = raw ? JSON.parse(raw) : {};
    if (!esObj(d)) return {};
    const r: Record<string, number> = {};
    for (const [k, v] of Object.entries(d)) if (typeof v === 'number') r[k] = v;
    return r;
  } catch {
    return {};
  }
}
function guardaAvanceTaller(id: string, rondas: number) {
  try {
    const a = leeAvanceTaller();
    if ((a[id] ?? 0) >= rondas) return;
    localStorage.setItem(CLAVE_AVANCE, JSON.stringify({ ...a, [id]: rondas }));
    avisarCambio();
  } catch {
    /* sin almacenamiento: no pasa nada */
  }
}

/* ---------- Estado de una partida: rondas, acierto, fin ---------- */

export function useSim(id: string, total: number) {
  const reducido = !!useReducedMotion();
  const [ronda, setRonda] = useState(0);
  const [resuelta, setResuelta] = useState(false);
  const [fin, setFin] = useState(false);
  const [partida, setPartida] = useState(0);
  return {
    id,
    ronda,
    resuelta,
    fin,
    partida,
    total,
    reducido,
    acierto() {
      if (resuelta) return;
      setResuelta(true);
      guardaAvanceTaller(id, ronda + 1);
      confeti(reducido, false);
    },
    siguiente() {
      if (ronda + 1 >= total) {
        setFin(true);
        acciones.simSuperado(id);
        guardaAvanceTaller(id, total);
      } else {
        setRonda((r) => r + 1);
        setResuelta(false);
      }
    },
    repetir() {
      setPartida((p) => p + 1);
      setRonda(0);
      setResuelta(false);
      setFin(false);
    },
  };
}
export type Sim = ReturnType<typeof useSim>;

/* ---------- Pulso: cada veredicto avisa al marco (racha, destello, pistas) ---------- */

const PulsoCtx = createContext<(ok: boolean) => void>(() => {});

/* ---------- Marco común de un simulador ---------- */

/** Icono de cada simulador (pastilla de la lista y del HUD) */
const ICONO_SIM: Record<string, string> = {
  asiento: 'balanza',
  numerador: 'numeros',
  circuito: 'circuito',
  docflow: 'docflow',
  factura: 'factura',
  concilia: 'concilia',
  cartera: 'cartera',
};
export const iconoSim = (id: string) => ICONO_SIM[id] ?? 'taller';

/** Contador de rondas: «Ronda X de N» y una barra con un tramo por ronda */
function RondasHud({ total, ronda, fin, resuelta, reducido }: { total: number; ronda: number; fin: boolean; resuelta: boolean; reducido: boolean }) {
  const hechas = fin ? total : ronda + (resuelta ? 1 : 0);
  return (
    <div className="tlx-rondas" role="img" aria-label={fin ? 'Todas las rondas superadas' : `Ronda ${ronda + 1} de ${total}`}>
      <span className="tlx-rondas-txt" aria-hidden="true">
        Ronda{' '}
        <AnimatePresence mode="popLayout" initial={false}>
          <motion.b
            key={fin ? total : ronda + 1}
            initial={reducido ? { opacity: 0 } : { y: 14, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={reducido ? { opacity: 0 } : { y: -14, opacity: 0 }}
            transition={{ type: 'spring', stiffness: 380, damping: 26 }}
          >
            {fin ? total : ronda + 1}
          </motion.b>
        </AnimatePresence>{' '}
        de {total}
      </span>
      <span className="tlx-rondas-seg" aria-hidden="true">
        {Array.from({ length: total }, (_, i) => {
          const hecho = i < hechas;
          const actual = !fin && i === ronda && !resuelta;
          return (
            <i key={i} className={actual ? 'actual' : ''}>
              <motion.b
                className={hecho ? 'hecho' : ''}
                initial={false}
                animate={{ scaleX: hecho ? 1 : 0, opacity: hecho ? 1 : 0 }}
                transition={reducido ? { duration: 0 } : { type: 'spring', stiffness: 160, damping: 22 }}
              />
            </i>
          );
        })}
      </span>
    </div>
  );
}

export function Marco({
  sim,
  titulo,
  color,
  concepto,
  instruccion,
  pistas = [],
  enunciado,
  children,
  extra,
}: {
  sim: Sim;
  titulo: string;
  color: string;
  concepto: ReactNode;
  /** Qué hay que hacer, en una línea */
  instruccion?: ReactNode;
  /** Pistas que se van destapando con cada fallo de la ronda */
  pistas?: ReactNode[];
  enunciado?: ReactNode;
  children: ReactNode;
  extra?: ReactNode;
}) {
  const p = useProgreso();
  const primeraVez = !p.sims[sim.id] && !(leeAvanceTaller()[sim.id] > 0);
  // En el móvil empieza plegado: la instrucción de arriba basta para jugar
  const [verConcepto, setVerConcepto] = useState(() => primeraVez && !(typeof window !== 'undefined' && window.matchMedia?.('(max-width: 760px)').matches));
  const r = sim.reducido;
  const resueltaEn = useRef(0);
  const [racha, setRacha] = useState(0);
  const [mejor, setMejor] = useState(0);
  const [fallos, setFallos] = useState(0);
  const [fallosTotal, setFallosTotal] = useState(0);
  const [destello, setDestello] = useState<{ ok: boolean; n: number } | null>(null);

  useEffect(() => {
    if (sim.resuelta) resueltaEn.current = Date.now();
  }, [sim.resuelta]);
  // Cada ronda empieza sin pistas destapadas
  useEffect(() => setFallos(0), [sim.ronda, sim.partida]);
  useEffect(() => {
    setRacha(0);
    setMejor(0);
    setFallosTotal(0);
  }, [sim.partida]);
  // Victoria: lluvia de confeti del color del simulador
  useEffect(() => {
    if (sim.fin) confeti(r, true, color);
  }, [sim.fin, r, color]);

  const pulso = useCallback((ok: boolean) => {
    setDestello((d) => ({ ok, n: (d?.n ?? 0) + 1 }));
    if (ok) {
      setRacha((x) => {
        const n = x + 1;
        setMejor((m) => Math.max(m, n));
        return n;
      });
    } else {
      setRacha(0);
      setFallos((f) => f + 1);
      setFallosTotal((f) => f + 1);
    }
  }, []);

  const nPistas = Math.min(fallos, pistas.length);

  return (
    <PulsoCtx.Provider value={pulso}>
      <div className="tl-sim tlx-sim" style={{ ['--sim' as string]: color }}>
        <header className="ax-banner tl-banner tlx-hud">
          <Link to="/taller" className="btn ghost sm tlx-volver" aria-label="Volver al Taller">
            <Icon name="atras" size={20} /> <span className="tlx-volver-txt">Taller</span>
          </Link>
          <span className="tlx-hud-ico" aria-hidden="true">
            <Icon name={iconoSim(sim.id)} size={28} />
          </span>
          <div className="tlx-hud-txt">
            <h1>{titulo}</h1>
            {instruccion && (
              <p className="tlx-instruccion">
                <Icon name="play" size={14} /> <span>{instruccion}</span>
              </p>
            )}
          </div>
          <div className="tlx-hud-marcas">
            <AnimatePresence mode="popLayout" initial={false}>
              <motion.span
                key={racha}
                className={`tlx-racha ${racha >= 3 ? 'caliente' : ''} ${racha === 0 ? 'cero' : ''}`}
                initial={r ? false : { scale: 1.6, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ type: 'spring', stiffness: 420, damping: 18 }}
                aria-label={`Racha de ${racha} aciertos seguidos`}
                title="Aciertos seguidos"
              >
                <svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true">
                  <path d="M12 2c1 4 5 5.5 5 11a5 5 0 0 1-10 0c0-2.6 1.4-4 2.4-5.6.3 1.8 1.2 2.7 2.1 3 .2-3-1.3-5.4.5-8.4z" fill="currentColor" />
                </svg>
                <b>{racha}</b>
                <small>racha</small>
              </motion.span>
            </AnimatePresence>
            <RondasHud total={sim.total} ronda={sim.ronda} fin={sim.fin} resuelta={sim.resuelta} reducido={r} />
          </div>
        </header>

        <div className="callout why tl-concepto">
          <button className="tl-concepto-btn" onClick={() => setVerConcepto((v) => !v)} aria-expanded={verConcepto}>
            <Icon name="cerebro" size={18} /> En llano: qué estás practicando
            <span className="tl-concepto-flecha" aria-hidden="true" style={{ transform: verConcepto ? 'rotate(90deg)' : 'none' }}>
              <Icon name="chevron" size={16} />
            </span>
          </button>
          <AnimatePresence initial={false}>
            {verConcepto && (
              <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} style={{ overflow: 'hidden' }}>
                <div className="tl-concepto-txt">{concepto}</div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <AnimatePresence mode="wait">
          {sim.fin ? (
            <motion.section
              key="fin"
              className="glass tl-fin tlx-fin"
              initial={r ? { opacity: 0 } : { opacity: 0, rotateX: -30, y: 30 }}
              animate={{ opacity: 1, rotateX: 0, y: 0 }}
              transition={{ type: 'spring', stiffness: 120, damping: 16 }}
            >
              <motion.div className="tlx-trofeo" initial={r ? false : { scale: 0.2, rotate: -40, opacity: 0 }} animate={{ scale: 1, rotate: 0, opacity: 1 }} transition={{ delay: 0.2, type: 'spring', stiffness: 200, damping: 12 }}>
                <span className="tlx-rayos" aria-hidden="true" />
                <span className="tlx-trofeo-aro" aria-hidden="true" />
                <Medal color={color} label="Medalla del simulador" />
              </motion.div>
              <div className="tlx-fin-txt">
                <h2>¡Simulador superado!</h2>
                <p className="muted">Has hecho las {sim.total} rondas. Ya cuenta para tus insignias. Si repites, las variaciones salen con datos nuevos.</p>
                <ul className="tlx-stats">
                  <li>
                    <b>{sim.total}</b>
                    <span>rondas</span>
                  </li>
                  <li>
                    <b>{mejor}</b>
                    <span>mejor racha</span>
                  </li>
                  <li>
                    <b>{fallosTotal}</b>
                    <span>{fallosTotal === 1 ? 'fallo' : 'fallos'}</span>
                  </li>
                </ul>
                <div className="tl-acciones">
                  <button className="btn arc" onClick={sim.repetir}>
                    Repetir con datos nuevos
                  </button>
                  <Link className="btn ghost" to="/taller">
                    Volver al Taller
                  </Link>
                </div>
              </div>
            </motion.section>
          ) : (
            <motion.section
              key={`${sim.partida}-${sim.ronda}`}
              className="glass tl-ronda tlx-ronda"
              initial={r ? { opacity: 0 } : { opacity: 0, x: 48, scale: 0.985 }}
              animate={{ opacity: 1, x: 0, scale: 1 }}
              exit={r ? { opacity: 0 } : { opacity: 0, x: -48, scale: 0.985 }}
              transition={r ? { duration: 0.15 } : { duration: 0.34, ease: [0.2, 0.7, 0.2, 1] }}
            >
              {destello && <span key={destello.n} className={`tlx-destello ${destello.ok ? 'ok flash-ok' : 'ko flash-ko'}`} aria-hidden="true" />}
              <div className="tl-ronda-num">
                Ronda {sim.ronda + 1} de {sim.total}
              </div>
              {enunciado && <div className="tl-enunciado">{enunciado}</div>}
              {children}
              <AnimatePresence initial={false}>
                {nPistas > 0 && !sim.resuelta && (
                  <motion.aside
                    className="tlx-pistas"
                    initial={r ? { opacity: 0 } : { opacity: 0, y: 12, rotateX: -20 }}
                    animate={{ opacity: 1, y: 0, rotateX: 0 }}
                    exit={{ opacity: 0 }}
                    aria-live="polite"
                  >
                    <span className="tlx-pistas-tit">
                      <svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true">
                        <path d="M9 18h6M10 21h4M12 3a6 6 0 0 0-3.5 10.9c.6.5 1 1.2 1 2.1h5c0-.9.4-1.6 1-2.1A6 6 0 0 0 12 3z" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                      {nPistas === 1 ? 'Una pista' : `Pistas (${nPistas} de ${pistas.length})`}
                    </span>
                    <ol>
                      {pistas.slice(0, nPistas).map((t, i) => (
                        <motion.li key={i} initial={r ? false : { opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }}>
                          {t}
                        </motion.li>
                      ))}
                    </ol>
                  </motion.aside>
                )}
              </AnimatePresence>
            </motion.section>
          )}
        </AnimatePresence>

        {!sim.fin && (
          <AnimatePresence>
            {sim.resuelta && (
              <motion.div className="tl-siguiente tlx-siguiente" initial={r ? { opacity: 0 } : { y: 40, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: 40, opacity: 0 }}>
                <span>
                  <motion.span className="tlx-siguiente-ico" initial={r ? false : { scale: 0, rotate: -30 }} animate={{ scale: 1, rotate: 0 }} transition={{ delay: 0.1, type: 'spring', stiffness: 420, damping: 14 }} aria-hidden="true">
                    <Icon name="check" size={18} stroke={3} />
                  </motion.span>{' '}
                  {racha >= 3 ? `¡Ronda superada! Llevas ${racha} aciertos seguidos` : 'Ronda superada'}
                </span>
                <button
                  className="btn arc"
                  onClick={() => {
                    // El Enter que resolvió la ronda no debe saltarla sin ver el mensaje de acierto
                    if (Date.now() - resueltaEn.current < 600) return;
                    sim.siguiente();
                  }}
                  autoFocus
                >
                  {sim.ronda + 1 >= sim.total ? 'Terminar' : 'Siguiente'}
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        )}
        {extra}
      </div>
    </PulsoCtx.Provider>
  );
}

/* ---------- Mensaje de acierto o fallo ---------- */

export type Veredicto = { ok: boolean; texto: ReactNode; n: number } | null;

/** Hook pequeño para emitir veredictos que se reaniman aunque el texto se repita */
export function useVeredicto() {
  const pulso = useContext(PulsoCtx);
  const [v, setV] = useState<Veredicto>(null);
  return [
    v,
    (ok: boolean, texto: ReactNode) => {
      setV((p) => ({ ok, texto, n: (p?.n ?? 0) + 1 }));
      pulso(ok);
    },
    () => setV(null),
  ] as const;
}

export function MensajeVeredicto({ v }: { v: Veredicto }) {
  const r = useReducedMotion();
  return (
    <div className="tl-veredicto-zona" aria-live="polite">
      <AnimatePresence mode="popLayout">
        {v && (
          <motion.div
            key={v.n}
            className={`tl-veredicto ${v.ok ? 'ok' : 'mal'}`}
            initial={r ? { opacity: 0 } : v.ok ? { scale: 0.6, opacity: 0 } : { x: 0, opacity: 0 }}
            animate={r ? { opacity: 1 } : v.ok ? { scale: 1, opacity: 1 } : { x: [0, -12, 10, -7, 4, 0], opacity: 1 }}
            exit={{ opacity: 0, y: -6 }}
            transition={v.ok ? { type: 'spring', stiffness: 380, damping: 16 } : { duration: 0.45 }}
          >
            <motion.span
              className="tl-veredicto-ico"
              aria-hidden="true"
              initial={r ? false : v.ok ? { scale: 0, rotate: -45 } : { scale: 0.6 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ delay: 0.06, type: 'spring', stiffness: 500, damping: 14 }}
            >
              {v.ok ? <Icon name="check" size={20} stroke={3} /> : <Icon name="aviso" size={20} />}
            </motion.span>
            <div>{v.texto}</div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

/** Animación de sacudida para un elemento que falla */
export const sacude = { x: [0, -8, 7, -5, 3, 0], transition: { duration: 0.4 } };
