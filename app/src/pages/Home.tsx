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
import { META, MODULOS } from '../content';
import type { Modulo } from '../types';
import { ejercicioCompletado, useProgreso, type Progreso } from '../lib/progress';
import { avanceGlobal, avanceModulo } from '../lib/avance';
import { useExamen } from '../lib/examen';
import { conIni } from '../lib/texto';
import { bloqueQueToca, bloquesObligatorios, numeroBloque, pasoQueToca, PASOS } from '../lib/ruta';
import { useNotas } from '../erp/practicas';
import { SIMS } from '../sims/registro';
import { Icon } from '../components/Icon';
import { Planeta } from '../components/shell/Planeta';
import { NucleoOrbita } from '../components/shell/NucleoOrbita';
import { FICHAS } from './portadaDatos';
import { hayWebGL, type PlanetaDato } from '../components/escena3d/tipos';
import '../components/escena3d/escena3d.css';
import './aprender.css';
import './portada.css';
import './ruta.css';

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
  // Solo se rotulan las estaciones de delante: con 11 módulos las de detrás se pisaban
  const umbral = geo.movil ? 0.95 : 0.45;
  const lbl = useTransform(giro, (g) => (prof(g + base) >= umbral ? 1 : 0));
  return (
    <motion.div className="po-st" style={{ x, y, scale, zIndex, ['--lbl' as string]: lbl }}>
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

/** Escena 3D de planetas de la v4. La v5.1 usa una cabecera sobria; se deja disponible. */
export function EscenaHero({ p, activo }: { p: Progreso; activo?: string }) {
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
  const notasErp = useNotas();

  useEffect(() => {
    if (loc.hash !== '#modulos') return;
    const t = setTimeout(() => document.getElementById('modulos')?.scrollIntoView({ behavior: reducir ? 'auto' : 'smooth', block: 'start' }), 350);
    return () => clearTimeout(t);
  }, [loc.hash, reducir]);

  // Lo que toca: el primer bloque obligatorio sin terminar, en el orden del curso, y su paso
  const continuar = useMemo(() => {
    for (const m of MODULOS) {
      const b = bloqueQueToca(p, m);
      if (b) return { modulo: m, ejercicio: b };
    }
    return null;
  }, [p]);
  const empezado = Object.keys(p.ejercicios).length > 0;
  const simsHechos = SIMS.filter((s) => p.sims[s.id]).length;
  const pasoCont = continuar ? pasoQueToca(p, continuar.ejercicio, notasErp) : 'concepto';
  const enlaceCont = continuar ? `/ejercicio/${continuar.ejercicio.id}${pasoCont === 'concepto' ? '' : `?tab=${pasoCont}`}` : '/examen';
  const nMod = continuar ? MODULOS.indexOf(continuar.modulo) + 1 : 0;
  const nBloque = continuar ? numeroBloque(continuar.modulo, continuar.ejercicio.id) : 0;
  const textoCta = !continuar
    ? 'Ir al examen final'
    : !empezado
      ? 'Empezar por el módulo 1'
      : `Seguir: ${metaDe(continuar.modulo).corto}, bloque ${nBloque}`;
  const activo = continuar?.modulo.id;


  const examenEstado = ex.aprobado
    ? { t: 'Aprobado. Descarga tu certificado.', to: '/certificado', b: 'Ver certificado' }
    : ex.actual && !ex.actual.fin
      ? { t: 'Tienes un examen a medias.', to: '/examen', b: 'Retomar el examen' }
      : { t: 'Teoría y un caso práctico completo en la demo.', to: '/examen', b: 'Ir al examen' };

  return (
    <div className="home po po3">
      <header className="wrap hm-cab">
        <p className="hm-hola">{nombre ? `Hola, ${nombre}.` : 'Hola.'}</p>
        <h1>Formación en Axional Deister VNext</h1>
        <p className="hm-lead">
          {MODULOS.length} módulos, en orden, del tercero a los activos fijos. En cada bloque lees la idea, lo haces paso a paso sobre pantallas reales del ERP y lo repites en la demo.
        </p>
        <Link className="btn arc lg" to={enlaceCont}>
          {textoCta}
        </Link>
        {continuar && empezado && (
          <p className="hm-sigue">
            Módulo {nMod}, bloque {nBloque}: {conIni(continuar.ejercicio.titulo, ini)}. Paso: {PASOS.find((x) => x.id === pasoCont)?.label}.
          </p>
        )}
      </header>

      <div className="wrap">
        <section className="hm-como" aria-labelledby="como-h">
          <h2 id="como-h">Cómo funciona</h2>
          <ol className="hm-como-l">
            <li>
              <b>{MODULOS.length} módulos, en orden.</b> Cada uno usa lo que montaste en el anterior.
            </li>
            <li>
              <b>Cada módulo tiene bloques.</b> Un bloque es una tarea del ERP. Mejor en orden, pero puedes entrar en cualquiera.
            </li>
            <li>
              <b>Cada bloque, siempre en el mismo orden:</b> Concepto → Guiado → De memoria (opcional) → Test → Demo real. Algunos añaden una Práctica antes de la Demo real.
            </li>
          </ol>
          <p>
            La <b>Práctica</b> es un ERP simulado dentro de esta web, que se corrige solo. La <b>Demo real</b> es el ERP de demostración, en otra pestaña.
          </p>
          <p className="muted">
            <b>Antes de empezar:</b> haz el curso de contabilidad (con su examen) y después el de introducción al ERP. Esta plataforma es solo de Axional.
          </p>
        </section>

        <section id="modulos" className="hm-ruta" aria-labelledby="mods-h">
          <h2 id="mods-h">Tu ruta</h2>
          <ol className="hm-mods">
            {MODULOS.map((m, i) => {
              const meta = metaDe(m);
              const ficha = FICHAS[m.id];
              const av = avanceModulo(p, m.id);
              const bloques = bloquesObligatorios(m);
              const min = bloques.reduce((s2, e) => s2 + e.duracionMin, 0);
              const hechos = bloques.filter((e) => ejercicioCompletado(p.ejercicios[e.id])).length;
              const hecho = hechos === bloques.length && hechos > 0;
              const toca = m.id === activo;
              return (
                <li key={m.id} className={`${hecho ? 'hecho' : ''}${toca ? ' toca' : ''}`} style={{ ['--mod' as string]: meta.color } as CSSProperties}>
                  <Link to={`/modulo/${m.id}`} className="hm-mod">
                    <span className="hm-n" aria-hidden="true">
                      {hecho ? <Icon name="check" size={18} stroke={3} /> : i + 1}
                    </span>
                    <span className="hm-ico" aria-hidden="true">
                      <Icon name={meta.icono} size={20} />
                    </span>
                    <span className="hm-txt">
                      <strong>{meta.corto}</strong>
                      <span>{ficha ? conIni(ficha.frase, ini) : conIni(m.resumen, ini)}</span>
                    </span>
                    <span className="hm-meta">
                      {toca ? <em>{av > 0 ? 'En curso' : 'Empieza aquí'}</em> : null}
                      <span>
                        {hechos}/{bloques.length} bloques · {Math.round(min / 60)} h
                      </span>
                      <span className="hm-barra" aria-hidden="true">
                        <i style={{ width: `${av * 100}%` }} />
                      </span>
                    </span>
                  </Link>
                </li>
              );
            })}
          </ol>
        </section>

        <section className="hm-mas" aria-labelledby="mas-h">
          <h2 id="mas-h">Además</h2>
          <ul>
            <li>
              <Link to="/taller">Taller</Link>: simuladores para repasar lo que más cuesta al principio ({simsHechos} de {SIMS.length} superados).
            </li>
            <li>
              <Link to={examenEstado.to}>Examen final</Link>: {examenEstado.t}
            </li>
          </ul>
        </section>
      </div>
    </div>
  );
}
