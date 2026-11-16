import { useMemo, useState } from 'react';
import { AnimatePresence, motion, useAnimate } from 'framer-motion';
import { Icon } from '../components/Icon';
import { conIni } from '../lib/texto';
import './taller-b.css';
import { Marco, MensajeVeredicto, azar, datosSim, esObj, f2, lista, num, pad, txt, useIni, useSim, useVeredicto, type Sim } from './kit';

interface Estado {
  codigo: string;
  nombre: string;
  descripcion: string;
}
interface Evento {
  texto: string;
  estado: string;
  porQue: string;
}
interface Ronda {
  titulo: string;
  efecto: { documento: string; clase: string; tercero: string; tipo: string; importe: number; vencimiento: string };
  eventos: Evento[];
}

const COLOR: Record<string, string> = { PE: '#f2a93b', PR: '#6c8fd6', OC: '#8a7be0', CO: '#2a9c83', PA: '#2a9c83', DV: '#d9534a' };

function estados(): Estado[] {
  const xs = lista(datosSim('carteras').estados).filter(esObj);
  const r = xs.map((e) => ({ codigo: txt(e.codigo), nombre: txt(e.nombre), descripcion: txt(e.descripcion) })).filter((e) => e.codigo);
  return r.length
    ? r
    : [
        { codigo: 'PE', nombre: 'Pendiente', descripcion: 'Nace al contabilizar la factura.' },
        { codigo: 'PR', nombre: 'Propuesto', descripcion: 'Agregado a una remesa.' },
        { codigo: 'OC', nombre: 'Ordenado', descripcion: 'Remesa ordenada.' },
        { codigo: 'CO', nombre: 'Cobrado', descripcion: 'Cobro confirmado.' },
        { codigo: 'PA', nombre: 'Pagado', descripcion: 'Liquidado en la cartera de pagos.' },
        { codigo: 'DV', nombre: 'Devuelto', descripcion: 'Impagado.' },
      ];
}

function construirRondas(ini: string): Ronda[] {
  const efs = lista(datosSim('carteras').efectos).filter(esObj);
  const ef = (doc: string, orden: number, def: Ronda['efecto']): Ronda['efecto'] => {
    const e = efs.find((x) => txt(x.documento) === doc && num(x.orden) === orden);
    if (!e) return { ...def, tercero: conIni(def.tercero, ini) };
    return {
      documento: conIni(txt(e.documento), ini),
      clase: txt(e.clase),
      tercero: conIni(txt(e.tercero), ini),
      tipo: conIni(txt(e.tipoEfecto), ini),
      importe: num(e.importe),
      vencimiento: txt(e.vencimiento),
    };
  };
  const e2 = ef('FVN026-000002', 1, { documento: 'FVN026-000002', clase: 'Cobrar', tercero: 'T{INI} Tercero Carteras', tipo: 'RC', importe: 121, vencimiento: '14-12-2026' });
  const e1 = ef('FVN026-000001', 1, { documento: 'FVN026-000001', clase: 'Cobrar', tercero: 'T{INI} Tercero Carteras', tipo: 'RC', importe: 242, vencimiento: '14-12-2026' });
  const ep = ef('PROV-{INI}-001', 1, { documento: 'PROV-{INI}-001', clase: 'Pagar', tercero: 'T{INI} Tercero Carteras', tipo: 'T{INI}', importe: 48.4, vencimiento: '22-12-2026' });
  const imp = azar(40, 900) + [0, 0.5, 0.2][azar(0, 2)];
  const num6 = pad(azar(3, 40), 6);
  return [
    {
      titulo: 'Un efecto que se cobra por remesa',
      efecto: e2,
      eventos: [
        { texto: 'Contabilizas la factura FVN026-000002. Aparece su primer vencimiento en la cartera.', estado: 'PE', porQue: 'El efecto nace pendiente al contabilizar la factura.' },
        { texto: 'Lo agregas a la remesa RM026-000002.', estado: 'PR', porQue: 'Al entrar en una remesa, el efecto queda propuesto.' },
        { texto: 'Ordenas la remesa con «Remesa cobro transferencias, ordenar (s/Tes)».', estado: 'OC', porQue: 'Remesa ordenada: el efecto pasa a ordenado.' },
        { texto: 'Confirmas con «Remesa, confirmar pago por bancos (s/Tes)».', estado: 'CO', porQue: 'El banco ha cobrado: el efecto queda liquidado como cobrado.' },
      ],
    },
    {
      titulo: 'Un cobro directo, sin remesa',
      efecto: e1,
      eventos: [
        { texto: 'Contabilizas la factura FVN026-000001.', estado: 'PE', porQue: 'Nace pendiente.' },
        { texto: 'El cliente te paga y lo registras con una gestión sobre efectos (COBD), que cierras.', estado: 'CO', porQue: 'Al cerrar la gestión, el efecto pasa directamente a cobrado: no hay remesa por medio.' },
      ],
    },
    {
      titulo: 'Un efecto a pagar',
      efecto: ep,
      eventos: [
        { texto: 'Contabilizas la factura de compra FC026-000001 del proveedor.', estado: 'PE', porQue: 'También los efectos a pagar nacen pendientes.' },
        { texto: 'Pagas al proveedor y liquidas el efecto.', estado: 'PA', porQue: 'En la cartera de pagos, el estado liquidado es Pagado (PA), no Cobrado.' },
      ],
    },
    {
      titulo: 'Variación: el banco lo devuelve',
      efecto: { documento: `FVN026-${num6}`, clase: 'Cobrar', tercero: conIni('T{INI} Tercero Carteras', ini), tipo: 'RC', importe: imp, vencimiento: `${pad(azar(1, 28), 2)}-01-2027` },
      eventos: [
        { texto: 'Contabilizas la factura.', estado: 'PE', porQue: 'Nace pendiente.' },
        { texto: 'Lo metes en una remesa de cobro.', estado: 'PR', porQue: 'En remesa: propuesto.' },
        { texto: 'Ordenas la remesa.', estado: 'OC', porQue: 'Ordenado.' },
        { texto: 'El banco confirma el cobro.', estado: 'CO', porQue: 'Cobrado.' },
        { texto: 'Días después el cliente no tenía fondos y el banco te devuelve el recibo.', estado: 'DV', porQue: 'Un recibo devuelto queda como impagado: Devuelto (DV).' },
      ],
    },
  ];
}

function RondaCartera({ r, sim, ests }: { r: Ronda; sim: Sim; ests: Estado[] }) {
  const [i, setI] = useState(0);
  const [actual, setActual] = useState<string | null>(null);
  const [fallo, setFallo] = useState<{ c: string; n: number } | null>(null);
  const [v, decir] = useVeredicto();
  const [papel, animaPapel] = useAnimate();
  const ev = r.eventos[i];
  const puestos = r.eventos.slice(0, i).map((e) => e.estado);
  const nombre = (c: string) => ests.find((e) => e.codigo === c)?.nombre ?? c;

  const elige = (c: string) => {
    if (!ev || sim.resuelta) return;
    if (c !== ev.estado) {
      setFallo((f) => ({ c, n: (f?.n ?? 0) + 1 }));
      decir(false, `No queda en ${c} (${nombre(c)}). ${c} es esto: ${ests.find((e) => e.codigo === c)?.descripcion ?? ''} Vuelve a leer qué acaba de pasar.`);
      return;
    }
    setFallo(null);
    setActual(c);
    if (!sim.reducido && papel.current)
      // golpe del sello: el papel se hunde y tiembla al caer
      animaPapel(papel.current, { y: [0, 6, -2, 0], rotate: [-1.5, -0.4, -2.2, -1.5], scale: [1, 0.985, 1.005, 1] }, { duration: 0.42, delay: 0.14 });
    decir(true, ev.porQue);
    if (i + 1 >= r.eventos.length) sim.acierto();
    setI((x) => x + 1);
  };

  return (
    <div className="tl-cart">
      <div className="tl-cart-mesa">
        <motion.div ref={papel} className="tl-efecto" initial={sim.reducido ? false : { rotate: -4, y: 20, opacity: 0 }} animate={{ rotate: -1.5, y: 0, opacity: 1 }}>
          <div className="tl-efecto-cab">
            <small>Efecto a {r.efecto.clase.toLowerCase()}</small>
            <b className="tl-mono">{r.efecto.documento}</b>
          </div>
          <dl>
            <div>
              <dt>Tercero</dt>
              <dd>{r.efecto.tercero}</dd>
            </div>
            <div>
              <dt>Tipo</dt>
              <dd>{r.efecto.tipo}</dd>
            </div>
            <div>
              <dt>Vence</dt>
              <dd>{r.efecto.vencimiento}</dd>
            </div>
            <div>
              <dt>Importe</dt>
              <dd className="tl-efecto-imp">{f2(r.efecto.importe)} €</dd>
            </div>
          </dl>
          <AnimatePresence mode="popLayout">
            {actual && (
              <motion.div
                key={actual}
                className="tl-estampa"
                style={{ color: COLOR[actual] ?? 'var(--ink)' }}
                initial={sim.reducido ? { opacity: 0 } : { scale: 3.2, opacity: 0, rotate: -32, y: -30 }}
                animate={{ scale: 1, opacity: 1, rotate: -12, y: 0 }}
                exit={sim.reducido ? { opacity: 0 } : { opacity: 0, scale: 0.5, x: -60, y: 70, rotate: -6 }}
                transition={sim.reducido ? { duration: 0.2 } : { type: 'spring', stiffness: 520, damping: 20, mass: 0.9 }}
              >
                <b>{actual}</b>
                <span>{nombre(actual)}</span>
              </motion.div>
            )}
          </AnimatePresence>
          <div className="tlb-hist-sellos" aria-label="Sellos que lleva el efecto">
            <small>Sellos que lleva</small>
            {puestos.length === 0 && <span className="small muted">Aún ninguno.</span>}
            {puestos.map((c, k) => (
              <span key={k} style={{ display: 'contents' }}>
                {k > 0 && (
                  <span className="tlb-mini-flecha" aria-hidden="true">
                    <Icon name="flecha" size={14} />
                  </span>
                )}
                <motion.span
                  className="tlb-mini-sello"
                  style={{ ['--c' as string]: COLOR[c] ?? 'var(--ink)' }}
                  title={nombre(c)}
                  initial={sim.reducido ? false : { scale: 0, opacity: 0, x: 40, y: -60 }}
                  animate={{ scale: 1, opacity: 1, x: 0, y: 0 }}
                  transition={{ type: 'spring', stiffness: 300, damping: 20, delay: 0.1 }}
                >
                  {c}
                </motion.span>
              </span>
            ))}
          </div>
        </motion.div>
        <ol className="tl-cart-hist">
          {r.eventos.slice(0, i + 1).map((e, k) => (
            <motion.li key={k} initial={sim.reducido ? false : { opacity: 0, x: 16 }} animate={{ opacity: 1, x: 0 }} className={k < i ? 'hecho' : 'ahora'}>
              <span className={`tl-cart-hist-n ${k < i ? 'tlb-cart-n' : ''}`} style={k < i ? { background: COLOR[e.estado] ?? 'var(--ink)' } : undefined}>
                {k < i ? e.estado : '?'}
              </span>
              {e.texto}
            </motion.li>
          ))}
        </ol>
      </div>
      {ev ? (
        <>
          <p className="tl-pregunta">¿En qué estado queda el efecto?</p>
          <div className="tl-sellos tlb-sellos" role="group" aria-label="Estados del efecto">
            {ests.map((e) => (
              <motion.button
                key={`${e.codigo}-${fallo?.c === e.codigo ? fallo.n : 0}`}
                className={`tl-sello-btn ${fallo?.c === e.codigo ? 'mal' : ''}`}
                style={{ ['--c' as string]: COLOR[e.codigo] ?? 'var(--ink)' }}
                onClick={() => elige(e.codigo)}
                whileTap={{ scale: 0.92, y: 3 }}
                animate={fallo?.c === e.codigo && !sim.reducido ? { x: [0, -8, 7, -5, 3, 0] } : { x: 0 }}
              >
                <b>{e.codigo}</b>
                <small>{e.nombre}</small>
              </motion.button>
            ))}
          </div>
        </>
      ) : null}
      <MensajeVeredicto v={v} />
    </div>
  );
}

export default function SimCartera() {
  const ini = useIni();
  const sim = useSim('cartera', 4);
  const ests = useMemo(() => estados(), []);
  const rondas = useMemo(() => construirRondas(ini), [ini, sim.partida]); // eslint-disable-line react-hooks/exhaustive-deps
  const r = rondas[sim.ronda] ?? rondas[0];
  return (
    <Marco
      sim={sim}
      titulo="Sigue el efecto"
      color="#2a9c83"
      concepto={
        <>
          <p>
            Cada vencimiento de una factura es un <b>efecto</b> en la cartera: un papel que dice quién paga, cuánto y cuándo. Nace <b>pendiente (PE)</b> al contabilizar la factura.
          </p>
          <p>Según lo que haces con él (meterlo en una remesa, ordenarla, confirmar el cobro, pagarlo) cambia de estado. Si el banco lo devuelve, queda como impagado.</p>
        </>
      }
      enunciado={
        <>
          <h3>{r.titulo}</h3>
          <p>Lee cada cosa que pasa y pon el sello del estado en que queda el efecto.</p>
        </>
      }
    >
      <RondaCartera key={`${sim.partida}-${sim.ronda}`} r={r} sim={sim} ests={ests} />
    </Marco>
  );
}
