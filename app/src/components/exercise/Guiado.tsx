import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Glosa } from '../Glosario';
import { useReducedMotion } from 'framer-motion';
import type { Ejercicio } from '../../types';
import { imgSrc } from '../../content';
import { acciones, useProgreso } from '../../lib/progress';
import { conIni } from '../../lib/texto';
import { Captura, CajaHotspot, Fallos, type Marca } from './Captura';
import { RutaMenu } from './SeccionVista';
import { dentro, pasosPlanos, useMedia } from './util';

type Fase = 'jugando' | 'acierto';

/**
 * Paso «Guiado» en plano: un contador, la instrucción una vez, la captura a todo el ancho.
 * Mientras dura, el único botón para avanzar es el de dentro («Continuar»); al acabar avisa con onListo
 * y la página muestra su «Siguiente» del pie.
 */
export function Guiado({ ej, modulo, ini, onListo }: { ej: Ejercicio; modulo: string; ini: string; onListo: (listo: boolean) => void }) {
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
  // Si ya lo terminó otro día, empieza en el resumen (puede repetirlo)
  const [fin, setFin] = useState(() => !!estado?.guiado);
  const idMarca = useRef(0);
  const stageRef = useRef<HTMLDivElement>(null);
  const t = (x: string) => conIni(x, ini);
  const tactil = useMedia('(pointer: coarse)');

  useEffect(() => { onListo(fin); }, [fin, onListo]);

  const actual = pasos[i];
  const total = pasos.length;
  const h = actual?.paso.hotspot;
  const img = actual?.paso.imagen;
  const conClic = !!(h && img);
  const hecho = actual ? hechos.includes(actual.idx) : false;

  // En móvil la captura va ampliada con desplazamiento lateral: céntrala en el punto
  useEffect(() => {
    const id = window.setTimeout(() => {
      const el = stageRef.current?.querySelector<HTMLElement>('.shot');
      const hs = pasos[i]?.paso.hotspot;
      if (!el || el.scrollWidth <= el.clientWidth + 2) return;
      const cx = hs ? ((hs.x + hs.w / 2) / 100) * el.scrollWidth : 0;
      el.scrollTo({ left: Math.max(0, cx - el.clientWidth / 2), behavior: reducir ? 'auto' : 'smooth' });
    }, 120);
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
      setI(n);
      setFallos(0);
      setMarcas([]);
      setFase('jugando');
      setFin(false);
    },
    [total],
  );

  const terminar = useCallback(() => {
    acciones.terminarGuiado(ej.id);
    setFin(true);
  }, [ej.id]);

  const avanzar = useCallback(() => {
    if (!actual) return;
    acciones.marcarPaso(ej.id, actual.idx);
    if (i >= total - 1) terminar();
    else ir(i + 1);
  }, [actual, ej.id, i, total, ir, terminar]);

  const acertar = useCallback(() => {
    if (fase !== 'jugando') return;
    setFase('acierto');
    setTimeout(avanzar, reducir ? 200 : 550);
  }, [fase, avanzar, reducir]);

  const onPunto = (x: number, y: number) => {
    if (!h || fase !== 'jugando' || fin) return;
    if (dentro(h, x, y, tactil ? 3.5 : 1.5)) acertar();
    else {
      setFallos((f) => f + 1);
      setMarcas((m) => [...m.slice(-3), { id: ++idMarca.current, x, y }]);
    }
  };

  // Teclado: ← anterior, → / Intro continuar (en pasos de clic solo si ya está hecho)
  useEffect(() => {
    const f = (e: KeyboardEvent) => {
      const tgt = e.target as HTMLElement | null;
      if (tgt && (tgt.tagName === 'INPUT' || tgt.tagName === 'TEXTAREA' || tgt.isContentEditable)) return;
      if (fin) return;
      if (e.key === 'ArrowLeft') {
        e.preventDefault();
        ir(i - 1);
      } else if (e.key === 'ArrowRight' || (e.key === 'Enter' && !(tgt && (tgt.tagName === 'BUTTON' || tgt.tagName === 'A')))) {
        if (!conClic || hecho) {
          e.preventDefault();
          avanzar();
        }
      }
    };
    window.addEventListener('keydown', f);
    return () => window.removeEventListener('keydown', f);
  }, [i, conClic, hecho, fin, ir, avanzar]);

  if (!total) return <p className="muted">Este bloque no tiene pasos guiados.</p>;

  if (fin) {
    return (
      <div className="pl pl-fin">
        <p className="pl-res">Recorrido terminado: has hecho los {total} pasos sobre las pantallas del ERP.</p>
        <p className="muted">Ahora repítelo sin ayuda en el paso siguiente.</p>
        <button type="button" className="pl-link" onClick={() => ir(0)}>
          Repetir el recorrido desde el principio
        </button>
      </div>
    );
  }

  return (
    <div className="pl" ref={stageRef}>
      <p className="pl-cont" aria-live="polite">
        <b>
          Clic {i + 1} de {total}
        </b>{' '}
        · {t(actual.seccion.titulo)}
      </p>
      <div className="pl-barra" aria-hidden="true">
        <i style={{ width: `${((i + 1) / total) * 100}%` }} />
      </div>

      <p className="pl-instr">
        <Glosa>{t(actual.paso.texto)}</Glosa>
      </p>
      {actual.paso.detalle && (
        <p className="pl-det">
          <Glosa>{t(actual.paso.detalle)}</Glosa>
        </p>
      )}

      {img ? (
        <div className="pl-shot" key={i}>
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
          {conClic && <p className="pl-swipe">Desliza la captura a los lados para verla entera.</p>}
        </div>
      ) : (
        !actual.paso.detalle && actual.seccion.ruta && actual.seccion.ruta.length > 0 && <RutaMenu ruta={actual.seccion.ruta.map(t)} />
      )}

      <p className="pl-fb" aria-live="polite">
        {fase === 'acierto' && 'Correcto.'}
        {fase === 'jugando' && conClic && !hecho && fallos === 1 && `Ahí no. Busca «${h!.etiqueta}», dentro del recuadro.`}
        {fase === 'jugando' && conClic && !hecho && fallos >= 2 && `Pista: «${h!.etiqueta}» está resaltado en la captura.`}
        {fase === 'jugando' && conClic && !hecho && fallos === 0 && 'Haz clic en la captura, donde lo harías en el ERP.'}
      </p>

      <div className="pl-btns">
        <button type="button" className="btn ghost sm" onClick={() => ir(i - 1)} disabled={i === 0}>
          Atrás
        </button>
        {(!conClic || (hecho && fase === 'jugando')) && (
          <button type="button" className="btn arc" onClick={avanzar}>
            {i === total - 1 ? 'Terminar el recorrido' : 'Continuar'}
          </button>
        )}
        {conClic && !hecho && fallos >= 3 && fase === 'jugando' && (
          <button type="button" className="btn ghost sm" onClick={() => (i >= total - 1 ? terminar() : ir(i + 1))}>
            Saltar este clic
          </button>
        )}
      </div>
    </div>
  );
}
