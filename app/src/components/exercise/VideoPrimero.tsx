import { useState } from 'react';
import type { MomentoVideo } from '../../content/videoMapa';
import { serieDe } from '../../content/videoSeries';
import { baseUrl } from '../../lib/texto';
import { mmss } from '../../lib/config';
import { Icon } from '../Icon';
import { ReproductorModal, dondeMomento } from '../video';
import './video-primero.css';

/** Minuto del botón: en los vídeos por tabla, su duración; en las sesiones originales, el minuto de la grabación */
function minuto(m: MomentoVideo) {
  const sv = serieDe(m.serie);
  if (sv.porTabla) return mmss(sv.capitulos.find((c) => c.n === m.capitulo)?.duracion ?? 0);
  if (sv.original && m.serie) return mmss(m.t);
  return m.fin !== undefined ? mmss(m.fin - m.tCap) : mmss(m.tCap);
}

function posterDe(m: MomentoVideo) {
  const p = serieDe(m.serie).capitulos.find((c) => c.n === m.capitulo)?.poster;
  return p ? baseUrl(p) : '';
}

/**
 * Tarjeta «Mira primero el vídeo» que abre cada parte del Concepto, antes del texto y las capturas.
 * Toda la tarjeta abre el momento en la ventana del reproductor. Si hay más momentos,
 * van debajo como enlaces pequeños («También: …», como mucho 2).
 * Con «indice», todos los momentos van debajo en una lista numerada (vídeo de presentación o de navegación).
 */
export function VideoPrimero({
  lista,
  indice = false,
  ante = 'Antes de leer',
  luego = 'Luego lee la explicación y prueba en las pantallas.',
}: {
  lista: MomentoVideo[];
  indice?: boolean;
  ante?: string;
  luego?: string;
}) {
  const [abierto, setAbierto] = useState<MomentoVideo | null>(null);
  const [ultimo, setUltimo] = useState<MomentoVideo | null>(null);
  const [sinPoster, setSinPoster] = useState(false);
  if (!lista.length) return null;
  const [m, ...resto] = lista;
  const otros = indice ? [] : resto.slice(0, 2);
  const poster = sinPoster ? '' : posterDe(m);
  const abrir = (x: MomentoVideo) => {
    setUltimo(x);
    setAbierto(x);
  };
  const enModal = abierto ?? ultimo ?? m;

  return (
    <div className="vp">
      <button type="button" className="vp-main" onClick={() => abrir(m)} aria-haspopup="dialog">
        <span className={`vp-mini${poster ? '' : ' sin'}`} aria-hidden="true">
          {poster && <img src={poster} alt="" loading="lazy" decoding="async" onError={() => setSinPoster(true)} />}
          <span className="vp-play">
            <span className="vp-anillo" />
            <Icon name="play" size={26} />
          </span>
          <span className="vp-min">{minuto(m)}</span>
        </span>
        <span className="vp-txt">
          <span className="vp-ante">{ante}</span>
          <span className="vp-tit">Mira primero el vídeo</span>
          <span className="vp-que">{m.titulo}</span>
          <span className="vp-donde">{dondeMomento(m)}</span>
          <span className="vp-luego">{luego}</span>
        </span>
      </button>
      {otros.length > 0 && (
        <p className="vp-mas">
          <span>También:</span>
          {otros.map((x, i) => (
            <button key={`${x.serie ?? 'c'}-${x.capitulo}-${x.t}-${i}`} type="button" className="vp-otro" onClick={() => abrir(x)} aria-haspopup="dialog">
              <Icon name="play" size={12} />
              {x.titulo} <span className="vp-otro-donde">· {dondeMomento(x)}</span>
            </button>
          ))}
        </p>
      )}
      {indice && lista.length > 1 && (
        <ol className="vp-mas vp-indice" aria-label="Momentos del vídeo">
          {lista.map((x, i) => (
            <li key={`${x.serie ?? 'c'}-${x.capitulo}-${x.t}-${i}`}>
              <button type="button" className="vp-otro" onClick={() => abrir(x)} aria-haspopup="dialog">
                <Icon name="play" size={12} />
                {x.titulo} <span className="vp-otro-donde">· {dondeMomento(x)}</span>
              </button>
            </li>
          ))}
        </ol>
      )}
      <ReproductorModal serie={enModal.serie} capitulo={enModal.capitulo} t={enModal.tCap} fin={enModal.fin} abierto={!!abierto} onCerrar={() => setAbierto(null)} />
    </div>
  );
}
