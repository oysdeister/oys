import type { CSSProperties } from 'react';
import { Link } from 'react-router-dom';
import { Icon } from '../Icon';

/**
 * Un módulo como planeta: esfera brillante (degradado radial con reflejo) del color del módulo,
 * anillo de progreso luminoso alrededor e icono en blanco. Etiqueta y % opcionales debajo.
 */
export function Planeta({
  color,
  valor = 0,
  size = 72,
  icono,
  etiqueta,
  pct = false,
  to,
  className = '',
}: {
  color: string;
  valor?: number;
  size?: number;
  icono?: string;
  etiqueta?: string;
  pct?: boolean;
  to?: string;
  className?: string;
}) {
  const v = Math.max(0, Math.min(1, valor || 0));
  const R = size / 2 + 7;
  const box = R * 2 + 6;
  const c = 2 * Math.PI * R;
  const contenido = (
    <>
      <span className="planeta-cuerpo" style={{ width: box, height: box }}>
        <svg className="planeta-anillo" width={box} height={box} viewBox={`0 0 ${box} ${box}`} aria-hidden="true">
          <circle cx={box / 2} cy={box / 2} r={R} className="trk" />
          <circle cx={box / 2} cy={box / 2} r={R} className="val" strokeDasharray={c} strokeDashoffset={c * (1 - v)} transform={`rotate(-90 ${box / 2} ${box / 2})`} />
        </svg>
        <span className="planeta-esfera" style={{ width: size, height: size }}>
          {icono && <Icon name={icono} size={Math.round(size * 0.38)} />}
        </span>
      </span>
      {(etiqueta || pct) && (
        <span className="planeta-txt">
          {etiqueta && <b>{etiqueta}</b>}
          {pct && <small>{Math.round(v * 100)} %</small>}
        </span>
      )}
    </>
  );
  const style = { ['--mod' as string]: color } as CSSProperties;
  const cls = `planeta ${v >= 1 ? 'lleno ' : ''}${className}`;
  return to ? (
    <Link to={to} className={cls} style={style} aria-label={etiqueta ? `${etiqueta}, ${Math.round(v * 100)} %` : undefined}>
      {contenido}
    </Link>
  ) : (
    <span className={cls} style={style}>
      {contenido}
    </span>
  );
}
