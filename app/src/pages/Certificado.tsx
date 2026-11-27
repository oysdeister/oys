import { useEffect, useRef, useState, type FormEvent } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { CertificadoSVG, type EstadoCert } from '../components/examen/CertificadoSVG';
import { svgAPng } from '../components/examen/exportar';
import { copiar, fechaLarga } from '../components/examen/util';
import { Icon } from '../components/Icon';
import { useProgreso } from '../lib/progress';
import { actaTexto, compruebaValidacion, crearActa, examen, useExamen } from '../lib/examen';
import { num2 } from '../lib/texto';
import './examen.css';
import './certificado.css';

export default function Certificado() {
  const p = useProgreso();
  const { aprobado } = useExamen();
  const svgEstatico = useRef<SVGSVGElement>(null);
  const [selloKey, setSelloKey] = useState('inicial');
  const [soloSello, setSoloSello] = useState(false);
  const [codigo, setCodigo] = useState('');
  const [aviso, setAviso] = useState<{ tipo: 'ok' | 'mal'; texto: string } | null>(null);
  const [exportando, setExportando] = useState(false);
  const [copiado, setCopiado] = useState(false);

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

  const retardoSello = soloSello ? 0.25 : 1.2;

  return (
    <div className="wrap ex-pagina cert-pagina">
      <header className="cert-cab exg-cab">
        <div>
          <p className="exg-kicker">Practicando Axional Deister VNext · certificado</p>
          <h1>Tu certificado</h1>
          <p className="exg-lead">
            {estado === 'muestra' && 'Así será tu certificado cuando apruebes el examen final.'}
            {estado === 'pendiente' && 'Has aprobado. Falta que el examinador compruebe tu trabajo en Axional y te dé el código de validación.'}
            {estado === 'validado' && `Validado el ${fechaLarga(aprobado!.validacion!.fecha)}. Enhorabuena.`}
          </p>
        </div>
        <span className={`chip ${estado === 'validado' ? 'ok' : 'warn'}`}>{estado === 'validado' ? 'Validado' : estado === 'pendiente' ? 'Pendiente de validar' : 'Muestra'}</span>
      </header>

      <figure className={`cert-figura estado-${estado}`}>
        <div className="cert-papel">
          <CertificadoSVG {...datos} animar selloKey={selloKey} selloRetardo={retardoSello} />
        </div>
        <figcaption>
          <b>Código {codExamen}</b> · {estado === 'muestra' ? 'muestra sin valor hasta que apruebes el examen final' : estado === 'pendiente' ? 'pendiente de validar por el examinador' : `validado con el código ${aprobado?.validacion?.codigo ?? ''}`}
        </figcaption>
      </figure>

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
      <AnimatePresence>
        {aviso && (
          <motion.p className={`callout ${aviso.tipo === 'ok' ? 'solucion' : 'problema'} cert-aviso`} role="status" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
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
