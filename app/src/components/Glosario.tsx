import { Fragment, createContext, useCallback, useContext, useEffect, useId, useLayoutEffect, useRef, useState, type ReactNode } from 'react';
import { createPortal } from 'react-dom';
import { META } from '../content';
import { trocear, type Termino } from '../content/glosario';
import { useProgreso } from '../lib/progress';
import { conIni } from '../lib/texto';
import '../pages/glosario.css';

const nombreMod = (id: string) => META[id]?.corto ?? 'Curso';

interface Pos {
  left: number;
  top: number;
  arriba: boolean;
  flecha: number;
}

/**
 * Término del glosario dentro de un texto: subrayado punteado que explica la palabra.
 * Ratón: al pasar por encima. Teclado: al enfocarlo (Tab). Móvil: al tocarlo (y otro toque, fuera o en él, lo cierra).
 * Escape lo cierra. La explicación es un tooltip (role="tooltip") enlazado con aria-describedby.
 */
export function TerminoGlosario({ t, children }: { t: Termino; children: string }) {
  const [abierto, setAbierto] = useState(false);
  const [pos, setPos] = useState<Pos | null>(null);
  const btn = useRef<HTMLButtonElement>(null);
  const caja = useRef<HTMLDivElement>(null);
  const timer = useRef<number | undefined>(undefined);
  const fijado = useRef(false);
  const id = useId();
  const ini = useProgreso().alumno.ini;
  const def = conIni(t.definicion, ini);
  const ej = t.ejemplo ? conIni(t.ejemplo, ini) : '';

  const abrir = useCallback((demora = 0) => {
    window.clearTimeout(timer.current);
    timer.current = window.setTimeout(() => setAbierto(true), demora);
  }, []);
  const cerrar = useCallback((demora = 0) => {
    window.clearTimeout(timer.current);
    timer.current = window.setTimeout(() => {
      fijado.current = false;
      setAbierto(false);
    }, demora);
  }, []);
  useEffect(() => () => window.clearTimeout(timer.current), []);

  const colocar = useCallback(() => {
    const b = btn.current?.getBoundingClientRect();
    const c = caja.current?.getBoundingClientRect();
    if (!b || !c) return;
    const vw = window.innerWidth;
    const vh = window.innerHeight;
    const margen = 12;
    const centro = b.left + b.width / 2;
    const left = Math.min(Math.max(centro - c.width / 2, margen), vw - c.width - margen);
    const abajo = vh - b.bottom;
    const arriba = abajo < c.height + 20 && b.top > abajo;
    const top = Math.min(Math.max(arriba ? b.top - c.height - 10 : b.bottom + 10, margen), vh - c.height - margen);
    setPos({ left, top, arriba, flecha: Math.min(Math.max(centro - left, 18), c.width - 18) });
  }, []);

  useLayoutEffect(() => {
    if (!abierto) {
      setPos(null);
      return;
    }
    colocar();
    const fuera = (e: PointerEvent) => {
      const n = e.target as Node;
      if (btn.current?.contains(n) || caja.current?.contains(n)) return;
      cerrar();
    };
    const tecla = (e: KeyboardEvent) => {
      if (e.key === 'Escape') cerrar();
    };
    window.addEventListener('scroll', colocar, true);
    window.addEventListener('resize', colocar);
    document.addEventListener('pointerdown', fuera);
    document.addEventListener('keydown', tecla, true);
    return () => {
      window.removeEventListener('scroll', colocar, true);
      window.removeEventListener('resize', colocar);
      document.removeEventListener('pointerdown', fuera);
      document.removeEventListener('keydown', tecla, true);
    };
  }, [abierto, colocar, cerrar]);

  return (
    <>
      <button
        ref={btn}
        type="button"
        className={`gl-term${abierto ? ' on' : ''}`}
        aria-describedby={id}
        onPointerEnter={(e) => e.pointerType === 'mouse' && abrir(120)}
        onPointerLeave={(e) => e.pointerType === 'mouse' && !fijado.current && cerrar(160)}
        onFocus={() => abrir()}
        onBlur={() => cerrar()}
        onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
          // Con ratón el hover ya lo abrió: el clic lo deja fijo. En táctil alterna.
          if (abierto && fijado.current) cerrar();
          else {
            fijado.current = true;
            abrir();
          }
        }}
      >
        {children}
      </button>
      {/* La definición siempre está en el DOM (oculta) para que el lector la anuncie al enfocar; el tooltip visual va aparte */}
      <span id={id} hidden>
        {`Glosario: ${def}${ej ? ` Ejemplo: ${ej}` : ''}`}
      </span>
      {abierto &&
        createPortal(
          <div
            ref={caja}
            role="tooltip"
            aria-hidden="true"
            className={`gl-pop${pos?.arriba ? ' arriba' : ''}`}
            style={pos ? { left: pos.left, top: pos.top, ['--flecha' as string]: `${pos.flecha}px` } : { left: -9999, top: 0, visibility: 'hidden' }}
            onPointerEnter={(e) => e.pointerType === 'mouse' && abrir()}
            onPointerLeave={(e) => e.pointerType === 'mouse' && !fijado.current && cerrar(160)}
          >
            <span className="gl-pop-k">Glosario</span>
            <b className="gl-pop-t">{t.termino}</b>
            <span className="gl-pop-d">{def}</span>
            {ej && (
              <span className="gl-pop-e">
                <i>Ejemplo</i> {ej}
              </span>
            )}
            <span className="gl-pop-m">
              {t.modulos.slice(0, 3).map((m) => (
                <span key={m} style={{ ['--mod' as string]: META[m]?.color ?? 'var(--arc)' }}>
                  {nombreMod(m)}
                </span>
              ))}
            </span>
          </div>,
          document.body,
        )}
    </>
  );
}

/** Ámbito de lectura (una parte del Concepto): qué Glosa marcó primero cada término */
const AmbitoGlosa = createContext<Map<string, string> | null>(null);

/**
 * Dentro de un ámbito, cada término del glosario se marca solo la primera vez que sale;
 * las demás apariciones quedan como texto normal (menos ruido al leer).
 */
export function GlosaAmbito({ children }: { children: ReactNode }) {
  const mapa = useRef<Map<string, string>>(new Map());
  return <AmbitoGlosa.Provider value={mapa.current}>{children}</AmbitoGlosa.Provider>;
}

/**
 * Texto con los términos del glosario resaltados (solo la primera aparición de cada uno,
 * en el texto o, si hay un GlosaAmbito por encima, en todo el ámbito).
 * Sin glosario cargado devuelve el texto tal cual. No usar dentro de <button> ni <a>.
 */
export function Glosa({ children }: { children: string | null | undefined }) {
  const ambito = useContext(AmbitoGlosa);
  const yo = useId();
  if (!children) return null;
  const trozos = trocear(children);
  if (trozos.length === 1 && typeof trozos[0] === 'string') return <>{children}</>;
  const out: ReactNode[] = [];
  // Signo de puntuación pegado a un término: va con él, para que la línea no empiece por «,» o «)»
  let pegado = '';
  trozos.forEach((tr, i) => {
    if (typeof tr === 'string') {
      const resto = pegado ? tr.slice(pegado.length) : tr;
      pegado = '';
      if (resto) out.push(<Fragment key={i}>{resto}</Fragment>);
      return;
    }
    if (ambito) {
      // El primer texto que lo usa se queda el término (estable entre renders: se guarda su id)
      const dueno = ambito.get(tr.t.clave);
      if (!dueno) ambito.set(tr.t.clave, yo);
      else if (dueno !== yo) {
        out.push(<Fragment key={i}>{tr.texto}</Fragment>);
        return;
      }
    }
    const sig = trozos[i + 1];
    pegado = typeof sig === 'string' ? (sig.match(/^[.,;:)»?!…]+/)?.[0] ?? '') : '';
    const termino = (
      <TerminoGlosario key={i} t={tr.t}>
        {tr.texto}
      </TerminoGlosario>
    );
    out.push(
      pegado ? (
        <span key={i} className="gl-nw">
          {termino}
          {pegado}
        </span>
      ) : (
        termino
      ),
    );
  });
  return <>{out}</>;
}
