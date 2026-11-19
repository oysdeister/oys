import { useEffect, useMemo, useState } from 'react';
import { Glosa } from '../Glosario';
import type { Ejercicio } from '../../types';
import { APROBADO, acciones, useProgreso } from '../../lib/progress';
import { conIni } from '../../lib/texto';
import { barajar } from './util';

const LETRAS = 'ABCDEFGH';

/**
 * Paso «Test» en plano: una pregunta cada vez, opciones en lista.
 * Solo cuenta como hecho al aprobar; hasta entonces la página no muestra su «Siguiente».
 */
export function TestEj({ ej, ini, onListo, onIr }: { ej: Ejercicio; ini: string; onListo: (listo: boolean) => void; onIr: (tab: string) => void }) {
  const p = useProgreso();
  const mejor = p.ejercicios[ej.id]?.test ?? null;
  const yaAprobado = mejor !== null && mejor >= APROBADO;
  const [intento, setIntento] = useState(0);
  const [i, setI] = useState(0);
  const [elegida, setElegida] = useState<number | null>(null);
  const [aciertos, setAciertos] = useState(0);
  // Aprobado otro día: empieza en el resultado (puede repetirlo)
  const [fin, setFin] = useState(yaAprobado);
  const [nota, setNota] = useState<number | null>(null);
  const t = (x: string) => conIni(x, ini);

  // Opciones barajadas por pregunta, nuevas en cada intento
  const ordenes = useMemo(() => ej.test.map((q) => barajar(q.opciones.map((_, k) => k))), [ej, intento]); // eslint-disable-line react-hooks/exhaustive-deps

  const aprobado = fin && (nota !== null ? nota >= APROBADO : yaAprobado);
  useEffect(() => { onListo(aprobado || !ej.test.length); }, [aprobado, ej.test.length, onListo]);

  if (!ej.test.length) return <p className="muted">Este bloque no tiene test.</p>;

  const q = ej.test[i];
  const total = ej.test.length;

  const elegir = (k: number) => {
    if (elegida !== null) return;
    setElegida(k);
    if (k === q.correcta) setAciertos((a) => a + 1);
  };

  const siguiente = () => {
    if (i >= total - 1) {
      const n = aciertos / total;
      acciones.notaTest(ej.id, n);
      setNota(n);
      setFin(true);
      return;
    }
    setI(i + 1);
    setElegida(null);
  };

  const reintentar = () => {
    setIntento((n) => n + 1);
    setI(0);
    setElegida(null);
    setAciertos(0);
    setNota(null);
    setFin(false);
  };

  if (fin) {
    const n = nota ?? mejor ?? 0;
    const ok = n >= APROBADO;
    return (
      <div className="pl pl-fin">
        <p className="pl-res">
          {nota !== null ? `${aciertos} de ${total} respuestas correctas (${Math.round(n * 100)} %).` : `Ya aprobaste este test con un ${Math.round(n * 100)} %.`}{' '}
          {nota === null ? '' : ok ? 'Aprobado.' : `Para aprobar necesitas un ${Math.round(APROBADO * 100)} %.`}
        </p>
        {!ok && (
          <p className="muted">
            Repasa el{' '}
            <button type="button" className="pl-link en-linea" onClick={() => onIr('concepto')}>
              Concepto
            </button>{' '}
            y vuelve a intentarlo: las opciones cambian de orden.
          </p>
        )}
        {ok && nota !== null && mejor !== null && mejor > n && <p className="muted">Tu mejor nota: {Math.round(mejor * 100)} %.</p>}
        {ok ? (
          <button type="button" className="pl-link" onClick={reintentar}>
            Repetir el test
          </button>
        ) : (
          <div className="pl-btns">
            <button type="button" className="btn arc" onClick={reintentar}>
              Volver a intentarlo
            </button>
          </div>
        )}
      </div>
    );
  }

  const acerto = elegida !== null && elegida === q.correcta;

  return (
    <div className="pl">
      <p className="pl-cont" aria-live="polite">
        <b>
          Pregunta {i + 1} de {total}
        </b>
      </p>
      <div className="pl-barra" aria-hidden="true">
        <i style={{ width: `${((i + (elegida !== null ? 1 : 0)) / total) * 100}%` }} />
      </div>
      <p className="pl-instr">
        <Glosa>{t(q.pregunta)}</Glosa>
      </p>
      <div className="pl-opcs" role="radiogroup" aria-label="Opciones" key={`${intento}-${i}`}>
        {ordenes[i].map((k, n) => {
          const clase = elegida === null ? '' : k === q.correcta ? ' bien' : k === elegida ? ' mal' : ' apagada';
          return (
            <button
              key={k}
              type="button"
              role="radio"
              aria-checked={elegida === k}
              className={`pl-opc${clase}`}
              onClick={() => elegir(k)}
              disabled={elegida !== null}
            >
              <span className="pl-letra">{LETRAS[n]}</span>
              <span>{t(q.opciones[k])}</span>
            </button>
          );
        })}
      </div>
      {elegida !== null && (
        <p className="pl-expl" aria-live="polite">
          <b>{acerto ? 'Correcto.' : 'No es correcta.'}</b> <Glosa>{t(q.explicacion)}</Glosa>
        </p>
      )}
      {elegida !== null && (
        <div className="pl-btns">
          <button type="button" className="btn arc" onClick={siguiente} autoFocus>
            {i >= total - 1 ? 'Ver el resultado' : 'Siguiente pregunta'}
          </button>
        </div>
      )}
    </div>
  );
}
