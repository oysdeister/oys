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

/** Saca la ruta «A › B › C» que cite el texto de un paso (null si no cita ninguna) */
function rutaDeTexto(texto: string): string[] | null {
  const partes = texto.split('›');
  if (partes.length < 2) return null;
  const ini = partes[0].match(/([A-ZÁÉÍÓÚÑ][\p{L}\d]*)\s*$/u);
  if (!ini) return null;
  const ult = partes[partes.length - 1].split(/\s*(?:[,;:()«»]|\.(?=\s+[A-ZÁÉÍÓÚÑ]|\s*$)|\s(?:y|o|para|hasta)\s)/)[0];
  const ruta = [ini[1], ...partes.slice(1, -1), ult].map((x) => x.trim()).filter((x) => x && x !== '…');
  return ruta.length >= 2 ? ruta : null;
}

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
  // Paso sin captura propia: solo se reutiliza una captura de SU MISMA parte (la anterior; si no, la siguiente,
  // que es la pantalla a la que llega). Nunca la de otra parte: enseñaría una pantalla que no describe el paso.
  const ref = useMemo(() => {
    if (!actual || img) return undefined;
    const deSuParte = (x: (typeof pasos)[number]) => x.secIdx === actual.secIdx && !!x.paso.imagen;
    const previa = pasos.slice(0, i).reverse().find(deSuParte);
    if (previa) return { imagen: previa.paso.imagen!, siguiente: false };
    const sig = pasos.slice(i + 1).find(deSuParte);
    return sig ? { imagen: sig.paso.imagen!, siguiente: true } : undefined;
  }, [actual, img, pasos, i]);
  const imgRef = ref?.imagen;
  // Sin captura en su parte: la ruta de menú de la parte o, si no hay, la que cite el texto («A › B › C»)
  const rutaPaso = useMemo(() => {
    if (!actual) return null;
    if (actual.seccion.ruta && actual.seccion.ruta.length) return actual.seccion.ruta;
    return rutaDeTexto(actual.paso.texto);
  }, [actual]);
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

  // Al cambiar de paso la página puede encoger: que el título no quede a medias bajo la barra superior
  const primerRender = useRef(true);
  useEffect(() => {
    if (primerRender.current) { primerRender.current = false; return; }
    const el = stageRef.current;
    if (!el || window.scrollY <= 0) return;
    const barra = document.querySelector<HTMLElement>('.tb')?.offsetHeight ?? 64;
    const arriba = el.getBoundingClientRect().top + window.scrollY - barra - 12;
    window.scrollTo({ top: window.scrollY < arriba ? 0 : Math.max(0, arriba), behavior: 'auto' });
  }, [i]);

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

  // Bloque sin pasos con clic (p. ej. Fundamentos): se da por hecho con un botón, para que se pueda completar
  if (!total) {
    return (
      <div className="pl pl-fin">
        <p className="pl-res">{fin ? 'Hecho: ya puedes pasar al Test.' : 'Este bloque no tiene pasos con clic: es de lectura.'}</p>
        {!fin && (
          <>
            <p className="muted">Cuando hayas leído el Concepto, márcalo como hecho y pasa al Test.</p>
            <button type="button" className="btn" onClick={terminar}>
              Lo he leído: marcar como hecho
            </button>
          </>
        )}
      </div>
    );
  }

  if (fin) {
    return (
      <div className="pl pl-fin">
        <p className="pl-res">Recorrido terminado: has hecho los {total} pasos sobre las pantallas del ERP.</p>
        <p className="muted">Si quieres, repítelo sin ayuda en «De memoria» (opcional) o pasa al Test.</p>
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
          Instrucción {i + 1} de {total}
        </b>{' '}
        · {t(actual.seccion.titulo)}
      </p>
      <div className="pl-barra" aria-hidden="true">
        <i style={{ width: `${((i + 1) / total) * 100}%` }} />
      </div>

      <div className="pl-paso">
        <span className="pl-paso-n" aria-hidden="true">
          {i + 1}
        </span>
        <div>
          <p className="pl-instr">
            <Glosa>{t(actual.paso.texto)}</Glosa>
          </p>
          {actual.paso.detalle && (
            <p className="pl-det">
              <Glosa>{t(actual.paso.detalle)}</Glosa>
            </p>
          )}
        </div>
      </div>

      {img ? (
        <div className="pl-shot" key={i}>
          <Captura src={imgSrc(modulo, img)} alt={`Captura del ERP: ${t(actual.paso.texto)}`} onPunto={onPunto} clicable={conClic && fase === 'jugando'} ampliable instruccion={t(actual.paso.texto)}>
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
      ) : imgRef ? (
        <div className="pl-shot pl-shot-ref" key={i}>
          <p className="pl-ref">
            {ref?.siguiente
              ? 'Esta es la pantalla a la que llegas con este paso. Aquí no hay que pulsar: lee la instrucción y pulsa «Continuar».'
              : 'Pantalla de esta parte. En este paso no hay que pulsar en ella: lee la instrucción y pulsa «Continuar».'}
          </p>
          <Captura src={imgSrc(modulo, imgRef)} alt={`Captura del ERP: ${t(actual.seccion.titulo)}`} clicable={false} ampliable />
        </div>
      ) : (
        <div className="pl-sin" key={i}>
          <p className="pl-ref">Este paso no tiene captura: lee la instrucción y pulsa «Continuar».</p>
          {rutaPaso && rutaPaso.length > 0 && (
            <>
              <p className="pl-sin-t">Ruta de menú</p>
              <RutaMenu ruta={rutaPaso.map(t)} />
            </>
          )}
        </div>
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
