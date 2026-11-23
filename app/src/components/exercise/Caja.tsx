import type { ReactNode } from 'react';
import { ROTULO_CAJA, type TipoCaja } from './util';

/** Iconos de 24×24 a trazo; toman el color del rótulo */
const ICONO: Record<TipoCaja, string> = {
  // hoja con cifras
  ejemplo: 'M6 3h9l4 4v14H6zM14 3v5h5M9 12h6M9 16h4',
  // ojo abierto
  fijate: 'M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7S2 12 2 12zm10-3a3 3 0 1 0 0 6 3 3 0 0 0 0-6z',
  // triángulo de aviso
  ojo: 'M12 3l10 18H2zM12 10v5m0 3h.01',
  // i de información
  nota: 'M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18zM12 11v6m0-9h.01',
  // check
  solucion: 'M5 12l5 5 9-10',
};

/**
 * Recuadro de lectura: «Ejemplo», «Fíjate», «Ojo», «Nota» o «Solución».
 * El rótulo va arriba con su icono; el texto, debajo. Es una nota (role="note") para el lector de pantalla.
 */
export function Caja({ tipo, children, destacado = false }: { tipo: TipoCaja; children: ReactNode; destacado?: boolean }) {
  const rotulo = ROTULO_CAJA[tipo];
  return (
    <aside className={`caja caja-${tipo}${destacado ? ' destacado' : ''}`} role="note" aria-label={rotulo}>
      <span className="caja-k" aria-hidden="true">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
          <path d={ICONO[tipo]} />
        </svg>
        {rotulo}
      </span>
      <p className="caja-t">{children}</p>
    </aside>
  );
}
