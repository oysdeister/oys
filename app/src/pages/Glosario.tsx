import { useEffect, useMemo, useRef, useState, type CSSProperties } from 'react';
import { useLocation } from 'react-router-dom';
import { motion, useReducedMotion } from 'framer-motion';
import { Icon } from '../components/Icon';
import { META } from '../content';
import { GLOSARIO, MODULOS_GLOSARIO, normaliza } from '../content/glosario';
import { useProgreso } from '../lib/progress';
import { conIni } from '../lib/texto';
import './glosario.css';

const nombreMod = (id: string) => META[id]?.corto ?? 'Curso';
const colorMod = (id: string) => META[id]?.color ?? 'var(--arc)';
const inicial = (s: string) => {
  const c = normaliza(s).charAt(0).toUpperCase();
  return /[A-Z]/.test(c) ? c : '#';
};

/** Página «Glosario»: todos los términos de los módulos, con buscador y filtro por módulo */
export default function Glosario() {
  const ini = useProgreso().alumno.ini;
  const [q, setQ] = useState('');
  const [mod, setMod] = useState<string>('');
  const loc = useLocation();
  const reducir = useReducedMotion();
  const buscador = useRef<HTMLInputElement>(null);

  const lista = useMemo(() => {
    const t = normaliza(q);
    return GLOSARIO.filter((g) => (!mod || g.modulos.includes(mod)) && (!t || normaliza(`${g.termino} ${g.definicion} ${g.ejemplo ?? ''}`).includes(t))).sort((a, b) => {
      // con búsqueda, primero los que empiezan por lo buscado
      if (!t) return 0;
      const pa = normaliza(a.termino).startsWith(t) ? 0 : normaliza(a.termino).includes(t) ? 1 : 2;
      const pb = normaliza(b.termino).startsWith(t) ? 0 : normaliza(b.termino).includes(t) ? 1 : 2;
      return pa - pb;
    });
  }, [q, mod]);

  const grupos = useMemo(() => {
    if (q.trim()) return [{ letra: '', items: lista }];
    const m = new Map<string, typeof lista>();
    for (const g of lista) {
      const l = inicial(g.termino);
      m.set(l, [...(m.get(l) ?? []), g]);
    }
    return [...m.entries()].map(([letra, items]) => ({ letra, items }));
  }, [lista, q]);

  // Ancla /glosario#clave: baja hasta el término y lo resalta
  useEffect(() => {
    const clave = decodeURIComponent(loc.hash.replace(/^#/, ''));
    if (!clave) return;
    const el = document.getElementById(`gl-${clave}`);
    if (el) {
      el.scrollIntoView({ behavior: reducir ? 'auto' : 'smooth', block: 'center' });
      el.classList.add('destacado');
    }
  }, [loc.hash, reducir]);

  const vacio = GLOSARIO.length === 0;

  return (
    <div className="wrap gls">
      <header className="ax-banner gls-banner">
        <div className="gls-banner-in">
          <span className="gls-orb" aria-hidden="true">
            <Icon name="libro" size={40} />
          </span>
          <div>
            <p className="kick">Diccionario del curso</p>
            <h1 className="gls-h1">Glosario</h1>
            <p className="lead">
              Las palabras de finanzas y del ERP explicadas para quien viene de programar. En los ejercicios aparecen <span className="gls-demo">subrayadas así</span>: pasa el ratón por encima o tócalas para leer qué significan.
            </p>
          </div>
          {!vacio && (
            <div className="gls-cifra" aria-label={`${GLOSARIO.length} términos`}>
              <b>{GLOSARIO.length}</b>
              <span>términos</span>
            </div>
          )}
        </div>
      </header>

      {vacio ? (
        <div className="gls-vacio ax-panel">
          <Icon name="libro" size={34} />
          <h2>El glosario se está escribiendo</h2>
          <p className="muted">Todavía no hay términos. En cuanto los módulos tengan su vocabulario aparecerá aquí, y se resaltará también dentro de los bloques.</p>
        </div>
      ) : (
        <>
          <div className="gls-filtros" role="search">
            <label className="gls-buscar">
              <Icon name="buscar" size={20} />
              <span className="sr-only">Buscar un término</span>
              <input ref={buscador} type="search" value={q} onChange={(e) => setQ(e.target.value)} placeholder="Buscar: efecto, remesa, IVA…" autoComplete="off" />
              {q && (
                <button
                  type="button"
                  className="gls-limpiar"
                  onClick={() => {
                    setQ('');
                    buscador.current?.focus();
                  }}
                  aria-label="Borrar la búsqueda"
                >
                  <Icon name="cerrar" size={16} />
                </button>
              )}
            </label>
            {MODULOS_GLOSARIO.length > 1 && (
              <div className="gls-chips" role="group" aria-label="Filtrar por módulo">
                <button type="button" className={`gls-chip${!mod ? ' on' : ''}`} aria-pressed={!mod} onClick={() => setMod('')}>
                  Todos
                </button>
                {MODULOS_GLOSARIO.map((id) => (
                  <button
                    key={id}
                    type="button"
                    className={`gls-chip${mod === id ? ' on' : ''}`}
                    aria-pressed={mod === id}
                    onClick={() => setMod(mod === id ? '' : id)}
                    style={{ ['--mod' as string]: colorMod(id) } as CSSProperties}
                  >
                    <i aria-hidden="true" />
                    {nombreMod(id)}
                  </button>
                ))}
              </div>
            )}
          </div>

          <p className="gls-cuenta" aria-live="polite">
            {lista.length === 0 ? 'Ningún término coincide.' : lista.length === 1 ? '1 término' : `${lista.length} términos`}
            {mod && ` en ${nombreMod(mod)}`}
            {q.trim() && ` con «${q.trim()}»`}
          </p>

          {lista.length === 0 ? (
            <div className="gls-vacio ax-panel">
              <Icon name="buscar" size={30} />
              <h2>No lo encuentro</h2>
              <p className="muted">Prueba con otra palabra o quita el filtro de módulo.</p>
              <button
                type="button"
                className="btn sm"
                onClick={() => {
                  setQ('');
                  setMod('');
                }}
              >
                Ver todos los términos
              </button>
            </div>
          ) : (
            grupos.map((gr) => (
              <section key={gr.letra || 'res'} className="gls-grupo" aria-label={gr.letra ? `Letra ${gr.letra}` : 'Resultados'}>
                {gr.letra && (
                  <h2 className="gls-letra" aria-hidden="true">
                    {gr.letra}
                  </h2>
                )}
                <dl className="gls-lista">
                  {gr.items.map((g, i) => (
                    <motion.div
                      key={g.clave}
                      id={`gl-${g.clave}`}
                      className="gls-item"
                      style={{ ['--mod' as string]: colorMod(g.modulos[0]) } as CSSProperties}
                      initial={reducir ? false : { opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3, delay: Math.min(i, 8) * 0.025 }}
                    >
                      <dt>{g.termino}</dt>
                      <dd>
                        <p>{conIni(g.definicion, ini)}</p>
                        {g.ejemplo && (
                          <p className="gls-ej">
                            <span>Ejemplo</span>
                            {conIni(g.ejemplo, ini)}
                          </p>
                        )}
                        <p className="gls-mods">
                          {g.modulos.map((m) => (
                            <span key={m} style={{ ['--mod' as string]: colorMod(m) } as CSSProperties}>
                              {nombreMod(m)}
                            </span>
                          ))}
                        </p>
                      </dd>
                    </motion.div>
                  ))}
                </dl>
              </section>
            ))
          )}
        </>
      )}
    </div>
  );
}
