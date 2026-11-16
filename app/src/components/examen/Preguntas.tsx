import { useEffect, useLayoutEffect, useRef, useState, type KeyboardEvent, type MouseEvent, type ReactNode } from 'react';
import { createPortal } from 'react-dom';
import { AnimatePresence, Reorder, motion, useDragControls, useReducedMotion } from 'framer-motion';
import { Icon } from '../Icon';
import { imgSrc } from '../../content';
import { CAPITULOS } from '../../content/videoMapa';
import { mmss } from '../../lib/config';
import {
  aciertaTeoria,
  dentroDeZona,
  esTest,
  parseImporte,
  textoCorrecta,
  textoRespuesta,
  type PreguntaClic,
  type PreguntaDato,
  type PreguntaExamen,
  type PreguntaOrden,
  type PreguntaRelacion,
  type PreguntaTest,
  type RespuestaTeoria,
} from '../../lib/examen';

type Punto = { x: number; y: number };
const lim = (v: number) => Math.max(0, Math.min(100, v));
const esPunto = (r: RespuestaTeoria | undefined): r is Punto => !!r && typeof r === 'object' && !Array.isArray(r);
const COLORES = ['#5ff0d2', '#8b7bff', '#f6b65a', '#6fe9ff', '#ff8ad8'];

/* ================================================================ dispatcher */

export function PreguntaVista({ q, resp, onResp, destello }: { q: PreguntaExamen; resp: RespuestaTeoria | undefined; onResp: (r: RespuestaTeoria) => void; destello?: string }) {
  if (esTest(q)) return <TestVista q={q} resp={resp} onResp={onResp} destello={destello} />;
  switch (q.tipo) {
    case 'clic':
      return <ClicVista q={q} resp={resp} onResp={onResp} />;
    case 'orden':
      return <OrdenVista q={q} resp={resp} onResp={onResp} />;
    case 'relacion':
      return <RelacionVista q={q} resp={resp} onResp={onResp} />;
    case 'dato':
      return <DatoVista q={q} resp={resp} onResp={onResp} />;
  }
}

/* ================================================================ test (y vídeo) */

export function capituloDe(n: number) {
  return CAPITULOS.find((c) => c.n === n);
}

export function posterDe(n: number) {
  const c = capituloDe(n);
  return c?.poster ? `${import.meta.env.BASE_URL}${c.poster}` : '';
}

/** Cabecera de las preguntas del vídeo: miniatura del capítulo, minuto y escena */
export function VideoCabecera({ cap, t }: { cap: number; t: number }) {
  const c = capituloDe(cap);
  const escena = c ? [...c.escenas].reverse().find((e) => e.t <= t) : undefined;
  const poster = posterDe(cap);
  return (
    <figure className="exq-video">
      <div className="exq-video-img">
        {poster && <img src={poster} alt={`Fotograma del capítulo ${cap} del vídeo de compras`} loading="lazy" />}
        <span className="exq-video-play" aria-hidden="true">
          <Icon name="play" size={18} />
        </span>
        <span className="exq-video-t">min {mmss(t)}</span>
      </div>
      <figcaption>
        <span className="exq-video-cap">Capítulo {cap}</span>
        <b>{c?.titulo ?? 'Vídeo de compras'}</b>
        {escena && <span className="muted small">Escena «{escena.titulo}»</span>}
      </figcaption>
    </figure>
  );
}

function TestVista({ q, resp, onResp, destello }: { q: PreguntaTest; resp: RespuestaTeoria | undefined; onResp: (r: RespuestaTeoria) => void; destello?: string }) {
  return (
    <>
      {q.video && <VideoCabecera cap={q.video.cap} t={q.video.t} />}
      <div role="radiogroup" aria-label="Opciones">
        {q.opciones.map((op, k) => {
          const sel = resp === k;
          return (
            <motion.button
              key={k}
              role="radio"
              aria-checked={sel}
              aria-keyshortcuts={`${k + 1} ${'ABCD'[k]}`}
              className={`quiz-opt ${sel ? 'sel' : ''} ${sel && destello ? 'flash-ok' : ''}`}
              whileTap={{ scale: 0.98 }}
              onClick={() => onResp(k)}
            >
              <span className="letter">{'ABCD'[k]}</span>
              <span>{op}</span>
            </motion.button>
          );
        })}
      </div>
    </>
  );
}

/* ================================================================ clic sobre la captura */

/** Captura de Axional. Con onPunto, se puede marcar (ratón, dedo o flechas del teclado). */
export function Captura({ src, alt, punto, onPunto, zona, ok }: { src: string; alt: string; punto: Punto | null; onPunto?: (p: Punto) => void; zona?: PreguntaClic['zona']; ok?: boolean }) {
  const reducir = useReducedMotion();
  const contenido = (
    <>
      <img src={src} alt={onPunto ? '' : alt} draggable={false} />
      {zona && <span className="exq-zona" style={{ left: `${zona.x}%`, top: `${zona.y}%`, width: `${zona.w}%`, height: `${zona.h}%` }} aria-hidden="true" />}
      <AnimatePresence>
        {punto && (
          <motion.span
            key={`${punto.x.toFixed(1)}-${punto.y.toFixed(1)}`}
            className={`exq-marca ${ok === true ? 'ok' : ok === false ? 'ko' : ''}`}
            style={{ left: `${punto.x}%`, top: `${punto.y}%` }}
            initial={reducir ? false : { scale: 2.6, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.35, ease: [0.2, 0.8, 0.2, 1] }}
            aria-hidden="true"
          />
        )}
      </AnimatePresence>
    </>
  );
  if (!onPunto) return <div className="exq-captura">{contenido}</div>;

  const click = (e: MouseEvent<HTMLButtonElement>) => {
    if (e.detail === 0) {
      // Enter o espacio: marca el centro y luego se mueve con las flechas
      if (!punto) onPunto({ x: 50, y: 50 });
      return;
    }
    const r = e.currentTarget.getBoundingClientRect();
    onPunto({ x: Math.round(lim(((e.clientX - r.left) / r.width) * 100) * 10) / 10, y: Math.round(lim(((e.clientY - r.top) / r.height) * 100) * 10) / 10 });
  };
  const tecla = (e: KeyboardEvent<HTMLButtonElement>) => {
    const d = e.shiftKey ? 6 : 1.5;
    const mov: Record<string, [number, number]> = { ArrowLeft: [-d, 0], ArrowRight: [d, 0], ArrowUp: [0, -d], ArrowDown: [0, d] };
    const m = mov[e.key];
    if (!m) return;
    e.preventDefault();
    const p = punto ?? { x: 50, y: 50 };
    onPunto({ x: lim(p.x + m[0]), y: lim(p.y + m[1]) });
  };
  return (
    <button type="button" className="exq-captura activa" onClick={click} onKeyDown={tecla} aria-label={`${alt}. Toca donde harías clic. Con el teclado: Intro para poner la marca y flechas para moverla.`}>
      {contenido}
    </button>
  );
}

/** Captura a pantalla completa, con desplazamiento libre (móvil) */
export function Ampliada({ titulo, onCerrar, children }: { titulo: string; onCerrar: () => void; children: ReactNode }) {
  const cerrar = useRef<HTMLButtonElement>(null);
  useEffect(() => {
    const previo = document.activeElement as HTMLElement | null;
    cerrar.current?.focus();
    const esc = (e: globalThis.KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.preventDefault();
        onCerrar();
      }
    };
    window.addEventListener('keydown', esc);
    const ov = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      window.removeEventListener('keydown', esc);
      document.body.style.overflow = ov;
      previo?.focus?.();
    };
  }, [onCerrar]);
  return createPortal(
    <motion.div className="exq-zoom" role="dialog" aria-modal="true" aria-label={titulo} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
      <div className="exq-zoom-barra">
        <span>{titulo}</span>
        <button ref={cerrar} type="button" className="btn sm" onClick={onCerrar}>
          Cerrar
        </button>
      </div>
      <div className="exq-zoom-lienzo">{children}</div>
    </motion.div>,
    document.body,
  );
}

function IconoLupa() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" aria-hidden="true">
      <circle cx="10.5" cy="10.5" r="6.5" />
      <path d="M15.5 15.5 21 21M10.5 7.5v6M7.5 10.5h6" />
    </svg>
  );
}

function ClicVista({ q, resp, onResp }: { q: PreguntaClic; resp: RespuestaTeoria | undefined; onResp: (r: RespuestaTeoria) => void }) {
  const [zoom, setZoom] = useState(false);
  const punto = esPunto(resp) ? resp : null;
  const src = imgSrc(q.modulo, q.imagen);
  const alt = `Captura de Axional: ${q.pantalla}`;
  return (
    <div className="exq-clic">
      <div className="exq-paso">
        <span className="exq-paso-pant">
          Pantalla <b>{q.pantalla}</b>
        </span>
        {q.paso && <span className="exq-paso-txt">Paso del manual: {q.paso}</span>}
      </div>
      <Captura src={src} alt={alt} punto={punto} onPunto={onResp} />
      <div className="exq-clic-pie">
        <span className="small" aria-live="polite">
          {punto ? 'Marcado. Toca otro sitio para cambiarlo.' : 'Toca la captura donde harías clic.'}
        </span>
        <button type="button" className="btn ghost sm exq-ampliar" onClick={() => setZoom(true)}>
          <IconoLupa /> Ampliar
        </button>
      </div>
      <AnimatePresence>
        {zoom && (
          <Ampliada titulo={alt} onCerrar={() => setZoom(false)}>
            <Captura src={src} alt={alt} punto={punto} onPunto={onResp} />
          </Ampliada>
        )}
      </AnimatePresence>
    </div>
  );
}

/* ================================================================ ordenar */

function FilaOrden({ k, pos, texto, total, onQuitar, onMover }: { k: number; pos: number; texto: string; total: number; onQuitar: () => void; onMover: (d: number) => void }) {
  const controles = useDragControls();
  return (
    <Reorder.Item value={k} dragListener={false} dragControls={controles} className="exq-fila" layout="position" initial={{ opacity: 0, x: -16 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0 }}>
      <button
        type="button"
        className="exq-asa"
        aria-label={`Mover «${texto}», ahora en la posición ${pos + 1}. Flechas arriba y abajo.`}
        onPointerDown={(e) => controles.start(e)}
        onKeyDown={(e) => {
          if (e.key === 'ArrowUp' && pos > 0) {
            e.preventDefault();
            onMover(-1);
          } else if (e.key === 'ArrowDown' && pos < total - 1) {
            e.preventDefault();
            onMover(1);
          }
        }}
      >
        <Icon name="grip" size={18} />
      </button>
      <span className="exq-fila-n" aria-hidden="true">
        {pos + 1}
      </span>
      <span className="exq-fila-txt">{texto}</span>
      <button type="button" className="exq-quitar" onClick={onQuitar} aria-label={`Quitar «${texto}»`}>
        <span aria-hidden="true">✕</span>
      </button>
    </Reorder.Item>
  );
}

function OrdenVista({ q, resp, onResp }: { q: PreguntaOrden; resp: RespuestaTeoria | undefined; onResp: (r: RespuestaTeoria) => void }) {
  const puestos = Array.isArray(resp) ? resp.filter((k) => k >= 0 && k < q.items.length) : [];
  const libres = q.items.map((_, k) => k).filter((k) => !puestos.includes(k));
  const set = (arr: number[]) => onResp(arr.length ? arr : null);
  const mover = (pos: number, d: number) => {
    const n = [...puestos];
    [n[pos], n[pos + d]] = [n[pos + d], n[pos]];
    set(n);
  };
  return (
    <div className="exq-orden">
      <Reorder.Group as="ol" axis="y" values={puestos} onReorder={set} className="exq-orden-lista" aria-label="Tu orden">
        {puestos.map((k, pos) => (
          <FilaOrden key={k} k={k} pos={pos} total={puestos.length} texto={q.items[k]} onQuitar={() => set(puestos.filter((x) => x !== k))} onMover={(d) => mover(pos, d)} />
        ))}
      </Reorder.Group>
      {libres.length > 0 && (
        <ol className="exq-huecos" start={puestos.length + 1} aria-hidden="true">
          <li className="exq-hueco">
            <span className="exq-fila-n">{puestos.length + 1}</span>
            <span>{puestos.length ? 'Toca el siguiente paso' : 'Toca el primer paso'}</span>
          </li>
        </ol>
      )}
      <div className="exq-pool" role="group" aria-label="Pasos por colocar">
        <AnimatePresence initial={false}>
          {libres.map((k) => (
            <motion.button type="button" key={k} layout className="exq-chip" initial={{ opacity: 0, scale: 0.85 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.85 }} onClick={() => set([...puestos, k])}>
              {q.items[k]}
            </motion.button>
          ))}
        </AnimatePresence>
      </div>
      {puestos.length > 0 && libres.length === 0 && <p className="small muted">Arrastra por el asa para cambiar el orden, o quita un paso con ✕.</p>}
    </div>
  );
}

/* ================================================================ relacionar */

function RelacionVista({ q, resp, onResp }: { q: PreguntaRelacion; resp: RespuestaTeoria | undefined; onResp: (r: RespuestaTeoria) => void }) {
  const n = q.izquierda.length;
  const pares = Array.isArray(resp) && resp.length === n ? resp : q.izquierda.map(() => -1);
  const [sel, setSel] = useState<{ lado: 'i' | 'd'; k: number } | null>(null);
  const caja = useRef<HTMLDivElement>(null);
  const izq = useRef<(HTMLButtonElement | null)[]>([]);
  const der = useRef<(HTMLButtonElement | null)[]>([]);
  const [lineas, setLineas] = useState<{ i: number; d: string }[]>([]);
  const reducir = useReducedMotion();

  const unir = (i: number, d: number) => {
    const nuevo = pares.map((x) => (x === d ? -1 : x));
    nuevo[i] = pares[i] === d ? -1 : d;
    onResp(nuevo.every((x) => x < 0) ? null : nuevo);
    setSel(null);
  };
  const tocaIzq = (i: number) => (sel?.lado === 'd' ? unir(i, sel.k) : setSel(sel?.lado === 'i' && sel.k === i ? null : { lado: 'i', k: i }));
  const tocaDer = (d: number) => (sel?.lado === 'i' ? unir(sel.k, d) : setSel(sel?.lado === 'd' && sel.k === d ? null : { lado: 'd', k: d }));

  const clave = pares.join(',');
  useLayoutEffect(() => {
    // Con offsets (no getBoundingClientRect): no les afecta la transformación 3D de la llegada
    const caja0 = (el: HTMLElement) => {
      let x = 0;
      let y = 0;
      let n: HTMLElement | null = el;
      while (n && n !== caja.current) {
        x += n.offsetLeft;
        y += n.offsetTop;
        n = n.offsetParent as HTMLElement | null;
      }
      return { x, y, w: el.offsetWidth, h: el.offsetHeight };
    };
    const medir = () => {
      if (!caja.current) return;
      const out: { i: number; d: string }[] = [];
      pares.forEach((d, i) => {
        const ea = izq.current[i];
        const eb = d >= 0 ? der.current[d] : null;
        if (!ea || !eb) return;
        const a = caja0(ea);
        const b = caja0(eb);
        const x1 = a.x + a.w;
        const y1 = a.y + a.h / 2;
        const x2 = b.x;
        const y2 = b.y + b.h / 2;
        const m = (x2 - x1) / 2;
        out.push({ i, d: `M${x1} ${y1} C ${x1 + m} ${y1}, ${x2 - m} ${y2}, ${x2} ${y2}` });
      });
      setLineas(out);
    };
    medir();
    const ro = new ResizeObserver(medir);
    if (caja.current) ro.observe(caja.current);
    return () => ro.disconnect();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [clave]);

  const colorDe = (i: number) => COLORES[i % COLORES.length];
  const duenoDe = (d: number) => pares.indexOf(d);

  return (
    <div className="exq-rel">
      <p className="small muted exq-rel-ayuda">Toca un elemento de cada columna para unirlos. Toca de nuevo una pareja para deshacerla.</p>
      <div className="exq-rel-cols" ref={caja}>
        <svg className="exq-rel-lineas" aria-hidden="true">
          {lineas.map((l) => (
            <motion.path key={`${l.i}-${l.d}`} d={l.d} stroke={colorDe(l.i)} initial={reducir ? false : { pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 0.4 }} />
          ))}
        </svg>
        <div className="exq-rel-col" role="group" aria-label={q.titulos[0]}>
          <span className="exq-rel-tit">{q.titulos[0]}</span>
          {q.izquierda.map((t, i) => {
            const d = pares[i];
            return (
              <button
                type="button"
                key={i}
                ref={(el) => {
                  izq.current[i] = el;
                }}
                className={`exq-rel-el izq ${d >= 0 ? 'unido' : ''} ${sel?.lado === 'i' && sel.k === i ? 'sel' : ''}`}
                style={{ ['--par' as string]: colorDe(i) }}
                aria-pressed={sel?.lado === 'i' && sel.k === i}
                aria-label={`${t}${d >= 0 ? `, unido con ${q.derecha[d]}` : ', sin pareja'}`}
                onClick={() => tocaIzq(i)}
              >
                {t}
              </button>
            );
          })}
        </div>
        <div className="exq-rel-col" role="group" aria-label={q.titulos[1]}>
          <span className="exq-rel-tit">{q.titulos[1]}</span>
          {q.derecha.map((t, d) => {
            const i = duenoDe(d);
            return (
              <button
                type="button"
                key={d}
                ref={(el) => {
                  der.current[d] = el;
                }}
                className={`exq-rel-el der ${i >= 0 ? 'unido' : ''} ${sel?.lado === 'd' && sel.k === d ? 'sel' : ''}`}
                style={i >= 0 ? { ['--par' as string]: colorDe(i) } : undefined}
                aria-pressed={sel?.lado === 'd' && sel.k === d}
                aria-label={`${t}${i >= 0 ? `, unido con ${q.izquierda[i]}` : ', sin pareja'}`}
                onClick={() => tocaDer(d)}
              >
                {t}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}

/* ================================================================ completar el dato */

function DatoVista({ q, resp, onResp }: { q: PreguntaDato; resp: RespuestaTeoria | undefined; onResp: (r: RespuestaTeoria) => void }) {
  const v = typeof resp === 'string' ? resp : '';
  const ok = !v.trim() || (q.formato === 'importe' ? parseImporte(v) !== null : /^\d{5}(\.?\d{0,5})?$/.test(v.replace(/\s/g, '')));
  const id = 'exq-dato-input';
  return (
    <div className="exq-dato">
      {q.datos && (
        <dl className="exq-dato-datos">
          {q.datos.map((d) => (
            <div key={d.k}>
              <dt>{d.k}</dt>
              <dd>{d.v}</dd>
            </div>
          ))}
        </dl>
      )}
      <label className="exq-dato-lbl" htmlFor={id}>
        {q.formato === 'importe' ? 'Tu respuesta, en euros' : 'Tu respuesta: la cuenta (cinco cifras)'}
      </label>
      <div className={`exq-dato-campo ${!ok ? 'mal' : ''}`}>
        <input
          id={id}
          className="exq-dato-input"
          value={v}
          placeholder={q.placeholder}
          inputMode={q.formato === 'importe' ? 'decimal' : 'numeric'}
          autoComplete="off"
          spellCheck={false}
          aria-invalid={!ok}
          aria-describedby={!ok ? `${id}-err` : undefined}
          onChange={(e) => onResp(e.target.value ? e.target.value : null)}
        />
        <span className="exq-dato-uni" aria-hidden="true">
          {q.formato === 'importe' ? '€' : 'cuenta'}
        </span>
      </div>
      {!ok && (
        <span id={`${id}-err`} className="ex-error-txt small">
          {q.formato === 'importe' ? 'Escribe un importe, por ejemplo 1.234,56' : 'Escribe las cinco cifras, por ejemplo 12345'}
        </span>
      )}
    </div>
  );
}

/* ================================================================ revisión final */

export function RevisionPregunta({ q, r }: { q: PreguntaExamen; r: RespuestaTeoria | undefined }) {
  const bien = aciertaTeoria(q, r);
  const [zoom, setZoom] = useState(false);
  if (esTest(q)) {
    return (
      <>
        {q.video && (
          <span className="exq-rev-video">
            {posterDe(q.video.cap) && <img src={posterDe(q.video.cap)} alt="" loading="lazy" />}
            Capítulo {q.video.cap} · min {mmss(q.video.t)}
          </span>
        )}
        <div className="small">
          Tu respuesta: {textoRespuesta(q, r)} {bien ? '✓' : '✕'}
          {!bien && <> · Correcta: {textoCorrecta(q)}</>}
        </div>
      </>
    );
  }
  if (q.tipo === 'clic') {
    const p = esPunto(r) ? r : null;
    const src = imgSrc(q.modulo, q.imagen);
    const alt = `Captura de ${q.pantalla}: la zona correcta es «${q.etiqueta}»`;
    return (
      <div className="exq-rev-clic">
        <div className="exq-rev-mini">
          <Captura src={src} alt={alt} punto={p} zona={q.zona} ok={p ? dentroDeZona(q.zona, p) : undefined} />
        </div>
        <div className="small">
          {p ? (bien ? 'Tu clic cae en la zona correcta ✓' : 'Tu clic cae fuera de la zona ✕') : 'Sin responder ✕'} · La zona es {textoCorrecta(q)} (recuadro turquesa).{' '}
          <button type="button" className="btn ghost sm exq-ampliar" onClick={() => setZoom(true)}>
            <IconoLupa /> Ampliar
          </button>
        </div>
        <AnimatePresence>
          {zoom && (
            <Ampliada titulo={alt} onCerrar={() => setZoom(false)}>
              <Captura src={src} alt={alt} punto={p} zona={q.zona} ok={p ? dentroDeZona(q.zona, p) : undefined} />
            </Ampliada>
          )}
        </AnimatePresence>
      </div>
    );
  }
  if (q.tipo === 'orden') {
    const tu = Array.isArray(r) ? r : [];
    return (
      <div className="exq-rev-orden small">
        <div>
          <b>Tu orden</b>
          {tu.length ? (
            <ol>
              {tu.map((k, i) => (
                <li key={k} className={k === q.solucion[i] ? 'ok' : 'mal'}>
                  {q.items[k]}
                </li>
              ))}
            </ol>
          ) : (
            <p>sin responder</p>
          )}
        </div>
        {!bien && (
          <div>
            <b>Correcto</b>
            <ol>
              {q.solucion.map((k) => (
                <li key={k}>{q.items[k]}</li>
              ))}
            </ol>
          </div>
        )}
      </div>
    );
  }
  if (q.tipo === 'relacion') {
    const tu = Array.isArray(r) ? r : [];
    return (
      <ul className="exq-rev-rel small">
        {q.izquierda.map((t, i) => {
          const d = tu[i] ?? -1;
          const ok = d === q.solucion[i];
          return (
            <li key={i} className={ok ? 'ok' : 'mal'}>
              <b>{t}</b> = {d >= 0 ? q.derecha[d] : 'sin pareja'} {ok ? '✓' : <>✕ · Correcta: {q.derecha[q.solucion[i]]}</>}
            </li>
          );
        })}
      </ul>
    );
  }
  return (
    <div className="small">
      Tu respuesta: {textoRespuesta(q, r)} {bien ? '✓' : '✕'}
      {!bien && <> · Correcta: {textoCorrecta(q)}</>}
    </div>
  );
}
