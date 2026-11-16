import { motion, useReducedMotion } from 'framer-motion';
import type { Ejercicio } from '../../types';
import { acciones, useProgreso } from '../../lib/progress';
import { conIni } from '../../lib/texto';
import { Icon } from '../Icon';

export const URL_DEMO = 'https://nextdemo.geasa.eu';

export function DemoReal({ ej, ini }: { ej: Ejercicio; ini: string }) {
  const reducir = useReducedMotion();
  const p = useProgreso();
  const marcados = p.ejercicios[ej.id]?.demo ?? [];
  const total = ej.checklist.length;
  const hechos = ej.checklist.filter((_, i) => marcados.includes(i)).length;
  const todo = total > 0 && hechos >= total;
  const t = (x: string) => conIni(x, ini);
  const tuIni = ini || 'CL';

  return (
    <div className="demo">
      <div className="demo-grid">
        <div className="sheet pad demo-pasos">
          <h2>Ahora en el ERP de verdad</h2>
          <ol className="demo-ol">
            <li>
              Abre la demo en otra pestaña:{' '}
              <a className="demo-link" href={URL_DEMO} target="_blank" rel="noopener noreferrer">
                nextdemo.geasa.eu
              </a>
            </li>
            <li>
              Entra en la base <b>TUTORIAL</b> con el usuario que te haya dado tu formador.
            </li>
            <li>Repite el ejercicio de memoria. Si te atascas, vuelve aquí al recorrido guiado.</li>
            <li>Marca abajo cada punto cuando lo veas hecho en pantalla.</li>
          </ol>
        </div>
        <div className="demo-ini" aria-label={`Tus iniciales: ${tuIni}`}>
          <span className="small">Tus iniciales en todos los códigos</span>
          <motion.strong initial={reducir ? false : { rotateX: -90, opacity: 0 }} animate={{ rotateX: 0, opacity: 1 }} transition={{ type: 'spring', stiffness: 120, damping: 12, delay: 0.15 }}>
            {tuIni}
          </motion.strong>
          <span className="small">
            La demo la comparten muchas personas. Con tus iniciales tus datos no chocan con los de nadie: por ejemplo <code className="k">T{tuIni}</code>.
          </span>
        </div>
      </div>

      <div className="sheet pad demo-check">
        <div className="demo-check-top">
          <h3>Comprueba en pantalla</h3>
          <span className={`chip${todo ? ' ok' : ''}`}>
            {hechos} de {total}
          </span>
        </div>
        <div className="meter" aria-hidden="true">
          <motion.i initial={false} animate={{ width: `${total ? (hechos / total) * 100 : 0}%` }} />
        </div>
        <div role="group" aria-label="Lista de comprobación">
          {ej.checklist.map((c, i) => {
            const on = marcados.includes(i);
            return (
              <label key={i} className={`check${on ? ' on' : ''}`}>
                <input type="checkbox" checked={on} onChange={() => acciones.toggleDemo(ej.id, i)} />
                <motion.span className="box" animate={on && !reducir ? { scale: [1, 1.25, 1] } : { scale: 1 }} transition={{ duration: 0.3 }}>
                  {on && <Icon name="check" size={16} stroke={3} />}
                </motion.span>
                <span className="check-txt">{t(c)}</span>
              </label>
            );
          })}
        </div>
        {todo && (
          <motion.p className="mem-ok" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}>
            Hecho en la demo real. Esto ya es trabajo de consultor.
          </motion.p>
        )}
      </div>
    </div>
  );
}
