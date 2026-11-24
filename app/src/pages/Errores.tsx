import { useEffect, useMemo, useRef, useState, type CSSProperties, type ReactNode } from 'react';
import { Link } from 'react-router-dom';
import { Icon } from '../components/Icon';
import { META, MODULOS } from '../content';
import { sinTildes } from '../lib/buscar';
import { useProgreso } from '../lib/progress';
import { conIni } from '../lib/texto';
import './glosario.css';
import './errores.css';

/** Un aviso: el mismo problema con la misma solución se junta en uno solo, aunque salga en varios bloques */
interface Grupo {
  modulo: string;
  problema: string;
  solucion: string;
  bloques: { id: string; titulo: string }[];
  plano: string;
  /** el problema es un mensaje técnico copiado del ERP */
  crudo: boolean;
}

const nombreMod = (id: string) => META[id]?.corto ?? 'Curso';
const varMod = (id: string) => ({ ['--mod' as string]: META[id]?.color ?? 'var(--arc)' }) as CSSProperties;
const SUGERENCIAS = ['factura', 'asiento', 'remesa', 'guardar'];

/** Palabras vacías: no ayudan a encontrar nada («no puedo cobrar» busca solo «cobrar») */
const VACIAS = new Set(
  'no me mi mis tu de del la el lo los las un una unos unas y o a al en con sin por para que se es puedo puede pueden quiero hay como cuando esta este esto sale da deja dejar tengo tiene hacer mas muy ya'.split(' '),
);

/** Raíz de una palabra para aceptar coincidencias parciales («cobrar» encuentra «cobro» y «cobra») */
const raiz = (w: string) => (w.length >= 6 ? w.slice(0, w.length - 2) : w);

/** Palabras útiles de una búsqueda (sin tildes, sin vacías, en raíz); si todas son vacías, se usan tal cual */
function palabrasDe(q: string): string[] {
  const todas = sinTildes(q).split(/[^a-z0-9ñ]+/).filter(Boolean);
  const utiles = todas.filter((w) => !VACIAS.has(w));
  return (utiles.length ? utiles : todas).map(raiz);
}

/**
 * ¿Es un mensaje técnico copiado del sistema? Un texto entre «» con «:», corchetes o la palabra error,
 * o un texto que empieza como «tabla_funcion: …», o un TypeError / #e… Esos no se reescriben: se enseñan tal cual.
 */
function esMensajeCrudo(problema: string): boolean {
  const citas = [...problema.matchAll(/«([^»]+)»/g)].map((m) => m[1]);
  if (citas.some((c) => /[:[]|error|#e/i.test(c) || /_/.test(c))) return true;
  return /^[\w.]+(\s\[\d+\])?:\s|TypeError|#e#|\bORA-\d|Cannot read/i.test(problema);
}

const norm = (t: string) => sinTildes(t).replace(/\s+/g, ' ').trim();

/** Todos los avisos de los bloques, agrupados, por módulo y en el orden del curso (se calcula una vez) */
const GRUPOS: Grupo[] = (() => {
  const mapa = new Map<string, Grupo>();
  for (const m of MODULOS)
    for (const ej of m.ejercicios)
      for (const p of ej.problemas ?? []) {
        const clave = `${norm(p.problema)}|${norm(p.solucion)}`;
        const g = mapa.get(clave);
        if (g) {
          if (!g.bloques.some((b) => b.id === ej.id)) g.bloques.push({ id: ej.id, titulo: ej.titulo });
          continue;
        }
        mapa.set(clave, {
          modulo: m.id,
          problema: p.problema,
          solucion: p.solucion,
          bloques: [{ id: ej.id, titulo: ej.titulo }],
          plano: sinTildes(`${p.problema} ${p.solucion} ${ej.titulo}`),
          crudo: esMensajeCrudo(p.problema),
        });
      }
  return [...mapa.values()];
})();
const TOTAL_AVISOS = GRUPOS.length;

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

/** Tarjeta de un aviso: problema (o mensaje del ERP tal cual), solución y los bloques donde se explica */
function Tarjeta({ g, ini, palabras }: { g: Grupo; ini: string; palabras: string[] }) {
  return (
    <li className="err-item" style={varMod(g.modulo)}>
      {g.crudo && <span className="err-tag">Mensaje del ERP</span>}
      <p className={`err-p${g.crudo ? ' crudo' : ''}`}>
        {g.crudo ? <code>{resaltar(conIni(g.problema, ini), palabras)}</code> : resaltar(conIni(g.problema, ini), palabras)}
      </p>
      <p className="err-s">
        <span className="err-k">Solución</span>
        {resaltar(conIni(g.solucion, ini), palabras)}
      </p>
      <p className="err-donde">
        <span className="err-k">{g.bloques.length > 1 ? `Sale en ${g.bloques.length} bloques` : 'Se explica en'}</span>
        {g.bloques.map((b, i) => (
          <span key={b.id}>
            {i > 0 && ' · '}
            <Link to={`/ejercicio/${b.id}?tab=problemas`}>{conIni(b.titulo, ini)}</Link>
          </span>
        ))}
      </p>
    </li>
  );
}

/** Página «Índice de errores»: qué hacer cuando algo no sale, con todos los avisos de los bloques */
export default function Errores() {
  const ini = useProgreso().alumno.ini;
  const [q, setQ] = useState('');
  const [mod, setMod] = useState('');
  const buscador = useRef<HTMLInputElement>(null);

  const palabras = useMemo(() => palabrasDe(q), [q]);
  const buscando = palabras.length > 0;
  const aciertos = (g: Grupo) => palabras.filter((p) => g.plano.includes(p)).length;

  // Casan todas las palabras; si no hay ninguno, se enseñan los que casan con alguna (los más parecidos primero)
  const { base, parecidos } = useMemo(() => {
    if (!buscando) return { base: GRUPOS, parecidos: false };
    const exactos = GRUPOS.filter((g) => aciertos(g) === palabras.length);
    if (exactos.length) return { base: exactos, parecidos: false };
    return { base: GRUPOS.filter((g) => aciertos(g) > 0).sort((a, b) => aciertos(b) - aciertos(a)), parecidos: true };
  }, [palabras]); // eslint-disable-line react-hooks/exhaustive-deps

  const lista = useMemo(() => base.filter((g) => !mod || g.modulo === mod), [base, mod]);
  const porModulo = useMemo(() => {
    const m: Record<string, number> = {};
    for (const g of base) m[g.modulo] = (m[g.modulo] ?? 0) + 1;
    return { m, total: base.length };
  }, [base]);

  // «Lo que más pasa»: los avisos que salen en varios bloques (solo sin buscar ni filtrar)
  const frecuentes = useMemo(
    () => (buscando || mod ? [] : [...GRUPOS].filter((g) => g.bloques.length > 1).sort((a, b) => b.bloques.length - a.bloques.length).slice(0, 6)),
    [buscando, mod],
  );
  const grupos = useMemo(
    () =>
      MODULOS.map((m) => ({
        id: m.id,
        items: lista.filter((g) => g.modulo === m.id && !frecuentes.includes(g)).sort((a, b) => (buscando ? 0 : b.bloques.length - a.bloques.length)),
      })).filter((g) => g.items.length > 0),
    [lista, frecuentes, buscando],
  );
  const modulosConErrores = useMemo(() => MODULOS.map((m) => m.id).filter((id) => GRUPOS.some((g) => g.modulo === id)), []);

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
          <div className="gls-cifra" aria-label={`${TOTAL_AVISOS} errores en ${modulosConErrores.length} módulos`}>
            <b aria-hidden="true">{TOTAL_AVISOS}</b>
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
        <>
          {parecidos && (
            <p className="err-parecidos">
              No hay ninguno con todas esas palabras. Estos se parecen.
            </p>
          )}
          {frecuentes.length > 0 && (
            <section className="err-grupo err-frecuentes" aria-label="Lo que más pasa">
              <div className="err-grupo-cab">
                <span className="gls-chip-ico">
                  <Icon name="destello" size={20} />
                </span>
                <h2>Lo que más pasa</h2>
                <span className="err-grupo-n">salen en varios bloques</span>
              </div>
              <ul className="err-lista">
                {frecuentes.map((g, i) => (
                  <Tarjeta key={`f-${i}`} g={g} ini={ini} palabras={[]} />
                ))}
              </ul>
            </section>
          )}
          {grupos.map((g) => (
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
                  <Tarjeta key={`${f.bloques[0].id}-${i}`} g={f} ini={ini} palabras={buscando ? palabras : []} />
                ))}
              </ul>
            </section>
          ))}
        </>
      )}
    </div>
  );
}
