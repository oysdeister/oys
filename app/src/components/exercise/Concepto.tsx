import { Glosa, GlosaAmbito } from '../Glosario';
import type { Ejercicio } from '../../types';
import { conIni } from '../../lib/texto';
import { SeccionVista } from './SeccionVista';
import { cajaDe, parrafos } from './util';
import { Caja } from './Caja';
import { momentosDeSeccion } from '../../content/videoSeries';
import { VideoPrimero } from './VideoPrimero';

/**
 * Paso 1 del bloque: lectura de arriba abajo, como una página de documentación.
 * Introducción sin título y un único nivel de títulos (h2), uno por parte del bloque, con «Parte n de N».
 * Un párrafo que empieza por «Ejemplo:», «Fíjate:» u «Ojo:» se pinta como recuadro (guía de redacción).
 * Cada parte con vídeo empieza por él: vídeo → texto → pantallas clicables.
 * El glosario marca cada término solo la primera vez que sale en la introducción y en cada parte.
 */
export function Concepto({ ej, ini, modulo }: { ej: Ejercicio; ini: string; modulo: string }) {
  const t = (x: string) => conIni(x, ini);
  const intro = parrafos(ej.concepto);
  const primerAviso = ej.secciones.findIndex((s) => s.avisos.some((a) => a.tipo === 'problema'));
  const n = ej.secciones.length;
  const irA = (id: string) => {
    const reducir = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    document.getElementById(id)?.scrollIntoView({ behavior: reducir ? 'auto' : 'smooth', block: 'start' });
  };
  return (
    <article className="doc doc-lectura">
      <GlosaAmbito>
        <div className="doc-intro">
          {intro.map((x, i) => {
            const c = i > 0 ? cajaDe(x) : null;
            return c ? (
              <Caja key={i} tipo={c.tipo}>
                <Glosa>{t(c.texto)}</Glosa>
              </Caja>
            ) : (
              <p key={i} className={i === 0 ? 'doc-lead' : undefined}>
                <Glosa>{t(x)}</Glosa>
              </p>
            );
          })}
        </div>
      </GlosaAmbito>
      {ej.secciones.map((s, i) => (
        <section key={s.id} id={`sec-${s.id}`} className="doc-sec" aria-labelledby={`sec-${s.id}-h`}>
          <GlosaAmbito>
            <header className="doc-sec-cab">
              {n > 1 && (
                <p className="doc-sec-n">
                  Parte {i + 1} de {n}
                </p>
              )}
              <h2 id={`sec-${s.id}-h`}>{t(s.titulo)}</h2>
            </header>
            <VideoPrimero lista={momentosDeSeccion(s.id)} indice={!!s.videoIndice} />
            <SeccionVista s={s} ini={ini} modulo={modulo} destacar={i === primerAviso} />
          </GlosaAmbito>
        </section>
      ))}
      {n > 1 && (
        <nav className="doc-indice" aria-label="En esta página">
          <p className="doc-indice-k">En esta página</p>
          <ol>
            {ej.secciones.map((s, i) => (
              <li key={s.id}>
                <button type="button" onClick={() => irA(`sec-${s.id}`)}>
                  <b>{i + 1}</b>
                  <span>{t(s.titulo)}</span>
                </button>
              </li>
            ))}
          </ol>
        </nav>
      )}
    </article>
  );
}
