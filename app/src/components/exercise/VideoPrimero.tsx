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
  return mmss(sv.original && m.serie ? m.t : m.tCap);
}

function posterDe(m: MomentoVideo) {
  const p = serieDe(m.serie).capitulos.find((c) => c.n === m.capitulo)?.poster;
  return p ? baseUrl(p) : '';
}

/**
 * Tarjeta «Mira primero el vídeo» que abre cada parte del Concepto, antes del texto y las capturas.
 * Toda la tarjeta abre el momento en la ventana del reproductor. Si hay más momentos,
 * van debajo como enlaces pequeños («También: …», como mucho 2).
 */
export function VideoPrimero({ lista }: { lista: MomentoVideo[] }) {
  const [abierto, setAbierto] = useState<MomentoVideo | null>(null);
  const [ultimo, setUltimo] = useState<MomentoVideo | null>(null);
  const [sinPoster, setSinPoster] = useState(false);
  if (!lista.length) return null;
  const [m, ...resto] = lista;
  const otros = resto.slice(0, 2);
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
          <span className="vp-ante">Antes de leer</span>
          <span className="vp-tit">Mira primero el vídeo</span>
          <span className="vp-que">{m.titulo}</span>
          <span className="vp-donde">{dondeMomento(m)}</span>
          <span className="vp-luego">Luego lee la explicación y prueba en las pantallas.</span>
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
      <ReproductorModal serie={enModal.serie} capitulo={enModal.capitulo} t={enModal.tCap} abierto={!!abierto} onCerrar={() => setAbierto(null)} />
    </div>
  );
}
