import { useState } from 'react';
import { motion } from 'framer-motion';
import type { Seccion } from '../../types';
import { conIni } from '../../lib/texto';
import { Icon } from '../Icon';
import { CapturaCampos } from './CapturaCampos';
import { VerMas, partir, useRevela } from './Revela';

const TITULO_AVISO = { problema: 'Ojo', solucion: 'Solución', nota: 'Nota' } as const;
const MAX_IDEAS = 3;
const MAX_CAMPOS = 6;
const MAX_PASOS = 5;

/** Ruta de menú del ERP en forma de migas */
export function RutaMenu({ ruta }: { ruta: string[] | null }) {
  if (!ruta || !ruta.length) return null;
  return (
    <div className="menu-path" aria-label={`Ruta de menú: ${ruta.join(', ')}`}>
      {ruta.map((r, i) => (
        <span key={i}>{r}</span>
      ))}
    </div>
  );
}

/** Párrafos troceados en tarjetas cortas: la primera frase hace de titular */
export function Ideas({ parrafos, ini, max = MAX_IDEAS }: { parrafos: string[]; ini: string; max?: number }) {
  const [todo, setTodo] = useState(false);
  const r = useRevela();
  if (!parrafos.length) return null;
  if (parrafos.length === 1) return <motion.p className="sv-p" {...r(0)}>{conIni(parrafos[0], ini)}</motion.p>;
  const vis = todo ? parrafos : parrafos.slice(0, max);
  return (
    <div className="sv-ideas-wrap">
      <ol className={`sv-ideas${parrafos.length === 2 ? ' dos' : ''}`}>
        {vis.map((p, i) => {
          const { cab, resto } = partir(conIni(p, ini));
          return (
            <motion.li key={i} className="sv-idea" {...r(i)}>
              <span className="sv-idea-n" aria-hidden="true">
                {String(i + 1).padStart(2, '0')}
              </span>
              {cab && <strong>{cab}</strong>}
              <span>{resto}</span>
            </motion.li>
          );
        })}
      </ol>
      {parrafos.length > max && <VerMas abierto={todo} resto={parrafos.length - max} que={parrafos.length - max === 1 ? 'idea más' : 'ideas más'} onClick={() => setTodo((v) => !v)} />}
    </div>
  );
}

/** Contenido de una sección: para qué sirve, ruta, explicación, campos y avisos */
export function SeccionVista({ s, ini, conPasos = false, modulo }: { s: Seccion; ini: string; conPasos?: boolean; modulo?: string }) {
  const t = (x: string) => conIni(x, ini);
  const r = useRevela();
  const [todosCampos, setTodosCampos] = useState(false);
  const [todosPasos, setTodosPasos] = useState(false);
  const campos = todosCampos ? s.campos : s.campos.slice(0, MAX_CAMPOS);
  const pasos = todosPasos ? s.pasos : s.pasos.slice(0, MAX_PASOS);
  return (
    <div className="sec-body">
      {s.paraQueSirve && (
        <motion.div className="callout why sv-why" {...r(0)}>
          <span className="sv-why-ico" aria-hidden="true">
            <Icon name="cerebro" size={20} />
          </span>
          <span>
            <b>¿Para qué sirve?</b>
            {t(s.paraQueSirve)}
          </span>
        </motion.div>
      )}
      {s.ruta && s.ruta.length > 0 && (
        <motion.div className="sec-ruta" {...r(1)}>
          <span className="small muted">Dónde está</span>
          <RutaMenu ruta={s.ruta.map(t)} />
        </motion.div>
      )}
      <Ideas parrafos={s.explicacion} ini={ini} />
      {modulo ? (
        <CapturaCampos s={s} modulo={modulo} ini={ini} />
      ) : (
        s.campos.length > 0 && (
          <motion.div className="sec-campos sv-campos" {...r(0)}>
            <table className="fields">
              <thead>
                <tr>
                  <th scope="col">Campo</th>
                  <th scope="col">Qué significa</th>
                  <th scope="col">Ejemplo</th>
                </tr>
              </thead>
              <tbody>
                {campos.map((c, i) => (
                  <tr key={i}>
                    <td>{t(c.campo)}</td>
                    <td>{t(c.significado)}</td>
                    <td>{c.ejemplo ? <code>{t(c.ejemplo)}</code> : null}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            {s.campos.length > MAX_CAMPOS && (
              <VerMas abierto={todosCampos} resto={s.campos.length - MAX_CAMPOS} que="filas más" onClick={() => setTodosCampos((v) => !v)} />
            )}
          </motion.div>
        )
      )}
      {conPasos && s.pasos.length > 0 && (
        <div>
          <ol className="sv-pasos">
            {pasos.map((p, i) => (
              <motion.li key={i} {...r(i)}>
                <span className="sv-paso-n" aria-hidden="true">
                  {i + 1}
                </span>
                <span>
                  <span>{t(p.texto)}</span>
                  {p.detalle && <small className="muted">{t(p.detalle)}</small>}
                </span>
              </motion.li>
            ))}
          </ol>
          {s.pasos.length > MAX_PASOS && <VerMas abierto={todosPasos} resto={s.pasos.length - MAX_PASOS} que="pasos más" onClick={() => setTodosPasos((v) => !v)} />}
        </div>
      )}
      {s.avisos.length > 0 && (
        <div className={`sv-avisos${s.avisos.length > 1 ? ' varios' : ''}`}>
          {s.avisos.map((a, i) => (
            <motion.div key={i} className={`callout ${a.tipo} sv-aviso`} {...r(i)}>
              <b>
                <Icon name={a.tipo === 'problema' ? 'aviso' : a.tipo === 'solucion' ? 'check' : 'cerebro'} size={16} /> {TITULO_AVISO[a.tipo] ?? 'Nota'}
              </b>
              {t(a.texto)}
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}
