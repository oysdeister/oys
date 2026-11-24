import { useCallback, useEffect, useMemo, useRef, useState, type CSSProperties, type ReactNode } from 'react';
import { useLocation } from 'react-router-dom';
import { animate, motion, useReducedMotion } from 'framer-motion';
import { Icon } from '../components/Icon';
import { META } from '../content';
import { GLOSARIO, MODULOS_GLOSARIO, normaliza, type Termino } from '../content/glosario';
import { useProgreso } from '../lib/progress';
import { conIni } from '../lib/texto';
import './glosario.css';

const nombreMod = (id: string) => META[id]?.corto ?? 'Curso';
const colorMod = (id: string) => META[id]?.color ?? 'var(--arc)';
const iconoMod = (id: string) => META[id]?.icono ?? 'libro';
const varMod = (id: string) => ({ ['--mod' as string]: colorMod(id) }) as CSSProperties;
const inicial = (s: string) => {
  const c = normaliza(s).charAt(0).toUpperCase();
  return /[A-Z]/.test(c) ? c : '#';
};
const LETRAS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');
const SUGERENCIAS = ['efecto', 'remesa', 'IVA', 'asiento', 'factura'];

/** Texto de búsqueda de un término (término, alias, definición y ejemplo) */
const pajar = (g: Termino) => normaliza(`${g.termino} ${g.alias.join(' ')} ${g.definicion} ${g.ejemplo ?? ''}`);
const coincide = (g: Termino, t: string) => !t || pajar(g).includes(t);

/** Marca las coincidencias de «t» (ya normalizado) en «texto», sin tener en cuenta tildes ni mayúsculas */
function resaltar(texto: string, t: string): ReactNode {
  if (!t) return texto;
  // cada carácter original se normaliza a uno solo, así que los índices coinciden
  const plano = [...texto].map((c) => c.toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '').charAt(0) || c).join('');
  const out: ReactNode[] = [];
  let desde = 0;
  let i = plano.indexOf(t);
  while (i >= 0 && t.length > 0) {
    if (i > desde) out.push(texto.slice(desde, i));
    out.push(
      <mark key={i} className="gls-mark">
        {texto.slice(i, i + t.length)}
      </mark>,
    );
    desde = i + t.length;
    i = plano.indexOf(t, desde);
  }
  if (desde < texto.length) out.push(texto.slice(desde));
  return out.length ? out : texto;
}

/** Cifra que sube de 0 al total al entrar (sin animación si se pide menos movimiento) */
function Cifra({ valor }: { valor: number }) {
  const reducir = useReducedMotion();
  const [n, setN] = useState(reducir ? valor : 0);
  useEffect(() => {
    if (reducir) {
      setN(valor);
      return;
    }
    const c = animate(0, valor, { duration: 1.4, ease: [0.2, 0.7, 0.2, 1], onUpdate: (v) => setN(Math.round(v)) });
    return () => c.stop();
  }, [valor, reducir]);
  return <>{n}</>;
}

/** Página «Glosario»: todos los términos de los módulos, con buscador, índice A-Z y filtro por familia (módulo) */
export default function Glosario() {
  const ini = useProgreso().alumno.ini;
  const [q, setQ] = useState('');
  const [mod, setMod] = useState<string>('');
  const [activa, setActiva] = useState('');
  const loc = useLocation();
  const reducir = useReducedMotion();
  const buscador = useRef<HTMLInputElement>(null);
  const indice = useRef<HTMLElement>(null);

  const t = normaliza(q);
  const buscando = t.length > 0;

  const lista = useMemo(() => {
    return GLOSARIO.filter((g) => (!mod || g.modulos.includes(mod)) && coincide(g, t)).sort((a, b) => {
      // con búsqueda, primero los que empiezan por lo buscado
      if (!t) return 0;
      const pa = normaliza(a.termino).startsWith(t) ? 0 : normaliza(a.termino).includes(t) ? 1 : 2;
      const pb = normaliza(b.termino).startsWith(t) ? 0 : normaliza(b.termino).includes(t) ? 1 : 2;
      return pa - pb;
    });
  }, [t, mod]);

  // términos por familia con la búsqueda actual (sin contar el filtro de familia)
  const porFamilia = useMemo(() => {
    const m: Record<string, number> = {};
    let total = 0;
    for (const g of GLOSARIO) {
      if (!coincide(g, t)) continue;
      total++;
      for (const id of g.modulos) m[id] = (m[id] ?? 0) + 1;
    }
    return { m, total };
  }, [t]);

  const grupos = useMemo(() => {
    if (buscando) return [{ letra: '', items: lista }];
    const m = new Map<string, typeof lista>();
    for (const g of lista) {
      const l = inicial(g.termino);
      m.set(l, [...(m.get(l) ?? []), g]);
    }
    return [...m.entries()].map(([letra, items]) => ({ letra, items }));
  }, [lista, buscando]);

  const conLetra = useMemo(() => new Set(grupos.map((g) => g.letra).filter(Boolean)), [grupos]);
  const letras = useMemo(() => (conLetra.has('#') ? ['#', ...LETRAS] : LETRAS), [conLetra]);

  // Atajo «/» para ir al buscador; Esc dentro del buscador lo vacía
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key !== '/' || e.metaKey || e.ctrlKey || e.altKey) return;
      const el = e.target as HTMLElement | null;
      if (el && (el.isContentEditable || /^(INPUT|TEXTAREA|SELECT)$/.test(el.tagName))) return;
      e.preventDefault();
      buscador.current?.focus();
      buscador.current?.select();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  // Letra activa al desplazarse: la sección que cruza la franja de arriba
  useEffect(() => {
    if (buscando) {
      setActiva('');
      return;
    }
    const secciones = [...document.querySelectorAll<HTMLElement>('.gls-grupo[data-letra]')];
    if (!secciones.length || typeof IntersectionObserver === 'undefined') return;
    const obs = new IntersectionObserver(
      (entradas) => {
        for (const e of entradas) if (e.isIntersecting) setActiva((e.target as HTMLElement).dataset.letra ?? '');
      },
      { rootMargin: '-200px 0px -65% 0px' },
    );
    secciones.forEach((s) => obs.observe(s));
    return () => obs.disconnect();
  }, [grupos, buscando]);

  // En la fila horizontal (móvil), la letra activa se mantiene a la vista
  useEffect(() => {
    const cont = indice.current;
    if (!cont || !activa || cont.scrollWidth <= cont.clientWidth) return;
    const b = cont.querySelector<HTMLElement>(`[data-l="${activa}"]`);
    if (b) cont.scrollTo({ left: b.offsetLeft - cont.clientWidth / 2 + b.clientWidth / 2, behavior: reducir ? 'auto' : 'smooth' });
  }, [activa, reducir]);

  const irALetra = useCallback(
    (l: string) => {
      const el = document.getElementById(`gls-letra-${l}`);
      if (!el) return;
      setActiva(l);
      el.scrollIntoView({ behavior: reducir ? 'auto' : 'smooth', block: 'start' });
    },
    [reducir],
  );

  // Ancla /glosario#clave: baja hasta el término y lo resalta con un pulso
  useEffect(() => {
    const clave = decodeURIComponent(loc.hash.replace(/^#/, ''));
    if (!clave) return;
    const el = document.getElementById(`gl-${clave}`);
    if (!el) return;
    const id = window.setTimeout(() => {
      el.scrollIntoView({ behavior: reducir ? 'auto' : 'smooth', block: 'center' });
      el.classList.remove('destacado');
      void el.offsetWidth; // reinicia el pulso si se vuelve al mismo término
      el.classList.add('destacado');
    }, 60);
    return () => window.clearTimeout(id);
  }, [loc.hash, reducir]);

  const limpiar = () => {
    setQ('');
    buscador.current?.focus();
  };
  const verTodo = () => {
    setQ('');
    setMod('');
  };

  const vacio = GLOSARIO.length === 0;
  const sugerencias = SUGERENCIAS.filter((s) => normaliza(s) !== t && GLOSARIO.some((g) => coincide(g, normaliza(s)))).slice(0, 4);

  return (
    <div className="wrap gls">
      <header className="ax-banner gls-banner">
        <div className="gls-banner-in">
          <div className="gls-astro" aria-hidden="true">
            <span className="gls-orbita">
              {MODULOS_GLOSARIO.map((id, i) => (
                <i key={id} style={{ ...varMod(id), ['--a' as string]: `${(360 / Math.max(MODULOS_GLOSARIO.length, 1)) * i}deg` } as CSSProperties} />
              ))}
            </span>
            <span className="gls-orb">
              <Icon name="libro" size={40} />
            </span>
          </div>
          <div className="gls-banner-txt">
            <p className="kick">Diccionario del curso</p>
            <h1 className="gls-h1">Glosario</h1>
            <p className="lead">
              Las palabras de finanzas y del ERP explicadas en lenguaje llano, sin dar nada por sabido. En los bloques aparecen <span className="gls-demo">subrayadas así</span>: pasa el ratón por encima o tócalas para leer qué significan.
            </p>
          </div>
          {!vacio && (
            <div className="gls-cifra" aria-label={`${GLOSARIO.length} términos en ${MODULOS_GLOSARIO.length} módulos`}>
              <b aria-hidden="true">
                <Cifra valor={GLOSARIO.length} />
              </b>
              <span aria-hidden="true">términos</span>
              {MODULOS_GLOSARIO.length > 1 && (
                <small aria-hidden="true">
                  en {MODULOS_GLOSARIO.length} módulos
                </small>
              )}
            </div>
          )}
        </div>
      </header>

      {vacio ? (
        <div className="gls-vacio">
          <span className="gls-vacio-ico">
            <Icon name="libro" size={34} />
          </span>
          <h2>El glosario se está escribiendo</h2>
          <p className="muted">Todavía no hay términos. En cuanto los módulos tengan su vocabulario aparecerá aquí, y se resaltará también dentro de los bloques.</p>
        </div>
      ) : (
        <>
          <div className="gls-barra" role="search">
            <label className="gls-buscar">
              <span className="gls-buscar-ico">
                <Icon name="buscar" size={22} />
              </span>
              <span className="sr-only">Buscar un término</span>
              <input
                ref={buscador}
                type="search"
                value={q}
                onChange={(e) => setQ(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Escape' && q) {
                    e.preventDefault();
                    setQ('');
                  }
                }}
                placeholder="Buscar: efecto, remesa, IVA…"
                autoComplete="off"
                spellCheck={false}
                aria-label="Buscar un término"
                aria-describedby="gls-cuenta"
              />
              {!q && (
                <kbd className="gls-atajo" aria-hidden="true" title="Pulsa / para buscar">
                  /
                </kbd>
              )}
              <span className={`gls-n${lista.length === 0 ? ' cero' : ''}`} id="gls-cuenta" aria-live="polite">
                <b>{lista.length}</b>
                <span className="gls-n-txt">
                  {lista.length === 1 ? ' término' : ' términos'}
                  {mod && <span className="sr-only"> en {nombreMod(mod)}</span>}
                  {buscando && <span className="sr-only"> con «{q.trim()}»</span>}
                </span>
              </span>
              {q && (
                <button type="button" className="gls-limpiar" onClick={limpiar} aria-label="Borrar la búsqueda">
                  <Icon name="cerrar" size={18} />
                </button>
              )}
            </label>
          </div>

          {MODULOS_GLOSARIO.length > 1 && (
            <div className="gls-chips" role="group" aria-label="Filtrar por módulo">
              <button type="button" className={`gls-chip todos${!mod ? ' on' : ''}`} aria-pressed={!mod} onClick={() => setMod('')}>
                <span className="gls-chip-ico">
                  <Icon name="destello" size={16} />
                </span>
                Todos
                <span className="gls-chip-n">{porFamilia.total}</span>
              </button>
              {MODULOS_GLOSARIO.map((id) => {
                const n = porFamilia.m[id] ?? 0;
                return (
                  <button
                    key={id}
                    type="button"
                    className={`gls-chip${mod === id ? ' on' : ''}${n === 0 ? ' cero' : ''}`}
                    aria-pressed={mod === id}
                    onClick={() => setMod(mod === id ? '' : id)}
                    style={varMod(id)}
                  >
                    <span className="gls-chip-ico">
                      <Icon name={iconoMod(id)} size={16} />
                    </span>
                    {nombreMod(id)}
                    <span className="gls-chip-n">{n}</span>
                  </button>
                );
              })}
            </div>
          )}

          <div className={`gls-cuerpo${buscando ? ' buscando' : ''}`}>
            <nav className="gls-az" aria-label="Índice alfabético" ref={indice}>
              {letras.map((l) => {
                const hay = conLetra.has(l);
                return (
                  <button
                    key={l}
                    type="button"
                    data-l={l}
                    className={`gls-az-l${hay ? '' : ' sin'}${activa === l ? ' on' : ''}`}
                    disabled={!hay}
                    aria-current={activa === l ? 'true' : undefined}
                    aria-label={hay ? `Ir a la letra ${l}` : `Letra ${l}, sin términos`}
                    onClick={() => irALetra(l)}
                  >
                    {l}
                  </button>
                );
              })}
            </nav>

            <div className="gls-lista-wrap">
              {lista.length === 0 ? (
                <div className="gls-vacio">
                  <span className="gls-vacio-ico">
                    <Icon name="buscar" size={30} />
                  </span>
                  <h2>No lo encuentro</h2>
                  <p className="muted">
                    {mod && porFamilia.total > 0
                      ? `En ${nombreMod(mod)} no sale, pero hay ${porFamilia.total === 1 ? '1 término' : `${porFamilia.total} términos`} en otros módulos.`
                      : 'Prueba con otra palabra o quita el filtro de módulo.'}
                  </p>
                  <div className="gls-vacio-acc">
                    {mod && porFamilia.total > 0 ? (
                      <button type="button" className="btn sm" onClick={() => setMod('')}>
                        Buscar en todos los módulos
                      </button>
                    ) : (
                      <button type="button" className="btn sm" onClick={verTodo}>
                        Ver todos los términos
                      </button>
                    )}
                  </div>
                  {sugerencias.length > 0 && (
                    <div className="gls-sug">
                      <span>Prueba con</span>
                      {sugerencias.map((s) => (
                        <button
                          key={s}
                          type="button"
                          className="gls-sug-b"
                          onClick={() => {
                            setMod('');
                            setQ(s);
                          }}
                        >
                          {s}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              ) : (
                grupos.map((gr) => (
                  <section
                    key={gr.letra || 'res'}
                    id={gr.letra ? `gls-letra-${gr.letra}` : undefined}
                    data-letra={gr.letra || undefined}
                    className="gls-grupo"
                    aria-label={gr.letra ? `Letra ${gr.letra}` : 'Resultados'}
                  >
                    {gr.letra && (
                      <div className="gls-grupo-cab" aria-hidden="true">
                        <span className="gls-letra">{gr.letra}</span>
                        <span className="gls-grupo-n">{gr.items.length === 1 ? '1 término' : `${gr.items.length} términos`}</span>
                      </div>
                    )}
                    <dl className="gls-lista">
                      {gr.items.map((g, i) => {
                        const fam = g.modulos[0];
                        return (
                          <motion.div
                            key={g.clave}
                            id={`gl-${g.clave}`}
                            className="gls-item"
                            style={varMod(fam)}
                            initial={reducir ? false : { opacity: 0, y: 14 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true, margin: '0px 0px -40px 0px' }}
                            transition={{ duration: 0.38, ease: [0.2, 0.7, 0.2, 1], delay: (i % 3) * 0.06 }}
                          >
                            <dt>
                              <span className="gls-fam" title={nombreMod(fam)}>
                                <Icon name={iconoMod(fam)} size={20} />
                              </span>
                              <span className="gls-term">{resaltar(g.termino, t)}</span>
                            </dt>
                            <dd>
                              <p className="gls-def">{conIni(g.definicion, ini)}</p>
                              {g.ejemplo && (
                                <p className="gls-ej">
                                  <span className="gls-ej-k">Ejemplo</span>
                                  {conIni(g.ejemplo, ini)}
                                </p>
                              )}
                              <p className="gls-mods">
                                {g.modulos.map((m) => (
                                  <span key={m} style={varMod(m)}>
                                    {nombreMod(m)}
                                  </span>
                                ))}
                              </p>
                            </dd>
                          </motion.div>
                        );
                      })}
                    </dl>
                  </section>
                ))
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
}
