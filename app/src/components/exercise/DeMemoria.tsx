import { useEffect, useMemo, useRef, useState } from 'react';
import { Reorder } from 'framer-motion';
import type { Ejercicio } from '../../types';
import { imgSrc } from '../../content';
import { conIni } from '../../lib/texto';
import { Icon } from '../Icon';
import { Captura, CajaHotspot, Fallos, type Marca } from './Captura';
import { barajarDistinto, dentro, pasosPlanos, useMedia, type PasoPlano } from './util';

const MAX_CLICS = 10;

/** Elige hasta n elementos repartidos a lo largo de la lista, manteniendo el orden */
function repartidos<T>(arr: T[], n: number) {
  if (arr.length <= n) return arr;
  return Array.from({ length: n }, (_, k) => arr[Math.round((k * (arr.length - 1)) / (n - 1))]);
}

export function DeMemoria({ ej, modulo, ini, onListo }: { ej: Ejercicio; modulo: string; ini: string; onListo: (listo: boolean) => void }) {
  const conHotspot = useMemo(() => pasosPlanos(ej).filter((x) => x.paso.hotspot && x.paso.imagen), [ej]);
  const ordenables = useMemo(() => ej.secciones.map((s, i) => ({ s, i })).filter(({ s }) => s.pasos.length >= 4), [ej]);

  if (conHotspot.length) return <DondeClic pasos={conHotspot} modulo={modulo} ini={ini} onListo={onListo} />;
  if (ordenables.length) return <Ordenar ej={ej} secciones={ordenables} ini={ini} onListo={onListo} />;
  return <p className="muted">Este bloque no tiene pantallas para repetir de memoria.</p>;
}

function DondeClic({ pasos, modulo, ini, onListo }: { pasos: PasoPlano[]; modulo: string; ini: string; onListo: (listo: boolean) => void }) {
  const tactil = useMedia('(pointer: coarse)');
  const lista = useMemo(() => repartidos(pasos, MAX_CLICS), [pasos]);
  const [i, setI] = useState(0);
  const [intentos, setIntentos] = useState(0);
  const [marcas, setMarcas] = useState<Marca[]>([]);
  const [res, setRes] = useState<'nada' | 'bien' | 'revelado'>('nada');
  const [aciertos, setAciertos] = useState(0);
  const [fin, setFin] = useState(false);
  const idM = useRef(0);
  const t = (x: string) => conIni(x, ini);
  const actual = lista[i];
  const h = actual?.paso.hotspot;

  useEffect(() => { onListo(fin); }, [fin, onListo]);

  const reiniciar = () => {
    setI(0);
    setIntentos(0);
    setMarcas([]);
    setRes('nada');
    setAciertos(0);
    setFin(false);
  };

  const onPunto = (x: number, y: number) => {
    if (!h || res !== 'nada') return;
    if (dentro(h, x, y, tactil ? 3.5 : 2)) {
      setRes('bien');
      if (intentos === 0) setAciertos((a) => a + 1);
    } else {
      const n = intentos + 1;
      setIntentos(n);
      setMarcas((m) => [...m.slice(-3), { id: ++idM.current, x, y }]);
      if (n >= 2) setRes('revelado');
    }
  };

  const siguiente = () => {
    if (i >= lista.length - 1) {
      setFin(true);
      return;
    }
    setI(i + 1);
    setIntentos(0);
    setMarcas([]);
    setRes('nada');
  };

  if (fin) {
    const nota = aciertos / lista.length;
    return (
      <div className="pl pl-fin">
        <p className="pl-res">
          Aciertos a la primera: {aciertos} de {lista.length}.
        </p>
        <p className="muted">
          {nota >= 0.8
            ? 'Recuerdas dónde está cada cosa. Sigue con el test.'
            : 'Te conviene repasar el Guiado y repetir este paso: la segunda vez se fija mejor.'}
        </p>
        <button type="button" className="pl-link" onClick={reiniciar}>
          Repetir este paso
        </button>
      </div>
    );
  }

  return (
    <div className="pl">
      <p className="pl-cont" aria-live="polite">
        <b>
          Pantalla {i + 1} de {lista.length}
        </b>{' '}
        · {t(actual.seccion.titulo)}
      </p>
      <div className="pl-barra" aria-hidden="true">
        <i style={{ width: `${((i + 1) / lista.length) * 100}%` }} />
      </div>
      <p className="pl-instr">{t(actual.paso.texto)}</p>
      <div className="pl-shot" key={i}>
        <Captura src={imgSrc(modulo, actual.paso.imagen!)} alt="Captura del ERP: busca dónde harías clic" onPunto={onPunto} clicable={res === 'nada'} ampliable instruccion={t(actual.paso.texto)}>
          {h && res === 'bien' && <CajaHotspot h={h} modo="acierto" />}
          {h && res === 'revelado' && <CajaHotspot h={h} modo="revelar" />}
          <Fallos marcas={marcas} />
        </Captura>
        <p className="pl-swipe">Desliza la captura a los lados para verla entera.</p>
      </div>
      <p className="pl-fb" aria-live="polite">
        {res === 'nada' && intentos === 0 && 'Haz clic en la captura donde lo harías en el ERP. Esta vez no hay marca.'}
        {res === 'nada' && intentos === 1 && 'No es ahí. Tienes otro intento.'}
        {res === 'bien' && (intentos === 0 ? 'Correcto, a la primera.' : 'Correcto.')}
        {res === 'revelado' && h && `Era aquí: «${h.etiqueta}». Fíjate y continúa.`}
      </p>
      {res !== 'nada' && (
        <div className="pl-btns">
          <button type="button" className="btn arc" onClick={siguiente} autoFocus>
            {i >= lista.length - 1 ? 'Ver el resultado' : 'Continuar'}
          </button>
        </div>
      )}
    </div>
  );
}

interface Item {
  id: number;
  texto: string;
}

function Ordenar({ ej, secciones, ini, onListo }: { ej: Ejercicio; secciones: { s: Ejercicio['secciones'][number]; i: number }[]; ini: string; onListo: (listo: boolean) => void }) {
  // Las partes se ordenan una detrás de otra, sin elegir
  const [k, setK] = useState(0);
  const [fin, setFin] = useState(false);
  const sec = ej.secciones[secciones[Math.min(k, secciones.length - 1)].i];
  const correctos = useMemo<Item[]>(() => sec.pasos.slice(0, 7).map((p, id) => ({ id, texto: conIni(p.texto, ini) })), [sec, ini]);
  const [items, setItems] = useState<Item[]>(() => barajarDistinto(correctos));
  const [comprobado, setComprobado] = useState(false);
  const [clave, setClave] = useState(k);

  useEffect(() => { onListo(fin); }, [fin, onListo]);

  // Cambio de parte: baraja de nuevo
  if (clave !== k) {
    setClave(k);
    setItems(barajarDistinto(correctos));
    setComprobado(false);
  }

  const bien = items.filter((it, n) => it.id === n).length;
  const todo = comprobado && bien === items.length;

  const mover = (n: number, d: number) => {
    const m = n + d;
    if (m < 0 || m >= items.length) return;
    const a = [...items];
    [a[n], a[m]] = [a[m], a[n]];
    setItems(a);
    setComprobado(false);
  };

  const seguir = () => {
    if (k >= secciones.length - 1) setFin(true);
    else setK(k + 1);
  };

  if (fin) {
    return (
      <div className="pl pl-fin">
        <p className="pl-res">Has ordenado los pasos de todas las partes.</p>
        <button type="button" className="pl-link" onClick={() => { setK(0); setClave(-1); setFin(false); }}>
          Repetir este paso
        </button>
      </div>
    );
  }

  return (
    <div className="pl mem-orden">
      <p className="pl-cont" aria-live="polite">
        <b>
          Parte {k + 1} de {secciones.length}
        </b>{' '}
        · {conIni(sec.titulo, ini)}
      </p>
      <p className="pl-instr">Pon los pasos en el orden en que los harías en el ERP. Arrastra cada fila o usa las flechas.</p>
      <Reorder.Group axis="y" values={items} onReorder={(v) => { setItems(v); setComprobado(false); }} className="mem-list" as="ol">
        {items.map((it, n) => {
          const ok = comprobado && it.id === n;
          const mal = comprobado && it.id !== n;
          return (
            <Reorder.Item key={it.id} value={it} className={`reorder-item${ok ? ' is-ok' : ''}${mal ? ' is-bad' : ''}`}>
              <span className="grip">
                <Icon name="grip" size={20} />
              </span>
              <span className="ord-n">{n + 1}</span>
              <span className="ord-txt">{it.texto}</span>
              <span className="ord-btns" onPointerDown={(e) => e.stopPropagation()}>
                <button className="icon-btn" onClick={() => mover(n, -1)} disabled={n === 0} aria-label={`Subir: ${it.texto}`}>
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" aria-hidden="true"><path d="M6 15l6-6 6 6" /></svg>
                </button>
                <button className="icon-btn" onClick={() => mover(n, 1)} disabled={n === items.length - 1} aria-label={`Bajar: ${it.texto}`}>
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" aria-hidden="true"><path d="M6 9l6 6 6-6" /></svg>
                </button>
              </span>
            </Reorder.Item>
          );
        })}
      </Reorder.Group>
      <p className="pl-fb" aria-live="polite">
        {comprobado && (todo ? 'Orden correcto.' : `${bien} de ${items.length} en su sitio. Mueve los marcados en rojo y vuelve a comprobar.`)}
      </p>
      <div className="pl-btns">
        {todo ? (
          <button type="button" className="btn arc" onClick={seguir} autoFocus>
            {k >= secciones.length - 1 ? 'Terminar' : 'Continuar con la parte siguiente'}
          </button>
        ) : (
          <button type="button" className="btn arc" onClick={() => setComprobado(true)}>
            Comprobar
          </button>
        )}
      </div>
    </div>
  );
}
