import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import confetti from 'canvas-confetti';
import type { Ejercicio } from '../../types';
import { imgSrc } from '../../content';
import { acciones, useProgreso } from '../../lib/progress';
import { conIni } from '../../lib/texto';
import { Icon } from '../Icon';
import { Captura, CajaHotspot, Fallos, type Marca } from './Captura';
import { RutaMenu } from './SeccionVista';
import { COLORES_MARCA, dentro, pasosPlanos, useMedia } from './util';
import { momentosDeSeccion } from '../../content/videoMapa';
import { Momentos } from './VideoMomento';

type Fase = 'jugando' | 'acierto';

export function Guiado({ ej, modulo, ini, onIr }: { ej: Ejercicio; modulo: string; ini: string; onIr: (tab: string) => void }) {
  const reducir = useReducedMotion();
  const p = useProgreso();
  const estado = p.ejercicios[ej.id];
  const pasos = useMemo(() => pasosPlanos(ej), [ej]);
  const hechos = estado?.pasos ?? [];
  const [i, setI] = useState(() => {
    const primero = pasos.findIndex((x) => !hechos.includes(x.idx));
    return primero < 0 ? 0 : primero;
  });
  const [fallos, setFallos] = useState(0);
  const [marcas, setMarcas] = useState<Marca[]>([]);
  const [fase, setFase] = useState<Fase>('jugando');
  const [fin, setFin] = useState(false);
  const [dir, setDir] = useState(1);
  const idMarca = useRef(0);
  const stageRef = useRef<HTMLDivElement>(null);
  const t = (x: string) => conIni(x, ini);
  const tactil = useMedia('(pointer: coarse)');

  const actual = pasos[i];
  const total = pasos.length;
  const h = actual?.paso.hotspot;
  const img = actual?.paso.imagen;
  const conClic = !!(h && img);
  const hecho = actual ? hechos.includes(actual.idx) : false;

  // En móvil la captura va ampliada con desplazamiento lateral: céntrala en el hotspot
  useEffect(() => {
    const id = window.setTimeout(() => {
      const el = stageRef.current?.querySelector<HTMLElement>('.shot');
      const hs = pasos[i]?.paso.hotspot;
      if (!el || el.scrollWidth <= el.clientWidth + 2) return;
      const cx = hs ? ((hs.x + hs.w / 2) / 100) * el.scrollWidth : 0;
      el.scrollTo({ left: Math.max(0, cx - el.clientWidth / 2), behavior: reducir ? 'auto' : 'smooth' });
    }, reducir ? 0 : 420);
    return () => window.clearTimeout(id);
  }, [i, pasos, reducir]);

  // Precarga la captura siguiente
  useEffect(() => {
    const sig = pasos.slice(i + 1).find((x) => x.paso.imagen);
    if (sig?.paso.imagen) {
      const im = new Image();
      im.src = imgSrc(modulo, sig.paso.imagen);
    }
  }, [i, pasos, modulo]);

  const ir = useCallback(
    (n: number) => {
      if (n < 0 || n >= total) return;
      setDir(n > i ? 1 : -1);
      setI(n);
      setFallos(0);
      setMarcas([]);
      setFase('jugando');
      setFin(false);
    },
    [i, total],
  );

  const terminar = useCallback(() => {
    acciones.terminarGuiado(ej.id);
    setFin(true);
    if (!reducir) {
      void confetti({ particleCount: 140, spread: 80, origin: { y: 0.6 }, colors: COLORES_MARCA, disableForReducedMotion: true });
      setTimeout(() => void confetti({ particleCount: 80, angle: 60, spread: 60, origin: { x: 0, y: 0.7 }, colors: COLORES_MARCA, disableForReducedMotion: true }), 250);
      setTimeout(() => void confetti({ particleCount: 80, angle: 120, spread: 60, origin: { x: 1, y: 0.7 }, colors: COLORES_MARCA, disableForReducedMotion: true }), 400);
    }
  }, [ej.id, reducir]);

  const avanzar = useCallback(() => {
    if (!actual) return;
    acciones.marcarPaso(ej.id, actual.idx);
    if (i >= total - 1) terminar();
    else ir(i + 1);
  }, [actual, ej.id, i, total, ir, terminar]);

  const acertar = useCallback(() => {
    if (fase !== 'jugando') return;
    setFase('acierto');
    setTimeout(avanzar, reducir ? 250 : 750);
  }, [fase, avanzar, reducir]);

  const onPunto = (x: number, y: number) => {
    if (!h || fase !== 'jugando' || fin) return;
    if (dentro(h, x, y, tactil ? 3.5 : 1.5)) acertar();
    else {
      setFallos((f) => f + 1);
      setMarcas((m) => [...m.slice(-3), { id: ++idMarca.current, x, y }]);
    }
  };

  // Teclado: ← anterior, → / Intro siguiente (en pasos de clic solo si ya está hecho)
  useEffect(() => {
    const f = (e: KeyboardEvent) => {
      const tgt = e.target as HTMLElement | null;
      if (tgt && (tgt.tagName === 'INPUT' || tgt.tagName === 'TEXTAREA' || tgt.isContentEditable)) return;
      if (e.key === 'ArrowLeft') {
        e.preventDefault();
        ir(i - 1);
      } else if (e.key === 'ArrowRight' || (e.key === 'Enter' && !(tgt && (tgt.tagName === 'BUTTON' || tgt.tagName === 'A')))) {
        if (fin) return;
        if (!conClic || hecho) {
          e.preventDefault();
          if (conClic && hecho) {
            if (i >= total - 1) terminar();
            else ir(i + 1);
          } else avanzar();
        }
      }
    };
    window.addEventListener('keydown', f);
    return () => window.removeEventListener('keydown', f);
  }, [i, conClic, hecho, fin, ir, avanzar, terminar, total]);

  if (!total) return <p className="muted">Este ejercicio no tiene pasos guiados.</p>;

  if (fin) {
    return (
      <motion.div className="sheet pad gd-fin" initial={{ opacity: 0, scale: 0.94, rotateX: -10 }} animate={{ opacity: 1, scale: 1, rotateX: 0 }} transition={{ type: 'spring', stiffness: 120, damping: 16 }}>
        <svg className="gd-fin-arc" viewBox="0 0 220 120" aria-hidden="true">
          <motion.path d="M12 108 C 6 46, 90 6, 212 24" fill="none" stroke="var(--arc)" strokeWidth="10" strokeLinecap="round" initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 1 }} />
        </svg>
        <h2>Recorrido terminado</h2>
        <p className="muted">Has hecho los {total} pasos sobre las pantallas reales. Ahora comprueba si te acuerdas sin ayuda.</p>
        <div className="row-btns">
          <button className="btn arc" onClick={() => onIr('memoria')}>
            Practicar de memoria
          </button>
          <button className="btn ghost" onClick={() => onIr('test')}>
            Hacer el test
          </button>
          <button className="btn ghost" onClick={() => ir(0)}>
            Repetir el recorrido
          </button>
        </div>
      </motion.div>
    );
  }

  const nSec = ej.secciones.length;
  const instruccion = conClic ? (fallos >= 2 ? `Pista: busca «${h!.etiqueta}», marcado en ámbar.` : `Haz clic en «${h!.etiqueta}».`) : null;

  return (
    <div className="player gd">
      <div className="gd-stage" ref={stageRef}>
        <div className="gd-sec">
          <span className="gd-sec-n">
            Parte {actual.secIdx + 1} de {nSec}
          </span>
          <strong>{t(actual.seccion.titulo)}</strong>
        </div>
        {img && <p className="gd-caption">{t(actual.paso.texto)}</p>}
        <AnimatePresence mode="wait" custom={dir} initial={false}>
          <motion.div
            key={i}
            custom={dir}
            initial={reducir ? { opacity: 0 } : { opacity: 0, x: dir * 90, rotateY: dir * -28, scale: 0.92 }}
            animate={{ opacity: 1, x: 0, rotateY: 0, scale: 1 }}
            exit={reducir ? { opacity: 0 } : { opacity: 0, x: dir * -90, rotateY: dir * 28, scale: 0.92 }}
            transition={{ duration: 0.38, ease: [0.2, 0.7, 0.2, 1] }}
            style={{ transformPerspective: 1400, transformOrigin: dir > 0 ? '0% 50%' : '100% 50%' }}
          >
            {img ? (
              <>
              <Captura src={imgSrc(modulo, img)} alt={`Captura del ERP: ${t(actual.paso.texto)}`} onPunto={onPunto} clicable={conClic && fase === 'jugando'}>
                {h && fase === 'acierto' && <CajaHotspot h={h} modo="acierto" />}
                {h && fase === 'jugando' && <CajaHotspot h={h} modo={fallos >= 2 ? 'pista' : 'aro'} />}
                {h && fase === 'jugando' && (
                  <button
                    className="hs-a11y"
                    style={{ left: `${h.x}%`, top: `${h.y}%`, width: `${h.w}%`, height: `${h.h}%` }}
                    onClick={(e) => {
                      e.stopPropagation();
                      acertar();
                    }}
                    onPointerUp={(e) => e.stopPropagation()}
                    aria-label={`Pulsar «${h.etiqueta}»`}
                  />
                )}
                <Fallos marcas={marcas} />
              </Captura>
              {conClic && <p className="gd-swipe">Desliza la captura a los lados para verla entera.</p>}
              </>
            ) : (
              <div className="shot shot-text">
                <div className="shot-text-in">
                  <RutaMenu ruta={actual.seccion.ruta?.map(t) ?? null} />
                  <p>{t(actual.paso.texto)}</p>
                  {actual.paso.detalle && <small>{t(actual.paso.detalle)}</small>}
                  <span className="shot-text-note">Este paso no tiene captura: hazlo mentalmente y sigue.</span>
                </div>
              </div>
            )}
          </motion.div>
        </AnimatePresence>
      </div>

      <aside className="sheet pad step-card gd-card" aria-live="polite">
        <div className="gd-card-top">
          <span className="step-count">
            {String(i + 1).padStart(2, '0')}
            <small>/{total}</small>
          </span>
          {hecho && <span className="chip ok">Hecho</span>}
        </div>
        <p className="gd-texto">{t(actual.paso.texto)}</p>
        {actual.paso.detalle && <p className={`small muted${img ? '' : ' gd-det-dup'}`}>{t(actual.paso.detalle)}</p>}
        {actual.local === 0 && <Momentos lista={momentosDeSeccion(actual.seccion.id)} compacto />}
        {instruccion && (
          <motion.div key={fallos >= 2 ? 'pista' : 'base'} className={`gd-instr${fallos >= 2 ? ' hint' : ''}`} initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }}>
            <span className="gd-target" aria-hidden="true" />
            {fase === 'acierto' ? '¡Bien! Ahí es.' : instruccion}
          </motion.div>
        )}
        {fallos === 1 && fase === 'jugando' && <p className="small gd-err">Ahí no. Mira el aro ámbar.</p>}
        <div className="row-btns gd-btns">
          <button className="btn ghost sm" onClick={() => ir(i - 1)} disabled={i === 0} aria-label="Paso anterior">
            <Icon name="atras" size={18} />
          </button>
          {!conClic && (
            <button className="btn arc" onClick={avanzar}>
              {i === total - 1 ? 'Terminar' : 'Siguiente'}
            </button>
          )}
          {conClic && hecho && fase === 'jugando' && (
            <button className="btn ghost" onClick={() => (i >= total - 1 ? terminar() : ir(i + 1))}>
              {i === total - 1 ? 'Terminar' : 'Siguiente'}
            </button>
          )}
          {conClic && !hecho && fallos >= 3 && fase === 'jugando' && (
            <button className="btn ghost sm" onClick={() => (i >= total - 1 ? terminar() : ir(i + 1))}>
              Saltar este paso
            </button>
          )}
        </div>
        <div className="gd-bar" aria-hidden="true">
          <div className="ax-bar">
            <i style={{ width: `${((i + 1) / total) * 100}%` }} />
          </div>
          <span>
            Parte {actual.secIdx + 1} de {nSec} · paso {actual.local + 1} de {actual.seccion.pasos.length}
          </span>
        </div>
        <div className="dots gd-dots" role="group" aria-label="Pasos">
          {pasos.map((x, n) => (
            <button
              key={n}
              className={`${hechos.includes(x.idx) ? 'on' : ''}${n === i ? ' cur' : ''}${n > 0 && pasos[n - 1].secIdx !== x.secIdx ? ' gap' : ''}`}
              onClick={() => ir(n)}
              aria-label={`Paso ${n + 1}${hechos.includes(x.idx) ? ', hecho' : ''}`}
              aria-current={n === i ? 'step' : undefined}
            />
          ))}
        </div>
        <p className="small muted gd-keys">Teclado: ← y → para moverte, Intro para seguir.</p>
      </aside>
    </div>
  );
}
