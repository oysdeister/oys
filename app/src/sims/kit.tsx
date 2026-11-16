import { useEffect, useRef, useState, type ReactNode } from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import confetti from 'canvas-confetti';
import { Link } from 'react-router-dom';
import { Icon } from '../components/Icon';
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

const COLORES = ['#4fbfa5', '#2a9c83', '#1f2738', '#f2a93b', '#ffffff'];

export function confeti(reducido: boolean, fuerte = true) {
  if (reducido) return;
  try {
    if (fuerte) {
      const fin = Date.now() + 900;
      const tiro = () => {
        confetti({ particleCount: 5, angle: 60, spread: 60, origin: { x: 0, y: 0.75 }, colors: COLORES, disableForReducedMotion: true });
        confetti({ particleCount: 5, angle: 120, spread: 60, origin: { x: 1, y: 0.75 }, colors: COLORES, disableForReducedMotion: true });
        if (Date.now() < fin) requestAnimationFrame(tiro);
      };
      tiro();
    } else {
      confetti({ particleCount: 40, spread: 70, startVelocity: 28, origin: { y: 0.7 }, colors: COLORES, scalar: 0.8, disableForReducedMotion: true });
    }
  } catch {
    /* sin canvas: no pasa nada */
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
    ronda,
    resuelta,
    fin,
    partida,
    total,
    reducido,
    acierto() {
      if (resuelta) return;
      setResuelta(true);
      confeti(reducido, false);
    },
    siguiente() {
      if (ronda + 1 >= total) {
        setFin(true);
        acciones.simSuperado(id);
        confeti(reducido, true);
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

/* ---------- Marco común de un simulador ---------- */

/** Recorrido de rondas dibujado sobre el arco O&S */
function ArcoRondas({ total, ronda, fin }: { total: number; ronda: number; fin: boolean }) {
  const pts = Array.from({ length: total }, (_, i) => {
    const t = total === 1 ? 0.5 : i / (total - 1);
    const a = Math.PI * (1 - t);
    return { x: 60 + 50 * Math.cos(a), y: 58 - 42 * Math.sin(a) };
  });
  return (
    <svg className="tl-arco" viewBox="0 0 120 64" role="img" aria-label={fin ? 'Todas las rondas superadas' : `Ronda ${ronda + 1} de ${total}`}>
      <path d="M10 58 A50 42 0 0 1 110 58" fill="none" stroke="var(--line)" strokeWidth="4" strokeLinecap="round" />
      <motion.path
        d="M10 58 A50 42 0 0 1 110 58"
        fill="none"
        stroke="var(--arc)"
        strokeWidth="4"
        strokeLinecap="round"
        initial={false}
        animate={{ pathLength: fin ? 1 : total === 1 ? 0 : ronda / (total - 1) }}
        transition={{ type: 'spring', stiffness: 70, damping: 16 }}
      />
      {pts.map((p, i) => {
        const hecho = fin || i < ronda;
        const actual = !fin && i === ronda;
        return (
          <motion.circle
            key={i}
            cx={p.x}
            cy={p.y}
            initial={false}
            animate={{ r: actual ? 7 : 5 }}
            fill={hecho ? 'var(--arc-deep)' : actual ? 'var(--signal)' : 'var(--sheet)'}
            stroke={hecho ? 'var(--arc-deep)' : actual ? 'var(--signal)' : 'var(--line)'}
            strokeWidth="2"
          />
        );
      })}
    </svg>
  );
}

export function Marco({
  sim,
  titulo,
  color,
  concepto,
  enunciado,
  children,
  extra,
}: {
  sim: Sim;
  titulo: string;
  color: string;
  concepto: ReactNode;
  enunciado?: ReactNode;
  children: ReactNode;
  extra?: ReactNode;
}) {
  const [verConcepto, setVerConcepto] = useState(true);
  const r = sim.reducido;
  const resueltaEn = useRef(0);
  useEffect(() => {
    if (sim.resuelta) resueltaEn.current = Date.now();
  }, [sim.resuelta]);
  return (
    <div className="tl-sim" style={{ ['--sim' as string]: color }}>
      <div className="tl-sim-head">
        <Link to="/taller" className="btn ghost sm tl-volver">
          <Icon name="atras" size={18} /> Taller
        </Link>
        <header className="ax-banner tl-banner tl-sim-tit">
          <h1>{titulo}</h1>
          <ArcoRondas total={sim.total} ronda={sim.ronda} fin={sim.fin} />
        </header>
      </div>

      <div className="callout why tl-concepto">
        <button className="tl-concepto-btn" onClick={() => setVerConcepto((v) => !v)} aria-expanded={verConcepto}>
          <Icon name="cerebro" size={18} /> En llano
          <span className="tl-concepto-flecha" aria-hidden="true" style={{ transform: verConcepto ? 'rotate(90deg)' : 'none' }}>
            <Icon name="flecha" size={16} />
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
            className="glass tl-fin"
            initial={r ? { opacity: 0 } : { opacity: 0, rotateX: -30, y: 30 }}
            animate={{ opacity: 1, rotateX: 0, y: 0 }}
            transition={{ type: 'spring', stiffness: 120, damping: 16 }}
          >
            <motion.div className="tl-sello" initial={r ? false : { scale: 2.4, rotate: -30, opacity: 0 }} animate={{ scale: 1, rotate: -8, opacity: 1 }} transition={{ delay: 0.25, type: 'spring', stiffness: 260, damping: 14 }}>
              <svg viewBox="0 0 120 120" aria-hidden="true">
                <circle cx="60" cy="60" r="54" fill="none" stroke="currentColor" strokeWidth="4" />
                <circle cx="60" cy="60" r="44" fill="none" stroke="currentColor" strokeWidth="1.5" strokeDasharray="3 4" />
                <path d="M26 78 C 22 44, 60 24, 98 40" fill="none" stroke="currentColor" strokeWidth="7" strokeLinecap="round" />
                <path d="M42 62l12 12 24-26" fill="none" stroke="currentColor" strokeWidth="8" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
              <span>Superado</span>
            </motion.div>
            <div>
              <h2>¡Simulador superado!</h2>
              <p className="muted">Has hecho las {sim.total} rondas. Ya cuenta para tus insignias. Si repites, las variaciones salen con datos nuevos.</p>
              <div className="tl-acciones">
                <button className="btn arc" onClick={sim.repetir}>
                  Repetir con datos nuevos
                </button>
                <Link className="btn ghost" to="/taller">
                  Volver al taller
                </Link>
              </div>
            </div>
          </motion.section>
        ) : (
          <motion.section
            key={`${sim.partida}-${sim.ronda}`}
            className="glass tl-ronda"
            initial={r ? { opacity: 0 } : { opacity: 0, rotateY: -14, x: 40 }}
            animate={{ opacity: 1, rotateY: 0, x: 0 }}
            exit={r ? { opacity: 0 } : { opacity: 0, rotateY: 14, x: -40 }}
            transition={{ duration: 0.38, ease: [0.2, 0.7, 0.2, 1] }}
          >
            <div className="tl-ronda-num">
              Ronda {sim.ronda + 1} de {sim.total}
            </div>
            {enunciado && <div className="tl-enunciado">{enunciado}</div>}
            {children}
          </motion.section>
        )}
      </AnimatePresence>

      {!sim.fin && (
        <AnimatePresence>
          {sim.resuelta && (
            <motion.div className="tl-siguiente" initial={{ y: 40, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: 40, opacity: 0 }}>
              <span>
                <Icon name="check" size={20} /> Ronda superada
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
                {sim.ronda + 1 >= sim.total ? 'Terminar' : 'Siguiente ronda'}
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      )}
      {extra}
    </div>
  );
}

/* ---------- Mensaje de acierto o fallo ---------- */

export type Veredicto = { ok: boolean; texto: ReactNode; n: number } | null;

/** Hook pequeño para emitir veredictos que se reaniman aunque el texto se repita */
export function useVeredicto() {
  const [v, setV] = useState<Veredicto>(null);
  return [
    v,
    (ok: boolean, texto: ReactNode) => setV((p) => ({ ok, texto, n: (p?.n ?? 0) + 1 })),
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
            <span className="tl-veredicto-ico" aria-hidden="true">
              {v.ok ? <Icon name="check" size={20} stroke={3} /> : <Icon name="aviso" size={20} />}
            </span>
            <div>{v.texto}</div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

/** Animación de sacudida para un elemento que falla */
export const sacude = { x: [0, -8, 7, -5, 3, 0], transition: { duration: 0.4 } };
