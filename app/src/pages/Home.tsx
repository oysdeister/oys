import { Component, Suspense, lazy, useEffect, useLayoutEffect, useMemo, useRef, useState, type CSSProperties, type MouseEvent, type PointerEvent, type ReactNode } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import {
  motion,
  useAnimationFrame,
  useMotionValue,
  useReducedMotion,
  useSpring,
  useTransform,
  type MotionValue,
} from 'framer-motion';
import { META, MODULOS, todosEjercicios } from '../content';
import type { Modulo } from '../types';
import { avanceEjercicio, ejercicioCompletado, useProgreso, type Progreso } from '../lib/progress';
import { avanceGlobal, avanceModulo } from '../lib/avance';
import { useExamen } from '../lib/examen';
import { conIni } from '../lib/texto';
import { SIMS } from '../sims/registro';
import { Icon } from '../components/Icon';
import { Anillo } from '../components/shell/Anillo';
import { Planeta } from '../components/shell/Planeta';
import { NucleoOrbita } from '../components/shell/NucleoOrbita';
import { FICHAS } from './portadaDatos';
import { hayWebGL, type PlanetaDato } from '../components/escena3d/tipos';
import '../components/escena3d/escena3d.css';
import './aprender.css';
import './portada.css';

const EASE = [0.2, 0.7, 0.2, 1] as const;
const EscenaPortada = lazy(() => import('../components/escena3d/EscenaPortada'));
const metaDe = (m: Modulo) => META[m.id] ?? { color: 'var(--arc)', icono: 'maestros', corto: m.titulo };

/* =====================================================================
   La órbita: un anillo inclinado en 3D con los seis módulos como estaciones.
   Gira sola despacio; se para al pasar por encima o al enfocar una estación
   y se puede arrastrar para girarla (ratón o dedo).
   ===================================================================== */

interface Geo {
  w: number;
  h: number;
  cx: number;
  cy: number;
  rx: number;
  ry: number;
  movil: boolean;
}

function geometria(w: number): Geo {
  const movil = w < 420;
  const rx = w / 2 - (movil ? 46 : 70);
  const ry = rx * (movil ? 0.82 : 0.7);
  const h = Math.round(ry * 2 + (movil ? 120 : 190));
  return { w, h, cx: w / 2, cy: ry + (movil ? 52 : 70), rx, ry, movil };
}

const rad = (g: number) => (g * Math.PI) / 180;
/** Profundidad 0 (detrás) … 1 (delante) para un ángulo del anillo */
const prof = (g: number) => (Math.sin(rad(g)) + 1) / 2;

function Estacion({
  m,
  i,
  n,
  giro,
  geo,
  av,
  reducir,
  onPausa,
}: {
  m: Modulo;
  i: number;
  n: number;
  giro: MotionValue<number>;
  geo: Geo;
  av: number;
  reducir: boolean;
  onPausa: (on: boolean) => void;
}) {
  const meta = metaDe(m);
  const base = 90 + (360 / n) * i; // la primera estación empieza delante, abajo
  const x = useTransform(giro, (g) => geo.cx + geo.rx * Math.cos(rad(g + base)));
  const y = useTransform(giro, (g) => geo.cy + geo.ry * Math.sin(rad(g + base)));
  const scale = useTransform(giro, (g) => 0.64 + 0.36 * prof(g + base));
  const zIndex = useTransform(giro, (g) => Math.round(prof(g + base) * 100));
  const opacity = useTransform(giro, (g) => 0.62 + 0.38 * prof(g + base));
  return (
    <motion.div className="po-st" style={{ x, y, scale, zIndex }}>
      <motion.div
        initial={reducir ? false : { scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: reducir ? 0 : 0.5 + i * 0.12, type: 'spring', stiffness: 220, damping: 14 }}
      >
        <motion.div style={{ opacity }}>
          <span
            className="po-st-link"
            onPointerEnter={(e) => e.pointerType === 'mouse' && onPausa(true)}
            onPointerLeave={(e) => e.pointerType === 'mouse' && onPausa(false)}
            onFocus={() => onPausa(true)}
            onBlur={() => onPausa(false)}
          >
            <Planeta color={meta.color} valor={av} size={geo.movil ? 40 : 60} icono={meta.icono} etiqueta={meta.corto} pct={!geo.movil} to={`/modulo/${m.id}`} />
          </span>
        </motion.div>
      </motion.div>
    </motion.div>
  );
}

/** Ficha de documento que da vueltas por el anillo, más deprisa que las estaciones */
function Cometa({ ang, geo }: { ang: MotionValue<number>; geo: Geo }) {
  const x = useTransform(ang, (g) => geo.cx + geo.rx * Math.cos(rad(g)));
  const y = useTransform(ang, (g) => geo.cy + geo.ry * Math.sin(rad(g)));
  const zIndex = useTransform(ang, (g) => Math.round(prof(g) * 100) + 1);
  const scale = useTransform(ang, (g) => 0.6 + 0.4 * prof(g));
  const rotate = useTransform(ang, (g) => Math.cos(rad(g)) * -14);
  return (
    <motion.div className="po-comet" style={{ x, y, zIndex, scale, rotate }} aria-hidden="true">
      <svg viewBox="0 0 24 30" width="20" height="26">
        <path d="M3 2h12l6 6v20H3z" fill="var(--sheet)" stroke="var(--arc)" strokeWidth="2" strokeLinejoin="round" />
        <path d="M15 2v6h6M7 14h10M7 18h10M7 22h6" fill="none" stroke="var(--arc-deep)" strokeWidth="2" strokeLinecap="round" />
      </svg>
    </motion.div>
  );
}

function Orbita({ p }: { p: Progreso }) {
  const reducir = !!useReducedMotion();
  const caja = useRef<HTMLDivElement>(null);
  const [w, setW] = useState(0);
  const giro = useMotionValue(-8);
  const cometa = useMotionValue(140);
  const pausa = useRef(false);
  const arrastre = useRef<{ x: number; ultimo: number; t: number; movido: boolean; id: number } | null>(null);
  const vel = useRef(0); // grados por milisegundo tras soltar
  const anularClic = useRef(false);
  // Inclinación que sigue al ratón (paralaje suave)
  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const sx = useSpring(mx, { stiffness: 50, damping: 14 });
  const sy = useSpring(my, { stiffness: 50, damping: 14 });
  const rotX = useTransform(sy, (v) => v * -5);
  const rotY = useTransform(sx, (v) => v * 7);

  useLayoutEffect(() => {
    const el = caja.current;
    if (!el) return;
    const medir = () => setW(Math.round(el.getBoundingClientRect().width));
    medir();
    const ro = new ResizeObserver(medir);
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  useAnimationFrame((_, dt) => {
    const paso = Math.min(dt, 50);
    if (!reducir) cometa.set(cometa.get() + paso * 0.045);
    if (arrastre.current) return;
    if (Math.abs(vel.current) > 0.0005) {
      giro.set(giro.get() + vel.current * paso);
      vel.current *= Math.pow(0.94, paso / 16);
      return;
    }
    if (!reducir && !pausa.current) giro.set(giro.get() + paso * 0.004);
  });

  const geo = w ? geometria(w) : null;
  const global = avanceGlobal(p);

  const abajo = (e: PointerEvent<HTMLDivElement>) => {
    if (e.button !== 0) return;
    arrastre.current = { x: e.clientX, ultimo: e.clientX, t: performance.now(), movido: false, id: e.pointerId };
    vel.current = 0;
  };
  const mover = (e: PointerEvent<HTMLDivElement>) => {
    const r = e.currentTarget.getBoundingClientRect();
    if (!reducir && e.pointerType === 'mouse') {
      mx.set(((e.clientX - r.left) / r.width - 0.5) * 2);
      my.set(((e.clientY - r.top) / r.height - 0.5) * 2);
    }
    const a = arrastre.current;
    if (!a || !geo) return;
    const dx = e.clientX - a.ultimo;
    if (!a.movido && Math.abs(e.clientX - a.x) > 6) {
      a.movido = true;
      try {
        e.currentTarget.setPointerCapture(a.id);
      } catch {
        /* sin captura: seguimos igual */
      }
    }
    if (!a.movido) return;
    const ahora = performance.now();
    const grados = (dx / (Math.PI * geo.rx)) * 180;
    giro.set(giro.get() - grados);
    vel.current = -grados / Math.max(8, ahora - a.t);
    a.ultimo = e.clientX;
    a.t = ahora;
  };
  const soltar = () => {
    const a = arrastre.current;
    if (a?.movido) anularClic.current = true;
    if (performance.now() - (a?.t ?? 0) > 80) vel.current = 0;
    arrastre.current = null;
  };
  const clicCaptura = (e: MouseEvent<HTMLDivElement>) => {
    if (anularClic.current) {
      e.preventDefault();
      e.stopPropagation();
      anularClic.current = false;
    }
  };

  // Anillo como trazado (para dibujarlo al entrar)
  const elipse = geo
    ? `M ${geo.cx - geo.rx} ${geo.cy} a ${geo.rx} ${geo.ry} 0 1 0 ${geo.rx * 2} 0 a ${geo.rx} ${geo.ry} 0 1 0 ${-geo.rx * 2} 0`
    : '';

  return (
    <div className="po-orbit-wrap">
      <div
        ref={caja}
        className="po-orbit"
        style={{ height: geo?.h ?? undefined }}
        onPointerDown={abajo}
        onPointerMove={mover}
        onPointerUp={soltar}
        onPointerCancel={soltar}
        onPointerLeave={() => {
          mx.set(0);
          my.set(0);
        }}
        onClickCapture={clicCaptura}
        role="group"
        aria-label="Los módulos de la formación"
      >
        {geo && (
          <motion.div className="po-stage" style={{ rotateX: rotX, rotateY: rotY }}>
            <svg className="po-svg" width={geo.w} height={geo.h} aria-hidden="true">
              <defs>
                <radialGradient id="po-halo">
                  <stop offset="0" stopColor="#5ff0d2" stopOpacity="0.28" />
                  <stop offset="0.6" stopColor="#6fe9ff" stopOpacity="0.07" />
                  <stop offset="1" stopColor="#6fe9ff" stopOpacity="0" />
                </radialGradient>
                <linearGradient id="arcoNeon" x1="0" y1="1" x2="1" y2="0">
                  <stop offset="0" stopColor="#5ff0d2" />
                  <stop offset="0.55" stopColor="#6fe9ff" />
                  <stop offset="1" stopColor="#8b7bff" />
                </linearGradient>
                <filter id="po-glow" x="-20%" y="-20%" width="140%" height="140%">
                  <feGaussianBlur stdDeviation="10" />
                </filter>
              </defs>
              <ellipse cx={geo.cx} cy={geo.cy} rx={geo.rx * 0.9} ry={geo.ry * 0.95} fill="url(#po-halo)" />
              <ellipse className="orbita-guia" cx={geo.cx} cy={geo.cy} rx={geo.rx * 1.16} ry={geo.ry * 1.16} />
              <ellipse className="orbita-guia" cx={geo.cx} cy={geo.cy} rx={geo.rx * 0.74} ry={geo.ry * 0.74} />
              <ellipse cx={geo.cx} cy={geo.cy} rx={geo.rx} ry={geo.ry} fill="none" stroke="#5ff0d2" strokeOpacity="0.4" strokeWidth={geo.movil ? 14 : 20} filter="url(#po-glow)" />
              <motion.path
                d={elipse}
                className="orbita-trazo"
                strokeWidth={geo.movil ? 6 : 8}
                strokeLinecap="round"
                initial={{ pathLength: reducir ? 1 : 0 }}
                animate={{ pathLength: 1 }}
                transition={{ duration: reducir ? 0 : 1.6, ease: [0.45, 0, 0.2, 1] }}
              />
            </svg>

            {/* Núcleo: el avance total, con el arco del logo O&S */}
            <motion.div
              className="po-core"
              style={{ left: geo.cx, top: geo.cy, zIndex: 50, x: '-50%', y: '-50%' }}
              initial={reducir ? false : { opacity: 0, scale: 0.6 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.25, duration: 0.8, ease: EASE }}
            >
              <NucleoOrbita valor={global} size={Math.round(Math.min(geo.ry * 0.95, 230))} />
            </motion.div>

            {!reducir && <Cometa ang={cometa} geo={geo} />}

            {MODULOS.map((m, i) => (
              <Estacion
                key={m.id}
                m={m}
                i={i}
                n={MODULOS.length}
                giro={giro}
                geo={geo}
                av={avanceModulo(p, m.id)}
                reducir={reducir}
                onPausa={(on) => {
                  pausa.current = on;
                }}
              />
            ))}
          </motion.div>
        )}
      </div>
      <p className="po-hint" aria-hidden="true">
        <svg width="18" height="12" viewBox="0 0 18 12" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
          <path d="M5 2 1 6l4 4M13 2l4 4-4 4M1 6h16" />
        </svg>
        Arrastra para girar · toca un módulo para entrar
      </p>
    </div>
  );
}

/* =====================================================================
   Tarjetas de módulo
   ===================================================================== */

function TiltCard({ to, color, hecho, children }: { to: string; color: string; hecho: boolean; children: ReactNode }) {
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
        rx.set(-((e.clientY - r.top) / r.height - 0.5) * 7);
        ry.set(((e.clientX - r.left) / r.width - 0.5) * 9);
      }}
      onPointerLeave={() => {
        rx.set(0);
        ry.set(0);
      }}
    >
      <Link to={to} className={`ax-card neon-mod po-card${hecho ? ' done' : ''}`} style={{ ['--mod' as string]: color } as CSSProperties}>
        {children}
      </Link>
    </motion.div>
  );
}

/* =====================================================================
   Escena 3D con respaldo: sin WebGL o si falla, la órbita SVG
   ===================================================================== */

class Respaldo extends Component<{ alternativa: ReactNode; children: ReactNode }, { fallo: boolean }> {
  state = { fallo: false };
  static getDerivedStateFromError() {
    return { fallo: true };
  }
  componentDidCatch() {
    /* la órbita SVG toma el relevo */
  }
  render() {
    return this.state.fallo ? this.props.alternativa : this.props.children;
  }
}

function useMedia(q: string) {
  const [si, setSi] = useState(() => window.matchMedia(q).matches);
  useEffect(() => {
    const m = window.matchMedia(q);
    const f = () => setSi(m.matches);
    m.addEventListener('change', f);
    return () => m.removeEventListener('change', f);
  }, [q]);
  return si;
}

function EscenaHero({ p, activo }: { p: Progreso; activo?: string }) {
  const reducir = !!useReducedMotion();
  const centrada = useMedia('(max-width: 1100px)');
  const navegar = useNavigate();
  const [webgl] = useState(hayWebGL);
  const planetas: PlanetaDato[] = useMemo(
    () =>
      MODULOS.map((m) => {
        const meta = metaDe(m);
        return { id: m.id, nombre: meta.corto, color: meta.color.startsWith('#') ? meta.color : '#5fe3c6', icono: meta.icono, valor: avanceModulo(p, m.id) };
      }),
    [p],
  );
  const svg = (
    <div className="po3-svg">
      <Orbita p={p} />
    </div>
  );
  if (!webgl) return svg;
  return (
    <Respaldo alternativa={svg}>
      <Suspense fallback={<div className="po3-cargando" aria-hidden="true" />}>
        <EscenaPortada planetas={planetas} global={avanceGlobal(p)} activo={activo} reducir={reducir} centrada={centrada} onIr={(id) => navegar(`/modulo/${id}`)} />
      </Suspense>
    </Respaldo>
  );
}

/* =====================================================================
   Portada
   ===================================================================== */

export default function Home() {
  const p = useProgreso();
  const ex = useExamen();
  const loc = useLocation();
  const reducir = useReducedMotion();
  const ini = p.alumno.ini;
  const nombre = p.alumno.nombre.split(/\s+/)[0] ?? '';

  useEffect(() => {
    if (loc.hash !== '#modulos') return;
    const t = setTimeout(() => document.getElementById('modulos')?.scrollIntoView({ behavior: reducir ? 'auto' : 'smooth', block: 'start' }), 350);
    return () => clearTimeout(t);
  }, [loc.hash, reducir]);

  const continuar = useMemo(() => {
    const lista = todosEjercicios();
    // Primero el que tienes a medias; si no hay, el primero sin completar en el orden de la formación
    const aMedias = lista.find(({ ejercicio }) => {
      const e = p.ejercicios[ejercicio.id];
      return !!e && !ejercicioCompletado(e) && (e.guiado || e.pasos.length > 0 || e.test !== null || e.demo.length > 0);
    });
    return aMedias ?? lista.find(({ ejercicio }) => !ejercicioCompletado(p.ejercicios[ejercicio.id])) ?? null;
  }, [p]);

  const empezado = Object.keys(p.ejercicios).length > 0;
  const totalEj = todosEjercicios().length;
  const hechosEj = todosEjercicios().filter(({ ejercicio }) => ejercicioCompletado(p.ejercicios[ejercicio.id])).length;
  const simsHechos = SIMS.filter((s) => p.sims[s.id]).length;

  let tabSugerida = '';
  let pasoSugerido = 'Empieza por el concepto y el recorrido guiado.';
  if (continuar) {
    const e = p.ejercicios[continuar.ejercicio.id];
    if (e && !e.guiado) {
      tabSugerida = '?tab=guiado';
      pasoSugerido = 'Te queda terminar el recorrido guiado.';
    } else if (e) {
      tabSugerida = '?tab=test';
      pasoSugerido = 'Ya hiciste el guiado: te falta aprobar el test.';
    }
  }
  const colCont = continuar ? metaDe(continuar.modulo).color : 'var(--arc)';
  const avCont = continuar ? avanceEjercicio(p.ejercicios[continuar.ejercicio.id], continuar.ejercicio.checklist.length) : 1;
  const activo = continuar?.modulo.id;

  const aparece = (d: number) =>
    reducir ? {} : { initial: { opacity: 0, y: 22 }, animate: { opacity: 1, y: 0 }, transition: { duration: 0.8, delay: d, ease: EASE } };

  const examenEstado = ex.aprobado
    ? { t: 'Aprobado. Descarga tu certificado.', to: '/certificado', b: 'Ver certificado' }
    : ex.actual && !ex.actual.fin
      ? { t: 'Tienes un examen a medias.', to: '/examen', b: 'Retomar el examen' }
      : { t: 'Teoría y un caso práctico completo en la demo.', to: '/examen', b: 'Ir al examen' };

  // El módulo en curso va primero y en grande; el resto, en su orden
  const ordenMods = activo ? [...MODULOS.filter((m) => m.id === activo), ...MODULOS.filter((m) => m.id !== activo)] : MODULOS;
  const verRuta = (e: MouseEvent) => {
    e.preventDefault();
    document.getElementById('modulos')?.scrollIntoView({ behavior: reducir ? 'auto' : 'smooth' });
  };

  return (
    <div className="home po po3">
      <section className="po3-hero" aria-labelledby="po3-h1">
        <div className="po3-escena">
          <EscenaHero p={p} activo={activo} />
        </div>
        <div className="po3-copy">
          <motion.p className="home-hola" {...aparece(0.9)}>
            {nombre ? `Hola, ${nombre}` : 'Hola'}
            {ini && <span className="home-ini">{ini}</span>}
          </motion.p>
          <motion.h1 id="po3-h1" className="po3-h1" {...aparece(1.05)}>
            Aprende Axional haciéndolo
          </motion.h1>
          <motion.p className="po3-lead" {...aparece(1.25)}>
            Seis módulos, del tercero al cobro. Entiendes la idea, la practicas sobre pantallas reales del ERP y la repites en la demo.
          </motion.p>
          <motion.div className="po3-ctas" {...aparece(1.4)}>
            {continuar ? (
              <Link className="btn arc lg po3-cta" to={`/ejercicio/${continuar.ejercicio.id}${tabSugerida}`}>
                {empezado ? 'Seguir' : 'Empezar'}
              </Link>
            ) : (
              <Link className="btn arc lg po3-cta" to="/examen">
                Ir al examen
              </Link>
            )}
            <a className="btn ghost lg po3-cta" href="#modulos" onClick={verRuta}>
              Ver ruta
            </a>
          </motion.div>
        </div>
        <p className="po3-hint" aria-hidden="true">
          Toca un planeta para entrar en su módulo
        </p>
      </section>

      <div className="wrap">
        {/* Seguir donde lo dejaste */}
        <section className="po-next po3-next" aria-label="Tu siguiente paso">
          {continuar ? (
            <motion.div
              className="glass neon-mod po-cont po3-cont"
              style={{ ['--mod' as string]: colCont } as CSSProperties}
              initial={reducir ? false : { opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 1.6, ease: EASE }}
            >
              <div className="po-cont-ico" aria-hidden="true">
                <Icon name={metaDe(continuar.modulo).icono} size={30} />
              </div>
              <div className="po-cont-body">
                <h2 className="po-cont-h">{empezado ? 'Continúa donde lo dejaste' : 'Tu primer ejercicio'}</h2>
                <p className="po-cont-t">{conIni(continuar.ejercicio.titulo, ini)}</p>
                <p className="po-cont-mod">
                  {metaDe(continuar.modulo).corto}, ejercicio {continuar.ejercicio.numero}. {pasoSugerido}
                </p>
                <div className="ax-bar lg po-cont-bar" aria-hidden="true">
                  <i style={{ width: `${Math.max(avCont * 100, 2)}%` }} />
                </div>
              </div>
              <Link className="btn arc po-cont-btn" to={`/ejercicio/${continuar.ejercicio.id}${tabSugerida}`}>
                {empezado ? 'Continuar' : 'Empezar'}
              </Link>
            </motion.div>
          ) : (
            <div className="glass neon-mod po-cont po-cont-fin po3-cont">
              <div className="po-cont-body">
                <h2 className="po-cont-h">Has completado todos los ejercicios</h2>
                <p className="po-cont-t">Ya puedes presentarte al examen final.</p>
              </div>
              <Link className="btn arc po-cont-btn" to="/examen">
                Ir al examen
              </Link>
            </div>
          )}
        </section>

        <section id="modulos" className="po-mods" aria-labelledby="mods-h">
          <div className="po-sec-head">
            <h2 id="mods-h">Los módulos</h2>
            <p className="muted">
              Hazlos en este orden: cada uno usa lo que montaste en el anterior. Llevas {hechosEj} de {totalEj} ejercicios.
            </p>
          </div>
          <div className="po3-grid">
            {ordenMods.map((m) => {
              const i = MODULOS.indexOf(m);
              const meta = metaDe(m);
              const ficha = FICHAS[m.id];
              const av = avanceModulo(p, m.id);
              const min = m.ejercicios.reduce((s, e) => s + e.duracionMin, 0);
              const hechos = m.ejercicios.filter((e) => ejercicioCompletado(p.ejercicios[e.id])).length;
              const hecho = hechos === m.ejercicios.length && hechos > 0;
              const grande = m.id === activo;
              return (
                <div key={m.id} className={`po3-celda${grande ? ' grande' : ''}`}>
                  <TiltCard to={`/modulo/${m.id}`} color={meta.color} hecho={hecho}>
                    <span className="po-card-top">
                      <span className="ax-card-icon">
                        <Icon name={meta.icono} size={grande ? 28 : 24} />
                      </span>
                      {grande && <span className="po3-encurso">{av > 0 ? 'En curso' : 'Empieza aquí'}</span>}
                      <span className="ax-card-num" aria-hidden="true">
                        {String(i + 1).padStart(2, '0')}
                      </span>
                    </span>
                    <h3>{m.titulo}</h3>
                    <p className="po-card-frase">{ficha ? ficha.frase : conIni(m.resumen, ini)}</p>
                    {grande && ficha && (
                      <>
                        <p className="po3-aprendes-h">Al terminar sabrás</p>
                        <ul className="po3-aprendes">
                          {ficha.aprendes.map((t) => (
                            <li key={t}>{conIni(t, ini)}</li>
                          ))}
                        </ul>
                      </>
                    )}
                    {grande && ficha && (
                      <ol className="po3-ruta" aria-label={ficha.recorrido}>
                        {ficha.circuito.map((c) => (
                          <li key={c.t}>{c.t}</li>
                        ))}
                      </ol>
                    )}
                    <span className="po-card-foot">
                      <span className="po-card-meta">
                        {hechos} de {m.ejercicios.length} ejercicios, {min} min
                      </span>
                      {hecho ? (
                        <span className="ax-check on" aria-label="Módulo completado">
                          <Icon name="check" size={18} />
                        </span>
                      ) : (
                        <Anillo valor={av} size={grande ? 72 : 46} grosor={grande ? 6 : 4} className="po-card-ring" texto={`${Math.round(av * 100)}`} />
                      )}
                    </span>
                    <div className="ax-bar mod po-card-bar" aria-hidden="true">
                      <i style={{ width: `${av * 100}%` }} />
                    </div>
                  </TiltCard>
                </div>
              );
            })}
          </div>
        </section>

        <section className="po-puertas" aria-label="Practicar y demostrar">
          <Link to="/taller" className="po-door po-door-taller">
            <span className="po-door-ico" aria-hidden="true">
              <Icon name="taller" size={26} />
            </span>
            <span className="po-door-txt">
              <strong>Taller</strong>
              <span>Simuladores para equivocarte sin miedo.</span>
            </span>
            <span className="po-door-dots" aria-label={`${simsHechos} de ${SIMS.length} simuladores superados`}>
              {SIMS.map((s) => (
                <i key={s.id} className={p.sims[s.id] ? 'on' : ''} title={s.titulo} />
              ))}
              <b>
                {simsHechos}/{SIMS.length}
              </b>
            </span>
          </Link>
          <Link to={examenEstado.to} className="po-door po-door-examen">
            <span className="po-door-ico" aria-hidden="true">
              <Icon name="examen" size={26} />
            </span>
            <span className="po-door-txt">
              <strong>Examen final</strong>
              <span>{examenEstado.t}</span>
            </span>
            <span className="btn arc sm po-door-cta">{examenEstado.b}</span>
          </Link>
        </section>
      </div>
    </div>
  );
}
