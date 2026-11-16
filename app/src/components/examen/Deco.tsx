import { useEffect, useId, useMemo, useRef, useState } from 'react';
import { motion, useMotionValue, useReducedMotion, useSpring, useTransform } from 'framer-motion';
import { anillo, hipotrocoide } from './guilloche';
import { useContador } from './util';
import { NucleoOrbita } from '../shell/NucleoOrbita';

/** El arco del logo O&S */
const ARCO_LOGO = 'M40 330 C 30 140, 170 30, 380 52';

const lim = (v: number) => Math.max(-1, Math.min(1, v));

/**
 * Órbita guilloché de la portada del examen, en tres capas a distinta profundidad
 * (roseta al fondo, aros en medio, arco y cifra delante) con una inclinación 3D
 * ligera que sigue al puntero. En táctil solo se mueve con la orientación del
 * dispositivo si el navegador la da sin pedir permiso.
 */
export function OrbitaExamen({ codigo }: { codigo: string }) {
  const reducir = useReducedMotion();
  const ref = useRef<HTMLDivElement>(null);
  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const muelle = { stiffness: 90, damping: 16, mass: 0.6 };
  const rotY = useSpring(useTransform(mx, [-1, 1], [-16, 16]), muelle);
  const rotX = useSpring(useTransform(my, [-1, 1], [12, -12]), muelle);
  const brilloX = useTransform(rotY, [-16, 16], ['30%', '70%']);
  const brilloY = useTransform(rotX, [12, -12], ['30%', '70%']);

  useEffect(() => {
    if (reducir) return;
    const fino = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
    if (fino) {
      const mover = (e: PointerEvent) => {
        if (e.pointerType !== 'mouse' || !ref.current) return;
        const r = ref.current.getBoundingClientRect();
        const ancho = Math.max(320, window.innerWidth / 2);
        mx.set(lim((e.clientX - (r.left + r.width / 2)) / ancho));
        my.set(lim((e.clientY - (r.top + r.height / 2)) / (window.innerHeight / 2)));
      };
      const salir = () => {
        mx.set(0);
        my.set(0);
      };
      window.addEventListener('pointermove', mover, { passive: true });
      document.documentElement.addEventListener('mouseleave', salir);
      return () => {
        window.removeEventListener('pointermove', mover);
        document.documentElement.removeEventListener('mouseleave', salir);
      };
    }
    // Táctil: orientación del móvil solo si no exige permiso (iOS lo exige: ahí, quieta)
    const DO = (window as unknown as { DeviceOrientationEvent?: { requestPermission?: unknown } }).DeviceOrientationEvent;
    if (!DO || typeof DO.requestPermission === 'function') return;
    const girar = (e: DeviceOrientationEvent) => {
      if (e.gamma === null || e.beta === null) return;
      mx.set(lim(e.gamma / 35));
      my.set(lim((e.beta - 45) / 35));
    };
    window.addEventListener('deviceorientation', girar);
    return () => window.removeEventListener('deviceorientation', girar);
  }, [reducir, mx, my]);

  const trazos = useMemo(
    () => ({
      roseta: hipotrocoide(200, 200, 100, 37, 74, 1.55, 1600),
      aros: [0, 1, 2, 3].map((k) => anillo(200, 200, 172, 5, 30, (k * Math.PI) / 2, 600)),
    }),
    [],
  );

  const id = useId().replace(/:/g, '');
  const [ancho, setAncho] = useState(320);
  useEffect(() => {
    const el = ref.current;
    if (!el || typeof ResizeObserver === 'undefined') return;
    const ro = new ResizeObserver(([e]) => setAncho(e.contentRect.width));
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  return (
    <div className="ex-orbita-escena" ref={ref}>
      <motion.div
        className="ex-orbita-3d"
        style={reducir ? undefined : { rotateX: rotX, rotateY: rotY }}
        initial={reducir ? false : { opacity: 0, scale: 0.86, rotateZ: -8 }}
        animate={{ opacity: 1, scale: 1, rotateZ: 0 }}
        transition={{ duration: 1.1, ease: [0.2, 0.7, 0.2, 1], delay: 0.15 }}
      >
        {/* Fondo: halo, órbitas guía y roseta */}
        <motion.div
          className="ex-orbita-capa ex-orbita-fondo"
          style={reducir ? undefined : { ['--bx' as string]: brilloX, ['--by' as string]: brilloY }}
        >
          <svg viewBox="0 0 400 400" className="ex-orbita" aria-hidden="true">
            <motion.g
              style={{ transformOrigin: '200px 200px' }}
              animate={reducir ? undefined : { rotate: 360 }}
              transition={{ duration: 160, repeat: Infinity, ease: 'linear' }}
            >
              <ellipse cx="200" cy="200" rx="196" ry="150" className="orbita-guia" transform="rotate(-18 200 200)" />
              <ellipse cx="200" cy="200" rx="150" ry="186" className="orbita-guia" transform="rotate(24 200 200)" />
              <path d={trazos.roseta} fill="none" stroke="#5ff0d2" strokeWidth="0.6" opacity="0.32" />
            </motion.g>
          </svg>
        </motion.div>
        {/* Medio: aros guilloché */}
        <div className="ex-orbita-capa ex-orbita-medio">
          <svg viewBox="0 0 400 400" className="ex-orbita" aria-hidden="true">
            {trazos.aros.map((d, i) => (
              <motion.path
                key={i}
                d={d}
                fill="none"
                stroke={i % 2 ? '#8b7bff' : '#6fe9ff'}
                strokeWidth="0.7"
                opacity={i % 2 ? 0.35 : 0.5}
                initial={reducir ? false : { pathLength: 0 }}
                animate={{ pathLength: 1 }}
                transition={{ duration: 2.4, delay: 0.35 + 0.2 * i, ease: 'easeInOut' }}
              />
            ))}
          </svg>
        </div>
        {/* Delante: el arco del logo en neón */}
        <div className="ex-orbita-capa ex-orbita-frente">
          <svg viewBox="0 0 400 400" className="ex-orbita" aria-hidden="true">
            <defs>
              <linearGradient id={`neon-${id}`} x1="0" y1="1" x2="1" y2="0">
                <stop offset="0%" stopColor="#5ff0d2" />
                <stop offset="45%" stopColor="#6fe9ff" />
                <stop offset="100%" stopColor="#8b7bff" />
              </linearGradient>
              <filter id={`difuso-${id}`} x="-20%" y="-20%" width="140%" height="140%">
                <feGaussianBlur stdDeviation="9" />
              </filter>
            </defs>
            <motion.path
              d={ARCO_LOGO}
              fill="none"
              stroke={`url(#neon-${id})`}
              strokeWidth="26"
              strokeLinecap="round"
              opacity="0.45"
              filter={`url(#difuso-${id})`}
              initial={reducir ? false : { pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{ duration: 1.6, delay: 0.5, ease: [0.6, 0, 0.2, 1] }}
            />
            <motion.path
              d={ARCO_LOGO}
              stroke={`url(#neon-${id})`}
              strokeWidth="8"
              className="ex-orbita-arco"
              initial={reducir ? false : { pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{ duration: 1.6, delay: 0.5, ease: [0.6, 0, 0.2, 1] }}
            />
            <motion.circle
              cx="380"
              cy="52"
              r="7"
              className="ex-orbita-astro"
              initial={reducir ? false : { opacity: 0, scale: 0 }}
              animate={{ opacity: 1, scale: 1 }}
              style={{ transformOrigin: '380px 52px' }}
              transition={{ delay: 2, duration: 0.5 }}
            />
          </svg>
        </div>
        {/* Núcleo de cristal con el 80 % */}
        <motion.div
          className="ex-orbita-capa ex-orbita-nucleo"
          initial={reducir ? false : { opacity: 0, scale: 0.6 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.9, ease: [0.2, 0.8, 0.2, 1] }}
        >
          <NucleoOrbita valor={0.8} etiqueta="para aprobar cada parte" size={Math.round(Math.max(150, ancho * 0.46))} />
          {codigo && <span className="ex-orbita-cod">{codigo}</span>}
        </motion.div>
      </motion.div>
    </div>
  );
}

/** Tiempos de la secuencia del resultado (segundos): teoría, práctica, veredicto */
export const SECUENCIA = { teoria: 0.5, practica: 1.5, veredicto: 2.6, dur: 1.1 };

const C = 160; // centro
const R_TEO = 136;
const R_PRA = 104;
const GROSOR = 20;

function Arco({ r, valor, color, retraso, filtro }: { r: number; valor: number; color: string; retraso: number; filtro: string }) {
  const reducir = useReducedMotion();
  if (valor <= 0.004) return null; // con 0 % no se pinta nada (ni el punto del remate)
  const props = {
    cx: C,
    cy: C,
    r,
    fill: 'none',
    stroke: color,
    strokeLinecap: 'round' as const,
    transform: `rotate(-90 ${C} ${C})`,
    initial: reducir ? false : { pathLength: 0, opacity: 0 },
    animate: { pathLength: Math.min(1, valor), opacity: 1 },
    // la opacidad entra con el trazo: sin ella, el remate redondo pinta un punto antes de empezar
    transition: { pathLength: { duration: SECUENCIA.dur, ease: [0.2, 0.7, 0.2, 1] as const, delay: retraso }, opacity: { duration: 0.12, delay: retraso } },
  };
  return (
    <>
      <g opacity={0.55}>
        <motion.circle {...props} strokeWidth={GROSOR} filter={`url(#${filtro})`} />
      </g>
      <motion.circle {...props} strokeWidth={GROSOR} />
    </>
  );
}

/** Anillos concéntricos del resultado: teoría (fuera) y práctica (dentro), con la marca del 80 % y la nota global en el centro */
export function AnillosResultado({
  teoria,
  practica,
  global,
  aprobado,
  umbral = 0.8,
}: {
  teoria: number;
  practica: number;
  global: number;
  aprobado: boolean;
  umbral?: number;
}) {
  const reducir = useReducedMotion();
  const id = useId().replace(/:/g, '');
  const filtro = `halo-${id}`;
  const nota = useContador(global * 100, { duracion: 0.9, retraso: SECUENCIA.veredicto - 0.4 });
  const okTeo = teoria >= umbral;
  const okPra = practica >= umbral;
  const ang = umbral * 2 * Math.PI;
  const punto = (r: number) => ({ x: C + r * Math.sin(ang), y: C - r * Math.cos(ang) });
  const t1 = punto(R_PRA - GROSOR / 2 - 6);
  const t2 = punto(R_TEO + GROSOR / 2 + 6);
  const lbl = punto(R_TEO + GROSOR / 2 + 12);
  return (
    <svg viewBox="-48 -24 416 368" className="ex-anillos-svg" role="img" aria-label={`Teoría ${Math.round(teoria * 100)} %, práctica ${Math.round(practica * 100)} %, nota global ${Math.round(global * 100)} %`}>
      <defs>
        <filter id={filtro} x="-30%" y="-30%" width="160%" height="160%">
          <feGaussianBlur stdDeviation="9" />
        </filter>
        <linearGradient id={`ok-${id}`} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#5ff0d2" />
          <stop offset="50%" stopColor="#6fe9ff" />
          <stop offset="100%" stopColor="#8b7bff" />
        </linearGradient>
        <linearGradient id={`ok2-${id}`} x1="1" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#8b7bff" />
          <stop offset="100%" stopColor="#5ff0d2" />
        </linearGradient>
        <linearGradient id={`ko-${id}`} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#ff8a80" />
          <stop offset="100%" stopColor="#ff5f8f" />
        </linearGradient>
        <radialGradient id={`fondo-${id}`}>
          <stop offset="0%" stopColor={aprobado ? '#5ff0d2' : '#ff8a80'} stopOpacity="0.3" />
          <stop offset="70%" stopColor={aprobado ? '#5ff0d2' : '#ff8a80'} stopOpacity="0" />
        </radialGradient>
      </defs>
      <motion.circle
        cx={C}
        cy={C}
        r={R_PRA - GROSOR}
        fill={`url(#fondo-${id})`}
        initial={reducir ? false : { opacity: 0, scale: 0.6 }}
        animate={{ opacity: 1, scale: 1 }}
        style={{ transformOrigin: `${C}px ${C}px` }}
        transition={{ delay: SECUENCIA.veredicto, duration: 0.8 }}
      />
      <circle cx={C} cy={C} r={R_TEO} fill="none" stroke="rgba(160,200,255,0.14)" strokeWidth={GROSOR} />
      <circle cx={C} cy={C} r={R_PRA} fill="none" stroke="rgba(160,200,255,0.14)" strokeWidth={GROSOR} />
      <Arco r={R_TEO} valor={teoria} color={okTeo ? `url(#ok-${id})` : `url(#ko-${id})`} retraso={SECUENCIA.teoria} filtro={filtro} />
      <Arco r={R_PRA} valor={practica} color={okPra ? `url(#ok2-${id})` : `url(#ko-${id})`} retraso={SECUENCIA.practica} filtro={filtro} />
      {/* Marca del 80 % */}
      <line x1={t1.x} y1={t1.y} x2={t2.x} y2={t2.y} stroke="#0b1220" strokeWidth="7" strokeLinecap="round" opacity="0.85" />
      <line x1={t1.x} y1={t1.y} x2={t2.x} y2={t2.y} stroke="#f5f7fa" strokeWidth="2.5" strokeLinecap="round" />
      <text x={lbl.x} y={lbl.y + 5} textAnchor="end" fill="#f5f7fa" fontSize="16" fontWeight="700" fontFamily="var(--text)">
        {Math.round(umbral * 100)} %
      </text>
      <motion.g initial={reducir ? false : { opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: SECUENCIA.veredicto - 0.5, duration: 0.4 }}>
        <text x={C} y={C + 10} textAnchor="middle" fontFamily="var(--display)" fontWeight="800" fontSize="54" fill={aprobado ? '#5ff0d2' : '#ff8a80'} className="ex-anillos-cifra" style={{ fontVariantNumeric: 'tabular-nums' }}>
          {Math.round(nota)}
          <tspan fontSize="26" dx="2">%</tspan>
        </text>
        <text x={C} y={C + 36} textAnchor="middle" fontSize="13" fill="#e8edf4" opacity="0.75">
          nota global
        </text>
      </motion.g>
    </svg>
  );
}

/** Fila de leyenda de un anillo con la cifra que cuenta */
export function LeyendaAnillo({ valor, nombre, detalle, color, retraso }: { valor: number; nombre: string; detalle: string; color: string; retraso: number }) {
  const reducir = useReducedMotion();
  const n = useContador(valor * 100, { duracion: SECUENCIA.dur, retraso });
  return (
    <motion.div className="ex-leyenda" initial={reducir ? false : { opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: retraso, duration: 0.4 }}>
      <i style={{ background: color }} aria-hidden="true" />
      <span>{nombre}</span>
      <b>{Math.round(n)} %</b>
      <small>{detalle}</small>
    </motion.div>
  );
}
