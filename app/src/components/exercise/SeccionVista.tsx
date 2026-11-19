import { useState } from 'react';
import { Glosa } from '../Glosario';
import { motion } from 'framer-motion';
import type { Seccion } from '../../types';
import { conIni } from '../../lib/texto';
import { Icon } from '../Icon';
import { CapturaCampos } from './CapturaCampos';
import { VerMas, partir, useRevela } from './Revela';

const TITULO_AVISO = { problema: 'Ojo', solucion: 'Solución', nota: 'Nota' } as const;
const MAX_IDEAS = 3;

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
  if (parrafos.length === 1) return <motion.p className="sv-p" {...r(0)}><Glosa>{conIni(parrafos[0], ini)}</Glosa></motion.p>;
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
              <span><Glosa>{resto}</Glosa></span>
            </motion.li>
          );
        })}
      </ol>
      {parrafos.length > max && <VerMas abierto={todo} resto={parrafos.length - max} que={parrafos.length - max === 1 ? 'idea más' : 'ideas más'} onClick={() => setTodo((v) => !v)} />}
    </div>
  );
}

/** Contenido de una sección, como lectura: para qué sirve, dónde está, explicación, campos y avisos */
export function SeccionVista({ s, ini, conPasos = false, modulo, destacar = false }: { s: Seccion; ini: string; conPasos?: boolean; modulo?: string; destacar?: boolean }) {
  const t = (x: string) => conIni(x, ini);
  const iDestacado = destacar ? s.avisos.findIndex((a) => a.tipo === 'problema') : -1;
  return (
    <div className="sec-body lect">
      {s.paraQueSirve && (
        <p className="lect-lead">
          <Glosa>{t(s.paraQueSirve)}</Glosa>
        </p>
      )}
      {s.ruta && s.ruta.length > 0 && (
        <p className="lect-donde">
          En el ERP: <b>{s.ruta.map(t).join(' › ')}</b>
        </p>
      )}
      {s.explicacion.length > 0 && (
        <ul className="lect-lista">
          {s.explicacion.map((p, i) => (
            <li key={i}>
              <Glosa>{t(p)}</Glosa>
            </li>
          ))}
        </ul>
      )}
      {modulo ? (
        <CapturaCampos s={s} modulo={modulo} ini={ini} />
      ) : (
        s.campos.length > 0 && (
          <table className="fields lect-campos">
            <thead>
              <tr>
                <th scope="col">Campo</th>
                <th scope="col">Qué significa</th>
                <th scope="col">Ejemplo</th>
              </tr>
            </thead>
            <tbody>
              {s.campos.map((c, i) => (
                <tr key={i}>
                  <td>{t(c.campo)}</td>
                  <td>
                    <Glosa>{t(c.significado)}</Glosa>
                  </td>
                  <td>{c.ejemplo ? <code>{t(c.ejemplo)}</code> : null}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )
      )}
      {conPasos && s.pasos.length > 0 && (
        <ol className="lect-pasos">
          {s.pasos.map((p, i) => (
            <li key={i}>
              <Glosa>{t(p.texto)}</Glosa>
              {p.detalle && (
                <small className="muted">
                  {' '}
                  <Glosa>{t(p.detalle)}</Glosa>
                </small>
              )}
            </li>
          ))}
        </ol>
      )}
      {s.avisos.length > 0 &&
        s.avisos.map((a, i) => (
          <p key={i} className={`lect-aviso ${a.tipo}${i === iDestacado ? ' destacado' : ''}`}>
            {a.tipo !== 'nota' && (
              <b>
                {i === iDestacado && <Icon name="aviso" size={16} />} {TITULO_AVISO[a.tipo] ?? 'Nota'}.
              </b>
            )}{' '}
            <Glosa>{t(a.texto)}</Glosa>
          </p>
        ))}
    </div>
  );
}
