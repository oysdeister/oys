import { Glosa } from '../Glosario';
import type { Ejercicio } from '../../types';
import { conIni } from '../../lib/texto';
import { SeccionVista } from './SeccionVista';
import { parrafos } from './util';
import { momentosDeSeccion } from '../../content/videoSeries';
import { VideoPrimero } from './VideoPrimero';

/**
 * Paso 1 del bloque: lectura de arriba abajo, como una página de documentación.
 * Introducción sin título y un único nivel de títulos (h2), uno por parte del bloque.
 * El primer aviso de «Ojo» del bloque es el único destacado; el resto va como texto.
 * Cada parte con vídeo empieza por él: vídeo → texto → pantallas clicables.
 */
export function Concepto({ ej, ini, modulo }: { ej: Ejercicio; ini: string; modulo: string }) {
  const t = (x: string) => conIni(x, ini);
  const intro = parrafos(ej.concepto);
  const primerAviso = ej.secciones.findIndex((s) => s.avisos.some((a) => a.tipo === 'problema'));
  return (
    <article className="doc">
      {intro.map((x, i) => (
        <p key={i} className={i === 0 ? 'doc-lead' : undefined}>
          <Glosa>{t(x)}</Glosa>
        </p>
      ))}
      {ej.secciones.map((s, i) => (
        <section key={s.id} id={`sec-${s.id}`} className="doc-sec">
          <h2>{t(s.titulo)}</h2>
          <VideoPrimero lista={momentosDeSeccion(s.id)} indice={!!s.videoIndice} />
          <SeccionVista s={s} ini={ini} modulo={modulo} destacar={i === primerAviso} />
        </section>
      ))}
    </article>
  );
}
