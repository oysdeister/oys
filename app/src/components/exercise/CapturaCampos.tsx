import { useEffect, useMemo, useRef, useState, type ReactNode } from 'react';
import { createPortal } from 'react-dom';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import type { Hotspot, Seccion } from '../../types';
import { imgSrc } from '../../content';
import { conIni } from '../../lib/texto';
import { Icon } from '../Icon';
import { VerMas } from './Revela';

const MAX_FILAS = 6;

interface Vista {
  imagen: string;
  hotspots: Hotspot[];
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

/** Captura real de la pantalla junto a la tabla de campos: al pasar por una fila se resalta el campo. */
export function CapturaCampos({ s, modulo, ini }: { s: Seccion; modulo: string; ini: string }) {
  const reducir = useReducedMotion();
  const t = (x: string) => conIni(x, ini);

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

  /** Para cada fila de la tabla: en qué captura y en qué hotspot está su campo */
  const enlaces = useMemo(
    () =>
      s.campos.map((c) => {
        for (let vi = 0; vi < vistas.length; vi++) {
          const h = vistas[vi].hotspots.find((x) => casa(c.campo, x.etiqueta));
          if (h) return { vi, h };
        }
        return null;
      }),
    [s.campos, vistas],
  );

  const mejor = useMemo(() => {
    if (!vistas.length) return 0;
    const cuenta = vistas.map((_, vi) => enlaces.filter((e) => e?.vi === vi).length);
    const max = Math.max(...cuenta);
    return max > 0 ? cuenta.indexOf(max) : 0;
  }, [vistas, enlaces]);

  const [vi, setVi] = useState(mejor);
  const [activa, setActiva] = useState<number | null>(null);
  const [grande, setGrande] = useState(false);
  const [todas, setTodas] = useState(false);
  useEffect(() => setVi(mejor), [mejor]);

  const pins = enlaces
    .map((e, fila) => (e && e.vi === vi ? { fila, h: e.h, n: fila + 1 } : null))
    .filter((x): x is { fila: number; h: Hotspot; n: number } => !!x);

  const activar = (fila: number | null) => {
    setActiva(fila);
    if (fila != null && fila >= MAX_FILAS) setTodas(true);
    const e = fila == null ? null : enlaces[fila];
    if (e && e.vi !== vi) setVi(e.vi);
  };

  const tabla = (
    <table className="fields ax-table cc-table">
      <thead>
        <tr>
          <th scope="col">Campo</th>
          <th scope="col">Qué significa</th>
          <th scope="col">Ejemplo</th>
        </tr>
      </thead>
      <tbody onMouseLeave={() => setActiva(null)}>
        {s.campos.map((c, i) => {
          if (!todas && i >= MAX_FILAS) return null;
          const e = enlaces[i];
          return (
            <tr
              key={i}
              className={`${e ? 'cc-has' : ''}${activa === i ? ' cc-on' : ''}`}
              onMouseEnter={() => e && activar(i)}
              onClick={() => e && activar(activa === i ? null : i)}
              onFocus={() => e && activar(i)}
              tabIndex={e ? 0 : undefined}
              aria-label={e ? `${t(c.campo)}: ver dónde está en la captura` : undefined}
            >
              <td>
                {e && <span className="cc-n" aria-hidden="true">{i + 1}</span>}
                {t(c.campo)}
              </td>
              <td>{t(c.significado)}</td>
              <td>{c.ejemplo ? <code>{t(c.ejemplo)}</code> : null}</td>
            </tr>
          );
        })}
      </tbody>
    </table>
  );

  const verMas =
    s.campos.length > MAX_FILAS ? (
      <VerMas abierto={todas} resto={s.campos.length - MAX_FILAS} que={s.campos.length - MAX_FILAS === 1 ? 'campo más' : 'campos más'} onClick={() => setTodas((v) => !v)} />
    ) : null;

  if (!vistas.length)
    return s.campos.length ? (
      <div className="sec-campos">
        {tabla}
        {verMas}
      </div>
    ) : null;

  const v = vistas[Math.min(vi, vistas.length - 1)];
  const hAct = activa != null && enlaces[activa]?.vi === vi ? enlaces[activa]!.h : null;

  const lienzo = (zoom: boolean) => (
    <div className={`cc-frame${zoom ? ' zoom' : ''}`}>
      <img src={imgSrc(modulo, v.imagen)} alt={`Pantalla del ERP: ${t(s.titulo)}`} draggable={false} />
      {pins.map((p) => (
        <button
          key={p.fila}
          type="button"
          className={`cc-pin${activa === p.fila ? ' on' : ''}`}
          style={{ left: `${p.h.x + p.h.w / 2}%`, top: `${p.h.y + p.h.h / 2}%` }}
          onClick={(ev) => {
            ev.stopPropagation();
            activar(activa === p.fila ? null : p.fila);
          }}
          aria-label={`Campo ${p.n}: ${t(s.campos[p.fila].campo)}`}
        >
          {p.n}
        </button>
      ))}
      <AnimatePresence>
        {hAct && (
          <motion.div
            key={`${activa}-${vi}`}
            className="cc-box"
            style={{ left: `${hAct.x}%`, top: `${hAct.y}%`, width: `${hAct.w}%`, height: `${hAct.h}%` }}
            initial={reducir ? { opacity: 0 } : { opacity: 0, scale: 1.4 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.22, ease: [0.2, 0.7, 0.2, 1] }}
            aria-hidden="true"
          >
            <span className={`cc-tag${hAct.y + hAct.h > 80 ? ' up' : ''}${hAct.x > 60 ? ' right' : ''}`}>{s.campos[activa!].campo.replace(/\s*\*$/, '')}</span>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );

  return (
    <div className={`cc${s.campos.length ? '' : ' solo'}`}>
      <figure className="cc-shot">
        <div className="cc-stick">
          {lienzo(false)}
          <button type="button" className="cc-zoom" onClick={() => setGrande(true)} aria-label="Ampliar la captura">
            <Icon name="buscar" size={18} />
            <span>Ampliar</span>
          </button>
          {vistas.length > 1 && (
            <div className="cc-thumbs" role="group" aria-label="Capturas de esta parte">
              {vistas.map((x, k) => (
                <button key={x.imagen} type="button" className={k === vi ? 'on' : ''} onClick={() => setVi(k)} aria-label={`Captura ${k + 1} de ${vistas.length}`} aria-pressed={k === vi}>
                  <img src={imgSrc(modulo, x.imagen)} alt="" loading="lazy" />
                </button>
              ))}
            </div>
          )}
          {pins.length > 0 && <figcaption className="small muted">Toca un número o una fila de la tabla para ver dónde está cada campo.</figcaption>}
        </div>
      </figure>
      {s.campos.length > 0 && (
        <div className="sec-campos cc-campos">
          {tabla}
          {verMas}
        </div>
      )}
      <Lightbox abierto={grande} onCerrar={() => setGrande(false)}>
        {lienzo(true)}
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
