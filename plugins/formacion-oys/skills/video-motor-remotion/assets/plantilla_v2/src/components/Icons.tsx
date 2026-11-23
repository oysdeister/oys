import React from 'react';

/** Iconos de línea propios (viewBox 24). Nombres en español; ver GUION_FORMATO.md. */
const P: Record<string, React.ReactNode> = {
  pedido: (
    <>
      <rect x="5" y="3.5" width="14" height="17" rx="2.2" />
      <path d="M9 3.5h6v2.2a.8.8 0 0 1-.8.8H9.8a.8.8 0 0 1-.8-.8z" />
      <path d="M8.5 11h7M8.5 14.5h7M8.5 18h4" />
    </>
  ),
  albaran: (
    <>
      <path d="M2.5 6.5h11v9.5h-11z" />
      <path d="M13.5 9.5h4l3 3.2V16h-7z" />
      <circle cx="6.5" cy="17.5" r="1.8" />
      <circle cx="17" cy="17.5" r="1.8" />
      <path d="M5.5 10h5" />
    </>
  ),
  factura: (
    <>
      <path d="M6 2.8h12v18.4l-2-1.4-2 1.4-2-1.4-2 1.4-2-1.4-2 1.4z" />
      <path d="M9 7.5h6M9 11h6" />
      <path d="M13.8 14.2c-.5-.5-1.1-.7-1.8-.7-1.4 0-2.3 1-2.3 2.2s.9 2.2 2.3 2.2c.7 0 1.3-.2 1.8-.7M9 15.2h3M9 16.4h3" />
    </>
  ),
  tarifa: (
    <>
      <path d="M3.5 12.2V4.5a1 1 0 0 1 1-1h7.7l8.3 8.3a1.4 1.4 0 0 1 0 2l-6.7 6.7a1.4 1.4 0 0 1-2 0z" />
      <circle cx="8" cy="8" r="1.6" />
      <path d="M11.5 14.5l4-4" />
    </>
  ),
  calendario: (
    <>
      <rect x="3.5" y="5" width="17" height="15.5" rx="2.2" />
      <path d="M3.5 10h17M8 3v4M16 3v4" />
      <path d="M7.5 13.5h2M11 13.5h2M14.5 13.5h2M7.5 17h2M11 17h2" />
    </>
  ),
  devolucion: (
    <>
      <path d="M9 14.5L4 9.5l5-5" />
      <path d="M4 9.5h10.5a5.5 5.5 0 0 1 0 11H10" />
    </>
  ),
  rectificar: (
    <>
      <path d="M13 3H6.5A1.5 1.5 0 0 0 5 4.5v15A1.5 1.5 0 0 0 6.5 21h11a1.5 1.5 0 0 0 1.5-1.5V9z" />
      <path d="M13 3v6h6" />
      <path d="M9 17.5l.6-2.4 5-5 1.8 1.8-5 5z" />
    </>
  ),
  cabecera: (
    <>
      <rect x="3" y="4" width="18" height="16" rx="2.2" />
      <path d="M3 9.5h18" />
      <path d="M6.5 6.8h5" />
      <path d="M6.5 13h11M6.5 16.5h7" opacity=".45" />
    </>
  ),
  lineas: (
    <>
      <path d="M8.5 6.5h12M8.5 12h12M8.5 17.5h12" />
      <circle cx="4.5" cy="6.5" r="1.2" />
      <circle cx="4.5" cy="12" r="1.2" />
      <circle cx="4.5" cy="17.5" r="1.2" />
    </>
  ),
  check: <path d="M5 12.5l4.5 4.5L19 7.5" />,
  bombilla: (
    <>
      <path d="M9 17.5h6M9.8 20.5h4.4" />
      <path d="M12 3a6 6 0 0 0-3.6 10.8c.6.5 1 1.2 1.1 2V16h5v-.2c.1-.8.5-1.5 1.1-2A6 6 0 0 0 12 3z" />
      <path d="M10.3 12.6l1-1.6 .7 1.2.7-1.2 1 1.6" opacity=".9" />
    </>
  ),
  alerta: (
    <>
      <path d="M10.3 4.2L2.8 17.5A2 2 0 0 0 4.5 20.5h15a2 2 0 0 0 1.7-3L13.7 4.2a2 2 0 0 0-3.4 0z" />
      <path d="M12 9.5v4.5" />
      <circle cx="12" cy="17" r=".6" fill="currentColor" />
    </>
  ),
  documento: (
    <>
      <path d="M13.5 3H6.5A1.5 1.5 0 0 0 5 4.5v15A1.5 1.5 0 0 0 6.5 21h11a1.5 1.5 0 0 0 1.5-1.5V8.5z" />
      <path d="M13.5 3v5.5H19M8.5 13h7M8.5 16.5h5" />
    </>
  ),
  stock: (
    <>
      <path d="M3 10.5l4.5-2.5 4.5 2.5v5L7.5 18 3 15.5zM12 10.5l4.5-2.5 4.5 2.5v5L16.5 18 12 15.5zM7.5 5.5L12 3l4.5 2.5v5L12 13l-4.5-2.5z" />
    </>
  ),
  proveedor: (
    <>
      <path d="M3 20.5h18M5 20.5V9l5 3V9l5 3V5.5h4v15" />
      <path d="M8 16h1.5M12 16h1.5M16.5 16H18M16.5 12.5H18" />
    </>
  ),
  euro: (
    <>
      <circle cx="12" cy="12" r="8.5" />
      <path d="M15 8.6a4 4 0 1 0 0 6.8M7.5 11h5.5M7.5 13.2h5.5" />
    </>
  ),
  engranaje: (
    <>
      <circle cx="12" cy="12" r="3" />
      <path d="M12 2.8v2.4M12 18.8v2.4M21.2 12h-2.4M5.2 12H2.8M18.5 5.5l-1.7 1.7M7.2 16.8l-1.7 1.7M18.5 18.5l-1.7-1.7M7.2 7.2L5.5 5.5" />
      <circle cx="12" cy="12" r="6.6" />
    </>
  ),
  buscar: (
    <>
      <circle cx="10.5" cy="10.5" r="6.5" />
      <path d="M15.5 15.5l5 5" />
    </>
  ),
  rayo: <path d="M13.5 2.5L4.5 13.5h6.5l-1 8 9-11h-6.5z" />,
  capas: (
    <>
      <path d="M12 3l9 5-9 5-9-5z" />
      <path d="M3 12.5l9 5 9-5M3 16.5l9 5 9-5" opacity=".6" />
    </>
  ),
  usuario: (
    <>
      <circle cx="12" cy="8" r="4" />
      <path d="M4 20.5c1.2-3.8 4.3-5.5 8-5.5s6.8 1.7 8 5.5" />
    </>
  ),
  reloj: (
    <>
      <circle cx="12" cy="12" r="8.5" />
      <path d="M12 7.5V12l3 2" />
    </>
  ),
  estrella: <path d="M12 3l2.7 5.6 6.1.9-4.4 4.3 1 6.1L12 17l-5.4 2.9 1-6.1-4.4-4.3 6.1-.9z" />,
  flecha: <path d="M4 12h15M13.5 6.5L19 12l-5.5 5.5" />,
  mas: <path d="M12 5v14M5 12h14" />,
  igual: <path d="M5.5 9.5h13M5.5 14.5h13" />,
  cruz: <path d="M6.5 6.5l11 11M17.5 6.5l-11 11" />,
  arriba: <path d="M12 19V5.5M6.5 11L12 5.5l5.5 5.5" />,
  cambio: <path d="M4 8.5h14l-3.5-3.5M20 15.5H6l3.5 3.5" />,
  pantalla: (
    <>
      <rect x="2.5" y="4" width="19" height="13" rx="2" />
      <path d="M8.5 20.5h7M12 17v3.5" />
    </>
  ),
};

export const ICONOS = Object.keys(P);

/** Añade pathLength=1 a cada trazo para poder «dibujarlo» con dashoffset. */
const conTrazo = (node: React.ReactNode, draw: number): React.ReactNode =>
  React.Children.map(node, (ch) => {
    if (!React.isValidElement(ch)) return ch;
    const el = ch as React.ReactElement<Record<string, unknown>>;
    if (el.type === React.Fragment) return conTrazo(el.props.children as React.ReactNode, draw);
    return React.cloneElement(el, { pathLength: 1, strokeDasharray: 1, strokeDashoffset: 1 - draw });
  });

export const Icon: React.FC<{ name?: string; size?: number; color?: string; stroke?: number; style?: React.CSSProperties; draw?: number }> = ({
  name = 'documento',
  size = 32,
  color = 'currentColor',
  stroke = 1.7,
  style,
  draw,
}) => {
  const d = P[name] ?? P.documento;
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke={color}
      strokeWidth={stroke}
      strokeLinecap="round"
      strokeLinejoin="round"
      style={{ display: 'block', overflow: 'visible', ...style }}
    >
      {draw === undefined || draw >= 1 ? d : conTrazo(d, Math.max(0, draw))}
    </svg>
  );
};

/** Logotipo abstracto: tres planos isométricos y un núcleo. «p» 0→1 dibuja el trazo. */
export const Logo: React.FC<{ size?: number; p?: number; glowColor?: string }> = ({ size = 120, p = 1, glowColor = '#2EE6FF' }) => {
  const d = (k: number) => Math.min(1, Math.max(0, p * 3 - k));
  return (
    <svg width={size} height={size} viewBox="0 0 120 120" fill="none" style={{ overflow: 'visible' }}>
      <defs>
        <linearGradient id="lg-a" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#2EE6FF" />
          <stop offset="1" stopColor="#7C5CFF" />
        </linearGradient>
        <linearGradient id="lg-b" x1="1" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#7C5CFF" />
          <stop offset="1" stopColor="#FF4FD8" />
        </linearGradient>
        <filter id="lg-glow" x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur stdDeviation="3" result="b" />
          <feMerge>
            <feMergeNode in="b" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>
      <g filter="url(#lg-glow)" strokeLinejoin="round" strokeLinecap="round">
        <path d="M60 14L104 38L60 62L16 38Z" stroke="url(#lg-a)" strokeWidth="3.2" pathLength={1} strokeDasharray={1} strokeDashoffset={1 - d(0)} />
        <path d="M16 58L60 82L104 58" stroke="url(#lg-a)" strokeWidth="3.2" opacity={0.75} pathLength={1} strokeDasharray={1} strokeDashoffset={1 - d(1)} />
        <path d="M16 78L60 102L104 78" stroke="url(#lg-b)" strokeWidth="3.2" opacity={0.5} pathLength={1} strokeDasharray={1} strokeDashoffset={1 - d(2)} />
        <circle cx="60" cy="38" r={7 * d(1)} fill={glowColor} />
      </g>
    </svg>
  );
};
