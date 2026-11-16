import { useEffect, useRef, useState, type FormEvent, type PointerEvent } from 'react';
import { Link } from 'react-router-dom';
import { motion, useAnimationControls, useMotionValue, useReducedMotion, useSpring, useTransform, AnimatePresence, type MotionStyle } from 'framer-motion';
import confetti from 'canvas-confetti';
import { CertificadoSVG, GEOM, type EstadoCert } from '../components/examen/CertificadoSVG';
import { svgAPng } from '../components/examen/exportar';
import { copiar, fechaLarga } from '../components/examen/util';
import { Icon } from '../components/Icon';
import { useProgreso } from '../lib/progress';
import { actaTexto, compruebaValidacion, crearActa, examen, useExamen } from '../lib/examen';
import { num2 } from '../lib/texto';
import './examen.css';
import './certificado.css';

const MARCA = ['#4fbfa5', '#2a9c83', '#1f2738', '#9fe3d2', '#ffffff'];
const pct = (v: number, total: number) => `${(v / total) * 100}%`;
const limita = (v: number) => Math.min(1, Math.max(0, v));

type Giro = 'apagado' | 'activo' | 'denegado';
interface DOEConPermiso {
  requestPermission?: () => Promise<'granted' | 'denied'>;
}

export default function Certificado() {
  const p = useProgreso();
  const { aprobado } = useExamen();
  const reducir = !!useReducedMotion();
  const svgEstatico = useRef<SVGSVGElement>(null);
  const [ronda, setRonda] = useState(0);
  const [selloKey, setSelloKey] = useState('inicial');
  const [soloSello, setSoloSello] = useState(false);
  const [codigo, setCodigo] = useState('');
  const [aviso, setAviso] = useState<{ tipo: 'ok' | 'mal'; texto: string } | null>(null);
  const [exportando, setExportando] = useState(false);
  const [copiado, setCopiado] = useState(false);
  const [giro, setGiro] = useState<Giro>('apagado');
  const [tactil] = useState(() => typeof window !== 'undefined' && 'DeviceOrientationEvent' in window && navigator.maxTouchPoints > 0 && !!window.matchMedia?.('(pointer: coarse)').matches);

  const estado: EstadoCert = !aprobado ? 'muestra' : aprobado.validacion ? 'validado' : 'pendiente';
  const nombre = aprobado?.alumno.nombre || p.alumno.nombre || 'Tu nombre';
  const nota = aprobado?.resultado ? `${num2.format(aprobado.resultado.global * 100)} %` : '— %';
  const fecha = fechaLarga(aprobado?.fin ?? new Date().toISOString());
  const codExamen = aprobado?.codigo ?? `EX-${p.alumno.ini || 'CL'}-····`;
  const datos = { nombre, codigo: codExamen, fecha, nota, estado, validacion: aprobado?.validacion?.codigo };

  // Las reglas de impresión solo valen mientras esta página está abierta
  useEffect(() => {
    document.documentElement.classList.add('cert-activo');
    return () => document.documentElement.classList.remove('cert-activo');
  }, []);

  /* Tilt 3D con muelle: ratón, arrastre táctil o inclinación del móvil */
  const mx = useMotionValue(0.5);
  const my = useMotionValue(0.5);
  const sx = useSpring(mx, { stiffness: 140, damping: 16, mass: 0.6 });
  const sy = useSpring(my, { stiffness: 140, damping: 16, mass: 0.6 });
  const rotY = useTransform(sx, [0, 1], [-11, 11]);
  const rotX = useTransform(sy, [0, 1], [9, -9]);
  const luzX = useTransform(sx, (v) => `${v * 100}%`);
  const luzY = useTransform(sy, (v) => `${v * 100}%`);
  const tono = useTransform([sx, sy], ([a, b]: number[]) => `${a * 280 + b * 140}deg`);
  const desliz = useTransform([sx, sy], ([a, b]: number[]) => `${50 + (a - 0.5) * 160}% ${50 + (b - 0.5) * 220}%`);
  const sombraX = useTransform(sx, [0, 1], [26, -26]);
  const sombraY = useTransform(sy, [0, 1], [-8, 14]);
  const sacudida = useAnimationControls();
  const arrastre = useRef<{ id: number } | null>(null);

  useEffect(() => {
    if (reducir || giro !== 'activo') return;
    let base: { b: number; g: number } | null = null;
    const ori = (e: DeviceOrientationEvent) => {
      if (e.gamma == null || e.beta == null) return;
      if (!base) base = { b: e.beta, g: e.gamma };
      mx.set(limita(0.5 + (e.gamma - base.g) / 40));
      my.set(limita(0.5 + (e.beta - base.b) / 40));
    };
    window.addEventListener('deviceorientation', ori);
    return () => {
      window.removeEventListener('deviceorientation', ori);
      mx.set(0.5);
      my.set(0.5);
    };
  }, [reducir, giro, mx, my]);

  const activarGiro = async () => {
    if (giro === 'activo') return setGiro('apagado');
    const DOE = (window as unknown as { DeviceOrientationEvent?: DOEConPermiso }).DeviceOrientationEvent;
    try {
      if (DOE && typeof DOE.requestPermission === 'function') {
        const r = await DOE.requestPermission();
        if (r !== 'granted') return setGiro('denegado');
      }
      setGiro('activo');
    } catch {
      setGiro('denegado');
    }
  };

  const tarjeta = useRef<HTMLDivElement>(null);
  /** Posición relativa a la tarjeta (sin girar): el punto que mira la luz */
  const caja = (e: PointerEvent<HTMLElement>) => (tarjeta.current?.parentElement ?? e.currentTarget).getBoundingClientRect();
  const apunta = (e: PointerEvent<HTMLElement>, r: DOMRect) => {
    mx.set(limita((e.clientX - r.left) / r.width));
    my.set(limita((e.clientY - r.top) / r.height));
  };
  const mover = (e: PointerEvent<HTMLDivElement>) => {
    if (reducir || giro === 'activo') return;
    if (e.pointerType === 'mouse') return apunta(e, caja(e));
    if (arrastre.current?.id === e.pointerId) apunta(e, caja(e));
  };
  const empieza = (e: PointerEvent<HTMLDivElement>) => {
    if (reducir || e.pointerType === 'mouse' || giro === 'activo') return;
    if (!tarjeta.current?.parentElement?.contains(e.target as Node)) return;
    arrastre.current = { id: e.pointerId };
    e.currentTarget.setPointerCapture(e.pointerId);
    apunta(e, caja(e));
  };
  const suelta = (e: PointerEvent<HTMLDivElement>) => {
    if (arrastre.current?.id === e.pointerId) arrastre.current = null;
    if (giro === 'activo') return;
    mx.set(0.5);
    my.set(0.5);
  };

  const impacto = () => {
    if (reducir) return;
    void sacudida.start({ x: [0, -7, 6, -3, 2, 0], y: [0, 5, -3, 1, 0], rotateZ: [0, -0.5, 0.35, -0.15, 0], transition: { duration: 0.5, ease: 'easeOut' } });
    const o = { colors: MARCA, disableForReducedMotion: true, zIndex: 60 };
    void confetti({ ...o, particleCount: 110, spread: 90, startVelocity: 38, scalar: 0.9, origin: { x: 0.78, y: 0.6 } });
    setTimeout(() => void confetti({ ...o, particleCount: 60, angle: 60, spread: 58, origin: { x: 0, y: 0.78 } }), 200);
    setTimeout(() => void confetti({ ...o, particleCount: 60, angle: 120, spread: 58, origin: { x: 1, y: 0.78 } }), 360);
  };

  const repetir = () => {
    setSoloSello(false);
    setRonda((r) => r + 1);
  };

  const validar = async (e: FormEvent) => {
    e.preventDefault();
    if (!aprobado) return;
    if (await compruebaValidacion(aprobado.codigo, codigo)) {
      examen.validar(codigo.trim().toUpperCase());
      setSoloSello(true);
      setSelloKey(`v${Date.now()}`);
      setAviso({ tipo: 'ok', texto: 'Código correcto. Tu certificado ya está validado.' });
    } else {
      setAviso({ tipo: 'mal', texto: 'Ese código no corresponde a tu examen. Revísalo con el examinador.' });
    }
  };

  const png = async () => {
    if (!svgEstatico.current) return;
    setExportando(true);
    try {
      await svgAPng(svgEstatico.current, `certificado-axional-${codExamen}.png`);
    } catch {
      setAviso({ tipo: 'mal', texto: 'Este navegador no ha podido crear la imagen. Usa «Imprimir o guardar PDF».' });
    } finally {
      setExportando(false);
    }
  };

  const vars = { '--hx': luzX, '--hy': luzY, '--ha': tono, '--hp': desliz } as unknown as MotionStyle;
  const capa = (x: number, y: number, w: number, h: number) => ({ left: pct(x, GEOM.W), top: pct(y, GEOM.H), width: pct(w, GEOM.W), height: pct(h, GEOM.H) });
  const S = GEOM.sello;
  const B = GEOM.banda;
  const retardoSello = soloSello ? 0.25 : 2.9;

  return (
    <div className="wrap ex-pagina cert-pagina">
      <header className="cert-cab">
        <div>
          <h1>Tu certificado</h1>
          <p className="muted">
            {estado === 'muestra' && 'Así será tu certificado cuando apruebes el examen final.'}
            {estado === 'pendiente' && 'Has aprobado. Falta que el examinador compruebe tu trabajo en Axional y te dé el código de validación.'}
            {estado === 'validado' && `Validado el ${fechaLarga(aprobado!.validacion!.fecha)}. Enhorabuena.`}
          </p>
        </div>
        <span className={`chip ${estado === 'validado' ? 'ok' : 'warn'}`}>{estado === 'validado' ? 'Validado' : estado === 'pendiente' ? 'Pendiente de validar' : 'Muestra'}</span>
      </header>

      <div
        className={`cert-escena estado-${estado} ${reducir ? 'quieto' : ''}`}
        onPointerMove={mover}
        onPointerDown={empieza}
        onPointerUp={suelta}
        onPointerCancel={suelta}
        onPointerLeave={(e) => e.pointerType === 'mouse' && suelta(e)}
      >
        {!reducir && (
          <motion.div
            key={`suelo-${ronda}`}
            className="cert-suelo"
            aria-hidden="true"
            style={{ x: sombraX, y: sombraY }}
            initial={{ opacity: 0, scaleX: 0.55 }}
            animate={{ opacity: 1, scaleX: 1 }}
            transition={{ duration: 1.1, ease: [0.2, 0.7, 0.2, 1] }}
          />
        )}
        <motion.div
          key={`entrada-${ronda}`}
          className="cert-entrada"
          initial={reducir ? false : { opacity: 0, rotateX: 64, y: 110, z: -320, scale: 0.92 }}
          animate={{ opacity: 1, rotateX: 0, y: 0, z: 0, scale: 1 }}
          transition={{ duration: 1.15, ease: [0.16, 0.84, 0.3, 1], opacity: { duration: 0.5 } }}
        >
          <motion.div className="cert-sacudida" animate={sacudida}>
            <motion.div
              ref={tarjeta}
              className={`cert-tarjeta ${reducir ? '' : 'con-holo'}`}
              style={reducir ? undefined : { rotateX: rotX, rotateY: rotY, ...vars }}
            >
              <div className="cert-base" aria-hidden="true" />
              <div className="cert-papel">
                <CertificadoSVG key={`svg-${ronda}`} {...datos} animar selloKey={selloKey} selloRetardo={retardoSello} onImpacto={impacto} />
              </div>
              {!reducir && (
                <>
                  {estado !== 'muestra' && <div className="cert-holo" aria-hidden="true" />}
                  {estado !== 'muestra' && (
                    <motion.div
                      key={`banda-${ronda}`}
                      className="cert-holo-banda"
                      aria-hidden="true"
                      style={capa(B.x, B.y, B.w, B.h)}
                      initial={{ opacity: 0, scaleY: 0.2 }}
                      animate={{ opacity: estado === 'validado' ? 1 : 0.42, scaleY: 1 }}
                      transition={{ delay: 1.3, duration: 0.8, ease: [0.2, 0.7, 0.2, 1] }}
                    >
                      <span>O&amp;S</span>
                    </motion.div>
                  )}
                  {estado === 'validado' && (
                    <motion.div
                      key={`sello-${ronda}-${selloKey}`}
                      className="cert-holo-sello"
                      aria-hidden="true"
                      style={capa(S.x - S.r, S.y - S.r, S.r * 2, S.r * 2)}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: retardoSello + 0.55, duration: 0.6 }}
                    />
                  )}
                  <div className="cert-brillo" aria-hidden="true" />
                </>
              )}
            </motion.div>
          </motion.div>
        </motion.div>
      </div>

      {/* Copia estática: es la que se imprime y la que se exporta a imagen, siempre en su estado final */}
      <div className="cert-print cert-impresion" aria-hidden="true">
        <CertificadoSVG {...datos} animar={false} svgRef={svgEstatico} />
      </div>

      <div className="cert-acciones">
        <button className="btn" onClick={() => window.print()} disabled={estado === 'muestra'}>
          <Icon name="examen" size={18} /> Imprimir o guardar PDF
        </button>
        <button className="btn ghost" onClick={png} disabled={estado === 'muestra' || exportando}>
          {exportando ? 'Creando imagen…' : 'Descargar imagen'}
        </button>
        {estado === 'muestra' && (
          <Link className="btn arc" to="/examen">
            Ir al examen
          </Link>
        )}
      </div>
      {!reducir && (
        <div className="cert-acciones cert-acciones-3d">
          <button className="btn ghost sm" onClick={repetir}>
            Ver la animación otra vez
          </button>
          {tactil && (
            <button className={`btn ghost sm ${giro === 'activo' ? 'activo' : ''}`} onClick={activarGiro} aria-pressed={giro === 'activo'}>
              {giro === 'activo' ? 'Dejar de mover' : 'Mover con el móvil'}
            </button>
          )}
          <p className="cert-pista muted">
            {giro === 'denegado'
              ? 'El navegador no ha dado permiso para leer la inclinación. Arrastra el certificado con el dedo.'
              : giro === 'activo'
                ? 'Inclina el móvil para ver el holograma.'
                : tactil
                  ? 'Arrastra el certificado con el dedo para ver el holograma.'
                  : 'Mueve el ratón sobre el certificado para ver el holograma.'}
          </p>
        </div>
      )}

      <AnimatePresence>
        {aviso && (
          <motion.p className={`callout ${aviso.tipo === 'ok' ? 'solucion' : 'problema'} cert-aviso`} role="status" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
            {aviso.texto}
          </motion.p>
        )}
      </AnimatePresence>

      {estado === 'pendiente' && aprobado && (
        <div className="cert-validar-grid">
          <form className="sheet pad cert-validar" onSubmit={validar}>
            <h2>Validar con el código del examinador</h2>
            <p className="muted">Te lo da el examinador cuando ha comprobado en Axional lo que registraste. Son 8 caracteres.</p>
            <div className="cert-validar-fila">
              <label className="sr-only" htmlFor="cod-val">
                Código de validación
              </label>
              <input
                id="cod-val"
                className="field-input cert-cod"
                value={codigo}
                onChange={(e) => setCodigo(e.target.value.toUpperCase())}
                placeholder="A1B2C3D4"
                maxLength={12}
                autoComplete="off"
                spellCheck={false}
                autoCapitalize="characters"
              />
              <button className="btn arc" disabled={codigo.trim().length < 8}>
                Validar
              </button>
            </div>
          </form>
          <section className="sheet pad">
            <h2>¿Aún no has mandado el acta?</h2>
            <p className="muted">Cópiala y envíasela al examinador con tu código {aprobado.codigo}.</p>
            <button
              className="btn ghost"
              onClick={async () => {
                setCopiado(await copiar(actaTexto(crearActa(aprobado))));
                setTimeout(() => setCopiado(false), 2200);
              }}
            >
              {copiado ? 'Acta copiada' : 'Copiar acta'}
            </button>
          </section>
        </div>
      )}
    </div>
  );
}
