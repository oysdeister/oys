import { motion, useReducedMotion } from 'framer-motion';
import { Icon } from '../Icon';
import { META } from '../../content';
import { aciertaTeoria, NOMBRE_TIPO, tipoDe, type BloqueTeoria, type PreguntaExamen, type RespuestaTeoria } from '../../lib/examen';
import { SECUENCIA } from './Deco';
import { capituloDe, posterDe } from './Preguntas';

const ICONO: Record<string, string> = { test: 'cerebro', clic: 'taller', orden: 'grip', relacion: 'flecha', dato: 'asiento' };

/** Constelación del resultado: cada pregunta se enciende en su sitio, en turquesa si aciertas y en rojo si fallas */
export function Constelacion({ teoria, resp, inicio = SECUENCIA.veredicto + 0.5 }: { teoria: PreguntaExamen[]; resp: RespuestaTeoria[]; inicio?: number }) {
  const reducir = useReducedMotion();
  const paso = Math.min(0.06, 1.6 / Math.max(1, teoria.length));
  return (
    <ol className="exr-constelacion" aria-label="Resultado pregunta a pregunta">
      {teoria.map((q, k) => {
        const ok = aciertaTeoria(q, resp[k]);
        const tipo = tipoDe(q);
        const retraso = reducir ? 0 : inicio + k * paso;
        return (
          <motion.li
            key={k}
            className={`exr-estrella ${ok ? 'ok' : 'ko'}`}
            style={{ animationDelay: `${retraso}s` }}
            initial={reducir ? false : { opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: retraso, duration: 0.45, ease: [0.2, 0.8, 0.2, 1] }}
            title={`Pregunta ${k + 1} · ${NOMBRE_TIPO[tipo]}`}
          >
            <span className="exr-estrella-n">{k + 1}</span>
            <Icon name={ICONO[tipo]} size={12} />
            <span className="sr-only">
              , {NOMBRE_TIPO[tipo]}, {ok ? 'bien' : 'mal'}
            </span>
          </motion.li>
        );
      })}
    </ol>
  );
}

function Barra({ v, retraso }: { v: number; retraso: number }) {
  const reducir = useReducedMotion();
  return (
    <span className="exr-barra" aria-hidden="true">
      <motion.i className={v >= 0.8 ? 'ok' : v >= 0.5 ? 'medio' : 'ko'} initial={reducir ? false : { width: 0 }} animate={{ width: `${Math.max(4, v * 100)}%` }} transition={{ delay: reducir ? 0 : retraso, duration: 0.7, ease: [0.2, 0.7, 0.2, 1] }} />
    </span>
  );
}

/** Desglose de la teoría: módulos como planetas y capítulos del vídeo con su fotograma */
export function DesgloseTeoria({ bloques }: { bloques: BloqueTeoria[] }) {
  const reducir = useReducedMotion();
  const mods = bloques.filter((b) => b.clase === 'modulo');
  const caps = bloques.filter((b) => b.clase === 'video');
  const crit = bloques.find((b) => b.clase === 'criterio');
  const d = (s: number) => (reducir ? 0 : s);
  return (
    <div className="exr-desglose">
      <div>
        <h3>Por módulo</h3>
        <ul className="exr-mods">
          {mods.map((b, k) => {
            const meta = META[b.clave];
            const v = b.total ? b.aciertos / b.total : 0;
            return (
              <motion.li key={b.clave} initial={reducir ? false : { opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: d(0.2 + k * 0.08) }} style={{ ['--mod' as string]: meta?.color ?? 'var(--arc)' }}>
                <span className="exr-planeta" aria-hidden="true">
                  <Icon name={meta?.icono ?? 'examen'} size={16} />
                </span>
                <span className="exr-nom">{b.nombre}</span>
                <Barra v={v} retraso={0.3 + k * 0.08} />
                <b className="exr-num">
                  {b.aciertos}/{b.total}
                </b>
              </motion.li>
            );
          })}
          {crit && (
            <li style={{ ['--mod' as string]: '#f6b65a' }}>
              <span className="exr-planeta" aria-hidden="true">
                <Icon name="cerebro" size={16} />
              </span>
              <span className="exr-nom">Criterio</span>
              <Barra v={crit.total ? crit.aciertos / crit.total : 0} retraso={0.9} />
              <b className="exr-num">
                {crit.aciertos}/{crit.total}
              </b>
            </li>
          )}
        </ul>
      </div>
      {caps.length > 0 && (
        <div>
          <h3>Por capítulo del vídeo</h3>
          <ul className="exr-caps">
            {caps.map((b, k) => {
              const n = Number(b.clave.slice(3));
              const ok = b.aciertos === b.total;
              const poster = posterDe(n);
              return (
                <motion.li
                  key={b.clave}
                  className={ok ? 'ok' : b.aciertos ? 'medio' : 'ko'}
                  initial={reducir ? false : { opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: d(0.3 + k * 0.06), duration: 0.5 }}
                  title={capituloDe(n)?.titulo}
                >
                  {poster && <img src={poster} alt="" loading="lazy" />}
                  <span className="exr-cap-n">Cap. {n}</span>
                  <span className="exr-cap-r">
                    {b.aciertos}/{b.total}
                    <span className="sr-only"> en el capítulo {n}: {capituloDe(n)?.titulo}</span>
                  </span>
                </motion.li>
              );
            })}
          </ul>
        </div>
      )}
    </div>
  );
}
