import { AnimatePresence, motion } from 'framer-motion';

/** Respuesta tipo ruta de menú: el alumno toca las fichas en orden. El valor es «A › B › C». */
export function RutaFichas({ fichas, valor, onChange, etiqueta }: { fichas: string[]; valor: string; onChange: (v: string) => void; etiqueta: string }) {
  const elegidas = valor ? valor.split(' › ') : [];
  const libres = fichas.filter((f) => !elegidas.includes(f));
  const set = (arr: string[]) => onChange(arr.join(' › '));
  return (
    <div className="ex-ruta" role="group" aria-label={etiqueta}>
      <div className="ex-ruta-linea" aria-live="polite">
        {elegidas.length === 0 && <span className="muted small">Toca las fichas en el orden del menú</span>}
        <AnimatePresence initial={false}>
          {elegidas.map((f, i) => (
            <motion.button
              type="button"
              key={f}
              className="ex-ficha on"
              layout
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              onClick={() => set(elegidas.slice(0, i))}
              aria-label={`Quitar ${f} y lo que va detrás`}
            >
              {i > 0 && <span className="ex-sep" aria-hidden="true">›</span>}
              {f}
            </motion.button>
          ))}
        </AnimatePresence>
      </div>
      <div className="ex-ruta-fichas">
        {libres.map((f) => (
          <motion.button type="button" key={f} layout className="ex-ficha" onClick={() => set([...elegidas, f])}>
            {f}
          </motion.button>
        ))}
      </div>
    </div>
  );
}
