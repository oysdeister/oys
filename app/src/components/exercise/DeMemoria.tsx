import { useMemo, useRef, useState } from 'react';
import { AnimatePresence, Reorder, motion, useReducedMotion } from 'framer-motion';
import confetti from 'canvas-confetti';
import type { Ejercicio } from '../../types';
import { imgSrc } from '../../content';
import { conIni } from '../../lib/texto';
import { Icon } from '../Icon';
import { Anillo } from './Anillo';
import { Captura, CajaHotspot, Fallos, type Marca } from './Captura';
import { COLORES_MARCA, barajarDistinto, dentro, pasosPlanos, type PasoPlano } from './util';

const MAX_CLICS = 10;

/** Elige hasta n elementos repartidos a lo largo de la lista, manteniendo el orden */
function repartidos<T>(arr: T[], n: number) {
  if (arr.length <= n) return arr;
  return Array.from({ length: n }, (_, k) => arr[Math.round((k * (arr.length - 1)) / (n - 1))]);
}

export function DeMemoria({ ej, modulo, ini }: { ej: Ejercicio; modulo: string; ini: string }) {
  const [modo, setModo] = useState<'clic' | 'orden'>('clic');
  const conHotspot = useMemo(() => pasosPlanos(ej).filter((x) => x.paso.hotspot && x.paso.imagen), [ej]);
  const ordenables = useMemo(() => ej.secciones.map((s, i) => ({ s, i })).filter(({ s }) => s.pasos.length >= 4), [ej]);

  return (
    <div className="memoria">
      <div className="mem-intro">
        <h2>Sin ayudas</h2>
        <p className="muted">
          Lo que de verdad se aprende es lo que recuerdas sin mirar. Aquí no hay aro ámbar: solo la instrucción.
        </p>
      </div>
      <div className="seg" role="tablist" aria-label="Tipo de práctica">
        <button role="tab" aria-selected={modo === 'clic'} onClick={() => setModo('clic')}>
          ¿Dónde harías clic?
        </button>
        <button role="tab" aria-selected={modo === 'orden'} onClick={() => setModo('orden')}>
          Ordena los pasos
        </button>
      </div>
      {modo === 'clic' ? (
        conHotspot.length ? (
          <DondeClic pasos={conHotspot} modulo={modulo} ini={ini} />
        ) : (
          <p className="muted">Este ejercicio no tiene pantallas con clic marcado. Prueba a ordenar los pasos.</p>
        )
      ) : ordenables.length ? (
        <Ordenar ej={ej} secciones={ordenables} ini={ini} />
      ) : (
        <p className="muted">Este ejercicio no tiene secciones con pasos suficientes para ordenar.</p>
      )}
    </div>
  );
}

function DondeClic({ pasos, modulo, ini }: { pasos: PasoPlano[]; modulo: string; ini: string }) {
  const reducir = useReducedMotion();
  const [ronda, setRonda] = useState(0);
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

  const reiniciar = () => {
    setRonda((r) => r + 1);
    setI(0);
    setIntentos(0);
    setMarcas([]);
    setRes('nada');
    setAciertos(0);
    setFin(false);
  };

  const onPunto = (x: number, y: number) => {
    if (!h || res !== 'nada') return;
    if (dentro(h, x, y)) {
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
      const nota = aciertos / lista.length;
      if (nota >= 0.8 && !reducir) void confetti({ particleCount: 110, spread: 75, origin: { y: 0.6 }, colors: COLORES_MARCA, disableForReducedMotion: true });
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
      <motion.div key={`fin-${ronda}`} className="sheet pad mem-fin" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}>
        <Anillo valor={nota} etiqueta="a la primera" />
        <div>
          <h3>
            {aciertos} de {lista.length} a la primera
          </h3>
          <p className="muted">
            {nota >= 0.8
              ? 'Tienes las pantallas en la cabeza. En la demo real irás rápido.'
              : 'Repasa el recorrido guiado y vuelve a intentarlo: la segunda vez se queda.'}
          </p>
          <button className="btn arc" onClick={reiniciar}>
            Otra vez
          </button>
        </div>
      </motion.div>
    );
  }

  return (
    <div className="player mem-clic">
      <div>
        <p className="gd-caption">{t(actual.paso.texto)}</p>
        <AnimatePresence mode="wait" initial={false}>
          <motion.div key={`${ronda}-${i}`} initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.25 }}>
            <Captura src={imgSrc(modulo, actual.paso.imagen!)} alt="Captura del ERP: busca dónde harías clic" onPunto={onPunto} clicable={res === 'nada'}>
              {h && res === 'bien' && <CajaHotspot h={h} modo="acierto" />}
              {h && res === 'revelado' && <CajaHotspot h={h} modo="revelar" />}
              <Fallos marcas={marcas} />
            </Captura>
          </motion.div>
        </AnimatePresence>
      </div>
      <aside className="sheet pad step-card">
        <span className="step-count">
          {String(i + 1).padStart(2, '0')}
          <small>/{lista.length}</small>
        </span>
        <p className="small muted" style={{ marginTop: 6 }}>
          {t(actual.seccion.titulo)}
        </p>
        <p className="gd-texto">{t(actual.paso.texto)}</p>
        <div aria-live="polite">
          {res === 'nada' && intentos === 0 && <p className="small muted">Toca en la captura donde harías clic.</p>}
          {res === 'nada' && intentos === 1 && <p className="small gd-err">No es ahí. Tienes otro intento.</p>}
          {res === 'bien' && (
            <motion.p className="mem-ok" initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}>
              {intentos === 0 ? '¡A la primera!' : 'Bien, ahora sí.'}
            </motion.p>
          )}
          {res === 'revelado' && h && (
            <p className="small">
              Era aquí: <b>«{h.etiqueta}»</b>. Fíjate y sigue.
            </p>
          )}
        </div>
        <div className="mem-score">
          <span>
            <b>{aciertos}</b> a la primera
          </span>
        </div>
        {res !== 'nada' && (
          <button className="btn arc" onClick={siguiente} autoFocus>
            {i >= lista.length - 1 ? 'Ver resultado' : 'Siguiente'}
          </button>
        )}
      </aside>
    </div>
  );
}

interface Item {
  id: number;
  texto: string;
}

function Ordenar({ ej, secciones, ini }: { ej: Ejercicio; secciones: { s: Ejercicio['secciones'][number]; i: number }[]; ini: string }) {
  const reducir = useReducedMotion();
  const [sel, setSel] = useState(secciones[0].i);
  const sec = ej.secciones[sel];
  const correctos = useMemo<Item[]>(() => sec.pasos.slice(0, 7).map((p, id) => ({ id, texto: conIni(p.texto, ini) })), [sec, ini]);
  const [items, setItems] = useState<Item[]>(() => barajarDistinto(correctos));
  const [comprobado, setComprobado] = useState(false);
  const [clave, setClave] = useState(sel);

  // Cambio de sección: baraja de nuevo
  if (clave !== sel) {
    setClave(sel);
    setItems(barajarDistinto(correctos));
    setComprobado(false);
  }

  const bien = items.filter((it, k) => it.id === k).length;
  const todo = comprobado && bien === items.length;

  const mover = (k: number, d: number) => {
    const n = k + d;
    if (n < 0 || n >= items.length) return;
    const a = [...items];
    [a[k], a[n]] = [a[n], a[k]];
    setItems(a);
    setComprobado(false);
  };

  const comprobar = () => {
    setComprobado(true);
    if (bien === items.length && !reducir) void confetti({ particleCount: 90, spread: 70, origin: { y: 0.65 }, colors: COLORES_MARCA, disableForReducedMotion: true });
  };

  return (
    <div className="mem-orden">
      {secciones.length > 1 && (
        <div className="mem-secs" role="group" aria-label="Elige la parte">
          {secciones.map(({ s, i }) => (
            <button key={s.id} className={`chip${i === sel ? ' ok' : ''}`} onClick={() => setSel(i)} aria-pressed={i === sel}>
              {conIni(s.titulo, ini)}
            </button>
          ))}
        </div>
      )}
      <p className="muted">
        Pon en orden los pasos de <b>{conIni(sec.titulo, ini)}</b>. Arrastra cada tarjeta o usa las flechas.
      </p>
      <Reorder.Group axis="y" values={items} onReorder={(v) => { setItems(v); setComprobado(false); }} className="mem-list" as="ol">
        {items.map((it, k) => {
          const ok = comprobado && it.id === k;
          const mal = comprobado && it.id !== k;
          return (
            <Reorder.Item key={it.id} value={it} className={`reorder-item${ok ? ' is-ok' : ''}${mal ? ' is-bad' : ''}`} whileDrag={{ scale: 1.03, boxShadow: '0 18px 40px -16px rgba(31,39,56,.45)' }}>
              <span className="grip">
                <Icon name="grip" size={20} />
              </span>
              <span className="ord-n">{k + 1}</span>
              <span className="ord-txt">{it.texto}</span>
              <span className="ord-btns" onPointerDown={(e) => e.stopPropagation()}>
                <button className="icon-btn" onClick={() => mover(k, -1)} disabled={k === 0} aria-label={`Subir: ${it.texto}`}>
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" aria-hidden="true"><path d="M6 15l6-6 6 6" /></svg>
                </button>
                <button className="icon-btn" onClick={() => mover(k, 1)} disabled={k === items.length - 1} aria-label={`Bajar: ${it.texto}`}>
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" aria-hidden="true"><path d="M6 9l6 6 6-6" /></svg>
                </button>
              </span>
            </Reorder.Item>
          );
        })}
      </Reorder.Group>
      <div className="row-btns" aria-live="polite">
        <button className="btn arc" onClick={comprobar}>
          Comprobar
        </button>
        <button className="btn ghost" onClick={() => { setItems(barajarDistinto(correctos)); setComprobado(false); }}>
          Barajar otra vez
        </button>
        {comprobado && (
          <motion.span className={todo ? 'mem-ok' : 'small'} initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }}>
            {todo ? '¡Orden perfecto!' : `${bien} de ${items.length} en su sitio. Los rojos aún no.`}
          </motion.span>
        )}
      </div>
    </div>
  );
}
