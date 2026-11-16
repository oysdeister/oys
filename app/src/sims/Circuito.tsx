import { useMemo, useState } from 'react';
import { AnimatePresence, motion, Reorder, useDragControls } from 'framer-motion';
import { Icon } from '../components/Icon';
import { Marco, MensajeVeredicto, azar, baraja, datosSim, elige, esObj, lista, num, pad, txt, useSim, useVeredicto, type Sim } from './kit';

interface Paso {
  id: string;
  nombre: string;
  codigo?: string;
  frase: string;
}
interface Ronda {
  titulo: string;
  texto: string;
  pasos: Paso[];
  distractor: string;
  /** Solo se enseñan los códigos (hay que leer el prefijo) */
  soloCodigo?: boolean;
}

function codDe(xs: unknown[], trozo: string, def: string) {
  const d = xs.find((x) => esObj(x) && txt(x.documento).toLowerCase().includes(trozo));
  return esObj(d) ? txt(d.codigo, def) || def : def;
}

const FRASES_COMPRAS = {
  oferta: 'Recoge el precio que ofrece el proveedor; se adjudica la línea',
  pedido: 'Encarga la mercancía al proveedor',
  albaran: 'Mete la mercancía en el almacén',
  factura: 'Sale con «Acciones › Generar factura» desde el albarán: lo que debes al proveedor',
  asiento: 'Al contabilizar, anota la compra, el IVA y la deuda (Debe = Haber)',
};
const FRASES_VENTAS = {
  oferta: 'Propones precio al cliente, con fecha de vigencia',
  pedido: 'El cliente confirma qué quiere y cuánto',
  albaran: 'La mercancía sale del almacén hacia el cliente',
  factura: 'Le cobras al cliente: nace el efecto a cobrar',
  asiento: 'Cliente (430) al Debe; IVA y ventas (700) al Haber',
};

function construirRondas(): Ronda[] {
  const dfC = lista(datosSim('compras').docflow);
  const dfV = lista(datosSim('ventas').docflow);
  // compras: la cadena completa del ejercicio 3
  const c3 = dfC.filter((x) => esObj(x) && num(x.ejercicio) === 3);
  const cc = (t: string, def: string) => codDe(c3.length ? c3 : dfC, t, def);
  const compras: Paso[] = [
    { id: 'oferta', nombre: 'Oferta', codigo: cc('oferta', '0OC000001'), frase: FRASES_COMPRAS.oferta },
    { id: 'pedido', nombre: 'Pedido', codigo: cc('pedido', '0PC000001'), frase: FRASES_COMPRAS.pedido },
    { id: 'albaran', nombre: 'Albarán', codigo: cc('albarán', '0AC000003'), frase: FRASES_COMPRAS.albaran },
    { id: 'factura', nombre: 'Factura', codigo: cc('factura', '0FC000002'), frase: FRASES_COMPRAS.factura },
    { id: 'asiento', nombre: 'Asiento', codigo: `Asiento ${cc('asiento', '2')} · diario DC`, frase: FRASES_COMPRAS.asiento },
  ];
  const vc = (t: string, def: string) => codDe(dfV, t, def);
  const ventas: Paso[] = [
    { id: 'oferta', nombre: 'Oferta', codigo: vc('oferta', '0OV000001'), frase: FRASES_VENTAS.oferta },
    { id: 'pedido', nombre: 'Pedido', codigo: vc('pedido', '0PV000002'), frase: FRASES_VENTAS.pedido },
    { id: 'albaran', nombre: 'Albarán', codigo: vc('albarán', '0AV000002'), frase: FRASES_VENTAS.albaran },
    { id: 'factura', nombre: 'Factura', codigo: vc('factura', '0FV000002'), frase: FRASES_VENTAS.factura },
    { id: 'asiento', nombre: 'Asiento', codigo: 'Asiento · diario DV', frase: FRASES_VENTAS.asiento },
  ];
  // cartera: estados del ciclo, en su orden
  const est = lista(datosSim('carteras').estados)
    .filter((e) => esObj(e) && e.ciclo === true)
    .sort((a, b) => num((a as Record<string, unknown>).orden) - num((b as Record<string, unknown>).orden)) as Record<string, unknown>[];
  const nombresCartera: Record<string, string> = { PE: 'Efecto', PR: 'Remesa', OC: 'Ordenar la remesa', CO: 'Cobro' };
  const cartera: Paso[] = est.length
    ? est.map((e) => ({ id: txt(e.codigo), nombre: nombresCartera[txt(e.codigo)] ?? txt(e.nombre), codigo: `${txt(e.codigo)} · ${txt(e.nombre)}`, frase: txt(e.descripcion) }))
    : [
        { id: 'PE', nombre: 'Efecto', codigo: 'PE · Pendiente', frase: 'Estado en el que nace el efecto al contabilizar la factura (liquidación pendiente).' },
        { id: 'PR', nombre: 'Remesa', codigo: 'PR · Propuesto', frase: 'Los efectos agregados a una remesa pasan a PR.' },
        { id: 'OC', nombre: 'Ordenar la remesa', codigo: 'OC · Ordenado', frase: 'Al ordenar la remesa («Remesa cobro transferencias, ordenar (s/Tes)»).' },
        { id: 'CO', nombre: 'Cobro', codigo: 'CO · Cobrado', frase: 'Al cerrar la gestión (COBD) o confirmar el cobro de la remesa; liquidado.' },
      ];
  // variación: solo códigos, números nuevos
  const esVenta = Math.random() < 0.5;
  const base = azar(3, 60);
  const L = esVenta ? 'V' : 'C';
  const fr = esVenta ? FRASES_VENTAS : FRASES_COMPRAS;
  const variacion: Paso[] = [
    { id: 'oferta', nombre: 'Oferta', codigo: `0O${L}${pad(base, 6)}`, frase: fr.oferta },
    { id: 'pedido', nombre: 'Pedido', codigo: `0P${L}${pad(base + azar(1, 4), 6)}`, frase: fr.pedido },
    { id: 'albaran', nombre: 'Albarán', codigo: `0A${L}${pad(base + azar(5, 12), 6)}`, frase: fr.albaran },
    { id: 'factura', nombre: 'Factura', codigo: `0F${L}${pad(base + azar(2, 9), 6)}`, frase: fr.factura },
  ];
  return [
    { titulo: 'Circuito de compras', texto: 'Ordena los documentos de compras del ejercicio 3, del primero al último.', pasos: compras, distractor: 'Agrega el efecto a una remesa de cobro' },
    { titulo: 'Circuito de ventas', texto: 'Ahora la cadena de ventas, de la oferta al asiento.', pasos: ventas, distractor: 'Mete la mercancía en el almacén' },
    { titulo: 'La vida de un efecto de cobro', texto: 'La factura de venta deja un efecto en la cartera. Ordena por qué estados pasa hasta cobrarse.', pasos: cartera, distractor: 'Devuelto: el banco no ha podido cobrarlo (DV)' },
    {
      titulo: `Variación: solo los códigos de ${esVenta ? 'ventas' : 'compras'}`,
      texto: 'Aquí no ves el tipo de documento, solo el número. Lee la letra que va detrás de la empresa 0 (O, P, A, F) y ordénalos.',
      pasos: variacion,
      distractor: elige(['Anota el cobro en el banco', 'Agrega el efecto a una remesa']),
      soloCodigo: true,
    },
  ];
}

/* ---------- Tarjeta que se arrastra ---------- */

function Tarjeta({
  p,
  i,
  n,
  mover,
  estado,
  soloCodigo,
}: {
  p: Paso;
  i: number;
  n: number;
  mover: (i: number, d: number) => void;
  estado: 'ok' | 'mal' | null;
  soloCodigo?: boolean;
}) {
  const ctrl = useDragControls();
  return (
    <Reorder.Item
      as="li"
      value={p.id}
      dragListener={false}
      dragControls={ctrl}
      className={`reorder-item tl-carta ${estado ?? ''}`}
      whileDrag={{ scale: 1.03, rotate: -1.5, boxShadow: '0 18px 40px -16px rgba(31,39,56,.45)' }}
    >
      <span className="tl-carta-grip grip" onPointerDown={(e) => ctrl.start(e)} aria-hidden="true">
        <Icon name="grip" />
      </span>
      <span className="tl-carta-n">{i + 1}</span>
      <span className="tl-carta-txt">
        {soloCodigo ? <b className="tl-mono">{p.codigo}</b> : <b>{p.nombre}</b>}
        {!soloCodigo && p.codigo && <small className="tl-mono">{p.codigo}</small>}
      </span>
      <span className="tl-carta-flechas">
        <button className="icon-btn" onClick={() => mover(i, -1)} disabled={i === 0} aria-label={`Subir ${soloCodigo ? p.codigo : p.nombre}`}>
          <span style={{ transform: 'rotate(-90deg)', display: 'grid' }}>
            <Icon name="flecha" size={18} />
          </span>
        </button>
        <button className="icon-btn" onClick={() => mover(i, 1)} disabled={i === n - 1} aria-label={`Bajar ${soloCodigo ? p.codigo : p.nombre}`}>
          <span style={{ transform: 'rotate(90deg)', display: 'grid' }}>
            <Icon name="flecha" size={18} />
          </span>
        </button>
      </span>
    </Reorder.Item>
  );
}

/* ---------- Una ronda: ordenar y luego conectar ---------- */

function RondaCircuito({ r, sim }: { r: Ronda; sim: Sim }) {
  const correcto = r.pasos.map((p) => p.id);
  const [orden, setOrden] = useState<string[]>(() => baraja(correcto));
  const [marcas, setMarcas] = useState<('ok' | 'mal' | null)[]>([]);
  const [fase, setFase] = useState<'ordenar' | 'conectar'>('ordenar');
  const [asig, setAsig] = useState<Record<string, string>>({});
  const [activo, setActivo] = useState<string>(correcto[0]);
  const [malAsig, setMalAsig] = useState<string[]>([]);
  const [v, decir] = useVeredicto();
  const frases = useMemo(() => baraja([...r.pasos.map((p) => p.frase), r.distractor]), [r]);
  const porId = (id: string) => r.pasos.find((p) => p.id === id)!;

  const mover = (i: number, d: number) => {
    setOrden((o) => {
      const j = i + d;
      if (j < 0 || j >= o.length) return o;
      const x = [...o];
      [x[i], x[j]] = [x[j], x[i]];
      return x;
    });
    setMarcas([]);
  };

  const comprobarOrden = () => {
    const m = orden.map((id, i) => (id === correcto[i] ? 'ok' : 'mal')) as ('ok' | 'mal')[];
    setMarcas(m);
    const malas = m.filter((x) => x === 'mal').length;
    if (!malas) {
      decir(true, 'Orden correcto. Ahora conecta cada paso con lo que hace.');
      setTimeout(() => {
        setFase('conectar');
        setActivo(correcto[0]);
      }, sim.reducido ? 0 : 700);
    } else decir(false, `${malas} ${malas === 1 ? 'tarjeta está' : 'tarjetas están'} fuera de sitio (en rojo). Piensa qué documento necesita al anterior para existir.`);
  };

  const ponFrase = (f: string) => {
    if (sim.resuelta) return;
    const nuevo = { ...Object.fromEntries(Object.entries(asig).filter(([, x]) => x !== f)), [activo]: f };
    setAsig(nuevo);
    setMalAsig([]);
    const sig = correcto.find((id) => !nuevo[id]);
    if (sig) setActivo(sig);
  };

  const comprobarFrases = () => {
    const faltan = correcto.filter((id) => !asig[id]);
    if (faltan.length) return decir(false, 'Aún hay pasos sin frase. Toca un paso y después la frase que le toca.');
    const malas = correcto.filter((id) => asig[id] !== porId(id).frase);
    setMalAsig(malas);
    if (malas.length) return decir(false, `${malas.length === 1 ? 'Una frase no encaja' : `${malas.length} frases no encajan`}. Toca el paso en rojo y cámbiala.`);
    decir(true, 'Circuito completo: sabes el orden y qué genera cada paso.');
    sim.acierto();
  };

  return (
    <div className="tl-circ">
      <AnimatePresence mode="wait">
        {fase === 'ordenar' ? (
          <motion.div key="ord" exit={{ opacity: 0, y: -10 }}>
            <p className="small muted">Arrastra desde el asa o usa las flechas.</p>
            <Reorder.Group as="ol" axis="y" values={orden} onReorder={(o) => (setOrden(o), setMarcas([]))} className="tl-cartas">
              {orden.map((id, i) => (
                <Tarjeta key={id} p={porId(id)} i={i} n={orden.length} mover={mover} estado={marcas[i] ?? null} soloCodigo={r.soloCodigo} />
              ))}
            </Reorder.Group>
            <div className="tl-acciones">
              <button className="btn arc" onClick={comprobarOrden}>
                Comprobar orden
              </button>
            </div>
          </motion.div>
        ) : (
          <motion.div key="con" initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }}>
            <ol className="tl-via">
              {correcto.map((id, i) => {
                const p = porId(id);
                const f = asig[id];
                return (
                  <motion.li
                    key={id}
                    className={`tl-via-paso ${activo === id ? 'activo' : ''} ${malAsig.includes(id) ? 'mal' : ''} ${sim.resuelta ? 'ok' : ''}`}
                    initial={sim.reducido ? false : { opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.07 }}
                  >
                    <span className="tl-via-nodo" aria-hidden="true">
                      {i + 1}
                    </span>
                    <button className="tl-via-btn" onClick={() => setActivo(id)} aria-pressed={activo === id}>
                      <b>{r.soloCodigo ? p.codigo : p.nombre}</b>
                      <span className={f ? 'tl-via-frase' : 'tl-via-hueco'}>{f ?? 'Toca aquí y elige qué hace'}</span>
                    </button>
                  </motion.li>
                );
              })}
            </ol>
            <div className="tl-frases" role="group" aria-label="Frases para conectar">
              {frases.map((f) => {
                const usada = Object.values(asig).includes(f);
                return (
                  <motion.button key={f} layout className={`tl-frase ${usada ? 'usada' : ''}`} onClick={() => ponFrase(f)} whileTap={{ scale: 0.96 }} disabled={sim.resuelta}>
                    {f}
                  </motion.button>
                );
              })}
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
          <p>{r.texto}</p>
        </>
      }
    >
      <RondaCircuito key={`${sim.partida}-${sim.ronda}`} r={r} sim={sim} />
    </Marco>
  );
}
