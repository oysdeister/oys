import { useEffect, useMemo, useState } from 'react';
import { AnimatePresence, motion, Reorder, useDragControls } from 'framer-motion';
import { Icon } from '../components/Icon';
import { Marco, MensajeVeredicto, azar, baraja, datosSim, elige, esObj, lista, num, pad, txt, useSim, useVeredicto, type Sim } from './kit';
import './taller-b.css';

interface Paso {
  id: string;
  nombre: string;
  /** Con artículo, en minúscula: «el albarán» */
  art: string;
  codigo?: string;
  frase: string;
  /** Por qué va donde va: qué necesita del paso anterior */
  razon: string;
}
interface Ronda {
  titulo: string;
  objetivo: string;
  pasos: Paso[];
  distractor: string;
  /** Solo se enseñan los códigos (hay que leer el prefijo) */
  soloCodigo?: boolean;
  /** Lo que se explica al acertar el orden */
  regla?: string;
}

function codDe(xs: unknown[], trozo: string, def: string) {
  const d = xs.find((x) => esObj(x) && txt(x.documento).toLowerCase().includes(trozo));
  return esObj(d) ? txt(d.codigo, def) || def : def;
}

type Clave = 'oferta' | 'pedido' | 'albaran' | 'factura' | 'asiento';
type Juego = Record<Clave, { frase: string; razon: string }>;

const ART: Record<Clave, string> = { oferta: 'la oferta', pedido: 'el pedido', albaran: 'el albarán', factura: 'la factura', asiento: 'el asiento' };
const NOMBRE: Record<Clave, string> = { oferta: 'Oferta', pedido: 'Pedido', albaran: 'Albarán', factura: 'Factura', asiento: 'Asiento' };

const COMPRAS: Juego = {
  oferta: { frase: 'Recoge el precio que ofrece el proveedor; se adjudica la línea', razon: 'La oferta va primero: antes de encargar, el proveedor te da precio.' },
  pedido: { frase: 'Encarga la mercancía al proveedor', razon: 'El pedido nace de la oferta adjudicada: encargas al precio que te ofrecieron.' },
  albaran: { frase: 'Mete la mercancía en el almacén', razon: 'El albarán recibe lo que el pedido encargó.' },
  factura: { frase: 'Sale con «Acciones › Generar factura» desde el albarán: lo que debes al proveedor', razon: 'La factura sale del albarán con «Acciones › Generar factura».' },
  asiento: { frase: 'Al contabilizar: compras 60000 e IVA 47200 al Debe; proveedor 40000 al Haber', razon: 'El asiento nace al contabilizar la factura.' },
};
const VENTAS: Juego = {
  oferta: { frase: 'Propones precio al cliente, con fecha de vigencia', razon: 'La oferta va primero: propones precio antes de que el cliente confirme.' },
  pedido: { frase: 'El cliente confirma qué quiere y cuánto', razon: 'El pedido nace cuando el cliente acepta la oferta.' },
  albaran: { frase: 'La mercancía sale del almacén hacia el cliente', razon: 'El albarán sirve lo que el pedido confirmó.' },
  factura: { frase: 'Le cobras al cliente: nace el efecto a cobrar', razon: 'La factura se genera desde el albarán: cobras lo que ya has servido.' },
  asiento: { frase: 'Cliente 43000 al Debe; IVA 47000 y ventas 70000 al Haber', razon: 'El asiento nace al contabilizar la factura.' },
};

const paso = (k: Clave, j: Juego, codigo?: string): Paso => ({ id: k, nombre: NOMBRE[k], art: ART[k], codigo, frase: j[k].frase, razon: j[k].razon });

const CARTERA_EXTRA: Record<string, { nombre: string; art: string; razon: string }> = {
  PE: { nombre: 'Efecto', art: 'el efecto', razon: 'El efecto nace pendiente (PE) al contabilizar la factura: es lo primero.' },
  PR: { nombre: 'Remesa', art: 'la remesa', razon: 'Solo puedes meter en una remesa un efecto que ya existe.' },
  OC: { nombre: 'Ordenar la remesa', art: 'ordenar la remesa', razon: 'Para ordenar la remesa, antes tiene que llevar efectos propuestos (PR).' },
  CO: { nombre: 'Cobro', art: 'el cobro', razon: 'El cobro se confirma cuando la remesa ya está ordenada (OC).' },
};

function construirRondas(): Ronda[] {
  const dfC = lista(datosSim('compras').docflow);
  const dfV = lista(datosSim('ventas').docflow);
  // compras: la cadena completa del ejercicio 3
  const c3 = dfC.filter((x) => esObj(x) && num(x.ejercicio) === 3);
  const cc = (t: string, def: string) => codDe(c3.length ? c3 : dfC, t, def);
  const compras: Paso[] = [
    paso('oferta', COMPRAS, cc('oferta', '0OC000001')),
    paso('pedido', COMPRAS, cc('pedido', '0PC000001')),
    paso('albaran', COMPRAS, cc('albarán', '0AC000003')),
    paso('factura', COMPRAS, cc('factura', '0FC000002')),
    paso('asiento', COMPRAS, `Asiento ${cc('asiento', '2')} · diario DC`),
  ];
  const vc = (t: string, def: string) => codDe(dfV, t, def);
  const ventas: Paso[] = [
    paso('oferta', VENTAS, vc('oferta', '0OV000001')),
    paso('pedido', VENTAS, vc('pedido', '0PV000002')),
    paso('albaran', VENTAS, vc('albarán', '0AV000002')),
    paso('factura', VENTAS, vc('factura', '0FV000002')),
    paso('asiento', VENTAS, 'Asiento · diario DV'),
  ];
  // cartera: estados del ciclo, en su orden
  const est = lista(datosSim('carteras').estados)
    .filter((e) => esObj(e) && e.ciclo === true)
    .sort((a, b) => num((a as Record<string, unknown>).orden) - num((b as Record<string, unknown>).orden)) as Record<string, unknown>[];
  const base4 = est.length
    ? est.map((e) => ({ codigo: txt(e.codigo), nombre: txt(e.nombre), descripcion: txt(e.descripcion) }))
    : [
        { codigo: 'PE', nombre: 'Pendiente', descripcion: 'Estado en el que nace el efecto al contabilizar la factura (liquidación pendiente).' },
        { codigo: 'PR', nombre: 'Propuesto', descripcion: 'Los efectos agregados a una remesa pasan a PR.' },
        { codigo: 'OC', nombre: 'Ordenado', descripcion: 'Al ordenar la remesa («Remesa cobro transferencias, ordenar (s/Tes)»).' },
        { codigo: 'CO', nombre: 'Cobrado', descripcion: 'Al cerrar la gestión (COBD) o confirmar el cobro de la remesa; liquidado.' },
      ];
  const cartera: Paso[] = base4.map((e) => {
    const x = CARTERA_EXTRA[e.codigo];
    return {
      id: e.codigo,
      nombre: x?.nombre ?? e.nombre,
      art: x?.art ?? e.nombre.toLowerCase(),
      codigo: `${e.codigo} · ${e.nombre}`,
      frase: e.descripcion,
      razon: x?.razon ?? '',
    };
  });
  // variación: solo códigos, números nuevos
  const esVenta = Math.random() < 0.5;
  const base = azar(3, 60);
  const L = esVenta ? 'V' : 'C';
  const fr = esVenta ? VENTAS : COMPRAS;
  const variacion: Paso[] = [
    paso('oferta', fr, `0O${L}${pad(base, 6)}`),
    paso('pedido', fr, `0P${L}${pad(base + azar(1, 4), 6)}`),
    paso('albaran', fr, `0A${L}${pad(base + azar(5, 12), 6)}`),
    paso('factura', fr, `0F${L}${pad(base + azar(2, 9), 6)}`),
  ];
  return [
    { titulo: 'Circuito de compras', objetivo: 'Coloca los documentos del ejercicio 3 en la vía, del primero al último.', pasos: compras, distractor: 'Agrega el efecto a una remesa de cobro' },
    { titulo: 'Circuito de ventas', objetivo: 'Ahora la cadena de ventas, de la oferta al asiento.', pasos: ventas, distractor: 'Mete la mercancía en el almacén' },
    { titulo: 'La vida de un efecto de cobro', objetivo: 'Ordena los estados del efecto, desde que nace hasta que se cobra.', pasos: cartera, distractor: 'Devuelto: el banco no ha podido cobrarlo (DV)' },
    {
      titulo: `Variación: solo los códigos de ${esVenta ? 'ventas' : 'compras'}`,
      objetivo: 'Solo ves el número. Lee la letra que va tras el 0 y ordénalos.',
      pasos: variacion,
      distractor: elige(['Anota el cobro en el banco', 'Agrega el efecto a una remesa']),
      soloCodigo: true,
      regla: `Así se lee: 0 es la empresa; luego la letra del documento (O oferta, P pedido, A albarán, F factura); después ${L} de ${esVenta ? 'venta' : 'compra'} (C compra, V venta) y un contador de 6 cifras. Es la máscara #e#s#6n del numerador.`,
    },
  ];
}

/* ---------- Geometría de la vía (el arco O&S) ---------- */

type Pt = { x: number; y: number };
const ITEM = 72; // alto de una estación en móvil (62 + 10 de hueco)

function geometria(n: number, vertical: boolean) {
  if (!vertical) {
    const W = 100 * n;
    const H = 78;
    const base = 70;
    const cx = W / 2;
    const rx = W / 2;
    const ry = 58;
    const en = (x: number): Pt => ({ x, y: base - ry * Math.sqrt(Math.max(0, 1 - ((x - cx) / rx) ** 2)) });
    const est = Array.from({ length: n }, (_, i) => en(100 * i + 50));
    const tramo = (k: number) => Array.from({ length: 13 }, (_, s) => en(est[k].x + ((est[k + 1].x - est[k].x) * s) / 12));
    const fondo = Array.from({ length: 101 }, (_, s) => en(2 + ((W - 4) * s) / 100));
    return { W, H, est, tramo, fondo };
  }
  const H = n * ITEM - 10;
  const W = 46;
  const cy = H / 2;
  const ry = H / 2 + 6;
  const en = (y: number): Pt => ({ x: 38 - 24 * Math.sqrt(Math.max(0, 1 - ((y - cy) / ry) ** 2)), y });
  const est = Array.from({ length: n }, (_, i) => en(31 + ITEM * i));
  const tramo = (k: number) => Array.from({ length: 13 }, (_, s) => en(est[k].y + ((est[k + 1].y - est[k].y) * s) / 12));
  const fondo = Array.from({ length: 61 }, (_, s) => en(2 + ((H - 4) * s) / 60));
  return { W, H, est, tramo, fondo };
}
const d = (ps: Pt[]) => ps.map((p, i) => `${i ? 'L' : 'M'}${p.x.toFixed(1)} ${p.y.toFixed(1)}`).join(' ');

function useEstrecho(q = '(max-width: 720px)') {
  const [m, setM] = useState(() => typeof window !== 'undefined' && !!window.matchMedia?.(q).matches);
  useEffect(() => {
    const mq = window.matchMedia?.(q);
    if (!mq) return;
    const f = () => setM(mq.matches);
    f();
    mq.addEventListener('change', f);
    return () => mq.removeEventListener('change', f);
  }, [q]);
  return m;
}

/** Resultado de comprobar: hasta qué estación se enciende la vía */
type Prueba = { n: number; buenas: number; total: number };

function Via({ n, vertical, prueba, reducido }: { n: number; vertical: boolean; prueba: Prueba | null; reducido: boolean }) {
  const g = useMemo(() => geometria(n, vertical), [n, vertical]);
  const SEG = 0.34;
  // tramos encendidos: entre estaciones correctas; si falla la k, el tramo k-1→k se pinta en rojo
  const buenas = prueba?.buenas ?? 0;
  const todoBien = !!prueba && buenas === n;
  const destino = prueba ? Math.min(buenas, n - 1) : 0;
  const viaje: Pt[] = [g.est[0]];
  for (let k = 0; k < destino; k++) viaje.push(...g.tramo(k).slice(1));
  return (
    <svg
      className={`tlb-via-svg ${vertical ? 'vert' : ''}`}
      viewBox={`0 0 ${g.W} ${g.H}`}
      style={vertical ? { width: g.W, height: g.H } : undefined}
      aria-hidden="true"
    >
      <path d={d(g.fondo)} className="tlb-via-fondo" />
      <path d={d(g.fondo)} className="tlb-via-traviesas" />
      {prueba &&
        Array.from({ length: n - 1 }, (_, k) => {
          // k une la estación k con la k+1
          const luz = k + 1 < buenas;
          const mal = !todoBien && k + 1 === buenas;
          if (!luz && !mal) return null;
          return (
            <motion.path
              key={`${prueba.n}-${k}`}
              d={d(g.tramo(k))}
              className={`tlb-via-luz ${mal ? 'mal' : ''}`}
              initial={reducido ? false : { pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{ duration: SEG, delay: k * SEG, ease: 'linear' }}
            />
          );
        })}
      {g.est.map((p, i) => {
        const estado = !prueba ? '' : i < buenas ? 'ok' : i === buenas ? 'mal' : '';
        return (
          <g key={i}>
            <motion.circle
              key={`${prueba?.n ?? 0}-${i}`}
              cx={p.x}
              cy={p.y}
              r={vertical ? 9 : 11}
              className={`tlb-est ${estado}`}
              initial={false}
              animate={estado && !reducido ? { scale: [1, 1.35, 1] } : { scale: 1 }}
              transition={{ delay: (estado === 'mal' ? buenas : i) * SEG + 0.05, duration: 0.35 }}
              style={{ transformBox: 'fill-box', transformOrigin: 'center' }}
            />
            <text x={p.x} y={p.y + 4} className="tlb-est-n" textAnchor="middle">
              {i + 1}
            </text>
          </g>
        );
      })}
      {prueba && (
        <motion.g
          key={`doc-${prueba.n}`}
          initial={reducido ? false : { x: g.est[0].x, y: g.est[0].y, opacity: 0 }}
          animate={
            reducido
              ? { x: viaje[viaje.length - 1].x, y: viaje[viaje.length - 1].y, opacity: 1 }
              : { x: viaje.map((p) => p.x), y: viaje.map((p) => p.y), opacity: 1 }
          }
          transition={{ duration: Math.max(0.2, destino * SEG), ease: 'linear', opacity: { duration: 0.15 } }}
        >
          <g transform={vertical ? 'translate(-9 -30)' : 'translate(-10 -40)'} className={`tlb-doc ${todoBien ? 'ok' : 'mal'}`}>
            <path d="M0 0h13l7 7v19H0z" />
            <path d="M13 0v7h7" className="tlb-doc-pliegue" />
            <path d="M4 12h12M4 16h12M4 20h8" className="tlb-doc-lineas" />
          </g>
        </motion.g>
      )}
    </svg>
  );
}

/* ---------- Billete que se arrastra ---------- */

function Billete({
  p,
  i,
  n,
  mover,
  estado,
  soloCodigo,
  vertical,
}: {
  p: Paso;
  i: number;
  n: number;
  mover: (i: number, d: number) => void;
  estado: 'ok' | 'mal' | null;
  soloCodigo?: boolean;
  vertical: boolean;
}) {
  const ctrl = useDragControls();
  const etiqueta = soloCodigo ? p.codigo : p.nombre;
  const atras = vertical ? 'Subir' : 'Mover a la izquierda';
  const alante = vertical ? 'Bajar' : 'Mover a la derecha';
  return (
    <Reorder.Item
      as="li"
      value={p.id}
      dragListener={false}
      dragControls={ctrl}
      className={`tlb-billete ${estado ?? ''}`}
      whileDrag={{ scale: 1.05, rotate: vertical ? -1 : -3, zIndex: 5, boxShadow: '0 22px 40px -18px rgba(31,39,56,.55)' }}
    >
      <span className="tlb-billete-asa" onPointerDown={(e) => ctrl.start(e)} title="Arrastra para mover" aria-hidden="true">
        <Icon name="grip" size={18} />
      </span>
      <span className="tlb-billete-txt">
        {soloCodigo ? <b className="tl-mono">{p.codigo}</b> : <b>{p.nombre}</b>}
        {!soloCodigo && p.codigo && <small className="tl-mono">{p.codigo}</small>}
      </span>
      <span className="tlb-billete-flechas">
        <button type="button" className="tlb-flecha" onClick={() => mover(i, -1)} disabled={i === 0} aria-label={`${atras}: ${etiqueta}`}>
          <span style={{ transform: vertical ? 'rotate(-90deg)' : 'rotate(180deg)' }}>
            <Icon name="flecha" size={18} />
          </span>
        </button>
        <button type="button" className="tlb-flecha" onClick={() => mover(i, 1)} disabled={i === n - 1} aria-label={`${alante}: ${etiqueta}`}>
          <span style={{ transform: vertical ? 'rotate(90deg)' : 'none' }}>
            <Icon name="flecha" size={18} />
          </span>
        </button>
      </span>
    </Reorder.Item>
  );
}

const may = (s: string) => s.charAt(0).toUpperCase() + s.slice(1);
const al = (art: string) => (art.startsWith('el ') ? `al ${art.slice(3)}` : `a ${art}`);
const letra = (p: Paso) => (p.codigo ?? '').charAt(1);

/* ---------- Una ronda: ordenar y luego conectar ---------- */

function RondaCircuito({ r, sim }: { r: Ronda; sim: Sim }) {
  const vertical = useEstrecho();
  const correcto = r.pasos.map((p) => p.id);
  const n = correcto.length;
  const [orden, setOrden] = useState<string[]>(() => baraja(correcto));
  const [prueba, setPrueba] = useState<Prueba | null>(null);
  const [fase, setFase] = useState<'ordenar' | 'conectar'>('ordenar');
  const [asig, setAsig] = useState<Record<string, string>>({});
  const [activo, setActivo] = useState<string>(correcto[0]);
  const [malAsig, setMalAsig] = useState<string[]>([]);
  const [v, decir, callar] = useVeredicto();
  const frases = useMemo(() => baraja([...r.pasos.map((p) => p.frase), r.distractor]), [r]);
  const porId = (id: string) => r.pasos.find((p) => p.id === id)!;
  const nombreDe = (p: Paso) => (r.soloCodigo ? p.codigo ?? p.nombre : p.nombre);

  const cambia = (o: string[]) => {
    setOrden(o);
    setPrueba(null);
    callar();
  };
  const mover = (i: number, dd: number) => {
    const j = i + dd;
    if (j < 0 || j >= orden.length) return;
    const x = [...orden];
    [x[i], x[j]] = [x[j], x[i]];
    cambia(x);
  };

  const comprobarOrden = () => {
    const k = orden.findIndex((id, i) => id !== correcto[i]);
    const buenas = k === -1 ? n : k;
    setPrueba((p) => ({ n: (p?.n ?? 0) + 1, buenas, total: n }));
    if (k === -1) {
      decir(
        true,
        r.regla ? (
          <>
            <b>Orden correcto.</b> {r.regla}
          </>
        ) : (
          'Orden correcto: la vía se enciende entera. Ahora di qué hace cada paso.'
        ),
      );
      setTimeout(
        () => {
          setFase('conectar');
          setActivo(correcto[0]);
        },
        sim.reducido ? 300 : r.regla ? 3800 : n * 340 + 1100,
      );
      return;
    }
    const P = porId(orden[k]);
    const E = porId(correcto[k]);
    if (r.soloCodigo)
      decir(
        false,
        <>
          <span className="tl-mono">{P.codigo}</span> no va en la estación {k + 1}. Mira la letra tras el 0: «{letra(P)}» es {P.art}, y ahí toca{' '}
          {E.art} («{letra(E)}»). {P.razon}
        </>,
      );
    else decir(false, `${may(P.art)} no puede ir en la estación ${k + 1}: ahí va ${E.art}. ${P.razon}`);
  };

  const ponFrase = (f: string) => {
    if (sim.resuelta) return;
    const nuevo = { ...Object.fromEntries(Object.entries(asig).filter(([, x]) => x !== f)), [activo]: f };
    setAsig(nuevo);
    setMalAsig([]);
    callar();
    const sig = correcto.find((id) => !nuevo[id]);
    if (sig) setActivo(sig);
  };

  const comprobarFrases = () => {
    const faltan = correcto.filter((id) => !asig[id]);
    if (faltan.length) {
      setActivo(faltan[0]);
      return decir(false, `Te falta la frase de ${porId(faltan[0]).art}. Está marcado: toca la frase que le toca.`);
    }
    const malas = correcto.filter((id) => asig[id] !== porId(id).frase);
    setMalAsig(malas);
    if (malas.length) {
      const w = porId(malas[0]);
      const f = asig[w.id];
      const dueño = r.pasos.find((p) => p.frase === f);
      setActivo(w.id);
      return decir(
        false,
        <>
          {may(al(w.art))} le has puesto «{f}». {dueño ? <>Eso lo hace {dueño.art}.</> : <>Esa frase sobra: no es de este circuito.</>} Busca la que dice qué hace {w.art}.
          {malas.length > 1 && <> Hay {malas.length - 1} más en rojo.</>}
        </>,
      );
    }
    decir(true, 'Circuito completo: sabes el orden y qué hace cada paso.');
    sim.acierto();
  };

  return (
    <div className="tlb-circ">
      <AnimatePresence mode="wait">
        {fase === 'ordenar' ? (
          <motion.div key="ord" exit={sim.reducido ? { opacity: 0 } : { opacity: 0, rotateX: 20, y: -16 }} transition={{ duration: 0.3 }}>
            <p className="tlb-ayuda">
              <Icon name="grip" size={16} /> Arrastra por el asa o usa las flechas.
            </p>
            <div className={`tlb-escena ${vertical ? 'vert' : ''}`}>
              <div className="tlb-anden">
                {!vertical && <Via n={n} vertical={false} prueba={prueba} reducido={sim.reducido} />}
                <div className="tlb-raiz">
                  {vertical && <Via n={n} vertical prueba={prueba} reducido={sim.reducido} />}
                  <Reorder.Group as="ol" axis={vertical ? 'y' : 'x'} values={orden} onReorder={cambia} className="tlb-billetes" style={{ ['--n' as string]: n }}>
                    {orden.map((id, i) => (
                      <Billete
                        key={id}
                        p={porId(id)}
                        i={i}
                        n={n}
                        mover={mover}
                        estado={!prueba ? null : i < prueba.buenas ? 'ok' : i === prueba.buenas ? 'mal' : null}
                        soloCodigo={r.soloCodigo}
                        vertical={vertical}
                      />
                    ))}
                  </Reorder.Group>
                </div>
              </div>
            </div>
            <div className="tl-acciones">
              <button className="btn arc" onClick={comprobarOrden} disabled={prueba?.buenas === n}>
                Comprobar orden
              </button>
            </div>
          </motion.div>
        ) : (
          <motion.div key="con" initial={sim.reducido ? { opacity: 0 } : { opacity: 0, rotateX: -16, y: 18 }} animate={{ opacity: 1, rotateX: 0, y: 0 }} transition={{ duration: 0.4 }}>
            <p className="tlb-ayuda">Toca un paso de la vía y después la frase que dice qué hace. Una frase sobra.</p>
            <div className="tlb-conectar">
              <ol className={`tlb-paradas ${sim.resuelta ? 'encendida' : ''}`}>
                {correcto.map((id, i) => {
                  const p = porId(id);
                  const f = asig[id];
                  const mal = malAsig.includes(id);
                  return (
                    <motion.li
                      key={id}
                      className={`tlb-parada ${activo === id && !sim.resuelta ? 'activo' : ''} ${mal ? 'mal' : ''} ${sim.resuelta ? 'ok' : ''}`}
                      initial={sim.reducido ? false : { opacity: 0, x: -18 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: sim.resuelta ? 0 : i * 0.06 }}
                    >
                      <motion.span
                        className="tlb-parada-nodo"
                        aria-hidden="true"
                        animate={sim.resuelta && !sim.reducido ? { scale: [1, 1.3, 1] } : { scale: 1 }}
                        transition={{ delay: i * 0.18, duration: 0.4 }}
                      >
                        {sim.resuelta ? <Icon name="check" size={18} stroke={3} /> : i + 1}
                      </motion.span>
                      <button type="button" className="tlb-parada-btn" onClick={() => setActivo(id)} aria-pressed={activo === id} disabled={sim.resuelta}>
                        <b>
                          {nombreDe(p)}
                          {r.soloCodigo && <small> · {p.nombre}</small>}
                        </b>
                        <span className={f ? 'tlb-parada-frase' : 'tlb-parada-hueco'}>{f ?? (activo === id ? 'Ahora elige su frase' : 'Toca aquí y elige qué hace')}</span>
                      </button>
                    </motion.li>
                  );
                })}
              </ol>
              <div className="tlb-frases" role="group" aria-label={`Frases. Eligiendo para: ${nombreDe(porId(activo))}`}>
                {!sim.resuelta && (
                  <p className="tlb-frases-tit">
                    Para <b>{nombreDe(porId(activo))}</b>:
                  </p>
                )}
                {frases.map((f) => {
                  const usada = Object.values(asig).includes(f);
                  return (
                    <motion.button
                      type="button"
                      key={f}
                      layout={!sim.reducido}
                      className={`tlb-frase ${usada ? 'usada' : ''} ${asig[activo] === f ? 'suya' : ''}`}
                      onClick={() => ponFrase(f)}
                      whileTap={sim.reducido ? undefined : { scale: 0.96 }}
                      disabled={sim.resuelta}
                    >
                      {f}
                    </motion.button>
                  );
                })}
              </div>
            </div>
            <div className="tl-acciones">
              <button className="btn arc" onClick={comprobarFrases} disabled={sim.resuelta}>
                Comprobar conexiones
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      <MensajeVeredicto v={v} />
    </div>
  );
}

export default function SimCircuito() {
  const sim = useSim('circuito', 4);
  const rondas = useMemo(() => construirRondas(), [sim.partida]); // eslint-disable-line react-hooks/exhaustive-deps
  const r = rondas[sim.ronda] ?? rondas[0];
  return (
    <Marco
      sim={sim}
      titulo="Ordena el circuito"
      color="#f2a93b"
      concepto={
        <>
          <p>
            Un circuito es la cadena de documentos de una operación. Cada documento nace del anterior: la oferta se convierte en pedido, el pedido en albarán, el albarán en factura, y al
            contabilizar la factura sale el asiento.
          </p>
          <p>Después, la factura deja un efecto en la cartera, que va cambiando de estado hasta que se cobra o se paga.</p>
        </>
      }
      enunciado={
        <>
          <h3>{r.titulo}</h3>
          <p className="tlb-objetivo">{r.objetivo}</p>
        </>
      }
    >
      <RondaCircuito key={`${sim.partida}-${sim.ronda}`} r={r} sim={sim} />
    </Marco>
  );
}
