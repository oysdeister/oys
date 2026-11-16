import type { Seccion } from '../../types';
import { conIni } from '../../lib/texto';
import { Icon } from '../Icon';

const TITULO_AVISO = { problema: 'Ojo', solucion: 'Solución', nota: 'Nota' } as const;

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

/** Contenido de una sección: para qué sirve, ruta, explicación, campos y avisos */
export function SeccionVista({ s, ini, conPasos = false }: { s: Seccion; ini: string; conPasos?: boolean }) {
  const t = (x: string) => conIni(x, ini);
  return (
    <div className="sec-body">
      {s.paraQueSirve && (
        <div className="callout why">
          <b>¿Para qué sirve?</b>
          {t(s.paraQueSirve)}
        </div>
      )}
      {s.ruta && s.ruta.length > 0 && (
        <div className="sec-ruta">
          <span className="small muted">Dónde está</span>
          <RutaMenu ruta={s.ruta.map(t)} />
        </div>
      )}
      {s.explicacion.map((p, i) => (
        <p key={i}>{t(p)}</p>
      ))}
      {s.campos.length > 0 && (
        <div className="sec-campos">
          <table className="fields">
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
                  <td>{t(c.significado)}</td>
                  <td>{c.ejemplo ? <code>{t(c.ejemplo)}</code> : null}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      {conPasos && s.pasos.length > 0 && (
        <ol className="sec-pasos">
          {s.pasos.map((p, i) => (
            <li key={i}>
              <span>{t(p.texto)}</span>
              {p.detalle && <small className="muted">{t(p.detalle)}</small>}
            </li>
          ))}
        </ol>
      )}
      {s.avisos.map((a, i) => (
        <div key={i} className={`callout ${a.tipo}`}>
          <b>
            {a.tipo === 'problema' && <Icon name="aviso" size={16} />} {TITULO_AVISO[a.tipo] ?? 'Nota'}
          </b>
          {t(a.texto)}
        </div>
      ))}
    </div>
  );
}
