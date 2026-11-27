import { useState } from 'react';
import { Glosa } from '../Glosario';
import { motion } from 'framer-motion';
import type { Seccion } from '../../types';
import { conIni } from '../../lib/texto';
import { CapturaCampos } from './CapturaCampos';
import { VerMas, partir, useRevela } from './Revela';
import { Caja } from './Caja';
import { cajaDe, cajaDeAviso, tramos } from './util';

const MAX_IDEAS = 3;

/** Ruta de menú del ERP en forma de migas */
export function RutaMenu({ ruta }: { ruta: string[] | null }) {
  if (!ruta || !ruta.length) return null;
  return <Migas ruta={ruta} />;
}

/** Migas de menú: cada nivel en su pastilla, separados por › (decorativos) */
function Migas({ ruta }: { ruta: string[] }) {
  return (
    <ol className="menu-path migas" aria-label={`Ruta de menú: ${ruta.join(' › ')}`}>
      {ruta.map((r, i) => (
        <li key={i} aria-current={i === ruta.length - 1 ? 'location' : undefined}>
          <span>{r}</span>
        </li>
      ))}
    </ol>
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
  const lead = s.paraQueSirve ? cajaDe(s.paraQueSirve) : null;
  // Tabla de referencia (no de campos): si todos los «ejemplos» son rutas de menú, las cabeceras lo dicen
  const esMapa = s.campos.length > 1 && s.campos.every((c) => !!c.ejemplo && c.ejemplo.includes('›'));
  return (
    <div className="sec-body lect">
      {s.paraQueSirve &&
        (lead ? (
          <Caja tipo={lead.tipo}>
            <Glosa>{t(lead.texto)}</Glosa>
          </Caja>
        ) : (
          <p className="lect-lead">
            <Glosa>{t(s.paraQueSirve)}</Glosa>
          </p>
        ))}
      {s.ruta && s.ruta.length > 0 && (
        <div className="lect-donde">
          <span className="lect-donde-k">En el ERP</span>
          <Migas ruta={s.ruta.map(t)} />
        </div>
      )}
      {tramos(s.explicacion).map((tr, k) =>
        'lista' in tr ? (
          <ul key={k} className="lect-lista">
            {tr.lista.map((p, i) => (
              <li key={i}>
                <Glosa>{t(p)}</Glosa>
              </li>
            ))}
          </ul>
        ) : (
          <Caja key={k} tipo={tr.caja.tipo}>
            <Glosa>{t(tr.caja.texto)}</Glosa>
          </Caja>
        ),
      )}
      {modulo ? (
        <CapturaCampos s={s} modulo={modulo} ini={ini} />
      ) : (
        s.campos.length > 0 && (
          <table className="fields lect-campos">
            <thead>
              <tr>
                <th scope="col">{esMapa ? 'Código en el buscador' : 'Campo'}</th>
                <th scope="col">{esMapa ? 'Qué guarda' : 'Qué es'}</th>
                <th scope="col">{esMapa ? 'Ruta del menú' : 'Ejemplo'}</th>
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
      {s.avisos.map((a, i) => (
        <Caja key={i} tipo={cajaDeAviso(a.tipo)} destacado={i === iDestacado}>
          <Glosa>{t(a.texto)}</Glosa>
        </Caja>
      ))}
    </div>
  );
}
