import { useId, type ReactNode } from 'react';

/*
 * Ilustraciones animadas de la portada del Taller. Cada una es una pequeña escena
 * sobre un «planeta» del color del simulador (--sim). Las animaciones son CSS
 * (taller-portada.css) y se paran con prefers-reduced-motion.
 */

function Esfera({ id }: { id: string }) {
  return (
    <>
      <defs>
        <radialGradient id={`${id}-esf`} cx="35%" cy="30%" r="75%">
          <stop offset="0" stopColor="#fff" stopOpacity="0.55" />
          <stop offset="0.25" stopColor="var(--sim)" stopOpacity="0.9" />
          <stop offset="1" stopColor="#050b24" stopOpacity="0.95" />
        </radialGradient>
        <linearGradient id={`${id}-oro`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#ffe39a" />
          <stop offset="1" stopColor="#e09a2c" />
        </linearGradient>
        <linearGradient id={`${id}-metal`} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#ffffff" />
          <stop offset="1" stopColor="#b9c7ee" />
        </linearGradient>
        <filter id={`${id}-brillo`} x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur stdDeviation="3" result="b" />
          <feMerge>
            <feMergeNode in="b" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>
      <ellipse cx="100" cy="150" rx="78" ry="12" className="ilu-sombra" />
      <circle cx="100" cy="92" r="58" fill={`url(#${id}-esf)`} className="ilu-esfera" />
      <ellipse cx="100" cy="92" rx="88" ry="22" className="ilu-anillo" transform="rotate(-12 100 92)" />
    </>
  );
}

function Lienzo({ children, clase }: { children: (id: string) => ReactNode; clase: string }) {
  const id = useId().replace(/:/g, '');
  return (
    <svg viewBox="0 0 200 170" className={`ilu ${clase}`} aria-hidden="true">
      <Esfera id={id} />
      {children(id)}
      <g className="ilu-estrellas">
        <path d="M22 26l2 5 5 2-5 2-2 5-2-5-5-2 5-2z" />
        <path d="M176 40l1.5 3.5 3.5 1.5-3.5 1.5-1.5 3.5-1.5-3.5-3.5-1.5 3.5-1.5z" />
        <circle cx="168" cy="132" r="1.8" />
        <circle cx="30" cy="120" r="1.4" />
      </g>
    </svg>
  );
}

/** Balanza: Debe y Haber con monedas que caen hasta equilibrar */
export const IluAsiento = () => (
  <Lienzo clase="ilu-asiento">
    {(id) => (
      <g filter={`url(#${id}-brillo)`}>
        <rect x="97" y="46" width="6" height="84" rx="3" fill={`url(#${id}-metal)`} />
        <path d="M78 136h44l-6-8H84z" fill={`url(#${id}-metal)`} />
        <g className="ilu-viga">
          <rect x="40" y="44" width="120" height="6" rx="3" fill={`url(#${id}-metal)`} />
          <g className="ilu-plato izq">
            <path d="M46 48 34 86M46 48l12 38" stroke="#dfe7ff" strokeWidth="1.4" />
            <path d="M28 86h36a18 7 0 0 1-36 0z" fill={`url(#${id}-metal)`} />
            <ellipse cx="46" cy="82" rx="10" ry="3.5" fill={`url(#${id}-oro)`} />
            <ellipse cx="46" cy="78" rx="10" ry="3.5" fill={`url(#${id}-oro)`} />
            <text x="46" y="104" textAnchor="middle" className="ilu-rotulo">
              DEBE
            </text>
          </g>
          <g className="ilu-plato der">
            <path d="M154 48l-12 38M154 48l12 38" stroke="#dfe7ff" strokeWidth="1.4" />
            <path d="M136 86h36a18 7 0 0 1-36 0z" fill={`url(#${id}-metal)`} />
            <ellipse cx="154" cy="82" rx="10" ry="3.5" fill={`url(#${id}-oro)`} />
            <ellipse cx="154" cy="78" rx="10" ry="3.5" fill={`url(#${id}-oro)`} className="ilu-moneda-cae" />
            <text x="154" y="104" textAnchor="middle" className="ilu-rotulo">
              HABER
            </text>
          </g>
        </g>
        <circle cx="100" cy="47" r="7" fill="#f6b65a" stroke="#fff" strokeWidth="2" />
      </g>
    )}
  </Lienzo>
);

/** Rodillo de caracteres y engranajes: el numerador escribiendo el código */
export const IluNumerador = () => (
  <Lienzo clase="ilu-numerador">
    {(id) => (
      <>
        <g className="ilu-engranaje grande" filter={`url(#${id}-brillo)`}>
          <path
            d="M100 52l5 0 2 9 6 3 8-5 4 4-5 8 3 6 9 2v6l-9 2-3 6 5 8-4 4-8-5-6 3-2 9h-6l-2-9-6-3-8 5-4-4 5-8-3-6-9-2v-6l9-2 3-6-5-8 4-4 8 5 6-3 2-9z"
            fill="none"
            stroke="#fff"
            strokeOpacity="0.4"
            strokeWidth="2"
            transform="translate(-2 4)"
          />
        </g>
        <g className="ilu-engranaje chico">
          <circle cx="160" cy="44" r="12" fill="none" stroke="#fff" strokeOpacity="0.45" strokeWidth="3" strokeDasharray="4 3" />
        </g>
        <rect x="26" y="74" width="148" height="40" rx="10" fill="#081436" stroke={`url(#${id}-metal)`} strokeWidth="2" />
        <text x="34" y="100" className="ilu-codigo">
          DISPC00000
        </text>
        <svg x="148" y="78" width="20" height="32" viewBox="0 0 20 32" overflow="hidden">
          <g className="ilu-rodillo">
            {['1', '2', '3', '4', '1'].map((d, i) => (
              <text key={i} x="10" y={23 + i * 32} textAnchor="middle" className="ilu-codigo destaca">
                {d}
              </text>
            ))}
          </g>
        </svg>
        <rect x="26" y="74" width="148" height="12" rx="6" fill="#fff" opacity="0.08" />
        <g className="ilu-fichas">
          {['#e', '#s', '#6n'].map((t, i) => (
            <g key={t} className="ilu-ficha" style={{ animationDelay: `${i * 0.35}s` }}>
              <rect x={44 + i * 40} y="122" width="32" height="22" rx="6" fill={`url(#${id}-metal)`} />
              <text x={60 + i * 40} y="137" textAnchor="middle" className="ilu-ficha-txt">
                {t}
              </text>
            </g>
          ))}
        </g>
      </>
    )}
  </Lienzo>
);

/** Nodos conectados: el circuito con un pulso de luz que lo recorre */
export const IluCircuito = () => {
  const n: [number, number, string][] = [
    [30, 112, 'OF'],
    [62, 66, 'PE'],
    [100, 50, 'AL'],
    [138, 66, 'FA'],
    [170, 112, 'AS'],
  ];
  return (
    <Lienzo clase="ilu-circuito">
      {(id) => (
        <g filter={`url(#${id}-brillo)`}>
          <path d="M30 112 C 40 70, 60 52, 100 50 S 160 70, 170 112" className="ilu-via" />
          <path d="M30 112 C 40 70, 60 52, 100 50 S 160 70, 170 112" className="ilu-pulso" pathLength="100" />
          {n.map(([x, y, t], i) => (
            <g key={t} className="ilu-nodo" style={{ animationDelay: `${i * 0.5}s` }}>
              <circle cx={x} cy={y} r="14" fill="#0b1d55" stroke={`url(#${id}-metal)`} strokeWidth="2.5" />
              <text x={x} y={y + 4} textAnchor="middle" className="ilu-nodo-txt">
                {t}
              </text>
            </g>
          ))}
        </g>
      )}
    </Lienzo>
  );
};

/** Documentos en capas que se separan y se enlazan: el Docflow */
export const IluDocflow = () => (
  <Lienzo clase="ilu-docflow">
    {(id) => (
      <g className="ilu-capas">
        {[0, 1, 2].map((i) => (
          <g key={i} className={`ilu-capa c${i}`}>
            <path d="M58 70 L100 50 L142 70 L100 90 Z" fill={i === 2 ? `url(#${id}-metal)` : '#0b1d55'} stroke="#fff" strokeOpacity={i === 2 ? 0 : 0.5} strokeWidth="1.5" />
            {i === 2 && (
              <>
                <path d="M78 66 L100 55.5 L110 60.3 L88 70.8 Z" fill="var(--sim)" />
                <path d="M90 72 L112 61.5 L120 65.3 L98 75.8 Z" fill="#9fb0de" />
                <path d="M100 77 L118 68.5 L124 71.3 L106 79.8 Z" fill="#9fb0de" />
              </>
            )}
          </g>
        ))}
        <path d="M144 72 C 170 80, 170 112, 142 118" className="ilu-enlace" />
        <circle cx="142" cy="118" r="4" fill="#f6b65a" />
      </g>
    )}
  </Lienzo>
);

/** Calculadora con monedas: base, IVA y total */
export const IluFactura = () => (
  <Lienzo clase="ilu-factura">
    {(id) => (
      <>
        <g className="ilu-calc" filter={`url(#${id}-brillo)`}>
          <rect x="62" y="38" width="76" height="102" rx="12" fill="#081436" stroke={`url(#${id}-metal)`} strokeWidth="2" />
          <rect x="70" y="47" width="60" height="22" rx="5" fill="#0f2a64" />
          <text x="125" y="63" textAnchor="end" className="ilu-pantalla">
            121,00
          </text>
          {Array.from({ length: 9 }, (_, i) => (
            <rect key={i} x={71 + (i % 3) * 20} y={76 + Math.floor(i / 3) * 18} width="16" height="13" rx="3.5" className={`ilu-tecla ${i === 4 ? 'pulsa' : ''}`} fill={i === 8 ? 'var(--sim)' : `url(#${id}-metal)`} />
          ))}
          <text x="100" y="135" textAnchor="middle" className="ilu-iva">
            + 21 % IVA
          </text>
        </g>
        {[0, 1, 2].map((i) => (
          <g key={i} className="ilu-moneda" style={{ animationDelay: `${i * 0.45}s` }}>
            <ellipse cx={160} cy={120 - i * 7} rx="15" ry="5" fill={`url(#${id}-oro)`} stroke="#b8781d" strokeWidth="1" />
          </g>
        ))}
        <g className="ilu-moneda flota">
          <circle cx="40" cy="70" r="12" fill={`url(#${id}-oro)`} stroke="#b8781d" />
          <text x="40" y="75" textAnchor="middle" className="ilu-euro">
            €
          </text>
        </g>
      </>
    )}
  </Lienzo>
);

/** Cartera con efectos que salen y reciben su sello */
export const IluCartera = () => (
  <Lienzo clase="ilu-cartera">
    {(id) => (
      <>
        <g className="ilu-efectos">
          {['PE', 'PR', 'CO'].map((t, i) => (
            <g key={t} className={`ilu-efecto e${i}`}>
              <rect x={62 + i * 6} y={48 - i * 4} width="66" height="38" rx="5" fill={`url(#${id}-metal)`} stroke="#9fb0de" />
              <rect x={70 + i * 6} y={56 - i * 4} width="30" height="4" rx="2" fill="#7d8fc4" />
              <text x={118 + i * 6} y={78 - i * 4} textAnchor="end" className="ilu-efecto-txt">
                {t}
              </text>
            </g>
          ))}
        </g>
        <g filter={`url(#${id}-brillo)`}>
          <path d="M44 78h112a8 8 0 0 1 8 8v42a8 8 0 0 1-8 8H44a8 8 0 0 1-8-8V86a8 8 0 0 1 8-8z" fill="#0b1d55" stroke={`url(#${id}-metal)`} strokeWidth="2.5" />
          <path d="M126 96h38v24h-38a12 12 0 0 1 0-24z" fill="var(--sim)" stroke="#fff" strokeOpacity="0.6" strokeWidth="1.5" />
          <circle cx="134" cy="108" r="4" fill="#fff" />
        </g>
        <g className="ilu-sello">
          <rect x="52" y="98" width="52" height="26" rx="5" fill="none" stroke="#5ff0d2" strokeWidth="3" />
          <text x="78" y="117" textAnchor="middle" className="ilu-sello-txt">
            CO
          </text>
        </g>
      </>
    )}
  </Lienzo>
);

export const ILUSTRACIONES: Record<string, () => ReactNode> = {
  asiento: IluAsiento,
  numerador: IluNumerador,
  circuito: IluCircuito,
  docflow: IluDocflow,
  factura: IluFactura,
  cartera: IluCartera,
};
