import { useEffect, useRef, useState, type FormEvent, type PointerEvent } from 'react';
import { Link } from 'react-router-dom';
import { motion, useMotionValue, useReducedMotion, useSpring, useTransform, AnimatePresence, type MotionStyle } from 'framer-motion';
import confetti from 'canvas-confetti';
import { CertificadoSVG, type EstadoCert } from '../components/examen/CertificadoSVG';
import { svgAPng } from '../components/examen/exportar';
import { copiar, fechaLarga } from '../components/examen/util';
import { Icon } from '../components/Icon';
import { useProgreso } from '../lib/progress';
import { actaTexto, compruebaValidacion, crearActa, examen, useExamen } from '../lib/examen';
import { num2 } from '../lib/texto';
import './examen.css';

const MARCA = ['#4fbfa5', '#2a9c83', '#1f2738', '#f2a93b', '#ffffff'];

export default function Certificado() {
  const p = useProgreso();
  const { aprobado } = useExamen();
  const reducir = useReducedMotion();
  const svgRef = useRef<SVGSVGElement>(null);
  const [selloKey, setSelloKey] = useState('inicial');
  const [codigo, setCodigo] = useState('');
  const [aviso, setAviso] = useState<{ tipo: 'ok' | 'mal'; texto: string } | null>(null);
  const [exportando, setExportando] = useState(false);
  const [copiado, setCopiado] = useState(false);

  const estado: EstadoCert = !aprobado ? 'muestra' : aprobado.validacion ? 'validado' : 'pendiente';
  const nombre = aprobado?.alumno.nombre || p.alumno.nombre || 'Tu nombre';
  const nota = aprobado?.resultado ? `${num2.format(aprobado.resultado.global * 100)} %` : '— %';
  const fecha = fechaLarga(aprobado?.fin ?? new Date().toISOString());
  const codExamen = aprobado?.codigo ?? `EX-${p.alumno.ini || 'CL'}-····`;

  /* Tilt 3D y brillo holográfico: ratón o inclinación del móvil */
  const mx = useMotionValue(0.5);
  const my = useMotionValue(0.5);
  const sx = useSpring(mx, { stiffness: 120, damping: 18 });
  const sy = useSpring(my, { stiffness: 120, damping: 18 });
  const rotY = useTransform(sx, [0, 1], [-7, 7]);
  const rotX = useTransform(sy, [0, 1], [6, -6]);
  const holoX = useTransform(sx, (v) => `${v * 100}%`);
  const holoY = useTransform(sy, (v) => `${v * 100}%`);
  const holoAng = useTransform(sx, (v) => `${v * 220 + 40}deg`);

  useEffect(() => {
    if (reducir) return;
    const ori = (e: DeviceOrientationEvent) => {
      if (e.gamma == null || e.beta == null) return;
      mx.set(Math.min(1, Math.max(0, 0.5 + e.gamma / 50)));
      my.set(Math.min(1, Math.max(0, 0.5 + (e.beta - 40) / 50)));
    };
    window.addEventListener('deviceorientation', ori);
    return () => window.removeEventListener('deviceorientation', ori);
  }, [reducir, mx, my]);

  const mover = (e: PointerEvent<HTMLDivElement>) => {
    if (reducir || e.pointerType === 'touch') return;
    const r = e.currentTarget.getBoundingClientRect();
    mx.set((e.clientX - r.left) / r.width);
    my.set((e.clientY - r.top) / r.height);
  };
  const salir = () => {
    mx.set(0.5);
    my.set(0.5);
  };

  const celebrar = () => {
    if (estado !== 'validado' || reducir) return;
    const o = { colors: MARCA, disableForReducedMotion: true };
    void confetti({ ...o, particleCount: 120, spread: 100, startVelocity: 42, origin: { x: 0.78, y: 0.62 } });
    setTimeout(() => void confetti({ ...o, particleCount: 70, angle: 60, spread: 60, origin: { x: 0, y: 0.75 } }), 220);
    setTimeout(() => void confetti({ ...o, particleCount: 70, angle: 120, spread: 60, origin: { x: 1, y: 0.75 } }), 380);
  };

  const validar = async (e: FormEvent) => {
    e.preventDefault();
    if (!aprobado) return;
    if (await compruebaValidacion(aprobado.codigo, codigo)) {
      examen.validar(codigo.trim().toUpperCase());
      setSelloKey(`v${Date.now()}`);
      setAviso({ tipo: 'ok', texto: 'Código correcto. Tu certificado ya está validado.' });
    } else {
      setAviso({ tipo: 'mal', texto: 'Ese código no corresponde a tu examen. Revísalo con el examinador.' });
    }
  };

  const png = async () => {
    if (!svgRef.current) return;
    setExportando(true);
    try {
      await svgAPng(svgRef.current, `certificado-axional-${codExamen}.png`);
    } catch {
      setAviso({ tipo: 'mal', texto: 'Este navegador no ha podido crear la imagen. Usa «Imprimir o guardar PDF».' });
    } finally {
      setExportando(false);
    }
  };

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
        <span className={`chip ${estado === 'validado' ? 'ok' : 'warn'}`}>
          {estado === 'validado' ? 'Validado' : estado === 'pendiente' ? 'Pendiente de validar' : 'Muestra'}
        </span>
      </header>

      <div className="cert-escena" onPointerMove={mover} onPointerLeave={salir}>
        <motion.div className="cert-tarjeta" style={reducir ? undefined : { rotateX: rotX, rotateY: rotY }} initial={reducir ? false : { opacity: 0, y: 40, rotateX: 18 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.9, ease: [0.2, 0.7, 0.2, 1] }}>
          <div className="cert-print">
            <CertificadoSVG
              svgRef={svgRef}
              nombre={nombre}
              codigo={codExamen}
              fecha={fecha}
              nota={nota}
              estado={estado}
              validacion={aprobado?.validacion?.codigo}
              animar
              selloKey={selloKey}
              onSello={celebrar}
            />
          </div>
          {!reducir && estado !== 'muestra' && (
            <motion.div
              className={`cert-holo ${estado === 'validado' ? 'fuerte' : ''}`}
              aria-hidden="true"
              style={{ '--hx': holoX, '--hy': holoY, '--ha': holoAng } as unknown as MotionStyle}
            />
          )}
        </motion.div>
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
