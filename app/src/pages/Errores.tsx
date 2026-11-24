import { useEffect, useMemo, useRef, useState, type CSSProperties, type ReactNode } from 'react';
import { Link } from 'react-router-dom';
import { Icon } from '../components/Icon';
import { META, MODULOS } from '../content';
import { sinTildes } from '../lib/buscar';
import { useProgreso } from '../lib/progress';
import { numeroBloque } from '../lib/ruta';
import { conIni } from '../lib/texto';
import './glosario.css';
import './errores.css';

interface Fila {
  modulo: string;
  bloqueId: string;
  bloque: string;
  n: number;
  problema: string;
  solucion: string;
  plano: string;
}

const nombreMod = (id: string) => META[id]?.corto ?? 'Curso';
const varMod = (id: string) => ({ ['--mod' as string]: META[id]?.color ?? 'var(--arc)' }) as CSSProperties;
const SUGERENCIAS = ['factura', 'asiento', 'remesa', 'no sale'];

/** Todos los pares problema/solución de los bloques, por módulo y en el orden del curso (se calcula una vez) */
const FILAS: Fila[] = MODULOS.flatMap((m) =>
  m.ejercicios.flatMap((ej) =>
    (ej.problemas ?? []).map((p) => ({
      modulo: m.id,
      bloqueId: ej.id,
      bloque: ej.titulo,
      n: numeroBloque(m, ej.id),
      problema: p.problema,
      solucion: p.solucion,
      plano: sinTildes(`${p.problema} ${p.solucion}`),
    })),
  ),
);

/** Marca las coincidencias de las palabras buscadas (ya sin tildes) */
function resaltar(texto: string, palabras: string[]): ReactNode {
  if (!palabras.length) return texto;
  const plano = sinTildes(texto);
  if (plano.length !== texto.length) return texto;
  const re = new RegExp(palabras.map((p) => p.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')).join('|'), 'g');
  const out: ReactNode[] = [];
  let desde = 0;
  for (const m of plano.matchAll(re)) {
    const i = m.index ?? 0;
    if (i > desde) out.push(texto.slice(desde, i));
    out.push(
      <mark key={i} className="gls-mark">
        {texto.slice(i, i + m[0].length)}
      </mark>,
    );
    desde = i + m[0].length;
  }
  if (desde < texto.length) out.push(texto.slice(desde));
  return <>{out}</>;
}

/** Página «Índice de errores»: qué hacer cuando algo no sale, con todos los avisos de los bloques */
export default function Errores() {
  const ini = useProgreso().alumno.ini;
  const [q, setQ] = useState('');
  const [mod, setMod] = useState('');
  const buscador = useRef<HTMLInputElement>(null);

  const palabras = useMemo(() => sinTildes(q).split(/[^a-z0-9ñ]+/).filter(Boolean), [q]);
  const buscando = palabras.length > 0;
  const casa = (f: Fila) => palabras.every((p) => f.plano.includes(p));

  const lista = useMemo(() => FILAS.filter((f) => (!mod || f.modulo === mod) && casa(f)), [mod, palabras]); // eslint-disable-line react-hooks/exhaustive-deps
  const porModulo = useMemo(() => {
    const m: Record<string, number> = {};
    let total = 0;
    for (const f of FILAS) {
      if (!casa(f)) continue;
      total++;
      m[f.modulo] = (m[f.modulo] ?? 0) + 1;
    }
    return { m, total };
  }, [palabras]); // eslint-disable-line react-hooks/exhaustive-deps

  const grupos = useMemo(
    () =>
      MODULOS.map((m) => ({ id: m.id, items: lista.filter((f) => f.modulo === m.id) })).filter((g) => g.items.length > 0),
    [lista],
  );
  const modulosConErrores = useMemo(() => MODULOS.map((m) => m.id).filter((id) => FILAS.some((f) => f.modulo === id)), []);

  // Atajo «/» para ir al buscador
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

  return (
    <div className="wrap gls">
      <header className="ax-banner gls-banner">
        <div className="gls-banner-in">
          <div className="gls-astro" aria-hidden="true">
            <span className="gls-orb">
              <Icon name="aviso" size={40} />
            </span>
          </div>
          <div className="gls-banner-txt">
            <p className="kick">Cuando algo no sale</p>
            <h1 className="gls-h1">Índice de errores</h1>
            <p className="lead">
              Todos los avisos de los bloques en un sitio: qué te puede pasar y cómo se arregla. Busca el mensaje o el síntoma y ve al bloque donde se explica.
            </p>
          </div>
          <div className="gls-cifra" aria-label={`${FILAS.length} errores en ${modulosConErrores.length} módulos`}>
            <b aria-hidden="true">{FILAS.length}</b>
            <span aria-hidden="true">errores</span>
            <small aria-hidden="true">en {modulosConErrores.length} módulos</small>
          </div>
        </div>
      </header>

      <div className="gls-barra" role="search">
        <label className="gls-buscar">
          <span className="gls-buscar-ico">
            <Icon name="buscar" size={22} />
          </span>
          <span className="sr-only">Buscar un error</span>
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
            placeholder="Buscar: no sale, no deja, descuadre…"
            autoComplete="off"
            spellCheck={false}
            aria-label="Buscar un error"
            aria-describedby="err-cuenta"
          />
          {!q && (
            <kbd className="gls-atajo" aria-hidden="true" title="Pulsa / para buscar">
              /
            </kbd>
          )}
          <span className={`gls-n${lista.length === 0 ? ' cero' : ''}`} id="err-cuenta" aria-live="polite">
            <b>{lista.length}</b>
            <span className="gls-n-txt">{lista.length === 1 ? ' error' : ' errores'}</span>
          </span>
          {q && (
            <button type="button" className="gls-limpiar" onClick={() => { setQ(''); buscador.current?.focus(); }} aria-label="Borrar la búsqueda">
              <Icon name="cerrar" size={18} />
            </button>
          )}
        </label>
      </div>

      <div className="gls-chips" role="group" aria-label="Filtrar por módulo">
        <button type="button" className={`gls-chip todos${!mod ? ' on' : ''}`} aria-pressed={!mod} onClick={() => setMod('')}>
          <span className="gls-chip-ico">
            <Icon name="destello" size={16} />
          </span>
          Todos
          <span className="gls-chip-n">{porModulo.total}</span>
        </button>
        {modulosConErrores.map((id) => {
          const n = porModulo.m[id] ?? 0;
          return (
            <button key={id} type="button" className={`gls-chip${mod === id ? ' on' : ''}${n === 0 ? ' cero' : ''}`} aria-pressed={mod === id} onClick={() => setMod(mod === id ? '' : id)} style={varMod(id)}>
              <span className="gls-chip-ico">
                <Icon name={META[id]?.icono ?? 'libro'} size={16} />
              </span>
              {nombreMod(id)}
              <span className="gls-chip-n">{n}</span>
            </button>
          );
        })}
      </div>

      {lista.length === 0 ? (
        <div className="gls-vacio">
          <span className="gls-vacio-ico">
            <Icon name="buscar" size={30} />
          </span>
          <h2>No lo encuentro</h2>
          <p className="muted">Prueba con otra palabra o quita el filtro de módulo.</p>
          <div className="gls-vacio-acc">
            <button type="button" className="btn sm" onClick={() => { setQ(''); setMod(''); }}>
              Ver todos los errores
            </button>
          </div>
          <div className="gls-sug">
            <span>Prueba con</span>
            {SUGERENCIAS.map((s) => (
              <button key={s} type="button" className="gls-sug-b" onClick={() => { setMod(''); setQ(s); }}>
                {s}
              </button>
            ))}
          </div>
        </div>
      ) : (
        grupos.map((g) => (
          <section key={g.id} className="err-grupo" style={varMod(g.id)} aria-label={nombreMod(g.id)}>
            <div className="err-grupo-cab">
              <span className="gls-chip-ico">
                <Icon name={META[g.id]?.icono ?? 'libro'} size={20} />
              </span>
              <h2>{nombreMod(g.id)}</h2>
              <span className="err-grupo-n">{g.items.length === 1 ? '1 error' : `${g.items.length} errores`}</span>
            </div>
            <ul className="err-lista">
              {g.items.map((f, i) => (
                <li key={`${f.bloqueId}-${i}`} className="err-item">
                  <p className="err-p">{resaltar(conIni(f.problema, ini), buscando ? palabras : [])}</p>
                  <p className="err-s">
                    <span className="err-k">Solución</span>
                    {resaltar(conIni(f.solucion, ini), buscando ? palabras : [])}
                  </p>
                  <p className="err-donde">
                    <Link to={`/ejercicio/${f.bloqueId}?tab=problemas`}>
                      Bloque {f.n}: {conIni(f.bloque, ini)}
                    </Link>
                  </p>
                </li>
              ))}
            </ul>
          </section>
        ))
      )}
    </div>
  );
}
