import type { Ejercicio } from '../../types';
import { acciones, useProgreso } from '../../lib/progress';
import { conIni } from '../../lib/texto';
import { problemasNuevos } from './util';

export const URL_DEMO = 'https://nextdemo.geasa.eu';

/** El ERP no deja meterse en un iframe (X-Frame-Options sameorigin). En su lugar abre una ventana
    que ocupa los dos tercios derechos de la pantalla y deja la plataforma visible en el tercio izquierdo. */
export function abrirErpDividido() {
  const s = window.screen as Screen & { availLeft?: number; availTop?: number };
  const izq = s.availLeft ?? 0;
  const arriba = s.availTop ?? 0;
  const ancho = s.availWidth;
  const alto = s.availHeight;
  const tercio = Math.round(ancho / 3);
  const w = window.open(URL_DEMO, 'axional-erp', `popup=yes,left=${izq + tercio},top=${arriba},width=${ancho - tercio},height=${alto}`);
  try {
    // Si la ventana ya existía, la recoloca
    w?.moveTo(izq + tercio, arriba);
    w?.resizeTo(ancho - tercio, alto);
    w?.focus();
  } catch {
    /* otro origen: el navegador puede no dejar moverla */
  }
  return !!w;
}

export function DemoReal({ ej, ini }: { ej: Ejercicio; ini: string }) {
  const p = useProgreso();
  const marcados = p.ejercicios[ej.id]?.demo ?? [];
  const total = ej.checklist.length;
  const hechos = ej.checklist.filter((_, i) => marcados.includes(i)).length;
  const todo = total > 0 && hechos >= total;
  const t = (x: string) => conIni(x, ini);
  const tuIni = ini || 'CL';
  const problemas = problemasNuevos(ej);
  const quitados = ej.problemas.length - problemas.length;

  return (
    <div className="pl demo-pl">
      <ol className="pl-pasos">
        <li>
          Abre la demo del ERP junto a esta página:{' '}
          <button type="button" className="pl-link en-linea" onClick={() => abrirErpDividido()}>
            abrir la demo al lado
          </button>{' '}
          (o en otra pestaña:{' '}
          <a href={URL_DEMO} target="_blank" rel="noopener noreferrer">
            nextdemo.geasa.eu
          </a>
          ).
        </li>
        <li>
          Entra en la base <b>TUTORIAL</b> con el usuario que te haya dado tu formador.
        </li>
        <li>
          Usa tus iniciales, <b>{tuIni}</b>, en todos los códigos que crees (por ejemplo <code>T{tuIni}</code>): la demo la comparte mucha gente y así tus datos no se mezclan con los de otros.
        </li>
        <li>Hazlo sin mirar los pasos. Si te atascas, vuelve al Guiado.</li>
        <li>Marca cada punto de la lista cuando lo veas hecho en pantalla.</li>
      </ol>

      <h2 className="pl-h">Comprueba en pantalla</h2>
      <p className="pl-cont">
        <b>
          {hechos} de {total}
        </b>{' '}
        comprobados{todo ? '. Bloque hecho en la Demo real.' : ''}
      </p>
      <div className="pl-checks" role="group" aria-label="Lista de comprobación">
        {ej.checklist.map((c, i) => {
          const on = marcados.includes(i);
          return (
            <label key={i} className={`pl-check${on ? ' on' : ''}`}>
              <input type="checkbox" checked={on} onChange={() => acciones.toggleDemo(ej.id, i)} />
              <span>{t(c)}</span>
            </label>
          );
        })}
      </div>

      {problemas.length > 0 ? (
        <>
          <h2 className="pl-h" id="problemas">
            Si algo falla
          </h2>
          {quitados > 0 && <p className="muted">Además de los avisos «Ojo» del Concepto:</p>}
          <dl className="pl-problemas">
            {problemas.map((pr, i) => (
              <div key={i}>
                <dt>{t(pr.problema)}</dt>
                <dd>{t(pr.solucion)}</dd>
              </div>
            ))}
          </dl>
        </>
      ) : (
        quitados > 0 && <p className="muted pl-nota">Si algo falla, repasa los avisos «Ojo» del Concepto: ahí está cómo resolver los errores más frecuentes.</p>
      )}
    </div>
  );
}
