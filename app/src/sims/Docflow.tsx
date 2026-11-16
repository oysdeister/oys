import { useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import { Icon } from '../components/Icon';
import { Marco, MensajeVeredicto, azar, datosSim, esObj, f2, lista, num, pad, sacude, txt, useSim, useVeredicto, type Sim } from './kit';

interface LineaAs {
  id: string;
  cuenta: string;
  nombre: string;
  lado: 'D' | 'H';
  importe: number;
}
interface Nodo {
  id: string;
  tipo: string;
  codigo: string;
  estado: string;
  importe: number | null;
  lineas?: LineaAs[];
  /** grupo del círculo de arriba (Pedidos compras, Suministros…) */
  grupo?: string;
  /** documento desde el que se abre el Docflow (borde naranja) */
  abierto?: boolean;
}
interface Pregunta {
  q: string;
  resp: string[];
  bien: string;
  pista: string;
}
interface Ronda {
  titulo: string;
  texto: string;
  nodos: Nodo[];
  preguntas: Pregunta[];
}

const NOMBRES: Record<string, string> = {
  '40000': 'Proveedores (euros)',
  '47200': 'Hacienda Pública, IVA',
  '60000': 'Compras de mercancías',
  '40090': 'Proveedores, facturas pendientes de recibir o de formalizar',
  '430': 'Clientes',
  '470': 'IVA repercutido',
  '700': 'Ventas',
};

function asientoCompras(prov: string, base: number, iva: number): LineaAs[] {
  return [
    { id: 'l-400', cuenta: prov, nombre: NOMBRES['40000'], lado: 'H', importe: Math.round((base + iva) * 100) / 100 },
    { id: 'l-472', cuenta: '47200', nombre: NOMBRES['47200'], lado: 'D', importe: iva },
    { id: 'l-600d', cuenta: '60000', nombre: NOMBRES['60000'], lado: 'D', importe: base },
    { id: 'l-4009', cuenta: '40090', nombre: NOMBRES['40090'], lado: 'D', importe: base },
    { id: 'l-600h', cuenta: '60000', nombre: NOMBRES['60000'], lado: 'H', importe: base },
  ];
}

/** Lee «430 Debe 133,10 / 470 Haber 23,10 / 700 Haber 110,00» */
function lineasDeTexto(s: string): LineaAs[] {
  const r: LineaAs[] = [];
  for (const m of s.matchAll(/(\d{3,5})\s+(Debe|Haber)\s+([\d.]*\d,\d{2})/g)) {
    r.push({ id: `l-${m[1]}`, cuenta: m[1], nombre: NOMBRES[m[1]] ?? '', lado: m[2] === 'Debe' ? 'D' : 'H', importe: Number(m[3].replace(/\./g, '').replace(',', '.')) });
  }
  return r;
}

function construirRondas(): Ronda[] {
  // 1 · Compras: 0PC000003 → 0AC000011 → 0FC000009
  const compras: Nodo[] = [
    { id: 'ped', tipo: 'Pedido de compras', codigo: '0PC000003', estado: 'Servido', importe: 40, grupo: 'Pedidos compras' },
    { id: 'alb', tipo: 'Albarán de compras', codigo: '0AC000011', estado: 'Facturado', importe: 40, grupo: 'Suministros', abierto: true },
    { id: 'fac', tipo: 'Factura de compras', codigo: '0FC000009', estado: 'Contabilizada', importe: 48.4, grupo: 'Facturas compras' },
    { id: 'asi', tipo: 'Asiento contable', codigo: 'Diario DC', estado: 'Cuadrado', importe: 88.4, lineas: asientoCompras('40000.00010', 40, 8.4) },
  ];
  // 2 · Ventas: datos de ventas.json
  const dv = lista(datosSim('ventas').docflow).filter(esObj);
  const ids = ['ofe', 'ped', 'alb', 'fac', 'asi'];
  let ventas: Nodo[] = dv.slice(0, 5).map((d, i) => {
    const estado = txt(d.estado);
    return {
      id: ids[i] ?? `n${i}`,
      tipo: txt(d.documento),
      codigo: txt(d.codigo) || `Diario ${txt(d.tipologia, 'DV')}`,
      estado: estado.split(' (')[0] + (/sin contabilizar/.test(estado) ? ' · sin contabilizar' : ''),
      importe: typeof d.importe === 'number' ? num(d.importe) : null,
      lineas: i === 4 ? lineasDeTexto(estado) : undefined,
      grupo: ['Ofertas ventas', 'Pedidos ventas', 'Albaranes ventas', 'Facturas ventas'][i],
      abierto: i === 3,
    };
  });
  if (ventas.length < 5 || !ventas[4].lineas?.length)
    ventas = [
      { id: 'ofe', tipo: 'Oferta', codigo: '0OV000001', estado: 'Validada', importe: 110 },
      { id: 'ped', tipo: 'Pedido', codigo: '0PV000002', estado: 'Servido o Facturado', importe: 110 },
      { id: 'alb', tipo: 'Albarán', codigo: '0AV000002', estado: 'Facturado · sin contabilizar', importe: 110 },
      { id: 'fac', tipo: 'Factura', codigo: '0FV000002', estado: 'Contabilizada', importe: 133.1 },
      { id: 'asi', tipo: 'Asiento', codigo: 'Diario DV', estado: 'Debe = Haber', importe: 133.1, lineas: lineasDeTexto('430 Debe 133,10 / 470 Haber 23,10 / 700 Haber 110,00') },
    ];
  const l430 = ventas[4].lineas!.find((l) => l.cuenta.startsWith('43'))?.id ?? 'l-430';
  const l470 = ventas[4].lineas!.find((l) => l.cuenta.startsWith('47'))?.id ?? 'l-470';

  // 3 · Variación de compras
  const n = azar(12, 90);
  const cant = azar(2, 20);
  const precio = azar(3, 40) + [0, 0.5, 0.25][azar(0, 2)];
  const base = Math.round(cant * precio * 100) / 100;
  const iva = Math.round(base * 21) / 100;
  const prov = `40000.${pad(azar(11, 99), 5)}`;
  const vNodos: Nodo[] = [
    { id: 'ped', tipo: 'Pedido de compras', codigo: `0PC${pad(n, 6)}`, estado: 'Servido', importe: base, grupo: 'Pedidos compras' },
    { id: 'alb', tipo: 'Albarán de compras', codigo: `0AC${pad(n + azar(3, 9), 6)}`, estado: 'Facturado', importe: base, grupo: 'Suministros' },
    { id: 'fac', tipo: 'Factura de compras', codigo: `0FC${pad(n + azar(1, 5), 6)}`, estado: 'Contabilizada', importe: Math.round((base + iva) * 100) / 100, grupo: 'Facturas compras', abierto: true },
    { id: 'asi', tipo: 'Asiento contable', codigo: 'Diario DC', estado: 'Cuadrado', importe: Math.round((base * 2 + iva) * 100) / 100, lineas: asientoCompras(prov, base, iva) },
  ];

  return [
    {
      titulo: 'Docflow de una compra',
      texto: 'El pedido 0PC000003 se sirvió con el albarán 0AC000011, y de ahí salió la factura 0FC000009. Contesta tocando el diagrama.',
      nodos: compras,
      preguntas: [
        { q: '¿Qué albarán originó la factura 0FC000009?', resp: ['alb'], bien: 'El albarán 0AC000011: la factura se generó desde él.', pista: 'Busca el documento que está justo antes de la factura.' },
        { q: '¿Qué estado tiene el pedido? Toca su estado.', resp: ['ped.estado'], bien: 'Servido: el albarán ya ha recibido toda la mercancía del pedido.', pista: 'El estado es la etiqueta de color dentro de la tarjeta del pedido.' },
        { q: '¿Cuánto se debe al proveedor? Toca la línea del asiento.', resp: ['asi.l-400'], bien: '48,40 al Haber de la cuenta del proveedor 40000.00010: es la deuda.', pista: 'Lo que debes va al Haber, en una cuenta 400.' },
        { q: '¿Dónde está el IVA soportado?', resp: ['asi.l-472'], bien: '47200 al Debe: 8,40, el 21 % de 40,00.', pista: 'Es la cuenta 472.' },
        {
          q: 'Toca las dos líneas que deshacen el apunte que hizo el albarán.',
          resp: ['asi.l-4009', 'asi.l-600h'],
          bien: 'El albarán anotó 60000 al Debe y 40090 al Haber. Al facturar, 40090 al Debe y 60000 al Haber lo anulan.',
          pista: 'Son la 40090 al Debe y la otra 60000, la que va al Haber.',
        },
      ],
    },
    {
      titulo: 'Docflow de una venta',
      texto: 'La oferta 0OV000001 acabó en la factura 0FV000002. Lee el diagrama y contesta.',
      nodos: ventas,
      preguntas: [
        { q: `¿Qué oferta originó el pedido ${ventas[1].codigo}?`, resp: ['ofe'], bien: `La oferta ${ventas[0].codigo}: al pasarla a pedido, su línea queda adjudicada.`, pista: 'Es el primer documento de la cadena.' },
        { q: '¿Qué documento está facturado pero sin contabilizar?', resp: ['alb'], bien: 'El albarán: se facturó, pero lo que se contabiliza es la factura.', pista: 'Lee los estados de cada tarjeta.' },
        { q: '¿Cuánto te debe el cliente, IVA incluido? Toca la línea del asiento.', resp: [`asi.${l430}`], bien: 'La 430 al Debe: es el derecho de cobro sobre el cliente.', pista: 'El cliente es la cuenta 430.' },
        { q: '¿Qué línea es el IVA que repercutes?', resp: [`asi.${l470}`], bien: 'La 470 al Haber: el IVA que cobras y luego pagas a Hacienda.', pista: 'Es la cuenta que empieza por 47.' },
      ],
    },
    {
      titulo: 'Variación: otra compra',
      texto: `Pedido ${vNodos[0].codigo}: ${cant} unidades a ${f2(precio)}. Contesta sobre el diagrama.`,
      nodos: vNodos,
      preguntas: [
        { q: '¿Qué estado tiene el albarán?', resp: ['alb.estado'], bien: 'Facturado: ya tiene factura.', pista: 'Toca la etiqueta de estado de la tarjeta del albarán.' },
        { q: '¿Cuánto se debe al proveedor?', resp: ['asi.l-400'], bien: `${f2(base + iva)} al Haber de ${prov}.`, pista: 'Línea al Haber de la cuenta 400.' },
        { q: `¿Qué documento originó la factura ${vNodos[2].codigo}?`, resp: ['alb'], bien: 'El albarán, con «Acciones › Generar factura».', pista: 'El documento anterior a la factura.' },
        { q: '¿Qué importe es la base imponible? Toca la línea que la recoge como compra.', resp: ['asi.l-600d'], bien: `60000 al Debe: ${f2(base)}.`, pista: 'Compras de mercancías al Debe.' },
      ],
    },
  ];
}

/* ---------- Diagrama ---------- */

function Diagrama({ nodos, toca, marcados, error, reducido }: { nodos: Nodo[]; toca: (id: string) => void; marcados: string[]; error: { id: string; n: number } | null; reducido: boolean }) {
  const cls = (id: string) => `${marcados.includes(id) ? 'ok' : ''} ${error?.id === id ? 'mal' : ''}`;
  const anim = (id: string) => (error?.id === id && !reducido ? sacude : { x: 0 });
  const grupos = nodos.filter((n) => n.grupo);
  return (
    <div className="tl-df-escena">
      {grupos.length > 0 && (
        <div className="tl-df-circulos" aria-hidden="true">
          {grupos.map((g, i) => (
            <motion.div key={g.id} className="tl-df-circ" initial={reducido ? false : { scale: 0 }} animate={{ scale: 1 }} transition={{ delay: 0.05 + i * 0.1, type: 'spring', stiffness: 260, damping: 15 }}>
              <span>1</span>
              <small>{g.grupo}</small>
            </motion.div>
          ))}
        </div>
      )}
    <div className="tl-df" role="group" aria-label="Docflow">
      {nodos.map((nd, i) => (
        <div key={nd.id} className={`tl-df-paso ${nd.lineas ? 'asiento' : ''}`}>
          {i > 0 && (
            <span className="tl-df-link" aria-hidden="true">
              <svg viewBox="0 0 60 24" preserveAspectRatio="none">
                <path d="M2 12 H52" className="tl-df-link-linea" />
                <circle cx="2" cy="12" r="3.5" className="tl-df-pulso" style={{ animationDelay: `${i * 0.3}s` }} />
                <path d="M46 5 L56 12 L46 19" fill="none" strokeWidth="2.5" stroke="var(--arc-deep)" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </span>
          )}
          <motion.div
            className={`tl-df-nodo ${cls(nd.id)} ${nd.abierto ? 'abierto' : ''}`}
            initial={reducido ? false : { opacity: 0, y: 20, rotateX: -40 }}
            animate={{ opacity: 1, y: 0, rotateX: 0 }}
            transition={{ delay: 0.1 + i * 0.12, type: 'spring', stiffness: 140, damping: 16 }}
          >
            {nd.abierto && <span className="tl-df-aqui">Abierto desde aquí</span>}
            <motion.button key={`${nd.id}-${error?.id === nd.id ? error.n : 0}`} className="tl-df-cab" onClick={() => toca(nd.id)} animate={anim(nd.id)}>
              <small>{nd.tipo}</small>
              <b className="tl-mono">{nd.codigo}</b>
            </motion.button>
            <div className="tl-df-meta">
              <motion.button key={`${nd.id}e-${error?.id === `${nd.id}.estado` ? error.n : 0}`} className={`tl-df-estado ${cls(`${nd.id}.estado`)}`} onClick={() => toca(`${nd.id}.estado`)} animate={anim(`${nd.id}.estado`)}>
                {nd.estado}
              </motion.button>
              {nd.importe !== null && !nd.lineas && <span className="tl-df-imp">{f2(nd.importe)} €</span>}
            </div>
            {nd.lineas && (
              <div className="tl-df-lineas">
                {nd.lineas.map((l) => {
                  const id = `${nd.id}.${l.id}`;
                  return (
                    <motion.button key={`${id}-${error?.id === id ? error.n : 0}`} className={`tl-df-linea ${cls(id)}`} onClick={() => toca(id)} animate={anim(id)}>
                      <span className="tl-mono">{l.cuenta}</span>
                      <span className="tl-df-lnom">{l.nombre}</span>
                      <span className={`tl-df-lado ${l.lado}`}>{l.lado === 'D' ? 'Debe' : 'Haber'}</span>
                      <b>{f2(l.importe)}</b>
                    </motion.button>
                  );
                })}
              </div>
            )}
          </motion.div>
        </div>
      ))}
    </div>
    </div>
  );
}

function RondaDocflow({ r, sim }: { r: Ronda; sim: Sim }) {
  const [i, setI] = useState(0);
  const [elegidos, setElegidos] = useState<string[]>([]);
  const [hechos, setHechos] = useState<string[]>([]);
  const [error, setError] = useState<{ id: string; n: number } | null>(null);
  const [v, decir] = useVeredicto();
  const p = r.preguntas[i];

  const toca = (id: string) => {
    if (!p || sim.resuelta) return;
    if (!p.resp.includes(id)) {
      setError((e) => ({ id, n: (e?.n ?? 0) + 1 }));
      decir(false, `No es esa. ${p.pista}`);
      return;
    }
    setError(null);
    const nuevos = [...new Set([...elegidos, id])];
    if (nuevos.length < p.resp.length) {
      setElegidos(nuevos);
      decir(true, `Bien, una de ${p.resp.length}. Te falta otra.`);
      return;
    }
    setElegidos([]);
    setHechos((h) => [...h, ...p.resp]);
    decir(true, p.bien);
    if (i + 1 >= r.preguntas.length) sim.acierto();
    setI((x) => x + 1);
  };

  return (
    <div className="tl-dfw">
      <div className="tl-df-preg" aria-live="polite">
        {p ? (
          <>
            <span className="tl-df-preg-n">
              {i + 1}/{r.preguntas.length}
            </span>
            <motion.b key={i} initial={sim.reducido ? false : { opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}>
              {p.q}
            </motion.b>
          </>
        ) : (
          <>
            <Icon name="check" size={20} /> <b>Has leído todo el Docflow.</b>
          </>
        )}
      </div>
      <Diagrama nodos={r.nodos} toca={toca} marcados={[...hechos, ...elegidos]} error={error} reducido={sim.reducido} />
      <MensajeVeredicto v={v} />
    </div>
  );
}

export default function SimDocflow() {
  const sim = useSim('docflow', 3);
  const rondas = useMemo(() => construirRondas(), [sim.partida]); // eslint-disable-line react-hooks/exhaustive-deps
  const r = rondas[sim.ronda] ?? rondas[0];
  return (
    <Marco
      sim={sim}
      titulo="Lee el Docflow"
      color="#3fa7c9"
      concepto={
        <>
          <p>
            El <b>Docflow</b> es el mapa de una operación: enseña qué documento salió de cuál, con su número, su estado y su importe. Lo abres desde la ficha del albarán o de la factura, en
            el menú que hay junto a la estrella.
          </p>
          <p>Sirve para contestar rápido lo que te preguntará el cliente: de dónde viene esta factura, si ya está contabilizada, cuánto se debe.</p>
        </>
      }
      enunciado={
        <>
          <h3>{r.titulo}</h3>
          <p>{r.texto}</p>
        </>
      }
    >
      <RondaDocflow key={`${sim.partida}-${sim.ronda}`} r={r} sim={sim} />
    </Marco>
  );
}
