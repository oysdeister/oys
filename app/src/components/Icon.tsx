const P: Record<string, string> = {
  maestros: 'M4 6h16M4 12h16M4 18h10M18 16l2 2 4-4',
  engranaje: 'M12 9a3 3 0 1 0 0 6 3 3 0 0 0 0-6zm0-6v3m0 12v3M3 12h3m12 0h3M5.6 5.6l2.1 2.1m8.6 8.6 2.1 2.1M5.6 18.4l2.1-2.1m8.6-8.6 2.1-2.1',
  compras: 'M3 4h3l2.4 11h10.2L21 8H7M10 20a1 1 0 1 0 0-2 1 1 0 0 0 0 2zm8 0a1 1 0 1 0 0-2 1 1 0 0 0 0 2z',
  ventas: 'M4 20V10m6 10V4m6 16v-7m6 7H2',
  asiento: 'M4 4h16v16H4zM12 4v16M4 9h16',
  cartera: 'M3 7h18v12H3zM3 7l3-3h12l3 3M16 13h2',
  inicio: 'M3 11l9-7 9 7v9h-6v-6H9v6H3z',
  taller: 'M14 6l4 4-8 8H6v-4zM13 7l4 4',
  logros: 'M12 15a6 6 0 1 0 0-12 6 6 0 0 0 0 12zm-3.5 4.5L12 15l3.5 4.5M8 21l1-3m7 3-1-3',
  examen: 'M6 3h9l4 4v14H6zM14 3v5h5M9 13l2 2 4-4',
  sol: 'M12 7a5 5 0 1 0 0 10 5 5 0 0 0 0-10zm0-5v2m0 16v2M2 12h2m16 0h2M4.9 4.9l1.4 1.4m11.4 11.4 1.4 1.4M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4',
  luna: 'M21 13A9 9 0 1 1 11 3a7 7 0 0 0 10 10z',
  check: 'M5 12l5 5 9-10',
  flecha: 'M5 12h14m-6-6 6 6-6 6',
  atras: 'M19 12H5m6 6-6-6 6-6',
  play: 'M7 4l13 8-13 8z',
  grip: 'M9 6h.01M9 12h.01M9 18h.01M15 6h.01M15 12h.01M15 18h.01',
  reloj: 'M12 7v5l3 2M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18z',
  cerebro: 'M9 4a3 3 0 0 0-3 3 3 3 0 0 0-2 5 3 3 0 0 0 2 5 3 3 0 0 0 6 0V4.5A2.5 2.5 0 0 0 9 4zm6 0a3 3 0 0 1 3 3 3 3 0 0 1 2 5 3 3 0 0 1-2 5 3 3 0 0 1-6 0',
  aviso: 'M12 3l10 18H2zM12 10v5m0 3h.01',
  video: 'M3 6h13v12H3zM16 10l5-3v10l-5-3',
  menu: 'M4 7h16M4 12h16M4 17h10',
  buscar: 'M11 18a7 7 0 1 0 0-14 7 7 0 0 0 0 14zm9 3-4.35-4.35',
  plegar: 'M11 17l-5-5 5-5M18 17l-5-5 5-5',
  desplegar: 'M13 17l5-5-5-5M6 17l5-5-5-5',
  cerrar: 'M6 6l12 12M18 6 6 18',
  chevron: 'M9 6l6 6-6 6',
  libro: 'M4 5a2 2 0 0 1 2-2h13v16H6a2 2 0 0 0-2 2zM4 21V5M8 7h7M8 11h7',
  cobros: 'M7 7h11l-3-3M17 17H6l3 3M12 9.5a2.5 2.5 0 1 0 0 5 2.5 2.5 0 0 0 0-5z',
  impuestos: 'M19 5 5 19M7.5 9a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3zm9 9a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3z',
  activos: 'M3 21h18M5 21V8l7-5 7 5v13M9 21v-6h6v6M9 10h.01M15 10h.01',
};

export function Icon({ name, size = 22, stroke = 2 }: { name: string; size?: number; stroke?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={stroke} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d={P[name] ?? P.check} />
    </svg>
  );
}

/** Medalla con el arco O&S para las insignias */
export function Medal({ color, on = true, label }: { color: string; on?: boolean; label?: string }) {
  return (
    <svg className="medal" viewBox="0 0 100 100" role="img" aria-label={label}>
      <circle cx="50" cy="50" r="44" fill={on ? color : 'var(--line)'} />
      <circle cx="50" cy="50" r="35" fill="none" stroke="#fff" strokeOpacity="0.45" strokeWidth="2" strokeDasharray="3 4" />
      <path d="M22 66 C 18 36, 52 18, 86 32" fill="none" stroke="#fff" strokeWidth="6" strokeLinecap="round" />
      <path d="M38 52l9 9 17-19" fill="none" stroke="#fff" strokeWidth="7" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
