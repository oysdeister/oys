import { useMemo, useState, type FormEvent } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Icon } from '../components/Icon';
import { copiar } from '../components/examen/util';
import { num2 } from '../lib/texto';
import {
  CLAVE_EXAMINADOR,
  CLAVE_POR_DEFECTO,
  checklistExaminador,
  codigoValidacion,
  consultaSql,
  corregirCampo,
  generarCaso,
  leerActa,
  type Acta,
} from '../lib/examen';
import './examen.css';

/*
  Panel del examinador. Pega el acta (texto o JSON) o solo el código de examen.
  El código de validación = 8 primeros caracteres de SHA-256(clave + código de examen).
  La clave se define al compilar (VITE_CLAVE_EXAMINADOR) y viaja en el bundle: se acepta porque
  es una herramienta interna y lo que de verdad valida es la comprobación en Axional.
*/

const fmt = (v: string | number | undefined) => (v === undefined ? '' : typeof v === 'number' ? num2.format(v) : v);

export default function Examinador() {
  const [entrada, setEntrada] = useState('');
  const [cargado, setCargado] = useState<{ acta: Acta | null; codigo: string } | null>(null);
  const [error, setError] = useState('');
  const [hechos, setHechos] = useState<number[]>([]);
  const [clave, setClave] = useState('');
  const [codVal, setCodVal] = useState('');
  const [errClave, setErrClave] = useState('');
  const [copiado, setCopiado] = useState('');

  const caso = useMemo(() => (cargado ? generarCaso(cargado.codigo) : null), [cargado]);
  const acta = cargado?.acta ?? null;

  const cargar = (e: FormEvent) => {
    e.preventDefault();
    const r = leerActa(entrada);
    if (!r.codigo) {
      setError('No encuentro un acta ni un código de examen (EX-XX-XXXX) en lo que has pegado.');
      setCargado(null);
      return;
    }
    setError('');
    setCargado({ acta: r.acta, codigo: r.codigo });
    setHechos([]);
    setCodVal('');
  };

  const generar = async (e: FormEvent) => {
    e.preventDefault();
    if (!cargado) return;
    if (clave !== CLAVE_EXAMINADOR) {
      setErrClave('Clave incorrecta.');
      setCodVal('');
      return;
    }
    setErrClave('');
    setCodVal(await codigoValidacion(cargado.codigo, clave));
  };

  const copia = async (id: string, t: string) => {
    if (await copiar(t)) {
      setCopiado(id);
      setTimeout(() => setCopiado(''), 2000);
    }
  };

  return (
    <div className="wrap ex-pagina">
      <header className="cert-cab">
        <div>
          <h1>Panel del examinador</h1>
          <p className="muted">Pega el acta que te ha mandado el alumno, o solo su código de examen, para ver lo esperado frente a lo declarado y comprobarlo en Axional.</p>
        </div>
      </header>

      {CLAVE_POR_DEFECTO && (
        <div className="callout problema exm-aviso">
          <b>Clave de examinador por defecto</b>
          Esta versión usa la clave de ejemplo. Cámbiala al compilar con <code className="k">VITE_CLAVE_EXAMINADOR=tu-clave npx vite build</code> o cualquiera que lea el código podrá validar certificados.
        </div>
      )}

      <form className="sheet pad exm-entrada" onSubmit={cargar}>
        <label htmlFor="acta" className="ex-campo-lbl">
          Acta o código de examen
        </label>
        <textarea id="acta" rows={5} value={entrada} onChange={(e) => setEntrada(e.target.value)} placeholder="ACTA DE EXAMEN · … o EX-LM-7K3Q" spellCheck={false} />
        <div className="ex-botones">
          <button className="btn arc">Cargar</button>
          {error && <span className="ex-error-txt">{error}</span>}
        </div>
      </form>

      <AnimatePresence mode="wait">
        {caso && cargado && (
          <motion.div key={cargado.codigo} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="exm-cuerpo">
            <section className="exam-hero exm-resumen">
              <div>
                <span className="ex-kicker">{acta ? acta.alumno.nombre : 'Solo código: no hay datos declarados'}</span>
                <div className="ex-codigo">{caso.codigo}</div>
                <p className="muted small">
                  Proveedor <b>{caso.proveedor}</b> · Cliente <b>{caso.cliente}</b>
                  {acta && (
                    <>
                      {' '}
                      · {new Date(acta.inicio).toLocaleString('es-ES', { dateStyle: 'medium', timeStyle: 'short' })} → {new Date(acta.fin).toLocaleTimeString('es-ES', { timeStyle: 'short' })}
                    </>
                  )}
                </p>
              </div>
              {acta && (
                <div className="exm-notas">
                  <div>
                    <b>{num2.format(acta.nota.teoria)} %</b>
                    <span>teoría</span>
                  </div>
                  <div>
                    <b>{num2.format(acta.nota.practica)} %</b>
                    <span>práctica</span>
                  </div>
                  <div>
                    <b>{num2.format(acta.nota.global)} %</b>
                    <span>global</span>
                  </div>
                  <span className={`chip ${acta.aprobado ? 'ok' : 'warn'}`}>{acta.aprobado ? 'Aprobado por la app' : 'No aprobado'}</span>
                  {acta.sinRequisito && <span className="chip warn">Empezó sin completar los módulos</span>}
                </div>
              )}
            </section>

            <section className="sheet pad">
              <h2>Esperado frente a declarado</h2>
              <p className="muted small">Los números de documento y de asiento no se pueden calcular: la app solo comprueba el formato. Búscalos en Axional.</p>
              {caso.tareas.map((t) => (
                <div key={t.id} className="exm-tarea">
                  <h3>{t.titulo}</h3>
                  <div className="exm-tabla-wrap">
                    <table className="fields exm-tabla">
                      <thead>
                        <tr>
                          <th>Dato</th>
                          <th>Esperado</th>
                          <th>Declarado</th>
                          <th aria-label="Resultado" />
                        </tr>
                      </thead>
                      <tbody>
                        {t.campos.map((c) => {
                          const dec = acta?.declarado[c.id];
                          const v = acta ? corregirCampo(c, dec) : null;
                          return (
                            <tr key={c.id}>
                              <td>{c.etiqueta}</td>
                              <td>{c.esperado !== undefined ? fmt(c.esperado) : <span className="muted">formato {c.patron?.replace(/[\^$\\]/g, '').replace('d{6}', '######').replace('d{1,7}', 'número')}</span>}</td>
                              <td>{acta ? dec || '—' : <span className="muted">—</span>}</td>
                              <td className={`exm-v ${v ?? ''}`}>{v === 'ok' ? (c.esperado === undefined ? 'Buscar' : '✓') : v === 'vacio' ? 'Vacío' : v === 'formato' ? 'Formato' : v === 'mal' ? '✕' : ''}</td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                </div>
              ))}
            </section>

            <div className="exm-cols">
              <section className="sheet pad">
                <h2>Asientos esperados</h2>
                {caso.asientos.map((a) => (
                  <div key={a.titulo} className="exm-asiento">
                    <h3>{a.titulo}</h3>
                    <table className="ledger">
                      <thead>
                        <tr>
                          <th>Cuenta</th>
                          <th>Concepto</th>
                          <th className="num">Debe</th>
                          <th className="num">Haber</th>
                        </tr>
                      </thead>
                      <tbody>
                        {a.lineas.map((l, k) => (
                          <tr key={k}>
                            <td>{l.cuenta}</td>
                            <td>{l.nombre}</td>
                            <td className="num">{l.debe ? num2.format(l.debe) : ''}</td>
                            <td className="num">{l.haber ? num2.format(l.haber) : ''}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                ))}
                <p className="muted small">El proveedor nuevo con relación PRO contabiliza en 40000.00000; el cobro va contra la 57200 de su banco BBVA_{caso.ini}. Si ves una subcuenta distinta, revisa la relación contable del tercero.</p>
              </section>

              <section className="sheet pad">
                <h2>Comprobación en Axional</h2>
                <p className="muted small">
                  Demo <a href="https://nextdemo.geasa.eu" target="_blank" rel="noreferrer">nextdemo.geasa.eu</a>, base TUTORIAL. Marca lo que vayas viendo.
                </p>
                {checklistExaminador(caso).map((txt, k) => {
                  const on = hechos.includes(k);
                  return (
                    <label key={k} className={`check ${on ? 'on' : ''}`}>
                      <input type="checkbox" checked={on} onChange={() => setHechos((h) => (on ? h.filter((x) => x !== k) : [...h, k]))} />
                      <span className="box">{on && <Icon name="check" size={16} stroke={3} />}</span>
                      <span className="check-txt">{txt}</span>
                    </label>
                  );
                })}
                <p className="small" style={{ marginTop: 12 }}>
                  {hechos.length} de {checklistExaminador(caso).length} comprobados
                </p>
              </section>
            </div>

            <section className="sheet pad">
              <div className="exm-sql-cab">
                <h2>Consulta para DBStudio</h2>
                <span className="chip warn">Borrador · columnas por verificar</span>
                <button className="btn sm ghost" onClick={() => copia('sql', consultaSql(caso))}>
                  {copiado === 'sql' ? 'Copiada' : 'Copiar'}
                </button>
              </div>
              <p className="muted small">Orientativa: los nombres de columna son una suposición. Revísalos en el diccionario antes de lanzarla y lanza solo SELECT.</p>
              <pre className="exm-sql">{consultaSql(caso)}</pre>
            </section>

            <form className="sheet pad exm-validar" onSubmit={generar}>
              <h2>Código de validación</h2>
              <p className="muted">Cuando hayas comprobado todo en Axional, escribe tu clave de examinador y dale al alumno el código para validar su certificado.</p>
              <div className="cert-validar-fila">
                <label className="sr-only" htmlFor="clave">
                  Clave de examinador
                </label>
                <input id="clave" type="password" className="field-input" value={clave} onChange={(e) => setClave(e.target.value)} placeholder="Clave de examinador" autoComplete="off" />
                <button className="btn arc" disabled={!clave}>
                  Generar código
                </button>
              </div>
              {errClave && <p className="ex-error-txt">{errClave}</p>}
              <AnimatePresence>
                {codVal && (
                  <motion.div className="exm-codval" initial={{ opacity: 0, scale: 0.9, rotateX: -30 }} animate={{ opacity: 1, scale: 1, rotateX: 0 }} transition={{ type: 'spring', stiffness: 160, damping: 14 }}>
                    <span className="muted small">Código para {cargado.codigo}</span>
                    <b>{codVal}</b>
                    <button type="button" className="btn sm" onClick={() => copia('val', codVal)}>
                      {copiado === 'val' ? 'Copiado' : 'Copiar'}
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
            </form>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
