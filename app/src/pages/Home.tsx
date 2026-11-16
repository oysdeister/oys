import { useEffect, useMemo, type PointerEvent, type ReactNode } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion, useMotionValue, useReducedMotion, useSpring, useTransform } from 'framer-motion';
import { META, MODULOS, todosEjercicios } from '../content';
import { avanceEjercicio, ejercicioCompletado, useProgreso, type Progreso } from '../lib/progress';
import { avanceGlobal, avanceModulo } from '../lib/avance';
import { conIni } from '../lib/texto';
import { Icon } from '../components/Icon';
import { useMedia } from '../components/exercise/util';
import './aprender.css';

const EASE = [0.2, 0.7, 0.2, 1] as const;
const DIBUJO = 1.7; // segundos que tarda el arco en dibujarse

/* ---------- Geometría de la órbita (viewBox 600 × 480) ---------- */
const CX = 300, CY = 318, RX = 236, RY = 238;
const punto = (grados: number) => {
  const r = (grados * Math.PI) / 180;
  return { x: CX + RX * Math.cos(r), y: CY - RY * Math.sin(r) };
};
const A0 = 214, A1 = 12; // el arco empieza abajo a la izquierda y acaba arriba a la derecha, como en el logo
const ARCO = (() => {
  let d = '';
  for (let a = A0; a >= A1; a -= 2) {
    const p = punto(a);
    d += `${d ? ' L' : 'M'} ${p.x.toFixed(1)} ${p.y.toFixed(1)}`;
  }
  return d;
})();
const ORBITA = (() => {
  // La órbita completa menos la parte de abajo, para que no se salga del lienzo
  let d = '';
  for (let a = 218; a >= -38; a -= 3) {
    const p = punto(a);
    d += `${d ? ' L' : 'M'} ${p.x.toFixed(1)} ${p.y.toFixed(1)}`;
  }
  return d;
})();

function anguloEstacion(i: number, n: number) {
  const ini = 202, fin = 26;
  return n === 1 ? 90 : ini - ((ini - fin) * i) / (n - 1);
}

function Anillito({ valor, color, r = 29 }: { valor: number; color: string; r?: number }) {
  return (
    <svg className="orb-ring" viewBox="0 0 70 70" aria-hidden="true">
      <circle cx="35" cy="35" r={r} fill="none" stroke="var(--line)" strokeWidth="4" />
      <motion.circle
        cx="35"
        cy="35"
        r={r}
        fill="none"
        stroke={color}
        strokeWidth="4"
        strokeLinecap="round"
        transform="rotate(-90 35 35)"
        initial={{ pathLength: 0 }}
        animate={{ pathLength: Math.max(valor, 0.001) }}
        transition={{ duration: 1, delay: DIBUJO, ease: EASE }}
      />
    </svg>
  );
}

/** La órbita: el arco del logo O&S con los seis módulos como estaciones */
function Orbita({ p }: { p: Progreso }) {
  const reducir = !!useReducedMotion();
  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const sx = useSpring(mx, { stiffness: 60, damping: 16 });
  const sy = useSpring(my, { stiffness: 60, damping: 16 });
  const inclinacion = useTransform(sy, (v) => 26 + v * 7);
  const giro = useTransform(sx, (v) => v * 9);
  const contraX = useTransform(inclinacion, (v) => -v);
  const contraY = useTransform(giro, (v) => -v);
  const n = MODULOS.length;
  const global = avanceGlobal(p);

  const mover = (e: PointerEvent<HTMLDivElement>) => {
    if (reducir || e.pointerType !== 'mouse') return;
    const r = e.currentTarget.getBoundingClientRect();
    mx.set(((e.clientX - r.left) / r.width - 0.5) * 2);
    my.set(((e.clientY - r.top) / r.height - 0.5) * 2);
  };

  return (
    <div className="orbit orb" onPointerMove={mover} onPointerLeave={() => { mx.set(0); my.set(0); }}>
      <motion.div className="orbit-plane" style={{ rotateX: inclinacion, rotateY: giro }}>
        <svg viewBox="0 0 600 480" aria-hidden="true">
          <defs>
            <linearGradient id="orb-grad" x1="0" y1="1" x2="1" y2="0">
              <stop offset="0" style={{ stopColor: 'var(--arc)', stopOpacity: 0.35 }} />
              <stop offset="0.45" style={{ stopColor: 'var(--arc)' }} />
              <stop offset="1" style={{ stopColor: 'var(--arc-deep)' }} />
            </linearGradient>
            <radialGradient id="orb-disc">
              <stop offset="0" style={{ stopColor: 'var(--arc)', stopOpacity: 0.22 }} />
              <stop offset="1" style={{ stopColor: 'var(--arc)', stopOpacity: 0 }} />
            </radialGradient>
          </defs>
          <ellipse cx={CX} cy={CY} rx={RX * 0.82} ry={RY * 0.62} fill="url(#orb-disc)" />
          <path d={ORBITA} fill="none" stroke="var(--line)" strokeWidth="1.5" strokeDasharray="3 9" />
          <motion.path
            d={ARCO}
            fill="none"
            stroke="url(#orb-grad)"
            strokeWidth="16"
            strokeLinecap="round"
            initial={{ pathLength: reducir ? 1 : 0 }}
            animate={{ pathLength: 1 }}
            transition={{ duration: reducir ? 0 : DIBUJO, ease: [0.45, 0, 0.2, 1] }}
          />
          {!reducir && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: DIBUJO + 0.2, duration: 0.5 }}>
              <g>
                <rect x="-9" y="-11" width="18" height="22" rx="3" fill="var(--sheet)" stroke="var(--ink)" strokeWidth="2" />
                <path d="M-4 -4h8M-4 1h8M-4 6h5" stroke="var(--arc-deep)" strokeWidth="2" strokeLinecap="round" />
                <animateMotion dur="11s" repeatCount="indefinite" path={ARCO} keyPoints="0;1" keyTimes="0;1" calcMode="linear" />
              </g>
            </motion.g>
          )}
        </svg>

        <motion.div className="orb-center" style={{ rotateX: contraX, rotateY: contraY, x: '-50%', y: '-50%', z: 20 }}>
          <motion.strong initial={reducir ? false : { opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: DIBUJO * 0.6, duration: 0.6 }}>
            {Math.round(global * 100)}
            <small>%</small>
          </motion.strong>
          <span>de tu formación</span>
        </motion.div>

        {MODULOS.map((m, i) => {
          const meta = META[m.id] ?? { color: 'var(--arc)', icono: 'maestros', corto: m.titulo };
          const pt = punto(anguloEstacion(i, n));
          const av = avanceModulo(p, m.id);
          const retraso = reducir ? 0 : 0.15 + (DIBUJO * i) / Math.max(1, n - 1);
          return (
            <motion.div
              key={m.id}
              className="orb-st-wrap"
              style={{ left: `${(pt.x / 600) * 100}%`, top: `${(pt.y / 480) * 100}%`, rotateX: contraX, rotateY: contraY, x: '-50%', y: '-50%', z: 46 }}
            >
              <motion.div initial={reducir ? false : { scale: 0, opacity: 0, y: 14 }} animate={{ scale: 1, opacity: 1, y: 0 }} transition={{ delay: retraso, type: 'spring', stiffness: 240, damping: 15 }}>
                <Link to={`/modulo/${m.id}`} className="station orb-st" aria-label={`${meta.corto}: ${Math.round(av * 100)} % hecho`}>
                  <span className="station-dot" style={{ color: meta.color }}>
                    <Anillito valor={av} color={meta.color} />
                    <Icon name={meta.icono} />
                    <i className="orb-n">{i + 1}</i>
                  </span>
                  <span className="station-name">{meta.corto}</span>
                  <span className="station-pct">{Math.round(av * 100)} %</span>
                </Link>
              </motion.div>
            </motion.div>
          );
        })}
      </motion.div>
    </div>
  );
}

/** En el móvil la órbita se despliega en vertical: el arco baja y las estaciones lo siguen */
function OrbitaVertical({ p }: { p: Progreso }) {
  const reducir = !!useReducedMotion();
  const n = MODULOS.length;
  const FILA = 74;
  const xs = MODULOS.map((_, i) => 30 + Math.sin((i / Math.max(1, n - 1)) * Math.PI) * 34);
  const ys = MODULOS.map((_, i) => i * FILA + FILA / 2);
  let d = `M ${xs[0]} ${ys[0] - 26}`;
  d += ` L ${xs[0]} ${ys[0]}`;
  for (let i = 0; i < n - 1; i++) {
    const my = (ys[i] + ys[i + 1]) / 2;
    d += ` C ${xs[i]} ${my}, ${xs[i + 1]} ${my}, ${xs[i + 1]} ${ys[i + 1]}`;
  }
  return (
    <div className="orb-v" style={{ height: n * FILA }}>
      <svg width="100" height={n * FILA} aria-hidden="true">
        <motion.path
          d={d}
          fill="none"
          stroke="var(--arc)"
          strokeWidth="8"
          strokeLinecap="round"
          initial={{ pathLength: reducir ? 1 : 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: reducir ? 0 : 1.4, ease: [0.45, 0, 0.2, 1] }}
        />
      </svg>
      {MODULOS.map((m, i) => {
        const meta = META[m.id] ?? { color: 'var(--arc)', icono: 'maestros', corto: m.titulo };
        const av = avanceModulo(p, m.id);
        return (
          <motion.div
            key={m.id}
            className="orb-v-row"
            style={{ top: ys[i] - 28, left: xs[i] - 28 }}
            initial={reducir ? false : { opacity: 0, x: -16 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: reducir ? 0 : 0.1 + (1.4 * i) / Math.max(1, n - 1), type: 'spring', stiffness: 220, damping: 18 }}
          >
            <Link to={`/modulo/${m.id}`} className="orb-v-link">
              <span className="station-dot" style={{ color: meta.color }}>
                <Anillito valor={av} color={meta.color} />
                <Icon name={meta.icono} />
              </span>
              <span>
                <span className="station-name">
                  {i + 1}. {meta.corto}
                </span>
                <span className="station-pct">{Math.round(av * 100)} % hecho</span>
              </span>
            </Link>
          </motion.div>
        );
      })}
    </div>
  );
}

/** Tarjeta con una leve inclinación 3D que sigue al ratón */
function TiltCard({ to, color, children }: { to: string; color: string; children: ReactNode }) {
  const reducir = useReducedMotion();
  const rx = useMotionValue(0);
  const ry = useMotionValue(0);
  const srx = useSpring(rx, { stiffness: 180, damping: 18 });
  const sry = useSpring(ry, { stiffness: 180, damping: 18 });
  return (
    <motion.div
      className="tilt"
      style={{ rotateX: srx, rotateY: sry, transformPerspective: 900 }}
      onPointerMove={(e) => {
        if (reducir || e.pointerType !== 'mouse') return;
        const r = e.currentTarget.getBoundingClientRect();
        rx.set(-((e.clientY - r.top) / r.height - 0.5) * 8);
        ry.set(((e.clientX - r.left) / r.width - 0.5) * 10);
      }}
      onPointerLeave={() => {
        rx.set(0);
        ry.set(0);
      }}
    >
      <Link to={to} className="mod-card home-card" style={{ ['--mod' as string]: color }}>
        {children}
      </Link>
    </motion.div>
  );
}

export default function Home() {
  const p = useProgreso();
  const loc = useLocation();
  const reducir = useReducedMotion();
  const movil = useMedia('(max-width: 640px)');
  const ini = p.alumno.ini;
  const nombre = p.alumno.nombre.split(/\s+/)[0] ?? '';

  useEffect(() => {
    if (loc.hash !== '#modulos') return;
    const t = setTimeout(() => document.getElementById('modulos')?.scrollIntoView({ behavior: reducir ? 'auto' : 'smooth', block: 'start' }), 350);
    return () => clearTimeout(t);
  }, [loc.hash, reducir]);

  const continuar = useMemo(() => {
    const lista = todosEjercicios();
    return lista.find(({ ejercicio }) => !ejercicioCompletado(p.ejercicios[ejercicio.id])) ?? null;
  }, [p]);

  const global = avanceGlobal(p);
  const empezado = Object.keys(p.ejercicios).length > 0;

  let tabSugerida = '';
  if (continuar) {
    const e = p.ejercicios[continuar.ejercicio.id];
    tabSugerida = !e ? '' : !e.guiado ? '?tab=guiado' : '?tab=test';
  }

  return (
    <div className="home">
      <section className="hero">
        <div className="wrap hero-grid">
          <div className="home-copy">
            <motion.p className="home-hola" initial={reducir ? false : { opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
              {nombre ? `Hola, ${nombre}` : 'Hola'}
              {ini && <span className="home-ini">{ini}</span>}
            </motion.p>
            <motion.h1 initial={reducir ? false : { opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.08, ease: EASE }}>
              Aprende Axional haciéndolo
            </motion.h1>
            <motion.p className="lead" initial={reducir ? false : { opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.16, ease: EASE }}>
              Seis módulos, del tercero al cobro. En cada ejercicio entiendes la idea, lo haces sobre pantallas reales del ERP y lo repites en la demo.
            </motion.p>
            <motion.div className="row-btns home-ctas" initial={reducir ? false : { opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }}>
              {continuar ? (
                <Link className="btn arc" to={`/ejercicio/${continuar.ejercicio.id}${tabSugerida}`}>
                  {empezado ? 'Seguir practicando' : 'Empezar por el primero'}
                </Link>
              ) : (
                <Link className="btn arc" to="/examen">
                  Ir al examen final
                </Link>
              )}
              <a
                className="btn ghost"
                href="#modulos"
                onClick={(e) => {
                  e.preventDefault();
                  document.getElementById('modulos')?.scrollIntoView({ behavior: reducir ? 'auto' : 'smooth' });
                }}
              >
                Ver los módulos
              </a>
            </motion.div>
          </div>
          {movil ? <OrbitaVertical p={p} /> : <Orbita p={p} />}
        </div>
      </section>

      <div className="wrap">
        {continuar && (
          <motion.section
            className="sheet continue"
            style={{ ['--mod' as string]: META[continuar.modulo.id]?.color ?? 'var(--arc)' }}
            initial={reducir ? false : { opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, ease: EASE }}
            aria-labelledby="cont-h"
          >
            <div className="continue-ico" aria-hidden="true">
              <Icon name={META[continuar.modulo.id]?.icono ?? 'maestros'} size={30} />
            </div>
            <div className="continue-body">
              <h2 id="cont-h" className="continue-h">
                {empezado ? 'Continúa donde lo dejaste' : 'Tu primer ejercicio'}
              </h2>
              <p className="continue-t">
                <span className="muted">
                  {META[continuar.modulo.id]?.corto ?? continuar.modulo.titulo} · Ejercicio {continuar.ejercicio.numero}
                </span>
                <strong>{conIni(continuar.ejercicio.titulo, ini)}</strong>
              </p>
              <div className="meter" aria-hidden="true">
                <motion.i initial={{ width: 0 }} animate={{ width: `${avanceEjercicio(p.ejercicios[continuar.ejercicio.id], continuar.ejercicio.checklist.length) * 100}%` }} transition={{ duration: 0.9, delay: 0.3 }} />
              </div>
            </div>
            <Link className="btn arc" to={`/ejercicio/${continuar.ejercicio.id}${tabSugerida}`}>
              {empezado ? 'Continuar' : 'Empezar'}
            </Link>
          </motion.section>
        )}
        {!continuar && MODULOS.length > 0 && (
          <section className="sheet continue">
            <div className="continue-body">
              <h2 className="continue-h">Has completado todos los ejercicios</h2>
              <p className="muted">Ya puedes presentarte al examen final y conseguir tu certificado.</p>
            </div>
            <Link className="btn arc" to="/examen">
              Ir al examen
            </Link>
          </section>
        )}

        <section id="modulos" className="home-mods" aria-labelledby="mods-h">
          <div className="home-sec-head">
            <h2 id="mods-h">Los módulos</h2>
            <p className="muted">En este orden: cada uno usa lo que montaste en el anterior. Llevas un {Math.round(global * 100)} %.</p>
          </div>
          <div className="mod-grid">
            {MODULOS.map((m, i) => {
              const meta = META[m.id] ?? { color: 'var(--arc)', icono: 'maestros', corto: m.titulo };
              const av = avanceModulo(p, m.id);
              const min = m.ejercicios.reduce((s, e) => s + e.duracionMin, 0);
              const hechos = m.ejercicios.filter((e) => ejercicioCompletado(p.ejercicios[e.id])).length;
              return (
                <motion.div
                  key={m.id}
                  initial={reducir ? false : { opacity: 0, y: 30, rotateX: -10 }}
                  whileInView={{ opacity: 1, y: 0, rotateX: 0 }}
                  viewport={{ once: true, margin: '-40px' }}
                  transition={{ delay: (i % 3) * 0.08, duration: 0.5, ease: EASE }}
                  style={{ transformPerspective: 1000 }}
                >
                  <TiltCard to={`/modulo/${m.id}`} color={meta.color}>
                    <span className="arcdeco" style={{ borderTopColor: meta.color, borderRightColor: meta.color }} aria-hidden="true" />
                    <span className="hc-top">
                      <span className="hc-ico" style={{ background: meta.color }}>
                        <Icon name={meta.icono} size={22} />
                      </span>
                      <span className="hc-n" aria-hidden="true">
                        {String(i + 1).padStart(2, '0')}
                      </span>
                    </span>
                    <h3>{m.titulo}</h3>
                    <p className="small muted hc-res">{conIni(m.resumen, ini)}</p>
                    <span className="hc-foot">
                      <span className="small muted">
                        {m.ejercicios.length} ejercicios · {min} min · {hechos} completados
                      </span>
                      <span className="hc-pct">{Math.round(av * 100)} %</span>
                    </span>
                    <span className="meter" aria-hidden="true">
                      <i style={{ width: `${av * 100}%`, background: meta.color }} />
                    </span>
                  </TiltCard>
                </motion.div>
              );
            })}
          </div>
        </section>

        <section className="home-access" aria-label="Más práctica">
          <Link to="/taller" className="acc acc-taller">
            <Icon name="taller" size={30} />
            <span>
              <strong>Taller</strong>
              <span className="small">Simuladores para equivocarte sin miedo: cuadrar un asiento, montar un numerador, seguir un Docflow.</span>
            </span>
          </Link>
          <Link to="/examen" className="acc acc-examen">
            <Icon name="examen" size={30} />
            <span>
              <strong>Examen final</strong>
              <span className="small">Teoría y un caso práctico completo en la demo. Si apruebas, te llevas el certificado de O&S.</span>
            </span>
          </Link>
        </section>
      </div>
    </div>
  );
}
