import { useEffect, useMemo, useRef, useState, type CSSProperties, type KeyboardEvent as KEvent, type ReactNode } from 'react';
import { Glosa } from '../Glosario';
import { createPortal } from 'react-dom';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import type { Hotspot, Seccion } from '../../types';
import { idModulo, imgSrc, META } from '../../content';
import { posCampo } from '../../content/camposPos';
import { conIni } from '../../lib/texto';
import { Icon } from '../Icon';
import './campos.css';

interface Vista {
  imagen: string;
  hotspots: Hotspot[];
}

/** Recuadro en porcentajes sobre la imagen. */
interface Caja {
  x: number;
  y: number;
  w: number;
  h: number;
}

/** Dónde está un campo: en qué captura, su recuadro y el centro de su punto numerado. */
interface Loc {
  vi: number;
  caja: Caja;
  px: number;
  py: number;
}

const norm = (s: string) =>
  s
    .toLowerCase()
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/\(.*?\)/g, '')
    .replace(/[*«»"'.:]/g, '')
    .replace(/\s+/g, ' ')
    .trim();

/** ¿La etiqueta del hotspot nombra este campo? Tolera «Campo / Otro», asteriscos y paréntesis. */
function casa(campo: string, etiqueta: string) {
  const b = norm(etiqueta);
  if (!b) return false;
  return campo
    .split('/')
    .map(norm)
    .filter(Boolean)
    .some((a) => a === b || (a.length >= 4 && b.startsWith(a)) || (b.length >= 4 && a.startsWith(b)));
}

const ENLACES = new Set(['y', 'e', 'o', 'u', 'de', 'del', 'en', 'con', 'por', 'a', 'al', 'la', 'el']);

/** El hotspot nombra OTRO campo que empieza igual («Grupo» frente a «Grupo precio»). Misma regla que _fuente/campos-ocr/casar.py. */
function compuesto(campo: string, etiqueta: string) {
  if (campo.includes('/') || campo.includes('·') || /\d/.test(etiqueta)) return false;
  const a = norm(campo);
  const pal = etiqueta.split(/\s+/).filter(Boolean);
  const n = a.split(' ').length;
  if (!a || pal.length <= n || norm(pal.slice(0, n).join(' ')) !== a) return false;
  const sig = pal[n];
  return /^[a-záéíóúüñ]+$/.test(sig) && !ENLACES.has(sig);
}

/** Separación mínima entre centros de dos puntos, en píxeles de la captura tal como se ve (punto de 26 px + aire). */
const HUECO_PX = 30;
const lim = (v: number, a: number, b: number) => Math.min(b, Math.max(a, v));

/** Nombre del campo sin el asterisco de obligatorio. */
const limpio = (campo: string) => campo.replace(/\s*\*\s*$/, '');

/**
 * Captura real de la pantalla con todos los campos numerados y su tabla debajo.
 * Al pulsar un número o una fila, la ficha del campo queda fija debajo de su captura.
 */
export function CapturaCampos({ s, modulo, ini }: { s: Seccion; modulo: string; ini: string }) {
  const t = (x: string) => conIni(x, ini);
  const reducir = useReducedMotion();

  const vistas = useMemo<Vista[]>(() => {
    const m = new Map<string, Vista>();
    for (const p of s.pasos) {
      if (!p.imagen) continue;
      const v = m.get(p.imagen) ?? { imagen: p.imagen, hotspots: [] };
      if (p.hotspot && !v.hotspots.some((h) => h.x === p.hotspot!.x && h.y === p.hotspot!.y)) v.hotspots.push(p.hotspot);
      m.set(p.imagen, v);
    }
    return [...m.values()];
  }, [s]);

  /** Proporción alto/ancho de cada captura (para medir solapes); 16:9 hasta que carga. */
  const [asp, setAsp] = useState<Record<string, number>>({});
  /** Ancho real con que se pinta cada captura (para que los puntos no se toquen, también a 375 px). */
  const [anchos, setAnchos] = useState<Record<string, number>>({});
  const figs = useRef<(HTMLElement | null)[]>([]);
  useEffect(() => {
    if (typeof ResizeObserver === 'undefined') return;
    const ro = new ResizeObserver((es) => {
      setAnchos((a) => {
        let n = a;
        for (const e of es) {
          const img = (e.target as HTMLElement).dataset.img;
          const w = Math.round(e.contentRect.width);
          if (img && w > 0 && Math.abs((a[img] ?? 0) - w) > 8) n = { ...n, [img]: w };
        }
        return n;
      });
    });
    figs.current.forEach((f) => f && ro.observe(f));
    return () => ro.disconnect();
  }, [vistas]);

  /** Para cada fila: dónde se ve su campo. Primero la posición por OCR; si no, el hotspot de un paso. */
  const locs = useMemo<(Loc | null)[]>(() => {
    const base = s.campos.map((c, i): Omit<Loc, 'px' | 'py'> | null => {
      const p = posCampo(s.id, i);
      if (p) {
        const vi = vistas.findIndex((v) => v.imagen === p.imagen);
        if (vi >= 0) return { vi, caja: { x: p.x, y: p.y, w: p.w, h: p.h } };
      }
      for (let vi = 0; vi < vistas.length; vi++) {
        const h = vistas[vi].hotspots.find((x) => casa(c.campo, x.etiqueta) && !compuesto(c.campo, x.etiqueta));
        if (h) return { vi, caja: { x: h.x, y: h.y, w: h.w, h: h.h } };
      }
      return null;
    });
    // Punto pegado a la izquierda del recuadro (CSS lo corre su ancho), a media altura; si choca con otro, se aparta.
    // Se prueba primero hacia la izquierda (hueco libre, no tapa la etiqueta), luego arriba/abajo y, en último caso, a la derecha.
    const puestos: Loc[] = [];
    const desvios: [number, number][] = [[0, 0]];
    for (let k = 1; k <= 6; k++) desvios.push([-k / 2, 0], [0, -k / 2], [0, k / 2], [-k / 2, -k / 2], [-k / 2, k / 2]);
    for (let k = 1; k <= 6; k++) desvios.push([k, 0]);
    return base.map((b) => {
      if (!b) return null;
      const img = vistas[b.vi].imagen;
      const r = asp[img] ?? 9 / 16;
      const ancho = anchos[img] ?? 900;
      // En móvil el punto mide 22 px (campos.css), así que basta menos aire y quedan más cerca de su campo.
      const movil = typeof matchMedia !== 'undefined' && matchMedia('(max-width: 640px)').matches;
      const hueco = ((movil ? HUECO_PX - 6 : HUECO_PX) / ancho) * 100;
      const minX = (32 / ancho) * 100; // el CSS no deja el punto más a la izquierda de 32 px
      const x0 = lim(b.caja.x, minX, 99.6);
      const y0 = lim(b.caja.y + b.caja.h / 2, 2.5, 97.5);
      const libre = (x: number, y: number) => !puestos.some((o) => o.vi === b.vi && Math.hypot(o.px - x, (o.py - y) * r) < hueco);
      let px = x0;
      let py = y0;
      for (const [dx, dy] of desvios) {
        const x = x0 + dx * hueco;
        const y = y0 + (dy * hueco) / r;
        if (x < minX || x > 99.6 || y < 2.5 || y > 97.5) continue;
        if (libre(x, y)) {
          px = x;
          py = y;
          break;
        }
      }
      const l: Loc = { ...b, px, py };
      puestos.push(l);
      return l;
    });
  }, [s.id, s.campos, vistas, asp, anchos]);

  const total = s.campos.length;
  /** La ampliada va en un portal, fuera de la página del bloque: le pasamos el color del módulo. */
  const cMod = META[modulo]?.color ?? META[idModulo(modulo)]?.color;
  const colorMod = cMod ? ({ ['--mod' as string]: cMod } as CSSProperties) : undefined;
  const hayPuntos = locs.some(Boolean);

  const [activa, setActiva] = useState<number | null>(null);
  const [grande, setGrande] = useState<number | null>(null);

  // Tras elegir: llevar la vista a la captura (desde la tabla) o el foco a la ficha (al recorrer).
  const pendiente = useRef<'figura' | 'ficha' | null>(null);
  const fichaPag = useRef<HTMLDivElement>(null);
  const fichaLbx = useRef<HTMLDivElement>(null);
  /** Captura bajo la que estaba la ficha la última vez (para saber si ha saltado). */
  const ultima = useRef<number | null>(null);

  /** Captura bajo la que va la ficha del campo i (en la página, o en la ampliada que está abierta). */
  const casaDe = (i: number, defecto: number) => locs[i]?.vi ?? defecto;

  const elegir = (i: number, tras: 'figura' | 'ficha' | null = null) => {
    setActiva(i);
    if (grande !== null) {
      const l = locs[i];
      if (l && l.vi !== grande) setGrande(l.vi);
    }
    pendiente.current = tras;
  };
  const mover = (d: number) => {
    if (!total) return;
    const i = activa == null ? 0 : (activa + d + total) % total;
    elegir(i, 'ficha');
  };

  useEffect(() => {
    const que = pendiente.current;
    pendiente.current = null;
    if (activa == null) return;
    if (!que) {
      if (grande === null) ultima.current = casaDe(activa, 0);
      return;
    }
    const comp: ScrollBehavior = reducir ? 'auto' : 'smooth';
    if (que === 'figura' && grande === null && !vistas.length) {
      fichaPag.current?.scrollIntoView({ block: 'nearest', behavior: comp });
    } else if (que === 'figura' && grande === null) {
      figs.current[casaDe(activa, 0)]?.scrollIntoView({ block: 'start', behavior: comp });
      ultima.current = casaDe(activa, 0);
    } else if (que === 'ficha') {
      const f = grande !== null ? fichaLbx.current : fichaPag.current;
      f?.focus({ preventScroll: true });
      // Si la ficha ha saltado a otra captura, se muestra esa captura desde arriba; si no, basta con ver la ficha.
      const vk = casaDe(activa, 0);
      if (grande === null && vistas.length && vk !== ultima.current) figs.current[vk]?.scrollIntoView({ block: 'start', behavior: comp });
      else f?.scrollIntoView({ block: 'nearest', behavior: comp });
    }
    ultima.current = grande === null ? casaDe(activa, 0) : ultima.current;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activa, grande]);

  const teclas = (e: KEvent) => {
    if (e.key === 'ArrowRight' || e.key === 'ArrowDown') {
      e.preventDefault();
      mover(1);
    } else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') {
      e.preventDefault();
      mover(-1);
    }
  };

  const ficha = (vk: number, enLbx: boolean) => {
    if (activa == null || casaDe(activa, enLbx ? (grande ?? 0) : 0) !== vk) return null;
    const c = s.campos[activa];
    const l = locs[activa];
    const visto = !!l && l.vi === vk;
    const estilo = visto ? ({ ['--px' as string]: `calc(max(32px, ${l!.px}%) - 16px)` } as CSSProperties) : undefined;
    return (
      <div
        ref={enLbx ? fichaLbx : fichaPag}
        className={`ccx-ficha${visto ? ' visto' : ''}`}
        style={estilo}
        tabIndex={-1}
        onKeyDown={teclas}
        role="region"
        aria-label={`Campo ${activa + 1} de ${total}`}
        aria-live="polite"
        key={activa}
      >
        <span className="ccx-num" aria-hidden="true">{activa + 1}</span>
        <div className="ccx-cuerpo">
          <p className="ccx-cuenta">
            Campo {activa + 1} de {total}
          </p>
          <h4 className="ccx-nombre">
            {t(limpio(c.campo))}
            {/\*\s*$/.test(c.campo) && <span className="ccx-oblig">Obligatorio</span>}
          </h4>
          <p className="ccx-que">
            <Glosa>{t(c.significado)}</Glosa>
          </p>
          {c.ejemplo && (
            <p className="ccx-ej">
              <span>Ejemplo</span> <b>{t(c.ejemplo)}</b>
            </p>
          )}
          {!visto && vistas.length > 0 && <p className="ccx-nota">Este campo no sale en la captura.</p>}
        </div>
        <div className="ccx-nav">
          <button type="button" className="ccx-btn" onClick={() => mover(-1)} aria-label="Campo anterior">
            <Icon name="atras" size={18} />
            <span>Anterior</span>
          </button>
          <button type="button" className="ccx-btn" onClick={() => mover(1)} aria-label="Campo siguiente">
            <span>Siguiente</span>
            <Icon name="flecha" size={18} />
          </button>
        </div>
      </div>
    );
  };

  const lienzo = (vk: number, zoom: boolean) => {
    const v = vistas[vk];
    const act = activa != null && locs[activa]?.vi === vk ? locs[activa]! : null;
    return (
      <div className={`cc-frame ccx-frame${zoom ? ' zoom' : ''}${act ? ' con-activo' : ''}`}>
        <img
          src={imgSrc(modulo, v.imagen)}
          alt={`Pantalla del ERP: ${t(s.titulo)}`}
          draggable={false}
          loading="lazy"
          onLoad={(e) => {
            const im = e.currentTarget;
            if (im.naturalWidth && !asp[v.imagen]) setAsp((a) => ({ ...a, [v.imagen]: im.naturalHeight / im.naturalWidth }));
          }}
        />
        {act && (
          <div
            className="ccx-box"
            style={{ left: `${act.caja.x}%`, top: `${act.caja.y}%`, width: `${act.caja.w}%`, height: `${act.caja.h}%` }}
            aria-hidden="true"
          />
        )}
        {locs.map((l, fila) =>
          l && l.vi === vk ? (
            <button
              key={fila}
              type="button"
              className={`ccx-pin${activa === fila ? ' on' : ''}`}
              style={{ left: `max(32px, ${l.px}%)`, top: `${l.py}%` }}
              onClick={() => elegir(fila)}
              aria-label={`Campo ${fila + 1}: ${t(limpio(s.campos[fila].campo))}`}
              aria-pressed={activa === fila}
            >
              {fila + 1}
            </button>
          ) : null,
        )}
        {!zoom && (
          <button type="button" className="ccx-ampliar" onClick={() => setGrande(vk)} aria-haspopup="dialog" aria-label="Ampliar la captura">
            <Icon name="buscar" size={16} />
            <span>Ampliar</span>
          </button>
        )}
      </div>
    );
  };

  const filaClave = (e: KEvent, i: number) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      elegir(i, 'figura');
    }
  };

  return (
    <div className="cc cc-plano ccx">
      {total > 0 && (
        <p className={`ccx-pista${activa == null ? '' : ' hecho'}`}>
          {activa == null
            ? hayPuntos
              ? 'Pulsa un número para ver qué es cada campo.'
              : 'Pulsa un campo de la lista para ver qué es.'
            : `Usa ← → o «Siguiente» para recorrer los ${total} campos.`}
        </p>
      )}
      {vistas.map((v, vk) => (
        <figure
          key={v.imagen}
          className="cc-shot ccx-shot"
          data-img={v.imagen}
          ref={(el) => {
            figs.current[vk] = el;
          }}
        >
          {lienzo(vk, false)}
          {ficha(vk, false)}
        </figure>
      ))}
      {!vistas.length && ficha(0, false)}
      {total > 0 && (
        <div className="sec-campos cc-campos">
          <table className="fields ax-table cc-table">
            <thead>
              <tr>
                <th scope="col">Campo</th>
                <th scope="col">Qué es</th>
                <th scope="col">Ejemplo</th>
              </tr>
            </thead>
            <tbody>
              {s.campos.map((c, i) => (
                <tr
                  key={i}
                  className={`cc-has${activa === i ? ' cc-on' : ''}`}
                  onClick={() => elegir(i, 'figura')}
                  onKeyDown={(e) => filaClave(e, i)}
                  tabIndex={0}
                  aria-current={activa === i ? 'true' : undefined}
                >
                  <td>
                    <span className={`cc-n ccx-n${locs[i] ? ' loc' : ''}`} aria-hidden="true">
                      {i + 1}
                    </span>
                    {t(c.campo)}
                  </td>
                  <td>
                    <Glosa>{t(c.significado)}</Glosa>
                  </td>
                  <td>{c.ejemplo ? t(c.ejemplo) : null}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      <Lightbox abierto={grande !== null} onCerrar={() => setGrande(null)}>
        {grande !== null && (
          <div className="ccx ccx-lbx" style={colorMod}>
            {lienzo(grande, true)}
            {ficha(grande, true)}
          </div>
        )}
      </Lightbox>
    </div>
  );
}

/** Captura ampliada a pantalla completa. Esc o tocar fuera la cierra. */
export function Lightbox({ abierto, onCerrar, children }: { abierto: boolean; onCerrar: () => void; children: ReactNode }) {
  const reducir = useReducedMotion();
  const cerrar = useRef<HTMLButtonElement>(null);
  useEffect(() => {
    if (!abierto) return;
    const prev = document.activeElement as HTMLElement | null;
    cerrar.current?.focus();
    const f = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onCerrar();
    };
    window.addEventListener('keydown', f);
    const ov = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      window.removeEventListener('keydown', f);
      document.body.style.overflow = ov;
      prev?.focus();
    };
  }, [abierto, onCerrar]);
  return createPortal(
    <AnimatePresence>
      {abierto && (
        <motion.div className="lbx" role="dialog" aria-modal="true" aria-label="Captura ampliada" onClick={onCerrar} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
          <motion.div
            className="lbx-in"
            onClick={(e) => e.stopPropagation()}
            initial={reducir ? { opacity: 0 } : { opacity: 0, scale: 0.9, rotateX: 8 }}
            animate={{ opacity: 1, scale: 1, rotateX: 0 }}
            exit={reducir ? { opacity: 0 } : { opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.3, ease: [0.2, 0.7, 0.2, 1] }}
            style={{ transformPerspective: 1200 }}
          >
            {children}
          </motion.div>
          <button ref={cerrar} type="button" className="lbx-x" onClick={onCerrar} aria-label="Cerrar">
            <Icon name="cerrar" size={22} />
          </button>
        </motion.div>
      )}
    </AnimatePresence>,
    document.body,
  );
}
