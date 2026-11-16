import type { ComponentType, ReactNode } from 'react';
import SimAsiento from './Asiento';
import SimNumerador from './Numerador';
import SimCircuito from './Circuito';
import SimDocflow from './Docflow';
import SimFactura from './Factura';
import SimCartera from './Cartera';

export interface SimInfo {
  id: string;
  titulo: string;
  resumen: string;
  modulo: string;
  rondas: number;
  color: string;
  Componente: ComponentType;
  dibujo: ReactNode;
}

/* Dibujos pequeños de cada simulador (usan currentColor y variables del tema) */
const dBalanza = (
  <svg viewBox="0 0 120 80" aria-hidden="true">
    <rect x="58" y="14" width="4" height="56" rx="2" fill="var(--ink)" />
    <path d="M48 74h24l-4-5H52z" fill="var(--ink)" />
    <g className="tl-mini-viga">
      <rect x="16" y="16" width="88" height="4" rx="2" fill="var(--ink)" />
      <path d="M20 18 8 44h24zM100 18 88 44h24z" fill="none" stroke="var(--ink-3)" strokeWidth="1.2" />
      <path d="M6 44h28a14 6 0 0 1-28 0zM86 44h28a14 6 0 0 1-28 0z" fill="currentColor" />
    </g>
    <circle cx="60" cy="18" r="5" fill="var(--signal)" stroke="var(--ink)" strokeWidth="2" />
  </svg>
);
const dTeclas = (
  <svg viewBox="0 0 120 80" aria-hidden="true">
    {['#e', '#s', '#6n'].map((t, i) => (
      <g key={t} className="tl-mini-tecla" style={{ animationDelay: `${i * 0.25}s` }}>
        <rect x={8 + i * 36} y="30" width="32" height="30" rx="6" fill="var(--ink)" />
        <rect x={8 + i * 36} y="26" width="32" height="30" rx="6" fill="var(--sheet)" stroke="var(--ink)" strokeWidth="2" />
        <text x={24 + i * 36} y="46" textAnchor="middle" fontSize="11" fontWeight="800" fill="currentColor">
          {t}
        </text>
      </g>
    ))}
    <text x="60" y="16" textAnchor="middle" fontSize="11" fontWeight="700" fill="var(--ink)" letterSpacing="1">
      DISPC000001
    </text>
  </svg>
);
const dCircuito = (
  <svg viewBox="0 0 120 80" aria-hidden="true">
    <path d="M14 60 C 30 10, 90 10, 106 60" fill="none" stroke="var(--line)" strokeWidth="4" strokeLinecap="round" />
    <path d="M14 60 C 30 10, 90 10, 106 60" fill="none" stroke="currentColor" strokeWidth="4" strokeLinecap="round" className="tl-mini-trazo" />
    {[
      [14, 60],
      [36, 30],
      [60, 22],
      [84, 30],
      [106, 60],
    ].map(([x, y], i) => (
      <circle key={i} cx={x} cy={y} r="7" fill="var(--sheet)" stroke="var(--ink)" strokeWidth="2.5" />
    ))}
  </svg>
);
const dDocflow = (
  <svg viewBox="0 0 120 80" aria-hidden="true">
    {[0, 1, 2].map((i) => (
      <g key={i}>
        <rect x={6 + i * 40} y="22" width="30" height="36" rx="5" fill="var(--sheet)" stroke="var(--ink)" strokeWidth="2" />
        <rect x={11 + i * 40} y="28" width="20" height="4" rx="2" fill="currentColor" />
        <rect x={11 + i * 40} y="36" width="14" height="3" rx="1.5" fill="var(--line)" />
        <rect x={11 + i * 40} y="43" width="17" height="3" rx="1.5" fill="var(--line)" />
      </g>
    ))}
    <path d="M37 40h8M77 40h8" stroke="currentColor" strokeWidth="2.5" strokeDasharray="3 3" className="tl-mini-flujo" />
  </svg>
);
const dFactura = (
  <svg viewBox="0 0 120 80" aria-hidden="true">
    <path d="M30 6h60v68l-6-4-6 4-6-4-6 4-6-4-6 4-6-4-6 4-6-4-6 4z" fill="var(--sheet)" stroke="var(--ink)" strokeWidth="2" strokeLinejoin="round" />
    <rect x="38" y="16" width="30" height="4" rx="2" fill="var(--ink)" />
    <rect x="38" y="28" width="44" height="3" rx="1.5" fill="var(--line)" />
    <rect x="38" y="35" width="44" height="3" rx="1.5" fill="var(--line)" />
    <text x="82" y="58" textAnchor="end" fontSize="12" fontWeight="800" fill="currentColor">
      21 %
    </text>
  </svg>
);
const dCartera = (
  <svg viewBox="0 0 120 80" aria-hidden="true">
    <rect x="16" y="18" width="80" height="48" rx="6" fill="var(--sheet)" stroke="var(--ink)" strokeWidth="2" transform="rotate(-4 56 42)" />
    <g className="tl-mini-sello" transform="rotate(-14 84 34)">
      <rect x="62" y="20" width="46" height="26" rx="5" fill="none" stroke="currentColor" strokeWidth="3" />
      <text x="85" y="39" textAnchor="middle" fontSize="15" fontWeight="900" fill="currentColor">
        CO
      </text>
    </g>
  </svg>
);

export const SIMS: SimInfo[] = [
  { id: 'asiento', titulo: 'Cuadra el asiento', resumen: 'Rellena importes, elige cuentas y lados, y encuentra el error que deja el Cuadre en 500,00.', modulo: 'asientos', rondas: 5, color: '#8a7be0', Componente: SimAsiento, dibujo: dBalanza },
  { id: 'numerador', titulo: 'Construye la máscara', resumen: 'Monta con fichas la rotura y la máscara del numerador hasta que salga DISPC000001. Y descifra el error «Sin máscara».', modulo: 'parametrizacion', rondas: 6, color: '#6c8fd6', Componente: SimNumerador, dibujo: dTeclas },
  { id: 'circuito', titulo: 'Ordena el circuito', resumen: 'Pon en orden oferta, pedido, albarán, factura y asiento, y la vida de un efecto. Luego di qué hace cada paso.', modulo: 'compras', rondas: 4, color: '#f2a93b', Componente: SimCircuito, dibujo: dCircuito },
  { id: 'docflow', titulo: 'Lee el Docflow', resumen: 'Contesta tocando el diagrama: de qué albarán viene la factura, qué estado tiene el pedido, cuánto se debe.', modulo: 'compras', rondas: 3, color: '#3fa7c9', Componente: SimDocflow, dibujo: dDocflow },
  { id: 'factura', titulo: 'Base, IVA y total', resumen: 'Calcula el pie de facturas reales y de otras con descuento y tipos de IVA del 21, 10 y 4 %.', modulo: 'ventas', rondas: 5, color: '#e0708a', Componente: SimFactura, dibujo: dFactura },
  { id: 'cartera', titulo: 'Sigue el efecto', resumen: 'Pon el sello del estado (PE, PR, OC, CO, PA, DV) según lo que le pasa a un efecto de cartera.', modulo: 'carteras', rondas: 4, color: '#2a9c83', Componente: SimCartera, dibujo: dCartera },
];
