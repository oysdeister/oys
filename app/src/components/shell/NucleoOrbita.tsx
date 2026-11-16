/** Núcleo central de la órbita: burbuja de cristal esférica con el % grande */
export function NucleoOrbita({ valor, etiqueta = 'de tu formación', size = 200, className = '' }: { valor: number; etiqueta?: string; size?: number; className?: string }) {
  const pct = Math.round(Math.max(0, Math.min(1, valor || 0)) * 100);
  return (
    <div className={`nucleo ${className}`} style={{ width: size, height: size, fontSize: size }} role="img" aria-label={`${pct} % ${etiqueta}`}>
      <span className="nucleo-halo" aria-hidden="true" />
      <span className="nucleo-burbuja" aria-hidden="true">
        <span className="nucleo-pct">
          {pct}
          <small>%</small>
        </span>
        <span className="nucleo-et">{etiqueta}</span>
      </span>
    </div>
  );
}
